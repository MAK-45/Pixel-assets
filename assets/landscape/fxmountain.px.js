include("../_palette.px.js")
include("../nature/_fx.px.js")

const meta = {
  title: "Montagne (style pixelfx)",
  description: "Montagnes vues de face au rendu riche inspiré des pierres taillées et de la neige de la bibliothèque d'effets pixelfx (pic de terre, congère) : relief découpé en grandes facettes planes par les arêtes et les contreforts, chaque face éclairée selon son orientation (versant gauche clair, versant droit à l'ombre), arête vive, neige en paliers blanc, bleu pâle et bleu-gris qui coule dans les couloirs. Sans contour noir. Variantes : pic enneigé (16, 32, 48, 64 px), pic rocheux nu, pic tout blanc en hiver, double sommet, chaîne de sommets (64 × 32) et pic de grès du désert. Montagne seule, sans décor autour.",
  tags: ["mountain", "peak", "landscape", "background", "scenery", "terrain", "relief", "snow", "realistic", "pixelfx"],
  variants: {
    peak_snow_64: { label: "Grand pic enneigé (64 px)", props: { shape: "peak", cover: "snowcap", material: "granite" }, tags: ["snow"] },
    peak_snow_48: { label: "Pic enneigé (48 px)", props: { shape: "peak", cover: "snowcap", material: "granite" }, tags: ["snow"] },
    peak_snow_32: { label: "Pic enneigé (32 px)", props: { shape: "peak", cover: "snowcap", material: "granite" }, tags: ["snow"] },
    peak_snow_16: { label: "Pic enneigé (16 px)", props: { shape: "peak", cover: "snowcap", material: "granite" }, tags: ["snow", "icon"] },
    peak_bare_48: { label: "Pic rocheux nu (48 px)", props: { shape: "peak", cover: "bare", material: "granite" }, tags: ["summer"] },
    peak_winter_48: { label: "Pic tout enneigé, hiver (48 px)", props: { shape: "peak", cover: "snow", material: "granite" }, tags: ["snow", "winter"] },
    twin_snow_64: { label: "Double sommet enneigé (64 px)", props: { shape: "twin", cover: "snowcap", material: "granite" }, tags: ["snow"] },
    range_snow_64: { label: "Chaîne de sommets enneigés (64 × 32)", props: { shape: "range", cover: "snowcap", material: "granite" }, tags: ["snow", "range", "parallax"] },
    peak_sandstone_48: { label: "Pic de grès du désert (48 px)", props: { shape: "peak", cover: "bare", material: "sandstone" }, tags: ["desert"] },
  },
}

// ================================================================ relief à facettes
// Sujet absent de pixelfx : on reprend la pierre à facettes de nature/earth-spike (arête qui sépare une
// face éclairée d'une face à l'ombre, paliers francs de la rampe stone) et la congère de weather/snow
// (crête blanche, ombre bleue en paliers). Chaque arête est une « tente » : z = k·(y − y0) − pente·|x − X(y)|.
// La montagne est le max de ses arêtes (z > 0) ; chaque côté de chaque arête est un plan, donc une
// facette plane, ombrée selon sa normale face à la lumière (haut-gauche).

const GRANITE = ["k", "d", "<", "m", ">", "c", "C"]
const SANDSTONE = ["3", "B", "b", "=", "n", "N"]
const SNOW = ["[", "]", "S", "s", "w"]

// arête : polyligne pts [[x, y], …] (y croissant, du sommet vers le bas), k croissance, sl/sr pentes
function ridge(pts, { k = 1, sl = 1.2, sr = 1.2, z0 = 0, main = false } = {}) {
  const y0 = pts[0][1] - z0 / k
  const X = (y) => {
    for (let i = 0; i + 1 < pts.length; i++) {
      const [ax, ay] = pts[i], [bx, by] = pts[i + 1]
      if (y <= by || i + 2 === pts.length) return { x: ax + ((bx - ax) * (y - ay)) / (by - ay || 1), d: (bx - ax) / (by - ay || 1) }
    }
  }
  return {
    z(x, y) {
      if (y < pts[0][1]) return null
      const { x: rx, d } = X(y), left = x < rx
      const z = k * (y - y0) - (left ? sl * (rx - x) : sr * (x - rx))
      // pente du plan : dz/dx, dz/dy
      return { z, dx: left ? sl : -sr, dy: left ? k - sl * d : k + sr * d, left }
    },
    main,
    top: pts[0][1],
  }
}

// Un pic : arête principale droite du sommet au pied (versants rectilignes, silhouette nette), plus des
// contreforts droits partis de l'arête à une fraction de sa hauteur, qui s'écartent en descendant.
// Les contreforts ne changent pas la silhouette (seules les arêtes principales la dessinent) : ils
// découpent l'intérieur en facettes, avec un couloir à l'ombre entre eux et l'arête.
// spurs : [[fraction de hauteur, côté -1/1, écart en px par px de descente], …]
function peak(cx, top, base, { k = 1, sl = 2, sr = 2.2, lean = 0, spurs = [] } = {}) {
  const yb = base + 4, X = (y) => cx + (lean * (y - top)) / (yb - top)
  const out = [ridge([[cx, top], [X(yb), yb]], { k, sl, sr, main: true })]
  for (const [f, dir, spread] of spurs) {
    const y0 = Math.round(top + f * (base - top)), x0 = X(y0)
    out.push(ridge([[x0, y0], [x0 + dir * spread * (yb - y0), yb]], { k: k * 1.15, sl: sl * 1.1, sr: sr * 1.1, z0: k * (y0 - top) - 0.6 }))
  }
  return out
}

// Peint les arêtes dans le tampon. snow : 0 = nu, sinon profondeur relative du manteau (0..1), 1 = tout blanc.
function mountain(B, ridges, { ramp = GRANITE, snow = 0, seed = 1, base = B.h - 1 } = {}) {
  const W = B.w, H = B.h, info = new Array(W * H).fill(null)
  for (let y = 0; y <= base; y++)
    for (let x = 0; x < W; x++) {
      // silhouette : arêtes principales seules, versants droits
      let inside = false
      for (const r of ridges) if (r.main) { const v = r.z(x + 0.5, y + 0.5); if (v && v.z > 0) inside = true }
      if (!inside) continue
      // facette : l'arête (principale ou contrefort) la plus en avant à cet endroit
      let best = null, bi = -1
      ridges.forEach((r, i) => { const v = r.z(x + 0.5, y + 0.5); if (v && (!best || v.z > best.z)) (best = v), (bi = i) })
      info[y * W + x] = { ...best, r: bi }
    }
  const at = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? null : info[y * W + x])
  // sommet de chaque colonne (pour la neige)
  const topY = new Array(W).fill(H)
  let summit = H
  for (let x = 0; x < W; x++) for (let y = 0; y < H; y++) if (at(x, y)) { topY[x] = y; summit = Math.min(summit, y); break }
  const height = base - summit
  // neige : un manteau depuis le haut, plus épais sur les faces qui regardent le ciel, en langues par colonne
  const rawSnow = (x, y) => {
    if (snow >= 1) return true
    if (snow <= 0) return false
    const p = at(x, y), ny = -p.dy * 0.8, l = Math.hypot(-p.dx * 0.5, ny, 1)
    // altitude depuis le sommet le plus haut, ou depuis le sommet de son propre épaulement (petit chapeau)
    let apex = H
    for (const r of ridges) if (r.main) { const v = r.z(x + 0.5, y + 0.5); if (v && v.z > 0) apex = Math.min(apex, r.top) }
    const d = Math.min((y - summit) / Math.max(1, height), ((y - apex) / Math.max(1, height)) * 2.2), up = clamp(-ny / l, 0, 1)
    const streak = vnoise(x, 0, 3, seed + 7) - 0.5
    return d < snow * (0.75 + up * 0.6) + streak * 0.25 * snow
  }
  const snowCut = new Array(W).fill(0)
  for (let x = 0; x < W; x++) {
    let y = topY[x]
    while (y <= base && at(x, y) && rawSnow(x, y)) y++
    snowCut[x] = y
  }
  const mat = new Array(W * H).fill(-1), idx = new Int8Array(W * H).fill(-1)
  for (let y = 0; y <= base; y++)
    for (let x = 0; x < W; x++) {
      const p = at(x, y)
      if (!p) continue
      const nx = -p.dx * 0.5, ny = -p.dy * 0.8, l = Math.hypot(nx, ny, 1)
      const L = (nx * LX + ny * LY + LZ) / l // éclairement de la facette
      // neige : une seule coulée par colonne, du haut jusqu'à la première roche (pas d'îlots)
      const isSnow = y < snowCut[x]
      let i
      if (isSnow) {
        i = L > 0.88 ? 4 : L > 0.65 ? 3 : L > 0.25 ? 2 : 1
        mat[y * W + x] = 1
      } else {
        const t = ramp.length
        i = L > 0.93 ? t - 2 : L > 0.8 ? t - 3 : L > 0.5 ? t - 4 : L > 0.1 ? t - 5 : 1
        i = Math.max(1, i)
        // paillettes rares du grain de la pierre
        const f = hsh(x * 7 + 3, y * 13 + 5, seed)
        if (f < 0.02) i = Math.min(t - 2, i + 1)
        else if (f > 0.98) i = Math.max(1, i - 1)
        mat[y * W + x] = 0
      }
      // arête vive : le côté éclairé qui touche le côté à l'ombre de la même arête prend un cran de plus
      const q = at(x + 1, y)
      if (q && p.left && !q.left && q.r === p.r && ridges[p.r].main) i += 1
      // pli entre deux arêtes : le pixel le plus bas (à l'ombre) s'assombrit
      const u = at(x, y - 1)
      if (u && u.r !== p.r && L < 0.4) i -= 1
      if (y === base) i -= 1
      idx[y * W + x] = i
    }
  // bord sélectif dans la teinte la plus sombre du matériau (un cran côté lumière, deux côté ombre)
  const empty = (x, y) => !at(x, y)
  for (let y = 0; y <= base; y++)
    for (let x = 0; x < W; x++) {
      const p = y * W + x
      if (mat[p] < 0) continue
      const R = mat[p] ? SNOW : ramp
      let i = idx[p]
      const lit = empty(x - 1, y) || empty(x, y - 1), dark = empty(x + 1, y)
      if (dark) i -= 2
      else if (lit) i -= mat[p] ? 0 : 1
      B.set(x, y, R[clamp(i, mat[p] ? 1 : 1, R.length - 1)])
    }
}

// ================================================================ variantes

const draw = (fn) => (c) => { const B = Buf(c.w, c.h); fn(B, c.h - 1); B.flush(c) }

// grand pic flanqué de deux épaulements qui dépassent de ses versants
const big = (g) => [
  ...peak(32, 3, g, { sl: 2.3, sr: 2.5, spurs: [[0.35, -1, 0.7], [0.5, 1, 0.6]] }),
  ...peak(13, 31, g, { spurs: [[0.5, -1, 0.6]] }),
  ...peak(50, 27, g, { spurs: [[0.5, 1, 0.6]] }),
]
// pic moyen à un épaulement à droite
const mid = (g) => [
  ...peak(21, 3, g, { sl: 2.2, sr: 2.5, spurs: [[0.35, -1, 0.7], [0.55, 1, 0.6]] }),
  ...peak(37, 21, g, { spurs: [[0.5, 1, 0.6]] }),
]
sprite("fxmountain_peak_snow_64", { w: 64, h: 64 }, draw((B, g) => mountain(B, big(g), { snow: 0.42, seed: 3 })))
sprite("fxmountain_peak_snow_48", { w: 48, h: 48 }, draw((B, g) => mountain(B, mid(g), { snow: 0.42, seed: 5 })))
sprite("fxmountain_peak_snow_32", { w: 32, h: 32 }, draw((B, g) =>
  mountain(B, peak(16, 2, g, { sl: 2, sr: 2.1, spurs: [[0.45, -1, 0.6], [0.55, 1, 0.5]] }), { snow: 0.42, seed: 8 })))
sprite("fxmountain_peak_snow_16", { w: 16, h: 16 }, draw((B, g) =>
  mountain(B, peak(8, 1, g, { sl: 1.9, sr: 2 }), { snow: 0.45, seed: 2 })))
sprite("fxmountain_peak_bare_48", { w: 48, h: 48 }, draw((B, g) => mountain(B, [
  ...peak(27, 4, g, { sl: 2.2, sr: 2.5, spurs: [[0.35, 1, 0.6], [0.5, -1, 0.7]] }),
  ...peak(10, 24, g, { spurs: [[0.5, -1, 0.6]] }),
], { seed: 5 })))
sprite("fxmountain_peak_winter_48", { w: 48, h: 48 }, draw((B, g) => mountain(B, mid(g), { snow: 1, seed: 5 })))
sprite("fxmountain_twin_snow_64", { w: 64, h: 64 }, draw((B, g) => mountain(B, [
  ...peak(22, 5, g, { sl: 2.6, sr: 2.8, spurs: [[0.4, -1, 0.7]] }),
  ...peak(44, 14, g, { sl: 2.6, sr: 2.8, spurs: [[0.45, 1, 0.6]] }),
], { snow: 0.4, seed: 12 })))
sprite("fxmountain_range_snow_64", { w: 64, h: 32 }, draw((B, g) => mountain(B, [
  ...peak(12, 10, g, { spurs: [[0.5, -1, 0.6]] }),
  ...peak(52, 8, g, { spurs: [[0.5, 1, 0.6]] }),
  ...peak(32, 2, g, { spurs: [[0.45, -1, 0.6], [0.55, 1, 0.5]] }),
], { snow: 0.5, seed: 21 })))
sprite("fxmountain_peak_sandstone_48", { w: 48, h: 48 }, draw((B, g) => mountain(B, [
  ...peak(24, 8, g, { sl: 1.9, sr: 2.1, spurs: [[0.4, -1, 0.7], [0.5, 1, 0.6]] }),
  ...peak(11, 26, g, { sl: 1.9, sr: 2.1 }),
  ...peak(37, 23, g, { sl: 1.9, sr: 2.1, spurs: [[0.5, 1, 0.5]] }),
], { ramp: SANDSTONE, seed: 31 })))

sheet("fxmountains", ["fxmountain_*"], { pad: 2 })
