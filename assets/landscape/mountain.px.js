include("../_palette.px.js")

const meta = {
  title: "Montagne",
  description: "Montagnes vues de face pour décors 2D et arrière-plans : pic à deux sommets (16, 32, 64 px) enneigé, alpin avec forêt de sapins au pied ou tout blanc en hiver ; chaîne de trois sommets (64 × 32) en versions jour, alpine, lointaine bleutée et crépuscule pour les couches de parallaxe ; volcan endormi au sommet enneigé et volcan en éruption animé (lave, fumée) ; mesa du désert en grès ou en roche rouge. Lumière en haut à gauche, contour sombre, sol en bas du canevas.",
  tags: ["mountain", "peak", "landscape", "background", "scenery", "terrain", "parallax", "relief"],
  variants: {
    peak_snow_16: { label: "Pic enneigé (16 px)", props: { shape: "peak", cover: "snowcap", tone: "day", material: "granite" }, tags: ["icon", "snow"] },
    peak_alpine_16: { label: "Pic alpin (16 px)", props: { shape: "peak", cover: "forest", tone: "day", material: "granite" }, tags: ["icon", "forest"] },
    peak_winter_16: { label: "Pic en hiver (16 px)", props: { shape: "peak", cover: "snow", tone: "day", material: "granite" }, tags: ["icon", "snow", "winter"] },
    peak_snow_32: { label: "Pic enneigé (32 px)", props: { shape: "peak", cover: "snowcap", tone: "day", material: "granite" }, tags: ["snow"] },
    peak_alpine_32: { label: "Pic alpin, forêt au pied (32 px)", props: { shape: "peak", cover: "forest", tone: "day", material: "granite" }, tags: ["forest", "pine"] },
    peak_winter_32: { label: "Pic tout enneigé (32 px)", props: { shape: "peak", cover: "snow", tone: "day", material: "granite" }, tags: ["snow", "winter"] },
    peak_snow_64: { label: "Grand pic enneigé (64 px)", props: { shape: "peak", cover: "snowcap", tone: "day", material: "granite" }, tags: ["snow"] },
    peak_alpine_64: { label: "Grand pic alpin, alpage et sapins (64 px)", props: { shape: "peak", cover: "forest", tone: "day", material: "granite" }, tags: ["forest", "pine", "meadow"] },
    peak_winter_64: { label: "Grand pic tout enneigé (64 px)", props: { shape: "peak", cover: "snow", tone: "day", material: "granite" }, tags: ["snow", "winter"] },
    range_snow_64: { label: "Chaîne de sommets enneigés (64 × 32)", props: { shape: "range", cover: "snowcap", tone: "day", material: "granite" }, tags: ["snow", "range"] },
    range_alpine_64: { label: "Chaîne alpine, forêt au pied (64 × 32)", props: { shape: "range", cover: "forest", tone: "day", material: "granite" }, tags: ["forest", "pine", "range"] },
    range_far_64: { label: "Chaîne lointaine bleutée (64 × 32)", props: { shape: "range", cover: "snowcap", tone: "haze", material: "granite" }, tags: ["distant", "haze", "range"] },
    range_dusk_64: { label: "Chaîne au crépuscule (64 × 32)", props: { shape: "range", cover: "snowcap", tone: "dusk", material: "granite" }, tags: ["sunset", "evening", "range"] },
    volcano_snow_48: { label: "Volcan endormi enneigé (48 px)", props: { shape: "volcano", cover: "snowcap", tone: "day", material: "granite" }, tags: ["volcano", "snow", "dormant"] },
    volcano_active_48: { label: "Volcan en éruption, animé (48 px)", props: { shape: "volcano", cover: "lava", tone: "day", material: "basalt" }, tags: ["volcano", "lava", "smoke", "eruption", "animated", "fire"] },
    mesa_48: { label: "Mesa de grès (48 × 32)", props: { shape: "mesa", cover: "bare", tone: "day", material: "sandstone" }, tags: ["desert", "butte", "cliff"] },
    mesa_red_48: { label: "Mesa de roche rouge (48 × 32)", props: { shape: "mesa", cover: "bare", tone: "day", material: "redstone" }, tags: ["desert", "butte", "cliff", "canyon"] },
  },
}

// ================================================================ outils communs

// x d'une polyligne [x0, y0, x1, y1, ...] (y croissant) à la hauteur y.
const xAt = (pts, y) => {
  for (let i = 0; i + 3 < pts.length; i += 2) {
    const [x0, y0, x1, y1] = pts.slice(i, i + 4)
    if (y >= y0 && y <= y1) return y1 === y0 ? x1 : x0 + ((x1 - x0) * (y - y0)) / (y1 - y0)
  }
  return y < pts[1] ? pts[0] : pts[pts.length - 2]
}

// Ligne de neige dentelée : y de base + langues qui descendent dans les couloirs.
// tongues = [[x, profondeur, demi-largeur], ...]
const lineY = (base, tongues) => (x) => {
  let y = base
  for (const [tx, depth, hw] of tongues) {
    const t = 1 - Math.abs(x - tx) / hw
    if (t > 0) y = Math.max(y, base + Math.round(depth * t))
  }
  return y + ((x * 5) % 3 === 0 ? 1 : 0)
}

// Rock (d ombre, m corps, c face éclairée, C arête) -> neige (S ombre, s, w lumière).
const SNOW = { C: "w", c: "w", m: "s", d: "S" }

// ================================================================ grand pic (64 px)

const W64 = 62, H64 = 44
const SKY64 = [0, 44, 3, 41, 7, 37, 10, 35, 13, 34, 16, 30, 20, 25, 23, 23, 25, 22, 28, 16, 31, 10, 33, 5, 35, 1,
  37, 3, 39, 7, 41, 10, 43, 14, 45, 15, 47, 13, 49, 10, 51, 12, 53, 16, 55, 21, 57, 27, 59, 33, 61, 39, 62, 44]
const PEAK64 = [
  // face gauche éclairée en entier, puis les faces qui se détournent de la lumière
  poly(SKY64, "c"),
  // éperons : ils rayonnent depuis le sommet et les épaulements ; la face droite de chacun
  // se détourne de la lumière (demi-teinte), en coin qui s'élargit vers le pied
  poly([34, 4, 33, 14, 31, 26, 30, 36, 30, 44, 35, 44, 34, 34, 34, 22, 35, 10], "m"),
  poly([28, 16, 26, 24, 23, 33, 21, 44, 25, 44, 26, 34, 28, 26, 29, 19], "m"),
  poly([20, 25, 18, 31, 15, 38, 13, 44, 16, 44, 18, 37, 21, 29], "m"),
  poly([10, 35, 8, 39, 6, 44, 9, 44, 10, 40], "m"),
  // pied de la montagne moins éclairé
  poly([0, 44, 3, 41, 9, 42, 18, 41, 24, 42, 31, 40, 38, 42, 39, 44], "m"),
  // face à l'ombre du sommet principal, avec deux arêtes à peine éclairées
  poly([35, 1, 37, 3, 39, 7, 41, 10, 43, 14, 45, 15, 46, 20, 48, 26, 50, 34, 52, 44, 39, 44, 37, 38, 38, 31, 36, 24, 37, 17, 35, 11, 36, 6], "d"),
  line(41, 11, 43, 19, "m"), line(43, 19, 44, 25, "m"),
  // second sommet : face gauche en demi-teinte, face droite dans l'ombre
  poly([45, 15, 47, 13, 49, 10, 49, 16, 50, 23, 51, 30, 47, 24, 46, 20], "m"),
  poly([49, 10, 51, 12, 53, 16, 55, 21, 57, 27, 59, 33, 61, 39, 62, 44, 52, 44, 51, 30, 50, 23, 49, 16], "d"),
  line(54, 19, 55, 26, "m"),
  // arêtes en pleine lumière le long de la crête gauche
  line(4, 40, 9, 36, "C"), line(17, 29, 21, 25, "C"), line(26, 20, 30, 12, "C"),
]
const snowcap64 = clip((x, y) => y <= lineY(13, [[25, 8, 3], [31, 7, 2], [37, 9, 3], [42, 5, 2], [48, 6, 3]])(x), recolor(SNOW))

// Alpage + forêt de sapins au pied. top(x) = haut de la forêt ; l'alpage occupe les `meadow` px
// au-dessus. Les sapins (3 px) sont plantés en rangées décalées, du fond vers l'avant ; ceux qui
// sont à droite de l'arête `ridge` sont dans l'ombre.
const FIR = [".e.", "epP", "ppP"]
const firForest = (top, ridge, meadow = 3) => (c) => {
  const mask = (x, y) => c.is(x, y, "*") && !c.is(x, y, "k")
  for (let x = 0; x < c.w; x++)
    for (let y = top(x) - meadow; y < c.h; y++) if (mask(x, y) && c.is(x, y, "CcmdswS")) {
      const lit = x < xAt(ridge, y)
      c.px(x, y, y < top(x) + 1 ? (lit ? (c.is(x, y, "Cc") ? "l" : "g") : "G") : "P")
    }
  for (let row = 0; row * 3 < c.h; row++)
    for (let tx = (row % 2) * 2 - 2; tx < c.w; tx += 4) {
      const ty = Math.min(...[0, 1, 2].map((i) => top(tx + i))) + row * 3 - 1
      if (row === 0 && ty < top(tx + 1) - 1) continue
      const lit = tx + 1 < xAt(ridge, ty + 2)
      FIR.forEach((r, j) => [...r].forEach((k, i) => {
        if (k === "." || !mask(tx + i, ty + j) || ty + j < top(tx + i) - 1) return
        c.px(tx + i, ty + j, lit ? k : { e: "p", p: "P", P: "P" }[k])
      }))
    }
}
const RIDGE64 = [35, 1, 36, 6, 35, 11, 37, 17, 36, 24, 38, 31, 37, 38, 39, 44]

sprite("mountain_peak_snow_64", { w: W64, h: H64, outline: "k" }, ...PEAK64, snowcap64)
sprite("mountain_peak_alpine_64", { w: W64, h: H64, outline: "k" }, ...PEAK64, snowcap64,
  firForest((x) => 37 - lineY(0, [[7, 5, 7], [19, 4, 6], [30, 3, 5], [46, 2, 5], [57, 4, 5]])(x), RIDGE64))
sprite("mountain_peak_winter_64", { w: W64, h: H64, outline: "k" }, ...PEAK64,
  recolor(SNOW),
  // rochers trop raides pour garder la neige, le long des éperons
  poly([33, 16, 32, 22, 33, 23, 34, 17], "m"), poly([31, 28, 30, 34, 31, 35, 32, 29], "m"),
  poly([27, 21, 25, 27, 26, 28, 28, 22], "m"), poly([19, 31, 17, 36, 18, 37, 20, 32], "m"),
  poly([42, 15, 43, 21, 44, 21, 43, 15], "d"), poly([50, 22, 51, 28, 52, 28, 51, 22], "d"),
  poly([37, 33, 38, 39, 39, 39, 38, 33], "d"))

// ================================================================ pic moyen (32 px)

const W32 = 30, H32 = 26
const SKY32 = [0, 26, 3, 23, 6, 21, 8, 19, 11, 14, 13, 10, 15, 5, 17, 1, 19, 4, 21, 8, 23, 10, 25, 7, 27, 10, 28, 15, 29, 20, 30, 26]
const RIDGE32 = [17, 1, 18, 6, 17, 12, 18, 19, 18, 26]
const PEAK32 = [
  poly(SKY32, "c"),
  poly([16, 3, 15, 11, 14, 18, 14, 26, 17, 26, 17, 17, 17, 8], "m"),
  poly([12, 12, 10, 18, 8, 26, 11, 26, 12, 19, 13, 14], "m"),
  poly([0, 26, 3, 23, 7, 25, 12, 24, 18, 25, 18, 26], "m"),
  poly([17, 1, 19, 4, 21, 8, 23, 10, 24, 16, 26, 26, 18, 26, 18, 19, 17, 12, 18, 6], "d"),
  poly([23, 10, 25, 7, 25, 12, 26, 18, 24, 15], "m"),
  poly([25, 7, 27, 10, 28, 15, 29, 20, 30, 26, 26, 26, 26, 18, 25, 12], "d"),
  line(20, 8, 21, 14, "m"),
  line(2, 23, 5, 21, "C"), line(9, 16, 11, 13, "C"),
]
const snowcap32 = clip((x, y) => y <= lineY(7, [[13, 4, 2], [17, 5, 2], [21, 3, 2], [25, 4, 2]])(x), recolor(SNOW))

sprite("mountain_peak_snow_32", { w: W32, h: H32, outline: "k" }, ...PEAK32, snowcap32)
sprite("mountain_peak_alpine_32", { w: W32, h: H32, outline: "k" }, ...PEAK32, snowcap32,
  firForest((x) => 21 - lineY(0, [[4, 3, 4], [12, 2, 4], [26, 2, 4]])(x), RIDGE32, 2))
sprite("mountain_peak_winter_32", { w: W32, h: H32, outline: "k" }, ...PEAK32, recolor(SNOW),
  poly([15, 12, 14, 17, 15, 17, 16, 12], "m"), poly([11, 17, 10, 21, 11, 21, 12, 17], "m"),
  poly([21, 13, 22, 18, 23, 18, 22, 13], "d"), poly([26, 17, 27, 22, 28, 22, 27, 17], "d"))

// ================================================================ icône (16 px, à la main)

sprite("mountain_peak_snow_16", { outline: "k" }, `
  ......w.......
  .....wwS......
  .....wsSS.....
  ....wwsSS..w..
  ....cwmSd.wsS.
  ...cCmcdd.sSS.
  ...ccmcddmmdd.
  ..cCcmmddmmddd
  ..ccmcmdddmddd
  .cCcmcmmddmddd
  .ccmmcmmdddddd
  cmmmmmmmdddddd`)
sprite("mountain_peak_alpine_16", { base: "mountain_peak_snow_16" }, `
  ................
  ................
  ................
  ................
  ................
  ................
  ................
  ................
  ................
  ..l.............
  .lgl..e.....P...
  .gggegepPP.pPP..
  .epepepPPPpPPPP.`)
sprite("mountain_peak_winter_16", { base: "mountain_peak_snow_16", swap: SNOW })

// ================================================================ chaîne de sommets (64 × 32)

const WR = 62, HR = 30
const SKYR = [0, 30, 2, 26, 5, 21, 8, 15, 10, 12, 12, 9, 14, 11, 16, 14, 18, 16, 20, 15, 23, 10, 26, 6, 29, 2, 31, 1,
  33, 3, 36, 7, 39, 11, 41, 14, 43, 12, 46, 8, 49, 6, 51, 8, 53, 11, 55, 14, 57, 13, 59, 17, 61, 23, 62, 30]
const RIDGES_R = [12, 9, 13, 14, 12, 20, 14, 30, 31, 1, 32, 6, 31, 12, 33, 20, 32, 30, 49, 6, 50, 12, 49, 20, 51, 30]
const RANGE = [
  poly(SKYR, "c"),
  // éperons des faces éclairées
  poly([11, 11, 9, 20, 8, 30, 11, 30, 11, 20], "m"),
  poly([29, 4, 27, 13, 25, 21, 24, 30, 28, 30, 28, 20, 30, 9], "m"),
  poly([23, 11, 21, 21, 20, 30, 22, 30, 23, 20], "m"),
  poly([47, 9, 45, 18, 44, 30, 47, 30, 48, 18], "m"),
  poly([0, 30, 2, 27, 9, 29, 20, 28, 30, 29, 40, 28, 50, 29, 62, 30], "m"),
  // faces à l'ombre ; chaque vallée sépare l'ombre d'un sommet de la face éclairée du suivant
  poly([12, 9, 14, 11, 16, 14, 18, 16, 19, 22, 20, 30, 14, 30, 12, 20, 13, 14], "d"),
  poly([31, 1, 33, 3, 36, 7, 39, 11, 41, 14, 42, 21, 43, 30, 32, 30, 33, 20, 31, 12, 32, 6], "d"),
  poly([49, 6, 51, 8, 53, 11, 55, 14, 57, 13, 59, 17, 61, 23, 62, 30, 51, 30, 49, 20, 50, 12], "d"),
  poly([55, 14, 57, 13, 57, 19, 58, 24, 56, 20], "m"),
  line(35, 7, 37, 15, "m"), line(52, 10, 53, 16, "m"),
  line(3, 25, 7, 18, "C"), line(20, 15, 25, 8, "C"), line(42, 13, 45, 9, "C"),
]
const snowcapR = clip((x, y) => y <= lineY(8, [[12, 2, 1], [27, 5, 2], [31, 6, 2], [36, 4, 2], [47, 4, 2], [51, 5, 2]])(x), recolor(SNOW))

sprite("mountain_range_snow_64", { w: WR, h: HR, outline: "k" }, ...RANGE, snowcapR)
sprite("mountain_range_alpine_64", { w: WR, h: HR, outline: "k" }, ...RANGE, snowcapR,
  firForest((x) => 25 - lineY(0, [[4, 2, 4], [18, 4, 4], [40, 4, 4], [58, 2, 4]])(x),
    [0, 0, 13, 14, 12, 20, 14, 30], 2),
  // ombre des sommets 2 et 3 sur leur forêt
  clip((x, y) => (x > 33 && x < 42) || x > 50, recolor({ e: "p", p: "P", l: "g", g: "G" })))
// Arrière-plans : lointain bleuté (brume) et crépuscule, pour les couches de parallaxe.
sprite("mountain_range_far_64", { base: "mountain_range_snow_64", swap: { k: "d", d: "m", m: "c", c: "S", C: "s", S: "C" } })
sprite("mountain_range_dusk_64", { base: "mountain_range_snow_64", swap: { k: "V", d: "V", m: "v", c: "x", C: "Z", w: "Y", s: "Z", S: "x" } })

// ================================================================ volcan (48 px)

// Cône tronqué aux pentes concaves ; le cratère s'ouvre en haut (y = 14), la fumée au-dessus.
const WV = 46, HV = 46
const SKYV = [0, 46, 3, 42, 6, 37, 9, 31, 12, 25, 14, 20, 16, 16, 17, 14, 19, 13, 21, 14, 25, 14, 27, 13, 29, 14,
  30, 16, 32, 20, 34, 25, 37, 31, 40, 37, 43, 42, 46, 46]
const VOLCANO = [
  poly(SKYV, "c"),
  poly([20, 15, 18, 24, 15, 34, 13, 46, 17, 46, 18, 35, 20, 25, 21, 16], "m"),
  poly([16, 17, 12, 28, 8, 38, 6, 46, 9, 46, 11, 38, 14, 28], "m"),
  poly([0, 46, 3, 43, 10, 45, 20, 44, 28, 45, 29, 46], "m"),
  poly([27, 13, 29, 14, 30, 16, 32, 20, 34, 25, 37, 31, 40, 37, 43, 42, 46, 46, 29, 46, 28, 36, 27, 26, 26, 18, 26, 14], "d"),
  line(29, 17, 32, 27, "m"), line(32, 27, 34, 34, "m"), line(27, 22, 28, 31, "m"),
  line(4, 40, 8, 33, "C"), line(11, 27, 15, 18, "C"),
  // lèvre du cratère : la paroi du fond, dans l'ombre
  hline(19, 14, 8, "d"), hline(21, 15, 4, "k"),
]
const lavaFlow = (pts) => {
  const out = []
  for (let i = 0; i + 3 < pts.length; i += 2) out.push(line(pts[i], pts[i + 1], pts[i + 2], pts[i + 3], "r", 2))
  for (let i = 0; i + 3 < pts.length; i += 2) out.push(line(pts[i] - 1, pts[i + 1], pts[i + 2] - 1, pts[i + 3], "o"))
  return out
}
const LAVA = [
  hline(20, 14, 6, "o"), hline(21, 14, 3, "y"), px(22, 13, "Y"),
  ...lavaFlow([21, 15, 19, 22, 20, 28, 17, 36, 17, 45]),
  ...lavaFlow([25, 15, 27, 21, 27, 27, 29, 34]),
  px(19, 22, "y"), px(19, 30, "y"), px(17, 39, "y"),
]
// Panache : bouffées (x, y, r) éclairées en haut à gauche.
const puff = (x, y, r) => (c) => {
  c.circ(x, y, r, "m"); c.circ(x - 1, y - 1, r - 1, "c")
  if (r >= 2) c.circ(x - 1 - Math.floor(r / 3), y - 1 - Math.floor(r / 3), Math.max(1, r - 2), "C")
}
// Volcan endormi au sommet enneigé, et volcan en éruption (lave + fumée animées).
sprite("mountain_volcano_snow_48", { w: WV, h: HV, outline: "k" }, ...VOLCANO,
  clip((x, y) => y <= lineY(20, [[13, 4, 2], [18, 8, 2], [22, 10, 2], [26, 6, 2], [30, 7, 2], [34, 3, 2]])(x), recolor(SNOW)),
  hline(21, 15, 4, "S"), hline(19, 14, 8, "s"))
anim("mountain_volcano_active_48", { w: WV, h: HV, outline: "k", frames: 6, fps: 6 },
  ...VOLCANO, ...LAVA,
  recolor({ C: "c", c: "m", m: "d", d: "B" }),
  (c) => {
    // bouffées qui montent en grossissant, dérivent vers la droite puis se dissipent ;
    // les plus hautes d'abord pour que les plus jeunes passent devant
    const ts = [0, 1, 2, 3].map((i) => (c.phase + i / 4) % 1).sort((a, b) => b - a)
    for (const t of ts) {
      const r = Math.max(1, Math.round(1 + 3 * Math.sin(Math.PI * Math.min(1, t * 1.1))))
      puff(22 + Math.round(t * 13), 12 - Math.round(t * 12), r)(c)
    }
    // braises du cratère
    if (c.frame % 2) { c.px(21, 14, "o"); c.px(24, 14, "y"); c.px(20, 13, "o") } else { c.px(23, 14, "o"); c.px(22, 12, "o") }
  })

// ================================================================ mesa du désert (48 px)

// Plateau à sommet plat : falaise verticale striée de couches, éboulis en pente au pied.
// Grès : Y dessus éclairé, N face gauche, n façade, b couches et ombre, B face droite.
const WM = 46, HM = 30
const DARKER = { Y: "N", N: "n", n: "b", b: "B" }
const MESA = [
  poly([0, 30, 1, 27, 3, 24, 6, 20, 9, 17, 10, 16, 10, 11, 11, 10, 11, 6, 12, 4, 21, 4, 22, 3, 27, 3, 28, 4, 33, 4,
    34, 5, 34, 9, 35, 10, 35, 16, 36, 17, 39, 20, 42, 24, 45, 27, 46, 30], "n"),
  // couches de roche : bancs sombres et un banc clair, à peu près horizontaux
  recolor({ n: "b" }, [0, 8, WM, 1]), recolor({ n: "b" }, [0, 12, 22, 1]), recolor({ n: "b" }, [22, 13, WM, 1]),
  recolor({ n: "N" }, [0, 10, 25, 1]),
  // traînées d'érosion qui pendent sous les bancs (coins effilés vers le bas)
  poly([18, 8, 21, 8, 19, 12], "b"), poly([27, 9, 29, 9, 28, 13], "b"), poly([22, 4, 24, 4, 23, 7], "b"),
  poly([15, 13, 17, 13, 16, 16], "b"), poly([30, 14, 32, 14, 31, 17], "b"),
  // face gauche éclairée, face droite à l'ombre
  clip((x, y) => x <= 12 && y < 17, recolor({ n: "N", b: "n", N: "Y" })),
  clip((x, y) => x >= 32 && y < 18, recolor(DARKER)),
  clip((x, y) => x >= 34 && y < 18, recolor(DARKER)),
  // dessus plat, éclairé
  hline(12, 4, 10, "Y"), hline(22, 4, 11, "N"), hline(22, 3, 5, "N"),
  // éboulis : ombre de la falaise à son pied, ravines, gros blocs
  hline(10, 17, 26, "b"), hline(12, 18, 22, "b"),
  line(14, 19, 10, 26, "b"), line(23, 19, 22, 27, "b"), line(31, 19, 35, 26, "b"),
  clip((x, y) => y > 16 && x < 12 - (y - 17) * 0.2, recolor({ n: "N", b: "n" })),
  clip((x, y) => y > 16 && x > 36 - (y - 17) * 0.3, recolor(DARKER)),
  rect(17, 23, 2, 2, "n"), px(17, 23, "N"), hline(17, 25, 2, "b"), px(19, 24, "b"),
  rect(28, 25, 3, 2, "n"), hline(28, 25, 2, "N"), hline(28, 27, 3, "b"), px(31, 26, "b"),
  px(6, 26, "n"), px(7, 25, "N"),
]
sprite("mountain_mesa_48", { w: WM, h: HM, outline: "k" }, ...MESA)
sprite("mountain_mesa_red_48", { base: "mountain_mesa_48", swap: { Y: "y", N: "o", n: "r", b: "R", B: "B" } })

sheet("mountains", ["mountain_*"], { pad: 2 })
