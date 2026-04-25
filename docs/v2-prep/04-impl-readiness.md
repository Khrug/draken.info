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

**Decision (Khrug, 2026-04-25): (a). Keep v1 alive at `/sheaf-analyzer/`. v2 lives at `/sheaf-analyzer-v2/`.** Cross-link in both directions. v2 is additive; never modifies v1 files.

**CI guardrail:** any commit on `claude/analyzer-v2-implementation` that touches files under `frontend/src/topology-mode/` (the refactored v1) is blocked. Forces clean separation, prevents accidental v1 regressions during v2 development. Implement as a `.github/workflows/v2-isolation.yml` step.

### D-6. Cost ceiling and rate-limiting

The spec's cost model (§11) implies ~$0.09 per first-run analysis. At a few hundred runs per month this is fine; at thousands it becomes meaningful.

**Decision (Khrug, 2026-04-25): hybrid free-tier-with-cap + BYOK overflow.**

- A fresh visitor to `/sheaf-analyzer-v2/` defaults to **Tier 1 (offline JS heuristic)** with a one-click upgrade to **Tier 2 (LLM-powered)**. Tier 1 is the public-good path: nothing uploaded, nothing leaves the browser, like v1.
- Tier 2 is opt-in **per analysis** with a cost preview shown before submission.
- Anonymous Tier 2 capped at **5 analyses per IP per day** on Khrug's API keys.
- Beyond the cap: BYOK pattern (Anthropic + Voyage keys stored in browser localStorage, same as the `slask` GitHub-token pattern). Document the keys are stored locally, never sent to Khrug servers.

This makes the tool free to try, free to use lightly, and self-funding for heavy users. Matches the draken.info ethic: framework open, diagnostic public, LLM-powered upgrade is convenience not paywall.

Rate-limit implementation: Cloudflare Workers KV with per-IP daily counter, reset at UTC midnight. ~10 LoC.

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

## 2. Pre-implementation checklist

Things that must exist or be true before code is written.

- [ ] All 10 open decisions in §1 resolved and logged in §6 below.
- [ ] Anthropic API key with budget allocated for v2 development (~$50 initial).
- [ ] Voyage AI account + API key. Free tier (1M tokens/month) sufficient for development; paid tier for production.
- [ ] Cloudflare account with Workers paid plan ($5/month) — needed for the 5-min CPU limit.
- [ ] KV namespace `DRAKEN_CACHE` created via `wrangler kv:namespace create DRAKEN_CACHE`.
- [ ] R2 bucket `draken-analyzer-cache` created (for embedding cache > 25MB).
- [ ] Modal account (free tier) optional, only if D-2 chooses path (b) or (c).
- [ ] Test fixtures collected per spec §9: healthy paragraph, cavity-resonator, DeepSeek-dragons specimen, McKinsey deck page, draken.info corpus baseline. **The DeepSeek dragons fixture in particular needs to be located/recreated** — referenced in spec §9.3 but not yet in the repo. User should provide.
- [ ] `pnpm` installed (spec uses pnpm workspaces).
- [ ] Git branch `claude/analyzer-v2-implementation` created off latest `main`.

## 3. Recommended work order

A future Claude Code session implementing v2 should proceed in this order. Each phase ends with a working deliverable that is independently committable. Sequenced for minimum rework.

### Phase 0 — fixtures FIRST, then scaffolding (1 day)

**Fixture-driven development.** No pipeline code is written until the fixture suite exists with hand-written expected outputs producing failing tests. This prevents the analyzer from being optimized against measures that don't actually discriminate the cases that matter.

1. **Fixtures into `fixtures/` on day 1**:
   - `healthy-paragraph.txt` (textbook chapter, single topic; e.g. photosynthesis paragraph from a biology textbook)
   - `cavity-resonator.txt` (text exhibiting DRK-110 pattern, ~150 words)
   - `deepseek-dragons.txt` ⚠ — text not in this Claude session's history; **Khrug must provide**. Spec §9.3 references this as the α-inflation specimen (DeepSeek's hallucinated Draken-as-fantasy-fan-site response). Source from Khrug's archive.
   - `mckinsey-deck-page.txt` (representative strategy-deck page, narrative-heavy, citation-decorative)
   - `draken-corpus-baseline.json` (snapshot of v1's Γ on full corpus, for v1↔v2 cross-check)

2. **Hand-write expected outputs** under `fixtures/expected/`. Each is a JSON file matching `ArgumentSheafResult` schema with the framework's predicted values:
   - healthy: Γ_spec ≥ 0.40, cavity_score ≤ 0.5, mostly bearing citations.
   - cavity-resonator: Γ_spec ≤ 0.18, hidden_prior_density ≥ 0.4, cavity_score ≥ 2.0.
   - deepseek-dragons: Γ_spec ≤ 0.20, ≥ 80% enthymemes, mostly trust-coloring.
   - mckinsey: ≥ 50% trust-coloring or decorative.

3. **Repo scaffolding** *after* fixtures land:
   - Create `pnpm-workspace.yaml` and directory structure per spec §5.1.
   - Set up `frontend/`, `worker/`, `compute/` (stub), `shared/`, `fixtures/`, `docs/` (move existing v2-prep into here).
   - Add `.gitignore`, `.github/workflows/`.
   - Wire up CI (`pnpm install && pnpm test && pnpm build`) and the v1-isolation guard (D-5).

4. **Failing tests committed**: `tests/fixtures.test.ts` runs each fixture through a stub pipeline that returns zeros. Tests fail. This is the calibration target. Pipeline implementation in subsequent phases makes them pass.

### Phase 1 — math, no LLM (1-2 days)

Goal: a working `worker/src/sheaf/` that passes the three sanity checks in `01-sheaf-math.md` §8. No LLM dependency yet.

1. `coboundary.ts` — sparse triplet construction.
2. `laplacian.ts` — L⁰ from δ⁰, normalized variant.
3. `eigensolver.ts` — hand-rolled Lanczos (D-2 path a) or Modal stub (D-2 path b).
4. Unit tests:
   - Trivial 1-d sheaf on cycle → graph Laplacian eigenvalues.
   - 2-d identity sheaf on path → twice graph Laplacian eigenvalues.
   - Connected sheaf → ker has dimension d.
5. Bench: how big a graph fits in 128MB Worker memory? Record numbers.

**This phase has no external API dependency** — purely numerical. Most likely to surface bugs before they cost LLM tokens.

### Phase 2 — LLM extraction pipeline (3-5 days)

Goal: from text, produce the deep `ArgumentSheafResult` JSON, end-to-end, *without* the sheaf math integrated yet.

1. Drop in `worker/src/llm/prompts.ts` from `PROMPT_VERSIONING.md` §4.
2. Implement `parse-json.ts` per `PROMPT_VERSIONING.md` §2.
3. Implement `anthropic.ts` wrapper with prompt caching.
4. Implement six pipeline steps in `worker/src/pipeline/`.
5. KV cache layer (`worker/src/cache/kv.ts`).
6. Wire into `/api/v2/argument/analyze` endpoint.
7. Test against the three primary fixtures (healthy, cavity, DeepSeek). Verify output schemas validate.

### Phase 3 — sheaf integration (1-2 days)

Goal: the Phase 1 math operates on the Phase 2 output. Full pipeline gives spectral metrics.

1. `worker/src/embed/voyage.ts`.
2. Pipeline orchestrator at `worker/src/routes/argument.ts` per spec §7.1.
3. Wire embeddings → coboundary → Laplacian → eigensolver.
4. Compute Γ_spec, Γ_dirichlet, fiedler_value, fiedler_vector per spec §4.2.
5. End-to-end test on fixtures, verify acceptance gates §9.6.

### Phase 4 — frontend (2-3 days)

Goal: usable UI matching spec §6.

1. Mode tabs + routing.
2. Argument-graph D3 force DAG.
3. Metrics panel.
4. Enthymeme panel + citation table + Fiedler-cut panel.
5. SSE streaming hookup.
6. Export menu (deep JSON / Markdown / minimal) — clone v1's pattern.

### Phase 5 — calibration + launch (1-2 days)

1. Run all five fixtures, compare against goldens, log calibration drift.
2. Run on draken.info corpus, compare Γ_v2 to Γ_v1.
3. Write launch post (next DRK number, likely DRK-133 or DRK-134).
4. Deploy: `pnpm deploy:worker && pnpm deploy:pages`.
5. Update v1 nav to surface v2.

**Total: ~10-15 working days of focused implementation = 3–5 weeks calendar time** for a solo developer working with care, including the calibration cycles that will be needed on the prompts. The first run of `detect_enthymeme` against real text will produce subtly wrong outputs (overly verbose bridges, drift toward "no_enthymeme" on edge cases, etc.); v1.4.0 of that prompt will exist by end of week 2. That is not delay — that is the discipline working. Velocity pressure should not compress the calibration phase.

### Branching strategy refinements

- Branch: `claude/analyzer-v2-implementation` off latest `main`.
- **Rebase weekly against main** rather than merge — keeps the eventual merge clean and the diff readable.
- **CI v1-isolation check**: any commit that modifies `frontend/src/topology-mode/**` is blocked on this branch. Forces a clean separation, prevents accidental v1 regression.
- v2 is additive at `/sheaf-analyzer-v2/` permanently; the v1 path `/sheaf-analyzer/` stays alive until the user explicitly retires it after v2 demonstrates parity + corpus validation + user vetting.

## 4. Acceptance criteria for v2.0 milestone

v2.0 is "shippable" when all of the following are true. Borrowed and consolidated from spec §9.6:

### Numerical fixtures

- [ ] **healthy-paragraph** fixture produces Γ_spec ≥ 0.40, H⁰ dim ≤ 3, cavity_score ≤ 0.5.
- [ ] **cavity-resonator** fixture produces Γ_spec ≤ 0.18, hidden_prior_density ≥ 0.4, cavity_score ≥ 2.0, ≥ 50% of citations classified as trust-coloring or decorative.
- [ ] **DeepSeek-dragons** fixture produces Γ_spec ≤ 0.20, ≥ 80% of inferences classified as enthymemic, with ≥ 4 in gap_too_wide category.
- [ ] **McKinsey-deck-page** fixture produces ≥ 50% trust-coloring or decorative citations.
- [ ] **draken.info corpus** produces Γ_spec ∈ [0.45, 0.65], with the two-cluster Fiedler cut already named in v1's severed-cluster analysis.

### Math sanity

- [ ] Trivial 1-d sheaf on a 4-cycle produces graph-Laplacian eigenvalues {0, 2, 2, 4} to 6 decimals.
- [ ] Identity-restriction d-dim sheaf on connected graph: dim ker(L⁰) = d (within numerical tolerance).
- [ ] Dirichlet energy ⟨s, L⁰s⟩ ≥ 0 for all s, equals zero iff s is a global section.

### Performance

- [ ] 99th percentile latency < 30s for texts ≤ 2000 chars on Tier 2.
- [ ] Cache hit rate > 80% on second run of any fixture.
- [ ] Total memory used per Worker invocation < 100 MB (leaves headroom under 128 MB cap).

### Schema and validation

- [ ] Round-trip JSON ↔ TypeScript types passes Zod validation on all six prompts' outputs.
- [ ] No prompt produces parseable but schema-invalid output > 1% of the time across 50 sampled runs.
- [ ] Deep JSON export validates against `shared/schema/argument-result.schema.json`.

### Process

- [ ] CHANGELOG.md entry for every prompt version bump per `PROMPT_VERSIONING.md` §7.
- [ ] All goldens for fixtures committed under `fixtures/expected/`.
- [ ] Launch post drafted, peer-review prompt run on it (recursive: v2 analyzes the v2 launch post).

## 5. Things to NOT do in v2.0

These are scope-creep traps. Defer to v2.x.

- ❌ **Modality-aware restriction maps** (D-3 strategy 3). Big research task. Defer to v2.3 per spec.
- ❌ **H¹ cohomology fully wired**. The data structures should support it (post-MVP per spec) but the computation and UI are v2.2.
- ❌ **Cross-text comparison (sheaf morphisms)**. v2.4. Tempting but a different mathematical scope.
- ❌ **Live writing-assistant mode** (real-time recompute as user types). v2.5. Requires incremental everything.
- ❌ **Fibered sheaf (Argument over Topology)**. v3.0. Requires both modes to be solid first.
- ❌ **Multilingual lexicons for v1-style keyword tagging**. The embedding-based tagging supersedes this naturally; don't extend the legacy lexicon.
- ❌ **"Why is Γ low?" plain-language LLM narration** of spectral analysis. Tempting; expensive to do well; requires its own prompt + fixtures. Defer to v2.1.
- ❌ **Rewriting v1 in v2's stack**. v1 still works. Keep it. Cross-link.

## 6. Decision log

To be filled by the implementing session as decisions are made. Format:

```
[YYYY-MM-DD] D-N · {decision} · {rationale} · signed: {who}
```

### Logged

```
[2026-04-25] D-1 · voyage-3-lite at d=512 Tier 2; d=1024 reserved Tier 3 · cost/quality balance for 50–500 claim sheaves; geometric room without eigensolver suffering on Worker memory · Khrug
[2026-04-25] D-2 · Hand-rolled Lanczos in TypeScript with test-first gate against scipy.eigsh on three reference matrices (path graph n=10, cycle n=8, random sparse n=100) · single-deploy story preserved; tractable algo; controls convergence tolerance · Khrug
[2026-04-25] D-4 · H¹ Option A (triangle 2-cells) for v2.0; data-driven revisit to Option C if textbook fixture exhibits H¹>0 frequently or cavity-resonator H¹=0 consistently · cleanest interpretation; sanity-checkable; clique over-fills, cycle-space hard to surface · Khrug
[2026-04-25] D-5 · Keep v1 alive at /sheaf-analyzer/; v2 additive at /sheaf-analyzer-v2/; CI block on commits touching topology-mode/** · zero v1 regression risk; user can compare side-by-side · Khrug
[2026-04-25] D-6 · Tier 1 (offline JS) default on first visit; one-click upgrade to Tier 2 with cost preview; 5 anonymous Tier 2 analyses per IP per day on Khrug keys; BYOK overflow · public-good ethic preserved; self-funding for heavy users; no billing infra needed day 1 · Khrug
```

### Pending (D-3, D-7, D-8, D-9, D-10)

Awaiting explicit Khrug confirmation. Default recommendations stand until logged.

Once all 10 are logged, implementation can begin. Until then, this directory is the prep state.

---

*This file is part of the draken.info repository under CC BY-SA 4.0. Located at `docs/v2-prep/04-impl-readiness.md`.*

