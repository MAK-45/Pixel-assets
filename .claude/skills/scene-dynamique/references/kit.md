# Kit des scènes et format de `meta.scene`

`assets/scenes/_kit.px.js` est inclus par chaque scène, juste après la palette :

```js
include("../_palette.px.js")
include("_kit.px.js")
```

Il ne définit aucune partie, seulement des constantes et des fonctions. Le modifier change toutes les scènes :
après `npm run build`, `git status library/scenes/` doit montrer uniquement les changements voulus.

## Sommaire

1. Imports et tailles
2. Placement en bandes qui bouclent
3. Couleurs des périodes
4. Ciel, astres, étoiles, nuages
5. Terrains et acteurs
6. Format de `meta.scene`
7. Effets : paramètres

## 1. Imports et tailles

| Nom | Rôle |
|---|---|
| `PERIODS` | `["day", "dusk", "night", "overcast"]` |
| `PERIOD_LABELS` | `{ day: "Jour", dusk: "Crépuscule", night: "Nuit", overcast: "Sombre" }` (pour `meta.scene.periods`) |
| `imp(id, keys)` | `importAssets` + mémorise les tailles. `imp("nature/tree", ["pine_48"])` définit la partie `_tree_pine_48` (préfixe = nom de la famille, sans la catégorie). Renvoie `{ clé: { name, w, h, frames, ms } }`. |
| `SIZE[name]` | `{ w, h, … }` de toute partie importée : `SIZE["_tree_pine_48"].h` |

Les pixels importés sont en clés de palette : `swap`, `recolor` et les cartes de période marchent dessus. Une
animation importée reste une animation (et anime le sprite qui la pose : à éviter dans un plan, voir acteurs).

## 2. Placement en bandes qui bouclent

| Fonction | Rôle |
|---|---|
| `put(W, name, x, y, opts?)` | Liste d'ops `stamp` ; recopie la partie à `x − W` si elle dépasse à droite, à `x + W` si `x < 0`. |
| `plant(W, name, x, base, opts?)` | Comme `put`, mais `base` = ligne où la partie touche le sol (`y = base − h`). |
| `cput(c, W, name, x, y, opts?)` | Même chose dans une fonction de dessin `(c) => …`. |
| `flipIf(cond)` | `{ flip: "x" }` ou `{}`. Ne jamais écrire `{ flip: cond ? "x" : undefined }` : pxl refuse `undefined`. |
| `wave(W, base, [[amp, n, phase], …])` | Fonction `x → y` : somme de sinus. **`n` entier** = nombre de périodes sur `W`, d'où un raccord parfait. |

Exemple (bande de 1280 px, objets plantés sur un terrain ondulé) :

```js
const W = 1280
const top = wave(W, 47, [[2, 3, 0.5], [1.4, 7, 2], [0.8, 13, 4]])
const DECOR = [["_tree_pine_48", 30], ["_bush_round_32", 90], ["_rock_small_16", 220]]
const near = () => [
  field(W, top, 60),
  ...DECOR.flatMap(([name, x], i) => plant(W, name, x, top(x + SIZE[name].w / 2) + 6, flipIf(i % 3 === 1))),
]
for (const P of PERIODS) sprite(`_near_${P}`, { w: W, h: 60, swap: NEAR[P] }, ...near())
```

## 3. Couleurs des périodes

Clés d'ambiance de la palette : crépuscule `D a A f F` (prunes à contre-jour → lumière chaude), nuit `q j J t T`
(terres au clair de lune) et ciel `Q O M` (+ `U`), temps couvert `h H X W` (verts éteints).

| Carte | Où | Effet |
|---|---|---|
| `NEAR[P]` | plans proches (near, ground, acteurs) : `swap` du plan | jour = couleurs de la maison ; crépuscule = prunes, rouges/jaunes un cran plus sombres ; nuit = bleus-verts ; sombre = verts éteints, pierre et bois plus sombres. Le contour `k` reste. |
| `MID[P]` | mi-distance : `swap` du plan | un cran plus clair que `NEAR`, contour adouci (jour : verts vers le bleu-vert `p e E`). |
| `FAR[P]` | héros lointain : `swap` du placement | roche et neige réglées à la main (jour gris-bleu, crépuscule violets + neige rose/jaune, nuit bleus + neige pâle, sombre gris et neige ternie). |
| `FAR2[P]` | chaînes encore plus lointaines | presque la couleur du ciel. |
| `FRONT[P]` | premier plan | un cran plus sombre que le sol. |

Toutes les clés de la maison ont une valeur (les clés réglées à la main l'emportent, les autres suivent leur clarté
via `byTier(rampe)` ou leur rampe via `stepMap(n)`). Pour une matière qui rend mal, surcharge localement :

```js
const WATER_NEAR = { ...NEAR, night: { ...NEAR.night, u: "M", i: "U", I: "u" } }
```

Règles :
- **Un plan composé une fois, recoloré par période.** Soit `swap` sur le sprite du plan (`NEAR`, `MID`, `FRONT`),
  soit `swap` sur chaque placement quand un même plan mélange deux distances (`FAR` et `FAR2` dans les montagnes).
- **Pas de double recoloration** : `sprite("_x_night", { base: "_x_day", swap: NEAR.night })` n'est correct que si
  `_x_day` n'a pas de `swap`. Sinon, reconstruire chaque période à partir des mêmes ops (fonction `(P) => [...]`).
- Une couleur vraiment absente : l'ajouter à `assets/_palette.px.js` **avec sa rampe**, puis vérifier que
  `library/png/` n'a pas bougé (`git status library/png/`).

### Scènes au style pixelfx (assets fx*)

Les familles fx* (`fxtree`, `fxbush`, `fxhill`, `fxmountain`…) ont des rampes riches (clés `1 2 3 4 5 6 7 8 9 0 + < > = [ ]`)
que les cartes ci-dessus ignorent. Pour une scène faite de ces assets, utiliser leurs équivalents :

| Carte | Rôle |
|---|---|
| `FX_NEAR`, `FX_MID`, `FX_FAR2`, `FX_FRONT` | `NEAR`, `MID`, `FAR2`, `FRONT` prolongées par `fxMap` (chaque clé riche suit la clé de la maison du même rôle : `1` suit `G`, `<` suit `d`, `[` suit `m`…) ; le liseré `k` des pierres fx suit aussi l'ambiance (il tirerait au rouge la nuit). |
| `FX_FAR` | héros lointain fx (`fxmountain_peak_snow_128`) : pierre à 7 nuances et neige à 5 nuances recolorées palier par palier, facettes lisibles. |
| `fxMap(carte)` | prolonge une carte maison (surcharge locale). |

Exemple complet : `assets/scenes/summer_plain_fx.px.js` (ciel en bandes nettes `[clé, hauteur]` sans trame, astres
`fxsun`/`fxmoon` posés dans `_body_<période>`, nuages `fxcloud`, plafond d'orage fait de `fxcloud_storm_64`).

## 4. Ciel, astres, étoiles, nuages

| Nom | Rôle |
|---|---|
| `SKY` | dégradés par défaut : `{ day: "iIs", dusk: "Vvzoy", night: "QOMU", overcast: "dmmc" }` (du haut vers l'horizon) |
| `skySprites(grads = SKY, soft = 0.3)` | définit `_sky_<P>` (tuile 8 × 180 : bandes tramées sur 132 lignes, puis la dernière couleur). Garder `soft` ≈ 0,3 : à 0,6 les trames font de larges bandes pointillées. |
| `BODY` | cadre commun des astres `{ w: 112, h: 112 }`, posé par `body: { x: 30, y: 12 }` du plan `sky` |
| `bodySprites({ sun, dusk, moon, sunPart, moonPart })` | définit `_body_day` (soleil à `sun`, défaut `[0, 0]`), `_body_dusk` (disque couchant centré en `dusk`, défaut `[86, 92]`), `_body_night` (lune à `moon`, défaut `[2, 0]`). Par défaut `sunPart = "_sun_rays_32"`, `moonPart = "_moon_full_32"` (à importer) ; ex. `"_sun_pale_32"` en hiver, `"_moon_harvest_32"` en automne. |
| `sunsetDisc(cx, cy, r)` | ops du disque couchant (pour un cadre à soi) |
| `starField(count, maxY, seed, avoid = [0, 0, 78, 52], W = 320)` | fonction de dessin : points et petites croix, rien dans `avoid` (la lune). Importer `sky/star` `tiny_plus_8`. |
| `cloudBand(W, parts, seed, rows = [0, 40])` | fonction de dessin : nuages espacés de 30 à 120 px, hauteur au hasard dans `rows` |
| `NIGHT_CLOUD`, `STORM` | `swap` des nuages de nuit (`night_32`) et d'orage (`storm_32`, temps couvert) |
| `overcastCeiling(W, seed)` | plafond continu bosselé + lambeaux bas, dans un sprite `{ swap: STORM }`. Importer `cloud` `storm_32` et `puff_24`. |

Le soleil et la lune sont **en haut à gauche** : c'est de là que vient la lumière de tous les sprites de la maison.
Au crépuscule, le disque est bas, à demi caché par le relief ; vérifier qu'aucun objet du premier écran ne le cache.

## 5. Terrains et acteurs

| Nom | Rôle |
|---|---|
| `field(W, top, h, keys?)` | bande de terrain sous la ligne `top(x)` : contour, liseré, corps, fond. `keys = { edge: "k", rim: "L", lit: "l", body: "g", deep: "G" }` par défaut (herbe). Neige : `{ rim: "w", lit: "s", body: "s", deep: "S" }` ; sable : `{ rim: "Y", lit: "N", body: "N", deep: "n" }`. |
| `periodActor(nom, partie, cartes)` | définit `_act_<nom>_<P>` = l'animation importée recolorée par `cartes[P]` (ex. `NEAR`, `FRONT`). À déclarer dans `meta.scene.sprites` : `nom: "_act_<nom>_{period}"`. |
| `actorsAt(sprite, xs, y, { phaseStep = 337, loop = 800, flip = true })` | liste d'acteurs pour un plan : phases décalées, un sur deux retourné. `y` est relatif au haut du plan. |

Le sol (`ground`) reste propre à chaque biome (herbe et terre, neige, sable…) : s'inspirer de `soil` dans
`summer_plain.px.js`. Sa ligne du haut est plate, avec le contour `k` juste au-dessus de `groundY`.

## 6. Format de `meta.scene`

```js
scene: {
  type: "parallax",                 // scène dynamique (badge ⇄ Dynamique de la galerie)
  w: 320, h: 180, groundY: 150,     // base 16:9 et ligne des pieds
  periods: PERIOD_LABELS,           // variantes de la scène = ses périodes
  defaultPeriod: "day",
  planes: [ /* du fond vers l'avant */
    { id: "sky", label: "Ciel", kind: "sky", factor: 0, y: 0, image: "_sky_{period}",
      body: { image: "_body_{period}", x: 30, y: 12, periods: ["day", "dusk", "night"] } },
    { id: "clouds", label: "Nuages", factor: 0.05, drift: -3, driftBy: { overcast: -9 }, y: 4, image: "_clouds_{period}" },
    { id: "ground", label: "Sol", factor: 1, y: 132, image: "_ground_{period}", actors: [/* actorsAt(...) */] },
    { id: "front", label: "Premier plan", factor: 1.3, y: 150, front: true, optional: true, image: "_front_{period}" },
  ],
  sprites: { grass: "_act_grass_{period}", bird: "_bird_far_8" },   // acteurs et effets ; {period} ou partie unique
  effects: { day: [/* … */], dusk: [], night: [], overcast: [] },
  speed: { overcast: 2 },           // vitesse des acteurs par période (vent)
}
```

Champs d'un plan : `id` (unique), `label` (fr), `factor` (0 fixe, 1 sol, > 1 devant), `y` (haut du plan dans la
vue de base), `image` (modèle de nom avec `{period}`), `periods` (sous-liste, sinon toutes), `kind: "sky"` (tuile
répétée, haut de vue prolongé), `body`, `front: true` (dessiné après le personnage), `optional: true` (désactivable
par `createScene({ foreground: false })`), `drift` (px/s, `driftBy` par période), `loop` (vrai par défaut : la
bande se répète), `actors`.

Les positions calculées (acteurs, ancres des papillons) s'injectent après coup, `meta` restant en haut du fichier :
`meta.scene.planes.find((p) => p.id === "ground").actors = actorsAt(...)`.

Le build refuse une scène qui exporte des sprites (que des parties `_…`), une période sans image pour un plan, un
sprite d'effet absent de `sprites`, un `after` ou un `plane` inconnu.

## 7. Effets : paramètres

Coordonnées en pixels de base. `area` = `[x, y, w, h]`. `after` = id du plan après lequel dessiner l'effet.

| type | Paramètres | Usage |
|---|---|---|
| `twinkle` | `sprite`, `count`, `area` (écran) | étoiles qui scintillent puis changent de place (`star_tiny_twinkle_8`) |
| `shooting` | `sprite`, `every: [min, max]` ms, `area` (départ de la tête), `speed: [min, max]` px/s, `head: [x, y]` dans le sprite | étoile filante en diagonale, vers la gauche ou la droite (`star_streak_24`, `head: [1, 9]`) |
| `birds` | `sprite`, `every`, `count: [min, max]`, `y: [min, max]`, `speed`, `factor` (parallaxe, ≈ 0,12) | petit vol qui traverse le ciel (`bird_far_8`, `far_light_8` pour des mouettes) ; `after: "far"` ou `"mountains"` |
| `butterflies` | `sprites: [...]`, `plane`, `count`, `anchors: [[x, y], …]` (coordonnées du plan) | voltigent autour de points d'ancrage (au-dessus des fleurs) et défilent avec leur plan |
| `fireflies` | `sprites` ou `sprite`, `plane`, `count`, `area` (coordonnées du plan, `w` = largeur de la bande), `front` (part 0..1 dessinée devant le personnage) | lucioles qui flottent et clignotent |

Fréquences typiques : étoile filante toutes les 6 à 15 s, vol d'oiseaux toutes les 14 à 28 s. Le jeu peut tout
accélérer ou couper (`createScene({ frequency, effects: false })`).
