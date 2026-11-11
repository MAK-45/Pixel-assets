include("../_palette.px.js")
include("_kit.px.js")

// Scène statique __TITLE__ : squelette généré par le skill /scene. Un seul écran 320 × 180 qui ne
// défile pas (plans en factor 0) ; les périodes et les effets d'ambiance marchent comme ailleurs.
// Remplacer chaque « À FAIRE » en regardant les aperçus (npm run scene -- <ce fichier> --planes).

const meta = {
  title: "__TITLE__",
  description: "À FAIRE : écran statique 16:9 (base 320 × 180), sans défilement : ce qu'on voit, les périodes et leurs animations. Ligne de sol à y = 150.",
  tags: ["scene", "static", "background", "screen"],
  variants: {
    day: { label: "Jour", props: { period: "day" } },
    dusk: { label: "Crépuscule", props: { period: "dusk" } },
    night: { label: "Nuit", props: { period: "night" } },
    overcast: { label: "Sombre", props: { period: "overcast" } },
  },
  scene: {
    type: "static",
    w: 320, h: 180, groundY: 150,
    periods: PERIOD_LABELS,
    defaultPeriod: "day",
    planes: [
      { id: "sky", label: "Ciel", kind: "sky", factor: 0, y: 0, image: "_sky_{period}",
        body: { image: "_body_{period}", x: 30, y: 12, periods: ["day", "dusk", "night"] } },
      { id: "stars", label: "Étoiles", factor: 0, y: 0, image: "_stars_{period}", periods: ["dusk", "night"] },
      // loop + drift : les nuages dérivent même si l'écran est fixe
      { id: "clouds", label: "Nuages", factor: 0, loop: true, drift: -3, driftBy: { overcast: -9 }, y: 4, image: "_clouds_{period}" },
      { id: "decor", label: "Décor", factor: 0, y: 60, image: "_decor_{period}" },
      { id: "ground", label: "Sol", factor: 0, y: 132, image: "_ground_{period}" },
      { id: "front", label: "Premier plan", factor: 0, y: 150, front: true, optional: true, image: "_front_{period}" },
    ],
    sprites: { twinkle: "_star_tiny_twinkle_8", streak: "_star_streak_24" },
    effects: {
      day: [],
      dusk: [{ type: "twinkle", sprite: "twinkle", count: 5, area: [84, 2, 236, 34], after: "stars" }],
      night: [
        { type: "twinkle", sprite: "twinkle", count: 14, area: [84, 2, 236, 92], after: "stars" },
        { type: "shooting", sprite: "streak", every: [6000, 15000], area: [110, 4, 190, 34], speed: [140, 190], head: [1, 9], after: "stars" },
      ],
      overcast: [],
    },
  },
}

// ================================================================ sélection d'assets (À FAIRE)

imp("sky/sun", ["rays_32"])
imp("sky/moon", ["full_32"])
imp("sky/star", ["tiny_plus_8", "tiny_twinkle_8", "streak_24"])
imp("sky/cloud", ["cumulus_32", "puff_24", "sunset_32", "night_32", "storm_32"])
imp("landscape/mountain", ["peak_snow_64"])
imp("nature/tree", ["oak_summer_48"])
imp("nature/grass", ["tuft_16"])

// ================================================================ ciel, astres, étoiles, nuages

skySprites()
bodySprites()
sprite("_stars_dusk", { w: 320, h: 110 }, starField(22, 36, 7))
sprite("_stars_night", { w: 320, h: 110 }, starField(110, 104, 11))
const CW = 640
sprite("_clouds_day", { w: CW, h: 64 }, cloudBand(CW, ["_cloud_cumulus_32", "_cloud_puff_24"], 3))
sprite("_clouds_dusk", { w: CW, h: 64 }, cloudBand(CW, ["_cloud_sunset_32"], 5, [4, 46]))
sprite("_clouds_night", { w: CW, h: 64, swap: NIGHT_CLOUD }, cloudBand(CW, ["_cloud_night_32"], 9, [0, 30]))
sprite("_clouds_overcast", { w: CW, h: 64, swap: STORM }, overcastCeiling(CW, 13))

// ================================================================ décor (un écran : 320 px) — À FAIRE

const decor = (P) => [
  stamp("_mountain_peak_snow_64", 180, 88 - SIZE["_mountain_peak_snow_64"].h, { swap: FAR[P] }), // posé sur le sol
  stamp("_tree_oak_summer_48", 30, 88 - SIZE["_tree_oak_summer_48"].h, { swap: NEAR[P] }),
]
for (const P of PERIODS) sprite(`_decor_${P}`, { w: 320, h: 88 }, ...decor(P))

// ================================================================ sol (ligne de sol à y = 150)

const TOP = 18
sprite("_ground_day", { w: 320, h: 48 }, (c) => {
  for (let x = 0; x < 320; x++) {
    c.px(x, TOP - 1, "k")
    c.px(x, TOP, "L")
    for (let y = TOP + 1; y < TOP + 3; y++) c.px(x, y, "l")
    for (let y = TOP + 3; y < TOP + 6; y++) c.px(x, y, "g")
    for (let y = TOP + 6; y < 48; y++) c.px(x, y, "b")
  }
})
for (const P of PERIODS.slice(1)) sprite(`_ground_${P}`, { base: "_ground_day", swap: NEAR[P] })

// ================================================================ premier plan

for (const P of PERIODS) sprite(`_front_${P}`, { w: 320, h: 30, swap: FRONT[P] }, stamp("_grass_tuft_16", 260, 19))
