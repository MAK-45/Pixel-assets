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
};

// ================================================================ chargement
async function loadLibrary() {
  const inline = window.__PIXEL_LIBRARY__;
  if (inline) {
    Object.assign(state, { catalog: inline.catalog, modules: inline.modules, sources: inline.sources });
    return;
  }
  state.base = new URL("../", location.href);
  const res = await fetch(new URL("library/catalog.json", state.base));
  if (!res.ok) throw new Error("library/catalog.json introuvable : lancez `npm run build`.");
  state.catalog = await res.json();
  await Promise.all(Object.values(state.catalog.assets).map(async (a) => {
    state.modules[a.id] = (await import(new URL(a.module, state.base).href)).default;
  }));
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
  if (!state.query) return true;
  const hay = norm([asset.title, asset.description, asset.category, asset.slug, ...asset.tags, v.label, v.key, ...v.tags, ...Object.values(v.props)].join(" "));
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
    if (iv) paintFit(icon, iv, 24);
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
    document.querySelector(`.cat[data-cat="${cat.id}"]`)?.toggleAttribute("hidden", !fams.length);
    if (!fams.length) continue;
    shown += fams.length;
    main.append(el("section", { class: "cat-section", id: `cat-${cat.id}` },
      el("div", { class: "cat-head" }, el("h2", { text: cat.title }), el("p", { text: cat.description })),
      fams));
  }
  empty.hidden = shown > 0;
  markSelectedTile();
}

function renderFamily(asset) {
  const variants = Object.values(asset.variants).filter((v) => variantMatches(asset, v));
  if (!variants.length) return null;
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
const mod = await import("https://cdn.jsdelivr.net/gh/${REPO}@main/library/js/nature/tree.js");`;
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
