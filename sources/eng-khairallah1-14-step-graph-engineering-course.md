# From 0 to Graph Engineer: The 14-Step Roadmap Using Kimi K3 (Full Course)

Canonical URL: https://x.com/i/article/2091603854701793280
Fetched: 2026-08-30
Posted: 2026-08-25
Alias: https://x.com/eng_khairallah1/status/2092185189803847950

## Text

Ask a vector database which of your ten thousand contracts is most similar to a question, and it answers in milliseconds.

Save this :)

Now ask it whether the person who signed the biggest contract also sits on the board of the supplier getting paid.

It has no idea what you just asked.

That second question is the one that actually matters, and it is the one every AI system built on vector search quietly cannot answer. Not because the model is weak. Because similarity and connection are different things. Vector search returns semantically similar text. It cannot follow a chain of relationships across three hops, and no amount of better embeddings will change that.

The discipline that answers those questions is graph engineering, and for thirty years it has been effectively gatekept. Not because the theory was hard, but because building a real knowledge graph meant ontologists, NLP specialists, entity resolution engineers, and roughly a year of manual labor before anyone got a single answer out of it. Almost nobody could afford to start.

That barrier just collapsed. Large language models reframed extraction as a generative task, and few-shot prompting now matches what fully supervised extraction models used to achieve, without thousands of labeled training examples. You no longer build specialized extractors. You teach a model your schema and let it work. And Kimi K3's million-token context attacks the specific flaw that made most LLM-built graphs junk.

This is the full course: fourteen steps from knowing nothing to building and running real knowledge graphs. Written for beginners, with copy-paste prompts, honest costs, and the failure modes nobody warns you about. Bookmark it, because this is a skill with almost no supply and rapidly growing demand.

### Phase 1: Foundations

Step 1 — Understand what a graph actually is, and why it wins

A graph is embarrassingly simple. Three pieces:

**Nodes** are things. A person, a company, a contract, a gene, a server.
 **Edges** are relationships between things, with a direction and a name. Sarah → SIGNED → Contract 447.
 **Properties** are facts attached to either one. A person has a name, a contract has a value and a date.

That's it. The entire model.

Now, why it beats the alternatives for connected data. In a relational database, relationships live in join tables, and every extra hop costs you another join. Ask a three-hop question and you get a query that's slow and painful to write. Ask a five-hop question and it becomes genuinely impractical. Relational databases are superb at aggregating rows and mediocre at traversing relationships.

Vector databases have the opposite problem. They're excellent at "find me things that resemble this" and structurally incapable of "follow this specific chain of connections." Similarity is not relevance. The document most similar to your question about a supplier is probably another supplier document, not the board membership record that actually answers it.

A graph stores relationships as first-class objects. Traversing them is the native operation, not an expensive afterthought. That is the entire reason the field exists.

**Do this now:** write down five questions about your own data that require following two or more relationships. Those questions are your project, and you will use them in Step 5.

Step 2 — Pick your model: property graph or RDF

There are two families, and beginners lose weeks agonizing over this. Here is the short version.

**Property graphs** (Neo4j, Memgraph, TigerGraph, and others) let nodes and edges carry arbitrary properties. You query with Cypher, which is visual and readable. This is the pragmatic choice for building applications.

**RDF triple stores** express everything as subject-predicate-object triples, queried with SPARQL, with formal semantics and W3C standards behind them. This is the rigorous choice when you need interoperability across organizations, formal reasoning, or published open data.

**My recommendation for anyone starting:** property graph. The learning curve is shorter, the tooling is friendlier, and the concepts transfer if you later need RDF. You can be productive in an afternoon rather than a fortnight.

Step 3 — Stand up a graph and load toy data

Stop reading and get your hands dirty. Install a graph database locally or spin up a free hosted instance. Almost all of them ship with built-in sample datasets, a movie graph, a fraud dataset, an org chart.

Load one. Click around the visualizer. Watch the nodes and edges render. This sounds trivial and it isn't: seeing your first graph light up is the moment the model stops being abstract. Spend an hour here before you write a line of your own.

### Phase 2: Querying

Step 4 — Learn Cypher, and feel the mental shift

Cypher is a pattern-matching language, and it looks like what it does. Nodes are in parentheses, relationships are arrows.

Find everyone who signed a contract:

MATCH (p:Person)-[:SIGNED]->(c:Contract)
RETURN p.name, c.id

Now the question from the opening of this article, the one vector search cannot touch:

MATCH (p:Person)-[:SIGNED]->(c:Contract)<-[:PARTY_TO]-(s:Supplier),
      (p)-[:BOARD_MEMBER_OF]->(s)
RETURN p.name, s.name, c.value
ORDER BY c.value DESC

Four lines. Three hops. Every person who signed a contract with a supplier whose board they sit on, sorted by value. In SQL this is a multi-join nightmare. In a vector database it is not expressible at all.

That's the shift: you stop describing what to filter and start **drawing the shape you're looking for**. Once that clicks, graph thinking becomes intuitive.

**Do this now:** take the five questions from Step 1 and write the Cypher patterns for them against your toy dataset. Don't move on until you can express a three-hop question from memory.

### Phase 3: Design — where the real discipline lives

Step 5 — Design the schema from your questions, not from your data

This is the highest-leverage step in the entire roadmap, and getting it wrong is the most expensive mistake in the field.

Here's the hard truth production teams have learned: schema design must happen before ingestion begins. Retrofitting a schema once you've ingested at scale means full re-extraction and re-ingestion, a remediation effort that routinely takes months. You do not get to "figure out the schema as you go."

The beginner instinct is to look at the data and model everything in it. That produces sprawling, unusable graphs. The professional approach inverts it: **start from the questions you need answered, and design the minimum schema that answers them.**

K3 is genuinely excellent at this, because schema design is a reasoning task with a large context, exactly its strength. Give it your real questions:

I'm building a knowledge graph to answer questions like these:
1. [your real question]
2. [your real question]
... (list 10-15 questions your users actually ask)

Design a minimal property graph schema that answers all of them.

Output:
- Node types, with required and optional properties
- Relationship types, with direction and a verb name
- For EACH of my questions, the exact traversal path that answers it
- Any question that CANNOT be answered by this schema, flagged explicitly

Rules:
- Minimal. Do not add node or relationship types that none of my questions need.
- Every relationship needs a clear direction and a verb name.
- Flag anything ambiguous instead of guessing.

The killer line is "for each of my questions, the traversal path that answers it." That forces the schema to prove itself before you build anything. If a question has no path, you found the gap while it was still free to fix.

Step 6 — Entity resolution, the hardest problem in the field

"Apple Inc.", "Apple", "AAPL", and "the company" may all be one entity. Or, in a corpus that also discusses agriculture, they may not.

Entity resolution is deciding which mentions refer to the same real-world thing, and it is where graphs quietly die. Get it wrong in one direction and your graph fragments into duplicate nodes that never connect, so your three-hop queries silently return nothing. Get it wrong in the other direction and you merge two different companies into one node and every answer downstream is wrong.

The naive approach, string similarity, fails immediately, because context decides. Use the model, and make it show its work:

Below are entity mentions extracted from a corpus, each with the sentence
it appeared in.

Group the mentions that refer to the same real-world entity.

Rules:
- Merge only when the surrounding context supports it, never on string
  similarity alone.
- Choose one canonical name per group, preferring the fullest formal form.
- If you cannot determine it with confidence, put the mention in `uncertain`
  with a one-line reason. Do not guess.

Output JSON:
{"entities": [{"canonical": ..., "type": ..., "mentions": [...]}],
 "uncertain": [{"mention": ..., "reason": ...}]}

The uncertain bucket is the whole trick. A model forced to choose will always choose. A model given permission to defer hands you a short review queue instead of silent corruption. Review that queue by hand. It is the highest-value hour you will spend on the project.

Step 7 — Model provenance and time from day one

Two properties belong on every fact you store, and adding them later is agony.

**Provenance:** where did this fact come from? Which document, which sentence. Without it you cannot audit, debug, or trust anything, and you certainly cannot explain an answer to a regulator or a customer.

**Temporal validity:** when was this true? A CEO relationship isn't eternal. A price was valid for a window. A graph without time collapses a decade of changing reality into one contradictory blob.

Bake both into your schema in Step 5 so every edge carries a source reference and a validity window. Retrofitting them means touching every edge you ever wrote.

### Phase 4: Construction with Kimi K3

Step 8 — Extraction: turning text into a graph

Now the fun part. This is the step that used to require a team.

Before the prompt, why K3 specifically fits this job. It has a **one-million-token context window**, which matters enormously for reasons I'll unpack in Step 9. It has **native vision**, so it reads charts, diagrams, and scanned documents rather than choking on your real-world PDFs. It reports a **very high cache-hit rate on repetitive loops**, and extraction is the definition of a repetitive loop, the same long schema prompt against thousands of different documents, so the cached prefix keeps the bill sane. And its token price runs roughly a third of the top closed models, which is the difference between affording a corpus and not.

The extraction prompt:

Extract a knowledge graph from the document below.

Use ONLY this schema. Do not invent node or relationship types:
[paste your schema from Step 5]

Use these canonical entity names wherever a mention matches:
[paste canonical entity list from Step 6]

Rules:
- Extract only facts explicitly stated in the text. No inference. No outside
  knowledge. If it isn't in the document, it doesn't exist.
- Every edge MUST include `evidence`: the exact sentence it came from, verbatim.
- If a mention doesn't match the canonical list and you're unsure, put it in
  `unresolved` rather than creating a new node.
- If a fact is hedged ("reportedly", "may have"), set confidence: low.
- Output valid JSON only, no commentary:
  {"nodes": [...], "edges": [...], "unresolved": [...]}

Document:
[text]

Two lines carry most of the weight. **"No inference, no outside knowledge"** stops the model from helpfully adding facts it happens to know, which is how a knowledge graph fills with plausible fiction. And **"every edge must include the exact sentence, verbatim"** gives you something priceless, which Step 11 turns into an automatic hallucination filter.

Step 9 — Use the million-token context to keep the graph consistent

Here is why most LLM-built knowledge graphs are quietly broken, and it is not the model's fault.

The standard pipeline chunks documents into small pieces and extracts from each chunk independently. So the extractor sees chunk 3 and creates "Apple Inc." Later it sees chunk 47, with no memory of chunk 3, and creates "Apple." Two nodes, one company, and your three-hop query returns nothing because the path is severed. Multiply that across thousands of chunks and you don't have a knowledge graph, you have a pile of disconnected fragments that looks like one.

A million-token window changes the unit of extraction. Instead of a chunk, you can hold an entire document, or a whole cluster of related documents, in view at once, so entities stay consistent across the full text because the model can actually see the full text. K3's architecture is built to make working in that window practical rather than theoretical, with attention changes specifically designed to keep decoding fast at million-token scale.

The practical pattern:

1. Group related documents into batches that fit comfortably in context, everything about one company, one project, one time period.
1. Extract each batch in a single pass, so all entities within it resolve against each other.
1. Carry the canonical entity list forward into the next batch, so consistency compounds across batches.

That third step is the one people skip. Each batch should start with the entity list you've already established. That's how you get global consistency rather than merely local consistency.

Step 10 — Build the extraction harness

You don't want to paste documents into a chat window a thousand times. You want a loop.

The harness is straightforward, and K3 through the Kimi Code CLI can build most of it for you, since strong long-horizon coding is what it was designed for:

1. Read the next batch of source documents.
2. Send them with the schema prompt and the current canonical entity list.
3. Parse the JSON response. If it isn't valid JSON, retry once with the error.
4. Run the validation gates (Step 11). Reject anything that fails.
5. Write what passes to the graph. Log what failed, with the reason.
6. Append newly canonicalized entities to the entity list.
7. Repeat. Stop on the batch limit, the cost cap, or the failure-rate threshold.

Note steps 4 and 7 especially. **Never write model output straight into your graph**, and always run under a budget, a cost cap and a failure-rate circuit breaker, so a misconfigured run can't spend all night producing garbage at scale.

Step 11 — The quality gates that make this trustworthy

This is what separates a real graph engineer from someone who pasted documents into a model. Four gates, run before anything is written:

**Gate 1: Schema conformance.** Does every node and edge type exist in your schema? Anything else is rejected outright. Deterministic, instant, catches drift.

**Gate 2: Evidence verification.** Take the evidence sentence from each edge and check that it appears verbatim in the source document. If it doesn't, the fact was fabricated. Reject it automatically.

Sit with that one, because it is the most important technique in this entire course: it is a **deterministic check on a probabilistic output**. You are not asking a model whether it hallucinated. You are string-matching against ground truth. This single gate eliminates the dominant failure mode of LLM-built graphs, and almost nobody implements it.

**Gate 3: Cardinality sanity.** A person born in two different places. A contract signed before it was drafted. Encode a handful of rules your domain says are impossible and flag violations for review.

**Gate 4: Human sampling.** Pull a random sample of accepted facts each run and read them yourself. Ten minutes. If the sample is clean, ship the batch. If it isn't, you just caught a systemic problem before it contaminated the whole graph.

### Phase 5: Using the graph

Step 12 — Graph algorithms: the questions only a graph can answer

Once your graph exists, a set of classical algorithms extracts insight nothing else can. These are decades old, battle-tested, and available as one-line calls in every serious graph platform.

**Degree centrality:** who has the most connections. Your hubs.
 **Betweenness centrality:** who sits on the most paths between others. This finds brokers and single points of failure, the person or system whose removal disconnects the network. It's frequently the most valuable and least obvious result in the whole graph.
 **PageRank:** influence weighted by the influence of your connections. Not just well-connected, but connected to what matters.
 **Community detection** (Louvain, Leiden): the natural clusters in your data, discovered rather than declared. These regularly reveal structure nobody knew existed.
 **Shortest path:** exactly how two entities are connected, and through whom.

Run all five on your graph the day it's built. The results routinely surprise the people who commissioned it.

Step 13 — GraphRAG: retrieval that can actually follow a chain

This is where the graph pays for itself in an AI system.

GraphRAG, introduced by Microsoft Research in 2024 and open-sourced that July, is now the reference architecture for combining LLMs with knowledge graphs. It works in two phases: an **offline indexing phase** that builds the graph from your text and generates summaries of each detected community, and an **online query phase** that uses both to answer questions.

The reason it matters is the distinction between two kinds of question. **Local questions** ("what did this contract say?") are fine with ordinary vector retrieval. **Global questions** ("what are the main themes of risk across all our contracts?") are impossible for vector search, because no single chunk contains the answer, it's a property of the whole corpus. Community summaries answer exactly those.

Three things to know before you build:

**Cost is the real constraint.** Full GraphRAG indexing is expensive, because it runs a model over your entire corpus. Lighter variants exist specifically to address this: LazyGraphRAG defers expensive construction until query time and cuts indexing cost dramatically, and LightRAG achieves comparable accuracy with roughly an order of magnitude fewer tokens. Start light. Scale up only if you need to.

**Hybrid is the production standard.** The dominant pattern in 2026 is not graph-only. It's vector search, graph traversal, and plain database lookup sitting behind a query router that picks the right tool per question. Use the graph for multi-hop and structural questions, vectors for fuzzy semantic recall, SQL for aggregates.

**How you traverse matters more than you'd think.** Research suggests the choice of graph operators, how you walk and rank the graph, often matters more than the graph's structure itself, with methods combining traversal and statistical ranking like Personalized PageRank performing consistently well. Don't over-invest in an elaborate schema before you've tuned retrieval.

### Phase 6: Production

Step 14 — Maintenance: the part that decides whether this survives

A knowledge graph is not a project you finish. It's a system you run. Four things to get right:

**Incremental updates.** Re-extracting everything on every change is unaffordable. Use change detection on your sources to trigger updates for only what actually moved.

**Contradiction handling.** When a new fact conflicts with an existing one, never silently overwrite. Flag it, keep both with their provenance and time windows, and resolve deliberately. Silent overwrites are how a graph gradually becomes confidently wrong.

**Decay and staleness.** Facts age. Track when each was last confirmed, and surface anything that hasn't been reconfirmed in a long time.

**Schema evolution, carefully.** Your schema will need to change. Because retrofits are so expensive, treat schema changes like database migrations: versioned, planned, tested on a subset, never improvised.

### The honest caveats

Four things a course that only sells you the upside would skip.

**Hallucinated relationships are the number one failure mode.** A model will confidently assert a plausible relationship that appears nowhere in your source. This is why Step 11's evidence gate isn't optional. Build it before you build anything else.

**You may not need an LLM for all of it.** One production study found a dependency-parsing extraction pipeline, no LLM at all, reached about 94% of LLM-built graph quality at dramatically lower cost and better scalability. The pragmatic architecture is often a cheap deterministic extractor for the bulk and a strong model for the hard cases.

**Don't run everything on K3.** It runs at maximum reasoning effort by default, which means longer latency and more output tokens than you may expect, and reasoning tokens count as output tokens on your bill. Route the mechanical bulk extraction to a cheaper, lighter model, and reserve K3 for what it's genuinely best at: schema design, entity resolution, ambiguous documents, multimodal sources, and building the pipeline itself. K3 is also not laptop-runnable at 2.8 trillion parameters, so realistically you're using the hosted API, and Moonshot itself acknowledges the very top closed models still lead on raw capability for the hardest single tasks.

**Graphs are not always the answer.** If your questions are single-hop lookups or aggregations, use a database. The graph earns its complexity only when relationships are the thing you're actually querying.

### The point

Graph engineering was never gatekept by difficulty. The concepts in this article are learnable in a weekend. It was gatekept by **labor**, the crushing manual cost of extraction, resolution, and maintenance that meant only large institutions could afford a knowledge graph at all.

That labor is now largely automatable. Which means the barrier moved, and what's left is the part that was always the actual discipline: deciding what to model, what to trust, what to merge, and what to throw away. The machine does the extraction. You supply the judgment.

And judgment is the scarce thing. There is a real shortage of people who can look at a messy corpus and design the schema that makes it answerable, who know that similarity isn't relevance, and who build the evidence gate before the demo. That skill compounds, transfers across every domain, and is in the awkward position of being urgently needed while almost nobody has trained for it.

Fourteen steps. Start at Step 1 today by writing down five multi-hop questions about your own data. Get through Step 4 this week. You'll know more about graph engineering than most people currently shipping AI systems.

The people who answer the connected questions are about to be a lot more valuable than the people who can only find similar text.

**If you found this useful, follow me** @eng_khairallah1 **for more AI content like this. I post breakdowns, courses, and tools every week.**

**hope this was useful for you, Khairallah ❤️**
