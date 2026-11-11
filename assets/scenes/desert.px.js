include("../_palette.px.js")
include("_kit.px.js")

const meta = {
  title: "Désert",
  description: "Panorama dynamique 16:9 (base 320 × 180) pour jeu de plateforme ou runner : un désert de roche rouge dominé par une grande mesa à deux étages, en 8 plans de parallaxe qui bouclent sans couture (ciel, étoiles, nuages, mesas et buttes lointaines, dunes semées de petits cactus, bande de sable avec saguaros, figuiers de Barbarie, rochers, arche, ossements et une oasis de dattiers, sol de sable ridé où marche le personnage, cactus sombres au premier plan). Quatre périodes : jour (soleil écrasant, rares nuages, vautours, virevoltants qui roulent en rebondissant, herbe sèche au vent), crépuscule (disque couchant derrière les mesas, nuages roses, premières étoiles, vols d'oiseaux, un virevoltant de temps en temps), nuit (croissant de lune, ciel très étoilé qui scintille, étoiles filantes, scorpions qui traversent le sable) et sombre (tempête de sable sans précipitation : ciel ocre, plafond de poussière, mesas noyées dans la brume, vent fort, virevoltants en rafales). Ligne de sol à y = 150.",
  tags: ["scene", "parallax", "panorama", "background", "desert", "mesa", "canyon", "dunes", "cactus", "oasis", "day-night", "endless", "platformer", "runner"],
  variants: {
    day: { label: "Jour", props: { period: "day" }, tags: ["sun", "heat", "vultures", "tumbleweed", "wind"] },
    dusk: { label: "Crépuscule", props: { period: "dusk" }, tags: ["sunset", "evening", "birds", "tumbleweed"] },
    night: { label: "Nuit", props: { period: "night" }, tags: ["moon", "crescent", "stars", "shooting-star", "scorpion"] },
    overcast: { label: "Sombre (tempête de sable)", props: { period: "overcast" }, tags: ["sandstorm", "dust", "haze", "wind", "tumbleweed"] },
  },
  scene: {
    type: "parallax",
    w: 320, h: 180, groundY: 150,
    periods: { ...PERIOD_LABELS, overcast: "Sombre (tempête de sable)" },
    defaultPeriod: "day",
    planes: [
      { id: "sky", label: "Ciel", kind: "sky", factor: 0, y: 0, image: "_sky_{period}",
        body: { image: "_body_{period}", x: 30, y: 12, periods: ["day", "dusk", "night"] } },
      { id: "stars", label: "Étoiles", factor: 0, y: 0, image: "_stars_{period}", periods: ["dusk", "night"] },
      { id: "clouds", label: "Nuages", factor: 0.05, drift: -3, driftBy: { overcast: -14 }, y: 4, image: "_clouds_{period}" },
      { id: "far", label: "Mesas", factor: 0.1, y: 58, image: "_far_{period}" },
      { id: "mid", label: "Dunes", factor: 0.3, y: 98, image: "_mid_{period}" },
      { id: "near", label: "Sable et cactus", factor: 0.6, y: 92, image: "_near_{period}" },
      { id: "ground", label: "Sol", factor: 1, y: 132, image: "_ground_{period}" },
      { id: "front", label: "Premier plan", factor: 1.3, y: 150, front: true, optional: true, image: "_front_{period}" },
    ],
    sprites: {
      tuft: "_act_tuft_{period}",
      roll: "_act_roll_{period}",
      roll_near: "_act_rollnear_{period}",
      scorpion: "_act_scorpion_{period}",
      bird: "_bird_far_8",
      twinkle: "_star_tiny_twinkle_8", streak: "_star_streak_24",
    },
    effects: {
      day: [
        { type: "birds", sprite: "bird", every: [16000, 30000], count: [2, 3], y: [20, 56], speed: [10, 16], factor: 0.12, after: "far" },
        { type: "crossing", sprite: "roll", plane: "ground", y: 21, every: [9000, 18000], speed: [34, 52], hop: [5, 9], bounce: [450, 600], dir: 1, after: "ground" },
      ],
      dusk: [
        { type: "twinkle", sprite: "twinkle", count: 6, area: [84, 2, 236, 36], after: "stars" },
        { type: "birds", sprite: "bird", every: [11000, 22000], count: [3, 6], y: [24, 66], speed: [16, 24], factor: 0.12, after: "far" },
        { type: "crossing", sprite: "roll", plane: "ground", y: 21, every: [14000, 26000], speed: [30, 44], hop: [4, 8], bounce: [450, 600], dir: 1, after: "ground" },
      ],
      night: [
        { type: "twinkle", sprite: "twinkle", count: 22, area: [84, 2, 236, 96], after: "stars" },
        { type: "shooting", sprite: "streak", every: [5000, 12000], area: [110, 4, 190, 34], speed: [140, 190], head: [1, 9], after: "stars" },
        { type: "crossing", sprite: "scorpion", plane: "ground", y: 21, every: [12000, 24000], speed: [7, 12], after: "ground" },
      ],
      overcast: [
        { type: "crossing", sprite: "roll_near", plane: "near", y: 50, every: [5000, 9000], count: [1, 2], speed: [50, 70], hop: [2, 5], bounce: [400, 500], dir: 1, after: "near" },
        { type: "crossing", sprite: "roll", plane: "ground", y: 21, every: [2500, 6000], count: [1, 3], speed: [80, 115], hop: [6, 12], bounce: [380, 480], dir: 1, after: "ground" },
      ],
    },
    speed: { overcast: 2 },
  },
}

// ================================================================ sélection d'assets (importés)

imp("landscape/mountain", ["mesa_red_128", "mesa_red_48", "mesa_48", "butte_red_48", "butte_48"])
imp("nature/cactus", ["saguaro_16", "saguaro_32", "saguaro_48", "saguaro_flowers_32", "barrel_16", "barrel_flowers_16", "barrel_32",
  "prickly_16", "prickly_32", "prickly_flowers_32"])
imp("nature/palm", ["date_48", "date_32", "young_16"])
imp("nature/rock", ["boulder_sand_32", "spire_sand_32", "arch_sand_48", "pebbles_16", "small_16"])
imp("nature/bones", ["skull_sand_32", "skull_16", "bone_16"])
imp("nature/tumbleweed", ["dry_16", "roll_16"])
imp("nature/grass", ["tuft_dry_16", "tuft_wind_16", "tall_dry_32"])
imp("fauna/scorpion", ["sand_walk_16"])
imp("fauna/bird", ["far_8"])
imp("sky/sun", ["rays_32"])
imp("sky/moon", ["crescent_32"])
imp("sky/star", ["tiny_plus_8", "tiny_twinkle_8", "streak_24"])
imp("sky/cloud", ["puff_24", "cumulus_16", "stratus_48", "sunset_32", "sunset_48", "night_32", "storm_32"])

// ================================================================ couleurs propres au désert

// Enchaîne deux recolorations (a puis b) en une seule carte (évite la double recoloration).
const chain = (a, b) => Object.fromEntries([...new Set([...Object.keys(a), ...Object.keys(b), ...Object.keys(TIERS), "k"])]
  .map((k) => [k, b[a[k] ?? k] ?? a[k] ?? k]))
const byPeriod = (fn) => Object.fromEntries(PERIODS.map((P) => [P, fn(P)]))

// Ciel : jour d'un bleu dur qui pâlit à l'horizon ; tempête de sable : ocres.
skySprites({ ...SKY, day: "uiIs", overcast: "bnnN" })
// Tempête : la terre prend la couleur de la poussière (ocres au lieu des verts éteints).
const SAND = { G: "b", g: "b", l: "n", L: "n", P: "b", p: "b", e: "n", E: "n", d: "B", m: "b", c: "n", C: "n", S: "n", s: "N", w: "N" }
const NEAR_D = { ...NEAR, overcast: { ...NEAR.overcast, ...chain(SAND, NEAR.overcast), Y: "N", N: "n", n: "b", b: "B" } }
const MID_D = {
  ...MID,
  day: { ...MID.day, k: "b", Y: "Y", N: "N", n: "n", b: "n", B: "b" },
  overcast: { ...byTier("bnNNN"), k: "b", Y: "N", N: "N", n: "n", b: "n", B: "b", G: "n", g: "n", l: "N", L: "N" },
}
const FRONT_D = { ...FRONT, overcast: { ...byTier("BBbnn"), k: "k" } }
// Lointain : la grande mesa garde son rouge (contour adouci) ; les mesas plus loin virent au lilas
// du ciel. Crépuscule et nuit : cartes du kit ; tempête : silhouettes ocres noyées dans la poussière.
const FAR_D = {
  day: { k: "R", B: "R", R: "r", r: "r", o: "o", y: "y", Y: "y", b: "r", n: "o", N: "y" },
  dusk: { ...byTier("DaAfF"), k: "D", R: "D", B: "D", b: "a", r: "a", n: "A", o: "A", N: "f", y: "f", Y: "F" },
  night: { ...byTier("QOMUU"), k: "Q", R: "Q", B: "Q", b: "O", r: "O", n: "M", o: "M", N: "U", y: "U", Y: "u" },
  overcast: { ...byTier("BbnNN"), k: "b", R: "b", B: "b", r: "n", o: "n", y: "N", Y: "N" },
}
const FAR2_D = {
  day: { ...byTier("cSSCC"), k: "c", R: "c", B: "c", b: "S", r: "S", n: "S", o: "S", N: "C", y: "C", Y: "C" },
  dusk: { ...byTier("AffFF"), k: "A", R: "A", B: "A", b: "f", r: "f", n: "f", o: "f", N: "F", y: "F", Y: "F" },
  night: { ...byTier("OMMMM"), k: "O", R: "O", B: "O", b: "M", r: "M", n: "M", o: "M", N: "M", y: "U", Y: "U" },
  overcast: { ...byTier("nNNNN"), k: "n", R: "n", B: "n", b: "n", r: "n", n: "N", o: "N", N: "N", y: "N", Y: "N" },
}
// Poussière de la tempête (nuages d'orage recolorés en ocres).
const DUST = { C: "N", c: "n", m: "n", d: "b", k: "n", s: "N", w: "N", S: "n" }

// ================================================================ 0. ciel et astres

bodySprites({ moonPart: "_moon_crescent_32", dusk: [80, 96] })

// ================================================================ 1. étoiles (beaucoup la nuit : ciel sec et pur)

sprite("_stars_dusk", { w: 320, h: 110 }, starField(26, 38, 5))
sprite("_stars_night", { w: 320, h: 110 }, starField(210, 106, 17, [0, 0, 70, 50]))

// ================================================================ 2. nuages (bande de 960 px, rares)

const CW = 960
// Comme cloudBand, mais sans nuage entre 0 et x0 (l'astre reste dégagé au premier écran) ni à cheval
// sur le raccord.
const clearBand = (W, list, seed, rows, x0 = 96) => (c) => {
  const r = rng(seed)
  for (let x = x0; ;) {
    const name = list[Math.floor(r() * list.length)]
    if (x + SIZE[name].w > W - 4) break
    c.stamp(name, x, rows[0] + Math.floor(r() * (rows[1] - rows[0])), flipIf(r() < 0.5))
    x += SIZE[name].w + 30 + Math.floor(r() * 90)
  }
}
sprite("_clouds_day", { w: CW, h: 64 }, clearBand(CW, ["_cloud_cumulus_16", "_cloud_puff_24", "_cloud_stratus_48", "_cloud_cumulus_16"], 7, [0, 30]))
sprite("_clouds_dusk", { w: CW, h: 64 }, clearBand(CW, ["_cloud_sunset_48", "_cloud_sunset_32"], 4, [6, 44], 150))
sprite("_clouds_night", { w: CW, h: 64, swap: NIGHT_CLOUD }, clearBand(CW, ["_cloud_night_32"], 3, [0, 24]))
// Tempête : plafond de poussière bosselé, lambeaux bas.
sprite("_clouds_overcast", { w: CW, h: 64, swap: chain(STORM, DUST) }, overcastCeiling(CW, 19))

// ================================================================ 3. mesas (bande de 640 px)

const FW_ = 640
const far = (P) => [
  // mesas et buttes très lointaines, presque couleur du ciel
  ...[["_mountain_mesa_48", 0, 50], ["_mountain_butte_48", 58, 36], ["_mountain_mesa_48", 92, 52], ["_mountain_mesa_red_48", 300, 48],
    ["_mountain_butte_48", 352, 38], ["_mountain_mesa_48", 400, 50], ["_mountain_mesa_red_48", 470, 54], ["_mountain_butte_48", 520, 40],
    ["_mountain_mesa_48", 566, 49]].flatMap(([name, x, y], i) => put(FW_, name, x, y, { swap: FAR2_D[P], ...flipIf(i % 2) })),
  // une butte rouge isolée, plus près
  ...put(FW_, "_mountain_butte_red_48", 310, 32, { swap: FAR_D[P] }),
  ...put(FW_, "_mountain_mesa_red_48", 440, 48, { swap: FAR_D[P], flip: "x" }),
  // la grande mesa
  ...put(FW_, "_mountain_mesa_red_128", 150, 2, { swap: FAR_D[P] }),
  // tempête : la poussière ronge le pied des mesas
  ...(P === "overcast" ? [[130, 34], [176, 40], [214, 30], [262, 38], [330, 42], [470, 40], [540, 36], [20, 42]].flatMap(([x, y], i) =>
    put(FW_, "_cloud_storm_32", x, y, { swap: chain(STORM, DUST), ...flipIf(i % 2) })) : []),
]
for (const P of PERIODS) sprite(`_far_${P}`, { w: FW_, h: 82 }, ...far(P))

// ================================================================ 4. dunes (bande de 960 px)

const HW = 960
// Deux rangées de dunes dessinées en vagues : versant gauche au soleil, versant droit à l'ombre,
// crête claire. Les n entiers des sinus font boucler la bande.
const ridgeBack = wave(HW, 22, [[5, 6, 0.4], [3, 11, 2.1], [1.5, 23, 4]])
const ridgeFront = wave(HW, 33, [[4, 8, 1.7], [2.5, 13, 0.2], [1, 29, 3]])
const duneRow = (top, keys) => (c) => {
  for (let x = 0; x < HW; x++) {
    const t = top(x), rising = top((x + 1) % HW) < t || top(x) < top((x - 1 + HW) % HW) && top((x + 1) % HW) <= t
    const slope = top((x + 2) % HW) - top((x - 2 + HW) % HW)
    for (let y = t; y < 52; y++) {
      const lit = slope < 0 || (slope === 0 && rising)
      c.px(x, y, y === t ? keys.rim : y < t + 2 && lit ? keys.lit : lit ? keys.body : keys.shade)
    }
  }
}
const dunes = () => {
  const r = rng(31)
  const out = [duneRow(ridgeBack, { rim: "Y", lit: "N", body: "N", shade: "n" }), duneRow(ridgeFront, { rim: "Y", lit: "Y", body: "N", shade: "n" })]
  // petits cactus épars au pied des dunes de devant
  for (const [x, n] of [[40, 2], [210, 1], [410, 3], [600, 1], [760, 2], [900, 1]])
    for (let j = 0; j < n; j++) {
      const xx = x + j * 13 + Math.floor(r() * 5)
      out.push(...plant(HW, r() < 0.6 ? "_cactus_saguaro_16" : "_cactus_barrel_16", xx, ridgeFront(xx + 7) + 4 + Math.floor(r() * 2)))
    }
  return out
}
for (const P of PERIODS) sprite(`_mid_${P}`, { w: HW, h: 52, swap: MID_D[P] }, ...dunes())

// ================================================================ 5. sable et cactus (bande de 1280 px)

const PW = 1280
const sandTop = wave(PW, 40, [[3, 3, 1.2], [2.5, 5, 0.3], [1, 11, 2.5]])
// Bosquets de cactus, champs de rochers, une arche, un crâne, une oasis de dattiers.
const NEAR_DECOR = [
  ["_cactus_saguaro_48", 230], ["_cactus_barrel_32", 262], ["_rock_boulder_sand_32", 296],
  ["_cactus_prickly_32", 20], ["_bones_skull_sand_32", 96],
  ["_rock_arch_sand_48", 380], ["_cactus_saguaro_32", 440], ["_cactus_prickly_flowers_32", 470],
  ["_palm_date_48", 600], ["_palm_date_32", 636], ["_palm_young_16", 584], ["_palm_date_48", 662], ["_cactus_barrel_32", 712],
  ["_rock_spire_sand_32", 800], ["_cactus_saguaro_flowers_32", 836], ["_rock_small_16", 870],
  ["_cactus_saguaro_48", 960], ["_cactus_prickly_32", 1000], ["_rock_boulder_sand_32", 1090], ["_cactus_saguaro_32", 1160],
  ["_cactus_barrel_32", 1216],
]
const near = () => [
  field(PW, sandTop, 60, { rim: "Y", lit: "N", body: "N", deep: "n" }),
  // rides de vent dans le sable
  (c) => { for (let x = 0; x < PW; x++) for (const d of [12, 20]) if ((x + d * 3) % 29 < 9) c.px(x, sandTop(x) + d + ((x >> 4) % 2), "n") },
  ...NEAR_DECOR.flatMap(([name, x], i) => plant(PW, name, x, sandTop(x + SIZE[name].w / 2) + 6, flipIf(i % 3 === 1))),
]
for (const P of PERIODS) sprite(`_near_${P}`, { w: PW, h: 60, swap: NEAR_D[P] }, ...near())

// ================================================================ 6. sol (bande de 640 px, ligne de sol à y = 150)

const GW = 640, TOP = 18 // bord du sol dans la bande (132 + 18 = 150)
const sand = (c) => {
  for (let x = 0; x < GW; x++) {
    c.px(x, TOP - 1, "k")
    c.px(x, TOP, "Y")
    for (let y = TOP + 1; y < 48; y++) c.px(x, y, y < TOP + 3 ? "N" : y < TOP + 14 ? "N" : "n")
  }
  // rides de vent (tirets décalés), couche de sable plus sombre, terre craquelée en bas
  for (let x = 0; x < GW; x++) {
    for (const [d, m] of [[5, 0], [9, 11], [13, 5]]) if ((x + m * 7) % 23 < 8) c.px(x, TOP + d + ((x + m) % 46 < 23 ? 0 : 1), "n")
    if ((x * 7) % 11 < 4) c.px(x, TOP + 14, "N")
  }
  const crack = wave(GW, TOP + 22, [[2, 4, 0.8], [1, 9, 2]])
  for (let x = 0; x < GW; x++) { c.px(x, crack(x), "b"); if (x % 17 === 4) for (let y = crack(x) + 1; y < 48; y++) c.px(x + (y % 3 === 0 ? 1 : 0), y, "b") }
  for (const [x, y] of [[50, 31], [170, 35], [290, 30], [400, 34], [520, 32], [610, 36]]) {
    c.ellipse(x, y, 2, 1, "b"); c.px(x - 1, y - 1, "N")
  }
}
// Petit décor bas (16 px) espacé, pour garder le personnage lisible.
const GROUND_DECOR = [
  ["_grass_tuft_dry_16", 30], ["_rock_pebbles_16", 84], ["_cactus_barrel_flowers_16", 150], ["_bones_bone_16", 212],
  ["_tumbleweed_dry_16", 262], ["_cactus_prickly_16", 330], ["_rock_small_16", 392], ["_bones_skull_16", 452],
  ["_grass_tuft_dry_16", 500], ["_cactus_barrel_16", 556], ["_rock_pebbles_16", 606],
]
const ground = () => [sand, ...GROUND_DECOR.flatMap(([name, x]) => plant(GW, name, x, TOP + 2))]
for (const P of PERIODS) sprite(`_ground_${P}`, { w: GW, h: 48, swap: NEAR_D[P] }, ...ground())

// Acteurs et sprites d'effets, recolorés par période.
const DRY_WIND = { G: "b", g: "n", l: "N", L: "Y" }
periodActor("tuft", "_grass_tuft_wind_16", byPeriod((P) => chain(DRY_WIND, NEAR_D[P])))
periodActor("roll", "_tumbleweed_roll_16", NEAR_D)
periodActor("rollnear", "_tumbleweed_roll_16", MID_D)
periodActor("scorpion", "_scorpion_sand_walk_16", byPeriod((P) => P === "night" ? { ...NEAR_D.night, N: "T", n: "t", b: "J", B: "j" } : NEAR_D[P]))
meta.scene.planes.find((p) => p.id === "ground").actors = actorsAt("tuft", [110, 186, 290, 366, 426, 530, 584], TOP + 2 - 11)

// ================================================================ 7. premier plan (devant le personnage, coupé par le bas)

const FRW = 960
const FRONT_DECOR = [["_cactus_saguaro_48", 60, 2], ["_grass_tall_dry_32", 330, 8], ["_cactus_prickly_32", 560, 10], ["_grass_tall_dry_32", 760, 9], ["_cactus_barrel_32", 860, 12]]
for (const P of PERIODS)
  sprite(`_front_${P}`, { w: FRW, h: 30, swap: FRONT_D[P] }, ...FRONT_DECOR.flatMap(([name, x, y], i) => put(FRW, name, x, y, flipIf(i % 2))))
