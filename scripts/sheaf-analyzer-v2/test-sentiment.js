// Parity test: JS VADER port vs the reference Python package (vaderSentiment 3.3.2) on the reference
// examples plus every sentence of the English corpus posts. Requires: pip install vaderSentiment.
const fs = require('fs'), path = require('path'), cp = require('child_process');
const SA2 = require('./engine-math.js'); require('./engine-text.js'); require('./engine-sentiment.js');
SA2.vader.setLexicon(JSON.parse(fs.readFileSync(path.join(__dirname, '../../static/data/vader-lexicon.json'), 'utf8')));
const ref = ["VADER is smart, handsome, and funny.", "VADER is smart, handsome, and funny!", "VADER is very smart, handsome, and funny.", "VADER is VERY SMART, handsome, and FUNNY.", "VADER is VERY SMART, handsome, and FUNNY!!!", "VADER is VERY SMART, uber handsome, and FRIGGIN FUNNY!!!", "VADER is not smart, handsome, nor funny.", "The book was good.", "At least it isn't a horrible book.", "The book was only kind of good.", "The plot was good, but the characters are uncompelling and the dialog is not great.", "Today SUX!", "Today only kinda sux! But I'll get by, lol", "Make sure you :) or :D today!", "Not bad at all", "It was never so good, without doubt the best.", "No problem, no worries but not great either?? Really??"];
const POSTS = path.join(__dirname, '../../posts');
const sents = [];
fs.readdirSync(POSTS).filter(f => f.endsWith('.md')).sort().forEach(f => { const t = fs.readFileSync(path.join(POSTS, f), 'utf8').replace(/^---[\s\S]*?\n---\n/, ''); SA2.segment(t).forEach(u => { if (!u.heading && u.text.length > 3 && !/[\u{1F000}-\u{1FFFF}☀-➿]/u.test(u.text)) sents.push(u.text); }); });
const all = ref.concat(sents);
const py = cp.execFileSync('python3', ['-c', 'import sys,json\nfrom vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer as A\na=A()\nprint(json.dumps([dict(a.polarity_scores(s), emo=any(c in a.emojis for c in s)) for s in json.load(sys.stdin)]))'], { input: JSON.stringify(all), maxBuffer: 1 << 28 }).toString();
const P = JSON.parse(py); let bad = 0, emo = 0;
all.forEach((s, i) => { if (P[i].emo) { emo++; return; } const j = SA2.vader.score(s), p = P[i]; if (['neg', 'neu', 'pos', 'compound'].some(k => Math.abs(j[k] - p[k]) > 1e-9)) { if (bad++ < 8) console.log('MISMATCH', JSON.stringify(s.slice(0, 120)), JSON.stringify({ js: j.compound, py: p.compound, jneg: j.neg, pneg: p.neg })); } });
console.log('VADER parity:', all.length - emo - bad, '/', all.length - emo, 'identical (reference examples', ref.length, '+ corpus sentences', sents.length + '); skipped', emo, 'containing emoji-lexicon symbols (port omits emoji-to-text)');
process.exit(bad ? 1 : 0);
