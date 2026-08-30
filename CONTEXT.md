# Second brain

A personal knowledge-and-action system run by a small Grok Bot roster against one vault. This repo's job is the consolidation plan for that system, not the running bots.

## Language

**Consolidation plan**:
The destination artifact of this effort: one written plan with rationale, a source archive, and executable steps. It is not the live system.
_Avoid_: spec dump, second brain (for the document), implementation

**Second brain**:
A personal system: vault, write policy, action lists, and a small Grok Bot roster. Anyone may clone the shape and fill identity at setup.
_Avoid_: 26-agent runtime, Aleiah's demo, nervous system, product, Mario's system

**Baseline stack**:
The working hypothesis this plan starts from: five Grok Bots, a markdown vault with YAML properties, a capped working file, an append-only ledger, and GTD as an optional action grammar. Overturn it only when a ticket finds a hole.
_Avoid_: 26 agents, Notion-first, graph database on day one

**Grok Bot**:
One persistent named teammate on the official SpaceXAI product. Official memory is per-bot summaries, not the ledger.
_Avoid_: agent (for a roster member), 26-agent

**Conductor**:
The Grok Bot that briefs, assigns the next task to Capture, Memory, Ops, or Research, and answers the Chief of Staff or the human. It is not the official Chief of Staff. It is not the file owner of the vault, ledger, any inbox, or the task backend.
_Avoid_: Chief, Chief of Staff (for this bot), weekly review (for this bot), Brain, Core

**Chief of Staff**:
The official Grok Bot job the person may already have. It is not on this roster. It asks Conductor when it needs the second brain.
_Avoid_: Conductor, Chief (for this teammate)

**Capture**:
The Grok Bot that is the file owner of every configured inbox. It copies each extra-inbox item into the vault inbox, then proposes the clarify fork from there. That proposal is chat, not a write to the ledger, PARA, task backend, or drafts.
_Avoid_: GTD capture (the step), manage in place

**Memory**:
The named Grok Bot that is the file owner of the ledger and of the working file. Distinct from official per-bot summaries and from the Memory API. Owns write-time consolidate, the monthly decay routine, and the off-box copy when the method is git or cloud.
_Avoid_: official memory (for the teammate), Memory API (for the teammate), Conductor (for ledger writes)

**Ops**:
The Grok Bot that writes next actions to the task backend.
_Avoid_: GTD (for this bot)

**Research**:
The Grok Bot whose job is the reading queue, newsletters, one research question at a time, and content drafts. File owner of drafts. It does not publish.
_Avoid_: Draft (as a sixth bot), send (for this bot)

**Draft**:
An unpublished outgoing text file. Research is the file owner. Publishing is a human act.
_Avoid_: claim, PARA note, sixth bot

**Drafts folder**:
The vault folder of unpublished outgoing text. Research is the file owner of every file in it. Not a PARA folder.
_Avoid_: 05-drafts, Resources (for outgoing text)

**File owner**:
The one Grok Bot allowed to write a given file. The working file has one file owner for the whole file.
_Avoid_: section owner

**Shared computer**:
The one user-scoped Grok Bot cloud VM. Files, cookies, logins, and `/workspace` are visible to every bot on the account. Separate bots are not a security boundary.
_Avoid_: per-bot machine, 26 computers

**Durable snapshot**:
The shared computer's official preserved `/workspace` state. Update and Recover keep it. Reset returns to it and can drop recent unsynced work. It is not a copy the person controls.
_Avoid_: off-box copy, backup (unqualified)

**Skill**:
Reusable instructions for how a Grok Bot does a task. Saved after a one-time run works. Available across bots.
_Avoid_: plugin (for the instructions), prompt dump

**Routine**:
A schedule or event trigger owned by one bot that runs a skill. Test the skill first.
_Avoid_: cron, nightly job (unless you mean a specific routine)

**Inbox**:
A capture bucket Capture owns. There can be more than one. The default setup is the vault inbox only. Extra inboxes are names the person types into the setup questionnaire, not a fixed list.
_Avoid_: mailbox (as the only inbox), Gmail (for the vault inbox), a closed set of inbox types

**Vault inbox**:
The default inbox, and the only place the clarify fork runs. A markdown capture file in the vault.
_Avoid_: inbox (unqualified, when more than one is configured)

**Extra inbox**:
An inbox named at setup besides the vault inbox. Capture copies each item into the vault inbox before the clarify fork.
_Avoid_: a second processing inbox

**Source write-back**:
What Capture writes on an extra inbox when the vault-inbox line is removed: tag, archive, leave, or delete. Chosen per extra inbox at setup. Default is tag. Delete is irreversible.
_Avoid_: manage in place, delete-at-copy

**Clarify fork**:
The moment an inbox item becomes exactly one of: action, reference, or trash. Action and knowledge must not share a record unless the item is truly both. Stays in every GTD option, including off.
_Avoid_: capture everything into memory, file and also task it

**PARA**:
Forte's four vault folders: Projects, Areas, Resources, Archives. Always present. Each project, area, or resource is a folder, not a loose note. Not the GTD projects list.
_Avoid_: GTD (for the folders)

**GTD option**:
Which action grammar the setup questionnaire selects: off, hybrid, or full.
_Avoid_: minimum hybrid, GTD mode, productivity system

**GTD list**:
A named action list that hybrid or full adds. It lives in the task backend.
_Avoid_: GTD folder, project note, claim

**GTD project**:
An outcome in the task backend that needs more than one next action. Not a folder in `01-projects/`.
_Avoid_: project (unqualified), PARA project, project note

**Weekly review**:
The GTD reflect ritual. Hybrid uses a short form. Full uses the official eleven steps. Off does not have one.
_Avoid_: weekly Conductor (for this ritual)

**Mail-in-review**:
A hybrid or full flag. If on, the weekly review includes emptying mail by hand, archive not delete. Default off. No Gmail API. No bot with mail access.
_Avoid_: extra inbox (for this flag), Gmail connector

**Working file**:
The small, rewritten hot-memory document every bot reads at the start of a task. Sections are Identity, State, Decisions, Corrections, People, Dead, and in-flight. Sections are replaced, never appended. Dead is hot-memory for wrong or finished decisions; it is not the ledger's decayed status and does not auto-fill when a claim decays. In-flight is pulled from the live task backend and shaped by the GTD option. Ceiling is four thousand tokens.
_Avoid_: working memory (as a product), context dump, transcript, markdown mirror of Todoist, grave.md

**Ledger**:
The append-only store of durable claims and their provenance, status, and use (`last_used`, `use_count`). Next actions do not belong here.
_Avoid_: knowledge graph, memory database, transcript log

**Claim**:
One durable statement the system is willing to keep, with a status of candidate, current, conflict, or decayed, a time window for when it was treated as true, and use fields (`last_used`, `use_count`) so silence can earn decay.
_Avoid_: memory, note, fact (unless it has passed confirm), episode, triplet

**Source archive**:
Saved copies of the X posts, articles, and docs the plan depends on, so the "why" stays inspectable after links rot. Only load-bearing sources. No reply threads, no unrelated posts.
_Avoid_: bibliography-only, vibe citations

**Vault template**:
The empty cloneable tree: a vault, a memory directory for the ledger, and the markdown task store. Copied onto the shared computer. Not a live vault.
_Avoid_: vault (for this repo), second brain (for the folder)

**Off-box copy**:
A copy of the live second-brain path that is not only on the shared computer. The path is the vault, the ledger directory, and the markdown task store when that store is live. Methods are git remote, a folder on a machine they own, or cloud storage. Skip is an answer.
_Avoid_: local backup, backup (for this copy)

**Task backend**:
Where next actions live. Bots reach it only through the Task API. The template default is the markdown task store. Todoist and Notion-class are the other stores. The questionnaire only offers Todoist or Notion-class if that connector will be installed.
_Avoid_: task database, GTD (for the store), Mario's store

**Task API**:
The only way bots read and write next actions. Verbs are add, complete, and list_open. Hybrid adds list_projects and add_project. Full adds list_waiting, list_someday, and set_list. add may carry an optional due, and on full an optional contexts list. add with an unknown GTD project creates that project, then files the next action. list_open is not-done items on the next list only. set_list drops the GTD-project join. Only Ops may add, complete, add_project, and set_list. Only Memory may list_*, and only to rewrite in-flight. Everyone else reads in-flight from the working file. Prompts never name a file, a plugin, or a Notion database. The setup prompt binds the verbs to the chosen store.
_Avoid_: Todoist tools, grepping tasks/, Notion MCP, set_due, set_context, cancel

**Markdown task store**:
The default task backend: list files in a `tasks/` directory sibling to the vault. Created only when the live store is markdown. Files are `next.md`, plus `projects.md` on hybrid, plus `waiting.md` and `someday.md` on full. A row is a checkbox line, optional `due:YYYY-MM-DD`, and on full optional `#context` tags. A `##` heading in `next.md` is a GTD project and must match a line in `projects.md`. Not a PARA folder. Not a mirror of Todoist or Notion-class.
_Avoid_: GTD folder, vault tasks, unused tasks/ next to a live connector store, YAML frontmatter on list files

**Notion-class**:
A task backend that is one tasks database. A list property holds next, waiting, or someday. GTD project and contexts are properties. complete uses the native done status. Not the vault and not the ledger.
_Avoid_: Notion wiki, Notion second brain, second task store, overloading done with GTD lists

**Memory API**:
The only way bots read and write claims. Verbs are append, get, query, set_status, current, as_of, and related. Only Memory may append and set_status. All five may get, query, current, as_of, and related. The store records use on those five reads: each claim id in a non-empty result gets use_count bumped and last_used set; empty results touch nothing. append starts use_count at 0 and leaves last_used empty until a read. Reader bots do not write use. Decay selection by last_used or recorded_at does not record use. Prompts never name a file, SQL, or Cypher.
_Avoid_: ledger.jsonl, grepping the store, Graphiti tools, add_memory, a use-write verb

**Upgrade ladder**:
The planned store path: JSONL ledger, then SQLite when scans hurt, then Graphiti on Neo4j or FalkorDB when questions are paths or time-travel. The vault and the memory API stay; only the ledger engine changes. Kuzu is not a rung.
_Avoid_: migration rewrite, graph-first, Kuzu

**Display name**:
The person's name asked at setup. Fills the `aliases.csv` `me` row and the working-file Identity section. Required. No default.
_Avoid_: Mario, a baked identity in the repo

**Setup questionnaire**:
The questions that pick a concrete version: display name, path on the shared computer, off-box copy, which connectors will be installed, task backend, GTD option, mail-in-review, extra inboxes and write-back, ladder rung, and Graphiti store if that rung. It lives in `PLAN.md` as one template with slots. It does not run the bots. It does not ask plan, timezone, or which app talks to the bots. It holds no personal answers.
_Avoid_: installer, wizard (unless it only asks), one file per combination, official client (as a question), Mario appendix

**Bot prompt**:
The official Grok Bot description for one roster member. A shared preamble plus that bot's outcome, sources, constraints, deliverable, review point, and never-do. Setup interpolates the GTD option, extra inboxes, source write-back, Task API verbs, and off-box copy method. Not a skill, not a routine, and not the first-task test.
_Avoid_: system prompt, skill (for the standing text), six prompts

**Review point**:
The standing stop in a bot prompt. Stop before send, publish, set_status off a live status (candidate, current, or conflict), a Task API write that turn did not already approve, the first off-box copy, or an off-box copy method change. Capture's clarify-fork yes is approval for the Ops write. A monthly Memory decay routine proposes unused-30-day current claims as decayed and waits for the same stop before set_status.
_Avoid_: weekly review (for this stop)

**First-task test**:
A canned first task in the setup prompt that checks one bot prompt. Pass is the deliverable plus the never-do. Fail means fix the description. Not a skill. Not the first off-box copy.
_Avoid_: routine, description (for this text), smoke test (unless you mean all five in one chat), first off-box copy

**Setup prompt**:
The generated instructions an agent can follow to stand up the chosen version: files, bot prompts, routines, and the method-specific first off-box copy after the bots exist. One template with slots, not a document per combination. Assumes Grok Bot already works and uses the account timezone already set.
_Avoid_: the consolidation plan (the plan is the source; this is the derived how-to)
