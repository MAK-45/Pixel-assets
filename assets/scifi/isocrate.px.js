include("../_palette.px.js")
include("_iso.px.js")

const meta = {
  title: "Caisse isométrique",
  description: "Caisses de fret et fûts de station spatiale en vue isométrique 2:1 : caisse renforcée (métal, bleue, orange, verte), grand conteneur de 48 px (métal ou bleu), pile de deux caisses, fût d'acier à bande de danger et fût de produit toxique au couvercle luminescent.",
  tags: ["isometric", "crate", "container", "cargo", "barrel", "box", "scifi", "space-station", "storage", "prop"],
  variants: {
    metal: { label: "Caisse en métal", props: { shape: "crate", color: "gray" } },
    blue: { label: "Caisse bleue", props: { shape: "crate", color: "blue" } },
    orange: { label: "Caisse orange", props: { shape: "crate", color: "orange" } },
    green: { label: "Caisse verte", props: { shape: "crate", color: "green" } },
    large_48: { label: "Grand conteneur en métal (48 px)", props: { shape: "container", color: "gray" } },
    large_blue_48: { label: "Grand conteneur bleu (48 px)", props: { shape: "container", color: "blue" } },
    stack_48: { label: "Pile de deux caisses (48 px)", props: { shape: "stack", color: "mixed" } },
    barrel: { label: "Fût d'acier", props: { shape: "barrel", color: "gray" }, tags: ["drum"] },
    barrel_toxic: { label: "Fût toxique luminescent", props: { shape: "barrel", color: "green" }, tags: ["drum", "glow", "hazard"] },
  },
}

// Caisse en métal : dessus C, face gauche c, face droite m, renforts > (gauche) et < (droite).
const COLORS = {
  blue: { C: "I", c: "i", m: "u", ">": "u", "<": "U" },
  orange: { C: "y", c: "o", m: "r", ">": "r", "<": "R" },
  green: { C: "L", c: "l", m: "g", ">": "g", "<": "G" },
}

// Caisse de côté s (largeur de chaque face) et de hauteur h : cadre renforcé, équerres aux coins,
// traverse, poignée encastrée dans le dessus, étiquette jaune sur la face gauche.
const crate = (ox, oy, s, h) => (c) => {
  const b = isoBox(ox, oy, s, s, h)
  b.fill(c, "C", "c", "m", "w")
  const frame = (dark) => ({ u, v, w, h: hh }) => {
    if (u === 0 || u === w - 1 || v === 0 || v === hh - 1) return dark
    if ((u < 3 || u > w - 4) && (v < 3 || v > hh - 4)) return dark
    if (v === Math.round(hh / 2)) return dark
    return null
  }
  b.left(c, frame(">"))
  b.right(c, frame("<"))
  b.left(c, ({ u, v, w }) => (u >= w - 7 && u <= w - 4 && v >= 3 && v <= 4 ? "y" : null))
  b.top(c, ({ p, q, rim }) => {
    if (rim) return "w"
    const d = Math.min(p, q, s - p, s - q)
    if (d > 1.6 && d < 2.6) return "c"
    return Math.abs(p - s / 2) < 2 && Math.abs(q - s / 2) < 1 ? "m" : null
  })
}

sprite("isocrate_metal", { w: 28, h: 25, outline: "k" }, crate(0, 0, 14, 12))
for (const [color, swap] of Object.entries(COLORS)) sprite(`isocrate_${color}`, { base: "isocrate_metal", swap })

sprite("isocrate_large_48", { w: 44, h: 41, outline: "k" }, crate(0, 0, 22, 20),
  // rainures verticales du conteneur
  (c) => {
    const b = isoBox(0, 0, 22, 22, 20)
    b.left(c, ({ u, v, h }) => (u > 3 && u < 18 && u % 4 === 1 && v > 1 && v < h - 2 && v !== 10 ? ">" : null))
    b.right(c, ({ u, v, h }) => (u > 3 && u < 18 && u % 4 === 1 && v > 1 && v < h - 2 && v !== 10 ? "<" : null))
  })
sprite("isocrate_large_blue_48", { base: "isocrate_large_48", swap: COLORS.blue })

// Pile : une caisse bleue, une caisse orange plus petite posée dessus, un peu de travers.
sprite("_crate_small", { w: 20, h: 18 }, crate(0, 0, 10, 9))
sprite("_crate_base", { w: 28, h: 25 }, crate(0, 0, 14, 12))
sprite("isocrate_stack_48", { w: 28, h: 36, outline: "k" },
  stamp("_crate_base", 0, 11, { swap: COLORS.blue }), stamp("_crate_small", 6, 0, { swap: COLORS.orange }))

// Fût : cylindre cerclé ; `lid` peint le couvercle, `band` la bande du milieu.
const barrel = (lid, band) => (c) => {
  isoCyl(c, 7, 4, 7, 15, { top: "C", lit: "C", body: "c", dark: "m" })
  c.ellipse(7, 4, 5, 2, lid[0])
  c.ellipse(7, 4, 3, 1, lid[1])
  // cercles : ils suivent la courbe du fût
  for (const y of [7, 17]) for (let x = 0; x <= 14; x++) {
    const dy = Math.round(Math.sqrt(Math.max(0, 1 - ((x - 7) / 7.5) ** 2)) * 3)
    c.px(x, y + dy - 3, x > 9 ? "d" : "m")
  }
  for (let x = 0; x <= 14; x++) {
    const dy = Math.round(Math.sqrt(Math.max(0, 1 - ((x - 7) / 7.5) ** 2)) * 3)
    for (let k = 0; k < 3; k++) c.px(x, 10 + k + dy - 3, band(x, k))
  }
}
sprite("isocrate_barrel", { w: 15, h: 23, outline: "k" }, barrel(["m", "d"], (x, k) => ((x + k) % 4 < 2 ? "y" : "k")))
sprite("isocrate_barrel_toxic", { w: 15, h: 23, outline: "k" }, barrel(["0", "+"], (x) => (x > 9 ? "9" : x < 3 ? "+" : "0")),
  recolor({ C: "L", c: "l", m: "g" }))

sheet("isocrates", ["isocrate_*"], { pad: 2 })
