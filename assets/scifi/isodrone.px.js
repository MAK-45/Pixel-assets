include("../_palette.px.js")
include("_iso.px.js")

const meta = {
  title: "Drone isométrique",
  description: "Petit robot sphérique de station spatiale en vue isométrique 2:1 (16 × 24 px), animé : il flotte en montant et descendant (6 images de 200 ms), son réacteur vacille et son ombre au sol se resserre quand il monte (ombre translucide, sans contour). Coque blanche ou orange à l'œil turquoise, ou version d'alerte à l'œil rouge qui clignote. Chaque version existe dans les quatre directions : de face vers le bas à gauche (sw) ou à droite (se), de dos vers le haut à gauche (nw) ou à droite (ne), pour le faire patrouiller.",
  tags: ["isometric", "drone", "robot", "bot", "hover", "scifi", "space-station", "animated", "character", "npc"],
  variants: {},
}
const COLORS = { white: "Drone blanc", orange: "Drone orange", alert: "Drone en alerte" }
const FACINGS = { sw: "de face, vers le bas à gauche", se: "de face, vers le bas à droite", nw: "de dos, vers le haut à gauche", ne: "de dos, vers le haut à droite" }
for (const [color, name] of Object.entries(COLORS))
  for (const [facing, where] of Object.entries(FACINGS))
    meta.variants[`${color}_${facing}`] = {
      label: `${name} – ${where}`,
      props: { color: color === "alert" ? "white" : color, facing, state: color === "alert" ? "alert" : "idle" },
      ...(color === "alert" ? { tags: ["warning"] } : {}),
    }

const ORANGE = { w: "Y", C: "y", c: "o", m: "r" }

// Corps (avec contour) : sphère éclairée en haut à gauche, antenne. De face : visière sombre et œil du
// côté du regard, aileron à l'opposé. De dos : grille d'échappement et feu arrière. `eye` = [iris, reflet].
const body = (facing, eye) => (c) => {
  const right = facing === "se" || facing === "ne", back = facing[0] === "n"
  c.vline(6, 0, 3, "m"); c.px(6, 0, "o")
  for (let y = 3; y <= 13; y++) for (let x = 1; x <= 11; x++) if ((x - 6) ** 2 + (y - 8) ** 2 <= 30) c.px(x, y, "c")
  c.recolor({ c: "C" }, (x, y) => (x - 4) ** 2 + (y - 6) ** 2 < 9)
  c.recolor({ c: "m" }, (x, y) => (x - 4) ** 2 + (y - 5) ** 2 > 40)
  c.px(3, 5, "w"); c.px(4, 4, "w")
  if (back) {
    // de dos : le regard part vers le haut, on voit la grille et le feu arrière
    const x0 = right ? 2 : 6
    c.rect(x0, 8, 5, 1, "d"); c.rect(x0, 10, 5, 1, "d")
    c.px(right ? 8 : 4, 6, eye[0])
    c.rect(right ? 11 : 0, 7, 2, 2, "m")
  } else {
    const x0 = right ? 5 : 1
    c.rect(x0, 8, 7, 3, "d")
    const ex = right ? 8 : 3
    c.rect(ex, 8, 2, 2, eye[0]); c.px(ex, 8, eye[1])
    c.rect(right ? 0 : 11, 6, 2, 2, "m")
  }
  c.hline(5, 14, 3, "d") // tuyère
}
const EYES = [["0", "+"], ["0", "+"], ["0", "+"], ["0", "+"], ["9", "0"], ["0", "+"]] // clin d'œil
const RED = [["r", "o"], ["o", "y"], ["r", "o"], ["R", "r"], ["r", "o"], ["o", "y"]]
const BOB = [0, 0, 1, 2, 2, 1]

const drone = (color, facing, eyes, swap) => {
  const key = `${color}_${facing}`
  for (let i = 0; i < 6; i++) sprite(`_body_${key}_${i}`, { w: 13, h: 15, outline: "k", ...(swap ? { swap } : {}) }, body(facing, eyes[i]))
  anim(`isodrone_${key}`, { w: 15, h: 24, frames: 6, fps: 5 }, (c) => {
    const f = c.frame, y = BOB[f]
    // ombre au sol : plus large quand le drone est bas
    c.ellipse(7, 22, y === 2 ? 5 : 4, 1, "%")
    c.stamp(`_body_${key}_${f}`, 0, y)
    // flamme du réacteur (sans contour)
    c.px(7, y + 17, "+"); c.px(7, y + 18, f % 2 ? "0" : "9")
    if (f % 3 === 0) c.px(6, y + 18, "9")
  })
}
for (const facing of Object.keys(FACINGS)) {
  drone("white", facing, EYES)
  drone("orange", facing, EYES, ORANGE)
  drone("alert", facing, RED)
}

sheet("isodrones", ["isodrone_*"], { pad: 2 })
