---
title: "The Warded Class: Quantum Codes as Sheaves, and What H¹ Protects"
drk: DRK-190
date: 2026-09-30
tags: [quantum-error-correction, sheaf, cohomology, qldpc, local-testability, expansion, topology, invariant, anti-totalisation]
layers: [L01, L10, L15]
coherence: 0.85
description: "In quantum error correction the nontrivial cohomology class is not a failure to glue but the payload; codes supply the two numbers the Draken invariant lacks, distance and soundness."
excerpt: "DRK-175 named the Draken invariant as the obstruction class in H^1 and argued the healthy target is nonzero. Quantum error correction is the one mature engineering discipline where that is literally true: a CSS code is a chain complex, its protected logical qubits are its (co)homology, and the good qLDPC and qLTC codes of 2022-2026 are sheaves on high-dimensional expanders. Codes add two numbers the corpus lacks: distance, how much local damage it takes to flip the class, and soundness, whether local checks can see global drift. Rank alone says how much difference a system holds; distance says how well it is guarded; soundness says whether anyone can tell."
status: published
author: Khrug Engineering
license: CC BY-SA 4.0
sources:
  - "Calderbank, A. R. & Shor, P. W. (1996). Good quantum error-correcting codes exist. Phys. Rev. A 54, 1098-1106. https://doi.org/10.1103/PhysRevA.54.1098"
  - "Steane, A. (1996). Multiple-particle interference and quantum error correction. Proc. R. Soc. Lond. A 452, 2551. https://doi.org/10.1098/rspa.1996.0136"
  - "Kitaev, A. Yu. (2003). Fault-tolerant quantum computation by anyons. Annals of Physics 303, 2-30. arXiv:quant-ph/9707021"
  - "Dennis, E., Kitaev, A., Landahl, A. & Preskill, J. (2002). Topological quantum memory. J. Math. Phys. 43, 4452-4505. arXiv:quant-ph/0110143"
  - "Bravyi, S., Poulin, D. & Terhal, B. (2010). Tradeoffs for reliable quantum information storage in 2D systems. Phys. Rev. Lett. 104, 050503. arXiv:0909.5200"
  - "Breuckmann, N. P. & Eberhardt, J. N. (2021). Quantum Low-Density Parity-Check Codes. PRX Quantum 2, 040101. https://doi.org/10.1103/PRXQuantum.2.040101"
  - "Panteleev, P. & Kalachev, G. (2022). Asymptotically good quantum and locally testable classical LDPC codes. Proc. STOC 2022, 375-388. https://doi.org/10.1145/3519935.3520017"
  - "Leverrier, A. & Zémor, G. (2022). Quantum Tanner codes. Proc. FOCS 2022. arXiv:2202.13641"
  - "Dinur, I., Evra, S., Livne, R., Lubotzky, A. & Mozes, S. (2022). Locally testable codes with constant rate, distance, and locality. Proc. STOC 2022. arXiv:2111.04808"
  - "Panteleev, P. & Kalachev, G. (2024). Maximally Extendable Sheaf Codes. arXiv:2403.03651"
  - "Dinur, I., Lin, T.-C. & Vidick, T. (2024). Expansion of higher-dimensional cubical complexes with application to quantum locally testable codes. FOCS 2024. arXiv:2402.07476"
  - "Lin, T.-C. (2024). Transversal non-Clifford gates for quantum LDPC codes on sheaves. arXiv:2410.14631"
  - "Gay, W. & Jeronimo, F. G. (2026). Asymptotically Good Quantum Locally Testable Codes. arXiv:2609.20780"
  - "Chen, Y., Huang, M. M.-Y., Liu, Y. & Tang, E.-C. (2026). Cubical Sheaf Complexes with Constant Expansion with Applications to Asymptotically Good qLTCs. arXiv:2609.28028"
  - "Google Quantum AI and Collaborators (2025). Quantum error correction below the surface code threshold. Nature 638, 920-926. arXiv:2408.13687"
  - "Linial, N. & Meshulam, R. (2006). Homological connectivity of random 2-complexes. Combinatorica 26, 475-487."
  - "Gromov, M. (2010). Singularities, expanders and topology of maps. Part 2: From combinatorics to topology via algebraic isoperimetry. Geom. Funct. Anal. 20, 416-526."
  - "Hansen, J. & Ghrist, R. (2019). Toward a Spectral Theory of Cellular Sheaves. J. Appl. Comput. Topology 3, 315-358. https://doi.org/10.1007/s41468-019-00038-7"
  - "Online Etymology Dictionary: ward (n.), syndrome (n.). https://www.etymonline.com"
---

*[The Invariant](/posts/the-invariant/) (DRK-175) closed on a claim: the obstruction class $\varkappa\in H^1(X,\mathcal F)$ is what survives deformation, and the healthy target is not zero. That was argued from knots and helicity. This post tests it against the one field where engineers build systems whose entire purpose is to keep a nonzero cohomology class alive against noise. The result is a confirmation and a correction: rank is not enough. A class also needs a guard.*

## §1 The claim

In quantum error correction, the protected information of a large and now dominant family of codes is, by construction, a (co)homology group. Local noise is a low-weight chain; a low-weight chain cannot change a cohomology class unless its weight reaches the code distance. The nontrivial class is therefore not the failure of the system but its payload, and the code is a device for keeping it *warded*.

*Ward* here in its first sense: Old English *weard*, "watchman, guard", from PIE *\*wer-* "to perceive, watch out for" `[attested]` (Online Etymology Dictionary, *ward*). Not the directional *-ward* of *backward*, which is a separate root.

The post makes three moves. §2–§3 set out the dictionary between codes and chain complexes exactly. §4–§6 show that the recent record-breaking codes are sheaf cohomology in the literal sense. §7–§8 extract two quantities, distance and soundness, and propose them as the missing companions to the rank $b_1$ that DRK-175 called the coherence genus.

## §2 A CSS code is a chain complex

Work over $\mathbb F_2$. Take a three-term chain complex

$$C_2 \xrightarrow{\ \partial_2\ } C_1 \xrightarrow{\ \partial_1\ } C_0, \qquad \partial_1\partial_2 = 0,$$

with coboundaries $\delta_i := \partial_{i+1}^{\top}$. Place one physical qubit on each basis element of $C_1$, so $n=\dim C_1$. Define parity-check matrices

$$H_X := \partial_2^{\top}\ \ (\text{one }X\text{-check per 2-cell}), \qquad H_Z := \partial_1\ \ (\text{one }Z\text{-check per 0-cell}).$$

Two Pauli strings $X^{a}$ and $Z^{b}$ commute iff $a\cdot b \equiv 0 \pmod 2$. The checks are measured simultaneously, so every $X$-row must be orthogonal to every $Z$-row:

$$H_X H_Z^{\top} = \partial_2^{\top}\partial_1^{\top} = (\partial_1\partial_2)^{\top} = 0.$$

The defining identity of a chain complex, $\partial^2=0$, *is* the physical commutation condition. This is the Calderbank–Shor–Steane construction (Calderbank & Shor 1996; Steane 1996), read homologically as in Kitaev (2003) and the review by Breuckmann & Eberhardt (2021).

**Errors and syndromes.** An $X$-error is a set of flipped qubits, a chain $e\in C_1$. Its syndrome is what the $Z$-checks report:

$$s_Z(e) = H_Z e = \partial_1 e \in C_0 .$$

Three cases follow:

1. $\partial_1 e \neq 0$: detected.
2. $e \in B_1 = \operatorname{im}\partial_2$: undetected but harmless, since $e$ is a product of $X$-stabilizers and acts trivially on the code space.
3. $e \in Z_1 \setminus B_1$, with $Z_1=\ker\partial_1$: undetected and harmful. It is a logical operator.

So logical $X$-operators are classified by $H_1 = Z_1/B_1$. Dually, a $Z$-error $f\in C_1$ has syndrome $H_X f = \delta_1 f$, and logical $Z$-operators are classified by $H^1 = \ker\delta_1/\operatorname{im}\delta_0$. The number of logical qubits is

$$k = \dim H_1 = \dim H^1 = n - \operatorname{rank}\partial_1 - \operatorname{rank}\partial_2 .$$

(Over a field and for finite complexes, homology and cohomology have equal dimension.)

**Distance.** The code distance is the weight of the lightest nontrivial class representative:

$$d_X = \min\{\,|c| : c\in Z_1\setminus B_1\,\}, \qquad d_Z = \min\{\,|c| : c\in Z^1\setminus B^1\,\}, \qquad d=\min(d_X,d_Z).$$

$d_X$ is the $\mathbb F_2$ **systole** of the complex, $d_Z$ its **cosystole**. The code is written $[[n,k,d]]$. Any error of weight below $d/2$ can be corrected by choosing the minimum-weight chain with the observed boundary; any error of weight below $d$ is either detected or harmless.

That is the whole mechanism in one sentence: *information lives in which class the state occupies, noise acts by light chains, and a light chain cannot move a heavy class.*

## §3 Worked example: the toric code

Take an $L\times L$ square lattice on the torus $T^2$ (Kitaev 2003). Qubits on edges, $Z$-checks on vertices (each touches four edges), $X$-checks on faces (each bounded by four edges):

$$|V| = L^2,\quad |E| = 2L^2,\quad |F| = L^2,\qquad \chi = |V|-|E|+|F| = 0 .$$

The lattice is connected, so $\operatorname{rank}\partial_1 = L^2-1$; dually $\operatorname{rank}\partial_2 = L^2-1$. Hence

$$k = 2L^2 - (L^2-1) - (L^2-1) = 2 = \dim H_1(T^2;\mathbb F_2).$$

For $L=3$: $n=18$, both ranks equal 8, $k=2$. The two logical qubits are the two independent non-contractible loops of the torus. The shortest such loop, on the lattice or its dual, has length $L$, so the toric code is

$$[[\,2L^2,\ 2,\ L\,]]$$

with every check of weight 4. Dennis, Kitaev, Landahl & Preskill (2002) showed it has an error threshold: below a critical physical error rate, logical failure is suppressed exponentially in $L$.

That threshold is now engineering fact. Google's surface-code memories (the planar variant of the same construction) run below threshold: going from distance 5 to 7 suppresses the logical error rate by a factor $\Lambda = 2.14 \pm 0.02$, reaching 0.143% error per correction cycle at distance 7 on 101 qubits (Google Quantum AI 2025). The class held because $d$ grew.

## §4 The ceiling: rank against distance in flat space

The toric code protects only two classes. Can a locally wired planar code protect many, each strongly? No. Bravyi, Poulin & Terhal (2010) proved that for stabilizer codes with local checks on a 2D lattice,

$$k\,d^{2} = O(n).$$

The toric code saturates it: $k d^2 = 2L^2 = n$. With locality fixed, the number of protected classes and the square of their protection draw on one budget. Many classes means each is cheap to flip.

For Draken this is the first sharpening of DRK-175 §5. That post said the healthy $\varkappa$ is "bounded, nonzero" on the grounds of legibility. The coding theorem gives a harder reason: in a substrate where every check is local and low-dimensional, **large $b_1$ forces small systole**. A plurality of irreducible differences, held on flat local wiring, is fragile by theorem, not by temperament.

## §5 Breaking the ceiling: expansion

The ceiling is a property of geometry, not of codes. Remove the low-dimensional embedding and it goes. Panteleev & Kalachev (2022) constructed the first **asymptotically good** quantum LDPC codes:

$$k = \Theta(n),\qquad d = \Theta(n),\qquad \text{check weight } O(1),$$

and Leverrier & Zémor (2022) gave a second construction, *quantum Tanner codes*. Both are built on complexes derived from expander graphs, which admit no bounded-dimension Euclidean embedding with short wires. The classical sibling, locally testable codes with constant rate, distance and locality, appeared the same year (Dinur, Evra, Livne, Lubotzky & Mozes 2022).

Rank and distance can both be linear only if the wiring is non-local: every part of the substrate is a few hops from every other. The price is paid in connectivity, not in qubits.

## §6 Tanner codes are sheaves, literally

A Tanner code places a small **local code** $\mathcal F(v)$ on each vertex of a graph. A global word is valid iff its restriction to the edges around every vertex lies in that vertex's local code. That is the definition of a global section:

$$\mathcal C = \Gamma(X,\mathcal F) = H^0(X,\mathcal F).$$

Panteleev & Kalachev (2024) made this explicit: a **sheaf code** is a linear code with a fixed hierarchical collection of local codes, viewed as a sheaf of vector spaces on a finite topological space they call the *coded space*. Tensor product codes, Sipser–Spielman expander codes and their high-dimensional analogues are all sheaf codes. They extend the notion to sheaves of CSS codes, assigning a quantum code rather than a classical one to each open set.

For a quantum code, pass one degree up. A cellular sheaf $\mathcal F$ on a complex $X$ gives a cochain complex

$$C^0(X,\mathcal F)\xrightarrow{\ \delta\ }C^1(X,\mathcal F)\xrightarrow{\ \delta\ }C^2(X,\mathcal F),$$

and taking qubits in degree 1 makes the §2 dictionary apply verbatim, with

$$k = \dim H^1(X,\mathcal F).$$

This is the same object as Draken's invariant: DRK-175 defines $\varkappa\in H^1(X,\mathcal F)$ and $b_1=\dim H^1(X,\mathcal F)$ for a cellular sheaf in the sense of Hansen & Ghrist (2019). In a sheaf code, $b_1$ is simply the number of logical qubits.

The literature is now working in exactly this language:

- **Gates from cup products.** Lin (2024) extends the cup product to cochain complexes of sheaves. The logical operators become geometric surfaces, and their triple intersection number defines a transversal non-Clifford (CCZ) gate. The cohomology ring, not just its dimension, is doing computation.
- **Local-to-global.** Dinur, Lin & Vidick (2024) give a framework in which expansion of small local pieces implies expansion of the whole cubical complex.
- **September 2026.** Chen, Huang, Liu & Tang construct $r$-dimensional cubical sheaf complexes whose degree-$k$ CSS codes have constant rate, linear distance and constant soundness with bounded check weights; $r=4$, $k=2$ gives asymptotically good qubit qLTCs. Their proof runs on Reed–Solomon local codes, the Dinur–Lin–Vidick framework and **sheaf duality** (Chen et al. 2026). Independently, Gay & Jeronimo (2026) construct explicit asymptotically good quantum locally testable codes over qubits.

Four years after good qLDPC codes, the best known quantum codes are written as sheaf cohomology on high-dimensional expanders. The Draken choice of formalism was, by accident of timing, the one the field converged on.

## §7 Soundness: can local watchers see global drift?

Distance answers *how hard is it to flip the class*. It does not answer *would anyone notice the damage accumulating*. That is **local testability**.

Write $\|\cdot\|$ for normalized Hamming weight. The coboundary expansion of Linial & Meshulam (2006) and Gromov (2010) asks that a cochain far from the coboundaries have a large coboundary. When nontrivial cohomology must be kept, as in a code, the relevant form measures distance to the cocycles instead:

$$\|\delta f\| \;\ge\; \varepsilon \cdot \min_{z\in Z^1}\|f - z\| \qquad \text{for all } f\in C^1 .$$

For a code, the operational version is **soundness** $\rho$: for any word $x$ (one inequality per CSS side),

$$\frac{|\text{violated checks}(x)|}{m} \;\ge\; \rho\cdot\frac{\operatorname{dist}(x,\mathcal C)}{n}.$$

A code with $\rho$ bounded away from zero is one in which **the amount of alarm is proportional to the amount of damage**.

The toric code fails this completely. Let $e$ be a string of $\ell$ flipped edges along a path, $\ell < L/2$. Its syndrome is $\partial_1 e$: exactly two vertices, the endpoints, whatever $\ell$ is. So

$$\frac{|\partial_1 e|/L^2}{\ell/2L^2} = \frac{4}{\ell}\;\xrightarrow{\ \ell\sim L/2\ }\;\frac{8}{L}\to 0 .$$

A long error is exactly as quiet as a short one. It grows silently in the interior, with only its two ends reporting, until $\ell$ crosses $d/2$ and the decoder, choosing the shorter completion, closes the loop the wrong way. The logical failure is sudden, but the error was accumulating for many cycles before it.

This is [Övervakaren och Undervakaren](/posts/overvakaren-och-undervakaren/) (DRK-178) in coding form: time and truth are only assigned at the write-gates, and everything between gates is interpolation. In the toric code the gates are the syndrome bits, and the interior of an error string is invisible to all of them. The good qLTCs of §6 are the constructions in which the gates see proportionally.

It is also the most literal model yet of [The Coherence Debt](/posts/the-coherence-debt/) (DRK-121): chain weight accumulating below the reporting surface, settled all at once when it reaches the distance. Offered as a structural reading, not an identity.

*Syndrome* itself: Greek *syndromē*, "a running together, concurrence" `[attested]` (Online Etymology Dictionary, *syndrome*). The checks that fire together.

## §8 Proposal: the warded invariant

DRK-175 gives Draken one discrete invariant, the rank $b_1=\dim H^1(X,\mathcal F)$. The coding literature says rank is one coordinate of three. Proposed, for a sheaf $\mathcal F$ equipped with a weight on cochains:

$$\mathfrak W(\mathcal F) := \big(\, b_1,\ \ d,\ \ \rho \,\big)$$

- $b_1$, **rank**: how many independent irreducible differences the system holds.
- $d$, **systole/cosystole**: how much local damage it takes to erase or flip one of them.
- $\rho$, **soundness**: whether local checks register damage in proportion to its size.

The diagnostic regions this defines:

| Regime | Signature | Draken reading |
|---|---|---|
| Totalised | $b_1 = 0$ | Nothing to protect. The unknot of DRK-175; [The Totalitarian Sheaf](/posts/the-totalitarian-sheaf/) (DRK-125) |
| Fragile plurality | $b_1$ large, $d$ small | Many differences, each cheap to overwrite. Forced by §4 under flat locality |
| Silent drift | $d$ adequate, $\rho\approx 0$ | Differences are guarded, but damage accumulates unseen and settles at once (§7) |
| Warded | $b_1>0$ bounded, $d$ large, $\rho$ bounded below | The difference is held, guarded, and watched |

The anti-totalisation principle then reads: *keep $b_1>0$*. The warded condition adds: *and pay for the distance and the soundness*, which §4–§5 say can only be bought with connectivity beyond the local.

## §9 What this does and does not license

The dictionary in §2–§6 is exact mathematics with citations. The transfer in §7–§8 to Draken's knowledge sheaf is a proposal, and it has a named gap.

Codes live over $\mathbb F_2$ with a Hamming weight. The Draken apparatus is spectral and real-valued: $\Gamma$ comes from the sheaf Laplacian $L=\delta^{\top}\delta$ over $\mathbb R$ (Hansen & Ghrist 2019). Over $\mathbb F_2$ there is no positivity and no spectrum in that sense. The shared object is the functor *sheaf → cochain complex → cohomology*, not the Laplacian. So $b_1$ transfers exactly; $d$ and $\rho$ transfer only once a weight on Draken cochains is defined. Until then they are coordinates with no instrument.

The instrument is buildable. The [Sheaf Analyzer](/posts/sheaf-analyzer-manual/) (DRK-132) already computes coboundary maps on text-derived sheaves; computing the rank, a minimum-weight nontrivial cocycle, and the violated-check fraction under planted inconsistencies is a finite linear-algebra problem on small instances.

## Falsification

This post is wrong, in whole or part, if:

(a) **Dictionary.** The CSS-to-chain-complex correspondence of §2, the count $k=n-\operatorname{rank}\partial_1-\operatorname{rank}\partial_2$, or the toric-code parameters $[[2L^2,2,L]]$ are misstated. Checkable against Kitaev (2003) and Breuckmann & Eberhardt (2021).

(b) **Sheaf claim.** The recent good qLDPC/qLTC constructions cited in §6 turn out not to be representable as cohomology of a sheaf on a complex, so that "sheaf" there is only a loose label. Checkable against Panteleev & Kalachev (2024) and Chen et al. (2026).

(c) **Rank–distance transfer.** On computed Draken-style sheaves with local restriction maps, no rank-against-distance tradeoff appears: $b_1$ can be raised without lowering $d$ while the wiring stays local. Then the §4 reading is metaphor.

(d) **Soundness transfer.** Planting inconsistencies of increasing size in a test corpus and running the analyzer, the fraction of violated local checks does not scale with the planted size in any sheaf where $\rho$ is computed to be large. Then the §7 watcher reading fails.

(e) **Silent-drift claim.** A system in the "silent drift" regime is shown to accumulate hidden damage no faster than a well-sounded one under matched noise. Then soundness is not the operative variable and the table in §8 loses its third row.

## References

- Bravyi, S., Poulin, D. & Terhal, B. (2010). Tradeoffs for reliable quantum information storage in 2D systems. *Physical Review Letters* 104, 050503. [arXiv:0909.5200](https://arxiv.org/abs/0909.5200)
- Breuckmann, N. P. & Eberhardt, J. N. (2021). Quantum low-density parity-check codes. *PRX Quantum* 2, 040101. [doi:10.1103/PRXQuantum.2.040101](https://doi.org/10.1103/PRXQuantum.2.040101)
- Calderbank, A. R. & Shor, P. W. (1996). Good quantum error-correcting codes exist. *Physical Review A* 54, 1098–1106. [doi:10.1103/PhysRevA.54.1098](https://doi.org/10.1103/PhysRevA.54.1098)
- Chen, Y., Huang, M. M.-Y., Liu, Y. & Tang, E.-C. (2026). Cubical sheaf complexes with constant expansion with applications to asymptotically good qLTCs. Preprint. [arXiv:2609.28028](https://arxiv.org/abs/2609.28028)
- Dennis, E., Kitaev, A., Landahl, A. & Preskill, J. (2002). Topological quantum memory. *Journal of Mathematical Physics* 43, 4452–4505. [arXiv:quant-ph/0110143](https://arxiv.org/abs/quant-ph/0110143)
- Dinur, I., Evra, S., Livne, R., Lubotzky, A. & Mozes, S. (2022). Locally testable codes with constant rate, distance, and locality. *Proceedings of STOC 2022*. [arXiv:2111.04808](https://arxiv.org/abs/2111.04808)
- Dinur, I., Lin, T.-C. & Vidick, T. (2024). Expansion of higher-dimensional cubical complexes with application to quantum locally testable codes. *Proceedings of FOCS 2024*. [arXiv:2402.07476](https://arxiv.org/abs/2402.07476)
- Gay, W. & Jeronimo, F. G. (2026). Asymptotically good quantum locally testable codes. Preprint. [arXiv:2609.20780](https://arxiv.org/abs/2609.20780)
- Google Quantum AI and Collaborators (2025). Quantum error correction below the surface code threshold. *Nature* 638, 920–926. [arXiv:2408.13687](https://arxiv.org/abs/2408.13687)
- Gromov, M. (2010). Singularities, expanders and topology of maps. Part 2: From combinatorics to topology via algebraic isoperimetry. *Geometric and Functional Analysis* 20, 416–526.
- Hansen, J. & Ghrist, R. (2019). Toward a spectral theory of cellular sheaves. *Journal of Applied and Computational Topology* 3, 315–358. [doi:10.1007/s41468-019-00038-7](https://doi.org/10.1007/s41468-019-00038-7)
- Kitaev, A. Yu. (2003). Fault-tolerant quantum computation by anyons. *Annals of Physics* 303, 2–30. [arXiv:quant-ph/9707021](https://arxiv.org/abs/quant-ph/9707021)
- Leverrier, A. & Zémor, G. (2022). Quantum Tanner codes. *Proceedings of FOCS 2022*. [arXiv:2202.13641](https://arxiv.org/abs/2202.13641)
- Lin, T.-C. (2024). Transversal non-Clifford gates for quantum LDPC codes on sheaves. Preprint. [arXiv:2410.14631](https://arxiv.org/abs/2410.14631)
- Linial, N. & Meshulam, R. (2006). Homological connectivity of random 2-complexes. *Combinatorica* 26, 475–487.
- Online Etymology Dictionary. Entries *ward* (n.) and *syndrome* (n.). [etymonline.com](https://www.etymonline.com)
- Panteleev, P. & Kalachev, G. (2022). Asymptotically good quantum and locally testable classical LDPC codes. *Proceedings of STOC 2022*, 375–388. [doi:10.1145/3519935.3520017](https://doi.org/10.1145/3519935.3520017)
- Panteleev, P. & Kalachev, G. (2024). Maximally extendable sheaf codes. Preprint. [arXiv:2403.03651](https://arxiv.org/abs/2403.03651)
- Steane, A. (1996). Multiple-particle interference and quantum error correction. *Proceedings of the Royal Society A* 452, 2551. [doi:10.1098/rspa.1996.0136](https://doi.org/10.1098/rspa.1996.0136)

---
*Operators: $\varkappa\in H^1$, $b_1$, $d$ (systole/cosystole), $\rho$ (soundness), $\delta$, $\Gamma$, $K(t)$ · Crosslinks: [The Invariant](/posts/the-invariant/) (DRK-175) · [The Totalitarian Sheaf](/posts/the-totalitarian-sheaf/) (DRK-125) · [The Coherence Debt](/posts/the-coherence-debt/) (DRK-121) · [Övervakaren och Undervakaren](/posts/overvakaren-och-undervakaren/) (DRK-178) · [The Sheaf Analyzer](/posts/sheaf-analyzer-manual/) (DRK-132) · ORCID 0009-0003-8049-7167 · DOI 10.5281/zenodo.19273483*
