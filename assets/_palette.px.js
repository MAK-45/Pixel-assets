// Palette commune à toute la bibliothèque. Chaque asset commence par :
//   include("../_palette.px.js")
// Clés mnémotechniques (une lettre = une couleur). Majuscule = variante sombre OU claire,
// voir le commentaire de chaque matériau. Les rampes (sombre -> clair) pilotent shade()/light().
// Ajouter une couleur : choisir une clé libre, l'ajouter ici ET dans une rampe, puis `npm run build`.

pal({
  k: "#1a1423", // contour / encre

  // verts feuillus : G sombre -> g -> l -> L clair
  G: "#1f4a2c", g: "#2e7a3a", l: "#5aae45", L: "#a5d75a",
  // verts conifères (froids) : P sombre -> p -> e -> E clair
  P: "#163a37", p: "#215e4f", e: "#348468", E: "#62ad7c",
  // bois / écorce / terre : B sombre -> b -> n -> N clair
  B: "#3b2219", b: "#6a4128", n: "#9c6b3c", N: "#c99a5b",
  // rouge -> orange -> jaune (automne, feu, pommes, or) : R sombre ... Y clair
  R: "#6e1f24", r: "#b23a2c", o: "#e0782a", y: "#f3c34a", Y: "#fff0a8",
  // bleus (eau, potions, glace) : U sombre -> u -> i -> I clair
  U: "#1d2a6b", u: "#2f4fb3", i: "#4f8fe0", I: "#9fd0ff",
  // violets / magie : V sombre -> v -> x clair
  V: "#3f1f63", v: "#7a3fb0", x: "#b77ee0",
  // roses (fleurs, peau rosée) : z -> Z clair
  z: "#e46a9a", Z: "#ffb3cf",
  // gris pierre / métal : d sombre -> m -> c -> C clair
  d: "#2f2d3c", m: "#575670", c: "#8b8aa3", C: "#c3c2d4",
  // neige / blanc : S ombre bleutée -> s -> w blanc
  S: "#8fa3c7", s: "#d3e0f2", w: "#fbfbff",

  // Ambiances des scènes (périodes de la journée), utilisées par recoloration (swap) :
  // crépuscule, terres à contre-jour : D sombre -> a -> A -> f -> F lumière chaude
  D: "#211a33", a: "#3b2b4b", A: "#5e3a5a", f: "#8f4f5f", F: "#d0745f",
  // nuit, terres au clair de lune : q sombre -> j -> J -> t -> T clair
  q: "#0c1224", j: "#14213a", J: "#1d3247", t: "#2a4752", T: "#3f6466",
  // nuit, ciel : Q zénith -> O -> M horizon (puis U, u des bleus)
  Q: "#070a1c", O: "#0f1634", M: "#1b2652",
  // temps couvert, terres sous la pluie : h sombre -> H -> X -> W clair
  h: "#1b2723", H: "#2b3c33", X: "#415646", W: "#62735a",

  // Rendu riche « style pixelfx » (arbres fxtree…) : prolonge les rampes ci-dessus d'un cran
  // plus sombre (bord sélectif, sans contour noir) et d'un reflet pâle, plus des tons lumineux.
  "1": "#12301f", // vert feuillu le plus sombre (sous G), ombre bleutée
  "2": "#dcf28c", // reflet pâle des feuilles (au-dessus de L), soleil jaune
  "3": "#22140f", // écorce la plus sombre (sous B)
  "4": "#0b2228", // conifère le plus sombre (sous P)
  // cerisier : 5 sombre -> 6 -> z -> Z -> 7 pâle
  "5": "#63204a", "6": "#ad4677", "7": "#ffe3ef",
  // turquoise luminescent (magie, esprits) : 8 sombre -> 9 -> 0 -> + pâle
  "8": "#0e3b45", "9": "#1b7f7a", "0": "#3fd0ae", "+": "#b2ffe4",
  // halos et ombres translucides (posés sur le vide, jamais par-dessus un pixel opaque)
  "%": "#1a142366", // ombre portée au sol (k à 40 %)
  ":": "#3fd0ae4a", ";": "#3fd0ae1f", // halo turquoise fort / faible
  "^": "#ffe07a4a", "~": "#ffe07a1f", // halo chaud (lucioles, lanternes) fort / faible
  // pierre intermédiaire (rampe à 7 nuances k d < m > c C, comme la pierre de pixelfx)
  "<": "#413f52", ">": "#71708a",
  // grès intermédiaire (entre b et n)
  "=": "#835632",
  // neige à l'ombre, deux crans bleutés sous S (rampe [ ] S s w, comme la neige de pixelfx)
  "[": "#3e4b72", "]": "#62759f",
  // halo froid du clair de lune (fxmoon, fxstar), translucide, posé sur le vide : fort / faible
  "{": "#c8d4ff40", "}": "#c8d4ff18",
})

ramps(
  "kGglL",  // feuillus
  "kPpeE",  // conifères
  "kBbnN",  // bois
  "kRroyY", // feu / automne
  "kUuiI",  // bleus
  "kVvx",   // violets
  "RzZ",    // roses
  "kdmcC",  // pierre
  "dSsw",   // neige
  "kDaAfF", // crépuscule
  "qjJtT",  // nuit, terres
  "QOMU",   // nuit, ciel
  "khHXW",  // temps couvert
  "1GglL2", // feuillus, rampe riche (style pixelfx)
  "3Bbn",   // bois, cran sombre
  "4Ppe",   // conifères, cran sombre
  "56zZ7",  // cerisier
  "890+",   // turquoise luminescent
  "kd<m>cC", // pierre, rampe riche
  "3Bb=nN",  // grès, rampe riche
  "[]Ssw",   // neige, rampe riche
)
