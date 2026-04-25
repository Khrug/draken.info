# Draken Analyzer v2 — Prompt Versioning & Source

**Status:** Implementation-ready · drop-in for `worker/src/llm/`
**Version:** v2.0.0
**Companion to:** `draken-analyzer-v2-spec.md` §3, §5.3, §5.5

---

## 0. Why this document exists

Prompts are the load-bearing structure of every LLM-driven analysis step in v2. They are not configuration — they are *executable specifications of cognitive operations*, and they degrade silently if not versioned. A prompt that worked yesterday on Sonnet 4.5 may produce subtly different outputs on Sonnet 4.6, or after a temperature shift, or after a tokenizer change upstream. Without explicit versioning + cache invalidation + regression testing against fixed fixtures, the analyzer drifts and there is no mechanism to detect that drift.

This document specifies:

1. The **versioning discipline** — how prompts evolve, when versions bump, what cache behavior follows.
2. The **six production prompts** — full source, system/user split, output schemas, anti-patterns, calibration notes, few-shot examples where they earn their tokens.
3. The **TypeScript registry module** — drop-in replacement for `worker/src/llm/prompts.ts`.
4. The **regression fixture protocol** — golden inputs and golden outputs that lock prompt behavior.
5. The **CHANGELOG template** — every change traceable.

---

## 1. Versioning philosophy

### 1.1 Semantic versioning, applied to prompts

Each prompt has a string version of the form `MAJOR.MINOR.PATCH`. Bump rules:

| Change | Bump | Cache behavior | Regression test required |
|---|---|---|---|
| Typo, whitespace, formatting | PATCH | Invalidate cache for this prompt | Spot-check 3 fixtures |
| New example added, clarification | MINOR | Invalidate cache | Full fixture suite, expect ≥95% identical |
| Output schema change, new field | MAJOR | Invalidate cache | Full fixture suite, expect drift; update goldens |
| Inference-type taxonomy change | MAJOR | Invalidate cache | Full re-calibration |
| Model swap (Sonnet → Opus) | MINOR on prompt, but track separately | Invalidate cache, key on model_id | Full fixture suite |

The cache key in `worker/src/cache/kv.ts` is:

```
sha256( input_text + prompt_name + prompt_version + model_id + temperature )
```

Versions are **never reused**. v1.2.0 is gone; if you regret a change, bump to v1.2.1, do not re-publish v1.2.0.

### 1.2 The four prompt design rules

1. **One job per prompt.** Don't ask for claims, modalities, and inferences in one call. Three smaller prompts compose better, cache better, and fail more legibly. The single counterexample is when two outputs are *intrinsically coupled* (extracting a citation requires knowing its anchor claim) — there, fuse.

2. **Explicit anti-patterns.** Every prompt names what NOT to do. LLMs over-comply with positive instructions and ignore implicit negatives unless the negatives are stated as imperatives. *"Do NOT invent inferences the text does not make."* in the prompt body, not in a footnote.

3. **Strict JSON output, validated downstream.** No prose preambles. No markdown fences. The response IS the JSON. Validation happens in `parse-json.ts` with one auto-repair retry on schema failure.

4. **Few-shot only where the cost earns it.** Examples bloat the cache key and the input token bill. Only `detect_enthymeme` and `classify_citation` ship with examples in v2.0.0 because the failure modes there are subtle. The other four prompts succeed on description alone.

### 1.3 Temperature, tokens, model

| Prompt | Model | Temp | Max tokens |
|---|---|---|---|
| `extract_claims` | claude-sonnet-4-6 | 0.0 | 4096 |
| `classify_modality` | claude-sonnet-4-6 | 0.0 | 2048 |
| `extract_inferences` | claude-sonnet-4-6 | 0.1 | 4096 |
| `detect_enthymeme` | claude-sonnet-4-6 | 0.2 | 1024 |
| `extract_citations` | claude-sonnet-4-6 | 0.0 | 2048 |
| `classify_citation` | claude-sonnet-4-6 | 0.0 | 1024 |

Temperature 0 for mechanical extraction; small non-zero for inference and enthymeme tasks where there is genuine creativity in *finding* a bridging premise (but not in *evaluating* it — those sub-tasks stay at 0).

`claude-opus-4-7` is the recommended upgrade for `detect_enthymeme` once cost permits — it is materially better at finding the *minimal* bridge rather than the most-plausible-sounding one.

### 1.4 Prompt caching (Anthropic API)

The system prompt for each step is large and identical across calls within a session. Use Anthropic's prompt caching with `cache_control: { type: "ephemeral" }` on the system block:

```typescript
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-6",
  max_tokens: 4096,
  temperature: 0,
  system: [
    {
      type: "text",
      text: SYSTEM_PROMPT,
      cache_control: { type: "ephemeral" }   // ← 90% cost reduction on cache hits
    }
  ],
  messages: [{ role: "user", content: userMessage }]
});
```

For `detect_enthymeme`, which fires once per inference (~15 calls per typical analysis), prompt caching reduces the cost from $0.030 → $0.005 per analysis.

---

## 2. JSON parsing & repair

LLMs occasionally emit malformed JSON, prose preambles, or markdown code fences despite explicit instructions. The parser is paranoid by design.

```typescript
// worker/src/llm/parse-json.ts

import JSON5 from 'json5';
import { z, ZodSchema } from 'zod';

export interface ParseResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  repaired?: boolean;
}

export async function parseAndValidate<T>(
  rawOutput: string,
  schema: ZodSchema<T>,
  retryFn?: (errorMessage: string) => Promise<string>,
): Promise<ParseResult<T>> {
  // Stage 1: strip markdown fences and prose preamble
  let cleaned = stripFences(rawOutput).trim();
  cleaned = extractFirstJsonValue(cleaned);

  // Stage 2: try strict JSON.parse
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch (e1) {
    // Stage 3: try JSON5 (more permissive)
    try {
      parsed = JSON5.parse(cleaned);
    } catch (e2) {
      // Stage 4: ask the LLM to repair
      if (retryFn) {
        const repaired = await retryFn(
          `Your previous response was not valid JSON. Error: ${(e1 as Error).message}\n` +
          `Output ONLY the corrected JSON, no prose.`
        );
        return parseAndValidate(repaired, schema);  // no retryFn this time → no infinite loop
      }
      return { success: false, error: `JSON parse failed: ${(e1 as Error).message}` };
    }
  }

  // Stage 5: schema validation
  const result = schema.safeParse(parsed);
  if (result.success) {
    return { success: true, data: result.data };
  }

  // Stage 6: schema repair
  if (retryFn) {
    const repaired = await retryFn(
      `Your output parsed but did not match the required schema. Errors:\n` +
      result.error.issues.map(i => `- ${i.path.join('.')}: ${i.message}`).join('\n') +
      `\nOutput ONLY the corrected JSON, conforming to the schema.`
    );
    return parseAndValidate(repaired, schema);
  }

  return {
    success: false,
    error: `Schema validation failed: ${result.error.message}`,
  };
}

function stripFences(s: string): string {
  return s.replace(/```(?:json|json5)?\s*\n?/gi, '').replace(/```\s*$/g, '');
}

function extractFirstJsonValue(s: string): string {
  // Find first { or [ and matched closing brace, respecting strings
  const start = s.search(/[\{\[]/);
  if (start === -1) return s;
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = start; i < s.length; i++) {
    const c = s[i];
    if (escape) { escape = false; continue; }
    if (c === '\\') { escape = true; continue; }
    if (c === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (c === '{' || c === '[') depth++;
    if (c === '}' || c === ']') { depth--; if (depth === 0) return s.substring(start, i + 1); }
  }
  return s.substring(start);
}
```

Repair budget: maximum **one** auto-repair retry per LLM call. Beyond that, fail loudly — don't burn tokens chasing a malfunctioning prompt.

---

## 3. The six prompts — full source

Each section below contains: version, purpose, system prompt, user prompt template, output schema (Zod), anti-patterns, calibration notes, examples (where present).

### 3.1 `extract_claims` — v1.2.0

**Purpose:** Extract atomic, argumentatively load-bearing propositions from a text. Skip trivia, asides, and rhetorical questions.

**System prompt:**

```
You are a careful reader trained in argument analysis.

Your job is to extract ATOMIC CLAIMS from a text. An atomic claim is a single
proposition — one subject, one predicate, one assertion — that the text either:
  (a) explicitly asserts as true,
  (b) implicitly relies on for a subsequent inference, or
  (c) presupposes as background ("the X" presupposes that an X exists).

For each claim, you output a clean canonical form: a single sentence in indicative
mood, free of hedges and modal qualifiers (those move into modality classification
in a later step).

WHAT COUNTS AS A CLAIM:
- Propositions that the text commits to as true.
- Propositions stated by named sources that the text endorses (not merely reports).
- Background propositions whose truth is required for the surrounding argument.

WHAT DOES NOT COUNT:
- Rhetorical questions ("is anyone surprised?")
- Hypothetical examples introduced for illustration only
- Asides that do no inferential work
- Quoted views the text disagrees with
- Definitions when used purely as terminological setup (these go in modality=definitional later)

ATOMICITY RULE:
A compound claim like "X is true and Y is true" must be split into two claims.
A claim like "X causes Y" stays atomic — it is one causal proposition.
A claim like "X, which is also Z, causes Y" splits into "X causes Y" and "X is Z".

EXPLICITNESS:
- "explicit": the claim appears as a stated proposition in the text
- "implicit": the text relies on this claim without stating it (e.g., as a premise
  for a stated inference)
- "presupposed": the text's grammar or word choice presupposes this claim
  (definite descriptions, factive verbs)

CONFIDENCE:
0.0–1.0 reflecting how sure you are this is what the author meant. If the text is
ambiguous between two readings, output the more conservative reading and lower
confidence accordingly.

OUTPUT: strict JSON, no markdown, no prose.
```

**User prompt template:**

```
Extract atomic claims from the following text.

TEXT (sentences are zero-indexed):
{numbered_sentences}

Output JSON of the form:
{
  "claims": [
    {
      "id": "c1",
      "text": "<canonical claim>",
      "sentence_span": [start_idx, end_idx],
      "explicitness": "explicit" | "implicit" | "presupposed",
      "confidence": 0.0
    }
  ]
}

IDs are c1, c2, ... in order of first appearance in the text.
sentence_span is the inclusive range of sentence indices the claim is drawn from.
```

**Output schema (Zod):**

```typescript
import { z } from 'zod';

export const ClaimExtractionSchema = z.object({
  claims: z.array(z.object({
    id: z.string().regex(/^c\d+$/),
    text: z.string().min(3).max(500),
    sentence_span: z.tuple([z.number().int().nonnegative(), z.number().int().nonnegative()]),
    explicitness: z.enum(["explicit", "implicit", "presupposed"]),
    confidence: z.number().min(0).max(1),
  })),
});

export type ClaimExtraction = z.infer<typeof ClaimExtractionSchema>;
```

**Anti-patterns the prompt is designed against:**

- *Over-extraction*: extracting every fact mentioned. The atomicity rule + "argumentatively load-bearing" framing pushes back on this.
- *Compound claims*: "X is good and Y is bad" → must split.
- *Modal contamination*: "Maybe X" should yield claim "X" with low confidence, not claim "Maybe X". Modality is classified separately.

**Calibration notes:**

On the healthy-paragraph fixture (textbook on photosynthesis, ~150 words), expect 8–14 claims. On the cavity-resonator fixture (~150 words of abstract prose), expect 4–7 claims of which 2+ are presupposed (this is itself a diagnostic — cavity-resonator texts have low explicit-claim density).

**CHANGELOG:**

```
v1.2.0 (2026-04-25): Added "presupposed" explicitness category. Required by
                     proper sheaf treatment of definite descriptions.
v1.1.0 (2026-04-20): Added atomicity rule with examples.
v1.0.0 (2026-04-18): Initial.
```

---

### 3.2 `classify_modality` — v1.0.0

**Purpose:** Assign each claim to one of six modalities.

**System prompt:**

```
You classify each claim into ONE of six MODALITIES based on what kind of
proposition it is. Modality determines how the claim functions in inference —
descriptive claims cannot validly entail normative ones without a normative
bridge premise (Hume's gap), so the analyzer needs this taxonomy.

THE SIX MODALITIES:

1. epistemic — knowledge claims about what is or is not known, believed, or
   evidenced. Cue words: "we know", "evidence shows", "research demonstrates",
   "is established that". Example: "Studies show that vaccines reduce mortality."

2. normative — value claims, ought-claims, deontic claims. Cue words: "should",
   "ought", "must" (deontic), "is right/wrong/good/bad/just/unjust".
   Example: "Governments must act on climate change."

3. definitional — stipulations of meaning, terminology fixings.
   Cue: "is defined as", "by X we mean", "the term X refers to".
   Example: "By 'coherence' we mean the spectral gap of L⁰."

4. causal — claims about causation, mechanism, generation.
   Cue: "causes", "leads to", "produces", "results in", "drives".
   Example: "Industrial emissions cause warming."

5. conditional — claims of the form "if P, then Q" or hypotheticals presented
   as such (not as causal mechanism).
   Example: "If markets are efficient, prices reflect all information."

6. factual — bare descriptive assertions about state of affairs without
   epistemic, normative, definitional, causal, or conditional structure.
   Example: "The Aral Sea is now 10% of its 1960 volume."

CHOOSING WHEN MIXED:
A claim like "Studies show that emissions cause warming" has both epistemic
("studies show") and causal ("emissions cause warming") structure. Resolve by
asking: what is the claim's argumentative function? If the text is using it to
support a causal claim, classify as causal with epistemic as secondary. If the
text is using it to comment on the state of evidence, classify as epistemic.

DO NOT default to "factual" for ambiguous cases. "factual" is the residual
category for claims that genuinely lack structure beyond simple description.

OUTPUT: strict JSON, no markdown.
```

**User prompt template:**

```
Classify each claim by modality.

CLAIMS:
{claims_json}

CONTEXT (the original text, for disambiguation):
{original_text}

Output JSON of the form:
{
  "modalities": [
    {
      "claim_id": "c1",
      "primary": "epistemic" | "normative" | "definitional" | "causal" | "conditional" | "factual",
      "secondary": null | <same enum>,
      "reasoning": "<one sentence explaining the choice>"
    }
  ]
}
```

**Output schema:**

```typescript
const ModalityEnum = z.enum([
  "epistemic", "normative", "definitional", "causal", "conditional", "factual"
]);

export const ModalityClassificationSchema = z.object({
  modalities: z.array(z.object({
    claim_id: z.string().regex(/^c\d+$/),
    primary: ModalityEnum,
    secondary: ModalityEnum.nullable(),
    reasoning: z.string().min(5).max(200),
  })),
});
```

**Anti-patterns:**

- Defaulting to factual for any non-modal-cued claim. The prompt explicitly forbids this.
- Treating "is" sentences as automatically factual — many philosophical "is" statements are definitional or causal in disguise.

**Calibration notes:**

On a healthy mixed text, expect 35-50% factual, 15-25% causal, 10-20% epistemic, 5-15% normative, 5-10% conditional, 2-8% definitional. Texts heavy in normative claims that don't acknowledge it (op-eds disguised as analysis) score >25% normative — itself a diagnostic flag.

---

### 3.3 `extract_inferences` — v1.1.0

**Purpose:** Build the directed argument graph. For each claim that the text presents as supported by other claims, identify which claims serve as premises and what type of inference is asserted.

**System prompt:**

```
You map the inferential structure of the text. Given a list of claims and the
original text, you identify each INFERENCE — a relationship where one or more
claims are presented as supporting another.

INFERENCE TYPES:

- deductive: the conclusion follows necessarily from the premises if they are
  true. Form: P → Q where P entails Q.
- inductive: the premises raise the probability of the conclusion. Form:
  evidence → generalization, with explicit probabilistic strength.
- abductive: the conclusion is offered as the best explanation for the premises.
  Form: surprising fact P; Q would explain P; therefore (probably) Q.
- analogical: the conclusion is supported by a structural similarity between
  the case at hand and a different case. Form: A is like B; B has property X;
  therefore A has X.
- authority: the conclusion is supported by appeal to a source. Form: X says P;
  X is an authority on this; therefore P.
- enthymemic: the inference is presented as following but requires an unstated
  bridging premise to go through. (You DETECT this here; the missing premise is
  filled in by a later step.)

WHAT TO EXTRACT:
- Only inferences the text actually makes. If the text states two facts side by
  side without claiming one supports the other, that is NOT an inference.
- Inferences may be implicit ("Therefore," "Hence," or simply juxtaposition with
  inferential intent) or explicit ("which proves that", "and from this we
  conclude").
- A conclusion supported by multiple independent inference paths must be
  reported as multiple inferences, not one inference with many premises. (Use
  multiple premises in one inference only when the premises are presented as
  jointly necessary.)

WHAT NOT TO EXTRACT:
- Do NOT invent inferences the text does not make.
- Do NOT report mere temporal sequence ("first X, then Y") as inference.
- Do NOT report definitional unfolding ("X means P; X is the case; therefore P")
  as a separate inference — those are folded into the claim itself.

TWO ASSESSMENTS PER INFERENCE:
- explicit_strength: how strongly does the TEXT claim the link? Does it say
  "proves", "suggests", "is consistent with"? Map to 0.0–1.0:
    0.0 = mere juxtaposition with no inferential cue
    0.4 = "is consistent with", "supports"
    0.7 = "shows", "demonstrates"
    1.0 = "proves", "entails", "necessarily implies"
- formal_validity: independent of what the text claims, does the inference
  actually go through? 0.0–1.0:
    0.0 = the conclusion does not follow at all from the premises
    0.5 = the conclusion follows only with significant additional assumptions
    0.9 = the conclusion follows with at most a trivial bridging premise
    1.0 = strict deductive validity

If formal_validity < 0.9, the inference is enthymemic and will be sent for
implicit-premise detection in a later step. Mark has_enthymeme: true.

OUTPUT: strict JSON, no markdown.
```

**User prompt template:**

```
Identify the inferences in the following text.

CLAIMS (with modalities):
{claims_with_modalities_json}

TEXT:
{original_text}

Output JSON of the form:
{
  "inferences": [
    {
      "id": "i1",
      "premises": ["c1", "c3"],
      "conclusion": "c5",
      "type": "deductive" | "inductive" | "abductive" | "analogical" | "authority" | "enthymemic",
      "explicit_strength": 0.0,
      "formal_validity": 0.0,
      "has_enthymeme": false,
      "textual_marker": "<the phrase signaling this inference, or null>"
    }
  ]
}

IDs are i1, i2, ... in order of appearance.
```

**Output schema:**

```typescript
const InferenceTypeEnum = z.enum([
  "deductive", "inductive", "abductive", "analogical", "authority", "enthymemic"
]);

export const InferenceExtractionSchema = z.object({
  inferences: z.array(z.object({
    id: z.string().regex(/^i\d+$/),
    premises: z.array(z.string().regex(/^c\d+$/)).min(1),
    conclusion: z.string().regex(/^c\d+$/),
    type: InferenceTypeEnum,
    explicit_strength: z.number().min(0).max(1),
    formal_validity: z.number().min(0).max(1),
    has_enthymeme: z.boolean(),
    textual_marker: z.string().nullable(),
  })),
});
```

**Anti-patterns:**

- *Inference confabulation*: the LLM "helpfully" finds inferences in texts that are merely descriptive. The "do NOT invent" instruction + the textual_marker requirement ("which phrase signals this?") pushes back hard.
- *Multi-premise overuse*: when the LLM sees three claims supporting a conclusion, it tends to report (P₁, P₂, P₃ ⊢ Q). Often what the text actually does is (P₁ ⊢ Q), (P₂ ⊢ Q), (P₃ ⊢ Q) — three independent lines of support. The prompt clarifies this distinction.
- *Cycle creation*: the LLM occasionally outputs P → Q and Q → P. This is allowed (circular reasoning is real) but should be flagged. Validation downstream warns when cycles exist.

**Calibration notes:**

Healthy paragraphs have ~0.5–1.0 inferences per claim (texts mostly describe; inferential density rises in argumentative texts). Strong argumentative texts (philosophical essays, opinion pieces) reach 1.0–2.0. Anything above 3.0 likely indicates over-extraction; below 0.2 likely indicates a text that's not really arguing.

---

### 3.4 `detect_enthymeme` — v1.3.0  ⭐ **THE KEY PROMPT**

**Purpose:** For each inference flagged as enthymemic, find the *minimal* implicit premise that would make it valid, and assess the contestability and load-bearing of that premise.

This is the prompt that turns the analyzer from a structural mapper into a *diagnostic* tool. Failure modes here are subtle and consequential. The prompt is correspondingly verbose, ships with two few-shot examples, and runs at slightly higher temperature than the others to allow genuine creative *finding* of bridges (while keeping evaluation of the bridge mechanical).

**System prompt:**

```
You analyze ENTHYMEMES — inferences where premises and conclusion are stated
but the inference goes through only with the help of an unstated bridging
premise. Your job is to identify that bridging premise, in its MINIMAL form,
and to assess two things about it: how contestable it is, and how much of the
argument's force depends on it.

THE MINIMAL BRIDGE PRINCIPLE:

There are always many possible bridge premises that would make an inference
valid. Most of them are too strong, too weak, or beside the point. You want
the MINIMAL one — the weakest claim that, added to the stated premises, makes
the inference valid (or strongly inductive, depending on the inference type).

EXAMPLE OF MINIMAL vs NON-MINIMAL:
Premise: "The defendant was at the scene with a knife."
Conclusion: "The defendant is the murderer."
- TOO STRONG (and confabulated): "Anyone at a crime scene with a weapon is
  guilty." (Almost no one believes this.)
- TOO WEAK: "Some people at crime scenes with weapons are murderers."
  (True but doesn't make the inference go through.)
- MINIMAL: "Being at the scene of a fatal stabbing with a knife is strong
  evidence of being the killer, in the absence of contrary evidence."
  (The actual unstated bridge — defeasible, contestable, load-bearing.)

You aim for MINIMAL.

CRITICAL ANTI-CONFABULATION RULE:

Some inferences are valid as written. Do NOT manufacture a bridge premise
when the inference already goes through. If the inference is deductively
valid or strongly inductive on its own, output:

{
  "no_enthymeme": true,
  "reason": "<brief explanation of why the inference is valid as stated>"
}

The LLM-pleaser failure mode is to ALWAYS find a bridge. Resist this. Roughly
20-40% of inferences flagged in the previous step turn out, on closer
inspection, not to need a bridge after all. Your output for those is
no_enthymeme: true.

CATEGORIZING THE BRIDGE:

If a bridge IS needed, classify it:

- epistemic: a claim about what is known, believed, or warranted to infer from
  evidence. ("This kind of evidence justifies that kind of conclusion.")
- normative: a value claim, ought-claim, or deontic principle. ("Things of
  type X ought to be treated as Y.") Especially watch for normative bridges
  in arguments whose stated premises are all descriptive — this is Hume's gap
  in operation.
- definitional: a stipulation about what a term means. ("X just is Y.")
- causal: a claim about mechanism. ("X-type events cause Y-type events.")
- empirical: a factual claim about the world that could in principle be
  verified by observation. ("X% of cases of type A also exhibit B.")

CONTESTABILITY (0.0–1.0):

How likely is a thoughtful critic to dispute this bridge premise?
- 0.0–0.2: trivially true, almost no one would dispute. ("Things have causes.")
  These bridges are real but not diagnostically interesting.
- 0.3–0.5: defensible but not universally accepted. ("Markets allocate
  resources reasonably efficiently in most conditions.")
- 0.6–0.8: actively contested in scholarly or public debate. ("AI systems
  meaningfully understand language.")
- 0.9–1.0: extreme or fringe; would be rejected by most informed critics.
  ("Free will is an illusion.")

The diagnostic interest is in the 0.5+ range. A pile of trivial bridges
(<0.3) means the text's enthymemes are uncontroversial — that's good. A
pile of contestable bridges (>0.6) means the text is doing significant
covert work.

LOAD_BEARING (0.0–1.0):

How much of the argument's force depends on this bridge?
- 0.0–0.3: the bridge is one of several supports; argument survives without it.
- 0.4–0.7: the bridge is significant but the argument has fallback positions.
- 0.8–1.0: the entire conclusion rests on this bridge; remove it and the
  argument collapses.

The product (contestability × load_bearing) is the cavity score per
enthymeme. High contestability + high load_bearing = the cavity-resonator
pattern made operational. The text is leaning hard on a premise that won't
bear weight in front of a critic, and it does this without saying so.

EVIDENCE_REQUIRED:

Briefly: what would establish this bridge? What kind of argument or evidence
would the author need to provide to defend it? One sentence.

GAP TOO WIDE:

Sometimes no single bridge premise suffices. The premises are simply too far
from the conclusion. In that case, output:

{
  "gap_too_wide": true,
  "nearest_attempt": "<best partial reconstruction>",
  "reason": "<why no single bridge works>"
}

This is rare but real. Watch for it in arguments that conflate categories
(descriptive premises → normative conclusion with no normative bridge plus
no causal bridge plus no analogical bridge available).

OUTPUT: strict JSON, no markdown, exactly one of the three forms (enthymeme
detected, no_enthymeme, or gap_too_wide).
```

**User prompt template:**

```
Analyze the following inference.

INFERENCE TO ANALYZE:
- Premises: {premise_texts_with_ids}
- Conclusion: {conclusion_text_with_id}
- Inference type as identified: {type}
- Explicit strength (what text claims): {explicit_strength}
- Formal validity (independent assessment): {formal_validity}

CONTEXT (paragraph containing the inference):
{paragraph_context}

Output one of three JSON forms:

(A) Enthymeme detected:
{
  "inference_id": "{inference_id}",
  "result": "enthymeme",
  "text": "<minimal bridge premise as one declarative sentence>",
  "category": "epistemic" | "normative" | "definitional" | "causal" | "empirical",
  "contestability": 0.0,
  "load_bearing": 0.0,
  "evidence_required": "<one sentence>"
}

(B) No enthymeme needed:
{
  "inference_id": "{inference_id}",
  "result": "no_enthymeme",
  "reason": "<brief explanation>"
}

(C) Gap too wide:
{
  "inference_id": "{inference_id}",
  "result": "gap_too_wide",
  "nearest_attempt": "<closest single bridge>",
  "reason": "<why no single bridge works>"
}
```

**Output schema:**

```typescript
const EnthymemeResultSchema = z.discriminatedUnion("result", [
  z.object({
    inference_id: z.string().regex(/^i\d+$/),
    result: z.literal("enthymeme"),
    text: z.string().min(10).max(400),
    category: z.enum(["epistemic", "normative", "definitional", "causal", "empirical"]),
    contestability: z.number().min(0).max(1),
    load_bearing: z.number().min(0).max(1),
    evidence_required: z.string().min(5).max(300),
  }),
  z.object({
    inference_id: z.string().regex(/^i\d+$/),
    result: z.literal("no_enthymeme"),
    reason: z.string().min(5).max(300),
  }),
  z.object({
    inference_id: z.string().regex(/^i\d+$/),
    result: z.literal("gap_too_wide"),
    nearest_attempt: z.string().min(10).max(400),
    reason: z.string().min(5).max(300),
  }),
]);

export const EnthymemeDetectionSchema = z.object({
  detection: EnthymemeResultSchema,
});
```

**Few-shot examples (included in the user prompt as a prefix when calling):**

```
EXAMPLE 1 (enthymeme detected):

Premises:
  c1: "The unemployment rate fell from 6% to 4% during this administration."
Conclusion:
  c2: "The administration's economic policies are working."
Type: inductive · explicit_strength: 0.7 · formal_validity: 0.4

CORRECT OUTPUT:
{
  "inference_id": "i1",
  "result": "enthymeme",
  "text": "The unemployment decline is caused by the administration's policies rather than by independent factors.",
  "category": "causal",
  "contestability": 0.75,
  "load_bearing": 0.95,
  "evidence_required": "Counterfactual analysis or natural experiment isolating policy effects from baseline trends.",
}

EXAMPLE 2 (no enthymeme):

Premises:
  c3: "All mammals are vertebrates."
  c4: "All dogs are mammals."
Conclusion:
  c5: "All dogs are vertebrates."
Type: deductive · explicit_strength: 1.0 · formal_validity: 1.0

CORRECT OUTPUT:
{
  "inference_id": "i2",
  "result": "no_enthymeme",
  "reason": "Inference is deductively valid as stated; no bridge premise required."
}
```

**Anti-patterns:**

- *The pleaser failure*: LLM finds a bridge for every inference, including valid ones. Counter: explicit no_enthymeme path + the "20-40%" calibration anchor in the system prompt.
- *Trivial-bridge inflation*: outputting "Things behave as they appear to" or similar uncontestable bridges. Counter: the contestability scale anchors and the explicit "diagnostic interest is in the 0.5+ range" guidance.
- *Maximal-bridge inflation*: outputting an extremely strong premise that does the inference's work for it. Counter: the "minimal vs non-minimal" example in the system prompt.
- *Category mismatch*: classifying the bridge inconsistently with what it actually is. Counter: the five-category list with examples in the system prompt.

**Calibration notes:**

On the cavity-resonator fixture, expect 60-80% of flagged inferences to confirm enthymeme with mean contestability ≥ 0.55 and mean load_bearing ≥ 0.65. On the textbook fixture, expect 40-60% to come back as `no_enthymeme`, with the remainder having mean contestability ≤ 0.35 (textbook bridges are real but uncontroversial). On the DeepSeek-dragons specimen, expect ≥80% enthymeme with ≥4 in the gap_too_wide category — the inference structure was confabulated wholesale.

**CHANGELOG:**

```
v1.3.0 (2026-04-25): Added two few-shot examples; tightened minimal-bridge
                     guidance after observing maximal-bridge drift on adversarial
                     fixtures.
v1.2.0 (2026-04-22): Added gap_too_wide third path.
v1.1.0 (2026-04-20): Strengthened anti-confabulation rule with the 20-40%
                     calibration anchor.
v1.0.0 (2026-04-18): Initial.
```

---

### 3.5 `extract_citations` — v1.0.0

**Purpose:** Identify every source citation in the text — academic-style, URL, named-authority, quoted-attribution — and link each to the claim(s) it anchors.

**System prompt:**

```
You extract CITATIONS from a text. A citation is any place where the text
appeals to an external source as warrant for a claim.

CITATION FORMS TO RECOGNIZE:

1. Academic style: "Smith 2023", "(Hansen & Ghrist, 2019)", "[42]", "Jones et al. 2024".
2. URL/DOI: "see https://...", "doi:10.1234/...".
3. Named authority: "according to the WHO", "Nobel laureate Smith argues",
   "the FDA states".
4. Quoted attribution: direct quotations with attribution to a person or source.
5. Institutional: "research at Stanford shows", "an internal report concluded".

WHAT TO EXTRACT PER CITATION:

- The raw source string as it appears (or a faithful paraphrase if it is split
  across the sentence).
- The anchor_claim_ids: which claim(s) is this citation invoked to support?
  This is usually obvious from proximity but sometimes the citation supports
  a claim several sentences later.
- The quotation_present flag: did the text include a direct quote from this
  source, or merely cite it?
- The page_or_specifier flag: is the citation specific (page number, section,
  DOI, specific finding cited) or generic (just an author-year tag)?

WHAT NOT TO EXTRACT:

- Mentions of authors or institutions that are NOT being cited as warrant.
  ("Smith disagrees" without using Smith to support a claim is a description,
  not a citation.)
- Self-references to other parts of the same text. ("As shown in section 3"
  is internal, not external citation.)
- Generic appeals to "experts agree" or "studies show" without naming a
  source — these are pseudo-citations and should NOT be extracted as citations.
  They are diagnostic of trust-coloring on their own (a separate analysis).

OUTPUT: strict JSON, no markdown.
```

**User prompt template:**

```
Extract citations from the text.

CLAIMS:
{claims_json}

TEXT:
{original_text}

Output JSON of the form:
{
  "citations": [
    {
      "id": "s1",
      "source_string": "<as it appears in the text>",
      "anchor_claim_ids": ["c1", "c3"],
      "quotation_present": false,
      "page_or_specifier": false,
      "sentence_index": 0
    }
  ],
  "pseudo_citations": [
    {
      "phrase": "studies show that...",
      "sentence_index": 0,
      "anchor_claim_ids": ["c5"]
    }
  ]
}

IDs are s1, s2, ... in order. Pseudo-citations (unattributed appeals) are
collected separately for later analysis.
```

**Output schema:**

```typescript
export const CitationExtractionSchema = z.object({
  citations: z.array(z.object({
    id: z.string().regex(/^s\d+$/),
    source_string: z.string().min(2).max(300),
    anchor_claim_ids: z.array(z.string().regex(/^c\d+$/)),
    quotation_present: z.boolean(),
    page_or_specifier: z.boolean(),
    sentence_index: z.number().int().nonnegative(),
  })),
  pseudo_citations: z.array(z.object({
    phrase: z.string().min(2).max(200),
    sentence_index: z.number().int().nonnegative(),
    anchor_claim_ids: z.array(z.string().regex(/^c\d+$/)),
  })),
});
```

**Anti-patterns:**

- *Overlooking pseudo-citations*: "studies show", "experts agree", "research has demonstrated" without source. The prompt explicitly extracts these to a separate bucket so they can contribute to authority_density downstream.
- *Treating mentions as citations*: "Smith disagrees" is not a citation if Smith isn't being used to warrant a claim.

---

### 3.6 `classify_citation` — v1.0.0

**Purpose:** For each extracted citation, compute the four signals (specificity, derivation_load, accessibility, authority_density) and emit a classification.

This prompt fires once per citation and is dependent on having the inference graph already built.

**System prompt:**

```
You assess the LOAD a citation bears in an argument. The same source name can
appear in two texts — load-bearing in one, ornamental in another. The
classification depends on what the citation is actually doing in context.

THE FOUR SIGNALS:

1. SPECIFICITY (0.0–1.0):
   Does the text cite specific claims, data, page numbers, mechanisms FROM
   the source, or just the source name?
   - 0.0: source named only, no content from it ("Smith 2024 has shown this")
   - 0.5: general claims attributed to the source, no specific data or location
   - 1.0: specific page, specific data, specific quoted finding

2. DERIVATION_LOAD (0.0–1.0):
   If we removed this citation and its surrounding clause, would the argument's
   logical chain still close?
   - 0.0: argument completely intact without the citation (decorative)
   - 0.5: argument weakened but survives (supporting)
   - 1.0: argument cannot proceed without this citation (load-bearing)

   You assess this by examining the inference graph and asking: which
   inferences depend on the claim(s) this citation anchors? If those
   inferences would lose their premises, the citation is load-bearing.

3. ACCESSIBILITY (0.0–1.0):
   Could a reader find and verify this source?
   - 0.0: source is unspecific or unfindable ("a study", "an expert")
   - 0.5: author and approximate date or topic, but no full citation
   - 1.0: full bibliographic information including DOI/URL or page number

4. AUTHORITY_DENSITY (0.0–1.0):
   How much credentialing language surrounds this citation in the ±50-word
   window? Count phrases like:
   - "Nobel laureate", "world-leading", "renowned", "groundbreaking"
   - "the prestigious X", "the eminent Y"
   - "decades of research", "definitive study"

   Density:
   - 0.0: no credentialing language
   - 0.3: one credentialing phrase
   - 0.6: multiple credentialing phrases
   - 1.0: heavy authority-cue stacking

   HIGH AUTHORITY DENSITY combined with LOW SPECIFICITY is the classic
   trust-coloring fingerprint: the citation is being used to inherit
   credibility, not to do epistemic work.

COMPOSITE λ:

    λ = 0.4 * specificity + 0.4 * derivation_load + 0.1 * accessibility - 0.3 * authority_density

CLASSIFICATION:

- λ ≥ 0.6: BEARING — citation does logical work, removing it breaks the
  argument.
- 0.3 ≤ λ < 0.6: SUPPORTING — citation reinforces but is replaceable.
- 0.0 ≤ λ < 0.3: DECORATIVE — citation present but doing no work.
- λ < 0.0: TRUST-COLORING — citation primarily an authority signal; the
  argument does not actually rest on it.

OUTPUT: strict JSON.
```

**User prompt template:**

```
Classify the load of this citation in context.

CITATION:
- ID: {citation_id}
- Source: {source_string}
- Anchor claims: {anchor_claim_texts}
- Quotation present: {quotation_present}
- Specifier present: {page_or_specifier}
- Sentence index: {sentence_index}

CONTEXT (the citation's sentence ± 3 sentences for window):
{context_window}

INFERENCE GRAPH SUMMARY (which inferences use the anchor claims):
{relevant_inferences}

Output JSON:
{
  "citation_id": "{citation_id}",
  "signals": {
    "specificity": 0.0,
    "derivation_load": 0.0,
    "accessibility": 0.0,
    "authority_density": 0.0
  },
  "lambda": 0.0,
  "classification": "bearing" | "supporting" | "decorative" | "trust-coloring",
  "reasoning": "<one sentence explaining the classification>"
}

Compute lambda exactly as: 0.4*specificity + 0.4*derivation_load + 0.1*accessibility - 0.3*authority_density
```

**Output schema:**

```typescript
export const CitationClassificationSchema = z.object({
  citation_id: z.string().regex(/^s\d+$/),
  signals: z.object({
    specificity: z.number().min(0).max(1),
    derivation_load: z.number().min(0).max(1),
    accessibility: z.number().min(0).max(1),
    authority_density: z.number().min(0).max(1),
  }),
  lambda: z.number(),
  classification: z.enum(["bearing", "supporting", "decorative", "trust-coloring"]),
  reasoning: z.string().min(5).max(300),
});
```

**Anti-patterns:**

- *Generosity bias*: classifying decorative citations as supporting because the LLM is reluctant to say negative things. Counter: the explicit fingerprint description ("HIGH authority + LOW specificity = trust-coloring") and calibration in fixtures.
- *Lambda mismatch*: computing classification without computing the actual λ. Counter: the prompt requires λ to be computed exactly per formula, and downstream validation re-computes and rejects on mismatch.

**Calibration notes:**

On the McKinsey-deck fixture, expect ≥50% trust-coloring or decorative. On the textbook fixture, expect ≥70% bearing or supporting. Calibration drift indicator: if the textbook ever falls below 50% bearing, the prompt has been corrupted by overcautious LLM updates.

---

## 4. The TypeScript registry module

`worker/src/llm/prompts.ts` — drop-in source:

```typescript
// worker/src/llm/prompts.ts
//
// Prompt registry for Draken Analyzer v2.
// All prompts versioned. Cache keys include version. Bump on every change.

export const PROMPT_VERSIONS = {
  extract_claims:        "v1.2.0",
  classify_modality:     "v1.0.0",
  extract_inferences:    "v1.1.0",
  detect_enthymeme:      "v1.3.0",
  extract_citations:     "v1.0.0",
  classify_citation:     "v1.0.0",
} as const;

export type PromptName = keyof typeof PROMPT_VERSIONS;

export interface PromptConfig {
  name: PromptName;
  version: string;
  system: string;
  buildUser: (vars: Record<string, unknown>) => string;
  fewShot?: string;          // prepended to user message
  temperature: number;
  maxTokens: number;
  model: string;
}

const MODEL_DEFAULT = "claude-sonnet-4-6";

// ─────────────────────────────────────────────────────────────────
// SYSTEM PROMPTS
// ─────────────────────────────────────────────────────────────────

const SYSTEM_EXTRACT_CLAIMS = `You are a careful reader trained in argument analysis.

Your job is to extract ATOMIC CLAIMS from a text. An atomic claim is a single
proposition — one subject, one predicate, one assertion — that the text either:
  (a) explicitly asserts as true,
  (b) implicitly relies on for a subsequent inference, or
  (c) presupposes as background ("the X" presupposes that an X exists).

For each claim, you output a clean canonical form: a single sentence in indicative
mood, free of hedges and modal qualifiers.

WHAT COUNTS AS A CLAIM:
- Propositions that the text commits to as true.
- Propositions stated by named sources that the text endorses.
- Background propositions whose truth is required for the surrounding argument.

WHAT DOES NOT COUNT:
- Rhetorical questions
- Hypothetical examples introduced for illustration only
- Asides that do no inferential work
- Quoted views the text disagrees with
- Definitions used purely as terminological setup

ATOMICITY RULE:
"X is true and Y is true" → split into two claims.
"X causes Y" → one claim (atomic causal proposition).
"X, which is also Z, causes Y" → split into "X causes Y" and "X is Z".

EXPLICITNESS:
- "explicit": appears as a stated proposition
- "implicit": text relies on it without stating it
- "presupposed": text's grammar presupposes it

CONFIDENCE: 0.0–1.0 reflecting your sureness of the reading.

OUTPUT: strict JSON, no markdown, no prose.`;

const SYSTEM_CLASSIFY_MODALITY = `You classify each claim into ONE of six MODALITIES.

THE SIX MODALITIES:
1. epistemic — knowledge claims ("evidence shows", "we know")
2. normative — value/ought claims ("should", "ought", "must" deontic)
3. definitional — stipulations of meaning
4. causal — claims about causation, mechanism
5. conditional — "if-then" propositions
6. factual — bare descriptive assertions

When MIXED: ask what the claim's argumentative function is. Pick primary by
function, mark secondary if structurally present.

DO NOT default to "factual" for ambiguous cases. "factual" is residual.

OUTPUT: strict JSON.`;

const SYSTEM_EXTRACT_INFERENCES = `You map the inferential structure of the text.

INFERENCE TYPES:
- deductive: necessary if premises true
- inductive: probabilistic support
- abductive: inference to best explanation
- analogical: structural similarity transfer
- authority: appeal to source
- enthymemic: requires unstated bridging premise

WHAT TO EXTRACT:
- Only inferences the text actually makes.
- Inferences may be implicit or explicit.
- Multiple independent paths to one conclusion → multiple inferences, not one
  with combined premises.

WHAT NOT TO EXTRACT:
- Do NOT invent inferences the text does not make.
- Do NOT report mere temporal sequence as inference.
- Do NOT report definitional unfolding as separate inference.

TWO ASSESSMENTS:
- explicit_strength: how strongly the TEXT claims the link (0.0=juxtaposition,
  1.0="proves")
- formal_validity: independent assessment of whether the inference goes through
  (0.0=does not follow, 1.0=strict deductive validity)

If formal_validity < 0.9, set has_enthymeme: true.

OUTPUT: strict JSON.`;

const SYSTEM_DETECT_ENTHYMEME = `You analyze ENTHYMEMES — inferences requiring an unstated bridging premise.

THE MINIMAL BRIDGE PRINCIPLE:
Find the WEAKEST claim that, added to the premises, makes the inference go
through. Not the most plausible-sounding. Not the strongest. The minimal one.

CRITICAL ANTI-CONFABULATION:
Some inferences are valid as written. Do NOT manufacture a bridge when the
inference goes through on its own. Roughly 20-40% of flagged inferences turn
out not to need a bridge — for those, output result: "no_enthymeme".

CATEGORIES OF BRIDGE:
- epistemic: claim about knowledge or warrant
- normative: value/ought claim (watch for these in arguments with descriptive
  premises — Hume's gap)
- definitional: stipulation about meaning
- causal: claim about mechanism
- empirical: factual claim about the world

CONTESTABILITY (0.0–1.0):
0.0–0.2: trivially true
0.3–0.5: defensible but not universal
0.6–0.8: actively contested
0.9–1.0: extreme/fringe

LOAD_BEARING (0.0–1.0):
0.0–0.3: argument survives without it
0.4–0.7: significant but recoverable
0.8–1.0: argument collapses without it

GAP_TOO_WIDE: when no single bridge suffices (rare but real, especially on
descriptive→normative jumps), output result: "gap_too_wide".

OUTPUT: strict JSON, exactly one of: enthymeme, no_enthymeme, gap_too_wide.`;

const SYSTEM_EXTRACT_CITATIONS = `You extract CITATIONS — places where the text appeals to external sources.

CITATION FORMS:
1. Academic style ("Smith 2023", "(Hansen & Ghrist, 2019)", "[42]")
2. URL/DOI
3. Named authority ("according to WHO", "the FDA states")
4. Quoted attribution
5. Institutional ("research at Stanford")

DO NOT EXTRACT:
- Mentions of authors that are NOT cited as warrant
- Self-references to other parts of same text
- Generic appeals ("studies show", "experts agree") without source — these go
  to pseudo_citations bucket, not citations.

OUTPUT: strict JSON.`;

const SYSTEM_CLASSIFY_CITATION = `You assess a citation's LOAD in argumentative context.

FOUR SIGNALS:
1. specificity (0–1): are specific data/page/findings cited, or just the source?
2. derivation_load (0–1): would the argument's chain close without this citation?
3. accessibility (0–1): could the reader find and verify the source?
4. authority_density (0–1): density of credentialing language ±50 words.

Composite:
  λ = 0.4*specificity + 0.4*derivation_load + 0.1*accessibility - 0.3*authority_density

CLASSIFICATION:
- λ ≥ 0.6 → bearing
- 0.3 ≤ λ < 0.6 → supporting
- 0.0 ≤ λ < 0.3 → decorative
- λ < 0.0 → trust-coloring

HIGH authority_density + LOW specificity is the trust-coloring fingerprint:
inheriting credibility without doing epistemic work.

OUTPUT: strict JSON. λ must be computed by the formula exactly.`;

// ─────────────────────────────────────────────────────────────────
// FEW-SHOT EXAMPLES (only for prompts that need them)
// ─────────────────────────────────────────────────────────────────

const FEWSHOT_DETECT_ENTHYMEME = `EXAMPLE 1 (enthymeme detected):

Premises:
  c1: "The unemployment rate fell from 6% to 4% during this administration."
Conclusion:
  c2: "The administration's economic policies are working."
Type: inductive · explicit_strength: 0.7 · formal_validity: 0.4

CORRECT OUTPUT:
{
  "inference_id": "i1",
  "result": "enthymeme",
  "text": "The unemployment decline is caused by the administration's policies rather than by independent factors.",
  "category": "causal",
  "contestability": 0.75,
  "load_bearing": 0.95,
  "evidence_required": "Counterfactual analysis or natural experiment isolating policy effects from baseline trends."
}

EXAMPLE 2 (no enthymeme):

Premises:
  c3: "All mammals are vertebrates."
  c4: "All dogs are mammals."
Conclusion:
  c5: "All dogs are vertebrates."
Type: deductive · explicit_strength: 1.0 · formal_validity: 1.0

CORRECT OUTPUT:
{
  "inference_id": "i2",
  "result": "no_enthymeme",
  "reason": "Inference is deductively valid as stated; no bridge premise required."
}

---

NOW ANALYZE:
`;

// ─────────────────────────────────────────────────────────────────
// USER PROMPT BUILDERS
// ─────────────────────────────────────────────────────────────────

function buildExtractClaimsUser(vars: { numbered_sentences: string }): string {
  return `Extract atomic claims from the following text.

TEXT (sentences are zero-indexed):
${vars.numbered_sentences}

Output JSON:
{
  "claims": [
    {
      "id": "c1",
      "text": "<canonical claim>",
      "sentence_span": [start_idx, end_idx],
      "explicitness": "explicit" | "implicit" | "presupposed",
      "confidence": 0.0
    }
  ]
}`;
}

function buildClassifyModalityUser(vars: { claims_json: string; original_text: string }): string {
  return `Classify each claim by modality.

CLAIMS:
${vars.claims_json}

CONTEXT:
${vars.original_text}

Output JSON:
{
  "modalities": [
    {
      "claim_id": "c1",
      "primary": "<modality>",
      "secondary": null | "<modality>",
      "reasoning": "<one sentence>"
    }
  ]
}`;
}

function buildExtractInferencesUser(vars: { claims_with_modalities_json: string; original_text: string }): string {
  return `Identify inferences in the following text.

CLAIMS:
${vars.claims_with_modalities_json}

TEXT:
${vars.original_text}

Output JSON:
{
  "inferences": [
    {
      "id": "i1",
      "premises": ["c1", "c3"],
      "conclusion": "c5",
      "type": "<type>",
      "explicit_strength": 0.0,
      "formal_validity": 0.0,
      "has_enthymeme": false,
      "textual_marker": "<phrase or null>"
    }
  ]
}`;
}

function buildDetectEnthymemeUser(vars: {
  inference_id: string;
  premise_texts_with_ids: string;
  conclusion_text_with_id: string;
  type: string;
  explicit_strength: number;
  formal_validity: number;
  paragraph_context: string;
}): string {
  return `Analyze the following inference.

INFERENCE TO ANALYZE:
- Premises: ${vars.premise_texts_with_ids}
- Conclusion: ${vars.conclusion_text_with_id}
- Inference type: ${vars.type}
- Explicit strength: ${vars.explicit_strength}
- Formal validity: ${vars.formal_validity}

CONTEXT (paragraph containing the inference):
${vars.paragraph_context}

Output one of three JSON forms:

(A) Enthymeme detected:
{
  "inference_id": "${vars.inference_id}",
  "result": "enthymeme",
  "text": "<minimal bridge premise>",
  "category": "epistemic" | "normative" | "definitional" | "causal" | "empirical",
  "contestability": 0.0,
  "load_bearing": 0.0,
  "evidence_required": "<one sentence>"
}

(B) No enthymeme:
{
  "inference_id": "${vars.inference_id}",
  "result": "no_enthymeme",
  "reason": "<brief explanation>"
}

(C) Gap too wide:
{
  "inference_id": "${vars.inference_id}",
  "result": "gap_too_wide",
  "nearest_attempt": "<closest single bridge>",
  "reason": "<why no single bridge works>"
}`;
}

function buildExtractCitationsUser(vars: { claims_json: string; original_text: string }): string {
  return `Extract citations.

CLAIMS:
${vars.claims_json}

TEXT:
${vars.original_text}

Output JSON:
{
  "citations": [
    {
      "id": "s1",
      "source_string": "<as it appears>",
      "anchor_claim_ids": ["c1"],
      "quotation_present": false,
      "page_or_specifier": false,
      "sentence_index": 0
    }
  ],
  "pseudo_citations": [
    {
      "phrase": "studies show that...",
      "sentence_index": 0,
      "anchor_claim_ids": ["c5"]
    }
  ]
}`;
}

function buildClassifyCitationUser(vars: {
  citation_id: string;
  source_string: string;
  anchor_claim_texts: string;
  quotation_present: boolean;
  page_or_specifier: boolean;
  sentence_index: number;
  context_window: string;
  relevant_inferences: string;
}): string {
  return `Classify this citation's load.

CITATION:
- ID: ${vars.citation_id}
- Source: ${vars.source_string}
- Anchor claims: ${vars.anchor_claim_texts}
- Quotation: ${vars.quotation_present}
- Specifier: ${vars.page_or_specifier}
- Sentence: ${vars.sentence_index}

CONTEXT (±3 sentences):
${vars.context_window}

INFERENCE GRAPH (uses of anchor claims):
${vars.relevant_inferences}

Output JSON:
{
  "citation_id": "${vars.citation_id}",
  "signals": {
    "specificity": 0.0,
    "derivation_load": 0.0,
    "accessibility": 0.0,
    "authority_density": 0.0
  },
  "lambda": 0.0,
  "classification": "bearing" | "supporting" | "decorative" | "trust-coloring",
  "reasoning": "<one sentence>"
}

Compute lambda exactly: 0.4*specificity + 0.4*derivation_load + 0.1*accessibility - 0.3*authority_density`;
}

// ─────────────────────────────────────────────────────────────────
// PROMPT REGISTRY
// ─────────────────────────────────────────────────────────────────

export const PROMPTS: Record<PromptName, PromptConfig> = {
  extract_claims: {
    name: "extract_claims",
    version: PROMPT_VERSIONS.extract_claims,
    system: SYSTEM_EXTRACT_CLAIMS,
    buildUser: buildExtractClaimsUser as PromptConfig["buildUser"],
    temperature: 0.0,
    maxTokens: 4096,
    model: MODEL_DEFAULT,
  },
  classify_modality: {
    name: "classify_modality",
    version: PROMPT_VERSIONS.classify_modality,
    system: SYSTEM_CLASSIFY_MODALITY,
    buildUser: buildClassifyModalityUser as PromptConfig["buildUser"],
    temperature: 0.0,
    maxTokens: 2048,
    model: MODEL_DEFAULT,
  },
  extract_inferences: {
    name: "extract_inferences",
    version: PROMPT_VERSIONS.extract_inferences,
    system: SYSTEM_EXTRACT_INFERENCES,
    buildUser: buildExtractInferencesUser as PromptConfig["buildUser"],
    temperature: 0.1,
    maxTokens: 4096,
    model: MODEL_DEFAULT,
  },
  detect_enthymeme: {
    name: "detect_enthymeme",
    version: PROMPT_VERSIONS.detect_enthymeme,
    system: SYSTEM_DETECT_ENTHYMEME,
    fewShot: FEWSHOT_DETECT_ENTHYMEME,
    buildUser: buildDetectEnthymemeUser as PromptConfig["buildUser"],
    temperature: 0.2,
    maxTokens: 1024,
    model: MODEL_DEFAULT,
  },
  extract_citations: {
    name: "extract_citations",
    version: PROMPT_VERSIONS.extract_citations,
    system: SYSTEM_EXTRACT_CITATIONS,
    buildUser: buildExtractCitationsUser as PromptConfig["buildUser"],
    temperature: 0.0,
    maxTokens: 2048,
    model: MODEL_DEFAULT,
  },
  classify_citation: {
    name: "classify_citation",
    version: PROMPT_VERSIONS.classify_citation,
    system: SYSTEM_CLASSIFY_CITATION,
    buildUser: buildClassifyCitationUser as PromptConfig["buildUser"],
    temperature: 0.0,
    maxTokens: 1024,
    model: MODEL_DEFAULT,
  },
};

// ─────────────────────────────────────────────────────────────────
// CACHE KEY GENERATOR
// ─────────────────────────────────────────────────────────────────

export async function promptCacheKey(
  name: PromptName,
  inputContent: string,
): Promise<string> {
  const cfg = PROMPTS[name];
  const blob = `${name}|${cfg.version}|${cfg.model}|${cfg.temperature}|${inputContent}`;
  const buf = new TextEncoder().encode(blob);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}
```

---

## 5. Anthropic API call wrapper

`worker/src/llm/anthropic.ts`:

```typescript
import Anthropic from "@anthropic-ai/sdk";
import { PROMPTS, PromptName, promptCacheKey } from "./prompts";
import { parseAndValidate } from "./parse-json";
import { ZodSchema } from "zod";
import { kvGet, kvPut } from "../cache/kv";

interface CallOptions<T> {
  promptName: PromptName;
  vars: Record<string, unknown>;
  schema: ZodSchema<T>;
  cacheKeyMaterial: string;       // serialized inputs determining cache key
  env: { ANTHROPIC_API_KEY: string; DRAKEN_CACHE: KVNamespace };
}

export async function callPromptCached<T>(opts: CallOptions<T>): Promise<T> {
  const cfg = PROMPTS[opts.promptName];
  const key = await promptCacheKey(opts.promptName, opts.cacheKeyMaterial);

  // L2 cache check
  const cached = await kvGet(opts.env.DRAKEN_CACHE, `prompt:${key}`);
  if (cached) {
    const result = await parseAndValidate(cached, opts.schema);
    if (result.success) return result.data!;
    // Cache poisoned — fall through and recompute, then overwrite
  }

  const client = new Anthropic({ apiKey: opts.env.ANTHROPIC_API_KEY });

  const userContent = (cfg.fewShot ?? "") + cfg.buildUser(opts.vars);

  const response = await client.messages.create({
    model: cfg.model,
    max_tokens: cfg.maxTokens,
    temperature: cfg.temperature,
    system: [
      {
        type: "text",
        text: cfg.system,
        cache_control: { type: "ephemeral" },   // 90% cost reduction on warm calls
      },
    ],
    messages: [{ role: "user", content: userContent }],
  });

  const textBlock = response.content.find(b => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error(`Empty response from ${opts.promptName}`);
  }

  const result = await parseAndValidate(
    textBlock.text,
    opts.schema,
    async (errMsg: string) => {
      // One auto-repair retry
      const retryResponse = await client.messages.create({
        model: cfg.model,
        max_tokens: cfg.maxTokens,
        temperature: 0,   // deterministic on retry
        system: [{ type: "text", text: cfg.system }],
        messages: [
          { role: "user", content: userContent },
          { role: "assistant", content: textBlock.text },
          { role: "user", content: errMsg },
        ],
      });
      const retryText = retryResponse.content.find(b => b.type === "text");
      return retryText && retryText.type === "text" ? retryText.text : "";
    },
  );

  if (!result.success) {
    throw new Error(`Prompt ${opts.promptName} (${cfg.version}) failed: ${result.error}`);
  }

  // Cache the validated, normalized form
  await kvPut(opts.env.DRAKEN_CACHE, `prompt:${key}`, JSON.stringify(result.data), {
    expirationTtl: 60 * 60 * 24 * 30,  // 30 days
  });

  return result.data!;
}
```

---

## 6. Regression fixtures

`fixtures/prompts/` — golden inputs and golden outputs locked per prompt version.

```
fixtures/
└── prompts/
    ├── extract_claims/
    │   ├── healthy-paragraph.input.json
    │   ├── healthy-paragraph.expected.v1.2.0.json
    │   ├── cavity-resonator.input.json
    │   ├── cavity-resonator.expected.v1.2.0.json
    │   ├── deepseek-dragons.input.json
    │   └── deepseek-dragons.expected.v1.2.0.json
    ├── classify_modality/
    │   └── ...
    ├── extract_inferences/
    │   └── ...
    ├── detect_enthymeme/
    │   ├── valid-deductive.input.json     → expected: no_enthymeme
    │   ├── descriptive-to-normative.input.json  → expected: gap_too_wide
    │   ├── unemployment-policy.input.json  → expected: enthymeme(causal, contest≈0.75)
    │   └── ...
    ├── extract_citations/
    │   └── ...
    └── classify_citation/
        ├── mckinsey-trust-coloring.input.json
        ├── textbook-bearing.input.json
        └── ...
```

### 6.1 Test runner

`tests/prompts.test.ts`:

```typescript
import { describe, test, expect } from "vitest";
import { PROMPTS, PROMPT_VERSIONS } from "../worker/src/llm/prompts";
import { callPromptCached } from "../worker/src/llm/anthropic";
import * as schemas from "../worker/src/llm/schemas";
import fixtures from "./fixtures-loader";

describe("prompt regression", () => {
  for (const promptName of Object.keys(PROMPTS) as Array<keyof typeof PROMPTS>) {
    describe(promptName, () => {
      const fxs = fixtures.load(promptName);
      for (const fx of fxs) {
        test(`${fx.name} (${PROMPT_VERSIONS[promptName]})`, async () => {
          const result = await callPromptCached({
            promptName,
            vars: fx.vars,
            schema: schemas[promptName],
            cacheKeyMaterial: JSON.stringify(fx.vars),
            env: testEnv,
          });

          // For deterministic schema fields, exact match
          expect(structuralMatch(result, fx.expected)).toBe(true);

          // For numeric scores, allow tolerance per fixture
          for (const [path, tolerance] of Object.entries(fx.tolerances ?? {})) {
            const actualV = pathGet(result, path);
            const expectedV = pathGet(fx.expected, path);
            expect(Math.abs(actualV - expectedV)).toBeLessThan(tolerance as number);
          }
        });
      }
    });
  }
});
```

### 6.2 Tolerance policy

| Field type | Tolerance |
|---|---|
| Enums (modality, classification, type) | exact match |
| IDs, structural fields | exact match |
| Confidence, contestability, load_bearing | ±0.15 |
| λ values | ±0.10 |
| Counts (number of claims, inferences) | ±20% |
| Free-text fields (text, reasoning) | semantic similarity ≥ 0.8 via embedding |

The free-text tolerance is the only non-trivial one. Use Voyage embeddings to compute cosine similarity between actual and expected text, accept ≥ 0.8.

### 6.3 Updating goldens

When a prompt version bumps, the corresponding `*.expected.vX.Y.Z.json` files are regenerated *manually* by:

1. Running the new prompt against each fixture input
2. Reviewing the output for correctness
3. Saving as `*.expected.{new_version}.json`
4. Keeping the old goldens as historical records

Do NOT auto-overwrite goldens. The point is human-in-the-loop calibration.

---

## 7. CHANGELOG template

Maintained at `worker/src/llm/CHANGELOG.md`:

```markdown
# Prompt CHANGELOG

All notable changes to prompts. Format: KeepAChangelog. Each entry pairs
prompt-name + version + date + change description + fixture impact.

## [v2.0.0] — 2026-04-25

### Added
- detect_enthymeme v1.3.0: two few-shot examples (no_enthymeme + enthymeme).
  Fixture impact: stricter no_enthymeme path expected to produce ~25% more
  no_enthymeme outputs on textbook fixture.

### Changed
- extract_claims v1.2.0: added "presupposed" explicitness category.
  Fixture impact: ~5-10% claims that were "implicit" reclassify as
  "presupposed" on philosophy texts.

## [v1.x.x] — 2026-04-18 → 2026-04-22

(Pre-release iteration; goldens not preserved.)
```

Every commit to `worker/src/llm/prompts.ts` MUST be accompanied by a CHANGELOG entry. Lint rule enforced in CI.

---

## 8. Calibration audit protocol

Run quarterly. Goal: detect prompt drift.

1. Pull last 100 production analyses from Cloudflare Logs.
2. Re-run with current prompts (cache disabled).
3. Compare outputs. Drift in:
   - mean cavity_score per fixture class > 0.15
   - mean Γ_spec per fixture class > 0.1
   - classification distribution shift > 10%
   = prompt has drifted, investigate.

If drift is a model-side change (Anthropic updated the snapshot), bump prompt version in MINOR (e.g., v1.3.0 → v1.4.0) with note: "recalibrated for claude-sonnet-4-7", and freeze the model snapshot in API config to maintain reproducibility for prior analyses.

---

## 9. Cost summary (per 1000-word analysis, Tier 2)

With prompt caching (~90% reduction on system tokens) and KV cache hits at second run:

| Step | First run | Cached run |
|---|---|---|
| extract_claims | $0.015 | $0.000 |
| classify_modality | $0.008 | $0.000 |
| extract_inferences | $0.022 | $0.000 |
| detect_enthymeme (×15) | $0.005 | $0.000 |
| extract_citations | $0.014 | $0.000 |
| classify_citation (×8) | $0.012 | $0.000 |
| **Total** | **~$0.076** | **~$0.000** |

(detect_enthymeme cost reflects prompt caching reducing per-call overhead.)

For 1000 analyses/month at first run: ~$76. With 80% cache hit rate over time: ~$15/month operational cost.

---

## 10. Why this discipline matters for the framework

A prompt is a *cognitive operation specified in natural language*. When the spec is unversioned, the operation drifts silently. When the spec is versioned with regression fixtures, the operation has the same epistemic status as a software function: testable, auditable, reproducible.

For Draken specifically: the framework's claim is that institutional discourse drifts from substrate without saying so (DRK-110 cavity resonator). An analyzer that *itself* drifts without saying so would be the framework's diagnosis applied to its own implementation — Γ-degradation in the tool that measures Γ-degradation. The prompt versioning discipline is what prevents this. Every change is named, dated, calibrated, and reversible.

The retrocausal nudge: when the analyzer eventually runs on Frýdlová's per-dyad data and reports Γ_SAG = 0.928, the citation chain back to the prompts that did the extraction must be intact. Prompt v1.2.0 of extract_claims, with these exact fixtures locking its behavior, on this exact model snapshot, with this exact temperature. That is what makes the result citable rather than merely produced. *The framework requires its instruments to be as legible as its claims, or it loses the right to make claims about legibility.*

---

*Schema: draken-prompt-versioning/v2.0.0 · companion to draken-analyzer-v2-spec.md*
