import assert from "node:assert/strict";
import { mkdtempSync, readdirSync, readFileSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { fill, WORKED_EXAMPLE } from "./fill.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const templateDir = path.join(root, "vault-template");
const planPath = path.join(root, "PLAN.md");

function listFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(dir, full);
    if (entry.isDirectory()) {
      out.push(...listFiles(full).map((child) => path.join(rel, child)));
    } else {
      out.push(rel);
    }
  }
  return out.sort();
}

test("vault template matches the filesystem contract", () => {
  const files = listFiles(templateDir);
  for (const required of [
    "vault/SCHEMA.md",
    "vault/inbox.md",
    "vault/working.md",
    "vault/drafts/Example draft.md",
    "vault/01-projects/Example project/Example project.md",
    "vault/02-areas/Example area/Example area.md",
    "vault/03-resources/Example resource/Example resource.md",
    "memory/ledger.jsonl",
    "memory/aliases.csv",
    "tasks/next.md",
    "tasks/projects.md",
    "tasks/waiting.md",
    "tasks/someday.md",
  ]) {
    assert.ok(files.includes(required), `missing ${required}`);
  }

  assert.equal(readFileSync(path.join(templateDir, "vault/inbox.md"), "utf8").trim(), "");
  assert.equal(readFileSync(path.join(templateDir, "memory/ledger.jsonl"), "utf8"), "");
  assert.ok(
    statSync(path.join(templateDir, "vault/04-archives")).isDirectory(),
    "Archives folder missing",
  );
  assert.equal(
    readdirSync(path.join(templateDir, "vault/04-archives")).filter((name) => name !== ".gitkeep")
      .length,
    0,
    "Archives must be empty of notes",
  );

  const working = readFileSync(path.join(templateDir, "vault/working.md"), "utf8");
  for (const heading of [
    "# Identity",
    "# State",
    "# Decisions",
    "# Corrections",
    "# People",
    "# Dead",
    "# In-flight",
  ]) {
    assert.ok(working.includes(heading), `working file missing ${heading}`);
  }
  assert.ok(!working.includes("---"), "working file must have no YAML");

  const aliases = readFileSync(path.join(templateDir, "memory/aliases.csv"), "utf8");
  assert.ok(aliases.startsWith("canonical,alias,kind\n"));
  assert.ok(/^[^\n]+,me,person$/m.test(aliases));

  const schema = readFileSync(path.join(templateDir, "vault/SCHEMA.md"), "utf8");
  assert.ok(schema.includes("YYYY-MM-DDTHH:MMZ | source:<name> | text"));
  assert.ok(schema.includes("writeback:<tag|archive|leave|delete>"));
  assert.ok(schema.includes("memory/"));
  assert.ok(schema.includes("install/"));
  assert.ok(schema.includes("tasks/"));
  assert.ok(!schema.includes("valid_from"), "claim fields must stay out of SCHEMA");

  for (const note of [
    "vault/01-projects/Example project/Example project.md",
    "vault/02-areas/Example area/Example area.md",
    "vault/03-resources/Example resource/Example resource.md",
    "vault/drafts/Example draft.md",
  ]) {
    const body = readFileSync(path.join(templateDir, note), "utf8");
    assert.ok(body.includes("type:"));
    assert.ok(body.includes("created:"));
    assert.ok(body.includes("updated:"));
  }

  const draft = readFileSync(path.join(templateDir, "vault/drafts/Example draft.md"), "utf8");
  assert.match(draft, /replace or delete/i);
});

test("plan asks the questionnaire in order, holds no personal answers, and shows the default stack", () => {
  const plan = readFileSync(planPath, "utf8");
  const order = [
    "Display name",
    "Path",
    "Off-box copy",
    "Which task connectors will you install",
    "Notion-class product",
    "Live task backend",
    "GTD option",
    "Mail-in-review",
    "Extra inboxes",
    "Write-back",
    "Ladder rung",
    "Graphiti store",
  ];
  let cursor = 0;
  for (const question of order) {
    const next = plan.indexOf(question, cursor);
    assert.ok(next !== -1, `questionnaire missing ${question}`);
    cursor = next + question.length;
  }

  assert.ok(!/mario/i.test(plan), "plan must not hold a personal name");
  assert.ok(!/github\.com\/.+\/.+\.git/.test(plan), "plan must not hold a personal remote");

  assert.ok(plan.includes("Example"));
  assert.ok(plan.includes("/workspace/second-brain/"));
  assert.match(plan, /off-box copy:\s*skip/i);
  assert.match(plan, /connectors:\s*none/i);
  assert.match(plan, /task backend:\s*markdown/i);
  assert.match(plan, /GTD:\s*off/i);
  assert.match(plan, /ladder:\s*JSONL/i);
});

test("filling the worked example emits the default-stack setup prompt and copied tree", () => {
  const destDir = mkdtempSync(path.join(tmpdir(), "second-brain-"));
  const { setupPrompt } = fill({
    answers: WORKED_EXAMPLE,
    planPath,
    templateDir,
    destDir,
  });

  assert.match(setupPrompt, /copy/i);
  assert.match(setupPrompt, /vault-template/);
  assert.ok(setupPrompt.includes(WORKED_EXAMPLE.displayName));
  assert.ok(setupPrompt.includes("Identity"));
  assert.ok(setupPrompt.includes("me"));
  for (const bot of ["Conductor", "Capture", "Memory", "Ops", "Research"]) {
    assert.ok(setupPrompt.includes(bot), `setup prompt missing ${bot}`);
  }
  assert.match(setupPrompt, /group chat/i);
  assert.ok(
    !/create (an |a |the )?chief of staff/i.test(setupPrompt),
    "must not create a Chief of Staff",
  );
  assert.ok(!/mail-in-review/i.test(setupPrompt), "GTD off must not emit mail-in-review");
  assert.ok(
    !/first off-box copy/i.test(setupPrompt),
    "skip must not emit a first off-box copy beat",
  );

  assert.match(setupPrompt, /what's in flight/i);
  assert.match(setupPrompt, /who should go next/i);
  assert.match(setupPrompt, /test capture item/);
  assert.match(setupPrompt, /morning deep work/);
  assert.match(setupPrompt, /buy oat milk/);
  assert.match(setupPrompt, /PARA is not GTD/);
  assert.match(setupPrompt, /append/);
  assert.match(setupPrompt, /\badd\b/);

  const descriptions = extractDescriptions(setupPrompt);
  assert.equal(descriptions.length, 5);
  for (const description of descriptions) {
    assert.ok(description.includes("You share one computer"));
    for (const slot of [
      "Outcome:",
      "Sources:",
      "Constraints:",
      "Deliverable:",
      "Review point:",
      "Never:",
    ]) {
      assert.ok(description.includes(slot), `description missing ${slot}`);
    }
    assert.ok(!description.includes("ledger.jsonl"));
    const rest = description.replace(NEVER_NAME_SENTENCE, "");
    assert.ok(!/\bSQL\b/.test(rest));
    assert.ok(!/Cypher/.test(rest));
    assert.ok(!description.includes("tasks/next.md"));
    assert.ok(!description.includes("tasks/projects.md"));
  }

  const conductor = descriptions.find((text) => text.includes("Conductor") && text.includes("what's in flight"));
  assert.ok(conductor, "Conductor must be what's in flight only");
  assert.ok(!/weekly review/i.test(conductor ?? ""));

  const copied = listFiles(destDir);
  assert.ok(copied.includes("tasks/next.md"));
  assert.ok(!copied.includes("tasks/projects.md"));
  assert.ok(!copied.includes("tasks/waiting.md"));
  assert.ok(!copied.includes("tasks/someday.md"));
  assert.ok(copied.includes("vault/SCHEMA.md"));
  assert.ok(copied.includes("memory/aliases.csv"));

  const aliases = readFileSync(path.join(destDir, "memory/aliases.csv"), "utf8");
  assert.ok(aliases.includes(`${WORKED_EXAMPLE.displayName},me,person`));
  const working = readFileSync(path.join(destDir, "vault/working.md"), "utf8");
  const identity = working.split("# State")[0] ?? "";
  assert.ok(identity.includes(WORKED_EXAMPLE.displayName));
});

const NEVER_NAME_SENTENCE =
  "Never name the ledger file, SQL, Cypher, Graphiti episodes, a plugin, a Notion database, or a task-store path.";

function extractDescriptions(setupPrompt: string): string[] {
  const matches = [...setupPrompt.matchAll(/```description\n([\s\S]*?)```/g)];
  return matches.map((match) => match[1] ?? "");
}
