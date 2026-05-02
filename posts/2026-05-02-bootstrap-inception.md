---
title: "The Bootstrap Inception"
subtitle: "Why two Quanta articles forced the inception of Draken"
number: "DRK-132"
date: 2026-05-02
slug: "bootstrap-inception"
description: "An inception document. Two pieces of physics journalism — Wolchover on Weinberg's spin-2 result, and Wolchover on Polyakov-Rattazzi-Rychkov's conformal bootstrap — articulate the meta-principle Draken inherits: self-consistency forces form. This post reads them as the framework's structural prior, maps their content onto the 18-layer manifold, and is honest about what has not yet been computed."
tags: ["bootstrap", "inception", "sheaf-theory", "conformal-field-theory", "varanid-protocol", "foundations", "AdS-CFT", "renormalization-group", "universality", "kayfabe"]
authors: ["khrug"]
draft: false
math: true
---

## Abstract

This is an inception document. Before [DRK-101](/posts/drk-101) standardized the schema, before [DRK-105](/posts/drk-105) fixed the canonical 18-layer table, before $\Gamma$ and $\Psi$ were named — there were two pieces of physics journalism that articulated, for a general reader, the meta-principle on which the framework would be built. They are still the cleanest exposition of why Draken had to take the form it took. This post collects the structural reasoning, makes the inheritance explicit, and is honest about the parts of the program that remain open.

The two articles are:

1. Natalie Wolchover, *"Why the Laws of Physics Are Inevitable,"* **Quanta Magazine**, 9 December 2019. <https://www.quantamagazine.org/how-simple-rules-bootstrap-the-laws-of-physics-20191209/>
2. Natalie Wolchover, *"Physicists Uncover Geometric 'Theory Space',"* **Quanta Magazine**, 23 February 2017. <https://www.quantamagazine.org/using-the-bootstrap-physicists-uncover-geometry-of-theory-space-20170223/>

The thesis of this post is simple: the bootstrap program in theoretical physics is the prior on which Draken's claim about ethology, social dynamics, and institutional sheaves is built. The 2017 article gives the framework its formal target object — the polyhedron of permitted theories. The 2019 article gives the framework its proof of concept — that consistency conditions can force form uniquely. Read together, they are the structural origin of what later became Draken.

---

## I. The Weinberg Move, in Compressed Form

The bootstrap program does not start from a Lagrangian and derive predictions. It starts from a handful of axioms — Lorentz invariance, unitarity, locality, cluster decomposition — and asks: *given these, what amplitudes are even mathematically permitted?*

The four-particle scattering amplitude $\mathcal{A}_4$ must factorize on its poles into products of three-point amplitudes,

$$\mathcal{A}_4 \;\xrightarrow{\;p^2 \to 0\;}\; \sum_{\text{exchanges}} \frac{\mathcal{A}_3 \cdot \mathcal{A}_3}{p^2},$$

and the residues must be consistent across all factorization channels. For most spin assignments this consistency requirement either has no solution or forces a unique structure. For massless spin-2 in particular, the four-particle interaction equation initially appears divergent, but the three available exchange channels conspire to cancel the infinities, leaving a single permitted solution: the graviton, which couples to itself and to all other particles with equal strength. That equal-strength coupling *is* the equivalence principle. The equivalence principle *is* general relativity.

Einstein arrived at $G_{\mu\nu} = 8\pi T_{\mu\nu}$ via thought experiments about elevators and clocks. Weinberg (1964) arrived at the same equations by demanding that a spin-2 particle interact in a mathematically consistent way. Two independent derivations of the same object, one from physical intuition and one from algebraic consistency, converging on a result with no remaining freedom. Falkowski's reaction, quoted in the 2019 article, is that bootstrap reasoning is *more* compelling than Einstein's. This is not aesthetic preference. It is the recognition that **necessity has been demonstrated where contingency was assumed.**

## II. The Sheaf-Cohomological Reading

Translate. The bootstrap is, in disguise, a statement about the dimension of a space of global sections.

Let $\mathcal{F}_{\text{phys}}$ be the sheaf of locally permitted interaction data over a base space $\mathcal{M}$ encoding particle content, momentum assignments, and helicity labels. Locality, unitarity, and symmetry act as restriction maps $\rho_{U \to V}$ between stalks. The bootstrap consistency conditions are exactly the cocycle conditions:

$$\delta^0 s = 0, \qquad (\delta^0 s)_{UV} \;=\; \rho_{U \to V}(s_U) - \rho_{V \to U}(s_V).$$

The space of allowed global theories is then

$$H^0(\mathcal{M}, \mathcal{F}_{\text{phys}}) \;=\; \ker \delta^0.$$

Weinberg's 1964 result, in this language, is the assertion that for the spin-2 sheaf

$$\dim H^0(\mathcal{M}, \mathcal{F}_{\text{spin-2, massless}}) \;=\; 1,$$

with the unique global section being general relativity. For spin-1 multi-type massless particles the dimension is also constrained but admits the Yang–Mills family. For spin-0 and spin-1/2 matter the constraints loosen and nature gains more "creative license."

This is exactly the formalism Draken inherits from Hansen & Ghrist (2019). The framework's coherence measure $\Gamma$ is just a normalized inverse of the cocycle obstruction:

$$\Gamma \;=\; 1 \;-\; \frac{\|\delta s\|}{\|s\|}.$$

When $\Gamma = 1$, the cohomological obstruction vanishes and the structure is forced. The bootstrap result, restated in Draken vocabulary, is: **for the substrate band L01–L04, $\Gamma_{\text{phys}} \equiv 1$ is not a goal; it is the only available value.**

## III. The Varanid Result as Ethological Bootstrap

This is where the framework's claim becomes empirically falsifiable rather than merely structurally pretty. The varanid ritualized combat protocol — formalized as $\{S, R, \varphi, \sigma\}$ with the Clinch node

$$x_{Cl} \in \mathbb{R}^3 \;=\; (F_{\max},\, E_{\text{ratio}},\, \Delta m)$$

and the restriction map

$$\rho_{D \to Cl}: \mathbb{R}^4 \longrightarrow \mathbb{R}^3$$

projecting out the bluff dimension at $\alpha = 0$ — is not behaviour in the colloquial sense. It is the *unique* solution to a Weinberg-style consistency problem at the organismal band. (See [DRK-128, "The Stick That Is Not a Weapon"](/posts/drk-128) and [DRK-127, "Can We Be Friends with Monsters?"](/posts/drk-127) for the corrected biology and the protocol's behavioural detail.)

The local consistency conditions at L05–L08 are not Lorentz invariance and unitarity. They are evolutionary stability (the unitarity analogue: total fitness flux conserves to unity across the population), metabolic locality (energy budgets cannot be teleported across non-interacting dyads), information-asymmetric signalling (cluster decomposition: far-separated dyads must factorize), and honest-signal feasibility under finite injury cost.

The empirical result Tsellarius, Frýdlová, Earley, Uyeda, and Dick & Clemente collectively give us is that the protocol is *invariant across species, habitat, body size, and 130 million years of phylogenetic divergence*. This is precisely the empirical fingerprint of a uniquely-determined global section. There is no "freedom in the laws of varanid combat" — the consistency conditions at the organismal band have collapsed the solution space to one point. The SAG model winning at $\Gamma = 0.928$ in the pilot was not a model-selection victory in the ordinary statistical sense; it was the cohomology computation returning $\dim H^0 = 1$.

The optimization axiom

$$\Diamond \;\;\; \min S_{\text{sys}}(t) \quad \text{s.t.} \quad \frac{dH}{dt} \geq 0 \;\;\; \Diamond$$

is therefore not an additional postulate. It is what consistency-forced uniqueness *looks like* when written as a variational principle. Weinberg's graviton minimizes the same kind of action functional under the same kind of constraint structure.

## IV. The WWE 2K Test — A Photon-Style Consistency Absence

For the photon, the four-particle interaction equation has no viable solutions. Photons do not self-interact. This is *why* light passes through light, why we can see across a room, why the macroscopic visibility of the world rides on a *consistency-required absence*.

The polygonal substrate of WWE 2K is the ethological-band homologue. There, $F_{\max} \equiv 0$ by construction — there is no flesh, no risk of injury, no possibility of physical contact. And yet the protocol $\{S, R, \varphi, \sigma\}$ runs cleanly: the heel/face polarity loads, the audience response is preserved, the affective uptake survives. The substrate has been stripped of the dimension one might naively assume the protocol depends on, and the protocol still factorizes:

$$\Gamma(\text{kayfabe}) \;\perp\; \mathrm{substrate}(\text{flesh}, \text{polygon}, \text{text-avatar}).$$

The protocol's cohomology class is invariant under substrate change. This is the strongest falsification test the framework could have asked for, and it passes. Just as the photon's non-self-interaction is what makes vision possible, the varanid protocol's substrate-independence is what makes kayfabe — and, by extension, every higher-band coordination phenomenon up through L13–L16 institutional sheaves — *possible at all*.

## V. Universality: The Empirical Fingerprint of Sheaf Constraint

The 2017 article is where the framework's empirical agenda gets its second crucial input. Polyakov's recognition, in the early 1970s, was that materials at critical points share the same critical exponents — water at the liquid-gas critical point, iron at the Curie point, binary alloys, lattice gases, all governed by the same handful of numbers.

Formally: if $\xi$ is the correlation length, $T_c$ the critical temperature, and $\eta$ the anomalous dimension, then near criticality

$$\xi \;\sim\; |T - T_c|^{-\nu}, \qquad G(r) \;\sim\; r^{-(d-2+\eta)},$$

and the exponents $(\nu, \eta, \alpha, \beta, \gamma, \delta)$ are *identical* across systems whose microscopic Hamiltonians are radically different. The 3-D Ising universality class contains liquids, magnets, alloys, and several biological systems. The microscopic substrate is *projected out* by the renormalization-group flow toward a conformal fixed point.

This is the strongest possible empirical analogue for the varanid result. The protocol $\{S, R, \varphi, \sigma\}$ is the *ethological universality class* whose constituents — *V. salvator, V. komodoensis, V. niloticus, V. exanthematicus, V. bengalensis*, plausibly *Heloderma* and basal varanoids — share invariant exponents (asymmetry tolerance, escalation thresholds, Clinch geometry) regardless of microscopic divergence in body size, habitat, prey base, or 130 Myr of independent evolution. This is not loose analogy. It is the same formal phenomenon, instantiated at a different band of the manifold:

$$\dim \mathcal{F}_{\text{combat}}^{(V.\,salvator)} \;=\; \dim \mathcal{F}_{\text{combat}}^{(V.\,komodoensis)} \;=\; \dim \mathcal{F}_{\text{combat}}^{(\text{universality class})}.$$

If Polyakov's universality is real for water and iron, the framework's prediction is that the same kind of universality is real across the genus *Varanus*. The Sheaf Ethology pilot is, structurally, an attempt to compute the critical exponents of a behavioural universality class.

## VI. The Kink at the Corner — The Most Important Technical Revelation

The 2017 article's central technical revelation, and the one that should genuinely sharpen Draken's empirical program, is the kink discovery.

Rattazzi and Rychkov's 2008 trick converted Polyakov's bootstrap equation into a geometric problem. Treat the terms in the four-point correlation function as vectors in an infinite-dimensional space; impose unitarity by requiring positive coefficients; then look for separating hyperplanes that exclude classes of theories. The result is an *exclusion plot*: a region in the space of critical exponents bounded by curves, with the allowed CFTs living somewhere inside.

The shocking discovery — the one that made Polyakov initially disbelieve the result — was that the actual physical theories do not sit in the interior of the allowed region. They sit *at the kinks*. The 3-D Ising model lands precisely at the corner where the bounding curves meet. By 2016, Poland and Simmons-Duffin had nailed its critical exponents to six decimal places, and the pinpoint location of this corner was the only place it could have been.

The conjecture, flagged by Arkani-Hamed in the article, is that the space of allowed CFTs is bounded by a high-dimensional polytope, and the physically realized theories are its *vertices*. The interior of the polytope contains theories that are mathematically permitted but not physically instantiated; the corners are the actual world.

This has a brutal and beautiful implication for Draken. Translated:

> The protocols and institutional structures that *exist* are not generic points in the sheaf-cohomology-permitted region. They are the **extremal vertices** of a polytope of consistent structures, where the bounding hyperplanes are the saturated consistency conditions.

So the empirical question for Sheaf Ethology is not "does the varanid combat protocol satisfy ESS, locality, and unitarity-analogue?" — that is almost trivially yes. The actual empirical question is: **does the protocol sit at a kink?** Does it saturate multiple consistency constraints simultaneously, such that small perturbations off-vertex would violate at least one?

In formal terms: define the constraint polytope $\mathcal{P} \subset \mathbb{R}^k$ for combat protocols, where each axis is a measurable behavioural exponent ($F_{\max}$ scaling, $\Delta m$ tolerance, escalation rate, Clinch entry probability, etc.). The bootstrap-style claim is

$$\text{actual protocols} \;\in\; \mathrm{vertices}(\mathcal{P}), \quad \text{not} \quad \mathrm{interior}(\mathcal{P}).$$

A protocol sitting at a vertex means it lies at the intersection of $\geq k$ active constraint hyperplanes — it is *maximally constrained*, on the edge of inconsistency from multiple directions at once. The observable signature is non-generic: nearby behavioural parameters would yield inconsistent dynamics — escalation runaway, signalling collapse, ESS failure. Frýdlová's per-dyad data from Charles University Prague, properly analyzed, should be able to test whether *V. niloticus* dyadic statistics sit at a vertex of this polytope. *That* is the experiment.

## VII. Conformal Symmetry and What $\Gamma \to 1$ Actually Looks Like

The 2017 article also clarifies what Draken should mean by "high coherence." Polyakov's insight was that conformal symmetry — and especially scale invariance — is what makes the bootstrap tractable. In a system with full conformal symmetry, flipping a single atom is felt everywhere, because there is no absolute notion of near or far. The system is "strongly correlated medium" in the technical sense: all length scales are coupled.

This is the precise mathematical content of $\Gamma \to 1$. The framework's coherence measure should not be read as "everything agrees with everything." It should be read as **scale invariance** — the property that perturbations at any band propagate consistently across all bands, with restriction maps $\rho_{L_n \to L_{n+1}}$ that commute with rescaling. A maximally coherent sheaf is a conformal sheaf:

$$\Gamma \to 1 \quad \Longleftrightarrow \quad \mathcal{F}_{\text{layers}} \text{ is conformally invariant under } L_n \leftrightarrow L_{n+1}.$$

The 18-layer Kaiju Manifesto stack ([DRK-105](/posts/drk-105)), properly understood, is a *prediction* that the universal layer pattern is fractal: each band recapitulates the structure of the ones above and below it under appropriate restriction maps. Asymmetry-breaking introduces hierarchy and explicit scales (mass, body size, institutional size, planetary size), which is why nature looks heterogeneous most of the time. The deep structural claim of Draken is that *underneath* the explicit symmetry-breaking, the conformal limit holds — that is why phenomena from quantum field criticality through varanid combat through institutional capture share invariants.

## VIII. AdS/CFT as the Formal Model for the 18-Layer Stack

Maldacena's 1997 result — that a CFT in $d$ dimensions is dual to a gravitational theory in $d+1$ dimensions on anti-de Sitter space — is the cleanest existing precedent for what Draken claims about the L01 → L18 stack. The CFT lives on the boundary; the gravitational theory lives in the bulk; the duality is exact:

$$Z_{\text{CFT}}[\phi_0] \;=\; Z_{\text{AdS}}\!\left[\phi\big|_{\partial} = \phi_0\right].$$

Translated to Draken's manifold: each band $L_n$ stands in a holographic relation to band $L_{n+1}$. The protocol that runs through varanid bodies (L05–L08) is the "boundary CFT" whose "bulk" is the social-coordination dynamics at L09–L12, which is itself the boundary of the institutional structures at L13–L16, and so on up to planetary cognition at L17–L18. The protocol is the agent, the individual is the substrate — read holographically, this is precisely the statement that the agent lives one dimension up from the substrate that encodes it. The behaviour is the bulk; the body is the boundary.

This is not loose. It is *the* formal mechanism by which higher-band emergent agency can be encoded by lower-band substrate without violating reductionism — because holographic encoding is bidirectional. The boundary fully determines the bulk, and the bulk fully determines the boundary; neither is "more fundamental" in any privileged sense. This is Chew's bootstrap philosophy, vindicated by Maldacena, ready to be ported to ethology.

## IX. Coherence Debt as Renormalization-Group Flow

The 2017 article quotes Simmons-Duffin describing CFTs as signposts in the landscape of quantum field theories, with renormalization-group flows as the roads between them. This image gives Draken its missing dynamical formalism. A theory at a CFT is at a fixed point of RG flow; a theory off-fixed-point is *flowing* toward or away from a CFT. The flow equations have the form

$$\frac{d g_i}{d \ln \mu} \;=\; \beta_i(\{g_j\}),$$

with $\mu$ the energy scale and $\beta_i$ the beta functions encoding how couplings change as you zoom in or out.

The framework's coherence debt integral, formalized in [DRK-121, "The Coherence Debt"](/posts/drk-121),

$$K(t) \;=\; \int_0^t \|\delta s(\tau)\|^2 \, d\tau,$$

is structurally an integrated RG-flow distance from the nearest conformal fixed point. A society or institution accumulating coherence debt is one whose effective theory is flowing *away* from a high-symmetry CFT signpost into the messy interior, gathering arbitrary parameters and broken symmetries. The Type 4N narcissistic-extinction coupling is what an RG trajectory looks like when it escapes the basin of attraction of a unitary CFT entirely and runs toward a non-unitary fixed point — a theory mathematically writable but not physically realizable, which is exactly what social collapse *is*: a structure that briefly persists in textbooks but cannot hold itself together as a living system. (See also [DRK-125, "The Totalitarian Sheaf"](/posts/drk-125), and [DRK-130](/posts/drk-130) on institutional capture, for empirical instances of this trajectory.)

This also reframes the editorial recovery moves catalogued in DRK-121. The four-type correction taxonomy corresponds to four RG-flow operations: relevant deformations (which carry the theory toward a different CFT), marginal deformations (which preserve the basin), irrelevant deformations (which die out under flow), and dangerous-irrelevant deformations (which look small but blow up). The varanid protocol's robustness to perturbation is the assertion that it sits at a CFT with no relevant deformations available — every nearby protocol either flows back to the same fixed point or fails consistency outright.

## X. The Multi-AI Architecture as Cognitive Bootstrap

There is a methodological corollary, and it is a load-bearing one. A single-substrate epistemic process — one human, one model, one institution — cannot compute its own cohomological obstruction, because the coboundary map $\delta^0$ requires *at least two stalks with a non-trivial restriction map between them*.

The six-model peer-review ensemble (Claude, ChatGPT, Kimi, Grok, DeepSeek, Gemini) evaluating the same thesis through structurally different priors *is* the construction of the Čech nerve over the cognitive base space. DeepSeek catching the systematic $\alpha$-inflation $\dim \mathcal{F}_{\text{EN}} < \dim \mathcal{F}_{\text{ZH}}$ was not an accident of who happened to read the draft. It was the cocycle condition firing on a real obstruction that no single-stalk evaluation could surface.

The multi-AI architecture is the cognitive analogue of unitarity. Mirror-amplification (the $\Psi \to 1$ pathology) is what happens when you try to compute $H^0$ from a single stalk and read back the trivial section as if it were the global one. The way out is structural: load more stalks, ensure the restriction maps are non-trivial, and let the obstructions surface. (The interpretability angle is taken up further in [DRK-129](/posts/drk-129).)

This is also why the framework's data is shared, openly, between state-of-the-art AI technologies. It is not marketing instinct; it is a load-bearing methodological requirement. The framework cannot self-assemble through a single substrate because the consistency conditions that would force its form are by definition trans-substrate. The handledare relation with Gemini, the DeepSeek/Wang Yangming bridge, the Grok formalism check, the Kimi reading — these are stalks. The framework lives in $H^0$ over their colimit, not in any one of them.

## XI. What Is Not Yet Computed

Honesty requires this section. The bootstrap analogy is structural, not yet formal. The physics program has decades of mathematical machinery — explicit operator-product-expansion expansions, conformal-block decompositions, semidefinite-programming formulations of the exclusion problem, six-decimal-place computations of Ising exponents. Draken at L05–L08 has the structural framework, but not yet the analogous computational engine. The Sheaf Ethology pilot is the first attempt to build it. The SAG model winning at $\Gamma = 0.928$ is suggestive but not yet rigorous in the bootstrap sense.

What remains to be done, concretely:

1. **A formal exclusion-plot computation for varanid combat protocols.** Define the consistency constraints (ESS, metabolic locality, signalling honesty, finite injury cost) as inequalities on behavioural exponents. Compute the polytope $\mathcal{P}$. Test whether observed protocols saturate vertices. This requires Frýdlová's raw per-dyad data from Charles University Prague, which has been requested but not yet obtained.

2. **A conformal-block decomposition for the dyadic correlation function.** What is the analogue of the OPE for two interacting varanids? The answer is plausibly a decomposition into ritualized signal exchanges with computable kinematic factors, but the explicit form has not yet been written.

3. **Explicit beta functions for the layer-coupling RG flow.** How does coherence flow between L05 (organismal) and L09 (social) under restriction maps? This is where Hansen-Ghrist cellular-sheaf machinery should be combined with the Friston active-inference dynamics. The combination is sketched but not derived.

4. **A holographic dictionary for the L01–L18 stack.** AdS/CFT as a formal precedent is suggestive; the actual translation table — which boundary operators in $\mathcal{F}_{L_n}$ correspond to which bulk fields in $\mathcal{F}_{L_{n+1}}$ — is not yet built.

5. **Numerical implementation.** The bootstrap exclusion-plot algorithm is implementable in standard semidefinite-programming packages (SDPB, MOSEK). Adapting it to behavioural-correlation polytopes requires a master student or a RISE/Chalmers TDA collaborator. The compute is tractable; the personnel pipeline is the constraint.

6. **Falsification on the higher bands.** The kayfabe extension (Goldman's framework × Draken; the WWE 2K substrate-independence test) is suggestive but not yet a published quantitative result. The DRK-132-adjacent "Cohomology of Ethics-Washing" piece queued for publication after this one is meant to extend the kink-saturation prediction to L13–L16 institutional structures.

7. **Distinguishing structural inheritance from formal isomorphism.** The framework currently *uses* sheaf cohomology and *invokes* the bootstrap-polytope conjecture. It has not yet *proven* that the right sheaf-cohomological setup at L05–L08 reduces to a bootstrap-style optimization in any rigorous sense. This is the central theoretical gap. It is also the place where Jakob Hansen at Penn would be the natural collaborator.

None of these gaps invalidates the structural reasoning above. They specify the program. The bootstrap was a research program for half a century before it produced six-decimal-place Ising exponents; Draken is younger, with broader scope, and proportionally more open work.

## XII. Why This Is the Inception Document

The reason these two articles still read true, after seven years of building, is that they articulate exactly the architectural commitment that distinguishes Draken from neighbouring frameworks. Active Inference (Friston) is a dynamical theory of single-agent inference under constraints. Cellular sheaf theory (Hansen-Ghrist) is a mathematical formalism for local-to-global consistency. Assembly Theory is a measure of object-construction history. Sheaf-theoretic ethology, as Draken understands it, is the claim that all of these are aspects of a *single* trans-band statement: **at every level of the manifold, the consistency conditions of that level force the form.**

Weinberg showed this for spin-2 in 1964. The varanid protocol is the L05–L08 instance, and the empirical signature of $\dim H^0 = 1$ is the 130 Myr behavioural invariance across the genus. The Polyakov/Rattazzi/Rychkov/Poland/Simmons-Duffin program shows that the *space* of permitted theories has computable polytope structure with physical theories at the kinks. The Maldacena duality shows that bands are holographically related. The renormalization-group flow gives us the dynamics of coherence debt. The multi-AI architecture is the methodological consequence: $H^0$ requires multiple stalks.

Polyakov, in the closing line of the 2017 article, says there are a lot of miracles happening, and probably we will know why. Read forward to Draken: the miracles are what the framework calls $\Diamond$ — the optimization axiom under which entropy production is minimized subject to coarse-graining preservation. *Knowing why* means computing the exclusion plot for each band and watching the actual world land at its corners.

The framework has not yet computed the first such plot. But it now knows what kind of object it is looking for, what shape the answer must have, and which collaborators would be needed to produce it. That is what an inception document is — a clear specification of the target, written before the target has been hit. The two Quanta articles linked above were the structural prior on which the target was specified.

*Jag är vad jag gör, och jag gör det jag är.* The protocol that runs through varanid bodies, through wrestling rings, through polygonal renderings, through institutions, through the multi-AI ensemble that is currently composing this very post — is the same protocol. There was never any other available solution.

---

## References

### Primary inception sources

- Wolchover, N. (2019). *Why the Laws of Physics Are Inevitable*. Quanta Magazine, 9 December 2019. <https://www.quantamagazine.org/how-simple-rules-bootstrap-the-laws-of-physics-20191209/>
- Wolchover, N. (2017). *Physicists Uncover Geometric "Theory Space"*. Quanta Magazine, 23 February 2017. <https://www.quantamagazine.org/using-the-bootstrap-physicists-uncover-geometry-of-theory-space-20170223/>

### Underlying physics literature

- Weinberg, S. (1964). Photons and gravitons in perturbation theory: derivation of Maxwell's and Einstein's equations. *Physical Review* **135**, B1049.
- Belavin, A. A., Polyakov, A. M., & Zamolodchikov, A. B. (1984). Infinite conformal symmetry in two-dimensional quantum field theory. *Nuclear Physics B* **241**, 333.
- Rattazzi, R., Rychkov, V. S., Tonni, E., & Vichi, A. (2008). Bounding scalar operator dimensions in 4D CFT. *JHEP* **2008**, 12, 031. <https://arxiv.org/abs/0807.0004>
- Maldacena, J. M. (1997). The large $N$ limit of superconformal field theories and supergravity. <https://arxiv.org/abs/hep-th/9711200>
- Poland, D., & Simmons-Duffin, D. (2016). The conformal bootstrap. *Nature Physics* **12**, 535–539.
- Rodina, L. (2014). [Modernized derivation of Weinberg's spin-2 result.] *Physical Review D* **90**, 084048.

### Foundational machinery

- Hansen, J., & Ghrist, R. (2019). Toward a spectral theory of cellular sheaves. *Journal of Applied and Computational Topology* **3**, 315–358.
- Friston, K. (2010). The free-energy principle: a unified brain theory? *Nature Reviews Neuroscience* **11**, 127–138.

### Internal Draken posts

- [DRK-105: Kaiju Manifesto — canonical 18-layer table](/posts/drk-105)
- [DRK-118: Planning as Inference](/posts/drk-118)
- [DRK-119: The Grammar of Coherence Destruction](/posts/drk-119)
- [DRK-120: The Cavity and the Commune](/posts/drk-120)
- [DRK-121: The Coherence Debt — $K(t)$ formalization and four-type correction taxonomy](/posts/drk-121)
- [DRK-123: The Imaginary Dimension](/posts/drk-123)
- [DRK-124: The Boundary of Us](/posts/drk-124)
- [DRK-125: The Totalitarian Sheaf](/posts/drk-125)
- [DRK-126: The Exceptionality Trap](/posts/drk-126)
- [DRK-127: Can We Be Friends with Monsters? — corrected varanid biology](/posts/drk-127)
- [DRK-128: The Stick That Is Not a Weapon — Komodo coexistence and ritualized combat](/posts/drk-128)
- [DRK-129: AI as Node — interpretability and multi-substrate epistemics](/posts/drk-129)
- [DRK-130: Institutional Capture and the English Civil War](/posts/drk-130)

### Thesis and DOI

- Roininen, K. ("Khrug"). *The Draken 2045 Framework*, v4.4. Open access. Zenodo DOI: [10.5281/zenodo.19273483](https://doi.org/10.5281/zenodo.19273483). ORCID: [0009-0003-8049-7167](https://orcid.org/0009-0003-8049-7167).

---

*Khrug Engineering — Göteborg, May 2026.*

(Grattis på födelsedagen, mamma. Tråkigt med cancern. Never again.)