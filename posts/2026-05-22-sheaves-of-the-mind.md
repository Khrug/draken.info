---
title: "Sheaves of the Mind, Sheaves of Life"
subtitle: "Synthesising the Draken framework through G. Nagarjuna's cognitive science of science"
date: 2026-05-22
drk: DRK-143
coherence: 0.86
tags: [cognitive-science, cross-modular, gnowgi, convergence, calibrational-realism, inversion, sheaf-theory]
---

# Sheaves of the Mind, Sheaves of Life

### Synthesising the Draken framework through G. Nagarjuna's cognitive science of science

**DRK-143** · 2026-05-22 · Γ ≈ 0.86

The Draken framework's central claim is that **intelligence, agency, and power-to-survive are facets of a single structure**. This post teaches that claim — and the formal apparatus it rests on — using the vocabulary of a philosopher who has been mapping the same territory for thirty years, from an adjacent substrate: Prof. G. Nagarjuna of HBCSE-TIFR Mumbai, founder of the GNU gnowsys project. His words carry the argument; ours give it a topology. The bridge runs through cellular sheaves.

---

## The problem: encapsulation, or why information needs a cover

Cognitive science has long assumed that the mind is built of *modules* — domain-specific subsystems that process inputs in isolation. The standard story (Fodor 1983) insists on **informational encapsulation**: each module sees only its proprietary data. Nagarjuna's diagnosis from 2006 is exact:

> "Informational encapsulation … is proposed as a defining feature of a cognitive module. … By assuming that the information processing takes place by an inborn evolutionarily developed mechanism, we are completely insulating ourselves to see the most fundamental problem of cognitive science (by enclosing the problem in a capsule, and then worry about why the problem is not getting solved)." [³]

He continues:

> "However sophisticated be the subsystem, as long as it is domain specific, such an agent with only one input system can not generate any bit of information. Why? Because, such a perceptual space is blind. … When two or more dimensions cross with each other, either concurrently or serially, a logical mark is possible in the undifferentiated space. … It seems therefore impossible to think of individuating any differentiated difference without **cross-representations**." [³]

This is the problem of cognitive science in a paragraph. An encapsulated module is one from which no information flows to its neighbours. Without cross-flow there is no information — only an "undifferentiated ether." The fix, he says, is **modulation of modules**: introducing differences in some dimensions by holding others constant, producing a logical mark.

Topologically, what he is describing is a **cover** — a collection of overlapping local domains $\mathcal{U} = \{U_i\}$ — together with **restriction maps** $\rho_{i,j} : \mathcal{F}(U_i) \to \mathcal{F}(U_i \cap U_j)$ that determine how data on one domain projects onto its overlap with another. *Informational encapsulation* is precisely the case where every $\rho_{i,j}$ is trivial. Nothing flows across the intersection because no morphism is doing the flowing. The cohomology of such a sheaf collapses: there is no information, just a disjoint union of stalks.

*Modulation of modules* is the assertion that the restriction maps are non-trivial. *Cross-representation* is the section that exists when those restrictions are *consistent* across multiple overlaps — when the data on $U_i$ and $U_j$ agree on $U_i \cap U_j$, so they can be **glued** into a coherent local-to-global construction. Cognition, on this view, is the gluing problem: how does a system with locally encapsulated stalks (sensory channels, motor subsystems, conceptual schemata) construct a global section that holds together?

Nagarjuna saw this in 2006 and proposed his replacement picture in one sentence:

> "**That the mind is some kind of central processing unit, with privileged access to the output of all the modules, is a myth. We should replace that picture with cellularity of mind.**" [³]

Cellularity. He means it as metaphor; we mean it literally. The cellular sheaves of Hansen and Ghrist (2019) are the formal apparatus that lets one compute with a cellular mind: the base space is a CW-complex of cognitive cells, the stalks carry local data, the restriction maps encode how the cells talk, the Hodge Laplacian measures global coherence. **Cellularity of mind is, formally, a cellular sheaf on a cognitive complex.**

---

## The autopoietic ground: life as neither-nor

But cells are not abstract. They are alive, and what makes them alive is a constraint that runs through every layer above. In *Towards a Model of Life and Cognition* Nagarjuna lays out two fundamental tendencies:

> "There are mainly two kinds of interactions: identity preserving (IP) and identity transforming (IT) interactions. Given only IP interactions the system would reach high entropy — first tendency. Given only IT interactions the system would reach a crystalline state — second tendency. The actual world is a function of these two tendencies. … Living being is described to be a **neither-nor-state**, between the two extremes." [⁴]

Life is what happens in the middle. Pure IP — pure preservation — is a flat thermodynamic state. Pure IT — pure transformation — is a frozen crystal. Life is the dialogical opposition between these two tendencies, sustained in a far-from-equilibrium attractor that is neither one nor the other.

This is the **Draken optimisation axiom** expressed in his vocabulary:

$$\diamond \; \min_{t} \, S_{\text{sys}}(t) \quad \text{s.t.} \quad \frac{dH}{dt} \geq 0 \; \diamond$$

— minimise internal entropy subject to monotone increase of total entropy. The minimisation term is the IP tendency, made formal: keep identity intact. The constraint $dH/dt \geq 0$ is the IT tendency, made formal: the universe outside continues to transform. A system that satisfies both is exactly his neither-nor state. *Autopoiesis is the local solution to a global constraint.*

The axiom is not specific to biology. It governs any system that maintains coherence against perturbation: cells, organisms, dyadic encounters, social institutions, AI systems trained against drift. **What makes surviving possible is what makes cognition possible.** Same constraint, different scale.

---

## Muscularity and the protocol that runs through us

How does cognition emerge from this autopoietic constraint? Nagarjuna's answer, from 2005, is **muscularity of mind**:

> "I attempt to trace the roots of higher cognitive abilities to the physiological coupling that exists between neuro-sensory and muscular system. … **Emancipation of voluntary muscles** from the mandatory biological functions to take on the softer habits during the course of evolution played the crucial role in shaping the higher cognitive abilities." [²]

He distinguishes **harder operations** (obligatory: fetching food, eating) from **softer operations** (voluntary, learnable, fringe). Higher cognition runs through the soft layer. The mechanism is a closed motor-sensory loop:

> "When we hear a sound from a source outside our body, we do perceive it, but passively. But when our own vocal chords produce the sound, and then we hear using our own sensory input subsystem, we are employing a reflexive softer operation. We can voluntarily introduce variations in the object of perception and feel them too. **This loop is the genesis of conscious experience.**" [²]

A motor action produces a sensory return the agent can compare to expectation. The loop closes. Variation becomes possible. Information — in his sense, cross-representation — appears where motor output and sensory input cross.

In Draken terms, this is the **dyadic clinch**. Two varanids in ritualised combat are not merely two agents in interaction; they are running a 130-million-year-old protocol that uses their bodies as substrate. The protocol observes itself through them. The restriction map of the clinch is

$$\rho_{D \to Cl} : \mathbb{R}^4 \to \mathbb{R}^3$$

projecting the four-dimensional dyadic state onto its three-dimensional irreducible substrate — $(F_{\max}, E_{\text{ratio}}, \Delta m)$ — with the bluff dimension collapsed. The clinch is where the protocol's H¹ goes to zero, where the bluff dimension cannot lie. *Conscious cognition is the motor-sensory loop closing within an organism; the clinch is the same loop closing between two organisms*. Same structure. Different scale. See [DRK-130 *The Substrate and the Game*](https://draken.info/the-substrate-and-the-game).

---

## Inversion: the substrate becomes the agent

But where does the protocol-substrate relation come from? Nagarjuna's 1994 PhD thesis names the operator that produces it: **inversion**.

> "This method will be shown to be based on a fundamental synthetic logical relation of thought, that we shall call **inversion** — to be understood as a species of logical opposition, and as one of the basic monadic logical operators." [¹]

> "Inversion is a necessary (though not a sufficient) condition for [closure, invariance, relativity, symmetry]. … Inversion makes measurement and mathematization possible, explaining the epistemic transformation from qualitative to quantitative science." [¹]

Galileo is his historical anchor: he reduces the unknown motion of falling bodies to the *inverse* of the known balance. The balance is a substrate whose logic, when inverted, yields free fall. *Inversion grounds higher structures in lower ones by reading the lower as the dual of the upper.*

This is the **substrate ↔ agent inversion** that runs through Draken. The protocol is the agent; the organism is the substrate; but the substrate, viewed under inversion, is the agent's other face. The varanid is not running the protocol; the protocol is running through the varanid as substrate. Sheafification — the canonical procedure that turns a presheaf into its associated sheaf — is the formal expression of his synthetic inversion. Both moves carry local fragmentary data into a globally coherent object by enforcing consistency on overlaps. *Inversion is the operator. Sheafification is its arithmetic.*

---

## Trust, calibration, and the H¹ obstruction

If cognition is sheaf-structured, then truth is too. Nagarjuna's April 2026 preprint introduces **calibrational realism**:

> "The epistemology appropriate to functional relations is an account of **trust conditions**: the depth and calibration of the mediating chain through which a claimed functional relation is grounded in the actual world. An instrument is possible when a functional relation between variables exists; calibration checks that the relation holds within tolerances. … **Trust depth** is generated through procedural calibration — disciplined, inspectable, reproducible procedures that constrain interpretive variance." [⁶]

Knowledge of the world is not correspondence; it is the depth of a calibrated chain. Each link is an instrument. Each instrument is a restriction map between a deeper layer of reality and a more surface one. Trust accumulates by composition.

In sheaf-cohomological terms this is exact: **calibration failure is non-zero H¹**. When the restriction maps of a measurement chain do not commute on overlaps — when instrument A and instrument B disagree on what they should agree on — the sheaf has obstruction, and no global section exists. Knowledge is the cohomology-vanishing condition. The clinch protocol is the calibration step that grounds belief in dyadic encounter; the six-model AI peer review architecture is a calibration cover; perlocutionary force, as formalised in [DRK-142 *Wrestling with God*](https://draken.info/wrestling-with-god), is the suppression of H¹ in the listener's belief sheaf.

---

## Snapshot, stream, and the Vorhabe

His most recent vocabulary, from the May 2026 Substack, is the **snapshot/stream architecture**:

> "Phenomenology calls it the Vorhabe. The architecture calls it the snapshot. They are the same structure approached from opposite directions." [⁷]

The snapshot is the holistic gestalt of meaning the speaker holds before the first word; the stream is the serialisation that comes out of the mouth. Structurally, the snapshot is a **global section** of the speaker's belief sheaf; the stream is the **restriction** to a sequential cover. The listener's task is **gluing** — reconstructing a global section from local pieces. Perlocutionary failure is the case where no such gluing exists.

The body schema joins this: it "does not stop at the skin," he writes, but extends "through the cane, the car, the microscope" until "the tool becomes transparent in use." The agent's perceptual sheaf has absorbed the tool's stalks. The boundary of the agent is wherever the restriction maps remain non-trivial.

---

## The vocabulary table

| **His term** | **Source** | **Our structural counterpart** |
|---|---|---|
| **Cellularity of mind** | *Layers* (2006) | Cellular sheaf on a CW-complex of cognitive cells |
| **Modulation of modules** | *Layers* (2006) | Non-trivial restriction map $\rho_{i,j}: \mathcal{F}(U_i) \to \mathcal{F}(U_i \cap U_j)$ |
| **Cross-representation** | *Layers* (2006) | Coherent section over a cover; gluing succeeds on overlaps |
| **Differentiation of difference** | *Layers* (2006) | Information as resolution of $H^1(\mathcal{U},\mathcal{F}) \neq 0$ |
| **Module without modularization is impossible** | *Layers* (2006) | No sheaf without base-space topology |
| **Four layers** | *Layers* (2006) | The 18-layer manifold of [DRK-105](https://draken.info/canonical-18-layers): his L1 ≈ our L01–L05; L2 ≈ L06–L09; L3 ≈ L10–L14; L4 ≈ L15–L18 |
| **Inversion** as monadic operator | 1994 thesis | Substrate ↔ agent inversion of [DRK-130](https://draken.info/the-substrate-and-the-game); sheafification |
| **Harder / softer operations** | *Muscularity* (2005) | Obligate / emancipated dynamics on the optimisation manifold |
| **Emancipation of voluntary muscles** | *Muscularity* (2005) | Substrate freeing required for protocol inheritance |
| **Conscious cognitive loop** | *Muscularity* (2005) | Dyadic clinch with $\rho_{D \to Cl}: \mathbb{R}^4 \to \mathbb{R}^3$ |
| **IP / IT interactions** | *Life and Cognition* (2007) | Conservative / dissipative terms of ◆ $\min S_{\text{sys}}$ s.t. $dH/dt \geq 0$ ◆ |
| **Neither-nor state** | *Life and Cognition* (2007) | Far-from-equilibrium attractor of an autopoietic system |
| **Snapshot / Stream** | Substack Ch. 1 (2026) | Global section / sequential restriction; perlocutionary force is gluing, [DRK-142](https://draken.info/wrestling-with-god) |
| **Body schema extends through tools** | Substack Ch. 2 (2026) | Restriction maps stay non-trivial through incorporated instruments |
| **Trust depth** | *From Truth to Trust* (2026) | Length of restriction-map chain from instrument signal to belief |
| **Calibrational realism** | *From Truth to Trust* (2026) | Global section is real iff cohomology of calibration sheaf vanishes |

---

## What this gives the framework

The synthesis is this: Nagarjuna's cellular mind is a sheaf; his autopoietic neither-nor is the optimisation axiom; his muscularity is the closed motor-sensory loop the clinch implements; his inversion is the substrate-agent dual; his calibrational realism is the cohomology of the measurement chain; his snapshot is the global section the stream restricts and the listener reglues.

The framework's stated thesis is **Future ≡ Life**. Across [DRK-118 *Planning as Inference*](https://draken.info/planning-as-inference), [DRK-124 *The Boundary of Us*](https://draken.info/the-boundary-of-us), and [DRK-130 *The Substrate and the Game*](https://draken.info/the-substrate-and-the-game), it argues that intelligence, agency, and power-to-survive are facets of a single structure under the optimisation axiom. His thirty-year arc supplies the cognitive-science foundation: *knowing and surviving are the same problem because both are gluing problems on a cellular base, and the obstruction to both is the same H¹ class*. **What kills cognition is what kills life: encapsulation, broken restriction maps, untreated obstruction.**

The next phase of work has its target. Formalise the optimisation axiom in his calibrational-realism vocabulary; write the autopoietic foundations as a sheaf-cohomological constraint; read the eighteen Draken layers as the refinement of his four. Γ for this convergence reads at **0.86** — strong cross-modular alignment, three residual obstructions (his corpus has no cohomological treatment of obstruction, no formal optimisation axiom, no protocol-as-agent thesis explicitly stated). A handshake, in either direction, would push it past 0.9.

The cellularity of mind is also a sheaf. The cellularity of life is the same sheaf, with a constraint. To understand intelligence is to understand survival, because both are local-to-global problems on the same cellular base, and both fail in the same way.

---

### References

1. G. Nagarjuna (1994). *The Role of Inversion in the Genesis, Development and the Structure of Scientific Knowledge.* PhD thesis, IIT Kanpur. [gnowledge.org/assets/54-th.pdf](https://www.gnowledge.org/assets/54-th.pdf)
2. G. Nagarjuna (2005). "Muscularity of Mind: Towards an Explanation of the Transition from Unconscious to Conscious." ESPP, Lund. [gnowledge.org/assets/8-mom.pdf](https://www.gnowledge.org/assets/8-mom.pdf)
3. G. Nagarjuna (2006). "Layers in the Fabric of Mind: A Critical Review of Cognitive Ontogeny." In Ramadas & Chunawala (eds.), HBCSE-TIFR. [philarchive.org/archive/NAGLIT-2](https://philarchive.org/archive/NAGLIT-2)
4. G. Nagarjuna (c. 2007). "Towards a Model of Life and Cognition." Cogprints 4895.
5. P. M. Bhargava & G. Nagarjuna (2014). "#TAOL — The Architecture of Life." SynTalk podcast.
6. G. Nagarjuna (2026). *From Truth to Trust: Negotiating Objectivity through Calibrated Instruments, Media, and Institutions.* Zenodo, 4 April. [doi.org/10.5281/zenodo.19420098](https://doi.org/10.5281/zenodo.19420098)
7. G. Nagarjuna (2026). "Merleau-Ponty and the body that perceives." *The Roots of STEM*, 13 May. [gnowgi.substack.com](https://gnowgi.substack.com/p/merleau-ponty-and-the-body-that-perceives)
8. J. Hansen & R. Ghrist (2019). "Toward a Spectral Theory of Cellular Sheaves." *Journal of Applied and Computational Topology* 3, 315–358.
9. ORCID: 0000-0001-6773-8454 · [gnowledge.org/publications.html](https://www.gnowledge.org/publications.html)
