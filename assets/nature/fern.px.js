include("../_palette.px.js")

const meta = {
  title: "Fougère",
  description: "Fougères de sous-bois vues de face, posées au sol : petite fougère et jeune crosse enroulée (16 px) ; grande fougère en vert clair, vert forêt bleuté, rousse d'automne et enneigée (32 px). Lumière en haut à gauche, contour sombre.",
  tags: ["fern", "plant", "vegetation", "ground", "forest", "undergrowth", "nature", "decoration"],
  variants: {
    small_16: { label: "Petite fougère", props: { state: "mature", season: "summer", color: "green" } },
    young_16: { label: "Jeune fougère en crosse", props: { state: "young", season: "spring", color: "green" }, tags: ["fiddlehead"] },
    large_32: { label: "Grande fougère", props: { state: "mature", season: "summer", color: "green" } },
    forest_32: { label: "Grande fougère de forêt sombre", props: { state: "mature", season: "summer", color: "teal" } },
    autumn_32: { label: "Fougère rousse d'automne", props: { state: "mature", season: "autumn", color: "brown" } },
    snow_32: { label: "Fougère enneigée", props: { state: "mature", season: "winter", color: "green" }, tags: ["snow"] },
  },
}

// Palette des frondes : G nervure ombrée, g nervure, l folioles éclairées, L pointes.
const FOREST = { G: "P", g: "p", l: "e", L: "E" }
const RUSTY = { G: "B", g: "b", l: "o", L: "y" }

// Une fronde : nervure en courbe de Bézier du pied (x0, y0) au bout (x2, y2) via (x1, y1), avec
// une foliole de chaque côté tous les 2 px, inclinée vers la pointe et plus courte au bout.
// Les creux entre folioles se remplissent de contour : la fronde se lit comme un peigne.
// Côté haut éclairé ; `back` = fronde d'arrière-plan, un ton plus sombre.
const frond = (x0, y0, x1, y1, x2, y2, len = 3, back = false) => (c) => {
  const at = (t) => { const u = 1 - t; return [u * u * x0 + 2 * u * t * x1 + t * t * x2, u * u * y0 + 2 * u * t * y1 + t * t * y2] }
  const [hi, lo, rib] = back ? ["g", "G", "G"] : ["l", "g", "G"]
  // échantillons à pas d'arc ~1 px
  const pts = [at(0)]
  for (let i = 1, acc = 0; i <= 400; i++) {
    const p = at(i / 400), q = pts[pts.length - 1]
    acc += Math.hypot(p[0] - q[0], p[1] - q[1]) * (pts.length && 1)
    if (Math.hypot(p[0] - q[0], p[1] - q[1]) >= 1) pts.push(p)
  }
  const n = pts.length - 1
  for (let i = 2; i < n; i += 2) {
    const t = i / n
    const [x, y] = pts[i], [ax, ay] = pts[i + 1], [bx, by] = pts[i - 1]
    const d = Math.hypot(ax - bx, ay - by) || 1
    const tx = (ax - bx) / d, ty = (ay - by) / d
    const l = Math.round(len * (t < 0.25 ? 0.6 + t * 1.6 : 1 - (t - 0.25) / 0.85))
    if (l < 1) continue
    for (const s of [1, -1]) {
      const nx = -ty * s, ny = tx * s
      const up = ny < 0 || (Math.abs(ny) < 0.35 && nx < 0)
      c.line(Math.round(x), Math.round(y), Math.round(x + nx * l + tx * l * 0.7), Math.round(y + ny * l + ty * l * 0.7), up ? hi : lo)
    }
  }
  pts.forEach(([x, y], i) => c.px(Math.round(x), Math.round(y), i > n * 0.8 ? hi : rib))
}

// ================================================================ 16 px

// Petite fougère dessinée à la main : trois frondes en peigne.
sprite("fern_small_16", { w: 14, h: 11, outline: "k" }, `
  ......L.......
  .....lLl......
  ..l...l...g...
  .lLl.lLl.ggg..
  ..lLl.l.gGg.G.
  l..lLlLlgG.GG.
  lL..llLgg.GG..
  .lLl.lggGGG.G.
  ..llllgggGGGG.
  ...llgggGGG...
  ....GGGGGG....`)

// Crosse : tiges enroulées en spirale au sommet.
sprite("fern_young_16", { w: 12, h: 14, outline: "k" }, `
  ...lll......
  ..l...g.....
  ..l.Lgg..ll.
  ..g.....g..g
  ...gg...g.Lg
  .....g..g.g.
  .....g.g....
  ....g..g....
  ....g..g....
  ...lg.gG....
  ..llg.gGG...
  ..lggggGG...
  ...lgggG....
  ..GGGGGGG...`)

// ================================================================ 32 px

const LARGE = [
  // éventail de frondes : arrière sombres d'abord
  // les frondes s'élèvent puis retombent en arc
  frond(15, 25, 20, 2, 27, 6, 4, true),
  frond(14, 25, 9, 2, 2, 6, 4, true),
  frond(14, 25, 5, 10, 0, 20, 3),
  frond(15, 25, 24, 10, 29, 20, 3),
  frond(14, 25, 15, 6, 12, 0, 4),
  hline(11, 25, 8, "G"),
]
sprite("fern_large_32", { w: 30, h: 26, outline: "k" }, ...LARGE,
  recolor({ l: "g", L: "l" }, (x, y) => x > 22))
sprite("fern_forest_32", { base: "fern_large_32", swap: FOREST })
sprite("fern_autumn_32", { base: "fern_large_32", swap: RUSTY })
sprite("fern_snow_32", { w: 30, h: 26, outline: "k" }, ...LARGE,
  recolor({ l: "g", L: "l" }, (x, y) => x > 22),
  // neige sur le dessus de chaque fronde
  (c) => {
    for (let x = 0; x < c.w; x++)
      for (let y = 0; y < c.h - 4; y++)
        if (c.is(x, y, "gGlL")) { c.px(x, y, x < 20 ? "w" : "s"); if (c.is(x, y + 1, "lL")) c.px(x, y + 1, "s"); break }
  },
  hline(9, 25, 12, "s"), hline(11, 24, 6, "w"))

sheet("ferns", ["fern_*"], { pad: 2 })
