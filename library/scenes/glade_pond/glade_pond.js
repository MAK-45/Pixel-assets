// glade_pond.js — GÉNÉRÉ par pixel-assets (scripts/build.js), ne pas modifier.
// Scène « Clairière de la mare » (scenes/glade_pond) — statique : un écran fixe.
// Base 320×180 px, ligne de sol y = 140, périodes : day (Jour), dusk (Crépuscule), night (Nuit), overcast (Sombre).
// Plans : backdrop ×0, ground ×0, front (devant) ×0.
//
//   import { createScene, fitCanvas } from "./glade_pond.js";
//   const view = fitCanvas(canvas);                 // facteur entier + vue élargie : { scale, w, h, ctx }
//   const scene = await createScene({ period: "day", width: view.w, height: view.h });
//   function loop(dt) {                             // dt en ms
//     scene.update(dt, cameraX);                    // cameraX : position de la caméra (pixels de base)
//     scene.drawBack(view.ctx);                     // plans derrière le personnage
//     drawPlayer(view.ctx, playerX, scene.groundY); // ton personnage, pieds sur la ligne de sol
//     scene.drawFront(view.ctx);                    // premier plan, devant le personnage
//   }
//   scene.setPeriod("night", { fade: 2000 });       // changement de période en fondu
//
// Options de createScene : period, width, height, effects (false = sans événements aléatoires),
// foreground (false = sans premier plan), frequency (1 = normal), random (générateur 0..1).
// Autres méthodes : draw, setPlaneVisible(id, bool), setFrequency(n), resize(w, h).
// Affichage net : ctx.imageSmoothingEnabled = false et un agrandissement entier (fitCanvas le fait).

// Moteur de scènes pixel-assets : parallaxe infinie, périodes de la journée, effets d'ambiance.
// ES module sans dépendance, pour navigateur (canvas 2D). Source : scripts/templates/scene-runtime.js,
// copié dans library/scene-runtime.js et inclus tel quel dans chaque scène exportée.
//
//   const scene = await createSceneFrom(data, { period: "day", width: 320, height: 180 });
//   // boucle de jeu, en pixels de base (le contexte est agrandi d'un facteur entier, voir fitCanvas)
//   scene.update(dtMs, cameraX);   // cameraX : position horizontale de la caméra dans le monde
//   scene.drawBack(ctx);           // plans derrière le personnage
//   drawPlayer(ctx);               // pieds sur scene.groundY
//   scene.drawFront(ctx);          // plans devant le personnage
//   scene.setPeriod("night", { fade: 2000 });

export const SCENE_FORMAT = 1;

const mod = (a, n) => ((a % n) + n) % n;
const between = (r, v) => (Array.isArray(v) ? v[0] + r() * (v[1] - v[0]) : v);
const pick = (r, list) => list[Math.floor(r() * list.length) % list.length];

function makeCanvas(w, h) {
  if (typeof document !== "undefined") return Object.assign(document.createElement("canvas"), { width: w, height: h });
  return new OffscreenCanvas(w, h);
}

function loadImage(src) {
  return new Promise((ok, ko) => {
    const img = new Image();
    img.onload = () => ok(img);
    img.onerror = () => ko(new Error("pixel-scene : image illisible"));
    img.src = src;
  });
}

/** Image de la scène : { el, w, h, ms?, loop } ; une animation est une bande horizontale. */
async function prepare(img) {
  const el = await loadImage(img.src);
  const ms = img.ms && img.ms.length > 1 ? img.ms : null;
  return { el, w: img.w, h: img.h, ms, loop: ms ? ms.reduce((a, b) => a + b, 0) : 0, fill: img.fill };
}

function frameAt(img, t) {
  if (!img.ms) return 0;
  let x = mod(t, img.loop);
  for (let i = 0; i < img.ms.length; i++) {
    x -= img.ms[i];
    if (x < 0) return i;
  }
  return 0;
}

function blit(ctx, img, frame, x, y, flip = false) {
  x = Math.round(x);
  y = Math.round(y);
  if (!flip) {
    ctx.drawImage(img.el, frame * img.w, 0, img.w, img.h, x, y, img.w, img.h);
    return;
  }
  ctx.save();
  ctx.translate(x + img.w, y);
  ctx.scale(-1, 1);
  ctx.drawImage(img.el, frame * img.w, 0, img.w, img.h, 0, 0, img.w, img.h);
  ctx.restore();
}

/** Position à l'écran d'un point d'une bande bouclée de largeur W décalée de `off`. */
function wrapX(px, off, W, width, margin) {
  let x = mod(px - off, W);
  if (x > width + margin) x -= W;
  return x;
}

/** Position à l'écran d'un point d'un plan : bande bouclée, ou plan fixe centré dans la vue. */
function planeX(plane, px, off, width, margin) {
  return plane.loop ? wrapX(px, off, plane.W, width, margin) : px + Math.round((width - plane.W) / 2);
}

// ================================================================ effets d'ambiance

// Chaque effet : { update(dt, dCam, camX), draw(ctx, view, front) } ; `after` = id du plan après
// lequel il se dessine. Les positions sont en pixels de base ; view = { width, height, dy }.
const EFFECTS = {
  // Étoiles qui scintillent à des places fixes du ciel, puis changent de place.
  twinkle(cfg, S) {
    const r = S.random, img = S.sprite(cfg.sprite), [ax, ay, aw, ah] = cfg.area;
    const spot = () => ({ x: ax + r() * aw, y: ay + r() * ah, t: -r() * img.loop * 2 });
    const stars = Array.from({ length: cfg.count ?? 12 }, spot);
    return {
      update(dt) {
        for (const s of stars) {
          s.t += dt;
          if (s.t > img.loop) Object.assign(s, spot(), { t: -r() * img.loop });
        }
      },
      draw(ctx, v) {
        const k = v.width / S.w;
        for (const s of stars) if (s.t >= 0) blit(ctx, img, frameAt(img, s.t), s.x * k - img.w / 2, s.y + v.dy - img.h / 2);
      },
    };
  },

  // Étoile filante de temps en temps : la tête part d'une zone du ciel et file en diagonale.
  shooting(cfg, S) {
    const r = S.random, img = S.sprite(cfg.sprite), [ax, ay, aw, ah] = cfg.area;
    const [hx, hy] = cfg.head ?? [1, img.h - 1];
    const live = [];
    let wait = between(r, cfg.every) * r();
    return {
      update(dt) {
        wait -= dt * S.frequency;
        if (wait <= 0) {
          wait = between(r, cfg.every);
          const dir = r() < 0.5 ? -1 : 1;
          live.push({ x: ax + r() * aw, y: ay + r() * ah, dir, t: 0, speed: between(r, cfg.speed ?? 160) });
        }
        for (let i = live.length - 1; i >= 0; i--) {
          const s = live[i];
          s.t += dt;
          s.x += s.dir * s.speed * dt / 1000;
          s.y += s.speed * 0.5 * dt / 1000;
          if (s.t >= img.loop) live.splice(i, 1);
        }
      },
      draw(ctx, v) {
        const k = v.width / S.w;
        for (const s of live) {
          // le sprite file vers la gauche ; vers la droite, on le retourne (tête à droite)
          const x = s.x * k - (s.dir < 0 ? hx : img.w - 1 - hx);
          blit(ctx, img, frameAt(img, s.t), x, s.y + v.dy - hy, s.dir > 0);
        }
      },
    };
  },

  // Petits vols d'oiseaux qui traversent le ciel (avec un peu de parallaxe).
  birds(cfg, S) {
    const r = S.random, img = S.sprite(cfg.sprite), factor = cfg.factor ?? 0.1;
    const flocks = [];
    let wait = between(r, cfg.every) * (0.15 + 0.5 * r());
    return {
      update(dt, dCam) {
        wait -= dt * S.frequency;
        if (wait <= 0) {
          wait = between(r, cfg.every);
          const dir = r() < 0.5 ? -1 : 1, n = Math.round(between(r, cfg.count ?? [2, 4]));
          const y = between(r, cfg.y ?? [20, 60]), speed = between(r, cfg.speed ?? [16, 24]);
          const birds = Array.from({ length: n }, (_, i) => ({
            dx: -dir * (i * 7 + r() * 4), dy: (i % 2 ? 1 : -1) * Math.ceil(i / 2) * 3 + r() * 2, t: r() * img.loop, bob: r() * 6,
          }));
          flocks.push({ x: dir > 0 ? -12 : S.view.width + 12, y, dir, speed, birds });
        }
        for (let i = flocks.length - 1; i >= 0; i--) {
          const f = flocks[i];
          f.x += f.dir * f.speed * dt / 1000 - dCam * factor;
          for (const b of f.birds) b.t += dt;
          const out = f.dir > 0 ? f.x - 60 > S.view.width : f.x + 60 < 0;
          if (out || Math.abs(f.x) > S.view.width * 4) flocks.splice(i, 1);
        }
      },
      draw(ctx, v) {
        for (const f of flocks)
          for (const b of f.birds)
            blit(ctx, img, frameAt(img, b.t), f.x + b.dx, f.y + b.dy + Math.sin((b.t / 700) + b.bob) * 1.5 + v.dy, f.dir < 0);
      },
    };
  },

  // Papillons qui voltigent autour de points d'ancrage d'un plan (ils défilent avec lui).
  butterflies(cfg, S) {
    const r = S.random, plane = S.plane(cfg.plane), W = plane.W, factor = plane.factor;
    const imgs = cfg.sprites.map((n) => S.sprite(n));
    const flies = Array.from({ length: cfg.count ?? 4 }, () => {
      const [x, y] = pick(r, cfg.anchors);
      return { x, y, img: pick(r, imgs), t: r() * 10000, a: 0.6 + r() * 0.5, b: 1.1 + r() * 0.7, p: r() * 6, rx: 6 + r() * 8, ry: 3 + r() * 4 };
    });
    return {
      update(dt) { for (const f of flies) f.t += dt; },
      draw(ctx, v) {
        const off = Math.round(S.camX * factor);
        for (const f of flies) {
          const s = f.t / 1000;
          const px = f.x + Math.sin(s * f.a + f.p) * f.rx + Math.sin(s * 2.3 + f.p) * 2;
          const py = f.y + Math.sin(s * f.b + f.p * 2) * f.ry - Math.abs(Math.sin(s * 3 + f.p)) * 2;
          const x = planeX(plane, px, off, v.width, f.img.w);
          blit(ctx, f.img, frameAt(f.img, f.t), x - f.img.w / 2, plane.y + py + v.dy - f.img.h / 2, Math.cos(s * f.a + f.p) < 0);
        }
      },
    };
  },

  // Lucioles qui flottent et clignotent au-dessus de l'herbe ; une partie passe devant le perso.
  fireflies(cfg, S) {
    const r = S.random, plane = S.plane(cfg.plane), W = plane.W, factor = plane.factor;
    const imgs = (cfg.sprites ?? [cfg.sprite]).map((n) => S.sprite(n));
    const [ax, ay, aw, ah] = cfg.area ?? [0, 0, W, 20];
    const flies = Array.from({ length: cfg.count ?? 14 }, (_, i) => {
      const img = pick(r, imgs);
      return { x: ax + r() * aw, y: ay + r() * ah, img, t: r() * img.loop * 3, p: r() * 6, sp: 0.3 + r() * 0.4, front: i < (cfg.count ?? 14) * (cfg.front ?? 0) };
    });
    return {
      update(dt) { for (const f of flies) f.t += dt; },
      draw(ctx, v, front = false) {
        const off = Math.round(S.camX * factor);
        for (const f of flies) {
          if (f.front !== front) continue;
          const s = f.t / 1000 * f.sp;
          const px = f.x + Math.sin(s + f.p) * 10 + Math.sin(s * 2.7 + f.p) * 3;
          const py = f.y + Math.sin(s * 1.3 + f.p * 2) * 4;
          const x = planeX(plane, px, off, v.width, f.img.w);
          blit(ctx, f.img, frameAt(f.img, f.t), x - f.img.w / 2, plane.y + py + v.dy - f.img.h / 2);
        }
      },
      hasFront: (cfg.front ?? 0) > 0,
    };
  },
};

EFFECTS.shadows = shadows;
EFFECTS.motes = motes;

// Ombres de nuages qui glissent sur le sol (vue de dessus) : sprites sombres dessinés en transparence.
function shadows(cfg, S) {
  const r = S.random, imgs = (cfg.sprites ?? [cfg.sprite]).map((n) => S.sprite(n));
  const alpha = cfg.alpha ?? 0.18, dir = cfg.dir ?? 1, slope = cfg.slope ?? 0.3;
  const live = [];
  const spawn = (x) => {
    const img = pick(r, imgs);
    const y = between(r, cfg.y ?? [-40, S.h]);
    live.push({ img, x: x ?? (dir > 0 ? -img.w : S.view.width), y, speed: between(r, cfg.speed ?? [5, 9]) });
  };
  // quelques ombres déjà présentes au départ
  for (let i = 0; i < (cfg.count ?? 2); i++) spawn(r() * S.view.width - 40);
  let wait = between(r, cfg.every ?? [9000, 18000]) * r();
  return {
    update(dt) {
      wait -= dt * S.frequency;
      if (wait <= 0) { wait = between(r, cfg.every ?? [9000, 18000]); spawn(); }
      for (let i = live.length - 1; i >= 0; i--) {
        const s = live[i];
        s.x += (dir * s.speed * dt) / 1000;
        s.y += (slope * s.speed * dt) / 1000;
        if (s.x > S.view.width + 20 || s.x < -s.img.w - 20 || s.y > S.view.height + 20) live.splice(i, 1);
      }
    },
    draw(ctx, v) {
      const a = ctx.globalAlpha;
      ctx.globalAlpha = a * alpha;
      for (const s of live) blit(ctx, s.img, frameAt(s.img, 0), s.x, s.y + v.dy);
      ctx.globalAlpha = a;
    },
  };
}

// Petites particules qui flottent et dérivent au vent (pollen, aigrettes, poussière dorée du soir).
// area = zone d'apparition à l'écran [x, y, w, h] ; elles traversent la vue et reviennent de l'autre côté.
function motes(cfg, S) {
  const r = S.random, imgs = (cfg.sprites ?? [cfg.sprite]).map((n) => S.sprite(n));
  const [ax, ay, aw, ah] = cfg.area ?? [0, 0, S.w, S.h];
  const wind = cfg.wind ?? [3, 7];
  const list = Array.from({ length: cfg.count ?? 12 }, () => ({
    x: ax + r() * aw, y: ay + r() * ah, img: pick(r, imgs), vx: between(r, wind), vy: between(r, cfg.fall ?? [-1, 1]),
    p: r() * 6, a: 0.4 + r() * 0.6, t: r() * 10000,
  }));
  return {
    update(dt) {
      for (const m of list) {
        m.t += dt;
        m.x += (m.vx * dt) / 1000;
        m.y += (m.vy * dt) / 1000;
        if (m.x > ax + aw + 6) m.x = ax - 6;
        if (m.x < ax - 6) m.x = ax + aw + 6;
        if (m.y > ay + ah + 6) m.y = ay - 6;
        if (m.y < ay - 6) m.y = ay + ah + 6;
      }
    },
    draw(ctx, v) {
      const cx = Math.round((v.width - S.w) / 2);
      for (const m of list) {
        const s = m.t / 1000;
        const x = cx + m.x + Math.sin(s * m.a + m.p) * 4;
        const y = m.y + Math.sin(s * m.a * 1.7 + m.p * 2) * 3;
        blit(ctx, m.img, frameAt(m.img, m.t), x - m.img.w / 2, y + v.dy - m.img.h / 2);
      }
    },
  };
}

// ================================================================ scène

/**
 * Crée une scène à partir de ses données (module de la bibliothèque ou export autonome).
 * opts : { period, width, height, effects = true, foreground = true, frequency = 1, random = Math.random }
 * width/height : taille de la vue en pixels de base (≥ taille de base de la scène : la vue s'élargit,
 * le ciel s'étend vers le haut).
 */
export async function createSceneFrom(data, opts = {}) {
  if (!data || data.format !== SCENE_FORMAT) throw new Error("pixel-scene : données de scène absentes ou d'un autre format");
  const random = opts.random ?? Math.random;
  const periodIds = data.periods.map((p) => p.id);

  // Images : une fois chacune.
  const cache = new Map();
  const load = (img) => {
    if (!img) return null;
    if (!cache.has(img.src)) cache.set(img.src, prepare(img));
    return cache.get(img.src);
  };
  const planes = await Promise.all(data.planes.map(async (p) => {
    const images = {}, body = {};
    for (const id of periodIds) {
      if (p.images[id]) images[id] = await load(p.images[id]);
      if (p.body?.images[id]) body[id] = await load(p.body.images[id]);
    }
    const W = Math.max(1, ...Object.values(images).map((i) => i.w));
    return { ...p, images, bodyImages: body, W, loop: p.loop ?? data.type === "parallax", visible: !(p.optional && opts.foreground === false) };
  }));
  const sprites = {};
  for (const [name, per] of Object.entries(data.sprites ?? {})) {
    sprites[name] = {};
    for (const [k, img] of Object.entries(per)) sprites[name][k] = await load(img);
  }

  let width = Math.max(1, Math.round(opts.width ?? data.w)), height = Math.max(1, Math.round(opts.height ?? data.h));
  let camX = 0, time = 0, dirty = true;
  let frequency = opts.frequency ?? 1;
  const effectsOn = opts.effects !== false;

  // État d'une période : ses effets et ses deux tampons (derrière / devant le personnage).
  const makeState = (id) => {
    const st = { id, back: makeCanvas(width, height), front: makeCanvas(width, height), effects: [] };
    if (!effectsOn) return st;
    const S = {
      w: data.w, h: data.h, random,
      get camX() { return camX; },
      get frequency() { return frequency; },
      get view() { return { width, height, dy: height - data.h }; },
      sprite: (name) => {
        const s = sprites[name];
        if (!s) throw new Error(`pixel-scene : sprite d'effet inconnu '${name}'`);
        return s[id] ?? s["*"] ?? Object.values(s)[0];
      },
      plane: (pid) => {
        const p = planes.find((q) => q.id === pid);
        if (!p) throw new Error(`pixel-scene : plan inconnu '${pid}'`);
        return p;
      },
    };
    for (const cfg of data.effects?.[id] ?? []) {
      const make = EFFECTS[cfg.type];
      if (make) st.effects.push(Object.assign(make(cfg, S), { after: cfg.after, type: cfg.type }));
    }
    return st;
  };

  let cur = makeState(periodIds.includes(opts.period) ? opts.period : data.defaultPeriod ?? periodIds[0]);
  let prev = null, fade = null;

  const speedOf = (id) => data.speed?.[id] ?? 1;

  function drawPlane(ctx, p, st, v) {
    const img = p.images[st.id];
    if (!img) return;
    if (p.kind === "sky") {
      // dégradé (bandes tramées) répété sur toute la largeur ; une vue plus haute prolonge le haut du ciel
      if (v.dy > 0 && img.fill) { ctx.fillStyle = img.fill; ctx.fillRect(0, 0, v.width, v.dy + p.y + 1); }
      for (let x = 0; x < v.width; x += img.w) ctx.drawImage(img.el, x, p.y + v.dy);
      const b = p.bodyImages[st.id];
      if (b) blit(ctx, b, 0, Math.round(v.width / 2 + p.body.x - data.w / 2), p.body.y + v.dy);
      return;
    }
    const y = p.y + v.dy;
    if (!p.loop) {
      // plan fixe (scène statique) : centré dans la vue, acteurs posés à leur place
      const x0 = Math.round((v.width - img.w) / 2);
      blit(ctx, img, frameAt(img, time), x0, y);
      drawActors(ctx, p, st, y, (a) => x0 + a.x);
      return;
    }
    const off = Math.round(camX * p.factor + (time / 1000) * (p.driftBy?.[st.id] ?? p.drift ?? 0));
    const x0 = -mod(off, img.w);
    for (let x = x0; x < v.width; x += img.w) blit(ctx, img, frameAt(img, time), x, y);
    // acteurs animés (herbe au vent…) posés sur la bande, désynchronisés
    drawActors(ctx, p, st, y, (a, ai) => wrapX(a.x, off, img.w, v.width, ai.w), v.width);
  }

  function drawActors(ctx, p, st, y, xOf, width = Infinity) {
    if (!p.actors) return;
    const t = time * speedOf(st.id);
    for (const a of p.actors) {
      const s = sprites[a.sprite];
      const ai = s && (s[st.id] ?? s["*"]);
      if (!ai) continue;
      const ax = xOf(a, ai);
      if (ax > -ai.w && ax < width) blit(ctx, ai, frameAt(ai, t + (a.phase ?? 0)), ax, y + a.y, !!a.flip);
    }
  }

  function render(st) {
    const v = { width, height, dy: height - data.h };
    const bctx = st.back.getContext("2d"), fctx = st.front.getContext("2d");
    bctx.imageSmoothingEnabled = false;
    fctx.imageSmoothingEnabled = false;
    bctx.clearRect(0, 0, width, height);
    fctx.clearRect(0, 0, width, height);
    for (const p of planes) {
      const ctx = p.front ? fctx : bctx;
      if (p.visible) drawPlane(ctx, p, st, v);
      for (const fx of st.effects) if (fx.after === p.id) fx.draw(ctx, v, false);
    }
    for (const fx of st.effects) if (fx.hasFront) fx.draw(fctx, v, true);
  }

  function renderAll() {
    if (!dirty) return;
    render(cur);
    if (prev) render(prev);
    dirty = false;
  }

  const scene = {
    data,
    /** Ids des périodes, dans l'ordre. */
    periods: periodIds,
    /** Plans (du fond vers l'avant) : { id, label, factor, front, visible }. */
    get planes() { return planes.map((p) => ({ id: p.id, label: p.label, factor: p.factor, front: !!p.front, visible: p.visible })); },
    get period() { return cur.id; },
    get width() { return width; },
    get height() { return height; },
    /** Ligne de sol (y des pieds du personnage) dans la vue courante. */
    get groundY() { return data.groundY + (height - data.h); },
    get cameraX() { return camX; },
    get time() { return time; },

    /** Avance le temps (ms) et place la caméra (pixels de base). */
    update(dt, cameraX = camX) {
      dt = Math.max(0, Math.min(Number(dt) || 0, 250));
      const dCam = cameraX - camX;
      camX = cameraX;
      time += dt;
      for (const fx of cur.effects) fx.update(dt, dCam, camX);
      if (prev) for (const fx of prev.effects) fx.update(dt, dCam, camX);
      if (fade) {
        fade.t += dt;
        if (fade.t >= fade.ms) { prev = null; fade = null; }
      }
      dirty = true;
      return scene;
    },

    /** Dessine les plans derrière le personnage, en (x, y) dans le repère courant de ctx. */
    drawBack(ctx, x = 0, y = 0) {
      renderAll();
      ctx.imageSmoothingEnabled = false;
      if (prev && fade) {
        ctx.drawImage(prev.back, x, y);
        const a = ctx.globalAlpha;
        ctx.globalAlpha = a * Math.min(1, fade.t / fade.ms);
        ctx.drawImage(cur.back, x, y);
        ctx.globalAlpha = a;
      } else ctx.drawImage(cur.back, x, y);
      return scene;
    },

    /** Dessine les plans devant le personnage (premier plan, lucioles proches). */
    drawFront(ctx, x = 0, y = 0) {
      renderAll();
      ctx.imageSmoothingEnabled = false;
      const a = ctx.globalAlpha;
      if (prev && fade) {
        const t = Math.min(1, fade.t / fade.ms);
        ctx.globalAlpha = a * (1 - t);
        ctx.drawImage(prev.front, x, y);
        ctx.globalAlpha = a * t;
        ctx.drawImage(cur.front, x, y);
        ctx.globalAlpha = a;
      } else ctx.drawImage(cur.front, x, y);
      return scene;
    },

    /** drawBack + drawFront (scène sans personnage). */
    draw(ctx, x = 0, y = 0) { return scene.drawBack(ctx, x, y).drawFront(ctx, x, y); },

    /** Change de période ; fade = durée du fondu en ms (0 = immédiat). */
    setPeriod(id, { fade: ms = 0 } = {}) {
      if (!periodIds.includes(id)) throw new Error(`pixel-scene : période inconnue '${id}' (connues : ${periodIds.join(", ")})`);
      if (id === cur.id && !prev) return scene;
      const next = prev && prev.id === id ? prev : makeState(id);
      prev = ms > 0 ? cur : null;
      fade = ms > 0 ? { t: 0, ms } : null;
      cur = next;
      dirty = true;
      return scene;
    },

    /** Affiche ou masque un plan (par id). */
    setPlaneVisible(id, visible) {
      const p = planes.find((q) => q.id === id);
      if (p) { p.visible = !!visible; dirty = true; }
      return scene;
    },

    /** Fréquence des événements (étoiles filantes, oiseaux) : 1 = normal. */
    setFrequency(f) { frequency = Math.max(0, Number(f) || 0); return scene; },

    /** Nouvelle taille de vue, en pixels de base (voir fitCanvas). */
    resize(w, h) {
      width = Math.max(1, Math.round(w));
      height = Math.max(1, Math.round(h));
      for (const st of [cur, prev]) if (st) {
        st.back = makeCanvas(width, height);
        st.front = makeCanvas(width, height);
      }
      dirty = true;
      return scene;
    },
  };
  return scene;
}

/**
 * Prépare un canvas plein écran au pixel près : facteur entier le plus grand qui fait tenir la
 * taille de base, puis vue élargie pour remplir l'écran sans bandes noires.
 * opts : { width = innerWidth, height = innerHeight (taille CSS), baseWidth = 320, baseHeight = 180,
 *          pixelRatio = devicePixelRatio }.
 * Renvoie { scale, w, h, ctx } : w × h = taille de la vue en pixels de base, ctx déjà agrandi.
 */
export function fitCanvas(canvas, opts = {}) {
  const baseW = opts.baseWidth ?? 320, baseH = opts.baseHeight ?? 180;
  const dpr = opts.pixelRatio ?? (globalThis.devicePixelRatio || 1);
  const cssW = opts.width ?? globalThis.innerWidth ?? baseW, cssH = opts.height ?? globalThis.innerHeight ?? baseH;
  const W = Math.max(1, Math.round(cssW * dpr)), H = Math.max(1, Math.round(cssH * dpr));
  const scale = Math.max(1, Math.floor(Math.min(W / baseW, H / baseH)));
  canvas.width = W;
  canvas.height = H;
  if (canvas.style) {
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;
    canvas.style.imageRendering = "pixelated";
  }
  const ctx = canvas.getContext("2d");
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.imageSmoothingEnabled = false;
  return { scale, w: Math.ceil(W / scale), h: Math.ceil(H / scale), ctx };
}

/** Données de la scène (images PNG en data URL). */
export const SCENE = {"format":1,"id":"scenes/glade_pond","title":"Clairière de la mare","type":"static","w":320,"h":180,"groundY":140,"defaultPeriod":"day","periods":[{"id":"day","label":"Jour"},{"id":"dusk","label":"Crépuscule"},{"id":"night","label":"Nuit"},{"id":"overcast","label":"Sombre"}],"planes":[{"id":"backdrop","label":"Bords (vue élargie)","factor":0,"y":0,"images":{"day":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAC0CAMAAACqoFyrAAAADFBMVEUfSiwuejparkWl11oF7x+LAAAA70lEQVR42u1WURaDIAxL0/vfeQOhtoVN99zHnPKBEEvsawIIXKqJNQhq7xsigB5l09IHDhk4zgTgKAd8xdD44ALhi4wJB/KbIpKr+jL1SxoyTyypA0ffeOCmISFgww4nF/syQDICBimdHUQoSmgdtAhC2AfLk9QS11aSSlJI+2wdck+mNNIV+RMZEAFsbfXv5WEbuWoU1GcqskU4bRMpf6amLVn0nM1jPEzqXTgxbgnKxh0AzU7mfQZlICm1X7nVytToy0Pq34C8++tDPMeQ0Mn5tr55GYHPEmNRusrfLwu6bouD7lqrVGon3cLx3MgPs0AKfyUc4IUAAAAASUVORK5CYII=","w":16,"h":180,"fill":"#1f4a2c"},"dusk":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAC0CAMAAACqoFyrAAAADFBMVEU7K0teOlqPT1/QdF8hqIE2AAAA70lEQVR42u1WURaDIAxL0/vfeQOhtoVN99zHnPKBEEvsawIIXKqJNQhq7xsigB5l09IHDhk4zgTgKAd8xdD44ALhi4wJB/KbIpKr+jL1SxoyTyypA0ffeOCmISFgww4nF/syQDICBimdHUQoSmgdtAhC2AfLk9QS11aSSlJI+2wdck+mNNIV+RMZEAFsbfXv5WEbuWoU1GcqskU4bRMpf6amLVn0nM1jPEzqXTgxbgnKxh0AzU7mfQZlICm1X7nVytToy0Pq34C8++tDPMeQ0Mn5tr55GYHPEmNRusrfLwu6bouD7lqrVGon3cLx3MgPs0AKfyUc4IUAAAAASUVORK5CYII=","w":16,"h":180,"fill":"#3b2b4b"},"night":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAC0CAMAAACqoFyrAAAADFBMVEUUITodMkcqR1I/ZGa+aLRhAAAA70lEQVR42u1WURaDIAxL0/vfeQOhtoVN99zHnPKBEEvsawIIXKqJNQhq7xsigB5l09IHDhk4zgTgKAd8xdD44ALhi4wJB/KbIpKr+jL1SxoyTyypA0ffeOCmISFgww4nF/syQDICBimdHUQoSmgdtAhC2AfLk9QS11aSSlJI+2wdck+mNNIV+RMZEAFsbfXv5WEbuWoU1GcqskU4bRMpf6amLVn0nM1jPEzqXTgxbgnKxh0AzU7mfQZlICm1X7nVytToy0Pq34C8++tDPMeQ0Mn5tr55GYHPEmNRusrfLwu6bouD7lqrVGon3cLx3MgPs0AKfyUc4IUAAAAASUVORK5CYII=","w":16,"h":180,"fill":"#14213a"},"overcast":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAC0CAMAAACqoFyrAAAADFBMVEUbJyMrPDNBVkZic1oBNNCyAAAA70lEQVR42u1WURaDIAxL0/vfeQOhtoVN99zHnPKBEEvsawIIXKqJNQhq7xsigB5l09IHDhk4zgTgKAd8xdD44ALhi4wJB/KbIpKr+jL1SxoyTyypA0ffeOCmISFgww4nF/syQDICBimdHUQoSmgdtAhC2AfLk9QS11aSSlJI+2wdck+mNNIV+RMZEAFsbfXv5WEbuWoU1GcqskU4bRMpf6amLVn0nM1jPEzqXTgxbgnKxh0AzU7mfQZlICm1X7nVytToy0Pq34C8++tDPMeQ0Mn5tr55GYHPEmNRusrfLwu6bouD7lqrVGon3cLx3MgPs0AKfyUc4IUAAAAASUVORK5CYII=","w":16,"h":180,"fill":"#1b2723"}},"kind":"sky"},{"id":"ground","label":"Clairière","factor":0,"y":0,"images":{"day":{"src":"data:image/png;base64,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","w":320,"h":180},"dusk":{"src":"data:image/png;base64,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","w":320,"h":180},"night":{"src":"data:image/png;base64,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","w":320,"h":180},"overcast":{"src":"data:image/png;base64,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","w":320,"h":180}},"actors":[{"sprite":"grass","x":36,"y":128,"phase":0},{"sprite":"grass","x":100,"y":140,"phase":337,"flip":true},{"sprite":"grass","x":212,"y":116,"phase":674},{"sprite":"grass","x":262,"y":150,"phase":211,"flip":true},{"sprite":"grass","x":58,"y":160,"phase":548},{"sprite":"ripple","x":236,"y":84,"phase":0},{"sprite":"ripple_slow","x":262,"y":94,"phase":900},{"sprite":"ripple","x":280,"y":80,"phase":1700},{"sprite":"glint","x":244,"y":92,"phase":0},{"sprite":"glint","x":270,"y":88,"phase":700},{"sprite":"glint","x":256,"y":97,"phase":1300},{"sprite":"fish","x":250,"y":80,"phase":0}]},{"id":"front","label":"Premier plan","factor":0,"y":0,"images":{"day":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAC0CAMAAADSOgUjAAAAG1BMVEUAAAAaFCNarkUuejofSiyl11rgeCqyOixuHyQrV5TJAAAAAXRSTlMAQObYZgAAAfVJREFUeNrt2EFS40AMQFFL3Ylz/xNPSe5AHBgWw2qS96AKcBEWv6S2w7YBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPD/CQl+1y9Dwl8WTAV/DNT0++d+o8z469l3Kqjl136Z+V3BGBHVq/rFihcxFDxvbfW7rIKnRa5W9VEBZ4/guqDgtsXsta0UY8w8RvC8yDFGf9YUxqxqXbQ/9at+VS0qYBccoxte93gY0hlzxugJzMo3Z6UMy3v0u3TBXt4c6yDcb9eH+0UHG3FMYAWsK4bvUHs7x9j2Cjjr57683+apYI3gMYHj+OmN7hE/9Dsmrr7fbitgn4D9/elG0iM4quJ4o/WN5xDP/frM60XejhtwX9qvs1/3NIKdLt9pACMv+W3BuI9a5hq73C5rd2eO2/48g0fAzMiR7xIw4uPJ+OujcUe772t/rQlcv35cnNf944XROzwz5sgezXj9NyJRNebq81QwOuD9Eeb4uuXng3S/6rrfVsCof8P0qteD9OinmNd/ju6Aa4WfCj7MX97PwksHXAdgn4DVr18WWR+j5vm+2dXx1d/LHQHXCp8C9hk2j8W9T2HmNlbA234EnOuo6+Wds/7ezB7cuY7B157B+LjLjqdD/yHg54N0/gHd1AkQtcyxegAAAABJRU5ErkJggg==","w":320,"h":180},"dusk":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAC0CAMAAADSOgUjAAAAG1BMVEUAAAAaFCOPT19eOlo7K0vQdF+yOixuHyQhGjPjG3jHAAAAAXRSTlMAQObYZgAAAfVJREFUeNrt2EFS40AMQFFL3Ylz/xNPSe5AHBgWw2qS96AKcBEWv6S2w7YBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPD/CQl+1y9Dwl8WTAV/DNT0++d+o8z469l3Kqjl136Z+V3BGBHVq/rFihcxFDxvbfW7rIKnRa5W9VEBZ4/guqDgtsXsta0UY8w8RvC8yDFGf9YUxqxqXbQ/9at+VS0qYBccoxte93gY0hlzxugJzMo3Z6UMy3v0u3TBXt4c6yDcb9eH+0UHG3FMYAWsK4bvUHs7x9j2Cjjr57683+apYI3gMYHj+OmN7hE/9Dsmrr7fbitgn4D9/elG0iM4quJ4o/WN5xDP/frM60XejhtwX9qvs1/3NIKdLt9pACMv+W3BuI9a5hq73C5rd2eO2/48g0fAzMiR7xIw4uPJ+OujcUe772t/rQlcv35cnNf944XROzwz5sgezXj9NyJRNebq81QwOuD9Eeb4uuXng3S/6rrfVsCof8P0qteD9OinmNd/ju6Aa4WfCj7MX97PwksHXAdgn4DVr18WWR+j5vm+2dXx1d/LHQHXCp8C9hk2j8W9T2HmNlbA234EnOuo6+Wds/7ezB7cuY7B157B+LjLjqdD/yHg54N0/gHd1AkQtcyxegAAAABJRU5ErkJggg==","w":320,"h":180},"night":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAC0CAMAAADSOgUjAAAAFVBMVEUAAAAaFCMqR1IdMkcUITo/ZGYMEiRK61x+AAAAAXRSTlMAQObYZgAAAehJREFUeNrt2MtyIjEMQNGWbPj/T56S7E6gk8lisho4h1TxqJDFLck0OQ4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP4/IcHv+mVI+MuCqeCPgZp+/9xvlBl/PfueCmr5tV9mflcwRkT1qn6x40UMBZ+3tvrddsGnRa5WdauAs0dwv6DgccTsta0UY8xcI/i8yDFG/9QUxqxqXbR/9Kt+VS0qYBccI68Fq9ucMXoCs/LNWSnD8q5+ty7Yy5vjPAjvD/O1go1YE1gB6xXDt9TezjGOej5nPV8TeJ9PBWsE1wSO9eyNPiN+6Lcmrh4f9x2w6/Xjpw+SHsFRFccbrW9cQ1z79ZnXi3ysze2XZhWcMy4j2OnynQYw8pbfFoxz1DL32OVxO3c3x31eZ3AFzIwc+S4BIz6ujL9eGne0c1/7viZw//p6cY7PTtE7PDPmyB7NeP0vIrF2cfW5FIwOeF7CrPsjPy+k17vmfQeM+jdMr3pdSI++inn96+gOuFf4UvBh/vI8C28dcB+AfQJWv35bZN1GzfO52dXx1b/LrYB7hZ8C9hk21+KeU5h5jB3wPnfAfdT18s5Zf29mD+7cx+Brz2B8fMqOy6H/EPDzQjr/AC9nCM9r8nlNAAAAAElFTkSuQmCC","w":320,"h":180},"overcast":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAC0CAMAAADSOgUjAAAAGFBMVEUAAAAaFCNBVkYrPDMbJyNic1qcazxuHyRzrVHPAAAAAXRSTlMAQObYZgAAAfBJREFUeNrt2EFS40AMQFFL3Ynvf+MpqW2IA8NiWE3yHlQBLsLil9R22DYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP4/IcHv+mVI+MuCqeCPgZp+/9xvlBl/PfsuBbX82i8zvysYI6J6Vb844kUMBa9bW/1uR8HLIler+qiAs0fwuKDgtsXsta0UY8xcI3hd5BijP2sKY1a1Ltqf+lW/qhYVsAuO0Q3vezwM6Yw5Y/QEZuWbs1KG5V39bl2wlzfHcRDu+/3hftHBRqwJrIB1xfAttbdzjG2vgLN+7sv7Pi8FawTXBI710xvdI37otyauvv8I2Cdgf3+5kfQIjqo43mh94znEc78+83qRt3UD7kv7ffbrnkaw0+U7DWDkLb8tGOeoZR5jl9vt2N2ZY9+fZ3AFzIwc+S4BIz6ejL8+Gne0c1/7a03g8evr4rzvHy+M3uGZMUf2aMbrvxGJqjGPPk8FowOejzDr65afD9L9qvt+Boz6N0yvej1Ij36Kef3n6A54rPBTwYf5y/MsvHXA4wDsE7D69csi62PUPJ+bXR1f/b3cCnis8CVgn2FzLe45hZnbOAPuK+A8jrpe3jnr783swZ3HMfjaMxgfd9nxdOg/BPx8kM4/sk0JCYvcc0gAAAAASUVORK5CYII=","w":320,"h":180}},"front":true,"optional":true,"actors":[{"sprite":"tall","x":48,"y":156,"phase":0},{"sprite":"tall","x":250,"y":158,"phase":400,"flip":true}]}],"sprites":{"grass":{"day":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAANCAMAAAAucZheAAAAElBMVEUAAAAaFCOl11parkUuejofSiyqBYhCAAAAAXRSTlMAQObYZgAAAG5JREFUeNqd0FEKxTAIBVFHzf63/IiNpS8Ikvh3JuV+VCQO2a4L/APlG7uw0wjjTWCF/X3aFNypQ2MsDaMKvUFNY6/yHsr33MuBMxumNgf9xlHU3N2H5y84cpQnjHfxyEJwOj84swhj3aVFWHfjH0pqBXZSNapIAAAAAElFTkSuQmCC","w":16,"h":13,"ms":[200,200,200,200]},"dusk":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAANCAMAAAAucZheAAAAElBMVEUAAAAaFCPQdF+PT19eOlo7K0uynWkIAAAAAXRSTlMAQObYZgAAAG5JREFUeNqd0FEKxTAIBVFHzf63/IiNpS8Ikvh3JuV+VCQO2a4L/APlG7uw0wjjTWCF/X3aFNypQ2MsDaMKvUFNY6/yHsr33MuBMxumNgf9xlHU3N2H5y84cpQnjHfxyEJwOj84swhj3aVFWHfjH0pqBXZSNapIAAAAAElFTkSuQmCC","w":16,"h":13,"ms":[200,200,200,200]},"night":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAANCAMAAAAucZheAAAAElBMVEUAAAAaFCM/ZGYqR1IdMkcUITpbvjHCAAAAAXRSTlMAQObYZgAAAG5JREFUeNqd0FEKxTAIBVFHzf63/IiNpS8Ikvh3JuV+VCQO2a4L/APlG7uw0wjjTWCF/X3aFNypQ2MsDaMKvUFNY6/yHsr33MuBMxumNgf9xlHU3N2H5y84cpQnjHfxyEJwOj84swhj3aVFWHfjH0pqBXZSNapIAAAAAElFTkSuQmCC","w":16,"h":13,"ms":[200,200,200,200]},"overcast":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAANCAMAAAAucZheAAAAElBMVEUAAAAaFCNic1pBVkYrPDMbJyNB/WquAAAAAXRSTlMAQObYZgAAAG5JREFUeNqd0FEKxTAIBVFHzf63/IiNpS8Ikvh3JuV+VCQO2a4L/APlG7uw0wjjTWCF/X3aFNypQ2MsDaMKvUFNY6/yHsr33MuBMxumNgf9xlHU3N2H5y84cpQnjHfxyEJwOj84swhj3aVFWHfjH0pqBXZSNapIAAAAAElFTkSuQmCC","w":16,"h":13,"ms":[200,200,200,200]}},"tall":{"day":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAeCAMAAABNNuFqAAAAElBMVEUAAAAaFCMfSixarkUuejql11poSCvTAAAAAXRSTlMAQObYZgAAAi5JREFUeNrtVgluwyAQ9B78/8vVHmDAwJK0qZLIKKoc5mIARz2Oe9zjHvd4nwH/wlhT4BfugBDQ/oJRKPC4PnAvzghR9ssYz6IQiqHZgOcZGRmvYa5fomATiwLGWC2vZYwIx5IBD6AtrMYKew0PGjF88zKx7IxOIRRCY1FMa0axiPXr/AMIyMSUSZVVx8gHdbq5knTyJNSrccbYItav8zOsalN1BS7pwrgWmBLOiv7QLiHUR/YHMMgHAVg4qSuggEAyx6JL7WnbfEMYOQAbAZ3RFFjoo3xrkAsgQELdKhjE54ojgiZkB6RrATwLQPIv/QpH+jD/KHhSuZ01srb1d8/jkxgAYU0oC1DTlB3QJ7sCI0Kg38m3Aui4/EFk5POMzQC9oRJ0qjJQgh4+oT0zXhJkj+QmC78QIn2cj4mBWc6NWXEsuL/ViVEJ7A2VwP5DJ20TZIJsoFwHd7AVIifFoSGUBa71G/mJVa8FCKsC/qY1BiR7gez30Qq2CxgYeAHDJaFd4FIf5QuB+CygLPvYz5bhyOwnJF/cAJDUgAk6g74AVQskw80g1m/k5wJU9HqpoPzsMqnBmc8ENSEvQCAPsLRBQDFAuy+hfiMfieoCmAvI02EB1BrYpbNrWHAxyBtMZsA9ngMM93u8qZ/lt4Tan/laYIFXC2ANWOLjgiv9LH9AIBKPOc5qwKMT2tgAfxO3FxjlP1Fgu+CL8DZ/TogKvgn+DQWmAz4Bl3/nZuMD8B9iHRvM7sGhJwAAAABJRU5ErkJggg==","w":32,"h":30,"ms":[167,167,167,167,167,167]},"dusk":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAeCAMAAABNNuFqAAAAElBMVEUAAAAaFCM7K0uPT19eOlrQdF/M12w5AAAAAXRSTlMAQObYZgAAAi5JREFUeNrtVgluwyAQ9B78/8vVHmDAwJK0qZLIKKoc5mIARz2Oe9zjHvd4nwH/wlhT4BfugBDQ/oJRKPC4PnAvzghR9ssYz6IQiqHZgOcZGRmvYa5fomATiwLGWC2vZYwIx5IBD6AtrMYKew0PGjF88zKx7IxOIRRCY1FMa0axiPXr/AMIyMSUSZVVx8gHdbq5knTyJNSrccbYItav8zOsalN1BS7pwrgWmBLOiv7QLiHUR/YHMMgHAVg4qSuggEAyx6JL7WnbfEMYOQAbAZ3RFFjoo3xrkAsgQELdKhjE54ojgiZkB6RrATwLQPIv/QpH+jD/KHhSuZ01srb1d8/jkxgAYU0oC1DTlB3QJ7sCI0Kg38m3Aui4/EFk5POMzQC9oRJ0qjJQgh4+oT0zXhJkj+QmC78QIn2cj4mBWc6NWXEsuL/ViVEJ7A2VwP5DJ20TZIJsoFwHd7AVIifFoSGUBa71G/mJVa8FCKsC/qY1BiR7gez30Qq2CxgYeAHDJaFd4FIf5QuB+CygLPvYz5bhyOwnJF/cAJDUgAk6g74AVQskw80g1m/k5wJU9HqpoPzsMqnBmc8ENSEvQCAPsLRBQDFAuy+hfiMfieoCmAvI02EB1BrYpbNrWHAxyBtMZsA9ngMM93u8qZ/lt4Tan/laYIFXC2ANWOLjgiv9LH9AIBKPOc5qwKMT2tgAfxO3FxjlP1Fgu+CL8DZ/TogKvgn+DQWmAz4Bl3/nZuMD8B9iHRvM7sGhJwAAAABJRU5ErkJggg==","w":32,"h":30,"ms":[167,167,167,167,167,167]},"night":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAeCAMAAABNNuFqAAAAElBMVEUAAAAaFCMUIToqR1IdMkc/ZGbt4ZLBAAAAAXRSTlMAQObYZgAAAi5JREFUeNrtVgluwyAQ9B78/8vVHmDAwJK0qZLIKKoc5mIARz2Oe9zjHvd4nwH/wlhT4BfugBDQ/oJRKPC4PnAvzghR9ssYz6IQiqHZgOcZGRmvYa5fomATiwLGWC2vZYwIx5IBD6AtrMYKew0PGjF88zKx7IxOIRRCY1FMa0axiPXr/AMIyMSUSZVVx8gHdbq5knTyJNSrccbYItav8zOsalN1BS7pwrgWmBLOiv7QLiHUR/YHMMgHAVg4qSuggEAyx6JL7WnbfEMYOQAbAZ3RFFjoo3xrkAsgQELdKhjE54ojgiZkB6RrATwLQPIv/QpH+jD/KHhSuZ01srb1d8/jkxgAYU0oC1DTlB3QJ7sCI0Kg38m3Aui4/EFk5POMzQC9oRJ0qjJQgh4+oT0zXhJkj+QmC78QIn2cj4mBWc6NWXEsuL/ViVEJ7A2VwP5DJ20TZIJsoFwHd7AVIifFoSGUBa71G/mJVa8FCKsC/qY1BiR7gez30Qq2CxgYeAHDJaFd4FIf5QuB+CygLPvYz5bhyOwnJF/cAJDUgAk6g74AVQskw80g1m/k5wJU9HqpoPzsMqnBmc8ENSEvQCAPsLRBQDFAuy+hfiMfieoCmAvI02EB1BrYpbNrWHAxyBtMZsA9ngMM93u8qZ/lt4Tan/laYIFXC2ANWOLjgiv9LH9AIBKPOc5qwKMT2tgAfxO3FxjlP1Fgu+CL8DZ/TogKvgn+DQWmAz4Bl3/nZuMD8B9iHRvM7sGhJwAAAABJRU5ErkJggg==","w":32,"h":30,"ms":[167,167,167,167,167,167]},"overcast":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAeCAMAAABNNuFqAAAAElBMVEUAAAAaFCMbJyNBVkYrPDNic1qWC9MoAAAAAXRSTlMAQObYZgAAAi5JREFUeNrtVgluwyAQ9B78/8vVHmDAwJK0qZLIKKoc5mIARz2Oe9zjHvd4nwH/wlhT4BfugBDQ/oJRKPC4PnAvzghR9ssYz6IQiqHZgOcZGRmvYa5fomATiwLGWC2vZYwIx5IBD6AtrMYKew0PGjF88zKx7IxOIRRCY1FMa0axiPXr/AMIyMSUSZVVx8gHdbq5knTyJNSrccbYItav8zOsalN1BS7pwrgWmBLOiv7QLiHUR/YHMMgHAVg4qSuggEAyx6JL7WnbfEMYOQAbAZ3RFFjoo3xrkAsgQELdKhjE54ojgiZkB6RrATwLQPIv/QpH+jD/KHhSuZ01srb1d8/jkxgAYU0oC1DTlB3QJ7sCI0Kg38m3Aui4/EFk5POMzQC9oRJ0qjJQgh4+oT0zXhJkj+QmC78QIn2cj4mBWc6NWXEsuL/ViVEJ7A2VwP5DJ20TZIJsoFwHd7AVIifFoSGUBa71G/mJVa8FCKsC/qY1BiR7gez30Qq2CxgYeAHDJaFd4FIf5QuB+CygLPvYz5bhyOwnJF/cAJDUgAk6g74AVQskw80g1m/k5wJU9HqpoPzsMqnBmc8ENSEvQCAPsLRBQDFAuy+hfiMfieoCmAvI02EB1BrYpbNrWHAxyBtMZsA9ngMM93u8qZ/lt4Tan/laYIFXC2ANWOLjgiv9LH9AIBKPOc5qwKMT2tgAfxO3FxjlP1Fgu+CL8DZ/TogKvgn+DQWmAz4Bl3/nZuMD8B9iHRvM7sGhJwAAAABJRU5ErkJggg==","w":32,"h":30,"ms":[167,167,167,167,167,167]}},"ripple":{"day":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAhwAAAAHCAMAAAB0rmQ/AAAACVBMVEUAAABPj+Cf0P/C0eJdAAAAAXRSTlMAQObYZgAAAFNJREFUeNrtl7EKACAIBdP//+ggh0pK2kq6G8QDp4xHlQK/IcaZQnrUONC+99bFCpn2v1bXRCouQ0Ll0F/Ke5Wt6lC96jwVKZeD5CA5gDcH3PqtVKqwASnZkvzAAAAAAElFTkSuQmCC","w":15,"h":7,"ms":[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100]},"dusk":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAhwAAAAHCAMAAAB0rmQ/AAAACVBMVEUAAADQdF/zw0rPPU2eAAAAAXRSTlMAQObYZgAAAFNJREFUeNrtl7EKACAIBdP//+ggh0pK2kq6G8QDp4xHlQK/IcaZQnrUONC+99bFCpn2v1bXRCouQ0Ll0F/Ke5Wt6lC96jwVKZeD5CA5gDcH3PqtVKqwASnZkvzAAAAAAElFTkSuQmCC","w":15,"h":7,"ms":[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100]},"night":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAhwAAAAHCAMAAAB0rmQ/AAAACVBMVEUAAAAbJlIdKmtkAkLOAAAAAXRSTlMAQObYZgAAAFNJREFUeNrtl7EKACAIBdP//+ggh0pK2kq6G8QDp4xHlQK/IcaZQnrUONC+99bFCpn2v1bXRCouQ0Ll0F/Ke5Wt6lC96jwVKZeD5CA5gDcH3PqtVKqwASnZkvzAAAAAAElFTkSuQmCC","w":15,"h":7,"ms":[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100]},"overcast":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAhwAAAAHCAMAAAB0rmQ/AAAACVBMVEUAAAAvT7NPj+DHKtzOAAAAAXRSTlMAQObYZgAAAFNJREFUeNrtl7EKACAIBdP//+ggh0pK2kq6G8QDp4xHlQK/IcaZQnrUONC+99bFCpn2v1bXRCouQ0Ll0F/Ke5Wt6lC96jwVKZeD5CA5gDcH3PqtVKqwASnZkvzAAAAAAElFTkSuQmCC","w":15,"h":7,"ms":[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100]}},"ripple_slow":{"day":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAv0AAAAHCAMAAACsjgJwAAAACVBMVEUAAABPj+Cf0P/C0eJdAAAAAXRSTlMAQObYZgAAAFtJREFUeNrtmDEKACAMxGz//2hBB7Vo6SRFk0EacJJDD0sBeAzpxBQgO9oJ6Ah2m3wFSBTwvZrBUzGvgKscOlysJCpH1Wm1qusuT0k/cPeTfqD30/vhs4IV/fOpvXwBKUjwRPwAAAAASUVORK5CYII=","w":15,"h":7,"ms":[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100]},"dusk":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAv0AAAAHCAMAAACsjgJwAAAACVBMVEUAAADQdF/zw0rPPU2eAAAAAXRSTlMAQObYZgAAAFtJREFUeNrtmDEKACAMxGz//2hBB7Vo6SRFk0EacJJDD0sBeAzpxBQgO9oJ6Ah2m3wFSBTwvZrBUzGvgKscOlysJCpH1Wm1qusuT0k/cPeTfqD30/vhs4IV/fOpvXwBKUjwRPwAAAAASUVORK5CYII=","w":15,"h":7,"ms":[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100]},"night":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAv0AAAAHCAMAAACsjgJwAAAACVBMVEUAAAAbJlIdKmtkAkLOAAAAAXRSTlMAQObYZgAAAFtJREFUeNrtmDEKACAMxGz//2hBB7Vo6SRFk0EacJJDD0sBeAzpxBQgO9oJ6Ah2m3wFSBTwvZrBUzGvgKscOlysJCpH1Wm1qusuT0k/cPeTfqD30/vhs4IV/fOpvXwBKUjwRPwAAAAASUVORK5CYII=","w":15,"h":7,"ms":[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100]},"overcast":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAv0AAAAHCAMAAACsjgJwAAAACVBMVEUAAAAvT7NPj+DHKtzOAAAAAXRSTlMAQObYZgAAAFtJREFUeNrtmDEKACAMxGz//2hBB7Vo6SRFk0EacJJDD0sBeAzpxBQgO9oJ6Ah2m3wFSBTwvZrBUzGvgKscOlysJCpH1Wm1qusuT0k/cPeTfqD30/vhs4IV/fOpvXwBKUjwRPwAAAAASUVORK5CYII=","w":15,"h":7,"ms":[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100]}},"glint":{"day":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF8AAAAFCAMAAAAUh8BWAAAACVBMVEUAAACf0P/7+/9beH80AAAAAXRSTlMAQObYZgAAAB1JREFUeNpjYBhygBFO0MRoRiZGKEFDS2hkNCYAAAzzAA8wQyN9AAAAAElFTkSuQmCC","w":5,"h":5,"ms":[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100]},"dusk":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF8AAAAFCAMAAAAUh8BWAAAACVBMVEUAAADzw0r/8Kg4UFavAAAAAXRSTlMAQObYZgAAAB1JREFUeNpjYBhygBFO0MRoRiZGKEFDS2hkNCYAAAzzAA8wQyN9AAAAAElFTkSuQmCC","w":5,"h":5,"ms":[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100]},"night":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF8AAAAFCAMAAAAUh8BWAAAACVBMVEUAAAAdKmsvT7NN5Q8DAAAAAXRSTlMAQObYZgAAAB1JREFUeNpjYBhygBFO0MRoRiZGKEFDS2hkNCYAAAzzAA8wQyN9AAAAAElFTkSuQmCC","w":5,"h":5,"ms":[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100]},"overcast":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF8AAAAFCAMAAAAUh8BWAAAACVBMVEUAAABPj+Cf0P/C0eJdAAAAAXRSTlMAQObYZgAAAB1JREFUeNpjYBhygBFO0MRoRiZGKEFDS2hkNCYAAAzzAA8wQyN9AAAAAElFTkSuQmCC","w":5,"h":5,"ms":[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100]}},"fish":{"day":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABdYAAAALCAMAAABFyi+vAAAAGFBMVEUAAACLiqPDwtRXVnAaFCOf0P/7+/9Pj+DA51CJAAAAAXRSTlMAQObYZgAAAJpJREFUeNrt1kEKwjAUBNCkMf7731gEUZuUGkHRlPegFAaaRReTSQkAAADguPKSs78AcJhWL6WUUxcvqh5gBqN1nU14gBm2+XBbq3WAKWr98xcAAP8/1jdugOr/AfzU+XVVR0QXrKOIe9SeV692k4inz4cTALbUdl/XbnLH7VkFqyge7/a82m34NumbeiQBYFTXoW+t9fTdtX4BvCYDasxiYRQAAAAASUVORK5CYII=","w":18,"h":11,"ms":[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100]},"dusk":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABdYAAAALCAMAAABFyi+vAAAAGFBMVEUAAABeOlqPT187K0saFCPzw0r/8KjQdF8Fx5kiAAAAAXRSTlMAQObYZgAAAJpJREFUeNrt1kEKwjAUBNCkMf7731gEUZuUGkHRlPegFAaaRReTSQkAAADguPKSs78AcJhWL6WUUxcvqh5gBqN1nU14gBm2+XBbq3WAKWr98xcAAP8/1jdugOr/AfzU+XVVR0QXrKOIe9SeV692k4inz4cTALbUdl/XbnLH7VkFqyge7/a82m34NumbeiQBYFTXoW+t9fTdtX4BvCYDasxiYRQAAAAASUVORK5CYII=","w":18,"h":11,"ms":[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100]},"night":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABdYAAAALCAMAAABFyi+vAAAAGFBMVEUAAAAdMkcqR1IUIToaFCMdKmsvT7MbJlLJyaQaAAAAAXRSTlMAQObYZgAAAJpJREFUeNrt1kEKwjAUBNCkMf7731gEUZuUGkHRlPegFAaaRReTSQkAAADguPKSs78AcJhWL6WUUxcvqh5gBqN1nU14gBm2+XBbq3WAKWr98xcAAP8/1jdugOr/AfzU+XVVR0QXrKOIe9SeV692k4inz4cTALbUdl/XbnLH7VkFqyge7/a82m34NumbeiQBYFTXoW+t9fTdtX4BvCYDasxiYRQAAAAASUVORK5CYII=","w":18,"h":11,"ms":[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100]},"overcast":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABdYAAAALCAMAAABFyi+vAAAAGFBMVEUAAABXVnCLiqMvLTwaFCNPj+Cf0P8vT7NSomphAAAAAXRSTlMAQObYZgAAAJpJREFUeNrt1kEKwjAUBNCkMf7731gEUZuUGkHRlPegFAaaRReTSQkAAADguPKSs78AcJhWL6WUUxcvqh5gBqN1nU14gBm2+XBbq3WAKWr98xcAAP8/1jdugOr/AfzU+XVVR0QXrKOIe9SeV692k4inz4cTALbUdl/XbnLH7VkFqyge7/a82m34NumbeiQBYFTXoW+t9fTdtX4BvCYDasxiYRQAAAAASUVORK5CYII=","w":18,"h":11,"ms":[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100]}},"bfly_white":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAFCAMAAABhCnz1AAAADFBMVEUAAAAaFCP7+//T4PIWFYZ7AAAAAXRSTlMAQObYZgAAADJJREFUeNp9jEEKACAMw9Lu/3+WTlHYQSgJW6EgJSBCLvtnJ8jyvg/jb4lK1e7xoWemFh0ZAFyNIRFFAAAAAElFTkSuQmCC","w":7,"h":5,"ms":[100,100,100,100]}},"bfly_yellow":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAFCAMAAABhCnz1AAAADFBMVEUAAAAaFCP/8Kjzw0rv0MhYAAAAAXRSTlMAQObYZgAAADJJREFUeNp9jEEKACAMw9Lu/3+WTlHYQSgJW6EgJSBCLvtnJ8jyvg/jb4lK1e7xoWemFh0ZAFyNIRFFAAAAAElFTkSuQmCC","w":7,"h":5,"ms":[100,100,100,100]}},"bfly_blue":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAFCAMAAABhCnz1AAAADFBMVEUAAAAaFCOf0P9Pj+DWtJKWAAAAAXRSTlMAQObYZgAAADJJREFUeNp9jEEKACAMw9Lu/3+WTlHYQSgJW6EgJSBCLvtnJ8jyvg/jb4lK1e7xoWemFh0ZAFyNIRFFAAAAAElFTkSuQmCC","w":7,"h":5,"ms":[100,100,100,100]}},"bfly_monarch":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAFCAMAAABhCnz1AAAADFBMVEUAAAAaFCPgeCqyOizLYYSbAAAAAXRSTlMAQObYZgAAADJJREFUeNp9jEEKACAMw9Lu/3+WTlHYQSgJW6EgJSBCLvtnJ8jyvg/jb4lK1e7xoWemFh0ZAFyNIRFFAAAAAElFTkSuQmCC","w":7,"h":5,"ms":[100,100,100,100]}},"glow":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFCAMAAABl/6zIAAAADFBMVEUAAABarkWl11r/8Kjf/GFGAAAAAXRSTlMAQObYZgAAACtJREFUeNpjYEAHjAy4ABNIlokRykJWDuIzMTMxMDIxMzGCWShqcOvGZzcADiQAL7vFcXsAAAAASUVORK5CYII=","w":5,"h":5,"ms":[600,100,100,200,100,100]}},"glow_amber":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFCAMAAABl/6zIAAAADFBMVEUAAADgeCrzw0r/8KiglOXlAAAAAXRSTlMAQObYZgAAACtJREFUeNpjYEAHjAy4ABNIlokRykJWDuIzMTMxMDIxMzGCWShqcOvGZzcADiQAL7vFcXsAAAAASUVORK5CYII=","w":5,"h":5,"ms":[600,100,100,200,100,100]}},"bird":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAECAMAAACqVq9QAAAACVBMVEUvLTwAAAAaFCNO45ySAAAAAnRSTlP/AOW3MEoAAAAsSURBVHjaY2BgBAEICQZMCCYDWJyBkYEBgiECUB6MC9PCADOGCcpAMQjZEgAUgQBdMWdehgAAAABJRU5ErkJggg==","w":7,"h":4,"ms":[100,100,100,100]}},"cloud_a":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG4AAAAuCAMAAAD+3dylAAAABlBMVEUAAAAaFCM4HzlOAAAAAXRSTlMAQObYZgAAAIdJREFUeNrt2DEOwCAMQ1H/+1+6a6VWFAIxqIp38iQYAEvtcI8yw3ucVo7IV1aeAP3pXLwGe8wa3w8iiZ4A4Siw9WTHq+HVNnJYOYpbxvFjDowcODmcHM54teKKK6644k7l3Jed+dlgf15qZMX0H6tzSPufP1hKTBYNh9coTdBaSkmuIixj/AVZ/w+ILOp7zQAAAABJRU5ErkJggg==","w":110,"h":46}},"cloud_b":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAiCAMAAAD/Ja5VAAAABlBMVEUAAAAaFCM4HzlOAAAAAXRSTlMAQObYZgAAAGJJREFUeNrt1jEOwCAMBEHv/z8dKQ1EInDEJ5TCW9tTGiJ+Fa30GqM2tW6Jt3a1dW4PMzcDsYJ8zquNQJL5pCeILTN3g+AFMYMUWGCBBR64NvJ5DZlTSGVKf+vmU/m/3mrsAneWCIXPSyXFAAAAAElFTkSuQmCC","w":80,"h":34}},"pollen":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAMAAAAoyzS7AAAAA1BMVEX/8KjVU8NQAAAACklEQVR42mNgAAAAAgAB5Sfe/AAAAABJRU5ErkJggg==","w":1,"h":1}},"fluff":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAADCAMAAABh9kWNAAAACVBMVEUAAAD7+//T4PKf1YwSAAAAAXRSTlMAQObYZgAAABFJREFUeNpjYGBkYGBkAhEMAAAwAAenw4+3AAAAAElFTkSuQmCC","w":3,"h":3}},"gold":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAMAAAAoyzS7AAAAA1BMVEXzw0pmJtxQAAAACklEQVR42mNgAAAAAgAB5Sfe/AAAAABJRU5ErkJggg==","w":1,"h":1}}},"effects":{"day":[{"type":"butterflies","sprites":["bfly_white","bfly_yellow","bfly_blue","bfly_monarch"],"plane":"ground","count":5,"anchors":[[304,136],[59,96],[73,88],[85,106],[37,124],[93,78],[243,122],[259,132],[201,68]],"after":"ground"},{"type":"motes","sprites":["pollen","pollen","fluff"],"count":14,"area":[0,40,320,140],"wind":[3,8],"after":"front"},{"type":"shadows","sprites":["cloud_a","cloud_b"],"count":1,"every":[12000,22000],"speed":[5,8],"alpha":0.16,"y":[-60,120],"after":"front"},{"type":"birds","sprite":"bird","every":[16000,30000],"count":[2,4],"y":[10,60],"speed":[18,26],"factor":0,"after":"front"}],"dusk":[{"type":"motes","sprites":["gold"],"count":18,"area":[0,30,320,150],"wind":[1,4],"fall":[-2,1],"after":"front"},{"type":"birds","sprite":"bird","every":[12000,24000],"count":[3,5],"y":[8,50],"speed":[16,22],"factor":0,"after":"front"}],"night":[{"type":"fireflies","sprites":["glow","glow","glow_amber"],"plane":"ground","count":16,"area":[0,50,320,120],"front":0.3,"after":"ground"}],"overcast":[{"type":"motes","sprites":["fluff"],"count":6,"area":[0,20,320,160],"wind":[14,24],"fall":[0,3],"after":"front"}]},"speed":{"overcast":2}};

/** Crée la scène « Clairière de la mare ». Voir les options en tête du fichier. */
export function createScene(opts = {}) {
  return createSceneFrom(SCENE, opts);
}

export default createScene;
