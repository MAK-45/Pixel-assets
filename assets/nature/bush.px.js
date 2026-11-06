include("../_palette.px.js")

const meta = {
  title: "Buisson",
  description: "Buissons posés au sol, vus de face pour décors 2D : buisson rond (16, 32 px), haie taillée (48 px), en versions été, à baies rouges, en fleurs, automne, enneigé et sec sans feuilles. Lumière en haut à gauche, contour sombre.",
  tags: ["bush", "shrub", "plant", "vegetation", "ground", "nature", "decoration", "foliage"],
  variants: {
    round_16: { label: "Petit buisson (16 px)", props: { shape: "round", season: "summer", feature: "plain" } },
    berry_16: { label: "Petit buisson à baies (16 px)", props: { shape: "round", season: "summer", feature: "berries" }, tags: ["berry", "fruit"] },
    autumn_16: { label: "Petit buisson d'automne (16 px)", props: { shape: "round", season: "autumn", feature: "plain" } },
    round_32: { label: "Buisson rond", props: { shape: "round", season: "summer", feature: "plain" } },
    berry_32: { label: "Buisson à baies rouges", props: { shape: "round", season: "summer", feature: "berries" }, tags: ["berry", "fruit"] },
    flowering_32: { label: "Buisson en fleurs (printemps)", props: { shape: "round", season: "spring", feature: "flowers" }, tags: ["flower", "blossom"] },
    autumn_32: { label: "Buisson d'automne", props: { shape: "round", season: "autumn", feature: "plain" } },
    snow_32: { label: "Buisson enneigé", props: { shape: "round", season: "winter", feature: "snow" }, tags: ["snow"] },
    dry_32: { label: "Buisson sec sans feuilles", props: { shape: "round", season: "winter", feature: "bare" }, tags: ["dead", "twigs"] },
    hedge_48: { label: "Haie taillée (48 px)", props: { shape: "hedge", season: "summer", feature: "plain" }, tags: ["hedge", "garden"] },
    hedge_flowering_48: { label: "Haie fleurie (48 px)", props: { shape: "hedge", season: "spring", feature: "flowers" }, tags: ["hedge", "garden", "flower"] },
  },
}

// ================================================================ outils communs

const AUTUMN = { G: "R", g: "r", l: "o", L: "y" }
const LEAF = { d: "G", m: "g", l: "l", h: "L" }

// Feuillage en grappes (x, y, r), du fond vers l'avant : bord sombre en bas à droite,
// corps moyen, zone claire en haut à gauche, reflet.
const clumps = (blobs, p = LEAF) => (c) => {
  for (const [x, y, r] of blobs) {
    c.circ(x, y, r, p.d)
    c.circ(x - 1, y - 1, r - 1, p.m)
    if (r >= 3) c.circ(x - 2, y - 2, Math.max(1, r - 3), p.l)
    if (r >= 4) c.px(x - 2, y - 3, p.h)
  }
}

// Neige posée sur tout pixel de `keys` exposé vers le haut.
const snowCap = (keys) => (c) => {
  const top = []
  for (let x = 0; x < c.w; x++)
    for (let y = 0; y < c.h; y++) if (c.is(x, y, keys)) { top.push([x, y]); break }
  for (const [x, y] of top) {
    const lit = x < c.w * 0.6
    c.px(x, y, "w")
    if (c.is(x, y + 1, keys)) c.px(x, y + 1, lit ? "w" : "s")
    if (c.is(x, y + 2, keys)) c.px(x, y + 2, lit ? "s" : "S")
  }
}

sprite("_berry", `
  or
  rR`)
sprite("_berry_pair", `
  or.
  rRo
  .rR`)
sprite("_blossom_a", `
  .Z.
  ZyZ
  .Z.`)
sprite("_blossom_b", `
  Zz
  zz`)
sprite("_blossom_c", "Z")

// ================================================================ 16 px

const ROUND16 = [[7, 5, 4], [3, 7, 3], [11, 7, 3], [7, 8, 4]]
sprite("bush_round_16", { w: 14, h: 11, outline: "k" },
  clumps(ROUND16),
  recolor({ l: "g", L: "l" }, (x, y) => x > 9),
  recolor({ g: "G" }, (x, y) => y >= 10 || (x > 11 && y > 6)),
)
sprite("bush_berry_16", { base: "bush_round_16" },
  stamp("_berry", 4, 4), stamp("_berry", 10, 6), stamp("_berry", 6, 8), stamp("_berry", 12, 9))
sprite("bush_autumn_16", { base: "bush_round_16", swap: AUTUMN })

// ================================================================ 32 px

const ROUND32 = [
  [15, 5, 5], [9, 8, 5], [21, 8, 5],
  [4, 13, 4], [26, 13, 4], [11, 12, 5], [19, 12, 5], [15, 14, 5],
]
const lighting32 = [
  recolor({ l: "g", L: "l" }, (x, y) => x > 18 || y > 14),
  recolor({ g: "G" }, (x, y) => y > 16 || (x > 24 && y > 9)),
]
const ROUND32_BODY = [clumps(ROUND32), ...lighting32]

sprite("bush_round_32", { w: 30, h: 19, outline: "k" }, ...ROUND32_BODY)
sprite("bush_berry_32", { base: "bush_round_32" },
  scatter("_berry*", 3, 3, 26, 14, 9, { on: "gG", seed: 3, rflip: "x" }))
sprite("bush_flowering_32", { base: "bush_round_32" },
  scatter("_blossom_*", 2, 1, 28, 16, 14, { on: "gGl", seed: 7 }))
sprite("bush_autumn_32", { base: "bush_round_32", swap: AUTUMN })
sprite("bush_snow_32", { w: 30, h: 19, outline: "k" }, ...ROUND32_BODY,
  recolor({ l: "s", L: "w", g: "l" }, (x, y) => y < 6 && x < 20),
  snowCap("gGlL"),
)

// Buisson sec : touffe de rameaux nus partant d'une base commune.
sprite("bush_dry_32", { w: 30, h: 19, outline: "k" },
  line(14, 18, 4, 9, "b"), line(14, 18, 8, 4, "b"), line(15, 18, 13, 1, "b"),
  line(16, 18, 20, 2, "b"), line(16, 18, 25, 6, "b"), line(17, 18, 28, 12, "b"),
  line(7, 12, 2, 11, "b"), line(10, 8, 5, 6, "b"), line(12, 6, 10, 2, "b"),
  line(18, 7, 22, 5, "B"), line(21, 10, 26, 9, "B"), line(24, 13, 27, 15, "B"),
  line(4, 9, 1, 6, "n"), line(8, 4, 7, 1, "n"), line(13, 1, 15, 0, "n"),
  rect(13, 16, 5, 3, "b"), vline(17, 15, 4, "B"), px(13, 16, "n"),
  // quelques feuilles mortes accrochées
  px(5, 7, "o"), px(20, 4, "N"), px(26, 8, "o"), px(10, 5, "N"),
)

// ================================================================ haie 48 px

// Haie taillée : bloc aux coins arrondis, rempli de petites grappes de feuilles en rangées
// décalées et coupé net sur les côtés ; le dessus garde de légères bosses.
const HEDGE_W = 46, HEDGE_H = 22
const HEDGE_BLOBS = []
for (let row = 0, y = 4; y < HEDGE_H + 2; row++, y += 4)
  for (let x = (row % 2) * 3 + 1; x < HEDGE_W + 3; x += 6) HEDGE_BLOBS.push([x, y, 3])
const HEDGE = [
  poly([0, HEDGE_H, 0, 3, 2, 1, HEDGE_W - 2, 1, HEDGE_W, 3, HEDGE_W, HEDGE_H], "g"),
  clip([0, 0, 2, 1, HEDGE_W - 2, 1, HEDGE_W, 3, HEDGE_W, HEDGE_H, 0, HEDGE_H, 0, 3, 2, 1], clumps(HEDGE_BLOBS)),
  // bosses du dessus
  (c) => { for (let x = 4; x < HEDGE_W - 4; x += 6) { c.hline(x - 1, 0, 3, x < HEDGE_W - 10 ? "l" : "g"); if (x < HEDGE_W - 10) c.px(x - 1, 0, "L") } },
  // lumière : haut éclairé, bas et côté droit dans l'ombre
  recolor({ g: "l", G: "g" }, (x, y) => y <= 4 && x < HEDGE_W - 8),
  recolor({ l: "g", L: "l" }, (x, y) => y >= 13 || x >= HEDGE_W - 8),
  recolor({ g: "G" }, (x, y) => y >= HEDGE_H - 4 || x >= HEDGE_W - 3),
  hline(1, HEDGE_H - 1, HEDGE_W - 2, "G"),
]
sprite("bush_hedge_48", { w: HEDGE_W, h: HEDGE_H, outline: "k" }, ...HEDGE)
sprite("bush_hedge_flowering_48", { base: "bush_hedge_48" },
  scatter("_blossom_*", 2, 1, 44, 16, 20, { on: "gl", seed: 4 }))

sheet("bushs", ["bush_*"], { pad: 2 })
