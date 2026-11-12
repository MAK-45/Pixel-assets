// Zoomed crop of a frame, for close checks: node tools/crop.mjs x y w h [t] [scale]
import { writeFileSync } from "node:fs";
import { createPainter } from "../painter.js";
import { renderScene } from "../dummy-blob.js";
import { MAP, PALETTES } from "../map.js";
import { encodePng } from "./png.mjs";
const [x0, y0, w, h, t = 1, s = 4] = process.argv.slice(2).map(Number);
const P = createPainter(480, 270);
renderScene(P.p, t, { D: 4, palette: PALETTES.glace.tones }, MAP.home);
const full = P.compose(), out = new Uint8Array(w * h * 4);
for (let y = 0; y < h; y++) out.set(full.subarray(((y0 + y) * 480 + x0) * 4, ((y0 + y) * 480 + x0 + w) * 4), y * w * 4);
writeFileSync(new URL("../shots/_crop.png", import.meta.url), encodePng(w, h, out, s));
