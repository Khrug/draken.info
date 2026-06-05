#!/usr/bin/env python3
"""
Drakens Orakel — card artwork generation pipeline.

Phase A (test): generate 5 designated test cards with iteration support.
Phase B (full): generate all 22 cards using the locked prompt pattern.

Each generation produces:
  - raw/{card_id}_v{version}.png        — direct Gemini output (1024x1536)
  - framed/{card_id}_v{version}.png     — final framed card (1152x1728)
  - logs/generations.jsonl              — append-only log of every generation

Usage:
  # Test mode: generate the 5 test cards at version v1
  python generate.py --test --version 1

  # Iterate: regenerate single card with edited prompt at v2
  python generate.py --card 06-lovers --version 2

  # Full mode: generate all 22 cards at version 1 (after locking style)
  python generate.py --full --version 1

  # Force regeneration of existing file
  python generate.py --card 06-lovers --version 1 --force

Environment:
  GEMINI_API_KEY    Required. Google AI Studio API key.

Dependencies:
  pip install google-genai pillow
"""

from __future__ import annotations

import argparse
import datetime
import json
import os
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

from PIL import Image, ImageDraw, ImageFont

try:
    from google import genai
    from google.genai import types as genai_types
except ImportError:
    print("ERROR: google-genai not installed. Run: pip install google-genai pillow", file=sys.stderr)
    sys.exit(1)


# ===== Configuration =====

ROOT = Path(__file__).resolve().parent
PROMPTS_PATH = ROOT / "prompts.json"
CARDS_PATH = ROOT.parent / "data" / "cards.json"
LAYERS_PATH = ROOT.parent / "data" / "layers.json"
OUT_RAW = ROOT / "output" / "raw"
OUT_FRAMED = ROOT / "output" / "framed"
LOG_DIR = ROOT / "output" / "logs"

TEST_CARDS = [
    "06-lovers",        # Signature varanid card
    "16-tower",         # Most apocalyptic, test horror-drift risk
    "02-high-priestess",# Calm ruin, test dignified stillness
    "11-justice",       # Pure operator card, test functional-instrument lens
    "21-world",         # Most complex composition, test deck-completion piece
]

FONT_CANDIDATES = [
    "/System/Library/Fonts/Monaco.dfont",
    "/System/Library/Fonts/Menlo.ttc",
    "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
    "C:/Windows/Fonts/consola.ttf",
    "C:/Windows/Fonts/CascadiaMono.ttf",
]


# ===== Data loading =====

@dataclass
class CardPrompt:
    card_id: str
    card_type: str
    accent_role: str
    varanid_presence: str
    prompt_v1: str
    name_en: str
    name_sv: str
    number: int
    primary_anchor_name: str

    def full_prompt(self, style_anchor: str) -> str:
        return f"{style_anchor}\n\nSubject: {self.prompt_v1}"


def load_data():
    with open(PROMPTS_PATH, "r", encoding="utf-8") as f:
        prompts_data = json.load(f)
    with open(CARDS_PATH, "r", encoding="utf-8") as f:
        cards_data = json.load(f)

    cards_by_id = {c["id"]: c for c in cards_data["cards"]}

    card_prompts = {}
    for entry in prompts_data["cards"]:
        cid = entry["card_id"]
        card_meta = cards_by_id[cid]
        anchor = card_meta["primary_anchor"]
        anchor_name = f"{anchor['ref']} — {anchor['name']}" if anchor['kind'] == 'layer' else f"Operator: {anchor['name']}"
        card_prompts[cid] = CardPrompt(
            card_id=cid,
            card_type=entry["card_type"],
            accent_role=entry["accent_role"],
            varanid_presence=entry["varanid_presence"],
            prompt_v1=entry["prompt_v1"],
            name_en=card_meta["name_en"].upper(),
            name_sv=card_meta["name_sv"].upper(),
            number=card_meta["number"],
            primary_anchor_name=anchor_name,
        )

    return {
        "style_anchor": prompts_data["style_anchor"],
        "negative_prompt": prompts_data["negative_prompt"],
        "frame_config": prompts_data["frame_config"],
        "model_default": prompts_data["model_default"],
        "model_fallback": prompts_data["model_fallback"],
        "card_prompts": card_prompts,
    }


def load_font(size: int) -> ImageFont.FreeTypeFont:
    for path in FONT_CANDIDATES:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                continue
    print("WARNING: No monospace font found; using default. Install DejaVu Sans Mono for proper rendering.", file=sys.stderr)
    return ImageFont.load_default()


# ===== Gemini generation =====

def generate_raw(client: genai.Client, model: str, full_prompt: str, negative: str) -> bytes:
    """Call Gemini image API and return PNG bytes of the generated illustration."""
    config = genai_types.GenerateContentConfig(
        response_modalities=["IMAGE"],
    )
    # The negative prompt is appended as natural language instruction; Gemini handles it via prompt rather than separate field
    final = f"{full_prompt}\n\nAvoid these elements: {negative}"

    response = client.models.generate_content(
        model=model,
        contents=final,
        config=config,
    )

    for part in response.candidates[0].content.parts:
        if getattr(part, "inline_data", None) and part.inline_data.data:
            return part.inline_data.data

    raise RuntimeError("No image returned from Gemini API.")


# ===== Frame post-processing =====

def apply_frame(raw_bytes: bytes, card: CardPrompt, frame_config: dict) -> Image.Image:
    """Wrap raw illustration in green edge + typography frame."""
    from io import BytesIO

    raw_img = Image.open(BytesIO(raw_bytes)).convert("RGB")

    # Resize raw to canonical 1024x1536 (preserving aspect, may need crop)
    raw_img = _resize_to_aspect(raw_img, (1024, 1536))

    final_size = (1152, 1728)
    canvas = Image.new("RGB", final_size, frame_config["background_color"])

    edge_w = frame_config["edge_width_px"]
    pad = frame_config["inner_padding_px"]

    # Place raw centered within padded region
    inner_x = (final_size[0] - 1024) // 2
    inner_y = (final_size[1] - 1536) // 2
    canvas.paste(raw_img, (inner_x, inner_y))

    draw = ImageDraw.Draw(canvas)

    # Green edge frame: draw a rectangle at the very edge
    for i in range(edge_w):
        draw.rectangle(
            [i, i, final_size[0] - 1 - i, final_size[1] - 1 - i],
            outline=frame_config["edge_color"],
        )

    # Typography overlay
    typo_color = frame_config["typography_color"]
    accent_color = _accent_color_for(card.accent_role, frame_config)

    number_font = load_font(frame_config["number_font_size"])
    name_font = load_font(frame_config["name_font_size"])
    anchor_font = load_font(frame_config["anchor_font_size"])

    # Card number top-left (inside the edge + small margin)
    number_str = f"{card.number:02d}"
    draw.text((edge_w + 20, edge_w + 16), number_str, fill=typo_color, font=number_font)

    # Card name bottom-center (English / Swedish)
    name_str = f"{card.name_en} / {card.name_sv}"
    name_bbox = draw.textbbox((0, 0), name_str, font=name_font)
    name_w = name_bbox[2] - name_bbox[0]
    name_x = (final_size[0] - name_w) // 2
    name_y = final_size[1] - edge_w - 80
    draw.text((name_x, name_y), name_str, fill=typo_color, font=name_font)

    # Anchor name below card name, smaller, in accent color
    anchor_bbox = draw.textbbox((0, 0), card.primary_anchor_name, font=anchor_font)
    anchor_w = anchor_bbox[2] - anchor_bbox[0]
    anchor_x = (final_size[0] - anchor_w) // 2
    anchor_y = final_size[1] - edge_w - 48
    draw.text((anchor_x, anchor_y), card.primary_anchor_name, fill=accent_color, font=anchor_font)

    return canvas


def _resize_to_aspect(img: Image.Image, target_size: tuple[int, int]) -> Image.Image:
    """Resize image to target aspect ratio, cropping center if needed."""
    target_w, target_h = target_size
    target_ratio = target_w / target_h
    src_w, src_h = img.size
    src_ratio = src_w / src_h

    if abs(src_ratio - target_ratio) < 0.01:
        return img.resize(target_size, Image.LANCZOS)

    if src_ratio > target_ratio:
        # Too wide; crop sides
        new_w = int(src_h * target_ratio)
        left = (src_w - new_w) // 2
        img = img.crop((left, 0, left + new_w, src_h))
    else:
        # Too tall; crop top/bottom
        new_h = int(src_w / target_ratio)
        top = (src_h - new_h) // 2
        img = img.crop((0, top, src_w, top + new_h))

    return img.resize(target_size, Image.LANCZOS)


def _accent_color_for(role: str, fc: dict) -> str:
    return fc.get(f"anchor_color_{role}", fc["anchor_color_operator"])


# ===== Orchestration =====

def ensure_dirs():
    for d in (OUT_RAW, OUT_FRAMED, LOG_DIR):
        d.mkdir(parents=True, exist_ok=True)


def log_generation(entry: dict):
    log_file = LOG_DIR / "generations.jsonl"
    with open(log_file, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")


def generate_card(
    client: genai.Client,
    model: str,
    card: CardPrompt,
    version: int,
    data: dict,
    force: bool = False,
) -> Optional[Path]:
    raw_path = OUT_RAW / f"{card.card_id}_v{version}.png"
    framed_path = OUT_FRAMED / f"{card.card_id}_v{version}.png"

    if framed_path.exists() and not force:
        print(f"  [skip] {card.card_id} v{version} already exists. Use --force to regenerate.")
        return framed_path

    full_prompt = card.full_prompt(data["style_anchor"])
    print(f"  [gen]  {card.card_id} v{version} ...")

    try:
        raw_bytes = generate_raw(client, model, full_prompt, data["negative_prompt"])
    except Exception as e:
        print(f"  [ERR]  {card.card_id}: {e}", file=sys.stderr)
        log_generation({
            "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
            "card_id": card.card_id,
            "version": version,
            "model": model,
            "status": "error",
            "error": str(e),
        })
        return None

    with open(raw_path, "wb") as f:
        f.write(raw_bytes)

    framed = apply_frame(raw_bytes, card, data["frame_config"])
    framed.save(framed_path, "PNG", optimize=True)

    log_generation({
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
        "card_id": card.card_id,
        "version": version,
        "model": model,
        "prompt": full_prompt,
        "raw_path": str(raw_path.relative_to(ROOT)),
        "framed_path": str(framed_path.relative_to(ROOT)),
        "status": "ok",
    })

    print(f"  [ok]   {card.card_id} v{version} -> {framed_path.name}")
    return framed_path


def main():
    parser = argparse.ArgumentParser(description="Drakens Orakel — card artwork generation")
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--test", action="store_true", help="Generate the 5 test cards")
    mode.add_argument("--full", action="store_true", help="Generate all 22 cards (after style is locked)")
    mode.add_argument("--card", type=str, help="Generate a single card by ID (e.g., 06-lovers)")
    parser.add_argument("--version", type=int, default=1, help="Iteration version (default 1)")
    parser.add_argument("--force", action="store_true", help="Regenerate even if output exists")
    parser.add_argument("--model", type=str, default=None, help="Override Gemini model name")
    args = parser.parse_args()

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("ERROR: GEMINI_API_KEY environment variable not set.", file=sys.stderr)
        sys.exit(1)

    data = load_data()
    model = args.model or data["model_default"]
    client = genai.Client(api_key=api_key)

    ensure_dirs()

    if args.card:
        if args.card not in data["card_prompts"]:
            print(f"ERROR: Unknown card_id '{args.card}'", file=sys.stderr)
            sys.exit(1)
        targets = [args.card]
    elif args.test:
        targets = TEST_CARDS
    else:
        targets = list(data["card_prompts"].keys())

    print(f"Drakens Orakel generation — model={model} version={args.version}")
    print(f"Cards to generate: {len(targets)}")
    print()

    successes = 0
    failures = 0
    for cid in targets:
        card = data["card_prompts"][cid]
        result = generate_card(client, model, card, args.version, data, force=args.force)
        if result:
            successes += 1
        else:
            failures += 1

    print()
    print(f"Done. {successes} succeeded, {failures} failed.")
    print(f"Outputs in: {OUT_FRAMED}")
    print(f"Log: {LOG_DIR / 'generations.jsonl'}")


if __name__ == "__main__":
    main()
