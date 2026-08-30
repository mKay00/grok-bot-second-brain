# Baseline

This install predates plan versioning, or is catching up to the first stamped shape.

## Before file transforms

1. Confirm `install/answers.json` exists on the live path and matches the setup questionnaire (display name, path, off-box copy, connectors, task backend, GTD option, mail-in-review, extra inboxes, ladder rung, Graphiti store if needed).
2. If `install/answers.json` is missing, stop. Re-ask the questionnaire in `PLAN.md`, write that file, then re-run this upgrade. Do not invent required slots.

## File transforms

No tree rewrite. The live path already matches `vault-template/` for this baseline.

## After

Write `install/plan-version` to `1`. Leave `install/prompts-version` unchanged unless a later step says to re-paste descriptions.
