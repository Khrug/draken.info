// Acceptance test: the preregistered v1 perturbation protocol (seed 201, same posts, same perturbations)
// applied to SA2. A perturbation is "detected" when some obstruction involves the injected unit.
const fs = require('fs'), path = require('path');
const SA2 = require('./engine-math.js'); require('./engine-text.js');
const POSTS = require('path').join(__dirname, '..', '..', 'posts');
let seed = 201; const rand = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; }; const pick = a => a[Math.floor(rand() * a.length)];
const body = md => { const m = md.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/); return m ? m[1] : md; };
const SV = /\b(och|att|det|som|inte|är)\b/gi; const isEnglish = t => ((t.match(SV) || []).length / t.split(/\s+/).length) < 0.01;
const posts = fs.readdirSync(POSTS).filter(f => f.endsWith('.md')).sort().map(f => ({ f, t: body(fs.readFileSync(path.join(POSTS, f), 'utf8')) })).filter(p => isEnglish(p.t));

// Perturbations operate on lines/sentences of the raw text; sentences are found with SA2's own segmenter.
const sents = t => SA2.segment(t).filter(u => !u.heading);
const nW = s => s.split(/\s+/).length;
function insertAfter(t, u, txt) { return t.slice(0, u.end) + ' ' + txt + t.slice(u.end); }
function negate(s) { const re = /\b(is|are|was|were|has|have|had|can|does|do|will)\b/; return re.test(s) ? s.replace(re, m => m + ' not') : 'It is not the case that ' + s.charAt(0).toLowerCase() + s.slice(1); }
const bump = s => s.replace(/\d+/g, n => String(+n + 7));
function involves(R, text, nth) {           // obstructions touching the nth unit whose text === text
  const us = R.units.filter(u => u.text === text); const u = us[nth]; if (!u) return 0;
  const ids = new Set(R.claims.filter(c => c.unit === u.id).map(c => c.id));
  return R.obstructions.filter(o => o.claims.some(id => ids.has(id))).length;
}
const sigSet = R => new Set(R.obstructions.map(o => o.layer + '|' + o.claims.map(id => R.claims[+id.slice(1)].span.quote).sort().join('||')));
const eqSet = (a, b) => a.size === b.size && [...a].every(x => b.has(x));

const NEGW = /\b(not|no|never)\b/i;
function baseline(text) { const ss = SA2.segment(text).map(u => u.text); const W = x => new Set(x.toLowerCase().match(/[a-zåäö0-9]+/g) || []); const N = x => (x.match(/\d+/g) || []).join(',');
  for (let i = 0; i < ss.length; i++) for (let j = i + 1; j < ss.length; j++) { const A = W(ss[i]), B = W(ss[j]); let n = 0; A.forEach(x => { if (B.has(x)) n++; }); if (n / (A.size + B.size - n || 1) >= 0.6 && (N(ss[i]) !== N(ss[j]) || NEGW.test(ss[i]) !== NEGW.test(ss[j]))) return 1; } return 0; }
const res = { n: 0, NUMq: [0, 0], baseNUMq: [0, 0], baseNUM: [0, 0], baseNEG: [0, 0], baseOrig: 0, baseDUP: 0, origContra: 0, origObs: 0, postsWithContra: 0, DUP: [0, 0], NUM: [0, 0], NEG: [0, 0], TOPIC_up: 0, TOPIC_n: 0, SHUF_inv: 0, SHUF_n: 0, SEG_inv: 0, SEG_n: 0, samples: [] };
const t0 = Date.now();
posts.forEach((p, k) => {
  const S = sents(p.t); if (S.length < 10) return; res.n++;
  const R0 = SA2.analyze(p.t); res.baseOrig += baseline(p.t);
  res.origObs += R0.obstructions.length; const oc = R0.obstructions.filter(o => o.class === 'contradiction').length; res.origContra += oc; if (oc) res.postsWithContra++;
  if (oc && res.samples.length < 12) R0.obstructions.filter(o => o.class === 'contradiction').slice(0, 1).forEach(o => res.samples.push({ post: p.f, layer: o.layer, quotes: o.claims.map(id => R0.claims[+id.slice(1)].span.quote.slice(0, 110)) }));
  const el = S.filter(u => nW(u.text) >= 8 && nW(u.text) <= 40);
  if (el.length) {
    const u = pick(el);
    const dt = insertAfter(p.t, u, u.text), d = SA2.analyze(dt); res.DUP[1]++; if (involves(d, u.text, 1)) res.DUP[0]++; res.baseDUP += baseline(dt);
    const ng = negate(u.text), nt = insertAfter(p.t, u, ng), n = SA2.analyze(nt); res.NEG[1]++; if (involves(n, ng, 0)) res.NEG[0]++; else (res.negMiss = res.negMiss || []).push(ng.slice(0, 120)); res.baseNEG[1]++; res.baseNEG[0] += baseline(nt);
  }
  const elN = el.filter(u => /\d/.test(u.text));
  if (elN.length) { const u = pick(elN); const b = bump(u.text), bt = insertAfter(p.t, u, b), r = SA2.analyze(bt); const hit = involves(r, b, 0) ? 1 : 0, bh = baseline(bt);
    res.NUM[1]++; res.NUM[0] += hit; res.baseNUM[1]++; res.baseNUM[0] += bh;
    const qty = !u.nonclaim && SA2.extractClaims(u).some(c => c.type === 'numeric' || c.type === 'date');
    if (qty) { if (!hit) (res.numMiss = res.numMiss || []).push(b.slice(0, 150)); res.NUMq[1]++; res.NUMq[0] += hit; res.baseNUMq[1]++; res.baseNUMq[0] += bh; } }
  // TOPIC: replace 25% of sentence units by sentences of another post; Γ must not rise in any layer
  let other; do { other = Math.floor(rand() * posts.length); } while (other === k);
  const OS = sents(posts[other].t); if (OS.length) {
    let t = p.t; const idx = S.map((_, i) => i).sort(() => rand() - 0.5).slice(0, Math.round(0.25 * S.length)).sort((a, b) => S[b].start - S[a].start);
    idx.forEach(i => { t = t.slice(0, S[i].start) + pick(OS).text + t.slice(S[i].end); });
    const R1 = SA2.analyze(t); res.TOPIC_n++;
    if (['linear', 'ordinal', 'propositional'].some(L => R0.gamma[L] !== null && R1.gamma[L] !== null && R1.gamma[L] > R0.gamma[L])) res.TOPIC_up++;
  }
  // SHUFFLE: permute lines (paragraph blocks); obstruction set by quotes must be identical
  const refAt = p.t.search(/^\s*#{1,6}\s*(references|sources|bibliography|notes|footnotes|källor|referenser)\b/im), head = refAt > 0 ? p.t.slice(0, refAt) : p.t, tail = refAt > 0 ? p.t.slice(refAt) : '';
  const blocks = head.split(/\n\s*\n/); const sh = blocks.slice().sort(() => rand() - 0.5).join('\n\n') + (tail ? '\n\n' + tail : '');
  res.SHUF_n++; if (eqSet(sigSet(R0), sigSet(SA2.analyze(sh)))) res.SHUF_inv++;
  // SEGMENT: strip trailing full stops at line ends and convert paragraphs' first line into bullets
  const seg = p.t.split('\n').map(l => l.replace(/\.\s*$/, '')).join('\n');
  const strip = R => new Set([...sigSet(R)].map(s => s.replace(/\.(?=\|\||$)/g, '')));
  res.SEG_n++; if (eqSet(strip(R0), strip(SA2.analyze(seg)))) res.SEG_inv++;
});
const pc = a => a[1] ? (100 * a[0] / a[1]).toFixed(1) + '% (' + a[0] + '/' + a[1] + ')' : 'n/a';
console.log('posts', res.n, 'time', ((Date.now() - t0) / 1000).toFixed(1) + 's');
console.log('ORIGINAL posts: contradictions flagged', res.origContra, 'in', res.postsWithContra, 'posts; all obstructions', res.origObs);
console.log('DUP (control) injected unit involved in an obstruction:', pc(res.DUP));
console.log('NUM detected (all):', pc(res.NUM), '| baseline', pc(res.baseNUM), '| v1 0%');
console.log('NUM detected (sentence carries an extracted quantity or date):', pc(res.NUMq), '| baseline', pc(res.baseNUMq));
console.log('NEG detected:', pc(res.NEG), '| baseline', pc(res.baseNEG), '| v1 ~0%');
console.log('False alarms on unmodified posts: SA2', res.origContra, 'contradictions in', res.postsWithContra, 'posts | baseline flags', res.baseOrig, 'of', res.n, 'posts; on DUP control: SA2', res.DUP[0], '| baseline', res.baseDUP);
console.log('TOPIC Γ rose in', res.TOPIC_up, 'of', res.TOPIC_n);
console.log('SHUFFLE obstruction set invariant:', res.SHUF_inv, '/', res.SHUF_n);
console.log('SEGMENT obstruction set invariant:', res.SEG_inv, '/', res.SEG_n);
fs.writeFileSync(require('path').join(__dirname, 'protocol-results.json'), JSON.stringify(res, null, 1));
console.log('\nSample contradictions flagged in unmodified posts (for false-positive review):');
res.samples.forEach(s => console.log('-', s.post, s.layer, JSON.stringify(s.quotes)));
