#!/bin/bash
# update-data.sh — Refresh system data and push to trigger rebuild
# Called by: OpenClaw cron (every 6 hours)
# 
# In Phase 1 (now): Manually update JSON files
# In Phase 3+: This script queries Pinecone for real KO counts and coherence

set -e

DATA_DIR="static/data"
SYSTEM_FILE="$DATA_DIR/system.json"

# Count published posts
PUB_COUNT=$(find posts/ -name "*.md" -exec grep -l "status: published" {} \; 2>/dev/null | wc -l)

# Read current system data
if [ -f "$SYSTEM_FILE" ]; then
  # Update pub_count and timestamp
  # Using node for JSON manipulation (available since we have node in the build)
  node -e "
    const fs = require('fs');
    const data = JSON.parse(fs.readFileSync('$SYSTEM_FILE', 'utf-8'));
    data.pub_count = $PUB_COUNT;
    data.last_updated = new Date().toISOString();
    fs.writeFileSync('$SYSTEM_FILE', JSON.stringify(data, null, 2));
    console.log('✓ Updated system.json — pubs:', data.pub_count);
  "
else
  echo "WARNING: $SYSTEM_FILE not found"
  exit 1
fi

# Check if there are changes to push
if git diff --quiet "$DATA_DIR/"; then
  echo "  No data changes to push."
else
  git add "$DATA_DIR/"
  git commit -m "Data update: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  git push origin main
  echo "✓ Data pushed. Cloudflare Pages will rebuild."
fi
