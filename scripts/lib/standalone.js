// Galerie autonome : web/index.html avec style.css, app.js et toutes les données inlinées dans un
// seul fichier HTML (ouvrable en file://, publiable tel quel, servi par GitHub Pages depuis docs/).
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./library.js";

const safeJson = (v) => JSON.stringify(v).replace(/</g, "\\u003c");

/**
 * fragment: true -> sans <!doctype>/<html>/<head>/<body> (format attendu par la publication en
 * artefact claude.ai, qui ajoute lui-même le squelette du document).
 */
export function standaloneGallery({ catalog, modules, sources, sceneRuntime }, { fragment = false } = {}) {
  const web = (f) => readFileSync(join(ROOT, "web", f), "utf8");
  let html = web("index.html");
  const css = web("style.css");
  const js = web("app.js");
  const noClose = (code) => code.replace(/<\/script/gi, "<\\/script");
  const data = `<script>window.__PIXEL_LIBRARY__ = ${safeJson({ catalog, modules, sources, sceneRuntime })};</script>`;
  // Moteur des scènes exécuté avant la galerie (les modules s'exécutent dans l'ordre du document).
  const runtime = `<script type="module">\n${noClose(sceneRuntime)}\nwindow.__PIXEL_SCENE_RUNTIME__ = { createSceneFrom, fitCanvas, bundleScene, packScene, sceneUsage, sceneReadme };\n</script>`;
  html = html.replace(/<link rel="stylesheet" href="style.css">/, () => `<style>\n${css}\n</style>`);
  html = html.replace(/<script type="module" src="app.js"><\/script>/, () => `${data}\n${runtime}\n<script type="module">\n${noClose(js)}\n</script>`);
  if (!html.includes("__PIXEL_LIBRARY__") || html.includes('href="style.css"')) throw new Error("standalone: balises style.css/app.js introuvables dans web/index.html");
  if (fragment) {
    html = html.replace(/<!doctype html>\s*/i, "").replace(/<\/?(html|head|body)\b[^>]*>\s*/gi, "")
      .replace(/<meta charset="utf-8">\s*/i, "").replace(/<meta name="viewport"[^>]*>\s*/i, "");
    return html;
  }
  return `<!-- GÉNÉRÉ par scripts/build.js depuis web/ — ne pas modifier. -->\n` + html;
}
