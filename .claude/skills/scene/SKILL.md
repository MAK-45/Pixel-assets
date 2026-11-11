---
name: scene
description: "Construire une scène de jeu 16:9 pour Pixel Assets — panorama dynamique en parallaxe qui défile à l'infini, ou écran statique — avec ses périodes (jour, crépuscule, nuit, sombre), ses animations d'ambiance et l'export de son code pour un jeu. À utiliser dès que l'utilisateur demande une scène, un décor, un fond, un niveau, une map ou carte, un panorama, un background ou un biome (plaine, montagne enneigée, plage, forêt, désert, marais, grotte, village…), même sans dire « scène », et aussi pour modifier une scène existante (période, effet, plan, ambiance). Pas pour un sprite isolé : c'est /draw."
argument-hint: "<la scène à construire>"
---

# /scene — construire une scène de jeu

Demande : $ARGUMENTS

Tout le reste existe déjà : le moteur (`scripts/templates/scene-runtime.js`), le rendu des plans et le paquet
`library/scenes/<asset>/` (`scripts/lib/scene.js`), la galerie (vignettes animées, badges ⇄ Dynamique / ▣ Statique,
visionneuse, bouton « Exporter le code »). Une nouvelle scène, c'est **un fichier `assets/scenes/<asset>.px.js`**
plus les assets qui manquent dans la bibliothèque. Ne recode rien d'autre sans raison.

- Scène de référence, validée par l'utilisateur (« c'est exactement ça ») : `assets/scenes/summer_plain.px.js`.
  Relis-la avant d'écrire : c'est le meilleur exemple de tout ce qui suit.
- Outils partagés : `assets/scenes/_kit.px.js` (API dans [references/kit.md](references/kit.md)).
- Dessin : charge le skill `claude-pxl` (règle 1 de `CLAUDE.md`) ; la section « Scènes » de `CLAUDE.md` s'applique.

## Ce que l'utilisateur attend (déjà décidé avec lui, ne pas redemander)

- **16:9, base 320 × 180**, agrandie d'un facteur entier par le moteur (×4 720p, ×6 1080p, ×12 4K) ; vue élargie
  plutôt que bandes noires. Personnage d'environ **32 px**, **sol plat**, ligne des pieds `groundY = 150`.
- **Dynamique** (défaut) : plans en bandes qui bouclent sans couture, défilement infini dans les deux sens, caméra
  horizontale seulement. **Statique** : un écran fixe. Toujours dire lequel des deux : la galerie l'affiche.
- **4 périodes** : jour, crépuscule, nuit, sombre. « Sombre » = la météo grise du biome **sans la précipitation**
  (l'utilisateur ajoute lui-même pluie, etc.). Couleurs fixes par période, fondu entre elles dans le jeu.
- **Animations d'ambiance** propres à chaque période, déclenchées au hasard (étoiles filantes, oiseaux…).
- **Une sélection** d'assets : variée mais cohérente avec le biome, jamais « tout le catalogue ».

## Déroulé

### 1. Cadrer : une seule ronde courte

Lis la demande, `library/catalog.json` et la recette du biome dans [references/recipes.md](references/recipes.md).
Puis pose **une ronde** de questions numérotées, chacune avec ta recommandation (format `/grill-me` : « oui » valide
la recommandation), seulement sur ce qui reste ouvert :

1. dynamique ou statique (recommande dynamique sauf écran titre, menu, arène, intérieur fixe) ;
2. l'élément « héros » visible dès le premier écran (grand pic, mer, mesa…) et l'ambiance ;
3. ce que devient « sombre » dans ce biome (neige, tempête de sable…) et qui fait les précipitations ;
4. les animations par période (propose celles de la recette) ;
5. **les assets nouveaux à dessiner** (liste courte) : c'est le plus long, fais-le valider.

Si la demande est déjà précise et qu'aucun asset nouveau n'est nécessaire, annonce ton plan en quelques lignes et
enchaîne sans attendre. Les faits du dépôt, tu les cherches toi-même.

### 2. Les assets : sélectionner, puis combler les manques

- Choisis 20 à 30 variantes dans le catalogue : une saison, un biome, 3 ou 4 espèces ou formes pour la diversité.
  Note ce que tu écartes et pourquoi (hors saison, hors biome) : ça sert la réponse finale.
- Tailles par plan : lointain 16 px (ou les grands reliefs 64/128), mi-distance 16–32, proche 32–48, sol 16,
  premier plan 32 (coupé par le bas de l'écran).
- Ce qui manque devient d'abord **une famille de la bibliothèque** (workflow `/draw` : 6 variantes ou plus, aperçus
  vérifiés), pas une partie privée de la scène : les scènes suivantes la réutiliseront. Étends une famille
  existante quand c'est cohérent, sinon crée-en une (ex. `nature/palm` pour des palmiers).

### 3. Le squelette

```bash
node .claude/skills/scene/scripts/new-scene.mjs <asset> "<Titre>" [--static]
```

Il crée `assets/scenes/<asset>.px.js` qui se construit tel quel (8 plans standard, ou 6 en statique). Remplis
`meta` tout de suite : `title` et `description` en français (ce qu'on voit, les plans, chaque période et ses
animations, la ligne de sol), `tags` en anglais, un `label` et des `tags` par période.

### 4. Les plans, du fond vers l'avant

| Plan | factor | Bande | y (base 180) | Contenu | Couleurs |
|---|---|---|---|---|---|
| sky | 0 | tuile 8 px | 0–180 | dégradé + astre (`body`) | `skySprites`, `bodySprites` |
| stars | 0 | 320 | 0–110 | étoiles (crépuscule, nuit) | `starField` |
| clouds | 0,05 + `drift` | 960 | ≈4–68 | nuages espacés irrégulièrement | `cloudBand`, `overcastCeiling` |
| far | 0,1 | 640 | ≈30–134 | héros + chaînes lointaines | `FAR` / `FAR2` par placement |
| mid | 0,3 | 960 | ≈98–150 | relief + petits arbres 16 px | `MID` sur le plan |
| near | 0,6 | 1280 | ≈92–152 | bande de terrain ondulée + objets 32/48 | `NEAR` sur le plan |
| ground | 1 | 640 | 132–180, bord à 150 | sol plat + petit décor + acteurs | `NEAR` |
| front | 1,3, `front`, `optional` | 960 | 150–180 | 3 à 5 éléments sombres, coupés | `FRONT` |

Pourquoi ces règles :
- **Des largeurs différentes** (640/960/1280) : chaque plan se répète à son rythme, l'ensemble ne revient qu'après
  une vingtaine d'écrans. **Tout se place avec `put`/`plant`** (ce qui dépasse à droite revient à gauche) et les bords
  de terrain avec `wave` (nombre de périodes entier) : c'est ce qui rend la boucle invisible.
- **Composer dans les couleurs de la maison**, puis recolorer chaque période avec les cartes du kit : une seule
  composition, quatre ambiances cohérentes. Plans lointains sans contour noir et proches de la couleur du ciel.
- **Chaque objet tient sur la bande de son propre plan.** Un arbre posé sur un plan plus lent glisse et flotte.
  Chaque plan cache le pied du plan derrière lui (mid couvre la base de far, near celle de mid, ground celle de near).
- **Le premier écran (caméra 0) est la vignette de la galerie** : le héros y est visible, l'astre n'est pas caché
  derrière un arbre, la composition y est soignée.
- Après chaque plan : `npm run scene -- assets/scenes/<asset>.px.js --planes`, puis **lis**
  `assets/scenes/out/_preview/<asset>_<période>.png` (et `__<plan>.png`). Corrige avant de passer au suivant.

### 5. Les périodes

Le kit fournit les cartes `NEAR`, `MID`, `FAR`, `FAR2`, `FRONT`, les ciels, les astres, les étoiles et les nuages
(détails et surcharges dans [references/kit.md](references/kit.md)). Garde-les par défaut : elles font la cohérence
entre les scènes. Surcharge-les pour une matière qui rend mal (`{ ...NEAR.night, i: "M" }`) plutôt que de les
réécrire. Lis les quatre aperçus côte à côte et passe la liste de contrôle de
[references/pitfalls.md](references/pitfalls.md) : la plupart des défauts y sont déjà décrits avec leur correction.

### 6. Acteurs et effets

- **Acteurs** : animations posées dans un plan (herbe au vent, vagues…), recolorées par période avec
  `periodActor`, placées avec `actorsAt` (phases décalées, une sur deux retournée). `speed` accélère le vent par
  période (« sombre » : 2).
- **Effets** par période dans `meta.scene.effects` : `twinkle`, `shooting`, `birds`, `butterflies`, `fireflies`
  (paramètres dans [references/kit.md](references/kit.md)). Chaque effet se dessine après le plan `after`.
- Il manque un effet (neige qui tombe, vagues, aurore…) ? Ajoute-le au moteur en suivant
  [references/engine.md](references/engine.md), sans changer le comportement des scènes existantes.

### 7. Vérifier

```bash
npm run check && npm run build          # sans erreur ni avertissement
git status library/scenes/              # seule ta scène a bougé (sauf changement voulu du kit ou du moteur)
node .claude/skills/scene/scripts/test-scene.cjs <asset> --gallery
```

Le script teste le module exporté seul (chaque période après une marche, un fondu, la vue 1366 × 768) puis la
galerie (visionneuse, badge, export `.js` identique à la bibliothèque, `.zip` valide). **Lis les captures** de
`assets/scenes/out/_test/<asset>/` : effets visibles, rien qui flotte, rien de coupé au raccord.

### 8. Livrer (règle 5 de `CLAUDE.md`)

Commit (« Ajoute la scène <Titre> : … »), push, publication de `dist/gallery.html` sur l'artefact noté dans
`CLAUDE.md` (le lire avec `action: "read"` d'abord). Réponds avec le lien, le type (⇄ Dynamique / ▣ Statique), un
tableau période → animations, les assets créés, et l'utilisation dans un jeu :

```js
import { createScene, fitCanvas } from "./<asset>.js";   // bouton « Exporter le code » de la galerie
const view = fitCanvas(canvas);
const scene = await createScene({ period: "day", width: view.w, height: view.h });
// à chaque image : scene.update(dt, cameraX); scene.drawBack(view.ctx); <personnage>; scene.drawFront(view.ctx);
```

## Références

- [references/kit.md](references/kit.md) : API de `_kit.px.js`, format de `meta.scene`, paramètres des effets.
- [references/recipes.md](references/recipes.md) : recettes par biome (plans, assets existants, manques, effets).
- [references/pitfalls.md](references/pitfalls.md) : erreurs déjà rencontrées et liste de contrôle visuelle.
- [references/engine.md](references/engine.md) : étendre le moteur (nouvel effet, nouvelle option de plan).
