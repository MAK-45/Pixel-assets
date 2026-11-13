include("../_palette.px.js")
include("_iso.px.js")

const meta = {
  title: "Pan de mur isométrique",
  description: "Pans de mur de station spatiale en vue isométrique 2:1, hauts de 56 px, sans contour : ils se raccordent bord à bord et se posent sur l'arête arrière des dalles isofloor (un pan de 16 px par dalle). Chaque modèle existe pour le mur de gauche (à l'ombre) et le mur de droite (éclairé) : panneau, panneau à colonne lumineuse, grille d'aération, tuyaux, hublot panoramique vitré (3 dalles, vitre transparente : le fond se voit à travers), porte coulissante (2 dalles : fermée, ouverte, ou cycle animé d'ouverture), écran mural animé (2 dalles) et gyrophare d'alerte (éteint ou clignotant).",
  tags: ["isometric", "wall", "scifi", "space-station", "spaceship", "panel", "door", "window", "screen", "tileset"],
  variants: {},
}

const SIDES = { left: "Mur de gauche", right: "Mur de droite" }
// Mur de droite : miroir du mur de gauche, un cran plus clair (il fait face à la lumière).
const LIT = { "[": "]", "]": "S", S: "s" }

// ---------------------------------------------------------------- habillage commun

// Chapeau (épaisseur du mur vue du dessus), bandeau haut, plinthe avec son filet lumineux.
const shell = ({ v }) => {
  if (v < 2) return "s"
  if (v === 2) return "S"
  if (v === 3) return "d"
  if (v < 8) return v === 5 ? "]" : "["
  if (v === 46) return "S"
  if (v === 47) return "d"
  if (v >= 48) return v === 51 ? "0" : v === 52 ? "9" : "["
  return null
}
// Panneau courant : joint tous les 16 px, cadre en creux (ombre en haut à gauche, filet clair en bas à droite).
const panel = (t) => {
  const k = shell(t)
  if (k) return k
  const s = t.u % 16, { v } = t
  if (s === 15) return "["
  if (s === 0) return "S"
  if (s >= 3 && s <= 12 && v >= 12 && v <= 42) {
    if (v === 12 || s === 3) return "["
    if (v === 42 || s === 12) return "S"
  }
  return "]"
}
const inside = (t, u0, v0, u1, v1) => t.u >= u0 && t.u <= u1 && t.v >= v0 && t.v <= v1

// ---------------------------------------------------------------- modèles (dessinés pour le mur de gauche)

const MODELS = {
  panel: { n: 1, label: "Panneau", draw: () => isoWall(1, panel) },

  // Colonne lumineuse turquoise dans le creux du panneau.
  light: {
    n: 1, label: "Panneau à colonne lumineuse", tags: ["glow", "lamp"],
    draw: () => isoWall(1, (t) => {
      if (inside(t, 6, 14, 9, 40)) return t.u === 6 || t.u === 9 ? "0" : t.v < 16 || t.v > 38 ? "0" : "+"
      if (inside(t, 5, 13, 10, 41)) return "d"
      return panel(t)
    }),
  },

  // Grille d'aération en bas du panneau, étiquette de danger au-dessus.
  vent: {
    n: 1, label: "Grille d'aération", tags: ["grille"],
    draw: () => isoWall(1, (t) => {
      if (inside(t, 4, 28, 11, 40)) return (t.v - 28) % 3 === 0 ? "S" : (t.v - 28) % 3 === 1 ? "d" : "k"
      if (inside(t, 3, 27, 12, 41)) return "d"
      if (inside(t, 5, 15, 10, 19)) return (t.u + t.v) % 4 < 2 ? "y" : "k"
      return panel(t)
    }),
  },

  // Deux tuyaux le long du mur (acier, puis cuivre orangé), colliers tous les 16 px, volant de vanne.
  pipes: {
    n: 1, label: "Tuyaux", tags: ["pipe", "valve"],
    draw: () => isoWall(1, (t) => {
      const s = t.u % 16, { v } = t
      const pipe = (v0, keys) => {
        if (v < v0 || v > v0 + 4) return null
        if (s === 3 || s === 4) return v === v0 ? "m" : "d"
        return keys[v - v0]
      }
      if (inside(t, 9, 30, 13, 34)) {
        const dx = t.u - 11, dy = v - 32, r = dx * dx + dy * dy
        if (r === 0) return "y"
        if (r <= 4 && r >= 3) return "r"
        if (r < 3) return "o"
      }
      if (t.u === 11 && v > 25 && v < 30) return "m"
      return pipe(13, ["C", "c", "c", "m", "d"]) ?? pipe(21, ["y", "o", "o", "r", "d"]) ?? (shell(t) || (s === 15 ? "[" : s === 0 ? "S" : "]"))
    }),
  },

  // Hublot panoramique : vitre transparente (teinte et reflets translucides), cadre épais à coins coupés.
  window: {
    n: 3, label: "Hublot panoramique", tags: ["glass", "porthole", "space-view"],
    draw: () => isoWall(3, (t) => {
      const { u, v } = t
      const cut = (m) => Math.min(u - (3 + m), 44 - m - u) + Math.min(v - (10 + m), 40 - m - v) < 3
      if (inside(t, 6, 13, 41, 37) && !cut(3)) {
        const g = (u + v * 2) % 34
        return g < 3 ? "{" : g > 8 && g < 11 ? "{" : "}"
      }
      if (inside(t, 5, 12, 42, 38) && !cut(2)) return v === 12 || u === 5 ? "d" : "S"
      if (inside(t, 3, 10, 44, 40) && !cut(0)) return v === 10 || u === 3 ? "S" : v === 40 || u === 44 ? "d" : "["
      return panel({ ...t, u: 1 })
    }),
  },
}

// Porte coulissante à deux vantaux (2 dalles) : `open` = retrait de chaque vantail, de 0 à 9 px.
const door = (open) => isoWall(2, (t) => {
  const { u, v } = t
  if (inside(t, 6, 13, 25, 55)) {
    const leaf = u <= 15 - open || u >= 16 + open
    if (!leaf) {
      // couloir : noir, sol au fond, filet lumineux
      if (v >= 53) return "<"
      if (v === 49) return "9"
      return v > 44 ? "d" : "k"
    }
    const lu = u <= 15 - open ? u + open : u - open // position sur le vantail fermé
    if (lu === 15) return "d"
    if (lu === 16) return "]"
    if (v >= 44 && v <= 47) return (lu + v) % 4 < 2 ? "y" : "k"
    if (v >= 19 && v <= 25 && ((lu >= 9 && lu <= 12) || (lu >= 19 && lu <= 22))) return v === 19 ? "d" : lu === 9 || lu === 19 ? "8" : "9"
    if (lu === 6 || v === 13) return "s"
    return lu === 25 || v === 55 ? "]" : "S"
  }
  if (inside(t, 14, 9, 17, 10)) return open ? "L" : "l" // voyant du linteau
  if (inside(t, 4, 11, 27, 55)) return u === 4 || v === 11 ? "S" : u === 27 ? "d" : "["
  if (inside(t, 3, 8, 28, 55)) return v === 8 || u === 3 ? "S" : "d"
  return panel({ ...t, u: 1 })
})

// Écran mural (2 dalles) : histogramme qui bouge, lignes de texte qui défilent, voyant qui clignote.
const BARS = [[3, 6, 4, 8, 5], [4, 5, 6, 7, 3], [5, 7, 5, 4, 4], [3, 8, 7, 5, 6], [4, 6, 8, 3, 7], [6, 4, 6, 5, 8], [5, 5, 4, 7, 6], [4, 7, 3, 8, 5]]
const LINES = [7, 4, 6, 3, 7, 5, 2, 6]
const screen = (f) => isoWall(2, (t) => {
  const { u, v } = t
  if (inside(t, 5, 13, 26, 34)) {
    // histogramme à gauche
    if (u >= 6 && u <= 15 && v >= 23) {
      const i = (u - 6) >> 1
      if ((u - 6) % 2 === 0 && 33 - v < BARS[f][i]) return 33 - v === BARS[f][i] - 1 ? "+" : "0"
    }
    // courbe au-dessus
    if (u >= 6 && u <= 15 && v === 17 + Math.round(Math.sin((u + f * 2) * 0.8) * 2)) return "0"
    // texte à droite : une ligne sur deux, la ligne courante plus claire
    if (u >= 18 && u <= 25 && (v - 15) % 3 === 0 && v <= 33) {
      const row = (v - 15) / 3, len = LINES[(row + f) % 8]
      if (u - 18 < len) return row === 6 - (f % 7) ? "+" : "9"
    }
    return "8"
  }
  if (inside(t, 4, 12, 27, 35)) return v === 12 || u === 4 ? "m" : "k"
  if (inside(t, 3, 11, 28, 36)) return "d"
  if (inside(t, 24, 38, 25, 39)) return f % 4 < 2 ? "o" : "R" // voyant
  if (inside(t, 6, 38, 20, 39)) return (u - 6) % 3 === 2 ? null ?? panel({ ...t, u: 1 }) : "d" // touches
  return panel({ ...t, u: 1 })
})

// Gyrophare d'alerte sur son panneau : `f` = -1 éteint, sinon image du clignotement (0 à 3).
const ALARM = [["r", "o", "y"], ["o", "y", "Y"], ["r", "o", "y"], ["R", "r", "o"]]
const alarm = (f) => isoWall(1, (t) => {
  const { u, v } = t
  const keys = f < 0 ? ["R", "R", "r"] : ALARM[f]
  if (inside(t, 5, 15, 10, 21)) {
    if (v === 21) return "d"
    if (v === 15 && (u === 5 || u === 10)) return panel(t)
    // dôme : reflet qui tourne d'un bord à l'autre
    const hot = f < 0 ? 6 : [6, 7, 9, 8][f]
    return u === hot && v < 19 ? keys[2] : v < 17 || Math.abs(u - hot) < 2 ? keys[1] : keys[0]
  }
  if (inside(t, 4, 21, 11, 23)) return v === 21 ? "m" : "d"
  if (inside(t, 5, 27, 10, 29)) return (u + v) % 4 < 2 ? "y" : "k" // étiquette de danger
  return panel(t)
})

// ---------------------------------------------------------------- variantes : chaque modèle × 2 côtés

const sideOpts = (side) => (side === "right" ? { flip: "x", swap: LIT } : {})
const declare = (key, side, label, n, extra = {}) => {
  meta.variants[`${key}_${side}`] = { label: `${label} – ${SIDES[side].toLowerCase()}`, props: { side, ...extra.props }, ...(extra.tags ? { tags: extra.tags } : {}) }
  return { ...wallSize(n), ...sideOpts(side) }
}
for (const side of Object.keys(SIDES)) {
  for (const [key, m] of Object.entries(MODELS))
    sprite(`isowall_${key}_${side}`, declare(key, side, m.label, m.n, { props: { shape: key }, tags: m.tags }), m.draw())

  sprite(`isowall_door_${side}`, declare("door", side, "Porte coulissante fermée", 2, { props: { shape: "door", state: "closed" } }), door(0))
  sprite(`isowall_door_open_${side}`, declare("door_open", side, "Porte coulissante ouverte", 2, { props: { shape: "door", state: "open" } }), door(9))
  // Cycle : fermée 5 s, s'ouvre, reste ouverte 1,5 s, se referme.
  anim(`isowall_door_cycle_${side}`, declare("door_cycle", side, "Porte coulissante – cycle animé", 2, { props: { shape: "door", state: "cycle" }, tags: ["animated"] }),
    frame({ ms: 5000 }, door(0)), frame({ ms: 100 }, door(3)), frame({ ms: 100 }, door(6)),
    frame({ ms: 1500 }, door(9)), frame({ ms: 100 }, door(6)), frame({ ms: 100 }, door(3)))
  sprite(`isowall_alarm_off_${side}`, declare("alarm_off", side, "Gyrophare d'alerte éteint", 1, { props: { shape: "alarm", state: "off" }, tags: ["beacon", "siren"] }), alarm(-1))
  anim(`isowall_alarm_${side}`, { ...declare("alarm", side, "Gyrophare d'alerte – clignotement animé", 1, { props: { shape: "alarm", state: "on" }, tags: ["beacon", "siren", "animated", "warning"] }), frames: 4, fps: 5 },
    (c) => alarm(c.frame)(c))
  anim(`isowall_screen_${side}`, { ...declare("screen", side, "Écran mural animé", 2, { props: { shape: "screen" }, tags: ["animated", "monitor", "glow"] }), frames: 8, fps: 5 },
    (c) => screen(c.frame)(c))
}

sheet("isowalls", ["isowall_*"], { pad: 2 })
