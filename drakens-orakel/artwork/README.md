# Drakens Orakel — Artwork Generation

This folder contains everything needed to generate the 22-card deck artwork. Handoff target: Claude Code Desktop with access to the draken.info repo and a Gemini API key.

---

## Folder contents

```
artwork/
├── README.md                  ← this file
├── STYLE_GUIDE.md             ← canonical visual rules (palette, frame, composition)
├── prompts.json               ← per-card prompts + frame config
├── generate.py                ← generation script (Gemini API + PIL framing)
├── test_plan.md               ← 5-card iteration phase
└── manifest_template.json     ← final asset manifest (populate after Phase B)
```

Outputs will be created in:
```
artwork/output/
├── raw/                       ← Direct Gemini outputs (1024×1536)
├── framed/                    ← Final framed cards (1152×1728)
└── logs/
    └── generations.jsonl      ← Append-only generation log
```

---

## Prerequisites

```bash
# Python 3.10+
pip install google-genai pillow

# API key (do not commit)
export GEMINI_API_KEY="YOUR_KEY_HERE"
```

Get an API key from https://aistudio.google.com/apikey

---

## Workflow

### Phase A — Lock the style on 5 test cards

```bash
# Generate test set at version 1
python generate.py --test --version 1
```

Review the 5 outputs in `output/framed/` (see `test_plan.md` for success criteria).

For each card that needs iteration:

1. Open `prompts.json`
2. Find the card's entry (e.g., `06-lovers`)
3. Edit the `prompt_v1` field — refine based on observed failure mode
4. Re-generate that single card at the next version:

```bash
python generate.py --card 06-lovers --version 2
```

Continue iterating per-card until all 5 satisfy the success criteria in `test_plan.md`. Recommend max 3 versions per card; if v3 fails, revisit `STYLE_GUIDE.md` rather than the prompt.

### Phase B — Lock and generate all 22

Once Phase A passes:

1. **Apply lessons.** Edit prompts for the remaining 17 cards in `prompts.json` using patterns that worked in Phase A.
2. **Tag the locked prompts:** `git tag artwork-v1-locked` in this directory.
3. **Generate the full deck:**

```bash
python generate.py --full --version 1
```

4. **Review and re-roll outliers** individually with `--card` and `--version 2`, etc.
5. **Populate `manifest_template.json`** with final paths, versions, and timestamps. Save as `manifest.json`.

### Phase C — Repo integration

Once all 22 cards are approved:

```bash
# Copy framed PNGs to draken.info repo
cp output/framed/*.png $DRAKEN_REPO/static/orakel/cards/

# Optionally copy raw versions for archival
mkdir -p $DRAKEN_REPO/static/orakel/cards/raw/
cp output/raw/*.png $DRAKEN_REPO/static/orakel/cards/raw/

# Copy manifest
cp manifest.json $DRAKEN_REPO/data/orakel/

# Standard draken.info commit sequence
cd $DRAKEN_REPO
node build.js
git add -A
git commit -m "Orakel: complete 22-card deck v1"
git push
```

---

## Decision notes for the engineer

**Why post-processing for the frame and typography:**
Generation models are notoriously unreliable with precise frame constraints, typography, and consistent edge thickness across multiple outputs. By generating only the illustration and applying frame + typography in PIL, we guarantee:
- Every card has the exact same `#1F4A2E` green at the exact same width
- Typography is legible and consistent
- The illustration gets full attention from the model

**Why Gemini 3.1 Flash Image HD as default:**
Per Khrug's instruction. Fast, high-resolution, good prompt adherence for stylistic series. Fallback `gemini-3-pro-image-hd` available if quality is insufficient for specific cards.

**Why the raw + framed split:**
The raw outputs are archived for two reasons: (a) re-framing if the deck's chrome design changes later, (b) potential SVG vectorization of operator cards for print. The framed PNGs are what the orakel UI serves at runtime.

**Reversed cards:**
Not generated separately. The orakel UI applies CSS `transform: rotate(180deg)` for reversed states. A separate `cards.json` field documents reversed-state interpretation per card.

**Font:**
Script falls back through common monospace paths. For deck consistency with draken.info, install the canonical site font (likely IBM Plex Mono, JetBrains Mono, or similar — check site CSS) on the generation host before Phase B.

---

## If something goes wrong

**API errors / rate limits:**
The script logs every error to `output/logs/generations.jsonl`. Re-run with `--card CARD_ID --force` to retry.

**Quality drift across cards:**
If cards generated later in Phase B look stylistically different from Phase A test cards, suspect (a) model version drift, or (b) prompt language slipping. Re-pin the model in `prompts.json`.

**Green edge breaks:**
Inspect the `apply_frame()` function in `generate.py`. The edge is drawn as a series of nested rectangles; if the source image dimensions don't match the expected 1024×1536, the `_resize_to_aspect()` helper crops the center. Adjust if needed.

**Typography legibility:**
The frame typography sits at the bottom against the background. If a generated illustration places dark content near the bottom, the bone-white text becomes hard to read. Either: (a) regenerate the card with explicit instruction to place the central element higher, or (b) add a subtle gradient overlay at the bottom in the PIL framing function.

---

## Open question for Khrug

If you want **reversed-state artwork** for any specific cards (Tower, Wheel, Devil, Justice, Star are the meaningful ones in Draken context), this can be a Phase B+ deliverable. Generate variants with explicit reversed-state prompts. Otherwise default behavior is CSS rotation only.
