/**
 * scripts/watertightness.js — structural soundness score W for the corpus (W v1)
 *
 * W is NOT Γ and must never be labelled as Γ. It measures whether things are defined,
 * connected and referenced — the internal logic and factual grounding of the corpus, not
 * whether the arguments are true.
 *
 * Components, each a ratio in [0, 1]:
 *   c1 reference integrity   internal /posts/ links and DRK citations resolving to exactly one published post
 *   c2 definition coverage   heavily used terms that have an approved KO
 *   c3 KO closure            approved KOs whose relations point only to approved KOs, with no depends_on cycle
 *   c4 reuse                 approved KOs used beyond their defining post
 *   (c5 falsifiability was removed in W v2; the number is not reused)
 *   c6 connectivity          posts in the largest connected component of the citation graph
 *   c7 references behind claims (load-bearing, weight 3)
 *
 *   W = (c7^3 · c1 · c2 · c3 · c4 · c6)^(1/8)        weighted geometric mean
 *
 * A component at zero makes W zero: a leak cannot be averaged away. A component with an empty
 * denominator is "n/a" and is dropped (the exponent is renormalised); this is reported.
 *
 * Per post, only the post-level components apply: W_post = (c7^3 · c1 · c6)^(1/5).
 *
 * History: W v1 (2026-10-01) also contained c5 = posts with a falsification block. Removed in
 * W v2 (2026-10-01) at Khrug's decision: W measures internal logic and factualness only; the
 * post standard's falsification section is no longer scored.
 *
 * Changing thresholds or patterns after seeing results requires a new version (W v2),
 * documented like a DRK post. Until Khrug has marked the c7 tuning sample, W is provisional.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const VERSION = 'W v2';
const C7_TUNED = true; // tuned against docs/w-c7-tuning-sample.md (2026-10-01); patterns frozen since W v1, unchanged in W v2
const WEIGHTS = { c1: 1, c2: 1, c3: 1, c4: 1, c6: 1, c7: 3 };
const LABELS = {
  c1: 'Reference integrity', c2: 'Definition coverage', c3: 'KO closure', c4: 'KO reuse',
  c6: 'Connectivity', c7: 'References behind claims',
};

// ── c7 patterns (W v1, untuned) ──
const CLAIM_WORDS = /\b(stud(y|ies)|showed|shown|shows|found|finds|measured|measures|reported|reports|according to|evidence|data|studie[rn]?|visade|visar|fann|uppmätt|enligt|belägg)\b/i;
const NUMBER = /(^|[^\p{L}\p{N}§.-])\d+(?:[.,]\d+)?\s?%?(?![\p{L}\p{N}])/u;
const CITE_PATTERNS = [
  /\[\d+(?:[,–-]\s*\d+)*\]/,                                                     // [n]
  /\([^()]*\p{Lu}[\p{L}'’-]+[^()]*,?\s(?:1[5-9]|20)\d{2}[a-z]?\b[^()]*\)/u,          // (Author Year), (Author & Author 1996; ...)
  /\p{Lu}[\p{L}'’-]+(?:\s(?:&|and|och)\s\p{Lu}[\p{L}'’-]+)?(?:\set al\.?)?\s\((?:1[5-9]|20)\d{2}[a-z]?\)/u, // Author (Year)
  /\bet al\b/i,
  /\p{Lu}[\p{L}'’-]+(?:\s(?:&|and|och)\s\p{Lu}[\p{L}'’-]+)?['’]s?\s(?:1[5-9]|20)\d{2}\b/u,       // Author's 2008 / Author and Author's 2008
  /doi\.org|\bdoi:\s?10\.|\b10\.\d{4,9}\//i,                                       // DOI (not the bare word)
  /\barXiv:\s?\d|arxiv\.org/i,                                                 // arXiv id or URL
  /\]\(https?:\/\//,                                                             // external Markdown link
];
const LEDGER_EXEMPT = /\*\*\[(?:D|M)(?:\/[A-Z])?\]\*\*|\*\*\[[A-Z]\/(?:D|M)\]\*\*/; // [D]/[M] claims need no external source (post standard §6)

const SOURCE_STOP = new Set('The This That And With From Into Over Under Journal University Press Proceedings Review Letters Nature Science Studies Studio Edition Ordbok Svenska Akademiens Oxford Cambridge Springer Elsevier Wiley Routledge Preprint Available Retrieved Online Volume Chapter Book Books Library Institute Society Academy American British National International Annual Physical Physics Social Advances Theory Introduction Foundations Handbook'.split(' '));

function sourceNames(sources) {
  const names = new Set();
  for (const s of (Array.isArray(sources) ? sources : [])) {
    const head = String(s).split(/\(\s*(?:1[5-9]|20)\d{2}|\b(?:1[5-9]|20)\d{2}\b/)[0];
    for (const w of head.match(/\p{Lu}[\p{L}'’-]{3,}/gu) || []) if (!SOURCE_STOP.has(w)) names.add(w);
  }
  return [...names];
}

// Split a post body into prose paragraphs, skipping headings, tables, math, code, references and footer
function paragraphs(raw) {
  let t = String(raw || '').replace(/\r/g, '');
  t = t.replace(/```[\s\S]*?```/g, '\n\n').replace(/\$\$[\s\S]*?\$\$/g, '\n\n');
  const refHead = t.search(/^#{1,3}\s*(?:§?\d*\.?\s*)?(References|Referenser|Källor|Sources|Bibliography)\b.*$/mi);
  if (refHead >= 0) t = t.slice(0, refHead);
  return t.split(/\n\s*\n/).map(p => p.trim()).filter(p => {
    if (!p) return false;
    if (/^#{1,6}\s/.test(p)) return false;                 // heading
    if (/^\|/.test(p) || /\n\|/.test(p)) return false;    // table
    if (/^(?:-{3,}|\*{3,}|_{3,})$/.test(p)) return false; // rule
    if (/^!\[/.test(p) || /^</.test(p)) return false;      // image / HTML
    if (/^\*[^*]/.test(p) && /ORCID|Operators?:|Crosslinks?:|Korslänkar|DOI 10\.5281|CC BY-SA/i.test(p)) return false; // footer
    if (/^\*\*Epistemic ledger/.test(p)) return false;
    if (/^\*(?:Figure|Fig\.|Table|Figur|Tabell)\s?\d/i.test(p)) return false; // figure/table caption
    return true;
  });
}

function stripForClaim(p) {
  return p.replace(/^\s*\d+[.)]\s/gm, ' ')                       // list numbering
    .replace(/[→=≈<>≤≥]\s?-?\d+(?:[.,]\d+)?/g, ' ')              // formula values (Ψ → 1)
    .replace(/\b\d+(?:[.,]\d+)?-(?=\p{L})/gu, ' ')                // number-word compounds (18-layer)
    .replace(/\$[^$\n]+\$/g, ' ')
    .replace(/\bDRK-\d{3}[a-z]?\b/gi, ' ').replace(/\bL(?:0[1-9]|1[0-8])\b/g, ' ')
    .replace(/§\s?\d+(?:\.\d+)*/g, ' ').replace(/\[[^\]]*\]\([^)]*\)/g, m => m.replace(/\]\([^)]*\)$/, ']'))
    .replace(/\b(?:Figure|Fig\.|Table|Figur|Tabell)\s?\d+/gi, ' ').replace(/\bV\.\d\b/g, ' ').replace(/\b[A-Z]\d\b/g, ' ');
}

function classify(p, names) {
  const s = stripForClaim(p);
  const claim = NUMBER.test(s) || CLAIM_WORDS.test(s);
  if (!claim) return { claim: false };
  const exempt = LEDGER_EXEMPT.test(p);
  const cited = CITE_PATTERNS.some(re => re.test(p)) || names.some(n => p.includes(n));
  return { claim: true, referenced: cited || exempt, exempt };
}

function hasFalsification(raw) {
  return /^#{1,4}\s.*falsif/im.test(raw) || /^\*\*[^*\n]*falsif[^*\n]*\*\*/im.test(raw);
}

function geo(components) {
  let num = 0, den = 0;
  const na = [];
  for (const [k, v] of Object.entries(components)) {
    if (v == null || isNaN(v)) { na.push(k); continue; }
    const w = WEIGHTS[k];
    if (v <= 0) return { W: 0, na };
    num += w * Math.log(v); den += w;
  }
  return { W: den ? Math.exp(num / den) : null, na };
}
const ratio = (a, b) => (b ? a / b : null);
const r3 = x => (x == null ? null : Math.round(x * 1000) / 1000);

function koClosure(kos) {
  const ids = new Set(kos.map(k => k.id));
  const dep = new Map(kos.map(k => [k.id, (k.depends_on || []).filter(d => ids.has(d))]));
  const inCycle = new Set();
  const state = new Map();
  const visit = (id, stack) => {
    if (state.get(id) === 2) return;
    if (state.get(id) === 1) { for (const x of stack.slice(stack.indexOf(id))) inCycle.add(x); return; }
    state.set(id, 1); stack.push(id);
    for (const d of dep.get(id) || []) visit(d, stack);
    stack.pop(); state.set(id, 2);
  };
  for (const id of ids) visit(id, []);
  const open = [];
  const closed = kos.filter(k => {
    const rel = [...(k.depends_on || []), ...(k.refines || []), ...(k.tension_with || [])];
    const ok = rel.every(r => ids.has(r)) && !inCycle.has(k.id);
    if (!ok) open.push(k.id);
    return ok;
  });
  return { closed: closed.length, total: kos.length, open, cycles: [...inCycle] };
}

/**
 * @param posts  published posts (slug, drk, date, sources, rawContent)
 * @param map    output of buildCorpusMap (posts[].cites, edges)
 * @param ko     output of computeKO
 * @param heavy  heavily used terms [{id,label,n}]
 * @param archived  Set of archived slugs (v1/<slug>) that also resolve
 */
function computeW(posts, map, ko, heavy, archived = new Set()) {
  const slugs = new Set(posts.map(p => p.slug));
  const drkCount = new Map();
  for (const p of posts) if (p.drk) drkCount.set(p.drk, (drkCount.get(p.drk) || 0) + 1);

  // c6: largest connected component of the citation graph (citation links only: semantic
  // neighbour edges connect every post by construction and would make c6 meaningless)
  const ix = new Map(map.posts.map((p, i) => [p.id, i]));
  const parent = map.posts.map((_, i) => i);
  const find = i => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  for (const e of map.edges) if (e.link) parent[find(e.s)] = find(e.t);
  const compSize = new Map();
  map.posts.forEach((_, i) => compSize.set(find(i), (compSize.get(find(i)) || 0) + 1));
  const biggest = [...compSize.entries()].sort((a, b) => b[1] - a[1])[0];
  const inLargest = slug => ix.has(slug) && find(ix.get(slug)) === biggest[0];

  const leaks = { c1: [], c6: [], c7: [] };
  const perPost = {};
  let refsOk = 0, refsAll = 0, claimsAll = 0, claimsRef = 0, connected = 0;
  const sample = [];

  for (const p of posts) {
    const raw = String(p.rawContent || '');
    // c1
    const targets = new Set();
    for (const m of raw.matchAll(/\]\((?:https?:\/\/(?:www\.)?draken\.info)?\/posts\/([a-z0-9-]+(?:\/[a-z0-9-]+)?)\/?(?:#[^)]*)?\)/g)) targets.add('slug:' + m[1]);
    for (const m of raw.matchAll(/\bDRK-(\d{3})\b/g)) targets.add('drk:DRK-' + m[1]);
    let ok = 0;
    for (const t of targets) {
      const [kind, v] = t.split(/:(.+)/);
      const good = kind === 'slug' ? (slugs.has(v) || archived.has(v)) : drkCount.get(v) === 1;
      if (good) ok++; else leaks.c1.push({ post: p.slug, ref: kind === 'slug' ? `/posts/${v}/` : v, reason: kind === 'slug' ? 'no such post' : (drkCount.get(v) ? 'DRK number used by several posts' : 'no post has this DRK number') });
    }
    refsOk += ok; refsAll += targets.size;
    const f = hasFalsification(raw); // informational only since W v2
    // c6
    const conn = inLargest(p.slug);
    if (conn) connected++; else leaks.c6.push({ post: p.slug });
    // c7
    const names = sourceNames(p.sources);
    let pc = 0, pr = 0;
    paragraphs(raw).forEach((para, k) => {
      const c = classify(para, names);
      if (!c.claim) return;
      pc++; if (c.referenced) pr++;
      else leaks.c7.push({ post: p.slug, paragraph: k + 1, text: para.slice(0, 160).replace(/\s+/g, ' ') });
      sample.push({ post: p.slug, slug: p.slug, drk: p.drk, paragraph: k + 1, referenced: c.referenced, exempt: !!c.exempt, text: para });
    });
    claimsAll += pc; claimsRef += pr;

    const comp = { c1: ratio(ok, targets.size), c6: conn ? 1 : 0, c7: ratio(pr, pc) };
    const g = geo(comp);
    perPost[p.slug] = {
      W: r3(g.W), components: Object.fromEntries(Object.entries(comp).map(([k, v]) => [k, r3(v)])), na: g.na,
      detail: { refs: `${ok}/${targets.size}`, claims: `${pr}/${pc}`, falsification: f, connected: conn },
    };
  }

  // KO components: strict (approved only) and projected (if every proposed KO were approved)
  const koPart = list => {
    const ids = new Set(list.map(k => k.map_concept).filter(Boolean));
    const covered = heavy.filter(h => ids.has(h.id));
    const cl = koClosure(list);
    const reused = list.filter(k => k.usage && k.usage.reused_in > 0);
    return {
      c2: ratio(covered.length, heavy.length), c3: ratio(cl.closed, cl.total), c4: ratio(reused.length, list.length),
      detail: { covered: covered.map(h => h.id), uncovered: heavy.filter(h => !ids.has(h.id)).map(h => `${h.label} [${h.n} posts]`), open: cl.open, cycles: cl.cycles, not_reused: list.filter(k => !(k.usage && k.usage.reused_in > 0)).map(k => k.id) },
    };
  };
  const strictKO = koPart(ko.kos.filter(k => k.status === 'approved' && k.usage && k.usage.definition_verified));
  const projKO = koPart(ko.kos.filter(k => k.usage && k.usage.definition_verified));

  const base = { c1: ratio(refsOk, refsAll), c6: ratio(connected, posts.length), c7: ratio(claimsRef, claimsAll) };
  const strict = { c1: base.c1, c2: strictKO.c2, c3: strictKO.c3, c4: strictKO.c4, c6: base.c6, c7: base.c7 };
  const projected = { ...strict, c2: projKO.c2, c3: projKO.c3, c4: projKO.c4 };
  const gs = geo(strict), gp = geo(projected);

  return {
    version: VERSION,
    status: C7_TUNED ? 'final' : 'provisional: c7 patterns not yet tuned',
    formula: 'W = (c7^3 · c1 · c2 · c3 · c4 · c6)^(1/8); W_post = (c7^3 · c1 · c6)^(1/5); n/a components dropped',
    W: r3(gs.W),
    na: gs.na,
    W_if_proposed_approved: r3(gp.W),
    components: Object.fromEntries(Object.entries(strict).map(([k, v]) => [k, { label: LABELS[k], value: r3(v), weight: WEIGHTS[k] }])),
    projected_components: { c2: r3(projected.c2), c3: r3(projected.c3), c4: r3(projected.c4) },
    counts: {
      c1: `${refsOk}/${refsAll} references resolve`, c6: `${connected}/${posts.length} posts (largest of ${compSize.size} components)`,
      c7: `${claimsRef}/${claimsAll} claim paragraphs`, c2: `${strictKO.detail.covered.length}/${heavy.length} heavily used terms`,
    },
    leaks: { ...leaks, c2: strictKO.detail.uncovered, c3: strictKO.detail.open, c4: strictKO.detail.not_reused, projected: projKO.detail },
    perPost,
    _sample: sample,
  };
}

function writeW(w, distDir) {
  const dataDir = path.join(distDir, 'data');
  fs.mkdirSync(dataDir, { recursive: true });
  const { _sample, ...out } = w;
  fs.writeFileSync(path.join(dataDir, 'watertightness.json'), JSON.stringify({ generated: new Date().toISOString(), ...out }, null, 2));
}

function report(w) {
  const c = Object.entries(w.components).map(([k, v]) => `${k} ${v.value == null ? 'n/a' : v.value.toFixed(2)}`).join(' · ');
  console.log(`  ✓ data/watertightness.json (${w.version}, ${w.status}): W = ${w.W == null ? 'n/a' : w.W.toFixed(3)} [${c}]; if proposed KOs approved: ${w.W_if_proposed_approved}`);
}

// Deterministic tuning sample for c7: half flagged-unreferenced, half referenced
function tuningSample(w, n = 20) {
  const pick = (arr, k) => { const out = []; const step = Math.max(1, Math.floor(arr.length / k)); for (let i = 0; i < arr.length && out.length < k; i += step) out.push(arr[i]); return out; };
  const unref = w._sample.filter(s => !s.referenced), ref = w._sample.filter(s => s.referenced);
  return [...pick(unref, Math.ceil(n / 2)), ...pick(ref, Math.floor(n / 2))];
}

module.exports = { computeW, writeW, report, tuningSample, paragraphs, classify, VERSION, LABELS };
