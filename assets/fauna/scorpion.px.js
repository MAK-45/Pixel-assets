include("../_palette.px.js")

const meta = {
  title: "Scorpion",
  description: "Scorpions du désert vus de profil (tête à droite), queue recourbée au-dessus du dos : petit scorpion (16 px) jaune des sables, noir ou rouge, petit scorpion qui marche (animé, 4 images de 100 ms), grand scorpion détaillé (32 px) jaune ou noir, et grand scorpion qui marche en agitant son dard. Lumière en haut à gauche, contour sombre.",
  tags: ["scorpion", "desert", "arachnid", "critter", "enemy", "venom", "sand", "fauna"],
  variants: {
    sand_16: { label: "Scorpion des sables (16 px)", props: { color: "sand", state: "idle" } },
    black_16: { label: "Scorpion noir (16 px)", props: { color: "black", state: "idle" } },
    red_16: { label: "Scorpion rouge (16 px)", props: { color: "red", state: "idle" } },
    sand_walk_16: { label: "Scorpion des sables qui marche (16 px, animé)", props: { color: "sand", state: "walk" }, tags: ["animated"] },
    sand_32: { label: "Grand scorpion des sables", props: { color: "sand", state: "idle" } },
    black_32: { label: "Grand scorpion noir", props: { color: "black", state: "idle" } },
    sand_walk_32: { label: "Grand scorpion qui marche (animé)", props: { color: "sand", state: "walk" }, tags: ["animated"] },
  },
}

// Dessin en teintes sable (N reflet, n corps, b ombre, B pattes et dard) ; recolorations par swap.
const BLACK = { Y: "C", N: "c", n: "m", b: "d", B: "d" }
const RED = { N: "o", n: "r", b: "R", B: "B" }

// ---------------------------------------------------------------- 16 px
const BODY16 = `
  ...NNnn.......
  ..N....n......
  ..n....bB.....
  ..n...........
  ..nb..........
  ...nNNNnnn.Nn.
  ...nnnnnnbNnnB
  ....bbbbbb.bn.`
const LEGS16 = [
  ["....B.B.B.B...", "...B.B.B.B...."],
  [".....B.B.B.B..", "....B.B.B.B..."],
]
sprite("scorpion_sand_16", { w: 14, h: 10, outline: "k" }, BODY16, grid(0, 8, LEGS16[0].join("\n")), px(9, 5, "k"))
sprite("scorpion_black_16", { base: "scorpion_sand_16", swap: BLACK })
sprite("scorpion_red_16", { base: "scorpion_sand_16", swap: RED })
anim("scorpion_sand_walk_16", { w: 14, h: 10, outline: "k", fps: 10 }, BODY16, px(9, 5, "k"),
  frame(grid(0, 8, LEGS16[0].join("\n"))),
  frame(grid(0, 8, LEGS16[1].join("\n")), grid(7, 2, "_b\n.B")),
  frame(grid(0, 8, LEGS16[0].join("\n"))),
  frame(grid(0, 8, LEGS16[1].join("\n")), grid(4, 0, "_"), grid(7, 1, "nb")),
)

// ---------------------------------------------------------------- 32 px
// Corps en plaques rondes, céphalothorax à droite, pinces devant, queue en arc de cercle
// qui passe au-dessus du dos et finit par le dard pointé vers l'avant.
const TAIL = [[6, 18], [3, 15], [3, 11], [4, 7], [7, 4], [11, 3], [14, 5], [15, 8]]
const big = (step = 0) => (c) => {
  // pattes (derrière le corps) : 4 paires, alternées selon le pas
  for (let i = 0; i < 4; i++) {
    const x = 9 + i * 4, off = (i + step) % 2 ? 1 : -1
    c.line(x, 21, x + off, 24, "B"); c.line(x + off, 24, x + off - 1, 27, "B")
  }
  // abdomen ovale en anneaux, céphalothorax à droite
  c.ellipse(13, 20, 9, 3, "n")
  c.ellipse(22, 19, 4, 3, "n")
  c.hline(6, 17, 15, "N"); c.hline(19, 16, 5, "N"); c.hline(5, 18, 4, "N")
  for (let x = 7; x <= 19; x += 3) { c.vline(x, 18, 4, "b"); c.px(x + 1, 17, "Y") }
  c.hline(5, 22, 18, "b"); c.hline(8, 23, 12, "B"); c.hline(20, 21, 5, "b")
  c.px(24, 17, "k") // œil
  // pince : bras puis main renflée et doigts ouverts
  c.line(24, 20, 25, 15, "n", 2); c.px(24, 18, "N")
  c.ellipse(26, 13, 2, 2, "n"); c.px(25, 12, "N"); c.px(26, 11, "N"); c.px(27, 14, "b"); c.px(26, 15, "b")
  c.hline(27, 11, 3, "n"); c.px(29, 10, "N")      // doigt du haut
  c.hline(28, 14, 2, "b"); c.px(29, 13, "b")      // doigt du bas
  c.px(28, 12, "_"); c.px(29, 12, "_")            // pince entrouverte
  // queue : anneaux de plus en plus fins le long de TAIL ; le dard oscille en marchant
  const sway = [0, 1, 0, -1][step % 4]
  TAIL.forEach(([x, y], i) => {
    const last = i >= TAIL.length - 2
    const X = x + (i >= 5 ? sway : 0)
    c.circ(X, y, i < 2 ? 1.5 : 1, "n")
    if (i < 6) c.px(X - 1, y - 1, "N")
    if (i > 0 && i < 6) c.px(X + 1, y + 1, "b")
  })
  const [sx, sy] = TAIL.at(-1)
  c.circ(sx + sway, sy + 2, 1, "b"); c.px(sx + sway - 1, sy + 1, "n") // bulbe du venin
  c.px(sx + sway + 1, sy + 3, "B"); c.px(sx + sway + 2, sy + 4, "B"); c.px(sx + sway + 2, sy + 5, "B") // dard
}
sprite("scorpion_sand_32", { w: 30, h: 28, outline: "k" }, big(0))
sprite("scorpion_black_32", { base: "scorpion_sand_32", swap: BLACK })
anim("scorpion_sand_walk_32", { w: 30, h: 28, outline: "k", frames: 4, fps: 10 }, (c) => big(c.frame)(c))

sheet("scorpions", ["scorpion_*"], { pad: 2 })
