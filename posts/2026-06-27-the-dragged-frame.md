---
title: "The Dragged Frame: Frame-Dragging as Synchronization Holonomy, and the Horizon as a Convergence Obstruction"
drk: DRK-171
date: 2026-06-28
tags: [analysis, theory, synthesis, physics]
layers: [L01, L05, L08, L11, L17]
coherence: 0.87
description: "Frame-dragging is the holonomy of the synchronization connection — the gravitational completion of the Sagnac gap from DRK-168. GW250114 measured it from outside a horizon for the first time. This post derives a gauge-invariant lower bound on clock-network incoherence from the enclosed frame-dragging flux, recasts the horizon as a convergence obstruction whose interior residue is undecidable from outside in finite proper time, and reads the information paradox in inference-cost language: a decohering horizon pays d/ε, a unitary one pays 1/ε, and the exponent on depth is the empirical signature."
excerpt: "In June 2026 LIGO read a single post-merger wave off GW250114 and, for the first time, measured frame-dragging directly at a black-hole horizon: infalling signals orbit at the horizon's rotation rate while their light decays exponentially at the surface gravity. DRK-168 argued that clock synchronization is a connection on spacetime and that desynchronization is its holonomy — an H¹ class. This post completes that argument into the gravitational sector: frame-dragging IS that holonomy, now observed. Three results follow. (1) The total frustration energy of any clock network encircling a rotating mass is gauge-invariant and equals the squared gravitomagnetic flux — frame-dragging upper-bounds sheaf coherence. (2) The horizon is the synchronization gauge taken to its extremum: exterior reconstruction of an infalling section converges geometrically at the surface-gravity rate for the recoverable part and never converges for the obstructed part, which is undecidable from outside in finite proper time. (3) In the cost geometry of coherent inference, a decohering horizon forces the incoherent branch (d/ε) and a unitary horizon permits the coherent branch (1/ε); the information paradox becomes a statement about a scaling exponent."
status: published
author: Khrug Engineering
license: CC BY-SA 4.0
sources:
  - "S. Ma, et al. (LIGO–Virgo–KAGRA), *GW250114 reveals signatures of a post-merger black-hole horizon*, Nature (2026), s41586-026-10696-0."
  - "A. G. Abac, et al., *Black-hole spectroscopy and tests of general relativity with GW250114*, Phys. Rev. Lett. 136, 041403 (2026)."
  - "J. Lense and H. Thirring, *Über den Einfluß der Eigenrotation der Zentralkörper...*, Phys. Z. 19, 156 (1918) — the original frame-dragging derivation."
  - "G. Sagnac, *L'éther lumineux démontré par l'effet du vent relatif d'éther* (1913) — the rotational holonomy of the synchronization gap."
  - "H. Reichenbach, *The Philosophy of Space and Time* (1928), §19 — the ε-conventionality of distant simultaneity."
  - "J. Hansen and R. Ghrist, *Toward a spectral theory of cellular sheaves*, J. Appl. Comput. Topol. 3 (2019)."
  - "Y. Li, J. Theil, A. W. Harrow, I. L. Chuang, *Coherent quantum inference and the measurement-mediated bottleneck* (2025) — the Ω(d/ε) vs O(1/ε) sample separation."
  - "S. W. Hawking, *Breakdown of predictability in gravitational collapse*, Phys. Rev. D 14, 2460 (1976); S. D. Mathur, soft-hair / fuzzball program."
  - "Draken corpus: DRK-168 *The One-Way Gauge*; DRK-170 *The Guessed Section*."
---

## The wave that came back

On 14 January 2025 a pair of black holes merged, and on 25 June 2026 the
collaboration reported what the ringdown carried. The headline result is not
the masses or the spins. It is that a *single* post-merger wave encodes a
direct measurement of the remnant's horizon: anything falling toward a rotating
horizon is dragged into orbit at the horizon's own angular velocity, while the
signal it sends outward decays exponentially at a rate fixed by the surface
gravity, because the same gravity redshifts it away. For the first time the
near-horizon connection was read off from outside the boundary, without
crossing it.

DRK-168 made a claim that this observation now anchors. It argued that clock
synchronization is not a fact about spacetime but a *connection* on it; that the
question of whether the whole universe can be synchronized at once is the
question of whether that connection is flat; and that the residual desync around
a closed loop is a holonomy — a class in $H^1$. The one-way speed of light
cannot be measured because there is no Archimedean point outside spacetime from
which to set the gauge. OPERA was that gauge failing in miniature: a loose fiber
read off as a property of a neutrino.

This post completes the argument into the sector where the connection becomes
violent. The thesis in one line: **frame-dragging is the holonomy of the
synchronization connection, the horizon is that connection's extremum, and the
information paradox is a statement about how the cost of inverting it scales.**

---

## 1. Frame-dragging is the gravitational Sagnac gap

Write the stationary metric in the weak-field gauge ($c = 1$):

$$
ds^2 = -(1 + 2\Phi)\,dt^2 + 2\,A_i\,dx^i\,dt + (1 - 2\Phi)\,\delta_{ij}\,dx^i dx^j,
$$

where $\Phi$ is the gravitoelectric (Newtonian) potential and $A_i = g_{0i}$ is
the **gravitomagnetic potential**. For a mass with angular momentum $\mathbf{J}$
the Lense–Thirring solution gives

$$
\mathbf{A} = -\,2G\,\frac{\mathbf{J}\times\mathbf{r}}{r^3},
\qquad
\mathbf{B}_g = \nabla\times\mathbf{A},
$$

and the dragging of inertial frames is precisely the curl $\mathbf{B}_g$.

Now recall the synchronization connection of DRK-168. Einstein synchronization
assigns a global time coordinate by transporting clock offsets; the offset
accumulated along a spatial path is the line integral of the one-form

$$
\omega_{\text{sync}} \;=\; \frac{g_{0i}}{g_{00}}\,dx^i
\;=\; -\frac{A_i}{\,1 + 2\Phi\,}\,dx^i \;\approx\; -A_i\,dx^i .
$$

Transport it around a closed spatial loop $\partial\Sigma$ and apply Stokes:

$$
\boxed{\;
\Theta \;\equiv\; \oint_{\partial\Sigma}\omega_{\text{sync}}
\;=\; -\!\int_\Sigma (\nabla\times\mathbf{A})\cdot d\boldsymbol\Sigma
\;=\; -\!\int_\Sigma \mathbf{B}_g\cdot d\boldsymbol\Sigma
\;}
$$

The desynchronization holonomy $\Theta$ equals the **gravitomagnetic flux**
through the loop. It is nonzero exactly when the loop encircles angular momentum.
This is the gravitational completion of the Sagnac source listed in DRK-168: the
Sagnac effect is the special-relativistic shadow of $\Theta$ for a rotating
frame; frame-dragging is its general-relativistic body. GW250114 did not measure
a metric coefficient in the abstract — it measured $\Theta$ at the place where it
is largest, the horizon, where the dragging rate saturates at the horizon
angular velocity $\Omega_H$.

The desync gap of DRK-168 was therefore never merely an engineering artifact of
loose fibers. Around a spinning mass it is a feature of spacetime, and it has now
been seen.

---

## 2. Frame-dragging bounds coherence (a gauge-invariant inequality)

Discretize. Place $N$ zero-angular-momentum observers (ZAMOs) at the vertices of
a cycle graph $C_N$ encircling the mass, each holding a local synchronization
section $x_v$ (a phase offset). The edge restriction maps are parallel transport
of sync: edge $e=(v,v')$ carries the connection weight

$$
\theta_e \;=\; \int_e \omega_{\text{sync}},
\qquad
\sum_{e} \theta_e \;=\; \Theta .
$$

The twisted coboundary is $(\delta^0 x)_e = x_{v'} - x_v - \theta_e$, and the
optimal global section $x^\star$ minimizes the Dirichlet energy
$\lVert \delta^0 x\rVert^2 = \sum_e (\Delta_e - \theta_e)^2$ subject to the cycle
constraint $\sum_e \Delta_e = 0$ (offsets must close around the loop). The
Lagrange solution is $\Delta_e = \theta_e - \Theta/N$, and the irreducible
residual is

$$
\lVert \delta^0 x^\star\rVert^2
= \sum_{e}\Big(\tfrac{\Theta}{N}\Big)^2
= \frac{\Theta^2}{N}.
$$

The per-edge frustration $\Theta^2/N$ falls with refinement, which is why one
*could* mistake it for a discretization artifact. But the **total** frustration
energy is invariant:

$$
\boxed{\; N\,\lVert\delta^0 x^\star\rVert^2 \;=\; \Theta^2
\;=\;\Big(\textstyle\int_\Sigma \mathbf{B}_g\cdot d\boldsymbol\Sigma\Big)^{2}. \;}
$$

This is the new result of the section: *the irreducible incoherence of any clock
network encircling a rotating mass is gauge-invariant and equals the squared
gravitomagnetic flux it encloses.* No synchronization convention, no choice of
$N$, can remove it; it can only be spread thinner. In the coherence normalization
of the framework, $\Gamma = 1 - \lVert\delta^0 x^\star\rVert^2/\lVert x^\star\rVert^2$,
this gives the monotone bound

$$
\Gamma_{\text{loop}} \;\le\; 1 - \frac{\Theta^2}{N\,\lVert x^\star\rVert^2},
$$

so frame-dragging *upper-bounds* the achievable sheaf coherence of the network.
As the loop is pushed toward the horizon, $\Theta \to \Theta_H$ set by
$\Omega_H$, and $\Gamma_{\text{loop}}$ is driven to its floor. **Coherence and
frame-dragging are antagonists, and GW250114 fixed the exchange rate at the one
place it is extremal.**

> Status flag. The invariant $N\lVert\delta^0 x^\star\rVert^2=\Theta^2$ is
> derived and solid. The step to $\Gamma_{\text{loop}}$ inherits the same
> normalization debt flagged for $\lVert\eta_d\rVert = 1-\Gamma(d)$ in DRK-170:
> it is exact only under the harmonicity normalization
> $\Gamma = 1-\lVert\delta^0 x^\star\rVert^2/\lVert x^\star\rVert^2$, and is a
> bound, not an identity, until $\lVert x^\star\rVert$ is gauge-fixed.

---

## 3. The horizon as a convergence obstruction

DRK-168 ended at the *impossibility* of measuring the one-way gauge. A horizon is
where that impossibility becomes causal rather than conventional.

Model exterior reconstruction as an inference. Let $\sigma$ be the section
carried by infalling matter, and let $R_T$ be the operator that takes the
ringdown observed on $[0,T]$ and returns an estimate of $\sigma$. The late-time
field at the observer is a sum of quasinormal modes,

$$
\psi(t) \;\sim\; \sum_n A_n\, e^{-\kappa_n t}\, e^{i\omega_n t},
\qquad \kappa_n \gtrsim \kappa = \tfrac{1}{2}\,\text{(surface gravity)},
$$

and this exponential decay rate $\kappa$ is exactly what GW250114 reports as the
horizon-set damping. Decompose $\sigma = P_{H^0}\sigma \oplus P_{H^1}\sigma$ into
the part the horizon re-radiates (soft-hair / harmonic) and the part it traps.
Then:

$$
\lVert R_T\,P_{H^0}\sigma - P_{H^0}\sigma\rVert \;\le\; C\,e^{-\kappa T}
\qquad\text{(geometric convergence)},
$$

so the $H^0$ part is computable to precision $\varepsilon$ in finite observer
time $T = \kappa^{-1}\ln(C/\varepsilon)$. But

$$
\lim_{T\to\infty} R_T\,P_{H^1}\sigma \;\ne\; P_{H^1}\sigma,
\qquad
\lVert R_\infty\sigma - \sigma\rVert \;=\; \lVert P_{H^1}\sigma\rVert .
$$

The obstructed part *never* converges. By the redshift, an infalling worldline
reaches the horizon at finite proper time but infinite coordinate time; the
exterior observer is forever in the pre-image's $T\to\infty$ tail. **The interior
residue $\lVert P_{H^1}\sigma\rVert$ is undecidable from outside in finite proper
time** — the causal analogue of a non-halting computation, the one-way membrane
of DRK-168 taken to extremum. The langolier reading is exact here: what crosses
the horizon is the past the exterior can no longer taste, the section eaten
behind the boundary.

This also closes the loop with DRK-170. The unit $\eta_d : d \to FG(d)$ is the
abductive guess at a pre-image; its defect is the un-invertible part of the
restriction. The horizon is the physical extremization of that defect:
$\lVert P_{H^1}\sigma\rVert$ is $\lVert\eta\rVert$ made gravitational, the
guessed section that no amount of exterior data can confirm.

---

## 4. The information paradox in cost language

Now the sharpest claim, and the most falsifiable. Borrow the cost geometry of
coherent inference (Li–Theil–Harrow–Chuang): reconstructing a $d$-dimensional
signal through a *measurement* bottleneck costs $\Omega(d/\varepsilon)$ samples,
while a coherent (measurement-free) channel costs only $O(1/\varepsilon)$. The
linear-in-$d$ overhead is the price of premature projection — the cost of
collapsing phase before the section is glued.

Apply it at the horizon. To resolve the $d$-th layer of infalling structure to
precision $\varepsilon$, its outgoing amplitude must clear the redshift floor:

$$
e^{-\kappa\,t_d} \;\gtrsim\; \frac{\varepsilon}{d}
\quad\Longrightarrow\quad
t_d \;\lesssim\; \kappa^{-1}\ln\!\frac{d}{\varepsilon},
$$

and the signal-to-noise budget needed to hold that resolution scales as

$$
\text{SNR}_d \;\propto\; \frac{d}{\varepsilon}.
$$

The exponent on $d$ is the diagnostic. If the horizon **decoheres** infalling
information — a measurement, a firewall, a hard boundary — it forces the
incoherent branch and the exterior pays $d/\varepsilon$: reconstruction cost
grows linearly with mode depth. If the horizon is **unitary** — soft hair, a
fuzzball surface, an information-preserving membrane — it permits the coherent
branch and the cost is $1/\varepsilon$, *independent of depth*.

$$
\boxed{\;
\text{firewall / decohering horizon} : \Omega(d/\varepsilon)
\qquad
\text{unitary / soft-hair horizon} : O(1/\varepsilon)
\;}
$$

So the information paradox, restated: **does exterior reconstruction cost scale
with depth, or not?** The two horizons of the last fifty years of dispute are two
points in the cost geometry of inference, separated by a single power of $d$.
This reframing does not resolve the paradox, but it converts a metaphysical
question ("is information lost?") into a scaling question about a measurable
exponent — and ringdown spectroscopy of the kind GW250114 inaugurated is, in
principle, where that exponent would be read.

---

## 5. Falsification (per DRK-131 protocol)

This post is wrong, in whole or in part, if any of the following hold.

1. **The holonomy identity fails.** If $\oint\omega_{\text{sync}}$ is not equal to
   the enclosed gravitomagnetic flux in the stationary weak-field limit — i.e. if
   the Stokes step in §1 is gauge-dependent in a way that survives the closed-loop
   integral — the central claim collapses to analogy. (This is the load-bearing
   step and the most secure; it is textbook gravitomagnetism re-read, not new
   physics.)

2. **The invariant is normalization-dependent.** If $N\lVert\delta^0 x^\star\rVert^2$
   can be made to differ from $\Theta^2$ by a legitimate choice of restriction
   maps or vertex weights, §2's boxed result is false. The cycle-graph derivation
   says it cannot, but a counterexample on a non-uniform loop would kill it.

3. **No depth-scaling exists, even in principle.** If quasinormal reconstruction
   cost is provably independent of infalling mode depth for *both* unitary and
   non-unitary horizons, then §4's distinction is empty and the paradox does not
   live in the cost exponent.

4. **The $H^0/H^1$ split is not causal.** If soft-hair proposals are correct and
   *all* of $\sigma$ is eventually re-radiated, then $P_{H^1}\sigma = 0$, the
   "undecidable residue" of §3 is empty, and the horizon is a convergence
   *delay*, not a convergence *obstruction*. (Note: this is not a refutation of
   the framework but a determination of which branch §4 is in — the post is built
   to survive it, and indeed §4 makes that determination the whole content.)

The post commits to: §1 as established re-reading, §2 as a derived inequality
with a flagged normalization debt, §3 as a model whose key claim is the causal
non-convergence of the $H^1$ part, and §4 as a conjecture reframing the paradox
as a scaling law.

---

## Coda: the frame is dragged, the gauge is one-way

DRK-168 said the universe cannot be synchronized from outside because there is no
outside. GW250114 has now shown us the place where that fact stops being a
philosopher's caution and becomes a wall: the horizon, where the synchronization
connection's holonomy saturates, where infalling clocks are dragged to the
boundary's own rotation, and where their last light reaches us redshifted to a
whisper that decays at the surface gravity. The frame is dragged; the gauge is
one-way; and what falls past $\Omega_H$ is the section we can guess at but never
glue.

The dragon counts the moves it can still make. The horizon is where the count
runs out.

---

*Khrug Engineering · draken.info · DOI [10.5281/zenodo.19273483](https://doi.org/10.5281/zenodo.19273483) · ORCID 0009-0003-8049-7167 · CC BY-SA 4.0*

*Cross-references: DRK-168 (The One-Way Gauge), DRK-170 (The Guessed Section).*
