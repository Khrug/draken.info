// Fixture checks for engine-rhetoric.js and engine-review.js (detectors fire on constructed cases).
const fs = require('fs'), path = require('path');
global.SA2 = require('./engine-math.js'); const SA2 = global.SA2; ['engine-text', 'engine-insights', 'engine-sentiment', 'engine-rhetoric', 'engine-stats', 'engine-review', 'samples'].forEach(f => require('./' + f + '.js'));
SA2.vader.setLexicon(JSON.parse(fs.readFileSync(path.join(__dirname, '../../static/data/vader-lexicon.json'), 'utf8')));
let fail = 0; const ok = (c, m) => { if (!c) { fail++; console.log('FAIL', m); } };
const FX = `Everyone knows the regime is lying to us. Experts say the new policy will inevitably lead to total collapse. You're either with us or against us.
Why did the minister stop hiding the truth? We will fight in the towns. We will fight in the fields. We will fight in the hills. We will never surrender, never, never!
Ask not what your country can do for you, ask what you can do for your country. It is not a tax, but a theft.
Ever since the bridge opened, crime has skyrocketed. What about the scandal under the last government? My neighbour who took the vaccine got sick.
The so-called "experts" are shills for big government. Illegal aliens and open borders are destroying our way of life before it's too late.
According to Reuters (Smith et al., 2021), unemployment rose to 7.4% in March 2023 (https://www.reuters.com/x). See also https://bit.ly/abc and doi 10.1038/nature12345.
Undocumented immigrants and the climate crisis remain contested framings. Nobody has ever proven it false, so it must be true.`;
const run = t => { const R = SA2.analyze(t), I = SA2.insights(R); return SA2.discourse(t, R, I); };
const D = run(FX), RH = D.rhetoric, fall = new Set(RH.fallacies.items.map(x => x.id)), dev = new Set(RH.devices.items.map(x => x.id));
['bandwagon', 'slippery-slope', 'false-dilemma', 'loaded-question', 'post-hoc', 'tu-quoque', 'anecdotal', 'fear', 'ignorance', 'vague-authority'].forEach(k => ok(fall.has(k), 'fallacy ' + k));
['anaphora', 'epizeuxis', 'chiasmus', 'antithesis', 'hypophora', 'scare-quotes'].forEach(k => ok(dev.has(k), 'device ' + k));
ok(RH.framing.nRight >= 3 && RH.framing.nLeft >= 2, 'framing counts');
ok(RH.sources.byClass.news === 1 && RH.sources.byClass['link shortener'] === 1 && RH.sources.dois.length === 1, 'sources');
ok(RH.sentiment && RH.sentiment.mean < 0, 'sentiment negative');
ok(RH.appeals.share && RH.appeals.share.pathos > RH.appeals.share.ethos, 'pathos > ethos');
const P = run(SA2.SAMPLES.paper.text);
ok(P.paper.paperness >= 5, 'paperness'); ok(P.paper.statcheck.some(s => s.status !== 'consistent'), 'statcheck flags t-test');
ok(P.paper.grim.some(g => g.status === 'inconsistent'), 'GRIM'); ok(P.paper.causal.length >= 1, 'causal language in survey');
ok(P.factcheck.arithmetic.filter(a => a.status === 'mismatch').length === 2, 'arithmetic mismatches');
ok(/causes higher exam scores/.test(P.rhetoric.fishbone.head.text), 'thesis selection');
// no-false-alarm control: plain hedged prose
const C = run('The committee met on 4 May 2021. Members discussed the budget, which may need revision. The chair noted that results were mixed and further data are needed.');
ok(!C.rhetoric.fallacies.items.length, 'no fallacies in control'); ok(!C.factcheck.arithmetic.length, 'no arithmetic in control');
console.log(fail ? fail + ' FAILED' : 'ALL REVIEW TESTS PASSED'); process.exit(fail ? 1 : 0);
