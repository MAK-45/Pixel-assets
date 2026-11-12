// A small test painter with the pixelfx painter interface used by map.js (§ 9 of the spec).
// It draws into a Uint32Array (opaque base colors, 0 = black background) plus an additive light
// layer, so the whole map can be rendered and checked in Node without a browser.
// Works in the browser too (preview.html).

const BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

const hexCache = new Map();
/** "#rrggbb" -> 0xRRGGBB */
export function hex(c) {
  let v = hexCache.get(c);
  if (v === undefined) {
    v = parseInt(c.slice(1, 7), 16);
    hexCache.set(c, v);
  }
  return v;
}

export function createPainter(W, H) {
  const base = new Uint32Array(W * H); // 0xRRGGBB; the background is black (0)
  const drawn = new Uint8Array(W * H); // 1 where something opaque was drawn
  const light = new Float32Array(W * H * 3); // additive light, 0..1 per channel

  const inside = (x, y) => x >= 0 && y >= 0 && x < W && y < H;
  const dither = (x, y, a) => a >= 1 || a > (BAYER4[(x & 3) + ((y & 3) << 2)] + 0.5) / 16;

  const p = {
    W, H,
    px(x, y, c) {
      x |= 0; y |= 0;
      if (!inside(x, y)) return;
      const i = y * W + x;
      base[i] = hex(c);
      drawn[i] = 1;
    },
    dot(x, y, c, a = 1) {
      x |= 0; y |= 0;
      if (a <= 0 || !inside(x, y) || !dither(x, y, a)) return;
      const i = y * W + x;
      base[i] = hex(c);
      drawn[i] = 1;
    },
    light(x, y, c, k = 1) {
      x |= 0; y |= 0;
      if (k <= 0 || !inside(x, y)) return;
      const v = hex(c), i = (y * W + x) * 3;
      light[i] += ((v >> 16) & 255) / 255 * k;
      light[i + 1] += ((v >> 8) & 255) / 255 * k;
      light[i + 2] += (v & 255) / 255 * k;
    },
    glow(x, y, r, c, k = 1) {
      x |= 0; y |= 0;
      if (k <= 0 || r <= 0) return;
      const R = Math.ceil(r);
      for (let dy = -R; dy <= R; dy++)
        for (let dx = -R; dx <= R; dx++) {
          const d = Math.sqrt(dx * dx + dy * dy) / r;
          if (d >= 1) continue;
          const f = (1 - d) * (1 - d);
          p.light(x + dx, y + dy, c, k * f);
        }
    },
    line(x0, y0, x1, y1, c, a = 1) {
      x0 |= 0; y0 |= 0; x1 |= 0; y1 |= 0;
      const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0);
      const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
      let err = dx + dy;
      for (;;) {
        p.dot(x0, y0, c, a);
        if (x0 === x1 && y0 === y1) break;
        const e2 = 2 * err;
        if (e2 >= dy) { err += dy; x0 += sx; }
        if (e2 <= dx) { err += dx; y0 += sy; }
      }
    },
    sprite(rows, pal, x, y, opts = {}) {
      x |= 0; y |= 0;
      const flip = !!opts.flip, a = opts.a ?? 1;
      for (let r = 0; r < rows.length; r++) {
        const row = rows[r], w = row.length, yy = y + r;
        if (yy < 0 || yy >= H) continue;
        for (let s = 0; s < w; s++) {
          const ch = row[s];
          if (ch === ".") continue;
          const c = pal[ch];
          if (!c) continue;
          const xx = x + (flip ? w - 1 - s : s);
          if (a >= 1) p.px(xx, yy, c);
          else p.dot(xx, yy, c, a);
        }
      }
    },
  };

  /** Final image: base + additive light, as RGBA bytes. */
  function compose(withLight = true) {
    const out = new Uint8Array(W * H * 4);
    for (let i = 0; i < W * H; i++) {
      const v = base[i];
      let r = ((v >> 16) & 255) / 255, g = ((v >> 8) & 255) / 255, b = (v & 255) / 255;
      if (withLight) {
        r += light[i * 3]; g += light[i * 3 + 1]; b += light[i * 3 + 2];
      }
      out[i * 4] = Math.min(255, Math.round(r * 255));
      out[i * 4 + 1] = Math.min(255, Math.round(g * 255));
      out[i * 4 + 2] = Math.min(255, Math.round(b * 255));
      out[i * 4 + 3] = 255;
    }
    return out;
  }

  function clear() {
    base.fill(0);
    drawn.fill(0);
    light.fill(0);
  }

  return { p, base, drawn, light, compose, clear };
}
