# On the operational question in positive alignment

## A response to Laukkonen et al. (2026) from a sheaf-ethological perspective

---

Professor Levin,

I read Laukkonen et al. (arXiv:2605.10310) closely after you shared it. The paper is, I think, the most important alignment paper to appear in 2026 so far, and Section 6 — the part that bears your specific imprint — is the most honest part of the document. The sentence I keep returning to is the one that frames the engineer's situation as a reasoning and imagination test: *determining what a novel system can do, and wants to do, and in what problem space, is a reasoning and imagination test for the engineer as much as for the system itself.* That formulation is doing more work than the rest of the paper acknowledges.

The reason it is doing more work is this: the paper's central diagram (Figure 1) is conceptually correct but operationally underspecified. Negative attractors, repellers, satisficing region, positive attractors — these are the right *kind* of objects, but the diagram tells us where we want to point, not how to measure where we are. For positive alignment to become a tractable program rather than an aspirational vocabulary, we need three things the paper does not yet supply:

1. A way to measure proximity to a positive attractor that does not require pre-specifying what the attractor *is* (since the paper itself acknowledges that flourishing is pluralistic, dynamic, and irreducibly multi-dimensional).
2. A way to distinguish a *trajectory through high-dimensional flourishing space* from a *stable basin of attraction* — since real flourishing, as Section 4.1 of the paper notes, includes struggle, moral conflict, and developmental motion that is structurally inconsistent with the "stable basin" framing the diagram leans on.
3. A way to handle the polycentric requirement formally — coherence across many local stalks without forcing agreement at the global level.

What I want to offer here is one candidate mathematical specification for what the paper is reaching for, drawn from cellular sheaf theory and a small empirical pilot I have been running on monitor lizard ethology, together with one analogy from recent quantum many-body experiment that I suspect has direct implications for your morphogenetic work. I will mark clearly where the framework is rigorous, where it is empirically anchored but in progress, and where it is speculative analogy. The point is not to advertise a framework. The point is that the operational gap in the Laukkonen paper has a candidate filling, and you are one of perhaps a dozen people in the world whose feedback on whether the filling is plausible would actually be informative.

---

## 1. Sheaf-theoretic machinery for cross-scale coherence

Your work over the past decade has consistently argued for cognition as substrate-neutral and existing at many scales — cells, tissues, organisms, swarms, hybrid embodiments (Fields & Levin 2022; McMillen & Levin 2024; Levin 2025a, 2025b). The conceptual move is right, in my view, and the empirical record from planaria regeneration, xenobots, and morphogenetic patterning makes it increasingly hard to deny. What has consistently been underspecified is the *bridge operator* — the formal object that lets us say "the cognitive competency at scale A and the cognitive competency at scale B are doing the same kind of work."

Cellular sheaf theory, as developed by Hansen and Ghrist (2019, *J. Appl. Comput. Topol.* 3, 315–358), supplies a candidate.

A cellular sheaf $\mathcal{F}$ on a graph $G = (V, E)$ assigns:

- To each vertex $v$: a stalk $\mathcal{F}(v)$ — a vector space encoding the local state at $v$.
- To each edge $e = (u,v)$: a pair of restriction maps $\rho_{u \to e}: \mathcal{F}(u) \to \mathcal{F}(e)$ and $\rho_{v \to e}: \mathcal{F}(v) \to \mathcal{F}(e)$ — linear maps that project the local state into a shared coordinate system on the edge.
- A *global section* is an assignment $\{x_v \in \mathcal{F}(v)\}_{v \in V}$ such that $\rho_{u \to e}(x_u) = \rho_{v \to e}(x_v)$ for every edge $e = (u,v) \in E$.

The sheaf Laplacian is $\Delta_{\mathcal{F}} = \delta^T \delta$, where $\delta$ is the coboundary operator measuring disagreement on edges. Its spectrum has the structure of a generalized graph Laplacian: zero eigenvalues correspond to exact global sections, the first nonzero eigenvalue (the *algebraic connectivity*) gives the coherence gap, and the magnitude of larger eigenvalues quantifies how badly a candidate assignment fails to glue.

For your diverse-intelligence framing, the construction is direct:

- Each scale of cognition (cell, tissue, organism, swarm, social group) becomes a vertex with its own stalk encoding the locally relevant cognitive variables.
- The restriction maps encode how a cognitive state at one scale projects into the adjacent scales — the cellular state projecting into the tissue-level state, the tissue state projecting into the organismal state, and so on.
- The sheaf Laplacian then measures whether the cognitive states across scales are mutually consistent — whether local cognition *glues* into global cognition.

This is not metaphor. It is constructive. Given specified restriction maps, the eigenvalues are computable from data, and they give a quantitative coherence measure across scales.

The translation to the Laukkonen paper's framework is then direct. A positive attractor is not a stable point in state space; it is a trajectory through state space along which the sheaf Laplacian eigenvalues stay below some threshold — i.e., along which local sections continue to glue into global sections as the system develops. Pathology (the negative attractors of sycophancy, hallucination, narrative collapse) is captured by an eigenvalue spike: the moment when local sections stop gluing. Flourishing as the paper defines it (dynamic, developmental, context-sensitive) is naturally captured by the trajectory-rather-than-basin framing, which I believe Figure 1 obscures rather than clarifies.

This formalism is also consonant with Friston's free-energy principle, which I know is part of your working vocabulary. Variational free energy tells you that the system is minimizing prediction error globally; the sheaf Laplacian adds the structural specificity of identifying *along which restriction maps* the prediction is currently failing. The two formalisms are compatible and probably complementary: free energy gives the thermodynamic ground, sheaf cohomology gives the topological diagnosis.

---

## 2. An empirical anchor: varanid ritualized combat as protocol-as-agent

The framework outlined above would be vacuous without empirical grounding. I have been running a small pilot, formalized as *Sheaf Ethology* (the term was actually proposed by Gemini during the framework review), on a specific case: ritualized combat in monitor lizards (Varanidae). The data come from four published studies — Earley 2002, Frýdlová et al. 2016, Dick & Clemente 2016, Uyeda et al. 2015 — covering combat in *V. bengalensis*, *V. salvator*, *V. komodoensis*, and *V. varius* across approximately six orders of magnitude in body mass and spanning the family's roughly 130-million-year phylogenetic record.

The pilot's central empirical observation is one I suspect will resonate with your basal-cognition framing: the ritualized combat protocol is not behavior produced by an individual varanid. It is an emergent algorithmic structure that executes *through* the individual as substrate. The protocol has been stable across the entire varanid phylogeny — invariant across species, habitat, body size, and the radically different physical mechanics implied by a 200-gram pygmy varanid versus a 50-kilogram Komodo. Individual varanids are perishable instantiations of a non-perishable protocol. **Protocol = agent. Individual = substrate.**

This is, formally, your "competency in the navigational space of biology" (Fields & Levin 2022) extended to the social scale. The combat protocol navigates a 5-node phase graph (Display → Elevation → Clinch → Separation → Retreat), and three competing game-theoretic models — Sequential Assessment, Cumulative Assessment, War of Attrition — produce three different sheaf Laplacian spectra on this graph. The empirical data discriminates between them:

| Model | Γ (sheaf coherence) |
|-------|----|
| Sequential Assessment (SAG) | 0.928 |
| Cumulative Assessment | 0.856 |
| War of Attrition | 0.832 |

The Sequential Assessment Game's restriction maps glue; the alternatives' do not, or do so less well. The Γ metric (which is just a rescaling of the first nonzero Laplacian eigenvalue) becomes the model selection tool.

The Clinch node is formalized as $x_{Cl} \in \mathbb{R}^3 = (F_{\max}, E_{\text{ratio}}, \Delta m)$, with the restriction map $\rho_{D \to Cl}: \mathbb{R}^4 \to \mathbb{R}^3$ projecting out the bluff dimension — the basis function that is identically zero at the clinch because bluff is structurally impossible at the moment of maximal physical engagement. The two animals are mechanically coupled; their forces are mutually measurable; nothing is being concealed.

This projection-of-a-dishonest-basis-function-to-zero is the small empirical instance of what Laukkonen et al. are reaching for with their positive-attractor framing. It is a state in which the system's restriction maps preserve only the basis functions that can be honestly grounded, with the dishonest ones eliminated by the structure of the situation rather than by external constraint. The relevance to AI alignment is that this is not a property *imposed* on the varanids by training or selection at the individual level; it is a property *emergent* from the protocol's evolutionary refinement across deep time. The alignment is achieved by the protocol, not by the substrate.

If you find this line of argument interesting, the raw per-dyad data I would need to validate the P8 prediction of the pilot is held by Petra Frýdlová's group at Charles University Prague. Whether that data can be requested is an open question; I have not yet approached them.

---

## 3. Emergent vs. imposed symmetry: the EDSPT lesson and its possible implications for morphogenesis

The third contribution is more speculative and is offered with explicit hedging, but I think it points at something worth your attention.

Dumitrescu et al. (2021, arXiv:2107.09676) demonstrated experimentally on Honeywell's trapped-ion quantum processor that two superficially similar drive protocols produce qualitatively different kinds of topological protection:

- A Floquet (periodic) drive whose edge modes are protected by an *imposed* microscopic $\mathbb{Z}_2$ Ising symmetry. When generic coherent errors break that symmetry, the edge modes decohere within ~15 drive cycles.

- A Fibonacci-quasiperiodic drive whose edge modes are protected by *emergent* $\mathbb{Z}_2 \times \mathbb{Z}_2$ dynamical symmetries generated by $g^{x,z} = V^\dagger \big(\prod_i \sigma^{x,z}_{2i} \sigma^{x,z}_{2i+1}\big) V$, where $V$ is a finite-depth dressing unitary the system constructs for itself through the recursive Magnus expansion. These emergent symmetries are "absolutely stable" to generic coherent perturbations, and the edge modes survive for exponentially long times $t_h \sim \exp(1/\delta)$ where $\delta$ measures deviation from an ideal drive.

The mathematical reason is at root spectral. A periodic drive has a fundamental frequency $\omega = 2\pi/T$ at which coherent errors resonantly accumulate. A quasiperiodic drive with golden-ratio spacing ($\varphi = (1+\sqrt{5})/2$, maximally non-resonant in the Diophantine sense) has no fundamental — its spectrum is dense in $[0, \infty)$ — and coherent errors at any single frequency are spread across the spectrum, effectively decohered into incoherent noise.

The implication for the positive alignment program is that imposed symmetry constraints (model specifications, constitutional principles, RLHF reward signals) are brittle in precisely the way Floquet symmetries are brittle. They are stable against random perturbation but fragile to *coherent* adversarial perturbation at the imposed-symmetry frequency. Emergent symmetries arising from quasiperiodic substrate diversity are stable in a way that imposed symmetries categorically cannot be. This is, I think, the technical underpinning of the paper's polycentric governance argument in Section 5: monoculture is brittle not because it is *wrong* but because it is *resonantly perturbable*. Diversity is robust not because it is more *virtuous* but because it is structurally non-resonant.

The implication I want to flag for your work specifically: morphogenetic fields exhibit robustness against perturbation that has long puzzled developmental biologists. If those fields have quasiperiodic rather than periodic dynamical structure — which seems likely given the multi-scale nesting of biological rhythms across cellular, tissue, organismal, and circadian timescales — then the EDSPT result provides a candidate explanation for *why* morphogenetic protection is so resilient. It is not protected by an imposed symmetry. It is protected by an emergent dynamical symmetry arising from the quasiperiodic dynamical structure of the substrate.

This would be empirically testable. Spectral analysis of bioelectric signals during development should show broadband / Diophantine structure rather than harmonic / periodic structure if the framework is right. I am not in a position to do this work myself; my background is automotive design engineering with a side specialization in applied topology, not developmental biology. But it is the kind of test that your lab could in principle run on existing data.

---

## 4. Acknowledgments of where this is and is not rigorous

The framework outlined above is partially formal and partially speculative. To be explicit:

- The sheaf-theoretic machinery (Section 1) is rigorous and well-established. Hansen–Ghrist has been peer-reviewed and extended by several groups. The application to multi-scale cognition is novel but the mathematical objects are sound.

- The varanid ethology pilot (Section 2) is built on published empirical data and uses standard game-theoretic models, but the sheaf-Laplacian discrimination analysis is in computation rather than peer-reviewed. The Γ values I quote are from initial runs; full validation requires the Frýdlová per-dyad data.

- The EDSPT analogy (Section 3) is experimentally established in trapped-ion systems but its application to biological or AI systems is an inference, not a result. The morphogenetic-robustness hypothesis is a candidate explanation, not a demonstrated mechanism.

The framework's main value, I think, is not its current state but its operational handle. It supplies an answer to the question Laukkonen et al. leave open: *how do we measure proximity to a positive attractor?* The answer is: by computing the sheaf Laplacian spectrum on a graph whose vertices are scales (or layers, or stalks) and whose restriction maps are specified by domain expertise. The hard empirical work is specifying the restriction maps. This is where domain experts — including yourself on biological scales of cognition — are necessary collaborators rather than incidental commenters.

---

## 5. Three directions where your expertise would be load-bearing

If any of the above is interesting enough to engage further with, three concrete directions:

**Cross-scale restriction maps in biological systems.** If we accept that cognition exists at multiple scales (your position, which I take as a working assumption), what are the restriction maps between them? In what mathematical structure does a cellular cognitive state project into a tissue-level cognitive state? This is empirically hard but probably tractable for specific well-instrumented systems — planaria regeneration, embryonic bioelectric patterning. The sheaf Laplacian becomes computable from data as soon as we have candidate restriction maps.

**Morphogenetic robustness as quasiperiodic protection.** If morphogenetic fields are robust because their dynamical structure is quasiperiodic rather than periodic, this is testable via spectral analysis of bioelectric signals during development. The EDSPT framework predicts broadband / Diophantine structure rather than harmonic / periodic.

**Diverse intelligence as a problem of sheaf gluing rather than feature attribution.** The "what does this system want" question you raise in Section 6 of the Laukkonen paper is, in the sheaf framing, the question of whether the system's local navigational competencies admit a global section. Not "does it have goals" but "do its local sections glue into a coherent global section across scales." This reframes the question in a way that may be more empirically tractable than the goal-attribution question — which is famously hard and arguably under-defined.

---

The longer development of these ideas is in the corpus at draken.info — the most directly relevant posts are DRK-142 (perlocutionary cohomology of the honest encounter), DRK-125 (sheaf-theoretic analysis of totalitarian narrative), DRK-144 (Fourier identity and coherence as basis distribution), and the Sheaf Ethology pilot writeup linked from the thesis page. The thesis itself (Zenodo DOI 10.5281/zenodo.19273483, ORCID 0009-0003-8049-7167) gives the full 18-layer architecture if any of this turns out to be worth pursuing.

I will not pretend the framework is complete. I will pretend, somewhat, that it is interesting — though I would rather hear from you where it isn't.

With genuine appreciation for the Section 6 contribution in particular, which is the part of the Laukkonen paper that opens the operational question honestly,

Best regards,
Kai Khrug Roininen
draken.info


---

*Göteborg, 21 May 2026*
