# Pixel Assets

Bibliothèque de **pixel art dessinée en code** par Claude avec le skill
[claude-pxl](https://github.com/crsolver/claude-pxl). Chaque dessin est une famille de variantes
(espèce, couleur, saison, état, taille…) exportée en PNG, en sprite sheet et en module JavaScript,
pour être réutilisée par des humains comme par d'autres agents IA.

| Catégorie | Familles | Variantes |
|---|---|---|
| Nature | Arbre (chêne, sapin, bouleau, pommier × saisons × 16/32/48 px), Rocher (caillou, rocher, cairn, aiguille, escarpement, arche), Buisson, Herbe, Fleur, Fougère, Champignon | 80 |
| Paysage | Montagne (pics 16/32/64 px, chaîne pour parallaxe, volcan animé, mesa), Colline (ronde, vallonnement, dunes × saisons) | 29 |
| Objets | Potion (5 couleurs, 3 formes) | 12 |
| Personnages | Slime (animé, 4 couleurs, roi couronné) | 6 |

## Voir la galerie

- Ouvrir `docs/index.html` dans un navigateur (fichier autonome, aucune installation), ou
- `npm run dev` puis http://localhost:8080/web/ (rechargement automatique quand un dessin change).

La galerie range les dessins par catégorie et par famille, filtre les variantes par propriété, affiche
le code source pxl de chaque dessin, son module JS et ses pixels, et exporte le PNG à l'échelle ×1 à ×16.

## Demander un dessin à Claude

Dans Claude Code, à la racine du dépôt :

```
/draw un coffre au trésor (bois, fer, or ; ouvert / fermé ; 16 et 32 px)
```

ou simplement « dessine un buisson avec des variantes ». Claude suit `CLAUDE.md` : il dessine avec
claude-pxl, regarde chaque aperçu, crée plusieurs variantes, reconstruit la bibliothèque, commit, puis
publie la galerie en artefact.

## Utiliser les assets (humains et agents)

```js
import { find, loadVariant, draw } from "./library/index.js";
const v = await loadVariant("nature/tree/oak_autumn_32");
draw(ctx, v, 0, 0, { scale: 4 });       // ou v.src (PNG en data URL), v.rows + v.palette
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

Prérequis : Node ≥ 22.18. Aucune dépendance npm.

## Organisation

```
assets/                 sources des dessins (.px.js) + palette commune + catégories
library/                bibliothèque générée : catalog.json, index.js, js/, png/, sheets/
web/                    interface de la galerie
docs/index.html         galerie autonome générée
scripts/                build, validation, serveur de dev, création d'asset
.claude/                configuration Claude Code : skills (claude-pxl, draw), agent relecteur, hook
CLAUDE.md, AGENTS.md    règles pour les agents qui dessinent
```

## Crédits et licence

Moteur de dessin : [crsolver/claude-pxl](https://github.com/crsolver/claude-pxl) (MIT), copie intégrée
dans `.claude/skills/claude-pxl/` (voir `VENDORED.md`). La licence des dessins de ce dépôt reste à choisir
par son propriétaire.
