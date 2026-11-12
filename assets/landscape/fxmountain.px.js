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
  }
}

// arête principale d'un pic qui descend en zigzag, plus des contreforts partis de ses coudes
function peak(cx, top, base, { seed = 1, k = 1, sl = 2.1, sr = 2.5, spurs = 3, jag = 2.5, drift = 2 } = {}) {
  const R = rng(seed), pts = [[cx, top]], n = Math.max(2, Math.round((base - top) / 7))
  for (let i = 1; i <= n; i++) pts.push([cx + drift * (i / n) + (i < n ? (R() - 0.5) * jag * 2 : 0), top + ((base + 4 - top) * i) / n])
  const out = [ridge(pts, { k, sl, sr, main: true })]
  for (let s = 0; s < spurs; s++) {
    // un contrefort part d'un coude de l'arête principale, à sa hauteur, et s'écarte en descendant :
    // entre les deux, un couloir ; de chaque côté, de nouvelles facettes
    const j = 1 + Math.floor(R() * (pts.length - 2)), [x0, y0] = pts[j], dir = s % 2 ? 1 : -1, spread = 0.4 + R() * 0.4
    const yb = base + 4, mid = y0 + (yb - y0) * 0.5, zs = k * (y0 - top)
    out.push(ridge([[x0, y0], [x0 + dir * (spread * (mid - y0) + (R() - 0.5) * 2), mid], [x0 + dir * spread * (yb - y0), yb]],
      { k: k * (1.12 + R() * 0.15), sl: sl * (0.7 + R() * 0.6), sr: sr * (0.7 + R() * 0.6), z0: zs - 1 }))
  }
  return out
}

// Peint les arêtes dans le tampon. snow : 0 = nu, sinon profondeur relative du manteau (0..1), 1 = tout blanc.
function mountain(B, ridges, { ramp = GRANITE, snow = 0, seed = 1, base = B.h - 1, env = true } = {}) {
  const W = B.w, H = B.h, info = new Array(W * H).fill(null)
  for (let y = 0; y <= base; y++)
    for (let x = 0; x < W; x++) {
      let best = null, bi = -1
      ridges.forEach((r, i) => { const v = r.z(x + 0.5, y + 0.5); if (v && (!best || v.z > best.z)) (best = v), (bi = i) })
      if (!best) continue
      // bord découpé au bruit lissé (silhouette rocheuse, pas de marches régulières)
      if (best.z + (vnoise(x, y, 3, seed) - 0.5) * 2.4 <= 0.4) continue
      // enveloppe : la montagne s'évase jusqu'au bas du canevas sans jamais toucher ses bords
      const m = 1 + ((W / 2 - 1.5) * (y + 1)) / (base + 1) + (vnoise(x, y, 4, seed + 3) - 0.5) * 2
      if (env && Math.abs(x + 0.5 - W / 2) > m) continue
      info[y * W + x] = { ...best, r: bi }
    }
  const at = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? null : info[y * W + x])
  // sommet de chaque colonne (pour la neige)
  const topY = new Array(W).fill(H)
  let summit = H
  for (let x = 0; x < W; x++) for (let y = 0; y < H; y++) if (at(x, y)) { topY[x] = y; summit = Math.min(summit, y); break }
  const height = base - summit
  const mat = new Array(W * H).fill(-1), idx = new Int8Array(W * H).fill(-1)
  for (let y = 0; y <= base; y++)
    for (let x = 0; x < W; x++) {
      const p = at(x, y)
      if (!p) continue
      const nx = -p.dx * 0.5, ny = -p.dy * 0.8, l = Math.hypot(nx, ny, 1)
      const L = (nx * LX + ny * LY + LZ) / l // éclairement de la facette
      // neige : un manteau depuis le haut, plus épais sur les faces qui regardent le ciel, qui coule en couloirs
      let isSnow = false
      if (snow >= 1) isSnow = true
      else if (snow > 0) {
        const d = (y - summit) / Math.max(1, height), up = clamp(-ny / l, 0, 1)
        const streak = vnoise(x, y / 5, 2, seed + 7) - 0.5
        isSnow = d < snow * (0.75 + up * 0.6) + streak * 0.35 * snow
      }
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

sprite("fxmountain_peak_snow_64", { w: 64, h: 64 }, draw((B, g) =>
  mountain(B, peak(31, 3, g, { seed: 3, spurs: 4, jag: 3 }), { snow: 0.4, seed: 3 })))
sprite("fxmountain_peak_snow_48", { w: 48, h: 48 }, draw((B, g) =>
  mountain(B, peak(22, 3, g, { seed: 5, spurs: 3 }), { snow: 0.42, seed: 5 })))
sprite("fxmountain_peak_snow_32", { w: 32, h: 32 }, draw((B, g) =>
  mountain(B, peak(15, 2, g, { seed: 8, spurs: 2, jag: 1.5, drift: 1 }), { snow: 0.42, seed: 8 })))
sprite("fxmountain_peak_snow_16", { w: 16, h: 16 }, draw((B, g) =>
  mountain(B, peak(7.5, 1, g, { seed: 2, spurs: 0, jag: 0.5, drift: 0.5, k: 1, sl: 1.9, sr: 2.1 }), { snow: 0.45, seed: 2 })))
sprite("fxmountain_peak_bare_48", { w: 48, h: 48 }, draw((B, g) =>
  mountain(B, peak(22, 3, g, { seed: 5, spurs: 3 }), { snow: 0, seed: 5 })))
sprite("fxmountain_peak_winter_48", { w: 48, h: 48 }, draw((B, g) =>
  mountain(B, peak(22, 3, g, { seed: 5, spurs: 3 }), { snow: 1, seed: 5 })))
sprite("fxmountain_twin_snow_64", { w: 64, h: 64 }, draw((B, g) =>
  mountain(B, [...peak(40, 14, g, { seed: 13, spurs: 2, sl: 2.4, sr: 2.8 }), ...peak(24, 4, g, { seed: 12, spurs: 3, sl: 2.4, sr: 2.8 })], { snow: 0.38, seed: 12 })))
sprite("fxmountain_range_snow_64", { w: 64, h: 32 }, draw((B, g) =>
  mountain(B, [
    ...peak(51, 9, g, { seed: 22, spurs: 1, k: 1, sl: 2, sr: 2.4, jag: 1.5 }),
    ...peak(12, 7, g, { seed: 21, spurs: 1, k: 1, sl: 2, sr: 2.4, jag: 1.5 }),
    ...peak(30, 1, g, { seed: 23, spurs: 2, k: 1, sl: 2, sr: 2.4, jag: 1.5 }),
  ], { snow: 0.55, seed: 21, env: false })))
sprite("fxmountain_peak_sandstone_48", { w: 48, h: 48 }, draw((B, g) =>
  mountain(B, peak(23, 6, g, { seed: 31, spurs: 5, k: 1, sl: 1.9, sr: 2.3 }), { ramp: SANDSTONE, seed: 31 })))

sheet("fxmountains", ["fxmountain_*"], { pad: 2 })
