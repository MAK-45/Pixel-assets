include("../_palette.px.js")

const meta = {
  title: "Palmier",
  description: "Palmiers d'oasis et de plage, vus de face pour décors 2D : jeune palmier sans tronc (16 px), petit palmier (16 px), palmier dattier droit (32 et 48 px, avec ou sans régimes de dattes), cocotier penché avec noix de coco (32 et 48 px) et palmier desséché aux palmes brunes. Tronc annelé, palmes en arc, lumière en haut à gauche, contour sombre.",
  tags: ["palm", "tree", "desert", "oasis", "beach", "tropical", "date", "coconut", "nature", "decoration"],
  variants: {
    young_16: { label: "Jeune palmier sans tronc (16 px)", props: { species: "date", state: "young" }, tags: ["shrub"] },
    small_16: { label: "Petit palmier (16 px)", props: { species: "date", state: "plain" } },
    date_32: { label: "Palmier dattier", props: { species: "date", state: "plain" }, tags: ["oasis"] },
    date_fruit_32: { label: "Palmier dattier avec dattes", props: { species: "date", state: "fruit" }, tags: ["oasis", "fruit"] },
    coconut_32: { label: "Cocotier penché", props: { species: "coconut", state: "fruit" }, tags: ["beach", "fruit"] },
    dry_32: { label: "Palmier desséché", props: { species: "date", state: "dry" }, tags: ["dead", "drought"] },
    date_48: { label: "Grand palmier dattier (48 px)", props: { species: "date", state: "fruit" }, tags: ["oasis", "fruit", "tall"] },
    coconut_48: { label: "Grand cocotier penché (48 px)", props: { species: "coconut", state: "fruit" }, tags: ["beach", "fruit", "tall"] },
  },
}

// Palmes : nervure claire (l, L du côté éclairé) et folioles pendantes (g puis pointe G).
// Tronc : colonnes N n b B (gauche éclairée), anneaux b/B tous les `ring` px.
const DRY = { L: "N", l: "n", g: "b", G: "B" }

// Une palme partant de (cx, cy) : `dx` = longueur horizontale (signe = côté), `rise` = élan vers le haut,
// `fall` = hauteur finale de la pointe sous le cœur (négatif = au-dessus). Folioles pendantes en dents de
// scie sous la nervure. `front` : palme de devant (verts clairs) ; sinon palme du fond (verts sombres).
const frond = (cx, cy, dx, rise, fall, leaf = 3, front = true) => (c) => {
  const n = Math.max(2, Math.abs(dx) * 3)
  const pts = []
  for (let s = 0; s <= n; s++) {
    const t = s / n
    const x = Math.round(cx + dx * t)
    const y = Math.round(cy - 2 * rise * t + (2 * rise + fall) * t * t)
    if (!pts.length || pts.at(-1)[0] !== x || pts.at(-1)[1] !== y) pts.push([x, y, t])
  }
  const [body, tip, spine] = front ? ["l", "g", "L"] : ["g", "G", "l"]
  pts.forEach(([x, y, t], i) => {
    const len = Math.max(0, Math.round(leaf * Math.sin(Math.PI * Math.min(1, t + 0.15))) - (i % 2))
    for (let j = 1; j <= len; j++) c.px(x, y + j, j === len ? tip : body)
  })
  for (const [x, y] of pts) c.px(x, y, spine)
}

// Tronc de (bx, base) à (tx, ty), largeur w0 en bas -> w1 en haut, anneaux tous les `ring` px.
const trunk = (bx, base, tx, ty, w0, w1, ring = 3) => (c) => {
  for (let y = ty; y <= base; y++) {
    const t = (y - ty) / (base - ty) // 0 en haut, 1 en bas
    const x = bx + (tx - bx) * (1 - t) * (1 - t * 0.3)
    const w = Math.round(w1 + (w0 - w1) * t)
    const x0 = Math.round(x - w / 2)
    const cols = w <= 2 ? ["n", "b"] : w === 3 ? ["N", "n", "B"] : w === 4 ? ["N", "n", "b", "B"] : ["N", "n", "n", "b", "B"]
    const isRing = (base - y) % ring === ring - 1
    const RING = { N: "n", n: "b", b: "B", B: "B" }
    cols.forEach((k, i) => c.px(x0 + i, y, isRing ? RING[k] : k))
  }
}

sprite("_dates", `
  .n.
  ooo
  oro
  .r.`)
sprite("_dates_s", `
  n.
  oo
  r.`)
sprite("_coco", `
  Nn
  nb`)

// ---------------------------------------------------------------- 16 px
sprite("palm_young_16", { w: 14, h: 12, outline: "k" },
  frond(7, 9, -3, 3, -7, 1, false), frond(7, 9, 3, 3, -7, 1, false),
  frond(7, 9, -6, 2, 1, 2), frond(7, 9, 6, 2, 1, 2), frond(7, 9, -4, 3, -3, 2), frond(7, 9, 4, 3, -3, 2), rect(5, 9, 5, 2, "G"), px(6, 9, "g"), hline(6, 11, 3, "B"))
sprite("palm_small_16", { w: 14, h: 14, outline: "k" },
  trunk(6, 13, 7, 4, 3, 2, 2),
  frond(7, 4, -3, 2, -4, 1, false), frond(7, 4, 3, 2, -4, 1, false),
  frond(7, 4, -6, 1, 5, 2), frond(7, 4, 6, 1, 5, 2), frond(7, 4, -5, 2, 0, 2), frond(7, 4, 5, 2, 1, 2),
  px(7, 4, "G"), px(6, 4, "g"))

// ---------------------------------------------------------------- 32 px
const crown32 = (cx, cy) => [
  frond(cx, cy, -12, 3, -1, 3, false), frond(cx, cy, 12, 3, 0, 3, false),
  frond(cx, cy, -4, 4, -7, 2, false), frond(cx, cy, 5, 4, -7, 2, false),
  frond(cx, cy, -13, 2, 12, 3), frond(cx, cy, 13, 2, 12, 3),
  frond(cx, cy, -8, 3, 5, 3), frond(cx, cy, 9, 3, 6, 3),
  rect(cx - 1, cy - 1, 3, 3, "G"), px(cx - 1, cy - 1, "g"),
]
const DATE32 = [trunk(13, 29, 15, 9, 5, 3, 3), ...crown32(15, 9)]
sprite("palm_date_32", { w: 30, h: 30, outline: "k" }, ...DATE32)
sprite("palm_date_fruit_32", { w: 30, h: 30, outline: "k" }, ...DATE32,
  stamp("_dates", 11, 10), stamp("_dates", 16, 10), stamp("_dates_s", 14, 11))
sprite("palm_dry_32", { w: 30, h: 30, outline: "k" }, trunk(13, 29, 15, 9, 5, 3, 3),
  frond(15, 9, -4, 3, -5, 2, false), frond(15, 9, 10, 2, 3, 3, false),
  frond(15, 9, -9, 1, 14, 3), frond(15, 9, 8, 1, 15, 3), frond(15, 9, -11, 2, 8, 3), frond(15, 9, 4, 1, 12, 2),
  rect(14, 8, 3, 3, "G"), recolor(DRY))
sprite("palm_coconut_32", { w: 30, h: 30, outline: "k" },
  trunk(6, 29, 18, 9, 5, 3, 3), ...crown32(18, 9),
  stamp("_coco", 15, 10), stamp("_coco", 18, 11), stamp("_coco", 20, 10))

// ---------------------------------------------------------------- 48 px
const crown48 = (cx, cy) => [
  frond(cx, cy, -19, 4, -2, 4, false), frond(cx, cy, 19, 4, -1, 4, false),
  frond(cx, cy, -7, 6, -11, 3, false), frond(cx, cy, 8, 6, -11, 3, false),
  frond(cx, cy, -21, 3, 18, 4), frond(cx, cy, 21, 3, 18, 4),
  frond(cx, cy, -13, 4, 8, 4), frond(cx, cy, 14, 4, 9, 4),
  rect(cx - 2, cy - 1, 5, 3, "G"), px(cx - 2, cy - 1, "g"), px(cx - 1, cy - 1, "g"),
]
sprite("palm_date_48", { w: 46, h: 46, outline: "k" },
  trunk(21, 45, 23, 13, 6, 4, 4), ...crown48(23, 13),
  stamp("_dates", 17, 14), stamp("_dates", 21, 15), stamp("_dates", 25, 14), stamp("_dates_s", 20, 16))
sprite("palm_coconut_48", { w: 46, h: 46, outline: "k" },
  trunk(9, 45, 27, 13, 6, 4, 4), ...crown48(27, 13),
  stamp("_coco", 23, 14), stamp("_coco", 26, 15), stamp("_coco", 29, 14), stamp("_coco", 31, 16))

sheet("palms", ["palm_*"], { pad: 2 })
