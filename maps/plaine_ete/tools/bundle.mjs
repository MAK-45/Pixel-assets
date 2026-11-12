// Builds ../preview.html: one self-contained page (the modules are inlined), for a browser or an artifact.
//   node maps/plaine_ete/tools/bundle.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = join(dirname(fileURLToPath(import.meta.url)), "..");
const MODULES = ["./assets.js", "./map.js", "./painter.js", "./dummy-blob.js"];

function wrap(name) {
  let src = readFileSync(join(DIR, name), "utf8");
  const names = [];
  src = src.replace(/^import \{([^}]+)\} from "(\.\/[\w-]+\.js)";$/gm, (_, list, from) => `const {${list}} = __m["${from}"];`);
  src = src.replace(/^export (const|function) (\w+)/gm, (_, kind, id) => (names.push(id), `${kind} ${id}`));
  return `__m["${name}"] = (() => {\n${src}\nreturn { ${names.join(", ")} };\n})();\n`;
}

const UI = String.raw`
const { MAP, OPTIONS, PALETTES, layout, fogAt, standReason, segmentFree } = __m["./map.js"];
const { createPainter } = __m["./painter.js"];
const { renderScene } = __m["./dummy-blob.js"];

const W = 480, H = 270;
const cv = document.getElementById("scene");
const ctx = cv.getContext("2d");
ctx.imageSmoothingEnabled = false;
const img = ctx.createImageData(W, H);
const P = createPainter(W, H);

const o = { W, H, D: 4, camX: 0, palette: PALETTES.glace.tones };
for (const [k, d] of Object.entries(OPTIONS)) o[k] = d.def;
const blob = { x: MAP.home.x, gy: MAP.home.gy };
let paused = false, showGround = false, t0 = performance.now(), tPaused = 0, note = "";

// ---- settings panel
const panel = document.getElementById("settings");
function slider(key, label, min, max, step, value, unit, onInput) {
  const row = document.createElement("label");
  row.className = "set";
  row.htmlFor = "opt-" + key;
  row.innerHTML = '<span class="lab"></span><output></output><input type="range">';
  row.querySelector(".lab").textContent = label;
  const out = row.querySelector("output"), inp = row.querySelector("input");
  Object.assign(inp, { id: "opt-" + key, min, max, step, value });
  const show = () => (out.textContent = (+inp.value).toLocaleString("fr-FR") + (unit ? " " + unit : ""));
  inp.addEventListener("input", () => { onInput(+inp.value); show(); });
  show();
  panel.append(row);
}
for (const [k, d] of Object.entries(OPTIONS)) slider(k, d.label, d.min, d.max, d.step, d.def, d.unit, (v) => (o[k] = v));
slider("D", "Durée de la boucle (D)", 1, 16, 0.1, 4, "s", (v) => (o.D = v));
slider("camX", "Caméra (camX, parallaxe)", -60, 60, 1, 0, "px", (v) => (o.camX = v));

const pal = document.getElementById("palette");
for (const [k, p] of Object.entries(PALETTES)) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "swatch";
  b.id = "pal-" + k;
  b.setAttribute("aria-pressed", k === "glace");
  b.innerHTML = '<span class="ramp"></span><span></span>';
  b.lastChild.textContent = p.label;
  for (const c of p.tones) { const s = document.createElement("i"); s.style.background = c; b.firstChild.append(s); }
  b.addEventListener("click", () => {
    o.palette = p.tones;
    pal.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x === b));
  });
  pal.append(b);
}
document.getElementById("pause").addEventListener("change", (e) => {
  paused = e.target.checked;
  if (paused) tPaused = (performance.now() - t0) / 1000; else t0 = performance.now() - tPaused * 1000;
});
document.getElementById("ground").addEventListener("change", (e) => (showGround = e.target.checked));
document.getElementById("home").addEventListener("click", () => { blob.x = MAP.home.x; blob.gy = MAP.home.gy; note = ""; });

// ---- moving the stand-in creature
const held = new Set();
const KEYS = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
addEventListener("keydown", (e) => { if (KEYS[e.key] && !e.target.matches("input")) { held.add(e.key); e.preventDefault(); } });
addEventListener("keyup", (e) => held.delete(e.key));
addEventListener("blur", () => held.clear());
document.querySelectorAll("[data-key]").forEach((b) => {
  const k = b.dataset.key;
  b.addEventListener("pointerdown", (e) => { held.add(k); b.setPointerCapture(e.pointerId); });
  for (const ev of ["pointerup", "pointercancel", "lostpointercapture"]) b.addEventListener(ev, () => held.delete(k));
});
let acc = 0;
function step(dt) {
  acc += dt;
  while (acc > 1 / 60) {
    acc -= 1 / 60;
    let dx = 0, dy = 0;
    for (const k of held) { dx += KEYS[k][0] * 2; dy += KEYS[k][1]; }
    if (!dx && !dy) continue;
    const nx = blob.x + dx, ny = blob.gy + dy;
    if (segmentFree(blob.x, blob.gy, nx, ny, o)) { blob.x = nx; blob.gy = ny; note = ""; }
    else note = standReason(nx, ny, o) ?? "Le passage est bloqué.";
  }
}

// ---- scale: whole factors only, pixelated below 1
const wrapEl = document.getElementById("stage");
function fit() {
  const s = Math.floor(wrapEl.clientWidth / W);
  cv.style.width = s >= 1 ? W * Math.min(s, 3) + "px" : "100%";
  document.getElementById("zoom").textContent = s >= 1 ? "×" + Math.min(s, 3) : "réduit";
}
addEventListener("resize", fit);
fit();

function overlay() {
  const L = layout(o);
  ctx.save();
  ctx.translate(-Math.round(o.camX), 0);
  ctx.strokeStyle = "rgba(255,210,90,.9)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  L.walk.forEach(([x, y], i) => (i ? ctx.lineTo(x + 0.5, y + 0.5) : ctx.moveTo(x + 0.5, y + 0.5)));
  ctx.closePath();
  ctx.stroke();
  ctx.strokeStyle = "rgba(255,110,90,.95)";
  for (const ob of L.obstacles) { ctx.beginPath(); ctx.ellipse(ob.x + 0.5, ob.gy + 0.5, ob.rx, ob.ry, 0, 0, 7); ctx.stroke(); }
  ctx.fillStyle = "rgba(255,210,90,.9)";
  ctx.fillRect(L.home.x - 1, L.home.gy - 1, 3, 3);
  ctx.restore();
}

const st = { pos: document.getElementById("s-pos"), fog: document.getElementById("s-fog"), u: document.getElementById("s-u"), note: document.getElementById("s-note") };
let last = performance.now();
function frame(now) {
  step(Math.min(0.1, (now - last) / 1000));
  last = now;
  const t = paused ? tPaused : (now - t0) / 1000;
  P.clear();
  renderScene(P.p, t, o, blob);
  img.data.set(P.compose());
  ctx.putImageData(img, 0, 0);
  if (showGround) overlay();
  st.pos.textContent = "x " + blob.x + " · gy " + blob.gy;
  const fg = fogAt(blob.gy, o);
  st.fog.textContent = fg ? "−" + fg + " teinte" + (fg > 1 ? "s" : "") : "aucune";
  st.u.textContent = ((((t / o.D) % 1) + 1) % 1).toFixed(2);
  st.note.textContent = note || "Le blob peut se tenir ici.";
  st.note.dataset.blocked = !!note;
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
`;

const html = `<title>Plaine d’été 2,5D</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Silkscreen&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
/* Layout: the scene is the page; a quiet console of settings sits under it, night-glass tones taken from the Glace ramp. */
:root {
  --bg: #04060d;
  --panel: #0a1122;
  --line: #1a2846;
  --fg: #dcf8ff;
  --muted: #7d9cc0;
  --accent: #9fe0ff;
  --warn: #ffb48a;
  --display: "Silkscreen", "IBM Plex Mono", ui-monospace, monospace;
  --body: "IBM Plex Sans", system-ui, sans-serif;
  --mono: "IBM Plex Mono", ui-monospace, SFMono-Regular, monospace;
  color-scheme: dark;
}
* { box-sizing: border-box; }
body { background: var(--bg); color: var(--fg); font: 15px/1.5 var(--body);
  padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); padding-block: 20px 40px; }
main { max-width: 1440px; margin: 0 auto; display: grid; gap: 18px; }
header { display: flex; flex-wrap: wrap; align-items: baseline; gap: 6px 16px; }
h1 { font: 400 22px/1.1 var(--display); letter-spacing: .02em; margin: 0; text-wrap: balance; color: var(--accent); }
header p { margin: 0; color: var(--muted); max-width: 70ch; }
#stage { display: grid; justify-items: center; }
#scene { display: block; image-rendering: pixelated; image-rendering: crisp-edges; max-width: 100%; background: #000; }
.status { display: flex; flex-wrap: wrap; gap: 8px 22px; font: 13px var(--mono); color: var(--muted); align-items: center; }
.status b { color: var(--fg); font-weight: 500; }
#s-note { color: var(--accent); }
#s-note[data-blocked="true"] { color: var(--warn); }
.console { display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); gap: 18px; }
@media (max-width: 820px) { .console { grid-template-columns: minmax(0, 1fr); } }
section { background: var(--panel); border: 1px solid var(--line); border-radius: 6px; padding: 14px 16px; display: grid; gap: 12px; align-content: start; min-width: 0; }
h2 { font: 400 13px var(--display); letter-spacing: .06em; margin: 0; color: var(--muted); }
#settings { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 10px 22px; }
.set { display: grid; grid-template-columns: 1fr auto; gap: 2px 8px; font-size: 13.5px; }
.set output { font: 12.5px var(--mono); color: var(--accent); font-variant-numeric: tabular-nums; }
.set input { grid-column: 1 / -1; width: 100%; accent-color: var(--accent); }
#palette { display: flex; flex-wrap: wrap; gap: 8px; }
.swatch { display: grid; gap: 5px; justify-items: start; background: transparent; color: var(--fg); border: 1px solid var(--line); border-radius: 4px; padding: 6px 8px; font: 13px var(--body); cursor: pointer; }
.swatch[aria-pressed="true"] { border-color: var(--accent); }
.ramp { display: flex; } .ramp i { width: 9px; height: 12px; }
.row { display: flex; flex-wrap: wrap; gap: 10px 18px; align-items: center; font-size: 13.5px; }
button.act, .pad button { background: var(--line); color: var(--fg); border: 1px solid transparent; border-radius: 4px; padding: 6px 12px; font: 13px var(--body); cursor: pointer; touch-action: none; }
.pad { display: grid; grid-template-columns: repeat(3, 44px); grid-template-rows: repeat(2, 38px); gap: 4px; }
.pad button { padding: 0; font: 16px var(--mono); }
.pad [data-key="ArrowUp"] { grid-column: 2; } .pad [data-key="ArrowLeft"] { grid-column: 1; grid-row: 2; }
.pad [data-key="ArrowDown"] { grid-column: 2; grid-row: 2; } .pad [data-key="ArrowRight"] { grid-column: 3; grid-row: 2; }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.help { color: var(--muted); font-size: 13px; margin: 0; }
kbd { font: 12px var(--mono); border: 1px solid var(--line); border-radius: 3px; padding: 0 4px; }
</style>
<main>
  <header>
    <h1>Plaine d’été</h1>
    <p>Carte 2,5D pour Couveuse : vue de côté avec profondeur, 480 × 270 px. Un blob factice permet de vérifier la profondeur, la brume et les obstacles.</p>
  </header>
  <div id="stage"><canvas id="scene" width="480" height="270" aria-label="La carte Plaine d’été, animée, avec le blob factice"></canvas></div>
  <div class="status" aria-live="polite">
    <span>Blob <b id="s-pos"></b></span><span>Brume <b id="s-fog"></b></span><span>Phase u <b id="s-u"></b></span><span>Aperçu <b id="zoom"></b></span>
    <span id="s-note"></span>
  </div>
  <div class="console">
    <section>
      <h2>Réglages du décor</h2>
      <div id="settings"></div>
    </section>
    <section>
      <h2>Blob factice</h2>
      <p class="help"><kbd>←</kbd> <kbd>→</kbd> pour aller de côté, <kbd>↑</kbd> vers le fond, <kbd>↓</kbd> vers nous.</p>
      <div class="row">
        <div class="pad" aria-label="Déplacer le blob">
          <button type="button" id="k-up" data-key="ArrowUp" aria-label="Vers le fond">↑</button>
          <button type="button" id="k-left" data-key="ArrowLeft" aria-label="À gauche">←</button>
          <button type="button" id="k-down" data-key="ArrowDown" aria-label="Vers nous">↓</button>
          <button type="button" id="k-right" data-key="ArrowRight" aria-label="À droite">→</button>
        </div>
        <button type="button" class="act" id="home">Ramener chez lui</button>
      </div>
      <div class="row">
        <label><input type="checkbox" id="ground"> Montrer le sol jouable et les obstacles</label>
        <label><input type="checkbox" id="pause"> Pause</label>
      </div>
      <h2>Palette</h2>
      <div id="palette"></div>
    </section>
  </div>
</main>
<script>
const __m = {};
${MODULES.map(wrap).join("\n")}
${UI}
</script>
`;
writeFileSync(join(DIR, "preview.html"), html);
console.log(`preview.html (${(Buffer.byteLength(html) / 1024).toFixed(0)} KB)`);
