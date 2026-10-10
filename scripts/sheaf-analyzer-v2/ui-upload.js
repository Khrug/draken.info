// ═══ SA2 UI · UPLOAD ═══ read .txt, .md, .docx and .pdf files into the source box, in the browser.
// .txt/.md: read as UTF-8 text. .docx: the ZIP container is read with the browser's DecompressionStream
// ('deflate-raw'); paragraphs come from word/document.xml (<w:p>, <w:t>, <w:tab>, <w:br>), headings
// (Heading1–6 / Title styles) become Markdown headings. .pdf: pdf.js 4.10.38 (self-hosted, Apache-2.0)
// extracts text per page; lines are rebuilt from text positions, joined into paragraphs, and words
// hyphenated across line ends are rejoined. Nothing is uploaded to a server.
(function (S) {
  'use strict';
  var U = S.ui, $ = function (id) { return document.getElementById(id); };
  var MAX = 40 * 1024 * 1024;
  var PDFJS = '/vendor/pdfjs-4.10.38/';

  // ── ZIP (central directory) + deflate-raw ──
  async function unzipEntry(buf, name) {
    var dv = new DataView(buf), n = buf.byteLength, eocd = -1;
    for (var i = n - 22; i >= Math.max(0, n - 65557); i--) if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
    if (eocd < 0) throw new Error('not a ZIP container (is this really a .docx?)');
    var count = dv.getUint16(eocd + 10, true), off = dv.getUint32(eocd + 16, true), dec = new TextDecoder();
    for (var k = 0; k < count; k++) {
      if (dv.getUint32(off, true) !== 0x02014b50) throw new Error('corrupt ZIP directory');
      var method = dv.getUint16(off + 10, true), csize = dv.getUint32(off + 20, true), nlen = dv.getUint16(off + 28, true), xlen = dv.getUint16(off + 30, true), clen = dv.getUint16(off + 32, true), lho = dv.getUint32(off + 42, true);
      var fname = dec.decode(new Uint8Array(buf, off + 46, nlen));
      if (fname === name) {
        var start = lho + 30 + dv.getUint16(lho + 26, true) + dv.getUint16(lho + 28, true), data = new Uint8Array(buf, start, csize);
        if (method === 0) return dec.decode(data);
        if (method !== 8) throw new Error('unsupported ZIP compression method ' + method);
        if (typeof DecompressionStream === 'undefined') throw new Error('this browser cannot decompress .docx files; please update it or save the document as .txt');
        var stream = new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
        return await new Response(stream).text();
      }
      off += 46 + nlen + xlen + clen;
    }
    throw new Error(name + ' not found in the file');
  }
  async function docxText(buf) {
    var xml = await unzipEntry(buf, 'word/document.xml'), doc = new DOMParser().parseFromString(xml, 'application/xml');
    var W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main', out = [];
    var ps = doc.getElementsByTagNameNS(W, 'p');
    for (var i = 0; i < ps.length; i++) {
      var p = ps[i], st = p.getElementsByTagNameNS(W, 'pStyle')[0], style = st ? (st.getAttributeNS(W, 'val') || st.getAttribute('w:val') || '') : '', t = '';
      var walk = function (node) { for (var c = node.firstChild; c; c = c.nextSibling) { if (c.nodeType !== 1) continue; var ln = c.localName;
        if (ln === 't') t += c.textContent; else if (ln === 'tab') t += '\t'; else if (ln === 'br' || ln === 'cr') t += ' '; else if (ln === 'p') continue; else walk(c); } };
      walk(p); t = t.replace(/\s+/g, ' ').trim(); if (!t) continue;
      var hm = style.match(/^(?:Heading|Rubrik)(\d)$/i) || (/^Title$/i.test(style) ? [0, 1] : null);
      if (hm) t = new Array(Math.min(6, +hm[1]) + 1).join('#') + ' ' + t;
      else if (/^List/i.test(style) || p.getElementsByTagNameNS(W, 'numPr').length) t = '- ' + t;
      out.push(t);
    }
    return out.join('\n\n');
  }

  // ── PDF via pdf.js ──
  var pdfLib = null;
  async function loadPdfjs() {
    if (pdfLib) return pdfLib;
    pdfLib = await import(PDFJS + 'pdf.min.js');
    pdfLib.GlobalWorkerOptions.workerSrc = PDFJS + 'pdf.worker.min.js';
    return pdfLib;
  }
  async function pdfText(buf, progress) {
    var lib = await loadPdfjs();
    var pdf = await lib.getDocument({ data: new Uint8Array(buf), isEvalSupported: false, disableFontFace: true }).promise, pages = [];
    for (var p = 1; p <= pdf.numPages; p++) {
      if (progress) progress(p, pdf.numPages);
      var tc = await (await pdf.getPage(p)).getTextContent(), lines = [], cur = null;
      tc.items.forEach(function (it) {
        if (!('str' in it)) return;
        var y = it.transform[5], x = it.transform[4], h = Math.abs(it.transform[3]) || it.height || 10;
        if (!cur || Math.abs(y - cur.y) > h * 0.5) { cur = { y: y, h: 0, s: '', cells: [] }; lines.push(cur); }
        var gapX = cur.cells.length ? x - cur.xEnd : 0;
        cur.s += (cur.s && !/\s$/.test(cur.s) && it.str && !/^\s/.test(it.str) && gapX > h * 0.15 ? ' ' : '') + it.str;
        if (it.str.trim()) { if (!cur.cells.length || gapX > h * 1.8) cur.cells.push(it.str); else cur.cells[cur.cells.length - 1] += (gapX > h * 0.15 ? ' ' : '') + it.str; cur.h = Math.max(cur.h, h); }
        cur.xEnd = x + (it.width || 0);
      });
      lines = lines.filter(function (l) { return l.s.trim(); });
      // paragraph breaks where the vertical gap is clearly larger than the usual line spacing
      var gaps = []; for (var i = 1; i < lines.length; i++) gaps.push(Math.abs(lines[i - 1].y - lines[i].y));
      var med = gaps.slice().sort(function (a, b) { return a - b; })[Math.floor(gaps.length / 4)] || 12, txt = '';   // lower quartile ≈ normal line spacing
      var hs = lines.map(function (l) { return l.h; }).sort(function (a, b) { return a - b; }), medH = hs[Math.floor(hs.length / 2)] || 10;
      lines.forEach(function (l, i) {
        var s = l.s.replace(/\s+/g, ' ').trim(), words = s.split(' ').length, gapBefore = i ? Math.abs(lines[i - 1].y - l.y) : 99;
        // table rows: three or more cells separated by wide horizontal gaps → Markdown table row (not a claim)
        if (l.cells.length >= 3) { txt += (i ? (/\|\s*$/.test(txt) ? '\n' : '\n\n') : '') + '| ' + l.cells.map(function (c) { return c.replace(/\s+/g, ' ').trim(); }).join(' | ') + ' |'; return; }
        // headings: larger type, or a short numbered line set off from the text, without a sentence end
        var num = s.match(/^(\d+(?:\.\d+)*)\.?\s+[A-ZÅÄÖ]/), big = l.h >= medH * 1.15;
        var mathy = /[=≈≤≥∑∫∂∈∉⊂→↔‖◆•–—·]|[\u{1D400}-\u{1D7FF}]/u.test(s) || /^[^A-ZÅÄÖ0-9]/.test(s);
        if (words <= 14 && !mathy && /[A-Za-zÀ-ÿ]{3}/.test(s) && !/[.!?]\s/.test(s) && !/[.!?,;:]["”’)]?$/.test(s) && gapBefore > med * 1.1 && (big || (num && words <= 12))) {
          var lvl = num ? Math.min(4, num[1].split('.').length + 1) : (l.h >= medH * 1.6 ? 1 : l.h >= medH * 1.3 ? 2 : 3);
          txt += (i ? '\n\n' : '') + new Array(lvl + 1).join('#') + ' ' + s + '\n\n'; return;
        }
        if (i === 0 || /\n\n$/.test(txt)) { txt += s; return; }
        if (/\|\s*$/.test(txt)) { txt += '\n\n' + s; return; }
        var gap = Math.abs(lines[i - 1].y - l.y), brk = gap > med * 1.45 || /[.!?:]["”’)]?$/.test(txt) && /^[A-ZÅÄÖ0-9•\-–(]/.test(s) && gap > med * 1.15;
        if (brk) txt += '\n\n' + s;
        else if (/[A-Za-zÀ-ÿ]-$/.test(txt) && /^[a-zà-ÿ]/.test(s)) txt = txt.slice(0, -1) + s;   // re-join hyphenated words
        else txt += ' ' + s;
      });
      txt = txt.replace(/\n{3,}/g, '\n\n').trim();
      pages.push(txt);
    }
    // drop running headers/footers: a short line repeated on most pages
    var first = pages.map(function (t) { return t.split('\n\n')[0]; }), last = pages.map(function (t) { var a = t.split('\n\n'); return a[a.length - 1]; });
    var common = function (arr) { var c = {}; arr.forEach(function (x) { var k = x.replace(/\d+/g, '#').trim(); if (k.length < 90) c[k] = (c[k] || 0) + 1; }); return Object.keys(c).filter(function (k) { return c[k] >= Math.max(3, pages.length * 0.6); }); };
    var drop = common(first).concat(common(last));
    pages = pages.map(function (t) { return t.split('\n\n').filter(function (b) { return drop.indexOf(b.replace(/\d+/g, '#').trim()) < 0; }).join('\n\n'); });
    // a sentence that runs over a page break continues on the next page
    var out = pages[0] || '';
    for (var pg = 1; pg < pages.length; pg++) { var nx = pages[pg]; if (!nx) continue;
      if (out && /[A-Za-zÀ-ÿ,;]$/.test(out) && /^[a-zà-ÿ(]/.test(nx)) out += ' ' + nx; else if (out && /[A-Za-zÀ-ÿ]-$/.test(out) && /^[a-zà-ÿ]/.test(nx)) out = out.slice(0, -1) + nx; else out += '\n\n' + nx; }
    return { text: out, pages: pdf.numPages };
  }

  // ── public: read any supported file ──
  S.readFile = async function (file, progress) {
    if (file.size > MAX) throw new Error('file is larger than 40 MB');
    var name = file.name.toLowerCase(), ext = (name.match(/\.([a-z0-9]+)$/) || [])[1] || '';
    if (ext === 'txt' || ext === 'md' || ext === 'markdown' || /^text\//.test(file.type)) return { text: (await file.text()).replace(/\r\n?/g, '\n'), kind: ext || 'text' };
    var buf = await file.arrayBuffer();
    if (ext === 'docx' || /wordprocessingml/.test(file.type)) return { text: await docxText(buf), kind: 'docx' };
    if (ext === 'pdf' || file.type === 'application/pdf') { var r = await pdfText(buf, progress); return { text: r.text, kind: 'pdf', pages: r.pages }; }
    if (ext === 'doc') throw new Error('old binary .doc files are not supported; save as .docx or .txt');
    throw new Error('unsupported file type .' + ext + ' (use .txt, .md, .docx or .pdf)');
  };

  async function handle(file) {
    var st = $('sa-upload-status'); st.className = 'sa-upload-status'; st.textContent = 'Reading ' + file.name + '…';
    try {
      var r = await S.readFile(file, function (p, n) { st.textContent = 'Reading ' + file.name + ': page ' + p + ' of ' + n + '…'; });
      var words = (r.text.match(/\S+/g) || []).length;
      if (words < 5) throw new Error(r.kind === 'pdf' ? 'no text found: the PDF may be scanned images (OCR it first)' : 'no text found in the file');
      $('sa-text').value = r.text;
      st.textContent = '✓ ' + file.name + ' — ' + words.toLocaleString('en') + ' words' + (r.pages ? ', ' + r.pages + ' pages' : '') + '. Analyzing…';
      if (U.setMode) U.setMode('single');
      await U.run();
      st.textContent = '✓ ' + file.name + ' — ' + words.toLocaleString('en') + ' words' + (r.pages ? ', ' + r.pages + ' pages' : '') + ' analyzed. The extracted text is in the box above; edit and re-run if needed.';
    } catch (e) { st.className = 'sa-upload-status err'; st.textContent = '✗ ' + file.name + ': ' + e.message; if (window.console) console.error(e); }
  }

  var baseInit = U.init;
  U.init = function () {
    baseInit();
    var inp = $('sa-file'), btn = $('sa-upload'), ta = $('sa-text'); if (!inp || !btn) return;
    btn.onclick = function () { inp.click(); };
    inp.onchange = function () { if (inp.files && inp.files[0]) handle(inp.files[0]); inp.value = ''; };
    // drag and drop onto the text box
    ['dragenter', 'dragover'].forEach(function (ev) { ta.addEventListener(ev, function (e) { if (e.dataTransfer && Array.prototype.indexOf.call(e.dataTransfer.types, 'Files') >= 0) { e.preventDefault(); ta.classList.add('drop'); } }); });
    ['dragleave', 'drop'].forEach(function (ev) { ta.addEventListener(ev, function () { ta.classList.remove('drop'); }); });
    ta.addEventListener('drop', function (e) { if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) { e.preventDefault(); handle(e.dataTransfer.files[0]); } });
  };
})(SA2);
