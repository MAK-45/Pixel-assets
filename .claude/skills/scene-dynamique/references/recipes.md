# Recettes par biome

Point de départ pour cadrer et sélectionner : pour chaque biome, l'identité, ce que contient chaque plan, les
assets **déjà dans la bibliothèque** (`famille/variante`), ce qu'il **manque** (à dessiner d'abord comme famille de la
bibliothèque, avec `/draw`), les périodes et les effets. Vérifie toujours `library/catalog.json` : la bibliothèque
grandit, une recette peut être en retard. Les plans suivent le tableau du SKILL.md (sky, stars, clouds, far, mid,
near, ground, front).

## Sommaire

1. Plaine d'été (référence)
2. Plaine d'automne, d'hiver, de printemps (déclinaisons)
3. Montagne enneigée
4. Plage
5. Forêt
6. Désert

## 1. Plaine d'été — `assets/scenes/summer_plain.px.js` (référence validée)

- Héros : grand pic enneigé `mountain/peak_snow_128` au premier écran, chaînes `range_snow_64` + `peak_snow_64` en `FAR2`.
- Mid : `hill/rolling_64`, `hill/round_32`, bosquets `tree/pine_16`, `tree/oak_summer_16`.
- Near (bande d'herbe `field`) : `tree/oak_summer_48`, `oak_summer_full_32`, `birch_32`, `apple_32`, `pine_48` ;
  `bush/round_32`, `berry_32`, `round_16` ; `rock/boulder_mossy_32`, `small_16`.
- Sol : herbe + terre à strates ; `grass/clover_16`, `tuft_16`, `flower/daisy_16`, `poppy_16`, `rock/pebbles_16` ;
  acteurs `grass/tuft_wind_16`. Premier plan : `grass/tall_wind_32` (acteurs, `FRONT`).
- Effets : jour oiseaux + papillons ; crépuscule scintillement + oiseaux ; nuit scintillement, étoiles filantes,
  lucioles (prairie et sol, une partie devant) ; sombre : plafond nuageux, nuages bas sur le sommet, vent ×2.

## 2. Déclinaisons de saison de la plaine

Même structure que la Plaine d'été ; on change surtout les imports (nouveau fichier, ex. `autumn_plain`).

- **Automne** : `tree/oak_autumn_48`, `oak_autumn_32`, `oak_autumn_sparse_32`, `oak_autumn_16`, `birch_autumn_32` ;
  `bush/autumn_32`, `autumn_16` ; `fern/autumn_32` ; `grass/tuft_dry_16`, `tall_dry_32` ; `hill/rolling_autumn_64`,
  `autumn_32` ; nuit : `bodySprites({ moonPart: "_moon_harvest_32" })` (lune rousse). Vols en V `bird/flock_32`
  (migration). Manque possible : feuilles qui tombent (effet `leaves`, voir engine.md).
- **Hiver** : voir Montagne enneigée pour la neige ; en plaine, `tree/oak_winter_32`, `pine_snow_*`, `bush/snow_32`,
  `dry_32`, `hill/rolling_snow_64`, `snow_32`, `grass/tuft_snow_16`, `bodySprites({ sunPart: "_sun_pale_32" })`.
- **Printemps** : `tree/oak_spring_32`, `bush/flowering_32`, `hedge_flowering_48`, `flower/tulip_*_16`,
  `hill/rolling_flowers_64`, `flowers_32`, `grass/tuft_flowers_16` ; plus de papillons, hirondelles `bird/swallow_16`.

## 3. Montagne enneigée

- Identité : un massif tout blanc, des sapins sous la neige, un air froid et pur.
- Far : héros `mountain/peak_winter_128` (ou `peak_snow_128`), chaînes `range_snow_64` et `peak_winter_64` en `FAR2`.
- Mid : `hill/rolling_snow_64`, `hill/snow_32`, bosquets `tree/pine_snow_16`.
- Near : bande de neige `field(W, top, 60, { rim: "w", lit: "s", body: "s", deep: "S" })` ; `tree/pine_snow_48`,
  `pine_snow_32` ; `rock/boulder_snow_32`, `crag_snow_48` ; `bush/snow_32`, `fern/snow_32`.
- Sol : neige (liseré `w`, `s`, ombre `S`) sur roche ou terre gelée (`d m`), `grass/tuft_snow_16`, quelques cailloux.
- Ciel : jour plus froid (`skySprites({ ...SKY, day: "iIIs" })`), `bodySprites({ sunPart: "_sun_pale_32" })`.
- Périodes : crépuscule = neige rosée (déjà dans `FAR`) ; nuit = neige bleutée, beaucoup d'étoiles ; sombre = ciel
  bas de neige. **Demander** si la neige qui tombe est pour l'utilisateur (comme la pluie) ou un effet de la scène.
- Effets : vols lointains (`birds` avec `bird/far_8`), étoiles filantes la nuit ; `bird/crow_16` seulement en
  acteur proche (trop grand pour un vol dans le ciel).
- Manques possibles : effet `snowfall` (si demandé), effet ou plan `aurora` (aurore boréale la nuit), congères,
  lac gelé, animaux des neiges (lièvre, renard).
- Pièges : neige blanche sur ciel pâle = contraste faible (garder le contour `k` au proche, ciel du jour plus bleu) ;
  temps couvert : ternir la neige (`w → c`) sinon des taches blanches percent entre les nuages.

## 4. Plage

- Identité : la mer jusqu'à l'horizon, le sable, le soleil qui se couche dans la mer.
- Far : bande de mer lointaine (eau unie `U u i`, ligne d'horizon claire), îles lointaines (`hill/dune_32`,
  `mountain/peak_alpine_32` en `FAR2`). Un plan **mer** (≈ 0,15–0,2) avec reflets et vaguelettes animées (acteurs).
- Mid : `hill/dunes_64`, `dune_32` ; herbes de dune (`grass/tall_dry_32`, `reeds_32` recolorés).
- Near : palmiers (à créer) ; `rock/boulder_sand_32`, `spire_sand_32`, `arch_sand_48` (une arche dans les rochers).
- Sol : sable (`field` ou bande à la main, `rim: "Y"`, `N`, ombres `n b`), coquillages et étoiles de mer (à créer).
- Périodes : crépuscule = disque posé **sur la ligne d'horizon**, la mer devant en cache la moitié, reflet orangé dans
  la bande de mer du crépuscule ; nuit = chemin de lune sur l'eau (dans la bande de mer de nuit) ; sombre = mer grise
  et écume.
- Effets : mouettes (`birds` avec `bird/far_light_8`), éclats sur l'eau (`twinkle` avec un petit éclat dans la zone
  de mer), crabe qui traverse le sable (acteur ou effet à créer).
- Manques : `nature/palm` (droit, penché, jeune, cocotier, sec…), coquillages / étoile de mer / crabe animé, une famille
  d'eau (crête de vague animée, écume, éclat, ondulation) pour les acteurs de la mer.
- Couleurs : l'eau (`U u i I`) suit les cartes par clarté ; la surcharger si elle devient trop terne la nuit
  (`{ ...NEAR.night, u: "M", i: "U", I: "u" }`).

## 5. Forêt

- Identité : des rangées d'arbres de plus en plus sombres et proches, de la mousse, la nuit pleine de lucioles.
- Far : lisière en `FAR2` (rangées de `tree/pine_16`, `pine_32`) ; Mid : `pine_32`, `oak_summer_full_32`, `birch_32`.
- Near : `tree/oak_summer_48`, `pine_48` serrés ; `fern/large_32`, `forest_32` ; `mushroom/amanita_32`, `bolete_16`,
  `cluster_16` ; `rock/boulder_mossy_32`, `crag_mossy_48` ; `bush/round_32`.
- Sol : terre sombre, racines, feuilles ; `fern/small_16`, `mushroom/cluster_16`, `chanterelle_16`.
- Premier plan : fougères sombres (`fern/large_32` en `FRONT`).
- Effets : jour papillons ; nuit beaucoup de lucioles sur deux ou trois plans, champignons magiques
  (`mushroom/magic_blue_16`) qui brillent ; rayons de lumière (manque : effet ou plan semi-transparent).
- Manques possibles : tronc géant 64 px, souche, bûche, canopée en haut de l'écran.

## 6. Désert

- Identité : mesas rouges, dunes, chaleur ; une nuit très étoilée.
- Far : `mountain/mesa_red_48`, `mesa_48` (plusieurs, en `FAR`/`FAR2`), ou une grande mesa 128 à dessiner.
- Mid : `hill/dunes_64`, `dune_32` ; Near : `rock/boulder_sand_32`, `spire_sand_32`, `arch_sand_48`, cactus (à créer).
- Sol : sable et terre craquelée ; `grass/tuft_dry_16` ; premier plan `grass/tall_dry_32`.
- Périodes : crépuscule très orange ; nuit avec beaucoup d'étoiles (`starField(200, 104, …)`) ; sombre = **tempête de
  sable** : surcharger les cartes vers les ocres (`N n b B`) au lieu des gris, ciel `skySprites({ ...SKY, overcast: "bnNN" })`.
- Manques : `nature/cactus` (saguaro, raquette, tonneau, en fleurs, sec ; 16/32/48), virevoltant animé (effet ou
  acteur), vautour.
