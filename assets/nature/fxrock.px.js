include("../_palette.px.js")
include("_fx.px.js")

const meta = {
  title: "Roche (style pixelfx)",
  description: "Roches vues de face au rendu riche inspiré des pierres de la bibliothèque d'effets pixelfx (rocher qui roule, pic de terre) : pierres taillées en facettes planes, chacune éclairée selon son orientation (haut-gauche clair, bas-droite sombre), rebord vif côté lumière, bord sombre dans la teinte la plus foncée de la pierre, fissures à lèvre claire. Variantes : rocher (32, 48 px) nu, moussu ou enneigé, rocher de grès, tas de pierres, aiguille rocheuse à strates (48 px), caillou et galets (16 px), et pierres à demi enterrées (bloc, dalle plate, moussu ; 16, 32, 48 px) dont seule la partie hors du sol est dessinée, plus sombre au ras du sol : à poser un peu enfoncées dans un terrain. Roche seule, sans décor autour.",
  tags: ["rock", "stone", "boulder", "nature", "decoration", "obstacle", "terrain", "realistic", "pixelfx"],
  variants: {
    boulder_48: { label: "Grand rocher (48 px)", props: { form: "boulder", surface: "bare", material: "granite" } },
    boulder_32: { label: "Rocher (32 px)", props: { form: "boulder", surface: "bare", material: "granite" } },
    boulder_moss_32: { label: "Rocher moussu (32 px)", props: { form: "boulder", surface: "mossy", material: "granite" } },
    boulder_snow_32: { label: "Rocher enneigé (32 px)", props: { form: "boulder", surface: "snow", material: "granite" }, tags: ["winter", "snow"] },
    sandstone_32: { label: "Rocher de grès (32 px)", props: { form: "boulder", surface: "bare", material: "sandstone" }, tags: ["desert"] },
    pile_32: { label: "Tas de pierres (32 px)", props: { form: "pile", surface: "bare", material: "granite" } },
    spire_48: { label: "Aiguille rocheuse à strates (48 px)", props: { form: "spire", surface: "bare", material: "sandstone" }, tags: ["cliff", "desert"] },
    stone_16: { label: "Caillou (16 px)", props: { form: "stone", surface: "bare", material: "granite" } },
    pebbles_16: { label: "Galets (16 px)", props: { form: "pebbles", surface: "bare", material: "granite" } },
    buried_48: { label: "Rocher à demi enterré (48 × 24)", props: { form: "buried", surface: "bare", material: "granite" }, tags: ["embedded", "half-buried"] },
    buried_flat_48: { label: "Dalle à demi enterrée (48 × 16)", props: { form: "buried", surface: "bare", material: "granite" }, tags: ["embedded", "half-buried", "slab"] },
    buried_32: { label: "Rocher à demi enterré (32 × 16)", props: { form: "buried", surface: "bare", material: "granite" }, tags: ["embedded", "half-buried"] },
    buried_moss_32: { label: "Rocher moussu à demi enterré (32 × 16)", props: { form: "buried", surface: "mossy", material: "granite" }, tags: ["embedded", "half-buried"] },
    buried_moss_48: { label: "Grand rocher moussu à demi enterré (48 × 24)", props: { form: "buried", surface: "mossy", material: "granite" }, tags: ["embedded", "half-buried"] },
    buried_16: { label: "Caillou à demi enterré (16 × 8)", props: { form: "buried", surface: "bare", material: "granite" }, tags: ["embedded", "half-buried"] },
  },
}

// ================================================================ pierre à facettes
// D'après drawRock de pixelfx : polygone irrégulier, découpé en facettes (un coin de chaque arête vers un
// sommet décalé vers la lumière). Chaque facette prend un palier selon la normale de son arête face à la
// lumière ; les pixels de bord éclairés prennent le palier le plus clair, ceux à l'ombre plus sombre ;
// un bord du palier le plus foncé fait le tour. Le bas est aplati : la pierre est posée au sol.

const GRANITE = ["k", "d", "<", "m", ">", "c", "C"]
const SANDSTONE = ["3", "B", "b", "=", "n", "N"]
const FLX = -0.6, FLY = -0.8 // lumière 2D des facettes

const inPoly = (V, x, y) => {
  let inside = false
  for (let i = 0, j = V.length - 1; i < V.length; j = i++) {
    const [xi, yi] = V[i], [xj, yj] = V[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

// Pierre centrée en cx, posée sur la ligne `base` (dernière rangée de pierre), demi-tailles rx, ry.
function stone(B, { cx, base, rx, ry, n = 7, seed = 1, ramp = GRANITE, cracks = 1, peak = [-0.22, -0.42], squashTop = 1 }) {
  const R = rng(seed), cy = base + 1 - ry, a0 = R() * 6.28, V = []
  for (let i = 0; i < n; i++) {
    const a = a0 + ((i + (R() - 0.5) * 0.5) * 2 * Math.PI) / n, r = 0.86 + R() * 0.2
    V.push([cx + Math.cos(a) * rx * r, Math.min(base + 1, cy + Math.sin(a) * ry * r * (Math.sin(a) < 0 ? squashTop : 1.15))])
  }
  // sommet des facettes, décalé vers la lumière (la face du dessus regarde le haut-gauche)
  const P = [cx + peak[0] * rx, cy + peak[1] * ry]
  const ang = V.map(([x, y]) => Math.atan2(y - P[1], x - P[0]))
  const lit = V.map(([ax, ay], i) => {
    const [bx, by] = V[(i + 1) % V.length], ex = bx - ax, ey = by - ay, l = Math.hypot(ex, ey) || 1
    let nx = ey / l, ny = -ex / l
    if (nx * ((ax + bx) / 2 - P[0]) + ny * ((ay + by) / 2 - P[1]) < 0) (nx = -nx), (ny = -ny)
    // les facettes près du sommet regardent un peu vers nous : on tire la normale vers le haut-gauche
    return nx * FLX + ny * FLY
  })
  const top = ramp.length - 2, mask = new Map(), face = new Map(), key = (x, y) => y * 1000 + x
  const X0 = Math.floor(cx - rx * 1.2) - 1, X1 = Math.ceil(cx + rx * 1.2) + 1, Y0 = Math.floor(cy - ry * 1.3) - 1
  for (let y = Y0; y <= base; y++)
    for (let x = X0; x <= X1; x++) {
      if (!inPoly(V, x + 0.5, y + 0.5)) continue
      mask.set(key(x, y), 1)
      const g = Math.atan2(y + 0.5 - P[1], x + 0.5 - P[0])
      let f = 0
      for (let q = 0; q < ang.length; q++) {
        let d = (g - ang[q]) % (2 * Math.PI), span = (ang[(q + 1) % ang.length] - ang[q]) % (2 * Math.PI)
        if (d < 0) d += 2 * Math.PI
        if (span < 0) span += 2 * Math.PI
        if (d <= span) { f = q; break }
      }
      face.set(key(x, y), f)
    }
  const at = (x, y) => mask.has(key(x, y))
  const idx = new Map()
  for (let y = Y0; y <= base; y++)
    for (let x = X0; x <= X1; x++) {
      if (!at(x, y)) continue
      const f = face.get(key(x, y)), L = lit[f]
      let i = L > 0.5 ? top : L > 0.15 ? top - 1 : L > -0.3 ? top - 2 : top - 3
      const edge = !at(x - 1, y) || !at(x + 1, y) || !at(x, y - 1)
      if (edge) i = L > 0.3 ? top + 1 : L < -0.2 ? Math.max(1, top - 4) : i
      // arête entre deux facettes : la facette la plus éclairée prend un liseré clair
      const fr = face.get(key(x + 1, y)), fd = face.get(key(x, y + 1))
      const LL = (g) => lit[g]
      if (!edge && ((fr !== undefined && fr !== f && L > LL(fr) + 0.45) || (fd !== undefined && fd !== f && L > LL(fd) + 0.45))) i = Math.min(top + 1, i + 1)
      if (y === base) i = Math.max(1, i - 1) // contact avec le sol
      const fleck = hsh(x * 7 + 3, y * 13 + 5, seed) // paillettes rares du grain de la pierre
      if (!edge && fleck < 0.035) i = L > 0.15 ? i + 1 : i - 1
      else if (!edge && fleck > 0.965) i -= 1
      idx.set(key(x, y), clamp(i, 1, ramp.length - 1))
    }
  // fissures : traits sombres partant d'un bord, lèvre claire au-dessus à gauche
  for (let c = 0; c < cracks; c++) {
    let x = cx + (R() - 0.3) * rx * 0.8, y = cy - ry * (0.2 + R() * 0.4)
    const len = Math.round(ry * (0.5 + R() * 0.5)), dir = R() < 0.5 ? -1 : 1
    for (let s = 0; s < len; s++) {
      const X = Math.round(x), Y = Math.round(y)
      if (!idx.has(key(X, Y)) || !at(X, Y + 1)) break
      idx.set(key(X, Y), 1)
      if (idx.has(key(X - 1, Y - 1)) && idx.get(key(X - 1, Y - 1)) < top) idx.set(key(X - 1, Y - 1), Math.min(top + 1, idx.get(key(X - 1, Y - 1)) + 1))
      y += 1
      x += dir * (R() < 0.45 ? 1 : 0)
    }
  }
  for (const [k, i] of idx) B.set(k % 1000, Math.floor(k / 1000), ramp[i])
  // bord sombre autour (pas sous la rangée du sol)
  for (let y = Y0 - 1; y <= base; y++)
    for (let x = X0 - 1; x <= X1 + 1; x++)
      if (!at(x, y) && (at(x - 1, y) || at(x + 1, y) || at(x, y - 1) || at(x, y + 1))) B.set(x, y, ramp[0])
  return { at, lit: (x, y) => idx.get(key(x, y)) ?? -1 }
}

// ================================================================ aiguille à strates
// D'après drawSpike de pixelfx : une arête sépare une face gauche éclairée d'une face droite à l'ombre,
// des strates en biais décalent les facettes, des encoches entament les bords.
function spire(B, { x, base, h, w, lean = 0, seed = 1, ramp = SANDSTONE, strata = [0.22, 0.45, 0.66] }) {
  const R = rng(seed), notches = Array.from({ length: 5 }, () => ({ u: 0.1 + R() * 0.7, side: R() < 0.5 ? -1 : 1, d: 0.6 + R() * 1.4 }))
  const hw = (u, side) => {
    let v = (w / 2) * Math.pow(Math.max(0, 1 - u), 0.8) + 0.3
    for (const nn of notches) if (nn.side === side && u > nn.u && u < nn.u + 0.08) v -= nn.d * (1 - u * 0.5)
    return Math.max(0, v)
  }
  const inside = (px, py) => {
    const u = (base + 1 - (py + 0.5)) / h
    if (u < 0 || u > 1) return false
    const c = x + lean * u, fx = px + 0.5
    return fx >= c - hw(u, -1) && fx <= c + hw(u, 1)
  }
  const n = ramp.length
  for (let py = base - h - 1; py <= base; py++)
    for (let px = Math.floor(x - w / 2 - Math.abs(lean) - 2); px <= x + w / 2 + Math.abs(lean) + 2; px++) {
      if (!inside(px, py)) {
        if (inside(px - 1, py) || inside(px + 1, py) || inside(px, py + 1) || inside(px, py - 1)) B.set(px, py, ramp[0])
        continue
      }
      const u = (base + 1 - (py + 0.5)) / h, c = x + lean * u, l = c - hw(u, -1), r = c + hw(u, 1), fx = px + 0.5
      let band = 0, st = false
      for (const s of strata) {
        const d = u * h - s * h - 0.35 * (fx - c)
        if (d > 0) band++
        if (Math.abs(d) < 0.5) st = true
      }
      const jog = (hsh(band, seed, 3) - 0.5) * 0.3, q = ((fx - l) / Math.max(0.5, r - l)) * 2 - 1, qr = -0.15 + jog
      let i
      if (u > 0.94) i = q < qr + 0.3 ? n - 1 : n - 2
      else if (Math.abs(q - qr) < Math.max(0.09, 0.55 / Math.max(1, r - l))) i = n - 1 // arête
      else if (q < qr) i = fx - l < 1 ? n - 1 : q < -0.55 + jog ? n - 2 : n - 3
      else i = r - fx < 1 ? 1 : q < 0.4 + jog ? 2 : 1
      if (st && i < n - 1) i -= 1
      if (py === base) i = Math.max(1, i - 1)
      B.set(px, py, ramp[clamp(i, 1, n - 1)])
    }
}

// ================================================================ surfaces : mousse, neige

// Mousse sur le dessus : épaisseur 1 à 3 px selon un bruit lissé, liseré clair au sommet, franges qui pendent.
function moss(B, st, { seed = 2, depth = 5, x0 = 0, x1 = 999 } = {}) {
  for (let x = 0; x < B.w; x++) {
    if (x < x0 || x > x1) continue
    let y = 0
    while (y < B.h && !st.at(x, y)) y++
    if (y >= B.h) continue
    const d = Math.round(vnoise(x, 0, 3, seed) * depth + (x < (x0 + x1) / 2 ? 0.6 : -0.4))
    for (let k = 0; k < d; k++) if (st.at(x, y + k)) B.set(x, y + k, k === 0 ? (x < (x0 + x1) / 2 ? "L" : "l") : k === d - 1 ? "G" : "g")
    if (d >= 2 && hsh(x, 7, seed) < 0.25 && st.at(x, y + d)) B.set(x, y + d, "G") // frange
  }
}

// Neige sur le dessus : 2 à 3 px, blanche côté lumière, bleutée côté ombre, ourlet bleu dessous.
function snowcap(B, st, { seed = 3, mid = 16 } = {}) {
  for (let x = 0; x < B.w; x++) {
    let y = 0
    while (y < B.h && !st.at(x, y)) y++
    if (y >= B.h - 2) continue
    const d = 2 + Math.round(vnoise(x, 0, 3, seed) * 1.5)
    for (let k = 0; k < d; k++) if (st.at(x, y + k)) B.set(x, y + k, x < mid ? (k === d - 1 ? "s" : "w") : k === 0 ? "s" : "S")
    if (st.at(x, y + d)) B.set(x, y + d, "S")
    B.set(x, y - 1, x < mid ? "s" : "S") // la neige dépasse d'un pixel au-dessus
  }
}

// ================================================================ variantes

const draw = (fn) => (c) => { const B = Buf(c.w, c.h); fn(B, c.h - 2); B.flush(c) }

sprite("fxrock_boulder_48", { w: 48, h: 48 }, draw((B, g) => stone(B, { cx: 24, base: g, rx: 21, ry: 17, n: 8, seed: 11, cracks: 2 })))
sprite("fxrock_boulder_32", { w: 32, h: 32 }, draw((B, g) => stone(B, { cx: 16, base: g, rx: 14, ry: 11, n: 7, seed: 4 })))
sprite("fxrock_boulder_moss_32", { w: 32, h: 32 }, draw((B, g) => moss(B, stone(B, { cx: 16, base: g, rx: 14, ry: 11, n: 7, seed: 4 }), { x0: 2, x1: 26 })))
sprite("fxrock_boulder_snow_32", { w: 32, h: 32 }, draw((B, g) => snowcap(B, stone(B, { cx: 16, base: g, rx: 14, ry: 11, n: 7, seed: 4 }))))
sprite("fxrock_sandstone_32", { w: 32, h: 32 }, draw((B, g) => stone(B, { cx: 16, base: g, rx: 14, ry: 10, n: 6, seed: 9, ramp: SANDSTONE })))
sprite("fxrock_pile_32", { w: 32, h: 32 }, draw((B, g) => {
  stone(B, { cx: 18, base: g - 6, rx: 8, ry: 7, n: 6, seed: 21, cracks: 0 })
  stone(B, { cx: 8, base: g, rx: 7, ry: 6, n: 6, seed: 22, cracks: 0 })
  stone(B, { cx: 22, base: g, rx: 8, ry: 6, n: 7, seed: 23, cracks: 1 })
}))
sprite("fxrock_spire_48", { w: 48, h: 48 }, draw((B, g) => {
  spire(B, { x: 27, base: g, h: 30, w: 12, lean: 3, seed: 5, strata: [0.3, 0.6] })
  spire(B, { x: 20, base: g, h: 44, w: 20, lean: -2, seed: 6 })
  stone(B, { cx: 36, base: g, rx: 6, ry: 4, n: 6, seed: 31, cracks: 0, ramp: SANDSTONE })
}))
sprite("fxrock_stone_16", { w: 16, h: 16 }, draw((B, g) => stone(B, { cx: 8, base: g, rx: 7, ry: 5.5, n: 8, seed: 7, cracks: 0 })))
sprite("fxrock_pebbles_16", { w: 16, h: 16 }, draw((B, g) => {
  stone(B, { cx: 7, base: g - 4, rx: 4, ry: 3.6, n: 6, seed: 43, cracks: 0 })
  stone(B, { cx: 4.5, base: g, rx: 4, ry: 3.4, n: 6, seed: 41, cracks: 0 })
  stone(B, { cx: 11.5, base: g, rx: 3.8, ry: 3.2, n: 6, seed: 42, cracks: 0 })
}))

// ================================================================ pierres à demi enterrées
// La pierre entière est construite sous la ligne du bas du canevas (centre enfoui) : seul le dessus sort de
// terre, sans ombre portée ; les deux rangées au ras du sol foncent (la terre mange la base).
const buried = ({ rx, ry, sink = 0.5, n = 7, seed = 1, cracks = 1, mossy = false, squashTop = 1 }) => (c) => {
  const B = Buf(c.w, c.h), g = c.h - 1
  const st = stone(B, { cx: c.w / 2, base: g + Math.round(ry * 2 * sink), rx, ry, n, seed, cracks, squashTop })
  if (mossy) moss(B, st, { seed: seed + 1, depth: 4, x0: 0, x1: Math.round(c.w * 0.8) })
  for (let x = 0; x < c.w; x++) {
    const i0 = GRANITE.indexOf(B.get(x, g)), i1 = GRANITE.indexOf(B.get(x, g - 1))
    if (i0 >= 0) B.set(x, g, GRANITE[Math.min(i0, 1)])
    if (i1 >= 0) B.set(x, g - 1, GRANITE[Math.max(1, Math.min(i1, 2))])
  }
  B.flush(c)
}
sprite("fxrock_buried_48", { w: 48, h: 24 }, buried({ rx: 21, ry: 15, sink: 0.42, n: 8, seed: 11, cracks: 2 }))
sprite("fxrock_buried_flat_48", { w: 48, h: 16 }, buried({ rx: 22, ry: 11, sink: 0.4, n: 7, seed: 5, squashTop: 0.75 }))
sprite("fxrock_buried_32", { w: 32, h: 16 }, buried({ rx: 14, ry: 10, sink: 0.38, n: 7, seed: 4 }))
sprite("fxrock_buried_moss_32", { w: 32, h: 16 }, buried({ rx: 14, ry: 10, sink: 0.38, n: 7, seed: 4, mossy: true }))
sprite("fxrock_buried_moss_48", { w: 48, h: 24 }, buried({ rx: 21, ry: 15, sink: 0.42, n: 8, seed: 11, cracks: 1, mossy: true }))
sprite("fxrock_buried_16", { w: 16, h: 8 }, buried({ rx: 7, ry: 5.5, sink: 0.36, n: 8, seed: 7, cracks: 0 }))

sheet("fxrocks", ["fxrock_*"], { pad: 2 })
