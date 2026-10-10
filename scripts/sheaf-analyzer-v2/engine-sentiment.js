// ═══ SA2 SENTIMENT ═══ Faithful JavaScript port of VADER (vaderSentiment 3.3.2, C.J. Hutto, MIT License).
// Hutto, C.J. & Gilbert, E.E. (2014). VADER: A Parsimonious Rule-based Model for Sentiment Analysis of
// Social Media Text. ICWSM-14. The lexicon is loaded from /data/vader-lexicon.json (7,506 entries).
// Port notes: rules, constants and the quirks of the reference implementation are kept as-is
// (including _but_check's index-of-first-equal-value behaviour) so scores match the Python package;
// the emoji-to-text step is omitted (emoji are rare in analysed prose). Parity: test-sentiment.js.
var SA2 = (typeof SA2 !== 'undefined') ? SA2 : (typeof require !== 'undefined' ? require('./engine-math.js') : {});
(function (S) {
  var B_INCR = 0.293, B_DECR = -0.293, C_INCR = 0.733, N_SCALAR = -0.74;
  var NEGATE = new Set(["aint", "arent", "cannot", "cant", "couldnt", "darent", "didnt", "doesnt", "ain't", "aren't", "can't", "couldn't", "daren't", "didn't", "doesn't", "dont", "hadnt", "hasnt", "havent", "isnt", "mightnt", "mustnt", "neither", "don't", "hadn't", "hasn't", "haven't", "isn't", "mightn't", "mustn't", "neednt", "needn't", "never", "none", "nope", "nor", "not", "nothing", "nowhere", "oughtnt", "shant", "shouldnt", "uhuh", "wasnt", "werent", "oughtn't", "shan't", "shouldn't", "uh-uh", "wasn't", "weren't", "without", "wont", "wouldnt", "won't", "wouldn't", "rarely", "seldom", "despite"]);
  var BOOSTER = {};
  "absolutely amazingly awfully completely considerable considerably decidedly deeply effing enormous enormously entirely especially exceptional exceptionally extreme extremely fabulously flipping flippin frackin fracking fricking frickin frigging friggin fully fuckin fucking fuggin fugging greatly hella highly hugely incredible incredibly intensely major majorly more most particularly purely quite really remarkably so substantially thoroughly total totally tremendous tremendously uber unbelievably unusually utter utterly very".split(' ').forEach(function (w) { BOOSTER[w] = B_INCR; });
  ["almost", "barely", "hardly", "just enough", "kind of", "kinda", "kindof", "kind-of", "less", "little", "marginal", "marginally", "occasional", "occasionally", "partly", "scarce", "scarcely", "slight", "slightly", "somewhat", "sort of", "sorta", "sortof", "sort-of"].forEach(function (w) { BOOSTER[w] = B_DECR; });
  var SPECIAL = { "the shit": 3, "the bomb": 3, "bad ass": 1.5, "badass": 1.5, "bus stop": 0.0, "yeah right": -2, "kiss of death": -1.5, "to die for": 3, "beating heart": 3.5 };
  var PUNCT = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
  var has = function (o, k) { return Object.prototype.hasOwnProperty.call(o, k); };

  var LEX = null;
  S.vader = {
    ready: function () { return !!LEX; },
    setLexicon: function (obj) { LEX = obj && obj.lexicon ? obj.lexicon : obj; },
    load: function (url) {
      if (LEX) return Promise.resolve(true);
      return fetch(url || '/data/vader-lexicon.json').then(function (r) { return r.json(); }).then(function (j) { S.vader.setLexicon(j); return true; }).catch(function () { return false; });
    },
    lexValue: function (w) { return LEX && has(LEX, w) ? LEX[w] : null; }
  };

  function isUpper(s) { return s !== s.toLowerCase() && s === s.toUpperCase(); }   // Python str.isupper()
  function strip(tok) { var a = 0, b = tok.length; while (a < b && PUNCT.indexOf(tok[a]) >= 0) a++; while (b > a && PUNCT.indexOf(tok[b - 1]) >= 0) b--; var s = tok.slice(a, b); return s.length <= 2 ? tok : s; }
  function negated(w) { w = w.toLowerCase(); return NEGATE.has(w) || w.indexOf("n't") >= 0; }
  function inLex(w) { return has(LEX, w.toLowerCase()); }
  function scalarIncDec(word, valence, capDiff) {
    var wl = word.toLowerCase(), s = 0;
    if (has(BOOSTER, wl)) { s = BOOSTER[wl]; if (valence < 0) s *= -1; if (isUpper(word) && capDiff) s += valence > 0 ? C_INCR : -C_INCR; }
    return s;
  }
  function negationCheck(v, wl, startI, i) {
    if (startI === 0) { if (negated(wl[i - 1])) v *= N_SCALAR; }
    if (startI === 1) {
      if (wl[i - 2] === 'never' && (wl[i - 1] === 'so' || wl[i - 1] === 'this')) v *= 1.25;
      else if (wl[i - 2] === 'without' && wl[i - 1] === 'doubt') { /* unchanged */ }
      else if (negated(wl[i - 2])) v *= N_SCALAR;
    }
    if (startI === 2) {
      if ((wl[i - 3] === 'never' && (wl[i - 2] === 'so' || wl[i - 2] === 'this')) || (wl[i - 1] === 'so' || wl[i - 1] === 'this')) v *= 1.25;
      else if (wl[i - 3] === 'without' && (wl[i - 2] === 'doubt' || wl[i - 1] === 'doubt')) { /* unchanged */ }
      else if (negated(wl[i - 3])) v *= N_SCALAR;
    }
    return v;
  }
  function at(a, k) { return k < 0 ? a[a.length + k] : a[k]; }    // Python negative indexing
  function idiomsCheck(v, wl, i) {
    var onezero = at(wl, i - 1) + ' ' + wl[i], twoonezero = at(wl, i - 2) + ' ' + at(wl, i - 1) + ' ' + wl[i], twoone = at(wl, i - 2) + ' ' + at(wl, i - 1),
      threetwoone = at(wl, i - 3) + ' ' + at(wl, i - 2) + ' ' + at(wl, i - 1), threetwo = at(wl, i - 3) + ' ' + at(wl, i - 2);
    var seqs = [onezero, twoonezero, twoone, threetwoone, threetwo];
    for (var k = 0; k < seqs.length; k++) if (has(SPECIAL, seqs[k])) { v = SPECIAL[seqs[k]]; break; }
    if (wl.length - 1 > i) { var zo = wl[i] + ' ' + wl[i + 1]; if (has(SPECIAL, zo)) v = SPECIAL[zo]; }
    if (wl.length - 1 > i + 1) { var zot = wl[i] + ' ' + wl[i + 1] + ' ' + wl[i + 2]; if (has(SPECIAL, zot)) v = SPECIAL[zot]; }
    [threetwoone, threetwo, twoone].forEach(function (g) { if (has(BOOSTER, g)) v = v + BOOSTER[g]; });
    return v;
  }
  function leastCheck(v, wl, i) {
    if (i > 1 && !has(LEX, wl[i - 1]) && wl[i - 1] === 'least') { if (wl[i - 2] !== 'at' && wl[i - 2] !== 'very') v *= N_SCALAR; }
    else if (i > 0 && !has(LEX, wl[i - 1]) && wl[i - 1] === 'least') v *= N_SCALAR;
    return v;
  }
  function butCheck(wl, sent) {
    var bi = wl.indexOf('but'); if (bi < 0) return sent;
    sent.slice().forEach(function (s) {           // iterate original values, locate with index-of-first-equal (reference behaviour)
      var si = sent.indexOf(s);
      if (si < bi) sent.splice(si, 1, s * 0.5); else if (si > bi) sent.splice(si, 1, s * 1.5);
    });
    return sent;
  }
  // Python round(): correctly rounded from the exact binary value, ties to even.
  function round(x, d) {
    var e = Math.abs(x).toFixed(25), dot = e.indexOf('.'), tail = e.slice(dot + 1 + d);
    var r = +Math.abs(x).toFixed(d);
    if (/^50*$/.test(tail)) { var last = +e[dot + d] , down = +(e.slice(0, dot + 1 + d)); r = last % 2 === 0 ? down : r; }
    return x < 0 ? -r : r;
  }

  // Returns {neg, neu, pos, compound, words:[{w, v}]} — words lists lexicon hits with their final valence.
  S.vader.score = function (text) {
    if (!LEX) return null;
    text = String(text).trim();
    var we = text.split(/\s+/).filter(Boolean).map(strip);
    var nCaps = we.filter(isUpper).length, capDiff = we.length - nCaps > 0 && we.length - nCaps < we.length;
    var wl = we.map(function (w) { return w.toLowerCase(); }), sent = [], hits = [];
    for (var i = 0; i < we.length; i++) {
      var item = we[i], il = wl[i], v = 0;
      if (has(BOOSTER, il)) { sent.push(0); continue; }
      if (i < we.length - 1 && il === 'kind' && wl[i + 1] === 'of') { sent.push(0); continue; }
      if (has(LEX, il)) {
        v = LEX[il];
        if (il === 'no' && i !== we.length - 1 && has(LEX, wl[i + 1])) v = 0.0;
        if ((i > 0 && wl[i - 1] === 'no') || (i > 1 && wl[i - 2] === 'no') || (i > 2 && wl[i - 3] === 'no' && (wl[i - 1] === 'or' || wl[i - 1] === 'nor'))) v = LEX[il] * N_SCALAR;
        if (isUpper(item) && capDiff) v += v > 0 ? C_INCR : -C_INCR;
        for (var st = 0; st < 3; st++) {
          if (i > st && !has(LEX, wl[i - (st + 1)])) {
            var s = scalarIncDec(we[i - (st + 1)], v, capDiff);
            if (st === 1 && s !== 0) s *= 0.95; if (st === 2 && s !== 0) s *= 0.9;
            v = v + s; v = negationCheck(v, wl, st, i);
            if (st === 2) v = idiomsCheck(v, wl, i);
          }
        }
        v = leastCheck(v, wl, i);
        if (v !== 0) hits.push({ w: item, i: i, v: v });
      }
      sent.push(v);
    }
    sent = butCheck(wl, sent);
    if (!sent.length) return { neg: 0, neu: 0, pos: 0, compound: 0, words: hits };
    var sum = sent.reduce(function (a, b) { return a + b; }, 0);
    var ep = Math.min(4, (text.match(/!/g) || []).length) * 0.292, qc = (text.match(/\?/g) || []).length, qm = qc > 1 ? (qc <= 3 ? qc * 0.18 : 0.96) : 0, amp = ep + qm;
    if (sum > 0) sum += amp; else if (sum < 0) sum -= amp;
    var compound = sum / Math.sqrt(sum * sum + 15); compound = Math.max(-1, Math.min(1, compound));
    var ps = 0, ns = 0, nc = 0; sent.forEach(function (x) { if (x > 0) ps += x + 1; if (x < 0) ns += x - 1; if (x === 0) nc++; });
    if (ps > Math.abs(ns)) ps += amp; else if (ps < Math.abs(ns)) ns -= amp;
    var tot = ps + Math.abs(ns) + nc;
    return { neg: round(Math.abs(ns / tot), 3), neu: round(Math.abs(nc / tot), 3), pos: round(Math.abs(ps / tot), 3), compound: round(compound, 4), words: hits };
  };
})(SA2);
if (typeof module !== 'undefined') module.exports = SA2;
