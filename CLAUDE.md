# Pixel Assets

Bibliothèque de pixel art **dessinée en code**. Tu dessines ce que l'utilisateur demande avec le
skill **claude-pxl** (moteur `pxl` de crsolver/claude-pxl, inclus dans `.claude/skills/claude-pxl/`),
puis le build produit des PNG, des modules JS et une galerie web. D'autres agents IA consomment les
assets via `library/` : garde ce dossier propre, cohérent et bien décrit.

## Règles d'or

1. **Toujours dessiner avec le skill `claude-pxl`** (charge-le avant de dessiner ; API complète dans
   `.claude/skills/claude-pxl/reference.md`). Pas de PNG fait à la main, pas d'autre outil.
2. **Toujours regarder le résultat** : lis `assets/<cat>/out/_preview/<nom>.png` après chaque build et
   corrige avant de continuer. Ne déclare jamais un dessin fini sans l'avoir vu.
3. **Toujours des variantes** : chaque demande devient une *famille* avec plusieurs variantes
   (forme/espèce, couleur/saison, densité/état, taille 16/32/48…). Vise 6+ variantes sauf consigne contraire.
   Étends une famille existante plutôt que d'en créer une en double (`library/catalog.json`).
4. **Ne jamais modifier à la main** `library/` (sauf `library/README.md`), `docs/index.html` ni `dist/` :
   ils sont générés par `npm run build`.
5. **Fin de chaque tâche** : `npm run build` sans erreur ni avertissement → commit + push →
   publier la galerie en artefact (voir « Artefact » plus bas) et donner le lien à l'utilisateur.

Le workflow complet est dans le skill `/draw` (`.claude/skills/draw/SKILL.md`).

## Commandes

```bash
npm run pxl -- build assets/nature/tree.px.js --only tree_oak_autumn_32   # aperçus d'un asset en cours
npm run pxl -- ascii assets/nature/tree.px.js tree_oak_autumn_32          # pixels en texte + règles x/y
npm run new -- <catégorie> <asset> "<Titre>"   # squelette d'une nouvelle famille
npm run check                                 # valide tous les assets sans écrire
npm run build                                 # library/ + docs/index.html + dist/gallery.html
npm run dev                                   # galerie sur http://localhost:8080/web/ (rechargement auto)
```

Node ≥ 22.18, aucune dépendance npm. Un hook (`.claude/settings.json`) valide chaque `.px.js` modifié
et renvoie les erreurs : corrige-les immédiatement.

## Structure

```
assets/_palette.px.js        palette commune (clés mnémotechniques + rampes) — incluse partout
assets/categories.json       catégories : titre, description, icône (id d'une variante), ordre
assets/<cat>/<asset>.px.js   SOURCE : une famille d'assets = un fichier, chaque sprite exporté = une variante
library/                     GÉNÉRÉ, consommé par les agents : catalog.json, index.js, js/, png/, sheets/
web/                         interface de la galerie (index.html, style.css, app.js) — à modifier ici
docs/index.html              GÉNÉRÉ : galerie autonome (GitHub Pages / ouverture directe)
scripts/                     build.js, check.js, dev.js, new-asset.js, lib/, templates/ (runtime.js, index.d.ts)
.claude/skills/claude-pxl/   moteur de dessin (vendored, voir VENDORED.md) ; draw/ = workflow du projet
```

## Conventions d'un asset

- Fichier `assets/<catégorie>/<asset>.px.js`, noms en minuscules (`a-z0-9_`, tirets pour les catégories).
- Première ligne : `include("../_palette.px.js")`. N'utilise que les clés de la palette commune ; si une
  couleur manque, ajoute-la dans `_palette.px.js` (avec sa rampe) plutôt qu'un `#hex` isolé.
- Un objet `const meta = { title, description, tags, variants }` en haut du fichier :
  - `title`, `description` : en français ; `description` dit ce que c'est et quelles variantes existent.
  - `tags` : mots-clés **anglais** en minuscules (recherche par les agents).
  - `variants.<clé>` : `{ label (fr), props: { axe: valeur }, tags? }`. Les `props` sont les axes de
    variation filtrables (`species`, `season`, `color`, `state`, `shape`…), valeurs anglaises courtes,
    mêmes noms d'axes dans toute la famille.
- Sprites exportés : `<asset>_<variante>` (ex. `tree_oak_autumn_32`) ; la clé de variante est la partie
  après `<asset>_`. Les parties privées commencent par `_` (`_leaf`, `_crown`).
- **Tailles** : la taille finale (contour inclus) tient dans une taille standard 16, 24, 32, 48, 64…
  Avec `outline: "k"`, dessine sur `(taille-2) × (taille-2)`. Suffixe `_16/_32/_48` quand une famille
  mélange les tailles.
- Recolorations = `base` + `swap` ; détails répétés = `_parts` + `stamp`/`scatter` ; familles = fonctions JS.
- Animations : `anim(...)` (4–8 images, durées multiples de 100 ms si possible) ; le build exporte bande + GIF.
- Termine le fichier par `sheet("<asset>s", ["<asset>_*"], { pad: 2 })` pour revoir toute la famille d'un coup.

## Style maison

- Contour `k` automatique (`outline: "k"`), lumière **en haut à gauche**, ombre en bas à droite.
- 2 à 4 nuances par matériau (rampes de la palette) ; pas de dégradés lisses ni de bruit décoratif.
- Ombrages par formes (grappes, croissants, faces) plutôt que par seuil linéaire.
- Silhouette lisible à 1×. Vérifie chaque taille à son échelle réelle, pas seulement agrandie.
- Vue de face (décors 2D) sauf demande contraire ; sol en bas du canevas pour les objets posés.

## Artefact (fin de tâche)

`npm run build` écrit `dist/gallery.html` (galerie complète, données incluses, format artefact).
Publie-le avec l'outil Artifact (`file_path: dist/gallery.html`). Si une URL est notée ci-dessous,
mets à jour **cet** artefact (paramètre `url`, après l'avoir lu avec `action: "read"`) au lieu d'en créer
un nouveau, puis donne le lien à l'utilisateur.

Galerie publiée : _(aucune pour l'instant — note ici l'URL après la première publication)_

## Consommation par d'autres agents

Documentée dans `library/README.md` (format des modules, API de `library/index.js`, URLs brutes) et
résumée dans `llms.txt`. Toute évolution du format de `library/` doit mettre à jour ces deux fichiers,
`scripts/templates/index.d.ts` et incrémenter `format` dans `scripts/build.js` si elle casse la compatibilité.
