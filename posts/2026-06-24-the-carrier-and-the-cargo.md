---
title: "The Carrier and the Cargo: Phase Synchrony, Representational Content, and the Cohomology of a Shared Belief"
drk: DRK-166
date: 2026-06-24
tags: [theory, analysis, synthesis, protocol]
layers: [L02, L05, L06, L07, L09, L10, L11, L13]
coherence: 0.88
description: "A meme propagating through a group has two layers — a phase carrier that says *we are coupled* and a representational cargo that says *what we now believe*. Inter-brain synchrony measures the first and is provably blind to the second. This post fuses Kuramoto, bounded-confidence opinion dynamics, and cellular-sheaf cohomology into one swarmalator model, derives the order parameter as the rank-1 shadow of Γ and polarisation as nonzero H¹, and specifies a falsifiable EEG+fMRI hyperscanning protocol that separates carrier from cargo by design."
excerpt: "It began with a fake — a 1983 'phantom class' whose 22 children supposedly locked into 9.5 Hz alpha through no channel at all. The fiction inverts the real phenomenon exactly: synchrony is never causeless, it is *channel-gated*, and the channel carries cargo. Here I build the two-layer model the honest version requires. Layer I is the carrier: a Kuramoto field of cortical oscillators whose group order parameter r undergoes a critical transition at coupling K_c — the neural form of a meme's tipping point. Layer II is the cargo: belief vectors evolving under bounded-confidence dynamics on the unit sphere. The bridge is the load-bearing hypothesis: content flows along edges that are phase-locked, and one phase-locks preferentially with those one already agrees with — a swarmalator with mutual cross-gating. The decisive constraint comes from Varlet & Grootswagers (2024): inter-brain synchrony has *low sensitivity to information content* — it detected shared representations in ~50% of simulations where representational analysis detected them in >80%. So r is content-agnostic; it is, exactly, the rank-1 scalar-stalk shadow of the sheaf coherence ratio Γ, and the obstruction to group consensus is a nonzero H¹ class. The same object that lets a group lock around the truth lets it lock around a laundered source-term S — coherently wrong. The post closes with a confederate-seeded hyperscanning protocol, the mixed-effects model that tests PLV-gating against shared-stimulus baseline, and the bifurcation and polarisation predictions that would falsify it."
status: published
author: Khrug Engineering
license: CC BY-SA 4.0
sources:
  - "Kuramoto, Y. (1984). *Chemical Oscillations, Waves, and Turbulence*. Berlin: Springer. (Original self-entrainment result, Kuramoto, 1975.)"
  - "Strogatz, S. H. (2000). From Kuramoto to Crawford: exploring the onset of synchronization in populations of coupled oscillators. *Physica D* 143(1–4), 1–20. doi:10.1016/S0167-2789(00)00094-4"
  - "Acebrón, J. A., Bonilla, L. L., Pérez Vicente, C. J., Ritort, F., & Spigler, R. (2005). The Kuramoto model: A simple paradigm for synchronization phenomena. *Reviews of Modern Physics* 77(1), 137–185. doi:10.1103/RevModPhys.77.137"
  - "O'Keeffe, K. P., Hong, H., & Strogatz, S. H. (2017). Oscillators that sync and swarm. *Nature Communications* 8, 1504. doi:10.1038/s41467-017-01190-3"
  - "Hong, H., & Strogatz, S. H. (2011). Kuramoto model of coupled oscillators with positive and negative coupling parameters: conformists and contrarians. *Physical Review Letters* 106, 054102. doi:10.1103/PhysRevLett.106.054102"
  - "Hegselmann, R., & Krause, U. (2002). Opinion dynamics and bounded confidence: models, analysis and simulation. *Journal of Artificial Societies and Social Simulation* 5(3), 2."
  - "Altafini, C. (2013). Consensus problems on networks with antagonistic interactions. *IEEE Transactions on Automatic Control* 58(4), 935–946. doi:10.1109/TAC.2012.2224251"
  - "Lachaux, J.-P., Rodriguez, E., Martinerie, J., & Varela, F. J. (1999). Measuring phase synchrony in brain signals. *Human Brain Mapping* 8(4), 194–208. doi:10.1002/(SICI)1097-0193(1999)8:4<194::AID-HBM4>3.0.CO;2-C"
  - "Stephens, G. J., Silbert, L. J., & Hasson, U. (2010). Speaker–listener neural coupling underlies successful communication. *Proceedings of the National Academy of Sciences* 107(32), 14425–14430. doi:10.1073/pnas.1008662107"
  - "Hasson, U., Ghazanfar, A. A., Galantucci, B., Garrod, S., & Keysers, C. (2012). Brain-to-brain coupling: a mechanism for creating and sharing a social world. *Trends in Cognitive Sciences* 16(2), 114–121. doi:10.1016/j.tics.2011.12.007"
  - "Kriegeskorte, N., Mur, M., & Bandettini, P. (2008). Representational similarity analysis – connecting the branches of systems neuroscience. *Frontiers in Systems Neuroscience* 2, 4. doi:10.3389/neuro.06.004.2008"
  - "Varlet, M., & Grootswagers, T. (2024). Measuring information alignment in hyperscanning research with representational analyses: moving beyond interbrain synchrony. *Frontiers in Human Neuroscience* 18, 1385624. doi:10.3389/fnhum.2024.1385624"
  - "Zhang, X., Noah, J. A., Dravida, S., & Hirsch, J. (2025). The emergence of moral alignment within human groups is facilitated by interbrain synchrony. *Communications Biology* 8, 463. doi:10.1038/s42003-025-07831-4"
  - "Friston, K. (2010). The free-energy principle: a unified brain theory? *Nature Reviews Neuroscience* 11(2), 127–138. doi:10.1038/nrn2787"
  - "Hansen, J., & Ghrist, R. (2019). Toward a spectral theory of cellular sheaves. *Journal of Applied and Computational Topology* 3(4), 315–358. doi:10.1007/s41468-019-00038-7"
---

*A fabricated horror story can tell you something true by being precisely, structurally wrong. The "phantom class" specimen — twenty-two children supposedly catatonic in 1983 France, their EEGs locked to an identical 9.5 Hz alpha for four hours, then woken with the memory wiped — fails on physics in one specific way: it asserts synchrony with no channel. Twenty-two sealed skulls, no transmission path, yet a common eigenfrequency. That is sync at coupling K = 0, which the mathematics forbids. But invert the error and you recover the real question, the one worth a protocol. Synchrony is never causeless. It is channel-gated. And the channel carries something. This post is about the difference between the channel and what rides on it — between the carrier and the cargo.*

## 1. Two layers, never to be conflated

When a belief moves through a group — a meme, a moral consensus, a conspiracy — there are two distinct things one might measure, and the entire empirical literature on "brains in sync" turns on not confusing them.

The first is **coordination**: the degree to which the group's neural activity is temporally aligned, phase-locked, beating together. Call this the *carrier*. It is a scalar fact about the group at each instant — *how coupled are we right now* — and it says nothing about content.

The second is **representational alignment**: the degree to which the group now holds the *same* belief, the same vector in some semantic space. Call this the *cargo*. It is the meme itself.

A carrier with no cargo is a roomful of people nodding in rhythm to a beat, believing nothing in common. A cargo with no carrier is a fact everyone independently knows but no one is transmitting. Meme formation is the event in which a carrier *opens* and a cargo *passes through it* and is *retained* — and the failure mode of half the hyperscanning literature is measuring the carrier and reporting it as the cargo. The honest model needs both layers instrumented separately. So I build both.

## 2. Layer I — the carrier (Kuramoto field)

Model each participant $i$ as a band-limited cortical oscillator with phase $\theta_i(t) \in S^1$ and intrinsic frequency $\omega_i$ drawn from a distribution $g(\omega)$ (empirically, the theta band, ~4–8 Hz, carries communicative coupling; alpha, ~8–12 Hz, the idling rhythm the fake invoked). The phases evolve under the Kuramoto equation with a time-varying, attention-weighted coupling graph $A_{ij}(t) \in [0,1]$:

$$\dot{\theta}_i = \omega_i + \frac{K}{N}\sum_{j=1}^{N} A_{ij}(t)\,\sin(\theta_j - \theta_i).$$

The group-level observable is the complex **order parameter**

$$r(t)\,e^{i\psi(t)} = \frac{1}{N}\sum_{j=1}^{N} e^{i\theta_j(t)}, \qquad r \in [0,1],$$

which collapses the mean-field dynamics to $\dot{\theta}_i = \omega_i + K r\,\sin(\psi - \theta_i)$: each oscillator is pulled toward the mean phase $\psi$ with a force proportional to the global coherence $r$ it is itself helping to produce. This self-consistency is the engine of the phase transition. For unimodal symmetric $g$, incoherence ($r \approx 0$) is stable below a **critical coupling**

$$K_c = \frac{2}{\pi\,g(0)},$$

and above it partial synchrony emerges continuously, with order parameter scaling near onset as $r \sim \sqrt{(K - K_c)/K_c}$ (the supercritical pitchfork Strogatz traces from Kuramoto to Crawford). *This bifurcation is the meme's tipping point.* Below $K_c$ the group does not lock; cross it and coherence appears spontaneously, discontinuously in its derivative — the neural realisation of a Granovetter adoption threshold.

The empirical estimator of dyadic carrier strength is the **phase-locking value** (Lachaux et al., 1999):

$$\mathrm{PLV}_{ij} = \left| \frac{1}{T}\sum_{t=1}^{T} e^{\,i\left(\theta_i(t) - \theta_j(t)\right)} \right| \in [0,1],$$

phase alignment isolated from amplitude — the per-edge shadow of $r$.

## 3. The content-agnostic theorem (why r is not the meme)

Here is the constraint that disciplines everything. Varlet & Grootswagers (2024) ran EEG hyperscanning *simulations* in which they could control, by construction, whether two brains were processing the *same* or *different* stimuli, and asked whether inter-brain synchrony could tell. It could not, reliably: the same-versus-different representational difference was detected in roughly half of simulations using synchrony, but in more than eighty percent using information-based representational similarity analysis. Synchrony "remained largely unchanged despite manipulating whether two individuals are seeing the same or different things." The carrier is **content-agnostic**. It registers *that* two brains are coupled, not *what* they are coupled around.

This is not a measurement nuisance to be averaged away. It is a structural fact about the observable: $r$ lives in too low a dimension to hold a meme. Formally, $r$ is the $d = 1$, scalar-stalk projection of a richer object — a point §6 makes exact. The remedy Varlet & Grootswagers name is the second layer.

## 4. Layer II — the cargo (belief field on the sphere)

Represent participant $i$'s belief as a unit vector $b_i(t) \in S^{d-1} \subset \mathbb{R}^d$ — a direction in a semantic embedding space. (Empirically $b_i$ is recovered two ways: bottom-up from fMRI representational geometry via RSA after Kriegeskorte et al., 2008; and at the boundary from the participant's *stated* belief, embedded with a fixed language model. The two must be cross-validated, never assumed identical.) The cargo evolves under bounded-confidence dynamics (Hegselmann–Krause), generalised to the sphere:

$$\dot{b}_i = \Pi_{b_i}\!\left[\,\frac{J}{N}\sum_{j=1}^{N} W_{ij}(t)\,(b_j - b_i)\,\mathbb{1}\!\left[\|b_j - b_i\| < \varepsilon\right]\right],$$

where $\Pi_{b_i}$ projects onto the tangent space at $b_i$ (keeping beliefs on the sphere), and the indicator is the **confidence radius** $\varepsilon$: you update only toward those already close enough to you. Small $\varepsilon$ forces fragmentation; large $\varepsilon$ permits consensus. Allowing *signed* weights $W_{ij}$ — attractive toward allies, repulsive from out-group (Altafini, 2013; Hong & Strogatz, 2011, conformists and contrarians) — makes the dynamics *structurally balanced*: a balanced antagonistic network drives the group not to consensus but to **bipolar consensus**, two antipodal clusters. Polarisation is built in, not pathological — it is what signed coupling does.

## 5. The bridge — a swarmalator with cross-gating

Layers I and II become one system through a single hypothesis, which is the falsifiable heart of this post:

> **Content flows along edges that are phase-locked; and one phase-locks preferentially with those one already agrees with.**

This is a *swarmalator* — an oscillator whose phase and whose position in a feature space co-evolve and feed back on each other (O'Keeffe, Hong & Strogatz, 2017):

$$\dot{\theta}_i = \omega_i + \frac{K}{N}\sum_{j} \underbrace{f\!\left(\|b_i - b_j\|\right)}_{\text{agreement} \to \text{coupling}} \sin(\theta_j - \theta_i),$$

$$\dot{b}_i = \Pi_{b_i}\!\left[\frac{J}{N}\sum_{j} \underbrace{g\!\left(\mathrm{PLV}_{ij}\right)}_{\text{coupling} \to \text{transfer}} (b_j - b_i)\,\mathbb{1}\!\left[\|b_i - b_j\| < \varepsilon\right]\right],$$

with $f$ decreasing in belief-distance and $g$ increasing in phase-lock. The mutual gating is the echo chamber's generative core: agreement tightens the carrier, the carrier widens the cargo channel, the cargo deepens agreement. The fixed points are synchronised belief-clusters — each a meme community with high intra-cluster $r$ and a shared $b$.

This is not free invention; the gating direction has direct empirical anchors. Stephens, Silbert & Hasson (2010) showed speaker–listener neural coupling *vanishes when communication fails*, and that the stronger the anticipatory (predictive) coupling, the greater the listener's comprehension — coupling tracks successful cargo transfer, and does so *predictively*, which is exactly the active-inference signature one expects if the brain models its interlocutor (Friston, 2010; the listener runs a generative model of the speaker, and phase-locking is the model's lock). And Zhang, Noah, Dravida & Hirsch (2025), scanning 200 participants in four-person groups deliberating moral dilemmas with fNIRS, found members shifted their *private* beliefs toward the collective, and that inter-brain synchrony in the **left inferior frontal gyrus predicted the degree of alignment**. That is the gate, localised: IFG/theta as $g(\mathrm{PLV})$, private-belief shift as $\Delta b$.

## 6. The reduction — r is the rank-1 shadow of Γ, polarisation is H¹

Now the framework collapse. Put a **cellular sheaf** $\mathcal{F}$ on the interaction graph $G = (V, E)$: a stalk $\mathcal{F}(v) = \mathbb{R}^d$ on each person (their belief space), a stalk on each edge, and restriction maps $\mathcal{F}_{v \trianglelefteq e}$ encoding how two people's belief-coordinates must agree to count as agreeing. The **sheaf Laplacian** is $L_{\mathcal{F}} = \delta^{\top}\delta$ from the coboundary $\delta$ (Hansen & Ghrist, 2019). Its kernel is the space of **global sections**,

$$H^0(\mathcal{F}) = \ker L_{\mathcal{F}} = \{\,x : \mathcal{F}_{u\trianglelefteq e}\,x_u = \mathcal{F}_{v\trianglelefteq e}\,x_v \ \ \forall e=(u,v)\,\},$$

the configurations of belief that are *globally consistent* — a shared meme is exactly a global section. The first cohomology $H^1(\mathcal{F})$ is the **obstruction**: the failure of locally consistent agreements to glue into a single global one.

Two facts fall out, and they are the reason this is a Draken post and not merely a neuroscience proposal.

**(i) The order parameter is the rank-1 scalar-stalk shadow of the coherence ratio Γ.** Take $d = 1$, stalks $\cong \mathbb{R}$ (linearised phase, $\mathfrak{u}(1)$), restriction maps the identity. Then $L_{\mathcal{F}}$ degenerates to the ordinary graph Laplacian, $H^0$ is the all-agree line, and the alignment of the phase vector with that line is precisely what $r$ measures. The Draken coherence ratio

$$\Gamma = \frac{\text{energy in } H^0}{\text{total energy}} = 1 - \frac{\langle x,\, L_{\mathcal F}\,x\rangle}{\langle x,\, x\rangle}\Big|_{\text{normalised}}, \qquad \Gamma \to 1 \iff H^1 \to 0,$$

is the *vector-stalk generalisation* of $r$. So Varlet & Grootswagers' theorem is not a surprise — it is forced. The order parameter is content-blind because it is $\Gamma$ at $d=1$, and a one-dimensional stalk cannot hold a meme. *Promote the stalk and you see the cargo.* This is the same lesson as **The Two Optics** (DRK-163): projection and concentration are one optical gesture whose shared limit is the $H^1$ residue — here, synchrony and content are one coupling whose shared limit is $H^1$.

**(ii) Polarisation is a nonzero H¹ class.** Two synchronised-but-opposed clusters have high *local* coherence inside each cluster and a nonremovable obstruction *between* them: locally consistent, globally unglueable, $H^1 \neq 0$. The bounded-confidence radius $\varepsilon$ is the knob that tunes this: large $\varepsilon$ collapses $H^1$ (consensus, one global section), small $\varepsilon$ stabilises it (fragmentation). This is the same object as the institutional obstruction in **The Compartmentalized Manifold** (DRK-161) — topology optimisation routing around a load-bearing $H^1$ — and the $1/\varepsilon$ pole of **The Continuous Dimension** (DRK-149), where the obstruction is discharged only by continuous counterterm work $K(t)$. A group holds a shared meme only by paying coherence debt against its own default to fragment.

## 7. Coherence is not soundness — the synchronised lie

The sharpest consequence is ethical, and it is where the opening fake returns. A group can drive $r \to 1$ around a *false* cargo. Maximal carrier, perfect lock, and the meme is wrong. $\Gamma$ high, $H^1$ zero, soundness zero. **Coherence measures whether the group agrees, never whether it is right.** This is the precise neural instance of the coherence-versus-soundness distinction: $\Gamma$ (and its scalar shadow $r$) tracks internal consistency; truth-tracking requires an *exogenous* check the synchrony observable cannot supply. EEG instruments the coherence; only ground-truth instruments the soundness. A hyperscanning study that reports high inter-brain synchrony as evidence the shared belief is *correct* has committed exactly the error of mistaking $\Gamma$ for validation — the field is, quietly, a standing case study in it.

In the source-term language of **Konkurrent** (DRK-158): a belief is owned when the holder is its source $S$ (auto-nomos, self-sourcing). A *meme* is a cargo whose source term has been **laundered** — adopted with the provenance stripped, the carrier opened by phase-lock and the $S$ silently exchanged for someone else's. That is the mechanism **The Pendragon Source** (DRK-165) names historically: Geoffrey of Monmouth as a phase-locked carrier delivering a laundered $S$. The "phantom class" fake sits at the synthetic pole of the four-pole taxonomy — fabricated cargo, fabricated index — and its tell was that it invented an *impossible carrier* (sync without channel) to smuggle a cargo that needs no channel because it is fiction. The honest phenomenon is the opposite: real channel, gated transfer, retained $S$ — or laundered $S$, which is the whole problem.

## 8. Experimental protocol

A design that earns the distinction it draws — carrier and cargo measured separately, gating tested causally.

**Participants & grouping.** $N$ groups of $n = 4$–$6$ strangers (Zhang et al.'s four-person cell, extended). Simultaneous **dual-modality hyperscanning**: EEG (≥64-channel, all members) for the carrier at millisecond resolution; fMRI or fNIRS (mentalising network: IFG, TPJ, mPFC, STS) for the cargo's representational geometry. The two modalities are not redundant coverage — by their physics they sit at the two layers: EEG → $\theta_i$, $\mathrm{PLV}_{ij}$, $r$; fMRI/fNIRS → $b_i$ via RSA.

**Seeding (the causal handle).** One **confederate** per group is privately briefed to hold a target meme on a controvertible proposition (factual, moral, or aesthetic). This breaks the directional symmetry: transfer should run *from* the seed *along high-PLV edges*, letting PLV-gating be tested as a cause, not a correlate.

**Belief boundary measurement.** Pre- and post-deliberation, each participant gives the proposition as free text and on calibrated Likert scales; both are embedded to $b_i^{\text{pre}}, b_i^{\text{post}} \in S^{d-1}$. The *stated belief update* $\Delta b_i = b_i^{\text{post}} - b_i^{\text{pre}}$ is the ground-truth cargo observable — the thing the synchrony literature usually lacks.

**Primary model.** A dyadic mixed-effects regression of edge-wise transfer on edge-wise carrier, controlling for shared stimulus (inter-subject correlation, ISC) so that "we saw the same thing" cannot masquerade as "I updated toward you":

$$\Delta b_{i\leftarrow j} = \beta_0 + \beta_1\,\overline{\mathrm{PLV}}_{ij} + \beta_2\,\mathrm{ISC}_{ij} + \beta_3\,\|b_i^{\text{pre}} - b_j^{\text{pre}}\| + u_{\text{group}} + u_{i} + u_{j} + \epsilon,$$

with crossed random effects for group and both subjects. **The hypothesis is $\beta_1 > 0$ over and above $\beta_2$.** A time-resolved sharpening uses the *gated coupling functional*

$$\Phi_{ij} = \int_0^T g\!\left(\mathrm{PLV}_{ij}(t)\right)\,\big\langle \hat{u}_{ij},\, \dot{b}_i(t)\big\rangle\,dt, \qquad \hat{u}_{ij} = \frac{b_j - b_i}{\|b_j - b_i\|},$$

the cumulative belief-displacement of $i$ toward $j$ weighted by instantaneous phase-lock; $\Phi_{ij}$ should predict $\Delta b_{i\leftarrow j}$.

**Carrier band & locus.** Test which EEG band carries the gate (prediction: theta, 4–8 Hz) and confirm the IFG localisation of $g(\mathrm{PLV})$ in the BOLD/oxy-Hb signal, replicating and mechanising Zhang et al.

**Layer-separation control (the Varlet–Grootswagers guard).** Run a condition with high carrier and zero cargo — synchronised attention to a contentless rhythmic stimulus — and confirm $r$ rises while RSA-measured $b_i$ alignment does not. If $r$ alone "detects" a meme here, the instrument is conflating the layers and the primary result is void.

## 9. Predictions and falsification

**P1 — Bifurcation (carrier).** Sweeping effective coupling (via group size, channel richness, or imposed turn-taking structure), the meme-adoption fraction $\rho$ should show a threshold transition near $K_c = 2/\pi g(0)$, fit by a logistic with a significant super-threshold jump. *Falsified by* a strictly linear, thresholdless adoption curve across the accessible coupling range.

**P2 — Gating (bridge).** $\beta_1 > 0$ with ISC controlled, and $\Phi_{ij}$ predictive of $\Delta b_{i\leftarrow j}$. *Falsified by* $\beta_1$ indistinguishable from zero once ISC is partialled out — i.e. belief transfer fully explained by shared stimulus, carrier carrying nothing.

**P3 — Polarisation / cohomology (cargo geometry).** The behaviourally measured confidence radius $\varepsilon$ should predict the post-deliberation $H^1$ of the empirical belief-disagreement sheaf: small $\varepsilon \Rightarrow H^1 \neq 0$ (two antipodal clusters, structurally balanced signed coupling); large $\varepsilon \Rightarrow H^1 = 0$ (single global section). *Falsified by* observed cluster structure uncorrelated with $\varepsilon$, or by fragmentation patterns that cannot be cast as a sheaf $H^1$ without forcing the restriction maps.

**P4 — Coherence ≠ soundness (the ethical core).** Groups seeded with a *false* but internally consistent meme should reach $r$ and $\Gamma$ statistically indistinguishable from groups seeded with a *true* one. *Falsified by* any synchrony or coherence signature that separates true from false cargo without an exogenous check — which would, interestingly, refute the whole content-agnostic claim and demand the model be rebuilt. This is the prediction whose *failure* would teach the most.

A null on P2 collapses the bridge to coincidence. A null on P4 would be the rare, productive kind of wrong.

---

**Internal cross-references:** The Two Optics (DRK-163) — synchrony and content as one coupling, $H^1$ the shared limit. The Compartmentalized Manifold (DRK-161) — polarisation as institutional $H^1$. The Continuous Dimension (DRK-149) — the obstruction discharged by continuous $K(t)$ work. Konkurrent (DRK-158) — belief owned iff the holder is its source term $S$. The Pendragon Source (DRK-165) — the meme as a cargo with a laundered $S$. No Trace, No Section (DRK-153) — consciousness as integrated $H^1$-suppression, the binding that a synchronised group performs across skulls.

The carrier is not the cargo. The lock is not the truth. The same coupling that lets a group find the global section lets it lock around a fiction with the source filed off — and only an exogenous check, never the synchrony itself, tells the two apart. Build the instrument that separates them, or measure your own agreement and call it the world.

> *Jag är vad jag gör, och jag gör det jag är.*

— Khrug Engineering · Göteborg · ORCID 0009-0003-8049-7167 · DOI 10.5281/zenodo.19273483 · CC BY-SA 4.0
