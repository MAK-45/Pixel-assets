include("../_palette.px.js")

const meta = {
  title: "Rocher",
  description: "Pierres et rochers pour décors, vus de face : petit caillou, tas de galets, gros rocher à facettes, cairn de pierres empilées (16, 32 px), aiguille rocheuse, escarpement de blocs (48 px) et arche naturelle (48 px), en versions nue, moussue, enneigée, grès du désert. Lumière en haut à gauche, contour sombre.",
  tags: ["rock", "stone", "boulder", "nature", "decoration", "obstacle", "cliff", "terrain"],
  variants: {
    small_16: { label: "Caillou", props: { form: "stone", surface: "bare", material: "granite" } },
    small_mossy_16: { label: "Caillou moussu", props: { form: "stone", surface: "mossy", material: "granite" } },
    pebbles_16: { label: "Tas de galets", props: { form: "pebbles", surface: "bare", material: "granite" } },
    boulder_32: { label: "Gros rocher", props: { form: "boulder", surface: "bare", material: "granite" } },
    boulder_mossy_32: { label: "Gros rocher moussu", props: { form: "boulder", surface: "mossy", material: "granite" } },
    boulder_snow_32: { label: "Gros rocher enneigé", props: { form: "boulder", surface: "snow", material: "granite" }, tags: ["snow", "winter"] },
    boulder_sand_32: { label: "Rocher de grès (désert)", props: { form: "boulder", surface: "bare", material: "sandstone" }, tags: ["desert"] },
    cairn_16: { label: "Cairn (16 px)", props: { form: "cairn", surface: "bare", material: "granite" }, tags: ["cairn", "stack", "landmark", "trail"] },
    cairn_32: { label: "Grand cairn moussu à la base", props: { form: "cairn", surface: "mossy", material: "granite" }, tags: ["cairn", "stack", "landmark", "trail"] },
    spire_32: { label: "Aiguille rocheuse", props: { form: "spire", surface: "bare", material: "granite" }, tags: ["spire", "pillar", "needle"] },
    spire_sand_32: { label: "Aiguille de grès (désert)", props: { form: "spire", surface: "bare", material: "sandstone" }, tags: ["spire", "pillar", "desert", "hoodoo"] },
    crag_48: { label: "Escarpement de blocs (48 px)", props: { form: "crag", surface: "bare", material: "granite" }, tags: ["crag", "cliff", "outcrop"] },
    crag_mossy_48: { label: "Escarpement moussu (48 px)", props: { form: "crag", surface: "mossy", material: "granite" }, tags: ["crag", "cliff", "outcrop", "moss"] },
    crag_snow_48: { label: "Escarpement enneigé (48 px)", props: { form: "crag", surface: "snow", material: "granite" }, tags: ["crag", "cliff", "snow", "winter"] },
    arch_48: { label: "Arche naturelle (48 px)", props: { form: "arch", surface: "bare", material: "granite" }, tags: ["arch", "landmark"] },
    arch_sand_48: { label: "Arche de grès du désert (48 px)", props: { form: "arch", surface: "bare", material: "sandstone" }, tags: ["arch", "landmark", "desert", "canyon"] },
  },
}

// Pierre : d sombre (faces à l'ombre), m corps, c faces éclairées, C arêtes en pleine lumière.
const SANDSTONE = { d: "B", m: "b", c: "n", C: "N" }

sprite("_moss_a", `
  .l.
  lgl`)
sprite("_moss_b", `
  ll
  gg`)
sprite("_moss_c", "l")

// ---------------------------------------------------------------- petits (16 px)
const STONE16 = [
  poly([1, 10, 0, 6, 3, 2, 8, 1, 12, 3, 14, 7, 13, 10], "m"),
  poly([1, 6, 3, 2, 8, 1, 9, 3, 6, 5, 2, 7], "c"),
  poly([12, 3, 14, 7, 13, 10, 9, 10, 10, 6], "d"),
  hline(4, 2, 3, "C"), px(3, 3, "C"),
  line(7, 6, 9, 8, "d"),  // fissure
]
sprite("rock_small_16", { w: 14, h: 10, outline: "k" }, ...STONE16)
sprite("rock_small_mossy_16", { w: 14, h: 10, outline: "k" }, ...STONE16,
  scatter("_moss_*", 1, 0, 11, 5, 5, { on: "cC", clip: true, seed: 2 }))

sprite("_pebble", { w: 6, h: 4 },
  poly([0, 4, 0, 2, 2, 0, 5, 0, 6, 2, 6, 4], "m"), hline(2, 0, 3, "c"), px(1, 1, "c"), px(1, 2, "C"),
  vline(5, 2, 2, "d"))
sprite("rock_pebbles_16", { w: 14, h: 9, outline: "k" },
  stamp("_pebble", 0, 5), stamp("_pebble", 7, 4, { flip: "x" }), stamp("_pebble", 3, 1),
  stamp("_pebble", 9, 0, { swap: { m: "c", c: "C" } }))

// ---------------------------------------------------------------- gros rocher (32 px)
const BOULDER = [
  poly([3, 22, 0, 15, 3, 8, 9, 3, 17, 1, 24, 4, 28, 11, 29, 18, 27, 22], "m"),
  // faces du haut (éclairées)
  poly([3, 8, 9, 3, 17, 1, 21, 4, 15, 8, 8, 10, 2, 12], "c"),
  poly([17, 1, 24, 4, 26, 8, 21, 7, 21, 4], "c"),
  line(5, 7, 9, 4, "C"), line(10, 3, 16, 2, "C"), px(22, 4, "C"),
  // face droite (ombre)
  poly([24, 4, 28, 11, 29, 18, 27, 22, 21, 22, 24, 14, 26, 8], "d"),
  // arêtes et fissures
  line(15, 8, 13, 14, "d"), line(13, 14, 15, 19, "d"), line(8, 10, 6, 16, "d"),
  line(21, 7, 22, 12, "m"),
  hline(4, 21, 18, "d"), // ombre au sol
]
sprite("rock_boulder_32", { w: 30, h: 23, outline: "k" }, ...BOULDER)
sprite("rock_boulder_mossy_32", { w: 30, h: 23, outline: "k" }, ...BOULDER,
  scatter("_moss_*", 2, 0, 24, 11, 22, { on: "cC", clip: true, rflip: "x", seed: 5 }),
  scatter("_moss_*", 1, 12, 8, 8, 3, { on: "m", clip: true, seed: 6 }))
sprite("rock_boulder_snow_32", { w: 30, h: 23, outline: "k" }, ...BOULDER,
  recolor({ c: "s", C: "w" }, (x, y) => y < 9),
  recolor({ c: "s" }, (x, y) => y < 11 && x < 12),
  (c) => { for (let x = 0; x < 24; x++) for (let y = 0; y < c.h; y++) if (c.is(x, y, "mdc") && c.is(x, y - 1, ".")) { c.px(x, y, "w"); break } })
sprite("rock_boulder_sand_32", { base: "rock_boulder_32", swap: SANDSTONE })

// ---------------------------------------------------------------- cairn (pierres empilées)
// Galet plat : dessus éclairé (c, reflet C), corps m, dessous et flanc droit dans l'ombre (d).
const slab = (x, y, w, h) => (c) => {
  for (let j = 0; j < h; j++)
    for (let i = 0; i < w; i++) {
      const corner = (i === 0 || i === w - 1) && (j === 0 || j === h - 1)
      if (corner) continue
      const col = j === h - 1 || i === w - 1 || (i >= w - 3 && j >= h - 2) ? "d" : j === 0 || i === 0 ? "c" : "m"
      c.px(x + i, y + j, col)
    }
  c.hline(x + 1, y, Math.max(1, Math.round(w * 0.35)), "C")
}
sprite("rock_cairn_16", { w: 12, h: 13, outline: "k" },
  slab(0, 9, 12, 4), slab(2, 6, 9, 3), slab(2, 3, 7, 3), slab(4, 0, 4, 3))
sprite("rock_cairn_32", { w: 20, h: 26, outline: "k" },
  slab(0, 20, 20, 6), slab(2, 15, 16, 5), slab(1, 11, 14, 4), slab(4, 7, 11, 4), slab(5, 3, 8, 4), slab(7, 0, 4, 3),
  scatter("_moss_*", 0, 18, 12, 6, 4, { on: "cm", clip: true, seed: 3 }))

// ---------------------------------------------------------------- aiguille rocheuse (32 px)
// Colonne effilée : face gauche éclairée, flanc droit à l'ombre, corniches horizontales.
const SPIRE = [
  poly([0, 30, 1, 26, 2, 22, 2, 18, 3, 14, 3, 10, 4, 6, 5, 3, 6, 1, 8, 0, 9, 1, 10, 4, 10, 8, 11, 12, 11, 17, 12, 21, 13, 25, 14, 30], "m"),
  poly([0, 30, 1, 26, 2, 22, 2, 18, 3, 14, 3, 10, 4, 6, 5, 3, 6, 1, 8, 0, 7, 3, 6, 8, 5, 14, 5, 20, 4, 26, 4, 30], "c"),
  poly([9, 1, 10, 4, 10, 8, 11, 12, 11, 17, 12, 21, 13, 25, 14, 30, 10, 30, 10, 24, 9, 18, 9, 10, 8, 4], "d"),
  // corniches : arête claire au-dessus, ombre portée en dessous
  hline(3, 9, 7, "d"), hline(3, 8, 3, "C"), hline(2, 16, 9, "d"), hline(2, 15, 3, "C"), hline(1, 23, 11, "d"), hline(1, 22, 3, "C"),
  line(6, 1, 4, 6, "C"), vline(7, 10, 4, "d"), vline(6, 18, 3, "d"),
]
sprite("rock_spire_32", { w: 14, h: 30, outline: "k" }, ...SPIRE)
sprite("rock_spire_sand_32", { base: "rock_spire_32", swap: SANDSTONE })

// ---------------------------------------------------------------- escarpement (48 px)
// Amas de blocs anguleux : un grand bloc au fond, deux plus bas devant, éboulis au pied.
// Chaque bloc : dessus éclairé (C/c), face avant m, face droite d.
const CRAG = [
  // bloc du fond
  poly([14, 30, 14, 6, 17, 2, 23, 0, 28, 1, 31, 5, 32, 30], "m"),
  poly([14, 6, 17, 2, 23, 0, 28, 1, 24, 4, 18, 6, 16, 12, 14, 14], "c"), line(16, 3, 22, 1, "C"),
  poly([28, 1, 31, 5, 32, 30, 27, 30, 27, 12, 26, 4], "d"),
  line(20, 9, 21, 18, "d"), line(21, 18, 19, 24, "d"),
  // bloc de gauche
  poly([1, 30, 2, 19, 6, 13, 12, 11, 16, 14, 17, 30], "m"),
  poly([2, 19, 6, 13, 12, 11, 16, 14, 11, 16, 6, 17, 3, 22], "c"), line(4, 16, 7, 13, "C"), line(8, 12, 11, 12, "C"),
  poly([16, 14, 17, 30, 13, 30, 13, 20, 12, 16], "d"),
  line(7, 20, 8, 26, "d"),
  // bloc de droite
  poly([29, 30, 30, 14, 34, 10, 40, 11, 44, 16, 46, 30], "m"),
  poly([30, 14, 34, 10, 40, 11, 44, 16, 39, 15, 34, 16, 31, 19], "c"), line(32, 12, 35, 10, "C"), line(36, 10, 39, 11, "C"),
  poly([44, 16, 46, 30, 41, 30, 41, 21, 40, 15], "d"),
  line(35, 19, 36, 26, "d"),
  // éboulis
  rect(0, 27, 3, 3, "m"), px(0, 27, "c"), hline(0, 29, 3, "d"),
  rect(43, 28, 3, 2, "m"), px(43, 28, "c"),
  hline(1, 29, 45, "d"),
]
sprite("rock_crag_48", { w: 46, h: 30, outline: "k" }, ...CRAG)
sprite("rock_crag_mossy_48", { w: 46, h: 30, outline: "k" }, ...CRAG,
  scatter("_moss_*", 0, 0, 46, 20, 26, { on: "cC", clip: true, rflip: "x", seed: 8 }),
  scatter("_moss_*", 0, 22, 46, 8, 10, { on: "md", clip: true, seed: 9 }))
sprite("rock_crag_snow_48", { w: 46, h: 30, outline: "k" }, ...CRAG,
  recolor({ c: "s", C: "w" }),
  (c) => { for (let x = 0; x < c.w; x++) for (let y = 0; y < c.h; y++) if (c.is(x, y, "mdsw")) { if (c.is(x, y, "md")) c.px(x, y, x < 28 ? "w" : "s"); break } })

// ---------------------------------------------------------------- arche naturelle (48 px)
// Deux piliers reliés par un pont de roche ; dans l'ouverture, la paroi de gauche et le dessous
// du pont sont à l'ombre, la paroi de droite (tournée vers la lumière) est éclairée.
const ARCH = [
  poly([0, 30, 2, 24, 3, 16, 4, 10, 7, 5, 12, 2, 20, 1, 28, 1, 35, 3, 40, 7, 42, 12, 43, 20, 44, 26, 46, 30], "m"),
  // dessus et flanc gauche éclairés
  poly([0, 30, 2, 24, 3, 16, 4, 10, 7, 5, 12, 2, 20, 1, 28, 1, 30, 3, 22, 4, 13, 5, 9, 8, 7, 13, 6, 20, 5, 26, 4, 30], "c"),
  line(5, 8, 11, 3, "C"), line(13, 2, 24, 2, "C"),
  // flanc droit à l'ombre
  poly([35, 3, 40, 7, 42, 12, 43, 20, 44, 26, 46, 30, 41, 30, 40, 22, 39, 14, 37, 8], "d"),
  // ouverture : ombre sous le pont et sur la paroi gauche, lumière sur la paroi droite
  ellipse(23, 30, 14, 19, "d"),
  ellipse(26, 32, 12, 17, "c"),
  ellipse(23, 31, 11, 17, "_"),
  // couches de roche (fissures horizontales) sur les piliers et le pont
  line(7, 19, 10, 19, "m"), line(5, 25, 8, 25, "m"), line(30, 6, 34, 8, "d"),
  hline(37, 17, 2, "d"), hline(36, 24, 3, "d"), px(38, 13, "c"),
]
sprite("rock_arch_48", { w: 46, h: 30, outline: "k" }, ...ARCH)
sprite("rock_arch_sand_48", { base: "rock_arch_48", swap: SANDSTONE })

sheet("rocks", ["rock_*"], { pad: 2 })
