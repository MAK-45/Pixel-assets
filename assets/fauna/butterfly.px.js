include("../_palette.px.js")

const meta = {
  title: "Papillon",
  description: "Papillons qui battent des ailes, pour prairies et jardins : petits papillons vus de face à l'échelle d'une scène (8 px) – piéride blanche, citron jaune, azuré bleu, monarque orange – et grands papillons vus de dessus (16 px), monarque et azuré, ailes ouvertes puis repliées. Animés en 4 images de 100 ms. Lumière en haut à gauche, contour sombre.",
  tags: ["butterfly", "insect", "wings", "meadow", "garden", "summer", "spring", "ambient", "animated", "fauna"],
  variants: {
    white_8: { label: "Piéride blanche (scène)", props: { species: "cabbage-white", color: "white", view: "front" } },
    yellow_8: { label: "Citron jaune (scène)", props: { species: "brimstone", color: "yellow", view: "front" } },
    blue_8: { label: "Azuré bleu (scène)", props: { species: "common-blue", color: "blue", view: "front" } },
    monarch_8: { label: "Monarque (scène)", props: { species: "monarch", color: "orange", view: "front" } },
    monarch_16: { label: "Monarque vu de dessus (16 px)", props: { species: "monarch", color: "orange", view: "top" }, tags: ["icon"] },
    blue_16: { label: "Azuré vu de dessus (16 px)", props: { species: "common-blue", color: "blue", view: "top" }, tags: ["icon"] },
  },
}

// ================================================================ petits papillons (vus de face)

// 5 × 3 : ailes ouvertes, à demi, repliées au-dessus du corps. a aile antérieure, h aile
// postérieure (plus sombre), k corps.
const FRONT = {
  open: ["aa.aa", "aakaa", ".hkh."],
  half: [".a.a.", ".aka.", "..k.."],
  closed: ["..a..", "..a..", "..k.."],
}
const FLUTTER = ["open", "half", "closed", "half"]
const small = (name, wing, hind) => anim(name, { w: 5, h: 3, outline: "k" },
  ...FLUTTER.map((pose) => frame({ ms: 100 }, (c) => FRONT[pose].forEach((row, y) => [...row].forEach((k, x) => {
    if (k !== ".") c.px(x, y, k === "a" ? wing : k === "h" ? hind : "k")
  })))))

small("butterfly_white_8", "w", "s")
small("butterfly_yellow_8", "Y", "y")
small("butterfly_blue_8", "I", "i")
small("butterfly_monarch_8", "o", "r")

// ================================================================ grands papillons (vus de dessus)

// Demi-papillon gauche (7 px, miroir en x) ; f = ouverture des ailes (1 ouvertes, 0,2 repliées) :
// les x sont ramenés vers le corps (colonne 6). Rôles : o aile, y reflet près du corps (lumière en
// haut à gauche), r aile postérieure, B bordure et nervures, w points blancs, d corps.
const half = (f) => {
  const X = (x) => 6 - (6 - x) * f
  const P = (pts) => pts.map((v, i) => (i % 2 ? v : X(v)))
  const dot = (x, y) => (c) => { const xx = Math.round(X(x)); if (xx < 6 || f >= 0.5) c.px(Math.min(5, xx), y, "w") }
  return [
    // aile antérieure, puis postérieure
    poly(P([6, 4, 1, 1, 0, 2, 0, 5, 2, 7, 6, 7]), "o"),
    poly(P([6, 7, 1, 8, 1, 11, 3, 13, 5, 13, 6, 10]), "r"),
    // bordure sombre et nervures
    line(X(0), 2, X(0), 5, "B"), line(X(1), 1, X(0), 2, "B"), line(X(1), 8, X(1), 11, "B"), line(X(1), 11, X(3), 13, "B"),
    line(X(6), 5, X(1), 2, "B"), line(X(6), 8, X(2), 11, "B"),
    // reflet près du corps
    px(Math.round(X(4)), 5, "y"), px(Math.round(X(5)), 5, "y"), px(Math.round(X(5)), 6, "y"),
    // points blancs sur la bordure
    dot(0, 3), dot(1, 9), dot(2, 12),
    // corps, tête, antennes
    rect(6, 3, 1, 9, "d"), px(6, 3, "m"), line(5, 2, 4, 0, "d"),
  ]
}
const OPEN = { open: 1, half: 0.55, closed: 0.2 }
for (const [k, f] of Object.entries(OPEN)) sprite(`_bfly_${k}`, { w: 14, h: 14, mx: true, outline: "k" }, ...half(f))

const big = (name, swap) => anim(name, { w: 16, h: 16, ...(swap ? { swap } : {}) },
  ...FLUTTER.map((pose) => frame({ ms: 100 }, stamp(`_bfly_${pose}`, 0, 0))))
big("butterfly_monarch_16")
big("butterfly_blue_16", { o: "i", y: "I", r: "u", B: "U" })

sheet("butterflys", ["butterfly_*"], { pad: 2 })
