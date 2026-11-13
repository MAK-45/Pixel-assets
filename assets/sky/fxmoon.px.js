include("../_palette.px.js")
include("../nature/_fx.px.js")

const meta = {
  title: "Lune (style pixelfx)",
  description: "Lunes au rendu riche inspiré de la lune de l'effet clouds de la bibliothèque pixelfx : disque pâle presque blanc modelé par la lumière en haut à gauche, mers plus sombres aux bords découpés, cratères à paroi d'ombre et rebord éclairé, limbe adouci côté ombre, halo de clair de lune translucide. Sans contour noir ; la partie non éclairée est transparente. Variantes : pleine lune (16, 32, 48 px), gibbeuse, premier quartier, croissant (16, 32 px), lune rousse des moissons et lune de sang. Les halos rendent mieux sur fond sombre.",
  tags: ["moon", "sky", "night", "lunar", "phase", "glow", "realistic", "pixelfx"],
  variants: {
    full_48: { label: "Pleine lune (48 px)", props: { phase: "full", color: "silver" }, tags: ["craters"] },
    full_32: { label: "Pleine lune (32 px)", props: { phase: "full", color: "silver" }, tags: ["craters"] },
    full_16: { label: "Pleine lune (16 px)", props: { phase: "full", color: "silver" }, tags: ["icon"] },
    gibbous_32: { label: "Lune gibbeuse (32 px)", props: { phase: "gibbous", color: "silver" } },
    quarter_32: { label: "Premier quartier (32 px)", props: { phase: "quarter", color: "silver" } },
    crescent_32: { label: "Croissant de lune (32 px)", props: { phase: "crescent", color: "silver" } },
    crescent_16: { label: "Croissant de lune (16 px)", props: { phase: "crescent", color: "silver" }, tags: ["icon"] },
    harvest_32: { label: "Lune rousse des moissons (32 px)", props: { phase: "full", color: "orange" }, tags: ["autumn", "harvest"] },
    blood_32: { label: "Lune de sang (32 px)", props: { phase: "full", color: "red" }, tags: ["eclipse", "red", "horror"] },
  },
}

// ================================================================ technique
// Repris de weather/clouds (fonction moon) : disque pâle, mers un cran plus sombres, limbe clair côté
// lumière, halo (glow) en couronnes autour du disque. On ajoute le modelé de sphère en paliers francs,
// des cratères (paroi haut-gauche à l'ombre, rebord bas-droit éclairé) et la phase par un terminateur
// elliptique : un point est éclairé si dx < k·√(R² − dy²) (k = 1 pleine, 0 quartier, < 0 croissant).

const SILVER = ["[", "]", "S", "s", "w"]
const HARVEST = ["R", "r", "o", "y", "Y"]
const BLOOD = ["5", "R", "r", "F", "Z"]

function moon(B, cx, cy, R, { k = 1, ramp = SILVER, seed = 1, craters = [], seas = true, glow = ["{", "}"], hr = [1.3, 3.5] } = {}) {
  const W = B.w, H = B.h, idx = new Int8Array(W * H).fill(-1)
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const dx = x + 0.5 - cx, dy = y + 0.5 - cy, d2 = dx * dx + dy * dy
      if (d2 > R * R) continue
      const half = Math.sqrt(Math.max(0, R * R - dy * dy)), term = k * half
      if (dx > term) continue // côté nuit : transparent
      const nx = dx / R, ny = dy / R, nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny))
      const L = nx * LX + ny * LY + nz * LZ
      // disque presque uniformément clair (pleine lumière), calotte blanche en haut à gauche,
      // croissant d'ombre seulement sur le pourtour bas-droit
      const d = Math.sqrt(d2) / R
      let i = L > 0.62 ? 4 : 3
      if (d > 0.8 && dx * LX + dy * LY < -R * 0.25) i = 2
      // mers : grandes taches lissées, un cran plus sombres
      if (seas && vnoise(x + seed * 13, y, Math.max(2, R * 0.45), seed) > 0.6) i -= 1
      // près du terminateur (phases) la lumière rase : un cran de moins
      if (k < 1 && term - dx < Math.max(1.2, R * 0.12)) i -= 1
      for (const [fx, fy, fr] of craters) {
        const ex = x + 0.5 - (cx + fx * R), ey = y + 0.5 - (cy + fy * R), e = Math.hypot(ex, ey)
        if (e > fr + 0.6) continue
        if (e <= fr - 0.4) i = Math.min(i, 2) - (ex + ey < -fr * 0.4 ? 1 : 0) // creux, paroi haute à l'ombre
        else if (ex + ey > fr * 0.3) i = 4 // rebord bas-droit éclairé
      }
      idx[y * W + x] = clamp(i, 1, 4)
    }
  // limbe : bord côté lumière un cran plus clair (comme pixelfx), bord côté ombre un cran plus sombre
  const at = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? -1 : idx[y * W + x])
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const i = at(x, y)
      if (i < 0) continue
      const dx = x + 0.5 - cx, dy = y + 0.5 - cy
      const edge = at(x - 1, y) < 0 || at(x + 1, y) < 0 || at(x, y - 1) < 0 || at(x, y + 1) < 0
      let j = i
      if (edge) j = dx * LX + dy * LY > 0 && dx * dx + dy * dy > (R - 1.5) ** 2 ? Math.max(i, 3) : i - 1
      B.set(x, y, ramp[clamp(j, 0, 4)])
    }
  halo(B, ramp.slice(2).join(""), hr[0], hr[1], glow[0], glow[1])
}

// cratères : [x, y relatifs au rayon, rayon en px]
const CR48 = [[-0.35, -0.25, 2.5], [0.3, 0.35, 3], [0.4, -0.4, 1.6], [-0.1, 0.55, 1.5], [-0.55, 0.25, 1.3], [0.05, -0.05, 1.2]]
const CR32 = [[-0.35, -0.25, 1.8], [0.3, 0.35, 2], [0.42, -0.38, 1.1], [-0.15, 0.55, 1]]

const draw = (fn) => (c) => { const B = Buf(c.w, c.h); fn(B); B.flush(c) }

sprite("fxmoon_full_48", { w: 48, h: 48 }, draw((B) => moon(B, 24, 24, 19, { craters: CR48, seed: 3, hr: [1.5, 4] })))
sprite("fxmoon_full_32", { w: 32, h: 32 }, draw((B) => moon(B, 16, 16, 12.5, { craters: CR32, seed: 3 })))
sprite("fxmoon_full_16", { w: 16, h: 16 }, draw((B) => moon(B, 8, 8, 5.6, { seed: 4, hr: [1, 2] })))
sprite("fxmoon_gibbous_32", { w: 32, h: 32 }, draw((B) => moon(B, 16, 16, 12.5, { k: 0.5, craters: CR32, seed: 5 })))
sprite("fxmoon_quarter_32", { w: 32, h: 32 }, draw((B) => moon(B, 17, 16, 12.5, { k: 0.02, craters: CR32, seed: 6 })))
sprite("fxmoon_crescent_32", { w: 32, h: 32 }, draw((B) => moon(B, 19, 16, 12.5, { k: -0.55, craters: [[-0.6, -0.1, 1.3]], seed: 7 })))
sprite("fxmoon_crescent_16", { w: 16, h: 16 }, draw((B) => moon(B, 9, 8, 6.5, { k: -0.25, seas: false, seed: 7, hr: [1, 2] })))
sprite("fxmoon_harvest_32", { w: 32, h: 32 }, draw((B) => moon(B, 16, 16, 12.5, { ramp: HARVEST, craters: CR32, seed: 8, glow: ["^", "~"] })))
sprite("fxmoon_blood_32", { w: 32, h: 32 }, draw((B) => moon(B, 16, 16, 12.5, { ramp: BLOOD, craters: CR32, seed: 9, glow: ["^", "~"] })))

sheet("fxmoons", ["fxmoon_*"], { pad: 2 })
