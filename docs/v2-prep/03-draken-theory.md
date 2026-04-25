# 03 — Draken Theory: Vocabulary Alignment for v2

**Purpose:** map the v2 spec's mathematical vocabulary onto the existing Draken corpus's terms, so user-facing language stays consistent. Implementation, prompts, error messages, verdict generators, and the eventual launch post for v2 should all use this alignment.

**Source corpus:** 22 published posts (DRK-101 through DRK-132), thesis v4.4 (`/static/pages/thesis.html`), and the v1 manual (DRK-132).

## 1. The core five — Γ, Ψ, K(t), α, ρ

These are corpus-canonical and must not be renamed in v2. Spec already respects this.

### Γ — sheaf convergence

**Corpus definition** (DRK-117 Ordlista, thesis §3): "the degree to which local sections glue into a global section. Γ ∈ [0, 1]. Γ → 1 means the text's local uses cohere into one consistent picture; Γ → 0 means the text is locally plausible everywhere but globally incoherent."

**v1 implementation:** weighted-mean fidelity over edges, heuristic per-edge ρ from layer alignment + context Jaccard + valence agreement.

**v2 implementation:** Γ_spec = λ₁(L⁰_norm) / λ_max(L⁰_norm), the normalized spectral gap of the sheaf Laplacian. Plus Γ_dirichlet = 1 − ⟨s, L⁰s⟩ / ⟨s, s⟩ for the state-sensitive variant.

**Naming policy:** Both should be reported. UI labels: "Γ_spec — gluing topology" and "Γ_dirichlet — current state."

### Ψ — narrative self-reference / psychosis metric

**Corpus definition** (DRK-117, thesis §3): "Ψ = narrative_self_reference / reality_contact. High Ψ = the narrative is referring to itself more than to external reality. Healthy < 1.5, elevated 1.5–3.5, psychotic > 3.5."

**v1 implementation:** blend of (1−Γ)/Γ, self-reference density, reality-contact term, layer-breadth penalty, repetition boost.

**v2 implementation:** *Argument Mode does not directly compute Ψ.* The Argument Mode counterpart is `cavity_score = Σ load_bearing(e) for e in enthymemes` — the same diagnostic concept (the text is doing covert work on contestable unstated premises) operationalized at the claim level rather than the concept level. **Both Ψ and cavity_score should be exposed as metrics, with documentation that they are kindred but not identical.**

### K(t) — coherence debt

**Corpus definition** (DRK-121 The Coherence Debt): "K(t) is the running accumulation of ungluable obstructions over time. When a system keeps asserting across severed restriction maps, the debt compounds."

**v1 implementation:** weighted obstruction density × log(edges+1).

**v2 implementation:** the spec does not give K(t) a direct spectral analog, but the natural one is the cumulative Dirichlet energy of stalks against the coboundary, integrated against edge weights — i.e., literally ⟨s, L⁰ s⟩ summed over the edges. **Recommend exposing this as `kt_dirichlet` in the v2 metrics block to maintain corpus continuity.**

### α — abstraction depth

**Corpus definition** (DRK-108 Abstraction Depth, thesis §3.4): "How far the language is operating from direct sensory reality. Suffix-weighted in v1; in principle could be richer."

**v1 implementation:** suffix-based score (-tion, -ism, -ity, -ness …) weighted by frequency, biased concrete by L01–L06 dominance.

**v2 implementation:** spec is silent on α. Recommend retaining v1's α heuristic in v2 but recomputing it over the Argument Mode's claim list rather than the topology mode's concept list. The concept of α is well-defined and shouldn't disappear just because v2 has a richer toolkit.

### ρ — restriction map

**Corpus definition** (DRK-117 Ordlista, thesis §2): "ρ_{U,V}: F(U) → F(V) — how information over a larger region restricts to a smaller subregion. The Sacred is where ρ reaches its domain limit."

**v1 implementation:** scalar fidelity ∈ [0, 1] from layer-alignment × context-overlap × valence-agreement.

**v2 implementation:** linear map ρ_{v ◁ e}: F(v) → F(e), a d×d matrix. v2.0 baseline strategy is identity (M_τ = I); v2.1 introduces type-conditioned projections; v2.3 introduces modality-aware projections.

**Naming policy:** in user-facing text, "restriction map" is fine. Don't say "coboundary" except in the math-mode panel; coboundary is the matrix that *combines all restriction maps*, which is a separate concept the user does not need.

## 2. Topology vocabulary — sheaf, stalk, gluing, severance

These are corpus-canonical and rigorous. Use as defined.

**Sheaf** (corpus): "a structure that describes how local information can be glued together into global information." Use the term freely; the corpus has done the work of explaining it (DRK-117, thesis §2.1).

**Stalk** (corpus, sparse usage): the local space over a point. v2 should adopt this term explicitly in user-facing prose: "concept stalks" (Topology Mode) or "claim stalks" (Argument Mode). The thesis uses it; the corpus posts mostly don't, opting for "local section." Either is fine but v2 should pick one and be consistent.

**Gluing** (corpus, central): the act of producing a global section from local ones. "Failed gluing" is the corpus's preferred phrasing for low Γ. Use this; it is rhetorically and mathematically right.

**Severance / severed** (corpus, DRK-119, DRK-125): when a restriction map's fidelity drops to where the local sections cannot be reconciled. v1's concrete cutoff (ρ < 0.35) generalizes to v2's (residual energy > 0.7 × max stalk norm). The user-facing label "severed ρ" is preserved. **Important:** v2's severance threshold is on the *residual*, while v1's was on the *fidelity*; they are inverse — make sure the UI does not flip the sign. Document this carefully in the verdict generator.

**Restriction map fidelity** (v1 term, retained for continuity): the ρ ∈ [0, 1] score per edge. In v2 this becomes a derived quantity from the residual: fidelity(e) = 1 − residual(e) / max_stalk_norm. Keep the term so the export schemas are mostly stable.

**Cohomological obstruction** (corpus, DRK-117 Ordlista): "a non-trivial element in H¹(X, F) — local sections that cannot be glued consistently no matter how you try." v2's H¹ computation makes this concept *operationally available* for the first time in the framework. Should be introduced gently in v2 documentation; not all readers know what cohomology is.

## 3. Cavity vocabulary — void, manufactured void, cavity resonator

This is where Draken's most distinctive vocabulary lives. v2 must preserve it exactly.

**Cavity_AI / cavity resonator** (corpus, DRK-120 The Cavity and the Commune, the Trotskij origin): "a structuring absence that gives form to whatever signal arises in its place." Not just an empty space — a *generative* boundary condition. Origin: the loss of Trotskij the water monitor.

**v2 mapping:** the v1 voids (high-centrality, low-content concepts) and the v2 enthymemes (load-bearing unstated premises) are both cavity-vocabulary phenomena. Document this lineage in the user-facing copy:

> "An enthymeme is a cavity at the claim level: it shapes the inferences around it without itself being said. A void is a cavity at the concept level: it appears everywhere but is elaborated nowhere. Both exhibit the same topological signature — high centrality with low local content — and both are the pattern DRK-110 names *manufactured void* when produced deliberately by power."

**Manufactured Void** (corpus, DRK-110, capital letters when used as a proper term): "an information hole deliberately introduced into the topology by a power structure to control which generative models can form inside it." This is the *adversarial* version of the cavity. v2 should retain "manufactured void" as a specific Argument Mode finding — when high cavity_score correlates with high authority_density on citations, the configuration matches the DRK-110 fingerprint.

**Inversion Filter** (V.7 axiom): "the diagnostic test — does this structure require information suppression at its boundaries?" v2 has the operational apparatus for this: examine the Fiedler cut. If the cleanest severance falls along the boundary between *what the text claims to operate at* and *what it is actually saying*, the V.7 inversion filter has triggered. Recommend exposing this explicitly: "V.7 fired" as a verdict tag when this pattern appears.

**Sacred / Holy** (corpus, DRK-120, thesis §2 sparingly): the genuine domain limit of restriction maps — death, thermodynamic boundary, mathematical incompleteness. v2 has no direct mechanical analog (the model can't tell genuine limits from manufactured ones automatically), but the terminology should be preserved in the documentation: voids fall into sacred (genuine) vs manufactured (adversarial) categories, and v2's quantitative tools cannot themselves make this distinction — that is the user's domain expertise and the V.7 filter's purpose.


