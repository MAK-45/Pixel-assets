include("../_palette.px.js")
include("_fx.px.js")

const meta = {
  title: "Fleurs (style pixelfx)",
  description: "Fleurs de prairie et de jardin vues de face au rendu inspiré de la fleur de l'effet « healing bloom » de pixelfx : tige de 2 px éclairée à gauche, feuilles et pétales en amande bordés de leur teinte la plus sombre avec nervure, moitié claire côté lumière (haut gauche), cœurs bombés en paliers francs, sans contour noir. Variantes : marguerite (16, 32 px), tulipes rouge, jaune, rose, violette (32 px) et rouge (16 px), coquelicot, rose, lavande, jacinthe des bois, bleuet (32 px), tournesol (48 px). Fleur seule, ombre portée translucide au sol.",
  tags: ["flower", "plant", "vegetation", "nature", "decoration", "garden", "meadow", "realistic", "pixelfx"],
  variants: {
    daisy_32: { label: "Marguerite (32 px)", props: { species: "daisy", color: "white" } },
    daisy_16: { label: "Marguerite (16 px)", props: { species: "daisy", color: "white" } },
    tulip_red_32: { label: "Tulipe rouge (32 px)", props: { species: "tulip", color: "red" } },
    tulip_yellow_32: { label: "Tulipe jaune (32 px)", props: { species: "tulip", color: "yellow" } },
    tulip_pink_32: { label: "Tulipe rose (32 px)", props: { species: "tulip", color: "pink" } },
    tulip_purple_32: { label: "Tulipe violette (32 px)", props: { species: "tulip", color: "purple" } },
    tulip_red_16: { label: "Tulipe rouge (16 px)", props: { species: "tulip", color: "red" } },
    poppy_32: { label: "Coquelicot (32 px)", props: { species: "poppy", color: "red" }, tags: ["wildflower"] },
    rose_32: { label: "Rose (32 px)", props: { species: "rose", color: "pink" }, tags: ["romantic"] },
    lavender_32: { label: "Lavande (32 px)", props: { species: "lavender", color: "purple" }, tags: ["herb"] },
    bluebell_32: { label: "Jacinthe des bois (32 px)", props: { species: "bluebell", color: "blue" }, tags: ["wildflower", "forest"] },
    cornflower_32: { label: "Bleuet (32 px)", props: { species: "cornflower", color: "blue" }, tags: ["wildflower"] },
    sunflower_48: { label: "Tournesol (48 px)", props: { species: "sunflower", color: "yellow" } },
  },
}

// Rampes (sombre -> clair) : [bord, nervure, moitié ombrée, moitié éclairée, reflet]
const GREEN = ["1", "G", "g", "l", "L"]
const SAGE = ["4", "P", "p", "e", "E"]
const RED = ["5", "R", "r", "o", "y"]
const POP = ["5", "R", "R", "r", "o"] // rouge coquelicot, moins orangé
const PINK = ["5", "6", "z", "Z", "7"]
const YEL = ["B", "n", "o", "y", "Y"]
const WHT = ["m", "c", "S", "s", "w"]
const PURP = ["D", "V", "v", "x", "7"]
const BLUE = ["M", "U", "u", "i", "I"]
const GOLD = ["b", "n", "o", "y", "Y"]
const SEED = ["3", "B", "b", "n", "N"]

// Amande (feuille, pétale), comme drawLeaf de pixelfx : bord extérieur dans le palier le plus sombre,
// nervure, moitié tournée vers la lumière plus claire, reflet sur son bord. Centre (x, y), angle `ang`.
function almond(B, x, y, len, wid, ang, ramp, { rib = true, dim = 0, sheen = true } = {}) {
  const ca = Math.cos(ang), sa = Math.sin(ang), R = Math.ceil(len / 2 + 2), n = ramp.length
  const at = (px, py) => {
    const dx = px + 0.5 - x, dy = py + 0.5 - y, u = dx * ca + dy * sa + len / 2, v = -dx * sa + dy * ca
    if (u < 0 || u > len) return null
    const half = wid * Math.pow(Math.sin((Math.PI * u) / len), 0.75)
    return Math.abs(v) <= half ? { u, v, half } : null
  }
  const litNeg = sa * LX - ca * LY > 0 // la moitié v<0 regarde-t-elle la lumière ?
  const X0 = Math.floor(x - R), X1 = Math.ceil(x + R), Y0 = Math.floor(y - R), Y1 = Math.ceil(y + R)
  const put = []
  for (let py = Y0; py <= Y1; py++)
    for (let px = X0; px <= X1; px++) {
      const s = at(px, py)
      if (!s) {
        if (at(px - 1, py) || at(px + 1, py) || at(px, py - 1) || at(px, py + 1)) put.push([px, py, ramp[0]])
        continue
      }
      const lit = (s.v < 0) === litNeg
      let i = lit ? n - 2 : n - 3
      if (rib && Math.abs(s.v) < 0.5 && s.u > len * 0.15 && s.u < len * 0.85 && wid > 1.2) i = 1
      else if (sheen && lit && Math.abs(s.v) > s.half * 0.45 && s.u > len * 0.25 && s.u < len * 0.8) i = n - 1
      put.push([px, py, ramp[clamp(i - dim, 1, n - 1)]])
    }
  for (const [px, py, c] of put) B.set(px, py, c)
}

// Volume bombé (cœur, bouton, clochette) : paliers francs selon la lumière, bord sélectif.
function dome(B, cx, cy, rx, ry, ramp, { lift = 0.25 } = {}) {
  const inside = (px, py) => { const nx = (px + 0.5 - cx) / rx, ny = (py + 0.5 - cy) / ry; return nx * nx + ny * ny <= 1 }
  const put = []
  for (let py = Math.floor(cy - ry - 1); py <= cy + ry + 1; py++)
    for (let px = Math.floor(cx - rx - 1); px <= cx + rx + 1; px++) {
      if (!inside(px, py)) continue
      const nx = (px + 0.5 - cx) / rx, ny = (py + 0.5 - cy) / ry, nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny))
      const d = nx * LX + ny * LY + nz * LZ
      let i = clamp(Math.floor(((d + lift) / (1 + lift)) * ramp.length), 1, ramp.length - 1)
      if (!inside(px - 1, py) || !inside(px, py - 1) || !inside(px + 1, py) || !inside(px, py + 1)) i = d < 0.25 ? 0 : i - 1
      put.push([px, py, ramp[clamp(i, 0, ramp.length - 1)]])
    }
  for (const [px, py, c] of put) B.set(px, py, c)
}

// Tige : points de la base (x, base) à la tête, courbure `bend` à la pointe ; 2 px, éclairée à gauche.
function stemPts(x, base, h, bend = 0) {
  const pts = []
  for (let r = 0; r <= h; r++) { const u = r / h; pts.push([Math.round(x + bend * u * u), base - r]) }
  return pts
}
function stem(B, pts, { ramp = GREEN, w = 2 } = {}) {
  const put = (x, y) => { B.set(x, y, ramp[3]); B.set(x + 1, y, ramp[2]); if (w > 2) B.set(x + 2, y, ramp[1]) }
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i], [x0, y0] = i ? pts[i - 1] : pts[i], n = Math.max(1, Math.abs(x1 - x0), Math.abs(y1 - y0))
    for (let k = i ? 1 : 0; k <= n; k++) put(Math.round(x0 + (x1 - x0) * k / n), Math.round(y0 + (y1 - y0) * k / n))
  }
}
// Feuille partant d'un point de la tige.
const leaf = (B, x, y, ang, len, wid, ramp = GREEN) => almond(B, x + Math.cos(ang) * len / 2, y + Math.sin(ang) * len / 2, len, wid, ang, ramp)

// Tête en corolle vue de face : pétales rayonnants, ceux qui pointent vers l'ombre un palier plus bas.
function corolla(B, cx, cy, { n, r0, len, wid, ramp, sq = 0.85, rot = 0.2 }) {
  const order = []
  for (let k = 0; k < n; k++) {
    const a = rot + (k / n) * Math.PI * 2, dx = Math.cos(a), dy = Math.sin(a) * sq
    order.push({ a, dx, dy })
  }
  order.sort((p, q) => p.dy - q.dy) // le fond (haut) d'abord
  for (const { dx, dy } of order) {
    const m = r0 + len / 2, ang = Math.atan2(dy, dx), l = Math.hypot(dx, dy)
    const dim = dx * LX + dy * LY < -0.35 ? 1 : 0
    almond(B, cx + dx * m, cy + dy * m, len * (0.7 + 0.3 * l), wid, ang, ramp, { dim, rib: false })
  }
}

const draw = (fn) => (c) => { const B = Buf(c.w, c.h); fn(B, c.h - 1, c.w); B.flush(c) }

// ================================================================ marguerite
function daisy(B, g, cx, s) {
  const top = g - Math.round(20 * s)
  groundShadow(B, cx + 2 * s, g, 5 * s, 1)
  stem(B, stemPts(cx, g, g - top, -1 * s))
  if (s >= 1) { leaf(B, cx, g - 6, -2.5, 8, 2); leaf(B, cx + 1, g - 10, -0.6, 7, 1.8) }
  else leaf(B, cx + 1, g - 3, -0.7, 5, 1.4)
  corolla(B, cx - s, top - 2 * s, { n: s >= 1 ? 13 : 8, r0: 2.2 * s, len: 6.5 * s, wid: 1.5 * Math.max(0.8, s), ramp: WHT })
  dome(B, cx - s, top - 2 * s, 2.8 * s, 2.5 * s, GOLD)
}
sprite("fxflower_daisy_32", { w: 32, h: 32 }, draw((B, g) => daisy(B, g, 16, 1)))
sprite("fxflower_daisy_16", { w: 16, h: 16 }, draw((B, g) => daisy(B, g, 8, 0.55)))

// ================================================================ tulipes
function tulip(B, g, cx, ramp, s = 1) {
  const h = Math.round(18 * s), cy = g - h - Math.round(5 * s)
  groundShadow(B, cx + 2 * s, g, 4 * s, 1)
  stem(B, stemPts(cx, g, h, 0))
  if (s >= 1) { leaf(B, cx, g - 1, -1.95, 15, 2.8); leaf(B, cx + 1, g - 2, -1.1, 13, 2.5) }
  else { leaf(B, cx, g, -1.95, 8, 1.6); leaf(B, cx + 1, g - 1, -1.1, 7, 1.4) }
  // pétales du fond, puis bas arrondi de la coupe, puis pétales de devant
  almond(B, cx - 2.6 * s, cy - 1 * s, 11 * s, 2.8 * s, -Math.PI / 2 - 0.22, ramp, { dim: 1, rib: false, sheen: false })
  almond(B, cx + 3.6 * s, cy - 1 * s, 11 * s, 2.8 * s, -Math.PI / 2 + 0.22, ramp, { dim: 1, rib: false, sheen: false })
  dome(B, cx + 0.5, cy + 2 * s, 5 * s, 4 * s, ramp, { lift: 0.5 })
  almond(B, cx - 1.6 * s, cy + 0.5 * s, 11 * s, 3 * s, -Math.PI / 2 + 0.1, ramp, { rib: false })
  almond(B, cx + 2.8 * s, cy + 0.5 * s, 11 * s, 3 * s, -Math.PI / 2 - 0.1, ramp, { rib: false, dim: 1 })
  almond(B, cx + 0.5, cy + 1.5 * s, 10 * s, 2.6 * s, -Math.PI / 2, ramp, { rib: false })
}
sprite("fxflower_tulip_red_32", { w: 32, h: 32 }, draw((B, g) => tulip(B, g, 15, RED)))
sprite("fxflower_tulip_yellow_32", { w: 32, h: 32 }, draw((B, g) => tulip(B, g, 15, YEL)))
sprite("fxflower_tulip_pink_32", { w: 32, h: 32 }, draw((B, g) => tulip(B, g, 15, PINK)))
sprite("fxflower_tulip_purple_32", { w: 32, h: 32 }, draw((B, g) => tulip(B, g, 15, PURP)))
sprite("fxflower_tulip_red_16", { w: 16, h: 16 }, draw((B, g) => tulip(B, g, 7, RED, 0.5)))

// ================================================================ coquelicot
sprite("fxflower_poppy_32", { w: 32, h: 32 }, draw((B, g) => {
  const pts = stemPts(15, g, 19, 2), [tx, ty] = pts[pts.length - 1]
  groundShadow(B, 18, g, 5, 1)
  stem(B, pts)
  leaf(B, 15, g - 4, -2.6, 8, 1.6); leaf(B, 16, g - 8, -0.5, 7, 1.5)
  const cx = tx + 0.5, cy = ty - 4
  // deux grands pétales du fond, l'intérieur sombre de la coupe, puis la lèvre de devant
  almond(B, cx - 3.5, cy - 2, 10, 4.4, -2.15, POP, { rib: false })
  almond(B, cx + 4.5, cy - 2, 10, 4.4, -1.0, POP, { rib: false, dim: 1 })
  dome(B, cx + 0.5, cy - 1.5, 4, 2, ["k", "k", "d", "d"])
  B.set(Math.round(cx - 1), Math.round(cy - 3), "m"); B.set(Math.round(cx), Math.round(cy - 3), "c")
  dome(B, cx + 0.5, cy + 2.5, 5.5, 3, POP, { lift: 0.5 })
  for (const dx of [-3, 0, 3]) B.set(Math.round(cx + dx), Math.round(cy - 0.5), POP[dx < 0 ? 3 : 2])
}))

// ================================================================ rose
sprite("fxflower_rose_32", { w: 32, h: 32 }, draw((B, g) => {
  const pts = stemPts(15, g, 18, -1)
  groundShadow(B, 18, g, 5, 1)
  stem(B, pts)
  for (const [y, sd] of [[g - 5, 1], [g - 11, -1]]) B.set(sd > 0 ? 17 : 14, y, "G") // épines
  leaf(B, 15, g - 7, -2.55, 8, 2.4); leaf(B, 16, g - 12, -0.55, 7, 2.2)
  const cx = 14.5, cy = g - 23
  leaf(B, cx, cy + 3, 2.6, 5, 1.3); leaf(B, cx + 1, cy + 3, 0.5, 5, 1.3) // sépales
  dome(B, cx, cy, 6.5, 5.5, PINK, { lift: 0.45 })
  // pétales enroulés : arcs concentriques ouverts (bord de pétale sombre, liseré clair au-dessus)
  for (const [r, a0, a1] of [[1.5, 0.3, 4.0], [3, 2.8, 6.2], [4.6, 0.1, 2.6]])
    for (let a = a0; a <= a1; a += 0.08) {
      const x = Math.round(cx + Math.cos(a) * r - 0.5), y = Math.round(cy + Math.sin(a) * r * 0.8 - 0.5)
      if (B.get(x, y) === "5") continue
      B.set(x, y, Math.sin(a) > 0.3 && Math.cos(a) > 0.2 && r > 2 ? "5" : "6")
      if (["z", "6"].includes(B.get(x - 1, y - 1)) && Math.sin(a) > 0) B.set(x - 1, y - 1, "Z")
    }
}))

// ================================================================ lavande
sprite("fxflower_lavender_32", { w: 32, h: 32 }, draw((B, g) => {
  groundShadow(B, 18, g, 7, 1)
  const R = rng(7)
  for (const [x, h, bend] of [[13, 24, -4], [18, 26, 3], [15, 21, 0]]) {
    const pts = stemPts(x, g, h, bend)
    stem(B, pts, { ramp: SAGE })
    // épi : fleurons de 2x2 alternés, clair en haut à gauche
    for (let k = 0; k < 6; k++) {
      const [sx, sy] = pts[h - k * 2 - 1]
      const ox = k % 2 ? 1 : -1, x0 = sx + ox, y0 = sy - 1
      B.set(x0, y0, PURP[k === 0 ? 3 : 2]); B.set(x0 + 1, y0, PURP[2]); B.set(x0, y0 + 1, PURP[2]); B.set(x0 + 1, y0 + 1, PURP[1])
      if (k < 5 && R() < 0.7) B.set(x0 - ox, y0 + 1, PURP[3])
    }
  }
  for (const [ang, len] of [[-2.1, 10], [-1.2, 9], [-2.5, 7], [-0.7, 7]]) leaf(B, 16, g, ang, len, 1.1, SAGE)
}))

// ================================================================ jacinthe des bois
sprite("fxflower_bluebell_32", { w: 32, h: 32 }, draw((B, g) => {
  groundShadow(B, 17, g, 8, 1)
  leaf(B, 12, g, -2.05, 15, 1.9); leaf(B, 16, g, -1.2, 13, 1.8)
  // tige : monte puis se courbe en arche vers la droite (courbe de Bézier)
  const P = [[12, g], [8, -1], [25, -4], [27, 12]], raw = []
  for (let k = 0; k <= 200; k++) {
    const t = k / 200, u = 1 - t
    raw.push([0, 1].map((d) => u * u * u * P[0][d] + 3 * u * u * t * P[1][d] + 3 * u * t * t * P[2][d] + t * t * t * P[3][d]))
  }
  const pts = raw.map(([x, y]) => [Math.round(x), Math.round(y)])
  stem(B, pts)
  // point de l'arche à la distance `d` de la pointe
  const fromTip = (d) => { let acc = 0; for (let k = raw.length - 1; k > 0; k--) { acc += Math.hypot(raw[k][0] - raw[k - 1][0], raw[k][1] - raw[k - 1][1]); if (acc >= d) return pts[k] } return pts[0] }
  // clochettes pendantes sous l'arche, de la plus petite (pointe) à la plus grande
  for (const [d, s] of [[0, 0.7], [7, 0.9], [14, 1], [21, 1]]) {
    const [x, y] = fromTip(d), cy = y + 3 + 2.6 * s
    B.set(x, y + 1, "g"); B.set(x, y + 2, "G")
    dome(B, x + 0.5, cy, 2.7 * s, 2.9 * s, BLUE, { lift: 0.8 })
    // bouche évasée : pointes recourbées, la gauche dans la lumière
    const by = Math.round(cy + 2.9 * s - 0.5), wx = Math.round(2.7 * s)
    for (let dx = -wx; dx <= wx; dx++) B.set(x + dx, by, dx < 0 ? BLUE[2] : BLUE[1])
    B.set(x - wx, by, BLUE[3]); B.set(x - wx - 1, by + 1, BLUE[2]); B.set(x + wx + 1, by + 1, BLUE[1])
  }
}))

// ================================================================ bleuet
sprite("fxflower_cornflower_32", { w: 32, h: 32 }, draw((B, g) => {
  const pts = stemPts(16, g, 19, -2), [tx, ty] = pts[pts.length - 1]
  groundShadow(B, 18, g, 5, 1)
  stem(B, pts, { ramp: SAGE })
  leaf(B, 16, g - 5, -2.4, 9, 1.2, SAGE); leaf(B, 17, g - 10, -0.6, 8, 1.1, SAGE)
  const cx = tx + 0.5, cy = ty - 4
  corolla(B, cx, cy, { n: 9, r0: 2, len: 6, wid: 2, ramp: BLUE, rot: 0.1 })
  // dents au bout des fleurons
  for (let k = 0; k < 9; k++) { const a = 0.1 + (k / 9) * Math.PI * 2, x = Math.round(cx + Math.cos(a) * 8.3 - 0.5), y = Math.round(cy + Math.sin(a) * 0.85 * 8.3 - 0.5); if (B.get(x, y) === ".") B.set(x, y, BLUE[1]) }
  dome(B, cx, cy, 2.4, 2.1, PURP)
}))

// ================================================================ tournesol
sprite("fxflower_sunflower_48", { w: 48, h: 48 }, draw((B, g) => {
  const pts = stemPts(23, g, 30, 1)
  groundShadow(B, 27, g, 7, 1)
  stem(B, pts, { w: 3 })
  leaf(B, 23, g - 9, -2.55, 13, 3.6); leaf(B, 25, g - 16, -0.55, 12, 3.4); leaf(B, 23, g - 22, -2.75, 9, 2.6)
  const cx = 23.5, cy = 15.5
  corolla(B, cx, cy, { n: 13, r0: 6, len: 8, wid: 2.1, ramp: YEL, rot: 0.35, sq: 0.9 })
  corolla(B, cx, cy, { n: 13, r0: 5, len: 7, wid: 2, ramp: GOLD, rot: 0.6, sq: 0.9 })
  dome(B, cx, cy, 7, 6.3, SEED, { lift: 0.35 })
  // graines en spirale : paliers clairs posés en couronnes (pas de grain au hasard)
  for (let k = 1; k < 34; k++) {
    const r = Math.sqrt(k) * 1.0, a = k * 2.39996, x = Math.round(cx + Math.cos(a) * r - 0.5), y = Math.round(cy + Math.sin(a) * r * 0.9 - 0.5)
    const c = B.get(x, y), i = SEED.indexOf(c)
    if (i > 0 && r < 5.6) B.set(x, y, SEED[Math.min(4, i + (i < 2 ? 2 : 1))])
  }
}))

sheet("fxflowers", ["fxflower_*"], { pad: 2 })
