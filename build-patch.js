/**
 * build-patch.js — ADDITIONS to draken.info build.js
 * 
 * Add these functions to your existing build.js, 
 * and call them from the main build flow after buildIndex().
 * 
 * Or: paste the relevant sections into your existing build.js.
 */

const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, 'dist');
const TEMPLATES_DIR = path.join(__dirname, 'templates');
const STATIC_DIR = path.join(__dirname, 'static');

// ── Read system data ──
function getSystemData() {
  const dataFile = path.join(STATIC_DIR, 'data', 'system.json');
  if (fs.existsSync(dataFile)) {
    return JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
  }
  return { ko_count: 0, ko_embedded: 0, global_coherence: 0, pub_count: 14, active_layers: '14/18', phase: 'GENESIS' };
}

// ── Build enhanced layer grid HTML ──
// Shows each layer with dots representing which articles cover it
function buildEnhancedLayerGrid(systemData) {
  const layerNames = {
    'L01': 'Quantum Field', 'L02': 'Chem. Thermo.', 'L03': 'Molecular Asm.',
    'L04': 'Bioelectric', 'L05': 'Neural Integ.', 'L06': 'Embodied Cog.',
    'L07': 'Narrative Self', 'L08': 'Dyadic Signal', 'L09': 'Group Cognition',
    'L10': 'Social Coord.', 'L11': 'Economic Cog.', 'L12': 'National Narr.',
    'L13': 'Political Str.', 'L14': 'Economic Topo.', 'L15': 'Cultural Field',
    'L16': 'Instit. Morph.', 'L17': 'Civ. Memory', 'L18': 'Planetary Cog.'
  };

  const layerStatus = systemData.layer_status || {};
  const pubs = systemData.publications || [];

  // Color palette for articles
  const colors = ['#e94560','#f59e0b','#2d8659','#1565C0','#6A1B9A','#E65100','#AD1457','#00897B','#5C6BC0','#8D6E63','#78909C','#C62828','#558B2F','#4527A0'];

  let html = '';
  for (let i = 1; i <= 18; i++) {
    const lid = `L${String(i).padStart(2, '0')}`;
    const status = layerStatus[lid] || 'planned';
    const name = layerNames[lid] || lid;
    
    // Find articles that cover this layer
    const coveringArticles = pubs.filter(p => p.layers && p.layers.includes(lid));
    
    const dots = coveringArticles.map((p, j) => {
      const idx = pubs.indexOf(p);
      const color = colors[idx % colors.length];
      return `<div class="layer-article-dot" style="background:${color}" title="${p.drk}: ${p.title}"></div>`;
    }).join('');

    html += `<div class="layer-row">
      <span class="layer-id ${status}">${lid}</span>
      <span class="layer-name">${name}</span>
      <div class="layer-articles">${dots}</div>
    </div>\n`;
  }
  return html;
}

// ── Build Thesis Page ──
function buildThesisPage() {
  const baseTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'base.html'), 'utf-8');
  
  // Read the thesis HTML file from static/pages/
  const thesisPath = path.join(STATIC_DIR, 'pages', 'thesis.html');
  let thesisContent = '';
  if (fs.existsSync(thesisPath)) {
    thesisContent = fs.readFileSync(thesisPath, 'utf-8');
  } else {
    thesisContent = `<div class="article-wrap"><h1>Thesis — Coming Soon</h1><p>The Draken 2045 Framework monograph is being prepared for publication.</p><a href="/" class="back-link">← Back to Feed</a></div>`;
  }

  // Wrap in feedback form
  const content = `
<div class="article-wrap">
  <a href="/" class="back-link">← Back to Feed</a>
  
  <article>
    <header class="article-header">
      <span class="pub-tag tag-theory">theory</span>
      <h1>The Draken 2045 Framework — Research Monograph v3</h1>
      <div class="article-meta">
        <span>Kai Roininen (Khrug)</span>
        <span>March 2026</span>
        <span>Khrug Engineering, Göteborg</span>
        <span>All 18 Layers</span>
        <span>CC BY-SA 4.0</span>
      </div>
    </header>
    <div class="article-body thesis-body">
      ${thesisContent}
    </div>
  </article>

  <!-- Thesis-specific feedback -->
  <div class="reader-feedback">
    <h3 class="feedback-title">◉ Peer Review Feedback</h3>
    <p class="feedback-desc">This thesis has been reviewed by DeepSeek, Perplexity, Kimi, and Grok. Human peer review is the next step. Your feedback — especially mathematical corrections, empirical suggestions, and methodological critiques — is actively sought.</p>
    <form class="feedback-form" action="https://formsubmit.co/khrrug@gmail.com" method="POST">
      <input type="hidden" name="_subject" value="[THESIS] Peer Review Feedback">
      <input type="hidden" name="_captcha" value="true">
      <input type="hidden" name="_next" value="https://draken.info/thesis/?feedback=sent">
      <input type="hidden" name="article" value="Draken Framework Thesis v3">
      <input type="text" name="_honey" style="display:none">
      <div class="form-row form-row-half">
        <input type="text" name="name" placeholder="Name" class="form-input">
        <input type="email" name="email" placeholder="Email" class="form-input">
      </div>
      <div class="form-row">
        <input type="text" name="affiliation" placeholder="Affiliation / institution (optional)" class="form-input">
      </div>
      <div class="form-row">
        <select name="feedback_type" class="form-input">
          <option value="mathematical">🔢 Mathematical correction</option>
          <option value="empirical">🔬 Empirical suggestion</option>
          <option value="methodological">📐 Methodological critique</option>
          <option value="citation">📚 Missing citation / related work</option>
          <option value="general">💬 General comment</option>
        </select>
      </div>
      <div class="form-row">
        <input type="text" name="section_ref" placeholder="Section reference (e.g., 'Section 4.3, Equation 4.3')" class="form-input">
      </div>
      <div class="form-row">
        <textarea name="message" placeholder="Your review feedback..." required class="form-input" rows="6"></textarea>
      </div>
      <button type="submit" class="form-submit">Submit Review →</button>
    </form>
    <div id="feedback-success" class="form-success" style="display:none">
      ✓ Review received. If it increases Γ, it will be integrated.
    </div>
  </div>

  <div style="margin-top:48px;padding-top:24px;border-top:1px solid var(--border);display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;">
    <a href="/" class="back-link">← Back to Feed</a>
    <a href="/sheaf-game/" class="back-link" style="color:var(--accent)">🎮 Try the Sheaf Game →</a>
  </div>
</div>
<script>
  if (window.location.search.includes('feedback=sent')) {
    const f = document.querySelector('.feedback-form');
    const s = document.getElementById('feedback-success');
    if (f) f.style.display = 'none';
    if (s) s.style.display = 'block';
  }
</script>`;

  const html = baseTemplate
    .replace('{{title}}', 'The Draken 2045 Framework — Research Monograph')
    .replace('{{description}}', 'Topological Coherence Theory for Multi-Scale Systems Analysis. A sheaf-theoretic formalism with applications to institutional diagnostics, AI governance, and ecological economics.')
    .replace('{{og_type}}', 'article')
    .replace('{{og_url}}', 'https://draken.info/thesis/')
    .replace(/\{\{og_image\}\}/g, 'https://draken.info/images/og-default.png')
    .replace('{{jsonld}}', '')
    .replace('{{content}}', content);

  const thesisDir = path.join(DIST_DIR, 'thesis');
  fs.mkdirSync(thesisDir, { recursive: true });
  fs.writeFileSync(path.join(thesisDir, 'index.html'), html);
  console.log('  → Built /thesis/');
}

// ── Build Sheaf Game Page ──
function buildSheafGamePage() {
  const baseTemplate = fs.readFileSync(path.join(TEMPLATES_DIR, 'base.html'), 'utf-8');
  
  // Read the game HTML from static/pages/
  const gamePath = path.join(STATIC_DIR, 'pages', 'sheaf-game.html');
  let gameContent = '';
  if (fs.existsSync(gamePath)) {
    gameContent = fs.readFileSync(gamePath, 'utf-8');
  } else {
    gameContent = `<div class="article-wrap"><h1>Sheaf Game — Coming Soon</h1><p>The interactive sheaf pedagogy tool is being built.</p><a href="/" class="back-link">← Back to Feed</a></div>`;
  }

  const html = baseTemplate
    .replace('{{title}}', 'The Sheaf Game — Interactive Draken Pedagogy')
    .replace('{{description}}', 'Interactive visualization of sheaf theory, restriction maps, and coherence failure modes. Learn how layered agents build world-models and what happens when the gluing breaks.')
    .replace('{{og_type}}', 'website')
    .replace('{{og_url}}', 'https://draken.info/sheaf-game/')
    .replace(/\{\{og_image\}\}/g, 'https://draken.info/images/og-default.png')
    .replace('{{jsonld}}', '')
    .replace('{{content}}', gameContent);

  const gameDir = path.join(DIST_DIR, 'sheaf-game');
  fs.mkdirSync(gameDir, { recursive: true });
  fs.writeFileSync(path.join(gameDir, 'index.html'), html);
  console.log('  → Built /sheaf-game/');
}

// ── Export for integration into existing build.js ──
module.exports = { getSystemData, buildEnhancedLayerGrid, buildThesisPage, buildSheafGamePage };

// ── If run standalone ──
if (require.main === module) {
  console.log('Building additional pages...');
  buildThesisPage();
  buildSheafGamePage();
  console.log('Done.');
}
