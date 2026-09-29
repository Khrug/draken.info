---
title: "The Keeper at the Crossing"
drk: DRK-183
date: 2026-09-27
tags:
  - boundaries
  - keeper-function
  - etymology
  - property
  - self-defence
  - immunology
  - certification
  - time-stamping
  - hallmarking
  - labelling
  - commons
  - distributed-consensus
  - anti-totalization
layers:
  - L08
  - L10
  - L11
  - L12
  - L18
coherence: 0.80  # provisional placeholder: author to score
description: "A substrate-invariant account of boundaries: fence, membrane, home, animal, commons, stamp and root of trust, read through the keeper-function and the two-sided failure of every gate."
excerpt: "Offence and defence are the same strike pointed in opposite directions; the fence decides which. This post follows that strike from the Latin *fendere* through skin, walls, pets, commons, hallmarks and timestamps to the question of who keeps the gate, and who keeps the keeper."
status: published
author: Khrug Engineering
license: CC BY-SA 4.0
sources:
  - "Lakoff, G. & Johnson, M. (1980). Metaphors We Live By. University of Chicago Press."
  - "Johnson, M. (1987). The Body in the Mind. University of Chicago Press."
  - "Maturana, H. & Varela, F. (1980). Autopoiesis and Cognition. Reidel."
  - "Matzinger, P. (1994). Tolerance, danger, and the extended family. Annual Review of Immunology 12."
  - "Esposito, R. (2002). Immunitas. Einaudi."
  - "Douglas, M. (1966). Purity and Danger. Routledge."
  - "Girard, R. (1982). Le Bouc émissaire. Grasset."
  - "Agamben, G. (1995). Homo Sacer. Einaudi."
  - "Ostrom, E. (1990). Governing the Commons. Cambridge University Press."
  - "Hirschman, A. O. (1970). Exit, Voice, and Loyalty. Harvard University Press."
  - "Honoré, A. M. (1961). Ownership. In Oxford Essays in Jurisprudence."
  - "Austin, J. L. (1962). How to Do Things with Words. Oxford University Press."
  - "Goffman, E. (1963). Stigma. Prentice-Hall."
  - "Becker, H. S. (1963). Outsiders. Free Press."
  - "Hacking, I. (1995). The looping effects of human kinds. In Sperber, Premack & Premack (eds.), Causal Cognition. Oxford University Press."
  - "Haber, S. & Stornetta, W. S. (1991). How to time-stamp a digital document. Journal of Cryptology 3(2)."
  - "RFC 3161 (2001). Internet X.509 PKI Time-Stamp Protocol (TSP)."
  - "RFC 6962 (2013). Certificate Transparency."
  - "Lamport, L., Shostak, R. & Pease, M. (1982). The Byzantine Generals Problem. ACM TOPLAS 4(3)."
  - "Fischer, M., Lynch, N. & Paterson, M. (1985). Impossibility of distributed consensus with one faulty process. Journal of the ACM 32(2)."
  - "Gilbert, S. & Lynch, N. (2002). Brewer's conjecture and the feasibility of consistent, available, partition-tolerant web services. SIGACT News 33(2)."
  - "Hansen, J. & Ghrist, R. (2019). Toward a spectral theory of cellular sheaves. Journal of Applied and Computational Topology 3."
  - "Hansen, J. & Ghrist, R. (2021). Opinion dynamics on discourse sheaves. SIAM Journal on Applied Mathematics 81(5)."
  - "Maynard Smith, J. & Parker, G. A. (1976). The logic of asymmetric contests. Animal Behaviour 24."
  - "Cheng, C. & Hoekstra, M. (2013). Does strengthening self-defense law deter crime or escalate violence? Journal of Human Resources 48(3)."
  - "Brottsbalken (1962:700), 4 kap. 6 §, 24 kap. 1 § och 6 §."
  - "Regeringsformen (1974:152), 2 kap. 15 §."
  - "Djurskyddslag (2018:1192)."
---

## Abstract

Offence and defence are the same strike. Latin *offendere* and *defendere* share the verb *\*fendere*, "to strike," and differ only in direction: *against* versus *away*. English *fence* is a clipped *defence*. The boundary therefore does not merely sit between offence and defence; it is **what classifies a strike as one or the other**. This post follows that observation across substrates (cell membrane, skin, house wall, property line, commons, state border, psychological self-model) and argues that every boundary performs six functions and fails in two directions. It then extends the analysis from *force at the gate* to *marks at the gate*: the stamp, the hallmark, the timestamp, the diagnosis, the certificate. Certification turns out to have the same structure as defence, including the same regress, which terminates in a self-signed root. The post closes by asking whether a single global root of trust, or a distributed planetary one, could end conflict, and answers no: the achievable target is a **distributed keeper-function that makes conflict survivable**. The governing rule is stated in §13: *control is legitimate only as care, only as much as care requires, and only under a witness the controller does not appoint.*

---

## §1. The strike: *fendere* and *\*gʷʰen-*

The Latin simple verb *\*fendere* is unattested; it survives only in compounds. It is conventionally traced to PIE **\*gʷʰen-**, "to strike, kill."

| Latin compound | Structure | Sense | English reflexes |
|---|---|---|---|
| *offendere* | *ob-* (against) + *fendere* | strike against, stumble on, displease | offend, offence, offensive |
| *defendere* | *dē-* (away) + *fendere* | strike away, ward off | defend, defence |

By aphesis (loss of the initial syllable), *defence* gives **fence**, *defend* gives **fend**, and *defender* gives **fender**. **Fencing** as swordplay is the art of *defence*; the fencer is etymologically the defender.

The Germanic and Greek branches of *\*gʷʰen-* complete the family: Old English *bana* ("slayer," whence **bane**), Old Norse *bani* (Swedish **banemannen**, **banesår**), Greek **phónos** (φόνος, "murder"), and Old Norse *gunnr* ("battle," as in *Gunnar*, *Gunnhildr*). English **gun** is commonly derived from a fourteenth-century nickname for a siege engine, *Domina Gunilda*, which would place it in the same family.

**Structural reading.** Force carries no intrinsic moral sign. A strike becomes *offence* or *defence* by its direction relative to a boundary. Every later section is an elaboration of this single asymmetry.

**Two false friends, kept honest.** Swedish *bana* ("track," *motorbanan*) comes via Low German *bane* (German *Bahn*) and is unrelated to *bani*. Greek *phōnḗ* (φωνή, "voice," as in *telephone*) comes from a different root, **\*bʰeh₂-** ("to speak"), which also gives Latin *fārī*, *fama*, *fatum* and Germanic *\*bannan*, "to proclaim," whence **ban**. *Telephonos*, "murder at a distance," is a homophonic construction, not an attested compound. It is nevertheless instructive: the two primordial ways of acting on another are **striking** (*\*gʷʰen-*) and **speaking** (*\*bʰeh₂-*), and the **ban** is speech that functions as a fence.

---

## §2. The enclosure: property as a fenced claim

Property is lexicalised as enclosure across unrelated Indo-European branches:

- **town** comes from Old English *tūn*, "enclosure," cognate with German *Zaun* ("fence") and Dutch *tuin* ("garden").
- **yard**, **garden** and Swedish **gård** derive from PIE **\*gʰer-**, "to enclose."
- **paradise** derives from Avestan *pairi-daēza*, "walled around."

The settlement, the cultivated plot and the sacred space are each defined *by* their fence. Rousseau's *Discourse on Inequality* (1755) locates the founding of civil society in the first person who enclosed a plot and declared it his, and the others who believed him. Locke (*Second Treatise*, ch. V) grounds property in labour mixed with land. Honoré's analysis of ownership (1961) lists the **right to exclude** among its core incidents.

**Swedish property is legally permeable.** Regeringsformen 2 kap. 15 § protects property and, in the same paragraph, guarantees access to nature under **allemansrätten**. The Swedish fence is therefore a *selectively permeable membrane* by constitutional design: the public may cross land but not enter the *hemfridszon* around a dwelling. This is §4's axiom (ii) written into law.

---

## §3. Two geometries of fault

Moral vocabulary encodes wrongdoing in two spatial models, corresponding to two of Mark Johnson's image schemas (*The Body in the Mind*, 1987):

| Image schema | Fault | Vocabulary |
|---|---|---|
| CONTAINER (inside / boundary / outside) | crossing a line | offence, **trespass** (*trespasser*, "pass beyond"), **transgression** (*trans-gredi*, "step across") |
| SOURCE–PATH–GOAL | leaving the course | **error** (*errare*, "stray"; cf. *knight-errant*), **aberration**, **deviation**, going *off course* |

**Course** comes from *cursus*, from *currere*, "to run": the race course, the university *course* and *curriculum* ("a little running"), the course of a meal, *of course* ("in the ordinary course"), and *off course*. **Standard** comes from Old French *estandart*, a planted rallying flag. It shifted from the flag marking *where* authority stood to the fixed measure defining *what* authority set. The standard is the reference point for both geometries: the post the fence is measured from and the bearing the course is plotted against.

**Methodological note.** Origins do not fix present meaning; treating them as if they did is the etymological fallacy. The evidential weight here comes from **convergence**: unrelated roots (*fendere*, *\*gʰer-*, *currere*, *errare*, *fīnis*) independently lexicalise the same spatial structures. That pattern is what conceptual metaphor theory (Lakoff & Johnson, 1980) predicts, and it is testable (§14, F1).

A further convergence is homophonic rather than genealogical. *Of-fence* / *of-end* has no historical basis (Germanic *end* is unrelated to *fendere*), but Latin **fīnis** means both "end" and "boundary" (*define*, *confine*). The pun bridges two independent roots that encode the same limit.

---

## §4. The membrane: six functions, two failures

Across substrates, a boundary appears to require six functions:

1. **Distinction**: it separates inside from outside and so constitutes a self.
2. **Selective permeability**: some crossings are admitted. A wall with no door is a tomb.
3. **Maintenance cost**: the boundary decays without investment.
4. **Detection**: crossings are registered.
5. **Graded response**: force scales with threat.
6. **Answerability**: the response is attributable. *Responsible* comes from *respondere*, "to answer, to pledge in return."

Maturana and Varela's autopoiesis (1980) adds that in living systems the membrane is produced *by* the system it bounds. Boundary and self co-constitute each other.

| Substrate | Boundary | Detection | Response | Failure: under | Failure: over |
|---|---|---|---|---|---|
| Cell | membrane | receptors | signalling, apoptosis | lysis | — |
| Organism | skin, mucosa | innate immunity | inflammation | infection | allergy, autoimmunity |
| Home | wall, threshold | alarm, animal | expulsion | intrusion | spring gun |
| Commons | community border | monitoring | graduated sanction | free-riding | exclusion, capture |
| State | border | intelligence | defence doctrine | occupation | war of aggression |
| Mind | self-model | affect | assertion | being overrun | chronic offence-taking |

**Every gate fails in two directions**: admitting harm, or attacking what is harmless or part of the self. Autoimmunity and excess self-defence are structurally the same error.

**Ethological anchor.** Maynard Smith and Parker (1976) showed that an arbitrary but shared asymmetry, such as ownership, can settle contests without escalation ("fight if resident, yield if intruder"). Ritualised varanid combat is the visible form of that logic: the contest is kept and the force is bounded. The boundary regulates the fight rather than abolishing it.

---

## §5. What crosses: *fluere*, infection and immunity

The *fendere* family names the wall; the *fluere* family names the traffic. Latin *fluere*, "to flow," gives **influence**, **fluent**, **flux**, **affluence**, **effluent**, **superfluous**, **confluence**, and **influenza**: Italian "influence," the epidemic attributed to an astral inflow, borrowed into English in 1743. Germanic **flow** and **fly/flew** belong to a different root (PIE *\*pleu-*), a near-homophony that converges on the same image of movement through a medium.

| Word | Literal | Boundary reading |
|---|---|---|
| influence | flowing in | admitted or unnoticed crossing |
| infection | *in-ficere*, put in, stain | crossing that corrupts |
| contagion | *con-tangere*, touch together | crossing by contact |
| effluent | flowing out | export across the boundary |

*Influence* and *infection* are the same event, an inflow, differing by effect. Immunology formalises the distinction:

- **Self/non-self** (Burnet): foreignness triggers response.
- **Danger model** (Matzinger, 1994): damage signals trigger response; foreignness alone does not.

The microbiome supports the second model. Most microbial colonisation is commensal, and resident flora confer **colonisation resistance** against pathogens. Colonisation and invasion are separate categories, distinguished by harm rather than by crossing. The legal analogue follows directly (§6): defence licensed by *harm and imminence*, not by the *alienness* of the crosser.

The etymological spine of immunity is political. **Immunis** means exempt from *munera*, shared duties; **communis** means sharing them. Esposito (*Immunitas*, 2002) builds on this pair: immunisation protects the community, and excessive immunisation dissolves it. **Colony** comes from *colonus*, from *colere*, "to cultivate," the root of *culture* and *cult*. Colonisation means cultivating another's ground as one's own.

**Formal counterpart.** The divergence theorem equates flux through a closed surface with net sources and sinks inside it:

$$\oint_{\partial V} \mathbf{F}\cdot d\mathbf{S} \;=\; \int_V (\nabla\cdot\mathbf{F})\,dV$$

Boundary traffic is the signature of interior process. On graphs, the combinatorial counterpart is the coboundary operator and its adjoint, which is the natural bridge to the sheaf Laplacian (Hansen & Ghrist, 2019). At this stage the correspondence is an analogy, not a derivation.

---

## §6. Defending the home

Self-defence doctrines generally rest on three conditions: **imminence**, **necessity** and **proportionality**.

In Swedish law, *nödvärn* (Brottsbalken 24 kap. 1 §) covers, among other situations, repelling someone who unlawfully enters or tries to enter a room, house, yard or vessel. Defensive force is permitted unless it is *uppenbart oförsvarligt*, manifestly indefensible. Excess can be excused where the defender could hardly have kept composure (24 kap. 6 §). The house boundary is independently protected by *hemfridsbrott* (4 kap. 6 §). **Defence that overshoots becomes offence**: the fence has a far side.

Jurisdictions disagree about how far the domestic fence extends:

- **Duty to retreat**: yield ground where it is safely possible.
- **Castle doctrine**: no duty to retreat within the home.
- **Stand your ground**: no duty to retreat anywhere one lawfully is.

Cheng and Hoekstra (2013) found that US state expansions of castle-doctrine and stand-your-ground law were associated with increased homicides and no detectable deterrence of burglary, robbery or aggravated assault. That is consistent with the prediction that extending the zone of licensed force enlarges the over-response failure without reducing the under-response failure.

**Legibility.** Barbed wire (Glidden's patent, 1874) is a boundary that injures on contact: offence built into defence. Law tolerates it while prohibiting hidden lethal devices such as spring guns (*Bird v Holbrook*, 1828; *Katko v. Briney*, Iowa 1971). The criterion is **legibility**. A visible barrier warns, and so shifts responsibility to the crosser; a hidden trap does not. The same criterion governs psychological boundaries (§11): a fence the other party could not see cannot ground a charge of trespass.

---

## §7. Keeping the animal: the keeper who owns and owes

A kept animal sits on two boundaries at once. It is **inside** the keeper's property: Swedish civil law treats animals as property, and defending one against theft or attack falls within the defence of property. And the keeper stands **at the animal's boundary**, controlling its space, food, climate and contacts.

The second position is conditional. The Swedish Djurskyddslag (2018:1192), and the Five Freedoms tradition descending from the Brambell Report (1965), make the right to keep an animal contingent on securing its welfare. The keeper **owns and owes**. This is the general form:

> You are not entitled to control another life unless you secure its well-being.

The principle recurs across scales. In Mencius (1B8), a ruler who ruins the people forfeits the Mandate, and killing the tyrant Zhou is the execution of "a mere fellow." In Locke (§149), political power is a fiduciary trust that reverts when violated. Fiduciary law ties a trustee's control to duties of care and loyalty. *Sovereignty as responsibility* (Deng et al., 1996) became the Responsibility to Protect at the 2005 UN World Summit.

**The asymmetry.** The condition is *necessary, not sufficient*. "If you secure their well-being you may control them" is the historical form of **paternalism** and of the colonial "civilising mission," in which the controller defined well-being. If the keeper both controls and certifies the welfare assessment, the condition collapses into self-certification (§11). Care must therefore be paired with conditions the keeper does not supply:

1. **Voice**: the kept can contest the assessment (Hirschman, 1970).
2. **Exit**: where possible, the kept can leave the boundary.
3. **Witness**: third parties can audit.
4. **Proportionality**: control extends no further than care requires.

For beings without voice, such as animals, infants and future generations, witness and proportionality carry the entire load. That is why welfare law relies on external inspection rather than the keeper's report.

**Control** itself comes from Anglo-French *contre-rolle*, a counter-roll: the duplicate register kept to audit the original. In its origin, control *is* witnessed authority.

---

## §8. Communal responsibility: keeping as a shared office

The Hebrew root **š-m-r**, "to keep, guard," structures the opening chapters of Genesis:

1. **Gen 2:15.** The human is placed in the garden *to work it and keep it* (*ʿābad*, *šāmar*). The garden is a *pairidaeza*; keeper and cultivator (*colere*) are one office.
2. **Gen 3:24.** Cherubim with a flaming sword *keep* the way to the tree of life: the keeper stationed at the gate, with force.
3. **Gen 4:9.** "Am I my brother's keeper (*šōmēr*)?" The first refusal of answerability follows the first killing.

The sequence runs from keeping the enclosure, to guarding its boundary, to disowning the keeper-function between persons. That is the arc *fence → defence → responsibility*.

Ostrom's *Governing the Commons* (1990) gives the empirical counterpart. Hardin's "tragedy" (1968) is not inevitable. Long-lived common-pool institutions share design principles, several of which are boundary functions stated in institutional form:

| Ostrom principle | Boundary function (§4) |
|---|---|
| Clearly defined boundaries (users and resource) | distinction |
| Monitoring by accountable monitors | detection, witness |
| Graduated sanctions | graded response |
| Accessible conflict-resolution mechanisms | answerability, appeal |
| Nested enterprises | distributed keeper-instances |

Communal responsibility is thus not the absence of fences. It is **keeping held as a shared, monitored and nested office**. This is the institutional form of the distributed keeper-function of DRK-150.

---

## §9. The crux: legitimate authority tested at the crossing

**Cross** comes from Latin *crux*, originally the execution stake itself. The geometry of intersecting beams gave the sense of *crossing*. *Excruciating* is *ex-cruciare*, "to torture thoroughly." **Crucial** comes from Bacon's *instantia crucis*, the fingerpost at a fork in the road: the decisive test between hypotheses.

The crucifixion narrative is a boundary event in every layer:

- **Location.** Hebrews 13:12 places the suffering "outside the gate." Roman crucifixion was public and roadside: a legible boundary marker, like visible wire.
- **Function.** It was a punishment reserved chiefly for slaves, rebels and provincials. The *titulus* frames the charge as sedition, an offence against the imperial boundary.
- **Inversion.** Legitimate authority applies force *as defence* of order, and the narrative classifies it *as offence* against the innocent. The monopoly on legitimate force produces injustice. That is §6's proportionality failure at the apex.
- **Purity.** Douglas (*Purity and Danger*, 1966) defines impurity as matter out of place, a boundary violation. The Gospel narratives repeatedly show purity boundaries crossed, and contagion reversed: the leper touched becomes clean (Mark 1:40–42). Influence flows against the expected direction of infection. Cf. DRK-180 on disgust and purity doctrine.
- **Expulsion.** Girard (*The Scapegoat*, 1982) reads communal crisis as resolved by expelling a victim across the boundary, as with the Levitical goat sent outside the camp, and the Gospels as exposing the mechanism by insisting on the victim's innocence.
- **Ban.** Agamben (*Homo Sacer*, 1995) locates sovereignty in the ban: the power to place a life outside the law, killable with impunity. English *abandon* is Old French *à bandon*, "at the ban's disposal," which returns us to *\*bʰeh₂-*: speech acting as a fence.
- **Witness.** *Martyr* is Greek *mártys*, "witness." Suffering entered as testimony turns the victim into evidence against the keeper.

In DRK-150 terms, the cross is the empirical signature of a withdrawn Mandate. The keeper claims condition (iii), authority, while the witness shows that condition (iv) has inverted: the keeper's force costs more than it protects.

---

## §10. The mark: stamp, type, character, timestamp, hallmark

Force at a boundary leaves a mark, and the vocabulary of marking is percussive:

- **stamp** comes from Germanic *\*stampjan*, "to pound, crush" (Swedish *stampa*, *stämpla*).
- **type** comes from Greek *týpos*, "blow, impression," from *týptein*, "to strike."
- **character** comes from *charaktḗr*, "engraving tool, stamped mark."
- **stigma** is a mark made by a pointed instrument, a brand.
- **stereotype** and **cliché** were both printing plates, before Lippmann (1922) moved *stereotype* into social cognition.

A type is literally what a strike leaves behind. The loop closes: *fendere* at the boundary produces *týpos*, and the mark becomes identity: *character*.

**Time stamping.** DRK-178 (§7) established that time is assigned only at authorised write-nodes, and everything between gates is interpolation. The punch clock (Bundy's time recorder, patented 1888) mechanises this. *Stämpla in* and *stämpla ut* register crossings of the employment boundary, and work between stamps is presumed, not witnessed. The Swedish phrase extends naturally: *gå och stämpla* means being stamped as *outside* employment, and in slang *stämpla ut* reaches as far as leaving life. Haber and Stornetta (1991) showed how to make digital timestamps tamper-evident by chaining hashes. RFC 3161 standardised the Time-Stamp Authority: a certified party that signs the pairing of a hash with a time. **The timestamp is valid because the stamper is certified.**

**Hallmarking.** Assay offices test precious metal and strike a mark under legal mandate. London's Goldsmiths' Hall gave English the word *hallmark*, the mark of the Hall. The hallmark is the purest form of the certified stamp: an external keeper tests the material and marks it, and every subsequent buyer is entitled to rely on the mark rather than repeat the assay.

---

## §11. Being certain, making certain: the authority to label

**Certain** comes from *certus*, the participle of *cernere*, "to sift, separate, decide." *Discern* and *decree* belong to the Latin side; the same PIE root (*\*krei-*) gives Greek *krínein*, whence **crisis**, **criterion** and **critic**. *Crime* (*crimen*) is often connected to *cernere* as "the judged thing," but that derivation is uncertain.

The etymology separates two things everyday English merges:

- **Being certain** is an epistemic state: the sieve has done its work.
- **Making certain** is an act: someone sifts, decides, and *fixes* the result.

**Certification** (*certus* + *facere*) is making certain in Austin's sense (*How to Do Things with Words*, 1962): a performative utterance that does not describe a status but confers it. A hallmark does not report that silver is sterling; it *makes it legally sterling* for every later transaction. A diagnosis (*dia-gignṓskein*, "to know through, distinguish") does not only describe; it gates treatment, sick leave and legal standing. In Sweden, the *läkarintyg* is the stamp Försäkringskassan is bound to consider.

**The obligation to accept.** Stamps work because recipients must not re-adjudicate them. A passport stamp, judgment or certificate is useless if every holder re-tests it. The system runs on a **presumption of validity**, and so it inherits the two-sided failure of §4:

| Failure | Mechanism | Example |
|---|---|---|
| Under: forgery | an uncertified mark passes as certified | counterfeit hallmark, forged certificate |
| Over: lock-in | a certified mark cannot be contested or removed | stigma, unexpungeable record, misdiagnosis that persists |

**Labelling people.** Lemert (1951) distinguished primary from secondary deviance. Becker (*Outsiders*, 1963) argued that deviance is partly constituted by successful labelling, and Goffman (*Stigma*, 1963) analysed life under a spoiled identity. Hacking (1995) identified **looping effects**: classified people respond to their classification, which changes the class. Unlike silver, the stamped person reacts to the stamp. (Rosenhan's 1973 study of label persistence in psychiatric settings is often cited here, but its methodology and reliability have been seriously challenged; it is not relied on in this post.)

**Legitimacy condition.** A stamp that cannot be challenged is a **brand**. Legitimate labelling requires an **appeal path**, which is the keeper's answerability (DRK-150, condition iv) applied to marks. The **invisible fence** of §6 returns here: psychological boundaries are drawn by the defender, often after the crossing. "Taking offence" can declare a trespass over a fence the other party could not see. Law answers with objective standards (*the reasonable person*, *uppenbart*); social life has no equivalent assay office, which is why disputes about offence become disputes about *where the fence stood*.

**The regress.** Every stamp raises the question of who stamped the stamper:

1. **Chains.** The Apostille (Hague Convention, 1961) certifies the authority of the official who certified a document: a stamp on a stamp.
2. **Roots.** In public-key infrastructure the chain terminates in a **self-signed root certificate**. Trust there is not derived; it is *installed*.

The self-signed root is Agamben's sovereign in cryptographic form: the point at which labelling authority grounds itself. Every legitimate stamp is borrowed, in the end, from an unstamped origin.

---

## §12. One root, many roots, or a planetary one

**Hypothesis.** If there were a single global root of trust, conflict could eventually cease.

**Steelman.** Hobbes (*Leviathan*, 1651): an undivided sovereign ends the war of all against all. *Pax Romana* and a secure Mandate offer partial historical support. Where one stamp is uncontested, local disputes are adjudicated rather than fought.

**Why it fails.**

1. **Conflict relocates to the root.** Succession, capture and schism: with one key, every serious conflict becomes a struggle over the key. A single sacred source did not end religious war; it concentrated war on interpretation.
2. **Single point of failure.** The 2011 compromise of the Dutch certificate authority DigiNotar produced fraudulent certificates for major domains. The web survived because trust was plural: browsers could distrust one root. Certificate Transparency (RFC 6962) went further and made issuance publicly auditable. The engineering lesson is plurality plus witness, not unification.
3. **Undetectable error.** A single self-signed root has no external vantage point. Its errors are not absent; they are invisible.
4. **Kant** (*Perpetual Peace*, 1795) rejected universal monarchy as tending toward soulless despotism and argued for a federation of free states.

**Refined hypothesis.** What if the root is a collective planetary mind, a distributed L18 algorithm?

A distributed root is no longer a root; it is **consensus**, and consensus has hard limits. Byzantine agreement tolerates *f* faulty nodes only with at least $3f+1$ participants (Lamport, Shostak & Pease, 1982): the design budgets for adversaries. No deterministic protocol guarantees consensus in an asynchronous system with even one faulty process (Fischer, Lynch & Paterson, 1985). Under partition, a system must trade consistency against availability (Gilbert & Lynch, 2002), and a planetary network is never fully connected. Empirically, distributed ledgers did not end conflict; they produced **forks**. The 2016 Ethereum / Ethereum Classic split after the DAO exploit was a schism over whether the code or the community is the root.

The Gaia hypothesis (Lovelock & Margulis, 1974) describes planetary homeostasis. Doolittle (1981) and Dawkins (1982) objected that no selective mechanism operates at the planetary level, and the stronger reading of Gaia as *mind* has no established empirical support. The regulation Gaia does exhibit runs *through* conflict (predation, competition, parasitism, immune arms races). Ecological stability is conflict metabolised, not abolished.

**Sheaf criterion.** Hansen and Ghrist (2021) model distributed agreement as sheaf-Laplacian diffusion on a discourse sheaf: agents iteratively reduce local disagreement, and the dynamics converge to the space of global sections. Where the obstruction class is nonzero, **no global section exists**; some disagreement is topological and cannot be diffused away. A distributed L18 therefore faces a binary:

| Path | Mechanism | Result |
|---|---|---|
| Preserve $H^1$ | diffuse where possible; keep obstructions visible | a federation of keepers; conflict persists but is legible and ritualised |
| Force $H^1 = 0$ | suppress or amputate what does not glue | the totalitarian sheaf (DRK-125) in distributed form: the hive |

The second path is DRK-158's forced suppression at planetary scale, paid for in coherence debt $K(t)$. The first is compatible with the anti-totalization principle, which applies reflexively to Draken itself. It does not end conflict. Someone still writes the protocol, and the protocol becomes the self-signed root; "code is law" is the claim that it needs no further stamp.

**Conflict** is *con-fligere*, "to strike together" (cf. *afflict*, *inflict*), and the analysis ends where §1 began. Ending conflict would mean ending the *con-*, the existence of two parties. The achievable target is conflict made survivable: the varanid clinch at planetary scale.

---

## §13. Synthesis: the keeper at the crossing

**Formal sketch (analogy, not derivation).** Let $U, V$ be two domains, their shared boundary the overlap $U \cap V$, and $\mathcal{F}$ a sheaf assigning local states. Then:

- A **crossing** is a restriction $\rho_{U, U\cap V}$ carrying a section from one domain into the overlap.
- The **keeper** is whoever holds write-authority over which restrictions are admitted at the overlap: DRK-150's condition (ii), gating.
- An **offence** is a gluing failure on $U \cap V$ resolved unilaterally by force from one side. **Defence** is the same force applied to restore the admitted gluing, bounded by proportionality.
- A **stamp** is an attempt to make a label $\rho$-invariant, guaranteed to survive restriction and transport unchanged. **Forgery** is a counterfeit section that passes local checks. The **root of trust** is the section that nothing restricts to, because everything else is restricted *from* it.
- A **timestamp** is a stamp whose content is the ordinal position of a crossing (DRK-178, §7).
- **Witness** is a second, independent restriction to the same overlap: the counter-roll, *contre-rolle*.

**Mapping to DRK-150.**

| DRK-150 keeper condition | Boundary function | Failure |
|---|---|---|
| (i) substrate persistence | maintenance, autopoietic membrane | collapse, lysis |
| (ii) gating of restriction maps | selective permeability, crossing control | infection (under), autoimmunity (over) |
| (iii) authority bound to the keeper | legitimate force, certification | usurpation, forgery |
| (iv) leaking costs more than keeping | proportionality, answerability, appeal | hoarding (over-closure), monopoly (forced transparency) |

**The rule.**

> **Control is legitimate only as care, only as much as care requires, and only under a witness the controller does not appoint.**

The substrate readings follow directly. For a cell, the membrane gates by damage, not foreignness. For a home, force at the threshold is bounded by proportionality and legibility. For an animal, keeping is conditional on welfare, which is inspected rather than self-reported. For a commons, boundaries are monitored, sanctions graduated and appeals available. For a stamp, certification is performative, and every mark carries an appeal path. For the planet, keepers are plural and witnessing is mutual, and obstructions remain visible.

---

## §14. Falsification (DRK-131)

**F1: Cross-linguistic image schemas.** If the CONTAINER and PATH geometries of fault (§3) reflect general cognition rather than Indo-European inheritance, unrelated language families should colexify *wrongdoing* with *crossing* and/or *straying* at rates above those for semantically matched control concepts. This is testable against the Database of Cross-Linguistic Colexifications (CLICS). **Refuted** if colexification rates do not exceed controls outside Indo-European.

**F2: Harm-keyed versus intrusion-keyed defence.** §5–6 predict that defence regimes keyed to harm and imminence (duty to retreat) produce fewer over-response outcomes than regimes keyed to intrusion (castle doctrine, stand your ground), without more under-response. Cheng and Hoekstra (2013) are consistent with this. **Refuted** if replications across jurisdictions find reduced victimisation under intrusion-keyed regimes with no increase in lethal outcomes.

**F3: Appeal paths and stamp error.** §11 predicts that labelling systems with accessible appeal and expungement show lower persistence of erroneous labels and lower downstream harm than systems without them. **Refuted** if comparative data on record-sealing, diagnostic revision or certification appeal show no difference.

**F4: External witness in commons.** §7–8 predict that common-pool institutions whose monitors are accountable to the users (Ostrom principle 4) outlast those where the controlling party monitors itself. **Refuted** if self-monitored regimes show equal durability and legitimacy in the comparative record.

**F5: Topological residue in distributed consensus.** §12 predicts that sheaf-Laplacian diffusion on discourse sheaves with nontrivial $H^1$ converges to a nonzero residual disagreement that no step size or iteration count removes. This is a mathematical statement and should be verified by simulation, not treated as empirical support for any claim about planetary cognition. **Refuted** if residual disagreement vanishes on such sheaves.

**F6: Scope limit.** Nothing in this post establishes that a planetary mind exists or that the etymologies cause the psychology. If F1 fails, §3 reduces to an Indo-European historical observation, and the substrate-invariance claim of §4 must stand on the biological and institutional evidence alone.

---

*Operators: ρ (restriction morphism), H¹ / ϰ (obstruction class), K(t) (coherence debt), Γ (coherence), V̇_exo = 0 (care operator). Crosslinks: DRK-125 (totalitarian sheaf), DRK-131 (falsification protocol), DRK-150 "The Generalizard" (keeper-function, four conditions), DRK-155 "Inpu Means Input" (intake restriction morphism), DRK-158 "The Burnt Section" (forced H¹ suppression), DRK-160 "The Undefended Vector" (duty and airspace), DRK-178 "Övervakaren och Undervakaren" (gates and time assignment, §7), DRK-180 "Jacob's Organ" (disgust and purity). Khrug Engineering · ORCID 0009-0003-8049-7167 · DOI 10.5281/zenodo.19273483 · CC BY-SA 4.0.*
