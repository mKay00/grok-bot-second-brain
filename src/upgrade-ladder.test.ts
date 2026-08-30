import assert from "node:assert/strict";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { fill, WORKED_EXAMPLE, type Answers } from "./fill.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const templateDir = path.join(root, "vault-template");
const planPath = path.join(root, "PLAN.md");

const SQLITE = {
  ...WORKED_EXAMPLE,
  ladderRung: "sqlite",
} as const satisfies Answers;

const GRAPHITI_NEO4J = {
  ...WORKED_EXAMPLE,
  ladderRung: "graphiti",
  graphitiStore: "neo4j",
} as const satisfies Answers;

const GRAPHITI_FALKORDB = {
  ...WORKED_EXAMPLE,
  ladderRung: "graphiti",
  graphitiStore: "falkordb",
} as const satisfies Answers;

const MEMORY_API_VERBS = [
  "append",
  "get",
  "query",
  "set_status",
  "current",
  "as_of",
  "related",
] as const;

test("JSONL and SQLite do not stand up Neo4j or FalkorDB", () => {
  for (const answers of [WORKED_EXAMPLE, SQLITE]) {
    const prompt = fillPrompt(answers);
    assert.match(prompt, /do not stand up/i);
    assert.ok(!/stand up Neo4j only/i.test(prompt));
    assert.ok(!/stand up FalkorDB only/i.test(prompt));
  }
  assert.match(fillPrompt(WORKED_EXAMPLE), /ladder rung is JSONL/i);
  assert.match(fillPrompt(SQLITE), /ladder rung is SQLite/i);
});

test("Graphiti stands up Neo4j only when that store is chosen", () => {
  const prompt = fillPrompt(GRAPHITI_NEO4J);
  assert.match(prompt, /stand up Neo4j only/i);
  assert.ok(!/stand up FalkorDB/i.test(prompt));
});

test("Graphiti stands up FalkorDB only when that store is chosen", () => {
  const prompt = fillPrompt(GRAPHITI_FALKORDB);
  assert.match(prompt, /stand up FalkorDB only/i);
  assert.ok(!/stand up Neo4j/i.test(prompt));
});

test("the plan names Memory API verbs, claim fields, and when later rungs earn their keep", () => {
  const plan = readFileSync(planPath, "utf8");
  for (const verb of MEMORY_API_VERBS) {
    assert.ok(plan.includes(`\`${verb}\``), `plan missing Memory API verb ${verb}`);
  }
  assert.match(plan, /only Memory may `append` and `set_status`/i);
  assert.match(plan, /all five may/i);
  assert.match(
    plan,
    /a claim carries id, statement, status \(candidate \/ current \/ conflict \/ decayed\), entities, valid_from, valid_to, recorded_at, provenance, supersession links, `last_used`, and `use_count`/i,
  );
  assert.match(plan, /`append` starts `use_count` at 0/i);
  assert.match(plan, /store records use on `get`, `query`, `current`, `as_of`, and `related`/i);
  assert.match(plan, /next actions stay out of the ledger/i);
  assert.match(plan, /vault notes stay markdown/i);
  assert.match(plan, /one to three thousand claims/i);
  assert.match(plan, /paths or time-travel/i);
});

test("prompts never name the ledger file, SQL, Cypher, or Graphiti episodes", () => {
  const prompt = fillPrompt(WORKED_EXAMPLE);
  const descriptions = extractDescriptions(prompt);
  assert.equal(descriptions.length, 5);
  for (const description of descriptions) {
    const rest = description.replace(NEVER_NAME_SENTENCE, "");
    assert.ok(!rest.includes("ledger.jsonl"));
    assert.ok(!/\bSQL\b/.test(rest));
    assert.ok(!/Cypher/.test(rest));
    assert.ok(!/episode/i.test(rest));
    for (const verb of MEMORY_API_VERBS) {
      assert.ok(description.includes(`\`${verb}\``), `description missing Memory API verb ${verb}`);
    }
    assert.match(description, /only Memory may `append` and `set_status`/i);
  }
});

test("Kuzu is absent from the questionnaire and the plan", () => {
  const plan = readFileSync(planPath, "utf8");
  assert.ok(!/kuzu/i.test(plan), "PLAN.md must not name Kuzu");
});

test("the off-box copy still excludes the Graphiti store on the Graphiti rung", () => {
  const gitGraphiti = {
    ...GRAPHITI_NEO4J,
    offBoxCopy: { kind: "git", remoteUrl: "git@example.com:example/second-brain.git" },
  } as const satisfies Answers;
  const prompt = fillPrompt(gitGraphiti);
  assert.match(prompt, /Graphiti store is not/i);
});

const NEVER_NAME_SENTENCE =
  "Never name the ledger file, SQL, Cypher, Graphiti episodes, a plugin, a Notion database, or a task-store path.";

function fillPrompt(answers: Answers): string {
  const destDir = mkdtempSync(path.join(tmpdir(), "second-brain-ladder-"));
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
