// ═══ SA2 TEXT ENGINE ═══ segmentation, typed claim extraction, discourse complex,
// three consistency layers (linear · ordinal · propositional), Ψ epistemic closure, reports.
var SA2 = (typeof SA2 !== 'undefined') ? SA2 : (typeof require !== 'undefined' ? require('./engine-math.js') : {});
(function (S) {
  'use strict';
  S.VERSION = '2.0.0';

  // ───────────── lexicon ─────────────
  var STOP = new Set(('happen happened happens occur occurred occurs took take takes taken place event events a an the and or but if then else of in on at to from by for with into onto about over under above below across after before during through out up down off near between among since until while as when where why how whom whose which what who that this those these it its they them their we us our you your i me my he him his she her hers be is are was were been being am have has had do does did done can could may might must shall should will would also only just very so than too more most less least such same other another each every any some all both either neither one own here there there\'s it\'s which whose upon via per within without among again further once even still yet already ever because therefore thus hence however while whereas although though said says say according reported reports claimed claims stated states told'
    + ' och att det som den de en ett är var har hade inte för på med till av om men så vid när eller ska kan sig han hon dem deras sin sitt sina också bara efter före under över mellan').split(/\s+/));
  var NEG = /\b(not|no|never|none|nobody|nothing|neither|nor|cannot|can't|won't|isn't|aren't|wasn't|weren't|doesn't|don't|didn't|hasn't|haven't|hadn't|shouldn't|wouldn't|couldn't|inte|ej|aldrig|ingen|inget|inga|ei)\b|n't\b/gi;
  var REPORT = /\b(said|says|say|claimed|claims|claim|stated|states|reported|reports|according to|alleged|alleges|allegedly|testified|told|believes|believed|insisted|insists|denied|denies|argued|argues|maintains|maintained|asserted|asserts|wrote|writes|recalled|recalls|uppgav|uppger|säger|sade|sa att|enligt|hävdar|hävdade|påstår|påstod)\b/i;
  var HYPO = /\b(may|might|could|perhaps|possibly|probably|likely|presumably|suppose|supposedly|hypothesi[sz]ed?|hypothesizes|theori[sz]ed|speculated?|speculates|if|unless|whether|kanske|möjligen|troligen|eventuellt)\b/i;
  var HEDGE = /\b(about|around|approximately|approx\.?|roughly|nearly|almost|some|circa|ca\.?|över|ungefär|omkring|drygt|knappt)\b|~/i;
  var MONTHS = { jan: 0, january: 0, januari: 0, feb: 1, february: 1, februari: 1, mar: 2, march: 2, mars: 2, apr: 3, april: 3, may: 4, maj: 4, jun: 5, june: 5, juni: 5, jul: 6, july: 6, juli: 6, aug: 7, august: 7, augusti: 7, sep: 8, sept: 8, september: 8, oct: 9, october: 9, okt: 9, oktober: 9, nov: 10, november: 10, dec: 11, december: 11 };
  var MONTH_RE = '(jan(?:uary|uari)?|feb(?:ruary|ruari)?|mar(?:ch|s)?|apr(?:il)?|may|maj|june?|juni|july?|juli|aug(?:ust|usti)?|sept?(?:ember)?|oct(?:ober)?|okt(?:ober)?|nov(?:ember)?|dec(?:ember)?)';
  var NUMWORD = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90, hundred: 100, thousand: 1000, dozen: 12 };
  var SCALE = { thousand: 1e3, million: 1e6, millions: 1e6, billion: 1e9, billions: 1e9, trillion: 1e12, k: 1e3, m: 1e6, bn: 1e9, miljoner: 1e6, miljon: 1e6, miljarder: 1e9, miljard: 1e9, tusen: 1e3 };
  var UNIT_RE = /^\s*(%|percent|per cent|procent|km|kilometers?|kilometres?|m|meters?|metres?|cm|mm|kg|kilograms?|g|grams?|tons?|tonnes?|kr|sek|usd|eur|\$|€|£|dollars?|euros?|kronor|people|persons?|deaths?|dead|victims?|shots?|bullets?|rounds?|weapons?|guns?|years?|months?|weeks?|days?|hours?|minutes?|seconds?|år|dagar|timmar|minuter|men|women|children|cases?|votes?|seats?|pages?|words?|times?)\b/i;
  var ORDER_BEFORE = /\b(before|prior to|earlier than|preceded|preceding|ahead of|innan|före)\b/i;
  var ORDER_AFTER = /\b(after|later than|followed|following|subsequent to|efter)\b/i;
  var SUPPORT_FWD = /\b(therefore|thus|hence|consequently|accordingly|which (?:proves|shows|means|demonstrates|confirms)|this (?:proves|shows|means|demonstrates|confirms|is why|explains)|that is why|so it follows|it follows that|därför|alltså|vilket visar|vilket bevisar)\b/i;
  var SUPPORT_BACK = /\b(because|since|as shown by|given that|due to|owing to|eftersom|då)\b/i;
  var EVIDENCE_VERB = /\b(is|are|was|were)?\s*(?:itself\s+)?(evidence|proof|proves|prove|proving|confirms?|confirmation|shows?|demonstrates?|bevis|bevisar|visar)\b/i;
  var ABSENCE = /\b(no evidence|lack of evidence|absence of (?:evidence|proof)|without evidence|no proof|unproven|cannot be proven|can't be proven|nobody can prove|no one can prove|cover[- ]?up|covered up|suppress\w*|den(?:y|ies|ied|ial)|refus\w* to (?:admit|acknowledge|release)|hidden|hiding|silence[ds]?|contradict\w*|debunk\w*|fact[- ]?check\w*|official (?:story|narrative|version)|mainstream narrative|inga bevis|mörkläggning|förneka\w*|tystas?)\b/i;
  var ANCHOR = /(https?:\/\/|doi\.org|\bdoi:|\[\d+\]|\(\s*[A-ZÅÄÖ][\w'’-]+(?: et al\.?)?,?\s+(?:1[89]|20)\d{2}[a-z]?\s*\)|\baccording to\s+[A-ZÅÄÖ]|\benligt\s+[A-ZÅÄÖ]|\b(?:1[89]|20)\d{2}\b)/;

  // ───────────── helpers ─────────────
  function stem(w) {
    if (w.length <= 4) return w;
    var ends = ['ings', 'ing', 'edly', 'ed', 'es', 's', 'ly', 'arna', 'erna', 'orna', 'en', 'et', 'na'];
    for (var i = 0; i < ends.length; i++) { var e = ends[i]; if (w.endsWith(e) && w.length - e.length >= 4) { w = w.slice(0, -e.length); break; } }
    if (w.length > 4 && w.endsWith('e')) w = w.slice(0, -1);
    return w;
  }
  function contentWords(text) {
    var t = text.toLowerCase().replace(NEG, ' ').replace(/[^a-zåäöéèüøæ' -]+/g, ' ');
    var out = [];
    t.split(/\s+/).forEach(function (w) { w = w.replace(/^['-]+|['-]+$/g, ''); if (w.length < 3 || STOP.has(w) || NUMWORD[w] !== undefined || MONTHS[w] !== undefined || SCALE[w] !== undefined) return; out.push(stem(w)); });
    return out;
  }
  function jaccard(A, B) { if (!A.size || !B.size) return 0; var i = 0; A.forEach(function (x) { if (B.has(x)) i++; }); return i / (A.size + B.size - i); }
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); }
  function dayNum(y, m, d) { return Math.round(Date.UTC(y, m, d) / 86400000); }
  function dayStr(n) { var d = new Date(n * 86400000); return d.toISOString().slice(0, 10); }
  S.util = { contentWords: contentWords, jaccard: jaccard, dayNum: dayNum, dayStr: dayStr, stem: stem };

  // ───────────── 1. segmentation (Markdown-robust, offset-preserving) ─────────────
  // Units never span a line break: headings, bullets and table rows are their own units, so
  // claim identity does not depend on whether a line ends with a full stop.
  var REF_HEAD = /^\s*#{1,6}\s*(references|sources|bibliography|works cited|further reading|notes|footnotes|källor|referenser|litteratur|citations?)\b/i;
  var CITE_LINE = /(\b\d+\s*\(\d+\)\s*[:,]\s*\d+|\bdoi[:.]|https?:\/\/|\bvol\.\s*\d|\bpp?\.\s*\d|arxiv|\bISBN\b|^\s*[-*]\s*[A-ZÅÄÖ][^.]{0,80}\((?:1[5-9]|20)\d{2}[a-z]?\))/i;
  S.segment = function (text, sourceTag, baseOffset) {
    baseOffset = baseOffset || 0;
    var units = [], para = 0, lineStart = 0, lines = text.split('\n'), inFence = false, inRefs = false;
    for (var li = 0; li < lines.length; li++) {
      var line = lines[li], ls = lineStart; lineStart += line.length + 1;
      if (/^\s*```/.test(line)) { inFence = !inFence; continue; }
      if (inFence) continue;
      if (!line.trim()) { para++; continue; }
      if (/^\s*#{1,6}\s/.test(line)) inRefs = REF_HEAD.test(line);
      var words = line.trim().split(/\s+/).length, headingLike = !isHeading && words <= 10 && !/[.!?…:;]["')\]]*\s*$/.test(line.trim()) && lines.length > 1;
      var citeLike = line.length < 220 && (/\(\s*(?:[A-Za-zåäö]{3,9}\.?\s+)?(?:\d{1,2}\s+)?(?:1[5-9]|20)\d{2}[a-z]?\s*\)\.?\s*$/.test(line) || /^\s*[-*•]?\s*[A-ZÅÄÖ][^.!?]{1,80}\(\s*(?:1[5-9]|20)\d{2}[a-z]?\s*\)/.test(line) || /\b\d+\s*[,:]\s*\d+\s*[–-]\s*\d+\.?\s*$/.test(line) || /^\s*[—–]\s/.test(line));
      var nonclaim = inRefs || citeLike || /^\s*</.test(line) || CITE_LINE.test(line) || /\$\$|\\(frac|left|right|sum|int|begin|end|mathbb|mathrm|operatorname)\b|^\s*\\/.test(line) || /^\s*[\w\s·()-]{2,32}:\s*[\d\[(]/.test(line) && line.length < 140 || /^\s*\|/.test(line);
      if (/^\s*(\|?\s*:?-{3,}|---+\s*$|\*\*\*+\s*$)/.test(line)) continue;
      // split line into sentences; keep offsets
      var re = /[^.!?…]+(?:[.!?…]+(?=\s|$)|$)/g, m, isHeading = /^\s*#{1,6}\s/.test(line);
      var chunks = [];
      // protect abbreviations / decimals by merging chunks that end in a known abbreviation or a digit-dot-digit
      while ((m = re.exec(line)) !== null) { if (!m[0].trim()) { if (re.lastIndex === m.index) re.lastIndex++; continue; } chunks.push({ s: m.index, e: m.index + m[0].length }); }
      var merged = [];
      chunks.forEach(function (c) {
        var prev = merged[merged.length - 1];
        if (prev) { var pt = line.slice(prev.s, prev.e); if (/\b(e\.g|i\.e|etc|vs|mr|mrs|ms|dr|prof|no|st|approx|ca|fig|al|jan|feb|aug|sept|oct|nov|dec|u\.s|d\.v\.s|t\.ex|bl\.a)\.\s*$/i.test(pt) || /\d\.$/.test(pt.trim()) && /^\d/.test(line.slice(c.s).trim())) { prev.e = c.e; return; } }
        merged.push({ s: c.s, e: c.e });
      });
      merged.forEach(function (c) {
        var raw = line.slice(c.s, c.e), lead = raw.length - raw.replace(/^\s+/, '').length;
        var t = raw.trim(); if (t.replace(/[#>*_\-|`\s]/g, '').length < 3) return;
        units.push({ id: 'u' + units.length, text: t, start: baseOffset + ls + c.s + lead, end: baseOffset + ls + c.s + lead + t.length, para: para, line: li, source: sourceTag || null, heading: isHeading || headingLike, nonclaim: nonclaim });
      });
    }
    return units;
  };

  // Running headers, footers and page numbers: a short text that recurs >= 3 times once digits are
  // removed is boilerplate (e.g. "Toward a Spectral Theory of Cellular Sheaves 43" on every page).
  // Such units carry no claims, and the recurring phrase is blanked where it is glued into other units.
  S.markBoilerplate = function (units) {
    var norm = function (t) { return t.toLowerCase().replace(/\d+/g, ' ').replace(/[^a-zåäöéü ]+/g, ' ').replace(/\s+/g, ' ').trim(); };
    var occ = {};
    units.forEach(function (u) { var n = norm(u.text); if (n.split(' ').length <= 14 && n.length >= 8) (occ[n] = occ[n] || []).push(u); });
    // page numbering: the numbers increase through the document; a fixed footer repeats unchanged >= 4 times.
    // Three sentences stating three different values (a real conflict) do neither.
    var phrases = Object.keys(occ).filter(function (k) {
      var us = occ[k]; if (us.length < 3) return false;
      // headers are spread through the document, separated by body text
      var idx = us.map(function (u) { return +u.id.slice(1); }), gaps = [];
      for (var g = 1; g < idx.length; g++) gaps.push(idx[g] - idx[g - 1]);
      gaps.sort(function (a, b) { return a - b; });
      if (gaps[Math.floor(gaps.length / 2)] < 2) return false;
      var nums = us.map(function (u) { var m = u.text.match(/\d+/g); return m ? +m[m.length - 1] : null; });
      if (nums.every(function (x) { return x === null; }) || nums.every(function (x) { return x === nums[0]; })) return us.length >= 4;
      for (var i = 1; i < nums.length; i++) if (nums[i] === null || nums[i - 1] === null || nums[i] <= nums[i - 1]) return false;
      return true;
    });
    if (!phrases.length) return;
    var set = new Set(phrases);
    units.forEach(function (u) {
      if (set.has(norm(u.text))) { u.nonclaim = true; u.boilerplate = true; return; }
      phrases.forEach(function (ph) {
        if (ph.split(' ').length < 3) return;
        var re = new RegExp(ph.split(' ').map(function (w) { return w.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); }).join('[^a-zåäöéü0-9]+') + '[^a-zåäöéü0-9]*\\d*', 'gi');
        if (re.test(u.text)) { u.cleanText = (u.cleanText || u.text).replace(re, function (m) { return ' '.repeat(m.length); }); }
      });
    });
  };

  // ───────────── 2. claim extraction ─────────────
  function modalityOf(t) {
    if (/\?\s*$/.test(t)) return { kind: 'question' };
    var rm = t.match(REPORT);
    if (rm) {
      var src = null, acc = t.match(/\b(?:according to|enligt)\s+([^,.;:]{2,60})/i);
      if (acc) src = acc[1].trim(); else { var before = t.slice(0, rm.index).trim().split(/\s+/).slice(-4).join(' ').replace(/^(the|a|an|that)\s+/i, ''); if (before) src = before; }
      return { kind: 'reported', source: src };
    }
    if (HYPO.test(t)) return { kind: 'hypothesized' };
    return { kind: 'asserted' };
  }
  function polarityOf(t) {
    var c = t.replace(/\bnot only\b/gi, ' ').replace(/,\s*(?:and\s+)?not\s+[\w-]+(?:\s+[\w-]+)?/gi, ' ').replace(/\bnot\s+(?:a\s+|an\s+|the\s+)?[\w-]+,?\s+but\b/gi, ' ').replace(/\bno\s+(?:longer|more|matter|doubt)\b/gi, ' ');
    var m = c.match(NEG); return (m ? m.length : 0) % 2 === 1 ? -1 : 1;
  }

  function parseDates(t) {
    var out = [], used = [], m;
    var push = function (idx, len, lo, hi, prec) { for (var k = 0; k < used.length; k++) if (idx < used[k][1] && idx + len > used[k][0]) return; used.push([idx, idx + len]); out.push({ index: idx, length: len, lo: lo, hi: hi, precision: prec, text: t.substr(idx, len) }); };
    var iso = /\b((?:1[5-9]|20)\d{2})-(\d{2})-(\d{2})\b/g;
    while ((m = iso.exec(t))) { var y = +m[1], mo = +m[2] - 1, d = +m[3]; if (mo < 12 && d >= 1 && d <= 31) push(m.index, m[0].length, dayNum(y, mo, d), dayNum(y, mo, d), 'day'); }
    var dmy = new RegExp('\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+(?:of\\s+)?' + MONTH_RE + '\\.?,?\\s+((?:1[5-9]|20)\\d{2})\\b', 'gi');
    while ((m = dmy.exec(t))) { var d1 = +m[1], mo1 = MONTHS[m[2].toLowerCase().replace(/\.$/, '')], y1 = +m[3]; if (mo1 !== undefined && d1 >= 1 && d1 <= 31) push(m.index, m[0].length, dayNum(y1, mo1, d1), dayNum(y1, mo1, d1), 'day'); }
    var mdy = new RegExp('\\b' + MONTH_RE + '\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?,?\\s+((?:1[5-9]|20)\\d{2})\\b', 'gi');
    while ((m = mdy.exec(t))) { var mo2 = MONTHS[m[1].toLowerCase().replace(/\.$/, '')], d2 = +m[2], y2 = +m[3]; if (mo2 !== undefined && d2 >= 1 && d2 <= 31) push(m.index, m[0].length, dayNum(y2, mo2, d2), dayNum(y2, mo2, d2), 'day'); }
    var my = new RegExp('\\b' + MONTH_RE + '\\.?\\s+((?:1[5-9]|20)\\d{2})\\b', 'gi');
    while ((m = my.exec(t))) { var mo3 = MONTHS[m[1].toLowerCase().replace(/\.$/, '')], y3 = +m[2]; if (mo3 !== undefined) push(m.index, m[0].length, dayNum(y3, mo3, 1), dayNum(y3, mo3 + 1, 1) - 1, 'month'); }
    var yr = /\b(?:in|during|by|of|since|year|år|året|i|under)\s+((?:1[5-9]|20)\d{2})\b(?!\s*(?:%|percent|people|km|kg))/gi;
    while ((m = yr.exec(t))) { var y4 = +m[1], off = m[0].indexOf(m[1]); push(m.index + off, 4, dayNum(y4, 0, 1), dayNum(y4, 11, 31), 'year'); }
    return out;
  }
  function parseNumbers(t, dateSpans) {
    var out = [], re = /(?:\$|€|£)?\b\d{1,3}(?:[,\s]\d{3})+(?:\.\d+)?\b|(?:\$|€|£)?\b\d+(?:[.,]\d+)?\b|\b(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand|dozen)\b/gi, m;
    while ((m = re.exec(t))) {
      var idx = m.index, s = m[0];
      if (dateSpans.some(function (d) { return idx >= d.index && idx < d.index + d.length; })) continue;
      if (/^\d{4}$/.test(s) && +s >= 1500 && +s <= 2100) { out.push({ index: idx, length: s.length, value: +s, unit: 'year', hedged: false, text: s, yearLike: true }); continue; }
      var v; if (m[1]) v = NUMWORD[m[1].toLowerCase()]; else { var cl = s.replace(/[$€£]/g, ''); v = /\d[,\s]\d{3}/.test(cl) ? +cl.replace(/[,\s]/g, '') : +cl.replace(',', '.'); }
      if (!isFinite(v)) continue;
      if (/^[$€£]/.test(s)) var cur = s[0];
      var after = t.slice(idx + s.length), sc = after.match(/^\s*(thousand|million|millions|billion|billions|trillion|bn|miljoner|miljon|miljarder|miljard|tusen)\b/i), len = s.length;
      if (sc) { v *= SCALE[sc[1].toLowerCase()]; len += sc[0].length; after = t.slice(idx + len); }
      var um = after.match(UNIT_RE), unit = cur || (um ? um[1].toLowerCase().replace(/s$/, '').replace(/^per ?cent|procent$/, '%') : '');
      if (unit === 'percent') unit = '%';
      var hedged = HEDGE.test(t.slice(Math.max(0, idx - 14), idx));
      // ordinals / list markers / section numbers are not quantities
      if (/^\s*(st|nd|rd|th)\b/i.test(after) || /§\s*$/.test(t.slice(0, idx)) || /\b(drk|section|chapter|page|p\.|nr|no\.?|layer|l|step|part|phase|stage|level|rule|axiom|law|item|case|figure|fig\.?|table|act|book|volume|vol\.?|ch\.?|version|v|round|day|session|post|episode|season|issue|claim|thesis|hypothesis|h|p|q|lemma|theorem|proposition|corollary|definition|remark|example|exercise|amendment|article|clause)\s*[-#]?$/i.test(t.slice(Math.max(0, idx - 14), idx))) continue;
      out.push({ index: idx, length: len, value: v, unit: unit, hedged: hedged, text: t.substr(idx, len) });
      cur = undefined;
    }
    return out;
  }

  // Extract typed claims from one unit.
  S.extractClaims = function (u) {
    var t = u.cleanText || u.text, claims = [], mod = modalityOf(t), pol = polarityOf(t);
    if (u.nonclaim || u.heading) { claims.support = { fwd: false, back: null, evidenceVerb: false, absence: false, anchored: true }; return claims; }
    var plain = t.replace(/^[#>*\-+\s]+/, '').replace(/\*\*|__|`/g, '');
    t = t.replace(/\((?=[^()]*[A-ZÅÄÖ][^()]*(?:1[5-9]|20)\d{2})[^()]{0,120}\)/g, function (m) { return ' '.repeat(m.length); }).replace(/\$[^$]{1,200}\$/g, function (m) { return ' '.repeat(m.length); }).replace(/^(\s*(?:[-*+]\s+)?)(\d{1,2})([.)]?\s+)(?=[A-ZÅÄÖ])/, function (m, a, b, c) { return a + ' '.repeat(b.length) + c; });
    var dates = parseDates(t), nums = parseNumbers(t, dates);
    var frameText = t;
    dates.concat(nums).forEach(function (x) { frameText = frameText.slice(0, x.index) + ' '.repeat(x.length) + frameText.slice(x.index + x.length); });
    if (mod.kind === 'reported') {
      var acc = frameText.match(/\b(?:according to|enligt)\s+[^,]{2,60},\s*/i), rv = frameText.match(REPORT);
      if (acc) frameText = frameText.slice(0, acc.index) + ' '.repeat(acc[0].length) + frameText.slice(acc.index + acc[0].length);
      else if (rv) { var cut = rv.index + rv[0].length, th = frameText.slice(cut).match(/^\s*(?:that|att)\b/i); if (th) cut += th[0].length; frameText = ' '.repeat(cut) + frameText.slice(cut); }
    }
    var frame = contentWords(frameText);
    var base = { unit: u.id, source: u.source, span: { start: u.start, end: u.end, quote: t }, modality: mod, polarity: pol, frame: frame };
    // propositional claim: every unit with enough content is a proposition with polarity
    if (frame.length >= 3 && !u.heading) claims.push(Object.assign({ type: 'proposition' }, base));
    // numeric point claims (non-year values)
    var formula = /[→←↔≥≤≈∑∫∂∝]|[Α-Ωα-ω](?:_\w+)?\s*[<>=]/.test(t);
    var vals = formula ? [] : nums.filter(function (n) { return !n.yearLike; });
    if (vals.length && frame.length >= 2) claims.push(Object.assign({ type: 'numeric', values: vals.map(function (n) { return { value: n.value, unit: n.unit, hedged: n.hedged, text: n.text }; }), scopeYears: nums.filter(function (n) { return n.yearLike; }).map(function (n) { return n.value; }) }, base));
    // dated event claims (ordinal layer); bare years only when no full date, as scope
    if (dates.length === 1 && frame.length >= 2) claims.push(Object.assign({ type: 'date', interval: [dates[0].lo, dates[0].hi], precision: dates[0].precision, dateText: dates[0].text }, base));
    else if (dates.length === 0 && nums.some(function (n) { return n.yearLike; }) && vals.length === 0 && frame.length >= 2) {
      var ys = nums.filter(function (n) { return n.yearLike; }); if (ys.length === 1) claims.push(Object.assign({ type: 'date', interval: [dayNum(ys[0].value, 0, 1), dayNum(ys[0].value, 11, 31)], precision: 'year', dateText: ys[0].text }, base));
    }
    // explicit order relations: "A before/after B"
    var bm = t.match(ORDER_BEFORE), am = t.match(ORDER_AFTER), om = bm || am;
    if (om && pol === 1) {
      var left = t.slice(0, om.index), right = t.slice(om.index + om[0].length);
      var lw = contentWords(left.replace(/\d+/g, ' ')), rw = contentWords(right.replace(/\d+/g, ' '));
      var off = t.match(/\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten|twelve|twenty|thirty)\s+(day|week|month|year)s?\s+(before|after|earlier|later)\b/i);
      if (lw.length >= 1 && rw.length >= 1) {
        var rel = { type: 'order', a: lw, b: rw, relation: bm ? 'before' : 'after' };
        if (off) { var k = isNaN(+off[1]) ? NUMWORD[off[1].toLowerCase()] : +off[1]; rel.offsetDays = k * ({ day: 1, week: 7, month: 30.4375, year: 365.25 })[off[2].toLowerCase()]; }
        claims.push(Object.assign(rel, base));
      }
    }
    // explicit numeric relations: "X is N more/less than Y", "X exceeds Y by N"
    var rm = t.match(/^(.{3,80}?)\s+(?:is|was|are|were|has|had)?\s*(\d+(?:[.,]\d+)?)\s*(%|percent|[a-z]+)?\s+(more|higher|greater|larger|bigger|longer|taller|older|heavier|wider|later|less|lower|fewer|smaller|shorter|younger|lighter|narrower|earlier)\s+than\s+(.{3,80})$/i);
    if (rm && pol === 1) { var sgn = /more|higher|greater|larger|bigger|longer|taller|older|heavier|wider|later/i.test(rm[4]) ? 1 : -1; claims.push(Object.assign({ type: 'relation', x: contentWords(rm[1]), y: contentWords(rm[5]), diff: sgn * +rm[2].replace(',', '.'), unit: (rm[3] || '').toLowerCase() }, base)); }
    if (claims.some(function (c) { return c.type === 'relation'; })) claims = claims.filter(function (c) { return c.type !== 'numeric'; });
    // support markers (Ψ layer)
    var sf = plain.match(SUPPORT_FWD), sb = plain.match(SUPPORT_BACK);
    claims.support = { fwd: !!sf && sf.index < 40, back: sb ? { index: sb.index } : null, evidenceVerb: EVIDENCE_VERB.test(plain), absence: ABSENCE.test(plain), anchored: ANCHOR.test(t) };
    return claims;
  };

  // ───────────── 3. analysis ─────────────
  // Candidate pairs via inverted index on the rarest frame words (avoids O(n²) on large corpora).
  function candidatePairs(items, minShared) {
    var df = {}; items.forEach(function (it) { new Set(it.frame).forEach(function (w) { df[w] = (df[w] || 0) + 1; }); });
    var index = {}, pairs = new Set();
    items.forEach(function (it, i) {
      var rare = Array.from(new Set(it.frame)).sort(function (a, b) { return df[a] - df[b]; }).slice(0, 4);
      rare.forEach(function (w) { if (df[w] > 400) return; (index[w] = index[w] || []).forEach(function (j) { pairs.add(j < i ? j + ',' + i : i + ',' + j); }); index[w].push(i); });
    });
    return Array.from(pairs).map(function (p) { return p.split(',').map(Number); });
  }
  function isAsserted(c) { return c.modality.kind === 'asserted'; }
  function conflictClass(a, b) {
    var ka = a.modality.kind, kb = b.modality.kind;
    if (ka === 'asserted' && kb === 'asserted') return 'contradiction';
    if (ka === 'question' || kb === 'question') return 'question';
    if (ka === 'hypothesized' || kb === 'hypothesized') return 'tension-with-hypothesis';
    if (ka === 'reported' && kb === 'reported' && a.modality.source && b.modality.source && a.modality.source.toLowerCase() === b.modality.source.toLowerCase()) return 'inconsistent-testimony';
    return 'conflicting-accounts';
  }

  S.analyze = function (input, opt) {
    opt = opt || {};
    var sources = typeof input === 'string' ? [{ text: input, tag: null }] : input;
    var units = [], offset = 0, fullText = '';
    sources.forEach(function (s) { var u = S.segment(s.text, s.tag, offset); u.forEach(function (x) { x.id = 'u' + (units.length); units.push(x); }); fullText += s.text + '\n\n'; offset += s.text.length + 2; });
    S.markBoilerplate(units);
    var claims = [], support = {};
    units.forEach(function (u) {
      var cs = S.extractClaims(u); support[u.id] = cs.support;
      cs.forEach(function (c) { c.id = 'c' + claims.length; c.fset = new Set(c.frame); claims.push(c); });
    });
    var byType = function (t) { return claims.filter(function (c) { return c.type === t; }); };
    var props = byType('proposition'), numerics = byType('numeric'), dated = byType('date'), orders = byType('order'), relations = byType('relation');
    var edges = [], obstructions = [];

    // ── Layer C: propositional (polarity) ──
    var propEdges = [];
    candidatePairs(props).forEach(function (p) {
      var a = props[p[0]], b = props[p[1]]; if (a.unit === b.unit) return;
      var j = jaccard(a.fset, b.fset); if (j < 0.8 || Math.min(a.fset.size, b.fset.size) < 3) return;
      var conflict = a.polarity !== b.polarity;
      var e = { layer: 'propositional', a: a.id, b: b.id, sim: j, conflict: conflict };
      propEdges.push(e); edges.push(e);
      if (conflict) obstructions.push({ layer: 'propositional', kind: 'polarity', class: conflictClass(a, b), claims: [a.id, b.id], magnitude: { kind: 'logical', value: 'unsatisfiable' }, witness: 'P ∧ ¬P on frame similarity ' + j.toFixed(2) });
    });

    // ── Layer A: linear (numeric gluing residuals + explicit relation cochains with Hodge) ──
    var linEdges = [];
    candidatePairs(numerics).forEach(function (p) {
      var a = numerics[p[0]], b = numerics[p[1]]; if (a.unit === b.unit) return;
      var j = jaccard(a.fset, b.fset); if (j < 0.6 || Math.min(a.fset.size, b.fset.size) < 2) return;
      if (a.values.length !== b.values.length) return;               // different structure → not comparable
      if (a.scopeYears.join() !== b.scopeYears.join()) return;      // different temporal scope → not comparable
      if (a.polarity !== b.polarity) return;                         // handled by propositional layer
      var worst = 0, unresolved = false;
      for (var k = 0; k < a.values.length; k++) {
        var va = a.values[k], vb = b.values[k];
        if (va.unit !== vb.unit) { unresolved = true; break; }
        var tol = (va.hedged || vb.hedged) ? 0.1 : 1e-9, den = Math.max(Math.abs(va.value), Math.abs(vb.value), 1e-12);
        var rel = Math.abs(va.value - vb.value) / den; if (rel > tol) worst = Math.max(worst, rel);
      }
      if (unresolved) return;
      var e = { layer: 'linear', a: a.id, b: b.id, sim: j, conflict: worst > 0, residual: worst };
      linEdges.push(e); edges.push(e);
      if (worst > 0) obstructions.push({ layer: 'linear', kind: 'gluing-residual', class: conflictClass(a, b), claims: [a.id, b.id], magnitude: { kind: 'relative-difference', value: +worst.toFixed(4), unit: a.values.map(function (v) { return v.unit || 'count'; }).join(',') }, witness: a.values.map(function (v) { return v.text; }).join(', ') + ' vs ' + b.values.map(function (v) { return v.text; }).join(', ') });
    });
    // explicit relations → graph on entities, Hodge decomposition, harmonic part = κ_linear
    var hodgeReport = null;
    if (relations.length) {
      var ents = [], entOf = function (ws) { var s = new Set(ws); for (var i = 0; i < ents.length; i++) if (jaccard(ents[i].s, s) >= 0.6) return i; ents.push({ s: s, label: ws.slice(0, 4).join(' ') }); return ents.length - 1; };
      var redges = [], y = [], rclaims = [];
      relations.forEach(function (r) { var xi = entOf(r.x), yi = entOf(r.y); if (xi === yi) return; redges.push([yi, xi]); y.push(r.diff); rclaims.push(r.id); });
      if (redges.length) {
        var sh = new S.Sheaf({ vertices: ents.map(function (_, i) { return i; }), edges: redges });
        var h = sh.hodge(y), coh = sh.cohomology();
        hodgeReport = { entities: ents.map(function (e) { return e.label; }), edges: redges, cochain: y, norms: h.norms, H1: coh.H1, harmonic: Array.from(h.harm), claims: rclaims };
        if (h.norms[1] > 1e-6) obstructions.push({ layer: 'linear', kind: 'harmonic-class', class: 'contradiction', claims: rclaims.filter(function (_, i) { return Math.abs(h.harm[i]) > 1e-6; }), magnitude: { kind: 'harmonic-norm', value: +h.norms[1].toFixed(4) }, witness: 'relation cochain not a coboundary: ‖h‖ = ' + h.norms[1].toFixed(3) + ', dim H¹ = ' + coh.H1 });
      }
    }

    // ── Layer B: ordinal (dated events + order relations as difference constraints) ──
    var events = [], eventOf = function (ws, minJ) { var s = new Set(ws); var best = -1, bj = minJ; for (var i = 0; i < events.length; i++) { var jj = jaccard(events[i].s, s); if (jj >= bj) { bj = jj; best = i; } } if (best >= 0) return best; events.push({ s: s, label: ws.slice(0, 5).join(' '), claims: [] }); return events.length - 1; };
    var ordCons = [];
    var canon = function (arr) { return arr.slice().sort(function (x, y) { var a = x.frame.slice().sort().join(' ') + '|' + (x.interval ? x.interval.join() : ''), b = y.frame.slice().sort().join(' ') + '|' + (y.interval ? y.interval.join() : ''); return a < b ? -1 : a > b ? 1 : 0; }); };
    canon(dated).forEach(function (c) { var ev = eventOf(c.frame, 0.6); events[ev].claims.push(c.id); c.event = ev; ordCons.push({ from: 'O', to: 'E' + ev, c: c.interval[1], strict: false, claim: c.id }, { from: 'E' + ev, to: 'O', c: -c.interval[0], strict: false, claim: c.id }); });
    orders.slice().sort(function (x, y) { var a = x.a.concat(['|'], x.b).join(' '), b = y.a.concat(['|'], y.b).join(' '); return a < b ? -1 : a > b ? 1 : 0; }).forEach(function (c) {
      var ea = eventOf(c.a, 0.5), eb = eventOf(c.b, 0.5); if (ea === eb) return;
      var first = c.relation === 'before' ? ea : eb, second = c.relation === 'before' ? eb : ea;
      c.events = [first, second];
      if (c.offsetDays != null) { var tol = Math.max(1, c.offsetDays * 0.1); ordCons.push({ from: 'E' + first, to: 'E' + second, c: c.offsetDays + tol, strict: false, claim: c.id }, { from: 'E' + second, to: 'E' + first, c: -(c.offsetDays - tol), strict: false, claim: c.id }); }
      else ordCons.push({ from: 'E' + second, to: 'E' + first, c: 0, strict: true, claim: c.id });   // t_first < t_second
    });
    var ordReport = { events: events.map(function (e, i) { return { id: 'E' + i, label: e.label, claims: e.claims }; }), constraints: ordCons.length, cycles: [] };
    var ordNodes = ['O'].concat(events.map(function (_, i) { return 'E' + i; }));
    function ordInfeasible(claimIds, onlyAsserted) {
      var set = new Set(claimIds); return !S.order.stn(ordNodes, ordCons.filter(function (k) { return set.has(k.claim); })).feasible;
    }
    function ordinalPass(filterFn, label) {
      var active = new Set(claims.filter(function (c) { return (c.type === 'date' || c.type === 'order') && filterFn(c); }).map(function (c) { return c.id; }));
      var found = 0, guard = 0;
      while (guard++ < 12) {
        var cons = ordCons.filter(function (k) { return active.has(k.claim); });
        var r = S.order.stn(ordNodes, cons); if (r.feasible) { if (label === 'asserted') ordReport.schedule = r; break; }
        var cyc = Array.from(new Set(r.cycle.map(function (i) { return cons[i].claim; })));
        var mus = S.order.deletionMUS(cyc, function (ids) { return ordInfeasible(ids); });
        var musCons = ordCons.filter(function (k) { return mus.indexOf(k.claim) >= 0; });
        var mu = S.order.karp(ordNodes, musCons), eps = mu != null ? Math.max(0, -mu) : null;
        var strictOnly = r.weight === 0;
        var cl = mus.map(function (id) { return claims[+id.slice(1)]; });
        var klass = cl.every(isAsserted) ? 'contradiction' : (cl.some(function (c) { return c.modality.kind === 'hypothesized'; }) ? 'tension-with-hypothesis' : 'conflicting-accounts');
        obstructions.push({ layer: 'ordinal', kind: strictOnly ? 'strict-order-cycle' : 'negative-cycle', class: klass, claims: mus,
          magnitude: strictOnly ? { kind: 'strict-order-violation', value: 0, unit: 'order' } : { kind: 'epsilon-star', value: +eps.toFixed(2), unit: 'day', cycleDeficit: -r.weight },
          witness: (strictOnly ? 'order relations form a strict cycle' : 'negative cycle of weight ' + r.weight + ' days; minimal uniform widening ε* = ' + eps.toFixed(1) + ' days') });
        ordReport.cycles.push(mus); found++;
        active.delete(mus[mus.length - 1]); // remove one claim and look for further independent conflicts
      }
      return found;
    }
    ordinalPass(isAsserted, 'asserted');
    ordinalPass(function (c) { return !isAsserted(c); }, 'non-asserted');
    // dated events on the same frame with disjoint intervals across modalities are caught by the pass below
    var mixed = ordinalPass(function (c) { return c.modality.kind !== 'question'; }, 'all');
    // Collapse pairwise linear/propositional conflicts into one finding per connected group:
    // k claims about one frame that disagree are one obstruction, not k(k-1)/2.
    (function () {
      var claimAt = function (id) { return claims[+id.slice(1)]; };
      var setClass = function (ids) {
        var cs = ids.map(claimAt);
        if (cs.every(isAsserted)) return 'contradiction';
        if (cs.some(function (c) { return c.modality.kind === 'question'; })) return 'question';
        if (cs.some(function (c) { return c.modality.kind === 'hypothesized'; })) return 'tension-with-hypothesis';
        var srcs = new Set(cs.filter(function (c) { return c.modality.kind === 'reported'; }).map(function (c) { return (c.modality.source || '?').toLowerCase(); }));
        return (srcs.size === 1 && cs.every(function (c) { return c.modality.kind === 'reported'; })) ? 'inconsistent-testimony' : 'conflicting-accounts';
      };
      ['linear', 'propositional'].forEach(function (L) {
        var kind = L === 'linear' ? 'gluing-residual' : 'polarity';
        var group = obstructions.filter(function (o) { return o.layer === L && o.kind === kind; });
        if (group.length < 2) return;
        var ids = []; group.forEach(function (o) { o.claims.forEach(function (c) { if (ids.indexOf(c) < 0) ids.push(c); }); });
        var comps = S.graph.components(ids, group.map(function (o) { return o.claims; }));
        var merged = comps.map(function (comp) {
          var cset = new Set(comp), os = group.filter(function (o) { return cset.has(o.claims[0]); });
          if (os.length === 1) return os[0];
          var sorted = comp.slice().sort(function (a, b) { return +a.slice(1) - +b.slice(1); });
          if (L === 'linear') {
            var vals = Array.from(new Set(sorted.map(function (id) { return claimAt(id).values.map(function (v) { return v.text; }).join(', '); })));
            var mx = Math.max.apply(null, os.map(function (o) { return o.magnitude.value; }));
            return { layer: L, kind: kind, class: setClass(sorted), claims: sorted, pairs: os.length, magnitude: { kind: 'relative-difference', value: mx, unit: os[0].magnitude.unit }, witness: sorted.length + ' claims on one frame take ' + vals.length + ' different values: ' + vals.slice(0, 8).join(' · ') + (vals.length > 8 ? ' …' : '') };
          }
          return { layer: L, kind: kind, class: setClass(sorted), claims: sorted, pairs: os.length, magnitude: { kind: 'logical', value: 'unsatisfiable' }, witness: sorted.length + ' near-identical statements with opposite polarity' };
        });
        obstructions = obstructions.filter(function (o) { return group.indexOf(o) < 0; }).concat(merged);
      });
    })();
    // de-duplicate obstructions with identical claim sets
    var seenKeys = {}; obstructions = obstructions.filter(function (o) { var k = o.layer + ':' + o.claims.slice().sort().join(','); if (seenKeys[k]) return false; seenKeys[k] = 1; return true; });

    // ── Ψ: epistemic closure over the support graph ──
    var supEdges = [], uids = units.map(function (u) { return u.id; });
    units.forEach(function (u, i) {
      var s = support[u.id];
      if (s.fwd && i > 0 && units[i - 1].para === u.para) supEdges.push([units[i - 1].id, u.id, 'fwd']);
      if (s.evidenceVerb && s.absence) supEdges.push([u.id, u.id, 'self-sealing']);
    });
    var anchored = uids.filter(function (id) { return support[id].anchored; });
    var targets = Array.from(new Set(supEdges.filter(function (e) { return e[0] !== e[1]; }).map(function (e) { return e[1]; })));
    var reach = S.graph.reachable(anchored, uids, supEdges);
    var ungrounded = targets.filter(function (t) { return !reach[t]; });
    var sccs = S.graph.scc(uids, supEdges.filter(function (e) { return e[0] !== e[1]; })).filter(function (c) { return c.length > 1 && !c.some(function (x) { return support[x].anchored; }); });
    var sealing = supEdges.filter(function (e) { return e[2] === 'self-sealing' || (support[e[0]].absence && e[0] !== e[1]); });
    var assertedContra = obstructions.filter(function (o) { return o.class === 'contradiction'; });
    var unitById = {}; units.forEach(function (u) { unitById[u.id] = u; });
    var psi = {
      ground: { value: targets.length ? +(ungrounded.length / targets.length).toFixed(3) : null, supported: targets.length, ungrounded: ungrounded.length, witnesses: ungrounded.slice(0, 12) },
      circ: { value: sccs.length, witnesses: sccs.slice(0, 6) },
      seal: { value: sealing.length, witnesses: sealing.slice(0, 12).map(function (e) { return e[0]; }) },
      imp: { value: assertedContra.length, witnesses: assertedContra.slice(0, 6).map(function (o) { return o.claims; }) },
      anchoredShare: units.length ? +(anchored.length / units.length).toFixed(3) : 0,
      supportEdges: supEdges.length
    };

    // ── Γ per layer: binary feasibility of ASSERTED claims (min over components); N/A without comparisons ──
    var layerHas = { linear: linEdges.length > 0 || !!hodgeReport, ordinal: ordCons.length > 0, propositional: propEdges.length > 0 };
    var gamma = {};
    ['linear', 'ordinal', 'propositional'].forEach(function (L) {
      if (!layerHas[L]) { gamma[L] = null; return; }
      gamma[L] = obstructions.some(function (o) { return o.layer === L && o.class === 'contradiction'; }) ? 0 : 1;
    });
    // supplementary agreement rates (not Γ): share of comparable pairs that glue
    var agree = function (es) { return es.length ? +(es.filter(function (e) { return !e.conflict; }).length / es.length).toFixed(3) : null; };

    // modality profile
    var prof = { asserted: 0, reported: 0, hypothesized: 0, question: 0 };
    props.forEach(function (c) { prof[c.modality.kind]++; });
    // accounts map: who says what, and which reported sources conflict
    var accounts = {};
    claims.forEach(function (c) { if (c.modality.kind === 'reported' && c.modality.source) { var k = c.modality.source.slice(0, 40); (accounts[k] = accounts[k] || { claims: 0, conflicts: 0 }).claims++; } });
    obstructions.forEach(function (o) { o.claims.forEach(function (id) { var c = claims[+id.slice(1)]; if (c && c.modality.kind === 'reported' && c.modality.source) { var k = c.modality.source.slice(0, 40); if (accounts[k]) accounts[k].conflicts++; } }); });
    // per-source summary for corpus mode
    var perSource = {};
    if (sources.length > 1) {
      sources.forEach(function (s) { perSource[s.tag] = { units: 0, claims: 0, conflicts: 0, crossConflicts: 0 }; });
      units.forEach(function (u) { if (perSource[u.source]) perSource[u.source].units++; });
      claims.forEach(function (c) { if (perSource[c.source]) perSource[c.source].claims++; });
      obstructions.forEach(function (o) { var srcs = new Set(o.claims.map(function (id) { return claims[+id.slice(1)].source; })); srcs.forEach(function (s) { if (perSource[s]) { perSource[s].conflicts++; if (srcs.size > 1) perSource[s].crossConflicts++; } }); o.crossSource = srcs.size > 1; o.sources = Array.from(srcs); });
    }
    // topic layers (descriptive only, v1 lexicon if present)
    var topic = null;
    if (S.topicLayers) topic = S.topicLayers(units);

    var timeline = null;
    if (ordReport.schedule && events.length) {
      var pot = ordReport.schedule.potential;   // feasible schedule (days relative to origin)
      timeline = events.map(function (e, i) { var cs = e.claims.map(function (id) { return claims[+id.slice(1)]; }).filter(function (c) { return c.type === 'date'; }); return { event: 'E' + i, label: e.label, interval: cs.length ? [dayStr(Math.max.apply(null, cs.map(function (c) { return c.interval[0]; }))), dayStr(Math.min.apply(null, cs.map(function (c) { return c.interval[1]; })))] : null, claims: e.claims }; })
        .map(function (t) { if (t.interval && t.interval[0] > t.interval[1]) { t.conflict = true; } return t; }).filter(function (t) { return t.interval; }).sort(function (a, b) { return a.interval[0] < b.interval[0] ? -1 : 1; });
    }

    return {
      version: S.VERSION, generated: new Date().toISOString(),
      units: units, claims: claims, edges: edges, obstructions: obstructions,
      gamma: gamma,
      agreement: { linear: agree(linEdges), propositional: agree(propEdges) },
      kappa: obstructions.map(function (o, i) { return Object.assign({ id: 'k' + i }, o); }),
      psi: psi, ordinal: ordReport, hodge: hodgeReport, timeline: timeline,
      profile: prof, accounts: accounts, perSource: perSource, topic: topic,
      counts: { units: units.length, claims: claims.length, proposition: props.length, numeric: numerics.length, date: dated.length, order: orders.length, relation: relations.length, comparisons: edges.length, obstructions: obstructions.length, contradictions: obstructions.filter(function (o) { return o.class === 'contradiction'; }).length },
      supportEdges: supEdges, sources: sources.map(function (s) { return s.tag; })
    };
  };

  // ── K(t): compare two versions; classify obstructions as persistent / new / resolved ──
  S.compare = function (textA, textB) {
    var A = S.analyze(textA), B = S.analyze(textB), AB = S.analyze([{ text: textA, tag: 'A' }, { text: textB, tag: 'B' }]);
    var sig = function (R, o) { return o.layer + '|' + o.claims.map(function (id) { var c = R.claims[+id.slice(1)]; return c.frame.slice().sort().join(' '); }).sort().join('||'); };
    var sa = new Set(A.obstructions.map(function (o) { return sig(A, o); })), sb = new Set(B.obstructions.map(function (o) { return sig(B, o); }));
    var persistent = [], fresh = [], resolved = [];
    B.obstructions.forEach(function (o) { (sa.has(sig(B, o)) ? persistent : fresh).push(o); });
    A.obstructions.forEach(function (o) { if (!sb.has(sig(A, o))) resolved.push(o); });
    var cross = AB.obstructions.filter(function (o) { return o.crossSource; });
    var K = {}; ['linear', 'ordinal', 'propositional'].forEach(function (L) { K[L] = { A: A.obstructions.filter(function (o) { return o.layer === L; }).length, B: B.obstructions.filter(function (o) { return o.layer === L; }).length }; });
    return { a: A, b: B, joint: AB, persistent: persistent, fresh: fresh, resolved: resolved, cross: cross, K: K };
  };
})(SA2);
if (typeof module !== 'undefined') module.exports = SA2;
