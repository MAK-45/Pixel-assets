# Pièges déjà rencontrés et liste de contrôle

Tout ce qui suit a coûté une itération sur la Plaine d'été. Lire avant de composer, relire avant de livrer.

## Erreurs de construction

- **`{ flip: undefined }`** dans des options de placement : pxl refuse la valeur. Utiliser `flipIf(cond)`.
- **Double recoloration** : `sprite("_front_night", { base: "_front_day", swap: FRONT.night })` alors que
  `_front_day` porte déjà `swap: FRONT.day` : les cartes s'enchaînent et les couleurs sont fausses. Reconstruire
  chaque période depuis les mêmes ops (`for (const P of PERIODS) sprite(\`_x_${P}\`, { …, swap: MAP[P] }, ...ops())`),
  ou ne prendre en `base` qu'une version jour **sans** `swap`.
- **Nom d'une partie importée** : `_<famille>_<variante>` sans la catégorie (`imp("nature/tree", ["pine_48"])` →
  `_tree_pine_48`).
- **`meta` reste en haut** du fichier : les positions calculées plus bas (acteurs, ancres) s'injectent ensuite avec
  `meta.scene.planes.find(…).actors = …` et `meta.scene.effects.<période>[i].anchors = …`.
- **Une animation posée dans un plan l'anime en entier** (et multiplie ses images) : les éléments animés sont des
  **acteurs** (`periodActor` + `actorsAt`), le plan reste fixe.
- **Couleur ajoutée à la palette** : toujours avec sa rampe, puis `git status library/png/` (rien ne doit bouger
  ailleurs). Les clés `a`, `f` et les chiffres sont des couleurs pico8 de base : les surcharger seulement exprès.

## Défauts visuels et leur correction

| Défaut | Cause | Correction |
|---|---|---|
| Larges bandes pointillées dans le ciel | trame trop douce | `skySprites(…, 0.3)` (défaut) ; jamais 0,6 |
| Soleil couchant qui « flotte » avec une barre | `sun/setting_32` a sa ligne d'horizon | `sunsetDisc` (dans `bodySprites`), disque bas à demi caché par le relief |
| Astre caché au premier écran | un arbre du plan proche passe devant à la caméra 0 | déplacer l'astre (`bodySprites({ dusk: […] })`) ou l'objet |
| Nuages en papier peint | espacement régulier | `cloudBand` (espacements au hasard) ; temps couvert : `overcastCeiling` |
| Temps couvert qui ressemble à un jour gris | ciel trop haut et trop clair | plafond continu, nuages bas accrochés au héros (`STORM`), ciel `dmmc` |
| Taches blanches qui percent entre les nuages | neige du héros trop claire | `FAR.overcast` ternit déjà `w → c` ; idem pour toute neige lointaine |
| Étoiles sur la lune | champ d'étoiles sans zone exclue | `starField(…, avoid)` avec la zone de la lune |
| Objet qui glisse ou flotte en marchant | posé sur un plan d'une autre vitesse | le poser sur la bande de **son** plan (`field` + `plant` avec la hauteur du terrain) |
| Montagne lointaine trop présente | contour noir, couleurs saturées | `FAR`/`FAR2` (contour et faces proches du ciel) |
| Raccord visible en marchant | objet ou terrain non bouclé | `put`/`plant`/`cput` partout ; `wave` avec des `n` entiers |
| Répétition visible | bandes de même largeur, décor régulier | largeurs 640/960/1280, alternance bosquets / clairières, `flipIf` |
| Premier plan qui gêne | trop dense, trop clair, trop haut | 3 à 5 éléments par bande, `FRONT`, coupés par le bas, `optional: true` |
| Personnage illisible sur le sol | sol trop chargé autour de y = 150 | liseré clair plat, contour `k` à 149, décor bas (16 px) espacé |

## Liste de contrôle (chaque période, à l'échelle réelle et agrandie)

- [ ] Le premier écran (vignette) montre le héros, l'astre et un sol lisible.
- [ ] La lumière vient d'en haut à gauche partout (astre compris).
- [ ] Profondeur lisible : du fond vers l'avant, contraste et saturation augmentent ; les lointains sont proches du ciel.
- [ ] Rien ne flotte, rien n'est coupé net au bord d'une bande, aucun raccord visible (captures du script de test).
- [ ] Les quatre périodes sont reconnaissables même en vignette (jour, crépuscule chaud, nuit bleue, sombre gris).
- [ ] Les effets se voient dans les captures de `test-scene.cjs` (oiseaux, étoiles filantes, lucioles…).
- [ ] `npm run build` sans avertissement ; `git status library/scenes/` ne touche que la scène voulue.
- [ ] La galerie affiche le bon badge (⇄ Dynamique / ▣ Statique) et l'export `.js` est identique à la bibliothèque.
