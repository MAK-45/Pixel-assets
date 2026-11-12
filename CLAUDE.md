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

## Effets et animations VFX (`pixelfx`)

Pour les **effets** pixel art (feu, explosions, magie, impacts, projectiles, météo, pickups, transitions… : 244 effets
prêts) et leurs planches de sprites, utilise le skill **`pixelfx`** (bibliothèque patch-gg/pixelfx, copie intégrée dans
`.claude/skills/pixelfx/`, voir `VENDORED.md`). Ses commandes se lancent **depuis ce dossier**
(`cd .claude/skills/pixelfx && node tools/render.mjs fire/torch`) ; les rendus vont dans `records/` (ignoré par git).
Mise à jour : `bash scripts/update-pixelfx.sh [<ref>]`.

## Dessiner dans le style pixelfx (`/draw-fx`)

Pour un asset **statique** au rendu riche de pixelfx (sans contour noir, volumes modelés par la lumière, 5 à 7
nuances franches), utilise le skill **`/draw-fx`** (`.claude/skills/draw-fx/SKILL.md`) : il dessine avec claude-pxl
en prenant les effets pixelfx pour modèle, et compare chaque famille à sa référence avec
`node .claude/skills/draw-fx/scripts/compare.mjs`. Familles faites ainsi : `nature/fxtree`, `nature/fxrock`,
`nature/fxgrass` (outils communs : `assets/nature/_fx.px.js`). Règles de l'utilisateur pour ces assets : rien qui
bouge figé dans un sprite fixe (feuilles qui tombent, lucioles…), rien autour de l'objet (herbe, feuilles au sol).

## Cuisiner une idée (`/grill-me`)

Quand l'utilisateur tape `/grill-me`, ou demande de le « cuisiner », « challenger », « grill » sur une idée,
un plan ou une nouvelle famille d'assets, utilise le skill **`grilling`** (Matt Pocock, copie intégrée dans
`.claude/skills/grill-me/` et `.claude/skills/grilling/`, voir `VENDORED.md`) : interview par *rounds*,
questions numérotées avec ta réponse recommandée, et **aucune action** (dessin, build, commit) avant que
l'utilisateur confirme que vous êtes alignés. Les faits du dépôt (catalogue, palette, familles existantes)
se cherchent toi-même, sans les demander. Une fois l'idée arrêtée, enchaîne avec `/draw` si c'est un dessin.

## Commandes

```bash
npm run pxl -- build assets/nature/tree.px.js --only tree_oak_autumn_32   # aperçus d'un asset en cours
npm run pxl -- ascii assets/nature/tree.px.js tree_oak_autumn_32          # pixels en texte + règles x/y
npm run scene -- assets/scenes/summer_plain.px.js --planes                # aperçus d'une scène (périodes + plans)
node .claude/skills/scene-dynamique/scripts/new-scene.mjs <asset> "<Titre>"     # squelette d'une scène dynamique
node .claude/skills/scene-dynamique/scripts/test-scene.cjs <asset> --gallery    # test navigateur d'une scène construite
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
assets/nature/_fx.px.js      outils communs des familles fx* (style pixelfx) ; fichiers « _ » ignorés par le build
assets/<cat>/<asset>.px.js   SOURCE : une famille d'assets = un fichier, chaque sprite exporté = une variante
assets/scenes/<asset>.px.js  SOURCE d'une scène : parties privées + meta.scene (variantes = périodes)
assets/scenes/_kit.px.js     outils communs des scènes (placement en boucle, couleurs des périodes, ciel, nuages)
library/                     GÉNÉRÉ, consommé par les agents : catalog.json, index.js, js/, png/, sheets/
web/                         interface de la galerie (index.html, style.css, app.js) — à modifier ici
docs/index.html              GÉNÉRÉ : galerie autonome (GitHub Pages / ouverture directe)
scripts/                     build.js, check.js, dev.js, new-asset.js, scene-preview.js, lib/ (library.js, scene.js),
                             templates/ (runtime.js, index.d.ts, scene-runtime.js = moteur des scènes exporté)
.claude/skills/claude-pxl/   moteur de dessin (vendored, voir VENDORED.md) ; draw/ = workflow d'un asset ;
                             scene-dynamique/ = workflow d'une scène dynamique (kit, modèle, test, recettes par biome) ;
                             pixelfx/ = bibliothèque d'effets VFX + son skill (vendored, voir VENDORED.md) ;
                             draw-fx/ = workflow d'un asset statique au style pixelfx (+ scripts/compare.mjs)
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

## Scènes (décors de jeu 16:9)

**Scène dynamique** (décor qui défile en parallaxe, fond ou niveau de platformer/runner) : workflow complet dans le
skill **`/scene-dynamique`** (`.claude/skills/scene-dynamique/SKILL.md`). Référence validée par l'utilisateur :
`assets/scenes/summer_plain.px.js`. **Scène statique** (écran fixe) : un skill dédié est prévu, pas encore écrit ;
en attendant, demander à l'utilisateur comment procéder.

Une scène = `assets/scenes/<asset>.px.js` (inclut `../_palette.px.js` puis `_kit.px.js`). Elle ne définit que des **parties privées** (`_nom`) et se décrit dans
`meta.scene` ; ses **variantes sont ses périodes** (`day`, `dusk`, `night`, `overcast`…). Toujours dire si elle est :

- **dynamique** (`type: "parallax"`) : plans en bandes qui bouclent sans couture (largeurs différentes par plan,
  2 à 4 écrans), chacun avec son `factor` (0 = fixe … 1 = sol … >1 = premier plan devant le personnage) ;
- **statique** (`type: "static"`) : un écran fixe (plans en `factor: 0`), mêmes périodes et effets possibles.

La galerie affiche le badge ⇄ Dynamique ou ▣ Statique d'après ce type. Conventions :

- Base **320 × 180** (agrandie d'un facteur entier par le moteur, vue élargie si l'écran ne tombe pas juste),
  personnage d'environ 32 px, `groundY` = ligne des pieds (150 pour la Plaine d'été).
- Réutiliser les assets existants avec `importAssets("<cat>/<asset>", ["variante", …])` : chaque variante devient la
  partie `_<asset>_<variante>` (pixels en clés de palette, donc `swap` marche). Faire une sélection, pas tout utiliser.
- Composer chaque plan dans les couleurs de la maison, puis le recolorer par période avec `swap` : clés d'ambiance de la
  palette (crépuscule `D a A f F`, nuit `q j J t T` et ciel `Q O M`, temps couvert `h H X W`). Plans lointains sans
  contour noir et proches de la couleur du ciel (perspective atmosphérique), plans proches au style maison.
- `meta.scene` : `planes` (`image: "_plan_{period}"`, `y`, `factor`, `front`, `optional`, `drift`, `actors` animés),
  `sprites` (acteurs et effets), `effects` par période (`twinkle`, `shooting`, `birds`, `butterflies`, `fireflies`),
  `speed`. Le moteur (`scripts/templates/scene-runtime.js`) est le même dans la galerie et dans l'export.
- Regarder `assets/scenes/out/_preview/<asset>_<période>.png` (et `__<plan>.png` avec `--planes`) après chaque essai.
- Le build écrit `library/scenes/<asset>/` : module autonome `<asset>.js` (bouton « Exporter le code » de la galerie),
  `scene.json` + PNG des plans, README.

## Artefact (fin de tâche)

`npm run build` écrit `dist/gallery.html` (galerie complète, données incluses, format artefact).
Publie-le avec l'outil Artifact (`file_path: dist/gallery.html`). Si une URL est notée ci-dessous,
mets à jour **cet** artefact (paramètre `url`, après l'avoir lu avec `action: "read"`) au lieu d'en créer
un nouveau, puis donne le lien à l'utilisateur.

Galerie publiée : https://claude.ai/artifact/PA6pqoVNvPzmVja58HBe54 (privée : partage via le menu Share de la page)

## Consommation par d'autres agents

Documentée dans `library/README.md` (format des modules, API de `library/index.js`, URLs brutes) et
résumée dans `llms.txt`. Toute évolution du format de `library/` doit mettre à jour ces deux fichiers,
`scripts/templates/index.d.ts` et incrémenter `format` dans `scripts/build.js` si elle casse la compatibilité.
