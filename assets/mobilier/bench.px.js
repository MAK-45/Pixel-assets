include("../_palette.px.js")

const meta = {
  title: "Banc public",
  description: "Bancs publics posés au sol, vus de face pour décors 2D : banc de lattes en bois sans dossier (16 et 32 px), banc à dossier (32 et 48 px), banc vert en fonte peinte, banc de pierre massif, banc d'automne avec feuilles mortes et banc enneigé. Lumière en haut à gauche, contour sombre, assise au tiers haut du sprite.",
  tags: ["bench", "park", "street", "furniture", "seat", "urban", "decoration"],
  variants: {
    wood_16: { label: "Petit banc en bois, sans dossier (16 px)", props: { material: "wood", backrest: "no", season: "summer" }, tags: ["wood"] },
    wood_32: { label: "Banc en bois, sans dossier (32 px)", props: { material: "wood", backrest: "no", season: "summer" }, tags: ["wood"] },
    wood_back_32: { label: "Banc en bois à dossier (32 px)", props: { material: "wood", backrest: "yes", season: "summer" }, tags: ["wood", "backrest"] },
    wood_back_48: { label: "Grand banc en bois à dossier (48 px)", props: { material: "wood", backrest: "yes", season: "summer" }, tags: ["wood", "backrest"] },
    green_32: { label: "Banc vert en fonte (32 px)", props: { material: "green_iron", backrest: "yes", season: "summer" }, tags: ["iron", "green", "park"] },
    stone_32: { label: "Banc de pierre massif (32 px)", props: { material: "stone", backrest: "no", season: "summer" }, tags: ["stone"] },
    autumn_32: { label: "Banc d'automne, feuilles mortes (32 px)", props: { material: "wood", backrest: "yes", season: "autumn" }, tags: ["autumn", "leaves"] },
    snow_32: { label: "Banc enneigé (32 px)", props: { material: "wood", backrest: "yes", season: "winter" }, tags: ["snow", "winter"] },
  },
}

// ================================================================ banc en bois
// W x H = taille de dessin (le contour ajoute 1 px de chaque côté).
// back : dossier (planches horizontales + deux montants) ; sinon deux pieds sous l'assise.
const WOOD_SIZES = {
  16: { W: 14, H: 8, seatY: 3, seatH: 2, legs: [2, 10], back: false },
  32: { W: 30, H: 18, seatY: 8, seatH: 3, legs: [4, 24], back: false },
  "32b": { W: 30, H: 18, seatY: 7, seatH: 3, boards: [1, 4], posts: [2, 26], back: true },
  48: { W: 46, H: 26, seatY: 13, seatH: 4, boards: [2, 7], posts: [2, 42], back: true },
}

function woodBench(s) {
  const { W, H, seatY, seatH } = s
  const items = []
  // montants du dossier (sous les planches) ou pieds sous l'assise
  if (s.back) {
    for (const x of s.posts) {
      items.push(rect(x, 1, 2, H - 1, "d"), vline(x, 1, H - 1, "m"), hline(x - 1, H - 1, 4, "d"))
    }
    for (const by of s.boards) {
      items.push(rect(1, by, W - 2, 2, "n"), hline(1, by, W - 2, "N"), hline(1, by + 1, W - 2, "b"))
    }
  } else {
    for (const x of s.legs) {
      const top = seatY + seatH
      items.push(rect(x, top, 2, H - top, "d"), vline(x, top, H - top, "m"), hline(x - 1, H - 1, 4, "d"))
    }
  }
  // assise : lattes = trois rangées, joints sombres
  items.push(rect(1, seatY, W - 2, seatH, "n"), hline(1, seatY, W - 2, "N"), hline(1, seatY + seatH - 1, W - 2, "b"))
  for (let x = 6; x < W - 6; x += 7) items.push(px(x, seatY + 1, "b"))
  // ombre sur le côté droit
  items.push(recolor({ n: "b", N: "n", b: "B" }, (x) => x > W - 7))
  return items
}

// feuilles mortes : jaunes et orangées, posées sur les lattes rousses
sprite("_leaf_a", "y")
sprite("_leaf_b", "Y")
sprite("_leaf_c", "o")

// ================================================================ banc de pierre
function stoneBench() {
  const W = 30, H = 18
  return [
    rect(0, 4, W, 4, "c"), hline(0, 4, W, "C"), hline(0, 7, W, "m"),
    rect(3, 8, 6, 10, "m"), vline(3, 8, 10, "c"), rect(W - 9, 8, 6, 10, "m"), vline(W - 4, 8, 10, "d"),
    hline(2, H - 1, 8, "d"), hline(W - 10, H - 1, 8, "d"),
    recolor({ c: "m", C: "c", m: "d" }, (x) => x > W - 8),
  ]
}

// ================================================================ bancs
sprite("bench_wood_16", { w: 14, h: 8, outline: "k" }, ...woodBench(WOOD_SIZES[16]))
sprite("bench_wood_32", { w: 30, h: 18, outline: "k" }, ...woodBench(WOOD_SIZES[32]))
sprite("bench_wood_back_32", { w: 30, h: 18, outline: "k" }, ...woodBench(WOOD_SIZES["32b"]))
sprite("bench_wood_back_48", { w: 46, h: 26, outline: "k" }, ...woodBench(WOOD_SIZES[48]))

// Fonte peinte en vert : mêmes formes, bois remplacé par des verts, pieds vert sombre.
const GREEN = { N: "L", n: "l", b: "g", B: "G", d: "G", m: "g" }
sprite("bench_green_32", { base: "bench_wood_back_32", swap: GREEN })

sprite("bench_stone_32", { w: 30, h: 18, outline: "k" }, ...stoneBench())

sprite("bench_autumn_32", { w: 30, h: 18, outline: "k" }, ...woodBench(WOOD_SIZES["32b"]),
  recolor({ N: "o", n: "r", b: "R", B: "R" }, () => true),   // bois roux d'automne, avant les feuilles
  scatter("_leaf*", 2, 6, 26, 6, 12, { on: "or", seed: 5, rflip: "x" }))

sprite("bench_snow_32", { w: 30, h: 18, outline: "k" }, ...woodBench(WOOD_SIZES["32b"]),
  hline(0, 0, 30, "w"), hline(2, 6, 26, "w"), hline(3, 7, 24, "s"))

sheet("bancs", ["bench_*"], { pad: 2 })
