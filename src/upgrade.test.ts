import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { WORKED_EXAMPLE, writeInstallMetadata } from "./fill.ts";
import {
  headPlanVersion,
  listMigrations,
  pendingMigrations,
} from "./migrations.ts";
import { renderUpgradePrompt } from "./upgrade.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const planPath = path.join(root, "PLAN.md");
const migrationsDir = path.join(root, "migrations");

test("repo ships baseline migration 0001 with steps.md", () => {
  const migrations = listMigrations(migrationsDir);
  assert.equal(migrations[0]?.version, 1);
  assert.equal(migrations[0]?.slug, "baseline");
  assert.equal(migrations[0]?.touchesPrompts, false);
  assert.equal(migrations[0]?.upScriptPath, null);
  assert.equal(headPlanVersion(migrationsDir), migrations[migrations.length - 1]?.version);
});

test("pending migrations are versions strictly above plan version", () => {
  assert.deepEqual(
    pendingMigrations({ migrationsDir, planVersion: 0 }).map((m) => m.version),
    listMigrations(migrationsDir).map((m) => m.version),
  );
  assert.deepEqual(pendingMigrations({ migrationsDir, planVersion: headPlanVersion(migrationsDir) }), []);
});

test("upgrade prompt stops when path plan version is ahead of repo head", () => {
  const livePath = mkdtempSync(path.join(tmpdir(), "second-brain-live-"));
  writeInstallMetadata({
    answers: WORKED_EXAMPLE,
    destDir: livePath,
    planVersion: headPlanVersion(migrationsDir) + 1,
    promptsVersion: headPlanVersion(migrationsDir) + 1,
  });

  const prompt = renderUpgradePrompt({
    planPath,
    migrationsDir,
    livePath,
  });
  assert.match(prompt, /stop/i);
  assert.match(prompt, /newer/i);
  assert.ok(!/## Migration 1/i.test(prompt));
});

test("upgrade from 0 without answers stops before migrations", () => {
  const livePath = mkdtempSync(path.join(tmpdir(), "second-brain-live-"));
  mkdirSync(path.join(livePath, "install"), { recursive: true });
  writeFileSync(path.join(livePath, "install/plan-version"), "0\n");

  const prompt = renderUpgradePrompt({
    planPath,
    migrationsDir,
    livePath,
  });
  assert.match(prompt, /install\/answers\.json/i);
  assert.match(prompt, /stop/i);
  assert.ok(!/bash up\.sh/i.test(prompt));
});

test("upgrade from 0 with answers emits baseline steps and bumps plan version", () => {
  const livePath = mkdtempSync(path.join(tmpdir(), "second-brain-live-"));
  writeInstallMetadata({
    answers: WORKED_EXAMPLE,
    destDir: livePath,
    planVersion: 0,
    promptsVersion: 0,
  });

  const prompt = renderUpgradePrompt({
    planPath,
    migrationsDir,
    livePath,
  });
  assert.match(prompt, /## Migration 1/i);
  assert.match(prompt, /baseline/i);
  assert.match(prompt, /install\/answers\.json/);
  assert.match(prompt, /Write `install\/plan-version` to `1`/i);
  assert.ok(!/## Descriptions/i.test(prompt), "baseline does not touch prompts");
});

test("upgrade re-pastes all five descriptions when a pending plan migration touches prompts", () => {
  const fixture = mkdtempSync(path.join(tmpdir(), "migrations-"));
  const baselineDir = path.join(fixture, "0001_baseline");
  const promptsDir = path.join(fixture, "0002_prompts");
  mkdirSync(baselineDir);
  mkdirSync(promptsDir);
  writeFileSync(path.join(baselineDir, "steps.md"), "Baseline.\n");
  writeFileSync(path.join(baselineDir, "meta.json"), `${JSON.stringify({ touchesPrompts: false })}\n`);
  writeFileSync(path.join(promptsDir, "steps.md"), "Preamble changed.\n");
  writeFileSync(path.join(promptsDir, "meta.json"), `${JSON.stringify({ touchesPrompts: true })}\n`);

  const livePath = mkdtempSync(path.join(tmpdir(), "second-brain-live-"));
  writeInstallMetadata({
    answers: WORKED_EXAMPLE,
    destDir: livePath,
    planVersion: 1,
    promptsVersion: 1,
  });

  const prompt = renderUpgradePrompt({
    planPath,
    migrationsDir: fixture,
    livePath,
  });
  assert.match(prompt, /## Migration 2/i);
  assert.match(prompt, /## Descriptions/);
  assert.equal([...prompt.matchAll(/```description\n/g)].length, 5);
  assert.match(prompt, /install\/prompts-version` to `2`/);
});

test("upgrade does not re-paste when prompts version lags but no prompt-touching plan migration is in the gap", () => {
  const livePath = mkdtempSync(path.join(tmpdir(), "second-brain-live-"));
  writeInstallMetadata({
    answers: WORKED_EXAMPLE,
    destDir: livePath,
    planVersion: 1,
    promptsVersion: 0,
  });

  const prompt = renderUpgradePrompt({
    planPath,
    migrationsDir,
    livePath,
  });
  assert.match(prompt, /No plan migrations to apply/i);
  assert.ok(!/## Descriptions/i.test(prompt));
});
