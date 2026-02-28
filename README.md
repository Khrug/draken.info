# draken.info

**The Draken 2045 Initiative** — Self-Building Artificial Superintelligence

An 18-layer ontological architecture spanning from quantum fields to planetary cognition, built on a 100,000-year ecological stewardship mandate.

## Architecture

Static site built from markdown. No framework, no CMS, no database.

- **Posts**: Markdown files with YAML front matter in `/posts/`
- **Build**: `node build.js` → renders to `/dist/`
- **Deploy**: Cloudflare Pages auto-deploys on push
- **Data**: Static JSON in `/static/data/` updated by OpenClaw

## Publishing

```bash
# Write a post
vim posts/2026-03-04-new-post.md

# Build and deploy
git add -A && git commit -m "Publish: DRK-XXX" && git push
```

Cloudflare Pages builds automatically in ~30 seconds.

## Local Development

```bash
npm install
node build.js
# Serve dist/ with any static server
npx serve dist
```

## Stack

| Layer | Technology |
|-------|-----------|
| Domain | draken.info via Cloudflare Registrar |
| Hosting | Cloudflare Pages (free tier) |
| Build | Custom Node.js script |
| Markdown | gray-matter + marked |
| CSS | Single stylesheet, no preprocessor |
| JS | Vanilla, no framework |

## License

Content © Khrug Engineering 2026. Architecture documentation is open for academic citation.

---

*Khrug Engineering — Stockholm*  
*V.1: Non-Deceptive Intention*
