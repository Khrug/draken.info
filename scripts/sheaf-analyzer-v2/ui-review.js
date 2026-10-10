// ═══ SA2 UI · REVIEW ═══ fact-check, paper review, sources, sentiment, loaded language & framing,
// stance, fallacies & devices, appeals, Ishikawa reasoning map. Loads after ui-explore.js.
(function (S) {
  'use strict';
  var U = S.ui, $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var short = function (t, n) { t = String(t).replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n - 1) + '…' : t; };
  var H4 = function (t, c) { return '<h4 class="sa-h4"' + (c ? ' style="color:' + c + '"' : '') + '>' + t + '</h4>'; };
  var empty = function (t) { return '<div class="sa-panel-empty">' + t + '</div>'; };
  var method = function (t) { return '<div class="sa-method">' + esc(t) + '</div>'; };
  var chip = function (t, n, unit, cls) { return '<span class="sa-chipbtn' + (cls ? ' ' + cls : '') + '"' + (unit ? ' data-unit="' + unit + '"' : '') + '>' + esc(t) + (n != null ? ' · ' + n : '') + '</span>'; };
  var sent = function (unit, text, extra, border) { return '<div class="sa-obs" data-unit="' + unit + '">' + (extra || '') + '<div class="q"' + (border ? ' style="border-color:' + border + '"' : '') + '>' + esc(short(text, 260)) + '</div></div>'; };
  var SEV = { high: '#ef4444', medium: '#f59e0b', low: '#c9a84c', info: '#6b8a6b' };
  var STATUS = function (s) { return /decision/.test(s) ? '#ef4444' : /inconsistent|mismatch/.test(s) ? '#f59e0b' : /not testable/.test(s) ? '#6b8a6b' : '#4ade80'; };
  U.rtab = 'factcheck';

  var TABS = [['factcheck', 'Fact-check'], ['paper', 'Paper review'], ['sources', 'Sources'], ['sentiment', 'Sentiment'], ['loaded', 'Loaded words & framing'],
    ['stance', 'Stance'], ['fallacies', 'Fallacies & devices'], ['appeals', 'Logos · ethos · pathos']];

  // ── small SVG helpers ──
  function bars(rows, max) { // rows: [label, value, color, note]
    max = max || Math.max.apply(null, rows.map(function (r) { return r[1]; }).concat([1]));
    return '<div class="sa-bars">' + rows.map(function (r) { return '<div class="sa-barrow"><span class="l">' + esc(r[0]) + '</span><span class="b"><i style="width:' + Math.min(100, 100 * r[1] / max) + '%;background:' + (r[2] || '#4ade80') + '"></i></span><span class="v">' + r[1] + (r[3] ? ' <em>' + esc(r[3]) + '</em>' : '') + '</span></div>'; }).join('') + '</div>';
  }
  function gauge(v, left, right) { // v in [-1, 1]
    if (v == null) return '<div class="sa-gauge na">insufficient signal</div>';
    var x = 50 + 50 * v; return '<div class="sa-gauge"><span class="ends">' + esc(left) + '</span><span class="track"><i style="left:' + x + '%"></i></span><span class="ends">' + esc(right) + '</span><span class="val">' + (v > 0 ? '+' : '') + v.toFixed(2) + '</span></div>';
  }
  // Sentiment arc. Up to 400 sentences: one dot each. Longer texts: per-pixel-column bands (min–max range,
  // coloured by the column mean) plus a rolling mean, so 20,000 sentences draw as ~1,000 elements.
  // Tap or click anywhere on the chart: the nearest sentence is selected and shown in the box below.
  function arcSvg(arc, width) {
    if (!arc || !arc.length) return '';
    var w = Math.max(280, (width || 1000) - 18), h = 130, n = arc.length, dx = n > 1 ? w / (n - 1) : 0, y = function (c) { return h / 2 - c * (h / 2 - 8); };
    var col = function (c) { return c >= 0.05 ? '#4ade80' : c <= -0.05 ? '#ef4444' : '#6b8a6b'; }, body = '';
    if (n <= 400) {
      var pts = arc.map(function (a, i) { return [i * dx, y(a.c)]; });
      body = '<path d="' + pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ') + '" fill="none" stroke="#3a5a3a" stroke-width="1.5"/>'
        + arc.map(function (a, i) { return '<circle cx="' + pts[i][0].toFixed(1) + '" cy="' + pts[i][1].toFixed(1) + '" r="' + (n > 150 ? 2.5 : n > 60 ? 3.2 : 4.5) + '" fill="' + col(a.c) + '"/>'; }).join('');
    } else {
      var cols = Math.min(Math.floor(w / 2), n), per = n / cols, win = Math.max(5, Math.round(n / 80)), cum = [0];
      arc.forEach(function (a, i) { cum.push(cum[i] + a.c); });
      for (var k = 0; k < cols; k++) { var a0 = Math.floor(k * per), a1 = Math.max(a0 + 1, Math.floor((k + 1) * per)), mn = 1, mx = -1, sm = 0;
        for (var q = a0; q < a1; q++) { var c = arc[q].c; if (c < mn) mn = c; if (c > mx) mx = c; sm += c; }
        var x = (k + 0.5) * w / cols; body += '<line x1="' + x.toFixed(1) + '" x2="' + x.toFixed(1) + '" y1="' + y(mx).toFixed(1) + '" y2="' + (y(mn) + 0.5).toFixed(1) + '" stroke="' + col(sm / (a1 - a0)) + '" stroke-opacity=".55" stroke-width="' + Math.max(1, w / cols * 0.8).toFixed(1) + '"/>'; }
      var line = []; for (var k2 = 0; k2 < cols; k2++) { var c0 = Math.floor((k2 + 0.5) * per), lo = Math.max(0, c0 - win), hi = Math.min(n, c0 + win + 1); line.push(((k2 + 0.5) * w / cols).toFixed(1) + ' ' + y((cum[hi] - cum[lo]) / (hi - lo)).toFixed(1)); }
      body += '<path d="M' + line.join(' L') + '" fill="none" stroke="#e4f0e4" stroke-width="1.6"/>';
    }
    var sel = U.arcSel != null && U.arcSel < n ? U.arcSel : null, mark = sel != null ? '<line x1="' + (sel * dx).toFixed(1) + '" x2="' + (sel * dx).toFixed(1) + '" y1="2" y2="' + (h - 2) + '" stroke="#7dd3fc" stroke-width="1.5"/><circle cx="' + (sel * dx).toFixed(1) + '" cy="' + y(arc[sel].c).toFixed(1) + '" r="6" fill="none" stroke="#7dd3fc" stroke-width="2"/>' : '';
    return '<svg class="sa-arc" id="sa-arc" data-w="' + w + '" viewBox="-8 0 ' + (w + 16) + ' ' + h + '" preserveAspectRatio="xMidYMid meet"><line x1="0" x2="' + w + '" y1="' + h / 2 + '" y2="' + h / 2 + '" stroke="#1a2c1a" stroke-dasharray="4 4"/>' + body + mark + '<rect x="-8" y="0" width="' + (w + 16) + '" height="' + h + '" fill="transparent"/></svg>'
      + '<div class="sa-axis"><span>start</span><span>end</span></div><div class="sa-method" style="text-align:center;margin-top:2px">' + (n > 400 ? 'bands: range per slice · white line: rolling mean · ' : '') + 'tap anywhere to read that sentence</div>'
      + '<div id="sa-arc-info" class="sa-arc-info">' + arcInfo(arc, sel) + '</div>';
  }
  function arcInfo(arc, i) {
    if (i == null) return '<div class="sa-method">No sentence selected. Tap the chart, or use the buttons below to step through the text.</div>' + arcNav();
    var a = arc[i], R = U.last, u = R.units[+a.unit.slice(1)], t = u ? (u.cleanText || u.text) : '', v = S.vader.score(t) || { words: [] };
    var c = a.c >= 0.05 ? '#4ade80' : a.c <= -0.05 ? '#ef4444' : '#8faf8f', label = a.c >= 0.05 ? 'positive' : a.c <= -0.05 ? 'negative' : 'neutral';
    var where = []; if (u && u.source) where.push(String(u.source).replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, ''));
    var hd = null; if (u) for (var k = +u.id.slice(1); k >= 0; k--) { var x = R.units[k]; if (x.heading && /^\s*#/.test(x.text) && (!u.source || x.source === u.source)) { hd = x.text.replace(/^#+\s*/, '').replace(/[*_`]/g, ''); break; } }
    if (hd) where.push(hd);
    var lo = Math.max(0, i - 25), hi = Math.min(arc.length, i + 26), loc = 0; for (var q = lo; q < hi; q++) loc += arc[q].c; loc /= (hi - lo);
    return '<div class="sa-arc-head"><b style="color:' + c + '">' + (a.c > 0 ? '+' : '') + a.c.toFixed(3) + '</b> ' + label + ' · sentence ' + (i + 1).toLocaleString('en') + ' of ' + arc.length.toLocaleString('en') + (where.length ? ' · ' + esc(where.join(' › ')) : '') + '</div>'
      + '<div class="q">' + esc(t) + '</div>'
      + '<div class="w">positive ' + Math.round(a.pos * 100) + '% · negative ' + Math.round(a.neg * 100) + '% · neutral ' + Math.max(0, 100 - Math.round(a.pos * 100) - Math.round(a.neg * 100)) + '% of the scored words · surrounding ±25 sentences average ' + (loc > 0 ? '+' : '') + loc.toFixed(3) + '</div>'
      + (v.words.length ? '<div class="w">words driving the score: ' + v.words.map(function (h) { return '<span style="color:' + (h.v > 0 ? '#86efac' : '#ffb4b4') + '">' + esc(h.w) + ' ' + (h.v > 0 ? '+' : '') + h.v.toFixed(2) + '</span>'; }).join(', ') + '</div>' : '<div class="w">no word in this sentence is in the VADER lexicon, so it scores 0.</div>')
      + arcNav(true);
  }
  function arcNav(has) { return '<div class="sa-arc-nav"><button class="sa-btn sa-btn-sm" data-arcgo="prev">◀ previous</button><button class="sa-btn sa-btn-sm" data-arcgo="next">next ▶</button><button class="sa-btn sa-btn-sm" data-arcgo="neg">next negative ▼</button><button class="sa-btn sa-btn-sm" data-arcgo="pos">next positive ▲</button>' + (has ? '<button class="sa-btn sa-btn-sm" data-arcgo="text">show in text</button>' : '') + '</div>'; }
  function bindArc() {
    var svg = $('sa-arc'), SE = U.disc && U.disc.rhetoric.sentiment; if (!svg || !SE) return;
    var arc = SE.arc, n = arc.length, w = +svg.dataset.w;
    var pick = function (i) { U.arcSel = Math.max(0, Math.min(n - 1, i)); var box = svg.parentNode, keep = window.scrollY; var wrap = document.createElement('div'); wrap.innerHTML = arcSvg(arc, box.clientWidth);
      var parts = Array.prototype.slice.call(wrap.childNodes); var axis = svg.nextElementSibling, hint = axis.nextElementSibling, info = $('sa-arc-info'); svg.replaceWith(parts[0]); axis.replaceWith(parts[1]); hint.replaceWith(parts[2]); info.replaceWith(parts[3]); window.scrollTo(0, keep); bindArc(); };
    svg.addEventListener('click', function (e) { var r = svg.getBoundingClientRect(), vbx = (e.clientX - r.left) / r.width * (w + 16) - 8; pick(n > 1 ? Math.round(vbx / (w / (n - 1))) : 0); });
    document.querySelectorAll('[data-arcgo]').forEach(function (b) { b.onclick = function () { var i = U.arcSel == null ? -1 : U.arcSel, g = b.dataset.arcgo, k;
      if (g === 'prev') pick(Math.max(0, i - 1)); else if (g === 'next') pick(i + 1);
      else if (g === 'neg' || g === 'pos') { for (k = i + 1; k < n; k++) if (g === 'neg' ? arc[k].c <= -0.05 : arc[k].c >= 0.05) break; if (k < n) pick(k); }
      else if (g === 'text' && U.arcSel != null) { var id = arc[U.arcSel].unit; U.selectUnit(id); var el = $('txt-' + id); if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' }); else b.textContent = 'not in the text view (corpus mode shows only sentences in conflicts)'; } }; });
  }
  function pHist(values) {
    var ex = values.filter(function (p) { return p.cmp === '=' && p.v <= 0.1; }); if (ex.length < 3) return '';
    var bins = new Array(20).fill(0); ex.forEach(function (p) { bins[Math.min(19, Math.floor(p.v / 0.005))]++; });
    var m = Math.max.apply(null, bins), w = 300, h = 70, bw = w / 20;
    return '<svg viewBox="0 0 ' + w + ' ' + (h + 14) + '" class="sa-phist">' + bins.map(function (b, i) { var bh = m ? h * b / m : 0; return '<rect x="' + (i * bw + 1) + '" y="' + (h - bh) + '" width="' + (bw - 2) + '" height="' + bh + '" fill="' + (i === 9 ? '#f59e0b' : i < 10 ? '#4ade80' : '#3a5a3a') + '"/>'; }).join('')
      + '<line x1="' + (10 * bw) + '" x2="' + (10 * bw) + '" y1="0" y2="' + h + '" stroke="#ef4444" stroke-dasharray="3 2"/><text x="0" y="' + (h + 12) + '" fill="#6b8a6b" font-size="9">0</text><text x="' + (10 * bw - 8) + '" y="' + (h + 12) + '" fill="#ef4444" font-size="9">.05</text><text x="' + (w - 14) + '" y="' + (h + 12) + '" fill="#6b8a6b" font-size="9">.10</text></svg>';
  }

  // ── render ──
  U.renderReview = function () {
    var D = U.disc, R = U.last; if (!D || !R) return;
    var RH = D.rhetoric, FC = D.factcheck, P = D.paper;
    var cnt = { factcheck: FC.items.length, paper: P.flags.length, sources: RH.sources.urls.length + RH.sources.dois.length, sentiment: RH.sentiment ? RH.sentences : '—', loaded: RH.loaded.loaded.length + RH.loaded.strong.length,
      stance: '', fallacies: RH.fallacies.items.length + RH.devices.items.length, appeals: '' };
    $('sa-rtabs').innerHTML = TABS.map(function (t) { return '<button class="sa-tab' + (U.rtab === t[0] ? ' on' : '') + '" data-rtab="' + t[0] + '">' + t[1] + (cnt[t[0]] !== '' ? '<span class="n">' + cnt[t[0]] + '</span>' : '') + '</button>'; }).join('');
    $('sa-rtabs').querySelectorAll('[data-rtab]').forEach(function (b) { b.onclick = function () { U.rtab = b.dataset.rtab; U.renderReview(); }; });
    var h = '', el = $('sa-review'), tab = U.rtab;

    if (tab === 'factcheck') {
      var mm = FC.arithmetic.filter(function (a) { return a.status === 'mismatch'; });
      h += (mm.length ? H4('ARITHMETIC THAT DOES NOT ADD UP (' + mm.length + ')', '#ef4444') + mm.map(function (a) { return '<div class="sa-obs"><span class="sa-badge" style="background:#5c1a1a;color:#ffb4b4">' + esc(a.type) + '</span><div class="q">' + esc(a.text + ((a.text.match(/\(/g) || []).length > (a.text.match(/\)/g) || []).length ? ')' : '')) + '</div><div class="w">stated ' + esc(a.stated) + ' · computed ' + esc(a.computed) + (a.note ? ' · ' + esc(a.note) : '') + '</div></div>'; }).join('') : '')
        + (FC.arithmetic.length - mm.length ? '<div class="sa-method">' + (FC.arithmetic.length - mm.length) + ' stated change(s) or share(s) check out arithmetically.</div>' : '')
        + H4('CHECK-WORTHY CLAIMS (' + FC.total + (FC.total > FC.items.length ? ', top ' + FC.items.length : '') + ')') + method(FC.method)
        + '<div style="margin:6px 0 10px"><button class="sa-btn sa-btn-sm" id="sa-fc-copy">⧉ Copy as checklist</button></div>'
        + (FC.items.map(function (x) {
          return '<div class="sa-obs sa-fc" data-unit="' + x.unit + '"><span class="sa-badge" style="background:#1a2c1a;color:#4ade80">' + x.score + '</span>' + x.features.map(function (f) { return '<span class="sa-badge" style="background:' + (/conflict|mismatch/.test(f) ? '#5c1a1a;color:#ffb4b4' : /vague/.test(f) ? '#3a2a0a;color:#f59e0b' : '#0f1a0f;color:#8faf8f') + '">' + esc(f) + '</span>'; }).join('')
            + '<div class="q">' + esc(short(x.text, 280)) + '</div>'
            + '<div class="w">To settle it: ' + x.settle.map(esc).join('; ') + '.</div>'
            + (x.conflicts.length ? '<div class="w" style="color:#ef4444">Conflicts inside this text: ' + x.conflicts.map(function (c) { return esc(c.cls) + (c.witness ? ' (' + esc(c.witness) + ')' : ''); }).join('; ') + '</div>' : '')
            + '<div class="sa-links">' + x.links.map(function (l) { return '<a href="' + esc(l.url) + '" target="_blank" rel="noopener noreferrer">' + esc(l.name) + ' ↗</a>'; }).join('') + '</div></div>';
        }).join('') || empty('No check-worthy factual sentences found.'));
    } else if (tab === 'paper') {
      var sec = P.sections, stt = P.statements, mark = function (ok, t, title) { return '<span class="sa-ck ' + (ok ? 'y' : 'n') + '"' + (title ? ' title="' + esc(title) + '"' : '') + '>' + (ok ? '✓' : '✗') + ' ' + esc(t) + '</span>'; };
      h += '<div class="sa-method">Structure score ' + P.paperness + '/7 (abstract, methods, results, discussion, references, test statistics, p-values). ' + (P.paperness < 3 ? 'This does not look like a research paper; the checks below still run but most will be empty.' : '') + ' ' + esc(P.method) + '</div>'
        + H4('FLAGS (' + P.flags.length + ')') + (P.flags.map(function (f) { return '<div class="sa-flag" style="border-color:' + SEV[f.sev] + '"><span style="color:' + SEV[f.sev] + '">' + f.sev + '</span> ' + esc(f.text) + '</div>'; }).join('') || empty('No flags.'))
        + H4('REPORTING CHECKLIST') + '<div class="sa-cks">' + ['abstract', 'methods', 'results', 'discussion', 'limitations', 'references'].map(function (k) { return mark(sec[k] || (k === 'limitations' && P.limitationUnits.length), k); }).join('')
        + Object.keys(stt).map(function (k) { return mark(!!stt[k], k, stt[k] || ''); }).join('') + '</div>'
        + (P.designs.length ? H4('DESIGN SIGNALS') + P.designs.map(function (d) { return chip(d.name, null, null, d.cls === 'experimental' || d.cls === 'quasi' ? '' : 'c'); }).join('') : '')
        + (P.sampleSizes.length ? H4('SAMPLE SIZES') + P.sampleSizes.map(function (x) { return '<span class="sa-chipbtn' + (x.n < 30 ? '" style="border-color:#f59e0b' : '') + '">' + esc(x.text) + '</span>'; }).join('') : '')
        + H4('REPORTED TESTS RECOMPUTED (statcheck-style, ' + P.statcheck.length + ')')
        + (P.statcheck.length ? '<div class="sa-scroll"><table class="sa-table"><tr><th>result as reported</th><th>recomputed p</th><th>status</th></tr>' + P.statcheck.map(function (s) { return '<tr><td>' + esc(s.text) + '</td><td>' + (s.recomputed < 0.0001 ? s.recomputed.toExponential(1) : s.recomputed.toFixed(4)) + '</td><td style="color:' + STATUS(s.status) + '">' + esc(s.status) + (s.note ? '<br><span style="color:#6b8a6b">' + esc(s.note) + '</span>' : '') + '</td></tr>'; }).join('') + '</table></div>' + method('Two-tailed unless a one-tailed test is stated nearby. The reported statistic is treated as rounded; a result is inconsistent only if no value in its rounding interval reproduces the reported p. After Nuijten et al. (2016).') : empty('No APA-style test results (t(df) = x, p = …; F, χ², r, z) found.'))
        + (P.grim.length ? H4('GRIM TEST (' + P.grim.length + ')') + '<table class="sa-table"><tr><th>mean</th><th>n</th><th>status</th></tr>' + P.grim.map(function (g) { return '<tr><td>' + esc(g.mean) + '</td><td>' + g.n + '</td><td style="color:' + STATUS(g.status) + '">' + esc(g.status) + '<br><span style="color:#6b8a6b">' + esc(g.why) + '</span></td></tr>'; }).join('') + '</table>' + method('Brown & Heathers (2017). Applies only to means of integer-valued single items or counts.') : '')
        + (P.pProfile && P.pProfile.n ? H4('P-VALUES (' + P.pProfile.n + ': ' + P.pProfile.exact + ' exact, ' + P.pProfile.threshold + ' thresholded)') + pHist(P.pProfile.values) + (P.pProfile.correction ? '<div class="sa-method">A multiple-comparison correction is mentioned.</div>' : '') : '')
        + (P.causal.length ? H4('CAUSAL LANGUAGE IN A NON-EXPERIMENTAL DESIGN (' + P.causal.length + ')', '#f59e0b') + P.causal.map(function (c) { return sent(c.unit, c.text, '<span class="sa-badge" style="background:#3a2a0a;color:#f59e0b">' + esc(c.cue) + '</span>', '#f59e0b'); }).join('') : '')
        + (P.overclaim.length ? H4('OVERCLAIMING VOCABULARY (' + P.overclaim.length + ')', '#c9a84c') + P.overclaim.map(function (c) { return sent(c.unit, c.text, c.cues.map(function (q) { return '<span class="sa-badge" style="background:#2a240a;color:#c9a84c">' + esc(q) + '</span>'; }).join(''), '#c9a84c'); }).join('') : '')
        + (P.refs ? H4('REFERENCE LIST') + '<table class="sa-table"><tr><td>entries</td><td>' + P.refs.n + '</td></tr><tr><td>with a year</td><td>' + P.refs.withYear + '</td></tr><tr><td>median year</td><td>' + (P.refs.median || '—') + '</td></tr><tr><td>range</td><td>' + (P.refs.oldest || '—') + ' – ' + (P.refs.newest || '—') + '</td></tr><tr><td>older than 10 years</td><td>' + P.refs.olderThan10 + '</td></tr><tr><td>with a DOI</td><td>' + P.refs.withDoi + '</td></tr></table>' : '')
        + crossrefBlock();
    } else if (tab === 'sources') {
      var SR = RH.sources, cls = Object.keys(SR.byClass).sort(function (a, b) { return SR.byClass[b] - SR.byClass[a]; });
      var CC = { scholarly: '#4ade80', government: '#7dd3fc', reference: '#a3e635', news: '#e6cc6a', archive: '#c4bfff', 'social / video': '#f59e0b', 'blog / self-published': '#fb923c', 'link shortener': '#ef4444', other: '#6b8a6b' };
      h += method(SR.method)
        + bars([['links', SR.urls.length, '#4ade80'], ['DOIs', SR.dois.length, '#4ade80'], ['arXiv ids', SR.arxiv.length, '#4ade80'], ['in-text citations', SR.inTextCitations, '#4ade80']])
        + '<div class="sa-method">' + SR.perKWords + ' references per 1,000 words · ' + SR.persistent + ' persistent identifiers or scholarly/archived links' + (SR.httpsShare != null ? ' · ' + SR.httpsShare + '% https' : '') + (SR.opaque ? ' · <span style="color:#ef4444">' + SR.opaque + ' shortened link(s) hide their target</span>' : '') + '</div>'
        + (cls.length ? H4('LINKS BY DOMAIN TYPE') + bars(cls.map(function (c) { return [c, SR.byClass[c], CC[c]]; })) : '')
        + H4('ATTRIBUTION') + bars([['reported statements', SR.attribution.reported, '#e6cc6a'], ['with a named source', SR.attribution.named, '#4ade80'], ['vague attributions', SR.attribution.vague, '#f59e0b']])
        + (SR.attribution.transparency != null ? '<div class="sa-method">Named share of attributions: ' + SR.attribution.transparency + '%</div>' : '')
        + (SR.attribution.vagueTerms.length ? SR.attribution.vagueTerms.map(function (t) { return chip(t.term, t.n, t.units[0]); }).join('') : '')
        + (SR.urls.length ? H4('ALL LINKS') + '<div class="sa-scroll"><table class="sa-table"><tr><th>domain</th><th>type</th><th>link</th></tr>' + SR.urls.map(function (u) { return '<tr><td>' + esc(u.host) + '</td><td style="color:' + CC[u.cls] + '">' + esc(u.cls) + '</td><td><a href="' + esc(u.url) + '" target="_blank" rel="noopener noreferrer">' + esc(short(u.url, 60)) + '</a></td></tr>'; }).join('') + '</table></div>' : '')
        + crossrefBlock();
    } else if (tab === 'sentiment') {
      var SE = RH.sentiment;
      if (!SE) h = empty('The sentiment lexicon could not be loaded.');
      else h += method(SE.method + '. VADER was built for short social-media text; on long-form prose read the arc and the extremes rather than the mean.')
        + '<div class="sa-kpis"><div><b style="color:' + (SE.mean >= 0.05 ? '#4ade80' : SE.mean <= -0.05 ? '#ef4444' : '#8faf8f') + '">' + (SE.mean > 0 ? '+' : '') + SE.mean + '</b><span>mean compound</span></div><div><b style="color:#4ade80">' + SE.share.pos + '</b><span>positive</span></div><div><b style="color:#8faf8f">' + SE.share.neu + '</b><span>neutral</span></div><div><b style="color:#ef4444">' + SE.share.neg + '</b><span>negative</span></div></div>'
        + H4('SENTIMENT ARC') + arcSvg(SE.arc, el.clientWidth)
        + (SE.mostNegative.length ? H4('MOST NEGATIVE', '#ef4444') + SE.mostNegative.map(function (a) { return sent(a.unit, U.unitText(a.unit), '<span class="sa-badge" style="background:#5c1a1a;color:#ffb4b4">' + a.c + '</span>', '#5c1a1a'); }).join('') : '')
        + (SE.mostPositive.length ? H4('MOST POSITIVE') + SE.mostPositive.map(function (a) { return sent(a.unit, U.unitText(a.unit), '<span class="sa-badge" style="background:#1a3a1a;color:#4ade80">+' + a.c + '</span>', '#1a6b38'); }).join('') : '')
        + (SE.topNegWords.length || SE.topPosWords.length ? H4('WORDS DRIVING THE SCORE') + SE.topNegWords.map(function (w) { return '<span class="sa-chipbtn" style="color:#ffb4b4" data-unit="' + w.units[0] + '">' + esc(w.w) + ' ' + w.v.toFixed(1) + (w.n > 1 ? ' ×' + w.n : '') + '</span>'; }).join('') + SE.topPosWords.map(function (w) { return '<span class="sa-chipbtn" style="color:#86efac" data-unit="' + w.units[0] + '">' + esc(w.w) + ' +' + w.v.toFixed(1) + (w.n > 1 ? ' ×' + w.n : '') + '</span>'; }).join('') : '')
        + (SE.byEntity.length ? H4('TONE AROUND ENTITIES AND CONCEPTS') + '<table class="sa-table"><tr><th>name</th><th>sentences</th><th>mean</th></tr>' + SE.byEntity.map(function (e) { return '<tr class="sa-row-click" data-unit="' + e.units[0] + '"><td>' + esc(e.name) + '</td><td>' + e.n + '</td><td style="color:' + (e.mean >= 0.05 ? '#4ade80' : e.mean <= -0.05 ? '#ef4444' : '#8faf8f') + '">' + (e.mean > 0 ? '+' : '') + e.mean + '</td></tr>'; }).join('') + '</table>' : '');
    } else if (tab === 'loaded') {
      var LD = RH.loaded, FR = RH.framing;
      h += method(LD.method)
        + '<div class="sa-kpis"><div><b>' + LD.per1k + '</b><span>loaded per 1,000 words</span></div><div><b>' + LD.unitShare + '%</b><span>sentences with loaded words</span></div><div><b>' + LD.absolutesPer1k + '</b><span>absolutes per 1,000</span></div></div>'
        + (LD.loaded.length ? H4('LOADED / PEJORATIVE TERMS') + LD.loaded.map(function (t) { return chip(t.term, t.n, t.units[0]); }).join('') : '')
        + (LD.strong.length ? H4('STRONGLY VALENCED WORDS (VADER |v| ≥ 2.5)') + LD.strong.map(function (t) { return chip(t.term, t.n, t.units[0]); }).join('') : '')
        + (LD.absolutes.length ? H4('ABSOLUTES') + LD.absolutes.map(function (t) { return chip(t.term, t.n, t.units[0], 'c'); }).join('') : '')
        + H4('POLITICAL FRAMING VOCABULARY') + method(FR.method + ' This is a vocabulary indicator, not a classification of the author.')
        + gauge(FR.index, 'left-coded', 'right-coded')
        + '<div class="sa-cols"><div>' + '<div class="sa-sub">left-coded terms (' + FR.nLeft + ')</div>' + (FR.left.map(function (t) { return chip(t.term, t.n, t.units[0]); }).join('') || '<span class="sa-dim">none</span>') + '</div><div><div class="sa-sub">right-coded terms (' + FR.nRight + ')</div>' + (FR.right.map(function (t) { return chip(t.term, t.n, t.units[0]); }).join('') || '<span class="sa-dim">none</span>') + '</div></div>'
        + (FR.reportedShare ? '<div class="sa-method">' + FR.reportedShare + ' of the sentences with framing terms are quoted or reported speech.</div>' : '');
    } else if (tab === 'stance') {
      var DS = RH.disposition;
      h += method(DS.method)
        + H4('CERTAINTY') + gauge(DS.certainty, 'hedged', 'assertive') + bars([['hedges', DS.hedges, '#c4bfff'], ['boosters', DS.boosters, '#4ade80'], ['attitude markers', DS.attitude, '#e6cc6a'], ['must / should', DS.deontic, '#f59e0b']])
        + H4('VOICE AND AUDIENCE') + bars([['I / me / my', DS.selfMention, '#7dd3fc'], ['we / us / our', DS.inGroup, '#4ade80'], ['they / them / their', DS.outGroup, '#ef4444'], ['you / your', DS.reader, '#e6cc6a']])
        + H4('US VERSUS THEM') + gauge(DS.usThem, 'they', 'we')
        + '<div class="sa-method">' + DS.imperatives + ' imperative sentence(s) · ' + DS.questions + ' question(s) · future markers ' + DS.future + ' and past auxiliaries ' + DS.past + ' per 1,000 words</div>'
        + ['hedges', 'boosters', 'attitude', 'deontic'].map(function (k) { return DS.terms[k].length ? '<div class="sa-sub">' + k + '</div>' + DS.terms[k].map(function (t) { return chip(t.term, t.n, t.units[0], 'c'); }).join('') : ''; }).join('');
    } else if (tab === 'fallacies') {
      var FA = RH.fallacies, DV = RH.devices, grp = function (items) { var g = {}; items.forEach(function (x) { (g[x.name] = g[x.name] || []).push(x); }); return g; };
      var gf = grp(FA.items), gd = grp(DV.items);
      h += H4('FALLACY CANDIDATES (' + FA.items.length + ')', '#f59e0b') + method(FA.method)
        + (Object.keys(gf).map(function (k) { return '<details open><summary class="sa-sum">' + esc(k) + ' · ' + gf[k].length + '</summary><div class="sa-method">' + esc(gf[k][0].def) + ' Basis: ' + esc(gf[k][0].basis) + '.</div>' + gf[k].map(function (x) { return sent(x.unit, x.text, '<span class="sa-badge" style="background:#3a2a0a;color:#f59e0b">' + esc(short(x.cue, 50)) + '</span>', '#f59e0b'); }).join('') + '</details>'; }).join('') || empty('No fallacy cues found.'))
        + H4('RHETORICAL DEVICES (' + DV.items.length + ')', '#c4bfff') + method(DV.method + (DV.exclamations ? ' Exclamation marks: ' + DV.exclamations + '.' : ''))
        + (Object.keys(gd).map(function (k) { return '<details' + (gd[k].length <= 4 ? ' open' : '') + '><summary class="sa-sum">' + esc(k) + ' · ' + gd[k].length + '</summary>' + gd[k].map(function (x) { return sent(x.unit, x.units && x.units.length > 1 ? x.units.map(U.unitText).join(' ⏐ ') : x.text, '<span class="sa-badge" style="background:#1e1a3a;color:#c4bfff">' + esc(short(x.cue, 50)) + '</span>', '#c4bfff'); }).join('') + '</details>'; }).join('') || empty('No devices detected.'));
    } else if (tab === 'appeals') {
      var AP = RH.appeals, sh = AP.share;
      h += method(AP.method)
        + (sh ? '<div class="sa-tri"><i style="flex:' + Math.max(1, sh.logos) + ';background:#60a5fa">logos ' + sh.logos + '%</i><i style="flex:' + Math.max(1, sh.ethos) + ';background:#e6cc6a">ethos ' + sh.ethos + '%</i><i style="flex:' + Math.max(1, sh.pathos) + ';background:#ef4444">pathos ' + sh.pathos + '%</i></div>' : empty('No markers found.'))
        + bars([['logos', AP.logos, '#60a5fa', 'per 1,000 words'], ['ethos', AP.ethos, '#e6cc6a', 'per 1,000 words'], ['pathos', AP.pathos, '#ef4444', 'per 1,000 words']])
        + H4('WHAT WAS COUNTED') + '<table class="sa-table">' + Object.keys(AP.parts).map(function (k) { return '<tr><td>' + esc(k) + '</td><td>' + AP.parts[k] + '</td></tr>'; }).join('') + '</table>'
        + H4('EMOTION TERMS') + (['fear', 'anger', 'hope', 'sadness'].map(function (k) { return AP.emotions[k].length ? '<div class="sa-sub">' + k + '</div>' + AP.emotions[k].map(function (t) { return chip(t.term, t.n, t.units[0]); }).join('') : ''; }).join('') || '<span class="sa-dim">none</span>');
    }
    el.innerHTML = h;
    el.querySelectorAll('[data-unit]').forEach(function (d) { d.addEventListener('click', function (e) { if (e.target.closest('a')) return; e.stopPropagation(); var id = d.dataset.unit; U.selectUnit(id); }); });
    var cp = $('sa-fc-copy'); if (cp) cp.onclick = function () { var t = U.factcheckMarkdown(); if (navigator.clipboard) navigator.clipboard.writeText(t).then(function () { cp.textContent = '✓ Copied'; }); };
    var cr = $('sa-cr-run'); if (cr) cr.onclick = U.runCrossref;
    bindArc();
  };
  U.unitText = function (id) { var u = U.last && U.last.units[+String(id).slice(1)]; return u ? (u.cleanText || u.text) : ''; };

  // ── Crossref ──
  function crossrefBlock() {
    var dois = U.disc.rhetoric.sources.dois; if (!dois.length) return '';
    var r = U.crossref;
    return H4('DOI CHECK (' + dois.length + ' DOI' + (dois.length > 1 ? 's' : '') + ')') + (r ? crossrefTable(r) : '<div class="sa-method">Looks each DOI up in Crossref: does it resolve, does its title match the words near the citation, does Crossref list a retraction, correction or concern? Sends only the DOIs to api.crossref.org.</div><button class="sa-btn sa-btn-sm" id="sa-cr-run">Check ' + Math.min(25, dois.length) + ' DOI' + (dois.length > 1 ? 's' : '') + ' with Crossref</button>');
  }
  function crossrefTable(r) {
    if (r === 'loading') return '<div class="sa-method">Querying Crossref…</div>';
    return '<div class="sa-scroll"><table class="sa-table"><tr><th>DOI</th><th>Crossref record</th><th>title match</th><th>notices</th></tr>' + r.map(function (x) {
      if (!x.ok) return '<tr><td>' + esc(x.doi) + '</td><td style="color:#ef4444">' + (x.status === 404 ? 'not found in Crossref (check the DOI; DataCite DOIs such as Zenodo are not in Crossref)' : 'lookup failed (' + esc(x.status) + ')') + '</td><td></td><td></td></tr>';
      var tm = x.titleMatch, tc = tm == null || !x.nearbyChecked ? '#6b8a6b' : tm >= 50 ? '#4ade80' : tm >= 20 ? '#f59e0b' : '#ef4444';
      return '<tr><td><a href="https://doi.org/' + esc(x.doi) + '" target="_blank" rel="noopener noreferrer">' + esc(short(x.doi, 34)) + '</a></td><td>' + esc(short(x.title, 120)) + '<br><span style="color:#6b8a6b">' + esc(x.container) + (x.year ? ' · ' + x.year : '') + (x.type ? ' · ' + esc(x.type) : '') + (x.cited != null ? ' · cited ' + x.cited : '') + '</span></td><td style="color:' + tc + '">' + (tm == null ? '—' : tm + '%') + '</td><td style="color:' + (x.notices.length ? '#ef4444' : '#6b8a6b') + '">' + (x.notices.map(function (n) { return esc(n.type) + (n.doi ? ' (' + esc(n.doi) + ')' : ''); }).join('<br>') || 'none listed') + '</td></tr>';
    }).join('') + '</table></div><div class="sa-method">Title match: share of the record’s title words that appear within ~400 characters before the DOI. A low value can mean a mismatched or invented citation, or simply that the citation format omits the title. “None listed” is not proof that no retraction exists.</div>';
  }
  U.runCrossref = function () {
    U.crossref = 'loading'; U.renderReview();
    S.crossrefCheck(U.disc.rhetoric.sources.dois, U.last.text || '').then(function (r) { U.crossref = r; U.renderReview(); });
  };

  // ── exports ──
  U.factcheckMarkdown = function () {
    var FC = U.disc.factcheck, L = ['# Fact-check list', ''];
    FC.arithmetic.filter(function (a) { return a.status === 'mismatch'; }).forEach(function (a) { L.push('- [ ] **Arithmetic:** “' + a.text + '” — stated ' + a.stated + ', computed ' + a.computed + (a.note ? ' (' + a.note + ')' : '')); });
    FC.items.forEach(function (x) { L.push('- [ ] “' + x.text + '”', '  - features: ' + x.features.join(', '), '  - to settle: ' + x.settle.join('; '), '  - search: ' + x.query); });
    return L.join('\n');
  };
  var baseDeep = U.exportDeep;
  U.exportDeep = function (R) { var o = JSON.parse(baseDeep(R)); if (U.disc) { var d = JSON.parse(JSON.stringify(U.disc)); if (d.rhetoric.sentiment) d.rhetoric.sentiment.arc = d.rhetoric.sentiment.arc.map(function (a) { return [a.unit, a.c]; }); o.review = d; o.crossref = Array.isArray(U.crossref) ? U.crossref : null; } return JSON.stringify(o, null, 2); };
  var baseMd = U.exportMarkdown;
  U.exportMarkdown = function (R) {
    var md = baseMd(R), D = U.disc; if (!D) return md;
    var RH = D.rhetoric, P = D.paper, L = ['', '## Review', ''];
    if (P.flags.length) { L.push('**Paper-review flags:**', ''); P.flags.forEach(function (f) { L.push('- (' + f.sev + ') ' + f.text); }); L.push(''); }
    P.statcheck.filter(function (s) { return s.status !== 'consistent'; }).forEach(function (s) { L.push('- statcheck: `' + s.text + '` → recomputed p = ' + s.recomputed.toPrecision(3) + ' (' + s.status + ')'); });
    if (RH.sentiment) L.push('', '**Sentiment (VADER):** mean ' + RH.sentiment.mean + ' · ' + RH.sentiment.share.pos + ' positive / ' + RH.sentiment.share.neu + ' neutral / ' + RH.sentiment.share.neg + ' negative sentences');
    L.push('**Loaded language:** ' + RH.loaded.per1k + ' per 1,000 words' + (RH.loaded.loaded.length ? ' (' + RH.loaded.loaded.slice(0, 10).map(function (t) { return t.term; }).join(', ') + ')' : ''));
    L.push('**Framing vocabulary:** left-coded ' + RH.framing.nLeft + ', right-coded ' + RH.framing.nRight + (RH.framing.index != null ? ', index ' + RH.framing.index : ', insufficient signal'));
    L.push('**Stance:** hedges ' + RH.disposition.hedges + ', boosters ' + RH.disposition.boosters + ' per 1,000 words; certainty ' + RH.disposition.certainty);
    if (RH.appeals.share) L.push('**Appeals (marker shares):** logos ' + RH.appeals.share.logos + '%, ethos ' + RH.appeals.share.ethos + '%, pathos ' + RH.appeals.share.pathos + '%');
    if (RH.fallacies.items.length) { L.push('', '**Fallacy candidates:**', ''); RH.fallacies.items.forEach(function (f) { L.push('- ' + f.name + ': “' + short(f.text, 200) + '”'); }); }
    L.push('', U.factcheckMarkdown().replace(/^# /, '### '));
    return md + '\n' + L.join('\n');
  };

  // ── hook into show / reset / init ──
  var baseShow = U.show;
  U.show = async function (R, opt) {
    await baseShow(R, opt);
    U.crossref = null;
    try { await Promise.race([S.vader.load(), new Promise(function (r) { setTimeout(r, 6000); })]); } catch (e) {}
    try { U.disc = S.discourse(R.text || '', R, U.ins); U.renderReview(); }
    catch (e) { $('sa-review').innerHTML = empty('Review failed: ' + esc(e.message)); if (window.console) console.error(e); }
  };
  var baseReset = U.reset;
  U.reset = function () { baseReset(); U.arcSel = null; U.disc = null; U.crossref = null; var r = $('sa-review'); if (r) r.innerHTML = empty('Run an analysis.'); };
  var baseInit = U.init;
  U.init = function () { baseInit(); if (S.vader) S.vader.load();  };
})(SA2);

// auto-init lives at the end of ui-argument.js (the last UI module)
