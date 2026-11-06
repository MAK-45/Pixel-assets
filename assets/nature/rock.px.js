include("../_palette.px.js")

const meta = {
  title: "Rocher",
  description: "Pierres et rochers pour décors : petit caillou, tas de galets, gros rocher à facettes, en versions nue, moussue, enneigée et grès du désert.",
  tags: ["rock", "stone", "boulder", "nature", "decoration", "obstacle"],
  variants: {
    small_16: { label: "Caillou", props: { form: "stone", surface: "bare", material: "granite" } },
    small_mossy_16: { label: "Caillou moussu", props: { form: "stone", surface: "mossy", material: "granite" } },
    pebbles_16: { label: "Tas de galets", props: { form: "pebbles", surface: "bare", material: "granite" } },
    boulder_32: { label: "Gros rocher", props: { form: "boulder", surface: "bare", material: "granite" } },
    boulder_mossy_32: { label: "Gros rocher moussu", props: { form: "boulder", surface: "mossy", material: "granite" } },
    boulder_snow_32: { label: "Gros rocher enneigé", props: { form: "boulder", surface: "snow", material: "granite" }, tags: ["snow", "winter"] },
    boulder_sand_32: { label: "Rocher de grès (désert)", props: { form: "boulder", surface: "bare", material: "sandstone" }, tags: ["desert"] },
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

sheet("rocks", ["rock_*"], { pad: 2 })
