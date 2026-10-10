// ═══ SA2 UI · ARGUMENT MAP ═══ one Ishikawa diagram per argument, with a detail pane that shows the
// full statement, its role and effect, the inference chain to the thesis, and every signal the other
// analyses attach to it. Loads after ui-review.js (wraps U.show) and before the auto-init line.
(function (S) {
  'use strict';
  var U = S.ui, $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var short = function (t, n) { t = String(t).replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n - 1) + '…' : t; };
  var COL = { reasoning: '#60a5fa', evidence: '#7dd3fc', sources: '#e6cc6a', assumptions: '#c4bfff', counter: '#ef4444', rhetoric: '#f59e0b' };
  var EFF = { '+': ['supports', '#4ade80'], '·': ['elaborates', '#8faf8f'], '~': ['qualifies', '#e6cc6a'], '−': ['weakens', '#ef4444'], '∅': ['persuades without support', '#f59e0b'] };
  var SHOW = 8;   // items per bone before "+ N more"
  U.am = { cur: 0, sel: null, expand: {}, theses: null };

  function wrap(t, n, maxLines) { var w = String(t).split(/\s+/), L = [], cur = ''; w.forEach(function (x) { if ((cur + ' ' + x).trim().length > n) { if (cur) L.push(cur); cur = x; } else cur = (cur + ' ' + x).trim(); }); if (cur) L.push(cur); if (L.length > maxLines) { L = L.slice(0, maxLines); L[maxLines - 1] = L[maxLines - 1].slice(0, Math.max(1, n - 1)) + '…'; } return L; }
  var M = function () { return U.disc && U.disc.arguments; };
  var curMap = function () { var A = M(); return A && A.maps[Math.min(U.am.cur, A.maps.length - 1)]; };

  // ── diagram ──
  function fish(F, width) {
    var sel = U.am.sel, chainSet = {}, narrow = width < 640, s = '', CH = 6.3;
    if (sel) { var it = findItem(F, sel); if (it && it.chain) it.chain.forEach(function (u) { chainSet[u] = 1; }); }
    var shown = function (b) { var all = U.am.expand[F.id + ':' + b.key]; return all ? b.items : b.items.slice(0, SHOW); };
    var label = function (x, y, it, bone, anchor, chars) {
      var on = sel && sel.unit === it.unit && sel.bone === bone.key, inChain = chainSet[it.unit], e = EFF[it.effect] || EFF['+'];
      var L = wrap(it.label, chars, 2), out = '';
      if (on) out += '<rect x="' + (anchor === 'end' ? x - chars * CH - 6 : x - 4) + '" y="' + (y - L.length * 13 - 2) + '" width="' + (chars * CH + 10) + '" height="' + (L.length * 13 + 8) + '" rx="4" fill="#4ade8018" stroke="#4ade80"/>';
      out += '<circle cx="' + (anchor === 'end' ? x + 8 : x - 8) + '" cy="' + (y - 4 - (L.length - 1) * 13) + '" r="3.5" fill="' + e[1] + '"/>';
      L.forEach(function (l, i) { out += '<text x="' + x + '" y="' + (y - (L.length - 1 - i) * 13) + '" text-anchor="' + anchor + '" fill="' + (on ? '#e4f0e4' : inChain ? '#93c5fd' : '#c8d8c8') + '" font-size="10.5"' + (on ? ' font-weight="600"' : '') + ' data-unit="' + it.unit + '" data-bone="' + bone.key + '" class="fb-item">' + esc(l) + '<title>' + esc(it.label) + '</title></text>'; });
      return out;
    };
    var more = function (x, y, b, anchor) { var n = b.items.length - SHOW, ex = U.am.expand[F.id + ':' + b.key]; if (n <= 0) return '';
      return '<text x="' + x + '" y="' + y + '" text-anchor="' + anchor + '" fill="' + COL[b.key] + '" font-size="11" class="fb-more" data-more="' + b.key + '">' + (ex ? '− show fewer' : '+ ' + n + ' more') + '</text>'; };
    var headBox = function (x, y, w, chars) { var hl = wrap(F.head.text, chars, 8), h = hl.length * 16 + 16, on = sel && sel.unit === F.head.unit && sel.bone === 'head';
      var o = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="6" fill="#0f1a0f" stroke="#4ade80" stroke-width="' + (on ? 3 : 1.5) + '" data-unit="' + F.head.unit + '" data-bone="head" class="fb-item"/>';
      hl.forEach(function (l, i) { o += '<text x="' + (x + 8) + '" y="' + (y + 20 + i * 16) + '" fill="#e4f0e4" font-size="12" font-weight="600" data-unit="' + F.head.unit + '" data-bone="head" class="fb-item">' + esc(l) + '</text>'; });
      return { svg: o, h: h }; };
    if (!narrow) {
      var W = width, headW = Math.min(280, Math.max(200, W * 0.22)), counts = F.bones.map(function (b) { return shown(b).length + (b.items.length > SHOW ? 1 : 0); });
      var step = 36, topH = 40 + Math.max(2, counts[0], counts[1], counts[2]) * step, botH = 40 + Math.max(2, counts[3], counts[4], counts[5]) * step, Hh = topH + botH + 30;
      var spineY = topH + 12, x0 = 12, x1 = W - headW - 22, slotW = (x1 - x0) / 3;
      s += '<line x1="' + x0 + '" y1="' + spineY + '" x2="' + x1 + '" y2="' + spineY + '" stroke="#4ade80" stroke-width="3"/><polygon points="' + x1 + ',' + (spineY - 8) + ' ' + (x1 + 12) + ',' + spineY + ' ' + x1 + ',' + (spineY + 8) + '" fill="#4ade80"/>';
      var hch = Math.floor((headW - 16) / 7.3), hh = wrap(F.head.text, hch, 8).length * 16 + 16;
      s += headBox(x1 + 16, Math.max(4, Math.min(Hh - hh - 4, spineY - hh / 2)), headW, hch).svg;
      F.bones.forEach(function (b, k) {
        var top = k < 3, boneH = (top ? topH : botH) - 10, sx = x0 + (k % 3 + 1) * slotW, ex = sx - Math.min(70, slotW * 0.22), ey = top ? spineY - boneH : spineY + boneH, col = COL[b.key], list = shown(b), slots = list.length + (b.items.length > SHOW ? 1 : 0);
        s += '<line x1="' + sx + '" y1="' + spineY + '" x2="' + ex + '" y2="' + ey + '" stroke="' + col + '" stroke-width="2"/>';
        s += '<text x="' + ex + '" y="' + (top ? ey - 6 : ey + 16) + '" text-anchor="middle" fill="' + col + '" font-size="11">' + b.name.toUpperCase() + ' (' + b.items.length + ')</text>';
        if (!b.items.length) s += '<text x="' + (ex - 10) + '" y="' + (top ? ey + 26 : ey - 18) + '" text-anchor="end" fill="#3a5a3a" font-size="10">none found</text>';
        list.forEach(function (it, i) {
          var by = top ? ey + 26 + i * step : ey - 26 - (slots - 1 - i) * step, bx = ex + (sx - ex) * (Math.abs(by - ey) / boneH), start = sx - slotW + 22;
          s += '<line x1="' + (start - 12) + '" y1="' + by + '" x2="' + bx + '" y2="' + by + '" stroke="' + col + '" stroke-opacity=".45"/>';
          s += label(start, by - 4, it, b, 'start', Math.floor((bx - start - 8) / CH));
        });
        if (b.items.length > SHOW) { var my = top ? ey + 26 + list.length * step : ey - 26; s += more(sx - slotW + 22, my - 4, b, 'start'); }
      });
      return '<svg class="sa-fish" viewBox="0 0 ' + W + ' ' + Hh + '" width="100%">' + s + '</svg>';
    }
    var Wn = width, sxr = Wn - 14, hd = headBox(6, 6, Wn - 12, Math.floor((Wn - 28) / 7.3)), y = hd.h + 18, spineTop = y, chars = Math.floor((Wn - 70) / CH);
    s += hd.svg + '<polygon points="' + (sxr - 8) + ',' + (y + 8) + ' ' + sxr + ',' + (y - 4) + ' ' + (sxr + 8) + ',' + (y + 8) + '" fill="#4ade80"/>';
    y += 22;
    F.bones.forEach(function (b) {
      var col = COL[b.key], list = shown(b), n = list.length + (b.items.length > SHOW ? 1 : 0), per = 36, bh = 22 + Math.max(1, n) * per, bxTop = sxr - 46;
      s += '<text x="8" y="' + (y + 4) + '" fill="' + col + '" font-size="11">' + b.name.toUpperCase() + ' (' + b.items.length + ')</text>';
      s += '<line x1="' + bxTop + '" y1="' + y + '" x2="' + sxr + '" y2="' + (y + bh) + '" stroke="' + col + '" stroke-width="2"/>';
      list.forEach(function (it, i) { var by = y + 22 + (i + 1) * per - 6, bx = bxTop + (sxr - bxTop) * ((by - y) / bh);
        s += '<line x1="18" y1="' + by + '" x2="' + bx + '" y2="' + by + '" stroke="' + col + '" stroke-opacity=".35"/>' + label(20, by - 4, it, b, 'start', chars); });
      if (b.items.length > SHOW) s += more(20, y + 22 + (list.length + 1) * per - 10, b, 'start');
      if (!b.items.length) s += '<text x="8" y="' + (y + 30) + '" fill="#3a5a3a" font-size="10">none found</text>';
      y += bh + 18;
    });
    return '<svg class="sa-fish" viewBox="0 0 ' + Wn + ' ' + y + '" width="100%"><line x1="' + sxr + '" y1="' + spineTop + '" x2="' + sxr + '" y2="' + (y - 14) + '" stroke="#4ade80" stroke-width="3"/>' + s + '</svg>';
  }
  function findItem(F, sel) { if (!sel) return null; if (sel.bone === 'head') return null; var b = F.bones.filter(function (x) { return x.key === sel.bone; })[0]; return b ? b.items.filter(function (i) { return i.unit === sel.unit; })[0] : null; }

  // ── detail pane ──
  function signals(uid) {
    var D = U.disc, R = U.last, out = [];
    var arc = D.rhetoric.sentiment && D.rhetoric.sentiment.arc.filter(function (a) { return a.unit === uid; })[0];
    if (arc) out.push(['sentiment (VADER)', '<span style="color:' + (arc.c >= 0.05 ? '#4ade80' : arc.c <= -0.05 ? '#ef4444' : '#8faf8f') + '">' + (arc.c > 0 ? '+' : '') + arc.c + '</span>']);
    var lw = D.rhetoric.loaded.loaded.concat(D.rhetoric.loaded.strong).filter(function (t) { return t.units.indexOf(uid) >= 0; }).map(function (t) { return t.term; });
    if (lw.length) out.push(['loaded words', esc(lw.join(', '))]);
    var fr = D.rhetoric.framing.left.concat(D.rhetoric.framing.right).filter(function (t) { return t.units.indexOf(uid) >= 0; }).map(function (t) { return t.term; });
    if (fr.length) out.push(['framing terms', esc(fr.join(', '))]);
    var dv = D.rhetoric.devices.items.filter(function (d) { return d.unit === uid || (d.units || []).indexOf(uid) >= 0; }).map(function (d) { return d.name; });
    if (dv.length) out.push(['rhetorical devices', esc(dv.join(', '))]);
    var t = U.unitText(uid), sc = D.paper.statcheck.filter(function (x) { return t.indexOf(x.text.replace('CHI2', '').slice(-12)) >= 0; });
    sc.forEach(function (x) { out.push(['test statistic', esc(x.text) + ' → p = ' + x.recomputed.toPrecision(3) + ' <span style="color:' + (x.status === 'consistent' ? '#4ade80' : '#ef4444') + '">' + esc(x.status) + '</span>']); });
    D.factcheck.arithmetic.filter(function (a) { return t.indexOf(a.text.split(' … ')[0].slice(0, 16)) >= 0; }).forEach(function (a) { out.push(['arithmetic', esc(a.stated + ' stated, ' + a.computed + ' computed') + ' <span style="color:' + (a.status === 'mismatch' ? '#ef4444' : '#4ade80') + '">' + a.status + '</span>']); });
    return out;
  }
  function claimsHtml(uid) {
    var cs = U.last.claims.filter(function (c) { return c.unit === uid; }); if (!cs.length) return '';
    return '<div class="am-k">extracted claims</div>' + cs.map(function (c) { var m = c.modality || {}; return '<div class="am-claim"><span class="sa-badge" style="background:#0f1a0f;color:#8faf8f">' + c.type + '</span><span class="sa-badge" style="background:#0f1a0f;color:' + (m.kind === 'asserted' ? '#4ade80' : m.kind === 'reported' ? '#e6cc6a' : '#c4bfff') + '">' + esc(m.kind || '') + (m.source ? ': ' + esc(m.source) : '') + '</span>' + (c.polarity < 0 ? '<span class="sa-badge" style="background:#2a1010;color:#ffb4b4">negated</span>' : '') + ' <span class="am-dim">' + esc(short(c.span.quote, 140)) + '</span></div>'; }).join('');
  }
  function factHtml(uid) {
    var f = U.disc.factcheck.items.filter(function (x) { return x.unit === uid; })[0]; if (!f) return '';
    return '<div class="am-k">to verify it</div><div class="am-v">' + esc(f.settle.join('; ')) + '.</div><div class="sa-links">' + f.links.map(function (l) { return '<a href="' + esc(l.url) + '" target="_blank" rel="noopener noreferrer">' + esc(l.name) + ' ↗</a>'; }).join('') + '</div>';
  }
  function otherRoles(F, uid, bone) {
    var o = []; F.bones.forEach(function (b) { b.items.forEach(function (it) { if (it.unit === uid && b.key !== bone) o.push('<span class="sa-chipbtn" data-sel="' + b.key + '" style="border-color:' + COL[b.key] + '">' + esc(b.name) + ': ' + esc(it.role) + '</span>'); }); });
    return o.length ? '<div class="am-k">also appears as</div>' + o.join('') : '';
  }
  function pane(F) {
    var sel = U.am.sel, h = '';
    if (!sel || sel.bone === 'head') {
      var T = F.tally, hd = F.head;
      h += '<div class="am-role" style="color:#4ade80">THESIS ' + F.id + (hd.section ? ' · ' + esc(hd.section) : '') + '</div><div class="am-q">' + esc(hd.text) + '</div>'
        + '<div class="am-k">why this sentence</div><div class="am-v">' + esc(hd.why || '') + '</div>'
        + '<div class="am-k">how it adds up</div><div class="am-shape">' + esc(F.shape) + '</div>'
        + '<table class="sa-table am-tally">'
        + row('+', 'Reasoning', T.premises ? T.premises + ' premise' + (T.premises > 1 ? 's' : '') + ' linked by inference markers' + (T.maxChain > 1 ? ' (longest chain ' + T.maxChain + ' steps)' : '') : 'no linked premises', T.reasons ? T.reasons + ' in-sentence reason(s)' : '', T.related ? T.related + ' related claim(s) that elaborate without arguing' : '')
        + row(T.evidenceInConflict ? '−' : '+', 'Evidence', T.evidence ? T.evidence + ' sentence(s) with figures or dates' : 'none', T.evidenceInConflict ? T.evidenceInConflict + ' in conflict with other figures' : '')
        + row('+', 'Sources', T.namedSources ? T.namedSources + ' named source(s) or citation(s)' : 'none named', T.unnamedSources ? T.unnamedSources + ' unnamed' : '')
        + row('~', 'Assumptions', T.hedged ? T.hedged + ' hedged or hypothetical' : 'none hedged', T.ungrounded ? T.ungrounded + ' ungrounded' : '')
        + row('−', 'Counterpoints', T.contradictions ? T.contradictions + ' contradiction(s)' : 'no contradictions', T.contrasts ? T.contrasts + ' contrastive sentence(s)' : '')
        + row('∅', 'Rhetoric', T.rhetoric ? T.rhetoric + ' fallacy or emotive item(s)' : 'none')
        + '</table>'
        + (hd.conflicts.length ? '<div class="am-k" style="color:#ef4444">the thesis itself is in conflict</div>' + hd.conflicts.map(function (c) { return '<div class="am-v">' + esc(c.cls) + ' with ' + c.partners.map(function (p) { return '“' + esc(short(U.unitText(p), 120)) + '”'; }).join(', ') + '</div>'; }).join('') : '')
        + (hd.hedged ? '<div class="am-v" style="color:#c4bfff">The thesis is itself hedged.</div>' : '') + (hd.ungrounded ? '<div class="am-v" style="color:#ef4444">The thesis has no grounded support chain.</div>' : '')
        + (hd.rhetoric.length ? '<div class="am-v" style="color:#f59e0b">Rhetoric in the thesis: ' + esc(hd.rhetoric.join(', ')) + '</div>' : '')
        + claimsHtml(hd.unit) + sigHtml(hd.unit) + factHtml(hd.unit)
        + '<div class="am-k">this argument</div><div class="am-v">' + F.members + ' sentence(s) attached. Tap any label in the diagram for its role.</div>'
        + '<div class="am-btns"><button class="sa-btn sa-btn-sm" data-act="text">Show in text</button></div>';
      return h;
    }
    var it = findItem(F, sel); if (!it) return '<div class="sa-panel-empty">Select a node.</div>';
    var e = EFF[it.effect] || EFF['+'], bname = F.bones.filter(function (b) { return b.key === sel.bone; })[0].name;
    h += '<div class="am-role" style="color:' + COL[sel.bone] + '">' + esc(bname.toUpperCase()) + ' · ' + esc(it.role) + '</div>'
      + '<span class="sa-badge" style="background:' + e[1] + '22;color:' + e[1] + ';font-size:11px">' + it.effect + ' ' + e[0] + ' the thesis</span>'
      + '<div class="am-q">' + esc(it.label) + '</div>' + (it.section ? '<div class="am-dim">section: ' + esc(it.section) + '</div>' : '')
      + '<div class="am-k">how it contributes</div><div class="am-v">' + esc(it.how) + '</div>';
    if (it.chain && it.chain.length > 1) h += '<div class="am-k">inference chain to the thesis</div><div class="am-chain">' + it.chain.map(function (u, i) { var last = i === it.chain.length - 1, txt = U.unitText(u), mk = it.chain[i + 1] ? (U.unitText(it.chain[i + 1]).match(/\b(therefore|thus|hence|consequently|accordingly|so it follows|it follows that|which (?:proves|shows|means|demonstrates|confirms)|this (?:proves|shows|means|demonstrates|confirms|is why|explains)|that is why)\b/i) || [])[0] : null;
      return '<div class="am-step' + (last ? ' th' : '') + '" data-goto="' + u + '">' + (last ? '★ ' : (i + 1) + '. ') + esc(short(txt, 200)) + '</div>' + (last ? '' : '<div class="am-arrow">↓ ' + (mk ? '“' + esc(mk) + '”' : 'supports') + '</div>'); }).join('') + '</div>';
    else h += '<div class="am-k">link to the thesis</div><div class="am-v">' + (it.connective ? 'In-sentence reason marker “' + esc(it.connective) + '”; ' : '') + 'no inference marker connects this sentence to the thesis. ' + (it.shared.length ? 'Shared terms: ' + it.shared.slice(0, 10).map(function (w) { return '<span class="am-term">' + esc(w) + '</span>'; }).join(' ') : 'No shared terms: it joined this argument by position in the section.') + '</div>';
    if (it.partners && it.partners.length) h += '<div class="am-k" style="color:#ef4444">conflicts with</div>' + it.partners.map(function (p) { return '<div class="am-step" data-goto="' + p + '">' + esc(short(U.unitText(p), 200)) + '</div>'; }).join('');
    h += otherRoles(F, it.unit, sel.bone) + claimsHtml(it.unit) + sigHtml(it.unit) + factHtml(it.unit)
      + '<div class="am-btns"><button class="sa-btn sa-btn-sm" data-act="text">Show in text</button><button class="sa-btn sa-btn-sm" data-act="thesis">Make this the thesis</button><button class="sa-btn sa-btn-sm" data-act="new">New argument from this</button></div>';
    return h;
  }
  function row(eff, name) { var e = EFF[eff], parts = Array.prototype.slice.call(arguments, 2).filter(Boolean); return '<tr><td style="color:' + e[1] + ';width:14px">' + eff + '</td><td style="color:#8faf8f">' + name + '</td><td>' + esc(parts.join('; ')) + '</td></tr>'; }
  function sigHtml(uid) { var s = signals(uid); return s.length ? '<div class="am-k">signals from the other analyses</div><table class="sa-table">' + s.map(function (x) { return '<tr><td style="color:#6b8a6b">' + x[0] + '</td><td>' + x[1] + '</td></tr>'; }).join('') + '</table>' : ''; }

  // ── render ──
  U.renderArgs = function () {
    var A = M(), box = $('sa-args'); if (!box) return;
    if (!A || !A.maps.length) { box.innerHTML = '<div class="sa-panel-empty">No argument found.</div>'; return; }
    var F = curMap();
    var tabs = A.maps.map(function (m, i) { return '<button class="sa-tab' + (m === F ? ' on' : '') + '" data-arg="' + i + '">' + m.id + ' <span class="n">' + esc(short(m.head.text, 34)) + '</span></button>'; }).join('');
    var opts = (A.candidates || []).concat([{ unit: F.head.unit, text: F.head.text }]).filter(function (c, i, L) { return L.findIndex(function (x) { return x.unit === c.unit; }) === i; });
    var diagW = Math.max(300, ($('sa-am-diagram') && $('sa-am-diagram').clientWidth) || (box.clientWidth > 980 ? box.clientWidth - 380 : box.clientWidth) || 900);
    box.innerHTML = '<div class="sa-method">' + esc(A.method) + '</div>'
      + '<div class="sa-tabs" id="sa-am-tabs">' + tabs + '</div>'
      + '<div class="am-ctl"><label>Thesis of ' + F.id + ' </label><select id="sa-am-head">' + opts.map(function (c) { return '<option value="' + c.unit + '"' + (c.unit === F.head.unit ? ' selected' : '') + '>' + esc(short(c.text, 80)) + '</option>'; }).join('') + '</select>'
      + ' <span class="am-legend">' + Object.keys(EFF).map(function (k) { return '<span><i style="background:' + EFF[k][1] + '"></i>' + k + ' ' + EFF[k][0] + '</span>'; }).join('') + '</span></div>'
      + '<div class="am-layout"><div class="am-diagram" id="sa-am-diagram">' + fish(F, diagW) + '</div><aside class="am-pane" id="sa-am-pane">' + pane(F) + '</aside></div>'
      + (A.unattached.length ? '<details class="am-unatt"><summary class="sa-sum">Sentences not attached to any argument (' + A.unattached.length + ')</summary><div class="sa-method">Too weakly related to every thesis. “New argument” maps one of them as a thesis of its own.</div>' + A.unattached.slice(0, 200).map(function (u) { return '<div class="am-ua"><span>' + esc(short(U.unitText(u), 180)) + '</span><button class="sa-btn sa-btn-sm" data-newarg="' + u + '">New argument</button></div>'; }).join('') + '</details>' : '');
    // after layout, re-render the diagram at the real width once
    var dg = $('sa-am-diagram'); if (dg && Math.abs(dg.clientWidth - diagW) > 40) dg.innerHTML = fish(F, dg.clientWidth);
    bind(F);
  };
  function bind(F) {
    var box = $('sa-args');
    box.querySelectorAll('[data-arg]').forEach(function (b) { b.onclick = function () { U.am.cur = +b.dataset.arg; U.am.sel = null; U.renderArgs(); }; });
    $('sa-am-head').onchange = function () { U.setThesis(F, this.value); };
    box.querySelectorAll('#sa-am-diagram [data-unit]').forEach(function (d) { d.addEventListener('click', function (e) { e.stopPropagation(); U.am.sel = { unit: d.dataset.unit, bone: d.dataset.bone }; refresh(F, true); }); });
    box.querySelectorAll('#sa-am-diagram [data-more]').forEach(function (d) { d.addEventListener('click', function () { var k = F.id + ':' + d.dataset.more; U.am.expand[k] = !U.am.expand[k]; refresh(F); }); });
    box.querySelectorAll('[data-newarg]').forEach(function (b) { b.onclick = function () { U.addArgument(b.dataset.newarg); }; });
    bindPane(F);
  }
  function bindPane(F) {
    var p = $('sa-am-pane'), sel = U.am.sel;
    p.querySelectorAll('[data-goto]').forEach(function (d) { d.onclick = function () { var u = d.dataset.goto; if (u === F.head.unit) U.am.sel = { unit: u, bone: 'head' }; else { var b = F.bones.filter(function (b) { return b.items.some(function (i) { return i.unit === u; }); })[0]; U.am.sel = b ? { unit: u, bone: b.key } : U.am.sel; U.selectUnit(u); } refresh(F); }; });
    p.querySelectorAll('[data-sel]').forEach(function (d) { d.onclick = function () { U.am.sel = { unit: sel.unit, bone: d.dataset.sel }; refresh(F); }; });
    p.querySelectorAll('[data-act]').forEach(function (b) { b.onclick = function () { var u = sel ? sel.unit : F.head.unit;
      if (b.dataset.act === 'text') { U.selectUnit(u); var t = $('txt-' + u); if (t) t.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
      else if (b.dataset.act === 'thesis') U.setThesis(F, u); else U.addArgument(u); }; });
  }
  function refresh(F, scrollPane) {
    var dg = $('sa-am-diagram'); dg.innerHTML = fish(F, dg.clientWidth); $('sa-am-pane').innerHTML = pane(F);
    var box = $('sa-args'); box.querySelectorAll('#sa-am-diagram [data-unit]').forEach(function (d) { d.addEventListener('click', function (e) { e.stopPropagation(); U.am.sel = { unit: d.dataset.unit, bone: d.dataset.bone }; refresh(F, true); }); });
    box.querySelectorAll('#sa-am-diagram [data-more]').forEach(function (d) { d.addEventListener('click', function () { var k = F.id + ':' + d.dataset.more; U.am.expand[k] = !U.am.expand[k]; refresh(F); }); });
    bindPane(F);
    if (U.am.sel && U.am.sel.bone !== 'head') U.selectUnit(U.am.sel.unit);
    if (scrollPane) { var p = $('sa-am-pane'); if (p.getBoundingClientRect().top > window.innerHeight - 80 || p.getBoundingClientRect().top < 0) p.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
  }
  function recompute(theses, focus) {
    U.disc.arguments = S.argumentMaps(U.last, U.ins, U.disc.rhetoric, { theses: theses });
    var i = U.disc.arguments.maps.findIndex(function (m) { return m.head.unit === focus; }); U.am.cur = i < 0 ? 0 : i; U.am.sel = { unit: focus, bone: 'head' }; U.renderArgs();
  }
  U.setThesis = function (F, uid) { var th = M().maps.map(function (m) { return m === F ? uid : m.head.unit; }).filter(function (x, i, L) { return L.indexOf(x) === i; }); recompute(th, uid); };
  U.addArgument = function (uid) { var th = M().maps.map(function (m) { return m.head.unit; }); if (th.indexOf(uid) < 0) th.push(uid); recompute(th, uid); };

  // ── exports ──
  U.argumentsMarkdown = function () {
    var A = M(); if (!A) return ''; var L = ['## Arguments (Ishikawa maps)', '', '_' + A.method + '_', ''];
    A.maps.forEach(function (F) {
      L.push('### ' + F.id + ': ' + F.head.text, '', '**Structure:** ' + F.shape, '');
      F.bones.forEach(function (b) { if (!b.items.length) return; L.push('**' + b.name + '** (' + b.items.length + ')'); b.items.forEach(function (it) { L.push('- ' + it.effect + ' *' + it.role + '* — “' + it.label + '” — ' + it.how); }); L.push(''); });
    });
    if (A.unattached.length) L.push('_' + A.unattached.length + ' sentence(s) not attached to any argument._', '');
    return L.join('\n');
  };
  var baseMd = U.exportMarkdown;
  U.exportMarkdown = function (R) { var md = baseMd(R); return M() ? md + '\n\n' + U.argumentsMarkdown() : md; };

  // ── hooks ──
  var baseShow = U.show;
  U.show = async function (R, opt) { U.am = { cur: 0, sel: null, expand: {} }; await baseShow(R, opt); try { U.am.sel = { unit: curMap().head.unit, bone: 'head' }; U.renderArgs(); } catch (e) { var b = $('sa-args'); if (b) b.innerHTML = '<div class="sa-panel-empty">Argument map failed: ' + esc(e.message) + '</div>'; if (window.console) console.error(e); } };
  var baseReset = U.reset;
  U.reset = function () { baseReset(); var b = $('sa-args'); if (b) b.innerHTML = '<div class="sa-panel-empty">Run an analysis.</div>'; };
  var baseInit = U.init;
  U.init = function () { baseInit(); var rt, lastW = window.innerWidth; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { if (Math.abs(window.innerWidth - lastW) > 30 && M()) { lastW = window.innerWidth; U.renderArgs(); } }, 250); }); };
})(SA2);

if (typeof document !== 'undefined') { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', SA2.ui.init); else SA2.ui.init(); }
