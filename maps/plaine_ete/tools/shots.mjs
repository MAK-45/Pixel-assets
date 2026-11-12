// Contact sheets of the map (§ 11): 8 instants of one loop, the creature at several depths, palettes.
//   node maps/plaine_ete/tools/shots.mjs
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createPainter } from "../painter.js";
import { renderScene } from "../dummy-blob.js";
import { MAP, PALETTES, layout } from "../map.js";
import { encodePng } from "./png.mjs";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "../shots");
const W = 480, H = 270;

function frame(t, o, blob) {
  const P = createPainter(o.W ?? W, o.H ?? H);
  renderScene(P.p, t, o, blob);
  return { w: o.W ?? W, h: o.H ?? H, rgba: P.compose() };
}

function board(frames, cols, name, scale = 1, gap = 4) {
  const fw = frames[0].w, fh = frames[0].h, rows = Math.ceil(frames.length / cols);
  const BW = cols * fw + (cols + 1) * gap, BH = rows * fh + (rows + 1) * gap;
  const out = new Uint8Array(BW * BH * 4);
  for (let i = 0; i < BW * BH; i++) out.set([40, 40, 48, 255], i * 4);
  frames.forEach((f, i) => {
    const ox = gap + (i % cols) * (fw + gap), oy = gap + Math.floor(i / cols) * (fh + gap);
    for (let y = 0; y < fh; y++) out.set(f.rgba.subarray(y * fw * 4, (y + 1) * fw * 4), ((oy + y) * BW + ox) * 4);
  });
  writeFileSync(join(OUT, name), encodePng(BW, BH, out, scale));
  console.log("shots/" + name);
}

const base = { D: 4, palette: PALETTES.glace.tones };
const home = MAP.home;

// one large frame with the creature at home
board([frame(1.0, base, home)], 1, "scene.png", 2, 0);
// 8 instants of a loop
board(Array.from({ length: 8 }, (_, i) => frame((i / 8) * 4, base, home)), 2, "loop-8.png");
// depth: the creature at the back, behind things, in front of things
const L = layout(base);
board(
  [
    frame(0.5, base, { x: 386, gy: 176 }), // in front of the oak's trunk
    frame(0.5, base, { x: 386, gy: 160 }), // behind the oak
    frame(0.5, base, { x: 300, gy: L.gb + 2 }), // far back: fog
    frame(0.5, base, { x: 440, gy: 244 }), // behind the crag, near the front
  ],
  2,
  "depth.png",
);
// palettes, settings
board(
  [
    frame(1.5, { ...base, palette: PALETTES.seve.tones }, home),
    frame(1.5, { ...base, palette: PALETTES.braise.tones }, home),
    frame(1.5, { ...base, palette: PALETTES.aurore.tones, fog: 3, snow: 60 }, home),
    frame(1.5, { ...base, fog: 0, stars: 200, glow: 2 }, home),
  ],
  2,
  "palettes.png",
);
// another scene size and ground settings
board([frame(1, { ...base, W: 320, H: 180 }, { x: 160, gy: 137 })], 1, "size-320x180.png", 2);
board([frame(1, { ...base, horizon: 30, gyBack: 45, gyFront: 98 }, home)], 1, "ground-settings.png");
