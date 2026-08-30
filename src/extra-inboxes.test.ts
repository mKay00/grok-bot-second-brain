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

const EXTRA_INBOXES = {
  ...WORKED_EXAMPLE,
  extraInboxes: [
    { name: "mail", writeBack: "archive" },
    { name: "paper", writeBack: "delete" },
  ],
} as const satisfies Answers;

test("filling extra inboxes interpolates each name and its write-back into Capture", () => {
  const capture = fillCapture();
  assert.match(capture, /mail:\s*archive/);
  assert.match(capture, /paper:\s*delete/);
});

test("extra-inbox copies include writeback:<choice> and apply write-back only after the fork", () => {
  const capture = fillCapture();
  assert.ok(capture.includes("`writeback:<tag|archive|leave|delete>`"), "copies must include writeback:<choice> in the line");
  assert.match(capture, /after the fork/i);
  assert.match(capture, /not at copy/i);
});

test("Capture owns every inbox, copies then proposes, and forks only in the vault inbox", () => {
  const capture = fillCapture();
  assert.match(capture, /file owner of every configured inbox/i);
  assert.match(capture, /copy, then propose/i);
  assert.match(capture, /never manage a source in place/i);
  assert.match(capture, /never:.*send/i);
  assert.match(capture, /vault inbox is the only place the clarify fork runs/i);
});

function fillCapture(): string {
  const destDir = mkdtempSync(path.join(tmpdir(), "second-brain-extras-"));
  const { setupPrompt } = fill({
    answers: EXTRA_INBOXES,
    planPath,
    templateDir,
    destDir,
  });
  return extractCapture(setupPrompt);
}

function extractCapture(setupPrompt: string): string {
  const section = setupPrompt.split("### Capture")[1]?.split("### ")[0];
  assert.ok(section, "setup prompt missing Capture section");
  const match = section.match(/```description\n([\s\S]*?)```/);
  assert.ok(match?.[1], "setup prompt missing Capture description");
  return match[1];
}
