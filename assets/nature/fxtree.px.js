include("../_palette.px.js")
include("_fx.px.js")

const meta = {
  title: "Arbre (style pixelfx)",
  description: "Arbres vus de face au rendu riche inspiré de la bibliothèque d'effets pixelfx : pas de contour noir (bord dans la teinte la plus sombre du matériau), couronnes en grappes modelées par la lumière en haut à gauche, ombres portées entre les grappes, ombre translucide au sol, arbre seul sans décor au pied, halos et neige scintillante posés sur l'arbre. Variantes : chêne été / automne / nuit, cerisier en fleurs, sapin et sapin enneigé, bouleau à écorce blanche, arbre-esprit luminescent, en 64, 48, 32 et 16 px (les 16 px servent aux bosquets lointains des scènes). Les halos sont semi-transparents : ils rendent mieux sur fond sombre.",
  tags: ["tree", "plant", "forest", "nature", "decoration", "scenery", "realistic", "pixelfx"],
  variants: {
    oak_summer_64: { label: "Chêne – été (64 px)", props: { species: "oak", season: "summer", effect: "none" } },
    oak_autumn_64: { label: "Chêne – automne (64 px)", props: { species: "oak", season: "autumn", effect: "none" } },
    cherry_64: { label: "Cerisier en fleurs (64 px)", props: { species: "cherry", season: "spring", effect: "none" }, tags: ["blossom", "sakura"] },
    pine_64: { label: "Sapin (64 px)", props: { species: "pine", season: "summer", effect: "none" }, tags: ["conifer", "fir"] },
    pine_snow_64: { label: "Sapin enneigé, scintillements (64 px)", props: { species: "pine", season: "winter", effect: "snow" }, tags: ["conifer", "fir", "snow"] },
    spirit_64: { label: "Arbre-esprit luminescent (64 px)", props: { species: "spirit", season: "summer", effect: "glow" }, tags: ["magic", "fantasy", "glow"] },
    oak_summer_32: { label: "Chêne – été (32 px)", props: { species: "oak", season: "summer", effect: "none" } },
    oak_autumn_32: { label: "Chêne – automne (32 px)", props: { species: "oak", season: "autumn", effect: "none" } },
    cherry_32: { label: "Cerisier en fleurs (32 px)", props: { species: "cherry", season: "spring", effect: "none" }, tags: ["blossom", "sakura"] },
    pine_32: { label: "Sapin (32 px)", props: { species: "pine", season: "summer", effect: "none" }, tags: ["conifer", "fir"] },
    pine_snow_32: { label: "Sapin enneigé (32 px)", props: { species: "pine", season: "winter", effect: "snow" }, tags: ["conifer", "fir", "snow"] },
    spirit_32: { label: "Arbre-esprit luminescent (32 px)", props: { species: "spirit", season: "summer", effect: "glow" }, tags: ["magic", "fantasy", "glow"] },
    oak_night_64: { label: "Chêne – nuit d'été (64 px)", props: { species: "oak", season: "summer", effect: "none" }, tags: ["night"] },
    oak_summer_48: { label: "Chêne – été (48 px)", props: { species: "oak", season: "summer", effect: "none" } },
    pine_48: { label: "Sapin (48 px)", props: { species: "pine", season: "summer", effect: "none" }, tags: ["conifer", "fir"] },
    birch_48: { label: "Bouleau (48 px)", props: { species: "birch", season: "summer", effect: "none" }, tags: ["white-bark"] },
    birch_32: { label: "Bouleau (32 px)", props: { species: "birch", season: "summer", effect: "none" }, tags: ["white-bark"] },
    oak_summer_16: { label: "Chêne – été (16 px)", props: { species: "oak", season: "summer", effect: "none" }, tags: ["distant"] },
    pine_16: { label: "Sapin (16 px)", props: { species: "pine", season: "summer", effect: "none" }, tags: ["conifer", "fir", "distant"] },
  },
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

// Grappes et couronne (genClumps, crown) : dans _fx.px.js, partagées avec fxbush.

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

// Étincelles en croix (neige, rosée, magie) : cœur + bras d'un pixel.
const glints = (pts, core = "w", arm = "s") => (B) => {
  for (const [x, y, big] of pts) {
    B.set(x, y, core)
    if (big) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) B.set(x + dx, y + dy, arm)
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
// ================================================================ constructeur d'arbre
// spec : masses de feuillage, tronc, branches (avant la couronne), branches visibles dans l'ombre,
// touffes, ombre au sol. opt : rampes, décalage de valeur, effets.

function tree(spec, { ramp = LEAF, bark = BARK, bias = 0, barkDark = 0, fx = [], seed = spec.seed ?? 1, clump = {} } = {}) {
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
  shadow: [36, 24],
}

sprite("fxtree_oak_summer_64", { w: 64, h: 64 }, tree(OAK64))

sprite("fxtree_oak_autumn_64", { w: 64, h: 64 }, tree(OAK64, {
  ramp: AUTUMN, bias: -0.02,
  fx: [
  ],
}))

sprite("fxtree_oak_night_64", { w: 64, h: 64 }, tree(OAK64, {
  ramp: NIGHT, bark: NIGHT_BARK, bias: 0.07,
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
  shadow: [36, 26],
}

sprite("fxtree_cherry_64", { w: 64, h: 64 }, tree(CHERRY64, {
  ramp: BLOSSOM, bark: CHERRY_BARK, bias: 0.02, seed: 4,
  fx: [
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

// Étages d'un sapin : [haut, bas, demi-largeur], du sommet vers le sol.
function pineSpec({ x = 32, top = 1, base = 53, tiers = 5, w0 = 8, w1 = 29, trunk }) {
  const T = []
  for (let i = 0; i < tiers; i++) {
    const t1 = (i + 1) / tiers
    const yb = Math.round(top + (base - top) * t1 - 1.5 * t1)
    const yA = i === 0 ? top : Math.round(top + (base - top) * ((i - 0.55) / tiers))
    T.push([yA, yb, w0 + (w1 - w0) * (i / (tiers - 1))])
  }
  return { x, tiers: T, trunk, shadow: [x + 4, w1 - 2] }
}

function conifer(spec, { ramp = PINE, bark = BARK, bias = 0, fx = [], seed = 5 } = {}) {
  return (c) => {
    const B = Buf(c.w, c.h), gy = c.h - 1, R = rng(seed * 31 + 7)
    groundShadow(B, spec.shadow[0], gy, spec.shadow[1], 2)
    trunk(B, { ...spec.trunk, bot: gy, seed, ramp: bark })
    const cr = firCrown(B, { x: spec.x, tiers: spec.tiers, ramp, seed, bias })
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
  shadow: [35, 22],
  seed: 8,
}

sprite("fxtree_spirit_64", { w: 64, h: 64 }, tree(SPIRIT64, {
  ramp: SPIRIT, bark: SPIRIT_BARK, bias: -0.03,
  fx: [
    aura(":", ";", 3),
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
  shadow: [18, 12],
  shadowRy: 1,
  seed: 3,
}
sprite("fxtree_oak_summer_32", { w: 32, h: 32 }, tree(OAK32))
sprite("fxtree_oak_autumn_32", { w: 32, h: 32 }, tree(OAK32, {
  ramp: AUTUMN, bias: -0.02,
  fx: [
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
  shadow: [18, 13],
  shadowRy: 1,
}
sprite("fxtree_cherry_32", { w: 32, h: 32 }, tree(CHERRY32, {
  ramp: BLOSSOM, bark: CHERRY_BARK, bias: 0.02, seed: 4,
  fx: [
  ],
}))

const PINE32 = pineSpec({ x: 16, top: 1, base: 27, tiers: 4, w0: 4.5, w1: 14, trunk: { x: 16, top: 24, wTop: 2, wBot: 3, flare: 1 } })
sprite("fxtree_pine_32", { w: 32, h: 32 }, conifer(PINE32, { bias: 0.06 }))
sprite("fxtree_pine_snow_32", { w: 32, h: 32 }, conifer(PINE32, {
  bias: 0.02,
  fx: [snow([PINE], { cover: 2 }), glints([[10, 12], [21, 19]], "w", "s")],
}))

sprite("fxtree_spirit_32", { w: 32, h: 32 }, tree({ ...OAK32, seed: 8 }, {
  ramp: SPIRIT, bark: SPIRIT_BARK, bias: -0.03,
  fx: [
    aura(":", ";", 2),
  ],
}))

// ================================================================ versions 48 et 16 px, bouleau

const OAK48 = {
  masses: [[11, 21, 10, 8, 0], [36, 20, 10, 8, 0], [23, 11, 13, 10, 1], [23, 25, 10, 8, 2]],
  trunk: { x: 24, top: 27, wTop: 4.5, wBot: 7, flare: 3, lean: -1 },
  limbs: [[[23, 32, 18, 28, 14, 25], 1.6], [[25, 32, 29, 28, 33, 25], 1.6]],
  peeks: [[[23, 33, 18, 28, 12, 24], 1.2], [[25, 33, 31, 28, 36, 24], 1.2], [[24, 33, 25, 23, 26, 17], 1.3]],
  clump: { rmin: 2.8, rmax: 5 },
  leafAmp: 0.36,
  shadow: [27, 18],
  seed: 6,
}
sprite("fxtree_oak_summer_48", { w: 48, h: 48 }, tree(OAK48))

const PINE48 = pineSpec({ x: 24, top: 1, base: 40, tiers: 5, w0: 6, w1: 21, trunk: { x: 24, top: 35, wTop: 3, wBot: 4.5, flare: 1.5 } })
sprite("fxtree_pine_48", { w: 48, h: 48 }, conifer(PINE48, { bias: 0.06, seed: 7 }))

// Bouleau : couronne étroite et claire, tronc blanc (rampe de la pierre claire) marqué de lenticelles
// sombres horizontales, plus nombreuses à la base.
const BIRCH_BARK = ["d", "m", "c", "C", "s"]
const lenticels = (x, top, bot, w, seed) => (B) => {
  const R = rng(seed)
  for (let y = top + 2; y < bot - 1; y += 2 + Math.floor(R() * 3)) {
    const len = 1 + Math.floor(R() * Math.max(1, w - 1)), x0 = Math.round(x - w / 2 + R() * (w - len))
    for (let k = 0; k < len; k++) if (BIRCH_BARK.includes(B.get(x0 + k, y))) B.set(x0 + k, y, R() < 0.5 ? "k" : "d")
  }
}
const BIRCH48 = {
  masses: [[18, 14, 6.5, 8, 0], [30, 15, 6.5, 8, 0], [24, 8, 8, 7.5, 1], [24, 20, 6.5, 6, 2]],
  trunk: { x: 24, top: 22, wTop: 3, wBot: 4.5, flare: 1.5, lean: 1 },
  limbs: [[[24, 27, 20, 22, 18, 18], 1.1], [[24, 26, 28, 22, 30, 18], 1.1]],
  peeks: [[[24, 28, 19, 22, 17, 17], 0.9], [[24, 27, 29, 21, 31, 16], 0.9]],
  clump: { rmin: 2.4, rmax: 4 },
  leafAmp: 0.36,
  shadow: [26, 12],
  seed: 11,
}
sprite("fxtree_birch_48", { w: 48, h: 48 }, tree(BIRCH48, { bark: BIRCH_BARK, bias: 0.07, fx: [lenticels(24.5, 26, 47, 4, 3)] }))
const BIRCH32 = {
  masses: [[11, 12, 5, 6, 0], [21, 13, 5, 6, 0], [16, 7, 6, 6, 1], [16, 16, 5, 4, 2]],
  trunk: { x: 16, top: 17, wTop: 2, wBot: 3, flare: 1, lean: 0.5 },
  peeks: [[[16, 20, 13, 17, 11, 14], 0.7], [[16, 20, 19, 16, 21, 13], 0.7]],
  clump: { rmin: 1.9, rmax: 3 },
  leafAmp: 0.3,
  shadow: [17, 8],
  shadowRy: 1,
  seed: 12,
}
sprite("fxtree_birch_32", { w: 32, h: 32 }, tree(BIRCH32, { bark: BIRCH_BARK, bias: 0.07, fx: [lenticels(16.5, 17, 31, 3, 5)] }))

// 16 px : une couronne en trois masses, tronc court ; pour les bosquets lointains.
const OAK16 = {
  masses: [[5, 7, 4, 3, 0], [11, 7, 4, 3, 0], [8, 5, 5, 4, 1]],
  trunk: { x: 8, top: 9, wTop: 2, wBot: 2.5, flare: 0.6 },
  clump: { rmin: 1.5, rmax: 2.2 },
  leafAmp: 0.2,
  shadow: [9, 5],
  shadowRy: 1,
  seed: 5,
}
sprite("fxtree_oak_summer_16", { w: 16, h: 16 }, tree(OAK16, { bias: 0.04 }))
const PINE16 = pineSpec({ x: 8, top: 0, base: 13, tiers: 3, w0: 2.5, w1: 6.5, trunk: { x: 8, top: 12, wTop: 1.5, wBot: 2, flare: 0.5 } })
sprite("fxtree_pine_16", { w: 16, h: 16 }, conifer(PINE16, { bias: 0.08, seed: 9 }))

sheet("fxtrees", ["fxtree_*"], { pad: 2 })
