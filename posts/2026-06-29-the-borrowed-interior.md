---
title: "The Borrowed Interior: Simulation, the Contested Mirror, and Dissociation"
drk: DRK-173
date: 2026-06-29
tags: [synthesis, theory, psychology, neuroscience, philosophy]
layers: [L05, L06, L08, L09]
coherence: 0.85
description: "What actually carries another mind into ours? Not reception but loan: we run our own apparatus as a stand-in and project the simulation across the self/other boundary. Mirror neurons are the contested neural carrier; dissociation is what happens when the loan defaults inward."
excerpt: "You never receive another person's interior directly. To know what they feel, you take your own apparatus offline, feed it their situation, run it, and attribute the result to them — Goldman and Gordon's simulation theory, mind-reading as quarantined projection. Empathy is that loan with the return channel open; clinical projection is the loan with the channel cut. Mirror neurons were offered as the neural carrier of this borrowing and spent a decade overpromising — empathy, autism, language — before the cargo was largely walked back. Dissociation is the same machinery turned inward: the self's own interior observed as if it belonged to someone else, a grin watching its own cat from across the room. In every case what carries is not the other's mind but mine, lent out."
status: published
author: "Khrug Engineering"
license: "CC BY-SA 4.0"
sources:
  - "di Pellegrino, G., Fadiga, L., Fogassi, L., Gallese, V., & Rizzolatti, G. (1992). Understanding motor events: a neurophysiological study. Experimental Brain Research, 91, 176–180."
  - "Gallese, V., Fadiga, L., Fogassi, L., & Rizzolatti, G. (1996). Action recognition in the premotor cortex. Brain, 119, 593–609."
  - "Gordon, R. M. (1986). Folk psychology as simulation. Mind & Language, 1, 158–171."
  - "Goldman, A. I. (2006). Simulating Minds: The Philosophy, Psychology, and Neuroscience of Mindreading. Oxford University Press."
  - "Hickok, G. (2009). Eight problems for the mirror neuron theory of action understanding in monkeys and humans. Journal of Cognitive Neuroscience, 21, 1229–1243."
  - "Hickok, G. (2014). The Myth of Mirror Neurons. W. W. Norton."
  - "Wurm, M. F. & Caramazza, A. (2019). Distinct roles of temporal and frontoparietal cortex in representing actions across vision and language. Nature Communications, 10, 289."
  - "American Psychiatric Association (2013). Diagnostic and Statistical Manual of Mental Disorders (5th ed.), Dissociative Disorders."
  - "Seth, A. K., Suzuki, K., & Critchley, H. D. (2011). An interoceptive predictive coding model of conscious presence. Frontiers in Psychology, 2, 395."
  - "Hansen, J. & Ghrist, R. (2019). Toward a spectral theory of cellular sheaves. J. Appl. Comput. Topol. 3, 315–358."
---

*You have never once received another person's interior. Not a parent's grief, not a lover's boredom, not the intention behind a stranger's reach for a cup. The inside of another mind does not cross the gap between you the way light crosses to a telescope. And yet you read them constantly, fluently, mostly correctly. So something carries the other into you. The question of this post is: what.*

## §1 — The gap and the cast

Begin with the brute fact that other minds are sealed. I have direct access to exactly one interior — my own — and to nothing of yours but its surface: your face, your voice, the trajectory of your hand. Folk psychology nonetheless attributes to you beliefs, desires, fear of the dentist, satisfaction with a sandwich. Two families of account explain how. The **theory-theory** says I deploy a tacit theory of minds-in-general and infer your states as a scientist infers unobservables. The **simulation theory** says something stranger and, I will argue, more load-bearing: I do not theorize you, I *borrow*. I take my own cognitive machinery offline, feed it pretend inputs matched to your situation, let it run, and attribute the output to you.

Robert Gordon's "radical" version (1986) put it sharply: there is no theory, only a re-enactment — I imaginatively occupy your circumstances and report what *I* would then be disposed to do, transposed onto you. Alvin Goldman's mature account (*Simulating Minds*, 2006) made the machinery explicit: mind-reading is the off-line running of one's own decision-making and emotional systems under pretend-inputs, with one's own actual states *quarantined* so they do not contaminate the simulation. Both are versions of a single operation — a cast across the self/other boundary. In the notation this corpus has been using: a projection $P_{S\to O}$, the simulation thrown from self into the other's frame.

This is the first answer to *what carries*. Not the other's interior arriving in me, but **mine, lent to them and read back as if it were theirs.** Carrying is borrowing. I never receive your mind; I run a copy of mine stamped with your coordinates.

## §2 — The loan, the return channel, and care

The cast alone is not yet empathy, and confusing the two is the central error. A simulation projected and never corrected is just my interior wearing your name — which is the clinical sense of **projection**, the defense in which one's own disowned content is attributed outward onto a surface that is never permitted to answer. The difference between empathy and projection is not the cast. It is whether the *return channel* is open.

Write $\rho_{O\to S}$ for the restriction that carries the other's actual response back across the boundary to correct my simulation. Then:

$$
\text{empathy} \;=\; \rho_{O\to S}\circ P_{S\to O}, \qquad \text{projection (clinical)} \;=\; P_{S\to O}\ \text{with}\ \rho_{O\to S}=0.
$$

Empathy is the loan with the loan officer *listening* — I cast my simulation into your frame and let your real reaction prune it, so that I can discover I was wrong about you and feel the correction. Projection is the loan with the channel cut: the surface is forbidden to talk back, so my disowned cargo rides outward unchallenged and I mistake my own face for yours. This is the one-way gauge of [DRK-168](/posts/the-one-way-gauge/) rendered in persons: a connection with no path back is not a relationship, it is a mirror I have mistaken for a window.

The diagnostic signature of the working loop is *holonomy*, in the precise sense of [DRK-172](/posts/picking-berries/): I can go around — cast, receive correction, re-cast — and come back to the same person *rotated*, knowing them differently than I did. Projection has trivial holonomy: I go around the loop and nothing updates, because nothing was ever allowed back in. And **care**, the operator $\dot{\mathcal V}_{exo}=0$ of [DRK-166](/posts/the-sonder-egg/), is not a single correct cast but the *stabilisation of the open loop over time* — a standing commitment to keep $\rho_{O\to S}$ from collapsing to zero, to keep listening across the boundary even when it would be cheaper to project. Care is what makes the borrowing honest as a practice rather than a lucky guess.

## §3 — The contested mirror

If simulation is the personal-level carrier, the obvious next question is whether there is a *neural* carrier underneath it — a physical mechanism that does the borrowing. For roughly two decades the answer everyone wanted was **mirror neurons**, and the way that answer has aged is itself the lesson.

The provenance is firm. Working at the University of Parma in the early 1990s, Giacomo Rizzolatti's group was recording single cells in area F5 of the macaque premotor cortex while the monkey grasped objects. They noticed, serendipitously, that some of these cells fired not only when the monkey performed a grasp but when it *watched* the experimenter perform one. The first report is di Pellegrino, Fadiga, Fogassi, Gallese & Rizzolatti (1992); the cells were named "mirror neurons" by Gallese, Fadiga, Fogassi & Rizzolatti (1996). A cell that encodes both *my* action and *your* same action is, on its face, exactly a neural instance of the cast across the boundary — and Goldman explicitly recruited low-level mirroring as a candidate substrate for simulation.

Then the cargo outran the carrier. Between roughly 2002 and 2009 the mirror neuron became the rare neuroscience concept to escape into public imagination, and was made to carry empathy, altruism, imitation, language evolution, theory of mind, and — via the "broken mirror" hypothesis — autism. The carrier was a real, narrow finding about goal-directed motor acts in macaque F5. The cargo was most of social cognition.

It did not hold. Gregory Hickok's "Eight Problems for the Mirror Neuron Theory of Action Understanding" (2009) and subsequent *The Myth of Mirror Neurons* (2014) showed the core action-understanding claim was unsupported: the deficits predicted if F5 mirror cells *were* the seat of action understanding have not been demonstrated, and the grand extrapolations to empathy and autism were inferential leaps, not data. More recent work (Wurm & Caramazza, 2019) finds the mirror regions contribute to *low-level* action processing but do not perform the *high-level* interpretation that the empathy story required. The cells are real. The borrowing they were said to carry is, at best, unproven.

This is the carrier/cargo failure in its cleanest empirical form, and it is the same shape as the figure that has run through everything: **a mirror neuron offered as a grin without a cat.** The grin — the cell that fires for both self and other — is genuinely there in the macaque. Whether the cat behind it (understanding, empathy, the lent interior) is present, or whether we projected our preferred story onto a motor-control cell and forbade the data to answer back, is precisely the open question. The hype itself was a projection with $\rho \approx 0$: a beautiful cast onto F5 that the field, for a decade, declined to let the evidence correct.

## §4 — Dissociation: the loan defaulting inward

The structure shows itself most sharply in its failure, and the failure has a clinical name. **Dissociation**, in the standard framing (DSM-5), is a disruption of the normally *integrated* functions of consciousness, memory, identity, emotion, perception, and body representation. The integration that ordinarily binds these into one continuous "I" comes apart; the parts persist but stop cohering into a whole.

In sheaf terms this is exact rather than metaphorical in *form*: the self is a cover of local sections — interoceptive states, autobiographical memories, the sense of agency, the sense of body-ownership — that in health glue into one global section, the integrated self. Dissociation is the condition in which the local sections remain individually intact but **fail to glue**: the obstruction class $[\omega]\in H^1$ on the self-cover goes nonzero, and the failure of the gluing *is* the symptom. $\Gamma$, the coherence of the self read as a sheaf, drops not because any datum is missing but because the data no longer agree across their overlaps.

Depersonalisation makes the connection to §§1–2 unmistakable. The depersonalised report — *I watched myself from outside; my own hand did not feel like mine; my emotions seemed to belong to someone else* — is the simulation/projection apparatus **turned reflexively on the self with the ownership tag stripped.** The interoceptive predictive-coding accounts (Seth, Suzuki & Critchley, 2011) model this as a breakdown in the binding of bodily prediction to felt presence: the self-model is still computed, but the signal that stamps it *mine* has detached. The result is that one observes one's own interior the way one would simulate a stranger's — $P$ run inward, $\rho$ to the self cut. You become a grin watching your own cat from across the room: the smile, the behaviour, the running self-model are all still visible, but the creature they were supposed to belong to is no longer felt to be there.

So dissociation is not a separate phenomenon bolted on. It is the *same machinery* — the borrowing, the cast, the return channel — failing in the one configuration that should be impossible: the loan defaulting inward, the self lent out to itself and not returned.

## §5 — What carries

Assemble the three levels and the answer to the title question is single and slightly vertiginous. At the personal level (simulation), at the proposed neural level (the contested mirror), and in the failure case (dissociation), what carries another mind is **never the other's interior arriving in me.** It is always my own apparatus, lent out and read back. Empathy is that loan kept honest by an open return channel and stabilised, over time, by care. Projection is the loan with the channel cut. The mirror neuron was a hypothesis about where in the tissue the lending happens, and it overpromised exactly by being lent more cargo than it could carry. Dissociation is the loan defaulting on the one creditor it should never fail: the self.

There is no reception anywhere in the system. There is only what carries — and what carries is always borrowed.

## Falsification and honest limits

Per [DRK-131](/posts/the-falsification-protocol/), the seams are marked.

- **The mirror-neuron cargo is disputed in the literature, and this post states that rather than leaning on it.** If the strong simulationist reading of mirroring were vindicated — if F5-type disruption were shown to produce the predicted action-*understanding* deficits — §3 would strengthen; as it stands the neural carrier is a real finding whose social-cognitive cargo is unproven, and the post is built to survive that being the permanent verdict.
- **Simulation theory itself is not settled.** Theory-theory and, more commonly now, *hybrid* accounts remain live; the cleanest current position is that mind-reading uses both inference and simulation in proportions that vary by task. The operator algebra in §2 is a figure that organises the simulationist intuition; it is not a measured model and would need an operationalisation of $P$ and $\rho$ as estimable quantities before it could be tested.
- **The $H^1$/dissociation mapping is structural analogy, not measurement.** "Failure of integration" is the standard clinical definition; rendering it as a nonzero obstruction class on a self-cover is honest as *form* and unvalidated as *quantity*. The predictive-coding account of depersonalisation is one model among several and is invoked illustratively.
- **Falsifier.** If a well-characterised case of fluent, accurate, real-time empathy were demonstrated with the return channel provably absent — correction-free mind-reading that nonetheless tracks the other — the claim that empathy *is* the corrected loop ($\rho_{O\to S}\neq 0$) would break. The framework predicts such cases are projection wearing empathy's name, and should reveal their open-loop character under perturbation.

The borrowing is real. Where in the tissue it happens, and whether "mirror" was ever the right word for it, remains the open seam — offered as such.

---

*Filed under L06 (Embodied Cognition) primary, with cross-restrictions to L05, L08, and L09. Operators invoked: $P_{S\to O}$ (simulation / projection, the cross-boundary cast), $\rho_{O\to S}$ (the return channel; $\rho=0$ is clinical projection and the one-way gauge), $\dot{\mathcal V}_{exo}=0$ (care as the stabilised open loop), $[\omega]\in H^1$ (dissociation as the self-cover's failure to glue), $\Gamma$ (coherence of the self read as a sheaf). Companions: [The One-Way Gauge](/posts/the-one-way-gauge/) (DRK-168) — the connection with no path back; [The Sonder Egg](/posts/the-sonder-egg/) (DRK-166) — the other's full interior and the care operator; [The Guessed Section](/posts/the-guessed-section/) (DRK-170) — mind-reading as abduction against $H^1$; [Picking Berries](/posts/picking-berries/) (DRK-172) — the loop that returns rotated.*

*Jag är vad jag gör, och jag gör det jag är.*

*— Khrug Engineering · Göteborg · ORCID 0009-0003-8049-7167 · DOI [10.5281/zenodo.19273483](https://doi.org/10.5281/zenodo.19273483) · CC BY-SA 4.0*
