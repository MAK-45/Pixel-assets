// Galerie Pixel Assets — vanilla JS, aucune dépendance.
// Deux modes de chargement :
//   - autonome (docs/index.html) : données inlinées dans window.__PIXEL_LIBRARY__ par scripts/build.js
//   - serveur (npm run dev, /web/) : lit ../library/catalog.json et importe les modules ../library/js/…
const $ = (s, r = document) => r.querySelector(s);
const el = (tag, attrs = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null || v === false) continue;
    if (k === "class") e.className = v;
    else if (k === "text") e.textContent = v;
    else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v === true ? "" : v);
  }
  for (const k of kids.flat()) if (k !== null && k !== undefined && k !== false) e.append(k);
  return e;
};
const norm = (s) => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const hashOf = (s) => norm(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const REPO = "mak-45/pixel-assets";

const state = {
  catalog: null,
  modules: {},
  sources: null,
  base: null,
  query: "",
  filters: {},
  sel: null,
  zoom: 8,
  bg: "checker",
  grid: false,
  frame: 0,
  playing: true,
  tab: "source",
  runtime: null,        // moteur des scènes (createSceneFrom, bundleScene, packScene…)
  runtimeSource: null,  // texte du moteur, pour l'export autonome
  sceneType: "all",     // filtre des scènes : all | parallax | static
};

// ================================================================ chargement
async function loadLibrary() {
  const inline = window.__PIXEL_LIBRARY__;
  if (inline) {
    Object.assign(state, { catalog: inline.catalog, modules: inline.modules, sources: inline.sources });
    state.runtime = window.__PIXEL_SCENE_RUNTIME__ ?? null;
    state.runtimeSource = inline.sceneRuntime ?? null;
    return;
  }
  state.base = new URL("../", location.href);
  const res = await fetch(new URL("library/catalog.json", state.base));
  if (!res.ok) throw new Error("library/catalog.json introuvable : lancez `npm run build`.");
  state.catalog = await res.json();
  await Promise.all(Object.values(state.catalog.assets).map(async (a) => {
    state.modules[a.id] = (await import(new URL(a.module, state.base).href)).default;
  }));
  if (Object.values(state.modules).some((m) => m.scene)) {
    const url = new URL("library/scene-runtime.js", state.base).href;
    state.runtime = await import(url);
    state.runtimeSource = await fetch(url).then((r) => r.text());
  }
}

const sourceCache = new Map();
async function sourceOf(asset) {
  if (state.sources?.[asset.id]) return state.sources[asset.id];
  if (sourceCache.has(asset.id)) return sourceCache.get(asset.id);
  const text = state.base
    ? await fetch(new URL(asset.source, state.base)).then((r) => (r.ok ? r.text() : `// ${asset.source} introuvable`))
    : `// Source non incluse : voir ${asset.source}`;
  sourceCache.set(asset.id, text);
  return text;
}

// ================================================================ dessin pixel
const images = new Map();
function imageOf(src) {
  let img = images.get(src);
  if (!img) { img = new Image(); img.src = src; images.set(src, img); }
  return img;
}

/** Dessine une variante (ou une image de l'animation) sur un contexte 2D à l'échelle donnée. */
function drawVariant(ctx, v, x, y, scale, frame = 0) {
  const rows = v.frames ? v.frames[frame % v.frames.length].rows : v.rows;
  if (rows && v.palette) {
    for (let j = 0; j < v.h; j++) {
      const row = rows[j];
      for (let i = 0; i < v.w; i++) {
        const k = row[i];
        if (k === ".") continue;
        ctx.fillStyle = v.palette[k];
        ctx.fillRect(x + i * scale, y + j * scale, scale, scale);
      }
    }
    return;
  }
  // Repli : trop de couleurs pour une table de clés, on dessine le PNG.
  ctx.imageSmoothingEnabled = false;
  if (v.strip) ctx.drawImage(imageOf(v.strip), (frame % v.frameCount) * v.w, 0, v.w, v.h, x, y, v.w * scale, v.h * scale);
  else ctx.drawImage(imageOf(v.src), x, y, v.w * scale, v.h * scale);
}

function renderToCanvas(v, scale, what = "frame", frame = 0) {
  const n = what === "strip" && v.frames ? v.frames.length : 1;
  const c = document.createElement("canvas");
  c.width = v.w * scale * n;
  c.height = v.h * scale;
  const ctx = c.getContext("2d");
  for (let f = 0; f < n; f++) drawVariant(ctx, v, f * v.w * scale, 0, scale, n > 1 ? f : frame);
  return c;
}

// ================================================================ recherche / filtres
function variantMatches(asset, v) {
  const f = state.filters[asset.id] ?? {};
  for (const [axis, val] of Object.entries(f)) if (v.props[axis] !== val) return false;
  if (asset.scene && state.sceneType !== "all" && asset.scene.type !== state.sceneType) return false;
  if (!state.query) return true;
  const kindWords = asset.scene ? (asset.scene.type === "parallax" ? "scene dynamique parallaxe defilement infini" : "scene statique fixe") : v.frames ? "anim animation" : "";
  const hay = norm([asset.title, asset.description, asset.category, asset.slug, ...asset.tags, v.label, v.key, ...v.tags, ...Object.values(v.props), kindWords].join(" "));
  return norm(state.query).split(/\s+/).filter(Boolean).every((w) => hay.includes(w));
}

// ================================================================ rendu : catégories
function renderCats() {
  const nav = $("#cats");
  nav.replaceChildren(el("p", { class: "cap", text: "Catégories" }));
  for (const cat of state.catalog.categories) {
    const count = cat.assets.reduce((n, id) => n + state.catalog.assets[id].variantCount, 0);
    const icon = el("canvas", { width: 16, height: 16, "aria-hidden": "true" });
    const [aId, key] = splitVariantId(cat.icon);
    const iv = state.modules[aId]?.variants[key] ?? firstVariant(cat.assets[0]);
    if (iv?.rows === null && iv.kind !== "sprite" && iv.kind !== "anim") paintThumb(icon, iv, 30);
    else if (iv) paintFit(icon, iv, 24);
    nav.append(el("button", {
      class: "cat", type: "button", "data-cat": cat.id,
      onclick: () => { document.getElementById(`cat-${cat.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }); },
    }, el("span", { class: "cat-icon" }, icon), el("span", { class: "cat-name", text: cat.title }), el("span", { class: "cat-count", text: count })));
    nav.append(el("div", { class: "sub" }, cat.assets.map((id) => el("a", {
      href: `#${hashOf(id)}`, text: state.catalog.assets[id].title,
      onclick: (e) => { e.preventDefault(); document.getElementById(`fam-${hashOf(id)}`)?.scrollIntoView({ behavior: "smooth", block: "start" }); },
    }))));
  }
}

function splitVariantId(full = "") {
  const i = full.lastIndexOf("/");
  return [full.slice(0, i), full.slice(i + 1)];
}
function firstVariant(assetId) {
  const m = state.modules[assetId];
  return m && Object.values(m.variants)[0];
}
/** Dessine v dans un petit canvas, à la plus grande échelle entière qui tient dans `box` px. */
function paintFit(canvas, v, box) {
  const s = Math.max(1, Math.floor(box / Math.max(v.w, v.h)));
  canvas.width = v.w * s;
  canvas.height = v.h * s;
  canvas.style.width = `${v.w * s}px`;
  canvas.style.height = `${v.h * s}px`;
  drawVariant(canvas.getContext("2d"), v, 0, 0, s);
}

// ================================================================ rendu : planches
function renderMain() {
  const main = $("#main");
  const empty = $("#empty");
  main.replaceChildren(empty);
  let shown = 0;
  for (const cat of state.catalog.categories) {
    const fams = [];
    for (const id of cat.assets) {
      const fam = renderFamily(state.modules[id]);
      if (fam) fams.push(fam);
    }
    // Scènes filtrées par type : la section reste là (avec son filtre) même vide.
    const keepScenes = !fams.length && state.sceneType !== "all" && !state.query && cat.assets.some((id) => isScene(state.modules[id]));
    if (keepScenes) fams.push(el("p", { class: "empty", text: state.sceneType === "static" ? "Aucune scène statique pour l'instant." : "Aucune scène dynamique pour l'instant." }));
    document.querySelector(`.cat[data-cat="${cat.id}"]`)?.toggleAttribute("hidden", !fams.length);
    if (!fams.length) continue;
    shown += keepScenes ? 0 : fams.length;
    main.append(el("section", { class: "cat-section", id: `cat-${cat.id}` },
      el("div", { class: "cat-head" }, el("h2", { text: cat.title }), el("p", { text: cat.description }), sceneFilter(cat)),
      fams));
  }
  empty.hidden = shown > 0;
  markSelectedTile();
  watchThumbs();
}

function renderFamily(asset) {
  const variants = Object.values(asset.variants).filter((v) => variantMatches(asset, v));
  if (!variants.length) return null;
  if (asset.scene) return renderSceneFamily(asset, variants);
  const f = state.filters[asset.id] ?? {};
  const axes = Object.entries(asset.axes).filter(([, vals]) => vals.length > 1);
  const total = Object.keys(asset.variants).length;
  return el("article", { class: "family", id: `fam-${hashOf(asset.id)}` },
    el("div", { class: "fam-head" },
      el("div", { class: "fam-title" },
        el("h3", {}, asset.title, el("span", { class: "id", text: asset.id })),
        el("p", { text: asset.description })),
      el("div", { class: "fam-actions" },
        el("span", { class: "tile-dims", text: `${variants.length === total ? total : `${variants.length} / ${total}`} variantes · ${asset.sizes.map((s) => s + " px").join(", ")}` }))),
    el("div", { class: "tags" }, asset.tags.map((t) => el("span", { class: "tag", text: t }))),
    axes.length ? el("div", { class: "axes" }, axes.map(([axis, vals]) => el("div", { class: "axis" },
      el("span", { class: "axis-name", text: axis }),
      vals.map((val) => el("button", {
        class: `chip${f[axis] === val ? " on" : ""}`, type: "button", "aria-pressed": String(f[axis] === val), text: String(val),
        onclick: () => {
          const cur = (state.filters[asset.id] ??= {});
          if (cur[axis] === val) delete cur[axis]; else cur[axis] = val;
          renderMain();
        },
      }))))) : null,
    el("div", { class: "tiles" }, variants.map((v) => renderTile(asset, v))));
}

function renderTile(asset, v) {
  const s = Math.max(1, Math.floor(96 / Math.max(v.w, v.h)));
  const img = el("img", { src: v.gifSrc ?? v.src, width: v.w * s, height: v.h * s, alt: v.label, loading: "lazy", decoding: "async" });
  return el("button", {
    class: "tile", type: "button", "data-id": v.id, title: v.name,
    onclick: () => openInspector(asset.id, v.key),
  },
  el("span", { class: "tile-art" }, img),
  el("span", { class: "tile-cap" },
    el("span", { class: "tile-label" }, v.label, v.frames ? el("span", { class: "badge", text: "anim" }) : null),
    el("span", { class: "tile-dims", text: `${v.w}×${v.h} · ${v.key}` })));
}

function markSelectedTile() {
  document.querySelectorAll(".tile.on").forEach((t) => t.classList.remove("on"));
  if (state.sel) document.querySelector(`.tile[data-id="${CSS.escape(state.sel.v.id)}"]`)?.classList.add("on");
}

// ================================================================ inspecteur
let animTimer = 0;

function openInspector(assetId, key, { updateHash = true } = {}) {
  const asset = state.modules[assetId];
  const v = asset?.variants[key];
  if (!v) return;
  if (asset.scene) { openViewer(assetId, key, { updateHash }); return; }
  state.sel = { asset, v };
  state.frame = 0;
  state.playing = true;
  const box = window.innerWidth <= 760 ? 220 : 270;
  state.zoom = Math.max(1, Math.min(24, Math.floor(box / Math.max(v.w, v.h))));
  const cat = state.catalog.categories.find((c) => c.id === asset.category);
  $("#i-family").textContent = `${cat?.title ?? asset.category} / ${asset.title}`;
  $("#i-label").textContent = v.label;
  $("#i-meta").textContent = `${v.name} · ${v.w}×${v.h} px · ${v.kind}${v.frames ? ` · ${v.frames.length} images, ${v.loopMs} ms` : ""}`;
  $("#anim-tools").hidden = !v.frames;
  $("#x-what").hidden = !v.frames;
  $("#x-result").hidden = true;
  $("#x-hint").hidden = true;
  $("#inspector").hidden = false;
  $("#app").classList.add("inspecting");
  $("#scrim").hidden = window.innerWidth > 760;
  if (updateHash) history.replaceState(null, "", `#${hashOf(v.id)}`);
  markSelectedTile();
  paintStage();
  updateDims();
  renderCode();
  startAnim();
}

function closeInspector() {
  state.sel = null;
  cancelAnimationFrame(animTimer);
  $("#inspector").hidden = true;
  $("#scrim").hidden = true;
  $("#app").classList.remove("inspecting");
  history.replaceState(null, "", location.pathname + location.search);
  markSelectedTile();
}

function paintStage() {
  if (!state.sel) return;
  const { v } = state.sel;
  const s = state.zoom;
  const c = $("#i-canvas");
  c.width = v.w * s;
  c.height = v.h * s;
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, c.width, c.height);
  drawVariant(ctx, v, 0, 0, s, state.frame);
  if (state.grid && s >= 4) {
    ctx.fillStyle = "rgba(128, 120, 150, 0.35)";
    for (let i = 0; i <= v.w; i++) ctx.fillRect(i * s, 0, 1, c.height);
    for (let j = 0; j <= v.h; j++) ctx.fillRect(0, j * s, c.width, 1);
  }
  $("#z-val").textContent = `×${s}`;
  if (v.frames) {
    $("#a-frame").textContent = `${state.frame + 1} / ${v.frames.length}`;
    $("#a-play").textContent = state.playing ? "Pause" : "Lecture";
  }
}

function startAnim() {
  cancelAnimationFrame(animTimer);
  const v = state.sel?.v;
  if (!v?.frames) return;
  let last = performance.now(), acc = 0;
  const tick = (now) => {
    if (state.sel?.v !== v) return;
    if (state.playing) {
      acc += now - last;
      const ms = v.frames[state.frame].ms;
      if (acc >= ms) {
        acc -= ms;
        state.frame = (state.frame + 1) % v.frames.length;
        paintStage();
      }
    }
    last = now;
    animTimer = requestAnimationFrame(tick);
  };
  animTimer = requestAnimationFrame(tick);
}

function updateDims() {
  if (!state.sel) return;
  const { v } = state.sel;
  const s = Number($("#x-scale").value);
  const n = $("#x-what").value === "strip" && v.frames ? v.frames.length : 1;
  $("#x-dims").textContent = `${v.w * s * n}×${v.h * s} px`;
}

function exportCanvas() {
  const { v } = state.sel;
  return renderToCanvas(v, Number($("#x-scale").value), $("#x-what").value, state.frame);
}
function exportName() {
  const { asset, v } = state.sel;
  const s = $("#x-scale").value;
  const strip = $("#x-what").value === "strip" && v.frames ? "_strip" : v.frames ? `_f${state.frame}` : "";
  return `${asset.slug}_${v.key}${strip}${s === "1" ? "" : `@${s}x`}.png`;
}

function downloadPng() {
  const url = exportCanvas().toDataURL("image/png");
  const a = el("a", { href: url, download: exportName() });
  document.body.append(a);
  a.click();
  a.remove();
  const img = $("#x-result");
  img.src = url;
  img.hidden = false;
  $("#x-hint").hidden = false;
  toast(`PNG prêt : ${exportName()}`);
}

async function copyPng() {
  try {
    const blob = await new Promise((ok) => exportCanvas().toBlob(ok, "image/png"));
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    toast("Image copiée dans le presse-papiers");
  } catch {
    toast("Copie d'image refusée par le navigateur : utilisez Télécharger");
  }
}

// ================================================================ code
const KW = new Set("const let var for of in if else return function new await async import from export default true false null undefined typeof".split(" "));
const TOKEN = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|(`(?:\\[\s\S]|[^`\\])*`|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)/g;

/** Coloration JS minimale, découpée en lignes (les jetons multilignes sont coupés proprement). */
function highlight(text, plain = false) {
  const lines = [[]];
  const push = (cls, s) => {
    s.split("\n").forEach((part, i) => {
      if (i > 0) lines.push([]);
      if (part) lines[lines.length - 1].push(cls ? el("span", { class: cls, text: part }) : document.createTextNode(part));
    });
  };
  if (plain) push(null, text);
  else {
    let last = 0;
    for (const m of text.matchAll(TOKEN)) {
      if (m.index > last) push(null, text.slice(last, m.index));
      const [tok, com, str, num, word] = m;
      if (com) push("t-com", tok);
      else if (str) push("t-str", tok);
      else if (num) push("t-num", tok);
      else if (word && KW.has(word)) push("t-kw", tok);
      else if (word && text[m.index + tok.length] === "(") push("t-fn", tok);
      else push(null, tok);
      last = m.index + tok.length;
    }
    if (last < text.length) push(null, text.slice(last));
  }
  return lines;
}

function setCode(text, { path, hl = [], plain = false, start = 1 } = {}) {
  const code = $("#c-code");
  const lines = highlight(text, plain);
  code.replaceChildren(...lines.map((parts, i) => el("span", { class: `ln${hl.includes(i) ? " hl" : ""}`, "data-n": i + start }, parts.length ? parts : "​")));
  $("#c-path").textContent = path ?? "";
  $("#c-box").dataset.raw = text;
  const first = code.querySelector(".ln.hl");
  const box = $("#c-box");
  box.scrollTop = 0;
  if (first) box.scrollTop = Math.max(0, first.getBoundingClientRect().top - box.getBoundingClientRect().top - 48);
}

function moduleSnippet(asset, v) {
  const data = { key: v.key, w: v.w, h: v.h, palette: v.palette, rows: v.rows };
  if (v.frames) Object.assign(data, { frames: v.frames.map((f) => ({ ms: f.ms, rows: "…" })) });
  const rows = JSON.stringify(data, null, 2).replace(/"rows": \[\n([\s\S]*?)\n\s*\]/, (_, body) => `"rows": [\n${body}\n  ]`);
  return `// 1) Dans le dépôt (navigateur ou Node >= 18, ES modules)
import { loadVariant, draw, toCanvas } from "./library/index.js";
const v = await loadVariant("${v.id}");
draw(ctx, v, x, y, { scale: 4${v.frames ? ", frame: 0" : ""} });   // pixels nets à toute échelle
document.body.append(toCanvas(v, { scale: 8 }));

// 2) Ou directement le module de la famille
import ${asset.slug} from "./${asset.module}";
const img = new Image();
img.src = ${asset.slug}.variants.${/^[a-z_$][\w$]*$/i.test(v.key) ? v.key : `["${v.key}"]`}.src;   // PNG en data URL
${v.frames ? `// Animation : .strip (bande ${v.frames.length} images), .frames[i].rows, .gifSrc\n` : ""}
// Fichiers : ${v.png}${v.gif ? `, ${v.gif}` : ""}
// Sprite sheet : ${asset.sheet.png} + ${asset.sheet.json.split("/").pop()}

// Données de la variante (rows : "." = transparent, une lettre = une couleur de palette)
const ${v.key.replace(/\W/g, "_")} = ${rows};
`;
}

async function renderCode() {
  if (!state.sel) return;
  const { asset, v } = state.sel;
  document.querySelectorAll(".tabs button").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.tab === state.tab)));
  $("#c-box").classList.toggle("plain", false);
  if (state.tab === "source") {
    const text = await sourceOf(asset);
    if (state.sel?.v !== v || state.tab !== "source") return;
    const lines = text.split("\n");
    let at = lines.findIndex((l) => l.includes(`"${v.name}"`));
    if (at < 0) {
      // nom construit dans une boucle (`potion_${name}_small`) : chercher le motif
      const parts = v.key.split("_");
      at = lines.findIndex((l) => /sprite\(|anim\(|idle\(/.test(l) && parts.every((p) => l.includes(p) || l.includes("${")) && l.includes(parts[parts.length - 1]));
    }
    const hl = [];
    // surligner la définition : de sa première ligne jusqu'à la prochaine instruction de premier niveau
    if (at >= 0) for (let i = at; i < lines.length && i - at < 40; i++) {
      hl.push(i);
      const next = lines[i + 1] ?? "";
      if (next.trim() === "" || /^\S/.test(next)) break;
    }
    setCode(text, { path: asset.source, hl });
  } else if (state.tab === "module") {
    setCode(moduleSnippet(asset, v), { path: `${asset.module} → variants.${v.key}` });
  } else {
    const rows = v.frames ? v.frames[state.frame].rows : v.rows;
    const legend = Object.entries(v.palette ?? {}).map(([k, c]) => `${k} ${c}`).join("   ");
    const text = rows ? rows.join("\n") : "(trop de couleurs pour une table de clés : utiliser v.src)";
    setCode(text, { path: `${v.w}×${v.h} · "." transparent · palette : ${legend}`, plain: true, start: 0 });
  }
}

// ================================================================ scènes

const isScene = (asset) => !!asset?.scene;
const sceneKind = (asset) => (asset.scene.type === "parallax"
  ? { cls: "dyn", text: "⇄ Dynamique", title: "Scène dynamique : plans en parallaxe, défilement infini dans les deux sens" }
  : { cls: "static", text: "▣ Statique", title: "Scène statique : un écran fixe, sans défilement" });
const kindBadge = (asset) => {
  const k = sceneKind(asset);
  return el("span", { class: `badge ${k.cls}`, text: k.text, title: k.title });
};

/** Miniature réduite (lissée) d'une scène, pour les icônes de catégorie. */
function paintThumb(canvas, v, box) {
  const h = Math.round((box * v.h) / v.w);
  canvas.width = box;
  canvas.height = h;
  canvas.style.width = `${box}px`;
  canvas.style.height = `${h}px`;
  const img = imageOf(v.src);
  const paint = () => {
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(img, 0, 0, box, h);
  };
  if (img.complete && img.naturalWidth) paint();
  else img.addEventListener("load", paint, { once: true });
}

// Filtre de la catégorie Scènes : toutes, dynamiques, statiques.
function sceneFilter(cat) {
  const scenes = cat.assets.map((id) => state.modules[id]).filter(isScene);
  if (!scenes.length) return null;
  const count = (t) => scenes.filter((a) => t === "all" || a.scene.type === t).length;
  const opts = [["all", "Toutes"], ["parallax", "⇄ Dynamiques"], ["static", "▣ Statiques"]];
  return el("div", { class: "scene-filter", role: "group", "aria-label": "Type de scène" },
    opts.map(([t, label]) => el("button", {
      class: `chip${state.sceneType === t ? " on" : ""}`, type: "button", "aria-pressed": String(state.sceneType === t),
      text: `${label} · ${count(t)}`,
      onclick: () => { state.sceneType = t; renderMain(); },
    })));
}

function renderSceneFamily(asset, variants) {
  const sc = asset.scene;
  const k = sceneKind(asset);
  const f = state.filters[asset.id] ?? {};
  const axes = Object.entries(asset.axes).filter(([, vals]) => vals.length > 1);
  const what = sc.type === "parallax"
    ? `${sc.planes.length} plans en parallaxe qui bouclent à l'infini (gauche et droite) · base ${sc.w}×${sc.h} · sol y = ${sc.groundY}`
    : `un écran fixe · base ${sc.w}×${sc.h} · sol y = ${sc.groundY}`;
  return el("article", { class: "family scene-family", id: `fam-${hashOf(asset.id)}` },
    el("div", { class: "fam-head" },
      el("div", { class: "fam-title" },
        el("h3", {}, asset.title, el("span", { class: "id", text: asset.id })),
        el("p", { class: "kind-line" }, el("span", { class: `kind ${k.cls}`, text: k.text, title: k.title }), el("span", { text: what })),
        el("p", { text: asset.description })),
      el("div", { class: "fam-actions" },
        el("button", { class: "btn", type: "button", text: "Ouvrir la visionneuse", onclick: () => openViewer(asset.id, variants[0].key) }))),
    el("div", { class: "tags" }, asset.tags.map((t) => el("span", { class: "tag", text: t }))),
    axes.length ? el("div", { class: "axes" }, axes.map(([axis, vals]) => el("div", { class: "axis" },
      el("span", { class: "axis-name", text: axis }),
      vals.map((val) => el("button", {
        class: `chip${f[axis] === val ? " on" : ""}`, type: "button", "aria-pressed": String(f[axis] === val), text: String(val),
        onclick: () => {
          const cur = (state.filters[asset.id] ??= {});
          if (cur[axis] === val) delete cur[axis]; else cur[axis] = val;
          renderMain();
        },
      }))))) : null,
    el("div", { class: "tiles scene-tiles" }, variants.map((v) => renderSceneTile(asset, v))));
}

// Vignettes 16:9 : l'aperçu fixe tout de suite, puis la scène animée (caméra qui avance) tant
// que la vignette est visible.
const thumbs = new Map(); // canvas -> { asset, period, scene, cam, visible, loading }
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
let thumbObserver = null, thumbRaf = 0, thumbLast = 0;

function renderSceneTile(asset, v) {
  const canvas = el("canvas", { width: asset.scene.w, height: asset.scene.h, role: "img", "aria-label": `${asset.title} – ${v.label}` });
  const still = imageOf(v.src);
  const paint = () => canvas.getContext("2d").drawImage(still, 0, 0);
  if (still.complete && still.naturalWidth) paint();
  else still.addEventListener("load", paint, { once: true });
  thumbs.set(canvas, { asset, period: v.key, scene: null, cam: 0, visible: false, loading: false });
  return el("button", {
    class: "tile scene-tile", type: "button", "data-id": v.id, title: v.name,
    onclick: () => openViewer(asset.id, v.key),
  },
  el("span", { class: "tile-art wide" }, canvas),
  el("span", { class: "tile-cap" },
    el("span", { class: "tile-label" }, v.label, kindBadge(asset), el("span", { class: "badge", text: "anim" })),
    el("span", { class: "tile-dims", text: `${v.w}×${v.h} · ${v.key}` })));
}

function watchThumbs() {
  for (const c of [...thumbs.keys()]) if (!c.isConnected) thumbs.delete(c);
  if (!state.runtime || reduceMotion || !("IntersectionObserver" in window)) return;
  thumbObserver?.disconnect();
  thumbObserver = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const t = thumbs.get(e.target);
      if (t) t.visible = e.isIntersecting;
    }
    startThumbs();
  }, { rootMargin: "80px" });
  for (const c of thumbs.keys()) thumbObserver.observe(c);
}

function startThumbs() {
  if (thumbRaf || viewer.open) return;
  thumbLast = performance.now();
  const tick = (now) => {
    const dt = Math.min(100, now - thumbLast);
    thumbLast = now;
    let any = false;
    for (const [canvas, t] of thumbs) {
      if (!t.visible || !canvas.isConnected) continue;
      any = true;
      if (!t.scene) {
        if (!t.loading) {
          t.loading = true;
          state.runtime.createSceneFrom(t.asset.scene, { period: t.period }).then((sc) => { t.scene = sc; }, () => {});
        }
        continue;
      }
      if (t.asset.scene.type === "parallax") t.cam += dt * 0.03; // 30 px/s
      t.scene.update(dt, t.cam).draw(canvas.getContext("2d"));
    }
    thumbRaf = any && !viewer.open ? requestAnimationFrame(tick) : 0;
  };
  thumbRaf = requestAnimationFrame(tick);
}

// ---------------------------------------------------------------- visionneuse

const RESOLUTIONS = [
  [0, 0, "Base (×1)"],
  [1280, 720, "1280 × 720 (HD)"],
  [1366, 768, "1366 × 768 (portable)"],
  [1600, 900, "1600 × 900"],
  [1920, 1080, "1920 × 1080 (Full HD)"],
  [2560, 1440, "2560 × 1440 (QHD)"],
  [3840, 2160, "3840 × 2160 (4K)"],
];
const SPEED = { walk: 60, run: 150 }; // pixels de base par seconde (aperçu ; le jeu garde les siennes)

const viewer = {
  open: false, asset: null, scene: null, period: null, raf: 0, last: 0,
  cam: 0, btnDir: 1, keyDir: 0, facing: 1, run: false, shift: false, res: 4, marker: true, statusAt: 0,
};

/** Vue d'une résolution simulée : facteur entier le plus grand, puis vue élargie (comme fitCanvas). */
function viewOf(asset, i) {
  const { w: bw, h: bh } = asset.scene;
  const [W, H] = RESOLUTIONS[i][0] ? RESOLUTIONS[i] : [bw, bh];
  const scale = Math.max(1, Math.floor(Math.min(W / bw, H / bh)));
  return { scale, w: Math.ceil(W / scale), h: Math.ceil(H / scale), W, H };
}

async function openViewer(assetId, period, { updateHash = true } = {}) {
  const asset = state.modules[assetId];
  if (!asset?.scene) return;
  if (!state.runtime) { toast("Moteur de scènes indisponible"); return; }
  if (state.sel) closeInspector();
  const sc = asset.scene;
  if (!sc.periods.some((p) => p.id === period)) period = sc.defaultPeriod;
  Object.assign(viewer, { asset, period, cam: 0, keyDir: 0, facing: 1 });
  viewer.btnDir = sc.type === "parallax" && $("#v-auto").checked ? 1 : 0;
  const cat = state.catalog.categories.find((c) => c.id === asset.category);
  $("#v-family").textContent = `${cat?.title ?? asset.category} / ${asset.id}`;
  $("#v-title").replaceChildren(document.createTextNode(`${asset.title} `), kindBadge(asset), el("span", { class: "badge", text: "anim" }));
  $("#v-meta").textContent = `base ${sc.w}×${sc.h} · sol y = ${sc.groundY} · ${sc.planes.length} plans · ${sc.periods.length} périodes`;
  $("#v-move-group").hidden = sc.type !== "parallax";
  $("#v-hint").hidden = sc.type !== "parallax";

  $("#v-periods").replaceChildren(...sc.periods.map((p) => el("button", {
    type: "button", "data-period": p.id, class: p.id === period ? "on" : null, text: p.label,
    onclick: () => setViewerPeriod(p.id),
  })));
  const res = $("#v-res");
  res.replaceChildren(...RESOLUTIONS.map((r, i) => {
    const v = viewOf(asset, i);
    return el("option", { value: String(i), selected: i === viewer.res ? true : null, text: `${r[2]} · ×${v.scale} · vue ${v.w}×${v.h}` });
  }));
  res.value = String(viewer.res);

  const file = `${asset.slug}.js`;
  const bundle = bundleText(asset);
  $("#v-file").textContent = file;
  $("#v-export-info").textContent = `Module JavaScript autonome « ${file} » : moteur de scène et images des ${sc.periods.length} périodes (${Math.round(new Blob([bundle]).size / 1024)} Ko), sans dépendance. Le pack .zip contient en plus les PNG de chaque plan et scene.json pour un autre moteur.`;
  $("#v-export-hint").hidden = true;
  const usage = state.runtime.sceneUsage(sc, file).map((l) => (l.startsWith("  ") ? l.slice(2) : l ? `// ${l}` : "")).join("\n");
  $("#v-usage").replaceChildren(...highlight(usage).map((parts) => el("span", { class: "ln" }, parts.length ? parts : "​")));
  $("#v-usage").dataset.raw = usage;

  const view = viewOf(asset, viewer.res);
  const canvas = $("#v-canvas");
  canvas.width = view.w;
  canvas.height = view.h;
  viewer.scene = await state.runtime.createSceneFrom(sc, { period, width: view.w, height: view.h });
  $("#v-planes").replaceChildren(...viewer.scene.planes.map((p) => el("label", { class: "toggle" },
    el("input", { type: "checkbox", checked: true, onchange: (e) => viewer.scene.setPlaneVisible(p.id, e.target.checked) }),
    `${p.label}`, el("span", { class: "factor", text: p.factor === 0 ? "fixe" : `×${p.factor}${p.front ? " · devant" : ""}` }))));

  if (!$("#viewer").open) $("#viewer").showModal();
  viewer.open = true;
  if (updateHash) history.replaceState(null, "", `#${hashOf(asset.variants[period].id)}`);
  startViewer();
}

function setViewerPeriod(id) {
  if (!viewer.scene || id === viewer.period) return;
  viewer.period = id;
  viewer.scene.setPeriod(id, { fade: 1200 });
  document.querySelectorAll("#v-periods button").forEach((b) => b.classList.toggle("on", b.dataset.period === id));
  history.replaceState(null, "", `#${hashOf(viewer.asset.variants[id].id)}`);
}

function setViewerRes(i) {
  viewer.res = i;
  const view = viewOf(viewer.asset, i);
  const canvas = $("#v-canvas");
  canvas.width = view.w;
  canvas.height = view.h;
  viewer.scene.resize(view.w, view.h);
}

function closeViewer() {
  viewer.open = false;
  cancelAnimationFrame(viewer.raf);
  if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
  $("#v-stage").classList.remove("full");
  history.replaceState(null, "", location.pathname + location.search);
  startThumbs();
}

// Repère de 32 px (taille prévue du personnage), entre les plans du fond et le premier plan.
function drawMarker(ctx, cx, ground, facing, step) {
  const x0 = Math.round(cx) - 6, y0 = ground - 32;
  const legL = step ? 13 : 14, legR = step ? 14 : 13;
  const body = [[4, 0, 5, 6], [3, 6, 7, 2], [2, 8, 9, 10], [0, 9, 2, 8], [11, 9, 2, 8], [3, 18, 3, legL], [7, 18, 3, legR]];
  ctx.fillStyle = "#1a1423";
  for (const [x, y, w, h] of body) ctx.fillRect(x0 + x - 1, y0 + y - 1, w + 2, h + 2);
  ctx.fillStyle = "#e8483f";
  for (const [x, y, w, h] of body) ctx.fillRect(x0 + x, y0 + y, w, h);
  ctx.fillStyle = "#fbfbff";
  ctx.fillRect(x0 + (facing > 0 ? 7 : 5), y0 + 2, 1, 2);
}

function startViewer() {
  cancelAnimationFrame(viewer.raf);
  cancelAnimationFrame(thumbRaf);
  thumbRaf = 0;
  viewer.last = performance.now();
  const tick = (now) => {
    if (!viewer.open) return;
    const dt = Math.min(100, now - viewer.last);
    viewer.last = now;
    const sc = viewer.asset.scene;
    const dir = sc.type === "parallax" ? viewer.keyDir || viewer.btnDir : 0;
    const run = viewer.run || viewer.shift;
    if (dir) {
      viewer.cam += (dir * (run ? SPEED.run : SPEED.walk) * dt) / 1000;
      viewer.facing = dir;
    }
    const scene = viewer.scene;
    scene.update(dt, viewer.cam);
    const ctx = $("#v-canvas").getContext("2d");
    ctx.imageSmoothingEnabled = false;
    scene.drawBack(ctx);
    if (viewer.marker) drawMarker(ctx, scene.width / 2, scene.groundY, viewer.facing, dir ? Math.floor(viewer.cam / 8) % 2 : 0);
    scene.drawFront(ctx);
    if (now - viewer.statusAt > 200) {
      viewer.statusAt = now;
      const v = viewOf(viewer.asset, viewer.res);
      const move = !dir ? "arrêt" : `${run ? "course" : "marche"} ${dir > 0 ? "→" : "←"}`;
      $("#v-status").textContent = `×${v.scale} · vue ${scene.width}×${scene.height} px · sol y = ${scene.groundY} · caméra x = ${Math.round(viewer.cam)} · ${move}`;
    }
    viewer.raf = requestAnimationFrame(tick);
  };
  viewer.raf = requestAnimationFrame(tick);
}

function viewerMove(dir) {
  viewer.btnDir = dir;
  $("#v-auto").checked = false;
}

function toggleFullscreen() {
  const stage = $("#v-stage");
  if (document.fullscreenElement) { document.exitFullscreen?.().catch(() => {}); return; }
  if (stage.classList.contains("full")) { stage.classList.remove("full"); return; }
  const req = stage.requestFullscreen?.({ navigationUI: "hide" });
  if (req) req.catch(() => stage.classList.add("full"));
  else stage.classList.add("full");
}

// ---------------------------------------------------------------- export

const bundleText = (asset) => state.runtime.bundleScene(state.runtimeSource, asset.scene, `${asset.slug}.js`);
const utf8 = (text) => new TextEncoder().encode(text);
const dataUrlBytes = (url) => Uint8Array.from(atob(url.slice(url.indexOf(",") + 1)), (ch) => ch.charCodeAt(0));

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(bytes) {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

/** Archive .zip sans compression (méthode « stored ») : [[chemin, Uint8Array], ...]. */
function zipStore(entries) {
  const parts = [], central = [];
  let offset = 0;
  for (const [name, data] of entries) {
    const nb = utf8(name), crc = crc32(data);
    const head = new DataView(new ArrayBuffer(30));
    head.setUint32(0, 0x04034b50, true); head.setUint16(4, 20, true); head.setUint16(6, 0x0800, true);
    head.setUint16(12, 0x21, true); head.setUint32(14, crc, true); head.setUint32(18, data.length, true);
    head.setUint32(22, data.length, true); head.setUint16(26, nb.length, true);
    parts.push(new Uint8Array(head.buffer), nb, data);
    const cen = new DataView(new ArrayBuffer(46));
    cen.setUint32(0, 0x02014b50, true); cen.setUint16(4, 20, true); cen.setUint16(6, 20, true); cen.setUint16(8, 0x0800, true);
    cen.setUint16(14, 0x21, true); cen.setUint32(16, crc, true); cen.setUint32(20, data.length, true);
    cen.setUint32(24, data.length, true); cen.setUint16(28, nb.length, true); cen.setUint32(42, offset, true);
    central.push(new Uint8Array(cen.buffer), nb);
    offset += 30 + nb.length + data.length;
  }
  const size = central.reduce((n, p) => n + p.length, 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true); end.setUint16(8, entries.length, true); end.setUint16(10, entries.length, true);
  end.setUint32(12, size, true); end.setUint32(16, offset, true);
  return new Blob([...parts, ...central, new Uint8Array(end.buffer)], { type: "application/zip" });
}

function downloadBlob(name, blob) {
  const url = URL.createObjectURL(blob);
  const a = el("a", { href: url, download: name });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
  $("#v-export-hint").hidden = false;
  toast(`Téléchargement : ${name}`);
}

function exportJs() {
  const asset = viewer.asset;
  downloadBlob(`${asset.slug}.js`, new Blob([bundleText(asset)], { type: "text/javascript" }));
}

function exportZip() {
  const asset = viewer.asset, slug = asset.slug, file = `${slug}.js`;
  const pack = state.runtime.packScene(asset.scene);
  const entries = [], seen = new Set();
  for (const f of pack.files) if (!seen.has(f.path)) { seen.add(f.path); entries.push([`${slug}/${f.path}`, dataUrlBytes(f.dataUrl)]); }
  entries.push([`${slug}/scene.json`, utf8(JSON.stringify(pack.json, null, 1) + "\n")]);
  entries.push([`${slug}/${file}`, utf8(bundleText(asset))]);
  entries.push([`${slug}/README.md`, utf8(state.runtime.sceneReadme(asset.scene, asset.description, file))]);
  downloadBlob(`${slug}.zip`, zipStore(entries));
}

async function copyBundle() {
  try {
    await navigator.clipboard.writeText(bundleText(viewer.asset));
    toast(`Code copié : colle-le dans ${viewer.asset.slug}.js`);
  } catch {
    toast("Copie refusée par le navigateur : utilise « Télécharger le .js »");
  }
}

// ================================================================ divers
let toastTimer = 0;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, 2600);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast("Copié");
  } catch {
    const r = document.createRange();
    r.selectNodeContents($("#c-code"));
    const sel = getSelection();
    sel.removeAllRanges();
    sel.addRange(r);
    toast("Texte sélectionné : Ctrl+C pour copier");
  }
}

function agentsCode() {
  return `// Dans le dépôt cloné (ES modules, navigateur ou Node >= 18)
import { catalog, find, load, loadVariant, draw, toPixels } from "./library/index.js";

find({ category: "nature", props: { season: "autumn" }, maxSize: 32 })   // -> variantes (sans pixels)
const tree = await load("nature/tree");                                  // famille complète
const v = tree.variants.oak_autumn_32;
v.src;              // PNG 1x en data URL
v.rows, v.palette;  // pixels lisibles ("." = transparent)
toPixels(v);        // { w, h, data: Uint8ClampedArray RGBA }, aussi dans Node

// À distance, sans cloner
const RAW = "https://raw.githubusercontent.com/${REPO}/main/";
const cat = await (await fetch(RAW + "library/catalog.json")).json();
const png = RAW + cat.assets["nature/tree"].variants.oak_autumn_32.png;
// Dépôt public : import ES direct via jsDelivr
const mod = await import("https://cdn.jsdelivr.net/gh/${REPO}@main/library/js/nature/tree.js");

// Scènes (catalog.assets[id].scene) : module autonome prêt pour un jeu, ou données + moteur
import { createScene, fitCanvas } from "./library/scenes/summer_plain/summer_plain.js";
const scene = await createScene({ period: "night" });   // update(dt, cameraX), drawBack, drawFront…`;
}

function applyHash() {
  const h = location.hash.slice(1);
  if (!h) return;
  for (const a of Object.values(state.modules)) {
    if (hashOf(a.id) === h) { document.getElementById(`fam-${h}`)?.scrollIntoView({ block: "start" }); return; }
    for (const v of Object.values(a.variants)) if (hashOf(v.id) === h) {
      openInspector(a.id, v.key, { updateHash: false });
      document.getElementById(`fam-${hashOf(a.id)}`)?.scrollIntoView({ block: "start" });
      return;
    }
  }
}

function bind() {
  let qTimer = 0;
  $("#q").addEventListener("input", (e) => {
    clearTimeout(qTimer);
    qTimer = setTimeout(() => { state.query = e.target.value.trim(); renderMain(); }, 120);
  });
  $("#i-close").addEventListener("click", closeInspector);
  $("#scrim").addEventListener("click", closeInspector);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && state.sel && !$("#agents").open) closeInspector();
  });
  document.querySelectorAll("[data-bg]").forEach((b) => b.addEventListener("click", () => {
    state.bg = b.dataset.bg;
    document.querySelectorAll("[data-bg]").forEach((x) => x.classList.toggle("on", x === b));
    $("#stage").className = `stage bg-${state.bg}`;
  }));
  $("#z-in").addEventListener("click", () => { state.zoom = Math.min(32, state.zoom + 1); paintStage(); });
  $("#z-out").addEventListener("click", () => { state.zoom = Math.max(1, state.zoom - 1); paintStage(); });
  $("#grid-toggle").addEventListener("change", (e) => { state.grid = e.target.checked; paintStage(); });
  $("#a-play").addEventListener("click", () => { state.playing = !state.playing; paintStage(); });
  const step = (d) => {
    const v = state.sel?.v;
    if (!v?.frames) return;
    state.playing = false;
    state.frame = (state.frame + d + v.frames.length) % v.frames.length;
    paintStage();
    if (state.tab === "pixels") renderCode();
  };
  $("#a-prev").addEventListener("click", () => step(-1));
  $("#a-next").addEventListener("click", () => step(1));
  $("#x-scale").addEventListener("change", updateDims);
  $("#x-what").addEventListener("change", updateDims);
  $("#x-download").addEventListener("click", downloadPng);
  $("#x-copy").addEventListener("click", copyPng);
  document.querySelectorAll(".tabs button").forEach((b) => b.addEventListener("click", () => { state.tab = b.dataset.tab; renderCode(); }));
  $("#c-copy").addEventListener("click", () => copyText($("#c-box").dataset.raw ?? ""));
  $("#agents-btn").addEventListener("click", () => { $("#agents-code").replaceChildren(...highlight(agentsCode()).map((p) => el("span", { class: "ln" }, p.length ? p : "​"))); $("#agents").showModal(); });
  $("#agents-close").addEventListener("click", () => $("#agents").close());
  $("#agents").addEventListener("click", (e) => { if (e.target === $("#agents")) $("#agents").close(); });
  window.addEventListener("hashchange", applyHash);

  // visionneuse de scènes
  const dlg = $("#viewer");
  $("#v-close").addEventListener("click", () => dlg.close());
  dlg.addEventListener("close", closeViewer);
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  $("#v-left").addEventListener("click", () => viewerMove(-1));
  $("#v-right").addEventListener("click", () => viewerMove(1));
  $("#v-stop").addEventListener("click", () => viewerMove(0));
  $("#v-run").addEventListener("change", (e) => { viewer.run = e.target.checked; });
  $("#v-auto").addEventListener("change", (e) => { viewer.btnDir = e.target.checked ? 1 : 0; });
  $("#v-marker").addEventListener("change", (e) => { viewer.marker = e.target.checked; });
  $("#v-res").addEventListener("change", (e) => setViewerRes(Number(e.target.value)));
  $("#v-full").addEventListener("click", toggleFullscreen);
  $("#v-copy-js").addEventListener("click", copyBundle);
  $("#v-dl-js").addEventListener("click", exportJs);
  $("#v-dl-zip").addEventListener("click", exportZip);
  $("#v-copy-usage").addEventListener("click", () => copyText($("#v-usage").dataset.raw ?? ""));
  const keyDir = () => (viewer.keys.has("ArrowRight") ? 1 : 0) - (viewer.keys.has("ArrowLeft") ? 1 : 0);
  viewer.keys = new Set();
  document.addEventListener("keydown", (e) => {
    if (!viewer.open) return;
    viewer.shift = e.shiftKey;
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      viewer.keys.add(e.key);
      viewer.keyDir = keyDir();
      $("#v-auto").checked = false;
      viewer.btnDir = 0;
    }
  });
  document.addEventListener("keyup", (e) => {
    viewer.shift = e.shiftKey;
    viewer.keys.delete(e.key);
    viewer.keyDir = keyDir();
  });
  window.addEventListener("blur", () => { viewer.keys.clear(); viewer.keyDir = 0; viewer.shift = false; });
}

async function main() {
  try {
    await loadLibrary();
  } catch (e) {
    $("#stats").textContent = e.message;
    return;
  }
  const s = state.catalog.stats;
  $("#stats").textContent = `${s.categories} catégories · ${s.assets} familles · ${s.variants} variantes`;
  const mark = firstVariant("nature/tree") && state.modules["nature/tree"].variants.oak_summer_16;
  if (mark) paintFit($("#brand-mark"), mark, 32);
  $("#brand-mark").style.width = "32px";
  $("#brand-mark").style.height = "32px";
  renderCats();
  renderMain();
  bind();
  applyHash();
}

main();

// Mode développement (npm run dev) : recharge la page quand la bibliothèque est reconstruite.
if (!window.__PIXEL_LIBRARY__ && /^(localhost|127\.0\.0\.1)$/.test(location.hostname) && "EventSource" in window) {
  const es = new EventSource("/__reload");
  es.onmessage = () => location.reload();
  es.onerror = () => es.close();
}
