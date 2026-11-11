include("../_palette.px.js")

const meta = {
  title: "Virevoltant",
  description: "Virevoltants (boules de broussailles sèches roulées par le vent), vus de face pour décors de désert et de western : boule sèche (16 et 32 px), boule délavée par le soleil, jeune boule encore verte, et versions animées qui roulent en rebondissant (16 et 32 px, 4 images de 100 ms). Lacis de brindilles, lumière en haut à gauche, contour sombre.",
  tags: ["tumbleweed", "desert", "western", "dry", "plant", "wind", "rolling", "nature", "decoration"],
  variants: {
    dry_16: { label: "Virevoltant sec (16 px)", props: { color: "brown", state: "still" } },
    dry_32: { label: "Virevoltant sec", props: { color: "brown", state: "still" } },
    pale_32: { label: "Virevoltant délavé", props: { color: "pale", state: "still" }, tags: ["bleached"] },
    green_32: { label: "Jeune virevoltant encore vert", props: { color: "green", state: "still" }, tags: ["young"] },
    roll_16: { label: "Virevoltant qui roule (16 px, animé)", props: { color: "brown", state: "rolling" }, tags: ["animated"] },
    roll_32: { label: "Virevoltant qui roule (animé)", props: { color: "brown", state: "rolling" }, tags: ["animated"] },
  },
}

// Lacis de brindilles dans un disque de rayon r : arcs de cercles décalés, ceux du fond en B,
// ceux de devant en b/n, reflets N côté haut gauche. Clés recolorées par `swap` pour les autres teintes.
const PALE = { B: "b", b: "n", n: "N", N: "Y" }
const GREEN = { B: "G", b: "g", n: "l", N: "L" }

const tangle = (r, count, seed, angle = 0, dy = 0) => (c) => {
  const rng = c.rng(seed)
  const cx = r, cy = r
  const inside = (x, y) => (x - cx) ** 2 + (y - cy) ** 2 <= (r + 0.3) ** 2
  // cordes légèrement courbes entre deux points du bord : elles se croisent au centre comme des brindilles
  for (let pass = 0; pass < 2; pass++) for (let i = 0; i < (pass ? count : count >> 1); i++) {
    const a0 = rng() * Math.PI * 2 + angle, a1 = a0 + Math.PI * (0.45 + rng() * 0.9)
    const r0 = r * (0.7 + rng() * 0.3), r1 = r * (0.7 + rng() * 0.3)
    const x0 = cx + Math.cos(a0) * r0, y0 = cy + Math.sin(a0) * r0
    const x1 = cx + Math.cos(a1) * r1, y1 = cy + Math.sin(a1) * r1
    const bend = (rng() - 0.5) * r * 0.8
    const nx = -(y1 - y0), ny = x1 - x0, nl = Math.hypot(nx, ny) || 1
    for (let s = 0; s <= 60; s++) {
      const t = s / 60, b = Math.sin(Math.PI * t) * bend
      const x = Math.round(x0 + (x1 - x0) * t + nx / nl * b), y = Math.round(y0 + (y1 - y0) * t + ny / nl * b)
      if (!inside(x, y)) continue
      // lumière : haut gauche clair, bas droit sombre ; le fond (pass 0) reste sombre
      const lit = (x - cx) + (y - cy) // < 0 : côté éclairé
      const k = pass === 0 ? "B" : lit < -r * 0.7 ? "N" : lit < r * 0.4 ? "n" : "b"
      c.px(x, y + dy, k)
    }
  }
  // pourtour en arcs interrompus : garde la boule ronde
  for (let s = 0; s < 120; s++) {
    const t = s / 120 * Math.PI * 2
    if (Math.sin(5 * (t - angle)) < -0.4) continue
    const x = Math.round(cx + Math.cos(t) * r), y = Math.round(cy + Math.sin(t) * r)
    const lit = Math.cos(t) + Math.sin(t)
    c.px(x, y + dy, lit < -0.6 ? "N" : lit < 0.5 ? "n" : "b")
  }
  // tige cassée qui dépasse en bas
  if (angle === 0) c.px(cx + 1, cy * 2 + dy, "b")
}

sprite("tumbleweed_dry_16", { w: 14, h: 14, outline: "k" }, tangle(6, 6, 3))
sprite("tumbleweed_dry_32", { w: 30, h: 30, outline: "k" }, tangle(14, 14, 5))
sprite("tumbleweed_pale_32", { base: "tumbleweed_dry_32", swap: PALE })
sprite("tumbleweed_green_32", { base: "tumbleweed_dry_32", swap: GREEN })

// Roule vers la droite : l'enchevêtrement tourne d'un quart de tour par 4 images, petit rebond.
const roll = (name, r, count, seed, size) => anim(name, { w: size, h: size, outline: "k", frames: 4, fps: 10 }, (c) => {
  tangle(r, count, seed, c.phase * Math.PI / 2 + 0.01, [1, 0, 0, 1][c.frame])(c)
})
roll("tumbleweed_roll_16", 6, 6, 3, 14)
roll("tumbleweed_roll_32", 14, 14, 5, 30)

sheet("tumbleweeds", ["tumbleweed_*"], { pad: 2 })
