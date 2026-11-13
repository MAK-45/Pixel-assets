include("../_palette.px.js")
include("../nature/_fx.px.js")

const meta = {
  title: "Nuage (style pixelfx)",
  description: "Nuages au rendu riche inspiré des effets clouds et storm-cloud de la bibliothèque pixelfx : rangée de bouffées sur une base presque plate, crête éclairée en haut, paliers francs qui descendent vers un ventre sombre, lignes claires entre les lobes, côté droit des bouffées à l'ombre (lumière en haut à gauche). Sans contour noir. Variantes : cumulus blanc (64 × 32, 48 × 24), petit nuage (32 × 16, 16 px), nuage de nuit au clair de lune, nuage d'orage sombre, nuage rose du couchant et longue bande de stratus gris. Nuage seul, sans pluie ni éclair.",
  tags: ["cloud", "sky", "weather", "day", "realistic", "pixelfx"],
  variants: {
    cumulus_64: { label: "Cumulus (64 × 32)", props: { shape: "cumulus", time: "day" } },
    cumulus_48: { label: "Cumulus (48 × 24)", props: { shape: "cumulus", time: "day" } },
    puff_32: { label: "Petit nuage (32 × 16)", props: { shape: "puff", time: "day" } },
    puff_16: { label: "Petit nuage (16 px)", props: { shape: "puff", time: "day" }, tags: ["icon"] },
    night_48: { label: "Nuage de nuit (48 × 24)", props: { shape: "cumulus", time: "night" }, tags: ["night", "moonlit"] },
    storm_64: { label: "Nuage d'orage (64 × 32)", props: { shape: "storm", time: "storm" }, tags: ["storm", "dark", "rain"] },
    sunset_48: { label: "Nuage du couchant (48 × 24)", props: { shape: "cumulus", time: "sunset" }, tags: ["sunset", "dusk", "pink"] },
    stratus_64: { label: "Bande de stratus (64 × 16)", props: { shape: "stratus", time: "overcast" }, tags: ["overcast", "grey", "parallax"] },
  },
}

// ================================================================ technique
// Repris de weather/clouds (fonction cloud) : une rangée de bouffées sur une base, plus une ou deux
// grosses entassées au milieu ; par colonne, le sommet (bouffée la plus haute) et la bouffée suivante
// (ligne claire des lobes) ; paliers selon la profondeur depuis le sommet : crête, haut, corps, ventre,
// et la dernière ligne du ventre un cran plus sombre. Sans le tramage Bayer (paliers francs). On ajoute
// le côté droit de chaque bouffée à l'ombre, pour la lumière en haut à gauche.

// rampes [dessous, ventre, corps, haut, crête]
const DAY = ["[", "]", "S", "s", "w"]
const NIGHT = ["O", "M", "[", "]", "S"]
const STORM = ["d", "<", "m", ">", "c"]
const SUNSET = ["a", "A", "f", "F", "Y"]
const GREY = ["<", "m", ">", "c", "C"]

// cx centre, base ligne du ventre, w largeur, H hauteur des bouffées, n bouffées de bord, heap bouffées du milieu
function cloud(B, cx, base, w, H, ramp, { seed = 1, n = 5, heap = 2, flat = 0 } = {}) {
  const R = (k) => hsh(k, seed, 77), puffs = []
  for (let k = 0; k < n; k++) {
    const f = (k + 0.5) / n, r = H * (0.42 + 0.38 * Math.sin(Math.PI * f)) * (0.8 + 0.4 * R(10 + k))
    puffs.push([cx + w * (f - 0.5) + (R(20 + k) - 0.5) * Math.min(3, w / n / 2), base - r * 0.3 - R(30 + k) * H * 0.12, r])
  }
  for (let k = 0; k < heap; k++) {
    const f = 0.25 + (heap > 1 ? (k / (heap - 1)) * 0.4 : 0.2) + (R(40 + k) - 0.5) * 0.12, r = H * (0.55 + 0.3 * R(50 + k))
    puffs.push([cx + w * (f - 0.5), base - H * 0.5 - r * 0.15, r])
  }
  const x1 = cx - w / 2 - H * 0.6, x2 = cx + w / 2 + H * 0.6
  for (let x = Math.max(0, Math.floor(x1)); x <= Math.min(B.w - 1, Math.ceil(x2)); x++) {
    const px = x + 0.5
    let top = Infinity
    const cov = [] // [sommet de la bouffée à cette colonne, bouffée]
    for (const p of puffs) {
      const dx = px - p[0]
      if (dx * dx >= p[2] * p[2]) continue
      const y = p[1] - Math.sqrt(p[2] * p[2] - dx * dx)
      cov.push([y, p])
      top = Math.min(top, y)
    }
    if (top === Infinity) continue
    const end = Math.min(px - x1, x2 - px) / H
    const bot = base + 1.5 + (flat ? 0 : Math.sin(px * 0.37 + seed) * 0.6) - (end < 1 ? (1 - end) * 3 : 0)
    if (bot <= top) continue
    const h = bot - top
    for (let y = Math.floor(top); y < bot; y++) {
      // la bouffée de devant (centre le plus bas) qui couvre ce pixel : chaque lobe garde son dôme
      let own = null
      for (const [ty, p] of cov) if (ty <= y + 0.5 && (!own || p[1] > own[1][1])) own = [ty, p]
      if (!own) continue
      const [ty, p] = own, d = y + 0.5 - ty, side = (px - p[0]) / p[2], v = (y + 0.5 - top) / h
      let i = d < 1 ? 4 : d < p[2] * 0.4 ? 3 : d < p[2] * 0.85 ? 2 : 1
      if (side > 0.5 && i >= 3) i -= 1 // côté droit du lobe : ombre propre
      if (v > 0.75) i = Math.min(i, 1) // ventre
      else if (v > 0.5) i = Math.min(i, 2)
      if (bot - y - 0.5 < 1 && v > 0.5) i = 0
      if (y >= 0 && y < B.h) B.set(x, y, ramp[i])
    }
  }
}

// nettoyage : un pixel isolé dont au moins 3 voisins (sur 4) partagent une autre teinte prend cette teinte
function despeckle(B) {
  const fix = []
  for (let y = 0; y < B.h; y++)
    for (let x = 0; x < B.w; x++) {
      const k = B.get(x, y)
      if (k === ".") continue
      const n = [B.get(x - 1, y), B.get(x + 1, y), B.get(x, y - 1), B.get(x, y + 1)]
      if (n.includes(k)) continue
      for (const m of n) if (m !== "." && n.filter((v) => v === m).length >= 3) { fix.push([x, y, m]); break }
    }
  for (const [x, y, m] of fix) B.set(x, y, m)
}

const draw = (fn) => (c) => { const B = Buf(c.w, c.h); fn(B); despeckle(B); B.flush(c) }

sprite("fxcloud_cumulus_64", { w: 64, h: 32 }, draw((B) => cloud(B, 32, 27, 46, 13, DAY, { seed: 3, n: 6, heap: 2 })))
sprite("fxcloud_cumulus_48", { w: 48, h: 24 }, draw((B) => cloud(B, 24, 20, 32, 10.5, DAY, { seed: 5, n: 5, heap: 2 })))
sprite("fxcloud_puff_32", { w: 32, h: 16 }, draw((B) => cloud(B, 16, 13, 20, 7, DAY, { seed: 2, n: 4, heap: 1 })))
sprite("fxcloud_puff_16", { w: 16, h: 16 }, draw((B) => cloud(B, 8, 11, 9, 4.5, DAY, { seed: 4, n: 3, heap: 1 })))
sprite("fxcloud_night_48", { w: 48, h: 24 }, draw((B) => cloud(B, 24, 20, 32, 10.5, NIGHT, { seed: 8, n: 5, heap: 2 })))
sprite("fxcloud_storm_64", { w: 64, h: 32 }, draw((B) => cloud(B, 32, 26, 50, 14, STORM, { seed: 11, n: 8, heap: 4, flat: 1 })))
sprite("fxcloud_sunset_48", { w: 48, h: 24 }, draw((B) => cloud(B, 24, 20, 34, 9.5, SUNSET, { seed: 6, n: 6, heap: 2 })))
sprite("fxcloud_stratus_64", { w: 64, h: 16 }, draw((B) => cloud(B, 32, 12, 46, 6, GREY, { seed: 9, n: 10, heap: 3 })))

sheet("fxclouds", ["fxcloud_*"], { pad: 2 })
