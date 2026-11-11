include("../_palette.px.js")

const meta = {
  title: "Lune",
  description: "Lunes pour ciels de nuit : croissant (16, 32 px), premier quartier, gibbeuse, pleine lune (16, 32 px) à cratères, lune rousse des moissons, lune de sang et croissant endormi avec visage. Partie éclairée à gauche (lumière en haut à gauche), partie sombre transparente, terminateur adouci d'une nuance.",
  tags: ["moon", "sky", "night", "lunar", "phase", "crescent", "icon"],
  variants: {
    crescent_16: { label: "Croissant (16 px)", props: { phase: "crescent", color: "silver" }, tags: ["icon"] },
    crescent_32: { label: "Croissant de lune", props: { phase: "crescent", color: "silver" } },
    quarter_32: { label: "Quartier de lune", props: { phase: "quarter", color: "silver" } },
    gibbous_32: { label: "Lune gibbeuse", props: { phase: "gibbous", color: "silver" } },
    full_16: { label: "Pleine lune (16 px)", props: { phase: "full", color: "silver" }, tags: ["icon"] },
    full_32: { label: "Pleine lune", props: { phase: "full", color: "silver" }, tags: ["craters"] },
    harvest_32: { label: "Lune rousse des moissons", props: { phase: "full", color: "orange" }, tags: ["autumn", "harvest"] },
    blood_32: { label: "Lune de sang", props: { phase: "full", color: "red" }, tags: ["eclipse", "red", "horror"] },
    sleepy_32: { label: "Croissant endormi", props: { phase: "crescent", color: "silver" }, tags: ["cute", "face", "sleep"] },
  },
}

const inCirc = (cx, cy, r) => (x, y) => (x + 0.5 - cx) ** 2 + (y + 0.5 - cy) ** 2 <= r * r

// Cratère : fond m, paroi haute-gauche dans l'ombre (c), bord bas-droit éclairé (w).
sprite("_crater_l", `
  .cc.
  cmmC
  cmmw
  .Cw.`)
sprite("_crater_m", `
  cc
  mw`)
sprite("_crater_s", "m")

// Pleine lune ombrée : C corps, c croissant d'ombre en bas à droite, w calotte en haut à gauche.
const ball = (cx, cy, r) => (c) => {
  for (let y = 0; y < c.h; y++)
    for (let x = 0; x < c.w; x++) {
      if (!inCirc(cx, cy, r)(x, y)) continue
      let col = "C"
      if (!inCirc(cx - 1.2, cy - 1.2, r)(x, y)) col = "c"
      else if (!inCirc(cx + 1.2, cy + 1.2, r)(x, y) && x + 0.5 < cx + r * 0.2 && y + 0.5 < cy + r * 0.2) col = "w"
      c.px(x, y, col)
    }
}
// Phase : garde la partie éclairée à gauche du terminateur (ellipse) ; k = -1 nouvelle, 1 pleine.
// La colonne au bord du terminateur passe d'un cran plus sombre.
// k = "crescent" : disque moins un disque décalé à droite (bord intérieur concave).
const phase = (cx, cy, r, k) => (c) => {
  const lit = k === "crescent"
    ? (x, y) => !inCirc(cx + r * 0.6, cy - r * 0.2, r * 0.92)(x, y)
    : (x, y) => {
      const dy = y + 0.5 - cy, half = Math.sqrt(Math.max(0, r * r - dy * dy))
      return half > 0 && (x + 0.5 - cx) / half < k
    }
  if (k >= 1) return
  for (let y = 0; y < c.h; y++)
    for (let x = c.w - 1; x >= 0; x--) {
      if (!c.is(x, y, "*")) continue
      if (!lit(x, y)) c.px(x, y, "_")
      else if (!lit(x + 1, y)) c.recolor({ w: "C", C: "c", c: "m" }, [x, y, 1, 1])
    }
}

const CRATERS32 = [stamp("_crater_l", 9, 16), stamp("_crater_l", 17, 16), stamp("_crater_m", 12, 19),
  stamp("_crater_m", 19, 8), stamp("_crater_s", 6, 17), stamp("_crater_s", 14, 13), stamp("_crater_s", 23, 13),
  stamp("_crater_s", 10, 24), stamp("_crater_m", 4, 11)]
const MOON32 = (k) => [ball(15, 15, 14), ...CRATERS32, phase(15, 15, 14, k)]

sprite("moon_full_32", { w: 30, h: 30, outline: "k" }, ...MOON32(1))
sprite("moon_gibbous_32", { w: 30, h: 30, outline: "k" }, ...MOON32(0.5))
sprite("moon_quarter_32", { w: 30, h: 30, outline: "k" }, ...MOON32(0))
sprite("moon_crescent_32", { w: 30, h: 30, outline: "k" }, ...MOON32("crescent"))
sprite("moon_harvest_32", { base: "moon_full_32", swap: { w: "Y", C: "y", c: "o", m: "r" } })
sprite("moon_blood_32", { base: "moon_full_32", swap: { w: "o", C: "r", c: "R", m: "R" } })
// Croissant endormi : sans cratères, œil fermé en arc, joue rose, petit sourire et un « Z » qui flotte.
sprite("moon_sleepy_32", { w: 30, h: 30, outline: "k" }, ball(15, 15, 14), phase(15, 15, 14, "crescent"),
  px(5, 13, "k"), px(6, 14, "k"), px(7, 14, "k"), px(8, 13, "k"),
  px(4, 16, "z"), px(5, 16, "z"),
  px(6, 18, "k"), px(7, 19, "k"), px(8, 18, "k"),
  text(19, 7, "Z", "w"), text(24, 2, "Z", "w"))

// ---------------------------------------------------------------- 16 px
const MOON16 = (k) => [ball(7, 7, 7), stamp("_crater_m", 3, 4), stamp("_crater_m", 8, 8),
  stamp("_crater_s", 5, 10), stamp("_crater_s", 10, 4), phase(7, 7, 7, k)]
sprite("moon_full_16", { w: 14, h: 14, outline: "k" }, ...MOON16(1))
sprite("moon_crescent_16", { w: 14, h: 14, outline: "k" }, ...MOON16("crescent"))

sheet("moons", ["moon_*"], { pad: 2 })
