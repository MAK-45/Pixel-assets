include("../_palette.px.js")
include("_iso.px.js")

const meta = {
  title: "Mobilier isométrique",
  description: "Mobilier de quartier d'équipage de station spatiale en vue isométrique 2:1 : fauteuil pivotant (tourné vers le bas à gauche ou à droite), table ronde avec sa tasse, casier vestiaire (deux orientations), plante en bac hydroponique (petite ou haute) et couchette.",
  tags: ["isometric", "furniture", "chair", "table", "locker", "plant", "bunk", "bed", "scifi", "space-station", "prop"],
  variants: {
    chair_sw: { label: "Fauteuil – tourné vers le bas à gauche", props: { shape: "chair", facing: "sw" }, tags: ["seat"] },
    chair_se: { label: "Fauteuil – tourné vers le bas à droite", props: { shape: "chair", facing: "se" }, tags: ["seat"] },
    table: { label: "Table ronde et tasse", props: { shape: "table" }, tags: ["mug"] },
    locker_sw: { label: "Casier – tourné vers le bas à gauche", props: { shape: "locker", facing: "sw" }, tags: ["storage"] },
    locker_se: { label: "Casier – tourné vers le bas à droite", props: { shape: "locker", facing: "se" }, tags: ["storage"] },
    plant: { label: "Plante en bac hydroponique", props: { shape: "plant", size: "small" }, tags: ["hydroponic", "leaves"] },
    plant_tall: { label: "Grande plante en bac hydroponique", props: { shape: "plant", size: "tall" }, tags: ["hydroponic", "leaves"] },
    bunk_sw: { label: "Couchette – tête en haut à gauche", props: { shape: "bunk", facing: "sw" }, tags: ["bed"] },
    bunk_se: { label: "Couchette – tête en haut à droite", props: { shape: "bunk", facing: "se" }, tags: ["bed"] },
  },
}

// Tourné vers le bas à droite : miroir, faces claire et sombre interverties (la lumière reste à gauche).
const SE = { flip: "x", swap: { S: "]", "]": "S", i: "u", u: "i", c: "m", m: "c" } }

// ---------------------------------------------------------------- fauteuil (assise bleue, coque blanche)

const chair = (c) => {
  // pied : disque, colonne
  c.ellipse(10, 21, 5, 2, "d")
  c.ellipse(10, 20, 5, 2, "m")
  c.rect(9, 15, 3, 6, "m"); c.vline(9, 15, 6, "c")
  // assise
  const s = isoBox(1, 9, 10, 10, 3)
  s.fill(c, "I", "i", "u", "w")
  // dossier debout à l'arrière (côté haut à droite)
  const d = isoBox(8, 0, 10, 3, 11)
  d.fill(c, "s", "S", "]", "w")
  d.left(c, ({ u, v }) => (u >= 2 && u <= 7 && v >= 2 && v <= 8 ? (v === 2 || u === 2 ? "u" : "i") : null))
}
sprite("isofurniture_chair_sw", { w: 21, h: 24, outline: "k" }, chair)
sprite("isofurniture_chair_se", { w: 21, h: 24, outline: "k", ...SE }, chair)

// ---------------------------------------------------------------- table ronde

sprite("isofurniture_table", { w: 23, h: 20, outline: "k" }, (c) => {
  c.ellipse(11, 17, 6, 2, "d")
  c.ellipse(11, 16, 6, 2, "m")
  c.rect(10, 8, 3, 9, "m"); c.vline(10, 8, 9, "c")
  isoCyl(c, 11, 5, 11, 2, { top: "s", lit: "S", body: "]", dark: "[" })
  c.ellipse(11, 5, 8, 3, "S"); c.ellipse(11, 5, 7, 2, "s")
  // tasse fumante et tablette
  c.rect(6, 3, 3, 3, "o"); c.px(6, 3, "y"); c.hline(6, 2, 3, "B")
  c.rect(12, 5, 5, 2, "d"); c.hline(13, 5, 3, "0")
})

// ---------------------------------------------------------------- casier

const locker = (c) => {
  const b = isoBox(0, 0, 12, 8, 32)
  b.fill(c, "s", "S", "]", "w")
  b.left(c, ({ u, v, h }) => {
    if (v >= h - 2) return "["
    if (u === 6 && v > 1 && v < h - 3) return "[" // deux portes
    if ((u >= 2 && u <= 4) || (u >= 8 && u <= 10)) {
      if (v >= 4 && v <= 8) return v % 2 ? "]" : "[" // ouïes
      if (v === 12) return "i" // étiquette
    }
    if ((u === 5 || u === 7) && v >= 16 && v <= 18) return "d" // poignées
    return null
  })
  b.right(c, ({ u, v, h }) => (v >= h - 2 ? "[" : u === 3 && v === 5 ? "l" : null))
}
sprite("isofurniture_locker_sw", { w: 20, h: 41, outline: "k" }, locker)
sprite("isofurniture_locker_se", { w: 20, h: 41, outline: "k", ...SE }, locker)

// ---------------------------------------------------------------- plantes en bac hydroponique

// Feuille en lame : un trait qui part du bac et se courbe, plus clair vers la pointe.
const blade = (c, x0, y0, dx, len) => {
  for (let i = 0; i < len; i++) {
    const x = Math.round(x0 + dx * (i / len) ** 1.6 * len * 0.55), y = y0 - i
    c.px(x, y, i > len - 3 ? "L" : i > len / 2 ? "l" : "g")
    if (i > 1 && i < len - 2) c.px(x + (dx < 0 ? 1 : -1), y, i > len / 2 ? "g" : "G")
  }
}
const pot = (c, cx, cy) => {
  isoCyl(c, cx, cy, 5, 5, { top: "s", lit: "s", body: "S", dark: "]" })
  c.ellipse(cx, cy, 4, 2, "8"); c.ellipse(cx, cy, 3, 1, "9")
  c.hline(cx - 4, cy + 4, 9, "0"); c.px(cx + 4, cy + 4, "9")
}
sprite("isofurniture_plant", { w: 15, h: 22, outline: "k" }, (c) => {
  pot(c, 7, 14)
  for (const [dx, len] of [[-1, 9], [1, 8], [-0.5, 12], [0.6, 11], [0, 13]]) blade(c, 7, 14, dx, len)
})
sprite("isofurniture_plant_tall", { w: 17, h: 38, outline: "k" }, (c) => {
  pot(c, 8, 30)
  // tronc fin, bouquets de feuilles rondes étagés
  c.vline(8, 10, 20, "b"); c.vline(9, 14, 16, "B")
  for (const [x, y, r] of [[8, 7, 6], [4, 14, 4], [12, 16, 4], [7, 20, 3]]) {
    c.circ(x, y, r, "g")
    c.recolor({ g: "l" }, (px, py) => (px - x + 1) ** 2 + (py - y + 1) ** 2 < (r - 1) ** 2)
    c.recolor({ l: "L" }, (px, py) => (px - x + 2) ** 2 + (py - y + 2) ** 2 < (r - 3) ** 2 + 1)
    c.recolor({ g: "G" }, (px, py) => (px - x) ** 2 + (py - y) ** 2 <= r * r + 1 && py - y > r * 0.5 && px - x > -r * 0.3)
  }
})

// ---------------------------------------------------------------- couchette

const bunk = (c) => {
  // cadre, matelas, oreiller puis couverture bleue à revers ; tête de lit debout au bout de l'oreiller
  const f = isoBox(0, 7, 32, 14, 6)
  f.fill(c, "s", "S", "]", "w")
  f.left(c, ({ v, u }) => (v >= 4 ? "[" : u % 8 === 3 && v < 4 ? "]" : null))
  f.right(c, ({ v }) => (v >= 4 ? "[" : null))
  f.top(c, ({ p, q, rim }) => {
    if (rim || p < 1.2 || q < 1.2 || p > 30.8 || q > 12.8) return null
    if (p < 8) return p > 3 && q > 2.5 && q < 11.5 ? "w" : "s" // oreiller
    if (p < 10) return "s"
    if (p < 12) return "I" // revers de la couverture
    return q > 11 ? "u" : "i"
  })
  const h = isoBox(0, 0, 2, 14, 10)
  h.fill(c, "s", "S", "]", "w")
}
sprite("isofurniture_bunk_sw", { w: 46, h: 35, outline: "k" }, bunk)
sprite("isofurniture_bunk_se", { w: 46, h: 35, outline: "k", ...SE }, bunk)

sheet("isofurnitures", ["isofurniture_*"], { pad: 2 })
