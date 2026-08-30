import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { type Answers, renderBotDescriptions } from "./fill.ts";
import { headPlanVersion, listMigrations, pendingMigrations, type PlanMigration } from "./migrations.ts";
import { interpolate, readTemplate } from "./plan-template.ts";

export type InstallState = {
  planVersion: number;
  promptsVersion: number;
  answers: Answers | null;
};

export function readInstallState(livePath: string): InstallState {
  const installDir = path.join(livePath, "install");
  const planVersion = readVersionFile(path.join(installDir, "plan-version"));
  const promptsVersion = readVersionFile(path.join(installDir, "prompts-version"));
  const answersPath = path.join(installDir, "answers.json");
  if (!existsSync(answersPath)) {
    return { planVersion, promptsVersion, answers: null };
  }
  return {
    planVersion,
    promptsVersion,
    answers: parseAnswers(JSON.parse(readFileSync(answersPath, "utf8")) as unknown),
  };
}

export function renderUpgradePrompt(args: {
  planPath: string;
  migrationsDir: string;
  livePath: string;
}): string {
  const plan = readFileSync(args.planPath, "utf8");
  const head = headPlanVersion(args.migrationsDir);
  const state = readInstallState(args.livePath);

  if (state.planVersion > head) {
    return wrapUpgradeBody({
      plan,
      body: [
        "# Upgrade prompt",
        "",
        `Stop. This path is at plan version ${state.planVersion}, but the landed consolidation plan only goes to ${head}.`,
        "Clone or pull a newer copy of the consolidation plan repo onto the shared computer, then run upgrade again.",
        "Never downgrade the live path.",
      ].join("\n"),
    });
  }

  if (state.answers === null) {
    return wrapUpgradeBody({
      plan,
      body: [
        "# Upgrade prompt",
        "",
        "Stop. `install/answers.json` is missing.",
        "Re-ask the questionnaire in `PLAN.md`, write `install/answers.json` on the live path, then run upgrade again.",
        "Do not invent required slots (display name, GTD option, off-box copy).",
      ].join("\n"),
    });
  }

  const pending = pendingMigrations({
    migrationsDir: args.migrationsDir,
    planVersion: state.planVersion,
  });
  const finalPlanVersion = pending.length === 0 ? state.planVersion : head;
  const pasteNeeded = promptsNeedRepaste({
    migrationsDir: args.migrationsDir,
    promptsVersion: state.promptsVersion,
    throughVersion: finalPlanVersion,
  });

  if (pending.length === 0) {
    if (!pasteNeeded) {
      return wrapUpgradeBody({
        plan,
        body: [
          "# Upgrade prompt",
          "",
          `This path is already at plan version ${state.planVersion} (repo head ${head}). No plan migrations to apply.`,
        ].join("\n"),
      });
    }
    const body = [
      "# Upgrade prompt",
      "",
      `Plan migrations are done (plan version ${state.planVersion}). Prompts version ${state.promptsVersion} still lags a prompt-touching plan migration.`,
      "",
      formatDescriptions({ plan, answers: state.answers }),
      "",
      `After all five descriptions are pasted, write \`install/prompts-version\` to \`${state.planVersion}\`.`,
    ];
    return wrapUpgradeBody({ plan, body: body.join("\n") });
  }

  const body: string[] = [
    "# Upgrade prompt",
    "",
    "You are the setup helper, not a roster member. Land the latest consolidation plan repo on the shared computer first.",
    `Live path: \`${state.answers.path}\`. Current plan version: ${state.planVersion}. Repo head: ${head}.`,
    "Apply pending plan migrations in order. After each plan migration's file transforms succeed, write `install/plan-version` to that plan migration's number.",
    "Do not run upgrade-ladder rung cutovers here.",
    "",
  ];

  for (const migration of pending) {
    body.push(formatMigration({ migration, livePath: state.answers.path }));
    body.push("");
  }

  if (pasteNeeded) {
    body.push(formatDescriptions({ plan, answers: state.answers }));
    body.push("");
    body.push(
      `After all five descriptions are pasted, write \`install/prompts-version\` to \`${head}\`.`,
    );
  } else {
    body.push("Bot descriptions are unchanged. Do not re-paste.");
  }

  return wrapUpgradeBody({ plan, body: body.join("\n").trim() });
}

function promptsNeedRepaste(args: {
  migrationsDir: string;
  promptsVersion: number;
  throughVersion: number;
}): boolean {
  return listMigrations(args.migrationsDir).some(
    (migration) =>
      migration.version > args.promptsVersion &&
      migration.version <= args.throughVersion &&
      migration.touchesPrompts,
  );
}

function wrapUpgradeBody(args: { plan: string; body: string }): string {
  return interpolate({
    text: readTemplate({ plan: args.plan, name: "upgrade-prompt" }),
    slots: { upgrade_body: args.body },
  });
}

function formatMigration(args: { migration: PlanMigration; livePath: string }): string {
  const { migration, livePath } = args;
  const steps = readFileSync(migration.stepsPath, "utf8").trim();
  const lines = [
    `## Migration ${migration.version}: ${migration.slug}`,
    "",
    steps,
    "",
    `Live path for this step: \`${livePath}\`.`,
  ];
  if (migration.upScriptPath) {
    lines.push(
      `Then run: \`bash ${migration.upScriptPath}\` with the live path as the working tree root (or pass it as documented in steps.md).`,
    );
  }
  lines.push(
    `When file transforms for this plan migration succeed, write \`install/plan-version\` to \`${migration.version}\`.`,
  );
  return lines.join("\n");
}

function formatDescriptions(args: { plan: string; answers: Answers }): string {
  const descriptions = renderBotDescriptions({ plan: args.plan, answers: args.answers });
  return [
    "## Descriptions",
    "",
    "Prompt templates changed (or prompts version lagged). Re-paste all five bot descriptions.",
    "",
    "### Conductor",
    "",
    "```description",
    descriptions.conductor,
    "```",
    "",
    "### Capture",
    "",
    "```description",
    descriptions.capture,
    "```",
    "",
    "### Memory",
    "",
    "```description",
    descriptions.memory,
    "```",
    "",
    "### Ops",
    "",
    "```description",
    descriptions.ops,
    "```",
    "",
    "### Research",
    "",
    "```description",
    descriptions.research,
    "```",
  ].join("\n");
}

function readVersionFile(filePath: string): number {
  if (!existsSync(filePath)) {
    return 0;
  }
  const raw = readFileSync(filePath, "utf8").trim();
  if (raw === "") {
    return 0;
  }
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`invalid version in ${filePath}`);
  }
  return value;
}

function parseAnswers(value: unknown): Answers {
  if (typeof value !== "object" || value === null) {
    throw new Error("install/answers.json must be an object");
  }
  const record = value as Record<string, unknown>;
  if (typeof record.displayName !== "string" || record.displayName.trim() === "") {
    throw new Error("install/answers.json displayName must be a non-empty string");
  }
  if (typeof record.path !== "string" || record.path.trim() === "") {
    throw new Error("install/answers.json path must be a non-empty string");
  }
  if (!isOffBoxCopy(record.offBoxCopy)) {
    throw new Error("install/answers.json offBoxCopy is invalid");
  }
  if (!isConnectors(record.connectors)) {
    throw new Error("install/answers.json connectors is invalid");
  }
  if (
    record.taskBackend !== "markdown" &&
    record.taskBackend !== "todoist" &&
    record.taskBackend !== "notion-class"
  ) {
    throw new Error("install/answers.json taskBackend is invalid");
  }
  if (record.gtdOption !== "off" && record.gtdOption !== "hybrid" && record.gtdOption !== "full") {
    throw new Error("install/answers.json gtdOption is invalid");
  }
  if (typeof record.mailInReview !== "boolean") {
    throw new Error("install/answers.json mailInReview must be boolean");
  }
  if (!Array.isArray(record.extraInboxes) || !record.extraInboxes.every(isExtraInbox)) {
    throw new Error("install/answers.json extraInboxes is invalid");
  }
  if (
    record.ladderRung !== "jsonl" &&
    record.ladderRung !== "sqlite" &&
    record.ladderRung !== "graphiti"
  ) {
    throw new Error("install/answers.json ladderRung is invalid");
  }
  if (record.graphitiStore !== "neo4j" && record.graphitiStore !== "falkordb") {
    throw new Error("install/answers.json graphitiStore is invalid");
  }
  return {
    displayName: record.displayName,
    path: record.path,
    offBoxCopy: record.offBoxCopy,
    connectors: record.connectors,
    taskBackend: record.taskBackend,
    gtdOption: record.gtdOption,
    mailInReview: record.mailInReview,
    extraInboxes: record.extraInboxes,
    ladderRung: record.ladderRung,
    graphitiStore: record.graphitiStore,
  };
}

function isOffBoxCopy(value: unknown): value is Answers["offBoxCopy"] {
  if (typeof value !== "object" || value === null || !("kind" in value)) {
    return false;
  }
  const kind = (value as { kind: unknown }).kind;
  if (kind === "skip" || kind === "folder") {
    return true;
  }
  if (kind === "git") {
    return (
      "remoteUrl" in value &&
      typeof (value as { remoteUrl: unknown }).remoteUrl === "string" &&
      (value as { remoteUrl: string }).remoteUrl.trim() !== ""
    );
  }
  if (kind === "cloud") {
    return (
      "product" in value &&
      typeof (value as { product: unknown }).product === "string" &&
      (value as { product: string }).product.trim() !== ""
    );
  }
  return false;
}

function isConnectors(value: unknown): value is Answers["connectors"] {
  if (typeof value !== "object" || value === null || !("kind" in value)) {
    return false;
  }
  const kind = (value as { kind: unknown }).kind;
  if (kind === "none" || kind === "todoist") {
    return true;
  }
  if (kind === "notion-class") {
    return (
      "product" in value &&
      typeof (value as { product: unknown }).product === "string" &&
      (value as { product: string }).product.trim() !== ""
    );
  }
  return false;
}

function isExtraInbox(value: unknown): boolean {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const inbox = value as { name?: unknown; writeBack?: unknown };
  if (typeof inbox.name !== "string" || inbox.name.trim() === "") {
    return false;
  }
  return (
    inbox.writeBack === "tag" ||
    inbox.writeBack === "archive" ||
    inbox.writeBack === "leave" ||
    inbox.writeBack === "delete"
  );
}
