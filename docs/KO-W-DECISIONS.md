# KO registry and Watertightness W — open decisions for Khrug

Branch `feat/standard-ko-w`, 2026-10-01. Nothing here changes the live site until the branch is merged.

## 1. Approve the KO registry (`static/data/ko.json`)

20 entries, all `proposed`. Each definition is quoted verbatim from its defining post; the build refuses to treat an entry as defined if the quote no longer matches. For each entry: set `status: "approved"`, fill `layers`, check the relations. Review the rendered list at `/ko/` after a local build.

Specific points:
- **Ψ** is defined in DRK-105 as the "psychosis metric", a label retired in thesis v4.4. The note points to DRK-130's "Narrative Self-Reference Ratio". Keep DRK-105 as defining post, or move it to DRK-130?
- **Γ, Ψ, ρ, H¹** match symbols, so usage counts include generic mathematical uses (e.g. ρ as density). Narrow the aliases if that matters.
- **Θ (trophic debt)** is used only in its defining post (DRK-176), so it is a *candidate*, not a KO, until a later post uses it.
- **Manufactured void, Cavity_AI, inversion filter, optimization axiom, ρ, H¹, chaxu geju** are defined in Drakens Ordlista (DRK-117), not in the post that introduced them. Fine as the defining post?

## 2. Gaps: heavily used terms with no defining sentence found

Write a one-sentence definition (in a new post, or point to an existing sentence) for:
- Global section / gluing (53 posts)
- Anti-totalization principle (35)
- Sheaf Laplacian (32) — external term (Hansen & Ghrist 2019); a KO may simply cite it
- Falsification / DRK-131 protocol (23)
- Keeper-function (8)

Until these exist, c₂ cannot reach 1.

## 3. Mark the c₇ tuning sample

`docs/w-c7-tuning-sample.md`, 20 paragraphs. Current c₇ ≈ 0.40 (matches the 2026-09-29 baseline).

## 4. Method choices made in W v1 (confirm or change before freezing)

1. **c₆ uses citation links only.** The map's semantic edges connect every post by construction.
2. **c₅ counts every post**, including the 45 written before DRK-131 existed.
3. **Per-post W** = (c₇³·c₁·c₅·c₆)^(1/6); c₂–c₄ are corpus-level. A post without a falsification block scores 0.
4. **Components with an empty denominator are n/a and dropped** (exponent renormalised), e.g. c₃/c₄ while no KO is approved.
5. **c₇:** paragraphs tagged **[D]** or **[M]** count as satisfied (post standard §6); internal `/posts/` links do not count as a reference; figure captions are skipped.

## 5. Other

- Post pages still label the author-set frontmatter value "Sheaf Coherence Γ". Relabel to "Coherence (author-scored)"?
- c₁ leaks: bare mentions of DRK-099, 102, 103, 122, 126 and DRK-134 (reserved) match no published post. Edit the posts, or accept.
- "Cross-layer links" (static 74) is replaced by the computed citation-link count (436). Words and sources were also frozen before this branch, not dynamic.
- Next free number per `/data/drk-index.json`: DRK-192.
