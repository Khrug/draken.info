# draken.info

Static site for the Draken corpus: numbered DRK posts by Khrug Engineering, built with `node build.js` (gray-matter + marked) and deployed to Cloudflare Pages on push.

## Layout

- `posts/YYYY-MM-DD-slug.md`: published posts. Only `.md` files directly in `posts/` are built; `posts/v1/` holds old versions.
- `templates/`: HTML page templates (`base.html`, `index.html`, `post.html`).
- `scripts/`: `validate-posts.js` (runs first in the build), `check-links.js`, `corpus-map.js`, `ko.js` (KO registry checks and usage), `watertightness.js` (W v1).
- `static/`: assets and data (`static/data/`).
- `static/data/ko.json`: the KnowledgeObject registry, kept by hand. Definitions are quoted verbatim from posts; by Khrug's standing default (2026-10-02) every entry whose quoted definition verifies is entered as `status: "approved"`. Khrug can revoke any entry.
- `docs/`: project documents, including `POST_STANDARD.md`, `KO-W-DECISIONS.md` and `w-c7-tuning-sample.md`. Not published (POST_STANDARD.md is copied to `/data/post-standard.md`).

## Computed data (every build)

`/data/drk-index.json` (next free DRK number, latest 10), `/llms.txt` and `/feed.xml` (all posts, highest DRK first), `/posts/<slug>/index.md` (Markdown source), `/data/ko.json` (registry + usage), `/data/watertightness.json` (W, components, leaks), `/data/corpus-map.json`, `/data/post-standard.md`. Front-page numbers come only from these; never hard-code a statistic.

W is not Γ and must never be labelled Γ. It measures internal logic and factual grounding (definitions, references, connectivity, referenced claims), not form. Current version W v2; history in `docs/W-VERSIONS.md`. Changing W's components, patterns, thresholds or weights after seeing results is a new version, recorded there.
- `dist/`: build output. Never edit by hand.

## Commands

```bash
npm run validate      # post checks; errors abort the build
node build.js         # full build to dist/
npm run check-links   # checks built HTML, including #anchors
```

`node build.js` must exit 0 before any commit.

## Posts

Every new or revised post must follow `docs/POST_STANDARD.md`. Read it in full before writing or editing a post; do not model a new post on an earlier one.

- Next DRK number: highest `drk:` in `posts/` plus one. Never reuse DRK-134.
- Never invent content: no made-up sources, DOIs, definitions, DRK numbers, layers or coherence values. Anything that cannot be verified goes on a list for Khrug.

## Search and discovery

- Post `<title>`: post title, then ` — DRK-NNN · Draken`. Meta description: the post's `description` if 70–160 characters, otherwise the longer of description/excerpt cut to ~157 (`metaDescription()` in build.js). Write `description` within 70–160 characters so it is used as is.
- Each post carries JSON-LD (ScholarlyArticle + BreadcrumbList; author Kai Khrug Roininen with ORCID), `article:*` tags and Google Scholar `citation_*` tags. The front page carries WebSite/Person JSON-LD.
- Not indexed: `/slask/`, `/404.html`, `/posts/v1/*`, `/posts/*/index.md`.
- IndexNow: `static/<key>.txt` is the public key; `.github/workflows/indexnow.yml` submits changed post URLs to Bing after each push to main.

## Ground rules

- Files are UTF-8 without BOM, LF line endings.
- Keep the Corpus Map working: do not remove or rename `scripts/corpus-map.js`, `static/map/app.js`, `static/pages/corpus-map.html`, `static/data/corpus-map-names.json`, or the `buildCorpusMap` / `buildCorpusMapPage` calls in `build.js`.
- Work on a branch for anything beyond a single post, one commit per logical step.
- Stop before pushing. Report what changed, what was skipped, and what needs Khrug's decision.
