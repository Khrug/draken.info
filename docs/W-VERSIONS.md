# Watertightness W — version history

W is a structural score, not Γ. Any change to its components, weights, thresholds or patterns after results have been seen is a new version, recorded here.

## W v2 — 2026-10-01 (current)

**Change:** component c₅ (posts with a DRK-131 falsification block) removed. Numbering of the other components is kept; c₅ is not reused.

**Reason (Khrug):** W should measure the internal logic and factualness of the posts. Whether a post carries a falsification section is a matter of form, not of internal logic or factual grounding. As a binary per-post factor it also set W = 0 for 45 of 81 posts regardless of their referencing.

**Formula:**

$$W = \big(c_7^{3}\,c_1\,c_2\,c_3\,c_4\,c_6\big)^{1/8},\qquad W_{\text{post}} = \big(c_7^{3}\,c_1\,c_6\big)^{1/5}$$

**Effect at release:** corpus W 0.691 → 0.730; posts at W = 0: 47 → 9 (those 9 have no claim paragraph carrying a reference, c₇ = 0); median per-post W 0 → 0.615. c₇ patterns unchanged from v1.

The post standard still asks for a Falsification (DRK-131) section; it is no longer scored.

## W v1 — 2026-10-01

$$W = \big(c_7^{3}\,c_1\,c_2\,c_3\,c_4\,c_5\,c_6\big)^{1/9},\qquad W_{\text{post}} = \big(c_7^{3}\,c_1\,c_5\,c_6\big)^{1/6}$$

c₅ = posts with a falsification block. Released value W = 0.691 (c₁ 0.98, c₂ 0.94, c₃ 1.00, c₄ 0.96, c₅ 0.44, c₆ 1.00, c₇ 0.45). c₇ patterns tuned and frozen against docs/w-c7-tuning-sample.md.
