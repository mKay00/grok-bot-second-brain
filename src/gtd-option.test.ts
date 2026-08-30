import assert from "node:assert/strict";
import { mkdtempSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { fill, WORKED_EXAMPLE, type Answers } from "./fill.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const templateDir = path.join(root, "vault-template");
const planPath = path.join(root, "PLAN.md");

const HYBRID = {
  ...WORKED_EXAMPLE,
  gtdOption: "hybrid",
} as const satisfies Answers;

const HYBRID_MAIL = {
  ...HYBRID,
  mailInReview: true,
} as const satisfies Answers;

const FULL = {
  ...WORKED_EXAMPLE,
  gtdOption: "full",
} as const satisfies Answers;

test("hybrid emit adds a projects list, extra verbs, and Conductor as the short weekly review", () => {
  const destDir = mkdtempSync(path.join(tmpdir(), "second-brain-gtd-hybrid-"));
  const { setupPrompt } = fill({
    answers: HYBRID,
    planPath,
    templateDir,
    destDir,
  });

  const tasks = readdirSync(path.join(destDir, "tasks")).sort();
  assert.deepEqual(tasks, ["next.md", "projects.md"]);

  const ops = extractBot(setupPrompt, "Ops");
  assert.ok(ops.includes("`add_project`"));
  assert.match(ops, /optional due/i);
  assert.match(ops, /unknown GTD project/i);
  assert.ok(!ops.includes("`list_projects`"));
  assert.ok(!ops.includes("`list_waiting`"));
  assert.ok(!ops.includes("`set_list`"));

  const conductor = extractBot(setupPrompt, "Conductor");
  assert.match(conductor, /short weekly review/i);
  assert.match(conductor, /collect/i);
  assert.match(conductor, /inbox to zero/i);
  assert.match(conductor, /next actions/i);
  assert.match(conductor, /GTD projects/);
  assert.match(conductor, /calendar already in front of the human/i);
  assert.ok(!/Waiting For/i.test(conductor));
  assert.ok(!/Someday/i.test(conductor));
  assert.ok(!/eleven-step/i.test(conductor));
});

test("hybrid default leaves mail-in-review off and does not emit the archive warning", () => {
  const prompt = fillPrompt(HYBRID);
  assert.ok(!/mail-in-review/i.test(prompt));
  const conductor = extractBot(prompt, "Conductor");
  assert.ok(!/empty mail/i.test(conductor));
});

test("mail-in-review on interpolates the archive warning into setup and Conductor", () => {
  const prompt = fillPrompt(HYBRID_MAIL);
  assert.match(prompt, /mail-in-review/i);
  assert.match(prompt, /archive, not delete/i);
  assert.match(prompt, /no Gmail API/i);
  assert.match(prompt, /no bot with mail access/i);
  assert.match(prompt, /not the vault inbox/i);
  const conductor = extractBot(prompt, "Conductor");
  assert.match(conductor, /empty mail by hand/i);
  assert.match(conductor, /archive, not delete/i);
});

test("off still has no weekly review, no mail-in-review, and no Waiting For, Someday, or contexts", () => {
  const prompt = fillPrompt(WORKED_EXAMPLE);
  assert.ok(!/mail-in-review/i.test(prompt));
  const conductor = extractBot(prompt, "Conductor");
  assert.match(conductor, /what's in flight/i);
  assert.ok(!/weekly review/i.test(conductor));
  assert.ok(!/Waiting For/i.test(conductor));
  assert.ok(!/Someday/i.test(conductor));
  const ops = extractBot(prompt, "Ops");
  assert.ok(!/Waiting For/i.test(ops));
  assert.ok(!/Someday/i.test(ops));
  assert.ok(!/contexts/i.test(ops));
  const capture = extractBot(prompt, "Capture");
  assert.ok(!/2-minute rule/i.test(capture));
});

test("in-flight is the live list_* verbs for that option", () => {
  const off = extractBot(fillPrompt(WORKED_EXAMPLE), "Memory");
  assert.ok(off.includes("`list_open`"));
  assert.ok(!off.includes("`list_projects`"));
  assert.ok(!off.includes("`list_waiting`"));
  assert.ok(!off.includes("`list_someday`"));

  const hybrid = extractBot(fillPrompt(HYBRID), "Memory");
  assert.ok(hybrid.includes("`list_open`"));
  assert.ok(hybrid.includes("`list_projects`"));
  assert.ok(!hybrid.includes("`list_waiting`"));
  assert.ok(!hybrid.includes("`list_someday`"));

  const full = extractBot(fillPrompt(FULL), "Memory");
  assert.ok(full.includes("`list_open`"));
  assert.ok(full.includes("`list_projects`"));
  assert.ok(full.includes("`list_waiting`"));
  assert.ok(full.includes("`list_someday`"));
});

test("a GTD project is not a PARA folder, Someday is incubate, and there is no Todoist-to-markdown sync", () => {
  for (const answers of [WORKED_EXAMPLE, HYBRID, FULL]) {
    const prompt = fillPrompt(answers);
    assert.match(prompt, /GTD project is an outcome in the task backend, not a PARA folder/);
    assert.match(prompt, /No Todoist-to-markdown sync/);
  }
  assert.match(fillPrompt(FULL), /Someday is incubate, not a resource/);
  assert.ok(!/Someday is incubate/.test(fillPrompt(WORKED_EXAMPLE)));
  assert.ok(!/tickler/i.test(fillPrompt(WORKED_EXAMPLE)));
});

test("full emit keeps hybrid and adds waiting, someday, contexts, the eleven-step review, and the 2-minute rule", () => {
  const destDir = mkdtempSync(path.join(tmpdir(), "second-brain-gtd-full-"));
  const { setupPrompt } = fill({
    answers: FULL,
    planPath,
    templateDir,
    destDir,
  });

  const tasks = readdirSync(path.join(destDir, "tasks")).sort();
  assert.deepEqual(tasks, ["next.md", "projects.md", "someday.md", "waiting.md"]);

  const ops = extractBot(setupPrompt, "Ops");
  assert.ok(ops.includes("`add_project`"));
  assert.ok(ops.includes("`set_list`"));
  assert.match(ops, /optional due/i);
  assert.match(ops, /optional contexts/i);
  assert.match(ops, /unknown GTD project/i);
  assert.ok(!ops.includes("`list_projects`"));
  assert.ok(!ops.includes("`list_waiting`"));
  assert.ok(!ops.includes("`list_someday`"));

  const conductor = extractBot(setupPrompt, "Conductor");
  assert.match(conductor, /eleven-step weekly review/i);
  assert.match(conductor, /Get Clear/);
  assert.match(conductor, /Get Current/);
  assert.match(conductor, /Get Creative/);
  assert.match(conductor, /Waiting For/);
  assert.match(conductor, /Someday/);
  assert.match(conductor, /vault inbox/);
  assert.match(conductor, /Assign Capture/);

  const capture = extractBot(setupPrompt, "Capture");
  assert.match(capture, /2-minute rule/i);
});

function fillPrompt(answers: Answers): string {
  const destDir = mkdtempSync(path.join(tmpdir(), "second-brain-gtd-"));
  const { setupPrompt } = fill({
    answers,
    planPath,
    templateDir,
    destDir,
  });
  return setupPrompt;
}

function extractBot(setupPrompt: string, name: string): string {
  const section = setupPrompt.split(`### ${name}`)[1]?.split("### ")[0];
  assert.ok(section, `setup prompt missing ${name} section`);
  const match = section.match(/```description\n([\s\S]*?)```/);
  assert.ok(match?.[1], `setup prompt missing ${name} description`);
  return match[1];
}
