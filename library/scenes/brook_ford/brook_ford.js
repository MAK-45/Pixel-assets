// brook_ford.js — GÉNÉRÉ par pixel-assets (scripts/build.js), ne pas modifier.
// Scène « Gué du ruisseau » (scenes/brook_ford) — statique : un écran fixe.
// Base 320×180 px, ligne de sol y = 140, périodes : day (Jour), dusk (Crépuscule), night (Nuit), overcast (Sombre).
// Plans : backdrop ×0, ground ×0, front (devant) ×0.
//
//   import { createScene, fitCanvas } from "./brook_ford.js";
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
export const SCENE = {"format":1,"id":"scenes/brook_ford","title":"Gué du ruisseau","type":"static","w":320,"h":180,"groundY":140,"defaultPeriod":"day","periods":[{"id":"day","label":"Jour"},{"id":"dusk","label":"Crépuscule"},{"id":"night","label":"Nuit"},{"id":"overcast","label":"Sombre"}],"planes":[{"id":"backdrop","label":"Bords (vue élargie)","factor":0,"y":0,"images":{"day":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAC0CAMAAACqoFyrAAAAHlBMVEUfSiwuejparkWcazxqQSg7IhkdKmsvT7NPj+Cl11pLHRVTAAABCElEQVR42u1W7RKCMAxL4+fe/4WVMbYuQ1DhTuDsD9xCDb0mKwAHCiuBfPFb+ARUGSkLuhUOA0wRk9gNgKUc8B1D4oNvuW8yRjigdzoZXdf7bSVlj4wXJuoAqn6uOD6FEjhJ4CyBiwSuEi1wk/gVcJf4Bmj6sT1rixHQnOxqGNACEeIiZRDGYdH/kqHLS/8kA0kj82Pjku9UykxakP3OD5ubuFNHfb068riIGlXqU5qcM5y2QsrN9DQVi6Hm7DEuJvUuHDFul6TGbYCgTuZBnLwiIEq9r1yxMkPty0Xq/wGb+upDPccg6Mh8K3deZuCzwtgpHeUfXhZ0lzkOutdapAp50vUcz4P8ANIWETatdYLqAAAAAElFTkSuQmCC","w":16,"h":180,"fill":"#1f4a2c"},"dusk":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAC0CAMAAACqoFyrAAAAD1BMVEU7K0teOlqPT18hGjPQdF+RAExNAAAA/0lEQVR42u1W2xaDIAxLM/7/mzcuQglM3fRBd9YHB7GLPU2oAj8U1gL14rfwCegyShZ0KxwGmCImcRsARzngO4bCB99y32RMOKB3ooyu63nbSZmReWGiDqDq14rTUygxAkM8JHYAV4kg8Q2wduYuYm0xAoaT3Q0DWiBCWpQMwrgs8i8ZYl75JxlIGlkfm5bcUykraUPuOz9sa+KuHfXz6qjjImnUqU9pcs1w2gopL9PTUiyWmqvHeJjUu3Bi3Jikxh2AoE7mjzj5RECU2q9cszJD78tD6v8BW/vqQz/HIOhkvrU7bzPwWWGMSif5l5cF3WWLg+61lqhCnXSZ43WQn3mbC1FCg/OxAAAAAElFTkSuQmCC","w":16,"h":180,"fill":"#3b2b4b"},"night":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAC0CAMAAACqoFyrAAAAGFBMVEUUITodMkcqR1IMEiQHChwPFjQbJlI/ZGYpRyLeAAABBklEQVR42u1W7RKDIAxLsw/e/403ELEEpm7ubuqtPxzELvaaUAVOFDYFysVv4RNQZeQs6FY4DDBFTOIwALZywHcMmQ++5b7J6HBA70QZXdeHbSXlgPQLE3UAVb9UnJ5CiZa0iYsErhItcJP4FXCX+ASYO3M7sbYYAc3JroYBLRAhLXIGYRwXwy8ZYl7+JxlIGlkem5ZcUylNPcYDzw9bmrhzR/17dZRxkTSq1Kc0uWQ4bYWUu+lpLhZjzcVj3EzqXdgxbkxS4zZAUCfzJE7+IiBKrVdusjJD7ctN6v8Bm/vqQz3HIGhnvk13XmbgvcIYlU7yjy8LussSB91rLVGFMukGjudBfgCG5w6UzhDaEgAAAABJRU5ErkJggg==","w":16,"h":180,"fill":"#14213a"},"overcast":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAC0CAMAAACqoFyrAAAAGFBMVEUbJyMrPDNBVkZqQSg7IhkdKmsvT7Nic1r+vIP4AAABA0lEQVR42u1W2xaDIAxLswv//8ebiFACUzd9UM/64CB2sacJVeBCYSWQL34Ln4AqI2VBt8JhgCliEqcBsJUDvmNIfPAt901GhwN6Z5DRdX3cVlKOSL8wUQdQ9XPF8SmUwE0Cd4nWdA+J4wJPiV+Aph/Hs7YYAc3JroYBLRAhLlIGYZwW4y8Zhrz0TzKQNDI/Ni65plJm0oKcd37Y0sSdO+r71ZHHRdSoUp/S5JzhtBVSHqanqVhMNWePcTOpd2HHuEOSGrcBgjqZF3HyjoAotV65YmWG2peb1P8DNvfVh3qOQdDOfCt3Pmbgu8I4KB3ln14WdJclDrrXWqQKedKNHO+D/AI2Og8k543gFgAAAABJRU5ErkJggg==","w":16,"h":180,"fill":"#1b2723"}},"kind":"sky"},{"id":"ground","label":"Ruisseau et prairie","factor":0,"y":0,"images":{"day":{"src":"data:image/png;base64,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","w":320,"h":180},"dusk":{"src":"data:image/png;base64,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","w":320,"h":180},"night":{"src":"data:image/png;base64,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","w":320,"h":180},"overcast":{"src":"data:image/png;base64,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","w":320,"h":180}},"actors":[{"sprite":"current","x":-4,"y":58,"phase":0},{"sprite":"current_b","x":20,"y":60,"phase":233},{"sprite":"current","x":44,"y":58,"phase":466},{"sprite":"current_b","x":68,"y":52,"phase":699},{"sprite":"current","x":92,"y":52,"phase":932},{"sprite":"current_b","x":116,"y":54,"phase":165},{"sprite":"current","x":140,"y":51,"phase":398},{"sprite":"current_b","x":164,"y":50,"phase":631},{"sprite":"current","x":188,"y":50,"phase":864},{"sprite":"current_b","x":212,"y":50,"phase":97},{"sprite":"current","x":236,"y":55,"phase":330},{"sprite":"current_b","x":260,"y":58,"phase":563},{"sprite":"current","x":284,"y":55,"phase":796},{"sprite":"current_b","x":308,"y":54,"phase":29},{"sprite":"foam","x":140,"y":50,"phase":0},{"sprite":"foam","x":151,"y":47,"phase":170},{"sprite":"foam","x":162,"y":50,"phase":340},{"sprite":"foam","x":173,"y":47,"phase":510},{"sprite":"fall","x":8,"y":44,"phase":0},{"sprite":"foam","x":16,"y":53,"phase":300},{"sprite":"glint","x":90,"y":51,"phase":0},{"sprite":"glint","x":214,"y":51,"phase":600},{"sprite":"glint","x":270,"y":57,"phase":1100},{"sprite":"grass","x":50,"y":150,"phase":0},{"sprite":"grass","x":118,"y":136,"phase":337,"flip":true},{"sprite":"grass","x":212,"y":138,"phase":674},{"sprite":"grass","x":262,"y":128,"phase":211,"flip":true},{"sprite":"grass","x":76,"y":108,"phase":548}]},{"id":"front","label":"Premier plan","factor":0,"y":0,"images":{"day":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAC0CAMAAADSOgUjAAAAG1BMVEUAAAAaFCNarkUuejofSiyl11rgeCqyOixuHyQrV5TJAAAAAXRSTlMAQObYZgAAAYVJREFUeNrt19FKY0EMgOGTTGp9/yeWZE7XrRUqeLGw/T4FtdSbn+TM9DgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOA/ERL8Kl+kgr/pl/op+C8fe3f9YsjzvN+KOCPGLhj75VYKPj831nzNAFYHnD9iZaaCP5m/Nd+9rBHVw9gBu9/lLGiRn0xgVFR1wpwJXFF1rFW5R9AiP09YFTVj1xPYAeNYu+Ba+bWgo+XbgjOCM4E9gHXM8na//FKwz5Yykd+t8ep2awYwdsDqgOcSn80iL6ngwxaeI5iTsX8/1hlwft4CRsTbdZ8sL13wcQt3wFwZmTvgznS7ysz7+5DJ6/tZ9oULPm5hzA7XylWRk+q43J59+dcMds7557fryxbsUzbvt7DP3bnHrL5IT7LoCfwzff3ePaK3V6/v9aIBp0HdbeF8DMm+Cp5Lu2LlkZ8X6c+A3TJ7+uaF1w14rvAuOMvb01XzqOuLTEZ9AO9aBkoLtfL7AAAAAElFTkSuQmCC","w":320,"h":180},"dusk":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAC0CAMAAADSOgUjAAAAG1BMVEUAAAAaFCOPT19eOlo7K0vQdF+yOixuHyQhGjPjG3jHAAAAAXRSTlMAQObYZgAAAYVJREFUeNrt19FKY0EMgOGTTGp9/yeWZE7XrRUqeLGw/T4FtdSbn+TM9DgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOA/ERL8Kl+kgr/pl/op+C8fe3f9YsjzvN+KOCPGLhj75VYKPj831nzNAFYHnD9iZaaCP5m/Nd+9rBHVw9gBu9/lLGiRn0xgVFR1wpwJXFF1rFW5R9AiP09YFTVj1xPYAeNYu+Ba+bWgo+XbgjOCM4E9gHXM8na//FKwz5Yykd+t8ep2awYwdsDqgOcSn80iL6ngwxaeI5iTsX8/1hlwft4CRsTbdZ8sL13wcQt3wFwZmTvgznS7ysz7+5DJ6/tZ9oULPm5hzA7XylWRk+q43J59+dcMds7557fryxbsUzbvt7DP3bnHrL5IT7LoCfwzff3ePaK3V6/v9aIBp0HdbeF8DMm+Cp5Lu2LlkZ8X6c+A3TJ7+uaF1w14rvAuOMvb01XzqOuLTEZ9AO9aBkoLtfL7AAAAAElFTkSuQmCC","w":320,"h":180},"night":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAC0CAMAAADSOgUjAAAAFVBMVEUAAAAaFCMqR1IdMkcUITo/ZGYMEiRK61x+AAAAAXRSTlMAQObYZgAAAX1JREFUeNrt19FKK0EMgOFNJvX9H/mQzFatFXrAC8H9PgV1rTc/SWc8DgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+CNCgh/li1TwJ/1SPwV/823voV8MeV73WxFnxNgFYz9upeDrc2PNxwxgdcD5IVZmKvg/87fms5c1onoYO2D3u50FLfKLCYyKqk6YM4Erqo61KvcIWuTXCauiZux6AjtgHGsXXCu/FnS0fFtwRnAmsAewjlne7pdfCvbZUibyuzVe3W7NAMYOWB3wXOKzWeQtFXzawnMEczL298c6A87Xe8De79ony6ULPm/hDpgrI3MH3JnuV5l5fcwv386yFy74vIUxO1wrV0VOquN2f+/LTzPYOeeP13UL9hbm4xb2uTv3mNUX6UkWPYHv09ev3SN6f1pvddGA06AetnD+Dcm+Cp5Lu2LlkR8X6Y+A3TLfH1w34LnCu+Asb09XzV72RSaj/gGJHQYuD1EvzAAAAABJRU5ErkJggg==","w":320,"h":180},"overcast":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAC0CAMAAADSOgUjAAAAGFBMVEUAAAAaFCNBVkYrPDMbJyNic1qcazxuHyRzrVHPAAAAAXRSTlMAQObYZgAAAYRJREFUeNrt19FOG0EMQNG1x2H//48rezalIUipxEOl5hyQgCi8XNk7k+MAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAID/REjwo3yRCv6kX+qn4L987D30iyHP634r4ooYu2Dsl1sp+PrcWPM1A1gdcP6IlZkK/s38rfnuZY2oHsYO2P1uV0GL/GICo6KqE+ZM4IqqY63KPYIW+XXCqqgZu57ADhjH2gXXyq8FHS3fFpwRnAnsAaxjlrf75ZeCfbaUifxujVe3WzOAsQNWB7yW+GoWeUsFn7bwGsGcjP37sa6A8/MeMCI+zn2yvHXB5y3cAXNlZO6AO9P9KjPv70Mmz/Mq+8YFn7cwZodr5arISXXc7s++/GMGO+f888f5tgX7lM3HLexzd+4xqy/Skyx6An9PX793j+j91fOsNw04DephC+djSPZV8FraFSuP/LxIfwbslvlxXi+8b8BrhXfBWd6erppHXV9kMuoX6A4GSHOCGTAAAAAASUVORK5CYII=","w":320,"h":180}},"front":true,"optional":true,"actors":[{"sprite":"tall","x":44,"y":156,"phase":0},{"sprite":"tall","x":252,"y":158,"phase":400,"flip":true}]}],"sprites":{"grass":{"day":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAANCAMAAAAucZheAAAAElBMVEUAAAAaFCOl11parkUuejofSiyqBYhCAAAAAXRSTlMAQObYZgAAAG5JREFUeNqd0FEKxTAIBVFHzf63/IiNpS8Ikvh3JuV+VCQO2a4L/APlG7uw0wjjTWCF/X3aFNypQ2MsDaMKvUFNY6/yHsr33MuBMxumNgf9xlHU3N2H5y84cpQnjHfxyEJwOj84swhj3aVFWHfjH0pqBXZSNapIAAAAAElFTkSuQmCC","w":16,"h":13,"ms":[200,200,200,200]},"dusk":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAANCAMAAAAucZheAAAAElBMVEUAAAAaFCPQdF+PT19eOlo7K0uynWkIAAAAAXRSTlMAQObYZgAAAG5JREFUeNqd0FEKxTAIBVFHzf63/IiNpS8Ikvh3JuV+VCQO2a4L/APlG7uw0wjjTWCF/X3aFNypQ2MsDaMKvUFNY6/yHsr33MuBMxumNgf9xlHU3N2H5y84cpQnjHfxyEJwOj84swhj3aVFWHfjH0pqBXZSNapIAAAAAElFTkSuQmCC","w":16,"h":13,"ms":[200,200,200,200]},"night":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAANCAMAAAAucZheAAAAElBMVEUAAAAaFCM/ZGYqR1IdMkcUITpbvjHCAAAAAXRSTlMAQObYZgAAAG5JREFUeNqd0FEKxTAIBVFHzf63/IiNpS8Ikvh3JuV+VCQO2a4L/APlG7uw0wjjTWCF/X3aFNypQ2MsDaMKvUFNY6/yHsr33MuBMxumNgf9xlHU3N2H5y84cpQnjHfxyEJwOj84swhj3aVFWHfjH0pqBXZSNapIAAAAAElFTkSuQmCC","w":16,"h":13,"ms":[200,200,200,200]},"overcast":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAANCAMAAAAucZheAAAAElBMVEUAAAAaFCNic1pBVkYrPDMbJyNB/WquAAAAAXRSTlMAQObYZgAAAG5JREFUeNqd0FEKxTAIBVFHzf63/IiNpS8Ikvh3JuV+VCQO2a4L/APlG7uw0wjjTWCF/X3aFNypQ2MsDaMKvUFNY6/yHsr33MuBMxumNgf9xlHU3N2H5y84cpQnjHfxyEJwOj84swhj3aVFWHfjH0pqBXZSNapIAAAAAElFTkSuQmCC","w":16,"h":13,"ms":[200,200,200,200]}},"tall":{"day":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAeCAMAAABNNuFqAAAAElBMVEUAAAAaFCMfSixarkUuejql11poSCvTAAAAAXRSTlMAQObYZgAAAi5JREFUeNrtVgluwyAQ9B78/8vVHmDAwJK0qZLIKKoc5mIARz2Oe9zjHvd4nwH/wlhT4BfugBDQ/oJRKPC4PnAvzghR9ssYz6IQiqHZgOcZGRmvYa5fomATiwLGWC2vZYwIx5IBD6AtrMYKew0PGjF88zKx7IxOIRRCY1FMa0axiPXr/AMIyMSUSZVVx8gHdbq5knTyJNSrccbYItav8zOsalN1BS7pwrgWmBLOiv7QLiHUR/YHMMgHAVg4qSuggEAyx6JL7WnbfEMYOQAbAZ3RFFjoo3xrkAsgQELdKhjE54ojgiZkB6RrATwLQPIv/QpH+jD/KHhSuZ01srb1d8/jkxgAYU0oC1DTlB3QJ7sCI0Kg38m3Aui4/EFk5POMzQC9oRJ0qjJQgh4+oT0zXhJkj+QmC78QIn2cj4mBWc6NWXEsuL/ViVEJ7A2VwP5DJ20TZIJsoFwHd7AVIifFoSGUBa71G/mJVa8FCKsC/qY1BiR7gez30Qq2CxgYeAHDJaFd4FIf5QuB+CygLPvYz5bhyOwnJF/cAJDUgAk6g74AVQskw80g1m/k5wJU9HqpoPzsMqnBmc8ENSEvQCAPsLRBQDFAuy+hfiMfieoCmAvI02EB1BrYpbNrWHAxyBtMZsA9ngMM93u8qZ/lt4Tan/laYIFXC2ANWOLjgiv9LH9AIBKPOc5qwKMT2tgAfxO3FxjlP1Fgu+CL8DZ/TogKvgn+DQWmAz4Bl3/nZuMD8B9iHRvM7sGhJwAAAABJRU5ErkJggg==","w":32,"h":30,"ms":[167,167,167,167,167,167]},"dusk":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAeCAMAAABNNuFqAAAAElBMVEUAAAAaFCM7K0uPT19eOlrQdF/M12w5AAAAAXRSTlMAQObYZgAAAi5JREFUeNrtVgluwyAQ9B78/8vVHmDAwJK0qZLIKKoc5mIARz2Oe9zjHvd4nwH/wlhT4BfugBDQ/oJRKPC4PnAvzghR9ssYz6IQiqHZgOcZGRmvYa5fomATiwLGWC2vZYwIx5IBD6AtrMYKew0PGjF88zKx7IxOIRRCY1FMa0axiPXr/AMIyMSUSZVVx8gHdbq5knTyJNSrccbYItav8zOsalN1BS7pwrgWmBLOiv7QLiHUR/YHMMgHAVg4qSuggEAyx6JL7WnbfEMYOQAbAZ3RFFjoo3xrkAsgQELdKhjE54ojgiZkB6RrATwLQPIv/QpH+jD/KHhSuZ01srb1d8/jkxgAYU0oC1DTlB3QJ7sCI0Kg38m3Aui4/EFk5POMzQC9oRJ0qjJQgh4+oT0zXhJkj+QmC78QIn2cj4mBWc6NWXEsuL/ViVEJ7A2VwP5DJ20TZIJsoFwHd7AVIifFoSGUBa71G/mJVa8FCKsC/qY1BiR7gez30Qq2CxgYeAHDJaFd4FIf5QuB+CygLPvYz5bhyOwnJF/cAJDUgAk6g74AVQskw80g1m/k5wJU9HqpoPzsMqnBmc8ENSEvQCAPsLRBQDFAuy+hfiMfieoCmAvI02EB1BrYpbNrWHAxyBtMZsA9ngMM93u8qZ/lt4Tan/laYIFXC2ANWOLjgiv9LH9AIBKPOc5qwKMT2tgAfxO3FxjlP1Fgu+CL8DZ/TogKvgn+DQWmAz4Bl3/nZuMD8B9iHRvM7sGhJwAAAABJRU5ErkJggg==","w":32,"h":30,"ms":[167,167,167,167,167,167]},"night":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAeCAMAAABNNuFqAAAAElBMVEUAAAAaFCMUIToqR1IdMkc/ZGbt4ZLBAAAAAXRSTlMAQObYZgAAAi5JREFUeNrtVgluwyAQ9B78/8vVHmDAwJK0qZLIKKoc5mIARz2Oe9zjHvd4nwH/wlhT4BfugBDQ/oJRKPC4PnAvzghR9ssYz6IQiqHZgOcZGRmvYa5fomATiwLGWC2vZYwIx5IBD6AtrMYKew0PGjF88zKx7IxOIRRCY1FMa0axiPXr/AMIyMSUSZVVx8gHdbq5knTyJNSrccbYItav8zOsalN1BS7pwrgWmBLOiv7QLiHUR/YHMMgHAVg4qSuggEAyx6JL7WnbfEMYOQAbAZ3RFFjoo3xrkAsgQELdKhjE54ojgiZkB6RrATwLQPIv/QpH+jD/KHhSuZ01srb1d8/jkxgAYU0oC1DTlB3QJ7sCI0Kg38m3Aui4/EFk5POMzQC9oRJ0qjJQgh4+oT0zXhJkj+QmC78QIn2cj4mBWc6NWXEsuL/ViVEJ7A2VwP5DJ20TZIJsoFwHd7AVIifFoSGUBa71G/mJVa8FCKsC/qY1BiR7gez30Qq2CxgYeAHDJaFd4FIf5QuB+CygLPvYz5bhyOwnJF/cAJDUgAk6g74AVQskw80g1m/k5wJU9HqpoPzsMqnBmc8ENSEvQCAPsLRBQDFAuy+hfiMfieoCmAvI02EB1BrYpbNrWHAxyBtMZsA9ngMM93u8qZ/lt4Tan/laYIFXC2ANWOLjgiv9LH9AIBKPOc5qwKMT2tgAfxO3FxjlP1Fgu+CL8DZ/TogKvgn+DQWmAz4Bl3/nZuMD8B9iHRvM7sGhJwAAAABJRU5ErkJggg==","w":32,"h":30,"ms":[167,167,167,167,167,167]},"overcast":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAeCAMAAABNNuFqAAAAElBMVEUAAAAaFCMbJyNBVkYrPDNic1qWC9MoAAAAAXRSTlMAQObYZgAAAi5JREFUeNrtVgluwyAQ9B78/8vVHmDAwJK0qZLIKKoc5mIARz2Oe9zjHvd4nwH/wlhT4BfugBDQ/oJRKPC4PnAvzghR9ssYz6IQiqHZgOcZGRmvYa5fomATiwLGWC2vZYwIx5IBD6AtrMYKew0PGjF88zKx7IxOIRRCY1FMa0axiPXr/AMIyMSUSZVVx8gHdbq5knTyJNSrccbYItav8zOsalN1BS7pwrgWmBLOiv7QLiHUR/YHMMgHAVg4qSuggEAyx6JL7WnbfEMYOQAbAZ3RFFjoo3xrkAsgQELdKhjE54ojgiZkB6RrATwLQPIv/QpH+jD/KHhSuZ01srb1d8/jkxgAYU0oC1DTlB3QJ7sCI0Kg38m3Aui4/EFk5POMzQC9oRJ0qjJQgh4+oT0zXhJkj+QmC78QIn2cj4mBWc6NWXEsuL/ViVEJ7A2VwP5DJ20TZIJsoFwHd7AVIifFoSGUBa71G/mJVa8FCKsC/qY1BiR7gez30Qq2CxgYeAHDJaFd4FIf5QuB+CygLPvYz5bhyOwnJF/cAJDUgAk6g74AVQskw80g1m/k5wJU9HqpoPzsMqnBmc8ENSEvQCAPsLRBQDFAuy+hfiMfieoCmAvI02EB1BrYpbNrWHAxyBtMZsA9ngMM93u8qZ/lt4Tan/laYIFXC2ANWOLjgiv9LH9AIBKPOc5qwKMT2tgAfxO3FxjlP1Fgu+CL8DZ/TogKvgn+DQWmAz4Bl3/nZuMD8B9iHRvM7sGhJwAAAABJRU5ErkJggg==","w":32,"h":30,"ms":[167,167,167,167,167,167]}},"current":{"day":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJAAAAADCAMAAABLanZnAAAACVBMVEWf0P8AAABPj+Bls/QCAAAAAnRSTlP/AOW3MEoAAAAtSURBVHjaY2BgYGBgxAEGQo4BiygjI24dhOUplENWxcTEhFMLQTkc8kykmgsASbgBn0uYOTEAAAAASUVORK5CYII=","w":24,"h":3,"ms":[167,167,167,167,167,167]},"dusk":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJAAAAADCAMAAABLanZnAAAACVBMVEXzw0oAAADQdF8FRLnbAAAAAnRSTlP/AOW3MEoAAAAtSURBVHjaY2BgYGBgxAEGQo4BiygjI24dhOUplENWxcTEhFMLQTkc8kykmgsASbgBn0uYOTEAAAAASUVORK5CYII=","w":24,"h":3,"ms":[167,167,167,167,167,167]},"night":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJAAAAADCAMAAABLanZnAAAACVBMVEUdKmsAAAAbJlJpI9UKAAAAAnRSTlP/AOW3MEoAAAAtSURBVHjaY2BgYGBgxAEGQo4BiygjI24dhOUplENWxcTEhFMLQTkc8kykmgsASbgBn0uYOTEAAAAASUVORK5CYII=","w":24,"h":3,"ms":[167,167,167,167,167,167]},"overcast":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJAAAAADCAMAAABLanZnAAAACVBMVEVPj+AAAAAvT7Mda6RWAAAAAnRSTlP/AOW3MEoAAAAtSURBVHjaY2BgYGBgxAEGQo4BiygjI24dhOUplENWxcTEhFMLQTkc8kykmgsASbgBn0uYOTEAAAAASUVORK5CYII=","w":24,"h":3,"ms":[167,167,167,167,167,167]}},"current_b":{"day":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJAAAAADCAMAAABLanZnAAAACVBMVEUAAACf0P9Pj+BfdJj/AAAAAXRSTlMAQObYZgAAACpJREFUeNpjYEAGjIyMjAw4AFSOEYccMXqJlWNiYsKlmnZyOORx6xooAABCSwA9rvE5mgAAAABJRU5ErkJggg==","w":24,"h":3,"ms":[167,167,167,167,167,167]},"dusk":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJAAAAADCAMAAABLanZnAAAACVBMVEUAAADzw0rQdF93d22CAAAAAXRSTlMAQObYZgAAACpJREFUeNpjYEAGjIyMjAw4AFSOEYccMXqJlWNiYsKlmnZyOORx6xooAABCSwA9rvE5mgAAAABJRU5ErkJggg==","w":24,"h":3,"ms":[167,167,167,167,167,167]},"night":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJAAAAADCAMAAABLanZnAAAACVBMVEUAAAAdKmsbJlINtUBPAAAAAXRSTlMAQObYZgAAACpJREFUeNpjYEAGjIyMjAw4AFSOEYccMXqJlWNiYsKlmnZyOORx6xooAABCSwA9rvE5mgAAAABJRU5ErkJggg==","w":24,"h":3,"ms":[167,167,167,167,167,167]},"overcast":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJAAAAADCAMAAABLanZnAAAACVBMVEUAAABPj+AvT7OOPIcjAAAAAXRSTlMAQObYZgAAACpJREFUeNpjYEAGjIyMjAw4AFSOEYccMXqJlWNiYsKlmnZyOORx6xooAABCSwA9rvE5mgAAAABJRU5ErkJggg==","w":24,"h":3,"ms":[167,167,167,167,167,167]}},"foam":{"day":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAGCAMAAACcusyXAAAADFBMVEUAAACf0P/7+/9Pj+BNjaQzAAAAAXRSTlMAQObYZgAAACtJREFUeNpjYCAeMBIQY0JlMaKLMCKrZ4QxMUVggozomlFFGBgYmOEasLMAC/MAJxRlCBIAAAAASUVORK5CYII=","w":9,"h":6,"ms":[167,167,167,167]},"dusk":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAGCAMAAACcusyXAAAADFBMVEUAAADzw0r/8KjQdF+X4a32AAAAAXRSTlMAQObYZgAAACtJREFUeNpjYCAeMBIQY0JlMaKLMCKrZ4QxMUVggozomlFFGBgYmOEasLMAC/MAJxRlCBIAAAAASUVORK5CYII=","w":9,"h":6,"ms":[167,167,167,167]},"night":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAGCAMAAACcusyXAAAADFBMVEUAAAAdKmsvT7MbJlL8N5JTAAAAAXRSTlMAQObYZgAAACtJREFUeNpjYCAeMBIQY0JlMaKLMCKrZ4QxMUVggozomlFFGBgYmOEasLMAC/MAJxRlCBIAAAAASUVORK5CYII=","w":9,"h":6,"ms":[167,167,167,167]},"overcast":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAGCAMAAACcusyXAAAADFBMVEUAAABPj+Cf0P8vT7MQIac+AAAAAXRSTlMAQObYZgAAACtJREFUeNpjYCAeMBIQY0JlMaKLMCKrZ4QxMUVggozomlFFGBgYmOEasLMAC/MAJxRlCBIAAAAASUVORK5CYII=","w":9,"h":6,"ms":[167,167,167,167]}},"fall":{"day":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAMCAMAAAATZM5jAAAADFBMVEUAAAD7+/9Pj+Cf0P9QzyNgAAAAAXRSTlMAQObYZgAAAF5JREFUeNqVkNsKwDAIQxPz//88bGTzYYKVUiQ5XhAAg6KIjJDynVw2nNvAGqINrCH3rAkbSDawhvraK4g2sIZ+r6QGsUGp+/JxdLeoRu2f9DerBdmsQVcr/kbO+mU8J7gCMlqkrbYAAAAASUVORK5CYII=","w":12,"h":12,"ms":[125,125,125,125]},"dusk":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAMCAMAAAATZM5jAAAADFBMVEUAAAD/8KjQdF/zw0q71xbAAAAAAXRSTlMAQObYZgAAAF5JREFUeNqVkNsKwDAIQxPz//88bGTzYYKVUiQ5XhAAg6KIjJDynVw2nNvAGqINrCH3rAkbSDawhvraK4g2sIZ+r6QGsUGp+/JxdLeoRu2f9DerBdmsQVcr/kbO+mU8J7gCMlqkrbYAAAAASUVORK5CYII=","w":12,"h":12,"ms":[125,125,125,125]},"night":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAMCAMAAAATZM5jAAAADFBMVEUAAAAvT7MbJlIdKmtu4FSWAAAAAXRSTlMAQObYZgAAAF5JREFUeNqVkNsKwDAIQxPz//88bGTzYYKVUiQ5XhAAg6KIjJDynVw2nNvAGqINrCH3rAkbSDawhvraK4g2sIZ+r6QGsUGp+/JxdLeoRu2f9DerBdmsQVcr/kbO+mU8J7gCMlqkrbYAAAAASUVORK5CYII=","w":12,"h":12,"ms":[125,125,125,125]},"overcast":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAMCAMAAAATZM5jAAAADFBMVEUAAACf0P8vT7NPj+Dwp7NbAAAAAXRSTlMAQObYZgAAAF5JREFUeNqVkNsKwDAIQxPz//88bGTzYYKVUiQ5XhAAg6KIjJDynVw2nNvAGqINrCH3rAkbSDawhvraK4g2sIZ+r6QGsUGp+/JxdLeoRu2f9DerBdmsQVcr/kbO+mU8J7gCMlqkrbYAAAAASUVORK5CYII=","w":12,"h":12,"ms":[125,125,125,125]}},"glint":{"day":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAAAFCAMAAADyrgsSAAAACVBMVEUAAACf0P/7+/9beH80AAAAAXRSTlMAQObYZgAAAB1JREFUeNpjYBgigBFOUNtURiZGKEEb86lvKiYAAAxOAA9TZNATAAAAAElFTkSuQmCC","w":5,"h":5,"ms":[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100]},"dusk":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAAAFCAMAAADyrgsSAAAACVBMVEUAAADzw0r/8Kg4UFavAAAAAXRSTlMAQObYZgAAAB1JREFUeNpjYBgigBFOUNtURiZGKEEb86lvKiYAAAxOAA9TZNATAAAAAElFTkSuQmCC","w":5,"h":5,"ms":[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100]},"night":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAAAFCAMAAADyrgsSAAAACVBMVEUAAAAdKmsvT7NN5Q8DAAAAAXRSTlMAQObYZgAAAB1JREFUeNpjYBgigBFOUNtURiZGKEEb86lvKiYAAAxOAA9TZNATAAAAAElFTkSuQmCC","w":5,"h":5,"ms":[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100]},"overcast":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAAAFCAMAAADyrgsSAAAACVBMVEUAAABPj+Cf0P/C0eJdAAAAAXRSTlMAQObYZgAAAB1JREFUeNpjYBgigBFOUNtURiZGKEEb86lvKiYAAAxOAA9TZNATAAAAAElFTkSuQmCC","w":5,"h":5,"ms":[100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100,100]}},"bfly_white":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAFCAMAAABhCnz1AAAADFBMVEUAAAAaFCP7+//T4PIWFYZ7AAAAAXRSTlMAQObYZgAAADJJREFUeNp9jEEKACAMw9Lu/3+WTlHYQSgJW6EgJSBCLvtnJ8jyvg/jb4lK1e7xoWemFh0ZAFyNIRFFAAAAAElFTkSuQmCC","w":7,"h":5,"ms":[100,100,100,100]}},"bfly_yellow":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAFCAMAAABhCnz1AAAADFBMVEUAAAAaFCP/8Kjzw0rv0MhYAAAAAXRSTlMAQObYZgAAADJJREFUeNp9jEEKACAMw9Lu/3+WTlHYQSgJW6EgJSBCLvtnJ8jyvg/jb4lK1e7xoWemFh0ZAFyNIRFFAAAAAElFTkSuQmCC","w":7,"h":5,"ms":[100,100,100,100]}},"bfly_blue":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAFCAMAAABhCnz1AAAADFBMVEUAAAAaFCOf0P9Pj+DWtJKWAAAAAXRSTlMAQObYZgAAADJJREFUeNp9jEEKACAMw9Lu/3+WTlHYQSgJW6EgJSBCLvtnJ8jyvg/jb4lK1e7xoWemFh0ZAFyNIRFFAAAAAElFTkSuQmCC","w":7,"h":5,"ms":[100,100,100,100]}},"glow":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFCAMAAABl/6zIAAAADFBMVEUAAABarkWl11r/8Kjf/GFGAAAAAXRSTlMAQObYZgAAACtJREFUeNpjYEAHjAy4ABNIlokRykJWDuIzMTMxMDIxMzGCWShqcOvGZzcADiQAL7vFcXsAAAAASUVORK5CYII=","w":5,"h":5,"ms":[600,100,100,200,100,100]}},"glow_blue":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFCAMAAABl/6zIAAAADFBMVEUAAABPj+Cf0P/7+/9lYlzVAAAAAXRSTlMAQObYZgAAACtJREFUeNpjYEAHjAy4ABNIlokRykJWDuIzMTMxMDIxMzGCWShqcOvGZzcADiQAL7vFcXsAAAAASUVORK5CYII=","w":5,"h":5,"ms":[600,100,100,200,100,100]}},"bird":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAECAMAAACqVq9QAAAACVBMVEUvLTwAAAAaFCNO45ySAAAAAnRSTlP/AOW3MEoAAAAsSURBVHjaY2BgBAEICQZMCCYDWJyBkYEBgiECUB6MC9PCADOGCcpAMQjZEgAUgQBdMWdehgAAAABJRU5ErkJggg==","w":7,"h":4,"ms":[100,100,100,100]}},"cloud_a":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG4AAAAuCAMAAAD+3dylAAAABlBMVEUAAAAaFCM4HzlOAAAAAXRSTlMAQObYZgAAAGtJREFUeNrt2DkOwDAIBdHP/S+dKl2E2NPM1LaeJVcgvdl3Wsj8TrE86F21WL2nZ7UQGLhumXp/kuYcP3jcToODg4ODg4ODg4ODg/uP0+UIpMJEOTAK6tLaJ8sLj0FtC+xtdAa1eXBiZVXHHukzEafORsmjAAAAAElFTkSuQmCC","w":110,"h":46}},"cloud_b":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAiCAMAAAD/Ja5VAAAABlBMVEUAAAAaFCM4HzlOAAAAAXRSTlMAQObYZgAAAExJREFUeNrt1iESADAIA0Hy/0/XVFQwmZTGNedZJFRJgVe3AVYRSrqheUzEMK/WiHjPih0mrJm5gAEDBgwY8CNwfJfbMfo50FXdk7ZbIVsJlQskYPAAAAAASUVORK5CYII=","w":80,"h":34}},"pollen":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAMAAAAoyzS7AAAAA1BMVEX/8KjVU8NQAAAACklEQVR42mNgAAAAAgAB5Sfe/AAAAABJRU5ErkJggg==","w":1,"h":1}},"fluff":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAADCAMAAABh9kWNAAAACVBMVEUAAAD7+//T4PKf1YwSAAAAAXRSTlMAQObYZgAAABFJREFUeNpjYGBkYGBkAhEMAAAwAAenw4+3AAAAAElFTkSuQmCC","w":3,"h":3}},"gold":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAMAAAAoyzS7AAAAA1BMVEXzw0pmJtxQAAAACklEQVR42mNgAAAAAgAB5Sfe/AAAAABJRU5ErkJggg==","w":1,"h":1}}},"effects":{"day":[{"type":"butterflies","sprites":["bfly_white","bfly_yellow","bfly_blue"],"plane":"ground","count":5,"anchors":[[258,122],[82,106],[105,92],[57,126],[93,136],[233,88],[221,108],[289,132]],"after":"ground"},{"type":"motes","sprites":["fluff","pollen","pollen"],"count":12,"area":[0,30,320,150],"wind":[4,9],"after":"front"},{"type":"shadows","sprites":["cloud_a","cloud_b"],"count":1,"every":[12000,22000],"speed":[5,8],"alpha":0.16,"y":[-60,120],"after":"front"},{"type":"birds","sprite":"bird","every":[16000,30000],"count":[2,4],"y":[6,40],"speed":[18,26],"factor":0,"after":"front"}],"dusk":[{"type":"motes","sprites":["gold"],"count":18,"area":[0,30,320,150],"wind":[1,4],"fall":[-2,1],"after":"front"},{"type":"birds","sprite":"bird","every":[12000,24000],"count":[3,5],"y":[6,40],"speed":[16,22],"factor":0,"after":"front"}],"night":[{"type":"fireflies","sprites":["glow","glow","glow_blue"],"plane":"ground","count":18,"area":[0,36,320,120],"front":0.3,"after":"ground"}],"overcast":[{"type":"motes","sprites":["fluff"],"count":6,"area":[0,20,320,160],"wind":[14,24],"fall":[0,3],"after":"front"}]},"speed":{"overcast":2}};

/** Crée la scène « Gué du ruisseau ». Voir les options en tête du fichier. */
export function createScene(opts = {}) {
  return createSceneFrom(SCENE, opts);
}

export default createScene;
