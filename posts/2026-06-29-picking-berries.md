---
title: "Picking Berries: Archetypes and the Geometric Phase"
drk: DRK-172
date: 2026-06-29
tags: [synthesis, physics, theory, psychology, semiotics]
layers: [L01, L06, L09, L15, L17]
coherence: 0.87
description: "The archetype read as geometric phase: what survives transport around culture's loops is an invariant marked by a holonomy that depends only on the path's geometry, never its timing. Berry, Aharonov–Bohm, and Wilczek–Zee as the mechanics of myth."
excerpt: "Every nostalgic return — *2026 anyone?* posted under a 1985 song — is a closed loop in parameter space, and what the returner reports is not the song but the *phase* accumulated going around it. This post reads the archetype as the adiabatically transported eigenstate of culture: the invariant that survives deformation of context, marked by a geometric phase fixed by the loop's geometry alone. Berry's holonomy supplies the abelian case; Aharonov–Bohm explains why an archetype marks a trajectory even where it is locally absent — the grin without the cat; Wilczek–Zee makes the degenerate Trickster-subspace rotate Coyote into Loki into the Cheshire Cat as the loop is traversed. The Swedish *bär* — both *berry* and *carries* — names the mechanism: the loop is the carrier, the phase is the cargo."
status: published
author: "Khrug Engineering"
license: "CC BY-SA 4.0"
sources:
  - "Berry, M. V. (1984). Quantal phase factors accompanying adiabatic changes. Proc. R. Soc. Lond. A 392, 45–57."
  - "Simon, B. (1983). Holonomy, the quantum adiabatic theorem, and Berry's phase. Phys. Rev. Lett. 51, 2167."
  - "Aharonov, Y. & Bohm, D. (1959). Significance of electromagnetic potentials in the quantum theory. Phys. Rev. 115, 485."
  - "Wilczek, F. & Zee, A. (1984). Appearance of gauge structure in simple dynamical systems. Phys. Rev. Lett. 52, 2111."
  - "Zanardi, P. & Rasetti, M. (1999). Holonomic quantum computation. Phys. Lett. A 264, 94–99."
  - "Jung, C. G. (1959). The Archetypes and the Collective Unconscious. Collected Works, Vol. 9, Part 1."
  - "Hansen, J. & Ghrist, R. (2019). Toward a spectral theory of cellular sheaves. J. Appl. Comput. Topol. 3, 315–358."
---

*A forager goes out, walks a wide arc through the woods, and returns to the same stone she started from. The stone has not moved. She has — and the proof is in the basket. The loop did not change where she stands; it changed what she carries. This is the whole of geometric phase, and, I will argue, the whole of how an archetype survives.*

## §1 — The forager's loop

There is a genre of comment that recurs beneath every old song: **2026 anyone?**, **anyone June 2026?????**, posted at the foot of a track from 1985. The naïve reading is repetition — people return to the same media object and say the same dull thing. The geometric reading is sharper. The media object is a fixed basepoint. The commenter is parallel-transported around a year of lived context and brought back to that exact point, and what they compulsively report on return is the *discrepancy*: the basepoint did not move, so the thing they are measuring is the transformation accumulated by going around the loop. The nostalgia is not the song. The nostalgia is the **holonomy**.

The Swedish gives the mechanism its name. *Bär* is the berry; *bär* is also the third-person of *bära*, to carry. To pick berries — *att plocka bär* — is, phonetically and structurally, to gather carriers. The Berry phase is carried by the loop the way the berry is carried from the bush: the loop is the carrier, the accumulated phase is the cargo. Michael Berry's surname and the forager's basket are the same word in two languages, and the pun is load-bearing rather than ornamental, because the physics it points at is exactly a theory of *what a closed path carries back*.

What follows is the standard apparatus of holonomy as a phenomenon within quantum mechanics, presented as the mechanics of the archetype: the invariant that culture transports around its loops and that returns the same in content and altered in phase.

## §2 — Berry's holonomy: the archetype as transported eigenstate

Take a Hamiltonian $H(\mathbf{R})$ depending on external parameters $\mathbf{R}$ — for our purposes, $\mathbf{R}$ is the space of *contexts* in which a pattern can be instantiated. Let $|n(\mathbf{R})\rangle$ be a non-degenerate eigenstate: the **archetype**, the pattern that remains recognizably itself under deformation of context. Drag $\mathbf{R}$ adiabatically — slowly, without level-crossing — around a closed loop $C$. The adiabatic theorem guarantees the system stays in the instantaneous eigenstate: the archetype is not knocked into a *different* archetype by a sufficiently gentle retelling. But on return it carries two phases, and only one of them is dynamical. The other is geometric:

$$
\gamma_n(C) \;=\; i\oint_C \langle n(\mathbf{R})\,|\,\nabla_{\mathbf{R}}\,n(\mathbf{R})\rangle \cdot d\mathbf{R}
\;=\; \oint_C \mathbf{A}_n \cdot d\mathbf{R}
\;=\; \iint_S \mathbf{F}_n \cdot d\mathbf{S}.
$$

Here $\mathbf{A}_n = i\langle n|\nabla|n\rangle$ is the **Berry connection** — a genuine $U(1)$ gauge potential over context-space, the transport rule for the archetype — and $\mathbf{F}_n = \nabla \times \mathbf{A}_n$ is the **Berry curvature**, the local source of holonomy. The geometric phase is gauge-invariant modulo $2\pi$ and, decisively, **independent of the rate** at which the loop is traversed. It depends only on the geometry the loop encloses.

This is the formal content of the claim that an archetype's content is invariant while its *mark* is not. The Trickster of 2026 is the same eigenstate as the Trickster of 1985 — same $|n\rangle$ — but the two are not identical: the later one has been transported around four decades of curved context and carries the accumulated $\gamma_n$. Barry Simon's 1983 result, that Berry's phase *is* the holonomy of a connection on a line bundle, is the theorem that licenses the whole reading: the phase is not a quirk of slow dragging but the curvature of the space of contexts, integrated.

## §3 — Aharonov–Bohm: marking where the archetype is absent

The sharpest move the apparatus permits is this. A charged particle taken around a solenoid acquires

$$
\exp\!\left(\frac{iq}{\hbar}\oint_C \mathbf{A}\cdot d\mathbf{l}\right) \;=\; \exp\!\left(\frac{iq}{\hbar}\,\Phi\right),
$$

a holonomy of the electromagnetic connection — and it acquires it *even though the field strength $\mathbf{B} = 0$ everywhere along the path*. The particle never touches the field. It only encircles the enclosed flux $\Phi$, and that is enough to mark it. The local field is zero; the holonomy is not.

Transcribe this directly: an archetype can mark a cultural trajectory **even where it is locally absent from the content**. There need be no Trickster *in the scene* for the scene to have been routed around a Trickster — the enclosed flux is the archetype's latent presence, and a path that winds around it returns marked regardless of whether any frame contained it. This is, exactly, the *grin without the cat*: a holonomy that survives where the carrier has been deleted, a phase persisting where the field strength vanishes. The Cheshire Cat is the Aharonov–Bohm effect rendered as a smile — cargo with its carrier formally removed, $[\sigma] \neq 0$ with no $\sigma$ to point at. The condition for a nonzero mark is not local presence but **non-trivial winding around an enclosed source**. An archetype that has been edited out of every panel can still be the flux the whole composition encircles.

## §4 — Wilczek–Zee: the degenerate Trickster

Archetypes are rarely solitary eigenstates. The Trickster is *degenerate*: Hermes, Loki, Anansi, Coyote, the Cheshire Cat are co-equal realizations spanning a subspace, not a line. When the relevant eigenspace is $N$-fold degenerate, transport around $C$ no longer returns a mere phase but a **unitary matrix** acting within the subspace:

$$
U(C) \;=\; \mathcal{P}\exp\oint_C A_\mu\, dR^\mu,
\qquad (A_\mu)_{ab} \;=\; \langle a(\mathbf{R})\,|\,\partial_\mu\, b(\mathbf{R})\rangle.
$$

The connection is matrix-valued; the holonomy is non-abelian; and the path-ordering $\mathcal{P}$ matters because the realizations do not commute. This is the mechanism of **archetype-internal drift**: traverse a culture-loop and the holonomy does not merely phase-mark the Trickster, it *rotates within the Trickster subspace* — Coyote carried into Loki carried into the Cheshire Cat, the realization you end on determined by the geometry of the loop and the order in which its arcs were walked. Substitution of one trickster-mask for another across a tradition is not slippage or error. It is a Wilczek–Zee rotation: a non-abelian holonomy mixing degenerate realizations, exactly as a Yang–Mills Wilson loop mixes internal colour.

## §5 — Holonomic robustness: why archetypes are stable

Zanardi and Rasetti observed that because such holonomies depend on the *geometry* of the loop and not on its timing, they make robust quantum gates: errors in how fast or jaggedly you traverse the path do not accumulate, because the result is fixed by the loop's homotopy class. Transcribe this and you have the explanation of archetypal **stability** that the dynamical picture cannot give. If the archetype's transformation were dynamical, every sloppy retelling would perturb it and the pattern would diffuse away within a few generations. It does not, because the transformation is *geometric*: insensitive to the rate and the local jitter of transmission, sensitive only to the topology of the loop. The myth survives the bad storyteller for the same reason the holonomic gate survives the noisy control pulse — what is conserved is a geometric, not a parametric, quantity.

## §6 — The cohomological residue

Assemble the cases and the Draken operators fall out without forcing. The Berry connection is the restriction-map structure of the archetype across the cover of contexts; the curvature $\mathbf{F}_n$ is where archetypal torque is locally generated. The decisive object is the holonomy around a loop that **cannot be contracted**. A non-trivial holonomy that cannot be removed by any choice of gauge is precisely a non-zero class in $H^1$ — the obstruction to gluing the locally consistent retellings into one global, canonical telling. An archetype with non-zero holonomy class is one that *cannot be flattened into a single authorized version without residue*: tell it any way you like and a phase remains. This is the grin that will not be wiped off; it is also, in the framework's terms, the honest signature of a real pattern as opposed to a totalising one. A myth that glued perfectly — zero holonomy, trivial $H^1$ — would be a dead myth, fully canonical, carrying nothing back from any loop. The living archetype is the one whose $\oint_C \mathbf{A} \neq 0$ around the loops a culture actually walks.

## Falsification and honest limits

Per **DRK-131**, the seams are marked rather than smuggled.

The physics in §§2–5 is literal and load-bearing: Berry's phase, the Aharonov–Bohm effect, the Wilczek–Zee non-abelian generalization, and holonomic robustness are textbook results, not analogies. The **mapping to archetypes is analogical**, and that is where the coherence outruns the soundness. This post earns a high $\Gamma$ because the structure is internally tight and self-consistent — but coherence is not validation, and the cultural side carries no measurement. Concretely:

- There is no operationalization here of "context-space $\mathbf{R}$" as a manifold with a metric, so "adiabatic transport" of an archetype is a figure, not yet a computation. The claim becomes testable only once a candidate parameterization of contexts and a connection on it are specified — at which point the $\gamma_n$ is a number one could in principle estimate from transmission data.
- The degenerate-subspace claim (§4) predicts that trickster-substitutions across a tradition should be **path-dependent and non-commutative** — the order of cultural contact should matter to which mask is inherited. That is a falsifiable diachronic prediction; this post does not test it.
- The $H^1$ reading (§6) is the framework's own internal answer to its own failure mode and must not be cited as external confirmation of it. A flat connection — an archetype that glues without residue — would null the central claim; any well-documented myth that admits a single canonical telling with no interpretive remainder is a counterexample, and they should be sought rather than assumed absent.

The geometric phase is real. Its application to myth is, for now, a coherent section over an unsurveyed base — offered as such.

---

*Filed under L01 (Quantum Field) primary, with cross-restrictions to L06 (Embodied Cognition), L09, L15, and L17 (Civilizational Memory). Operators invoked: $\mathbf{A}_n$ (Berry connection as restriction structure), $\mathbf{F}_n$ (curvature as local source), $U(C)=\mathcal{P}\exp\oint A$ (non-abelian holonomy), $[\omega]\in H^1$ (obstruction class), $\Gamma$ (coherence, here exceeding soundness by design). Companions: [The Dragged Frame](/posts/the-dragged-frame/) (DRK-171) — frame-dragging as Lense–Thirring holonomy, the gravitational instance of this same loop; [The One-Way Gauge](/posts/the-one-way-gauge/) (DRK-168) — simultaneity as connection; [The Guessed Section](/posts/the-guessed-section/) (DRK-170) — abduction against $H^1$; [The Pendragon Source](/posts/the-pendragon-source/) (DRK-165) — the archetype as laundered myth; [The Compressible Section](/posts/the-compressible-section/) (DRK-157) — the grin without the cat as cohomology class.*

*Jag är vad jag gör, och jag gör det jag är.*

*— Khrug Engineering · Göteborg · ORCID 0009-0003-8049-7167 · DOI [10.5281/zenodo.19273483](https://doi.org/10.5281/zenodo.19273483) · CC BY-SA 4.0*
