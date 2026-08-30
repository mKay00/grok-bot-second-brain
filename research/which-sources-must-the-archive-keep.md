# Which sources must the archive keep?

Seventeen URLs. That is the whole source archive. The Grok share cited about 150 web hits and 60 X posts. Almost all of that is token chatter, news recaps, or a second telling of a first-party page. The consolidation plan should cite the owners of the claims it actually uses.

Provenance: [Grok Bot Second Brain Demo](https://grok.com/share/bGVnYWN5_fc75b1ba-dacc-45c2-9ecd-6d4e48bcb9a6), plus the first-party pages those claims resolve to. Ticket: [Which sources must the archive keep?](https://github.com/mKay00/grok-bot-second-brain/issues/2).

## Keep list

Each row is one file under `sources/`. Where a seed post *is* an X article, archive the article URL once and treat the status URL as an alias.

### Seed posts and the articles behind them

| URL | Why the plan needs it | `sources/` file |
|---|---|---|
| https://x.com/AleiahLock/status/2093364666088964387 | Seed for the demo thread. The viral claim ("actual runtime," 26 live agents, forget nothing) is what the baseline stack refuses. | `aleiahlock-2093364666088964387.md` |
| https://x.com/i/article/2093016744965156864 | Real article behind the demo, posted as [2093311693010894922](https://x.com/AleiahLock/status/2093311693010894922). Lists the 26 job titles in five buckets, credits Forte/PARA, and admits the memory graph is not wired to live email, calendar, or notes. That disclaimer is the reason we do not clone the demo. | `aleiahlock-grok-bot-second-brain-article.md` |
| https://x.com/i/article/2084494609594327040 | 0xWast3 seed, posted as [2084625810112032849](https://x.com/0xWast3/status/2084625810112032849). Five-stage write policy (capture, consolidate, retrieve, reconcile, decay). This is the policy layer in the baseline stack. | `0xwast3-memory-engineering-article.md` |
| https://x.com/0xWast3/status/2091106807611596966 | Capped working file. Six rewritten sections, never appended, ~4k token ceiling. Becomes `working.md`. | `0xwast3-2091106807611596966.md` |
| https://x.com/0xWast3/status/2093280913111109930 | Rent model. A claim dies unless something uses it again. Becomes decayed status. Working-file Dead stays separate. No `grave.md`. | `0xwast3-2093280913111109930.md` |
| https://x.com/eng_khairallah1/status/2093390212399297003 | Seed Mario pointed at. The tweet is a first-agent flowchart. Memory there means recent chat turns. Archive it so the plan can say this object is not the store. | `eng-khairallah1-2093390212399297003.md` |
| https://x.com/i/article/2091603854701793280 | The knowledge-graph course actually meant, posted as [2092185189803847950](https://x.com/eng_khairallah1/status/2092185189803847950). Title: *From 0 to Graph Engineer: The 14-Step Roadmap Using Kimi K3*. Property graph, evidence on every edge, time windows, no silent overwrite, "if the questions are single-hop lookups, use a database." That is the spec for the last rung of the upgrade ladder, not day one. | `eng-khairallah1-14-step-graph-engineering-course.md` |

Aleiah's article is real. I read the full X article, not a recap. The tweet sells a nervous system that is already running. The article sells a diagram you could wire later. Keep both so that split stays inspectable after the links rot.

### Official Grok Bot docs

Third-party setup blogs and launch recaps repeat these pages. Cite the docs.

| URL | Why the plan needs it | `sources/` file |
|---|---|---|
| https://x.ai/bot | Product page. Eligible plans, download, what a Bot is allowed to do. Check this before quoting any $200/$300 figure from a recap. | `xai-grok-bot.md` |
| https://docs.x.ai/grok-bot/overview | Official definition. A Bot is one persistent named teammate. All Bots share one user-scoped computer. | `xai-docs-grok-bot-overview.md` |
| https://docs.x.ai/grok-bot/get-started | Install, sign-in, first Bot, five-part first task (outcome, sources, constraints, deliverable, review point). Plan names: SuperGrok Plus, SuperGrok Heavy, Cursor Pro+, Cursor Ultra, Cursor Teams. | `xai-docs-grok-bot-get-started.md` |
| https://docs.x.ai/grok-bot/bots | Start with the smallest useful roster. Memory is not a substitute for an authoritative source. Cap of 50 Bots and group chats combined. Separate Bots are not a security boundary. | `xai-docs-grok-bot-bots.md` |
| https://docs.x.ai/grok-bot/computer-and-apps | One shared computer, `/workspace`, shared cookies and logins, one computer-use task per Bot screen. This is why five Bots share a vault instead of 26 machines. | `xai-docs-grok-bot-computer-and-apps.md` |
| https://docs.x.ai/grok-bot/skills-routines-and-automations | Skill plus routine is the automation primitive. Test a one-time task, save the method, then schedule it. Matches the two-routine baseline (nightly Memory, weekly Chief). | `xai-docs-grok-bot-skills-routines.md` |

Skip `x.ai/news/*`. Same facts, launch-blog shape. Skip `docs.x.ai/grok-bot/faq`. It restates bots + computer + get-started. Skip the Grok chat multi-agent research page. That is a different product.

### Forte / PARA / GTD

The baseline stack leans on these. PARA is the filing cabinet. GTD is the optional action grammar. Forte said they sit next to each other.

| URL | Why the plan needs it | `sources/` file |
|---|---|---|
| https://fortelabs.com/blog/para/ | Forte's PARA primary. Projects, Areas, Resources, Archives, organized by actionability. This is `01-projects/` through `04-archives/`. | `forte-para-method.md` |
| https://fortelabs.com/blog/gtd-x-pkm/ | Forte's own case that GTD already splits actionable from reference, and that the reference side is the gap. Grounds the clarify fork. | `forte-gtd-x-pkm.md` |
| https://gettingthingsdone.com/2010/02/what-is-gtd/ | David Allen Company. Capture, Clarify, Organize, Reflect, Engage. Official five steps, not a Todoist rewrite. | `gtd-what-is-gtd.md` |
| https://gettingthingsdone.com/2009/05/the-gtd-weekly-review/ | Official weekly review. Get Clear / Get Current / Get Creative. The one GTD ritual the share said to keep even if context lists get dropped. | `gtd-weekly-review.md` |

Forte's AI Second Brain course and meetup pages stay out. The plan uses PARA folders, not that product.

## Do not archive

These showed up in the share or as seed URLs. None of them change a decision once the keep list exists.

**Discarded graph seeds.** [Anatoli 2088684163167670725](https://x.com/AnatoliKopadze/status/2088684163167670725) is an orchestration graph and an Andrew Ng / agent-fleet course. Mario discarded it. [polydao 2092187828234993708](https://x.com/polydao/status/2092187828234993708) is the right *family* of graph (entities, evidence, aliases) at the wrong scale. The course we actually meant is Khairallah's 14 steps. Steal the ideas from that course. Do not keep either discarded seed.

**Reply-guy tweets and token posts.** Everything under $ALEIAH, Pump.fun, Solscan, and the quote-tweet pile on Aleiah's demo. Out of scope on the map.

**News recaps.** Verge, Mashable, InfoQ, DataCamp, MindStudio, and the rest. If a fact matters, it lives on `docs.x.ai` or `x.ai/bot`.

**Kimi-only writeups.** 0xWast3's later article *[Memory Engineering for Kimi](https://x.com/i/article/2087776707063271424)* is how to do the same policy on Kimi Skills. The plan already said not to copy that stack. The working-file and decay tweets carry the schemas.

**Graphiti / Neo4j product docs.** Named as a possible later index. Not a source the plan must hang a day-one decision on. If a later ticket promotes the last ladder rung, archive Graphiti then.

**The share itself.** Keep the JSON in the agent-tools dump if you want a replay. It is not a `sources/` file.

## How I cut

Load-bearing means one of these:

1. A seed Mario asked Grok to research, if the plan still has to cite it (including "this was the wrong object").
2. The first-party page behind a claim the baseline stack uses (official Grok Bot behavior, Forte PARA, Allen GTD, 0xWast3 write policy, Khairallah's graph test).
3. Aleiah's article, because it is real and it is more honest than the tweet.

Everything else is a recap, a reply, or a product we are not installing.

I followed claims to the page that owns them. Official Grok Bot behavior comes from `docs.x.ai`, not from MindStudio. PARA comes from Forte's blog, not from `thesecondbrain.io`. GTD comes from gettingthingsdone.com, not from Todoist. The Aleiah and 0xWast3 articles were read as X articles, not as quote-tweet summaries.

## What this does *not* decide

The archive list is not the consolidation plan. It does not pick Todoist vs markdown lists, and it does not write bot prompts. It only says which URLs later tickets are allowed to treat as load-bearing.
