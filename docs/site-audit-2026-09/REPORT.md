# Site audit 2026-09: report

Branch `fix/site-audit-2026-09`, based on `main` at `61178ef` (Navigator). **Nothing has been pushed.** Every group ran `node build.js` (exit 0) before its commit.

Companion files in this folder:
- `drk-registry.md`: every DRK number and its post, the unused numbers, and the reserved one.
- `description-proposals.md`: proposed `description` fields for 52 posts (A2.10). None applied yet.

## What changed, per group

### A1: Encoding (`999a22d`)
- Ran `ftfy` in encoding-only mode (quotes, line endings and Unicode normalisation left alone) over posts/, templates/, static/, digest/, scripts/, **build.js** and style.css.
- 22 files changed: 20 posts, `build.js` and `style.css`. All 119 distinct substitutions were reviewed. Each one is a mojibake reversal, e.g. `â€”`→`—`, `Ã¥`→`å`, `Î“`→`Γ`, `çŸ¥è¡Œåˆä¸€`→`知行合一`, Chinese citation titles, emoji, box-drawing.
- **The browser-tab title bug is fixed.** In `build.js` the index title now reads `Draken 2045 — Topological Knowledge Architecture`, and post titles read `<title> — Draken 2045`. The thesis, slask and console-output strings were fixed too.
- DRK-131 title is `知行合一: When Automation Removes the Only Honest Referee`. DRK-140 is `Repmånad`.
- After the fix, no mojibake or C1 control characters remain anywhere in scope. Nothing needed hand-patching.

### A2: Frontmatter hygiene (`e0849ea`)
- BOM stripped from 20 posts.
- `the-burnt-section` and `the-bottle-has-no-outside` were committed with CRLF. They are now LF. Added `.gitattributes` (`* text=auto eol=lf`, binaries marked). Note: most "CRLF" files on this machine were only a `core.autocrlf=true` checkout effect, since git already stored them as LF.
- `drk: 178/179/180/183` → `DRK-178/179/180/183`.
- `status: published` added to DRK-151, 152 and 156. `author` and `license` added to DRK-156.

### A3: Slugs, links, redirects (`7ea0ddd`, `d2a3167`)
- `2026-07-03-the-invsriant.md` → `the-invariant.md`. `static/_redirects` has a 301 from the old slug, and `build.js` now copies it into `dist/`. Checked in `wrangler pages dev`: 301 to `/posts/the-invariant/`.
- `/posts/two-optics/` → `/posts/the-two-optics/` (link and `crosslinks:` entry).
- bootstrap-inception: every `/posts/drk-NNN` link now points to its real slug, mapped by frontmatter number. DRK-126 has no post and was left alone.
- **DRK-131 v1 (A3.8):** the v1 text exists in commit `8f3c6c2`. It is restored to `posts/v1/2026-04-24-zhixing-heyi-honest-referee.md` (`status: superseded`) and rendered at `/posts/v1/zhixing-heyi-honest-referee/` with an "archived version" banner linking to v2. It stays out of the feed, sitemap, search and corpus data. `posts/v1/README.md` was updated to match.
- Also found by the new build-output link check: 16 links in `sheaves-of-the-mind` and `wings-tools-weapons` used `draken.info/<slug>` without `/posts/`. They were mapped by the DRK number in each link's text: DRK-105 "canonical-18-layers" → `kaiju-manifesto`, DRK-118 "planning-as-inference" → `countries-as-collective-minds`, and the others to their own slugs.
- Headings now get GitHub-style `id`s, so in-post TOC anchors such as DRK-112's `#ix-predictions-and-their-limitations` work.

### A4: Q2 digest (`1a13c69`)
- All 23 `file:///C:/` links replaced with `/`, `/thesis/`, `/digest/` and in-page `#anchors`. Every anchor target was verified to exist.
- **Figure 4 video:** `digest/m2-res_480p.mp4` had been deleted by accident in `5c7d5f2` (the DRK-131 v2 commit). It is restored from `b0cffc6` into `digest/q2-2026/` (byte-identical to the copy in Downloads) and referenced by absolute path. The fallback text now describes the clip and links to it.
- "Bosá" → "Bosca" in the Figure 6 caption and the index digest card.

### A5: Routes (`c41e16d`)
- `/digest/` is now a generated index page, built from each `digest/q<N>-<YYYY>/` folder (title and description read from the issue page), newest first. Nav and footer links point to `/digest/`, and it is in the sitemap. A Q3 issue appears automatically once its folder exists.
- **Additional display fix:** the sidebar "Corpus Coherence Map" and layer-grid dots read `static/data/system.json`, whose publication list stopped at DRK-131 and still listed "DRK-122 The Imaginary Dimension". `build.js` now rebuilds `dist/data/system.json` publications from posts/ on every build. KO counts, Γ and phase still come from the static file.

### A6: Validator (`6ebefe1`, `1426169`)
- `scripts/validate-posts.js`, run by `npm run validate`, as the first step of `build.js` (which aborts before touching dist/), and by `scripts/publish.sh`.
- Errors: drk format; layers not a list of L01–L18; coherence outside (0,1]; missing title/date/excerpt/status/author/license; date ≠ filename date; multi-line excerpt; bad filename or slug; duplicate slug; BOM; CRLF; C1; mojibake.
- Warnings: duplicate DRK numbers; missing description (one summary line, `--verbose` lists the posts); unresolved `/posts/<slug>/` links; `draken.info/<x>` links outside known routes; drafts.
- **Known-issues list.** `scripts/validate-known-issues.json` holds the content gaps that are waiting on you (below). Those are reported as warnings so they cannot block a deploy, which is how the July–September outage happened. Delete an entry once the value is filled in. The validator flags entries that no longer apply.
- Tested: 0 errors on the repo. It fails on a post copy with `layers: L01/L13/L18`, and `build.js` exits 1 on it. It also catches injected `â€`.
- `scripts/check-links.js` (`npm run check-links`) checks every internal href/src/#anchor in `dist/`, honouring `_redirects`.

### A7: DRK numbers (`c0f18a9`)
You delegated the numbering scheme. The rule used: **the post the rest of the corpus cites under a number keeps it. Displaced duplicates take the next free numbers in date order.** That is the same approach used before in `bccad7e` (DRK-143/144 → 147/148). Slugs and URLs are unchanged, so no redirects were needed.

| Number | Keeps | Moved |
|---|---|---|
| DRK-132 | Sheaf Analyzer manual (every in-corpus citation of 132) | The Bootstrap Inception → **DRK-185** |
| DRK-158 | The Burned Section (nearly every citation of 158) | Konkurrent → **DRK-186** (DRK-165 calls it "the rejected DRK-158") |
| DRK-163 | The Two Optics (every citation of 163) | The Bottle Has No Outside → **DRK-187** |
| DRK-166 | The Sonder Egg (2 of 3 citations) | The Damper and the Wastegate → **DRK-188**, The Carrier and the Cargo → **DRK-189** (cited as 166 once, updated) |

- DRK-134 was **not** used. DRK-133's frontmatter reserves it (`companion: DRK-134`).
- Cross-references updated: stalking-cell, carrier-and-the-cargo, pendragon-source, and bootstrap-inception's self-reference.
- DRK-133's footer said "DRK-131 · companion to DRK-132", and its body called the companion "DRK-132". Both are aligned with its frontmatter: DRK-133, companion DRK-134.
- A script check confirms every `[…](/posts/slug/) (DRK-NNN)` label in the corpus now matches the linked post's frontmatter.
- **The next free number is DRK-190.** The publishing pipeline must not hand out 185–189.

### Search, 404 and mobile (`d012ab3`)
- **Search bar** in the top bar on every templated page. `build.js` writes `/data/search-index.json` (750 kB raw, fetched only on first focus) and ships `/search.js`.
- Queries: every word must match; the last word matches as a prefix; case- and accent-insensitive (`repmanad` finds Repmånad). `158` or `DRK-158` finds by number, `L13` by layer, and `知行` works too. Title and slug hits rank above tag hits, then excerpt, then body words.
- Keys: `/` focuses, ↑/↓ move, Enter opens, Esc closes. `/?q=term` opens pre-filled.
- `dist/404.html` is generated, and `wrangler.jsonc` now sets `not_found_handling: "404-page"`.
- **Phone layout (375 px):** the nav used to overflow and widen every page. Now the top bar has two rows (logo and search, then a sideways-scrolling nav). Wide display and inline equations (including MathJax full-width tagged ones), tables, long URLs and SVGs scroll or wrap inside the article. The home grid column can shrink, and layer-grid dots wrap. A scan of every page at 375 px width found no horizontal overflow.
- `cleanDist()` now empties `dist/` instead of deleting it. On Windows, a running preview server made `rmSync` fail with EPERM.

## Part C checklist
- [x] `npm run validate`: 0 errors (19 warnings, all listed below as open items)
- [x] `node build.js` exits 0 (vendor libs present after `npm install`)
- [x] No mojibake, BOM or C1 in posts/, templates/, static/, digest/, build.js. Stored line endings are LF. Some working-copy files on this machine are still CRLF from `autocrlf`, and `.gitattributes` fixes that on the next checkout.
- [ ] No `file:///` anywhere: **2 left, not site pages:** `static/slask/The Dragon Digest — Q2 2026.html` (a saved copy of the old digest in your Slask uploads, still shipped at `/slask/`), and `digest-final.html` in the repo root (not built). Left alone because they're your files. Suggest deleting the Slask copy.
- [x] Internal links in the build output: 2,164 checked, 7 broken, all waiting on you (below)
- [x] `/digest/` 200, `/posts/the-invariant/` 200, `/posts/the-invsriant/` 301 → `/posts/the-invariant/` (`wrangler pages dev`)
- [x] DRK-131 renders as 知行合一 in the index card, the post page and the tab title
- [x] This report
- [x] Nothing pushed

## Skipped or not done
- **A2.10 descriptions**: proposals written, not applied (needs your approval).
- **License inconsistency**: DRK-151 and DRK-152 say `license: CC-BY-4.0`; every other post says `CC BY-SA 4.0`. Not changed.
- **Orakel**: `buildOrakelPage()` is still in build.js but not called since your "Navigator" commit, so `/orakel/` is 404 (same as live). I assumed that was intentional.
- **A8 content notes**: no site change, as planned.
- **Slug/title drift**: some slugs no longer match their titles, e.g. `countries-as-collective-minds` ("Planning as Inference"), `asymmetric-power` ("The Protocol and the Predator"), `lurianic-mirror` ("Drakō ben Adam"), `the-tiger-and-the-stick` ("…the Y-Stick"). These are working URLs, so I did not rename them. See question 9.

## Questions for Khrug (🔒)
1. **A2.11 Burnt or Burned?** DRK-158's title is "The Burned Section", its slug is `the-burnt-section`, and DRK-187 cites it as "Burned". DRK-179, 180, 183 and 184 cite it as "The Burnt Section". Which spelling should title and references use? (The slug can stay either way.)
2. **A2.7 layers and coherence** for DRK-185 The Bootstrap Inception, DRK-158 The Burned Section and DRK-187 The Bottle Has No Outside. They currently show 0.00 with no layer chips.
3. **Coherence missing** (not in the audit): DRK-112 The Thermodynamics of Affect, DRK-113 The Repetition Engine and DRK-115 The Curious Machine also show 0.00.
4. **A2.8** DRK-179: `coherence: 0.0` placeholder. Real value?
5. **A2.9** DRK-178: are the current layers `[L01, L13, L18]` and coherence `0.82` final?
6. **A2.6** Excerpt for DRK-185 The Bootstrap Inception. It has a long `description`; should its first sentence become the excerpt?
7. **A2.10** Approve or edit `description-proposals.md`.
8. **Dead links: point at a post, or remove?**
   - DRK-173 → `/posts/the-falsification-protocol/`. DRK-183 and DRK-184 call DRK-131 "falsification protocol". Point there?
   - DRK-154 → `/posts/the-eighteen-layers/`. `/thesis/` or DRK-105 Kaiju Manifesto (the canonical 18-layer table)?
   - DRK-127 → `/posts/the-exceptionality-trap/`, and DRK-185 lists "DRK-126: The Exceptionality Trap". No such post exists. Unpublished?
   - DRK-136 → `/posts/openclaw-integration/` and `/posts/runway-pipeline/`. Internal posts that were never published?
   - DRK-148 → `draken.info/dragon-scales-the-thread` ("Dragon Scales"). No such post.
9. **Slug/title drift**: rename drifted slugs to match titles, with 301 redirects? My suggestion is no, since existing external links keep working as they are.
10. **Stale titles next to correct numbers.** The numbers are right; the titles are old or planned names. Update the text?
    - DRK-135 and DRK-185 call DRK-129 "AI as Node / Anthropic interpretability". The post is *The Resonant Agenda*.
    - The same two posts call DRK-130 "Institutional Capture and the English Civil War". The post is *The Substrate and the Game*.
    - DRK-186 Konkurrent refers to "DRK-159 Retrocurrere". DRK-159 is *The Tiger and the Y-Stick*.
11. **License**: should DRK-151/152 be `CC BY-SA 4.0` like the rest?
