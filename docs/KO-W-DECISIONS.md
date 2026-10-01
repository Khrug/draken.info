# KO registry and Watertightness W — decisions (resolved 2026-10-01)

Khrug delegated these decisions to Claude on 2026-10-01 ("solve the questions in the most logical, pragmatic and straightforward way"). Each can be reopened; any change to W's patterns, weights or thresholds is W v2.

## 1. KO registry

- **All 24 entries approved**: every one whose quoted definition verifies verbatim at build. Initial `layers` = the defining post's frontmatter layers; narrow by hand where the term applies more narrowly.
- **Four gaps closed** with sentences found in the corpus: sheaf Laplacian (DRK-145), global section (DRK-145), DRK-131 falsification protocol (DRK-143), keeper-function (DRK-150).
- **Ψ** keeps DRK-105 as defining post (first introduction); the entry's note records that "psychosis metric" is retired and points to DRK-130's "Narrative Self-Reference Ratio".
- **Ordlista (DRK-117)** accepted as defining post for terms it defines in one sentence.
- **Θ (trophic debt)** stays a candidate until a second post uses it (aliases narrowed to Θ(t), \Theta(t), "trophic debt" to avoid matching asymptotic notation).
- **Remaining gap: anti-totalization principle** (35 posts). No one-sentence definition exists in the published corpus (it is defined in the Codex). Close it by stating it in one sentence in the next post that uses it and adding the entry.

## 2. W v1 method (confirmed as built)

1. c₆ uses citation links only (semantic edges connect every post by construction).
2. c₅ counts every post, including those before DRK-131: the corpus is judged as it stands.
3. Per-post W = (c₇³·c₁·c₅·c₆)^(1/6); c₂–c₄ are corpus-level.
4. Components with an empty denominator are n/a and dropped.
5. c₇: [D]/[M]-tagged paragraphs satisfied; internal /posts/ links are not references; figure captions skipped.

## 3. c₇ tuning

Sample marked (docs/w-c7-tuning-sample.md): 14/20 agreed. Fixes: ignore number-word compounds, formula values after →/=/≈, list numbering; accept possessive author-year ("Author's 2008"); DOI and arXiv require an identifier. Patterns frozen, `C7_TUNED = true`, W v1 final.

## 4. Other

- Post pages now label the frontmatter value "Coherence (author-scored)"; it is no longer shown as Γ.
- c₁ leaks (bare DRK-099, 102, 103, 122, 126, 134 in old posts) are accepted: old posts are not rewritten; the leaks stay visible in /data/watertightness.json.
- Next free number: DRK-192 (from /data/drk-index.json).

## Not yet built (from the 2026-09-29 plan)

Phase 4 rule enforcement in the validator, Phase 5 Cloudflare skip-the-bad-post behaviour, Phase 6 new-post/check/publish scripts and desktop shortcut, Phase 7 route tests.
