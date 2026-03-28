#!/usr/bin/env node
/**
 * build.js — draken.info static site generator
 * 
 * Reads .md files from /posts with YAML front matter,
 * renders them into HTML using templates, outputs to /dist.
 * 
 * OpenClaw can read, understand, and modify every line of this file.
 * That is the point.
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

// ── Configuration ──
const POSTS_DIR = path.join(__dirname, 'posts');
const TEMPLATES_DIR = path.join(__dirname, 'templates');
const STATIC_DIR = path.join(__dirname, 'static');
const DIST_DIR = path.join(__dirname, 'dist');
const DATA_FILE = path.join(STATIC_DIR, 'data', 'system.json');

// ── Marked configuration ──
marked.setOptions({
  gfm: true,
  breaks: false,
});

// Custom renderer for equation blocks (```eq ... ```)
const renderer = {
  code(code, lang) {
    if (lang === 'eq' || lang === 'equation') {
      return `<div class="eq-block">${escapeHtml(code)}</div>`;
    }
    return `<pre><code class="language-${lang || ''}">${escapeHtml(code)}</code></pre>`;
  }
};
marked.use({ renderer });

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ── Step 1: Clean dist ──
function cleanDist() {
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true });
  }
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

// ── Step 2: Read all posts ──
function readPosts() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.log('No posts directory found. Creating empty feed.');
    return [];
  }

  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
  const posts = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
    const { data, content } = matter(raw);

    // Skip drafts
    if (data.status && data.status !== 'published') continue;

    const slug = file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
    const html = marked.parse(content);

    posts.push({
      ...data,
      slug,
      filename: file,
      content: html,
      rawContent: content,
    });
  }

  // Sort by date, newest first
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  return posts;
}

// ── Step 3: Read system data ──
function readSystemData() {
  const defaults = {
    ko_count: 0,
    global_coherence: 0.000,
    pub_count: 0,
    active_layers: '0/18',
    phase: 'GENESIS',
    last_updated: new Date().toISOString()
  };

  if (fs.existsSync(DATA_FILE)) {
    try {
      return { ...defaults, ...JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')) };
    } catch (e) {
      console.warn('Warning: Could not parse system.json, using defaults');
    }
  }
  return defaults;
}

// ── Step 4: Load templates ──
function loadTemplate(name) {
  return fs.readFileSync(path.join(TEMPLATES_DIR, name), 'utf-8');
}

// ── Step 5: Template rendering ──
function render(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return vars[key] !== undefined ? vars[key] : match;
  });
}

// ── Step 6: Generate tag class ──
function tagClass(tag) {
  const map = {
    manifesto: 'tag-manifesto',
    theory: 'tag-theory',
    analysis: 'tag-analysis',
    technical: 'tag-technical',
  };
  return map[(tag || '').toLowerCase()] || 'tag-technical';
}

// ── Step 7: Build publication cards HTML ──
function buildCards(posts) {
  return posts.map(post => {
    const tag = (post.tags && post.tags[0]) || 'technical';
    const layers = (post.layers || []).map(l =>
      `<span class="layer-badge">${l}</span>`
    ).join('');
    const coherence = post.coherence || 0;
    const coherenceClass = coherence >= 0.85 ? '' : 'mid';
    const coherencePct = Math.round(coherence * 100);

    return `
    <a href="/posts/${post.slug}/" class="pub-card" data-tags="${(post.tags || []).join(' ')}">
      <div class="pub-meta">
        <span class="pub-tag ${tagClass(tag)}">${tag}</span>
        <span class="pub-drk">${post.drk || ''}</span>
        <span class="pub-date">${formatDate(post.date)}</span>
      </div>
      <h2 class="pub-title">${post.title}</h2>
      <p class="pub-excerpt">${post.excerpt || ''}</p>
      <div class="pub-footer">
        <div class="pub-layers">${layers}</div>
        <div class="coherence-bar">
          <div class="coherence-track">
            <div class="coherence-fill ${coherenceClass}" style="width:${coherencePct}%"></div>
          </div>
          <span>${coherence.toFixed(2)}</span>
        </div>
      </div>
    </a>`;
  }).join('\n');
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ── Step 8: Build layer grid ──
function buildLayerGrid() {
  let layersData;
  const layersFile = path.join(STATIC_DIR, 'data', 'layers.json');
  if (fs.existsSync(layersFile)) {
    layersData = JSON.parse(fs.readFileSync(layersFile, 'utf-8'));
  } else {
    // Default layer configuration
    layersData = {};
    for (let i = 1; i <= 18; i++) {
      const id = `L${String(i).padStart(2, '0')}`;
      let status = 'planned';
      if (i >= 4 && i <= 11) status = 'active';
      if ([3, 12, 13, 14].includes(i)) status = 'partial';
      layersData[id] = { status };
    }
  }

  let cells = '';
  for (let i = 1; i <= 18; i++) {
    const id = `L${String(i).padStart(2, '0')}`;
    const layer = layersData[id] || { status: 'planned' };
    cells += `<div class="layer-cell ${layer.status}" title="${id}">${id}</div>\n`;
  }
  return cells;
}

// ── Step 9: Build activity feed ──
function buildActivityFeed() {
  const actFile = path.join(STATIC_DIR, 'data', 'activity.json');
  let items = [];

  if (fs.existsSync(actFile)) {
    try { items = JSON.parse(fs.readFileSync(actFile, 'utf-8')); } catch(e) {}
  }

  if (items.length === 0) {
    items = [
      { type: 'system', detail: 'draken.info deployed', time: new Date().toISOString(), status: 'green' },
      { type: 'system', detail: 'Build pipeline initialized', time: new Date().toISOString(), status: 'green' },
      { type: 'system', detail: 'Awaiting first KO index', time: new Date().toISOString(), status: 'gold' },
    ];
  }

  return items.slice(0, 8).map(item => {
    const dotClass = `dot-${item.status || 'gray'}`;
    const ago = timeAgo(item.time);
    return `<div class="activity-item"><span class="dot ${dotClass}"></span>${item.detail}<span class="activity-time">— ${ago}</span></div>`;
  }).join('\n');
}

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// ── Step 10: Generate sitemap ──
function generateSitemap(posts) {
  const base = 'https://draken.info';
  const urls = [
    `<url><loc>${base}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`,
    ...posts.map(p =>
      `<url><loc>${base}/posts/${p.slug}/</loc><lastmod>${new Date(p.date).toISOString().split('T')[0]}</lastmod><priority>0.8</priority></url>`
    )
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
}

// ── Step 11: Generate JSON-LD for posts ──
function postJsonLd(post) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    "headline": post.title,
    "datePublished": new Date(post.date).toISOString(),
    "author": {
      "@type": "Organization",
      "name": post.author || "Khrug Engineering"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Draken 2045 Initiative",
      "url": "https://draken.info"
    },
    "description": post.excerpt || '',
    "keywords": (post.tags || []).join(', '),
    "url": `https://draken.info/posts/${post.slug}/`
  });
}

// ═══ MAIN BUILD ═══
function build() {
  console.log('╔══════════════════════════════════════╗');
  console.log('║  draken.info — building...           ║');
  console.log('╚══════════════════════════════════════╝');

  // Clean
  cleanDist();

  // Read data
  const posts = readPosts();
  const sys = readSystemData();

  // Update pub_count from actual posts
  sys.pub_count = posts.length;

  console.log(`  Posts found: ${posts.length}`);
  console.log(`  Phase: ${sys.phase}`);
  console.log(`  Coherence: ${sys.global_coherence}`);

  // Load templates
  const baseTpl = loadTemplate('base.html');
  const indexTpl = loadTemplate('index.html');
  const postTpl = loadTemplate('post.html');

  // Build index page
  const indexContent = render(indexTpl, {
    cards: buildCards(posts),
    ko_count: sys.ko_count,
    ko_embedded: sys.ko_count,		
    global_coherence: sys.global_coherence.toFixed(3),
    pub_count: sys.pub_count,
    active_layers: sys.active_layers,
    phase: sys.phase,
    layer_grid_enhanced: buildEnhancedLayerGrid(getSystemData()),
    activity_feed: buildActivityFeed(),
  });

  const indexPage = render(baseTpl, {
    title: 'Draken 2045 — Topological Knowledge Architecture',
    description: 'The Draken 2045 Initiative — a research framework for structured knowledge assembly, automated publication, and meaning-coherence analysis grounded in sheaf-theoretic topology.',
    content: indexContent,
    og_type: 'website',
    og_url: 'https://draken.info/',
    og_image: 'https://draken.info/images/og-v2.png',
    jsonld: '',
  });

  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), indexPage);
  console.log('  ✓ index.html');

  // Build individual post pages
  const postsDir = path.join(DIST_DIR, 'posts');
  fs.mkdirSync(postsDir, { recursive: true });

  for (const post of posts) {
    const postDir = path.join(postsDir, post.slug);
    fs.mkdirSync(postDir, { recursive: true });

    const postContent = render(postTpl, {
      title: post.title,
      tag: (post.tags && post.tags[0]) || 'technical',
      tagClass: tagClass((post.tags && post.tags[0]) || 'technical'),
      drk: post.drk || '',
      date: formatDate(post.date),
      author: post.author || 'Khrug Engineering',
      layers: (post.layers || []).join(' · '),
      coherence: (post.coherence || 0).toFixed(2),
      body: post.content,
    });

    const postPage = render(baseTpl, {
      title: `${post.title} — Draken 2045`,
      description: post.excerpt || '',
      content: postContent,
      og_type: 'article',
      og_url: `https://draken.info/posts/${post.slug}/`,
      og_image: 'https://draken.info/images/og-v2.png',
      jsonld: `<script type="application/ld+json">${postJsonLd(post)}</script>`,
    });

    fs.writeFileSync(path.join(postDir, 'index.html'), postPage);
    console.log(`  ✓ posts/${post.slug}/`);
  }

  // Copy static assets
  copyDirSync(path.join(STATIC_DIR, 'data'), path.join(DIST_DIR, 'data'));
  copyDirSync(path.join(STATIC_DIR, 'images'), path.join(DIST_DIR, 'images'));
  fs.copyFileSync(path.join(__dirname, 'style.css'), path.join(DIST_DIR, 'style.css'));
  console.log('  ✓ static assets');

  // Generate sitemap
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), generateSitemap(posts));
  console.log('  ✓ sitemap.xml');

  // Generate robots.txt
  fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'),
    'User-agent: *\nAllow: /\nSitemap: https://draken.info/sitemap.xml\n');
  console.log('  ✓ robots.txt');

  console.log('\n  Build complete. Output: dist/');
}

// ── Utility: recursive copy ──
function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}
// ── Additional pages (v2 update) ──
const { buildEnhancedLayerGrid, buildThesisPage, buildSheafGamePage, getSystemData } = require('./build-patch');
buildThesisPage();
buildSheafGamePage();

// Run
build();
