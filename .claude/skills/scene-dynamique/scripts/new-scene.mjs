#!/usr/bin/env node
// Crée le squelette d'une scène dynamique (parallaxe) depuis le modèle du skill /scene-dynamique ;
// il se construit tel quel.
//   node .claude/skills/scene-dynamique/scripts/new-scene.mjs <asset> "<Titre>"
// <asset> : nom du fichier en minuscules (a-z0-9_), ex. snowy_peaks -> assets/scenes/snowy_peaks.px.js
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "../../../..");
const args = process.argv.slice(2);
const [slug, title] = args.filter((a) => !a.startsWith("--"));

if (args.includes("--static")) {
  console.error("Ce skill ne crée que des scènes dynamiques (parallaxe). Les scènes statiques auront leur propre skill.");
  process.exit(1);
}
if (!slug || !/^[a-z][a-z0-9_]*$/.test(slug)) {
  console.error('Usage : node .claude/skills/scene-dynamique/scripts/new-scene.mjs <asset> "<Titre>"   (asset : a-z0-9_)');
  process.exit(1);
}
const file = join(ROOT, "assets", "scenes", `${slug}.px.js`);
if (existsSync(file)) {
  console.error(`assets/scenes/${slug}.px.js existe déjà : modifier cette scène plutôt que d'en créer une autre.`);
  process.exit(1);
}
const cats = JSON.parse(readFileSync(join(ROOT, "assets", "categories.json"), "utf8"));
if (!cats.scenes) console.warn("attention : la catégorie 'scenes' manque dans assets/categories.json");

const tpl = readFileSync(join(HERE, "..", "assets", "template.px.js"), "utf8");
writeFileSync(file, tpl.replaceAll("__ASSET__", slug).replaceAll("__TITLE__", title ?? slug));
console.log(`créé : assets/scenes/${slug}.px.js (scène dynamique, 8 plans)
ensuite :
  npm run scene -- assets/scenes/${slug}.px.js --planes    aperçus dans assets/scenes/out/_preview/
  npm run build                                            bibliothèque, galerie, paquet library/scenes/${slug}/
  node .claude/skills/scene-dynamique/scripts/test-scene.cjs ${slug} --gallery`);
