// GÉNÉRÉ par scripts/build.js — ne pas modifier.
// Point d'entrée de la bibliothèque pixel-assets (ES module, navigateur ou Node >= 18).
//   import { catalog, load, find, toCanvas } from "./library/index.js";
//   const tree = await load("nature/tree");              // famille complète
//   const v = await loadVariant("nature/tree/oak_summer_full_32");
//   const hits = find({ category: "nature", tag: "tree", props: { season: "autumn" } });
export * from "./runtime.js";
export { createSceneFrom, fitCanvas } from "./scene-runtime.js";

/** @type {import("./index.d.ts").Catalog} */
export const catalog = {
 "name": "pixel-assets",
 "format": 1,
 "description": "Bibliothèque de pixel art. Chemins relatifs à la racine du dépôt. Données de pixels complètes dans `module` (ES module).",
 "stats": {
  "categories": 7,
  "assets": 25,
  "variants": 248
 },
 "categories": [
  {
   "id": "scenes",
   "title": "Scènes",
   "description": "Décors complets pour jeux 2D, au format 16:9 (base 320 × 180) : panoramas dynamiques en plans de parallaxe qui défilent à l'infini, ou écrans statiques, chacun en plusieurs périodes de la journée.",
   "icon": "scenes/summer_plain/day",
   "assets": [
    "scenes/summer_plain"
   ]
  },
  {
   "id": "nature",
   "title": "Nature",
   "description": "Arbres, rochers, plantes et éléments du décor naturel.",
   "icon": "nature/tree/oak_summer_16",
   "assets": [
    "nature/bones",
    "nature/bush",
    "nature/cactus",
    "nature/fern",
    "nature/flower",
    "nature/fxtree",
    "nature/grass",
    "nature/mushroom",
    "nature/palm",
    "nature/rock",
    "nature/tree",
    "nature/tumbleweed"
   ]
  },
  {
   "id": "landscape",
   "title": "Paysage",
   "description": "Grands reliefs pour décors et arrière-plans : montagnes, volcans, mesas, collines et dunes.",
   "icon": "landscape/mountain/peak_snow_16",
   "assets": [
    "landscape/hill",
    "landscape/mountain"
   ]
  },
  {
   "id": "sky",
   "title": "Ciel",
   "description": "Éléments du ciel pour décors et icônes météo : nuages, soleils, lunes et étoiles.",
   "icon": "sky/sun/rays_16",
   "assets": [
    "sky/cloud",
    "sky/moon",
    "sky/star",
    "sky/sun"
   ]
  },
  {
   "id": "fauna",
   "title": "Faune",
   "description": "Petits animaux d'ambiance pour décors et scènes : oiseaux, papillons, lucioles (souvent animés).",
   "icon": "fauna/butterfly/monarch_16",
   "assets": [
    "fauna/bird",
    "fauna/butterfly",
    "fauna/firefly",
    "fauna/scorpion"
   ]
  },
  {
   "id": "items",
   "title": "Objets",
   "description": "Potions, armes, butin et objets d'inventaire.",
   "icon": "items/potion/red_small",
   "assets": [
    "items/potion"
   ]
  },
  {
   "id": "characters",
   "title": "Personnages",
   "description": "Héros, monstres et créatures (souvent animés).",
   "icon": "characters/slime/green_idle",
   "assets": [
    "characters/slime"
   ]
  }
 ],
 "assets": {
  "scenes/summer_plain": {
   "id": "scenes/summer_plain",
   "slug": "summer_plain",
   "category": "scenes",
   "title": "Plaine d'été",
   "description": "Panorama dynamique 16:9 (base 320 × 180) pour jeu de plateforme ou runner : une plaine d'été au pied d'une grande montagne enneigée, en 8 plans de parallaxe qui bouclent sans couture (ciel, étoiles, nuages, montagnes, collines, prairie, sol où marche le personnage, hautes herbes au premier plan). Quatre périodes : jour (nuages qui dérivent, herbe au vent, oiseaux, papillons), crépuscule (soleil couchant, nuages roses, premières étoiles), nuit (lune, étoiles qui scintillent, étoiles filantes, lucioles) et sombre (journée de pluie couverte, vent fort). Ligne de sol à y = 150.",
   "tags": [
    "scene",
    "parallax",
    "panorama",
    "background",
    "plain",
    "meadow",
    "mountain",
    "summer",
    "day-night",
    "endless",
    "platformer",
    "runner"
   ],
   "order": 0,
   "source": "assets/scenes/summer_plain.px.js",
   "module": "library/js/scenes/summer_plain.js",
   "sheet": {
    "png": "library/sheets/scenes/summer_plain.png",
    "json": "library/sheets/scenes/summer_plain.json"
   },
   "axes": {
    "period": [
     "day",
     "dusk",
     "night",
     "overcast"
    ]
   },
   "sizes": [
    384
   ],
   "variantCount": 4,
   "variants": {
    "day": {
     "key": "day",
     "name": "summer_plain_day",
     "id": "scenes/summer_plain/day",
     "label": "Jour",
     "kind": "parallax",
     "w": 320,
     "h": 180,
     "size": 384,
     "props": {
      "period": "day"
     },
     "tags": [
      "sun",
      "clouds",
      "butterflies",
      "birds"
     ],
     "png": "library/png/scenes/summer_plain/day.png"
    },
    "dusk": {
     "key": "dusk",
     "name": "summer_plain_dusk",
     "id": "scenes/summer_plain/dusk",
     "label": "Crépuscule",
     "kind": "parallax",
     "w": 320,
     "h": 180,
     "size": 384,
     "props": {
      "period": "dusk"
     },
     "tags": [
      "sunset",
      "evening",
      "birds"
     ],
     "png": "library/png/scenes/summer_plain/dusk.png"
    },
    "night": {
     "key": "night",
     "name": "summer_plain_night",
     "id": "scenes/summer_plain/night",
     "label": "Nuit",
     "kind": "parallax",
     "w": 320,
     "h": 180,
     "size": 384,
     "props": {
      "period": "night"
     },
     "tags": [
      "moon",
      "stars",
      "shooting-star",
      "fireflies"
     ],
     "png": "library/png/scenes/summer_plain/night.png"
    },
    "overcast": {
     "key": "overcast",
     "name": "summer_plain_overcast",
     "id": "scenes/summer_plain/overcast",
     "label": "Sombre (pluie)",
     "kind": "parallax",
     "w": 320,
     "h": 180,
     "size": 384,
     "props": {
      "period": "overcast"
     },
     "tags": [
      "rain",
      "storm",
      "dark",
      "wind"
     ],
     "png": "library/png/scenes/summer_plain/overcast.png"
    }
   },
   "scene": {
    "type": "parallax",
    "dynamic": true,
    "w": 320,
    "h": 180,
    "groundY": 150,
    "defaultPeriod": "day",
    "periods": [
     {
      "id": "day",
      "label": "Jour"
     },
     {
      "id": "dusk",
      "label": "Crépuscule"
     },
     {
      "id": "night",
      "label": "Nuit"
     },
     {
      "id": "overcast",
      "label": "Sombre"
     }
    ],
    "planes": [
     {
      "id": "sky",
      "label": "Ciel",
      "factor": 0
     },
     {
      "id": "stars",
      "label": "Étoiles",
      "factor": 0
     },
     {
      "id": "clouds",
      "label": "Nuages",
      "factor": 0.05
     },
     {
      "id": "mountains",
      "label": "Montagnes",
      "factor": 0.1
     },
     {
      "id": "hills",
      "label": "Collines",
      "factor": 0.3
     },
     {
      "id": "meadow",
      "label": "Prairie",
      "factor": 0.6
     },
     {
      "id": "ground",
      "label": "Sol",
      "factor": 1
     },
     {
      "id": "front",
      "label": "Premier plan",
      "factor": 1.3,
      "front": true,
      "optional": true
     }
    ],
    "animated": true,
    "pack": "library/scenes/summer_plain/",
    "json": "library/scenes/summer_plain/scene.json",
    "bundle": "library/scenes/summer_plain/summer_plain.js",
    "runtime": "library/scene-runtime.js"
   }
  },
  "nature/bones": {
   "id": "nature/bones",
   "slug": "bones",
   "category": "nature",
   "title": "Ossements",
   "description": "Ossements blanchis par le soleil pour décors de désert et de western, vus de face : crâne de bovin à cornes (16 et 32 px, posé ou à demi enfoui dans le sable), os seul et os croisés (16 px), cage thoracique à demi ensablée (32 et 48 px). Os blanc à ombres bleutées, cornes brunes, lumière en haut à gauche, contour sombre.",
   "tags": [
    "bones",
    "skull",
    "desert",
    "western",
    "dead",
    "skeleton",
    "ribs",
    "decoration",
    "nature"
   ],
   "order": 0,
   "source": "assets/nature/bones.px.js",
   "module": "library/js/nature/bones.js",
   "sheet": {
    "png": "library/sheets/nature/bones.png",
    "json": "library/sheets/nature/bones.json"
   },
   "axes": {
    "kind": [
     "skull",
     "bone",
     "crossed",
     "ribs"
    ],
    "ground": [
     "bare",
     "sand"
    ]
   },
   "sizes": [
    16,
    32,
    48
   ],
   "variantCount": 7,
   "variants": {
    "skull_32": {
     "key": "skull_32",
     "name": "bones_skull_32",
     "id": "nature/bones/skull_32",
     "label": "Crâne de bovin à cornes",
     "kind": "sprite",
     "w": 32,
     "h": 24,
     "size": 32,
     "props": {
      "kind": "skull",
      "ground": "bare"
     },
     "tags": [
      "cow",
      "horns"
     ],
     "png": "library/png/nature/bones/skull_32.png"
    },
    "skull_16": {
     "key": "skull_16",
     "name": "bones_skull_16",
     "id": "nature/bones/skull_16",
     "label": "Crâne à cornes (16 px)",
     "kind": "sprite",
     "w": 16,
     "h": 11,
     "size": 16,
     "props": {
      "kind": "skull",
      "ground": "bare"
     },
     "tags": [
      "cow",
      "horns"
     ],
     "png": "library/png/nature/bones/skull_16.png"
    },
    "skull_sand_32": {
     "key": "skull_sand_32",
     "name": "bones_skull_sand_32",
     "id": "nature/bones/skull_sand_32",
     "label": "Crâne à demi enfoui dans le sable",
     "kind": "sprite",
     "w": 32,
     "h": 24,
     "size": 32,
     "props": {
      "kind": "skull",
      "ground": "sand"
     },
     "tags": [
      "cow",
      "horns",
      "sand"
     ],
     "png": "library/png/nature/bones/skull_sand_32.png"
    },
    "bone_16": {
     "key": "bone_16",
     "name": "bones_bone_16",
     "id": "nature/bones/bone_16",
     "label": "Os (16 px)",
     "kind": "sprite",
     "w": 16,
     "h": 16,
     "size": 16,
     "props": {
      "kind": "bone",
      "ground": "bare"
     },
     "tags": [
      "icon"
     ],
     "png": "library/png/nature/bones/bone_16.png"
    },
    "crossed_16": {
     "key": "crossed_16",
     "name": "bones_crossed_16",
     "id": "nature/bones/crossed_16",
     "label": "Os croisés (16 px)",
     "kind": "sprite",
     "w": 16,
     "h": 16,
     "size": 16,
     "props": {
      "kind": "crossed",
      "ground": "bare"
     },
     "tags": [
      "icon",
      "danger"
     ],
     "png": "library/png/nature/bones/crossed_16.png"
    },
    "ribs_32": {
     "key": "ribs_32",
     "name": "bones_ribs_32",
     "id": "nature/bones/ribs_32",
     "label": "Cage thoracique ensablée",
     "kind": "sprite",
     "w": 32,
     "h": 22,
     "size": 32,
     "props": {
      "kind": "ribs",
      "ground": "sand"
     },
     "tags": [
      "carcass"
     ],
     "png": "library/png/nature/bones/ribs_32.png"
    },
    "ribs_48": {
     "key": "ribs_48",
     "name": "bones_ribs_48",
     "id": "nature/bones/ribs_48",
     "label": "Grande cage thoracique ensablée (48 px)",
     "kind": "sprite",
     "w": 48,
     "h": 30,
     "size": 48,
     "props": {
      "kind": "ribs",
      "ground": "sand"
     },
     "tags": [
      "carcass",
      "landmark"
     ],
     "png": "library/png/nature/bones/ribs_48.png"
    }
   }
  },
  "nature/bush": {
   "id": "nature/bush",
   "slug": "bush",
   "category": "nature",
   "title": "Buisson",
   "description": "Buissons posés au sol, vus de face pour décors 2D : buisson rond (16, 32 px), haie taillée (48 px), en versions été, à baies rouges, en fleurs, automne, enneigé et sec sans feuilles. Lumière en haut à gauche, contour sombre.",
   "tags": [
    "bush",
    "shrub",
    "plant",
    "vegetation",
    "ground",
    "nature",
    "decoration",
    "foliage"
   ],
   "order": 0,
   "source": "assets/nature/bush.px.js",
   "module": "library/js/nature/bush.js",
   "sheet": {
    "png": "library/sheets/nature/bush.png",
    "json": "library/sheets/nature/bush.json"
   },
   "axes": {
    "shape": [
     "round",
     "hedge"
    ],
    "season": [
     "summer",
     "autumn",
     "spring",
     "winter"
    ],
    "feature": [
     "plain",
     "berries",
     "flowers",
     "snow",
     "bare"
    ]
   },
   "sizes": [
    16,
    32,
    48
   ],
   "variantCount": 11,
   "variants": {
    "round_16": {
     "key": "round_16",
     "name": "bush_round_16",
     "id": "nature/bush/round_16",
     "label": "Petit buisson (16 px)",
     "kind": "sprite",
     "w": 16,
     "h": 13,
     "size": 16,
     "props": {
      "shape": "round",
      "season": "summer",
      "feature": "plain"
     },
     "tags": [],
     "png": "library/png/nature/bush/round_16.png"
    },
    "berry_16": {
     "key": "berry_16",
     "name": "bush_berry_16",
     "id": "nature/bush/berry_16",
     "label": "Petit buisson à baies (16 px)",
     "kind": "sprite",
     "w": 16,
     "h": 13,
     "size": 16,
     "props": {
      "shape": "round",
      "season": "summer",
      "feature": "berries"
     },
     "tags": [
      "berry",
      "fruit"
     ],
     "png": "library/png/nature/bush/berry_16.png"
    },
    "autumn_16": {
     "key": "autumn_16",
     "name": "bush_autumn_16",
     "id": "nature/bush/autumn_16",
     "label": "Petit buisson d'automne (16 px)",
     "kind": "sprite",
     "w": 16,
     "h": 13,
     "size": 16,
     "props": {
      "shape": "round",
      "season": "autumn",
      "feature": "plain"
     },
     "tags": [],
     "png": "library/png/nature/bush/autumn_16.png"
    },
    "round_32": {
     "key": "round_32",
     "name": "bush_round_32",
     "id": "nature/bush/round_32",
     "label": "Buisson rond",
     "kind": "sprite",
     "w": 32,
     "h": 21,
     "size": 32,
     "props": {
      "shape": "round",
      "season": "summer",
      "feature": "plain"
     },
     "tags": [],
     "png": "library/png/nature/bush/round_32.png"
    },
    "berry_32": {
     "key": "berry_32",
     "name": "bush_berry_32",
     "id": "nature/bush/berry_32",
     "label": "Buisson à baies rouges",
     "kind": "sprite",
     "w": 32,
     "h": 21,
     "size": 32,
     "props": {
      "shape": "round",
      "season": "summer",
      "feature": "berries"
     },
     "tags": [
      "berry",
      "fruit"
     ],
     "png": "library/png/nature/bush/berry_32.png"
    },
    "flowering_32": {
     "key": "flowering_32",
     "name": "bush_flowering_32",
     "id": "nature/bush/flowering_32",
     "label": "Buisson en fleurs (printemps)",
     "kind": "sprite",
     "w": 32,
     "h": 21,
     "size": 32,
     "props": {
      "shape": "round",
      "season": "spring",
      "feature": "flowers"
     },
     "tags": [
      "flower",
      "blossom"
     ],
     "png": "library/png/nature/bush/flowering_32.png"
    },
    "autumn_32": {
     "key": "autumn_32",
     "name": "bush_autumn_32",
     "id": "nature/bush/autumn_32",
     "label": "Buisson d'automne",
     "kind": "sprite",
     "w": 32,
     "h": 21,
     "size": 32,
     "props": {
      "shape": "round",
      "season": "autumn",
      "feature": "plain"
     },
     "tags": [],
     "png": "library/png/nature/bush/autumn_32.png"
    },
    "snow_32": {
     "key": "snow_32",
     "name": "bush_snow_32",
     "id": "nature/bush/snow_32",
     "label": "Buisson enneigé",
     "kind": "sprite",
     "w": 32,
     "h": 21,
     "size": 32,
     "props": {
      "shape": "round",
      "season": "winter",
      "feature": "snow"
     },
     "tags": [
      "snow"
     ],
     "png": "library/png/nature/bush/snow_32.png"
    },
    "dry_32": {
     "key": "dry_32",
     "name": "bush_dry_32",
     "id": "nature/bush/dry_32",
     "label": "Buisson sec sans feuilles",
     "kind": "sprite",
     "w": 32,
     "h": 21,
     "size": 32,
     "props": {
      "shape": "round",
      "season": "winter",
      "feature": "bare"
     },
     "tags": [
      "dead",
      "twigs"
     ],
     "png": "library/png/nature/bush/dry_32.png"
    },
    "hedge_48": {
     "key": "hedge_48",
     "name": "bush_hedge_48",
     "id": "nature/bush/hedge_48",
     "label": "Haie taillée (48 px)",
     "kind": "sprite",
     "w": 48,
     "h": 24,
     "size": 48,
     "props": {
      "shape": "hedge",
      "season": "summer",
      "feature": "plain"
     },
     "tags": [
      "hedge",
      "garden"
     ],
     "png": "library/png/nature/bush/hedge_48.png"
    },
    "hedge_flowering_48": {
     "key": "hedge_flowering_48",
     "name": "bush_hedge_flowering_48",
     "id": "nature/bush/hedge_flowering_48",
     "label": "Haie fleurie (48 px)",
     "kind": "sprite",
     "w": 48,
     "h": 24,
     "size": 48,
     "props": {
      "shape": "hedge",
      "season": "spring",
      "feature": "flowers"
     },
     "tags": [
      "hedge",
      "garden",
      "flower"
     ],
     "png": "library/png/nature/bush/hedge_flowering_48.png"
    }
   }
  },
  "nature/cactus": {
   "id": "nature/cactus",
   "slug": "cactus",
   "category": "nature",
   "title": "Cactus",
   "description": "Cactus du désert posés au sol, vus de face pour décors 2D : saguaro à bras (16, 32 et 48 px, avec ou sans fleurs blanches), cactus tonneau (16 et 32 px, nu ou couronné de fleurs) et figuier de Barbarie en raquettes (16 et 32 px, nu, en fleurs jaunes ou chargé de figues). Côtes et épines marquées, lumière en haut à gauche, contour sombre.",
   "tags": [
    "cactus",
    "desert",
    "plant",
    "succulent",
    "spines",
    "western",
    "arid",
    "nature",
    "decoration"
   ],
   "order": 0,
   "source": "assets/nature/cactus.px.js",
   "module": "library/js/nature/cactus.js",
   "sheet": {
    "png": "library/sheets/nature/cactus.png",
    "json": "library/sheets/nature/cactus.json"
   },
   "axes": {
    "species": [
     "saguaro",
     "barrel",
     "prickly-pear"
    ],
    "state": [
     "plain",
     "flowers",
     "fruit"
    ]
   },
   "sizes": [
    16,
    32,
    48
   ],
   "variantCount": 12,
   "variants": {
    "saguaro_16": {
     "key": "saguaro_16",
     "name": "cactus_saguaro_16",
     "id": "nature/cactus/saguaro_16",
     "label": "Petit saguaro (16 px)",
     "kind": "sprite",
     "w": 16,
     "h": 16,
     "size": 16,
     "props": {
      "species": "saguaro",
      "state": "plain"
     },
     "tags": [],
     "png": "library/png/nature/cactus/saguaro_16.png"
    },
    "saguaro_32": {
     "key": "saguaro_32",
     "name": "cactus_saguaro_32",
     "id": "nature/cactus/saguaro_32",
     "label": "Saguaro à deux bras",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "species": "saguaro",
      "state": "plain"
     },
     "tags": [],
     "png": "library/png/nature/cactus/saguaro_32.png"
    },
    "saguaro_flowers_32": {
     "key": "saguaro_flowers_32",
     "name": "cactus_saguaro_flowers_32",
     "id": "nature/cactus/saguaro_flowers_32",
     "label": "Saguaro en fleurs",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "species": "saguaro",
      "state": "flowers"
     },
     "tags": [
      "flower",
      "blossom",
      "spring"
     ],
     "png": "library/png/nature/cactus/saguaro_flowers_32.png"
    },
    "saguaro_48": {
     "key": "saguaro_48",
     "name": "cactus_saguaro_48",
     "id": "nature/cactus/saguaro_48",
     "label": "Grand saguaro à trois bras (48 px)",
     "kind": "sprite",
     "w": 48,
     "h": 48,
     "size": 48,
     "props": {
      "species": "saguaro",
      "state": "plain"
     },
     "tags": [
      "tall",
      "landmark"
     ],
     "png": "library/png/nature/cactus/saguaro_48.png"
    },
    "barrel_16": {
     "key": "barrel_16",
     "name": "cactus_barrel_16",
     "id": "nature/cactus/barrel_16",
     "label": "Cactus tonneau (16 px)",
     "kind": "sprite",
     "w": 14,
     "h": 14,
     "size": 16,
     "props": {
      "species": "barrel",
      "state": "plain"
     },
     "tags": [],
     "png": "library/png/nature/cactus/barrel_16.png"
    },
    "barrel_flowers_16": {
     "key": "barrel_flowers_16",
     "name": "cactus_barrel_flowers_16",
     "id": "nature/cactus/barrel_flowers_16",
     "label": "Cactus tonneau en fleurs (16 px)",
     "kind": "sprite",
     "w": 14,
     "h": 14,
     "size": 16,
     "props": {
      "species": "barrel",
      "state": "flowers"
     },
     "tags": [
      "flower"
     ],
     "png": "library/png/nature/cactus/barrel_flowers_16.png"
    },
    "barrel_32": {
     "key": "barrel_32",
     "name": "cactus_barrel_32",
     "id": "nature/cactus/barrel_32",
     "label": "Grand cactus tonneau",
     "kind": "sprite",
     "w": 28,
     "h": 24,
     "size": 32,
     "props": {
      "species": "barrel",
      "state": "plain"
     },
     "tags": [],
     "png": "library/png/nature/cactus/barrel_32.png"
    },
    "barrel_flowers_32": {
     "key": "barrel_flowers_32",
     "name": "cactus_barrel_flowers_32",
     "id": "nature/cactus/barrel_flowers_32",
     "label": "Grand cactus tonneau en fleurs",
     "kind": "sprite",
     "w": 28,
     "h": 24,
     "size": 32,
     "props": {
      "species": "barrel",
      "state": "flowers"
     },
     "tags": [
      "flower"
     ],
     "png": "library/png/nature/cactus/barrel_flowers_32.png"
    },
    "prickly_16": {
     "key": "prickly_16",
     "name": "cactus_prickly_16",
     "id": "nature/cactus/prickly_16",
     "label": "Figuier de Barbarie (16 px)",
     "kind": "sprite",
     "w": 16,
     "h": 16,
     "size": 16,
     "props": {
      "species": "prickly-pear",
      "state": "plain"
     },
     "tags": [
      "opuntia"
     ],
     "png": "library/png/nature/cactus/prickly_16.png"
    },
    "prickly_32": {
     "key": "prickly_32",
     "name": "cactus_prickly_32",
     "id": "nature/cactus/prickly_32",
     "label": "Figuier de Barbarie",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "species": "prickly-pear",
      "state": "plain"
     },
     "tags": [
      "opuntia"
     ],
     "png": "library/png/nature/cactus/prickly_32.png"
    },
    "prickly_flowers_32": {
     "key": "prickly_flowers_32",
     "name": "cactus_prickly_flowers_32",
     "id": "nature/cactus/prickly_flowers_32",
     "label": "Figuier de Barbarie en fleurs",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "species": "prickly-pear",
      "state": "flowers"
     },
     "tags": [
      "opuntia",
      "flower"
     ],
     "png": "library/png/nature/cactus/prickly_flowers_32.png"
    },
    "prickly_fruit_32": {
     "key": "prickly_fruit_32",
     "name": "cactus_prickly_fruit_32",
     "id": "nature/cactus/prickly_fruit_32",
     "label": "Figuier de Barbarie chargé de figues",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "species": "prickly-pear",
      "state": "fruit"
     },
     "tags": [
      "opuntia",
      "fruit"
     ],
     "png": "library/png/nature/cactus/prickly_fruit_32.png"
    }
   }
  },
  "nature/fern": {
   "id": "nature/fern",
   "slug": "fern",
   "category": "nature",
   "title": "Fougère",
   "description": "Fougères de sous-bois vues de face, posées au sol : petite fougère et jeune crosse enroulée (16 px) ; grande fougère en vert clair, vert forêt bleuté, rousse d'automne et enneigée (32 px). Lumière en haut à gauche, contour sombre.",
   "tags": [
    "fern",
    "plant",
    "vegetation",
    "ground",
    "forest",
    "undergrowth",
    "nature",
    "decoration"
   ],
   "order": 0,
   "source": "assets/nature/fern.px.js",
   "module": "library/js/nature/fern.js",
   "sheet": {
    "png": "library/sheets/nature/fern.png",
    "json": "library/sheets/nature/fern.json"
   },
   "axes": {
    "state": [
     "mature",
     "young"
    ],
    "season": [
     "summer",
     "spring",
     "autumn",
     "winter"
    ],
    "color": [
     "green",
     "teal",
     "brown"
    ]
   },
   "sizes": [
    16,
    32
   ],
   "variantCount": 6,
   "variants": {
    "small_16": {
     "key": "small_16",
     "name": "fern_small_16",
     "id": "nature/fern/small_16",
     "label": "Petite fougère",
     "kind": "sprite",
     "w": 16,
     "h": 13,
     "size": 16,
     "props": {
      "state": "mature",
      "season": "summer",
      "color": "green"
     },
     "tags": [],
     "png": "library/png/nature/fern/small_16.png"
    },
    "young_16": {
     "key": "young_16",
     "name": "fern_young_16",
     "id": "nature/fern/young_16",
     "label": "Jeune fougère en crosse",
     "kind": "sprite",
     "w": 14,
     "h": 16,
     "size": 16,
     "props": {
      "state": "young",
      "season": "spring",
      "color": "green"
     },
     "tags": [
      "fiddlehead"
     ],
     "png": "library/png/nature/fern/young_16.png"
    },
    "large_32": {
     "key": "large_32",
     "name": "fern_large_32",
     "id": "nature/fern/large_32",
     "label": "Grande fougère",
     "kind": "sprite",
     "w": 32,
     "h": 28,
     "size": 32,
     "props": {
      "state": "mature",
      "season": "summer",
      "color": "green"
     },
     "tags": [],
     "png": "library/png/nature/fern/large_32.png"
    },
    "forest_32": {
     "key": "forest_32",
     "name": "fern_forest_32",
     "id": "nature/fern/forest_32",
     "label": "Grande fougère de forêt sombre",
     "kind": "sprite",
     "w": 32,
     "h": 28,
     "size": 32,
     "props": {
      "state": "mature",
      "season": "summer",
      "color": "teal"
     },
     "tags": [],
     "png": "library/png/nature/fern/forest_32.png"
    },
    "autumn_32": {
     "key": "autumn_32",
     "name": "fern_autumn_32",
     "id": "nature/fern/autumn_32",
     "label": "Fougère rousse d'automne",
     "kind": "sprite",
     "w": 32,
     "h": 28,
     "size": 32,
     "props": {
      "state": "mature",
      "season": "autumn",
      "color": "brown"
     },
     "tags": [],
     "png": "library/png/nature/fern/autumn_32.png"
    },
    "snow_32": {
     "key": "snow_32",
     "name": "fern_snow_32",
     "id": "nature/fern/snow_32",
     "label": "Fougère enneigée",
     "kind": "sprite",
     "w": 32,
     "h": 28,
     "size": 32,
     "props": {
      "state": "mature",
      "season": "winter",
      "color": "green"
     },
     "tags": [
      "snow"
     ],
     "png": "library/png/nature/fern/snow_32.png"
    }
   }
  },
  "nature/flower": {
   "id": "nature/flower",
   "slug": "flower",
   "category": "nature",
   "title": "Fleur",
   "description": "Fleurs sauvages et de jardin vues de face, posées au sol : marguerite, tulipes (rouge, jaune, rose, violette, blanche), coquelicot, jacinthe des bois, lavande (16 px) ; tournesol et massif de fleurs mélangées (32 px). Lumière en haut à gauche, contour sombre.",
   "tags": [
    "flower",
    "plant",
    "vegetation",
    "ground",
    "nature",
    "decoration",
    "garden",
    "meadow"
   ],
   "order": 0,
   "source": "assets/nature/flower.px.js",
   "module": "library/js/nature/flower.js",
   "sheet": {
    "png": "library/sheets/nature/flower.png",
    "json": "library/sheets/nature/flower.json"
   },
   "axes": {
    "species": [
     "tulip",
     "daisy",
     "poppy",
     "bluebell",
     "lavender",
     "sunflower",
     "mixed"
    ],
    "color": [
     "red",
     "yellow",
     "pink",
     "purple",
     "white",
     "blue",
     "mixed"
    ]
   },
   "sizes": [
    16,
    32
   ],
   "variantCount": 11,
   "variants": {
    "tulip_red_16": {
     "key": "tulip_red_16",
     "name": "flower_tulip_red_16",
     "id": "nature/flower/tulip_red_16",
     "label": "Tulipe rouge",
     "kind": "sprite",
     "w": 13,
     "h": 16,
     "size": 16,
     "props": {
      "species": "tulip",
      "color": "red"
     },
     "tags": [],
     "png": "library/png/nature/flower/tulip_red_16.png"
    },
    "tulip_yellow_16": {
     "key": "tulip_yellow_16",
     "name": "flower_tulip_yellow_16",
     "id": "nature/flower/tulip_yellow_16",
     "label": "Tulipe jaune",
     "kind": "sprite",
     "w": 13,
     "h": 16,
     "size": 16,
     "props": {
      "species": "tulip",
      "color": "yellow"
     },
     "tags": [],
     "png": "library/png/nature/flower/tulip_yellow_16.png"
    },
    "tulip_pink_16": {
     "key": "tulip_pink_16",
     "name": "flower_tulip_pink_16",
     "id": "nature/flower/tulip_pink_16",
     "label": "Tulipe rose",
     "kind": "sprite",
     "w": 13,
     "h": 16,
     "size": 16,
     "props": {
      "species": "tulip",
      "color": "pink"
     },
     "tags": [],
     "png": "library/png/nature/flower/tulip_pink_16.png"
    },
    "tulip_purple_16": {
     "key": "tulip_purple_16",
     "name": "flower_tulip_purple_16",
     "id": "nature/flower/tulip_purple_16",
     "label": "Tulipe violette",
     "kind": "sprite",
     "w": 13,
     "h": 16,
     "size": 16,
     "props": {
      "species": "tulip",
      "color": "purple"
     },
     "tags": [],
     "png": "library/png/nature/flower/tulip_purple_16.png"
    },
    "tulip_white_16": {
     "key": "tulip_white_16",
     "name": "flower_tulip_white_16",
     "id": "nature/flower/tulip_white_16",
     "label": "Tulipe blanche",
     "kind": "sprite",
     "w": 13,
     "h": 16,
     "size": 16,
     "props": {
      "species": "tulip",
      "color": "white"
     },
     "tags": [],
     "png": "library/png/nature/flower/tulip_white_16.png"
    },
    "daisy_16": {
     "key": "daisy_16",
     "name": "flower_daisy_16",
     "id": "nature/flower/daisy_16",
     "label": "Marguerite",
     "kind": "sprite",
     "w": 13,
     "h": 16,
     "size": 16,
     "props": {
      "species": "daisy",
      "color": "white"
     },
     "tags": [],
     "png": "library/png/nature/flower/daisy_16.png"
    },
    "poppy_16": {
     "key": "poppy_16",
     "name": "flower_poppy_16",
     "id": "nature/flower/poppy_16",
     "label": "Coquelicot",
     "kind": "sprite",
     "w": 13,
     "h": 16,
     "size": 16,
     "props": {
      "species": "poppy",
      "color": "red"
     },
     "tags": [],
     "png": "library/png/nature/flower/poppy_16.png"
    },
    "bluebell_16": {
     "key": "bluebell_16",
     "name": "flower_bluebell_16",
     "id": "nature/flower/bluebell_16",
     "label": "Jacinthe des bois",
     "kind": "sprite",
     "w": 14,
     "h": 16,
     "size": 16,
     "props": {
      "species": "bluebell",
      "color": "blue"
     },
     "tags": [],
     "png": "library/png/nature/flower/bluebell_16.png"
    },
    "lavender_16": {
     "key": "lavender_16",
     "name": "flower_lavender_16",
     "id": "nature/flower/lavender_16",
     "label": "Lavande",
     "kind": "sprite",
     "w": 13,
     "h": 16,
     "size": 16,
     "props": {
      "species": "lavender",
      "color": "purple"
     },
     "tags": [
      "herb"
     ],
     "png": "library/png/nature/flower/lavender_16.png"
    },
    "sunflower_32": {
     "key": "sunflower_32",
     "name": "flower_sunflower_32",
     "id": "nature/flower/sunflower_32",
     "label": "Tournesol (32 px)",
     "kind": "sprite",
     "w": 24,
     "h": 32,
     "size": 32,
     "props": {
      "species": "sunflower",
      "color": "yellow"
     },
     "tags": [],
     "png": "library/png/nature/flower/sunflower_32.png"
    },
    "bed_32": {
     "key": "bed_32",
     "name": "flower_bed_32",
     "id": "nature/flower/bed_32",
     "label": "Massif de fleurs mélangées (32 px)",
     "kind": "sprite",
     "w": 32,
     "h": 20,
     "size": 32,
     "props": {
      "species": "mixed",
      "color": "mixed"
     },
     "tags": [
      "flowerbed",
      "garden"
     ],
     "png": "library/png/nature/flower/bed_32.png"
    }
   }
  },
  "nature/fxtree": {
   "id": "nature/fxtree",
   "slug": "fxtree",
   "category": "nature",
   "title": "Arbre (style pixelfx)",
   "description": "Arbres vus de face au rendu riche inspiré de la bibliothèque d'effets pixelfx : pas de contour noir (bord dans la teinte la plus sombre du matériau), couronnes en grappes modelées par la lumière en haut à gauche, ombres portées entre les grappes, ombre translucide au sol, effets figés (halos, lucioles, neige scintillante, feuilles et pétales tombés au sol). Variantes : chêne été / automne / nuit à lucioles, cerisier en fleurs, sapin et sapin enneigé, arbre-esprit luminescent, en 64 et 32 px. Les halos sont semi-transparents : ils rendent mieux sur fond sombre.",
   "tags": [
    "tree",
    "plant",
    "forest",
    "nature",
    "decoration",
    "scenery",
    "realistic",
    "pixelfx"
   ],
   "order": 0,
   "source": "assets/nature/fxtree.px.js",
   "module": "library/js/nature/fxtree.js",
   "sheet": {
    "png": "library/sheets/nature/fxtree.png",
    "json": "library/sheets/nature/fxtree.json"
   },
   "axes": {
    "species": [
     "oak",
     "cherry",
     "pine",
     "spirit"
    ],
    "season": [
     "summer",
     "autumn",
     "spring",
     "winter"
    ],
    "effect": [
     "none",
     "fireflies",
     "snow",
     "glow"
    ]
   },
   "sizes": [
    32,
    64
   ],
   "variantCount": 13,
   "variants": {
    "oak_summer_64": {
     "key": "oak_summer_64",
     "name": "fxtree_oak_summer_64",
     "id": "nature/fxtree/oak_summer_64",
     "label": "Chêne – été (64 px)",
     "kind": "sprite",
     "w": 64,
     "h": 64,
     "size": 64,
     "props": {
      "species": "oak",
      "season": "summer",
      "effect": "none"
     },
     "tags": [],
     "png": "library/png/nature/fxtree/oak_summer_64.png"
    },
    "oak_autumn_64": {
     "key": "oak_autumn_64",
     "name": "fxtree_oak_autumn_64",
     "id": "nature/fxtree/oak_autumn_64",
     "label": "Chêne – automne (64 px)",
     "kind": "sprite",
     "w": 64,
     "h": 64,
     "size": 64,
     "props": {
      "species": "oak",
      "season": "autumn",
      "effect": "none"
     },
     "tags": [],
     "png": "library/png/nature/fxtree/oak_autumn_64.png"
    },
    "oak_night_64": {
     "key": "oak_night_64",
     "name": "fxtree_oak_night_64",
     "id": "nature/fxtree/oak_night_64",
     "label": "Chêne – nuit d'été, lucioles (64 px)",
     "kind": "sprite",
     "w": 64,
     "h": 64,
     "size": 64,
     "props": {
      "species": "oak",
      "season": "summer",
      "effect": "fireflies"
     },
     "tags": [
      "night",
      "glow"
     ],
     "png": "library/png/nature/fxtree/oak_night_64.png"
    },
    "cherry_64": {
     "key": "cherry_64",
     "name": "fxtree_cherry_64",
     "id": "nature/fxtree/cherry_64",
     "label": "Cerisier en fleurs (64 px)",
     "kind": "sprite",
     "w": 64,
     "h": 64,
     "size": 64,
     "props": {
      "species": "cherry",
      "season": "spring",
      "effect": "none"
     },
     "tags": [
      "blossom",
      "sakura"
     ],
     "png": "library/png/nature/fxtree/cherry_64.png"
    },
    "pine_64": {
     "key": "pine_64",
     "name": "fxtree_pine_64",
     "id": "nature/fxtree/pine_64",
     "label": "Sapin (64 px)",
     "kind": "sprite",
     "w": 64,
     "h": 64,
     "size": 64,
     "props": {
      "species": "pine",
      "season": "summer",
      "effect": "none"
     },
     "tags": [
      "conifer",
      "fir"
     ],
     "png": "library/png/nature/fxtree/pine_64.png"
    },
    "pine_snow_64": {
     "key": "pine_snow_64",
     "name": "fxtree_pine_snow_64",
     "id": "nature/fxtree/pine_snow_64",
     "label": "Sapin enneigé, scintillements (64 px)",
     "kind": "sprite",
     "w": 64,
     "h": 64,
     "size": 64,
     "props": {
      "species": "pine",
      "season": "winter",
      "effect": "snow"
     },
     "tags": [
      "conifer",
      "fir",
      "snow"
     ],
     "png": "library/png/nature/fxtree/pine_snow_64.png"
    },
    "spirit_64": {
     "key": "spirit_64",
     "name": "fxtree_spirit_64",
     "id": "nature/fxtree/spirit_64",
     "label": "Arbre-esprit luminescent (64 px)",
     "kind": "sprite",
     "w": 64,
     "h": 64,
     "size": 64,
     "props": {
      "species": "spirit",
      "season": "summer",
      "effect": "glow"
     },
     "tags": [
      "magic",
      "fantasy",
      "glow"
     ],
     "png": "library/png/nature/fxtree/spirit_64.png"
    },
    "oak_summer_32": {
     "key": "oak_summer_32",
     "name": "fxtree_oak_summer_32",
     "id": "nature/fxtree/oak_summer_32",
     "label": "Chêne – été (32 px)",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "species": "oak",
      "season": "summer",
      "effect": "none"
     },
     "tags": [],
     "png": "library/png/nature/fxtree/oak_summer_32.png"
    },
    "oak_autumn_32": {
     "key": "oak_autumn_32",
     "name": "fxtree_oak_autumn_32",
     "id": "nature/fxtree/oak_autumn_32",
     "label": "Chêne – automne (32 px)",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "species": "oak",
      "season": "autumn",
      "effect": "none"
     },
     "tags": [],
     "png": "library/png/nature/fxtree/oak_autumn_32.png"
    },
    "cherry_32": {
     "key": "cherry_32",
     "name": "fxtree_cherry_32",
     "id": "nature/fxtree/cherry_32",
     "label": "Cerisier en fleurs (32 px)",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "species": "cherry",
      "season": "spring",
      "effect": "none"
     },
     "tags": [
      "blossom",
      "sakura"
     ],
     "png": "library/png/nature/fxtree/cherry_32.png"
    },
    "pine_32": {
     "key": "pine_32",
     "name": "fxtree_pine_32",
     "id": "nature/fxtree/pine_32",
     "label": "Sapin (32 px)",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "species": "pine",
      "season": "summer",
      "effect": "none"
     },
     "tags": [
      "conifer",
      "fir"
     ],
     "png": "library/png/nature/fxtree/pine_32.png"
    },
    "pine_snow_32": {
     "key": "pine_snow_32",
     "name": "fxtree_pine_snow_32",
     "id": "nature/fxtree/pine_snow_32",
     "label": "Sapin enneigé (32 px)",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "species": "pine",
      "season": "winter",
      "effect": "snow"
     },
     "tags": [
      "conifer",
      "fir",
      "snow"
     ],
     "png": "library/png/nature/fxtree/pine_snow_32.png"
    },
    "spirit_32": {
     "key": "spirit_32",
     "name": "fxtree_spirit_32",
     "id": "nature/fxtree/spirit_32",
     "label": "Arbre-esprit luminescent (32 px)",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "species": "spirit",
      "season": "summer",
      "effect": "glow"
     },
     "tags": [
      "magic",
      "fantasy",
      "glow"
     ],
     "png": "library/png/nature/fxtree/spirit_32.png"
    }
   }
  },
  "nature/grass": {
   "id": "nature/grass",
   "slug": "grass",
   "category": "nature",
   "title": "Herbe",
   "description": "Végétation basse vue de face, posée au sol : touffes d'herbe (16 px) en versions été, sèche, enneigée, fleurie et animée au vent ; trèfle ; hautes herbes (32 px) normales, sèches à épis et animées au vent ; roseaux à massettes. Lumière en haut à gauche, contour sombre.",
   "tags": [
    "grass",
    "tuft",
    "plant",
    "vegetation",
    "ground",
    "nature",
    "decoration",
    "meadow"
   ],
   "order": 0,
   "source": "assets/nature/grass.px.js",
   "module": "library/js/nature/grass.js",
   "sheet": {
    "png": "library/sheets/nature/grass.png",
    "json": "library/sheets/nature/grass.json"
   },
   "axes": {
    "shape": [
     "tuft",
     "clover",
     "tall",
     "reed"
    ],
    "season": [
     "summer",
     "autumn",
     "winter",
     "spring"
    ],
    "state": [
     "still",
     "wind"
    ]
   },
   "sizes": [
    16,
    32
   ],
   "variantCount": 10,
   "variants": {
    "tuft_16": {
     "key": "tuft_16",
     "name": "grass_tuft_16",
     "id": "nature/grass/tuft_16",
     "label": "Touffe d'herbe",
     "kind": "sprite",
     "w": 16,
     "h": 13,
     "size": 16,
     "props": {
      "shape": "tuft",
      "season": "summer",
      "state": "still"
     },
     "tags": [],
     "png": "library/png/nature/grass/tuft_16.png"
    },
    "tuft_dry_16": {
     "key": "tuft_dry_16",
     "name": "grass_tuft_dry_16",
     "id": "nature/grass/tuft_dry_16",
     "label": "Touffe d'herbe sèche",
     "kind": "sprite",
     "w": 16,
     "h": 13,
     "size": 16,
     "props": {
      "shape": "tuft",
      "season": "autumn",
      "state": "still"
     },
     "tags": [
      "dry",
      "straw"
     ],
     "png": "library/png/nature/grass/tuft_dry_16.png"
    },
    "tuft_snow_16": {
     "key": "tuft_snow_16",
     "name": "grass_tuft_snow_16",
     "id": "nature/grass/tuft_snow_16",
     "label": "Touffe d'herbe enneigée",
     "kind": "sprite",
     "w": 16,
     "h": 13,
     "size": 16,
     "props": {
      "shape": "tuft",
      "season": "winter",
      "state": "still"
     },
     "tags": [
      "snow"
     ],
     "png": "library/png/nature/grass/tuft_snow_16.png"
    },
    "tuft_flowers_16": {
     "key": "tuft_flowers_16",
     "name": "grass_tuft_flowers_16",
     "id": "nature/grass/tuft_flowers_16",
     "label": "Touffe d'herbe fleurie",
     "kind": "sprite",
     "w": 16,
     "h": 13,
     "size": 16,
     "props": {
      "shape": "tuft",
      "season": "spring",
      "state": "still"
     },
     "tags": [
      "flower"
     ],
     "png": "library/png/nature/grass/tuft_flowers_16.png"
    },
    "tuft_wind_16": {
     "key": "tuft_wind_16",
     "name": "grass_tuft_wind_16",
     "id": "nature/grass/tuft_wind_16",
     "label": "Touffe d'herbe au vent (animée)",
     "kind": "anim",
     "w": 16,
     "h": 13,
     "size": 16,
     "props": {
      "shape": "tuft",
      "season": "summer",
      "state": "wind"
     },
     "tags": [
      "animated",
      "wind"
     ],
     "png": "library/png/nature/grass/tuft_wind_16.png",
     "gif": "library/png/nature/grass/tuft_wind_16.gif",
     "frameCount": 4,
     "loopMs": 800
    },
    "clover_16": {
     "key": "clover_16",
     "name": "grass_clover_16",
     "id": "nature/grass/clover_16",
     "label": "Trèfle",
     "kind": "sprite",
     "w": 16,
     "h": 10,
     "size": 16,
     "props": {
      "shape": "clover",
      "season": "summer",
      "state": "still"
     },
     "tags": [
      "clover",
      "lucky"
     ],
     "png": "library/png/nature/grass/clover_16.png"
    },
    "tall_32": {
     "key": "tall_32",
     "name": "grass_tall_32",
     "id": "nature/grass/tall_32",
     "label": "Hautes herbes",
     "kind": "sprite",
     "w": 32,
     "h": 30,
     "size": 32,
     "props": {
      "shape": "tall",
      "season": "summer",
      "state": "still"
     },
     "tags": [],
     "png": "library/png/nature/grass/tall_32.png"
    },
    "tall_dry_32": {
     "key": "tall_dry_32",
     "name": "grass_tall_dry_32",
     "id": "nature/grass/tall_dry_32",
     "label": "Hautes herbes sèches à épis",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "shape": "tall",
      "season": "autumn",
      "state": "still"
     },
     "tags": [
      "dry",
      "straw",
      "wheat"
     ],
     "png": "library/png/nature/grass/tall_dry_32.png"
    },
    "tall_wind_32": {
     "key": "tall_wind_32",
     "name": "grass_tall_wind_32",
     "id": "nature/grass/tall_wind_32",
     "label": "Hautes herbes au vent (animées)",
     "kind": "anim",
     "w": 32,
     "h": 30,
     "size": 32,
     "props": {
      "shape": "tall",
      "season": "summer",
      "state": "wind"
     },
     "tags": [
      "animated",
      "wind"
     ],
     "png": "library/png/nature/grass/tall_wind_32.png",
     "gif": "library/png/nature/grass/tall_wind_32.gif",
     "frameCount": 6,
     "loopMs": 1002
    },
    "reeds_32": {
     "key": "reeds_32",
     "name": "grass_reeds_32",
     "id": "nature/grass/reeds_32",
     "label": "Roseaux à massettes",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "shape": "reed",
      "season": "summer",
      "state": "still"
     },
     "tags": [
      "reed",
      "cattail",
      "swamp",
      "water"
     ],
     "png": "library/png/nature/grass/reeds_32.png"
    }
   }
  },
  "nature/mushroom": {
   "id": "nature/mushroom",
   "slug": "mushroom",
   "category": "nature",
   "title": "Champignon",
   "description": "Champignons poussant au sol, vus de face : amanite tue-mouches rouge à points blancs, cèpe brun, girolle orangée, touffe de petits champignons beiges, champignon magique bleu lumineux et violet (16 px), grande amanite (32 px). Lumière en haut à gauche, contour sombre.",
   "tags": [
    "mushroom",
    "fungus",
    "toadstool",
    "plant",
    "ground",
    "forest",
    "undergrowth",
    "nature",
    "decoration"
   ],
   "order": 0,
   "source": "assets/nature/mushroom.px.js",
   "module": "library/js/nature/mushroom.js",
   "sheet": {
    "png": "library/sheets/nature/mushroom.png",
    "json": "library/sheets/nature/mushroom.json"
   },
   "axes": {
    "species": [
     "amanita",
     "bolete",
     "chanterelle",
     "cluster",
     "magic"
    ],
    "color": [
     "red",
     "brown",
     "orange",
     "tan",
     "blue",
     "purple"
    ]
   },
   "sizes": [
    16,
    32
   ],
   "variantCount": 7,
   "variants": {
    "amanita_16": {
     "key": "amanita_16",
     "name": "mushroom_amanita_16",
     "id": "nature/mushroom/amanita_16",
     "label": "Amanite tue-mouches",
     "kind": "sprite",
     "w": 16,
     "h": 15,
     "size": 16,
     "props": {
      "species": "amanita",
      "color": "red"
     },
     "tags": [
      "poison"
     ],
     "png": "library/png/nature/mushroom/amanita_16.png"
    },
    "bolete_16": {
     "key": "bolete_16",
     "name": "mushroom_bolete_16",
     "id": "nature/mushroom/bolete_16",
     "label": "Cèpe",
     "kind": "sprite",
     "w": 16,
     "h": 15,
     "size": 16,
     "props": {
      "species": "bolete",
      "color": "brown"
     },
     "tags": [
      "edible"
     ],
     "png": "library/png/nature/mushroom/bolete_16.png"
    },
    "chanterelle_16": {
     "key": "chanterelle_16",
     "name": "mushroom_chanterelle_16",
     "id": "nature/mushroom/chanterelle_16",
     "label": "Girolles",
     "kind": "sprite",
     "w": 16,
     "h": 12,
     "size": 16,
     "props": {
      "species": "chanterelle",
      "color": "orange"
     },
     "tags": [
      "edible"
     ],
     "png": "library/png/nature/mushroom/chanterelle_16.png"
    },
    "cluster_16": {
     "key": "cluster_16",
     "name": "mushroom_cluster_16",
     "id": "nature/mushroom/cluster_16",
     "label": "Touffe de petits champignons",
     "kind": "sprite",
     "w": 16,
     "h": 14,
     "size": 16,
     "props": {
      "species": "cluster",
      "color": "tan"
     },
     "tags": [],
     "png": "library/png/nature/mushroom/cluster_16.png"
    },
    "magic_blue_16": {
     "key": "magic_blue_16",
     "name": "mushroom_magic_blue_16",
     "id": "nature/mushroom/magic_blue_16",
     "label": "Champignon magique bleu (lumineux)",
     "kind": "sprite",
     "w": 16,
     "h": 15,
     "size": 16,
     "props": {
      "species": "magic",
      "color": "blue"
     },
     "tags": [
      "magic",
      "glow",
      "fantasy"
     ],
     "png": "library/png/nature/mushroom/magic_blue_16.png"
    },
    "magic_purple_16": {
     "key": "magic_purple_16",
     "name": "mushroom_magic_purple_16",
     "id": "nature/mushroom/magic_purple_16",
     "label": "Champignon magique violet (lumineux)",
     "kind": "sprite",
     "w": 16,
     "h": 15,
     "size": 16,
     "props": {
      "species": "magic",
      "color": "purple"
     },
     "tags": [
      "magic",
      "glow",
      "fantasy"
     ],
     "png": "library/png/nature/mushroom/magic_purple_16.png"
    },
    "amanita_32": {
     "key": "amanita_32",
     "name": "mushroom_amanita_32",
     "id": "nature/mushroom/amanita_32",
     "label": "Grande amanite (32 px)",
     "kind": "sprite",
     "w": 28,
     "h": 32,
     "size": 32,
     "props": {
      "species": "amanita",
      "color": "red"
     },
     "tags": [
      "poison"
     ],
     "png": "library/png/nature/mushroom/amanita_32.png"
    }
   }
  },
  "nature/palm": {
   "id": "nature/palm",
   "slug": "palm",
   "category": "nature",
   "title": "Palmier",
   "description": "Palmiers d'oasis et de plage, vus de face pour décors 2D : jeune palmier sans tronc (16 px), petit palmier (16 px), palmier dattier droit (32 et 48 px, avec ou sans régimes de dattes), cocotier penché avec noix de coco (32 et 48 px) et palmier desséché aux palmes brunes. Tronc annelé, palmes en arc, lumière en haut à gauche, contour sombre.",
   "tags": [
    "palm",
    "tree",
    "desert",
    "oasis",
    "beach",
    "tropical",
    "date",
    "coconut",
    "nature",
    "decoration"
   ],
   "order": 0,
   "source": "assets/nature/palm.px.js",
   "module": "library/js/nature/palm.js",
   "sheet": {
    "png": "library/sheets/nature/palm.png",
    "json": "library/sheets/nature/palm.json"
   },
   "axes": {
    "species": [
     "date",
     "coconut"
    ],
    "state": [
     "young",
     "plain",
     "fruit",
     "dry"
    ]
   },
   "sizes": [
    16,
    32,
    48
   ],
   "variantCount": 8,
   "variants": {
    "young_16": {
     "key": "young_16",
     "name": "palm_young_16",
     "id": "nature/palm/young_16",
     "label": "Jeune palmier sans tronc (16 px)",
     "kind": "sprite",
     "w": 16,
     "h": 14,
     "size": 16,
     "props": {
      "species": "date",
      "state": "young"
     },
     "tags": [
      "shrub"
     ],
     "png": "library/png/nature/palm/young_16.png"
    },
    "small_16": {
     "key": "small_16",
     "name": "palm_small_16",
     "id": "nature/palm/small_16",
     "label": "Petit palmier (16 px)",
     "kind": "sprite",
     "w": 16,
     "h": 16,
     "size": 16,
     "props": {
      "species": "date",
      "state": "plain"
     },
     "tags": [],
     "png": "library/png/nature/palm/small_16.png"
    },
    "date_32": {
     "key": "date_32",
     "name": "palm_date_32",
     "id": "nature/palm/date_32",
     "label": "Palmier dattier",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "species": "date",
      "state": "plain"
     },
     "tags": [
      "oasis"
     ],
     "png": "library/png/nature/palm/date_32.png"
    },
    "date_fruit_32": {
     "key": "date_fruit_32",
     "name": "palm_date_fruit_32",
     "id": "nature/palm/date_fruit_32",
     "label": "Palmier dattier avec dattes",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "species": "date",
      "state": "fruit"
     },
     "tags": [
      "oasis",
      "fruit"
     ],
     "png": "library/png/nature/palm/date_fruit_32.png"
    },
    "dry_32": {
     "key": "dry_32",
     "name": "palm_dry_32",
     "id": "nature/palm/dry_32",
     "label": "Palmier desséché",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "species": "date",
      "state": "dry"
     },
     "tags": [
      "dead",
      "drought"
     ],
     "png": "library/png/nature/palm/dry_32.png"
    },
    "coconut_32": {
     "key": "coconut_32",
     "name": "palm_coconut_32",
     "id": "nature/palm/coconut_32",
     "label": "Cocotier penché",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "species": "coconut",
      "state": "fruit"
     },
     "tags": [
      "beach",
      "fruit"
     ],
     "png": "library/png/nature/palm/coconut_32.png"
    },
    "date_48": {
     "key": "date_48",
     "name": "palm_date_48",
     "id": "nature/palm/date_48",
     "label": "Grand palmier dattier (48 px)",
     "kind": "sprite",
     "w": 48,
     "h": 48,
     "size": 48,
     "props": {
      "species": "date",
      "state": "fruit"
     },
     "tags": [
      "oasis",
      "fruit",
      "tall"
     ],
     "png": "library/png/nature/palm/date_48.png"
    },
    "coconut_48": {
     "key": "coconut_48",
     "name": "palm_coconut_48",
     "id": "nature/palm/coconut_48",
     "label": "Grand cocotier penché (48 px)",
     "kind": "sprite",
     "w": 48,
     "h": 48,
     "size": 48,
     "props": {
      "species": "coconut",
      "state": "fruit"
     },
     "tags": [
      "beach",
      "fruit",
      "tall"
     ],
     "png": "library/png/nature/palm/coconut_48.png"
    }
   }
  },
  "nature/rock": {
   "id": "nature/rock",
   "slug": "rock",
   "category": "nature",
   "title": "Rocher",
   "description": "Pierres et rochers pour décors, vus de face : petit caillou, tas de galets, gros rocher à facettes, cairn de pierres empilées (16, 32 px), aiguille rocheuse, escarpement de blocs (48 px) et arche naturelle (48 px), en versions nue, moussue, enneigée, grès du désert. Lumière en haut à gauche, contour sombre.",
   "tags": [
    "rock",
    "stone",
    "boulder",
    "nature",
    "decoration",
    "obstacle",
    "cliff",
    "terrain"
   ],
   "order": 0,
   "source": "assets/nature/rock.px.js",
   "module": "library/js/nature/rock.js",
   "sheet": {
    "png": "library/sheets/nature/rock.png",
    "json": "library/sheets/nature/rock.json"
   },
   "axes": {
    "form": [
     "stone",
     "pebbles",
     "boulder",
     "cairn",
     "spire",
     "crag",
     "arch"
    ],
    "surface": [
     "bare",
     "mossy",
     "snow"
    ],
    "material": [
     "granite",
     "sandstone"
    ]
   },
   "sizes": [
    16,
    32,
    48
   ],
   "variantCount": 16,
   "variants": {
    "small_16": {
     "key": "small_16",
     "name": "rock_small_16",
     "id": "nature/rock/small_16",
     "label": "Caillou",
     "kind": "sprite",
     "w": 16,
     "h": 12,
     "size": 16,
     "props": {
      "form": "stone",
      "surface": "bare",
      "material": "granite"
     },
     "tags": [],
     "png": "library/png/nature/rock/small_16.png"
    },
    "small_mossy_16": {
     "key": "small_mossy_16",
     "name": "rock_small_mossy_16",
     "id": "nature/rock/small_mossy_16",
     "label": "Caillou moussu",
     "kind": "sprite",
     "w": 16,
     "h": 12,
     "size": 16,
     "props": {
      "form": "stone",
      "surface": "mossy",
      "material": "granite"
     },
     "tags": [],
     "png": "library/png/nature/rock/small_mossy_16.png"
    },
    "pebbles_16": {
     "key": "pebbles_16",
     "name": "rock_pebbles_16",
     "id": "nature/rock/pebbles_16",
     "label": "Tas de galets",
     "kind": "sprite",
     "w": 16,
     "h": 11,
     "size": 16,
     "props": {
      "form": "pebbles",
      "surface": "bare",
      "material": "granite"
     },
     "tags": [],
     "png": "library/png/nature/rock/pebbles_16.png"
    },
    "boulder_32": {
     "key": "boulder_32",
     "name": "rock_boulder_32",
     "id": "nature/rock/boulder_32",
     "label": "Gros rocher",
     "kind": "sprite",
     "w": 32,
     "h": 25,
     "size": 32,
     "props": {
      "form": "boulder",
      "surface": "bare",
      "material": "granite"
     },
     "tags": [],
     "png": "library/png/nature/rock/boulder_32.png"
    },
    "boulder_mossy_32": {
     "key": "boulder_mossy_32",
     "name": "rock_boulder_mossy_32",
     "id": "nature/rock/boulder_mossy_32",
     "label": "Gros rocher moussu",
     "kind": "sprite",
     "w": 32,
     "h": 25,
     "size": 32,
     "props": {
      "form": "boulder",
      "surface": "mossy",
      "material": "granite"
     },
     "tags": [],
     "png": "library/png/nature/rock/boulder_mossy_32.png"
    },
    "boulder_snow_32": {
     "key": "boulder_snow_32",
     "name": "rock_boulder_snow_32",
     "id": "nature/rock/boulder_snow_32",
     "label": "Gros rocher enneigé",
     "kind": "sprite",
     "w": 32,
     "h": 25,
     "size": 32,
     "props": {
      "form": "boulder",
      "surface": "snow",
      "material": "granite"
     },
     "tags": [
      "snow",
      "winter"
     ],
     "png": "library/png/nature/rock/boulder_snow_32.png"
    },
    "boulder_sand_32": {
     "key": "boulder_sand_32",
     "name": "rock_boulder_sand_32",
     "id": "nature/rock/boulder_sand_32",
     "label": "Rocher de grès (désert)",
     "kind": "sprite",
     "w": 32,
     "h": 25,
     "size": 32,
     "props": {
      "form": "boulder",
      "surface": "bare",
      "material": "sandstone"
     },
     "tags": [
      "desert"
     ],
     "png": "library/png/nature/rock/boulder_sand_32.png"
    },
    "cairn_16": {
     "key": "cairn_16",
     "name": "rock_cairn_16",
     "id": "nature/rock/cairn_16",
     "label": "Cairn (16 px)",
     "kind": "sprite",
     "w": 14,
     "h": 15,
     "size": 16,
     "props": {
      "form": "cairn",
      "surface": "bare",
      "material": "granite"
     },
     "tags": [
      "cairn",
      "stack",
      "landmark",
      "trail"
     ],
     "png": "library/png/nature/rock/cairn_16.png"
    },
    "cairn_32": {
     "key": "cairn_32",
     "name": "rock_cairn_32",
     "id": "nature/rock/cairn_32",
     "label": "Grand cairn moussu à la base",
     "kind": "sprite",
     "w": 22,
     "h": 28,
     "size": 32,
     "props": {
      "form": "cairn",
      "surface": "mossy",
      "material": "granite"
     },
     "tags": [
      "cairn",
      "stack",
      "landmark",
      "trail"
     ],
     "png": "library/png/nature/rock/cairn_32.png"
    },
    "spire_32": {
     "key": "spire_32",
     "name": "rock_spire_32",
     "id": "nature/rock/spire_32",
     "label": "Aiguille rocheuse",
     "kind": "sprite",
     "w": 16,
     "h": 32,
     "size": 32,
     "props": {
      "form": "spire",
      "surface": "bare",
      "material": "granite"
     },
     "tags": [
      "spire",
      "pillar",
      "needle"
     ],
     "png": "library/png/nature/rock/spire_32.png"
    },
    "spire_sand_32": {
     "key": "spire_sand_32",
     "name": "rock_spire_sand_32",
     "id": "nature/rock/spire_sand_32",
     "label": "Aiguille de grès (désert)",
     "kind": "sprite",
     "w": 16,
     "h": 32,
     "size": 32,
     "props": {
      "form": "spire",
      "surface": "bare",
      "material": "sandstone"
     },
     "tags": [
      "spire",
      "pillar",
      "desert",
      "hoodoo"
     ],
     "png": "library/png/nature/rock/spire_sand_32.png"
    },
    "crag_48": {
     "key": "crag_48",
     "name": "rock_crag_48",
     "id": "nature/rock/crag_48",
     "label": "Escarpement de blocs (48 px)",
     "kind": "sprite",
     "w": 48,
     "h": 32,
     "size": 48,
     "props": {
      "form": "crag",
      "surface": "bare",
      "material": "granite"
     },
     "tags": [
      "crag",
      "cliff",
      "outcrop"
     ],
     "png": "library/png/nature/rock/crag_48.png"
    },
    "crag_mossy_48": {
     "key": "crag_mossy_48",
     "name": "rock_crag_mossy_48",
     "id": "nature/rock/crag_mossy_48",
     "label": "Escarpement moussu (48 px)",
     "kind": "sprite",
     "w": 48,
     "h": 32,
     "size": 48,
     "props": {
      "form": "crag",
      "surface": "mossy",
      "material": "granite"
     },
     "tags": [
      "crag",
      "cliff",
      "outcrop",
      "moss"
     ],
     "png": "library/png/nature/rock/crag_mossy_48.png"
    },
    "crag_snow_48": {
     "key": "crag_snow_48",
     "name": "rock_crag_snow_48",
     "id": "nature/rock/crag_snow_48",
     "label": "Escarpement enneigé (48 px)",
     "kind": "sprite",
     "w": 48,
     "h": 32,
     "size": 48,
     "props": {
      "form": "crag",
      "surface": "snow",
      "material": "granite"
     },
     "tags": [
      "crag",
      "cliff",
      "snow",
      "winter"
     ],
     "png": "library/png/nature/rock/crag_snow_48.png"
    },
    "arch_48": {
     "key": "arch_48",
     "name": "rock_arch_48",
     "id": "nature/rock/arch_48",
     "label": "Arche naturelle (48 px)",
     "kind": "sprite",
     "w": 48,
     "h": 32,
     "size": 48,
     "props": {
      "form": "arch",
      "surface": "bare",
      "material": "granite"
     },
     "tags": [
      "arch",
      "landmark"
     ],
     "png": "library/png/nature/rock/arch_48.png"
    },
    "arch_sand_48": {
     "key": "arch_sand_48",
     "name": "rock_arch_sand_48",
     "id": "nature/rock/arch_sand_48",
     "label": "Arche de grès du désert (48 px)",
     "kind": "sprite",
     "w": 48,
     "h": 32,
     "size": 48,
     "props": {
      "form": "arch",
      "surface": "bare",
      "material": "sandstone"
     },
     "tags": [
      "arch",
      "landmark",
      "desert",
      "canyon"
     ],
     "png": "library/png/nature/rock/arch_sand_48.png"
    }
   }
  },
  "nature/tree": {
   "id": "nature/tree",
   "slug": "tree",
   "category": "nature",
   "title": "Arbre",
   "description": "Arbres vus de face pour décors 2D : chêne, sapin, bouleau, pommier. Plusieurs saisons, densités de feuillage et tailles (16, 32, 48 px). Lumière en haut à gauche, contour sombre.",
   "tags": [
    "tree",
    "plant",
    "forest",
    "nature",
    "decoration",
    "scenery"
   ],
   "order": 0,
   "source": "assets/nature/tree.px.js",
   "module": "library/js/nature/tree.js",
   "sheet": {
    "png": "library/sheets/nature/tree.png",
    "json": "library/sheets/nature/tree.json"
   },
   "axes": {
    "species": [
     "oak",
     "pine",
     "apple",
     "birch"
    ],
    "season": [
     "summer",
     "autumn",
     "winter",
     "spring"
    ],
    "foliage": [
     "full",
     "sparse",
     "bare"
    ]
   },
   "sizes": [
    16,
    32,
    48
   ],
   "variantCount": 19,
   "variants": {
    "oak_summer_16": {
     "key": "oak_summer_16",
     "name": "tree_oak_summer_16",
     "id": "nature/tree/oak_summer_16",
     "label": "Chêne – été (16 px)",
     "kind": "sprite",
     "w": 16,
     "h": 16,
     "size": 16,
     "props": {
      "species": "oak",
      "season": "summer",
      "foliage": "full"
     },
     "tags": [],
     "png": "library/png/nature/tree/oak_summer_16.png"
    },
    "oak_autumn_16": {
     "key": "oak_autumn_16",
     "name": "tree_oak_autumn_16",
     "id": "nature/tree/oak_autumn_16",
     "label": "Chêne – automne (16 px)",
     "kind": "sprite",
     "w": 16,
     "h": 16,
     "size": 16,
     "props": {
      "species": "oak",
      "season": "autumn",
      "foliage": "full"
     },
     "tags": [],
     "png": "library/png/nature/tree/oak_autumn_16.png"
    },
    "pine_16": {
     "key": "pine_16",
     "name": "tree_pine_16",
     "id": "nature/tree/pine_16",
     "label": "Sapin (16 px)",
     "kind": "sprite",
     "w": 16,
     "h": 16,
     "size": 16,
     "props": {
      "species": "pine",
      "season": "summer",
      "foliage": "full"
     },
     "tags": [],
     "png": "library/png/nature/tree/pine_16.png"
    },
    "pine_snow_16": {
     "key": "pine_snow_16",
     "name": "tree_pine_snow_16",
     "id": "nature/tree/pine_snow_16",
     "label": "Sapin enneigé (16 px)",
     "kind": "sprite",
     "w": 16,
     "h": 16,
     "size": 16,
     "props": {
      "species": "pine",
      "season": "winter",
      "foliage": "full"
     },
     "tags": [],
     "png": "library/png/nature/tree/pine_snow_16.png"
    },
    "oak_summer_full_32": {
     "key": "oak_summer_full_32",
     "name": "tree_oak_summer_full_32",
     "id": "nature/tree/oak_summer_full_32",
     "label": "Chêne – été, feuillage dense",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "species": "oak",
      "season": "summer",
      "foliage": "full"
     },
     "tags": [],
     "png": "library/png/nature/tree/oak_summer_full_32.png"
    },
    "oak_summer_sparse_32": {
     "key": "oak_summer_sparse_32",
     "name": "tree_oak_summer_sparse_32",
     "id": "nature/tree/oak_summer_sparse_32",
     "label": "Chêne – été, peu de feuilles",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "species": "oak",
      "season": "summer",
      "foliage": "sparse"
     },
     "tags": [],
     "png": "library/png/nature/tree/oak_summer_sparse_32.png"
    },
    "oak_winter_32": {
     "key": "oak_winter_32",
     "name": "tree_oak_winter_32",
     "id": "nature/tree/oak_winter_32",
     "label": "Chêne – hiver, branches nues enneigées",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "species": "oak",
      "season": "winter",
      "foliage": "bare"
     },
     "tags": [],
     "png": "library/png/nature/tree/oak_winter_32.png"
    },
    "oak_autumn_32": {
     "key": "oak_autumn_32",
     "name": "tree_oak_autumn_32",
     "id": "nature/tree/oak_autumn_32",
     "label": "Chêne – automne (rouge-orangé)",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "species": "oak",
      "season": "autumn",
      "foliage": "full"
     },
     "tags": [],
     "png": "library/png/nature/tree/oak_autumn_32.png"
    },
    "oak_autumn_sparse_32": {
     "key": "oak_autumn_sparse_32",
     "name": "tree_oak_autumn_sparse_32",
     "id": "nature/tree/oak_autumn_sparse_32",
     "label": "Chêne – fin d'automne, peu de feuilles",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "species": "oak",
      "season": "autumn",
      "foliage": "sparse"
     },
     "tags": [],
     "png": "library/png/nature/tree/oak_autumn_sparse_32.png"
    },
    "oak_spring_32": {
     "key": "oak_spring_32",
     "name": "tree_oak_spring_32",
     "id": "nature/tree/oak_spring_32",
     "label": "Chêne – printemps en fleurs",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "species": "oak",
      "season": "spring",
      "foliage": "full"
     },
     "tags": [],
     "png": "library/png/nature/tree/oak_spring_32.png"
    },
    "apple_32": {
     "key": "apple_32",
     "name": "tree_apple_32",
     "id": "nature/tree/apple_32",
     "label": "Pommier avec pommes",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "species": "apple",
      "season": "summer",
      "foliage": "full"
     },
     "tags": [
      "fruit"
     ],
     "png": "library/png/nature/tree/apple_32.png"
    },
    "pine_32": {
     "key": "pine_32",
     "name": "tree_pine_32",
     "id": "nature/tree/pine_32",
     "label": "Sapin",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "species": "pine",
      "season": "summer",
      "foliage": "full"
     },
     "tags": [],
     "png": "library/png/nature/tree/pine_32.png"
    },
    "pine_snow_32": {
     "key": "pine_snow_32",
     "name": "tree_pine_snow_32",
     "id": "nature/tree/pine_snow_32",
     "label": "Sapin enneigé",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "species": "pine",
      "season": "winter",
      "foliage": "full"
     },
     "tags": [
      "snow"
     ],
     "png": "library/png/nature/tree/pine_snow_32.png"
    },
    "birch_32": {
     "key": "birch_32",
     "name": "tree_birch_32",
     "id": "nature/tree/birch_32",
     "label": "Bouleau – été",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "species": "birch",
      "season": "summer",
      "foliage": "full"
     },
     "tags": [],
     "png": "library/png/nature/tree/birch_32.png"
    },
    "birch_autumn_32": {
     "key": "birch_autumn_32",
     "name": "tree_birch_autumn_32",
     "id": "nature/tree/birch_autumn_32",
     "label": "Bouleau – automne doré",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "species": "birch",
      "season": "autumn",
      "foliage": "full"
     },
     "tags": [],
     "png": "library/png/nature/tree/birch_autumn_32.png"
    },
    "oak_summer_48": {
     "key": "oak_summer_48",
     "name": "tree_oak_summer_48",
     "id": "nature/tree/oak_summer_48",
     "label": "Grand chêne – été (48 px)",
     "kind": "sprite",
     "w": 48,
     "h": 48,
     "size": 48,
     "props": {
      "species": "oak",
      "season": "summer",
      "foliage": "full"
     },
     "tags": [],
     "png": "library/png/nature/tree/oak_summer_48.png"
    },
    "oak_autumn_48": {
     "key": "oak_autumn_48",
     "name": "tree_oak_autumn_48",
     "id": "nature/tree/oak_autumn_48",
     "label": "Grand chêne – automne (48 px)",
     "kind": "sprite",
     "w": 48,
     "h": 48,
     "size": 48,
     "props": {
      "species": "oak",
      "season": "autumn",
      "foliage": "full"
     },
     "tags": [],
     "png": "library/png/nature/tree/oak_autumn_48.png"
    },
    "pine_48": {
     "key": "pine_48",
     "name": "tree_pine_48",
     "id": "nature/tree/pine_48",
     "label": "Grand sapin (48 px)",
     "kind": "sprite",
     "w": 48,
     "h": 48,
     "size": 48,
     "props": {
      "species": "pine",
      "season": "summer",
      "foliage": "full"
     },
     "tags": [],
     "png": "library/png/nature/tree/pine_48.png"
    },
    "pine_snow_48": {
     "key": "pine_snow_48",
     "name": "tree_pine_snow_48",
     "id": "nature/tree/pine_snow_48",
     "label": "Grand sapin enneigé (48 px)",
     "kind": "sprite",
     "w": 48,
     "h": 48,
     "size": 48,
     "props": {
      "species": "pine",
      "season": "winter",
      "foliage": "full"
     },
     "tags": [
      "snow"
     ],
     "png": "library/png/nature/tree/pine_snow_48.png"
    }
   }
  },
  "nature/tumbleweed": {
   "id": "nature/tumbleweed",
   "slug": "tumbleweed",
   "category": "nature",
   "title": "Virevoltant",
   "description": "Virevoltants (boules de broussailles sèches roulées par le vent), vus de face pour décors de désert et de western : boule sèche (16 et 32 px), boule délavée par le soleil, jeune boule encore verte, et versions animées qui roulent en rebondissant (16 et 32 px, 4 images de 100 ms). Lacis de brindilles, lumière en haut à gauche, contour sombre.",
   "tags": [
    "tumbleweed",
    "desert",
    "western",
    "dry",
    "plant",
    "wind",
    "rolling",
    "nature",
    "decoration"
   ],
   "order": 0,
   "source": "assets/nature/tumbleweed.px.js",
   "module": "library/js/nature/tumbleweed.js",
   "sheet": {
    "png": "library/sheets/nature/tumbleweed.png",
    "json": "library/sheets/nature/tumbleweed.json"
   },
   "axes": {
    "color": [
     "brown",
     "pale",
     "green"
    ],
    "state": [
     "still",
     "rolling"
    ]
   },
   "sizes": [
    16,
    32
   ],
   "variantCount": 6,
   "variants": {
    "dry_16": {
     "key": "dry_16",
     "name": "tumbleweed_dry_16",
     "id": "nature/tumbleweed/dry_16",
     "label": "Virevoltant sec (16 px)",
     "kind": "sprite",
     "w": 16,
     "h": 16,
     "size": 16,
     "props": {
      "color": "brown",
      "state": "still"
     },
     "tags": [],
     "png": "library/png/nature/tumbleweed/dry_16.png"
    },
    "dry_32": {
     "key": "dry_32",
     "name": "tumbleweed_dry_32",
     "id": "nature/tumbleweed/dry_32",
     "label": "Virevoltant sec",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "color": "brown",
      "state": "still"
     },
     "tags": [],
     "png": "library/png/nature/tumbleweed/dry_32.png"
    },
    "pale_32": {
     "key": "pale_32",
     "name": "tumbleweed_pale_32",
     "id": "nature/tumbleweed/pale_32",
     "label": "Virevoltant délavé",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "color": "pale",
      "state": "still"
     },
     "tags": [
      "bleached"
     ],
     "png": "library/png/nature/tumbleweed/pale_32.png"
    },
    "green_32": {
     "key": "green_32",
     "name": "tumbleweed_green_32",
     "id": "nature/tumbleweed/green_32",
     "label": "Jeune virevoltant encore vert",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "color": "green",
      "state": "still"
     },
     "tags": [
      "young"
     ],
     "png": "library/png/nature/tumbleweed/green_32.png"
    },
    "roll_16": {
     "key": "roll_16",
     "name": "tumbleweed_roll_16",
     "id": "nature/tumbleweed/roll_16",
     "label": "Virevoltant qui roule (16 px, animé)",
     "kind": "anim",
     "w": 16,
     "h": 16,
     "size": 16,
     "props": {
      "color": "brown",
      "state": "rolling"
     },
     "tags": [
      "animated"
     ],
     "png": "library/png/nature/tumbleweed/roll_16.png",
     "gif": "library/png/nature/tumbleweed/roll_16.gif",
     "frameCount": 4,
     "loopMs": 400
    },
    "roll_32": {
     "key": "roll_32",
     "name": "tumbleweed_roll_32",
     "id": "nature/tumbleweed/roll_32",
     "label": "Virevoltant qui roule (animé)",
     "kind": "anim",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "color": "brown",
      "state": "rolling"
     },
     "tags": [
      "animated"
     ],
     "png": "library/png/nature/tumbleweed/roll_32.png",
     "gif": "library/png/nature/tumbleweed/roll_32.gif",
     "frameCount": 4,
     "loopMs": 400
    }
   }
  },
  "landscape/hill": {
   "id": "landscape/hill",
   "slug": "hill",
   "category": "landscape",
   "title": "Colline",
   "description": "Collines vues de face pour décors 2D, posées au sol : colline ronde (16, 32 px) en herbe d'été, fleurie, parsemée de pierres, dorée d'automne ou enneigée ; vallonnement de trois collines qui se recouvrent (64 × 24) en été, fleuri, automne et hiver ; dune de sable et champ de dunes du désert. Ombrage en croissants (lumière en haut à gauche), contour sombre.",
   "tags": [
    "hill",
    "landscape",
    "terrain",
    "background",
    "scenery",
    "relief",
    "meadow",
    "ground"
   ],
   "order": 0,
   "source": "assets/landscape/hill.px.js",
   "module": "library/js/landscape/hill.js",
   "sheet": {
    "png": "library/sheets/landscape/hill.png",
    "json": "library/sheets/landscape/hill.json"
   },
   "axes": {
    "shape": [
     "round",
     "rolling",
     "dune"
    ],
    "season": [
     "summer",
     "spring",
     "autumn",
     "winter"
    ],
    "cover": [
     "grass",
     "flowers",
     "rocks",
     "snow",
     "sand"
    ]
   },
   "sizes": [
    16,
    32,
    64
   ],
   "variantCount": 12,
   "variants": {
    "round_32": {
     "key": "round_32",
     "name": "hill_round_32",
     "id": "landscape/hill/round_32",
     "label": "Colline ronde – été",
     "kind": "sprite",
     "w": 32,
     "h": 18,
     "size": 32,
     "props": {
      "shape": "round",
      "season": "summer",
      "cover": "grass"
     },
     "tags": [
      "grass"
     ],
     "png": "library/png/landscape/hill/round_32.png"
    },
    "flowers_32": {
     "key": "flowers_32",
     "name": "hill_flowers_32",
     "id": "landscape/hill/flowers_32",
     "label": "Colline fleurie – printemps",
     "kind": "sprite",
     "w": 32,
     "h": 18,
     "size": 32,
     "props": {
      "shape": "round",
      "season": "spring",
      "cover": "flowers"
     },
     "tags": [
      "flower",
      "grass"
     ],
     "png": "library/png/landscape/hill/flowers_32.png"
    },
    "rocky_32": {
     "key": "rocky_32",
     "name": "hill_rocky_32",
     "id": "landscape/hill/rocky_32",
     "label": "Colline semée de pierres",
     "kind": "sprite",
     "w": 32,
     "h": 18,
     "size": 32,
     "props": {
      "shape": "round",
      "season": "summer",
      "cover": "rocks"
     },
     "tags": [
      "rock",
      "stone",
      "grass"
     ],
     "png": "library/png/landscape/hill/rocky_32.png"
    },
    "autumn_32": {
     "key": "autumn_32",
     "name": "hill_autumn_32",
     "id": "landscape/hill/autumn_32",
     "label": "Colline dorée – automne",
     "kind": "sprite",
     "w": 32,
     "h": 18,
     "size": 32,
     "props": {
      "shape": "round",
      "season": "autumn",
      "cover": "grass"
     },
     "tags": [
      "grass",
      "golden"
     ],
     "png": "library/png/landscape/hill/autumn_32.png"
    },
    "snow_32": {
     "key": "snow_32",
     "name": "hill_snow_32",
     "id": "landscape/hill/snow_32",
     "label": "Colline enneigée – hiver",
     "kind": "sprite",
     "w": 32,
     "h": 18,
     "size": 32,
     "props": {
      "shape": "round",
      "season": "winter",
      "cover": "snow"
     },
     "tags": [
      "snow"
     ],
     "png": "library/png/landscape/hill/snow_32.png"
    },
    "round_16": {
     "key": "round_16",
     "name": "hill_round_16",
     "id": "landscape/hill/round_16",
     "label": "Petite colline (16 px)",
     "kind": "sprite",
     "w": 16,
     "h": 10,
     "size": 16,
     "props": {
      "shape": "round",
      "season": "summer",
      "cover": "grass"
     },
     "tags": [
      "icon",
      "grass"
     ],
     "png": "library/png/landscape/hill/round_16.png"
    },
    "rolling_64": {
     "key": "rolling_64",
     "name": "hill_rolling_64",
     "id": "landscape/hill/rolling_64",
     "label": "Vallonnement – été (64 × 24)",
     "kind": "sprite",
     "w": 64,
     "h": 24,
     "size": 64,
     "props": {
      "shape": "rolling",
      "season": "summer",
      "cover": "grass"
     },
     "tags": [
      "grass",
      "countryside"
     ],
     "png": "library/png/landscape/hill/rolling_64.png"
    },
    "rolling_flowers_64": {
     "key": "rolling_flowers_64",
     "name": "hill_rolling_flowers_64",
     "id": "landscape/hill/rolling_flowers_64",
     "label": "Vallonnement fleuri – printemps (64 × 24)",
     "kind": "sprite",
     "w": 64,
     "h": 24,
     "size": 64,
     "props": {
      "shape": "rolling",
      "season": "spring",
      "cover": "flowers"
     },
     "tags": [
      "flower",
      "countryside"
     ],
     "png": "library/png/landscape/hill/rolling_flowers_64.png"
    },
    "rolling_autumn_64": {
     "key": "rolling_autumn_64",
     "name": "hill_rolling_autumn_64",
     "id": "landscape/hill/rolling_autumn_64",
     "label": "Vallonnement doré – automne (64 × 24)",
     "kind": "sprite",
     "w": 64,
     "h": 24,
     "size": 64,
     "props": {
      "shape": "rolling",
      "season": "autumn",
      "cover": "grass"
     },
     "tags": [
      "golden",
      "countryside"
     ],
     "png": "library/png/landscape/hill/rolling_autumn_64.png"
    },
    "rolling_snow_64": {
     "key": "rolling_snow_64",
     "name": "hill_rolling_snow_64",
     "id": "landscape/hill/rolling_snow_64",
     "label": "Vallonnement enneigé – hiver (64 × 24)",
     "kind": "sprite",
     "w": 64,
     "h": 24,
     "size": 64,
     "props": {
      "shape": "rolling",
      "season": "winter",
      "cover": "snow"
     },
     "tags": [
      "snow",
      "countryside"
     ],
     "png": "library/png/landscape/hill/rolling_snow_64.png"
    },
    "dune_32": {
     "key": "dune_32",
     "name": "hill_dune_32",
     "id": "landscape/hill/dune_32",
     "label": "Dune de sable",
     "kind": "sprite",
     "w": 32,
     "h": 14,
     "size": 32,
     "props": {
      "shape": "dune",
      "season": "summer",
      "cover": "sand"
     },
     "tags": [
      "desert",
      "sand"
     ],
     "png": "library/png/landscape/hill/dune_32.png"
    },
    "dunes_64": {
     "key": "dunes_64",
     "name": "hill_dunes_64",
     "id": "landscape/hill/dunes_64",
     "label": "Champ de dunes (64 × 22)",
     "kind": "sprite",
     "w": 64,
     "h": 22,
     "size": 64,
     "props": {
      "shape": "dune",
      "season": "summer",
      "cover": "sand"
     },
     "tags": [
      "desert",
      "sand"
     ],
     "png": "library/png/landscape/hill/dunes_64.png"
    }
   }
  },
  "landscape/mountain": {
   "id": "landscape/mountain",
   "slug": "mountain",
   "category": "landscape",
   "title": "Montagne",
   "description": "Montagnes vues de face pour décors 2D et arrière-plans : pic à deux sommets (16, 32, 64 px, et 128 px pour les fonds de scène) enneigé, alpin avec forêt de sapins au pied ou tout blanc en hiver ; chaîne de trois sommets (64 × 32) en versions jour, alpine, lointaine bleutée et crépuscule pour les couches de parallaxe ; volcan endormi au sommet enneigé et volcan en éruption animé (lave, fumée) ; mesa du désert en grès ou en roche rouge. Lumière en haut à gauche, contour sombre, sol en bas du canevas.",
   "tags": [
    "mountain",
    "peak",
    "landscape",
    "background",
    "scenery",
    "terrain",
    "parallax",
    "relief"
   ],
   "order": 0,
   "source": "assets/landscape/mountain.px.js",
   "module": "library/js/landscape/mountain.js",
   "sheet": {
    "png": "library/sheets/landscape/mountain.png",
    "json": "library/sheets/landscape/mountain.json"
   },
   "axes": {
    "shape": [
     "peak",
     "range",
     "volcano",
     "mesa"
    ],
    "cover": [
     "snowcap",
     "forest",
     "snow",
     "lava",
     "bare"
    ],
    "tone": [
     "day",
     "haze",
     "dusk"
    ],
    "material": [
     "granite",
     "basalt",
     "sandstone",
     "redstone"
    ]
   },
   "sizes": [
    16,
    32,
    48,
    64,
    128
   ],
   "variantCount": 19,
   "variants": {
    "peak_snow_64": {
     "key": "peak_snow_64",
     "name": "mountain_peak_snow_64",
     "id": "landscape/mountain/peak_snow_64",
     "label": "Grand pic enneigé (64 px)",
     "kind": "sprite",
     "w": 64,
     "h": 46,
     "size": 64,
     "props": {
      "shape": "peak",
      "cover": "snowcap",
      "tone": "day",
      "material": "granite"
     },
     "tags": [
      "snow"
     ],
     "png": "library/png/landscape/mountain/peak_snow_64.png"
    },
    "peak_alpine_64": {
     "key": "peak_alpine_64",
     "name": "mountain_peak_alpine_64",
     "id": "landscape/mountain/peak_alpine_64",
     "label": "Grand pic alpin, alpage et sapins (64 px)",
     "kind": "sprite",
     "w": 64,
     "h": 46,
     "size": 64,
     "props": {
      "shape": "peak",
      "cover": "forest",
      "tone": "day",
      "material": "granite"
     },
     "tags": [
      "forest",
      "pine",
      "meadow"
     ],
     "png": "library/png/landscape/mountain/peak_alpine_64.png"
    },
    "peak_winter_64": {
     "key": "peak_winter_64",
     "name": "mountain_peak_winter_64",
     "id": "landscape/mountain/peak_winter_64",
     "label": "Grand pic tout enneigé (64 px)",
     "kind": "sprite",
     "w": 64,
     "h": 46,
     "size": 64,
     "props": {
      "shape": "peak",
      "cover": "snow",
      "tone": "day",
      "material": "granite"
     },
     "tags": [
      "snow",
      "winter"
     ],
     "png": "library/png/landscape/mountain/peak_winter_64.png"
    },
    "peak_snow_128": {
     "key": "peak_snow_128",
     "name": "mountain_peak_snow_128",
     "id": "landscape/mountain/peak_snow_128",
     "label": "Très grand pic enneigé, fond de scène (128 px)",
     "kind": "sprite",
     "w": 126,
     "h": 90,
     "size": 128,
     "props": {
      "shape": "peak",
      "cover": "snowcap",
      "tone": "day",
      "material": "granite"
     },
     "tags": [
      "snow",
      "backdrop"
     ],
     "png": "library/png/landscape/mountain/peak_snow_128.png"
    },
    "peak_winter_128": {
     "key": "peak_winter_128",
     "name": "mountain_peak_winter_128",
     "id": "landscape/mountain/peak_winter_128",
     "label": "Très grand pic tout enneigé, fond de scène (128 px)",
     "kind": "sprite",
     "w": 126,
     "h": 90,
     "size": 128,
     "props": {
      "shape": "peak",
      "cover": "snow",
      "tone": "day",
      "material": "granite"
     },
     "tags": [
      "snow",
      "winter",
      "backdrop"
     ],
     "png": "library/png/landscape/mountain/peak_winter_128.png"
    },
    "peak_snow_32": {
     "key": "peak_snow_32",
     "name": "mountain_peak_snow_32",
     "id": "landscape/mountain/peak_snow_32",
     "label": "Pic enneigé (32 px)",
     "kind": "sprite",
     "w": 32,
     "h": 28,
     "size": 32,
     "props": {
      "shape": "peak",
      "cover": "snowcap",
      "tone": "day",
      "material": "granite"
     },
     "tags": [
      "snow"
     ],
     "png": "library/png/landscape/mountain/peak_snow_32.png"
    },
    "peak_alpine_32": {
     "key": "peak_alpine_32",
     "name": "mountain_peak_alpine_32",
     "id": "landscape/mountain/peak_alpine_32",
     "label": "Pic alpin, forêt au pied (32 px)",
     "kind": "sprite",
     "w": 32,
     "h": 28,
     "size": 32,
     "props": {
      "shape": "peak",
      "cover": "forest",
      "tone": "day",
      "material": "granite"
     },
     "tags": [
      "forest",
      "pine"
     ],
     "png": "library/png/landscape/mountain/peak_alpine_32.png"
    },
    "peak_winter_32": {
     "key": "peak_winter_32",
     "name": "mountain_peak_winter_32",
     "id": "landscape/mountain/peak_winter_32",
     "label": "Pic tout enneigé (32 px)",
     "kind": "sprite",
     "w": 32,
     "h": 28,
     "size": 32,
     "props": {
      "shape": "peak",
      "cover": "snow",
      "tone": "day",
      "material": "granite"
     },
     "tags": [
      "snow",
      "winter"
     ],
     "png": "library/png/landscape/mountain/peak_winter_32.png"
    },
    "peak_snow_16": {
     "key": "peak_snow_16",
     "name": "mountain_peak_snow_16",
     "id": "landscape/mountain/peak_snow_16",
     "label": "Pic enneigé (16 px)",
     "kind": "sprite",
     "w": 16,
     "h": 14,
     "size": 16,
     "props": {
      "shape": "peak",
      "cover": "snowcap",
      "tone": "day",
      "material": "granite"
     },
     "tags": [
      "icon",
      "snow"
     ],
     "png": "library/png/landscape/mountain/peak_snow_16.png"
    },
    "peak_alpine_16": {
     "key": "peak_alpine_16",
     "name": "mountain_peak_alpine_16",
     "id": "landscape/mountain/peak_alpine_16",
     "label": "Pic alpin (16 px)",
     "kind": "sprite",
     "w": 16,
     "h": 14,
     "size": 16,
     "props": {
      "shape": "peak",
      "cover": "forest",
      "tone": "day",
      "material": "granite"
     },
     "tags": [
      "icon",
      "forest"
     ],
     "png": "library/png/landscape/mountain/peak_alpine_16.png"
    },
    "peak_winter_16": {
     "key": "peak_winter_16",
     "name": "mountain_peak_winter_16",
     "id": "landscape/mountain/peak_winter_16",
     "label": "Pic en hiver (16 px)",
     "kind": "sprite",
     "w": 16,
     "h": 14,
     "size": 16,
     "props": {
      "shape": "peak",
      "cover": "snow",
      "tone": "day",
      "material": "granite"
     },
     "tags": [
      "icon",
      "snow",
      "winter"
     ],
     "png": "library/png/landscape/mountain/peak_winter_16.png"
    },
    "range_snow_64": {
     "key": "range_snow_64",
     "name": "mountain_range_snow_64",
     "id": "landscape/mountain/range_snow_64",
     "label": "Chaîne de sommets enneigés (64 × 32)",
     "kind": "sprite",
     "w": 64,
     "h": 32,
     "size": 64,
     "props": {
      "shape": "range",
      "cover": "snowcap",
      "tone": "day",
      "material": "granite"
     },
     "tags": [
      "snow",
      "range"
     ],
     "png": "library/png/landscape/mountain/range_snow_64.png"
    },
    "range_alpine_64": {
     "key": "range_alpine_64",
     "name": "mountain_range_alpine_64",
     "id": "landscape/mountain/range_alpine_64",
     "label": "Chaîne alpine, forêt au pied (64 × 32)",
     "kind": "sprite",
     "w": 64,
     "h": 32,
     "size": 64,
     "props": {
      "shape": "range",
      "cover": "forest",
      "tone": "day",
      "material": "granite"
     },
     "tags": [
      "forest",
      "pine",
      "range"
     ],
     "png": "library/png/landscape/mountain/range_alpine_64.png"
    },
    "range_far_64": {
     "key": "range_far_64",
     "name": "mountain_range_far_64",
     "id": "landscape/mountain/range_far_64",
     "label": "Chaîne lointaine bleutée (64 × 32)",
     "kind": "sprite",
     "w": 64,
     "h": 32,
     "size": 64,
     "props": {
      "shape": "range",
      "cover": "snowcap",
      "tone": "haze",
      "material": "granite"
     },
     "tags": [
      "distant",
      "haze",
      "range"
     ],
     "png": "library/png/landscape/mountain/range_far_64.png"
    },
    "range_dusk_64": {
     "key": "range_dusk_64",
     "name": "mountain_range_dusk_64",
     "id": "landscape/mountain/range_dusk_64",
     "label": "Chaîne au crépuscule (64 × 32)",
     "kind": "sprite",
     "w": 64,
     "h": 32,
     "size": 64,
     "props": {
      "shape": "range",
      "cover": "snowcap",
      "tone": "dusk",
      "material": "granite"
     },
     "tags": [
      "sunset",
      "evening",
      "range"
     ],
     "png": "library/png/landscape/mountain/range_dusk_64.png"
    },
    "volcano_snow_48": {
     "key": "volcano_snow_48",
     "name": "mountain_volcano_snow_48",
     "id": "landscape/mountain/volcano_snow_48",
     "label": "Volcan endormi enneigé (48 px)",
     "kind": "sprite",
     "w": 48,
     "h": 48,
     "size": 48,
     "props": {
      "shape": "volcano",
      "cover": "snowcap",
      "tone": "day",
      "material": "granite"
     },
     "tags": [
      "volcano",
      "snow",
      "dormant"
     ],
     "png": "library/png/landscape/mountain/volcano_snow_48.png"
    },
    "volcano_active_48": {
     "key": "volcano_active_48",
     "name": "mountain_volcano_active_48",
     "id": "landscape/mountain/volcano_active_48",
     "label": "Volcan en éruption, animé (48 px)",
     "kind": "anim",
     "w": 48,
     "h": 48,
     "size": 48,
     "props": {
      "shape": "volcano",
      "cover": "lava",
      "tone": "day",
      "material": "basalt"
     },
     "tags": [
      "volcano",
      "lava",
      "smoke",
      "eruption",
      "animated",
      "fire"
     ],
     "png": "library/png/landscape/mountain/volcano_active_48.png",
     "gif": "library/png/landscape/mountain/volcano_active_48.gif",
     "frameCount": 6,
     "loopMs": 1002
    },
    "mesa_48": {
     "key": "mesa_48",
     "name": "mountain_mesa_48",
     "id": "landscape/mountain/mesa_48",
     "label": "Mesa de grès (48 × 32)",
     "kind": "sprite",
     "w": 48,
     "h": 32,
     "size": 48,
     "props": {
      "shape": "mesa",
      "cover": "bare",
      "tone": "day",
      "material": "sandstone"
     },
     "tags": [
      "desert",
      "butte",
      "cliff"
     ],
     "png": "library/png/landscape/mountain/mesa_48.png"
    },
    "mesa_red_48": {
     "key": "mesa_red_48",
     "name": "mountain_mesa_red_48",
     "id": "landscape/mountain/mesa_red_48",
     "label": "Mesa de roche rouge (48 × 32)",
     "kind": "sprite",
     "w": 48,
     "h": 32,
     "size": 48,
     "props": {
      "shape": "mesa",
      "cover": "bare",
      "tone": "day",
      "material": "redstone"
     },
     "tags": [
      "desert",
      "butte",
      "cliff",
      "canyon"
     ],
     "png": "library/png/landscape/mountain/mesa_red_48.png"
    }
   }
  },
  "sky/cloud": {
   "id": "sky/cloud",
   "slug": "cloud",
   "category": "sky",
   "title": "Nuage",
   "description": "Nuages vus de face pour ciels de décors 2D : cumulus (16, 32 px), petit nuage, longue bande de stratus (48 × 16), nuage gris d'orage, nuage de pluie (fixe et animé), nuage de neige, nuage d'orage à éclair, et recolorations coucher de soleil et nuit. Puffs arrondis, lumière en haut à gauche, base plate ombrée.",
   "tags": [
    "cloud",
    "sky",
    "weather",
    "background",
    "scenery",
    "cumulus"
   ],
   "order": 0,
   "source": "assets/sky/cloud.px.js",
   "module": "library/js/sky/cloud.js",
   "sheet": {
    "png": "library/sheets/sky/cloud.png",
    "json": "library/sheets/sky/cloud.json"
   },
   "axes": {
    "shape": [
     "cumulus",
     "puff",
     "stratus"
    ],
    "weather": [
     "fair",
     "storm",
     "rain",
     "snow",
     "thunder"
    ],
    "time": [
     "day",
     "sunset",
     "night"
    ]
   },
   "sizes": [
    16,
    24,
    32,
    48
   ],
   "variantCount": 12,
   "variants": {
    "cumulus_32": {
     "key": "cumulus_32",
     "name": "cloud_cumulus_32",
     "id": "sky/cloud/cumulus_32",
     "label": "Cumulus",
     "kind": "sprite",
     "w": 32,
     "h": 18,
     "size": 32,
     "props": {
      "shape": "cumulus",
      "weather": "fair",
      "time": "day"
     },
     "tags": [],
     "png": "library/png/sky/cloud/cumulus_32.png"
    },
    "sunset_32": {
     "key": "sunset_32",
     "name": "cloud_sunset_32",
     "id": "sky/cloud/sunset_32",
     "label": "Cumulus au coucher du soleil",
     "kind": "sprite",
     "w": 32,
     "h": 18,
     "size": 32,
     "props": {
      "shape": "cumulus",
      "weather": "fair",
      "time": "sunset"
     },
     "tags": [
      "pink",
      "dusk"
     ],
     "png": "library/png/sky/cloud/sunset_32.png"
    },
    "night_32": {
     "key": "night_32",
     "name": "cloud_night_32",
     "id": "sky/cloud/night_32",
     "label": "Cumulus de nuit",
     "kind": "sprite",
     "w": 32,
     "h": 18,
     "size": 32,
     "props": {
      "shape": "cumulus",
      "weather": "fair",
      "time": "night"
     },
     "tags": [
      "dark"
     ],
     "png": "library/png/sky/cloud/night_32.png"
    },
    "storm_32": {
     "key": "storm_32",
     "name": "cloud_storm_32",
     "id": "sky/cloud/storm_32",
     "label": "Nuage gris d'orage",
     "kind": "sprite",
     "w": 32,
     "h": 18,
     "size": 32,
     "props": {
      "shape": "cumulus",
      "weather": "storm",
      "time": "day"
     },
     "tags": [
      "gray",
      "dark"
     ],
     "png": "library/png/sky/cloud/storm_32.png"
    },
    "cumulus_16": {
     "key": "cumulus_16",
     "name": "cloud_cumulus_16",
     "id": "sky/cloud/cumulus_16",
     "label": "Petit cumulus (16 px)",
     "kind": "sprite",
     "w": 16,
     "h": 10,
     "size": 16,
     "props": {
      "shape": "cumulus",
      "weather": "fair",
      "time": "day"
     },
     "tags": [
      "icon"
     ],
     "png": "library/png/sky/cloud/cumulus_16.png"
    },
    "puff_24": {
     "key": "puff_24",
     "name": "cloud_puff_24",
     "id": "sky/cloud/puff_24",
     "label": "Petit nuage isolé",
     "kind": "sprite",
     "w": 24,
     "h": 14,
     "size": 24,
     "props": {
      "shape": "puff",
      "weather": "fair",
      "time": "day"
     },
     "tags": [],
     "png": "library/png/sky/cloud/puff_24.png"
    },
    "stratus_48": {
     "key": "stratus_48",
     "name": "cloud_stratus_48",
     "id": "sky/cloud/stratus_48",
     "label": "Bande de stratus (48 × 16)",
     "kind": "sprite",
     "w": 48,
     "h": 15,
     "size": 48,
     "props": {
      "shape": "stratus",
      "weather": "fair",
      "time": "day"
     },
     "tags": [
      "long"
     ],
     "png": "library/png/sky/cloud/stratus_48.png"
    },
    "sunset_48": {
     "key": "sunset_48",
     "name": "cloud_sunset_48",
     "id": "sky/cloud/sunset_48",
     "label": "Stratus au coucher du soleil (48 × 16)",
     "kind": "sprite",
     "w": 48,
     "h": 15,
     "size": 48,
     "props": {
      "shape": "stratus",
      "weather": "fair",
      "time": "sunset"
     },
     "tags": [
      "pink",
      "dusk",
      "long"
     ],
     "png": "library/png/sky/cloud/sunset_48.png"
    },
    "rain_32": {
     "key": "rain_32",
     "name": "cloud_rain_32",
     "id": "sky/cloud/rain_32",
     "label": "Nuage de pluie",
     "kind": "sprite",
     "w": 32,
     "h": 30,
     "size": 32,
     "props": {
      "shape": "cumulus",
      "weather": "rain",
      "time": "day"
     },
     "tags": [
      "rain",
      "drops"
     ],
     "png": "library/png/sky/cloud/rain_32.png"
    },
    "rain_anim_32": {
     "key": "rain_anim_32",
     "name": "cloud_rain_anim_32",
     "id": "sky/cloud/rain_anim_32",
     "label": "Nuage de pluie (animé)",
     "kind": "anim",
     "w": 32,
     "h": 30,
     "size": 32,
     "props": {
      "shape": "cumulus",
      "weather": "rain",
      "time": "day"
     },
     "tags": [
      "rain",
      "animated"
     ],
     "png": "library/png/sky/cloud/rain_anim_32.png",
     "gif": "library/png/sky/cloud/rain_anim_32.gif",
     "frameCount": 5,
     "loopMs": 500
    },
    "snow_32": {
     "key": "snow_32",
     "name": "cloud_snow_32",
     "id": "sky/cloud/snow_32",
     "label": "Nuage de neige",
     "kind": "sprite",
     "w": 32,
     "h": 30,
     "size": 32,
     "props": {
      "shape": "cumulus",
      "weather": "snow",
      "time": "day"
     },
     "tags": [
      "snow",
      "winter"
     ],
     "png": "library/png/sky/cloud/snow_32.png"
    },
    "thunder_32": {
     "key": "thunder_32",
     "name": "cloud_thunder_32",
     "id": "sky/cloud/thunder_32",
     "label": "Nuage d'orage à éclair",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "shape": "cumulus",
      "weather": "thunder",
      "time": "day"
     },
     "tags": [
      "lightning",
      "storm"
     ],
     "png": "library/png/sky/cloud/thunder_32.png"
    }
   }
  },
  "sky/moon": {
   "id": "sky/moon",
   "slug": "moon",
   "category": "sky",
   "title": "Lune",
   "description": "Lunes pour ciels de nuit : croissant (16, 32 px), premier quartier, gibbeuse, pleine lune (16, 32 px) à cratères, lune rousse des moissons, lune de sang et croissant endormi avec visage. Partie éclairée à gauche (lumière en haut à gauche), partie sombre transparente, terminateur adouci d'une nuance.",
   "tags": [
    "moon",
    "sky",
    "night",
    "lunar",
    "phase",
    "crescent",
    "icon"
   ],
   "order": 0,
   "source": "assets/sky/moon.px.js",
   "module": "library/js/sky/moon.js",
   "sheet": {
    "png": "library/sheets/sky/moon.png",
    "json": "library/sheets/sky/moon.json"
   },
   "axes": {
    "phase": [
     "full",
     "gibbous",
     "quarter",
     "crescent"
    ],
    "color": [
     "silver",
     "orange",
     "red"
    ]
   },
   "sizes": [
    16,
    32
   ],
   "variantCount": 9,
   "variants": {
    "full_32": {
     "key": "full_32",
     "name": "moon_full_32",
     "id": "sky/moon/full_32",
     "label": "Pleine lune",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "phase": "full",
      "color": "silver"
     },
     "tags": [
      "craters"
     ],
     "png": "library/png/sky/moon/full_32.png"
    },
    "gibbous_32": {
     "key": "gibbous_32",
     "name": "moon_gibbous_32",
     "id": "sky/moon/gibbous_32",
     "label": "Lune gibbeuse",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "phase": "gibbous",
      "color": "silver"
     },
     "tags": [],
     "png": "library/png/sky/moon/gibbous_32.png"
    },
    "quarter_32": {
     "key": "quarter_32",
     "name": "moon_quarter_32",
     "id": "sky/moon/quarter_32",
     "label": "Quartier de lune",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "phase": "quarter",
      "color": "silver"
     },
     "tags": [],
     "png": "library/png/sky/moon/quarter_32.png"
    },
    "crescent_32": {
     "key": "crescent_32",
     "name": "moon_crescent_32",
     "id": "sky/moon/crescent_32",
     "label": "Croissant de lune",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "phase": "crescent",
      "color": "silver"
     },
     "tags": [],
     "png": "library/png/sky/moon/crescent_32.png"
    },
    "harvest_32": {
     "key": "harvest_32",
     "name": "moon_harvest_32",
     "id": "sky/moon/harvest_32",
     "label": "Lune rousse des moissons",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "phase": "full",
      "color": "orange"
     },
     "tags": [
      "autumn",
      "harvest"
     ],
     "png": "library/png/sky/moon/harvest_32.png"
    },
    "blood_32": {
     "key": "blood_32",
     "name": "moon_blood_32",
     "id": "sky/moon/blood_32",
     "label": "Lune de sang",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "phase": "full",
      "color": "red"
     },
     "tags": [
      "eclipse",
      "red",
      "horror"
     ],
     "png": "library/png/sky/moon/blood_32.png"
    },
    "sleepy_32": {
     "key": "sleepy_32",
     "name": "moon_sleepy_32",
     "id": "sky/moon/sleepy_32",
     "label": "Croissant endormi",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "phase": "crescent",
      "color": "silver"
     },
     "tags": [
      "cute",
      "face",
      "sleep"
     ],
     "png": "library/png/sky/moon/sleepy_32.png"
    },
    "full_16": {
     "key": "full_16",
     "name": "moon_full_16",
     "id": "sky/moon/full_16",
     "label": "Pleine lune (16 px)",
     "kind": "sprite",
     "w": 16,
     "h": 16,
     "size": 16,
     "props": {
      "phase": "full",
      "color": "silver"
     },
     "tags": [
      "icon"
     ],
     "png": "library/png/sky/moon/full_16.png"
    },
    "crescent_16": {
     "key": "crescent_16",
     "name": "moon_crescent_16",
     "id": "sky/moon/crescent_16",
     "label": "Croissant (16 px)",
     "kind": "sprite",
     "w": 16,
     "h": 16,
     "size": 16,
     "props": {
      "phase": "crescent",
      "color": "silver"
     },
     "tags": [
      "icon"
     ],
     "png": "library/png/sky/moon/crescent_16.png"
    }
   }
  },
  "sky/star": {
   "id": "sky/star",
   "slug": "star",
   "category": "sky",
   "title": "Étoile",
   "description": "Étoiles pour ciels de nuit, butin ou interface : étoile à cinq branches en relief (16, 32 px) dorée, argentée ou souriante, scintillement à quatre branches (16, 32 px) doré ou bleu, scintillement animé, étoile filante à traîne et petit amas d'étoiles. Facettes éclairées en haut à gauche. Pour les ciels de scène (8 px, sans contour) : point d'étoile, petite croix, scintillement animé blanc ou bleu, et étoile filante animée à traîne fondue (24 px) que le moteur de scène fait traverser le ciel.",
   "tags": [
    "star",
    "sky",
    "night",
    "sparkle",
    "twinkle",
    "icon",
    "collectible"
   ],
   "order": 0,
   "source": "assets/sky/star.px.js",
   "module": "library/js/sky/star.js",
   "sheet": {
    "png": "library/sheets/sky/star.png",
    "json": "library/sheets/sky/star.json"
   },
   "axes": {
    "shape": [
     "five",
     "sparkle",
     "shooting",
     "cluster",
     "dot",
     "plus",
     "twinkle"
    ],
    "color": [
     "gold",
     "silver",
     "blue",
     "white"
    ]
   },
   "sizes": [
    8,
    16,
    24,
    32
   ],
   "variantCount": 15,
   "variants": {
    "five_32": {
     "key": "five_32",
     "name": "star_five_32",
     "id": "sky/star/five_32",
     "label": "Étoile dorée",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "shape": "five",
      "color": "gold"
     },
     "tags": [
      "rating",
      "collectible"
     ],
     "png": "library/png/sky/star/five_32.png"
    },
    "silver_32": {
     "key": "silver_32",
     "name": "star_silver_32",
     "id": "sky/star/silver_32",
     "label": "Étoile argentée",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "shape": "five",
      "color": "silver"
     },
     "tags": [
      "rating"
     ],
     "png": "library/png/sky/star/silver_32.png"
    },
    "smile_32": {
     "key": "smile_32",
     "name": "star_smile_32",
     "id": "sky/star/smile_32",
     "label": "Étoile souriante",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "shape": "five",
      "color": "gold"
     },
     "tags": [
      "cute",
      "face"
     ],
     "png": "library/png/sky/star/smile_32.png"
    },
    "five_16": {
     "key": "five_16",
     "name": "star_five_16",
     "id": "sky/star/five_16",
     "label": "Étoile dorée (16 px)",
     "kind": "sprite",
     "w": 16,
     "h": 16,
     "size": 16,
     "props": {
      "shape": "five",
      "color": "gold"
     },
     "tags": [
      "icon",
      "rating"
     ],
     "png": "library/png/sky/star/five_16.png"
    },
    "sparkle_32": {
     "key": "sparkle_32",
     "name": "star_sparkle_32",
     "id": "sky/star/sparkle_32",
     "label": "Grand scintillement",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "shape": "sparkle",
      "color": "gold"
     },
     "tags": [
      "shine",
      "north-star"
     ],
     "png": "library/png/sky/star/sparkle_32.png"
    },
    "sparkle_16": {
     "key": "sparkle_16",
     "name": "star_sparkle_16",
     "id": "sky/star/sparkle_16",
     "label": "Scintillement (16 px)",
     "kind": "sprite",
     "w": 15,
     "h": 15,
     "size": 16,
     "props": {
      "shape": "sparkle",
      "color": "gold"
     },
     "tags": [
      "icon",
      "shine"
     ],
     "png": "library/png/sky/star/sparkle_16.png"
    },
    "sparkle_blue_16": {
     "key": "sparkle_blue_16",
     "name": "star_sparkle_blue_16",
     "id": "sky/star/sparkle_blue_16",
     "label": "Scintillement bleu (16 px)",
     "kind": "sprite",
     "w": 15,
     "h": 15,
     "size": 16,
     "props": {
      "shape": "sparkle",
      "color": "blue"
     },
     "tags": [
      "icon",
      "magic"
     ],
     "png": "library/png/sky/star/sparkle_blue_16.png"
    },
    "twinkle_16": {
     "key": "twinkle_16",
     "name": "star_twinkle_16",
     "id": "sky/star/twinkle_16",
     "label": "Scintillement animé (16 px)",
     "kind": "anim",
     "w": 15,
     "h": 15,
     "size": 16,
     "props": {
      "shape": "sparkle",
      "color": "gold"
     },
     "tags": [
      "animated",
      "shine"
     ],
     "png": "library/png/sky/star/twinkle_16.png",
     "gif": "library/png/sky/star/twinkle_16.gif",
     "frameCount": 4,
     "loopMs": 800
    },
    "shooting_32": {
     "key": "shooting_32",
     "name": "star_shooting_32",
     "id": "sky/star/shooting_32",
     "label": "Étoile filante",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "shape": "shooting",
      "color": "gold"
     },
     "tags": [
      "comet",
      "wish",
      "trail"
     ],
     "png": "library/png/sky/star/shooting_32.png"
    },
    "cluster_32": {
     "key": "cluster_32",
     "name": "star_cluster_32",
     "id": "sky/star/cluster_32",
     "label": "Amas d'étoiles",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "shape": "cluster",
      "color": "white"
     },
     "tags": [
      "night",
      "background",
      "starfield"
     ],
     "png": "library/png/sky/star/cluster_32.png"
    },
    "tiny_dot_8": {
     "key": "tiny_dot_8",
     "name": "star_tiny_dot_8",
     "id": "sky/star/tiny_dot_8",
     "label": "Point d'étoile (ciel de scène)",
     "kind": "sprite",
     "w": 1,
     "h": 1,
     "size": 8,
     "props": {
      "shape": "dot",
      "color": "white"
     },
     "tags": [
      "starfield",
      "particle"
     ],
     "png": "library/png/sky/star/tiny_dot_8.png"
    },
    "tiny_plus_8": {
     "key": "tiny_plus_8",
     "name": "star_tiny_plus_8",
     "id": "sky/star/tiny_plus_8",
     "label": "Petite croix (ciel de scène)",
     "kind": "sprite",
     "w": 3,
     "h": 3,
     "size": 8,
     "props": {
      "shape": "plus",
      "color": "white"
     },
     "tags": [
      "starfield",
      "particle"
     ],
     "png": "library/png/sky/star/tiny_plus_8.png"
    },
    "tiny_twinkle_8": {
     "key": "tiny_twinkle_8",
     "name": "star_tiny_twinkle_8",
     "id": "sky/star/tiny_twinkle_8",
     "label": "Petite étoile qui scintille (scène)",
     "kind": "anim",
     "w": 5,
     "h": 5,
     "size": 8,
     "props": {
      "shape": "twinkle",
      "color": "white"
     },
     "tags": [
      "starfield",
      "particle",
      "animated"
     ],
     "png": "library/png/sky/star/tiny_twinkle_8.png",
     "gif": "library/png/sky/star/tiny_twinkle_8.gif",
     "frameCount": 6,
     "loopMs": 1000
    },
    "tiny_twinkle_blue_8": {
     "key": "tiny_twinkle_blue_8",
     "name": "star_tiny_twinkle_blue_8",
     "id": "sky/star/tiny_twinkle_blue_8",
     "label": "Petite étoile bleue qui scintille (scène)",
     "kind": "anim",
     "w": 5,
     "h": 5,
     "size": 8,
     "props": {
      "shape": "twinkle",
      "color": "blue"
     },
     "tags": [
      "starfield",
      "particle",
      "animated"
     ],
     "png": "library/png/sky/star/tiny_twinkle_blue_8.png",
     "gif": "library/png/sky/star/tiny_twinkle_blue_8.gif",
     "frameCount": 6,
     "loopMs": 1000
    },
    "streak_24": {
     "key": "streak_24",
     "name": "star_streak_24",
     "id": "sky/star/streak_24",
     "label": "Étoile filante de scène (animée)",
     "kind": "anim",
     "w": 22,
     "h": 10,
     "size": 24,
     "props": {
      "shape": "shooting",
      "color": "white"
     },
     "tags": [
      "meteor",
      "wish",
      "trail",
      "animated",
      "night"
     ],
     "png": "library/png/sky/star/streak_24.png",
     "gif": "library/png/sky/star/streak_24.gif",
     "frameCount": 6,
     "loopMs": 600
    }
   }
  },
  "sky/sun": {
   "id": "sky/sun",
   "slug": "sun",
   "category": "sky",
   "title": "Soleil",
   "description": "Soleils pour ciels et icônes météo : soleil à rayons (16, 32 px), soleil souriant, rayons qui tournent (animé), soleil pâle d'hiver, soleil couchant sur l'horizon, éclipse avec couronne et soleil derrière un nuage. Disque ombré en croissant (lumière en haut à gauche), rayons triangulaires alternés longs/courts.",
   "tags": [
    "sun",
    "sky",
    "weather",
    "sunny",
    "day",
    "light",
    "icon"
   ],
   "order": 0,
   "source": "assets/sky/sun.px.js",
   "module": "library/js/sky/sun.js",
   "sheet": {
    "png": "library/sheets/sky/sun.png",
    "json": "library/sheets/sky/sun.json"
   },
   "axes": {
    "style": [
     "rays",
     "disc",
     "corona"
    ],
    "mood": [
     "plain",
     "smile"
    ],
    "time": [
     "day",
     "winter",
     "sunset",
     "eclipse"
    ]
   },
   "sizes": [
    16,
    32
   ],
   "variantCount": 8,
   "variants": {
    "rays_32": {
     "key": "rays_32",
     "name": "sun_rays_32",
     "id": "sky/sun/rays_32",
     "label": "Soleil à rayons",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "style": "rays",
      "mood": "plain",
      "time": "day"
     },
     "tags": [],
     "png": "library/png/sky/sun/rays_32.png"
    },
    "pale_32": {
     "key": "pale_32",
     "name": "sun_pale_32",
     "id": "sky/sun/pale_32",
     "label": "Soleil pâle d'hiver",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "style": "rays",
      "mood": "plain",
      "time": "winter"
     },
     "tags": [
      "winter",
      "cold"
     ],
     "png": "library/png/sky/sun/pale_32.png"
    },
    "smile_32": {
     "key": "smile_32",
     "name": "sun_smile_32",
     "id": "sky/sun/smile_32",
     "label": "Soleil souriant",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "style": "rays",
      "mood": "smile",
      "time": "day"
     },
     "tags": [
      "cute",
      "face"
     ],
     "png": "library/png/sky/sun/smile_32.png"
    },
    "spin_32": {
     "key": "spin_32",
     "name": "sun_spin_32",
     "id": "sky/sun/spin_32",
     "label": "Soleil rayonnant (animé)",
     "kind": "anim",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "style": "rays",
      "mood": "plain",
      "time": "day"
     },
     "tags": [
      "animated"
     ],
     "png": "library/png/sky/sun/spin_32.png",
     "gif": "library/png/sky/sun/spin_32.gif",
     "frameCount": 4,
     "loopMs": 500
    },
    "rays_16": {
     "key": "rays_16",
     "name": "sun_rays_16",
     "id": "sky/sun/rays_16",
     "label": "Soleil à rayons (16 px)",
     "kind": "sprite",
     "w": 16,
     "h": 16,
     "size": 16,
     "props": {
      "style": "rays",
      "mood": "plain",
      "time": "day"
     },
     "tags": [
      "icon"
     ],
     "png": "library/png/sky/sun/rays_16.png"
    },
    "setting_32": {
     "key": "setting_32",
     "name": "sun_setting_32",
     "id": "sky/sun/setting_32",
     "label": "Soleil couchant sur l'horizon",
     "kind": "sprite",
     "w": 32,
     "h": 22,
     "size": 32,
     "props": {
      "style": "disc",
      "mood": "plain",
      "time": "sunset"
     },
     "tags": [
      "sunset",
      "dusk",
      "horizon"
     ],
     "png": "library/png/sky/sun/setting_32.png"
    },
    "eclipse_32": {
     "key": "eclipse_32",
     "name": "sun_eclipse_32",
     "id": "sky/sun/eclipse_32",
     "label": "Éclipse solaire",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "style": "corona",
      "mood": "plain",
      "time": "eclipse"
     },
     "tags": [
      "eclipse",
      "dark"
     ],
     "png": "library/png/sky/sun/eclipse_32.png"
    },
    "cloudy_32": {
     "key": "cloudy_32",
     "name": "sun_cloudy_32",
     "id": "sky/sun/cloudy_32",
     "label": "Soleil derrière un nuage",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "style": "rays",
      "mood": "plain",
      "time": "day"
     },
     "tags": [
      "cloud",
      "weather",
      "partly-cloudy"
     ],
     "png": "library/png/sky/sun/cloudy_32.png"
    }
   }
  },
  "fauna/bird": {
   "id": "fauna/bird",
   "slug": "bird",
   "category": "fauna",
   "title": "Oiseau",
   "description": "Oiseaux en vol pour animer les ciels : silhouette lointaine sombre ou claire (8 px), vol de cinq oiseaux en V (32 px), et oiseaux proches vus de profil (16 px) : hirondelle, corbeau, mouette. Battements d'ailes animés en 4 images de 100 ms ; le moteur de scène les fait traverser le ciel. Silhouettes lointaines sans contour, oiseaux proches au contour sombre.",
   "tags": [
    "bird",
    "flying",
    "sky",
    "wings",
    "flock",
    "ambient",
    "animated",
    "fauna"
   ],
   "order": 0,
   "source": "assets/fauna/bird.px.js",
   "module": "library/js/fauna/bird.js",
   "sheet": {
    "png": "library/sheets/fauna/bird.png",
    "json": "library/sheets/fauna/bird.json"
   },
   "axes": {
    "species": [
     "silhouette",
     "swallow",
     "crow",
     "gull"
    ],
    "distance": [
     "far",
     "near"
    ],
    "group": [
     "single",
     "flock"
    ]
   },
   "sizes": [
    8,
    16,
    32
   ],
   "variantCount": 6,
   "variants": {
    "far_8": {
     "key": "far_8",
     "name": "bird_far_8",
     "id": "fauna/bird/far_8",
     "label": "Silhouette lointaine sombre",
     "kind": "anim",
     "w": 7,
     "h": 4,
     "size": 8,
     "props": {
      "species": "silhouette",
      "distance": "far",
      "group": "single"
     },
     "tags": [
      "particle"
     ],
     "png": "library/png/fauna/bird/far_8.png",
     "gif": "library/png/fauna/bird/far_8.gif",
     "frameCount": 4,
     "loopMs": 400
    },
    "far_light_8": {
     "key": "far_light_8",
     "name": "bird_far_light_8",
     "id": "fauna/bird/far_light_8",
     "label": "Silhouette lointaine claire",
     "kind": "anim",
     "w": 7,
     "h": 4,
     "size": 8,
     "props": {
      "species": "silhouette",
      "distance": "far",
      "group": "single"
     },
     "tags": [
      "particle",
      "gull"
     ],
     "png": "library/png/fauna/bird/far_light_8.png",
     "gif": "library/png/fauna/bird/far_light_8.gif",
     "frameCount": 4,
     "loopMs": 400
    },
    "flock_32": {
     "key": "flock_32",
     "name": "bird_flock_32",
     "id": "fauna/bird/flock_32",
     "label": "Vol en V (5 oiseaux)",
     "kind": "anim",
     "w": 32,
     "h": 16,
     "size": 32,
     "props": {
      "species": "silhouette",
      "distance": "far",
      "group": "flock"
     },
     "tags": [
      "migration"
     ],
     "png": "library/png/fauna/bird/flock_32.png",
     "gif": "library/png/fauna/bird/flock_32.gif",
     "frameCount": 4,
     "loopMs": 400
    },
    "swallow_16": {
     "key": "swallow_16",
     "name": "bird_swallow_16",
     "id": "fauna/bird/swallow_16",
     "label": "Hirondelle",
     "kind": "anim",
     "w": 16,
     "h": 16,
     "size": 16,
     "props": {
      "species": "swallow",
      "distance": "near",
      "group": "single"
     },
     "tags": [
      "spring",
      "summer"
     ],
     "png": "library/png/fauna/bird/swallow_16.png",
     "gif": "library/png/fauna/bird/swallow_16.gif",
     "frameCount": 4,
     "loopMs": 400
    },
    "crow_16": {
     "key": "crow_16",
     "name": "bird_crow_16",
     "id": "fauna/bird/crow_16",
     "label": "Corbeau",
     "kind": "anim",
     "w": 16,
     "h": 16,
     "size": 16,
     "props": {
      "species": "crow",
      "distance": "near",
      "group": "single"
     },
     "tags": [
      "dark",
      "spooky"
     ],
     "png": "library/png/fauna/bird/crow_16.png",
     "gif": "library/png/fauna/bird/crow_16.gif",
     "frameCount": 4,
     "loopMs": 400
    },
    "gull_16": {
     "key": "gull_16",
     "name": "bird_gull_16",
     "id": "fauna/bird/gull_16",
     "label": "Mouette",
     "kind": "anim",
     "w": 16,
     "h": 16,
     "size": 16,
     "props": {
      "species": "gull",
      "distance": "near",
      "group": "single"
     },
     "tags": [
      "sea",
      "coast"
     ],
     "png": "library/png/fauna/bird/gull_16.png",
     "gif": "library/png/fauna/bird/gull_16.gif",
     "frameCount": 4,
     "loopMs": 400
    }
   }
  },
  "fauna/butterfly": {
   "id": "fauna/butterfly",
   "slug": "butterfly",
   "category": "fauna",
   "title": "Papillon",
   "description": "Papillons qui battent des ailes, pour prairies et jardins : petits papillons vus de face à l'échelle d'une scène (8 px) – piéride blanche, citron jaune, azuré bleu, monarque orange – et grands papillons vus de dessus (16 px), monarque et azuré, ailes ouvertes puis repliées. Animés en 4 images de 100 ms. Lumière en haut à gauche, contour sombre.",
   "tags": [
    "butterfly",
    "insect",
    "wings",
    "meadow",
    "garden",
    "summer",
    "spring",
    "ambient",
    "animated",
    "fauna"
   ],
   "order": 0,
   "source": "assets/fauna/butterfly.px.js",
   "module": "library/js/fauna/butterfly.js",
   "sheet": {
    "png": "library/sheets/fauna/butterfly.png",
    "json": "library/sheets/fauna/butterfly.json"
   },
   "axes": {
    "species": [
     "cabbage-white",
     "brimstone",
     "common-blue",
     "monarch"
    ],
    "color": [
     "white",
     "yellow",
     "blue",
     "orange"
    ],
    "view": [
     "front",
     "top"
    ]
   },
   "sizes": [
    8,
    16
   ],
   "variantCount": 6,
   "variants": {
    "white_8": {
     "key": "white_8",
     "name": "butterfly_white_8",
     "id": "fauna/butterfly/white_8",
     "label": "Piéride blanche (scène)",
     "kind": "anim",
     "w": 7,
     "h": 5,
     "size": 8,
     "props": {
      "species": "cabbage-white",
      "color": "white",
      "view": "front"
     },
     "tags": [],
     "png": "library/png/fauna/butterfly/white_8.png",
     "gif": "library/png/fauna/butterfly/white_8.gif",
     "frameCount": 4,
     "loopMs": 400
    },
    "yellow_8": {
     "key": "yellow_8",
     "name": "butterfly_yellow_8",
     "id": "fauna/butterfly/yellow_8",
     "label": "Citron jaune (scène)",
     "kind": "anim",
     "w": 7,
     "h": 5,
     "size": 8,
     "props": {
      "species": "brimstone",
      "color": "yellow",
      "view": "front"
     },
     "tags": [],
     "png": "library/png/fauna/butterfly/yellow_8.png",
     "gif": "library/png/fauna/butterfly/yellow_8.gif",
     "frameCount": 4,
     "loopMs": 400
    },
    "blue_8": {
     "key": "blue_8",
     "name": "butterfly_blue_8",
     "id": "fauna/butterfly/blue_8",
     "label": "Azuré bleu (scène)",
     "kind": "anim",
     "w": 7,
     "h": 5,
     "size": 8,
     "props": {
      "species": "common-blue",
      "color": "blue",
      "view": "front"
     },
     "tags": [],
     "png": "library/png/fauna/butterfly/blue_8.png",
     "gif": "library/png/fauna/butterfly/blue_8.gif",
     "frameCount": 4,
     "loopMs": 400
    },
    "monarch_8": {
     "key": "monarch_8",
     "name": "butterfly_monarch_8",
     "id": "fauna/butterfly/monarch_8",
     "label": "Monarque (scène)",
     "kind": "anim",
     "w": 7,
     "h": 5,
     "size": 8,
     "props": {
      "species": "monarch",
      "color": "orange",
      "view": "front"
     },
     "tags": [],
     "png": "library/png/fauna/butterfly/monarch_8.png",
     "gif": "library/png/fauna/butterfly/monarch_8.gif",
     "frameCount": 4,
     "loopMs": 400
    },
    "monarch_16": {
     "key": "monarch_16",
     "name": "butterfly_monarch_16",
     "id": "fauna/butterfly/monarch_16",
     "label": "Monarque vu de dessus (16 px)",
     "kind": "anim",
     "w": 16,
     "h": 16,
     "size": 16,
     "props": {
      "species": "monarch",
      "color": "orange",
      "view": "top"
     },
     "tags": [
      "icon"
     ],
     "png": "library/png/fauna/butterfly/monarch_16.png",
     "gif": "library/png/fauna/butterfly/monarch_16.gif",
     "frameCount": 4,
     "loopMs": 400
    },
    "blue_16": {
     "key": "blue_16",
     "name": "butterfly_blue_16",
     "id": "fauna/butterfly/blue_16",
     "label": "Azuré vu de dessus (16 px)",
     "kind": "anim",
     "w": 16,
     "h": 16,
     "size": 16,
     "props": {
      "species": "common-blue",
      "color": "blue",
      "view": "top"
     },
     "tags": [
      "icon"
     ],
     "png": "library/png/fauna/butterfly/blue_16.png",
     "gif": "library/png/fauna/butterfly/blue_16.gif",
     "frameCount": 4,
     "loopMs": 400
    }
   }
  },
  "fauna/firefly": {
   "id": "fauna/firefly",
   "slug": "firefly",
   "category": "fauna",
   "title": "Luciole",
   "description": "Lucioles pour les nuits d'été : petite lueur clignotante à l'échelle d'une scène (8 px) en jaune-vert, ambre ou bleu féerique, essaim de cinq lueurs désynchronisées (16 px), et luciole en vol vue de profil (16 px) dont l'abdomen s'allume, en jaune-vert ou bleu. Toutes animées. Les lueurs n'ont pas de contour (ce sont des lumières) ; l'insecte a le contour sombre de la maison.",
   "tags": [
    "firefly",
    "insect",
    "bug",
    "glow",
    "night",
    "light",
    "summer",
    "ambient",
    "animated",
    "fauna"
   ],
   "order": 0,
   "source": "assets/fauna/firefly.px.js",
   "module": "library/js/fauna/firefly.js",
   "sheet": {
    "png": "library/sheets/fauna/firefly.png",
    "json": "library/sheets/fauna/firefly.json"
   },
   "axes": {
    "form": [
     "glow",
     "swarm",
     "insect"
    ],
    "color": [
     "yellow",
     "amber",
     "blue"
    ]
   },
   "sizes": [
    8,
    16
   ],
   "variantCount": 6,
   "variants": {
    "glow_8": {
     "key": "glow_8",
     "name": "firefly_glow_8",
     "id": "fauna/firefly/glow_8",
     "label": "Lueur jaune-vert (scène)",
     "kind": "anim",
     "w": 5,
     "h": 5,
     "size": 8,
     "props": {
      "form": "glow",
      "color": "yellow"
     },
     "tags": [
      "particle"
     ],
     "png": "library/png/fauna/firefly/glow_8.png",
     "gif": "library/png/fauna/firefly/glow_8.gif",
     "frameCount": 6,
     "loopMs": 1200
    },
    "glow_amber_8": {
     "key": "glow_amber_8",
     "name": "firefly_glow_amber_8",
     "id": "fauna/firefly/glow_amber_8",
     "label": "Lueur ambre (scène)",
     "kind": "anim",
     "w": 5,
     "h": 5,
     "size": 8,
     "props": {
      "form": "glow",
      "color": "amber"
     },
     "tags": [
      "particle",
      "warm"
     ],
     "png": "library/png/fauna/firefly/glow_amber_8.png",
     "gif": "library/png/fauna/firefly/glow_amber_8.gif",
     "frameCount": 6,
     "loopMs": 1200
    },
    "glow_blue_8": {
     "key": "glow_blue_8",
     "name": "firefly_glow_blue_8",
     "id": "fauna/firefly/glow_blue_8",
     "label": "Lueur bleue féerique (scène)",
     "kind": "anim",
     "w": 5,
     "h": 5,
     "size": 8,
     "props": {
      "form": "glow",
      "color": "blue"
     },
     "tags": [
      "particle",
      "magic",
      "fantasy"
     ],
     "png": "library/png/fauna/firefly/glow_blue_8.png",
     "gif": "library/png/fauna/firefly/glow_blue_8.gif",
     "frameCount": 6,
     "loopMs": 1200
    },
    "swarm_16": {
     "key": "swarm_16",
     "name": "firefly_swarm_16",
     "id": "fauna/firefly/swarm_16",
     "label": "Essaim de lucioles",
     "kind": "anim",
     "w": 16,
     "h": 16,
     "size": 16,
     "props": {
      "form": "swarm",
      "color": "yellow"
     },
     "tags": [
      "group"
     ],
     "png": "library/png/fauna/firefly/swarm_16.png",
     "gif": "library/png/fauna/firefly/swarm_16.gif",
     "frameCount": 12,
     "loopMs": 1200
    },
    "bug_16": {
     "key": "bug_16",
     "name": "firefly_bug_16",
     "id": "fauna/firefly/bug_16",
     "label": "Luciole en vol (16 px)",
     "kind": "anim",
     "w": 16,
     "h": 16,
     "size": 16,
     "props": {
      "form": "insect",
      "color": "yellow"
     },
     "tags": [
      "icon"
     ],
     "png": "library/png/fauna/firefly/bug_16.png",
     "gif": "library/png/fauna/firefly/bug_16.gif",
     "frameCount": 8,
     "loopMs": 800
    },
    "bug_blue_16": {
     "key": "bug_blue_16",
     "name": "firefly_bug_blue_16",
     "id": "fauna/firefly/bug_blue_16",
     "label": "Luciole bleue en vol (16 px)",
     "kind": "anim",
     "w": 16,
     "h": 16,
     "size": 16,
     "props": {
      "form": "insect",
      "color": "blue"
     },
     "tags": [
      "icon",
      "magic"
     ],
     "png": "library/png/fauna/firefly/bug_blue_16.png",
     "gif": "library/png/fauna/firefly/bug_blue_16.gif",
     "frameCount": 8,
     "loopMs": 800
    }
   }
  },
  "fauna/scorpion": {
   "id": "fauna/scorpion",
   "slug": "scorpion",
   "category": "fauna",
   "title": "Scorpion",
   "description": "Scorpions du désert vus de profil (tête à droite), queue recourbée au-dessus du dos : petit scorpion (16 px) jaune des sables, noir ou rouge, petit scorpion qui marche (animé, 4 images de 100 ms), grand scorpion détaillé (32 px) jaune ou noir, et grand scorpion qui marche en agitant son dard. Lumière en haut à gauche, contour sombre.",
   "tags": [
    "scorpion",
    "desert",
    "arachnid",
    "critter",
    "enemy",
    "venom",
    "sand",
    "fauna"
   ],
   "order": 0,
   "source": "assets/fauna/scorpion.px.js",
   "module": "library/js/fauna/scorpion.js",
   "sheet": {
    "png": "library/sheets/fauna/scorpion.png",
    "json": "library/sheets/fauna/scorpion.json"
   },
   "axes": {
    "color": [
     "sand",
     "black",
     "red"
    ],
    "state": [
     "idle",
     "walk"
    ]
   },
   "sizes": [
    16,
    32
   ],
   "variantCount": 7,
   "variants": {
    "sand_16": {
     "key": "sand_16",
     "name": "scorpion_sand_16",
     "id": "fauna/scorpion/sand_16",
     "label": "Scorpion des sables (16 px)",
     "kind": "sprite",
     "w": 16,
     "h": 12,
     "size": 16,
     "props": {
      "color": "sand",
      "state": "idle"
     },
     "tags": [],
     "png": "library/png/fauna/scorpion/sand_16.png"
    },
    "black_16": {
     "key": "black_16",
     "name": "scorpion_black_16",
     "id": "fauna/scorpion/black_16",
     "label": "Scorpion noir (16 px)",
     "kind": "sprite",
     "w": 16,
     "h": 12,
     "size": 16,
     "props": {
      "color": "black",
      "state": "idle"
     },
     "tags": [],
     "png": "library/png/fauna/scorpion/black_16.png"
    },
    "red_16": {
     "key": "red_16",
     "name": "scorpion_red_16",
     "id": "fauna/scorpion/red_16",
     "label": "Scorpion rouge (16 px)",
     "kind": "sprite",
     "w": 16,
     "h": 12,
     "size": 16,
     "props": {
      "color": "red",
      "state": "idle"
     },
     "tags": [],
     "png": "library/png/fauna/scorpion/red_16.png"
    },
    "sand_walk_16": {
     "key": "sand_walk_16",
     "name": "scorpion_sand_walk_16",
     "id": "fauna/scorpion/sand_walk_16",
     "label": "Scorpion des sables qui marche (16 px, animé)",
     "kind": "anim",
     "w": 16,
     "h": 12,
     "size": 16,
     "props": {
      "color": "sand",
      "state": "walk"
     },
     "tags": [
      "animated"
     ],
     "png": "library/png/fauna/scorpion/sand_walk_16.png",
     "gif": "library/png/fauna/scorpion/sand_walk_16.gif",
     "frameCount": 4,
     "loopMs": 400
    },
    "sand_32": {
     "key": "sand_32",
     "name": "scorpion_sand_32",
     "id": "fauna/scorpion/sand_32",
     "label": "Grand scorpion des sables",
     "kind": "sprite",
     "w": 32,
     "h": 30,
     "size": 32,
     "props": {
      "color": "sand",
      "state": "idle"
     },
     "tags": [],
     "png": "library/png/fauna/scorpion/sand_32.png"
    },
    "black_32": {
     "key": "black_32",
     "name": "scorpion_black_32",
     "id": "fauna/scorpion/black_32",
     "label": "Grand scorpion noir",
     "kind": "sprite",
     "w": 32,
     "h": 30,
     "size": 32,
     "props": {
      "color": "black",
      "state": "idle"
     },
     "tags": [],
     "png": "library/png/fauna/scorpion/black_32.png"
    },
    "sand_walk_32": {
     "key": "sand_walk_32",
     "name": "scorpion_sand_walk_32",
     "id": "fauna/scorpion/sand_walk_32",
     "label": "Grand scorpion qui marche (animé)",
     "kind": "anim",
     "w": 32,
     "h": 30,
     "size": 32,
     "props": {
      "color": "sand",
      "state": "walk"
     },
     "tags": [
      "animated"
     ],
     "png": "library/png/fauna/scorpion/sand_walk_32.png",
     "gif": "library/png/fauna/scorpion/sand_walk_32.gif",
     "frameCount": 4,
     "loopMs": 400
    }
   }
  },
  "items/potion": {
   "id": "items/potion",
   "slug": "potion",
   "category": "items",
   "title": "Potion",
   "description": "Fioles de potion pour inventaire ou butin : petite fiole ronde, bouteille haute et grand flacon à bulles, en plusieurs couleurs de liquide (soin, mana, poison, magie, énergie).",
   "tags": [
    "potion",
    "item",
    "loot",
    "consumable",
    "rpg",
    "inventory",
    "icon"
   ],
   "order": 0,
   "source": "assets/items/potion.px.js",
   "module": "library/js/items/potion.js",
   "sheet": {
    "png": "library/sheets/items/potion.png",
    "json": "library/sheets/items/potion.json"
   },
   "axes": {
    "liquid": [
     "red",
     "blue",
     "green",
     "purple",
     "yellow",
     "none"
    ],
    "effect": [
     "health",
     "mana",
     "poison",
     "magic",
     "stamina",
     "none"
    ],
    "shape": [
     "round",
     "bottle",
     "flask"
    ]
   },
   "sizes": [
    16,
    24,
    32
   ],
   "variantCount": 12,
   "variants": {
    "red_small": {
     "key": "red_small",
     "name": "potion_red_small",
     "id": "items/potion/red_small",
     "label": "Petite potion rouge (soin)",
     "kind": "sprite",
     "w": 15,
     "h": 16,
     "size": 16,
     "props": {
      "liquid": "red",
      "effect": "health",
      "shape": "round"
     },
     "tags": [],
     "png": "library/png/items/potion/red_small.png"
    },
    "blue_small": {
     "key": "blue_small",
     "name": "potion_blue_small",
     "id": "items/potion/blue_small",
     "label": "Petite potion bleue (mana)",
     "kind": "sprite",
     "w": 15,
     "h": 16,
     "size": 16,
     "props": {
      "liquid": "blue",
      "effect": "mana",
      "shape": "round"
     },
     "tags": [],
     "png": "library/png/items/potion/blue_small.png"
    },
    "green_small": {
     "key": "green_small",
     "name": "potion_green_small",
     "id": "items/potion/green_small",
     "label": "Petite potion verte (poison)",
     "kind": "sprite",
     "w": 15,
     "h": 16,
     "size": 16,
     "props": {
      "liquid": "green",
      "effect": "poison",
      "shape": "round"
     },
     "tags": [],
     "png": "library/png/items/potion/green_small.png"
    },
    "purple_small": {
     "key": "purple_small",
     "name": "potion_purple_small",
     "id": "items/potion/purple_small",
     "label": "Petite potion violette (magie)",
     "kind": "sprite",
     "w": 15,
     "h": 16,
     "size": 16,
     "props": {
      "liquid": "purple",
      "effect": "magic",
      "shape": "round"
     },
     "tags": [],
     "png": "library/png/items/potion/purple_small.png"
    },
    "yellow_small": {
     "key": "yellow_small",
     "name": "potion_yellow_small",
     "id": "items/potion/yellow_small",
     "label": "Petite potion jaune (énergie)",
     "kind": "sprite",
     "w": 15,
     "h": 16,
     "size": 16,
     "props": {
      "liquid": "yellow",
      "effect": "stamina",
      "shape": "round"
     },
     "tags": [],
     "png": "library/png/items/potion/yellow_small.png"
    },
    "red_bottle": {
     "key": "red_bottle",
     "name": "potion_red_bottle",
     "id": "items/potion/red_bottle",
     "label": "Bouteille rouge",
     "kind": "sprite",
     "w": 12,
     "h": 24,
     "size": 24,
     "props": {
      "liquid": "red",
      "effect": "health",
      "shape": "bottle"
     },
     "tags": [],
     "png": "library/png/items/potion/red_bottle.png"
    },
    "blue_bottle": {
     "key": "blue_bottle",
     "name": "potion_blue_bottle",
     "id": "items/potion/blue_bottle",
     "label": "Bouteille bleue",
     "kind": "sprite",
     "w": 12,
     "h": 24,
     "size": 24,
     "props": {
      "liquid": "blue",
      "effect": "mana",
      "shape": "bottle"
     },
     "tags": [],
     "png": "library/png/items/potion/blue_bottle.png"
    },
    "green_bottle": {
     "key": "green_bottle",
     "name": "potion_green_bottle",
     "id": "items/potion/green_bottle",
     "label": "Bouteille verte",
     "kind": "sprite",
     "w": 12,
     "h": 24,
     "size": 24,
     "props": {
      "liquid": "green",
      "effect": "poison",
      "shape": "bottle"
     },
     "tags": [],
     "png": "library/png/items/potion/green_bottle.png"
    },
    "red_large": {
     "key": "red_large",
     "name": "potion_red_large",
     "id": "items/potion/red_large",
     "label": "Grand flacon rouge à bulles",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "liquid": "red",
      "effect": "health",
      "shape": "flask"
     },
     "tags": [],
     "png": "library/png/items/potion/red_large.png"
    },
    "blue_large": {
     "key": "blue_large",
     "name": "potion_blue_large",
     "id": "items/potion/blue_large",
     "label": "Grand flacon bleu à bulles",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "liquid": "blue",
      "effect": "mana",
      "shape": "flask"
     },
     "tags": [],
     "png": "library/png/items/potion/blue_large.png"
    },
    "purple_large": {
     "key": "purple_large",
     "name": "potion_purple_large",
     "id": "items/potion/purple_large",
     "label": "Grand flacon violet à bulles",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "liquid": "purple",
      "effect": "magic",
      "shape": "flask"
     },
     "tags": [],
     "png": "library/png/items/potion/purple_large.png"
    },
    "empty_large": {
     "key": "empty_large",
     "name": "potion_empty_large",
     "id": "items/potion/empty_large",
     "label": "Grand flacon vide",
     "kind": "sprite",
     "w": 32,
     "h": 32,
     "size": 32,
     "props": {
      "liquid": "none",
      "effect": "none",
      "shape": "flask"
     },
     "tags": [],
     "png": "library/png/items/potion/empty_large.png"
    }
   }
  },
  "characters/slime": {
   "id": "characters/slime",
   "slug": "slime",
   "category": "characters",
   "title": "Slime",
   "description": "Petit monstre gélatineux animé (respiration en 4 images de 200 ms : écrasement / étirement), en plusieurs couleurs, plus une version immobile et un roi slime couronné.",
   "tags": [
    "slime",
    "monster",
    "enemy",
    "character",
    "rpg",
    "animated",
    "cute"
   ],
   "order": 0,
   "source": "assets/characters/slime.px.js",
   "module": "library/js/characters/slime.js",
   "sheet": {
    "png": "library/sheets/characters/slime.png",
    "json": "library/sheets/characters/slime.json"
   },
   "axes": {
    "color": [
     "green",
     "blue",
     "red",
     "purple"
    ],
    "state": [
     "idle",
     "hurt"
    ]
   },
   "sizes": [
    16,
    32
   ],
   "variantCount": 6,
   "variants": {
    "green_idle": {
     "key": "green_idle",
     "name": "slime_green_idle",
     "id": "characters/slime/green_idle",
     "label": "Slime vert – animation repos",
     "kind": "anim",
     "w": 15,
     "h": 15,
     "size": 16,
     "props": {
      "color": "green",
      "state": "idle"
     },
     "tags": [],
     "png": "library/png/characters/slime/green_idle.png",
     "gif": "library/png/characters/slime/green_idle.gif",
     "frameCount": 4,
     "loopMs": 800
    },
    "blue_idle": {
     "key": "blue_idle",
     "name": "slime_blue_idle",
     "id": "characters/slime/blue_idle",
     "label": "Slime bleu – animation repos",
     "kind": "anim",
     "w": 15,
     "h": 15,
     "size": 16,
     "props": {
      "color": "blue",
      "state": "idle"
     },
     "tags": [],
     "png": "library/png/characters/slime/blue_idle.png",
     "gif": "library/png/characters/slime/blue_idle.gif",
     "frameCount": 4,
     "loopMs": 800
    },
    "red_idle": {
     "key": "red_idle",
     "name": "slime_red_idle",
     "id": "characters/slime/red_idle",
     "label": "Slime rouge – animation repos",
     "kind": "anim",
     "w": 15,
     "h": 15,
     "size": 16,
     "props": {
      "color": "red",
      "state": "idle"
     },
     "tags": [],
     "png": "library/png/characters/slime/red_idle.png",
     "gif": "library/png/characters/slime/red_idle.gif",
     "frameCount": 4,
     "loopMs": 800
    },
    "purple_idle": {
     "key": "purple_idle",
     "name": "slime_purple_idle",
     "id": "characters/slime/purple_idle",
     "label": "Slime violet – animation repos",
     "kind": "anim",
     "w": 15,
     "h": 15,
     "size": 16,
     "props": {
      "color": "purple",
      "state": "idle"
     },
     "tags": [],
     "png": "library/png/characters/slime/purple_idle.png",
     "gif": "library/png/characters/slime/purple_idle.gif",
     "frameCount": 4,
     "loopMs": 800
    },
    "green_hurt": {
     "key": "green_hurt",
     "name": "slime_green_hurt",
     "id": "characters/slime/green_hurt",
     "label": "Slime vert – touché",
     "kind": "sprite",
     "w": 15,
     "h": 15,
     "size": 16,
     "props": {
      "color": "green",
      "state": "hurt"
     },
     "tags": [],
     "png": "library/png/characters/slime/green_hurt.png"
    },
    "king_32": {
     "key": "king_32",
     "name": "slime_king_32",
     "id": "characters/slime/king_32",
     "label": "Roi slime couronné (32 px)",
     "kind": "sprite",
     "w": 29,
     "h": 26,
     "size": 32,
     "props": {
      "color": "green",
      "state": "idle"
     },
     "tags": [
      "boss"
     ],
     "png": "library/png/characters/slime/king_32.png"
    }
   }
  }
 }
};

const loaders = {
  "scenes/summer_plain": () => import("./js/scenes/summer_plain.js"),
  "nature/bones": () => import("./js/nature/bones.js"),
  "nature/bush": () => import("./js/nature/bush.js"),
  "nature/cactus": () => import("./js/nature/cactus.js"),
  "nature/fern": () => import("./js/nature/fern.js"),
  "nature/flower": () => import("./js/nature/flower.js"),
  "nature/fxtree": () => import("./js/nature/fxtree.js"),
  "nature/grass": () => import("./js/nature/grass.js"),
  "nature/mushroom": () => import("./js/nature/mushroom.js"),
  "nature/palm": () => import("./js/nature/palm.js"),
  "nature/rock": () => import("./js/nature/rock.js"),
  "nature/tree": () => import("./js/nature/tree.js"),
  "nature/tumbleweed": () => import("./js/nature/tumbleweed.js"),
  "landscape/hill": () => import("./js/landscape/hill.js"),
  "landscape/mountain": () => import("./js/landscape/mountain.js"),
  "sky/cloud": () => import("./js/sky/cloud.js"),
  "sky/moon": () => import("./js/sky/moon.js"),
  "sky/star": () => import("./js/sky/star.js"),
  "sky/sun": () => import("./js/sky/sun.js"),
  "fauna/bird": () => import("./js/fauna/bird.js"),
  "fauna/butterfly": () => import("./js/fauna/butterfly.js"),
  "fauna/firefly": () => import("./js/fauna/firefly.js"),
  "fauna/scorpion": () => import("./js/fauna/scorpion.js"),
  "items/potion": () => import("./js/items/potion.js"),
  "characters/slime": () => import("./js/characters/slime.js"),
};

/** Identifiants de toutes les familles ("categorie/asset"). */
export const ids = Object.keys(loaders);

/** Charge une famille complète (avec pixels). */
export async function load(id) {
  const l = loaders[id];
  if (!l) throw new Error(`pixel-assets: asset inconnu '${id}' (connus : ${ids.join(", ")})`);
  return (await l()).default;
}

/** Charge une variante par identifiant complet "categorie/asset/variante". */
export async function loadVariant(fullId) {
  const i = fullId.lastIndexOf("/");
  const asset = await load(fullId.slice(0, i));
  const v = asset.variants[fullId.slice(i + 1)];
  if (!v) throw new Error(`pixel-assets: variante inconnue '${fullId}' (connues : ${Object.keys(asset.variants).join(", ")})`);
  return v;
}

/**
 * Recherche dans le catalogue (sans charger les pixels). Tous les critères sont optionnels :
 * { category, asset, tag, text, size, maxSize, kind, props: { axe: valeur } }.
 * Retourne des variantes du catalogue enrichies de { assetId, category }.
 */
export function find(q = {}) {
  const text = q.text?.toLowerCase();
  const out = [];
  for (const a of Object.values(catalog.assets)) {
    if (q.category && a.category !== q.category) continue;
    if (q.asset && a.slug !== q.asset && a.id !== q.asset) continue;
    for (const v of Object.values(a.variants)) {
      if (q.tag && !a.tags.includes(q.tag) && !v.tags.includes(q.tag)) continue;
      if (q.size && v.size !== q.size) continue;
      if (q.maxSize && Math.max(v.w, v.h) > q.maxSize) continue;
      if (q.kind && v.kind !== q.kind) continue;
      if (q.props && Object.entries(q.props).some(([k, val]) => v.props[k] !== val)) continue;
      if (text) {
        const hay = [a.title, a.description, ...a.tags, v.label, v.key, ...v.tags, ...Object.values(v.props).map(String)].join(" ").toLowerCase();
        if (!text.split(/\s+/).every((w) => hay.includes(w))) continue;
      }
      out.push({ ...v, assetId: a.id, category: a.category });
    }
  }
  return out;
}
