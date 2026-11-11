// desert.js — GÉNÉRÉ par pixel-assets (scripts/build.js), ne pas modifier.
// Scène « Désert » (scenes/desert) — dynamique : parallaxe infinie, défilement dans les deux sens.
// Base 320×180 px, ligne de sol y = 150, périodes : day (Jour), dusk (Crépuscule), night (Nuit), overcast (Sombre (tempête de sable)).
// Plans : sky ×0, stars ×0, clouds ×0.05, far ×0.1, mid ×0.3, near ×0.6, ground ×1, front (devant) ×1.3.
//
//   import { createScene, fitCanvas } from "./desert.js";
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
          const x = wrapX(px, off, W, v.width, f.img.w);
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
          const x = wrapX(px, off, W, v.width, f.img.w);
          blit(ctx, f.img, frameAt(f.img, f.t), x - f.img.w / 2, plane.y + py + v.dy - f.img.h / 2);
        }
      },
      hasFront: (cfg.front ?? 0) > 0,
    };
  },

  // De temps en temps, un objet traverse un plan au ras du sol (virevoltant qui roule en rebondissant,
  // bestiole qui marche) et défile avec lui. Le sprite regarde vers la droite ; vers la gauche, il est
  // retourné. cfg.y = ligne du sol dans le plan ; hop = hauteur des rebonds ; bounce = durée d'un rebond.
  crossing(cfg, S) {
    const r = S.random, plane = S.plane(cfg.plane), factor = plane.factor;
    const imgs = (cfg.sprites ?? [cfg.sprite]).map((n) => S.sprite(n));
    const live = [];
    let wait = between(r, cfg.every ?? [8000, 16000]) * (0.1 + 0.4 * r());
    return {
      update(dt, dCam) {
        wait -= dt * S.frequency;
        if (wait <= 0) {
          wait = between(r, cfg.every ?? [8000, 16000]);
          const dir = cfg.dir ?? (r() < 0.5 ? -1 : 1), n = Math.round(between(r, cfg.count ?? [1, 1]));
          for (let i = 0, gap = 0; i < n; i++, gap += between(r, [24, 70])) {
            const img = pick(r, imgs);
            live.push({ img, dir, x: dir > 0 ? -img.w - gap : S.view.width + gap, t: r() * img.loop, p: r(),
              speed: between(r, cfg.speed ?? [20, 40]), hop: between(r, cfg.hop ?? [0, 0]), bounce: between(r, cfg.bounce ?? [500, 700]) });
          }
        }
        for (let i = live.length - 1; i >= 0; i--) {
          const s = live[i];
          s.t += dt;
          s.x += s.dir * s.speed * dt / 1000 - dCam * factor;
          const out = s.dir > 0 ? s.x > S.view.width + 80 : s.x + s.img.w < -80;
          if (out || Math.abs(s.x) > S.view.width * 4) live.splice(i, 1);
        }
      },
      draw(ctx, v) {
        for (const s of live) {
          // rebonds qui s'amortissent puis repartent (une grande, deux petites)
          const k = s.t / s.bounce + s.p, amp = [1, 0.45, 0.25][Math.floor(k) % 3];
          const h = Math.round(s.hop * amp * Math.abs(Math.sin(k * Math.PI)));
          blit(ctx, s.img, frameAt(s.img, s.t), Math.round(s.x), plane.y + (cfg.y ?? 0) - s.img.h - h + v.dy, s.dir < 0);
        }
      },
    };
  },
};

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
      blit(ctx, img, frameAt(img, time), Math.round((v.width - img.w) / 2), y);
      return;
    }
    const off = Math.round(camX * p.factor + (time / 1000) * (p.driftBy?.[st.id] ?? p.drift ?? 0));
    const x0 = -mod(off, img.w);
    for (let x = x0; x < v.width; x += img.w) blit(ctx, img, frameAt(img, time), x, y);
    // acteurs animés (herbe au vent…) posés sur la bande, désynchronisés
    if (p.actors) {
      const t = time * speedOf(st.id);
      for (const a of p.actors) {
        const s = sprites[a.sprite];
        const ai = s && (s[st.id] ?? s["*"]);
        if (!ai) continue;
        const ax = wrapX(a.x, off, img.w, v.width, ai.w);
        if (ax > -ai.w && ax < v.width) blit(ctx, ai, frameAt(ai, t + (a.phase ?? 0)), ax, y + a.y, !!a.flip);
      }
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
export const SCENE = {"format":1,"id":"scenes/desert","title":"Désert","type":"parallax","w":320,"h":180,"groundY":150,"defaultPeriod":"day","periods":[{"id":"day","label":"Jour"},{"id":"dusk","label":"Crépuscule"},{"id":"night","label":"Nuit"},{"id":"overcast","label":"Sombre (tempête de sable)"}],"planes":[{"id":"sky","label":"Ciel","factor":0,"y":0,"images":{"day":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAC0CAMAAACe2Z23AAAADFBMVEUvT7NPj+Cf0P/T4PLOb2UwAAAAU0lEQVR42u3KQQrAMAwDQUv6/59LsUpIEIXeerCNYTOk6mcD35vBuyqIJwrwXMtEDALgIb1JXEk8Ucj7lkzEEEkd0pvElcRTEqVN+q3tz8TE17gAkyUKsUa3w+YAAAAASUVORK5CYII=","w":8,"h":180,"fill":"#2f4fb3"},"dusk":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAC0CAMAAACe2Z23AAAAD1BMVEU/H2N6P7DkaprgeCrzw0oTW70HAAAAX0lEQVR42u2JQQ4AIQgDS8v/37xBSFCz5z24tmkcB+DDWG022b62aTaLYf6P/AFosTa0LOrlm6mANHIzh4EYayNmUa/eTAUSpc0cDq4s5FJsMaNwd8UWMwLVrc2FCys8jWsOQdWAvTsAAAAASUVORK5CYII=","w":8,"h":180,"fill":"#3f1f63"},"night":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAC0CAMAAACe2Z23AAAADFBMVEUHChwPFjQbJlIdKmtAbDrJAAAAU0lEQVR42u3KQQrAMAwDQUv6/59LsUpIEIXeerCNYTOk6mcD35vBuyqIJwrwXMtEDALgIb1JXEk8Ucj7lkzEEEkd0pvElcRTEqVN+q3tz8TE17gAkyUKsUa3w+YAAAAASUVORK5CYII=","w":8,"h":180,"fill":"#070a1c"},"overcast":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAC0CAMAAACe2Z23AAAACVBMVEVqQSicazzJmluEmccsAAAAQklEQVR42u2KMQoAMAgDTf7/6A6mFIsUujkkIXAeRgwLtJeDeqgxSmuAvTQGw3AgAF4m2xlRZ5QgQRaTN8uPwfALC2zaByFbZMt1AAAAAElFTkSuQmCC","w":8,"h":180,"fill":"#6a4128"}},"kind":"sky","body":{"x":30,"y":12,"images":{"day":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAABwCAMAAADxPgR5AAAAD1BMVEUAAAAaFCPzw0r/8KjgeCoZ3VjFAAAAAXRSTlMAQObYZgAAANVJREFUeNrtl0EOwyAMBFmX/7+5AhIKUXrrulI784HJ2lh2SvkyUrIvQgg/2TpFnEZvM/XSDJHMUXUEk4ZxSWozasTqJiX08ox1KMcXuB/oozGNSb5DWFWyhDOiuYOKXdgiyjb0Ct0IVWWZ/jFzUxiLsFZHL6ewK8MvnCXdMJZ0PprN53w0S2XXgAmb8BIw0dh8bmNrWT1148WY4/X1VDvqI+He+PsCdo3g29tJ9ogq202TdRHbS3lnTD6Ef16Y/vcEAAAAAAAAAAAAAAAAAAAAAPDXPAEMbANQXF7hJwAAAABJRU5ErkJggg==","w":112,"h":112},"dusk":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAABwCAMAAADxPgR5AAAAD1BMVEUAAAAaFCPgeCrzw0qyOiwlm1mXAAAAAXRSTlMAQObYZgAAAIhJREFUeNrt1kEOgzAMRUHicP8zV4IiUZStP1I1c4G3iR1vGwAAAAAAAAAAAGvjlMvVKZMcY845c8kjd0+meqHirXcF95EKzkDwp3cFO4vp4KhlsK/4QrAWr/TPgvXstQe/yapc8GHvnYtVsHPw08FVsXl5p4OLYvsPHO7dTqjkGRXNvXCXcvgAT28EVinAQpAAAAAASUVORK5CYII=","w":112,"h":112},"night":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAABwCAMAAADxPgR5AAAAElBMVEUAAAAaFCP7+//DwtSLiqNXVnAv+wMYAAAAAXRSTlMAQObYZgAAAJVJREFUeNrt11sKg1AMAFHzuPvfcgmoiP+dC+2cDQyJCvE49opB5jIzK9hcY72p1U/3akMPC9K9bQOCwUKDM2A3HFyJBote6f8EFxlcVb2YYtwbXdSIV7ESHnEWSxcbOaIeQejbeBWBKeN8go9mgDNOsr+92mi2N4dw912DXtboU3DnfsD/M5IkSZIkSZIkSZIkSZJAH1c0A8RSeRl4AAAAAElFTkSuQmCC","w":112,"h":112}}}},{"id":"stars","label":"Étoiles","factor":0,"y":0,"images":{"dusk":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAABuCAMAAABhnzpqAAAADFBMVEUAAAD7+//T4PKPo8frL7sLAAAAAXRSTlMAQObYZgAAAHBJREFUeNrt2IENgDAIAMFC99+5U9AAuZvAvorBc4CZov0V5voTFveL/JV6a8GC1NQ8gVdDaPphDNUBgI4rhChuzRK2YS89WgIwnB+ogElkNQfzw1nMaqkBAAAAAAAAAAAAAAAAAAAAAAAAAAAAgIEelmAAMIlgLeUAAAAASUVORK5CYII=","w":320,"h":110},"night":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAABuCAMAAABhnzpqAAAADFBMVEUAAAD7+//T4PKPo8frL7sLAAAAAXRSTlMAQObYZgAAAe5JREFUeNrtnUtywzAMQ03y/nfutplM08jWByQftnEdCwRBSJ5Jr0sQ9uSPfeRa80scn7mIJ7eOCZz4lprmgl+AqoBTE4CVNuut9BzeziGepkaLi+u6NUrQodbBJVgSww4ACQQU4LZU7s/P50wK5g3jf7qEV59Ox+T71fQSWhsAIlZGmsTD/wlrrbUfUl+NPX70lD5hMg7w6TS5sQX7vgKA1kmC7QOEQDD4XZ4qE4V3CyWnJAZSPJOoDxVTf0AMmq4BgNkGxvl7PZFjcKFAUgIAcxK97WoIERfCDL9lyb4Zx4W31avU4qXos5HwllMER58Kv9rAE5sKhAuo/mOvqG0k2GTpYwVDZa1lTnv/P81s/VcUdJjcv9Egmqe8X8eiomeU0IfyCjTeMD2NJZ0OqA+p3xTayPN3++lA5SkeM2a3mb+u3Ee/n8ST1fIMnslwYkWaZS+xSUvsIrYrkObP56KxXhYVFOSi92K6wX2+LZ01LqdLrcnqTXKCn0RX1QmDxFrZevAOQlXBsexioM9eNsssnxh87XoHM5eXJfbGxfb2EXbYLHYFPIDh1j/4izq+ak2dt9AcW9wOFOiptZoYkUI07H1B4BRT2GgX/odRmZ6XUyDbxyJFjR1PGE0LeM/42qSqL+gpzUWsVyAAAGTBD4iUAcoiTfd2AAAAAElFTkSuQmCC","w":320,"h":110}}},{"id":"clouds","label":"Nuages","factor":0.05,"y":4,"images":{"day":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA8AAAABACAMAAADiUO7sAAAAD1BMVEUAAAAaFCPT4PL7+/+Po8e6KPQEAAAAAXRSTlMAQObYZgAAAyJJREFUeNrt3OFyqyAQhuEsev/X3FFAwZgUCYruvs8Pc5xpO6eGLyyw09cLQEImPAbgmfF1w+AcCQYeGV83DCQYbYcVBd5FD3qafX2ARx4y2iRXxPnIyjzEJgyucwPMM0abek7kJb6ik/lOKPBOzW+CKRg/Dicf1SGUdH5iGMLtPQppZfU8AUa74jkmN0Q2uc55noo86ZxEbfW8jCkCjF+K5yy5S3SHJNbtslOXxLhjqzTBBBjVedpOvbsvzcq8upW1LP9FPWW0JBiHN3tfHpXfNatup5KOL02iI7KurA99l1sreoY7Ti1IH7VzKy5NbhTv4nVO8++/lUiSw/Igzt+V1PXsi5ucCeWa+D7s7CXbDJ23q+J1x49VtKQhLH9Ia+ojAmxibRf3St47FE5dTz6ruSY/zRjH0V/83TbOvwZ4k8OyBMvo3GZrjQCbyG/Y8xDfmODmN37J8akBftCBR36aMcpy2dUswAc+5qYAu1Dmq9uKxqfieW1DmP4RPsSHmOMrZjPp9atLTYJ9cmX+AS8Jd0GzAC/r7ZDI8gDnCLDybaS57ht2uhJijs8ppPsHuOaMNZxj5MnP7lqddkjVolrGkQAbrJ033Qj5yzmFdPfmmpt3L78FuOwhSeNKHvde0zn3X1OCr+LOTvDlo6zujLXferv4Ga0FPfk1UT9nDQgfWxROSXC/5prKM9YeCV6yKAcea1ruQ3X9vNeGsGlR0LeXWXnGevmnTJZFBuwd3o/0/gb184cWhJ0OBV0BrjpjhfX57vJeieIA580IWYeC8gDzd1pQXq9e3StxcJfkW4OCwhL66BkrLBfPPXoligOcdSFsGhQ07mVK68ZlqI5vr16Jok2Sty6E/AtU7mVWnrHCcu3coVcCxasHnj4+jZWOvRL4nuDDZ6ywdrbcuVcCX5cPO8sG/DOcbR262e2VgM7ZyNaxueFeCSicjcwdmxvulYDaABsaq4Z7JaBwOWju3NxwrwQIsIplv9VeCeguJxmuwIMTTICBx9aT1IsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8Eh/OlEXpHNKbFgAAAAASUVORK5CYII=","w":960,"h":64},"dusk":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA8AAAABACAMAAADiUO7sAAAAD1BMVEUAAAAaFCPkapr/s896P7ApefsCAAAAAXRSTlMAQObYZgAAA3hJREFUeNrtneGSqyAMRhvw/Z/5jiKKGDt7R6wJnPPDrTs7HdvN0XwVyucDAAAAAAAAAAAAAAAAAAAADpHy8QxvCYAXc0VCUnbeSJjBYAD7+i7mSowxhPm6O29CTLu8OwDG/U2qxqTstGwXf7PQvEUAZpvnbO6qbLFdfJ4baRQGsNo8H8zd1I2F1nTSACb9DfWlV/0RwoTBABb93V0NSiedf9BFA1gVeN1m8l7eLjbTRQPYE7hkKrYKdNEAhgWepmlKm7RX64zAAMYEng7ItlFBYICbxj1jcDJXluHPH1n3VhAYoI1taYxj6+eUbO7hl9VfMB4L4HZgXT4R9iISwgOc/I0xejDjiW6B8wn4bZ53fz1cg63NZbJ3PoGxLr4hFGOUzRss20hqsfIGukof0GnzvHshtg+4PNL3j9VX+hi3zkfxdxmnLB78XQdovnms7tLHuCmx05Aj00lg0xcT0RoG0geMGnKuBDb6WuU0pfhNg92lj+FTovT42nSBTRos+qG+NIrLXfoYtHnuOeSUry1UX5khBo/WksDe0seoF9+eQ85ag6GcrxvMXkrkqlkIpgQmCBsumc5CjlxOzzX4pc1y6FT3b/d4q9/3lT7wt8eQUwh8nK9rVeDq2z1C+s0rTbSv9DGmv92HHKlm65qeoCtfuoXfH6yv9IHAnYacfXLup56hazECX3YL7wjsJn2M20F3H3LOYxHNzs9VeoQX2wVX6WP4BPybkMPifX80eDvHbC2DvHk6aZ0+mr6YupBkoHL5Wchh8b7/KEa1ZegnfTQetbsX0rnIBhD4JyGHxftIH3Xb1+o/vz1dKqu0K7vHgwj8aMhh8T5QYps0OcHslTQ/yB/KZo8HSVxP3mJh8T7QhLt/DZ6fK+y3UQ6FlT3uvJF+/hYLi/dBlVZb3ayU41pUUV1arvdG+ulbLCzeB0rz3GLU7jaE4Wt5BQZu3/WXxftA9/fWzQ7ZhjAEpXc+VBkG3xWYxfug8ahdyYPE60qqqgyBG4QeFu+DxqN2r2+AakVGYTURmMX7hq+FZqN2S4GP9XS6HYrAt866LN4HdQJuMGr3SxEpNUZh3TWYxfsohKajdsuqKQupqjHq6v4/jsX74IFRu0rVKDVGXQG0FpipiQCOPw0RPvwAcGmwky9GAQAtteo5lvcGAAAAAAAAAAAAAAAAAAB+yz97iiCwkbsrlQAAAABJRU5ErkJggg==","w":960,"h":64},"night":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA8AAAABACAMAAADiUO7sAAAAD1BMVEUAAAAPFjQdKmuPo8cbJlLDev0IAAAAAXRSTlMAQObYZgAAAnNJREFUeNrt2kFy2zAMBdCQ0v3P3Glj2WkjpxsBAqT3Fp1MN53U/D9EwI8PAADYNfwXQNf0jjHHkGFNSsszM+eyLMt0djQpbfO7LIuTo0npVvmv/Do5mpRuR2a+8ivBmpSelb8dnGkA06R0ze8yXd80KV1OzfotwCkDmJOpSQkMcOj17ZxFyWj5QUgw/5u7dgMcmOAxo/+FKp1RvUk16IXubY+vZnj3j4SOqNAZ9Zs0M2WepwTW/vx9Tp6Cx68xv/6SJucjHSeloXaTZqYsoEGVwWeA3xrB+X20xshIR35n1G/SzHvK4Q3qB/q/AV7Xdf38IzLAY29XkpffvM6o36SZ95TDG7T+SJR1bp6+fLn9TcwRmclD3imdUb5JU+8phzdo/ZEoNcHjz8c1HoLzu/NbmjV0ZXVCZ9Rv0sx7yvENWn8kSjw5377/LcixRyQrwGd0Rv0mzbynHN+gDUaia3bFuz1J+Mq5QYBTmzTznnJ4g7YYiS6Z37+eCD63JaEfwBmd0fuzObrmDm/QHiPRVQ/JfN56tkXJjPyBeEZn9LwbRQX48AYtNRKNm52S9wIDnNwZZpvQBi00Et1uEz1+WJREBTi/M8w2kQ1aaCS63yZ6Zz0SvSk5oTPMNoENWmgkuuMm+rUX2X69+tyWjMt0htkmsEHrjET33ETv70Uiv//8zjDbBDZomZHIJvq6nWG2iWvQIiORTTS3mW0ObdAaI5FNNO4pfUeiLo9zQdX8PP4KMDRrEI9zoW9+Pc6F3gH2OBf63qA9zoX+AfY4F/oF2ONcuEKCPc6Fjgn2OBcAAAAAAAAAAAAAAAAAAAAAAAAAAABC/QL96x1Bcnkd9QAAAABJRU5ErkJggg==","w":960,"h":64},"overcast":{"src":"data:image/png;base64,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","w":960,"h":64}},"drift":-3,"driftBy":{"overcast":-14}},{"id":"far","label":"Mesas","factor":0.1,"y":58,"images":{"day":{"src":"data:image/png;base64,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","w":640,"h":82},"dusk":{"src":"data:image/png;base64,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","w":640,"h":82},"night":{"src":"data:image/png;base64,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","w":640,"h":82},"overcast":{"src":"data:image/png;base64,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","w":640,"h":82}}},{"id":"mid","label":"Dunes","factor":0.3,"y":98,"images":{"day":{"src":"data:image/png;base64,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","w":960,"h":52},"dusk":{"src":"data:image/png;base64,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","w":960,"h":52},"night":{"src":"data:image/png;base64,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","w":960,"h":52},"overcast":{"src":"data:image/png;base64,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","w":960,"h":52}}},{"id":"near","label":"Sable et cactus","factor":0.6,"y":92,"images":{"day":{"src":"data:image/png;base64,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","w":1280,"h":60},"dusk":{"src":"data:image/png;base64,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","w":1280,"h":60},"night":{"src":"data:image/png;base64,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","w":1280,"h":60},"overcast":{"src":"data:image/png;base64,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","w":1280,"h":60}}},{"id":"ground","label":"Sol","factor":1,"y":132,"images":{"day":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAAwCAMAAAC2RjtNAAAAPFBMVEUAAAAaFCPT4PL7+//JmlucazwhXk8WOjfgeCo7IhlirXz/8Kjzw0qPo8c0hGiLiqPDwtRqQShXVnAvLTy66sxcAAAAAXRSTlMAQObYZgAABDpJREFUeNrtmYuy6iAMRdk10FN7tYL//693oD0+jtVCaEvV7PsYh6EmsBcJqlIikUgkEolEItFnCUD83OGfSDQbf9WuQiyqBAUNrEu9aNPVK9dJVFUVRyCIiACtNXLJg6lrfLQrq8css9Cf2pifvNjYRQIY+COtG2QQ2JMHY96CQPBc2dfGrIogFNoCtyOYn3/hD3L5O8QBiIa0L4B8AAfy3gJApqswew/gmssDIaQKzTwxvNOC4+9SCXn8RcYHmh6/nALYAwi+Q8ztQmplY7qa4wqbBAKo9ZejxOdDQHSn0wkc/i5L5Z+26P7bV4QBQGtzKmCAEOAlDXRd59J9wi0OiGGD5yrTlTwS6DdVIMkZuK7r0J38/ywAab8nY4gPYBJ/NJQ/bS2bQNSmNsfj0dQ8AINHXedc6rPQhIsooqgxXeW5kkmCr9XUhqOSYgxc55xzGQBeij23myXwFwBs/BWwyQKwhtkfj+T7MIu/zldAxyKwGhTDH9dVliu5JNwclTQAT865s9/RrkgLTuJP+brhAUSDJqMH1+grIKv+ue6Xv/M5mcBqN6jCcq6yXMkjwddqan1/gk7iD871YR3vVp3XgoE0/sJtXDfaokm8afyNawzxPoL0/PW7xgEQ8PgBFRZ0leFKNglELYW7UUqqfdsPoTvHBDCjBft6kMZfADDwp3IADJ9D+AAGpwKAqQTigL4AIvJLJ46rHFeySQjf0A6X85RrZ7jJnJ1zp1wAaw6AVSJ//qR6/hrkfeGJ2oT6wAFw0JkD4KUHR66a4yrHlQgSMCW6fjiMVt/2Q1jnwFKoJGGpjIcDf8myaYscV13zUsaVQM9fsg7Vzt87DpHTOa5yXJkkQbVT6n3xmbaxGtr+EKJl6Zoi52H/+wcvZJspTyDrTe4BTH/8UFUJq2a4ynFlmgRFk7ocmnglPzC3CkZnh74rUNzHk6MtvxuvgygSiQpKABQJgKIvBnD4CVTHTZfZMnve2Ur2SWaXnC0tWCR3QJEAKB1CZheZrWSfZHbJ2dKCJ2Wt7MGm7oDfZUj4wVQ4WQXA11VV/zEkanbae29ytrX2C1ZJpVapSPvww9+Yl56/2Lny8k1ehrJSJIfLLyGiTShUogKyheK+EYClrFmbg29Y5jsC+CXWfN4iJwqHEmtEJQuHWjz4vbayJVtK6ON4u9tVW6ACjptr79wvyN0zHLdxIuJz2cYhGs07fiVqOfAeQtvHuStu0ZM8bgZWLoyPsexrKMcgtUsl/vQ9x4/Kc7Mn8lKL7OQ0f8PAsn6Pv3lSYlEUzNIgIhObGshP6/ENxrHnJBYHoE3UDLtnGYokbxmfpzp7RC1eNDFGJ19og+4GHtNS484u7NosA7FsrpXYcxLti0vxsgMvDsc1qfWtvLFK6TfB7Y0GlmgR81Se0UNadscEQBkoD6DshQyUGpAKKAPSgmXgewf+AwkuuIs6rrLkAAAAAElFTkSuQmCC","w":640,"h":48},"dusk":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAAwCAMAAAC2RjtNAAAAHlBMVEUAAAAaFCOPT1/QdF9eOlo7K0shGjOyOizzw0rgeCqamFBNAAAAAXRSTlMAQObYZgAABA5JREFUeNrtmoty6yAMRFkVUd///+E7YOfVOLFYgnESbduZDIONYA8SjhuCy+VyuVwul8v1WQJg77v8uVwv409+BFZUBQER2Jd616GzV6uTEBEbgXNPxBjRSh40JXy0K7uPOWaiv0n1t21s/BgBLPxJjAkNBM7kQfUtCATniiTVXRFEwDTgdAT9/Vd+0MpftAGIJDEnQB7Ahby3AJB0FSoZwD2nB0EJFZHcMdxuQTxNVdDGn3F8IM34tSTAGUDwDpHLhdrMRrra4gpNggAy5cNR5fVlQETrGezvTM9T5Xebuf7OGWEBULUlAxYIAS7ocgQl6huuZwnLlDlXSVfaSJBTqECVM9CcTKJwKQUxxyuqwgNYxZ8s6S+q0gQiacqz1sQBWDxidgCi4CzLkYN0lXOlkYScq2UqW6VmYaDFygYAz8merWYV/BUAUz4CpiYAE1RilFyHKf7YHVDQXRTRzVXKlVYSrrZKHYCSixF7qGovwVX8hZw3MoBISA01OGHOgFT+03MGrr8e8rNI0M9VypU2EnKulinXJ8Qq/vJZqAzLPbI3lmCgjr9yGo8pKlLlSeN+2sI9gsz8zavGAAhk/GA8AZKuEq40kyAyzZWhJtS57Jeho5IANpTgnA8qj7wZwMJfaAEwLKtNAliupbI+IuYECOOXToyrjCvNJJRvaJe9WXPsLCeZfKCSVgATA6BUP3IhJ4MyVtMXj2XKHICLEjXnUw02zppxlXHFQAK2JJeHQ7Pmsl+Grbns5hbnbEBcPL9WY4Yko70oJS5kXAikbhDlJ587onWFCFcZVzZJCNOWzguDyaqlEC1DTJQuITIX54dBbsipUZlA6ia3ANZfHudH4NrR0NWVbRKCbOo6rRhVfcGrNXB0eui/KZy6vHq0/qvxfJAgLtdAOYAuB9D1xQAur0Cjrbv39t6v7R18nbz3yN5egl1+BnQ5gF4hvPeQ3sHXyXuP7O0leFOqvgaHOgN+lyHlZaZzsguAz7Nq/GOIqXfdvQ/ZO/8n2+fPUkbNMkj+Z/3Tr+Vj5s/a1z++yceSVobEcH4T4jqESiYaIB007hsBOMqavTn4hmm+I4BfYs3nTXIjcQS3xjUycYTug9/qKEtypIA+jrebVdUBGXDdXL1xfyB3j3A8xo6wx3KMTbQat30moR94d0Prfd8dl+hBHFcNOyfG+7H0OZRrkGqvwB/ec32rPDZ7I67QZSW3+Vsa+vq9fvOqwEwUvKRAGAPbamgP6/4G69gzgdkA1Eq9YPWUkJG8Pj5vVXZDLu4aGFHJOy3QTcN9WGHd2c6uvaTByuZegT0mUZ8civs2PNkcl6D2t/LKqhDfBLc3auhRIl6TeVY36dgVcwC9YTyAvhbeMKrBM6A3eAn2hu9t+A+nqQweHh7jfwAAAABJRU5ErkJggg==","w":640,"h":48},"night":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAAwCAMAAAC2RjtNAAAAFVBMVEUAAAAaFCMqR1I/ZGYdMkcUIToMEiQh/sU+AAAAAXRSTlMAQObYZgAABAlJREFUeNrtm42SqyAMhTkx4f0feQd07Z+tcChi25y7O9NhUALnI0F7NwSXy+VyuVwul+u7BKC87/Lrcr2NP5kEpagKAhQ4lnrXqbNXq5MQkTIC555QVbSSB4sRX+3K4WOOmahGM20bG1MhgJk/UY1oIHAmD2YfQSA4VySaHYogAqYBpyOYSv6HVv60DEBE0ZQAeQAX8j4CQNJVmCQAj5weBDlUKLljuN0C/Z+qoI2/wvGBOOPXkgBnAME7RC4XajMb6WqLKzQJAsiUDkeV1+cBoaVnsPuZrlPld1tx/Z0zwgKgWUsGzBACXND5CErUN1zPEiVT5lwlXWkjQf5DBaqcgaVkosKlFGiKV8yEB7CKP1nSn5rRBCJaTLO2yAGYPWJ2AFSwquTIQbrKudJIQsrVMuWtUrMwsGxlA4BrsmerWQV/GcCYjoCxCcAIE1VJdZjij90BGd1Fim6uUq60knC1VeoAlFSM2ENVewmu4i+kvJEARERsqMERcwak8p+tGbj+esi0SNDPVcqVNhJSrk7vclMOreIvnYXysNwje2MJBur4y6dxjWqIlSeNx2kL9wgy8zevGgMgkPBD4QmQdJVwpZkEkWmuDDWhzmU/D61GAthQglM+qDzyJgAzf6EFwLCsNglgvpbK+lDMCRCFL50YVxlXmknIb2iXvVlz7MwnmXSgklYAIwOgVD9yISWDPFbTi8c8ZQ7ARZGa838NLpw14yrjSgEJ2JNcHg6LNZf9PGzNZTe3WLMBcfH8tRozJBntRTFyIeNCIHUDTWe6SbR0hQhXGVd2SQjTntaFwVSqpRAtQ0yULiEyF6eHQW7IqVGJQOomtwDWX67zI3DtaOjqyj4JQXZ1nVYKVX3BuzVwdHro+xROXV49Wv/VeD1IEJdroBxAlwPo+mEAl69Atay79/be7+0dfJ2898jeXoJdfgZ0OYBeIbz3kN7B18l7j+ztJXhXZr4GpzoD/pYh+ctM5+QQAF9nVb0zpKh33b1P2Tv9T7bvn6WMmmVIf3q7/pR8TPyV9vWPH/Ixp5UhMazfhLhOoZyJBsgGjftBAI6y5mgOfmGanwjgj1jzfZPcSRzBrXGNTByh++C3OsuSnCmgr+PtZlVtQAbcNtdu3B/I3TMcz7EjymM5xybajLt8JqEfeA9D22PfA5foSRxXDQcnxsex7DWUW5Bar8Cf3nN7qzw3eyeu0GUl9/lbGvr6vX3zqsCKKHhLgSgMbK+hPazHG2xjzwRWBqBV6g2rZ4QKyevj815lL8jFXQMjKnmnBbppeAwrbDvb2bW3NJSyeVRgz0m0F4fivg0vNsclqOOtvLIq6Ifg9kENPUrEezLP5iYdu2IOoDeMB9DXwhtGNXgG9AYvwd7wuw1/hrYBKo0MN/UAAAAASUVORK5CYII=","w":640,"h":48},"overcast":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAAwCAMAAAC2RjtNAAAAG1BMVEUAAAAaFCOcazxqQSg7IhmyOiwbJyPJmlvgeCqQSSDlAAAAAXRSTlMAQObYZgAAA+pJREFUeNrtm4mS4yAMRGmJ4P3/L97iiJOMnVgIY+xEvUdNUdgI9UNiLudMJpPJZDKZTKbvEgD53PLPZNqNPyKCFFWCAwPHUm86dfVqdTICKCMwzwQzo5U8eO/x1a4cvuaYjd689zccA2CaSMwBDQRm8uL/VyAQOlc4bg6HxolpwO0I/vYv/UErfywDEIE4FkA9gIW8SwCodBWe+eDtgZBCBStPjO60gO9bJbTxJ1wfCBm/tgIYAYTeIWW6UFvZlK62uKImgQCa4uWo8vm0IJSOguet6k+b/AKYKkIBsGG9GOu9CKo4ihEo+huedwnJlnWuKl1pI4HuoQJVSY3FWt/SwEzM5D3pAazij0r54wbiE3wZYdU7wMoTACbMklw5lK7qXGkkIdZqmtJRqUkMPBc7WisgabtZBX8JwBCzFNoATMkm3S0d+hMAplmMbq6qXGkl4emo1AMYeFgLruLPxboRAURAaOnByBVQVf/8zF8I0Ow2C/1cVbnSRkKs1TTF/gSu4i9fyIPqStPegmMnquEv3cY5sEeovGkst026M5P5y1nTAFh2LLwBKl1VuNJMAtFEKTU1oea2n+9EXglgQwuGvBY8A5j4cy0Alk+EtQAmpxKAtQSC73sWftFJ46rGlWYSkplc2VdK24/drB1ArwWw9pP2yF80vukLj9kcFYBFQQPgowejm6saVwQkYEv0uBqLldt+WrbmsZdXzFI8nLuRakk0Sv+SmcDIX7U49V9iaYYUrmpc2STBTVuaF8UkVWn7ZYlJpUeImoejE7olp0ahKlNreU4A1j/O+VPg2tXQ1ZVtEhxt6rmsCFX9wN4auLp66b8lXPV49Wr9s/F5EUcm00AZgCYD0PTDAJZvgbJsus222fvOdpYnmz1ytrVgk90BTQagdQibPWS2szzZ7JGzrQVvynvLwanugL9lSP7hI9MRAH6uqvzHENHsunefcnb6cfKv3yWN2qWj9EOu5a/kw8ifdK59eJEPff61jQExzN8JMZ1CVH5952j5QeteCMBR1hzNwS9s84oA/og137fJjcLhzBrTyMLhui/+qrOk5EwBfR1vL1n1Ayrgurn+xf2B3L3D8RwnQh7LOQ7Ratzynbh+4C2W9su5B6boTRxPAwcXxuVa/jOUa5D6XoG/fef6UXlv9kZcrksmt/krA339Xn95VWAiCnZpEMLAtgbaw1q+YB17TWAyAH2ldsieV0hIXh+ftzq7oBZ3DUzRyTsl6GVgGZZbd7aza7sMSNk8KrD3JPoPl+K+Ax8OxyOo4618ssrxRXC70ECPFrFP5Vk9pGMzZgDawHgALRc2MGrAKqANWAu2gd8d+A9DdN2aX/pr1wAAAABJRU5ErkJggg==","w":640,"h":48}},"actors":[{"sprite":"tuft","x":110,"y":9,"phase":0},{"sprite":"tuft","x":186,"y":9,"phase":337,"flip":true},{"sprite":"tuft","x":290,"y":9,"phase":674},{"sprite":"tuft","x":366,"y":9,"phase":211,"flip":true},{"sprite":"tuft","x":426,"y":9,"phase":548},{"sprite":"tuft","x":530,"y":9,"phase":85,"flip":true},{"sprite":"tuft","x":584,"y":9,"phase":422}]},{"id":"front","label":"Premier plan","factor":1.3,"y":150,"images":{"day":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA8AAAAAeCAMAAADU1IdrAAAAHlBMVEUAAAAaFCM0hGghXk8WOjecazw7Ihnzw0rgeCpqQShFkGXMAAAAAXRSTlMAQObYZgAAAqdJREFUeNrtnNGOqzAMRDs4Nsn///AqDulCt+1KV0svTmakFnhskuOZGMrtRlEURVEURVEURVHUPwkujgNFheR3kSQpkWCKisivNIA7wXRjiooLMJYkdGOKigkwZGGepqhYAKvoN8D1ggBTFB2YoigCTP35pLNTOS7AjNDDY4tU55uT/NtghahzdOBplmTHFklESPB7epfUdEmG95XlRxOLAI/Kb8e2Trlwlt8N1bJ0gNMFx+lwr5cReqK9UiO4kkwLfmNvosuyaEpp+1xsoI4uywh9GJuxDXgHsCZa8As8RI4OfLWROrosAd6BC8PYADu2HeXw04xpAX7qwK45I3QHd3iAZQNYneWoGfrMcttaBY8AX4qInwB7E0uapnTgB4DH+/nADtvU2lkX7bD+33KLOkiPe+Ckl0LiRYRumh5gtG8MRTEO2PpEtzAdcqbPLLeQ5w58MYCfRegO8HQRuiHr6wCGFfXb1noyUnzeYQs/+El0gP+63EJeAXyhkfoF4Nkc2OE1+GqAITeAcz0Zh99FOrbe6diWZMRO9LnlNgrAT7vQWxNrWoBtBUw11wvVrMMQ3PpX6KbbD0DATvTJ5Rbyag98aQee+kksj2AGrOarQf2iKHQkB64A7zfCgPOrcQE+p9xGjtDbvmK6N9yh5i8Dsq4ZZsUvCspIW+AkKm674o9jyd2KIwJ8ZrkNHaFv88l3UhnZzKt4Leyl1vRSER7Igfsa7PcKt150wD3wyeU2vgPPxW/NY1pyyTWHlQpw0TU7wOs4D3V8N6BF7gRDwxnwB8ptqD0wetvq4a2UcwF8g5oWq4tBgVKgZqWg1GUyjgXrwYDvFhwK4E+U20gR+j6Z+yZW/afSTATX2xDF0AA2bQCXYvCVMViG7gDrHeBQ1foT5fYTAH8B8CsY+CeGbngAAAAASUVORK5CYII=","w":960,"h":30},"dusk":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA8AAAAAeCAMAAADU1IdrAAAAElBMVEUAAAAaFCNeOlo7K0shGjOPT18vQ6/dAAAAAXRSTlMAQObYZgAAApVJREFUeNrtnOuO6zAIhDtA3v+VjwC763TbrrTa9Bh7RuolP2PzMYDT3m4URVEURVEURVEURf1KCHEdKKokv6KmZiSYoiryqwlwJ5huTFF1AYaY0o0pqibAUGE9TVG1ABaVL4D9ggBTFB2YoigCTP35pnNSuS7ALKGXxxbm+81N/mmxSuQ5OvA2IdmxhakqCX5Pr1hqSobHzPJtiEWAV+W3Y+tbrtzld0sl0gG2CdfpdNbLEnqjXikJdpJpwW/sTUWS4PaabKHOLssS+rQ2axvwALAYLfgFHqpnB55tpc4uS4AHcLHunQ/YdpTL3yy2BfipA4f2LKE7uMsDrA1gCZar1tBXptscFTwCPFVcfAc4hlia2tKBHwBe7/aBAVvLcdakE9b/m25zUvDQA5tMhcSLEjq1PcDIdyxFMU7YxkZnMV1yp69Mt9DnDjwZwM9K6A7wdiV0IhtxAMMBf7fDv6xUPg/YwqQdcZYH+K/TLfQVwBOt1A8A7+bAAa8HM+JTEmDxL+vwK9qxjUlHC8mKk+hr020VgJ9OodsQa1uA7UCc4PtFNEFYB2BtFtzYjQ+g4CT64nQLfdUDT+3AWz+JFSWYAYdFNEhc6GIO7ACPjXDe5GTDmQnSbeUSuvUV2/3DHbz+iig4xAM8LhS6UgvsNXREfRqM3q24IsBXptvSJfRtP0UnJd4LRhaPEPecro7wQg7cY7CfFbZZdMEe+OJ0W9+B9+LX67HsIOCfflgqhwTAxzoPdXwNoFXvBLef21S6xw+k21I9MPrY6uFfKfcC2H/a4fVlBANUEc+0QGWhlNYH0CPA7TgYtXbr6nRbqYS+b+Y4xPJw3olgP4ZQQwJskgCrGiIyFquhO8ByB7hUtv5Euv0EwP8AwB0UtctXpnMAAAAASUVORK5CYII=","w":960,"h":30},"night":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA8AAAAAeCAMAAADU1IdrAAAAElBMVEUAAAAaFCMdMkcUIToMEiQqR1Kp7fDUAAAAAXRSTlMAQObYZgAAApVJREFUeNrtnOuO6zAIhDtA3v+VjwC763TbrrTa9Bh7RuolP2PzMYDT3m4URVEURVEURVEURf1KCHEdKKokv6KmZiSYoiryqwlwJ5huTFF1AYaY0o0pqibAUGE9TVG1ABaVL4D9ggBTFB2YoigCTP35pnNSuS7ALKGXxxbm+81N/mmxSuQ5OvA2IdmxhakqCX5Pr1hqSobHzPJtiEWAV+W3Y+tbrtzld0sl0gG2CdfpdNbLEnqjXikJdpJpwW/sTUWS4PaabKHOLssS+rQ2axvwALAYLfgFHqpnB55tpc4uS4AHcLHunQ/YdpTL3yy2BfipA4f2LKE7uMsDrA1gCZar1tBXptscFTwCPFVcfAc4hlia2tKBHwBe7/aBAVvLcdakE9b/m25zUvDQA5tMhcSLEjq1PcDIdyxFMU7YxkZnMV1yp69Mt9DnDjwZwM9K6A7wdiV0IhtxAMMBf7fDv6xUPg/YwqQdcZYH+K/TLfQVwBOt1A8A7+bAAa8HM+JTEmDxL+vwK9qxjUlHC8mKk+hr020VgJ9OodsQa1uA7UCc4PtFNEFYB2BtFtzYjQ+g4CT64nQLfdUDT+3AWz+JFSWYAYdFNEhc6GIO7ACPjXDe5GTDmQnSbeUSuvUV2/3DHbz+iig4xAM8LhS6UgvsNXREfRqM3q24IsBXptvSJfRtP0UnJd4LRhaPEPecro7wQg7cY7CfFbZZdMEe+OJ0W9+B9+LX67HsIOCfflgqhwTAxzoPdXwNoFXvBLef21S6xw+k21I9MPrY6uFfKfcC2H/a4fVlBANUEc+0QGWhlNYH0CPA7TgYtXbr6nRbqYS+b+Y4xPJw3olgP4ZQQwJskgCrGiIyFquhO8ByB7hUtv5Euv0EwP8AwB0UtctXpnMAAAAASUVORK5CYII=","w":960,"h":30},"overcast":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA8AAAAAeCAMAAADU1IdrAAAAD1BMVEUAAAAaFCOcazxqQSg7IhmfGhHuAAAAAXRSTlMAQObYZgAAAodJREFUeNrtnNuOwzAIRDvA/3/zCrC7Tq/Squkae0bqJY+xOQzgtJcLRVEURVEURVEURVF/EkJcB4oqya+oqRkJpqiK/GoC3AmmG1NUXYAhpnRjiqoJMFRYT1NULYBF5RdgvyDAFEUHpiiKAFMf33ROKtcFmCX08tjCfL+5ye8Wq0SeowNvE5IdW5iqkuDX9IqlpmR4zCx3QywCvCq/HVvfcuUuv1oqkQ6wTbhOh7NeltAb9UpJsJNMC35hbyqSBLfXZAt1dFmW0Ie1WduAB4DFaMFP8FA9OvBsK3V0WQI8gIt173zAtqNc/maxLcAPHTi0ZwndwV0eYG0AS7BctYY+M93mqOAW4Kni4h7gGGJpaksHvgF4vdsHBmwtx1mTTlj/N93mpOCmBzaZCoknJXRqe4CR71iKYhywjY3OYrrkTp+ZbqGPHXgygB+V0B3g7UroRDbiAAaBv5v4l5XK5wFbmLQjzvIAfzrdQp8BPNFKvQF4NwcOeD2YgUUBhqloxzYmHS0kK06iz023VQB+OIVuQ6xtATZBnOD7RTRBWAdgbRbc2I0PoOAk+uR0C33WA0/twFs/iRUlmDNrEQ0SF7qYAzvAYyOcNznZcGaCdFu5hG59xXb/cAdntUWBB3hcKHSlFthr6Ij6NBi9WnFFgM9Mt6VL6Mt+QgPY+0HntwOsjvBCDtxjsJ8Vtll0wR745HRb34H34tfrsewg4J9+WOpb5/TKOg91/A6gVa8Et5/bVLrHL6TbUj0w+tjq5l8p9wLYf9rh9WUEA1QRz7RAZaGU1gfQI8DtOBi1duvsdFuphL5u5jjE8nDeiWBvpNSQAJskwKqR4m21GroDLFeAS2Xrb6TbbwD8A/BDFG2gqWCLAAAAAElFTkSuQmCC","w":960,"h":30}},"front":true,"optional":true}],"sprites":{"tuft":{"day":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAANCAMAAAAucZheAAAAElBMVEUAAAAaFCP/8KjJmlucazxqQSibY9zJAAAAAXRSTlMAQObYZgAAAG5JREFUeNqd0FEKxTAIBVFHzf63/IiNpS8Ikvh3JuV+VCQO2a4L/APlG7uw0wjjTWCF/X3aFNypQ2MsDaMKvUFNY6/yHsr33MuBMxumNgf9xlHU3N2H5y84cpQnjHfxyEJwOj84swhj3aVFWHfjH0pqBXZSNapIAAAAAElFTkSuQmCC","w":16,"h":13,"ms":[200,200,200,200]},"dusk":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAANCAMAAAAucZheAAAAElBMVEUAAAAaFCPzw0qPT19eOlo7K0tqBUGsAAAAAXRSTlMAQObYZgAAAG5JREFUeNqd0FEKxTAIBVFHzf63/IiNpS8Ikvh3JuV+VCQO2a4L/APlG7uw0wjjTWCF/X3aFNypQ2MsDaMKvUFNY6/yHsr33MuBMxumNgf9xlHU3N2H5y84cpQnjHfxyEJwOj84swhj3aVFWHfjH0pqBXZSNapIAAAAAElFTkSuQmCC","w":16,"h":13,"ms":[200,200,200,200]},"night":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAANCAMAAAAucZheAAAAElBMVEUAAAAaFCM/ZGYqR1IdMkcUITpbvjHCAAAAAXRSTlMAQObYZgAAAG5JREFUeNqd0FEKxTAIBVFHzf63/IiNpS8Ikvh3JuV+VCQO2a4L/APlG7uw0wjjTWCF/X3aFNypQ2MsDaMKvUFNY6/yHsr33MuBMxumNgf9xlHU3N2H5y84cpQnjHfxyEJwOj84swhj3aVFWHfjH0pqBXZSNapIAAAAAElFTkSuQmCC","w":16,"h":13,"ms":[200,200,200,200]},"overcast":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAANCAMAAAAucZheAAAAElBMVEUAAAAaFCPJmlucazxqQSg7IhmJ06U9AAAAAXRSTlMAQObYZgAAAG5JREFUeNqd0FEKxTAIBVFHzf63/IiNpS8Ikvh3JuV+VCQO2a4L/APlG7uw0wjjTWCF/X3aFNypQ2MsDaMKvUFNY6/yHsr33MuBMxumNgf9xlHU3N2H5y84cpQnjHfxyEJwOj84swhj3aVFWHfjH0pqBXZSNapIAAAAAElFTkSuQmCC","w":16,"h":13,"ms":[200,200,200,200]}},"roll":{"day":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAQCAMAAACROYkbAAAAElBMVEUAAAAaFCPJmlucazw7IhlqQSiqdJDvAAAAAXRSTlMAQObYZgAAARNJREFUeNp9kwuOAzEIQ/P43P/KKzBJprNVK1WqwdhAw1rfPgC/A++C+W5oZsYjUgHng/8UhGL7CXW9w5RUnHA/CsXHXnw4DBZh7h4K0M20AIdfhodvbejBLoDAC21sFbjYmnJ6qrQVX4HKF780MhFfclF4qf94zIT0/TRgQp4SoPsvTCJ+yFAz1YBMwRjEhlL0pkfmEMYACWJcw3Gsf2DgWj3NpDWSu1aecR1pByRQ+5dhE9Rso+G33/DX3hBBPAuC0wE1dWxoHoAa2gQPTwLtqBSIYPQKDtrpkNwN1MAE6wpko5yHUumnQLXU5XleXpblOQfU/X2qSO6kF6F9nWO4/dySfwf6+P3m97X+PNcv5z78PyNtBlo6YR7nAAAAAElFTkSuQmCC","w":16,"h":16,"ms":[100,100,100,100]},"dusk":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAQCAMAAACROYkbAAAAElBMVEUAAAAaFCOPT19eOlohGjM7K0s/Vq2dAAAAAXRSTlMAQObYZgAAARNJREFUeNp9kwuOAzEIQ/P43P/KKzBJprNVK1WqwdhAw1rfPgC/A++C+W5oZsYjUgHng/8UhGL7CXW9w5RUnHA/CsXHXnw4DBZh7h4K0M20AIdfhodvbejBLoDAC21sFbjYmnJ6qrQVX4HKF780MhFfclF4qf94zIT0/TRgQp4SoPsvTCJ+yFAz1YBMwRjEhlL0pkfmEMYACWJcw3Gsf2DgWj3NpDWSu1aecR1pByRQ+5dhE9Rso+G33/DX3hBBPAuC0wE1dWxoHoAa2gQPTwLtqBSIYPQKDtrpkNwN1MAE6wpko5yHUumnQLXU5XleXpblOQfU/X2qSO6kF6F9nWO4/dySfwf6+P3m97X+PNcv5z78PyNtBlo6YR7nAAAAAElFTkSuQmCC","w":16,"h":16,"ms":[100,100,100,100]},"night":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAQCAMAAACROYkbAAAAElBMVEUAAAAaFCMqR1IdMkcMEiQUIToKvUfrAAAAAXRSTlMAQObYZgAAARNJREFUeNp9kwuOAzEIQ/P43P/KKzBJprNVK1WqwdhAw1rfPgC/A++C+W5oZsYjUgHng/8UhGL7CXW9w5RUnHA/CsXHXnw4DBZh7h4K0M20AIdfhodvbejBLoDAC21sFbjYmnJ6qrQVX4HKF780MhFfclF4qf94zIT0/TRgQp4SoPsvTCJ+yFAz1YBMwRjEhlL0pkfmEMYACWJcw3Gsf2DgWj3NpDWSu1aecR1pByRQ+5dhE9Rso+G33/DX3hBBPAuC0wE1dWxoHoAa2gQPTwLtqBSIYPQKDtrpkNwN1MAE6wpko5yHUumnQLXU5XleXpblOQfU/X2qSO6kF6F9nWO4/dySfwf6+P3m97X+PNcv5z78PyNtBlo6YR7nAAAAAElFTkSuQmCC","w":16,"h":16,"ms":[100,100,100,100]},"overcast":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAQCAMAAACROYkbAAAAElBMVEUAAAAaFCOcazxqQSgbJyM7IhlJu4hfAAAAAXRSTlMAQObYZgAAARNJREFUeNp9kwuOAzEIQ/P43P/KKzBJprNVK1WqwdhAw1rfPgC/A++C+W5oZsYjUgHng/8UhGL7CXW9w5RUnHA/CsXHXnw4DBZh7h4K0M20AIdfhodvbejBLoDAC21sFbjYmnJ6qrQVX4HKF780MhFfclF4qf94zIT0/TRgQp4SoPsvTCJ+yFAz1YBMwRjEhlL0pkfmEMYACWJcw3Gsf2DgWj3NpDWSu1aecR1pByRQ+5dhE9Rso+G33/DX3hBBPAuC0wE1dWxoHoAa2gQPTwLtqBSIYPQKDtrpkNwN1MAE6wpko5yHUumnQLXU5XleXpblOQfU/X2qSO6kF6F9nWO4/dySfwf6+P3m97X+PNcv5z78PyNtBlo6YR7nAAAAAElFTkSuQmCC","w":16,"h":16,"ms":[100,100,100,100]}},"roll_near":{"day":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAQCAMAAACROYkbAAAADFBMVEUAAABqQSjJmlucazwJ8/41AAAAAXRSTlMAQObYZgAAAPJJREFUeNp9UwEOxDAIKvL/P19UpO1u2ZJLTkVEq2u9fQDw7Xgm6DdmRAQOTzqIC38SAommXZVPQCkoOGmGxCMe+AOBRKTVDpSYCsP4LGh8VMGsqIRsuNLHTg+3HYKIQXrIdmS8CJqj8aIToPXvnsRGCwj6w5ry3BIkcHrKBo1Yd0Iz1jiUUhJNpwQ+K/KSZEtxzesgmJGVIwldsACtZRQhxDdT9oSgZxDUU+rQNoO4el7QfDGbI8PPKtOvxnvqS4pRyygCljWL0uGNl0XszWMfi9+1x7VXt+kcXugB+hyw9eyUvwM9/j/xtRuf5/py7sL/AMklBOBzr22uAAAAAElFTkSuQmCC","w":16,"h":16,"ms":[100,100,100,100]},"dusk":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAQCAMAAACROYkbAAAAElBMVEUAAAAhGjPQdF+PT187K0teOlpFO4d1AAAAAXRSTlMAQObYZgAAARNJREFUeNp9kwuOAzEIQ/P43P/KKzBJprNVK1WqwdhAw1rfPgC/A++C+W5oZsYjUgHng/8UhGL7CXW9w5RUnHA/CsXHXnw4DBZh7h4K0M20AIdfhodvbejBLoDAC21sFbjYmnJ6qrQVX4HKF780MhFfclF4qf94zIT0/TRgQp4SoPsvTCJ+yFAz1YBMwRjEhlL0pkfmEMYACWJcw3Gsf2DgWj3NpDWSu1aecR1pByRQ+5dhE9Rso+G33/DX3hBBPAuC0wE1dWxoHoAa2gQPTwLtqBSIYPQKDtrpkNwN1MAE6wpko5yHUumnQLXU5XleXpblOQfU/X2qSO6kF6F9nWO4/dySfwf6+P3m97X+PNcv5z78PyNtBlo6YR7nAAAAAElFTkSuQmCC","w":16,"h":16,"ms":[100,100,100,100]},"night":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAQCAMAAACROYkbAAAAElBMVEUAAAAMEiQ/ZGYqR1IUITodMkdhB4TWAAAAAXRSTlMAQObYZgAAARNJREFUeNp9kwuOAzEIQ/P43P/KKzBJprNVK1WqwdhAw1rfPgC/A++C+W5oZsYjUgHng/8UhGL7CXW9w5RUnHA/CsXHXnw4DBZh7h4K0M20AIdfhodvbejBLoDAC21sFbjYmnJ6qrQVX4HKF780MhFfclF4qf94zIT0/TRgQp4SoPsvTCJ+yFAz1YBMwRjEhlL0pkfmEMYACWJcw3Gsf2DgWj3NpDWSu1aecR1pByRQ+5dhE9Rso+G33/DX3hBBPAuC0wE1dWxoHoAa2gQPTwLtqBSIYPQKDtrpkNwN1MAE6wpko5yHUumnQLXU5XleXpblOQfU/X2qSO6kF6F9nWO4/dySfwf6+P3m97X+PNcv5z78PyNtBlo6YR7nAAAAAElFTkSuQmCC","w":16,"h":16,"ms":[100,100,100,100]},"overcast":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAQCAMAAACROYkbAAAADFBMVEUAAABqQSjJmlucazwJ8/41AAAAAXRSTlMAQObYZgAAAPJJREFUeNp9UwEOxDAIKvL/P19UpO1u2ZJLTkVEq2u9fQDw7Xgm6DdmRAQOTzqIC38SAommXZVPQCkoOGmGxCMe+AOBRKTVDpSYCsP4LGh8VMGsqIRsuNLHTg+3HYKIQXrIdmS8CJqj8aIToPXvnsRGCwj6w5ry3BIkcHrKBo1Yd0Iz1jiUUhJNpwQ+K/KSZEtxzesgmJGVIwldsACtZRQhxDdT9oSgZxDUU+rQNoO4el7QfDGbI8PPKtOvxnvqS4pRyygCljWL0uGNl0XszWMfi9+1x7VXt+kcXugB+hyw9eyUvwM9/j/xtRuf5/py7sL/AMklBOBzr22uAAAAAElFTkSuQmCC","w":16,"h":16,"ms":[100,100,100,100]}},"scorpion":{"day":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAMCAMAAADlLUv7AAAAElBMVEUAAAAaFCPJmlucazxqQSg7IhmJ06U9AAAAAXRSTlMAQObYZgAAAHRJREFUeNqdklEOwzAIQ/0wu/+VJ9i6RpHaLjFfz04IQpEkAWjQI2viCJsVxh5aEPXCeeIPFjhPozLyxcgiucsHPi7MPDe8PK+apvU1V7mc6DURZoeFWxl2z73KtZEW6T2uhX3qt7fDWMy1l/fX7NKFcZe/AVggA2FH7M3AAAAAAElFTkSuQmCC","w":16,"h":12,"ms":[100,100,100,100]},"dusk":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAMCAMAAADlLUv7AAAAElBMVEUAAAAaFCOPT19eOlo7K0shGjMm400/AAAAAXRSTlMAQObYZgAAAHRJREFUeNqdklEOwzAIQ/0wu/+VJ9i6RpHaLjFfz04IQpEkAWjQI2viCJsVxh5aEPXCeeIPFjhPozLyxcgiucsHPi7MPDe8PK+apvU1V7mc6DURZoeFWxl2z73KtZEW6T2uhX3qt7fDWMy1l/fX7NKFcZe/AVggA2FH7M3AAAAAAElFTkSuQmCC","w":16,"h":12,"ms":[100,100,100,100]},"night":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAMCAMAAADlLUv7AAAAElBMVEUAAAAaFCM/ZGYqR1IdMkcUITpbvjHCAAAAAXRSTlMAQObYZgAAAHRJREFUeNqdklEOwzAIQ/0wu/+VJ9i6RpHaLjFfz04IQpEkAWjQI2viCJsVxh5aEPXCeeIPFjhPozLyxcgiucsHPi7MPDe8PK+apvU1V7mc6DURZoeFWxl2z73KtZEW6T2uhX3qt7fDWMy1l/fX7NKFcZe/AVggA2FH7M3AAAAAAElFTkSuQmCC","w":16,"h":12,"ms":[100,100,100,100]},"overcast":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAMCAMAAADlLUv7AAAAElBMVEUAAAAaFCOcazxqQSg7IhkbJyOaV3HLAAAAAXRSTlMAQObYZgAAAHRJREFUeNqdklEOwzAIQ/0wu/+VJ9i6RpHaLjFfz04IQpEkAWjQI2viCJsVxh5aEPXCeeIPFjhPozLyxcgiucsHPi7MPDe8PK+apvU1V7mc6DURZoeFWxl2z73KtZEW6T2uhX3qt7fDWMy1l/fX7NKFcZe/AVggA2FH7M3AAAAAAElFTkSuQmCC","w":16,"h":12,"ms":[100,100,100,100]}},"bird":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAECAMAAACqVq9QAAAACVBMVEUvLTwAAAAaFCNO45ySAAAAAnRSTlP/AOW3MEoAAAAsSURBVHjaY2BgBAEICQZMCCYDWJyBkYEBgiECUB6MC9PCADOGCcpAMQjZEgAUgQBdMWdehgAAAABJRU5ErkJggg==","w":7,"h":4,"ms":[100,100,100,100]}},"twinkle":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFCAMAAABl/6zIAAAADFBMVEUAAACPo8fT4PL7+/9St4XaAAAAAXRSTlMAQObYZgAAACdJREFUeNpjYEAHjAy4ABMqgaScGSTGzMTAyMTMxAhmQcQI6sZnNwANjgAtVOXBlgAAAABJRU5ErkJggg==","w":5,"h":5,"ms":[400,100,100,200,100,100]}},"streak":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAAAKCAMAAABCIAY9AAAAFVBMVEUAAAAvT7NPj+CPo8fT4PL/8Kj7+/+5PIFZAAAAAXRSTlMAQObYZgAAAEhJREFUeNrNkUESADAEAxH8/8n9gINOajTHPUjGikxEVbZjtl5W06HfAH36wQRajztLaT38BFpPBEvbelAeeEH7epApI/RCzwGpnAEl8ObDyAAAAABJRU5ErkJggg==","w":22,"h":10,"ms":[100,100,100,100,100,100]}}},"effects":{"day":[{"type":"birds","sprite":"bird","every":[16000,30000],"count":[2,3],"y":[20,56],"speed":[10,16],"factor":0.12,"after":"far"},{"type":"crossing","sprite":"roll","plane":"ground","y":21,"every":[9000,18000],"speed":[34,52],"hop":[5,9],"bounce":[450,600],"dir":1,"after":"ground"}],"dusk":[{"type":"twinkle","sprite":"twinkle","count":6,"area":[84,2,236,36],"after":"stars"},{"type":"birds","sprite":"bird","every":[11000,22000],"count":[3,6],"y":[24,66],"speed":[16,24],"factor":0.12,"after":"far"},{"type":"crossing","sprite":"roll","plane":"ground","y":21,"every":[14000,26000],"speed":[30,44],"hop":[4,8],"bounce":[450,600],"dir":1,"after":"ground"}],"night":[{"type":"twinkle","sprite":"twinkle","count":22,"area":[84,2,236,96],"after":"stars"},{"type":"shooting","sprite":"streak","every":[5000,12000],"area":[110,4,190,34],"speed":[140,190],"head":[1,9],"after":"stars"},{"type":"crossing","sprite":"scorpion","plane":"ground","y":21,"every":[12000,24000],"speed":[7,12],"after":"ground"}],"overcast":[{"type":"crossing","sprite":"roll_near","plane":"near","y":50,"every":[5000,9000],"count":[1,2],"speed":[50,70],"hop":[2,5],"bounce":[400,500],"dir":1,"after":"near"},{"type":"crossing","sprite":"roll","plane":"ground","y":21,"every":[2500,6000],"count":[1,3],"speed":[80,115],"hop":[6,12],"bounce":[380,480],"dir":1,"after":"ground"}]},"speed":{"overcast":2}};

/** Crée la scène « Désert ». Voir les options en tête du fichier. */
export function createScene(opts = {}) {
  return createSceneFrom(SCENE, opts);
}

export default createScene;
