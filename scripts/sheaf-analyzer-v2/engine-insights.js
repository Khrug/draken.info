// ═══ SA2 INSIGHTS ═══ descriptive structure of a text beyond its obstructions:
// entities and concepts, quantities, all dated events, argument structure, attribution, near-tensions.
// Everything here is descriptive (what the text says and how it is built); only the consistency
// layers in engine-text.js make formal claims about gluing.
var SA2 = (typeof SA2 !== 'undefined') ? SA2 : require('./engine-math.js');
(function (S) {
  'use strict';
  var CAP_STOP = new Set(('I A An The This That These Those It Its In On At For From By With As If When While But And Or So Yet Then There Here What Which Who Why How Where One Two Three Four Five First Second Third Each Every Some Many Most All No Not Our We You They He She His Her Their My Your Also However Therefore Thus Hence Because Since Although Though After Before During Under Over Between Into Through Both Either Neither Such Same Other Another Only Even Still Yet Just Very More Less Fig Figure Table Section Chapter Part Step Note See Yes Let Using Use Whether Within Without Across Against Among Toward Towards Unlike Like Given Unless Until Upon Refuted Supported Hypothesis Synthesis Established Metaphor Operators Layers Coherence Sources References Falsification Draft Status Definition Example Remark Claim Claims Read Reading Yet Thus Is Are Was Were Be Been Has Have Had Do Does Did Can Could May Might Must Shall Should Will Would Monday Tuesday Wednesday Thursday Friday Saturday Sunday January February March April May June July August September October November December Det Den De En Ett Och Att Som Är Var Har Men När Om Inte Detta Denna Dessa'
    ).split(/\s+/));
  var NAME_RE = /\b([A-ZÅÄÖÉ][\p{L}'’-]*(?:\s+(?:of|de|der|von|van|af|la|le|du|the|and|&|för|i)?\s*[A-ZÅÄÖÉ][\p{L}'’-]*){0,4})/gu;

  function cleanName(n) { return n.replace(/['’]s$/, '').replace(/^(The|A|An|Den|Det)\s+/, '').replace(/\s+(of|de|der|von|van|af|la|le|du|the|and|&|för|i)$/i, '').trim(); }

  S.entities = function (R) {
    var lowerWords = new Set(); R.units.forEach(function (u) { (u.text.match(/\b[a-zåäö][\p{L}'-]+/gu) || []).forEach(function (w) { lowerWords.add(w); }); });
    var ents = {}, unitClaims = {};
    R.claims.forEach(function (c) { (unitClaims[c.unit] = unitClaims[c.unit] || []).push(c.id); });
    R.units.forEach(function (u) {
      if (u.nonclaim || u.boilerplate) return;
      var t = (u.cleanText || u.text).replace(/[*_`#>\[\]]/g, ' '), m;
      NAME_RE.lastIndex = 0;
      while ((m = NAME_RE.exec(t))) {
        var raw = m[1], atStart = /^\s*$/.test(t.slice(0, m.index).replace(/["'“(]/g, ''));
        if (/^[-\d]/.test(t.slice(m.index + raw.length))) continue;            // codes such as DRK-123, GA 348
        var parts = raw.split(/\s+(?:and|&|och)\s+/);
        for (var pi = 0; pi < parts.length; pi++) {
        var ws0 = parts[pi].split(/\s+/); while (ws0.length > 1 && CAP_STOP.has(ws0[0])) { ws0.shift(); if (pi === 0) atStart = false; }
        var name = cleanName(ws0.join(' ').replace(/-+$/, ''));
        if (!name || name.length < 2) continue;
        var words = name.split(/\s+/);
        if (words.length === 1) {
          if (CAP_STOP.has(name) || name.length < 3) continue;
          if (atStart && lowerWords.has(name.toLowerCase())) continue;   // ordinary word capitalised at sentence start
          if (/^[A-ZÅÄÖ]{2,6}$/.test(name) && /^\d/.test(t.slice(m.index + raw.length).trim())) continue; // "GA 348" style codes
        }
        if (words.every(function (w) { return CAP_STOP.has(w); })) continue;
        var e = ents[name] = ents[name] || { name: name, mentions: 0, units: new Set(), claims: new Set(), sources: new Set() };
        e.mentions++; e.units.add(u.id); if (u.source) e.sources.add(u.source);
        (unitClaims[u.id] || []).forEach(function (id) { e.claims.add(id); });
        }
      }
    });
    // merge single-token names into a unique longer name that contains them ("Ghrist" -> "Robert Ghrist")
    Object.keys(ents).forEach(function (k) {
      if (k.indexOf(' ') >= 0) return;
      var hosts = Object.keys(ents).filter(function (h) { return h !== k && h.split(/\s+/).indexOf(k) >= 0; });
      if (hosts.length === 1) { var h = ents[hosts[0]], e = ents[k]; h.mentions += e.mentions; e.units.forEach(function (x) { h.units.add(x); }); e.claims.forEach(function (x) { h.claims.add(x); }); e.sources.forEach(function (x) { h.sources.add(x); }); delete ents[k]; }
    });
    var list = Object.keys(ents).map(function (k) { var e = ents[k]; return { name: e.name, kind: 'entity', mentions: e.mentions, units: Array.from(e.units), claims: Array.from(e.claims), sources: Array.from(e.sources) }; })
      .filter(function (e) { return e.mentions >= 2 || e.name.indexOf(' ') > 0; })
      .sort(function (a, b) { return b.mentions - a.mentions; });
    return list;
  };

  // Concepts: most frequent content stems that are not part of entity names (gives structure to essays without names)
  S.concepts = function (R, ents, k) {
    var entWords = new Set(); ents.forEach(function (e) { e.name.toLowerCase().split(/\s+/).forEach(function (w) { entWords.add(S.util.stem(w)); }); });
    var freq = {}, unitsOf = {}, display = {};
    R.units.forEach(function (u) {
      if (u.nonclaim || u.boilerplate || u.heading) return;
      var seen = new Set();
      ((u.cleanText || u.text).toLowerCase().match(/[a-zåäöéü][a-zåäöéü'-]{3,}/g) || []).forEach(function (w) {
        var st = S.util.stem(w); if (S.util.contentWords(w).length === 0 || entWords.has(st)) return;
        if (!display[st] || w.length < display[st].length) display[st] = w;
        if (seen.has(st)) return; seen.add(st);
        freq[st] = (freq[st] || 0) + 1; (unitsOf[st] = unitsOf[st] || []).push(u.id);
      });
    });
    var n = R.units.length || 1;
    return Object.keys(freq).filter(function (s) { return freq[s] >= 3 && freq[s] < 0.5 * n; })
      .sort(function (a, b) { return freq[b] - freq[a]; }).slice(0, k || 18)
      .map(function (s) { return { name: display[s], kind: 'concept', stem: s, mentions: freq[s], units: unitsOf[s] }; });
  };

  S.insights = function (R) {
    var claimAt = function (id) { return R.claims[+String(id).slice(1)]; };
    var unitClaims = {}; R.claims.forEach(function (c) { (unitClaims[c.unit] = unitClaims[c.unit] || []).push(c); });
    var ents = S.entities(R), concepts = S.concepts(R, ents, 18);
    concepts.forEach(function (c) { var ids = new Set(); c.units.forEach(function (u) { (unitClaims[u] || []).forEach(function (x) { ids.add(x.id); }); }); c.claims = Array.from(ids); });
    var obsByClaim = {}; R.obstructions.forEach(function (o, i) { o.claims.forEach(function (id) { (obsByClaim[id] = obsByClaim[id] || []).push(i); }); });
    ents.concat(concepts).forEach(function (e) { var s = new Set(); e.claims.forEach(function (id) { (obsByClaim[id] || []).forEach(function (i) { s.add(i); }); }); e.obstructions = Array.from(s); });

    var claimUnits = R.units.filter(function (u) { return !u.nonclaim && !u.heading && !u.boilerplate; });
    var typed = claimUnits.filter(function (u) { return (unitClaims[u.id] || []).some(function (c) { return c.type !== 'proposition'; }); });

    var quantities = R.claims.filter(function (c) { return c.type === 'numeric'; }).map(function (c) {
      return { claim: c.id, values: c.values.map(function (v) { return v.text + (v.unit && v.text.indexOf(v.unit) < 0 ? ' ' + v.unit : ''); }).join(', '), unit: c.values.map(function (v) { return v.unit; }).filter(Boolean).join(','), hedged: c.values.some(function (v) { return v.hedged; }), modality: c.modality.kind, source: c.source, quote: c.span.quote, obstruction: !!obsByClaim[c.id] };
    });
    var dated = R.claims.filter(function (c) { return c.type === 'date'; }).map(function (c) {
      return { claim: c.id, lo: S.util.dayStr(c.interval[0]), hi: S.util.dayStr(c.interval[1]), precision: c.precision, modality: c.modality.kind, source: c.source, quote: c.span.quote, obstruction: !!obsByClaim[c.id] };
    }).sort(function (a, b) { return a.lo < b.lo ? -1 : a.lo > b.lo ? 1 : 0; });
    var orders = R.claims.filter(function (c) { return c.type === 'order'; }).map(function (c) { return { claim: c.id, quote: c.span.quote, relation: c.relation, obstruction: !!obsByClaim[c.id] }; });

    // argument structure
    var unitById = {}; R.units.forEach(function (u) { unitById[u.id] = u; });
    var arguments_ = R.supportEdges.filter(function (e) { return e[0] !== e[1]; }).map(function (e) { return { premise: e[0], conclusion: e[1], premiseText: unitById[e[0]].text, conclusionText: unitById[e[1]].text }; });
    var ungrounded = (R.psi.ground.witnesses || []).map(function (u) { return { unit: u, text: unitById[u].text }; });
    var sealing = (R.psi.seal.witnesses || []).map(function (u) { return { unit: u, text: unitById[u].text }; });
    var hedged = R.claims.filter(function (c) { return c.type === 'proposition' && c.modality.kind === 'hypothesized'; }).map(function (c) { return { claim: c.id, quote: c.span.quote }; });
    var questions = R.claims.filter(function (c) { return c.type === 'proposition' && c.modality.kind === 'question'; }).map(function (c) { return { claim: c.id, quote: c.span.quote }; });

    // attribution: claims by reported source
    var bySource = {};
    R.claims.forEach(function (c) { if (c.type !== 'proposition' || c.modality.kind !== 'reported') return; var k = (c.modality.source || 'unattributed').slice(0, 50); (bySource[k] = bySource[k] || []).push({ claim: c.id, quote: c.span.quote, obstruction: !!obsByClaim[c.id] }); });

    // corroboration: statements made more than once and consistent
    var digits = function (c) { return (c.span.quote.match(/\d+(?:[.,]\d+)?/g) || []).join(','); };
    var corroborated = R.edges.filter(function (e) { return !e.conflict && (e.layer !== 'propositional' || digits(claimAt(e.a)) === digits(claimAt(e.b))); }).map(function (e) { var a = claimAt(e.a), b = claimAt(e.b); return { layer: e.layer, a: a.span.quote, b: b.span.quote, claims: [e.a, e.b], crossSource: a.source !== b.source }; });

    // near-tensions for human review (NOT obstructions): looser matches than the consistency layers accept
    var tensions = [], seen = {};
    var push = function (kind, a, b, note) { var k = [a.id, b.id].sort().join(); if (seen[k]) return; seen[k] = 1; tensions.push({ kind: kind, claims: [a.id, b.id], a: a.span.quote, b: b.span.quote, note: note }); };
    var props = R.claims.filter(function (c) { return c.type === 'proposition'; });
    var nums = R.claims.filter(function (c) { return c.type === 'numeric'; });
    var dts = R.claims.filter(function (c) { return c.type === 'date'; });
    function scan(list, minJ, maxJ, test, limit) {
      var idx = {}, pairs = 0;
      list.forEach(function (c, i) { new Set(c.frame).forEach(function (w) { (idx[w] = idx[w] || []).push(i); }); });
      var cand = {};
      Object.keys(idx).forEach(function (w) { var ix = idx[w]; if (ix.length > 60) return; for (var a = 0; a < ix.length; a++) for (var b = a + 1; b < ix.length; b++) cand[ix[a] + ',' + ix[b]] = 1; });
      Object.keys(cand).forEach(function (k) {
        if (pairs >= limit) return;
        var p = k.split(',').map(Number), a = list[p[0]], b = list[p[1]]; if (a.unit === b.unit) return;
        var j = S.util.jaccard(a.fset, b.fset); if (j < minJ || j >= maxJ) return;
        if (test(a, b, j)) pairs++;
      });
    }
    scan(props, 0.6, 0.8, function (a, b, j) { if (a.polarity === b.polarity || Math.min(a.fset.size, b.fset.size) < 3) return false; push('opposite polarity, partly different wording', a, b, 'similarity ' + j.toFixed(2)); return true; }, 25);
    scan(nums, 0.4, 0.6, function (a, b, j) {
      if (a.values.length !== 1 || b.values.length !== 1 || a.values[0].unit !== b.values[0].unit || !a.values[0].unit) return false;
      if (a.values[0].value === b.values[0].value) return false;
      push('different values for similar quantities', a, b, a.values[0].text + ' vs ' + b.values[0].text + ' (similarity ' + j.toFixed(2) + ')'); return true;
    }, 25);
    scan(dts, 0.4, 0.6, function (a, b, j) { if (a.interval[1] >= b.interval[0] && b.interval[1] >= a.interval[0]) return false; push('different dates for similar events', a, b, a.dateText + ' vs ' + b.dateText + ' (similarity ' + j.toFixed(2) + ')'); return true; }, 25);
    // hedged quantities that agree only within tolerance
    R.edges.forEach(function (e) { if (e.layer !== 'linear' || e.conflict) return; var a = claimAt(e.a), b = claimAt(e.b); var diff = a.values.some(function (v, i) { return v.value !== b.values[i].value; }); if (diff) push('agree only within the 10% tolerance for approximate figures', a, b, a.values.map(function (v) { return v.text; }).join(',') + ' vs ' + b.values.map(function (v) { return v.text; }).join(',')); });

    var p = R.profile, tot = p.asserted + p.reported + p.hypothesized + p.question || 1;
    var highlights = [];
    var contra = R.obstructions.filter(function (o) { return o.class === 'contradiction'; }).length;
    if (contra) highlights.push(contra + ' internal contradiction' + (contra > 1 ? 's' : '') + ': claims the text asserts that cannot all be true.');
    if (R.obstructions.length - contra) highlights.push((R.obstructions.length - contra) + ' clash' + (R.obstructions.length - contra > 1 ? 'es' : '') + ' between reported accounts or hypotheses.');
    if (tensions.length) highlights.push(tensions.length + ' possible tension' + (tensions.length > 1 ? 's' : '') + ' worth a human look (looser matches than the formal layers accept).');
    if (ents.length) highlights.push('Most discussed: ' + ents.slice(0, 5).map(function (e) { return e.name + ' (' + e.mentions + ')'; }).join(', ') + '.');
    if (concepts.length) highlights.push('Central concepts: ' + concepts.slice(0, 6).map(function (c) { return c.name; }).join(', ') + '.');
    if (quantities.length || dated.length) highlights.push(quantities.length + ' figure' + (quantities.length === 1 ? '' : 's') + ' and ' + dated.length + ' dated statement' + (dated.length === 1 ? '' : 's') + ' can be checked against each other' + (R.obstructions.length ? '' : ', and all that are comparable agree') + '.');
    var srcK = Object.keys(bySource).sort(function (a, b) { return bySource[b].length - bySource[a].length; });
    if (srcK.length) highlights.push('Reported voices: ' + srcK.slice(0, 5).map(function (k) { return k + ' (' + bySource[k].length + ')'; }).join(', ') + '.');
    if (corroborated.length) highlights.push(corroborated.length + ' statement' + (corroborated.length > 1 ? 's are' : ' is') + ' repeated consistently' + (corroborated.some(function (c) { return c.crossSource; }) ? ', some across sources' : '') + '.');
    if (p.reported / tot > 0.2) highlights.push(Math.round(100 * p.reported / tot) + '% of statements are reported speech: the text largely relays what others say.');
    if (p.hypothesized / tot > 0.2) highlights.push(Math.round(100 * p.hypothesized / tot) + '% of statements are hedged or hypothetical.');
    if (ungrounded.length) highlights.push(ungrounded.length + ' conclusion' + (ungrounded.length > 1 ? 's are' : ' is') + ' argued for without any support chain reaching a cited or dated claim.');
    if (sealing.length) highlights.push(sealing.length + ' self-sealing move' + (sealing.length > 1 ? 's' : '') + ': absence or denial of evidence presented as evidence.');
    if (claimUnits.length && typed.length / claimUnits.length < 0.15) highlights.push('Only ' + Math.round(100 * typed.length / claimUnits.length) + '% of sentences carry a checkable quantity, date or order relation: mostly interpretive text, so the formal layers have little to test.');

    return {
      entities: ents.slice(0, 120), concepts: concepts, quantities: quantities, dated: dated, orders: orders,
      arguments: arguments_, ungrounded: ungrounded, sealing: sealing, hedged: hedged, questions: questions,
      bySource: bySource, corroborated: corroborated, tensions: tensions, highlights: highlights,
      checkability: { units: claimUnits.length, typed: typed.length, share: claimUnits.length ? +(typed.length / claimUnits.length).toFixed(3) : 0 },
      modality: { asserted: p.asserted, reported: p.reported, hypothesized: p.hypothesized, question: p.question }
    };
  };
})(SA2);
if (typeof module !== 'undefined') module.exports = SA2;
