#!/usr/bin/env bash
# Met à jour la copie intégrée de crsolver/claude-pxl dans .claude/skills/claude-pxl.
# Usage : bash scripts/update-pxl.sh [ref]   (ref = branche, tag ou commit ; défaut : main)
set -euo pipefail
ref="${1:-main}"
root="$(cd "$(dirname "$0")/.." && pwd)"
dest="$root/.claude/skills/claude-pxl"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
git clone --quiet https://github.com/crsolver/claude-pxl.git "$tmp/pxl"
git -C "$tmp/pxl" checkout --quiet "$ref"
sha="$(git -C "$tmp/pxl" rev-parse HEAD)"
date="$(git -C "$tmp/pxl" log -1 --format=%cs)"
keep="$(cat "$dest/VENDORED.md")"
rm -rf "$dest"
mkdir -p "$dest"
(cd "$tmp/pxl" && tar --exclude=.git --exclude=.github --exclude=docs --exclude=.gitignore --exclude=.gitattributes -cf - .) | tar -xf - -C "$dest"
sed -i '0,/^name: pxl-pixel-art$/s//name: claude-pxl/' "$dest/SKILL.md"
printf '%s\n' "$keep" | sed -E "s/Commit d'origine : \`[0-9a-f]+\` \([0-9-]+\)/Commit d'origine : \`$sha\` ($date)/" > "$dest/VENDORED.md"
echo "claude-pxl mis à jour : $sha ($date)"
