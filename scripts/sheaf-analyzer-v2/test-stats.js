// Checks engine-stats.js: distribution functions against SciPy (if installed), statcheck / GRIM / arithmetic fixtures.
const cp = require('child_process'); const SA2 = require('./engine-math.js'); require('./engine-stats.js');
const D = SA2.dist; let fail = 0; const ok = (c, msg) => { if (!c) { fail++; console.log('FAIL', msg); } };
const cases = [];
for (const df of [1, 2, 3, 5, 10, 28, 60, 200, 1000]) for (const t of [0.1, 0.8, 1.96, 2.05, 3.3, 6.5]) cases.push(['t', t, df]);
for (const [a, b] of [[1, 10], [2, 30], [3, 96], [5, 200], [1, 1000], [12, 4]]) for (const f of [0.5, 1.2, 3.9, 4.2, 8.8, 25]) cases.push(['F', f, a, b]);
for (const df of [1, 2, 4, 9, 30, 100]) for (const x of [0.3, 3.84, 7.2, 15.5, 40, 130]) cases.push(['c', x, df]);
for (const z of [0, 0.5, 1.645, 1.96, 2.58, 3.29, 5, 8]) cases.push(['z', z]);
let ref = null;
try { ref = JSON.parse(cp.execFileSync('python3', ['-c', `import json,sys
from scipy import stats
out=[]
for c in json.load(sys.stdin):
  k=c[0]
  if k=='t': out.append(2*stats.t.sf(c[1],c[2]))
  elif k=='F': out.append(stats.f.sf(c[1],c[2],c[3]))
  elif k=='c': out.append(stats.chi2.sf(c[1],c[2]))
  else: out.append(2*stats.norm.sf(c[1]))
print(json.dumps(out))`], { input: JSON.stringify(cases) }).toString()); } catch (e) { console.log('SciPy not available; skipping distribution parity'); }
if (ref) { let worst = 0; cases.forEach((c, i) => { const js = c[0] === 't' ? D.tTwo(c[1], c[2]) : c[0] === 'F' ? D.fUpper(c[1], c[2], c[3]) : c[0] === 'c' ? D.chi2Upper(c[1], c[2]) : D.zTwo(c[1]);
  const err = Math.abs(js - ref[i]) / Math.max(ref[i], 1e-300); if (ref[i] > 1e-280) worst = Math.max(worst, err); ok(err < 1e-8 || Math.abs(js - ref[i]) < 1e-15, JSON.stringify(c) + ' js ' + js + ' scipy ' + ref[i]); });
  console.log('distributions vs SciPy:', cases.length, 'cases, max relative error', worst.toExponential(2)); }
// statcheck fixtures
const sc = SA2.statcheck('The effect was significant, t(28) = 2.20, p = .036. A second test, F(2, 57) = 3.19, p = .049, and χ2(1, N = 120) = 3.90, p = .048. ' +
  'An error: t(28) = 1.20, p = .03. A decision error: F(1, 30) = 2.10, p < .05. r(48) = .32, p = .023. z = 1.96, p = .05. One-tailed test: t(40) = 1.70, p = .048.');
const st = sc.map(s => s.kind + ':' + s.status); console.log(st.join(' | '));
ok(st[0] === 't:consistent', 't ok'); ok(st[1] === 'F:consistent', 'F ok'); ok(st[2] === 'χ²:consistent', 'chi ok'); ok(st[3] === 't:decision error', 't decision error');
ok(st[4] === 'F:decision error', 'F decision error'); ok(st[5] === 'r:consistent', 'r ok'); ok(st[6] === 'z:consistent', 'z ok'); ok(st[7] === 't:consistent (one-tailed)', 'one-tailed');
// GRIM: n = 21, mean 3.47 → 72.87 impossible; 3.48 → 73.08 ≈ 73/21 = 3.476 → 3.48 ok
const g = SA2.grim('Participants (n = 21) reported M = 3.47 on the item. In a second group (n = 21) the mean was 3.48. A large sample (N = 250) had M = 2.31.');
console.log(g.map(x => x.mean + '/' + x.n + ':' + x.status).join(' | '));
ok(g[0].status === 'inconsistent' && g[1].status === 'consistent' && g[2].status === 'not testable', 'grim');
// arithmetic
const a = SA2.arithmetic('Unemployment rose from 5.0% to 6.0%, an increase of 20%. Sales grew from 200 to 260, a 30% increase. Costs fell from 80 to 60, a drop of 33%. ' +
  'The rate went from 4% to 6%, up 2 percentage points. Revenue doubled from 3 million to 6.5 million. Of the 1,200 respondents, 300 of 1,200 (25%) agreed. 450 out of 900 (40%) disagreed. Prices rose from 50 to 60, an increase of 10%.');
console.log(a.map(x => x.type + ':' + x.status + (x.note ? ' (' + x.note + ')' : '')).join(' | '));
ok(a.filter(x => x.status === 'mismatch').length === 3, 'arith mismatches = 3 (drop 33% vs 25%, 40% share, 10% vs 20%)');
console.log(fail ? fail + ' FAILED' : 'ALL STATS TESTS PASSED'); process.exit(fail ? 1 : 0);
