#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

MSG="${1:-Update site}"

# Safety: refuse to commit obviously-bad paths even if .gitignore missed them.
BAD_PATTERNS='(^|/)(\.env($|\..*)|\.DS_Store|node_modules/|dist/|\.vite/|coverage/|.*\.pem$|.*\.key$)'
STAGED=$(git status --porcelain | awk '{print $2}' | grep -E "$BAD_PATTERNS" || true)
if [[ -n "$STAGED" ]]; then
  echo "Refusing to commit. The following paths look unsafe:"
  echo "$STAGED"
  echo "Add them to .gitignore or remove them, then retry."
  exit 1
fi

git add -A
git commit -m "$MSG"
git push
