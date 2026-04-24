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

