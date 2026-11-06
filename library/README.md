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
  kind: "sprite",                                 // "sprite" | "anim" | "scene"
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

## Compatibilité

`catalog.format` vaut `1`. Il augmentera si la structure change de façon incompatible.
