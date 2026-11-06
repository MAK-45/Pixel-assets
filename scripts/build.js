#!/usr/bin/env node
// Construit la bibliothèque à partir de assets/ :
//   library/catalog.json             index de tout (sans données de pixels)
//   library/index.js                 point d'entrée ES module (catalog, load, find, helpers)
//   library/runtime.js, index.d.ts   helpers de dessin + types
//   library/js/<cat>/<asset>.js      un module ES par famille, avec toutes les variantes
//   library/png/<cat>/<asset>/<variante>.png (+ .gif pour les animations)
//   library/sheets/<cat>/<asset>.png + .json   sprite sheet par famille
//   docs/index.html                  galerie autonome (un seul fichier, ouvrable sans serveur)
//   dist/gallery.html                même galerie au format artefact claude.ai (non versionnée)
// Atomique : si un asset a une erreur, rien n'est écrit.
//
// Usage : node scripts/build.js [--quiet]
import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { ASSETS_DIR, LIBRARY_DIR, ROOT, inspectAsset, listAssetFiles, readCategories, renderAsset, wrap } from "./lib/library.js";
import { standaloneGallery } from "./lib/standalone.js";

const quiet = process.argv.includes("--quiet");
const log = (...a) => { if (!quiet) console.log(...a); };

export function buildLibrary() {
  const files = listAssetFiles();
  const inspected = files.map(inspectAsset);
  const errors = inspected.flatMap((r) => r.errors);
  const warnings = inspected.flatMap((r) => r.warnings);
  const out = [];
  const records = [];
  if (!errors.length) {
    for (const r of inspected) {
      try {
        const { record, files: fs } = renderAsset(r);
        records.push(record);
        out.push(...fs);
      } catch (e) {
        errors.push(`${r.info.source}: ${wrap(e).message}`);
      }
    }
  }
  return { records, files: out, errors, warnings };
}

function catalogOf(records) {
  const catMeta = readCategories();
  const catIds = [...new Set([...Object.keys(catMeta), ...records.map((r) => r.category)])]
    .filter((c) => records.some((r) => r.category === c));
  const byCat = (c) => records.filter((r) => r.category === c)
    .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
  const strip = (r) => ({
    ...r,
    variants: Object.fromEntries(Object.entries(r.variants).map(([k, v]) => {
      const { data, ...rest } = v;
      return [k, rest];
    })),
  });
  const assets = {};
  for (const c of catIds) for (const r of byCat(c)) assets[r.id] = strip(r);
  return {
    name: "pixel-assets",
    format: 1,
    description: "Bibliothèque de pixel art. Chemins relatifs à la racine du dépôt. Données de pixels complètes dans `module` (ES module).",
    stats: {
      categories: catIds.length,
      assets: records.length,
      variants: records.reduce((n, r) => n + r.variantCount, 0),
    },
    categories: catIds.map((c) => ({
      id: c,
      title: catMeta[c]?.title ?? c,
      description: catMeta[c]?.description ?? "",
      icon: catMeta[c]?.icon ?? "",
      assets: byCat(c).map((r) => r.id),
    })),
    assets,
  };
}

/** Famille avec pixels, telle qu'exportée par son module JS (src en data URL, rows + palette). */
function moduleAsset(record) {
  return {
    ...record,
    variants: Object.fromEntries(Object.entries(record.variants).map(([k, v]) => {
      const { data, ...rest } = v;
      const flat = { ...rest, src: data.pngDataUrl };
      if (data.stripDataUrl) Object.assign(flat, { strip: data.stripDataUrl, gifSrc: data.gifDataUrl });
      Object.assign(flat, { palette: data.palette, rows: data.rows });
      if (data.frames) flat.frames = data.frames;
      return [k, flat];
    })),
  };
}

function moduleOf(record) {
  const asset = moduleAsset(record);
  return [
    `// GÉNÉRÉ par scripts/build.js — ne pas modifier. Source : ${record.source}`,
    `// ${record.title} — ${record.variantCount} variante(s). Usage :`,
    `//   import asset from "./${record.slug}.js"; const v = asset.variants["${Object.keys(record.variants)[0]}"];`,
    `//   v.src (data URL PNG), v.rows + v.palette (pixels, "." = transparent), v.w, v.h`,
    `/** @type {import("../../index.d.ts").PixelAsset} */`,
    `export const asset = ${JSON.stringify(asset, null, 1)};`,
    `export default asset;`,
    ``,
  ].join("\n");
}

function indexOf(catalog) {
  const loaders = Object.values(catalog.assets)
    .map((a) => `  ${JSON.stringify(a.id)}: () => import(${JSON.stringify("./" + a.module.replace(/^library\//, ""))}),`)
    .join("\n");
  return `// GÉNÉRÉ par scripts/build.js — ne pas modifier.
// Point d'entrée de la bibliothèque pixel-assets (ES module, navigateur ou Node >= 18).
//   import { catalog, load, find, toCanvas } from "./library/index.js";
//   const tree = await load("nature/tree");              // famille complète
//   const v = await loadVariant("nature/tree/oak_summer_full_32");
//   const hits = find({ category: "nature", tag: "tree", props: { season: "autumn" } });
export * from "./runtime.js";

/** @type {import("./index.d.ts").Catalog} */
export const catalog = ${JSON.stringify(catalog, null, 1)};

const loaders = {
${loaders}
};

/** Identifiants de toutes les familles ("categorie/asset"). */
export const ids = Object.keys(loaders);

/** Charge une famille complète (avec pixels). */
export async function load(id) {
  const l = loaders[id];
  if (!l) throw new Error(\`pixel-assets: asset inconnu '\${id}' (connus : \${ids.join(", ")})\`);
  return (await l()).default;
}

/** Charge une variante par identifiant complet "categorie/asset/variante". */
export async function loadVariant(fullId) {
  const i = fullId.lastIndexOf("/");
  const asset = await load(fullId.slice(0, i));
  const v = asset.variants[fullId.slice(i + 1)];
  if (!v) throw new Error(\`pixel-assets: variante inconnue '\${fullId}' (connues : \${Object.keys(asset.variants).join(", ")})\`);
  return v;
}

/**
 * Recherche dans le catalogue (sans charger les pixels). Tous les critères sont optionnels :
 * { category, asset, tag, text, size, maxSize, kind, props: { axe: valeur } }.
 * Retourne des variantes du catalogue enrichies de { assetId, category }.
 */
export function find(q = {}) {
  const text = q.text?.toLowerCase();
  const out = [];
  for (const a of Object.values(catalog.assets)) {
    if (q.category && a.category !== q.category) continue;
    if (q.asset && a.slug !== q.asset && a.id !== q.asset) continue;
    for (const v of Object.values(a.variants)) {
      if (q.tag && !a.tags.includes(q.tag) && !v.tags.includes(q.tag)) continue;
      if (q.size && v.size !== q.size) continue;
      if (q.maxSize && Math.max(v.w, v.h) > q.maxSize) continue;
      if (q.kind && v.kind !== q.kind) continue;
      if (q.props && Object.entries(q.props).some(([k, val]) => v.props[k] !== val)) continue;
      if (text) {
        const hay = [a.title, a.description, ...a.tags, v.label, v.key, ...v.tags, ...Object.values(v.props).map(String)].join(" ").toLowerCase();
        if (!text.split(/\\s+/).every((w) => hay.includes(w))) continue;
      }
      out.push({ ...v, assetId: a.id, category: a.category });
    }
  }
  return out;
}
`;
}

function write(path, data) {
  const abs = join(ROOT, path);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, data);
}

export function writeLibrary({ records, files }) {
  for (const d of ["png", "js", "sheets"]) rmSync(join(LIBRARY_DIR, d), { recursive: true, force: true });
  for (const f of files) write(f.path, f.data);
  const catalog = catalogOf(records);
  for (const r of records) write(r.module, moduleOf(r));
  write("library/catalog.json", JSON.stringify(catalog, null, 1) + "\n");
  write("library/index.js", indexOf(catalog));
  copyFileSync(join(ROOT, "scripts/templates/runtime.js"), join(LIBRARY_DIR, "runtime.js"));
  copyFileSync(join(ROOT, "scripts/templates/index.d.ts"), join(LIBRARY_DIR, "index.d.ts"));
  const sources = Object.fromEntries(records.map((r) => [r.id, readFileSync(join(ROOT, r.source), "utf8")]));
  sources["_palette"] = readFileSync(join(ASSETS_DIR, "_palette.px.js"), "utf8");
  const lib = { catalog, modules: Object.fromEntries(records.map((r) => [r.id, moduleAsset(r)])), sources };
  write("docs/index.html", standaloneGallery(lib));
  // Version « fragment » pour la publication en artefact claude.ai (non versionnée).
  write("dist/gallery.html", standaloneGallery(lib, { fragment: true }));
  return catalog;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const t0 = performance.now();
  const res = buildLibrary();
  for (const w of res.warnings) log(`avertissement  ${w}`);
  if (res.errors.length) {
    for (const e of res.errors) console.error(`ERREUR  ${e}`);
    console.error(`\n${res.errors.length} erreur(s) : rien n'a été écrit.`);
    process.exit(1);
  }
  const catalog = writeLibrary(res);
  for (const c of catalog.categories) {
    log(`${c.title} (${c.id})`);
    for (const id of c.assets) {
      const a = catalog.assets[id];
      log(`  ${id}  ${a.variantCount} variantes  tailles ${a.sizes.join("/")}`);
    }
  }
  const s = catalog.stats;
  log(`\n${s.categories} catégories, ${s.assets} familles, ${s.variants} variantes -> library/ + docs/index.html (${Math.round(performance.now() - t0)} ms)`);
}
