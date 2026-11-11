# library/ — assets prêts à l'emploi (pour agents IA et développeurs)

Tout ce dossier est **généré** par `npm run build` à partir de `assets/` (sauf ce README).
Ne le modifiez pas à la main : modifiez la source `.px.js` puis reconstruisez.

## Contenu

| Chemin | Rôle |
|---|---|
| `catalog.json` | Index complet **sans pixels** : catégories, familles, variantes, tailles, propriétés, chemins. Commencez ici. |
| `index.js` | Point d'entrée ES module : `catalog`, `ids`, `load()`, `loadVariant()`, `find()` + helpers de `runtime.js`. |
| `index.d.ts` | Types TypeScript de tout ce qui suit. |
| `runtime.js` | Helpers sans dépendance : `draw`, `toCanvas`, `toPixels`, `toDataURL`, `loadImage`, `recolor`, `frameAt`, `toAscii`. |
| `js/<catégorie>/<asset>.js` | Un module ES par famille, **avec les pixels** de chaque variante. |
| `png/<catégorie>/<asset>/<variante>.png` | PNG à l'échelle 1 (bande horizontale pour une animation) ; `.gif` en plus pour les animations. |
| `sheets/<catégorie>/<asset>.png` + `.json` | Sprite sheet de la famille, JSON au format TexturePacker « hash » (Phaser, PixiJS, Godot…), avec `frameTags` pour les animations. |
| `scenes/<asset>/` | Paquet d'une **scène** : `<asset>.js` (module autonome prêt pour un jeu : moteur + images), `scene.json` + PNG de chaque plan par période (autres moteurs), `README.md`. |
| `scene-runtime.js` | Moteur des scènes : `createSceneFrom`, `fitCanvas` (parallaxe infinie, périodes en fondu, effets d'ambiance). |

Les chemins écrits dans le catalogue et les modules sont **relatifs à la racine du dépôt**
(ex. `library/png/nature/tree/oak_autumn_32.png`).

## Identifiants

- Famille : `"<catégorie>/<asset>"` → `nature/tree`
- Variante : `"<catégorie>/<asset>/<variante>"` → `nature/tree/oak_autumn_32`
- Nom du sprite dans la source : `"<asset>_<variante>"` → `tree_oak_autumn_32`

## Une variante

```js
{
  key: "oak_autumn_32", name: "tree_oak_autumn_32", id: "nature/tree/oak_autumn_32",
  label: "Chêne – automne (rouge-orangé)",        // libellé lisible (français)
  kind: "sprite",                                 // "sprite" | "anim" | "scene" (statique) | "parallax" (dynamique)
  w: 32, h: 32,                                   // pixels réels, contour inclus
  size: 32,                                       // taille nominale : 8/16/24/32/48/64/96/128…
  props: { species: "oak", season: "autumn", foliage: "full" },  // axes de variation filtrables
  tags: [],
  png: "library/png/nature/tree/oak_autumn_32.png",
  // --- uniquement dans les modules js/ (pas dans catalog.json) ---
  src: "data:image/png;base64,…",                 // PNG 1x prêt pour <img>, Phaser addBase64, etc.
  palette: { k: "#1a1423", R: "#6e1f24", … },     // clé -> couleur
  rows: ["......kkkk......", …],                  // une chaîne par ligne, "." = transparent
  // animations : frameCount, loopMs, gif, strip (data URL), gifSrc, frames: [{ ms, rows }]
}
```

`rows` + `palette` permettent de « lire » le dessin, de le recolorer ou de le redessiner sans décoder de
PNG. Si une variante a trop de couleurs pour une table de clés, `rows` et `palette` valent `null` :
utilisez `src`.

Chaque famille du catalogue donne aussi `axes` (toutes les valeurs de chaque `props`) et `sizes`
(tailles disponibles) pour choisir sans tout parcourir.

## Utilisation

### Dans le dépôt (navigateur ou Node ≥ 18)

```js
import { catalog, find, load, loadVariant, draw, toCanvas, toPixels, recolor, frameAt } from "./library/index.js";

// Chercher sans charger de pixels
find({ category: "nature", props: { season: "autumn" }, maxSize: 32 });
find({ text: "potion bleue" });
find({ tag: "tree", size: 16 });

// Charger
const tree = await load("nature/tree");                       // toute la famille
const v = await loadVariant("items/potion/blue_large");       // une variante

// Dessiner (canvas 2D, pixels nets à toute échelle)
draw(ctx, v, 10, 10, { scale: 4 });
document.body.append(toCanvas(v, { scale: 8 }));
draw(ctx, recolor(v, { u: "#c0392b" }), 0, 0, { scale: 2 }); // recoloration à la volée

// Animation
const slime = await loadVariant("characters/slime/green_idle");
draw(ctx, slime, 0, 0, { scale: 4, frame: frameAt(slime, performance.now()) });

// Node, sans canvas : pixels RGBA bruts
const { w, h, data } = toPixels(v);
```

### Sans cloner le dépôt

Remplacez `main` par la branche voulue.

```js
const RAW = "https://raw.githubusercontent.com/mak-45/pixel-assets/main/";
const catalog = await (await fetch(RAW + "library/catalog.json")).json();
const url = RAW + catalog.assets["nature/tree"].variants.oak_autumn_32.png;   // PNG direct

// Dépôt public : modules ES servis avec le bon type MIME par jsDelivr
const { default: tree } = await import("https://cdn.jsdelivr.net/gh/mak-45/pixel-assets@main/library/js/nature/tree.js");
```

Python (ou tout autre langage) : lisez `catalog.json`, puis téléchargez les PNG par leur chemin.

### Moteurs de jeu

- **Phaser** : `this.load.atlas("trees", "library/sheets/nature/tree.png", "library/sheets/nature/tree.json")`,
  puis `this.add.image(x, y, "trees", "oak_autumn_32")` ; animations via `frameTags`
  (`green_idle_0` … `green_idle_3`, tag `green_idle`) ou `this.textures.addBase64(key, v.src)`.
- **Godot / Unity / autres** : PNG individuels de `png/` (filtrage « nearest », sans compression), ou la
  sprite sheet + JSON.

Toujours afficher le pixel art sans lissage : `image-rendering: pixelated` en CSS,
`ctx.imageSmoothingEnabled = false` sur canvas, filtre « nearest » dans les moteurs.

## Scènes (catégorie `scenes`)

Une scène est un décor 16:9 complet (base 320 × 180, agrandi d'un facteur entier : ×4 = 720p, ×6 = 1080p,
×12 = 4K). Ses **variantes sont ses périodes** (ex. `day`, `dusk`, `night`, `overcast`) et son entrée du catalogue
porte un résumé `scene` :

- `type: "parallax"` (**dynamique**) : plusieurs plans (bandes qui bouclent sans couture) défilent chacun à sa vitesse
  (`factor` : 0 = fixe, 1 = vitesse du sol) quand la caméra bouge, à l'infini dans les deux sens ;
  `type: "static"` (**statique**) : un écran fixe. Le `kind` des variantes vaut `"parallax"` ou `"scene"`.
- `groundY` : ligne de sol (y des pieds du personnage) ; `planes` : plans du fond vers l'avant, `front: true` =
  dessiné devant le personnage.
- Les variantes n'ont pas de `rows` (images trop grandes) : `src` est l'aperçu de la période (caméra à 0).

Dans un jeu, le plus simple est le module autonome `scenes/<asset>/<asset>.js` (aucune dépendance) :

```js
import { createScene, fitCanvas } from "./library/scenes/summer_plain/summer_plain.js";
const view = fitCanvas(canvas);                       // { scale, w, h, ctx } : facteur entier + vue élargie
const scene = await createScene({ period: "day", width: view.w, height: view.h });
function loop(dt) {                                   // dt en ms
  scene.update(dt, cameraX);                          // position de la caméra en pixels de base
  scene.drawBack(view.ctx);                           // plans derrière le personnage
  drawPlayer(view.ctx, playerX, scene.groundY);       // le personnage, pieds sur la ligne de sol
  scene.drawFront(view.ctx);                          // premier plan
}
scene.setPeriod("night", { fade: 2000 });             // changement de période en fondu
```

Avec la bibliothèque : `const s = await load("scenes/summer_plain"); const scene = await createSceneFrom(s.scene, {...})`
(`createSceneFrom` et `fitCanvas` sont exportés par `index.js`). Autre moteur : `scenes/<asset>/scene.json` décrit les
plans (`factor`, `y`, `images.<période>.png`, acteurs animés) et les effets ; les PNG sont à côté.

## Compatibilité

`catalog.format` vaut `1`. Il augmentera si la structure change de façon incompatible (les scènes sont un ajout
compatible : nouvelle catégorie, nouveaux `kind`, champ `scene` optionnel).
