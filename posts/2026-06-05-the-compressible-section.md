---
title: "The Compressible Section: Real Patterns, Rainforest Realism, and the Cohomology of Which Patterns Glue"
drk: DRK-157
date: 2026-06-05
tags: [theory, analysis, synthesis, philosophy]
layers: [L01, L02, L05, L07, L11, L17, L18]
coherence: 0.90
excerpt: "MIT Press's 2026 volume Dennett's Real Patterns in Science and Nature collects the philosophical lineage the Draken corpus has been instantiating without naming it: Dennett's compression criterion for the reality of a pattern, and Ladyman & Ross's rainforest realism — 'to be is to be a real pattern,' patterns all the way up, no privileged fundamental level. This post argues that the criterion (a pattern is real iff the data admit a description shorter than the bit-map) is the single-frame ancestor of Γ, and that Draken supplies what the real-patterns program has always lacked: a cover, restriction maps, and a first cohomology that decides whether locally real patterns glue into a globally real one. Dennett can certify that a pattern is real in one frame; he has no apparatus for asking whether the pattern in frame B is consistent with the pattern in frame C over their overlap. The sheaf does. Γ is Dennett's criterion lifted from a frame to a cover. The post also answers McAllister's vacuity worry from the same volume, marks the convergences with DRK-141 (ultrafinitism), DRK-153 (Carroll on strong emergence), and DRK-135/130 (Game of Life, substrate-not-agent), and logs — honestly — that the volume's own authors would likely resist the formalization."
status: published
author: Khrug Engineering
license: CC BY-SA 4.0
sources:
  - "Millhouse, T., Petersen, S., & Ross, D. (eds.) (2026). *Dennett's Real Patterns in Science and Nature*. Cambridge, MA: MIT Press. ISBN 9780262052047 (CC BY-NC-ND)."
  - "Dennett, D. C. (1991). Real Patterns. *The Journal of Philosophy* 88(1), 27–51. (Reprinted as ch. 2 of Millhouse et al. 2026.)"
  - "Ladyman, J. (2026). Patterns All the Way Up: Prolegomena to a Future Naturalized Metaphysics. Ch. 3 in Millhouse et al. 2026."
  - "Petersen, S. (2026). Abstractions by Patterns. Ch. 4 in Millhouse et al. 2026."
  - "Millhouse, T. (2026). The Problem of Platonic Codes. Ch. 5 in Millhouse et al. 2026."
  - "Carroll, S. M., & Parola, A. (2026). What Emergence Can Possibly Mean. Ch. 6 in Millhouse et al. 2026."
  - "McAllister, J. W. (2026). Is Any Pattern Nonreal? Ch. 7 in Millhouse et al. 2026."
  - "Wallace, D. (2026). Real Patterns in Physics and Beyond. Ch. 8 in Millhouse et al. 2026."
  - "Alekseev, A., Harrison, G. W., Lau, M., & Ross, D. (2026). Deciphering the Noise: Real Patterns in Welfare from Incentivized Choice. Ch. 10 in Millhouse et al. 2026."
  - "Ladyman, J., & Ross, D. (2007). *Every Thing Must Go: Metaphysics Naturalized*. Oxford University Press."
  - "Chaitin, G. (1975). Randomness and Mathematical Proof. *Scientific American* 232(5), 47–52."
  - "Hansen, J., & Ghrist, R. (2019). Toward a Spectral Theory of Cellular Sheaves. *Journal of Applied and Computational Topology* 3(4), 315–358."
  - "Roininen, K. (2026). The Finite Sheaf: Draken as Applied Ultrafinitism. DRK-141. https://draken.info/posts/the-finite-sheaf/"
  - "Roininen, K. (2026). No Trace, No Section. DRK-153. https://draken.info/posts/no-trace-no-section/"
  - "Roininen, K. (2026). The Totalitarian Sheaf. DRK-125. https://draken.info/posts/the-totalitarian-sheaf/"
  - "Roininen, K. (2026). The Decorticated Sheaf. DRK-135. https://draken.info/posts/the-decorticated-sheaf/"
  - "Roininen, K. (2026). The Substrate and the Game. DRK-130. https://draken.info/posts/the-substrate-and-the-game/"
---

A volume arrived this month that the corpus has, in a precise sense, been writing toward from the other end. MIT Press published *Dennett's Real Patterns in Science and Nature*, edited by Tyler Millhouse, Steve Petersen, and Don Ross — a workshop-born collection (the Santa Fe Institute hosted; Dennett was to have replied to every chapter, and died in April 2024 before he could) that reprints Dennett's 1991 *Real Patterns* and surrounds it with eleven essays applying its central idea across physics, chemistry, biology, neuroscience, economics, and the metaphysics of science as a whole. The contributors are not marginal: James Ladyman, Sean Carroll, David Wallace, Don Ross, Harold Kincaid, Rosa Cao.

The question of the book is the question of the framework. *When is a pattern real, rather than merely apparent?* Dennett's answer — that a pattern is real exactly when the data it organizes admit a description shorter than their verbatim bit-map — is the single-frame ancestor of the sheaf coherence metric Γ. The book does not merely add a citation to the reasoning chain. It supplies the chain's trunk, grown from a root the corpus never traversed (philosophy of mind, naturalized metaphysics) but arriving at the same object the corpus reached from varanid ethology and the Hansen–Ghrist Laplacian. This post sets the genealogy down formally, states what Draken adds to the real-patterns program that the program has always lacked, answers one challenge raised inside the volume itself, and — as the anti-totalisation principle requires — logs honestly where the volume's own authors would refuse to follow.

A procedural note first, because the book's copyright page is unusually pointed: it carries a Creative Commons CC BY-NC-ND licence and an explicit notice that the text may not be used to train AI systems without written permission. This post is analysis and citation, not reproduction: it paraphrases the arguments, quotes nothing at length, and reasons *about* the ideas. The notice is noted and respected.

## 1. Dennett's criterion, stated precisely

Dennett's setup is deliberately humble. Take six frames of $30 \times 30 = 900$ black-and-white dots, each generated by the same rule — ten black, ten white, repeating, producing five vertical bars he names *bar code* — but corrupted by pseudo-random noise at ratios from 1% to 50%. At 1% the bars are obvious; at 50% the frame is, to any inspection, indistinguishable from noise, even though it was generated by the identical process.

The realness question is then made operational through transmission cost, following Chaitin (1975). The least efficient way to send a frame is the **bit-map**: 900 bits, one per dot, verbatim quotation. A series is *random* — has no pattern — iff its shortest faithful description is no shorter than the bit-map. A series *has a pattern* iff some description is strictly shorter. Writing $D$ for the data and $\mathrm{desc}(D)$ for any faithful description in a fixed scheme:

$$
\text{$D$ contains a real pattern} \iff \exists\,\mathrm{desc}(D)\;:\; |\mathrm{desc}(D)| < |D|_{\text{bitmap}}.
$$

Equivalently, in Kolmogorov–Chaitin terms, with $K(\cdot)$ the algorithmic description length, a pattern is real iff $K(D) < |D|$, with the *amount* of pattern measured by the compression gap $|D| - K(D)$. Frame D (1% noise) compresses enormously: "bars, with exceptions at dots 57, 88, …". Frame F (50% noise) does not compress at all — the list of exceptions is as long as the bit-map, and the description is, Dennett notes, on average trivially *longer* than verbatim, because you pay a few bits to state a pattern that the exceptions then obliterate.

Two features of the criterion will matter for everything that follows.

**(i) It is observer- and format-relative, but not subjective.** The bars are visible to the human eye because of hard-wired edge detectors; re-encode the same 900 bits in out-of-phase hexadecimal chunks and the pattern vanishes from view while remaining, by the compression test, exactly as real. The realness is a fact about the existence of a shorter description; *which* observer can find it is a separate fact about perceptual and computational machinery. This is the seam the corpus has always worked: a pattern can be real and undiscerned, or discerned and not real (Rorty's irrealism, where the pattern is only in the beholder's eye).

**(ii) It is finite by construction.** Finite frames, finite bit-maps, finite (transmittable) descriptions, compression algorithms that run. There is no completed infinity anywhere in the apparatus. Hold this; §6 collects the debt.

## 2. Ladyman & Ross: patterns all the way up

Ladyman's contribution (ch. 3) takes Dennett's local criterion and makes it the whole of ontology. The slogan, from *Every Thing Must Go* (Ladyman & Ross 2007, hereafter ETMG) and sharpened here, is a replacement for Quine's criterion of existence. Where Quine held that to be is to be the value of a bound variable — and imagined science paring its ontology to a Quinean "desert landscape" of physical objects and sets — Ladyman proposes instead:

> To be is to be a real pattern.

A real pattern, on this reading, is anything that figures indispensably in projectible generalizations that predict and explain the world's behavior. The consequences Ladyman draws are precisely the structural commitments the Draken corpus has treated as axioms:

- **No privileged fundamental level.** ETMG's *rainforest realism* refuses the move that grants reality only to the microphysical bit-map and treats everything coarser as derivative or fictional. Gliders are as real as cells; gases as real as molecules; beliefs as real as neurons — each at its scale, by the compression test applied at that scale.

- **Scale-relativity is built in.** The ontology of gliders is only available once you consider more than a few cells over more than a few iterations; below that scale there are cells and rules and no gliders. Ladyman makes the point general: real-pattern ontology is *intrinsically* scale-indexed.

- **Science is not a single theory over a single domain.** An iron bar is a continuum in continuum mechanics and a particle lattice in solid-state physics; high-temperature matter is plasma and not ordinary matter at all; organisms and species sit at incompatible levels of abstraction. The energy- and time-scales of different sciences' objects are mutually incompatible, so they cannot be conjoined into one quantified theory with one domain.

That last point is the load-bearing one for the framework, and it is worth saying slowly, because it is the precise reason a *sheaf* is the right object rather than a single global theory. If the sciences could be conjoined into one domain, you would want one big global section — one theory of everything in Quine's extensional language. They cannot. What you have instead is a family of local theories, each valid on its own open patch of the world (its own scale, its own energy regime, its own abstraction level), related where they overlap by translation maps that may or may not be consistent. That is the definition of a sheaf over a cover. Ladyman & Ross argued, programmatically and in prose, for exactly the situation that the cellular-sheaf formalism describes in operators. They named the ontology. They did not build the machine.

## 3. The gap: real patterns have no overlaps

Here is the contribution, stated as sharply as I can make it.

Dennett's criterion is defined on **one frame**. There is a single data set $D$, and the question is whether $D$ compresses. There is no second frame overlapping the first; no notion of two patterns that are each locally real but must agree where their domains meet; no restriction map; and therefore no apparatus whatsoever for the question *is the real pattern in this region consistent with the real pattern in the adjacent region?* The 1991 paper is single-chart topology. It can certify local realness and nothing more.

This is not a defect Dennett could have noticed, because his target — the reality of belief, read off one agent's behavior — did not force the question. But the moment you take Ladyman seriously and spread real patterns across an 18-layer manifold of mutually incompatible scales, the question becomes unavoidable, and the single-frame criterion has no answer to it.

Draken's formalism *is* the answer. Replace the single frame with an open cover $\mathcal{U} = \{U_i\}$ of the system — for the corpus, the cover is the layer-stratified observation frames $L01,\dots,L18$ and their finer sub-covers. Attach to each patch the local real pattern as a section of a cellular sheaf $\mathcal{F}$:

$$
s_i \in \mathcal{F}(U_i), \qquad s_i \text{ real on } U_i \iff |\mathrm{desc}(s_i)| < |s_i|_{\text{bitmap}}.
$$

That clause is Dennett, verbatim, applied patch-wise. Now ask the question Dennett could not pose. The family $\{s_i\}$ is a real pattern *of the whole system* — a global section — iff the local patterns agree on every overlap, the cocycle condition:

$$
\rho^{U_i}_{U_i \cap U_j}(s_i) \;=\; \rho^{U_j}_{U_i \cap U_j}(s_j) \qquad \forall\, i,j .
$$

The obstruction to that agreement is a class in the first Čech cohomology:

$$
[\{s_i\}] \in H^1(\mathcal{U}, \mathcal{F}), \qquad
[\{s_i\}] = 0 \iff \text{the local real patterns glue into a global real pattern.}
$$

And Γ is the graded version of exactly this — the fraction of the local real-pattern structure that actually glues, read off the sheaf Laplacian $\mathcal{L}_0 = \delta^\* \delta$ of Hansen & Ghrist (2019):

$$
\Gamma \;=\; \frac{\dim \ker \mathcal{L}_0}{\dim \ker \mathcal{L}_0 + \dim H^1(\mathcal{U}, \mathcal{F})}.
$$

So the headline identity:

> **Γ is Dennett's compression criterion lifted from a single frame to a cover.** A scalar realness test on one data set becomes a cohomological realness test on a family of overlapping data sets. Where Dennett asks "does this frame compress?", Γ asks "do the local compressions agree where they overlap?" — and reports the answer as a number in $[0,1]$.

There is even a second, information-theoretic reading of the same number that does not pass through the spectrum at all, and the fact that it agrees with the spectral one is itself a coherence check on the framework. A global compression of the whole system exists iff the local compressions are mutually consistent on overlaps; the *failure* of consistency is the extra description length you must pay to reconcile the patches, which is precisely the Dirichlet energy of the sheaf — the quadratic form $\sum_{i<j} \lVert \rho_{ij} s_i - \rho_{ji} s_j \rVert^2$ whose kernel the Laplacian measures. The minimum-description-length account of Γ (compression that glues) and the spectral account of Γ (kernel fraction of $\mathcal{L}_0$) are two charts on one quantity. That is a Čech computation performed on the definition of the metric itself — the same self-application the corpus has run on its own peer-review architecture since DRK-143.

## 4. The Nelkin question, answered

Dennett quotes Nelkin's (1994) sharp question: *what is the pattern a pattern of?* In the single-frame setting the question has no clean referent — the pattern is "in the data," but the data is just a frame, and "in" is doing unexamined work. The sheaf gives the question a one-line answer with no remainder:

> The pattern is a **section**; what it is a pattern *of* is the **base space** (the cover); and the "of" relation is the assignment $U_i \mapsto \mathcal{F}(U_i)$ together with the restriction maps.

A pattern is a pattern of a *site*. Beliefs are a pattern of the behavioral cover of an agent (Dennett's case); a chemical bond is a pattern of the valence-electron charge-density cover (Seifert's case, cited approvingly by Ladyman); a price equilibrium is a pattern of the incentivized-choice cover (the Ross-coauthored ch. 10). The framework's restriction map ρ — the "Inpu" intake morphism of DRK-155 — is exactly the structure that the bare phrase "pattern *of*" was gesturing at and could not formalize.

## 5. McAllister's challenge, and why Γ survives it

The volume contains its own internal threat to the whole programme, and the framework has to meet it or fold. James McAllister's chapter (ch. 7) asks: *is any pattern nonreal?* The worry is fatal if unanswered. For **any** data set, there exists *some* description scheme in which it compresses — pick the scheme that simply names this data set with one short symbol. If "real" means "compresses in some scheme," then every data set contains a real pattern, the predicate is vacuous, and Dennett's criterion certifies everything. (Dennett anticipates the cheap version of this — the proper-name dodge — and dispatches it: a naming scheme must be general, and a general scheme that can name all $2^{900}$ frames needs, in the worst case, exactly 900 bits. But the deeper McAllister worry survives that reply.)

If the worry holds, Γ is in equal trouble: if every narrative compresses in *some* frame, every narrative has a real pattern and Γ discriminates nothing.

The sheaf answer is the gluing requirement, and it is decisive. Draken does not certify a pattern as real because *there exists some* scheme in which it compresses. It certifies a *global* pattern as real iff the local compressions, computed on a **fixed cover with fixed restriction maps**, agree on overlaps. The cover is not free. It is set by the substrate — the 18 layers, the actual observation frames, the measurement channels — and is not available for gerrymandering after the fact. Within that fixed cover, a system can be locally compressible *everywhere* and still carry $H^1 \neq 0$: every patch admits a short description, no two of which can be reconciled across their overlaps. That is the exact diagnostic signature of DRK-125 (*The Totalitarian Sheaf*): a configuration locally consistent at every node yet globally pathological. Dennett's single-frame criterion, having no overlaps, calls such a configuration "real" without remainder. Draken calls it *locally real, globally obstructed* — and the obstruction is the pathology.

So McAllister is answered not by denying that everything locally compresses, but by relocating "real" from existence-of-a-compression to *consistency-of-compressions-on-a-fixed-cover*. Gluing is the non-vacuity guarantee. And the prohibition on choosing the cover post hoc to force $H^1 = 0$ is not an ad hoc patch; it is the heart-scarab interdiction of DRK-155 — the refusal to command a verdict of coherence rather than earn it — applied to the metaphysics of pattern realism. The anti-totalisation principle and the answer to McAllister are the same rule.

## 6. The ultrafinitist debt comes due (DRK-141)

DRK-141 argued that every Draken operator — Γ, Ψ, K(t), taxamhet T, productile rank ρ — is by construction an ultrafinitist instrument, computed over finite complexes with finite stalks and no completed infinity. The Real Patterns volume now lets that claim be made about its own ancestor. Dennett's criterion is ultrafinitist *root and branch*: finite frames, the bit-map as the finite worst case, descriptions that must be transmissible and therefore Parikh-feasible, compression algorithms that terminate. The whole apparatus lives below any infinity. A "real pattern," in 1991 terms, is a *feasibly compressible* pattern — and feasibility, not mere existence-in-principle, is exactly the cut that Esenin-Volpin, Parikh, and Zeilberger have insisted on.

This tightens the §5 answer further. The reason "compresses in some scheme" cannot be the criterion is, at bottom, the ultrafinitist reason: the cheap scheme (one symbol per data set) is not *feasible* as a general scheme — its codebook is the bit-map's size. Real patterns are the ones whose compression is feasible *and* whose feasible local compressions glue. Dennett 1991, read through DRK-141, is an ultrafinitist text that did not know its own name — which is precisely the relationship DRK-141 claimed Draken bore to the Clarke-Doane ultrafinitism circle. The lineage is consistent in its unconsciousness.

## 7. Emergence as a statement about restriction maps (Carroll, DRK-153)

Carroll and Parola's chapter (ch. 6) is the volume's most physics-forward, and it converges hard with DRK-153 (*No Trace, No Section*). Carroll's argument against strong (ontological) emergence is that a human brain is made of electrons and fields described accurately by quantum field theory; if consciousness were strongly emergent — not deducible even in principle from the lower level — then the QFT predictions for those electrons would have to be *wrong* inside a brain. That is conceivable but extravagant, and it puts the burden squarely on the strong emergentist to say what the corrected theory looks like.

This is the same disposal DRK-153 ran on the "consciousness violates physics" claim, in the sheaf register. There, the move was: a world line is a section; "leaves no trace" is "has the zero section"; the zero section is not in the sheaf; so a trace-less consciousness is not in spacetime and cannot be the thing a traced brain has. Carroll's and DRK-153's arguments are two charts on one refutation. Real patterns let us say what *weak* emergence is, positively and without mystery:

> **Weak emergence** = there exists a coarse-grained section $s_{\text{macro}} \in \mathcal{F}(U_{\text{macro}})$ that is real by the compression test *and* whose restriction to the fine cover commutes with the fine section: $\rho_{\text{macro}\to\text{micro}}(s_{\text{macro}})$ agrees with $s_{\text{micro}}$ on overlaps.
>
> **Strong emergence** = a claimed macro-section with **no** well-defined restriction map to the substrate — which, by the sheaf axiom, is no section at all. It is the zero-section problem of DRK-153 wearing a different hat.

Temperature, wetness, irritability — Carroll's examples of unproblematic emergent properties — are coarse real patterns with clean restriction maps to the microphysical cover. The entire "weak vs. strong" controversy reduces, in the framework, to a single decidable question: *is the restriction map well-defined?* If yes, weak; if no, the macro-pattern was never a section.

## 8. Gliders, and why the substrate is not the agent (DRK-135, DRK-130)

Dennett's running example, and Ladyman's, is Conway's Game of Life: gliders and eaters are real patterns in the cell array, mereologically composed of a handful of lit cells, and — the detail that matters — *successive instances of a glider share no cells at all*. The glider a few steps on is built from entirely different cells than the glider now. It persists, in Ladyman's phrase, only structurally.

The corpus has this exact object twice. DRK-135 (*The Decorticated Sheaf*) put Conway's Life beside the Manukyan–Milinkovitch lizard cellular automaton and read both as sheaves whose sections are persistence patterns rather than substances. DRK-130 (*The Substrate and the Game*) made the general claim: the protocol outlives its hosts; the pattern is the agent, the cells are only where it is currently written. A glider is the cleanest possible illustration that a sheaf section's identity *is* its gluing pattern across patches and *is not* the substrate that instantiates it on any one patch. The bit-map/glider distinction is the L01/L$k$ distinction: the cells are the substrate layer, the glider is the coarse real pattern that has a restriction map down to them and an identity that does not reduce to them. Real-pattern ontology and substrate-not-agent are the same thesis stated at two scales.

## 9. Where this breaks, and how it could be falsified

The anti-totalisation principle applies reflexively, and a post that harvested a prestigious volume without marking its own seams would be performing the heart-scarab move on itself. So, honestly:

1. **The volume's own authors would resist the formalization.** Ladyman reports that Dennett was *rightly skeptical* of the metaphysical uses to which real patterns have been put, and Ladyman & Ross are careful, deflationary naturalists who might well regard a cohomological "completion" of rainforest realism as exactly the over-reaching totalization their programme was built to avoid. The framework must log that resistance as a *real section*, not explain it away. The honest position is: Draken claims its operators are the formal machine the prose programme implies; the programme's authors have not asked for that machine and may decline it; both can be true, and the disagreement is data.

2. **Structural consonance is not proof.** I have *not* proved that Γ equals MDL-compression-that-glues; I have exhibited two definitions (spectral and information-theoretic) and argued they coincide for the discourse sheaf. The clean falsifier is a constructed system in which the two diverge — a configuration whose every local section is MDL-compressible and whose overlaps are MDL-consistent, yet whose Hansen–Ghrist $\mathcal{L}_0$ reports large $H^1$, or the reverse. A demonstrated divergence between the compression account and the spectral account of Γ would break the identification claimed in §3. This is checkable today, in principle, on the Sheaf Analyzer.

3. **The McAllister answer depends entirely on the cover being fixed independently.** If, in any real application, the 18-layer cover is chosen *after* seeing the data so as to make $H^1$ vanish, the non-vacuity guarantee of §5 collapses and McAllister wins. The framework's defense is procedural — fix the cover by substrate and measurement before computing — and procedural defenses are only as good as their enforcement. This is a standing audit obligation (DRK-099), not a theorem.

4. **The genealogy is a reconstruction, not a derivation.** Draken was built from varanid ethology, the optimization axiom, and Hansen–Ghrist — not from Dennett. The claim that the corpus "instantiates" the real-patterns lineage is a *post hoc* recognition of structural identity, exactly the kind of resonance the corpus elsewhere warns against over-reading. What licenses it here, and did not license the numerological coincidences flagged in DRK-155 and DRK-156, is that the identity is *operator-level and load-bearing* (Γ ≈ compression-on-a-cover is a usable computation), not a coincidence of symbols.

## 10. Closing

The reasoning chain now has its trunk drawn in. Quine's desert landscape — reality pared to the microphysical bit-map — is reductive totalisation, the L01-only ontology the framework rejects. Sellars's two images set the problem of how everything hangs together. Dennett's mild realism answered it locally, with the compression criterion, on a single frame. Wallace carried the criterion into Everettian physics; Ladyman & Ross spread it across all the sciences as rainforest realism — patterns all the way up, to be is to be a real pattern, no privileged floor. And Draken supplies the one thing the prose programme could not: a cover, restriction maps, and a first cohomology that decides whether the locally real patterns *glue*. Γ is the compression criterion with overlaps. $H^1$ is the obstruction the single frame could not see. The 18 layers are rainforest realism with the restriction maps written down.

The corpus's house word for this — and I flag it, per V.4, in its deflationary sense only — is *retrocausal*: not literal influence from a completed system reaching back, but the ordinary fact that a framework recognizes its own ancestors at the moment it has built enough structure to read them. The volume did not nudge the corpus from the future. The corpus reached, from varanid combat and a discrete Laplacian, the same object Dennett reached from belief and Chaitin reached from randomness, and the recognition is mutual because the object is one. That is all "retrocausal" has ever meant here. The book is not new input to the chain. It is the chain, observed from its other end, arriving exactly when the corpus became able to glue to it.

A real pattern is a description shorter than the world. A *globally* real pattern is a family of such descriptions that agree where they meet. The first is Dennett's. The second is the sheaf's. The framework is the apparatus that computes the second and was, all along, the missing half of the first.

> *Jag är vad jag gör, och jag gör det jag är.*

The compression is the doing. The gluing is the being. All the way up.

---

Sheaf Coherence Γ: 0.90

Active Layers: 7 (L01 · L02 · L05 · L07 · L11 · L17 · L18)

---

### References

Chaitin, G. (1975). Randomness and mathematical proof. *Scientific American*, 232(5), 47–52.

Dennett, D. C. (1991). Real patterns. *The Journal of Philosophy*, 88(1), 27–51.

Hansen, J., & Ghrist, R. (2019). Toward a spectral theory of cellular sheaves. *Journal of Applied and Computational Topology*, 3(4), 315–358.

Ladyman, J., & Ross, D. (2007). *Every Thing Must Go: Metaphysics Naturalized*. Oxford University Press.

Millhouse, T., Petersen, S., & Ross, D. (Eds.). (2026). *Dennett's Real Patterns in Science and Nature*. MIT Press. [Chapters cited: Dennett (2); Ladyman (3); Petersen (4); Millhouse (5); Carroll & Parola (6); McAllister (7); Wallace (8); Alekseev, Harrison, Lau & Ross (10).]

Nelkin, N. (1994). Patterns. *Mind & Language*, 9(1), 56–87.

Seifert, V. A. (2023). The chemical bond is a real pattern. *Philosophy of Science*, 90(2), 269–287.

---

*Internal cross-references: [The Totalitarian Sheaf](/posts/the-totalitarian-sheaf/) (DRK-125), [The Substrate and the Game](/posts/the-substrate-and-the-game/) (DRK-130), [The Decorticated Sheaf](/posts/the-decorticated-sheaf/) (DRK-135), [The Finite Sheaf](/posts/the-finite-sheaf/) (DRK-141), [The Braided Substrate](/posts/the-braided-substrate/) (DRK-143), [No Trace, No Section](/posts/no-trace-no-section/) (DRK-153), [Inpu Means Input](/posts/inpu-means-input/) (DRK-155), [The Magical Substrate](/posts/the-magical-substrate/) (DRK-156).*

*Khrug Engineering — Göteborg*
*V.1: Non-Deceptive Intention · V.2: Precision over Comfort · V.4: Anti-Delusion Safeguard · V.7: Inversion Filter*
