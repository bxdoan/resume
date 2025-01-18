#!/bin/bash
set -e

NOW=$(date +%Y.%-m%d.%-H%M)
echo -n "$NOW" > .version

git add -f .version && git commit -m "ci($NOW): ✨🐛🚨"

TARGET=${1:-origin}
echo "---------------------------"
printf "Pushing... $NOW --> %s\n" "$TARGET"
echo "---------------------------"
git push "$TARGET"
