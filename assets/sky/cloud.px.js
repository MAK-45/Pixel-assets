include("../_palette.px.js")

const meta = {
  title: "Nuage",
  description: "Nuages vus de face pour ciels de décors 2D : cumulus (16, 32 px), petit nuage, longue bande de stratus (48 × 16), nuage gris d'orage, nuage de pluie (fixe et animé), nuage de neige, nuage d'orage à éclair, et recolorations coucher de soleil et nuit. Puffs arrondis, lumière en haut à gauche, base plate ombrée.",
  tags: ["cloud", "sky", "weather", "background", "scenery", "cumulus"],
  variants: {
    cumulus_16: { label: "Petit cumulus (16 px)", props: { shape: "cumulus", weather: "fair", time: "day" }, tags: ["icon"] },
    cumulus_32: { label: "Cumulus", props: { shape: "cumulus", weather: "fair", time: "day" } },
    puff_24: { label: "Petit nuage isolé", props: { shape: "puff", weather: "fair", time: "day" } },
    stratus_48: { label: "Bande de stratus (48 × 16)", props: { shape: "stratus", weather: "fair", time: "day" }, tags: ["long"] },
    sunset_32: { label: "Cumulus au coucher du soleil", props: { shape: "cumulus", weather: "fair", time: "sunset" }, tags: ["pink", "dusk"] },
    sunset_48: { label: "Stratus au coucher du soleil (48 × 16)", props: { shape: "stratus", weather: "fair", time: "sunset" }, tags: ["pink", "dusk", "long"] },
    night_32: { label: "Cumulus de nuit", props: { shape: "cumulus", weather: "fair", time: "night" }, tags: ["dark"] },
    storm_32: { label: "Nuage gris d'orage", props: { shape: "cumulus", weather: "storm", time: "day" }, tags: ["gray", "dark"] },
    rain_32: { label: "Nuage de pluie", props: { shape: "cumulus", weather: "rain", time: "day" }, tags: ["rain", "drops"] },
    rain_anim_32: { label: "Nuage de pluie (animé)", props: { shape: "cumulus", weather: "rain", time: "day" }, tags: ["rain", "animated"] },
    snow_32: { label: "Nuage de neige", props: { shape: "cumulus", weather: "snow", time: "day" }, tags: ["snow", "winter"] },
    thunder_32: { label: "Nuage d'orage à éclair", props: { shape: "cumulus", weather: "thunder", time: "day" }, tags: ["lightning", "storm"] },
  },
}

// Nuage = union de cercles (puffs) coupée par une base plate.
// w : calotte éclairée en haut à gauche de chaque puff, s : corps, S : ombre en bas à droite et base.
const inCirc = (cx, cy, r) => (x, y) => (x + 0.5 - cx) ** 2 + (y + 0.5 - cy) ** 2 <= r * r
// Ombrage par formes : chaque couche est l'union des puffs rétrécis et décalés vers la lumière,
// ce qui garde des bords festonnés (un puff = une bosse de lumière) sans bruit.
const cloud = (puffs, bottom, { dy = 0 } = {}) => (c) => {
  const P = puffs.map(([cx, cy, r]) => [cx, cy + dy, r])
  const B = bottom + dy
  const U = (ox, oy, dr, cut) => (x, y) => y < cut && P.some(([cx, cy, r]) => r + dr > 0 && inCirc(cx + ox, cy + oy, r + dr)(x, y))
  const layers = [
    [U(0, 0, 0, B), "S"],
    [U(-0.5, -1, -0.5, B - 2), "s"],
    [U(-1.2, -1.8, -2, B - 4), "w"],
  ]
  for (const [inside, col] of layers)
    for (let y = 0; y < c.h; y++)
      for (let x = 0; x < c.w; x++) if (inside(x, y)) c.px(x, y, col)
}

const SUNSET = { w: "Z", s: "z", S: "v" }
const NIGHT = { w: "c", s: "m", S: "d" }
const STORM = { w: "C", s: "c", S: "m" }

// ---------------------------------------------------------------- cumulus
const CUMULUS = [[8, 11, 5], [15, 8, 7], [22, 10, 5.5], [4, 13, 3.5], [26, 13, 3.5]]
sprite("cloud_cumulus_32", { w: 30, h: 16, outline: "k" }, cloud(CUMULUS, 16))
sprite("cloud_sunset_32", { base: "cloud_cumulus_32", swap: SUNSET })
sprite("cloud_night_32", { base: "cloud_cumulus_32", swap: NIGHT })
sprite("cloud_storm_32", { base: "cloud_cumulus_32", swap: STORM })

sprite("cloud_cumulus_16", { w: 14, h: 8, outline: "k" }, cloud([[4, 5, 3], [8, 4, 4], [11, 6, 2.5], [2, 6, 2]], 8))
sprite("cloud_puff_24", { w: 22, h: 12, outline: "k" }, cloud([[7, 8, 4.5], [12, 6, 5.5], [17, 8, 4]], 12))

// ---------------------------------------------------------------- stratus (bande longue)
const STRATUS = [[5, 10, 4], [11, 8, 5], [18, 7, 5], [25, 8, 5], [32, 7, 5.5], [39, 9, 4.5], [43, 11, 3]]
sprite("cloud_stratus_48", { w: 46, h: 13, outline: "k" }, cloud(STRATUS, 13))
sprite("cloud_sunset_48", { base: "cloud_stratus_48", swap: SUNSET })

// ---------------------------------------------------------------- météo : pluie, neige, éclair
// Gouttes en diagonale légère (vent) : I tête claire, i traîne.
sprite("_drop", `
  I
  i`)
sprite("_flake_a", `
  .w.
  wsw
  .w.`)
sprite("_flake_b", "w")
const DROPS = [[5, 0], [11, 3], [17, 1], [23, 4], [8, 7], [20, 8], [14, 6], [26, 1], [3, 9]]
const STORM_BODY = (dy = 0) => [cloud(CUMULUS, 16, { dy }), (c) => c.recolor(STORM)]
sprite("cloud_rain_32", { w: 30, h: 28, outline: "k" }, ...STORM_BODY(),
  ...DROPS.map(([x, y]) => stamp("_drop", x, y + 17)))
// Animation : 7 colonnes de gouttes déphasées, chute de 2 px par image sur une période de 10 px.
const ADROPS = [[3, 0], [7, 6], [11, 2], [15, 8], [19, 4], [23, 0], [27, 6]]
anim("cloud_rain_anim_32", { w: 30, h: 28, outline: "k", frames: 5, fps: 10 }, ...STORM_BODY(),
  (c) => { for (const [x, y] of ADROPS) c.stamp("_drop", x, 16 + ((y + c.frame * 2) % 10)) })
sprite("cloud_snow_32", { w: 30, h: 28, outline: "k" }, cloud(CUMULUS, 16),
  (c) => c.recolor({ w: "w", s: "C", S: "c" }),
  stamp("_flake_a", 4, 18), stamp("_flake_a", 15, 21), stamp("_flake_a", 23, 17),
  stamp("_flake_b", 10, 18), stamp("_flake_b", 20, 25), stamp("_flake_b", 7, 24), stamp("_flake_b", 26, 23))
// Éclair en zigzag sous le nuage : Y cœur, y bord.
sprite("cloud_thunder_32", { w: 30, h: 30, outline: "k" }, ...STORM_BODY(),
  poly([14, 15, 19, 15, 16, 20, 19, 20, 12, 29, 14, 22, 11, 22], "y"),
  line(16, 16, 14, 21, "Y"), line(17, 21, 14, 26, "Y"))

sheet("clouds", ["cloud_*"], { pad: 2 })
