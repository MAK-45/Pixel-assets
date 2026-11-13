include("../_palette.px.js")
include("_fx.px.js")

const meta = {
  title: "Buisson (style pixelfx)",
  description: "Buissons vus de face au rendu riche inspiré de pixelfx : pas de contour noir, feuillage en grappes modelées par la lumière en haut à gauche (même constructeur de couronne que les arbres fxtree), base sombre posée au sol, ombre translucide. Variantes : buisson rond (32 et 16 px), buisson à baies rouges, buisson en fleurs roses, haie basse (48 px), buisson d'automne, buisson de conifère. Buisson seul, sans décor autour.",
  tags: ["bush", "shrub", "plant", "vegetation", "nature", "decoration", "realistic", "pixelfx"],
  variants: {
    round_32: { label: "Buisson rond (32 px)", props: { shape: "round", season: "summer", fruit: "none" } },
    round_16: { label: "Buisson rond (16 px)", props: { shape: "round", season: "summer", fruit: "none" } },
    berry_32: { label: "Buisson à baies (32 px)", props: { shape: "round", season: "summer", fruit: "berry" }, tags: ["berries", "red"] },
    flowering_32: { label: "Buisson en fleurs (32 px)", props: { shape: "round", season: "spring", fruit: "flower" }, tags: ["blossom", "pink"] },
    hedge_48: { label: "Haie basse (48 px)", props: { shape: "hedge", season: "summer", fruit: "none" }, tags: ["hedge", "border"] },
    autumn_32: { label: "Buisson d'automne (32 px)", props: { shape: "round", season: "autumn", fruit: "none" }, tags: ["autumn"] },
    conifer_32: { label: "Buisson de conifère (32 px)", props: { shape: "round", season: "summer", fruit: "none" }, tags: ["juniper", "conifer"] },
  },
}

const AUTUMN = ["B", "R", "r", "o", "y", "Y"]
const JUNIPER = ["4", "P", "p", "e", "E"]

// Buisson : masses de feuillage posées au sol (le bas est coupé net par le sol, plus sombre),
// grappes, puis retouches `fx` (baies, fleurs) sur les paliers éclairés.
function bush(masses, { ramp = LEAF, seed = 1, bias = 0, clump = {}, shadow, fx = [] } = {}) {
  return (c) => {
    const B = Buf(c.w, c.h), gy = c.h - 1, R = rng(seed * 17 + 3)
    groundShadow(B, shadow[0], gy, shadow[1], shadow[2] ?? 2)
    const clumps = genClumps(masses, { seed, ...clump })
    // une grappe ne descend pas sous le sol
    const cr = crown(B, clumps.map(([x, y, r, z, m]) => [x, Math.min(y, gy - r * 0.6), r, z, m]), masses, { ramp, seed, bias, leafAmp: 0.34 })
    // base : la ligne au sol prend le palier le plus sombre
    for (let x = 0; x < B.w; x++) if (ramp.includes(B.get(x, gy))) B.set(x, gy, ramp[0])
    for (const f of fx) f(B, cr, R)
    B.flush(c)
  }
}

// Petits fruits ou fleurs : grains de 1 à 2 px, surtout sur les paliers moyens à clairs, avec un reflet
// côté lumière ; jamais au bord du vide (ils restent dans le feuillage).
const dots = (n, cols, { minTier = 2, size = 2 } = {}) => (B, cr, R) => {
  let placed = 0, tries = 0
  while (placed < n && tries++ < 4000) {
    const x = 1 + Math.floor(R() * (B.w - 3)), y = 1 + Math.floor(R() * (B.h - 4))
    const t = cr.at(x, y)
    if (t < minTier || cr.at(x + 1, y + 1) < 1 || cr.at(x - 1, y - 1) < 1) continue
    const [dark, mid, lit] = cols
    if (size === 2) { B.set(x, y, mid); B.set(x + 1, y, dark); B.set(x, y + 1, dark); B.set(x + 1, y + 1, dark); B.set(x, y, lit) }
    else B.set(x, y, R() < 0.5 ? lit : mid)
    placed++
  }
}

const ROUND32 = [[9, 22, 8, 7, 0], [23, 21, 8, 8, 0], [16, 15, 10, 8, 1], [15, 24, 8, 5, 2]]
sprite("fxbush_round_32", { w: 32, h: 32 }, bush(ROUND32, { seed: 3, clump: { rmin: 2.6, rmax: 4.2 }, shadow: [18, 13] }))

sprite("fxbush_round_16", { w: 16, h: 16 }, bush([[5, 11, 4, 3.5, 0], [11, 11, 4, 3.5, 0], [8, 8, 5, 4, 1]], {
  seed: 5, bias: 0.03, clump: { rmin: 1.5, rmax: 2.3 }, shadow: [9, 6, 1],
}))

sprite("fxbush_berry_32", { w: 32, h: 32 }, bush(ROUND32, {
  seed: 7, bias: -0.02, clump: { rmin: 2.6, rmax: 4.2 }, shadow: [18, 13],
  fx: [dots(9, ["R", "r", "Z"])],
}))

sprite("fxbush_flowering_32", { w: 32, h: 32 }, bush(ROUND32, {
  seed: 3, bias: 0.02, clump: { rmin: 2.6, rmax: 4.2 }, shadow: [18, 13],
  fx: [dots(12, ["6", "z", "7"]), dots(10, ["z", "Z", "7"], { size: 1, minTier: 3 })],
}))

sprite("fxbush_hedge_48", { w: 48, h: 24 }, bush(
  [[7, 15, 7, 6, 0], [19, 13, 8, 7, 0], [31, 14, 8, 7, 0], [41, 15, 6, 6, 0], [13, 10, 8, 5, 1], [29, 9, 9, 5, 1], [24, 17, 13, 5, 2]],
  { seed: 13, clump: { rmin: 2.4, rmax: 4 }, shadow: [26, 22] },
))

sprite("fxbush_autumn_32", { w: 32, h: 32 }, bush(ROUND32, { ramp: AUTUMN, seed: 4, bias: -0.02, clump: { rmin: 2.6, rmax: 4.2 }, shadow: [18, 13] }))

sprite("fxbush_conifer_32", { w: 32, h: 32 }, bush([[10, 22, 8, 7, 0], [22, 22, 8, 7, 0], [16, 14, 8, 10, 1]], {
  ramp: JUNIPER, seed: 6, bias: 0.05, clump: { rmin: 2.2, rmax: 3.4 }, shadow: [18, 12],
}))

sheet("fxbushs", ["fxbush_*"], { pad: 2 })
