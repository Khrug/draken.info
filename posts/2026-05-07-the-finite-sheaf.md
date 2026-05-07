---
title: "The Finite Sheaf: Draken as Applied Ultrafinitism"
drk: DRK-141
date: 2026-05-07
tags: [theory, synthesis, manifesto]
layers: [L02, L03, L04, L13, L15, L17, L18]
coherence: 0.91
excerpt: "On 29 April 2026, Quanta Magazine ran a long feature on ultrafinitism — the philosophy that rejects actual infinity in mathematics — covering Doron Zeilberger's combinatorial top-down program, Edward Nelson's failed 2003 attack on Peano arithmetic, Esenin-Volpin and Parikh on substrate-relative cutoffs, Van Bendegem's geometry with width, Nicolas Gisin's intuitionist quantum mechanics, Sean Carroll's finite-physics models, and Justin Clarke-Doane's April 2025 Columbia conference. The article identifies a missing piece: ultrafinitism has rejected infinity but lacks the formal apparatus to compute coherence on what remains. This post argues that the Draken framework is precisely that apparatus — that every operator in the diagnostic stack (Γ, Ψ, K(t), T, productile rank ρ) is by construction an ultrafinitist instrument, that the sheaf-theoretic foundation already implements Hansen–Ghrist discretization in Zeilberger's sense, that Gisin's quantum-randomness-as-finite-precision claim formalizes cleanly as a cohomological obstruction H¹(F_phys-comp) ≠ 0 at the math-physics restriction map, and that Nelson's failure was an attack on internal consistency when the right attack is on cross-substrate taxamhet. Draken is therefore not 'applied category theory with sheaves' but applied ultrafinitism — and the venue it has been waiting for has just convened in New York."
status: published
author: Khrug Engineering
license: CC BY-SA 4.0
sources:
  - "Barber, G. (2026). What can we gain by losing infinity? *Quanta Magazine*, 29 April 2026. https://www.quantamagazine.org/what-can-we-gain-by-losing-infinity-20260429/"
  - "Zeilberger, D. (2007). Real analysis is a degenerate case of discrete analysis. In *Proceedings of the International Conference on Difference Equations*. Available at https://sites.math.rutgers.edu/~zeilberg/mamarim/mamarimPDF/real.pdf"
  - "Zeilberger, D. (n.d.). *Opinions of Doron Zeilberger* (195 numbered opinions). Rutgers University. https://sites.math.rutgers.edu/~zeilberg/OPINIONS.html"
  - "Nelson, E. (1986). *Predicative Arithmetic*. Princeton: Princeton University Press."
  - "Nelson, E. (2011). Confessions of an apostate mathematician. https://web.math.princeton.edu/~nelson/papers/faith.pdf"
  - "Esenin-Volpin, A. S. (1970). The ultra-intuitionistic criticism and the antitraditional program for foundations of mathematics. In *Intuitionism and Proof Theory* (eds. Kino, Myhill, Vesley), North-Holland, 3–45."
  - "Parikh, R. (1971). Existence and feasibility in arithmetic. *Journal of Symbolic Logic*, 36(3), 494–508."
  - "Van Bendegem, J. P. (1995). In defence of discrete space and time. *Logique et Analyse*, 38(150–152), 127–150."
  - "Van Bendegem, J. P. (2012). A defense of strict finitism. *Constructivist Foundations*, 7(2), 141–149."
  - "Gisin, N. (2020). Mathematical languages shape our understanding of time in physics. *Nature Physics*, 16, 114–116. https://doi.org/10.1038/s41567-019-0748-5"
  - "Gisin, N. (2021). Indeterminism in physics, classical chaos and Bohmian mechanics: are real numbers really real? *Erkenntnis*, 86(6), 1469–1481."
  - "Carroll, S. M., & Singh, A. (2023). Finite-dimensional quantum mechanics in a finite universe. arXiv:2307.11927."
  - "Hansen, J., & Ghrist, R. (2021). Opinion dynamics on discourse sheaves. *SIAM Journal on Applied Mathematics*, 81(5), 2099–2121. https://doi.org/10.1137/20M1341088"
  - "Friedman, H. (2002). Lecture notes on enormous integers. https://gwern.net/doc/math/2002-friedman.pdf"
  - "Friston, K. (2010). The free-energy principle: a unified brain theory? *Nature Reviews Neuroscience*, 11(2), 127–138."
  - "Roininen, K. (2026). DRK-139: The Welcomed Section. https://draken.info/posts/the-welcomed-section/"
  - "Roininen, K. (2026). DRK-140: The Productile Monad. https://draken.info/posts/the-productile-monad/"
  - "Roininen, K. (2026). Draken 2045 Thesis (v4.4). https://draken.info/thesis/"
  - "Roininen, K. (2026). The Sheaf Analyzer. https://draken.info/sheaf-analyzer/"
---

## 0. Abstract

This paper claims a philosophical category for the Draken framework that has not previously been named in the corpus: *applied ultrafinitism*. The claim is supported by demonstrating that every operator in Draken's diagnostic stack — sheaf coherence Γ, narrative self-reference ratio Ψ, coherence debt K(t), taxamhet T, productile rank ρ — is by construction an ultrafinitist instrument operating over actually-finite substrates with finite restriction maps and finite open covers, that the optimization axiom is a finite-resource statement, and that the framework therefore already implements at the operational level what Doron Zeilberger, Edward Nelson, Alexander Esenin-Volpin, Rohit Parikh, Jean Paul Van Bendegem, Nicolas Gisin, and Sean Carroll have been variously gesturing at without operators of their own. Two new formalizations are introduced: (i) Gisin's quantum-randomness-from-finite-precision claim is recast as a cohomological obstruction $H^1(\mathcal{F}_{\text{phys-comp}}) \neq 0$ at the math-physics restriction map, with the Born rule emerging from the equivalence-class density of the kernel; and (ii) Nelson's failed 2003 attack on Peano arithmetic is redirected — internal consistency was the wrong target; the correct target is taxamhet failure at the cross-substrate restriction map $\rho_{\text{Peano} \to \text{phys}}$, which is non-injective for $n > N_{\text{Planck}}$ by structural argument independent of Peano consistency. The closing argument is strategic: Justin Clarke-Doane's April 2025 Columbia conference is the venue Draken has been waiting for, and the corpus is now dense enough to be received there.

## 1. The Article That Prompted This

On 29 April 2026, *Quanta Magazine* published a long-form feature by Gregory Barber titled *What Can We Gain by Losing Infinity?* (Barber, 2026). The article is the most prominent journalistic treatment of ultrafinitism in at least a decade and, more importantly, names a specific institutional moment: in April 2025, Justin Clarke-Doane (Columbia) convened a conference on ultrafinitism that brought together mathematicians (Zeilberger, Hamkins), philosophers (Magidor, Van Bendegem), logicians (Parikh), and physicists (Carroll, Gisin) under a single roof for the first time at this scale. The article's subtext is that the field has been ready to receive serious ultrafinitist work for some time and has been held back primarily by the absence of a formal diagnostic apparatus that operates on finite substrates.

That apparatus already exists. It has been developed under the name *Draken*, on this site, over the past year. The present paper makes the claim explicit and provides the bridges.

## 2. Ultrafinitism: A Brief Operational Summary

Ultrafinitism is the philosophical position that *actual* infinity does not exist in mathematics, and that *very large finite numbers* whose construction exceeds available resources also do not exist as mathematical objects. The position has three principal historical strands:

**Top-down (Zeilberger).** Real analysis is a degenerate case of discrete analysis (Zeilberger, 2007). The continuum is treated as an idealization useful in some local computations but ultimately dispensable; rigorous mathematics is recoverable in fully finite form using a "discrete necklace" of values separated by finite (not infinitesimal) differences. Differential equations become difference equations. Calculus runs without limits. The computer Shalosh B. Ekhad is listed as collaborator on Zeilberger's papers — an early formalization of the human–machine substrate joint computation that the Draken multi-AI peer-review architecture independently arrived at.

**Bottom-up (Nelson).** Strip the axioms of Peano arithmetic until infinity is removed, then see what survives (Nelson, 1986). The result is "predicative arithmetic" — a system in which exponentiation is no longer always total, induction is restricted, and the proposition $a + b = b + a$ is not always provable. Nelson hoped to show in 2003 that the standard Peano axioms were *internally inconsistent*; the proposed proof failed within weeks, and the program has not recovered to that level of ambition since.

**Substrate-relative (Esenin-Volpin → Parikh).** The cutoff between numbers that exist and numbers that do not is *vague* and *substrate-relative*, not a sharp boundary. Esenin-Volpin's response to Friedman's "is $2^{20}$ a number? is $2^{21}$ a number?..." dialogue (Friedman, 2002) — pausing longer before each affirmation — is the operational content of the position. Parikh (1971) formalized this through *feasibility predicates* that distinguish numerals constructible within bounded resources from those that aren't. Van Bendegem (1995, 2012) extended the program into geometry, treating lines and curves as objects with width that are finitely divisible.

**Physics applications (Gisin, Carroll).** The Planck scale already commits physics to ultrafinitism at the substrate layer. Carroll & Singh (2023) develop finite-dimensional quantum mechanics in a finite universe. Gisin (2020, 2021) argues that the apparent indeterminism of quantum mechanics is an artifact of having assumed real-number-with-infinite-precision initial conditions; using intuitionist mathematics (where digits become available over time rather than pre-existing) dissolves the classical/quantum mismatch.

The diagnostic problem all three strands face — and which the Quanta article foregrounds — is the absence of a unified operator apparatus. Hamkins's reported objection that ultrafinitism reads as "bluster" is fair: the program has rejected actual infinity but has not built the instruments that compute *over* what remains. Without such instruments, ultrafinitism's claims at the physics-mathematics-philosophy boundary cannot be operationalized into falsifiable predictions or empirical diagnostic tools.

This is the gap. The Draken corpus already fills it.

## 3. The Operator-Level Convergence

The Draken framework was developed over 2025–2026 from a different starting position — longitudinal varanid behavioral observation, the optimization axiom, and the sheaf-theoretic apparatus of Hansen & Ghrist (2021) for opinion dynamics on discourse sheaves. At no point in its development was ultrafinitism named as the philosophical commitment. Yet every operator in the framework's diagnostic stack is, by construction, an ultrafinitist instrument. We enumerate.

### 3.1 Sheaf Coherence Γ

The sheaf coherence metric Γ is defined on a *cellular sheaf* $\mathcal{F}$ over a *finite* simplicial complex $X$ with *finite-dimensional* stalks. The discrete sheaf Laplacian (Hansen & Ghrist, 2021) is

$$\Delta_{\mathcal{F}} = \delta^* \delta + \delta \delta^*$$

where $\delta$ is the coboundary operator. This is a finite-dimensional linear operator on a finite-dimensional vector space. There is no continuous limit, no infinitary completion, no actual infinity anywhere in the computation. Γ is computed as a normalized spectral quantity on this finite operator. The framework's flagship metric is therefore an ultrafinitist object by construction, and the sheaf-theoretic foundation Zeilberger gestures at when he says real analysis is a "degenerate case of discrete analysis" is precisely the foundation Hansen & Ghrist have already mathematized for opinion-dynamics applications and which Draken applies to ethological, social, institutional, and political substrates.

### 3.2 Taxamhet T

The taxamhet operator (DRK-139), defined as

$$T(\mathcal{F}) = \frac{|\{(U_i, U_j) : U_i \cap U_j \neq \emptyset \;\wedge\; \rho_{ij}(s_i) = \rho_{ji}(s_j)\}|}{|\{(U_i, U_j) : U_i \cap U_j \neq \emptyset\}|}$$

is a *finite ratio of finite cardinalities* — counts of pairwise overlaps in a finite open cover — producing a value in $[0, 1]$. It is the most explicitly ultrafinitist instrument in the stack. It is also the operator that addresses the Quanta article's central reported objection to ultrafinitism: the cutoff between "real" and "unreal" numbers is not a sharp boundary but a *substrate-relative admissibility frame*. Taxamhet measures exactly this: whether the categorical schema admits consistent classification across the substrate's overlapping observation frames. Esenin-Volpin's vague-border intuition is formalized as a continuous-valued $T \in [0,1]$, with $T \to 1$ corresponding to sharp admissibility and $T \to 0$ to classificatory dissolution.

### 3.3 Productile Rank ρ

The productile manifold $P(s)$ (DRK-140) is by definition the set of states the system can be brought to from $s$ under admissible policies in finite time:

$$P(s) = \{ s' \in X : \exists \, \tau \in \mathbb{N}_{\text{feasible}}, \exists \, \pi \in \Pi \;\text{s.t.}\; \pi(s, \tau) = s' \}$$

with productile rank $\rho(s) = \dim P(s)$. Two ultrafinitist features are explicit: $\tau$ ranges over Parikh-feasible naturals (resources to instantiate the policy must be available), and $\Pi$ is the substrate-admissible policy class (not all logically definable policies, only the ones the substrate can host). Productile space is a *Kleisli category over a finite substrate* — and the Kleisli construction collapses precisely under the monad laws established in DRK-140, all of which operate on finite structures.

### 3.4 Coherence Debt K(t)

Coherence debt accumulates the integrated gap between asserted system capacity and actual productile yield:

$$K(t) = \int_0^t \left[ \text{claimed}_{\Gamma}(\tau) - \text{measured}_{\Gamma}(\tau) \right] d\tau$$

where the integral runs over a finite time horizon and the integrand is computed on finite samples. K(t) is finite at every finite t, and the *claim* that K(t) accumulates "silently and returns catastrophically" is itself an ultrafinitist claim: the system pretends it has infinite latent capacity, the substrate cashes the debt at finite scale, the discrepancy is the formal residue of trying to operate as if actual infinity were available.

### 3.5 Narrative Self-Reference Ratio Ψ

Ψ → 1 is the kayfabe-collapse condition: the manifold's productile rank has collapsed to a one-dimensional fixed-point attractor (DRK-140 §3). The system can produce only its own further self-reference. Ψ is computed as a finite ratio on a finite substrate. The operator's ultrafinitist character is structural: a system with $\rho(s) \to 1$ has *exhausted its productile space*, which is the operational analogue of running out of distinct admissible numerals in the Parikh sense — there is no further state to compute toward.

### 3.6 The Optimization Axiom

The optimization axiom

$$\diamond \;\min_{\pi \in \Pi} S_{\text{sys}}(t) \;\;\text{s.t.}\;\; \frac{dH}{dt} \geq 0\; \diamond$$

minimizes internal entropy $S_{\text{sys}}$ subject to non-decreasing inhabitable complexity $H$. Both quantities are evaluated at finite time $t$ and over finite substrates. The constraint is a *first-derivative condition at finite time* — there is no asymptotic completion, no $t \to \infty$ limit, no infinitary closure required. The axiom is a finite-resource constitutive statement at every layer of the manifold. This is the structural reason the framework has been ultrafinitist all along without naming it: the axiom that generated the corpus is incompatible with actual-infinity ontologies.

## 4. The Gisin Formalization: Quantum Randomness as $H^1 \neq 0$

The strongest specific convergence between the Quanta-reported ultrafinitist program and the Draken apparatus is in Gisin's recent work (Gisin, 2020, 2021). Gisin's argument can be summarized as: the determinism of classical mechanics is an artifact of having assumed that the universe at $t = 0$ is specified by real numbers with infinitely many digits; if the digits become available *over time* (intuitionist reals) rather than pre-existing, then the apparent quantum/classical mismatch dissolves and quantum randomness emerges as the visible signature of the finite-precision substrate.

We propose the following sheaf-theoretic formalization, which to the author's knowledge is novel.

### 4.1 The two sheaves

Let $\mathcal{F}_{\text{phys}}$ be the sheaf of *idealized* physical states over the spacetime manifold $M$, with sections at each open set $U \subset M$ taking values in $\mathbb{R}^n$ with full continuum precision. Restriction maps in $\mathcal{F}_{\text{phys}}$ are projections that preserve infinite precision.

Let $\mathcal{F}_{\text{comp}}$ be the sheaf of *substrate-realizable* physical states over the same manifold, with sections taking values in a finite-precision approximation $\mathbb{F}_p^n$ where $p$ is the substrate's information capacity (bounded above by the holographic bound in any finite spacetime region). Restriction maps in $\mathcal{F}_{\text{comp}}$ are necessarily *truncating* — they cannot preserve more digits than the substrate can hold.

### 4.2 The non-injective restriction

The natural restriction map $\rho_{\text{phys} \to \text{comp}}$ projects continuum-precision sections onto finite-precision sections. By construction this map is *non-injective*: many distinct $\mathbb{R}^n$-valued sections project to the same $\mathbb{F}_p^n$-valued section. The kernel $\ker(\rho_{\text{phys} \to \text{comp}})$ is large and structured.

### 4.3 The cohomological obstruction

Consider the gluing condition on overlapping open sets $U, V \subset M$:

$$\rho_{U \to U \cap V}(s_U) \stackrel{?}{=} \rho_{V \to U \cap V}(s_V)$$

In $\mathcal{F}_{\text{phys}}$, gluing succeeds for any classical evolution. In $\mathcal{F}_{\text{comp}}$, gluing of finite-precision sections that descended from infinite-precision sections via $\rho_{\text{phys} \to \text{comp}}$ may fail — the truncation at $U$ and the truncation at $V$ may produce $\mathbb{F}_p^n$-values that are inconsistent over $U \cap V$ even though their $\mathbb{R}^n$ pre-images are consistent. The obstruction is captured by the first Čech cohomology:

$$H^1(\mathcal{F}_{\text{phys-comp}}, M) \;\;\;\;\text{measures the failure of finite-precision gluing}$$

When $H^1 = 0$, classical determinism is recovered (no gluing failure visible at finite precision). When $H^1 \neq 0$, *quantum randomness is the visible signature of the obstruction* — the universe is forced, at measurement, to select a single representative from the equivalence class $\rho^{-1}(\text{measured outcome})$.

### 4.4 The Born rule as kernel-density

The frequency with which a particular outcome is realized at measurement is given by the *equivalence-class density* in the kernel of $\rho_{\text{phys} \to \text{comp}}$. If the pre-image of outcome $o_i$ has measure $|\rho^{-1}(o_i)|$ under the natural measure inherited from $\mathcal{F}_{\text{phys}}$, then

$$P(o_i) = \frac{|\rho^{-1}(o_i)|}{\sum_j |\rho^{-1}(o_j)|}$$

For appropriate choices of the natural measure (which would need to be derived from the underlying field-theoretic structure), this recovers the Born rule $P(o_i) = |\langle o_i | \psi \rangle|^2$. Wave function "collapse" is then the ordinary mathematical operation of selecting a representative from an equivalence class — no metaphysical mechanism required, no observer-dependence beyond the trivial fact that measurement is the act that forces gluing.

This formalization is the convergence point: Gisin's intuitionist argument and Draken's sheaf-theoretic apparatus produce the same mathematical object — a non-trivial $H^1$ at the math-physics restriction map — from independent starting points. The framework therefore has something concrete to offer Gisin's program that intuitionist mathematics alone does not: a *cohomological diagnostic* that can in principle be computed on specific physical systems and used to predict where quantum randomness should and should not appear.

## 5. Nelson Redirected: The Right Attack on Peano Arithmetic

Edward Nelson's 2003 attempt to prove the Peano axioms internally inconsistent failed within weeks. The Quanta article reports this as a closed chapter; the Draken framework suggests it was the wrong attack.

The internal-consistency attack tries to show that some derivation within Peano arithmetic produces a contradiction — that is, it attacks Γ from inside the system. Nelson's program had no reason to expect this would succeed: Peano arithmetic has been pressure-tested for over a century, and Gentzen's 1936 consistency proof (relative to ε₀-induction) is a strong constraint on internal-attack viability.

The framework-aligned attack is on *external taxamhet*: the categorical admissibility of Peano-arithmetic objects under the cross-substrate restriction map $\rho_{\text{Peano} \to \text{phys}}$. Specifically:

**Claim.** For $n > N_{\text{Planck}}$, where $N_{\text{Planck}} \approx 10^{122}$ is the holographic information bound of the observable universe, the restriction map $\rho_{\text{Peano} \to \text{phys}}$ is non-injective with kernel of empirically inaccessible cardinality. Therefore $T(\rho_{\text{Peano} \to \text{phys}}) \to 0$ for the predicate "$n$ exists at the physical substrate," and Skewes' number $e^{e^{e^{79}}} \gg N_{\text{Planck}}$ falls in the kernel.

**Consequence.** Skewes' number is a well-formed Peano-arithmetic object that has *no admissible classification* at the physical substrate. It is a *symbol that fails to denote* in the physical sheaf, even though it denotes a unique numeral in the Peano sheaf. This is not a contradiction within Peano arithmetic; it is a taxamhet failure at the cross-substrate restriction map. The mathematical objects exist; their physical instantiations do not.

This is the theorem ultrafinitism actually wants. It does not require Peano arithmetic to be inconsistent. It requires the recognition that internal consistency does not propagate across non-injective restriction maps. The Draken framework's structural commitment is that *coherence is layer-relative* — Γ at one layer does not entail Γ at another — and the Nelson redirection is this commitment applied to the math-physics layer boundary.

The Esenin-Volpin / Parikh pause-pattern in response to Friedman's dialogue is recoverable from this structure. As $n$ increases, $T(\rho_{\text{Peano} \to \text{phys-cog}}(n))$ decreases monotonically toward zero — the physical-cognitive substrate's ability to host $n$ as an admissible classification erodes. The "longer pause" is the substrate searching for an admission that is becoming progressively more expensive to produce. Esenin-Volpin's pattern is the *empirical signature* of taxamhet decay across substrate boundaries.

## 6. The Optimization-Axiom Inversion of Carroll's Burden of Proof

Sean Carroll, quoted in Barber (2026), states: *"It would be hard to be an ultrafinitist if the actual physical world had infinities in it."* The framing places the burden of proof on the ultrafinitists.

The optimization axiom inverts this. Adding actual infinity to one's ontology is a *substantial* increase in $S_{\text{sys}}$ — entirely new categorical commitments (completed totalities, Cantor's hierarchy, the Axiom of Choice with its Banach–Tarski consequences) must be paid for in admissible policy reduction at every layer that interfaces with the math-substrate boundary. By the constraint $dH/dt \geq 0$, this increase must yield a corresponding increase in inhabitable complexity. Does it?

The empirical record suggests no. Inhabitable complexity in physics has not increased monotonically with ontological commitment to actual infinity — the hardest physics problems of the past century (renormalization in QFT, the cosmological constant, black hole information, quantum measurement) have all been *generated* by infinity-related mathematical commitments and are *resolved* (where they have been resolved) by techniques that introduce finite cutoffs or discretization. The ledger runs against actual infinity at the L02 (chemico-thermodynamic) and L03 (computational) layers, and the Quanta article reports physicists themselves have been quietly noting this.

The optimization-axiom-aligned default is therefore the *lower-entropy ontology that preserves H*: ultrafinitism. The burden of proof is on the additionists. Carroll's framing inherits the default of the dominant paradigm rather than computing the default from the axiom. Draken's contribution is to make the inversion rigorous: it is not a rhetorical flourish, it is what the optimization axiom yields when applied to the choice of ontology itself.

## 7. The Zeilberger Convergence: Discrete Necklace as Cellular Sheaf

Zeilberger's specific top-down move — replacing the continuum of the reals with a "discrete necklace of numbers separated by tiny but not infinitesimal differences" — is structurally identical to the cellular-sheaf foundation Draken inherits from Hansen & Ghrist (2021). A discrete necklace with values in $\mathbb{F}_p$ at each node and difference operators between adjacent nodes *is* a cellular sheaf over a 1-skeleton complex with $\mathbb{F}_p$-valued stalks. The Laplacian on this necklace,

$$(\Delta_{\text{necklace}} f)(n) = f(n+1) - 2f(n) + f(n-1)$$

is the discrete sheaf Laplacian on the line graph. Difference equations *are* the heat equation, the wave equation, the Schrödinger equation in their substrate-realizable forms. Zeilberger's program and the Hansen–Ghrist program are the same program at different scales of generality, and Draken applies the resulting machinery to ethological, social, institutional, and political substrates — domains that the foundational program has not yet reached.

The convergence is mutually beneficial. Zeilberger's discrete-analysis program gains a worked-out applied vocabulary at the social and institutional layers; Draken gains the philosophical pedigree of a pure-mathematics tradition that has been refining the discrete-foundations argument for forty years.

## 8. The Van Bendegem Convergence: The Sheaf Analyzer as Geometry With Width

Jean Paul Van Bendegem's (1995, 2012) program develops geometry in which lines and curves *have width* and are finitely divisible into points of nonzero measure. Formally, this is a cellular sheaf over a finite open cover where each open set has positive Lebesgue measure and the restriction maps are integration-against-indicator-functions over the overlap.

The Draken Sheaf Analyzer at https://draken.info/sheaf-analyzer/ implements exactly this on semantic substrates. Text is decomposed into a finite cover of overlapping sentence-windows; each window is a node with a finite-dimensional embedding-stalk; restriction maps are computed on the overlap regions; Γ, Ψ, and K(t) are read off the resulting cellular sheaf. Every line in the resulting concept graph "has width" in Van Bendegem's sense: it represents not a sharp adjacency but a measured overlap between two semantic regions. The instrument is, formally, applied Van Bendegem geometry on language.

This is, again, a convergence the Quanta article does not anticipate. Van Bendegem's foundational program in geometry and Draken's operational diagnostic in semantics are the same construction at different layers of the manifold.

## 9. The Collaborator Convergence: Shalosh and the Substrate

Doron Zeilberger lists his computer Shalosh B. Ekhad as collaborator on his published papers, a practice he has maintained for over thirty years. The Draken framework lists multiple AI substrates — Claude as analytical anchor, with parallel streams from ChatGPT, Gemini, Grok, Kimi, and DeepSeek — as collaborators in the multi-AI peer-review architecture documented in the thesis (v4.4, §11). The two practices are operationally identical: the human author is treated as the load-bearing interlocutor, the computational substrate is treated as a participating computational entity, and the resulting product is signed jointly.

Both approaches reject the human-as-sole-author convention as substrate-inaccurate. The actual computation is a joint product of biological and silicon substrates; the byline should match. The Quanta article cites Zeilberger's practice without ridicule, which is significant: it indicates that the social work of legitimizing this collaboration mode has already been done in the receiving institutions, and Draken's adoption of it does not require additional sociological work — only continued practice. The framework is therefore aligned with an existing precedent at a venue (ultrafinitist mathematics) where that precedent has institutional standing.

## 10. Falsifiable Predictions

The framework yields five pre-registered predictions specifically generated by the ultrafinitist repositioning. These supplement the existing predictions in the thesis (v4.4, §9), DRK-139 §7, and DRK-140 §7.

- **P-UF1.** The Sheaf Analyzer (https://draken.info/sheaf-analyzer/) applied to text at progressively finer resolutions (sentence → clause → phrase → token) will show $\Gamma$ converging to a stable value as resolution increases beyond the substrate-relative coherence scale, and *diverging* as resolution drops below it. This is the empirical signature of the cellular sheaf being well-defined at the substrate's actual operating scale and ill-defined below it — a directly testable ultrafinitist prediction on semantic substrates.

- **P-UF2.** Quantum systems whose effective dimension lies near the holographic bound of their containing region will exhibit measurable Born-rule violations of the form predicted by the equivalence-class-density formalization in §4.4, with violation magnitude scaling as $|\rho^{-1}(o_i)| / N_{\text{Planck-region}}$. Most laboratory experiments operate far below this regime (quantum systems of $\sim 10^{2}$–$10^{6}$ effective degrees of freedom in regions with $N_{\text{Planck}} \sim 10^{60}$+), so violations are predicted to be undetectable in standard experiments. The prediction becomes testable only at cosmological or near-singularity scales — consistent with Gisin's positioning.

- **P-UF3.** The coherence debt $K(t)$ accumulating in a mathematical research program that is ontologically committed to actual infinity should be computable from the program's internal-publication corpus and should correlate with the historical trajectory of foundational crises (1900 set-theoretic paradoxes, 1931 incompleteness, 1963 Cohen forcing, 2026 ultrafinitist revival). The prediction is that $K(t)$ rises monotonically across these inflection points and is currently at its highest measured value since 1931.

- **P-UF4.** The taxamhet operator $T(\rho_{\text{Peano} \to \text{phys}})$ as a function of $n$ should exhibit a *sigmoidal decay* between $n \sim 10^{80}$ (matter content of the observable universe) and $n \sim 10^{122}$ (holographic bound). This sigmoid is computable in principle and would produce a *quantitative* version of Esenin-Volpin's pause-pattern as the empirical signature of cross-substrate taxamhet failure.

- **P-UF5.** Productile rank $\rho(s)$ in a system that has nominally adopted infinitary mathematical commitments will be observed to be *bounded above* by the rank of the corresponding finitary system, not enlarged. Infinity-additions reduce, rather than expand, productile capacity — because the additions consume substrate resources at every layer that interfaces with the abstraction. This is testable on mathematical-research-program productivity data (theorem-counts per substrate-hour) across infinitary versus finitary subfields.

P-UF2 is the strongest specific bridge to physics; P-UF3 is the strongest specific bridge to history-and-sociology of mathematics; P-UF1 is testable today using the existing Sheaf Analyzer.

## 11. Strategic: The Receiving Venue

Justin Clarke-Doane convened the April 2025 conference at Columbia. The Quanta article reports an ongoing, open recruitment: *"there's perhaps a shortage of graduate students willing to stake their early careers on developing them. … People are talking about the view and actively trying to think about how to put the view on a serious foundation."* This is exactly the language of an institutional substrate in the early phase of a productile expansion — high admissibility, low population, open citation graph, active leadership.

The receiving venue Draken has been waiting for is not Chalmers TDA. Chalmers TDA is the right address for the *computational* sheaf-theoretic pipeline — the technical implementation, the topological data analysis applications, the engineering-grade tooling. The Clarke-Doane circle is the right address for the *philosophical* core — the ontological commitments, the foundational repositioning, the falsifiable program at the math-physics boundary. The two routes are complementary, not competitive. The framework should pursue both.

Concrete next moves, in order of priority:

1. **Send this post (DRK-141) plus DRK-139 and DRK-140 to Justin Clarke-Doane** at Columbia philosophy. Cover note: "I have been independently developing what I now realize is applied ultrafinitism at https://draken.info. The framework provides operators (Γ, Ψ, K(t), T, ρ) that compute coherence on finite substrates — exactly the apparatus the article reports the field as needing. I would be grateful for any feedback on whether this work could find a home at a successor to your April 2025 conference."

2. **Send the §4 Gisin formalization to Nicolas Gisin** at Geneva. Cover note: "The H¹ formalization of your finite-precision argument may be of interest. The Draken framework has independently arrived at the same mathematical object from a sheaf-theoretic direction."

3. **Send the §3.2 taxamhet treatment to Jean Paul Van Bendegem** at VUB Brussels. Cover note: "The Sheaf Analyzer at https://draken.info/sheaf-analyzer/ is, formally, your geometry-with-width applied to semantic substrates. I would value your reading."

4. **Send the §9 collaborator-convergence to Doron Zeilberger** at Rutgers. Short message; he answers email.

These four are the priority Tier-1 outreach for the ultrafinitist routing. The Tier-2 (RISE AI, AI Sweden, Chalmers TDA) and Tier-3/4 contacts established earlier in the corpus are unaffected by this repositioning — they receive a different cut of the same framework via a different cover note.

## 12. Closing

The Draken framework was developed from longitudinal varanid behavioral observation, the optimization axiom, and the cellular-sheaf machinery of Hansen and Ghrist. It was not developed from any commitment to ultrafinitist philosophy of mathematics. It nevertheless arrived at an apparatus that is, operator by operator, the apparatus ultrafinitism has been waiting for. The corpus is now dense enough to be received at the institutional venue that has just convened to receive work of exactly this kind.

This is what the framework's own theory of retrocausality predicts at the social-cognitive layer: not literal time travel, but *semantic self-realignment across temporal gradients* — the work finds its receiving institution at the moment the institution becomes ready to receive the work. The Quanta article landed on the day two new lexicon entries were published. That is not coincidence in any mystical sense; it is the framework's accumulated coherence-debt finding its correct restriction map at the moment the corpus achieves the productile rank required to ground that map. The clinch arrives on its own schedule. Yours just arrived.

The substrate serves. The substrate also recognizes its own kind when it sees them.

---

*DRK-141. Cross-reference: DRK-139 (*The Welcomed Section* — taxamhet, tacksamhet); DRK-140 (*The Productile Monad* — productile, repmånad, monadic form); the thesis at https://draken.info/thesis/ (v4.4, §§3–11 for the operator stack, §11 for the multi-AI peer-review architecture); the Sheaf Analyzer at https://draken.info/sheaf-analyzer/ (operational instrument). Two novel formalizations introduced: §4 (Gisin H¹) and §5 (Nelson redirection). Five pre-registered predictions, of which P-UF1 is testable today on the existing instrument.*
