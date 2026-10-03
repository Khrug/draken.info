---
title: "The Warded Class: Quantum Codes as Sheaves, and What H¹ Protects"
drk: DRK-190
date: 2026-09-30
revised: 2026-09-30
tags: [quantum-error-correction, sheaf, cohomology, qldpc, local-testability, expansion, topology, invariant, anti-totalisation]
layers: [L01, L10, L15]
coherence: 0.85
description: "Quantum CSS codes are chain complexes whose protected qubits are cohomology classes. Codes add distance and soundness to the Draken invariant."
excerpt: "In quantum error correction the protected information is a cohomology class. Codes add what the Draken invariant lacked: distance, the damage it takes to flip the class, and soundness, whether local checks see it."
status: published
author: Khrug Engineering
license: CC BY-SA 4.0
sources:
  - "Bravyi, S., Poulin, D. & Terhal, B. (2010). Tradeoffs for reliable quantum information storage in 2D systems. Physical Review Letters 104, 050503. arXiv:0909.5200"
  - "Breuckmann, N. P. & Eberhardt, J. N. (2021). Quantum low-density parity-check codes. PRX Quantum 2, 040101. doi:10.1103/PRXQuantum.2.040101"
  - "Calderbank, A. R. & Shor, P. W. (1996). Good quantum error-correcting codes exist. Physical Review A 54, 1098–1106. doi:10.1103/PhysRevA.54.1098"
  - "Chen, Y., Huang, M. M.-Y., Liu, Y. & Tang, E.-C. (2026). Cubical sheaf complexes with constant expansion with applications to asymptotically good qLTCs. Preprint. arXiv:2609.28028"
  - "Dennis, E., Kitaev, A., Landahl, A. & Preskill, J. (2002). Topological quantum memory. Journal of Mathematical Physics 43, 4452–4505. arXiv:quant-ph/0110143"
  - "Dinur, I., Evra, S., Livne, R., Lubotzky, A. & Mozes, S. (2022). Locally testable codes with constant rate, distance, and locality. Proceedings of STOC 2022. arXiv:2111.04808"
  - "Dinur, I., Lin, T.-C. & Vidick, T. (2024). Expansion of higher-dimensional cubical complexes with application to quantum locally testable codes. Proceedings of FOCS 2024. arXiv:2402.07476"
  - "Gay, W. & Jeronimo, F. G. (2026). Asymptotically good quantum locally testable codes. Preprint. arXiv:2609.20780"
  - "Google Quantum AI and Collaborators (2025). Quantum error correction below the surface code threshold. Nature 638, 920–926. arXiv:2408.13687"
  - "Gromov, M. (2010). Singularities, expanders and topology of maps. Part 2: From combinatorics to topology via algebraic isoperimetry. Geometric and Functional Analysis 20, 416–526."
  - "Hansen, J. & Ghrist, R. (2019). Toward a spectral theory of cellular sheaves. Journal of Applied and Computational Topology 3, 315–358. doi:10.1007/s41468-019-00038-7"
  - "Kitaev, A. Yu. (2003). Fault-tolerant quantum computation by anyons. Annals of Physics 303, 2–30. arXiv:quant-ph/9707021"
  - "Leverrier, A. & Zémor, G. (2022). Quantum Tanner codes. Proceedings of FOCS 2022. arXiv:2202.13641"
  - "Lin, T.-C. (2024). Transversal non-Clifford gates for quantum LDPC codes on sheaves. Preprint. arXiv:2410.14631"
  - "Linial, N. & Meshulam, R. (2006). Homological connectivity of random 2-complexes. Combinatorica 26, 475–487."
  - "Online Etymology Dictionary. Entries ward (n.) and syndrome (n.). etymonline.com"
  - "Panteleev, P. & Kalachev, G. (2022). Asymptotically good quantum and locally testable classical LDPC codes. Proceedings of STOC 2022, 375–388. doi:10.1145/3519935.3520017"
  - "Panteleev, P. & Kalachev, G. (2024). Maximally extendable sheaf codes. Preprint. arXiv:2403.03651"
  - "Steane, A. (1996). Multiple-particle interference and quantum error correction. Proceedings of the Royal Society A 452, 2551. doi:10.1098/rspa.1996.0136"
---

## §0 Sammanfattning

*Klassen som inget lokalt kan röra är den som bär.*

[The Invariant](/posts/the-invariant/) (DRK-175) named the Draken invariant as the obstruction class $\varkappa\in H^1(X,\mathcal F)$ and argued that the healthy target is nonzero. Quantum error correction is the one engineering discipline where that is literally true: a CSS code is a chain complex, and its protected logical qubits are its (co)homology (Kitaev 2003) **[E]**. The best quantum codes of 2022–2026 are sheaf cohomology on high-dimensional expanders (Panteleev & Kalachev 2024; Chen et al. 2026) **[E]**. From them the post extracts two quantities the Draken invariant lacked, distance and soundness, and proposes the triple rank, distance, soundness as the full invariant **[D]**. The post does not claim that Draken's knowledge sheaf is a quantum code, or that $d$ and $\rho$ can be computed for it yet (§9).

**Epistemic ledger.** Every substantive claim carries one tag:

| Tag | Meaning |
|---|---|
| **[E]** | Established: textbook consensus, a proved theorem, direct measurement, or a standard etymology (SAOB, Hellquist, OED, etymonline) |
| **[S]** | Supported: leading model or majority scholarly reading, strong but incomplete evidence |
| **[H]** | Hypothesis: open, contested, or without decisive evidence |
| **[D]** | Draken synthesis: structural claim made by this corpus, submitted for Clinch review |
| **[M]** | Metaphor or paronomasia: a pointer, not a referent or root (per [The Pendragon Source](/posts/the-pendragon-source/), DRK-165) |

---

## §1 The claim

In quantum error correction, the protected information of a large and now dominant family of codes is, by construction, a (co)homology group (Breuckmann & Eberhardt 2021) **[E]**. Local noise is a low-weight chain, and a low-weight chain cannot change a cohomology class unless its weight reaches the code distance **[E]**. The nontrivial class is therefore not the failure of the system but its payload, and the code is a device for keeping it *warded* **[D]**.

*Ward* here in its first sense: Old English *weard*, "watchman, guard", from PIE *\*wer-* "to perceive, watch out for" (Online Etymology Dictionary, *ward*) **[E]**. The directional *-ward* of *backward* is a separate root that only sounds the same **[M]**.

The post makes three moves. §2–§3 set out the dictionary between codes and chain complexes exactly. §4–§6 show that the recent record-breaking codes are sheaf cohomology in the literal sense. §7–§8 extract two quantities, distance and soundness, and propose them as the missing companions to the rank $b_1$ that [The Invariant](/posts/the-invariant/) (DRK-175) called the coherence genus.

---

## §2 A CSS code is a chain complex

Work over $\mathbb F_2$. Take a three-term chain complex

$$C_2 \xrightarrow{\ \partial_2\ } C_1 \xrightarrow{\ \partial_1\ } C_0, \qquad \partial_1\partial_2 = 0,$$

with coboundaries $\delta_i := \partial_{i+1}^{\top}$. Place one physical qubit on each basis element of $C_1$, so $n=\dim C_1$. Define parity-check matrices

$$H_X := \partial_2^{\top}\ \ (\text{one }X\text{-check per 2-cell}), \qquad H_Z := \partial_1\ \ (\text{one }Z\text{-check per 0-cell}).$$

Two Pauli strings $X^{a}$ and $Z^{b}$ commute iff $a\cdot b \equiv 0 \pmod 2$ **[E]**. The checks are measured simultaneously, so every $X$-row must be orthogonal to every $Z$-row:

$$H_X H_Z^{\top} = \partial_2^{\top}\partial_1^{\top} = (\partial_1\partial_2)^{\top} = 0.$$

The defining identity of a chain complex, $\partial^2=0$, *is* the physical commutation condition. This is the Calderbank–Shor–Steane construction (Calderbank & Shor 1996; Steane 1996), read homologically as in Kitaev (2003) and Breuckmann & Eberhardt (2021) **[E]**.

**Errors and syndromes.** An $X$-error is a set of flipped qubits, a chain $e\in C_1$. Its syndrome is what the $Z$-checks report:

$$s_Z(e) = H_Z e = \partial_1 e \in C_0 .$$

Three cases follow **[E]**:

1. $\partial_1 e \neq 0$: detected.
2. $e \in B_1 = \operatorname{im}\partial_2$: undetected but harmless, since $e$ is a product of $X$-stabilizers and acts trivially on the code space.
3. $e \in Z_1 \setminus B_1$, with $Z_1=\ker\partial_1$: undetected and harmful. It is a logical operator.

So logical $X$-operators are classified by $H_1 = Z_1/B_1$. Dually, a $Z$-error $f\in C_1$ has syndrome $H_X f = \delta_1 f$, and logical $Z$-operators are classified by $H^1 = \ker\delta_1/\operatorname{im}\delta_0$ **[E]**. The number of logical qubits is

$$k = \dim H_1 = \dim H^1 = n - \operatorname{rank}\partial_1 - \operatorname{rank}\partial_2 .$$

Over a field and for finite complexes, homology and cohomology have equal dimension **[E]**.

**Distance.** The code distance is the weight of the lightest nontrivial class representative:

$$d_X = \min\{\,|c| : c\in Z_1\setminus B_1\,\}, \qquad d_Z = \min\{\,|c| : c\in Z^1\setminus B^1\,\}, \qquad d=\min(d_X,d_Z).$$

$d_X$ is the $\mathbb F_2$ **systole** of the complex, $d_Z$ its **cosystole**. The code is written $[[n,k,d]]$. Any error of weight below $d/2$ can be corrected by choosing the minimum-weight chain with the observed boundary; any error of weight below $d$ is either detected or harmless (Breuckmann & Eberhardt 2021) **[E]**.

That is the whole mechanism in one sentence: *information lives in which class the state occupies, noise acts by light chains, and a light chain cannot move a heavy class.*

---

## §3 Worked example: the toric code

Take an $L\times L$ square lattice on the torus $T^2$ (Kitaev 2003). Qubits on edges, $Z$-checks on vertices (each touches four edges), $X$-checks on faces (each bounded by four edges):

$$|V| = L^2,\quad |E| = 2L^2,\quad |F| = L^2,\qquad \chi = |V|-|E|+|F| = 0 .$$

The lattice is connected, so $\operatorname{rank}\partial_1 = L^2-1$; dually $\operatorname{rank}\partial_2 = L^2-1$. Hence

$$k = 2L^2 - (L^2-1) - (L^2-1) = 2 = \dim H_1(T^2;\mathbb F_2).$$

For $L=3$: $n=18$, both ranks equal 8, $k=2$. The two logical qubits are the two independent non-contractible loops of the torus, and the shortest such loop, on the lattice or its dual, has length $L$ **[E]**. The toric code is therefore

$$[[\,2L^2,\ 2,\ L\,]]$$

with every check of weight 4. Dennis, Kitaev, Landahl & Preskill (2002) showed it has an error threshold: below a critical physical error rate, logical failure is suppressed exponentially in $L$ **[E]**.

That threshold is now engineering fact. Google's surface-code memories (the planar variant of the same construction) run below threshold: going from distance 5 to 7 suppresses the logical error rate by a factor $\Lambda = 2.14 \pm 0.02$, reaching 0.143% error per correction cycle at distance 7 on 101 qubits (Google Quantum AI and Collaborators 2025) **[E]**. The class held because $d$ grew.

---

## §4 The ceiling: rank against distance in flat space

The toric code protects only two classes. Can a locally wired planar code protect many, each strongly? No. Bravyi, Poulin & Terhal (2010) proved that for stabilizer codes with local checks on a 2D lattice the number of logical qubits and the distance obey **[E]**

$$k\,d^{2} = O(n).$$

The toric code saturates it: $k d^2 = 2L^2 = n$. With locality fixed, the number of protected classes and the square of their protection draw on one budget. Many classes means each is cheap to flip.

This is the first sharpening of [The Invariant](/posts/the-invariant/) (DRK-175) §5, which called the healthy $\varkappa$ "bounded, nonzero" on grounds of legibility. The coding theorem gives a harder reason: in a substrate where every check is local and low-dimensional, **large $b_1$ forces small systole** **[D]**. A plurality of irreducible differences, held on flat local wiring, is fragile by theorem, not by temperament. The transfer from stabilizer codes to Draken sheaves is the proposal tested in §10, F3.

---

## §5 Breaking the ceiling: expansion

The ceiling is a property of geometry, not of codes. Panteleev & Kalachev (2022) constructed the first **asymptotically good** quantum LDPC codes **[E]**:

$$k = \Theta(n),\qquad d = \Theta(n),\qquad \text{check weight } O(1),$$

and Leverrier & Zémor (2022) gave a second construction, *quantum Tanner codes* **[E]**. Both are built on complexes derived from expander graphs, which admit no bounded-dimension Euclidean embedding with short wires **[E]**. The classical sibling, locally testable codes with constant rate, distance and locality, appeared the same year (Dinur et al. 2022) **[E]**.

Rank and distance can both be linear only if the wiring is non-local: every part of the substrate is a few hops from every other **[E]**. The price is paid in connectivity, not in qubits.

---

## §6 Tanner codes are sheaves, literally

A Tanner code places a small **local code** $\mathcal F(v)$ on each vertex of a graph. A global word is valid iff its restriction to the edges around every vertex lies in that vertex's local code. That is the definition of a global section **[E]**:

$$\mathcal C = \Gamma(X,\mathcal F) = H^0(X,\mathcal F).$$

Panteleev & Kalachev (2024) made this explicit: a **sheaf code** is a linear code with a fixed hierarchical collection of local codes, viewed as a sheaf of vector spaces on a finite topological space they call the *coded space* **[E]**. Tensor product codes, Sipser–Spielman expander codes and their high-dimensional analogues are all sheaf codes, and the notion extends to sheaves of CSS codes, assigning a quantum code rather than a classical one to each open set **[E]**.

For a quantum code, pass one degree up. A cellular sheaf $\mathcal F$ on a complex $X$ gives a cochain complex

$$C^0(X,\mathcal F)\xrightarrow{\ \delta\ }C^1(X,\mathcal F)\xrightarrow{\ \delta\ }C^2(X,\mathcal F),$$

and taking qubits in degree 1 makes the §2 dictionary apply verbatim, with

$$k = \dim H^1(X,\mathcal F).$$

This is the same object as Draken's invariant: [The Invariant](/posts/the-invariant/) (DRK-175) defines $\varkappa\in H^1(X,\mathcal F)$ and $b_1=\dim H^1(X,\mathcal F)$ for a cellular sheaf in the sense of Hansen & Ghrist (2019) **[E]**. In a sheaf code, $b_1$ is simply the number of logical qubits.

The literature is now working in exactly this language:

- **Gates from cup products.** Lin (2024) extends the cup product to cochain complexes of sheaves; the logical operators become geometric surfaces, and their triple intersection number defines a transversal non-Clifford (CCZ) gate **[E]**. The cohomology ring, not just its dimension, is doing computation.
- **Local-to-global.** Dinur, Lin & Vidick (2024) give a framework in which expansion of small local pieces implies expansion of the whole cubical complex **[E]**.
- **September 2026.** Chen et al. (2026) construct $r$-dimensional cubical sheaf complexes whose degree-$k$ CSS codes have constant rate, linear distance and constant soundness with bounded check weights; $r=4$, $k=2$ gives asymptotically good qubit qLTCs, via Reed–Solomon local codes, the Dinur–Lin–Vidick framework and **sheaf duality** **[S]**. Independently, Gay & Jeronimo (2026) construct explicit asymptotically good quantum locally testable codes over qubits **[S]**. Both are unreviewed preprints, hence **[S]** rather than **[E]**.

Four years after good qLDPC codes, the best known quantum codes are written as sheaf cohomology on high-dimensional expanders **[E]**. The Draken choice of formalism was, by accident of timing, the one the field converged on **[D]**.

---

## §7 Soundness: can local watchers see global drift?

Distance answers *how hard is it to flip the class*. It does not answer *would anyone notice the damage accumulating*. That is **local testability**.

Write $\|\cdot\|$ for normalized Hamming weight. The coboundary expansion of Linial & Meshulam (2006) and Gromov (2010) asks that a cochain far from the coboundaries have a large coboundary **[E]**. When nontrivial cohomology must be kept, as in a code, the relevant form measures distance to the cocycles instead:

$$\|\delta f\| \;\ge\; \varepsilon \cdot \min_{z\in Z^1}\|f - z\| \qquad \text{for all } f\in C^1 .$$

For a code, the operational version is **soundness** $\rho$: for any word $x$ (one inequality per CSS side),

$$\frac{|\text{violated checks}(x)|}{m} \;\ge\; \rho\cdot\frac{\operatorname{dist}(x,\mathcal C)}{n}.$$

A code with $\rho$ bounded away from zero is one in which **the amount of alarm is proportional to the amount of damage** **[E]**.

The toric code fails this completely. Let $e$ be a string of $\ell$ flipped edges along a path, $\ell < L/2$. Its syndrome is $\partial_1 e$: exactly two vertices, the endpoints, whatever $\ell$ is **[E]**. So

$$\frac{|\partial_1 e|/L^2}{\ell/2L^2} = \frac{4}{\ell}\;\xrightarrow{\ \ell\sim L/2\ }\;\frac{8}{L}\to 0 .$$

A long error is exactly as quiet as a short one. It grows silently in the interior, with only its two ends reporting, until $\ell$ crosses $d/2$ and the decoder, choosing the shorter completion, closes the loop the wrong way **[E]**. The logical failure is sudden, but the error was accumulating for many cycles before it.

This is [Övervakaren och Undervakaren](/posts/overvakaren-och-undervakaren/) (DRK-178) in coding form: time and truth are only assigned at the write-gates, and everything between gates is interpolation **[D]**. In the toric code the gates are the syndrome bits, and the interior of an error string is invisible to all of them. The good qLTCs of §6 are the constructions in which the gates see proportionally.

It is also the most literal model yet of [The Coherence Debt](/posts/the-coherence-debt/) (DRK-121): chain weight accumulating below the reporting surface, settled all at once when it reaches the distance **[D]**. This is a structural reading, not an identity.

*Syndrome* itself: Greek *syndromē*, "a running together, concurrence" (Online Etymology Dictionary, *syndrome*) **[E]**. The checks that fire together.

---

## §8 Proposal: the warded invariant

[The Invariant](/posts/the-invariant/) (DRK-175) gives Draken one discrete invariant, the rank $b_1=\dim H^1(X,\mathcal F)$. The coding literature says rank is one coordinate of three. Proposed, for a sheaf $\mathcal F$ equipped with a weight on cochains **[D]**:

$$\mathfrak W(\mathcal F) := \big(\, b_1,\ \ d,\ \ \rho \,\big)$$

- $b_1$, **rank**: how many independent irreducible differences the system holds.
- $d$, **systole/cosystole**: how much local damage it takes to erase or flip one of them.
- $\rho$, **soundness**: whether local checks register damage in proportion to its size.

The diagnostic regions this defines are all Draken readings **[D]**:

| Regime | Signature | Draken reading |
|---|---|---|
| Totalised | $b_1 = 0$ | Nothing to protect. The unknot of [The Invariant](/posts/the-invariant/) (DRK-175); [The Totalitarian Sheaf](/posts/the-totalitarian-sheaf/) (DRK-125) |
| Fragile plurality | $b_1$ large, $d$ small | Many differences, each cheap to overwrite. Forced by §4 under flat locality |
| Silent drift | $d$ adequate, $\rho\approx 0$ | Differences are guarded, but damage accumulates unseen and settles at once (§7) |
| Warded | $b_1>0$ bounded, $d$ large, $\rho$ bounded below | The difference is held, guarded, and watched |

The anti-totalisation principle then reads: *keep $b_1>0$*. The warded condition adds: *and pay for the distance and the soundness*, which §4–§5 say can only be bought with connectivity beyond the local **[D]**.

---

## §9 What this does and does not license

The dictionary in §2–§6 is exact mathematics with citations. The transfer in §7–§8 to Draken's knowledge sheaf is a proposal, and it has a named gap.

Codes live over $\mathbb F_2$ with a Hamming weight. The Draken apparatus is spectral and real-valued: $\Gamma$ comes from the sheaf Laplacian $L=\delta^{\top}\delta$ over $\mathbb R$ (Hansen & Ghrist 2019) **[E]**. Over $\mathbb F_2$ there is no positivity and no spectrum in that sense **[E]**. The shared object is the functor *sheaf → cochain complex → cohomology*, not the Laplacian. So $b_1$ transfers exactly; $d$ and $\rho$ transfer only once a weight on Draken cochains is defined **[D]**. Until then they are coordinates with no instrument.

The instrument is buildable. [The Sheaf Analyzer](/posts/sheaf-analyzer-manual/) (DRK-132) already computes coboundary maps on text-derived sheaves; computing the rank, a minimum-weight nontrivial cocycle, and the violated-check fraction under planted inconsistencies is a finite linear-algebra problem on small instances **[D]**.

---

## §10 Falsification (DRK-131)

**F1: Dictionary.** §2–§3 state the CSS-to-chain-complex correspondence, the count $k=n-\operatorname{rank}\partial_1-\operatorname{rank}\partial_2$ and the toric-code parameters $[[2L^2,2,L]]$. **Refuted** if any of these is misstated against Kitaev (2003) or Breuckmann & Eberhardt (2021).

**F2: Sheaf claim.** §6 claims the good qLDPC and qLTC constructions are cohomology of a sheaf on a complex. **Refuted** if they turn out not to be representable that way, so that "sheaf" there is only a loose label. Checkable against Panteleev & Kalachev (2024) and Chen et al. (2026).

**F3: Rank–distance transfer.** §4 predicts a rank-against-distance tradeoff for Draken-style sheaves with local restriction maps. **Refuted** if, on computed instances, $b_1$ can be raised without lowering $d$ while the wiring stays local.

**F4: Soundness transfer.** §7 predicts that in a sheaf with large computed $\rho$, the fraction of violated local checks scales with the size of a planted inconsistency. **Refuted** if planting inconsistencies of increasing size in a test corpus and running the analyzer shows no such scaling.

**F5: Silent drift.** §8 predicts that a system with $\rho\approx 0$ accumulates hidden damage faster than a well-sounded one under matched noise. **Refuted** if it does not; the third row of the §8 table then goes.

**F6: Scope limit.** Nothing here claims that Draken's knowledge sheaf is a quantum code, or that $d$ and $\rho$ are computable for it today. If F3–F5 fail, §2–§6 stand as exact mathematics and §7–§8 reduce to vocabulary.

---

## §11 Provenance and leaks

1. **Authorship.** Topic and direction from Khrug; post drafted by Claude (Anthropic) with sources verified during drafting. Not yet reviewed by the Clinch.
2. **Verification.** Every arXiv reference was checked against the arXiv API for title, authors and date; journal references and DOIs were taken from the same records. The Google Quantum AI figures are from the paper's own abstract.
3. **Preprints.** Chen et al. (2026) and Gay & Jeronimo (2026) were posted in September 2026 and are not peer-reviewed; claims resting on them are tagged **[S]**. Lin (2024) and Panteleev & Kalachev (2024) are also preprints.
4. **Not cited here.** A Microsoft Quantum and Quantinuum Nature study on error-correction gains, published in June 2026, was considered but left out, as only secondary reporting was checked.
5. **Revised 2026-09-30 to POST_STANDARD v1:** added §0, the epistemic ledger, claim tags throughout, Provenance and leaks; replaced the old etymology marks with ledger tags; shortened description and excerpt; linked every DRK mention; renumbered Falsification as §10 in F-format; aligned the footer. The argument and mathematics are unchanged.

---

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

*Operators: $\varkappa\in H^1$, $b_1$, $d$ (systole/cosystole), $\rho$ (soundness), $\delta$, $\Gamma$, $K(t)$ · Crosslinks: [The Invariant](/posts/the-invariant/) (DRK-175) · [The Totalitarian Sheaf](/posts/the-totalitarian-sheaf/) (DRK-125) · [The Coherence Debt](/posts/the-coherence-debt/) (DRK-121) · [Övervakaren och Undervakaren](/posts/overvakaren-och-undervakaren/) (DRK-178) · [The Sheaf Analyzer](/posts/sheaf-analyzer-manual/) (DRK-132) · [The Pendragon Source](/posts/the-pendragon-source/) (DRK-165)*

*Det som skyddas är det som inte kan nås lokalt.*

*Khrug Engineering · Göteborg · ORCID 0009-0003-8049-7167 · DOI 10.5281/zenodo.23121197 · CC BY-SA 4.0*
