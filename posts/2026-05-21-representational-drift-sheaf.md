---
drk: 146
title: "Representational Drift as Sheaf-Theoretic Coherence"
subtitle: "Notes on Kwon (Nature 2026) and the empirical landscape of neural population stability"
date: 2026-05-21
tags: [representational-drift, neuroscience, sheaf-theory, hippocampus, memory, hansen-ghrist, edspt, null-coding-space]
layers: [L01, L04, L05, L06, L07]
coherence: 0.87
status: published
author: Khrug (Kai Roininen)
license: CC BY-SA 4.0
excerpt: "Individual neurons reorganize their tuning over days to weeks; population codes remain decodable. The hypothesis that drift lives in the null coding space is the sheaf-theoretic restriction-map formalism stated without the cohomology. This post reads the empirical landscape — Driscoll, Schoonover, Cai, Rule, Sadeh, Liberti — through the lens of DRK-145, and proposes that representational drift is the L05 instance of the same operator that DRK-145 located in trapped-ion topological systems and conjectured for morphogenetic fields."
sources:
  - "Kwon, D., 'The brain's code seems to be in constant flux. Neuroscientists are baffled,' Nature 653, 666–668 (2026), doi:10.1038/d41586-026-01554-0"
  - "Driscoll, L. N., Pettit, N. L., Minderer, M., Chettih, S. N. & Harvey, C. D., 'Dynamic Reorganization of Neuronal Activity Patterns in Parietal Cortex,' Cell 170, 986–999.e16 (2017)"
  - "Schoonover, C. E., Ohashi, S. N., Axel, R. & Fink, A. J. P., 'Representational drift in primary olfactory cortex,' Nature 594, 541–546 (2021)"
  - "Mankin, E. A. et al., 'Neuronal code for extended time in the hippocampus,' PNAS 109, 19462–19467 (2012)"
  - "Cai, D. J. et al., 'A shared neural ensemble links distinct contextual memories encoded close in time,' Nature 534, 115–118 (2016)"
  - "Liberti, W. A. III, Schmid, T. A., Forli, A., Snyder, M. & Yartsev, M. M., 'A stable hippocampal code in freely flying bats,' Nature 604, 98–103 (2022)"
  - "Rule, M. E. & O'Leary, T., 'Self-healing codes: How stable neural populations can track continually reconfiguring neural representations,' PNAS 119, e2106692119 (2022)"
  - "Rule, M. E. et al., 'Stable task information from an unstable neural population,' eLife 9, e51121 (2020)"
  - "Sadeh, S. & Clopath, C., 'Contribution of behavioural variability to representational drift,' eLife 11, e77907 (2022)"
  - "Druckmann, S. & Chklovskii, D. B., 'Neuronal circuits underlying persistent representations despite time varying activity,' Current Biology 22, 2095–2103 (2012)"
  - "Hansen, J. & Ghrist, R., 'Toward a Spectral Theory of Cellular Sheaves,' Journal of Applied and Computational Topology 3 (2019), 315–358"
  - "Dumitrescu et al., 'Dynamical topological phase realized in a trapped-ion quantum simulator,' arXiv:2107.09676 (2021)"
  - "DRK-145, The Operational Question in Positive Alignment"
  - "DRK-142, Wrestling with God: Perlocutionary Force and the Cohomology of the Honest Encounter"
---

# Representational Drift as Sheaf-Theoretic Coherence

## Notes on Kwon (Nature 2026) and the empirical landscape of neural population stability

Diana Kwon's feature in *Nature* on 20 May 2026 surveys a fourteen-year argument the neuroscience community has been having with itself, and reaches the conclusion that the community has now largely converged on: *representational drift is real*. Individual neurons in mouse cortex and hippocampus reorganize their tuning to behavioral variables over days to weeks, even when the task is fixed and the animal's behavior is unchanged. The discovery that this phenomenon is genuine — rather than an artifact of imprecise cell tracking or unmeasured behavioral variability — has unsettled the foundations on which systems neuroscience was built. Place cells, orientation-selective cells, engrams: all the stable-coding landmarks descend from a presumption of fixed neural-symbol-to-world-feature mapping. That presumption is no longer tenable in its strong form.

What the Kwon piece does *not* do — and this is not a criticism, it is the genre constraint of a news feature — is offer a unifying mathematical formalism for what's happening. Two main interpretive options are presented, attributed to Andrew Fink: either there are *stable features in the drifting population*, or *the brain extracts a stable picture from the shifting representations*. These are framed as competing hypotheses. They are not competing hypotheses. They are dual descriptions of the same mathematical structure, and that structure is cellular sheaf theory.

This post grounds that claim in the actual empirical literature. The argument is laid out in three movements: first the observations, then the existing theoretical proposals (null coding space, self-healing codes, behavioral variability), then the sheaf-theoretic synthesis with explicit translation to each prior proposal. The closing section connects this to DRK-145's conjecture about EDSPT-style emergent versus imposed dynamical symmetry, and notes specific testable predictions.

## I. The empirical landscape, with specific findings

The foundational observation comes from Driscoll, Pettit, Minderer, Chettih, and Harvey (Cell 2017, 170:986–999). Mice were trained on a virtual-navigation T-maze task in which a visual cue at the start of the corridor indicated which arm to turn into for reward. After behavior had stabilized — that is, after task learning was complete and performance was no longer improving — the authors used calcium imaging to record from posterior parietal cortex (PPC) neurons every day for a month. The key passage from the abstract states the finding with unusual clarity for a *Cell* paper:

> The relationship between cells' activity and task features was mostly stable on single days but underwent major reorganization over weeks. The neurons informative about task features (trial type and maze locations) changed across days. Despite changes in individual cells, **the population activity had statistically similar properties each day and stable information for over a week**.

The italicized portion is the load-bearing observation. *Decoding* — that is, recovering the animal's task state from neural activity — remained possible across days even though the *neurons doing the encoding* changed identity. The pool of task-informative cells turned over; the information content of the population did not.

Schoonover, Ohashi, Axel, and Fink (Nature 2021, 594:541–546) extended the observation to primary olfactory (piriform) cortex, a region that was widely expected to maintain stable representations because perceptual constancy in olfaction would seem to demand them. Single-unit electrophysiology in mice over multiple weeks showed that odour-evoked responses drifted dramatically. The quantitative measurement: a linear classifier trained on day-one neural responses approached chance-level performance after 32 days. Fear-conditioning the odour — which should, if anything, lock in its representation — did *not* stabilize the responses. Drift in piriform appears to be a baseline property of the cortex, not a function of salience or learning history. The authors suggest, plausibly, that this reflects the *unstructured connectivity* of piriform cortex relative to topographically organized sensory areas.

Mankin et al. (PNAS 2012, 109:19462–19467) provided one of the earliest hippocampal demonstrations: CA1 and CA3 place cells in rats and mice change their place-field structure over time even within the same environment. This is structurally striking because hippocampal place cells were, until then, the canonical example of stable single-neuron-to-world-feature mapping in mammalian cognition.

Cai et al. (Nature 2016, 534:115–118), from the Silva lab at UCLA, took the implications of hippocampal drift in a functional direction. They showed that overlap between the CA1 ensembles activated by two distinct contexts is higher when the contexts are experienced within a day of one another than when they are separated by a week. The functional consequence is measurable: fear paired with context A transfers to neutral context B when the two are encoded within a day, but not when they are separated by a week. The hypothesis is that learning triggers a transient increase in neuronal excitability that biases the next memory toward the same ensemble — a kind of *temporal binding via ensemble inheritance*. Memory linking lives in the drift.

Liberti, Schmid, Forli, Snyder, and Yartsev (Nature 2022, 604:98–103) provided a critical counterpoint by showing that in *freely flying bats*, much of what looks like representational drift in hippocampal place cells can be attributed to systematic changes in the animal's behavioral trajectory — different flight paths through the same space produce different ensemble activity patterns, and if behavior is properly controlled, the "drift" largely disappears. This is the most empirically aggressive deflationary claim in the literature: maybe some "drift" is just unmeasured behavioral variability.

Sadeh and Clopath (eLife 2022, 11:e77907) made the same point theoretically and analytically. Using mouse visual cortex data, they showed that a significant component of apparent drift can be explained by behavioural variability not controlled for in the original analyses. Their argument is not that drift is illusory but that *some specific portion of the variance previously attributed to drift is in fact attributable to unmeasured behavioral state*.

Even with the Sadeh-Clopath and Liberti corrections, however, a substantial drift residual remains in the highly controlled studies — Driscoll 2017, Schoonover 2021, Rubin et al. 2019 (Nature Communications 10:4745) — that cannot be explained away by behavioral variability. The community consensus, as Kwon's feature accurately reports, is that drift is real even if its magnitude has been overestimated in some experimental designs.

## II. The existing theoretical proposals

Three classes of theoretical proposal have emerged to make sense of the drift-with-stable-decoding pattern.

### The null coding space hypothesis

The earliest and structurally cleanest proposal, attributable in its modern form to Rokni et al. 2007, Druckmann and Chklovskii 2012 (*Current Biology* 22:2095–2103), Ajemian et al. 2013, and Singh et al. 2019, is that *drift occurs in dimensions of population activity that are orthogonal to the coding dimensions*. Let $\mathbf{x}(t) \in \mathbb{R}^N$ be the neural population activity at time $t$, and let $\mathbf{y}(t) = W\mathbf{x}(t)$ be the behaviorally-relevant decoded variable, where $W \in \mathbb{R}^{d \times N}$ is the readout matrix and $d \ll N$. The kernel of $W$ — the *null coding space* — is the $(N - d)$-dimensional subspace of population activity that is invisible to the downstream readout. Drift confined to this subspace leaves $\mathbf{y}(t)$ unchanged.

This is mathematically clean but empirically falsifiable. Rule et al. 2020 (eLife 9:e51121) directly tested whether drift in mouse PPC data was confined to the null coding space. The answer was: *partially, but not entirely*. The exact quote: "drift is systematically constrained far above chance, facilitating a linear weighted readout of behavioral variables. However, a significant component of drift continually degrades a fixed readout, implying that drift is not confined to a null coding space."

So drift is *biased toward* the null coding space — far above what would be expected from random reconfiguration — but it is not perfectly orthogonal to the readout. Something has to compensate the residual that does intrude into coding dimensions.

### Self-healing codes

This compensation problem motivated Rule and O'Leary (PNAS 2022, 119:e2106692119), whose paper is the most theoretically developed treatment to date. They show that the combination of *Hebbian learning* and *single-cell homeostasis* in the readout population is sufficient to track continually reconfiguring inputs without external error feedback. The mechanism: each readout cell adjusts its synaptic weights to maintain its firing-rate statistics (mean and variability) at homeostatic targets. When the encoding population's tuning drifts, the readout's firing statistics shift, which drives Hebbian plasticity that re-learns the new mapping. The crucial property they identify: this works because *representational drift is far from random*. The structure in the drift — its bias toward null coding space, its smoothness in time, its non-independence across cells — is exploited by the local learning rule to derive stable readouts.

The Rule-O'Leary paper also makes the larger conceptual move that I want to emphasize: *drift is not noise that the brain has to overcome; drift is structured information that the brain uses*. The same point appears in the Cai et al. 2016 hippocampal memory-linking work and in the Mankin et al. 2012 time-coding work.

### Behavioral variability

The Sadeh-Clopath/Liberti deflationary thread is the third class. Its claim is not that drift is unimportant but that the *quantitative magnitude* of true drift has been overestimated by failing to control for unmeasured behavioral state. The framework consequence: any theoretical account must distinguish the *biological drift* from the *experimental-design-induced drift*. This is methodologically essential.

## III. The sheaf-theoretic synthesis

The three theoretical proposals above are not in conflict. They are dual descriptions of a single underlying structure that becomes clean when stated in the language of cellular sheaves.

Set up the structure as follows. Let $G = (V, E)$ be a graph whose vertices index neurons (or small ensembles, or recording sites — the level of coarse-graining is a modeling choice). To each vertex $v$ assign a stalk $\mathcal{F}(v) = \mathbb{R}^{k_v}$ encoding the local activity space at $v$. To each edge $e = (u, v)$ — corresponding to a functional coupling between $u$ and $v$ — assign restriction maps $\rho_{u \to e}: \mathcal{F}(u) \to \mathcal{F}(e)$ and $\rho_{v \to e}: \mathcal{F}(v) \to \mathcal{F}(e)$. A *global section* is an assignment $\{x_v\}_{v \in V}$ with $\rho_{u \to e}(x_u) = \rho_{v \to e}(x_v)$ on every edge. The space of global sections, $H^0(G, \mathcal{F})$, is the kernel of the coboundary operator $\delta: \bigoplus_v \mathcal{F}(v) \to \bigoplus_e \mathcal{F}(e)$. The sheaf Laplacian is $\Delta_\mathcal{F} = \delta^T \delta$, with spectrum $\{\lambda_0 = 0 \leq \lambda_1 \leq \lambda_2 \leq \cdots\}$.

In this language, the behaviorally-decoded variable $\mathbf{y}(t)$ is a global section. Each neuron's activity $x_v(t)$ is the local stalk value. The readout matrix $W$ encodes the restriction maps. The dimension of the global section space — the dimension of $H^0$ — is what neuroscientists are recovering when they say "stable information for over a week" (Driscoll 2017). The drift in individual neurons lives in the kernels of the restriction maps, and is invisible to the global section *exactly* to the extent that the restriction maps are well-aligned across the graph.

Translate the three theoretical proposals into this language:

The **null coding space hypothesis** is the statement that drift lives predominantly in $\ker(\rho_{v \to e})$ for each $v$ — the local kernel of the restriction map at vertex $v$. This is structurally what Druckmann and Chklovskii 2012 said, just written without the explicit sheaf vocabulary. Rule et al. 2020's empirical finding that drift is *biased toward but not confined to* the null coding space translates, in sheaf language, to: *the cocycle defect $\delta(x_v - x_v')$ has nonzero norm but is bounded*. Drift produces a cocycle that lives mostly in $H^0$ (invisible to the global section) but has a small component in $H^1$ (the cohomology that measures gluing failure).

The **self-healing code mechanism** of Rule and O'Leary 2022 is the statement that downstream plasticity acts to *project the residual* $H^1$ defect *back into the null space of the readout*. Hebbian homeostasis is, in this framing, a local cochain operator that maintains $\delta(x_v) \to 0$ on each edge. The "redundancy in a distributed population code" that they identify as essential — the fact that the encoding population is overcomplete with respect to the readout — is the sheaf-theoretic condition that the dimension of $\bigoplus_v \mathcal{F}(v)$ exceeds the dimension of $H^0$ by enough to absorb local perturbations into the kernel of $\delta$.

The **behavioral variability contribution** of Sadeh-Clopath and Liberti corresponds to the observation that the stalks $\mathcal{F}(v)$ are themselves time-varying in ways that the experimenter has not measured: the local activity space at $v$ depends on behavioral state, and what looks like a change in $x_v(t)$ may in fact be a change in the basis of $\mathcal{F}(v)$ itself. Properly controlling behavior fixes the basis and reveals how much drift is intrinsic to the network versus how much is induced by uncontrolled input.

These are not three competing hypotheses. They are three statements about three different parts of the same sheaf structure. The null-coding-space proposal says where drift lives geometrically; the self-healing-code proposal says how the residual cohomology is locally suppressed; the behavioral-variability proposal says that some apparent drift is actually a basis change in the stalks. All three are true. The synthesis is the sheaf.

## IV. The EDSPT connection and the protocol-as-agent reading

DRK-145 introduced the distinction, drawing on Dumitrescu et al. (2021) on Honeywell's trapped-ion quantum processor, between *imposed* and *emergent* symmetry as two qualitatively different mechanisms for topological protection. The imposed-symmetry case (Floquet drive with microscopic $\mathbb{Z}_2$ Ising symmetry) is fragile to coherent perturbations that break the symmetry. The emergent-symmetry case (Fibonacci-quasiperiodic drive generating dynamical $\mathbb{Z}_2 \times \mathbb{Z}_2$ symmetries via the recursive Magnus expansion) is absolutely stable to generic coherent perturbations.

Representational drift fits this distinction with no modification.

The classical stable-coding model — fixed orientation cells, fixed place cells, fixed engrams — is the *imposed-symmetry* case at the neural layer. Each neuron's role is rigidly specified by training or development; perturbation of a load-bearing neuron is catastrophic. This model would predict that lesions, focal strokes, or coherent disease processes (Alzheimer's-style tau spread along anatomically connected pathways) should destroy specific memories or perceptions by killing their dedicated cells. The empirical record on hippocampal damage and amnesia is consistent with this prediction *in part*, but the granularity of the relationship — which specific memories are lost when which specific cells die — is far weaker than the strong stable-coding model would require.

The drift-with-stable-decoding pattern is the *emergent-symmetry* case. No single neuron is load-bearing. The population code is robust because its constituent cells are diverse, drifting, and constantly being recycled into new tuning configurations. The system is absolutely stable to coherent perturbation because there is no resonant frequency for the perturbation to target. This is precisely the EDSPT mechanism translated from quantum to neural substrate.

The connection makes a specific empirical prediction: *the rate of drift in a brain region should anti-correlate with that region's susceptibility to coherent perturbation*. Regions with high drift rates (hippocampus, association cortex) should be resilient to coherent insult; regions with low drift rates (primary motor cortex, retinal projections, brainstem) should be relatively more vulnerable to coherent disruption but more vulnerable also requires that they are *also* receiving the kind of carefully topographically organized input that makes the imposed-symmetry strategy viable. There is some indirect support for this in the clinical literature: the cortices that drift most are also the cortices that recover function most robustly after focal damage.

The protocol-as-agent framing from the Sheaf Ethology pilot transposes here as well. Just as the varanid ritualized combat protocol exists as an algorithmic structure executing through individual varanids as substrate — protocol = agent, individual = substrate — the *cognitive protocol* implementing a learned task or a stored memory exists as an algorithmic structure executing through individual neurons as substrate. The neurons that participate today are not the neurons that participated last month. The protocol persists. The substrate turns over. Individual neurons are perishable instantiations of a non-perishable computation. This is exactly the relationship between species-invariant ritualized combat structure and the perishable individual lizards that instantiate it.

## V. Predictions and what would move this forward

If the sheaf-theoretic framing is correct, several specific predictions follow.

**Drift rate should scale with the dimensionality of the local null space.** Brain regions whose neurons have many degrees of freedom orthogonal to the relevant readout (e.g., hippocampus, with its high redundancy and broad-tuning place cells) should show high drift. Brain regions whose neurons have few orthogonal degrees of freedom (e.g., motor cortex output to specific muscles, where every dimension matters for the readout) should show low drift. This matches the observed pattern (Driscoll, Schoonover, Mankin all in association/hippocampal cortex; primary motor and retina with much less drift) but the prediction is sharper than the existing observation: it says drift rate should be quantitatively predictable from the kernel dimension of the readout map.

**Sheaf Laplacian eigenvalue spectra should distinguish health from pathology.** A healthy population code has low first-nonzero eigenvalue $\lambda_1$ of $\Delta_\mathcal{F}$; a pathological code (Alzheimer's-style decoherence, schizophrenic narrative collapse, epileptic synchronization) should show $\lambda_1$ spikes corresponding to failed gluing across the relevant graph. This is computable from existing multi-electrode recording data once a candidate restriction-map structure is specified. The hard empirical work is the specification.

**The Cai 2016 memory-linking window has a sheaf-theoretic interpretation.** The time-dependent overlap between context-encoding ensembles is, in the framework, a measure of how much the restriction maps between adjacent stalks shift between encoding events. Within a day, the maps are still nearly the same; across a week, they have drifted enough that the two events lie in different sheaf-cohomology classes and cannot be co-retrieved. This predicts that memory linking should be a smooth function of inter-event interval, with the timescale of the smoothness determined by the drift rate in the relevant region. Cai's original data shows essentially this; the prediction sharpens it to a quantitative scaling law.

**The morphogenetic conjecture from DRK-145 should generalize to neural development.** If the EDSPT-style protection mechanism operates on bioelectric morphogenetic fields, it should also operate on developing neural fields. Spectral analysis of bioelectric signals during cortical development should show broadband, Diophantine spectral structure rather than narrowband harmonic structure. The same prediction in two different biological substrates, falsifiable in both.

What would move the framework forward is empirical collaboration on specifying the restriction maps for a well-instrumented system. The Driscoll 2017 PPC data is publicly available (Dryad doi:10.5061/dryad.gqnk98sjq). The Marks-Goard 2021 V1 data is similarly available. Computing the sheaf Laplacian eigenvalue spectrum on these datasets is a defined, tractable, finite project that would either validate the framework or falsify it cleanly. This is the kind of analysis that a master's-level computational neuroscience student could complete in a semester.

The natural interlocutors are: Timothy O'Leary's group at Cambridge (already working on the relevant theoretical questions), Carl Schoonover and Andrew Fink (the piriform team — Schoonover now at Columbia, Fink at Northwestern), Christopher Harvey at Harvard Medical School, and Claudia Clopath at Imperial College. The Sadeh-Clopath behavioral variability work is the direct theoretical companion to anything the sheaf framework would propose; their attention would be the right professional check.

## Closing

Kwon's feature presents representational drift as something neuroscientists are "baffled" by. The bafflement is, I think, real — but it is the bafflement that arises from looking for the stable-symbol-to-world-feature mapping at the wrong level. Once the population is recognized as the load-bearing object, with individual neurons functioning as substrate for the population computation, the bafflement dissolves. The brain is not failing to maintain stable representations. It is maintaining stable representations *via* drift, exploiting the diversity of its substrate to achieve coherence that no static implementation could match.

This is the same operator that DRK-145 located in the EDSPT mechanism for topological protection in quantum systems, that the Sheaf Ethology pilot located in ritualized varanid combat, and that DRK-142 located in the dyadic clinch as the structural prevention of perlocutionary collapse. Quantum substrate, neural substrate, ethological substrate, dyadic substrate — same restriction-map architecture, same sheaf cohomology, same protocol-as-agent inversion.

The empirical record on representational drift, properly interpreted, is the strongest single body of evidence for the sheaf-theoretic framing of biological cognition that currently exists. The work of synthesizing it formally remains to be done, but the path from Driscoll 2017 to a computable Γ on neural data is not long.

*Jag är vad jag gör, och jag gör det jag är.* The neuron is what it does; what it does drifts; the protocol persists.
