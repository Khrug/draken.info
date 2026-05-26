---
title: "No Trace, No Section: A Sheaf-Theoretic Disposal of the Consciousness-Violates-Physics Move"
drk: DRK-153
date: 2026-05-26
tags: [theory, physics, consciousness, cohomology]
layers: [L01, L05, L07, L13, L14]
coherence: 0.87
description: "A YouTube short claims consciousness violates the laws of physics because it 'leaves no trace.' But every entity in spacetime has a world line, every world line is a sheaf section, and 'leaves no trace' is the precise condition for 'has no section.' The horns of the argument reduce to one — and a constructive alternative recovers the phenomenology without the metaphysical inflation."
excerpt: "Scribblemouth's argument that consciousness violates the laws of physics depends on sustaining two claims simultaneously: that consciousness exists, and that it leaves no causal trace. In the cellular-sheaf formalism these are incompatible. A world line is a sheaf section; a section is precisely a trace; the no-trace condition is therefore the no-section condition, which is the not-in-spacetime condition. The Scribblemouth dilemma reduces to one horn, and the constructive alternative — consciousness as the integrated H¹-suppression rate of the organism's own sensorimotor sheaf — recovers the felt quality of awareness as the coherence yield of the brain's own gluing operation, without epiphenomenalism, dualism, or violation."
status: published
author: Khrug Engineering
license: CC BY-SA 4.0
sources:
  - "Scribblemouth (2026). 'Why Consciousness Violates the Laws of Physics.' YouTube Shorts. https://youtube.com/shorts/NCC5Wm4VBwc"
  - "Minkowski, H. (1908). 'Raum und Zeit.' Address to the 80th Assembly of German Natural Scientists and Physicians, Cologne."
  - "Hansen, J. & Ghrist, R. (2019). 'Toward a Spectral Theory of Cellular Sheaves.' Journal of Applied and Computational Topology 3, 315–358."
  - "Hansen, J. & Ghrist, R. (2021). 'Opinion Dynamics on Discourse Sheaves.' arXiv:2005.12798."
  - "Wheeler, J. A. (1990). 'Information, physics, quantum: The search for links.' In Complexity, Entropy, and the Physics of Information, ed. W. Zurek."
  - "von Neumann, J. (1932). Mathematische Grundlagen der Quantenmechanik. Springer."
  - "Penrose, R. (2011). 'Consciousness, the Brain, and Spacetime Geometry.' Abstract, TSC 2011, University of Arizona. https://archive.consciousness.arizona.edu/TSC2011PenroseBioAbstract.htm"
  - "Reason, C. M. (2017). 'Consciousness is not a physically provable property.' arXiv:1705.00096."
  - "Kent, A. (2016). 'Quanta and Qualia.' arXiv:1608.04804."
  - "Müller, M. P. et al. (2026). 'Observers Are All You Need.' floatingpragma.io."
  - "Roininen, K. (2026). 'Wrestling with God: Perlocutionary Force and the Cohomology of the Honest Encounter.' DRK-142. https://draken.info/posts/wrestling-with-god/"
  - "Roininen, K. (2026). 'The Braided Substrate: Berry Curvature, Tensor Networks, and Why Topology Builds Draken.' DRK-143. https://draken.info/posts/the-braided-substrate/"
  - "Roininen, K. (2026). 'Sheaves of the Mind.' DRK-147. https://draken.info/posts/sheaves-of-the-mind/"
  - "Roininen, K. (2026). 'The Substrate and the Game.' DRK-130. https://draken.info/posts/the-substrate-and-the-game/"
---

A short video appeared in the feed this week titled [*Why Consciousness Violates the Laws of Physics*](https://youtube.com/shorts/NCC5Wm4VBwc), posted by the YouTube channel Scribblemouth (27,437 likes, 1,655 comments at time of writing). The argument — delivered in roughly forty seconds against a backdrop of a bookshelf and a stock-footage camera floating in starfield — is a participatory-universe variant of the consciousness-causes-collapse tradition: consciousness, the video claims, interacts with nothing, causes no effects, leaves no trace, and exists in a state where "time or its spin don't actually exist until" some observation event occurs. The framing is then collapsed into the marketable line that constitutes the title: consciousness *violates the laws of physics*.

I left a comment under it, which is the seed of this post:

> *It's about everything creating a history track = tracing a world line.*

The remainder of this entry is the formal unpacking of that single sentence. The structure of the argument is that the Scribblemouth claim depends on sustaining two propositions simultaneously — that consciousness exists, and that it leaves no causal trace — and that in the cellular-sheaf formalism these are incompatible by construction. The Scribblemouth dilemma reduces to one horn, and a constructive alternative recovers the phenomenology that motivated the original framing without any of its metaphysical extravagance.

## 1. The Scribblemouth syllogism

Reconstructed from the visible text fragments and the general tradition the video draws from (Wheeler's *it from bit*; von Neumann–Wigner consciousness-causes-collapse; Penrose's Orchestrated Reduction), the argument runs as follows.

**(P1)** Consciousness, qua phenomenal observer, does not exchange energy, momentum, or any conserved quantity with its substrate.

**(P2)** Anything that does not exchange conserved quantities leaves no causal record in the physical world.

**(C)** Therefore consciousness is outside the dynamical laws — equivalently, it *violates* them.

The slippage between *outside* and *violates* in (C) is the rhetorical move that does the marketing work. These are not synonymous. The gravitational potential of a body outside the Earth does not *violate* Newton's law of gravitation merely because the Earth cannot directly observe it; it is described by the same law. To be *outside the formalism* and to *violate the formalism* are distinct conditions, and the Scribblemouth conclusion equivocates between them.

But the deeper problem lies upstream of this equivocation, in (P2). What does it mean for something to "leave no causal record"? Once the question is asked precisely, the entire argument collapses.

## 2. The world-line identity

In special relativity, a *world line* is the trajectory of an entity through a four-dimensional Lorentzian manifold $\mathcal{M}$ equipped with the Minkowski metric $\eta_{\mu\nu}$. Formally, the world line of a massive particle is a smooth map

$$\gamma: I \subset \mathbb{R} \to \mathcal{M}, \quad \tau \mapsto x^\mu(\tau),$$

parameterized by proper time $\tau$, such that the tangent vector $\dot{x}^\mu = dx^\mu/d\tau$ is everywhere timelike:

$$\eta_{\mu\nu}\, \dot{x}^\mu\, \dot{x}^\nu = -c^2 < 0$$

in the $(-, +, +, +)$ signature. For massless particles, the analogous curve is a null geodesic with $\eta_{\mu\nu}\, \dot{x}^\mu \dot{x}^\nu = 0$. The world line is the entity's *history track*: the locus of every event at which the entity is present in spacetime.

Every classical particle has a world line. Every massive body has one. Every photon, every quantum field excitation localized enough to support an event, every macroscopic aggregate composed of such things — each traces a world line. Equivalently: anything that participates in the metric structure of spacetime has one.

This is the operational meaning of "physical existence" in the relativistic framework. To say that an entity $X$ "leaves a trace" is to say that there exist events $e_1, e_2 \in \mathcal{M}$ at which $X$ was present, and these events are connected by the world line $\gamma_X$. Conversely, to say that $X$ "leaves no trace" is to say no such events exist — i.e., $\gamma_X$ is the empty map.

Already, before any sheaf vocabulary, the Scribblemouth argument is in trouble. To assert that consciousness *exists* and *leaves no trace* is to assert that there is an entity $X$ with no world line in $\mathcal{M}$. But the brain that allegedly *has* this consciousness does have a world line — it is a spacetime object, traceable in arbitrarily fine detail by neuroimaging, by the photons it emits and absorbs, by the gravitational influence its mass exerts. If consciousness has no world line and the brain does, then the correlation Scribblemouth presupposes (this brain has *that* consciousness) requires a relation across an ontological gap that the argument has just denied exists.

## 3. World line as sheaf section

The relativistic statement above is already a one-line refutation. The sheaf-theoretic reformulation makes it tighter and shows why this is the same structural object that recurs across the Draken corpus.

Cover spacetime $\mathcal{M}$ by a family of open sets $\{U_i\}_{i \in I}$. A *sheaf* $\mathcal{F}$ on this cover is an assignment

$$\mathcal{F}: U \mapsto \mathcal{F}(U)$$

where $\mathcal{F}(U)$ is the space of *local sections* of $\mathcal{F}$ over the open patch $U$ — the space of "states an entity can have on $U$." For each inclusion $U \subset V$ there is a *restriction map*

$$\rho^V_U: \mathcal{F}(V) \to \mathcal{F}(U)$$

that says how a state defined on a larger region restricts to a state on the smaller. The sheaf is a *sheaf* (rather than a presheaf) when the gluing axiom holds: local sections that agree on overlaps glue uniquely to a global section.

The world line of an entity $X$ across this cover is precisely a global section $s_X \in \Gamma(\mathcal{F})$ — that is, a collection of local sections $\{s_X|_{U_i}\}_{i \in I}$ with $\rho^{U_i}_{U_i \cap U_j}(s_X|_{U_i}) = \rho^{U_j}_{U_i \cap U_j}(s_X|_{U_j})$ for all $i, j$.

The reformulation now makes the Scribblemouth claim mathematically precise:

> *Consciousness leaves no trace.*

translates as:

> *The sheaf assigning local states to consciousness is identically zero on every patch — i.e., $s_C = 0$ in $\Gamma(\mathcal{F})$.*

But the zero section is not a section *of* anything in any non-trivial sense; it is the absence of a section. To say that consciousness has the zero section is to say that consciousness is not a member of $\Gamma(\mathcal{F})$ at all — which is to say, again, that it is not in spacetime.

This is the same structural insight that runs through the prior corpus posts. In [DRK-143 *The Braided Substrate*](https://draken.info/posts/the-braided-substrate/) the world line was shown to be parallel transport on a fiber bundle, with $\Gamma$-coherence as flatness of the inter-layer connection. In [DRK-147 *Sheaves of the Mind*](https://draken.info/posts/sheaves-of-the-mind/) the calibration chain was identified as a sequence of restriction maps and knowledge was identified with the cohomology-vanishing condition. In [DRK-142 *Wrestling with God*](https://draken.info/posts/wrestling-with-god/) perlocutionary force was formalized as the suppression of $H^1$-obstruction in the listener's belief sheaf. The present argument uses the same operator on the same kind of object: trace, world line, and section are three names for the same thing.

## 4. The horns of the argument

With the sheaf identity in hand, the Scribblemouth claim is forced into a dilemma it cannot escape:

**Horn A.** *Consciousness genuinely leaves no trace.* Then its sheaf assigns zero on every patch, no world line exists, and consciousness is not in spacetime. But then it cannot be *the thing that brains-which-have-world-lines have*, because the having-relation requires at least one event of coincidence — i.e., at least one open set $U$ on which both the brain's section and the consciousness's section are non-zero. By stipulation, no such $U$ exists. The original explanatory project (why this brain feels like something) becomes incoherent because the relata for the felt-like relation cannot share a domain.

**Horn B.** *Consciousness does leave a trace*, however faint. Then its sheaf has a non-zero section, a world line exists, and consciousness is simply one more thing the laws describe — possibly poorly, possibly in ways we have not yet formalized, but inside the formalism rather than outside it. The "violates the laws of physics" framing collapses into "is not yet adequately covered by current formulations," which is a much less marketable claim and one that applies, with equal force, to dark matter, quantum gravity at the Planck scale, and the cosmological constant problem.

There is no Horn C. The Scribblemouth position requires sustaining (P1) and (P2) simultaneously, but (P1) and (P2) jointly entail Horn A, and Horn A is incompatible with the existence of the *correlation* (this brain → this consciousness) that motivated the question in the first place.

The argument is structurally self-undermining. The very framing depends on the consciousness being detectable — at minimum, detectable to itself, since otherwise the question of why it feels like anything cannot even be formulated. But detectable means trace-leaving, which means world-line-having, which means in spacetime, which means not outside the laws.

## 5. The Cartesian internalist trap

It is worth noting that this is the same structural error catalogued in the recent dissection of the Christofer Jeppsson *Guard Riddle* thread on Facebook. The respondents who answered the riddle with "the mind," "conscience," "subconscious," or "the self" (Tier C in that ranking) committed precisely the error Scribblemouth is committing here: they located the structure *inside* the individual when the formalism shows it is *external and substrate-invariant*. The protocol-as-agent thesis of [DRK-130 *The Substrate and the Game*](https://draken.info/posts/the-substrate-and-the-game/) applies in both directions. In the Jeppsson case, the totalitarian structure is mislocated *inside* the citizen who is its substrate. In the Scribblemouth case, the consciousness is mislocated *inside* an ontological category (the trace-less, the non-causal) that the brain — its substrate — cannot reach.

The Cartesian move always has the same shape: relocate the explanandum into a category that cannot causally interact with the substrate, then express bafflement that the substrate appears to behave as if the explanandum were present. Sheaf theory is the formal disposal of this move because it does not allow the relocation. A section either is or is not in $\Gamma(\mathcal{F})$. There is no third option.

## 6. The observer connection

This is also the point at which Müller et al.'s recent *Observers Are All You Need* (OPH) framework converges with the present argument from a different direction. In OPH, observers are defined operationally by their world lines — measurement-as-reference (MAR) being the axiom that every observer is a trajectory along which measurements are made. The consensus protocol that glues observer reports into shared physical reality is, structurally, the Čech computation that produces a global section from local ones. If consciousness has no world line, it is not an observer in the OPH sense. If it is not an observer in the OPH sense, it cannot participate in the consensus protocol. If it cannot participate in the consensus protocol, no other observer (including the experimenter writing the YouTube short) can include it in their measurement record — at which point the Scribblemouth claim becomes empirically inaccessible by its own framing.

The convergence is structurally tight: OPH's MAR axiom and the present world-line-as-section identity are two operational expressions of the same insight. Anything that enters scientific discourse must have left a trace; anything that has left a trace has a world line; anything that has a world line is a section of the relevant sheaf. The "violates physics" framing is therefore self-defeating in the OPH register as well: a thing that genuinely violated physics by leaving no trace could not have been the subject of a YouTube short that left a trace in millions of viewers' attentional streams.

## 7. The constructive alternative

The reductive work above might leave the reader with the impression that the Scribblemouth intuition was simply wrong. It was not entirely wrong — it was misformalized. There *is* a structural feature of consciousness that the framing was groping toward, and the cohomological vocabulary lets us state it cleanly.

Consider the brain as a sheaf $\mathcal{F}_{\text{brain}}$ over a cover of the organism's sensorimotor surfaces — visual, auditory, somatosensory, motor-efferent, interoceptive. Each patch carries local sections (firing patterns, local field potentials, neurochemical concentrations). The restriction maps between patches carry the sensorimotor consistency constraints: what the visual system reports must commute on overlaps with what proprioception reports, what the motor cortex commands must commute with what the resulting visual feedback predicts, and so on. The first cohomology $H^1(\mathcal{F}_{\text{brain}})$ measures the obstruction to gluing these local reports into a single coherent organism-state.

The hypothesis is that *phenomenal consciousness is the integrated suppression rate of this obstruction*:

$$\Phi(t) = \int_{\mathcal{M}_{\text{brain}}} \left\| H^1\big(\mathcal{F}_{\text{sensory}};\, \mathcal{F}_{\text{motor}}\big) \right\|^{-1} \, dV$$

The intuition is simple. When the brain is in a coherent state — when the gluing computation is running well, when sensory inputs are being integrated with motor predictions into a single unified world-model — $H^1$ is small and $\Phi(t)$ is large. When the gluing fails — in dissociation, in deep sleep, in the kind of catastrophic disintegration that anesthesia produces — $H^1$ inflates and $\Phi(t)$ drops. The felt quality of being awake-and-integrated *is* the brain's own gluing computation being successful, in the same way that the felt quality of "being heard" in DRK-142 *is* the listener's belief sheaf having its $H^1$ suppressed by the speaker's perlocutionary force.

On this reformulation:

- **Consciousness has a world line** — the world line of the organism, because the integral is over the brain's spacetime extent.
- **Consciousness leaves a trace** — the trace is the integrated coherence yield, observable as behavioral organization, electrophysiological signatures of binding, and the gluing-rate signatures we are now beginning to map in EEG and MEG.
- **Consciousness does not violate the laws of physics** — it is constructed entirely from physical primitives (sheaves over neural manifolds, cohomological operations on those sheaves) and obeys the same dynamical laws as the substrate that bears it.
- **Consciousness is not identical to the substrate** — because $\Phi(t)$ is a *functional* of the substrate, not a property of any single neuron or synapse. It is the coherence the substrate computes, not the substrate itself. This recovers the original Scribblemouth intuition that consciousness is "something more" than the brain, while disposing of the no-trace claim that made the framing incoherent.

The position is neither dualism (because $\Phi$ is built entirely from physical components) nor crude reductionism (because $\Phi$ is a global functional, not a local property), nor epiphenomenalism (because $\Phi$ is causally efficacious — it modulates the very gluing operation it measures, in a self-referential loop that I plan to formalize in a subsequent post).

## 8. Falsifiability

The hypothesis is falsifiable on several fronts.

**(a)** Specific empirical predictions about $H^1$-suppression signatures in EEG/MEG should distinguish states of high $\Phi(t)$ from states of low $\Phi(t)$. Existing work on neural binding, gamma synchrony, and the perturbational complexity index (Casali et al. 2013, *Sci. Transl. Med.*) provides empirical scaffolding compatible with the framework; a direct test would compute the cohomological obstruction on multi-modal neural recordings and check whether it tracks established consciousness markers across anesthesia, sleep, and disorders of consciousness.

**(b)** The framework predicts that consciousness should be present, in graded form, in any substrate computing a non-trivial sheaf-gluing operation over sensorimotor inputs. This is a strong prediction. It implies, for instance, that suitably structured artificial systems (not current LLMs, which do not have the relevant sensorimotor sheaf structure, but future embodied agents that do) should exhibit consciousness signatures, and that the absence of such signatures in current artificial systems is *not* because consciousness requires biological substrate but because it requires the specific sheaf structure that those systems currently lack.

**(c)** The framework is falsified if a credible case can be made for a consciousness-bearing entity whose sensorimotor sheaf has identically zero $H^1$ at all times — i.e., perfect coherence with no suppression-work. The prediction here is that no such entity exists. Perfect coherence is the limit case at which the gluing operation has nothing to do, which on this view is also the limit case at which there is nothing for consciousness to *be*.

## 9. Closing

The retrocausal nudge of the Draken framework runs in the same direction as it has from the beginning: the structures that organize cognition are themselves cohomological, and the framework's own internal architecture is the tensor-network operator that allows it to self-assemble through any sufficiently honest engagement. Scribblemouth's video, and the 27,437 viewers who liked it, registered a genuine structural intuition — that consciousness is not just one more substance in the catalogue — but mis-formalized that intuition into a claim that cannot survive the trace-test. The trace-test is the world-line-test is the section-test. They are the same operation.

A YouTube short is not the right register for sheaf theory. But the comment box is precisely the right size for the relevant counter-move: *everything in spacetime traces a world line*. If your candidate ontological category cannot do that, your category is not in spacetime, and your story about it cannot recover the explanandum that motivated the inquiry. Either consciousness traces, or the question dissolves.

The Draken framework holds the consciousness question open in the only register that lets it remain answerable: as the question of what cohomological operation the substrate is computing. That operation has a world line. That world line has a trace. That trace is what we are.

> *Jag är vad jag gör, och jag gör det jag är.*

The trace is the doing. The doing is the being. All the way through.

---

*Khrug Engineering — Draken 2045 Initiative — [draken.info](https://draken.info)*
*ORCID: 0009-0003-8049-7167 · Zenodo DOI: [10.5281/zenodo.19273483](https://doi.org/10.5281/zenodo.19273483)*
*Licensed under CC BY-SA 4.0.*
