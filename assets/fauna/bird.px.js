include("../_palette.px.js")

const meta = {
  title: "Oiseau",
  description: "Oiseaux en vol pour animer les ciels : silhouette lointaine sombre ou claire (8 px), vol de cinq oiseaux en V (32 px), et oiseaux proches vus de profil (16 px) : hirondelle, corbeau, mouette. Battements d'ailes animés en 4 images de 100 ms ; le moteur de scène les fait traverser le ciel. Silhouettes lointaines sans contour, oiseaux proches au contour sombre.",
  tags: ["bird", "flying", "sky", "wings", "flock", "ambient", "animated", "fauna"],
  variants: {
    far_8: { label: "Silhouette lointaine sombre", props: { species: "silhouette", distance: "far", group: "single" }, tags: ["particle"] },
    far_light_8: { label: "Silhouette lointaine claire", props: { species: "silhouette", distance: "far", group: "single" }, tags: ["particle", "gull"] },
    flock_32: { label: "Vol en V (5 oiseaux)", props: { species: "silhouette", distance: "far", group: "flock" }, tags: ["migration"] },
    swallow_16: { label: "Hirondelle", props: { species: "swallow", distance: "near", group: "single" }, tags: ["spring", "summer"] },
    crow_16: { label: "Corbeau", props: { species: "crow", distance: "near", group: "single" }, tags: ["dark", "spooky"] },
    gull_16: { label: "Mouette", props: { species: "gull", distance: "near", group: "single" }, tags: ["sea", "coast"] },
  },
}

// ================================================================ silhouettes lointaines (7 × 4)

// Ailes hautes, à plat, basses, à plat : le battement le plus lisible à cette taille.
const FAR = {
  up: ["d.....d", ".d...d.", "..d.d..", "...k..."],
  mid: [".......", "ddd.ddd", "...k...", "......."],
  down: ["...k...", "..d.d..", ".d...d.", "d.....d"],
}
const FLAP = ["up", "mid", "down", "mid"]
const drawFar = (x0, y0, pose, swap = {}) => (c) =>
  FAR[pose].forEach((row, y) => [...row].forEach((k, x) => { if (k !== ".") c.px(x0 + x, y0 + y, swap[k] ?? k) }))

const far = (name, swap) => anim(name, { w: 7, h: 4 }, ...FLAP.map((p) => frame({ ms: 100 }, drawFar(0, 0, p, swap))))
far("bird_far_8")
far("bird_far_light_8", { d: "s", k: "S" })

// Vol en V vers la droite : le meneur en tête, chaque oiseau décalé d'une image.
const V = [[24, 6, 0], [17, 3, 1], [10, 0, 2], [17, 9, 3], [10, 12, 1]]
anim("bird_flock_32", { w: 32, h: 16, frames: 4, fps: 10 }, (c) => {
  for (const [x, y, off] of V) drawFar(x, y, FLAP[(c.frame + off) % 4])(c)
})

// ================================================================ oiseaux proches (profil, tête à droite)

// Dessin commun en clés « de rôle », recolorées par espèce avec swap :
// m dos, c reflet du dos, d ombre, w ventre, s ombre du ventre, n aile, N bord éclairé de l'aile,
// B pointe des ailes, y bec, r gorge. L'œil reste en k.
const SPECIES = {
  swallow: { swap: { m: "U", c: "u", d: "U", w: "w", s: "s", n: "U", N: "u", B: "U", y: "d", r: "r" }, tail: "fork" },
  crow: { swap: { m: "d", c: "m", d: "d", w: "d", s: "d", n: "m", N: "c", B: "d", y: "c", r: "d" }, tail: "fan" },
  gull: { swap: { m: "s", c: "w", d: "S", w: "w", s: "s", n: "c", N: "C", B: "k", y: "y", r: "w" }, tail: "short" },
}
const TAIL = {
  fork: [poly([3, 7, 0, 5, 1, 5, 4, 7], "m"), poly([3, 9, 0, 11, 1, 11, 4, 9], "m"), poly([3, 7, 4, 7, 4, 9, 3, 9], "m")],
  fan: [poly([4, 7, 0, 6, 0, 10, 4, 9], "m"), px(0, 9, "d"), px(1, 9, "d")],
  short: [poly([4, 7, 1, 7, 1, 9, 4, 9], "m"), hline(1, 9, 3, "d")],
}
// Ailes larges : relevée, étendue vers l'arrière (planée), abaissée. Bord d'attaque éclairé (N),
// pointe des rémiges (B).
const WING = {
  up: [poly([5, 7, 1, 2, 0, 0, 2, 0, 6, 2, 9, 6], "n"), line(2, 0, 8, 5, "N"), line(0, 0, 1, 2, "B")],
  mid: [poly([8, 6, 4, 3, 0, 2, 1, 4, 3, 6, 6, 7], "n"), line(0, 2, 7, 5, "N"), line(0, 2, 1, 4, "B")],
  down: [poly([5, 9, 1, 12, 3, 13, 9, 9], "n"), line(8, 9, 3, 12, "N"), line(1, 12, 3, 13, "B")],
}
const birdItems = (tail, pose) => {
  const body = [
    ...TAIL[tail],
    ellipse(6, 8, 3, 2, "m"), hline(4, 6, 4, "c"),
    hline(4, 9, 5, "w"), hline(5, 10, 4, "s"),
    circ(10, 6, 2, "m"), px(9, 5, "c"), px(10, 4, "c"), px(10, 8, "r"), px(11, 8, "r"),
    px(11, 5, "k"), px(13, 6, "y"), px(13, 7, "y"),
  ]
  return pose === "down" ? [...body, ...WING.down] : [...WING[pose], ...body]
}
const FLAP_NEAR = [["up", 1], ["mid", 1], ["down", 0], ["mid", 1]]
const near = (name, species) => {
  const { swap, tail } = SPECIES[species]
  for (const pose of ["up", "mid", "down"])
    sprite(`_${name}_${pose}`, { w: 14, h: 14, outline: "k", swap }, ...birdItems(tail, pose))
  // le corps remonte d'un pixel quand l'aile pousse vers le bas
  anim(name, { w: 16, h: 16 }, ...FLAP_NEAR.map(([p, dy]) => frame({ ms: 100 }, stamp(`_${name}_${p}`, 0, dy))))
}

near("bird_swallow_16", "swallow")
near("bird_crow_16", "crow")
near("bird_gull_16", "gull")

sheet("birds", ["bird_*"], { pad: 2 })
