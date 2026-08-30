import assert from "node:assert/strict";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { fill, WORKED_EXAMPLE } from "./fill.ts";
import { headPlanVersion } from "./migrations.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const templateDir = path.join(root, "vault-template");
const planPath = path.join(root, "PLAN.md");
const migrationsDir = path.join(root, "migrations");

test("fill writes install answers, plan version, and prompts version at head", () => {
  const destDir = mkdtempSync(path.join(tmpdir(), "second-brain-"));
  fill({
    answers: WORKED_EXAMPLE,
    planPath,
    templateDir,
    destDir,
    migrationsDir,
  });

  const head = headPlanVersion(migrationsDir);
  assert.ok(head >= 1, "repo must ship at least baseline migration 1");

  const answers = JSON.parse(readFileSync(path.join(destDir, "install/answers.json"), "utf8"));
  assert.equal(answers.displayName, WORKED_EXAMPLE.displayName);
  assert.equal(answers.path, WORKED_EXAMPLE.path);
  assert.equal(answers.ladderRung, "jsonl");
  assert.equal(answers.gtdOption, "off");

  assert.equal(
    readFileSync(path.join(destDir, "install/plan-version"), "utf8").trim(),
    String(head),
  );
  assert.equal(
    readFileSync(path.join(destDir, "install/prompts-version"), "utf8").trim(),
    String(head),
  );
});
