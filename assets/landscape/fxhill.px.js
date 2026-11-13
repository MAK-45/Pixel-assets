include("../_palette.px.js")
include("../nature/_fx.px.js")

const meta = {
  title: "Colline (style pixelfx)",
  description: "Collines vues de face au rendu riche inspiré de pixelfx, posées au sol : dômes en cloche sans contour noir, modelés par la lumière en haut à gauche en paliers francs (5 à 6 nuances), la colline de devant jette son ombre sur celle du fond, crête découpée en brins d'herbe et quelques touffes plus claires sur les pentes éclairées. Variantes : colline ronde (16, 32 px), vallonnement de trois collines (64 × 32) en été, fleuri, doré d'automne, sec (paille) et enneigé. Pensées pour les plans intermédiaires des scènes.",
  tags: ["hill", "landscape", "terrain", "background", "scenery", "relief", "meadow", "realistic", "pixelfx"],
  variants: {
    rolling_64: { label: "Vallonnement – été (64 × 32)", props: { shape: "rolling", season: "summer", cover: "grass" }, tags: ["grass", "countryside"] },
    round_32: { label: "Colline ronde – été (32 × 16)", props: { shape: "round", season: "summer", cover: "grass" }, tags: ["grass"] },
    round_16: { label: "Petite colline (16 × 8)", props: { shape: "round", season: "summer", cover: "grass" }, tags: ["grass", "distant"] },
    rolling_flowers_64: { label: "Vallonnement fleuri (64 × 32)", props: { shape: "rolling", season: "spring", cover: "flowers" }, tags: ["flower", "countryside"] },
    rolling_autumn_64: { label: "Vallonnement doré – automne (64 × 32)", props: { shape: "rolling", season: "autumn", cover: "grass" }, tags: ["golden", "countryside"] },
    rolling_dry_64: { label: "Vallonnement sec – savane (64 × 32)", props: { shape: "rolling", season: "summer", cover: "straw" }, tags: ["savanna", "dry"] },
    rolling_snow_64: { label: "Vallonnement enneigé – hiver (64 × 32)", props: { shape: "rolling", season: "winter", cover: "snow" }, tags: ["snow", "countryside"] },
  },
}

const GRASS = ["1", "G", "g", "l", "L", "2"]
const GOLDEN = ["B", "b", "o", "y", "Y"]
const STRAW = ["3", "B", "b", "n", "N", "y"]
const SNOWY = ["[", "]", "S", "s", "w"]

// Collines : [cx, demi-largeur, sommet, z] posées sur le bas du canevas (profil en cloche).
// Chaque pixel appartient à la colline de plus grand z qui le couvre ; ombrage = normale de la
// cloche · lumière (haut-gauche) + assombrissement vers le pied ; la colline de devant ombre celle
// du fond sur sa gauche ; crête en brins, touffes claires sur les pentes éclairées ; bord sélectif.
function hills(list, { ramp = GRASS, seed = 1, bias = 0, tufts = 1, flowers = null } = {}) {
  return (c) => {
    const B = Buf(c.w, c.h), base = c.h, n = ramp.length
    const prof = ([cx, hw, top]) => (x) => {
      const t = (x + 0.5 - cx) / hw
      return Math.abs(t) >= 1 ? Infinity : base - (base - top) * Math.pow(1 - t * t, 0.78)
    }
    const P = list.map(prof)
    // crête : brins d'un pixel qui dépassent (bruit lissé, jamais réguliers)
    const crest = (i, x) => P[i](x) - (vnoise(x, i * 7, 1.6, seed) > 0.62 ? 1 : 0)
    const own = new Int8Array(B.w * B.h).fill(-1)
    list.forEach((h, i) => {
      for (let x = 0; x < B.w; x++) {
        const y0 = Math.ceil(crest(i, x))
        for (let y = Math.max(0, y0); y < base; y++) if (own[y * B.w + x] < 0 || list[own[y * B.w + x]][3] <= h[3]) own[y * B.w + x] = i
      }
    })
    const idx = new Int8Array(B.w * B.h).fill(-1)
    for (let y = 0; y < B.h; y++)
      for (let x = 0; x < B.w; x++) {
        const i = own[y * B.w + x]
        if (i < 0) continue
        const [cx, hw, top, z] = list[i]
        const gx = (x + 0.5 - cx) / hw, gy = 1 - (base - (y + 0.5)) / (base - top) // 0 sommet … 1 pied
        const slope = -gx // pente montant vers la gauche = face à la lumière
        let v = 0.5 + 0.28 * slope * Math.abs(gx) ** 0.5 - 0.3 * gy + 0.08 * z + bias
        if (gx < -0.15 && gy < 0.35) v += 0.12 // calotte éclairée
        // ombre portée par une colline de devant située à gauche (et un peu plus haut)
        for (const d of [1, 2, 3]) {
          const j = own[y * B.w + clamp(x - d, 0, B.w - 1)]
          if (j >= 0 && list[j][3] > z && P[j](x - d) < y + 3) { v -= 0.2; break }
        }
        // bandes de pente légères (herbe couchée), jamais de grain
        v += 0.06 * (vnoise(x * 0.5, y * 1.8, 2, seed + i) - 0.5)
        idx[y * B.w + x] = clamp(Math.floor(v * n), 0, n - 1)
      }
    // bord sélectif, sauf en bas : la colline continue sous le sol
    const ext = new Int8Array(B.w * (B.h + 1)).fill(-1)
    ext.set(idx); ext.set(idx.slice((B.h - 1) * B.w), B.h * B.w)
    const E = Buf(B.w, B.h + 1), at = selout(E, ext, ramp).at
    for (let y = 0; y < B.h; y++) for (let x = 0; x < B.w; x++) B.set(x, y, E.get(x, y))
    // touffes plus claires (deux pixels en V) sur les pentes éclairées
    const R = rng(seed * 13 + 1)
    for (let k = 0; k < tufts * B.w * B.h / 70; k++) {
      const x = 1 + Math.floor(R() * (B.w - 2)), y = 1 + Math.floor(R() * (B.h - 2)), t = at(x, y)
      if (t < 2 || t >= n - 1 || at(x, y - 1) < 0 || at(x - 1, y) < 0) continue
      B.set(x, y, ramp[Math.min(n - 1, t + 1)])
      if (R() < 0.5) B.set(x + 1, y - 1, ramp[Math.min(n - 1, t + 1)])
      B.set(x, y + 1, ramp[t - 1])
    }
    // fleurs : points d'un pixel en grappes, plus denses sur les faces éclairées
    if (flowers) for (let k = 0; k < B.w * B.h / 22; k++) {
      const x = Math.floor(R() * B.w), y = Math.floor(R() * B.h), t = at(x, y)
      if (t < 2 || at(x, y - 1) < 0 || vnoise(x, y, 4, seed + 5) < 0.45) continue
      B.set(x, y, flowers[Math.floor(R() * flowers.length)])
    }
    B.flush(c)
  }
}

// Vallonnement : colline du fond large à droite, colline haute à gauche, petite colline devant.
const ROLLING = [[45, 19, 7, 0], [20, 19, 3, 1], [37, 16, 15, 2]]

sprite("fxhill_rolling_64", { w: 64, h: 32 }, hills(ROLLING, { seed: 3 }))
sprite("fxhill_round_32", { w: 32, h: 16 }, hills([[16, 15.5, 1, 0]], { seed: 5, bias: 0.03 }))
sprite("fxhill_round_16", { w: 16, h: 8 }, hills([[8, 7.6, 0, 0]], { seed: 7, bias: 0.05, tufts: 0.4 }))
sprite("fxhill_rolling_flowers_64", { w: 64, h: 32 }, hills(ROLLING, { seed: 3, flowers: ["w", "y", "Z", "x"] }))
sprite("fxhill_rolling_autumn_64", { w: 64, h: 32 }, hills(ROLLING, { ramp: GOLDEN, seed: 3, bias: 0.02 }))
sprite("fxhill_rolling_dry_64", { w: 64, h: 32 }, hills(ROLLING, { ramp: STRAW, seed: 9, bias: 0.04 }))
sprite("fxhill_rolling_snow_64", { w: 64, h: 32 }, hills(ROLLING, { ramp: SNOWY, seed: 3, bias: 0.08, tufts: 0.3 }))

sheet("fxhills", ["fxhill_*"], { pad: 2 })
