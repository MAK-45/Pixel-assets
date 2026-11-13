include("../_palette.px.js")
include("_fx.px.js")

const meta = {
  title: "Herbe (style pixelfx)",
  description: "Herbes vues de face au rendu inspiré de la prairie de l'effet « lucioles » de pixelfx : brins d'un pixel de large qui se courbent vers l'extérieur, sombres et serrés à la base, pointes claires (plus claires sur les brins penchés vers la lumière, en haut à gauche), deux rangées de profondeur. Variantes : touffe (16, 32 px), hautes herbes à épis, herbe sèche d'automne, herbe givrée, roseaux à massettes, bande de pelouse (48 px), touffe et hautes herbes au vent (animées en boucle, pour les acteurs des scènes). Herbe seule, sans décor autour.",
  tags: ["grass", "plant", "vegetation", "ground", "nature", "decoration", "realistic", "pixelfx"],
  variants: {
    tuft_32: { label: "Touffe d'herbe (32 px)", props: { shape: "tuft", season: "summer" } },
    tuft_16: { label: "Touffe d'herbe (16 px)", props: { shape: "tuft", season: "summer" } },
    tall_32: { label: "Hautes herbes à épis (32 px)", props: { shape: "tall", season: "summer" }, tags: ["seed", "meadow"] },
    dry_32: { label: "Herbe sèche d'automne (32 px)", props: { shape: "tall", season: "autumn" }, tags: ["straw", "savanna"] },
    frost_32: { label: "Herbe givrée (32 px)", props: { shape: "tuft", season: "winter" }, tags: ["frost", "snow"] },
    reed_32: { label: "Roseaux à massettes (32 px)", props: { shape: "reed", season: "summer" }, tags: ["cattail", "pond", "marsh"] },
    patch_48: { label: "Bande de pelouse (48 px)", props: { shape: "patch", season: "summer" }, tags: ["lawn", "meadow", "border"] },
    tuft_wind_16: { label: "Touffe d'herbe au vent (animée, 16 px)", props: { shape: "tuft", season: "summer" }, tags: ["animated", "wind"] },
    tall_wind_32: { label: "Hautes herbes au vent (animées, 32 px)", props: { shape: "tall", season: "summer" }, tags: ["animated", "wind", "seed"] },
  },
}

// Rampes : vert feuillu (LEAF du kit), paille, roseau (vert froid des conifères prolongé).
const STRAW = ["B", "b", "n", "N", "y", "Y"]
const REED = ["4", "P", "p", "e", "E", "L"]

// Un brin : base en (x, base), hauteur h, courbure `bend` (px de décalage à la pointe, + = droite),
// teinte `tone` (palier de la rampe). Bas plus sombre, haut plus clair ; la pointe des brins penchés vers
// la lumière (à gauche) prend un palier de plus.
function blade(B, x, base, h, bend, tone, ramp, { frost = false } = {}) {
  const n = ramp.length
  let last = null
  for (let r = 0; r < h; r++) {
    const u = r / Math.max(1, h - 1), X = Math.round(x + bend * u * u), Y = base - r
    let i = u < 0.22 ? tone - 1 : u > 0.68 ? tone + 1 : tone
    if (r === h - 1 && bend <= 0.5) i += 1
    let c = ramp[clamp(i, 0, n - 1)]
    if (frost && r >= h - 2 && h > 6) c = r === h - 1 ? "w" : "s"
    B.set(X, Y, c)
    // brin qui se couche : on comble le pas en diagonale pour garder un trait continu
    if (last && Math.abs(X - last[0]) > 1) B.set(Math.round((X + last[0]) / 2), Y, c)
    last = [X, Y]
  }
  return last // pointe
}

// Touffe : brins en éventail autour de cx (les extérieurs plus courts et plus couchés), rangée du fond
// sombre puis rangée de devant ; base serrée dans le palier le plus sombre.
// `wind` : chaque brin penche en plus vers la droite, proportionnellement à sa hauteur (animations).
function tuft(B, { cx, base, w, h, n, seed = 1, ramp = LEAF, frost = false, heads = 0, headRamp = STRAW, wind = 0 }) {
  const R = rng(seed), tips = []
  for (const row of [0, 1]) {
    const m = row ? Math.round(n * 0.45) : n
    for (let k = 0; k < m; k++) {
      const t = (k + R() * 0.8) / m * 2 - 1 // -1 … 1
      const x = cx + t * w * (row ? 0.4 : 0.55)
      const hh = Math.max(2, Math.round(h * (1 - 0.55 * t * t) * (0.7 + R() * 0.3) * (row ? 0.75 : 1)))
      const bend = t * w * (0.5 + R() * 0.3) + (R() - 0.5) * 2
      const tone = row ? 2 + Math.floor(R() * 2) : 1 + Math.floor(R() * 2)
      const tip = blade(B, x, base, hh, bend + wind * hh / 10, tone, ramp, { frost })
      if (!row) tips.push([...tip, t])
    }
  }
  // base serrée
  for (let x = Math.round(cx - w * 0.45); x <= Math.round(cx + w * 0.45); x++) if (B.get(x, base) !== ".") B.set(x, base, ramp[0])
  // épis : grains en chevrons sous la pointe des brins les plus hauts
  const S = [...tips].sort((a, b) => a[1] - b[1]).slice(0, heads)
  for (const [x, y] of S) {
    B.set(x, y - 1, headRamp[4])
    for (let k = 0; k < 3; k++) { B.set(x - 1, y + k, headRamp[k ? 2 : 4]); B.set(x + 1, y + k, headRamp[k ? 1 : 3]); B.set(x, y + k, headRamp[3]) }
  }
}

// Massette de roseau : épi brun de 2 px de large, éclairé à gauche, tige qui dépasse au-dessus.
function cattail(B, x, y, len) {
  for (let k = 0; k < len; k++) { B.set(x, y + k, k === 0 ? "n" : "b"); B.set(x + 1, y + k, k === len - 1 ? "3" : "B") }
  B.set(x, y - 1, "p"); B.set(x, y - 2, "e")
}

const draw = (fn) => (c) => { const B = Buf(c.w, c.h); fn(B, c.h - 1); B.flush(c) }

sprite("fxgrass_tuft_32", { w: 32, h: 32 }, draw((B, g) => tuft(B, { cx: 16, base: g, w: 12, h: 25, n: 15, seed: 3 })))
sprite("fxgrass_tuft_16", { w: 16, h: 16 }, draw((B, g) => tuft(B, { cx: 8, base: g, w: 6, h: 15, n: 9, seed: 5 })))
sprite("fxgrass_tall_32", { w: 32, h: 32 }, draw((B, g) => tuft(B, { cx: 16, base: g, w: 10, h: 27, n: 14, seed: 8, heads: 4 })))
sprite("fxgrass_dry_32", { w: 32, h: 32 }, draw((B, g) => tuft(B, { cx: 16, base: g, w: 12, h: 25, n: 15, seed: 9, ramp: STRAW, heads: 3 })))
sprite("fxgrass_frost_32", { w: 32, h: 32 }, draw((B, g) => tuft(B, { cx: 16, base: g, w: 12, h: 21, n: 14, seed: 4, ramp: REED, frost: true })))
sprite("fxgrass_reed_32", { w: 32, h: 32 }, draw((B, g) => {
  tuft(B, { cx: 16, base: g, w: 7, h: 28, n: 16, seed: 12, ramp: REED })
  cattail(B, 12, 6, 6)
  cattail(B, 19, 3, 6)
  cattail(B, 15, 10, 5)
}))
sprite("fxgrass_patch_48", { w: 48, h: 16 }, draw((B, g) => {
  const R = rng(21)
  for (const row of [0, 1])
    for (let x = 0; x < 48; x += row ? 1.6 : 1.1) {
      const h = Math.round((row ? 5 : 8) + R() * (row ? 5 : 6) + (R() < 0.08 ? 3 : 0))
      blade(B, x + R() * 0.8, g, Math.min(15, h), (R() - 0.45) * 4, row ? 2 + Math.floor(R() * 2) : 1 + Math.floor(R() * 2), LEAF)
    }
  for (let x = 0; x < 48; x++) B.set(x, g, "1")
}))

// Au vent (animées, pour les acteurs des scènes) : le pied reste fixe, les pointes balaient.
anim("fxgrass_tuft_wind_16", { w: 16, h: 16, frames: 4, fps: 5 }, (c) =>
  draw((B, g) => tuft(B, { cx: 7, base: g, w: 6, h: 15, n: 9, seed: 5, wind: [0, 1, 2, 1][c.frame] }))(c))
anim("fxgrass_tall_wind_32", { w: 32, h: 32, frames: 6, fps: 5 }, (c) =>
  draw((B, g) => tuft(B, { cx: 14, base: g, w: 10, h: 27, n: 14, seed: 8, heads: 4, wind: [0, 1, 2, 3, 2, 1][c.frame] }))(c))

sheet("fxgrasss", ["fxgrass_*"], { pad: 2 })
