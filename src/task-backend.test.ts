import assert from "node:assert/strict";
import { existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { fill, WORKED_EXAMPLE, type Answers } from "./fill.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const templateDir = path.join(root, "vault-template");
const planPath = path.join(root, "PLAN.md");

const TODOIST_OFF = {
  ...WORKED_EXAMPLE,
  connectors: { kind: "todoist" },
  taskBackend: "todoist",
} as const satisfies Answers;

const TODOIST_HYBRID = {
  ...TODOIST_OFF,
  gtdOption: "hybrid",
} as const satisfies Answers;

const TODOIST_FULL = {
  ...TODOIST_OFF,
  gtdOption: "full",
} as const satisfies Answers;

const NOTION_PRODUCT = "Capacities";

const NOTION_CLASS = {
  ...WORKED_EXAMPLE,
  connectors: { kind: "notion-class", product: NOTION_PRODUCT },
  taskBackend: "notion-class",
} as const satisfies Answers;

test("markdown stays the default when connectors are none, and Todoist live omits the markdown task store", () => {
  const markdownDir = mkdtempSync(path.join(tmpdir(), "second-brain-md-"));
  const markdown = fill({
    answers: WORKED_EXAMPLE,
    planPath,
    templateDir,
    destDir: markdownDir,
  });
  assert.ok(existsSync(path.join(markdownDir, "tasks", "next.md")));
  assert.match(markdown.setupPrompt, /live store is markdown/i);
  assert.match(markdown.setupPrompt, /keep `tasks\/`/);

  const todoistDir = mkdtempSync(path.join(tmpdir(), "second-brain-td-"));
  const todoist = fill({
    answers: TODOIST_OFF,
    planPath,
    templateDir,
    destDir: todoistDir,
  });
  assert.ok(!existsSync(path.join(todoistDir, "tasks")));
  assert.match(todoist.setupPrompt, /omit `tasks\/`/i);
  assert.ok(!/live store is markdown/i.test(todoist.setupPrompt));
  assert.ok(!/keep `tasks\/`/.test(todoist.setupPrompt));
});

test("Todoist off binds add, complete, and list_open to Next and does not treat Inbox as Next", () => {
  const prompt = fillPrompt(TODOIST_OFF);
  assert.match(prompt, /Install the Todoist connector/i);
  const ops = extractBot(prompt, "Ops");
  assert.match(ops, /`add`/);
  assert.match(ops, /`complete`/);
  assert.match(ops, /`list_open`/);
  assert.match(ops, /\bNext\b/);
  assert.match(ops, /Inbox is not Next/);
  assert.ok(!/\bTodoist\b/.test(ops), "Ops binds lists without naming the store");
  assert.ok(!/\bProjects\b/.test(ops));
  assert.ok(!/Waiting For/.test(ops));
  assert.ok(!/Someday/.test(ops));
  assert.ok(!/labels/.test(ops));
});

test("Todoist hybrid uses Next and Projects, with the join as a section on Next", () => {
  const destDir = mkdtempSync(path.join(tmpdir(), "second-brain-td-hy-"));
  const { setupPrompt } = fill({
    answers: TODOIST_HYBRID,
    planPath,
    templateDir,
    destDir,
  });
  assert.ok(!existsSync(path.join(destDir, "tasks")));
  const ops = extractBot(setupPrompt, "Ops");
  assert.match(ops, /\bNext\b/);
  assert.match(ops, /\bProjects\b/);
  assert.match(ops, /one task in Projects/);
  assert.match(ops, /task in Next/);
  assert.match(ops, /section on Next whose name matches that outcome/);
  assert.match(ops, /Loose next actions have no section/);
  assert.match(ops, /Inbox is not Next/);
  assert.ok(!/Waiting For/.test(ops));
  assert.ok(!/Someday/.test(ops));
  assert.ok(!/labels/.test(ops));
});

test("Todoist full uses four Beginner slots, labels on Next, and set_list drops the section", () => {
  const ops = extractBot(fillPrompt(TODOIST_FULL), "Ops");
  assert.match(ops, /\bNext\b/);
  assert.match(ops, /Waiting For/);
  assert.match(ops, /Someday/);
  assert.match(ops, /\bProjects\b/);
  assert.match(ops, /four of five Beginner slots/);
  assert.match(ops, /Contexts are labels on Next/);
  assert.match(ops, /`set_list` off Next drops the section/);
  assert.match(ops, /Inbox is not Next/);
});

test("Notion-class is one tasks database named by product, and omits the markdown task store", () => {
  const destDir = mkdtempSync(path.join(tmpdir(), "second-brain-notion-"));
  const { setupPrompt } = fill({
    answers: NOTION_CLASS,
    planPath,
    templateDir,
    destDir,
  });
  assert.ok(!existsSync(path.join(destDir, "tasks")));
  assert.ok(setupPrompt.includes(NOTION_PRODUCT));
  assert.match(setupPrompt, new RegExp(`Install the ${NOTION_PRODUCT} connector`, "i"));
  assert.match(setupPrompt, /omit `tasks\/`/i);
  assert.ok(!/live store is markdown/i.test(setupPrompt));
  const ops = extractBot(setupPrompt, "Ops");
  assert.match(ops, /one tasks database/i);
  assert.match(ops, /list property holds next, waiting, or someday/i);
  assert.match(ops, /GTD project and contexts are properties/i);
  assert.match(ops, /`complete` uses the native done status/i);
  assert.match(ops, /Not the vault, not the ledger, not a second store/i);
  assert.ok(!/plugin/i.test(ops.replace(NEVER_NAME_SENTENCE, "")));
  assert.ok(!/\bdatabase\s+(id|url)\b/i.test(ops));
});

test("live backend cannot be a store whose connector will not be installed", () => {
  assert.throws(
    () =>
      fill({
        answers: { ...WORKED_EXAMPLE, taskBackend: "todoist" },
        planPath,
        templateDir,
        destDir: mkdtempSync(path.join(tmpdir(), "second-brain-bad-")),
      }),
    /connector/i,
  );
  assert.throws(
    () =>
      fill({
        answers: {
          ...WORKED_EXAMPLE,
          connectors: { kind: "notion-class", product: "" },
          taskBackend: "notion-class",
        },
        planPath,
        templateDir,
        destDir: mkdtempSync(path.join(tmpdir(), "second-brain-noprod-")),
      }),
    /product/i,
  );
});

test("switching stores later is a human move with no export or cutover job", () => {
  for (const answers of [WORKED_EXAMPLE, TODOIST_OFF, NOTION_CLASS]) {
    const prompt = fillPrompt(answers);
    assert.match(prompt, /Switching stores later is a human move/);
    assert.match(prompt, /No export/);
    assert.match(prompt, /No cutover job/);
  }
});

test("prompts never name a file, a plugin, or a Notion database", () => {
  for (const answers of [WORKED_EXAMPLE, TODOIST_FULL, NOTION_CLASS]) {
    const descriptions = extractDescriptions(fillPrompt(answers));
    assert.equal(descriptions.length, 5);
    for (const description of descriptions) {
      assert.ok(!description.includes("tasks/next.md"));
      assert.ok(!description.includes("tasks/projects.md"));
      const rest = description.replace(NEVER_NAME_SENTENCE, "");
      assert.ok(!/\bplugin\b/i.test(rest));
      assert.ok(!/\bdatabase\s+(id|url)\b/i.test(rest));
    }
  }
});

const NEVER_NAME_SENTENCE =
  "Never name the ledger file, SQL, Cypher, Graphiti episodes, a plugin, a Notion database, or a task-store path.";

function fillPrompt(answers: Answers): string {
  const destDir = mkdtempSync(path.join(tmpdir(), "second-brain-store-"));
  const { setupPrompt } = fill({
    answers,
    planPath,
    templateDir,
    destDir,
  });
  return setupPrompt;
}

function extractDescriptions(setupPrompt: string): string[] {
  const matches = [...setupPrompt.matchAll(/```description\n([\s\S]*?)```/g)];
  return matches.map((match) => match[1] ?? "");
}

function extractBot(setupPrompt: string, name: string): string {
  const section = setupPrompt.split(`### ${name}`)[1]?.split("### ")[0];
  assert.ok(section, `setup prompt missing ${name} section`);
  const match = section.match(/```description\n([\s\S]*?)```/);
  assert.ok(match?.[1], `setup prompt missing ${name} description`);
  return match[1];
}
