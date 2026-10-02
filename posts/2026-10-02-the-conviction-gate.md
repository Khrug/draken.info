---
title: "The Conviction Gate: How a Pattern Becomes a Belief That Acts"
drk: DRK-194
date: 2026-10-02
tags: [conviction, psychosis, delusion, religion, salience, predictive-processing, hubris, revolution, history]
layers: [L08, L09, L10, L11, L14]
coherence: 0.76
description: "How conviction forms: salience, the explanation that brings relief, religious versus psychotic belief, and the gate where belief turns into action."
excerpt: "A conviction forms when an explanation ends an unbearable state of meaning without object. Religious, psychotic and revolutionary belief share that mechanism; they differ in who shares it and whether it stays revisable."
status: published
author: Khrug Engineering
license: CC BY-SA 4.0
sources:
  - "American Psychiatric Association (2013). *Diagnostic and Statistical Manual of Mental Disorders*, 5th edition (DSM-5). American Psychiatric Publishing."
  - "D'Orsi, G. & Tinuper, P. (2006). \"I heard voices...\": from semiology, a historical review, and a new hypothesis on the presumed epilepsy of Joan of Arc. *Epilepsy & Behavior* 9, 152–157. [doi:10.1016/j.yebeh.2006.04.020](https://doi.org/10.1016/j.yebeh.2006.04.020)"
  - "Festinger, L., Riecken, H. W. & Schachter, S. (1956). *When Prophecy Fails*. University of Minnesota Press."
  - "Fletcher, P. C. & Frith, C. D. (2009). Perceiving is believing: a Bayesian approach to explaining the positive symptoms of schizophrenia. *Nature Reviews Neuroscience* 10, 48–58. [doi:10.1038/nrn2536](https://doi.org/10.1038/nrn2536)"
  - "Hoffer, E. (1951). *The True Believer: Thoughts on the Nature of Mass Movements*. Harper & Brothers."
  - "Jaspers, K. (1913). *Allgemeine Psychopathologie*. Springer, Berlin."
  - "Kapur, S. (2003). Psychosis as a state of aberrant salience: a framework linking biology, phenomenology, and pharmacology in schizophrenia. *American Journal of Psychiatry* 160, 13–23. [doi:10.1176/appi.ajp.160.1.13](https://doi.org/10.1176/appi.ajp.160.1.13)"
  - "Owen, D. & Davidson, J. (2009). Hubris syndrome: an acquired personality disorder? A study of US Presidents and UK Prime Ministers over the last 100 years. *Brain* 132, 1396–1406. [doi:10.1093/brain/awp008](https://doi.org/10.1093/brain/awp008)"
  - "Pierre, J. M. (2001). Faith or delusion? At the crossroads of religion and psychosis. *Journal of Psychiatric Practice* 7, 163–172. [doi:10.1097/00131746-200105000-00004](https://doi.org/10.1097/00131746-200105000-00004)"
---

## §0 Sammanfattning

*Det som känns som insikt är ibland bara en lättnad.*

A conviction forms when an explanation ends a state of heightened meaning that has no object; the relief of the explanation is felt as insight, and once accepted it is protected against revision **[S]**. Religious, psychotic and revolutionary convictions share this formation; they differ less in content than in whether a community shares and scaffolds them, whether they remain revisable, and what they license **[D]**. The decisive step for harm is not the belief but the **conviction gate**, the point where a belief is allowed to command action **[D]**. The post does not diagnose any historical person, does not equate religious faith with illness, and does not claim the mechanism is the whole story of any case **[D]**. Its companion, [The Weaponised Conviction](/posts/the-weaponised-conviction/) (DRK-195), follows what happens when someone else's hand is on the gate.

**Epistemic ledger.** Every substantive claim carries one tag:

| Tag | Meaning |
|---|---|
| **[E]** | Established: textbook consensus, a proved theorem, direct measurement, or a standard etymology (SAOB, Hellquist, OED, etymonline) |
| **[S]** | Supported: leading model or majority scholarly reading, strong but incomplete evidence |
| **[H]** | Hypothesis: open, contested, or without decisive evidence |
| **[D]** | Draken synthesis: structural claim made by this corpus, submitted for Clinch review |
| **[M]** | Metaphor or paronomasia: a pointer, not a referent or root (per [The Pendragon Source](/posts/the-pendragon-source/), DRK-165) |

---

## §1 Meaning without object

Jaspers described the *Wahnstimmung*, the delusional mood that often precedes a fixed delusion: the world feels altered and charged with significance, but the significance has not yet found its object (Jaspers 1913) **[E]**. Kapur proposed a neurochemical reading of that state: dysregulated dopamine signalling assigns motivational salience to stimuli that do not warrant it, so ordinary things stand out as meaningful (Kapur 2003) **[S]**. In his account delusions are the person's cognitive effort to make sense of those aberrantly salient experiences, and hallucinations are the direct experience of aberrant salience in internal representations (Kapur 2003) **[S]**.

Fletcher & Frith (2009) give the complementary computational account: in a hierarchical Bayesian brain, a disturbance in how prediction errors are weighted produces persistent unexplained errors, and new beliefs are formed to explain them away **[S]**. One disturbance can then account for both false perceptions and false beliefs, without a separate defect for each (Fletcher & Frith 2009) **[S]**.

Put together, the sequence is: salience without object, mounting unexplained error, an explanation that suddenly makes the noise cohere, and relief **[S]**. That relief is why delusional explanations feel like revelation rather than guesswork **[S]**. The corpus has met this structure before as relevance realisation ([Relevance as Collapse](/posts/relevance-as-collapse/), DRK-169) and as abduction under pressure ([The Guessed Section](/posts/the-guessed-section/), DRK-170); here the abduction is forced, and the guessed section is accepted because it ends the pressure, not because it fits the evidence best **[D]**.

---

## §2 Formal sketch: precision and the gate (analogy, not derivation)

Let $H$ be a hypothesis and $D$ the data. Bayes' rule in odds form is

$$\frac{P(H \mid D)}{P(\neg H \mid D)} = \frac{P(D \mid H)}{P(D \mid \neg H)} \cdot \frac{P(H)}{P(\neg H)},$$

posterior odds equal the likelihood ratio times the prior odds **[E]**. In predictive-processing models, how far a belief moves depends on the relative **precision** (inverse variance) assigned to prediction errors and to prior beliefs (Fletcher & Frith 2009) **[S]**.

Two failures of precision make the sequence of §1 **[D]**. First, prediction errors are given too much precision, so noise demands explanation; this is the *Wahnstimmung*. Second, once an explanation $H^*$ is adopted, its prior is given so much precision that contrary data are absorbed as further confirmation or dismissed. The second step is the lock **[D]**.

Now add action. Let $c = P(H^* \mid D)$ be subjective certainty, $V$ the value the person attaches to acting if $H^*$ is true, and $\theta$ a threshold set by costs, norms and other people. An act is taken when

$$c \cdot V > \theta .$$

The **conviction gate** (proposed corpus term) is this inequality: the point where a belief is allowed to command action, governed by certainty, by the value attached to the act, and by the threshold that others and one's own norms impose **[D]**. A gate can fail in three ways: $c$ locked near 1 regardless of evidence, $V$ inflated by a cause or a sense of mission, or $\theta$ lowered by isolation or by a group that rewards the act **[D]**. The [Earth Engine](/posts/the-earth-engine/) (DRK-193) argued that most system failures are gate failures; this is the gate at the scale of one mind **[D]**.

---

## §3 Religious belief and psychotic belief

DSM-5 defines a delusion as a fixed belief not amenable to change in light of conflicting evidence, and excludes beliefs that are ordinarily accepted by other members of the person's culture or subculture, including religious ones (American Psychiatric Association 2013) **[E]**. The distinction is therefore social and functional, not a judgement about the content's truth **[E]**.

Pierre reviewed the clinical problem and argued that content alone cannot separate religious belief from religious delusion; clinicians weigh how the belief is held, whether it is shared, how it arose, and its consequences for the person's functioning (Pierre 2001) **[S]**. Religious themes are also common in psychotic delusions, which shows that the culture supplies the material the mechanism works with (Pierre 2001) **[S]**.

Festinger and colleagues studied a group whose leader had prophesied a flood on a specific date; when the prophecy failed, committed members proselytised more, not less (Festinger et al. 1956) **[S]**. That is the lock of §2 at group scale: disconfirmation, when the commitment is high and the group supports it, strengthens rather than weakens the belief **[D]**.

So the line the post draws is not between true and false beliefs, or between sacred and profane ones **[D]**. It runs between beliefs that stay embedded in a community able to correct them and remain revisable, and beliefs that have escaped both **[D]**. In the corpus's language, a religious conviction held in a living tradition is a local section that still glues to its neighbours; a delusion is a section forced over noise that refuses every restriction map **[D]**.

---

## §4 Jeanne d'Arc: one case, several readings

Jeanne d'Arc reported hearing voices from about the age of thirteen, which she identified as saints; she led the French relief of Orléans in 1429, was tried and burned at Rouen in 1431, rehabilitated by a second process in 1456 and canonised in 1920 **[E]**. Her own testimony at trial is the main source for the voices, often accompanied by light, and is reviewed by D'Orsi & Tinuper (2006) **[E]**.

Retrospective medical readings of her voices have been many; D'Orsi & Tinuper proposed idiopathic partial epilepsy with auditory features as one hypothesis (D'Orsi & Tinuper 2006) **[H]**. Psychiatric readings have also been offered and contested, and any diagnosis across six centuries rests on testimony recorded by her enemies and later by her rehabilitators **[H]**.

What the case shows does not depend on a diagnosis **[D]**. Her conviction was scaffolded by a culture in which saints spoke, by a political crisis that wanted a sign, and by people who decided to act on her word **[D]**. By the test of §3 her belief was shared and socially embedded, which is why her own time could read it as either sanctity or heresy but not as illness **[D]**. The same experience with the same content, in a culture without that scaffold, would have met a different gate **[D]**. The corpus's earlier reading of meaningful coincidence without a channel ([The Common Base](/posts/the-common-base/), DRK-177) applies here: what one culture registers as a sign, another registers as noise, and the gate is set by the culture, not the signal **[D]**.

---

## §5 Grandiosity, hubris and the hunger for power

Grandiosity, the conviction of special identity, mission or power, is among the classic themes of delusion, and in mania it can drive action at speed **[E]**. Power can produce a related pattern without any psychosis. Owen & Davidson proposed "hubris syndrome", an acquired pattern seen in some heads of government after holding power, marked by excessive self-confidence, contempt for others' advice, loss of contact with reality and impetuous action, which tends to abate once power is lost (Owen & Davidson 2009) **[H]**.

In §2's terms, hubris raises $V$ (the stakes of my judgement are historic) and lowers $\theta$ (no one around me sets the threshold), while $c$ is protected by an entourage that filters disconfirmation **[D]**. Delusional grandiosity reaches a similar gate state from inside; hubris reaches it from the outside, through position **[D]**. Both look like conviction, and both are dangerous for the same structural reason: the gate is open and no one else can close it **[D]**.

---

## §6 Revolutionary conviction and the call to action

Hoffer argued that mass movements draw especially on the frustrated, and that the true believer finds in a cause a substitute for a self he has come to reject (Hoffer 1951) **[H]**. Whatever the merit of the generalisation, it describes a mechanism worth testing: when the self has lost value, $V$ can be relocated into a cause, and the cause then supplies certainty, purpose and permission at once **[D]**.

Revolutionary conviction is not a pathology **[D]**. Abolitionists, resistance movements and reformers acted on convictions that their societies first treated as dangerous **[D]**. The question this post asks is not whether a conviction is extreme but whether its gate is still working: whether it is revisable, whether it is held within a community that can say no, and whether it recognises a threshold that it does not set for itself **[D]**. A call to action is a deliberate attempt to move someone else's $\theta$; that is ordinary politics when the gate stays the listener's own, and the subject of [The Weaponised Conviction](/posts/the-weaponised-conviction/) (DRK-195) when it does not **[D]**.

---

## §7 Integration

The difference between meaning-making and the flip lies in the gate, not in the content **[D]**. That has a practical side. For anyone who has once crossed the gate, the content of the old conviction can be studied as structure, as material that once explained an unbearable state, without restoring its authority; and the corpus's ledger, which keeps every metaphor labelled as metaphor and every claim revisable, is the same discipline written into a method ([The Borrowed Interior](/posts/the-borrowed-interior/), DRK-173) **[D]**. This post does not replace treatment; psychological therapies for psychosis exist and work with exactly this material **[D]**.

---

## §8 Falsification (DRK-131)

**F1: Relief precedes lock.** §1–§2 claim that delusional explanations are adopted because they end a state of unexplained salience. **Refuted** if prospective studies of first-episode psychosis find that fixed delusional beliefs regularly form without a preceding period of heightened, objectless salience or mood change.

**F2: Social embedding, not content.** §3 claims that what separates religious from psychotic conviction is embedding and revisability, not content. **Refuted** if, in matched samples, belief content alone predicts clinical outcome and functioning as well as measures of community support and belief flexibility do.

**F3: Gate, not belief.** §2 and §6 claim that action follows from the gate variables (certainty, value, threshold), not from belief strength alone. **Refuted** if, among people holding equally strong convictions, measures of perceived stakes and social threshold add nothing to the prediction of who acts.

**F4: Scope limit.** No historical diagnosis is made; the Jeanne d'Arc section concerns how her conviction was scaffolded, not what caused her voices. The formal sketch is decision-theoretic shorthand, not a clinical model. If F1–F3 fail, §3's DSM-based distinction stands as established and the gate reading is withdrawn as a predictive claim.

---

## §9 Provenance and leaks

1. Authorship: Khrug supplied the topic list (conviction forming, Jeanne d'Arc, religious and psychotic delusion, grandiosity, megalomania, revolutionary drive, the call to action) and the question of how the flip into a conviction that acts can happen. Claude (Opus 5.5) drafted the post, the formal sketch, the term **conviction gate** and the falsifiers. No Clinch review yet.
2. Books (Jaspers 1913, Hoffer 1951, Festinger et al. 1956, DSM-5) are cited from their standard editions; page numbers and the exact DSM-5 wording were not checked for this post, and the DSM-5 definition is paraphrased.
3. The Jeanne d'Arc facts are textbook chronology; the trial records were not consulted directly, only through the review by D'Orsi & Tinuper.
4. Hubris syndrome is a proposal, not a recognised diagnosis, and is tagged [H].
5. New term **conviction gate** (§2) to be added to `static/data/ko.json` as `proposed`, with the §2 definition as its verbatim defining sentence.

---

## References

- American Psychiatric Association (2013). *Diagnostic and Statistical Manual of Mental Disorders*, 5th edition (DSM-5). American Psychiatric Publishing.
- D'Orsi, G. & Tinuper, P. (2006). "I heard voices...": from semiology, a historical review, and a new hypothesis on the presumed epilepsy of Joan of Arc. *Epilepsy & Behavior* 9, 152–157. [doi:10.1016/j.yebeh.2006.04.020](https://doi.org/10.1016/j.yebeh.2006.04.020)
- Festinger, L., Riecken, H. W. & Schachter, S. (1956). *When Prophecy Fails*. University of Minnesota Press.
- Fletcher, P. C. & Frith, C. D. (2009). Perceiving is believing: a Bayesian approach to explaining the positive symptoms of schizophrenia. *Nature Reviews Neuroscience* 10, 48–58. [doi:10.1038/nrn2536](https://doi.org/10.1038/nrn2536)
- Hoffer, E. (1951). *The True Believer: Thoughts on the Nature of Mass Movements*. Harper & Brothers.
- Jaspers, K. (1913). *Allgemeine Psychopathologie*. Springer, Berlin.
- Kapur, S. (2003). Psychosis as a state of aberrant salience: a framework linking biology, phenomenology, and pharmacology in schizophrenia. *American Journal of Psychiatry* 160, 13–23. [doi:10.1176/appi.ajp.160.1.13](https://doi.org/10.1176/appi.ajp.160.1.13)
- Owen, D. & Davidson, J. (2009). Hubris syndrome: an acquired personality disorder? A study of US Presidents and UK Prime Ministers over the last 100 years. *Brain* 132, 1396–1406. [doi:10.1093/brain/awp008](https://doi.org/10.1093/brain/awp008)
- Pierre, J. M. (2001). Faith or delusion? At the crossroads of religion and psychosis. *Journal of Psychiatric Practice* 7, 163–172. [doi:10.1097/00131746-200105000-00004](https://doi.org/10.1097/00131746-200105000-00004)

---

*Operators: $c$ · $V$ · $\theta$ · Crosslinks: [The Pendragon Source](/posts/the-pendragon-source/) (DRK-165) · [The Weaponised Conviction](/posts/the-weaponised-conviction/) (DRK-195) · [Relevance as Collapse](/posts/relevance-as-collapse/) (DRK-169) · [The Guessed Section](/posts/the-guessed-section/) (DRK-170) · [The Earth Engine](/posts/the-earth-engine/) (DRK-193) · [The Common Base](/posts/the-common-base/) (DRK-177) · [The Borrowed Interior](/posts/the-borrowed-interior/) (DRK-173)*

*Övertygelsen är en grind, inte en sanning.*

*Khrug Engineering · Göteborg · ORCID 0009-0003-8049-7167 · DOI 10.5281/zenodo.19273483 · CC BY-SA 4.0*
