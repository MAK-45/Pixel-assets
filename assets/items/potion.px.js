include("../_palette.px.js")

const meta = {
  title: "Potion",
  description: "Fioles de potion pour inventaire ou butin : petite fiole ronde, bouteille haute et grand flacon à bulles, en plusieurs couleurs de liquide (soin, mana, poison, magie, énergie).",
  tags: ["potion", "item", "loot", "consumable", "rpg", "inventory", "icon"],
  variants: {
    red_small: { label: "Petite potion rouge (soin)", props: { liquid: "red", effect: "health", shape: "round" } },
    blue_small: { label: "Petite potion bleue (mana)", props: { liquid: "blue", effect: "mana", shape: "round" } },
    green_small: { label: "Petite potion verte (poison)", props: { liquid: "green", effect: "poison", shape: "round" } },
    purple_small: { label: "Petite potion violette (magie)", props: { liquid: "purple", effect: "magic", shape: "round" } },
    yellow_small: { label: "Petite potion jaune (énergie)", props: { liquid: "yellow", effect: "stamina", shape: "round" } },
    red_bottle: { label: "Bouteille rouge", props: { liquid: "red", effect: "health", shape: "bottle" } },
    blue_bottle: { label: "Bouteille bleue", props: { liquid: "blue", effect: "mana", shape: "bottle" } },
    green_bottle: { label: "Bouteille verte", props: { liquid: "green", effect: "poison", shape: "bottle" } },
    red_large: { label: "Grand flacon rouge à bulles", props: { liquid: "red", effect: "health", shape: "flask" } },
    blue_large: { label: "Grand flacon bleu à bulles", props: { liquid: "blue", effect: "mana", shape: "flask" } },
    purple_large: { label: "Grand flacon violet à bulles", props: { liquid: "purple", effect: "magic", shape: "flask" } },
    empty_large: { label: "Grand flacon vide", props: { liquid: "none", effect: "none", shape: "flask" } },
  },
}

// Le liquide est dessiné en rouge (R sombre, r moyen, o surface/reflet) ; les autres couleurs sont des swaps.
const LIQUID = {
  blue: { R: "U", r: "u", o: "i" },
  green: { R: "G", r: "g", o: "l" },
  purple: { R: "V", r: "v", o: "x" },
  yellow: { R: "b", r: "o", o: "y" },
}
// Verre : s (corps), S (ombre du verre), w (reflets). Bouchon : n / b.
// Ombre en croissant : tout ce qui sort d'un cercle décalé vers la lumière (en haut à gauche).
const outside = (cx, cy, r) => (x, y) => (x - cx) ** 2 + (y - cy) ** 2 > r * r

// ---------------------------------------------------------------- petite fiole ronde (16 px)
sprite("potion_red_small", { w: 13, h: 14, outline: "k" },
  rect(5, 0, 3, 2, "n"), px(7, 1, "b"), px(7, 0, "b"),          // bouchon
  rect(5, 2, 3, 3, "s"), px(7, 3, "S"), px(7, 4, "S"),           // col
  circ(6, 9, 5, "s"),                                            // panse en verre
  clip([0, 7, 13, 7], circ(6, 9, 4, "r")),                       // liquide sous le niveau
  hline(3, 7, 7, "o"),                                           // surface
  recolor({ r: "R" }, outside(5, 8, 4.5)),                       // ombre du liquide
  recolor({ s: "S" }, outside(5, 8, 5.2)),                       // ombre du verre
  vline(7, 2, 3, "S"),
  px(5, 3, "w"), px(3, 8, "w"), px(2, 9, "w"), px(2, 10, "w"),   // reflets
  px(5, 10, "o"), px(8, 9, "o"),                                 // bulles
)
for (const [name, swap] of Object.entries(LIQUID))
  sprite(`potion_${name}_small`, { base: "potion_red_small", swap })

// ---------------------------------------------------------------- bouteille haute (24 px)
sprite("potion_red_bottle", { w: 10, h: 22, outline: "k" },
  rect(3, 0, 4, 3, "n"), vline(6, 0, 3, "b"), hline(3, 3, 4, "b"),   // bouchon + cire
  rect(3, 4, 4, 4, "s"), vline(6, 4, 4, "S"),                         // col
  poly([3, 8, 7, 8, 10, 11, 10, 22, 0, 22, 0, 11], "s"),              // épaules + corps
  rect(1, 11, 8, 10, "r"), hline(1, 11, 8, "o"),                      // liquide
  rect(1, 14, 8, 4, "N"), hline(1, 14, 8, "n"), hline(1, 17, 8, "b"), // étiquette
  px(3, 15, "B"), px(4, 16, "B"), px(5, 15, "B"), px(6, 16, "B"),     // motif de l'étiquette
  recolor({ r: "R", N: "n", s: "S" }, (x) => x >= 7),
  vline(1, 9, 2, "w"), vline(1, 18, 2, "w"), px(4, 5, "w"),           // reflets
)
for (const name of ["blue", "green"])
  sprite(`potion_${name}_bottle`, { base: "potion_red_bottle", swap: LIQUID[name] })

// ---------------------------------------------------------------- grand flacon à bulles (32 px)
sprite("_bubble_a", "o")
sprite("_bubble_b", `
  .o.
  o.o
  .o.`)
const FLASK = [
  rect(12, 0, 6, 3, "n"), vline(17, 0, 3, "b"), hline(11, 3, 8, "b"), hline(11, 4, 8, "n"),  // bouchon
  rect(12, 5, 6, 6, "s"), vline(17, 5, 6, "S"),                                              // col
  circ(15, 19, 11, "s"),                                                                     // panse
]
const FLASK_LIGHT = [
  recolor({ s: "S" }, outside(13, 17, 11)),
  px(13, 6, "w"), px(13, 7, "w"),
  line(7, 13, 5, 17, "w"), px(5, 18, "w"), px(6, 25, "w"),
]
sprite("potion_red_large", { w: 30, h: 30, outline: "k" },
  ...FLASK,
  clip([0, 15, 30, 15], circ(15, 19, 10, "r")),
  hline(6, 15, 19, "o"), hline(8, 16, 15, "r"),
  recolor({ r: "R" }, outside(13, 17, 9.6)),
  scatter("_bubble_*", 7, 17, 16, 10, 7, { on: "rR", seed: 3 }),
  ...FLASK_LIGHT,
)
for (const name of ["blue", "purple"])
  sprite(`potion_${name}_large`, { base: "potion_red_large", swap: LIQUID[name] })
sprite("potion_empty_large", { w: 30, h: 30, outline: "k" }, ...FLASK, ...FLASK_LIGHT,
  hline(8, 28, 15, "S"), px(12, 27, "C"), px(18, 27, "C"))

sheet("potions", ["potion_*"], { pad: 2 })
