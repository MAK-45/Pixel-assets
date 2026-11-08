include("../_palette.px.js")

const meta = {
  title: "Fleur",
  description: "Fleurs sauvages et de jardin vues de face, posées au sol : marguerite, tulipes (rouge, jaune, rose, violette, blanche), coquelicot, jacinthe des bois, lavande (16 px) ; tournesol et massif de fleurs mélangées (32 px). Lumière en haut à gauche, contour sombre.",
  tags: ["flower", "plant", "vegetation", "ground", "nature", "decoration", "garden", "meadow"],
  variants: {
    daisy_16: { label: "Marguerite", props: { species: "daisy", color: "white" } },
    tulip_red_16: { label: "Tulipe rouge", props: { species: "tulip", color: "red" } },
    tulip_yellow_16: { label: "Tulipe jaune", props: { species: "tulip", color: "yellow" } },
    tulip_pink_16: { label: "Tulipe rose", props: { species: "tulip", color: "pink" } },
    tulip_purple_16: { label: "Tulipe violette", props: { species: "tulip", color: "purple" } },
    tulip_white_16: { label: "Tulipe blanche", props: { species: "tulip", color: "white" } },
    poppy_16: { label: "Coquelicot", props: { species: "poppy", color: "red" } },
    bluebell_16: { label: "Jacinthe des bois", props: { species: "bluebell", color: "blue" } },
    lavender_16: { label: "Lavande", props: { species: "lavender", color: "purple" }, tags: ["herb"] },
    sunflower_32: { label: "Tournesol (32 px)", props: { species: "sunflower", color: "yellow" } },
    bed_32: { label: "Massif de fleurs mélangées (32 px)", props: { species: "mixed", color: "mixed" }, tags: ["flowerbed", "garden"] },
  },
}

// ================================================================ tige et feuilles communes

// Tige centrale (x) du sol jusqu'à `top`, deux feuilles en lame : gauche éclairée, droite ombrée.
const stem16 = (x, top, ground = 13) => [
  vline(x, top, ground - top + 1, "g"),
  poly([x, ground + 1, x - 4, ground - 4, x - 3, ground - 5, x, ground - 1], "l"),
  px(x - 3, ground - 4, "L"),
  poly([x + 1, ground + 1, x + 1, ground - 1, x + 4, ground - 6, x + 5, ground - 5], "G"),
  hline(x - 2, ground, 5, "G"),
]

// ================================================================ tulipes

// Coupe à trois pointes, éclairée à gauche (o), ombre à droite (R). Couleurs par swap.
const TULIP = `
  .r.r.r.
  .rrrrR.
  orrrrRR
  orrrRRR
  orrrRRR
  .rrrRR.
  ..rRR..`
sprite("flower_tulip_red_16", { w: 11, h: 14, outline: "k" }, ...stem16(5, 6), grid(2, 0, TULIP))
sprite("flower_tulip_yellow_16", { base: "flower_tulip_red_16", swap: { o: "Y", r: "y", R: "o" } })
sprite("flower_tulip_pink_16", { base: "flower_tulip_red_16", swap: { o: "Z", r: "z", R: "R" } })
sprite("flower_tulip_purple_16", { base: "flower_tulip_red_16", swap: { o: "x", r: "v", R: "V" } })
sprite("flower_tulip_white_16", { base: "flower_tulip_red_16", swap: { o: "w", r: "s", R: "S" } })

// ================================================================ marguerite

// Pétales séparés par des creux (le contour les découpe), cœur jaune.
const DAISY = `
  ..w.w..
  .wwwwss
  wwwYysS
  .wwyoS.
  wwsoosS
  .ssSsS.
  ..s.S..`
sprite("flower_daisy_16", { w: 11, h: 14, outline: "k" }, ...stem16(5, 6), grid(2, 0, DAISY))

// ================================================================ coquelicot

const POPPY = `
  .or.rr.
  oorrrRR
  orrddRR
  .rrdRR.
  ..rRR..`
// Tige fine et un peu penchée, petites feuilles découpées.
sprite("flower_poppy_16", { w: 11, h: 14, outline: "k" },
  line(5, 13, 5, 7, "g"), px(6, 6, "g"),
  line(4, 12, 2, 10, "l"), px(1, 10, "l"), px(2, 9, "L"),
  line(6, 11, 8, 9, "G"), px(9, 8, "G"),
  hline(3, 13, 5, "G"),
  grid(2, 2, POPPY))

// ================================================================ jacinthe des bois

// Tige arquée vers la droite, clochettes pendantes de plus en plus petites.
// Tige arquée, clochettes pendantes espacées pour que le contour les sépare.
sprite("flower_bluebell_16", { w: 12, h: 14, outline: "k" }, `
  ....ggg.....
  ...g...gg...
  ..g.i....g..
  ..giiu...i..
  ..giuU..iiu.
  .igu.U..iuU.
  iiug....u.U.
  iuUg........
  u.Ug........
  ...g........
  .l.g..G.....
  .llg.GG.....
  ..lgGG......
  .GGgGGG.....`)

// ================================================================ lavande

// Trois épis : grains violets alternés (clair à gauche, sombre à droite) sur tiges grises-vertes.
const spike = (x, top, len, ground = 13) => (c) => {
  c.vline(x, top + len, ground - top - len + 1, "e")
  for (let i = 0; i < len; i++) {
    const y = top + i
    c.px(x, y, i % 2 ? "v" : "x")
    if (i > 0 && i < len - 1) c.px(i % 2 ? x - 1 : x + 1, y, i % 2 ? "x" : "V")
  }
}
sprite("flower_lavender_16", { w: 11, h: 14, outline: "k" },
  spike(2, 3, 6), spike(5, 0, 7), spike(8, 2, 6),
  line(4, 13, 1, 10, "E"), line(6, 13, 9, 10, "p"), hline(2, 13, 7, "p"))

// ================================================================ tournesol 32 px

sprite("flower_sunflower_32", { w: 22, h: 30, outline: "k" },
  // tige épaisse et grandes feuilles
  rect(10, 15, 2, 15, "g"), vline(11, 15, 15, "G"),
  poly([10, 22, 3, 18, 1, 19, 4, 23, 10, 24], "l"), line(4, 20, 9, 22, "g"), px(2, 19, "L"),
  poly([12, 19, 18, 15, 21, 16, 18, 20, 12, 21], "G"), line(13, 20, 18, 17, "g"),
  hline(7, 29, 8, "G"),
  // pétales en rayons autour du cœur
  (c) => {
    const cx = 10, cy = 8
    for (let a = 0; a < 16; a++) {
      const t = (a / 16) * Math.PI * 2
      const ex = Math.round(cx + Math.cos(t) * 8), ey = Math.round(cy + Math.sin(t) * 7.5)
      const lit = Math.cos(t) + Math.sin(t) < 0.3
      c.line(cx, cy, ex, ey, lit ? "y" : "o", 2)
    }
    c.ring(cx, cy, 5, "o")
  },
  recolor({ y: "Y" }, (x, y) => x + y < 10),
  // cœur : graines brunes, clair en haut à gauche
  circ(10, 8, 4, "b"), circ(9, 7, 2, "n"), px(8, 6, "N"),
  recolor({ b: "B" }, (x, y) => (x - 10) + (y - 8) > 2),
  px(11, 6, "B"), px(9, 10, "B"), px(12, 9, "n"), px(7, 8, "B"),
)

// ================================================================ massif 32 px

sprite("_head_daisy", ".w.\nwyw\n.s.")
sprite("_head_red", "or\nrR")
sprite("_head_yellow", "Yy\nyo")
sprite("_head_pink", ".Z.\nZzz\n.z.")
sprite("_head_blue", "I\ni\nu")
sprite("_head_purple", "x\nv\nx\nV")
group("_heads", ["_head_daisy", "_head_daisy", "_head_red", "_head_yellow", "_head_pink", "_head_blue", "_head_purple"])

const HEADS = ["_head_daisy", "_head_red", "_head_purple", "_head_yellow", "_head_pink", "_head_daisy", "_head_blue", "_head_red", "_head_yellow"]
const STEMS = [[3, 6], [6, 4], [9, 7], [12, 3], [15, 6], [18, 4], [21, 7], [24, 5], [27, 8]]
sprite("flower_bed_32", { w: 30, h: 18, outline: "k" },
  // feuillage bas en grappes
  (c) => {
    for (const [x, y, r] of [[5, 13, 4], [13, 12, 5], [22, 12, 5], [27, 14, 3], [9, 15, 3], [18, 15, 3]]) {
      c.circ(x, y, r, "G"); c.circ(x - 1, y - 1, r - 1, "g"); if (r >= 4) c.circ(x - 2, y - 2, r - 3, "l")
    }
  },
  rect(1, 15, 28, 3, "G"),
  recolor({ l: "g" }, (x, y) => x > 22),
  // tiges qui dépassent du feuillage, chacune terminée par une fleur
  ...STEMS.map(([x, top]) => vline(x, top, 12 - top, x > 20 ? "G" : "g")),
  ...STEMS.map(([x, top], i) => stamp(HEADS[i % HEADS.length], x - 1, top - 2)),
  // fleurs basses nichées dans le feuillage
  scatter("_heads", 2, 8, 26, 6, 6, { on: "gGl", seed: 11 }),
)

sheet("flowers", ["flower_*"], { pad: 2 })
