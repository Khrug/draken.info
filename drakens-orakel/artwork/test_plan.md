# Test Plan — Phase A: 5-Card Iteration

**Purpose:** Lock the visual style on 5 stress-test cards before committing to full 22-card generation. Each test card is chosen to probe a different failure mode of the style.

---

## The 5 test cards

| # | Card | Why this card | What to check |
|---|------|--------------|--------------|
| 1 | **06 Lovers (Älskarna)** | Signature varanid card; black + green most pronounced | Are the varanids anatomically accurate water monitors? Is the Clinch posture readable as combat-rapport not violence? Does the green/black palette dominate without becoming flat? |
| 2 | **16 Tower (Tornet)** | Most apocalyptic surface card; horror-drift risk highest | Does the collapse read as dignified-mathematical or as horror? Is the foreshadowing sheaf-fracture at the base visible without overwhelming the main tower? Lightning rendered without becoming dramatic-cinematic? |
| 3 | **02 High Priestess (Översteprästinnan)** | Calm ruin; tests dignified stillness in the lens | Throne + pillars + veil + scroll all preserved and recognizable? Roof collapse evident without becoming dramatic? Posture composed not anxious? |
| 4 | **11 Justice (Rättvisan)** | Pure operator card; tests "operators stay functional" rule | Are scales and sword cleaner than the background? Is the broken balance (uneven scales, torn blindfold) readable? Does the silver-patinated palette work? |
| 5 | **21 World (Världen)** | Most complex composition; tests multi-element coherence | Are all four corner symbols (varanid, seismograph, SSD, heart tissue) present and identifiable? Is the 18-layer manifold wreath readable as spiral topology not generic frame? Central dancer dignified? |

These 5 collectively cover: varanid central, varanid background-absent, operator-clean, atmospheric-calm, atmospheric-dramatic, multi-element complex.

---

## Iteration protocol

For each card, generate at increasing version numbers until the result satisfies the success criteria. Document changes between versions.

```bash
# Generate v1 for all 5 test cards
python generate.py --test --version 1

# Review outputs in output/framed/
# If any card needs iteration, edit its prompt_v1 field in prompts.json
# Re-generate just that card at v2:
python generate.py --card 06-lovers --version 2

# Continue iterating per-card until satisfied
```

**Recommended iteration cycle: 3 versions per card maximum.** If v3 is still not converged, the underlying prompt direction needs reconsideration — go back to STYLE_GUIDE.md, not deeper into prompt-tuning.

---

## Success criteria

Before unlocking Phase B (full 22-card generation), all 5 test cards must satisfy:

### Universal criteria (every card)

- [ ] Black background dominates (>50% of pixel area is `#0A0A0A` or darker)
- [ ] No on-illustration text, letters, or numbers
- [ ] Classical tarot iconography immediately recognizable
- [ ] Saturation visibly muted (no bright primary colors)
- [ ] Composition follows 2:3 vertical with central element in upper-middle
- [ ] No horror tropes (blood, gore, screaming faces, dripping)
- [ ] No fantasy-art tropes (glowing magic, lens flares, smooth airbrush)
- [ ] Green edge frame renders correctly in post-processing
- [ ] Card number and name typography legible in framed version

### Per-card specific criteria

**06 Lovers:**
- [ ] Two varanids identifiable as water monitors (heavy body, scaled, tongue possibly visible)
- [ ] Clinch posture: bodies intertwined, forelegs gripping (combat-rapport not violence)
- [ ] Background eclipse/seismic cloud replacing archangel
- [ ] Withered Eden tree visible in background
- [ ] Black + deep green dominant; minimal other color

**16 Tower:**
- [ ] Tower in active collapse, recognizable as tower (not just rubble)
- [ ] Lightning bolt visible
- [ ] Two figures falling
- [ ] At base: smaller sheaf-fracture pattern visible
- [ ] Dim crimson accent without becoming red-saturated

**02 High Priestess:**
- [ ] Seated frontal figure between two pillars
- [ ] Veil/curtain visible between pillars
- [ ] Roof partially collapsed, sky/moon visible through breaks
- [ ] Scroll on lap
- [ ] Composed dignified posture (not in distress)
- [ ] Vegetation between floor tiles

**11 Justice:**
- [ ] Seated frontal figure on throne
- [ ] Sword raised in one hand
- [ ] Scales held in other hand, visibly uneven (book vs stone)
- [ ] Blindfold torn revealing one eye
- [ ] Throne intact
- [ ] Silver-patinated palette dominant

**21 World:**
- [ ] Central dancing figure with two wands
- [ ] Wreath surrounding figure, visible as spiral topological structure
- [ ] All four corner symbols present and identifiable: varanid, seismograph, SSD, heart muscle
- [ ] Composition balanced and ceremonial
- [ ] Aged gold accent without becoming yellow-bright

---

## Common failure modes and corrections

| Failure mode | Symptom | Correction |
|-------------|---------|-----------|
| **Generic AI portrait** | Faces too smooth, anime-adjacent | Strengthen Dürer reference, add "rough etched lines" to prompt |
| **Too dark to read** | Subject lost in black background | Increase contrast of central figure, lighter rim-light from one side |
| **Too bright** | Looks like normal tarot deck | Reduce saturation explicitly, lean into oxidation language |
| **Horror drift** | Card reads as scary not dignified | Add "serene", "composed", "dignified" to subject; remove dramatic light |
| **Sci-fi drift** | Looks like cyberpunk concept art | Strengthen "engraving" and "classical" language; remove technology references except where required |
| **Varanid wrong** | Looks like generic lizard or dragon | Specify "Varanus salvator water monitor" or "Komodo dragon"; reference photo if possible |
| **Edge frame breaks** | Post-processing green edge looks misaligned | Inspect `apply_frame()` output; may need to adjust inner padding |

---

## Locking the style

When all 5 test cards satisfy criteria:

1. **Document what worked.** In `STYLE_GUIDE.md`, append a "Locked v1" section noting which prompt patterns succeeded.
2. **Commit the locked prompts.** Tag the `prompts.json` commit as `artwork-v1-locked` in git.
3. **Update other 17 cards.** Apply lessons from the 5 test cards to the prompt fields of cards not yet generated. Maintain consistency.
4. **Run Phase B.** `python generate.py --full --version 1`
5. **Review and re-roll outliers.** Some cards may need v2/v3 individually.

---

## Handoff note to Claude Code

This test plan is meant to be executed iteratively by Claude Code Desktop with file-system access. The expected interaction loop:

1. Run `python generate.py --test --version 1`
2. Open the 5 framed outputs in `output/framed/`
3. Show them to Khrug for review
4. For any card needing iteration, edit `prompts.json` based on Khrug's feedback
5. Re-run that single card at v2
6. Iterate until 5/5 pass
7. Apply lessons to remaining 17 prompts in `prompts.json`
8. Run `python generate.py --full --version 1`
9. Final review and selective re-rolls

Do not run Phase B before Phase A is locked. The cost of mis-styled bulk generation is much higher than the cost of one extra iteration round on the 5 test cards.
