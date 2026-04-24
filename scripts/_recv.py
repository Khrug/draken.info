#!/usr/bin/env python3
"""Receives base64 from stdin and writes decoded bytes to target file.

Usage: type file.b64 | python _recv.py <target_path>
"""
import sys, base64, os

if len(sys.argv) != 2:
    print("Usage: ... | python _recv.py <target>", file=sys.stderr)
    sys.exit(1)

target = sys.argv[1]
parent = os.path.dirname(target)
if parent:
    os.makedirs(parent, exist_ok=True)

# Read all of stdin as raw bytes, then decode as ASCII (base64 is ASCII-only)
# This avoids stdio text-mode decoding that gets confused by odd console encodings.
raw_stdin = sys.stdin.buffer.read()
# strip any whitespace bytes (spaces, newlines, tabs, CR)
b64 = b"".join(raw_stdin.split())

try:
    raw = base64.b64decode(b64)
except Exception as e:
    print(f"base64 decode failed: {e}", file=sys.stderr)
    print(f"got {len(b64)} base64 bytes, first 60: {b64[:60]!r}", file=sys.stderr)
    sys.exit(2)

with open(target, "wb") as f:
    f.write(raw)

print(f"wrote {len(raw)} bytes to {target}")
