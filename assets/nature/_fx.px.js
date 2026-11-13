// Outils communs du rendu « style pixelfx » des familles fx* (fxtree, fxrock, fxgrass…).
// Fichier commençant par « _ » : ignoré par le build, inclus après la palette :
//   include("../_palette.px.js")
//   include("_fx.px.js")
// On peint dans un tampon de clés (W x H), puis on recopie sur le canevas : chaque matériau est
// ombré par paliers francs de sa rampe selon la lumière (haut-gauche), sans contour noir (bord
// sélectif dans la teinte la plus sombre du matériau).

const LEAF = ["1", "G", "g", "l", "L", "2"] // feuillage, herbe, mousse
const BARK = ["3", "B", "b", "n", "N"]
const LX = -0.55, LY = -0.72, LZ = 0.42 // direction de la lumière (normalisée à peu près)

const hsh = (x, y, s) => {
  let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(s | 0, 982451653)) | 0
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}
// bruit de valeur lissé, échelle `sc` px (texture de feuillage, jamais du grain pixel à pixel)
const vnoise = (x, y, sc, s) => {
  const gx = x / sc, gy = y / sc, x0 = Math.floor(gx), y0 = Math.floor(gy)
  const fx = gx - x0, fy = gy - y0, sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy)
  const a = hsh(x0, y0, s), b = hsh(x0 + 1, y0, s), c = hsh(x0, y0 + 1, s), d = hsh(x0 + 1, y0 + 1, s)
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy
}
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const pick = (ramp, v) => ramp[clamp(Math.floor(v * ramp.length), 0, ramp.length - 1)]

function Buf(w, h) {
  const k = new Array(w * h).fill(".")
  return {
    w, h, k,
    get: (x, y) => (x < 0 || y < 0 || x >= w || y >= h ? "." : k[y * w + x]),
    set: (x, y, c) => { if (x >= 0 && y >= 0 && x < w && y < h) k[y * w + x] = c },
    flush: (c) => { for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (k[y * w + x] !== ".") c.px(x, y, k[y * w + x]) },
  }
}

// Ombre translucide au sol, décalée vers la droite (lumière à gauche).
function groundShadow(B, cx, gy, rx, ry = 2) {
  for (let y = gy - ry; y <= gy; y++)
    for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
      const dx = (x + 0.5 - cx) / rx, dy = (y + 0.5 - gy) / (ry + 0.5)
      if (dx * dx + dy * dy <= 1 && B.get(x, y) === ".") B.set(x, y, "%")
    }
}

// Bord sélectif commun : les pixels au bord du vide descendent d'un palier (deux côté ombre).
function selout(B, idx, ramp) {
  const empty = (x, y) => x < 0 || y < 0 || x >= B.w || y >= B.h || idx[y * B.w + x] < 0
  const out = Int8Array.from(idx)
  for (let y = 0; y < B.h; y++)
    for (let x = 0; x < B.w; x++) {
      const i = idx[y * B.w + x]
      if (i < 0) continue
      const lit = empty(x - 1, y) || empty(x, y - 1), dark = empty(x + 1, y) || empty(x, y + 1)
      if (lit || dark) out[y * B.w + x] = Math.max(0, i - (dark ? 2 : 1))
    }
  for (let p = 0; p < out.length; p++) if (out[p] >= 0) B.k[p] = ramp[out[p]]
  return { at: (x, y) => (x < 0 || y < 0 || x >= B.w || y >= B.h ? -1 : out[y * B.w + x]) }
}


// Halo de lumière émise (soleil, lune, étoiles…) : les pixels vides à moins de r1 px d'un pixel de `keys`
// prennent la clé translucide forte k1, jusqu'à r2 px la faible k2 (halo rond, jamais sur un pixel opaque).
function halo(B, keys, r1, r2, k1, k2) {
  const src = []
  for (let y = 0; y < B.h; y++) for (let x = 0; x < B.w; x++) if (keys.includes(B.get(x, y))) src.push([x, y])
  const R = Math.ceil(r2), put = []
  for (let y = 0; y < B.h; y++)
    for (let x = 0; x < B.w; x++) {
      if (B.get(x, y) !== ".") continue
      let d = Infinity
      for (const [sx, sy] of src) if (Math.abs(sx - x) <= R && Math.abs(sy - y) <= R) d = Math.min(d, Math.hypot(sx - x, sy - y))
      if (d <= r1) put.push([x, y, k1])
      else if (d <= r2) put.push([x, y, k2])
    }
  for (const [x, y, c] of put) B.set(x, y, c)
}

// ================================================================ feuillage en grappes (fxtree, fxbush)

// Masses de feuillage -> grappes. masses = [[x, y, rx, ry, z]] (z : 0 fond … 2 devant).
// Chaque masse reçoit une couronne de grappes sur son pourtour (derrière) et d'autres à l'intérieur
// (devant). Retourne [[x, y, r, ordre, masse]].
function genClumps(masses, { seed = 1, rmin = 3.5, rmax = 6.5, density = 1 } = {}) {
  const R = rng(seed), out = []
  masses.forEach(([mx, my, mrx, mry, mz], mi) => {
    const per = Math.max(5, Math.round((Math.PI * (mrx + mry)) / 5.5 * density))
    for (let i = 0; i < per; i++) {
      const a = (i / per) * 2 * Math.PI + R() * 0.5, r = rmin + R() * (rmax - rmin)
      out.push([mx + Math.cos(a) * (mrx - r * 0.75), my + Math.sin(a) * (mry - r * 0.75), r, mz + R() * 0.3, mi])
    }
    const inner = Math.round(((mrx * mry) / 22) * density)
    for (let i = 0; i < inner; i++) {
      const a = R() * 2 * Math.PI, d = Math.sqrt(R()) * 0.62, r = rmin + 0.5 + R() * (rmax - rmin)
      out.push([mx + Math.cos(a) * mrx * d, my + Math.sin(a) * mry * d, r, mz + 0.4 + (1 - d) * 0.5 + R() * 0.1, mi])
    }
  })
  return out
}

// Couronne : grappes ombrées par formes (calotte éclairée vers la lumière, reflet, croissant d'ombre),
// modulées par la forme de leur masse et de toute la couronne, ombres portées, traits internes et
// bord sélectif. Retourne la carte des paliers (index de rampe) pour les retouches suivantes.
function crown(B, clumps, masses, { ramp = LEAF, seed = 1, bias = 0, leafAmp = 0.42, holes = [], byMass = false, caps = true }) {
  const order = clumps.map((c, i) => [...c, i]).sort((a, b) => a[3] - b[3] || a[5] - b[5])
  const own = new Int16Array(B.w * B.h).fill(-1)
  order.forEach(([X, Y, r, , , i], oi) => {
    const k = Math.max(4, Math.round((2 * Math.PI * r) / 4.5))
    for (let y = Math.floor(Y - r * 1.3); y <= Y + r * 1.3; y++)
      for (let x = Math.floor(X - r * 1.3); x <= X + r * 1.3; x++) {
        if (x < 0 || y < 0 || x >= B.w || y >= B.h) continue
        const dx = x + 0.5 - X, dy = y + 0.5 - Y, a = Math.atan2(dy, dx)
        const edge = r * (1 + 0.14 * Math.sin(a * k + i * 1.7) + 0.16 * (vnoise(x, y, 2, seed + i) - 0.5))
        if (Math.hypot(dx, dy) <= edge) own[y * B.w + x] = oi
      }
  })
  for (const [hx, hy, hr] of holes) // trouées de ciel
    for (let y = Math.floor(hy - hr); y <= hy + hr; y++)
      for (let x = Math.floor(hx - hr); x <= hx + hr; x++)
        if (Math.hypot(x + 0.5 - hx, y + 0.5 - hy) <= hr * (1 + 0.3 * (vnoise(x, y, 1.5, seed + 99) - 0.5)) && x >= 0 && y >= 0 && x < B.w && y < B.h) own[y * B.w + x] = -1
  // forme de toute la couronne
  let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9
  for (const [mx, my, mrx, mry] of masses) { x0 = Math.min(x0, mx - mrx); x1 = Math.max(x1, mx + mrx); y0 = Math.min(y0, my - mry); y1 = Math.max(y1, my + mry) }
  const CX = (x0 + x1) / 2, CY = (y0 + y1) / 2, RX = (x1 - x0) / 2, RY = (y1 - y0) / 2
  const ell = (x, y, cx, cy, rx, ry) => {
    const gx = (x + 0.5 - cx) / rx, gy = (y + 0.5 - cy) / ry
    return gx * LX + gy * LY + Math.sqrt(Math.max(0, 1 - Math.min(1, gx * gx + gy * gy))) * LZ
  }
  const idx = new Int8Array(B.w * B.h).fill(-1)
  const n = ramp.length
  for (let y = 0; y < B.h; y++)
    for (let x = 0; x < B.w; x++) {
      const o = own[y * B.w + x]
      if (o < 0) continue
      const [X, Y, r, z, mi] = order[o]
      const [mx, my, mrx, mry, mz] = masses[mi]
      const leafy = 1 + leafAmp * (vnoise(x, y, 1.6, seed + o * 13) - 0.5)
      const inDisc = (ox, oy, rr) => Math.hypot(x + 0.5 - (X + ox * r), y + 0.5 - (Y + oy * r)) <= rr * r * leafy
      let v = 0.34 + 0.1 * ell(x, y, CX, CY, RX, RY) + 0.14 * ell(x, y, mx, my, mrx, mry) + 0.06 * (mz - 1) + 0.05 * (z - mz) + bias
      if (caps && inDisc(-0.3, -0.34, 0.7)) v += 0.17
      if (caps && inDisc(-0.44, -0.5, 0.36)) v += 0.17
      if (caps && !inDisc(-0.1, -0.12, 0.98)) v -= 0.17
      // byMass : seules les masses (étages) se font de l'ombre, pas les grappes entre elles
      const rank = (q) => (q < 0 ? -1 : byMass ? order[q][3] : q), me = byMass ? z : o
      const at = (dx, dy) => rank(own[clamp(y + dy, 0, B.h - 1) * B.w + clamp(x + dx, 0, B.w - 1)])
      const front = (q) => (byMass ? q > me + 0.6 : q > me)
      // ombre portée par une grappe de devant située vers la lumière
      if (front(at(-1, -2)) || front(at(-2, -3)) || front(at(0, -2))) v -= 0.22
      // bord d'une grappe de devant posée sur une grappe du fond (côté ombre) : trait sombre interne
      if (!byMass && ((at(1, 0) >= 0 && at(1, 0) < me) || (at(0, 1) >= 0 && at(0, 1) < me))) v -= 0.17
      // byMass : aiguilles en rangées (bandes horizontales légères, pas de grain pixel)
      if (byMass) v += 0.12 * (vnoise(x * 0.6, y * 1.6, 1.5, seed) - 0.5) - 0.1 * ((y + 0.5 - (my - mry)) / (2 * mry))
      idx[y * B.w + x] = clamp(Math.floor(v * n), 0, n - 1)
    }
  return selout(B, idx, ramp)
}

