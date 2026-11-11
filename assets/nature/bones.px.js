include("../_palette.px.js")

const meta = {
  title: "Ossements",
  description: "Ossements blanchis par le soleil pour décors de désert et de western, vus de face : crâne de bovin à cornes (16 et 32 px, posé ou à demi enfoui dans le sable), os seul et os croisés (16 px), cage thoracique à demi ensablée (32 et 48 px). Os blanc à ombres bleutées, cornes brunes, lumière en haut à gauche, contour sombre.",
  tags: ["bones", "skull", "desert", "western", "dead", "skeleton", "ribs", "decoration", "nature"],
  variants: {
    skull_16: { label: "Crâne à cornes (16 px)", props: { kind: "skull", ground: "bare" }, tags: ["cow", "horns"] },
    skull_32: { label: "Crâne de bovin à cornes", props: { kind: "skull", ground: "bare" }, tags: ["cow", "horns"] },
    skull_sand_32: { label: "Crâne à demi enfoui dans le sable", props: { kind: "skull", ground: "sand" }, tags: ["cow", "horns", "sand"] },
    bone_16: { label: "Os (16 px)", props: { kind: "bone", ground: "bare" }, tags: ["icon"] },
    crossed_16: { label: "Os croisés (16 px)", props: { kind: "crossed", ground: "bare" }, tags: ["icon", "danger"] },
    ribs_32: { label: "Cage thoracique ensablée", props: { kind: "ribs", ground: "sand" }, tags: ["carcass"] },
    ribs_48: { label: "Grande cage thoracique ensablée (48 px)", props: { kind: "ribs", ground: "sand" }, tags: ["carcass", "landmark"] },
  },
}

// Os : w reflet, s corps, S ombre bleutée. Cornes : N, n, pointe Y. Sable : Y crête, N corps, n ombre.

// ---------------------------------------------------------------- crânes (symétriques : demi-gauche + mx)
// Le côté droit (après miroir) passe à l'ombre d'un cran.
const rightShade = (from) => recolor({ w: "s", s: "S", N: "n", n: "b" }, (x, y) => x >= from)

sprite("bones_skull_32", { w: 30, h: 22, mx: true, outline: "k" }, `
  Y..............
  NY.............
  Nn.............
  nN.............
  .nNN...........
  ..nnNNN........
  ....nnNssssssss
  ....nnwwwwwwwww
  .....swwwwwwwww
  .....swwsswwwww
  .....swkkkswwww
  .....Skkkkswwww
  ......Skksswwww
  ......Ssswwwwww
  .......sswwwwww
  .......Sswwwwww
  ........swwwwww
  ........sswwwww
  ........Sswwkww
  ........Sswkkww
  .........SSssww
  ..........SSsss`, rightShade(17))

sprite("bones_skull_16", { w: 14, h: 9, mx: true, outline: "k" }, `
  N......
  nN.....
  .nNssss
  ..swwww
  ..skkww
  ..Skwww
  ...swww
  ...Sswk
  ....Sss`, rightShade(8))

// Butte de sable posée sur le bas du canevas : crête claire à gauche, ombre en bas à droite.
const sand = (cx, base, rx, ry) => (c) => {
  const crest = [], dark = []
  for (let x = 0; x < c.w; x++) for (let y = 0; y < c.h; y++) {
    const inS = ((x - cx) / rx) ** 2 + ((y - base) / ry) ** 2 <= 1
    if (!inS) continue
    const above = ((x - cx) / rx) ** 2 + ((y - 1 - base) / ry) ** 2 <= 1
    if (!above && x < cx + rx * 0.3) crest.push([x, y])
    else if (x > cx + rx * 0.4 && y > base - ry * 0.6) dark.push([x, y])
  }
  c.ellipse(cx, base, rx, ry, "N")
  for (const [x, y] of crest) c.px(x, y, "Y")
  for (const [x, y] of dark) c.px(x, y, "n")
}
sprite("bones_skull_sand_32", { base: "bones_skull_32" }, sand(15, 24, 15, 9))

// ---------------------------------------------------------------- os
// Os de (x0, y0) à (x1, y1) : fût de 2 px, deux nœuds ronds à chaque bout.
const bone = (x0, y0, x1, y1) => (c) => {
  c.line(x0, y0, x1, y1, "s", 2)
  for (const [x, y, sx, sy] of [[x0, y0, -1, 1], [x1, y1, 1, -1]]) {
    c.circ(x + sx, y, 1, "s"); c.circ(x, y + sy, 1, "s")
  }
  c.line(x0, y0 - 1, x1 - 1, y1, "w") // reflet le long du fût, côté haut gauche
  c.px(x0 - 1, y0 - 1, "w"); c.px(x1, y1 - 2, "w")
  c.px(x0 + 1, y0 + 2, "S"); c.px(x1 + 2, y1 + 1, "S")
}
sprite("bones_bone_16", { w: 14, h: 14, outline: "k" }, bone(2, 11, 11, 2))
sprite("bones_crossed_16", { w: 14, h: 14, outline: "k" },
  bone(2, 11, 11, 2), (c) => { bone(2, 2, 11, 11)(c) },
  recolor({ w: "s" }, (x, y) => Math.abs(x - y) <= 1 && x > 4 && x < 10))

// ---------------------------------------------------------------- cage thoracique
// Colonne en haut (vertèbres), côtes en arcs qui plongent dans le sable, de plus en plus courtes.
const ribs = (w, h, n, spineY) => (c) => {
  const x0 = 2, x1 = w - 4
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1)
    const x = Math.round(x0 + 2 + t * (x1 - x0 - 8))
    const depth = Math.round((h - spineY) * (1 - 0.3 * t))
    const bow = Math.round((w / 32) * (6 - 2 * t))
    // côte en « ) » : part de la colonne, s'écarte vers l'arrière puis revient en plongeant
    for (let s = 0; s <= 40; s++) {
      const u = s / 40
      const px = Math.round(x + Math.sin(Math.PI * u) * bow), py = Math.round(spineY + 1 + u * depth)
      c.px(px, py, "s"); c.px(px - 1, py, u < 0.5 ? "w" : "s"); c.px(px + 1, py, "S")
    }
  }
  for (let x = x0; x <= x1; x++) {
    c.px(x, spineY - 1, x % 3 === 0 ? "w" : "s")
    c.px(x, spineY, "s"); c.px(x, spineY + 1, "S")
    if (x % 3 === 0) c.px(x, spineY - 2, "s") // apophyses
  }
  c.circ(x0, spineY, 1, "s"); c.px(x1 + 1, spineY, "s"); c.px(x1 + 2, spineY + 1, "S")
}
sprite("bones_ribs_32", { w: 30, h: 20, outline: "k" }, ribs(30, 20, 4, 4), sand(15, 24, 17, 9))
sprite("bones_ribs_48", { w: 46, h: 28, outline: "k" }, ribs(46, 28, 5, 5), sand(23, 34, 25, 13))

sheet("boness", ["bones_*"], { pad: 2 })
