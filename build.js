#!/usr/bin/env node
/**
 * build.js — draken.info static site generator (v2 — with thesis + sheaf game)
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const POSTS_DIR = path.join(__dirname, 'posts');
const TEMPLATES_DIR = path.join(__dirname, 'templates');
const STATIC_DIR = path.join(__dirname, 'static');
const DIST_DIR = path.join(__dirname, 'dist');
const DATA_FILE = path.join(STATIC_DIR, 'data', 'system.json');

marked.setOptions({ gfm: true, breaks: false });
const renderer = {
  code(code, lang) {
    if (lang === 'eq' || lang === 'equation') return `<div class="eq-block">${esc(code)}</div>`;
    return `<pre><code class="language-${lang || ''}">${esc(code)}</code></pre>`;
  }
};
marked.use({ renderer });

function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

function cleanDist() {
  if (fs.existsSync(DIST_DIR)) fs.rmSync(DIST_DIR, { recursive: true });
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

function readPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md')).map(file => {
    const { data, content } = matter(fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8'));
    if (data.status && data.status !== 'published') return null;
    const slug = file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
    return { ...data, slug, filename: file, content: marked.parse(content), rawContent: content };
  }).filter(Boolean).sort((a, b) => new Date(b.date) - new Date(a.date));
}

function readSystemData() {
  const defaults = { ko_count: 0, ko_embedded: 0, global_coherence: 0, pub_count: 0, active_layers: '0/18', phase: 'GENESIS', publications: [], layer_status: {} };
  if (fs.existsSync(DATA_FILE)) { try { return { ...defaults, ...JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')) }; } catch(e) {} }
  return defaults;
}

function loadTemplate(name) { return fs.readFileSync(path.join(TEMPLATES_DIR, name), 'utf-8'); }

function render(tpl, vars) {
  return tpl.replace(/\{\{(\w+)\}\}/g, (m, k) => vars[k] !== undefined ? vars[k] : m);
}

function tagClass(tag) {
  return ({ manifesto: 'tag-manifesto', theory: 'tag-theory', analysis: 'tag-analysis', technical: 'tag-technical' })[(tag||'').toLowerCase()] || 'tag-technical';
}

function fmtDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function timeAgo(d) {
  if (!d) return '';
  const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (m < 1) return 'just now'; if (m < 60) return m+'m ago';
  const h = Math.floor(m/60); if (h < 24) return h+'h ago';
  return Math.floor(h/24)+'d ago';
}

function buildCards(posts) {
  return posts.map(p => {
    const tag = (p.tags && p.tags[0]) || 'technical';
    const layers = (p.layers || []).map(l => `<span class="layer-badge">${l}</span>`).join('');
    const c = p.coherence || 0;
    return `<a href="/posts/${p.slug}/" class="pub-card" data-tags="${(p.tags||[]).join(' ')}">
      <div class="pub-meta"><span class="pub-tag ${tagClass(tag)}">${tag}</span><span class="pub-drk">${p.drk||''}</span><span class="pub-date">${fmtDate(p.date)}</span></div>
      <h2 class="pub-title">${p.title}</h2>
      <p class="pub-excerpt">${p.excerpt||''}</p>
      <div class="pub-footer"><div class="pub-layers">${layers}</div>
      <div class="coherence-bar"><div class="coherence-track"><div class="coherence-fill ${c>=0.85?'':'mid'}" style="width:${Math.round(c*100)}%"></div></div><span>${c.toFixed(2)}</span></div></div></a>`;
  }).join('\n');
}

function buildEnhancedLayerGrid(sys) {
  const names = {'L01':'Quantum Field','L02':'Chem. Thermo.','L03':'Molecular Asm.','L04':'Bioelectric','L05':'Neural Integ.','L06':'Embodied Cog.','L07':'Narrative Self','L08':'Dyadic Signal','L09':'Group Cognition','L10':'Social Coord.','L11':'Economic Cog.','L12':'National Narr.','L13':'Political Str.','L14':'Economic Topo.','L15':'Cultural Field','L16':'Instit. Morph.','L17':'Civ. Memory','L18':'Planetary Cog.'};
  const st = sys.layer_status || {};
  const pubs = sys.publications || [];
  const colors = ['#e94560','#f59e0b','#2d8659','#1565C0','#6A1B9A','#E65100','#AD1457','#00897B','#5C6BC0','#8D6E63','#78909C','#C62828','#558B2F','#4527A0'];
  let h = '';
  for (let i = 1; i <= 18; i++) {
    const lid = 'L'+String(i).padStart(2,'0');
    const s = st[lid] || 'planned';
    const dots = pubs.filter(p => p.layers && p.layers.includes(lid)).map(p => {
      const c = colors[pubs.indexOf(p)%colors.length];
      return `<div class="layer-article-dot" style="background:${c}" title="${p.drk}: ${p.title}"></div>`;
    }).join('');
    h += `<div class="layer-row"><span class="layer-id ${s}">${lid}</span><span class="layer-name">${names[lid]||lid}</span><div class="layer-articles">${dots}</div></div>\n`;
  }
  return h;
}

function buildActivityFeed() {
  const f = path.join(STATIC_DIR, 'data', 'activity.json');
  let items = [];
  if (fs.existsSync(f)) { try { items = JSON.parse(fs.readFileSync(f, 'utf-8')); } catch(e) {} }
  if (!items.length) items = [
    { detail: 'draken.info v2 deployed', time: new Date().toISOString(), status: 'green' },
    { detail: 'Thesis page published', time: new Date().toISOString(), status: 'green' },
    { detail: 'Sheaf Game launched', time: new Date().toISOString(), status: 'green' },
    { detail: '247 KOs embedded in Pinecone', time: new Date().toISOString(), status: 'green' },
    { detail: 'Multi-model peer review complete', time: new Date().toISOString(), status: 'gold' },
  ];
  return items.slice(0, 8).map(i => `<div class="activity-item"><span class="dot dot-${i.status||'gray'}"></span>${i.detail}<span class="activity-time">— ${timeAgo(i.time)}</span></div>`).join('\n');
}

// ── THESIS PAGE ──
function buildThesisPage(baseTpl) {
  const tp = path.join(STATIC_DIR, 'pages', 'thesis.html');
  let body = '<div class="article-wrap"><h1>Thesis — Loading...</h1><p>The monograph file (thesis.html) was not found in static/pages/. Place draken-thesis-v3 body content there.</p><a href="/" class="back-link">← Back</a></div>';
  if (fs.existsSync(tp)) body = fs.readFileSync(tp, 'utf-8');

  const content = `<div class="article-wrap"><a href="/" class="back-link">← Back to Feed</a>
<article><header class="article-header"><span class="pub-tag tag-theory">monograph</span>
<h1>The Draken 2045 Framework — Research Monograph v3</h1>
<div class="article-meta"><span>Kai Roininen (Khrug)</span><span>March 2026</span><span>Khrug Engineering, Göteborg</span><span>All 18 Layers</span></div></header>
<div class="article-body thesis-body">${body}</div></article>
<div class="reader-feedback"><h3 class="feedback-title">◉ Peer Review Feedback</h3>
<p class="feedback-desc">Reviewed by DeepSeek, Perplexity, Kimi, and Grok. Human peer review is next.</p>
<form class="feedback-form" action="https://formsubmit.co/khrrug@gmail.com" method="POST">
<input type="hidden" name="_subject" value="[THESIS] Peer Review"><input type="hidden" name="_captcha" value="true"><input type="hidden" name="_next" value="https://draken.info/thesis/?feedback=sent"><input type="text" name="_honey" style="display:none">
<div class="form-row form-row-half"><input type="text" name="name" placeholder="Name" class="form-input"><input type="email" name="email" placeholder="Email" class="form-input"></div>
<div class="form-row"><select name="type" class="form-input"><option value="math">🔢 Mathematical</option><option value="empirical">🔬 Empirical</option><option value="method">📐 Methodological</option><option value="citation">📚 Citation</option><option value="general">💬 General</option></select></div>
<div class="form-row"><textarea name="message" placeholder="Your feedback..." required class="form-input" rows="5"></textarea></div>
<button type="submit" class="form-submit">Submit Review →</button></form></div>
<div style="margin-top:48px;padding-top:24px;border-top:1px solid var(--border);display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px">
<a href="/" class="back-link">← Feed</a><a href="/sheaf-game/" class="back-link" style="color:var(--accent)">🎮 Sheaf Game →</a></div></div>`;

  const html = render(baseTpl, {
    title: 'The Draken 2045 Framework — Research Monograph',
    description: 'Topological Coherence Theory for Multi-Scale Systems Analysis.',
    content, og_type: 'article', og_url: 'https://draken.info/thesis/',
    og_image: 'https://draken.info/images/og-v2.png', jsonld: '',
  });
  const dir = path.join(DIST_DIR, 'thesis');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log('  ✓ thesis/');
}

// ── SHEAF GAME PAGE ──
function buildSheafGamePage(baseTpl) {
  const gp = path.join(STATIC_DIR, 'pages', 'sheaf-game.html');
  let body = '<div class="article-wrap"><h1>Sheaf Game — Coming Soon</h1></div>';
  if (fs.existsSync(gp)) body = fs.readFileSync(gp, 'utf-8');

  const html = render(baseTpl, {
    title: 'The Sheaf Game — Interactive Draken Pedagogy',
    description: 'Interactive sheaf theory visualization with 8 failure mode scenarios.',
    content: body, og_type: 'website', og_url: 'https://draken.info/sheaf-game/',
    og_image: 'https://draken.info/images/og-v2.png', jsonld: '',
  });
  const dir = path.join(DIST_DIR, 'sheaf-game');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log('  ✓ sheaf-game/');
}

// ── Sitemap ──
function genSitemap(posts) {
  const b = 'https://draken.info';
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `<url><loc>${b}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>\n` +
    `<url><loc>${b}/thesis/</loc><priority>0.9</priority></url>\n` +
    `<url><loc>${b}/sheaf-game/</loc><priority>0.7</priority></url>\n` +
    posts.map(p => `<url><loc>${b}/posts/${p.slug}/</loc><lastmod>${new Date(p.date).toISOString().split('T')[0]}</lastmod><priority>0.8</priority></url>`).join('\n') +
    '\n</urlset>';
}

function postJsonLd(p) {
  return JSON.stringify({"@context":"https://schema.org","@type":"ScholarlyArticle","headline":p.title,"datePublished":new Date(p.date).toISOString(),"author":{"@type":"Organization","name":p.author||"Khrug Engineering"},"publisher":{"@type":"Organization","name":"Draken 2045 Initiative","url":"https://draken.info"},"description":p.excerpt||'',"url":`https://draken.info/posts/${p.slug}/`});
}

function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dest, e.name);
    e.isDirectory() ? copyDirSync(s, d) : fs.copyFileSync(s, d);
  }
}

// ═══ MAIN BUILD ═══
function build() {
  console.log('╔══════════════════════════════════════╗');
  console.log('║  draken.info v2 — building...        ║');
  console.log('╚══════════════════════════════════════╝');

  cleanDist();

  const posts = readPosts();
  const sys = readSystemData();
  sys.pub_count = posts.length;

  console.log(`  Posts: ${posts.length} | Phase: ${sys.phase} | Γ: ${sys.global_coherence}`);

  const baseTpl = loadTemplate('base.html');
  const indexTpl = loadTemplate('index.html');
  const postTpl = loadTemplate('post.html');

  // ── Index page ──
  const indexContent = render(indexTpl, {
    cards: buildCards(posts),
    ko_count: sys.ko_count,
    ko_embedded: sys.ko_embedded || sys.ko_count,
    global_coherence: (sys.global_coherence || 0).toFixed(3),
    pub_count: sys.pub_count,
    active_layers: sys.active_layers,
    phase: sys.phase,
    layer_grid_enhanced: buildEnhancedLayerGrid(sys),
    activity_feed: buildActivityFeed(),
  });

  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), render(baseTpl, {
    title: 'Draken 2045 — Topological Knowledge Architecture',
    description: 'Research framework for structured knowledge assembly grounded in sheaf-theoretic topology.',
    content: indexContent, og_type: 'website', og_url: 'https://draken.info/',
    og_image: 'https://draken.info/images/og-v2.png', jsonld: '',
  }));
  console.log('  ✓ index.html');

  // ── Post pages ──
  const postsDir = path.join(DIST_DIR, 'posts');
  fs.mkdirSync(postsDir, { recursive: true });
  for (const p of posts) {
    const dir = path.join(postsDir, p.slug);
    fs.mkdirSync(dir, { recursive: true });
    const pc = render(postTpl, {
      title: p.title, tag: (p.tags&&p.tags[0])||'technical',
      tagClass: tagClass((p.tags&&p.tags[0])||'technical'),
      drk: p.drk||'', date: fmtDate(p.date), author: p.author||'Khrug Engineering',
      layers: (p.layers||[]).join(' · '), coherence: (p.coherence||0).toFixed(2),
      body: p.content, layer_count: (p.layers||[]).length, ko_count: '—',
      post_url: `https://draken.info/posts/${p.slug}/`,
    });
    fs.writeFileSync(path.join(dir, 'index.html'), render(baseTpl, {
      title: `${p.title} — Draken 2045`, description: p.excerpt||'',
      content: pc, og_type: 'article', og_url: `https://draken.info/posts/${p.slug}/`,
      og_image: 'https://draken.info/images/og-v2.png',
      jsonld: `<script type="application/ld+json">${postJsonLd(p)}</script>`,
    }));
    console.log(`  ✓ posts/${p.slug}/`);
  }

  // ── Thesis + Sheaf Game (INSIDE build, AFTER cleanDist) ──
  buildThesisPage(baseTpl);
  buildSheafGamePage(baseTpl);

  // ── Static assets ──
  copyDirSync(path.join(STATIC_DIR, 'data'), path.join(DIST_DIR, 'data'));
  copyDirSync(path.join(STATIC_DIR, 'images'), path.join(DIST_DIR, 'images'));
  fs.copyFileSync(path.join(__dirname, 'style.css'), path.join(DIST_DIR, 'style.css'));
  console.log('  ✓ static assets');

  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), genSitemap(posts));
  fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: https://draken.info/sitemap.xml\n');
  console.log('  ✓ sitemap + robots\n  Build complete → dist/');
}

build();
