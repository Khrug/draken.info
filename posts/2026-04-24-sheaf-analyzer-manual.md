---
title: "The Sheaf Analyzer: A Topological Diagnostic for Arbitrary Text"
drk: DRK-132
date: 2026-04-24
tags: [technical, manual, tools]
layers: [L07, L08, L09, L10, L12, L15, L16]
coherence: 0.92
excerpt: "A self-contained, browser-only tool that applies the Draken framework's core constructs — cellular sheaves, restriction maps, sheaf convergence Γ, narrative self-reference Ψ, coherence debt K(t), and cavity voids — to any text you can paste, fetch, or pull from the draken.info corpus. It produces a rotatable 3D concept graph with load-bearing terms bold, tangential facts italic, and three export formats (deep JSON, Markdown report, minimal JSON) suitable for downstream Claude/Draken synthesis. This post explains what the tool is, what it computes, how to read its output, and what it honestly cannot do. A diagnostic, not a verdict."
status: published
author: Khrug Engineering
license: CC BY-SA 4.0
sources:
  - "https://draken.info/sheaf-analyzer/"
  - "https://draken.info/thesis/"
  - "https://doi.org/10.1007/s10958-019-04315-9"
---

*Internal cross-references: [Drakens Ordlista](https://draken.info/posts/drakens-ordlista/) (DRK-117), [The Manufactured Void](https://draken.info/posts/manufactured-void/) (DRK-110), [The Totalitarian Sheaf](https://draken.info/posts/the-totalitarian-sheaf/) (DRK-125), [The Coherence Debt](https://draken.info/posts/the-coherence-debt/) (DRK-121), [The Grammar of Coherence Destruction](https://draken.info/posts/grammar-of-coherence-destruction/) (DRK-119).*

---

## 1. What this tool is

The **Sheaf Analyzer** (at `/sheaf-analyzer/`) takes any text — a paragraph, an essay, a speech transcript, an institutional report, a social-media thread, the output of a press office, a draft you are editing, or the entire draken.info corpus — and renders its **topological structure** as a rotatable 3D concept graph, annotated with the Draken framework's core diagnostic metrics.

It is a browser-only tool. Nothing is uploaded, nothing is sent to a server. The text you paste is analyzed locally by JavaScript running in your own browser. The only network traffic is (a) the one-time load of the 3D graphics libraries from `draken.info/vendor/` and (b) — only if you ask for it — fetching a URL via a public CORS-enabled reader proxy. If you analyze a corporate memo, it never leaves your device.

The tool exists because the Draken framework makes several claims about language, institutions, and narrative coherence that are concrete enough to compute. If the claims are correct, we should be able to measure something. This is the "something."

## 2. The idea

The Draken 2045 thesis (see `/thesis/`) treats knowledge — and by extension, written discourse — as a **cellular sheaf** over a hierarchy of scales. Briefly, the ingredients are:

- **Stalks.** Over each "place" in the knowledge space (here, each concept), a local *section* of meaning lives. What the word *system* means in a cybernetics paragraph is not identical to what *system* means in a political column three pages later. The stalk is the bag of local uses.
- **Restriction maps ρ.** Between neighbouring stalks — concepts that occur together, or scales that are adjacent in the 18-layer hierarchy from L01 (quantum field) to L18 (planetary cognition) — there is a map that tells you how a local section over one place restricts to a local section over the other. The restriction map is where *gluing* either succeeds or fails.
- **Γ — sheaf convergence.** The degree to which local sections glue into a global section. Γ = 1 means the text's local uses cohere into one consistent picture; Γ → 0 means the text is locally plausible everywhere but globally incoherent.
- **Ψ — narrative self-reference / psychosis metric.** A system that has lost contact with its restriction maps begins to reference itself instead of the world. Ψ is an estimator of how much of the text's work is done by self-citation, in-group markers (*we*, *our people*, *our founder*), and closure phrases (*obviously*, *of course*, *those who cannot see*) rather than by external verifiable reference (proper nouns, dates, numbers, quoted sources).
- **K(t) — coherence debt.** The running accumulation of ungluable obstructions. When a text keeps asserting across severed restriction maps — when the institutional layer keeps claiming things the operational layer contradicts — the debt compounds.
- **Voids.** High-centrality, low-content nodes. Words that everything circles around but nothing actually says anything *about*. In the Draken vocabulary these are **cavity resonators** (DRK-110): structural absences that shape the surrounding signal.
- **Severed ρ.** Specific restriction maps whose fidelity falls below 0.35. These are the cut edges of the sheaf — places where two concepts co-occur in the text but fail to glue.

![The 18-layer Draken hierarchy, visualized as a stack of nested rings — physical foundations at the base (L01–L04), biological and neural scales in the green band (L05–L06), narrative and social layers in amber (L07–L10), institutional and economic in the violet band (L11–L16), and planetary cognition at the apex (L17–L18). Every concept extracted by the Analyzer is placed somewhere in this stack; restriction maps ρ run between neighbouring rings.](/images/draken-18-layers.png)

The Analyzer computes an **estimator** for each of these quantities from a co-occurrence graph over stemmed concept tokens, using a curated 18-layer keyword lexicon to place each concept on a scale. It is a *heuristic diagnostic*, not a formal sheaf-Laplacian computation over a real embedding space. The thesis itself labels Γ, Ψ, K as estimators. The tool makes those estimators visible on arbitrary text so that the theory has an empirical surface instead of just a paper surface.

## 3. Why bother

Three reasons.

**One — editing your own work.** A text that you feel is coherent can be low-Γ in places you did not notice. Loading it into the Analyzer shows you which concepts are doing load-bearing work and which are just sitting there; which edges between concepts are severed (a contradiction the reader will feel before naming); which of the 18 scales you claim to address but only glancingly touch. The Compare mode lets you hold two drafts side by side and see Δ-metrics — does the revision raise Γ, lower Ψ, close severed edges? If it does not, the revision is cosmetic.

**Two — diagnosing texts made by others.** Corporate statements, political speeches, platform policies, party programmes, press releases from organizations that have recently made a catastrophic mistake. A text that scores Γ high and Ψ high with narrow layer coverage is the mathematical signature of an echo chamber: locally coherent, globally narrow, self-referential. A text with many voids clustered on layers it refuses to name is what DRK-110 calls a manufactured void. These are not new ideas, but having a scale-free, reproducible measurement of them changes the conversation from "it *feels* off" to "ρ between L10 and L07 has fallen to 0.22 in this text."

**Three — corpus analysis.** In Corpus mode, the tool ingests the full draken.info archive (or any subset — all, one, any number) and builds a single meaning graph. You can examine coherence within a subset (*does my theory-tagged writing glue into one sheaf, or is it three disjoint frameworks?*), identify the load-bearing concepts across the whole corpus (*the argumentative skeleton of what I have been writing for six months*), and spot voids at the corpus level (*what do I keep circling but never define*). The same machinery works on someone else's corpus, a legislative history, or all of an organization's public statements for a fiscal year.

## 4. What the tool does, end to end

When you press **Analyze**, the following happens — all in your browser, typically in under a second for a single text, 2–5 seconds for the full corpus:

1. **Segmentation.** The text is split into paragraphs, then sentences, using punctuation cues with a Unicode-aware regex.
2. **Tokenization and stemming.** Each sentence is lowercased and split on whitespace plus punctuation, while preserving the original case of each raw token (this matters for step 5 — proper-noun detection). A light suffix stemmer collapses *-ing*, *-ed*, *-es*, *-ly*, *'s*, and plural *-s* into shared stems, conservatively enough that *social* does not become *soci*. Stopwords — common articles, prepositions, discourse markers, and propaganda-adjacent fillers — are dropped.
3. **Concept extraction.** Each stem that survives becomes a **concept** with: frequency, list of containing sentence indices, co-occurring concepts, and, in Corpus mode, the set of source post IDs it appeared in. Concepts below a frequency threshold are discarded.
4. **Layer tagging.** Each concept is scored against an 18-layer keyword lexicon using strict matching rules (no 3-letter substring contamination — *ion* does not match *institutional*). The result is a per-concept layer distribution and a dominant layer.
5. **Sheaf construction.** Pairs of concepts that co-occur in at least one sentence form an edge. Each edge carries a **weight** (log-frequency of co-occurrence blended with normalized pointwise mutual information) and a **restriction fidelity ρ ∈ [0, 1]** computed from three factors: layer alignment (same or adjacent layers get high ρ; distant layers get low ρ), context overlap (Jaccard of the sentence-index sets), and valence agreement (positive-valence concepts adjacent to negative-valence concepts dampen ρ). Edges with ρ < 0.35 are flagged **severed**.
6. **Global metrics.** Γ is the weight-normalized mean fidelity across all edges. Ψ combines the graph-theoretic term (1 − Γ)/Γ with text-level terms: self-reference density, reality-contact density (inverse of external-reference count), layer-breadth penalty, and a bounded repetition boost. K(t) is the weight-normalized obstruction budget × log(edges+1), scale-free so corpus subsets remain comparable. α is a suffix-weighted abstraction score. Severed ρ is a simple count.
7. **Voids.** Concepts with high weighted degree but low co-occurrence diversity are flagged as potential voids — high centrality, low content. Proper nouns (detected via case preservation from step 2) are excluded so that *Minneapolis* or an author name does not get marked as a cavity.
8. **Salience.** For each concept: *salience* = 0.45 · normalized weighted degree + 0.35 · log-frequency / log-max-frequency + 0.20 · source-coverage fraction. Salience is the "how load-bearing" score.
9. **Enrichment.** Narrative structure is computed by splitting sentences into opening / middle / closing thirds and ranking dominant concepts per third. A rolling valence trajectory is computed in windows of ~15 sentences. Severed edges are grouped into connected components — "severed clusters" — which reveal coherent sub-regions of the sheaf whose gluing failed jointly. Per-layer summaries are assembled with top concepts, aggregate valence, and a representative sample sentence.
10. **Render.** The top concepts by salience are placed as spheres in a 3D force-directed graph, coloured by dominant layer, sized by salience, labelled in three tiers (top 15 % bold, middle 40 % regular, bottom 45 % italic small). Edges render with width proportional to weight, opacity proportional to ρ, and red for severed. Particles flow along high-weight healthy edges. The inspector panel and text view update with per-concept data.

None of this requires a GPU, a backend, or a network connection once the page has loaded. It is all in a single HTML file, roughly 70 KB of JavaScript.

## 5. The metrics, in operational terms

### Γ — sheaf convergence

**Range:** [0, 1]. **Read:** ≥ 0.75 locally coherent · 0.55–0.75 degraded · < 0.55 incoherent.

**What it means.** Γ is the weighted mean of the restriction-map fidelities across all edges of the concept graph. It asks: when two concepts in this text co-occur, do they plausibly belong to the same neighbourhood of meaning (same or adjacent scale, overlapping contexts, compatible valence), or do they merely happen to share sentences?

**What moves it.** Drafts that stitch together vocabulary from several scales without building the bridge concepts that would glue the scales score low. Drafts whose concepts cluster tightly in two or three adjacent layers and reinforce each other score high. Importantly, a very narrow corpus can score Γ high — local coherence without global scope — which is exactly why Ψ and layer coverage must be read alongside it.

### Ψ — narrative self-reference

**Range:** [0, 10], capped. **Read:** < 1.5 healthy · 1.5–3.5 elevated · > 3.5 psychotic.

**What it means.** Ψ is the Draken framework's operational definition of "the narrative has lost contact with the world and is doing its work by referring to itself." It is not a mental-health concept; it is a topological one. At high Ψ, restriction maps between the text's narrative layer (L07) and its empirical or institutional layers (L10, L13, L14) are functionally severed, and the text is plugging the gap with self-citation.

**What moves it.** Every *we*, *our*, *our community*, *our founder*, *as I said*, *obviously*, *of course*, *no reasonable person* contributes to the numerator. Every proper noun, year, number, quoted source, and named external entity contributes to the denominator. A narrow layer coverage (< 25 % of the 18 layers touched) adds a penalty because narrow-scope-with-high-local-Γ is the mathematical signature of an echo chamber. A single academic paper with a healthy citation density and broad coverage will score Ψ in the 0.3–1.0 range; a polemical column will score 1.5–3.5; a conspiratorial tract, > 3.5.

### K(t) — coherence debt

**Range:** [0, ~6], scale-free. **Read:** < 3 low · 3–6 moderate · > 6 high.

**What it means.** K is the accumulated-obstruction budget: Σ edge_weight · (1 − ρ) normalized by total weight, then multiplied by log(edges + 1) so that growing the graph does not automatically grow the number. In the full Draken theory K(t) is time-integrated — the debt accumulated by a system over time as it keeps asserting across severed maps. Here it is a single-snapshot reading, but it is comparable across analyses, which is what matters for editing.

**What moves it.** Many edges with low ρ. A text can have high Γ on average but a long tail of moderately obstructed restriction maps, and that tail is what K reads.

### α — abstraction depth

**Range:** [0, 1]. **Read:** < 0.4 grounded · 0.4–0.7 mixed · > 0.7 abstract.

**What it means.** How far from sensory reality the concepts in the text are operating. Concepts ending in *-tion*, *-ism*, *-ity*, *-ness*, *-ance*, *-ence*, *-ology* are treated as abstract; concepts dominantly mapped to L01–L06 (the physical-biological scales) are treated as concrete. The frequency-weighted mean is α.

**Why it matters.** High α with low empirical anchoring (few proper nouns, few numbers, few named mechanisms) plus low Γ is the cavity signature from DRK-110: a text suspended high above the ground with nothing to tie it down.

### Severed ρ

A count of edges with ρ < 0.35. Absolute number. A single short essay with zero severed edges is either very tight or very narrow; read it together with Γ and layer coverage to tell which. In corpus mode, severed counts in the low hundreds are normal because the corpus spans many topics.

### Voids

Concepts with high weighted degree and low co-occurrence diversity (the neighbourhood is narrow relative to frequency). These are the words your text speaks *around* without speaking *into*. Four or more voids clustered on layers the text otherwise claims is a DRK-110 marker.

### Salience

Not a diagnostic metric — an importance score used to drive the graph's visual hierarchy. *salience* = 0.45 · centrality + 0.35 · log-frequency + 0.20 · source-coverage. It answers: "of all the concepts this text contains, which ones is it actually resting on?" The top 15 % by salience are rendered bold; the bottom 45 % italic. In the full draken.info corpus (21 posts, 4 302 concepts), the top-salience terms are *system, draken, structural, signal, coherence, framework, model, institutional, information, narrative* — which is a reasonable précis of what the corpus is doing.

## 6. Three modes

### 6.1 Single text

Paste or URL-fetch. Click **Analyze**. The graph renders, the metrics fill, the text view shows your source with every recognized concept underlined and clickable. Click any word — or any node in the 3D graph — and the inspector populates with the concept's dominant layer, layer distribution, top restriction-map neighbours (with their ρ values), sample sentences, valence, self-reference hits, and void flag.

Use this mode for individual pieces of text: an article, a speech, a report, an email you are about to send that you suspect is working too hard.

### 6.2 Corpus

Click the **Corpus mode** tab. The tool fetches `/data/corpus.json` (which `build.js` generates at site-build time from the posts directory — 21 posts, ~566 KB, one fetch). A checkbox list appears with each post's DRK-ID, title, date, word count, per-post Γ, and layer badges.

- **Select all** — analyze the whole draken.info corpus as one sheaf.
- **Clear** — start over.
- **Theory only / Analysis only** — pre-built filters on tag.
- Or click individual checkboxes to build any subset.

Press **Analyze selected**. The tool concatenates the selected posts, runs the full pipeline, and produces one combined meaning graph. In the inspector, every concept now carries a *sources* field listing which DRK-IDs it appeared in. The text view is broken into per-post sections with DRK headers, so you can still see the concept in its original home.

Use cases:
- Self-audit: which concepts carry my argument across the most posts? Which posts are islands?
- Subset coherence: does my theory cluster glue better than my analysis cluster? Does a chosen trio of posts cohere?
- Onboarding: build the "core three" subset for a new reader and see whether those three glue into a competent introduction.
- Cross-author corpus: if you have 50 statements from an institution, pasted into a custom corpus.json (see the build.js source; it is straightforward to extend), you get the same analysis on external data.

### 6.3 Compare

Click **Compare two texts**. Two textareas appear, labelled A (blue) and B (gold). Paste a draft into each and press **Compare**. The tool runs both analyses independently and then produces:

- A metric delta table: ΔΓ, ΔΨ, ΔK, Δseverance, and concept-overlap counts (shared, A-only, B-only).
- A combined 3D graph with nodes coloured by origin — blue for A-only, gold for B-only, green for shared — and salience recomputed over the union so the tiers reflect comparative importance.
- A side-by-side text view with concepts tinted in the same palette, so you can see at a glance which concepts B added and which A had that B dropped.
- A built-in sample pair (corporate disconnect vs. echo chamber) that demonstrates the pattern.

Use cases:
- Before / after rewrite: does the revision actually close severed edges, or does it just add length?
- Official statement vs. internal memo: the same facts framed at different layers.
- Your draft vs. a Claude rewrite: where did the machine simplify, and did the simplification remove load-bearing concepts?
- Thesis abstract vs. thesis body: does the abstract honestly summarize, or does it operate at a different layer than the body?

## 7. Reading the 3D graph

The graph uses `three.js` plus `3d-force-graph`, loaded from `draken.info/vendor/` (same-origin, no CDN dependency). A force-directed simulation places concepts in 3D space.

**Colour.** Node colour encodes dominant layer. L01 (quantum field) at the blue end, through L07 (narrative self) in amber, L12 (national narrative) in purple, to L18 (planetary cognition) in green. Unlayered concepts — words that did not match any of the 18-layer lexicon — show in muted grey. Edge colour is green for healthy restriction maps (opacity scaling with ρ) and red for severed.

**Size.** Sphere size ∝ salience^0.85. The load-bearing concepts are visibly larger; the tangential ones are small.

**Labels.** Three tiers, determined by salience rank among visible nodes:

- **Top 15 %** — 800-weight bold, large font, full opacity. These are the concepts your text is resting on.
- **Middle 40 %** — regular weight, medium font, 85 % opacity. Supporting concepts.
- **Bottom 45 %** — 400-weight *italic*, small font, 65 % opacity. Tangential mentions that survived filtering but are not doing structural work.

**Density controls** in the top-right of the graph:

- **focus** — top 60 concepts, ~240 edges. Minimum clutter; the argumentative skeleton only.
- **balanced** (default) — 120 concepts, ~480 edges. The good default for exploration.
- **full** — 400 concepts, ~1 600 edges. Dense but still capped; use when you want to see the long tail.

At corpus scale (4 302 concepts, 191 279 edges) the unfiltered graph would render as an undifferentiated haze. The density cap is the difference between a legible diagnostic and a screenshot of static.

**Controls.**

- Desktop: left-drag rotates, scroll-wheel zooms, right-drag pans, click a node to inspect.
- Android / iOS: single-finger drag rotates, pinch zooms, two-finger drag pans. The canvas has `touch-action: none` set so the browser does not steal touch events for page scroll.
- A **zoom pad** in the bottom-right has explicit `+` / `−` / `↺ reset` buttons, sized for thumbs, because on small screens the pinch gesture on a WebGL canvas is occasionally flaky across browsers. Use the pad if pinch refuses to work.

**Other toggles.**

- **labels** — hide all labels if the spheres alone are enough.
- **voids** — highlight edges adjacent to cavity concepts with extra width.
- **fit** — recentre the camera on the whole graph.
- **reheat** — kick the force simulation if it has settled into an uninformative layout.

**Legend** in the bottom-left spells out the bold / regular / italic hierarchy and the severed-edge colour, so the encoding is self-explanatory to a first-time reader.

## 8. Exports for downstream Draken / Claude synthesis

The 3D graph is pedagogy. The heavy lifting — sentiment layering, narrative synthesis, generative extension, cross-layer gap analysis — is best done by handing a structured analysis document to a Claude / Draken session and asking it to think. The **Export ▾** menu produces three formats for this purpose.

### 8.1 JSON (deep)

A structured document, typically 40–80 KB for a single text or 60–120 KB for a corpus subset. Schema `draken-sheaf-analysis/v1`. Contains:

- `source` — mode (single / corpus), list of post IDs if corpus, sentence and concept counts.
- `metrics` — Γ, Ψ, K, α, severed count, void count, numerically precise.
- `verdict` — the human-readable summary string.
- `layerCoverage` — per-layer concept frequency, all 18 layers.
- `layerSummaries` — for each layer: top concepts, aggregate valence, one representative sample sentence.
- `narrative` — opening / middle / closing sections with dominant concepts per third.
- `valenceTrajectory` — rolling valence window points across the text.
- `severedClusters` — connected components of the severed-edge graph; reveals coherent sub-regions where gluing jointly failed.
- `severedEdgesTop` — top 30 severed edges by weight, for direct inspection.
- `voids` — cavity resonators with centrality and frequency.
- `topConcepts` — top 50 by salience, each with layer distribution, valence, source posts, up to 2 sample sentences, and top 5 restriction-map neighbours with ρ values.
- `_notes` — a block of natural-language explanation describing the schema and recommending downstream operations.

The raw text is **not** included. If you need the text in the downstream analysis you can either paste it alongside or reference the source URL / DRK-IDs. Keeping the export text-free keeps the file small enough to fit comfortably into a Claude context window together with a synthesis prompt.

### 8.2 Markdown report

A human-readable rendering of the same content, plus a `## Prompt for downstream synthesis` block at the top. That block names the Draken metrics, defines the thresholds, and suggests four concrete operations — sentiment layering, narrative arc reconstruction, cavity diagnosis, and generative synthesis — phrased so that a Claude session can take them as instructions without further framing. Paste the `.md` file into `claude.ai` and ask. The file is typically 30–50 KB, well within context limits, and the prompt is editable if you want to aim the synthesis at something specific.

### 8.3 JSON (minimal)

The compact flat structure — metrics, verdict, all concepts (not just top 50), all edges. Suitable when you want to feed the graph into downstream tooling (a spreadsheet, a Pandas dataframe, a custom visualization) rather than a conversation.

### 8.4 Example prompts for downstream use

After exporting a deep JSON or Markdown report from, say, a corporate press release, useful prompts include:

> "Given this Draken sheaf analysis, identify the *manufactured voids* (per DRK-110): which concepts are load-bearing (top salience) but have narrow co-occurrence neighbourhoods? For each, propose what structural absence is being circled, and what the filling narrative appears to be."

> "Given this analysis, the text scores Γ 0.88 and Ψ 2.3 with layer coverage concentrated on L09 and L13. Is this the echo-chamber signature (locally coherent, globally narrow, self-referential)? Draw on DRK-117 and DRK-119 to support your reading. Cite specific concepts and edges."

> "Compare-mode deep JSON of draft A vs draft B. ΔΓ = +0.08, ΔΨ = −0.4, 12 severed edges closed, 4 new voids introduced. Was this a structural revision or a cosmetic one? Identify which closed-severance edges carry the most weight and which new voids are most concerning."

> "Full-corpus deep JSON. Of the top-50 load-bearing concepts, which ones span ≥ 18 of 21 source posts? Propose an ontological extraction: these are the candidate primary terms for a Draken glossary v2. For each, draft a one-sentence definition consistent with the sample sentences and the framework."

These are Draken-native operations the tool cannot do itself but which the export makes mechanical for a downstream model.

## 9. Use cases

### 9.1 Editing in progress

Load a draft into Single mode. Press Analyze. Read the metric strip first — Γ, Ψ, K, α. Then look at the voids list and the severed edges count. Ask the following, in order:

1. Which scales am I claiming to operate on? Check the layer coverage grid.
2. Which scales am I *actually* operating on? The top-salience concepts and their dominant layers.
3. Do the two agree?
4. Which concepts are voids? Am I speaking around something I should name?
5. Are there severed edges whose endpoints I did not realize were in tension?

Revise. Run Analyze again. If the numbers move in the right direction (Γ up, Ψ down, severed closed, voids resolved) and the topology has actually changed (new edges, new layer coverage, not just new prose around the same skeleton), the revision is structural. If the numbers do not move, the revision is cosmetic. This feedback loop is perhaps the most valuable use of the tool for writers.

### 9.2 Diagnosing external texts

A political speech, a Fed minutes release, a ministry press statement, a corporate earnings call transcript, an academic abstract you are suspicious of. Paste or URL-fetch. Read the verdict line. Inspect the voids. Look at layer coverage: a text that claims to speak about the national economy but only touches L10 and L13 — never L14 or L18 — has told you, structurally, what it is not willing to discuss.

The Analyzer is particularly good at surfacing two patterns:

- **Echo chamber.** High Γ, high Ψ, narrow layer coverage, high self-reference density. Locally coherent, globally narrow, self-sealing.
- **Manufactured void (DRK-110).** Several high-salience voids clustered on layers the text refuses to name. The text is load-bearing on a structural absence.

Neither of these diagnoses is a verdict. They are hypotheses the topology is suggesting. Verify with domain knowledge.

### 9.3 Comparative analysis

Two versions of the same speech, delivered a year apart. Two drafts of the same policy paper. The official statement and a leaked internal memo on the same event. Two ideologically opposed publications covering the same incident. Run Compare. The concept-overlap and metric-delta readouts show precisely what is the same, what is different, and whether the difference is structural (new concepts, new edges, new layer coverage) or cosmetic (same skeleton, different words).

### 9.4 Self-audit of a corpus

This is the use case the tool is most uniquely suited to. Load your own corpus in Corpus mode. Select all. Run Analyze. Ask:

- Which concepts carry my argument across the most posts? (High source-coverage = load-bearing across the body of work.)
- Which posts are disconnected islands? (Low shared-concept overlap with the main sheaf.)
- Is my theory a single coherent framework or three half-glued ones? (Severed clusters tell you where the joints are weak.)
- Which layers am I neglecting? (Low coverage is a to-do list.)
- Which voids recur across the whole corpus? (These are the terms you should define in a glossary or formalize into knowledge objects.)

Running this on the draken.info corpus has, at minimum, identified its top-salience concepts with the answer I would have written by hand if asked — which is circumstantial evidence the salience metric is not inventing structure.

### 9.5 Pedagogy

The visualization is a reasonable teaching aid for the framework itself. Load a sample text, step a student through the inspector, show them what a severed edge looks like, which layer cluster is doing what. The tool is a pedagogical surface for the thesis in exactly the sense that the (now-retired) sheaf game was supposed to be but less static — the concepts are real, the graph updates on paste.

### 9.6 Research tooling

The minimal JSON export is designed to pipe into standard data tooling. Running the Analyzer over a large external corpus (say, every UN General Assembly speech from 2000 onward, one session per file) would produce a time series of Γ, Ψ, K, α and layer coverage per speech, which is a dataset that could itself be analysed for patterns. The tool does not ingest files in bulk, but the machinery is already in place; a Node wrapper that drives the analyzer's JS on a directory of texts is a short script.

