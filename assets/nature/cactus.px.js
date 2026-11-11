include("../_palette.px.js")

const meta = {
  title: "Cactus",
  description: "Cactus du désert posés au sol, vus de face pour décors 2D : saguaro à bras (16, 32 et 48 px, avec ou sans fleurs blanches), cactus tonneau (16 et 32 px, nu ou couronné de fleurs) et figuier de Barbarie en raquettes (16 et 32 px, nu, en fleurs jaunes ou chargé de figues). Côtes et épines marquées, lumière en haut à gauche, contour sombre.",
  tags: ["cactus", "desert", "plant", "succulent", "spines", "western", "arid", "nature", "decoration"],
  variants: {
    saguaro_16: { label: "Petit saguaro (16 px)", props: { species: "saguaro", state: "plain" } },
    saguaro_32: { label: "Saguaro à deux bras", props: { species: "saguaro", state: "plain" } },
    saguaro_flowers_32: { label: "Saguaro en fleurs", props: { species: "saguaro", state: "flowers" }, tags: ["flower", "blossom", "spring"] },
    saguaro_48: { label: "Grand saguaro à trois bras (48 px)", props: { species: "saguaro", state: "plain" }, tags: ["tall", "landmark"] },
    barrel_16: { label: "Cactus tonneau (16 px)", props: { species: "barrel", state: "plain" } },
    barrel_flowers_16: { label: "Cactus tonneau en fleurs (16 px)", props: { species: "barrel", state: "flowers" }, tags: ["flower"] },
    barrel_32: { label: "Grand cactus tonneau", props: { species: "barrel", state: "plain" } },
    barrel_flowers_32: { label: "Grand cactus tonneau en fleurs", props: { species: "barrel", state: "flowers" }, tags: ["flower"] },
    prickly_16: { label: "Figuier de Barbarie (16 px)", props: { species: "prickly-pear", state: "plain" }, tags: ["opuntia"] },
    prickly_32: { label: "Figuier de Barbarie", props: { species: "prickly-pear", state: "plain" }, tags: ["opuntia"] },
    prickly_flowers_32: { label: "Figuier de Barbarie en fleurs", props: { species: "prickly-pear", state: "flowers" }, tags: ["opuntia", "flower"] },
    prickly_fruit_32: { label: "Figuier de Barbarie chargé de figues", props: { species: "prickly-pear", state: "fruit" }, tags: ["opuntia", "fruit"] },
  },
}

// Verts du cactus = rampe des conifères (vert froid, un peu bleuté) : P ombre, p corps, e côte claire, E reflet.
// Épines : N (paille). Fleurs : w/y (saguaro), o/y (tonneau), y/Y (figuier). Figues : z/R.

// ================================================================ saguaro

// Colonnes côtelées : une teinte par colonne, la gauche éclairée, la droite dans l'ombre.
const RIBS = {
  2: ["e", "p"],
  3: ["E", "p", "P"],
  4: ["e", "E", "p", "P"],
  6: ["e", "E", "p", "e", "p", "P"],
  8: ["e", "E", "e", "p", "e", "p", "P", "P"],
}
// Tige verticale aux coins du haut arrondis ; épines tous les `step` px dans les sillons (colonnes p).
const stem = (x, y, w, h, step = 3) => (c) => {
  const cols = RIBS[w]
  cols.forEach((k, i) => {
    const top = w > 2 && (i === 0 || i === w - 1) ? 1 : 0
    c.vline(x + i, y + top, h - top, k)
    if (k === "p" && w >= 4) for (let yy = y + 2 + (i % 2) * 2; yy < y + h - 1; yy += step) c.px(x + i, yy, "N")
  })
}
// Coude horizontal entre un bras et le tronc : haut éclairé, bas dans l'ombre.
const elbow = (x, y, w, h) => (c) => {
  const rows = h <= 2 ? ["p", "P"] : h === 3 ? ["e", "p", "P"] : ["e", "p", "p", "P"]
  rows.forEach((k, j) => c.hline(x, y + j, w, k))
}
sprite("_bloom", `
  .w.
  wyw`)

// 16 px : tronc de 4, deux petits bras.
sprite("cactus_saguaro_16", { w: 14, h: 14, outline: "k" },
  elbow(2, 8, 4, 2), stem(2, 4, 2, 6),
  elbow(9, 6, 3, 2), stem(10, 2, 2, 6),
  stem(5, 0, 4, 14, 4),
)

// 32 px : tronc de 6, bras gauche bas, bras droit haut.
const SAGUARO32 = [
  elbow(6, 15, 7, 4), stem(5, 7, 4, 12),
  elbow(17, 11, 5, 4), stem(20, 4, 4, 11),
  stem(11, 2, 6, 28, 4),
]
sprite("cactus_saguaro_32", { w: 30, h: 30, outline: "k" }, ...SAGUARO32)
sprite("cactus_saguaro_flowers_32", { w: 30, h: 30, outline: "k" }, ...SAGUARO32,
  stamp("_bloom", 12, 1), stamp("_bloom", 14, 0), stamp("_bloom", 5, 6), stamp("_bloom", 21, 3))

// 48 px : tronc de 8, trois bras.
sprite("cactus_saguaro_48", { w: 46, h: 46, outline: "k" },
  elbow(5, 26, 15, 6), stem(4, 12, 6, 20),
  elbow(26, 16, 10, 6), stem(32, 4, 6, 18),
  elbow(26, 32, 9, 4), stem(32, 26, 4, 10),
  stem(18, 2, 8, 44, 5),
)

// ================================================================ cactus tonneau

// Corps ovale à côtes verticales qui suivent la courbure ; couronne d'épines/fleurs en haut.
const barrel = (w, h) => (c) => {
  const cx = (w - 1) / 2, rx = w / 2, ry = h / 2
  for (let x = 0; x < w; x++) {
    const u = (x - cx) / rx // -1 .. 1
    const dome = h * 0.5
    const top = Math.round(dome - dome * Math.sqrt(Math.max(0, 1 - u * u)))
    const k = u < -0.55 ? "e" : u < -0.15 ? "E" : u < 0.35 ? "p" : "P"
    c.vline(x, top, h - top, k)
  }
  // sillons entre les côtes, plus serrés vers les bords (effet de rondeur)
  const ribs = w >= 20 ? [-0.78, -0.5, -0.2, 0.12, 0.42, 0.7] : [-0.62, -0.15, 0.35, 0.75]
  for (const r of ribs) {
    const x = Math.round(cx + r * rx)
    for (let y = 0; y < h; y++) if (c.is(x, y, "eEpP")) {
      c.px(x, y, r < -0.3 ? "p" : "P")
      if ((y + x) % (w >= 20 ? 4 : 3) === 0 && y > 1 && y < h - 2) c.px(x, y, "N")
    }
  }
  // base un peu resserrée et dans l'ombre
  c.px(0, h - 1, "_"); c.px(w - 1, h - 1, "_")
  for (let x = 0; x < w; x++) if (c.is(x, h - 1, "eEp")) c.px(x, h - 1, "p")
}
sprite("_crown_a", `
  .o.
  oyo`)
sprite("_crown_b", `
  yo`)

sprite("cactus_barrel_16", { w: 12, h: 12, outline: "k" }, barrel(12, 11))
sprite("cactus_barrel_flowers_16", { w: 12, h: 12, outline: "k" }, barrel(12, 11),
  stamp("_crown_a", 3, 0), stamp("_crown_a", 7, 0), px(6, 1, "y"))
sprite("cactus_barrel_32", { w: 26, h: 22, outline: "k" }, barrel(26, 22))
sprite("cactus_barrel_flowers_32", { base: "cactus_barrel_32" },
  stamp("_crown_a", 7, 0), stamp("_crown_a", 12, -1), stamp("_crown_a", 17, 0), stamp("_crown_b", 10, 1), stamp("_crown_b", 15, 1))

// ================================================================ figuier de Barbarie (raquettes)

// Raquette ovale : bord sombre en bas à droite, corps, croissant clair en haut à gauche, aréoles en épines.
const pad = (cx, cy, rx, ry) => (c) => {
  c.ellipse(cx, cy, rx, ry, "k")
  c.ellipse(cx, cy, rx - 1, ry - 1, "P")
  c.ellipse(cx - 1, cy - 1, rx - 2, ry - 2, "p")
  if (rx >= 4) c.ellipse(cx - 1, cy - 2, Math.max(1, rx - 3), Math.max(1, ry - 4), "e")
  if (rx >= 4) c.px(cx - 2, cy - ry + 3, "E")
  if (rx >= 3) for (const [dx, dy] of [[-1, 0], [1, -2], [1, 2], [-2, 3], [2, 0]])
    if (Math.abs(dx) < rx - 2 && Math.abs(dy) < ry - 2) c.px(cx + dx, cy + dy, "N")
}
// Les cernes k ne servent qu'entre raquettes : au bord de la silhouette, le contour automatique suffit.
const thinRim = (c) => {
  const edge = []
  for (let y = 0; y < c.h; y++) for (let x = 0; x < c.w; x++)
    if (c.is(x, y, "k") && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => {
      const X = x + dx, Y = y + dy
      return X < 0 || Y < 0 || X >= c.w || Y >= c.h || c.is(X, Y, ".")
    })) edge.push([x, y])
  for (const [x, y] of edge) c.px(x, y, "_")
}
// 16 px
sprite("cactus_prickly_16", { w: 14, h: 14, outline: "k" },
  pad(3, 5, 3, 4), pad(10, 4, 3, 4), pad(7, 9, 4, 5), thinRim)
// 32 px : raquettes du fond vers l'avant.
const PADS32 = [[5, 14, 5, 6], [24, 13, 5, 6], [10, 8, 5, 7], [20, 7, 5, 7], [15, 20, 7, 9]]
sprite("cactus_prickly_32", { w: 30, h: 30, outline: "k" }, ...PADS32.map((p) => pad(...p)), thinRim)
sprite("_fig", `
  Zz
  zR`)
sprite("_flower_y", `
  YyY
  .y.`)
sprite("cactus_prickly_flowers_32", { base: "cactus_prickly_32" },
  stamp("_flower_y", 8, 1), stamp("_flower_y", 19, 1), stamp("_flower_y", 3, 8), stamp("_flower_y", 24, 7))
sprite("cactus_prickly_fruit_32", { base: "cactus_prickly_32" },
  stamp("_fig", 7, 1), stamp("_fig", 11, 1), stamp("_fig", 18, 1), stamp("_fig", 22, 1),
  stamp("_fig", 2, 8), stamp("_fig", 23, 7), stamp("_fig", 26, 8))

sheet("cactuss", ["cactus_*"], { pad: 2 })
