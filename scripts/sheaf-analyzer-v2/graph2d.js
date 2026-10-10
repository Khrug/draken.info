// ═══ SA2 GRAPH2D ═══ dependency-free canvas force graph with readable labels.
// Pan (drag background), zoom (wheel / pinch / buttons), drag nodes, click to select,
// hover to preview, neighbour highlighting, search, greedy label collision avoidance.
(function (S) {
  'use strict';
  S.Graph2D = function (container, opt) {
    opt = opt || {};
    var canvas = document.createElement('canvas'); canvas.style.width = '100%'; canvas.style.height = '100%'; canvas.style.display = 'block'; canvas.style.touchAction = 'none';
    container.innerHTML = ''; container.appendChild(canvas);
    var ctx = canvas.getContext('2d'), dpr = Math.max(1, window.devicePixelRatio || 1);
    var W = 0, H = 0, nodes = [], links = [], byId = {}, adj = {}, alpha = 0, raf = 0;
    var view = { x: 0, y: 0, k: 1 }, selected = null, hover = null, highlight = null, dragging = null, panning = null, pointers = {}, pinch = null, moved = false;
    var labelMode = 'auto';

    function resize() { var r = container.getBoundingClientRect(); W = r.width; H = r.height; canvas.width = W * dpr; canvas.height = H * dpr; draw(); }
    var ro = new ResizeObserver(resize); ro.observe(container);

    function toWorld(px, py) { return { x: (px - W / 2 - view.x) / view.k, y: (py - H / 2 - view.y) / view.k }; }
    function toScreen(n) { return { x: n.x * view.k + view.x + W / 2, y: n.y * view.k + view.y + H / 2 }; }
    function drawnR(n) { return Math.max(2.5, n.r * Math.sqrt(view.k)); }
    // Hit test against the drawn radius plus padding (larger for fingers); nearest edge wins.
    function nodeAt(px, py, pad) {
      var best = null, bd = Infinity; pad = pad == null ? 6 : pad;
      for (var i = nodes.length - 1; i >= 0; i--) { var n = nodes[i], s = toScreen(n), r = drawnR(n), d = Math.hypot(s.x - px, s.y - py); if (d < r + pad && d - r < bd) { bd = d - r; best = n; } }
      return best;
    }

    // ── simulation ──
    function tick() {
      var n = nodes.length, i, j, a, b, dx, dy, d2, d, f;
      for (i = 0; i < n; i++) { a = nodes[i]; a.fx = 0; a.fy = 0; }
      var rep = 900;
      for (i = 0; i < n; i++) { a = nodes[i];
        for (j = i + 1; j < n; j++) { b = nodes[j]; dx = a.x - b.x; dy = a.y - b.y; d2 = dx * dx + dy * dy + 0.01; if (d2 > 160000) continue;
          f = rep * (a.mass + b.mass) / 2 / d2; d = Math.sqrt(d2); dx /= d; dy /= d; a.fx += dx * f; a.fy += dy * f; b.fx -= dx * f; b.fy -= dy * f; } }
      for (i = 0; i < links.length; i++) { var l = links[i]; a = l.s; b = l.t; dx = b.x - a.x; dy = b.y - a.y; d = Math.sqrt(dx * dx + dy * dy) || 0.01;
        f = (d - l.len) * l.k; dx /= d; dy /= d; a.fx += dx * f; a.fy += dy * f; b.fx -= dx * f; b.fy -= dy * f; }
      for (i = 0; i < n; i++) { a = nodes[i]; a.fx -= a.x * 0.012 * a.mass; a.fy -= a.y * 0.012 * a.mass;
        if (a === dragging) continue;
        a.vx = (a.vx + a.fx / a.mass * alpha) * 0.6; a.vy = (a.vy + a.fy / a.mass * alpha) * 0.6;
        var sp = Math.hypot(a.vx, a.vy); if (sp > 30) { a.vx *= 30 / sp; a.vy *= 30 / sp; }
        a.x += a.vx; a.y += a.vy; }
      alpha *= 0.985;
    }
    var userMoved = false, autoFit = false;
    function loop() { raf = 0; if (alpha > 0.004) { tick(); tick(); raf = requestAnimationFrame(loop); } else if (autoFit) { autoFit = false; if (!userMoved) api.fit(); } draw(); }
    function kick(a) { alpha = Math.max(alpha, a || 0.6); if (!raf) raf = requestAnimationFrame(loop); }

    // ── drawing ──
    function rectsOverlap(a, b) { return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h; }
    function draw() {
      if (!W) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#050805'; ctx.fillRect(0, 0, W, H);
      var focus = selected || hover, nb = focus ? adj[focus.id] : null, hl = highlight;
      var dim = function (n) { if (hl) return !hl.has(n.id); if (focus) return n !== focus && !(nb && nb.has(n.id)); return false; };
      ctx.lineCap = 'round';
      links.forEach(function (l) {
        var a = toScreen(l.s), b = toScreen(l.t), faded = dim(l.s) || dim(l.t);
        ctx.globalAlpha = faded ? 0.1 : (l.kind === 'mention' ? 0.4 : l.kind === 'cooc' ? 0.55 : 0.9);
        ctx.strokeStyle = l.color; ctx.lineWidth = l.width * (faded ? 1 : 1);
        if (l.dash) ctx.setLineDash(l.dash); else ctx.setLineDash([]);
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        if (l.arrow && !faded) { var ang = Math.atan2(b.y - a.y, b.x - a.x), rr = drawnR(l.t) + 3, tx = b.x - Math.cos(ang) * rr, ty = b.y - Math.sin(ang) * rr; ctx.setLineDash([]); ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(tx - 8 * Math.cos(ang - 0.4), ty - 8 * Math.sin(ang - 0.4)); ctx.lineTo(tx - 8 * Math.cos(ang + 0.4), ty - 8 * Math.sin(ang + 0.4)); ctx.closePath(); ctx.fillStyle = l.color; ctx.fill(); }
      });
      ctx.setLineDash([]);
      nodes.forEach(function (n) {
        var s = toScreen(n), r = drawnR(n), faded = dim(n);
        ctx.globalAlpha = faded ? 0.3 : 1;
        ctx.beginPath(); ctx.arc(s.x, s.y, r, 0, 2 * Math.PI);
        ctx.fillStyle = n.kind === 'concept' ? '#16261a' : n.color; ctx.fill();
        if (n.kind === 'concept') { ctx.lineWidth = 2; ctx.strokeStyle = n.color; ctx.setLineDash([3, 2]); ctx.stroke(); ctx.setLineDash([]); }
        if (n.ring) { ctx.lineWidth = 2.5; ctx.strokeStyle = '#ef4444'; ctx.beginPath(); ctx.arc(s.x, s.y, r + 3, 0, 2 * Math.PI); ctx.stroke(); }
        if (n === selected) { ctx.lineWidth = 2; ctx.strokeStyle = '#4ade80'; ctx.beginPath(); ctx.arc(s.x, s.y, r + 6, 0, 2 * Math.PI); ctx.stroke(); }
      });
      // labels: importance order, constant screen size, skip on collision
      var cand = nodes.filter(function (n) {
        if (n === focus || (nb && nb.has(n.id) && focus.kind !== 'claim') || (hl && hl.has(n.id))) return true;
        if (dim(n)) return n.kind !== 'claim' && labelMode !== 'none';
        if (labelMode === 'none') return false;
        if (labelMode === 'all') return true;
        return n.kind !== 'claim' || view.k > 1.8;
      }).sort(function (a, b) { return (b === focus) - (a === focus) || b.importance - a.importance; });
      var placed = [];
      ctx.font = '12px "JetBrains Mono", ui-monospace, monospace'; ctx.textBaseline = 'middle';
      cand.slice(0, 220).forEach(function (n) {
        var s = toScreen(n), txt = n === focus ? n.long || n.label : n.label, w = ctx.measureText(txt).width, r = drawnR(n);
        var box = { x: s.x + r + 4, y: s.y - 9, w: w + 8, h: 18 };
        if (box.x + box.w > W - 4) box.x = s.x - r - 4 - box.w;
        if (box.x < 4) box.x = 4; if (box.x + box.w > W - 4) { box.w = Math.max(40, W - 8 - box.x); }
        if (box.y < 2 || box.y > H - 20) return;
        if (n !== focus && placed.some(function (p) { return rectsOverlap(p, box); })) return;
        placed.push(box);
        var fa = dim(n) ? 0.5 : 1; ctx.globalAlpha = 0.88 * fa; ctx.fillStyle = '#080c08'; ctx.fillRect(box.x, box.y, box.w, box.h);
        ctx.globalAlpha = fa; ctx.save(); ctx.beginPath(); ctx.rect(box.x, box.y, box.w, box.h); ctx.clip(); ctx.fillStyle = n.kind === 'entity' ? '#e4f0e4' : n.kind === 'concept' ? '#a7c4a7' : (n.ring ? '#ffb4b4' : '#c8d8c8');
        ctx.font = (n.kind === 'entity' ? '600 ' : '') + '12px "JetBrains Mono", ui-monospace, monospace';
        ctx.fillText(txt, box.x + 4, box.y + 9.5); ctx.restore();
      });
      ctx.globalAlpha = 1;
    }

    // ── interaction ──
    function pos(e) { var r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
    // A press becomes a drag/pan only after the pointer travels `slop` screen px from where it went down;
    // until then it is a tap and selects the node found at pointerdown (finger jitter no longer cancels taps).
    var press = null;
    canvas.addEventListener('pointerdown', function (e) {
      try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
      var p = pos(e); pointers[e.pointerId] = p; moved = false;
      var ids = Object.keys(pointers);
      if (ids.length === 2) { var a = pointers[ids[0]], b = pointers[ids[1]]; pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), k: view.k, cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2, vx: view.x, vy: view.y }; dragging = null; panning = null; press = null; moved = true; return; }
      var touch = e.pointerType !== 'mouse', n = nodeAt(p.x, p.y, touch ? 16 : 6);
      press = { x: p.x, y: p.y, node: n, slop: touch ? 10 : 4 };
      if (n) { dragging = n; n.vx = n.vy = 0; } else panning = { x: p.x, y: p.y, vx: view.x, vy: view.y };
    });
    canvas.addEventListener('pointermove', function (e) {
      var p = pos(e);
      if (pointers[e.pointerId]) pointers[e.pointerId] = p;
      if (pinch) { var ids = Object.keys(pointers); if (ids.length === 2) { var a = pointers[ids[0]], b = pointers[ids[1]], d = Math.hypot(a.x - b.x, a.y - b.y), k = Math.min(8, Math.max(0.15, pinch.k * d / pinch.d)), w = { x: (pinch.cx - W / 2 - pinch.vx) / pinch.k, y: (pinch.cy - H / 2 - pinch.vy) / pinch.k }, cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2; view.k = k; view.x = cx - W / 2 - w.x * k; view.y = cy - H / 2 - w.y * k; userMoved = true; draw(); } return; }
      if (press && !moved) { if (Math.hypot(p.x - press.x, p.y - press.y) <= press.slop) return; moved = true; }
      if (dragging) { var w2 = toWorld(p.x, p.y); dragging.x = w2.x; dragging.y = w2.y; kick(0.25); return; }
      if (panning) { userMoved = true; view.x = panning.vx + p.x - panning.x; view.y = panning.vy + p.y - panning.y; draw(); return; }
      if (e.pointerType === 'mouse') { var h = nodeAt(p.x, p.y, 6); if (h !== hover) { hover = h; canvas.style.cursor = h ? 'pointer' : 'grab'; if (opt.onHover) opt.onHover(h); draw(); } }
    });
    function end(e) {
      delete pointers[e.pointerId];
      if (pinch) { if (Object.keys(pointers).length < 2) pinch = null; press = null; return; }
      var pr = press; press = null; dragging = null; panning = null;
      if (pr && !moved) api.select(pr.node, true);
    }
    canvas.addEventListener('pointerup', end); canvas.addEventListener('pointercancel', function (e) { delete pointers[e.pointerId]; pinch = null; dragging = null; panning = null; press = null; });
    canvas.addEventListener('wheel', function (e) { e.preventDefault(); var p = pos(e), f = Math.exp(-e.deltaY * 0.0015); zoomAt(p.x, p.y, f); }, { passive: false });
    canvas.addEventListener('mouseleave', function () { if (hover) { hover = null; draw(); } });
    function zoomAt(px, py, f) { userMoved = true; var w = toWorld(px, py); view.k = Math.min(8, Math.max(0.15, view.k * f)); view.x = px - W / 2 - w.x * view.k; view.y = py - H / 2 - w.y * view.k; draw(); }

    var api = {
      setData: function (data) {
        var old = byId; byId = {}; adj = {};
        nodes = data.nodes.map(function (n, i) {
          var o = old[n.id], ang = i * 2.399963, rad = 30 + 12 * Math.sqrt(i);
          var m = Object.assign({ x: o ? o.x : Math.cos(ang) * rad, y: o ? o.y : Math.sin(ang) * rad, vx: 0, vy: 0, mass: n.kind === 'claim' ? 1 : 2.5, importance: 0 }, n);
          byId[m.id] = m; adj[m.id] = new Set(); return m;
        });
        links = data.links.filter(function (l) { return byId[l.source] && byId[l.target]; }).map(function (l) {
          adj[l.source].add(l.target); adj[l.target].add(l.source);
          return Object.assign({ s: byId[l.source], t: byId[l.target], len: l.kind === 'mention' ? 45 : 70, k: l.kind === 'mention' ? 0.05 : 0.08, width: 1, color: '#2a4a2a' }, l, { len: l.len || (l.kind === 'mention' ? 45 : 70), k: l.k || (l.kind === 'mention' ? 0.05 : 0.08) });
        });
        selected = selected && byId[selected.id] ? byId[selected.id] : null; hover = null; highlight = null;
        userMoved = false; autoFit = true; kick(1); setTimeout(function () { if (!userMoved) api.fit(); }, 900);
      },
      select: function (n, fromCanvas) { selected = n || null; draw(); if (fromCanvas && opt.onSelect) opt.onSelect(selected); },
      // Screen positions and drawn radii (canvas px), for tests and overlays.
      layout: function () { return nodes.map(function (n) { var s = toScreen(n); return { id: n.id, kind: n.kind, x: s.x, y: s.y, r: drawnR(n) }; }); },
      selectedId: function () { return selected ? selected.id : null; },
      selectId: function (id) { var n = byId[id]; if (n) { selected = n; api.focus(n); } draw(); return !!n; },
      focus: function (n) { if (!n) return; var k = Math.max(view.k, 1.4); view.k = k; view.x = -n.x * k; view.y = -n.y * k; draw(); },
      fit: function () { if (!nodes.length || !W) return; var um = userMoved; var xs = nodes.map(function (n) { return n.x; }), ys = nodes.map(function (n) { return n.y; });
        var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
        var k = Math.min((W - 80) / Math.max(1, x1 - x0), (H - 80) / Math.max(1, y1 - y0), 2.5); view.k = Math.max(0.15, k); view.x = -(x0 + x1) / 2 * view.k; view.y = -(y0 + y1) / 2 * view.k; userMoved = um; draw(); },
      zoom: function (f) { zoomAt(W / 2, H / 2, f); },
      reheat: function () { kick(0.8); },
      search: function (q) {
        q = (q || '').trim().toLowerCase(); if (!q) { highlight = null; draw(); return []; }
        var hits = nodes.filter(function (n) { return (n.label + ' ' + (n.long || '')).toLowerCase().indexOf(q) >= 0; });
        highlight = new Set(); hits.forEach(function (n) { highlight.add(n.id); adj[n.id].forEach(function (x) { highlight.add(x); }); });
        if (hits[0]) api.focus(hits[0]); draw(); return hits;
      },
      setLabelMode: function (m) { labelMode = m; draw(); },
      neighbors: function (id) { return adj[id] ? Array.from(adj[id]).map(function (x) { return byId[x]; }) : []; },
      clear: function () { selected = null; hover = null; highlight = null; draw(); },
      size: function () { return { nodes: nodes.length, links: links.length }; },
      destroy: function () { ro.disconnect(); cancelAnimationFrame(raf); }
    };
    resize();
    return api;
  };
})(SA2);
