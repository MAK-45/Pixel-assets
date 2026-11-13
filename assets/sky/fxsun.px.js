include("../_palette.px.js")
include("../nature/_fx.px.js")

const meta = {
  title: "Soleil (style pixelfx)",
  description: "Soleils au rendu riche inspiré de l'effet sunburst et de l'éclipse de la bibliothèque pixelfx : cœur blanc chauffé, disque doré en paliers francs, rayons effilés longs et courts qui s'éclaircissent vers le centre, halo doré translucide. Sans contour noir. Variantes : soleil à rayons (16, 32, 64 px), soleil pâle d'hiver, soleil doux à couronne ondulée, soleil couchant rayé sur l'horizon (48 × 24), disque du soleil couchant entier (32 px, à demi caché par le relief dans les scènes) et éclipse totale à couronne nacrée avec son « diamant ». Les halos sont semi-transparents : ils rendent mieux sur fond sombre ou ciel.",
  tags: ["sun", "sky", "day", "light", "sunny", "weather", "glow", "realistic", "pixelfx"],
  variants: {
    rays_64: { label: "Soleil à rayons (64 px)", props: { style: "rays", time: "day" } },
    rays_32: { label: "Soleil à rayons (32 px)", props: { style: "rays", time: "day" } },
    rays_16: { label: "Soleil à rayons (16 px)", props: { style: "rays", time: "day" }, tags: ["icon"] },
    pale_32: { label: "Soleil pâle d'hiver (32 px)", props: { style: "rays", time: "winter" }, tags: ["winter", "cold"] },
    glow_32: { label: "Soleil doux à couronne (32 px)", props: { style: "corona", time: "day" }, tags: ["warm"] },
    sunset_48: { label: "Soleil couchant sur l'horizon (48 × 24)", props: { style: "disc", time: "sunset" }, tags: ["sunset", "dusk", "horizon", "retro"] },
    setting_32: { label: "Soleil couchant, disque entier (32 px)", props: { style: "disc", time: "sunset" }, tags: ["sunset", "dusk", "evening"] },
    eclipse_48: { label: "Éclipse totale (48 px)", props: { style: "corona", time: "eclipse" }, tags: ["eclipse", "dark", "night"] },
  },
}

// ================================================================ technique
// Repris de holy/sunburst : cœur blanc décalé vers la lumière, anneaux dorés en paliers, rayons dont la
// ligne centrale est plus claire que les bords et qui virent à l'orange en pointe ; halo doré (glow) posé
// sur le vide. De shadow/eclipse : disque noir, liseré blanc, couronne nacrée en filaments, perle brillante.

const GOLD = ["R", "r", "o", "y", "Y", "w"]
const PALE = ["]", "S", "s", "Y", "w", "w"]

// disque ombré : cœur blanc en haut à gauche, rebord plus sombre en bas à droite
function disc(B, cx, cy, R, ramp) {
  const n = ramp.length
  for (let y = 0; y < B.h; y++)
    for (let x = 0; x < B.w; x++) {
      const dx = x + 0.5 - cx, dy = y + 0.5 - cy, d = Math.hypot(dx, dy) / R
      if (d > 1) continue
      const hot = Math.hypot(dx + R * 0.22, dy + R * 0.22) / R
      const lit = (dx * LX + dy * LY) / R // > 0 côté lumière
      let i = hot < 0.42 ? n - 1 : hot < 0.78 ? n - 2 : n - 3
      if (d > 0.84 && lit < 0.1) i = Math.min(i, n - 4)
      B.set(x, y, ramp[i])
    }
}

// rayons : [angle en degrés, longueur, demi-largeur à la base]
function rays(B, cx, cy, R0, list, ramp) {
  const n = ramp.length
  for (let y = 0; y < B.h; y++)
    for (let x = 0; x < B.w; x++) {
      const dx = x + 0.5 - cx, dy = y + 0.5 - cy, r = Math.hypot(dx, dy), th = Math.atan2(dy, dx)
      for (const [a, L, w0] of list) {
        if (r < R0 || r > L) continue
        const da = Math.atan2(Math.sin(th - (a * Math.PI) / 180), Math.cos(th - (a * Math.PI) / 180))
        if (Math.abs(da) > Math.PI / 2) continue
        const perp = Math.abs(r * Math.sin(da)), s = (r - R0) / (L - R0), half = w0 * (1 - s) + 0.5
        if (perp >= half) continue
        const core = perp < Math.max(0.5, half - 0.9)
        const i = core ? (s < 0.3 ? n - 1 : s < 0.62 ? n - 2 : s < 0.85 ? n - 3 : n - 4) : s < 0.4 ? n - 2 : s < 0.7 ? n - 3 : n - 4
        if (B.get(x, y) === ".") B.set(x, y, ramp[i])
        break
      }
    }
}

// liste de rayons : 4 longs (croix), 4 moyens (diagonales), `fine` courts entre eux
function burst(L1, w1, L2, w2, L3 = 0, w3 = 0) {
  const out = []
  for (let k = 0; k < 4; k++) out.push([k * 90, L1, w1], [45 + k * 90, L2, w2])
  if (L3) for (let k = 0; k < 8; k++) out.push([22.5 + k * 45, L3 * (k % 2 ? 0.85 : 1), w3])
  return out
}

const draw = (fn) => (c) => { const B = Buf(c.w, c.h); fn(B); B.flush(c) }

function sun(B, cx, cy, R, list, ramp = GOLD, glow = [1.5, 4]) {
  rays(B, cx, cy, R - 1, list, ramp)
  disc(B, cx, cy, R, ramp)
  halo(B, ramp.slice(-2).join(""), glow[0], glow[1], "^", "~")
}

// ================================================================ variantes

sprite("fxsun_rays_64", { w: 64, h: 64 }, draw((B) => sun(B, 32, 32, 9.5, burst(31, 1.7, 23, 1.3, 16, 0.6), GOLD, [1.5, 5])))
sprite("fxsun_rays_32", { w: 32, h: 32 }, draw((B) => sun(B, 16, 16, 5.5, burst(15.5, 1.1, 12, 0.8, 9, 0.2), GOLD, [1.2, 3])))
sprite("fxsun_rays_16", { w: 16, h: 16 }, draw((B) => sun(B, 8, 8, 3.6, burst(7.8, 0.6, 6.4, 0.3), GOLD, [1, 1.5])))
sprite("fxsun_pale_32", { w: 32, h: 32 }, draw((B) => sun(B, 16, 16, 5.5, burst(14, 0.8, 10, 0.5), PALE, [1.2, 3])))

// soleil doux : couronne ondulée (flammèches) autour du disque, sans rayons
sprite("fxsun_glow_32", { w: 32, h: 32 }, draw((B) => {
  const cx = 16, cy = 16, R = 8
  for (let y = 0; y < 32; y++)
    for (let x = 0; x < 32; x++) {
      const dx = x + 0.5 - cx, dy = y + 0.5 - cy, r = Math.hypot(dx, dy), th = Math.atan2(dy, dx)
      const wave = 2.6 + 1.3 * Math.sin(th * 7 + 0.6) + 0.7 * Math.sin(th * 11 + 2)
      if (r > R + wave || r <= R - 1) continue
      const s = (r - R + 1) / (wave + 1), lit = (dx * LX + dy * LY) / r
      B.set(x, y, s < 0.45 ? (lit > 0 ? "Y" : "y") : s < 0.8 ? "y" : "o")
    }
  disc(B, cx, cy, R, GOLD)
  halo(B, "yYo", 1.2, 3.5, "^", "~")
}))

// soleil couchant : grand disque coupé par l'horizon, du jaune au rouge en paliers, fentes horizontales
sprite("fxsun_sunset_48", { w: 48, h: 24 }, draw((B) => {
  const cx = 24, cy = 24, R = 17
  const slits = [[13, 1], [16, 1], [19, 2], [22, 2]] // [y, épaisseur]
  for (let y = 0; y < 24; y++)
    for (let x = 0; x < 48; x++) {
      const dx = x + 0.5 - cx, dy = y + 0.5 - cy, d = Math.hypot(dx, dy) / R
      if (d > 1) continue
      if (slits.some(([sy, t]) => y >= sy && y < sy + t)) continue
      const h = (y - (cy - R)) / R // 0 en haut, 1 à l'horizon
      const hot = Math.hypot(dx + R * 0.3, dy + R * 0.72) / R
      let k = hot < 0.14 ? "w" : h < 0.3 ? "Y" : h < 0.5 ? "y" : h < 0.72 ? "o" : "r"
      if (d > 0.93 && dx > -2) k = { w: "Y", Y: "y", y: "o", o: "r", r: "R" }[k]
      B.set(x, y, k)
    }
  halo(B, "wYy", 1.2, 3.5, "^", "~")
}))

// soleil couchant entier : disque du jaune pâle (haut à gauche) au rouge (bas), paliers en croissants
// décalés vers le bas à droite, halo chaud ; le relief des scènes en cache le bas.
sprite("fxsun_setting_32", { w: 32, h: 32 }, draw((B) => {
  const cx = 16, cy = 16, R = 10.5
  for (let y = 0; y < 32; y++)
    for (let x = 0; x < 32; x++) {
      const dx = x + 0.5 - cx, dy = y + 0.5 - cy, d = Math.hypot(dx, dy) / R
      if (d > 1) continue
      const hot = Math.hypot(dx + R * 0.38, dy + R * 0.42) / R
      let k = hot < 0.3 ? "w" : hot < 0.62 ? "Y" : hot < 0.98 ? "y" : hot < 1.32 ? "o" : "r"
      if (d > 0.88 && dx + dy > 0) k = { w: "Y", Y: "y", y: "o", o: "r", r: "R" }[k]
      B.set(x, y, k)
    }
  halo(B, "wYyo", 1.5, 4.5, "^", "~")
}))

// éclipse : disque noir, liseré blanc, couronne nacrée en filaments, perle (diamant) en haut à droite
sprite("fxsun_eclipse_48", { w: 48, h: 48 }, draw((B) => {
  const cx = 24, cy = 24, R = 9
  const PEARL = ["V", "v", "x", "s", "w"]
  const fil = []
  // filaments fins, plus longs vers l'équateur (gauche et droite), comme les jets de la couronne
  for (let k = 0; k < 26; k++) {
    const a = k * (360 / 26) + 6 * (hsh(k, 1, 7) - 0.5), eq = Math.abs(Math.cos((a * Math.PI) / 180))
    fil.push([a, R + 4 + (6 + 9 * eq) * (0.45 + 0.55 * hsh(k, 3, 7)), 0.05 + 0.4 * eq * hsh(k, 5, 7)])
  }
  rays(B, cx, cy, R, fil, PEARL)
  // couronne serrée : anneau irrégulier
  for (let y = 0; y < 48; y++)
    for (let x = 0; x < 48; x++) {
      const dx = x + 0.5 - cx, dy = y + 0.5 - cy, r = Math.hypot(dx, dy), th = Math.atan2(dy, dx)
      const edge = R + 2.2 + 1.2 * vnoise(th * 8 + 20, 0, 1.6, 4)
      if (r > edge || r <= R) continue
      B.set(x, y, r < R + 1.4 ? "w" : r < R + 2.4 ? "s" : "x")
    }
  for (let y = 0; y < 48; y++)
    for (let x = 0; x < 48; x++) {
      const dx = x + 0.5 - cx, dy = y + 0.5 - cy, r = Math.hypot(dx, dy)
      if (r <= R) B.set(x, y, r > R - 1 ? "w" : "q")
    }
  // perle de lumière sur le bord, en haut à droite
  const px = Math.round(cx + R * 0.82), py = Math.round(cy - R * 0.82)
  for (const [x, y] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1], [1, -1], [2, -2], [3, 0], [0, -3], [-3, 0], [0, 3]])
    B.set(px + x, py + y, Math.abs(x) + Math.abs(y) > 1 ? "Y" : "w")
  halo(B, "w", 1.5, 4.5, "{", "}")
}))

sheet("fxsuns", ["fxsun_*"], { pad: 2 })
