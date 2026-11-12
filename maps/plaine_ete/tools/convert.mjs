// Converts library assets to the Couveuse style (§ 5.1 of the spec) and writes ../assets.js.
//   1. tones: Rec. 709 luminance of each color, stretched over the asset's [lo, hi] tone range;
//   2. the dark outline ("k") becomes a lit rim: 5/6 on top/left edges, 2/3 on bottom/right;
//   3. optional x2 upscale (Scale2x, then a fresh 1 px rim) for things that must be bigger.
// Also writes shots/assets.png: every converted asset on black, in the Glace palette.
//   node maps/plaine_ete/tools/convert.mjs
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { encodePng } from "./png.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const MAP_DIR = join(HERE, "..");
const ROOT = join(MAP_DIR, "../..");

// Asset sheets (§ 5.2). src = "<category>/<asset>/<variant>" in library/.
// tones: [lo, hi] range of the body; rim: [lit top, lit left, dark right, dark bottom]; ink: tone of inner outlines.
// fix: per-key tone overrides (hand correction of the luminance table); cutBelow: drop source rows from there (crown only).
const PLAY = { tones: [1, 4], rim: [6, 5, 3, 2], ink: 1 };
const BACK = { tones: [1, 4], rim: [6, 5, 3, 2], ink: 1 }; // dimmed at render time by the plane's fog
const FRONT = { tones: [0, 1], rim: [2, 2, 1, 0], ink: 0 }; // dark, barely lit

export const SPECS = [
  // --- play: trees (x2 to match the creature: body r = 24 px, human form ~60 px)
  { id: "oak_big", name: "Grand chêne", src: "nature/tree/oak_summer_48", scale: 2, ...PLAY, footprint: { w: 16, d: 6 } },
  { id: "pine_big", name: "Grand pin", src: "nature/tree/pine_48", scale: 2, ...PLAY, footprint: { w: 14, d: 6 } },
  { id: "birch", name: "Bouleau", src: "nature/tree/birch_32", scale: 2, ...PLAY, footprint: { w: 10, d: 5 }, reflect: true },
  { id: "apple", name: "Pommier", src: "nature/tree/apple_32", scale: 2, ...PLAY, footprint: { w: 12, d: 5 } },
  { id: "oak_young", name: "Jeune chêne", src: "nature/tree/oak_summer_full_32", scale: 2, ...PLAY, footprint: { w: 12, d: 5 } },
  // --- play: rocks and bushes
  { id: "boulder", name: "Rocher moussu", src: "nature/rock/boulder_mossy_32", ...PLAY, footprint: { w: 26, d: 8 } },
  { id: "crag", name: "Grand rocher", src: "nature/rock/crag_mossy_48", ...PLAY, footprint: { w: 40, d: 10 } },
  { id: "stone", name: "Pierre", src: "nature/rock/small_mossy_16", ...PLAY, footprint: { w: 12, d: 4 } },
  { id: "pebbles", name: "Cailloux", src: "nature/rock/pebbles_16", ...PLAY, footprint: null },
  { id: "cairn", name: "Cairn", src: "nature/rock/cairn_32", ...PLAY, footprint: { w: 16, d: 6 } },
  { id: "bush", name: "Buisson", src: "nature/bush/round_32", ...PLAY, footprint: { w: 26, d: 7 } },
  { id: "bush_berry", name: "Buisson à baies", src: "nature/bush/berry_32", ...PLAY, footprint: { w: 26, d: 7 } },
  { id: "bush_flower", name: "Buisson fleuri", src: "nature/bush/flowering_32", ...PLAY, footprint: { w: 26, d: 7 } },
  { id: "hedge", name: "Haie fleurie", src: "nature/bush/hedge_flowering_48", ...PLAY, footprint: { w: 44, d: 7 } },
  { id: "fern", name: "Fougère", src: "nature/fern/large_32", ...PLAY, footprint: null },
  // --- play: small plants (walk-through)
  { id: "sunflower", name: "Tournesol", src: "nature/flower/sunflower_32", ...PLAY, footprint: null },
  { id: "tulip_red", name: "Tulipe rouge", src: "nature/flower/tulip_red_16", ...PLAY, footprint: null },
  { id: "tulip_yellow", name: "Tulipe jaune", src: "nature/flower/tulip_yellow_16", ...PLAY, footprint: null },
  { id: "daisy", name: "Marguerite", src: "nature/flower/daisy_16", ...PLAY, footprint: null },
  { id: "poppy", name: "Coquelicot", src: "nature/flower/poppy_16", ...PLAY, footprint: null },
  { id: "bluebell", name: "Jacinthe", src: "nature/flower/bluebell_16", ...PLAY, footprint: null },
  { id: "lavender", name: "Lavande", src: "nature/flower/lavender_16", ...PLAY, footprint: null },
  { id: "flower_bed", name: "Massif de fleurs", src: "nature/flower/bed_32", ...PLAY, footprint: null },
  { id: "tuft", name: "Touffe d’herbe", src: "nature/grass/tuft_flowers_16", ...PLAY, footprint: null },
  { id: "tuft_wind", name: "Herbe au vent", src: "nature/grass/tuft_wind_16", ...PLAY, footprint: null, turns: 1 },
  { id: "tall_wind", name: "Hautes herbes au vent", src: "nature/grass/tall_wind_32", ...PLAY, footprint: null, turns: 1 },
  { id: "reeds", name: "Roseaux", src: "nature/grass/reeds_32", ...PLAY, footprint: null, reflect: true },
  { id: "clover", name: "Trèfle", src: "nature/grass/clover_16", ...PLAY, footprint: null },
  { id: "mushroom_glow", name: "Champignon lumineux", src: "nature/mushroom/magic_blue_16", ...PLAY, footprint: null,
    emit: [{ x: 7, y: 5, r: 9, tone: 5, k: 0.22 }] },
  { id: "amanita", name: "Amanite", src: "nature/mushroom/amanita_16", ...PLAY, footprint: null },
  // --- play: little animals (they move by code)
  { id: "butterfly", name: "Papillon", src: "fauna/butterfly/white_8", ...PLAY, rim: [6, 6, 4, 4], footprint: null, turns: 8 },
  { id: "butterfly_blue", name: "Papillon bleu", src: "fauna/butterfly/blue_8", ...PLAY, rim: [6, 6, 4, 4], footprint: null, turns: 8 },
  // --- back
  { id: "hills", name: "Collines", src: "landscape/hill/rolling_64", ...BACK, layer: "back" },
  { id: "hills_flowers", name: "Collines fleuries", src: "landscape/hill/rolling_flowers_64", ...BACK, layer: "back" },
  { id: "hill", name: "Colline", src: "landscape/hill/round_32", ...BACK, layer: "back" },
  { id: "mountain", name: "Montagne", src: "landscape/mountain/peak_snow_128", ...BACK, layer: "back" },
  { id: "peak", name: "Sommet", src: "landscape/mountain/peak_alpine_64", ...BACK, layer: "back" },
  { id: "range", name: "Chaîne lointaine", src: "landscape/mountain/range_far_64", ...BACK, layer: "back" },
  { id: "tree_far", name: "Arbre lointain", src: "nature/tree/oak_summer_16", ...BACK, layer: "back" },
  { id: "pine_far", name: "Pin lointain", src: "nature/tree/pine_16", ...BACK, layer: "back" },
  { id: "tree_mid", name: "Arbre au loin", src: "nature/tree/oak_summer_sparse_32", ...BACK, layer: "back" },
  // --- front
  { id: "grass_front", name: "Herbes d’avant-plan", src: "nature/grass/tall_wind_32", scale: 2, ...FRONT, layer: "front", turns: 1 },
  { id: "fern_front", name: "Fougère d’avant-plan", src: "nature/fern/large_32", scale: 2, ...FRONT, layer: "front" },
];

// ---------------------------------------------------------------------------------------------

const lum = (c) => {
  const v = parseInt(c.slice(1), 16);
  return (0.2126 * ((v >> 16) & 255) + 0.7152 * ((v >> 8) & 255) + 0.0722 * (v & 255)) / 255;
};

async function loadVariant(src) {
  const [cat, asset, key] = src.split("/");
  const mod = await import(join(ROOT, "library/js", cat, asset + ".js"));
  const a = mod.asset ?? mod.default;
  const v = a.variants[key];
  if (!v) throw new Error(`unknown variant ${src}`);
  const frames = v.frames ? v.frames.map((f) => f.rows) : [v.rows];
  return { palette: v.palette, frames, w: v.w, h: v.h };
}

/** Grid helpers: a grid is an array of rows of cells; a cell is a tone 0..7 or -1 (transparent). */
const grid = (w, h, v = -1) => Array.from({ length: h }, () => new Array(w).fill(v));
const at = (g, x, y) => (y < 0 || y >= g.length || x < 0 || x >= g[0].length ? -1 : g[y][x]);

/** Edge tone from the direction of the empty neighbours (light from the top left). */
function rimTone(g, x, y, rim, isEmpty) {
  let nx = 0, ny = 0;
  for (const [dx, dy, wt] of [[-1, 0, 1], [1, 0, 1], [0, -1, 1], [0, 1, 1], [-1, -1, 0.5], [1, -1, 0.5], [-1, 1, 0.5], [1, 1, 0.5]])
    if (isEmpty(x + dx, y + dy)) { nx += dx * wt; ny += dy * wt; }
  const [top, left, right, bottom] = rim;
  const score = -(nx + ny);
  if (score > 0.01) return ny < -0.01 ? top : left;
  if (score < -0.01) return ny > 0.01 ? bottom : right;
  return ny < 0 ? left : right; // top-right or bottom-left corner
}

/** Scale2x (EPX) on a tone grid: x2 without new colors, diagonals stay smooth. */
function scale2x(g) {
  const h = g.length, w = g[0].length, o = grid(w * 2, h * 2);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const P = g[y][x], A = at(g, x, y - 1), B = at(g, x + 1, y), C = at(g, x - 1, y), D = at(g, x, y + 1);
      o[2 * y][2 * x] = C === A && C !== D && A !== B ? A : P;
      o[2 * y][2 * x + 1] = A === B && A !== C && B !== D ? B : P;
      o[2 * y + 1][2 * x] = D === C && D !== B && C !== A ? C : P;
      o[2 * y + 1][2 * x + 1] = B === D && B !== A && D !== C ? D : P;
    }
  return o;
}

function convertFrame(rows, palette, spec, toneOf) {
  const h = rows.length, w = rows[0].length;
  const isInk = (ch) => ch === "k";
  const empty = (x, y) => y < 0 || y >= h || x < 0 || x >= w || rows[y][x] === ".";
  // body tones; ink that touches the outside is the outline, ink inside is an inner line
  let g = grid(w, h);
  const outline = grid(w, h, 0);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const ch = rows[y][x];
      if (ch === ".") continue;
      if (isInk(ch)) {
        let edge = false;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (empty(x + dx, y + dy)) edge = true;
        if (edge) { outline[y][x] = 1; continue; }
        g[y][x] = spec.ink;
      } else g[y][x] = toneOf(ch);
    }

  if ((spec.scale ?? 1) === 2) {
    // drop the old outline, upscale the body, then draw a fresh 1 px rim just outside it
    g = scale2x(g);
    const H2 = g.length, W2 = g[0].length;
    const out = grid(W2 + 2, H2 + 2);
    for (let y = 0; y < H2; y++) for (let x = 0; x < W2; x++) out[y + 1][x + 1] = g[y][x];
    const body = out.map((r) => r.slice());
    const isEmpty = (x, y) => at(body, x, y) < 0;
    for (let y = 0; y < out.length; y++)
      for (let x = 0; x < out[0].length; x++) {
        if (body[y][x] >= 0) continue;
        let touch = false;
        for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) if (at(body, x + dx, y + dy) >= 0) touch = true;
        if (!touch) continue;
        // the rim pixel's normal points away from the body
        let nx = 0, ny = 0;
        for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) if (at(body, x + dx, y + dy) >= 0) { nx -= dx; ny -= dy; }
        const [top, left, right, bottom] = spec.rim;
        const score = -(nx + ny);
        out[y][x] = score > 0 ? (ny < 0 ? top : left) : score < 0 ? (ny > 0 ? bottom : right) : ny < 0 ? left : right;
      }
    return trim(out);
  }

  // x1: the outline pixels become the rim, in place
  const isEmpty = (x, y) => empty(x, y);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) if (outline[y][x]) g[y][x] = rimTone(g, x, y, spec.rim, isEmpty);
  return g;
}

/** Crop fully transparent borders (same crop for every frame is done by the caller). */
function trim(g) {
  return g;
}

function bbox(frames) {
  let x0 = Infinity, y0 = Infinity, x1 = -1, y1 = -1;
  for (const g of frames)
    g.forEach((r, y) => r.forEach((v, x) => {
      if (v < 0) return;
      x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
    }));
  return { x0, y0, x1, y1 };
}

const toRows = (g, b) =>
  g.slice(b.y0, b.y1 + 1).map((r) => r.slice(b.x0, b.x1 + 1).map((v) => (v < 0 ? "." : String(v))).join(""));

async function convert(spec) {
  const src = await loadVariant(spec.src);
  const used = new Set();
  for (const rows of src.frames) for (const r of rows) for (const ch of r) if (ch !== "." && ch !== "k") used.add(ch);
  const L = [...used].map((ch) => lum(src.palette[ch]));
  const lmin = Math.min(...L), lmax = Math.max(...L);
  const [lo, hi] = spec.tones;
  const toneOf = (ch) => {
    if (spec.fix && ch in spec.fix) return spec.fix[ch];
    const t = lmax > lmin ? (lum(src.palette[ch]) - lmin) / (lmax - lmin) : 0.5;
    return Math.round(lo + t * (hi - lo));
  };
  const cut = (rows) => (spec.cutBelow ? rows.map((r, i) => (i >= spec.cutBelow ? ".".repeat(r.length) : r)) : rows);
  const grids = src.frames.map((rows) => convertFrame(cut(rows), src.palette, spec, toneOf));
  const b = bbox(grids);
  const frames = grids.map((g) => toRows(g, b));
  const w = frames[0][0].length, h = frames[0].length;
  // anchor: middle of the lowest opaque row of the first frame (where it touches the ground)
  const last = frames[0][h - 1];
  const xs = [...last].map((c, i) => (c === "." ? -1 : i)).filter((i) => i >= 0);
  const ax = Math.round((xs[0] + xs[xs.length - 1]) / 2);
  return {
    id: spec.id,
    name: spec.name,
    w, h,
    anchor: spec.anchor ?? [ax, h - 1],
    footprint: spec.footprint ?? null,
    layer: spec.layer ?? "play",
    sortGy: null,
    flip: true,
    frames,
    turns: frames.length > 1 ? spec.turns ?? 1 : 0,
    emit: spec.emit ?? [],
    reflect: !!spec.reflect,
    source: spec.src + (spec.scale === 2 ? " (x2)" : ""),
  };
}

// ---------------------------------------------------------------------------------------------

const out = {};
for (const s of SPECS) out[s.id] = await convert(s);

const body = Object.values(out)
  .map((a) => {
    const { frames, ...meta } = a;
    const fr = frames.map((f) => "[\n" + f.map((r) => "    " + JSON.stringify(r)).join(",\n") + ",\n  ]").join(", ");
    return `${JSON.stringify(a.id)}: { ...${JSON.stringify(meta)},\n  frames: [${fr}] }`;
  })
  .join(",\n");
const js =
  "// GENERATED by tools/convert.mjs from library/ (Pixel Assets) — do not edit by hand.\n" +
  "// Each asset: tones \"0\"..\"7\" (palette index), \".\" transparent. Sheet format: § 5.2 of the spec.\n" +
  `export const ASSETS = {\n${body}\n};\n`;
writeFileSync(join(MAP_DIR, "assets.js"), js);

// contact sheet in Glace, on black
const GLACE = ["#081026", "#102654", "#1a4a90", "#2c7ccc", "#58b6ee", "#9fe0ff", "#dcf8ff", "#ffffff"].map((c) => parseInt(c.slice(1), 16));
const list = Object.values(out);
const PAD = 6, SW = 640;
let x = PAD, y = PAD, rowH = 0;
const pos = [];
for (const a of list) {
  const fw = a.w * a.frames.length + (a.frames.length - 1) * 2;
  if (x + fw + PAD > SW) { x = PAD; y += rowH + PAD; rowH = 0; }
  pos.push([x, y]);
  x += fw + PAD;
  rowH = Math.max(rowH, a.h);
}
const SH = y + rowH + PAD;
const rgba = new Uint8Array(SW * SH * 4);
for (let i = 0; i < SW * SH; i++) rgba[i * 4 + 3] = 255;
list.forEach((a, n) => {
  const [ox, oy] = pos[n];
  a.frames.forEach((f, fi) =>
    f.forEach((r, yy) => [...r].forEach((ch, xx) => {
      if (ch === ".") return;
      const v = GLACE[+ch], i = ((oy + yy) * SW + ox + fi * (a.w + 2) + xx) * 4;
      rgba[i] = v >> 16; rgba[i + 1] = (v >> 8) & 255; rgba[i + 2] = v & 255;
    })));
});
writeFileSync(join(MAP_DIR, "shots/assets.png"), encodePng(SW, SH, rgba, 2));
const bytes = Buffer.byteLength(js);
console.log(`${list.length} assets -> assets.js (${(bytes / 1024).toFixed(1)} KB), shots/assets.png`);
