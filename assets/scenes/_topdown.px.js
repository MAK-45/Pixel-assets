// Kit des scènes STATIQUES vues de dessus (3/4, façon RPG) : un écran fixe de 320 × 180.
// Chaque scène de ce type commence par :
//   include("../_palette.px.js")
//   include("_kit.px.js")
//   include("_topdown.px.js")
// Le sol est vu de dessus ; les objets debout (arbres, buissons, rochers, fleurs) gardent leur dessin
// « de face » de la bibliothèque, posés sur leur base avec une ombre portée vers le bas à droite
// (lumière en haut à gauche) et triés par profondeur (base la plus haute dessinée d'abord).

const SW = 320, SH = 180

// ================================================================ ombres au sol

// Un cran plus sombre sur les rampes : herbe, terre, blé, pierre, eau.
const SHADE = {
  L: "l", l: "g", g: "G", N: "n", n: "b", b: "B", Y: "y", y: "o", o: "r",
  C: "c", c: "m", m: "d", I: "i", i: "u", u: "U", w: "s", s: "S", z: "R", Z: "z", e: "p", E: "e",
}
const inEllipse = (cx, cy, rx, ry) => (x, y) => ((x + 0.5 - cx) / rx) ** 2 + ((y + 0.5 - cy) / ry) ** 2 <= 1
// Ombre ovale au sol (ops) ; `soft` ajoute un bord tramé.
const shadowAt = (cx, cy, rx, ry, soft = true) => [
  ...(soft ? [recolor(SHADE, inEllipse(cx, cy, rx + 1.5, ry + 1), 0.5)] : []),
  recolor(SHADE, inEllipse(cx, cy, rx, ry)),
]

// ================================================================ objets posés (tri par profondeur)

// prop(name, x, base, { flip, shadow: [dx, dy, rx, ry] | false, swap }) : objet debout dont le pied
// touche le sol à la ligne `base`. Ombre par défaut : ovale sous le pied, décalée vers la droite.
const prop = (name, x, base, o = {}) => ({ name, x, base, ...o })
// Ops : toutes les ombres d'abord (au sol), puis les objets du plus lointain au plus proche.
const props = (list) => {
  const out = []
  for (const p of list) {
    if (p.shadow === false) continue
    const { w, h } = SIZE[p.name]
    const tall = h >= 28
    const [dx, dy, rx, ry] = p.shadow ?? [tall ? 3 : 1, -1, Math.max(3, w * (tall ? 0.42 : 0.4)), tall ? Math.max(3, h * 0.11) : 2]
    out.push(...shadowAt(p.x + w / 2 + dx, p.base + dy, rx, ry))
  }
  for (const p of [...list].sort((a, b) => a.base - b.base))
    out.push(stamp(p.name, p.x, p.base - SIZE[p.name].h, { ...flipIf(p.flip), ...(p.swap ? { swap: p.swap } : {}) }))
  return out
}

// ================================================================ herbe vue de dessus

// Tapis d'herbe : fond `g`, touffes de brins en grappes (claires au soleil, sombres dans les creux).
// Pas de bruit isolé : chaque marque est une touffe, et les touffes vont par grappes.
const grassGround = (seed, { w = SW, h = SH, clumps = 70, avoid = () => false } = {}) => (c) => {
  const r = rng(seed)
  c.rect(0, 0, w, h, "g")
  for (let i = 0; i < clumps; i++) {
    const cx = Math.floor(r() * w), cy = Math.floor(r() * h)
    const dark = r() < 0.45, n = 3 + Math.floor(r() * 5)
    for (let j = 0; j < n; j++) {
      const x = cx + Math.floor((r() - 0.5) * 14), y = cy + Math.floor((r() - 0.5) * 7)
      if (avoid(x, y)) continue
      if (dark) { c.px(x, y, "G"); c.px(x + 2, y - 1, "G"); c.px(x + 1, y + 1, "G") }
      else { c.px(x, y, "l"); c.px(x + 1, y + 1, "l"); c.px(x + 2, y, r() < 0.5 ? "L" : "l") }
    }
  }
}

// ================================================================ chemin de terre

// Points de passage lissés (Catmull-Rom), un point par pixel environ.
const smoothPath = (pts, step = 0.5) => {
  const out = []
  const P = [pts[0], ...pts, pts[pts.length - 1]]
  for (let i = 1; i < P.length - 2; i++) {
    const [p0, p1, p2, p3] = [P[i - 1], P[i], P[i + 1], P[i + 2]]
    const len = Math.hypot(p2[0] - p1[0], p2[1] - p1[1])
    for (let t = 0; t < 1; t += step / Math.max(1, len)) {
      const t2 = t * t, t3 = t2 * t
      const f = (a, b, c2, d) => 0.5 * (2 * b + (-a + c2) * t + (2 * a - 5 * b + 4 * c2 - d) * t2 + (-a + 3 * b - 3 * c2 + d) * t3)
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])])
    }
  }
  return out
}
// Chemin de terre battue : bord sombre en bas (3/4), terre, bande claire au milieu, cailloux,
// brins d'herbe qui débordent sur les bords. `r` = demi-largeur (le chemin s'élargit vers le bas).
const dirtPath = (pts, r = 6, seed = 5, grow = 0.02) => (c) => {
  const line = smoothPath(pts)
  const rad = (y) => r + Math.max(0, y - 90) * grow
  for (const [x, y] of line) c.ellipse(Math.round(x), Math.round(y) + 1, Math.round(rad(y)) + 1, Math.round(rad(y) * 0.8), "b")
  for (const [x, y] of line) c.ellipse(Math.round(x), Math.round(y), Math.round(rad(y)), Math.round(rad(y) * 0.75), "n")
  for (const [x, y] of line) c.ellipse(Math.round(x - 1), Math.round(y - 1), Math.max(1, Math.round(rad(y) * 0.45)), 1, "N")
  const R = rng(seed)
  for (let i = 0; i < line.length; i += 9) {
    const [x, y] = line[i]
    const ox = Math.round(x + (R() - 0.5) * rad(y) * 1.4), oy = Math.round(y + (R() - 0.5) * rad(y))
    if (c.is(ox, oy, "nN") && c.is(ox + 1, oy, "nN")) { c.px(ox, oy, "N"); c.px(ox + 1, oy, "b") }
  }
  // l'herbe mord sur les bords
  for (let i = 0; i < line.length; i += 3) {
    const [x, y] = line[i]
    for (const side of [-1, 1]) {
      const ex = Math.round(x + side * (rad(y) + 0.5)), ey = Math.round(y + (R() - 0.5) * 4)
      if (R() < 0.6 && c.is(ex, ey, "nNb")) { c.px(ex, ey, "g"); if (R() < 0.5) c.px(ex, ey - 1, "l") }
    }
  }
}

// ================================================================ eau

// Mare ovale en 3/4 : berge de terre visible au fond (en haut), eau sombre sous la berge, reflets
// clairs du ciel en bas à gauche, liseré d'herbe sur la rive proche.
const pond = (cx, cy, rx, ry) => (c) => {
  const R = rng(cx * 7 + cy)
  c.ellipse(cx, cy + 1, rx + 2, ry + 2, "b")                    // berge boueuse
  const inside = inEllipse(cx, cy, rx, ry)
  const deep = inEllipse(cx, cy + 3, rx, ry), mid = inEllipse(cx, cy + 5, rx, ry), sky = inEllipse(cx - 4, cy + 9, rx - 4, ry - 3)
  for (let y = cy - ry; y <= cy + ry; y++)
    for (let x = cx - rx; x <= cx + rx; x++)
      if (inside(x, y)) c.px(x, y, sky(x, y) ? "i" : mid(x, y) ? "u" : deep(x, y) ? "U" : "B")   // B = paroi du fond
  // reflets : traits horizontaux clairs
  for (let i = 0; i < Math.round(rx / 5); i++) {
    const x = Math.round(cx - rx * 0.7 + R() * rx * 1.2), y = Math.round(cy + R() * ry * 0.7)
    if (c.is(x, y, "ui") && c.is(x + 4, y, "ui")) c.hline(x, y, 3 + Math.floor(R() * 3), c.key(x, y) === "i" ? "I" : "i")
  }
  // terre claire au sommet de la paroi
  for (let x = cx - rx; x <= cx + rx; x++)
    for (let y = cy - ry - 1; y < cy; y++) if (c.is(x, y, "B") && !c.is(x, y - 1, "B")) { c.px(x, y, "b"); break }
  // rive proche : l'herbe déborde sur l'eau
  for (let x = cx - rx; x <= cx + rx; x++) {
    let y = cy + ry + 3
    while (y > cy && !c.is(x, y, "uiIU")) y--
    if (y > cy && R() < 0.5) c.px(x, y, "g")
  }
}

// Nénuphar (feuille ronde fendue), à poser sur l'eau.
const lilyPad = (x, y, r = 2, flower = false) => [
  circ(x, y, r, "g"), circ(x - 1, y - 1, r - 1, "l"), px(x + r, y, "u"), px(x + r - 1, y, "u"),
  ...(flower ? [px(x - 1, y - 1, "Z"), px(x, y - 1, "z"), px(x - 1, y - 2, "w")] : []),
]

// ================================================================ animations d'ambiance (acteurs)

// Anim locale à recolorer par période avec periodActor (le kit lit sa taille dans SIZE).
const localAnim = (name, o, ...items) => { anim(name, o, ...items); SIZE[name] = { name, w: o.w, h: o.h } }

// Rond dans l'eau : rien pendant `idle` ms, puis un cercle qui s'élargit et s'efface.
const ripple = (name, idle = 2400) => localAnim(name, { w: 15, h: 7 },
  frame({ ms: idle }),
  frame({ ms: 200 }, px(7, 3, "I"), px(6, 3, "i"), px(8, 3, "i")),
  frame({ ms: 200 }, ellipse(7, 3, 3, 1, "I", true)),
  frame({ ms: 300 }, ellipse(7, 3, 5, 2, "I", true)),
  frame({ ms: 300 }, ellipse(7, 3, 7, 3, "i", true)),
)
// Éclat de soleil sur l'eau.
const glint = (name, idle = 1600) => localAnim(name, { w: 5, h: 5 },
  frame({ ms: idle }),
  frame({ ms: 100 }, px(2, 2, "I")),
  frame({ ms: 200 }, px(2, 2, "w"), px(1, 2, "I"), px(3, 2, "I"), px(2, 1, "I"), px(2, 3, "I")),
  frame({ ms: 100 }, px(2, 2, "I")),
)
// Poisson qui saute hors de l'eau (vu de côté, 3/4), rarement.
const fishJump = (name, idle = 6400) => localAnim(name, { w: 18, h: 11 },
  frame({ ms: idle }),
  frame({ ms: 100 }, px(4, 9, "I"), px(5, 8, "w"), px(6, 9, "I")),
  frame({ ms: 100 }, line(5, 7, 7, 4, "c", 2), px(7, 4, "C"), px(3, 9, "I"), px(5, 10, "i"), px(7, 9, "I")),
  frame({ ms: 100 }, hline(7, 2, 4, "c"), hline(7, 3, 4, "m"), px(8, 2, "C"), px(11, 3, "k"), px(6, 3, "c"), ellipse(5, 9, 2, 1, "i", true)),
  frame({ ms: 100 }, line(11, 3, 13, 6, "c", 2), px(11, 3, "C"), ellipse(5, 9, 3, 1, "i", true)),
  frame({ ms: 100 }, px(13, 8, "w"), px(12, 9, "I"), px(14, 9, "I"), px(12, 7, "I"), ellipse(5, 9, 4, 1, "i", true)),
  frame({ ms: 200 }, ellipse(13, 9, 3, 1, "I", true)),
  frame({ ms: 300 }, ellipse(13, 9, 5, 1, "i", true)),
)

// Couleurs de l'eau par période (la carte NEAR fonce trop l'eau la nuit et la rend grise au crépuscule).
const WATER = {
  day: {},
  dusk: { U: "D", u: "a", i: "F", I: "y", w: "Y" },
  night: { U: "Q", u: "O", i: "M", I: "U", w: "u" },
  overcast: { U: "U", u: "U", i: "u", I: "i", w: "I" },
}
const withWater = (maps) => Object.fromEntries(PERIODS.map((P) => [P, { ...maps[P], ...WATER[P] }]))

// Sol vu de dessus : il reçoit la lumière du ciel au lieu d'être à contre-jour comme dans les scènes
// dynamiques, d'où un cran plus clair que NEAR au crépuscule et la nuit (les objets gardent leur contour).
const TD = {
  day: {},
  dusk: { ...NEAR.dusk, G: "a", g: "A", l: "f", L: "F", P: "a", p: "A", e: "f", E: "F", B: "D", b: "a", n: "f", N: "F" },
  night: { ...NEAR.night, G: "j", g: "J", l: "t", L: "T", P: "j", p: "J", e: "t", E: "T", B: "q", b: "j", n: "J", N: "t" },
  overcast: { ...NEAR.overcast, o: "n", y: "N", Y: "y" },
}
const NEAR_W = withWater(TD)

// ================================================================ effets : ombres de nuages, pollen

// Ombres de nuages (dessinées en transparence par l'effet `shadows`) : grandes taches bosselées.
const cloudShadow = (name, w, h, seed) => {
  const R = rng(seed)
  const blobs = Array.from({ length: 5 }, (_, i) => [Math.round(w * (0.18 + i * 0.16)), Math.round(h * 0.5 + (R() - 0.5) * h * 0.3), Math.round(h * (0.28 + R() * 0.2))])
  sprite(name, { w, h }, ...blobs.map(([x, y, r]) => ellipse(x, y, Math.round(r * 1.5), r, "k")))
}
// Pollen, aigrettes, poussière dorée : 1 à 3 pixels.
sprite("_mote_pollen", "Y")
sprite("_mote_fluff", ".w.\nwsw\n.w.")
sprite("_mote_gold", "y")
