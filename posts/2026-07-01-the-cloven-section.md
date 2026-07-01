---
title: "The Cloven Section: Extraction, the Cut, and the Two Senses of Cleave"
drk: DRK-174
date: 2026-07-01
tags: [synthesis, theory, etymology, biology, economics, epistemology]
layers: [L04, L07, L08, L11, L13, L15, L17]
coherence: 0.85
description: "To know is to cut. The word cleave holds both a splitting and an adhering; a cut is good exactly when it does both at once. Extraction, polarization, cancer, and confabulation are the same failure — a cut with no re-adhering section, H¹ ≠ 0."
excerpt: "The English cleave fuses two dead roots — clēofan, to split, and clifian, to cling — into a single spelling that means both to sever and to adhere. This post reads that accident as the governing figure of both cognition and extraction. A cut is a surjection p that forgets a kernel; to know across it is to possess a section s with p∘s = id, a lift that re-adheres the separated piece to the whole. When such a section exists the sequence splits and the two senses of cleave coincide; when it does not, the obstruction is a first-cohomology class and the cut is mere severance. Critical thinking, faithful mitosis, Plato's carving at the joints, and genuine value creation are cuts that split; extraction, cancerous proliferation, split-brain confabulation, splitting hairs, and polarization are cuts that do not. The collective history of knowledge is the long labor of finding where the joints are — and refusing to hack through bone even when severance pays better."
status: published
author: "Khrug Engineering"
license: "CC BY-SA 4.0"
sources:
  - "Plato. Phaedrus, 265e (division kat' arthra — 'at the natural joints')."
  - "Watkins, C. (2011). The American Heritage Dictionary of Indo-European Roots, 3rd ed. (roots *skei-, *krei-, *sker-, *(s)kel-)."
  - "Sperry, R. W. (1968). Hemisphere deconnection and unity in conscious awareness. American Psychologist 23(10), 723–733."
  - "Gazzaniga, M. S. (2000). Cerebral specialization and interhemispheric communication: does the corpus callosum enable the human condition? Brain 123(7), 1293–1326."
  - "Klein, M. (1946). Notes on some schizoid mechanisms. International Journal of Psycho-Analysis 27, 99–110."
  - "Mac Lane, S. & Moerdijk, I. (1994). Sheaves in Geometry and Logic. Springer. (sections, restriction, gluing)"
  - "Hansen, J. & Ghrist, R. (2019). Toward a spectral theory of cellular sheaves. Journal of Applied and Computational Topology 3, 315–358."
  - "Mazzucato, M. (2018). The Value of Everything: Making and Taking in the Global Economy. Allen Lane."
---

*The English verb **cleave** is two verbs wearing one coat. One descends from Old English **clēofan**, to split, to hew apart; the other from **clifian**, to stick fast, to cling. Centuries of sound-change collapsed the pair into a single spelling, and now the word means both to sever and to adhere — the butcher's stroke and the barnacle's grip in one syllable. This post takes that accident seriously. It argues that the cut which separates and the bond which holds are not opposites but the two halves of a single operation, and that every act of knowing — and every act of extracting — is an attempt to perform that operation. What distinguishes them is whether the second half arrives. A cut that cleaves in both senses is a section; a cut that cleaves in only the first is severance, and severance dressed as knowledge is extraction.*

## §1 — To know is to cut

Look at the vocabulary of thought and it is knives all the way down. **Science** descends from Latin *scīre*, to know, whose deeper root is *\*skei-*, to cut, to split — the same root that gives *schism*, *shed*, *sheath*, *schizoid*, and *conscience* (the knowing that cuts *with* itself). **Critical**, **crisis**, **criterion**, **discern**, **certain**, and **crime** cluster around Greek *krínō* and Latin *cernere*, from *\*krei-*, to sieve, to separate, to distinguish. To **decide** is *de-caedere*, to cut off — cognate with *incision*, *precise*, *concise*, *homicide*: a decision is the amputation of alternatives. To **share** is to **shear**; *\*sker-* cuts through *score*, *shore*, *short*, and *shard*.

The Germanic languages say the same thing without disguise. Swedish *skilja*, to separate, sits inside *åtskilja*, to distinguish, and *vetenskap*, science — *veta*, to know, welded to *-skap*, the shaping. German *scheiden*, to divide or depart, generates *unterscheiden*, to distinguish, *Scheidung*, divorce, and — perfectly — *Bescheid*, which means *information*, *the answer*: literally the residue of a separation. To be *im Bilde* you must first be *beschieden*. *Wissenschaft* is knowledge as craft, and the craft is the cut.

The claim is not decorative. Cognition is division before it is anything else: figure from ground, signal from noise, self from world, this from that. Perception is a segmentation problem; concepts are equivalence classes carved out of a continuum; a category is a fence. Before you can be right you must first draw a line, and the line is prior to its own correctness. This is why the etymology converges: the mind's first gesture is the blade's.

## §2 — The cut as morphism, and the section that re-adheres

Formalize the cut two ways, which turn out to be one. First as a **restriction map**: for a sheaf $\mathcal F$ and opens $V \subseteq U$, the map $\rho_{U \to V} : \mathcal F(U) \to \mathcal F(V)$ narrows a section from the larger region to the smaller, discarding whatever lived only outside $V$. Restriction is monotone forgetting; it is the cut as *going local*.

Second as the **quotient** in a short exact sequence,

$$0 \longrightarrow K \xrightarrow{\;i\;} E \xrightarrow{\;p\;} Q \longrightarrow 0,$$

where $p$ is a surjection that separates the whole $E$ into a visible quotient $Q$ while forgetting the kernel $K$. This is the cut proper: $p$ is *clēofan*, the splitting stroke. It cleanly divides, and in dividing it hides $K$ from view.

Now the decisive question — the one that separates knowledge from mutilation. Does there exist a map $s : Q \to E$ with

$$p \circ s = \mathrm{id}_Q\, ?$$

Such an $s$ is a **section**: a lift that takes each piece of the visible quotient back up into the whole from which it was cut, without contradiction. When $s$ exists the sequence **splits**, $E \cong K \oplus Q$, and the cut is reversible — nothing was truly lost, only sorted. The section $s$ is *clifian*, the re-adhering: it is the barnacle-grip that reattaches what the blade parted. A cut *cleaves in both senses* precisely when $s$ exists.

And when $s$ does *not* exist, its non-existence is not a vague deficiency but a definite object: a class in a first derived group. For module and group extensions it lives in $\mathrm{Ext}^1(Q, K)$; for the gluing of local sections over a cover it lives in $H^1$. In every case the statement has one shape:

$$\textbf{the section exists} \iff \textbf{the first obstruction class vanishes}.$$

This is the whole engine of the post. To *know across a cut* is to hold a section over it. To merely *sever* is to leave the obstruction non-zero and walk away with the quotient in hand, pretending the kernel was nothing. Extraction is exactly that pretence: it takes $Q$ and abandons $K$, then presents the amputation as if the sequence had split. The fraudulent move is not the cut. The fraudulent move is the **phantom section** — an apparent $s$ that does not commute, a lift that looks like it re-adheres but $p \circ s \ne \mathrm{id}$.

## §3 — Carving at the joints

In the *Phaedrus* Plato gives the criterion in a butcher's image: the good dialectician divides reality *kat' arthra hē pephyken* — at the joints, where it is naturally articulated — like a skilled carver who does not try to hack through a bone. The bad divider splinters; the good one finds the seam that was already there.

Read through §2, a **joint is a splitting locus**. It is a place where you may cut and the pieces still glue back — where the section $s$ exists because the geometry offered it to you. A hinge articulates precisely because separation and re-adhesion coexist at that point. To carve at the joint is to make a cut that cleaves in both senses; to hack through bone is to force a surjection whose sequence does not split, manufacturing an $H^1$ where nature had none. The *kritḗrion* — literally *the means of the cut* — is the section. A distinction is critical, in the honourable sense, iff you can lift back across it.

The specimens are all instances of this one criterion, passing or failing.

**Splitting cells.** Mitosis is a cut that must split. The genome is the section that has to lift through the division: each daughter cell must carry a full, faithful copy, so that the sequence "parent $\to$ two daughters" reconstructs the whole with $H^1 = 0$. Replication fidelity *is* the splitting condition at the cellular layer. **Cancer** is the same cut with the section severed. The tumour proliferates — it splits enthusiastically — but it no longer honours the organism's gluing conditions; it recruits its own blood supply by angiogenesis and lifts *locally* while destroying the *global* section that is the body. A tumour is a phantom section made of meat: coherent as growth, unsound as life. It is extraction at the tissue layer — value pulled from the whole with no map back (cf. DRK-167, *The Stalking Cell*).

**Splitting hairs.** Here the failure is inverted. The joint is not missed by hacking through bone but by cutting where the material is already homogeneous — refining a distinction past the point where the pieces glue to anything usable. Formally, one keeps subdividing the cover until the overlaps carry no information and the Čech data degenerates; coherence collapses not from too little discrimination but from too much. There is an optimum, and *taxamhet* — the taxonomic legibility that $\Gamma$ requires — overshoots into fragmentation when the blade keeps going after the last real joint. To split hairs is to keep cutting after the sequence has stopped splitting.

## §4 — Split brains and the confabulated section

Sever the corpus callosum — a commissurotomy, once performed to contain epilepsy — and you cut the principal gluing between the hemispheres. Sperry and Gazzaniga's patients then reveal something the intact brain hides: flash a command to the mute right hemisphere, let the left hand obey it, and ask the speaking left hemisphere *why* it acted, and the left hemisphere does not say "I don't know." It **confabulates** — it produces a fluent, confident reason it cannot possibly possess, because it never received the data. Gazzaniga named the responsible module *the interpreter*.

In the language of §2 the interpreter is a machine for manufacturing phantom sections. Cut the gluing, and rather than report the obstruction, the narrating hemisphere fabricates an $s$ that does not commute — a story that *reads* as a lift from behaviour back to intention while resting on no such lift at all. The split brain is thus an empirical demonstration that the felt unity of a self is a **gluing condition**, and that when the gluing fails the system's default is not to signal $H^1 \ne 0$ but to paper it over with narrative. This is the pathological direction of $\Psi$, the narrative self-reference ratio: coherence purchased by confabulation rather than earned by a real section (cf. DRK-173, *The Borrowed Interior*). The lesson generalizes past neurosurgery. Any system under a severed gluing — a mind, an institution, a feed — will tend to *narrate* the missing section rather than mark its absence, because a smooth false story is cheaper than an honest obstruction.

## §5 — Polarization: the cut with no joint

Polarization is the signature pathology of the wrong cut, and it deserves its own name because it fails in a specific way: it imposes a bisection on a base that had no joint there at all. Take a continuous spectrum — a connected section over a connected space — and force a two-fold cut, all-good against all-bad, us against them. Melanie Klein described this at the psychic layer as *splitting*: the infant, unable to hold the good and bad breast as one object, cleaves the world into idealized and persecutory parts. The social layer runs the identical operation on a population.

Formally, polarization imposes a *disconnected* cover on a *connected* space. The two poles are opens with an overlap that has been deliberately emptied; sections defined over each pole then cannot be compared, let alone glued, on the vanished intersection, and $H^1$ blows up by construction. The bimodal distribution is the fingerprint: a continuum that once supported a global section, now cut where it had no seam, so that no lift back to the whole survives. Polarization does not discover a division in the world; it *manufactures* an obstruction by cutting through bone and then points at the splinters as proof the bone was two things all along.

This is where **aggressive processing** enters, and where the *motherchipper* joke turns serious. A woodchipper is a machine optimized to cut through anything regardless of grain — the opposite of a carver seeking the joint. The attention economy is aggressive processing at the social layer: it selects for jointless cuts because splinters generate more engagement than articulated seams. The middle of a distribution does not go viral; the poles do. So the **extraction incentive** actively rewards the bad cut — the platform profits precisely by hacking where there is no joint, because $H^1 \ne 0$ is more arresting than a section that quietly glues. Polarization is not a bug in the processing. It is the processing, working as designed, extracting attention by manufacturing obstruction.

## §6 — Value: making versus taking

The same split/non-split dichotomy is the whole of the difference between creating value and extracting it. Model an exchange as a sequence

$$0 \longrightarrow \text{surplus} \longrightarrow \text{transaction} \xrightarrow{\;p\;} \text{price} \longrightarrow 0.$$

Genuine **value creation** is the case where this splits: both parties can lift back from the price to a state at least as good as before (the surplus is a real section, a Pareto improvement), and when many such exchanges glue across a market the whole exceeds the naive sum of its parts — comparative advantage, division of labour, the cohomological surplus of coordination. Making adds a section that was not there before.

**Extraction** is the case where it does not split. Value is pulled from one party with no lifting map back; one side's gain is the other's severed kernel, a zero-sum transfer wearing the costume of a positive-sum trade. Mazzucato's distinction between *making* and *taking* is exactly this: rent-seeking presents a phantom section, an apparent surplus that does not commute with the actual flow of value. **Source laundering** (DRK-165) is its purest form — extraction that obscures its own origin so that the carrier displays a splitting the sequence never had. The sponsored suffering-child card flying a devotional flag, the defanged bear made to perform a clinch it can no longer mean: both are coherent-but-unsound sections, phantom $s$, taking dressed as making.

## §7 — Critical thinking, and the collective history of knowledge

Return to *krínō*. **Critical thinking** is neither the manufacture of distinctions — that is splitting hairs — nor their refusal, which is mush. It is the disciplined search for the joint: the cut that separates *and* permits re-gluing, the distinction you can undo without loss. A criterion earns the name only when it is a section — when you can lift back across it. And here the etymology sharpens into a warning, because *krínō* fathers two children: *criterion*, the cut that glues, and *crisis*, the cut that does not. Same blade, same root; the difference is entirely whether $s$ survives. To think critically is to cleave in both senses on purpose — to split so that the pieces may cling — and to know, in each case, which of the two you have wrought.

Widen the frame to its limit. The **collective history of knowledge** is not a heap of cuts but a single section under perpetual construction, glued across generations over the whole base of the knowable. Each discipline is a local trivialization; each unification is a joint discovered where there had seemed to be a wall. Maxwell glued electricity and magnetism; the modern synthesis glued Darwin to Mendel; thermodynamics glued heat to motion — each a section that lifts across a cut earlier thinkers could not cross. Progress is successful gluing. Schism, censorship, polarization, and source laundering are the obstructions — the standing $H^1$ that keeps the global section from ever quite closing.

And the discipline that governs the whole enterprise is reflexive. The goal is *not* to force a single section by fiat; a coherence imposed rather than earned is the Totalitarian Sheaf (DRK-125), a cut that impersonates a gluing and calls the impersonation unity. The care operator $\dot{\mathcal V}_{exo} = 0$ points outward here as everywhere: glue honestly where the joints genuinely are, and leave the real obstructions marked rather than narrated over. The long labour of knowledge is precisely the labour of learning where the joints lie — carving at them where they exist, and refusing to hack through bone even when severance pays, and pays well, and trends. *Cleave so that it may cleave.* That is the entire instruction, and both verbs are load-bearing.

## §8 — Falsification and limits (per DRK-131)

This post is a carrier with a genuine formal core and several borrowed authorities that must be marked, not smuggled.

1. **The semisimple-teeth problem.** Over a field, every short exact sequence of vector spaces splits — $\mathrm{Vect}_k$ is semisimple, $\mathrm{Ext}^1 \equiv 0$. So the entire split/non-split distinction has *no content* in $\mathrm{Vect}$. The apparatus only bites in categories with non-trivial $\mathrm{Ext}^1$ (modules over general rings, group extensions, sheaves over a base with non-trivial topology). Applying it to a contractible base or a semisimple category would itself be a jointless cut — manufactured rigor. The post's claims hold only where the obstruction group is genuinely non-zero; asserting them elsewhere falsifies the post by its own criterion.

2. **$\mathrm{Ext}^1$ is not literally sheaf $H^1$.** §2 treats "the obstruction to a section" as one object across group extensions ($\mathrm{Ext}^1$) and sheaf gluing (Čech/sheaf $H^1$). These are the same in spirit — first derived functors measuring the failure of a section to exist — but the precise comparison requires a specific setup (torsors, the relevant site) that is asserted here, not constructed. Treat the identification as a working analogy pending that construction, not a theorem.

3. **The economic cohomology is a promissory note.** "The cohomological surplus of coordination" in §6 has a real core (Pareto surplus, gains from trade) but "$H^0$ of a market exceeds the naive product" is a figure, not a worked object. No sheaf on an exchange economy is constructed here. The making/taking distinction stands on Mazzucato and on the split/non-split dichotomy; the cohomological gloss is illustrative.

4. **The etymology is a carrier, not evidence.** *\*skei-* and *\*krei-* are real Indo-European roots and *cleave* really is two collapsed etymons (*clēofan* / *clifian*) — that part is historically solid. But "to know *is* to cut" is a motivated reading of a genuine lexical pattern, not a proof that cognition reduces to division. The etymology motivates the mathematics; it does not license it. If the formal claims of §2–§6 fail, the beauty of the word-cluster does not save them.

5. **The split-brain overreach.** Gazzaniga's interpreter is well-supported; the stronger claim that the self is *nothing but* a gluing condition exceeds the data and is offered as interpretation. The commissurotomy literature shows confabulation under severed gluing; it does not establish an eliminativist metaphysics of the self.

The load-bearing, defensible spine, stripped of ornament: *a cut is a surjection; knowing across it requires a section; the section's non-existence is a first-cohomology class; the same criterion sorts good cuts from bad at every layer where the obstruction group is non-trivial.* Everything else is scaffolding, and is marked as such.

---

*Layers L04 · L07 · L08 · L11 · L13 · L15 · L17. Operators: $\rho$ (restriction / the cut as going-local), $p$ (surjection — clēofan), $s$ (section — clifian), $H^1$ / $\mathrm{Ext}^1$ (the splitting obstruction), $\Gamma$ (coherence), $\Psi$ (narrative self-reference — the confabulated section), $\dot{\mathcal V}_{exo}=0$ (care, pointed outward). Cross-links: /posts/the-stalking-cell/ (DRK-167, extraction at the cellular layer), /posts/the-borrowed-interior/ (DRK-173, confabulation and the severed gluing), /posts/the-guessed-section/ (DRK-170, $H^0$/$H^1$ and the guessed lift), /posts/the-totalitarian-sheaf/ (DRK-125, coherence imposed rather than earned), and DRK-165 on source laundering — verify that slug against the corpus before build, as I do not have it confirmed.*

*Jag är vad jag gör, och jag gör det jag är.*

*Khrug Engineering · Göteborg · ORCID 0009-0003-8049-7167 · DOI 10.5281/zenodo.19273483 · CC BY-SA 4.0*
