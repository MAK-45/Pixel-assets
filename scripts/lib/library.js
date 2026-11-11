// Cœur de la bibliothèque : charge les fichiers `assets/<catégorie>/<asset>.px.js` avec le moteur
// claude-pxl (vendored dans .claude/skills/claude-pxl), lit leurs métadonnées `meta`, valide les
// conventions et rend chaque variante en mémoire. L'écriture sur disque est dans build.js.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as vm from "node:vm";

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
export const ASSETS_DIR = join(ROOT, "assets");
export const LIBRARY_DIR = join(ROOT, "library");
export const PXL_DIR = join(ROOT, ".claude/skills/claude-pxl");

const pxl = await import(join(PXL_DIR, "src/index.ts"));
const { encodeGif } = await import(join(PXL_DIR, "src/node/gif.ts"));
export const { Project, PxError, wrap, encodePng, packSheet, sheetJson, toHex, preview, previewScale } = pxl;
const scenes = await import("./scene.js");

/** Tailles nominales : `size` d'une variante = la plus petite qui contient max(w, h). */
export const STANDARD_SIZES = [8, 16, 24, 32, 48, 64, 96, 128, 192, 256, 384, 512];

const SLUG_RE = /^[a-z][a-z0-9_]*$/;
const CATEGORY_RE = /^[a-z][a-z0-9-]*$/;
const TAG_RE = /^[a-z0-9][a-z0-9-]*$/;
const META_KEYS = new Set(["title", "description", "tags", "variants", "order", "license", "author", "scene"]);
const VARIANT_KEYS = new Set(["label", "props", "tags", "description"]);

/** Posix-style path relative to the repo root (stable across OSes, used in the catalog). */
export const rel = (p) => relative(ROOT, p).split("\\").join("/");

// ---------------------------------------------------------------- discovery

/** Categories metadata from assets/categories.json (order = display order). */
export function readCategories() {
  const file = join(ASSETS_DIR, "categories.json");
  return existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : {};
}

/** Every asset file: assets/<category>/<slug>.px.js (files and folders starting with "_" are skipped). */
export function listAssetFiles() {
  const out = [];
  for (const cat of readdirSync(ASSETS_DIR).sort()) {
    const dir = join(ASSETS_DIR, cat);
    if (cat.startsWith("_") || cat.startsWith(".") || !statSync(dir).isDirectory()) continue;
    for (const f of readdirSync(dir).sort())
      if (f.endsWith(".px.js") && !f.startsWith("_")) out.push(join(dir, f));
  }
  return out;
}

// ---------------------------------------------------------------- loading

/**
 * Load one art file like `pxl` does (vm sandbox, DSL globals, include()), and also capture the
 * top-level `meta` object (declared with const, let or var). Throws a PxError with file:line.
 */
export function loadArt(file) {
  const abs = resolve(file);
  const p = new Project();
  const env = p.env();
  // importAssets("nature/tree", ["oak_summer_48"]) : copie des variantes d'une autre famille en
  // parties privées "_tree_oak_summer_48" (pixels en clés de palette, donc swap/recolor marchent).
  env.importAssets = (id, keys) => importAssets(p, env, abs, id, keys);
  const ctx = vm.createContext({ ...env, console });
  const stack = [];
  const run = (path, isMain) => {
    if (stack.includes(path)) throw new PxError(`include cycle: ${[...stack, path].join(" -> ")}`);
    let code;
    try { code = readFileSync(path, "utf8"); } catch {
      throw new PxError(`cannot read art file '${path}'`, p.callerLoc());
    }
    // Appended after the last line: line/column numbers of the file stay exact.
    if (isMain) code += '\n;globalThis.__meta__ = typeof meta === "undefined" ? undefined : meta;';
    p.addFile(path);
    stack.push(path);
    try {
      vm.runInContext(code, ctx, { filename: path });
    } catch (e) {
      throw wrap(e, (s) => p.locFromStack(s));
    } finally {
      stack.pop();
    }
  };
  p.includeHook = (path) => run(isAbsolute(path) ? path : resolve(dirname(stack[stack.length - 1]), path), false);
  run(abs, true);
  // The meta object was created inside the sandbox: copy it out as plain JSON data.
  const meta = ctx.__meta__ === undefined ? undefined : JSON.parse(JSON.stringify(ctx.__meta__));
  return { project: p, meta };
}

// ---------------------------------------------------------------- imports entre familles

// Familles déjà chargées (une scène en importe beaucoup) ; `loading` détecte les cycles.
const families = new Map();
const loading = new Set();

function familyProject(id) {
  const file = join(ASSETS_DIR, `${id}.px.js`);
  if (families.has(file)) return families.get(file);
  if (!existsSync(file)) throw new PxError(`importAssets: famille '${id}' introuvable (${rel(file)})`);
  if (loading.has(file)) throw new PxError(`importAssets: cycle d'imports via '${id}'`);
  loading.add(file);
  try {
    const { project } = loadArt(file);
    families.set(file, project);
    return project;
  } finally {
    loading.delete(file);
  }
}

/** Pixels d'une image en lignes de clés de palette ("." = transparent). */
function keyRows(img, reverse, where) {
  const rows = [];
  for (let y = 0; y < img.h; y++) {
    let s = "";
    for (let x = 0; x < img.w; x++) {
      const c = img.data[y * img.w + x];
      if ((c & 255) === 0) { s += "."; continue; }
      const k = reverse.get(c);
      if (k === undefined) throw new PxError(`importAssets: ${where} utilise la couleur ${toHex(c)} absente de la palette commune`);
      s += k;
    }
    rows.push(s);
  }
  return rows;
}

const painter = (rows) => (c) => {
  for (let y = 0; y < rows.length; y++)
    for (let x = 0; x < rows[y].length; x++) if (rows[y][x] !== ".") c.px(x, y, rows[y][x]);
};

/**
 * Définit dans le projet `p` une partie privée par variante importée et renvoie
 * { <variante>: { name, w, h, frames, ms } } (ms = durée de chaque image pour une animation).
 */
function importAssets(p, env, from, id, keys) {
  if (typeof id !== "string" || !/^[a-z][a-z0-9-]*\/[a-z][a-z0-9_]*$/.test(id))
    throw new PxError(`importAssets("<catégorie>/<asset>", ["variante", ...]) : identifiant '${id}' invalide`);
  const slug = id.split("/")[1];
  if (join(ASSETS_DIR, `${id}.px.js`) === from) throw new PxError(`importAssets: une famille ne s'importe pas elle-même`);
  const fp = familyProject(id);
  const all = fp.exported().map((n) => variantKey(slug, n));
  const wanted = keys ?? all;
  if (!Array.isArray(wanted)) throw new PxError(`importAssets("${id}", [...]) : liste de variantes attendue`);
  const reverse = p.pal.reverse();
  const out = {};
  for (const key of wanted) {
    if (!all.includes(key)) throw new PxError(`importAssets: '${id}' n'a pas de variante '${key}' (variantes : ${all.join(", ")})`);
    const src = key === "default" ? slug : `${slug}_${key}`;
    const name = `_${slug}_${key}`;
    if (p.assets.has(name)) { out[key] = p.__imports[name]; continue; }
    const built = fp.build(src);
    const frames = built.anim ? fp.frames(src) : [];
    const { w, h } = built.img;
    if (frames.length > 1) {
      env.anim(name, { w, h }, ...frames.map((f) => env.frame({ ms: f.ms }, painter(keyRows(f.img, reverse, `${id}/${key}`)))));
    } else {
      env.sprite(name, { w, h }, painter(keyRows(built.img, reverse, `${id}/${key}`)));
    }
    const info = { name, w, h, frames: Math.max(1, frames.length), ms: frames.map((f) => f.ms) };
    (p.__imports ??= {})[name] = info;
    out[key] = info;
  }
  return out;
}

// ---------------------------------------------------------------- validation

/**
 * Load + validate one asset file. Returns { info, project, errors, warnings } where info has
 * id, category, slug, meta and the exported variant names. Never throws.
 */
export function inspectAsset(file) {
  const abs = resolve(file);
  const errors = [], warnings = [];
  const category = basename(dirname(abs));
  const slug = basename(abs).replace(/\.px\.js$/, "");
  const where = rel(abs);
  const info = { id: `${category}/${slug}`, category, slug, file: abs, source: where, meta: undefined, names: [] };

  if (dirname(dirname(abs)) !== ASSETS_DIR) errors.push(`${where}: un asset doit être dans assets/<catégorie>/<asset>.px.js`);
  if (!CATEGORY_RE.test(category)) errors.push(`${where}: nom de catégorie '${category}' invalide (minuscules, chiffres, tirets)`);
  if (!SLUG_RE.test(slug)) errors.push(`${where}: nom d'asset '${slug}' invalide (minuscules, chiffres, _)`);

  let project;
  try {
    ({ project, meta: info.meta } = loadArt(abs));
  } catch (e) {
    errors.push(`${where}: ${wrap(e).message}`);
    return { info, project, errors, warnings };
  }

  const meta = info.meta;
  if (!meta || typeof meta !== "object") {
    errors.push(`${where}: déclarer \`const meta = { title, description, tags, variants }\` en haut du fichier`);
    return { info, project, errors, warnings };
  }
  for (const k of Object.keys(meta)) if (!META_KEYS.has(k)) errors.push(`${where}: meta.${k} inconnu (autorisés : ${[...META_KEYS].join(", ")})`);
  if (typeof meta.title !== "string" || !meta.title.trim()) errors.push(`${where}: meta.title (texte) requis`);
  if (typeof meta.description !== "string" || !meta.description.trim()) errors.push(`${where}: meta.description (texte) requis`);
  if (!Array.isArray(meta.tags) || !meta.tags.length) errors.push(`${where}: meta.tags (liste de mots-clés anglais) requis`);
  else for (const t of meta.tags) if (typeof t !== "string" || !TAG_RE.test(t)) errors.push(`${where}: tag '${t}' invalide (minuscules, chiffres, tirets, en anglais)`);

  const names = project.exported();
  info.names = names;
  if (meta.scene !== undefined) {
    // Scène : uniquement des parties privées ; ses variantes sont ses périodes (meta.scene.periods).
    if (names.length) errors.push(`${where}: une scène ne définit que des parties privées ("_nom") ; sprites exportés en trop : ${names.join(", ")}`);
    errors.push(...scenes.validateScene(meta.scene, (n) => project.assets.has(n), where));
    const periods = Object.keys(meta.scene?.periods ?? {});
    for (const [k, v] of Object.entries(meta.variants ?? {})) {
      if (!periods.includes(k)) errors.push(`${where}: meta.variants.${k} n'est pas une période de meta.scene.periods (${periods.join(", ")})`);
      for (const kk of Object.keys(v ?? {})) if (!VARIANT_KEYS.has(kk)) errors.push(`${where}: meta.variants.${k}.${kk} inconnu (autorisés : ${[...VARIANT_KEYS].join(", ")})`);
    }
    info.names = periods.map((p) => `${slug}_${p}`);
    return { info, project, errors, warnings };
  }
  if (!names.length) errors.push(`${where}: aucun sprite exporté (les noms qui commencent par "_" sont des parties privées)`);
  const prefix = slug + "_";
  for (const n of names) if (n !== slug && !n.startsWith(prefix)) errors.push(`${where}: le sprite '${n}' doit s'appeler '${prefix}<variante>'`);

  const variants = meta.variants ?? {};
  if (typeof variants !== "object" || Array.isArray(variants)) errors.push(`${where}: meta.variants doit être un objet { <variante>: { label, props } }`);
  const keys = new Set(names.map((n) => variantKey(slug, n)));
  for (const [k, v] of Object.entries(variants)) {
    if (!keys.has(k)) errors.push(`${where}: meta.variants.${k} ne correspond à aucun sprite exporté (sprites : ${[...keys].join(", ")})`);
    if (!v || typeof v !== "object") { errors.push(`${where}: meta.variants.${k} doit être un objet`); continue; }
    for (const kk of Object.keys(v)) if (!VARIANT_KEYS.has(kk)) errors.push(`${where}: meta.variants.${k}.${kk} inconnu (autorisés : ${[...VARIANT_KEYS].join(", ")})`);
    if (v.props !== undefined && (typeof v.props !== "object" || Array.isArray(v.props))) errors.push(`${where}: meta.variants.${k}.props doit être un objet { axe: valeur }`);
    for (const t of v.tags ?? []) if (!TAG_RE.test(t)) errors.push(`${where}: tag '${t}' invalide dans meta.variants.${k}`);
  }
  for (const k of keys) if (!variants[k]) warnings.push(`${where}: la variante '${k}' n'a pas d'entrée dans meta.variants (label généré automatiquement)`);
  return { info, project, errors, warnings };
}

export function variantKey(slug, name) {
  return name === slug ? "default" : name.slice(slug.length + 1);
}

// ---------------------------------------------------------------- rendering

/** Pixel data as rows of palette keys ("." = transparent) + the key -> hex map actually used. */
export class RowEncoder {
  constructor(pal) {
    // Reverse lookup color -> key. Prefer mnemonic letters over index keys (digits).
    this.byColor = new Map();
    for (const [key, color] of pal.keys) {
      const cur = this.byColor.get(color);
      if (cur === undefined || (/\d/.test(cur) && !/\d/.test(key))) this.byColor.set(color, key);
    }
    this.used = new Map(); // key -> hex
    this.spare = [..."0123456789!$%&*+-/:;<=>?@^~|"].filter((c) => !pal.keys.has(c));
    this.extra = new Map(); // color -> spare key
  }
  keyOf(color) {
    if ((color & 255) === 0) return ".";
    let key = this.byColor.get(color);
    if (key === undefined) {
      key = this.extra.get(color);
      if (key === undefined) {
        key = this.spare.shift();
        if (key === undefined) return null; // too many colors for a char map
        this.extra.set(color, key);
      }
    }
    if (!this.used.has(key)) this.used.set(key, toHex(color));
    return key;
  }
  rows(img) {
    const rows = [];
    for (let y = 0; y < img.h; y++) {
      let s = "";
      for (let x = 0; x < img.w; x++) {
        const k = this.keyOf(img.data[y * img.w + x]);
        if (k === null) return null;
        s += k;
      }
      rows.push(s);
    }
    return rows;
  }
  palette() {
    return Object.fromEntries([...this.used].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
  }
}

const dataUrl = (mime, buf) => `data:${mime};base64,${buf.toString("base64")}`;
const sizeOf = (w, h) => STANDARD_SIZES.find((s) => s >= Math.max(w, h)) ?? Math.max(w, h);
const autoLabel = (key) => key.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());

/**
 * Render every variant of an inspected asset. Returns the asset record (catalog entry + full
 * pixel data) and binary files to write. Throws on render errors.
 */
export function renderAsset({ info, project }) {
  const { slug, category, id, meta } = info;
  if (meta.scene) return renderSceneAsset({ info, project });
  const variants = {}, files = [], sheetItems = [], tags = [];
  for (const name of info.names) {
    const key = variantKey(slug, name);
    const def = project.assets.get(name);
    const vmeta = meta.variants?.[key] ?? {};
    const built = project.build(name);
    const frames = built.anim ? project.frames(name) : [];
    const animated = frames.length > 1;
    const img = built.img;
    const enc = new RowEncoder(def.pal);
    const base = `library/png/${category}/${slug}/${key}`;
    const v = {
      key, name, id: `${id}/${key}`,
      label: vmeta.label ?? autoLabel(key),
      ...(vmeta.description ? { description: vmeta.description } : {}),
      kind: animated ? "anim" : def.kind === "scene" ? "scene" : "sprite",
      w: img.w, h: img.h, size: sizeOf(img.w, img.h),
      props: vmeta.props ?? {},
      tags: vmeta.tags ?? [],
      png: base + ".png",
    };
    let pngBuf;
    if (animated) {
      const { sheet } = packSheet(frames.map((f, i) => ({ name: `${key}_${i}`, img: f.img })), frames.length);
      pngBuf = encodePng(sheet);
      const gifBuf = encodeGif(frames);
      files.push({ path: base + ".gif", data: gifBuf });
      Object.assign(v, { gif: base + ".gif", frameCount: frames.length, loopMs: frames.reduce((a, f) => a + f.ms, 0) });
      const rowFrames = frames.map((f) => ({ ms: f.ms, rows: enc.rows(f.img) }));
      v.data = {
        pngDataUrl: dataUrl("image/png", encodePng(frames[0].img)),
        stripDataUrl: dataUrl("image/png", pngBuf),
        gifDataUrl: dataUrl("image/gif", gifBuf),
        palette: null, rows: rowFrames[0].rows, frames: rowFrames,
      };
      if (rowFrames.some((f) => f.rows === null)) { v.data.rows = null; v.data.frames = frames.map((f) => ({ ms: f.ms, rows: null })); }
      tags.push({ name: key, from: sheetItems.length, to: sheetItems.length + frames.length - 1 });
      frames.forEach((f, i) => sheetItems.push({ name: `${key}_${i}`, img: f.img, ms: f.ms }));
    } else {
      pngBuf = encodePng(img);
      v.data = { pngDataUrl: dataUrl("image/png", pngBuf), palette: null, rows: enc.rows(img) };
      sheetItems.push({ name: key, img });
    }
    v.data.palette = v.data.rows ? enc.palette() : null;
    files.push({ path: base + ".png", data: pngBuf });
    variants[key] = v;
  }

  // One sprite sheet per asset family (TexturePacker JSON hash: Phaser, Godot, PixiJS...).
  const sheetBase = `library/sheets/${category}/${slug}`;
  const { sheet, frames } = packSheet(sheetItems, undefined, 1);
  files.push({ path: sheetBase + ".png", data: encodePng(sheet) });
  files.push({ path: sheetBase + ".json", data: sheetJson(slug + ".png", sheet, frames, tags) });

  // Axes of variation, e.g. { species: ["oak", "pine"], season: [...] } — handy for filtering.
  const axes = {};
  for (const v of Object.values(variants))
    for (const [a, val] of Object.entries(v.props)) {
      axes[a] ??= [];
      if (!axes[a].includes(val)) axes[a].push(val);
    }
  const sizes = [...new Set(Object.values(variants).map((v) => v.size))].sort((a, b) => a - b);

  return {
    record: {
      id, slug, category,
      title: meta.title, description: meta.description, tags: meta.tags,
      ...(meta.license ? { license: meta.license } : {}),
      ...(meta.author ? { author: meta.author } : {}),
      order: meta.order ?? 0,
      source: info.source,
      module: `library/js/${category}/${slug}.js`,
      sheet: { png: sheetBase + ".png", json: sheetBase + ".json" },
      axes, sizes,
      variantCount: Object.keys(variants).length,
      variants,
    },
    files,
  };
}

/** Scène : variantes = périodes (aperçus composés), plus les données du moteur et le paquet. */
function renderSceneAsset({ info, project }) {
  const { slug, category, id, meta } = info;
  const out = scenes.renderScene({ info, project });
  for (const v of Object.values(out.variants)) v.size = sizeOf(v.w, v.h);
  const sheetBase = `library/sheets/${category}/${slug}`;
  const { sheet, frames } = packSheet(out.sheetItems, undefined, 1);
  const files = [
    ...out.files,
    { path: sheetBase + ".png", data: encodePng(sheet) },
    { path: sheetBase + ".json", data: sheetJson(slug + ".png", sheet, frames, []) },
  ];
  const axes = {};
  for (const v of Object.values(out.variants))
    for (const [a, val] of Object.entries(v.props)) {
      axes[a] ??= [];
      if (!axes[a].includes(val)) axes[a].push(val);
    }
  return {
    record: {
      id, slug, category,
      title: meta.title, description: meta.description, tags: meta.tags,
      ...(meta.license ? { license: meta.license } : {}),
      ...(meta.author ? { author: meta.author } : {}),
      order: meta.order ?? 0,
      source: info.source,
      module: `library/js/${category}/${slug}.js`,
      sheet: { png: sheetBase + ".png", json: sheetBase + ".json" },
      axes,
      sizes: [...new Set(Object.values(out.variants).map((v) => v.size))],
      variantCount: Object.keys(out.variants).length,
      variants: out.variants,
      scene: out.summary,
      sceneData: out.data,
    },
    files,
  };
}
