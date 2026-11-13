include("../_palette.px.js")
include("_iso.px.js")

const meta = {
  title: "Capsule de stase isométrique",
  description: "Capsules de stase de laboratoire spatial en vue isométrique 2:1 (24 × 48 px) : tube de verre rempli d'un liquide luminescent entre un socle et un chapeau de métal. Versions animées (bulles qui montent, 10 images de 200 ms) en turquoise, vert et violet, vides ou avec un spécimen qui flotte, plus une capsule éteinte et vide.",
  tags: ["isometric", "pod", "stasis", "cryo", "tube", "tank", "laboratory", "scifi", "space-station", "animated", "glow"],
  variants: {
    cyan: { label: "Capsule turquoise – bulles animées", props: { color: "cyan", content: "empty", state: "on" } },
    green: { label: "Capsule verte – bulles animées", props: { color: "green", content: "empty", state: "on" } },
    violet: { label: "Capsule violette – bulles animées", props: { color: "violet", content: "empty", state: "on" } },
    specimen_cyan: { label: "Capsule turquoise avec spécimen", props: { color: "cyan", content: "specimen", state: "on" }, tags: ["alien", "creature"] },
    specimen_green: { label: "Capsule verte avec spécimen", props: { color: "green", content: "specimen", state: "on" }, tags: ["alien", "creature"] },
    specimen_violet: { label: "Capsule violette avec spécimen", props: { color: "violet", content: "specimen", state: "on" }, tags: ["alien", "creature"] },
    off: { label: "Capsule éteinte et vide", props: { color: "gray", content: "empty", state: "off" } },
  },
}

// Liquide en turquoise (8 sombre, 9 corps, 0 clair, + reflet) ; les autres couleurs sont des swaps.
const LIQUID = {
  green: { 8: "G", 9: "g", 0: "l", "+": "L" },
  violet: { 8: "V", 9: "v", 0: "x", "+": "Z" },
}
const METAL = { top: "C", lit: "C", body: "c", dark: "m" }
const BUBBLES = [[5, 0, 1], [8, 9, 2], [12, 4, 1], [14, 13, 2], [10, 16, 1]] // x, départ, vitesse

const pod = (f, frames, specimen, on = true) => (c) => {
  // socle, puis tube posé dessus
  isoCyl(c, 10, 34, 10, 5, METAL)
  c.ellipse(10, 34, 8, 4, "d")
  c.rect(2, 9, 17, 25, "9")
  c.ellipse(10, 34, 8, 4, "9")
  c.recolor({ 9: "8" }, (x, y) => x >= 15 && y > 8 && y < 39)
  c.recolor({ 9: "0" }, (x, y) => (x === 3 || x === 4) && y > 8 && y < 37)
  c.vline(4, 16, 9, "+")
  c.vline(17, 14, 20, "9") // reflet du bord droit du verre
  if (specimen) {
    // petit être recroquevillé : grosse tête, corps courbe, queue
    const b = Math.round(Math.sin((f / frames) * Math.PI * 2))
    c.ellipse(10, 19 + b, 3, 3, "8")
    c.rect(9, 22 + b, 3, 5, "8")
    c.px(8, 24 + b, "8"); c.px(12, 23 + b, "8"); c.px(12, 27 + b, "8"); c.px(13, 28 + b, "8")
    c.px(8, 19 + b, "+"); c.px(11, 19 + b, "0")
  }
  if (on) for (const [x, start, speed] of BUBBLES) {
    const y = 33 - ((start + f * 2 * speed) % 20)
    c.px(x, y, "+")
    if (speed === 1) c.px(x, y + 3, "0")
  }
  // chapeau, voyant, afficheur du socle
  isoCyl(c, 10, 5, 10, 4, METAL)
  c.ellipse(10, 5, 6, 3, "c"); c.ellipse(10, 5, 3, 1, "m")
  c.hline(1, 12, 19, "m")
  c.px(6, 13, on && f % 5 < 3 ? "L" : "g")
  c.hline(7, 42, 6, "d")
  if (on) c.hline(8, 42, 2 + (f % 3), "0")
  c.hline(1, 43, 19, "m")
}

const FRAMES = 10
const tube = (key, specimen, swap) =>
  anim(`isopod_${key}`, { w: 21, h: 45, frames: FRAMES, fps: 5, outline: "k", ...(swap ? { swap } : {}) }, (c) => pod(c.frame, FRAMES, specimen)(c))
tube("cyan", false)
tube("specimen_cyan", true)
for (const [color, swap] of Object.entries(LIQUID)) { tube(color, false, swap); tube(`specimen_${color}`, true, swap) }
sprite("isopod_off", { w: 21, h: 45, outline: "k", swap: { 9: "<", 8: "d", 0: "m", "+": ">" } }, pod(0, FRAMES, false, false))

sheet("isopods", ["isopod_*"], { pad: 2 })
