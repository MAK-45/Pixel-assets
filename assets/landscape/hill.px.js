include("../_palette.px.js")

const meta = {
  title: "Colline",
  description: "Collines vues de face pour décors 2D, posées au sol : colline ronde (16, 32 px) en herbe d'été, fleurie, parsemée de pierres, dorée d'automne ou enneigée ; vallonnement de trois collines qui se recouvrent (64 × 24) en été, fleuri, automne et hiver ; dune de sable et champ de dunes du désert. Ombrage en croissants (lumière en haut à gauche), contour sombre.",
  tags: ["hill", "landscape", "terrain", "background", "scenery", "relief", "meadow", "ground"],
  variants: {
    round_16: { label: "Petite colline (16 px)", props: { shape: "round", season: "summer", cover: "grass" }, tags: ["icon", "grass"] },
    round_32: { label: "Colline ronde – été", props: { shape: "round", season: "summer", cover: "grass" }, tags: ["grass"] },
    flowers_32: { label: "Colline fleurie – printemps", props: { shape: "round", season: "spring", cover: "flowers" }, tags: ["flower", "grass"] },
    rocky_32: { label: "Colline semée de pierres", props: { shape: "round", season: "summer", cover: "rocks" }, tags: ["rock", "stone", "grass"] },
    autumn_32: { label: "Colline dorée – automne", props: { shape: "round", season: "autumn", cover: "grass" }, tags: ["grass", "golden"] },
    snow_32: { label: "Colline enneigée – hiver", props: { shape: "round", season: "winter", cover: "snow" }, tags: ["snow"] },
    rolling_64: { label: "Vallonnement – été (64 × 24)", props: { shape: "rolling", season: "summer", cover: "grass" }, tags: ["grass", "countryside"] },
    rolling_flowers_64: { label: "Vallonnement fleuri – printemps (64 × 24)", props: { shape: "rolling", season: "spring", cover: "flowers" }, tags: ["flower", "countryside"] },
    rolling_autumn_64: { label: "Vallonnement doré – automne (64 × 24)", props: { shape: "rolling", season: "autumn", cover: "grass" }, tags: ["golden", "countryside"] },
    rolling_snow_64: { label: "Vallonnement enneigé – hiver (64 × 24)", props: { shape: "rolling", season: "winter", cover: "snow" }, tags: ["snow", "countryside"] },
    dune_32: { label: "Dune de sable", props: { shape: "dune", season: "summer", cover: "sand" }, tags: ["desert", "sand"] },
    dunes_64: { label: "Champ de dunes (64 × 22)", props: { shape: "dune", season: "summer", cover: "sand" }, tags: ["desert", "sand"] },
  },
}

// ================================================================ outils communs

// Verts (G ombre, g corps, l face éclairée, L reflet) et leurs recolorations de saison.
const GOLD = { G: "b", g: "o", l: "y", L: "Y" }
const SNOW = { G: "S", g: "s", l: "w", L: "w" }

// Profil en cloche : sommet (cx, top), demi-largeur hw, pied à y = base. Infinity hors du dôme.
const domeY = (cx, hw, top, base, p = 0.6) => (x) => {
  const t = (x + 0.5 - cx) / hw
  return Math.abs(t) >= 1 ? Infinity : Math.round(base - (base - top) * Math.pow(1 - t * t, p))
}

// Colline ombrée par formes : dôme sombre, dôme moyen décalé vers le haut-gauche (laisse un
// croissant d'ombre à droite et en bas), calotte claire en haut à gauche, liseré de lumière sur la crête.
// `p` = clés { d, m, l, h } ; `under` = clés sur lesquelles peindre (pour les collines de devant).
const GRASSP = { d: "G", m: "g", l: "l", h: "L" }
const hill = (cx, hw, top, base, { p = GRASSP, rim = true } = {}) => (c) => {
  const outer = domeY(cx, hw, top, base)
  const fill = (f, bottom, col) => {
    for (let x = 0; x < c.w; x++)
      for (let y = Math.max(0, outer(x), f(x)); y < Math.min(c.h, bottom); y++) c.px(x, y, col)
  }
  const h = base - top
  fill(outer, base, p.d)
  fill(domeY(cx - 1, hw - 2, top, base - 2), base - 2, p.m)
  const lb = base - Math.round(h * 0.45)
  fill(domeY(cx - Math.round(hw * 0.35), Math.round(hw * 0.5), top + (h > 8 ? 1 : 0), lb), lb, p.l)
  if (rim)
    for (let x = Math.round(cx - hw * 0.8); x <= cx - 1; x++) {
      const y = outer(x)
      if (y !== Infinity && y >= 0) c.px(x, y, c.is(x, y, p.l) ? p.h : p.l)
    }
}

// Touffe d'herbe en V : éclaircit d'un cran ce qu'elle recouvre (G -> g -> l -> L), donc
// reste lisible quelle que soit la zone d'ombre où elle tombe.
const V_TUFT = [[0, 0], [2, 0], [1, 1]]
const V_TUFT_B = [[0, 0], [1, 1], [2, 1]]
const tuft = (x, y, shape = V_TUFT) => light((px, py) => shape.some(([dx, dy]) => px === x + dx && py === y + dy))
const tuftsAt = (list) => list.map(([x, y, b]) => tuft(x, y, b ? V_TUFT_B : V_TUFT))

// Brin d'herbe sèche qui perce la neige.
sprite("_tuft", `
  l.l
  .l.`)
// Fleurs des champs (1 px ou en croix) et affleurements de roche.
sprite("_bloom_a", "Z")
sprite("_bloom_b", "w")
sprite("_bloom_c", "y")
sprite("_bloom_d", `
  .Z.
  ZyZ
  .Z.`)
sprite("_bloom_e", `
  .w.
  wyw
  .w.`)
// Pierres à demi enterrées ; la rangée G est leur ombre portée sur l'herbe.
sprite("_outcrop", `
  ..cC...
  .cCCcm.
  ccmcmmd
  cmmmmdd
  .GGGGG.`)
sprite("_outcrop_s", `
  .cC.
  ccmd
  mmdd
  .GG.`)

// ================================================================ colline ronde (32 px)

const W32 = 30, H32 = 16
const TUFTS32 = tuftsAt([[6, 6], [13, 9, 1], [21, 4], [9, 12], [19, 11, 1], [25, 8], [3, 10], [24, 13], [15, 13]])
const ROUND32 = [hill(15, 15, 1, 16), ...TUFTS32]
sprite("hill_round_32", { w: W32, h: H32, outline: "k" }, ...ROUND32)
sprite("hill_flowers_32", { w: W32, h: H32, outline: "k" }, ...ROUND32,
  scatter("_bloom_*", 2, 2, 26, 13, 16, { on: "glG", seed: 4 }))
sprite("hill_rocky_32", { w: W32, h: H32, outline: "k" }, ...ROUND32,
  stamp("_outcrop", 9, 1), stamp("_outcrop_s", 19, 4), stamp("_outcrop_s", 23, 10),
  stamp("_outcrop", 2, 10), stamp("_outcrop_s", 13, 11),
  // herbe qui repousse au pied des pierres
  ...tuftsAt([[8, 4], [20, 6], [1, 14]]))
sprite("hill_autumn_32", { base: "hill_round_32", swap: GOLD })
// En hiver : neige épaisse, quelques brins d'herbe sèche qui dépassent.
const SNOWP = { d: "S", m: "s", l: "w", h: "w" }
sprite("hill_snow_32", { w: W32, h: H32, outline: "k" }, hill(15, 15, 1, 16, { p: SNOWP }),
  ...tuftsAt([[7, 8], [19, 12, 1], [24, 9]]),
  ...[[10, 6], [21, 5], [5, 12], [16, 10], [26, 12]].map(([x, y]) => stamp("_tuft", x, y, { swap: { l: "n" } })))

// ================================================================ petite colline (16 px)

sprite("hill_round_16", { w: 14, h: 8, outline: "k" }, hill(7, 7, 0, 8),
  ...tuftsAt([[3, 4], [8, 5, 1], [10, 2]]))

// ================================================================ vallonnement (64 × 24)

// Trois collines qui se recouvrent : celles du fond sont plus sombres, celles de devant gardent
// leur liseré de lumière, ce qui sépare les plans sans contour intérieur.
const BACKP = { d: "P", m: "G", l: "g", h: "l" }
const WR = 62, HR = 22
const ROLLING = [
  hill(42, 21, 0, 22, { p: BACKP }),
  hill(10, 12, 7, 22, { p: BACKP }),
  hill(25, 17, 6, 22),
  hill(53, 10, 12, 22),
  ...tuftsAt([[33, 6], [40, 4], [48, 8], [56, 5], [4, 13], [12, 11], [17, 10], [24, 12, 1], [30, 15], [20, 17],
    [36, 18], [50, 15], [55, 18, 1], [9, 18], [44, 13]]),
]
sprite("hill_rolling_64", { w: WR, h: HR, outline: "k" }, ...ROLLING)
sprite("hill_rolling_flowers_64", { w: WR, h: HR, outline: "k" }, ...ROLLING,
  scatter("_bloom_*", 2, 8, 58, 13, 24, { on: "glL", seed: 9 }))
sprite("hill_rolling_autumn_64", { base: "hill_rolling_64", swap: { ...GOLD, P: "B" } })
sprite("hill_rolling_snow_64", { base: "hill_rolling_64", swap: { ...SNOW, P: "c" } })

// ================================================================ dunes de sable

// Dune : pente au vent longue et bombée à gauche, crête arrondie, face d'avalanche raide à droite.
// Sable : Y crête éclairée, N pente au vent, n rides et creux, b face d'avalanche, B son pied.
const dune = (x0, xc, x1, top, base, ripples = []) => (c) => {
  const h = base - top
  const yAt = (x) => {
    const wind = x < xc
    const t = wind ? (x + 0.5 - x0) / (xc - x0) : (x1 - x - 0.5) / (x1 - xc)
    return Math.round(base - h * (wind ? 1 - Math.pow(1 - t, 2.2) : Math.pow(t, 0.8)))
  }
  for (let x = x0; x < x1; x++) {
    const y0 = yAt(x)
    for (let y = Math.max(0, y0); y < base; y++) {
      if (x >= xc) c.px(x, y, y >= base - 2 || y - y0 > h * 0.6 ? "B" : "b")
      else c.px(x, y, y === y0 && x > x0 + (xc - x0) * 0.5 ? "Y" : y >= base - 2 ? "n" : "N")
    }
  }
  // rides : petites vagues en escalier sur la pente au vent (x, y, longueur)
  for (const [rx, ry, len] of ripples)
    for (let i = 0; i < len; i++) {
      const x = rx + i, y = ry + (i >= len / 2 ? 1 : 0)
      if (c.is(x, y, "N")) c.px(x, y, "n")
    }
}
sprite("hill_dune_32", { w: 30, h: 12, outline: "k" },
  dune(0, 19, 30, 1, 12, [[8, 6, 4], [13, 4, 4], [4, 9, 4], [11, 8, 5], [15, 7, 3]]))
sprite("hill_dunes_64", { w: 62, h: 20, outline: "k" },
  dune(20, 46, 62, 0, 20, [[30, 6, 4], [36, 4, 4], [27, 9, 5], [40, 7, 4], [33, 11, 5]]),
  dune(0, 24, 38, 7, 20, [[6, 15, 4], [12, 12, 5], [18, 10, 4], [4, 17, 3], [15, 15, 4]]))

sheet("hills", ["hill_*"], { pad: 2 })
