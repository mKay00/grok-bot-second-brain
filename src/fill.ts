import { cpSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import path from "node:path";

export type OffBoxCopy =
  | { kind: "skip" }
  | { kind: "folder" }
  | { kind: "git"; remoteUrl: string }
  | { kind: "cloud"; product: string };
export type Connectors = "none" | "todoist" | "notion-class";
export type TaskBackend = "markdown" | "todoist" | "notion-class";
export type GtdOption = "off" | "hybrid" | "full";
export type LadderRung = "jsonl" | "sqlite" | "graphiti";
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
  extraInboxes: readonly ExtraInbox[];
  ladderRung: LadderRung;
};

export const WORKED_EXAMPLE = {
  displayName: "Example",
  path: "/workspace/second-brain/",
  offBoxCopy: { kind: "skip" },
  connectors: "none",
  taskBackend: "markdown",
  gtdOption: "off",
  extraInboxes: [],
  ladderRung: "jsonl",
} as const satisfies Answers;

export function fill(args: {
  answers: Answers;
  planPath: string;
  templateDir: string;
  destDir: string;
}): { setupPrompt: string } {
  const plan = readFileSync(args.planPath, "utf8");
  const setupPrompt = renderSetupPrompt({ plan, answers: args.answers });
  copyTree({
    answers: args.answers,
    templateDir: args.templateDir,
    destDir: args.destDir,
  });
  return { setupPrompt };
}

function renderSetupPrompt(args: { plan: string; answers: Answers }): string {
  const shared = readTemplate({ plan: args.plan, name: "shared-preamble" });
  const slots = slotsFor({ answers: args.answers, sharedPreamble: shared });
  const bots = {
    bot_conductor: interpolate({
      text: readTemplate({ plan: args.plan, name: "bot-conductor" }),
      slots,
    }),
    bot_capture: interpolate({
      text: readTemplate({ plan: args.plan, name: "bot-capture" }),
      slots,
    }),
    bot_memory: interpolate({
      text: readTemplate({ plan: args.plan, name: "bot-memory" }),
      slots,
    }),
    bot_ops: interpolate({
      text: readTemplate({ plan: args.plan, name: "bot-ops" }),
      slots,
    }),
    bot_research: interpolate({
      text: readTemplate({ plan: args.plan, name: "bot-research" }),
      slots,
    }),
  };
  return interpolate({
    text: readTemplate({ plan: args.plan, name: "setup-prompt" }),
    slots: { ...slots, ...bots },
  });
}

function slotsFor(args: { answers: Answers; sharedPreamble: string }): Record<string, string> {
  const { answers } = args;
  return {
    shared_preamble: args.sharedPreamble,
    display_name: answers.displayName,
    path: answers.path,
    conductor_gtd: conductorGtd(answers.gtdOption),
    conductor_copy: conductorCopy(answers.offBoxCopy),
    capture_sources: captureSources(answers.extraInboxes),
    capture_constraints: captureConstraints(answers.extraInboxes),
    capture_deliverable: captureDeliverable(answers.extraInboxes),
    memory_copy: memoryCopy(answers.offBoxCopy),
    memory_deliverable: memoryDeliverable(answers.offBoxCopy),
    memory_review: memoryReview(answers.offBoxCopy),
    task_api_verbs: taskApiVerbs(answers.gtdOption),
    ops_deliverable: opsDeliverable(answers.gtdOption),
    gtd_drop: gtdDrop(answers),
    connectors_step: connectorsStep(answers.connectors),
    ladder_step: ladderStep(answers.ladderRung),
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

function conductorGtd(gtdOption: GtdOption): string {
  switch (gtdOption) {
    case "off":
      return "GTD is off: what's in flight only.";
    case "hybrid":
    case "full":
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
  return "Copies from an extra inbox include `writeback:` in the line. Apply that source write-back when the line is removed.";
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
      return "`add`, `complete`, and `list_open`. `add` may carry an optional due";
    case "hybrid":
      return "`add`, `complete`, `list_open`, `list_projects`, and `add_project`";
    case "full":
      return "`add`, `complete`, `list_open`, `list_projects`, `add_project`, `list_waiting`, `list_someday`, and `set_list`";
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
    case "full":
      return "`add` / `complete` / `add_project` / `set_list` as asked.";
    default: {
      const _exhaustive: never = gtdOption;
      return _exhaustive;
    }
  }
}

function gtdDrop(answers: Answers): string {
  if (answers.taskBackend !== "markdown") {
    return "The live store is not markdown. Omit `tasks/`.";
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
  switch (connectors) {
    case "none":
      return "Connectors are none. Do not install a task connector.";
    case "todoist":
    case "notion-class":
      return "Install the named connector in Settings before the bots are created.";
    default: {
      const _exhaustive: never = connectors;
      return _exhaustive;
    }
  }
}

function ladderStep(ladderRung: LadderRung): string {
  switch (ladderRung) {
    case "jsonl":
      return "Ladder rung is JSONL. Do not stand up Neo4j or FalkorDB.";
    case "sqlite":
      return "Ladder rung is SQLite. Do not stand up a graph server.";
    case "graphiti":
      return "Ladder rung is Graphiti. Stand up the chosen graph store only now.";
    default: {
      const _exhaustive: never = ladderRung;
      return _exhaustive;
    }
  }
}

function routinesStep(args: { gtdOption: GtdOption; offBoxCopy: OffBoxCopy }): string {
  const weekly = args.gtdOption === "off" ? "No weekly-review routine." : "Install the weekly review on Conductor.";
  const copy =
    args.offBoxCopy.kind === "git" || args.offBoxCopy.kind === "cloud"
      ? "Install a daily Memory copy routine. It is a no-op if the path has not changed."
      : "No standing copy routine.";
  return `${weekly} ${copy}`;
}

function offBoxStep(offBoxCopy: OffBoxCopy): string {
  const pathContract =
    "The copy is the whole path: vault, ledger directory, and the markdown task store when that store is live. JSONL and SQLite files under that path are in. A Graphiti store is not. Restore is copy that tree back onto the path. No sync daemon on the VM.";
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

function readTemplate(args: { plan: string; name: string }): string {
  const start = `<!-- template:${args.name} -->`;
  const end = `<!-- /template:${args.name} -->`;
  const from = args.plan.indexOf(start);
  const to = args.plan.indexOf(end);
  if (from === -1 || to === -1 || to <= from) {
    throw new Error(`PLAN.md is missing template ${args.name}`);
  }
  return args.plan.slice(from + start.length, to).trim();
}

function interpolate(args: { text: string; slots: Record<string, string> }): string {
  return args.text.replaceAll(/\{\{([a-z_]+)\}\}/g, (_match, key: string) => {
    if (!(key in args.slots)) {
      throw new Error(`unknown slot ${key}`);
    }
    const value = args.slots[key];
    if (value === undefined) {
      throw new Error(`unknown slot ${key}`);
    }
    return value;
  });
}
