const SA2 = require('./engine-math.js');
let fails = 0;
const ok = (name, cond, info) => { console.log((cond ? 'PASS ' : 'FAIL ') + name + (info !== undefined ? '  ' + JSON.stringify(info) : '')); if (!cond) fails++; };
const close = (a, b, t = 1e-9) => Math.abs(a - b) <= t;

// Generator A: coherent filled triangle
const tri = { vertices: [0, 1, 2], edges: [[0, 1], [1, 2], [2, 0]], faces: [[[0, 1], [1, 1], [2, 1]]] };
const A = new SA2.Sheaf(tri);
const z = [1, 4, 2]; const yA = [z[1] - z[0], z[2] - z[1], z[0] - z[2]];
let c = A.cohomology(), h = A.hodge(yA);
ok('A cohomology H0=1 H1=0', c.H0 === 1 && c.H1 === 0 && c.chainError === 0, c);
ok('A pure gradient, residual 0', close(h.norms[1], 0) && close(h.norms[2], 0) && close(h.residual, 0), h.norms);
// B: intransitive filled triangle -> pure curl, residual 3
h = A.hodge([1, 1, 1]);
ok('B pure curl |curl|=sqrt3 residual=3', close(h.norms[0], 0) && close(h.norms[1], 0) && close(h.norms[2], Math.sqrt(3)) && close(h.residual, 3), h.norms);
// C: unfilled 5-cycle -> harmonic, H1=1, residual 5
const n = 5, C = new SA2.Sheaf({ vertices: [0, 1, 2, 3, 4], edges: [0, 1, 2, 3, 4].map(i => [i, (i + 1) % n]) });
c = C.cohomology(); h = C.hodge([1, 1, 1, 1, 1]);
ok('C H1=1, pure harmonic, residual 5', c.H1 === 1 && close(h.norms[1], Math.sqrt(5)) && close(h.residual, 5), [c, h.norms]);
// E: twisted cycle (holonomy -1): H0=H1=0; constant baseline falsely flags
const E = new SA2.Sheaf({ vertices: [0, 1, 2, 3, 4], edges: [0, 1, 2, 3, 4].map(i => [i, (i + 1) % n]), R: { '0|4': [[-1]] } });
c = E.cohomology();
const yt = [0, 0, 0, 0, -2];
ok('E twisted H0=0 H1=0', c.H0 === 0 && c.H1 === 0, c);
ok('E twisted residual 0, constant residual 0.8', close(E.hodge(yt).residual, 0) && close(C.hodge(yt).residual, 0.8), [E.hodge(yt).residual, C.hodge(yt).residual]);
// Partial holonomy diag(1,2) on 3-cycle with 2-dim stalks
const P = new SA2.Sheaf({ vertices: [0, 1, 2], edges: [[0, 1], [1, 2], [2, 0]], dv: 2, de: 2, R: { '0|2': [[1, 0], [0, 0.5]] } });
c = P.cohomology(); ok('partial holonomy H0=1 H1=1', c.H0 === 1 && c.H1 === 1, c);
// Mixture: filled triangle + unfilled square, exact recovery
const M = new SA2.Sheaf({ vertices: [0, 1, 2, 3, 4, 5, 6], edges: [[0, 1], [1, 2], [2, 0], [3, 4], [4, 5], [5, 6], [6, 3]], faces: [[[0, 1], [1, 1], [2, 1]]] });
const pot = [0, 2, 5, 1, 3, 2, 7]; const grad = M.edges = null;
const ed = [[0, 1], [1, 2], [2, 0], [3, 4], [4, 5], [5, 6], [6, 3]];
const g = ed.map(e => pot[e[1]] - pot[e[0]]), cu = [0.8, 0.8, 0.8, 0, 0, 0, 0], ha = [0, 0, 0, 1.5, 1.5, 1.5, 1.5];
h = M.hodge(g.map((v, i) => v + cu[i] + ha[i]));
const err = (a, b) => Math.sqrt(a.reduce((s, v, i) => s + (v - b[i]) ** 2, 0));
ok('mixture exact recovery', err(h.grad, g) < 1e-9 && err(h.curl, cu) < 1e-9 && err(h.harm, ha) < 1e-9, [err(h.grad, g), err(h.curl, cu), err(h.harm, ha)]);

// Theta graph: basis cycles pass, third cycle and whole system fail
const iv = (lab, lo, hi) => [{ from: 'u', to: 'v', c: hi, id: lab }, { from: 'v', to: 'u', c: -lo, id: lab }];
const th = { e1: iv('e1', 0, 10), e2: iv('e2', 0, 1), e3: iv('e3', 9, 10) };
const feas = ks => SA2.order.stn(['u', 'v'], ks.flatMap(k => th[k])).feasible;
ok('theta: e1e2 ok, e1e3 ok, e2e3 fails, all fail', feas(['e1', 'e2']) && feas(['e1', 'e3']) && !feas(['e2', 'e3']) && !feas(['e1', 'e2', 'e3']));

// Strict order cycle: a<b, b<c, c<a infeasible; a<=b, b<=c, c<=a feasible
const strictCyc = [['a', 'b'], ['b', 'c'], ['c', 'a']].map(([x, y]) => ({ from: y, to: x, c: 0, strict: true }));
ok('strict 3-cycle infeasible', !SA2.order.stn(['a', 'b', 'c'], strictCyc).feasible);
ok('non-strict 3-cycle feasible', SA2.order.stn(['a', 'b', 'c'], strictCyc.map(c => Object.assign({}, c, { strict: false }))).feasible);

// Mockfjärd fixture (frozen Amendment 1)
const N = ['O', 'THEFT', 'ROBBERY', 'DISPOSAL', 'SALE', 'USE', 'FOUND'];
const k = (f, t, c, id) => ({ from: f, to: t, c, id });
const HARD = [k('O', 'THEFT', 248, 'H'), k('THEFT', 'O', -248, 'H'), k('O', 'ROBBERY', 299, 'H'), k('ROBBERY', 'O', -299, 'H'),
  k('O', 'FOUND', 8724, 'H'), k('FOUND', 'O', -8724, 'H'), k('ROBBERY', 'THEFT', 0, 'H'), k('FOUND', 'DISPOSAL', 0, 'H')];
const CL = { C1: [k('DISPOSAL', 'ROBBERY', 0, 'C1'), k('ROBBERY', 'DISPOSAL', 1, 'C1')], C2: [k('O', 'SALE', 1095, 'C2'), k('SALE', 'O', -731, 'C2')],
  C3: [k('O', 'USE', 1154, 'C3'), k('USE', 'O', -1154, 'C3')], C4: [k('DISPOSAL', 'SALE', 0, 'C4'), k('DISPOSAL', 'USE', 0, 'C4')] };
const sys = ids => HARD.concat(ids.flatMap(i => CL[i]));
const inf = ids => !SA2.order.stn(N, sys(ids)).feasible;
const r = SA2.order.stn(N, sys(['C1', 'C2', 'C3', 'C4']));
ok('Mockfjärd infeasible, cycle weight -854, length 4', !r.feasible && r.weight === -854 && r.cycle.length === 4, { w: r.weight, len: r.cycle.length });
const mus1 = SA2.order.deletionMUS(['C1', 'C2', 'C3', 'C4'], inf);
const mus2 = SA2.order.deletionMUS(['C1', 'C2', 'C4', 'C3'], ids => inf(ids)) ;
const allMUS = []; const cand = [['C1','C2','C3','C4'],['C1','C3','C2','C4'],['C1','C2','C4','C3']];
['C2', 'C3'].forEach(drop => { const ids = ['C1', 'C2', 'C3', 'C4'].filter(x => x !== drop); allMUS.push(SA2.order.deletionMUS(ids, inf).sort().join(',')); });
ok('Mockfjärd MUS = {C1,C3,C4} and {C1,C2,C4}', allMUS.includes('C1,C3,C4') && allMUS.includes('C1,C2,C4'), allMUS);
const mu = SA2.order.karp(N, sys(['C1', 'C2', 'C3', 'C4']));
ok('Karp min mean cycle = -213.5', close(mu, -213.5, 1e-9), mu);
const wAll = SA2.order.widening(N, sys(['C1', 'C2', 'C3', 'C4']), () => true);
const wClaims = SA2.order.widening(N, sys(['C1', 'C2', 'C3', 'C4']), c => c.id !== 'H');
ok('ε* all arcs 213.5, claim arcs 284.667', close(wAll, 213.5, 1e-6) && close(wClaims, 854 / 3, 1e-6), [wAll, wClaims]);

console.log(fails ? `\n${fails} FAILED` : '\nALL MATH TESTS PASSED');
process.exit(fails ? 1 : 0);
