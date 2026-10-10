// ═══ SA2 STATS ═══ numerical checks on what a text reports.
// 1. Reported test statistics → recomputed p (after statcheck: Nuijten et al. 2016, Behavior Research
//    Methods 48, 1205–1226; Epskamp & Nuijten, R package statcheck). APA-style t, F, χ², r, z.
// 2. GRIM test for means of integer data (Brown & Heathers 2017, Social Psychological and Personality Science 8(4)).
// 3. p-value profile: exact vs threshold reporting, values just under .05, multiplicity without correction.
// 4. Prose arithmetic: stated percentage changes, shares and multiples checked against the stated figures.
// Distribution functions: regularized incomplete beta (continued fraction) and gamma (series / continued
// fraction), Lanczos log-gamma. Checked against SciPy in test-stats.js.
var SA2 = (typeof SA2 !== 'undefined') ? SA2 : (typeof require !== 'undefined' ? require('./engine-math.js') : {});
(function (S) {
  // ── special functions ──
  function lgamma(x) {
    var g = 7, c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
    if (x < 0.5) return Math.log(Math.PI / Math.abs(Math.sin(Math.PI * x))) - lgamma(1 - x);
    x -= 1; var a = c[0], t = x + g + 0.5; for (var i = 1; i < 9; i++) a += c[i] / (x + i);
    return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
  }
  function betacf(a, b, x) {
    var MAXIT = 300, EPS = 3e-16, FPMIN = 1e-300, qab = a + b, qap = a + 1, qam = a - 1, c = 1, d = 1 - qab * x / qap;
    if (Math.abs(d) < FPMIN) d = FPMIN; d = 1 / d; var h = d;
    for (var m = 1; m <= MAXIT; m++) { var m2 = 2 * m, aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN; c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN; d = 1 / d; h *= d * c;
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN; c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN; d = 1 / d; var del = d * c; h *= del;
      if (Math.abs(del - 1) < EPS) break; }
    return h;
  }
  function ibeta(x, a, b) {          // regularized I_x(a, b)
    if (x <= 0) return 0; if (x >= 1) return 1;
    var bt = Math.exp(lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log(1 - x));
    return x < (a + 1) / (a + b + 2) ? bt * betacf(a, b, x) / a : 1 - bt * betacf(b, a, 1 - x) / b;
  }
  function gammaQ(a, x) {            // regularized upper incomplete gamma Q(a, x)
    if (x <= 0) return 1;
    if (x < a + 1) { var sum = 1 / a, del = sum, ap = a; for (var n = 0; n < 1000; n++) { ap++; del *= x / ap; sum += del; if (Math.abs(del) < Math.abs(sum) * 1e-16) break; }
      return 1 - sum * Math.exp(-x + a * Math.log(x) - lgamma(a)); }
    var b = x + 1 - a, c = 1 / 1e-300, d = 1 / b, h = d;
    for (var i = 1; i < 1000; i++) { var an = -i * (i - a); b += 2; d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300; c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300; d = 1 / d; var dl = d * c; h *= dl; if (Math.abs(dl - 1) < 1e-16) break; }
    return Math.exp(-x + a * Math.log(x) - lgamma(a)) * h;
  }
  function normSf(z) {               // upper tail of N(0,1), erfc via continued fraction / series
    var x = Math.abs(z) / Math.SQRT2, r;
    if (x < 3) { // erf series
      var s = x, term = x, n = 0; do { n++; term *= -x * x / n; s += term / (2 * n + 1); } while (Math.abs(term / (2 * n + 1)) > 1e-17 && n < 200);
      r = 1 - 2 / Math.sqrt(Math.PI) * s;
    } else { // erfc continued fraction
      var f = 0; for (var k = 60; k >= 1; k--) f = k / 2 / (x + f); r = Math.exp(-x * x) / Math.sqrt(Math.PI) / (x + f);
    }
    var up = r / 2; return z >= 0 ? up : 1 - up;
  }
  var dist = {
    lgamma: lgamma, ibeta: ibeta, gammaQ: gammaQ, normSf: normSf,
    tTwo: function (t, df) { return ibeta(df / (df + t * t), df / 2, 0.5); },
    fUpper: function (F, d1, d2) { return F <= 0 ? 1 : ibeta(d2 / (d2 + d1 * F), d2 / 2, d1 / 2); },
    chi2Upper: function (x, df) { return gammaQ(df / 2, x / 2); },
    rTwo: function (r, df) { if (Math.abs(r) >= 1) return 0; var t = r * Math.sqrt(df / (1 - r * r)); return dist.tTwo(t, df); },
    zTwo: function (z) { return 2 * normSf(Math.abs(z)); }
  };
  S.dist = dist;

  // ── number parsing ──
  var decimals = function (s) { var m = String(s).match(/\.(\d+)/); return m ? m[1].length : 0; };
  var num = function (s) { return parseFloat(String(s).replace(/\s/g, '').replace(/^\./, '0.').replace(/^-\./, '-0.')); };
  function norm(t) { return t.replace(/[−–](?=\s?\.?\d)/g, '-').replace(/≤/g, '<').replace(/≥/g, '>').replace(/ | | /g, ' ').replace(/χ\s?2|χ²|chi-?squared?|Χ2|X²/gi, 'CHI2'); }

  // ── statcheck-style recomputation ──
  var P = '\\s*,?\\s*(?:p|P)\\s*([<>=])\\s*(0?\\.\\d+|1(?:\\.0+)?|\\d\\.\\d+\\s*[x×]\\s*10\\s*\\^?\\s*-\\d+|\\d(?:\\.\\d+)?e-\\d+)';
  var TESTS = [
    { kind: 't', re: new RegExp('\\bt\\s*\\(\\s*(\\d+(?:\\.\\d+)?)\\s*\\)\\s*=\\s*(-?\\s?\\d*\\.?\\d+)' + P, 'g'), p: function (m) { return { df: [num(m[1])], stat: num(m[2]), cmp: m[3], rep: m[4] }; }, f: function (x, df) { return dist.tTwo(x, df[0]); }, tail2: true },
    { kind: 'F', re: new RegExp('\\bF\\s*\\(\\s*(\\d+(?:\\.\\d+)?)\\s*,\\s*(\\d+(?:\\.\\d+)?)\\s*\\)\\s*=\\s*(\\d*\\.?\\d+)' + P, 'g'), p: function (m) { return { df: [num(m[1]), num(m[2])], stat: num(m[3]), cmp: m[4], rep: m[5] }; }, f: function (x, df) { return dist.fUpper(x, df[0], df[1]); } },
    { kind: 'χ²', re: new RegExp('CHI2\\s*\\(\\s*(\\d+(?:\\.\\d+)?)(?:\\s*,\\s*[Nn]\\s*=\\s*[\\d,]+)?\\s*\\)\\s*=\\s*(\\d*\\.?\\d+)' + P, 'g'), p: function (m) { return { df: [num(m[1])], stat: num(m[2]), cmp: m[3], rep: m[4] }; }, f: function (x, df) { return dist.chi2Upper(x, df[0]); } },
    { kind: 'r', re: new RegExp('\\br\\s*\\(\\s*(\\d+(?:\\.\\d+)?)\\s*\\)\\s*=\\s*(-?\\s?\\d*\\.?\\d+)' + P, 'g'), p: function (m) { return { df: [num(m[1])], stat: num(m[2]), cmp: m[3], rep: m[4] }; }, f: function (x, df) { return dist.rTwo(x, df[0]); }, tail2: true },
    { kind: 'z', re: new RegExp('\\b[zZ]\\s*=\\s*(-?\\s?\\d*\\.?\\d+)' + P, 'g'), p: function (m) { return { df: [], stat: num(m[1]), cmp: m[2], rep: m[3] }; }, f: function (x) { return dist.zTwo(x); }, tail2: true }
  ];
  function pRange(T, stat, df) {   // recomputed p over the rounding interval of the reported statistic
    var d = decimals(stat.s), h = 0.5 * Math.pow(10, -d), a = Math.abs(stat.v) - h, b = Math.abs(stat.v) + h;
    if (T.kind === 'r') { a = Math.max(0, a); b = Math.min(0.999999, b); } else a = Math.max(0, a);
    var p1 = T.f(a, df), p2 = T.f(b, df); return [Math.min(p1, p2), Math.max(p1, p2)];
  }
  function parseP(s) { s = s.replace(/\s/g, ''); var m = s.match(/^(\d(?:\.\d+)?)[x×]10\^?(-\d+)$/); if (m) return +m[1] * Math.pow(10, +m[2]); return num(s); }
  S.statcheck = function (text) {
    var t = norm(text), out = [];
    TESTS.forEach(function (T) {
      T.re.lastIndex = 0; var m;
      while ((m = T.re.exec(t))) {
        var g = T.p(m), statS = String(m[T.kind === 'F' ? 3 : T.kind === 'z' ? 1 : 2]).replace(/\s/g, '');
        if (T.kind === 'r' && Math.abs(g.stat) > 1) continue;
        var pc = T.f(Math.abs(g.stat), g.df), range = pRange(T, { v: g.stat, s: statS }, g.df), rp = parseP(g.rep), rd = decimals(g.rep) || 3;
        var ok, gross;
        var lo = range[0], hi = range[1];
        if (g.cmp === '=') { var ph = 0.5 * Math.pow(10, -rd); ok = !(hi < rp - ph - 1e-12 || lo > rp + ph + 1e-12); gross = !ok && ((rp < 0.05) !== (pc < 0.05)); }
        else if (g.cmp === '<') { ok = lo < rp; gross = !ok && rp <= 0.05 && pc >= 0.05; }
        else { ok = hi > rp; gross = !ok && rp >= 0.05 && pc < 0.05; }
        var ctx = t.slice(Math.max(0, m.index - 160), m.index + m[0].length + 60), oneTail = /one[- ](?:tailed|sided)|directional/i.test(ctx);
        var oneOk = false; if (!ok && T.tail2) { var l1 = lo / 2, h1 = hi / 2; if (g.cmp === '=') { var ph1 = 0.5 * Math.pow(10, -rd); oneOk = !(h1 < rp - ph1 || l1 > rp + ph1); } else if (g.cmp === '<') oneOk = l1 < rp; }
        out.push({ kind: T.kind, text: m[0].trim(), at: m.index, df: g.df, stat: g.stat, reported: g.cmp + ' ' + g.rep, recomputed: pc, range: range,
          status: ok ? 'consistent' : (oneOk && oneTail ? 'consistent (one-tailed)' : gross ? 'decision error' : 'inconsistent'), note: !ok && oneOk && !oneTail ? 'consistent if one-tailed, but no one-tailed test is stated nearby' : '' });
      }
    });
    return out.sort(function (a, b) { return a.at - b.at; });
  };

  // ── GRIM ──
  S.grim = function (text) {
    var t = norm(text), out = [], sents = t.split(/(?<=[.;])\s+(?=[A-Z(])/);
    var off = 0;
    sents.forEach(function (s) {
      var means = [], ns = [], m, reM = /\b(?:M|mean|Mean|average)\s*(?:=|of|was|is)\s*(\d+\.\d+)/g, reN = /\b[nN]\s*=\s*(\d{1,3}(?:,\d{3})*|\d+)\b/g;
      while ((m = reM.exec(s))) means.push({ s: m[1], at: off + m.index });
      while ((m = reN.exec(s))) ns.push(+m[1].replace(/,/g, ''));
      if (means.length && ns.length === 1) means.forEach(function (mn) {
        var n = ns[0], d = decimals(mn.s), v = num(mn.s);
        if (n >= Math.pow(10, d)) { out.push({ mean: mn.s, n: n, status: 'not testable', why: 'n ≥ 10^' + d + ': every mean is attainable at this precision', at: mn.at }); return; }
        var k = Math.round(v * n), ok = [k - 1, k, k + 1].some(function (s2) { var r = s2 / n; return Math.abs(Math.round(r * Math.pow(10, d)) / Math.pow(10, d) - v) < 1e-9 || Math.abs(r - v) <= 0.5 * Math.pow(10, -d) + 1e-12; });
        out.push({ mean: mn.s, n: n, status: ok ? 'consistent' : 'inconsistent', why: ok ? 'some integer total gives this mean' : 'no integer total divided by ' + n + ' rounds to ' + mn.s + ' (valid only for single-item integer data)', at: mn.at });
      });
      off += s.length + 1;
    });
    return out;
  };

  // ── p-value profile ──
  S.pProfile = function (text) {
    var t = norm(text), ps = [], m, re = /\b[pP]\s*([<>=])\s*(0?\.\d+|1(?:\.0+)?)\b/g;
    while ((m = re.exec(t))) ps.push({ cmp: m[1], v: num(m[2]), s: m[0], at: m.index });
    var exact = ps.filter(function (p) { return p.cmp === '='; }), thr = ps.filter(function (p) { return p.cmp === '<'; });
    var justUnder = exact.filter(function (p) { return p.v > 0.04 && p.v <= 0.05; });
    var sig = exact.filter(function (p) { return p.v <= 0.05; }).length + thr.filter(function (p) { return p.v <= 0.05; }).length;
    var correction = /\b(bonferroni|holm|benjamini|hochberg|false discovery rate|FDR|šidák|sidak|tukey|multiple comparisons? (?:correction|adjust)|adjusted p|family-?wise)\b/i.test(t);
    return { n: ps.length, exact: exact.length, threshold: thr.length, significant: sig, justUnder: justUnder, correction: correction, values: ps,
      flags: [
        ps.length >= 10 && !correction ? ps.length + ' p-values reported and no multiple-comparison correction is mentioned.' : null,
        exact.length >= 4 && justUnder.length / Math.max(1, exact.filter(function (p) { return p.v <= 0.05; }).length) >= 0.5 && justUnder.length >= 2 ? justUnder.length + ' of the significant exact p-values lie in (.04, .05]: a pattern worth checking (cf. Head et al. 2015, PLoS Biology).' : null,
        thr.length > exact.length && thr.length >= 3 ? 'Most p-values are reported only against thresholds (p < .05) rather than exactly.' : null
      ].filter(Boolean) };
  };

  // ── prose arithmetic ──
  var MULT = { thousand: 1e3, million: 1e6, billion: 1e9, trillion: 1e12, k: 1e3, m: 1e6, bn: 1e9, miljoner: 1e6, miljarder: 1e9 };
  var NUM = '(-?\\d{1,3}(?:[ ,]\\d{3})+(?:\\.\\d+)?|-?\\d+(?:\\.\\d+)?)\\s*(%|percent|per cent|thousand|million|billion|trillion|bn|k\\b|m\\b)?';
  function val(n, u) { var v = parseFloat(n.replace(/[ ,](?=\d{3}\b)/g, '')); u = (u || '').toLowerCase(); if (MULT[u]) v *= MULT[u]; return v; }
  function tol(s) { return 0.5 * Math.pow(10, -decimals(s)); }
  S.arithmetic = function (text) {
    var t = norm(text), out = [], sents = t.split(/(?<=[.!?])\s+/), off = 0;
    sents.forEach(function (s) {
      var m;
      // from A to B … (an increase / decrease / rise / fall / drop / up / down) of C% | C% increase | C percentage points
      var reFT = new RegExp('\\bfrom\\s+(?:about\\s+|around\\s+|roughly\\s+)?' + NUM + '\\s+to\\s+' + NUM, 'gi');
      while ((m = reFT.exec(s))) {
        var A = val(m[1], m[2] && m[2] !== '%' ? m[2] : m[4]), B = val(m[3], m[4]), isPct = /%|percent/.test((m[2] || '') + (m[4] || ''));
        var tail = s.slice(m.index + m[0].length, m.index + m[0].length + 90) + ' ' + s.slice(Math.max(0, m.index - 90), m.index);
        var c = tail.match(/(?:(increase|rise|growth|jump|decrease|decline|fall|drop|reduction|cut|up|down)\s+(?:of|by)\s+)?(\d+(?:\.\d+)?)\s*(percentage points?|pp\b|%|percent|per cent)\s*(increase|rise|growth|jump|decrease|decline|fall|drop|reduction|higher|lower|more|less)?/i);
        if (c && A) {
          var stated = parseFloat(c[2]), pp = /point|pp/i.test(c[3]), dir = (c[1] || c[4] || '').toLowerCase(), down = /decrease|decline|fall|drop|reduction|cut|down|lower|less/.test(dir);
          var actual = pp ? (B - A) : 100 * (B - A) / Math.abs(A), mag = Math.abs(actual);
          var tl = Math.max(tol(c[2]), 0.02 * stated, 0.5);
          var dirOk = !dir || (down ? B < A : B > A);
          var ok = Math.abs(mag - stated) <= tl && dirOk;
          var alt = !pp && isPct ? Math.abs(B - A) : null;   // a % change confused with percentage points?
          out.push({ type: pp ? 'percentage-point change' : 'percent change', text: (m[0] + ' … ' + c[0]).trim(), at: off + m.index, stated: stated + (pp ? ' pp' : '%'), computed: Math.round(actual * 100) / 100 + (pp ? ' pp' : '%'),
            status: ok ? 'consistent' : 'mismatch', note: !dirOk ? 'direction word disagrees with the figures' : (!ok && Math.abs(Math.abs(B - A) - stated) <= tl ? (isPct ? 'matches the difference in percentage points, not the relative change' : 'equals the absolute difference, not the relative change') : (!ok && !pp && Math.abs(Math.abs(100 * (B - A) / B) - stated) <= tl ? 'matches change relative to the end value (wrong base)' : '')) });
        }
        var mu = s.slice(m.index - 60 < 0 ? 0 : m.index - 60, m.index + m[0].length + 60).match(/\b(doubl|tripl|quadrupl|halv)(?:ed|ing|es|e)\b/i);
        if (mu && A > 0) { var f = { doubl: 2, tripl: 3, quadrupl: 4, halv: 0.5 }[mu[1].toLowerCase()], r = B / A, ok2 = Math.abs(r - f) / f <= 0.1;
          out.push({ type: 'multiple', text: (mu[0] + ' / ' + m[0]).trim(), at: off + m.index, stated: '×' + f, computed: '×' + Math.round(r * 100) / 100, status: ok2 ? 'consistent' : 'mismatch', note: '' }); }
      }
      // X of/out of Y (Z%)
      var reShare = new RegExp(NUM + '\\s+(?:out\\s+)?of\\s+(?:the\\s+|all\\s+)?' + NUM + '[^.()%]{0,60}?\\(?\\s*(\\d+(?:\\.\\d+)?)\\s*(%|percent)', 'gi');
      while ((m = reShare.exec(s))) {
        if (/%|percent/.test((m[2] || '') + (m[4] || ''))) continue;
        var X = val(m[1], m[2]), Y = val(m[3], m[4]), Z = parseFloat(m[5]); if (!Y || X > Y * 1.0001) continue;
        var comp = 100 * X / Y, ok3 = Math.abs(comp - Z) <= Math.max(tol(m[5]), 0.05) + 1e-9;
        out.push({ type: 'share', text: m[0].trim(), at: off + m.index, stated: Z + '%', computed: Math.round(comp * 100) / 100 + '%', status: ok3 ? 'consistent' : 'mismatch', note: '' });
      }
      // impossible shares
      var reImp = /\b(\d{3,}(?:\.\d+)?)\s*(?:%|percent)\s+of\s+(?:all\s+|the\s+)?(?:respondents|participants|people|voters|patients|students|households|cases|the population|children|adults|members)\b/gi;
      while ((m = reImp.exec(s))) if (parseFloat(m[1]) > 100) out.push({ type: 'impossible share', text: m[0], at: off + m.index, stated: m[1] + '%', computed: '≤ 100%', status: 'mismatch', note: 'a share of a population cannot exceed 100%' });
      off += s.length + 1;
    });
    return out;
  };
})(SA2);
if (typeof module !== 'undefined') module.exports = SA2;
