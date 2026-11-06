include("../_palette.px.js")

const meta = {
  title: "Champignon",
  description: "Champignons poussant au sol, vus de face : amanite tue-mouches rouge à points blancs, cèpe brun, girolle orangée, touffe de petits champignons beiges, champignon magique bleu lumineux et violet (16 px), grande amanite (32 px). Lumière en haut à gauche, contour sombre.",
  tags: ["mushroom", "fungus", "toadstool", "plant", "ground", "forest", "undergrowth", "nature", "decoration"],
  variants: {
    amanita_16: { label: "Amanite tue-mouches", props: { species: "amanita", color: "red" }, tags: ["poison"] },
    bolete_16: { label: "Cèpe", props: { species: "bolete", color: "brown" }, tags: ["edible"] },
    chanterelle_16: { label: "Girolles", props: { species: "chanterelle", color: "orange" }, tags: ["edible"] },
    cluster_16: { label: "Touffe de petits champignons", props: { species: "cluster", color: "tan" } },
    magic_blue_16: { label: "Champignon magique bleu (lumineux)", props: { species: "magic", color: "blue" }, tags: ["magic", "glow", "fantasy"] },
    magic_purple_16: { label: "Champignon magique violet (lumineux)", props: { species: "magic", color: "purple" }, tags: ["magic", "glow", "fantasy"] },
    amanita_32: { label: "Grande amanite (32 px)", props: { species: "amanita", color: "red" }, tags: ["poison"] },
  },
}

// Un champignon : chapeau en demi-ellipse (cx, capY = bas du chapeau, rx, ry), pied de `stemW`
// jusqu'au sol. Couleurs : cap = [ombre, corps, clair, reflet], stem = [ombre, corps, clair],
// gill = dessous du chapeau.
const RED_CAP = ["R", "r", "o", "y"]
const STEM = ["S", "s", "w"]
const shroom = (cx, ground, capY, rx, ry, stemW, cap = RED_CAP, stem = STEM, gill = "S") => (c) => {
  // pied légèrement évasé à la base, éclairé à gauche
  const sx = cx - (stemW >> 1)
  c.rect(sx, capY, stemW, ground - capY + 1, stem[1])
  c.hline(sx - 1, ground, stemW + 2, stem[1])
  c.vline(sx + stemW - 1, capY, ground - capY + 1, stem[0]); c.px(sx + stemW, ground, stem[0])
  if (stemW >= 3) c.vline(sx, capY + 1, ground - capY - 1, stem[2])
  // chapeau
  for (let y = capY - ry; y <= capY; y++)
    for (let x = cx - rx; x <= cx + rx; x++) {
      const dx = (x - cx) / (rx + 0.5), dy = (y - capY) / (ry + 0.5)
      if (dx * dx + dy * dy > 1) continue
      // lumière en haut à gauche : du reflet vers l'ombre selon la position
      const lgt = -dx * 0.6 - dy * 0.9
      c.px(x, y, lgt > 1.05 ? cap[3] : lgt > 0.72 ? cap[2] : lgt > -0.3 ? cap[1] : cap[0])
    }
  // bord inférieur du chapeau
  c.hline(cx - rx + 1, capY, rx * 2 - 1, gill)
  c.hline(cx + 1, capY, rx - 1, cap[0])
}

// ================================================================ 16 px

sprite("mushroom_amanita_16", { w: 14, h: 13, outline: "k" },
  shroom(7, 12, 6, 6, 5, 3),
  // points blancs, plus petits et ombrés à droite
  px(4, 3, "w"), px(5, 3, "w"), px(4, 4, "s"), px(8, 2, "w"), px(7, 1, "w"), px(10, 4, "s"), px(6, 5, "w"), px(2, 5, "w"),
  // anneau sous le chapeau
  hline(6, 8, 3, "w"), px(8, 8, "s"),
  hline(4, 12, 7, "G"), px(3, 12, "g"),
)

const BROWN_CAP = ["B", "b", "n", "N"]
const PALE_STEM = ["n", "N", "Y"]
sprite("mushroom_bolete_16", { w: 14, h: 13, outline: "k" },
  // pied ventru
  shroom(7, 12, 6, 6, 4, 5, BROWN_CAP, PALE_STEM, "y"),
  px(4, 10, "N"), px(10, 10, "n"), hline(4, 12, 7, "N"), px(10, 12, "n"),
  hline(3, 12, 1, "G"), hline(11, 12, 2, "G"),
)

// Girolles : chapeaux en entonnoir, ondulés, tout en orangé.
sprite("_chanterelle", `
  y.yyy.
  yyyyyo
  .oyyo.
  ..yo..
  ..yo..
  ..yo..`)
sprite("mushroom_chanterelle_16", { w: 14, h: 10, outline: "k" },
  stamp("_chanterelle", 0, 0),
  stamp("_chanterelle", 7, 3, { swap: { y: "o", o: "r" } }),
  px(1, 0, "Y"), px(0, 1, "Y"),
  // petit bouton qui pointe
  px(13, 7, "o"), px(13, 8, "r"),
  hline(1, 9, 12, "G"), px(0, 9, "g"), px(13, 9, "G"),
)

// Touffe de petits champignons beiges (mycènes), tailles variées.
const TAN_CAP = ["b", "n", "N", "Y"]
sprite("mushroom_cluster_16", { w: 14, h: 12, outline: "k" },
  shroom(10, 11, 5, 3, 2, 1, TAN_CAP, PALE_STEM, "n"),
  shroom(3, 11, 6, 3, 2, 1, TAN_CAP, PALE_STEM, "n"),
  shroom(6, 11, 3, 3, 3, 2, TAN_CAP, PALE_STEM, "n"),
  shroom(12, 11, 9, 1, 1, 1, TAN_CAP, PALE_STEM, "n"),
  hline(1, 11, 12, "G"),
)

// Champignon magique : chapeau lumineux à points clairs, halo dans la palette.
const BLUE_CAP = ["U", "u", "i", "I"]
const MAGIC = [
  shroom(7, 12, 7, 5, 6, 3, BLUE_CAP, ["S", "s", "w"], "I"),
  px(5, 3, "w"), px(8, 2, "I"), px(9, 5, "I"), px(4, 6, "I"),
  hline(4, 12, 7, "G"),
]
sprite("mushroom_magic_blue_16", { w: 14, h: 13, outline: "k" }, ...MAGIC,
  glow("I", { r: 2, ramp: 1 }))
sprite("mushroom_magic_purple_16", { w: 14, h: 13, outline: "k" }, ...MAGIC,
  recolor({ U: "V", u: "v", i: "x", I: "Z" }),
  glow("Z", { r: 2, ramp: 1 }))

// ================================================================ 32 px

sprite("mushroom_amanita_32", { w: 26, h: 30, outline: "k" },
  shroom(13, 29, 16, 12, 13, 7),
  // volve à la base et anneau
  hline(9, 28, 9, "s"), hline(8, 29, 11, "s"), px(17, 28, "S"), px(18, 29, "S"),
  hline(9, 19, 9, "w"), hline(9, 20, 9, "s"), px(17, 19, "s"), px(17, 20, "S"),
  // points blancs : gros en haut à gauche, petits et ombrés vers la droite
  rect(6, 8, 3, 2, "w"), px(8, 9, "s"),
  rect(12, 5, 3, 2, "w"), px(14, 6, "s"),
  rect(3, 13, 2, 2, "w"),
  rect(18, 9, 2, 2, "s"),
  rect(10, 11, 2, 2, "w"),
  px(21, 13, "s"), px(15, 13, "w"), px(16, 13, "s"), px(8, 14, "w"), px(17, 4, "w"),
  hline(5, 29, 3, "G"), hline(19, 29, 3, "G"), px(4, 29, "g"),
)

sheet("mushrooms", ["mushroom_*"], { pad: 2 })
