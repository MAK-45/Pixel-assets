include("../_palette.px.js")
include("_kit.px.js")

// Scène dynamique __TITLE__ : squelette généré par le skill /scene-dynamique. Il se construit tel quel ; remplacer
// chaque « À FAIRE » plan par plan, en regardant les aperçus (npm run scene -- <ce fichier> --planes).
// Modèle complet : assets/scenes/summer_plain.px.js ; outils : assets/scenes/_kit.px.js.

const meta = {
  title: "__TITLE__",
  description: "À FAIRE : panorama dynamique 16:9 (base 320 × 180) : ce qu'on voit, les plans de parallaxe qui bouclent sans couture, les périodes et leurs animations. Ligne de sol à y = 150.",
  tags: ["scene", "parallax", "panorama", "background", "endless", "platformer", "runner"],
  variants: {
    day: { label: "Jour", props: { period: "day" } },
    dusk: { label: "Crépuscule", props: { period: "dusk" } },
    night: { label: "Nuit", props: { period: "night" } },
    overcast: { label: "Sombre", props: { period: "overcast" } },
  },
  scene: {
    type: "parallax",
    w: 320, h: 180, groundY: 150,
    periods: PERIOD_LABELS,
    defaultPeriod: "day",
    // Du fond vers l'avant. factor : 0 = fixe, 1 = vitesse du sol, > 1 = devant le personnage.
    planes: [
      { id: "sky", label: "Ciel", kind: "sky", factor: 0, y: 0, image: "_sky_{period}",
        body: { image: "_body_{period}", x: 30, y: 12, periods: ["day", "dusk", "night"] } },
      { id: "stars", label: "Étoiles", factor: 0, y: 0, image: "_stars_{period}", periods: ["dusk", "night"] },
      { id: "clouds", label: "Nuages", factor: 0.05, drift: -3, driftBy: { overcast: -9 }, y: 4, image: "_clouds_{period}" },
      { id: "far", label: "Lointain", factor: 0.1, y: 66, image: "_far_{period}" },
      { id: "mid", label: "Mi-distance", factor: 0.3, y: 98, image: "_mid_{period}" },
      { id: "near", label: "Proche", factor: 0.6, y: 92, image: "_near_{period}" },
      { id: "ground", label: "Sol", factor: 1, y: 132, image: "_ground_{period}" },
      { id: "front", label: "Premier plan", factor: 1.3, y: 150, front: true, optional: true, image: "_front_{period}" },
    ],
    sprites: { bird: "_bird_far_8", twinkle: "_star_tiny_twinkle_8", streak: "_star_streak_24", grass: "_act_grass_{period}" },
    effects: {
      day: [{ type: "birds", sprite: "bird", every: [14000, 28000], count: [2, 5], y: [26, 70], speed: [14, 22], factor: 0.12, after: "far" }],
      dusk: [{ type: "twinkle", sprite: "twinkle", count: 5, area: [84, 2, 236, 34], after: "stars" }],
      night: [
        { type: "twinkle", sprite: "twinkle", count: 14, area: [84, 2, 236, 92], after: "stars" },
        { type: "shooting", sprite: "streak", every: [6000, 15000], area: [110, 4, 190, 34], speed: [140, 190], head: [1, 9], after: "stars" },
      ],
      overcast: [],
    },
    speed: { overcast: 2 },
  },
}

// ================================================================ sélection d'assets (À FAIRE : la sélection du biome)

imp("sky/sun", ["rays_32"])
imp("sky/moon", ["full_32"])
imp("sky/star", ["tiny_plus_8", "tiny_twinkle_8", "streak_24"])
imp("sky/cloud", ["cumulus_32", "puff_24", "sunset_32", "night_32", "storm_32"])
imp("fauna/bird", ["far_8"])
imp("landscape/mountain", ["range_snow_64"])
imp("landscape/hill", ["rolling_64"])
imp("nature/bush", ["round_32"])
imp("nature/grass", ["tuft_16", "tuft_wind_16"])

// ================================================================ 0-2. ciel, astres, étoiles, nuages

skySprites()      // À FAIRE : skySprites({ ...SKY, day: "…" }) pour un autre ciel
bodySprites()     // soleil et lune en haut à gauche, soleil couchant bas (positions réglables)
sprite("_stars_dusk", { w: 320, h: 110 }, starField(22, 36, 7))
sprite("_stars_night", { w: 320, h: 110 }, starField(110, 104, 11))
const CW = 960
sprite("_clouds_day", { w: CW, h: 64 }, cloudBand(CW, ["_cloud_cumulus_32", "_cloud_puff_24"], 3))
sprite("_clouds_dusk", { w: CW, h: 64 }, cloudBand(CW, ["_cloud_sunset_32"], 5, [4, 46]))
sprite("_clouds_night", { w: CW, h: 64, swap: NIGHT_CLOUD }, cloudBand(CW, ["_cloud_night_32"], 9, [0, 30]))
sprite("_clouds_overcast", { w: CW, h: 64, swap: STORM }, overcastCeiling(CW, 13))

// ================================================================ 3. lointain (bande de 640 px, presque couleur du ciel)

const FARW = 640
for (const P of PERIODS)
  sprite(`_far_${P}`, { w: FARW, h: 72 },
    ...[0, 70, 150, 260, 330, 420, 500, 570].flatMap((x, i) => put(FARW, "_mountain_range_snow_64", x, 36 + (i % 3) * 3, { swap: FAR2[P], ...flipIf(i % 2) })))

// ================================================================ 4. mi-distance (bande de 960 px)

const MIDW = 960
const mid = () => {
  const r = rng(21)
  const out = [rect(0, 30, MIDW, 22, "g")]
  for (let x = -10, i = 0; x < MIDW; x += 50 + Math.floor(r() * 18), i++)
    out.push(...put(MIDW, "_hill_rolling_64", x, 8 + Math.floor(r() * 8), flipIf(i % 2)))
  return out
}
for (const P of PERIODS) sprite(`_mid_${P}`, { w: MIDW, h: 52, swap: MID[P] }, ...mid())

// ================================================================ 5. proche (bande de 1280 px) — À FAIRE : le décor du biome

const NW = 1280
const nearTop = wave(NW, 47, [[2, 3, 0.5], [1.4, 7, 2], [0.8, 13, 4]])
const NEAR_DECOR = [["_bush_round_32", 60], ["_bush_round_32", 430], ["_bush_round_32", 900]]
const near = () => [
  field(NW, nearTop, 60),
  ...NEAR_DECOR.flatMap(([name, x], i) => plant(NW, name, x, nearTop(x + SIZE[name].w / 2) + 6, flipIf(i % 2))),
]
for (const P of PERIODS) sprite(`_near_${P}`, { w: NW, h: 60, swap: NEAR[P] }, ...near())

// ================================================================ 6. sol (bande de 640 px, ligne de sol à y = 150)

const GW = 640, TOP = 18 // bord du sol dans la bande (132 + 18 = 150)
sprite("_ground_day", { w: GW, h: 48 }, (c) => {
  for (let x = 0; x < GW; x++) {
    c.px(x, TOP - 1, "k")
    c.px(x, TOP, "L")
    for (let y = TOP + 1; y < TOP + 3; y++) c.px(x, y, "l")
    for (let y = TOP + 3; y < TOP + 6; y++) c.px(x, y, "g")
    c.px(x, TOP + 6, "G")
    for (let y = TOP + 7; y < 48; y++) c.px(x, y, "b")
  }
})
for (const P of PERIODS.slice(1)) sprite(`_ground_${P}`, { base: "_ground_day", swap: NEAR[P] })
periodActor("grass", "_grass_tuft_wind_16", NEAR)
meta.scene.planes.find((p) => p.id === "ground").actors = actorsAt("grass", [30, 170, 330, 480], TOP + 2 - 13)

// ================================================================ 7. premier plan (devant le personnage, clairsemé)

const FW = 960
for (const P of PERIODS) sprite(`_front_${P}`, { w: FW, h: 30, swap: FRONT[P] }, ...[150, 600].flatMap((x) => plant(FW, "_grass_tuft_16", x, 32)))
