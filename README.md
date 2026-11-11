# Pixel Assets

Bibliothèque de **pixel art dessinée en code** par Claude avec le skill
[claude-pxl](https://github.com/crsolver/claude-pxl). Chaque dessin est une famille de variantes
(espèce, couleur, saison, état, taille…) exportée en PNG, en sprite sheet et en module JavaScript,
pour être réutilisée par des humains comme par d'autres agents IA.

| Catégorie | Familles | Variantes |
|---|---|---|
| Scènes | Plaine d'été : panorama **dynamique** 16:9 (base 320 × 180) en 8 plans de parallaxe qui bouclent à l'infini, 4 périodes (jour, crépuscule, nuit, sombre) avec animations d'ambiance | 4 |
| Nature | Arbre (chêne, sapin, bouleau, pommier × saisons × 16/32/48 px), Rocher (caillou, rocher, cairn, aiguille, escarpement, arche), Buisson, Herbe, Fleur, Fougère, Champignon | 80 |
| Paysage | Montagne (pics 16/32/64 px et 128 px de fond de scène, chaîne pour parallaxe, volcan animé, mesa), Colline (ronde, vallonnement, dunes × saisons) | 31 |
| Ciel | Nuage (beau temps, orage, pluie animée, coucher, nuit), Soleil, Lune, Étoile (dont petites étoiles et étoile filante de scène) | 44 |
| Faune | Oiseau, Papillon, Luciole (tous animés, à l'échelle d'une scène et en 16 px) | 18 |
| Objets | Potion (5 couleurs, 3 formes) | 12 |
| Personnages | Slime (animé, 4 couleurs, roi couronné) | 6 |

## Voir la galerie

- Ouvrir `docs/index.html` dans un navigateur (fichier autonome, aucune installation), ou
- `npm run dev` puis http://localhost:8080/web/ (rechargement automatique quand un dessin change).

La galerie range les dessins par catégorie et par famille, filtre les variantes par propriété, affiche
le code source pxl de chaque dessin, son module JS et ses pixels, et exporte le PNG à l'échelle ×1 à ×16.
Les scènes sont marquées **⇄ Dynamique** (parallaxe, défilement infini) ou **▣ Statique** (écran fixe) et
s'ouvrent dans une visionneuse : périodes, marche/course, résolutions simulées, plans, et bouton
**Exporter le code** (module JS autonome ou pack .zip PNG + JSON pour un autre moteur).

## Demander un dessin à Claude

Dans Claude Code, à la racine du dépôt :

```
/draw un coffre au trésor (bois, fer, or ; ouvert / fermé ; 16 et 32 px)
```

ou simplement « dessine un buisson avec des variantes ». Pour un décor de jeu complet :

```
/scene-dynamique une plage au coucher du soleil, avec des mouettes
```

(skill `scene-dynamique` : cadrage court, sélection d'assets, plans en parallaxe, 4 périodes, effets, test et
publication ; les scènes statiques auront leur propre skill). Claude suit `CLAUDE.md` : il dessine avec
claude-pxl, regarde chaque aperçu, crée plusieurs variantes, reconstruit la bibliothèque, commit, puis
publie la galerie en artefact.

## Utiliser les assets (humains et agents)

```js
import { find, loadVariant, draw } from "./library/index.js";
const v = await loadVariant("nature/tree/oak_autumn_32");
draw(ctx, v, 0, 0, { scale: 4 });       // ou v.src (PNG en data URL), v.rows + v.palette
```

Scène de jeu (module autonome, aucune dépendance) :

```js
import { createScene, fitCanvas } from "./library/scenes/summer_plain/summer_plain.js";
const view = fitCanvas(canvas);
const scene = await createScene({ period: "day", width: view.w, height: view.h });
// à chaque image : scene.update(dt, cameraX); scene.drawBack(view.ctx); <personnage>; scene.drawFront(view.ctx);
```

Guide complet : [`library/README.md`](library/README.md). Résumé pour les LLM : [`llms.txt`](llms.txt).

## Commandes

| Commande | Effet |
|---|---|
| `npm run build` | Construit `library/`, `docs/index.html` et `dist/gallery.html` (artefact) |
| `npm run check` | Valide tous les assets sans rien écrire |
| `npm run dev` | Galerie locale avec rechargement automatique |
| `npm run new -- <cat> <asset> "<Titre>"` | Crée le squelette d'une nouvelle famille |
| `npm run pxl -- build <fichier.px.js>` | CLI pxl : aperçus agrandis dans `<dossier>/out/_preview/` |
| `npm run scene -- <fichier.px.js> [--planes]` | Aperçus d'une scène (chaque période, chaque plan) dans `assets/scenes/out/_preview/` |

Prérequis : Node ≥ 22.18. Aucune dépendance npm.

## Organisation

```
assets/                 sources des dessins (.px.js) + palette commune + catégories
library/                bibliothèque générée : catalog.json, index.js, js/, png/, sheets/, scenes/, scene-runtime.js
web/                    interface de la galerie
docs/index.html         galerie autonome générée
scripts/                build, validation, serveur de dev, création d'asset
.claude/                configuration Claude Code : skills (claude-pxl, draw, scene-dynamique, grill-me, grilling), agent relecteur, hook
CLAUDE.md, AGENTS.md    règles pour les agents qui dessinent
```

## Crédits et licence

Moteur de dessin : [crsolver/claude-pxl](https://github.com/crsolver/claude-pxl) (MIT), copie intégrée
dans `.claude/skills/claude-pxl/` (voir `VENDORED.md`). La licence des dessins de ce dépôt reste à choisir
par son propriétaire.

Skills `grill-me` / `grilling` : [mattpocock/skills](https://github.com/mattpocock/skills) (MIT), copie intégrée
dans `.claude/skills/grill-me/` et `.claude/skills/grilling/` (voir `VENDORED.md`). Tape `/grill-me` pour
te faire interviewer sur une idée avant de la dessiner.
