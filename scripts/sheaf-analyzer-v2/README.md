# Sheaf Analyzer v2 — sources

The live page `static/pages/sheaf-analyzer.html` is **generated** from these files. Edit here, then:

```bash
node scripts/sheaf-analyzer-v2/assemble.js      # writes static/pages/sheaf-analyzer.html
node scripts/sheaf-analyzer-v2/test-math.js     # sheaf/Hodge generators, theta graph, Mockfjärd fixture (must all pass)
node scripts/sheaf-analyzer-v2/test-protocol.js # preregistered perturbation protocol on the posts (seed 201)
```

| file | content |
|---|---|
| `engine-math.js` | linear algebra, cellular sheaves (δ⁰, δ¹, cohomology), Hodge decomposition, difference constraints with strict arcs, Karp minimum mean cycle, ε*, deletion-filter MUS |
| `engine-text.js` | Markdown-robust segmentation with UTF-16 offsets, typed claim extraction, discourse complex, linear/ordinal/propositional layers, Ψ support graph, compare/K(t) |
| `engine-topic.js` | descriptive 18-layer keyword tagging (v1 lexicon; not part of the mathematics) |
| `samples.js`, `ui.js`, `page-markup.html`, `v1-style.css` | page |

Γ is binary per layer (asserted claims glue or not; N/A if nothing comparable). Reported speech is never treated as fact.
Ψ is a prototype: validation on the LOCO corpus (Miani, Hills & Bangerter 2021) is pending.
v1 audit: `docs/sheaf-analyzer-v2/`.
