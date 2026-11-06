#!/usr/bin/env node
// Valide les assets sans rien écrire : chargement pxl, `meta`, conventions de nommage, rendu.
//   node scripts/check.js                 tous les assets
//   node scripts/check.js <fichier.px.js> un seul fichier
//   node scripts/check.js --hook          mode hook Claude Code (PostToolUse) : lit le JSON de
//                                         l'outil sur stdin, ne vérifie que les .px.js modifiés,
//                                         sort en code 2 avec les erreurs pour que Claude les corrige.
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ASSETS_DIR, inspectAsset, listAssetFiles, renderAsset, wrap } from "./lib/library.js";

function check(files) {
  const errors = [], warnings = [];
  for (const f of files) {
    const r = inspectAsset(f);
    errors.push(...r.errors);
    warnings.push(...r.warnings);
    if (r.errors.length) continue;
    try { renderAsset(r); } catch (e) { errors.push(`${r.info.source}: ${wrap(e).message}`); }
  }
  return { errors, warnings };
}

const args = process.argv.slice(2);
if (args[0] === "--hook") {
  let input = {};
  try { input = JSON.parse(readFileSync(0, "utf8") || "{}"); } catch { process.exit(0); }
  const file = input.tool_input?.file_path ?? input.tool_input?.path;
  if (!file || !file.endsWith(".px.js")) process.exit(0);
  const abs = resolve(file);
  if (!abs.startsWith(ASSETS_DIR)) process.exit(0);
  // La palette commune touche tout le monde : on revérifie toute la bibliothèque.
  const files = /[\\/]_[^\\/]*$/.test(abs) ? listAssetFiles() : [abs];
  const { errors, warnings } = check(files);
  if (errors.length) {
    console.error(`pixel-assets : ${errors.length} erreur(s) après modification de ${file}\n` + errors.map((e) => `- ${e}`).join("\n"));
    process.exit(2);
  }
  if (warnings.length) console.log(warnings.map((w) => `avertissement : ${w}`).join("\n"));
  process.exit(0);
}

const files = args.length ? args.map((a) => resolve(a)) : listAssetFiles();
const { errors, warnings } = check(files);
for (const w of warnings) console.log(`avertissement  ${w}`);
for (const e of errors) console.error(`ERREUR  ${e}`);
console.log(errors.length ? `\n${errors.length} erreur(s).` : `OK : ${files.length} fichier(s) d'assets valides.`);
process.exit(errors.length ? 1 : 0);
