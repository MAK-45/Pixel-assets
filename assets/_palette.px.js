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
)
