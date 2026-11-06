include("../_palette.px.js")

const meta = {
  title: "Arbre",
  description: "Arbres vus de face pour décors 2D : chêne, sapin, bouleau, pommier. Plusieurs saisons, densités de feuillage et tailles (16, 32, 48 px). Lumière en haut à gauche, contour sombre.",
  tags: ["tree", "plant", "forest", "nature", "decoration", "scenery"],
  variants: {
    oak_summer_16: { label: "Chêne – été (16 px)", props: { species: "oak", season: "summer", foliage: "full" } },
    oak_autumn_16: { label: "Chêne – automne (16 px)", props: { species: "oak", season: "autumn", foliage: "full" } },
    pine_16: { label: "Sapin (16 px)", props: { species: "pine", season: "summer", foliage: "full" } },
    pine_snow_16: { label: "Sapin enneigé (16 px)", props: { species: "pine", season: "winter", foliage: "full" } },

    oak_summer_full_32: { label: "Chêne – été, feuillage dense", props: { species: "oak", season: "summer", foliage: "full" } },
    oak_summer_sparse_32: { label: "Chêne – été, peu de feuilles", props: { species: "oak", season: "summer", foliage: "sparse" } },
    oak_spring_32: { label: "Chêne – printemps en fleurs", props: { species: "oak", season: "spring", foliage: "full" } },
    oak_autumn_32: { label: "Chêne – automne (rouge-orangé)", props: { species: "oak", season: "autumn", foliage: "full" } },
    oak_autumn_sparse_32: { label: "Chêne – fin d'automne, peu de feuilles", props: { species: "oak", season: "autumn", foliage: "sparse" } },
    oak_winter_32: { label: "Chêne – hiver, branches nues enneigées", props: { species: "oak", season: "winter", foliage: "bare" } },
    apple_32: { label: "Pommier avec pommes", props: { species: "apple", season: "summer", foliage: "full" }, tags: ["fruit"] },
    pine_32: { label: "Sapin", props: { species: "pine", season: "summer", foliage: "full" } },
    pine_snow_32: { label: "Sapin enneigé", props: { species: "pine", season: "winter", foliage: "full" }, tags: ["snow"] },
    birch_32: { label: "Bouleau – été", props: { species: "birch", season: "summer", foliage: "full" } },
    birch_autumn_32: { label: "Bouleau – automne doré", props: { species: "birch", season: "autumn", foliage: "full" } },

    oak_summer_48: { label: "Grand chêne – été (48 px)", props: { species: "oak", season: "summer", foliage: "full" } },
    oak_autumn_48: { label: "Grand chêne – automne (48 px)", props: { species: "oak", season: "autumn", foliage: "full" } },
    pine_48: { label: "Grand sapin (48 px)", props: { species: "pine", season: "summer", foliage: "full" } },
    pine_snow_48: { label: "Grand sapin enneigé (48 px)", props: { species: "pine", season: "winter", foliage: "full" }, tags: ["snow"] },
  },
}

// ================================================================ outils communs

// Recolorations de saison (feuillus : G sombre, g moyen, l clair, L reflet).
const AUTUMN = { G: "R", g: "r", l: "o", L: "y" }
const GOLD = { G: "b", g: "o", l: "y", L: "Y" }

// Couronne en « grappes » : chaque grappe (x, y, r) a un bord sombre en bas à droite, un corps moyen,
// une zone claire en haut à gauche et un reflet. Grappes listées du fond vers l'avant.
const LEAF = { d: "G", m: "g", l: "l", h: "L" }
const clumps = (blobs, p = LEAF) => (c) => {
  for (const [x, y, r] of blobs) {
    c.circ(x, y, r, p.d)
    c.circ(x - 1, y - 1, r - 1, p.m)
    if (r >= 3) c.circ(x - 2, y - 2, Math.max(1, r - 3), p.l)
    if (r >= 4) c.px(x - 2, y - 3, p.h)
  }
}

// Tronc évasé : x = centre, top = haut du fût, bottom = sol, w = largeur (paire).
const trunk = (x, top, bottom, w, bark = { d: "B", m: "b", l: "n" }) => [
  poly([x - w / 2 - 2, bottom, x - w / 2, bottom - 3, x - w / 2, top, x + w / 2, top, x + w / 2, bottom - 3, x + w / 2 + 2, bottom], bark.m),
  vline(x + w / 2 - 1, top, bottom - top, bark.d),
  vline(x - w / 2, top, bottom - top - 2, bark.l),
]

// Neige : chaque pixel de `keys` exposé vers le haut devient blanc, celui du dessous bleuté.
const snowCap = (keys) => (c) => {
  const top = []
  for (let y = 0; y < c.h; y++)
    for (let x = 0; x < c.w; x++)
      if (c.is(x, y, keys) && c.is(x, y + 1, keys) && (y === 0 || c.is(x, y - 1, "."))) top.push([x, y])
  for (const [x, y] of top) {
    c.px(x, y, "w")
    if (c.is(x, y + 1, keys) && c.is(x - 1, y, "w.")) c.px(x, y + 1, "s")
  }
}

// Sapin en étages : tiers = [sommetY, baseY, demi-largeur], du haut vers le bas.
// Dessinés du bas vers le haut ; chaque étage a une frange en dents de scie et projette une ombre.
const PINE = { d: "P", m: "p", l: "e", h: "E" }
// snow: true -> neige posée sur le bout des branches de chaque étage et sur la cime.
const pine = (cx, tiers, { snow = false } = {}, p = PINE) => (c) => {
  for (let i = tiers.length - 1; i >= 0; i--) {
    const [ay, by, hw] = tiers[i]
    for (let y = ay; y <= by; y++) {
      const half = Math.round(((y - ay) / Math.max(1, by - ay)) * hw)
      const edge = cx + Math.floor(half / 3) + ((y - ay) % 2)
      for (let x = cx - half; x <= cx + half; x++) c.px(x, y, x > edge ? p.d : p.m)
      c.px(cx - half, y, p.l)
      if (half >= 3 && (y - ay) % 3 === 1) c.px(cx - half + 1, y, p.h)
    }
    for (let x = cx - hw; x <= cx + hw; x += 2) c.px(x, by + 1, x > cx + hw / 3 ? p.d : x === cx - hw ? p.l : p.m)
    if (snow) {
      const lit = (x) => x <= cx + hw / 3
      for (let x = cx - hw; x <= cx + hw; x++) c.px(x, by, lit(x) ? "w" : "s")
      for (let x = cx - hw + 1; x <= cx + hw - 1; x++) if ((x * 7 + by) % 3 === 0) c.px(x, by - 1, lit(x) ? "w" : "s")
      for (let x = cx - hw; x <= cx + hw; x += 2) c.px(x, by + 1, lit(x) ? "s" : "S")
      if (i === 0) { c.px(cx, ay, "w"); c.px(cx, ay + 1, "w"); c.px(cx - 1, ay + 2, "w"); c.px(cx + 1, ay + 2, "s") }
    }
    // ombre de cet étage sur celui du dessous
    if (i < tiers.length - 1)
      for (let x = cx - hw; x <= cx + hw; x++) {
        const y = by + ((x - cx + hw) % 2 === 0 ? 2 : 1)
        if (c.is(x, y, p.m + p.l + p.h)) c.px(x, y, p.d)
        else if (c.is(x, y, p.d)) c.px(x, y, "k")
      }
  }
}

// ================================================================ brosses
sprite("_apple", `
  or
  rR`)
sprite("_blossom_a", "Z")
sprite("_blossom_b", `
  .z.
  zZz
  .z.`)

// ================================================================ 16 px (dessinés à la main)

sprite("tree_oak_summer_16", { outline: "k" }, `
  ....lllgg.....
  ..llLllgggg...
  .lLlllgggggG..
  .llllggggGgGG.
  llllggglggGGGG
  lgggglllgggGGG
  gggggglllgGGGG
  .gGgggggggGGG.
  ..GGGGgGGGGG..
  ....GGbBGG....
  ......nbB.....
  ......nbB.....
  .....nbbBB....
  ....bbb..BB...`)
sprite("tree_oak_autumn_16", { base: "tree_oak_summer_16", swap: AUTUMN })

const PINE16 = [rect(6, 11, 2, 3, "b"), vline(7, 11, 3, "B"), pine(7, [[0, 4, 3], [2, 7, 5], [5, 10, 6]])]
sprite("tree_pine_16", { w: 14, h: 14, outline: "k" }, ...PINE16)
sprite("tree_pine_snow_16", { w: 14, h: 14, outline: "k" }, PINE16[0], PINE16[1], pine(7, [[0, 4, 3], [2, 7, 5], [5, 10, 6]], { snow: true }))

// ================================================================ 32 px

const OAK32 = [
  [15, 5, 5], [9, 7, 5], [21, 7, 5],
  [5, 12, 4], [25, 12, 4], [11, 11, 5], [19, 11, 5],
  [8, 16, 4], [22, 16, 4], [15, 15, 5],
]
// lumière venant d'en haut à gauche : le côté droit perd ses reflets, le bas s'assombrit
const oakLight32 = [
  recolor({ l: "g", L: "l" }, (x, y) => x > 16 || y > 14),
  recolor({ g: "G" }, (x, y) => y > 17 || (x > 23 && y > 9)),
]

sprite("tree_oak_summer_full_32", { w: 30, h: 30, outline: "k" },
  ...trunk(15, 16, 30, 4),
  clumps(OAK32),
  ...oakLight32,
  shade([12, 20, 7, 2], 1), // ombre de la couronne sur le tronc
)

// Squelette de branches commun aux versions clairsemées et nues.
const BRANCHES32 = [
  line(14, 19, 7, 11, "b", 2), line(16, 18, 23, 10, "b", 2), line(15, 17, 15, 6, "b", 2),
  line(7, 11, 4, 6, "b"), line(7, 11, 9, 5, "b"), line(23, 10, 26, 6, "b"), line(23, 10, 20, 5, "b"),
  line(15, 6, 13, 2, "b"), line(15, 6, 17, 1, "b"), line(11, 15, 3, 13, "b"), line(19, 14, 27, 13, "b"),
  line(4, 6, 2, 4, "b"), line(26, 6, 28, 4, "b"),
]
const SPARSE32 = [[5, 6, 3], [25, 6, 3], [15, 3, 3], [10, 5, 2], [20, 4, 2], [3, 12, 2], [27, 12, 2], [9, 10, 2], [21, 9, 2]]

sprite("tree_oak_summer_sparse_32", { w: 30, h: 30, outline: "k" },
  ...BRANCHES32,
  ...trunk(15, 16, 30, 4),
  clumps(SPARSE32),
  recolor({ l: "g", L: "l" }, (x, y) => x > 18),
)

sprite("tree_oak_winter_32", { w: 30, h: 30, outline: "k" },
  ...BRANCHES32,
  line(9, 5, 10, 2, "b"), line(20, 5, 21, 2, "b"), line(3, 13, 1, 11, "b"), line(27, 13, 29, 11, "b"),
  ...trunk(15, 16, 30, 4),
  snowCap("bBn"),
  rect(10, 29, 11, 1, "s"), rect(12, 28, 7, 1, "w"), // neige au pied
)

sprite("tree_oak_autumn_32", { base: "tree_oak_summer_full_32", swap: AUTUMN })
sprite("tree_oak_autumn_sparse_32", { base: "tree_oak_summer_sparse_32", swap: GOLD })

sprite("tree_oak_spring_32", { base: "tree_oak_summer_full_32" },
  scatter("_blossom_*", 2, 1, 28, 20, 16, { on: "gGl", seed: 6 }))

sprite("tree_apple_32", { base: "tree_oak_summer_full_32" },
  scatter("_apple", 3, 3, 26, 17, 8, { on: "gG", seed: 2 }))

const TRUNK_PINE32 = [rect(14, 24, 3, 6, "b"), vline(16, 24, 6, "B"), px(13, 29, "b"), px(17, 29, "B")]
const TIERS32 = [[0, 6, 4], [3, 11, 7], [7, 16, 10], [11, 21, 12], [15, 25, 14]]
sprite("tree_pine_32", { w: 30, h: 30, outline: "k" }, ...TRUNK_PINE32, pine(15, TIERS32))
sprite("tree_pine_snow_32", { w: 30, h: 30, outline: "k" }, ...TRUNK_PINE32, pine(15, TIERS32, { snow: true }),
  rect(9, 29, 13, 1, "s"), rect(11, 28, 9, 1, "w"))

// Bouleau : tronc blanc tacheté, couronne claire et aérée.
const BIRCH_LEAF = { d: "g", m: "l", l: "L", h: "L" }
const BIRCH32 = [[15, 4, 4], [11, 7, 4], [19, 7, 4], [9, 12, 4], [21, 12, 4], [15, 10, 5], [12, 16, 4], [18, 16, 4], [15, 19, 3]]
sprite("tree_birch_32", { w: 30, h: 30, outline: "k" },
  line(14, 14, 10, 9, "C", 1), line(16, 13, 20, 8, "C", 1),
  rect(14, 12, 3, 18, "w"), vline(16, 12, 18, "C"), px(13, 29, "w"), px(17, 29, "C"),
  clumps(BIRCH32, BIRCH_LEAF),
  recolor({ L: "l" }, (x, y) => x > 17 && y > 6),
  recolor({ l: "g" }, (x, y) => y > 18 || (x > 21 && y > 10)),
  // marques noires de l'écorce
  hline(14, 23, 2, "d"), px(16, 25, "d"), hline(15, 27, 2, "d"), px(14, 26, "m"),
)
sprite("tree_birch_autumn_32", { base: "tree_birch_32", swap: { g: "o", l: "y", L: "Y" } })

// ================================================================ 48 px

const OAK48 = [
  [23, 7, 7], [14, 10, 7], [32, 10, 7],
  [7, 18, 6], [39, 18, 6], [17, 16, 7], [29, 16, 7], [23, 13, 5],
  [11, 24, 6], [35, 24, 6], [23, 22, 8], [17, 26, 4], [29, 26, 4],
]
sprite("tree_oak_summer_48", { w: 46, h: 46, outline: "k" },
  ...trunk(23, 26, 46, 6),
  line(22, 30, 16, 26, "b", 2), line(25, 30, 31, 26, "b", 2),
  clumps(OAK48),
  recolor({ l: "g", L: "l" }, (x, y) => x > 26 || y > 21),
  recolor({ g: "G" }, (x, y) => y > 27 || (x > 36 && y > 13)),
  shade([18, 30, 10, 2], 1),
  // fissures de l'écorce
  vline(22, 33, 4, "B"), vline(24, 37, 4, "B"), vline(21, 40, 3, "B"),
)
sprite("tree_oak_autumn_48", { base: "tree_oak_summer_48", swap: AUTUMN })

const TRUNK_PINE48 = [rect(21, 38, 5, 8, "b"), vline(25, 38, 8, "B"), vline(21, 38, 6, "n"), px(20, 45, "b"), px(26, 45, "B")]
const TIERS48 = [[0, 7, 5], [3, 13, 8], [8, 19, 12], [13, 26, 15], [19, 32, 18], [25, 38, 21]]
sprite("tree_pine_48", { w: 46, h: 46, outline: "k" }, ...TRUNK_PINE48, pine(23, TIERS48))
sprite("tree_pine_snow_48", { w: 46, h: 46, outline: "k" }, ...TRUNK_PINE48, pine(23, TIERS48, { snow: true }),
  rect(14, 45, 19, 1, "s"), rect(17, 44, 13, 1, "w"))

sheet("trees", ["tree_*"], { pad: 2 })
