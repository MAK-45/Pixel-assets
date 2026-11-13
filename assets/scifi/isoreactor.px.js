include("../_palette.px.js")
include("_iso.px.js")

const meta = {
  title: "Réacteur isométrique",
  description: "Cœur d'énergie de station spatiale en vue isométrique 2:1 (32 × 48 px), animé en 8 images de 100 ms : une sphère de plasma (ou un cristal) flotte et pulse entre deux pylônes, des arcs électriques la relient aux pointes et deux particules tournent autour. Halo translucide sans contour (il se fond dans le décor). Sphère turquoise, violette ou orange, cristal turquoise ou violet, et réacteur éteint.",
  tags: ["isometric", "reactor", "core", "energy", "plasma", "crystal", "generator", "scifi", "space-station", "animated", "glow"],
  variants: {
    cyan: { label: "Réacteur turquoise – sphère de plasma", props: { shape: "orb", color: "cyan", state: "on" } },
    violet: { label: "Réacteur violet – sphère de plasma", props: { shape: "orb", color: "violet", state: "on" } },
    orange: { label: "Réacteur orange – sphère de plasma (surchauffe)", props: { shape: "orb", color: "orange", state: "on" }, tags: ["alert"] },
    crystal_cyan: { label: "Réacteur turquoise – cristal", props: { shape: "crystal", color: "cyan", state: "on" } },
    crystal_violet: { label: "Réacteur violet – cristal", props: { shape: "crystal", color: "violet", state: "on" } },
    off: { label: "Réacteur éteint", props: { shape: "orb", color: "gray", state: "off" } },
  },
}

// Énergie en turquoise (8 9 0 + et halos : ;) ; les autres couleurs sont des swaps.
const ENERGY = {
  violet: { 8: "V", 9: "v", 0: "x", "+": "Z", ":": "@", ";": "&" },
  orange: { 8: "R", 9: "r", 0: "o", "+": "y", ":": "^", ";": "~" },
}
const CX = 14, CY = 16

// Socle rond et deux pylônes à griffe (avec contour) ; `on` allume l'émetteur du socle.
const frame = (on) => (c) => {
  isoCyl(c, CX, 35, 14, 2, { top: "m", lit: ">", body: "<", dark: "d" })
  c.ellipse(CX, 35, 11, 5, "d")
  c.ellipse(CX, 35, 10, 4, "<")
  c.ellipse(CX, 35, 6, 3, "d")
  c.ellipse(CX, 35, 5, 2, on ? "9" : "<")
  if (on) c.ellipse(CX, 35, 2, 1, "0")
  // pylône gauche (éclairé) et droit (à l'ombre) : fût, bagues isolantes, griffe tournée vers le cœur
  for (const [x, dir, lit, body, dark] of [[0, 1, "w", "C", "c"], [25, -1, "c", "m", "<"]]) {
    c.rect(x, 9, 4, 26, body)
    c.vline(dir > 0 ? x : x + 3, 9, 26, dir > 0 ? lit : dark)
    c.vline(dir > 0 ? x + 3 : x, 9, 26, dir > 0 ? dark : lit)
    for (const y of [14, 21, 28]) c.rect(x, y, 4, 2, "d")
    const tip = dir > 0 ? x + 4 : x - 1
    c.line(x + 1 + (dir > 0 ? 0 : 1), 8, tip + dir, 5, body, 2)
    c.px(tip + dir * 2, 5, on ? "0" : "d"); c.px(tip + dir * 2, 6, on ? "9" : "d")
    c.rect(x, 33, 4, 3, "d")
  }
}
sprite("_frame_on", { w: 29, h: 45, outline: "k" }, frame(true))
sprite("isoreactor_off", { w: 29, h: 45, outline: "k" }, frame(false), circ(CX, CY, 5, "<"), circ(CX - 1, CY - 1, 2, "m"))

// Arc électrique en zigzag d'une pointe de pylône vers le cœur.
const arc = (c, x0, y0, x1, y1, seed) => {
  let x = x0, y = y0
  for (let i = 0; x !== x1 && i < 12; i++) {
    c.px(x, y, i % 2 ? "0" : "+")
    x += Math.sign(x1 - x)
    y += ((seed + i) % 3) - 1 + Math.sign(y1 - y) * (i % 2)
  }
}
const FRAMES = 8
const reactor = (shape) => (c) => {
  const f = c.frame, k = c.phase * Math.PI * 2
  const pulse = Math.sin(k) > 0.2 ? 1 : 0
  const r = 5 + pulse
  // halo (derrière les pylônes), faisceau du socle
  c.circ(CX + 1, CY + 1, r + 7, ";")
  c.circ(CX + 1, CY + 1, r + 3, ":")
  for (let y = CY + 1 + r + 3; y < 37; y++) c.px(CX + 1, y, (y + f) % 4 < 2 ? ":" : ";")
  c.stamp("_frame_on", 0, 0)
  for (let y = CY + 1 + r + 2; y < 35; y++) if ((y - f + 80) % 4 === 0) c.px(CX + 1, y, "0")
  // particules en orbite : derrière, puis (plus bas) devant le cœur
  const orbit = (front) => {
    for (const a of [k, k + Math.PI]) if (Math.sin(a) >= 0 === front)
      c.px(CX + 1 + Math.round(Math.cos(a) * 9), CY + 1 + Math.round(Math.sin(a) * 3), front ? "+" : "9")
  }
  orbit(false)
  const X = CX + 1, Y = CY + 1
  if (shape === "orb") {
    c.circ(X, Y, r, "9"); c.circ(X, Y, r - 1, "0"); c.circ(X - 1, Y - 1, r - 3, "+")
    c.px(X - 2, Y - 2, "w")
  } else {
    // cristal : losange à facettes, il monte et descend d'un pixel, le reflet passe d'une facette à l'autre
    const b = pulse
    c.poly([X - 5, Y - b, X + 1, Y - 8 - b, X + 6, Y - b, X + 1, Y + 8 - b], "9")
    c.poly([X - 5, Y - b, X + 1, Y - 8 - b, X + 1, Y + 8 - b], "0")
    c.poly([X - 3, Y - b, X + 1, Y - 6 - b, X + 1, Y + 1 - b], f % 4 < 2 ? "+" : "0")
    c.line(X, Y - 7 - b, X, Y + 6 - b, f % 4 < 2 ? "0" : "+")
    c.px(X - 2, Y - 2 - b, "w")
  }
  orbit(true)
  if (f % 4 === 0) arc(c, 7, 7, X - r, Y - 2, f)
  if (f % 4 === 2) arc(c, 23, 7, X + r, Y - 2, f + 1)
}
const core = (key, shape, swap) =>
  anim(`isoreactor_${key}`, { w: 31, h: 47, frames: FRAMES, fps: 10, ...(swap ? { swap } : {}) }, reactor(shape))
core("cyan", "orb")
core("violet", "orb", ENERGY.violet)
core("orange", "orb", ENERGY.orange)
core("crystal_cyan", "crystal")
core("crystal_violet", "crystal", ENERGY.violet)

sheet("isoreactors", ["isoreactor_*"], { pad: 2 })
