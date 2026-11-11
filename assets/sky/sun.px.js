include("../_palette.px.js")

const meta = {
  title: "Soleil",
  description: "Soleils pour ciels et icônes météo : soleil à rayons (16, 32 px), soleil souriant, rayons qui tournent (animé), soleil pâle d'hiver, soleil couchant sur l'horizon, éclipse avec couronne et soleil derrière un nuage. Disque ombré en croissant (lumière en haut à gauche), rayons triangulaires alternés longs/courts.",
  tags: ["sun", "sky", "weather", "sunny", "day", "light", "icon"],
  variants: {
    rays_16: { label: "Soleil à rayons (16 px)", props: { style: "rays", mood: "plain", time: "day" }, tags: ["icon"] },
    rays_32: { label: "Soleil à rayons", props: { style: "rays", mood: "plain", time: "day" } },
    smile_32: { label: "Soleil souriant", props: { style: "rays", mood: "smile", time: "day" }, tags: ["cute", "face"] },
    spin_32: { label: "Soleil rayonnant (animé)", props: { style: "rays", mood: "plain", time: "day" }, tags: ["animated"] },
    pale_32: { label: "Soleil pâle d'hiver", props: { style: "rays", mood: "plain", time: "winter" }, tags: ["winter", "cold"] },
    setting_32: { label: "Soleil couchant sur l'horizon", props: { style: "disc", mood: "plain", time: "sunset" }, tags: ["sunset", "dusk", "horizon"] },
    eclipse_32: { label: "Éclipse solaire", props: { style: "corona", mood: "plain", time: "eclipse" }, tags: ["eclipse", "dark"] },
    cloudy_32: { label: "Soleil derrière un nuage", props: { style: "rays", mood: "plain", time: "day" }, tags: ["cloud", "weather", "partly-cloudy"] },
  },
}

// Disque : Y calotte éclairée en haut à gauche, y corps, o croissant d'ombre en bas à droite.
const inCirc = (cx, cy, r) => (x, y) => (x + 0.5 - cx) ** 2 + (y + 0.5 - cy) ** 2 <= r * r
const disc = (cx, cy, r, { hi = "Y", mid = "y", lo = "o" } = {}) => (c) => {
  for (let y = 0; y < c.h; y++)
    for (let x = 0; x < c.w; x++) {
      if (!inCirc(cx, cy, r)(x, y)) continue
      let col = mid
      if (!inCirc(cx - 1, cy - 1, r)(x, y)) col = lo
      else if (inCirc(cx - r * 0.35, cy - r * 0.35, r * 0.45)(x, y)) col = hi
      c.px(x, y, col)
    }
}
// Rayons triangulaires : n rayons, alternés longs (r1) / courts (r1s), base à r0, demi-largeur hw.
// Ceux tournés vers le bas à droite prennent la teinte d'ombre.
const rays = (cx, cy, { n = 8, r0, r1, r1s = r1, hw = 2, a0 = 0, lit = "y", dark = "o" }) => (c) => {
  for (let i = 0; i < n; i++) {
    const a = a0 + (i * 2 * Math.PI) / n - Math.PI / 2
    const len = i % 2 ? r1s : r1
    const ux = Math.cos(a), uy = Math.sin(a)
    const pts = [
      cx + ux * r0 - uy * hw, cy + uy * r0 + ux * hw,
      cx + ux * len, cy + uy * len,
      cx + ux * r0 + uy * hw, cy + uy * r0 - ux * hw,
    ].map((v) => Math.round(v))
    c.poly(pts, ux + uy > 0.3 ? dark : lit)
  }
}

// ---------------------------------------------------------------- soleil à rayons
const SUN32 = [rays(15, 15, { r0: 10.5, r1: 15.5, r1s: 13.5, hw: 1.6 }), disc(15, 15, 8)]
sprite("sun_rays_32", { w: 30, h: 30, outline: "k" }, ...SUN32)
sprite("sun_pale_32", { base: "sun_rays_32", swap: { Y: "w", y: "Y", o: "y" } })
sprite("sun_smile_32", { w: 30, h: 30, outline: "k" }, ...SUN32,
  rect(11, 12, 2, 3, "k"), rect(17, 12, 2, 3, "k"), px(11, 12, "w"), px(17, 12, "w"),   // yeux
  rect(9, 16, 2, 1, "z"), rect(19, 16, 2, 1, "z"),                                     // joues
  hline(13, 18, 4, "k"), px(12, 17, "k"), px(17, 17, "k"))                            // sourire
anim("sun_spin_32", { w: 30, h: 30, outline: "k", frames: 4, fps: 8 },
  (c) => rays(15, 15, { r0: 10.5, r1: 15.5, r1s: 13.5, hw: 1.6, a0: (c.phase * Math.PI) / 4 })(c),
  disc(15, 15, 8))

// 16 px dessiné à la main : disque de 6 px, 4 rayons droits et 4 points en diagonale.
sprite("sun_rays_16", { mx: true, outline: "k" }, `
  ......y
  .......
  .y.....
  ....YYy
  ...YYyy
  ...Yyyy
  y..yyyy
  ...yyyy
  ...yyyo
  ....yoo
  .......
  .o.....
  .......
  ......o`, (c) => c.recolor({ Y: "y" }, (x) => x > 6), (c) => c.recolor({ y: "o" }, (x, y) => x > 6 && y > 7 && c.is(x, y, "y") && (x + y > 16)))

// ---------------------------------------------------------------- soleil couchant
// Moitié haute du disque posée sur l'horizon, reflets en tirets sur l'eau en dessous.
sprite("sun_setting_32", { w: 30, h: 20, outline: "k" },
  clip([0, 0, 30, 12], disc(15, 12, 11, { hi: "y", mid: "o", lo: "r" })),
  hline(0, 12, 30, "R"),
  hline(8, 14, 14, "o"), hline(10, 16, 10, "r"), hline(12, 18, 6, "o"),
  px(9, 14, "y"), px(10, 14, "y"), px(12, 18, "y"))

// ---------------------------------------------------------------- éclipse
// Lune noire devant le soleil : seule la couronne (rayons fins pâles) et un anneau lumineux dépassent.
sprite("sun_eclipse_32", { w: 30, h: 30, outline: "k" },
  rays(15, 15, { n: 12, r0: 8, r1: 15, r1s: 12, hw: 1.5, lit: "Y", dark: "y" }),
  disc(15, 15, 9, { hi: "Y", mid: "Y", lo: "y" }),
  disc(15, 15, 8, { hi: "d", mid: "d", lo: "k" }),
  px(10, 10, "m"), px(9, 11, "m"), px(11, 9, "m"))

// ---------------------------------------------------------------- soleil voilé par un nuage
const cloud = (puffs, bottom) => (c) => {
  const U = (ox, oy, dr, cut) => (x, y) => y < cut && puffs.some(([cx, cy, r]) => inCirc(cx + ox, cy + oy, r + dr)(x, y))
  for (const [inside, col] of [[U(0, 0, 0, bottom), "S"], [U(-0.5, -1, -0.5, bottom - 2), "s"], [U(-1.2, -1.8, -2, bottom - 4), "w"]])
    for (let y = 0; y < c.h; y++) for (let x = 0; x < c.w; x++) if (inside(x, y)) c.px(x, y, col)
}
sprite("_front_cloud", { w: 24, h: 13 }, cloud([[6, 9, 4.5], [12, 7, 6], [18, 9, 5], [3, 10, 3]], 13))
sprite("sun_cloudy_32", { w: 30, h: 30, outline: "k" },
  rays(12, 12, { r0: 9, r1: 13, r1s: 11.5, hw: 1.5 }), disc(12, 12, 6.5),
  stamp("_front_cloud", 5, 15, { outline: "k" }))

sheet("suns", ["sun_*"], { pad: 2 })
