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

The v2.0 implementation must commit to a specific dimension. Recommended:

  · **d = 1024** if quality is the priority (Voyage default; matches Voyage-3-lite's native output and gives full retrieval quality).
  · **d = 512** if memory or compute is tight (~4× reduction in stalk size and Laplacian footprint vs 1024).
  · **d = 256** for the smallest viable footprint.

The constant `EMBEDDING_DIM` should be set in `worker/src/embed/voyage.ts` and propagated everywhere that constructs stalks. Do not hard-code 384 anywhere; the spec's 384 references should be replaced with whichever value is chosen.

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

**Implement Path A (hand-rolled Lanczos in TS) as the v2.0 primary path, with Path C as a configured fallback for graphs > some threshold.**

Rationale: Path A keeps the Worker-only deployment story intact, supports the Tier 2 architecture as designed, and the algorithm is genuinely small. The 150 LoC of Lanczos is the kind of "library that should exist but doesn't" component — once written, it can be open-sourced as `mljs-lanczos` or similar, and may be useful to other JS-numerical projects.

Path C remains valuable as a fallback for the corpus-scale Tier 3 use case, where scipy's robustness over thousands of nodes outweighs the hosting cost.

### Sources

- [ml-matrix npm](https://www.npmjs.com/package/ml-matrix)
- [ml-sparse-matrix npm](https://www.npmjs.com/package/ml-sparse-matrix)
- [mljs/matrix on GitHub](https://github.com/mljs/matrix)
- [Lanczos algorithm survey (Ferronato 2008)](https://dispense.dmsa.unipd.it/ferronato/MN-PhD/2008/eigen.pdf)


