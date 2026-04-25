# 04 — Implementation Readiness

**Purpose:** the work plan and decision-points that should be resolved before code is written. A future Claude Code session can read this top-to-bottom and know exactly what to ask the user before starting v2.

## 1. Open decisions — must be resolved before implementation

These are the questions a future session should ask the user *first*. None are blockers technically, but each branches the implementation in ways that are expensive to undo.

### D-1. Embedding dimension

The spec's claim of "d=384 for Voyage-3-lite" is wrong (see `02-tool-stack.md` §1). Pick one:

- **(a) d = 1024**: Voyage default. Highest quality. Stalk + Laplacian footprint ~16× larger than 256.
- **(b) d = 512**: Middle ground. ~4× larger than 256.
- **(c) d = 256**: Cheapest. Smallest footprint. Some retrieval-quality loss.

Recommendation: **(a) d = 1024** for the public Tier 2 deployment. Lower it only if Worker memory budget is breached at scale.

### D-2. Eigensolver path

The spec's claim of "Lanczos via ml-matrix" is wrong (see `02-tool-stack.md` §2). Pick one:

- **(a) Hand-rolled Lanczos in TS**: ~150 LoC, zero dep, runs in Worker. Recommended for v2.0.
- **(b) Always delegate to Modal**: simpler code, adds a deployment target. Recommended only if hand-rolled Lanczos has integration problems.
- **(c) Hybrid**: hand-rolled Lanczos for ≤500-node graphs, Modal for larger. Recommended for v2.1 once Lanczos is shipped.

Recommendation: **(a) for v2.0**, with Modal stub stood up but not wired in until v2.1.

### D-3. Restriction-map strategy

Spec offers three (§2.1):

- **(1) Identity (M_τ = I)**: baseline; reduces to weighted graph Laplacian.
- **(2) Type-conditioned projections**: learned per inference type.
- **(3) Modality-aware**: projects to modality-consistent subspace; catches Hume's gap.

Spec ships v2.0 with **(1)**. Recommend confirming this on day 1 and shelving (2)-(3) until v2.1+.

### D-4. H¹ construction

Three plausible (see `01-sheaf-math.md` §7):

- **Option A**: triangle 2-cells. Spec default. Sanity-checkable.
- **Option B**: flag/clique complex closure. Standard TDA construction.
- **Option C**: premise-set 2-cells. Native to argument graphs but non-standard.

Recommendation: **Option A for v2.0 MVP**, mentioned as deferred ("post-MVP" per spec). Track Option C as the v2.x goal.

### D-5. Tier 1 v1 backward compatibility

The current `/sheaf-analyzer/` v1 is live and well-used. Two options:

- **(a) Keep v1 untouched, add v2 at `/sheaf-analyzer-v2/`**: parallel deployment. Recommended.
- **(b) Replace v1 with v2 + a "classic mode" toggle**: cleaner URL but risks regressing v1 use cases.

Recommendation: **(a)**. Keep v1 alive. Cross-link from v2 to v1 ("classic v1 mode is at `/sheaf-analyzer/`"). Only retire v1 once v2 has demonstrated parity on the calibration fixtures *plus* run on the corpus *plus* received user vetting.

### D-6. Cost ceiling and rate-limiting

The spec's cost model (§11) implies ~$0.09 per first-run analysis. At a few hundred runs per month this is fine; at thousands it becomes meaningful.

- Should v2 require an API key from the user (BYO Anthropic + Voyage)?
- Or run on Khrug's API keys with rate-limiting?
- Or hybrid (free tier with Khrug's keys, paid tier with BYO)?

Recommendation: **start with BYO** (user pastes their own API keys, stored in browser localStorage like the slask GitHub-token pattern). Avoids billing infrastructure on day 1 and frees the user from Cloudflare cost decisions. Revisit if community demand requires a hosted free tier.

### D-7. Modality classification — secondary modality

The spec's `classify_modality` schema includes `secondary` (nullable). The downstream sheaf math currently does not use secondary modality — it would require *modality-aware restriction maps* (D-3 strategy 3). Decision: do we collect it now and ignore it, or strip it?

Recommendation: **collect now, ignore in computation**. Future v2.3 will use it. Cheap to keep; expensive to add later if not collected.

### D-8. Streaming UI vs. batch

Spec §6.3 specifies SSE streaming with per-pipeline-stage events. Alternative: just await the full pipeline and render once.

Recommendation: **streaming**. The total time of 8-20s on Tier 2 is too long for spinner-only. Streaming lets the user see claims appear, then inferences, then enthymemes, etc. Worth the implementation cost.

### D-9. Default Argument-Mode chunk size

For texts > ~2000 words, the spec implies chunking but does not specify how. Long texts (a thesis chapter, a long-form essay) need to be split into manageable units before claim extraction.

Recommendation: **paragraph-level chunking with overlap**. Each chunk is up to ~1500 words; chunks overlap by 1 paragraph for cross-chunk inference detection. Claims/inferences are merged across chunks by ID-prefix. Defer to v2.1 if not needed for the launch fixture set.

### D-10. v1 corpus mode in v2

v1 has corpus mode. v2 spec is silent on whether Argument Mode supports corpus-scale analysis.

Recommendation: **Topology Mode in v2 keeps corpus mode** (with embedding-based layer tagging). **Argument Mode does not have corpus mode in v2.0** — it's per-document. Justify: 4500 claims across the corpus would be prohibitively expensive ($0.09 × 22 = $2 per run, every run, no obvious caching benefit), and the inference graph across documents is a separate research problem.


