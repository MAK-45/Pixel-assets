include("../_palette.px.js")
include("../nature/_fx.px.js")

const meta = {
  title: "Sol du désert (style pixelfx)",
  description: "Bandes de sol désertique vues de face au rendu riche inspiré de pixelfx (même rendu texturé que les dunes fxdune) : pas de contour noir, surface éclairée par le haut avec un liseré clair, matière qui s'assombrit en profondeur par paliers francs, taches de grain en bruit lissé et rares paillettes. Chaque bande se raccorde sans couture à gauche et à droite (à répéter en boucle sous le personnage) ; le bloc de remplissage se raccorde aussi en haut et en bas, pour prolonger le sol vers le bas de l'écran. Variantes : sable lisse (32, 64 px), sable ridé par le vent, reg caillouteux (galets à demi enterrés), argile craquelée, grès stratifié sous le sable, et bloc de remplissage 32 × 32.",
  tags: ["ground", "floor", "terrain", "tile", "tileable", "seamless", "desert", "sand", "platformer", "realistic", "pixelfx"],
  variants: {
    sand_64: { label: "Sable lisse (64 × 32)", props: { surface: "sand", tiling: "horizontal" } },
    sand_32: { label: "Sable lisse (32 × 16)", props: { surface: "sand", tiling: "horizontal" } },
    ripples_64: { label: "Sable ridé (64 × 32)", props: { surface: "ripples", tiling: "horizontal" }, tags: ["ripples", "wind"] },
    pebbles_64: { label: "Reg caillouteux (64 × 32)", props: { surface: "pebbles", tiling: "horizontal" }, tags: ["pebble", "stone", "gravel"] },
    cracked_64: { label: "Argile craquelée (64 × 32)", props: { surface: "cracked", tiling: "horizontal" }, tags: ["clay", "dry", "crack", "badlands"] },
    strata_64: { label: "Grès stratifié (64 × 32)", props: { surface: "strata", tiling: "horizontal" }, tags: ["sandstone", "rock", "cliff"] },
    fill_32: { label: "Remplissage sable (32 × 32)", props: { surface: "fill", tiling: "both" }, tags: ["fill", "underground"] },
  },
}

const SAND = ["K", "(", ")", "-", "!", "?"]
const CLAY = ["3", "B", "b", "=", "n", "N"]
const STONE = ["B", "b", "=", "n", "N", "?"] // galets brun-rouge (grès)

// bruit lissé qui boucle en x (période P, multiple de sc) et, si Q est donné, en y
const wn = (x, y, sc, s, P, Q) => {
  const gx = x / sc, gy = y / sc, x0 = Math.floor(gx), y0 = Math.floor(gy), nx = Math.round(P / sc), ny = Q ? Math.round(Q / sc) : 1e9
  const fx = gx - x0, fy = gy - y0, sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy)
  const m = (a, n) => ((a % n) + n) % n
  const h = (i, j) => hsh(m(i, nx), ny < 1e9 ? m(j, ny) : j, s)
  const a = h(x0, y0), b = h(x0 + 1, y0), c = h(x0, y0 + 1), d = h(x0 + 1, y0 + 1)
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy
}

// Bande de sol : surface ondulée (ou plate si fill), liseré clair, matière plus sombre en profondeur, grain.
// kind : "sand" | "ripples" | "pebbles" | "cracked" | "strata" | "fill"
function ground(kind, { seed = 3, grain = 0.22, top = 3 } = {}) {
  return (c) => {
    const W = c.w, H = c.h, B = Buf(W, H), fill = kind === "fill"
    const n = 6
    const surf = (x) => (fill ? -1 : top + Math.round(1.6 * (wn(x, 0, 16, seed + 1, W) - 0.5) + 1.2 * (wn(x, 0, 8, seed + 2, W) - 0.5)))
    const ramp = kind === "cracked" ? CLAY : SAND
    const idx = new Int8Array(W * H).fill(-1), mat = new Array(W * H).fill(null)
    for (let x = 0; x < W; x++) {
      const s = surf(x)
      for (let y = Math.max(0, s); y < H; y++) {
        const d = y - s // profondeur sous la surface
        let v = fill ? 0.55 : Math.max(0.84 - 0.04 * d - (d > 3 ? 0.05 : 0), 0.44) // pas plus sombre qu'un palier moyen
        const g = fill || d > 5 ? grain * 0.75 : grain
        v += g * (wn(x, y, 4, seed, W, fill ? H : 0) - 0.5) + 0.5 * g * (wn(x, y, 2, seed + 9, W, fill ? H : 0) - 0.5)
        if (kind === "cracked") v += 0.1
        let r = ramp
        if (kind === "ripples" && d >= 1) {
          // rides : traits obliques réguliers dans la couche de surface, ondulés par le bruit
          const u = (x + 1.5 * d + 4 * wn(x, y, 16, seed + 4, W)) / 8, f = u - Math.floor(u)
          if (d < 7 && f < 0.16) v -= 0.22
          else if (d < 7 && f < 0.4) v += 0.08
        }
        if (kind === "strata" && y - top >= 5 + (d < 3 ? 99 : 0)) {
          // strates de grès sous le sable : bandes ondulées, chacune claire en haut et sombre en bas
          const u = (y - top - 5 + 2.2 * (wn(x, y, 16, seed + 5, W) - 0.5) * 2) / 6, f = u - Math.floor(u)
          r = CLAY
          v = 0.7 - 0.34 * f - 0.08 * (Math.floor(u) % 2) + 0.6 * grain * (wn(x, y, 4, seed + 6, W) - 0.5)
          if (f < 0.12) v = 0.15 // joint sombre entre deux strates
          else if (f < 0.24) v += 0.2 // arête éclairée sous le joint
        }
        idx[y * W + x] = clamp(Math.floor(v * n), 0, n - 1)
        mat[y * W + x] = r
      }
    }
    // argile craquelée : réseau de fentes (Voronoï qui boucle en x), écrasé en hauteur ; lèvre claire sous chaque fente
    if (kind === "cracked") {
      const R = rng(seed * 7), pts = []
      for (let i = 0; i < W / 5; i++) pts.push([R() * W, top + R() * (H - top) * 1.1])
      const cell = (x, y) => {
        let d1 = 1e9, d2 = 1e9
        for (const [px, py] of pts)
          for (const o of [-W, 0, W]) {
            const d = Math.hypot(x + 0.5 - px - o, (y + 0.5 - py) * 1.8)
            if (d < d1) { d2 = d1; d1 = d } else if (d < d2) d2 = d
          }
        return d2 - d1
      }
      for (let y = 0; y < H; y++)
        for (let x = 0; x < W; x++) {
          const p = y * W + x
          if (idx[p] < 0 || y < surf(x) + 2) continue
          if (cell(x, y) < 1.1) idx[p] = Math.max(0, idx[p] - 3)
          else if (y > 0 && idx[p - W] >= 0 && cell(x, y - 1) < 1.1) idx[p] = Math.min(n - 1, idx[p] + 1)
        }
    }
    // liseré de surface : la première rangée prend le palier le plus clair, la deuxième un cran de moins
    if (!fill) for (let x = 0; x < W; x++) {
      const s = surf(x)
      if (s >= 0) idx[s * W + x] = n - 1
      // marche : un pixel de surface sans voisin à gauche (pente qui monte) reste clair, à droite il s'assombrit
      if (s >= 0 && surf((x + 1) % W) > s) idx[s * W + x] = n - 2
    }
    for (let p = 0; p < W * H; p++) if (idx[p] >= 0) B.k[p] = mat[p][idx[p]]
    // reg : galets à demi enterrés, calotte claire en haut à gauche, ombre portée au sol à droite
    if (kind === "pebbles") {
      const R = rng(seed * 11 + 2)
      for (let k = 0; k < W / 4; k++) {
        const cx = R() * W, rx = 1.2 + R() * 2.2, ry = rx * (0.55 + R() * 0.2), deep = R() < 0.55
        const cy = deep ? top + 4 + R() * (H - top - 6) : surf(Math.floor(cx)) + 0.3
        for (let y = Math.floor(cy - ry - 1); y <= cy + ry + 1; y++)
          for (let xx = Math.floor(cx - rx - 1); xx <= cx + rx + 1; xx++) {
            const x = ((xx % W) + W) % W, dx = (xx + 0.5 - cx) / rx, dy = (y + 0.5 - cy) / ry, r2 = dx * dx + dy * dy
            if (y < 0 || y >= H) continue
            if (r2 <= 1) {
              if (!deep && y < surf(x) - 2) continue
              let v = 0.5 - 0.35 * dx - 0.35 * dy + (r2 > 0.6 ? -0.15 : 0)
              if (dx < 0 && dy < -0.2 && r2 < 0.5) v += 0.25
              B.set(x, y, STONE[clamp(Math.floor(v * STONE.length), 0, STONE.length - 1)])
            } else if (dx > 0.3 && dy > -0.2 && r2 <= 1.7 && B.get(x, y) !== "." && !"3Bb=nN".includes(B.get(x, y)))
              B.set(x, y, SAND[Math.max(0, SAND.indexOf(B.get(x, y)) - 2)]) // ombre du galet sur le sable
          }
      }
    }
    // paillettes très rares dans la couche éclairée
    const R = rng(seed * 31 + 5)
    for (let k = 0; k < W * H * 0.01; k++) {
      const x = Math.floor(R() * W), y = Math.floor(R() * H), p = y * W + x
      if (idx[p] >= n - 2 && mat[p] === SAND && (fill || y > surf(x))) B.set(x, y, "Y")
    }
    B.flush(c)
  }
}

sprite("fxdesertground_sand_64", { w: 64, h: 32 }, ground("sand"))
sprite("fxdesertground_sand_32", { w: 32, h: 16 }, ground("sand", { seed: 5, grain: 0.18, top: 2 }))
sprite("fxdesertground_ripples_64", { w: 64, h: 32 }, ground("ripples", { seed: 7 }))
sprite("fxdesertground_pebbles_64", { w: 64, h: 32 }, ground("pebbles", { seed: 9 }))
sprite("fxdesertground_cracked_64", { w: 64, h: 32 }, ground("cracked", { seed: 11, grain: 0.16 }))
sprite("fxdesertground_strata_64", { w: 64, h: 32 }, ground("strata", { seed: 13 }))
sprite("fxdesertground_fill_32", { w: 32, h: 32 }, ground("fill", { seed: 15 }))

sheet("fxdesertgrounds", ["fxdesertground_*"], { pad: 2 })
