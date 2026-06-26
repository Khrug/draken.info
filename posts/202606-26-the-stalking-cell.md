---
title: "The Stalking Cell: Fractal Growth, the Bioelectric Glue, and the Restriction-Map Chain from Gene to Organism"
drk: DRK-167
date: 2026-06-26
tags: [theory, analysis, synthesis, biology]
layers: [L02, L03, L05, L06, L07, L09, L11, L12, L17]
coherence: 0.87
description: "A 558-million-year-old frond on a deep-sea floor is the cleanest statement of the Draken thesis ever fossilised. Charnia masoni is built by a short recursive rule, not a geometric blueprint, and the medium that turns that rule into a body is not the genome but the bioelectric field gluing local cell decisions into a global form. From DNA to organism is a chain of restriction maps; the cell does not contain the body, it stalks it — pursuing the setpoint the rule specifies. Protocol executes through substrate, and it has done so since before the Cambrian."
excerpt: "A frond on the Ediacaran sea floor, 558 million years old, has no stem, no mouth, no organs — and is built from a rule so short it carries almost no genetic information. Charnia is a fractal in flesh, a Lindenmayer system that ran before there were nervous systems to run it. The form is not specified by the genome; it is specified by a recursion, decoded through a bioelectric field that glues local cell decisions into a coherent body. From gene to organism is a sequence of projections, each one a restriction map throwing away dimension. The cell does not hold the blueprint. It stalks the shape the rule already implies — the same way a protocol executes through an individual rather than being authored by it."
status: published
author: Khrug Engineering
license: CC BY-SA 4.0
sources:
  - "Hoyal Cuthill, J.F. & Conway Morris, S. (2014). Fractal branching organizations of Ediacaran rangeomorph fronds reveal a lost Proterozoic body plan. PNAS 111(36): 13122–13126. https://doi.org/10.1073/pnas.1408542111"
  - "McIlroy, D. et al. (2025). Architectural modelling of the fractal-like Ediacaran rangeomorph Charnia masoni. Journal of the Geological Society 182(3): jgs2024-242. https://doi.org/10.1144/jgs2024-242"
  - "Rosse-Guillevic, S., Muirhead-Hunt, H., McIlroy, D. et al. (2025). Growth and disparity of form in the Ediacaran genus Charnia, with description of Charnia brasieri sp. nov. from the Ediacaran of Avalonia. Precambrian Research. https://doi.org/10.1016/j.precamres.2025.107876"
  - "Levin, M. & Martyniuk, C.J. (2018). The bioelectric code: An ancient computational medium for dynamic control of growth and form. Biosystems 164: 76–93. https://doi.org/10.1016/j.biosystems.2017.08.009"
  - "Manicka, S., Pai, V.P. & Levin, M. (2023). Information integration during bioelectric regulation of morphogenesis of the embryonic frog brain. iScience 26(12): 108398. https://doi.org/10.1016/j.isci.2023.108398"
  - "Levin, M. (2025). The Multiscale Wisdom of the Body: Collective Intelligence as a Tractable Interface for Next-Generation Biomedicine. BioEssays 47(1): e202400196. https://doi.org/10.1002/bies.202400196"
  - "Hansali, S., Pio-Lopez, L., Lapalme, J.V. & Levin, M. (2025). The Role of Bioelectrical Patterns in Regulative Morphogenesis: an Evolutionary Simulation and Validation in Planarian Regeneration. IEEE Transactions on Molecular, Biological, and Multi-Scale Communications. https://doi.org/10.1109/TMBMC.2025.3575233"
  - "Zhang, G. & Levin, M. (2025). Bioelectricity is a universal multifaceted signaling cue in living organisms. Molecular Biology of the Cell 36(2). https://doi.org/10.1091/mbc.E23-08-0312"
---

> *Jag är vad jag gör, och jag gör det jag är.*

## 1. The Rule, Not the Blueprint

On the late Ediacaran sea floor, between roughly 575 and 541 million years ago, the first large organisms on Earth were fronds. They had no mouths, no guts, no nervous systems, no muscles. They were anchored to the mud by a flat circular holdfast and they fed, most likely, by absorbing dissolved nutrients across their surface — osmotrophy. The most iconic of them, *Charnia masoni*, was found in 1957 in Charnwood Forest by a schoolboy, Roger Mason, and it broke a dogma that had stood since Darwin: that nothing complex lived before the Cambrian.

The thing that matters for Draken is *how Charnia was built*. Hoyal Cuthill and Conway Morris (2014) modelled the entire rangeomorph clade — eleven taxa, Charnia included — using **parametric Lindenmayer systems**: formal grammars in which a single production rule is applied recursively at finer and finer scales. The rangeomorph body plan turns out to be a fractal characterised by self-similar, axial, apical, alternate branching. Each "frondlet" is a centimetre-scale copy of the whole, and the whole is a copy of the frondlet, down through several orders of branching.

The decisive observation is economic. Across the eleven taxa, the morphological diversity — the difference between a tall narrow *Charnia* and a low spreading *Fractofusus* — requires **almost no new genetic information**. The taxa differ in the *parameter values* fed into the same recursion, not in the recursion itself. The genome is not storing a picture of the organism. It is storing a short rule and a handful of dials.

This is the first move of the Draken thesis stated in the oldest available substrate: *the blueprint is not the form*. A blueprint specifies the whole at full resolution. A rule specifies a procedure that generates the whole at any resolution. Charnia is built the second way.

## 2. From Gene to Frond: A Chain of Restriction Maps

Let $R$ denote the generative rule — in the rangeomorph case, the L-system production with its parameter vector $\theta \in \Theta$. The organism $M$ is not stored anywhere; it is the fixed point of iterating $R_\theta$ against a permissive medium. Between the gene and the grown body there is a sequence of layers, and crucially, **each transition between layers discards information** — it is a restriction map in the cellular-sheaf sense (Hansen & Ghrist 2019), a projection $\rho$ from a higher-dimensional local state onto a lower-dimensional realisation:

$$
\text{DNA} \xrightarrow{\ \rho_1\ } \text{regulatory pathway} \xrightarrow{\ \rho_2\ } \text{bioelectric field} \xrightarrow{\ \rho_3\ } \text{tissue branching} \xrightarrow{\ \rho_4\ } \text{frond}
$$

Each $\rho_i$ is many-to-one. The genome does not encode the geometry; it encodes proteins. Levin and Martyniuk (2018) state this flatly and it is the load-bearing biological fact of the whole post: *DNA does not directly specify the geometrical arrangement of tissues and organs.* There is no coordinate in the genome that reads "frondlet at 4.2 cm, angle 31°." The geometry has to be **encoded into, and decoded out of, an intermediate medium** — and that decoding is where the form actually appears.

The composite $\rho = \rho_4 \circ \rho_3 \circ \rho_2 \circ \rho_1$ is the morphogenetic projection. Its kernel — everything thrown away at each stage — is enormous. What survives the composite is exactly the invariant the rule was written to preserve. This is why the same recursion can run on wildly different cell populations and produce the same frond: the form lives in $\rho$, not in the cells.

## 3. The Medium Is the Message: The Bioelectric Glue

If the genome does not hold the geometry, what does the decoding? Levin's programme over the last decade gives a concrete answer for animal morphogenesis: **developmental bioelectricity**. All cells — not only neurons and muscle — maintain a membrane voltage $V_\text{mem}$, are coupled to their neighbours through gap junctions, and collectively form bioelectric circuits whose voltage *patterns* prefigure anatomy.

The point that matters for the sheaf reading is precise and is not the obvious one. Manicka, Pai and Levin (2023) showed, in the morphogenesis of the *Xenopus* embryonic brain, that transcriptional and morphogenetic state is determined **not by single-cell voltage but by the distribution of voltage across the cell sheet**. Genes in one cell respond to the voltages of faraway cells, integrated over time. The morphogenetic decision is a property of the *global section*, not of any local stalk.

This is the sheaf-gluing condition made physical. In the cellular-sheaf formalism, a global section exists when local sections agree on overlaps; the obstruction to gluing is the first cohomology $H^1$. The bioelectric field is the literal mechanism by which local cell states are checked for agreement and assembled into a single coherent body plan. Levin (2025) calls these voltage patterns *informational scaffolds* storing rough anatomical setpoints — a "pattern memory" that says *one head, one tail*, or *eye here*, without micromanaging the thousands of genes that build the structure. Zhang and Levin (2025) emphasise that there is no 1:1 relationship between bioelectric outcome and gene products: the field is a content-blind carrier, exactly as in DRK-166. The voltage distribution is the carrier; the gene-expression outcome is the cargo; and the same carrier can in principle glue a different cargo, which is why a brief induced bioelectric pattern can repair a genetically-caused brain defect "in software" (Hansali et al. 2025, validated in planarian regeneration).

So the decoding medium is not the genome and not the individual cell. It is the **field between cells** — the communication layer. The rule is written in DNA; the rule is *executed* in the bioelectric sheaf.

## 4. The Stalk

Charnia predates nervous systems and gap-junction bioelectricity of the vertebrate kind by hundreds of millions of years, so we should be careful: the rangeomorph used whatever pre-neural coordination its grade allowed. But the morphology preserves the structural signature of an inter-module communication channel, and the 2025 literature has now resolved it.

McIlroy (2025) reconstructed Charnia's architecture in 3D and found the primary branches to be **biserial, rotated, and mechanically stiff** — robustly attached along their axial and distal margins, impervious to being lifted by currents. This is not a passive bag of fluid; it is a structured assembly with load paths. And Rosse-Guillevic, Muirhead-Hunt, McIlroy et al. (2025), describing the new species *Charnia brasieri*, report that the first-order branch axes were **connected by a stalk to the midline — possibly stolon-like**.

A stolon is a runner: a channel that connects modules and carries material and signal between them. In the Draken reading this is the physical correlate of the restriction-map architecture — the conduit along which the shared rule is propagated from the holdfast outward, keeping the iterated modules in register. The stalk is where the gluing happens. It is the substrate of the substrate.

## 5. Speciation as Parameter Variation, Individuation as Trajectory

Return to $\Theta$, the parameter space of the rule. Hoyal Cuthill and Conway Morris's central result — that the rangeomorph taxa are reached by varying parameters of one shared recursion — gives two clean Draken definitions:

- **Speciation** is movement to a new region of $\Theta$. A species is an attractor basin in parameter space: a setting of the dials that breeds true. The recursion is conserved; the parameters drift. This is why "very little new genetic information" separates the taxa — evolution is retuning, not rewriting.
- **Individuation** is a single organism's *trajectory* through development under a fixed $\theta$ — the particular history of how this frond, in this current, on this patch of mud, realised the rule. Two fronds with identical $\theta$ are the same species and yet not the same individual, because the rule underdetermines the realisation: the medium contributes noise, contingency, damage, repair. The individual is what the rule plus this history produced once.

This is the varanid insight (the ritualised-combat protocol that executes through the individual rather than being authored by it) generalised to all of development. The species is the protocol. The individual is one run of it. The cell is the processor, not the program.

## 6. The Stalking Cell

Hence the title. The naïve picture has the cell *containing* the organism — a homunculus, a blueprint folded up inside the genome waiting to be unfolded. The fractal-plus-bioelectric picture is the opposite. The cell holds a short rule and a local voltage state. What it does is **pursue** — stalk — the setpoint that the rule, glued across the sheet, specifies. Morphogenesis is error-reduction toward an encoded target the single cell cannot see and does not contain: a homeostatic process chasing a shape that exists only as the global section of the field.

The cell stalks the organism the way a predator stalks prey it has not yet caught: oriented toward a target defined elsewhere, closing the gap by local moves. The body is not in the cell. The body is the thing the cell is hunting. And the rule that points it — the recursion, the L-system, the bioelectric setpoint — is older than brains, older than muscle, older than the Cambrian. Charnia ran it on the floor of a Proterozoic sea, with no head to hold the plan, and built a metre of coherent form out of a sentence's worth of instruction.

Future ≡ Life. The frond is the proof that the rule precedes the runner.

## 7. Falsification

The thesis makes a sharp, standing claim: **morphology is rule-generated, not blueprint-specified, and the variation between related forms is parameter variation over a conserved recursion.** This is falsifiable in three directions.

1. **Genetic-divergence test (paleo/comparative).** If form were blueprint-specified, taxa that differ substantially in morphology should require proportionally large genetic/informational divergence. The rangeomorph result (Hoyal Cuthill & Conway Morris 2014) is the standing positive evidence: near-zero new information across eleven morphologically distinct taxa. The thesis is falsified if a rangeomorph (or analogous modular) taxon is found whose form **cannot be reached by retuning the shared recursion** — i.e. requires a genuinely new production rule rather than new parameters.

2. **Decoupling test (bioelectric).** If the geometry lived in the genome rather than in the decoding medium, then imposing a correct bioelectric pattern on a genetically-perturbed field should *not* rescue normal form. The standing positive evidence is the opposite: induced bioelectric patterns repair genetically-caused defects (Hansali et al. 2025; Levin 2025). The thesis is falsified if morphogenetic outcome proves to be a strict 1:1 function of single-cell gene state, independent of the cross-sheet voltage distribution — contradicting Manicka, Pai & Levin (2023).

3. **Restriction-map test (formal).** The chain $\rho = \rho_4\circ\rho_3\circ\rho_2\circ\rho_1$ predicts that information present at the gene layer but absent from the realised form is *systematically* discarded at identifiable stages, and that the surviving invariant matches the rule. The thesis is falsified if morphological information is found that is present in the realised organism but traceable to *no* upstream layer — form appearing with no rule to generate it, a non-zero section with no stalk.

Coherence is set at 0.87, honestly reflecting that the rangeomorph–bioelectric bridge is an analogy across a 550-million-year gap: Charnia's actual coordination mechanism is inferred from morphology, not measured, and the claim that pre-neural rangeomorph growth used a gluing medium homologous in *function* (not structure) to vertebrate bioelectricity is the load-bearing conjecture still open to test.

---

*Filed under:* L02 (Molecular/Genetic), L03 (Cellular), L05 (Tissue/Morphogenetic), L06–L07 (Organismal), L09, L11–L12 (Protocol/Invariant), L17 (Deep-Time).
*Operators:* Γ (coherence ratio), H¹ (gluing obstruction), ρ (restriction map), V̇_exo (care/variety operator, latent).
*Cross-references:* DRK-123 (The Imaginary Dimension — restriction maps and dimensional projection), DRK-163 (The Two Optics), DRK-165 (The Pendragon Source — etymology and laundering), DRK-166 (The Carrier and the Cargo — content-blind carrier vs. representational cargo).

*Khrug Engineering · ORCID 0009-0003-8049-7167 · DOI 10.5281/zenodo.19273483 · CC BY-SA 4.0*
