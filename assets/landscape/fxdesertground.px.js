include("../_palette.px.js")
include("../nature/_fx.px.js")

const meta = {
  title: "Sol du désert (style pixelfx)",
  description: "Bandes de sol désertique vues de face au rendu riche inspiré de pixelfx (même rendu texturé que les dunes fxdune) : pas de contour noir, surface éclairée par le haut avec un liseré clair, matière qui s'assombrit en profondeur par paliers francs, taches de grain en bruit lissé et rares paillettes. Sol continu : chaque bande se répète sans couture à gauche et à droite ; toutes les bandes de même hauteur s'enchaînent entre elles (surface à la même hauteur aux bords, même grain) ; sous chaque bande se raccorde son bloc de remplissage 32 × 32, qui se répète dans les deux sens pour prolonger le sol vers le bas (sable sous le sable lisse, ridé et caillouteux, argile sous l'argile, grès sous le grès). Variantes : sable lisse (32, 64 px), sable ridé, reg caillouteux, argile craquelée, grès stratifié, et trois blocs de remplissage.",
  tags: ["ground", "floor", "terrain", "tile", "tileable", "seamless", "desert", "sand", "platformer", "realistic", "pixelfx"],
  variants: {
    sand_64: { label: "Sable lisse (64 × 32)", props: { surface: "sand", tiling: "horizontal" } },
    sand_32: { label: "Sable lisse (32 × 16)", props: { surface: "sand", tiling: "horizontal" } },
    ripples_64: { label: "Sable ridé (64 × 32)", props: { surface: "ripples", tiling: "horizontal" }, tags: ["ripples", "wind"] },
    pebbles_64: { label: "Reg caillouteux (64 × 32)", props: { surface: "pebbles", tiling: "horizontal" }, tags: ["pebble", "stone", "gravel"] },
    cracked_64: { label: "Argile craquelée (64 × 32)", props: { surface: "cracked", tiling: "horizontal" }, tags: ["clay", "dry", "crack", "badlands"] },
    strata_64: { label: "Grès stratifié (64 × 32)", props: { surface: "strata", tiling: "horizontal" }, tags: ["sandstone", "rock", "cliff"] },
    fill_32: { label: "Remplissage sable (32 × 32)", props: { surface: "fill", tiling: "both" }, tags: ["fill", "underground"] },
    fill_cracked_32: { label: "Remplissage argile (32 × 32)", props: { surface: "fill", tiling: "both" }, tags: ["fill", "underground", "clay"] },
    fill_strata_32: { label: "Remplissage grès (32 × 32)", props: { surface: "fill", tiling: "both" }, tags: ["fill", "underground", "sandstone"] },
  },
}

const SAND = ["K", "(", ")", "-", "!", "?"]
const CLAY = ["3", "B", "b", "=", "n", "N"]
const STONE = ["B", "b", "=", "n", "N", "?"] // galets brun-rouge (grès)
const T = 32 // période commune de la matière, en x comme en y : tout ce qui est en profondeur boucle sur 32 × 32
const BS = 21 // graine commune de la matière (même grain dans toutes les variantes, pour les enchaîner)
const G = 0.18 // amplitude du grain des strates (celui du sable est dans grain())

// bruit lissé qui boucle : période P en x et Q en y (multiples de sc)
const wn = (x, y, sc, s, P, Q) => {
  const gx = x / sc, gy = y / sc, x0 = Math.floor(gx), y0 = Math.floor(gy), nx = Math.round(P / sc), ny = Math.round(Q / sc)
  const fx = gx - x0, fy = gy - y0, sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy)
  const m = (a, n) => ((a % n) + n) % n
  const h = (i, j) => hsh(m(i, nx), m(j, ny), s)
  const a = h(x0, y0), b = h(x0 + 1, y0), c = h(x0, y0 + 1), d = h(x0 + 1, y0 + 1)
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy
}
// taches claires seulement (jamais de points sombres), assez rares pour que la répétition tous les 32 px ne se voie pas
const grain = (x, Y) => 0.6 * Math.max(0, wn(x, Y, 4, BS, T, T) - 0.64) + 0.45 * Math.max(0, wn(x, Y, 8, BS + 9, T, T) - 0.6)

// fentes de l'argile : Voronoï qui boucle sur 32 × 32 (écrasé en hauteur), 4 cellules par bloc
const CR = (() => { const R = rng(77), p = []; for (let i = 0; i < 4; i++) p.push([R() * T, R() * T]); return p })()
const crack = (x, Y) => {
  let d1 = 1e9, d2 = 1e9
  for (const [px, py] of CR)
    for (const ox of [-T, 0, T])
      for (const oy of [-T, 0, T]) {
        const d = Math.hypot(x + 0.5 - px - ox, (Y + 0.5 - py - oy) * 1.8)
        if (d < d1) { d2 = d1; d1 = d } else if (d < d2) d2 = d
      }
  return d2 - d1
}

// strates de grès : bandes ondulées, chacune claire en haut et sombre en bas, joint sombre entre deux
const strata = (x, Y) => {
  // deux strates par 16 px (7 et 9 px d'épaisseur), bord ondulé par deux bruits d'échelles différentes
  const w = Y + 2.6 * (wn(x, Y, 16, BS + 5, T, T) - 0.5) + 1.6 * (wn(x, Y, 8, BS + 8, T, T) - 0.5)
  const m = ((w % 16) + 16) % 16, thick = m < 7 ? 7 : 9, f = (m < 7 ? m : m - 7) / thick
  if (f < 1 / thick) return 0.15
  return 0.72 - 0.36 * f - (m < 7 ? 0 : 0.08) + (f < 2 / thick ? 0.18 : 0) + 0.6 * (G * (wn(x, Y, 4, BS + 6, T, T) - 0.5))
}

// Bande de sol (ou bloc de remplissage). Les rangées sont repérées en coordonnées « monde » Y = y + 32 - H :
// la dernière rangée d'une bande est toujours Y = 31, et le bloc de remplissage (Y = 0 … 31) la prolonge.
// kind : "sand" | "ripples" | "pebbles" | "cracked" | "strata" ; fill : bloc de remplissage de cette matière.
function ground(kind, { fill = false, seed = 3, top = 3 } = {}) {
  return (c) => {
    const W = c.w, H = c.h, B = Buf(W, H), n = 6, off = T - H
    // surface ondulée, ramenée à la hauteur `top` aux deux bords (les bandes s'enchaînent entre elles)
    const win = (x) => Math.min(1, (Math.min(x, W - 1 - x) + 0.5) / 10)
    const surf = (x) => (fill ? -1e9 : top + Math.round((1.8 * (wn(x, 0, 16, seed + 1, W, T) - 0.5) + 1.4 * (wn(x, 0, 8, seed + 2, W, T) - 0.5)) * win(x)))
    const idx = new Int8Array(W * H).fill(-1), mat = new Array(W * H).fill(null)
    for (let x = 0; x < W; x++) {
      const s = surf(x)
      for (let y = Math.max(0, s); y < H; y++) {
        const d = y - s, Y = y + off, p = y * W + x
        let v = Math.max(0.84 - 0.04 * d - (d > 3 ? 0.05 : 0), 0.4) + grain(x, Y), r = SAND
        if (kind === "cracked") { r = CLAY; v += 0.1 }
        if (kind === "ripples" && d >= 1 && d < 7) {
          const u = (x + 1.5 * d + 4 * wn(x, y, 16, seed + 4, W, T)) / 8, f = u - Math.floor(u)
          if (f < 0.16) v -= 0.22
          else if (f < 0.4) v += 0.08
        }
        if (kind === "strata" && d >= 5) { r = CLAY; v = strata(x, Y) }
        if (kind === "cracked" && d >= 2) {
          if (crack(x, Y) < 1.1) v -= 0.5
          else if (crack(x, Y - 1) < 1.1 && (fill || d >= 3)) v += 0.17 // lèvre claire sous la fente
        }
        idx[p] = clamp(Math.floor(v * n), 0, n - 1)
        mat[p] = r
      }
    }
    // liseré de surface : la première rangée prend le palier le plus clair (un cran de moins sur une marche qui descend)
    if (!fill) for (let x = 0; x < W; x++) {
      const s = surf(x)
      idx[s * W + x] = surf((x + 1) % W) > s ? n - 2 : n - 1
    }
    for (let p = 0; p < W * H; p++) if (idx[p] >= 0) B.k[p] = mat[p][idx[p]]
    // reg : galets à demi enterrés (loin des bords haut et bas pour les raccords), calotte claire, ombre à droite
    if (kind === "pebbles" && !fill) {
      const R = rng(seed * 11 + 2)
      for (let k = 0; k < W / 4; k++) {
        const cx = R() * W, rx = 1.2 + R() * 2.2, ry = rx * (0.55 + R() * 0.2), deep = R() < 0.55
        const cy = deep ? top + 5 + R() * (H - top - 12) : surf(Math.floor(cx)) + 0.3
        for (let y = Math.floor(cy - ry - 1); y <= cy + ry + 1; y++)
          for (let xx = Math.floor(cx - rx - 1); xx <= cx + rx + 1; xx++) {
            const x = ((xx % W) + W) % W, dx = (xx + 0.5 - cx) / rx, dy = (y + 0.5 - cy) / ry, r2 = dx * dx + dy * dy
            if (y < 0 || y >= H) continue
            if (r2 <= 1) {
              if (!deep && y < surf(x) - 2) continue
              let v = 0.5 - 0.35 * dx - 0.35 * dy + (r2 > 0.6 ? -0.15 : 0)
              if (dx < 0 && dy < -0.2 && r2 < 0.5) v += 0.25
              B.set(x, y, STONE[clamp(Math.floor(v * STONE.length), 0, STONE.length - 1)])
            } else if (dx > 0.3 && dy > -0.2 && r2 <= 1.7 && SAND.includes(B.get(x, y)))
              B.set(x, y, SAND[Math.max(0, SAND.indexOf(B.get(x, y)) - 2)]) // ombre du galet sur le sable
          }
      }
    }
    // paillettes très rares sur le sable clair (placées en coordonnées monde : elles bouclent aussi)
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const p = y * W + x
        if (idx[p] >= n - 2 && mat[p] === SAND && y > surf(x) && hsh(x % T, y + off, BS + 3) < 0.012) B.set(x, y, "Y")
      }
    B.flush(c)
  }
}

sprite("fxdesertground_sand_64", { w: 64, h: 32 }, ground("sand"))
sprite("fxdesertground_sand_32", { w: 32, h: 16 }, ground("sand", { seed: 5, top: 2 }))
sprite("fxdesertground_ripples_64", { w: 64, h: 32 }, ground("ripples", { seed: 7 }))
sprite("fxdesertground_pebbles_64", { w: 64, h: 32 }, ground("pebbles", { seed: 9 }))
sprite("fxdesertground_cracked_64", { w: 64, h: 32 }, ground("cracked", { seed: 11 }))
sprite("fxdesertground_strata_64", { w: 64, h: 32 }, ground("strata", { seed: 13 }))
sprite("fxdesertground_fill_32", { w: 32, h: 32 }, ground("sand", { fill: true }))
sprite("fxdesertground_fill_cracked_32", { w: 32, h: 32 }, ground("cracked", { fill: true }))
sprite("fxdesertground_fill_strata_32", { w: 32, h: 32 }, ground("strata", { fill: true }))

sheet("fxdesertgrounds", ["fxdesertground_*"], { pad: 2 })
