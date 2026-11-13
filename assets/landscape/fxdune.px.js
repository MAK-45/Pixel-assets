include("../_palette.px.js")
include("../nature/_fx.px.js")

const meta = {
  title: "Dune de sable (style pixelfx)",
  description: "Dune de sable du désert vue de face au rendu riche inspiré de pixelfx, sans contour noir : longue face au vent éclairée à gauche, crête vive, versant d'éboulement à l'ombre à droite. Même forme, six propositions de rendu : classique (6 paliers francs), rides de vent, graphique (aplats), golden hour contrasté (ombres violettes), plein midi doux (peu de contraste), texturé (taches de grain et rares paillettes).",
  tags: ["dune", "sand", "desert", "landscape", "terrain", "background", "scenery", "realistic", "pixelfx"],
  variants: {
    classic_64: { label: "Classique – 6 paliers (64 × 32)", props: { style: "classic" } },
    ripples_64: { label: "Rides de vent (64 × 32)", props: { style: "ripples" }, tags: ["ripples", "wind"] },
    flat_64: { label: "Graphique – aplats (64 × 32)", props: { style: "flat" }, tags: ["flat", "graphic"] },
    golden_64: { label: "Golden hour contrasté (64 × 32)", props: { style: "golden" }, tags: ["sunset", "dramatic"] },
    noon_64: { label: "Plein midi doux (64 × 32)", props: { style: "noon" }, tags: ["soft", "pastel"] },
    grainy_64: { label: "Texturé – grain et paillettes (64 × 32)", props: { style: "grainy" }, tags: ["texture", "sparkle"] },
  },
}

const SAND = ["K", "(", ")", "-", "!", "?"]

// Forme commune : dune posée sur le bas du canevas. Face au vent convexe de x0 au sommet (px, py),
// versant d'éboulement raide à droite ; la crête descend du sommet vers le pied droit en s'incurvant,
// et tout ce qui est à droite de la crête est le versant d'éboulement (à l'ombre).
function shape(W, H) {
  const px = W * 0.6, py = H * 0.36, x0 = 0, x1 = W
  const top = (x) => {
    if (x < x0 || x > x1) return Infinity
    if (x <= px) { // face au vent : longue, bombée, pied qui s'étale
      const t = (px - x) / (px - x0)
      return py + (H - py) * (1 - Math.pow(1 - Math.pow(t, 1.8), 1.9))
    }
    const t = (x - px) / (x1 - px) // dos de la corne : descend en pente douce jusqu'au pied droit
    return py + (H - py) * (1 - Math.pow(1 - t, 1.15) * (1 - 0.35 * t))
  }
  // crête : du sommet, s'incurve vers la droite en descendant (corne de la dune, vue un peu de haut)
  const crestX = (y) => { const g = clamp((y - py) / (H - py), 0, 1); return px + 0.6 + (g * 0.42 - g * g * 0.12) * (x1 - px) }
  return { px, py, x0, x1, top, crestX }
}

// styles : chaque rendu est une fonction qui donne une valeur 0..1 et une rampe (côté lumière, côté ombre)
function dune(style, seed = 1) {
  return (c) => {
    const B = Buf(c.w, c.h), W = c.w, H = c.h, S = shape(W, H)
    const lit = style.lit || SAND, sh = style.shade || SAND
    const idx = new Int8Array(W * H).fill(-1), side = new Int8Array(W * H) // 0 lumière, 1 ombre
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        if (y + 0.5 < S.top(x + 0.5)) continue
        const slip = x + 0.5 > S.crestX(y + 0.5)
        const gy = (y + 0.5 - S.py) / (H - S.py) // 0 sommet … 1 pied
        let v, ramp
        if (!slip) {
          // face au vent bombée : plus claire vers la crête (elle se tourne vers le soleil), plus sombre au pied ;
          // la corne au premier plan (droite du sommet) se détourne de la lumière
          const u = 1 - clamp((S.crestX(y + 0.5) - x - 0.5) / (S.px - S.x0), 0, 1) // proximité de la crête
          v = style.litBase + style.litSlope * Math.pow(u, 1.6) - style.litFoot * gy
          if (style.noise) v += style.noise * (vnoise(x, y, style.noiseSc || 3, seed) - 0.5)
          if (style.ripples) {
            // rides : lignes ondulées qui suivent la pente, espacées, jamais de grain
            const r = (y + 2.2 * Math.sin(x / 6.5 + gy * 2.5) + 1.2 * vnoise(x, y, 8, seed + 3)) / style.ripples
            const f = r - Math.floor(r)
            if (u < 0.9 && gy > 0.08 && f < 0.24) v -= 0.17
            else if (u < 0.9 && gy > 0.08 && f < 0.5) v += 0.07
          }
          ramp = lit; side[y * W + x] = 0
        } else {
          // versant d'éboulement : ombre plus profonde contre la crête, lumière réfléchie vers le pied
          const dc = x + 0.5 - S.crestX(y + 0.5)
          v = style.shBase + style.shBounce * gy - (dc < 1.5 ? style.shContact : 0)
          if (style.noise) v += style.noise * 0.6 * (vnoise(x, y, style.noiseSc || 3, seed + 7) - 0.5)
          ramp = sh; side[y * W + x] = 1
        }
        idx[y * W + x] = clamp(Math.floor(v * ramp.length), 0, ramp.length - 1)
      }
    // liseré de crête : le dernier pixel éclairé contre le versant d'ombre prend le palier le plus clair
    if (style.rim)
      for (let y = 0; y < H; y++)
        for (let x = 0; x < W - 1; x++)
          if (idx[y * W + x] >= 0 && side[y * W + x] === 0 && side[y * W + x + 1] === 1 && idx[y * W + x + 1] >= 0)
            idx[y * W + x] = lit.length - 1
    // bord sélectif par côté (sauf en bas : la dune continue sous le sol)
    const empty = (x, y) => x < 0 || x >= W || y < 0 || (y < H && idx[y * W + x] < 0)
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        let i = idx[y * W + x]
        if (i < 0) continue
        const ramp = side[y * W + x] ? sh : lit
        if (style.edge !== false) {
          const l = empty(x - 1, y) || empty(x, y - 1), d = empty(x + 1, y)
          if (d) i = Math.max(0, i - 2)
          else if (l && side[y * W + x] === 1) i = Math.max(0, i - 1)
          else if (l && style.litEdge) i = Math.max(0, i + style.litEdge)
        }
        B.set(x, y, ramp[clamp(i, 0, ramp.length - 1)])
      }
    // paillettes très rares sur la face éclairée (quartz au soleil)
    if (style.sparkle) {
      const R = rng(seed * 31 + 5)
      for (let k = 0; k < W * H * style.sparkle; k++) {
        const x = Math.floor(R() * W), y = Math.floor(R() * H)
        if (idx[y * W + x] >= lit.length - 2 && side[y * W + x] === 0 && B.get(x, y - 1) !== ".") B.set(x, y, "Y")
      }
    }
    B.flush(c)
  }
}

const STYLES = {
  // 1. classique pixelfx : 6 paliers francs, liseré de crête, ombre violacée
  classic: { litBase: 0.5, litSlope: 0.42, litFoot: 0.22, shBase: 0.1, shBounce: 0.28, shContact: 0.12, rim: true },
  // 2. rides de vent sur la face éclairée
  ripples: { litBase: 0.52, litSlope: 0.36, litFoot: 0.2, shBase: 0.1, shBounce: 0.28, shContact: 0.12, rim: true, ripples: 4 },
  // 3. graphique : 3 aplats côté lumière, 2 côté ombre, pas de bord sélectif
  flat: { lit: [")", "-", "!", "?"], shade: ["(", ")"], litBase: 0.45, litSlope: 0.5, litFoot: 0.2, shBase: 0.2, shBounce: 0.5, shContact: 0, edge: false },
  // 4. golden hour : face éclairée orange chaude jusqu'au blanc chaud, versant d'ombre violet du crépuscule
  golden: { lit: ["(", ")", "o", "-", "y", "Y"], shade: ["D", "a", "A", "f"], litBase: 0.42, litSlope: 0.55, litFoot: 0.25, shBase: 0.05, shBounce: 0.45, shContact: 0.2, rim: true },
  // 5. plein midi : clair, peu de contraste, ombres courtes et chaudes
  noon: { lit: ["-", "!", "?", "Y"], shade: [")", "-", "!"], litBase: 0.5, litSlope: 0.35, litFoot: 0.2, shBase: 0.2, shBounce: 0.45, shContact: 0.1, litEdge: 0 },
  // 6. texturé : classique + taches de bruit lissé et rares paillettes
  grainy: { litBase: 0.5, litSlope: 0.4, litFoot: 0.22, shBase: 0.12, shBounce: 0.28, shContact: 0.12, rim: true, noise: 0.22, noiseSc: 2.5, sparkle: 0.012 },
}

for (const [k, st] of Object.entries(STYLES)) sprite(`fxdune_${k}_64`, { w: 64, h: 32 }, dune(st, 4))

sheet("fxdunes", ["fxdune_*"], { pad: 2 })
