# AGENTS.md

Instructions pour les agents IA (Codex, Cursor, Gemini, Claude…) qui travaillent sur ce dépôt.

- **Vous voulez utiliser des assets** : lisez `library/README.md` (ou `llms.txt`). Tout est dans `library/`,
  index dans `library/catalog.json`. Ne lancez rien : les fichiers sont déjà construits.
- **Vous voulez dessiner ou modifier des assets** : les règles complètes sont dans `CLAUDE.md` (elles
  valent pour tous les agents). En bref :
  1. Dessinez uniquement avec le DSL pxl : lisez `.claude/skills/claude-pxl/SKILL.md` puis `reference.md`.
     La CLI est `node .claude/skills/claude-pxl/bin/pxl.js` (Node ≥ 22.18, aucune installation).
  2. Une famille = `assets/<catégorie>/<asset>.px.js` avec `const meta = {…}` et des sprites `<asset>_<variante>` ;
     palette commune `assets/_palette.px.js`.
  3. Regardez les aperçus `assets/<cat>/out/_preview/*.png` avant de valider un dessin.
  4. `npm run check` puis `npm run build` ; ne modifiez jamais `library/` ni `docs/index.html` à la main.
- **Vous voulez construire une scène de jeu dynamique** (décor 16:9 en parallaxe qui défile) : suivez
  `.claude/skills/scene-dynamique/SKILL.md` (kit `assets/scenes/_kit.px.js`, modèle, test, recettes par biome).
