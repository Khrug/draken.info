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

