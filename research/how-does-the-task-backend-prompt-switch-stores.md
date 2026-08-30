# How does the task-backend prompt switch stores?

Fetched 2026-08-30. Official pages only: `docs.x.ai/grok-bot/*`, Cursor's first-party Grok Bot help, Cursor Marketplace listings, and Notion's own MCP docs for surfaces. `docs.x.ai/grok/connectors` is the Grok chat product, not Grok Bot. It is cited only to keep those catalogs apart.

Does not redo [What does official Grok Bot actually allow?](what-does-official-grok-bot-actually-allow.md). That note already covers plans, caps, memory, skills, routines, and the shared computer. This note asks only how next actions get written to Todoist, a Notion-class app, or markdown on the shared computer.

Archived Grok Bot pages under `sources/` (`xai-docs-grok-bot-*.md`, `xai-grok-bot.md`) match the live `docs.x.ai/grok-bot` pages fetched today. They still do not name Todoist, Notion, Obsidian, or a task backend.

## Question

What official Grok Bot / x.ai mechanisms exist for writing next actions to Todoist, Notion-class apps, or markdown files on the shared computer?

## Answer

There is no official task backend and no official store-switch prompt. Grok Bot writes next actions the same way it writes anything else: a named source in the request, a connector if Settings → Plugins has one, otherwise the browser or files on the shared computer. [1][2][3][10]

`docs.x.ai/grok-bot` still publishes no connector inventory. Guessed catalog URLs 404. The in-app Plugins marketplace is where you browse. Cursor Help for Grok Bot names Gmail, Notion, and Slack as examples. Cursor Marketplace lists Cursor-verified Gmail and Todoist plugins and a Notion-authored plugin. None of those pages is a Grok Bot catalog, and none names Obsidian. [4][11][13][14][15][16]

Official memory says keep changing facts in the source system and reopen current data. That is the rule against treating a markdown mirror as live tasks if Todoist or Notion is the store. `/workspace` is the durable file path. There is no official vault path and no published write quota. [5][1][7]

A verb API (create next action, complete, list open, move to list) is not a Grok Bot feature. It is a skill we write on top of whichever store the Bot description names. Nothing in the docs forbids that. Nothing supplies it either. [6][3]

## 1. Connector catalog

**`docs.x.ai/grok-bot` does not publish a list.** Computer-and-apps says open Settings → Plugins, "Browse the available connectors," Add, authenticate, then `@` the connector. Settings calls that surface Marketplace: "discover connectors and packaged skills." Those sentences tell you to look in the app. They do not name Gmail, Todoist, Notion, or Obsidian. [1][4]

Fetched 404s, same as the earlier note:

- `https://docs.x.ai/grok-bot/plugins`
- `https://docs.x.ai/grok-bot/marketplace`

Use-cases say "Connect: email, calendar, CRM" as role advice (Sales Outbound, Talent Scout, Chief of Staff). That is not an installable inventory. [10]

**Cursor Help for Grok Bot does name three services.** The connect-plugins page title line is: "Connect Gmail, Notion, Slack, and other services so agents can use them in chat." The body does not list Todoist or Obsidian. It says browse or search in Plugins, or follow an in-chat Connect card. Team admins can disable marketplace plugins. Zoom is named only as a broken auth case. [11]

**Cursor Marketplace is a Cursor plugin catalog, not a Grok Bot doc page.** Teams docs say Grok Bot follows the existing Cursor plugin and MCP policy, with no separate Grok Bot plugin controls. The marketplace page fetched today lists, among others:

| Listing | Official blurb | Author |
|---|---|---|
| [Gmail](https://cursor.com/marketplace/cursor/gmail) | Search, read, draft, and manage email | Cursor |
| [Google Calendar](https://cursor.com/marketplace) featured | Search events and schedule meetings | (featured row) |
| [Notion](https://cursor.com/marketplace/notion) | Notion Skills + Notion MCP server packaged as a Cursor plugin | Notion |
| [Todoist](https://cursor.com/marketplace/cursor/todoist) | Create, find, and complete tasks and projects | Cursor |

Obsidian does not appear in the marketplace page text fetched today. [13][14][15][16][9]

That table is what those URLs showed. It is not a promise that every Marketplace plugin is installed, enabled, or reachable from Grok Bot's Plugins pane. The Grok Bot pages still say browse the in-app list. [1][11]

**Do not use the Grok chat connector catalog as a Grok Bot catalog.** `docs.x.ai/grok/connectors` is for Grok on grok.com. It publishes a built-in list (Gmail and Google Calendar, Google Drive, OneDrive, Outlook Mail and Calendar, Microsoft Teams, SharePoint, Salesforce) plus a "browse the full catalog at grok.com/connectors" line. Setup is grok.com, not Settings → Plugins. The earlier Grok Bot note already treated `docs.x.ai/grok/*` as a different product. Keep that split. [17]

Product page `x.ai/bot` sells "Connectors" on a SuperGrok tab and "Team marketplace for skills and plugins" on Teams. No service names. [18]

## 2. Plugin vs skill vs computer vs files

Official split:

| Mechanism | How you point a Bot at it | What it is |
|---|---|---|
| Connector / plugin | Settings → Plugins, then `@` in chat. Or a Connect card. | Structured access to a supported service. Prefer this over clicking a website. [1][11] |
| Packaged or saved skill | `/` in the desktop composer. Private skills: Settings → Plugins → Yours, enable per Bot. | Reusable instructions. The Bot may still need the matching connector or login. [3] |
| Browser / computer use | Sign in on the shared computer. Take over for password, 2FA, CAPTCHA. | For services without a connector, or visual work a connector does not expose. [1][2] |
| Files | Ask the Bot to keep durable files in `/workspace` with clear folders. Attachments in the composer. | Shared disk. Not a task API. [1][7] |

First-run "which tools you use" only shapes teammate suggestions. It does not connect those tools. [2]

A strong first task names sources: "Which apps, websites, files, or conversations matter?" The Bot description holds the standing source systems. The message holds the one-off task. [2][5]

Chat: `@` mentions a Bot, group, routine, or connector. `/` references a saved skill. [8][3]

Handoff pattern the docs already use: one Bot owns a source system, another owns the deliverable. [8]

Event triggers (Slack message, GitHub notification) are Cursor account integrations. They are separate from Slack or GitHub plugins. [3]

There is no official "setup prompt that switches Todoist vs Notion vs markdown." Store choice is whatever you put in the description, the `@` mention, and the installed plugins.

## 3. Live source vs markdown mirror

The bots page, in those words: "Memory is not a substitute for an authoritative source." Then: keep changing facts in the source system; ask the Bot to cite or reopen current data for consequential decisions. [5]

Files-and-results: do not rely on a screenshot alone for rapidly changing data. Keep a link or export from the source system when possible. Separate facts found in source systems from assumptions. [7]

Skills-and-routines example: if the source data is unavailable, report the failure instead of using old data. Design rule: include a no-data and stale-data policy. Re-test after a website, connector, or source format changes. Test runs can "change files, and call connected tools." [3]

That is the official stance on a markdown mirror of Todoist or Notion: useful as an export or intermediate folder in `/workspace`, not as the live store of changing facts.

`/workspace` is "useful for intermediate material, but the conversation should still contain the final result or a clear link to it." [7]

## 4. Writing files on the shared computer

What the docs actually say:

- Durable project files go in `/workspace`, in clear project folders. [1]
- Files are visible to every Bot on the account. One Bot can continue from files another Bot saved. [1]
- Files, browser state, and supported sign-ins are meant to survive Update and Recover. Temporary directories, manually installed packages, and uncommitted app state are replaceable. Reset can discard recent unsaved work. [1][12]
- Cursor Help: `rm -rf` inside the box does not delete conversation history. Synced sandbox files rehydrate from a durable server copy on reopen. Local files on the Mac or Windows machine are not covered. [19]
- Auto Review example path: always allow `git status` in `/workspace/reports`. That is an example, not a mandated tree. [6]
- Remove access includes "Remove sensitive project files from `/workspace`." [6]
- Do not save secrets in ordinary files. Use the secure secret card. [20]
- Composer attachments (into a message, not writes on disk): six at a time; 25 MB docs/images/audio; 200 MB video. Supported types include PDF, plain text, Word, Excel, CSV, JSON, YAML, HTML, email files. [7]
- Local computer is a separate permission. Default Ask every time. Use Never allowed unless a Bot has a reason to touch local files. Mario's Linux laptop is not the Grok Bot computer. [1][6]

What is not documented: a `/workspace` quota, a vault path, an Obsidian vault, PARA folders, a lock that only one Bot may write a file, or a ban on markdown task lists.

"Vault" is not an official Grok Bot word. Official memory says vault notes would live in files you put in `/workspace`, or in a tool you sign into. That sentence is from the earlier research note's reading of the same bots page; the live bots page talks about source systems and shared files, not a vault product. [5]

## 5. Notion surfaces

`docs.x.ai/grok-bot` never says Notion, Tasks, database, or wiki.

Cursor Help names Notion as a Grok Bot plugin example. [11]

The Notion Marketplace plugin, authored by Notion, exposes these skills on the public listing (five shown; the page says nine more and does not print them):

- `create-task` — "Create a new task in the user's Notion tasks database" with defaults for due date, status, owner, and project
- `create-page` — new page, optional parent; "structures content based on page type (meeting notes, project pages, etc.)"
- `create-database-row` — insert a row into a specified database
- `database-query` — query by name or ID, optional filters and sorting
- `find` — pages or databases by title keywords [15]

So the official Notion plugin treats **Tasks as a database**, pages as wiki-like documents, and generic databases as a third write path. It does not name a separate "wiki" product.

Notion's own MCP docs (first-party, for any MCP client including Cursor) add tools for search, fetch, create/update pages, create database, create/update views, query data sources, move pages, comments, folders. Example prompt on `notion-update-page`: change a task status from In Progress to Complete. Example on `notion-create-view`: board view on a tasks database. Rate limit: about 180 requests/minute per user, 30 searches/minute. This is Notion's server, not a Grok Bot page. Use it only if the Bot is actually talking to Notion MCP. [21][22]

## 6. Would a task-verb API be impossible?

Official Grok Bot has no create / complete / list-open / move-to-list surface. Next actions are not a product feature. [see earlier note, "What this does not decide"]

Nothing in the docs makes those verbs impossible. They would be a skill (and, if a connector exists, connector tools) pointed at one store named in the Bot description.

Constraints that do exist:

- **No official store.** Todoist is a Cursor Marketplace blurb: create, find, and complete tasks and projects. That page does not document "move to list" or a full API. Notion's listed skill is `create-task` into a tasks database, plus page and database writes. Markdown is ordinary files in `/workspace`. [14][15][1]
- **Prefer connector, else browser, else files.** A verb that needs structured IDs (Todoist project, Notion data source) wants a connector. Without one, the Bot clicks the website. Sites may block automation, expire sessions, or raise a CAPTCHA. [1][2]
- **Approvals.** Deleting or overwriting data, sending, publishing, and production changes are the standing "put a boundary" list. A complete-or-move skill should say when to stop. Test run performs real writes. [6][3]
- **Shared disk.** Every Bot can see and change `/workspace`. Official docs do not assign one writer per file. Collision rules are ours. [1]
- **Memory is not the list.** Do not keep open tasks only in Bot memory. Reopen the source. [5]
- **Idempotent retries** are a routine-design rule, not a store requirement. [3]
- **Hosted MCP tokens** stay on Cursor's backend, not on the computer. Browser logins stay on the computer and are shared. [9][1]

A prompt that switches stores is compatible with the official first-task shape (name the sources). It is not something Grok Bot ships.

## Contradictions with the existing Grok Bot research note

The earlier note scoped itself to `docs.x.ai/grok-bot` and skipped Cursor marketing. This note includes Cursor Help and Marketplace because the teams page ties Grok Bot plugins to Cursor's marketplace.

| Earlier note | This fetch |
|---|---|
| "No official page lists Gmail, Google Calendar, Notion, Obsidian…" | Still true for `docs.x.ai/grok-bot`. False if Cursor Help and Marketplace count: those name Gmail, Notion, Slack, Google Calendar, and Todoist. Obsidian is still unnamed. [11][13] |
| "Plugins… with no published catalog of Gmail or Obsidian." | Gmail is now named on Cursor Help and has a Marketplace listing. Obsidian still has no official listing in the pages fetched. [11][16] |
| "Task backend. Docs never mention Todoist, markdown lists, or GTD." | `docs.x.ai/grok-bot` still never mentions them. Cursor Marketplace now has a Todoist plugin page. Still no GTD and no official markdown task list. [14] |
| "I did not treat Cursor marketing as a fact source." | Cursor Help under `cursor.com/help/grok-bot/` is first-party Grok Bot documentation. Use it for plugin examples. Do not treat the Marketplace inventory as a Grok Bot guarantee. [11][9] |
| Changing facts stay in the source system; `/workspace` is shared disk; no catalog on docs.x.ai; skills `@` / `/` split | Unchanged. Live pages still say this. [5][1][3] |

## What this does not decide

Which store Mario should pick. Official docs do not rank Todoist, Notion, or markdown.

Whether every Cursor Marketplace plugin appears in Grok Bot's Plugins pane. The docs say browse the in-app list and inherit team MCP policy. They do not publish a join table.

The remaining nine Notion Marketplace skills. The listing says "View 9 more" and does not print them.

A Grok chat connector catalog dump. `grok.com/connectors` returned an app shell, not a readable inventory. Even a clean dump would be the wrong product.

## Fetch failures

- `https://docs.x.ai/grok-bot/plugins`, `/marketplace`: 404
- `https://docs.x.ai/grok-bot/*.md` print URLs: 404 today (the earlier note used them)
- `https://grok.com/connectors`: SPA shell, not a readable catalog
- Notion Marketplace "View 9 more": not expanded in the fetch

## Sources

1. SpaceXAI Docs. [Use the computer and apps](https://docs.x.ai/grok-bot/computer-and-apps). Fetched 2026-08-30. Also archived as `sources/xai-docs-grok-bot-computer-and-apps.md`.
2. SpaceXAI Docs. [Get started](https://docs.x.ai/grok-bot/get-started). Fetched 2026-08-30. Also `sources/xai-docs-grok-bot-get-started.md`.
3. SpaceXAI Docs. [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations). Fetched 2026-08-30. Also `sources/xai-docs-grok-bot-skills-routines.md`.
4. SpaceXAI Docs. [Settings and notifications](https://docs.x.ai/grok-bot/settings-and-notifications). Fetched 2026-08-30.
5. SpaceXAI Docs. [Create and manage Bots](https://docs.x.ai/grok-bot/bots). Fetched 2026-08-30. Also `sources/xai-docs-grok-bot-bots.md`.
6. SpaceXAI Docs. [Approvals, security, and privacy](https://docs.x.ai/grok-bot/approvals-security-and-privacy). Fetched 2026-08-30.
7. SpaceXAI Docs. [Files and results](https://docs.x.ai/grok-bot/files-and-results). Fetched 2026-08-30.
8. SpaceXAI Docs. [Message and collaborate](https://docs.x.ai/grok-bot/chat-and-collaboration). Fetched 2026-08-30.
9. SpaceXAI Docs. [Grok Bot for teams and enterprises](https://docs.x.ai/grok-bot/teams-and-enterprises). Fetched 2026-08-30.
10. SpaceXAI Docs. [Use cases](https://docs.x.ai/grok-bot/use-cases). Fetched 2026-08-30.
11. Cursor Help. [Connect plugins](https://cursor.com/help/grok-bot/connect-plugins). Fetched 2026-08-30.
12. SpaceXAI Docs. [Troubleshooting](https://docs.x.ai/grok-bot/troubleshooting). Fetched 2026-08-30.
13. Cursor. [Marketplace](https://cursor.com/marketplace). Fetched 2026-08-30.
14. Cursor Marketplace. [Todoist](https://cursor.com/marketplace/cursor/todoist). Fetched 2026-08-30. Blurb only: create, find, and complete tasks and projects.
15. Cursor Marketplace. [Notion](https://cursor.com/marketplace/notion). Fetched 2026-08-30. Also [notion-workspace](https://cursor.com/marketplace/notion-workspace).
16. Cursor Marketplace. [Gmail](https://cursor.com/marketplace/cursor/gmail). Fetched 2026-08-30.
17. xAI Docs (Grok chat, not Grok Bot). [Connectors](https://docs.x.ai/grok/connectors). Fetched 2026-08-30.
18. SpaceXAI. [Grok Bot product page](https://x.ai/bot). Archived as `sources/xai-grok-bot.md`.
19. Cursor Help. [Recover Grok Bot computer data](https://cursor.com/help/grok-bot/computer-recovery). Fetched 2026-08-30.
20. Cursor Help. [Store secrets securely](https://cursor.com/help/grok-bot/secrets). Fetched 2026-08-30.
21. Notion Developers. [Notion MCP](https://developers.notion.com/docs/mcp). Fetched 2026-08-30.
22. Notion Developers. [Supported tools](https://developers.notion.com/guides/mcp/mcp-supported-tools). Fetched 2026-08-30.
23. SpaceXAI Docs. [Frequently asked questions](https://docs.x.ai/grok-bot/faq). Fetched 2026-08-30. Connector-when-available; sites may block automation.
24. Cursor Help. [Getting started with Grok Bot](https://cursor.com/help/grok-bot/getting-started). Fetched 2026-08-30. Connect card; browser if no plugin.
