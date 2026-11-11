// Kit des scènes : constantes et outils partagés par toutes les scènes (aucune partie définie ici).
// Chaque scène commence par :
//   include("../_palette.px.js")
//   include("_kit.px.js")
// Modifier le kit touche toutes les scènes : après `npm run build`, vérifier avec
// `git status library/scenes/` que les scènes qu'on ne voulait pas changer n'ont pas bougé.
// API détaillée : .claude/skills/scene-dynamique/references/kit.md

// ================================================================ périodes

const PERIODS = ["day", "dusk", "night", "overcast"]
const PERIOD_LABELS = { day: "Jour", dusk: "Crépuscule", night: "Nuit", overcast: "Sombre" }

// ================================================================ imports

// Taille de chaque partie importée : SIZE["_tree_oak_summer_48"] = { name, w, h, frames, ms }.
const SIZE = {}
// importAssets + mémorise les tailles. imp("nature/tree", ["oak_summer_48"]) définit la partie
// privée "_tree_oak_summer_48" (pixels en clés de palette : swap et recolor marchent).
const imp = (id, keys) => {
  const out = importAssets(id, keys)
  for (const info of Object.values(out)) SIZE[info.name] = info
  return out
}

// ================================================================ placement en bandes qui bouclent

// Pose une partie dans une bande de largeur W qui boucle : ce qui dépasse à droite revient à gauche.
const put = (W, name, x, y, opts = {}) => {
  const { w } = SIZE[name] ?? { w: 0 }
  const out = [stamp(name, x, y, opts)]
  if (x + w > W) out.push(stamp(name, x - W, y, opts))
  if (x < 0) out.push(stamp(name, x + W, y, opts))
  return out
}
// Pose une partie par la base (base = ligne où elle touche le sol).
const plant = (W, name, x, base, opts) => put(W, name, x, base - SIZE[name].h, opts)
// Même chose depuis une fonction de dessin (c = canvas).
const cput = (c, W, name, x, y, opts = {}) => {
  const { w } = SIZE[name]
  c.stamp(name, x, y, opts)
  if (x + w > W) c.stamp(name, x - W, y, opts)
  if (x < 0) c.stamp(name, x + W, y, opts)
}
// Options de placement : jamais { flip: undefined } (pxl le refuse), toujours ce helper.
const flipIf = (cond) => (cond ? { flip: "x" } : {})

// Ligne ondulée qui boucle sur W : somme de sinus [amplitude, nombre de périodes ENTIER, phase].
const wave = (W, base, terms) => (x) =>
  Math.round(base + terms.reduce((s, [amp, n, ph]) => s + amp * Math.sin((x / W) * n * 2 * Math.PI + ph), 0))

// ================================================================ couleurs des périodes

// Rampes de la maison (sombre -> clair), comme dans _palette.px.js.
const RAMPS = ["kGglL", "kPpeE", "kBbnN", "kRroyY", "kUuiI", "kVvx", "RzZ", "kdmcC", "dSsw"]
// Chaque clé avance de n crans sur sa rampe (n < 0 : plus sombre), sans jamais devenir le contour k.
const stepMap = (n) => {
  const out = {}
  for (const r of RAMPS)
    for (let i = 1; i < r.length; i++)
      if (!(r[i] in out)) out[r[i]] = r[Math.max(1, Math.min(r.length - 1, i + n))]
  return out
}
// Clarté des clés de la maison (1 = sombre … 5 = blanc ; le contour k vaut 0 et ne bouge pas).
const TIERS = {
  G: 1, P: 1, B: 1, R: 1, U: 1, V: 1, d: 1,
  g: 2, p: 2, b: 2, r: 2, u: 2, v: 2, m: 2,
  l: 3, e: 3, n: 3, o: 3, i: 3, x: 3, z: 3, c: 3, S: 3,
  L: 4, E: 4, N: 4, y: 4, I: 4, Z: 4, C: 4, s: 4,
  Y: 5, w: 5,
}
// Chaque clé va sur la marche de même clarté d'une rampe d'ambiance (rampe de 5 clés, sombre -> clair).
const byTier = (ramp, shift = 0) => Object.fromEntries(Object.entries(TIERS)
  .map(([k, t]) => [k, ramp[Math.max(0, Math.min(ramp.length - 1, t - 1 + shift))]]))

// Plans proches (prairie, sol, acteurs) : le jour garde les couleurs de la maison ; le crépuscule
// passe à contre-jour (prunes, lumière chaude), la nuit au clair de lune (bleus-verts), le temps
// couvert éteint les verts. Le contour k reste. Les rouges et jaunes (fleurs, fruits) foncent
// d'un cran au lieu de se fondre dans l'ambiance.
const NEAR = {
  day: {},
  dusk: { ...byTier("DaAfF"), z: "R", Z: "z",
    G: "D", g: "a", l: "A", L: "f", P: "D", p: "a", e: "A", E: "f", B: "D", b: "a", n: "A", N: "f",
    d: "D", m: "a", c: "A", C: "f", S: "A", s: "f", w: "F", R: "D", r: "R", o: "r", y: "o", Y: "y" },
  night: { ...byTier("qjJtT"),
    G: "q", g: "j", l: "J", L: "t", P: "q", p: "j", e: "J", E: "t", B: "q", b: "j", n: "J", N: "t",
    d: "q", m: "j", c: "J", C: "t", S: "J", s: "t", w: "T", R: "q", r: "j", o: "J", y: "t", Y: "T" },
  overcast: { ...byTier("hHXWW"), U: "U", u: "U", i: "u", I: "i", V: "V", v: "V", x: "v", z: "R", Z: "z",
    G: "h", g: "H", l: "X", L: "W", P: "h", p: "H", e: "X", E: "W", B: "h", b: "B", n: "b", N: "n",
    d: "d", m: "d", c: "m", C: "c", S: "m", s: "c", w: "C", R: "R", r: "R", o: "r", y: "o", Y: "y" },
}
// Mi-distance (collines) : un cran plus clair et sans contour noir (perspective atmosphérique).
const MID = {
  day: { ...stepMap(1), k: "P", G: "p", g: "e", l: "E", P: "p", p: "e", e: "E", B: "b", b: "n", n: "N" },
  dusk: { ...byTier("DaAfF", 1), k: "D", G: "a", g: "A", l: "f", L: "F", P: "a", p: "A", e: "f", E: "F", B: "a", b: "A", n: "f" },
  night: { ...byTier("qjJtT", 1), k: "q", G: "j", g: "J", l: "t", L: "T", P: "j", p: "J", e: "t", E: "T", B: "j", b: "J", n: "t" },
  overcast: { ...byTier("HXWWW"), d: "m", m: "c", c: "C", C: "C", S: "c", s: "C", w: "C",
    k: "h", G: "H", g: "X", l: "W", L: "W", P: "H", p: "X", e: "W", E: "W", B: "H", b: "X", n: "W" },
}
// Loin (grande montagne) et très loin (chaînes, presque couleur du ciel). Les clés de roche et de
// neige sont réglées à la main ; les autres suivent leur clarté.
const FAR = {
  day: { ...byTier("ScCsw"), k: "c", d: "S", m: "c", c: "C", C: "s", S: "C", s: "s", w: "w" },
  dusk: { ...byTier("VvxZY"), k: "V", d: "V", m: "v", c: "x", C: "Z", S: "x", s: "Z", w: "Y" },
  night: { ...byTier("OMUus"), k: "Q", d: "O", m: "M", c: "U", C: "u", S: "U", s: "S", w: "s" },
  overcast: { ...byTier("dmcCC"), k: "d", d: "d", m: "m", c: "c", C: "C", S: "m", s: "c", w: "c" },
}
const FAR2 = {
  day: { ...byTier("SCssw", 0), k: "S", d: "S", m: "C", c: "s", C: "s", S: "C", s: "s", w: "s" },
  dusk: { ...byTier("vxZZZ"), k: "v", d: "v", m: "x", c: "Z", C: "Z", S: "x", s: "Z", w: "Z" },
  night: { ...byTier("MMUuu"), k: "O", d: "M", m: "M", c: "U", C: "U", S: "U", s: "u", w: "u" },
  overcast: { ...byTier("mccCC"), k: "m", d: "m", m: "c", c: "c", C: "C", S: "c", s: "C", w: "C" },
}
// Premier plan (devant le personnage) : un cran plus sombre que le sol.
const FRONT = {
  day: { ...stepMap(-1), L: "l", l: "g", g: "G" },
  dusk: { ...byTier("DDaAf"), G: "D", g: "D", l: "a", L: "A" },
  night: { ...byTier("qqjJt"), G: "q", g: "q", l: "j", L: "J" },
  overcast: { ...byTier("hhHXW"), G: "h", g: "h", l: "H", L: "X" },
}

// ================================================================ ciel, astres, étoiles, nuages

// Dégradé du ciel par période (clés du haut vers l'horizon), en tuile de 8 px répétée par le moteur.
const SKY = { day: "iIs", dusk: "Vvzoy", night: "QOMU", overcast: "dmmc" }
// Définit "_sky_<période>" : bandes tramées sur les 132 premières lignes, puis la dernière couleur.
const skySprites = (gradients = SKY, soft = 0.3) => {
  for (const P of Object.keys(gradients))
    sprite(`_sky_${P}`, { w: 8, h: 180 }, grad(0, 0, 8, 132, gradients[P], "v", soft), rect(0, 132, 8, 48, gradients[P].slice(-1)))
}

// Cadre commun des astres (position fixe du plan "sky" : body { x, y }) : soleil et lune en haut à
// gauche, d'où vient la lumière de la maison ; au crépuscule, disque bas, à demi caché par le relief.
const BODY = { w: 112, h: 112 }
// Soleil couchant : disque entier (contour, corps orangé, croissant clair à gauche, bord rouge à droite).
const sunsetDisc = (cx = 86, cy = 92, r = 11) => [
  circ(cx, cy, r + 1, "k"), circ(cx, cy, r, "o"),
  clip((x, y) => (x - (cx - 4)) ** 2 + (y - (cy - 4)) ** 2 < 42, circ(cx, cy, r, "y")),
  clip((x, y) => x > cx + 8, circ(cx, cy, r, "r")),
]
// Définit "_body_day", "_body_dusk", "_body_night". Par défaut, importer sky/sun rays_32 et
// sky/moon full_32 ; sunPart / moonPart changent d'astre (ex. "_sun_pale_32", "_moon_crescent_32").
const bodySprites = ({ sun = [0, 0], dusk = [86, 92], moon = [2, 0], sunPart = "_sun_rays_32", moonPart = "_moon_full_32" } = {}) => {
  sprite("_body_day", BODY, stamp(sunPart, sun[0], sun[1]))
  sprite("_body_dusk", BODY, ...sunsetDisc(dusk[0], dusk[1]))
  sprite("_body_night", BODY, stamp(moonPart, moon[0], moon[1]))
}

// Champ d'étoiles fixe (importer sky/star tiny_plus_8) ; `avoid` = [x, y, w, h] laissé vide (la lune).
const starField = (count, maxY, seed, avoid = [0, 0, 78, 52], W = 320) => (c) => {
  const r = rng(seed)
  for (let i = 0; i < count; i++) {
    const x = Math.floor(r() * W), y = Math.floor(r() * maxY)
    if (x >= avoid[0] && x < avoid[0] + avoid[2] && y >= avoid[1] && y < avoid[1] + avoid[3]) continue
    if (r() < 0.12) c.stamp("_star_tiny_plus_8", x - 1, y - 1)
    else c.px(x, y, r() < 0.5 ? "w" : r() < 0.6 ? "s" : "S")
  }
}

// Bande de nuages espacés irrégulièrement (jamais en papier peint) : list = parties importées.
const cloudBand = (W, list, seed, rows = [0, 40]) => (c) => {
  const r = rng(seed)
  let x = 10
  while (x < W - 10) {
    const name = list[Math.floor(r() * list.length)]
    const y = rows[0] + Math.floor(r() * (rows[1] - rows[0]))
    cput(c, W, name, x, y, flipIf(r() < 0.5))
    x += SIZE[name].w + 30 + Math.floor(r() * 90)
  }
}
// Recoloration des nuages d'orage pour le temps couvert, et des nuages de nuit.
const STORM = { C: "c", c: "m", m: "d", k: "d" }
const NIGHT_CLOUD = { k: "O", d: "M", m: "U", c: "S" }
// Temps couvert : plafond continu, bosselé en dessous par des nuages d'orage de tailles et
// d'espacements irréguliers, plus quelques lambeaux bas (importer cloud storm_32 et puff_24).
// À utiliser dans un sprite qui porte { swap: STORM }.
const overcastCeiling = (W, seed) => (c) => {
  const r = rng(seed)
  c.rect(0, 0, W, 9, "m")
  for (let x = -12; x < W; x += 14 + Math.floor(r() * 34))
    cput(c, W, "_cloud_storm_32", x, -6 + Math.floor(r() * 13), flipIf(r() < 0.5))
  for (let i = 0; i < 7; i++)
    cput(c, W, i % 2 ? "_cloud_storm_32" : "_cloud_puff_24", Math.floor(r() * W), 20 + Math.floor(r() * 16), flipIf(r() < 0.5))
}

// ================================================================ terrains et acteurs

// Bande de terrain au bord ondulé : contour, liseré clair, corps, plus sombre en bas.
// keys = { edge, rim, lit, body, deep } (herbe par défaut ; neige : { rim: "w", lit: "s", body: "s", deep: "S" }…).
const field = (W, top, h, keys = {}) => (c) => {
  const k = { edge: "k", rim: "L", lit: "l", body: "g", deep: "G", ...keys }
  for (let x = 0; x < W; x++) {
    const t = top(x)
    c.px(x, t - 1, k.edge)
    for (let y = t; y < h; y++) c.px(x, y, y === t ? k.rim : y < t + 3 ? k.lit : y < t + 9 ? k.body : k.deep)
  }
}

// Acteur animé recoloré par période : définit "_act_<nom>_<période>" à partir d'une animation importée.
const periodActor = (name, src, maps) => {
  const { w, h } = SIZE[src]
  for (const P of PERIODS) sprite(`_act_${name}_${P}`, { w, h }, stamp(src, 0, 0, { swap: maps[P] ?? {} }))
}
// Liste d'acteurs pour meta.scene : un par x, phases décalées, un sur deux retourné.
const actorsAt = (sprite, xs, y, { phaseStep = 337, loop = 800, flip = true } = {}) =>
  xs.map((x, i) => ({ sprite, x, y, phase: (i * phaseStep) % loop, ...(flip && i % 2 ? { flip: true } : {}) }))
