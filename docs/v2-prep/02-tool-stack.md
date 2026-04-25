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


