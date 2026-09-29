/**
 * search.js — top-bar keyword search for draken.info
 * Loads /data/search-index.json (built by build.js) on first focus and ranks posts client-side.
 * Query syntax: plain words (all must match, last word matches as a prefix), "DRK-158" or "158"
 * for a number, "L13" for a layer. Keys: "/" focuses, ↑/↓ move, Enter opens, Esc closes.
 */
(function () {
  var input = document.getElementById('site-search-input');
  var panel = document.getElementById('site-search-results');
  if (!input || !panel) return;

  var index = null, loading = null, results = [], active = -1;

  function load() {
    if (index) return Promise.resolve(index);
    if (!loading) loading = fetch('/data/search-index.json').then(function (r) { return r.json(); })
      .then(function (j) {
        index = j.posts.map(function (p) {
          p._t = fold(p.t + ' ' + p.s.replace(/-/g, ' ')); p._e = fold(p.e); p._g = fold(p.g.join(' ')); p._w = ' ' + fold(p.w) + ' ';
          return p;
        });
        return index;
      }).catch(function () { loading = null; return []; });
    return loading;
  }

  // Case- and accent-insensitive comparison (å → a, ö → o, é → e …)
  function fold(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // Full weight when the word starts at a word boundary, a third when it is buried mid-word
  function hit(field, tk, w) {
    var at = field.indexOf(tk);
    if (at < 0) return 0;
    var re = new RegExp('(^|[^\\p{L}\\p{N}])' + tk.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'u');
    return re.test(field) ? w : Math.ceil(w / 3);
  }

  function score(p, tokens) {
    var total = 0;
    for (var i = 0; i < tokens.length; i++) {
      var tk = tokens[i], last = i === tokens.length - 1, s = 0;
      var drk = tk.match(/^(?:drk-?)?(\d{3})$/);
      if (drk && p.d === 'DRK-' + drk[1]) s += 50;
      if (/^l\d{1,2}$/.test(tk)) {
        var lid = 'L' + ('0' + tk.slice(1)).slice(-2);
        if (p.l.indexOf(lid) >= 0) s += 8;
      }
      s += hit(p._t, tk, 12) + hit(p._g, tk, 6) + hit(p._e, tk, 4);
      if (p._w.indexOf(' ' + tk + (last ? '' : ' ')) >= 0) s += 2;
      else if (p._w.indexOf(tk) >= 0) s += 1;
      if (!s) return 0; // every word must match somewhere
      total += s;
    }
    return total;
  }

  function highlight(text, tokens) {
    var out = esc(text);
    tokens.forEach(function (tk) {
      if (tk.length < 2 || /^(drk-?)?\d{3}$/.test(tk)) return;
      var re = new RegExp('(' + tk.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig');
      out = out.replace(re, '<mark>$1</mark>');
    });
    return out;
  }

  function snippet(p, tokens) {
    var e = p.e;
    if (e.length <= 180) return e;
    var f = fold(e), at = -1;
    for (var i = 0; i < tokens.length && at < 0; i++) at = f.indexOf(tokens[i]);
    var start = at > 80 ? e.lastIndexOf(' ', at - 60) + 1 : 0;
    var cut = e.slice(start, start + 180);
    return (start ? '… ' : '') + cut.slice(0, cut.lastIndexOf(' ')) + ' …';
  }

  function run() {
    var q = fold(input.value).trim();
    if (!q) { close(); return; }
    load().then(function (idx) {
      if (fold(input.value).trim() !== q) return; // a newer query is pending
      var tokens = q.split(/\s+/).filter(Boolean);
      results = idx.map(function (p) { return { p: p, s: score(p, tokens) }; })
        .filter(function (r) { return r.s > 0; })
        .sort(function (a, b) { return b.s - a.s || (b.p.dt > a.p.dt ? 1 : -1); })
        .slice(0, 12);
      active = results.length ? 0 : -1;
      render(tokens);
    });
  }

  function render(tokens) {
    if (!results.length) {
      panel.innerHTML = '<div class="ss-empty">No posts match “' + esc(input.value.trim()) + '”.</div>';
    } else {
      panel.innerHTML = results.map(function (r, i) {
        var p = r.p;
        return '<a class="ss-item' + (i === active ? ' active' : '') + '" href="/posts/' + p.s + '/" role="option" data-i="' + i + '">' +
          '<span class="ss-meta">' + esc(p.d) + ' · ' + esc(p.dt) + (p.l.length ? ' · ' + esc(p.l.slice(0, 4).join(' ')) + (p.l.length > 4 ? ' …' : '') : '') + '</span>' +
          '<span class="ss-title">' + highlight(p.t, tokens) + '</span>' +
          '<span class="ss-snippet">' + highlight(snippet(p, tokens), tokens) + '</span></a>';
      }).join('') + '<div class="ss-foot">' + results.length + (results.length === 12 ? '+' : '') + ' result' + (results.length === 1 ? '' : 's') + ' · ↑↓ to move · Enter to open</div>';
    }
    panel.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  }

  function close() { panel.hidden = true; panel.innerHTML = ''; results = []; active = -1; input.setAttribute('aria-expanded', 'false'); }

  function move(d) {
    if (!results.length) return;
    active = (active + d + results.length) % results.length;
    var items = panel.querySelectorAll('.ss-item');
    items.forEach(function (el, i) { el.classList.toggle('active', i === active); });
    items[active].scrollIntoView({ block: 'nearest' });
  }

  var timer;
  input.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(run, 80); });
  input.addEventListener('focus', function () { load(); if (input.value.trim()) run(); });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
    else if (e.key === 'Enter') { if (active >= 0) { e.preventDefault(); location.href = '/posts/' + results[active].p.s + '/'; } }
    else if (e.key === 'Escape') { close(); input.blur(); }
  });
  document.addEventListener('keydown', function (e) {
    var tag = (e.target.tagName || '').toLowerCase();
    if (e.key === '/' && tag !== 'input' && tag !== 'textarea' && tag !== 'select' && !e.target.isContentEditable) { e.preventDefault(); input.focus(); input.select(); }
  });
  document.addEventListener('click', function (e) { if (!e.target.closest('.site-search')) close(); });

  // ?q= opens the search pre-filled (e.g. draken.info/?q=sheaf)
  var q = new URLSearchParams(location.search).get('q');
  if (q) { input.value = q; run(); }
})();
