# Drakens Orakel — Visual Style Guide

**Version:** 1.0
**Status:** Locked for first generation pass
**Applies to:** All 22 Major Arcana cards

---

## 1. Position statement

The deck preserves **classical Major Arcana iconography** seen through an **apocalyptic post-civilizational-collapse lens**. The temporal position of every image is *after* the threshold event — not during. Estetiken har redan accepterat att Tornet föll. This is "dignified etched ruin," not "zombie apocalypse" — closer to Albrecht Dürer engravings or stark mathematical research figures than to horror art or fantasy illustration.

Every card carries Draken's visual signature: **deep black background and a green edge frame**, with selective varanid presence on five specific cards. Operator cards (Magikern, Lyckohjulet, Rättvisan, Måttlighet, Djävulen, Tornet, Månen) carry slightly *less* apocalyptic baggage than the layer cards — they represent still-functioning instruments observed against the post-collapse scene.

---

## 2. Color palette

All values are calibrated to sit against the deep black background. No saturated or vibrant colors anywhere in the deck.

| Role | Hex | Use |
|------|-----|-----|
| Background black | `#0A0A0A` | Card background, deep negative space |
| Deck green (edge) | `#1F4A2E` | Card edge frame, deck spine identity |
| Varanid green | `#3D7A4F` | Scales, plant overgrowth (subtle) |
| Oxidized bronze | `#6B3F2A` | Rust, aged metal, blood-dried |
| Bone white | `#E8E2D5` | Structural elements, bones, calk |
| Patinated silver | `#9A9A8E` | Operator-card highlights |
| Aged gold | `#8B7A3F` | Civilizational accents, fading luxury |
| Dim teal (substrate) | `#2E5A5C` | L01-L06 card accent |
| Dim amber (process) | `#6B5A2A` | L07-L13 card accent |
| Dim crimson (surface) | `#7A2E3D` | L14-L18 card accent |

**Saturation discipline:** No color in the illustration should exceed roughly 60% saturation. Everything is muted, oxidized, weathered.

---

## 3. Frame structure (applied in post-processing)

Every card has identical chrome rendered by `generate.py`:

```
+----------------------------------+
|##################################|   <- 24px green edge (#1F4A2E)
|##                              ##|
|##  00  [card number top-left]  ##|   <- monospace, bone-white
|##                              ##|
|##                              ##|
|##    [generated illustration]  ##|   <- 1024x1536 raw output, centered
|##                              ##|
|##                              ##|
|##  THE FOOL / NARREN           ##|   <- monospace, bone-white
|##  L01 — Quantum Field         ##|   <- monospace small, dim accent
|##                              ##|
|##################################|
+----------------------------------+
```

- Output canvas: **1152 × 1728** (final framed)
- Inner illustration: **1024 × 1536** (raw Gemini output, 2:3 aspect)
- Green edge: 24px solid `#1F4A2E`
- Internal padding: 40px between edge and illustration
- Typography overlay: monospace (DejaVu Sans Mono fallback; ideally swap to draken.info's canonical font)

---

## 4. Composition rules

1. **Central figure or symbol** dominates the upper-middle of the 1024×1536 illustration area. Tarot tradition places the iconic element high.
2. **Lower third reserved** for foreground context (ground, water, ruins, or shadow) that anchors the scene.
3. **Background depth implied** through atmospheric perspective — distant ruins, faded landscape, sky.
4. **Negative space respected.** Never fill the frame edge-to-edge. The image must breathe.
5. **No on-illustration text.** Card name and number are added in post-processing only. The generated image must contain no characters, glyphs, or readable typography.

---

## 5. Apocalyptic lens application

The atmosphere lives primarily in the **background and environment**, not in the central figure. Foreground figures and tarot symbols remain *intact and recognizable*. The ruin sits behind them.

**Apply atmosphere through:**
- Crumbling architecture, partial roofs missing
- Vegetation reclaiming concrete and stone
- Rusted metal, lichen on surfaces, weathered patina
- Permanent dusk or overcast skies (avoid bright midday light)
- Empty landscapes, no crowds, no living animals (except varanids on designated cards)
- Dust, ash, cracked ground

**Avoid:**
- Active fire or burning
- Visible blood, gore, or violence
- Skulls scattered as decoration (Death's traditional skeleton is fine)
- "Mad Max" tribal/post-apocalyptic clichés
- Modern military or industrial wreckage that dates the imagery to a specific decade

---

## 6. Varanid presence

Varanids appear on **only five cards**:

| Card | Role | Notes |
|------|------|-------|
| 06 Älskarna | Central | Two monitor lizards in Clinch combat posture replace the human lovers entirely |
| 07 Vagnen | Pulling cart | Replace traditional sphinxes; two harnessed varanids draw the vehicle |
| 08 Styrkan | Central | Single varanid in rapport with human figure, Y-stick between them |
| 13 Döden | Background | Distant marching procession of varanid silhouettes |
| 21 Världen | Corner symbol | One of four corner symbols (replaces traditional bull or eagle) |

On all other cards: **no varanids**. The deck identity is established by the green edge, not by repeating the varanid motif.

When varanids appear, they are anatomically accurate water monitors (*Varanus salvator*) or Komodo dragons — heavy-bodied, scaled, tongue visible. Never anthropomorphized.

---

## 7. Operator-card distinction

Operator cards (Magikern, Lyckohjulet, Rättvisan, Måttlighet, Djävulen, Tornet, Månen) follow special rules:

- **Apocalyptic atmosphere is lighter.** The operator-tools remain *functional* even in ruin — they are what still works.
- **Patinated silver accent** preferred over the layer-range accent colors (with exceptions: Tornet uses dim crimson because K-critical is itself collapse; Djävulen uses dim crimson for captured-locals failure).
- **Symbol clarity prioritized.** The mathematical content of the card (lemniscate, scales, wheel, chalices) should be *cleaner* than the surrounding scene.

---

## 8. Style anchor (constant prompt fragment, applied to every card)

```
Detailed etched illustration in the style of Albrecht Dürer crossed with
mathematical research diagrams, dark muted color palette dominated by deep
black background with oxidized bronze and bone-white tones, dignified
post-civilizational-collapse atmosphere, classical tarot Major Arcana
iconography preserved and recognizable, weathered ruins in environment but
central figure intact, 2:3 vertical aspect ratio composition, central figure
or symbol with breathing negative space, no card frame or border in the
illustration itself, no text or typography or letters or numbers anywhere
in the image, no fantasy art tropes, no horror tropes, no zombie aesthetics,
no Mad Max clichés, no blood, no active fire, no modern industrial wreckage,
muted saturation under 60 percent, illustration not photograph
```

---

## 9. Negative prompt (constant, applied to every card)

```
frame, border, card border, text, typography, letters, numbers, card name,
card number, watermark, signature, modern graphic design, photorealism,
AI portrait style, anime, manga, fantasy art, lush color, vibrant
saturation, ornate decoration, horror, blood, gore, zombie, gothic,
cute, kawaii, photograph, screenshot, glowing effects, lens flare,
bokeh, smartphone photo, hdr
```

---

## 10. In-style vs out-of-style — explicit examples

**In style:**
- Dürer's *Knight, Death, and the Devil* (1513) — figures intact, atmosphere weighty
- Piranesi's *Carceri d'invenzione* — ruined architecture as dignified subject
- Anselm Kiefer's painted landscapes — post-collapse without horror
- Mathematical figures from topology textbooks — clean line, no fantasy

**Out of style:**
- Rider-Waite-Smith full-color tarot illustrations — too vibrant
- *Diablo* / *Dark Souls* concept art — too gothic, too active in violence
- Stable Diffusion default outputs — too smooth, too AI-portrait
- 1970s prog rock album art — too fantastical, too saturated
- Marvel cinematic universe — too cinematic, too lit

---

## 11. Per-card direction summary

Full per-card prompts in `prompts.json`. Quick orientation:

- **00 Narren** — Figure entering seismic crack in abandoned road, vegetation reclaiming concrete
- **01 Magikern** — Magician's table with four suits in ruined room, oxidized lemniscate
- **02 Översteprästinnan** — Throne between pillars under collapsed temple roof
- **03 Kejsarinnan** — Empress in feral overgrown garden, lichen on Venus shield
- **04 Kejsaren** — Emperor on cliff throne above empty wasteland kingdom
- **05 Hierofanten** — Hierophant with kneeling acolytes in roofless church
- **06 Älskarna** — Two grappling monitor lizards (varanid signature card)
- **07 Vagnen** — Chariot pulled by harnessed varanids past burned city
- **08 Styrkan** — Human and varanid in peace, Y-stick between them
- **09 Eremiten** — Cloaked figure on cracked peak, fluorescent lantern
- **10 Lyckohjulet** — Wheel stopped, sphinx noseless, four corner creatures stone
- **11 Rättvisan** — Justice with uneven scales, torn blindfold
- **12 Den Hängde** — Inverted figure on dead tree, fluorescent halo
- **13 Döden** — Armored skeleton-knight with distant varanid procession
- **14 Måttlighet** — Angel pouring through cracked leaking chalices
- **15 Djävulen** — Chained figures bound to algorithmic server-rack devil
- **16 Tornet** — Tower in active collapse with foreshadowing sheaf-fracture at base
- **17 Stjärnan** — Nude figure pouring poison-green water under clean stars
- **18 Månen** — Two towers, oversized distorted moon over highway-to-nowhere
- **19 Solen** — Child on horse under overexposed white sun, wilted sunflowers
- **20 Domen** — Trumpeting angel above rising J35 Draken pilots in flight suits
- **21 Världen** — Dancer in 18-layer manifold wreath, four Draken corner symbols

---

## 12. Iteration protocol

Generation proceeds in two phases:

**Phase A (test):** Generate 5 specified test cards (see `test_plan.md`). Iterate prompts on these until visual coherence is locked.

**Phase B (full):** Apply the locked prompt pattern to all 22 cards. Generate, review, re-roll outliers.

After Phase A locks the pattern, this style guide may be updated with corrections. The locked version is what governs Phase B.
