// Outils communs des familles isométriques de science-fiction (iso*).
// Fichier commençant par « _ » : ignoré par le build, inclus après la palette :
//   include("../_palette.px.js")
//   include("_iso.px.js")
// Projection 2:1 : un pas de dalle vaut (±16, +8) px à l'écran. Lumière en haut à gauche : dessus
// clair, face gauche moyenne, face droite sombre. Les dalles et les murs n'ont pas de contour (ils se
// raccordent bord à bord) ; les objets posés portent le contour k de la maison.

// ================================================================ dalle de sol 32 × 15

// Colonne x d'une dalle : première ligne (yU) et ligne après la dernière (yL). Deux dalles voisines
// (décalées de ±16, +8) se touchent sans trou ni recouvrement.
const tileYU = (x) => (x < 16 ? (15 - x) >> 1 : (x - 16) >> 1)
const tileYL = (x) => (x < 16 ? 8 + (x >> 1) : 8 + ((31 - x) >> 1))
// Peint une dalle pixel par pixel : fn({ p, q, d, e, x, y }) renvoie une clé (ou rien).
//   p, q : position sur la dalle, de 0 à 16 (p vers le bas à droite, q vers le bas à gauche)
//   d    : distance au bord le plus proche (0 au bord, 8 au centre)
//   e    : bord touché, "ul" / "ur" (arêtes du haut) ou "ll" / "lr" (arêtes du bas), sinon ""
const isoTile = (fn) => (c) => {
  for (let x = 0; x < 32; x++)
    for (let y = tileYU(x); y < tileYL(x); y++) {
      const dx = (x + 0.5 - 16) / 2, dy = y + 0.75
      const p = dy + dx, q = dy - dx
      const low = y === tileYL(x) - 1, up = y === tileYU(x)
      const e = low ? (x < 16 ? "ll" : "lr") : up ? (x < 16 ? "ul" : "ur") : ""
      const k = fn({ p, q, d: Math.min(p, q, 16 - p, 16 - q), e, x, y, c })
      if (k) c.px(x, y, k)
    }
}

// ================================================================ pan de mur (hauteur 56)

const WALL_H = 56
// Mur de gauche (il monte vers la droite, jusqu'à l'angle du fond) large de n dalles : le point
// (u, v) du mur (u = 0 à 16n-1 le long du mur, v = 0 en haut à 55 au ras du sol) tombe sur le pixel
// (u, v + wallTop(u)). Taille du sprite : 16n × (8n + 55). Le mur de droite est son miroir.
const wallSize = (n) => ({ w: 16 * n, h: 8 * n + WALL_H - 1 })
const isoWall = (n, fn) => (c) => {
  const W = 16 * n
  for (let u = 0; u < W; u++) {
    const top = (W - 1 - u) >> 1
    for (let v = 0; v < WALL_H; v++) {
      const k = fn({ u, v, W, c })
      if (k) c.px(u, top + v, k)
    }
  }
}

// ================================================================ boîte isométrique

// Boîte posée en (ox, oy) (coin haut-gauche de son encombrement) : a = largeur à l'écran de la face
// gauche, b = largeur de la face droite (pairs), h = hauteur. Encombrement : (a + b) × ((a + b) / 2 + h - 1).
const isoBox = (ox, oy, a, b, h) => {
  const yU = (x) => (x < b ? (b - 1 - x) >> 1 : (x - b) >> 1)
  const yL = (x) => (x < a ? (b >> 1) + (x >> 1) : (a >> 1) + ((a + b - 1 - x) >> 1))
  const B = {
    a, b, h, w: a + b, H: ((a + b) >> 1) + h - 1, ox, oy,
    // points des faces : gauche (u = 0 à a-1, v = 0 à h-1), droite (u = 0 à b-1), dessus (p = 0 à a vers le
    // bas à droite, q = 0 à b vers le bas à gauche, comme une dalle)
    L: (u, v) => [ox + u, oy + yL(u) + v],
    R: (u, v) => [ox + a + u, oy + yL(a + u) + v],
    T: (p, q) => [ox + Math.round(b + p - q - 0.5), oy + Math.floor((p + q) / 2)],
    // remplissages
    top: (c, fn) => {
      for (let x = 0; x < a + b; x++)
        for (let y = yU(x); y < yL(x); y++) {
          const dx = (x + 0.5 - b) / 2, dy = y + 0.75
          const k = typeof fn === "string" ? fn : fn({ x, y, p: dy + dx, q: dy - dx, rim: y === yL(x) - 1, back: y === yU(x), left: x < a })
          if (k) c.px(ox + x, oy + y, k)
        }
      return B
    },
    left: (c, fn) => {
      for (let u = 0; u < a; u++)
        for (let v = 0; v < h; v++) {
          const k = typeof fn === "string" ? fn : fn({ u, v, w: a, h })
          if (k) c.px(ox + u, oy + yL(u) + v, k)
        }
      return B
    },
    right: (c, fn) => {
      for (let u = 0; u < b; u++)
        for (let v = 0; v < h; v++) {
          const k = typeof fn === "string" ? fn : fn({ u, v, w: b, h })
          if (k) c.px(ox + a + u, oy + yL(a + u) + v, k)
        }
      return B
    },
    // boîte unie : dessus, face gauche, face droite, puis arêtes éclairées (bord du dessus, arête avant)
    fill: (c, top, left, right, edge) => {
      B.top(c, top).left(c, left).right(c, right)
      if (edge) {
        B.top(c, ({ rim }) => (rim ? edge : null))
        for (let v = 0; v < h; v++) c.px(ox + a - 1, oy + yL(a - 1) + v, edge)
      }
      return B
    },
  }
  return B
}

// Cylindre debout : dessus en ellipse (rx, ry = rx / 2) centré en (cx, cy), corps de hauteur h.
// keys = { top, lit, body, dark } : bandes verticales, claire à gauche, sombre à droite.
const isoCyl = (c, cx, cy, rx, h, keys) => {
  const ry = Math.max(1, Math.round(rx / 2))
  c.ellipse(cx, cy + h, rx, ry, keys.body)
  c.rect(cx - rx, cy, rx * 2 + 1, h, keys.body)
  c.recolor({ [keys.body]: keys.dark }, (x, y) => x > cx + rx * 0.35 && y >= cy)
  c.recolor({ [keys.body]: keys.lit }, (x, y) => x < cx - rx * 0.45 && x > cx - rx && y >= cy)
  c.ellipse(cx, cy, rx, ry, keys.top)
}
