include("../_palette.px.js")

const meta = {
  title: "Soldat en armure",
  description: "Skin « soldat en armure blanche » (casque à visière noire, plastron, ceinture, combinaison noire aux articulations) pour le personnage humain au sol : vues statiques face / dos / profil / trois-quarts, attente animée de face (respiration, poids d'une jambe sur l'autre) et marche de profil (talon, pied à plat, pointe, genoux, bras qui balancent, buste penché), plus le demi-tour face → profil.",
  tags: ["character", "soldier", "trooper", "armor", "sci-fi", "human", "skin", "animated", "walk", "idle"],
  variants: {
    front: { label: "De face (statique)", props: { view: "front", facing: "front", state: "static" } },
    back: { label: "De dos (statique)", props: { view: "back", facing: "back", state: "static" } },
    side: { label: "Profil vers la droite (statique)", props: { view: "side", facing: "right", state: "static" } },
    side_left: { label: "Profil vers la gauche (statique)", props: { view: "side", facing: "left", state: "static" } },
    three_quarter: { label: "Trois-quarts vers la droite (statique)", props: { view: "three_quarter", facing: "right", state: "static" } },
    three_quarter_left: { label: "Trois-quarts vers la gauche (statique)", props: { view: "three_quarter", facing: "left", state: "static" } },
    idle_front: { label: "Attente de face – respiration (animé)", props: { view: "front", facing: "front", state: "idle" }, tags: ["breathing"] },
    idle_side: { label: "Attente de profil – respiration (animé)", props: { view: "side", facing: "right", state: "idle" }, tags: ["breathing"] },
    walk_right: { label: "Marche de profil vers la droite (animé)", props: { view: "side", facing: "right", state: "walk" }, tags: ["walk-cycle"] },
    walk_left: { label: "Marche de profil vers la gauche (animé)", props: { view: "side", facing: "left", state: "walk" }, tags: ["walk-cycle"] },
    turn: { label: "Demi-tour face → profil → face (animé)", props: { view: "turn", facing: "right", state: "turn" }, tags: ["transition"] },
  },
}

// =================================================================================================
//  Moteur : membres en « capsules » ombrées par formes (lumière en haut à gauche), corps et casque
//  dessinés à la main. Toile intérieure 30 × 62 (+ contour k = 32 × 64), sol à y = 61.
// =================================================================================================

// Rampes de matière, sombre -> clair. ARMOR = plaques blanches, SUIT = combinaison noire.
const ARMOR = ["c", "C", "s", "w"]
const SUIT = ["k", "d", "d", "m"]
const L3 = (() => { const v = [-0.55, -0.62, 0.56], n = Math.hypot(...v); return v.map((x) => x / n) })()

/** Capsule de (x0,y0) rayon r0 à (x1,y1) rayon r1, ombrée comme un cylindre. dim : décale vers l'ombre. */
const cap = (x0, y0, x1, y1, r0, r1, ramp = ARMOR, dim = 0, onlyOpaque = false) => (c) => {
  const dx = x1 - x0, dy = y1 - y0, L2 = dx * dx + dy * dy || 1e-6
  const R = Math.max(r0, r1)
  for (let y = Math.floor(Math.min(y0, y1) - R - 1); y <= Math.ceil(Math.max(y0, y1) + R + 1); y++)
    for (let x = Math.floor(Math.min(x0, x1) - R - 1); x <= Math.ceil(Math.max(x0, x1) + R + 1); x++) {
      const px = x + 0.5, py = y + 0.5
      const t = Math.max(0, Math.min(1, ((px - x0) * dx + (py - y0) * dy) / L2))
      const qx = x0 + dx * t, qy = y0 + dy * t, r = r0 + (r1 - r0) * t
      const nx = (px - qx) / r, ny = (py - qy) / r, d2 = nx * nx + ny * ny
      if (d2 > 1 || (onlyOpaque && !c.is(x, y, "*"))) continue
      const nz = Math.sqrt(1 - d2)
      const b = nx * L3[0] + ny * L3[1] + nz * L3[2] - dim
      const i = b > 0.8 ? 3 : b > 0.45 ? 2 : b > 0.05 ? 1 : 0
      c.px(x, y, ramp[i])
    }
}

/** Assombrit d'un cran tout ce qui est dessiné par les items (membres du côté éloigné). */
const FAR = { w: "s", s: "C", C: "c", c: "m", m: "d", d: "k" }

// Ombrage automatique par formes : on dessine les plaques d'armure en `w` (masque), puis chaque
// rangée de plaque est ombrée comme un cylindre (lumière en haut à gauche : bord gauche s, centre-gauche w,
// droite s → C → c) et le bas de chaque plaque s'assombrit d'un cran. Les détails (C, c, k, d…) restent.
const TONES = ["c", "C", "s", "w"]
const autoShade = (opts = {}) => (c) => {
  const { dim = 0, where } = opts
  const armor = (x, y) => c.is(x, y, "wsCc")
  const plan = []
  for (let y = 0; y < c.h; y++) {
    let x = 0
    while (x < c.w) {
      if (!armor(x, y)) { x++; continue }
      let e = x
      while (e + 1 < c.w && armor(e + 1, y)) e++
      const n = e - x + 1
      for (let i = x; i <= e; i++) {
        if (!c.is(i, y, "w") || (where && !where(i, y))) continue
        const u = (i - x + 0.5) / n
        let t = n <= 2 ? (i === e ? 2 : 3) : u < 0.16 ? 2 : u < 0.5 ? 3 : u < 0.74 ? 2 : u < 0.92 || n < 5 ? 1 : 0
        if (!armor(i, y + 1)) t--
        if (!armor(i, y - 1) && t < 3 && u < 0.6) t++
        plan.push([i, y, TONES[Math.max(0, Math.min(3, t - dim))]])
      }
      x = e + 1
    }
  }
  for (const [x, y, k] of plan) c.px(x, y, k)
}

/** Demi-grille (moitié gauche, colonnes alignées à droite sur `w` caractères) -> grille complète en miroir. */
const halfGrid = (w, rows) => rows.trim().split("\n").map((r) => r.trim().padStart(w, ".")).join("\n")

// ------------------------------------------------------------------ vue de FACE
// Casque de face, 12 × 13 : dôme, bande grise, verres noirs en goutte, « larmes », grille de bouche.
sprite("_head_front", `
  ...wwwwww...
  .wwwwwwwwww.
  wwwwwwwwwwww
  wwwwwwwwwwww
  CwwwwwwwwwwC
  wwwkkwwkkwww
  wkkkkwwkkkkw
  wkkkwCCwkkkw
  dkCwwwwwwCkd
  dwCwcCCcwCwd
  wwwcCcCcCwww
  .wwccccccww.`)
// Corps (sans la tête) : moitié gauche, 15 colonnes, miroir -> 30 de large. Commence au cou (y = 13).
sprite("_body_front", { mx: true }, halfGrid(15, `
  ddddd
  .wwww....dwwwww
  wwwwww..wwwwwww
  wwwwwwd.wwwwwww
  wwwwwwd.wwwwwww
  wwwwwd..wwwwwww
  .wwwd...dwwwwww
  .dddd....ddwwww
  .wwwd....ddddd
  .wwwd....dwwCc
  .wwwd....dwwcC
  .wwwd....dwwCc
  .ddd.....dwwww
  .ddd....dddddd
  .www....wwwwww
  wwww....wCwCwC
  wwww....dddddd
  wwww....wwwwdw
  wwww....wwwwdw
  dddd....wwwwwd
  dddd....wwwwww
  dddd....wwwwww
  dddd....wwwwww
  .dd.....wwwwww
  .wwwwww..
  .wwwwww..
  .wwwwww..
  ..wwwww..
  ..wwwww..
  ..wwwww..
  ..CCCCC..
  ..dwwwd..
  ..ddCdd..
  ..wwwww..
  ..wwwww..
  .wwwwww..
  .wwwwww..
  ..wwwww..
  ..wwwww..
  ..wwwww..
  ..wwww...
  ..wwww...
  ..CCCC...
  .wwwwww..
  .wwwwww..
  wwwwwww..
  wwwwwww..
  ccccccc..`))
sprite("trooper_front", { w: 30, h: 62, outline: "k" }, stamp("_body_front", 0, 13), stamp("_head_front", 9, 1), autoShade())

// Attente de face : il respire (épaules, bras et tête montent d'un pixel) et ses mains bougent à peine.
// Le haut du corps (tête, torse, bras) est tamponné séparément des hanches et des jambes.
const UPPER = (dy) => (x, y) => y <= 25 + dy || x < 8 || x > 21
const LOWER = (x, y) => y >= 26 && x >= 8 && x <= 21
const frontPose = (b = 0) => (c) => {
  c.clip(LOWER, () => c.stamp("_body_front", 0, 13))
  c.clip(UPPER(-b), () => c.stamp("_body_front", 0, 13 - b))
  c.stamp("_head_front", 9, 1 - b)
}
const BREATH = [0, 0, 1, 1, 1, 1, 0, 0]
anim("trooper_idle_front", { w: 30, h: 62, frames: 8, fps: 5, outline: "k" },
  (c) => frontPose(BREATH[c.frame])(c), autoShade())

// ------------------------------------------------------------------ vue de DOS
// Casque de dos : dôme, bande grise tout autour, arête et évent arrière, collerette.
sprite("_head_back", `
  ...wwwwww...
  .wwwwwwwwww.
  wwwwwwwwwwww
  wwwwwwwwwwww
  CwwwwwwwwwwC
  CCCCCCCCCCCC
  wwwwwwwwwwww
  wwwwwCCwwwww
  wwwwCddCwwww
  dwwwwCCwwwwd
  wwwwwwwwwwww
  .wwccccccww.`)
// Corps de dos : dossière d'un seul tenant, plaque des reins, ceinture, plaque de fessier, creux des genoux.
sprite("_body_back", { mx: true }, halfGrid(15, `
  ddddd
  .wwww....dwwwww
  wwwwww..wwwwwww
  wwwwwwd.wwwwwww
  wwwwwwd.wwwwwww
  wwwwwd..wwwwwww
  .wwwd...dwwwwww
  .dddd...dwwwwww
  .wwwd...dwwwwww
  .wwwd....wwwwww
  .wwwd....CCCCCC
  .wwwd....dddddd
  .ddd.....dwwwww
  .ddd....dddddd
  .www....wwwwww
  wwww....wwwCww
  wwww....dddddd
  wwww....wwwwww
  wwww....wwwwwd
  dddd....Cwwwdd
  dddd....wwwwww
  dddd....wwwwww
  dddd....wwwwww
  .dd.....wwwwww
  .wwwwww..
  .wwwwww..
  .wwwwww..
  ..wwwww..
  ..wwwww..
  ..wwwww..
  ..CCCCC..
  ..ddddd..
  ..dCCCd..
  ..wwwww..
  ..wwwww..
  .wwwwww..
  .wwwwww..
  ..wwwww..
  ..wwwww..
  ..wwwww..
  ..wwww...
  ..wwww...
  ..CCCC...
  .wwwwww..
  .wwwwww..
  wwwwwww..
  wwwwwww..
  ccccccc..`))
sprite("trooper_back", { w: 30, h: 62, outline: "k" }, stamp("_body_back", 0, 13), stamp("_head_back", 9, 1), autoShade())

// ------------------------------------------------------------------ vue de TROIS-QUARTS (face, tourné vers la droite)
// Casque de trois-quarts : verre proche au centre, verre éloigné étroit au bord droit, oreille à gauche.
sprite("_head_34", `
  ...wwwwww...
  .wwwwwwwwww.
  wwwwwwwwwwww
  wwwwwwwwwwww
  CCCwwwwwwwwC
  wwwwwwkkwwkk
  wCCwwkkkwwkk
  CddCwkkCCwkw
  wCCwwwCwwCdw
  wwwwwdwCcCcw
  wwwwwwcCcCcC
  .wwwwwwcccc.`)
// Le corps de face, retourné d'un huitième de tour : la moitié proche (gauche) s'élargit, la moitié éloignée
// (droite) se resserre derrière, le bras éloigné passe derrière le torse, la jambe éloignée se rapproche.
// stretch : 0 = de face, 1 = trois-quarts.
const turnBody = (name, k = 1) => (c) => {
  c.stamp(name, 0, 13)
  const W = c.w, H = c.h, key = []
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) key.push(c.is(x, y, "*") ? c.key(x, y) : null)
  const at = (x, y) => (x < 0 || x >= W ? null : key[y * W + x])
  c.rect(0, 0, W, H, "_")
  const L = (a, b, t) => a + (b - a) * t
  // torse : la source [7, 15, 23) va en [7→9k, 15→18k, 23→22k] (proche élargi, éloigné resserré)
  const d0 = Math.round(L(7, 9, k)), d1 = Math.round(L(15, 18, k)), d2 = Math.round(L(23, 22, k))
  const torsoSrc = (x) => x < d1 ? 7 + ((x - d0) * 8) / (d1 - d0) : 15 + ((x - d1) * 8) / (d2 - d1)
  const put = (x, y, kk) => kk && c.px(x, y, kk)
  const farArm = Math.round(4 * k), nearArm = Math.round(3 * k), leg = Math.round(1 * k)
  // derrière : bras et jambe éloignés, assombris
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (y < 38) { const sx = x + farArm; if (sx >= 23) put(x, y, at(sx, y)) }
    else { const sx = x + leg; if (sx >= 15) put(x, y, at(sx, y)) }
  }
  autoShade({ dim: Math.round(1.4 * k) })(c)
  // devant : torse étiré, jambe proche, bras proche
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (y < 38 && x >= d0 && x < d2) { const sx = Math.min(22, Math.floor(torsoSrc(x) + 0.5)); put(x, y, at(sx, y)) }
    if (y >= 38) { const sx = x - leg; if (sx < 15) put(x, y, at(sx, y)) }
  }
  for (let y = 0; y < 38; y++) for (let x = 0; x < W; x++) { const sx = x - nearArm; if (sx >= 0 && sx <= 6) put(x, y, at(sx, y)) }
}
sprite("trooper_three_quarter", { w: 30, h: 62, outline: "k" }, turnBody("_body_front"), stamp("_head_34", 11, 1), autoShade())

// ------------------------------------------------------------------ vue de PROFIL (tournée vers la droite)
// Haut du corps de profil, 14 × 32 (casque + torse, sans l'épaulière proche) : dôme, bande grise,
// oreille ronde, verre noir devant, tube de joue, grille de bouche, collerette arrière ; plastron bombé
// devant, dossière derrière, ceinture, plaque de hanche et coquille.
sprite("_upper_side", `
  ....wwwwww....
  ..wwwwwwwwww..
  .wwwwwwwwwwww.
  .wwwwwwwwwwwww
  .CCCCCCwwwwwww
  .wwwwwwCCwwkkw
  .wwwccwwwwkkkw
  .wwcddcwwwwkkw
  .wwwccwwwwddCw
  .wwwwwwwwdwwCc
  .wwwwwwwwwwcCc
  wwwwwww.wwwcc.
  .wwd.ddddd....
  ..dddddddddd..
  ..wwwwwwwwwww.
  .wwwwwwwwwwwww
  .wwwwwwwwwwwww
  .wwwwwwwwwwwww
  .wwwwwwwwwwwwd
  .ddwwwwwwwwwdd
  .dddwwwwwwwdd.
  .ddddddddddd..
  .dwwwwwwwwCd..
  .dwwwwwwwwcd..
  .ddddddddddd..
  wwwwwwwwwwww..
  wCwwwwwwwCww..
  dddddddddddd..
  wwwwwdwwwwww..
  wwwwwdwwwwwd..
  .wwwwdwwwwd...
  ..ddddddd.....`)
// Épaulière proche, cerclée de noir sur le torse.
sprite("_bell_side", `
  ..wwww..
  .wwwwwwk
  kwwwwwwk
  kwwwwwwk
  kwwwwwwk
  .kwwwwk.
  ..kkkk..`)

// Cinématique : jambe à deux segments résolue depuis la cheville (le genou plie vers l'avant).
const ik = (hx, hy, ax, ay, l1, l2, front = 1) => {
  let dx = ax - hx, dy = ay - hy, d = Math.hypot(dx, dy)
  const m = l1 + l2 - 0.01
  if (d > m) { dx *= m / d; dy *= m / d; ax = hx + dx; ay = hy + dy; d = m }
  const a = Math.atan2(dy, dx), cosB = (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)
  const b = Math.acos(Math.max(-1, Math.min(1, cosB)))
  const k = a - front * b
  return { kx: hx + Math.cos(k) * l1, ky: hy + Math.sin(k) * l1, ax, ay }
}
const SOLID = ["w", "w", "w", "w"], DARK = ["d", "d", "d", "d"]
/** Capsule pleine avec un liseré noir autour (sépare un membre proche de ce qu'il recouvre). */
const limb = (x0, y0, x1, y1, r0, r1, key = "w", rim = false) => (c) => {
  if (rim) cap(x0, y0, x1, y1, r0 + 1, r1 + 1, ["k", "k", "k", "k"], 0, true)(c)
  cap(x0, y0, x1, y1, r0, r1, key === "w" ? SOLID : DARK)(c)
}
/** Botte : talon sous la cheville, pointe vers l'avant ; pitch en radians (+ = talon levé). */
const boot = (ax, ay, pitch, rim) => (c) => {
  const cs = Math.cos(pitch), sn = Math.sin(pitch)
  // le pivot : la pointe quand le talon se lève, le talon quand la pointe se lève
  const P = (u, v) => [ax + u * cs - v * sn, ay + u * sn + v * cs]
  const pts = [P(-2.6, -2.2), P(2.4, -2.2), P(6, 1), P(6.2, 3.6), P(-2.8, 3.6)]
  const sole = [P(-2.8, 2.6), P(6.2, 2.6), P(6.2, 3.6), P(-2.8, 3.6)]
  if (rim) for (const [ox, oy] of [[-1, 0], [1, 0], [0, -1], [0, 1]])
    c.clip((x, y) => c.is(x, y, "*"), () => c.poly(pts.flatMap(([x, y]) => [x + ox, y + oy]), "k"))
  c.poly(pts.flat(), "w")
  c.poly(sole.flat(), "c")
}

const GROUND = 61, ANKLE_H = 4, THIGH = 13, SHIN = 12.2
/** Une jambe vue de profil : combinaison, cuissarde, genouillère, jambière, botte. */
const legSide = (hx, hy, ax, ay, pitch, rim) => (c) => {
  const { kx, ky } = ik(hx, hy, ax, ay, THIGH, SHIN, 1)
  limb(hx, hy, kx, ky, 2.9, 2.3, "d", rim)(c)
  limb(kx, ky, ax, ay, 2.3, 1.8, "d", rim)(c)
  const lerp = (a, b, t) => a + (b - a) * t
  limb(lerp(hx, kx, 0.08), lerp(hy, ky, 0.08), lerp(hx, kx, 0.78), lerp(hy, ky, 0.78), 3.3, 2.6)(c)
  limb(lerp(kx, ax, 0.22), lerp(ky, ay, 0.22), lerp(kx, ax, 0.82), lerp(ky, ay, 0.82), 2.7, 2.1)(c)
  limb(kx + 0.9, ky, kx + 0.9, ky, 1.3, 1.3)(c)
  boot(ax, ay, pitch, rim)(c)
}
/** Un bras de profil sous l'épaulière : combinaison, biceps, avant-bras, gant. a = angle (+ = en avant). */
const armSide = (sx, sy, a, bend, rim) => (c) => {
  const ex = sx + Math.sin(a) * 8.5, ey = sy + Math.cos(a) * 8.5
  const fa = a + bend, wx = ex + Math.sin(fa) * 7.5, wy = ey + Math.cos(fa) * 7.5
  const hx = wx + Math.sin(fa) * 1.6, hy = wy + Math.cos(fa) * 1.6
  limb(sx, sy, ex, ey, 1.7, 1.5, "d", rim)(c)
  limb(ex, ey, wx, wy, 1.5, 1.4, "d", rim)(c)
  limb(sx + (ex - sx) * 0.35, sy + (ey - sy) * 0.35, sx + (ex - sx) * 0.75, sy + (ey - sy) * 0.75, 1.9, 1.8)(c)
  limb(ex + (wx - ex) * 0.25, ey + (wy - ey) * 0.25, wx, wy, 2.0, 1.8)(c)
  limb(hx, hy, hx, hy, 1.8, 1.8, "d", rim)(c)
}

/**
 * Pose de profil (vers la droite). g = { near, far } : chaque jambe { x, lift, pitch } (cheville relative à la
 * hanche), arms : { near, far } angles ; bob : le corps descend (px) ; lean : le buste avance (px).
 */
const HX = 14, UX = 8
const sidePose = ({ near, far, armNear = 0, armFar = 0, bob = 0, lean = 0, breath = 0 }) => (c) => {
  const hy = 31.5 + bob, sy = 17 + bob - breath, by = Math.round(bob) - breath, ux = UX + Math.round(lean)
  const ay = (l) => GROUND - ANKLE_H - (l.lift || 0)
  const bend = (a) => 0.15 + Math.max(0, a) * 0.7
  // côté éloigné (bras et jambe), assombri d'un cran
  armSide(ux + 5.5, sy, armFar, bend(armFar), false)(c)
  legSide(HX, hy, HX + far.x, ay(far), far.pitch || 0, false)(c)
  autoShade({ dim: 2 })(c)
  // jambe proche, haut du corps, bras proche, épaulière
  legSide(HX, hy, HX + near.x, ay(near), near.pitch || 0, true)(c)
  c.stamp("_upper_side", ux, 1 + by)
  armSide(ux + 5.5, sy, armNear, bend(armNear), true)(c)
  c.stamp("_bell_side", ux + 2, 14 + by)
  autoShade()(c)
}
sprite("trooper_side", { w: 30, h: 62, outline: "k" },
  sidePose({ near: { x: 1.5 }, far: { x: -1.5 }, armNear: 0.05, armFar: -0.05 }))

// Marche de profil, sur place (le sol défile) : 10 images × 100 ms = un cycle de deux pas (≈ 5 km/h,
// comme la fiche « Marche » du code). Pied d'appui : posé et tiré vers l'arrière à vitesse constante (il
// ne glisse pas sur le sol qui défile) ; pied qui avance : levé en arc, talon d'abord. Le genou plie,
// le corps descend au contact et monte au passage, les bras balancent à l'opposé des jambes, le buste
// penche un peu en avant.
const STRIDE = 6.5, LIFT = 3.5
const legAt = (ph) => {
  ph = ((ph % 1) + 1) % 1
  if (ph < 0.5) { // appui : de l'avant vers l'arrière ; le talon se lève en fin d'appui
    const u = ph / 0.5
    return { x: STRIDE - 2 * STRIDE * u, lift: u > 0.75 ? (u - 0.75) * 4 : 0, pitch: u > 0.7 ? (u - 0.7) * 1.4 : 0 }
  }
  const u = (ph - 0.5) / 0.5, e = (1 - Math.cos(Math.PI * u)) / 2 // élan : de l'arrière vers l'avant
  return { x: -STRIDE + 2 * STRIDE * e, lift: 1 + LIFT * Math.sin(Math.PI * u), pitch: 0.42 * (1 - u) - 0.3 * Math.max(0, u - 0.6) / 0.4 }
}
const walkPose = (ph) => {
  const tau = 2 * Math.PI * ph
  return sidePose({
    near: legAt(ph), far: legAt(ph + 0.5),
    armNear: -0.38 * Math.cos(tau), armFar: 0.38 * Math.cos(tau),
    bob: Math.abs(Math.cos(tau)) > 0.8 ? 1 : 0, lean: 1,
  })
}
anim("trooper_walk_right", { w: 30, h: 62, frames: 10, fps: 10, outline: "k" }, (c) => walkPose(c.phase)(c))

anim("trooper_walk_left", { w: 30, h: 62, frames: 10, fps: 10, outline: "k", flip: "x" }, (c) => walkPose(c.phase)(c))

// Attente de profil : debout, il respire (le haut du corps monte d'un pixel), les bras suivent.
const SIDE_STAND = { near: { x: 1.5 }, far: { x: -1.5 }, armNear: 0.05, armFar: -0.05 }
anim("trooper_idle_side", { w: 30, h: 62, frames: 8, fps: 5, outline: "k" },
  (c) => sidePose({ ...SIDE_STAND, breath: BREATH[c.frame] })(c))

// Vues statiques tournées vers la gauche (miroir).
sprite("trooper_side_left", { base: "trooper_side", flip: "x" })
sprite("trooper_three_quarter_left", { base: "trooper_three_quarter", flip: "x" })

// Demi-tour (l'entrée et la sortie de la marche dans le code) : de face, il se tourne de profil, attend,
// puis revient face à nous.
anim("trooper_turn", { w: 32, h: 64 },
  frame({ ms: 800 }, stamp("trooper_front", 0, 0)),
  frame({ ms: 100 }, stamp("trooper_three_quarter", 0, 0)),
  frame({ ms: 800 }, stamp("trooper_side", 0, 0)),
  frame({ ms: 100 }, stamp("trooper_three_quarter", 0, 0)))

sheet("troopers", ["trooper_*"], { pad: 2 })
