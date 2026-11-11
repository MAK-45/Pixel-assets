#!/usr/bin/env node
// Teste une scène dynamique construite (après `npm run build`) dans Chromium (Playwright) :
//   1. le module exporté library/scenes/<asset>/<asset>.js seul : chaque période après une marche
//      (événements accélérés), un fondu, une vue élargie 1366×768 ;
//   2. avec --gallery : la galerie autonome docs/index.html (visionneuse, périodes, export .js
//      identique au fichier de la bibliothèque, archive .zip valide).
// Usage : node .claude/skills/scene-dynamique/scripts/test-scene.cjs <asset> [--gallery] [--out <dossier>]
// Captures dans assets/scenes/out/_test/<asset>/ (ignoré par git) : les regarder.
// Code de sortie 1 s'il y a des erreurs (console, exceptions, export différent…).
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../../../..");
const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith("--") && args[args.indexOf(a) - 1] !== "--out");
const withGallery = args.includes("--gallery");
const OUT = args.includes("--out") ? path.resolve(args[args.indexOf("--out") + 1]) : path.join(ROOT, "assets/scenes/out/_test", slug ?? "");

if (!slug) {
  console.error("Usage : node .claude/skills/scene-dynamique/scripts/test-scene.cjs <asset> [--gallery] [--out <dossier>]");
  process.exit(1);
}
const bundlePath = path.join(ROOT, "library/scenes", slug, `${slug}.js`);
const jsonPath = path.join(ROOT, "library/scenes", slug, "scene.json");
if (!fs.existsSync(bundlePath) || !fs.existsSync(jsonPath)) {
  console.error(`library/scenes/${slug}/ introuvable : lancer npm run build d'abord.`);
  process.exit(1);
}
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  console.error("Playwright introuvable : test impossible ici. Se contenter des aperçus de npm run scene.");
  process.exit(2);
}
const scene = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const periods = scene.periods.map((p) => p.id);
if (scene.type !== "parallax") {
  console.error(`${slug} est une scène « ${scene.type} » : ce test ne vise que les scènes dynamiques (parallax).`);
  process.exit(1);
}
fs.mkdirSync(OUT, { recursive: true });

const PAGE = `<!doctype html><html><body style="margin:0;background:#000"><canvas id="c"></canvas>
<script type="module">
import { createScene, fitCanvas } from "/library/scenes/${slug}/${slug}.js";
let seed = 7;
const random = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
window.run = async ({ W, H, period, cam, ms, fadeTo, fadeAt }) => {
  const view = fitCanvas(document.getElementById("c"), { width: W, height: H, pixelRatio: 1 });
  const scene = await createScene({ period, width: view.w, height: view.h, random, frequency: 6 });
  for (let t = 0; t < ms; t += 16) {
    if (fadeTo && t >= fadeAt && scene.period !== fadeTo) scene.setPeriod(fadeTo, { fade: 2000 });
    scene.update(16, (cam * t) / ms);
  }
  view.ctx.setTransform(view.scale, 0, 0, view.scale, 0, 0);
  scene.drawBack(view.ctx);
  view.ctx.fillStyle = "#e8483f";                       // repère : personnage de 32 px au centre
  view.ctx.fillRect(Math.round(view.w / 2) - 6, scene.groundY - 32, 12, 32);
  scene.drawFront(view.ctx);
  return { scale: view.scale, w: view.w, h: view.h, groundY: scene.groundY, period: scene.period };
};
window.ready = true;
</script></body></html>`;

const problems = [];
const watch = (page, where) => {
  page.on("console", (m) => { if (m.type() === "error") problems.push(`${where} console : ${m.text()}`); });
  page.on("pageerror", (e) => problems.push(`${where} exception : ${e.message}`));
};

(async () => {
  const browser = await chromium.launch();

  // ---- 1. module exporté seul
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  watch(page, "module");
  await page.route("http://scene.test/**", (route) => {
    const url = new URL(route.request().url());
    if (url.pathname === "/") return route.fulfill({ contentType: "text/html", body: PAGE });
    const file = path.join(ROOT, decodeURIComponent(url.pathname));
    if (!file.startsWith(ROOT) || !fs.existsSync(file)) return route.fulfill({ status: 404, body: "" });
    route.fulfill({ contentType: file.endsWith(".js") ? "text/javascript" : "application/octet-stream", body: fs.readFileSync(file) });
  });
  await page.goto("http://scene.test/");
  await page.waitForFunction(() => window.ready, null, { timeout: 15000 });
  // marche vers la droite puis vers la gauche selon la période (900 px en 15 s), fondu, vue élargie
  const shots = periods.map((p, i) => [`${p}`, { W: 960, H: 540, period: p, cam: i % 2 ? -900 : 900, ms: 15000 }]);
  if (periods.length > 1) shots.push([`fade_${periods[0]}_${periods[periods.length - 1]}`, { W: 960, H: 540, period: periods[0], cam: 300, ms: 4000, fadeTo: periods[periods.length - 1], fadeAt: 3000 }]);
  shots.push(["wide_1366x768", { W: 1366, H: 768, period: periods[0], cam: 500, ms: 6000 }]);
  for (const [name, a] of shots) {
    try {
      const info = await page.evaluate((x) => window.run(x), a);
      await page.screenshot({ path: path.join(OUT, `${name}.png`), clip: { x: 0, y: 0, width: a.W, height: a.H } });
      console.log(`module  ${name.padEnd(22)} ×${info.scale} vue ${info.w}×${info.h} sol ${info.groundY}`);
    } catch (e) {
      problems.push(`module ${name} : ${e.message}`);
    }
  }

  // ---- 2. galerie autonome
  if (withGallery) {
    const gallery = path.join(ROOT, "docs/index.html");
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
    const g = await ctx.newPage();
    watch(g, "galerie");
    const hash = `scenes-${slug.replace(/_/g, "-")}-${periods[0]}`;
    await g.goto(`file://${gallery}#${hash}`);
    try {
      await g.waitForSelector("#viewer[open]", { timeout: 15000 });
      await g.waitForTimeout(800);
      const badge = await g.textContent("#v-title .badge");
      if (await g.isHidden("#v-move-group")) problems.push("galerie : commandes de déplacement masquées pour une scène dynamique");
      if (!badge.includes("Dynamique")) problems.push(`galerie : badge « ${badge} » au lieu de ⇄ Dynamique`);
      for (const p of periods) {
        await g.click(`#v-periods button[data-period="${p}"]`);
        await g.waitForTimeout(1600);
        await g.screenshot({ path: path.join(OUT, `gallery_${p}.png`) });
      }
      const [dl] = await Promise.all([g.waitForEvent("download"), g.click("#v-dl-js")]);
      const js = path.join(OUT, `${slug}.export.js`);
      await dl.saveAs(js);
      if (!fs.readFileSync(js).equals(fs.readFileSync(bundlePath))) problems.push("galerie : le .js exporté diffère de library/scenes/<asset>/<asset>.js");
      const [dz] = await Promise.all([g.waitForEvent("download"), g.click("#v-dl-zip")]);
      const zipPath = path.join(OUT, `${slug}.export.zip`);
      await dz.saveAs(zipPath);
      const zip = fs.readFileSync(zipPath);
      const entries = zip.readUInt16LE(zip.length - 22 + 10);
      if (zip.readUInt32LE(0) !== 0x04034b50 || zip.readUInt32LE(zip.length - 22) !== 0x06054b50) problems.push("galerie : archive .zip invalide");
      console.log(`galerie badge « ${badge.trim()} », ${periods.length} périodes, export .js ${fs.statSync(js).size} octets, zip ${entries} fichiers`);
    } catch (e) {
      problems.push(`galerie : ${e.message}`);
    }
  }

  await browser.close();
  console.log(`captures : ${path.relative(ROOT, OUT)}/`);
  if (problems.length) {
    console.error(`\n${problems.length} problème(s) :\n- ${problems.join("\n- ")}`);
    process.exit(1);
  }
  console.log("OK : aucune erreur");
})();
