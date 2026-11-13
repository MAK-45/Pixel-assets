include("../_palette.px.js")
include("../nature/_fx.px.js")

const meta = {
  title: "Dune de sable (style pixelfx)",
  description: "Dunes de sable du désert vues de face au rendu riche inspiré de pixelfx, sans contour noir : longue face au vent éclairée à gauche, crête vive soulignée d'un filet clair, versant d'éboulement à l'ombre violacée à droite, sable texturé de taches de grain (bruit lissé) et de rares paillettes de quartz au soleil. Variantes : dune à crête (16, 32, 48, 64 px), dune haute, dune basse et allongée, double dune (la dune de devant cache le pied de celle du fond). Posées au sol, pensées pour les plans intermédiaires des scènes de désert ; à associer au sol fxdesertground.",
  tags: ["dune", "sand", "desert", "landscape", "terrain", "background", "scenery", "realistic", "pixelfx"],
  variants: {
    crest_64: { label: "Dune à crête (64 × 32)", props: { shape: "crest" } },
    crest_48: { label: "Dune à crête (48 × 24)", props: { shape: "crest" } },
    crest_32: { label: "Dune à crête (32 × 16)", props: { shape: "crest" } },
    crest_16: { label: "Petite dune (16 × 8)", props: { shape: "crest" }, tags: ["distant"] },
    tall_48: { label: "Dune haute (48 × 32)", props: { shape: "tall" } },
    low_64: { label: "Dune basse allongée (64 × 16)", props: { shape: "low" } },
    double_64: { label: "Double dune (64 × 32)", props: { shape: "double" } },
  },
}

const SAND = ["K", "(", ")", "-", "!", "?"]

// Une dune posée sur le sol (ligne y = H) : de x0 à x1, sommet en (px, py). Face au vent bombée à gauche,
// dos de la corne en pente douce à droite ; la crête descend du sommet vers la droite en s'incurvant, et
// ce qui est à droite de la crête est le versant d'éboulement (à l'ombre).
function shape(H, x0, x1, px, py) {
  const top = (x) => {
    if (x < x0 || x > x1) return Infinity
    if (x <= px) { const t = (px - x) / (px - x0); return py + (H - py) * (1 - Math.pow(1 - Math.pow(t, 1.8), 1.9)) }
    const t = (x - px) / (x1 - px); return py + (H - py) * (1 - Math.pow(1 - t, 1.15) * (1 - 0.35 * t))
  }
  const crestX = (y) => { const g = clamp((y - py) / (H - py), 0, 1); return px + 0.6 + (g * 0.42 - g * g * 0.12) * (x1 - px) }
  return { px, py, x0, x1, top, crestX }
}

// Rendu « texturé » retenu : paliers francs + taches de bruit lissé + rares paillettes.
// dunes = [[x0, x1, sommetX, sommetY]] du fond vers l'avant (fractions de W et H).
// grain : amplitude des taches (réduite sur les petites tailles pour rester lisible).
function dunes(list, { seed = 4, grain = 0.22, sc = 2.5, sparkle = 0.012 } = {}) {
  return (c) => {
    const B = Buf(c.w, c.h), W = c.w, H = c.h, n = SAND.length
    const idx = new Int8Array(W * H).fill(-1), side = new Int8Array(W * H), own = new Int8Array(W * H).fill(-1)
    list.forEach(([a, b, p, q], di) => {
      const S = shape(H, a * W, b * W, p * W, q * H), back = (list.length - 1 - di) * 0.05
      for (let y = 0; y < H; y++)
        for (let x = 0; x < W; x++) {
          if (y + 0.5 < S.top(x + 0.5)) continue
          const slip = x + 0.5 > S.crestX(y + 0.5), gy = (y + 0.5 - S.py) / (H - S.py)
          let v
          if (!slip) {
            const u = 1 - clamp((S.crestX(y + 0.5) - x - 0.5) / (S.px - S.x0), 0, 1) // proximité de la crête
            v = 0.5 + 0.4 * Math.pow(u, 1.6) - 0.22 * gy + grain * (vnoise(x, y, sc, seed + di) - 0.5)
          } else v = 0.12 + 0.28 * gy - (x + 0.5 - S.crestX(y + 0.5) < 1.5 ? 0.12 : 0) + grain * 0.6 * (vnoise(x, y, sc, seed + 7 + di) - 0.5)
          idx[y * W + x] = clamp(Math.floor((v - back) * n), 0, n - 1)
          side[y * W + x] = slip ? 1 : 0
          own[y * W + x] = di
        }
    })
    // pixels isolés au-dessus d'un sommet (vide à gauche, à droite et au-dessus) : retirés
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const p = y * W + x, e = (q, ok) => !ok || idx[q] < 0
        if (idx[p] >= 0 && e(p - 1, x > 0) && e(p + 1, x < W - 1) && e(p - W, y > 0)) idx[p] = -1
      }
    // filet de crête : le dernier pixel éclairé contre le versant d'ombre de la même dune prend le palier clair
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W - 1; x++) {
        const p = y * W + x
        if (idx[p] >= 0 && side[p] === 0 && side[p + 1] === 1 && own[p + 1] === own[p]) idx[p] = n - 1
      }
    // bord sélectif (sauf en bas : la dune continue sous le sol) ; une dune de devant se détache de celle du fond
    const empty = (x, y) => x < 0 || x >= W || y < 0 || (y < H && idx[y * W + x] < 0)
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const p = y * W + x
        let i = idx[p]
        if (i < 0) continue
        if (empty(x + 1, y)) i -= 2
        else if ((empty(x - 1, y) || empty(x, y - 1)) && side[p] === 1) i -= 1
        else if (x + 1 < W && own[p + 1] >= 0 && own[p + 1] < own[p]) i -= 1
        B.set(x, y, SAND[clamp(i, 0, n - 1)])
      }
    // paillettes très rares sur les faces éclairées
    const R = rng(seed * 31 + 5)
    for (let k = 0; k < W * H * sparkle; k++) {
      const x = Math.floor(R() * W), y = Math.floor(R() * H)
      if (idx[y * W + x] >= n - 2 && side[y * W + x] === 0 && B.get(x, y - 1) !== ".") B.set(x, y, "Y")
    }
    B.flush(c)
  }
}

const CREST = [[0, 1, 0.6, 0.36]]
sprite("fxdune_crest_64", { w: 64, h: 32 }, dunes(CREST))
sprite("fxdune_crest_48", { w: 48, h: 24 }, dunes(CREST, { grain: 0.2, sparkle: 0.01 }))
sprite("fxdune_crest_32", { w: 32, h: 16 }, dunes(CREST, { grain: 0.16, sc: 2, sparkle: 0.008 }))
sprite("fxdune_crest_16", { w: 16, h: 8 }, dunes(CREST, { grain: 0, sparkle: 0 }))
sprite("fxdune_tall_48", { w: 48, h: 32 }, dunes([[0, 1, 0.56, 0.16]], { seed: 6 }))
sprite("fxdune_low_64", { w: 64, h: 16 }, dunes([[0, 1, 0.68, 0.2]], { seed: 8, grain: 0.18 }))
sprite("fxdune_double_64", { w: 64, h: 32 }, dunes([[0.22, 1, 0.68, 0.12], [0, 0.6, 0.34, 0.48]], { seed: 5 }))

sheet("fxdunes", ["fxdune_*"], { pad: 2 })
