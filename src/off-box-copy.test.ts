import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { fill, WORKED_EXAMPLE, type Answers } from "./fill.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const templateDir = path.join(root, "vault-template");
const planPath = path.join(root, "PLAN.md");

const GIT_REMOTE = "git@example.com:example/second-brain.git";

const GIT = {
  ...WORKED_EXAMPLE,
  offBoxCopy: { kind: "git", remoteUrl: GIT_REMOTE },
} as const satisfies Answers;

const FOLDER = {
  ...WORKED_EXAMPLE,
  offBoxCopy: { kind: "folder" },
} as const satisfies Answers;

const CLOUD_PRODUCT = "pCloud";

const CLOUD = {
  ...WORKED_EXAMPLE,
  offBoxCopy: { kind: "cloud", product: CLOUD_PRODUCT },
} as const satisfies Answers;

test("filling git interpolates the private remote and runs the first copy after the first-task tests", () => {
  const prompt = fillPrompt(GIT);
  assert.ok(prompt.includes(GIT_REMOTE), "setup must give Memory the private remote");
  assert.match(prompt, /morning deep work/);
  assert.match(prompt, /append/);
  const afterTests = afterFirstTaskTests(prompt);
  assert.ok(afterTests.includes(GIT_REMOTE), "first copy must come after the first-task tests");
  assert.match(afterTests, /after approval/i);
});

test("folder leaves the copy to the human and installs no Memory routine", () => {
  const prompt = fillPrompt(FOLDER);
  const memory = extractBot(prompt, "Memory");
  assert.match(memory, /human copies/i);
  assert.match(memory, /no standing copy job/i);
  assert.match(prompt, /no standing copy routine/i);
  assert.ok(!/daily Memory copy routine/i.test(prompt));
  assert.ok(!prompt.includes(GIT_REMOTE), "folder has no remote follow-up");
});

test("cloud interpolates the product name and Memory uploads after the first-task tests", () => {
  const prompt = fillPrompt(CLOUD);
  assert.ok(prompt.includes(CLOUD_PRODUCT), "setup must name the cloud product");
  const memory = extractBot(prompt, "Memory");
  assert.match(memory, /upload/i);
  const afterTests = afterFirstTaskTests(prompt);
  assert.ok(afterTests.includes(CLOUD_PRODUCT), "first copy must come after the first-task tests");
  assert.match(afterTests, /after approval/i);
});

test("git and cloud install a daily Memory routine that no-ops if the path has not changed", () => {
  for (const answers of [GIT, CLOUD]) {
    const prompt = fillPrompt(answers);
    assert.match(prompt, /daily Memory copy routine/i);
    assert.match(prompt, /no-op if the path has not changed/i);
  }
  const skip = fillPrompt(WORKED_EXAMPLE);
  assert.match(skip, /no standing copy routine/i);
  assert.ok(!/daily Memory copy routine/i.test(skip));
  assert.ok(!/no-op if the path has not changed/i.test(skip));
});

test("the copy is the whole path, Graphiti is out, and restore is copy that tree back", () => {
  for (const answers of [GIT, FOLDER, CLOUD]) {
    const prompt = fillPrompt(answers);
    assert.match(prompt, /vault/i);
    assert.match(prompt, /ledger directory/i);
    assert.match(prompt, /markdown task store/i);
    assert.match(prompt, /JSONL/);
    assert.match(prompt, /SQLite/);
    assert.match(prompt, /Graphiti/i);
    assert.match(prompt, /restore/i);
    assert.match(prompt, /sync daemon/i);
  }
});

test("Conductor guides the first copy in chat and later pushes or uploads run", () => {
  const git = fillPrompt(GIT);
  const conductor = extractBot(git, "Conductor");
  assert.match(conductor, /guides the first off-box copy in chat/i);
  assert.match(conductor, /does not write the path/i);
  assert.ok(conductor.includes(GIT_REMOTE), "Conductor must get the git method");
  const memory = extractBot(git, "Memory");
  assert.match(memory, /first copy/i);
  assert.match(memory, /method change/i);
  assert.match(git, /later (git )?pushes run/i);
  const cloud = fillPrompt(CLOUD);
  const cloudConductor = extractBot(cloud, "Conductor");
  assert.ok(cloudConductor.includes(CLOUD_PRODUCT), "Conductor must get the cloud method");
  assert.match(cloud, /later uploads run/i);
  const folderConductor = extractBot(fillPrompt(FOLDER), "Conductor");
  assert.match(folderConductor, /human copies/i);
});

function fillPrompt(answers: Answers): string {
  const destDir = mkdtempSync(path.join(tmpdir(), "second-brain-copy-"));
  const { setupPrompt } = fill({
    answers,
    planPath,
    templateDir,
    destDir,
  });
  return setupPrompt;
}

function afterFirstTaskTests(setupPrompt: string): string {
  const testsAt = setupPrompt.search(/PARA is not GTD/);
  assert.ok(testsAt !== -1, "setup prompt missing the Research first-task test");
  return setupPrompt.slice(testsAt);
}

function extractBot(setupPrompt: string, name: string): string {
  const section = setupPrompt.split(`### ${name}`)[1]?.split("### ")[0];
  assert.ok(section, `setup prompt missing ${name} section`);
  const match = section.match(/```description\n([\s\S]*?)```/);
  assert.ok(match?.[1], `setup prompt missing ${name} description`);
  return match[1];
}
