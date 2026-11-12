include("../_palette.px.js")
include("_kit.px.js")
include("_topdown.px.js")

const meta = {
  title: "Lisière du champ de blé",
  description: "Scène statique 16:9 (base 320 × 180) vue de dessus en 3/4, façon RPG : en haut, un champ de blé mûr semé de coquelicots, fermé par une clôture de bois ouverte au milieu sur un chemin de terre ; à droite, un grand chêne et son ombre ; à gauche, une haie fleurie et des tournesols le long de la clôture. Le centre et le bas de l'écran restent un pré dégagé pour un personnage (ligne des pieds conseillée y = 140) ; hautes herbes et buissons du premier plan passent devant lui. Animations : vagues de vent qui courent sur le blé, herbe au vent, papillons, grandes ombres de nuages, pollen et oiseaux le jour ; poussière dorée au crépuscule ; lucioles la nuit ; vent fort par temps sombre.",
  tags: ["scene", "static", "top-down", "rpg", "wheat", "field", "farm", "fence", "oak", "meadow", "summer", "day-night", "arena"],
  variants: {
    day: { label: "Jour", props: { period: "day" }, tags: ["butterflies", "cloud-shadows", "pollen", "birds", "wind"] },
    dusk: { label: "Crépuscule", props: { period: "dusk" }, tags: ["sunset", "evening", "dust"] },
    night: { label: "Nuit", props: { period: "night" }, tags: ["moonlight", "fireflies"] },
    overcast: { label: "Sombre", props: { period: "overcast" }, tags: ["dark", "wind", "cloudy"] },
  },
  scene: {
    type: "static",
    w: 320, h: 180, groundY: 140,
    periods: PERIOD_LABELS,
    defaultPeriod: "day",
    planes: [
      { id: "backdrop", label: "Bords (vue élargie)", kind: "sky", factor: 0, y: -60, image: "_backdrop_{period}" },
      { id: "ground", label: "Champ et pré", factor: 0, y: 0, image: "_ground_{period}" },
      { id: "front", label: "Premier plan", factor: 0, y: 0, front: true, optional: true, image: "_front_{period}" },
    ],
    sprites: {
      grass: "_act_grass_{period}", tall: "_act_tall_{period}", wave: "_act_wave_{period}",
      bfly_white: "_butterfly_white_8", bfly_yellow: "_butterfly_yellow_8", bfly_monarch: "_butterfly_monarch_8",
      glow: "_firefly_glow_8", glow_amber: "_firefly_glow_amber_8",
      bird: "_bird_far_8",
      cloud_a: "_cloudshadow_a", cloud_b: "_cloudshadow_b",
      pollen: "_mote_pollen", fluff: "_mote_fluff", gold: "_mote_gold",
    },
    effects: {
      day: [
        { type: "butterflies", sprites: ["bfly_white", "bfly_yellow", "bfly_monarch"], plane: "ground", count: 6, anchors: [], after: "ground" },
        { type: "motes", sprites: ["pollen", "pollen", "fluff"], count: 14, area: [0, 20, 320, 160], wind: [4, 9], after: "front" },
        { type: "shadows", sprites: ["cloud_a", "cloud_b"], count: 2, every: [9000, 16000], speed: [6, 10], alpha: 0.16, y: [-60, 120], after: "front" },
        { type: "birds", sprite: "bird", every: [14000, 26000], count: [3, 6], y: [6, 50], speed: [18, 26], factor: 0, after: "front" },
      ],
      dusk: [
        { type: "motes", sprites: ["gold"], count: 22, area: [0, 10, 320, 170], wind: [1, 4], fall: [-2, 1], after: "front" },
        { type: "birds", sprite: "bird", every: [10000, 20000], count: [4, 7], y: [6, 40], speed: [16, 22], factor: 0, after: "front" },
      ],
      night: [
        { type: "fireflies", sprites: ["glow", "glow", "glow_amber"], plane: "ground", count: 18, area: [0, 50, 320, 120], front: 0.3, after: "ground" },
      ],
      overcast: [
        { type: "motes", sprites: ["fluff"], count: 8, area: [0, 20, 320, 160], wind: [14, 24], fall: [0, 3], after: "front" },
      ],
    },
    speed: { overcast: 2 },
  },
}

// ================================================================ sélection d'assets

imp("nature/tree", ["oak_summer_48", "oak_summer_full_32", "apple_32"])
imp("nature/bush", ["hedge_flowering_48", "round_32", "berry_32", "round_16", "flowering_32"])
imp("nature/rock", ["boulder_mossy_32", "small_16", "pebbles_16"])
imp("nature/grass", ["tuft_16", "tuft_flowers_16", "tuft_wind_16", "tall_wind_32", "clover_16"])
imp("nature/flower", ["sunflower_32", "daisy_16", "poppy_16", "bed_32", "tulip_red_16", "lavender_16"])
imp("fauna/butterfly", ["white_8", "yellow_8", "monarch_8"])
imp("fauna/firefly", ["glow_8", "glow_amber_8"])
imp("fauna/bird", ["far_8"])

cloudShadow("_cloudshadow_a", 130, 52, 4)
cloudShadow("_cloudshadow_b", 96, 40, 12)

// ================================================================ le champ de blé

const FIELD_H = 54   // bas du champ (frange des tiges)
// Épis vus de dessus, en rangs (4 px entre rangs, un épi tous les 3 px environ, décalé au hasard
// mais toujours au même endroit) : pointe claire au soleil, ombre en bas à droite.
const hash = (x, y) => ((x * 73856093) ^ (y * 19349663)) >>> 0
const ear = (x, y) => y % 4 === (hash(x >> 1, y >> 2) % 7 === 0 ? 1 : 0) && (x + (y >> 2) * 2 + (hash(x, y >> 2) % 3 === 0 ? 1 : 0)) % 3 === 0
// oy : rangs de blé en plus au-dessus (bords de l'écran quand la vue est plus haute).
const wheatField = (W = SW, poppies = 22, oy = 0) => (c) => {
  const FH = FIELD_H + oy
  c.rect(0, 0, W, FH, "y")
  for (let y = 0; y < FH - 4; y++)
    for (let x = 0; x < W; x++) if (ear(x, y)) { c.px(x, y, "Y"); c.px(x + 1, y + 1, "o") }
  // sillons : un rang sur six est plus sombre
  for (let y = 11; y < FH - 6; y += 12) for (let x = 0; x < W; x++) if (c.is(x, y, "y")) c.px(x, y, "o")
  // coquelicots dans le blé
  const R = rng(41)
  for (let i = 0; i < poppies; i++) {
    const x = Math.floor(R() * W), y = 2 + Math.floor(R() * (FH - 10))
    c.px(x, y, "r"); c.px(x + 1, y, "r"); c.px(x, y + 1, "R"); c.px(x + 1, y + 1, "r"); c.px(x, y - 1, "z")
  }
  // frange : tiges debout au bord du champ (vues de face), épis en haut
  for (let x = 0; x < W; x++) {
    const h = 5 + ((x * 5) % 3)
    for (let y = FH - h; y < FH; y++) c.px(x, y, x % 2 ? "n" : "N")
    c.px(x, FH - h - 1, x % 3 ? "y" : "Y")
    c.px(x, FH, "b")
  }
}
// Vague de vent : une bande d'épis plus clairs qui traverse une tuile de 30 × 12.
localAnim("_wave", { w: 30, h: 12, frames: 8, fps: 8 }, (c) => {
  const band = Math.floor(c.phase * 46) - 8
  for (let y = 0; y < 12; y++)
    for (let x = 0; x < 30; x++) {
      const d = x - band - (y >> 1)
      if (ear(x, y) && d >= 0 && d < 7) { c.px(x, y, "w"); c.px(x + 1, y + 1, d < 4 ? "Y" : "y"); c.px(x, y + 1, "Y") }
    }
})

// ================================================================ clôture

const GATE = [146, 182]   // ouverture de la clôture (x)
// Clôture de bois : poteaux tous les 14 px, deux lisses. Dessinée avec un contour.
const fenceRun = (name, len) => sprite(name, { w: len, h: 12, outline: "k" }, (c) => {
  for (const y of [3, 7]) { c.hline(0, y, len, "n"); c.hline(0, y + 1, len, "b") }
  for (let x = 1; x < len - 1; x += 14) { c.rect(x, 0, 3, 12, "n"); c.vline(x, 0, 12, "N"); c.vline(x + 2, 1, 11, "b"); c.hline(x, 0, 3, "N") }
  c.rect(len - 3, 0, 3, 12, "n"); c.vline(len - 3, 0, 12, "N"); c.vline(len - 1, 1, 11, "b"); c.hline(len - 3, 0, 3, "N")
})
fenceRun("_fence_left", GATE[0] + 1)
fenceRun("_fence_right", SW - GATE[1] + 1)
SIZE._fence_left = { w: GATE[0] + 3, h: 14 }
SIZE._fence_right = { w: SW - GATE[1] + 3, h: 14 }

// ================================================================ composition

const PATH = [[138, 186], [148, 156], [160, 124], [164, 90], [164, 62], [164, 40], [164, 0]]

const FENCE_Y = FIELD_H + 12
const DECOR = [
  prop("_fence_left", -2, FENCE_Y, { shadow: [0, 0, 80, 2] }), prop("_fence_right", GATE[1] - 1, FENCE_Y, { shadow: [0, 0, 70, 2] }),
  // tournesols et haie le long de la clôture, à gauche
  prop("_flower_sunflower_32", 30, FENCE_Y + 4), prop("_flower_sunflower_32", 52, FENCE_Y + 2), prop("_flower_sunflower_32", 76, FENCE_Y + 5),
  prop("_bush_hedge_flowering_48", -14, 96), prop("_bush_round_32", 100, FENCE_Y + 8), prop("_flower_lavender_16", 122, FENCE_Y + 6),
  // le grand chêne et son ombre, à droite
  prop("_tree_oak_summer_48", 238, 116, { shadow: [6, -2, 30, 9] }), prop("_tree_oak_summer_full_32", 286, 94),
  prop("_tree_apple_32", 196, FENCE_Y + 10, { flip: true }), prop("_rock_boulder_mossy_32", 288, 130),
  prop("_rock_pebbles_16", 226, 122),
  // fleurs au bord du pré
  prop("_flower_bed_32", 30, 122), prop("_flower_poppy_16", 70, 108), prop("_flower_daisy_16", 84, 132),
  prop("_flower_tulip_red_16", 22, 150), prop("_grass_clover_16", 60, 160), prop("_grass_tuft_flowers_16", 94, 96),
  prop("_flower_daisy_16", 226, 146), prop("_flower_poppy_16", 252, 156), prop("_grass_tuft_16", 214, 134),
  prop("_rock_small_16", 104, 160), prop("_rock_pebbles_16", 190, 96), prop("_grass_clover_16", 208, 160),
]

const ground = () => [
  grassGround(29, { clumps: 90 }),
  wheatField(),
  dirtPath(PATH, 6, 9),
  ...props(DECOR),
]
for (const P of PERIODS) sprite(`_ground_${P}`, { w: SW, h: SH, swap: TD[P] }, ...ground())
// Bords de l'écran (vue plus large que 320 × 180) : le champ et la clôture continuent.
const fenceTile = (y0) => (c) => {
  for (const y of [3, 7]) { c.hline(0, y0 + y - 1, 14, "k"); c.hline(0, y0 + y, 14, "n"); c.hline(0, y0 + y + 1, 14, "b"); c.hline(0, y0 + y + 2, 14, "k") }
  c.rect(5, y0 - 1, 5, 14, "k"); c.rect(6, y0, 3, 12, "n"); c.vline(6, y0, 12, "N"); c.vline(8, y0 + 1, 11, "b"); c.hline(6, y0, 3, "N")
}
// Tuile de 14 × 240 posée à y = -60 : couvre aussi le haut d'une vue plus haute (écran 16:10).
const BY = 60
for (const P of PERIODS) sprite(`_backdrop_${P}`, { w: 14, h: SH + BY, swap: TD[P] },
  grassGround(4, { w: 14, h: SH + BY, clumps: 18 }), wheatField(14, 0, BY), fenceTile(BY + FENCE_Y - 13))

const FRONT_PROPS = [
  prop("_bush_berry_32", -10, 188), prop("_bush_round_16", 22, 184), prop("_bush_flowering_32", 296, 190, { flip: true }),
]
for (const P of PERIODS) sprite(`_front_${P}`, { w: SW, h: SH, swap: TD[P] }, ...FRONT_PROPS.map((p) => stamp(p.name, p.x, p.base - SIZE[p.name].h, flipIf(p.flip))))

// ================================================================ acteurs

periodActor("grass", "_grass_tuft_wind_16", TD)
periodActor("tall", "_grass_tall_wind_32", TD)
periodActor("wave", "_wave", TD)

// Les vagues de vent : une tuile tous les 30 px, décalées pour que la vague traverse le champ en diagonale.
const waves = []
for (let y = 0; y < FIELD_H - 10; y += 12)
  for (let x = 0; x < SW; x += 30) {
    if (x + 30 > 157 && x < 172) continue // pas sur le chemin
    waves.push({ sprite: "wave", x, y, phase: (2000 - ((x / 30) * 1000 + y * 40) % 2000) % 1000 })
  }
meta.scene.planes.find((p) => p.id === "ground").actors = [
  ...waves,
  ...[[48, 140], [116, 112], [204, 120], [270, 150], [80, 160]].map(([x, y], i) => ({ sprite: "grass", x, y, phase: i * 337 % 800, ...(i % 2 ? { flip: true } : {}) })),
]
meta.scene.planes.find((p) => p.id === "front").actors = [
  { sprite: "tall", x: 44, y: 156, phase: 0 }, { sprite: "tall", x: 256, y: 158, phase: 400, flip: true },
]
meta.scene.effects.day[0].anchors = DECOR.filter((p) => p.name.startsWith("_flower") || p.name.startsWith("_bush_hedge"))
  .map((p) => [p.x + Math.round(SIZE[p.name].w / 2), p.base - 14])
