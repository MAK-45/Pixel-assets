// A stand-in for Couveuse's creature, for the preview and the shots only: a floating ellipse of
// light (about 48 px wide, ~15 px above the ground), with eyes and a shadow on the ground.
// Also renderScene(): the per-frame order Couveuse will use.
import { mapBack, mapItems, mapFront, fogAt } from "./map.js";

const TAU = Math.PI * 2;

export function blobItem(blob, t, o) {
  const D = o.D ?? 4;
  const u = ((((t / D) % 1) + 1) % 1);
  const pal = o.palette;
  const n = fogAt(blob.gy, o);
  const tn = (i) => pal[Math.max(0, Math.min(7, i - n))];
  const rx = 24, ry = 19;
  const bob = Math.round(Math.sin(TAU * u) * 2);
  const x = Math.round(blob.x - (o.camX ?? 0)), gy = Math.round(blob.gy);
  return {
    id: "~blob", x, gy, layer: "play",
    draw(p) {
      // shadow on the ground (stays at gy)
      for (let y = -3; y <= 3; y++) {
        const w = Math.round(18 * Math.sqrt(1 - (y * y) / 10));
        for (let xx = -w; xx <= w; xx++) p.dot(x + xx, gy + y, "#000000", 0.7);
      }
      const cy = gy - 15 - ry + bob;
      p.glow(x, cy, 40, tn(4), 0.22);
      for (let y = -ry; y <= ry; y++)
        for (let xx = -rx; xx <= rx; xx++) {
          const d = (xx * xx) / (rx * rx) + (y * y) / (ry * ry);
          if (d > 1) continue;
          const l = -(xx / rx + y / ry) * 0.5 + (1 - d) * 0.6; // lit from the top left
          let c = l > 0.75 ? 6 : l > 0.4 ? 5 : l > 0.05 ? 4 : 3;
          if (d > 0.86) c = xx + y < 0 ? 7 : 3; // 1 px rim, lit on the top left
          p.px(x + xx, cy + y, tn(c));
        }
      // eyes (blink once per loop)
      const blink = u > 0.9 && u < 0.94;
      for (const ex of [-8, 8])
        for (let y = -5; y <= 5; y++)
          for (let xx = -2; xx <= 2; xx++) {
            if (blink ? Math.abs(y) > 0 : (xx * xx) / 6.5 + (y * y) / 30 > 1) continue;
            p.px(x + ex + xx, cy - 2 + y, tn(0));
          }
    },
  };
}

/** Back -> items sorted with the creature by (gy, x, id) -> front. */
export function renderScene(p, t, o, blob) {
  mapBack(p, t, o);
  const items = mapItems(t, o);
  if (blob) items.push(blobItem(blob, t, o));
  items.sort((a, b) => a.gy - b.gy || a.x - b.x || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  for (const it of items) it.draw(p);
  mapFront(p, t, o);
}
