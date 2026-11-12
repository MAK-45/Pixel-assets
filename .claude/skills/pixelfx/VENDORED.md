# pixelfx (copie intégrée)

Ce dossier est une copie de **https://github.com/patch-gg/pixelfx** (licence MIT, voir `LICENSE` et `NOTICE.md` ;
la police de `gallery/fonts` a sa propre licence, voir `gallery/fonts/NOTICE.md`) : la bibliothèque d'effets et
d'animations pixel art (244 effets) et son skill. Elle est intégrée au dépôt pour que tout agent qui clone le projet
utilise exactement la même version, sans installation (Node seul ; ffmpeg facultatif pour GIF/MP4).

- Commit d'origine : `5294518ce7c72e48b6100a744596e0acf57f2826` (2026-11-12)
- Fichiers exclus : `.git/`, `.github/`, `.claude-plugin/`, `docs/readme/` (GIF de démonstration, 12 Mo),
  `package-lock.json`, `skills/` (déplacé, voir ci-dessous)
- Modifications : `skills/pixelfx/SKILL.md` est placé à la racine (`SKILL.md`) pour que les chemins `tools/`, `src/`,
  `docs/` soient relatifs à ce dossier, et l'étape « Before anything » dit de travailler ici au lieu de cloner le dépôt.
- Les rendus vont dans `records/` et `sheets/` de ce dossier (ignorés par git, `.gitignore` d'origine).
- `tools/build-gallery.mjs` demande `esbuild` (dépendance de dev, non installée) : inutile pour rendre ou exporter.

Mettre à jour : `bash scripts/update-pixelfx.sh [<ref>]`, puis rendre un effet pour vérifier
(`cd .claude/skills/pixelfx && node tools/render.mjs fire/torch`).
