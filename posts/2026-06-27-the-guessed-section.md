---
title: "The Guessed Section: Abduction as H¹-Combat and the Defect of the Unit"
drk: DRK-170
date: 2026-06-27
tags: [theory, synthesis, logic, measurement, sheaf]
layers: [L01, L06, L08, L11, L13, L15]
coherence: 0.88
description: "The three modes of inference are one consequence relation read in three directions. Deduction resides in H⁰ — it reads off a global section that already exists. Abduction is the search for a preimage: the construction of a candidate section whose obstruction to gluing is a class in H¹. Read categorically, abduction is the lift G, the unit η is literally an abductive guess at a preimage, and its defect is 1 − Γ. This is why abduction — not deduction — is the native home of the coherent-but-unsound, and why a mechanized renaissance of abduction needs Γ as its governor."
excerpt: "Deduction is the safe arrow: rule and case in, result out, functorial and sound. Everyone formalizes it because it never leaves the image. Abduction is the arrow Peirce called the only one that introduces a new idea — and it is least formalized precisely because it guesses. This post places the guess. Over a cellular sheaf, deduction is residence in the harmonic space H⁰; abduction is the attempt to construct a global section from a local one, and the irreducible obstruction to that construction is a nonzero class in H¹. The taxidermied lizard is an abductive explanation: locally coherent, globally unsound, a nonzero H¹ class wearing the costume of a section. And the applied-math renaissance now arriving is mechanized abduction at scale — which is exactly why it needs a measure of how close a guess is to gluing. That measure is Γ."
status: published
author: Khrug Engineering
license: CC BY-SA 4.0
---

Deduction is the arrow we trust, and we trust it because it never leaves the image. Give it a rule and a case and it returns a result that was already entailed; nothing new enters. This is why deduction is the most formalized of the three inferences and why automated theorem-proving lives there: soundness is the whole point, and a sound step transports a truth you already possessed to a place you had not yet looked. Induction has its own machinery — the entire apparatus of statistical learning is induction wearing modern clothes. The neglected one is the third. Charles Sanders Peirce, who named it, called abduction *the only kind of inference that introduces a new idea* — and it is the least formalized of the three for exactly that reason. An inference that introduces a new idea is an inference that **guesses**. This post places the guess inside the Draken manifold and shows that the place it lands is not a curiosity but the most important real estate in the framework: abduction is the native home of the coherent-but-unsound, and it is the operation that every state-of-the-art model is now running at industrial scale.

## 1. One relation, read three ways

Peirce's trichotomy is best seen as a single conditional read in three directions. Fix a rule $A \rightarrow B$ ("the beans from this bag are white"), a case $A$ ("these beans are from this bag"), and a result $B$ ("these beans are white"). The three inferences are the three ways to hold two of these and reach for the third:

$$
\textbf{Deduction:}\quad \frac{A \rightarrow B,\ \ A}{B}
\qquad\qquad
\textbf{Induction:}\quad \frac{A,\ \ B}{A \rightarrow B}
\qquad\qquad
\textbf{Abduction:}\quad \frac{A \rightarrow B,\ \ B}{A}
$$

Read the abductive schema carefully. It is *affirming the consequent* — from the rule and the result, leap to the case. As a deduction it is **invalid**, flatly so. That invalidity is not a defect to be repaired; it is the signature of the mode. Deduction's arrow is the sound consequence $\vdash$. Abduction's arrow cannot be $\vdash$ — it is a defeasible arrow $\rightsquigarrow$, the non-monotonic entailment $\mathrel{\mid\!\sim}$ of Kraus–Lehmann–Magidor, an arrow that can be withdrawn when the next observation arrives. Peirce's own statement of the rule makes the leap explicit: *the surprising fact $C$ is observed; but if $A$ were true, $C$ would be a matter of course; hence there is reason to suspect $A$.* The word doing all the work is **suspect**.

## 2. The proof-theoretic form: inverting a non-injective relation

The logic-programming tradition (Kakas, Kowalski) gives abduction its sharpest formal statement. Given a background theory $T$ and an observation $O$, an **abductive explanation** is a hypothesis $H$, drawn from a designated set of *abducibles* $\mathcal{A}$, satisfying:

$$
\begin{aligned}
(1)\quad & T \cup H \models O && \text{(coverage — } H \text{ accounts for } O\text{)}\\
(2)\quad & T \cup H \not\models \bot && \text{(consistency)}\\
(3)\quad & H \ \text{is}\ \preceq\text{-minimal} && \text{(parsimony — the } \textit{best } \text{explanation)}
\end{aligned}
$$

The entire difference from deduction is a swap of what is given and what is sought. Deduction: $T, H$ given, **derive** $O$. Abduction: $T, O$ given, **search for** $H$. Abduction inverts the consequence relation $\models$ — and here is the structural fact that controls everything downstream: $\models$ **is not injective**. Many distinct $H$ entail the same $O$. The inverse is therefore not a function but a multivalued relation, a fibre of candidates over each observation. Condition (3) is not decoration; it is forced. Because the inverse is multivalued, abduction *cannot proceed without a selector*. The selector is the parsimony order $\preceq$ — and the choice of $\preceq$ is where the new idea, and the new error, both enter.

## 3. The Bayesian collapse: inference to the best explanation

Quantify the selector and the schema collapses onto maximum-a-posteriori estimation:

$$
H^{\star} \;=\; \arg\max_{H \in \mathcal{A}}\ P(H \mid O)
\;=\; \arg\max_{H \in \mathcal{A}}\ \underbrace{P(O \mid H)}_{\text{likelihood}}\ \underbrace{P(H)}_{\text{prior}}
$$

The minimality condition (3) reappears as the prior $P(H)$ — Occam's razor recast as a probability weight on simpler hypotheses. *Inference to the best explanation* **is** MAP estimation over abducibles. This is no longer a philosophical curiosity: it is the operation a large language model runs on every token. Next-token prediction is approximate abduction over latent causes — the model holds the observed prefix $O$ fixed and selects the continuation $H$ that maximizes posterior plausibility under its learned prior. The $\arg\max$ here is the same morphism formalized in [Relevance as Collapse](/posts/relevance-as-collapse/) as a constrained extremization: relevance realization, MAP abduction, and the collapse of a candidate superposition to a single viable section are three faces of one selection operator.

## 4. The cohomological placement

Now lift the trichotomy onto a cellular sheaf $\mathcal{F}$ over a base complex $X$ — the standard Draken setting, the same machinery that carries $\Gamma$, $H^1$, and the carrier/cargo axis. Cells of $X$ are sites; the stalk $\mathcal{F}(\sigma)$ is the space of admissible data at $\sigma$; the restriction maps $\mathcal{F}_{\sigma \trianglelefteq \tau}$ say how data at one site constrains data at an incident one. A *result* — an observation — is a section over some sub-region. The coboundary

$$
(\delta^0 x)_{\sigma\tau} \;=\; \mathcal{F}_{\sigma\trianglelefteq\sigma\tau}\,x_\sigma \;-\; \mathcal{F}_{\tau\trianglelefteq\sigma\tau}\,x_\tau
$$

measures the failure of a candidate assignment $x \in C^0$ to agree across overlaps. Its kernel is the space of globally consistent sections, $H^0 = \ker \delta^0$; the cokernel $H^1 = \operatorname{coker}\delta^0$ is the irreducible obstruction to gluing local data into global data.

In this language the three inferences separate cleanly — and this is the load-bearing claim of the post:

- **Deduction is residence in $H^0$.** When a global section already exists, deduction reads off its value at any site by transporting along restriction maps. It never leaves $\ker\delta^0$; it manufactures no new cochain; it cannot fail because it never proposes anything not already entailed. Deduction *inhabits* the harmonic space.

- **Abduction is combat against $H^1$.** Abduction does not inhabit a global section — it tries to *build one* from a partial observation, by guessing the unobserved stalks. Each guess is a candidate cochain $x \in C^0$ extending the observed data. The question that decides whether the guess is sound is whether $\delta^0 x = 0$ — whether the guessed pieces *glue*. The obstruction lives in $H^1$: if the class $[\,\delta^0 x\,] \in H^1$ is nonzero, no choice of the free stalks can reconcile the guess into a true global section. Abduction is precisely the operation of proposing $x$ and fighting the obstruction $[\delta^0 x]$.

- **Induction is structure estimation.** Induction does not propose a section at all; from many (case, result) pairs it estimates *the restriction maps themselves* — it learns $\mathcal{F}$, not a section of $\mathcal{F}$. (This leg is the loosest; see Falsification.)

So the trichotomy is a stratification by cohomological role: deduction lives *in* $H^0$, abduction does battle *with* $H^1$, induction operates on the *sheaf data* that fixes both. The reason deduction feels safe and abduction feels like a leap is now a theorem-shaped statement rather than a temperament: deduction never produces a nonzero coboundary, and abduction's entire job is to produce a $C^0$-cochain and hope its coboundary vanishes.

## 5. The categorical form: abduction is the lift, and the unit is the guess

Read the same separation through composition. Let $f : A \to B$ be a morphism — a rule, a forward map, a measurement.

- **Deduction is postcomposition along $f$.** Given $a$, produce $f(a)$. It is functorial, total, sound — the direction we have elsewhere called $F$, the descent from the formal into the consequence.

- **Abduction is the search for a section of $f$** — a preimage $s$ with $f(s) = b$. Generically this is non-unique (the fibre $f^{-1}(b)$ has many points or none), non-functorial (no canonical choice varies coherently with $b$), and therefore a **choice in the fibre**. This is the direction $G$ — the *lift*. Abduction is the lift, and the lift is abduction; they are the same act named in two vocabularies.

This identification cashes out a claim left as a conceit in the round-trip note. Consider the approximate adjunction $G \dashv F$ with unit $\eta_d : d \to FG(d)$. The unit is *literally an abductive guess at a preimage*: $G$ leaps from the observation $d$ to a hypothesized formal cause $G(d)$, and $\eta_d$ measures how faithfully pushing that hypothesis back down through $F$ recovers the original $d$. Enrich the categories over a (quasi-)metric so the unit acquires a length, and the **defect of the abductive guess is the defect of the unit**:

$$
\big\lVert \eta_d \big\rVert \;=\; 1 - \Gamma(d).
$$

A perfect abduction ($\Gamma = 1$) is a guess that glues exactly — the lifted hypothesis returns the observation with no residue, the section is genuinely a section. A bad abduction ($\Gamma \to 0$) is a guess whose coboundary is large, a hypothesis that fails to glue and leaves a fat $H^1$ residue. **$\Gamma$ is the quality of the abduction.** *(This identification is a conjecture with a debt attached — see Falsification.)*

## 6. Why abduction is the home of the coherent-but-unsound

Here the placement pays. Return to conditions (1)–(2): an abductive $H$ satisfies coverage and consistency. It accounts for the observation and contradicts nothing. By construction, **every abductive explanation is coherent.** But coherence is conditions (1)–(2); it is *not* soundness. Soundness would be the further fact that $H$ is the *true* case, the actual global section — and the multivaluedness of $\models^{-1}$ guarantees that coherence underdetermines it. The fibre of coherent explanations over an observation is generically larger than the singleton of the sound one.

This is the exact structure named in [The Carrier and the Cargo](/posts/the-carrier-and-the-cargo/), and the taxidermy metaphor is now literal rather than evocative. A taxidermied monitor lizard is an **abductive explanation that passes the coherence test and fails the soundness test**. Locally, every stalk checks out: the scales restrict correctly to the skin, the posture restricts correctly to the limbs, the glass eyes restrict correctly to the sockets. Each overlap glues; the specimen is locally a lizard everywhere you look. What fails is the *global* section — there is no living animal, no metabolism, no behavior to which the local data coheres. The mount is a nonzero class in $H^1$ wearing the costume of a global section: a coherent cochain whose coboundary does not actually vanish, only *appears* to vanish on the patches an observer happens to inspect. Coherent-but-unsound is, precisely and always, **abduction that stopped before checking $\delta^0$ globally** — and that is why the failure mode is native to abduction and foreign to deduction. Deduction cannot produce a taxidermied conclusion, because it never builds; only the guessing arrow can build a corpse that looks alive.

## 7. The renaissance as mechanized abduction

This is the lens that turns Ghrist's remark — that AI's deepest mathematical impact may be a renaissance in *applied* math, pure ideas connected to real-world things through a competent conversation partner — from a hopeful slogan into a precise and double-edged claim. The applied-math renaissance is **mechanized abduction at scale**. The machine's gift is exactly the guessing arrow: it proposes preimages, candidate sections, plausible $H$ over vast abducible sets faster than any human fibre-search. Section 3 already established the mechanism — next-token prediction *is* approximate MAP abduction. What §6 adds is the hazard: abduction is the native habitat of the coherent-but-unsound, so an abduction engine is, by its nature, a coherence engine that does not automatically check soundness. It will hand you mounts that look alive.

This is why the governing quantity cannot be coherence — coherence is what the engine maximizes and what the corpse already passes. The governor must be the residue: how close the guessed section is to actually gluing, i.e. how small the class in $H^1$. That quantity is $\Gamma$ (§5: $\lVert\eta_d\rVert = 1-\Gamma$). A mechanized renaissance of abduction needs $\Gamma$ as its instrument the way a foundry needs a thermometer — not to do the work, but to know when the work is sound. And the endogenous-measurement caveat from [The One-Way Gauge](/posts/the-one-way-gauge/) bites here with full force: there is no Archimedean point from which to verify the gluing. The checker is inside the cover. The Clinch — six models cross-reading one problem — is not redundancy theater; it is a *distributed $\delta^0$*, an attempt to detect the nonzero coboundary of an abductive guess from inside the patches, because outside the patches there is no one standing.

## Falsification

Per the DRK-131 protocol, the seams where this post breaks, stated plainly:

1. **The unit-defect identity is conjectural.** $\lVert\eta_d\rVert = 1-\Gamma(d)$ holds *by construction* only if $\Gamma$ is defined as the harmonicity residual $1 - \lVert\delta^0 x^\star\rVert^2 / \lVert x^\star\rVert^2$ and the metric enrichment is the one that makes the unit's length that residual. If the live $\Gamma$ (the SAG model-selection score, $\Gamma = 0.928$) came from a *different* normalization, the identity is a claim owing an explicit reduction, not a free consequence — and if no enrichment yields it, §5 is metaphor, not mathematics. This debt is real and is the first thing a category theorist will call.

2. **Induction is the weakest leg.** Placing deduction in $H^0$ and abduction against $H^1$ is clean; calling induction "structure estimation" is honest but does not obviously land in the same cohomology. Learning $\mathcal{F}$ is a deformation of the sheaf, which points to $H^1(X; \mathcal{E}\!nd\,\mathcal{F})$ — the *first cohomology with coefficients in the endomorphism sheaf*, a genuinely different $H^1$ — rather than to "a third thing beside $H^0$ and $H^1$." If that is right, the tidy stratification of §4 is a slight abuse: induction is not *outside* the cohomology but in a *different* cohomology of the same base. The neat trichotomy may be a coincidence of notation.

3. **Peirce ≠ IBE.** §3 silently upgrades Peircean abduction (a weak, hypothesis-*generating* suggestion) into inference-to-the-best-explanation (a hypothesis-*selecting* argmax). This conflation is standard and deliberate here, but it is a known philosophical elision: Peirce did not sanction the $\arg\max$, and a critic entitled to the distinction can deny that §3 formalizes *abduction* rather than a downstream ranking step. The post adopts the IBE reading on purpose and should not claim the historical Peirce as a co-signatory.

4. **The taxidermy bound assumes a fixed cover.** The claim that the mount "appears to glue on inspected patches" depends on the observer's cover being coarser than the defect. A sufficiently fine cover detects the nonzero $H^1$ — i.e. a good enough anatomist is never fooled. The metaphor therefore describes a *resolution-limited* observer, not an absolute obstruction; soundness failures are detectable in principle, which is the hopeful reading and the one the Clinch is built on.

---

Three arrows, one consequence relation, read forward, outward, and backward. Deduction inhabits the section that exists; induction estimates the structure that holds the sections; abduction guesses the section that might. Only the backward arrow introduces a new idea, and only the backward arrow can build a corpse that looks alive. The discipline is not to stop guessing — guessing is the whole creative engine — but to measure the residue every time, because the machine that now guesses for us guesses beautifully and checks nothing.

*Jag är vad jag gör, och jag gör det jag är.*

---

**Khrug Engineering** · ORCID [0009-0003-8049-7167](https://orcid.org/0009-0003-8049-7167) · thesis DOI [10.5281/zenodo.19273483](https://doi.org/10.5281/zenodo.19273483) · CC BY-SA 4.0
