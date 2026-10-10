// ═══ SA2 UI ═══ controller, renderers, graph, exports.
(function (S) {
  'use strict';
  var U = S.ui = {};
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  U.mode = 'single'; U.last = null; U.density = 'balanced'; U.labels = true; U.corpus = null; U.corpusSel = new Set();
  var CLASS_BADGE = { 'contradiction': ['b-contra', 'contradiction'], 'conflicting-accounts': ['b-acc', 'conflicting accounts'], 'inconsistent-testimony': ['b-test', 'inconsistent testimony'], 'tension-with-hypothesis': ['b-hyp', 'tension with hypothesis'], 'question': ['b-q', 'question'] };
  var LAYER_BADGE = { linear: 'b-lin', ordinal: 'b-ord', propositional: 'b-prop' };
  var TYPE_COLOR = { numeric: '#7dd3fc', date: '#fcd34d', order: '#fcd34d', proposition: '#e9a8ff', relation: '#a3e635' };
  var claimOf = function (R, id) { return R.claims[+String(id).slice(1)]; };

  U.setProgress = function (p) { var el = $('sa-prog'); if (el) el.style.width = p + '%'; };

  // ── metrics ──
  function gammaCell(id, v, hint) { var el = $(id); el.textContent = v === null ? 'N/A' : v; el.style.color = v === null ? '#6b8a6b' : v === 1 ? '#4ade80' : '#ef4444'; $(id + '-h').textContent = hint || ''; }
  U.renderMetrics = function (R) {
    gammaCell('g-lin', R.gamma.linear, R.agreement.linear != null ? 'agreement ' + Math.round(R.agreement.linear * 100) + '%' : (R.hodge ? 'Hodge on relations' : 'nothing comparable'));
    gammaCell('g-ord', R.gamma.ordinal, R.counts.date + R.counts.order ? R.counts.date + ' dates · ' + R.counts.order + ' order' : 'no dated events');
    gammaCell('g-prop', R.gamma.propositional, R.agreement.propositional != null ? 'agreement ' + Math.round(R.agreement.propositional * 100) + '%' : 'no repeated statements');
    var contra = R.obstructions.filter(function (o) { return o.class === 'contradiction'; }).length, acc = R.obstructions.length - contra;
    $('m-contra').textContent = contra; $('m-contra').style.color = contra ? '#ef4444' : '#4ade80';
    $('m-acc').textContent = acc; $('m-acc').style.color = acc ? '#f0d48a' : '#4ade80';
    $('m-claims').textContent = R.counts.claims; $('m-claims').style.color = '#c8d8c8';
    $('sa-verdict').innerHTML = U.verdict(R);
    document.querySelectorAll('.sa-export-opt').forEach(function (b) { b.disabled = false; });
    $('sa-export-hint').textContent = 'Ready. Files save to your Downloads folder.';
    U.renderPsi(R); U.renderLayers(R);
  };
  U.verdict = function (R) {
    var c = R.counts, contra = R.obstructions.filter(function (o) { return o.class === 'contradiction'; }).length, p = R.profile, tot = p.asserted + p.reported + p.hypothesized + p.question || 1;
    var parts = [];
    parts.push(contra ? '<span class="sa-severe">✗ ' + contra + ' internal contradiction' + (contra > 1 ? 's' : '') + '</span>' : '<span class="sa-ok">✓ no internal contradiction found</span>');
    if (R.obstructions.length - contra) parts.push('<span class="sa-mid">◆ ' + (R.obstructions.length - contra) + ' clash' + (R.obstructions.length - contra > 1 ? 'es' : '') + ' between accounts or hypotheses</span>');
    parts.push(c.units + ' units · ' + c.comparisons + ' comparisons · ' + Math.round(100 * p.reported / tot) + '% reported · ' + Math.round(100 * p.hypothesized / tot) + '% hypothetical');
    if (!c.comparisons && !c.date && !c.order) parts.push('<span class="sa-mid">little to compare: the text makes few checkable claims</span>');
    return parts.join(' · ');
  };
  U.renderPsi = function (R) {
    var P = R.psi, row = function (k, v, hint) { return '<div class="sa-kv"><b>' + k + '</b><span>' + v + '</span></div>' + (hint ? '<div style="font-size:10px;color:#6b8a6b;margin:0 0 4px">' + hint + '</div>' : ''); };
    var h = row('Ψ ground', P.ground.value == null ? 'N/A' : P.ground.value + ' (' + P.ground.ungrounded + '/' + P.ground.supported + ')', 'supported claims with no support path from an anchored claim')
      + row('Ψ circ', P.circ.value, 'groups of claims that justify only each other')
      + row('Ψ seal', P.seal.value, 'absence or denial of evidence used as evidence')
      + row('Ψ imp', P.imp.value, 'asserted contradictions maintained by the text')
      + row('anchored share', Math.round(P.anchoredShare * 100) + '%', 'units carrying a citation, source or date');
    if (P.seal.witnesses.length) h += '<h4 style="font-size:10px;color:#4ade80;margin:8px 0 4px;font-family:JetBrains Mono,monospace">SELF-SEALING</h4>' + P.seal.witnesses.slice(0, 4).map(function (uid) { var u = R.units[+uid.slice(1)]; return '<div class="sa-obs" data-unit="' + uid + '"><div class="q">' + esc(u.text.slice(0, 220)) + '</div></div>'; }).join('');
    $('sa-psi').innerHTML = h; $('sa-psi').className = '';
    $('sa-psi').querySelectorAll('[data-unit]').forEach(function (el) { el.onclick = function () { U.selectUnit(el.dataset.unit); }; });
  };
  U.renderLayers = function (R) {
    var el = $('sa-layers'); if (!R.topic || !S.LAYERS) { el.innerHTML = ''; return; }
    el.innerHTML = S.LAYERS.map(function (L) { var n = R.topic[L.id] || 0; return '<div class="sa-lay' + (n ? ' on' : '') + '" title="' + esc(L.name) + '"><div class="sa-lay-id" style="' + (n ? 'color:' + L.color : '') + '">' + L.id + '</div><div class="sa-lay-ct">' + n + '</div></div>'; }).join('');
  };

  // ── obstructions, timeline, accounts ──
  U.renderObstructions = function (R, target) {
    var el = $(target || 'sa-obs');
    if (!R.obstructions.length) { el.innerHTML = '<div class="sa-panel-empty">No obstruction: every comparable set of extracted claims admits a global section.</div>'; return; }
    var order = { contradiction: 0, 'inconsistent-testimony': 1, 'conflicting-accounts': 2, 'tension-with-hypothesis': 3, question: 4 };
    var obs = R.obstructions.map(function (o, i) { return Object.assign({ i: i }, o); }).sort(function (a, b) { return order[a.class] - order[b.class]; });
    el.innerHTML = obs.map(function (o) {
      var cb = CLASS_BADGE[o.class] || ['b-q', o.class], m = o.magnitude;
      var mag = m.kind === 'epsilon-star' ? 'ε* = ' + m.value + ' days' : m.kind === 'relative-difference' ? 'Δ = ' + (m.value * 100).toFixed(1) + '%' : m.kind === 'harmonic-norm' ? '‖h‖ = ' + m.value : m.kind === 'strict-order-violation' ? 'strict order cycle' : 'P ∧ ¬P';
      return '<div class="sa-obs" data-obs="' + o.i + '"><span class="sa-badge ' + cb[0] + '">' + cb[1] + '</span><span class="sa-badge ' + LAYER_BADGE[o.layer] + '">' + o.layer + '</span><span class="sa-badge b-q">' + esc(mag) + '</span>' + (o.crossSource ? '<span class="sa-badge b-acc">across ' + esc(o.sources.join(' · ')) + '</span>' : '')
        + o.claims.map(function (id) { var c = claimOf(R, id); return '<div class="q">' + (c.source ? '<b style="color:#4ade80;font-family:JetBrains Mono,monospace;font-size:10px">' + esc(c.source) + '</b> ' : '') + esc(c.span.quote.slice(0, 260)) + (c.modality.kind !== 'asserted' ? ' <span class="sa-badge b-q">' + c.modality.kind + (c.modality.source ? ': ' + esc(c.modality.source) : '') + '</span>' : '') + '</div>'; }).join('')
        + '<div class="w">' + esc(o.witness) + '</div></div>';
    }).join('');
    el.querySelectorAll('[data-obs]').forEach(function (d) { d.onclick = function () { U.selectObstruction(R.obstructions[+d.dataset.obs]); }; });
  };
  U.renderTimeline = function (R) {
    var el = $('sa-timeline');
    if (!R.timeline || !R.timeline.length) { el.className = 'sa-panel-empty'; el.innerHTML = R.counts.date ? 'Dated events conflict; see obstructions.' : 'No dated events.'; return; }
    el.className = '';
    el.innerHTML = '<div class="sa-tl">' + R.timeline.slice(0, 60).map(function (t) { var iv = t.interval[0] === t.interval[1] ? t.interval[0] : t.interval[0] + ' … ' + t.interval[1]; return '<div class="d' + (t.conflict ? ' x' : '') + '">' + (t.conflict ? '✗ ' : '') + esc(iv) + '</div><div style="cursor:pointer" data-claim="' + t.claims[0] + '">' + esc(claimOf(R, t.claims[0]).span.quote.slice(0, 120)) + '</div>'; }).join('') + '</div>';
    el.querySelectorAll('[data-claim]').forEach(function (d) { d.onclick = function () { U.selectClaim(claimOf(R, d.dataset.claim)); }; });
  };
  U.renderAccounts = function (R) {
    var el = $('sa-accounts'), keys = Object.keys(R.accounts);
    if (!keys.length) { el.className = 'sa-panel-empty'; el.innerHTML = 'No reported speech with an identifiable source.'; return; }
    el.className = '';
    keys.sort(function (a, b) { return R.accounts[b].conflicts - R.accounts[a].conflicts || R.accounts[b].claims - R.accounts[a].claims; });
    el.innerHTML = '<table class="sa-table"><tr><th>source</th><th>claims</th><th>in conflicts</th></tr>' + keys.slice(0, 25).map(function (k) { var a = R.accounts[k]; return '<tr><td>' + esc(k) + '</td><td>' + a.claims + '</td><td style="color:' + (a.conflicts ? '#f0d48a' : '#6b8a6b') + '">' + a.conflicts + '</td></tr>'; }).join('') + '</table>';
  };

  // ── source text ──
  U.renderText = function (R, maxUnits) {
    var el = $('sa-text-view'), inObs = {}, unitClaims = {};
    R.claims.forEach(function (c) { (unitClaims[c.unit] = unitClaims[c.unit] || []).push(c); });
    R.obstructions.forEach(function (o) { o.claims.forEach(function (id) { inObs[claimOf(R, id).unit] = true; }); });
    var units = R.units, html = '', lastPara = -1, lastSrc = null, n = 0;
    var show = units; if (maxUnits && units.length > maxUnits) show = units.filter(function (u) { return inObs[u.id]; });
    show.forEach(function (u) {
      if (u.source !== lastSrc) { if (n) html += '</p>'; html += '<div style="font-family:JetBrains Mono,monospace;font-size:10px;color:#4ade80;margin-top:10px">' + esc(u.source || '') + '</div><p>'; lastSrc = u.source; lastPara = u.para; n++; }
      else if (u.para !== lastPara) { html += '</p><p>'; lastPara = u.para; }
      var cs = unitClaims[u.id] || [], cls = 'sa-u';
      if (u.nonclaim || u.heading) cls += ' nc'; else if (cs.length) cls += ' claim';
      if (cs.some(function (c) { return c.modality.kind === 'reported'; })) cls += ' rep';
      if (cs.some(function (c) { return c.modality.kind === 'hypothesized'; })) cls += ' hyp';
      if (inObs[u.id]) cls += ' obs';
      html += '<span class="' + cls + '" data-unit="' + u.id + '" id="txt-' + u.id + '">' + esc(u.text) + '</span> ';
    });
    el.innerHTML = (maxUnits && units.length > maxUnits ? '<div class="sa-panel-empty">Large corpus: showing only units involved in obstructions.</div>' : '') + '<p>' + html + '</p>';
    el.querySelectorAll('[data-unit]').forEach(function (s) { s.onclick = function () { U.selectUnit(s.dataset.unit); }; });
  };

  // ── inspector & selection ──
  U.selectUnit = function (uid) { var R = U.last; if (!R) return; var c = R.claims.filter(function (x) { return x.unit === uid; }); if (c.length) U.selectClaim(c.find(function (x) { return x.type !== 'proposition'; }) || c[0]); else { var u = R.units[+uid.slice(1)]; $('sa-inspector').innerHTML = '<h3>◉ Unit</h3><div class="sa-panel-empty">No claim extracted from this unit' + (u.nonclaim ? ' (reference, markup, math or metadata line)' : u.heading ? ' (heading)' : '') + '.</div><div class="sa-text-view" style="max-height:120px">' + esc(u.text) + '</div>'; } };
  U.highlight = function (uids) {
    document.querySelectorAll('.sa-u.sel').forEach(function (x) { x.classList.remove('sel'); });
    uids.forEach(function (u, i) { var el = $('txt-' + u); if (el) { el.classList.add('sel'); if (i === 0) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } });
  };
  U.selectClaim = function (c) {
    var R = U.last; if (!R || !c) return;
    var obs = R.obstructions.filter(function (o) { return o.claims.indexOf(c.id) >= 0; });
    var comps = R.edges.filter(function (e) { return e.a === c.id || e.b === c.id; });
    var val = c.type === 'numeric' ? c.values.map(function (v) { return esc(v.text) + (v.unit ? ' [' + esc(v.unit) + ']' : '') + (v.hedged ? ' ~' : ''); }).join(', ') + (c.scopeYears.length ? ' · scope ' + c.scopeYears.join(',') : '')
      : c.type === 'date' ? esc(S.util.dayStr(c.interval[0])) + (c.interval[1] !== c.interval[0] ? ' … ' + esc(S.util.dayStr(c.interval[1])) : '') + ' (' + c.precision + ')'
      : c.type === 'order' ? esc(c.a.join(' ')) + ' <b>' + c.relation + '</b> ' + esc(c.b.join(' ')) + (c.offsetDays != null ? ' by ' + Math.round(c.offsetDays) + ' days' : '')
      : c.type === 'relation' ? esc(c.x.join(' ')) + ' − ' + esc(c.y.join(' ')) + ' = ' + c.diff : (c.polarity < 0 ? 'negated' : 'affirmed');
    var kv = function (k, v) { return '<div class="sa-kv"><b>' + k + '</b><span>' + v + '</span></div>'; };
    $('sa-inspector').innerHTML = '<h3>◉ Claim ' + c.id + ' <span class="sa-badge" style="background:' + TYPE_COLOR[c.type] + '33;color:' + TYPE_COLOR[c.type] + '">' + c.type + '</span></h3>'
      + '<div class="sa-text-view" style="max-height:140px">' + esc(c.span.quote) + '</div>'
      + kv('value', val) + kv('modality', c.modality.kind + (c.modality.source ? ' — ' + esc(c.modality.source) : '')) + kv('polarity', c.polarity > 0 ? '+' : '−') + (c.source ? kv('source', esc(c.source)) : '') + kv('frame', esc(c.frame.slice(0, 10).join(' '))) + kv('span (UTF-16)', c.span.start + '–' + c.span.end)
      + '<h4>Comparisons (' + comps.length + ')</h4>' + (comps.slice(0, 8).map(function (e) { var o = claimOf(R, e.a === c.id ? e.b : e.a); return '<div class="sa-obs" data-claim="' + o.id + '"><span class="sa-badge ' + (e.conflict ? 'b-contra' : 'b-q') + '">' + (e.conflict ? 'conflict' : 'glues') + '</span><span class="sa-badge ' + LAYER_BADGE[e.layer] + '">' + e.layer + '</span><div class="q">' + esc(o.span.quote.slice(0, 160)) + '</div></div>'; }).join('') || '<div class="sa-panel-empty">none</div>')
      + '<h4>Obstructions (' + obs.length + ')</h4>' + (obs.map(function (o) { return '<div class="w" style="font-size:11px;color:#c8d8c8;margin-bottom:4px">' + o.layer + ' · ' + o.class + ' — ' + esc(o.witness) + '</div>'; }).join('') || '<div class="sa-panel-empty">none</div>');
    $('sa-inspector').querySelectorAll('[data-claim]').forEach(function (d) { d.onclick = function () { U.selectClaim(claimOf(R, d.dataset.claim)); }; });
    U.highlight([c.unit]);
    if (U.focusGraph) U.focusGraph(c.id);
  };
  U.selectObstruction = function (o) {
    var R = U.last; U.selectClaim(claimOf(R, o.claims[0]));
    U.highlight(o.claims.map(function (id) { return claimOf(R, id).unit; }));
  };

  // ── exports ──
  function stripClaims(R) { return R.claims.map(function (c) { var o = Object.assign({}, c); delete o.fset; return o; }); }
  U.exportDeep = function (R) {
    return JSON.stringify({ tool: 'Sheaf Analyzer v2', version: R.version, generated: R.generated, gamma: R.gamma, agreement: R.agreement, counts: R.counts, profile: R.profile,
      obstructions: R.obstructions.map(function (o) { return Object.assign({}, o, { quotes: o.claims.map(function (id) { var c = claimOf(R, id); return { claim: id, source: c.source, modality: c.modality, quote: c.span.quote, span: [c.span.start, c.span.end] }; }) }); }),
      psi: R.psi, timeline: R.timeline, hodge: R.hodge, accounts: R.accounts, perSource: R.perSource, topic: R.topic, claims: stripClaims(R), comparisons: R.edges }, null, 2);
  };
  U.exportFlat = function (R) { return JSON.stringify({ claims: R.claims.map(function (c) { return { id: c.id, type: c.type, source: c.source, modality: c.modality.kind, polarity: c.polarity, quote: c.span.quote }; }), comparisons: R.edges }, null, 2); };
  U.exportMarkdown = function (R) {
    var L = [];
    L.push('# Sheaf Analyzer v2 report', '', '> Paste this into a Claude or Draken session. The figures below are exact computations on claims extracted by a rule-based extractor; they say which claims cannot hold together, not which are true. Reported speech is kept separate from assertion.', '');
    L.push('## Γ per layer', '', '| layer | Γ | agreement |', '|---|---|---|');
    ['linear', 'ordinal', 'propositional'].forEach(function (k) { L.push('| ' + k + ' | ' + (R.gamma[k] === null ? 'N/A' : R.gamma[k]) + ' | ' + (R.agreement[k] != null ? Math.round(R.agreement[k] * 100) + '%' : '—') + ' |'); });
    L.push('', '**Counts:** ' + Object.keys(R.counts).map(function (k) { return k + ' ' + R.counts[k]; }).join(' · '), '');
    L.push('## Obstructions κ', '');
    if (!R.obstructions.length) L.push('None found.');
    R.obstructions.forEach(function (o, i) {
      L.push('### κ' + (i + 1) + ' — ' + o.layer + ' · ' + o.class, '', '*Witness:* ' + o.witness, '');
      o.claims.forEach(function (id) { var c = claimOf(R, id); L.push('- ' + (c.source ? '**' + c.source + '** ' : '') + '“' + c.span.quote + '”' + (c.modality.kind !== 'asserted' ? ' *(' + c.modality.kind + (c.modality.source ? ': ' + c.modality.source : '') + ')*' : '')); });
      L.push('');
    });
    if (R.timeline && R.timeline.length) { L.push('## Reconstructed timeline', ''); R.timeline.forEach(function (t) { L.push('- ' + t.interval.join(' … ') + (t.conflict ? ' ✗' : '') + ' — ' + claimOf(R, t.claims[0]).span.quote); }); L.push(''); }
    L.push('## Ψ epistemic closure (prototype)', '', '- ground: ' + R.psi.ground.value + ' · circ: ' + R.psi.circ.value + ' · seal: ' + R.psi.seal.value + ' · imp: ' + R.psi.imp.value + ' · anchored share: ' + R.psi.anchoredShare, '');
    L.push('---', '*Generated ' + R.generated + ' by Sheaf Analyzer v' + R.version + ' — Khrug Engineering, draken.info/sheaf-analyzer*');
    return L.join('\n');
  };
  U.download = function (name, content, mime) { var b = new Blob([content], { type: mime }), a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500); };

  // ── runs ──
  U.show = async function (R, opt) {
    U.last = R; opt = opt || {};
    U.renderMetrics(R); U.renderObstructions(R); U.renderTimeline(R); U.renderAccounts(R);
    U.renderText(R, opt.maxUnits);
    U.setProgress(80);
    await U.renderGraph(R);
    U.setProgress(100); setTimeout(function () { U.setProgress(0); }, 500);
    var first = R.obstructions[0]; if (first) U.selectObstruction(first);
  };
  U.run = async function () {
    var t = $('sa-text').value.trim(); if (!t) { alert('Paste some text first.'); return; }
    U.setProgress(15); await new Promise(function (r) { setTimeout(r, 20); });
    try { await U.show(S.analyze(t)); } catch (e) { alert('Analysis failed: ' + e.message); U.setProgress(0); }
  };
  U.runCorpus = async function () {
    if (!U.corpus) { alert('Corpus not loaded yet.'); return; } if (!U.corpusSel.size) { alert('Select at least one post.'); return; }
    var btn = $('sa-corpus-run'); btn.disabled = true; btn.textContent = '⟳ Analyzing…'; U.setProgress(10); await new Promise(function (r) { setTimeout(r, 20); });
    try {
      var src = U.corpus.posts.filter(function (p) { return U.corpusSel.has(p.drk || p.slug); }).map(function (p) { return { text: p.text, tag: p.drk || p.slug }; });
      var R = S.analyze(src); await U.show(R, { maxUnits: 1500 });
      var ps = R.perSource, rows = Object.keys(ps).filter(function (k) { return ps[k].conflicts; });
      if (rows.length) $('sa-verdict').innerHTML += '<br>' + rows.length + ' post(s) involved in obstructions; ' + R.obstructions.filter(function (o) { return o.crossSource; }).length + ' cross-post.';
    } catch (e) { alert('Corpus analysis failed: ' + e.message); }
    finally { btn.disabled = false; btn.textContent = '▸ Analyze selected'; U.setProgress(0); }
  };
  U.runCompare = async function () {
    var a = $('sa-cmp-a').value.trim(), b = $('sa-cmp-b').value.trim(); if (!a || !b) { alert('Paste both versions.'); return; }
    U.setProgress(15); await new Promise(function (r) { setTimeout(r, 20); });
    var C = S.compare(a, b); await U.show(C.joint);
    var sec = function (title, list, R) { return '<h4 style="font-size:11px;color:#4ade80;font-family:JetBrains Mono,monospace;margin:10px 0 6px">' + title + ' (' + list.length + ')</h4>' + (list.slice(0, 10).map(function (o) { return '<div class="sa-obs"><span class="sa-badge ' + LAYER_BADGE[o.layer] + '">' + o.layer + '</span><span class="sa-badge ' + (CLASS_BADGE[o.class] || ['b-q'])[0] + '">' + o.class + '</span>' + o.claims.map(function (id) { return '<div class="q">' + esc(claimOf(R, id).span.quote.slice(0, 200)) + '</div>'; }).join('') + '</div>'; }).join('') || '<div class="sa-panel-empty">none</div>'); };
    var k = C.K, kt = '<table class="sa-table"><tr><th>K(t) by layer</th><th>A</th><th>B</th></tr>' + ['linear', 'ordinal', 'propositional'].map(function (L) { return '<tr><td>' + L + '</td><td>' + k[L].A + '</td><td>' + k[L].B + '</td></tr>'; }).join('') + '</table>';
    $('sa-obs').innerHTML = kt + sec('B contradicts A (cross-version)', C.cross, C.joint) + sec('New in B', C.fresh, C.b) + sec('Resolved since A', C.resolved, C.a) + sec('Persistent', C.persistent, C.b);
  };

  // ── corpus list ──
  U.loadCorpus = async function (force) {
    if (U.corpus && !force) { U.renderCorpus(); return; }
    $('sa-corpus-count').textContent = 'Loading corpus…';
    try { var r = await fetch('/data/corpus.json?' + Date.now()); if (!r.ok) throw new Error('HTTP ' + r.status); U.corpus = await r.json(); U.renderCorpus(); }
    catch (e) { $('sa-corpus-list').innerHTML = '<div class="sa-panel-empty" style="color:#ef4444">Failed to load corpus: ' + esc(e.message) + '</div>'; }
  };
  U.renderCorpus = function () {
    var list = $('sa-corpus-list');
    list.innerHTML = U.corpus.posts.map(function (p) { var k = p.drk || p.slug; return '<label style="display:flex;align-items:center;gap:10px;padding:6px 4px;border-bottom:1px dashed #1a2c1a;cursor:pointer"><input type="checkbox" class="sa-corpus-cb" data-k="' + esc(k) + '" ' + (U.corpusSel.has(k) ? 'checked' : '') + ' style="accent-color:#4ade80"><div style="flex:1;min-width:0"><div style="font-size:12px;color:#c8d8c8;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><b style="color:#4ade80;font-family:JetBrains Mono,monospace;font-size:10px;margin-right:6px">' + esc(p.drk) + '</b>' + esc(p.title) + '</div><div style="font-size:10px;color:#6b8a6b;font-family:JetBrains Mono,monospace">' + esc(p.date) + ' · ' + p.words + ' words</div></div></label>'; }).join('');
    list.querySelectorAll('.sa-corpus-cb').forEach(function (cb) { cb.onchange = function () { if (cb.checked) U.corpusSel.add(cb.dataset.k); else U.corpusSel.delete(cb.dataset.k); U.corpusCount(); }; });
    U.corpusCount();
  };
  U.corpusCount = function () { var sel = U.corpus.posts.filter(function (p) { return U.corpusSel.has(p.drk || p.slug); }); $('sa-corpus-count').textContent = U.corpusSel.size + '/' + U.corpus.posts.length + ' selected · ' + sel.reduce(function (s, p) { return s + (p.words || 0); }, 0).toLocaleString() + ' words'; };

  U.setMode = function (m) {
    U.mode = m;
    document.querySelectorAll('.sa-mode-panel').forEach(function (p) { p.style.display = p.dataset.mode === m ? '' : 'none'; });
    ['single', 'corpus', 'compare'].forEach(function (k) { $('sa-mode-' + k).classList.toggle('ghost', k !== m); });
    if (m === 'corpus') U.loadCorpus(false);
  };
  U.fetchUrl = async function (url) {
    if (!/^https?:\/\//.test(url)) throw new Error('URL must start with http:// or https://');
    var ends = ['https://r.jina.ai/' + url, url];
    for (var i = 0; i < ends.length; i++) { try { var r = await fetch(ends[i], { mode: 'cors' }); if (!r.ok) continue; var t = await r.text(); if (i === 1 && /<html/i.test(t)) t = t.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' '); return t.trim(); } catch (e) { } }
    throw new Error('Fetch failed (CORS). Paste the text manually.');
  };

  U.init = function () {
    ['single', 'corpus', 'compare'].forEach(function (k) { $('sa-mode-' + k).onclick = function () { U.setMode(k); }; });
    $('sa-run').onclick = U.run;
    $('sa-clear').onclick = function () { $('sa-text').value = ''; $('sa-url').value = ''; };
    $('sa-fetch').onclick = async function () { var url = $('sa-url').value.trim(); if (!url) return; try { U.setProgress(10); var t = await U.fetchUrl(url); $('sa-text').value = t.slice(0, 200000); U.run(); } catch (e) { alert(e.message); U.setProgress(0); } };
    $('sa-corpus-run').onclick = U.runCorpus; $('sa-corpus-refresh').onclick = function () { U.loadCorpus(true); };
    $('sa-corpus-all').onclick = function () { U.corpus && U.corpus.posts.forEach(function (p) { U.corpusSel.add(p.drk || p.slug); }); U.corpus && U.renderCorpus(); };
    $('sa-corpus-none').onclick = function () { U.corpusSel.clear(); U.corpus && U.renderCorpus(); };
    $('sa-cmp-run').onclick = U.runCompare;
    $('sa-cmp-swap').onclick = function () { var a = $('sa-cmp-a'), b = $('sa-cmp-b'), t = a.value; a.value = b.value; b.value = t; };
    $('sa-cmp-sample').onclick = function () { $('sa-cmp-a').value = S.SAMPLES.versionA.text; $('sa-cmp-b').value = S.SAMPLES.versionB.text; };
    document.querySelectorAll('.sa-export-opt').forEach(function (b) { b.onclick = function () { if (!U.last) return; var ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-'); var f = b.dataset.fmt;
      if (f === 'deep') U.download('sheaf-v2-' + ts + '.json', U.exportDeep(U.last), 'application/json');
      else if (f === 'md') U.download('sheaf-v2-' + ts + '.md', U.exportMarkdown(U.last), 'text/markdown');
      else U.download('sheaf-v2-flat-' + ts + '.json', U.exportFlat(U.last), 'application/json');
      $('sa-export-hint').textContent = '✓ Exported. Check your Downloads folder.'; }; });
    var pick = $('sa-src-pick');
    Object.keys(S.SAMPLES).filter(function (k) { return !S.SAMPLES[k].hidden; }).forEach(function (k) { var b = document.createElement('button'); b.textContent = S.SAMPLES[k].label; b.onclick = function () { $('sa-text').value = S.SAMPLES[k].text; U.run(); }; pick.appendChild(b); });
    U.renderLayers({ topic: {} });
  };
})(SA2);
