include("../_palette.px.js")
include("_kit.px.js")
include("_topdown.px.js")

const meta = {
  title: "Gué du ruisseau",
  description: "Scène statique 16:9 (base 320 × 180) vue de dessus en 3/4, façon RPG : un ruisseau d'été traverse le haut de l'écran de gauche à droite, sorti d'une petite cascade au pied d'un rocher moussu ; un chemin de terre le franchit sur des pierres de gué. Au-delà, la rive boisée ; en deçà, une prairie fleurie bordée d'arbres. Le centre et le bas de l'écran restent dégagés pour un personnage (ligne des pieds conseillée y = 140) ; hautes herbes et buissons du premier plan passent devant lui. Animations : courant qui file, écume autour des pierres et au pied de la cascade, éclats de soleil, herbe au vent, papillons, ombres de nuages, aigrettes et oiseaux le jour ; poussière dorée au crépuscule ; lucioles au-dessus de l'eau la nuit ; vent fort par temps sombre.",
  tags: ["scene", "static", "top-down", "rpg", "stream", "brook", "river", "ford", "waterfall", "meadow", "summer", "day-night", "arena"],
  variants: {
    day: { label: "Jour", props: { period: "day" }, tags: ["butterflies", "cloud-shadows", "pollen", "birds", "water"] },
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
      { id: "backdrop", label: "Bords (vue élargie)", kind: "sky", factor: 0, y: 0, image: "_backdrop_{period}" },
      { id: "ground", label: "Ruisseau et prairie", factor: 0, y: 0, image: "_ground_{period}" },
      { id: "front", label: "Premier plan", factor: 0, y: 0, front: true, optional: true, image: "_front_{period}" },
    ],
    sprites: {
      grass: "_act_grass_{period}", tall: "_act_tall_{period}",
      current: "_act_current_{period}", current_b: "_act_current_b_{period}", foam: "_act_foam_{period}",
      fall: "_act_fall_{period}", glint: "_act_glint_{period}",
      bfly_white: "_butterfly_white_8", bfly_yellow: "_butterfly_yellow_8", bfly_blue: "_butterfly_blue_8",
      glow: "_firefly_glow_8", glow_blue: "_firefly_glow_blue_8",
      bird: "_bird_far_8",
      cloud_a: "_cloudshadow_a", cloud_b: "_cloudshadow_b",
      pollen: "_mote_pollen", fluff: "_mote_fluff", gold: "_mote_gold",
    },
    effects: {
      day: [
        { type: "butterflies", sprites: ["bfly_white", "bfly_yellow", "bfly_blue"], plane: "ground", count: 5, anchors: [], after: "ground" },
        { type: "motes", sprites: ["fluff", "pollen", "pollen"], count: 12, area: [0, 30, 320, 150], wind: [4, 9], after: "front" },
        { type: "shadows", sprites: ["cloud_a", "cloud_b"], count: 1, every: [12000, 22000], speed: [5, 8], alpha: 0.16, y: [-60, 120], after: "front" },
        { type: "birds", sprite: "bird", every: [16000, 30000], count: [2, 4], y: [6, 40], speed: [18, 26], factor: 0, after: "front" },
      ],
      dusk: [
        { type: "motes", sprites: ["gold"], count: 18, area: [0, 30, 320, 150], wind: [1, 4], fall: [-2, 1], after: "front" },
        { type: "birds", sprite: "bird", every: [12000, 24000], count: [3, 5], y: [6, 40], speed: [16, 22], factor: 0, after: "front" },
      ],
      night: [
        { type: "fireflies", sprites: ["glow", "glow", "glow_blue"], plane: "ground", count: 18, area: [0, 36, 320, 120], front: 0.3, after: "ground" },
      ],
      overcast: [
        { type: "motes", sprites: ["fluff"], count: 6, area: [0, 20, 320, 160], wind: [14, 24], fall: [0, 3], after: "front" },
      ],
    },
    speed: { overcast: 2 },
  },
}

// ================================================================ sélection d'assets

imp("nature/tree", ["oak_summer_48", "pine_48", "birch_32", "apple_32", "oak_summer_full_32", "oak_summer_sparse_32"])
imp("nature/bush", ["round_32", "berry_32", "round_16", "berry_16", "flowering_32"])
imp("nature/rock", ["crag_mossy_48", "boulder_mossy_32", "small_16", "small_mossy_16", "pebbles_16"])
imp("nature/grass", ["tuft_16", "tuft_flowers_16", "tuft_wind_16", "tall_wind_32", "clover_16", "reeds_32"])
imp("nature/flower", ["daisy_16", "poppy_16", "bluebell_16", "lavender_16", "bed_32"])
imp("nature/fern", ["large_32", "small_16", "young_16"])
imp("nature/mushroom", ["chanterelle_16"])
imp("fauna/butterfly", ["white_8", "yellow_8", "blue_8"])
imp("fauna/firefly", ["glow_8", "glow_blue_8"])
imp("fauna/bird", ["far_8"])

cloudShadow("_cloudshadow_a", 110, 46, 5)
cloudShadow("_cloudshadow_b", 80, 34, 9)

// ================================================================ le ruisseau

// Bord du fond (haut) et largeur de l'eau en fonction de x.
const top = (x) => Math.round(44 + 4 * Math.sin(x / 46 + 0.6) + 2 * Math.sin(x / 19))
const wide = (x) => Math.round(15 + 3 * Math.sin(x / 37 + 2))
const mid = (x) => top(x) + 3 + Math.round(wide(x) / 2)

const brook = (W = SW, topOf = top, wideOf = wide) => (c) => {
  for (let x = 0; x < W; x++) {
    const t = topOf(x), b = t + 3 + wideOf(x)
    c.px(x, t - 1, "l")                                   // rebord d'herbe au soleil
    c.px(x, t, "n"); c.px(x, t + 1, "b"); c.px(x, t + 2, "B")   // berge du fond (paroi de terre)
    for (let y = t + 3; y < b; y++) c.px(x, y, y < t + 5 ? "U" : y > b - 5 ? "i" : "u")
    c.px(x, b, "b"); c.px(x, b + 1, "g")                  // vase sur la rive proche
  }
  // reflets fixes
  const R = rng(31)
  for (let i = 0; i < (W === SW ? 26 : 0); i++) {
    const x = Math.floor(R() * SW), y = mid(x) + Math.floor((R() - 0.3) * 5)
    if (c.is(x, y, "u") && c.is(x + 3, y, "u")) c.hline(x, y, 2 + Math.floor(R() * 3), "i")
  }
}

// Pierres de gué (vues de dessus : dessus clair, flanc sombre vers le bas).
const STONES = [[150, 0], [161, -3], [172, 1], [183, -2]]
const ford = () => STONES.flatMap(([x, dy]) => {
  const y = mid(x) + dy
  return [ellipse(x, y + 1, 5, 3, "k"), ellipse(x, y + 1, 4, 2, "m"), ellipse(x, y, 4, 2, "c"), ellipse(x - 1, y - 1, 2, 1, "C")]
})

// Animations de l'eau : courant (traits clairs qui filent), écume autour des pierres, cascade.
localAnim("_current", { w: 24, h: 3, frames: 6, fps: 6 }, (c) => {
  const s = Math.floor(c.phase * 24)
  for (const [x0, y, n, k] of [[0, 0, 4, "I"], [11, 2, 3, "i"], [17, 1, 2, "I"]])
    for (let i = 0; i < n; i++) c.px((x0 + s + i) % 24, y, k)
})
localAnim("_current_b", { w: 24, h: 3, frames: 6, fps: 6 }, (c) => {
  const s = Math.floor(c.phase * 24)
  for (const [x0, y, n, k] of [[3, 1, 3, "i"], [13, 0, 4, "I"]])
    for (let i = 0; i < n; i++) c.px((x0 + s + i) % 24, y, k)
})
localAnim("_foam", { w: 9, h: 6, frames: 4, fps: 6 }, (c) => {
  const f = c.frame
  c.px(1 + (f % 2), 2, "w"); c.px(0, 3, "I"); c.px(2, 4 - (f % 2), "I")
  c.px(6 + (f % 3), 1 + (f % 2), "I"); c.px(7, 4, f % 2 ? "w" : "I"); c.px(4 + f, 5, "i")
})
localAnim("_fall", { w: 12, h: 12, frames: 4, fps: 8 }, (c) => {
  const f = c.frame
  for (let x = 2; x < 9; x++) for (let y = 0; y < 8; y++) c.px(x, y, (y + f + x * 2) % 4 === 0 ? "w" : (y + f + x) % 3 ? "I" : "i")
  for (const [x, y] of [[1, 8], [4, 9], [7, 8], [9, 9], [2, 10], [6, 10], [10, 7]]) if ((x + f) % 2) c.px(x, y, "w"); else c.px(x, y, "I")
})
glint("_glint", 1400)

// ================================================================ composition

const PATH_S = [[136, 186], [146, 158], [158, 124], [164, 96], [166, mid(166) + 8]]
const PATH_N = [[170, top(170) - 1], [176, 26], [178, 0]]

const FAR_BANK = [
  prop("_tree_pine_48", -14, 34), prop("_tree_oak_summer_48", 20, 38), prop("_tree_birch_32", 58, 40),
  prop("_tree_pine_48", 82, 32), prop("_tree_oak_summer_48", 112, 38), prop("_bush_round_32", 146, 40),
  prop("_tree_birch_32", 198, 40, { flip: true }), prop("_tree_oak_summer_48", 222, 36, { flip: true }),
  prop("_tree_pine_48", 258, 32), prop("_tree_oak_summer_48", 286, 38),
  prop("_fern_small_16", 188, 41), prop("_grass_tuft_16", 70, 42), prop("_mushroom_chanterelle_16", 104, 41),
]
const NEAR_BANK = [
  prop("_grass_reeds_32", 30, top(40) + wide(40) + 8), prop("_grass_reeds_32", 236, top(246) + wide(246) + 8, { flip: true }),
  prop("_grass_reeds_32", 296, top(306) + wide(306) + 7),
  prop("_rock_small_mossy_16", 120, top(128) + wide(128) + 9), prop("_rock_pebbles_16", 196, top(204) + wide(204) + 8),
  prop("_fern_young_16", 268, top(276) + wide(276) + 9),
]
const MEADOW = [
  // bords gauche et droit
  prop("_tree_birch_32", -6, 104), prop("_tree_apple_32", 290, 112, { flip: true }), prop("_bush_berry_32", 18, 124),
  prop("_tree_oak_summer_sparse_32", 258, 92), prop("_bush_round_16", 66, 94), prop("_bush_flowering_32", 242, 136),
  prop("_fern_large_32", -4, 150),
  // fleurs en bordure
  prop("_flower_bed_32", 66, 120), prop("_flower_daisy_16", 98, 106), prop("_flower_lavender_16", 50, 140),
  prop("_flower_poppy_16", 86, 150), prop("_grass_clover_16", 98, 160), prop("_flower_bluebell_16", 226, 102),
  prop("_flower_daisy_16", 214, 122), prop("_grass_tuft_flowers_16", 228, 150), prop("_flower_poppy_16", 282, 146),
  prop("_grass_tuft_16", 112, 86), prop("_grass_clover_16", 200, 92), prop("_rock_small_16", 268, 158),
]

const ground = () => [
  grassGround(23, { clumps: 90 }),
  rect(0, 0, SW, 12, "G"),
  dirtPath(PATH_S, 6, 7),
  dirtPath(PATH_N, 5, 8),
  brook(),
  ...ford(),
  ...props([...FAR_BANK, ...NEAR_BANK, ...MEADOW]),
  // cascade : le ruisseau sort du pied d'un rocher moussu, à gauche
  stamp("_rock_crag_mossy_48", -22, top(0) - 26),
]
for (const P of PERIODS) sprite(`_ground_${P}`, { w: SW, h: SH, swap: NEAR_W[P] }, ...ground())
// Bords de l'écran (vue plus large que 320 × 180) : le ruisseau continue.
for (const P of PERIODS) sprite(`_backdrop_${P}`, { w: 16, h: SH, swap: NEAR_W[P] },
  grassGround(4, { w: 16, clumps: 14 }), rect(0, 0, 16, 12, "G"), brook(16, () => 46, () => 14))

const FRONT_PROPS = [
  prop("_bush_round_32", -10, 188), prop("_bush_berry_16", 20, 184), prop("_fern_large_32", 296, 190, { flip: true }),
  prop("_bush_round_16", 280, 186),
]
for (const P of PERIODS) sprite(`_front_${P}`, { w: SW, h: SH, swap: TD[P] }, ...FRONT_PROPS.map((p) => stamp(p.name, p.x, p.base - SIZE[p.name].h, flipIf(p.flip))))

// ================================================================ acteurs

periodActor("grass", "_grass_tuft_wind_16", TD)
periodActor("tall", "_grass_tall_wind_32", TD)
for (const n of ["current", "current_b", "foam", "fall", "glint"]) periodActor(n, `_${n}`, NEAR_W)

meta.scene.planes.find((p) => p.id === "ground").actors = [
  // courant : deux rangées décalées sur toute la longueur
  ...Array.from({ length: 14 }, (_, i) => {
    const x = i * 24 - 4
    return { sprite: i % 2 ? "current_b" : "current", x, y: mid(x + 12) - 2 + (i % 3), phase: (i * 233) % 1000 }
  }),
  ...STONES.map(([x, dy], i) => ({ sprite: "foam", x: x - 10, y: mid(x) + dy - 3, phase: i * 170 })),
  { sprite: "fall", x: 8, y: top(8) - 4, phase: 0 },
  { sprite: "foam", x: 16, y: top(16) + 4, phase: 300 },
  { sprite: "glint", x: 90, y: mid(92) - 2, phase: 0 }, { sprite: "glint", x: 214, y: mid(216), phase: 600 },
  { sprite: "glint", x: 270, y: mid(272) - 1, phase: 1100 },
  ...[[50, 150], [118, 136], [212, 138], [262, 128], [76, 108]].map(([x, y], i) => ({ sprite: "grass", x, y, phase: i * 337 % 800, ...(i % 2 ? { flip: true } : {}) })),
]
meta.scene.planes.find((p) => p.id === "front").actors = [
  { sprite: "tall", x: 44, y: 156, phase: 0 }, { sprite: "tall", x: 252, y: 158, phase: 400, flip: true },
]
meta.scene.effects.day[0].anchors = MEADOW.filter((p) => p.name.startsWith("_flower") || p.name === "_bush_flowering_32")
  .map((p) => [p.x + Math.round(SIZE[p.name].w / 2), p.base - 14])
