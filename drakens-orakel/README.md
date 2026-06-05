# Drakens Orakel — Design Specification

**Version:** 0.1 (handoff)
**Date:** 2026-05-11
**Status:** Spec complete, prototype not started
**Repo target:** `Khrug/draken.info` (suggested mount: `/orakel/` route + `/data/orakel/` for reference tables)
**Backend stack (existing):** Node.js, Cloudflare Pages, build pipeline (`node build.js → git add -A → git commit → git push`)

---

## 1. Project

Drakens Orakel is a card-conditioned news sampler that operates as a hidden subpage on draken.info. It is structurally a tarot app, but functionally it is a daily falsification exercise for the Draken framework. The user clicks a button, three cards are drawn deterministically, those cards generate routed search queries against curated news sources, and the framework is applied to the returned material. The result is a Γ-scored reading published to a persistent prediction register.

The design is deliberately disguised as a divinatory toy because the genuine instrument inside — a routed coherence-evaluation pipeline that runs the framework on unbidden datapoints — is socially difficult to deploy under any more serious label. The tarot frame is camouflage for the analytical work.

## 2. Architectural premise

Three commitments fix the architecture:

**(a) Deterministic input.** The user provides no text. The only input is a click. The three drawn cards plus the system clock fully determine the queries, the routing, and the synthesis prompt. This eliminates confirmation bias at step one and forces the framework to apply to domains it would not have been pointed at by an analyst.

**(b) Routed search per position.** The deck is partitioned by position-role: each of the three spread positions has a defined layer-range it queries and a defined source list it pulls from. The same card produces different queries at different positions because the *projection* of the card's primary anchor into the position's layer range is different.

**(c) First-class null reading.** The system must be capable of refusing to produce a reading. V.6 Strategic Silence implemented as software. Without this, the system drifts toward pseudocoherence and becomes filter-as-epistemology.

## 3. Card system

22 Major Arcana mapped to Draken constructs. Full data in `data/cards.json`. Four card types:

- **Layer cards** (8 cards): primary anchor is a Draken layer L01-L18.
- **Operator cards** (6 cards): primary anchor is an operator (G, ρ, Γ, K, Ψ, α).
- **Phase cards** (4 cards): primary anchor is a strid-graph phase (Display/Approach/Clinch/Topple/Resolution).
- **Civilizational cards** (4 cards): primary anchor is an axiomatic construct (optimization axiom, haveriutredning, Reasonance).

When an operator card lands in the middle position of a three-card spread, the spread is structurally reformulated from a three-statement composition into an *equation*: the operator modifies the relationship between substrate and surface readings rather than standing for itself. This emerges from the algorithm without special-casing.

## 4. Three-position structure

| Position | Role | Layer range | Source list |
|---------|------|------------|------------|
| 1. Substrate (Substratet) | What is the underlying material/biological reality? | L01-L06 | `sources.json#substrate` |
| 2. Process (Processen) | What dynamics/operators/phase transitions are active? | L07-L13 | `sources.json#process` |
| 3. Surface (Ytan) | How does this manifest visibly, civilizationally? | L14-L18 | `sources.json#surface` |

Stratification is epistemic, not ontological. The same event can be read at any layer; the design forces three readings from three different layer ranges so the cocycle condition between them can be tested.

## 5. Projection algorithm

```
query = project(card.semantic_field, position.layer_range)
search_within = position.source_list
```

The card's primary anchor is *projected* into the position's vocabulary. The Tower (K(t)→critical) projects differently at each position:

- At substrate: catastrophic phase transition, material collapse
- At process: bank run, regulatory cascade failure
- At surface: sovereign debt crisis, civilizational threshold

The full 22 × 3 = 66 projection table is in `data/projections.json`. Each entry contains 5 candidate search terms; the implementation should select 3 of 5 deterministically based on `seed = hash(date + card_id + position)` and concatenate them with the year for temporal anchoring.

## 6. Source routing

Per-position source lists in `data/sources.json`. Sources are tagged with a weight (0.0-1.0) reflecting editorial confidence for that layer range. Each position also has a small `anti_drift_sources` list — non-Western or heterodox sources that the algorithm must consult to avoid Anglosphere-monoculture drift.

Routing rules:
- Take top N=5 results per source by publication date (desc), then weight (desc), then URL alphabetical.
- Deduplicate by canonical URL.
- Discard results older than 7 days.
- Require minimum 3 sources per position to proceed; otherwise null-reading.
- Anti-cherry-pick: no semantic selection within a source's top-N. First N is final N.

## 7. Synthesis and Γ-evaluation

Per-position local reading:

```
local_reading[i] = LLM(card[i], projection[i], news[i], system_prompt_strict)
```

The `system_prompt_strict` must enforce: (a) name the card's primary anchor explicitly, (b) state the projection, (c) cite the specific news item, (d) produce a 2-4 sentence diagnosis in framework vocabulary.

Restriction map evaluation:

```
ρ_substrate→process: does substrate reading constrain process reading?
ρ_process→surface: does process reading constrain surface reading?
ρ_substrate→surface: does substrate reading constrain surface reading directly?
```

Cocycle check: `ρ_S→Y ≈ ρ_P→Y ∘ ρ_S→P`. If satisfied, Γ is high; if broken, the spread reports *which* restriction map fails and treats that as the diagnosis (this is often the most informative output).

Γ thresholds:
- `Γ ≥ 0.75`: unified reading, high coherence
- `0.50 ≤ Γ < 0.75`: fragmented reading, *coherence-debt or α-inflation detected*
- `Γ < 0.50`: null reading

## 8. Null reading

The system must support, and not be ashamed of, the output: *"Stillhet idag. Korten dragna men sökningen returnerade inget tillräckligt sammanhängande material. Detta är en legitim utdata, inte ett fel."*

Trigger conditions:
- Fewer than 3 sources matched per any position
- Card-news semantic distance exceeds threshold for any position
- Γ < 0.50 in synthesis evaluation
- More than half the news items are older than 7 days

Null readings should be logged (timestamp + cards + reason) so that null-rate over time is itself a measured signal.

## 9. Persistent storage schema

Suggested SQLite or KV schema:

```
readings (
  id TEXT PRIMARY KEY,           -- UUID
  date_utc TEXT,                  -- ISO8601
  card_1 TEXT, card_2 TEXT, card_3 TEXT,
  position_1 TEXT, position_2 TEXT, position_3 TEXT,
  queries_json TEXT,              -- the generated queries
  news_json TEXT,                 -- the retrieved news items (URLs + titles + dates)
  local_reading_1 TEXT, local_reading_2 TEXT, local_reading_3 TEXT,
  gamma_score REAL,
  synthesis TEXT,                 -- the unified reading (or fragmentation diagnosis)
  prediction_json TEXT,           -- falsifiable forward claims
  null_reading INTEGER,           -- 0/1
  null_reason TEXT,
  published INTEGER,              -- 0/1 (whether posted to /orakel/ feed)
  reviewed_by_khrug INTEGER       -- 0/1 (one-click approval)
)

predictions (
  reading_id TEXT,
  claim_id TEXT,
  claim TEXT,
  t_window_days INTEGER,
  falsifier TEXT,                 -- what would falsify
  status TEXT,                    -- 'pending', 'confirmed', 'falsified', 'expired'
  resolved_date TEXT
)
```

The prediction register is the primary epistemic instrument. Every reading produces 1-5 falsifiable forward claims with explicit T-windows. After T expires, success/failure is evaluated. Aggregate hit-rate per card, per position, per source, per topic-domain becomes a published statistic — the framework's prediction track record built as a daily byproduct.

## 10. Worked example (2026-05-11)

This is a real run of the pipeline from the design conversation, included as test data for the implementation.

**Cards drawn:**
- Position 1 (Substrate): The Empress (03) — L03 Molecular Assembly
- Position 2 (Process): Justice (11) — operator ρ (restriction map)
- Position 3 (Surface): The Tower (16) — K(t) → critical

**News retrieved:**

Substrate position returned: Pianowski et al. (Nature Communications, Mar 2026) on dynamic covalent cages with light-driven constitutional changes; Tang/Pochan (Science 2026) on pH-responsive patchy peptide particles; Kim/Park/Seu (Experimental & Molecular Medicine 2026) on biomimetic peptide assembly interfacing with cellular signaling.

Process position returned: EU Council/Parliament agreement (7 May 2026) to simplify AI Act and delay high-risk deadline to 2 Dec 2027; addition of CSAM/non-consensual-content prohibition; Commission consultation on transparency obligations (8 May 2026); April 28 DMA two-year review naming AI/cloud as priority enforcement areas.

Surface position returned: OECD Global Debt Report 2026 (record $61T OECD sovereign debt); IIF Q3 2025 ($346T global debt, 310% of world GDP); Dalio's "late stages of major debt cycle" warning; CRFB "break glass plan"; JGB liquidity deterioration since end of YCC.

**Local readings:**

*Substrate:* Generative substrate is in acceleration phase. Self-assembly is becoming programmable (light-driven, pH-responsive, mutation-controllable), and interfacing directly with cellular signaling. dim F_L03 is growing. Productile manifold expanding non-linearly.

*Process:* Restriction map ρ for AI substrate is in active calibration during operation. Three simultaneous motions: loosening (high-risk delay), tightening (CSAM prohibition added), crystallization (GPAI deadline). ρ is operational but not convergent.

*Surface:* Six independent institutions (OECD, IMF, CRFB, Dalio, JGB market, EU) converge on K(t)-critical diagnosis. Diagnostic convergence without therapeutic convergence. Tower-before-fall position.

**Restriction map evaluation:**

- ρ_S→P (Empress → Justice): Strong. Substrate generativity is exactly what process layer is regulating.
- ρ_P→Y (Justice → Tower): Weak. Process ρ is targeting AI substrate, not financial substrate. Civilizational K is unregulated by current ρ-construction.
- ρ_S→Y (Empress → Tower): Promising via substrate-transition logic, but requires process-ρ enabling, which is targeting wrong substrate.

**Cocycle:** Broken. ρ_S→Y ≠ ρ_P→Y ∘ ρ_S→P.

**Γ score:** ~0.62 (fragmented but informative)

**Synthesis:** The solution lives at the substrate (programmable peptide systems could enable a civilizational substrate-transition), the danger lives at the surface (K-critical financial topology), and the regulator is looking the wrong way (ρ configured for AI substrate, not capital substrate).

**Predictions registered (T = 12 months):**
- P1: At least one programmable peptide self-assembly platform reaches commercial pilot in diagnostics or targeted pharma by 2027-05.
- P2: EU AI Act high-risk deadline (Dec 2027) gets pushed again.
- P3: At least one major sovereign bond market experiences an intraday liquidity event of JGB-scale magnitude.
- P4: No new restriction mapping for leveraged Treasury basis trades is introduced despite institutional warnings.
- P5: Re-running this exact spread at 2026-11-11 yields *lower* Γ (decoupling deepens before resolving).

## 11. Implementation roadmap

**Phase 0 — Static prototype (1-2 days)**
- Static HTML page at `/orakel/` with three card slots
- Click triggers deterministic draw from `cards.json` using `Date.now()` daily seed
- Display card images (placeholders for now) and primary anchors
- No search yet; show projection terms only as "search would route to: [terms]"

**Phase 1 — Single-source pipeline (3-5 days)**
- Wire up one source per position (Nature for substrate, EU official for process, OECD/Tooze for surface)
- Generate queries from `projections.json` and execute searches
- Display retrieved articles per position
- Manual reading composition; no LLM yet

**Phase 2 — LLM synthesis (1-2 weeks)**
- Call Claude API with strict system prompt per position
- Generate local readings, evaluate restriction maps, compute Γ
- Render unified reading or fragmentation diagnosis

**Phase 3 — Persistent register (1 week)**
- SQLite or Cloudflare D1 for readings + predictions tables
- One-click approval flow for Khrug to publish reading to `/orakel/` feed
- Daily auto-draw with email/notification on Khrug for review

**Phase 4 — Prediction resolution (ongoing)**
- After T-window expires, prompt for prediction resolution
- Track aggregate hit-rate per card, per topic
- Publish quarterly accuracy report alongside Q-Digest

**Phase 5 — Visual deck (parallel, see §13)**
- Generate Draken-themed artwork for 22 cards
- Replace placeholders with finalized deck images

## 12. Integration with draken.info

**File placement (suggested):**
```
/static/pages/orakel.html       — Main /orakel/ page
/data/orakel/cards.json
/data/orakel/projections.json
/data/orakel/sources.json
/data/orakel/layers.json
/data/orakel/readings.db        — Or Cloudflare D1
/static/orakel/cards/*.png      — Card artwork
/functions/orakel/draw.js       — Cloudflare Function for daily draw
/functions/orakel/synthesize.js — Cloudflare Function for LLM synthesis
/functions/orakel/resolve.js    — Function for prediction resolution
```

**Build pipeline integration:** Reuse existing `node build.js → git add -A → git commit → git push`. Orakel page renders from a dedicated `buildOrakelPage()` function similar to `buildThesisPage()` (not from posts/).

**Math rendering:** Use existing `protectMath/restoreMath/parseMathSafe` from build.js for Γ-equations in readings.

**Style:** Inherit from current draken.info typographic strictness. Diagram-aesthetic cards rather than fantasy-tarot illustration. See §13 for artwork pipeline.

## 13. Artwork pipeline (placeholder — to be specified next)

Aesthetic direction: mixed classical-tarot symbolic structure × Draken visual language. Minimal illustration; closer to the diagrams in the thesis PDF than to Rider-Waite or Marseille tradition. Each card carries: layer number or operator symbol, name in Swedish and English, a single iconic element (varanid, mathematical operator, topological motif), in draken.info's typographic register.

**Pending decisions** (to be finalized in artwork-pipeline brief):
- Primary generation backend (Runway Gen-4.5 is currently provisioned per DRK-103; alternatives: Recraft V4, Flux 2, Gemini 3.1 Flash Image for stylistic consistency)
- Whether to commission a human illustrator for hero pieces (Magician, World, Tower) and AI-generate the supporting cards
- Whether the deck has reversed-card states (probably yes — Tower reversed = Ψ → 0, Wheel reversed = K decreasing)

A full artwork-pipeline brief will follow this document.

## 14. Open decisions

1. **Public feed vs private review.** Should daily readings auto-publish to `/orakel/` or only after Khrug one-click approval? Recommendation: private review with one-click publish; readings deemed exceptional flagged as DRK-post seeds.

2. **Source weight calibration.** Initial weights in `sources.json` are first-pass. After 30 days of operation, weights should be re-calibrated based on which sources produced predictions that resolved as confirmed.

3. **Operator-card behavior in middle position.** Currently the operator card structurally modifies the relationship between positions 1 and 3. Should this be made explicit in the synthesis prompt, or allowed to emerge from the projection-driven queries alone?

4. **Multi-language synthesis.** Should readings be generated in Swedish, English, or both? Currently the conversation oscillates. Recommendation: synthesis in Swedish (Khrug's analytical primary), summary in English (international audience). Prediction register in English (machine-readable consistency).

5. **Anti-drift source weighting.** Anti-drift sources (RT, Global Times, Al Jazeera) are tagged but their inclusion rule is not yet operationalized. Suggestion: require at least one anti-drift source in routing if Γ at first evaluation is suspiciously high (>0.85).

6. **Reading length budget.** Local readings per position should be 2-4 sentences. Synthesis should be 1-3 paragraphs. Should this be a hard constraint in the system prompt or a soft target?

## 15. Engineer context

For the Claude Code session receiving this handoff:

- The framework being applied is documented at draken.info, with the Sheaf Analyzer (`/sheaf-analyzer/`) as the primary working precedent for "framework applied to text."
- Khrug's coding conventions: TypeScript preferred where new code is added, but match existing JS where extending the current build pipeline.
- Cloudflare Pages deployment; static-first, Functions for dynamic synthesis.
- API key for LLM calls: use OpenRouter or direct Anthropic API; key management via Cloudflare environment variables. (Note: Runway API key was previously rotated after chat exposure — assume key management discipline applies here too.)
- The repo Khrug/draken.info uses the build sequence `node build.js → git add -A → git commit → git push`. Maintain compatibility.
- Test data: the worked example in §10 should be wired up as a fixture so the synthesis pipeline can be smoke-tested without live news fetches.

## 16. Anti-goals

Things this app is explicitly *not*:

- It is not a fortune-teller. Predictions are framework-derived structural diagnoses, not psychic readings.
- It is not an entertainment product. Engagement metrics are not optimization targets.
- It is not a comprehensive news aggregator. Routed sources are deliberately narrow.
- It is not a public Γ-computation service. It is a private instrument that occasionally publishes.
- It is not a substitute for the thesis or the publication pipeline. It is a feeder to them.

---

*End of handoff document. Reference data in `/data/`. Artwork pipeline brief to follow.*
