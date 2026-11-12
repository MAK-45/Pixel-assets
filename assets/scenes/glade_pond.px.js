include("../_palette.px.js")
include("_kit.px.js")
include("_topdown.px.js")

const meta = {
  title: "Clairière de la mare",
  description: "Scène statique 16:9 (base 320 × 180) vue de dessus en 3/4, façon RPG : une clairière d'été bordée par la lisière d'une forêt (chênes, sapins, bouleau), une mare aux nénuphars et aux roseaux en haut à droite, un chemin de terre qui monte vers la forêt. Le centre et le bas de l'écran restent dégagés pour un personnage (ligne des pieds conseillée y = 140) ; buissons et hautes herbes du premier plan passent devant lui. Animations : herbe au vent, ronds dans l'eau, éclats de soleil, poisson qui saute, papillons, ombres de nuages, pollen et oiseaux le jour ; poussière dorée et ronds dans l'eau au crépuscule ; lucioles la nuit ; vent fort par temps sombre.",
  tags: ["scene", "static", "top-down", "rpg", "glade", "pond", "forest", "meadow", "summer", "day-night", "arena"],
  variants: {
    day: { label: "Jour", props: { period: "day" }, tags: ["butterflies", "cloud-shadows", "pollen", "birds", "fish"] },
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
      { id: "ground", label: "Clairière", factor: 0, y: 0, image: "_ground_{period}" },
      { id: "front", label: "Premier plan", factor: 0, y: 0, front: true, optional: true, image: "_front_{period}" },
    ],
    sprites: {
      grass: "_act_grass_{period}", tall: "_act_tall_{period}",
      ripple: "_act_ripple_{period}", ripple_slow: "_act_ripple_slow_{period}", glint: "_act_glint_{period}", fish: "_act_fish_{period}",
      bfly_white: "_butterfly_white_8", bfly_yellow: "_butterfly_yellow_8", bfly_blue: "_butterfly_blue_8", bfly_monarch: "_butterfly_monarch_8",
      glow: "_firefly_glow_8", glow_amber: "_firefly_glow_amber_8",
      bird: "_bird_far_8",
      cloud_a: "_cloudshadow_a", cloud_b: "_cloudshadow_b",
      pollen: "_mote_pollen", fluff: "_mote_fluff", gold: "_mote_gold",
    },
    effects: {
      day: [
        { type: "butterflies", sprites: ["bfly_white", "bfly_yellow", "bfly_blue", "bfly_monarch"], plane: "ground", count: 5, anchors: [], after: "ground" },
        { type: "motes", sprites: ["pollen", "pollen", "fluff"], count: 14, area: [0, 40, 320, 140], wind: [3, 8], after: "front" },
        { type: "shadows", sprites: ["cloud_a", "cloud_b"], count: 1, every: [12000, 22000], speed: [5, 8], alpha: 0.16, y: [-60, 120], after: "front" },
        { type: "birds", sprite: "bird", every: [16000, 30000], count: [2, 4], y: [10, 60], speed: [18, 26], factor: 0, after: "front" },
      ],
      dusk: [
        { type: "motes", sprites: ["gold"], count: 18, area: [0, 30, 320, 150], wind: [1, 4], fall: [-2, 1], after: "front" },
        { type: "birds", sprite: "bird", every: [12000, 24000], count: [3, 5], y: [8, 50], speed: [16, 22], factor: 0, after: "front" },
      ],
      night: [
        { type: "fireflies", sprites: ["glow", "glow", "glow_amber"], plane: "ground", count: 16, area: [0, 50, 320, 120], front: 0.3, after: "ground" },
      ],
      overcast: [
        { type: "motes", sprites: ["fluff"], count: 6, area: [0, 20, 320, 160], wind: [14, 24], fall: [0, 3], after: "front" },
      ],
    },
    speed: { overcast: 2 },
  },
}

// ================================================================ sélection d'assets

imp("nature/tree", ["oak_summer_48", "pine_48", "oak_summer_full_32", "birch_32", "apple_32", "pine_32"])
imp("nature/bush", ["round_32", "berry_32", "flowering_32", "round_16", "berry_16"])
imp("nature/rock", ["boulder_mossy_32", "small_16", "small_mossy_16", "pebbles_16"])
imp("nature/grass", ["tuft_16", "tuft_flowers_16", "tuft_wind_16", "tall_wind_32", "clover_16", "reeds_32"])
imp("nature/flower", ["daisy_16", "poppy_16", "bluebell_16", "tulip_yellow_16"])
imp("nature/mushroom", ["amanita_16", "cluster_16", "bolete_16"])
imp("nature/fern", ["large_32", "small_16"])
imp("fauna/butterfly", ["white_8", "yellow_8", "blue_8", "monarch_8"])
imp("fauna/firefly", ["glow_8", "glow_amber_8"])
imp("fauna/bird", ["far_8"])

cloudShadow("_cloudshadow_a", 110, 46, 3)
cloudShadow("_cloudshadow_b", 80, 34, 8)

// ================================================================ composition

// Zone de jeu laissée libre : centre et bas de l'écran.
const PLAY = (x, y) => x > 104 && x < 222 && y > 92 && y < 172

const POND = { cx: 262, cy: 86, rx: 40, ry: 17 }
const PATH = [[134, 186], [146, 160], [166, 128], [176, 98], [172, 72], [168, 50], [170, 26], [172, 0]]

// Lisière de la forêt (rangée du fond coupée par le haut de l'écran, puis rangée de devant).
const FOREST = [
  prop("_tree_pine_48", -16, 30), prop("_tree_oak_summer_48", 14, 34), prop("_tree_pine_48", 52, 28),
  prop("_tree_oak_summer_48", 84, 36), prop("_tree_pine_48", 118, 30), prop("_tree_birch_32", 140, 42),
  prop("_tree_oak_summer_48", 190, 32, { flip: true }), prop("_tree_pine_48", 226, 28), prop("_tree_oak_summer_48", 258, 34),
  prop("_tree_pine_48", 292, 30),
  // rangée de devant, sur les côtés
  prop("_tree_oak_summer_full_32", -8, 66), prop("_tree_apple_32", 30, 58), prop("_tree_pine_32", 112, 52),
  prop("_tree_birch_32", 200, 52, { flip: true }), prop("_tree_oak_summer_full_32", 300, 62, { flip: true }),
  prop("_tree_pine_48", -20, 104), prop("_bush_round_32", -6, 128),
]
const DECOR = [
  // pied des arbres
  prop("_mushroom_amanita_16", 46, 70), prop("_mushroom_cluster_16", 6, 80), prop("_fern_large_32", 60, 76),
  prop("_bush_berry_32", 92, 60), prop("_fern_small_16", 130, 58), prop("_mushroom_bolete_16", 222, 58),
  prop("_bush_round_16", 150, 56), prop("_bush_round_32", 226, 66, { flip: true }),
  // autour de la mare
  prop("_grass_reeds_32", 214, 92), prop("_grass_reeds_32", 292, 98, { flip: true }), prop("_grass_reeds_32", 302, 84),
  prop("_rock_boulder_mossy_32", 280, 122), prop("_rock_small_mossy_16", 222, 106), prop("_rock_pebbles_16", 246, 112),
  prop("_bush_flowering_32", 288, 150, { flip: true }),
  // fleurs et touffes en bordure de la clairière (jamais dans la zone de jeu)
  prop("_flower_daisy_16", 52, 110), prop("_flower_poppy_16", 66, 102), prop("_flower_daisy_16", 78, 120),
  prop("_flower_bluebell_16", 30, 138), prop("_flower_tulip_yellow_16", 86, 92), prop("_grass_clover_16", 40, 120),
  prop("_grass_tuft_flowers_16", 96, 136), prop("_flower_poppy_16", 236, 136), prop("_flower_daisy_16", 252, 146),
  prop("_grass_tuft_16", 230, 158), prop("_rock_small_16", 72, 150), prop("_grass_clover_16", 248, 128),
  prop("_flower_bluebell_16", 194, 82), prop("_grass_tuft_16", 120, 84),
]

const ground = () => [
  grassGround(17, { clumps: 90 }),
  // sous-bois sombre derrière la lisière
  rect(0, 0, SW, 14, "G"),
  dirtPath(PATH, 6),
  pond(POND.cx, POND.cy, POND.rx, POND.ry),
  ...lilyPad(246, 80), ...lilyPad(252, 84, 2, true), ...lilyPad(282, 92), ...lilyPad(272, 78, 1),
  ...props([...FOREST, ...DECOR]),
]
for (const P of PERIODS) sprite(`_ground_${P}`, { w: SW, h: SH, swap: NEAR_W[P] }, ...ground())

// Bords de l'écran quand la vue est plus large que 320 × 180 : herbe unie.
for (const P of PERIODS) sprite(`_backdrop_${P}`, { w: 16, h: SH, swap: TD[P] }, grassGround(4, { w: 16, clumps: 14 }), rect(0, 0, 16, 14, "G"))

// Premier plan : buissons et fougères coupés par le bas de l'écran, devant le personnage.
const FRONT_PROPS = [
  prop("_bush_berry_32", -10, 186), prop("_fern_large_32", 22, 190), prop("_bush_round_32", 298, 188, { flip: true }),
  prop("_bush_round_16", 272, 184),
]
for (const P of PERIODS) sprite(`_front_${P}`, { w: SW, h: SH, swap: TD[P] }, ...FRONT_PROPS.map((p) => stamp(p.name, p.x, p.base - SIZE[p.name].h, flipIf(p.flip))))

// ================================================================ acteurs

periodActor("grass", "_grass_tuft_wind_16", TD)
periodActor("tall", "_grass_tall_wind_32", TD)
ripple("_ripple", 2600); ripple("_ripple_slow", 4100)
glint("_glint", 1500)
fishJump("_fish", 7300)
periodActor("ripple", "_ripple", NEAR_W)
periodActor("ripple_slow", "_ripple_slow", NEAR_W)
periodActor("glint", "_glint", NEAR_W)
periodActor("fish", "_fish", NEAR_W)

const groundPlane = meta.scene.planes.find((p) => p.id === "ground")
groundPlane.actors = [
  ...actorsAt("grass", [36, 100, 212, 262, 58], 0).map((a, i) => ({ ...a, y: [128, 140, 116, 150, 160][i] })),
  { sprite: "ripple", x: 236, y: 84, phase: 0 }, { sprite: "ripple_slow", x: 262, y: 94, phase: 900 },
  { sprite: "ripple", x: 280, y: 80, phase: 1700 },
  { sprite: "glint", x: 244, y: 92, phase: 0 }, { sprite: "glint", x: 270, y: 88, phase: 700 }, { sprite: "glint", x: 256, y: 97, phase: 1300 },
  { sprite: "fish", x: 250, y: 80, phase: 0 },
]
meta.scene.planes.find((p) => p.id === "front").actors = [
  { sprite: "tall", x: 48, y: 156, phase: 0 }, { sprite: "tall", x: 250, y: 158, phase: 400, flip: true },
]
// Papillons au-dessus des fleurs de la clairière.
meta.scene.effects.day[0].anchors = DECOR.filter((p) => p.name.startsWith("_flower") || p.name === "_bush_flowering_32")
  .map((p) => [p.x + Math.round(SIZE[p.name].w / 2), p.base - 14])
