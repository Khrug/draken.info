# v2 Calibration Fixtures

**Purpose:** five locked test corpora that gate the analyzer's behavior. The analyzer is correct insofar as it produces the predicted reading on each. Calibration drift is detected by re-running these and comparing against `expected/*.expected.v{prompt-version}.json`.

## Two discipline rules — read before editing anything

### Rule 1 — Ranges with tolerance, never rigid values

The expected outputs in `expected/` are **not** point predictions. They are intervals plus tolerance fields, per `PROMPT_VERSIONING.md` §6.2:

| Field type | Tolerance |
|---|---|
| Enums (modality, classification, type) | exact match |
| IDs, structural fields | exact match |
| Confidence, contestability, load_bearing | ±0.15 |
| λ values | ±0.10 |
| Counts (claims, inferences) | ±20% |
| Free-text fields (text, reasoning) | semantic similarity ≥ 0.8 via embedding |

The only **hard-locked** comparisons are:
- Classification category distributions (bearing/supporting/decorative/trust-coloring proportions)
- The `result` enum field in enthymeme detection (`enthymeme` / `no_enthymeme` / `gap_too_wide`)
- Modality enums on each claim
- Pseudo-citation bucket assignment

Everything numeric is band-tested. Everything text is semantic-similarity-tested. This prevents fixture spurious failures from normal LLM stochasticity.

### Rule 2 — Never bump fixture and prompt in the same commit

If a future prompt revision (say `detect_enthymeme` v1.4.0) starts producing lower contestability on the cavity-resonator's load-bearing bridges, **the prompt has drifted, not the fixture**. The diagnostic discipline is:

1. Investigate which way the drift goes.
2. Either: (a) revert/fix the prompt — if the new prompt has lost discriminative capacity, restore it. Or (b) accept the drift as an improvement — only if the new behavior is *better* on calibration grounds, then update the fixture's `*.expected.v{new-version}.json` and KEEP the old `.v{old-version}.json` as a historical record.
3. Never do both in the same commit. The audit trail must be able to answer: "did the prompt change, or did the fixture change?" with a clean diff.

This is what makes the analyzer auditable across prompt-version generations rather than silently drifting.

## The five fixtures

| File | Type | Purpose |
|---|---|---|
| `deepseek-dragons.txt` | hallucination | α-inflation, hallucinated citations, pseudo-mathematical authority |
| `healthy-paragraph.txt` | gold standard | honest scientific prose with real citations doing real work |
| `cavity-resonator.txt` | adversarial | management-prose with abstract scaffolding, no substrate |
| `mckinsey-deck-page.txt` | adversarial | strategy-deck with high authority-density, low specificity |
| `draken-corpus-baseline.json` | benchmark | v1's output on full corpus; v2 Γ_spec must fall in [0.45, 0.65] |

Each text fixture has a corresponding `expected/*.expected.v1.0.0.json` documenting the predicted analyzer behavior with the contestability range, λ range, classification distribution, and — critically — the *specific* hidden priors / bridges / pseudo-citations the fixture is testing for. If a future analyzer run produces only two of four documented contestable bridges on cavity-resonator, the analyzer has retreated toward the safely-vague and needs recalibration back.

## When to add a sixth fixture

The five span: hallucination, honest-science, abstract-scaffold, decorative-citation, and corpus-baseline. The next dimensions worth adding are:

- **Multilingual fixture**: a Swedish-language paragraph (e.g., a Drakens Ordlista excerpt) testing that v2's embedding-based layer tagging holds up across language. Defer to v2.1.
- **Argumentative philosophy fixture**: a passage with deductive chains (no enthymemes), distinct from healthy-paragraph's mostly-causal structure. Defer if the existing five span enough.
- **Adversarial enthymeme fixture**: text with deliberately *correct* logical chains presented in propaganda-style rhetoric. Tests whether the analyzer can separate form from content. Defer to v2.1.

Do not add a sixth before v2.0 ships unless calibration fails on a reproducible new failure mode.
