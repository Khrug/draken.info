# Draken.info Site Update — Integration Guide

## What's in this package

```
draken-site-update/
├── templates/
│   ├── base.html          ← REPLACES existing base.html
│   ├── index.html         ← REPLACES existing index.html  
│   └── post.html          ← REPLACES existing post.html
├── static/
│   ├── data/
│   │   └── system.json    ← REPLACES existing system.json (now has real data)
│   └── pages/
│       └── sheaf-game.html ← NEW: standalone sheaf game page
├── build-patch.js         ← NEW: additions to build.js for thesis + game pages
├── style-additions.css    ← APPEND to end of existing style.css
└── README.md              ← This file
```

## Integration Steps

### 1. Backup current site
```bash
cd C:\Draken\draken.info
git stash   # or commit current state
```

### 2. Copy templates (overwrite existing)
```bash
copy draken-site-update\templates\base.html templates\base.html
copy draken-site-update\templates\index.html templates\index.html
copy draken-site-update\templates\post.html templates\post.html
```

### 3. Copy static files
```bash
copy draken-site-update\static\data\system.json static\data\system.json
mkdir static\pages
copy draken-site-update\static\pages\sheaf-game.html static\pages\sheaf-game.html
```

### 4. Add the thesis HTML
Copy the thesis v3 HTML content into `static/pages/thesis.html`:
- Use the `draken-thesis-v3.html` file we generated earlier
- Strip the `<html>`, `<head>`, `<body>` wrapper tags — keep only the inner content
- The build-patch.js wraps it in the base template automatically

### 5. Append CSS additions
```bash
type draken-site-update\style-additions.css >> style.css
```

### 6. Update build.js
Add these lines at the end of your existing build.js, before any final console.log:

```javascript
// ── Additional pages (v2 update) ──
const { buildEnhancedLayerGrid, buildThesisPage, buildSheafGamePage, getSystemData } = require('./build-patch');
buildThesisPage();
buildSheafGamePage();
```

Also update the index page builder to use the enhanced layer grid:
- In the function that builds the index, replace `{{layer_grid}}` with `{{layer_grid_enhanced}}`
- Use `buildEnhancedLayerGrid(getSystemData())` to generate the HTML
- Add `{{ko_embedded}}` template variable from system.json

### 7. Build and test locally
```bash
node build.js
# Open dist/index.html in browser
# Check: /thesis/ page exists
# Check: /sheaf-game/ page exists
# Check: contact form appears (replaces chat)
# Check: post pages have feedback form at bottom
```

### 8. Deploy
```bash
git add .
git commit -m "v2: sheaf game, thesis page, contact forms, KO stats, enhanced layer grid"
git push  # Cloudflare Pages auto-deploys
```

## What Changed

### Navigation (base.html)
- **Added:** "Thesis" link → /thesis/
- **Added:** "🎮 Sheaf Game" button (red accent) → /sheaf-game/
- **Removed:** "Codex" link (was pointing to #codex anchor, now inline)
- **Removed:** "Source" link to GitHub (moved to footer)
- **Updated:** Footer says "Göteborg" not "Stockholm"
- **Added:** MathJax CDN for LaTeX rendering in thesis

### Main Page (index.html)
- **Added:** "Embeddings Complete" to signal bar
- **Added:** Corpus Coherence Map (mini bar chart of per-article Γ scores)
- **Added:** KO embedding status bar with progress indicator
- **Added:** Enhanced layer grid showing which articles cover which layers (colored dots)
- **Replaced:** "Ask Draken" chat widget → Contact form (sends to khrrug@gmail.com via FormSubmit)
- **Added:** Corpus stats (total words, sources cited, cross-layer links)

### Post Pages (post.html)
- **Added:** Article coherence bar (Γ, layer count, KOs generated)
- **Added:** Reader feedback form with types: Comment, Question, Annotation, Correction, Extension
- **Added:** Section reference field for precise annotations
- **Added:** Link to thesis at bottom

### New Pages
- **/thesis/** — Full Draken Framework monograph v3, with peer review feedback form
- **/sheaf-game/** — Interactive sheaf pedagogy with 8 failure mode scenarios

### system.json
- Updated from 2 publications → 14 publications with full metadata
- Added per-publication KO counts, layer arrays, coherence scores
- Added corpus_stats (words, sources, cross-layer links)
- Added ko_embedded count
- Added layer_status for all 18 layers
- Phase updated to "GENESIS → ALPHA"

## Email Setup (separate from site update)
The contact form uses FormSubmit.co (free, no backend needed).
On first submission, FormSubmit sends a confirmation email to khrrug@gmail.com.
Click "Confirm" in that email to activate the form.

For kai@draken.info email, see the Cloudflare Email Routing setup guide
provided in the conversation.

## Notes
- The sheaf game is vanilla JS — no React dependency, works on the static site as-is
- FormSubmit handles CAPTCHA and spam filtering automatically
- The thesis page loads MathJax for LaTeX equations
- All new CSS is in style-additions.css — append to existing, don't replace
