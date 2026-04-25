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


