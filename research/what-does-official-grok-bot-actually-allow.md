# What does official Grok Bot actually allow?

Issue: [What does official Grok Bot actually allow?](https://github.com/mKay00/grok-bot-second-brain/issues/3)

Fetched 2026-08-30. Official pages only. The Grok share is used in the contradictions section, not as a source of facts.

## Question

What do current official SpaceXAI / x.ai Grok Bot docs say about access plans, bot limits, the shared computer, memory, skills, routines, plugins, and how to create a bot?

## Answer

Five Grok Bots on one shared computer is what the product is built for. There is no hole in that baseline.

A Bot is one persistent named teammate. Every Bot on an account shares one user-scoped cloud computer: files, cookies, logins, and `/workspace`. Separate Bots are not a security boundary. Start with the smallest useful roster. Cap is 50 Bots and group chats combined, so five is nowhere near a limit. [1][2][4][5]

The setup pages name these eligible plans: SuperGrok Plus, SuperGrok Heavy, Cursor Pro+, Cursor Ultra, and Cursor Teams Standard or Premium. Sign in with a Cursor account. There is no Linux desktop app. [3][7][12]

Official "memory" is per-Bot preferences, facts, and summaries. It is not a user vault, not a ledger, and not an authoritative source. Changing facts stay in the source system. The project's Memory API and vault are objects we add on top. [4]

A repeatable job is a skill plus a routine. Run the task once, save the method, test it, then schedule it. Plugins are connectors and packaged skills in Settings, account-wide, with no published catalog of Gmail or Obsidian. [5][6]

The product page FAQ currently lists a wider plan set than the docs, and it still says enterprise is a waitlist. Trust `docs.x.ai` for executable steps. Treat `x.ai/bot` as marketing that has not been updated in lockstep. [14][3][7]

## Access plans

`docs.x.ai` repeats one list.

**Individuals, from Get started, FAQ, and iOS.** SuperGrok Plus, SuperGrok Heavy, Cursor Pro+, Cursor Ultra. Sign in with the Cursor account. [3][7][12]

**Teams, from Get started, FAQ, and the teams page.** Cursor Teams Standard or Premium seats include Grok Bot. Self-serve teams are available. Enterprise access is rolling out. Contact the Cursor account team. [3][7][13]

**Also on the teams page only.** Individuals may use a one-time trial. [13]

Grok Bot is not sold as its own product. It is included on those plans. Subscriptions include weekly usage. Eligible non-enterprise accounts can add on-demand usage billed from model and token cost. If you hold both a Cursor and a SuperGrok subscription, Grok Bot uses whichever has more usage. The docs do not publish a weekly token number. [7][11]

**Dollar amounts.** The docs pages do not state prices. On 2026-08-30 the `x.ai/bot` pricing widget showed $20/month with Cursor Pro selected, $30/month with SuperGrok selected, and $40/seat/month for Cursor Teams. I did not cycle the Pro+ / Ultra / Plus / Heavy tabs, so I will not assign those prices. Nothing on the official pages I fetched says $200 or $300. [14]

**Product-page FAQ disagrees.** The JSON-LD on `x.ai/bot` says Grok Bot is accessible today for Cursor Pro, Pro+, and Ultra, SuperGrok, SuperGrok Plus, and Heavy, and Cursor Standard and Premium Teams. That adds Cursor Pro and SuperGrok without Plus, which Get started does not name. The same FAQ says enterprise is "soon" and points at a waitlist. The docs FAQ already says self-serve Teams seats include Grok Bot. For the consolidation plan, use the Get started list. Flag the product FAQ as stale where it conflicts. [14][3][7]

**Account and seat notes.**

- Sign-in is Cursor, including SSO when the org requires it. [3]
- Legacy Privacy Mode blocks Grok Bot. Cloud data storage is required. [3][8]
- Team admins can enable or disable Grok Bot in the Cursor dashboard. Members request access from the app. [13]
- Grok Bot has no model picker. Model choice is managed by the product. Settings mentions a Default Model control "when model selection is available." The teams page is blunter: no admin or user choice is planned. [11][13]
- Invoices combine Cursor and Grok Bot charges. There is no Grok Bot-specific spend cap yet. [13]

**Platforms.** Desktop is macOS (Apple silicon and Intel) and Windows (x64 and Arm64). iPhone is iOS 18 or later. Linux desktop, Android, and iPad are not supported at initial launch. The shared computer itself is a managed Linux VM. Mario's Linux machine can hold a vault. It cannot run the Grok Bot app. Use a Mac, a Windows box, or an iPhone to talk to the Bots. [3][7][12][13]

## Bot limits

Numbered caps the docs actually state:

| Cap | Number | Where |
|---|---|---|
| Bots and group chats combined, per account | 50 | Create and manage Bots [4] |
| Bots in one group chat | 2 to 6 | Message and collaborate [9] |
| Computer-use tasks per Bot screen | 1 at a time | Computer, FAQ [5][7] |
| Routines one Bot can own | 50 | Skills and routines [6] |
| Run records kept per routine | 20 most recent | Skills and routines [6] |
| Teach-a-task recording | 10 minutes | Skills and routines, FAQ [6][7] |
| Desktop attachments per send | 6 | Files and results [10] |
| Attachment size | 25 MB docs/images/audio, 200 MB video | Files and results [10] |

Not numbered anywhere I read: memory size, vault size, `/workspace` quota, concurrent Bots thinking, weekly token allowance.

Several Bots can reason, use connectors, and work with files in parallel. Each Bot gets its own screen. The one-task-per-screen rule is the concurrency limit that matters for browser work. [5][7]

Hiding a Bot does not pause it or its routines. Deleting a Bot removes its profile, conversation, and routines. Shared-computer files and sign-ins may remain. [4]

## Shared computer

One computer per user, not per Bot. The teams page says it again for orgs: each member gets one dedicated cloud computer, a managed Linux VM. All of that member's Bots share it. [1][5][13]

What is shared across every Bot on the account:

- Browser cookies and signed-in sessions
- Files, including `/workspace`
- Command-line credentials
- Installed connectors. Account-wide, not isolated to one Bot. [5]

What is not a security boundary: a second Bot, a second screen, a group chat, a share link. Screens are separate work surfaces. A login or file placed on the computer is available to all of your Bots. Do not put a credential on it if another Bot should not be able to use it. [1][5][8]

`/workspace` is the durable project directory. Ask Bots to keep lasting files there in clear folders. Files, browser state, and supported sign-ins are meant to survive Update and Recover. Temporary directories, manually installed packages, and uncommitted app state are replaceable. Reset can discard recent unsaved work. [5][16]

The conversation should still hold the final result or a link to it. `/workspace` is a shared disk, not a substitute for a reviewable deliverable. [10]

The Grok Bot computer is not your laptop. Local commands need a separate permission. Default is Ask every time. Use Never allowed unless a Bot has a reason to touch local files. Closing the laptop does not stop cloud work. [5][8][7]

Sharing a Bot copies configuration. It does not copy the computer, logins, or conversation history. [4][15]

## Memory

Official memory is small and per-Bot.

A Bot can retain stable working preferences, important facts, and summaries from its work, so it can keep a role without replaying every prior message. Named Bots also keep files, browser sessions, and preferences across turns. Duplicate copies profile, settings, enabled skills, routines, and avatar. It does not copy conversation history, learned memory, or chat attachments. [4][1]

Memory is not a substitute for an authoritative source. The docs say that in those words. Keep changing facts in the source system. Ask the Bot to cite or reopen current data for consequential decisions. Correct stale assumptions directly. Put safety boundaries in the Bot description. [4][7]

What official memory is not:

- Not a user vault. Vault notes live in files you put in `/workspace`, or in a tool you sign into.
- Not a ledger of claims. The docs never mention claims, statuses, or a Memory API.
- Not a knowledge graph. No official page describes auto-linking old ideas.
- Not a security boundary. Bots pass context through DMs, group chats, and shared files. [4]

On teams, members personalize Bots with memories rather than personal rules. Team rules stay in context. [13]

If the second brain needs durable claims, that store is ours. Official memory will not do that job, and the docs warn you not to treat it as if it will.

## Skills, routines, automations

Two building blocks. A skill is reusable instructions for how to do a task. A routine tells one Bot when to run a workflow, on a schedule or, where supported, after an event. [6]

The official order is test, then schedule:

1. Run a one-time task until the result is reliable.
2. Save the method as a skill. Include when to use it, inputs, sequence, validation, output, and what needs approval.
3. Test on a second safe input.
4. Create a routine only when retries and failure cases are defined.
5. Use Test run after creating or editing a routine. Test run does real work. [6][17]

Skills are available across your Bots. A Bot may still need the matching connector or login. Private skills are enabled per Bot under Settings → Plugins → Yours. Type `/` for a skill. Type `@` for a Bot, group, routine, or connector. [6]

Teach a task records visible computer interaction for up to ten minutes. No microphone audio. The result is a draft skill. Rollout may be gradual. If the control is missing, ask the Bot to write a skill from the completed task. iPhone cannot teach by demonstration. Editing a routine's schedule, testing, and deleting also need desktop. [6][12]

Event triggers use Cursor account integrations, such as a Slack message or a GitHub notification. Those are separate from Slack or GitHub plugins. Narrow the matching rule. Broad listeners burn usage. [6]

Grok Bot may pause routines after a long time away if you do not answer a prompt. Deleting a routine has no undo. Deleting a Bot deletes its routines. [6]

## Plugins

Official vocabulary: connectors, shown as Plugins. MCP where available. Packaged skills in the same Settings → Plugins marketplace. [5][6][11]

How to connect: Settings → Plugins, Add, authenticate in the browser, then `@` the connector in chat. Prefer a connector over clicking a website. Use the browser when there is no connector, or when the work is visual. [5]

Installed connectors are account-wide. Team-provided plugins may be required or restricted. On teams, Grok Bot follows the existing Cursor plugin and MCP policy. There are no separate Grok Bot plugin controls. Hosted MCP tokens stay on Cursor's backend, not on the computer. [5][11][13]

What is not documented: a catalog. No official page lists Gmail, Google Calendar, Notion, Obsidian, Google Drive, Slack, LinkedIn, or X as installable plugins. Use-cases say "Connect: email, calendar, CRM" as role advice, not as a marketplace inventory. A site may still block automation, expire a session, or raise a CAPTCHA. [17][7]

Third-party shared Bots are a different object. Adding one accepts the third-party bot terms. SpaceXAI does not verify those Bots. [4][15]

## How to create a bot

Install from the Grok Bot access page that Get started links, currently `https://cursor.com/bot/onboarding`. macOS or Windows. Or the iOS app from the App Store. Sign in with Cursor. First run asks which tools you use. That only shapes suggestions. It does not connect those tools. [3][12]

Create path:

1. New in the sidebar, or `Cmd/Ctrl+N`.
2. Create new agent.
3. The app opens a Bot named New Agent.
4. Bot actions → Edit Profile for name, title, description, avatar.
5. Give it a concrete first task. [4]

On first run you can also pick a suggested teammate or Create your own: short name, one primary job, description of how it should work. Existing Bots can suggest another Bot. Ask before you let them spawn a crowd. [3][4]

The official first-task shape is still current:

1. Outcome. What should be finished?
2. Sources. Which apps, websites, files, or conversations matter?
3. Constraints. What must it avoid or ask before doing?
4. Deliverable. What should it return?
5. Review point. When should it stop for you? [3]

A good description states the job, the sources, the output format, and a standing "never" line. Example from Get started: investigate product performance, preserve links, separate evidence from hypotheses, never change production settings. [3][17]

When a site needs a password, passkey, 2FA, or CAPTCHA, take over the computer. Do not paste secrets into chat. The session then persists for other Bots. [3][5][8]

Official example jobs on the product page and use-cases page: Sales Outbound, Talent Scout, Paid Media, Expense Manager, Product Performance, Bug Reproduction, Account Health, Chief of Staff. Those are workplace roles. They are not a mandated second-brain roster. [14][17]

Start with one Bot that owns an end-to-end outcome. Add another only when the work has a stable specialist role. Put Bots in a group when the handoff itself needs to be visible. Five Bots in one group is legal. Six is the ceiling. [4][9]

## Contradictions

Share used: local dump of [Grok Bot Second Brain Demo](https://grok.com/share/bGVnYWN5_fc75b1ba-dacc-45c2-9ecd-6d4e48bcb9a6), title confirmed in the JSON, created 2026-08-29. The live share URL was a login wall on 2026-08-30. Aleiah's tweet and article are quoted inside that conversation. Official docs are the other side of each row.

**26 live agents, actual runtime, forget nothing.** Aleiah's tweet. Official docs say start with the smallest useful roster, one Bot owning an end-to-end outcome. Memory is not an authoritative source. There is one computer, not 26. A 26-Bot roster is under the 50 cap and still a bad idea the docs warn you away from. [4][5][1]

**Access is "SuperGrok / Cursor Ultra / Teams-tier."** Share turn 1. Too loose. Get started names Plus, Heavy, Pro+, Ultra, and Teams Standard or Premium. SuperGrok without Plus and Cursor Pro without + appear on the product FAQ, not on Get started. [3][14]

**$200 to $300 per month.** Share turn 3 attributes those figures to third-party writeups and tells you to check `x.ai/bot`. Official docs state no dollar amount. The product page widget I fetched showed $20 / $30 / $40 for the selected tabs, not $200 or $300. Do not put those recap prices in the plan. [14][7]

**Android still listed as coming.** Share turn 3. Current FAQ: Linux desktop, Android, and iPad are not supported at initial launch. The iOS page says iPhone only. No official Grok Bot page I read says Android is coming. [7][12]

**Connect plugins in this order: Gmail, Google Calendar, Notion or Obsidian or Drive, optionally Slack, LinkedIn, X.** Share turn 3. Official docs never name that catalog. They say Settings → Plugins and prefer a connector when one exists. Use-cases mention email and calendar as sources a role might use, which is not a plugin list. [5][17]

**Chief, Capture, Memory, Ops, Research as the official five.** Share recommendation. Official named examples are workplace jobs. Docs tell you to start small and give each Bot one outcome. They do not name a second-brain roster. Roster names stay a later ticket. [4][17]

**`/workspace/second-brain/` with PARA folders "is the second brain."** Share turn 3. Official docs say keep durable project files in `/workspace` and use clear folders. They do not prescribe PARA, `decisions.md`, or a vault layout. Vault layout stays a later ticket. [5]

**Voice note to task and idea in under 6 seconds.** Aleiah claim, share calls it plausible. No official page describes voice-note routing or a 6-second benchmark. iOS can dictate a message. The computer can play audio attachments. That is not a built-in capture pipeline. [12][10]

**Nightly email and calendar triage if you stay signed in.** Share says "mostly." Official docs say sessions persist and also expire, CAPTCHA, and block automation. Possible as a routine that uses the browser. Not a guaranteed product feature. [5][7]

**One writer per file or bots will clobber `decisions.md`.** Share operational advice. Not in the docs. Shared files are visible to every Bot. The collision rule is ours to write, not something official forbids or promises. [5]

**Official memory is not a verified personal knowledge graph.** Share turn 3, and the docs agree. They never mention a knowledge graph. They say reopen the source system. [4]

**Five-part first task, 50-Bot cap, one shared computer, skill then routine, `cursor.com/bot/onboarding`.** Share turn 3 got these from the docs, and the docs still say them. Keep those. [3][4][5][6]

**"Official docs tell you not to start with 26."** Share paraphrase. The docs say smallest useful roster. They do not mention 26. The meaning is right. The quote is not. [4]

## What this does not decide

Roster names. Official examples are workplace roles. The share's Chief / Capture / Memory / Ops / Research split is a design choice, not a product rule.

Vault layout. `/workspace` is the shared disk. PARA folders, a working file, and a ledger are our objects.

Task backend. Docs never mention Todoist, markdown lists, or GTD. Next actions are not a Grok Bot feature.

Memory API verbs. Official memory has no append / get / query / set_status surface. We still owe that API if claims live in a ledger.

Whether Mario's live account is on an eligible plan. Check the access page while signed in. I did not.

## Doc set I actually found

Mintlify sidebar on `docs.x.ai/grok-bot/overview`, fetched 2026-08-30. Fourteen Grok Bot pages. Sitemap, `robots.txt`, and `llms.txt` 404. Each page also has a `.md` print URL.

**The six known URLs, still live.**

- https://x.ai/bot
- https://docs.x.ai/grok-bot/overview
- https://docs.x.ai/grok-bot/get-started
- https://docs.x.ai/grok-bot/bots
- https://docs.x.ai/grok-bot/computer-and-apps
- https://docs.x.ai/grok-bot/skills-routines-and-automations

**First-party pages not in that six that add a fact.**

- https://docs.x.ai/grok-bot/faq : platforms, dual-subscription usage, on-demand billing, enterprise rolling out. The rest restates bots, computer, and get-started. Use it for those extras. Do not lean on it for the shared-computer story.
- https://docs.x.ai/grok-bot/chat-and-collaboration : group size 2 to 6, `@` mentions, text-only Bot-to-group handoffs
- https://docs.x.ai/grok-bot/files-and-results : attachment caps, `/workspace` as intermediate store
- https://docs.x.ai/grok-bot/approvals-security-and-privacy : Auto Review, local-computer policy, least privilege
- https://docs.x.ai/grok-bot/settings-and-notifications : Plugins marketplace, timezone for routines, usage UI
- https://docs.x.ai/grok-bot/use-cases : official role examples, test-then-routine checklist
- https://docs.x.ai/grok-bot/troubleshooting : recovery order, plugin auth failures
- https://docs.x.ai/grok-bot/mobile : iOS 18, same computer, desktop-only teach and routine edit
- https://docs.x.ai/grok-bot/teams-and-enterprises : one-time trial, one Linux VM per member, MCP policy, no model picker, enterprise rolling out
- https://x.ai/legal/bot-sharing-terms : third-party Bot terms, effective 2026-08-22

**404 on purpose.** No `/grok-bot/memory`, `/plugins`, `/pricing`, `/access`, `/changelog`, or `/marketplace` page.

**Skipped.** `x.ai/news/*`, including a "more plans" post that search surfaced. Launch recaps. `docs.x.ai/grok/faq`, which is the Grok chat app, not Grok Bot.

## Fetch failures

- `https://docs.x.ai/sitemap.xml`, `robots.txt`, `llms.txt`: 404
- `https://grok.com/share/bGVnYWN5_fc75b1ba-dacc-45c2-9ecd-6d4e48bcb9a6`: login wall. Used the local dump under `agent-tools/9b11fbe8-4198-4f5b-984e-e6474f4f8ebd.txt`
- `https://x.ai/grok/bot`: Cloudflare block
- Guessed legal URLs other than `bot-sharing-terms`: 404 or Cloudflare
- `https://cursor.com/pricing` and `https://cursor.com/bot/onboarding`: not fetched. Get started links the second as the access page. I did not treat Cursor marketing as a fact source.

## Sources

1. SpaceXAI Docs. [Grok Bot overview](https://docs.x.ai/grok-bot/overview). Fetched 2026-08-30. Also [overview.md](https://docs.x.ai/grok-bot/overview.md).
2. SpaceXAI Docs. [Create and manage Bots](https://docs.x.ai/grok-bot/bots). Fetched 2026-08-30.
3. SpaceXAI Docs. [Get started](https://docs.x.ai/grok-bot/get-started). Fetched 2026-08-30. Access-page href: `https://cursor.com/bot/onboarding`.
4. Same as [2], memory, 50-cap, share, delete, smallest roster.
5. SpaceXAI Docs. [Use the computer and apps](https://docs.x.ai/grok-bot/computer-and-apps). Fetched 2026-08-30.
6. SpaceXAI Docs. [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations). Fetched 2026-08-30.
7. SpaceXAI Docs. [Frequently asked questions](https://docs.x.ai/grok-bot/faq). Fetched 2026-08-30.
8. SpaceXAI Docs. [Approvals, security, and privacy](https://docs.x.ai/grok-bot/approvals-security-and-privacy). Fetched 2026-08-30.
9. SpaceXAI Docs. [Message and collaborate](https://docs.x.ai/grok-bot/chat-and-collaboration). Fetched 2026-08-30.
10. SpaceXAI Docs. [Files and results](https://docs.x.ai/grok-bot/files-and-results). Fetched 2026-08-30.
11. SpaceXAI Docs. [Settings and notifications](https://docs.x.ai/grok-bot/settings-and-notifications). Fetched 2026-08-30.
12. SpaceXAI Docs. [Grok Bot for iOS](https://docs.x.ai/grok-bot/mobile). Fetched 2026-08-30.
13. SpaceXAI Docs. [Grok Bot for teams and enterprises](https://docs.x.ai/grok-bot/teams-and-enterprises). Fetched 2026-08-30.
14. SpaceXAI. [Grok Bot product page](https://x.ai/bot). Fetched 2026-08-30. Pricing widget plus FAQPage JSON-LD.
15. SpaceXAI. [Third-party bot terms](https://x.ai/legal/bot-sharing-terms). Effective 2026-08-22. Fetched 2026-08-30.
16. SpaceXAI Docs. [Troubleshooting](https://docs.x.ai/grok-bot/troubleshooting). Fetched 2026-08-30.
17. SpaceXAI Docs. [Use cases](https://docs.x.ai/grok-bot/use-cases). Fetched 2026-08-30.
