include("../_palette.px.js")
include("_kit.px.js")

// Périodes de la salle : trois ambiances d'éclairage.
const ROOM_PERIODS = { day: "Normal", alert: "Alerte", night: "Veille" }
const RP = Object.keys(ROOM_PERIODS)

const meta = {
  title: "Salle de station spatiale",
  description: "Scène statique 16:9 (base 320 × 180) en vue isométrique 2:1 : l'angle d'une grande salle de station spatiale qui remplit tout l'écran, montée avec les familles iso* de la catégorie scifi (dalles, pans de mur, consoles, caisses, capsules de stase, réacteur, mobilier, drone). Hublots vitrés par où l'on voit les étoiles scintiller, planète aux anneaux au-dessus des murs. Animations : écran mural et moniteurs, diodes des serveurs, porte coulissante qui s'ouvre, impulsions qui courent le long des rails de lumière du sol, réacteur qui pulse, hologramme qui tourne, bulles des capsules, drone qui patrouille. Trois ambiances : normal, alerte (lumières rouges, gyrophares et lueur qui clignotent, drone d'alerte) et veille (salle dans le noir, écrans et lumières seuls, clair d'étoiles par les hublots). Image de 480 × 270 centrée en bas pour couvrir les écrans plus larges ; pieds du personnage à y = 152.",
  tags: ["scene", "static", "isometric", "scifi", "space-station", "spaceship", "room", "interior", "laboratory", "control-room", "animated"],
  variants: {
    day: { label: "Éclairage normal", props: { period: "day" }, tags: ["lit"] },
    alert: { label: "Alerte rouge", props: { period: "alert" }, tags: ["alarm", "red", "emergency"] },
    night: { label: "Veille (lumières éteintes)", props: { period: "night" }, tags: ["dark", "standby", "glow"] },
  },
  scene: {
    type: "static",
    w: 320, h: 180, groundY: 152,
    periods: ROOM_PERIODS,
    defaultPeriod: "day",
    planes: [
      { id: "space", label: "Espace", kind: "sky", factor: 0, y: 0, image: "_space" },
      { id: "stars", label: "Étoiles et planète", factor: 0, y: -90, image: "_stars" },
      { id: "room", label: "Sol et murs", factor: 0, y: -90, image: "_room_{period}", actors: [] },
      { id: "props", label: "Mobilier et machines", factor: 0, y: -90, image: "_shadows", actors: [] },
      { id: "alarm", label: "Lueur des gyrophares", factor: 0, y: -90, image: "_alarm_glow", periods: ["alert"] },
    ],
    sprites: { twinkle: "_star_tiny_twinkle_8" },
    effects: Object.fromEntries(RP.map((P) => [P, [{ type: "twinkle", sprite: "twinkle", count: 12, area: [0, 0, 320, 130], after: "stars" }]])),
  },
}

// ================================================================ éléments importés

imp("sky/star", ["tiny_plus_8", "tiny_twinkle_8"])
imp("scifi/isofloor", ["plate", "plate_light", "plate_blue", "grate", "hazard", "hatch", "circuit", "light", "light_cross", "light_node", "light_pulse", "light_cross_pulse"])
imp("scifi/isowall", ["panel_left", "light_left", "vent_left", "pipes_left", "window_left", "door_left", "door_cycle_left", "alarm_off_left", "alarm_left",
  "panel_right", "light_right", "vent_right", "pipes_right", "window_right", "door_right", "screen_right", "alarm_off_right", "alarm_right"])
imp("scifi/isoconsole", ["desk_sw", "desk_se", "rack_sw", "holo"])
imp("scifi/isocrate", ["metal", "blue", "orange", "green", "large_48", "large_blue_48", "stack_48", "barrel", "barrel_toxic"])
imp("scifi/isopod", ["specimen_cyan", "green", "specimen_violet"])
imp("scifi/isoreactor", ["cyan"])
imp("scifi/isofurniture", ["chair_sw", "table", "locker_se", "plant", "plant_tall", "bunk_se"])
imp("scifi/isodrone", ["white_sw", "white_se", "white_nw", "white_ne", "alert_sw", "alert_se", "alert_nw", "alert_ne"])

// ================================================================ géométrie

// Image de la salle : 480 × 270, plus grande que la vue de base (320 × 180, centrée en bas) pour
// remplir aussi les écrans que le moteur élargit. (CX, CY) = angle du fond, au ras du sol.
const RW = 480, RH = 270, CX = 240, CY = 156
// Point du sol (i vers le bas à droite le long du mur de droite, j vers le bas à gauche), en dalles.
const at = (i, j) => [CX + (i - j) * 16, CY + (i + j) * 8]
const tileAt = (i, j) => [CX + (i - j) * 16 - 16, CY + (i + j) * 8]
const wallAt = (side, k, n) => (side === "left" ? [CX - (k + n) * 16, CY + k * 8 - 56] : [CX + k * 16, CY + k * 8 - 56])

// ================================================================ couleurs des périodes

// Normal : couleurs de la maison. Alerte : pénombre prune, les lumières turquoise virent à l'orange
// (les oranges d'origine s'éteignent en brun pour que seules les lumières brillent). Veille : salle
// dans le noir bleuté, les lumières et les écrans gardent leurs couleurs.
const AMBIENT = {
  day: {},
  alert: {
    d: "D", "<": "D", m: "a", ">": "a", c: "A", C: "f", w: "f", "[": "D", "]": "a", S: "A", s: "f",
    I: "x", i: "v", u: "V", U: "D", L: "W", l: "X", g: "H", G: "h", o: "n", y: "N", r: "b", R: "B", Y: "N",
    8: "R", 9: "r", 0: "o", "+": "y", ":": "^", ";": "~",
  },
  night: {
    d: "q", "<": "q", m: "j", ">": "J", c: "J", C: "t", w: "T", "[": "q", "]": "j", S: "J", s: "t",
    I: "u", i: "U", u: "M", U: "O", y: "n", o: "b", r: "B", R: "3", Y: "n", L: "X", l: "H", g: "h", G: "h", b: "B", n: "b", N: "n",
  },
}
// Carte d'une période sans les clés de `keep` (matières qui émettent leur propre lumière).
const ambient = (P, keep = "") => Object.fromEntries(Object.entries(AMBIENT[P]).filter(([k]) => !keep.includes(k)))

// ================================================================ acteurs (éléments animés ou posés)

// Définit "_a_<clé>_<période>" à partir d'une partie importée (src : nom, ou { période: nom }) et
// l'inscrit dans meta.scene.sprites. Renvoie sa taille.
const actorSprite = (key, src, keep) => {
  const of = (P) => (typeof src === "string" ? src : src[P])
  for (const P of RP) {
    const { w, h } = SIZE[of(P)]
    sprite(`_a_${key}_${P}`, { w, h }, stamp(of(P), 0, 0, { swap: ambient(P, keep) }))
  }
  meta.scene.sprites[key] = `_a_${key}_{period}`
  return SIZE[of("day")]
}
const planeOf = (id) => meta.scene.planes.find((p) => p.id === id)

// ================================================================ 0. espace

sprite("_space", { w: 8, h: 180 }, grad(0, 0, 8, 150, "QOM", "v", 0.3), rect(0, 150, 8, 30, "M"))

// Géante gazeuse aux anneaux (en haut à gauche, au-dessus du mur) et petite lune (en haut à droite).
const PLANET = [118, 128, 25]
const planet = (c) => {
  const [cx, cy, r] = PLANET
  const ring = (front) => {
    for (let a = 0; a < 720; a++) {
      const t = (a / 720) * Math.PI * 2, s = Math.sin(t)
      if (s >= 0 !== front) continue
      for (const [k, key] of [[1.58, "S"], [1.5, "s"], [1.42, "S"], [1.3, "]"]])
        c.px(Math.round(cx + Math.cos(t) * r * k + s * r * 0.18), Math.round(cy + s * r * k * 0.26 - Math.cos(t) * r * 0.2), key)
    }
  }
  ring(false)
  for (let y = -r; y <= r; y++)
    for (let x = -r; x <= r; x++) {
      if (x * x + y * y > r * r + r * 0.6) continue
      // bandes de nuages légèrement courbes, terminateur en bas à droite
      const band = Math.floor((y + (x * x) / (r * 5) + r) / 4.2)
      let key = ["x", "v", "x", "Z", "x", "v", "V", "v", "x", "v", "V", "V"][band] ?? "V"
      const nz = Math.sqrt(Math.max(0, 1 - (x * x + y * y) / (r * r)))
      const lit = (-0.55 * x - 0.6 * y) / r + 0.55 * nz
      if (lit < -0.12) key = "D"
      else if (lit < 0.22) key = key === "Z" ? "x" : key === "x" ? "v" : key === "v" ? "V" : "D"
      c.px(cx + x, cy + y, key)
    }
  ring(true)
}
const moon = (c) => {
  c.circ(392, 104, 6, "c")
  c.recolor({ c: "C" }, (x, y) => (x - 390) ** 2 + (y - 102) ** 2 < 14)
  c.recolor({ c: "m" }, (x, y) => x + y - 496 > 4)
  c.px(393, 102, "m"); c.px(389, 105, "m"); c.px(391, 107, "m")
}
sprite("_stars", { w: RW, h: RH },
  starField(330, 250, 23, [PLANET[0] - 46, PLANET[1] - 30, 92, 60], RW), planet, moon)

// ================================================================ 1. sol et murs

// Plan du sol : rail de lumière de la porte jusqu'au réacteur et vers l'avant, zone de danger autour
// du réacteur, grilles devant les portes, plaques claires au pied des murs.
const floorName = (i, j) => {
  if (j === 6 && i === 4) return "light_node"
  if (j === 6 && i >= 1) return "light_cross"
  if (i === 4 && j === 5) return "light"
  const di = Math.abs(i - 3), dj = Math.abs(j - 3)
  if (di + dj === 1 || (di === 0 && dj === 0)) return "hazard"
  if (di === 1 && dj === 1) return "circuit"
  if ((i === 0 && (j === 5 || j === 6 || j === 13 || j === 14)) || (j === 0 && (i === 11 || i === 12))) return "grate"
  if ((i === 8 && j === 8) || (i === 1 && j === 10)) return "hatch"
  if (i === 0 || j === 0) return "plate_light"
  if (i >= 5 && i <= 8 && j >= 1 && j <= 3) return "plate_blue"
  return "plate"
}
const floor = (c) => {
  for (let i = 0; i < 26; i++)
    for (let j = 0; j < 26; j++) {
      const [x, y] = tileAt(i, j)
      if (x < RW && x > -32 && y < RH) c.stamp(`_isofloor_${floorName(i, j)}`, x, y)
    }
}
// Murs, de l'angle vers les bords : [modèle, première dalle, largeur en dalles].
const WALLS = {
  left: [["light", 0, 1], ["window", 1, 3], ["panel", 4, 1], ["door", 5, 2], ["alarm_off", 7, 1], ["vent", 8, 1], ["pipes", 9, 1],
    ["pipes", 10, 1], ["light", 11, 1], ["panel", 12, 1], ["door", 13, 2]],
  right: [["light", 0, 1], ["panel", 1, 1], ["panel", 2, 1], ["alarm_off", 3, 1], ["panel", 4, 1], ["pipes", 5, 1], ["window", 6, 3], ["light", 9, 1],
    ["pipes", 10, 1], ["door", 11, 2], ["vent", 13, 1], ["light", 14, 1]],
}
const walls = Object.entries(WALLS).flatMap(([side, list]) => list.map(([model, k, n]) => stamp(`_isowall_${model}_${side}`, ...wallAt(side, k, n))))
sprite("_shell", { w: RW, h: RH }, floor, ...walls, vline(CX - 1, CY - 53, 53, "["))

// Taches de clarté au sol sous les hublots (clair d'étoiles), en veille.
const quad = (pts) => pts.flatMap(([i, j]) => at(i, j))
const starlight = [
  poly(quad([[0, 1.2], [0, 3.8], [3.2, 4.8], [3.2, 2.2]]), "w"),
  poly(quad([[6.2, 0], [8.8, 0], [9.8, 3.2], [7.2, 3.2]]), "w"),
]
const GLOW = {
  day: [glow("0+", { r: 4, strength: 0.22, bands: 2 })],
  alert: [glow("oy", { r: 6, strength: 0.3, bands: 2 })],
  night: [layer("starlight", { light: 1 }, ...starlight), glow("0+", { r: 6, strength: 0.5, bands: 2 })],
}
for (const P of RP) sprite(`_room_${P}`, { w: RW, h: RH }, stamp("_shell", 0, 0, { swap: ambient(P) }), ...GLOW[P])

// Éléments animés des murs et du sol (dessinés par-dessus l'image, dans l'ordre).
const roomActors = planeOf("room").actors
const wallActor = (key, src, side, k, n, keep) => {
  actorSprite(key, src, keep)
  const [x, y] = wallAt(side, k, n)
  roomActors.push({ sprite: key, x, y })
}
// Impulsions des rails : seule la bande lumineuse de la dalle animée est gardée, pour laisser voir
// le halo du sol cuit dans l'image ; chaque dalle est décalée de 200 ms, la lumière court le long du rail.
const railBand = (along) => (x, y) => {
  const dx = (x + 0.5 - 16) / 2, dy = y + 0.75
  return Math.abs((along === "p" ? dy + dx : dy - dx) - 8) < 2.8
}
const pulseSprite = (key, src, along) => {
  for (const P of RP) sprite(`_a_${key}_${P}`, { w: 32, h: 15 }, clip(railBand(along), stamp(src, 0, 0, { swap: ambient(P) })))
  meta.scene.sprites[key] = `_a_${key}_{period}`
}
pulseSprite("pulse", "_isofloor_light_cross_pulse", "q")
for (let i = 1; i <= 12; i++) if (i !== 4) roomActors.push({ sprite: "pulse", x: tileAt(i, 6)[0], y: tileAt(i, 6)[1], phase: (1200 - ((i * 200) % 1200)) % 1200 })
pulseSprite("pulse_up", "_isofloor_light_pulse", "p")
roomActors.push({ sprite: "pulse_up", x: tileAt(4, 5)[0], y: tileAt(4, 5)[1], phase: 600 })
wallActor("door", "_isowall_door_cycle_left", "left", 5, 2)
wallActor("screen", "_isowall_screen_right", "right", 1, 2)
wallActor("alarm_l", { day: "_isowall_alarm_off_left", alert: "_isowall_alarm_left", night: "_isowall_alarm_off_left" }, "left", 7, 1, "RroyY")
wallActor("alarm_r", { day: "_isowall_alarm_off_right", alert: "_isowall_alarm_right", night: "_isowall_alarm_off_right" }, "right", 3, 1, "RroyY")

// ================================================================ 2. mobilier et machines

// [clé, partie (ou { période: partie }), i, j du centre de l'emprise au sol, profondeur de l'emprise en px, options]
// keep = matières lumineuses qui gardent leurs couleurs ; phase = décalage de l'animation.
const PROPS = [
  // angle et mur de droite : plante, caisses sous l'écran, serveurs, pupitre devant le hublot, capsules
  ["plant_tall", "_isofurniture_plant_tall", 0.5, 0.5, 6],
  ["crate_blue", "_isocrate_blue", 1.65, 0.5, 14],
  ["barrel", "_isocrate_barrel", 2.5, 0.45, 8],
  ["rack", "_isoconsole_rack_sw", 4.2, 0.42, 13],
  ["rack", "_isoconsole_rack_sw", 5.05, 0.42, 13, { phase: 500 }],
  ["desk_sw", "_isoconsole_desk_sw", 7.0, 0.5, 20],
  ["pod_cyan", "_isopod_specimen_cyan", 8.7, 0.5, 10],
  ["pod_green", "_isopod_green", 9.75, 0.5, 10, { keep: "GglL", phase: 700 }],
  ["pod_violet", "_isopod_specimen_violet", 10.8, 0.5, 10, { phase: 1300 }],
  // mur de gauche : couchette sous le hublot, casier, plante, pupitre ; coin repos devant
  ["bunk", "_isofurniture_bunk_se", 0.5, 2.05, 23],
  ["locker", "_isofurniture_locker_se", 0.32, 4.4, 10],
  ["plant", "_isofurniture_plant", 0.4, 7.5, 6],
  ["desk_se", "_isoconsole_desk_se", 0.5, 9.1, 20, { phase: 400 }],
  ["chair", "_isofurniture_chair_sw", 2.0, 7.75, 10],
  ["table", "_isofurniture_table", 2.0, 8.9, 5],
  // centre : réacteur ; à droite : table holographique
  ["reactor", "_isoreactor_cyan", 3.5, 3.5, 14],
  ["holo", "_isoconsole_holo", 6.5, 2.5, 13],
  // fret : devant à gauche et devant à droite
  ["crate_metal", "_isocrate_metal", 3.4, 9.7, 14],
  ["crate_orange", "_isocrate_orange", 3.0, 10.7, 14],
  ["barrel", "_isocrate_barrel", 2.0, 10.3, 8],
  ["large", "_isocrate_large_48", 1.2, 11.8, 22],
  ["crate_green", "_isocrate_green", 2.4, 12.2, 14],
  ["large_blue", "_isocrate_large_blue_48", 10.3, 3.7, 22],
  ["stack", "_isocrate_stack_48", 9.1, 4.5, 14],
  ["toxic", "_isocrate_barrel_toxic", 11.0, 2.3, 8, { keep: "GglL" }],
  ["crate_orange", "_isocrate_orange", 11.9, 3.9, 14],
  ["rack", "_isoconsole_rack_sw", 13.4, 0.42, 13, { phase: 900 }],
]
const placed = PROPS.map(([key, src, i, j, depth, opts = {}]) => {
  const { w, h } = meta.scene.sprites[key] ? SIZE[typeof src === "string" ? src : src.day] : actorSprite(key, src, opts.keep)
  const [X, Y] = at(i, j)
  return { key, X, Y, w, h, depth, x: Math.round(X - w / 2), y: Math.round(Y + depth / 2 + 1 - h), phase: opts.phase }
}).sort((a, b) => a.Y - b.Y)

// Ombres portées au sol, décalées vers la droite (lumière en haut à gauche).
sprite("_shadows", { w: RW, h: RH }, (c) => {
  for (const p of placed) c.ellipse(Math.round(p.X + p.w * 0.16), Math.round(p.Y + 1), Math.round(p.w * 0.5), Math.max(2, Math.round(p.depth * 0.5)), "%")
})
const propActors = planeOf("props").actors
for (const p of placed) propActors.push({ sprite: p.key, x: p.x, y: p.y, ...(p.phase ? { phase: p.phase } : {}) })

// Drone en patrouille : il fait le tour d'un rectangle de dalles (2,5 × 2), tourné dans le sens de
// la marche, de face en descendant, de dos en remontant. Une image toutes les 100 ms, 2 px par image.
const ROUTE = [[6.75, 4.75, "sw"], [6.75, 6.75, "nw"], [4.25, 6.75, "ne"], [4.25, 4.75, "se"]]
const PAUSE = 3
const droneSteps = []
ROUTE.forEach(([i, j, facing], n) => {
  const [x0, y0] = at(i, j), [x1, y1] = at(ROUTE[(n + 1) % 4][0], ROUTE[(n + 1) % 4][1])
  const steps = Math.abs(x1 - x0) / 2
  for (let s = 0; s < PAUSE; s++) droneSteps.push([x0, y0, facing])
  for (let s = 0; s < steps; s++) droneSteps.push([x0 + ((x1 - x0) * s) / steps, y0 + ((y1 - y0) * s) / steps, facing])
})
const DX = Math.min(...droneSteps.map((s) => s[0])) - 7, DY = Math.min(...droneSteps.map((s) => s[1])) - 22
const DW = Math.max(...droneSteps.map((s) => s[0])) - 7 - DX + 15, DH = Math.max(...droneSteps.map((s) => s[1])) - 22 - DY + 24
for (const P of RP) {
  const model = P === "alert" ? "alert" : "white"
  anim(`_drone_${P}`, { w: DW, h: DH, frames: droneSteps.length, fps: 10 }, (c) => {
    const [x, y, facing] = droneSteps[c.frame]
    c.stamp(`_isodrone_${model}_${facing}`, Math.round(x) - 7 - DX, Math.round(y) - 22 - DY, { frame: (c.frame >> 1) % 6, swap: ambient(P, P === "alert" ? "royRCcw" : "royR") })
  })
}
meta.scene.sprites.drone = "_drone_{period}"
propActors.push({ sprite: "drone", x: DX, y: DY })

// ================================================================ 3. lueur des gyrophares (alerte)

// Deux nappes de lumière rouge autour des gyrophares, qui battent avec eux (4 images de 200 ms) ;
// elles ne débordent pas au-dessus des murs.
const inRoom = (x, y) => y >= CY - 54 + Math.abs(x - CX) / 2
const BEAT = [0.7, 1, 0.7, 0.35]
const hex2 = (v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")
anim("_alarm_glow", { w: RW, h: RH, frames: 4, fps: 5 }, (c) => {
  const k = BEAT[c.frame]
  for (const [side, n] of [["left", 7], ["right", 3]]) {
    const [wx, wy] = wallAt(side, n, 1)
    const x = wx + 8, y = wy + 24
    for (let py = y - 60; py <= y + 60; py++)
      for (let px = x - 60; px <= x + 60; px++) {
        const d = Math.hypot(px - x, py - y)
        if (d <= 60 && inRoom(px, py)) c.px(px, py, d <= 20 ? "#f0683f" + hex2(92 * k) : d <= 40 ? "#e2483f" + hex2(60 * k) : "#e2483f" + hex2(34 * k))
      }
  }
})
