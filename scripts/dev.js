#!/usr/bin/env node
// Serveur de développement : construit la bibliothèque, sert la racine du dépôt et ouvre la galerie
// sur http://localhost:8080/web/. Reconstruit et recharge la page à chaque modification de
// assets/, web/ ou scripts/templates/.
//
// Usage : node scripts/dev.js [--port 8080]
import { createReadStream, existsSync, statSync, watch } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, sep } from "node:path";
import { spawn } from "node:child_process";
import { ROOT } from "./lib/library.js";

const portArg = process.argv.indexOf("--port");
const PORT = portArg > 0 ? Number(process.argv[portArg + 1]) : 8080;
const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".png": "image/png", ".gif": "image/gif", ".md": "text/markdown; charset=utf-8",
  ".ts": "text/plain; charset=utf-8", ".txt": "text/plain; charset=utf-8", ".svg": "image/svg+xml",
};

const clients = new Set();
let building = false, again = false;

// La construction tourne dans un processus séparé : les modules pxl sont rechargés à neuf à chaque fois.
function build() {
  if (building) { again = true; return; }
  building = true;
  const t = Date.now();
  const p = spawn(process.execPath, [join(ROOT, "scripts/build.js"), "--quiet"], { stdio: ["ignore", "inherit", "inherit"] });
  p.on("exit", (code) => {
    building = false;
    if (code === 0) {
      console.log(`[dev] bibliothèque reconstruite (${Date.now() - t} ms)`);
      for (const res of clients) res.write("data: reload\n\n");
    } else console.log("[dev] erreurs ci-dessus : la galerie garde la version précédente");
    if (again) { again = false; build(); }
  });
}

let timer;
for (const dir of ["assets", "web", "scripts/templates"]) {
  watch(join(ROOT, dir), { recursive: true }, (_ev, file) => {
    if (!file || file.includes(`out${sep}`) || file.startsWith("out")) return;
    clearTimeout(timer);
    timer = setTimeout(build, 150);
  });
}

createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (url.pathname === "/__reload") {
    res.writeHead(200, { "content-type": "text/event-stream", "cache-control": "no-cache", connection: "keep-alive" });
    res.write(": ok\n\n");
    clients.add(res);
    req.on("close", () => clients.delete(res));
    return;
  }
  if (url.pathname === "/") { res.writeHead(302, { location: "/web/" }); res.end(); return; }
  let path = normalize(join(ROOT, decodeURIComponent(url.pathname)));
  if (!path.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
  if (existsSync(path) && statSync(path).isDirectory()) path = join(path, "index.html");
  if (!existsSync(path)) { res.writeHead(404, { "content-type": "text/plain; charset=utf-8" }); res.end("introuvable"); return; }
  res.writeHead(200, { "content-type": TYPES[extname(path)] ?? "application/octet-stream", "cache-control": "no-store" });
  createReadStream(path).pipe(res);
}).listen(PORT, () => {
  console.log(`[dev] galerie : http://localhost:${PORT}/web/   (Ctrl+C pour arrêter)`);
  build();
});
