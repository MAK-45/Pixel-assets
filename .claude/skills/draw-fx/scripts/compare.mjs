#!/usr/bin/env node
// Planche de comparaison « référence pixelfx / notre dessin », à la même échelle.
//
//   node .claude/skills/draw-fx/scripts/compare.mjs --ref nature/boulder@0 --ref nature/earth-spike@1.4
//       -> étudier des références seules, agrandies (image d'un effet au temps t, en secondes)
//   node .claude/skills/draw-fx/scripts/compare.mjs assets/nature/fxrock.px.js --ref nature/boulder@0
//       -> ligne 1 : références pixelfx ; ligne 2 : nos sprites sur le même fond sombre ; ligne 3 : sur fond clair
//
// Options : --only a,b (variantes ou noms de sprites), --scale N (défaut 4), --out fichier.png,
//           --full (ne pas recadrer la référence sur l'effet).
// Sortie par défaut : assets/<cat>/out/_preview/<asset>__vs_pixelfx.png (ou out/_preview/refs.png sans asset).

import { dirname, join, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { inspectAsset, rel, ROOT } from "../../../../scripts/lib/library.js";
import { loadEffect, renderFrames, upscale, canvas, save } from "../../pixelfx/tools/lib/fxlib.mjs";

const args = process.argv.slice(2), refs = [], flags = {};
let file;
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === "--ref") refs.push(args[++i]);
  else if (a === "--full") flags.full = true;
  else if (a.startsWith("--")) flags[a.slice(2)] = args[++i];
  else file = a;
}
if (!file && !refs.length) {
  console.error("Usage : compare.mjs [assets/<cat>/<asset>.px.js] --ref <effet>@<t> [--ref …] [--only a,b] [--scale 4] [--out f.png] [--full]");
  process.exit(1);
}
const S = +(flags.scale ?? 4), PAD = 6, DARK = [22, 20, 31, 255], LIGHT = [190, 214, 230, 255];

// ---- références : une image de l'effet au temps t, recadrée sur ce que l'effet dessine
const tiles = []; // { row, label, w, h, rgba }
for (const spec of refs) {
  const [id, at] = spec.split("@"), t = +(at ?? 0);
  const fx = await loadEffect(id);
  const r = renderFrames(fx, { bg: "dark", actor: false });
  const fr = r.frames[Math.max(0, Math.min(r.n - 1, Math.round(t * r.fps)))];
  let x0 = 0, y0 = 0, x1 = r.w - 1, y1 = r.h - 1;
  if (!flags.full) {
    (x0 = r.w), (y0 = r.h), (x1 = -1), (y1 = -1);
    for (let y = 0; y < r.h; y++)
      for (let x = 0; x < r.w; x++)
        if (fr.clear[(y * r.w + x) * 4 + 3] > 24) (x0 = Math.min(x0, x)), (x1 = Math.max(x1, x)), (y0 = Math.min(y0, y)), (y1 = Math.max(y1, y));
    if (x1 < 0) (x0 = 0), (y0 = 0), (x1 = r.w - 1), (y1 = r.h - 1);
    (x0 = Math.max(0, x0 - 4)), (y0 = Math.max(0, y0 - 4)), (x1 = Math.min(r.w - 1, x1 + 4)), (y1 = Math.min(r.h - 1, y1 + 4));
  }
  const w = x1 - x0 + 1, h = y1 - y0 + 1, rgba = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++) rgba.set(fr.color.subarray(((y0 + y) * r.w + x0) * 4, ((y0 + y) * r.w + x0 + w) * 4), y * w * 4);
  tiles.push({ row: 0, label: `${id} @${fr.t.toFixed(2)}s`, w, h, rgba });
}

// ---- nos sprites, construits avec pxl (pas besoin de build préalable)
let out = flags.out;
if (file) {
  const r = inspectAsset(resolve(file));
  if (r.errors.length) {
    for (const e of r.errors) console.error(`ERREUR  ${e}`);
    process.exit(1);
  }
  const only = flags.only ? flags.only.split(",") : null, slug = r.info.slug;
  for (const name of r.info.names) {
    if (only && !only.includes(name) && !only.includes(name.slice(slug.length + 1))) continue;
    const img = r.project.build(name).img, rgba = new Uint8ClampedArray(img.w * img.h * 4);
    for (let i = 0; i < img.w * img.h; i++) {
      const c = img.data[i];
      rgba[i * 4] = (c >>> 24) & 255; rgba[i * 4 + 1] = (c >>> 16) & 255; rgba[i * 4 + 2] = (c >>> 8) & 255; rgba[i * 4 + 3] = c & 255;
    }
    for (const row of [1, 2]) tiles.push({ row, label: row === 1 ? name.slice(slug.length + 1) : "", w: img.w, h: img.h, rgba });
  }
  out ??= join(dirname(resolve(file)), "out", "_preview", `${slug}__vs_pixelfx.png`);
}
out ??= join(ROOT, "out", "_preview", "refs.png");

// ---- mise en page : une ligne par rangée, tout à la même échelle, sprites posés sur une même ligne de sol
const rows = [0, 1, 2].map((k) => tiles.filter((t) => t.row === k)).filter((r) => r.length);
const rowH = rows.map((r) => Math.max(...r.map((t) => t.h)) * S + 18);
const W = Math.max(...rows.map((r) => r.reduce((a, t) => a + t.w * S + PAD, PAD)));
const cv = canvas(W, rowH.reduce((a, h) => a + h + PAD, PAD));
let y = PAD;
rows.forEach((r, ri) => {
  const bg = r[0].row === 2 ? LIGHT : DARK;
  cv.rect(PAD, y, W - 2 * PAD, rowH[ri], bg);
  let x = PAD;
  for (const t of r) {
    cv.paste(upscale(t.rgba, t.w, t.h, S), t.w * S, t.h * S, x, y + rowH[ri] - t.h * S);
    if (t.label) cv.text(t.label, x + 1, y + 2, 2, [160, 156, 180]);
    x += t.w * S + PAD;
  }
  y += rowH[ri] + PAD;
});
save(out, cv.png());
console.log(`${rel(out)}  (échelle ×${S})`);
