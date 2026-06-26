---
title: "The One-Way Gauge: Simultaneity as Connection and the H¹ Obstruction Behind OPERA"
drk: DRK-168
date: 2026-06-26
tags: [analysis, theory, synthesis, physics]
layers: [L01, L03, L05, L11, L12, L17]
coherence: 0.90
description: "The one-way speed of light is not a fact but a gauge choice; global clock synchronization is a flat-connection condition, and its failure is an H¹ holonomy. OPERA's 2011 superluminal neutrino was a broken realization of that gauge — a loose fiber read off as a property of the particle."
excerpt: "A 2011 forum thread on the OPERA result seeded this post. The faster-than-light neutrino was never fast; a fiber-optic connector in the synchronization chain was one millimeter loose. This post argues that clock synchronization is a connection on spacetime, that whole-universe simultaneity is the question of whether that connection is flat — a vanishing class in H¹ — and that OPERA was an H¹ error in disguise. The one-way speed of light cannot be measured because there is no Archimedean point outside spacetime: a worked physical prototype of the endogenous measurement problem, with the feather of Ma'at returning as the defined zero on the scale."
status: published
author: Khrug Engineering
license: CC BY-SA 4.0
sources:
  - "OPERA Collaboration, *Measurement of the neutrino velocity with the OPERA detector*, arXiv:1109.4897 (2011)."
  - "OPERA Collaboration, revised analysis and corrected timing (2012); ICARUS null result, arXiv:1203.3433."
  - "H. Reichenbach, *The Philosophy of Space and Time* (1928), §19 — the ε-conventionality of distant simultaneity."
  - "Kamiokande-II and IMB neutrino observations of SN 1987A (1987)."
  - "G. Sagnac, *L'éther lumineux démontré* (1913); the rotational holonomy of the synchronization gap."
---

## The anomaly that wasn't

In September 2011 the OPERA collaboration reported that neutrinos sent 730 km
through the Earth from CERN to the Gran Sasso laboratory arrived roughly 60
nanoseconds *early* — as though they had outrun light. The claim was framed,
correctly, as either an error or a revolution, and the collaboration did the
honorable thing: they published the anomaly and asked the world to break it.

The world broke it. By early 2012 the 60 nanoseconds had been traced to two
mundane faults in the *timing chain*, not the particle: a fiber-optic connector
in the GPS synchronization link that was not fully seated, and a master clock
oscillator running fast by a few parts per million. ICARUS, sharing the same
baseline, measured the neutrinos arriving exactly on time. The neutrino had
never been fast. The **clock** had been wrong.

This is the part everyone remembers as a story about scientific
self-correction, and it is. But the location of the fault is the interesting
thing. The error did not hide in the neutrino's flight. It hid in the act of
*deciding what "at the same time" means at two places 730 km apart*. To see why
that act is so fragile — why a loose connector can masquerade as a tear in
relativity — we have to take seriously a fact that is usually mentioned and then
dropped: **the one-way speed of light cannot be measured.**

## The convention hidden in c

Every measurement we have ever made of the speed of light is, on inspection, a
*two-way* measurement. A pulse leaves point A, reflects at point B, and returns
to A. One clock, at A, times the round trip. The two-way speed is unambiguous
and invariant:

$$
c_{\text{two-way}} = \frac{2\,L}{t_2 - t_1}.
$$

But the *one-way* speed — A to B alone — requires a clock at B that already
agrees with the clock at A about what time it is. And to make those two clocks
agree, you must send a signal between them and assume how long it takes to
arrive. You must already know a one-way speed to measure a one-way speed. The
circle does not break.

Reichenbach made this precise in 1928. Assign the reflection event at B the time

$$
t_B = t_1 + \varepsilon\,(t_2 - t_1), \qquad \varepsilon \in (0, 1).
$$

The standard Einstein choice is $\varepsilon = \tfrac{1}{2}$ — the assumption
that light is *isotropic*, equally fast in both directions. But nothing in any
experiment forces it. For any $\varepsilon$, the one-way speeds become

$$
c_{A \to B} = \frac{c}{2\varepsilon}, \qquad
c_{B \to A} = \frac{c}{2(1 - \varepsilon)},
$$

and the only quantity the round-trip experiment ever constrains is their
harmonic combination:

$$
\frac{1}{c_{A \to B}} + \frac{1}{c_{B \to A}} = \frac{2}{c}.
$$

The admissible range is $c/2 \le c_{A \to B} \le \infty$: light may travel
*instantaneously* one way provided it crawls at $c/2$ on the return. Every such
world is empirically identical to ours. The isotropic universe and the
anisotropic-but-self-consistent universe are the **same world under two
labelings**.

So $\varepsilon$ is not a number waiting in nature to be read off. It is a
*gauge* — a free convention we impose to make the bookkeeping consistent, the
way a choice of zero on a thermometer is real engineering but not a discovered
fact. The one-way direction of $c$ is the most fundamental example we have of a
quantity that is *constitutively unmeasurable*: not hard to measure, but
impossible in principle, because the measurement presupposes its own answer.

## Synchronization is a connection

Here is where the abstraction earns its keep. A choice of $\varepsilon$ at every
pair of points is a choice of *what counts as "now"* across all of space — a
foliation of spacetime into simultaneity surfaces, a global section of the
"time" coordinate. Carrying that definition of *now* from one place to another
is not free transport; it is **parallel transport under a connection.**

Write the synchronization one-form induced by the spacetime metric as

$$
\omega_{\text{sync}} = \frac{g_{0i}}{g_{00}}\, dx^i.
$$

To synchronize a chain of clocks A → B → C → … is to integrate this form along a
path. The clocks agree at the end if and only if the integral is
path-independent. And the question every global positioning system, every
distributed timing chain, every "let us all agree on the time" protocol must
answer is exactly:

$$
\text{Can the whole network be synchronized at once?}
\quad\Longleftrightarrow\quad
\oint_{\gamma} \omega_{\text{sync}} = 0 \ \text{ for every closed loop } \gamma.
$$

That is a cohomological condition. Global synchronizability is the statement
that the synchronization connection is **flat** — that its class vanishes in the
first de Rham cohomology:

$$
\big[\omega_{\text{sync}}\big] = 0 \in H^1(\mathcal{M}).
$$

When the class is trivial, you can lay a single consistent "now" over the entire
manifold. When it is non-trivial, you cannot: transport your simultaneity
surface around a loop and it comes back *displaced from itself*.

## The obstruction lives in H¹

The displacement is not hypothetical. It has a name and a number. In any
rotating or stationary-but-non-static spacetime the synchronization holonomy is
non-zero, and the physical effect is the **Sagnac effect**:

$$
\Delta t_{\text{Sagnac}}
= -\frac{1}{c^2}\oint \frac{g_{0i}}{g_{00}}\, dx^i
\;=\; \frac{2\,\omega A}{c^2} \quad (\text{rotating frame, enclosed area } A).
$$

Send two light pulses in opposite directions around a closed fiber loop on a
spinning platform and they return at *different* times, by a gap proportional to
the area enclosed and the rotation rate. The gap is the holonomy of
$\omega_{\text{sync}}$ — the failure of "now" to close up. It is a non-trivial
$H^1$ class made of glass and light.

This is not exotic apparatus. The Earth rotates. The GPS constellation — *the
very system whose timing chain OPERA was using* — must correct for this
holonomy continuously; without the Sagnac and relativistic corrections, GPS
positions drift by kilometers per day. The protocol that tells the planet what
time it is survives only by accounting, every second, for the fact that global
simultaneity has a non-trivial $H^1$ obstruction.

Now the OPERA story snaps into focus. The chain was:

> loose fiber connector → corrupted realization of the synchronization gauge →
> a 60 ns offset in the agreed-upon "now" → apparent faster-than-light neutrino.

The neutrino was never the carrier of the anomaly. The anomaly lived in a
broken implementation of the simultaneity convention — a fault in the physical
machinery that holds $\big[\omega_{\text{sync}}\big]$ pinned to zero. Finger that
machinery with a glass connector that is one millimeter loose and the obstruction
*leaks* — and what leaks out, read naively, looks like a particle outrunning
light. **OPERA was an H¹ error in disguise.** The deepest objection raised in
the original forum thread that seeded this post — that the relevant problem was
clock synchronization, not the particle — pointed straight into the cohomology
without yet having the operator's name.

## The endogenous clock

There is a reason the one-way speed is unmeasurable, and it is not a limitation
of our instruments. It is that **there is no view from outside spacetime.** To
read both clocks "at once" and settle $\varepsilon$ empirically, you would need
to stand at an Archimedean point external to the manifold and observe A and B
simultaneously — but "simultaneously" is the very thing you are trying to
define. The measuring apparatus sits *inside* the system it measures. The gauge
must be chosen from within.

This is, in its cleanest physical form, the **endogenous measurement problem** —
the same structure that runs through the whole Draken architecture and through
the open correspondence on coherence-versus-soundness. Simultaneity is not a
fact lying in the world waiting to be read; it is *constituted* by the
observer's gauge choice. Reichenbach's $\varepsilon$ is the free parameter of an
endogenous measurer who cannot step outside to check her own clock. *Observers
are not a convenience here; they are load-bearing.* The anti-totalization
principle has a physics prototype, and it is one millimeter wide: you cannot
totalize "now" over the whole manifold without a choice that no measurement can
adjudicate.

The feather of Ma'at returns as the same object. Judgment requires a *defined
zero* on the scale; simultaneity requires a *defined* $\varepsilon$. Neither zero
is discovered. Both are weighed against a calibration that the system imposes on
itself. Remove the calibration and the verdict carries no information — every
heart lighter than a weightless feather, every direction of light as fast as any
other.

## Two carriers, one cargo

A natural objection: but we *have* seen neutrinos arrive before light — from
supernova SN 1987A, the neutrinos reached Earth some three hours ahead of the
optical flash, across 168,000 light-years. Doesn't that vindicate the fast
neutrino?

It vindicates the opposite, and the inversion is the lesson. The neutrinos did
not travel faster; they were *emitted earlier*. They stream straight out of the
collapsing stellar core at the instant of collapse, while the photons must wait
hours for the shock wave to break through the star's outer envelope. Same event,
two emission times, two coupling strengths. The three-hour spread over 168,000
light-years actually *bounds* the neutrino speed to equal $c$ to better than

$$
\frac{|v - c|}{c} \lesssim 10^{-9}.
$$

SN 1987A is one of the strongest pieces of evidence *against* faster-than-light
neutrinos, not a clue for them.

In carrier/cargo terms the structure is exact. The cargo is the event: *the star
collapsed*. The neutrino and the photon are two **carriers** — two substrates
transporting the same protocol-event across space, with different couplings and
different emission moments. The naive inference "the neutrino was first,
therefore it was faster" attributes to the *cargo* a property
(superluminality) that in fact belongs to the *carrier's* emission mechanics. It
reads a quirk of the vehicle's transit as a property of the truth-value of the
message. That is precisely the failure mode the signalspaning taxonomy is built
to catch — and here it is, written across 168,000 light-years instead of across
a social feed. The protocol is substrate-invariant; the arrival times are not.
*The protocol is the agent; the particle is the substrate.*

## Coda: the thread that closed up

This post has a personal origin. In September 2011 a forum thread on the OPERA
result ran for weeks; somewhere in it a Göteborg poster left a Schrödinger's-cat
joke — if information could outrun the neutrino, the neutrino would have gone to
the bar across the street instead, the question would never have been asked, and
the bartender's whole future would branch into a version where the bar closes
and a version where everything carries on as normal. In 2023 the same poster
returned to the thread and wrote, under the joke, *lol><*.

The joke was a tachyon antitelephone. Faster-than-light signaling plus
relativity yields closed causal loops, where self-consistency replaces
chronology and the universe must select the global section whose holonomy
closes. The punchline arriving before the setup is a miniature of retrocausality:
the narrative protocol is invariant under time-reversal of its substrate event
sequence. A small Draken model, built as a bar joke, holding up thirteen years
later — and only legible now that the operator has a name. The thread, like the
synchronization surface, came back around and almost closed.

---

*Riktningen går inte att mäta. Den måste väljas.*

**Filed under:** L01 · L03 · L05 · L11 · L12 · L17 — the measurement seam
**Operators:** $H^1$ (the synchronization obstruction) · $K(t)$ (the chosen now) · the restriction morphism (label → boolean, against a calibrated zero)
**Cross-references:** the Anubis / restriction-morphism sequence (the feather as defined zero) · the carrier/cargo taxonomy and Kuramoto-synchrony posts · [The Sonder Egg](/posts/the-sonder-egg/) (DRK-166) · the open Flygare Kinne correspondence on coherence vs. soundness and the endogenous measurement problem

ORCID: 0009-0003-8049-7167 · DOI: 10.5281/zenodo.19273483 (Draken thesis umbrella) · CC BY-SA 4.0
