# DRK-201 pilot: does the Draken Sheaf Analyzer detect contradiction?

Frozen before any perturbed text was analyzed. Date: 2026-10-10.

## Object under test
The live Sheaf Analyzer at draken.info/sheaf-analyzer, code taken unmodified from
github.com/Khrug/draken.info, static/pages/sheaf-analyzer.html (sections LEXICON, TOKENIZER, METRICS),
executed headless in Node. Outputs: Γ (gamma), Ψ (psi), K(t) (kt), severed-edge count.

## Corpus
All posts in `posts/*.md` whose body is English (88 of 90), front matter stripped, Markdown syntax kept as-is.
A post enters a condition only if it has an eligible sentence for that condition.

## Conditions (seed 201, one perturbation per post per condition)
Eligible sentence: 8–40 words. Chosen uniformly at random among eligible sentences.
- **DUP** (control): the chosen sentence is repeated immediately after itself, unchanged.
- **NUM** (factual contradiction): same as DUP, but every number in the duplicate is changed (n -> n+7).
  Only sentences containing a digit are eligible.
- **NEG** (logical contradiction): same as DUP, but the duplicate is negated: "not" inserted after the first
  of is/are/was/were/has/have/had/can/does/do/will; if none, prefixed with "It is not the case that ".
- **TOPIC** (topical incoherence): 25% of sentences replaced, at random positions, by random sentences
  from a different randomly chosen post.
- **SHUFFLE** (structural incoherence): sentence order randomly permuted.

## Hypotheses and decision rules
- **H1 (contradiction detection):** Γ is lower and K(t) higher in NUM and in NEG than in DUP for the same post.
  Test: Wilcoxon signed-rank, two-sided, α = 0.05, on paired differences metric(cond) − metric(DUP).
  H1 is supported for a condition only if the test is significant AND the median difference has the predicted sign.
- **H2 (topical coherence):** Γ differs between TOPIC and original. Same test.
- **H3 (order sensitivity):** Γ differs between SHUFFLE and original. Same test.
- Effect sizes are reported relative to the between-post SD of the metric on the original texts.

## Baseline
A generic near-duplicate conflict check: flag a text if two sentences have word-Jaccard ≥ 0.6 and differ
in their numbers or in the presence of a negation word (not/no/never). Reported as detection rate per condition.
It is not Draken-specific and is expected to favour these synthetic injections; it shows the contradictions are
detectable from the text, not that it is a strong detector in general.

## Predictions written in advance (from reading the analyzer code)
- NUM: no effect on Γ, K(t), severed. The tokenizer removes digits, so the duplicate is identical to DUP.
- NEG: negligible effect. "not" is a stopword.
- SHUFFLE: zero effect on Γ and K(t). Edges come from within-sentence co-occurrence, which is order-invariant.
- TOPIC: an effect is possible; direction not predicted.

## What each outcome would mean
- H1 rejected: the analyzer's Γ does not measure propositional consistency; claims that it detects
  contradictions or "failed gluing" of claims are not supported. It may still measure something else (H2).
- H1 supported: first evidence that the analyzer responds to contradictions.
Either outcome is reported. No metric, threshold or condition is changed after results are seen; any change
is a new, labelled version.
