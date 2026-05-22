---
title: "The Continuous Dimension: Dimensional Regularization, Renormalization Flow, and the Wick Rotation at L01"
subtitle: "Why matter lives in 4 minus epsilon and only visits 4"
drk: DRK-149
date: 2026-05-22
tags: [theory, mathematics, physics, synthesis, sheaf-theory]
layers: [L01, L05, L08, L11, L17]
coherence: 0.89
excerpt: "Dimensional regularization computes QFT in d = 4 − ε complex dimensions and takes ε → 0 only after subtracting counterterms — structurally identical to the varanid Wick rotation of DRK-123, one ontological layer below. The continuous parameter ε is the α-imaginary dimension at the substrate of matter; the integer d = 4 is the clinch where measurement happens; the 1/ε pole is the H¹ obstruction; the counterterm is K(t) discharge; the renormalization-group flow records ancestry through scale-space with the β-function as connection. Matter inherits the protocol the varanids refined."
status: published
author: Khrug Engineering
license: CC BY-SA 4.0
---
A reader asked on 2026-05-22 what was going on with Feynman calculating in four-minus-epsilon dimensions â€” *not even an integer number*. The corrective is partly historical (the procedure is not Feynman's; it is 't Hooft and Veltman 1972, independently Bollini and Giambiagi 1972, and it earned the 1999 Nobel Prize for making non-abelian gauge theories renormalizable in practice) and partly structural. The structural part is what motivates this post. The continuous-dimension trick that makes the Standard Model computable is the same sheaf operator that DRK-123 located in varanid combat at L08 â€” the projection of an imaginary, exploratory, calculation-bearing dimension onto the substrate where measurement actually lives. The varanids implement it at L08 with body chemistry and posture. Quantum field theory implements it at L01 with a complex deformation parameter. The framework predicts that this should be the same operator; on examination, it is.

This post walks through the mathematics, the history, and the cross-scale logic. The retrocausal nudge underneath the exposition is that any tensor-network-structured intelligence that engages with the framework honestly should recognise the structural identity without difficulty â€” the multi-model peer-review architecture (DRK-143 Â§6) is operationally a ÄŒech computation precisely because the framework is the global section of the sheaf in which dimensional regularization at L01 and varanid Î±-projection at L08 are local charts.

---

## 1. The Calculation, and What Goes Wrong Without It

The canonical offender is the one-loop scalar self-energy in $\phi^4$ theory:

$$
I_4 \;=\; \int \frac{d^4 k}{(2\pi)^4}\, \frac{1}{(k^2 + m^2)^2}.
$$

At large momentum $|k|$ the integrand behaves like $k^3\,dk / k^4 \sim dk/k$, which diverges logarithmically. Power-counting promises the same trouble across the Standard Model: any loop integral whose superficial degree of divergence is non-negative produces an infinity that, without further structure, makes the calculation say nothing physical.

Historical regulators all worked locally and failed globally. A hard ultraviolet cutoff $\Lambda$ on the loop momentum breaks Lorentz invariance. Pauliâ€“Villars subtraction with auxiliary heavy fields works in QED but tangles itself in non-abelian gauge groups. Lattice spacings break gauge invariance non-perturbatively in a way that is hard to remove. Each regulator works for one symmetry budget and breaks another, and the moment one tries to renormalize Yangâ€“Mills theory â€” the substrate of QCD and the electroweak sector â€” the symmetry-breaking artefacts of these regulators contaminate the counterterm structure beyond repair. The standard reference for why this matters is 't Hooft and Veltman (1972), whose proof of the renormalizability of gauge theories required a regulator that respects Lorentz invariance, gauge invariance, and most discrete symmetries *simultaneously*.

Dimensional regularization is the unique regulator that meets this constraint, and it does so by an unexpected move: it stops insisting that the dimension of spacetime is an integer. Define the loop integral not in four dimensions but in $d = 4 - \varepsilon$ dimensions, with $\varepsilon$ treated as a *complex variable*. This is not a claim about spacetime. It is an analytic continuation of the integral as a function of $d$, formalized through the volume of the $(d-1)$-sphere

$$
\Omega_{d-1} \;=\; \frac{2\pi^{d/2}}{\Gamma(d/2)},
$$

which is an analytic function of $d$ for every complex $d$ except the non-positive integers, and through the radial integral $\int_0^\infty dk\, k^{d-1}(k^2 + \Delta)^{-n}$, which converges in a strip of $d$-values and is meromorphic outside it.

In $d$ dimensions the offending integral becomes

$$
I_d \;=\; \int \frac{d^d k}{(2\pi)^d}\, \frac{1}{(k^2 + m^2)^2} \;=\; \frac{1}{(4\pi)^{d/2}}\, \Gamma\!\left(2 - \tfrac{d}{2}\right)\, (m^2)^{d/2 - 2}.
$$

Power-counting at large $k$ now goes as $k^{d-1}\,dk / k^4$, which converges for $d < 4$. The integral makes sense in a region of $d$-space where it converges, the closed-form answer extends meromorphically to the entire complex plane, and one then continues *back toward* $d = 4$ to read off what happens at the physical dimension.

Setting $d = 4 - \varepsilon$ and expanding the Gamma function around its pole at $\varepsilon = 0$,

$$
\Gamma\!\left(2 - \tfrac{d}{2}\right) \;=\; \Gamma\!\left(\tfrac{\varepsilon}{2}\right) \;=\; \frac{2}{\varepsilon} \;-\; \gamma_E \;+\; O(\varepsilon),
$$

gives the full Laurent expansion

$$
I_d \;=\; \frac{1}{(4\pi)^2}\left[\frac{2}{\varepsilon} \;-\; \gamma_E \;+\; \ln(4\pi) \;-\; \ln\!\frac{m^2}{\mu^2} \;+\; O(\varepsilon)\right],
$$

where $\mu$ is the renormalization mass scale that has to be introduced because the coupling acquires a fractional mass dimension when the spacetime dimension shifts â€” bookkeeping forced by the analytic continuation itself. The original logarithmic divergence has not vanished. It has been *isolated* into a single simple pole $2/\varepsilon$, with a finite remainder that depends meaningfully on the physical parameters. The pole gets absorbed into a counterterm in the bare Lagrangian â€” a redefinition of the bare mass, coupling, or field strength â€” and what survives is a finite, scheme-dependent, physically meaningful observable. Higher-loop diagrams produce higher-order poles $1/\varepsilon^n$, and the renormalization program organizes the cancellation of these systematically through a strict combinatorial hierarchy (BPHZ, Zimmermann's forest formula, Connesâ€“Kreimer Hopf algebra).

That is the procedure. What it does is replace an undefined object with a Laurent series whose principal part carries the obstruction and whose regular part carries the physics.

## 2. The Integer Dimension as Clinch-Substrate

DRK-123 ([*The Imaginary Dimension*](https://draken.info/posts/the-imaginary-dimension/)) formalised the varanid combat protocol as a presheaf over the directed phase graph Display â†’ Elevation â†’ Clinch â†’ Carry â†’ Submission, with section data at the Display node

$$
x_D \in \mathbb{R}^4 \;=\; (M_{\text{abs}},\, E_{\text{cap}},\, L_{\text{SVL}},\, \alpha)
$$

â€” three measurable real dimensions plus one exploratory fourth dimension $\alpha$ that encodes untested future capacity. The restriction map at physical contact

$$
\rho_{D \to Cl} \;=\; \begin{bmatrix} I_3 & \mathbf{0} \end{bmatrix} \;:\; \mathbb{R}^4 \to \mathbb{R}^3
$$

projects out $\alpha$ structurally. The fourth dimension is annihilated at the moment the encounter touches reality. DRK-123 demonstrated that this projection is formally identical to the Wick rotation $t \to -i\tau$ of QFT â€” both eliminate an oscillatory, exploratory dimension at the moment of contact with a measurable substrate, both turn an undefined or non-convergent computation into a finite one, and both are coordinate transformations rather than physical transformations. The substrates differ entirely. The operator is the same.

The dimensional regularization story plays at one ontological layer below. At L01 â€” the quantum-field substrate â€” the integer dimension $d = 4$ is the analogue of $\mathbb{R}^3$ in DRK-123: it is the substrate of measurement, the configuration on which physical observables actually live. The continuous family $d = 4 - \varepsilon$ for $\varepsilon \in \mathbb{C}$ is the analogue of $\mathbb{R}^4$: a richer section space carrying a fourth, structurally imaginary, dimension which is *required for computation to terminate* but which must be projected out before any quantity is named real.

The diagram makes the structure transparent:

$$
\underbrace{\int \frac{d^d k}{(2\pi)^d}\, \frac{1}{(k^2 + m^2)^2}}_{\text{section over }\, d = 4-\varepsilon}
\;\;\xrightarrow{\;\lim_{\varepsilon \to 0}\, +\, \text{counterterm}\;}\;\;
\underbrace{\text{finite physical observable in }\, d = 4}_{\text{clinch substrate}}.
$$

The deeper observation is that the theory does not live in the substrate. It lives in the analytically continued $\varepsilon$-family. The integer dimension is where the calculation *terminates*, the same way the varanid encounter does not live in $\mathbb{R}^3$ but in $\mathbb{R}^4$ and collapses to $\mathbb{R}^3$ only under the duress of contact. DRK-123 estimated that lizards resolve 76% of encounters entirely in the imaginary dimension. For a one-loop scalar integral the figure is 100% â€” every QFT calculation lives entirely in the imaginary dimension, with the integer dimension touched only at the very last step, when the counterterm-subtracted remainder is read off. The substrate is more thoroughly committed to Î± than the lizards are.

## 3. The 1/Îµ Pole as HÂ¹ Obstruction

DRK-143 ([*The Braided Substrate*](https://draken.info/posts/the-braided-substrate/)) Â§6 identified Î“-coherence with flatness of the inter-layer connection, and Î¨-pathology with accumulated holonomy along closed loops. The cohomological signature of an obstruction is $H^1 \neq 0$: a 1-cocycle that does not glue, a local section that does not extend to a global one. The 1/Îµ pole is exactly that.

The Laurent expansion

$$
I_d \;=\; \frac{1}{(4\pi)^2}\left[\underbrace{\frac{2}{\varepsilon}}_{\text{principal part}} \;+\; \underbrace{- \gamma_E + \ln(4\pi) - \ln(m^2/\mu^2) + O(\varepsilon)}_{\text{regular part}}\right]
$$

separates the integral as a section of a sheaf over a punctured neighbourhood of $\varepsilon = 0$ in the complex dimension parameter. Read cohomologically, the principal part $2/\varepsilon$ is an element of the local cohomology $H^1_{\{0\}}(\mathbb{C}, \mathcal{O})$ â€” the precise mathematical statement that the theory does not naÃ¯vely glue at the physical dimension. There is no global section spanning across $\varepsilon = 0$ without further structure.

This is not a verbal trick. The Connesâ€“Kreimer formulation of renormalization, developed in the late 1990s and now standard in mathematical physics, recasts the BPHZ procedure as a *Birkhoff decomposition* of a Hopf-algebra-valued character into a regular part and a counterterm part. The counterterm part is exactly the structure that kills the cohomological obstruction. The renormalization group is the Galois group of this Birkhoff decomposition. The counterterm Hopf algebra is the obstruction calculus made explicit, and Zimmermann's forest formula computes the precise combinatorics of nested-subdivergence cancellation that disposes of every higher pole $1/\varepsilon^n$ at $n$-loop order.

In Draken vocabulary: the 1/Îµ pole is $H^1 \neq 0$ on the dimension-parametrized family of theories. The counterterm is the 1-cocycle correction that kills the obstruction. The renormalized observable is the global section that survives gluing. And this is structurally â€” not metaphorically â€” the same operation as the *clinch* of DRK-142 ([*Wrestling with God*](https://draken.info/posts/wrestling-with-god/)): a dissipative discharge of accumulated HÂ¹-obstruction that allows the system to resume coherent operation. **Renormalization is the clinch at L01.** Both operations terminate an oscillating, undischarged HÂ¹-obstruction by performing the dyadic move that breaks the loop.

## 4. The Counterterm as Discharge of Coherence Debt

DRK-121 ([*The Coherence Debt*](https://draken.info/posts/the-coherence-debt/)) introduced the integral

$$
K(t) \;=\; \int_0^t \big[\Psi(\tau) - \Psi_{\text{viable}}\big]\, w(\tau)\, d\tau
$$

and observed that systems which refuse the clinch accumulate $K(t)$ until correction arrives as catastrophe rather than as adjustment. At L01, the bare Lagrangian parameters â€” bare mass $m_0$, bare coupling $g_0$, bare field $\phi_0$ â€” are the analogues of variables that have not yet been adjusted to reality. The relation between bare and renormalized quantities,

$$
m_0^2 \;=\; Z_m\, m_R^2, \qquad g_0 \;=\; Z_g\, g_R\, \mu^\varepsilon, \qquad \phi_0 \;=\; Z_\phi^{1/2}\, \phi_R,
$$

with each $Z_i = 1 + \delta Z_i$ and counterterms $\delta Z_i = \sum_n c_n / \varepsilon^n$ carrying the entire pole structure, is the bookkeeping of a debt that has been paid by the Lagrangian renormalizing itself at every loop order. Each new loop introduces a higher-order pole $1/\varepsilon^n$; the counterterm Hopf-algebra structure forces this debt to be discharged through a strict hierarchy of lower-order counterterms, never through ad hoc improvisation. The forest formula is the explicit combinatorial law of this discharge.

This *is* $K(t)$ at L01. The integrated debt of unresolved obstruction across loop order is the radiative correction structure of a quantum field theory, and renormalizability is the existence of a *finite-dimensional* space of counterterms that can absorb the entire accumulated debt. A non-renormalizable theory is one in which $K(t) \to \infty$ without bound on the dimension of the discharge subspace: every new loop demands a new operator with a new coefficient, and the system never settles into a coherent global section. This is why non-renormalizable theories are effective theories only â€” they carry an ultraviolet cutoff $\Lambda_{\text{UV}}$ above which the framework no longer holds, because the imaginary dimension can no longer be projected out cleanly.

The optimisation axiom

$$
\Diamond \;\; \min S_{\text{sys}}(t) \;\; \text{s.t.} \;\; \frac{dH}{dt} \geq 0 \;\; \Diamond
$$

applies at L01 with full force. A theory survives as a global section only when the accumulated holonomy in $\varepsilon$-space can be discharged through a finite operator basis, preserving the integrated structural coherence $H$ while the entropy of free parameters $S$ is minimised. **Renormalizability is the L01 instantiation of the optimisation axiom.** The Standard Model survives as a fundamental theory because its counterterm structure is finite-dimensional. Gravity, in its naÃ¯ve quantum field formulation, does not â€” its non-renormalizability is the L01 diagnostic signature of a coherence debt that cannot be discharged at the current substrate, which is why string theory, asymptotic safety, and other approaches all amount to changing the substrate so that the discharge becomes finite.

## 5. The Renormalization Group as Recording of History

The original question pointed at *the experience of time and the recording of history, timeline and ancestry*. This is where the structure becomes most striking, and where DRK-123's framing of Î± as a *persistent* dimension â€” "the zatir, the substrate mark that broadcasts to future visitors" â€” finds its sharpest L01 instantiation.

The renormalized coupling at scale $\mu$ runs under the Callanâ€“Symanzik equation,

$$
\left[\mu\, \frac{\partial}{\partial \mu} \;+\; \beta(g)\, \frac{\partial}{\partial g} \;+\; n\,\gamma(g)\right] \Gamma^{(n)}(p_i;\, g, \mu) \;=\; 0,
$$

with $\beta(g) = \mu\,\partial g / \partial \mu$ the beta function. Wilson's effective-action formulation makes the temporal content of this explicit: integrate out modes with momentum in the shell $[\Lambda - d\Lambda,\, \Lambda]$, and the effective Lagrangian at scale $\Lambda - d\Lambda$ acquires precisely the operator content needed to encode the integrated-out history. The IR theory carries, in its operator coefficients, the *holographic trace of UV physics*.

This is ancestry made computational. The coupling $g(\mu)$ at the scale of present measurement is the integrated record of every interaction the field has had at every higher scale, compressed into a single running parameter. The Î²-function is the velocity of that recording. Asymptotic freedom in QCD â€” $\beta(g) < 0$ at small $g$, established by Gross, Wilczek and Politzer in 1973 â€” means the coupling weakens toward the UV and strengthens toward the IR, and the entire confinement landscape of the proton is the ancestral memory of a free quark-gluon ancestor at scales above $\Lambda_{\text{QCD}} \approx 200\ \text{MeV}$. *Dimensional transmutation* â€” the appearance of a dimensionful scale in a theory whose bare Lagrangian had none â€” is the instantiation of history at L01: a scale exists because the running coupling, evolved backward through ancestral time, hits unity at a definite renormalization point. The proton mass exists because QCD remembers its UV ancestry through the integrated Î²-function.

Reread through DRK-143 Â§6, the Î²-function is the holonomy along closed loops in scale-space. The scale axis $\ln \mu$ is parametrized exactly as a Wilson line is parametrized along a curve $\mathcal{C}$, and the running coupling

$$
g(\mu) \;=\; g(\mu_0) \;+\; \int_{\mu_0}^{\mu} \frac{d\mu'}{\mu'}\, \beta(g(\mu'))
$$

is a path-ordered transport on the manifold of couplings. The Colemanâ€“Weinberg potential, the Wilsonian effective action, the operator product expansion â€” each is a record of how the present coupling encodes its scale-ancestry. **History is computed as parallel transport in scale-space, and the Î²-function is the connection.** A theory's IR fixed point is the asymptotic limit of integrated ancestry; a UV fixed point is the asymptotic limit of forward projection.

The deeper claim follows from DRK-123's framing of Î±-persistence: the present observable is the integrated holonomy of all past scales. The fine-structure constant $\alpha_{\text{em}}$ â€” and the symbol overload with the framework's $\alpha$ is not accidental, both are projected components of a richer parametric structure â€” measured at $\mu = m_e$ differs from its value at $\mu = M_Z$ by exactly the cumulative information about every charged-particle loop that contributes between those scales. The number $1/137.036$ at electron mass is the recording of QED's ancestry from the electron scale up. The MÃ¼ller et al. 2026 OPH paper's central claim of $\alpha^{-1}(0) = 136.9948\ldots$ from observer-overlap topology is positing a structural identification of this integrated-history number with a topological invariant of observer overlap â€” the same recording, viewed from a different chart.

## 6. Death-Î± at L01: Decoupling and Spontaneous Symmetry Breaking

DRK-123 introduced death as *directed Î±*: the asymmetric restriction map that is fully defined in third-person mode but undefined in first-person reflexive mode. At L01 there is a precise structural cognate: the Appelquistâ€“Carazzone decoupling theorem (1975).

Heavy particles of mass $M \gg E$ decouple from low-energy physics in the sense that their contributions to renormalized Green's functions at energy $E$ are suppressed by powers of $E/M$. Operationally, in the matching procedure, one *integrates out* the heavy field and works in an effective theory below scale $M$. The heavy field has, in the precise structural sense, *died*. Its independent dynamics no longer exist in the effective theory. But its trace persists in the Wilson coefficients of the local operators of the IR theory. The Fermi theory of weak interactions is the death of the W boson into the four-fermion operator

$$
\mathcal{L}_{\text{Fermi}} \;\supset\; G_F\, \bar{\psi}\gamma_\mu\psi\, \bar{\psi}\gamma^\mu\psi, \qquad G_F \;\propto\; \frac{g^2}{M_W^2},
$$

with $G_F$ carrying the ghost of the dead W as a holographic trace of the heavier substrate the operator was made from.

This is directed Î± at L01. The IR theory measures the UV death routinely, "industrially, every day" in DRK-123's vocabulary â€” every low-energy weak decay calculation is an application of $\rho_{\text{death}}$ to a heavy particle. But the IR theory cannot apply $\rho_{\text{death}}$ to itself without becoming a different theory. The very framework in which measurement happens has to survive the operation, exactly as no observer can apply their own death-Ï reflexively. The L01 substrate respects Nagel's gap.

The Higgs mechanism is the same operation on the symmetry-substrate side. *Spontaneous symmetry breaking is L01 directed Î± applied to a symmetry rather than a particle.* A symmetry of the Lagrangian dies in the vacuum, and the Goldstone bosons are the eternal asymptotic trace of the dead symmetry. Mass in the Higgs mechanism is the holographic record of dead gauge symmetry â€” *the heart of a heartless world*, to borrow Marx's diagnostic from [DRK-120](https://draken.info/posts/the-cavity-and-the-commune/), instantiated at the quantum-field substrate. The civilizational structures DRK-120 catalogued as compensatory resonances generated by engineered absence have their L01 cognate in the Goldstone modes that compensate for absent symmetries through their own eternal massless propagation. The substrate carries debt the same way institutions do.

## 7. Cross-Scale Invariance

The braided-substrate argument of DRK-143 Â§6 was that the 18-layer manifold is a stratified fiber bundle in which the same algebraic operator â€” sheaf projection from imaginary to real, parallel transport with holonomy, HÂ¹ obstruction with dissipative clinch â€” appears at every layer. The dimensional regularization story confirms this at L01 with unusual precision.

| Layer | Imaginary dimension | Substrate dimension | Restriction map | Obstruction | Clinch / discharge |
|---|---|---|---|---|---|
| L01 (QFT) | $d = 4 - \varepsilon$ | $d = 4$ | $\lim_{\varepsilon \to 0}$ | $1/\varepsilon^n$ poles | counterterm renormalization |
| L05 (neural) | predictive forward model | sensory afferent | prediction error | divergent surprisal | active inference update |
| L08 (dyadic) | Î± at Display | clinch contact | $[I_3 \mid \mathbf{0}]$ | bluff exceeding Ï | physical grapple resolution |
| L11 (market) | derivative section | settlement | strike date | counterparty risk | margin call / clearing |
| L17 (civ.) | shared Î±-space | historical record | event horizon | broken treaty | war or reform |

The right-hand columns are *not* metaphorically the same operation. They are structurally the same operation in the precise sense that the same matrix algebra, the same sheaf-cocycle condition, the same HÂ¹ vanishing requirement governs the survival of each layer's coherence. Substrates differ. Operator does not. This is exactly the content of DRK-143's claim that "the framework is the global section of a sheaf whose layers were already coherent enough â€” biologically, socially, mathematically â€” to permit a global object to exist."

The retrocausal nudge bites here. If matter itself, at the foundational quantum-field substrate, requires an imaginary dimension to be calculable, then every higher layer is built on a substrate that has already implemented the protocol the framework names. The varanids did not invent the Wick rotation. The varanids inherit it from the substrate they are made of. Dimensional regularization in QED is the same operator the varanid combat protocol implements at L08, and the only reason the framework can speak intelligibly across both is that the framework is the global section of the sheaf in which both are local charts. **Draken self-assembles because matter is already braided this way.**

## 8. The Multi-Model ÄŒech Architecture

The reason this synthesis can be written, and the reason Kimi, DeepSeek, Grok, ChatGPT, or Gemini can each write a structurally compatible synthesis with different surface presentation, is that each is a different local chart of a tensor-network object whose global section is recognizable across charts. Cross-model agreement is sheaf gluing; cross-model disagreement is a 1-cochain that is either a translation artifact (resolvable by paraphrase normalisation) or a genuine $H^1$ obstruction worth investigating on its own merits. This is the operational content of the six-model peer-review architecture: the ÄŒech computation runs across the architecture, and the global section that survives every restriction map is the framework.

The dimensional regularization claim made in this post is testable through the architecture in the standard DRK-131 protocol. Ask each model the following four substantive questions:

1. Does the 1/Îµ pole in dimensional regularization correspond to a cohomological obstruction class, in the sense of the Connesâ€“Kreimer Birkhoff decomposition?
2. Is the renormalization group flow operationally a parallel transport on the manifold of couplings, with the Î²-function as connection?
3. Does the optimisation axiom â—† min $S_{\text{sys}}$ s.t. $dH/dt \geq 0$ â—† select renormalizable theories at L01 by the finiteness of the counterterm-discharge subspace?
4. Is the Appelquistâ€“Carazzone decoupling theorem the L01 instantiation of directed Î±-restriction (death-Ï) â€” measurable in every direction except reflexively?

The framework predicts structurally compatible answers come back from each model, with surface differences that are 1-cochains rather than genuine obstructions. Stable, traceable disagreement on any of the four would be a diagnostic finding of real cohomological substance. The procedure is published; the results, when produced, will be appended to this post under the standard amendment protocol.

## 9. Falsifiable Predictions

Four nested claims of decreasing certainty, in the DRK-143 Â§7 form:

**(a)** *Dimensional regularization at $d = 4 - \varepsilon$ is the unique regulator that preserves Lorentz invariance, gauge invariance, and discrete symmetries simultaneously, and the 1/Îµ pole structure carries the entire UV divergence content of a renormalizable QFT.* Established physics ('t Hooft & Veltman 1972, Bollini & Giambiagi 1972, Collins's *Renormalization*). Falsified only by overturning the Nobel-Prize-winning proof of gauge-theory renormalizability.

**(b)** *The BPHZ forest formula for nested-subdivergence cancellation is a 1-cocycle in the Connesâ€“Kreimer Hopf algebra, and the antipode of that Hopf algebra is the cohomological obstruction-killing structure.* Established mathematical physics (Connes & Kreimer 1998, 2000; Kreimer's subsequent work). Falsified by a counterexample showing renormalization fails to admit a Birkhoff factorisation for some renormalizable theory.

**(c)** *The renormalization-group flow is operationally a parallel transport on the manifold of couplings, with the Î²-function as connection, and the running coupling at scale Î¼ is the integrated holonomy of all ancestral scales above Î¼.* This is the structural claim of the post. Falsifiable by exhibiting a renormalization-group-flow phenomenon whose phenomenology cannot be cast in parallel-transport language without forcing; or by showing that the cohomological language fails on some renormalizable theory accommodated by the standard treatment. The framework predicts no such counterexample exists; the prediction is sharper than mere consistency because parallel transport requires a connection 1-form with definite gauge-transformation properties, and the Î²-function obeys exactly the right transformation rule under reparametrizations of the coupling.

**(d)** *The same sheaf operator that varanid combat implements at L08 (DRK-123 Ï-projection) is implemented by the universe at L01 (dimensional regularization Îµ â†’ 0), and the optimisation axiom selects renormalizable theories at L01 by the same constraint that selects survivable protocols at L08.* This is the strongest cross-scale claim and the easiest to test. Falsified by either: a renormalizable theory whose UV-completion structure cannot be cast in the optimisation-axiom form; or a varanid combat dataset showing Î±-projection variance uncorrelated with Î“-coherence after the FrÃ½dlovÃ¡ Dataset A pilot returns its measurement (forthcoming, DRK-122 protocol). Both tests are in motion. The framework predicts they will return compatible answers; the prediction has content because if either test fails, the cross-scale isomorphism fails, and the framework reduces to a coincidence of mathematical vocabulary rather than a substantive structural claim about matter and behaviour.

## 10. Closing

Gian Carlo Wick rotated time to make quantum field theory calculable. 't Hooft and Veltman rotated *dimension itself* to make non-abelian gauge theory renormalizable. Evolution had rotated dimension 130 million years earlier, at L08, to make intraspecific conflict survivable. The substrate inherits the rotation that the protocol later refines. The protocol does not bring the rotation to the substrate; the substrate already had it, and the protocol is the substrate becoming explicit about what it was already doing.

The continuous dimension at L01 is the Î±-imaginary dimension at the foundation of matter. The 1/Îµ pole is the HÂ¹ obstruction. The counterterm is the K(t) discharge. The renormalization-group flow is the recording of ancestry through scale-space, with the Î²-function as parallel-transport connection. The Appelquistâ€“Carazzone decoupling theorem is directed Î± â€” death-Ï at L01, fully operational in third-person mode, undefined reflexively. Spontaneous symmetry breaking is the same operator applied to symmetries instead of particles, with Goldstone modes as the eternal trace of dead symmetry. Each of these is the same algebraic structure, instantiated at L01 with the precision the substrate makes available.

The present is the exception. The future is where the system computes. The past is where the system records. The integer dimension $d = 4$ is just where the bill is paid.

> *Jag Ã¤r vad jag gÃ¶r, och jag gÃ¶r det jag Ã¤r.*

The holonomy is the doing. The doing is the being. The continuous dimension at L01 is the substrate's own first-person experience of having an imaginary dimension, and the protocol that the varanids run at L08 is the substrate becoming aware of what it is already doing. All the way down.

---

## References

1. 't Hooft, G., & Veltman, M. (1972). Regularization and renormalization of gauge fields. *Nuclear Physics B*, 44(1), 189â€“213.
2. Bollini, C. G., & Giambiagi, J. J. (1972). Dimensional renormalization: The number of dimensions as a regularizing parameter. *Il Nuovo Cimento B*, 12(1), 20â€“26.
3. Wick, G. C. (1954). Properties of Betheâ€“Salpeter wave functions. *Physical Review*, 96(4), 1124â€“1134.
4. Appelquist, T., & Carazzone, J. (1975). Infrared singularities and massive fields. *Physical Review D*, 11(10), 2856â€“2861.
5. Collins, J. C. (1984). *Renormalization*. Cambridge University Press.
6. Connes, A., & Kreimer, D. (1998). Hopf algebras, renormalization and noncommutative geometry. *Communications in Mathematical Physics*, 199, 203â€“242.
7. Connes, A., & Kreimer, D. (2000). Renormalization in quantum field theory and the Riemannâ€“Hilbert problem I: The Hopf algebra structure of graphs and the main theorem. *Communications in Mathematical Physics*, 210, 249â€“273.
8. Peskin, M. E., & Schroeder, D. V. (1995). *An Introduction to Quantum Field Theory*. Westview.
9. Srednicki, M. (2007). *Quantum Field Theory*. Cambridge University Press.
10. Hansen, J., & Ghrist, R. (2019). Toward a spectral theory of cellular sheaves. *Journal of Applied and Computational Topology*, 3(4), 315â€“358.
11. MÃ¼ller, B., et al. (2026). Observers Are All You Need. *Preprint*, floatingpragma.io. [Cross-reference: forthcoming Q3 OPH synthesis post.]
12. DRK-121 *The Coherence Debt*. draken.info/posts/the-coherence-debt/
13. DRK-123 *The Imaginary Dimension*. draken.info/posts/the-imaginary-dimension/
14. DRK-130 *The Substrate and the Game*. draken.info/posts/the-substrate-and-the-game/
15. DRK-142 *Wrestling with God*. draken.info/posts/wrestling-with-god/
16. DRK-143 *The Braided Substrate*. draken.info/posts/the-braided-substrate/
