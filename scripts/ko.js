/**
 * scripts/ko.js — KnowledgeObject registry v3 (static/data/ko.json)
 *
 * A KO is a term the corpus defines and then uses. The registry is kept by hand; this module
 * only checks it against the corpus and counts. Nothing here writes definitions.
 *
 * Per KO it computes: whether the quoted definition really occurs in the defining post, the
 * posts that use the term (name + aliases), first use, reuse beyond the defining post, and the
 * layers of the posts that use it. A KO counts on the front page only if it is approved AND
 * reused in at least one published post other than its defining post.
 *
 * Output: dist/data/ko.json (registry + computed usage) and a summary for build.js.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const SYMBOLIC = /[^\p{L}\p{N}\s'’-]/u; // aliases containing symbols/LaTeX are matched literally

function stripForMatch(raw) {
  // Drop frontmatter-free body noise that should not count as use: code blocks and URLs
  return String(raw || '').replace(/```[\s\S]*?```/g, ' ').replace(/https?:\/\/\S+/g, ' ');
}

function escRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

// Returns a function text -> number of matches for any of the KO's name/aliases
function matcher(ko) {
  const terms = [...new Set([...(ko.aliases || [])].map(String).filter(Boolean))];
  const literal = terms.filter(t => SYMBOLIC.test(t));
  const words = terms.filter(t => !SYMBOLIC.test(t));
  const wordRe = words.length
    ? new RegExp(`(?<![\\p{L}\\p{N}])(?:${words.map(escRe).join('|')})(?:s|es)?(?![\\p{L}\\p{N}])`, 'giu')
    : null;
  return text => {
    let n = 0;
    for (const t of literal) { let i = -1; while ((i = text.indexOf(t, i + 1)) !== -1) n++; }
    if (wordRe) n += (text.match(wordRe) || []).length;
    return n;
  };
}

function loadRegistry(staticDir) {
  const f = path.join(staticDir, 'data', 'ko.json');
  if (!fs.existsSync(f)) return { version: 0, kos: [] };
  try { return JSON.parse(fs.readFileSync(f, 'utf-8').replace(/^\uFEFF/, '')); }
  catch (e) { console.warn('  ! static/data/ko.json does not parse: ' + e.message); return { version: 0, kos: [] }; }
}

function isoDate(d) { const t = new Date(d); return isNaN(t) ? '' : t.toISOString().slice(0, 10); }

/**
 * @param posts    published posts from build.js (slug, drk, date, layers, rawContent)
 * @param staticDir
 * @param heavyTerms  [{id, label, n}] heavily used terms from the map (for gap reporting)
 */
function computeKO(posts, staticDir, heavyTerms = []) {
  const reg = loadRegistry(staticDir);
  const bySlug = new Map(posts.map(p => [p.slug, p]));
  const ids = new Set((reg.kos || []).map(k => k.id));
  const texts = posts.map(p => stripForMatch(p.rawContent));
  const perPost = new Map(posts.map(p => [p.slug, []]));
  const problems = [];

  const kos = (reg.kos || []).map(k => {
    const m = matcher(k);
    const def = k.defined_in || {};
    const defPost = bySlug.get(def.slug);
    const definitionVerified = !!(defPost && k.definition && String(defPost.rawContent || '').includes(k.definition));
    if (!defPost) problems.push(`${k.id}: defining post /posts/${def.slug}/ is not published`);
    else if (!definitionVerified) problems.push(`${k.id}: quoted definition not found verbatim in ${def.slug}`);
    if (defPost && def.drk && defPost.drk !== def.drk) problems.push(`${k.id}: defined_in.drk ${def.drk} but ${def.slug} is ${defPost.drk}`);
    for (const rel of ['depends_on', 'refines', 'tension_with'])
      for (const r of (k[rel] || [])) if (!ids.has(r)) problems.push(`${k.id}: ${rel} → "${r}" is not in the registry`);

    const used = [];
    posts.forEach((p, i) => { const n = m(texts[i]); if (n > 0) used.push({ slug: p.slug, drk: p.drk || '', date: isoDate(p.date), n }); });
    used.sort((a, b) => a.date.localeCompare(b.date));
    const reusedIn = used.filter(u => u.slug !== def.slug);
    const layersInUse = {};
    for (const u of used) for (const l of (bySlug.get(u.slug).layers || [])) layersInUse[l] = (layersInUse[l] || 0) + 1;
    for (const u of used) perPost.get(u.slug).push(k.id);

    const approved = k.status === 'approved';
    const reuse = reusedIn.length > 0;
    return {
      ...k,
      usage: {
        definition_verified: definitionVerified,
        posts: used.length,
        reused_in: reusedIn.length,
        first_use: used[0] ? { slug: used[0].slug, drk: used[0].drk, date: used[0].date } : null,
        used_in: used.map(u => u.slug),
        layers_in_use: Object.fromEntries(Object.entries(layersInUse).sort()),
      },
      counts: approved && reuse && definitionVerified,
      candidate: !reuse,
    };
  });

  const approved = kos.filter(k => k.status === 'approved');
  const counted = kos.filter(k => k.counts);
  const candidates = kos.filter(k => k.candidate).map(k => k.id);
  const covered = new Set(kos.map(k => k.map_concept).filter(Boolean));
  const gaps = heavyTerms.filter(t => !covered.has(t.id)).map(t => ({ concept: t.id, label: t.label, posts: t.n }));

  return {
    version: reg.version || 0,
    kos,
    perPost,
    summary: { total: kos.length, approved: approved.length, proposed: kos.length - approved.length, counted: counted.length, candidates, gaps, problems },
  };
}

// Concept specs for the Corpus Map from approved KOs (op lane), used once any are approved
function mapConceptsFromRegistry(ko) {
  return ko.kos.filter(k => k.status === 'approved').map(k => ({ id: k.id, label: k.name, kind: 'op', count: matcher(k), min: 1 }));
}

function writeKO(ko, distDir) {
  const dataDir = path.join(distDir, 'data');
  fs.mkdirSync(dataDir, { recursive: true });
  const out = { generated: new Date().toISOString(), version: ko.version, summary: ko.summary, kos: ko.kos };
  fs.writeFileSync(path.join(dataDir, 'ko.json'), JSON.stringify(out, null, 2));
}

function report(ko) {
  const s = ko.summary;
  console.log(`  ✓ data/ko.json (${s.total} KOs: ${s.approved} approved, ${s.proposed} proposed; ${s.counted} counted)`);
  if (s.candidates.length) console.log(`    candidates (not yet reused): ${s.candidates.join(', ')}`);
  if (s.gaps.length) console.log(`    gaps (heavily used, no registry entry): ${s.gaps.map(g => `${g.label} [${g.posts}]`).join(', ')}`);
  for (const p of s.problems) console.warn(`  ! ko: ${p}`);
}

module.exports = { computeKO, writeKO, report, mapConceptsFromRegistry, matcher };
