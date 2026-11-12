# Plaine d’été : une carte 2,5D pour Couveuse

Une carte construite d’après la spécification `CARTE-2.5D.md`, avec les assets de Pixel Assets convertis au style
Couveuse. C’est un décor de nuit d’été, sur fond noir pur. Au fond, des montagnes, des collines et une rangée
d’arbres lointains. Au milieu, une prairie avec une mare, un chemin de terre, un grand chêne et ses champignons
lumineux, des rochers, des buissons et des fleurs. Devant, des herbes. Le ciel a des étoiles, une voie lactée, la
lune et une étoile filante par boucle. Des lucioles et des papillons flottent dans la prairie.

## Les fichiers

| Fichier | Rôle |
|---|---|
| `map.js` | **Le module livré** (ES, sans dépendance) : `MAP`, `OPTIONS`, `PALETTES`, `mapBack`, `mapItems`, `mapFront`, `canStand`, `segmentFree`, plus `standReason`, `fogAt` et `layout`. |
| `assets.js` | Les 43 assets convertis, au format du § 5.2 (teintes `"0"`–`"7"`, `"."` transparent). Ce fichier est **généré**. |
| `painter.js` | Le pinceau de test (même interface que le painter de pixelfx), qui marche dans Node et dans le navigateur. |
| `dummy-blob.js` | Le blob factice et `renderScene()`, l’ordre de dessin que Couveuse reprendra. |
| `check.mjs` | Les vérifications du § 11 dans Node. Elles doivent toutes être vertes. |
| `preview.html` | L’aperçu en un seul fichier (modules intégrés) : scène ×3, blob au clavier, réglages, palettes. Ce fichier est **généré**. |
| `shots/` | Les planches : `scene.png`, `loop-8.png` (8 instants d’une boucle), `depth.png`, `palettes.png`, `size-320x180.png`, `ground-settings.png`, `assets.png` (assets convertis). |
| `tools/` | `convert.mjs` (assets → `assets.js`), `bundle.mjs` (→ `preview.html`), `shots.mjs`, `crop.mjs`, `png.mjs`. |

```bash
npm run map          # convertit les assets, refait l’aperçu et les planches, lance les vérifications
node maps/plaine_ete/check.mjs
```

## Brancher la carte dans Couveuse

```js
import { mapBack, mapItems, mapFront, canStand, segmentFree, standReason, fogAt } from "./map.js";

const o = { W, H, D, palette, camX: 0, ...reglagesDecor }; // les réglages absents prennent leur valeur par défaut
mapBack(p, t, o);                          // lointain, fond, sol, ombres, reflets
const items = mapItems(t, o);              // [{ id, x, gy, layer, draw(p) }], déjà triés
items.push(blob, ...objets);               // chacun avec { id, x, gy, draw }
items.sort((a, b) => a.gy - b.gy || a.x - b.x || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
for (const it of items) it.draw(p);
mapFront(p, t, o);
```

- **`x` des items** : c’est la position à l’écran, caméra comprise. **`gy`** est la ligne de sol, donc la profondeur.
- **La brume du blob** : `fogAt(gy, o)` dit de combien de teintes assombrir ce qui se trouve à cette profondeur
  (`max(0, i − n)`). Le décor l’applique déjà à lui-même ; Couveuse peut faire de même pour le blob et ses objets.
- **Se déplacer** : `canStand(x, gy, o)` et `segmentFree(x0, gy0, x1, gy1, o)`. `standReason(x, gy, o)` renvoie la
  raison en français (« C’est dans la mare. », « Grand chêne est sur le passage. », « C’est hors du sol de la
  plaine. ») ou `null`.
- **Les tailles de scène** : la carte est écrite pour 480 × 270. Pour une autre taille, ou d’autres réglages
  d’horizon et de profondeur, `layout(o)` ramène tout au pixel près : x à l’échelle, gy par morceaux entre
  l’horizon, `gyBack` et `gyFront`. Les sprites, eux, gardent leur taille (un pixel d’asset vaut un pixel de scène).
- **Les palettes** : `PALETTES` contient Glace (celle de la spécification) et trois palettes d’essai (Sève, Braise,
  Aurore). Couveuse passe la sienne dans `o.palette`, et tout le décor la prend.

## Les réglages (`OPTIONS`)

| Clé | Libellé | Bornes | Défaut |
|---|---|---|---|
| `anim` | Animation du décor | 0 à 1 | 1 (0 fige tout, entre les deux l’amplitude des mouvements diminue) |
| `glow` | Lueur du décor | 0 à 2 | 1 |
| `fog` | Brume de profondeur | 0 à 3 | 1 |
| `snow` | Neige | 0 à 80 flocons | 0 |
| `stars` | Étoiles | 0 à 200 | 60 |
| `fireflies` | Lucioles | 0 à 60 | 24 |
| `horizon` | Hauteur de l’horizon | 20 à 70 % | 42 % |
| `gyBack` / `gyFront` | Profondeur du sol : fond / devant | en % | 55 % / 93 % |

La brume enlève 3 teintes au lointain et 2 au fond (les montagnes lointaines en perdent 1 ou 2 de plus). Dans la
prairie, elle va de `fog` teintes à `gyBack` jusqu’à 0 à `gyFront`, par paliers entiers. Avec `fog = 0`, il n’y a
plus de brume nulle part.

## Comment les assets ont été convertis (§ 5.1)

`tools/convert.mjs` part des modules de `library/js/` :

1. **Teintes** : la luminance Rec. 709 de chaque couleur est étalée sur une plage de teintes propre à chaque plan. Le
   jeu et le fond vont de 1 à 4, l’avant-plan de 0 à 1 (il est sombre et à peine éclairé). Une table `fix` permet de
   corriger une couleur à la main.
2. **Le contour noir devient un bord éclairé** : 6 en haut, 5 à gauche, 3 à droite, 2 en bas. Les traits noirs
   intérieurs passent en teinte 1.
3. **L’échelle** : les arbres (et les herbes et fougères de l’avant-plan) sont agrandis ×2 par Scale2x, qui lisse les
   diagonales sans créer de couleur. On trace ensuite un bord neuf d’un pixel autour, ce qui donne un grand chêne de
   94 px de haut à côté d’un blob de 48 px de large. Rochers, buissons et fleurs restent ×1.
4. **L’angle de vue** : tous les assets retenus sont vus de face.

Pour ajouter un asset, ajoute une ligne dans `SPECS` (`tools/convert.mjs`), place-le dans `MAP.items` (`map.js`),
puis lance `npm run map`.

## Ce qui bouge, et comment ça boucle

Tout est une fonction de la phase `u = ((t / D) % 1 + 1) % 1`, arrondie à 10⁻⁹ pour que `t` et `t + D` donnent
exactement le même `u`.

- **Ciel** : les étoiles scintillent (`sin(2π·k·u + φ)`, avec `k` entier) et une étoile filante passe une fois par boucle.
- **Prairie** : une vague de vent traverse l’herbe une fois par boucle, et la mare a ses rides et ses reflets.
- **Avant-plan** : les herbes ondulent avec un bruit lu sur un cercle du temps.
- **Animaux** : les papillons volent en huit, un nombre entier de tours par boucle. Les lucioles clignotent un nombre
  entier de fois par boucle.
- **Images d’animation** : les herbes au vent changent d’image selon `floor(u × turns × N) % N`.
- **Neige** : chaque flocon tombe un nombre entier de fois par boucle.

Le hasard est semé une fois au chargement (`MAP.seed`). Il n’y a ni `Math.random`, ni `Date.now`, ni état entre deux
images, et `check.mjs` le vérifie.

## Pas fait dans cette version

- Pas d’effet pixelfx demandé (`fx`). Le format le permettrait, mais l’aperçu ne saurait pas le dessiner.
- La carte fait exactement la largeur de la scène. `camX` décale déjà chaque plan selon sa parallaxe ; le ciel boucle
  sur lui-même, mais le reste n’est pas prévu pour défiler loin.
- Pas de recherche de chemin : seulement des trajets en ligne droite.
