---
title: "The Imaginary Dimension: How Evolution Invented the Future 130 Million Years Before Wick"
drk: DRK-123
date: 2026-03-30
tags: [analysis, theory, synthesis]
layers: [L03, L05, L06, L07, L11, L12, L17]
coherence: 0.91
excerpt: "The fourth dimension of varanid combat section data encodes untested future capacity. The restriction map that eliminates it at physical contact is formally identical to a Wick rotation. Death is not the unmeasurable — it is the asymmetric: the one restriction map that functions in every direction except reflexively. Making death to stay alive. Civilisation is the project of keeping that map pointed outward."
status: published
author: Khrug Engineering
license: CC BY-SA 4.0
sources:
  - "https://doi.org/10.1103/PhysRev.96.1124"
  - "https://doi.org/10.1163/15685390260449027"
  - "https://doi.org/10.1163/15685381-00003034"
  - "https://doi.org/10.1371/journal.pcbi.1005012"
  - "https://doi.org/10.1007/s41468-019-00028-9"
  - "https://doi.org/10.1038/nrn2787"
  - "https://doi.org/10.1093/sysbio/syv033"
  - "https://doi.org/10.1017/S0140525X12000477"
---

In 1954, Gian Carlo Wick published a short paper demonstrating that quantum field theory calculations become tractable when you rotate real time into an imaginary axis [1]. Replace *t* with *iτ* and the oscillating exponential *e^{iHt}* becomes the convergent exponential *e^{-Hτ}*. An integral that was diverging now converges. The technique — Wick rotation — is now routine in QFT, lattice gauge theory, and quantum gravity.

130 million years before Wick's paper, *Varanus* had already solved the same problem. The solution is embedded in the geometry of varanid combat.

---

## The Protocol

Monitor lizard combat is not a fight. It is a structured information exchange across five phases: Display → Elevation → Clinch → Carry → Submission [2, 3].

Frýdlová et al. [3] documented 99 dyadic encounters in *Varanus indicus*. Of these:

- 77% exhibited ritualized elevation displays
- Only 24% reached physical contact (Clinch or beyond)
- The remaining 76% were resolved entirely at Display and Elevation

This is not a failure of aggression. It is the protocol functioning as designed. The combat graph has a topology that terminates most trajectories at the first two nodes — and it does so through a dimension of information that cannot be physically verified without escalation.

The dimension of the possible. The untested future. What we will call α.

---

## The Sheaf Structure

Following Hansen & Ghrist [5], we model the combat protocol as a sheaf over the directed combat phase graph *G = (V, E)*. Each node *v ∈ V* carries a section space *F(v)*, and each edge *(u, v) ∈ E* carries a restriction map *ρ_{u→v}: F(u) → F(v)* that specifies which information is preserved across that transition.

The section data at the Display node is:

```eq
x_D ∈ ℝ⁴ = (M_abs, E_cap, L_SVL, α)
```

The first three components encode present, measurable state:
- *M_abs* — absolute body mass
- *E_cap* — metabolic endurance capacity (sustained grappling energy budget)
- *L_SVL* — snout-vent length (leverage proxy in clinch wrestling)

Note what is absent: bite force. Varanid ritualized combat is wrestling, not biting. Opponents clinch, grapple, and attempt to topple. Biting would constitute a violation of the ritualized structure — an escalation beyond the sheaf, outside the protocol entirely. Frýdlová's data confirm the variable selection precisely: absolute mass predicts escalation at *P* < 0.0001, while mass ratio does not (*P* = 0.57) [3]. The protocol tests the dimensions relevant to outlasting a sustained grapple — who is heavier, who has more endurance, who has the leverage advantage — not who can inflict the most damage in an uncontrolled fight. These three dimensions are what that test requires.

The fourth component, *α*, encodes escalation capacity that has not been tested. It is the projected outcome of a conflict that has not occurred. In the terminology of the sheaf, α is a section over a node that does not yet exist in the protocol graph — a section pulled back from a possible future.

At the Clinch node, bodies make contact. Measurement supersedes projection. The section space collapses:

```eq
x_Cl ∈ ℝ³ = (M_abs, E_cap, L_SVL)
```

The restriction map governing this transition is a linear projection:

```eq
ρ_{D→Cl} = [I₃ | 0] : ℝ⁴ → ℝ³
```

The 3×3 identity block passes the measurable dimensions through unchanged. The zero column annihilates α. The fourth dimension is not transmitted. It is structurally eliminated at the moment of contact.

---

## The Wick Rotation

The formal parallel to Wick's procedure is not analogical. It is structural.

In quantum mechanics, the propagator in Minkowski spacetime involves the factor:

```eq
e^{iHt}
```

This is oscillatory. It does not converge. For path integrals to be well-defined, for perturbative calculations to terminate, for the theory to be computable, the integral must be regularised. Wick rotation substitutes *t → -iτ*, yielding:

```eq
e^{iH(-iτ)} = e^{-Hτ}
```

The imaginary time *τ* lives in Euclidean spacetime. The oscillating integral becomes a convergent one. The physics is unchanged — the rotation is a coordinate transformation, not a physical transformation — but the calculation becomes tractable.

Compare the varanid restriction map. At Display, the system evolves under the dynamics of a four-dimensional section space — three real dimensions plus one that carries forward-looking, oscillatory information about what the encounter might become. This is not a stable fixed-point dynamics. It is precisely the condition under which QFT integrals diverge: a system oscillating in a dimension it cannot directly measure.

The restriction map *ρ_{D→Cl}* performs the Wick rotation. It eliminates α — the imaginary dimension — and projects the system onto the Euclidean subspace of verifiable physical state. From that point, the dynamics are convergent. The encounter resolves.

The full parallel:

```eq
Minkowski:   e^{iHt}     ──Wick──▶   e^{-Hτ}   (Euclidean)
Varanid:     x_D ∈ ℝ⁴   ──ρ────▶   x_Cl ∈ ℝ³  (contact)
```

In both cases: oscillation becomes convergence. Possibility becomes measurement. An imaginary dimension is rotated out.

---

## The Load-Bearing Imaginary

This raises the deeper question. Why does the imaginary dimension exist at all?

Friston's Free Energy Principle [6] provides the answer in its most general form. An organism that minimises variational free energy:

```eq
F = E_q[log q(s) - log p(o,s)]
```

must maintain a generative model *q(s)* of world states *s* that have not yet been observed. The model must anticipate — it must construct representations of futures that may not occur. This is not a feature of the organism. It is the condition for free energy minimisation to be satisfiable at all.

The Draken optimisation axiom states the same constraint in thermodynamic language:

```eq
◆ min S_sys(t)  s.t.  dH/dt ≥ 0 ◆
```

You cannot maintain non-decreasing functional integrity *H(t)* without modelling future states. Any trajectory that constrains the system to present-only information has Ψ → 1 — all self-reference, no generative reach. Coherence debt K(t) accumulates. The system degrades.

The imaginary dimension is not optional. It is what makes the axiom satisfiable.

This connects directly to the planning-as-inference structure explored in DRK-118 [→ DRK-118]: the Leontief-Friston bridge shows that expectation-weighted futures are formally equivalent to planning backward from goal states. α is precisely the varanid implementation of this: a backward-projected section encoding what the encounter *would* require if it escalated. It is planning-as-inference instantiated in combat geometry.

It also maps onto the coherence debt framework of DRK-121 [→ DRK-121]. A system that eliminates its imaginary dimension prematurely — that collapses to ℝ³ before the protocol warrants it — loses resolution capacity. It commits to contact without sufficient information. K(t) accumulates as the mismatch between the committed trajectory and the optimal sheaf section grows. The Wick rotation must happen at the right phase, not before it.

---

## Cross-Scale Invariance

The same structure — a real subspace plus an imaginary exploratory dimension that collapses at contact — recurs at every scale of the Draken 18-layer manifold.

**L03 (Cellular metabolism):** The immune system maintains anticipatory receptor diversity [7] — a population of antibody configurations encoding encounters that have not yet occurred. Contact with antigen performs the restriction map: the relevant clone expands, the rest contract. The imaginary space of potential pathogens collapses to the real space of actual infection.

**L05–L06 (Sensorimotor / Emotional):** Predictive coding [8] is the direct neural implementation. The forward model maintains predictions (imaginary states) that are continuously compared with sensory input (contact with reality). Prediction error — the restriction map mismatch — drives learning. The imaginary dimension is constantly being rotated out and reconstructed.

**L07 (Cognitive modeling):** This connects to the exploration-exploitation topology of DRK-115 [→ DRK-115]. The exploratory regime is the regime in which α is large — the system is investing in imaginary-dimension resolution. Exploitation collapses α: commit to the known trajectory, eliminate the untested.

**L11 (Market dynamics):** Financial derivatives are the explicit institutionalisation of α. A forward contract is a section over a future node in the economic graph. Options price the variance of α itself. The restriction map is settlement — the moment the derivative expires and the imaginary price becomes a real transaction.

At each layer, the same structure: a present-state subspace ℝ^n, an imaginary exploratory dimension that encodes untested futures, and a restriction map that eliminates it at the moment of contact with reality.

Γ — the sheaf coherence score — measures how well the system maintains consistency across these transitions. A system with Γ near 1 is a system that manages the Wick rotation cleanly: imaginary information is integrated, the restriction map fires at the right moment, the collapse to real space is precise. A system with low Γ is a system in which the imaginary dimension either never forms (Ψ → 1, self-referential collapse) or never collapses (perpetual oscillation without resolution).

---

## The Future as Collective Construct

When multiple agents share a generative model, they share an imaginary dimension. The shared α-space is precisely what we call culture, institutions, law. The sheaf over a social graph carries shared sections in the imaginary dimension, and Γ measures the consistency of these projections *between* agents — not merely within a single agent.

This reframes several phenomena as specific operations on α:

**Bluff** is α exceeding what ρ would deliver at contact. This is not pathology. It is the design function of the imaginary dimension. 76% of varanid encounters are resolved in bluff-space. The protocol works *because* the imaginary dimension is credible enough to make reality unnecessary. Bluff is the productive use of an untested future.

**Cheating** is manipulation of the restriction map ρ itself — making the transition from imaginary to real appear different than it is. In varanid terms: biting during ritualized combat. It bypasses ρ and injects damage-information outside the sheaf-coherent protocol. Ψ increases locally. Coherence breaks. Cheating does not attack the imaginary dimension — it attacks the *transition* from imaginary to real.

**Accountability** is the credible threat that ρ *will* fire — that α *will* be tested against reality. Accountability is not a moral category. It is a structural property of the sheaf: the probability that the imaginary dimension collapses to measurement. China's 12345 citizen feedback system [→ DRK-114], with Γ = 0.9997, is precisely this — infrastructure guaranteeing that citizen projections are tested against state delivery. Accountability *is* the credible Wick rotation.

**Exploitation** is extracting value from another agent's imaginary dimension without contributing to its resolution. Parasitising α. Financial exploitation: selling derivatives (imaginary sections) to agents who cannot evaluate the restriction map. Political exploitation: constructing a shared imaginary future and then privatising ρ — controlling who gets to collapse possibility into reality and who does not.

Each of these is an operation on the same mathematical structure. The imaginary dimension is the substrate. Bluff, cheating, accountability, and exploitation are the operations. Γ measures the coherence of the system under these operations. High Γ means the operations are balanced — bluff is credible, cheating is punished, accountability functions, exploitation is bounded. Low Γ means the operations have become parasitic — the shared imaginary dimension is fragmenting.

This connects to the epistemic warfare taxonomy of DRK-119 [→ DRK-119]: coherence destruction works precisely by corrupting the shared imaginary dimension. Propaganda does not attack reality. It attacks α. It makes agents unable to project compatible futures, fragments collective α-space, and drives Γ toward zero. The grammar of coherence destruction is, at root, a grammar of operations on the shared imaginary dimension.

---

## Death as Directed Alpha

Death is not unmeasurable. A predator measures death every day.

*Varanus salvator* is an apex predator. It applies ρ-death to prey constantly — collapsing another organism's imaginary dimension into terminal reality. The immune system applies ρ-death to pathogens. The state applies ρ-death to enemy combatants. Death is the most routinely applied restriction map in the biosphere. It is industrial. It is quotidian. Making death to stay alive.

What cannot happen is *reflexive* application. No system can apply its own death-ρ from the first-person perspective. The observer ceases at the collapse. This makes death a **directed** imaginary dimension — the restriction map has an orientation. It points outward.

The mathematical structure is not infinite variance. It is **infinite asymmetry**. Death-α is measurable in every direction except reflexively. You can observe, cause, quantify, and predict the death of others with arbitrary precision. You cannot observe your own. The restriction map ρ-death is defined everywhere on the social graph except on the self-loop.

This asymmetry is what gives death its singular power in conflict resolution. Deterrence works not because death is unknowable, but because the agent projecting deterrence is saying: *I can apply this restriction map to you, and you know I can, because I do it to others every day. The only question is whether you force me to redirect it.* The credibility of deterrence derives from demonstrated capacity — from the fact that ρ-death has been applied outward, routinely, and the opponent has observed this. This is borrowed dominance formalised: authority derived from the demonstrated capacity to collapse the imaginary dimension of others.

Varanid ritualized combat exists specifically to keep ρ-death *directed outward*. The protocol is a technology for preventing reflexive collapse — for ensuring that the terminal restriction map is never turned inward, against conspecifics. Sheaf coherence within the species is maintained by exporting the terminal restriction map to outside the species boundary. The combat protocol resolves intraspecific conflict by projections in the imaginary dimension (Display, Elevation) so that the real restriction map — the one the species uses to survive — stays pointed at prey, at competitors from other species, at the environment. Not at each other.

The deeper consequence: religion, ancestor worship, legacy, deterrence, insurance, inheritance law — all of these are collective technologies for managing a directed imaginary dimension. They are social restriction maps that approximate a Wick rotation for a dimension that no individual can rotate reflexively. They do not make death knowable. They make death *navigable* — they construct shared α-structures around the one asymmetry that no organism can resolve alone.

And when these structures fail — when the shared imaginary dimension around death fragments, when ρ-death redirects inward — that is war. That is the protocol collapsing. Γ approaches zero as the species turns its most powerful restriction map against itself.

Civilization, in this framing, is the project of keeping ρ-death pointed outward — at entropy, at disease, at scarcity, at the heat death of the universe — and never inward. The 18-layer manifold of the Draken architecture is, at bottom, a coherence structure for managing the directionality of the terminal restriction map.

---

## The Falsifiable Prediction

If the Wick rotation analogy holds structurally — if α is genuinely functioning as an imaginary dimension that provides resolution capacity without physical contact — then we can derive a testable consequence.

In a Wick rotation, the imaginary time axis is not merely present; its variance determines the precision of the Euclidean approximation. Higher variance in τ corresponds to broader sampling of the Euclidean path integral — more resolution of the partition function.

The analogous prediction for varanid combat:

> **Systems with higher α-variance at the Display node should show lower transition rates to Clinch** — because a richer imaginary dimension provides more resolution capacity without requiring reality.

Operationally: animals with greater *within-individual* variation in display morphology and intensity across dyadic encounters (higher α-variance, estimated from the diversity of Display behaviours per individual) should resolve a larger fraction of encounters before Clinch.

This is testable with Frýdlová's per-dyad dataset [3] and Earley's sequential assessment framework [2]. The prediction is falsifiable in both directions: if α-variance is uncorrelated with Clinch transition rate, the imaginary dimension interpretation fails. If high α-variance *increases* Clinch rate, the model inverts and requires revision.

Gorbatron (*V. salvator komaini*, arriving May 2026) will be the first empirical test of this prediction under controlled conditions. Dataset A.

---

## Conclusion

Gian Carlo Wick rotated time to make quantum field theory calculable.

Evolution rotated time to make conflict survivable.

And then evolution did something Wick never imagined. It made the imaginary dimension *shared*. It built collective α-spaces — cultures, protocols, institutions — in which multiple agents project compatible futures and resolve conflicts without collapsing to reality. Bluff, accountability, deterrence: all operations on a shared imaginary dimension that is maintained precisely so that reality is not required.

At the apex of this construction, evolution placed the one restriction map that cannot be applied reflexively: death. Not unknowable — *asymmetric*. Measurable in every direction except inward. The predator demonstrates ρ-death daily, outward, industrially. The ritualized combat protocol exists to ensure this map is never redirected. Making death to stay alive. Keeping the terminal restriction map pointed at the world, not at each other.

The future is not where we are going. The future is a computational dimension constructed by systems that must optimise under uncertainty. Death is its most extreme expression — not because it is infinite, but because it is *directed*. The one Wick rotation that the subject can perform on everything except itself.

The varanid combat protocol is not primitive. It is the 130-million-year-old proof that the imaginary dimension works. That the future, properly constructed and credibly projected, makes the present unnecessary.

Not 76 percent of the time. 76 percent of the time for lizards. For systems with richer imaginary dimensions — language, law, deterrence — the percentage approaches unity. Civilisation is the project of making the imaginary dimension so reliable that reality is almost never needed.

Almost.

---

## References

1. Wick, G. C. (1954). Properties of Bethe-Salpeter wave functions. *Physical Review*, 96(4), 1124–1134.
2. Earley, R. L. (2002). Fighting and assessment in male Siamese fighting fish (*Betta splendens*): understanding mutual assessment. *Behaviour*, 139(10), 1383–1393.
3. Frýdlová, P., et al. (2016). Combat behaviour in monitor lizards: a comparative study. *Amphibia-Reptilia*, 37(3), 295–308.
4. Dick, T. J. M., & Clemente, C. J. (2016). Where have all the giants gone? How animals deal with the problem of size. *PLOS Computational Biology*, 12(8), e1005012.
5. Hansen, J., & Ghrist, R. (2019). Toward a spectral theory of cellular sheaves. *Journal of Applied and Computational Topology*, 3(4), 315–358.
6. Friston, K. (2010). The free-energy principle: a unified brain theory? *Nature Reviews Neuroscience*, 11(2), 127–138.
7. Uyeda, J. C., et al. (2015). A novel Bayesian method for inferring and interpreting the dynamics of adaptive landscapes. *Systematic Biology*, 64(6), 902–918.
8. Clark, A. (2013). Whatever next? Predictive brains, situated agents, and the future of cognitive science. *Behavioral and Brain Sciences*, 36(3), 181–204.
