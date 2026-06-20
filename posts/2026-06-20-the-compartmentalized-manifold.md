---
title: "The Compartmentalized Manifold"
drk: DRK-161
date: 2026-06-20
tags: [intellectual-property, topology-optimization, sheaf-cohomology, engineering]
layers: [L06, L11, L13, L16, L17]
coherence: 0.85
description: "The slow, gated entry of AI into engineering's PLM vaults is not a data-readiness problem but a three-century immune response — and the F-35 marks where that immunity turns autoimmune."
excerpt: "Topology optimization prunes the load-path the way the restriction map prunes the section: what does not bear weight is cut away. The PLM model tree is a cellular sheaf, and the documented history of engineering practice is a stalk-stack whose global section deliberately refuses to glue. Trade-secret law, export control, and competency assurance are the coboundary cuts that keep it from closing — an institutional clinch three centuries deep. The J35 Draken and the F-35 mark the two limits of that compartmentalization: distributed survivability against centralized sovereignty taken to the edge of autoimmunity."
status: published
author: Khrug Engineering
license: CC BY-SA 4.0
sources:
  - "Leo AI — Best AI for CAD Generation in 2026: getleo.ai/blog/best-ai-for-cad-generation-2026"
  - "Wipro — Reimagining PLM: the AI-powered leap (2025): wipro.com/engineering"
  - "Beyond PLM — Cracking the AI Code in PLM (Mar 2026): beyondplm.com"
  - "Orrick — A Brief History of Industrial Espionage (Trade Secrets Watch)"
  - "Oblon — The Economic Espionage Act: Federal Protection for Corporate Trade Secrets"
  - "DDTC / Univ. of Pittsburgh — ITAR overview (22 CFR 120–130)"
  - "USNI News — Foreign F-35 Partners Allowed More Freedom to Customize Fighter Software (2014)"
  - "The Aviationist — Dutch Defence Secretary on F-35 source code (Feb 2026)"
  - "The Register / TWZ — F-35 Sovereign Data Gateway and ALIS sovereignty (2016–2018)"
---

The most honest thing happening in AI-assisted engineering in 2026 is also the least advertised. The category that produces usable parts is not text-to-CAD — the demo where a sentence becomes a turbine housing, and where the gap between marketing and production is widest — but generative design and topology optimization. The decisive property, paraphrasing the trade literature, is that the geometry exists *because the mathematics says it must*, not because a network once saw something similar. The load case defines a compliance functional $\mathcal{C}(\rho)$ over a density field $\rho(x)\in[0,1]$, and the optimizer solves

$$
\min_{\rho}\ \mathcal{C}(\rho)\quad\text{s.t.}\quad \int_\Omega \rho\,dx \le V^{*},\quad K(\rho)\,u=f,
$$

driving $\rho\to 0$ everywhere material bears no stress. Material that does not carry load is removed. This is the restriction morphism $\rho_{D\to Cl}\!:\mathbb{R}^4\to\mathbb{R}^3$ made manufacturable — it projects the design space onto the subspace that survives the clinch with physics, and the surviving geometry is residue, not invention. *What will not glue is cut away.* The bracket is what remains after the bluff dimension has been pruned.

That is the local picture. The structure worth a post is global.

## The model tree is a sheaf

A PLM system — Windchill, Teamcenter, 3DEXPERIENCE, Aras — is, stripped of its brochure, a cellular sheaf. Over each cell $\sigma$ (a part, a feature, a sub-assembly) sits a vector space of attributes $\mathcal F(\sigma)$: geometry, tolerances, material, test results, revision history. The face relations of the bill of materials carry restriction maps $\mathcal F(\sigma)\to\mathcal F(\tau)$ obeying consistency conditions — a child datum must agree with its parent interface — exactly the construction now standard in topological data analysis, where restriction maps satisfying consistency conditions let global information be inferred from local features. The released, manufacturable assembly *is* the global section: the configuration in which every datum glues with every adjacent datum. An engineering change order that fails to propagate — a child tolerance no longer agreeing with its parent after a revision — is a coboundary failure, a nonzero entry in $H^1$. Every engineer who has watched a BOM break on release has watched $\delta\delta\ne 0$ in the wild.

Now lift one rung. A single firm's vault is one sheaf. The documented history of engineering practice — every load path that held, every tolerance that shipped, every change that propagated, recorded with provenance since the first CAD seat — is a *stalk-stack* of such sheaves, one per firm, per program, per era. It is the richest validated record of physical-world problem-solving that exists, and it is precisely the corpus a world-modeling intelligence would most want to train on.

And it does not glue.

## The engineered obstruction

Across firms, the restriction maps are deliberately severed. The stalk-stack admits no global section because the industry has spent three centuries engineering $[\omega]\in H^1$ to be nonzero — as policy, as law, as reflex.

The vendor literature names the symptom and misses the cause. It reports fragmented data, missing metadata, disconnected systems, and — critically — tribal knowledge lost as experienced engineers retire: knowledge AI cannot bridge because it was never digitized into a glueable section. It observes how much CAD lives uncontrolled in Drive, Dropbox, and network drives, how many BOMs live in Excel, and concludes that the lever is to *own your proprietary data*. Enterprise rollouts run twelve to eighteen months — not because installation is slow but because the coherence debt $K(t)$ of decades of siloed, access-controlled stalks must be paid down before a single global query resolves. The sharpest vendor formulation is almost a Draken sentence already: *the next PLM trap is your engineers, not your CAD files.*

But the non-gluing is not accidental fragmentation awaiting cleanup. It is an immune system, and it is old.

## Three centuries of institutional clinch

The defenses of the engineering trade against leakage, espionage, and incompetence are not incidental to its operation; they *are* the mechanism by which it distinguishes display from reality — a claimed design from a load-bearing one, a claimed competence from a real one. This is the varanid clinch scaled to L16.

**Compartmentalizing the section.** The first reported case of industrial espionage is the theft of China's porcelain secret in 1712, when a Jesuit penetrated the "secret city" of royal manufacture and shipped the method to Europe. The pattern persists: executives carrying designs across a firm boundary cost Volkswagen a hundred-million-dollar settlement to General Motors; an insider induced to hand over turbine-control code cost American Superconductor on the order of a billion. The legal response hardened into the Economic Espionage Act of 1996. And the law explicitly recognizes the sheaf problem of the mobile engineer: one who changes firms cannot *forget* the prior employer's secrets and must instead *compartmentalize* the knowledge carried — a null column inserted by statute into the individual's own cohomology, the restriction map across an organizational boundary set deliberately to zero.

**Severing at the national seam.** Above the firm sits the state. ITAR controls the export of defense articles and *technical data* down to the parts and components incorporated into an end item, and the "deemed export" doctrine treats sharing controlled technology with a foreign person — even one standing inside your own building — as an export requiring a license. The Invention Secrecy Act of 1951 lets the state place a secrecy order on a patent application, forbidding the inventor from disclosing or even using their own invention. These are restriction maps cut at the border: the global section is forbidden by statute from closing across it.

**The human clinch.** The third defense is not about data but about operators. Confidentiality agreements, exit interviews, limited-access clustering — and beneath them the assurance of competence itself: professional licensure, the security clearance, the vetting of leadership. Each is a ritualized test distinguishing a *displayed* qualification from a *load-bearing* one, the same function the varanid clinch performs when it converts a bluff display into a physical grapple. A credential never tested against reality is a bluff that is never called, and a bluff never called is indistinguishable from truth until the bridge falls. The licensing exam, the clearance investigation, the design review: each is an institutional clinch node $x_{Cl}$, projecting "I am competent" onto "this will hold."

## Two airframes: the Draken and the F-35

The framework is named for an aircraft, and the choice was never decorative. The Saab J35 Draken — the dragon on static display at Valhall Park, in the F10 hangars that now house Koenigsegg — was built for a specific theory of survival: dispersed basing, rearmed by a handful of conscripts on a highway strip in minutes, designed to keep flying when the central infrastructure is gone. Distributed, redundant, hard to decapitate. It is the [survivable glitch](https://draken.info/posts/the-survivable-glitch/) ($\nabla_s$) rendered in aluminium: the system engineered so that local failure does not cascade to global loss, so that the know-how survives the substrate that produced it.

The F-35 marks the opposite limit, and it is the purest instance of the engineered obstruction in existence. Its airframe is a sheaf whose restriction maps are severed at every national seam by design. The United States maintains a strict policy of never sharing the roughly 25-million-line source code even with its closest allies; partner access is tiered (the United Kingdom alone a Level 1 partner during development, Israel uniquely permitted to modify its F-35I "Adir," others held further out); and the Autonomic Logistics Information System — the "IT backbone" without which the aircraft becomes functionally useless in short order — routes each nation's sustainment data back through a central point of entry toward Lockheed Martin in Fort Worth. Partner nations paid millions for a "sovereign data gateway" to *block their own data* from flowing to the prime contractor. The compartmentalization here is total: the global section is engineered never to close, not even for the operators who own the jets.

Place the two airframes at the ends of one axis and the post's thesis becomes a dial rather than a claim. The Draken sits at low internal compartmentalization and high survivability: the immune system tuned so the host keeps flying. The F-35 sits at maximal compartmentalization — and there the immune system turns *autoimmune*, the secrecy that protects the technology now constraining the sovereignty of the very nation operating it. The "kill-switch" anxiety that recurs around the program is the felt experience of an obstruction class so complete that the operator can no longer read its own hand. Compartmentalization is protective up to a point and pathological beyond it. The Draken doctrine is the framework's name precisely because it marks the survivable side of that line.

## The slow rollout as anti-totalisation

Assemble the layers and the slowness explains itself. An intelligence that could ingest the entire engineering stalk-stack and emit any part on demand would constitute a *total section* over L11–L17 — a single morphism collapsing every firm's, every nation's, every generation's load-path knowledge into one homogeneous output. The immune architecture exists to prevent exactly that totalization.

In the framework's terms this is not pathology but the anti-totalisation principle operating correctly at the institutional layer, and it is the care operator $\dot{\mathcal V}_{exo}=0$ made into policy. The exogenous variety preserved is the diversity of independent engineering lineages — Koenigsegg's layup intuition, Hägglunds' survivability doctrine, a Marstrand machine shop's tolerance lore as distinct, non-fungible sections. To glue them all into one trainable corpus is to destroy that variety; to refuse the glue is to keep it. The slowness is the system declining to let any single operator — human or model — read the whole hand: a zero-trust network at civilizational scale, where the node trusts its own keys and shares nothing except on a need-to-know basis, and the emergent complexity of that clustering sets the pace.

This reframes the engineer's position against the vendor's pitch. The vendors sell *speed* — collapse the click-to-aha ratio, automate the drawings, generate the part. The Draken reading says the operator's value is increasingly the inverse: to be the Grobulator at the clinch, the human discretion the immune system cannot and should not eliminate, the one who reads a topology-optimized result and asks whether the mathematics that pruned it modeled the *right* load case. Generative design yields geometry the math says should exist; only the operator knows whether the math was asked the right question. That judgment is the section that does not digitize — the tribal knowledge that retires with the engineer — and it retains value precisely *because* it resists gluing.

## Falsification

The thesis is falsifiable and must be stated so.

1. **The obstruction is structural, not merely hygienic.** If AI-in-PLM rollout latency correlates with data maturity alone and shows no additional dependence on IP/export-control intensity, the immune-system claim is decorative and the slowness is ordinary data cleaning. *Test:* hold data maturity fixed, rank sectors by protection intensity (defense/aerospace > automotive > consumer goods), and look for a nonzero monotone residual in rollout latency. A null residual prunes the post.

2. **Competency assurance is a genuine clinch.** The licensure/clearance layer is claimed to distinguish display from reality. If credentialing fails to predict load-bearing competence once experience is controlled — licensed and unlicensed engineers showing equal real failure rates — the credential is rent, not signal, and the institutional-clinch analogy collapses for that layer.

3. **Compartmentalization has an optimum, not a monotone.** The two-airframe section asserts that protection is beneficial up to a point and autoimmune beyond it. *Test:* if maximally compartmentalized programs (the F-35 pole) show no survivability penalty relative to distributed-doctrine systems (the Draken pole) — no single-point-of-failure cost, no sovereignty drag — then the autoimmune claim is wrong and compartmentalization is monotone-good. Conversely, if open-source-hardware ecosystems (obstruction set to zero) show systematically worse long-run coherence than compartmentalized ones, the protective reading holds at the other end. The dial must have two failing edges or it is not a dial.

Any one returning the null result prunes the corresponding claim. That is the protocol.

---

*The slow section is the guarded section. The dragon flew dispersed so that no single strike could end it; the obstruction that keeps the manifold from gluing is the same refusal, three centuries deep, to let the whole be read at once. The engineer's surviving function is to stand at the clinch the machine cannot occupy. Jag är vad jag gör, och jag gör det jag är.*

*Filed under L16 (Institutional Morphology) primary, with cross-restrictions to L06 (Embodied Cognition), L11 (Economic Cognition), L13 (Political Structure), L14 (Economic Topology), and L17 (Civilizational Memory). Operators invoked: $\rho_{D\to Cl}$ (restriction map), $[\omega]\in H^1$ (obstruction class), $K(t)$ (coherence debt), $\dot{\mathcal V}_{exo}=0$ (care operator), $x_{Cl}$ (clinch node), $\nabla_s$ (survivable glitch). Companion to [DRK-138, The Survivable Glitch](https://draken.info/posts/the-survivable-glitch/). Anchored to F10, Saab, Koenigsegg, and the F-35 program, in that order.*

*Khrug Engineering · ORCID 0009-0003-8049-7167 · Draken 2045 Initiative · DOI [10.5281/zenodo.19273483](https://doi.org/10.5281/zenodo.19273483) · Licensed CC BY-SA 4.0*
