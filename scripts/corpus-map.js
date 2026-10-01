/**
 * scripts/corpus-map.js
 * Builds the Corpus Map data (dist/data/corpus-map.json) and page (dist/map/index.html + app.js)
 * from the same posts array that build.js publishes. No extra npm dependencies.
 *
 * Inputs it relies on, all from readPosts() in build.js:
 *   slug, title, date, drk, layers, tags, excerpt, rawContent
 * Anything malformed (layers as a string, drk without prefix, BOM) is tolerated, not fatal.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const STOP = new Set((
  'a about above after again against all also am an and any are as at be because been before being below between both but by can could did do does doing down during each few for from further had has have having he her here hers herself him himself his how i if in into is it its itself just me more most my myself no nor not now of off on once only or other our ours out over own same she should so some such than that the their theirs them themselves then there these they this those through to too under until up very was we were what when where which while who whom why will with would you your yours yourself ' +
  'one two three first second may might must make makes made like way thing things see note example et al within across different point says said e g i ' +
  'och att det som en på är av för med till den har de inte om ett men var jag sig så vi kan man när eller nu ska hade kommer hur mot under där vid efter dem utan sin sina alla detta denna dessa vara bli blir också bara mycket ' +
  'gör från varje samma ingen två lokala dess sitt vår våra deras hela redan ' +
  'info khrug text draken drk section sections post posts framework layer layers figure fig coherence sheaf sheaves'
).split(/\s+/));

function cleanText(b) {
  return String(b || '')
    .replace(/^\uFEFF/, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\$\$[\s\S]*?\$\$/g, ' ')
    .replace(/\$[^$\n]{1,200}\$/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[#*_>|`]/g, ' ');
}

function tokens(text) {
  const raw = cleanText(text).toLowerCase().match(/\p{L}[\p{L}]{2,}(?:-\p{L}{2,})?/gu) || [];
  const t = raw.filter(w => !STOP.has(w) && !w.startsWith('drk'));
  const out = t.slice();
  for (let i = 0; i + 1 < t.length; i++) out.push(t[i] + ' ' + t[i + 1]);
  return out;
}

function tfidf(docs) {
  const n = docs.length, df = new Map(), tfs = [];
  for (const d of docs) {
    const tf = new Map();
    for (const w of tokens(d)) tf.set(w, (tf.get(w) || 0) + 1);
    tfs.push(tf);
    for (const w of tf.keys()) df.set(w, (df.get(w) || 0) + 1);
  }
  const maxDf = 0.45 * n;
  return tfs.map(tf => {
    const v = new Map(); let norm = 0;
    for (const [w, c] of tf) {
      const f = df.get(w);
      if (f < 2 || f > maxDf) continue;
      const x = (1 + Math.log(c)) * (Math.log((1 + n) / (1 + f)) + 1);
      v.set(w, x); norm += x * x;
    }
    norm = Math.sqrt(norm) || 1;
    for (const [w, x] of v) v.set(w, x / norm);
    return v;
  });
}

function cosine(a, b) {
  if (a.size > b.size) [a, b] = [b, a];
  let s = 0;
  for (const [w, x] of a) { const y = b.get(w); if (y) s += x * y; }
  return s;
}

function topTerms(vec, k) {
  const sorted = [...vec.entries()].sort((p, q) => q[1] - p[1]);
  const out = [];
  for (const [w] of sorted) {
    if (out.some(s => s.includes(w) || w.includes(s))) continue;
    out.push(w);
    if (out.length === k) break;
  }
  return out;
}

// ── Louvain community detection (weighted, deterministic seed) ──
function rng(seed) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function louvain(n, edgeList, resolution, seed) {
  const rand = rng(seed || 7);
  let member = Array.from({ length: n }, (_, i) => i);
  let N = n;
  let adj = Array.from({ length: N }, () => new Map());
  for (const [i, j, w] of edgeList) {
    if (i === j || !(w > 0)) continue;
    adj[i].set(j, (adj[i].get(j) || 0) + w);
    adj[j].set(i, (adj[j].get(i) || 0) + w);
  }
  let self = new Array(N).fill(0);
  for (let level = 0; level < 10; level++) {
    const k = adj.map((m, i) => { let s = self[i]; for (const w of m.values()) s += w; return s; });
    const m2 = k.reduce((a, b) => a + b, 0);
    if (m2 === 0) break;
    const comm = Array.from({ length: N }, (_, i) => i);
    const tot = k.slice();
    let moved = false, improved = true, guard = 0;
    while (improved && guard++ < 50) {
      improved = false;
      const order = Array.from({ length: N }, (_, i) => i);
      for (let i = N - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
      for (const i of order) {
        const ci = comm[i];
        const kin = new Map();
        for (const [j, w] of adj[i]) kin.set(comm[j], (kin.get(comm[j]) || 0) + w);
        tot[ci] -= k[i];
        let best = ci, bestGain = (kin.get(ci) || 0) - resolution * tot[ci] * k[i] / m2;
        for (const [c, win] of kin) {
          const g = win - resolution * tot[c] * k[i] / m2;
          if (g > bestGain + 1e-12) { bestGain = g; best = c; }
        }
        tot[best] += k[i];
        if (best !== ci) { comm[i] = best; improved = true; moved = true; }
      }
    }
    if (!moved) break;
    const ids = new Map(); let c = 0;
    for (const x of comm) if (!ids.has(x)) ids.set(x, c++);
    member = member.map(v => ids.get(comm[v]));
    const nadj = Array.from({ length: c }, () => new Map());
    const nself = new Array(c).fill(0);
    for (let i = 0; i < N; i++) {
      const a = ids.get(comm[i]);
      nself[a] += self[i];
      for (const [j, w] of adj[i]) {
        const b = ids.get(comm[j]);
        if (a === b) nself[a] += w;
        else nadj[a].set(b, (nadj[a].get(b) || 0) + w);
      }
    }
    adj = nadj; self = nself; N = c;
  }
  return member;
}

// ── Concepts: fixed search patterns, counted per post ──
const CONCEPTS = [
  ['gamma', 'Γ coherence', 'op', 'Γ|\\bcoheren(ce|t)\\b', 4],
  ['psi', 'Ψ self-reference', 'op', 'Ψ|self-referen', 2],
  ['kt', 'K(t) coherence debt', 'op', 'K\\(t\\)|coherence debt', 2],
  ['h1', 'H¹ obstruction', 'op', 'H¹|H\\^1|H\\^\\{1\\}|\\bobstruction', 2],
  ['kappa', 'ϰ invariant', 'op', 'ϰ|Draken invariant', 1],
  ['rho', 'ρ restriction map', 'op', 'restriction map|restriction morphism|\\\\rho|ρ', 3],
  ['care', 'Care operator', 'op', 'care operator|V̇|\\\\dot\\{V\\}', 1],
  ['gluing', 'Global section, gluing', 'op', 'global section|\\bglu(e|es|ed|ing)\\b', 3],
  ['laplacian', 'Sheaf Laplacian', 'op', 'sheaf Laplacian|Hansen|Ghrist', 1],
  ['antitot', 'Anti-totalization', 'op', 'anti-totali[sz]|totali[sz]ation|totalitarian', 2],
  ['carrier', 'Carrier / cargo', 'op', '\\bcarrier|\\bcargo\\b', 3],
  ['clinch', 'Clinch & display', 'op', '\\bclinch|display phase|\\bdisplay\\b', 3],
  ['launder', 'Source laundering', 'op', 'launder', 1],
  ['kayfabe', 'Kayfabe', 'op', 'kayfabe', 1],
  ['keeper', 'Keeper-function', 'op', 'keeper', 2],
  ['falsif', 'Falsification', 'op', 'falsif', 3],
  ['pattern', 'Pattern', 'theme', '\\bpatterns?\\b', 5],
  ['algorithm', 'Algorithm in substrate', 'theme', 'algorithm', 2],
  ['substrate', 'Substrate', 'theme', 'substrate', 4],
  ['ca', 'Cellular automata', 'theme', 'cellular automat|automaton', 1],
  ['evolution', 'Evolution & selection', 'theme', 'evolution|natural selection|fitness', 4],
  ['code', 'Code & genome', 'theme', '\\bgenom|genetic|\\bDNA\\b|\\bcode\\b', 3],
  ['conscious', 'Consciousness', 'theme', 'conscious', 3],
  ['software', 'Software & simulation', 'theme', 'software|simulat', 3],
  ['attention', 'Attention', 'theme', '\\battention', 3],
  ['training', 'Training & learning', 'theme', '\\btrain(ing|ed)?\\b|\\blearning\\b', 3],
  ['predict', 'Prediction, free energy', 'theme', 'free energy|predictive|Friston|active inference|prediction error', 2],
  ['bioelec', 'Bioelectric morphogenesis', 'theme', 'bioelectric|Levin\\b|morphogen', 2],
  ['protocol', 'Protocol & ESS', 'theme', '\\bESS\\b|evolutionarily stable|\\bprotocol', 3],
  ['signal', 'Honest signal', 'theme', 'honest signal|costly signal|signal(l)?ing', 3],
  ['boundary', 'Boundary & liminality', 'theme', 'boundar|liminal|\\bborder|\\bfence', 3],
  ['time', 'Time & synchrony', 'theme', 'simultaneit|synchron|\\bclock', 3],
  ['varanid', 'Varanids', 'domain', 'varan|monitor lizard|Komodo|lizard', 3],
  ['dragon', 'Dragon', 'domain', '\\bdragons?\\b|\\bdrake\\b', 3],
  ['etym', 'Etymology', 'domain', 'etymolog|Hellquist|Proto-Germanic|\\bPIE\\b|Old Norse', 2],
  ['myth', 'Myth', 'domain', '\\bmyth|Fenrir|Anubis|Ragnar|\\bOdin|Týr', 2],
  ['theology', 'Theology & Kabbalah', 'domain', 'Kabbal|Lurian|theolog|\\bGod\\b|scripture', 3],
  ['buddh', 'Buddhism & Tao', 'domain', 'Buddh|Nagarjuna|Nāgārjuna|\\bTao|\\bDao\\b|\\bZen\\b|emptiness', 2],
  ['thermo', 'Thermodynamics', 'domain', 'entrop|thermodynam', 3],
  ['quantum', 'Quantum physics', 'domain', 'quantum', 3],
  ['topology', 'Topology & cohomology', 'domain', 'topolog|cohomolog|holonomy|homotop', 3],
  ['ai', 'AI & language models', 'domain', '\\bAI\\b|\\bLLM|language model|\\balignment', 3],
  ['power', 'Power, state, empire', 'domain', 'sovereign|imperial|empire|\\bstate power|authoritarian|dynast', 3],
  ['econ', 'Economy & capital', 'domain', 'econom|\\bmarket|capital(ism|ist)?\\b', 4],
  ['war', 'War & information war', 'domain', '\\bwar\\b|warfare|military', 3],
  ['marx', 'Marx & Lenin', 'domain', 'Lenin|Marx|Trotsk', 2],
  ['neuro', 'Neuroscience', 'domain', 'neuron|cortex|cortical|hippocamp|neural', 3],
  ['mouth', 'Mouth & bite', 'domain', '\\bmouths?\\b|\\bbite\\b|\\bjaw', 3],
];

// Layer names as tabled in the corpus (DRK-105). The thesis v4.4 is authoritative; edit here if they differ.
const LAYERS = { L01: 'Quantum Field Substrate', L02: 'Chemical Thermodynamics', L03: 'Molecular Assembly', L04: 'Bioelectric Morphogenesis', L05: 'Neural Integration', L06: 'Embodied Cognition', L07: 'Narrative Self', L08: 'Dyadic Signal', L09: 'Group Cognition', L10: 'Social Coordination', L11: 'Community Dynamics', L12: 'National Narrative', L13: 'Political Structure', L14: 'Economic Topology', L15: 'Cultural Narrative Field', L16: 'Institutional Morphology', L17: 'Civilizational Memory', L18: 'Planetary Cognition' };

function drkKey(v) {
  const m = String(v == null ? '' : v).match(/(\d{3})([a-z])?/i);
  return m ? (m[1] + (m[2] || '')).toLowerCase() : null;
}
function drkLabel(v) {
  if (v == null || v === '') return '';
  const s = String(v).trim();
  return /^DRK-/i.test(s) ? s.toUpperCase() : 'DRK-' + s;
}
function isoDate(d) {
  const t = new Date(d);
  return isNaN(t) ? '' : t.toISOString().slice(0, 10);
}
function trimExcerpt(s) {
  s = String(s || '').replace(/\s+/g, ' ').trim();
  if (s.length <= 420) return s;
  return s.slice(0, 410).replace(/\s+\S*$/, '').replace(/[,;:]$/, '') + '…';
}

// Heavily used terms for watertightness c2: the fixed formal-operator concepts ('op' lane)
// that occur (at their usual threshold) in at least `minPosts` posts. Independent of the KO
// registry, so approving KOs never moves the denominator.
function heavyTerms(posts, minPosts = 5) {
  const out = [];
  for (const [id, label, kind, rx, min] of CONCEPTS) {
    if (kind !== 'op') continue;
    const re = new RegExp(rx, /[ΓΨϰρ]|V̇/.test(rx) ? 'gu' : 'giu');
    const n = posts.filter(p => (String(p.rawContent || '').match(re) || []).length >= min).length;
    if (n >= minPosts) out.push({ id, label, n });
  }
  return out;
}

function buildCorpusMap(posts, distDir, staticDir, opts = {}) {
  const P = posts.slice().sort((a, b) => (isoDate(a.date) + drkKey(a.drk)).localeCompare(isoDate(b.date) + drkKey(b.drk)));
  const idx = new Map(P.map((p, i) => [p.slug, i]));
  const vecs = tfidf(P.map(p => p.rawContent || ''));
  const n = P.length;

  const E = new Map();
  const edge = (a, b) => { const k = a < b ? a + ':' + b : b + ':' + a; if (!E.has(k)) E.set(k, { s: Math.min(a, b), t: Math.max(a, b), sem: 0, link: 0 }); return E.get(k); };
  for (let i = 0; i < n; i++) {
    const sims = [];
    for (let j = 0; j < n; j++) if (j !== i) sims.push([j, cosine(vecs[i], vecs[j])]);
    sims.sort((a, b) => b[1] - a[1]);
    for (const [j, s] of sims.slice(0, 4)) if (s >= 0.10) { const e = edge(i, j); e.sem = Math.max(e.sem, Math.round(s * 1000) / 1000); }
  }
  const byDrk = new Map();
  P.forEach((p, i) => { const k = drkKey(p.drk); if (k) { if (!byDrk.has(k)) byDrk.set(k, []); byDrk.get(k).push(i); } });
  const cites = P.map(() => new Set());
  P.forEach((p, i) => {
    const raw = p.rawContent || '';
    for (const m of raw.matchAll(/\/posts\/([a-z0-9-]+)\/?/g)) { const j = idx.get(m[1]); if (j != null && j !== i) cites[i].add(j); }
    for (const m of raw.matchAll(/DRK-(\d{3}[a-z]?)/gi)) { const c = byDrk.get(m[1].toLowerCase()) || []; if (c.length === 1 && c[0] !== i) cites[i].add(c[0]); }
    for (const j of cites[i]) edge(i, j).link += 1;
  });
  const edges = [...E.values()];

  let comm = louvain(n, edges.map(e => [e.s, e.t, e.sem + 0.08 * Math.min(e.link, 2)]), 1.1, 7);
  const nb = Array.from({ length: n }, () => []);
  edges.forEach(e => { nb[e.s].push(e.t); nb[e.t].push(e.s); });
  const size = c => comm.filter(x => x === c).length;
  comm = comm.map((c, i) => {
    if (size(c) >= 3) return c;
    const o = nb[i].map(j => comm[j]).filter(x => x !== c && size(x) >= 3);
    if (!o.length) return c;
    const cnt = new Map(); o.forEach(x => cnt.set(x, (cnt.get(x) || 0) + 1));
    return [...cnt.entries()].sort((a, b) => b[1] - a[1])[0][0];
  });
  const order = [...new Set(comm)].sort((a, b) => size(b) - size(a) || a - b);
  const remap = new Map(order.map((c, i) => [c, i]));
  comm = comm.map(c => remap.get(c));

  let seeds = [];
  const namesFile = path.join(staticDir, 'data', 'corpus-map-names.json');
  if (fs.existsSync(namesFile)) { try { seeds = JSON.parse(fs.readFileSync(namesFile, 'utf-8').replace(/^\uFEFF/, '')).clusters || []; } catch (e) { console.warn('  ! corpus-map-names.json unreadable, using term labels'); } }
  const comms = order.map((_, ci) => {
    const members = P.map((p, i) => i).filter(i => comm[i] === ci);
    const cen = new Map();
    members.forEach(i => { for (const [w, x] of vecs[i]) cen.set(w, (cen.get(w) || 0) + x / members.length); });
    const terms = topTerms(cen, 4);
    const hit = seeds.find(s => members.some(i => P[i].slug === s.seed));
    return { id: ci, size: members.length, terms, name: hit ? hit.name : terms.slice(0, 3).join(', ') };
  });
  const used = new Set();
  comms.forEach(c => { if (used.has(c.name)) c.name = c.terms.slice(0, 3).join(', '); used.add(c.name); });

  const outPosts = P.map((p, i) => ({
    id: p.slug, drk: drkLabel(p.drk), title: String(p.title || p.slug), date: isoDate(p.date),
    layers: Array.isArray(p.layers) ? p.layers.filter(l => typeof l === 'string') : [],
    tags: Array.isArray(p.tags) ? p.tags.map(String) : [],
    excerpt: trimExcerpt(p.excerpt || p.description),
    words: String(p.rawContent || '').split(/\s+/).filter(Boolean).length,
    terms: topTerms(vecs[i], 8), cites: [...cites[i]].map(j => P[j].slug).sort(), comm: comm[i],
  }));

  // Concept lanes: once the KO registry has approved entries they replace the fixed 'op' lane;
  // themes and domains stay fixed. Each spec is {id, label, kind, count(text) -> n, min}.
  const fixed = CONCEPTS.map(([id, label, kind, rx, min]) => {
    const re = new RegExp(rx, /[ΓΨϰρ]|V̇/.test(rx) ? 'gu' : 'giu');
    return { id, label, kind, min, count: t => (t.match(re) || []).length };
  });
  const specs = opts.opConcepts && opts.opConcepts.length
    ? [...opts.opConcepts, ...fixed.filter(c => c.kind !== 'op')]
    : fixed;
  const concepts = [], clinks = [];
  for (const { id, label, kind, min, count } of specs) {
    const mem = [];
    outPosts.forEach((p, i) => {
      const c = count(String(P[i].rawContent || ''));
      if (c >= min) mem.push({ p: p.id, c: 'c:' + id, n: c, d: Math.round(c / Math.max(p.words, 1) * 100000) / 100, date: p.date });
    });
    if (mem.length < 2) continue;
    concepts.push({ id: 'c:' + id, label, kind, n: mem.length, first: mem.map(m => m.date).sort()[0] });
    mem.forEach(m => { delete m.date; clinks.push(m); });
  }

  const out = { generated: new Date().toISOString(), posts: outPosts, edges, comms, concepts, clinks, layers: LAYERS };
  const dataDir = path.join(distDir, 'data');
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(path.join(dataDir, 'corpus-map.json'), JSON.stringify(out));
  console.log(`  ✓ data/corpus-map.json (${n} posts, ${concepts.length} concepts, ${comms.length} clusters, ${edges.filter(e => e.link).length} citation links)`);
  return out;
}

function buildCorpusMapPage(opts) {
  const { baseTpl, render, distDir, staticDir } = opts;
  const src = path.join(staticDir, 'pages', 'corpus-map.html');
  let body = '<div class="article-wrap"><h1>Corpus Map</h1><p>static/pages/corpus-map.html is missing.</p></div>';
  if (fs.existsSync(src)) body = fs.readFileSync(src, 'utf-8').replace(/^\uFEFF/, '');
  const html = render(baseTpl, {
    title: 'Corpus Map — Draken 2045',
    description: 'Navigable map of the Draken corpus: posts, citations, shared vocabulary, clusters and concepts, with a timeline, drift walks and paths between ideas.',
    content: body, og_type: 'website', og_url: 'https://draken.info/map/',
    og_image: 'https://draken.info/images/og-v2.png', jsonld: '',
  });
  const dir = path.join(distDir, 'map');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  const app = path.join(staticDir, 'map', 'app.js');
  if (fs.existsSync(app)) fs.copyFileSync(app, path.join(dir, 'app.js'));
  else console.warn('  ! static/map/app.js missing: the map page will not run');
  console.log('  ✓ map/');
}

module.exports = { buildCorpusMap, buildCorpusMapPage, heavyTerms };
