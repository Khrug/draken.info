---
drk: 144
title: "Shape Is Spectrum: Coherence as Basis Distribution"
date: 2026-05-21
tags: [fourier, basis, coherence, platonic, vibes, alignment, sheaf, edspt]
layers: [L01, L05, L08, L13, L15]
coherence: 0.91
status: published
author: Khrug (Kai Roininen)
license: CC BY-SA 4.0
excerpt: "Every closed shape is a sum of sines. Plato called it eidos; Fourier called it a coefficient vector; the 21st-century wellness market calls it a 'frequency.' Three different bases for the same identity — and the modern register has lost the part that mattered most."
sources:
  - "Cosmoknowledge, 'Wave Extrapolation' reel, Facebook 2026-05-20: https://www.facebook.com/share/r/18qUJFVPHX/"
  - "DRK-142, Wrestling with God: Perlocutionary Force and the Cohomology of the Honest Encounter"
  - "DRK-125, The Totalitarian Sheaf"
  - "DRK-123, The Imaginary Dimension"
  - "Dumitrescu et al., 'Dynamical topological phase realized in a trapped-ion quantum simulator,' arXiv:2107.09676 (2021)"
  - "Hansen & Ghrist, 'Toward a Spectral Theory of Cellular Sheaves,' Journal of Applied and Computational Topology 3 (2019), 315–358"
---

# Shape Is Spectrum: Coherence as Basis Distribution

A Cosmoknowledge reel went past me on Facebook this week. The animation shows five closed shapes — a heart, a four-point star, a trefoil, a circle, a diamond — and watches each one roll out along a line, tracing the periodic waveform it generates. Underneath the diagram, the caption:

$$y_N(t) = \sum_{k=0}^{N-1} a_k\,\phi_k(t)$$

This is the Fourier identity, written in its most general form. Every closed shape — every bounded loop in a phase space — decomposes into a sum of basis functions $\phi_k(t)$ weighted by coefficients $a_k$. The shape *is* the spectrum. The spectrum *is* the shape. They are the same mathematical object expressed in two different representations.

It is a kindergarten-level statement of one of the deepest theorems in mathematics, and the reel will get its seven thousand likes and disappear. I want to use it here as the entry point for a structural claim about coherence that the Draken framework has been circling for some time and that the contemporary wellness-and-alignment discourse has gotten almost exactly backwards.

## I. The Identity

The continuous Fourier expansion of a periodic function $f(t)$ with period $T$ is:

$$f(t) = \frac{a_0}{2} + \sum_{n=1}^{\infty}\left[a_n \cos\!\left(\frac{2\pi n t}{T}\right) + b_n \sin\!\left(\frac{2\pi n t}{T}\right)\right]$$

with coefficients

$$a_n = \frac{2}{T}\int_0^T f(t)\cos\!\left(\frac{2\pi n t}{T}\right)dt, \quad b_n = \frac{2}{T}\int_0^T f(t)\sin\!\left(\frac{2\pi n t}{T}\right)dt.$$

The discrete version replaces the integrals with sums, and the more general formulation — the one written under the reel — replaces the trigonometric basis $\{\cos(2\pi n t/T), \sin(2\pi n t/T)\}$ with an arbitrary orthonormal basis $\{\phi_k\}_{k \in \mathbb{N}}$ of the relevant function space $L^2$. In Hilbert-space notation:

$$f = \sum_{k} \langle f, \phi_k \rangle \, \phi_k \quad \text{where} \quad \langle f, g \rangle = \int f(t)\,\overline{g(t)}\,dt$$

The coefficients $a_k = \langle f, \phi_k \rangle$ are the projections of $f$ onto each basis vector. The shape lives in the function space; the spectrum is its coordinate vector in the chosen basis. **They contain the same information.**

This is the content of Parseval's theorem, which states that the total energy of the signal equals the sum of squared coefficients:

$$\|f\|^2 = \int |f(t)|^2\,dt = \sum_k |a_k|^2$$

Energy is conserved across the transformation between shape and spectrum. Nothing is added; nothing is lost. The "shape" representation foregrounds the signal's geometry in time; the "spectrum" representation foregrounds its distribution across modes. Both are equally true. Both are equally complete. Choosing between them is a choice of basis, not a choice of reality.

## II. Plato's Mistake and Plato's Insight

Plato held that the things we encounter in the world are imperfect shadows of eternal *eidē* — forms — that exist in a separate intelligible realm. The five regular convex polyhedra (tetrahedron, cube, octahedron, dodecahedron, icosahedron) were, for him, the geometric atoms of reality. *Timaeus* assigns four of them to the four elements and reserves the dodecahedron for the cosmos itself. Two and a half millennia of Western metaphysics have orbited this picture.

The Fourier identity is the modern vindication of half of Plato's intuition and the refutation of the other half.

**The vindication:** Plato was correct that shapes are encoded by something more fundamental than their visible extent. A circle is not "really" a curve drawn on paper; it is the projection of a vector $(a_0 = 1, a_1 = 0, a_2 = 0, \ldots)$ — a single coefficient, total energy concentrated in the fundamental — onto the trigonometric basis of $L^2(\mathbb{S}^1)$. A square is a different coefficient vector. A heart is a different one again. The "form" of each shape lives in coefficient space, just as Plato suspected forms lived somewhere prior to their instantiation.

**The refutation:** the coefficient space is not eternal, transcendent, or unique. It depends on the *choice of basis*. The same circle that has coefficient vector $(1, 0, 0, \ldots)$ in the trigonometric basis has an entirely different coefficient vector in the Haar wavelet basis, or in the Hermite-polynomial basis, or in any other complete orthonormal system. There is no privileged basis in $L^2$. The "essential form" of the circle is not a feature of the circle alone; it is a feature of the circle *together with the basis you have chosen to look at it through.*

This is the part of the Fourier identity that almost no popular treatment ever makes explicit, and it is the part that matters most for what follows.

## III. The Vibe Economy

The contemporary wellness, manifestation, "high-vibrational" and frequency-healing discourse — the entire register in which terms like "alignment," "tuning," "vibration," and "resonance" have migrated from physics into self-help — is, structurally, a folk Fourier theory. It grasps, correctly, that everything periodic has a spectrum. It grasps, correctly, that this spectrum carries the identity of the thing. It then makes three catastrophic errors, each of which is the mirror image of an insight the actual mathematics provides.

**Error one: monochromatic purity.** The vibe discourse holds that there are *good* frequencies and *bad* frequencies — 432 Hz versus 440 Hz being the most famous example, but also "high-vibe" people, "low-vibration" emotions, "the frequency of love is 528 Hz." This assumes that a healthy or coherent or aligned signal is one that is *concentrated at a single privileged frequency.* Mathematically, this is the spectrum of a pure sinusoid: $a_k = 0$ for all $k$ except one. A spectrum like this is maximally simple, maximally predictable, maximally redundant, and maximally fragile. It is the spectrum of a tuning fork, a laser, an idle motor, or a generalized seizure.

The opposite of pure-tone concentration is what happens in healthy biological signal: a broadband, near-$1/f$ distribution where energy is spread across many basis functions with no single mode dominating. EEG of a waking, alert brain is broadband. EEG of a brain in absence seizure is monochromatic. The pathological state is the spectrally "pure" one. Coherence in the technical sense — what the Draken framework writes as $\Gamma$ — is not the absence of structure but the *distribution* of structure across the basis.

**Error two: basis-blindness.** The vibe discourse takes the frequencies it names — 432 Hz, 528 Hz, 7.83 Hz Schumann resonance — as absolute, basis-independent facts about reality. They are not. They are coordinates in the basis of *temporal sinusoids at the human auditory range,* a basis chosen because we are mammals with cochleae of a particular size. A dolphin's basis is different. A bat's basis is different. A magnetotactic bacterium's basis is different. None of these bases is more fundamental than any other; they are coordinate systems adapted to substrate. The same "frequency" that registers as healing in one basis is irrelevant in another.

**Error three: collapse of coherence onto agreement.** The vibe discourse holds that "alignment" means everyone vibrating at the same frequency — that a coherent collective is one in which all individual signals lock onto a common mode. This is precisely the failure mode that Floquet symmetry-protected topological phases exhibit in trapped-ion quantum simulators, as Dumitrescu et al. (2021) demonstrated experimentally. A system protected by a single shared periodicity is maximally vulnerable to any perturbation at that periodicity. The systems that exhibit genuine, long-lived, error-resilient coherence are *quasiperiodic* — driven by a Fibonacci sequence whose spectrum is dense in $[0, \infty)$ with no privileged frequency. Real alignment is not monotone agreement; it is irrational-ratio diversity.

The vibe economy has inherited the metaphor of Fourier — everything has a spectrum, everything has a frequency, everything resonates — and lost the three propositions that make the mathematics actually work. It is a degenerate sheaf where the local sections have been forced to agree at the cost of the global structure that made them informative.

## IV. The Sheaf-Theoretic Generalization

Here is where the contemporary framework picks up where Fourier left off.

A cellular sheaf $\mathcal{F}$ on a graph $G = (V, E)$ assigns to each vertex $v$ a vector space (a stalk) $\mathcal{F}(v)$ and to each edge $e = (u, v)$ a pair of linear maps (restriction maps) $\rho_{u \to e}: \mathcal{F}(u) \to \mathcal{F}(e)$ and $\rho_{v \to e}: \mathcal{F}(v) \to \mathcal{F}(e)$. A *global section* is an assignment of one element from each stalk such that for every edge the two restrictions agree:

$$\rho_{u \to e}(x_u) = \rho_{v \to e}(x_v) \quad \forall e = (u,v) \in E$$

The sheaf Laplacian $\Delta_{\mathcal{F}}$, introduced by Hansen and Ghrist (2019), measures how badly a candidate assignment fails to be a global section. Its spectrum — the eigenvalues of $\Delta_{\mathcal{F}}$ — gives a stratified measure of coherence: zero eigenvalues correspond to true global sections (perfectly coherent assignments), small eigenvalues to nearly-coherent ones, large eigenvalues to assignments that violently disagree across edges.

Now read this back through the Fourier identity. Each stalk $\mathcal{F}(v)$ is its own function space with its own basis. Each restriction map $\rho_{v \to e}$ is a projection from one basis to a shared one on the edge. Coherence is the question: *can the local Fourier expansions on adjacent stalks be made to agree on overlaps?* The sheaf Laplacian spectrum is the answer in graded form.

**This is what the Sheaf Ethology pilot is doing with varanid combat protocols.** The five-node phase graph — Display, Elevation, Clinch, Separation, Retreat — assigns to each phase a stalk encoding the relevant kinematic and signaling variables. The restriction map $\rho_{D \to Cl}: \mathbb{R}^4 \to \mathbb{R}^3$ projects out the bluff dimension because at the clinch, bluff is impossible — the basis function corresponding to bluff has zero amplitude by definition. Coherence of the combat protocol is the eigenvalue spectrum of $\Delta_{\mathcal{F}}$ across the phase graph. Three competing models (SAG, Cumulative, Attrition) produce three different Laplacian spectra; the empirical winner ($\Gamma = 0.928$ for SAG) is the one whose local Fourier expansions glue.

**This is what DRK-142 was doing with the perlocutionary clinch.** An honest encounter is a global section across two belief stalks; the dyadic clinch is the restriction map that prevents either party from collapsing the H¹-cohomology of the other's belief sheaf by sheer rhetorical force. Suppression of H¹-obstruction is monochromatic forcing; the clinch is broadband mutual constraint.

**This is what DRK-125 was diagnosing as totalitarian.** A totalitarian narrative is a sheaf in which all local bases have been forced to a single global trigonometric coordinate — one fundamental frequency, one resonance, one tuning — and every stalk has been projected through restriction maps that preserve only that mode. The Γ is high in the trivial sense that everything agrees, but the spectrum has collapsed; the system is monochromatic and therefore maximally fragile to perturbation at the carrier frequency. The vibe-alignment fantasy and the totalitarian state are, in this technical sense, the same mathematical object viewed at different layers.

## V. The Identity Restated

Every closed shape is a sum of sines, in a basis. Every basis is a choice. Every choice carries assumptions. Coherence is not concentration onto a privileged frequency; it is the *distribution* across the basis such that local sections glue across overlaps. The Platonic insight that form lives in coefficient space was correct. The Platonic claim that the coefficient space is eternal, transcendent, and unique was wrong. The contemporary vibe market has inherited the second mistake and amplified it.

The Draken framework substitutes the third option: form is real, basis is chosen, coherence is computed. The optimization axiom $\min S_{\text{sys}}$ subject to $dH/dt \geq 0$ does not select for monochromatic purity. It selects for the broadband, irrational-ratio, sheaf-theoretically glueable distribution that lets a system absorb perturbation without losing its identity. That is what coherence is. That is what alignment, properly understood, is. That is what the Cosmoknowledge reel was actually showing, underneath the cute animation: not five shapes producing five frequencies, but five different coefficient vectors in the same basis, each containing the full identity of its shape, none more fundamental than any other.

The diamond is not less coherent than the circle. The heart is not less aligned than the star. They are different projections of the same underlying operation onto different sets of $a_k$. The thing that would make any of them pathological is not their shape but their *insistence* — the forcing of every other signal in the room to match their spectrum at the cost of its own.

*Jag är vad jag gör, och jag gör det jag är.* Form is doing in coefficient space. Coherence is the distribution that lets the doing continue.

---

*Originating prompt: a Cosmoknowledge "Wave Extrapolation" reel surfaced on Facebook on 20 May 2026, shared in the course of unrelated conversation. The post owes whatever clarity it has to the discipline of being math-explicit; whatever opacity remains is mine.*
