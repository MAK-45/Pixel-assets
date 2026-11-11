include("../_palette.px.js")

const meta = {
  title: "Luciole",
  description: "Lucioles pour les nuits d'été : petite lueur clignotante à l'échelle d'une scène (8 px) en jaune-vert, ambre ou bleu féerique, essaim de cinq lueurs désynchronisées (16 px), et luciole en vol vue de profil (16 px) dont l'abdomen s'allume, en jaune-vert ou bleu. Toutes animées. Les lueurs n'ont pas de contour (ce sont des lumières) ; l'insecte a le contour sombre de la maison.",
  tags: ["firefly", "insect", "bug", "glow", "night", "light", "summer", "ambient", "animated", "fauna"],
  variants: {
    glow_8: { label: "Lueur jaune-vert (scène)", props: { form: "glow", color: "yellow" }, tags: ["particle"] },
    glow_amber_8: { label: "Lueur ambre (scène)", props: { form: "glow", color: "amber" }, tags: ["particle", "warm"] },
    glow_blue_8: { label: "Lueur bleue féerique (scène)", props: { form: "glow", color: "blue" }, tags: ["particle", "magic", "fantasy"] },
    swarm_16: { label: "Essaim de lucioles", props: { form: "swarm", color: "yellow" }, tags: ["group"] },
    bug_16: { label: "Luciole en vol (16 px)", props: { form: "insect", color: "yellow" }, tags: ["icon"] },
    bug_blue_16: { label: "Luciole bleue en vol (16 px)", props: { form: "insect", color: "blue" }, tags: ["icon", "magic"] },
  },
}

// ================================================================ lueur

// Couleurs d'une lueur : [cœur, bras, halo]. Le halo sert aussi de lueur « éteinte ».
const GLOW = { yellow: ["Y", "L", "l"], amber: ["Y", "y", "o"], blue: ["w", "I", "i"] }

// Lueur centrée en (cx, cy), du niveau 0 (presque éteinte) au niveau 3 (pic : losange de 5 px).
const glowAt = (cx, cy, level, [core, arm, halo]) => (c) => {
  if (level <= 0) return c.px(cx, cy, halo)
  if (level === 1) return c.px(cx, cy, arm)
  c.px(cx, cy, core)
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) c.px(cx + dx, cy + dy, arm)
  if (level >= 3) for (const [dx, dy] of [[1, 1], [-1, 1], [1, -1], [-1, -1], [2, 0], [-2, 0], [0, 2], [0, -2]]) c.px(cx + dx, cy + dy, halo)
}

// Un clignotement : longue veille, montée rapide, pic, extinction (1,2 s).
const BLINK = [[0, 600], [1, 100], [2, 100], [3, 200], [2, 100], [1, 100]]
const glow = (name, colors) => anim(name, { w: 5, h: 5 },
  ...BLINK.map(([level, ms]) => frame({ ms }, glowAt(2, 2, level, colors))))

glow("firefly_glow_8", GLOW.yellow)
glow("firefly_glow_amber_8", GLOW.amber)
glow("firefly_glow_blue_8", GLOW.blue)

// ================================================================ essaim

// Cinq lueurs qui dérivent d'un pixel et clignotent chacune à son rythme (boucle de 1,2 s).
const SCHED = [0, 0, 0, 0, 0, 0, 1, 2, 3, 3, 2, 1]
const SWARM = [[4, 4, 0], [11, 3, 7], [8, 9, 3], [13, 11, 10], [4, 12, 5]]
anim("firefly_swarm_16", { w: 16, h: 16, frames: 12, fps: 10 }, (c) => {
  SWARM.forEach(([x, y, off], i) => {
    const dy = Math.round(Math.sin((c.phase + i / 5) * Math.PI * 2))
    glowAt(x, y + dy, SCHED[(c.frame + off) % 12], GLOW.yellow)(c)
  })
})

// ================================================================ insecte en vol (profil, tête à droite)

// Corps : élytres brun sombre (lisière éclairée en haut, liseré pâle sur le flanc), bouclier
// orangé sur la tête, tête sombre. Ailes membraneuses claires en trois positions.
const BODY = [
  ellipse(8, 8, 4, 2, "B"),
  hline(6, 6, 5, "b"), px(5, 7, "b"),
  hline(5, 9, 6, "n"), px(11, 9, "b"),
  ellipse(12, 7, 1, 1, "r"), px(11, 6, "o"), px(12, 6, "o"), px(11, 7, "o"),
  rect(12, 9, 2, 1, "d"), px(13, 8, "d"),
]
// Ailes membraneuses (s) nervurées (C), larges comme des feuilles.
const WINGS = {
  up: [poly([6, 7, 2, 2, 3, 0, 6, 0, 10, 5, 10, 7], "s"), line(9, 6, 4, 1, "C")],
  mid: [poly([10, 7, 2, 3, 0, 4, 0, 6, 2, 7, 10, 8], "s"), line(9, 7, 2, 5, "C")],
  down: [poly([7, 9, 5, 13, 8, 13, 11, 9], "s"), line(9, 10, 7, 12, "C")],
}
for (const [k, wing] of Object.entries(WINGS))
  sprite(`_ffb_${k}`, { w: 14, h: 14, outline: "k" }, ...(k === "down" ? [...BODY, ...wing] : [...wing, ...BODY]))

// Lanterne au bout de l'abdomen (derrière les élytres), peinte après le contour pour que la
// lumière déborde : allumée (cœur, bord, halo sur le vide) ou en veille (segments pâles).
const LANTERN = [[4, 10], [5, 10], [3, 11], [4, 11], [5, 11], [4, 12]]
const lantern = (on, [core, arm, halo]) => (c) => {
  for (const [x, y] of LANTERN) c.px(x, y, !on ? "N" : x === 4 && y === 11 ? core : arm)
  if (!on) return
  c.px(4, 11, core); c.px(5, 11, core)
  for (const [x, y] of [[2, 11], [3, 10], [3, 12], [4, 13], [5, 12], [2, 10], [2, 12], [3, 13]])
    if (c.is(x, y, ".k")) c.px(x, y, Math.abs(x - 4) + Math.abs(y - 11) <= 1 ? arm : halo)
  for (const [x, y] of [[1, 11], [2, 13], [1, 10], [1, 12]])
    if (c.is(x, y, ".")) c.px(x, y, halo)
}
// Pattes et antenne fines (après le contour pour rester à 1 px).
const LEGS = [px(8, 12, "k"), px(7, 13, "k"), px(11, 12, "k"), px(11, 13, "k"), px(14, 8, "k"), px(15, 7, "k")]
const FLAP = ["up", "mid", "down", "mid"]
const bug = (name, colors) => anim(name, { w: 16, h: 16 },
  ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => frame({ ms: 100 }, stamp(`_ffb_${FLAP[i % 4]}`, 0, 1), ...LEGS, lantern(i < 4, colors))))

bug("firefly_bug_16", GLOW.yellow)
bug("firefly_bug_blue_16", GLOW.blue)

sheet("fireflys", ["firefly_*"], { pad: 2 })
