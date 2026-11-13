include("../_palette.px.js")
include("_iso.px.js")

const meta = {
  title: "Dalle de sol isométrique",
  description: "Dalles de sol de station spatiale en vue isométrique 2:1 (32 × 15 px, sans contour : elles se raccordent bord à bord avec un pas de ±16, +8 px). Plaques de métal sombre, claire et bleue, grille, bande de danger, trappe, circuit imprimé lumineux et rail de lumière turquoise dans les deux sens, avec son croisement (fixe ou animé : une impulsion à décaler de dalle en dalle pour faire courir la lumière).",
  tags: ["isometric", "floor", "tile", "scifi", "space-station", "metal", "tileset", "spaceship"],
  variants: {
    plate: { label: "Plaque de métal sombre", props: { shape: "plate", color: "dark" } },
    plate_light: { label: "Plaque de métal claire", props: { shape: "plate", color: "light" } },
    plate_blue: { label: "Plaque d'acier bleu", props: { shape: "plate", color: "blue" } },
    grate: { label: "Grille d'aération", props: { shape: "grate", color: "dark" }, tags: ["vent", "grid"] },
    hazard: { label: "Plaque à bande de danger", props: { shape: "hazard", color: "yellow" }, tags: ["warning", "stripes"] },
    hatch: { label: "Trappe d'accès", props: { shape: "hatch", color: "light" }, tags: ["trapdoor"] },
    circuit: { label: "Plaque à circuit lumineux", props: { shape: "circuit", color: "cyan" }, tags: ["glow", "tech"] },
    light: { label: "Rail de lumière", props: { shape: "light", color: "cyan", state: "on" }, tags: ["glow", "strip"] },
    light_cross: { label: "Rail de lumière (autre sens)", props: { shape: "light", color: "cyan", state: "on" }, tags: ["glow", "strip"] },
    light_node: { label: "Croisement de rails de lumière", props: { shape: "light", color: "cyan", state: "on" }, tags: ["glow", "strip", "junction"] },
    light_pulse: { label: "Rail de lumière – impulsion animée", props: { shape: "light", color: "cyan", state: "pulse" }, tags: ["glow", "strip", "animated"] },
    light_cross_pulse: { label: "Rail de lumière (autre sens) – impulsion animée", props: { shape: "light", color: "cyan", state: "pulse" }, tags: ["glow", "strip", "animated"] },
  },
}

// Plaque : corps uni, joint sombre sur les deux arêtes du bas, filet clair sur l'arête du haut à gauche
// (côté lumière), un rivet près de chaque coin.
const RIVETS = [[2.6, 2.6], [13.4, 2.6], [2.6, 13.4], [13.4, 13.4]]
const rivet = (p, q) => RIVETS.some(([a, b]) => Math.abs(p - a) < 0.55 && Math.abs(q - b) < 0.55)
const plateKey = (t, base, hi, lo) => (t.e === "ll" || t.e === "lr" ? lo : t.e === "ul" ? hi : rivet(t.p, t.q) ? lo : base)
const plate = (base, hi, lo) => isoTile((t) => plateKey(t, base, hi, lo))

sprite("isofloor_plate", { w: 32, h: 15 }, plate("<", "m", "d"))
sprite("isofloor_plate_light", { w: 32, h: 15 }, plate("m", ">", "<"))
sprite("isofloor_plate_blue", { w: 32, h: 15 }, plate("[", "]", "d"))

// Grille : cadre de plaque, barreaux clairs sur fond noir le long de la dalle.
sprite("isofloor_grate", { w: 32, h: 15 }, isoTile((t) => {
  if (t.d < 2.2) return plateKey(t, "<", "m", "d")
  if (t.d < 3) return "d"
  return Math.floor(t.p / 1.5) % 2 ? "k" : Math.abs(t.q - 8) < 0.6 ? "c" : ">"
}))

// Danger : liseré de tirets jaunes et noirs le long des quatre arêtes, plaque au centre.
sprite("isofloor_hazard", { w: 32, h: 15 }, isoTile((t) => {
  if (t.e === "ll" || t.e === "lr") return "d"
  if (t.d < 2.7) {
    const along = Math.min(t.p, 16 - t.p) < Math.min(t.q, 16 - t.q) ? t.q : t.p
    return Math.floor(along / 2) % 2 ? "y" : "k"
  }
  return t.d < 3.5 ? "d" : "<"
}))

// Trappe : panneau clair encastré, charnières à l'arrière, poignée à l'avant.
sprite("isofloor_hatch", { w: 32, h: 15 }, isoTile((t) => {
  if (t.d < 2.4) return plateKey(t, "<", "m", "d")
  if (t.d < 3.2) return "d"
  if (t.p > 11.5 && t.p < 12.6 && t.q > 6 && t.q < 10) return "C"
  if (t.p < 4.4 && (Math.abs(t.q - 6) < 0.8 || Math.abs(t.q - 10) < 0.8)) return "d"
  return t.p + t.q < 13 ? ">" : "m"
}))

// Circuit : pistes turquoise sous la plaque, pastilles claires aux croisements.
sprite("isofloor_circuit", { w: 32, h: 15 }, isoTile((t) => {
  if (t.e) return plateKey(t, "<", "m", "d")
  const on = (v, at) => Math.abs(v - at) < 0.55
  const node = (a, b) => Math.abs(t.p - a) < 0.8 && Math.abs(t.q - b) < 0.8
  if (node(5, 5) || node(11, 9) || node(5, 12)) return "+"
  if ((on(t.p, 5) && t.q > 5) || (on(t.q, 5) && t.p > 5) || (on(t.q, 9) && t.p > 5 && t.p < 11) || (on(t.p, 11) && t.q > 9)) return "0"
  if (on(t.q, 12) && t.p < 5) return "9"
  return "<"
}))

// Rail de lumière : bande encastrée au milieu de la dalle. `along` = "p" (le rail file vers le bas à
// gauche) ou "q" (vers le bas à droite) ; keys = [bord, lumière, cœur].
const rail = (along, keys) => isoTile((t) => {
  const v = along === "p" ? t.p : t.q
  const off = Math.abs(v - 8)
  if (off < 0.9) return keys[2]
  if (off < 1.9) return keys[1]
  if (off < 2.8) return keys[0]
  return plateKey(t, "<", "m", "d")
})
// Croisement de deux rails (pastille claire au centre).
const node = (keys) => isoTile((t) => {
  const off = Math.min(Math.abs(t.p - 8), Math.abs(t.q - 8)), far = Math.max(Math.abs(t.p - 8), Math.abs(t.q - 8))
  if (far < 1.3) return "w"
  if (off < 0.9) return keys[2]
  if (off < 1.9) return keys[1]
  if (off < 2.8) return keys[0]
  return plateKey(t, "<", "m", "d")
})
sprite("isofloor_light_node", { w: 32, h: 15 }, node(["9", "0", "+"]))
const RAIL = [["d", "9", "0"], ["d", "9", "0"], ["9", "0", "+"], ["0", "+", "w"], ["9", "0", "+"], ["d", "9", "0"]]
for (const [name, along] of [["light", "p"], ["light_cross", "q"]]) {
  sprite(`isofloor_${name}`, { w: 32, h: 15 }, rail(along, ["9", "0", "+"]))
  // Impulsion : le rail s'allume, sature puis retombe (6 images de 200 ms).
  anim(`isofloor_${name}_pulse`, { w: 32, h: 15, frames: 6, fps: 5 }, (c) => rail(along, RAIL[c.frame])(c))
}

sheet("isofloors", ["isofloor_*"], { pad: 2 })
