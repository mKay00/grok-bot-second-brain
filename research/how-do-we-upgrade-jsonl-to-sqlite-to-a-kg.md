# How do we upgrade JSONL to SQLite to a KG without rewriting bots?

Issue: [How do we upgrade JSONL to SQLite to a KG without rewriting bots?](https://github.com/mKay00/grok-bot-second-brain/issues/4)

## Question

What does a stable memory API look like so the vault stays markdown, the ledger can move from JSONL to SQLite to a property graph, and bot prompts do not hard-code file formats?

Name current options (SQLite, Graphiti, Kuzu, Neo4j) with real thresholds and first-party docs. When does each rung earn its keep for a personal second brain?

## Answer

Keep one memory API that speaks claims. Keep the vault as markdown plus YAML. Swap only the ledger engine.

JSONL is the first engine. SQLite is the next one, when filtered reads of the ledger start to hurt. The project's 1k to 3k claim mark is a JSONL-pain heuristic, not a SQLite capacity limit. Official SQLite limits sit at about 281 TB and one writer at a time. A personal ledger never hits the size ceiling. [1][2]

A knowledge graph earns its keep when the questions are about paths between claims, or about what was true at a past time, and those queries are frequent enough that a scan or a recursive SQL walk is the wait. Neo4j's own guidance says skip a graph when you only look up records, write without reading, scan the whole store, or park large text on nodes. Vault notes stay in the vault for that reason. [3][4]

Graphiti is a temporal graph framework, not a file next to the vault template. It sits on Neo4j, FalkorDB, or Amazon Neptune, and it wants an LLM on every episode. Kuzu would have been the embedded graph rung. Upstream archived the project, and Graphiti marked the Kuzu driver deprecated. Do not plan the third rung on Kuzu. [5][6][7]

The docs do not force us off the baseline: Obsidian markdown plus YAML stays, one memory API, JSONL first, SQLite around 1k to 3k claims or when queries hurt, a KG when questions are multi-hop or time-travel.

## What the memory API should look like

Bots ask for claims. They never name `ledger.jsonl`, a `.sqlite` path, Cypher, `MATCH`, or Graphiti episodes.

That is the whole trick. The upgrade ladder in `CONTEXT.md` already says the vault and a single memory API stay, and only the ledger engine changes. Prompts that mention a file format nail the bots to that format.

Graphiti's MCP server is a useful warning, not a model to copy into bot prompts. Its tools are `add_memory`, `add_triplet`, `search_memory_facts`, `search_nodes`, `get_episode_entities`. Those names leak episodes, triplets, and a graph. Swap the backend and the prompt still thinks in Graphiti. [8]

Our port should leak claims and their statuses instead.

### Verbs every engine can implement

These are the operations, not a library to write today.

- `append`. Record a new claim with provenance. JSONL appends a line. SQLite inserts a row. A graph engine inserts a fact edge and keeps the source episode or source-archive id.
- `get`. Fetch one claim by id.
- `query`. Filter by status, entity, time window, or source. JSONL scans. SQLite uses indexes. A graph engine uses its own search.
- `set_status`. Move a claim between candidate, current, conflict, and decayed. Never delete history.
- `current`. Claims the system is willing to treat as true now. Status `current`, or a graph edge with no `invalid_at`.
- `as_of`. Claims that were current at time *t*. Works on JSONL and SQLite if every claim carries `valid_from` and `valid_to` from day one. A graph engine maps those onto `valid_at` and `invalid_at`.
- `related`. Claims linked to an entity within *n* hops. JSONL and SQLite can walk an `entity` list or an edge table. SQLite's own docs show `WITH RECURSIVE` over a graph of edges. A property graph makes this the cheap query. [9]

`related` and `as_of` may be slow on early rungs. That is fine. The signature stays. The engine behind it gets smarter.

### A claim the API returns

One durable statement, with a status of candidate, current, conflict, or decayed. Fields that survive every rung:

- `id`
- `statement`
- `status`
- `entities`, a list of names or ids the statement is about
- `valid_from`, `valid_to`
- `recorded_at`, when the ledger learned it
- `provenance`, a pointer into the source archive or the vault note that justified the write
- `supersedes` / `superseded_by`
- `last_used`, empty until a read hits this claim
- `use_count`, starts at 0 on `append`

`valid_from` / `valid_to` plus `recorded_at` is the cheap version of Graphiti's four edge times: when the fact became true, when it stopped, when the system learned it, and when the system learned it was over. Zep's docs, which sit on Graphiti, name those `valid_at`, `invalid_at`, `created_at`, and `expired_at`. Put the first two on the claim on day one so time-travel is not a graph-only feature. [10][11]

The store records use on `get`, `query`, `current`, `as_of`, and `related`: each claim id in a non-empty result gets `use_count` bumped and `last_used` set. Empty results touch nothing. Reader bots do not write use. Silence without use is what earns decay. A decay scan that ages by `last_used` (or `recorded_at` if never read) does not count as use.

The API never writes vault notes. Next actions never enter the ledger. Those stay in the task backend.

### What bot prompts say

"Ask memory for current claims about X."

"Append a candidate claim with this source."

"Mark claim *id* as conflict."

Not "grep the JSONL for status=current." Not "run this Cypher." Not "add an episode."

## Vault stays markdown

The vault template is empty folders, YAML schema, and example notes. The live vault is Obsidian markdown with YAML properties. Neither is the ledger.

Neo4j's own "when not to use a graph" list includes large text and BLOBs as node properties. A graph hop is cheap. Pulling a paragraph off every node on the path is not. Vault notes are paragraphs. They stay files. [3]

SQLite's "Appropriate Uses" page is the same idea from the other side. SQLite competes with `fopen()`, not with a datacenter RDBMS. It is a good application file format and a good replacement for home-grown data files. The ledger file can be SQLite. The notes should not move into it. [1]

## When each rung earns its keep

### JSONL

Start here.

A JSONL ledger is an append-only file of claim records. Git diffs it. No daemon. No schema migration. The cost is a full scan for every filtered read.

No first-party JSONL spec names a pain threshold. The project's 1k to 3k claim mark is a guess about when that scan becomes the thing you wait on. Leave it. SQLite's docs do not replace it with a smaller number, and they do not require a larger one either.

JSONL earns its keep while queries look like "read the file and keep `status=current`." The moment a bot waits on a filter, an entity join, or a time window, the next rung is cheaper than cleverer grepping.

### SQLite

Official home: [sqlite.org](https://sqlite.org). The load-bearing pages are Appropriate Uses, Limits, JSON functions, FTS5, and `WITH RECURSIVE`. [1][2][12][13][9]

**What the docs actually say**

- SQLite is local storage for one application. It competes with `fopen()`. [1]
- Choose SQLite when the data lives on the same machine as the code that issues SQL, writers can take turns, and the content is under a terabyte. Otherwise choose a client/server engine. [1]
- Default maximum database size is about 17.5 TB at a 4 KiB page, or about 281 TB at a 64 KiB page. Theoretical max rows in a table is 2^64, unreachable because the file-size cap comes first. [2]
- One writer at a time. Unlimited readers. A write lock is meant to last tens of milliseconds. [1]
- JSON functions ship in SQLite 3.38.0 and later. Claims can stay documents inside columns and still be queried with `json_extract`. [12]
- FTS5 is a virtual table for term search over a document collection. [13]
- `WITH RECURSIVE` walks trees and graphs in SQL. SQLite's own example builds an `edge(aa, bb)` table and finds every node connected to node 59. [9]
- Small blobs in SQLite are competitive with, and often faster than, the same blobs as separate files. That is a file-format argument, not a reason to pour vault notes into the ledger. [14]

**When it earns its keep here**

A personal second brain with a handful of Grok Bots on one machine is exactly the "otherwise, choose SQLite" box. Serialize writes through the memory API and the single-writer rule is a non-issue.

Move off JSONL when `query` and `current` start scanning a file you can feel. The 1k to 3k claim mark is a reasonable tripwire. You can also move earlier. SQLite is happy with hundreds of rows. The docs give no reason to wait for thousands, and no reason to fear millions.

What SQLite does not buy you: native variable-length path syntax, automatic fact invalidation, or hybrid vector plus BM25 plus graph search. Recursive SQL can do shallow hops. If the hot questions stay "what is current about X" and "what did we record from source Y," stay on SQLite.

### Graphiti

Official home: [github.com/getzep/graphiti](https://github.com/getzep/graphiti) and [help.getzep.com/graphiti](https://help.getzep.com/graphiti/getting-started/overview). Product page: [getzep.com/platform/graphiti](https://www.getzep.com/platform/graphiti/). [5][15][11]

**What it is**

A Python framework that turns episodes into a temporal context graph. An episode is one ingest event, text, a chat turn, or JSON. The graph stores entities as nodes, facts as edges, and the raw episode as provenance. Graphiti is not a database. You bring Neo4j 5.26+, FalkorDB 1.1.2+, or Amazon Neptune. Kuzu 0.11.2 still ships and is deprecated. [5][16]

Zep is the hosted scale-out of the same model. Graphiti's own comparison says use Graphiti for one context graph per subject, run locally, if you will operate the surrounding system. Use Zep for millions of graphs and a sub-200 ms managed path. A personal second brain is one subject. Graphiti is the OSS side of that split. Zep is more than the job needs. [5][15]

**Thresholds they publish**

- Python 3.10+. [5]
- Default ingest concurrency `SEMAPHORE_LIMIT=10`, to stay under LLM 429s. [5]
- They report 94.7% LoCoMo accuracy at 155 ms retrieval, and 90.2% LongMemEval at 162 ms. Those are their benchmark numbers, not a size at which you must adopt the tool. [11][15]
- `add_episode_bulk` skips edge invalidation. Use it only on an empty graph, or when you do not need invalidation. [16]
- JSON episodes must fit the LLM context window. Keep them compact. [16]
- MCP default stack is FalkorDB in Docker, with Neo4j as the production-shaped option. [8]

**The temporal model**

Every fact edge carries a validity window. New facts invalidate old ones. History stays. Point-in-time queries follow from the timestamps. The product page says each edge stores when the fact became valid, when it stopped, when Graphiti learned it, and when Graphiti learned it was over. Search results expose `valid_at` and `invalid_at`. [5][11][17]

That is the time-travel the upgrade ladder is waiting for. It is also an LLM in the write path. Every `add_episode` extracts entities and edges. Structured output failures on small or local models are a first-party warning. [5]

**When it earns its keep here**

When bots keep asking "what was true last March" or "how does X connect to Y through Z," and you want extraction plus invalidation plus hybrid search rather than hand-authored claims. And when you accept a graph server, or FalkorDB Lite, plus an LLM bill on ingest.

Do not put Graphiti under the bots until the memory API exists. `append` can call `add_episode` or `add_triplet`. `as_of` can pass `valid_at` / `invalid_at` filters. `current` is edges with no `invalid_at`. The prompts stay on claims.

Custom entity and edge types, via Pydantic, are how a later engine maps our statuses and provenance onto Graphiti without teaching bots Graphiti's ontology. [5][17]

### Kuzu

Official docs: [kuzudb.github.io/docs](https://kuzudb.github.io/docs). Repo: [github.com/kuzudb/kuzu](https://github.com/kuzudb/kuzu). [6][7]

**What it was**

An embedded property-graph engine. In-process, like SQLite. On-disk file or `:memory:`. Cypher. Required schema: node tables with a primary key, relationship tables with typed endpoints. Columnar storage, CSR adjacency, ACID transactions, FTS and vector extensions. MIT license. [6][18]

That shape matches a personal ledger better than a Neo4j server. A `example.kuzu` file next to the vault is the graph analog of `ledger.sqlite`.

**What changed**

The official README now leads with an archive notice. Prior releases keep working. 0.11.3 bundles the `algo`, `fts`, `json`, and `vector` extensions because the public extension server is gone. Docs moved to GitHub Pages. [7]

Graphiti's README says the Kuzu driver is deprecated and will be removed, because upstream is unmaintained. New Graphiti projects should use Neo4j or FalkorDB. The driver still emits a `DeprecationWarning`. [5]

I am not treating community forks or "Kuzu was acquired" write-ups as the source of this claim. The archive note and Graphiti's deprecation are enough.

**When it earns its keep here**

It does not, as a planned third rung. Frozen 0.11.3 is a local experiment if someone already has it. It is a bad destination for the vault template and for bot-facing docs. The embedded-graph slot Graphiti still documents is FalkorDB Lite, Python 3.12+, not Kuzu. [5]

### Neo4j

Official docs: [What is a graph database](https://neo4j.com/docs/getting-started/graph-database/), [property graph concepts](https://neo4j.com/docs/getting-started/appendix/graphdb-concepts/), [graph vs RDBMS](https://neo4j.com/docs/getting-started/appendix/graphdb-concepts/graphdb-vs-rdbms/), [basic Cypher](https://neo4j.com/docs/cypher-manual/current/queries/basic/). The "when not" page is Neo4j's own developer blog. [4][19][20][21][3]

**What it is**

A property graph. Nodes with labels and key-value properties. Directed, typed relationships that also hold properties. Cypher is the query language. Relationships are stored next to the nodes, so a traversal is not a `JOIN` computed at query time. Neo4j says this is for questions about how to get from A to B, not about what A is. [4][19][20]

Graphiti asks for Neo4j 5.26 or higher and recommends Neo4j Desktop as the simplest install. Community Edition runs as a local process: `neo4j console` or `neo4j start`, Bolt at `bolt://localhost:7687`, browser at `http://localhost:7474`. That is a server, not a file you copy with the vault template. [5][17][22]

**When Neo4j says not to use a graph**

- Data is disconnected and relationships do not matter.
- You only write, and you do not query.
- The model is fixed and tabular.
- Queries are bulk scans or have no start node. `MATCH (n) WHERE n.name = 'Jennifer'` is the anti-pattern. Start from a known `:Person` and walk `KNOWS`.
- You want a key-value lookup.
- You store large text or BLOBs as properties. [3]

A ledger of current claims about a person, filtered by status, is a lookup plus a filter. SQLite is the better tool for that. A question like "which decayed claims about project X sit two hops from this source" is a graph question.

**When it earns its keep here**

As the graph engine behind Graphiti, or as a raw Cypher store, once `related` and `as_of` are the queries you run on purpose. Not as the day-one ledger. Not as a place to put vault notes. Not as a cache of claim-by-id reads.

If the third rung is Graphiti plus Neo4j Desktop on Mario's machine, that is a supported first-party path. The vault template should still default to JSONL, then SQLite. A cloner who never asks multi-hop questions should never install Neo4j.

## What this does not change

- The vault template stays markdown plus YAML.
- Next actions stay in the task backend.
- One memory API. Engines plug in behind it.
- JSONL first.
- SQLite when the JSONL scan hurts, with 1k to 3k claims as the written tripwire. Official SQLite capacity is not the tripwire.
- A KG when the questions are multi-hop or time-travel. Graphiti plus Neo4j or FalkorDB is the current supported way to get both. Kuzu is off the planned ladder.

No API code in this ticket. No `PLAN.md`.

## Sources

1. SQLite. [Appropriate Uses For SQLite](https://sqlite.org/whentouse.html). Updated 2025-05-31.
2. SQLite. [Implementation Limits For SQLite](https://sqlite.org/limits.html). Updated 2026-07-10.
3. Jennifer Reif, Neo4j Developer Blog. [How do you know if a graph database solves the problem?](https://neo4j.com/blog/developer/how-do-you-know-if-a-graph-database-solves-the-problem/). 2018-08-08, updated 2026-06-04.
4. Neo4j Docs. [What is a graph database](https://neo4j.com/docs/getting-started/graph-database/).
5. getzep/graphiti. [README](https://github.com/getzep/graphiti/blob/main/README.md). Requirements, backends, Kuzu deprecation, Zep vs Graphiti, telemetry, LLM caveats.
6. Kuzu. [Documentation](https://kuzudb.github.io/docs). Embedded property graph, Cypher, ACID, in-process.
7. kuzudb/kuzu. [README archive notice](https://github.com/kuzudb/kuzu/blob/master/README.md). Project archived; 0.11.3 bundles common extensions.
8. getzep/graphiti. [MCP server README](https://github.com/getzep/graphiti/blob/main/mcp_server/README.md). Tool names, FalkorDB default, Neo4j option.
9. SQLite. [The WITH Clause](https://sqlite.org/lang_with.html), section 3.3, Queries Against A Graph.
10. Zep Docs. [Facts](https://help.getzep.com/facts). Four edge timestamps on the Graphiti-based context graph.
11. Zep / Graphiti. [Graphiti overview](https://help.getzep.com/graphiti/getting-started/overview). Bi-temporal model, hybrid search, backends, LoCoMo / LongMemEval numbers.
12. SQLite. [JSON Functions And Operators](https://sqlite.org/json1.html). Built in as of 3.38.0.
13. SQLite. [FTS5 Extension](https://sqlite.org/fts5.html).
14. SQLite. [35% Faster Than The Filesystem](https://sqlite.org/fasterthanfs.html).
15. Zep. [Graphiti product page](https://www.getzep.com/platform/graphiti/). Four edge timestamps in prose, pluggable backends, MCP.
16. Graphiti Docs. [Adding Episodes](https://help.getzep.com/graphiti/core-concepts/adding-episodes). Episode types, `reference_time`, bulk ingest without invalidation.
17. Graphiti Docs. [Quick Start](https://help.getzep.com/graphiti/getting-started/quick-start). Neo4j 5.26+, Desktop, `search` with `valid_at` / `invalid_at`.
18. Kuzu Docs. [Create your first graph](https://kuzudb.github.io/docs/get-started/). Required schema, on-disk vs `:memory:`.
19. Neo4j Docs. [Graph database concepts](https://neo4j.com/docs/getting-started/appendix/graphdb-concepts/). Property graph: nodes, labels, typed directed relationships, properties.
20. Neo4j Docs. [Comparing relational to graph database](https://neo4j.com/docs/getting-started/appendix/graphdb-concepts/graphdb-vs-rdbms/). Joins vs pre-materialized relationships.
21. Neo4j Docs. [Cypher, basic queries](https://neo4j.com/docs/cypher-manual/current/queries/basic/).
22. Neo4j Operations Manual. [Linux tarball install](https://neo4j.com/docs/operations-manual/current/installation/linux/tarball/). Community Edition as a local service, Bolt, Browser.
