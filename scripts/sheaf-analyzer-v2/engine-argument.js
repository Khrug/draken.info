// ═══ SA2 ARGUMENT MAPS ═══ one Ishikawa (fishbone) diagram per argument in the text.
// 1. Thesis candidates are scored (incoming support edges, conclusion and finding markers, causal/general
//    claims, position), then chosen greedily so that the selected theses are lexically distinct and none is
//    a premise of another.
// 2. Every prose sentence is assigned to one thesis: through the support graph if it reaches a thesis,
//    else by shared content words, section and proximity; weakly related sentences stay unattached.
// 3. Each assigned sentence is placed on a bone (Reasoning, Evidence, Sources, Assumptions, Counterpoints,
//    Rhetoric) with its effect on the thesis (+ supports, ~ qualifies, − weakens, ∅ adds force without
//    support), the inference chain it travels, the shared terms, and a sentence saying how it contributes.
// Structure, not truth: a well-built argument can rest on false premises.
var SA2 = (typeof SA2 !== 'undefined') ? SA2 : (typeof require !== 'undefined' ? require('./engine-math.js') : {});
(function (S) {
  var W = function (s) { return (s.match(/[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ'’-]*/g) || []); };
  var STOP = new Set('the a an it this that these those there here and or but of in on at to for with as is are was were be been being has have had do does did not no by from into than then so such its their his her our your we they he she i you which who whom what when where why how also more most less very can could may might will would should must about over under after before during between itself themselves only just even still yet thus therefore hence'.split(' '));
  var cset = function (t) { return new Set(W(t).map(function (w) { return w.toLowerCase().replace(/(?:ies)$/, 'y').replace(/(?<=[a-z]{3})s$/, ''); }).filter(function (w) { return !STOP.has(w) && w.length > 3; })); };
  var shared = function (a, b) { var o = []; a.forEach(function (x) { if (b.has(x)) o.push(x); }); return o; };
  var jac = function (a, b) { var n = shared(a, b).length; return n / ((a.size + b.size - n) || 1); };
  var FWD = /\b(therefore|thus|hence|consequently|accordingly|so it follows|it follows that|which (?:proves|shows|means|demonstrates|confirms)|this (?:proves|shows|means|demonstrates|confirms|is why|explains)|that is why|därför|alltså)\b/i;
  var BACK = /\b(because|since|given that|as shown by|due to|owing to|eftersom)\b/i;
  var HEDGE = /\b(may|might|could|perhaps|possibly|likely|probably|suggests?|appears?|seems?|arguably|presumably)\b/i;
  var CONTRAST = /^(however|but|yet|nevertheless|nonetheless|on the other hand|critics|opponents|admittedly|although|though|in contrast|conversely)\b/i;
  var VAGUE_SRC = /^(?:(?:some|many|most|several|other|unnamed|anonymous|leading|top|the)\s+)?(?:experts?|scientists?|sources?|critics?|officials?|observers?|analysts?|studies|research(?:ers)?|reports?|people|they|some|many|insiders?|doctors?|commentators?)$/i;
  var CITE = /https?:\/\/|\b10\.\d{4,9}\/|\([A-Z][A-Za-z'’-]+(?: et al\.)?,? (?:19|20)\d\d[a-z]?\)|\[\d+\]/;

  S.argumentMaps = function (R, I, RH, opt) {
    opt = opt || {};
    var all = R.units, byId = {}; all.forEach(function (u) { byId[u.id] = u; });
    // sections from headings; prose units
    var sec = {}, s = 0, secName = { 0: '' }, secPath = { 0: '' }, stack = [];
    all.forEach(function (u) { var hm = u.heading && u.text.match(/^\s*(#{1,6})\s+(.*)$/);
      if (hm) { s++; var lvl = hm[1].length, name = hm[2].replace(/[*_`]/g, '').trim(); stack = stack.filter(function (x) { return x.l < lvl; }); stack.push({ l: lvl, n: name }); secName[s] = name; secPath[s] = stack.map(function (x) { return x.n; }).join(' › '); }
      sec[u.id] = s; });
    var units = all.filter(function (u) { return !u.heading && !u.refs && !u.boilerplate && W(u.text).length >= 3 && !/^\s*[<|\\]|\$\$/.test(u.text); });
    if (!units.length) return { maps: [], unattached: [], method: '' };
    var idx = {}; units.forEach(function (u, i) { idx[u.id] = i; });
    var sets = {}; units.forEach(function (u) { sets[u.id] = cset(u.cleanText || u.text); });
    var T = function (id) { return byId[id] ? (byId[id].cleanText || byId[id].text) : ''; };

    // support graph (premise → conclusion)
    var fwd = {}, back = {};
    (R.supportEdges || []).forEach(function (e) { if (e[0] === e[1]) return; (fwd[e[0]] = fwd[e[0]] || []).push(e[1]); (back[e[1]] = back[e[1]] || []).push(e[0]); });
    var pathTo = function (from, target) { // BFS along fwd edges
      var prev = {}, q = [from], seen = {}; seen[from] = 1;
      while (q.length) { var c = q.shift(); if (c === target) { var p = [c]; while (prev[p[0]]) p.unshift(prev[p[0]]); return p; }
        (fwd[c] || []).forEach(function (n) { if (!seen[n]) { seen[n] = 1; prev[n] = c; q.push(n); } }); }
      return null;
    };

    // thesis selection. Marker-based candidates (S.thesisCandidates) plus centrality within the section:
    // the sentence most similar to the rest of its section stands for that section's claim (cf. TextRank,
    // Mihalcea & Tarau 2004). Sections with five or more sentences nominate their best candidate.
    var bySec = {}; units.forEach(function (u) { (bySec[sec[u.id]] = bySec[sec[u.id]] || []).push(u.id); });
    var cent = {};
    Object.keys(bySec).forEach(function (k) { var ids = bySec[k], raw = {};
      ids.forEach(function (a) { var t = 0; ids.forEach(function (b) { if (a !== b) t += jac(sets[a], sets[b]); }); raw[a] = ids.length > 1 ? t / (ids.length - 1) : 0; });
      var mx = Math.max.apply(null, ids.map(function (a) { return raw[a]; }).concat([1e-9])); ids.forEach(function (a) { cent[a] = raw[a] / mx; }); });
    var marker = {}; S.thesisCandidates(R, units, 400).forEach(function (c) { marker[c.unit] = c; });
    // claim strength: what a thesis sentence looks like, independent of inference markers
    var SEC_UP = /\b(abstract|summary|synopsis|core claim|central claim|main claim|the claim|thesis|argument|conclusions?|concluding|introduction|overview|key (?:findings|results|claims)|findings|results|discussion|implications|predictions?|hypothes[ie]s|principles?|in brief|tl;?dr)\b/i;
    var SEC_DOWN = /\b(definitions?|notation|proofs?|lemma|appendix|appendices|references|bibliography|sources|notes|footnotes|tables?|figures?|errata|changelog|change log|version|fork|variants?|ledger|dictionary|glossary|index|acknowledg\w*|coding protocol|estimation|worked examples?|data|methods?|materials|supplementary|how to read|front matter|contents|metadata|licen[cs]e|citation)\b/i;
    var LEAD = /^(?:the (?:central|main|core|key) (?:consequence|claim|result|point|thesis|finding|insight|prediction)|principle\s*[\d.]*|theorem\s*[\d.]*|claim\s*[\d.]*|thesis|hypothesis\s*[\d.]*|result|prediction\s*[\d.]*|conclusion|in short|in sum|in brief|the upshot)\b[:.,]?/i;
    var GEN = /\b(every|always|never|only|all|no \w+ can|cannot|can never|must|necessarily|in general|any)\b/i;
    var CLAIMVERB = /\b(predicts?|explains?|implies|entails|determines?|separates?|splits?|rises?|falls?|raises?|lowers?|increases?|decreases?|causes?|leads? to|turns?|makes?|is (?:not )?(?:a|an|the) \w+|are (?:not )?(?:the )?\w+|cannot|can be|depends? on|requires?|measures?)\b/i;
    var MATHCH = /[=≈≤≥∑∫∂δ‖⊕⊗→←↔∈∉⊂∩∪⟨⟩√∞±×÷^_\\]|[\u{1D400}-\u{1D7FF}]/gu;
    var BADSTART = /^(?:defined in|see|cf\.?|source|sources|table|fig\.?|figure|appendix|version|v\d|note|notes|e\.g\.|i\.e\.|hence\s+\S*[=≈])/i;
    var claimStrength = function (u) {
      var t = (u.cleanText || u.text).replace(/^[-*•\s]+/, ''), w = W(t).length, sc = 0, why = [];
      var mathN = (t.match(MATHCH) || []).length, letters = (t.match(/[A-Za-zÀ-ÿ]/g) || []).length;
      if (mathN >= 3 || (letters && mathN / letters > 0.05)) { sc -= 4; why.push('formula'); }
      if (/^[a-z0-9)\]\-–—,;:.]/.test(t)) { sc -= 5; why.push('fragment'); }
      if (w < 6) sc -= 3; else if (w < 8) sc -= 1; else if (w > 70) sc -= 1;
      if (!/[.!?…]["”’)\]]*$/.test(t.trim())) { sc -= 2; }   // no sentence end: table cell, caption or heading residue
      if (/^[^A-Za-zÀ-ÿ"“‘(•\-]/.test(t)) sc -= 2;
      if (BADSTART.test(t)) sc -= 4;
      if ((t.match(/\bDRK-\d+/g) || []).length >= 2 || (t.match(/\(/g) || []).length >= 3) sc -= 2;
      if (/;\s/.test(t) && (t.match(/;/g) || []).length >= 2 && w < 30) sc -= 1.5;
      if (LEAD.test(t)) { sc += 2; why.push('labelled claim'); }
      var prev = all[+u.id.slice(1) - 1]; if (prev && !prev.heading && /^(?:the (?:central|main|core) \w+|principle|theorem|claim|thesis|result|prediction|conclusion)\s*[\d.]*[.:]?$/i.test((prev.cleanText || prev.text).trim())) { sc += 2; why.push('labelled claim'); }
      if (GEN.test(t)) { sc += 1.2; why.push('general claim'); }
      if (CLAIMVERB.test(t)) sc += 0.6;
      var path = secPath[sec[u.id]] || '', near = secName[sec[u.id]] || '';
      if (SEC_DOWN.test(near)) { sc -= 2.5; } else if (SEC_UP.test(path)) { sc += 2.5; why.push('in ' + near); }
      if (/\b(may|might|perhaps|possibly)\b/i.test(t)) sc -= 0.5;
      if (/^(?:it|this|that|these|those|they|such|he|she|its|their|here|there)\b/i.test(t) && !/^this (?:paper|thesis|monograph|article|essay|post|book|study|chapter|framework)\b/i.test(t)) sc -= 1.5;   // anaphoric openings lean on the previous sentence
      return { sc: sc, why: why };
    };
    var eligible = function (u) { var t = u.cleanText || u.text; return !u.nonclaim && W(t).length >= 6 && !/\?\s*$/.test(t) && !/^\s*[|*_>-]*\s*(?:released under|licen[cs]e|doi|orcid|cite as|keywords?)\b/i.test(t) && !/\|.*\|/.test(t); };
    var cands = units.filter(eligible).map(function (u) {
      var m = marker[u.id], cs = claimStrength(u), mk = m ? m.score : 0;
      if (cs.why.indexOf('formula') >= 0 || cs.why.indexOf('fragment') >= 0) mk = Math.min(mk, 1);   // an inference marker does not make a formula a thesis
      var sc = mk + cs.sc + 1.0 * (cent[u.id] || 0);
      var why = [m ? m.why : ''].concat(cs.why.filter(function (x) { return x !== 'formula' && x !== 'fragment'; }), [cent[u.id] > 0.85 ? 'central to its section' : '']).filter(Boolean).filter(function (x, i, A) { return A.indexOf(x) === i; }).join(', ');
      return { unit: u.id, score: Math.round(sc * 100) / 100, why: why || 'centrality', text: u.cleanText || u.text, sec: sec[u.id] }; })
      .sort(function (a, b) { return b.score - a.score; });
    var nSec = Object.keys(bySec).filter(function (k) { return bySec[k].length >= 5; });
    var maxK = opt.max || (units.length > 300 ? 8 : nSec.length > 1 ? Math.min(6, nSec.length) : Math.max(1, Math.min(6, Math.floor(units.length / 5))));
    var theses = (opt.theses || []).filter(function (id) { return byId[id]; }).slice();
    var perSec = {}, distinct = function (id) { return !theses.some(function (t) { return jac(sets[t] || new Set(), sets[id]) >= 0.25 || pathTo(id, t) || pathTo(t, id); }); };
    if (!theses.length) {
      // strongest claims first; at most two per section; extras need a clear claim score
      cands.forEach(function (c) { if (theses.length >= maxK || (theses.length && c.score < 3) || (perSec[c.sec] || 0) >= 2 || !distinct(c.unit)) return; theses.push(c.unit); perSec[c.sec] = (perSec[c.sec] || 0) + 1; });
      // then one per substantial section that has no thesis yet, if its best sentence is a reasonable claim
      if (theses.length < maxK) Object.keys(bySec).filter(function (k) { return bySec[k].length >= 8 && !perSec[k] && !SEC_DOWN.test(secName[k] || ''); })
        .map(function (k) { return cands.filter(function (c) { return String(c.sec) === k; })[0]; }).filter(function (c) { return c && c.score >= 1.5; })
        .sort(function (a, b) { return b.score - a.score; }).forEach(function (c) { if (theses.length < maxK && distinct(c.unit)) { theses.push(c.unit); perSec[c.sec] = 1; } });
      if (!theses.length) theses.push((cands[0] || { unit: units[0].id }).unit);
      theses.sort(function (a, b) { return idx[a] - idx[b]; });
    }
    var candOf = {}; cands.forEach(function (c) { candOf[c.unit] = c; });

    // assignment
    var assign = {}, unattached = [];
    units.forEach(function (u) {
      if (theses.indexOf(u.id) >= 0) return;
      var best = null, bs = -1, via = null;
      theses.forEach(function (t) { var p = pathTo(u.id, t); if (p && (!via || p.length < via.length)) { via = p; best = t; bs = 9; } });
      if (!via) theses.forEach(function (t) {
        var sc = jac(sets[u.id], sets[t]) + (sec[u.id] === sec[t] ? 0.15 : 0) + 0.06 / (1 + Math.abs(idx[u.id] - (idx[t] || 0)) / 8);
        if (sc > bs) { bs = sc; best = t; } });
      if (via || bs >= (theses.length > 1 ? 0.1 : 0.0)) assign[u.id] = { t: best, path: via }; else unattached.push(u.id);
    });

    // lookup tables
    var claimsOf = {}; R.claims.forEach(function (c) { (claimsOf[c.unit] = claimsOf[c.unit] || []).push(c); });
    var obsOf = {}; (R.obstructions || []).forEach(function (o, k) { var us = o.claims.map(function (cid) { return R.claims[+cid.slice(1)].unit; });
      us.forEach(function (uid) { (obsOf[uid] = obsOf[uid] || []).push({ k: k, cls: o.class, layer: o.layer, witness: o.witness, partners: us.filter(function (x) { return x !== uid; }) }); }); });
    var hedgedUnits = {}; (I.hedged || []).forEach(function (h) { var c = R.claims[+String(h.claim).slice(1)]; if (c) hedgedUnits[c.unit] = 1; });
    var ungrounded = {}; (I.ungrounded || []).forEach(function (g) { ungrounded[g.unit] = 1; });
    var fallOf = {}; (RH && RH.fallacies ? RH.fallacies.items : []).forEach(function (f) { (fallOf[f.unit] = fallOf[f.unit] || []).push(f); });
    var emo = {}; if (RH && RH.loaded) [RH.loaded.loaded, RH.loaded.strong].forEach(function (L) { L.forEach(function (t) { t.units.forEach(function (u) { (emo[u] = emo[u] || []).push(t.term); }); }); });

    var maps = theses.map(function (th, k) {
      var hs = sets[th] || cset(T(th)), members = Object.keys(assign).filter(function (id) { return assign[id].t === th; }).sort(function (a, b) { return idx[a] - idx[b]; });
      var bones = { reasoning: [], evidence: [], sources: [], assumptions: [], counter: [], rhetoric: [] };
      members.forEach(function (id) {
        var t = T(id), cs = claimsOf[id] || [], sh = shared(sets[id], hs), rel = jac(sets[id], hs), a = assign[id], placed = false;
        var base = { unit: id, label: t, rel: rel, shared: sh, section: secName[sec[id]] || '', chain: a.path };
        var put = function (bone, o) { bones[bone].push(Object.assign({}, base, o)); placed = true; };
        // counterpoints first: a sentence in conflict is first of all a conflict
        (obsOf[id] || []).forEach(function (o) { put('counter', { effect: '−', role: o.cls, tag: o.cls, w: 5, partners: o.partners,
          how: 'Cannot hold together with ' + o.partners.map(function (p) { return '“' + short(T(p), 90) + '”'; }).join(' and ') + ' (' + o.layer + ' layer' + (o.witness ? ': ' + o.witness : '') + '). Until resolved, whichever of them the thesis relies on is in doubt.' }); });
        if (CONTRAST.test(t.trim())) put('counter', { effect: '~', role: 'contrast', tag: 'contrast', w: 1, how: 'Opens with a contrastive marker (“' + t.trim().match(CONTRAST)[0] + '”): it qualifies or opposes the line of argument rather than supporting it.' });
        // reasoning: explicit inference chain to the thesis
        if (a.path) {
          var steps = a.path.length - 1, nxt = a.path[1], mk = (T(nxt).match(FWD) || T(nxt).match(BACK) || [])[0];
          put('reasoning', { effect: '+', role: steps === 1 ? 'direct premise' : 'premise, ' + steps + ' steps out', tag: steps === 1 ? 'premise' : 'chain ×' + steps, w: 10 - steps,
            connective: mk || '', how: (steps === 1 ? 'Direct premise' : 'Premise of a premise') + ': the next sentence opens with “' + (mk || 'an inference marker') + '”, which presents this sentence as a reason for it' + (steps === 1 ? ', and that sentence is the thesis.' : '; the chain reaches the thesis in ' + steps + ' steps.') + (ungrounded[id] ? ' The chain itself has no grounded starting point.' : '') });
        } else if (BACK.test(t) && rel >= 0.05) {
          put('reasoning', { effect: '+', role: 'stated reason', tag: 'reason', w: 3, connective: t.match(BACK)[0], how: 'Gives a reason inside the sentence (“' + t.match(BACK)[0] + '”) on terms shared with the thesis (' + sh.slice(0, 5).join(', ') + '). The link to the thesis is topical: no marker connects the two sentences.' });
        }
        // evidence
        var q = cs.filter(function (c) { return c.type === 'numeric' || c.type === 'date' || c.type === 'order'; });
        if (q.length || /\b\d[\d.,]*\s?(?:%|percent|million|billion|thousand)\b/i.test(t)) {
          var conflicted = !!obsOf[id];
          put('evidence', { effect: conflicted ? '−' : '+', role: q.map(function (c) { return c.type; }).filter(function (x, i, A) { return A.indexOf(x) === i; }).join(' + ') || 'figure', tag: q.length ? q[0].type : 'figure', w: 2 + rel * 4,
            how: 'Supplies ' + (q.length ? q.map(function (c) { return c.type; }).filter(function (x, i, A) { return A.indexOf(x) === i; }).join(' and ') + ' data' : 'a figure') + (sh.length ? ' about ' + sh.slice(0, 5).join(', ') : '') + '. It supports the thesis only as far as the thesis depends on these values' + (conflicted ? '; another sentence in the text gives incompatible values.' : '.') });
        }
        // sources
        var rep = cs.find(function (c) { return c.modality && c.modality.kind === 'reported' && c.modality.source; });
        if (rep) { var vague = VAGUE_SRC.test(rep.modality.source) || /\d/.test(rep.modality.source);
          put('sources', { effect: vague ? '~' : '+', role: vague ? 'unnamed source' : 'attributed', tag: vague ? 'unnamed' : rep.modality.source, w: vague ? 1 : 3,
            how: vague ? 'Attributes the claim to an unnamed group (“' + rep.modality.source + '”). It cannot be checked, so it adds little support.' : 'Rests on ' + rep.modality.source + '. The thesis inherits that source’s reliability; the claim is reported, not asserted by the author.' }); }
        if (CITE.test(t)) put('sources', { effect: '+', role: 'citation', tag: 'citation', w: 3, how: 'Cites external work. Support depends on whether the cited work says this; verify the citation (Fact-check and Sources tabs).' });
        // assumptions
        var hyp = cs.some(function (c) { return c.modality && c.modality.kind === 'hypothesized'; });
        if (hedgedUnits[id] || hyp || (HEDGE.test(t) && rel >= 0.08)) put('assumptions', { effect: '~', role: hyp ? 'hypothesis' : 'hedged', tag: hyp ? 'hypothesis' : 'hedged', w: 2 + rel * 3,
          how: (hyp ? 'Framed as a hypothesis' : 'Hedged (“' + ((t.match(HEDGE) || [''])[0]) + '”)') + '. If the thesis relies on it, the thesis can be no more certain than this sentence.' });
        if (ungrounded[id]) put('assumptions', { effect: '−', role: 'ungrounded conclusion', tag: 'ungrounded', w: 4, how: 'An intermediate conclusion whose support chain never reaches a sentence with independent grounding (figures, sources, citations). Everything resting on it is unsupported.' });
        // rhetoric
        (fallOf[id] || []).forEach(function (f) { put('rhetoric', { effect: '∅', role: f.name, tag: f.name, w: 3, how: f.name + ': ' + f.def + ' It adds persuasive force, not evidence.' }); });
        if (emo[id]) put('rhetoric', { effect: '∅', role: 'emotive wording', tag: 'emotive', w: 1 + emo[id].length / 2, how: 'Emotive or loaded wording (' + emo[id].slice(0, 5).join(', ') + '). It colours the claim without adding support.' });
        // nothing else: related claim (topical)
        if (!placed && rel >= 0.06) put('reasoning', { effect: '·', role: 'related claim', tag: 'related', w: rel, how: 'Shares terms with the thesis (' + sh.slice(0, 5).join(', ') + ') but carries no figure, source or inference marker. It elaborates the thesis rather than supporting it.' });
      });
      var order = function (L) { return L.sort(function (a, b) { return b.w - a.w || b.rel - a.rel; }); };
      var B = [
        { key: 'reasoning', name: 'Reasoning', hint: 'premises linked by inference markers, stated reasons, related claims' },
        { key: 'evidence', name: 'Evidence', hint: 'figures, dates and orderings' },
        { key: 'sources', name: 'Sources', hint: 'attributed statements and citations' },
        { key: 'assumptions', name: 'Assumptions', hint: 'hedged, hypothetical or ungrounded statements' },
        { key: 'counter', name: 'Counterpoints', hint: 'contradictions and contrastive sentences' },
        { key: 'rhetoric', name: 'Rhetoric', hint: 'fallacy candidates and emotive wording' }
      ].map(function (b) { b.items = order(bones[b.key]); return b; });
      // how it adds up
      var cnt = function (key, pred) { return B.filter(function (b) { return b.key === key; })[0].items.filter(pred || function () { return true; }).length; };
      var premises = cnt('reasoning', function (x) { return x.chain; }), reasons = cnt('reasoning', function (x) { return x.role === 'stated reason'; }), related = cnt('reasoning', function (x) { return x.role === 'related claim'; });
      var maxChain = Math.max.apply(null, [0].concat(B[0].items.filter(function (x) { return x.chain; }).map(function (x) { return x.chain.length - 1; })));
      var ev = cnt('evidence'), evConf = cnt('evidence', function (x) { return x.effect === '−'; }), named = cnt('sources', function (x) { return x.effect === '+'; }), unnamed = cnt('sources', function (x) { return x.effect !== '+'; });
      var hed = cnt('assumptions', function (x) { return x.effect === '~'; }), ung = cnt('assumptions', function (x) { return x.effect === '−'; }) + (ungrounded[th] ? 1 : 0);
      var contra = cnt('counter', function (x) { return x.effect === '−'; }), contrast = cnt('counter', function (x) { return x.effect === '~'; }), rh = cnt('rhetoric');
      var thConf = (obsOf[th] || []).length;
      var shape = thConf ? 'Contested: the thesis itself conflicts with another statement in the text.'
        : premises && (ev || named) ? 'Argued and evidenced: explicit premises lead to the thesis and figures or named sources are present.'
        : premises ? 'Argued without evidence: explicit premises, but no figures or named sources on this argument.'
        : (ev || named) ? 'Evidenced but not argued: figures or sources sit next to the thesis, but no inference marker connects them to it.'
        : reasons ? 'Supported by in-sentence reasons only.'
        : 'Asserted: no premises, figures or sources are attached to this thesis.';
      var c = candOf[th];
      return { id: 'A' + (k + 1), head: { unit: th, text: T(th), section: secName[sec[th]] || '', why: c ? c.why : 'chosen', score: c ? c.score : null, conflicts: obsOf[th] || [], hedged: !!hedgedUnits[th] || HEDGE.test(T(th)), ungrounded: !!ungrounded[th], rhetoric: (fallOf[th] || []).map(function (f) { return f.name; }) },
        bones: B, members: members.length,
        tally: { premises: premises, maxChain: maxChain, reasons: reasons, related: related, evidence: ev, evidenceInConflict: evConf, namedSources: named, unnamedSources: unnamed, hedged: hed, ungrounded: ung, contradictions: contra, contrasts: contrast, rhetoric: rh },
        shape: shape };
    });
    return { maps: maps, unattached: unattached, candidates: cands.slice(0, 12),
      method: 'Theses: sentences scored as claims (labelled claims and principles, general statements, claim verbs, sections such as Abstract, Core claim or Conclusion; formulas, fragments, cross-references and definition sections penalised), plus inference markers and section centrality; kept only if distinct, at most two per section, and not premises of one another (' + maps.length + ' found). Sentences join the thesis their inference chain reaches, else the one they share most words with in the same section; weakly related sentences stay unattached. Effects: + supports, · elaborates, ~ qualifies, − weakens, ∅ persuades without support. This maps structure, not truth.' };
  };
  var short = function (t, n) { t = String(t).replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n - 1) + '…' : t; };
})(SA2);
if (typeof module !== 'undefined') module.exports = SA2;
