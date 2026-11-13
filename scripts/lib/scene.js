// Scènes : familles dont les variantes sont des périodes de la journée et dont l'image est faite de
// plans (bandes en parallaxe). Le fichier .px.js ne définit que des parties privées et décrit la
// scène dans `meta.scene` ; ce module valide la description, rend chaque plan pour chaque période,
// compose les aperçus et prépare les données du moteur (scripts/templates/scene-runtime.js).
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const pxl = await import(join(ROOT, ".claude/skills/claude-pxl/src/index.ts"));
const { Img, PxError, encodePng, packSheet, toHex } = pxl;
export const RUNTIME_FILE = join(ROOT, "scripts/templates/scene-runtime.js");
const runtime = await import(RUNTIME_FILE);
export const { SCENE_FORMAT, bundleScene, packScene, sceneUsage, sceneReadme } = runtime;

const ID_RE = /^[a-z][a-z0-9_]*$/;
const PLANE_RE = /^[a-z][a-z0-9_-]*$/;
const SCENE_KEYS = new Set(["type", "w", "h", "groundY", "periods", "defaultPeriod", "planes", "sprites", "effects", "speed"]);
const PLANE_KEYS = new Set(["id", "label", "kind", "factor", "y", "image", "periods", "front", "optional", "drift", "driftBy", "loop", "actors", "body"]);
const EFFECT_TYPES = new Set(["twinkle", "shooting", "birds", "butterflies", "fireflies"]);
const TYPES = new Set(["parallax", "static"]);

const isInt = (v) => Number.isInteger(v);
const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);
/** "_sky_{period}" -> "_sky_day" */
const resolveName = (tpl, period) => tpl.replace(/\{period\}/g, period);

/** Périodes où un plan existe : toutes, ou sa liste `periods`. */
const planePeriods = (scene, p) => p.periods ?? Object.keys(scene.periods);

/**
 * Vérifie meta.scene. `has(name)` dit si une partie existe dans le projet.
 * Renvoie la liste des erreurs (texte).
 */
export function validateScene(scene, has, where) {
  const errors = [];
  const err = (m) => errors.push(`${where}: meta.scene${m}`);
  if (!isObj(scene)) return [`${where}: meta.scene doit être un objet`];
  for (const k of Object.keys(scene)) if (!SCENE_KEYS.has(k)) err(`.${k} inconnu (autorisés : ${[...SCENE_KEYS].join(", ")})`);
  if (!TYPES.has(scene.type)) err(`.type : "parallax" (dynamique) ou "static" (statique)`);
  if (!isInt(scene.w) || !isInt(scene.h) || scene.w < 16 || scene.h < 16) err(`.w / .h : taille de base entière (ex. 320 × 180)`);
  if (!isInt(scene.groundY) || scene.groundY < 0 || scene.groundY > scene.h) err(`.groundY : ligne de sol entière entre 0 et h`);
  if (!isObj(scene.periods) || !Object.keys(scene.periods).length) { err(`.periods : { day: "Jour", ... } requis`); return errors; }
  const periods = Object.keys(scene.periods);
  for (const id of periods) if (!ID_RE.test(id) || typeof scene.periods[id] !== "string") err(`.periods.${id} : clé a-z0-9_ et libellé texte`);
  if (scene.defaultPeriod !== undefined && !periods.includes(scene.defaultPeriod)) err(`.defaultPeriod '${scene.defaultPeriod}' n'est pas une période`);
  const needPart = (tpl, list, what) => {
    if (typeof tpl !== "string" || !tpl.startsWith("_")) { err(`${what} : nom de partie privée attendu (ex. "_sol_{period}")`); return; }
    for (const p of list) if (!has(resolveName(tpl, p))) err(`${what} : partie '${resolveName(tpl, p)}' introuvable pour la période ${p}`);
  };

  // sprites (acteurs et effets) : modèle avec ou sans {period}
  const sprites = scene.sprites ?? {};
  if (!isObj(sprites)) err(`.sprites : { nom: "_partie" ou "_partie_{period}" }`);
  for (const [name, tpl] of Object.entries(sprites)) {
    if (!ID_RE.test(name)) err(`.sprites.${name} : nom a-z0-9_`);
    needPart(tpl, tpl?.includes?.("{period}") ? periods : [null], `.sprites.${name}`);
  }

  if (!Array.isArray(scene.planes) || !scene.planes.length) { err(`.planes : liste de plans requise`); return errors; }
  const ids = new Set();
  scene.planes.forEach((p, i) => {
    const at = `.planes[${i}]${p?.id ? ` (${p.id})` : ""}`;
    if (!isObj(p)) { err(`${at} doit être un objet`); return; }
    for (const k of Object.keys(p)) if (!PLANE_KEYS.has(k)) err(`${at}.${k} inconnu (autorisés : ${[...PLANE_KEYS].join(", ")})`);
    if (!PLANE_RE.test(p.id ?? "") || ids.has(p.id)) err(`${at}.id : identifiant unique a-z0-9_-`);
    ids.add(p.id);
    if (typeof p.label !== "string") err(`${at}.label : libellé texte requis`);
    if (typeof p.factor !== "number" || p.factor < 0) err(`${at}.factor : vitesse ≥ 0 (0 = fixe, 1 = vitesse du personnage)`);
    if (!isInt(p.y ?? 0)) err(`${at}.y : entier`);
    if (p.kind !== undefined && p.kind !== "sky") err(`${at}.kind : seul "sky" existe (dégradé d'une colonne)`);
    const list = planePeriods(scene, p);
    if (p.periods && (!Array.isArray(p.periods) || p.periods.some((x) => !periods.includes(x)))) err(`${at}.periods : sous-liste de ${periods.join(", ")}`);
    needPart(p.image, list, `${at}.image`);
    if (p.body) {
      if (!isInt(p.body.x) || !isInt(p.body.y)) err(`${at}.body : { image, x, y, periods? }`);
      needPart(p.body.image, p.body.periods ?? list, `${at}.body.image`);
    }
    for (const [j, a] of (p.actors ?? []).entries())
      if (!isObj(a) || !sprites[a.sprite] || !isInt(a.x) || !isInt(a.y)) err(`${at}.actors[${j}] : { sprite (clé de .sprites), x, y }`);
    if (p.driftBy !== undefined && !isObj(p.driftBy)) err(`${at}.driftBy : { période: px/s }`);
  });

  for (const [period, list] of Object.entries(scene.effects ?? {})) {
    if (!periods.includes(period)) { err(`.effects.${period} : période inconnue`); continue; }
    if (!Array.isArray(list)) { err(`.effects.${period} : liste d'effets`); continue; }
    list.forEach((fx, i) => {
      const at = `.effects.${period}[${i}]`;
      if (!EFFECT_TYPES.has(fx?.type)) err(`${at}.type : ${[...EFFECT_TYPES].join(", ")}`);
      for (const s of [fx.sprite, ...(fx.sprites ?? [])].filter(Boolean)) if (!sprites[s]) err(`${at} : sprite '${s}' absent de .sprites`);
      if (fx.plane && !ids.has(fx.plane)) err(`${at}.plane '${fx.plane}' inconnu`);
      if (!ids.has(fx.after)) err(`${at}.after : id du plan après lequel dessiner l'effet`);
    });
  }
  for (const [period, v] of Object.entries(scene.speed ?? {}))
    if (!periods.includes(period) || typeof v !== "number") err(`.speed.${period} : multiplicateur numérique`);
  return errors;
}

// ---------------------------------------------------------------- rendu

const dataUrl = (buf) => `data:image/png;base64,${buf.toString("base64")}`;

/** Copie src sur dst en (dx, dy), avec mélange alpha. */
function blit(dst, src, dx, dy, sx = 0, sw = src.w) {
  for (let y = 0; y < src.h; y++) {
    const ty = dy + y;
    if (ty < 0 || ty >= dst.h) continue;
    for (let x = 0; x < sw; x++) {
      const tx = dx + x;
      if (tx < 0 || tx >= dst.w) continue;
      const c = src.data[y * src.w + sx + x], a = c & 255;
      if (!a) continue;
      const i = ty * dst.w + tx;
      if (a === 255) { dst.data[i] = c; continue; }
      const d = dst.data[i], da = d & 255, k = a / 255, ka = da / 255 * (1 - k), oa = k + ka;
      const ch = (s) => Math.round((((c >>> s) & 255) * k + ((d >>> s) & 255) * ka) / oa);
      dst.data[i] = ((ch(24) << 24) | (ch(16) << 16) | (ch(8) << 8) | Math.round(oa * 255)) >>> 0;
    }
  }
}

const mod = (a, n) => ((a % n) + n) % n;
function frameIndex(ms, t) {
  if (!ms || ms.length < 2) return 0;
  let x = mod(t, ms.reduce((a, b) => a + b, 0));
  for (let i = 0; i < ms.length; i++) { x -= ms[i]; if (x < 0) return i; }
  return 0;
}

/**
 * Rend une scène : enregistrement de la bibliothèque (variantes = périodes), données du moteur
 * (images en data URL) et fichiers du paquet library/scenes/<asset>/.
 */
export function renderScene({ info, project }) {
  const { slug, category, id, meta } = info;
  const sc = meta.scene;
  const periods = Object.entries(sc.periods).map(([pid, label]) => ({ id: pid, label }));
  const built = new Map(); // nom de partie -> { rec (données moteur), frames: Img[] }
  const imageOf = (name) => {
    if (built.has(name)) return built.get(name);
    const b = project.build(name);
    const frames = b.anim ? project.frames(name) : [];
    let out;
    if (frames.length > 1) {
      const { sheet } = packSheet(frames.map((f, i) => ({ name: String(i), img: f.img })), frames.length);
      out = { rec: { src: dataUrl(encodePng(sheet)), w: b.img.w, h: b.img.h, ms: frames.map((f) => f.ms) }, frames: frames.map((f) => f.img) };
    } else out = { rec: { src: dataUrl(encodePng(b.img)), w: b.img.w, h: b.img.h }, frames: [b.img] };
    built.set(name, out);
    return out;
  };

  // ---- données du moteur
  const sprites = {};
  for (const [name, tpl] of Object.entries(sc.sprites ?? {})) {
    sprites[name] = {};
    if (tpl.includes("{period}")) for (const p of periods) sprites[name][p.id] = imageOf(resolveName(tpl, p.id)).rec;
    else sprites[name]["*"] = imageOf(tpl).rec;
  }
  const planes = sc.planes.map((p) => {
    const images = {};
    for (const per of planePeriods(sc, p)) {
      const im = imageOf(resolveName(p.image, per));
      images[per] = p.kind === "sky" ? { ...im.rec, fill: toHex(im.frames[0].data[0]) } : im.rec;
    }
    const out = { id: p.id, label: p.label, factor: p.factor, y: p.y ?? 0, images };
    for (const k of ["kind", "front", "optional", "drift", "driftBy", "loop", "actors"]) if (p[k] !== undefined) out[k] = p[k];
    if (p.body) {
      const bimages = {};
      for (const per of p.body.periods ?? planePeriods(sc, p)) bimages[per] = imageOf(resolveName(p.body.image, per)).rec;
      out.body = { x: p.body.x, y: p.body.y, images: bimages };
    }
    return out;
  });
  const data = {
    format: SCENE_FORMAT, id, title: meta.title, type: sc.type, w: sc.w, h: sc.h, groundY: sc.groundY,
    defaultPeriod: sc.defaultPeriod ?? periods[0].id, periods, planes, sprites,
    effects: sc.effects ?? {}, speed: sc.speed ?? {},
  };

  // ---- aperçu de chaque période : caméra à 0, sans effets (même placement que le moteur)
  const previewOf = (per) => {
    const img = new Img(sc.w, sc.h);
    for (const p of sc.planes) {
      if (!planePeriods(sc, p).includes(per)) continue;
      const { frames } = imageOf(resolveName(p.image, per));
      const im = frames[0];
      const y = p.y ?? 0;
      if (p.kind === "sky") {
        for (let x = 0; x < sc.w; x += im.w) blit(img, im, x, y);
        if (p.body && (p.body.periods ?? planePeriods(sc, p)).includes(per)) blit(img, imageOf(resolveName(p.body.image, per)).frames[0], p.body.x, p.body.y);
        continue;
      }
      // plan fixe : image centrée, acteurs posés dessus ; bande : image répétée, acteurs qui bouclent
      const fixed = p.loop === false || sc.type === "static";
      const x0 = fixed ? Math.round((sc.w - im.w) / 2) : 0;
      if (fixed) blit(img, im, x0, y);
      else for (let x = 0; x < sc.w; x += im.w) blit(img, im, x, y);
      for (const a of p.actors ?? []) {
        const tpl = sc.sprites[a.sprite];
        const fr = imageOf(resolveName(tpl, per));
        const f = fr.frames[frameIndex(fr.rec.ms, a.phase ?? 0)];
        let ax = fixed ? x0 + a.x : mod(a.x, im.w);
        if (!fixed && ax > sc.w + f.w) ax -= im.w;
        if (a.flip) {
          const flipped = new Img(f.w, f.h);
          for (let yy = 0; yy < f.h; yy++) for (let xx = 0; xx < f.w; xx++) flipped.data[yy * f.w + xx] = f.data[yy * f.w + f.w - 1 - xx];
          blit(img, flipped, ax, y + a.y);
        } else blit(img, f, ax, y + a.y);
      }
    }
    return img;
  };

  const base = `library/png/${category}/${slug}`;
  const files = [];
  const variants = {};
  const sheetItems = [];
  const previews = {};
  for (const p of periods) {
    const vmeta = meta.variants?.[p.id] ?? {};
    const img = previewOf(p.id);
    previews[p.id] = img;
    const buf = encodePng(img);
    files.push({ path: `${base}/${p.id}.png`, data: buf });
    sheetItems.push({ name: p.id, img });
    variants[p.id] = {
      key: p.id, name: `${slug}_${p.id}`, id: `${id}/${p.id}`,
      label: vmeta.label ?? `${meta.title} – ${p.label.toLowerCase()}`,
      ...(vmeta.description ? { description: vmeta.description } : {}),
      kind: sc.type, w: sc.w, h: sc.h, size: 0,
      props: { period: p.id, ...(vmeta.props ?? {}) },
      tags: vmeta.tags ?? [],
      png: `${base}/${p.id}.png`,
      data: { pngDataUrl: dataUrl(buf), palette: null, rows: null },
    };
  }

  // ---- paquet pour les moteurs : scene.json + PNG + module autonome + mode d'emploi
  const dir = `library/scenes/${slug}`;
  const pack = packScene(data);
  const pngs = new Map();
  for (const f of pack.files) if (!pngs.has(f.path)) pngs.set(f.path, Buffer.from(f.dataUrl.split(",")[1], "base64"));
  for (const [path, buf] of pngs) files.push({ path: `${dir}/${path}`, data: buf });
  files.push({ path: `${dir}/scene.json`, data: JSON.stringify(pack.json, null, 1) + "\n" });
  const runtimeSource = readFileSync(RUNTIME_FILE, "utf8");
  files.push({ path: `${dir}/${slug}.js`, data: bundleScene(runtimeSource, data, `${slug}.js`) });
  files.push({ path: `${dir}/README.md`, data: sceneReadme(data, meta.description, `${slug}.js`) });

  const summary = {
    type: sc.type, dynamic: sc.type === "parallax", w: sc.w, h: sc.h, groundY: sc.groundY,
    defaultPeriod: data.defaultPeriod, periods,
    planes: sc.planes.map((p) => ({ id: p.id, label: p.label, factor: p.factor, ...(p.front ? { front: true } : {}), ...(p.optional ? { optional: true } : {}) })),
    animated: true,
    pack: `${dir}/`, json: `${dir}/scene.json`, bundle: `${dir}/${slug}.js`, runtime: "library/scene-runtime.js",
  };
  // images en mémoire pour les aperçus de travail (npm run scene)
  const planeImages = sc.planes.flatMap((p) => planePeriods(sc, p).map((per) => ({ period: per, id: p.id, img: imageOf(resolveName(p.image, per)).frames[0] })));
  return { variants, files, sheetItems, summary, data, previews, planeImages };
}
