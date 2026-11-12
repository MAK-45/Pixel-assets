#!/usr/bin/env bash
# Met à jour la copie intégrée de patch-gg/pixelfx dans .claude/skills/pixelfx.
# Usage : bash scripts/update-pixelfx.sh [ref]   (ref = branche, tag ou commit ; défaut : main)
set -euo pipefail
ref="${1:-main}"
root="$(cd "$(dirname "$0")/.." && pwd)"
dest="$root/.claude/skills/pixelfx"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
git clone --quiet https://github.com/patch-gg/pixelfx.git "$tmp/fx"
git -C "$tmp/fx" checkout --quiet "$ref"
sha="$(git -C "$tmp/fx" rev-parse HEAD)"
date="$(git -C "$tmp/fx" log -1 --format=%cs)"
keep=""; [ -f "$dest/VENDORED.md" ] && keep="$(cat "$dest/VENDORED.md")"
rm -rf "$dest"
mkdir -p "$dest"
(cd "$tmp/fx" && tar --exclude=./.git --exclude=./.github --exclude=./.claude-plugin --exclude=./docs/readme \
  --exclude=./skills --exclude=./package-lock.json -cf - .) | tar -xf - -C "$dest"
# Le skill est à la racine de la copie : les chemins tools/, src/, docs/ du SKILL.md sont relatifs à ce dossier.
cp "$tmp/fx/skills/pixelfx/SKILL.md" "$dest/SKILL.md"
perl -0pi -e 's/1\. Work in a pixelfx checkout\..*?\n2\. Check it runs: `node tools\/render\.mjs fire\/torch` writes `records\/fire\/torch\/contact\.png`\./1. In Pixel Assets, the pixelfx checkout is vendored in `.claude\/skills\/pixelfx\/` (see `VENDORED.md`): run every\n   command below from that folder (`cd .claude\/skills\/pixelfx`), never clone another copy. No install step.\n2. Check it runs: `node tools\/render.mjs fire\/torch` writes `.claude\/skills\/pixelfx\/records\/fire\/torch\/contact.png` (ignored by git)./s' "$dest/SKILL.md"
grep -q "vendored in" "$dest/SKILL.md" || { echo "SKILL.md : patch « Before anything » non appliqué" >&2; exit 1; }
[ -n "$keep" ] && printf '%s\n' "$keep" | sed -E "s/Commit d'origine : \`[0-9a-f]+\` \([0-9-]+\)/Commit d'origine : \`$sha\` ($date)/" > "$dest/VENDORED.md"
echo "pixelfx mis à jour : $sha ($date)"
