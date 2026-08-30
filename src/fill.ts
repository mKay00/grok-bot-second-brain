import { cpSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import path from "node:path";
import { headPlanVersion } from "./migrations.ts";
import { interpolate, readTemplate } from "./plan-template.ts";

export type OffBoxCopy =
  | { kind: "skip" }
  | { kind: "folder" }
  | { kind: "git"; remoteUrl: string }
  | { kind: "cloud"; product: string };
export type Connectors =
  | { kind: "none" }
  | { kind: "todoist" }
  | { kind: "notion-class"; product: string };
export type TaskBackend = "markdown" | "todoist" | "notion-class";
export type GtdOption = "off" | "hybrid" | "full";
export type LadderRung = "jsonl" | "sqlite" | "graphiti";
export type GraphitiStore = "neo4j" | "falkordb";
export type SourceWriteBack = "tag" | "archive" | "leave" | "delete";

export type ExtraInbox = {
  name: string;
  writeBack: SourceWriteBack;
};

export type Answers = {
  displayName: string;
  path: string;
  offBoxCopy: OffBoxCopy;
  connectors: Connectors;
  taskBackend: TaskBackend;
  gtdOption: GtdOption;
  mailInReview: boolean;
  extraInboxes: readonly ExtraInbox[];
  ladderRung: LadderRung;
  graphitiStore: GraphitiStore;
};

export const WORKED_EXAMPLE = {
  displayName: "Example",
  path: "/workspace/second-brain/",
  offBoxCopy: { kind: "skip" },
  connectors: { kind: "none" },
  taskBackend: "markdown",
  gtdOption: "off",
  mailInReview: false,
  extraInboxes: [],
  ladderRung: "jsonl",
  graphitiStore: "neo4j",
} as const satisfies Answers;

export function fill(args: {
  answers: Answers;
  planPath: string;
  templateDir: string;
  destDir: string;
  migrationsDir?: string;
}): { setupPrompt: string } {
  assertLiveBackend({ answers: args.answers });
  const plan = readFileSync(args.planPath, "utf8");
  const setupPrompt = renderSetupPrompt({ plan, answers: args.answers });
  copyTree({
    answers: args.answers,
    templateDir: args.templateDir,
    destDir: args.destDir,
  });
  const migrationsDir =
    args.migrationsDir ?? path.join(path.dirname(args.planPath), "migrations");
  writeInstallMetadata({
    answers: args.answers,
    destDir: args.destDir,
    planVersion: headPlanVersion(migrationsDir),
  });
  return { setupPrompt };
}

export function writeInstallMetadata(args: {
  answers: Answers;
  destDir: string;
  planVersion: number;
  promptsVersion?: number;
}): void {
  const installDir = path.join(args.destDir, "install");
  mkdirSync(installDir, { recursive: true });
  writeFileSync(`${installDir}/answers.json`, `${JSON.stringify(args.answers, null, 2)}\n`);
  writeFileSync(`${installDir}/plan-version`, `${args.planVersion}\n`);
  writeFileSync(
    `${installDir}/prompts-version`,
    `${args.promptsVersion ?? args.planVersion}\n`,
  );
}

function assertLiveBackend(args: { answers: Answers }): void {
  const { answers } = args;
  if (answers.taskBackend === "todoist" && answers.connectors.kind !== "todoist") {
    throw new Error("Todoist is not a live backend unless that connector will be installed");
  }
  if (answers.taskBackend === "notion-class" && answers.connectors.kind !== "notion-class") {
    throw new Error("Notion-class is not a live backend unless that connector will be installed");
  }
  if (answers.connectors.kind === "notion-class" && answers.connectors.product.trim() === "") {
    throw new Error("Notion-class asks for a product name");
  }
}

function renderSetupPrompt(args: { plan: string; answers: Answers }): string {
  const bots = renderBotDescriptions(args);
  const shared = readTemplate({ plan: args.plan, name: "shared-preamble" });
  const slots = slotsFor({ answers: args.answers, sharedPreamble: shared });
  return interpolate({
    text: readTemplate({ plan: args.plan, name: "setup-prompt" }),
    slots: {
      ...slots,
      bot_conductor: bots.conductor,
      bot_capture: bots.capture,
      bot_memory: bots.memory,
      bot_ops: bots.ops,
      bot_research: bots.research,
    },
  });
}

export function renderBotDescriptions(args: { plan: string; answers: Answers }): {
  conductor: string;
  capture: string;
  memory: string;
  ops: string;
  research: string;
} {
  const shared = readTemplate({ plan: args.plan, name: "shared-preamble" });
  const slots = slotsFor({ answers: args.answers, sharedPreamble: shared });
  return {
    conductor: interpolate({
      text: readTemplate({ plan: args.plan, name: "bot-conductor" }),
      slots,
    }),
    capture: interpolate({
      text: readTemplate({ plan: args.plan, name: "bot-capture" }),
      slots,
    }),
    memory: interpolate({
      text: readTemplate({ plan: args.plan, name: "bot-memory" }),
      slots,
    }),
    ops: interpolate({
      text: readTemplate({ plan: args.plan, name: "bot-ops" }),
      slots,
    }),
    research: interpolate({
      text: readTemplate({ plan: args.plan, name: "bot-research" }),
      slots,
    }),
  };
}

function slotsFor(args: { answers: Answers; sharedPreamble: string }): Record<string, string> {
  const { answers } = args;
  return {
    shared_preamble: args.sharedPreamble,
    display_name: answers.displayName,
    path: answers.path,
    conductor_gtd: conductorGtd(answers),
    mail_in_review_step: mailInReviewStep(answers),
    conductor_copy: conductorCopy(answers.offBoxCopy),
    capture_sources: captureSources(answers.extraInboxes),
    capture_constraints: [captureConstraints(answers.extraInboxes), twoMinuteRule(answers.gtdOption)]
      .filter((part) => part !== "")
      .join(" "),
    capture_deliverable: captureDeliverable(answers.extraInboxes),
    memory_copy: memoryCopy(answers.offBoxCopy),
    memory_inflight: memoryInflight(answers.gtdOption),
    memory_deliverable: memoryDeliverable(answers.offBoxCopy),
    memory_review: memoryReview(answers.offBoxCopy),
    gtd_contract: gtdContract(answers.gtdOption),
    task_api_verbs: taskApiVerbs(answers.gtdOption),
    ops_deliverable: opsDeliverable(answers.gtdOption),
    gtd_drop: gtdDrop(answers),
    task_store_copy_clause: taskStoreCopyClause(answers.taskBackend),
    task_store_keep: taskStoreKeep(answers),
    task_store_binding: taskStoreBinding(answers),
    connectors_step: connectorsStep(answers.connectors),
    ladder_step: ladderStep(answers),
    routines_step: routinesStep({ gtdOption: answers.gtdOption, offBoxCopy: answers.offBoxCopy }),
    off_box_step: offBoxStep(answers.offBoxCopy),
  };
}

function conductorCopy(offBoxCopy: OffBoxCopy): string {
  switch (offBoxCopy.kind) {
    case "skip":
      return "Off-box copy is skip: there is no copy to guide.";
    case "folder":
      return "Guides the first off-box copy in chat. The human copies on their own machine.";
    case "git":
      return `Guides the first off-box copy in chat. Memory pushes to ${offBoxCopy.remoteUrl} after approval.`;
    case "cloud":
      return `Guides the first off-box copy in chat. Memory uploads to ${offBoxCopy.product} after approval.`;
    default: {
      const _exhaustive: never = offBoxCopy;
      return _exhaustive;
    }
  }
}

function conductorGtd(answers: Pick<Answers, "gtdOption" | "mailInReview">): string {
  const unusedDecay =
    "Also list `current` claims unused 30 days and assign Memory to propose `decayed`; Memory alone may `set_status`.";
  switch (answers.gtdOption) {
    case "off":
      return "GTD is off: what's in flight only.";
    case "hybrid":
      return withMailInReview({
        review: `Conductor is the short weekly review: collect, inbox to zero, next actions, GTD projects, and the calendar already in front of the human. ${unusedDecay}`,
        mailInReview: answers.mailInReview,
      });
    case "full":
      return withMailInReview({
        review: `Conductor is the official eleven-step weekly review. Get Clear: collect loose materials, inbox to zero, empty your head. Get Current: next actions and contexts, past calendar, upcoming calendar, Waiting For, GTD projects, relevant checklists. Get Creative: Someday/Maybe, then be creative. Assign Capture to get the vault inbox to zero. Memory refreshes in-flight from the GTD lists. ${unusedDecay}`,
        mailInReview: answers.mailInReview,
      });
    default: {
      const _exhaustive: never = answers.gtdOption;
      return _exhaustive;
    }
  }
}

function withMailInReview(args: { review: string; mailInReview: boolean }): string {
  if (!args.mailInReview) {
    return args.review;
  }
  return `${args.review} Empty mail by hand: archive, not delete.`;
}

function mailInReviewStep(answers: Pick<Answers, "gtdOption" | "mailInReview">): string {
  if (answers.gtdOption === "off" || !answers.mailInReview) {
    return "";
  }
  return "Mail-in-review is on. Empty mail by hand during the weekly review: archive, not delete. This takes mail out of mail, not the vault inbox. Do not enable it if mail is still a holding pen. No Gmail API. No bot with mail access.";
}

function twoMinuteRule(gtdOption: GtdOption): string {
  switch (gtdOption) {
    case "full":
      return "The 2-minute rule is a clarify instruction: if an action takes under two minutes, offer it as do-now.";
    case "off":
    case "hybrid":
      return "";
    default: {
      const _exhaustive: never = gtdOption;
      return _exhaustive;
    }
  }
}

function captureSources(extraInboxes: readonly ExtraInbox[]): string {
  if (extraInboxes.length === 0) {
    return "No extra inboxes named at setup.";
  }
  return `Extra inboxes: ${extraInboxes.map((inbox) => inbox.name).join(", ")}.`;
}

function captureConstraints(extraInboxes: readonly ExtraInbox[]): string {
  if (extraInboxes.length === 0) {
    return "The vault inbox is the only inbox.";
  }
  const bindings = extraInboxes
    .map((inbox) => `${inbox.name}: ${inbox.writeBack}`)
    .join("; ");
  return `Source write-back: ${bindings}. Write-back runs when the vault-inbox line is removed after the fork, not at copy.`;
}

function captureDeliverable(extraInboxes: readonly ExtraInbox[]): string {
  if (extraInboxes.length === 0) {
    return "No source write-back.";
  }
  return "Copies from an extra inbox include `writeback:<tag|archive|leave|delete>` in the line. Apply that source write-back when the line is removed.";
}

function memoryInflight(gtdOption: GtdOption): string {
  switch (gtdOption) {
    case "off":
      return "At task start, replace In-flight from `list_open`.";
    case "hybrid":
      return "At task start, replace In-flight from `list_open` and `list_projects`.";
    case "full":
      return "At task start, replace In-flight from `list_open`, `list_projects`, `list_waiting`, and `list_someday`.";
    default: {
      const _exhaustive: never = gtdOption;
      return _exhaustive;
    }
  }
}

function gtdContract(gtdOption: GtdOption): string {
  const base =
    "A GTD project is an outcome in the task backend, not a PARA folder. No Todoist-to-markdown sync. Switching stores later is a human move. No export. No cutover job.";
  switch (gtdOption) {
    case "full":
      return `${base} Someday is incubate, not a resource.`;
    case "off":
    case "hybrid":
      return base;
    default: {
      const _exhaustive: never = gtdOption;
      return _exhaustive;
    }
  }
}

function memoryCopy(offBoxCopy: OffBoxCopy): string {
  switch (offBoxCopy.kind) {
    case "skip":
      return "Off-box copy method is skip: no standing copy job.";
    case "folder":
      return "Off-box copy method is folder: no standing copy job.";
    case "git":
    case "cloud":
      return "Copy the whole path when this method is on.";
    default: {
      const _exhaustive: never = offBoxCopy;
      return _exhaustive;
    }
  }
}

function memoryReview(offBoxCopy: OffBoxCopy): string {
  switch (offBoxCopy.kind) {
    case "skip":
      return "A later method change is still a stop.";
    case "folder":
      return "The first copy of the path off this computer, and a later method change, are stops.";
    case "git":
      return "The first copy of the path off this computer, and a later method change, are stops. Later git pushes run.";
    case "cloud":
      return "The first copy of the path off this computer, and a later method change, are stops. Later uploads run.";
    default: {
      const _exhaustive: never = offBoxCopy;
      return _exhaustive;
    }
  }
}

function memoryDeliverable(offBoxCopy: OffBoxCopy): string {
  switch (offBoxCopy.kind) {
    case "skip":
      return "No standing copy. Skip accepted the Reset warning.";
    case "folder":
      return "The human copies on their own machine.";
    case "git":
      return `Git push to ${offBoxCopy.remoteUrl} when that method is on.`;
    case "cloud":
      return `Cloud upload to ${offBoxCopy.product} when that method is on.`;
    default: {
      const _exhaustive: never = offBoxCopy;
      return _exhaustive;
    }
  }
}

function taskApiVerbs(gtdOption: GtdOption): string {
  switch (gtdOption) {
    case "off":
      return "`add` and `complete`. `add` may carry an optional due";
    case "hybrid":
      return "`add`, `complete`, and `add_project`. `add` may carry an optional due. An unknown GTD project name on `add` creates that project, then files the next action";
    case "full":
      return "`add`, `complete`, `add_project`, and `set_list`. `add` may carry an optional due and an optional contexts list. An unknown GTD project name on `add` creates that project, then files the next action";
    default: {
      const _exhaustive: never = gtdOption;
      return _exhaustive;
    }
  }
}

function opsDeliverable(gtdOption: GtdOption): string {
  switch (gtdOption) {
    case "off":
      return "`add` / `complete` as asked.";
    case "hybrid":
      return "`add` / `complete` / `add_project` as asked.";
    case "full":
      return "`add` / `complete` / `add_project` / `set_list` as asked.";
    default: {
      const _exhaustive: never = gtdOption;
      return _exhaustive;
    }
  }
}

function taskStoreCopyClause(taskBackend: TaskBackend): string {
  switch (taskBackend) {
    case "markdown":
      return ", and the markdown task store";
    case "todoist":
    case "notion-class":
      return "";
    default: {
      const _exhaustive: never = taskBackend;
      return _exhaustive;
    }
  }
}

function taskStoreKeep(answers: Pick<Answers, "taskBackend" | "connectors">): string {
  switch (answers.taskBackend) {
    case "markdown":
      return "The live store is markdown, so keep `tasks/`.";
    case "todoist":
      return "The live store is Todoist. Omit `tasks/`.";
    case "notion-class":
      return `The live store is ${notionProduct(answers.connectors)}. Omit \`tasks/\`.`;
    default: {
      const _exhaustive: never = answers.taskBackend;
      return _exhaustive;
    }
  }
}

function notionProduct(connectors: Connectors): string {
  if (connectors.kind !== "notion-class") {
    throw new Error("Notion-class asks for a product name");
  }
  return connectors.product;
}

function taskStoreBinding(answers: Answers): string {
  switch (answers.taskBackend) {
    case "markdown":
      return markdownBinding(answers.gtdOption);
    case "todoist":
      return todoistBinding(answers.gtdOption);
    case "notion-class":
      return notionBinding();
    default: {
      const _exhaustive: never = answers.taskBackend;
      return _exhaustive;
    }
  }
}

function markdownBinding(gtdOption: GtdOption): string {
  const row = "A row is a checkbox line with optional `due:YYYY-MM-DD`.";
  switch (gtdOption) {
    case "off":
      return `${row} \`add\` and \`complete\` write the next list. \`list_open\` is not-done items on the next list only.`;
    case "hybrid":
      return `${row} A heading on the next list is a GTD project and must match a line on the projects list. Loose next actions sit above any heading.`;
    case "full":
      return `${row} On full, a row may carry \`#context\` tags. A heading on the next list is a GTD project and must match a line on the projects list. Loose next actions sit above any heading.`;
    default: {
      const _exhaustive: never = gtdOption;
      return _exhaustive;
    }
  }
}

function todoistBinding(gtdOption: GtdOption): string {
  const verbs =
    "`add` and `complete` write tasks in Next. `list_open` is not-done tasks in Next. Inbox is not Next.";
  const join =
    "A GTD project is one task in Projects. A next action is a task in Next. The join is a section on Next whose name matches that outcome. Loose next actions have no section.";
  switch (gtdOption) {
    case "off":
      return `Off uses Next. ${verbs}`;
    case "hybrid":
      return `Hybrid uses Next and Projects. ${verbs} ${join}`;
    case "full":
      return `Full uses Next, Waiting For, Someday, and Projects, four of five Beginner slots. ${verbs} ${join} Contexts are labels on Next. \`set_list\` off Next drops the section.`;
    default: {
      const _exhaustive: never = gtdOption;
      return _exhaustive;
    }
  }
}

function notionBinding(): string {
  return "One tasks database. A list property holds next, waiting, or someday. GTD project and contexts are properties. \`complete\` uses the native done status. Not the vault, not the ledger, not a second store.";
}

function gtdDrop(answers: Answers): string {
  if (answers.taskBackend !== "markdown") {
    return "";
  }
  switch (answers.gtdOption) {
    case "off":
      return "GTD is off. Drop unused GTD list files so the copied tree keeps the next list only.";
    case "hybrid":
      return "GTD is hybrid. Keep next and projects. Drop waiting and someday.";
    case "full":
      return "GTD is full. Keep next, projects, waiting, and someday.";
    default: {
      const _exhaustive: never = answers.gtdOption;
      return _exhaustive;
    }
  }
}

function connectorsStep(connectors: Connectors): string {
  switch (connectors.kind) {
    case "none":
      return "Connectors are none. Do not install a task connector.";
    case "todoist":
      return "Install the Todoist connector in Settings before the bots are created.";
    case "notion-class":
      return `Install the ${connectors.product} connector in Settings before the bots are created.`;
    default: {
      const _exhaustive: never = connectors;
      return _exhaustive;
    }
  }
}

function ladderStep(answers: Pick<Answers, "ladderRung" | "graphitiStore">): string {
  switch (answers.ladderRung) {
    case "jsonl":
      return "Ladder rung is JSONL. Do not stand up Neo4j or FalkorDB.";
    case "sqlite":
      return "Ladder rung is SQLite. Do not stand up Neo4j or FalkorDB.";
    case "graphiti":
      switch (answers.graphitiStore) {
        case "neo4j":
          return "Ladder rung is Graphiti. Stand up Neo4j only now.";
        case "falkordb":
          return "Ladder rung is Graphiti. Stand up FalkorDB only now.";
        default: {
          const _exhaustive: never = answers.graphitiStore;
          return _exhaustive;
        }
      }
    default: {
      const _exhaustive: never = answers.ladderRung;
      return _exhaustive;
    }
  }
}

function routinesStep(args: { gtdOption: GtdOption; offBoxCopy: OffBoxCopy }): string {
  const weekly = args.gtdOption === "off" ? "No weekly-review routine." : "Install the weekly review on Conductor.";
  const decay =
    "Install a monthly Memory decay routine: `current` claims unused 30 days (by `last_used`, or `recorded_at` if never read) are proposed `decayed`. That selection does not record use. Stop for approval before `set_status`.";
  const copy =
    args.offBoxCopy.kind === "git" || args.offBoxCopy.kind === "cloud"
      ? "Install a daily Memory copy routine. It is a no-op if the path has not changed."
      : "No standing copy routine.";
  return `${weekly} ${decay} ${copy}`;
}

function offBoxStep(offBoxCopy: OffBoxCopy): string {
  const pathContract =
    "The copy is the whole path: vault, ledger directory, install metadata, and the markdown task store when that store is live. JSONL and SQLite files under that path are in. A Graphiti store is not. Restore is copy that tree back onto the path. No sync daemon on the VM.";
  switch (offBoxCopy.kind) {
    case "skip":
      return "Off-box copy is skip. Do not copy the path off this computer during setup.";
    case "folder":
      return `Stop. This beat is a review point. After approval, the human copies the path on their own machine. Memory has no standing job.

${pathContract}`;
    case "git":
      return `Stop. This beat is a review point. After approval, Memory pushes the path to ${offBoxCopy.remoteUrl}. Later git pushes run.

${pathContract}`;
    case "cloud":
      return `Stop. This beat is a review point. After approval, Memory uploads the path to ${offBoxCopy.product}. Use a plugin if Settings has one, otherwise the browser. Later uploads run.

${pathContract}`;
    default: {
      const _exhaustive: never = offBoxCopy;
      return _exhaustive;
    }
  }
}

function copyTree(args: { answers: Answers; templateDir: string; destDir: string }): void {
  cpSync(path.join(args.templateDir, "vault"), path.join(args.destDir, "vault"), { recursive: true });
  cpSync(path.join(args.templateDir, "memory"), path.join(args.destDir, "memory"), { recursive: true });
  if (args.answers.taskBackend === "markdown") {
    cpSync(path.join(args.templateDir, "tasks"), path.join(args.destDir, "tasks"), { recursive: true });
    for (const file of unusedTaskFiles(args.answers.gtdOption)) {
      unlinkSync(path.join(args.destDir, "tasks", file));
    }
  }
  writeDisplayName({ displayName: args.answers.displayName, destDir: args.destDir });
}

function unusedTaskFiles(gtdOption: GtdOption): readonly string[] {
  switch (gtdOption) {
    case "off":
      return ["projects.md", "waiting.md", "someday.md"];
    case "hybrid":
      return ["waiting.md", "someday.md"];
    case "full":
      return [];
    default: {
      const _exhaustive: never = gtdOption;
      return _exhaustive;
    }
  }
}

function writeDisplayName(args: { displayName: string; destDir: string }): void {
  const aliasesPath = path.join(args.destDir, "memory", "aliases.csv");
  const lines = readFileSync(aliasesPath, "utf8").replace(/\n$/, "").split("\n");
  const next = lines.map((line, index) => {
    if (index === 0) {
      return line;
    }
    const columns = line.split(",");
    if (columns[1] === "me") {
      return `${args.displayName},me,${columns[2] ?? "person"}`;
    }
    return line;
  });
  writeFileSync(aliasesPath, `${next.join("\n")}\n`);
  const workingPath = path.join(args.destDir, "vault", "working.md");
  const working = readFileSync(workingPath, "utf8");
  const updated = working.replace("# Identity\n\n", `# Identity\n\n${args.displayName}\n\n`);
  if (updated === working) {
    throw new Error("working file is missing an empty Identity section");
  }
  writeFileSync(workingPath, updated);
}
