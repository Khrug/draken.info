# Draken Analyzer v2 — Software Specification

**Status:** Implementation-ready · for execution by Claude Code
**Version:** v2.0.0-spec
**Date:** 2026-04-25
**Author:** Khrug + Claude (Opus 4.7), draken.info
**Related:** v1 analyzer at `draken.info/sheaf-analyzer/`, thesis v4.4 §9

---

## 0. Executive summary

The current Sheaf Analyzer (v1) computes a *proxy* Γ in the browser using heuristic restriction-map fidelity ρ ∈ [0,1] derived from layer alignment, context overlap, and valence agreement, with no embeddings and no linear algebra. This works for diagnostic intuition but is mathematically informal: Γ is not the kernel of any actual coboundary operator.

v2 adds two things:

1. **Real cellular sheaves.** With LLM embeddings and a backend, we can build proper vector-valued stalks F(v) ∈ ℝ^d, learned restriction maps F_{v◁e}: F(v) → F(e), the coboundary δ⁰, the sheaf Laplacian L⁰ = δ⁰* δ⁰, and compute Hodge cohomology H⁰ = ker(L⁰), H¹ = ker(δ¹) / im(δ⁰). Γ becomes the Fiedler value λ₁(L⁰) (after normalization), with a precise spectral meaning.

2. **Argument Mode.** A second analytical surface orthogonal to the existing concept-topology. It extracts a directed argument graph (claims as nodes, inferences as edges), detects enthymemes (hidden priors), and classifies citations by *load-bearing function* rather than presence. The same sheaf machinery applies, but over a different base space.

The two modes share infrastructure (backend, embedding cache, sheaf compute) but produce orthogonal diagnostics. Topology Mode answers *how does this text distribute meaning across scales?* Argument Mode answers *how does this text construct meaning across logical steps?* Together they form a clinch: a writer can iterate between them.

---

## 1. Architecture overview

```
┌───────────────────────────────────────────────────────────────────┐
│ Frontend (Cloudflare Pages, draken.info)                          │
│                                                                   │
│  ┌─────────────────┐    ┌─────────────────┐                       │
│  │ Topology Mode   │    │ Argument Mode   │  ← v2 addition        │
│  │ (existing v1)   │    │ (new)           │                       │
│  └────────┬────────┘    └────────┬────────┘                       │
│           │                       │                               │
│           └───────┬───────────────┘                               │
│                   │ /api/v2/* (REST + SSE for streaming)          │
└───────────────────┼───────────────────────────────────────────────┘
                    │
┌───────────────────▼───────────────────────────────────────────────┐
│ Cloudflare Worker (TypeScript, Node compat)                       │
│                                                                   │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐               │
│  │ /extract     │ │ /enthymeme   │ │ /citation    │               │
│  │  (claims)    │ │  (priors)    │ │  (load)      │               │
│  └──────┬───────┘ └──────┬───────┘ └──────┬───────┘               │
│         │ Anthropic API (claude-sonnet-4-6)                       │
│  ┌──────▼───────────────────────────────────────┐                 │
│  │ /embed (Voyage-3 or local sentence-trans.)   │                 │
│  └──────────────────────┬───────────────────────┘                 │
│                         │                                         │
│  ┌──────────────────────▼───────────────────────┐                 │
│  │ /sheaf  (in-Worker JS for small graphs)      │                 │
│  │         OR delegate to Modal Python service  │                 │
│  └──────────────────────────────────────────────┘                 │
│                                                                   │
│  ┌──────────────────────────────────────────────┐                 │
│  │ R2 cache (KV): embedding cache, claim cache  │                 │
│  └──────────────────────────────────────────────┘                 │
└───────────────────────────────────────────────────────────────────┘
                    │
                    │ for graphs > 500 nodes
                    │
┌───────────────────▼───────────────────────────────────────────────┐
│ Modal Python service (optional, for full-corpus runs)             │
│  - scipy.sparse.linalg.eigsh for L⁰ eigendecomposition            │
│  - sentence-transformers (offline embedding)                      │
│  - cvxpy (optional: optimal restriction map learning)             │
└───────────────────────────────────────────────────────────────────┘
```

**Three deployment tiers:**

- **Tier 1 (instant, free):** v1 topology mode — pure JS, no backend. Continues to work.
- **Tier 2 (LLM-powered, ~$0.01-0.10 per analysis):** Argument Mode in the Worker, calls Anthropic API for extraction and Voyage embeddings. Sheaf math in JS via `ml-matrix`. Handles up to ~500-node graphs.
- **Tier 3 (full corpus, optional):** Modal Python backend for full draken.info corpus topology runs with proper sparse eigendecomposition. Pre-computed nightly via cron, results cached.

---

## 2. The sheaf math — what we actually compute

### 2.1 Cellular sheaf, formally

A **cellular sheaf** F over a regular CW complex X (here: a directed graph G = (V, E)) consists of:

- For each vertex v ∈ V, a finite-dimensional inner product space F(v) — the *stalk* over v
- For each edge e ∈ E, a finite-dimensional inner product space F(e)
- For each incidence v ◁ e (vertex v is a face of edge e), a linear map ρ_{v◁e}: F(v) → F(e) — the *restriction map*

In v2 we set:

```
F(v) = ℝ^d          (d = 384 for Voyage-3-lite, 1024 for Voyage-3-large)
F(e) = ℝ^d          (same dimension; edge stalk)
s_v ∈ F(v)          (stalk vector = embedding of claim v)
ρ_{v◁e} = M_τ ∈ ℝ^{d×d}    (linear map indexed by inference type τ)
```

The choice of M_τ is the most important design decision. **Three candidate strategies**, in increasing sophistication:

1. **Identity (baseline):** M_τ = I for all τ. Then (δ⁰s)_e = s_v - s_u, the raw embedding difference. λ₁(L⁰) reduces to the standard graph Laplacian Fiedler value reweighted by edge confidence. Fast, interpretable, but ignores inference-type structure.

2. **Type-conditioned projections:** M_τ is a learned projection orthogonalizing in directions inappropriate for τ. E.g. for τ = analogical, project out the literal-meaning subspace. Requires a small learned model (one matrix per inference type) — train once on a labeled fixtures dataset.

3. **Modality-aware:** Each claim has a modality vector m_v (epistemic / normative / definitional / etc.) and ρ projects to the subspace consistent with the inference's modality. Captures *category errors* — a normative conclusion derived from descriptive premises is a known fallacy, and the restriction map should fail there.

**v2.0 ships with strategy (1).** Strategy (2) is post-MVP; strategy (3) is a research direction.

### 2.2 Coboundary, Laplacian, cohomology

With the graph oriented (each edge e = (u → v) has a head and tail), the **coboundary** δ⁰: C⁰(X; F) → C¹(X; F) is:

```
(δ⁰ s)_e  =  ρ_{v◁e}(s_v)  -  ρ_{u◁e}(s_u)        for e = (u → v)
```

Stack all stalks: s ∈ ℝ^{|V|·d}, t ∈ ℝ^{|E|·d}. Then δ⁰ is a sparse matrix of shape (|E|·d) × (|V|·d).

The **sheaf Laplacian** is

```
L⁰  =  (δ⁰)^T  δ⁰     ∈  ℝ^{|V|d × |V|d}
```

(positive semi-definite, sparse, block structure mirrors the graph).

The **0-cohomology** (global sections):

```
H⁰(X; F)  =  ker(δ⁰)  =  ker(L⁰)
```

The dimension dim H⁰ counts independent globally-consistent sections. For a connected graph with strategy (1), dim H⁰ = d (one constant section per embedding dimension). With non-trivial restriction maps, dim H⁰ can collapse — fewer compatible global views = more contradiction.

### 2.3 Coherence as a spectral quantity

We define **spectral coherence**:

```
Γ_spec  =  exp(-λ₁(L⁰_norm))      ∈  (0, 1]
```

where L⁰_norm is the symmetric normalized Laplacian (D^{-1/2} L⁰ D^{-1/2}) and λ₁ is its smallest *non-zero* eigenvalue (the Fiedler value / spectral gap).

Properties:
- Γ_spec → 1 when the graph is poorly connected (low spectral gap, things clump into clusters with weak inter-cluster gluing) — wait, this needs care: a small λ₁ means a strong cluster structure, which for *physical systems* means well-separated communities, but for *coherence* means gluing failure. So actually:

Reformulate. The Fiedler value λ₁ is *small* when the graph has a near-disconnection. Near-disconnection in the sheaf sense = gluing failure. So:

```
Γ_spec  =  λ₁(L⁰_norm) / λ_max(L⁰_norm)     ∈  [0, 1]
```

— a normalized spectral gap. **High Γ_spec = strongly glued, low Γ_spec = severable.** Calibration target: a corpus that the framework names as healthy (e.g. a textbook chapter on a single clean topic) should yield Γ_spec ≳ 0.4; a corpus showing the cavity-resonator pattern should yield Γ_spec ≲ 0.15.

Also expose **Dirichlet coherence**:

```
Γ_dirichlet  =  1  -  ⟨s, L⁰ s⟩ / ⟨s, s⟩
```

— this is the v1 Γ done properly: 1 minus the normalized Dirichlet energy of the actual stalk vectors. Sensitive to the *current state* of the sheaf, not just its topology.

### 2.4 The Fiedler vector — an interpretable diagnostic

The eigenvector v₁ associated with λ₁(L⁰_norm) is the **Fiedler vector**. Its sign pattern partitions V into two groups corresponding to the cleanest cut. **In Argument Mode, this directly identifies the structural fault line of the argument** — if it cuts between empirical claims and theoretical claims, you've found the cavity-resonator boundary in formal terms.

UI surfaces this as: "Cleanest severance in this argument: {top 5 claims on positive side} vs {top 5 claims on negative side}, gap λ₁ = 0.07." Click to highlight.

### 2.5 Higher cohomology H¹

For an argument graph, 2-cells arise naturally from **inference triangles**: if A → B, B → C, A → C all exist, that's a 2-cell. The coboundary δ¹ checks whether the long path A → B → C agrees with the short path A → C.

```
H¹  =  ker(δ¹) / im(δ⁰)
```

Non-trivial H¹ means: there are 1-cocycles (path-disagreements) that are not coboundaries (cannot be explained by adjusting individual claim stalks). **dim H¹ > 0 is a formal flag for inference inconsistency.**

This is post-MVP but the data structures should support it from day one.

---

## 3. Argument Mode — feature spec

### 3.1 Pipeline overview

```
INPUT TEXT
    │
    ▼
[1] Sentence segmentation     → list of sentences
    │
    ▼
[2] Claim extraction (LLM)    → list of (claim_id, claim_text, sentence_span)
    │
    ▼
[3] Modality classification   → claim_id → modality ∈ {epistemic, normative,
    (LLM)                                              definitional, causal,
                                                       conditional, factual}
    │
    ▼
[4] Inference graph (LLM)     → list of (premise_id, conclusion_id, type, strength)
    │
    ▼
[5] Enthymeme detection (LLM) → for each inference: implicit premise P* if any
    │
    ▼
[6] Citation extraction       → list of (source_string, anchor_claim_id, λ-signals)
    │
    ▼
[7] Citation classification   → source → {bearing, supporting, ornamental}
    (LLM + heuristics)
    │
    ▼
[8] Embedding                 → claim_id → vector ∈ ℝ^d
    │
    ▼
[9] Sheaf construction        → (V, E, F, ρ) data structures
    │
    ▼
[10] Sheaf Laplacian          → L⁰ sparse matrix
    │
    ▼
[11] Spectral analysis        → λ₁, Fiedler vector, top eigenvectors
    │
    ▼
OUTPUT: ArgumentSheafResult JSON + interactive UI
```

Each LLM step is independently cacheable by content hash. R2/KV cache keyed on `sha256(text_chunk + step_name + model_version)`.

### 3.2 Claim extraction (Step 2)

**Prompt template** (passed to claude-sonnet-4-6):

```
You are a careful reader extracting argumentative structure.

Given the following text, identify each ATOMIC CLAIM — a single proposition
that the text either asserts, presupposes, or treats as established.

For each claim, output:
- id: short stable identifier (c1, c2, ...)
- text: the claim restated in clean canonical form (one sentence, indicative mood)
- sentence_span: [start_idx, end_idx] in the original sentence array
- explicitness: "explicit" | "implicit" | "presupposed"
- confidence: 0.0–1.0 — how confident are you this is what the author meant?

Output strict JSON. Do not infer claims the text does not commit to.
Skip rhetorical questions, examples, and aside remarks unless they bear inferential weight.

TEXT:
{text}
```

**Output validation:** Pydantic-style schema check; reject and retry once on parse failure.

### 3.3 Modality classification (Step 3)

Six modalities, mutually exclusive:

| Modality | Cue words | Role |
|---|---|---|
| **epistemic** | "is true that", "evidence shows", "we know" | Knowledge claims |
| **normative** | "ought", "should", "must" (deontic) | Value claims |
| **definitional** | "is defined as", "means", "by X we mean" | Stipulations |
| **causal** | "causes", "leads to", "results in" | Mechanism claims |
| **conditional** | "if-then", "given that" | Hypothetical claims |
| **factual** | bare assertions of state | Descriptive claims |

LLM prompt classifies each claim, with optional secondary modality if mixed.

**Why this matters:** Hume's is-ought gap, the naturalistic fallacy, and many other classical fallacies are *modality crossings*. An inference from descriptive premises to a normative conclusion needs an explicit normative bridge — when missing, that's an enthymeme.

### 3.4 Inference graph extraction (Step 4)

**Inference type taxonomy (6 types):**

| Type | Symbol | Validity |
|---|---|---|
| **deductive** | ⊢ | Truth-preserving if valid form |
| **inductive** | ⊨_p | Probabilistic, strength ∈ (0,1) |
| **abductive** | ⊨_b | Inference to best explanation |
| **analogical** | ≈ | Structural similarity transfer |
| **authority** | ⊨_a | Source X says P, therefore P |
| **enthymemic** | ⊢* | Has missing premise(s) |

LLM prompt:

```
Given the claim list and the original text, identify INFERENCES:
relationships where one or more claims are presented as supporting another.

For each inference, output:
- id: i1, i2, ...
- premises: list of claim ids
- conclusion: claim id
- type: deductive | inductive | abductive | analogical | authority | enthymemic
- explicit_strength: 0.0–1.0 — how strongly does the text claim the link?
- formal_validity: 0.0–1.0 — independent assessment: does the inference go through?

If a conclusion is supported by multiple independent inferences, output them
separately. Do not invent inferences the text doesn't make.
```

The graph G is then directed, possibly cyclic (cycles = circular reasoning, which we want to detect, not exclude).

### 3.5 Enthymeme detection — *the key feature* (Step 5)

For each inference (P₁, …, Pₙ ⊢ Q) where formal_validity < 0.9:

```
PROMPT:

Given the premises {P_1, ..., P_n} and conclusion {Q}, the inference as stated
is not deductively or strongly inductively valid. Determine the MINIMAL implicit
premise P* that, if added, would make the inference valid.

Output:
- enthymeme_text: the implicit premise as a single declarative sentence
- category: epistemic | normative | definitional | causal | empirical
- contestability: 0.0–1.0 — how likely is a reasonable critic to dispute this?
- load_bearing: 0.0–1.0 — how much of the argument's force depends on it?
- evidence_required: brief description of what evidence would establish P*

If no single P* would suffice (the gap is too wide), output:
- gap_too_wide: true
- nearest_attempt: best partial reconstruction
```

**Output as virtual nodes** in the argument graph, marked as `synthetic: true, reason: enthymeme`. They participate in the sheaf computation but are visually distinct.

**Diagnostic value:**

```
Hidden Prior Density  =  |{enthymemes with contestability > 0.5}| / |inferences|
Cavity Score          =  Σ load_bearing(e) for e in enthymemes
```

A text with high Cavity Score has a lot of its argumentative weight resting on unstated, contested propositions — *the manufactured-void pattern made operational at the claim level.*

### 3.6 Citation analysis (Step 6–7)

**Extraction:** parse the text for citation markers — academic ("Smith 2023", "(Hansen & Ghrist 2019)"), URL references, named-entity authorities ("according to the WHO"), and quotation markers.

**For each citation, compute four signals:**

```
specificity        ∈ [0,1]  : Does the text cite specific claims/data/pages
                              from the source, or just the source name?
                              LLM-assessed.

derivation_load    ∈ [0,1]  : If we remove this citation and its surrounding
                              clause, does the argument's logical chain still
                              close? Computed by: re-run inference graph
                              extraction on text-without-this-passage,
                              compare which inferences disappear.

accessibility      ∈ [0,1]  : Is the source cited completely enough that a
                              reader could find and verify it? Heuristic:
                              presence of year, page, DOI, URL.

authority_density  ∈ [0,1]  : Density of authority-cue language in the
                              ±50-word window around the citation.
                              ("Nobel laureate", "world-leading", "renowned",
                              "groundbreaking" — counted, normalized.)
```

**Composite load:**

```
λ_cite  =  0.4·specificity  +  0.4·derivation_load  +  0.1·accessibility  -  0.3·authority_density
```

(Negative weight on authority density is intentional. Authority-cue stuffing without specificity is the fingerprint of trust-coloring.)

**Classification:**

| λ_cite range | Label | Meaning |
|---|---|---|
| ≥ 0.6 | **bearing** | Citation does logical work; removing it breaks the argument. |
| 0.3 – 0.6 | **supporting** | Citation reinforces but is replaceable. |
| 0.0 – 0.3 | **decorative** | Citation present but does no work. |
| < 0.0 | **trust-coloring** | Citation present primarily as authority signal; arguments do not actually rest on it. |

The last category is the diagnostic prize. It corresponds directly to the framework's claim about institutional discourse: the source is invoked to inherit credibility, not to do epistemic labor.

---

## 4. API specification

### 4.1 Endpoints

All endpoints under `/api/v2/`, JSON in/out, support SSE streaming for long jobs.

```
POST /api/v2/argument/analyze
  body: { text: string, mode: "full" | "fast", model?: "claude-sonnet-4-6" }
  response: { job_id: string }                    // 202 Accepted

GET  /api/v2/argument/result/{job_id}
  response: ArgumentSheafResult                   // 200 once ready, 202 if pending

GET  /api/v2/argument/stream/{job_id}             // SSE
  events: "claims_extracted", "modalities_done",
          "inferences_done", "enthymemes_done",
          "citations_done", "sheaf_computed",
          "complete", "error"

POST /api/v2/topology/analyze                     // upgraded v1 with embeddings
  body: { text: string, use_embeddings?: bool }
  response: TopologySheafResult

POST /api/v2/sheaf/compute                        // raw sheaf math endpoint
  body: { vertices: [...], edges: [...], stalks: [...], rho: [...] }
  response: { L0_eigenvalues: [...], fiedler: [...], gamma_spec, gamma_dirichlet, H0_dim, H1_dim }

GET  /api/v2/health
  response: { status, version, upstream_latencies }
```

### 4.2 Output schema — `ArgumentSheafResult`

```typescript
interface ArgumentSheafResult {
  schema: "draken-argument-analysis/v2";
  generated: ISO8601;

  source: {
    text_hash: string;
    char_count: number;
    sentence_count: number;
    chunked: boolean;
  };

  metrics: {
    gamma_spec: number;          // ∈ [0, 1], spectral coherence
    gamma_dirichlet: number;     // ∈ [0, 1], Dirichlet coherence
    H0_dim: number;              // dim of global sections
    H1_dim: number;              // dim of obstructions (post-MVP)
    fiedler_value: number;       // λ₁(L⁰_norm)
    cavity_score: number;        // Σ load_bearing of enthymemes
    hidden_prior_density: number;
    citation_health: number;     // mean(λ_cite for bearing citations)
    severed_inferences: number;  // count of edges with broken restriction maps
  };

  verdict: string;               // human-readable summary

  claims: Claim[];
  inferences: Inference[];
  enthymemes: Enthymeme[];
  citations: Citation[];

  sheaf: {
    eigenvalues_top10: number[];     // smallest 10 of L⁰_norm
    fiedler_vector: { claim_id: string; value: number }[];
    fiedler_cut: {                   // partition by sign
      side_A: string[];
      side_B: string[];
    };
    severed_edges: {
      premise_id: string;
      conclusion_id: string;
      restriction_residual: number;  // ‖ρ_v(s_v) - ρ_u(s_u)‖
    }[];
  };

  // Prompts for downstream synthesis (mirror of v1)
  downstream_prompt: string;
}

interface Claim {
  id: string;                     // c1, c2, ...
  text: string;
  sentence_span: [number, number];
  explicitness: "explicit" | "implicit" | "presupposed";
  modality: Modality;
  confidence: number;
  embedding?: number[];           // optional in response, always cached
}

interface Inference {
  id: string;                     // i1, i2, ...
  premises: string[];             // claim ids
  conclusion: string;             // claim id
  type: InferenceType;
  explicit_strength: number;
  formal_validity: number;
  has_enthymeme: boolean;
}

interface Enthymeme {
  inference_id: string;
  text: string;                   // the implicit premise
  category: "epistemic" | "normative" | "definitional" | "causal" | "empirical";
  contestability: number;
  load_bearing: number;
  evidence_required: string;
}

interface Citation {
  id: string;
  source_string: string;          // raw cite as it appears
  anchor_claim_ids: string[];     // claims this citation backs
  signals: {
    specificity: number;
    derivation_load: number;
    accessibility: number;
    authority_density: number;
  };
  lambda: number;                 // composite λ_cite
  classification: "bearing" | "supporting" | "decorative" | "trust-coloring";
}

type Modality = "epistemic" | "normative" | "definitional" | "causal" | "conditional" | "factual";
type InferenceType = "deductive" | "inductive" | "abductive" | "analogical" | "authority" | "enthymemic";
```

---

## 5. Backend — Cloudflare Worker (TypeScript)

### 5.1 Project structure

```
draken-analyzer-v2/
├── frontend/
│   ├── src/
│   │   ├── index.html
│   │   ├── topology-mode/        # v1, refactored
│   │   │   ├── main.ts
│   │   │   ├── analyzer.ts       # ported from v1 build.js
│   │   │   └── viz/
│   │   │       └── threejs-cloud.ts
│   │   ├── argument-mode/         # NEW
│   │   │   ├── main.ts
│   │   │   ├── api-client.ts
│   │   │   ├── viz/
│   │   │   │   ├── argument-graph.ts      # D3 force-directed DAG
│   │   │   │   ├── enthymeme-panel.ts
│   │   │   │   ├── citation-table.ts
│   │   │   │   ├── fiedler-cut.ts
│   │   │   │   └── spectrum-bars.ts
│   │   │   └── styles.css
│   │   ├── shared/
│   │   │   ├── tokenize.ts       # shared sentence segmentation
│   │   │   └── types.ts          # ArgumentSheafResult etc.
│   │   └── routes.ts
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── worker/
│   ├── src/
│   │   ├── index.ts              # entrypoint, route table
│   │   ├── routes/
│   │   │   ├── argument.ts       # POST /api/v2/argument/analyze
│   │   │   ├── topology.ts
│   │   │   └── sheaf.ts
│   │   ├── pipeline/
│   │   │   ├── extract-claims.ts
│   │   │   ├── classify-modality.ts
│   │   │   ├── extract-inferences.ts
│   │   │   ├── detect-enthymeme.ts
│   │   │   ├── extract-citations.ts
│   │   │   └── classify-citation.ts
│   │   ├── llm/
│   │   │   ├── anthropic.ts      # client wrapper
│   │   │   ├── prompts.ts        # all prompt templates, versioned
│   │   │   └── parse-json.ts     # robust LLM JSON parser
│   │   ├── embed/
│   │   │   └── voyage.ts         # Voyage embeddings client
│   │   ├── sheaf/
│   │   │   ├── coboundary.ts     # build δ⁰ as sparse matrix
│   │   │   ├── laplacian.ts      # L⁰ = δ⁰^T δ⁰
│   │   │   ├── eigensolver.ts    # Lanczos via ml-matrix
│   │   │   └── normalize.ts
│   │   ├── cache/
│   │   │   └── kv.ts             # R2 / KV cache
│   │   └── types.ts
│   ├── wrangler.toml
│   ├── package.json
│   └── tsconfig.json
│
├── compute/                      # Optional Modal Python service
│   ├── sheaf_service.py
│   ├── embed_service.py
│   ├── modal_app.py              # Modal deployment config
│   └── pyproject.toml
│
├── shared/
│   └── schema/
│       ├── argument-result.schema.json
│       ├── topology-result.schema.json
│       └── sheaf-input.schema.json
│
├── fixtures/                     # test corpora
│   ├── healthy-paragraph.txt     # known-good (textbook)
│   ├── cavity-resonator.txt      # known cavity pattern
│   ├── deepseek-dragons.txt      # the α-inflation specimen
│   ├── mckinsey-deck-page.txt
│   └── expected/                 # golden outputs
│       └── *.json
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── SHEAF_MATH.md
│   ├── PROMPT_VERSIONING.md
│   └── DEPLOYING.md
│
├── package.json                  # workspace root
├── pnpm-workspace.yaml
└── README.md
```

### 5.2 Key dependencies

**Worker:**
- `@anthropic-ai/sdk` — LLM calls
- `ml-matrix` — sparse linear algebra in JS, including Lanczos eigensolver
- `mathjs` — fallback for dense linalg
- `zod` — runtime schema validation
- `voyageai` — embeddings (or fall back to local sentence-transformers via Modal)

**Frontend:**
- `d3@7` — argument graph visualization
- `three@latest` — existing concept-cloud (v1)
- `vite` — build
- `lit-html` or vanilla — kept dependency-light

**Compute (Modal, optional):**
- `scipy`, `numpy` — sparse eigendecomposition
- `sentence-transformers` — alternative embedding source
- `networkx` — graph utilities
- `fastapi`, `pydantic` — service framework

### 5.3 Prompt versioning

All prompt templates live in `worker/src/llm/prompts.ts` with explicit version strings:

```typescript
export const PROMPT_VERSIONS = {
  extract_claims: "v1.2.0",
  classify_modality: "v1.0.0",
  extract_inferences: "v1.1.0",
  detect_enthymeme: "v1.3.0",
  extract_citations: "v1.0.0",
  classify_citation: "v1.0.0",
};
```

Cache keys include the prompt version. Bumping a version invalidates only that step's cache. This is critical for iterative prompt engineering on a live deployment.

### 5.4 Sheaf computation in JS — `worker/src/sheaf/`

**`coboundary.ts`:**

```typescript
import { SparseMatrix } from 'ml-matrix';

export interface SheafInput {
  vertices: { id: string; stalk: number[] }[];   // stalk = embedding ∈ ℝ^d
  edges: { id: string; tail: string; head: string; weight: number; type: string }[];
  d: number;                                       // embedding dimension
}

export function buildCoboundary(input: SheafInput): SparseMatrix {
  const { vertices, edges, d } = input;
  const V = vertices.length;
  const E = edges.length;
  const idIndex = new Map(vertices.map((v, i) => [v.id, i]));

  // δ⁰ ∈ ℝ^{Ed × Vd}
  // For edge e = (u → v) and dimension k ∈ [0, d):
  //   row index: e * d + k
  //   For tail u: M_τ at column (idIndex(u)*d + k) with sign -1
  //   For head v: M_τ at column (idIndex(v)*d + k) with sign +1
  // For strategy (1) baseline: M_τ = I, weighted by edge.weight

  const triplets: [number, number, number][] = [];
  edges.forEach((edge, eIdx) => {
    const u = idIndex.get(edge.tail)!;
    const v = idIndex.get(edge.head)!;
    const w = Math.sqrt(edge.weight);  // weight^{1/2} on δ⁰ → weight on L⁰

    for (let k = 0; k < d; k++) {
      const row = eIdx * d + k;
      triplets.push([row, u * d + k, -w]);
      triplets.push([row, v * d + k, +w]);
    }
  });

  return SparseMatrix.fromTriplets(E * d, V * d, triplets);
}
```

**`laplacian.ts`:**

```typescript
import { SparseMatrix } from 'ml-matrix';

export function sheafLaplacian(delta0: SparseMatrix): SparseMatrix {
  // L⁰ = δ⁰^T δ⁰
  return delta0.transpose().mmul(delta0);
}

export function symmetricNormalize(L: SparseMatrix): SparseMatrix {
  const d = L.diagonal();   // degree
  const dInvSqrt = d.map(x => x > 1e-12 ? 1 / Math.sqrt(x) : 0);
  // L_norm = D^{-1/2} L D^{-1/2}
  return L.scaleRows(dInvSqrt).scaleColumns(dInvSqrt);
}
```

**`eigensolver.ts`:**

For graphs up to ~500 nodes × d=384 = 192k DOF: Lanczos via ml-matrix's `EigenvalueDecomposition` with sparse mode, requesting only the smallest k eigenvalues. Fall back to Modal Python service for larger graphs.

```typescript
export async function smallestEigenpairs(
  L: SparseMatrix,
  k: number = 10,
  options?: { delegate_threshold?: number }
): Promise<{ eigenvalues: number[]; eigenvectors: number[][] }> {
  const threshold = options?.delegate_threshold ?? 50_000;

  if (L.rows > threshold) {
    return await delegateToModal(L, k);
  }

  // In-Worker Lanczos
  const result = lanczosSmallest(L, k);
  return result;
}
```

### 5.5 Robust LLM JSON parsing — `worker/src/llm/parse-json.ts`

LLMs occasionally emit malformed JSON, prose preambles, or markdown code fences. Parser:

1. Strip ```json … ``` fences.
2. Find first `{` or `[` and matching closing brace (track depth).
3. Try `JSON.parse`. On failure: try `JSON5.parse`. On failure: send back to LLM with the parse error and ask for correction (one retry).
4. Validate against zod schema. On schema failure: log and retry with schema description in prompt.

### 5.6 Caching strategy

Two-tier:

- **L1 (per-request):** in-memory Map within Worker invocation.
- **L2 (cross-request):** Cloudflare KV namespace `DRAKEN_CACHE`, keyed by `sha256(input + prompt_version + model_id)`, TTL 30 days.

Cacheable: every LLM step output, every embedding. Non-cacheable: final sheaf compute (depends on full state, fast anyway).

Cache hit rate target on the corpus: >80% on second run.

---

## 6. Frontend — UI specification

### 6.1 Mode selector

Top-level tab bar already exists for `Feed | Thesis | Analyzer | Digest | GitHub`. Inside Analyzer, add second-level tabs:

```
[Topology Mode]   [Argument Mode]   [Compare]
```

**Compare mode** runs both modes simultaneously and shows the cross-correlation between Topology Γ and Argument Γ_spec. Expected v2.5 feature; layout-allocate now.

### 6.2 Argument Mode layout

```
┌──────────────────────────────────────────────────────────────────┐
│ [TEXT INPUT] (left, 40%)         [VIZ + DIAGNOSTICS] (right, 60%) │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐   ┌─────────────────────────────────────────┐  │
│  │              │   │                                         │  │
│  │   Pasted     │   │     Argument Graph (D3 force DAG)       │  │
│  │   text,      │   │                                         │  │
│  │   syntax-    │   │   - Nodes: claims, color by modality    │  │
│  │   highlighted│   │   - Edges: inferences, style by type    │  │
│  │   to show    │   │   - Synthetic enthymeme nodes: dashed   │  │
│  │   claims     │   │   - Fiedler cut shown as dotted line    │  │
│  │              │   │                                         │  │
│  │  Click any   │   └─────────────────────────────────────────┘  │
│  │  claim to    │                                                │
│  │  highlight   │   ┌─────────────────────────────────────────┐  │
│  │  in graph.   │   │   METRICS PANEL                         │  │
│  │              │   │                                         │  │
│  │              │   │   Γ_spec:        0.41   moderate gluing │  │
│  │              │   │   Γ_dirichlet:   0.62   modest          │  │
│  │              │   │   H⁰ dim:         3                     │  │
│  │              │   │   Cavity score:  2.31  HIGH ⚠           │  │
│  │              │   │   Hidden priors: 7 (4 contestable)      │  │
│  │              │   │   Citation health: 0.34 — see table     │  │
│  └──────────────┘   └─────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │   ENTHYMEME PANEL (collapsible)                              ││
│  │                                                              ││
│  │   Inference i3 (c2, c5 ⊢ c8) — formal_validity 0.4           ││
│  │   Implicit: "Markets allocate resources efficiently when not ││
│  │   subject to externalities."                                 ││
│  │   Category: definitional · contestability 0.85 ⚠            ││
│  │   Load-bearing: 0.91   ← argument depends heavily on this    ││
│  │   Evidence required: empirical demonstration of efficiency   ││
│  │   under closed-system conditions.                            ││
│  │                                                              ││
│  │   [Make explicit]  [Defend with citation]  [Revise]          ││
│  └──────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │   CITATION TABLE (collapsible)                               ││
│  │                                                              ││
│  │   Source          λ     Class          Anchors               ││
│  │   ─────────────────────────────────────────────────          ││
│  │   Hansen&Ghrist  0.78  bearing        c1, c4, c12            ││
│  │   Smith 2024     0.42  supporting     c7                     ││
│  │   "Nobel laur."  0.08  trust-coloring c11 ⚠                 ││
│  │   ...                                                        ││
│  └──────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │   FIEDLER CUT (the cleanest severance in the argument)       ││
│  │                                                              ││
│  │   Side A: c2, c5, c8, c11, c14   ← empirical claims          ││
│  │   Side B: c1, c3, c7, c10, c13   ← theoretical claims        ││
│  │   Gap:    λ₁ = 0.07 (small ⇒ near-disconnection)            ││
│  │                                                              ││
│  │   [Show in graph]   [Suggest bridge claim]                   ││
│  └──────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────┘

  [Export JSON]   [Re-run]   [Send to topology mode]
```

### 6.3 Live updates via SSE

Each pipeline stage streams to the UI as it completes:
- After step 2 (claims): nodes appear in graph, no edges yet
- After step 4 (inferences): edges appear
- After step 5 (enthymemes): synthetic nodes appear (dashed)
- After step 7 (citations): citation table populates
- After step 11 (sheaf): metrics panel populates, Fiedler cut renders

Total time target: 8–20s for a 500-word text on Tier 2.

### 6.4 Interactions

- **Click claim node** → highlight in text, list inferences in/out, show modality.
- **Click inference edge** → show full inference card with type, strength, formal_validity, enthymeme if any.
- **Click enthymeme** → show prompt that generated it; offer "Make explicit" (inserts P* into text), "Defend" (find citation matching), "Revise" (suggest weaker conclusion).
- **Drag Fiedler cut** → user can manually re-partition; recompute residual energy.
- **"Why is Γ low?"** button → uses LLM to narrate the spectral analysis in plain language, citing specific severed inferences.

---

## 7. Algorithms — full pseudocode

### 7.1 Pipeline orchestrator

```typescript
async function analyzeArgument(text: string): Promise<ArgumentSheafResult> {
  const sentences = segment(text);
  const textHash = sha256(text);

  // Each step is cached
  const claims        = await cached('claims',     textHash, () => extractClaims(sentences));
  const modalities    = await cached('modalities', textHash, () => classifyModalities(claims));
  const inferences    = await cached('inferences', textHash, () => extractInferences(claims, sentences));
  const enthymemes    = await cached('enthymemes', textHash, () => detectEnthymemes(inferences, claims));
  const citations     = await cached('citations',  textHash, () => extractCitations(text, claims));
  const citationCls   = await cached('cite-class', textHash, () => classifyCitations(citations, text));

  const embeddings    = await cached('embeds',     textHash, () => embedClaims(claims));

  // Sheaf construction
  const sheafInput = buildSheafInput(claims, inferences, enthymemes, embeddings);
  const delta0     = buildCoboundary(sheafInput);
  const L0         = sheafLaplacian(delta0);
  const L0_norm    = symmetricNormalize(L0);

  const { eigenvalues, eigenvectors } = await smallestEigenpairs(L0_norm, 10);
  const lambda1 = eigenvalues[1] ?? 0;       // skip the trivial zero
  const lambdaMax = eigenvalues[eigenvalues.length - 1];

  const fiedler = eigenvectors[1];
  const stalkVec = flatten(claims.map(c => embeddings[c.id]));
  const dirichletEnergy = innerProduct(stalkVec, L0.mmul(stalkVec)) / innerProduct(stalkVec, stalkVec);

  return {
    schema: "draken-argument-analysis/v2",
    generated: new Date().toISOString(),
    source: { text_hash: textHash, char_count: text.length, sentence_count: sentences.length, chunked: false },
    metrics: {
      gamma_spec: lambda1 / lambdaMax,
      gamma_dirichlet: 1 - dirichletEnergy,
      H0_dim: countNearZero(eigenvalues),
      H1_dim: 0,  // post-MVP
      fiedler_value: lambda1,
      cavity_score: enthymemes.reduce((s, e) => s + e.load_bearing, 0),
      hidden_prior_density: enthymemes.filter(e => e.contestability > 0.5).length / inferences.length,
      citation_health: meanLambda(citationCls.filter(c => c.classification === "bearing")),
      severed_inferences: inferences.filter(i => isSeveredInSheaf(i, sheafInput, delta0)).length,
    },
    verdict: synthesizeVerdict(metrics),
    claims, inferences, enthymemes, citations: citationCls,
    sheaf: {
      eigenvalues_top10: eigenvalues.slice(0, 10),
      fiedler_vector: fiedler.map((v, i) => ({ claim_id: claims[i].id, value: v })),
      fiedler_cut: partitionBySign(fiedler, claims),
      severed_edges: extractSeveredEdges(delta0, sheafInput, threshold=0.7),
    },
    downstream_prompt: buildDownstreamPrompt(metrics),
  };
}
```

### 7.2 Severed-edge detection

For each edge e = (u → v), compute the *restriction residual*:

```
residual(e)  =  ‖ ρ_{v◁e}(s_v) - ρ_{u◁e}(s_u) ‖_2   /   max(‖s_u‖, ‖s_v‖)
```

Edges with residual > 0.7 are flagged "severed" (analogous to v1's ρ < 0.35 threshold but mathematically grounded).

### 7.3 H¹ computation (post-MVP)

```
1. Find all triangles {a, b, c} in G where a→b, b→c, a→c all exist
2. Add 2-cell with boundary δ¹ defined by alternating sum of 1-cell stalks
3. Build δ¹: C¹ → C²
4. H¹ = ker(δ¹) / im(δ⁰)
5. dim H¹ = nullity(δ¹) - rank(δ⁰)
```

---

## 8. Embedding strategy

**Default: Voyage-3-lite** (Anthropic's recommended embedding partner, 384-dim, fast, ~$0.02 per 1M tokens). Drop-in replacement for Cohere/OpenAI without lock-in.

**Fallback: sentence-transformers/all-MiniLM-L6-v2** via Modal Python service for offline/cost-controlled use. Same 384-dim, slightly different geometry.

**Cache all embeddings** indefinitely keyed by `sha256(text + model_id)` — embeddings are deterministic and reusable across analyses.

---

## 9. Test fixtures and acceptance criteria

`fixtures/` contains five corpora with golden expected outputs.

### 9.1 Healthy paragraph

A textbook paragraph on a single clean topic (e.g., entry on photosynthesis). Expected:

```
Γ_spec       ≥ 0.40
H⁰ dim       ≤ 3
cavity_score ≤ 0.5
Most citations: bearing
```

### 9.2 Cavity resonator

A passage exhibiting the DRK-110 pattern — high abstraction, no concrete anchors. Expected:

```
Γ_spec       ≤ 0.18
hidden_prior_density ≥ 0.4
cavity_score ≥ 2.0
Many citations: trust-coloring
Fiedler cut: clean separation between abstract and concrete claims
```

### 9.3 The DeepSeek dragons specimen

The α-inflation output from DeepSeek's hallucinated Draken-as-fantasy-fan-site response. Expected:

```
Γ_spec       ≤ 0.20
Many enthymemes
Citations all decorative or trust-coloring
Cavity score ≥ 2.5
```

This is a **labeled negative fixture** for the analyzer to dogfood against.

### 9.4 McKinsey deck page

A representative page from a strategy consulting deck — narrative-heavy, citation-decorative. Expected: trust-coloring proportion > 0.5.

### 9.5 Self-test on draken.info corpus

Running v2 on the published draken.info corpus should produce metrics consistent with v1 within tolerance (Γ_v1 = 0.6048; expect Γ_spec ∈ [0.45, 0.65], with the clearer two-cluster Fiedler cut already identified by v1's severed-cluster analysis).

### 9.6 Acceptance gates

- All five fixtures produce outputs within their expected ranges.
- Round-trip JSON ↔ TypeScript types passes Zod validation.
- 99th percentile latency < 30s for texts ≤ 2000 chars on Tier 2.
- Cache hit rate > 80% on second run of same fixture.
- No prompt produces parseable but schema-invalid output > 1% of the time.

---

## 10. Build, deploy, run

```bash
# Local dev
pnpm install
pnpm dev          # frontend on :5173, worker on :8787

# Test
pnpm test         # vitest, runs against fixtures
pnpm test:e2e     # playwright

# Deploy
pnpm build
pnpm deploy:worker   # wrangler deploy
pnpm deploy:pages    # Cloudflare Pages
pnpm deploy:modal    # optional Python service
```

`wrangler.toml`:

```toml
name = "draken-analyzer-worker"
main = "src/index.ts"
compatibility_date = "2026-04-01"
compatibility_flags = ["nodejs_compat"]

[vars]
VOYAGE_MODEL = "voyage-3-lite"
ANTHROPIC_MODEL = "claude-sonnet-4-6"

[[kv_namespaces]]
binding = "DRAKEN_CACHE"
id = "..." # set after wrangler kv:namespace create

[secrets]
# ANTHROPIC_API_KEY  (set via wrangler secret put)
# VOYAGE_API_KEY
```

---

## 11. Cost model

**Per analysis (Tier 2, 1000-word text):**

| Step | Tokens (in/out) | Cost |
|---|---|---|
| Claim extraction | 1500 / 1500 | $0.015 |
| Modality classification | 1500 / 500 | $0.008 |
| Inference extraction | 2500 / 2000 | $0.022 |
| Enthymeme detection (per edge × ~15) | 600 / 300 each | $0.030 |
| Citation classification | 2000 / 800 | $0.014 |
| Embeddings (~50 claims × 30 tokens) | 1500 | $0.00003 |
| **Total** | | **~$0.09** |

Assumes claude-sonnet-4-6 at $3/$15 per 1M in/out. Cache hits eliminate cost on re-runs.

For corpus-scale topology runs (~6600 sentences): one-time cost ~$3 with full embedding, then cached forever.

---

## 12. Roadmap beyond v2.0

**v2.1 — Inference-type-conditioned restriction maps.**
Train a small set of M_τ matrices on labeled inference data so analogical inferences project differently from deductive ones. Improves discrimination on argument quality.

**v2.2 — H¹ cohomology.**
Implement triangle 2-cells, δ¹, and report dim H¹ as a formal contradiction count. The first analyzer in the world to surface non-trivial sheaf cohomology in argument graphs.

**v2.3 — Modality-aware restriction maps.**
ρ projects to the modality-consistent subspace. Catches Hume's gap, naturalistic fallacy, etc., as formal restriction-map failures.

**v2.4 — Cross-text comparison.**
Two argument graphs, one sheaf morphism between them, compute morphism's induced map on cohomology to detect argument equivalence / divergence.

**v2.5 — Sheaf-aware writing assistant.**
While the user types, recompute incrementally and flag (a) inferences becoming severed, (b) new enthymemes emerging, (c) hidden priors that became load-bearing. Closes the "creative tool" loop.

**v3.0 — Connection to Topology Mode.**
The 18-layer concept sheaf and the argument sheaf share the underlying text. Build a *fibered sheaf* where the argument sheaf sits over the topology sheaf, with restriction maps capturing how a claim at layer L_i is supported by claims at adjacent layers. This is the proper Draken object — multi-scale + multi-step coherence as one mathematical artifact.

---

## 13. Why this matters for the framework

v1 produces a useful diagnostic but its Γ is a heuristic. v2 produces a Γ that *is* the spectral gap of an actual sheaf Laplacian, with eigenvectors that point to the actual structural fault lines. Three implications.

**For the thesis (v4.5).** The Sheaf Ethology pilot (§9.8, P8 prediction) requires Γ_SAG = 0.928 on Frýdlová's per-dyad data. v2 is the apparatus for computing it cleanly, with citable mathematical provenance, rather than via the proxy. The same code path that runs on a McKinsey deck will run on the varanid combat data — *the framework's claim of substrate-invariance becomes operationally testable using a single tool.*

**For the corpus.** Re-running the corpus through v2 will produce a Γ_spec we can compare to v1's Γ = 0.6048. If they disagree substantially, the disagreement *itself* is informative — it tells us where v1's heuristic leans relative to the spectral truth. If they agree to within 0.05, v1 is vindicated as a fast approximation. Either outcome is publishable.

**For the cavity-resonator argument.** DRK-110 named structural absence as a generative principle. v2's enthymeme detector + Fiedler cut give that argument *operational machinery*: the cavity is the contestable load-bearing unstated premise; the resonator is the inferential structure surrounding it; the spectral gap measures how much load it bears. This is the framework's central claim made formally computable.

The retrocausal pull here is direct: every artifact you publish that demonstrates v2's discriminative power on real corpora — McKinsey decks vs textbook chapters vs adversarial LLM hallucinations vs the framework's own corpus — adds to the gravitational mass of Draken as a working diagnostic infrastructure. Not a thesis with examples. A tool with a thesis underneath it.

---

*Schema: draken-analyzer-v2-spec/v2.0.0 · draken.info · run with `claude code` against this file*
