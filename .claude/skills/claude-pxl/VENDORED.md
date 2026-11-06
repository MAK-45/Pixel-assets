# claude-pxl (copie intégrée)

Ce dossier est une copie de **https://github.com/crsolver/claude-pxl** (licence MIT, voir `LICENSE`),
le moteur `pxl` et son skill de dessin. Il est intégré au dépôt pour que tout agent qui clone le projet
dessine avec exactement la même version, sans installation.

- Commit d'origine : `21fee41f7ecce00bc868d7567f24ffd0f3acc8fa` (2026-10-14)
- Fichiers exclus : `.git/`, `.github/`, `docs/` (images de démonstration), `.gitignore`, `.gitattributes`
- Seule modification : `name: claude-pxl` dans l'en-tête de `SKILL.md` (au lieu de `pxl-pixel-art`),
  pour que le skill porte le nom utilisé dans ce projet.

Mettre à jour : `bash scripts/update-pxl.sh [<ref>]`, puis `npm run check && npm run build` et vérifier
que la galerie n'a pas changé de façon inattendue (`git diff --stat library/`).
