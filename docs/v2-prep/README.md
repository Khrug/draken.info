# Draken Analyzer v2 — Preparation Materials

**Status:** preparation only · not yet under implementation
**Owner:** Khrug + Claude (Opus 4.7)
**Created:** 2026-04-25
**Spec source-of-truth:** `spec-archive/draken-analyzer-v2-spec.md` and `spec-archive/PROMPT_VERSIONING.md`

---

## What this directory contains

The user has decided to build v2 of the Sheaf Analyzer (current v1 lives at `/sheaf-analyzer/`, served from `static/pages/sheaf-analyzer.html`). v2 replaces the keyword-heuristic Γ proxy with a real cellular-sheaf Laplacian computed over LLM embeddings, and adds a second analytical surface — Argument Mode — that extracts claims, inferences, enthymemes, and citation load from text.

**Implementation has not started.** The user explicitly asked that this directory be a *prepared fact base*: research done, math grounded, tool facts verified, Draken theory mapped to the spec's vocabulary, and pre-implementation decision points documented. Any future Claude Code session — including a fresh one with no prior context — should be able to read this directory and pick up cold.

## Files

```
docs/v2-prep/
├── README.md                          ← this file
├── 01-sheaf-math.md                   ← cellular sheaves, Laplacian, Hodge cohomology
├── 02-tool-stack.md                   ← verified facts on each dependency, with
│                                        spec discrepancies flagged
├── 03-draken-theory.md                ← Draken vocabulary aligned to v2 spec terms
├── 04-impl-readiness.md               ← open questions + pre-impl checklist
└── spec-archive/
    ├── draken-analyzer-v2-spec.md     ← original v2.0.0-spec, archived
    └── PROMPT_VERSIONING.md           ← original prompt-versioning doc, archived
```

## How to use this when starting v2

1. **First:** read `spec-archive/draken-analyzer-v2-spec.md` end-to-end. The spec is the source of truth for what we are building.
2. **Then:** read this README and `04-impl-readiness.md`. The latter lists every question that should be resolved before code is written, and the order of work that minimizes rework.
3. **As reference during implementation:**
   - `01-sheaf-math.md` — when implementing `worker/src/sheaf/`. Contains rigorous definitions, the discrete-case constructions, and reduction-to-graph-Laplacian sanity checks.
   - `02-tool-stack.md` — when picking dependencies or hitting confusion about what a library does or doesn't support. **Flags two factual errors in the spec** (Voyage dimension, ml-matrix Lanczos availability) that must be addressed before they cause integration failures.
   - `03-draken-theory.md` — when writing prompts, error messages, the verdict generator, or any user-visible text. Ensures the v2 vocabulary stays consistent with the corpus's existing terminology (Γ, Ψ, K(t), cavity, restriction map, etc.).

## Critical findings — read before reading anything else

Three things the spec gets wrong or under-specifies. The implementer should know these on day one, not discover them on day three.

### 1. Voyage-3-lite does not support 384-dim embeddings

The spec (§2.1, §8) says `d = 384 for Voyage-3-lite`. **This is incorrect.** Voyage-3-lite supports 1024 (default), 512, and 256. The 384-dim figure comes from `sentence-transformers/all-MiniLM-L6-v2`, which the spec mentions only as the offline fallback.

**Implication:** either set `d = 512` (closest Voyage option) or `d = 1024` (Voyage default). 1024 is preferable for quality but quadratically increases stalk-dimension memory and Laplacian size. Pick one and commit; do not let `d` be ambiguous.

See `02-tool-stack.md` §1 for full details.

### 2. ml-matrix has no Lanczos sparse iterative eigensolver

The spec (§5.4) says `Lanczos via ml-matrix's EigenvalueDecomposition with sparse mode`. **This is also incorrect.** `ml-matrix` provides general-purpose dense `EigenvalueDecomposition` and has a sister `ml-sparse-matrix` package, but there is no Lanczos implementation in either. Sparse iterative methods do not ship with the mljs ecosystem.

**Implication:** for the in-Worker tier (Tier 2, graphs ≤ 500 nodes), the implementer must either:
(a) lower the threshold and use full dense EVD (memory-bounded by the 128 MB Worker limit; a 500-node × 1024-d Laplacian is 4 × (500 × 1024)² = 1 TB dense — infeasible);
(b) implement Lanczos by hand in TypeScript (well-documented, ~150 LoC for the symmetric case);
(c) delegate eigensolves to the Modal Python service immediately, treating Tier 2 as LLM-extraction only and Tier 3 as required-not-optional.

See `02-tool-stack.md` §2 and `04-impl-readiness.md` §1 for the decision matrix.

### 3. The spec's `H¹` triangle construction is one of several options

The spec (§2.5) says "2-cells arise naturally from inference triangles." This is one possible discrete-cohomology construction but not the canonical one for argument graphs — alternative formulations (e.g. flag complex closure, or 2-cells defined by *premise sets* rather than triangles) yield different `H¹` values.

This is post-MVP per the spec, so not blocking, but `01-sheaf-math.md` §6 enumerates the three plausible constructions so the choice is made deliberately rather than by implementation accident.

## The spec is good

These corrections are surface flaws on a substantively well-thought-through document. The math is right where it is asserted, the architecture is appropriate to the deployment target, the prompt versioning discipline is sound, the cost model is realistic. Implementation should follow the spec as written, with the three issues above flagged at the implementer's first touch and resolved by the decisions logged in `04-impl-readiness.md`.

## When the user is ready to start

A fresh Claude Code session should:

1. Run `git log --oneline | head -20` in the repo to see the most recent context.
2. `cat docs/v2-prep/README.md docs/v2-prep/04-impl-readiness.md` (this file + the readiness checklist) before reading the spec.
3. Confirm with the user which decisions on the open questions have been made.
4. Branch off `main`: `git checkout -b claude/analyzer-v2-implementation`.
5. Begin from §1 of `04-impl-readiness.md` — the work order is sequenced for minimum rework.

The current Sheaf Analyzer v1 should remain live and untouched throughout v2 development. v2 is additive (`/sheaf-analyzer-v2/` or behind a mode toggle), not a replacement, until parity with v1 + new features is demonstrated against the regression fixtures specified in `PROMPT_VERSIONING.md` §6.

---

*This directory is part of draken.info. CC BY-SA 4.0.*
