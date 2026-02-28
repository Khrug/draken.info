#!/bin/bash
# publish.sh — Validate and publish a markdown post to draken.info
# Usage: ./scripts/publish.sh posts/2026-03-04-new-post.md
# Called by: OpenClaw Content Forge

set -e

POST_FILE="$1"

if [ -z "$POST_FILE" ]; then
  echo "ERROR: No post file specified"
  echo "Usage: ./scripts/publish.sh posts/YYYY-MM-DD-slug.md"
  exit 1
fi

if [ ! -f "$POST_FILE" ]; then
  echo "ERROR: File not found: $POST_FILE"
  exit 1
fi

# Validate front matter exists
if ! head -1 "$POST_FILE" | grep -q "^---"; then
  echo "ERROR: Missing YAML front matter"
  exit 1
fi

# Check required fields
for field in title drk date tags layers coherence status; do
  if ! grep -q "^${field}:" "$POST_FILE"; then
    echo "ERROR: Missing required field: $field"
    exit 1
  fi
done

# Check status is published
if ! grep -q 'status: published' "$POST_FILE"; then
  echo "WARNING: Post status is not 'published'. Set status: published to include in feed."
fi

echo "✓ Validation passed: $POST_FILE"

# Git add, commit, push
TITLE=$(grep "^title:" "$POST_FILE" | sed 's/^title: *//' | tr -d '"')
DRK=$(grep "^drk:" "$POST_FILE" | sed 's/^drk: *//')

git add "$POST_FILE"
git add static/data/
git commit -m "Publish: ${DRK} — ${TITLE}"
git push origin main

echo "✓ Published and deployed: ${DRK}"
echo "  Cloudflare Pages will build in ~30 seconds."
