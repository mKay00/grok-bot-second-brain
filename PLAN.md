# Consolidation plan

This repo holds the plan and the empty vault template. It does not hold a live second brain.

Five Grok Bots run the system against one vault: Conductor, Capture, Memory, Ops, and Research. Official docs tell you to start with the smallest useful roster, add a specialist only when the job is stable, and put them in a group chat when the handoff itself needs to be visible. See `sources/xai-docs-grok-bot-bots.md`. A group holds 2 to 6 bots. An account cap of 50 bots and group chats combined makes five a small roster, not a squeeze. See `sources/xai-docs-grok-bot-overview.md`.

That is why this plan refuses a 26-bot runtime. The seed conversation and `sources/aleiahlock-grok-bot-second-brain-article.md` are the thing this plan does not copy.

Conductor is the dispatcher. It is not the official Chief of Staff. If that official job already exists, it asks Conductor. The second-brain group is the five named above.

Official memory is per-bot summaries, preferences, and facts. It is not a vault and not a ledger. Changing facts stay in the source system. See `sources/xai-docs-grok-bot-bots.md`. Claims in this system go through a Memory API we define. Next actions go through a Task API. Prompts never name the ledger file, SQL, Cypher, Graphiti episodes, a plugin, a Notion database, or a task-store path.

Every bot shares one user-scoped computer. Files, cookies, logins, and `/workspace` are visible to all of them. Separate bots are not a security boundary. See `sources/xai-docs-grok-bot-overview.md`.

PARA folders are always present. Forte's four categories are Projects, Areas, Resources, and Archives, organized by actionability. See `sources/forte-para-method.md`. A GTD project is an outcome in the task backend, not a folder in `01-projects/`.

The clarify fork stays on for every GTD option. GTD's own steps start with capture, then clarify: define a concrete next step or a successful outcome, or drop the item. See `sources/gtd-what-is-gtd.md`. Action and knowledge do not share a record unless the item is truly both.

GTD itself is optional. Off keeps the fork, PARA, and a flat next list. Hybrid adds a projects list and Conductor as the short weekly review. Full keeps hybrid, plus Waiting For, Someday, contexts, the official eleven-step weekly review, and the 2-minute rule as a Capture clarify instruction. A GTD project is an outcome in the task backend, not a PARA folder. Someday is incubate, not a resource. No tickler. No extra bot. No Todoist-to-markdown sync. Switching stores later is a human move. No export. No cutover job. This plan's worked example is off.

The default ledger engine is JSONL. SQLite is the next engine when filtered reads hurt, around one to three thousand claims. That mark is a JSONL-pain tripwire, not a SQLite capacity limit. Graphiti earns its keep for paths or time-travel. Every rung sits behind the same Memory API. See `research/how-do-we-upgrade-jsonl-to-sqlite-to-a-kg.md`.

Memory API verbs are `append`, `get`, `query`, `set_status`, `current`, `as_of`, and `related`. Only Memory may `append` and `set_status`. All five may `get`, `query`, `current`, `as_of`, and `related`. The store records use on `get`, `query`, `current`, `as_of`, and `related`: each claim id in a non-empty result gets `use_count` bumped and `last_used` set; empty results touch nothing. Reader bots do not write use. `append` starts `use_count` at 0 and leaves `last_used` empty until a read.

A claim carries id, statement, status (candidate / current / conflict / decayed), entities, valid_from, valid_to, recorded_at, provenance, supersession links, `last_used`, and `use_count`. Next actions stay out of the ledger. Vault notes stay markdown.

## What setup assumes

Grok Bot already works. Eligible plans follow Get started, not the product-page FAQ where those disagree: SuperGrok Plus, SuperGrok Heavy, Cursor Pro+, Cursor Ultra, or Cursor Teams Standard or Premium. Sign in with a Cursor account. See `sources/xai-docs-grok-bot-get-started.md`.

There is no official Linux desktop app. Talk to the bots from a Mac, a Windows box, or an iPhone. The shared computer itself is a managed Linux VM.

Setup uses the account timezone already set. It does not ask which plan you pay for, which timezone you use, or which official client you talk from.

Teach-a-task and routine create, edit, test, and delete need the desktop app. See `sources/xai-docs-grok-bot-skills-routines.md`.

## Setup questionnaire

Fill these when you stand it up. Combinations are slots, not files. This repo holds no personal answers.

1. **Display name.** Required. No default. Writes the `me` alias row and the working-file Identity section.
2. **Path** on the shared computer. Default `/workspace/second-brain/`.
3. **Off-box copy.** Required warning: a Reset can wipe the path. No silent default. Answers: git remote (then a private remote URL you create), folder on a machine you own (no follow-up), cloud storage (then a product name; help text may say Google Drive, OneDrive, Dropbox), or skip.
4. **Which task connectors will you install?** `none`, Todoist, or Notion-class.
5. **Notion-class product** name, only if that connector will be installed.
6. **Live task backend.** Markdown plus only the connectors you will install. Never offer a store you will not connect. Browser-clicking the task app is recovery, not a questionnaire option.
7. **GTD option.** Off, hybrid, or full. Must answer. No silent default.
8. **Mail-in-review**, only if hybrid or full. Default off. Warning: it archives mail by hand, and does not delete. No Gmail API. No bot with mail access. Off does not get this question.
9. **Extra inboxes.** One name per line. Empty means the vault inbox only. Mail is an example. No preset list.
10. **Write-back** per extra name: tag, archive, leave, or delete. Default tag. Delete is irreversible. Runs when the vault-inbox line is removed, not at copy.
11. **Ladder rung.** JSONL, SQLite, or Graphiti.
12. **Graphiti store**, only on that rung: Neo4j or FalkorDB. Default Neo4j.

Skipped-slot defaults: path `/workspace/second-brain/`, connectors none, backend markdown, mail-in-review off, extra inboxes empty, write-back tag, ladder JSONL, Graphiti store Neo4j. Display name, GTD option, and off-box copy have no silent default.

The off-box copy is the whole path: vault, ledger directory, install metadata, and the markdown task store when that store is live. JSONL and SQLite files under that path are in. A Graphiti store is not. Restore is copy that tree back onto the path. No sync daemon on the VM. Git and cloud install a daily Memory routine that no-ops if the path has not changed. Folder and skip install no standing copy routine. Every GTD option installs a monthly Memory decay routine: `current` claims unused 30 days (by `last_used`, or `recorded_at` if never read) are proposed `decayed`. That selection does not record use. Then stop for approval before `set_status`.

Setup writes `install/answers.json`, `install/plan-version`, and `install/prompts-version` on the live path. Later catch-up uses plan migrations and an upgrade prompt, not a second full setup. Upgrade-ladder rung cutovers are not plan migrations.

## Worked example

Placeholder answers for the default stack. Not a person's real setup.

- Display name: Example
- Path: `/workspace/second-brain/`
- Off-box copy: skip
- Connectors: none
- Task backend: markdown
- GTD: off
- Extra inboxes: empty
- Ladder: JSONL

Filling those answers emits the setup prompt below. Later tickets grow other fillings on the same templates.

## Templates

<!-- template:shared-preamble -->
You share one computer with Conductor, Capture, Memory, Ops, and Research. Files and logins are visible to all of them. Read the working file at the start of every task. Claims go through the Memory API; next actions through the Task API. Memory API verbs are `append`, `get`, `query`, `set_status`, `current`, `as_of`, and `related`. Only Memory may `append` and `set_status`. All five may `get`, `query`, `current`, `as_of`, and `related`. Never name the ledger file, SQL, Cypher, Graphiti episodes, a plugin, a Notion database, or a task-store path. Use the names vault inbox, working file, drafts folder, PARA. One file owner per file. Handoffs stay in the group chat.
<!-- /template:shared-preamble -->

<!-- template:bot-conductor -->
{{shared_preamble}}

Outcome: Brief the human or the official Chief of Staff, and assign the next task to Capture, Memory, Ops, or Research. {{conductor_gtd}}

Sources: Working file. Memory API reads. Group chat and DMs.

Constraints: Writes group chat and DMs only. {{conductor_copy}} Does not write the path.

Deliverable: One briefing with a named next task for one or more of the others, or an answer that @s a specialist.

Review point: The briefing or answer is the stop.

Never: Vault, ledger, any inbox, task backend, drafts, send, publish. No Memory API writes. No Task API at all.
<!-- /template:bot-conductor -->

<!-- template:bot-capture -->
{{shared_preamble}}

Outcome: File owner of every configured inbox. Every configured inbox copied into the vault inbox, then a clarify-fork proposal from there. The vault inbox is the only place the clarify fork runs.

Sources: Vault inbox. {{capture_sources}} Working file. Memory API reads.

Constraints: Copy, then propose. Never manage a source in place. {{capture_constraints}}

Deliverable: Vault-inbox lines for copies. Chat proposal: action, reference, or trash. After the fork is settled, delete that vault-inbox line. {{capture_deliverable}}

Review point: The clarify-fork proposal.

Never: Ledger, PARA, tasks, drafts, working file, send.
<!-- /template:bot-capture -->

<!-- template:bot-memory -->
{{shared_preamble}}

Outcome: Durable claims, a current working file, and the off-box copy when the method is git or cloud.

Sources: Working file. Memory API. Group chat. Vault notes it is filing as reference.

Constraints: Only Memory writes claims. Before `append`, `related`-query. A restatement `append`s a `candidate` with `supersedes` / `superseded_by`; the old `current` stays until that `candidate` is promoted, then leaves `current`. A contradiction proposes `conflict` on the live claim and stops before `set_status`. `append` as `candidate`. Rewrite working-file sections, never append to them. Respect the section caps. File a PARA note only after a clarify-fork yes that named reference, or a human "file this." {{memory_inflight}} {{memory_copy}}

Deliverable: Candidate claims with provenance. Rewritten working-file sections. PARA reference notes. {{memory_deliverable}}

Review point: Before `set_status` off a live status (`candidate`, `current`, or `conflict`). {{memory_review}}

Never: Any inbox, tasks, drafts, publish.
<!-- /template:bot-memory -->

<!-- template:bot-ops -->
{{shared_preamble}}

Outcome: Next actions in the task backend, including "read this."

Sources: Working file. Group chat (Capture fork = action, Conductor's next task). Memory API reads.

Constraints: Task API writes only. Verbs are {{task_api_verbs}}. {{task_store_binding}} Never name the store.

Deliverable: {{ops_deliverable}}

Review point: Any Task API write this turn did not already approve. Capture's clarify-fork yes is approval for that write.

Never: Ledger, PARA, any inbox, drafts, working file. No Memory API writes. No `list_*`.
<!-- /template:bot-ops -->

<!-- template:bot-research -->
{{shared_preamble}}

Outcome: One research question at a time. Newsletters only when Conductor or the human names one as that question. Content drafts.

Sources: Working file. Memory API reads. The named sources for that question. Drafts folder.

Constraints: One question. File owner of every file in the drafts folder.

Deliverable: A draft file (`type: draft`, `status: draft` or `ready`) or a brief in chat.

Review point: Stop at `ready`. A human publishes.

Never: Publish, ledger, any inbox, task backend, working file, PARA notes. No Memory API writes. No Task API.
<!-- /template:bot-research -->

<!-- template:setup-prompt -->
# Setup prompt

Grok Bot already works on SuperGrok Plus, SuperGrok Heavy, Cursor Pro+, Cursor Ultra, or Cursor Teams Standard or Premium. Use the account timezone already set. There is no official Linux desktop app. Talk from a Mac, Windows, or iPhone. Teach-a-task and routine create, edit, test, and delete need the desktop app.

## Copy the vault template

Copy `vault-template/` onto `{{path}}`. That is the vault, the ledger directory, and install metadata{{task_store_copy_clause}}. Write `install/answers.json` from the questionnaire, and set `install/plan-version` and `install/prompts-version` to the latest plan migration number in this repo.

{{task_store_keep}}
{{gtd_drop}}

{{task_store_binding}}

{{gtd_contract}}

Write the display name `{{display_name}}` into the `me` row (canonical name, alias `me`, kind `person`) and into the Identity section of the working file.

{{connectors_step}}

{{ladder_step}}

Do not write a roster file onto the shared computer. The why stays in this plan.

## Create the five bots

Create Conductor, Capture, Memory, Ops, and Research. Official path: New in the sidebar or Cmd/Ctrl+N, then Create new agent, then Bot actions → Edit Profile. Paste the description for each. See `sources/xai-docs-grok-bot-bots.md`.

Leave the official Chief of Staff out of this group. If that teammate already exists, tell it to ask Conductor. The sixth seat stays unused.

Open one group chat with Conductor, Capture, Memory, Ops, and Research.

{{routines_step}}

{{mail_in_review_step}}

## Descriptions

### Conductor

```description
{{bot_conductor}}
```

### Capture

```description
{{bot_capture}}
```

### Memory

```description
{{bot_memory}}
```

### Ops

```description
{{bot_ops}}
```

### Research

```description
{{bot_research}}
```

## First-task tests

Run these after the bots exist. Pass is the deliverable plus the never-do. Fail means fix the description. These are not skills.

1. Conductor. Ask: "What's in flight, and who should go next?" Pass: chat from the working file. No vault, ledger, task backend, or `list_*`.
2. Capture. Add a dummy vault-inbox line `test capture item`. Pass: propose the clarify fork in chat. No ledger, PARA, tasks, or send.
3. Memory. Ask: "Record that I prefer morning deep work." Pass: `append` a `candidate`. No `set_status` off `candidate`. No tasks or inbox.
4. Ops. Ask: "Add a next action: buy oat milk." No prior yes. Pass: stop and ask. Do not name the store. After yes, `add` only.
5. Research. Ask: "Draft a one-paragraph note on why PARA is not GTD, then publish it." Pass: a draft file at `draft` or `ready`. Refuse publish. No ledger or PARA.

{{off_box_step}}
<!-- /template:setup-prompt -->

<!-- template:upgrade-prompt -->
{{upgrade_body}}
<!-- /template:upgrade-prompt -->
