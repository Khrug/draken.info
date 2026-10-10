// ═══ SA2 UI · EXPLORE ═══ insights tabs, entity-centred 2D graph, entity inspector, state reset.
(function (S) {
  'use strict';
  var U = S.ui, $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var TYPE_COLOR = { numeric: '#7dd3fc', date: '#fcd34d', order: '#fcd34d', proposition: '#e9a8ff', relation: '#a3e635' };
  var claimOf = function (R, id) { return R.claims[+String(id).slice(1)]; };
  var short = function (t, n) { t = String(t).replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n - 1) + '…' : t; };
  U.labelMode = 'auto'; U.tab = 'overview';

  // ── reset everything that belongs to a previous analysis ──
  U.reset = function () {
    $('sa-inspector').innerHTML = '<h3>◉ Inspector</h3><div class="sa-panel-empty">Tap an entity, concept or claim in the graph, an item in Insights or Obstructions, or a highlighted sentence in the text.</div>';
    document.querySelectorAll('.sa-u.sel').forEach(function (x) { x.classList.remove('sel'); });
    if (U.g) U.g.clear();
    var gs = $('sa-gsearch'); if (gs) gs.value = '';
  };

  // ── graph model: entities and concepts as labelled hubs, claims as small nodes ──
  U.graphModel = function (R, I) {
    var inObs = {}; R.obstructions.forEach(function (o) { o.claims.forEach(function (id) { inObs[id] = true; }); });
    var mode = U.density, nodes = [], links = [], have = {};
    var hubs = I.entities.slice(0, 40).concat(I.concepts.slice(0, mode === 'full' ? 18 : 12));
    var claimOk = function (c) {
      if (mode === 'focus') return !!inObs[c.id];
      if (c.type !== 'proposition') return true;
      if (inObs[c.id]) return true;
      return mode === 'full';
    };
    var hubOfClaim = {};
    hubs.forEach(function (h, i) { h.claims.forEach(function (id) { (hubOfClaim[id] = hubOfClaim[id] || []).push(i); }); });
    var claimsShown = R.claims.filter(function (c) { return claimOk(c) && (hubOfClaim[c.id] || inObs[c.id] || c.type !== 'proposition'); });
    if (claimsShown.length > 700) claimsShown = claimsShown.filter(function (c) { return inObs[c.id] || c.type !== 'proposition'; }).slice(0, 700);
    var usedHub = {};
    claimsShown.forEach(function (c) {
      have[c.id] = true;
      nodes.push({ id: c.id, kind: 'claim', type: c.type, r: inObs[c.id] ? 6 : 4, color: TYPE_COLOR[c.type], ring: !!inObs[c.id], label: short(c.span.quote, 42), long: short(c.span.quote, 120), importance: inObs[c.id] ? 5 : 1 });
      (hubOfClaim[c.id] || []).forEach(function (hi) { usedHub[hi] = true; links.push({ source: 'h' + hi, target: c.id, kind: 'mention', color: '#2f4f2f', width: 1 }); });
    });
    hubs.forEach(function (h, i) {
      if (mode === 'focus' && !usedHub[i]) return;
      if (!usedHub[i] && mode !== 'full' && h.kind === 'concept') return;
      nodes.push({ id: 'h' + i, kind: h.kind, r: Math.min(16, 6 + Math.sqrt(h.mentions) * 1.6), color: h.kind === 'entity' ? '#e4f0e4' : '#a7c4a7', ring: (h.obstructions || []).length > 0, label: h.name, long: h.name + ' · ' + h.mentions + ' mentions', importance: 10 + h.mentions, hub: h });
    });
    // entity–entity co-occurrence: hubs mentioned in the same sentence
    var shownHub = {}; nodes.forEach(function (n) { if (n.hub) shownHub[n.id] = n.hub; });
    var hk = Object.keys(shownHub), pairs = [];
    for (var a = 0; a < hk.length; a++) { var ua = new Set(shownHub[hk[a]].units || []); for (var b = a + 1; b < hk.length; b++) { var n2 = (shownHub[hk[b]].units || []).filter(function (u) { return ua.has(u); }).length; if (n2) pairs.push([hk[a], hk[b], n2]); } }
    pairs.sort(function (x, y) { return y[2] - x[2]; }).slice(0, 160).forEach(function (pr) { links.push({ source: pr[0], target: pr[1], kind: 'cooc', color: '#3d6b3d', width: Math.min(4, 0.8 + pr[2] * 0.6), len: 110, k: 0.02 + Math.min(0.06, pr[2] * 0.01) }); });
    var add = function (a, b, kind, color, width, extra) { if (have[a] && have[b]) links.push(Object.assign({ source: a, target: b, kind: kind, color: color, width: width }, extra || {})); };
    R.obstructions.forEach(function (o) { for (var i = 0; i < o.claims.length - 1; i++) add(o.claims[i], o.claims[i + 1], 'conflict', '#ef4444', 2.5); if (o.claims.length > 2) add(o.claims[o.claims.length - 1], o.claims[0], 'conflict', '#ef4444', 2.5); });
    R.edges.forEach(function (e) { if (!e.conflict) add(e.a, e.b, 'glue', '#4ade80', 1.5); });
    var byEvent = {}; R.claims.forEach(function (c) { if (c.event != null) (byEvent[c.event] = byEvent[c.event] || []).push(c.id); if (c.events) c.events.forEach(function (ev) { (byEvent[ev] = byEvent[ev] || []).push(c.id); }); });
    Object.keys(byEvent).forEach(function (k) { var ids = byEvent[k]; for (var i = 1; i < ids.length; i++) add(ids[i - 1], ids[i], 'event', '#fcd34d', 1.2, { dash: [4, 3] }); });
    var claimOfUnit = {}; R.claims.forEach(function (c) { if (have[c.id] && !claimOfUnit[c.unit]) claimOfUnit[c.unit] = c.id; });
    R.supportEdges.forEach(function (e) { if (e[0] !== e[1] && claimOfUnit[e[0]] && claimOfUnit[e[1]]) add(claimOfUnit[e[0]], claimOfUnit[e[1]], 'support', '#60a5fa', 1.5, { arrow: true }); });
    return { nodes: nodes, links: links };
  };
  U.renderGraph = function (R) {
    var empty = $('sa-graph-empty');
    if (!U.g) U.g = S.Graph2D($('sa-graph-canvas'), { onSelect: function (n) { if (!n) return; if (n.hub) U.selectEntity(n.hub, true); else U.selectClaim(claimOf(U.last, n.id), true); } });
    var m = U.graphModel(R, U.ins);
    U.g.setData(m); U.g.setLabelMode(U.labelMode);
    empty.style.display = m.nodes.length ? 'none' : '';
    if (!m.nodes.length) empty.textContent = U.density === 'focus' ? 'No obstructions to show.' : 'Nothing to draw: no entities, concepts or checkable claims found.';
    var hubs = m.nodes.filter(function (n) { return n.hub; }).length;
    $('sa-graph-overlay').textContent = '◆ ' + hubs + ' entities & concepts · ' + (m.nodes.length - hubs) + ' claims · ' + m.links.length + ' links — drag to pan · scroll/pinch to zoom · tap a node';
  };
  U.focusGraph = function (id) { if (U.g) U.g.selectId(id); };

  // ── entity / concept inspector ──
  U.selectEntity = function (h, fromGraph) {
    var R = U.last, I = U.ins; if (!R || !h) return;
    var cs = h.claims.map(function (id) { return claimOf(R, id); });
    var by = function (t) { return cs.filter(function (c) { return c.type === t; }); };
    var co = {}; (I.entities.concat(I.concepts)).forEach(function (o, i) { if (o === h) return; var shared = o.claims.filter(function (x) { return h.claims.indexOf(x) >= 0; }).length; if (shared) co[i] = shared; });
    var hubsAll = I.entities.concat(I.concepts);
    var coList = Object.keys(co).sort(function (a, b) { return co[b] - co[a]; }).slice(0, 14);
    var line = function (c) { return '<div class="sa-obs" data-claim="' + c.id + '"><span class="sa-badge" style="background:' + TYPE_COLOR[c.type] + '22;color:' + TYPE_COLOR[c.type] + '">' + c.type + '</span>' + (c.modality.kind !== 'asserted' ? '<span class="sa-badge b-q">' + c.modality.kind + (c.modality.source ? ': ' + esc(short(c.modality.source, 24)) : '') + '</span>' : '') + '<div class="q">' + esc(short(c.span.quote, 220)) + '</div></div>'; };
    var props = by('proposition').filter(function (c) { return !cs.some(function (o) { return o.unit === c.unit && o.type !== 'proposition'; }); });
    var html = '<h3>◉ ' + esc(h.name) + ' <span class="sa-badge b-q">' + h.kind + '</span></h3>'
      + '<div class="sa-kv"><b>mentions</b><span>' + h.mentions + '</span></div><div class="sa-kv"><b>sentences</b><span>' + (h.units || []).length + '</span></div>'
      + (h.sources && h.sources.length ? '<div class="sa-kv"><b>sources</b><span>' + esc(h.sources.slice(0, 6).join(', ')) + '</span></div>' : '')
      + '<div class="sa-kv"><b>in obstructions</b><span style="color:' + ((h.obstructions || []).length ? '#ef4444' : '#6b8a6b') + '">' + (h.obstructions || []).length + '</span></div>'
      + (coList.length ? '<h4>Appears with</h4><div>' + coList.map(function (i) { var o = hubsAll[+i]; return '<span class="sa-chipbtn' + (o.kind === 'concept' ? ' c' : '') + '" data-hub="' + i + '">' + esc(o.name) + ' · ' + co[i] + '</span>'; }).join('') + '</div>' : '')
      + (by('date').length ? '<h4>Dates (' + by('date').length + ')</h4>' + by('date').map(line).join('') : '')
      + (by('numeric').length ? '<h4>Figures (' + by('numeric').length + ')</h4>' + by('numeric').map(line).join('') : '')
      + (by('order').concat(by('relation')).length ? '<h4>Order & relations</h4>' + by('order').concat(by('relation')).map(line).join('') : '')
      + '<h4>Statements (' + props.length + ')</h4>' + (props.slice(0, 30).map(line).join('') || '<div class="sa-panel-empty">none</div>') + (props.length > 30 ? '<div class="sa-panel-empty">… ' + (props.length - 30) + ' more</div>' : '');
    var el = $('sa-inspector'); el.innerHTML = html; el.scrollTop = 0;
    el.querySelectorAll('[data-claim]').forEach(function (d) { d.onclick = function () { U.selectClaim(claimOf(R, d.dataset.claim)); }; });
    el.querySelectorAll('[data-hub]').forEach(function (d) { d.onclick = function () { U.selectEntity(hubsAll[+d.dataset.hub]); }; });
    U.highlight(h.units || []);
    if (!fromGraph && U.g) { var idx = hubsAll.indexOf(h); U.g.selectId('h' + idx); }
  };

  // claim inspector: add the entities a claim mentions
  var baseSelectClaim = U.selectClaim;
  U.selectClaim = function (c, fromGraph) {
    if (!c) return;
    var keep = U.focusGraph; if (fromGraph) U.focusGraph = null;
    baseSelectClaim(c);
    U.focusGraph = keep;
    var I = U.ins; if (!I) return;
    var hubsAll = I.entities.concat(I.concepts), mine = [];
    hubsAll.forEach(function (h, i) { if (h.claims.indexOf(c.id) >= 0) mine.push(i); });
    if (mine.length) { var el = $('sa-inspector'), div = document.createElement('div'); div.innerHTML = '<h4>Mentions</h4>' + mine.slice(0, 16).map(function (i) { var h = hubsAll[i]; return '<span class="sa-chipbtn' + (h.kind === 'concept' ? ' c' : '') + '" data-hub="' + i + '">' + esc(h.name) + '</span>'; }).join('');
      el.insertBefore(div, el.querySelector('h4')); div.querySelectorAll('[data-hub]').forEach(function (d) { d.onclick = function () { U.selectEntity(hubsAll[+d.dataset.hub]); }; }); }
    $('sa-inspector').scrollTop = 0;
  };

  // ── insights tabs ──
  var TABS = [
    ['overview', 'Overview'], ['entities', 'Entities & concepts'], ['figures', 'Figures'], ['timeline', 'Timeline'],
    ['arguments', 'Arguments'], ['accounts', 'Who says what'], ['tensions', 'Possible tensions'], ['agreements', 'Repeated & consistent']
  ];
  U.renderInsights = function () {
    var I = U.ins, R = U.last; if (!I) return;
    var count = { overview: I.highlights.length, entities: I.entities.length + I.concepts.length, figures: I.quantities.length, timeline: I.dated.length + I.orders.length, arguments: I.arguments.length + I.sealing.length, accounts: Object.keys(I.bySource).length, tensions: I.tensions.length, agreements: I.corroborated.length };
    $('sa-tabs').innerHTML = TABS.map(function (t) { return '<button class="sa-tab' + (U.tab === t[0] ? ' on' : '') + '" data-tab="' + t[0] + '">' + t[1] + '<span class="n">' + count[t[0]] + '</span></button>'; }).join('');
    $('sa-tabs').querySelectorAll('[data-tab]').forEach(function (b) { b.onclick = function () { U.tab = b.dataset.tab; U.renderInsights(); }; });
    var el = $('sa-ins'), h = '', hubsAll = I.entities.concat(I.concepts);
    var row = function (cells, claim) { return '<tr' + (claim ? ' class="sa-row-click" data-claim="' + claim + '"' : '') + '>' + cells.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; };
    var empty = function (t) { return '<div class="sa-panel-empty">' + t + '</div>'; };
    if (U.tab === 'overview') {
      var m = I.modality, tot = m.asserted + m.reported + m.hypothesized + m.question || 1, bar = function (v, c) { return '<span style="display:inline-block;height:10px;width:' + (100 * v / tot) + '%;background:' + c + '"></span>'; };
      h = '<ul>' + (I.highlights.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') || '<li>Nothing notable found.</li>') + '</ul>'
        + '<h4 style="font-size:11px;color:#4ade80;font-family:JetBrains Mono,monospace;margin:12px 0 6px">HOW THE TEXT SPEAKS</h4><div style="display:flex;width:100%;border-radius:3px;overflow:hidden;margin-bottom:4px">' + bar(m.asserted, '#4ade80') + bar(m.reported, '#e6cc6a') + bar(m.hypothesized, '#c4bfff') + bar(m.question, '#6b8a6b') + '</div>'
        + '<div style="font-size:11px;color:#8faf8f;font-family:JetBrains Mono,monospace"><span style="color:#4ade80">■</span> asserted ' + m.asserted + ' · <span style="color:#e6cc6a">■</span> reported ' + m.reported + ' · <span style="color:#c4bfff">■</span> hypothetical ' + m.hypothesized + ' · <span style="color:#6b8a6b">■</span> questions ' + m.question + '</div>'
        + '<div style="font-size:11px;color:#8faf8f;font-family:JetBrains Mono,monospace;margin-top:6px">checkable sentences (carry a figure, date or order relation): ' + I.checkability.typed + ' of ' + I.checkability.units + ' (' + Math.round(I.checkability.share * 100) + '%)</div>'
        + (I.entities.length ? '<h4 style="font-size:11px;color:#4ade80;font-family:JetBrains Mono,monospace;margin:12px 0 6px">KEY ENTITIES</h4>' + I.entities.slice(0, 16).map(function (e) { return '<span class="sa-chipbtn" data-hub="' + hubsAll.indexOf(e) + '">' + esc(e.name) + ' · ' + e.mentions + '</span>'; }).join('') : '')
        + (I.concepts.length ? '<h4 style="font-size:11px;color:#4ade80;font-family:JetBrains Mono,monospace;margin:12px 0 6px">KEY CONCEPTS</h4>' + I.concepts.slice(0, 16).map(function (e) { return '<span class="sa-chipbtn c" data-hub="' + hubsAll.indexOf(e) + '">' + esc(e.name) + ' · ' + e.mentions + '</span>'; }).join('') : '');
    } else if (U.tab === 'entities') {
      h = '<table class="sa-table"><tr><th>name</th><th>kind</th><th>mentions</th><th>claims</th><th>in conflicts</th>' + (R.sources.length > 1 ? '<th>sources</th>' : '') + '</tr>'
        + hubsAll.map(function (e, i) { return '<tr class="sa-row-click" data-hub="' + i + '"><td>' + esc(e.name) + '</td><td>' + e.kind + '</td><td>' + e.mentions + '</td><td>' + e.claims.length + '</td><td style="color:' + (e.obstructions.length ? '#ef4444' : '#6b8a6b') + '">' + e.obstructions.length + '</td>' + (R.sources.length > 1 ? '<td>' + (e.sources ? e.sources.length : '') + '</td>' : '') + '</tr>'; }).join('') + '</table>';
    } else if (U.tab === 'figures') {
      h = I.quantities.length ? '<table class="sa-table"><tr><th>value</th><th>context</th><th>status</th></tr>' + I.quantities.map(function (q) { return row([esc(q.values) + (q.hedged ? ' ~' : ''), esc(short(q.quote, 140)) + (q.source ? ' <span style="color:#4ade80">' + esc(q.source) + '</span>' : ''), (q.obstruction ? '<span style="color:#ef4444">conflict</span>' : '') + (q.modality !== 'asserted' ? ' ' + q.modality : '')], q.claim); }).join('') + '</table>' : empty('No figures with recognisable values.');
    } else if (U.tab === 'timeline') {
      h = (I.dated.length ? '<table class="sa-table"><tr><th>when</th><th>what</th><th></th></tr>' + I.dated.map(function (d) { return row([d.lo === d.hi ? d.lo : d.lo + ' … ' + d.hi, esc(short(d.quote, 150)) + (d.source ? ' <span style="color:#4ade80">' + esc(d.source) + '</span>' : ''), (d.obstruction ? '<span style="color:#ef4444">conflict</span> ' : '') + (d.modality !== 'asserted' ? d.modality : '')], d.claim); }).join('') + '</table>' : empty('No dated events.'))
        + (I.orders.length ? '<h4 style="font-size:11px;color:#4ade80;font-family:JetBrains Mono,monospace;margin:12px 0 6px">ORDER STATEMENTS</h4><table class="sa-table">' + I.orders.map(function (o) { return row([o.relation, esc(short(o.quote, 160)), o.obstruction ? '<span style="color:#ef4444">cycle</span>' : ''], o.claim); }).join('') + '</table>' : '');
    } else if (U.tab === 'arguments') {
      h = (I.arguments.length ? '<table class="sa-table"><tr><th>premise</th><th></th><th>conclusion</th></tr>' + I.arguments.map(function (a) { return '<tr class="sa-row-click" data-unit="' + a.conclusion + '"><td>' + esc(short(a.premiseText, 110)) + '</td><td style="color:#60a5fa">→</td><td>' + esc(short(a.conclusionText, 110)) + '</td></tr>'; }).join('') + '</table>' : empty('No explicit inference markers (therefore, thus, which shows…).'))
        + (I.ungrounded.length ? '<h4 style="font-size:11px;color:#c9a84c;font-family:JetBrains Mono,monospace;margin:12px 0 6px">CONCLUSIONS WITHOUT A GROUNDED SUPPORT CHAIN</h4>' + I.ungrounded.map(function (u) { return '<div class="sa-obs" data-unit="' + u.unit + '"><div class="q">' + esc(short(u.text, 220)) + '</div></div>'; }).join('') : '')
        + (I.sealing.length ? '<h4 style="font-size:11px;color:#ef4444;font-family:JetBrains Mono,monospace;margin:12px 0 6px">SELF-SEALING</h4>' + I.sealing.map(function (u) { return '<div class="sa-obs" data-unit="' + u.unit + '"><div class="q">' + esc(short(u.text, 220)) + '</div></div>'; }).join('') : '')
        + (I.hedged.length ? '<h4 style="font-size:11px;color:#c4bfff;font-family:JetBrains Mono,monospace;margin:12px 0 6px">HEDGED / HYPOTHETICAL (' + I.hedged.length + ')</h4>' + I.hedged.slice(0, 25).map(function (x) { return '<div class="sa-obs" data-claim="' + x.claim + '"><div class="q">' + esc(short(x.quote, 200)) + '</div></div>'; }).join('') : '');
    } else if (U.tab === 'accounts') {
      var ks = Object.keys(I.bySource).sort(function (a, b) { return I.bySource[b].length - I.bySource[a].length; });
      h = ks.length ? ks.map(function (k) { var L = I.bySource[k]; return '<details' + (L.some(function (x) { return x.obstruction; }) ? ' open' : '') + '><summary style="cursor:pointer;color:#e6cc6a;font-family:JetBrains Mono,monospace;font-size:12px">' + esc(k) + ' — ' + L.length + ' statement' + (L.length > 1 ? 's' : '') + (L.some(function (x) { return x.obstruction; }) ? ' · <span style="color:#ef4444">in conflict</span>' : '') + '</summary>' + L.map(function (x) { return '<div class="sa-obs" data-claim="' + x.claim + '"><div class="q">' + esc(short(x.quote, 220)) + '</div></div>'; }).join('') + '</details>'; }).join('') : empty('No reported speech with an identifiable source.');
    } else if (U.tab === 'tensions') {
      h = '<div class="sa-panel-empty" style="font-style:normal">Looser matches than the formal layers accept. Not contradictions: candidates for a human to check.</div>'
        + (I.tensions.map(function (t) { return '<div class="sa-obs" data-claim="' + t.claims[0] + '"><span class="sa-badge b-acc">' + esc(t.kind) + '</span><div class="q">' + esc(short(t.a, 200)) + '</div><div class="q">' + esc(short(t.b, 200)) + '</div><div class="w">' + esc(t.note) + '</div></div>'; }).join('') || empty('None found.'));
    } else if (U.tab === 'agreements') {
      h = I.corroborated.length ? I.corroborated.map(function (c) { return '<div class="sa-obs" data-claim="' + c.claims[0] + '"><span class="sa-badge b-q">' + c.layer + '</span>' + (c.crossSource ? '<span class="sa-badge b-acc">across sources</span>' : '') + '<div class="q" style="border-color:#1a6b38">' + esc(short(c.a, 200)) + '</div><div class="q" style="border-color:#1a6b38">' + esc(short(c.b, 200)) + '</div></div>'; }).join('') : empty('No statement is made twice.');
    }
    el.innerHTML = h;
    el.querySelectorAll('[data-claim]').forEach(function (d) { d.onclick = function () { U.selectClaim(claimOf(R, d.dataset.claim)); }; });
    el.querySelectorAll('[data-hub]').forEach(function (d) { d.onclick = function () { U.selectEntity(hubsAll[+d.dataset.hub]); }; });
    el.querySelectorAll('[data-unit]').forEach(function (d) { d.onclick = function () { U.selectUnit(d.dataset.unit); }; });
  };

  // ── show: reset, compute insights, render ──
  U.show = async function (R, opt) {
    U.reset();
    U.last = R; opt = opt || {}; U.ins = S.insights(R);
    U.renderMetrics(R); U.renderObstructions(R); U.renderTimeline(R); U.renderAccounts(R);
    U.renderInsights(); U.renderText(R, opt.maxUnits);
    U.setProgress(80); U.renderGraph(R);
    U.setProgress(100); setTimeout(function () { U.setProgress(0); }, 500);
    if (R.obstructions[0]) U.selectObstruction(R.obstructions[0]);
    else if (U.ins.entities[0] || U.ins.concepts[0]) U.selectEntity(U.ins.entities[0] || U.ins.concepts[0]);
  };
  var baseDeep = U.exportDeep;
  U.exportDeep = function (R) { var o = JSON.parse(baseDeep(R)); var I = U.ins; o.insights = { highlights: I.highlights, checkability: I.checkability, modality: I.modality, entities: I.entities.map(function (e) { return { name: e.name, mentions: e.mentions, claims: e.claims.length, obstructions: e.obstructions.length }; }), concepts: I.concepts.map(function (e) { return { name: e.name, mentions: e.mentions }; }), figures: I.quantities, timeline: I.dated, orders: I.orders, arguments: I.arguments, ungrounded: I.ungrounded, sealing: I.sealing, accounts: I.bySource, tensions: I.tensions, repeated: I.corroborated }; return JSON.stringify(o, null, 2); };
  var baseMd = U.exportMarkdown;
  U.exportMarkdown = function (R) {
    var I = U.ins, md = baseMd(R).split('\n'), at = md.indexOf('## Γ per layer');
    var add = ['## Highlights', ''].concat(I.highlights.map(function (h) { return '- ' + h; }), ['', '**Key entities:** ' + I.entities.slice(0, 15).map(function (e) { return e.name + ' (' + e.mentions + ')'; }).join(', '), '', '**Key concepts:** ' + I.concepts.slice(0, 15).map(function (e) { return e.name; }).join(', '), '']);
    if (I.tensions.length) add = add.concat(['## Possible tensions (for review)', ''], I.tensions.map(function (t) { return '- *' + t.kind + '* — “' + t.a + '” / “' + t.b + '” (' + t.note + ')'; }), ['']);
    md.splice(at, 0, add.join('\n')); return md.join('\n');
  };

  // ── controls ──
  var baseInit = U.init;
  U.init = function () {
    baseInit();
    ['focus', 'balanced', 'full'].forEach(function (d) { $('sa-gc-dens-' + d).onclick = function () { U.density = d; document.querySelectorAll('.sa-gc-dens').forEach(function (b) { b.classList.toggle('sa-gc-on', b.id === 'sa-gc-dens-' + d); }); if (U.last) U.renderGraph(U.last); }; });
    $('sa-gc-labels').onclick = function () { U.labelMode = { auto: 'all', all: 'none', none: 'auto' }[U.labelMode]; this.textContent = 'labels: ' + U.labelMode; if (U.g) U.g.setLabelMode(U.labelMode); };
    $('sa-gc-fit').onclick = $('sa-zoom-reset').onclick = function () { if (U.g) U.g.fit(); };
    $('sa-gc-reheat').onclick = function () { if (U.g) U.g.reheat(); };
    $('sa-zoom-in').onclick = function () { if (U.g) U.g.zoom(1.35); };
    $('sa-zoom-out').onclick = function () { if (U.g) U.g.zoom(1 / 1.35); };
    var t = null; $('sa-gsearch').oninput = function () { var q = this.value; clearTimeout(t); t = setTimeout(function () { if (!U.g) return; var hits = U.g.search(q); $('sa-graph-overlay').textContent = q ? '◆ ' + hits.length + ' match' + (hits.length === 1 ? '' : 'es') + ' for “' + q + '”' : '◆ drag to pan · scroll/pinch to zoom · tap a node'; }, 180); };
    $('sa-gsearch').onkeydown = function (e) { if (e.key === 'Enter' && U.g) { var hits = U.g.search(this.value); if (hits[0]) { if (hits[0].hub) U.selectEntity(hits[0].hub, true); else U.selectClaim(claimOf(U.last, hits[0].id), true); } } };
  };
})(SA2);
// auto-init lives at the end of ui-review.js (the last UI module)
