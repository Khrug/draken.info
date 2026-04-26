#!/usr/bin/env node
/**
 * build.js â€” draken.info static site generator (v2.1 â€” with thesis + sheaf game + slask)
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

// â”€â”€ Math protection: hide $$...$$ and $...$ from marked, restore after â”€â”€
function protectMath(text) {
  const store = [];
  // Protect display math $$...$$ first (greedy across newlines)
  text = text.replace(/\$\$([\s\S]+?)\$\$/g, (m, inner) => {
    store.push({ type: 'display', content: inner });
    return `%%MATH_BLOCK_${store.length - 1}%%`;
  });
  // Protect inline math $...$
  text = text.replace(/\$([^\$\n]+?)\$/g, (m, inner) => {
    store.push({ type: 'inline', content: inner });
    return `%%MATH_INLINE_${store.length - 1}%%`;
  });
  return { text, store };
}

function restoreMath(html, store) {
  // Restore display math
  html = html.replace(/%%MATH_BLOCK_(\d+)%%/g, (m, i) => {
    return `$$${store[parseInt(i)].content}$$`;
  });
  // Restore inline math
  html = html.replace(/%%MATH_INLINE_(\d+)%%/g, (m, i) => {
    return `$${store[parseInt(i)].content}$`;
  });
  return html;
}

function parseMathSafe(content) {
  const { text, store } = protectMath(content);
  let html = marked.parse(text);
  return restoreMath(html, store);
}

function readPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md')).map(file => {
    const { data, content } = matter(fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8'));
    if (data.status && data.status !== 'published') return null;
    const slug = file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
    return { ...data, slug, filename: file, content: parseMathSafe(content), rawContent: content };
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
    { detail: 'Sheaf Analyzer launched', time: new Date().toISOString(), status: 'green' },
    { detail: '247 KOs embedded in Pinecone', time: new Date().toISOString(), status: 'green' },
    { detail: 'Multi-model peer review complete', time: new Date().toISOString(), status: 'gold' },
  ];
  return items.slice(0, 8).map(i => `<div class="activity-item"><span class="dot dot-${i.status||'gray'}"></span>${i.detail}<span class="activity-time">â€” ${timeAgo(i.time)}</span></div>`).join('\n');
}

// â”€â”€ THESIS PAGE â”€â”€
function buildThesisPage(baseTpl) {
  const tp = path.join(STATIC_DIR, 'pages', 'thesis.html');
  let body = '<div class="article-wrap"><h1>Thesis â€” Loading...</h1><p>The monograph file (thesis.html) was not found in static/pages/.</p><a href="/" class="back-link">â† Back</a></div>';
  if (fs.existsSync(tp)) body = fs.readFileSync(tp, 'utf-8');

  const content = `<div class="article-wrap"><a href="/" class="back-link">â† Back to Feed</a>
<article><header class="article-header"><span class="pub-tag tag-theory">monograph</span>
<h1>The Draken 2045 Framework â€” Research Monograph v4.4</h1>
<div class="article-meta"><span>Kai Roininen (Khrug)</span><span>March 2026</span><span>Khrug Engineering, GÃ¶teborg</span><span>All 18 Layers</span></div></header>
<div class="article-body thesis-body">${body}</div></article>
<div class="reader-feedback"><h3 class="feedback-title">â—‰ Peer Review Feedback</h3>
<p class="feedback-desc">Reviewed by Claude, ChatGPT, Kimi, Grok, DeepSeek, and Gemini. See monograph for details.</p>
<form class="feedback-form" action="https://formsubmit.co/khrrug@gmail.com" method="POST">
<input type="hidden" name="_subject" value="[THESIS] Peer Review"><input type="hidden" name="_captcha" value="true"><input type="hidden" name="_next" value="https://draken.info/thesis/?feedback=sent"><input type="text" name="_honey" style="display:none">
<div class="form-row form-row-half"><input type="text" name="name" placeholder="Name" class="form-input"><input type="email" name="email" placeholder="Email" class="form-input"></div>
<div class="form-row"><select name="type" class="form-input"><option value="math">ðŸ”¢ Mathematical</option><option value="empirical">ðŸ”¬ Empirical</option><option value="method">ðŸ“ Methodological</option><option value="citation">ðŸ“š Citation</option><option value="general">ðŸ’¬ General</option></select></div>
<div class="form-row"><textarea name="message" placeholder="Your feedback..." required class="form-input" rows="5"></textarea></div>
<button type="submit" class="form-submit">Submit Review â†’</button></form></div>
<div style="margin-top:48px;padding-top:24px;border-top:1px solid var(--border);display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px">
<a href="/" class="back-link">â† Feed</a><a href="/sheaf-analyzer/" class="back-link" style="color:var(--accent)">â—† Sheaf Analyzer â†’</a></div></div>`;

  const html = render(baseTpl, {
    title: 'The Draken 2045 Framework â€” Research Monograph',
    description: 'Topological Coherence Theory for Multi-Scale Systems Analysis.',
    content, og_type: 'article', og_url: 'https://draken.info/thesis/',
    og_image: 'https://draken.info/images/og-v2.png', jsonld: '',
  });
  const dir = path.join(DIST_DIR, 'thesis');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log('  âœ“ thesis/');
}

// ── CORPUS.JSON — strip-to-plain export for client-side analyzer ──
function buildCorpusJson(posts) {
  const items = posts.map(p => {
    // Strip markdown syntax to plain text (analyzer is robust to residual punctuation)
    let t = p.rawContent || '';
    t = t.replace(/```[\s\S]*?```/g, ' ');          // fenced code
    t = t.replace(/`[^`\n]+`/g, ' ');               // inline code
    t = t.replace(/!\[[^\]]*\]\([^)]+\)/g, ' ');    // images
    t = t.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');  // links → keep text
    t = t.replace(/^#{1,6}\s+/gm, '');              // headings
    t = t.replace(/^\s*[-*+]\s+/gm, '');            // list bullets
    t = t.replace(/^\s*>\s?/gm, '');                // blockquotes
    t = t.replace(/\*\*([^*]+)\*\*/g, '$1');        // bold
    t = t.replace(/\*([^*]+)\*/g, '$1');            // italic
    t = t.replace(/_([^_]+)_/g, '$1');              // underscore emph
    t = t.replace(/~{2}([^~]+)~{2}/g, '$1');        // strikethrough
    t = t.replace(/\n{3,}/g, '\n\n').trim();
    return {
      drk: p.drk || '',
      slug: p.slug,
      title: p.title || p.slug,
      date: p.date ? new Date(p.date).toISOString().split('T')[0] : '',
      layers: p.layers || [],
      coherence: p.coherence || 0,
      tags: p.tags || [],
      words: t.split(/\s+/).filter(Boolean).length,
      text: t
    };
  }).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const out = { generated: new Date().toISOString(), count: items.length, posts: items };
  const dataDir = path.join(DIST_DIR, 'data');
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(path.join(dataDir, 'corpus.json'), JSON.stringify(out));
  console.log(`  ✓ data/corpus.json (${items.length} posts, ${(JSON.stringify(out).length/1024).toFixed(1)}kb)`);
}

// ── SHEAF ANALYZER PAGE (topological narrative diagnostic) ──
function buildSheafAnalyzerPage(baseTpl) {
  const ap = path.join(STATIC_DIR, 'pages', 'sheaf-analyzer.html');
  let body = '<div class="article-wrap"><h1>Sheaf Analyzer — Coming Soon</h1></div>';
  if (fs.existsSync(ap)) body = fs.readFileSync(ap, 'utf-8');

  const html = render(baseTpl, {
    title: 'Sheaf Analyzer — Draken Topological Narrative Diagnostic',
    description: 'Paste text or fetch a URL; extract sheaf metrics (Γ, Ψ, K(t), α), detect manufactured voids, and render a rotatable 3D concept graph across the 18 Draken layers.',
    content: body, og_type: 'website', og_url: 'https://draken.info/sheaf-analyzer/',
    og_image: 'https://draken.info/images/og-v2.png', jsonld: '',
  });
  const dir = path.join(DIST_DIR, 'sheaf-analyzer');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log('  ✓ sheaf-analyzer/');
}

// â”€â”€ SLASK PAGE (dynamic GitHub-powered file dump) â”€â”€
function buildSlaskPage(baseTpl) {
  // Also copy any existing static slask files
  const slaskSrc = path.join(STATIC_DIR, 'slask');
  const slaskDist = path.join(DIST_DIR, 'slask');
  if (fs.existsSync(slaskSrc)) copyDirSync(slaskSrc, slaskDist);
  else fs.mkdirSync(slaskDist, { recursive: true });

  // The page is fully dynamic â€” lists files from GitHub API, uploads via GitHub API
  const content = `
<style>
.sk{max-width:1200px;margin:0 auto;padding:20px 24px;font-family:Inter,'Helvetica Neue',sans-serif;color:#e6edf3}
.sk h2{font-size:24px;font-weight:700;color:#fff;margin:8px 0 4px}
.sk-sub{font-size:13px;color:#8b949e;margin-bottom:16px;line-height:1.5}
.sk-toolbar{display:flex;gap:8px;margin-bottom:16px;align-items:center;flex-wrap:wrap}
.sk-count{font-size:12px;color:#8b949e;margin-right:auto}
.sk-btn{padding:6px 14px;border-radius:5px;border:1px solid #30363d;background:#161b22;color:#8b949e;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .15s}
.sk-btn:hover{border-color:#484f58;color:#c9d1d9}
.sk-btn.on{border-color:#e94560;background:#e9456018;color:#fff}
.sk-btn.green{border-color:#2d8659;color:#2d8659}
.sk-btn.green:hover{background:#2d865918;color:#3fb950}
.sk-list{background:#161b22;border-radius:10px;overflow:hidden}
.sk-row{display:flex;align-items:center;gap:10px;padding:10px 16px;border-bottom:1px solid #21262d;transition:background .1s}
.sk-row:last-child{border-bottom:none}
.sk-row:hover{background:rgba(255,255,255,.03)}
.sk-icon{font-size:16px;flex-shrink:0;width:24px;text-align:center}
.sk-name{flex:1;color:#58a6ff;text-decoration:none;font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sk-name:hover{text-decoration:underline}
.sk-size{font-size:12px;color:#8b949e;width:70px;text-align:right;flex-shrink:0}
.sk-copy{background:none;border:1px solid #30363d;border-radius:4px;padding:3px 8px;cursor:pointer;font-size:13px;color:#8b949e;transition:all .15s}
.sk-copy:hover{border-color:#58a6ff;color:#58a6ff}
.sk-gallery{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px}
.sk-thumb{background:#161b22;border-radius:8px;overflow:hidden;border:1px solid #21262d;text-decoration:none;transition:border-color .15s;display:block}
.sk-thumb:hover{border-color:#e94560}
.sk-thumb img{width:100%;height:150px;object-fit:cover;display:block}
.sk-thumb-name{display:block;padding:8px 10px;font-size:12px;color:#8b949e;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sk-drop{border:2px dashed #30363d;border-radius:10px;padding:40px 20px;text-align:center;margin-bottom:16px;transition:all .2s;cursor:pointer}
.sk-drop:hover,.sk-drop.over{border-color:#e94560;background:#e9456008}
.sk-drop-text{font-size:14px;color:#8b949e}
.sk-drop-text strong{color:#e94560}
.sk-progress{margin-top:8px;font-size:12px;color:#2d8659;display:none}
.sk-auth{background:#161b22;border-radius:10px;padding:20px;margin-bottom:16px}
.sk-auth label{font-size:13px;color:#8b949e;display:block;margin-bottom:6px}
.sk-auth input{background:#0d1117;border:1px solid #30363d;border-radius:5px;padding:8px 12px;color:#e6edf3;font-size:13px;font-family:monospace;width:100%;box-sizing:border-box}
.sk-auth input:focus{outline:none;border-color:#e94560}
.sk-auth-hint{font-size:11px;color:#484f58;margin-top:6px;line-height:1.4}
.sk-toast{position:fixed;bottom:20px;right:20px;background:#2d8659;color:#fff;padding:10px 18px;border-radius:6px;font-size:13px;font-weight:600;opacity:0;transition:opacity .3s;pointer-events:none;z-index:999}
.sk-toast.show{opacity:1}
.sk-toast.err{background:#e94560}
.sk-empty{text-align:center;padding:40px;color:#8b949e;font-size:14px}
.sk-loading{text-align:center;padding:30px;color:#8b949e;font-size:13px}
.sk-deployed{display:inline-block;font-size:10px;padding:2px 6px;border-radius:3px;background:#2d865920;color:#2d8659;margin-left:6px}
.sk-pending{display:inline-block;font-size:10px;padding:2px 6px;border-radius:3px;background:#f59e0b20;color:#f59e0b;margin-left:6px}
#sk-gallery-view{display:none}
</style>

<div class="sk">
  <h2>ðŸ“ Slask</h2>
  <p class="sk-sub">Drag files here or click upload â€” they commit to GitHub and deploy automatically via Cloudflare Pages (~60s). Click ðŸ”— to copy the share link.</p>

  <!-- Auth (shown only if no token) -->
  <div class="sk-auth" id="sk-auth" style="display:none">
    <label>GitHub Personal Access Token <span style="color:#484f58">(stored in your browser only)</span></label>
    <input type="password" id="sk-token-input" placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" autocomplete="off">
    <div class="sk-auth-hint">Create at <a href="https://github.com/settings/tokens/new?scopes=repo&description=draken-slask" target="_blank" style="color:#58a6ff">github.com/settings/tokens</a> with <code>repo</code> scope. Entered once, saved in this browser.</div>
  </div>

  <!-- Drop zone -->
  <div class="sk-drop" id="sk-drop">
    <div class="sk-drop-text">
      <strong>Drop files here</strong> or click to browse<br>
      <input type="file" id="sk-file-input" multiple style="display:none">
    </div>
    <div class="sk-progress" id="sk-progress"></div>
  </div>

  <!-- Toolbar -->
  <div class="sk-toolbar">
    <span class="sk-count" id="sk-count">Loading...</span>
    <button class="sk-btn on" id="sk-list-btn" onclick="skView('list')">ðŸ“‹ List</button>
    <button class="sk-btn" id="sk-gal-btn" onclick="skView('gallery')">ðŸ–¼ï¸ Gallery</button>
    <button class="sk-btn" onclick="skRefresh()">ðŸ”„ Refresh</button>
  </div>

  <!-- File list -->
  <div id="sk-list-view">
    <div class="sk-loading" id="sk-loading">Loading files from GitHub...</div>
  </div>
  <div id="sk-gallery-view"></div>
</div>
<div class="sk-toast" id="sk-toast"></div>

<script>
(function() {
  var REPO = 'Khrug/draken.info';
  var PATH = 'static/slask';
  var API = 'https://api.github.com';
  var SITE = 'https://draken.info/slask/';
  var RAW = 'https://raw.githubusercontent.com/' + REPO + '/main/' + PATH + '/';
  var IGNORE = {'.gitkeep':1,'README.txt':1,'README.md':1,'.DS_Store':1,'Thumbs.db':1,'index.html':1};
  var IMG = {'.png':1,'.jpg':1,'.jpeg':1,'.gif':1,'.webp':1,'.svg':1,'.bmp':1};
  var VID = {'.mp4':1,'.webm':1,'.mov':1};
  var files = [];

  function token() { return (localStorage.getItem('sk_token')||'').trim(); }
  function setToken(t) { localStorage.setItem('sk_token', t.trim()); }

  function ext(name) { var i=name.lastIndexOf('.'); return i>0?name.slice(i).toLowerCase():''; }
  function icon(e) { return IMG[e]?'ðŸ–¼ï¸':VID[e]?'ðŸŽ¬':{'.pdf':1,'.doc':1,'.docx':1,'.pptx':1,'.xlsx':1}[e]?'ðŸ“„':{'.html':1,'.htm':1,'.css':1,'.js':1,'.json':1,'.md':1,'.txt':1,'.yml':1}[e]?'ðŸ“':'ðŸ“Ž'; }
  function fmtSize(b) { return b<1024?b+' B':b<1048576?(b/1024).toFixed(1)+' KB':(b/1048576).toFixed(1)+' MB'; }

  function toast(msg, err) {
    var t=document.getElementById('sk-toast');
    t.textContent=msg; t.className='sk-toast'+(err?' err':'')+' show';
    setTimeout(function(){t.className='sk-toast';},2000);
  }

  function checkAuth() {
    var t = token();
    document.getElementById('sk-auth').style.display = t ? 'none' : 'block';
    document.getElementById('sk-drop').style.display = t ? 'block' : 'none';
  }

  // Token input
  document.getElementById('sk-token-input').addEventListener('change', function(e) {
    var v = e.target.value.trim();
    if (v) { setToken(v); checkAuth(); toast('Token saved'); skRefresh(); }
  });

  // List files from GitHub
  function skRefresh() {
    document.getElementById('sk-loading') && (document.getElementById('sk-list-view').innerHTML = '<div class="sk-loading">Loading files from GitHub...</div>');
    var headers = {'Accept':'application/vnd.github.v3+json'};
    var t = token(); if (t) headers['Authorization'] = 'Bearer ' + t;

    fetch(API + '/repos/' + REPO + '/contents/' + PATH, {headers: headers})
    .then(function(r){ return r.json(); })
    .then(function(data){
      if (!Array.isArray(data)) { document.getElementById('sk-list-view').innerHTML='<div class="sk-empty">Could not load files. Check token or repo access.</div>'; return; }
      files = data.filter(function(f){ return f.type==='file' && !IGNORE[f.name]; }).sort(function(a,b){ return a.name.localeCompare(b.name); });
      renderFiles();
    })
    .catch(function(e){ document.getElementById('sk-list-view').innerHTML='<div class="sk-empty">Error: '+e.message+'</div>'; });
  }

  function renderFiles() {
    document.getElementById('sk-count').textContent = files.length + ' file' + (files.length!==1?'s':'');

    // List view
    if (!files.length) {
      document.getElementById('sk-list-view').innerHTML = '<div class="sk-empty">No files yet. Drop something above!</div>';
      document.getElementById('sk-gallery-view').innerHTML = '<div class="sk-empty">No images.</div>';
      return;
    }
    var listHtml = '<div class="sk-list">';
    for (var i=0; i<files.length; i++) {
      var f = files[i], e = ext(f.name);
      var liveUrl = SITE + f.name;
      var rawUrl = RAW + f.name;
      listHtml += '<div class="sk-row">';
      listHtml += '<span class="sk-icon">' + icon(e) + '</span>';
      listHtml += '<a href="' + rawUrl + '" target="_blank" class="sk-name" title="' + f.name + '">' + f.name + '</a>';
      listHtml += '<span class="sk-size">' + fmtSize(f.size) + '</span>';
      listHtml += '<button class="sk-copy" data-url="' + liveUrl + '" title="Copy draken.info link">ðŸ”—</button>';
      listHtml += '</div>';
    }
    listHtml += '</div>';
    document.getElementById('sk-list-view').innerHTML = listHtml;

    // Gallery view
    var imgs = files.filter(function(f){ return IMG[ext(f.name)]; });
    if (!imgs.length) { document.getElementById('sk-gallery-view').innerHTML = '<div class="sk-empty">No images.</div>'; return; }
    var galHtml = '<div class="sk-gallery">';
    for (var i=0; i<imgs.length; i++) {
      var f = imgs[i], rawUrl = RAW + f.name;
      galHtml += '<a href="' + rawUrl + '" target="_blank" class="sk-thumb" title="' + f.name + '">';
      galHtml += '<img src="' + rawUrl + '" alt="' + f.name + '" loading="lazy">';
      galHtml += '<span class="sk-thumb-name">' + f.name + '</span></a>';
    }
    galHtml += '</div>';
    document.getElementById('sk-gallery-view').innerHTML = galHtml;
  }

  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.sk-copy');
    if (btn && btn.dataset.url) {
      navigator.clipboard.writeText(btn.dataset.url).then(function(){ toast('Link copied!'); });
    }
  });

  window.skView = function(mode) {
    document.getElementById('sk-list-view').style.display = mode==='list'?'block':'none';
    document.getElementById('sk-gallery-view').style.display = mode==='gallery'?'block':'none';
    document.getElementById('sk-list-btn').className = 'sk-btn'+(mode==='list'?' on':'');
    document.getElementById('sk-gal-btn').className = 'sk-btn'+(mode==='gallery'?' on':'');
  };

  window.skRefresh = skRefresh;

  // Upload via GitHub API
  function uploadFile(file) {
    var t = token();
    if (!t) { toast('Enter GitHub token first', true); return Promise.resolve(); }
    var prog = document.getElementById('sk-progress');
    prog.style.display = 'block';
    prog.textContent = 'Uploading ' + file.name + '...';

    return new Promise(function(resolve) {
      var reader = new FileReader();
      reader.onload = function() {
        var base64 = reader.result.split(',')[1];
        fetch(API + '/repos/' + REPO + '/contents/' + PATH + '/' + file.name, {
          method: 'PUT',
          headers: {
            'Authorization': 'Bearer ' + t,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json'
          },
          body: JSON.stringify({
            message: 'slask: add ' + file.name,
            content: base64
          })
        })
        .then(function(r){ return r.json(); })
        .then(function(data){
          if (data.content) {
            toast(file.name + ' uploaded!');
          } else {
            toast('Error: ' + (data.message||'unknown'), true);
          }
          resolve();
        })
        .catch(function(e){ toast('Upload failed: ' + e.message, true); resolve(); });
      };
      reader.readAsDataURL(file);
    });
  }

  async function uploadFiles(fileList) {
    for (var i=0; i<fileList.length; i++) {
      await uploadFile(fileList[i]);
    }
    document.getElementById('sk-progress').style.display = 'none';
    skRefresh();
  }

  // Drop zone
  var drop = document.getElementById('sk-drop');
  var fileInput = document.getElementById('sk-file-input');

  drop.addEventListener('click', function(){ fileInput.click(); });
  fileInput.addEventListener('change', function(){ if (fileInput.files.length) uploadFiles(fileInput.files); });

  drop.addEventListener('dragover', function(e){ e.preventDefault(); drop.classList.add('over'); });
  drop.addEventListener('dragleave', function(){ drop.classList.remove('over'); });
  drop.addEventListener('drop', function(e){
    e.preventDefault(); drop.classList.remove('over');
    if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
  });

  // Init
  checkAuth();
  skRefresh();
})();
</script>`;

  const html = render(baseTpl, {
    title: 'Slask â€” Draken File Dump',
    description: 'Quick-share file repository for the Draken 2045 Initiative.',
    content, og_type: 'website', og_url: 'https://draken.info/slask/',
    og_image: 'https://draken.info/images/og-v2.png', jsonld: '',
  });

  fs.writeFileSync(path.join(slaskDist, 'index.html'), html);
  var fileCount = 0;
  try { fileCount = fs.readdirSync(slaskSrc).filter(f => !f.startsWith('.') && f !== 'README.txt').length; } catch(e) {}
  console.log('  âœ“ slask/ (dynamic, ' + fileCount + ' static files)');
}

// â”€â”€ Sitemap â”€â”€
function genSitemap(posts) {
  const b = 'https://draken.info';
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `<url><loc>${b}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>\n` +
    `<url><loc>${b}/thesis/</loc><priority>0.9</priority></url>\n` +
    `<url><loc>${b}/sheaf-analyzer/</loc><priority>0.8</priority></url>\n` +
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

// â•â•â• MAIN BUILD â•â•â•
function build() {
  console.log('â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—');
  console.log('â•‘  draken.info v2.1 â€” building...      â•‘');
  console.log('â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•');

  cleanDist();

  const posts = readPosts();
  const sys = readSystemData();
  sys.pub_count = posts.length;

  console.log(`  Posts: ${posts.length} | Phase: ${sys.phase} | Î“: ${sys.global_coherence}`);

  const baseTpl = loadTemplate('base.html');
  const indexTpl = loadTemplate('index.html');
  const postTpl = loadTemplate('post.html');

  // â”€â”€ Index page â”€â”€
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
    title: 'Draken 2045 â€” Topological Knowledge Architecture',
    description: 'Research framework for structured knowledge assembly grounded in sheaf-theoretic topology.',
    content: indexContent, og_type: 'website', og_url: 'https://draken.info/',
    og_image: 'https://draken.info/images/og-v2.png', jsonld: '',
  }));
  console.log('  âœ“ index.html');

  // â”€â”€ Post pages â”€â”€
  const postsDir = path.join(DIST_DIR, 'posts');
  fs.mkdirSync(postsDir, { recursive: true });
  for (const p of posts) {
    const dir = path.join(postsDir, p.slug);
    fs.mkdirSync(dir, { recursive: true });
    const pc = render(postTpl, {
      title: p.title, tag: (p.tags&&p.tags[0])||'technical',
      tagClass: tagClass((p.tags&&p.tags[0])||'technical'),
      drk: p.drk||'', date: fmtDate(p.date), author: p.author||'Khrug Engineering',
      layers: (p.layers||[]).join(' Â· '), coherence: (p.coherence||0).toFixed(2),
      body: p.content, layer_count: (p.layers||[]).length, ko_count: 'â€”',
      post_url: `https://draken.info/posts/${p.slug}/`,
    });
    fs.writeFileSync(path.join(dir, 'index.html'), render(baseTpl, {
      title: `${p.title} â€” Draken 2045`, description: p.excerpt||'',
      content: pc, og_type: 'article', og_url: `https://draken.info/posts/${p.slug}/`,
      og_image: 'https://draken.info/images/og-v2.png',
      jsonld: `<script type="application/ld+json">${postJsonLd(p)}</script>`,
    }));
    console.log(`  âœ“ posts/${p.slug}/`);
  }

  // â”€â”€ Thesis + Sheaf Analyzer + Slask â”€â”€
  buildThesisPage(baseTpl);
  buildSheafAnalyzerPage(baseTpl);
  buildSlaskPage(baseTpl);
  buildDigestPages();
  buildCorpusJson(posts);

  // â”€â”€ Static assets â”€â”€
  copyDirSync(path.join(STATIC_DIR, 'data'), path.join(DIST_DIR, 'data'));
  copyDirSync(path.join(STATIC_DIR, 'images'), path.join(DIST_DIR, 'images'));
  fs.copyFileSync(path.join(__dirname, 'style.css'), path.join(DIST_DIR, 'style.css'));
  // Vendor JS (three + 3d-force-graph) for same-origin loading by analyzer.
  // Sourced from node_modules (installed via npm); not committed to repo.
  const vendorDir = path.join(DIST_DIR, 'vendor');
  fs.mkdirSync(vendorDir, { recursive: true });
  const vendorFiles = [
    ['node_modules/three/build/three.min.js', 'three.min.js'],
    ['node_modules/3d-force-graph/dist/3d-force-graph.min.js', '3d-force-graph.min.js']
  ];
  let vendorOk = 0;
  for (const [src, dst] of vendorFiles) {
    const sp = path.join(__dirname, src);
    if (fs.existsSync(sp)) { fs.copyFileSync(sp, path.join(vendorDir, dst)); vendorOk++; }
    else console.warn('  ! vendor missing: ' + src + ' (run npm install)');
  }
  console.log('  ✓ static assets + vendor (' + vendorOk + '/2 libs)');

  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), genSitemap(posts));
  fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: https://draken.info/sitemap.xml\n');
  console.log('  âœ“ sitemap + robots\n  Build complete â†’ dist/');
}

build();

// ── DIGEST pages (self-contained standalone HTML, one dir per issue) ──
function buildDigestPages() {
  const src = path.join(__dirname, 'digest');
  const dst = path.join(DIST_DIR, 'digest');
  if (!fs.existsSync(src)) { console.log('  · digest/ source not present, skipping'); return; }
  copyDirSync(src, dst);
  let count = 0;
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    if (e.isDirectory() && fs.existsSync(path.join(src, e.name, 'index.html'))) count++;
  }
  console.log(`  ✓ digest/ (${count} issue${count !== 1 ? 's' : ''})`);
}