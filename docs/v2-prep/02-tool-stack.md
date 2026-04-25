# 02 — Tool Stack: Verified Facts and Spec Discrepancies

**Verified:** 2026-04-25 via web research and SDK docs.

This document is the source of truth for what each dependency in the v2 spec *actually* provides. Where it differs from the spec, the difference is flagged at the top of the relevant section.

## 1. Voyage embeddings

⚠ **The spec contains a factual error in §2.1 and §8.** It states "d = 384 for Voyage-3-lite, 1024 for Voyage-3-large." Voyage models do **not** offer 384-dim output. The correct facts:

| Model | Dimensions supported | Default | Cost (per 1M tokens) |
|---|---|---|---|
| voyage-3-lite | 1024, 512, 256 | 1024 | $0.02 |
| voyage-3 | 1024 | 1024 | $0.06 |
| voyage-3-large | 2048, 1024, 512, 256 | 1024 | ~$0.08 |
| voyage-3.5 | 1024, 512, 256 | 1024 | varies |
| voyage-3.5-lite | 1024, 512, 256 | 1024 | $0.02 |

The 384-dim figure in the spec corresponds to **sentence-transformers/all-MiniLM-L6-v2**, mentioned in §8 as the offline fallback via Modal Python.

### Implication

The v2.0 implementation must commit to a specific dimension. **Decision (Khrug, 2026-04-25): voyage-3-lite at d=512 as the Tier 2 default. Reserve d=1024 for Tier 3 corpus runs handled by Modal Python.**

Rationale:
- 512 is the right cost/quality balance for 50–500 claim sheaves. Embedding cost is negligible compared to LLM steps; 512 gives the sheaf Laplacian enough geometric room without making the eigensolver suffer on Worker memory.
- 1024 is preserved for Tier 3 (Modal Python) where the linear-algebra cost is amortized across batched corpus operations and dimensionality is no longer a constraint.
- 256 saves nothing meaningful and costs discriminative power on close-meaning claims. Skipped.

The constant `EMBEDDING_DIM` should be set in `worker/src/embed/voyage.ts` (Tier 2 = 512) and overridden in `compute/embed_service.py` (Tier 3 = 1024). Do not hard-code 384 anywhere.

### API basics

Endpoint: `https://api.voyageai.com/v1/embeddings`
Auth: bearer token via `VOYAGE_API_KEY`
Model parameter: `voyage-3-lite` (or chosen variant).
Output dim parameter: `output_dimension` field in request body.
Rate limits and pricing — consult Voyage docs at deployment time, they update.

### Caching

Voyage embeddings are deterministic for fixed (model, input, output_dimension). Cache them indefinitely keyed by `sha256(text + model + dim)`. Use Cloudflare KV with no TTL (or a long one, e.g. 365 days). Cache hit rate target: > 95% on draken.info corpus re-runs.

### Sources

- [Voyage AI Pricing](https://docs.voyageai.com/docs/pricing)
- [Voyage Embeddings Docs](https://docs.voyageai.com/docs/embeddings)
- [voyage-3-large announcement](https://blog.voyageai.com/2025/01/07/voyage-3-large/)
- [voyage-3.5 announcement (MongoDB)](https://www.mongodb.com/company/blog/product-release-announcements/introducing-voyage-3-5-voyage-3-5-lite-improved-quality-new-retrieval-frontier)

## 2. ml-matrix and Lanczos

⚠ **The spec contains a second factual error in §5.4.** It states "Lanczos via ml-matrix's `EigenvalueDecomposition` with sparse mode." There is no Lanczos implementation in `ml-matrix` or `ml-sparse-matrix`. The mljs ecosystem ships:

  · `ml-matrix` — dense matrix ops, full `EigenvalueDecomposition` (general dense, ≈ O(n³))
  · `ml-sparse-matrix` — sparse storage and basic ops, **no eigensolver**

There is no shipped sparse iterative eigensolver in the JS ecosystem suitable for symmetric Lanczos. This is a *real* gap in the JS numerical-computing stack.

### Three viable paths forward

**Path A — implement Lanczos in TypeScript by hand.**
Symmetric Lanczos for the smallest k eigenvalues is a well-documented algorithm (~150 LoC). The algorithm only needs a function `matvec(x: Vector): Vector` that computes Lx for a sparse L; it does not need access to the full matrix. Implementation outline:

```typescript
function lanczosSmallest(
  matvec: (x: Float64Array) => Float64Array,
  n: number,            // dimension
  k: number,            // requested eigenpairs
  iter: number = 50,    // Lanczos steps; ≥ 3k is conservative
): { values: number[]; vectors: Float64Array[] } {
  // 1. Initialize random orthonormal v_1
  // 2. Three-term recurrence:
  //    w = matvec(v_j) - β_{j-1} v_{j-1}
  //    α_j = ⟨w, v_j⟩
  //    w = w - α_j v_j
  //    Reorthogonalize against v_1 ... v_{j-1} (numerical hygiene)
  //    β_j = ‖w‖
  //    v_{j+1} = w / β_j
  // 3. Build tridiagonal T with α on diagonal, β on off-diagonal
  // 4. Eigendecompose T (small, dense, fast) using ml-matrix
  // 5. Map T's smallest k eigenvalues + eigenvectors back to original space
  //    via Q matrix of v_j's
}
```

  Pros: zero dependency, runs in Cloudflare Worker, fully in JS.
  Cons: ~150 LoC of careful numerical code. Reorthogonalization is the subtle part — without it, eigenvalues collapse together due to floating-point drift. Should ship with regression tests against Hansen-Ghrist published examples.

**Path B — use full dense `EigenvalueDecomposition`, with hard graph-size cap.**
For graphs ≤ 50 nodes × d = 256 = 12 800 DOF, dense EVD via `ml-matrix` is feasible (~10 GB RAM at full O(n²) storage — wait, that doesn't fit). Actually 12 800² = 1.6 × 10⁸ floats × 8 bytes = ~1.3 GB. Still too big for 128 MB Worker limit. **Conclusion: dense EVD is infeasible at almost any useful graph size in a Worker.**

  Pros: zero implementation effort.
  Cons: graph-size cap is so low (~30 nodes × d=64) that it defeats the purpose.

**Path C — always delegate eigensolves to Modal Python (Tier 3 always-on).**
Treat the spec's "optional" Modal service as **required** for v2.0. Worker handles LLM extraction and embeddings; Modal handles all sheaf eigendecomposition.

  Pros: scipy.sparse.linalg.eigsh is battle-tested, no in-house numerics. Faster than hand-Lanczos at scale.
  Cons: introduces a second deployment target, raises hosting cost, adds latency (cross-network call), reduces zero-backend simplicity.

### Recommendation

**Decision (Khrug, 2026-04-25): Path A — hand-roll Lanczos in TypeScript, with one constraint.**

Path A keeps the Worker-only deployment story intact, supports the Tier 2 architecture as designed, and the algorithm is genuinely small. The 150 LoC of Lanczos is the kind of "library that should exist but doesn't" component — once written, it can be open-sourced as `mljs-lanczos` or similar.

#### Required: test-first calibration gate

The Lanczos implementation must be developed test-first. Before any pipeline code uses it, three reference matrices must produce eigenvalues matching scipy's `eigsh` to within **1e-6**:

1. **Path graph Laplacian, n=10**: closed-form λ_k = 2 − 2·cos(k·π/n) for k = 0, 1, …, n−1. Eigenvalues `[0, 0.0979, 0.382, 0.824, 1.382, 2.0, 2.618, 3.176, 3.618, 3.902]` (approximate).
2. **Cycle graph Laplacian, n=8**: closed-form λ_k = 2 − 2·cos(2π·k/n). Eigenvalues `[0, 0.586, 2, 3.414, 4, 3.414, 2, 0.586]` (approximate, with multiplicities).
3. **Random sparse symmetric PSD matrix, n=100, density 0.05**: cross-check against scipy.sparse.linalg.eigsh smallest-10 eigenvalues. Seed fixed for reproducibility.

These tests live at `worker/test/sheaf/lanczos.spec.ts` and are gating: pipeline code may not use the Lanczos implementation until all three pass. The reference values for case (3) are committed alongside as fixtures (Python-generated, JSON-serialized).

Path C (Modal Python delegate) remains valuable as a fallback for corpus-scale Tier 3 work, where scipy's robustness over thousands of nodes outweighs the hosting cost. Wire the delegate path as a stub but don't activate it until v2.1.

### Sources

- [ml-matrix npm](https://www.npmjs.com/package/ml-matrix)
- [ml-sparse-matrix npm](https://www.npmjs.com/package/ml-sparse-matrix)
- [mljs/matrix on GitHub](https://github.com/mljs/matrix)
- [Lanczos algorithm survey (Ferronato 2008)](https://dispense.dmsa.unipd.it/ferronato/MN-PhD/2008/eigen.pdf)

## 3. Cloudflare Workers — limits, KV cache

| Resource | Free | Paid (Workers Standard) |
|---|---|---|
| Memory per isolate | 128 MB | 128 MB (same) |
| CPU time per request | 10 ms | up to **5 minutes** |
| Wall-clock per request | no hard limit (as long as client connected) | no hard limit |
| Subrequest fan-out (HTTPS calls) | 50 | 50 (1000 in some plans) |
| Request body size | 100 MB | 100 MB |
| Bundle size | 3 MB compressed | 10 MB compressed |
| KV writes per second | 1 per key | 1 per key |
| KV value size | 25 MB | 25 MB |

The 128 MB memory cap is the binding constraint for sheaf computation. The 5-minute CPU cap is generous for our workload (a typical analysis is 8-20s; corpus-scale could go a minute).

### KV cache for prompt + embedding caching

Spec §5.6 specifies KV namespace `DRAKEN_CACHE` with TTL 30 days for prompt outputs. Embeddings should have longer TTL (1 year) since they are deterministic.

KV constraints:
  · Eventually consistent globally (within ~60s).
  · 1 write/sec/key (so don't share keys across concurrent requests).
  · Reads are fast and cheap.

For per-claim embedding caching (~50 claims per analysis × 1024-dim = ~200KB JSON): well under the 25 MB value cap. Suitable for KV.

For full-corpus pre-computed embeddings (~4500 concepts × 1024-dim = ~37 MB): **exceeds KV value cap**. Use R2 instead, with KV holding only the R2 object key.

### Wrangler config (per spec §10)

```toml
name = "draken-analyzer-worker"
main = "src/index.ts"
compatibility_date = "2026-04-01"
compatibility_flags = ["nodejs_compat"]

[[kv_namespaces]]
binding = "DRAKEN_CACHE"
id = "..."   # set after `wrangler kv:namespace create DRAKEN_CACHE`

[[r2_buckets]]
binding = "DRAKEN_R2"
bucket_name = "draken-analyzer-cache"

# Secrets (set via wrangler secret put):
# - ANTHROPIC_API_KEY
# - VOYAGE_API_KEY
```

### Sources

- [Cloudflare Workers Limits](https://developers.cloudflare.com/workers/platform/limits/)
- [5-minute CPU changelog (Mar 2025)](https://developers.cloudflare.com/changelog/post/2025-03-25-higher-cpu-limits/)
- [Cloudflare Workers Pricing](https://developers.cloudflare.com/workers/platform/pricing/)

## 4. Anthropic API — prompt caching, model IDs

### Model IDs

The spec uses `claude-sonnet-4-6`. As of April 2026 the most-capable Anthropic models are:
  · `claude-opus-4-7` — top-tier, recommended for `detect_enthymeme` per the spec note.
  · `claude-sonnet-4-6` — primary workhorse for the spec's six prompts.
  · `claude-haiku-4-5-20251001` — faster/cheaper, suitable for citation classification if cost becomes a constraint.

Model IDs change periodically. Pin specific snapshots in code, not in shifting aliases. The cache key includes `model_id`, so swapping models invalidates correctly.

### Prompt caching syntax (verified)

```typescript
const response = await client.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 4096,
  temperature: 0,
  system: [
    {
      type: "text",
      text: SYSTEM_PROMPT_TEXT,
      cache_control: { type: "ephemeral" }
    }
  ],
  messages: [{ role: "user", content: userMessage }]
});
```

Cache scope (per spec, verified):
  · System content cached up to and including the block tagged with `cache_control`.
  · Default cache lifetime: 5 minutes (ephemeral). Extended option: `cache_control: { type: "ephemeral", ttl: "1h" }` — useful if the same system prompt fires across a several-minute analysis with sparse user input.
  · Cache write costs 1.25× input rate (5-min) or 2× (1-hour). Cache read is 0.1× input rate. Net win once 2-3 calls hit the same cached system prompt.

The spec's claim of "~90% cost reduction on cache hits" is approximately correct: cache reads at 0.1× input pricing means a 90% reduction on the cached portion, though the un-cached user message still pays full freight.

### Cost recheck (per spec §11)

Sonnet 4.6 at $3 / $15 per 1M input/output tokens. The spec's per-analysis cost estimate of ~$0.09 (first run) checks out within ~10%. With prompt caching enabled the *cached run* approaches $0.005-0.010 for the LLM portion; embeddings remain ~$0.0001.

### One-call-per-edge cost concern

`detect_enthymeme` fires once per inference (~15 per typical analysis). Without prompt caching that's $0.030. With caching: ~$0.005. The spec's cost model assumes caching is on — make sure the caching `cache_control` flag is actually present in code; it is easy to forget and the spec's economics break without it.

### Sources

- [Anthropic Prompt Caching Docs](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)
- [claude-cookbooks: prompt_caching example](https://github.com/anthropics/anthropic-cookbook/blob/main/misc/prompt_caching.ipynb)
- [Anthropic SDK on npm: @anthropic-ai/sdk](https://www.npmjs.com/package/@anthropic-ai/sdk)

## 5. Modal Python service — when to delegate

The spec scopes Modal as **optional**, used only for graphs > 500 nodes (Tier 3, full-corpus runs). Given the Lanczos-availability finding in §2 above, two refined deployment models:

**Model A (recommended): Lanczos in Worker, Modal for very large graphs.**
  · In-Worker (TS Lanczos): graphs up to ~500 nodes, embedding dim ≤ 512.
  · Delegate to Modal: anything larger, plus full-corpus runs.

**Model B: Modal for all sheaf eigensolves.**
  · Worker handles LLM + embeddings only.
  · Modal handles every sheaf computation, regardless of size.
  · Simplifies code path, but adds ~200ms cross-network latency to every analysis. Probably worth A's complexity for the latency win.

### Modal setup

Modal supports Python services with auto-scaling and pay-per-second billing. Approximately:
  · ~$0.10/hour idle (warm-pool keeping container alive)
  · ~$0.50-2/hour active (depending on CPU/memory)
  · Free tier ~$30/month credit

For draken.info corpus-scale workloads (a handful of full re-analyses per month), expected cost is well under $5/month if scoped narrowly.

### Compute service spec (per spec §5.1, `compute/`)

```python
# compute/sheaf_service.py
import modal
from scipy.sparse import csr_matrix
from scipy.sparse.linalg import eigsh
import numpy as np

app = modal.App("draken-analyzer-v2-compute")

@app.function(image=modal.Image.debian_slim().pip_install(["scipy", "numpy"]))
@modal.web_endpoint(method="POST")
def smallest_eigenpairs(payload: dict):
    triplets = payload["triplets"]   # [[row, col, val], ...]
    n        = payload["n"]
    k        = payload.get("k", 10)
    rows, cols, vals = zip(*triplets)
    L = csr_matrix((vals, (rows, cols)), shape=(n, n))
    eigvals, eigvecs = eigsh(L, k=k+1, which="SM", sigma=0)
    return {
        "eigenvalues": eigvals.tolist(),
        "eigenvectors": eigvecs.T.tolist(),
    }
```

### Sources

- [Modal Documentation](https://modal.com/docs)
- [scipy.sparse.linalg.eigsh](https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.linalg.eigsh.html)

## 6. Frontend stack

| Dep | Version target | Purpose |
|---|---|---|
| `vite` | 5.x | Build tool, dev server |
| `three` | 0.149.x (UMD) or latest ESM | 3D concept-cloud (carried forward from v1) |
| `3d-force-graph` | 1.73.x | Force-directed 3D graph (carried forward from v1) |
| `d3` | 7.x | 2D argument-graph DAG renderer |
| `lit-html` | 3.x (optional) | Lightweight templating; or vanilla |
| `zod` | 3.x | Runtime schema validation, shared with worker |

The v1 vendoring of three.js / 3d-force-graph in `dist/vendor/` is still required and well-justified (see DRK-132 manual; unpkg blocking incident). Reuse the same approach.

D3 is new for v2's argument-graph view. v1 used `3d-force-graph`; for the directed argument DAG, D3 force layout (`d3-force` + `d3-zoom` + custom rendering to canvas/SVG) is the right tool. Don't reuse three.js for the argument graph — it's overkill and the 2D-DAG semantics are clearer in D3.

## 7. Test runner

Spec specifies `vitest` + `playwright`. Both are correct choices.

  · **vitest** for prompt regression (§6.1 of `PROMPT_VERSIONING.md`), sheaf math sanity tests, schema round-trip tests.
  · **playwright** for end-to-end through the UI (smoke tests of full pipeline in browser).

Add **a third dependency: `@stdlib/stats-ttest`** or similar for tolerance comparison in regression fixtures. The spec's tolerance policy (§6.2) requires numerical comparison with bounded error; stdlib has the right primitives.

### Embedding-similarity tolerance for free-text fields

For free-text golden output comparison (`text`, `reasoning`, `evidence_required` etc.), the spec calls for "semantic similarity ≥ 0.8 via embedding." Implementation: cache fixture-expected embeddings in `fixtures/expected-embeddings/`, compute cosine similarity at test time, fail if < 0.8. The same Voyage embeddings used in production make the test cheap (mostly cache hits) and consistent.

