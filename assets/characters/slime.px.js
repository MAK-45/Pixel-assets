include("../_palette.px.js")

const meta = {
  title: "Slime",
  description: "Petit monstre gélatineux animé (respiration en 4 images de 200 ms : écrasement / étirement), en plusieurs couleurs, plus une version immobile et un roi slime couronné.",
  tags: ["slime", "monster", "enemy", "character", "rpg", "animated", "cute"],
  variants: {
    green_idle: { label: "Slime vert – animation repos", props: { color: "green", state: "idle" } },
    blue_idle: { label: "Slime bleu – animation repos", props: { color: "blue", state: "idle" } },
    red_idle: { label: "Slime rouge – animation repos", props: { color: "red", state: "idle" } },
    purple_idle: { label: "Slime violet – animation repos", props: { color: "purple", state: "idle" } },
    green_hurt: { label: "Slime vert – touché", props: { color: "green", state: "hurt" } },
    king_32: { label: "Roi slime couronné (32 px)", props: { color: "green", state: "idle" }, tags: ["boss"] },
  },
}

// Corps en vert (G ombre, g corps, l reflet, L brillance) ; les autres couleurs sont des swaps.
const COLORS = {
  blue: { G: "U", g: "u", l: "i", L: "I" },
  red: { G: "R", g: "r", l: "o", L: "y" },
  purple: { G: "V", g: "v", l: "x", L: "Z" },
}

// Un slime : dôme posé au sol. squash > 0 = écrasé (plus large), < 0 = étiré (plus haut).
const body = (cx, ground, rx, ry, squash = 0, eyes = "open") => (c) => {
  const w = rx + squash, h = ry - squash
  const top = ground - h * 2 + 1
  c.ellipse(cx, ground - h + 1, w, h, "g")
  c.rect(cx - w, ground - Math.floor(h / 2), w * 2 + 1, Math.floor(h / 2) + 1, "g")
  // ombre en bas et à droite
  c.recolor({ g: "G" }, (x, y) => y >= ground - 1 || (x - cx) / w + (y - top) / (h * 2) > 1.25)
  // reflets
  c.px(cx - w + 2, top + 2, "L"); c.px(cx - w + 2, top + 3, "l"); c.px(cx - w + 3, top + 1, "l")
  // yeux
  const ey = ground - h + 1
  if (eyes === "open") {
    c.rect(cx - 3, ey - 1, 2, 3, "k"); c.rect(cx + 2, ey - 1, 2, 3, "k")
    c.px(cx - 3, ey - 1, "w"); c.px(cx + 2, ey - 1, "w")
  } else {
    c.line(cx - 4, ey - 1, cx - 2, ey + 1, "k"); c.line(cx - 4, ey + 1, cx - 2, ey - 1, "k")
    c.line(cx + 2, ey - 1, cx + 4, ey + 1, "k"); c.line(cx + 2, ey + 1, cx + 4, ey - 1, "k")
  }
}

const SQUASH = [0, 1, 0, -1]
const idle = (name, swap) => anim(name, { w: 13, h: 13, frames: 4, fps: 5, outline: "k", ...(swap ? { swap } : {}) },
  (c) => body(6, 12, 5, 5, SQUASH[c.frame])(c))

idle("slime_green_idle")
for (const [color, swap] of Object.entries(COLORS)) idle(`slime_${color}_idle`, swap)

// Touché : écrasé, yeux en croix, couleurs éclaircies (flash d'impact).
sprite("slime_green_hurt", { w: 13, h: 13, outline: "k" }, body(6, 12, 5, 5, 1, "x"),
  recolor({ l: "L", g: "l", G: "g" }))

// Roi : plus gros, avec une couronne dorée.
sprite("_crown", `
  y...y...y
  yy.yYy.yy
  yYyyyyyYy
  yyryyyiyy
  ooooooooo`)
sprite("slime_king_32", { w: 30, h: 28, outline: "k", crop: true },
  body(15, 27, 13, 10, 0),
  rect(9, 15, 4, 5, "k"), rect(18, 15, 4, 5, "k"), rect(9, 15, 2, 2, "w"), rect(18, 15, 2, 2, "w"),
  line(8, 13, 12, 14, "G"), line(22, 13, 18, 14, "G"), // sourcils froncés
  hline(13, 22, 5, "G"),
  stamp("_crown", 11, 4),
)

sheet("slimes", ["slime_*"], { pad: 2 })
