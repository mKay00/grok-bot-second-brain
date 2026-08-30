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

const HYBRID = {
  ...WORKED_EXAMPLE,
  gtdOption: "hybrid",
} as const satisfies Answers;

const FULL = {
  ...WORKED_EXAMPLE,
  gtdOption: "full",
} as const satisfies Answers;

test("every GTD option installs a monthly Memory decay routine", () => {
  for (const answers of [WORKED_EXAMPLE, HYBRID, FULL]) {
    const prompt = fillPrompt(answers);
    assert.match(prompt, /monthly Memory decay routine/i);
    assert.match(prompt, /unused 30 days/i);
    assert.match(prompt, /proposed `decayed`/i);
    assert.match(prompt, /does not record use/i);
  }
});

test("Memory related-queries before append and writes supersession or conflict", () => {
  const memory = extractBot(fillPrompt(WORKED_EXAMPLE), "Memory");
  assert.match(memory, /before `append`/i);
  assert.match(memory, /`related`/i);
  assert.match(memory, /supersedes/i);
  assert.match(memory, /proposes `conflict`/i);
  assert.match(memory, /stops before `set_status`/i);
  assert.match(memory, /`set_status` off a live status/i);
  assert.match(memory, /then leaves `current`/i);
});

test("hybrid and full weekly review list unused-30-day current claims; off does not", () => {
  const off = extractBot(fillPrompt(WORKED_EXAMPLE), "Conductor");
  assert.ok(!/unused 30 days/i.test(off));
  assert.ok(!/decayed/i.test(off));

  for (const answers of [HYBRID, FULL]) {
    const conductor = extractBot(fillPrompt(answers), "Conductor");
    assert.match(conductor, /unused 30 days/i);
    assert.match(conductor, /`current`/i);
    assert.match(conductor, /Memory/i);
  }
});

function fillPrompt(answers: Answers): string {
  const destDir = mkdtempSync(path.join(tmpdir(), "second-brain-usage-"));
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
