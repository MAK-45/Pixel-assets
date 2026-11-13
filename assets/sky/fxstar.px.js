include("../_palette.px.js")
include("../nature/_fx.px.js")

const meta = {
  title: "Étoile (style pixelfx)",
  description: "Étoiles et ciel étoilé au rendu riche inspiré des effets shooting-stars et sunburst de la bibliothèque pixelfx : scintillements en croix au cœur blanc dont les branches refroidissent vers la pointe, halo translucide, étoile à cinq branches taillée en facettes dorées, et tuiles de ciel nocturne répétables (voie lactée en bande diagonale, poussière d'étoiles, étoiles fixes et scintillantes). Sans contour noir. Variantes : scintillement blanc à 4 branches, étoile dorée à 8 branches, étoile bleue, étoile à cinq branches (16, 32 px), ciel étoilé en tuile de 32 et 64 px. Les halos rendent mieux sur fond sombre.",
  tags: ["star", "sky", "night", "sparkle", "twinkle", "starfield", "glow", "realistic", "pixelfx"],
  variants: {
    sparkle4_16: { label: "Scintillement blanc (16 px)", props: { shape: "sparkle4", color: "white" }, tags: ["icon"] },
    sparkle8_16: { label: "Étoile dorée à 8 branches (16 px)", props: { shape: "sparkle8", color: "gold" }, tags: ["icon", "magic"] },
    blue_16: { label: "Étoile bleue (16 px)", props: { shape: "sparkle4", color: "blue" }, tags: ["icon", "cold"] },
    star5_32: { label: "Étoile à cinq branches (32 px)", props: { shape: "star5", color: "gold" }, tags: ["pickup", "reward"] },
    star5_16: { label: "Étoile à cinq branches (16 px)", props: { shape: "star5", color: "gold" }, tags: ["icon", "pickup", "reward"] },
    starfield_64: { label: "Ciel étoilé, tuile (64 px)", props: { shape: "starfield", color: "night" }, tags: ["background", "tile", "seamless", "milky-way"] },
    starfield_32: { label: "Ciel étoilé, tuile (32 px)", props: { shape: "starfield", color: "night" }, tags: ["background", "tile", "seamless"] },
  },
}

// ================================================================ technique
// Repris de weather/shooting-stars : fonction sparkle (croix dont les branches passent de la teinte claire
// à la teinte froide en pointe, petites diagonales dès 3 px de branche, cœur blanc, glow) et ciel (bande
// lactée diagonale un cran plus claire, poussière clairsemée dans la bande, étoiles fixes à petit halo,
// quelques scintillements). De pickups/crystal-shard : facettes planes éclairées chacune selon son
// orientation, pour l'étoile à cinq branches.

const draw = (fn) => (c) => { const B = Buf(c.w, c.h); fn(B); B.flush(c) }

// scintillement : branches en croix de longueur `arm`, diagonales `diag` ; ramp [pointe … cœur]
function sparkle(B, x, y, arm, diag, ramp, set = (x, y, k) => B.set(x, y, k)) {
  const n = ramp.length
  for (let d = 1; d <= arm; d++) {
    const k = ramp[clamp(n - 2 - Math.floor(((d - 1) / arm) * (n - 1)), 0, n - 1)]
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) set(x + dx * d, y + dy * d, k)
  }
  for (let d = 1; d <= diag; d++) {
    const k = ramp[clamp(n - 3 - (d - 1) * 2, 0, n - 1)]
    for (const [dx, dy] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) set(x + dx * d, y + dy * d, k)
  }
  set(x, y, ramp[n - 1])
}

const WHITE = ["]", "S", "s", "w", "w"]
const GOLDS = ["r", "o", "y", "Y", "w"]
const BLUE = ["u", "i", "I", "w", "w"]

sprite("fxstar_sparkle4_16", { w: 16, h: 16 }, draw((B) => {
  sparkle(B, 7, 7, 6, 1, WHITE)
  halo(B, "wsS", 1, 2.2, "{", "}")
}))
sprite("fxstar_sparkle8_16", { w: 16, h: 16 }, draw((B) => {
  sparkle(B, 7, 7, 6, 3, GOLDS)
  B.set(8, 7, "Y"), B.set(6, 7, "Y"), B.set(7, 6, "Y"), B.set(7, 8, "Y") // cœur élargi
  halo(B, "wYy", 1, 2.2, "^", "~")
}))
sprite("fxstar_blue_16", { w: 16, h: 16 }, draw((B) => {
  // cœur rond 3 × 3 et branches courtes : une étoile chaude et proche
  sparkle(B, 7, 7, 5, 1, BLUE)
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) B.set(7 + dx, 7 + dy, "w")
  for (const [dx, dy] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) B.set(7 + dx, 7 + dy, dx + dy < 0 ? "I" : "i")
  halo(B, "wIi", 1.2, 2.6, "{", "}")
}))

// étoile à cinq branches taillée : 10 facettes triangulaires (centre, pointe, creux), chacune un plan
// incliné vers l'extérieur et éclairé selon son orientation (lumière en haut à gauche)
const STARRAMP = ["R", "r", "o", "y", "Y", "w"]
function star5(B, cx, cy, Ro, Ri) {
  const W = B.w, H = B.h, idx = new Int8Array(W * H).fill(-1)
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const dx = x + 0.5 - cx, dy = y + 0.5 - cy, r = Math.hypot(dx, dy)
      let th = Math.atan2(dy, dx) + Math.PI / 2 // 0 = pointe du haut
      th = ((th % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
      const seg = (2 * Math.PI) / 5, k = Math.floor((th + seg / 2) / seg) % 5, off = th - k * seg
      const a = Math.atan2(Math.sin(off), Math.cos(off)) // −seg/2 … seg/2 autour de la pointe k
      // bord : droite entre la pointe (Ro, 0) et le creux (Ri, ±seg/2)
      const t = Math.abs(a) / (seg / 2)
      const px = Ro, py = 0, qx = Ri * Math.cos(seg / 2), qy = Ri * Math.sin(seg / 2)
      const ex = px + (qx - px) * t, ey = py + (qy - py) * t
      if (r > Math.hypot(ex, ey) + 0.15) continue
      // facette : côté gauche ou droit de la branche k ; normale vers le milieu de la facette
      const phi = k * seg + (a < 0 ? -seg / 4 : seg / 4) - Math.PI / 2
      const nx = Math.cos(phi) * 0.75, ny = Math.sin(phi) * 0.75, L = nx * LX + ny * LY + 0.66 * LZ
      let i = L > 0.75 ? 4 : L > 0.45 ? 3 : L > 0.05 ? 2 : 1
      if (L > 0.75 && r < Ri * 0.9) i = 5 // reflet blanc sur la facette la plus éclairée, près du centre
      idx[y * W + x] = i
    }
  const o = selout(B, idx, STARRAMP)
  // arêtes vives entre deux facettes d'une même branche (ligne de crête claire)
  return o
}
sprite("fxstar_star5_32", { w: 32, h: 32 }, draw((B) => {
  star5(B, 16, 17, 14.5, 6.2)
  halo(B, "wY", 1, 1.8, "^", "~")
}))
sprite("fxstar_star5_16", { w: 16, h: 16 }, draw((B) => {
  star5(B, 8, 8.6, 7.4, 3.3)
}))

// ciel étoilé en tuile répétable : tout se calcule modulo la taille (bande, poussière, étoiles et halos)
function starfield(B, seed, nStars) {
  const W = B.w, H = B.h, wrap = (v, m) => ((v % m) + m) % m
  const set = (x, y, k) => B.set(wrap(x, W), wrap(y, H), k)
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      // bande lactée diagonale : distance à la diagonale, périodique, bord ondulé
      const u = wrap(x - y + W * 0.3 + 3 * Math.sin((2 * Math.PI * x) / W) * Math.cos((2 * Math.PI * y) / H), W)
      const d = Math.abs(u - W / 2) / (W * 0.22)
      const patch = hsh(wrap(x >> 1, W >> 1), wrap(y >> 1, H >> 1), seed + 1)
      let k = d < 0.3 && patch < 0.7 ? "M" : d < 1 && patch < 1.15 - d ? "O" : "Q"
      if (d < 0.9 && hsh(x, y, seed + 2) < 0.07 * (1 - d)) k = d < 0.4 ? "[" : "M" // poussière d'étoiles
      B.set(x, y, k)
    }
  const glowK = { Q: "O", O: "M", M: "[", "[": "[" }
  for (let s = 0; s < nStars; s++) {
    const x = Math.floor(hsh(s, 1, seed) * W), y = Math.floor(hsh(s, 2, seed) * H), r = hsh(s, 3, seed)
    const lift = (dx, dy) => { const k = B.get(wrap(x + dx, W), wrap(y + dy, H)); set(x + dx, y + dy, glowK[k] ?? k) }
    if (r < 0.55) set(x, y, r < 0.3 ? "]" : "S") // étoile faible
    else if (r < 0.88) { // étoile fixe à petit halo
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) lift(dx, dy)
      set(x, y, r < 0.75 ? "s" : "w")
    } else { // scintillement
      for (const [dx, dy] of [[1, 1], [-1, 1], [1, -1], [-1, -1], [2, 0], [-2, 0], [0, 2], [0, -2]]) lift(dx, dy)
      sparkle(B, x, y, r > 0.96 ? 3 : 2, 0, ["]", "S", "s", "w"], set)
    }
  }
}
sprite("fxstar_starfield_64", { w: 64, h: 64 }, draw((B) => starfield(B, 5, 70)))
sprite("fxstar_starfield_32", { w: 32, h: 32 }, draw((B) => starfield(B, 9, 20)))

sheet("fxstars", ["fxstar_*"], { pad: 2 })
