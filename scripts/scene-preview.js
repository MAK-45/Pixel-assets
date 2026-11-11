#!/usr/bin/env node
// Aperçus de travail d'une scène. Les scènes importent des variantes d'autres familles
// (importAssets), ce que la CLI pxl ne sait pas faire : utiliser cette commande à la place.
//   npm run scene -- assets/scenes/<asset>.px.js [--planes] [--scale 3]
// Écrit dans assets/scenes/out/_preview/ :
//   <asset>_<période>.png          la vue de base (caméra à 0, sans effets), agrandie
//   <asset>_<période>__<plan>.png  chaque bande en entier (avec --planes)
import { mkdirSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { encodePng, inspectAsset, preview, rel, wrap } from "./lib/library.js";
import { renderScene } from "./lib/scene.js";

const args = process.argv.slice(2);
const file = args.find((a) => a.endsWith(".px.js"));
const scale = Number(args[args.indexOf("--scale") + 1]) || 3;
if (!file) {
  console.error("Usage : npm run scene -- assets/scenes/<asset>.px.js [--planes] [--scale 3]");
  process.exit(1);
}
const r = inspectAsset(resolve(file));
for (const w of r.warnings) console.log(`avertissement  ${w}`);
if (r.errors.length) {
  for (const e of r.errors) console.error(`ERREUR  ${e}`);
  process.exit(1);
}
if (!r.info.meta.scene) {
  console.error(`${rel(r.info.file)} n'est pas une scène (pas de meta.scene) : utiliser npm run pxl -- build`);
  process.exit(1);
}
let out;
try {
  out = renderScene(r);
} catch (e) {
  console.error(`ERREUR  ${r.info.source}: ${wrap(e).message}`);
  process.exit(1);
}
const dir = join(dirname(resolve(file)), "out", "_preview");
mkdirSync(dir, { recursive: true });
const slug = basename(file).replace(/\.px\.js$/, "");
for (const [period, img] of Object.entries(out.previews)) {
  const path = join(dir, `${slug}_${period}.png`);
  writeFileSync(path, encodePng(preview(img, scale)));
  console.log(`${rel(path)}  ${img.w}×${img.h} ×${scale}`);
}
if (args.includes("--planes"))
  for (const { period, id, img } of out.planeImages) {
    const s = Math.max(1, Math.min(4, Math.floor(1600 / img.w)));
    const path = join(dir, `${slug}_${period}__${id}.png`);
    writeFileSync(path, encodePng(preview(img, s)));
    console.log(`${rel(path)}  ${img.w}×${img.h} ×${s}`);
  }
