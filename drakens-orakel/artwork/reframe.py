#!/usr/bin/env python3
"""Re-frame all raw card images: auto-crop white borders, apply larger text."""

import json
import os
import sys
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np

ROOT = Path(__file__).resolve().parent
PROMPTS_PATH = ROOT / "prompts.json"
CARDS_PATH = ROOT.parent / "data" / "cards.json"
OUT_RAW = ROOT / "output" / "raw"
OUT_FRAMED = ROOT / "output" / "framed"
DEPLOY_DIR = ROOT.parent.parent / "static" / "orakel" / "cards"

FONT_CANDIDATES = [
    "C:/Windows/Fonts/consola.ttf",
    "C:/Windows/Fonts/consolab.ttf",
    "C:/Windows/Fonts/CascadiaMono.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
]


def load_font(size):
    for path in FONT_CANDIDATES:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                continue
    return ImageFont.load_default()


def auto_crop_white(img, threshold=200):
    """Remove white/light borders from image."""
    arr = np.array(img)
    # Create mask where pixels are darker than threshold (i.e., actual content)
    if len(arr.shape) == 3:
        gray = arr.mean(axis=2)
    else:
        gray = arr
    mask = gray < threshold

    # Find bounding box of non-white content
    rows = np.any(mask, axis=1)
    cols = np.any(mask, axis=0)

    if not rows.any() or not cols.any():
        return img

    rmin, rmax = np.where(rows)[0][[0, -1]]
    cmin, cmax = np.where(cols)[0][[0, -1]]

    # Add small margin (2px) to avoid cutting into content
    h, w = arr.shape[:2]
    rmin = max(0, rmin - 2)
    rmax = min(h - 1, rmax + 2)
    cmin = max(0, cmin - 2)
    cmax = min(w - 1, cmax + 2)

    return img.crop((cmin, rmin, cmax + 1, rmax + 1))


def resize_to_fill(img, target_w, target_h):
    """Resize to exactly fill target dimensions, cropping center if needed."""
    target_ratio = target_w / target_h
    src_w, src_h = img.size
    src_ratio = src_w / src_h

    if abs(src_ratio - target_ratio) < 0.01:
        return img.resize((target_w, target_h), Image.LANCZOS)

    if src_ratio > target_ratio:
        new_w = int(src_h * target_ratio)
        left = (src_w - new_w) // 2
        img = img.crop((left, 0, left + new_w, src_h))
    else:
        new_h = int(src_w / target_ratio)
        top = (src_h - new_h) // 2
        img = img.crop((0, top, src_w, top + new_h))

    return img.resize((target_w, target_h), Image.LANCZOS)


def apply_frame(raw_img, card_meta, frame_config):
    """Apply frame with auto-crop and larger typography."""
    # Auto-crop white borders
    cropped = auto_crop_white(raw_img)
    print(f"    raw={raw_img.size} -> cropped={cropped.size}")

    # The illustration fills the entire inner area (no padding between art and edge)
    edge_w = frame_config["edge_width_px"]
    text_zone_h = 100  # reserved at bottom for text overlay

    # Inner illustration area
    inner_w = 1152 - (2 * edge_w)  # 1104
    inner_h = 1728 - (2 * edge_w)  # 1680

    # Resize illustration to fill the entire inner area
    illustration = resize_to_fill(cropped, inner_w, inner_h)

    # Create canvas
    canvas = Image.new("RGB", (1152, 1728), frame_config["background_color"])
    canvas.paste(illustration, (edge_w, edge_w))

    draw = ImageDraw.Draw(canvas)

    # Green edge frame
    for i in range(edge_w):
        draw.rectangle(
            [i, i, 1151 - i, 1727 - i],
            outline=frame_config["edge_color"],
        )

    # Semi-transparent overlay at bottom for text readability
    overlay = Image.new("RGBA", (inner_w, text_zone_h), (10, 10, 10, 180))
    canvas_rgba = canvas.convert("RGBA")
    canvas_rgba.paste(overlay, (edge_w, 1728 - edge_w - text_zone_h), overlay)
    canvas = canvas_rgba.convert("RGB")
    draw = ImageDraw.Draw(canvas)

    # Typography - larger sizes
    typo_color = frame_config["typography_color"]
    accent_role = card_meta.get("accent_role", "operator")
    accent_color = frame_config.get(f"anchor_color_{accent_role}", frame_config["anchor_color_operator"])

    number_font = load_font(48)
    name_font = load_font(40)
    anchor_font = load_font(28)

    # Card number top-left
    number_str = f"{card_meta['number']:02d}"
    draw.text((edge_w + 16, edge_w + 12), number_str, fill=typo_color, font=number_font)

    # Card name bottom-center
    name_str = f"{card_meta['name_en'].upper()} / {card_meta['name_sv'].upper()}"
    name_bbox = draw.textbbox((0, 0), name_str, font=name_font)
    name_w = name_bbox[2] - name_bbox[0]
    name_x = (1152 - name_w) // 2
    name_y = 1728 - edge_w - text_zone_h + 14
    draw.text((name_x, name_y), name_str, fill=typo_color, font=name_font)

    # Anchor below name
    anchor_name = card_meta.get("anchor_display", "")
    anchor_bbox = draw.textbbox((0, 0), anchor_name, font=anchor_font)
    anchor_w = anchor_bbox[2] - anchor_bbox[0]
    anchor_x = (1152 - anchor_w) // 2
    anchor_y = name_y + 48
    draw.text((anchor_x, anchor_y), anchor_name, fill=accent_color, font=anchor_font)

    return canvas


def main():
    with open(PROMPTS_PATH, "r", encoding="utf-8") as f:
        prompts_data = json.load(f)
    with open(CARDS_PATH, "r", encoding="utf-8") as f:
        cards_data = json.load(f)

    cards_by_id = {c["id"]: c for c in cards_data["cards"]}
    prompts_by_id = {c["card_id"]: c for c in prompts_data["cards"]}

    OUT_FRAMED.mkdir(parents=True, exist_ok=True)
    DEPLOY_DIR.mkdir(parents=True, exist_ok=True)

    frame_config = prompts_data["frame_config"]

    for raw_file in sorted(OUT_RAW.glob("*_v1.png")):
        card_id = raw_file.stem.replace("_v1", "")
        if card_id not in cards_by_id:
            print(f"  [skip] {card_id} not in cards.json")
            continue

        card = cards_by_id[card_id]
        prompt_entry = prompts_by_id.get(card_id, {})
        anchor = card["primary_anchor"]
        anchor_display = f"{anchor['ref']} — {anchor['name']}" if anchor['kind'] == 'layer' else f"Operator: {anchor['name']}"

        card_meta = {
            "number": card["number"],
            "name_en": card["name_en"],
            "name_sv": card["name_sv"],
            "accent_role": prompt_entry.get("accent_role", "operator"),
            "anchor_display": anchor_display,
        }

        print(f"  [{card_id}]")
        raw_img = Image.open(raw_file).convert("RGB")
        framed = apply_frame(raw_img, card_meta, frame_config)

        framed_path = OUT_FRAMED / f"{card_id}_v1.png"
        framed.save(framed_path, "PNG", optimize=True)

        deploy_path = DEPLOY_DIR / f"{card_id}_v1.png"
        framed.save(deploy_path, "PNG", optimize=True)
        print(f"    -> {framed_path.name} + deployed")

    print("\nDone. Re-framed all cards.")


if __name__ == "__main__":
    main()
