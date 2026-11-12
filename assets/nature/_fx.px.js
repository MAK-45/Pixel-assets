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

