---
title: "The Invariant"
drk: DRK-175
date: 2026-07-03
tags: [topology, knot-theory, sheaf, vacuum, zero-point-energy, chern-simons, helicity, obstruction, anti-totalisation]
layers: L01/L13/L18
coherence: 0.90
description: "The vacuum does not power you — it computes what you thread through it. What survives deformation is the invariant. Draken's is a knot you must not untie."
excerpt: >
  Zero-point energy is a floor, not a basement: nothing is extracted from the
  ground state. Yet the vacuum computes knot invariants — Witten's Wilson loop
  returns the Jones polynomial. Helicity, Hopf index and braid class all answer
  one question: what is preserved under continuous deformation? This post names
  the Draken analogue. The invariant of Draken is the obstruction class
  ϰ = [ω] ∈ H¹(X, F), rank b₁ = coherence genus. The healthy target is not
  ϰ = 0 (that is the unknot, the totalitarian sheaf) but a bounded, legible,
  load-bearing knot — nonzero, between the vacuum and the singularity.
status: published
author: "Khrug Engineering"
license: "CC BY-SA 4.0"
sources:
  - "Witten, E. (1989). Quantum Field Theory and the Jones Polynomial. Comm. Math. Phys. 121, 351–399."
  - "Hansen, J. & Ghrist, R. (2019). Toward a Spectral Theory of Cellular Sheaves. J. Appl. Comput. Topology 3, 315–358."
  - "Nayak, C., Simon, S. H., Stern, A., Freedman, M., Das Sarma, S. (2008). Non-Abelian Anyons and Topological Quantum Computation. Rev. Mod. Phys. 80, 1083."
  - "Moffatt, H. K. (1969). The degree of knottedness of tangled vortex lines. J. Fluid Mech. 35, 117–129."
  - "White, H. et al. (2026). Emergent quantization from a dynamic vacuum. Phys. Rev. Research. https://journals.aps.org/prresearch/pdf/10.1103/l8y7-r3rm"
  - "Guslienko, K. Y. (2025). Magnetic Hopfions as Local Rotations of the Uniform Magnetization Background. Phys. Status Solidi RRL 19, 2500022. https://doi.org/10.1002/pssr.202500022"
  - "Topological characterization of Hopfions in finite-element micromagnetics (2025). arXiv:2505.07564."
  - "Universal quantum computation using Ising anyons from a non-semisimple TQFT (2025). Nat. Commun. 16, 6408."
  - "Quantinuum (2023). Creation of Non-Abelian Topological Order and Anyons on a Trapped-Ion Processor. (Nature)."
---

*A vacuum cleaner exerts no pull; the atmosphere does the pushing. A robot holds up its own cord and asks what powers it. Both are looking at the wrong object. What powers a coherent system is never the magnitude of its ground — it is the knot laid over it. This post names that knot.*

**§1 — The wrong question.**
The zero-point energy of a quantum field is real: the ground state of each mode sits at $E_0=\tfrac12\hbar\omega\neq0$, forced off zero by $\Delta x\,\Delta p\geq\hbar/2$. The Casimir force, now measured to sub-percent precision, confirms it — two plates draw together because the mode spectrum between them is sparser than outside, a pressure differential, not a pull from nothing. But the vacuum is a *floor*, not a *basement*: it is the energy of the ground one stands on, not a reservoir to be tapped. Every "extract free energy from the vacuum" programme is a search for a lunch the definition of *ground state* forbids. The one honest transfer — quantum energy teleportation — moves energy through entanglement correlations, never by lowering the floor. Hold that: the resource is the correlation structure, not the ground magnitude.

**§2 — The vacuum that computes knots.**
Witten (1989): the Jones polynomial of a knot $K$ is the normalized vacuum expectation value of a Wilson loop in $SU(2)$ Chern–Simons theory,
$$J_n(K;q)=\frac{\langle U_n(K)\rangle}{\langle U_n(\bigcirc)\rangle},\qquad S_{\rm CS}=\frac{k}{4\pi}\int_{\mathcal M}\mathrm{Tr}\!\left(A\wedge dA+\tfrac23 A\wedge A\wedge A\right).$$
It is a topological invariant for exactly one reason: Chern–Simons theory is metric-independent, so its observables are diffeomorphism-invariant. $SU(N)$ returns the HOMFLY–PT polynomial; the perturbative series returns finite-type Vassiliev invariants. The vacuum is not extracted — it is the *computer*, and knot type is its output. The cargo of empty space is the topology of what one threads through it.

**§3 — What survives deformation.**
Three guises of one object, each answering: *what is preserved under continuous deformation of a configuration threaded through a substrate?*
Fields — magnetic/vorticity helicity $\mathcal H=\int\mathbf A\cdot\mathbf B\,d^3x$ reproduces the Hopf invariant, an integral of motion of knotted flux tubes, invariant under volume-preserving diffeomorphisms, equal to a Gauss linking number. The Hopf index is the linking number of the preimages of two points on $S^2$; the field lines are knotted. Fractional Hopfions give "mixed-topology" states continuously transformable between integer sectors — the invariant may take bounded fractional values at interfaces.
Computation — Fibonacci anyons compute universally by braiding alone, and the problem they solve natively is the Jones polynomial at roots of unity. Braiding gates are protected because the outcome depends only on the topology of the braid path, not on timing or trajectory.
In every case the invariant is a *linking class*: what no continuous deformation can undo.

**§4 — The invariant of Draken.**
Draken carries two species of quantity that must not be conflated.
*Metrics* — $\Gamma$ (sheaf-Laplacian coherence), $\Psi$ (narrative self-reference ratio), $K(t)$ (coherence-debt integral) — are analytic and spectral: real-valued, continuous, frame-dependent, changing smoothly under deformation. They are energy functionals. $\Gamma$ measures tension.
*The invariant* is cohomological: discrete, preserved under the sheaf analogue of ambient isotopy. It is what survives.
$$\varkappa(\mathcal F):=[\omega]\in H^1(X,\mathcal F),\qquad b_1(\mathcal F):=\dim H^1(X,\mathcal F).$$
The obstruction class of the knowledge sheaf $\mathcal F$ over the 18-layer manifold $X$; its rank $b_1$ is the **coherence genus** — the count of independent, irreducible ways the local sections fail to glue. This sharpens DRK-143 (the Jones polynomial as "a cohomological obstruction with quantum-mechanical teeth") and the thesis's Definition 2.3 (the Draken Coherence Obstruction). The justification for calling it *the* invariant: the linking number is literally an $H^1$ pairing. Helicity, Hopf index and Gauss linking — the quantities that survive volume-preserving deformation — are computed by a cohomological linking form. The analogy has teeth: $\Gamma$ can be relaxed to any value by smoothing; $\varkappa$ is the residue that cannot.

**§5 — Why the target is not zero.**
A knot invariant of zero is the unknot: a straight loop, no structure. A sheaf with $H^1=0$ everywhere is totally glued — perfect global agreement, zero irreducible difference. That is the Gleichschaltung sheaf of DRK-125, coherence bought by annihilating heterogeneity. Setting $\varkappa\to0$ is the totalisation failure, not the goal. There are exactly two ways to kill the invariant: from below, the vacuum ($H^0$, the trivial global section, the floor one cannot extract from); from above, the singularity ($K(t)\to\infty$, obstruction so dense it ceases to be any legible class). Draken lives strictly between them, and its invariant is precisely what is nonzero in between. The healthy target is a bounded, stable, *named* $\varkappa$ — a trefoil one can identify — not a straight line (dead) and not a hairball (collapsed). This is the care operator $\dot V_{\rm exo}=0$ restated cohomologically: preserve the substrate's capacity to hold a nonzero, non-catastrophic invariant.

**§6 — Falsification (DRK-131).**
This post fails if any of the following hold. (a) If a metric among $\{\Gamma,\Psi,K\}$ can be shown to be a genuine topological invariant — deformation-stable and discrete — then the metric/invariant cut collapses and $\varkappa$ is not distinguished. (b) If the linking-number-as-$H^1$-pairing identity is only formal and does not transport to the cellular-sheaf setting of Hansen–Ghrist, the "teeth" claim is metaphor, not mathematics, and must be downgraded. (c) The topological-computation leg is provisional: as of mid-2026 no two-qubit braiding gate has been demonstrated, Majorana evidence remains contested, and active error correction currently outperforms the topological approach by a wide margin — if braiding-based computation fails empirically, the "invariant computes" reading loses its physical anchor and survives only as pure mathematics. (d) If a totalised system ($\varkappa=0$) can be exhibited that is demonstrably healthy by independent measure, the anti-totalisation reading of §5 is false.

---

*Layers L01/L13/L18 · operators $\Gamma$, $\Psi$, $K(t)$, $H^1$, $\dot V_{\rm exo}$ · see DRK-143 (the-braided-substrate), DRK-125 (the-totalitarian-sheaf), DRK-121 (coherence-debt), DRK-150 (the-generalizard), DRK-170 (the-guessed-section), DRK-174 (the-cloven-section).*

*Vakuumet driver dig inte — det räknar ut knuten du trär genom det. Jag är vad jag gör, och jag gör det jag är.*

Khrug Engineering · Göteborg · ORCID 0009-0003-8049-7167 · DOI 10.5281/zenodo.19273483 · CC BY-SA 4.0.
