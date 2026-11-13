include("../_palette.px.js")
include("_iso.px.js")

const meta = {
  title: "Console isométrique",
  description: "Postes informatiques de station spatiale en vue isométrique 2:1, tous animés : pupitre de commande avec moniteur (courbe qui défile, voyants), baie de serveurs aux diodes qui clignotent et table holographique où tourne une planète. Pupitre et baie existent tournés vers le bas à gauche (sw) ou vers le bas à droite (se) ; le pupitre a aussi un état d'alerte (écran orange). La table holographique existe éteinte.",
  tags: ["isometric", "console", "computer", "terminal", "server", "hologram", "scifi", "space-station", "animated", "furniture"],
  variants: {
    desk_sw: { label: "Pupitre – tourné vers le bas à gauche", props: { shape: "desk", facing: "sw", state: "on" } },
    desk_se: { label: "Pupitre – tourné vers le bas à droite", props: { shape: "desk", facing: "se", state: "on" } },
    desk_alert_sw: { label: "Pupitre en alerte – vers le bas à gauche", props: { shape: "desk", facing: "sw", state: "alert" }, tags: ["warning"] },
    desk_alert_se: { label: "Pupitre en alerte – vers le bas à droite", props: { shape: "desk", facing: "se", state: "alert" }, tags: ["warning"] },
    rack_sw: { label: "Baie de serveurs – vers le bas à gauche", props: { shape: "rack", facing: "sw", state: "on" }, tags: ["server", "leds"] },
    rack_se: { label: "Baie de serveurs – vers le bas à droite", props: { shape: "rack", facing: "se", state: "on" }, tags: ["server", "leds"] },
    holo: { label: "Table holographique – planète qui tourne", props: { shape: "holo", state: "on" }, tags: ["planet", "glow"] },
    holo_off: { label: "Table holographique éteinte", props: { shape: "holo", state: "off" } },
  },
}

// Tourné vers le bas à droite : miroir, faces claire et sombre interverties (la lumière reste à gauche).
const SE = { flip: "x", swap: { S: "]", "]": "S", ">": "<", "<": ">" } }
// Alerte : l'écran turquoise passe à l'orange.
const ALERT = { 8: "R", 9: "r", 0: "o", "+": "y" }

// ---------------------------------------------------------------- pupitre

const desk = (f) => (c) => {
  const b = isoBox(0, 14, 28, 12, 11)
  b.fill(c, "s", "S", "]", "w")
  // clavier encastré dans le dessus
  b.top(c, ({ p, q }) => {
    if (p < 3.5 || p > 24.5 || q < 5.6 || q > 10.4) return null
    if (p < 4.5 || p > 23.5 || q < 6.4 || q > 9.6) return "["
    return Math.floor(p) % 2 === 0 && Math.floor(q * 1.3) % 2 === 0 ? "s" : "]"
  })
  // façade : grille d'aération, trappe avec trois voyants, socle
  b.left(c, ({ u, v }) => {
    if (v >= 9) return u === 27 ? "]" : "["
    if (u >= 3 && u <= 10 && v >= 2 && v <= 6) return v % 2 ? "]" : "["
    if (u >= 14 && u <= 24 && v >= 2 && v <= 6) {
      if (v === 4 && u === 16) return f % 3 === 0 ? "L" : "l"
      if (v === 4 && u === 19) return f % 2 ? "o" : "r"
      if (v === 4 && u === 22) return "0"
      return v === 2 || u === 14 ? "[" : v === 6 || u === 24 ? "s" : null
    }
    return null
  })
  b.right(c, ({ v, u }) => (v >= 9 ? "[" : u === 6 && v > 1 && v < 7 ? "[" : null))
  // moniteur debout à l'arrière du pupitre, écran vers l'avant
  const m = isoBox(13, 2, 20, 2, 14)
  m.fill(c, "m", "d", "k")
  m.left(c, ({ u, v }) => {
    if (u < 1 || u > 18 || v < 1 || v > 11) return null
    if (v === 2 && u >= 2 && u <= 8) return "9"
    if (v === 2 && u === 16) return f % 2 ? "+" : "9"
    if (u >= 2 && u <= 17 && v === 7 + Math.round(Math.sin((u + f * 2.1) * 0.75) * 2.4)) return "0"
    if (v === 11 && u >= 2 && u < 2 + ((f * 3) % 16)) return "9"
    return "8"
  })
  c.px(...m.L(0, 0), "m") // reflet du coin de l'écran
}
for (const [key, opts] of [["desk_sw", {}], ["desk_se", SE], ["desk_alert_sw", { swap: ALERT }], ["desk_alert_se", { flip: "x", swap: { ...SE.swap, ...ALERT } }]])
  anim(`isoconsole_${key}`, { w: 40, h: 44, frames: 6, fps: 5, outline: "k", ...opts }, (c) => desk(c.frame)(c))

// ---------------------------------------------------------------- baie de serveurs

const LEDS = ["0", "l", "0", "o", "l"], DIM = ["9", "g", "9", "r", "g"]
const rack = (f) => (c) => {
  const b = isoBox(0, 0, 14, 12, 34)
  b.fill(c, "c", ">", "<", "C")
  // façade : cinq tiroirs, deux diodes et une poignée chacun
  b.left(c, ({ u, v }) => {
    if (u < 1 || u > 12 || v < 2 || v > 30) return null
    const row = Math.floor((v - 2) / 6), rv = (v - 2) % 6
    if (rv === 5) return null
    if (rv === 2 && (u === 2 || u === 4)) {
      const on = (row * 5 + u * 3 + f * (row % 2 ? 2 : 3)) % 4 < 2
      return on ? LEDS[row] : DIM[row]
    }
    if (rv === 3 && u >= 7 && u <= 11) return "m"
    return rv === 0 ? "k" : "d"
  })
  // côté : ouïes de ventilation
  b.right(c, ({ u, v }) => (u >= 2 && u <= 9 && v >= 4 && v <= 16 && v % 3 === 1 ? "d" : v >= 31 ? "d" : null))
  b.left(c, ({ v }) => (v >= 32 ? "d" : null))
}
for (const [key, opts] of [["rack_sw", {}], ["rack_se", SE]])
  anim(`isoconsole_${key}`, { w: 26, h: 46, frames: 6, fps: 5, outline: "k", ...opts }, (c) => rack(c.frame)(c))

// ---------------------------------------------------------------- table holographique

// Socle rond : émetteur turquoise au centre du plateau (`on` = allumé).
const table = (on) => (c) => {
  isoCyl(c, 12, 6, 12, 6, { top: "s", lit: "S", body: "]", dark: "[" })
  c.hline(1, 10, 23, "[")
  c.ellipse(12, 6, 8, 4, "d")
  c.ellipse(12, 6, 7, 3, on ? "9" : "<")
  c.ellipse(12, 6, 4, 2, on ? "0" : "m")
  if (on) c.hline(11, 6, 3, "+")
}
sprite("_table_on", { w: 25, h: 19, outline: "k" }, table(true))
sprite("isoconsole_holo_off", { w: 25, h: 19, outline: "k" }, table(false))

// Hologramme (sans contour) : globe en fil de fer qui tourne, lune en orbite, faisceau et halo translucides.
anim("isoconsole_holo", { w: 27, h: 44, frames: 12, fps: 10 }, (c) => {
  const f = c.frame, k = c.phase * Math.PI * 2
  const cx = 13, cy = 12, r = 8
  // faisceau : du plateau vers le globe, il vacille
  for (let y = cy + r - 2; y < 29; y++) {
    const half = Math.round(3 + ((29 - y) / (29 - cy - r + 2)) * 4)
    for (let x = cx - half; x <= cx + half; x++) if ((x + y + f) % 3) c.px(x, y, ";")
  }
  c.stamp("_table_on", 0, 23)
  // lune derrière le globe
  const mx = Math.round(cx + Math.cos(k) * 12), my = Math.round(cy + 1 + Math.sin(k) * 3)
  if (Math.sin(k) < 0) c.px(mx, my, "0")
  // globe : halo, corps translucide, méridiens qui défilent, parallèles
  c.circ(cx, cy, r + 2, ";")
  c.circ(cx, cy, r, ":")
  c.ring(cx, cy, r, "0")
  for (let i = 0; i < 3; i++) {
    const a = (k * 2) / 6 + (i * Math.PI) / 3
    const rx = Math.round(Math.abs(Math.cos(a)) * r)
    if (rx >= 2) c.ellipse(cx, cy, rx, r, "9", true)
    else c.vline(cx, cy - r, r * 2 + 1, "9")
  }
  c.hline(cx - r, cy, r * 2 + 1, "0")
  c.ellipse(cx, cy - 4, 7, 1, "9", true)
  c.ellipse(cx, cy + 4, 7, 1, "9", true)
  c.ring(cx, cy, r, "0")
  c.px(cx - 4, cy - 5, "+"); c.px(cx - 5, cy - 4, "+")
  // ligne de balayage
  const sy = cy - r + ((f * 3) % (r * 2))
  c.recolor({ 9: "0", ":": "0" }, (x, y) => y === sy)
  // lune devant le globe
  if (Math.sin(k) >= 0) { c.px(mx, my, "+"); c.px(mx + 1, my, "0") }
})

sheet("isoconsoles", ["isoconsole_*"], { pad: 2 })
