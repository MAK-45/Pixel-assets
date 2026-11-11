include("../_palette.px.js")

const meta = {
  title: "Étoile",
  description: "Étoiles pour ciels de nuit, butin ou interface : étoile à cinq branches en relief (16, 32 px) dorée, argentée ou souriante, scintillement à quatre branches (16, 32 px) doré ou bleu, scintillement animé, étoile filante à traîne et petit amas d'étoiles. Facettes éclairées en haut à gauche.",
  tags: ["star", "sky", "night", "sparkle", "twinkle", "icon", "collectible"],
  variants: {
    five_16: { label: "Étoile dorée (16 px)", props: { shape: "five", color: "gold" }, tags: ["icon", "rating"] },
    five_32: { label: "Étoile dorée", props: { shape: "five", color: "gold" }, tags: ["rating", "collectible"] },
    silver_32: { label: "Étoile argentée", props: { shape: "five", color: "silver" }, tags: ["rating"] },
    smile_32: { label: "Étoile souriante", props: { shape: "five", color: "gold" }, tags: ["cute", "face"] },
    sparkle_16: { label: "Scintillement (16 px)", props: { shape: "sparkle", color: "gold" }, tags: ["icon", "shine"] },
    sparkle_32: { label: "Grand scintillement", props: { shape: "sparkle", color: "gold" }, tags: ["shine", "north-star"] },
    sparkle_blue_16: { label: "Scintillement bleu (16 px)", props: { shape: "sparkle", color: "blue" }, tags: ["icon", "magic"] },
    twinkle_16: { label: "Scintillement animé (16 px)", props: { shape: "sparkle", color: "gold" }, tags: ["animated", "shine"] },
    shooting_32: { label: "Étoile filante", props: { shape: "shooting", color: "gold" }, tags: ["comet", "wish", "trail"] },
    cluster_32: { label: "Amas d'étoiles", props: { shape: "cluster", color: "white" }, tags: ["night", "background", "starfield"] },
  },
}

// Étoile à cinq branches en relief : chaque branche est coupée en deux facettes le long de son axe ;
// la facette tournée vers la lumière (haut-gauche) est claire (Y), l'autre moyenne (y) ou sombre (o).
const star5 = (cx, cy, R, rIn = R * 0.45) => (c) => {
  const pts = []
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? rIn : R
    pts.push(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
  }
  const inside = (px, py) => {
    let ok = false
    for (let i = 0, j = 9; i < 10; j = i++) {
      const [xi, yi, xj, yj] = [pts[2 * i], pts[2 * i + 1], pts[2 * j], pts[2 * j + 1]]
      if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) ok = !ok
    }
    return ok
  }
  const L = -3 * Math.PI / 4  // direction de la lumière (haut-gauche)
  for (let y = 0; y < c.h; y++)
    for (let x = 0; x < c.w; x++) {
      const X = x + 0.5, Y = y + 0.5
      if (!inside(X, Y)) continue
      const a = Math.atan2(Y - cy, X - cx)
      // branche la plus proche, et côté de son axe
      let best = 0, bd = 9
      for (let i = 0; i < 5; i++) {
        const ai = -Math.PI / 2 + (i * 2 * Math.PI) / 5
        const d = Math.atan2(Math.sin(a - ai), Math.cos(a - ai))
        if (Math.abs(d) < Math.abs(bd)) { bd = d; best = ai }
      }
      const n = best + Math.sign(bd || 1) * (Math.PI / 2.2)
      const dot = Math.cos(n - L)
      c.px(x, y, dot > 0.35 ? "Y" : dot > -0.45 ? "y" : "o")
    }
}

// ---------------------------------------------------------------- cinq branches
sprite("star_five_32", { w: 30, h: 30, outline: "k" }, star5(15, 16.5, 15.5))
sprite("star_silver_32", { base: "star_five_32", swap: { Y: "w", y: "C", o: "c" } })
sprite("star_smile_32", { w: 30, h: 30, outline: "k" }, star5(15, 16.5, 15.5),
  rect(11, 14, 2, 3, "k"), rect(17, 14, 2, 3, "k"), px(11, 14, "w"), px(17, 14, "w"),
  px(9, 18, "z"), px(20, 18, "z"),
  px(13, 19, "k"), hline(14, 20, 2, "k"), px(16, 19, "k"))
sprite("star_five_16", { w: 14, h: 14, outline: "k" }, star5(7, 7.8, 7.4))

// ---------------------------------------------------------------- scintillement à quatre branches
// Branches concaves (astroïde) : Y cœur, y corps, o côté bas-droit.
const sparkle = (cx, cy, R, p = 0.5) => (c) => {
  for (let y = 0; y < c.h; y++)
    for (let x = 0; x < c.w; x++) {
      const dx = Math.abs(x + 0.5 - cx) / R, dy = Math.abs(y + 0.5 - cy) / R
      if (dx ** p + dy ** p > 1) continue
      const core = (dx * 2.2) ** p + (dy * 2.2) ** p <= 1
      const dark = x + 0.5 > cx && y + 0.5 > cy || (x + 0.5 > cx + 0.5 && Math.abs(y + 0.5 - cy) < 1) || (y + 0.5 > cy + 0.5 && Math.abs(x + 0.5 - cx) < 1)
      c.px(x, y, core ? "Y" : dark ? "o" : "y")
    }
}
sprite("star_sparkle_32", { w: 30, h: 30, outline: "k" }, sparkle(15, 15, 15, 0.55))
// En 16 px, dessinées à la main (quart haut-gauche, miroir en x et y autour d'un centre partagé).
sprite("_sp_l", { mx: "c", my: "c" }, `
  ......y
  ......y
  .....yY
  .....yY
  ....yYY
  ..yyYYY
  yyYYYYw`)
sprite("_sp_m", { mx: "c", my: "c" }, `
  ....y
  ....y
  ...yY
  ..yYY
  yyYYw`)
sprite("_sp_s", { mx: "c", my: "c" }, `
  ..y
  .yY
  yYw`)
// Ombre : branche droite, branche basse et quart bas-droit passent en o.
const shadeBR = (cx, cy) => recolor({ y: "o" }, (x, y) => (x > cx && y >= cy) || (y > cy && x >= cx))
sprite("star_sparkle_16", { w: 13, h: 13, outline: "k" }, stamp("_sp_l", 0, 0), shadeBR(6, 6))
sprite("star_sparkle_blue_16", { base: "star_sparkle_16", swap: { Y: "I", y: "i", o: "u" } })
// Petit, moyen, grand puis retour : pause sur le plus petit.
anim("star_twinkle_16", { w: 13, h: 13, outline: "k", fps: 10 },
  frame({ ms: 400 }, stamp("_sp_s", 4, 4)), frame(stamp("_sp_m", 2, 2)),
  frame({ ms: 200 }, stamp("_sp_l", 0, 0)), frame(stamp("_sp_m", 2, 2)),
  shadeBR(6, 6))

// ---------------------------------------------------------------- étoile filante
// Petite étoile en tête, traîne en trois bandes qui s'amincissent (y -> o -> r) vers le haut à droite.
sprite("star_shooting_32", { w: 30, h: 30, outline: "k" },
  line(9, 20, 28, 1, "r", 2), line(9, 20, 24, 5, "o", 3), line(9, 20, 18, 11, "y", 3),
  line(9, 20, 13, 16, "Y", 2), star5(8, 22, 8))

// ---------------------------------------------------------------- amas
sprite("_dot", "w")
sprite("_tiny", `
  .w.
  wYw
  .w.`)
sprite("star_cluster_32", { w: 30, h: 30, outline: "k" },
  stamp("_sp_l", 2, 3), shadeBR(8, 9), stamp("_sp_m", 18, 15, { swap: { Y: "I", y: "i" } }), shadeBR(22, 19),
  stamp("_tiny", 20, 3), stamp("_tiny", 6, 21), stamp("_tiny", 26, 26),
  stamp("_dot", 15, 6), stamp("_dot", 3, 16), stamp("_dot", 12, 26), stamp("_dot", 27, 10), stamp("_dot", 13, 16))

sheet("stars", ["star_*"], { pad: 2 })
