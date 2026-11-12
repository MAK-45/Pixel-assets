// « Plaine d’été » — a 2.5D map for Couveuse (side view with depth, see CARTE-2.5D.md).
// ES module, no dependency. Draws with the painter passed in (subset of the pixelfx painter):
//   p.px, p.dot, p.light, p.glow, p.line, p.sprite.
// The drawing is a pure function of (t, options): no state between frames, no randomness while
// drawing (everything random is seeded once at load), every motion makes a whole number of turns
// per loop D, so render(t) === render(t + D) pixel for pixel.
//
// Per frame, Couveuse does:  mapBack(p, t, o) -> sort mapItems(t, o) with the creature by (gy, x, id)
// -> draw them -> mapFront(p, t, o).
import { ASSETS } from "./assets.js";

// --------------------------------------------------------------------------------------------
// Palettes (8 tones, darkest to lightest). Glace is the spec's default; the others are stand-ins
// for previews: Couveuse passes its own palette in `o.palette`.

export const PALETTES = {
  glace: { label: "Glace", tones: ["#081026", "#102654", "#1a4a90", "#2c7ccc", "#58b6ee", "#9fe0ff", "#dcf8ff", "#ffffff"] },
  seve: { label: "Sève", tones: ["#071a10", "#0e3320", "#17552c", "#2a823a", "#56b04a", "#98da6a", "#d6f5a8", "#ffffff"] },
  braise: { label: "Braise", tones: ["#1a0808", "#3a1010", "#6a1e12", "#a03a18", "#d8682a", "#f6a64e", "#ffe0a0", "#ffffff"] },
  aurore: { label: "Aurore", tones: ["#160a24", "#2c1248", "#4a1f74", "#7a34a0", "#b85cc0", "#ee94c8", "#ffd2e4", "#ffffff"] },
};

// --------------------------------------------------------------------------------------------
// Settings (§ 7). Keys are stable; labels are French.

export const OPTIONS = {
  anim: { label: "Animation du décor", min: 0, max: 1, step: 0.05, def: 1, unit: "" },
  glow: { label: "Lueur du décor", min: 0, max: 2, step: 0.05, def: 1, unit: "" },
  fog: { label: "Brume de profondeur", min: 0, max: 3, step: 1, def: 1, unit: "" },
  snow: { label: "Neige", min: 0, max: 80, step: 1, def: 0, unit: "flocons" },
  stars: { label: "Étoiles", min: 0, max: 200, step: 1, def: 60, unit: "" },
  fireflies: { label: "Lucioles", min: 0, max: 60, step: 1, def: 24, unit: "" },
  horizon: { label: "Hauteur de l’horizon", min: 20, max: 70, step: 1, def: 42, unit: "%" },
  gyBack: { label: "Profondeur du sol : fond", min: 25, max: 90, step: 1, def: 55, unit: "%" },
  gyFront: { label: "Profondeur du sol : devant", min: 40, max: 100, step: 1, def: 93, unit: "%" },
};

// --------------------------------------------------------------------------------------------
// The map (§ 10). Positions are scene pixels for 480 x 270; gy = where a thing touches the ground.

const POND = { x: 38, gy: 180, rx: 80, ry: 15 };

/** Walkable polygon: the whole field, minus the pond on the left (its shore, 4 px wide). */
function walkPolygon() {
  const pts = [[0, 149], [480, 149], [480, 251], [0, 251]];
  const m = 4, rx = POND.rx + m, ry = POND.ry + m;
  const shore = [];
  // from the bottom of the pond at x = 0, around its right side, back to x = 0 at the top
  const a0 = Math.acos(Math.max(-1, Math.min(1, (0 - POND.x) / rx)));
  for (let i = 0; i <= 16; i++) {
    const a = a0 - (i / 16) * 2 * a0; // a0 .. -a0 through 0 (the right side)
    shore.push([Math.round(POND.x + rx * Math.cos(a)), Math.round(POND.gy + ry * Math.sin(a))]);
  }
  return [pts[0], pts[1], pts[2], pts[3], ...shore];
}

const I = (id, asset, x, gy, extra = {}) => ({ id, asset, x, gy, flip: false, ...extra });

export const MAP = {
  version: 1,
  name: "Plaine d’été",
  scene: { w: 480, h: 270 },
  horizon: 0.42, gyBack: 0.55, gyFront: 0.93,
  seed: 1789,
  walk: walkPolygon(),
  floor: {
    style: "meadow",
    pond: POND,
    // the dirt path, as (x, gy) points from the front to the back
    path: [[236, 276], [246, 244], [229, 214], [236, 192], [262, 172], [286, 158], [298, 149]],
  },
  assets: ASSETS,
  items: [
    // ---- back: far ranges and peaks on the horizon (fog + extra), then hills and a far tree line
    I("rg1", "range", 20, 113, { layer: "back", fogExtra: 2 }),
    I("rg2", "range", 84, 113, { layer: "back", fogExtra: 2, flip: true }),
    I("rg3", "range", 212, 113, { layer: "back", fogExtra: 2 }),
    I("rg4", "range", 272, 113, { layer: "back", fogExtra: 2, flip: true }),
    I("rg5", "range", 352, 113, { layer: "back", fogExtra: 2 }),
    I("rg6", "range", 440, 113, { layer: "back", fogExtra: 2, flip: true }),
    I("mt1", "mountain", 150, 113, { layer: "back", fogExtra: 1 }),
    I("mt2", "peak", 318, 113, { layer: "back", fogExtra: 1, flip: true }),
    I("mt3", "peak", 470, 113, { layer: "back", fogExtra: 1 }),
    I("hl1", "hills_flowers", 30, 140, { layer: "back" }),
    I("hl2", "hills", 92, 142, { layer: "back", flip: true }),
    I("hl3", "hill", 150, 144, { layer: "back" }),
    I("hl4", "hills", 214, 141, { layer: "back" }),
    I("hl5", "hill", 268, 145, { layer: "back", flip: true }),
    I("hl6", "hills_flowers", 342, 141, { layer: "back", flip: true }),
    I("hl7", "hills", 420, 142, { layer: "back" }),
    I("hl8", "hill", 474, 144, { layer: "back" }),
    I("tf1", "tree_far", 58, 146, { layer: "back" }),
    I("tf2", "pine_far", 70, 147, { layer: "back" }),
    I("tf3", "tree_mid", 176, 148, { layer: "back" }),
    I("tf4", "tree_far", 198, 147, { layer: "back", flip: true }),
    I("tf5", "pine_far", 354, 147, { layer: "back" }),
    I("tf6", "tree_far", 366, 148, { layer: "back" }),
    I("tf7", "pine_far", 377, 146, { layer: "back" }),
    I("tf8", "tree_mid", 444, 148, { layer: "back", flip: true }),

    // ---- play: by the pond (left)
    I("pine", "pine_big", 14, 156),
    I("birch", "birch", 66, 160),
    I("reed1", "reeds", 100, 168),
    I("reed2", "reeds", 12, 200, { flip: true }),
    I("reed3", "reeds", 116, 186),
    I("bell1", "bluebell", 120, 196),
    I("bell2", "bluebell", 128, 199, { flip: true }),
    I("fern1", "fern", 118, 167),
    // ---- play: back of the field
    I("hedge", "hedge", 200, 156),
    I("tuftA", "tuft", 168, 160),
    I("cairn", "cairn", 324, 155),
    I("bushB", "bush_berry", 150, 176, { flip: true }),
    // ---- play: the big oak (right) and its glowing mushrooms
    I("oak", "oak_big", 386, 168),
    I("msh1", "mushroom_glow", 366, 172),
    I("msh2", "mushroom_glow", 404, 171, { flip: true }),
    I("msh3", "mushroom_glow", 375, 175),
    I("fern2", "fern", 422, 174, { flip: true }),
    I("bushR", "bush", 470, 196),
    // ---- play: middle of the field
    I("rock", "boulder", 172, 200),
    I("stone", "stone", 194, 205),
    I("sun1", "sunflower", 318, 204),
    I("sun2", "sunflower", 334, 207, { flip: true }),
    I("sun3", "sunflower", 326, 212),
    I("lav1", "lavender", 418, 214),
    I("lav2", "lavender", 428, 218, { flip: true }),
    I("lav3", "lavender", 438, 213),
    I("tw1", "tall_wind", 44, 216, { turns: 1 }),
    I("tw2", "tuft_wind", 206, 230, { turns: 2 }),
    I("tw3", "tuft_wind", 384, 228, { turns: 1, flip: true }),
    I("peb1", "pebbles", 292, 226),
    I("clov", "clover", 268, 244),
    // ---- play: front of the field
    I("tul1", "tulip_red", 112, 226),
    I("tul2", "tulip_red", 121, 230, { flip: true }),
    I("tul3", "tulip_yellow", 130, 225),
    I("dai1", "daisy", 152, 240),
    I("dai2", "daisy", 162, 236, { flip: true }),
    I("pop1", "poppy", 352, 240),
    I("pop2", "poppy", 362, 245, { flip: true }),
    I("pop3", "poppy", 372, 239),
    I("bed", "flower_bed", 300, 248),
    I("bushF", "bush_flower", 92, 246),
    I("tuftF", "tuft", 196, 250),
    I("crag", "crag", 446, 250),
    I("tw4", "tall_wind", 470, 236, { turns: 2, flip: true }),
    // ---- play: little animals (moved by code; x, gy = centre of their flight)
    I("bfly1", "butterfly", 300, 196, { actor: { rx: 44, rgy: 10, h: 24, laps: 1 } }),
    I("bfly2", "butterfly_blue", 136, 226, { actor: { rx: 30, rgy: 6, h: 16, laps: 2 } }),

    // ---- front (y = bottom of the sprite, may be below the scene)
    I("fg1", "grass_front", 16, 276, { layer: "front", turns: 1 }),
    I("fg2", "fern_front", 92, 286, { layer: "front", flip: true }),
    I("fg3", "grass_front", 464, 278, { layer: "front", turns: 1, flip: true }),
  ],
  home: { x: 240, gy: 205 },
};

// --------------------------------------------------------------------------------------------
// Seeded randomness (drawn once, at load) and helpers.

function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
/** Deterministic hash of integers -> [0, 1). */
function hash(x, y, s = MAP.seed) {
  let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(s | 0, 2246822519);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
/** Smooth value noise in 2D. */
function noise2(x, y, s = MAP.seed) {
  const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi;
  const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
  const a = hash(xi, yi, s), b = hash(xi + 1, yi, s), c = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s);
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
}
const TAU = Math.PI * 2;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const R = Math.round;

const rng = mulberry32(MAP.seed);
const STARS = Array.from({ length: 200 }, () => ({
  fx: rng(), fy: rng() ** 1.25, tone: 4 + Math.floor(rng() ** 2.2 * 4), k: 1 + Math.floor(rng() * 3), ph: rng() * TAU,
}));
const MILKY = Array.from({ length: 320 }, () => {
  const s = rng(), w = (rng() + rng() + rng() - 1.5) * 0.09;
  return { s, w, tone: 2 + Math.floor(rng() * 3) };
});
const SHOOT = { u0: rng(), x0: 0.18 + rng() * 0.3, y0: 0.06 + rng() * 0.2, len: 0.05 };
const FIREFLIES = Array.from({ length: 60 }, () => ({
  x: 8 + rng() * 464, gy: 154 + rng() * 92, h: 5 + rng() * 34,
  k1: 1 + Math.floor(rng() * 2), k2: 2 + Math.floor(rng() * 3), kb: 2 + Math.floor(rng() * 4),
  p1: rng() * TAU, p2: rng() * TAU, p3: rng() * TAU, pb: rng() * TAU, ax: 6 + rng() * 10,
}));
const FLAKES = Array.from({ length: 80 }, () => ({
  x: rng(), y: rng(), laps: 1 + Math.floor(rng() * 2), k: 1 + Math.floor(rng() * 2), ph: rng() * TAU, near: rng() < 0.35,
}));
const BLADES = Array.from({ length: 70 }, (_, i) => {
  const fx = (i + rng() * 0.8) / 70;
  const edge = Math.abs(fx - 0.5) * 2; // 0 in the middle, 1 at the sides
  return { fx, h: 3 + R(edge ** 3 * 26 + rng() * 6), lean: (rng() - 0.5) * 6 + (fx < 0.5 ? -2 : 2) * edge, ph: rng() * TAU };
});

// --------------------------------------------------------------------------------------------
// Options, time, layout.

function withDefaults(o = {}) {
  const r = { W: 480, H: 270, D: 4, camX: 0, palette: PALETTES.glace.tones, ...o };
  for (const [k, d] of Object.entries(OPTIONS)) if (r[k] === undefined || r[k] === null || Number.isNaN(+r[k])) r[k] = d.def;
  return r;
}

/** Loop phase u in [0, 1), quantized so that t and t + D always give the same u. */
function phase(t, D) {
  let u = (((t / D) % 1) + 1) % 1;
  u = Math.round(u * 1e9) / 1e9;
  return u >= 1 ? 0 : u;
}

const layoutCache = new Map();
/** Geometry for a scene size and the ground settings. Exported for Couveuse (sorting, fog). */
export function layout(o) {
  o = withDefaults(o);
  const key = [o.W, o.H, o.horizon, o.gyBack, o.gyFront].join(",");
  let L = layoutCache.get(key);
  if (L) return L;
  const { W, H } = o;
  let gf = clamp(R((o.gyFront / 100) * H), 4, H);
  let gb = clamp(R((o.gyBack / 100) * H), 2, gf - 2);
  let hz = clamp(R((o.horizon / 100) * H), 1, gb - 1);
  // authored knots (480 x 270) -> current knots, piecewise linear in y
  const K0 = [0, 113, 149, 251, 270], K1 = [0, hz, gb, gf, H];
  const my = (y) => {
    let i = 0;
    while (i < 3 && y > K0[i + 1]) i++;
    return R(K1[i] + ((y - K0[i]) / (K0[i + 1] - K0[i])) * (K1[i + 1] - K1[i]));
  };
  const sx = W / 480;
  const mx = (x) => R(x * sx);
  const sgy = (gf - gb) / 102;
  const pond = { x: mx(POND.x), gy: my(POND.gy), rx: Math.max(4, R(POND.rx * sx)), ry: Math.max(2, R(POND.ry * sgy)) };
  const walk = MAP.walk.map(([x, gy]) => [mx(x), my(gy)]);
  const path = MAP.floor.path.map(([x, gy]) => [mx(x), my(gy)]);
  const items = MAP.items.map((it) => {
    const a = ASSETS[it.asset];
    return { ...it, a, layer: it.layer ?? a.layer, x: mx(it.x), gy: my(it.gy), turns: it.turns ?? a.turns };
  });
  const obstacles = items
    .filter((it) => it.layer === "play" && !it.actor && it.a.footprint)
    .map((it) => ({ id: it.id, name: it.a.name, x: it.x, gy: it.gy, rx: it.a.footprint.w / 2, ry: it.a.footprint.d / 2 }));
  // perspective rows of the meadow: evenly spaced in depth, so they get closer towards the back
  const rows = [];
  {
    const Kd = H - hz;
    for (let z = 1; ; z += 0.075) {
      const y = R(hz + Kd / z);
      if (y <= hz + 1) break;
      if (rows.length && rows[rows.length - 1] === y) continue;
      rows.push(y);
    }
  }
  L = { W, H, hz, gb, gf, mx, my, pond, walk, path, items, obstacles, rows, home: { x: mx(MAP.home.x), gy: my(MAP.home.gy) } };
  if (layoutCache.size > 16) layoutCache.clear();
  layoutCache.set(key, L);
  return L;
}

/** Fog of the play plane at a ground line gy: how many tones to take off (an integer). */
export function fogAt(gy, o) {
  o = withDefaults(o);
  const L = layout(o);
  if (!(o.fog > 0)) return 0;
  return clamp(R((o.fog * (L.gf - gy)) / Math.max(1, L.gf - L.gb)), 0, R(o.fog));
}
const backFog = (o) => (o.fog > 0 ? Math.min(4, 1 + R(o.fog)) : 0);
const farFog = (o) => (o.fog > 0 ? Math.min(5, 2 + R(o.fog)) : 0);

const palCache = new Map();
/** { "0".."7": color } with every tone lowered by n (fog). */
function pal(palette, n) {
  const key = palette.join() + "|" + n;
  let t = palCache.get(key);
  if (!t) {
    t = {};
    for (let i = 0; i < 8; i++) t[i] = palette[Math.max(0, i - n)];
    if (palCache.size > 64) palCache.clear();
    palCache.set(key, t);
  }
  return t;
}
const tone = (palette, i, n = 0) => palette[clamp(i - n, 0, 7)];

// --------------------------------------------------------------------------------------------
// Drawing helpers.

/** Top-left of an item's sprite, from its contact point (x, gy) and elevation h. */
function spriteAt(it, x, gy, h = 0) {
  const a = it.a, flip = !!it.flip;
  const ax = flip ? a.w - 1 - a.anchor[0] : a.anchor[0];
  return [x - ax, gy - h - a.anchor[1]];
}
const frameOf = (a, turns, ua) => (a.frames.length > 1 && turns > 0 ? Math.floor(ua * turns * a.frames.length) % a.frames.length : 0);

function drawEmit(p, it, sx, sy, n, o, u) {
  for (const e of it.a.emit) {
    const ex = it.flip ? it.a.w - 1 - e.x : e.x;
    const pulse = 0.8 + 0.2 * Math.sin(TAU * 2 * u + it.x * 0.37) * o.anim;
    p.glow(sx + ex, sy + e.y, e.r, tone(o.palette, e.tone, n), e.k * o.glow * pulse * (1 - 0.22 * n));
  }
}

/** A dithered ellipse; keep(x, y) filters pixels (world coordinates), off shifts to the screen. */
function ellipse(p, cx, cy, rx, ry, c, a, keep = () => true, off = 0) {
  for (let y = -ry; y <= ry; y++) {
    const w = R(rx * Math.sqrt(Math.max(0, 1 - (y * y) / (ry * ry || 1))));
    for (let x = -w; x <= w; x++) if (keep(cx + x, cy + y)) p.dot(cx + x + off, cy + y, c, a);
  }
}

const insidePond = (L, x, y, m = 0) => {
  const dx = (x - L.pond.x) / (L.pond.rx - m), dy = (y - L.pond.gy) / (L.pond.ry - m);
  return dx * dx + dy * dy < 1;
};

/** x of the path's centre at screen row y (Catmull-Rom through the path points), and its width. */
function pathAt(L, y) {
  const P = L.path;
  let i = 0;
  while (i < P.length - 2 && y < P[i + 1][1]) i++;
  const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
  const s = clamp((p1[1] - y) / Math.max(1, p1[1] - p2[1]), 0, 1);
  const s2 = s * s, s3 = s2 * s;
  const x = 0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * s + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * s2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * s3);
  const w = 6 + 0.3 * (y - L.hz) * (L.W / 480);
  return [x, w];
}

// --------------------------------------------------------------------------------------------
// Planes.

function drawFar(p, o, L, u, ua) {
  const n = farFog(o), off = -R(o.camX * 0.1), W = L.W;
  const top = L.hz - 3;
  const wrap = (x) => ((x % W) + W) % W;
  // milky way: a faint diagonal band
  for (const m of MILKY) {
    const x = wrap(R((0.08 + m.s * 0.62 + m.w) * W) + off);
    const y = R((0.02 + m.s * 0.9 - m.w * 1.6) * top);
    if (y < 0 || y >= top) continue;
    p.px(x, y, tone(o.palette, m.tone, n));
  }
  // stars
  for (let i = 0; i < Math.min(o.stars, STARS.length); i++) {
    const s = STARS[i];
    const x = wrap(R(s.fx * W) + off), y = R(s.fy * top);
    const b = Math.sin(TAU * s.k * ua + s.ph);
    const tn = clamp(s.tone + R(b * 1.2 * o.anim), 0, 7);
    p.px(x, y, tone(o.palette, tn, n));
    if (s.tone >= 6 && b > 0.35) {
      const arm = tone(o.palette, tn - 2, n);
      p.px(x - 1, y, arm); p.px(x + 1, y, arm); p.px(x, y - 1, arm); p.px(x, y + 1, arm);
      p.glow(x, y, 3, tone(o.palette, 5, n), 0.12 * o.glow * b);
    }
  }
  // the moon (a lamp of the sky: one tone less of fog)
  {
    const mn = Math.max(0, n - 1), r = 9;
    const cx = wrap(R(0.79 * W) + off), cy = R(0.33 * top);
    p.glow(cx, cy, 30, tone(o.palette, 4, mn), 0.16 * o.glow);
    for (let y = -r; y <= r; y++)
      for (let x = -r; x <= r; x++) {
        const d = Math.sqrt(x * x + y * y);
        if (d > r + 0.3) continue;
        // lit from the top left: darker crescent on the bottom right
        const sh = (x + y) / (r * 1.4) + (d / r) * 0.35;
        let tn = sh > 0.75 ? 5 : sh > 0.25 ? 6 : 7;
        if (d > r - 0.8) tn = sh > 0.4 ? 5 : 6;
        p.px(cx + x, cy + y, tone(o.palette, tn, mn));
      }
    for (const [x, y, rr] of [[-3, -2, 2], [3, 2, 2], [-1, 4, 1], [4, -4, 1]])
      for (let yy = -rr; yy <= rr; yy++)
        for (let xx = -rr; xx <= rr; xx++) if (xx * xx + yy * yy <= rr * rr) p.px(cx + x + xx, cy + y + yy, tone(o.palette, 5, mn));
  }
  // a shooting star, once per loop
  if (o.anim > 0) {
    const s = (((ua - SHOOT.u0) % 1) + 1) % 1;
    if (s < SHOOT.len) {
      const q = s / SHOOT.len;
      const x0 = SHOOT.x0 * W, y0 = SHOOT.y0 * top, dx = 0.22 * W, dy = 0.22 * top;
      const hx = R(x0 + dx * q) + off, hy = R(y0 + dy * q);
      for (let k = 0; k < 14; k++) {
        const tx = R(hx - (dx / W) * 60 * (k / 14) * 0.9), ty = R(hy - (dy / top) * 60 * (k / 14) * 0.35);
        if (ty < top) p.dot(tx, ty, tone(o.palette, 7 - (k >> 2), n), 1 - k / 16);
      }
      p.glow(hx, hy, 3, tone(o.palette, 6, n), 0.3 * o.glow * Math.sin(Math.PI * q));
    }
  }
}

function drawItemSprite(p, it, x, gy, n, o, ua, h = 0) {
  const a = it.a;
  const [sx, sy] = spriteAt(it, x, gy, h);
  p.sprite(a.frames[frameOf(a, it.turns, ua)], pal(o.palette, n), sx, sy, { flip: !!it.flip });
  if (a.emit.length) drawEmit(p, it, sx, sy, n, o, ua);
}

function drawBack(p, o, L, ua) {
  const n = backFog(o), off = -R(o.camX * 0.4);
  const back = L.items.filter((it) => it.layer === "back").sort((a, b) => a.gy - b.gy || a.x - b.x);
  // mountains first (their foot is on the horizon), then the ground, then hills and far trees
  for (const it of back) if (it.gy <= L.hz) drawItemSprite(p, it, it.x + off, it.gy, n + (it.fogExtra ?? 0), o, ua);
  const g0 = tone(o.palette, 0);
  for (let y = L.hz; y < L.H; y++) p.line(0, y, L.W - 1, y, g0);
  for (const it of back) if (it.gy > L.hz) drawItemSprite(p, it, it.x + off, it.gy, n + (it.fogExtra ?? 0), o, ua);
}

/** The meadow: perspective rows of grass, a wind wave running through it, the path, the pond. */
function drawFloor(p, o, L, u, ua) {
  const off = -R(o.camX);
  const W = L.W;
  // path
  for (let y = L.gb; y < L.H; y++) {
    const [cx, w] = pathAt(L, y);
    const n = fogAt(y, o);
    const hw = w / 2;
    const e0 = R(cx - hw + (hash(y, 1) - 0.5) * 2) + off, e1 = R(cx + hw + (hash(y, 2) - 0.5) * 2) + off;
    for (let x = e0; x <= e1; x++) {
      const h = hash(x - off, y, 7);
      let tn = 2;
      const rel = (x - off - cx) / hw;
      if (Math.abs(Math.abs(rel) - 0.45) < 0.09 && y > L.gb + 4) tn = 1; // ruts
      if (h > 0.965) tn = 3; // pebbles
      if (Math.abs(rel) > 0.9 && h > 0.45) tn = 1; // ragged grass edge
      p.px(x, y, tone(o.palette, tn, n));
    }
  }
  // pond
  const P = L.pond;
  for (let y = P.gy - P.ry - 1; y <= P.gy + P.ry + 1; y++) {
    const n = fogAt(y, o);
    for (let x = P.x - P.rx - 1; x <= P.x + P.rx + 1; x++) {
      const inW = insidePond(L, x, y), inS = insidePond(L, x, y, -1.5);
      if (inW) p.px(x + off, y, "#000000");
      else if (inS) p.px(x + off, y, tone(o.palette, y < P.gy ? 2 : 3, n)); // far bank dim, near bank catches light
    }
  }
  // grass rows (behind gb: back plane fog; in the field: play fog)
  const bf = backFog(o);
  for (const y of L.rows) {
    const c = (y - L.hz) / (L.H - L.hz); // 0 far .. 1 near
    const n = y < L.gb ? bf : fogAt(y, o);
    const step = 2 + R(7 * c);
    const hgt = 1 + R(3 * c);
    for (let x0 = 0; x0 < W + step; x0 += step) {
      const wx = x0 + R(hash(x0, y, 3) * step);
      const x = wx + off;
      if (x < 0 || x >= W) continue;
      if (insidePond(L, wx, y, -2)) continue;
      const [cx, pw] = y >= L.gb ? pathAt(L, y) : [-999, 0];
      if (Math.abs(wx - cx) < pw / 2 - 1) continue;
      // wind wave: one gust crossing the field per loop, plus a slower swell
      const wave = Math.sin(TAU * ua - wx * 0.035 + y * 0.06) * 0.6 + Math.sin(TAU * 2 * ua + wx * 0.013) * 0.4;
      const gust = o.anim > 0 && wave > 1 - 0.55 * o.anim;
      const lean = gust ? 1 : 0;
      for (let k = 0; k < hgt; k++) {
        const tn = k === hgt - 1 ? (gust ? 3 : 2) : 1;
        p.px(x + (k === hgt - 1 ? lean : 0), y - k, tone(o.palette, tn, n));
      }
      if (c > 0.35 && hash(wx, y, 9) > 0.93) p.px(x, y - hgt, tone(o.palette, 4, n)); // tiny flowers
    }
  }
  // star glints on the water
  for (let i = 0; i < 26; i++) {
    const gx = P.x - P.rx + R(hash(i, 1, 11) * P.rx * 2), gy = P.gy - P.ry + R(hash(i, 2, 11) * P.ry * 2);
    if (!insidePond(L, gx, gy, 2)) continue;
    const b = Math.sin(TAU * (1 + (i % 3)) * ua + i * 1.7);
    if (b > 0.2) p.px(gx + off, gy, tone(o.palette, b > 0.7 ? 4 : 3, fogAt(gy, o)));
  }
  // ripples: short dashes sliding left and right
  for (let i = 0; i < 9; i++) {
    const ry = P.gy - P.ry + 3 + R(hash(i, 3, 12) * (P.ry * 2 - 6));
    const dx = R(Math.sin(TAU * ua + i) * 4 * o.anim);
    const rx = P.x - P.rx + 8 + R(hash(i, 4, 12) * (P.rx * 2 - 16)) + dx;
    const len = 3 + R(hash(i, 5, 12) * 6);
    for (let k = 0; k < len; k++) if (insidePond(L, rx + k, ry, 1)) p.px(rx + k + off, ry, tone(o.palette, 2, fogAt(ry, o)));
  }
}

/** Shadows (dithered black, to the bottom right) and reflections in the pond. */
function drawGroundMarks(p, o, L, ua) {
  const off = -R(o.camX);
  for (const it of L.items) {
    if (it.layer !== "play" || it.actor) continue;
    const a = it.a;
    const rx = Math.max(3, R((a.footprint ? a.footprint.w / 2 + 3 : a.w / 3) * (a.h > 60 ? 1.8 : 1)));
    const ry = Math.max(1, R(rx / 4));
    ellipse(p, it.x + R(rx / 4), it.gy + 1, rx, ry, "#000000", a.footprint ? 0.6 : 0.4, (x, y) => !insidePond(L, x, y, -1.5), off);
  }
  // reflections of what stands at the far shore
  const P = L.pond;
  for (const it of L.items) {
    if (it.layer !== "play" || !it.a.reflect) continue;
    if (Math.abs(it.x - P.x) > P.rx + it.a.w / 2 || it.gy > P.gy || it.gy < P.gy - P.ry - 10) continue;
    const a = it.a, rows = a.frames[frameOf(a, it.turns, ua)];
    const [sx, sy] = spriteAt(it, it.x, it.gy);
    for (let r = 0; r < rows.length; r++) {
      const ry = 2 * it.gy - (sy + r) + 1;
      if (ry < P.gy - P.ry || ry > P.gy + P.ry) continue;
      const ripple = R(Math.sin(TAU * 2 * ua + ry * 0.9) * o.anim);
      const n = fogAt(ry, o) + 1;
      const row = rows[r];
      for (let s = 0; s < row.length; s++) {
        const ch = row[s];
        if (ch === ".") continue;
        const x = sx + (it.flip ? row.length - 1 - s : s) + ripple;
        if (!insidePond(L, x, ry, 1)) continue;
        if (ry % 2 === 1 && (x + ry) % 4 === 0) continue; // broken up by the water
        p.px(x + off, ry, tone(o.palette, +ch, n));
      }
    }
  }
}

function drawFront(p, o, L, u, ua) {
  const off = -R(o.camX * 1.3), W = L.W, H = L.H;
  // grass blades along the bottom edge, swaying with a wind read on a circle of time
  for (const b of BLADES) {
    const bx = R(b.fx * W) + off;
    const gust = noise2(b.fx * 4 + Math.cos(TAU * ua) * 1.2, Math.sin(TAU * ua) * 1.2, MAP.seed) - 0.5;
    const sway = (Math.sin(TAU * ua + b.ph) * 1.5 + gust * 6) * o.anim;
    let px = bx, py = H;
    for (let k = 0; k <= b.h; k++) {
      const f = k / b.h;
      const x = R(bx + (b.lean + sway) * f * f), y = H - k;
      const tn = f > 0.85 ? 2 : f > 0.4 ? 1 : 0;
      if (k > 0) p.line(px, py, x, y, tone(o.palette, tn));
      px = x; py = y;
    }
  }
  // front sprites
  for (const it of L.items) {
    if (it.layer !== "front") continue;
    let x = it.x + off, y = it.gy;
    if (it.sway) x += R(Math.sin(TAU * ua + it.x) * it.sway * o.anim);
    if (it.sway) y += R(Math.sin(TAU * ua + it.x + 1.3) * 1 * o.anim);
    const a = it.a;
    const [sx, sy] = spriteAt(it, x, y);
    p.sprite(a.frames[frameOf(a, it.turns, ua)], pal(o.palette, 0), sx, sy, { flip: !!it.flip });
  }
  // snow (optional, mostly for fun in summer): near flakes here, far ones are in mapBack
  drawSnow(p, o, L, ua, true);
}

function drawSnow(p, o, L, ua, near) {
  const W = L.W, H = L.H, span = H + 8;
  for (let i = 0; i < Math.min(o.snow, FLAKES.length); i++) {
    const f = FLAKES[i];
    if (f.near !== near) continue;
    const y = R((((f.y + ua * f.laps) % 1) * span) - 4);
    const x = R(f.x * W + Math.sin(TAU * f.k * ua + f.ph) * 4 * o.anim - o.camX * (near ? 1.3 : 0.6));
    const xx = ((x % W) + W) % W;
    if (near) {
      p.px(xx, y, tone(o.palette, 6));
      p.px(xx + 1, y, tone(o.palette, 4));
      p.px(xx, y + 1, tone(o.palette, 4));
    } else p.px(xx, y, tone(o.palette, 4, y < L.gb ? backFog(o) : fogAt(y, o)));
  }
}

// --------------------------------------------------------------------------------------------
// The interface (§ 9).

/** Everything behind the play layer: far, back, the floor, and every shadow and reflection on it. */
export function mapBack(p, t, o) {
  o = withDefaults(o);
  const L = layout(o);
  const u = phase(t, o.D), ua = o.anim > 0 ? u : 0;
  drawFar(p, o, L, u, ua);
  drawBack(p, o, L, ua);
  drawFloor(p, o, L, u, ua);
  drawGroundMarks(p, o, L, ua);
  drawSnow(p, o, L, ua, false);
}

/** The play layer's things at t, for Couveuse to sort together with the creature and its objects. */
export function mapItems(t, o) {
  o = withDefaults(o);
  const L = layout(o);
  const u = phase(t, o.D), ua = o.anim > 0 ? u : 0;
  const off = -R(o.camX);
  const out = [];
  for (const it of L.items) {
    if (it.layer !== "play") continue;
    if (it.actor) {
      // a butterfly: a figure of eight, a whole number of laps per loop
      const A = it.actor, s = TAU * A.laps * ua;
      const x = it.x + R(Math.sin(s) * A.rx * Math.min(1, o.anim * 4));
      const gy = it.gy + R(Math.sin(2 * s) * A.rgy * Math.min(1, o.anim * 4));
      const h = A.h + R(Math.sin(TAU * 3 * ua + it.x) * 4 * o.anim);
      const flip = Math.cos(s) < 0;
      const n = fogAt(gy, o);
      out.push({
        id: it.id, x: x + off, gy, layer: "play",
        draw(p) {
          const a = it.a;
          const ax = flip ? a.w - 1 - a.anchor[0] : a.anchor[0];
          p.dot(x + off, gy, "#000000", 0.6);
          p.sprite(a.frames[frameOf(a, it.turns, ua)], pal(o.palette, n), x + off - ax, gy - h - a.anchor[1], { flip });
        },
      });
      continue;
    }
    const n = fogAt(it.gy, o);
    out.push({
      id: it.id, x: it.x + off, gy: it.sortGy ?? it.gy, layer: "play",
      draw(p) { drawItemSprite(p, it, it.x + off, it.gy, n, o, ua); },
    });
  }
  // fireflies: floating lights, each blinking a whole number of times per loop
  for (let i = 0; i < Math.min(o.fireflies, FIREFLIES.length); i++) {
    const f = FIREFLIES[i];
    const m = o.anim;
    const x = L.mx(f.x) + R((Math.sin(TAU * f.k1 * ua + f.p1) * f.ax + Math.sin(TAU * f.k2 * ua + f.p2) * 3) * m);
    const gy = L.my(f.gy) + R(Math.sin(TAU * f.k1 * ua + f.p3) * 4 * m);
    const h = R(f.h + Math.sin(TAU * f.k2 * ua + f.p3) * 4 * m);
    const e = Math.sin(TAU * f.kb * ua + f.pb);
    if (e < -0.1) continue;
    const k = (e + 0.1) / 1.1;
    const n = fogAt(gy, o);
    out.push({
      id: "ff" + i, x: x + off, gy, layer: "play",
      draw(p) {
        const X = x + off, Y = gy - h;
        p.px(X, Y, tone(o.palette, k > 0.5 ? 7 : 5, n));
        p.glow(X, Y, 6, tone(o.palette, 5, n), 0.32 * k * o.glow);
        p.glow(X, gy, 3, tone(o.palette, 4, n), 0.06 * k * o.glow); // a hint of light on the grass
      },
    });
  }
  out.sort((a, b) => a.gy - b.gy || a.x - b.x || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  return out;
}

/** The front layer, drawn over everything. */
export function mapFront(p, t, o) {
  o = withDefaults(o);
  const L = layout(o);
  const u = phase(t, o.D), ua = o.anim > 0 ? u : 0;
  drawFront(p, o, L, u, ua);
}

function inPolygon(poly, x, y) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    // points on an edge count as inside
    const cross = (x - xi) * (yj - yi) - (y - yi) * (xj - xi);
    if (cross === 0 && x >= Math.min(xi, xj) && x <= Math.max(xi, xj) && y >= Math.min(yi, yj) && y <= Math.max(yi, yj)) return true;
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** Why the creature may not stand at (x, gy), in French, or null if it may. */
export function standReason(x, gy, o) {
  const L = layout(o);
  x = R(x); gy = R(gy);
  if (x < 0 || x > L.W || gy < L.gb || gy > L.gf) return "C’est hors du sol de la plaine.";
  if (!inPolygon(L.walk, x, gy)) return insidePond(L, x, gy, -6) ? "C’est dans la mare." : "C’est hors du sol de la plaine.";
  for (const ob of L.obstacles) {
    const dx = (x - ob.x) / ob.rx, dy = (gy - ob.gy) / ob.ry;
    if (dx * dx + dy * dy < 1) return `${ob.name} est sur le passage.`;
  }
  return null;
}

/** Where the creature may stand. */
export function canStand(x, gy, o) {
  return standReason(x, gy, o) === null;
}

/** Whether a straight move from (x0, gy0) to (x1, gy1) crosses nothing (checked every pixel). */
export function segmentFree(x0, gy0, x1, gy1, o) {
  const dx = x1 - x0, dy = gy1 - gy0, n = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dy))));
  for (let i = 0; i <= n; i++) if (!canStand(R(x0 + (dx * i) / n), R(gy0 + (dy * i) / n), o)) return false;
  return true;
}
