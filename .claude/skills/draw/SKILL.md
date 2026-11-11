---
name: draw
description: Dessiner un nouvel asset pixel art (ou de nouvelles variantes) pour la bibliothèque Pixel Assets, de la demande jusqu'à la galerie publiée. À utiliser dès que l'utilisateur demande un dessin, un sprite, un objet, un décor, un personnage ou des variantes ("dessine un arbre", "ajoute des potions", "fais une version hiver").
argument-hint: "<ce qu'il faut dessiner>"
---

# /draw — dessiner pour la bibliothèque

Demande : $ARGUMENTS

Tu dessines **uniquement avec le skill `claude-pxl`** : charge-le maintenant (Skill `claude-pxl`) et garde
`.claude/skills/claude-pxl/reference.md` sous la main pour les options. Les conventions du projet sont
dans `CLAUDE.md` (meta, nommage, tailles, palette, style maison) : respecte-les.

## 1. Situer la demande

- Lis `library/catalog.json` (`categories`, `assets[*].axes`) : la famille existe-t-elle déjà ?
  Si oui, **ajoute des variantes au fichier existant** au lieu d'en créer un autre.
- Choisis la catégorie (`assets/categories.json`) ; une nouvelle catégorie seulement si aucune ne convient.
- Si la demande est ambiguë sur un point qui change tout le dessin (vue de dessus ou de face, style
  mignon ou réaliste, taille cible d'un jeu existant), pose une seule question ; sinon applique le
  style maison et avance.

## 2. Planifier les variantes (avant de dessiner)

Écris la liste des variantes dans `meta.variants` d'abord. Croise 2 à 4 axes pertinents pour le sujet :

| Axe (`props`)        | Exemples de valeurs                                  |
|----------------------|------------------------------------------------------|
| espèce / forme       | `species: oak/pine/birch`, `shape: round/bottle`    |
| couleur / matière    | `color: red/blue`, `material: wood/iron/gold`        |
| saison / état        | `season: summer/autumn/winter`, `state: idle/hurt`   |
| densité / usure      | `foliage: full/sparse/bare`, `condition: new/broken` |
| taille               | 16, 32, 48 px (suffixe `_16/_32/_48`)                |

Vise au moins 6 variantes, dont au moins 2 tailles quand ça a du sens (une icône 16 px simplifiée à la
main + une version 32 px détaillée). Les recolorations coûtent une ligne (`base` + `swap`) : profites-en.

## 3. Dessiner

**Scène** (décor de jeu 16:9, fond, niveau) : ce n'est pas ce skill, utiliser le skill **`/scene`**
(`.claude/skills/scene/SKILL.md`). `/draw` sert à y dessiner les assets qui manquent (palmier, cactus…).

1. Nouvelle famille : `npm run new -- <catégorie> <asset> "<Titre>"`, puis remplace l'exemple.
2. Dessine la variante principale (la plus grande / la plus représentative) en premier.
3. Boucle courte, une variante à la fois :
   ```bash
   npm run pxl -- build assets/<cat>/<asset>.px.js --only <asset>_<variante>
   ```
   **Lis** `assets/<cat>/out/_preview/<asset>_<variante>.png`. Pour corriger des pixels précis :
   `npm run pxl -- ascii assets/<cat>/<asset>.px.js <asset>_<variante>`.
4. Dérive les autres variantes (fonctions JS partagées, `base` + `swap`, `_parts` + `stamp`/`scatter`).
5. Revois toute la famille d'un coup : `npm run pxl -- build assets/<cat>/<asset>.px.js` puis lis
   `out/_preview/<asset>s.png` (la `sheet` de fin de fichier). Cherche : silhouettes illisibles,
   lumière incohérente, couleurs hors palette, tailles qui dépassent leur taille standard.

Le hook de validation signale les erreurs de `meta` et de nommage à chaque écriture : corrige-les.

## 4. Construire et vérifier

```bash
npm run build      # doit finir sans ERREUR ni avertissement
```

Vérifie dans la sortie que la famille a le bon nombre de variantes et les bonnes tailles
(`tailles 16/32/48`). Optionnel : `npm run dev` puis capture de `http://localhost:8080/web/`.

## 5. Livrer

1. `git add -A && git commit` (message : ce qui a été dessiné, ex. « Ajoute la famille bush : 8 variantes ») puis push.
2. Publie la galerie : outil Artifact avec `file_path: dist/gallery.html` (ou mise à jour de l'URL notée
   dans `CLAUDE.md`, section Artefact ; note-la si c'est la première publication).
3. Réponds à l'utilisateur : lien de l'artefact, familles/variantes ajoutées (tableau court), et
   comment un agent récupère l'asset (`loadVariant("<cat>/<asset>/<variante>")`).
