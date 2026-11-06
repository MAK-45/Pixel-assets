// Helpers pour utiliser les variantes pixel-assets — navigateur ou Node, aucune dépendance.
// Copié dans library/runtime.js par scripts/build.js (source : scripts/templates/runtime.js).
//
// Une variante (voir index.d.ts) contient :
//   src     data URL PNG (1re image)       -> <img src>, Phaser textures.addBase64, Pixi...
//   rows    lignes de clés de palette        "." = transparent
//   palette { clé: "#rrggbb" | "#rrggbbaa" }
//   frames  [{ ms, rows }] pour les animations (strip = bande horizontale en data URL)

/** "#rgb" | "#rrggbb" | "#rrggbbaa" -> [r, g, b, a] */
export function hexToRgba(hex) {
  let h = hex.replace("#", "");
  if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join("");
  const n = parseInt(h.padEnd(8, "f"), 16);
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255];
}

function rowsOf(variant, frame = 0) {
  const rows = variant.frames ? variant.frames[frame % variant.frames.length].rows : variant.rows;
  if (!rows) throw new Error(`pixel-assets: '${variant.id}' n'a pas de rows (trop de couleurs) : utiliser variant.src`);
  return rows;
}

/** Pixels RGBA bruts { w, h, data: Uint8ClampedArray }. `palette` remplace des couleurs : { g: "#ff0000" }. */
export function toPixels(variant, { frame = 0, palette } = {}) {
  const rows = rowsOf(variant, frame);
  const pal = { ...variant.palette, ...palette };
  const rgba = Object.fromEntries(Object.entries(pal).map(([k, v]) => [k, hexToRgba(v)]));
  const { w, h } = variant;
  const data = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const c = rgba[rows[y][x]];
      if (c) data.set(c, (y * w + x) * 4);
    }
  return { w, h, data };
}

/** Dessine la variante sur un contexte 2D canvas, pixel par pixel (net à toute échelle). */
export function draw(ctx, variant, x = 0, y = 0, { scale = 1, frame = 0, palette, flipX = false } = {}) {
  const rows = rowsOf(variant, frame);
  const pal = { ...variant.palette, ...palette };
  const { w, h } = variant;
  for (let j = 0; j < h; j++)
    for (let i = 0; i < w; i++) {
      const k = rows[j][i];
      if (k === ".") continue;
      ctx.fillStyle = pal[k];
      ctx.fillRect(x + (flipX ? w - 1 - i : i) * scale, y + j * scale, scale, scale);
    }
}

/** Canvas (HTMLCanvasElement dans le navigateur, OffscreenCanvas sinon) contenant la variante agrandie. */
export function toCanvas(variant, { scale = 1, frame = 0, palette } = {}) {
  const W = variant.w * scale, H = variant.h * scale;
  const canvas = typeof document !== "undefined"
    ? Object.assign(document.createElement("canvas"), { width: W, height: H })
    : new OffscreenCanvas(W, H);
  draw(canvas.getContext("2d"), variant, 0, 0, { scale, frame, palette });
  return canvas;
}

/** PNG agrandi en data URL (navigateur). */
export function toDataURL(variant, opts = {}) {
  return toCanvas(variant, opts).toDataURL("image/png");
}

/** Charge variant.src dans une Image (navigateur). Fonctionne même sans rows. */
export function loadImage(variant) {
  return new Promise((ok, ko) => {
    const img = new Image();
    img.onload = () => ok(img);
    img.onerror = ko;
    img.src = variant.src;
  });
}

/** Copie de la variante avec des couleurs remplacées : recolor(v, { g: "#c0392b", G: "#7b241c" }). */
export function recolor(variant, palette) {
  return { ...variant, palette: { ...variant.palette, ...palette } };
}

/** Index de l'image d'une animation à l'instant `ms` (boucle). 0 pour une image fixe. */
export function frameAt(variant, ms) {
  if (!variant.frames) return 0;
  let t = ((ms % variant.loopMs) + variant.loopMs) % variant.loopMs;
  for (let i = 0; i < variant.frames.length; i++) {
    t -= variant.frames[i].ms;
    if (t < 0) return i;
  }
  return 0;
}

/** Texte ASCII de la variante (pratique pour qu'un agent « voie » la forme). */
export function toAscii(variant, frame = 0) {
  return rowsOf(variant, frame).join("\n");
}
