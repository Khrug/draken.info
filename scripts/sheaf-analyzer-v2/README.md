# Sheaf Analyzer v2 — sources

The live page `static/pages/sheaf-analyzer.html` is **generated** from these files. Edit here, then:

```bash
node scripts/sheaf-analyzer-v2/assemble.js      # writes static/pages/sheaf-analyzer.html
node scripts/sheaf-analyzer-v2/test-math.js     # sheaf/Hodge generators, theta graph, Mockfjärd fixture (must all pass)
node scripts/sheaf-analyzer-v2/test-protocol.js # preregistered perturbation protocol on the posts (seed 201)
node scripts/sheaf-analyzer-v2/test-sentiment.js # VADER port vs the Python reference package (pip install vaderSentiment)
node scripts/sheaf-analyzer-v2/test-stats.js     # t/F/χ²/z distributions vs SciPy; statcheck, GRIM, arithmetic fixtures
node scripts/sheaf-analyzer-v2/test-review.js    # fixtures for rhetoric, fact-check and paper-review detectors
```

| file | content |
|---|---|
| `engine-math.js` | linear algebra, cellular sheaves (δ⁰, δ¹, cohomology), Hodge decomposition, difference constraints with strict arcs, Karp minimum mean cycle, ε*, deletion-filter MUS |
| `engine-text.js` | Markdown-robust segmentation with UTF-16 offsets, typed claim extraction, discourse complex, linear/ordinal/propositional layers, Ψ support graph, compare/K(t) |
| `engine-insights.js` | descriptive insights: entities, concepts, figures, timeline, argument structure, attribution, possible tensions, repeated statements |
| `graph2d.js` | dependency-free canvas graph: pan, zoom, pinch, drag, search, readable labels |
| `engine-sentiment.js` | faithful port of VADER 3.3.2 (Hutto & Gilbert 2014, MIT); lexicon in `static/data/vader-lexicon.json` (+ licence) loaded on demand; parity-tested sentence by sentence (emoji-to-text step omitted) |
| `engine-rhetoric.js` | loaded language, political framing vocabulary, sources/links by domain type, stance after Hyland (2005), fallacy candidates, rhetorical devices, logos/ethos/pathos marker rates, Ishikawa reasoning map |
| `engine-stats.js` | t, F, χ², r, z p-values (incomplete beta/gamma); statcheck-style recomputation (Nuijten et al. 2016); GRIM (Brown & Heathers 2017); p-value profile; prose arithmetic (percent changes, percentage points, shares, multiples) |
| `engine-review.js` | fact-check ranking with "what would settle it" and search links; paper-review checklist (design, n, effect sizes, CIs, power, preregistration, data/code, ethics, COI, funding, limitations, causal language in observational designs, overclaiming, reference ages); optional Crossref DOI lookup in the browser |
| `ui-review.js` | Review card: tabs, fishbone SVG (wide and phone layouts), sentiment arc, exports |
| `engine-topic.js` | descriptive 18-layer keyword tagging (v1 lexicon; not part of the mathematics) |
| `samples.js`, `ui.js`, `ui-explore.js`, `ui-review.js`, `page-markup.html`, `v1-style.css` | page |

Γ is binary per layer (asserted claims glue or not; N/A if nothing comparable). Reported speech is never treated as fact.
Ψ is a prototype: validation on the LOCO corpus (Miani, Hills & Bangerter 2021) is pending.
v1 audit: `docs/sheaf-analyzer-v2/`.

Review tools — status. VADER is a published, validated method; the statistical re-checks are exact arithmetic on reported
values. Loaded-language, framing, stance, fallacy, device and appeal detectors are transparent cue lists written for this
tool (English only) and are not validated against annotated data: they surface candidates with their evidence. Corpus run
(90 posts, 293k words): 9 fallacy candidates in total; device counts are dominated by antithesis, chiasmus and anaphora,
which the Draken prose genuinely uses.
