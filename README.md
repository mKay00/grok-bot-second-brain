# Five Grok Bots, one vault

This repo is the plan for a personal knowledge-and-action system on [Grok Bot](https://x.ai/bot). Five named teammates share one vault: Conductor assigns, Capture processes inboxes, Memory keeps claims and the working file, Ops writes next actions, Research writes drafts. You publish. You send.

It is not a live second brain and not an installer that clicks the official UI for you. After setup, the live tree sits on the shared Grok Bot computer. This repo stays the cloneable shape.

Five is the point. A 26-bot roster is the thing this plan refuses.

## Start here

Give a Grok Bot this URL and tell it to set the repo up:

`https://github.com/mKay00/grok-bot-second-brain`

That bot reads this file, asks you the questions in `PLAN.md`, copies the vault template, and walks you through the clicks it cannot do. It is a setup helper. It is not a sixth roster member. Keep it out of the group.

Talk to Grok Bot from a Mac, Windows box, or iPhone. There is no official Linux desktop app. Creating bots, teach-a-task, and routines need the desktop app.

## Set it up

Do this if you are the Grok Bot that was handed this repo. Read `PLAN.md` before you ask anything. Match `src/fill.ts` when you interpolate. Use the words in `CONTEXT.md`.

1. **Land the repo on the shared computer.** Clone it if it is not already there. Done when `PLAN.md` and `vault-template/` are on disk you can read.
2. **Ask the questionnaire in `PLAN.md`, in that order.** Warn that a Reset can wipe the path before they pick an off-box copy. Display name, off-box copy, and GTD option have no default. Inventing those is a failed setup. Skipped slots use the defaults in `PLAN.md`. Done when every required answer came from the human.
3. **Emit the setup prompt.** Fill the `PLAN.md` templates the way `src/fill.ts` does. Do not write a new grammar. Done when the five descriptions and the first-task tests are in chat.
4. **Copy the empty tree.** Copy `vault-template/` onto the chosen path (default `/workspace/second-brain/`). Keep `tasks/` only when markdown is the live store. Drop unused GTD list files. Write the display name into the `me` row and the working-file Identity section. Write `install/answers.json`, `install/plan-version`, and `install/prompts-version` (latest plan migration). Stand up Neo4j or FalkorDB only on the Graphiti rung. Done when that path exists and Identity matches the display name.
5. **Connectors first.** If they picked Todoist or a Notion-class product, they install that connector in Settings before any roster bot exists. Done when they say it is installed, or they picked none.
6. **Create the five bots.** They use New → Create new agent → Bot actions → Edit Profile. You paste Conductor, Capture, Memory, Ops, and Research, one description each. Leave an existing Chief of Staff out of this group and tell it to ask Conductor. Done when those five exist with the interpolated descriptions.
7. **One group chat** with those five only. Done when the room exists.
8. **Routines** the answers require. Every GTD option: monthly Memory decay (`current` unused 30 days proposed `decayed`). Hybrid or full: weekly review on Conductor. Git or cloud: daily Memory copy that no-ops if the path has not changed. Folder and skip: no copy routine. This step needs the desktop app. Done when those routines exist.
9. **First-task tests** from the emitted setup prompt. Pass is the deliverable plus the never-do. Fail means fix that description, then rerun that test. Done when all five pass.
10. **First off-box copy** if they did not pick skip. Stop and get a yes. Memory pushes or uploads for git or cloud. They copy on their own machine for folder. Done when a copy of the path exists off this computer, or skip was the answer.

Then stop. Day to day happens in the group, not with you.

## After setup

Talk in the group. Drop capture into the vault inbox. Capture proposes action, reference, or trash. A yes on action is Ops's write. A yes on reference is Memory filing a PARA note. Memory rewrites the working file and appends claims as `candidate`. Conductor answers what is in flight and who goes next. Research stops at a draft. You publish and send.

## Upgrade

When this repo changed after you already set up, give the same URL to a setup-helper bot again and tell it to upgrade (not a roster member).

1. **Land the latest repo** on the shared computer (`git pull` or a fresh clone you can read).
2. **Read `install/plan-version`** on the live path (missing means `0`). If it is ahead of this repo's latest plan migration, stop and land a newer clone. Never downgrade.
3. **Emit the upgrade prompt** the way `src/upgrade.ts` does (same template slots as `PLAN.md`). Need `install/answers.json`; if missing, re-ask the questionnaire and write it first.
4. **Apply pending folders under `migrations/`** in order. Follow each `steps.md`. Run `up.sh` only when that folder has one. After each plan migration's file transforms succeed, write `install/plan-version` to that number.
5. **Re-paste all five bot descriptions** only when the upgrade prompt includes the Descriptions section. Then write `install/prompts-version` to the new plan version.

Upgrade-ladder rung cutovers (JSONL → SQLite → Graphiti) are not plan migrations.

## What you need

An eligible plan: SuperGrok Plus, SuperGrok Heavy, Cursor Pro+, Cursor Ultra, or Cursor Teams Standard or Premium. Grok Bot already works. Setup uses the account timezone already set.

A Reset on the shared computer can wipe recent work. Git, folder, or cloud is how you keep a copy you control. Skip means you accepted that.

## Files

| File | What it is |
| --- | --- |
| `PLAN.md` | Why five bots, the questionnaire, the templates, the setup and upgrade prompts |
| `vault-template/` | Empty vault, ledger directory, markdown task store |
| `migrations/` | Ordered plan migrations (`steps.md`, optional `up.sh`) for existing installs |
| `src/fill.ts` | How setup interpolation must come out. The tests are the contract |
| `src/upgrade.ts` | How the upgrade prompt must come out |
| `CONTEXT.md` | Glossary. Prefer these words over synonyms |
