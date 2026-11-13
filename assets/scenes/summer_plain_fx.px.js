include("../_palette.px.js")
include("_kit.px.js")
include("../nature/_fx.px.js")

const meta = {
  title: "Plaine d'été (style pixelfx)",
  description: "Panorama dynamique 16:9 (base 320 × 180) pour jeu de plateforme ou runner, version au rendu riche « style pixelfx » de la Plaine d'été : pas de contour noir, volumes modelés par la lumière en haut à gauche, paliers francs, ciel en bandes nettes sans trame. Une plaine d'été au pied d'un très grand pic enneigé à facettes, en 8 plans de parallaxe qui bouclent sans couture : ciel, étoiles, nuages fx, montagnes (pic héros et chaînes lointaines), collines fx semées de bosquets, prairie (chênes, bouleaux, sapins, buissons, rochers moussus), sol d'herbe et de terre où marche le personnage (pâquerettes, tulipes, cailloux, touffes au vent) et hautes herbes au vent au premier plan. Quatre périodes : jour (soleil à rayons, nuages qui dérivent, herbe au vent, oiseaux, papillons), crépuscule (disque couchant à demi caché derrière les collines, nuages dorés, premières étoiles qui scintillent, oiseaux), nuit (pleine lune à halo, champ d'étoiles, scintillements, étoiles filantes, lucioles dans la prairie et sur le sol) et sombre (plafond d'orage, nuages bas accrochés au sommet, vent fort, sans pluie : à ajouter par le jeu). Ligne de sol à y = 150.",
  tags: ["scene", "parallax", "panorama", "background", "plain", "meadow", "mountain", "summer", "day-night", "endless", "platformer", "runner", "realistic", "pixelfx"],
  variants: {
    day: { label: "Jour", props: { period: "day" }, tags: ["sun", "clouds", "butterflies", "birds"] },
    dusk: { label: "Crépuscule", props: { period: "dusk" }, tags: ["sunset", "evening", "birds"] },
    night: { label: "Nuit", props: { period: "night" }, tags: ["moon", "stars", "shooting-star", "fireflies"] },
    overcast: { label: "Sombre", props: { period: "overcast" }, tags: ["storm", "dark", "wind", "cloudy"] },
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
      { id: "hills", label: "Collines", factor: 0.3, y: 96, image: "_hills_{period}" },
      { id: "meadow", label: "Prairie", factor: 0.6, y: 92, image: "_meadow_{period}" },
      { id: "ground", label: "Sol", factor: 1, y: 132, image: "_ground_{period}" },
      { id: "front", label: "Premier plan", factor: 1.3, y: 150, front: true, optional: true, image: "_front_{period}" },
    ],
    sprites: {
      grass: "_act_grass_{period}",
      tall: "_act_tall_{period}",
      bird: "_bird_far_8",
      bfly_white: "_bfly_white", bfly_yellow: "_bfly_yellow", bfly_blue: "_bfly_blue",
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
// Tout le décor vient des familles fx* ; seuls les tout petits sprites animés (oiseaux lointains,
// papillons, lucioles, scintillements, étoile filante) sont ceux de la maison (papillons sans contour noir).

imp("nature/fxtree", ["oak_summer_16", "pine_16", "oak_summer_48", "birch_48", "pine_48", "oak_summer_32", "birch_32", "pine_32"])
imp("nature/fxbush", ["round_32", "berry_32", "round_16", "hedge_48"])
imp("nature/fxrock", ["boulder_moss_32", "boulder_32", "stone_16", "pebbles_16"])
imp("nature/fxgrass", ["tuft_wind_16", "tall_wind_32", "tuft_16"])
imp("nature/fxflower", ["daisy_16", "tulip_red_16"])
imp("landscape/fxhill", ["rolling_64", "round_32"])
imp("landscape/fxmountain", ["peak_snow_128", "peak_snow_64", "range_snow_64"])
imp("sky/fxcloud", ["cumulus_48", "puff_32", "puff_16", "stratus_64", "sunset_48", "night_48", "storm_64"])
imp("sky/fxsun", ["rays_32", "setting_32"])
imp("sky/fxmoon", ["full_32"])
imp("sky/fxstar", ["sparkle4_16"])
imp("sky/star", ["tiny_plus_8", "tiny_twinkle_8", "streak_24"])
imp("fauna/bird", ["far_8"])
imp("fauna/butterfly", ["white_8", "yellow_8", "blue_8"])
imp("fauna/firefly", ["glow_8", "glow_amber_8"])

// Papillons sans contour noir : le bord prend la teinte la plus sombre de l'aile.
for (const [n, k] of [["white", "S"], ["yellow", "o"], ["blue", "u"]])
  sprite(`_bfly_${n}`, { w: SIZE[`_butterfly_${n}_8`].w, h: SIZE[`_butterfly_${n}_8`].h }, stamp(`_butterfly_${n}_8`, 0, 0, { swap: { k } }))

// ================================================================ 0. ciel et astres
// Bandes nettes, sans trame (paliers francs du style pixelfx).

// [clé, hauteur] du zénith vers l'horizon ; la dernière clé remplit le reste de la tuile.
const SKY_FX = {
  day: [["u", 10], ["i", 46], ["I", 50], ["s", 0]],
  dusk: [["V", 22], ["A", 22], ["f", 22], ["F", 18], ["o", 16], ["y", 0]],
  night: [["Q", 30], ["O", 38], ["M", 42], ["U", 0]],
  overcast: [["d", 18], ["<", 32], ["m", 42], [">", 0]],
}
for (const [P, bands] of Object.entries(SKY_FX)) {
  let y = 0
  sprite(`_sky_${P}`, { w: 8, h: 180 }, ...bands.map(([k, h]) => { const r = rect(0, y, 8, h || 180 - y, k); y += h; return r }))
}
sprite("_body_day", BODY, stamp("_fxsun_rays_32", 0, 0))
sprite("_body_dusk", BODY, stamp("_fxsun_setting_32", 70, 80))
sprite("_body_night", BODY, stamp("_fxmoon_full_32", 2, 0))

// ================================================================ 1. étoiles (fixes, hors de la lune)

const sparkles = (pts) => (c) => { for (const [x, y] of pts) c.stamp("_fxstar_sparkle4_16", x - 7, y - 7) }
sprite("_stars_dusk", { w: 320, h: 110 }, starField(22, 36, 7))
sprite("_stars_night", { w: 320, h: 110 }, starField(110, 104, 11), sparkles([[132, 22], [262, 12], [214, 58]]))

// ================================================================ 2. nuages (bande de 960 px)

const CW = 960
// cloudBand commence toujours à x = 10 : on décale la bande pour que le premier nuage ne cache pas l'astre.
const shifted = (dx, draw) => (c) => { const ops = []; draw({ ...c, stamp: (n, x, y, o) => ops.push([n, x, y, o]) }); for (const [n, x, y, o] of ops) cput(c, CW, n, (x + dx) % CW, y, o) }
sprite("_clouds_day", { w: CW, h: 64 }, shifted(60, cloudBand(CW, ["_fxcloud_cumulus_48", "_fxcloud_puff_32", "_fxcloud_cumulus_48", "_fxcloud_puff_16"], 3, [0, 36])))
sprite("_clouds_dusk", { w: CW, h: 64 }, shifted(130, cloudBand(CW, ["_fxcloud_sunset_48", "_fxcloud_sunset_48", "_fxcloud_puff_16"], 5, [4, 42])))
sprite("_clouds_night", { w: CW, h: 64, swap: { c: ">", C: "c" } }, shifted(90, cloudBand(CW, ["_fxcloud_night_48"], 9, [0, 30])))
// Temps couvert : plafond continu et bosselé de nuages d'orage, lambeaux plus bas.
const STORM_FX = { C: "c", c: "m", ">": "<", m: "d", "<": "d" }
sprite("_clouds_overcast", { w: CW, h: 64, swap: STORM_FX }, (c) => {
  const r = rng(13)
  c.rect(0, 0, CW, 12, "<")
  for (let x = -20; x < CW; x += 26 + Math.floor(r() * 34))
    cput(c, CW, "_fxcloud_storm_64", x, -14 + Math.floor(r() * 12), flipIf(r() < 0.5))
  for (let i = 0; i < 7; i++)
    cput(c, CW, i % 2 ? "_fxcloud_stratus_64" : "_fxcloud_storm_64", Math.floor(r() * CW), 18 + Math.floor(r() * 14), flipIf(r() < 0.5))
})

// ================================================================ 3. montagnes (bande de 640 px)

const MW = 640
const mountains = (P) => [
  // chaînes lointaines, presque couleur du ciel
  ...[[0, 72], [54, 76], [112, 70], [300, 74], [356, 68], [470, 76], [528, 72], [584, 75]].flatMap(([x, y], i) =>
    put(MW, "_fxmountain_range_snow_64", x, y, { swap: FX_FAR2[P], ...flipIf(i % 2) })),
  // un second pic, plus loin
  ...put(MW, "_fxmountain_peak_snow_64", 412, 42, { swap: FX_FAR2[P] }),
  // le très grand pic, héros du premier écran
  ...put(MW, "_fxmountain_peak_snow_128", 150, -2, { swap: FX_FAR[P] }),
  // par temps sombre, des nuages bas s'accrochent au sommet
  ...(P === "overcast" ? [[168, 0], [214, 4], [186, 24], [228, 30]].flatMap(([x, y], i) =>
    put(MW, i < 2 ? "_fxcloud_storm_64" : "_fxcloud_stratus_64", x, y, { swap: { C: "c", c: ">" }, ...flipIf(i % 2) })) : []),
]
for (const P of PERIODS) sprite(`_mountains_${P}`, { w: MW, h: 104 }, ...mountains(P))

// ================================================================ 4. collines (bande de 960 px)

const HW = 960
const hills = () => {
  const r = rng(21)
  const out = [rect(0, 44, HW, 10, "1")]
  // rangée du fond : vallonnements qui se chevauchent
  for (let x = -10, i = 0; x < HW; x += 50 + Math.floor(r() * 18), i++)
    out.push(...put(HW, "_fxhill_rolling_64", x, 14 + Math.floor(r() * 8), flipIf(i % 2)))
  // bosquets de petits arbres posés sur les collines
  for (const [x, n] of [[70, 3], [260, 2], [430, 4], [610, 2], [790, 3]])
    for (let j = 0; j < n; j++)
      out.push(...plant(HW, r() < 0.55 ? "_fxtree_pine_16" : "_fxtree_oak_summer_16", x + j * 9 + Math.floor(r() * 4), 36 + Math.floor(r() * 3)))
  // rangée de devant : collines rondes
  for (const x of [120, 340, 560, 700, 880]) out.push(...plant(HW, "_fxhill_round_32", x, 54 - Math.floor(r() * 4)))
  return out
}
for (const P of PERIODS) sprite(`_hills_${P}`, { w: HW, h: 54, swap: FX_MID[P] }, ...hills())

// ================================================================ 5. prairie (bande de 1280 px)

// Bande de terrain au style pixelfx : pas de contour, liseré clair, brins d'un pixel qui dépassent du
// bord (bruit lissé), paliers francs qui foncent vers le bas.
const fxField = (W, top, h, ramp = ["1", "G", "g", "l", "L"], seed = 1) => (c) => {
  for (let x = 0; x < W; x++) {
    const t = top(x)
    // brin qui dépasse (1 à 2 px), jamais régulier, raccord parfait (bruit sur x modulo W)
    const n = vnoise(x % W, 0, 2, seed), m = vnoise((x + W - 1) % W, 0, 2, seed)
    if (n > 0.6) c.px(x, t - 1, n > 0.72 && m < n ? "L" : "l")
    if (n > 0.78 && m < n) c.px(x, t - 2, "l")
    for (let y = t; y < h; y++) c.px(x, y, y === t ? ramp[4] : y < t + 3 ? ramp[3] : y < t + 8 ? ramp[2] : y < t + 13 ? ramp[1] : ramp[0])
  }
}
const PW = 1280
const fieldTop = wave(PW, 47, [[2, 3, 0.5], [1.4, 7, 2], [0.8, 13, 4]])
// [partie, x] : bosquets et clairières en alternance, quatre écrans sans répétition visible.
const MEADOW = [
  ["_fxtree_oak_summer_48", 14], ["_fxbush_round_32", 58], ["_fxtree_birch_48", 206], ["_fxrock_stone_16", 250],
  ["_fxtree_oak_summer_32", 336], ["_fxbush_berry_32", 364], ["_fxtree_pine_48", 462], ["_fxtree_pine_32", 498], ["_fxrock_boulder_moss_32", 560],
  ["_fxtree_birch_32", 690], ["_fxtree_oak_summer_48", 736], ["_fxbush_round_16", 786], ["_fxbush_hedge_48", 880],
  ["_fxtree_pine_48", 990], ["_fxbush_round_32", 1042], ["_fxtree_oak_summer_32", 1146], ["_fxbush_berry_32", 1176], ["_fxrock_boulder_32", 1228],
]
const meadow = () => [
  fxField(PW, fieldTop, 60),
  ...MEADOW.flatMap(([name, x], i) => plant(PW, name, x, fieldTop(x + SIZE[name].w / 2) + 5, flipIf(i % 3 === 1 && !name.includes("birch")))),
]
for (const P of PERIODS) sprite(`_meadow_${P}`, { w: PW, h: 60, swap: FX_NEAR[P] }, ...meadow())

// ================================================================ 6. sol (bande de 640 px, ligne de sol à y = 150)

const GW = 640, TOP = 18 // bord du sol dans la bande (132 + 18 = 150)
const soil = (c) => {
  for (let x = 0; x < GW; x++) {
    // gazon : brins courts au-dessus de la ligne des pieds, liseré clair, paliers vers l'ombre des racines
    const n = vnoise(x, 0, 1.8, 4)
    if (n > 0.55) c.px(x, TOP - 1, n > 0.7 ? "L" : "l")
    if (n > 0.8) c.px(x, TOP - 2, "l")
    c.px(x, TOP, "2")
    c.px(x, TOP + 1, "L")
    for (let y = TOP + 2; y < TOP + 4; y++) c.px(x, y, "l")
    for (let y = TOP + 4; y < TOP + 6; y++) c.px(x, y, "g")
    c.px(x, TOP + 6, "G")
    c.px(x, TOP + 7, "1")
    // terre : bois-terre en paliers, plus sombre en profondeur
    for (let y = TOP + 8; y < 48; y++) c.px(x, y, y < TOP + 10 ? "B" : y < TOP + 28 ? "b" : "B")
  }
  // racines qui pendent sous le gazon (en grappes, pas en grain)
  for (let x = 0; x < GW; x++) {
    const v = vnoise(x, 3, 2.5, 9)
    if (v > 0.62) c.px(x, TOP + 8, "1")
    if (v > 0.74) c.px(x, TOP + 9, "G")
  }
  // couches de terre : veine claire (n) au-dessus d'une ombre (3), bords ondulés qui bouclent
  const strata = [wave(GW, TOP + 16, [[2, 3, 0], [1, 8, 1]]), wave(GW, TOP + 25, [[2, 2, 2], [1, 5, 3]])]
  for (let x = 0; x < GW; x++) for (const s of strata) { c.px(x, s(x), "="); c.px(x, s(x) + 1, "n"); c.px(x, s(x) + 2, "3") }
  // pierres enfouies : facettes de la pierre riche, claire en haut à gauche
  for (const [x, y, r] of [[40, 33, 3], [150, 41, 2], [262, 31, 3], [380, 39, 2], [470, 32, 3], [575, 43, 2]]) {
    c.ellipse(x, y, r + 1, r, "<")
    c.ellipse(x - 1, y - 1, r, r - 1, "m")
    c.px(x - 1, y - 1, ">"); c.px(x - 2, y - 1, "c"); c.hline(x - r, y + r, 2 * r + 1, "3")
  }
}
// Décor posé sur le bord du sol (fleurs, touffes, cailloux).
const GROUND_DECOR = [
  ["_fxgrass_tuft_16", 24], ["_fxflower_daisy_16", 70], ["_fxrock_pebbles_16", 118], ["_fxflower_tulip_red_16", 168],
  ["_fxflower_daisy_16", 184], ["_fxrock_stone_16", 236], ["_fxgrass_tuft_16", 300], ["_fxflower_tulip_red_16", 352],
  ["_fxflower_daisy_16", 404], ["_fxflower_daisy_16", 446], ["_fxrock_pebbles_16", 498], ["_fxflower_daisy_16", 548],
  ["_fxflower_tulip_red_16", 562], ["_fxgrass_tuft_16", 604],
]
const ground = () => [soil, ...GROUND_DECOR.flatMap(([name, x]) => plant(GW, name, x, TOP + 2))]
for (const P of PERIODS) sprite(`_ground_${P}`, { w: GW, h: 48, swap: FX_NEAR[P] }, ...ground())

// Herbe au vent posée sur le sol (acteurs animés par le moteur, désynchronisés).
periodActor("grass", "_fxgrass_tuft_wind_16", FX_NEAR)
meta.scene.planes.find((p) => p.id === "ground").actors = actorsAt("grass", [10, 94, 138, 206, 268, 324, 420, 474, 522, 590], TOP + 2 - 16)
// Les papillons voltigent au-dessus des fleurs.
meta.scene.effects.day[1].anchors = GROUND_DECOR.filter(([n]) => n.includes("flower")).map(([, x]) => [x + 7, TOP - 12])

// ================================================================ 7. premier plan (devant le personnage)

const FW = 960
for (const P of PERIODS) sprite(`_front_${P}`, { w: FW, h: 30, swap: FX_FRONT[P] }, ...[150, 470, 700].flatMap((x) => plant(FW, "_fxgrass_tuft_16", x, 32)))
periodActor("tall", "_fxgrass_tall_wind_32", FX_FRONT)
meta.scene.planes.find((p) => p.id === "front").actors = actorsAt("tall", [40, 310, 590, 830], 4, { phaseStep: 400, loop: 1200 })
