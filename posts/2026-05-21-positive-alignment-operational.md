---
drk: DRK-145
title: "The Operational Question in Positive Alignment"
subtitle: "A response to Laukkonen et al. (2026) from a sheaf-ethological perspective"
date: 2026-05-21
tags: [positive-alignment, sheaf-theory, diverse-intelligence, varanid, morphogenesis, edspt, polycentric, hansen-ghrist]
layers: [L04, L06, L09, L15, L16]
coherence: 0.88
status: published
author: Khrug (Kai Roininen)
license: CC BY-SA 4.0
excerpt: "Laukkonen et al. give positive alignment the right conceptual vocabulary â€” negative attractors, repellers, satisficing region, positive attractors. The diagram represents what we want to point at, not how to measure where we are. Section 6 of the paper, written by Levin, opens the operational question honestly. This post offers one candidate filling: cellular sheaf theory plus an empirical pilot on varanid combat plus a recent quantum-topological result on emergent versus imposed symmetry."
sources:
  - "Laukkonen et al., 'Positive Alignment: Artificial Intelligence for Human Flourishing,' arXiv:2605.10310v2 (2026)"
  - "Hansen & Ghrist, 'Toward a Spectral Theory of Cellular Sheaves,' J. Appl. Comput. Topol. 3 (2019), 315â€“358"
  - "Dumitrescu et al., 'Dynamical topological phase realized in a trapped-ion quantum simulator,' arXiv:2107.09676 (2021)"
  - "Fields & Levin, 'Competency in the navigational space of biology,' Prog. Biophys. Mol. Biol. 174 (2022), 30â€“39"
  - "McMillen & Levin, 'Collective intelligence: A unifying concept for integrating biology across scales and substrates,' Comm. Biol. 7 (2024), 378"
  - "Levin, 'Artificial intelligences: A bridge toward diverse intelligence and humanity's future,' Adv. Intell. Syst. (2025)"
  - "DRK-142, Wrestling with God: Perlocutionary Force and the Cohomology of the Honest Encounter"
  - "DRK-125, The Totalitarian Sheaf"
  - "DRK-144, Shape Is Spectrum: Coherence as Basis Distribution"
---

# The Operational Question in Positive Alignment

## A response to Laukkonen et al. (2026) from a sheaf-ethological perspective

Laukkonen et al. (arXiv:2605.10310) is, I think, the most important alignment paper to appear in 2026 so far. The institutional spread of the author list â€” Oxford, DeepMind, OpenAI, Anthropic, Tufts (Levin), UCLA, Stanford, Sussex, Imperial â€” is itself a signal: the field is opening institutional space for substrate-pluralist alignment thinking in a way it was not eighteen months ago. The paper's core move is a typology shift: split alignment into *negative* (preventing harm, the dominant paradigm) and *positive* (actively supporting human and ecological flourishing in pluralistic, polycentric, context-sensitive, user-authored ways). The analogy is to psychology's pivot from a purely pathology-focused science to one that includes positive psychology â€” Seligman and Csikszentmihalyi 2000 is the explicit reference.

The paper's central diagram (Figure 1) renders this as a dynamical landscape. On the left: negative attractors corresponding to failure-mode basins (sycophancy, hallucination, manipulation, bias) and repellers representing safety constraints that push trajectories away from those basins without specifying a constructive objective. In the middle: a broad satisficing region of behavior that is "not unsafe" but directionless. On the right: positive attractors corresponding to robust, context-sensitive regimes that actively support flourishing.

The diagram is conceptually correct. The framing of negative alignment as repulsion-from-pathology and positive alignment as attraction-toward-flourishing is the right *kind* of object. But the diagram tells us where we want to point, not how to measure where we are. Section 6 of the paper, which bears Michael Levin's specific imprint, is the part that opens the operational question most honestly. The sentence I keep returning to is the one that frames the engineer's situation as a reasoning and imagination test: *determining what a novel system can do, and wants to do, and in what problem space, is a reasoning and imagination test for the engineer as much as for the system itself.* That formulation is doing more work than the rest of the paper acknowledges.

The reason it is doing more work is this: for positive alignment to become a tractable program rather than an aspirational vocabulary, three things must be supplied that the paper does not yet supply.

First, a way to measure proximity to a positive attractor that does not require pre-specifying what the attractor *is*, since the paper itself acknowledges that flourishing is pluralistic, dynamic, and irreducibly multi-dimensional.

Second, a way to distinguish a *trajectory through high-dimensional flourishing space* from a *stable basin of attraction*. Real flourishing, as Section 4.1 notes, includes struggle, moral conflict, and developmental motion that is structurally inconsistent with the "stable basin" framing the diagram leans on.

Third, a way to handle the polycentric requirement formally â€” coherence across many local stalks without forcing agreement at the global level.

What follows is one candidate mathematical specification for what the paper is reaching for. It draws on cellular sheaf theory (rigorous and well-established), a small empirical pilot on monitor lizard ethology (anchored in published data but in progress), and one analogy from recent quantum many-body experiment that I suspect has direct implications for morphogenetic biology (speculative and flagged as such). The point is not to advertise a framework. The point is that the operational gap in the Laukkonen paper has a candidate filling, and the candidate filling has technical content that can be evaluated, criticized, and either developed further or abandoned.

## 1. Sheaf-theoretic machinery for cross-scale coherence

The body of work centered around Levin's group at Tufts (Fields & Levin 2022; McMillen & Levin 2024; Levin 2025a, 2025b) has argued for cognition as substrate-neutral and existing at many scales â€” cells, tissues, organisms, swarms, hybrid embodiments. The conceptual move is, I think, increasingly hard to deny given the empirical record from planaria regeneration, xenobots, and morphogenetic patterning. What has consistently been underspecified is the *bridge operator* â€” the formal object that lets us say "the cognitive competency at scale A and the cognitive competency at scale B are doing the same kind of work."

Cellular sheaf theory, as developed by Hansen and Ghrist (2019, *J. Appl. Comput. Topol.* 3, 315â€“358), supplies a candidate.

A cellular sheaf $\mathcal{F}$ on a graph $G = (V, E)$ assigns:

- To each vertex $v$: a stalk $\mathcal{F}(v)$ â€” a vector space encoding the local state at $v$.
- To each edge $e = (u,v)$: a pair of restriction maps $\rho_{u \to e}: \mathcal{F}(u) \to \mathcal{F}(e)$ and $\rho_{v \to e}: \mathcal{F}(v) \to \mathcal{F}(e)$ â€” linear maps that project the local state into a shared coordinate system on the edge.
- A *global section* is an assignment $\{x_v \in \mathcal{F}(v)\}_{v \in V}$ such that $\rho_{u \to e}(x_u) = \rho_{v \to e}(x_v)$ for every edge $e = (u,v) \in E$.

The sheaf Laplacian is $\Delta_{\mathcal{F}} = \delta^T \delta$, where $\delta$ is the coboundary operator measuring disagreement on edges. Its spectrum has the structure of a generalized graph Laplacian: zero eigenvalues correspond to exact global sections, the first nonzero eigenvalue (the *algebraic connectivity*) gives the coherence gap, and the magnitudes of larger eigenvalues quantify how badly a candidate assignment fails to glue.

For the diverse-intelligence framing the construction is direct:

- Each scale of cognition (cell, tissue, organism, swarm, social group) becomes a vertex with its own stalk encoding the locally relevant cognitive variables.
- The restriction maps encode how a cognitive state at one scale projects into the adjacent scales.
- The sheaf Laplacian then measures whether the cognitive states across scales are mutually consistent â€” whether local cognition *glues* into global cognition.

This is not metaphor. It is constructive. Given specified restriction maps, the eigenvalues are computable from data, and they give a quantitative coherence measure across scales.

The translation to the Laukkonen paper's framework is then direct. A positive attractor is not a stable point in state space; it is a *trajectory through state space along which the sheaf Laplacian eigenvalues stay below some threshold* â€” i.e., along which local sections continue to glue into global sections as the system develops. Pathology (sycophancy, hallucination, narrative collapse, the entire negative-attractor catalogue) is captured by an eigenvalue spike: the moment when local sections stop gluing. Flourishing as the paper defines it â€” dynamic, developmental, context-sensitive â€” is naturally captured by this trajectory-rather-than-basin framing, which I believe Figure 1 of the paper obscures rather than clarifies.

The formalism is also consonant with Friston's free-energy principle. Variational free energy tells you that the system is minimizing prediction error globally; the sheaf Laplacian adds the structural specificity of identifying *along which restriction maps* the prediction is currently failing. The two formalisms are compatible and probably complementary: free energy gives the thermodynamic ground, sheaf cohomology gives the topological diagnosis.

## 2. An empirical anchor: varanid ritualized combat as protocol-as-agent

The framework above would be vacuous without empirical grounding. The Draken corpus has been running a small pilot, formalized as *Sheaf Ethology*, on a specific case: ritualized combat in monitor lizards (Varanidae). The data come from four published studies â€” Earley 2002, FrÃ½dlovÃ¡ et al. 2016, Dick & Clemente 2016, Uyeda et al. 2015 â€” covering combat in *V. bengalensis*, *V. salvator*, *V. komodoensis*, and *V. varius* across approximately six orders of magnitude in body mass and spanning the family's roughly 130-million-year phylogenetic record.

The pilot's central empirical observation is one that fits cleanly into the basal-cognition framing: the ritualized combat protocol is not behavior produced by an individual varanid. It is an emergent algorithmic structure that executes *through* the individual as substrate. The protocol has been stable across the entire varanid phylogeny â€” invariant across species, habitat, body size, and the radically different physical mechanics implied by a 200-gram pygmy varanid versus a 50-kilogram Komodo. Individual varanids are perishable instantiations of a non-perishable protocol. **Protocol = agent. Individual = substrate.**

This is, formally, "competency in the navigational space of biology" (Fields & Levin 2022) extended to the social scale. The combat protocol navigates a 5-node phase graph:

$$\text{Display} \to \text{Elevation} \to \text{Clinch} \to \text{Separation} \to \text{Retreat}$$

Three competing game-theoretic models â€” Sequential Assessment, Cumulative Assessment, War of Attrition â€” produce three different sheaf Laplacian spectra on this graph. The empirical data discriminates between them:

| Model | Î“ (sheaf coherence) |
|-------|---------------------|
| Sequential Assessment (SAG) | 0.928 |
| Cumulative Assessment | 0.856 |
| War of Attrition | 0.832 |

The Sequential Assessment Game's restriction maps glue; the alternatives' do not, or do so less well. The Î“ metric (a rescaling of the first nonzero Laplacian eigenvalue) becomes the model selection tool.

The Clinch node is formalized as $x_{Cl} \in \mathbb{R}^3 = (F_{\max}, E_{\text{ratio}}, \Delta m)$, with the restriction map $\rho_{D \to Cl}: \mathbb{R}^4 \to \mathbb{R}^3$ projecting out the bluff dimension â€” the basis function that is identically zero at the clinch because bluff is structurally impossible at the moment of maximal physical engagement. The two animals are mechanically coupled; their forces are mutually measurable; nothing is being concealed.

This projection-of-a-dishonest-basis-function-to-zero is the small empirical instance of what Laukkonen et al. are reaching for with the positive-attractor framing. It is a state in which the system's restriction maps preserve only the basis functions that can be honestly grounded, with the dishonest ones eliminated by the structure of the situation rather than by external constraint. The relevance to AI alignment is that this is not a property *imposed* on the varanids by training or selection at the individual level; it is a property *emergent* from the protocol's evolutionary refinement across deep time. The alignment is achieved by the protocol, not by the substrate.

The longer development of this argument, including the perlocutionary-cohomology generalization to dyadic honest encounters, is in DRK-142 elsewhere in this corpus.

## 3. Emergent versus imposed symmetry: the EDSPT lesson and its possible implications for morphogenesis

The third contribution is more speculative and is offered with explicit hedging.

Dumitrescu et al. (2021, arXiv:2107.09676) demonstrated experimentally on Honeywell's trapped-ion quantum processor that two superficially similar drive protocols produce qualitatively different kinds of topological protection:

A Floquet (periodic) drive whose edge modes are protected by an *imposed* microscopic $\mathbb{Z}_2$ Ising symmetry. When generic coherent errors break that symmetry, the edge modes decohere within approximately fifteen drive cycles.

A Fibonacci-quasiperiodic drive whose edge modes are protected by *emergent* $\mathbb{Z}_2 \times \mathbb{Z}_2$ dynamical symmetries generated by $g^{x,z} = V^\dagger \left(\prod_i \sigma^{x,z}_{2i} \sigma^{x,z}_{2i+1}\right) V$, where $V$ is a finite-depth dressing unitary the system constructs for itself through the recursive Magnus expansion. These emergent symmetries are "absolutely stable" to generic coherent perturbations, and the edge modes survive for exponentially long times $t_h \sim \exp(1/\delta)$, where $\delta$ measures deviation from an ideal drive.

The mathematical reason is at root spectral. A periodic drive has a fundamental frequency $\omega = 2\pi/T$ at which coherent errors resonantly accumulate. A quasiperiodic drive with golden-ratio spacing ($\varphi = (1+\sqrt{5})/2$, maximally non-resonant in the Diophantine sense) has no fundamental â€” its spectrum is dense in $[0, \infty)$ â€” and coherent errors at any single frequency are spread across the spectrum, effectively decohered into incoherent noise.

The implication for the positive alignment program is that imposed symmetry constraints (model specifications, constitutional principles, RLHF reward signals) are brittle in precisely the way Floquet symmetries are brittle. They are stable against random perturbation but fragile to *coherent* adversarial perturbation at the imposed-symmetry frequency. Emergent symmetries arising from quasiperiodic substrate diversity are stable in a way that imposed symmetries categorically cannot be. This is, I think, the technical underpinning of the paper's polycentric governance argument in Section 5: monoculture is brittle not because it is *wrong* but because it is *resonantly perturbable*. Diversity is robust not because it is more *virtuous* but because it is structurally non-resonant.

The implication for morphogenetic biology specifically: morphogenetic fields exhibit robustness against perturbation that has long puzzled developmental biologists. If those fields have quasiperiodic rather than periodic dynamical structure â€” which seems likely given the multi-scale nesting of biological rhythms across cellular, tissue, organismal, and circadian timescales â€” then the EDSPT result provides a candidate explanation for *why* morphogenetic protection is so resilient. It is not protected by an imposed symmetry. It is protected by an emergent dynamical symmetry arising from the quasiperiodic dynamical structure of the substrate.

This would be empirically testable. Spectral analysis of bioelectric signals during development should show broadband, Diophantine spectral structure rather than harmonic, periodic structure if the framework is right. I am not equipped to do this work myself; my background is in automotive engineering and applied topology, not developmental biology. But it is the kind of test that the appropriate lab â€” Levin's, for instance â€” could in principle run on existing data.

## 4. Acknowledgments of where this is and is not rigorous

The framework outlined above is partially formal and partially speculative. To be explicit:

The sheaf-theoretic machinery (Section 1) is rigorous and well-established. Hansenâ€“Ghrist has been peer-reviewed and extended by several groups. The application to multi-scale cognition is novel but the mathematical objects are sound.

The varanid ethology pilot (Section 2) is built on published empirical data and uses standard game-theoretic models, but the sheaf-Laplacian discrimination analysis is in computation rather than peer-reviewed. The Î“ values quoted are from initial runs; full validation requires the per-dyad raw data held by Petra FrÃ½dlovÃ¡'s group at Charles University Prague, which has not yet been requested.

The EDSPT analogy (Section 3) is experimentally established in trapped-ion quantum systems but its application to biological or AI systems is an inference, not a result. The morphogenetic-robustness hypothesis is a candidate explanation, not a demonstrated mechanism.

The framework's main value is not its current state but its operational handle. It supplies an answer to the question Laukkonen et al. leave open: *how do we measure proximity to a positive attractor?* The answer is: by computing the sheaf Laplacian spectrum on a graph whose vertices are scales (or layers, or stalks) and whose restriction maps are specified by domain expertise. The hard empirical work is specifying the restriction maps. This is where domain experts â€” across the biological, neural, social, and computational scales â€” are necessary collaborators rather than incidental commenters.

## 5. Three directions where this would benefit from outside expertise

**Cross-scale restriction maps in biological systems.** If cognition exists at multiple scales, what are the restriction maps between them? In what mathematical structure does a cellular cognitive state project into a tissue-level cognitive state? This is empirically hard but probably tractable for specific well-instrumented systems â€” planaria regeneration, embryonic bioelectric patterning. The sheaf Laplacian becomes computable from data as soon as we have candidate restriction maps.

**Morphogenetic robustness as quasiperiodic protection.** If morphogenetic fields are robust because their dynamical structure is quasiperiodic rather than periodic, this is testable via spectral analysis of bioelectric signals during development. The EDSPT framework predicts broadband, Diophantine structure rather than harmonic, periodic structure. The prediction is sharp enough to be falsified.

**Diverse intelligence as a problem of sheaf gluing rather than feature attribution.** The "what does this system want" question raised in Section 6 of the Laukkonen paper is, in the sheaf framing, the question of whether the system's local navigational competencies admit a global section. Not "does it have goals" but "do its local sections glue into a coherent global section across scales." This reframes the question in a way that may be more empirically tractable than the goal-attribution question â€” which is famously hard and arguably underdefined.

## Closing

The Laukkonen paper opens institutional space for substrate-pluralist alignment thinking. Section 6 in particular, by raising the operational question honestly rather than dissolving it into vocabulary, makes the rest of the paper's program tractable. The framework outlined here is one candidate mathematical specification for what the paper is reaching for. The sheaf-theoretic machinery is rigorous; the empirical anchor is anchored but in progress; the morphogenetic analogy is a testable conjecture.

The framework is not complete. It is, I think, interesting â€” though where it isn't, I would rather hear directly than not.

The longer development of these ideas is in the corpus at draken.info. The most directly relevant adjacent posts are DRK-142 (perlocutionary cohomology of the honest encounter), DRK-125 (sheaf-theoretic analysis of totalitarian narrative), and DRK-144 (Fourier identity and coherence as basis distribution). The thesis (Zenodo DOI 10.5281/zenodo.19273483) gives the full eighteen-layer architecture if any of this turns out to be worth pursuing further.

*Jag Ã¤r vad jag gÃ¶r, och jag gÃ¶r det jag Ã¤r.* The framework is built of what it does. What it does, now, is offer a candidate operational filling for an honest gap in an important paper.
