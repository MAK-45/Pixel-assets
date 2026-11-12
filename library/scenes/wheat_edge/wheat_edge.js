// wheat_edge.js — GÉNÉRÉ par pixel-assets (scripts/build.js), ne pas modifier.
// Scène « Lisière du champ de blé » (scenes/wheat_edge) — statique : un écran fixe.
// Base 320×180 px, ligne de sol y = 140, périodes : day (Jour), dusk (Crépuscule), night (Nuit), overcast (Sombre).
// Plans : backdrop ×0, ground ×0, front (devant) ×0.
//
//   import { createScene, fitCanvas } from "./wheat_edge.js";
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
export const SCENE = {"format":1,"id":"scenes/wheat_edge","title":"Lisière du champ de blé","type":"static","w":320,"h":180,"groundY":140,"defaultPeriod":"day","periods":[{"id":"day","label":"Jour"},{"id":"dusk","label":"Crépuscule"},{"id":"night","label":"Nuit"},{"id":"overcast","label":"Sombre"}],"planes":[{"id":"backdrop","label":"Bords (vue élargie)","factor":0,"y":-60,"images":{"day":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAADwCAMAAAAHDqWKAAAAIVBMVEXzw0r/8KjgeCqcazzJmlsaFCNqQSguejofSixarkWl11ohgnZRAAABsElEQVR42u1U6XLEIAgGYiL4/g/cEU9c3dimP7ozpVPjt3JfAM8IEQDTTU8iAMr3RrSSVnmo/KTyr0SGRsvpq5ZxsEczm/nAdKVy0NLNScBYbKeAJ6IvPmORx5yq4naN+d5+F3OSvk8y9knKDq/4Z3neLuY009jslyTTnigap4vZjTzDELDKRC9MsmjlcR+vloj2g8fBcVo4PvMZ0VomFb5PPtokJ4tEuyWqA4j9AO72xlBh2KzwE5+xqxPWrtr0GYc8U8nzbqqwa8nl6K+FcRAm2p3B7ycZTCtiWxe0NcU4DIOdLduPdAC5duLh0B3lBHf0fzvwjNRB51yCV6TTHdcZL3Bmxku/cERSGC83zE9kfSSF8TKHkRqstITcQx5eeS3LDXIGTRX78iPkL7P+DPFFOGSOpEpYmSTJxlfVIAkKG7tyG9FHQPEhwtCw9yBPVHmjyvDKWlUU7l/FDzAYWZHPTvsCcg95gGyZzTN4fqfqxq6p9171JbUMSPDdOPywc/7hH4FcIOd/6FYsT1buZF2Pr/w7TkpsMe26tJ+ldt37VZC3tw+iKkLd3uLrqm/0BYKGMvQUJOt3AAAAAElFTkSuQmCC","w":14,"h":240,"fill":"#f3c34a"},"dusk":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAADwCAMAAAAHDqWKAAAAGFBMVEXgeCrzw0qyOiyPT1/QdF8aFCM7K0teOloD7hYKAAABqUlEQVR42u1UV3IDIQxVW3H/G2ckqjB4STYf8UyUCcsz6g3gGSECYL75SQRA5d6JdtIuD42fXP6VKNBsOX/dMk72aGWzHJivVA/aurkIGKvtHPBC9MVnrPJYUlXdbjHf2x9iztL3ScYxScXhHf8qz8fFXGYau/2aZDoTxeB0NXuQZ5gCdhnzIiSLdh6P8XqJ6Dx4nBynjeMrnxGjZXLh++RjTHK2SHRaojaAOA7gaW9MFYbDCj/xGYc6YeuqQ59xyjPVPJ+mCoeW3I7+XhgnYaLTGfx+kiG0IvZ1QUdTjNMwxNmK/UgMJP1EFhSuJwiPfyfwMhqgiGSoRpewXnaBqzCqf4GNHNrlhvmJbDJyaJc1NOqw0RbqCHV61b2sdqgFdFWa6o9Qvqr+M9gLqxSOrIrVmTjL2qtr4AxZg12+jegjICcxKB2nBPxEVQqqAi/vVZnw+MppghJkmT877RuoI9QJamQOz5D0naobu6HeZ9Xn3DLAkoZx+GHn/MM/ArVCLf8wrFhdrNzFup5f9XecZGsx77q8n7l13ftVULZ3EnYV0rY3p7bqO30BIVkxYs6q4BsAAAAASUVORK5CYII=","w":14,"h":240,"fill":"#e0782a"},"night":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAADwCAMAAAAHDqWKAAAAD1BMVEUqR1I/ZGYdMkcaFCMUITp48i61AAABmUlEQVR42uVW2ZLDMAiTCP//zTsGX1A7caf70l136kQFDBbHFPhskQD9zXYRQOr7WLKzNnt0fTH71yVhZc/+NM9M/mTls270V2mbbMNcXJjNt194YfoSM5s9K1Ut7H7nZ//Tnd36mWTOJNWAd/orno+TuWSaw38jWc5MGYJubg94Rrqw2ZQoAlmyi3i+r6VIzi/PFLhsAl/FTEbPYsbP5DOS7B5FTlPUG5BzA57WRsowDjP8Scyc8sReVYcxM/EsjedTqjiV5Lb198ZMxiKnPfg+yQilyDEu5KiLmZoh9lasR+ew7yx9I323NhifA3iVNUEADrWsC6JXeXE9g/4sy6BRd6/8iW1SXsKyBhwJ3UGdoSap7m11QK1gHKXSfkR9qtrPKBIoq4YfBTUluG2R2glek4AGv3i80VfAUqG+DUlqwjePCpJ00v4o65QoipBIc+Grad9AnaEmqFE5iCF6d9SDX9wkaWNbSwZgaAr8waT8I6gNav1iGrG6GLmLcZ2l+jtB1r+EbPWKrnY/Cur0LvMDY4ygjadk+wM+TxC4y2fmtgAAAABJRU5ErkJggg==","w":14,"h":240,"fill":"#2a4752"},"overcast":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAADwCAMAAAAHDqWKAAAAHlBMVEXJmlvzw0qcazxqQSgaFCM7IhkrPDMbJyNBVkZic1qGtRarAAABrUlEQVR42u1U6XLEIAgGkgi+/wt3wBNXN7bpj+5M6dT4rdwXwDNCBMB0s5MIgPK9Ea2kTR4qP5n8K5Gj0XL6mmUc7NHMZj4wXakctHRzEjAW2yngieiLz1jkMaequF1jvrffxZyk75OMfZKywyv+WZ63iznNNDb7Jcm0J4rO6WJ2I88wBGwy6oVLFq087uO1EtF+8Dg4TgvHZz4jestkwvfJR5/kZJFot0R1ALEfwN3eGCoMmxV+4jN2dcLaVZs+45BnKnneTRV2Lbkc/bUwDsJEuzP4/SSDa0Vs64K2phiHYfCz5fuRDktjOfEgpKOcQEf/twNPpQ4SUYKX0knHdeoFzsx42RcOJYN6uWF+IhuUDOplDpUarLSE3EMeXnktyw1yBk0Vh/Ij5C+z/Qz6IhwzR1IlbEySZPXVNEiCws6u3Eb0EVBCVBgbDgHkiargVDleWatS4f5VwgCjkxX57LQvIPeQB8ie2T1D4Heqbuy6eu9VX1LLgMTQjcMPO+cf/hHIBXL+h27F8mTlTtb1+Mq/46Roi1nXpf0stever4K8vUMUUxHr9pZQV32jLwBsK8tnHPgOAAAAAElFTkSuQmCC","w":14,"h":240,"fill":"#c99a5b"}},"kind":"sky"},{"id":"ground","label":"Champ et pré","factor":0,"y":0,"images":{"day":{"src":"data:image/png;base64,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","w":320,"h":180},"dusk":{"src":"data:image/png;base64,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","w":320,"h":180},"night":{"src":"data:image/png;base64,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","w":320,"h":180},"overcast":{"src":"data:image/png;base64,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","w":320,"h":180}},"actors":[{"sprite":"wave","x":0,"y":0,"phase":0},{"sprite":"wave","x":30,"y":0,"phase":0},{"sprite":"wave","x":60,"y":0,"phase":0},{"sprite":"wave","x":90,"y":0,"phase":0},{"sprite":"wave","x":120,"y":0,"phase":0},{"sprite":"wave","x":180,"y":0,"phase":0},{"sprite":"wave","x":210,"y":0,"phase":0},{"sprite":"wave","x":240,"y":0,"phase":0},{"sprite":"wave","x":270,"y":0,"phase":0},{"sprite":"wave","x":300,"y":0,"phase":0},{"sprite":"wave","x":0,"y":12,"phase":520},{"sprite":"wave","x":30,"y":12,"phase":520},{"sprite":"wave","x":60,"y":12,"phase":520},{"sprite":"wave","x":90,"y":12,"phase":520},{"sprite":"wave","x":120,"y":12,"phase":520},{"sprite":"wave","x":180,"y":12,"phase":520},{"sprite":"wave","x":210,"y":12,"phase":520},{"sprite":"wave","x":240,"y":12,"phase":520},{"sprite":"wave","x":270,"y":12,"phase":520},{"sprite":"wave","x":300,"y":12,"phase":520},{"sprite":"wave","x":0,"y":24,"phase":40},{"sprite":"wave","x":30,"y":24,"phase":40},{"sprite":"wave","x":60,"y":24,"phase":40},{"sprite":"wave","x":90,"y":24,"phase":40},{"sprite":"wave","x":120,"y":24,"phase":40},{"sprite":"wave","x":180,"y":24,"phase":40},{"sprite":"wave","x":210,"y":24,"phase":40},{"sprite":"wave","x":240,"y":24,"phase":40},{"sprite":"wave","x":270,"y":24,"phase":40},{"sprite":"wave","x":300,"y":24,"phase":40},{"sprite":"wave","x":0,"y":36,"phase":560},{"sprite":"wave","x":30,"y":36,"phase":560},{"sprite":"wave","x":60,"y":36,"phase":560},{"sprite":"wave","x":90,"y":36,"phase":560},{"sprite":"wave","x":120,"y":36,"phase":560},{"sprite":"wave","x":180,"y":36,"phase":560},{"sprite":"wave","x":210,"y":36,"phase":560},{"sprite":"wave","x":240,"y":36,"phase":560},{"sprite":"wave","x":270,"y":36,"phase":560},{"sprite":"wave","x":300,"y":36,"phase":560},{"sprite":"grass","x":48,"y":140,"phase":0},{"sprite":"grass","x":116,"y":112,"phase":337,"flip":true},{"sprite":"grass","x":204,"y":120,"phase":674},{"sprite":"grass","x":270,"y":150,"phase":211,"flip":true},{"sprite":"grass","x":80,"y":160,"phase":548}]},{"id":"front","label":"Premier plan","factor":0,"y":0,"images":{"day":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAC0CAMAAADSOgUjAAAAJFBMVEUAAAAaFCMuejofSixarkWl11rkapr/s8/geCqyOixuHyTzw0razwcLAAAAAXRSTlMAQObYZgAAAUpJREFUeNrt1stug0AQRUHoaRgg//+/0TwEsrOxvIyqJG9YHt0GLwsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwj6ydDl/3i6Yo+HW/zFTw65tt/bZZ0CF/2G+v7WhHrIiSY4IO+dN+Zd9jr3UUjFEwojc8zvV9qYK9H2+bX+57ZrQ8/Xhbv77C8zrWl69LscnX8UXUn9pzZWkll7NXak/6DZ/XXWzNLRX80y+ijr2V+lMzl2sG7G/AZ3Lren+dFbz71Yg6j7Xtr9bclhGpPzyP0nutbX2Zs6cvy7O/ObTWrO2vVVu2ebsl4zrvDfaA84QVfAlYx6/0N2BkW+A81Z6xlONsI8zneRFwfoD7mGJ8RkqMW17y+SPdax3n1QJGxB3QW/DZX59Z1tj7u3DL/AUfqwXpRclprwAAAABJRU5ErkJggg==","w":320,"h":180},"dusk":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAC0CAMAAADSOgUjAAAAIVBMVEUAAAAaFCNeOlo7K0uPT1/QdF9uHyTkapqyOiwhGjPgeCpcACcmAAAAAXRSTlMAQObYZgAAAUhJREFUeNrt1stug0AQRUHoaWYg///B0TwEsrOxvIyqJG9YHt0GbxsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwj+yDDl/3i64o+HW/zFTw65vt/Y5V0CF/2K+2frQzVkTJOUGH/Gm/UmvU1mbBmAUjRsOz7u9LFez9ePv8stbM6HnG8fZ+Y4X1OveXr0uxydfxRbSfNnJl6SW3Oir1J+OG63UX2/NIBf/0i2hzb6X9tMztWgHHG/CZ3L7fX2cF734toq1j7ftrLY9tRhoP61lGr72vL3P19GV59reG1pv1/fVq27Fut2Rc9d7gCLhOWMGXgG3+yngDRvYFrlMdGUs5ax9hPs+LgOsDPMYU8zNSYt7yls8f6VHrrFcPGBF3QG/BZ39jZtmijnfhkfkLZ3EFyJ8Q34kAAAAASUVORK5CYII=","w":320,"h":180},"night":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAC0CAMAAADSOgUjAAAAFVBMVEUAAAAaFCMdMkcUIToqR1I/ZGYMEiQ7jRzZAAAAAXRSTlMAQObYZgAAAS9JREFUeNrt1kGOgzAMQFFiG+5/5JGTFNRRF6MuR+9JbYHll016HAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMA/MiYdvu4XLRX8ul9VKfj1zna/cxe0yH+euV7aFSsia42gRf5rv+xUVatgrIKxor4XdLh8XN4uVavgGMdc3nk7r64Yb6dLmsnfw7fGrao6Wxw5K82ecwKvu9iosxT8vLwx+7Xj2gFnvWfkxrhPZwXvfrV3t7+y+uI8VqT5MLtgZr/2xrpfbRV8zd8etG42D46ewPO1uxVX3jM4A+4VVvAt4D5Ccr4Bo47Vce9vZGZ/xqjneQq4D+A5TBHxWs/+Per5I71rXR0w4j6Y01vwmb/nFIkV7gcSTgUHnRvrgAAAAABJRU5ErkJggg==","w":320,"h":180},"overcast":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAAC0CAMAAADSOgUjAAAAHlBMVEUAAAAaFCMrPDMbJyNBVkZic1puHyTkapqcazzJmlt9NiChAAAAAXRSTlMAQObYZgAAAURJREFUeNrt1kGOgzAQRUFoNza5/4VHbiNQMptRlqMqKRuWT78h2wYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD8I3vR4et+MTUFv+6XmQp+fbOz33EVdMh/7NfHPNoVK6LlmqBD/mu/1nv0MVbBWAUjquHZ98+lCvZ5vHN+2XtmzDx1vLNfrbD3c3/7ujSbfB9fxHiNypVtltx6VZpP6oZ7v4vteaSCv/pFjLW3Nl4j8w5Yb8Bncvt+f50VvPuNiHEd69zfGHlsK1I97GerXvtcX+bV05fl2d81tNls7m9W247rdltG7/cGK+B1wgq+BRzr1+oNGDkXeJ1qZWzt7HOE+TxvAl4f4BpTrM9Ii3XLWz5/pKvW2StgRNwBvQWf/dXMckSvd+GR+QMCgQW1NmrEbwAAAABJRU5ErkJggg==","w":320,"h":180}},"front":true,"optional":true,"actors":[{"sprite":"tall","x":44,"y":156,"phase":0},{"sprite":"tall","x":256,"y":158,"phase":400,"flip":true}]}],"sprites":{"grass":{"day":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAANCAMAAAAucZheAAAAElBMVEUAAAAaFCOl11parkUuejofSiyqBYhCAAAAAXRSTlMAQObYZgAAAG5JREFUeNqd0FEKxTAIBVFHzf63/IiNpS8Ikvh3JuV+VCQO2a4L/APlG7uw0wjjTWCF/X3aFNypQ2MsDaMKvUFNY6/yHsr33MuBMxumNgf9xlHU3N2H5y84cpQnjHfxyEJwOj84swhj3aVFWHfjH0pqBXZSNapIAAAAAElFTkSuQmCC","w":16,"h":13,"ms":[200,200,200,200]},"dusk":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAANCAMAAAAucZheAAAAElBMVEUAAAAaFCPQdF+PT19eOlo7K0uynWkIAAAAAXRSTlMAQObYZgAAAG5JREFUeNqd0FEKxTAIBVFHzf63/IiNpS8Ikvh3JuV+VCQO2a4L/APlG7uw0wjjTWCF/X3aFNypQ2MsDaMKvUFNY6/yHsr33MuBMxumNgf9xlHU3N2H5y84cpQnjHfxyEJwOj84swhj3aVFWHfjH0pqBXZSNapIAAAAAElFTkSuQmCC","w":16,"h":13,"ms":[200,200,200,200]},"night":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAANCAMAAAAucZheAAAAElBMVEUAAAAaFCM/ZGYqR1IdMkcUITpbvjHCAAAAAXRSTlMAQObYZgAAAG5JREFUeNqd0FEKxTAIBVFHzf63/IiNpS8Ikvh3JuV+VCQO2a4L/APlG7uw0wjjTWCF/X3aFNypQ2MsDaMKvUFNY6/yHsr33MuBMxumNgf9xlHU3N2H5y84cpQnjHfxyEJwOj84swhj3aVFWHfjH0pqBXZSNapIAAAAAElFTkSuQmCC","w":16,"h":13,"ms":[200,200,200,200]},"overcast":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAANCAMAAAAucZheAAAAElBMVEUAAAAaFCNic1pBVkYrPDMbJyNB/WquAAAAAXRSTlMAQObYZgAAAG5JREFUeNqd0FEKxTAIBVFHzf63/IiNpS8Ikvh3JuV+VCQO2a4L/APlG7uw0wjjTWCF/X3aFNypQ2MsDaMKvUFNY6/yHsr33MuBMxumNgf9xlHU3N2H5y84cpQnjHfxyEJwOj84swhj3aVFWHfjH0pqBXZSNapIAAAAAElFTkSuQmCC","w":16,"h":13,"ms":[200,200,200,200]}},"tall":{"day":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAeCAMAAABNNuFqAAAAElBMVEUAAAAaFCMfSixarkUuejql11poSCvTAAAAAXRSTlMAQObYZgAAAi5JREFUeNrtVgluwyAQ9B78/8vVHmDAwJK0qZLIKKoc5mIARz2Oe9zjHvd4nwH/wlhT4BfugBDQ/oJRKPC4PnAvzghR9ssYz6IQiqHZgOcZGRmvYa5fomATiwLGWC2vZYwIx5IBD6AtrMYKew0PGjF88zKx7IxOIRRCY1FMa0axiPXr/AMIyMSUSZVVx8gHdbq5knTyJNSrccbYItav8zOsalN1BS7pwrgWmBLOiv7QLiHUR/YHMMgHAVg4qSuggEAyx6JL7WnbfEMYOQAbAZ3RFFjoo3xrkAsgQELdKhjE54ojgiZkB6RrATwLQPIv/QpH+jD/KHhSuZ01srb1d8/jkxgAYU0oC1DTlB3QJ7sCI0Kg38m3Aui4/EFk5POMzQC9oRJ0qjJQgh4+oT0zXhJkj+QmC78QIn2cj4mBWc6NWXEsuL/ViVEJ7A2VwP5DJ20TZIJsoFwHd7AVIifFoSGUBa71G/mJVa8FCKsC/qY1BiR7gez30Qq2CxgYeAHDJaFd4FIf5QuB+CygLPvYz5bhyOwnJF/cAJDUgAk6g74AVQskw80g1m/k5wJU9HqpoPzsMqnBmc8ENSEvQCAPsLRBQDFAuy+hfiMfieoCmAvI02EB1BrYpbNrWHAxyBtMZsA9ngMM93u8qZ/lt4Tan/laYIFXC2ANWOLjgiv9LH9AIBKPOc5qwKMT2tgAfxO3FxjlP1Fgu+CL8DZ/TogKvgn+DQWmAz4Bl3/nZuMD8B9iHRvM7sGhJwAAAABJRU5ErkJggg==","w":32,"h":30,"ms":[167,167,167,167,167,167]},"dusk":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAeCAMAAABNNuFqAAAAElBMVEUAAAAaFCM7K0uPT19eOlrQdF/M12w5AAAAAXRSTlMAQObYZgAAAi5JREFUeNrtVgluwyAQ9B78/8vVHmDAwJK0qZLIKKoc5mIARz2Oe9zjHvd4nwH/wlhT4BfugBDQ/oJRKPC4PnAvzghR9ssYz6IQiqHZgOcZGRmvYa5fomATiwLGWC2vZYwIx5IBD6AtrMYKew0PGjF88zKx7IxOIRRCY1FMa0axiPXr/AMIyMSUSZVVx8gHdbq5knTyJNSrccbYItav8zOsalN1BS7pwrgWmBLOiv7QLiHUR/YHMMgHAVg4qSuggEAyx6JL7WnbfEMYOQAbAZ3RFFjoo3xrkAsgQELdKhjE54ojgiZkB6RrATwLQPIv/QpH+jD/KHhSuZ01srb1d8/jkxgAYU0oC1DTlB3QJ7sCI0Kg38m3Aui4/EFk5POMzQC9oRJ0qjJQgh4+oT0zXhJkj+QmC78QIn2cj4mBWc6NWXEsuL/ViVEJ7A2VwP5DJ20TZIJsoFwHd7AVIifFoSGUBa71G/mJVa8FCKsC/qY1BiR7gez30Qq2CxgYeAHDJaFd4FIf5QuB+CygLPvYz5bhyOwnJF/cAJDUgAk6g74AVQskw80g1m/k5wJU9HqpoPzsMqnBmc8ENSEvQCAPsLRBQDFAuy+hfiMfieoCmAvI02EB1BrYpbNrWHAxyBtMZsA9ngMM93u8qZ/lt4Tan/laYIFXC2ANWOLjgiv9LH9AIBKPOc5qwKMT2tgAfxO3FxjlP1Fgu+CL8DZ/TogKvgn+DQWmAz4Bl3/nZuMD8B9iHRvM7sGhJwAAAABJRU5ErkJggg==","w":32,"h":30,"ms":[167,167,167,167,167,167]},"night":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAeCAMAAABNNuFqAAAAElBMVEUAAAAaFCMUIToqR1IdMkc/ZGbt4ZLBAAAAAXRSTlMAQObYZgAAAi5JREFUeNrtVgluwyAQ9B78/8vVHmDAwJK0qZLIKKoc5mIARz2Oe9zjHvd4nwH/wlhT4BfugBDQ/oJRKPC4PnAvzghR9ssYz6IQiqHZgOcZGRmvYa5fomATiwLGWC2vZYwIx5IBD6AtrMYKew0PGjF88zKx7IxOIRRCY1FMa0axiPXr/AMIyMSUSZVVx8gHdbq5knTyJNSrccbYItav8zOsalN1BS7pwrgWmBLOiv7QLiHUR/YHMMgHAVg4qSuggEAyx6JL7WnbfEMYOQAbAZ3RFFjoo3xrkAsgQELdKhjE54ojgiZkB6RrATwLQPIv/QpH+jD/KHhSuZ01srb1d8/jkxgAYU0oC1DTlB3QJ7sCI0Kg38m3Aui4/EFk5POMzQC9oRJ0qjJQgh4+oT0zXhJkj+QmC78QIn2cj4mBWc6NWXEsuL/ViVEJ7A2VwP5DJ20TZIJsoFwHd7AVIifFoSGUBa71G/mJVa8FCKsC/qY1BiR7gez30Qq2CxgYeAHDJaFd4FIf5QuB+CygLPvYz5bhyOwnJF/cAJDUgAk6g74AVQskw80g1m/k5wJU9HqpoPzsMqnBmc8ENSEvQCAPsLRBQDFAuy+hfiMfieoCmAvI02EB1BrYpbNrWHAxyBtMZsA9ngMM93u8qZ/lt4Tan/laYIFXC2ANWOLjgiv9LH9AIBKPOc5qwKMT2tgAfxO3FxjlP1Fgu+CL8DZ/TogKvgn+DQWmAz4Bl3/nZuMD8B9iHRvM7sGhJwAAAABJRU5ErkJggg==","w":32,"h":30,"ms":[167,167,167,167,167,167]},"overcast":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAeCAMAAABNNuFqAAAAElBMVEUAAAAaFCMbJyNBVkYrPDNic1qWC9MoAAAAAXRSTlMAQObYZgAAAi5JREFUeNrtVgluwyAQ9B78/8vVHmDAwJK0qZLIKKoc5mIARz2Oe9zjHvd4nwH/wlhT4BfugBDQ/oJRKPC4PnAvzghR9ssYz6IQiqHZgOcZGRmvYa5fomATiwLGWC2vZYwIx5IBD6AtrMYKew0PGjF88zKx7IxOIRRCY1FMa0axiPXr/AMIyMSUSZVVx8gHdbq5knTyJNSrccbYItav8zOsalN1BS7pwrgWmBLOiv7QLiHUR/YHMMgHAVg4qSuggEAyx6JL7WnbfEMYOQAbAZ3RFFjoo3xrkAsgQELdKhjE54ojgiZkB6RrATwLQPIv/QpH+jD/KHhSuZ01srb1d8/jkxgAYU0oC1DTlB3QJ7sCI0Kg38m3Aui4/EFk5POMzQC9oRJ0qjJQgh4+oT0zXhJkj+QmC78QIn2cj4mBWc6NWXEsuL/ViVEJ7A2VwP5DJ20TZIJsoFwHd7AVIifFoSGUBa71G/mJVa8FCKsC/qY1BiR7gez30Qq2CxgYeAHDJaFd4FIf5QuB+CygLPvYz5bhyOwnJF/cAJDUgAk6g74AVQskw80g1m/k5wJU9HqpoPzsMqnBmc8ENSEvQCAPsLRBQDFAuy+hfiMfieoCmAvI02EB1BrYpbNrWHAxyBtMZsA9ngMM93u8qZ/lt4Tan/laYIFXC2ANWOLjgiv9LH9AIBKPOc5qwKMT2tgAfxO3FxjlP1Fgu+CL8DZ/TogKvgn+DQWmAz4Bl3/nZuMD8B9iHRvM7sGhJwAAAABJRU5ErkJggg==","w":32,"h":30,"ms":[167,167,167,167,167,167]}},"wave":{"day":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAAAMCAMAAABr28DCAAAADFBMVEUAAAD7+///8Kjzw0r0DgMMAAAAAXRSTlMAQObYZgAAAGJJREFUeNrtlEEKACAQAlf7/5+jF4yx0CHWs2gLY1Wj0ehvSehIUgKbqEtZV1P2Qge/w64gB7pOCHXpDQZ4zLMue0Z5v2KiSMySFG+9/6n0GSKKHJAWjFiVeD6CNjllNnqpDTOCAIEsRJFkAAAAAElFTkSuQmCC","w":30,"h":12,"ms":[125,125,125,125,125,125,125,125]},"dusk":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAAAMCAMAAABr28DCAAAADFBMVEUAAADQdF/zw0rgeCqAzNv2AAAAAXRSTlMAQObYZgAAAGJJREFUeNrtlEEKACAQAlf7/5+jF4yx0CHWs2gLY1Wj0ehvSehIUgKbqEtZV1P2Qge/w64gB7pOCHXpDQZ4zLMue0Z5v2KiSMySFG+9/6n0GSKKHJAWjFiVeD6CNjllNnqpDTOCAIEsRJFkAAAAAElFTkSuQmCC","w":30,"h":12,"ms":[125,125,125,125,125,125,125,125]},"night":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAAAMCAMAAABr28DCAAAACVBMVEUAAAA/ZGYqR1ILNw/GAAAAAXRSTlMAQObYZgAAAF5JREFUeNrtlEEKADEIA53+/9H9wEIGhLKIOQdD7cSq1Wo1WxAdZoqwkbJwWe0Hn7wSxNrEnJAFOYtHGJyHyJ0ekKuvbomWZ4/sev+o9BlKFCFIMyUu4xkELb/432G6dVwAU4LZBp8AAAAASUVORK5CYII=","w":30,"h":12,"ms":[125,125,125,125,125,125,125,125]},"overcast":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAAAMCAMAAABr28DCAAAADFBMVEUAAADDwtTzw0rJmlvz32nBAAAAAXRSTlMAQObYZgAAAGJJREFUeNrtlEEKACAQAlf7/5+jF4yx0CHWs2gLY1Wj0ehvSehIUgKbqEtZV1P2Qge/w64gB7pOCHXpDQZ4zLMue0Z5v2KiSMySFG+9/6n0GSKKHJAWjFiVeD6CNjllNnqpDTOCAIEsRJFkAAAAAElFTkSuQmCC","w":30,"h":12,"ms":[125,125,125,125,125,125,125,125]}},"bfly_white":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAFCAMAAABhCnz1AAAADFBMVEUAAAAaFCP7+//T4PIWFYZ7AAAAAXRSTlMAQObYZgAAADJJREFUeNp9jEEKACAMw9Lu/3+WTlHYQSgJW6EgJSBCLvtnJ8jyvg/jb4lK1e7xoWemFh0ZAFyNIRFFAAAAAElFTkSuQmCC","w":7,"h":5,"ms":[100,100,100,100]}},"bfly_yellow":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAFCAMAAABhCnz1AAAADFBMVEUAAAAaFCP/8Kjzw0rv0MhYAAAAAXRSTlMAQObYZgAAADJJREFUeNp9jEEKACAMw9Lu/3+WTlHYQSgJW6EgJSBCLvtnJ8jyvg/jb4lK1e7xoWemFh0ZAFyNIRFFAAAAAElFTkSuQmCC","w":7,"h":5,"ms":[100,100,100,100]}},"bfly_monarch":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAFCAMAAABhCnz1AAAADFBMVEUAAAAaFCPgeCqyOizLYYSbAAAAAXRSTlMAQObYZgAAADJJREFUeNp9jEEKACAMw9Lu/3+WTlHYQSgJW6EgJSBCLvtnJ8jyvg/jb4lK1e7xoWemFh0ZAFyNIRFFAAAAAElFTkSuQmCC","w":7,"h":5,"ms":[100,100,100,100]}},"glow":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFCAMAAABl/6zIAAAADFBMVEUAAABarkWl11r/8Kjf/GFGAAAAAXRSTlMAQObYZgAAACtJREFUeNpjYEAHjAy4ABNIlokRykJWDuIzMTMxMDIxMzGCWShqcOvGZzcADiQAL7vFcXsAAAAASUVORK5CYII=","w":5,"h":5,"ms":[600,100,100,200,100,100]}},"glow_amber":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFCAMAAABl/6zIAAAADFBMVEUAAADgeCrzw0r/8KiglOXlAAAAAXRSTlMAQObYZgAAACtJREFUeNpjYEAHjAy4ABNIlokRykJWDuIzMTMxMDIxMzGCWShqcOvGZzcADiQAL7vFcXsAAAAASUVORK5CYII=","w":5,"h":5,"ms":[600,100,100,200,100,100]}},"bird":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAECAMAAACqVq9QAAAACVBMVEUvLTwAAAAaFCNO45ySAAAAAnRSTlP/AOW3MEoAAAAsSURBVHjaY2BgBAEICQZMCCYDWJyBkYEBgiECUB6MC9PCADOGCcpAMQjZEgAUgQBdMWdehgAAAABJRU5ErkJggg==","w":7,"h":4,"ms":[100,100,100,100]}},"cloud_a":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIIAAAA0CAMAAABxThCnAAAABlBMVEUAAAAaFCM4HzlOAAAAAXRSTlMAQObYZgAAAJRJREFUeNrt2DEWgDAMAtBw/0s7uOlgG2ip78Fe8nVLqmaC0dSiYCZ2wAoEOvELpAbAbQC8BnB5d+ydz/8dLI1r7hcC22Me/0DAFzvgNsAcOyCEEEIIIYQQQgghhBBC+BvhgEXmgGXOSyB3at7PrPXqayDzlv6CVgd1HVLct6gCxXGPKlBcGKkCxZmTqFCce/sdQy8ubNoVuLH/6dIAAAAASUVORK5CYII=","w":130,"h":52}},"cloud_b":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAAAoCAMAAAA2TQ8LAAAABlBMVEUAAAAaFCM4HzlOAAAAAXRSTlMAQObYZgAAAF1JREFUeNrtlzEKACAMA83/P+3YRbBRWxDu9uYKOjRjQB0K3oxoQzp7MSKX9HJH6dfrmQ6VUp0vIUCAAAECBAgQfHK3NFxeHddjpcJqALf57012I7F+olepzFeMjAkiowylo0vyYQAAAABJRU5ErkJggg==","w":96,"h":40}},"pollen":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAMAAAAoyzS7AAAAA1BMVEX/8KjVU8NQAAAACklEQVR42mNgAAAAAgAB5Sfe/AAAAABJRU5ErkJggg==","w":1,"h":1}},"fluff":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAADCAMAAABh9kWNAAAACVBMVEUAAAD7+//T4PKf1YwSAAAAAXRSTlMAQObYZgAAABFJREFUeNpjYGBkYGBkAhEMAAAwAAenw4+3AAAAAElFTkSuQmCC","w":3,"h":3}},"gold":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAMAAAAoyzS7AAAAA1BMVEXzw0pmJtxQAAAACklEQVR42mNgAAAAAgAB5Sfe/AAAAABJRU5ErkJggg==","w":1,"h":1}}},"effects":{"day":[{"type":"butterflies","sprites":["bfly_white","bfly_yellow","bfly_monarch"],"plane":"ground","count":6,"anchors":[[42,56],[64,54],[88,57],[10,82],[129,58],[46,108],[77,94],[91,118],[29,136],[233,132],[259,142]],"after":"ground"},{"type":"motes","sprites":["pollen","pollen","fluff"],"count":14,"area":[0,20,320,160],"wind":[4,9],"after":"front"},{"type":"shadows","sprites":["cloud_a","cloud_b"],"count":2,"every":[9000,16000],"speed":[6,10],"alpha":0.16,"y":[-60,120],"after":"front"},{"type":"birds","sprite":"bird","every":[14000,26000],"count":[3,6],"y":[6,50],"speed":[18,26],"factor":0,"after":"front"}],"dusk":[{"type":"motes","sprites":["gold"],"count":22,"area":[0,10,320,170],"wind":[1,4],"fall":[-2,1],"after":"front"},{"type":"birds","sprite":"bird","every":[10000,20000],"count":[4,7],"y":[6,40],"speed":[16,22],"factor":0,"after":"front"}],"night":[{"type":"fireflies","sprites":["glow","glow","glow_amber"],"plane":"ground","count":18,"area":[0,50,320,120],"front":0.3,"after":"ground"}],"overcast":[{"type":"motes","sprites":["fluff"],"count":8,"area":[0,20,320,160],"wind":[14,24],"fall":[0,3],"after":"front"}]},"speed":{"overcast":2}};

/** Crée la scène « Lisière du champ de blé ». Voir les options en tête du fichier. */
export function createScene(opts = {}) {
  return createSceneFrom(SCENE, opts);
}

export default createScene;
