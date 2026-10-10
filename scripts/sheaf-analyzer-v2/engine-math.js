// ═══ SA2 MATH CORE ═══ linear algebra, cellular sheaves, Hodge decomposition,
// difference constraints with strict arcs, Karp minimum mean cycle, deletion-filter MUS.
// Pure functions, no DOM. Runs in browser and Node.
var SA2 = (typeof SA2 !== 'undefined') ? SA2 : {};
(function (S) {
  'use strict';
  var EPS = 1e-9;

  // ── dense helpers ──
  function zeros(r, c) { var M = []; for (var i = 0; i < r; i++) { M.push(new Float64Array(c)); } return M; }
  function matVec(M, x) { var y = new Float64Array(M.length); for (var i = 0; i < M.length; i++) { var s = 0, row = M[i]; for (var j = 0; j < row.length; j++) s += row[j] * x[j]; y[i] = s; } return y; }
  function dot(a, b) { var s = 0; for (var i = 0; i < a.length; i++) s += a[i] * b[i]; return s; }
  function norm(a) { return Math.sqrt(dot(a, a)); }
  function transpose(M, cols) { var c = cols != null ? cols : (M[0] ? M[0].length : 0); var T = zeros(c, M.length); for (var i = 0; i < M.length; i++) for (var j = 0; j < c; j++) T[j][i] = M[i][j]; return T; }
  // Orthonormal basis of the column space of M (rows x cols) by modified Gram–Schmidt with re-orthogonalisation.
  function colBasis(M, cols) {
    var n = M.length, c = cols != null ? cols : (M[0] ? M[0].length : 0), Q = [];
    var scale = 0; for (var i = 0; i < n; i++) for (var j = 0; j < c; j++) scale = Math.max(scale, Math.abs(M[i][j]));
    var tol = Math.max(n, c, 1) * 1e-12 * Math.max(scale, 1);
    for (var j = 0; j < c; j++) {
      var v = new Float64Array(n); for (var i = 0; i < n; i++) v[i] = M[i][j];
      for (var pass = 0; pass < 2; pass++) for (var k = 0; k < Q.length; k++) { var p = dot(Q[k], v); for (var i = 0; i < n; i++) v[i] -= p * Q[k][i]; }
      var nv = norm(v); if (nv > tol) { for (var i = 0; i < n; i++) v[i] /= nv; Q.push(v); }
    }
    return Q;
  }
  function project(Q, y) { var out = new Float64Array(y.length); for (var k = 0; k < Q.length; k++) { var p = dot(Q[k], y); for (var i = 0; i < y.length; i++) out[i] += p * Q[k][i]; } return out; }
  S.linalg = { zeros: zeros, matVec: matVec, dot: dot, norm: norm, transpose: transpose, colBasis: colBasis, project: project, rank: function (M, c) { return colBasis(M, c).length; } };

  // ── Cellular sheaf on a 2-complex ──
  // vertices: [id], edges: [[u,v]] oriented u->v, faces: [[[edgeIndex, sign], ...]]
  // dv/de/df: stalk dims (number or map); R: {"v|e": matrix F(v)->F(e)}; Sf: {"e|f": matrix F(e)->F(f)}
  function Sheaf(opt) {
    this.V = opt.vertices.slice(); this.E = opt.edges.slice(); this.F = (opt.faces || []).slice();
    var dim = function (d, key) { return typeof d === 'number' ? d : (d && d[key] != null ? d[key] : 1); };
    var self = this;
    this.dv = {}; this.V.forEach(function (v) { self.dv[v] = dim(opt.dv == null ? 1 : opt.dv, v); });
    this.de = this.E.map(function (_, i) { return dim(opt.de == null ? 1 : opt.de, i); });
    this.df = this.F.map(function (_, i) { return dim(opt.df == null ? 1 : opt.df, i); });
    this.R = opt.R || {}; this.Sf = opt.Sf || {};
  }
  function eye(r, c) { var M = zeros(r, c); for (var i = 0; i < Math.min(r, c); i++) M[i][i] = 1; return M; }
  Sheaf.prototype.offsets = function () {
    var vo = {}, o = 0, self = this; this.V.forEach(function (v) { vo[v] = o; o += self.dv[v]; }); var N0 = o;
    var eo = [], o1 = 0; this.de.forEach(function (d) { eo.push(o1); o1 += d; }); var N1 = o1;
    var fo = [], o2 = 0; this.df.forEach(function (d) { fo.push(o2); o2 += d; }); var N2 = o2;
    return { vo: vo, eo: eo, fo: fo, N0: N0, N1: N1, N2: N2 };
  };
  Sheaf.prototype.delta0 = function () {
    var off = this.offsets(), D = zeros(off.N1, off.N0), self = this;
    this.E.forEach(function (e, i) {
      var u = e[0], v = e[1];
      var Ru = self.R[u + '|' + i] || eye(self.de[i], self.dv[u]);
      var Rv = self.R[v + '|' + i] || eye(self.de[i], self.dv[v]);
      for (var a = 0; a < self.de[i]; a++) {
        for (var b = 0; b < self.dv[u]; b++) D[off.eo[i] + a][off.vo[u] + b] -= Ru[a][b];
        for (var b2 = 0; b2 < self.dv[v]; b2++) D[off.eo[i] + a][off.vo[v] + b2] += Rv[a][b2];
      }
    });
    return { M: D, rows: off.N1, cols: off.N0 };
  };
  Sheaf.prototype.delta1 = function () {
    var off = this.offsets(), D = zeros(off.N2, off.N1), self = this;
    this.F.forEach(function (face, j) {
      face.forEach(function (pair) {
        var i = pair[0], sg = pair[1], Si = self.Sf[i + '|' + j] || eye(self.df[j], self.de[i]);
        for (var a = 0; a < self.df[j]; a++) for (var b = 0; b < self.de[i]; b++) D[off.fo[j] + a][off.eo[i] + b] += sg * Si[a][b];
      });
    });
    return { M: D, rows: off.N2, cols: off.N1 };
  };
  Sheaf.prototype.cohomology = function () {
    var d0 = this.delta0(), d1 = this.delta1();
    var r0 = colBasis(d0.M, d0.cols).length, r1 = d1.rows ? colBasis(d1.M, d1.cols).length : 0;
    var chain = 0; if (d1.rows && d0.rows) { var P = mul(d1.M, d0.M, d0.cols); P.forEach(function (row) { for (var k = 0; k < row.length; k++) chain = Math.max(chain, Math.abs(row[k])); }); }
    return { H0: d0.cols - r0, H1: d0.rows - r0 - r1, H2: d1.rows - r1, rank0: r0, rank1: r1, chainError: chain };
  };
  function mul(A, B, bcols) { var C = zeros(A.length, bcols); for (var i = 0; i < A.length; i++) for (var k = 0; k < B.length; k++) { var a = A[i][k]; if (!a) continue; for (var j = 0; j < bcols; j++) C[i][j] += a * B[k][j]; } return C; }
  // Orthogonal Hodge split of an edge cochain y: y = grad + harm + curl (Euclidean metric).
  Sheaf.prototype.hodge = function (y) {
    y = Float64Array.from(y);
    var d0 = this.delta0(), d1 = this.delta1();
    var grad = project(colBasis(d0.M, d0.cols), y);
    var curl = d1.rows ? project(colBasis(transpose(d1.M, d1.cols), d1.rows), y) : new Float64Array(y.length);
    var harm = new Float64Array(y.length); for (var i = 0; i < y.length; i++) harm[i] = y[i] - grad[i] - curl[i];
    var n2 = dot(y, y);
    return { grad: grad, harm: harm, curl: curl, norms: [norm(grad), norm(harm), norm(curl)],
      gammaEdge: n2 ? dot(grad, grad) / n2 : null, residual: dot(harm, harm) + dot(curl, curl) };
  };
  S.Sheaf = Sheaf;

  // ── Difference constraints with strict arcs ──
  // Constraint {from:i, to:j, c, strict, id}: t_j - t_i <= c (strict: < c).
  // Weights are lexicographic pairs (c, -strict); infeasible iff a cycle has weight < (0,0).
  function lexAdd(a, b) { return [a[0] + b[0], a[1] + b[1]]; }
  function lexLess(a, b) { return a[0] < b[0] - EPS || (Math.abs(a[0] - b[0]) <= EPS && a[1] < b[1]); }
  function stn(nodes, cons) {
    var idx = {}; nodes.forEach(function (n, k) { idx[n] = k; });
    var n = nodes.length, dist = nodes.map(function () { return [0, 0]; }), pred = nodes.map(function () { return null; }), x = -1;
    for (var it = 0; it < n; it++) {
      x = -1;
      for (var k = 0; k < cons.length; k++) {
        var c = cons[k], a = idx[c.from], b = idx[c.to];
        var cand = lexAdd(dist[a], [c.c, c.strict ? -1 : 0]);
        if (lexLess(cand, dist[b])) { dist[b] = cand; pred[b] = k; x = b; }
      }
      if (x < 0) break;
    }
    if (x < 0) return { feasible: true, potential: dist.map(function (d) { return d[0]; }), nodes: nodes };
    for (var r = 0; r < n; r++) x = idx[cons[pred[x]].from];
    var cyc = [], y = x, w = [0, 0];
    do { var ck = pred[y]; cyc.push(ck); w = lexAdd(w, [cons[ck].c, cons[ck].strict ? -1 : 0]); y = idx[cons[ck].from]; } while (y !== x && cyc.length <= cons.length);
    cyc.reverse();
    return { feasible: false, cycle: cyc, weight: w[0], strictCount: -w[1] };
  }
  // Karp minimum mean cycle on the real weights (strictness ignored). Returns mu* or null if acyclic.
  function karp(nodes, cons) {
    var n = nodes.length; if (!n) return null;
    var idx = {}; nodes.forEach(function (v, k) { idx[v] = k; });
    var INF = Infinity, D = []; for (var k = 0; k <= n; k++) { D.push(new Float64Array(n).fill(INF)); }
    for (var v = 0; v < n; v++) D[0][v] = 0; // virtual source with 0-arcs to all
    for (var k = 1; k <= n; k++) for (var e = 0; e < cons.length; e++) { var c = cons[e], a = idx[c.from], b = idx[c.to]; if (D[k - 1][a] < INF && D[k - 1][a] + c.c < D[k][b]) D[k][b] = D[k - 1][a] + c.c; }
    var best = INF;
    for (var v2 = 0; v2 < n; v2++) { if (D[n][v2] === INF) continue; var worst = -INF; for (var k2 = 0; k2 < n; k2++) { if (D[k2][v2] === INF) continue; worst = Math.max(worst, (D[n][v2] - D[k2][v2]) / (n - k2)); } best = Math.min(best, worst); }
    return best === INF ? null : best;
  }
  // Minimal uniform widening ε* of the given (widenable) arcs, by bisection on feasibility (exact up to tol).
  function widening(nodes, cons, widenable) {
    var test = function (eps) { return stn(nodes, cons.map(function (c, k) { return widenable(c, k) ? { from: c.from, to: c.to, c: c.c + eps, strict: c.strict } : c; })).feasible; };
    if (test(0)) return 0;
    var hi = 1; while (!test(hi) && hi < 1e12) hi *= 2; if (!test(hi)) return Infinity;
    var lo = 0; for (var i = 0; i < 80; i++) { var m = (lo + hi) / 2; if (test(m)) hi = m; else lo = m; }
    return hi;
  }
  // Deletion filter: shrink an infeasible claim set to an inclusion-minimal infeasible subset (MUS).
  function deletionMUS(claimIds, isInfeasible) {
    var cur = claimIds.slice();
    for (var i = 0; i < cur.length;) { var trial = cur.slice(0, i).concat(cur.slice(i + 1)); if (isInfeasible(trial)) cur = trial; else i++; }
    return cur;
  }
  S.order = { stn: stn, karp: karp, widening: widening, deletionMUS: deletionMUS };

  // ── Graph helpers ──
  function scc(nodes, edges) { // Tarjan; edges [[a,b]]
    var adj = {}; nodes.forEach(function (n) { adj[n] = []; }); edges.forEach(function (e) { if (adj[e[0]]) adj[e[0]].push(e[1]); });
    var index = 0, st = [], on = {}, idx = {}, low = {}, out = [];
    function strong(v) {
      idx[v] = low[v] = index++; st.push(v); on[v] = true;
      adj[v].forEach(function (w) { if (idx[w] === undefined) { strong(w); low[v] = Math.min(low[v], low[w]); } else if (on[w]) low[v] = Math.min(low[v], idx[w]); });
      if (low[v] === idx[v]) { var comp = [], w; do { w = st.pop(); on[w] = false; comp.push(w); } while (w !== v); out.push(comp); }
    }
    nodes.forEach(function (n) { if (idx[n] === undefined) strong(n); });
    return out;
  }
  function reachable(starts, nodes, edges) { var adj = {}; nodes.forEach(function (n) { adj[n] = []; }); edges.forEach(function (e) { if (adj[e[0]]) adj[e[0]].push(e[1]); }); var seen = {}, q = starts.slice(); q.forEach(function (s) { seen[s] = true; }); while (q.length) { var v = q.pop(); adj[v].forEach(function (w) { if (!seen[w]) { seen[w] = true; q.push(w); } }); } return seen; }
  function components(nodes, edges) { var p = {}; nodes.forEach(function (n) { p[n] = n; }); function f(x) { while (p[x] !== x) { p[x] = p[p[x]]; x = p[x]; } return x; } edges.forEach(function (e) { if (p[e[0]] !== undefined && p[e[1]] !== undefined) p[f(e[0])] = f(e[1]); }); var g = {}; nodes.forEach(function (n) { var r = f(n); (g[r] = g[r] || []).push(n); }); return Object.keys(g).map(function (k) { return g[k]; }); }
  S.graph = { scc: scc, reachable: reachable, components: components };
})(SA2);
if (typeof module !== 'undefined') module.exports = SA2;
