include("../_palette.px.js")

const meta = {
  title: "Herbe",
  description: "Végétation basse vue de face, posée au sol : touffes d'herbe (16 px) en versions été, sèche, enneigée, fleurie et animée au vent ; trèfle ; hautes herbes (32 px) normales, sèches à épis et animées au vent ; roseaux à massettes. Lumière en haut à gauche, contour sombre.",
  tags: ["grass", "tuft", "plant", "vegetation", "ground", "nature", "decoration", "meadow"],
  variants: {
    tuft_16: { label: "Touffe d'herbe", props: { shape: "tuft", season: "summer", state: "still" } },
    tuft_dry_16: { label: "Touffe d'herbe sèche", props: { shape: "tuft", season: "autumn", state: "still" }, tags: ["dry", "straw"] },
    tuft_snow_16: { label: "Touffe d'herbe enneigée", props: { shape: "tuft", season: "winter", state: "still" }, tags: ["snow"] },
    tuft_flowers_16: { label: "Touffe d'herbe fleurie", props: { shape: "tuft", season: "spring", state: "still" }, tags: ["flower"] },
    tuft_wind_16: { label: "Touffe d'herbe au vent (animée)", props: { shape: "tuft", season: "summer", state: "wind" }, tags: ["animated", "wind"] },
    clover_16: { label: "Trèfle", props: { shape: "clover", season: "summer", state: "still" }, tags: ["clover", "lucky"] },
    tall_32: { label: "Hautes herbes", props: { shape: "tall", season: "summer", state: "still" } },
    tall_dry_32: { label: "Hautes herbes sèches à épis", props: { shape: "tall", season: "autumn", state: "still" }, tags: ["dry", "straw", "wheat"] },
    tall_wind_32: { label: "Hautes herbes au vent (animées)", props: { shape: "tall", season: "summer", state: "wind" }, tags: ["animated", "wind"] },
    reeds_32: { label: "Roseaux à massettes", props: { shape: "reed", season: "summer", state: "still" }, tags: ["reed", "cattail", "swamp", "water"] },
  },
}

// ================================================================ outils

// Herbe sèche / paille.
const DRY = { G: "b", g: "n", l: "N", L: "Y" }

// Un brin courbé : part du sol (x, ground), monte de h pixels et penche de `lean` au sommet
// (courbe quadratique : le pied reste droit, la pointe se plie). Pied épaissi sur `thick` px.
const blade = (c, x, ground, h, lean, col, tip, thick = Math.ceil(h * 0.6)) => {
  let prev = null
  for (let t = 0; t < h; t++) {
    const f = t / Math.max(1, h - 1)
    const bx = Math.round(x + lean * f * f)
    const by = ground - t
    if (prev !== null && Math.abs(bx - prev) > 1) c.px((bx + prev) >> 1, by + 1, col) // trait continu
    c.px(bx, by, t >= h - 2 && tip ? tip : col)
    if (t < thick) c.px(bx + 1, by, col)
    prev = bx
  }
  return [Math.round(x + lean), ground - h + 1] // pointe
}

// Une touffe = liste de brins [x, h, lean, couleur, pointe?], du fond vers l'avant.
// `wind` penche chaque brin en plus, proportionnellement à sa hauteur (animations).
const tuft = (ground, list, wind = 0, onTip) => (c) => {
  for (const [x, h, lean, col, tip] of list) {
    const p = blade(c, x, ground, h, lean + Math.round(wind * h / 10), col, tip)
    if (onTip) onTip(c, p, col)
  }
}

// ================================================================ touffes 16 px

const G16 = 10
// Touffe dessinée à la main : base pleine, brins en pointes (arrière sombre à droite, clair devant à gauche).
const TUFT16 = `
  .....L........
  ..l..L....g...
  ..l..lL..gg...
  .ll..lL..g..G.
  .l..LlL.gg..G.
  .l..lL..g..GG.
  ll.lLl.gg.gG..
  .llLlggggGgG..
  ..lllggggGGG..
  ..lgggggGGGG..
  ...GGGGGGGG...`
sprite("grass_tuft_16", { w: 14, h: 11, outline: "k" }, TUFT16)
sprite("grass_tuft_dry_16", { base: "grass_tuft_16", swap: DRY })
sprite("grass_tuft_snow_16", { w: 14, h: 11, outline: "k" }, TUFT16,
  // neige sur les pointes et petit tapis au pied
  recolor({ L: "w", l: "w", g: "s", G: "S" }, (x, y) => y <= 1 || (y <= 3 && (x === 1 || x === 3 || x === 12))),
  recolor({ l: "s", g: "s" }, (x, y) => y === 2 && x > 4),
  hline(0, 10, 14, "s"), hline(1, 9, 5, "w"), px(0, 9, "s"))
sprite("_flower_w", `
  .w.
  wyw
  .w.`)
sprite("_flower_y", `
  .y.
  yoy
  .y.`)
sprite("grass_tuft_flowers_16", { w: 14, h: 11, outline: "k" }, TUFT16,
  stamp("_flower_w", 2, 0), stamp("_flower_y", 9, 1), px(12, 3, "Z"), px(12, 2, "Z"))

// Vent : les rangées du haut glissent vers la droite (cisaillement), le pied reste fixe.
const TUFT16_ROWS = TUFT16.trim().split("\n").map((r) => r.trim())
anim("grass_tuft_wind_16", { w: 14, h: 11, outline: "k", frames: 4, fps: 5 }, (c) => {
  const k = [0, 1, 2, 1][c.frame]
  TUFT16_ROWS.forEach((row, y) => {
    const dx = Math.round(k * Math.max(0, 6 - y) / 6)
    for (let x = 0; x < row.length; x++) if (row[x] !== ".") c.px(Math.min(13, x + dx), y, row[x])
  })
})

// Trèfle : feuilles à trois folioles en cœur, posées au ras du sol.
sprite("_clover", `
  .lL.lL.
  lLLlLLl
  lLlglgG
  .glggG.
  ...g...`)
sprite("grass_clover_16", { w: 14, h: 8, outline: "k" },
  stamp("_clover", 7, 1, { swap: { l: "g", L: "l", g: "G" } }),
  stamp("_clover", 0, 0),
  // tapis de feuilles au ras du sol
  hline(0, 7, 14, "G"), hline(1, 6, 3, "g"), hline(11, 6, 3, "G"), px(0, 6, "l"),
)

// ================================================================ hautes herbes 32 px

const G32 = 27
// Brins générés de façon déterministe : rang arrière sombre, puis moyen, puis clair devant.
const TALL32 = []
{
  const rows = [["G", null, 15, 24], ["g", "l", 12, 22], ["l", "L", 8, 16]]
  let s = 7
  const rnd = () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648)
  rows.forEach(([col, tip, hMin, hMax], r) => {
    for (let x = 2 + r; x < 27; x += 3 + r) {
      const h = Math.round(hMin + rnd() * (hMax - hMin) * (1 - Math.abs(x - 14) / 22))
      const lean = Math.round((x - 14) / 3 + (rnd() - 0.5) * 4)
      TALL32.push([x, h, lean, col, tip])
    }
  })
}
const tallBody = (wind = 0, onTip) => [tuft(G32, TALL32, wind, onTip), hline(3, G32, 24, "G"),
  recolor({ l: "g", L: "l" }, (x, y) => x > 20)]

sprite("grass_tall_32", { w: 30, h: 28, outline: "k" }, ...tallBody())

// Épis : petite grappe de grains au bout des brins des rangs moyen et avant.
const ear = (c, [x, y], col) => {
  if (col === "G") return
  c.px(x, y - 1, "Y"); c.px(x, y, "y"); c.px(x - 1, y + 1, "y"); c.px(x + 1, y + 1, "N"); c.px(x, y + 2, "N")
}
sprite("grass_tall_dry_32", { w: 30, h: 30, outline: "k" },
  layer("herbe", { y: 2 }, ...tallBody(0, ear)),
  recolor(DRY),
)

anim("grass_tall_wind_32", { w: 30, h: 28, outline: "k", frames: 6, fps: 6 },
  (c) => tuft(G32, TALL32, [0, 1, 2, 3, 2, 1][c.frame])(c), ...tallBody().slice(1))

// ================================================================ roseaux 32 px

// Massette : épi brun allongé au sommet d'une tige droite.
const cattail = (x, top, len) => [
  vline(x, top - 3, 3, "g"),
  rect(x - 1, top, 3, len, "b"), vline(x - 1, top + 1, len - 2, "n"), vline(x + 1, top + 1, len - 1, "B"),
]
sprite("grass_reeds_32", { w: 30, h: 30, outline: "k" },
  // tiges
  line(9, 29, 8, 6, "g"), line(15, 29, 15, 2, "g"), line(21, 29, 22, 8, "G"), line(12, 29, 11, 12, "G"),
  // longues feuilles rubanées
  (c) => {
    blade(c, 4, 29, 20, -3, "G")
    blade(c, 25, 29, 18, 4, "G")
    blade(c, 6, 29, 24, 2, "g", "l")
    blade(c, 18, 29, 22, -4, "g", "l")
    blade(c, 23, 29, 14, 2, "g")
    blade(c, 11, 29, 16, -6, "l", "L")
    blade(c, 16, 29, 12, 5, "l", "L")
  },
  ...cattail(8, 7, 7), ...cattail(15, 3, 8), ...cattail(22, 9, 6),
  hline(2, 29, 26, "G"),
)

sheet("grasss", ["grass_*"], { pad: 2 })
