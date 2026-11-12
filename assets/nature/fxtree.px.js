include("../_palette.px.js")

const meta = {
  title: "Arbre (style pixelfx)",
  description: "Arbres vus de face au rendu riche inspiré de la bibliothèque d'effets pixelfx : pas de contour noir (bord dans la teinte la plus sombre du matériau), couronnes en grappes modelées par la lumière en haut à gauche, ombres portées entre les grappes, ombre translucide au sol, effets figés (halos, lucioles, pétales, feuilles, neige scintillante). Variantes : chêne été / automne / nuit à lucioles, cerisier en fleurs, sapin et sapin enneigé, arbre-esprit luminescent, en 64 et 32 px. Les halos sont semi-transparents : ils rendent mieux sur fond sombre.",
  tags: ["tree", "plant", "forest", "nature", "decoration", "scenery", "realistic", "pixelfx"],
  variants: {
    oak_summer_64: { label: "Chêne – été (64 px)", props: { species: "oak", season: "summer", effect: "none" } },
    oak_autumn_64: { label: "Chêne – automne, feuilles qui tombent (64 px)", props: { species: "oak", season: "autumn", effect: "leaves" } },
    cherry_64: { label: "Cerisier en fleurs, pétales au vent (64 px)", props: { species: "cherry", season: "spring", effect: "petals" }, tags: ["blossom", "sakura"] },
    pine_64: { label: "Sapin (64 px)", props: { species: "pine", season: "summer", effect: "none" }, tags: ["conifer", "fir"] },
    pine_snow_64: { label: "Sapin enneigé, scintillements (64 px)", props: { species: "pine", season: "winter", effect: "snow" }, tags: ["conifer", "fir", "snow"] },
    spirit_64: { label: "Arbre-esprit luminescent (64 px)", props: { species: "spirit", season: "summer", effect: "glow" }, tags: ["magic", "fantasy", "glow"] },
    oak_summer_32: { label: "Chêne – été (32 px)", props: { species: "oak", season: "summer", effect: "none" } },
    oak_autumn_32: { label: "Chêne – automne (32 px)", props: { species: "oak", season: "autumn", effect: "leaves" } },
    cherry_32: { label: "Cerisier en fleurs (32 px)", props: { species: "cherry", season: "spring", effect: "petals" }, tags: ["blossom", "sakura"] },
    pine_32: { label: "Sapin (32 px)", props: { species: "pine", season: "summer", effect: "none" }, tags: ["conifer", "fir"] },
    pine_snow_32: { label: "Sapin enneigé (32 px)", props: { species: "pine", season: "winter", effect: "snow" }, tags: ["conifer", "fir", "snow"] },
    spirit_32: { label: "Arbre-esprit luminescent (32 px)", props: { species: "spirit", season: "summer", effect: "glow" }, tags: ["magic", "fantasy", "glow"] },
    oak_night_64: { label: "Chêne – nuit d'été, lucioles (64 px)", props: { species: "oak", season: "summer", effect: "fireflies" }, tags: ["night", "glow"] },
  },
}

// ================================================================ moteur de rendu
// On peint dans un tampon de clés (W x H), puis on recopie sur le canevas. Chaque grappe de
// feuilles est une petite sphère : sa normale donne la lumière (haut-gauche), quantifiée en paliers
// francs de la rampe. S'y ajoutent la forme globale de la couronne, la profondeur (grappes du fond
// plus sombres), l'ombre portée des grappes de devant et un bord sélectif sombre.

const LEAF = ["1", "G", "g", "l", "L", "2"]
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

// Tronc cylindrique : centre x, haut `top`, sol `bot`, largeurs haut/bas, évasement des racines.
function trunk(B, { x, top, bot, wTop, wBot, flare = 3, lean = 0, seed = 1, ramp = BARK, dark = 0 }) {
  for (let y = top; y <= bot; y++) {
    const t = (y - top) / Math.max(1, bot - top)
    const rootT = clamp((t - 0.78) / 0.22, 0, 1)
    const half = (wTop + (wBot - wTop) * t) / 2 + flare * rootT * rootT
    const cx = x + lean * (1 - t)
    for (let px = Math.floor(cx - half); px <= Math.ceil(cx + half) - 1; px++) {
      const u = (px + 0.5 - cx) / half // -1 gauche … 1 droite
      if (Math.abs(u) > 1) continue
      // stries d'écorce verticales : bruit étiré en hauteur
      const groove = vnoise(px * 3, y * 0.3, 2, seed)
      let v = 0.5 - 0.42 * u - dark
      if (groove < 0.4) v -= 0.22 // sillons sombres
      else if (groove > 0.78 && u < 0.4) v += 0.14 // crêtes éclairées
      if (y - top < 5) v -= (5 - (y - top)) * 0.06 // sous la couronne : plus sombre
      if (Math.abs(u) > 0.82) v -= 0.25 // bords arrondis
      B.set(px, y, pick(ramp, v))
    }
  }
}

// Branche : trait épais ombré (côté gauche éclairé).
function branch(B, pts, w, { ramp = BARK, only } = {}) {
  for (let i = 0; i + 3 < pts.length; i += 2) {
    const [x0, y0, x1, y1] = pts.slice(i, i + 4)
    const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0) * 2)
    for (let s = 0; s <= n; s++) {
      const t = s / n, cx = x0 + (x1 - x0) * t, cy = y0 + (y1 - y0) * t
      const ww = w * (1 - 0.45 * ((i / 2 + t) / (pts.length / 2 - 1)))
      for (let dy = -Math.ceil(ww); dy <= Math.ceil(ww); dy++)
        for (let dx = -Math.ceil(ww); dx <= Math.ceil(ww); dx++) {
          if (dx * dx + dy * dy > ww * ww * 0.55 + 0.3) continue
          const X = Math.round(cx + dx), Y = Math.round(cy + dy)
          if (only && !only(X, Y)) continue
          B.set(X, Y, pick(ramp, 0.5 - dx / (ww + 0.5) * 0.35))
        }
    }
  }
}

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

// Touffes d'herbe au pied (brins de 1 px, plus clairs au sommet).
function tufts(B, gy, xs, seed = 3, ramp = LEAF) {
  const r = rng(seed)
  for (const x0 of xs)
    for (let j = 0; j < 4; j++) {
      const x = x0 + j - 1, h = 1 + Math.floor(r() * 3)
      for (let k = 0; k < h; k++) if (B.get(x, gy - k) === "." || B.get(x, gy - k) === "%") B.set(x, gy - k, ramp[clamp(1 + k + (j === 0 ? 1 : 0), 0, 4)])
    }
}

// ================================================================ effets (statiques)
// Chaque effet est une fonction (B, cr, R) appelée après la couronne ; R = générateur seedé.

const isAir = (B, x, y) => { const k = B.get(x, y); return k === "." || k === "%" || k === "~" || k === ";" }
// Monte un pixel opaque de `n` crans dans la rampe qui le contient (lumière reçue).
const brighten = (B, x, y, n, ramps) => {
  const k = B.get(x, y)
  for (const r of ramps) { const i = r.indexOf(k); if (i >= 0) return B.set(x, y, r[clamp(i + n, 0, r.length - 1)]) }
}

// Halo translucide autour de toute la silhouette (fort au contact, faible au-delà).
const aura = (strong, weak, reach = 3) => (B) => {
  const solid = (x, y) => { const k = B.get(x, y); return k !== "." && k !== "%" }
  const d = []
  for (let y = 0; y < B.h; y++)
    for (let x = 0; x < B.w; x++) {
      if (solid(x, y)) continue
      let best = 99
      for (let dy = -reach; dy <= reach; dy++) for (let dx = -reach; dx <= reach; dx++) if (solid(x + dx, y + dy)) best = Math.min(best, Math.hypot(dx, dy))
      if (best <= 1.01) d.push([x, y, strong])
      else if (best <= reach) d.push([x, y, weak])
    }
  for (const [x, y, k] of d) if (B.get(x, y) === ".") B.set(x, y, k)
}

// Points lumineux (lucioles, spores) : cœur, halo translucide dans l'air, lumière sur les feuilles.
const lights = (pts, { core = "Y", ring = "y", strong = "^", weak = "~", ramps = [] } = {}) => (B) => {
  for (const [x, y, big] of pts) {
    for (let dy = -3; dy <= 3; dy++)
      for (let dx = -3; dx <= 3; dx++) {
        const d = Math.hypot(dx, dy), X = x + dx, Y = y + dy
        if (d > 2.9 || (dx === 0 && dy === 0)) continue
        if (isAir(B, X, Y)) { if (d <= 1.01) B.set(X, Y, strong); else if (d <= 2.3 && B.get(X, Y) !== strong) B.set(X, Y, weak) }
        else if (d <= 2.3) brighten(B, X, Y, d <= 1.5 ? 2 : 1, ramps)
      }
    B.set(x, y, core)
    if (big) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) B.set(x + dx, y + dy, ring)
  }
}

// Étincelles en croix (neige, rosée, magie) : cœur + bras d'un pixel.
const glints = (pts, core = "w", arm = "s") => (B) => {
  for (const [x, y, big] of pts) {
    B.set(x, y, core)
    if (big) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) B.set(x + dx, y + dy, arm)
  }
}

// Petites formes qui flottent dans l'air (feuilles, pétales) : liste de motifs [dx, dy, palier].
const LEAF_SHAPES = [
  [[0, 0, 2], [1, 0, 1], [1, 1, 0]], [[0, 0, 2], [1, 0, 2], [2, 0, 1], [1, 1, 0]], [[1, 0, 2], [0, 1, 1], [1, 1, 1], [2, 1, 0]],
  [[0, 0, 1], [1, 1, 2], [2, 1, 1]], [[0, 0, 2], [0, 1, 1]],
]
const PETAL_SHAPES = [[[0, 0, 2]], [[0, 0, 2], [1, 0, 1]], [[0, 0, 2], [1, 1, 1]], [[0, 0, 1], [0, 1, 2]]]
const floaters = (pts, colors, shapes) => (B, cr, R) => {
  for (const [x, y] of pts) {
    const sh = shapes[Math.floor(R() * shapes.length)], flip = R() < 0.5
    for (const [dx, dy, t] of sh) { const X = x + (flip ? -dx : dx), Y = y + dy; if (isAir(B, X, Y)) B.set(X, Y, colors[t]) }
  }
}
// Litière au sol : quelques feuilles/pétales tombés sur la ligne de sol et autour.
const litter = (xs, colors) => (B, cr, R) => {
  const gy = B.h - 1
  for (const x of xs) {
    B.set(x, gy, colors[1 + Math.floor(R() * 2)])
    if (R() < 0.6) B.set(x + 1, gy, colors[Math.floor(R() * 2)])
    if (R() < 0.3 && isAir(B, x, gy - 1)) B.set(x, gy - 1, colors[2])
  }
}

// Neige posée : sur les pixels de la couronne exposés vers le haut (épaisseur 1 à 2 px selon la
// lumière), ombre bleutée dessous ; `cover` ajoute de la neige sur les paliers les plus éclairés.
const snow = (ramps, { cover = 0 } = {}) => (B) => {
  const keys = new Set(ramps.flat())
  const caps = []
  for (let y = 1; y < B.h; y++)
    for (let x = 0; x < B.w; x++) if (keys.has(B.get(x, y)) && !keys.has(B.get(x, y - 1)) && B.get(x, y - 1) !== "w") caps.push([x, y])
  for (const [x, y] of caps) {
    const lit = x < B.w * 0.5
    B.set(x, y, lit ? "w" : "s")
    if (keys.has(B.get(x, y + 1))) B.set(x, y + 1, lit ? "s" : "S")
    if (lit && keys.has(B.get(x, y + 2)) && (x + y) % 3 === 0) B.set(x, y + 2, "S")
  }
  // plaques de neige sur les zones éclairées, en taches (bruit lissé), jamais en grain
  if (cover) for (const r of ramps) for (let y = 0; y < B.h; y++) for (let x = 0; x < B.w; x++) {
    const i = r.indexOf(B.get(x, y))
    if (i >= r.length - cover && vnoise(x, y, 2.5, 77) > 0.36) B.set(x, y, vnoise(x, y, 2.5, 77) > 0.62 ? "w" : "s")
  }
}
// Flaque de lumière au sol (sous un arbre lumineux) : halo translucide fort au centre, faible autour.
const pool = (cx, rx, strong, weak) => (B) => {
  const gy = B.h - 1
  for (let y = gy - 2; y <= gy; y++)
    for (let x = Math.floor(cx - rx); x <= cx + rx; x++) {
      const dx = (x + 0.5 - cx) / rx, dy = (y + 0.5 - gy) / 2.5
      const d = dx * dx + dy * dy
      if (d <= 1 && isAir(B, x, y)) B.set(x, y, d < 0.35 ? strong : weak)
    }
}
// Congère au pied : dôme blanc ombré à droite, recouvre le bas du tronc.
const drift = (cx, rx, ry = 3) => (B) => {
  const gy = B.h - 1
  for (let y = gy - ry; y <= gy; y++)
    for (let x = Math.floor(cx - rx); x <= cx + rx; x++) {
      const dx = (x + 0.5 - cx) / rx, dy = (y + 0.5 - (gy + 1)) / (ry + 0.5)
      if (dx * dx + dy * dy > 1) continue
      const top = (x + 0.5 - cx) ** 2 / rx ** 2 + (y - 0.5 - (gy + 1)) ** 2 / (ry + 0.5) ** 2 > 1
      B.set(x, y, top ? (dx < 0.3 ? "w" : "s") : dx > 0.45 ? "S" : "s")
    }
}

// ================================================================ constructeur d'arbre
// spec : masses de feuillage, tronc, branches (avant la couronne), branches visibles dans l'ombre,
// touffes, ombre au sol. opt : rampes, décalage de valeur, effets.

function tree(spec, { ramp = LEAF, bark = BARK, bias = 0, barkDark = 0, fx = [], seed = spec.seed ?? 1, clump = {}, grass = true } = {}) {
  return (c) => {
    const B = Buf(c.w, c.h), gy = c.h - 1, R = rng(seed * 31 + 7)
    const [sx, srx] = spec.shadow
    groundShadow(B, sx, gy, srx, spec.shadowRy ?? 2)
    trunk(B, { ...spec.trunk, bot: gy, seed, ramp: bark, dark: barkDark })
    for (const [pts, w] of spec.limbs ?? []) branch(B, pts, w, { ramp: bark })
    const clumps = genClumps(spec.masses, { seed, ...spec.clump, ...clump })
    const cr = crown(B, clumps, spec.masses, { ramp, seed, bias, holes: spec.holes ?? [], leafAmp: spec.leafAmp ?? 0.42 })
    const dark = (x, y) => cr.at(x, y) >= 0 && cr.at(x, y) <= 1
    for (const [pts, w] of spec.peeks ?? []) branch(B, pts, w, { ramp: bark, only: dark })
    if (grass) tufts(B, gy, spec.tufts ?? [], seed + 2)
    for (const f of fx) f(B, cr, R)
    B.flush(c)
  }
}

// Points répartis au hasard (mais reproductibles) dans un rectangle.
const spread = (n, x, y, w, h, seed, big = 0) => {
  const R = rng(seed)
  return Array.from({ length: n }, () => [Math.round(x + R() * w), Math.round(y + R() * h), R() < big])
}

// ================================================================ rampes des variantes

const AUTUMN = ["B", "R", "r", "o", "y", "Y"]
const NIGHT = ["q", "j", "J", "t", "T"]
const NIGHT_BARK = ["q", "D", "a", "A"]
const BLOSSOM = ["5", "6", "z", "Z", "7", "w"]
const CHERRY_BARK = ["3", "3", "B", "A", "f"]
const PINE = ["4", "P", "p", "e", "E"]
const SPIRIT = ["8", "8", "9", "0", "+", "w"]
const SPIRIT_BARK = ["Q", "d", "m", "c", "C"]

// ================================================================ chêne

const OAK64 = {
  masses: [[15, 28, 13, 11, 0], [48, 27, 13, 11, 0], [31, 15, 17, 13, 1], [31, 33, 13, 10, 2]],
  trunk: { x: 32, top: 36, wTop: 6, wBot: 9, flare: 4, lean: -1 },
  limbs: [[[31, 42, 25, 37, 19, 33], 2], [[33, 42, 39, 37, 44, 33], 2]],
  peeks: [[[31, 44, 24, 37, 17, 32], 1.6], [[33, 44, 41, 37, 48, 32], 1.6], [[32, 44, 33, 30, 35, 22], 1.8]],
  tufts: [24, 28, 38, 42],
  shadow: [36, 24],
}

sprite("fxtree_oak_summer_64", { w: 64, h: 64 }, tree(OAK64))

sprite("fxtree_oak_autumn_64", { w: 64, h: 64 }, tree(OAK64, {
  ramp: AUTUMN, bias: -0.02,
  fx: [
    floaters([[6, 50], [13, 44], [56, 47], [50, 54], [9, 58], [60, 40], [18, 54], [45, 49]], ["R", "r", "o"], LEAF_SHAPES),
    litter([14, 19, 22, 27, 38, 44, 47, 52, 55], ["R", "r", "o", "y"]),
  ],
}))

sprite("fxtree_oak_night_64", { w: 64, h: 64 }, tree(OAK64, {
  ramp: NIGHT, bark: NIGHT_BARK, bias: 0.07,
  fx: [lights([[9, 46, 1], [55, 44], [20, 52], [47, 55, 1], [40, 40], [16, 33], [57, 20], [6, 22], [27, 48]], { ramps: [NIGHT, NIGHT_BARK] })],
}))

// ================================================================ cerisier en fleurs
// Couronne en ombrelle, aérée : les trouées laissent voir les branches noires dessinées avant.

const CHERRY64 = {
  masses: [[11, 27, 10, 8, 0], [53, 26, 10, 8, 0], [21, 15, 12, 9, 1], [43, 14, 12, 9, 1], [32, 26, 13, 9, 2]],
  trunk: { x: 32, top: 40, wTop: 5, wBot: 8, flare: 3, lean: 1 },
  limbs: [
    [[31, 44, 25, 36, 17, 31, 9, 28], 2.4], [[33, 44, 39, 36, 47, 30, 55, 27], 2.4],
    [[32, 42, 29, 30, 23, 17], 2], [[33, 41, 37, 28, 43, 15], 2], [[25, 36, 24, 26], 1.2], [[40, 34, 42, 24], 1.2],
  ],
  holes: [[17, 22, 1.6], [46, 21, 1.6], [29, 19, 1.3], [39, 28, 1.3], [24, 31, 1.4], [52, 31, 1.1], [33, 9, 1.1]],
  clump: { rmin: 3, rmax: 5.5 },
  tufts: [25, 29, 37, 41],
  shadow: [36, 26],
}
const PETALS = ["6", "z", "Z"]

sprite("fxtree_cherry_64", { w: 64, h: 64 }, tree(CHERRY64, {
  ramp: BLOSSOM, bark: CHERRY_BARK, bias: 0.02, seed: 4,
  fx: [
    floaters([[5, 42], [12, 48], [58, 45], [52, 52], [8, 56], [60, 36], [20, 52], [46, 47], [3, 30], [61, 54], [15, 39]], PETALS, PETAL_SHAPES),
    litter([13, 17, 21, 26, 39, 43, 48, 51, 56], ["5", "6", "z", "Z"]),
  ],
}))

// ================================================================ sapin
// Étages triangulaires pointus empilés (celui du dessus passe devant et jette son ombre sur celui du
// dessous), bas d'étage en dents tombantes, aiguilles en tirets obliques dirigés vers l'extérieur.

function firCrown(B, { x, tiers, ramp = PINE, seed = 5, bias = 0 }) {
  const own = new Int8Array(B.w * B.h).fill(-1), n = ramp.length
  const inTier = ([yA, yb, hw], X, Y, ti) => {
    if (Y < yA || Y > yb + 3) return false
    const dx = Math.abs(X + 0.5 - x), t = (Y + 0.5 - yA) / (yb - yA)
    const droop = 2.6 * (dx / hw) ** 2, tipH = 3.2
    if (Y + 0.5 > yb + droop) return false
    const half = hw * Math.min(1, t) ** 0.85
    if (dx > half + 0.3) return false
    if (Y + 0.5 > yb + droop - tipH) { // dents du bas
      const sp = 3.4, ph = (dx + ti * 1.3) % sp, d = Math.min(ph, sp - ph)
      if (d > (yb + droop - (Y + 0.5)) * 0.62) return false
    }
    return true
  }
  for (let ti = tiers.length - 1; ti >= 0; ti--)
    for (let Y = 0; Y < B.h; Y++) for (let X = 0; X < B.w; X++) if (inTier(tiers[ti], X, Y, ti)) own[Y * B.w + X] = ti
  const top = tiers[0][0], bot = tiers[tiers.length - 1][1], RX = tiers[tiers.length - 1][2]
  const idx = new Int8Array(B.w * B.h).fill(-1)
  for (let Y = 0; Y < B.h; Y++)
    for (let X = 0; X < B.w; X++) {
      const ti = own[Y * B.w + X]
      if (ti < 0) continue
      const [yA, yb, hw] = tiers[ti]
      const gx = (X + 0.5 - x) / RX, gy = (Y + 0.5 - (top + bot) / 2) / ((bot - top) / 2)
      const glob = gx * LX + gy * LY + Math.sqrt(Math.max(0, 1 - Math.min(1, gx * gx + gy * gy))) * LZ
      const ty = clamp((Y + 0.5 - yA) / (yb - yA), 0, 1.2)
      let v = 0.5 + 0.2 * glob + 0.22 * (0.45 - ty) - 0.12 * Math.abs(X + 0.5 - x) / hw * (X > x ? 1 : -0.4) + bias
      const at = (dx, dy) => own[clamp(Y + dy, 0, B.h - 1) * B.w + clamp(X + dx, 0, B.w - 1)]
      if ((at(-1, -2) >= 0 && at(-1, -2) < ti) || (at(0, -2) >= 0 && at(0, -2) < ti)) v -= 0.3 // ombre de l'étage du dessus
      idx[Y * B.w + X] = clamp(Math.floor(v * n), 0, n - 1)
    }
  // aiguilles : tirets obliques (vers l'extérieur et le bas), plus clairs en haut d'étage, plus sombres en bas
  const R = rng(seed)
  const out = Int8Array.from(idx)
  tiers.forEach(([yA, yb, hw], ti) => {
    for (let sy = yA + 1, row = 0; sy < yb + 2; sy += 3, row++)
      for (let sx = x - hw; sx <= x + hw; sx += 4) {
        const X0 = Math.round(sx + (row % 2 ? 2 : 0) + R() - 0.5), Y0 = sy
        if (own[Y0 * B.w + X0] !== ti) continue
        const dir = X0 + 0.5 < x ? -1 : 1, ty = (Y0 - yA) / (yb - yA)
        const step = ty < 0.55 && idx[Y0 * B.w + X0] >= 2 ? 1 : -1
        for (const [dx, dy] of [[0, 0], [dir, 0], [2 * dir, 1], [3 * dir, 1]]) {
          const X = X0 + dx, Y = Y0 + dy
          if (X < 0 || Y >= B.h || X >= B.w || own[Y * B.w + X] !== ti) continue
          out[Y * B.w + X] = clamp(idx[Y * B.w + X] + step, 0, n - 1)
        }
      }
  })
  return selout(B, out, ramp)
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

// Étages d'un sapin : [haut, bas, demi-largeur], du sommet vers le sol.
function pineSpec({ x = 32, top = 1, base = 53, tiers = 5, w0 = 8, w1 = 29, trunk }) {
  const T = []
  for (let i = 0; i < tiers; i++) {
    const t1 = (i + 1) / tiers
    const yb = Math.round(top + (base - top) * t1 - 1.5 * t1)
    const yA = i === 0 ? top : Math.round(top + (base - top) * ((i - 0.55) / tiers))
    T.push([yA, yb, w0 + (w1 - w0) * (i / (tiers - 1))])
  }
  return { x, tiers: T, trunk, tufts: [x - 7, x - 3, x + 5, x + 9], shadow: [x + 4, w1 - 2] }
}

function conifer(spec, { ramp = PINE, bark = BARK, bias = 0, fx = [], seed = 5 } = {}) {
  return (c) => {
    const B = Buf(c.w, c.h), gy = c.h - 1, R = rng(seed * 31 + 7)
    groundShadow(B, spec.shadow[0], gy, spec.shadow[1], 2)
    trunk(B, { ...spec.trunk, bot: gy, seed, ramp: bark })
    const cr = firCrown(B, { x: spec.x, tiers: spec.tiers, ramp, seed, bias })
    tufts(B, gy, spec.tufts, seed + 2)
    for (const f of fx) f(B, cr, R)
    B.flush(c)
  }
}

const PINE64 = pineSpec({ trunk: { x: 32, top: 46, wTop: 4, wBot: 6, flare: 2 } })

sprite("fxtree_pine_64", { w: 64, h: 64 }, conifer(PINE64, { bias: 0.06 }))

sprite("fxtree_pine_snow_64", { w: 64, h: 64 }, conifer(PINE64, {
  bias: 0.02,
  fx: [
    snow([PINE], { cover: 2 }),
    drift(33, 15, 3),
    glints([[20, 22, 1], [43, 37, 1], [28, 8], [12, 46], [50, 47]], "w", "s"),
  ],
}))

// ================================================================ arbre-esprit
// Feuillage turquoise luminescent, écorce pâle, halo dans l'air et spores lumineuses.

const SPIRIT64 = {
  masses: [[16, 23, 12, 10, 0], [47, 21, 12, 10, 0], [31, 12, 15, 11, 1], [31, 28, 12, 8, 2]],
  trunk: { x: 32, top: 34, wTop: 5, wBot: 8, flare: 5, lean: 2 },
  limbs: [[[31, 40, 24, 33, 17, 28], 2], [[33, 39, 40, 33, 47, 27], 2]],
  peeks: [[[31, 40, 24, 33, 17, 29], 1.5], [[33, 39, 40, 33, 47, 28], 1.5], [[32, 40, 34, 26], 1.6]],
  tufts: [],
  shadow: [35, 22],
  seed: 8,
}

sprite("fxtree_spirit_64", { w: 64, h: 64 }, tree(SPIRIT64, {
  ramp: SPIRIT, bark: SPIRIT_BARK, bias: -0.03, grass: false,
  fx: [
    pool(33, 19, ":", ";"),
    aura(":", ";", 3),
    lights([[7, 44, 1], [56, 41], [14, 54], [50, 52, 1], [42, 46], [22, 39], [60, 14], [4, 15], [38, 3]],
      { core: "+", ring: "0", strong: ":", weak: ";", ramps: [SPIRIT, SPIRIT_BARK] }),
    glints([[24, 13], [40, 9], [18, 25], [44, 22]], "w", "+"),
  ],
}))

// ================================================================ versions 32 px
// Mêmes constructeurs, masses et grappes à l'échelle (grappes de 2 à 3,5 px).

const OAK32 = {
  masses: [[8, 15, 7, 6, 0], [24, 14, 7, 6, 0], [16, 10, 9, 7, 1], [16, 18, 7, 5, 2]],
  trunk: { x: 16, top: 19, wTop: 3, wBot: 5, flare: 2, lean: -0.5 },
  limbs: [[[15, 22, 12, 18, 9, 16], 1.1], [[17, 22, 20, 18, 23, 16], 1.1]],
  peeks: [[[15, 23, 11, 19, 8, 16], 0.9], [[17, 23, 21, 19, 24, 16], 0.9]],
  clump: { rmin: 2.2, rmax: 3.6 },
  leafAmp: 0.3,
  tufts: [12, 19],
  shadow: [18, 12],
  shadowRy: 1,
  seed: 3,
}
sprite("fxtree_oak_summer_32", { w: 32, h: 32 }, tree(OAK32))
sprite("fxtree_oak_autumn_32", { w: 32, h: 32 }, tree(OAK32, {
  ramp: AUTUMN, bias: -0.02,
  fx: [
    floaters([[3, 26], [28, 24], [26, 29], [5, 30]], ["R", "r", "o"], LEAF_SHAPES.slice(3)),
    litter([7, 11, 21, 25], ["R", "r", "o", "y"]),
  ],
}))

const CHERRY32 = {
  masses: [[6, 14, 5, 4, 0], [26, 13, 5, 4, 0], [11, 8, 6, 5, 1], [21, 7, 6, 5, 1], [16, 13, 7, 5, 2]],
  trunk: { x: 16, top: 20, wTop: 3, wBot: 4, flare: 2, lean: 0.5 },
  limbs: [
    [[15, 23, 12, 18, 7, 15], 1.3], [[17, 23, 20, 18, 25, 14], 1.3],
    [[16, 21, 15, 15, 12, 9], 1], [[16, 20, 18, 14, 21, 8], 1],
  ],
  holes: [[9, 12, 0.9], [23, 11, 0.9], [16, 9, 0.8]],
  clump: { rmin: 1.8, rmax: 3 },
  leafAmp: 0.3,
  tufts: [12, 19],
  shadow: [18, 13],
  shadowRy: 1,
}
sprite("fxtree_cherry_32", { w: 32, h: 32 }, tree(CHERRY32, {
  ramp: BLOSSOM, bark: CHERRY_BARK, bias: 0.02, seed: 4,
  fx: [
    floaters([[3, 22], [29, 21], [27, 27], [4, 28], [24, 25]], PETALS, PETAL_SHAPES),
    litter([8, 12, 21, 25], ["5", "6", "z", "Z"]),
  ],
}))

const PINE32 = pineSpec({ x: 16, top: 1, base: 27, tiers: 4, w0: 4.5, w1: 14, trunk: { x: 16, top: 24, wTop: 2, wBot: 3, flare: 1 } })
PINE32.tufts = [11, 20]
sprite("fxtree_pine_32", { w: 32, h: 32 }, conifer(PINE32, { bias: 0.06 }))
sprite("fxtree_pine_snow_32", { w: 32, h: 32 }, conifer(PINE32, {
  bias: 0.02,
  fx: [snow([PINE], { cover: 2 }), drift(16, 8, 2), glints([[10, 12], [21, 19]], "w", "s")],
}))

sprite("fxtree_spirit_32", { w: 32, h: 32 }, tree({ ...OAK32, seed: 8, tufts: [] }, {
  ramp: SPIRIT, bark: SPIRIT_BARK, bias: -0.03, grass: false,
  fx: [
    pool(17, 10, ":", ";"),
    aura(":", ";", 2),
    lights([[3, 24], [28, 22], [25, 28, 1], [6, 29]], { core: "+", ring: "0", strong: ":", weak: ";", ramps: [SPIRIT, SPIRIT_BARK] }),
  ],
}))

sheet("fxtrees", ["fxtree_*"], { pad: 2 })
