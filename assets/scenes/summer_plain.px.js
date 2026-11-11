include("../_palette.px.js")
include("_kit.px.js")

const meta = {
  title: "Plaine d'été",
  description: "Panorama dynamique 16:9 (base 320 × 180) pour jeu de plateforme ou runner : une plaine d'été au pied d'une grande montagne enneigée, en 8 plans de parallaxe qui bouclent sans couture (ciel, étoiles, nuages, montagnes, collines, prairie, sol où marche le personnage, hautes herbes au premier plan). Quatre périodes : jour (nuages qui dérivent, herbe au vent, oiseaux, papillons), crépuscule (soleil couchant, nuages roses, premières étoiles), nuit (lune, étoiles qui scintillent, étoiles filantes, lucioles) et sombre (journée de pluie couverte, vent fort). Ligne de sol à y = 150.",
  tags: ["scene", "parallax", "panorama", "background", "plain", "meadow", "mountain", "summer", "day-night", "endless", "platformer", "runner"],
  variants: {
    day: { label: "Jour", props: { period: "day" }, tags: ["sun", "clouds", "butterflies", "birds"] },
    dusk: { label: "Crépuscule", props: { period: "dusk" }, tags: ["sunset", "evening", "birds"] },
    night: { label: "Nuit", props: { period: "night" }, tags: ["moon", "stars", "shooting-star", "fireflies"] },
    overcast: { label: "Sombre (pluie)", props: { period: "overcast" }, tags: ["rain", "storm", "dark", "wind"] },
  },
  scene: {
    type: "parallax",
    w: 320, h: 180, groundY: 150,
    periods: PERIOD_LABELS,
    defaultPeriod: "day",
    planes: [
      { id: "sky", label: "Ciel", kind: "sky", factor: 0, y: 0, image: "_sky_{period}",
        body: { image: "_body_{period}", x: 30, y: 12, periods: ["day", "dusk", "night"] } },
      { id: "stars", label: "Étoiles", factor: 0, y: 0, image: "_stars_{period}", periods: ["dusk", "night"] },
      { id: "clouds", label: "Nuages", factor: 0.05, drift: -3, driftBy: { overcast: -9 }, y: 4, image: "_clouds_{period}" },
      { id: "mountains", label: "Montagnes", factor: 0.1, y: 30, image: "_mountains_{period}" },
      { id: "hills", label: "Collines", factor: 0.3, y: 98, image: "_hills_{period}" },
      { id: "meadow", label: "Prairie", factor: 0.6, y: 92, image: "_meadow_{period}" },
      { id: "ground", label: "Sol", factor: 1, y: 132, image: "_ground_{period}" },
      { id: "front", label: "Premier plan", factor: 1.3, y: 150, front: true, optional: true, image: "_front_{period}" },
    ],
    sprites: {
      grass: "_act_grass_{period}",
      tall: "_act_tall_{period}",
      bird: "_bird_far_8",
      bfly_white: "_butterfly_white_8", bfly_yellow: "_butterfly_yellow_8", bfly_blue: "_butterfly_blue_8",
      glow: "_firefly_glow_8", glow_amber: "_firefly_glow_amber_8",
      twinkle: "_star_tiny_twinkle_8", streak: "_star_streak_24",
    },
    effects: {
      day: [
        { type: "birds", sprite: "bird", every: [14000, 28000], count: [2, 5], y: [26, 70], speed: [14, 22], factor: 0.12, after: "mountains" },
        { type: "butterflies", sprites: ["bfly_white", "bfly_yellow", "bfly_blue"], plane: "ground", count: 4, anchors: [], after: "ground" },
      ],
      dusk: [
        { type: "twinkle", sprite: "twinkle", count: 5, area: [84, 2, 236, 34], after: "stars" },
        { type: "birds", sprite: "bird", every: [10000, 22000], count: [3, 6], y: [30, 78], speed: [16, 24], factor: 0.12, after: "mountains" },
      ],
      night: [
        { type: "twinkle", sprite: "twinkle", count: 14, area: [84, 2, 236, 92], after: "stars" },
        { type: "shooting", sprite: "streak", every: [6000, 15000], area: [110, 4, 190, 34], speed: [140, 190], head: [1, 9], after: "stars" },
        { type: "fireflies", sprites: ["glow", "glow", "glow_amber"], plane: "meadow", count: 10, area: [0, 36, 1280, 16], after: "meadow" },
        { type: "fireflies", sprites: ["glow"], plane: "ground", count: 9, area: [0, 2, 640, 14], front: 0.35, after: "ground" },
      ],
      overcast: [],
    },
    speed: { overcast: 2 },
  },
}

// ================================================================ sélection d'assets (importés)

imp("nature/tree", ["oak_summer_16", "pine_16", "oak_summer_48", "oak_summer_full_32", "birch_32", "apple_32", "pine_48"])
imp("nature/bush", ["round_32", "berry_32", "round_16"])
imp("nature/rock", ["boulder_mossy_32", "small_16", "pebbles_16"])
imp("nature/grass", ["tuft_wind_16", "tall_wind_32", "clover_16", "tuft_16"])
imp("nature/flower", ["daisy_16", "poppy_16"])
imp("landscape/hill", ["rolling_64", "round_32"])
imp("landscape/mountain", ["peak_snow_128", "peak_snow_64", "range_snow_64"])
imp("sky/cloud", ["cumulus_32", "puff_24", "stratus_48", "sunset_32", "sunset_48", "night_32", "storm_32"])
imp("sky/sun", ["rays_32", "setting_32"])
imp("sky/moon", ["full_32"])
imp("sky/star", ["tiny_dot_8", "tiny_plus_8", "tiny_twinkle_8", "streak_24"])
imp("fauna/bird", ["far_8"])
imp("fauna/butterfly", ["white_8", "yellow_8", "blue_8"])
imp("fauna/firefly", ["glow_8", "glow_amber_8"])

// Couleurs des périodes, placement en bandes, ciel, astres, étoiles, nuages : voir _kit.px.js.

// ================================================================ 0. ciel et astres

skySprites()
bodySprites()

// ================================================================ 1. étoiles (fixes, hors de la lune)

sprite("_stars_dusk", { w: 320, h: 110 }, starField(22, 36, 7))
sprite("_stars_night", { w: 320, h: 110 }, starField(110, 104, 11))

// ================================================================ 2. nuages (bande de 960 px)

const CW = 960
sprite("_clouds_day", { w: CW, h: 64 }, cloudBand(CW, ["_cloud_cumulus_32", "_cloud_puff_24", "_cloud_stratus_48", "_cloud_puff_24"], 3))
sprite("_clouds_dusk", { w: CW, h: 64 }, cloudBand(CW, ["_cloud_sunset_48", "_cloud_sunset_32"], 5, [4, 46]))
sprite("_clouds_night", { w: CW, h: 64, swap: NIGHT_CLOUD }, cloudBand(CW, ["_cloud_night_32"], 9, [0, 30]))
// Temps couvert : le ciel est bas (plafond continu bosselé, lambeaux plus bas).
sprite("_clouds_overcast", { w: CW, h: 64, swap: STORM }, overcastCeiling(CW, 13))

// ================================================================ 3. montagnes (bande de 640 px)

const MW = 640
const mountains = (P) => [
  // chaînes lointaines, presque couleur du ciel
  ...[[0, 70], [54, 74], [112, 68], [300, 72], [356, 66], [470, 74], [528, 70], [584, 73]].flatMap(([x, y], i) =>
    put(MW, "_mountain_range_snow_64", x, y, { swap: FAR2[P], ...flipIf(i % 2) })),
  // un second pic, plus loin
  ...put(MW, "_mountain_peak_snow_64", 412, 56, { swap: FAR2[P] }),
  // la grande montagne
  ...put(MW, "_mountain_peak_snow_128", 150, 10, { swap: FAR[P] }),
  // par temps de pluie, des nuages bas s'accrochent au sommet
  ...(P === "overcast" ? [[168, 0], [196, -6], [222, 2], [248, -4], [206, 14], [236, 18]].flatMap(([x, y], i) =>
    put(MW, "_cloud_storm_32", x, y, { swap: STORM, ...flipIf(i % 2) })) : []),
]
for (const P of PERIODS) sprite(`_mountains_${P}`, { w: MW, h: 104 }, ...mountains(P))

// ================================================================ 4. collines (bande de 960 px)

const HW = 960
const hills = () => {
  const r = rng(21)
  const out = [rect(0, 34, HW, 18, "g")]
  // rangée du fond : vallonnements qui se chevauchent
  for (let x = -10, i = 0; x < HW; x += 50 + Math.floor(r() * 18), i++)
    out.push(...put(HW, "_hill_rolling_64", x, 10 + Math.floor(r() * 8), flipIf(i % 2)))
  // bosquets de petits arbres
  for (const [x, n] of [[70, 3], [260, 2], [430, 4], [610, 2], [790, 3]])
    for (let j = 0; j < n; j++)
      out.push(...plant(HW, r() < 0.55 ? "_tree_pine_16" : "_tree_oak_summer_16", x + j * 9 + Math.floor(r() * 4), 31 + Math.floor(r() * 3)))
  // rangée de devant : collines rondes
  for (const x of [120, 340, 560, 700, 880]) out.push(...plant(HW, "_hill_round_32", x, 50 - Math.floor(r() * 4)))
  return out
}
for (const P of PERIODS) sprite(`_hills_${P}`, { w: HW, h: 52, swap: MID[P] }, ...hills())

// ================================================================ 5. prairie (bande de 1280 px)

const PW = 1280
const fieldTop = wave(PW, 47, [[2, 3, 0.5], [1.4, 7, 2], [0.8, 13, 4]])
// [partie, x] : bosquets et clairières en alternance, quatre écrans sans répétition visible.
const MEADOW = [
  ["_tree_oak_summer_48", 18], ["_bush_round_32", 62], ["_tree_birch_32", 214], ["_rock_small_16", 252],
  ["_tree_apple_32", 340], ["_bush_berry_32", 370], ["_tree_pine_48", 468], ["_tree_pine_48", 500], ["_rock_boulder_mossy_32", 566],
  ["_tree_oak_summer_full_32", 700], ["_tree_oak_summer_48", 744], ["_bush_round_16", 792], ["_tree_birch_32", 904],
  ["_tree_pine_48", 992], ["_bush_round_32", 1046], ["_tree_apple_32", 1150], ["_bush_berry_32", 1180], ["_rock_small_16", 1236],
]
const meadow = () => [
  field(PW, fieldTop, 60),
  ...MEADOW.flatMap(([name, x], i) => plant(PW, name, x, fieldTop(x + SIZE[name].w / 2) + 6, flipIf(i % 3 === 1))),
]
for (const P of PERIODS) sprite(`_meadow_${P}`, { w: PW, h: 60, swap: NEAR[P] }, ...meadow())

// ================================================================ 6. sol (bande de 640 px, ligne de sol à y = 150)

const GW = 640, TOP = 18 // bord du sol dans la bande (132 + 18 = 150)
const soil = (c) => {
  // herbe : liseré clair, herbe, ombre sous les racines
  for (let x = 0; x < GW; x++) {
    c.px(x, TOP - 1, "k")
    c.px(x, TOP, "L")
    for (let y = TOP + 1; y < TOP + 3; y++) c.px(x, y, "l")
    for (let y = TOP + 3; y < TOP + 6; y++) c.px(x, y, "g")
    c.px(x, TOP + 6, "G")
    for (let y = TOP + 7; y < 48; y++) c.px(x, y, "b")
  }
  // racines qui pendent sous l'herbe, couches de terre (sombre au-dessus d'un liseré clair), cailloux
  const strata = [wave(GW, TOP + 15, [[2, 3, 0], [1, 8, 1]]), wave(GW, TOP + 24, [[2, 2, 2], [1, 5, 3]])]
  for (let x = 0; x < GW; x++) {
    if (x % 7 === 3) c.px(x, TOP + 7, "G")
    if (x % 13 === 5) { c.px(x, TOP + 7, "g"); c.px(x, TOP + 8, "G") }
    for (const s of strata) { c.px(x, s(x), "B"); c.px(x, s(x) + 1, "n") }
  }
  for (const [x, y] of [[40, 32], [150, 40], [262, 30], [380, 38], [470, 31], [575, 42]]) {
    c.ellipse(x, y, 3, 2, "m"); c.px(x - 1, y - 1, "c"); c.px(x, y - 1, "C"); c.hline(x - 1, y + 2, 4, "B")
  }
}
// Décor posé sur le bord du sol (fleurs, trèfle, cailloux, touffes immobiles).
const GROUND_DECOR = [
  ["_grass_clover_16", 24], ["_flower_daisy_16", 70], ["_grass_tuft_16", 118], ["_flower_poppy_16", 168],
  ["_flower_daisy_16", 182], ["_rock_pebbles_16", 236], ["_grass_tuft_16", 300], ["_flower_poppy_16", 352],
  ["_grass_clover_16", 396], ["_flower_daisy_16", 446], ["_rock_small_16", 498], ["_flower_daisy_16", 548],
  ["_flower_poppy_16", 560], ["_grass_tuft_16", 604],
]
sprite("_ground_day", { w: GW, h: 48 }, soil, ...GROUND_DECOR.flatMap(([name, x]) => plant(GW, name, x, TOP + 2)))
for (const P of PERIODS.slice(1)) sprite(`_ground_${P}`, { base: "_ground_day", swap: NEAR[P] })

// Herbe au vent posée sur le sol (acteurs animés par le moteur, désynchronisés).
periodActor("grass", "_grass_tuft_wind_16", NEAR)
meta.scene.planes.find((p) => p.id === "ground").actors = actorsAt("grass", [12, 96, 140, 206, 268, 324, 420, 474, 520, 590], TOP + 2 - 13)
// Les papillons voltigent au-dessus des fleurs.
meta.scene.effects.day[1].anchors = GROUND_DECOR.filter(([n]) => n.startsWith("_flower")).map(([, x]) => [x + 6, TOP - 10])

// ================================================================ 7. premier plan (devant le personnage)

const FW = 960
for (const P of PERIODS) sprite(`_front_${P}`, { w: FW, h: 30, swap: FRONT[P] }, ...[150, 470, 700].flatMap((x) => plant(FW, "_grass_tuft_16", x, 32)))
periodActor("tall", "_grass_tall_wind_32", FRONT)
meta.scene.planes.find((p) => p.id === "front").actors = actorsAt("tall", [40, 310, 590, 830], 6, { phaseStep: 250, loop: 1000 })
