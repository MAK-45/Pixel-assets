---
name: draw-fx
description: Dessiner un asset pixel art STATIQUE dans le style graphique de la bibliothèque pixelfx (rendu riche et réaliste, sans contour noir, volumes modelés par la lumière, 5 à 7 nuances franches) pour la bibliothèque Pixel Assets. Réunit le moteur de dessin claude-pxl et le style pixelfx. À utiliser dès que l'utilisateur demande un dessin « style pixelfx », « dans le style des arbres/roches/herbes fx », « réaliste comme pixelfx », une nouvelle famille fx* ou de nouvelles variantes d'une famille fx* (fxtree, fxrock, fxgrass). Pas pour un effet animé (c'est le skill pixelfx), ni pour un dessin au style maison à contour noir (c'est /draw).
argument-hint: "<ce qu'il faut dessiner dans le style pixelfx>"
---

# /draw-fx — dessiner dans le style pixelfx

Demande : $ARGUMENTS

Tu dessines **avec claude-pxl** (comme `/draw`) mais dans le **style graphique de pixelfx**, la bibliothèque
d'effets intégrée dans `.claude/skills/pixelfx/`. pixelfx sert de **modèle** : on regarde ses effets, on lit
son code, on reprend sa technique ; le dessin final reste un sprite pxl de la bibliothèque (`library/`).

Charge d'abord les skills **`claude-pxl`** (moteur, API dans `.claude/skills/claude-pxl/reference.md`) et
**`pixelfx`** (outils de rendu, catalogue). Les conventions du projet (`CLAUDE.md` : meta, nommage, tailles,
palette, build, artefact) et le déroulé de `/draw` s'appliquent, sauf le style maison (contour `k`) que ce
skill remplace. Familles de référence déjà faites ainsi : `assets/nature/fxtree.px.js`, `fxrock.px.js`,
`fxgrass.px.js`, avec leurs outils communs dans `assets/nature/_fx.px.js`.

## Ce que l'utilisateur attend (règles fermes)

1. **Statique = rien qui bouge.** Pas de feuilles ou pétales qui tombent, pas de lucioles, spores, particules,
   étincelles en l'air figées. Tout ce qui ne peut exister qu'en mouvement est interdit dans un sprite fixe.
   Une animation ne se fait que si l'utilisateur demande explicitement un asset animé.
2. **Juste l'objet.** Pas de décor autour ni au pied : pas d'herbe, de feuilles au sol, de cailloux, de
   congère, de flaque de lumière. Restent permis ce qui fait partie de l'objet (mousse ou neige posée *sur*
   une roche ou un arbre, liseré lumineux d'un objet magique) et l'ombre translucide au sol (`%`).
3. **Fidèle à pixelfx.** Chaque famille se compare à une référence pixelfx avant d'être livrée (étape 4).

## 1. Situer la demande

- `library/catalog.json` : la famille `fx<sujet>` existe-t-elle ? Si oui, ajoute des variantes dedans. Sinon
  crée `assets/<catégorie>/fx<sujet>.px.js` (`npm run new -- <cat> fx<sujet> "<Titre> (style pixelfx)"`).
  Ne mélange pas ce style dans une famille au style maison (`tree`, `rock`…) : familles séparées.
- Planifie les variantes dans `meta.variants` (espèce/forme, saison, surface, tailles 16/32/48/64), tags
  anglais dont `"pixelfx"`. Vise 6+ variantes. Pas de contour : on dessine sur la taille standard entière.

## 2. Trouver et étudier la référence dans pixelfx

Depuis `.claude/skills/pixelfx/` :

```bash
node tools/list.mjs <mots>            # cherche dans les 244 effets (ex. stone, leaf, water, snow, wood)
less docs/CATALOG.md                  # tout le catalogue par catégorie
```

Puis, depuis la racine du dépôt, rends les images utiles **agrandies** et regarde-les :

```bash
node .claude/skills/draw-fx/scripts/compare.mjs --ref nature/boulder@0 --ref nature/earth-spike@1.4 --scale 6
# -> out/_preview/refs.png   (effet@secondes ; recadré sur l'effet, --full pour l'image entière)
```

Ensuite **lis le code** de l'effet (`src/fx/<cat>/<nom>.js`, ses outils `src/fx/<cat>/_lib.js`, les rampes
`PAL` de `src/core/color.js`) : c'est là qu'est la technique (comment une pierre est découpée en facettes,
comment un brin d'herbe prend sa teinte). Note en une ligne ce que tu reprends.

Sujets déjà repérés : pierre → `nature/boulder`, `nature/earth-spike` (`drawRock`, `drawSpike`) ; herbe →
`weather/fireflies` (fonction `grass`) ; feuillage en volumes → nuage de `nature/spore-burst` ; plante, fleur →
`nature/healing-bloom` ; champignon → `nature/spore-burst` ; feuilles → `weather/falling-leaves` ; liane,
épines, racines → `nature/vine-whip`, `nature/thorns`, `nature/root-snare` ; bois, flamme → `fire/torch`.

### Si rien n'existe dans pixelfx pour ce sujet

Il faut le créer quand même, et **le comparer au style pixelfx** :

1. Prends les 2 ou 3 effets les plus proches **par la matière** (même rampe `PAL` : stone, wood, leaf, metal,
   water, ice, bone, gold…) ou **par la forme** (volume rond, facettes, brins, liquide), même si le sujet diffère.
2. Dessine en appliquant la charte ci-dessous, avec la rampe de la matière.
3. Compare côte à côte (étape 4) : à la même échelle, ton dessin doit avoir autant de nuances, la même
   netteté de paliers, le même type de bord et la même direction de lumière que ces effets. Dis à
   l'utilisateur quelles références ont servi, et que le sujet lui-même n'existait pas dans pixelfx.

## 3. Charte du style pixelfx (à appliquer en pxl)

| Point | Règle |
|---|---|
| Bord | **Jamais de contour noir** (`outline: "k"` interdit). Bord sélectif : les pixels au bord du vide prennent la teinte la plus sombre **du matériau** (un cran côté lumière, deux côté ombre). Les pierres ont en plus un liseré extérieur dans le palier le plus foncé de la pierre. |
| Lumière | En haut à gauche. Chaque volume a sa zone claire en haut à gauche et son ombre en bas à droite ; les volumes de devant jettent une ombre sur ceux du fond. |
| Nuances | 5 à 7 par matériau, en **paliers francs** (pas de dégradé lisse, pas de tramage). Ombres tirant vers le bleu, lumières vers le jaune. Le blanc pur seulement pour les points les plus chauds. |
| Formes | Ombrage **par formes** : calottes, croissants, facettes planes, brins. Hiérarchie grande masse > volume moyen > détail. |
| Texture | Jamais de grain pixel à pixel. Bruit lissé (`vnoise`, 2 px ou plus) pour découper les bords des formes ; paillettes très rares (3 %) sur la pierre. |
| Lumière émise | Objets lumineux : cœur clair, puis halo **translucide** dans l'air (clés `:` `;` turquoise, `^` `~` chaud), posé seulement sur le vide. Rend mieux sur fond sombre : le dire dans la description. |
| Sol | Objet posé en bas du canevas ; ombre portée translucide `%` décalée à droite, rien d'autre. |

Palette : seulement des clés de `assets/_palette.px.js`. Les rampes riches existent déjà (feuillus `1GglL2`,
bois `3BbnN`, conifères `4PpeE`, cerisier `56zZ7`, turquoise `890+`, pierre `kd<m>cC`, grès `3Bb=nN`). S'il manque
un cran, ajoute la clé **et** sa rampe dans la palette (calque les écarts sur la rampe `PAL` correspondante de
pixelfx), jamais un `#hex` isolé. Les clés libres sont rares (ponctuation) : n'en ajoute que si nécessaire.

## 4. Dessiner avec le kit, regarder, comparer

Début de fichier :

```js
include("../_palette.px.js")
include("../nature/_fx.px.js")   // "_fx.px.js" si le fichier est dans assets/nature/
```

Le kit (`assets/nature/_fx.px.js`) fournit : `Buf(w, h)` (tampon de clés : `get`, `set`, `flush(c)`), `pick(rampe, v)`,
`vnoise`, `hsh`, `clamp`, `selout(B, idx, rampe)` (bord sélectif), `groundShadow`, les rampes `LEAF`, `BARK` et la
lumière `LX, LY, LZ`. On peint dans le tampon par une fonction `(c) => { const B = Buf(c.w, c.h); …; B.flush(c) }`.
Reprends les constructeurs existants plutôt que d'en réécrire : `tree`/`crown`/`trunk`/`firCrown` (fxtree),
`stone`/`spire`/`moss`/`snowcap` (fxrock), `blade`/`tuft` (fxgrass). Un outil utile à plusieurs familles va dans le kit.

Boucle, une variante à la fois (la plus grande d'abord) :

```bash
npm run pxl -- build assets/<cat>/fx<sujet>.px.js --only fx<sujet>_<variante>   # puis lire out/_preview/<nom>.png
node .claude/skills/draw-fx/scripts/compare.mjs assets/<cat>/fx<sujet>.px.js --ref <effet>@<t> [--only a,b]
# -> assets/<cat>/out/_preview/fx<sujet>__vs_pixelfx.png : référence, puis nos sprites sur fond sombre et clair
```

**Lis la planche de comparaison** et corrige le pire défaut, au moins trois tours :

| Tu vois | Correction |
|---|---|
| plus pâle ou plus plat que la référence | baisse la valeur de base, garde le clair pour les calottes ; ajoute l'ombre portée entre volumes |
| volumes mous, « brocoli », pois réguliers | hiérarchie masses > grappes, tailles variées, bords découpés au bruit lissé |
| aspect « low-poly » ou fil de fer | moins de contraste entre facettes voisines, liseré clair seulement entre facettes très différentes |
| moucheté, damier | moins de petits éléments, espacer les traits, supprimer le bruit fin |
| silhouette en bloc, marches | profil continu (pointes, dents, brins), vérifier à 1× |
| illisible à taille réelle | moins de nuances, formes plus grandes, un seul point d'attention |
| halos carrés | halo rond : fort à 1 px, faible jusqu'à 2 ou 3 px |

`npm run build` ne refait pas les aperçus `out/_preview/` : relance `npm run pxl -- build` avant de les relire.

## 5. Vérifier et livrer

- Relis les trois règles fermes : rien qui bouge, rien autour, comparé à pixelfx.
- Planche de la famille (`out/_preview/fx<sujet>s.png`) : cohérence entre variantes et tailles, 16 px lisible.
- `npm run build` sans erreur ni avertissement ; aucun autre asset ne doit changer (`git status`).
- Commit + push, publication de la galerie (section « Artefact » de `CLAUDE.md`). Avant de republier, lis
  l'artefact : s'il contient des familles ou scènes absentes de ta branche, ne les écrase pas (construis la
  galerie avec la branche qui les porte, ou préviens l'utilisateur).
- Réponse : lien, tableau court des variantes, références pixelfx utilisées (ou « sujet absent de pixelfx,
  comparé à … »), et `loadVariant("<cat>/fx<sujet>/<variante>")`.
