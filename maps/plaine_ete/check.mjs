// Checks of § 11, in Node, no browser:  node maps/plaine_ete/check.mjs
import { readFileSync } from "node:fs";
import { createPainter, hex } from "./painter.js";
import { MAP, OPTIONS, PALETTES, mapBack, mapItems, mapFront, canStand, segmentFree, standReason, layout } from "./map.js";
import { ASSETS } from "./assets.js";

const G = (s) => `\x1b[32m${s}\x1b[0m`, Rd = (s) => `\x1b[31m${s}\x1b[0m`;
let failed = 0;
function check(name, ok, detail = "") {
  if (ok) console.log(G("✔ " + name));
  else { failed++; console.log(Rd("✘ " + name + (detail ? " — " + detail : ""))); }
}

function render(t, o) {
  const P = createPainter(o.W ?? 480, o.H ?? 270);
  mapBack(P.p, t, o);
  for (const it of mapItems(t, o)) it.draw(P.p);
  mapFront(P.p, t, o);
  return P;
}
const same = (a, b) => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
};
const opts = (extra = {}) => ({ D: 4, palette: PALETTES.glace.tones, ...extra });
// a seeded list of times, some negative, some large
const times = (n, D) => Array.from({ length: n }, (_, i) => ((i * 7919) % 1000) / 1000 * D * 3 - D + (i % 5) * 0.137 + i * 11.3);

// --- purity
{
  let ok = true;
  for (const t of [0, 0.37, 2.5, 13.9]) {
    const a = render(t, opts({ snow: 40 })), b = render(t, opts({ snow: 40 }));
    ok &&= same(a.base, b.base) && same(a.light, b.light);
  }
  check("Pureté : deux rendus au même t donnent les mêmes pixels", ok);
}

// --- loop
for (const D of [1, 4, 7.3]) {
  let bad = [];
  for (const t of times(30, D)) {
    const o = opts({ D, snow: 30, fireflies: 60, stars: 200 });
    const a = render(t, o), b = render(t + D, o);
    if (!same(a.base, b.base) || !same(a.light, b.light)) bad.push(t.toFixed(3));
  }
  check(`Boucle : rendu(t) = rendu(t + D) pour 30 valeurs de t, D = ${D} s`, bad.length === 0, "t = " + bad.join(", "));
}

// --- the map does move (so the loop check is not trivial), and "Animation du décor" = 0 freezes it
{
  const o = opts({ snow: 30 });
  check("Animation : le décor change au cours de la boucle", !same(render(0.4, o).base, render(1.7, o).base));
  const f = opts({ anim: 0, snow: 30 });
  check("Animation du décor à 0 : tout est figé", same(render(0.4, f).base, render(1.7, f).base) && same(render(0.4, f).light, render(1.7, f).light));
}

// --- tones
{
  const bad = new Set();
  const cases = [];
  for (const [k, P] of Object.entries(PALETTES))
    for (const fog of [0, 1, 2, 3]) cases.push([k, opts({ palette: P.tones, fog, snow: 40, glow: 2, stars: 200 })]);
  cases.push(["glace 320x180", opts({ W: 320, H: 180 })], ["glace 16x16", opts({ W: 16, H: 16 })], ["glace 1920x400", opts({ W: 1920, H: 400 })]);
  cases.push(["glace sol réglé", opts({ horizon: 20, gyBack: 30, gyFront: 100 })], ["glace sol réglé 2", opts({ horizon: 70, gyBack: 60, gyFront: 62 })]);
  for (const [name, o] of cases) {
    const ok = new Set([0, ...o.palette.map(hex)]);
    for (const t of [0.3, 1.9, 3.1]) {
      const P = render(t, o);
      for (let i = 0; i < P.base.length; i++) if (P.drawn[i] && !ok.has(P.base[i])) bad.add(`${name}: #${P.base[i].toString(16).padStart(6, "0")}`);
    }
  }
  check("Teintes : chaque pixel opaque est une des 8 teintes ou le noir du fond (4 palettes, brume 0 à 3, tailles)", bad.size === 0, [...bad].slice(0, 5).join(", "));
}

// --- integer positions
{
  const bad = [];
  for (const it of MAP.items) if (!Number.isInteger(it.x) || !Number.isInteger(it.gy)) bad.push(it.id);
  if (!Number.isInteger(MAP.home.x) || !Number.isInteger(MAP.home.gy)) bad.push("home");
  for (const [x, gy] of MAP.walk) if (!Number.isInteger(x) || !Number.isInteger(gy)) bad.push("walk");
  for (const t of times(10, 4))
    for (const it of mapItems(t, opts({ camX: 7.6 }))) if (!Number.isInteger(it.x) || !Number.isInteger(it.gy)) bad.push(it.id + "@" + t);
  check("Pixels entiers : positions des items, de home et du sol jouable", bad.length === 0, bad.slice(0, 5).join(", "));
}

// --- ground
{
  const o = opts();
  check("Le sol : home est sur le sol jouable et hors de tout obstacle", canStand(MAP.home.x, MAP.home.gy, o), standReason(MAP.home.x, MAP.home.gy, o) ?? "");
  const L = layout(o);
  const insideOb = L.obstacles.find((ob) => ((L.home.x - ob.x) / ob.rx) ** 2 + ((L.home.gy - ob.gy) / ob.ry) ** 2 < 1);
  check("Le sol : aucun obstacle ne touche home", !insideOb);
  check("Obstacles : la mare, le grand chêne et le sol arrêtent le blob",
    !canStand(MAP.floor.pond.x + 10, MAP.floor.pond.gy, o) && !canStand(386, 168, o) && !canStand(240, 100, o) &&
    !segmentFree(240, 205, 0, 180, o) && segmentFree(240, 205, 240, 240, o));
  check("Obstacles : les raisons sont en français",
    standReason(386, 168, o) === "Grand chêne est sur le passage." && standReason(20, 180, o) === "C’est dans la mare.");
  const small = opts({ W: 320, H: 180 });
  const Ls = layout(small);
  check("Autre taille de scène : home reste sur le sol jouable (320 × 180)", canStand(Ls.home.x, Ls.home.gy, small));
}

// --- sorting
{
  const o = opts();
  let ok = true;
  for (const t of [0.2, 1.4, 3.3]) {
    const a = mapItems(t, o), b = mapItems(t, o);
    ok &&= a.map((i) => i.id).join() === b.map((i) => i.id).join();
    for (let i = 1; i < a.length; i++) {
      const p = a[i - 1], q = a[i];
      if (p.gy > q.gy || (p.gy === q.gy && p.x > q.x) || (p.gy === q.gy && p.x === q.x && p.id >= q.id)) ok = false;
    }
  }
  check("Tri : items triés par gy, puis x, puis id, de façon déterministe", ok);
}

// --- assets
{
  const bad = [];
  let bytes = 0;
  for (const a of Object.values(ASSETS)) {
    for (const f of a.frames) {
      if (f.length !== a.h || f.some((r) => r.length !== a.w || /[^0-7.]/.test(r))) bad.push(a.id);
      bytes += f.join("").length;
    }
    if (a.anchor[0] < 0 || a.anchor[0] >= a.w || a.anchor[1] < 0 || a.anchor[1] >= a.h) bad.push(a.id + " anchor");
    if (!["far", "back", "play", "front"].includes(a.layer)) bad.push(a.id + " layer");
  }
  for (const it of MAP.items) if (!ASSETS[it.asset]) bad.push("item " + it.id);
  const ids = MAP.items.map((i) => i.id);
  if (new Set(ids).size !== ids.length) bad.push("ids en double");
  check(`Assets : lignes "0"–"7" et ".", ancres valides (${Object.keys(ASSETS).length} assets, ${(bytes / 1024).toFixed(0)} Ko de pixels)`, bad.length === 0, bad.join(", "));
}

// --- no randomness or clock while drawing
{
  const src = readFileSync(new URL("./map.js", import.meta.url), "utf8").replace(/\/\/.*$/gm, "");
  check("Aucun hasard ni horloge dans map.js (Math.random, Date.now, performance.now)", !/Math\.random|Date\.now|performance\.now|new Date/.test(src));
  const keys = Object.keys(OPTIONS);
  check("Réglages : libellés français et valeurs par défaut dans leurs bornes",
    keys.every((k) => OPTIONS[k].label && OPTIONS[k].def >= OPTIONS[k].min && OPTIONS[k].def <= OPTIONS[k].max));
}

console.log(failed ? Rd(`\n${failed} vérification(s) en échec`) : G("\nTout est vert."));
process.exit(failed ? 1 : 0);
