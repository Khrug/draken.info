# Draken post standard — v1

Every new DRK post follows this file. Attach it (or point to it) at the start of every post session. It replaces modelling a new post on an earlier one.

Scope: new posts from DRK-190 onward. Older posts are not rewritten to it.

Derived 2026-09-30 from all 80 posts in `posts/`. Where the corpus disagreed, the choice below follows the most recent reference-grade posts: [The Countable Mouth](/posts/the-countable-mouth/) (DRK-181), [The Held Mouth](/posts/the-held-mouth/) (DRK-182) and [The Bite](/posts/the-bite/) (DRK-184).

---

## 1. File

- Path: `posts/YYYY-MM-DD-slug.md`. Slug is lowercase kebab-case and matches the title's main noun phrase.
- UTF-8 without BOM, LF line endings.
- DRK number: next free number from `/data/drk-index.json` (after the cleanup: max + 1; never reuse DRK-134).

## 2. Frontmatter

Fields in this order. All are required except where noted.

| Field | Rule |
|---|---|
| `title` | `"Main Title: Subtitle"` in one quoted string. No separate `subtitle` key. |
| `drk` | `DRK-NNN`, unused. |
| `date` | `YYYY-MM-DD`, identical to the filename date. |
| `tags` | YAML list, 3–10 entries, lowercase kebab-case. |
| `layers` | YAML list of `L01`–`L18`, using the thesis v4.4 definitions. Never a bare string. |
| `coherence` | Two decimals in (0, 1], proposed at intake and confirmed by Khrug. |
| `description` | One sentence, **max 160 characters**. Used for search, link previews and meta tags. |
| `excerpt` | **Max 220 characters**, one line, quoted. See §2.1. |
| `status` | `published` or `draft`. |
| `author` | `Khrug Engineering` |
| `license` | `CC BY-SA 4.0` |
| `sources` | YAML list, at least one entry. Each entry is the full reference string exactly as it appears in the References section (§8). |

Optional: `companion`, `revised`, `revision_note`. Nothing else.

### 2.1 Excerpt: five rows maximum

The feed prints the excerpt as raw text, so it must fit and must be plain.

- **Max 220 characters.** Measured on the live feed 2026-09-30 (Crimson Pro 15 px): five rows hold 240 characters at 393 px phone width, 225 at 360 px, and 625 on a 1366 px desktop. 220 keeps every post within five rows on phones as narrow as 360 px. (At the time of measurement, 71 of 80 existing excerpts ran past five rows on a phone.)
- Plain text only: no Markdown, no LaTeX, no `$`, no asterisks, no links. Write `H1` or `H¹`, not `$H^1$`.
- One or two sentences stating the claim, not the structure of the post. No "This post…".

## 3. Body order

```
§0 Sammanfattning
Epistemic ledger
§1 … §N          (the argument)
§N+1 Falsification (DRK-131)
§N+2 Provenance and leaks
References
Footer
```

- Top-level sections: `## §N Title`, numbered from §0 with no gaps or duplicates.
- Subsections: `### §N.M Title`.
- A horizontal rule `---` on its own line between top-level sections.
- `## References` is the only unnumbered heading.

## 4. §0 Sammanfattning

- Heading is always `## §0 Sammanfattning`.
- First line: one italic epigraph sentence. It may be in Swedish.
- Then 3–6 sentences in English stating the headline claim, carrying its ledger tag, and naming what the post does not claim.

## 5. Epistemic ledger

Placed directly after §0, verbatim:

```markdown
**Epistemic ledger.** Every substantive claim carries one tag:

| Tag | Meaning |
|---|---|
| **[E]** | Established: textbook consensus, a proved theorem, direct measurement, or a standard etymology (SAOB, Hellquist, OED, etymonline) |
| **[S]** | Supported: leading model or majority scholarly reading, strong but incomplete evidence |
| **[H]** | Hypothesis: open, contested, or without decisive evidence |
| **[D]** | Draken synthesis: structural claim made by this corpus, submitted for Clinch review |
| **[M]** | Metaphor or paronomasia: a pointer, not a referent or root (per [The Pendragon Source](/posts/the-pendragon-source/), DRK-165) |
```

Rules:

- **One tag per substantive claim**, bold, placed at the end of the claim before the full stop: `…is contractible **[E]**.`
- A heading may carry a tag when the whole subsection has the same status: `### §6.1 Three roots in one sound [E]`.
- A split claim uses a combined tag only when the sentence makes the split explicit: `**[E/D]**` ("the theorem is [E], the reading is [D]").
- Etymologies: shared root **[E]** (or **[S]** if majority but disputed), disputed derivation **[H]**, sound resemblance only **[M]**. This replaces the `[attested]` / `[folk]` marks in the implementation plan.
- A **[D]** claim never cites an external source as if the source made it.
- An **[M]** link carries no argumentative weight. If removing it breaks the argument, the post is wrong.

## 6. Writing the argument

**Citations in the text**

- Format: parenthetical `(Author Year)`, `(Author & Author Year)`, `(Author et al. Year)`, several as `(Calderbank & Shor 1996; Steane 1996)`; or narrative `Kitaev (2003)`, `Panteleev & Kalachev (2024)`.
- Every claim paragraph cites at least one source or is tagged **[D]** or **[M]**.
- Every in-text citation resolves to exactly one entry in References, and every References entry is cited in the text.
- Quote sources only when the exact wording matters, briefly. Otherwise paraphrase.

**Corpus crosslinks**

- Every mention of another post is a link: `[Title](/posts/slug/) (DRK-NNN)`. No bare "DRK-NNN" in the body.
- Every "see §N", table and figure reference resolves within the post.

**New terms**

- Define in one sentence at first use, in bold. Add to `static/data/ko.json` with the verbatim defining sentence; by Khrug's standing default (2026-10-02) an entry whose definition verifies is entered as `approved`.

**Math**

- Inline `$…$`, display `$$…$$` on its own lines.
- Define every symbol at first use. State the field or ring where it matters (for example over $\mathbb F_2$ or $\mathbb R$).
- A formal sketch that is an analogy says so in its heading: `## §N Formal sketch (analogy, not derivation)`.

**Tables**

- For comparisons and ledgers only. Keep cells short.

## 7. Falsification and provenance

**`## §N Falsification (DRK-131)`**, the last numbered argument section:

```markdown
**F1: Short name.** What §X claims or predicts. **Refuted** if <observable result>.

**F2: …**

**Fk: Scope limit.** What the post does not claim, and which sections survive if F1–F(k−1) fail.
```

- At least two falsifiers plus the scope limit.
- Each points to the section it tests and names an observation, not an opinion.

**`## §N+1 Provenance and leaks`**, numbered list:

- Who supplied what: Khrug's prompt or source notes; Claude-authored or other-model-authored parts; Clinch review status.
- Anything not verified against the primary source (editions, translations, paraphrases, unreviewed preprints).
- Corrections made in the open.

## 8. References

Heading: `## References`, after Provenance and leaks.

- Alphabetical by first author's surname; same author sorted by year.
- One bullet per work:

```markdown
- Surname, A. B. & Surname, C. (Year). Title in sentence case. *Journal* Vol, pages. [doi:10.xxxx/yyyy](https://doi.org/10.xxxx/yyyy)
- Surname, A. (Year). Title. Preprint. [arXiv:NNNN.NNNNN](https://arxiv.org/abs/NNNN.NNNNN)
- Surname, A. (Year). *Book Title*. Publisher.
- Svenska Akademiens ordbok (SAOB), entry *ord*. [saob.se](https://www.saob.se)
- Hellquist, E. (1922). *Svensk etymologisk ordbok*, entry *ord*.
```

- Prefer DOI; otherwise arXiv; otherwise a stable URL.
- Preprints are marked `Preprint.` and never presented as peer-reviewed.
- Primary texts (Eddas, scripture, classical authors) name the edition or translation used, or say in Provenance that none was fixed.
- Only references verified to exist, with correct authors, title, year and identifier. Anything unverifiable is left out and listed in Provenance.
- The frontmatter `sources` list contains the same entries, same wording.

## 9. Footer

After References, exactly:

```markdown
---

*Operators: <symbols used> · Crosslinks: [Title](/posts/slug/) (DRK-NNN) · [Title](/posts/slug/) (DRK-NNN)*

*<optional one-line Swedish closing>*

*Khrug Engineering · Göteborg · ORCID 0009-0003-8049-7167 · DOI 10.5281/zenodo.23121197 · CC BY-SA 4.0*
```

The crosslink list matches the posts linked in the body, no more and no fewer.

## 10. Pre-publish checklist

- [ ] Filename date = `date`; DRK number unused
- [ ] `excerpt` ≤ 220 characters, plain text, one line
- [ ] `description` ≤ 160 characters
- [ ] `layers` is a list; `coherence` confirmed
- [ ] §0 Sammanfattning and the ledger present; sections §0…§N without gaps
- [ ] Every substantive claim tagged; every **[M]** removable without breaking the argument
- [ ] Every in-text citation ↔ one References entry; `sources` = References
- [ ] Every DRK mention is a working `/posts/` link; footer crosslinks match the body
- [ ] Falsification has at least two falsifiers plus a scope limit
- [ ] Provenance lists authorship and anything unverified
- [ ] `npm run validate` passes with 0 errors

---

## Skeleton

Copy from here into the new file.

```markdown
---
title: "Main Title: Subtitle"
drk: DRK-NNN
date: YYYY-MM-DD
tags: [tag-one, tag-two, tag-three]
layers: [L01, L10]
coherence: 0.85
description: "One sentence, max 160 characters."
excerpt: "Plain text, max 220 characters, the claim in one or two sentences."
status: published
author: Khrug Engineering
license: CC BY-SA 4.0
sources:
  - "Surname, A. (Year). Title. Journal Vol, pages. https://doi.org/..."
---

## §0 Sammanfattning

*Epigraph sentence.*

Headline claim in 3–6 sentences **[D]**. What the post does not claim.

**Epistemic ledger.** Every substantive claim carries one tag:

| Tag | Meaning |
|---|---|
| **[E]** | Established: textbook consensus, a proved theorem, direct measurement, or a standard etymology (SAOB, Hellquist, OED, etymonline) |
| **[S]** | Supported: leading model or majority scholarly reading, strong but incomplete evidence |
| **[H]** | Hypothesis: open, contested, or without decisive evidence |
| **[D]** | Draken synthesis: structural claim made by this corpus, submitted for Clinch review |
| **[M]** | Metaphor or paronomasia: a pointer, not a referent or root (per [The Pendragon Source](/posts/the-pendragon-source/), DRK-165) |

---

## §1 Title

Claim with citation (Author Year) **[E]**. Reading of it, linking [Title](/posts/slug/) (DRK-NNN) **[D]**.

### §1.1 Subsection

…

---

## §N Falsification (DRK-131)

**F1: Name.** What §X claims. **Refuted** if <observation>.

**F2: Name.** What §Y predicts. **Refuted** if <observation>.

**F3: Scope limit.** What is not claimed; what survives if F1–F2 fail.

---

## §N+1 Provenance and leaks

1. Authorship: …
2. Unverified: …

---

## References

- Surname, A. (Year). Title. *Journal* Vol, pages. [doi:…](https://doi.org/…)

---

*Operators: … · Crosslinks: [Title](/posts/slug/) (DRK-NNN)*

*Svensk slutrad.*

*Khrug Engineering · Göteborg · ORCID 0009-0003-8049-7167 · DOI 10.5281/zenodo.23121197 · CC BY-SA 4.0*
```
