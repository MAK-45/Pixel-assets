include("../_palette.px.js")

const meta = {
  title: "Lampadaire",
  description: "Lampadaires de rue vus de face pour décors 2D : petit lampadaire de chemin (16 px), potence classique (32 px) et tête moderne (32 px), double globe à l'ancienne (48 px). Chaque modèle existe allumé (verre jaune, halo) ou éteint (verre pâle). Fût sombre en fonte, socle élargi, lumière en haut à gauche.",
  tags: ["lamp", "street-lamp", "lamppost", "light", "urban", "night", "furniture"],
  variants: {
    post_16_on: { label: "Petit lampadaire de chemin, allumé (16 px)", props: { shape: "post", state: "on" }, tags: ["glow", "path"] },
    classic_32_on: { label: "Lampadaire à potence, allumé (32 px)", props: { shape: "classic", state: "on" }, tags: ["glow"] },
    classic_32_off: { label: "Lampadaire à potence, éteint (32 px)", props: { shape: "classic", state: "off" } },
    modern_32_on: { label: "Lampadaire moderne, allumé (32 px)", props: { shape: "modern", state: "on" }, tags: ["glow"] },
    modern_32_off: { label: "Lampadaire moderne, éteint (32 px)", props: { shape: "modern", state: "off" } },
    double_48_on: { label: "Double globe à l'ancienne, allumé (48 px)", props: { shape: "double", state: "on" }, tags: ["glow", "victorian"] },
    double_48_off: { label: "Double globe à l'ancienne, éteint (48 px)", props: { shape: "double", state: "off" }, tags: ["victorian"] },
  },
}

// Fût : colonne sombre, bord clair à gauche (lumière en haut à gauche).
const pole = (x, y0, y1, w = 2) => [
  rect(x, y0, w, y1 - y0 + 1, "d"),
  vline(x, y0, y1 - y0 + 1, "m"),
]

// Verre allumé (jaune, cœur clair) ou éteint (pâle, reflet blanc).
const glass = (on, x, y, w, h) => on
  ? [rect(x, y, w, h, "y"), rect(x + 1, y + 1, w - 2, h - 2, "Y")]
  : [rect(x, y, w, h, "s"), px(x + 1, y + 1, "w"), hline(x, y + h - 1, w, "S")]

// ================================================================ petit lampadaire (16 px)
sprite("lamp_post_16_on", { w: 6, h: 14, outline: "k" },
  hline(1, 0, 4, "d"),                       // toit
  rect(1, 1, 4, 3, "y"), px(2, 2, "Y"), px(3, 2, "Y"),
  hline(1, 4, 4, "d"),                        // dessous de la lanterne
  rect(2, 5, 2, 7, "d"), vline(2, 5, 7, "m"),
  rect(1, 12, 4, 2, "d"),                     // socle
  glow("y", { r: 3, strength: 0.4 }),
)

// ================================================================ potence classique (32 px)
// 14 x 30 : lanterne en haut, fût, socle élargi.
const classicBody = (on) => [
  poly([1, 6, 6, 1, 8, 1, 13, 6], "d"),       // toit en pointe
  rect(3, 6, 8, 5, "d"),                      // cadre
  ...glass(on, 4, 7, 6, 4),
  hline(2, 11, 10, "d"),                      // rebord
  ...pole(6, 12, 26, 2),
  rect(3, 26, 8, 2, "d"), hline(3, 26, 8, "m"),   // collerette
  rect(2, 28, 10, 2, "d"),                    // socle
]
sprite("lamp_classic_32_on", { w: 14, h: 30, outline: "k" }, ...classicBody(true),
  glow("y", { r: 5, strength: 0.5 }))
sprite("lamp_classic_32_off", { w: 14, h: 30, outline: "k" }, ...classicBody(false))

// ================================================================ tête moderne (32 px)
const modernBody = (on) => [
  rect(2, 1, 10, 2, "d"), hline(2, 1, 10, "m"),          // boîtier
  ...glass(on, 3, 3, 8, 2),
  hline(1, 5, 12, "d"),                                   // lèvre
  ...pole(6, 6, 26, 2),
  rect(3, 26, 8, 2, "d"), hline(3, 26, 8, "m"),
  rect(2, 28, 10, 2, "d"),
]
sprite("lamp_modern_32_on", { w: 14, h: 30, outline: "k" }, ...modernBody(true),
  glow("y", { r: 5, strength: 0.5 }))
sprite("lamp_modern_32_off", { w: 14, h: 30, outline: "k" }, ...modernBody(false))

// ================================================================ double globe (48 px)
// 22 x 46 : deux globes sur une barre horizontale, fût central, socle large.
const globe = (on, cx, cy, r) => on
  ? [circ(cx, cy, r, "y"), circ(cx - 1, cy - 1, r - 2, "Y"), px(cx - r + 1, cy - 1, "w")]
  : [circ(cx, cy, r, "s"), recolor({ s: "S" }, (x, y) => (x - cx) ** 2 + (y - cy) ** 2 > (r - 1) ** 2 && (x > cx || y > cy)), px(cx - r + 1, cy - 1, "w")]
const doubleBody = (on) => [
  rect(3, 1, 15, 2, "d"), hline(3, 1, 15, "m"),           // chapeau du fût
  hline(4, 12, 14, "d"),                                  // barre
  rect(4, 13, 14, 1, "m"),
  ...globe(on, 5, 8, 4),
  ...globe(on, 16, 8, 4),
  rect(3, 5, 5, 1, "d"), rect(14, 5, 5, 1, "d"),          // coiffes
  ...pole(10, 13, 40, 2),
  rect(7, 40, 8, 3, "d"), hline(7, 40, 8, "m"),          // collerette
  rect(5, 43, 12, 3, "d"),                                // socle
]
sprite("lamp_double_48_on", { w: 22, h: 46, outline: "k" }, ...doubleBody(true),
  glow("y", { r: 6, strength: 0.5 }))
sprite("lamp_double_48_off", { w: 22, h: 46, outline: "k" }, ...doubleBody(false))

sheet("lampadaires", ["lamp_*"], { pad: 2 })
