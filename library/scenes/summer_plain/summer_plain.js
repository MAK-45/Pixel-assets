// summer_plain.js — GÉNÉRÉ par pixel-assets (scripts/build.js), ne pas modifier.
// Scène « Plaine d'été » (scenes/summer_plain) — dynamique : parallaxe infinie, défilement dans les deux sens.
// Base 320×180 px, ligne de sol y = 150, périodes : day (Jour), dusk (Crépuscule), night (Nuit), overcast (Sombre).
// Plans : sky ×0, stars ×0, clouds ×0.05, mountains ×0.1, hills ×0.3, meadow ×0.6, ground ×1, front (devant) ×1.3.
//
//   import { createScene, fitCanvas } from "./summer_plain.js";
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
export const SCENE = {"format":1,"id":"scenes/summer_plain","title":"Plaine d'été","type":"parallax","w":320,"h":180,"groundY":150,"defaultPeriod":"day","periods":[{"id":"day","label":"Jour"},{"id":"dusk","label":"Crépuscule"},{"id":"night","label":"Nuit"},{"id":"overcast","label":"Sombre"}],"planes":[{"id":"sky","label":"Ciel","factor":0,"y":0,"images":{"day":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAC0CAMAAACe2Z23AAAACVBMVEVPj+Cf0P/T4PIyMSL8AAAARklEQVR42u2K0QoAIAgD1f//6MgWOIrwLRAng/OYSNEo+nKKk9Bt+Gc+DJIyDWXAdF3OgG7GTGdp4442HsE2GGxp09DwCwaJ5QchalLxMgAAAABJRU5ErkJggg==","w":8,"h":180,"fill":"#4f8fe0"},"dusk":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAC0CAMAAACe2Z23AAAAD1BMVEU/H2N6P7DkaprgeCrzw0oTW70HAAAAX0lEQVR42u2JQQ4AIQgDS8v/37xBSFCz5z24tmkcB+DDWG022b62aTaLYf6P/AFosTa0LOrlm6mANHIzh4EYayNmUa/eTAUSpc0cDq4s5FJsMaNwd8UWMwLVrc2FCys8jWsOQdWAvTsAAAAASUVORK5CYII=","w":8,"h":180,"fill":"#3f1f63"},"night":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAC0CAMAAACe2Z23AAAADFBMVEUHChwPFjQbJlIdKmtAbDrJAAAAU0lEQVR42u3KQQrAMAwDQUv6/59LsUpIEIXeerCNYTOk6mcD35vBuyqIJwrwXMtEDALgIb1JXEk8Ucj7lkzEEEkd0pvElcRTEqVN+q3tz8TE17gAkyUKsUa3w+YAAAAASUVORK5CYII=","w":8,"h":180,"fill":"#070a1c"},"overcast":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAC0CAMAAACe2Z23AAAACVBMVEUvLTxXVnCLiqN9r8hZAAAAQklEQVR42u2KMQoAMAgDTf7/6A6mFIsUujkkIXAeRgwLtJeDeqgxSmuAvTQGw3AgAF4m2xlRZ5QgQRaTN8uPwfALC2zaByFbZMt1AAAAAElFTkSuQmCC","w":8,"h":180,"fill":"#2f2d3c"}},"kind":"sky","body":{"x":30,"y":12,"images":{"day":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAABwCAMAAADxPgR5AAAAD1BMVEUAAAAaFCPzw0r/8KjgeCoZ3VjFAAAAAXRSTlMAQObYZgAAANVJREFUeNrtl0EOwyAMBFmX/7+5AhIKUXrrulI784HJ2lh2SvkyUrIvQgg/2TpFnEZvM/XSDJHMUXUEk4ZxSWozasTqJiX08ox1KMcXuB/oozGNSb5DWFWyhDOiuYOKXdgiyjb0Ct0IVWWZ/jFzUxiLsFZHL6ewK8MvnCXdMJZ0PprN53w0S2XXgAmb8BIw0dh8bmNrWT1148WY4/X1VDvqI+He+PsCdo3g29tJ9ogq202TdRHbS3lnTD6Ef16Y/vcEAAAAAAAAAAAAAAAAAAAAAPDXPAEMbANQXF7hJwAAAABJRU5ErkJggg==","w":112,"h":112},"dusk":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAABwCAMAAADxPgR5AAAAD1BMVEUAAAAaFCPgeCrzw0qyOiwlm1mXAAAAAXRSTlMAQObYZgAAAIlJREFUeNrt1kEKwzAMRcFYzv3PXGgaSIO3+qFl5gJvY8naNgAAAAAAAAAAoNM45HJ1yCTHmHPOXPKduyZTvVDx0juD+0gFZyD41TuDncV0cNQy2Fd8IFiLV/pnwbr32oOfZFUueLP3zsUq2Dn46eCq2Ly808FFsf0HDvcuJ1TyjIrmHrhL4ee9ANvuBFa3IH2XAAAAAElFTkSuQmCC","w":112,"h":112},"night":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAABwCAMAAADxPgR5AAAAElBMVEUAAAAaFCP7+//DwtSLiqNXVnAv+wMYAAAAAXRSTlMAQObYZgAAAMFJREFUeNrt1zEOwyAQRFEWlvtfOUJAHAu7nEnzX2N3X4sRwqX8Vyy2XJ2aJTlzbdEn46c2k+aeuBhHTlt87AmLL72W4QpmSkc8B+xVOmI8L6gsOAbca2gpjmCv1uDt891eDEH7hNbg3jrXFhIGe2vZ5wfcz1GWBL/j9LlZ91MVvIqtrsWs2sM0zjNNOuCtaOn5g89FYW8Xu613zpjiXimR3t64CF8nW6bp7p2L8e/C+jMDAAAAAAAAAAAAAAAAwOsDz78Htog4tFwAAAAASUVORK5CYII=","w":112,"h":112}}}},{"id":"stars","label":"Étoiles","factor":0,"y":0,"images":{"dusk":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAABuCAMAAABhnzpqAAAADFBMVEUAAAD7+//T4PKPo8frL7sLAAAAAXRSTlMAQObYZgAAAGpJREFUeNrt14ENACAIAzDA/3/WK1BJewKOBSPekgEfSgEGmF3wIHgAs1RvcWt2KCO4fgh6AyQHQMkhFg3zSxOUwIHfqTmWpbIWeBRr6xqTLgkEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAODYAPwAL17YbmEAAAAASUVORK5CYII=","w":320,"h":110},"night":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAABuCAMAAABhnzpqAAAADFBMVEUAAADT4PL7+/+Po8ecpS4YAAAAAXRSTlMAQObYZgAAAUlJREFUeNrt3UGOwjAMAMDG+f+fuSAOSCBE28RxZq4rbRvXdh2yWo6juPbth1F3aZddJNrpG4tjZ+2vmO8dsyVKY73b67f81jSpqmYWjETzfIa/oFOsumcJdatWUnrLzY2pyYJSjSlpsrVnucUfXbOLqQ7uISALQPHA7H3ToszSmz1wbxF3xN6VIBvBuARXjcmhNLGl2yB+m599hgy0+omrmFh/vcQqXs8uFomVLqIrSiGw4SP3bA/gvQuw6sYzNr46MLzRxaofyelW8ljafYnY+3GXgqk4MjpPAQAMLNXj5/8AyUBkil6V14fPWnr6DHTQDmCk2ZrTEhQAQ8Lg+0lA15rDnh8AuGua8i1qky81bli8/OCvnU2vniQypxfsA9xtdpxhZ8vwF8/EROsrlfSv77iKhRu3ZiDlp9500+wVGe1Pc2UgAPU9AKV2APul4SoUAAAAAElFTkSuQmCC","w":320,"h":110}}},{"id":"clouds","label":"Nuages","factor":0.05,"y":4,"images":{"day":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA8AAAABACAMAAADiUO7sAAAAD1BMVEUAAAAaFCPT4PL7+/+Po8e6KPQEAAAAAXRSTlMAQObYZgAAAwlJREFUeNrt3O1uozAQheHY5P6veUWBLJBotVXtgXGfVypR+icR+HjOfMSPBwAAAAAAAP5FmXEbgJz6rTMUDCTV7zRNEwUDefU7K5iE5TbItkTqJuCpkrDcBvnC7yZgPlpug5z2+YXFIrdBmiXyXPd4ApbbIKeA69cCWf7YNbkNsgn4iHUit0EeAT8JWG6DzAo+YZ3IbZBMwV/jAvQrt0HCpbKN+pSQqR/LUG6DxJtFNRoot0HSRVnXnmaovSiJFSy3wY2W5N+phLAdI7H3DM5tgP+Jv9tcUcSKjI/4GM8K4azfWVMBgbFsn0jBN3j4ynDZd+DzZFHn57n7wGqS+OJwyQqNkP6eRwO7Ps9DvLd2Lg2XrNAQ+n2j1o6V1TKFxvsPXyB5rtPshnWxQkV6fVX6Gy/g2v3DPnnQrP3u1uGysRUq63dcbm6RXgdZss8C7njbtzCyThLXUAHnTfnah8umVmhRbnk1MuaL9DrOP9dpU1V3X1veRonjBFymrClfh8pBSyu0Knfzb8suE9uZ/K0Crq/m0cLyn46qehNw3ChTfL/7zpWDZlaoPMph/6/T/ueWtT41G8KCYUBYvG6UOLzffe/KQSMrNNvlg3JPTY3KSQcIeNbRcunva7cJ4m2YOOjJhve77145aGOFSj2H3o8vsaXKXyPg92AYERd3E8RxRja83337ykETK1T2p5PU+sFJVyM7AQouK4/ouHhVDpktLPSoHLSwQqXulfu3kLK8265GdvoGw/PeOF7Z8IJ+d4LKQQMrdNxYnrtrZF0F4yf74f3uMSoH3xLwsZLyfJMzAeOH/jmw3z1E5eC7zqCcCimOLkEjAYf3u39XGWU9peSxFlL2dZVykYBNYo/koKu8rK8zOKrl8O6l5BL/0D3dsQQc2e/Gtc/c/MhoNi+6340LbYEfOg+p4OH73XDmy7iJ2vj9bjjzBUgu4LwTswCuPfMFQAMLfdGZLwB+KmDNfmAcAes1AIkEbAYbyK9gvX4gp4Jv+cstAAAAAAAAAAAAAAAAAAAAAAC+wR/vBxgG0N8PvgAAAABJRU5ErkJggg==","w":960,"h":64},"dusk":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA8AAAABACAMAAADiUO7sAAAAD1BMVEUAAAAaFCPkapr/s896P7ApefsCAAAAAXRSTlMAQObYZgAAAvhJREFUeNrt3MuWqyAURVFB//+b7/AZpTCdqxFwroZV9qpiVtjscULXAQAAAAAAAAAAAAAAAAAAAABwJWH/+4iXBKjF3BDirOx4CXGEwUD5+k7mhr7vYxzX3fES+/nWqwMU7u+saj8rO0zXyd9VaC8RUGx4Xs1dlN1dJ5/HIE1hoNTwfDB3U7ffaS1JA0X6G9OlN/sjxoHBaXDZfwraZuApfz+uxkySXn9I0Qdz9fUoSODlurLerdfJZu/Qrqumr08jgUfXrMB7ht01gxRdS1//iQR/4wKaFXgYhmG+zHepzq8XuJa+PiyxaQkI8234eIx23pLDgbBdsrz76dfR12/CbuFgWG5Xj9GgwbO5YXr8XVjuFgi81QXF9/WjvHE1NokIq8eCdGPryiLtPl0d7jaTQ63/3hVtThV9fTj+YX32c0aQRmV7/CvanBr6+rCuvV+DwvgXMhiV+HtVm1NBXz/l50MaOM0LDEYN4fnCNqf8vn76t3KZIMkLBEYN+l7c5hTf14fzPJCJCwTG1W/AZPX8r7fYDW1O6X39XuBjMjjEhXcLXMicTVtzcjfMFt/S5hTe13+JA5m08EaBlyakhGamoTm5O2aLX9nm7Nf/fSRI0sKL/S1kZL2tObk7Zotf2uZk1v9MWghv/epj2AbmwrPPqKE5uXtmi7U5OFt/n/3SSWNzcnfNFmtz8MXfJYk9UTO2NSd322yxNgeZpa9PVoefP/jG5uTumy3W5iBTtPQPG9xas3rjbLE2B7n6KhH4tx/ezTWrzgJpU5b0g7Ss7e9jArfXrDoLpEFzSzzq78/2d2uynhK4jWbVWSCNtUSFHvUXkro3xkd2wQ02q84CaawlKvOov63AivvdZvx1iG6xWW38LJAXheeSj/oL8ZxfmqJZRbHhueSj/sJJ0aJaASo46i/kN512ZkAVR/2FdO/ZfTagHiAIXPxRf9kexV4TMI4DNCOwcRygMoGN4wD1G2wcB6jTYOM4AAAAAAAAAAAAAAAAAADgTfwDhxclRCxAxk0AAAAASUVORK5CYII=","w":960,"h":64},"night":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA8AAAABACAMAAADiUO7sAAAAD1BMVEUAAAAPFjQdKmuPo8cbJlLDev0IAAAAAXRSTlMAQObYZgAAAvNJREFUeNrt3dFu2zAMheFY9vs/89DFKLIkG5pi1RGZ778oitwEEHNk6pikLhcAAPC/2SwBUFW92za2jYaBkvod+77vY1AwUFC/+xUKBqo+f08FS6QbBdYSvJd+PxQ8PIabhJWt8SZxHjcClkj32ZavvoZY9j/+3gmYgvvod993seyu3wfGOES9dvJ8k1bZjd/k+EvAfR6+4/ZYRMFvkGfdCVjMGwX149WCZemdP48z0k7BDTfl4SDcWMDj8+XRODOvIYmuHNPjeVYlnG0PS88h4F4CllK1FvBxHMf1DwHXj+lzX0NAX1vIErv1PTefiHfxE/D535BFf2MZi1Sxfep1O/n9CnGj3+IJ9LizNRhZr26DiaTlO9/2KdyHT0WxYva1Hf+wNTZL+cUvDRw7VK7Lvv4U8KOtsVnKF56/c5vz0pXrdo41IrE9tTOKuhqhKROJ5rxs5bqn/yqROBV8Y2ecjkZJ/Ub88/nNefHKdeN4VonEc//iuc9R5Pk7e8rE/Oa8eOX6AuN4tkV+cXoIaieyiea8eOV6fBzPKgm8HoLSiezDrjFHwPHK9fg4nlUGT+ghKJ3I/iWGP92cl65cz4/jWWXwhB6C0ons3ddOa84LV66Hx/GsNHhCD0HlRPbu5zyvOS9buR4ex7OUadSzh2ALLWVmysT85rxs5Xp4HM9SplHHHoJUHVRsysT05rxs5Xp4HM9SplHHHoLU6/3clInpzXnRyvXwOJ61TKN2PQTB1/vBKROzm/OilevhcTxrmUa9eggu0df7ySkTk5vzopXr4XE8a5lGrXoILtnX++80ZSJZuZ4dx7OaadSohyD+ev+dpkwEK9ejG+V6plGbHoIFbtsxZaL9RtnQNFrPvnJZR/dA5zbKfqbRmsdfAgbTqJp+3baDOQpuYxotmT+7bQc/nL9/JaPH6wJ22w5QN4N22w5QX8Bu2wFqmgtu2wGqK9htO0BFBauDAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+Dq/AO2PIOkLiPmJAAAAAElFTkSuQmCC","w":960,"h":64},"overcast":{"src":"data:image/png;base64,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","w":960,"h":64}},"drift":-3,"driftBy":{"overcast":-9}},{"id":"mountains","label":"Montagnes","factor":0.1,"y":30,"images":{"day":{"src":"data:image/png;base64,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","w":640,"h":104},"dusk":{"src":"data:image/png;base64,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","w":640,"h":104},"night":{"src":"data:image/png;base64,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","w":640,"h":104},"overcast":{"src":"data:image/png;base64,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","w":640,"h":104}}},{"id":"hills","label":"Collines","factor":0.3,"y":98,"images":{"day":{"src":"data:image/png;base64,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","w":960,"h":52},"dusk":{"src":"data:image/png;base64,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","w":960,"h":52},"night":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA8AAAAA0CAMAAABy46E7AAAAElBMVEUAAAAMEiQdMkcUIToqR1I/ZGagZk0YAAAAAXRSTlMAQObYZgAACalJREFUeNrtW9mS5CgMRID//5cnzH0aJLDL7pFeeoPpLqR0KpXgWiE4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4/kKAC66PHzTH1/AGACmlVEqpP/lo/3p9GCBOEE4wfgHEfyceQ+JtQQRAa61i/DWA31rf43S23etCa/0sEHeJBwrGRzEfEW8PIucu0svEcxR/DMkf1Teq8PlZmLWvQeTJFr5JPFDe6lnMR8TbhIjfpdzpr1jan9Q3rPAHs7BqX9fCj6jxTeKB8lYPYz4gXheRDEiI8Ha3iQ9T6mcYfgG7SxViLMN4S32N1NKlAbF+MQsz9soEFXhAjeniccldjLfaj3lkaOtzBsTrIWKYcxoE9yHgyBSWyt3jNudGqsvwfY73AvaQqvux4HWw9eEVKEIKxdLQO90wC0fPJ91Tnf0LsYOXHu3MECSLR0HnvKVR3mo35qlqibTqOeL1EAGtD1sWOBGAZCk8Jdvn56JyCtEAQsEtZ4cL2F2qScYYrwP0+pBKlaNsZDJdAtBwRaz9s3A8A/2e8Tlq8LgoQ2Wj/iWQey4YKvGQk+JR0jkbRyhvtRnzXLVEqHqWeD1E4KzXAWorVNmS2weO40g+WaaYNhi+9exwAbtLNct42usYCtPqw95y5ChbmUyXIMy3JrHIdF6YgaF/Nfj+PXPUFh63+3Ec4J62rBzbwgVDXnB8+EPxqOmcjiOMt9qLealaIjB4lng9RHz7SyWVJVKxZJ/vCYuO0KuknnMf86txLO45O0w4C5dqnvGk1zkhDZ+Dqg9/y1GjrNIls+ClpyYWmc4LMzD27+lqHPtNjjEDE0eAYMpeTg3BZsFyRjxyoKtxNO+t9mJeqZbw204Sr4uIL1jbWaQPWSyZPz3cNjrTinyjCMTi9QPC0hb96zOe8jqWSfZzcPXhbznKBMucTS4KOsSi03l9BkZpcTmqon+1Po6YWR9yzAVDUAQDe0bpgXiUdK7H0aS32ot5rVoio/CQeH1E7Ee7TlGg3TiIS+ffHqcJOfobqXwq0q8fsJbWpVpmPON1PKamf1H1EW45SpSPHHizIFWng+l03jADg7RUObo9T9yOCICGDRcMAdei4LF4ZEC3x9GUt9qEeV+1RKx6hnh9RILf1L5/ZbZ0/oaZT1czSvXNOu76AWtpXapVxmOvA8lH4+qj3CzlCVqZTJYs7nkDJ8Qi03l9Bsa2LXMMe5p9E17D8gVDxiDVL7ghHjWdK3Gf8lZkzGdVSxQ28pp4V4hAwF75R5ssnX8b/WW4DWjQ2mRwddgeXz8QLK1LNc94wuskLEbWl7xWRyhVmqBrhbgUeqPo4PHDG9F5cQYmqVU5JpJnWFzI18IFQ16wumqeWjwyOjfH0Yy3omI+r1oirXpEvGtEwAuNZ5ZUcemcvzqNJCmZ2Ay/rMhnB6KldalmGU94neQ2A1df+7X6hFIlKPu+dUthIU2+bWhQdF6egVn/lgJ5FLjF6mHxgsFvnt+T56eUvngEoNvjaMpbUTFHqJZIqx4Rb4DISS77oNXhn1dYirnq8jHIaDMO/w/kswPV0vpU04zHXsf5quzfp+qT1zfDF0oVE/Qy6ZeShW4DE+i8cskOvn/zaZbk2EZN+y5auGCA5EbwOJLUZAJrXzwid5vjCOGt0JhjVEsoVZnoHvHGiJwCq9LDkdVcBUUTFnMmbGQb7kgaGHt2oFpa2xomVftjzutAq/dm6gsdjFYq0C7BKJMKXOrJQlkhmc7LMzB6e5NakmN2XGhdLS5dMIS36raamJosKdQUDwh0bo6jeW+FxhylWiKv+pJ4E4i4BgZzYjg5BuqqgaXOcDhCr9HPazRL63vDpJo08NDrXDdwtz5vxAi3HOYit5TJM+dioVUhgc5Ll+z+ucceyHOUgwZeuWAIBUub85G/pRuKh73Vl6oxjia9FVFCcKol8qqviDeBiHvZd/YvSPPTv/9TjblUARcnOfW8RrW0kLyq9BnP+Eto9e+4vtjAaKVynWomcZRJ+0I40828Qiqd1y7Z/eWEji8bsxzbiGXzhH7BEN+oO+HMQNYj8VDh+xvVOJrzVoKGOVK1RFH1BfHGiIA7CNt6zawIS9nrkcpoFvSln9dolhZ87QAqZDzlL9uvf0b1uRuq3OnOKVWSYJRJuwQqLITE0goJdF68ZIf43WfXAyZ8jrKBWPJGefGCoaWYDV70xCMSAhJYw9dRxt5K0DBHqpYoqr4g3gQi4E8O/u4S7MEBQHXyTV8iVv2Lv34gWlrbrOYNSWDY1HEJ2q9/ckhMFBlpnTQwRqlARUi9TAbg40KrQgKdFy/ZwdYmM0umQHbMc/FGGaXGHucjOUOUbVIpbV883KUIuAOvSzmdUCNvlTQwBnOsaoly9Pcbi4JIMWE6kZA8/99W0NcPNEtLPy7BsDKts15Vje+qoJSqqBCgSBGgdygh0Hn1kh2y+5WAFkzSYl6NU5y9eXDiUVY8MUnyze3hEGQmlENvJYL/wGGO9ZCiHP2XeKIRgan2LUi+cP1As7T04xIMKjui12zRlqBURNNOo/PqJTt0vxqLa+CBGpc4y+QSgxpjb9XyjtFb+QbGYo71kKIc/VOCiMBhHDn4qd3EXz/QYF84Lg0ri7Oq8csEpSISCxZZrAbHg85BEJZiUqtqnKtvAi2VTvrz+mscY+eJUi33O6K6VpnAk1ZSe0Q3wF/pJ+rDWjouddzHURh8JaFuRqxSwZN8vGRT5Zzqg6BcikmtauM8NTvuZTtQjldYhyXK0X8F6FLMk3yhnxYaeOG4NCotFFf8KkWpqMTaPQPr40HjILirgS8La+K8QT7W2Y51njnkcw5LTM3Ju6IN/ko//UptW6Ud1UvT4ndptxz7ZZQwA2vn1DoIPtDAPZyfpjKa+Q3bTxHonzZwH/z9Xn1d6lEbQvalh04H3zL5tz6gibEXnNOOJ4Efgl2cX96/veMVuoGXFHpDFU3wH27gG6YadN65lA38cKGbGrhrWx+fBlM4v7l/q+MVknzil2V0wX/QJd5UWtP/lsx6fQPL7thrOqfnn8Qczi/s3+HxajbE20n+yTBfPNPpgbB9N/tNpZo6HrwK5xfO3134ideT/JMN3Lr5/xnN/65t/SbOW/ETTPI7zUUtUd9v4Bc5p0/ivBc/wSS/xVxkTyhUaF9Xf764tzinT+K8GT/BJL+jtiJk9h8fb+D3OKdP4rwZP8Ekf6C2X35Z5g87p0/ivBk/wSS/o7jXv+f6G87pgzjvxk8wyTnYOX0XP8GQcrBz+i5+3MAc7Jw+jB83MAfHh4MbmIPjw/EPQSItp2uML5cAAAAASUVORK5CYII=","w":960,"h":52},"overcast":{"src":"data:image/png;base64,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","w":960,"h":52}}},{"id":"meadow","label":"Prairie","factor":0.6,"y":92,"images":{"day":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABQAAAAA8CAMAAAAOuue0AAAAP1BMVEUAAAAaFCMfSiwuejo0hGharkUhXk8WOjel11pirXzgeCqyOixuHySLiqPDwtRXVnA7IhlqQSgvLTycazz7+//tzWXHAAAAAXRSTlMAQObYZgAADspJREFUeNrtnYl24ygQRV0w2GrLjpfk/791DnuBACFLAsmicqYnvSSRgbq8WsCnU7NmzZo1a9asWbNmzZo1a9asWbNmzZo1a/aNBsIO+crb5DdrdnT8EcrtgAiE/xoBm7Vt/9ijwfHHuNGjDQycz42ALVho2/6hF7PhHyfgsZY3XBoAJ64YESuQhsBd8+98hiYQTeRLDP8YO1YsDJdzk4CTBkxFChyBbTR2DMALNIGo8CeMr+pO4u9AsTBcOAD/NQJmBwsmUhAisMXCuxWAKQIeJC+E+Uet/DOx8FH41zTghMjXRAoibmix8D75948DME7AY+SFgJAB/3AsfAwAXhoAJ0a+IlIQnyprsfAO9V+KgAfJCxkByMR/WAB2x5CAhn8tCM7jnyagC8BGwF0C8BID4EHyQo4ApIy4WvAgAORzLT4aANMjhSPfAQFJI+DuAuA4AY+SFzIAJPoXs6gPA0BEwObCowKwwxJQxQ1NAu4QgGrJXyAGwMuBAGj6YKhY4SrVcwgA2gi4xcCZEbDVfcSJgRsB97TsLf8g5RXf7RMgAaj4Z7tfmP4f7wX88i3gggjYAJgBQBMg4MChAXCfEXAkBj5GXsh0QEcAaPqhj8K/RsBxAJoV0lkCKg42AO4IgIh/IQAeIS/k5v80B8XOjpocvjsMFvxDBNyU4N9UizFvf6Y4OFAS0BKQ7KcZ8Oi925Z/YQIeIi8ExJgBIHGLwN9/IIRvdHCB8+W8PcEPWyoteB3QAwDuqh8axLMfl4AoAD5LBQBfmBca0w8agIxgBeiEwOK33TcTEDz+/duG4DfnzcxZsy2Ev+iwpOkWGEQRO1gp0HXdoQloSsDny1lJgO/LC43pByQA/RSgDXS+/UScHwFvZLa13OrYRlpM7BEQtwxMLACNbX2pADABQFbrso/6mQ24/PMICLvJCy2mH4YAdPqfvfX+nQAM8G8LBDRzhxtOoPYDdc6O6IXAVEQSewCgDH879fwVHhaqVxZxBjAUA285L7ScfoBhBtDyz1aA6y2UYvzzCFh9vwNbYmWq0fjaVyUgODkRJ0dik4D7kIA6/GU1wmB87SatpgNd/gUIuNG80ML6YQBATTu1Oep5kt+leg5qhdUCIfxtQAPCQF4JAFYEC3hVMacjelcA1OEvf/Su9NZuz92zrl6HGa6AWP4hAm40LzRDPwQJCPEMIOqAYWwTpchVynZK6eO9jqdEzrAFAFKnwtDfKgMQrwUnTqDDLOD2AahygIUBCPikPanVYebrP4tA2HReaI5+CFfnAAGQhQBo8j71+bdOvAKnAAH/g1P1EJgyc9CCaXleGYAoGiBOpIAKwLsAIH/yzhCwIACB0P6qbl1i9tQpFAcgnL0t/4IrwRvNC83SD+MA9GlJHau8plcr20Fks6stAI1z2Ksp6hIQnHywv1H6WcD9AJAWBCA/dsAB6HeclZeATheM7YOBTeeF1tAPgACodCD1P98C/9Yq24X3utq7HbCOUdR1YuekNgFtRDAAIEMA3DT/BPkQAMsRkAPw1juHrirFwJEiCCyaF6rW6DNFPwBoAKb0X+W3RlqtbBfjX93dDqgttqIO4wBcSraTwTAoGHy+AwDqUEIVQmjJLKAYQsU9W2GkFULgf+EUoA6B5+eF+Lq83+9VuDFNP2QCcAtrdvGyneHftgioMxgm5XbtwwAs207mvnMCWiX2833VgJkOgQsNIeafmmDVpgaF+XeOFUEkAefmhQT8ftjPj0Ag1HGfDP2QD0CyAQAuX7aDBP5qRsFghl25SH8joRmEwmVEADqiAeUDbrsJkDn9jAUBKPmnNw17yJ6yznvbnXWFfYp/goBz80JwZz8/jLH7/c7YvXiEP9APNL05gwEgvtSDOKc7of6aXaFsZ3IdF78oVrcTRoKtQy6C8KLmwrbTdqqhtiSZ0wAs6MwfuodMpaiESiEAgn/kygLQ28PWvQFjGP+6CIS5eSHg2LtTyvFH6ePO7oUFrq8fDNMSAByxLQFwwaQJgCbgxePf5b8Rr13Tr4GQa48v4tF4uV57NReA7+wh5Xx4MgBha9dJin5GnAasAUDRC2MEigdAe4J1JQAGt3srBmbmheDOX9edG6X3x4PRwgTM0Q8TCViZf6uV7VJzndb7K2/SvOt5iBrS9zfFP9lMwUr304Jz7wtxrhLXa2zIv20dJAddTEMALBQBm2zTrVfihHhJdnWCv7Nn+NfIZLg9MOZafHEjwty8ELAfrvwkAR+Px4N/WhiAxCZZcwCoK8HiV3gKafMUfwZbyOmsVrYbmetU0nflTVpwQ1Y+fH0l+Xe99ebe2pL9tJOihSpRem4QLJaTvu6jVAkEZ9tNkbJDCwnduLhe9j0UA6Mc4Ly8EFB6V/hjgn+Px+Neg4AB/ZDQcjKek+gT9kJ/Uj1rvU7ZDsm/CAHDgr/EJi2ODNxMDpbPnTgKrOPfW28y6WJu+2sxCZjPvypR+sQ0YMFD7kBIf70OAchYf9UT6xzhZ/IE+NJHn0I1EDcH+HFeiMe/d6n97uzxeD+MvcsHwTSqH0a++Pl6vV6/GwpZ1inbwSj+woK/yCYdAE1/swIQhZ5ybm89u/ZlAjkbLYCJFkggWtAnR+qeeh1JA9KybUS3vieBHotbb/mnj/DrIK6/XZc9+RTGnyMBP80LnU7wuMv0n6Se5d+7cB3EqeHa/ExWDef5ej2TACwsC1cq20FS7EcFf2CTLkRAyz/ZT3HtKb6xh3tKmVDOxgYvGS6EogVA/W4VT72mMrjFe1wh0HAm6iEmAGaMicyHzGLJv78tubwiJWB8GOTjvJB8BdRIPywA36Ul4OfFjFEAQuGTcWuV7QAx8BLgX7D1PbRJr0lA0EYG+q+/UXNfo2wWLN5Q+8uDhSek0jAmSt/Upbowyr9VNnk+i5QHvEaacPlnlg/wVIYof40c4Z8DwOhm75eAJ+WFjABE6KsIwJR+mAtAec6kNAFXKNvBWBD8L7Dbuffs2FM26xTruK56cYWFZLdIJRH7Xvb46m6/oXZ9AD6TANzAqdf44KojnhD+ax7GLX/7JPfCWx9xTBC1LXTbDmfl0m+051+D4JeBP8sLGTZw/afJhyPg0gCM64d5AETX7Bcl4Aplu5y5Hu522ffsLKmyHMQAd6Gr4YtUf8F+sooABHPqy7lXt/aZ8oEKjNUE7z/8GNfjsQoBY/wTatCcjuMhBleHCy8vSPZBf5gXsgqQxQTgu/iBuLB+yAHgM1oEAb2cxfIuTMBFy3aO/EsS0G1rc+/Z0V3mK7YKOQDUmxkXEfynyjSgHpXtABDpPydKJ1tqiYb3+wdi/NOJfJhkc4QJ2NZd7wCX6X5fJAQ+J3OATj90bl4I8Q8pwMoAjOiHzwEoJkzMTsdKE3Dxsl0m/nzBD875GpkHXE0DKh8RM6iM94LbflpeGab4/dlKd5rEAOjcsVY3Sh+Op7W/v58wxx6miff9FmOeaxksVH/J281euHDkHmDFB7iuvP6/UOP/GP8uH+WFLAAx+dwIWBFwmf0k/2tnANA3McFoeyKUTNz9FkpaL9MD6It9OD/Pr/PvGfwPBMD4Jj3ruExkCpVPiRlUDsZ/somiRIKIN4o5V15knOBbtgjyTAKwcpQ+HE9Eq7+/IN4k/0zunk2wIAujiaZfCOVWzLvtyTyH6n/6VHF68u9faq93W2Am5IU8AmryvT0AhiYhdz8JuUbW12L9MDJg+h9xAD5/Bz9EOJ+9yUe4fJc/4wsScGnS6NetuH/yP/w1OtykcYvKdItMofQpOYPIydTtPeSqbtZUh+Z0gwXYmVg9tz8OQFT/RVE6LOLOOfM8HE80kI+/nxDeOACV/76nEjDEwuArDAAQXTUmBkznOcjA1VKESANwsL2ff8+v81N+fvkwLzSQgBEAhiYhdz8JuUbO1zr6IYFUtFgECJ6/wXlHHdZiVsZmvFzZLot66S1DArCLr6nhJq1vWbSJne4DS06kA0AxAOrHiWIiHbwjOZqJwSxMze3nxBfZAEQbWN6GvwT2kiP7F6YbWAcWfkvzLV8WSgBic26JkUe9RfbPzmsWIabuvr+ykUl8fJYX8gHImEfAtwIgq2CefsjxwxgAqfY+63IwYfODZVQgzBEB6aGSAGSJNTXYpF0ATt7h0iYHXHTavRwBrHDrFhKBRLck8/wot581fOPxxVMAcGDmnWbkavEupoS8DX9c28SEdGI88TjyHGAIY+Dk7ulnNuYZAoD41TpX0smjjqS/XUnS1SaopshMSgBK+ygv5E4Hv/yABgEIwUmYPoaZ34VFAqgMZqqjcOHvi90ORp92ztYU6MGLlu1SYm/S6w4KX7tG3avcVDNMepPOJV1kuF8SgC4BJYwtaPRvFaJj0YCT20+P/MjQGe8Rm+Uwu6bpR5wzDyZK/8yVx3IHU4f27+/vJ0jARQA44sYSgGyQ2sBjZs4/DnxtlBCTFJKZQXA/cF7IrAwnLzSYDjcGdiNgWsF8/ZDhh/ASAHRdzve+gSDKmJbpoWF+2S5T7KXH6ilfdWKxOJs0Cj7RJr34DCbHOj0Rw9QWyu0nR/6U6z0SgIGBCnlz0pfH3Tk/dzBhaMfW+LJumwIgSyr7+aopCcDYgOu8UMQlA1UCHfD6Vo9/vn4Y/RIFwBfQdTa/j3OgsbLdDOph/j1jrzq9SY87dm2bnts/jQwd9p6Q+yziywsK6c2ZkhkQInJU2a8nkSA3LBp3uJg4qTTO03/6ao+8gFyPlO2W8YacV73MJl1pLXi5/SQAJ+yvXoZyPV/eN/LCMgM+X4tLSqQnRAY8nhdiXzQd21Yu42W7gjNQY5P2A+6BDJ1MwNGI5DSBfyMRRlUBsOxwj9uaymRViTSWF4q45KFwNGO6l5qsWNlugyungvuVBiCtHd+sjbNZ9hU+n8gLlZiEOd9le/63BP8iZbuv21rW8b38lMypDe2WUFjR5xbZ4MhmrMxjrhx/rjwR3zLXc17JqQqQvgp7n7/C71Ge5PD2HbOw9wn+GIBzvmP5x27uthU3bSNaH4ZtvOdMwmkfz97mc1Me20asNjLbkC1kpzYEzTJcsg1Is6+0/wGXF6CiDTF9twAAAABJRU5ErkJggg==","w":1280,"h":60},"dusk":{"src":"data:image/png;base64,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","w":1280,"h":60},"night":{"src":"data:image/png;base64,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","w":1280,"h":60},"overcast":{"src":"data:image/png;base64,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","w":1280,"h":60}}},{"id":"ground","label":"Sol","factor":1,"y":132,"images":{"day":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAAwCAMAAAC2RjtNAAAAP1BMVEUAAAAaFCP7+//T4PL/8Kjzw0qPo8fgeCqyOiyl11puHyRarkUuejovLTyLiqPDwtRXVnAfSixqQSg7IhmcazxYbiD+AAAAAXRSTlMAQObYZgAABLVJREFUeNrtWg2TqyAMJO27qx7UIt7//61vwF5L/UwiirXZ6dydM2I2y4YgPaUEAoFAIBAIBAI+QMGh43227vtXG05wAjhuvM/Wff9qw+l0Op3Pa3IEUE8NNoi3Cu831L0bZdV8ljD893X+phAjJgGXAooC+PFS9SK1gPcedF8YhZgPbOfArwtBB1BQAoUfXC5FUfz8AC9esp0QjXWPd27dF0ch5cPQi8/wfLngKxE0BGpgAL+QFNfrX+LUeL2uyGoidNZd3rl15wkQR6Hkw9GLu3OB8/mboIOnpksAY9BBoCiivInxXpWH6na7Ac+ARNZd3ql3iywdAKqqspQcoiiUfDh6PcaW/oPXBM6G4r8/agA13oFx3qR4z1G2qiqobv4nw38M1l3eKTVn6hDqr6qspTjwGYWQD0uvPy1K/wETPpitpl9nsbqFtVmXoTTw1MJKDpx4kf+stZZtQA7rF94pNefq0NZfEAI7Xa9RkPmw9bqLoY02tdHaf2A+lAo+R8aBqDRqtApBhHA7Nd7TgDdr7dXrzzQglfUr75SaK6YOoQm0/rtesZ00ioLOh6nXo2q1MTUEQeZH3+Pg/ae92r40DNp/8VJOjPfc+1jbGtACrwNTWXd4p9ScqUPrv1YHtAGjKPh8eHpFk+V3juClQAYzhO2c9tVujFca79koAjFevAEMJqws6x2EyrrHO6XmPB28CMF9wYBXIEah5MPRq/ee7r0OqH6vDaUvad1Sw3dg0HEhEeNFG0C4WmtvlncMQ2Xd451Sc5YObRMIDkQbMI5CyAejF4zBD7z/6YcjoA3qtuj5gVlNGcOP59FuAIMBrQUOOKy7vCGh5iwdHg70/uNEweaD0EuVI/AKRIByDoC8rxcAaCOAGc8PaWW/p15yQGdNYErWnKfDqwHpOQCZ3cTtSo+h4+R5YO/rBiCOYMd7hNRLQGdNYErWnKcDI8hLFDK7iduVFggyQhmBICPEgAIxoOCDDVgLBBmhnHO1My78CqiNi66Mi65MHV0ZF10ZF12Z6GHyaHn05KNV/CwnF3Kx8YVyAkFGiAGdc+FrAZFBDJjNf9XtUA58p4JSx0uJN1/rptcM45gFRcpSZUqpmQfjOTsz4JPY7zDWseIGBTU5DeNZNnwDpkppZkZGeI9jYghhxhJboE9u5MZ1rLhgthomXmZhPMvffpKbGbDDFDHiF4OJIev2uam5IyQ5ZUUCFhVUM7tSE6dhPs0nbTVeeXGCltsmu6lt2Bb6ya66CjCmg193SXp5aub0JJumUeOV95uiTW6e2lSyqFprVl4EVi22mQ3X8MY0K201XnlJynU/77pTZZOF8jpvCrOrw87m5iPPAXdRJusflux9SdivAT/im4kMhyV7xM4M2L7xtGvDVue272DA4+qgcrttYINyn5r5V543d+BwCtTjzpyKJFjDVTavDb5uTq8NU4Z8ay/OvoRjX/2atbDaNlYlPQtDfmExtx3GHqS+txlH5Nn+EJFz3pZsG6uGHZea/7ZvtpTmlHpVwPeB/b6ZOmTzuRtwUcGrYccd7JhlojklXBWIfeAAEts2K0ZhPm5Wh3Dcgua0Zb/7EG1JtSj/kCrYqtYHa1EMKMiK/12uEAdy9yf4AAAAAElFTkSuQmCC","w":640,"h":48},"dusk":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAAwCAMAAAC2RjtNAAAAIVBMVEUAAAAaFCPQdF+PT1/zw0rgeCpeOlqyOixuHyQhGjM7K0tlDWPMAAAAAXRSTlMAQObYZgAABFpJREFUeNrtW4uO4zAINPUtjfn/Dz7ZaVrn4RiI82jKqLrd6uIyTAbjUK1zBoPBYDAYDAaDHuDg1vF+W/frqw0PeADcN95v6359teHxeDy835MjgPtocEC8XXh/oe7TKLvms4Xhvz+PEmLCJODZQdeBPl6rXuQ28L6C7hujCPOB4xz49xToAA5SQfETeT67rgsBdPGanYRkrGe8z9Z9cxRRPgq99Az988mvREBI1ICAv5F0IQyJS+PNuqKqichZT3mfrbtOgDyKJB+NXtqTC3iPAh0iNfQAROwgkBIHXbyx8oBedWxSsJ7ybn1aVOkAgIiiHLIoknw0er3X+vjiawKeJP4bqAEEvgPzvEXxPqsIEQF9/FfhPwXrKe+Wmit1SPWHSJJ9PIsiyEel15tjfAGlF+eoGfdZrm5pb0afSoNPLe3koImX+Y+ISG1ADesR75aaa3Xo6y8Jwb1d4yjMfNR6DSQJKRBifEE9lEs+Z8aBrDQCW4UkQrpcGu9jBU9EIeqvNKCU9Zh3S82dUofUBHr/8TtpFoWdj1KvfK8IkASpr37F4fsvtcFYGsT2X76VC+N9zj5EvQEVhxIV6wnvlpordej91+sgOBq8o/Dz0emV36x4Fgk8mjEYCY5zGKs9akACz2YRhPHyA2AyIaqey8SsZ7xbaq7TIYrQ50AhCA5zNPQefj4avWbP6dHrwOr3SJK+9G4C7B0QMC8kYbzsAAiBiDzpxjBS1jPeLTVX6dA3gd4VEp8PUQT5cPSCEuLC169xOQNIrMuyz3/VoGCNPl5EfwBMBiQCDTSsp7yhoeYqHd4OlKSRR0FqppfzBUQFMoCvAZjXzQKAbAUo48UlvRqv1L0GctYCpmLNdTqMDSjPAcTsVi53WMLEyXVwr5sGEK5Qx3uHxC2QsxYwFWuu00ERZBRFzG7lcocGw4lwZDCcCDOgwQxo+GEDBoPhRLh+JE6lH7Tyfxt/2EfbRw8tOCx8lL2xNwe8sTOgwR5CDGbA3wZ608AMeGcUHgHvWVCiLN1JKTEe0BWfc1nbFb6HuizzTbeznGU4fwes3JEC7zJWlghZ7ZpkqayvZkXtNG90F8pZ4jxJd3BqlTtS4F3GypKD7+jC7ZA0TVndVbqFLO1Q3amFt6Ge5oe2K1feKEFtm5ymduSTxSzZXXcBxe3Q112TXt6auTzJ+E1IufKwRZs8PLW1ZFm1FnbeBHYttsqBa/lgeiptV668JuV6oVELMmvtyydKtd3hYon+5BjmImWy97Dk6luCzQENZsClA8prbzhubvtlc7ZgBtxt6JQ3ifojzw1cxXwI5z76mQElow3xAWXNkLfZ4KTjTvnwvsGgsd0x1jWdhTG/sKi6jemo7zZjQZ7jh4iaeVvzHVAxA7zWkKy2D4j25k27ArcPfNXkZ9GQQ1qbDLjsuJuNWVaaU8NdQdgHbiAx9VkpCvPzNyG3cNyG5nRkv/sRbUW1aHNAw1G1vliLZkDDqfgPet3IdvKLAX8AAAAASUVORK5CYII=","w":640,"h":48},"night":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAAwCAMAAAC2RjtNAAAAFVBMVEUAAAAaFCM/ZGYqR1IdMkcUIToMEiTKA284AAAAAXRSTlMAQObYZgAABEdJREFUeNrtW4tugzAMjBs7///JU8LaBmjAZ8Kj1KdKW7UGn49zHFwtBIfD4XA4HA6Hww4KdOt4v6379dWmBz2I7hvvt3W/vtr0eDweMe7JkSi8NTgg3i68v1D3aZRd89nIkBFiYBLEQiJkj9erF4UNvK+g+8YoYD50nAMjAzpQoFJQ+kSYRSQlssXrdhLCWM94n6375ihQPga9NjHUVyIxFWok+hU57WfiaLxZVzQ1EZz1lPfZutsEqKMg+Vj0sp5cKEZEh0yNI+W9XO3AkjjZ4o2VJ46mY5OB9ZR379OiSQciZoZyqKIg+Vj0eq2N+aXXhKIg/ntSI0p6B9Z5Q/GqazAzcWRL2zKxnvLuqblRh1J/uZMiDnxHAfIx6fXimF8k5aU5auZ9Vqtb2Zs5ltLQUys7OVniVf4TETEb0MJ6xLun5lYdhvorQmhv1ziKMh+zXk+SwpKEOb9oPVQoPlfGoao0klqFIkIiQ7y3FWI+QWf9jQZEWY9599Q8GHUoTWDwn76TVlHU+Rj1qveKREWQ9dX/cfT+K20wl4ao/Vdv5WC899lHZDCg4VBiYj3h3VNzow6D/wYdgKPBK4o+H5te9c3KZ5Gko5mDCXCcy89URQMBPFtFAOPVB8BiQjY9l8GsZ7x7am7TIYsw5KB/OK+iIPlY9Jo9p2evk6rfMzLsolcTUO+AxHUhgfGqAyAlEYliG8OgrGe8e2pu0mFoAoMrEJ8/owD5aPSiFvLC/1/zcgVYVB+rrv9fg8Aae7yM4QBYDChCFlhYT3lTR81NOrwciKRRR2HppleIDWQFKlBcAyk/NwtA2AoyxstLBjX+U48W4KwBprDmNh3GBsRzIJjdwscDtzBx8jq0n5sGAFeY471C8hbgrAGmsOY2HQxBRlFgdgsfD+xwnIggDseJcAM63ICOHzZgcjhORBhG4tL6IQt/2/jDL+2Xfrbg9OFS/sbfHPDGz4AOfwhxuAF/GxxdAzfgndF4BLxnQUFZhpNSUjygG65zWds1voe6LPNNt7OdZTp/B1y5Iw3ebSwsAVntmmSrrK9mRes0b3QX2lnyPMlwcGord6TBu42FJQff0Q+3A2maWN2tdAss7bS6U4O3YT3NN+3QrrxRgtY2OU3tyCeLWbK77gKG22Gvuy69vDdzPMn8TUi78rhHmzw8taVkVbWWdt4Edi22lQPX54PpqbRDu/K6lOuFRi2srLUvnyit7Q4XS/QnxzAXKZO9hyVX3xJ8DuhwA346oPzvDcfNbb9szpbcgLsNneomsf7IcwNXKR/CtY9+bkBktAEfUJYMeZsNDh134sP7DoPGfsfY0HUWpvzCYtVtSkd9txkb8hw/RLTM27rvgIYZ4LWGZGv7ALQ3b9oVtH3gqyY/Hw35TGuTAT877mZjloXm1HFXAPvADSSWIStDYb7/J+QWjtvQnI7sdz+iLVSLPgd0HFXrH2vRDeg4FX9droKKA3jWFwAAAABJRU5ErkJggg==","w":640,"h":48},"overcast":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAAwCAMAAAC2RjtNAAAAMFBMVEUAAAAaFCPDwtSLiqPzw0rgeCpXVnCyOixuHyRic1pBVkYrPDMvLTwbJyM7IhlqQSh/C/+fAAAAAXRSTlMAQObYZgAABJlJREFUeNrtW4uSqyAMJfUuVUD6/397B+yu+E4iirU509ldZ8ScHE542VVKIBAIBAKBQCDgAxTcOt536359teEBD4D7xvtu3a+vNjwej0dVHckRQPUanBDvEN4fqPs4yqH57GH476fSFGLEJOBZQ10DP16uuUjt4H0F3XdGIeYD5znw50nQARQ0QOEHz2cdALx42VZCNNYT3qV13x2FlA9DLz7D6vnEVyIYiNTAAn4gqZ37TZwabzIrsiYROusx79K68wRIo1Dy4ejFXblAVWmCDoGaaQCsRQeBuk7yJsYbKg+6Yi2bGKzHvHOvFlk6AGitHSWHJAolH45ef22b8MFrApWl+O+XGkBLcGCSNyle38pprUFX4SfDfwzWY945NWfqEOtPa+coDuyjEPJh6fWrRRM+YOMHs9QM4yxWtzg2myaWBp5aHMmBEy/xn3POsQ3IYT3gnVNzrg5d/UUhsN01jILMh63XWwxjjW2tMeED26FU9DkyDiSl0aJViCLE26nxegNW0YCabUAq6yHvnJorpg7Qpe8c2oHDKOh8mHr9Va2xtoUoyHbrdxy8/0xQO5SGRfsvHcqJ8fq1Tyc7bQG0h/WId07NmTp0/nOOZMAkCj4fnl5JZ4WVIwQpkMEsYTlnQrVbG5TGezaJQIyXLgCjCbVj7UGorCe8c2rO0yGI4HoAMQolH45ek3168Dqg5ntjKfOSMR01/AwMJi0kYrxkARgNWDneMQyV9YR3Ts1ZOoAbAKhRCPlg9IIlhIbvP0NzBIxF3ZY8PzJrKW348QK6BeC7B4ADDusxb8ioOUuHgf84UbD5IPRSzQKCAgmg2QIg75sEAFoLYMYLTQaaNxzQWROYkjXn6TA0ID0HILNbuV2ZJYycvA3sfeMAxBbseH8hzR7QWROYkjXn6cAIMohCZrdyuzICQUEoKxAUhBhQIAYUfLEBW4GgIJT3vvXWx18RrfXJlfXJlW2TK+uTK+uTK5s8TB4tj159tEqf5eVCLk6+UF4gKAgxoPc+vhIQGcSAxfynq1s58JMKSt0vJV5/HZvewhbwngVFylIVSgmxQWc852IG7Im95nGMFU8oqNVuWM6y5RswV0obPbLAexkrTQg9ltkCU3ILNx5jxR29xT3NG/TCcpavaZKnGXDEFNHihcFKk2PnubW+IyS5ZkUCdhVUuzlSE7thO82etlquvDRBx50mx6mdOC1Mkz10FGB0B7/usszluZnTkwxvQpYr75Vjmjw9tbVkUbXWHjwIHFpsGwuu+YVpUdpqufKylOt19rprZVOE8jE7hc3R4WJ985XngJcok+MPS64+JFzXgF/xZqLAYckVcTEDdjuebmw469z2Ewx4Xx1UabfNLFDeXbO95flwB86nQD3uLKlIhjFcFfPa7HZzfWxYM+RHe3FzE47d+h32vdHDlrEq61kY8oXF1nIYe5D62WZckOf8Q0TOeVu2Zayad1xu/ufubCmTU+5RAT8PXHdn6pGTz9uAuwpezTvuZscsK5NTxlGBOA/cQGLXZcUozP5/Qm7huB2T05nz3ZdoS6pF+UKq4Kxan61FMaCgKP4DWLT9BpiUu24AAAAASUVORK5CYII=","w":640,"h":48}},"actors":[{"sprite":"grass","x":12,"y":7,"phase":0},{"sprite":"grass","x":96,"y":7,"phase":337,"flip":true},{"sprite":"grass","x":140,"y":7,"phase":674},{"sprite":"grass","x":206,"y":7,"phase":211,"flip":true},{"sprite":"grass","x":268,"y":7,"phase":548},{"sprite":"grass","x":324,"y":7,"phase":85,"flip":true},{"sprite":"grass","x":420,"y":7,"phase":422},{"sprite":"grass","x":474,"y":7,"phase":759,"flip":true},{"sprite":"grass","x":520,"y":7,"phase":296},{"sprite":"grass","x":590,"y":7,"phase":633,"flip":true}]},{"id":"front","label":"Premier plan","factor":1.3,"y":150,"images":{"day":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA8AAAAAeCAMAAADU1IdrAAAAD1BMVEUAAAAaFCNarkUuejofSixjiiLOAAAAAXRSTlMAQObYZgAAAJZJREFUeNrt1rsNhEAQREHmk3/MiD2di4fRUlUG22+EuC4AAAAAAAAAAAAAAAAAAAAAAOBrZQL7eWVsl+rSx35emVlm6qSp1cZ+riQyzXTVbmljP1cSV+afpnxd7edKIv+Nps+nVRr7uZLUf6Pze2QP+7mStH+j6XmyKGM/V5LYpmd/pLGfKwlsI439vDI3za409vPKdzewNQNYT5xrogAAAABJRU5ErkJggg==","w":960,"h":30},"dusk":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA8AAAAAeCAMAAADU1IdrAAAAD1BMVEUAAAAaFCNeOlo7K0shGjOYlw9/AAAAAXRSTlMAQObYZgAAAJZJREFUeNrt1rsNhEAQREHmk3/MiD2di4fRUlUG22+EuC4AAAAAAAAAAAAAAAAAAAAAAOBrZQL7eWVsl+rSx35emVlm6qSp1cZ+riQyzXTVbmljP1cSV+afpnxd7edKIv+Nps+nVRr7uZLUf6Pze2QP+7mStH+j6XmyKGM/V5LYpmd/pLGfKwlsI439vDI3za409vPKdzewNQNYT5xrogAAAABJRU5ErkJggg==","w":960,"h":30},"night":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA8AAAAAeCAMAAADU1IdrAAAAD1BMVEUAAAAaFCMdMkcUIToMEiS+MmTBAAAAAXRSTlMAQObYZgAAAJZJREFUeNrt1rsNhEAQREHmk3/MiD2di4fRUlUG22+EuC4AAAAAAAAAAAAAAAAAAAAAAOBrZQL7eWVsl+rSx35emVlm6qSp1cZ+riQyzXTVbmljP1cSV+afpnxd7edKIv+Nps+nVRr7uZLUf6Pze2QP+7mStH+j6XmyKGM/V5LYpmd/pLGfKwlsI439vDI3za409vPKdzewNQNYT5xrogAAAABJRU5ErkJggg==","w":960,"h":30},"overcast":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA8AAAAAeCAMAAADU1IdrAAAAD1BMVEUAAAAaFCNBVkYrPDMbJyPt6jh3AAAAAXRSTlMAQObYZgAAAJZJREFUeNrt1rsNhEAQREHmk3/MiD2di4fRUlUG22+EuC4AAAAAAAAAAAAAAAAAAAAAAOBrZQL7eWVsl+rSx35emVlm6qSp1cZ+riQyzXTVbmljP1cSV+afpnxd7edKIv+Nps+nVRr7uZLUf6Pze2QP+7mStH+j6XmyKGM/V5LYpmd/pLGfKwlsI439vDI3za409vPKdzewNQNYT5xrogAAAABJRU5ErkJggg==","w":960,"h":30}},"front":true,"optional":true,"actors":[{"sprite":"tall","x":40,"y":6,"phase":0},{"sprite":"tall","x":310,"y":6,"phase":250,"flip":true},{"sprite":"tall","x":590,"y":6,"phase":500},{"sprite":"tall","x":830,"y":6,"phase":750,"flip":true}]}],"sprites":{"grass":{"day":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAANCAMAAAAucZheAAAAElBMVEUAAAAaFCOl11parkUuejofSiyqBYhCAAAAAXRSTlMAQObYZgAAAG5JREFUeNqd0FEKxTAIBVFHzf63/IiNpS8Ikvh3JuV+VCQO2a4L/APlG7uw0wjjTWCF/X3aFNypQ2MsDaMKvUFNY6/yHsr33MuBMxumNgf9xlHU3N2H5y84cpQnjHfxyEJwOj84swhj3aVFWHfjH0pqBXZSNapIAAAAAElFTkSuQmCC","w":16,"h":13,"ms":[200,200,200,200]},"dusk":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAANCAMAAAAucZheAAAAElBMVEUAAAAaFCOPT19eOlo7K0shGjMm400/AAAAAXRSTlMAQObYZgAAAG5JREFUeNqd0FEKxTAIBVFHzf63/IiNpS8Ikvh3JuV+VCQO2a4L/APlG7uw0wjjTWCF/X3aFNypQ2MsDaMKvUFNY6/yHsr33MuBMxumNgf9xlHU3N2H5y84cpQnjHfxyEJwOj84swhj3aVFWHfjH0pqBXZSNapIAAAAAElFTkSuQmCC","w":16,"h":13,"ms":[200,200,200,200]},"night":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAANCAMAAAAucZheAAAAElBMVEUAAAAaFCMqR1IdMkcUIToMEiSvLo98AAAAAXRSTlMAQObYZgAAAG5JREFUeNqd0FEKxTAIBVFHzf63/IiNpS8Ikvh3JuV+VCQO2a4L/APlG7uw0wjjTWCF/X3aFNypQ2MsDaMKvUFNY6/yHsr33MuBMxumNgf9xlHU3N2H5y84cpQnjHfxyEJwOj84swhj3aVFWHfjH0pqBXZSNapIAAAAAElFTkSuQmCC","w":16,"h":13,"ms":[200,200,200,200]},"overcast":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAANCAMAAAAucZheAAAAElBMVEUAAAAaFCNic1pBVkYrPDMbJyNB/WquAAAAAXRSTlMAQObYZgAAAG5JREFUeNqd0FEKxTAIBVFHzf63/IiNpS8Ikvh3JuV+VCQO2a4L/APlG7uw0wjjTWCF/X3aFNypQ2MsDaMKvUFNY6/yHsr33MuBMxumNgf9xlHU3N2H5y84cpQnjHfxyEJwOj84swhj3aVFWHfjH0pqBXZSNapIAAAAAElFTkSuQmCC","w":16,"h":13,"ms":[200,200,200,200]}},"tall":{"day":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAeCAMAAABNNuFqAAAAD1BMVEUAAAAaFCMfSiwuejparkWWFuYUAAAAAXRSTlMAQObYZgAAAfVJREFUeNrtVtlygzAMRJL//5s76LIFskVok2k7ePKQsJfWBtpte9aznvWs37PgI4w1Bb7hDggF7ScYToHX9YW7OyNU2W9j3EWhFEPYgPsMQ/IZ5volCnJhUUAYq/EiIyNsSwa8gEaYjRnWGhqUMXTzjOg7w5cQnBAs3HRkuEWtX+dvQEAiJiMNVgeGHVR3UyXxxU4Yp1FGblHr1/kGs1pUhwKn9J1xLjAl9Ir6JY5Q6it7rcufndMOBQTDfsDQ4mnL10DIHExkjFBgoa/ybTukAAI05K2CJN4qZgTEwQFpvgW2SdmEmb7M3xxvLJez1lPyZ49/N769CEeCD8A2zRzQtvwwYUIo9FfylWK47AQOZywGqA2FIDdDN+ALTXDlnxJ4wE0eOSdU+jofG7ORrAA6rqfeuBASnglswN2FALJ9ytG/PuYAgeADrvUX8scChAOuZxgMSMjghNMAiYE6OI5xwKW+yt8J4ikFgp7EYMCFoAaApAYwMbACNAxIAtr7utJfyhcCub6h3k5jPg35BIGgA7iBpSUBbqCvjFJ/KZ/SAv6UCWEwaP0ujQYe0G/TNID8EK7rZ/mRMPpnBRb4OIA+pQsclhuQ6Wf5CYHo8Jo44EivBMzw+/qYf6PA5YJvwmP+Gwp8Fv8XBWYL/gK+/zs3W38A/wJE2BZyvIXQ2AAAAABJRU5ErkJggg==","w":32,"h":30,"ms":[167,167,167,167,167,167]},"dusk":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAeCAMAAABNNuFqAAAAD1BMVEUAAAAaFCMhGjM7K0teOlqukrooAAAAAXRSTlMAQObYZgAAAfVJREFUeNrtVtlygzAMRJL//5s76LIFskVok2k7ePKQsJfWBtpte9aznvWs37PgI4w1Bb7hDggF7ScYToHX9YW7OyNU2W9j3EWhFEPYgPsMQ/IZ5volCnJhUUAYq/EiIyNsSwa8gEaYjRnWGhqUMXTzjOg7w5cQnBAs3HRkuEWtX+dvQEAiJiMNVgeGHVR3UyXxxU4Yp1FGblHr1/kGs1pUhwKn9J1xLjAl9Ir6JY5Q6it7rcufndMOBQTDfsDQ4mnL10DIHExkjFBgoa/ybTukAAI05K2CJN4qZgTEwQFpvgW2SdmEmb7M3xxvLJez1lPyZ49/N769CEeCD8A2zRzQtvwwYUIo9FfylWK47AQOZywGqA2FIDdDN+ALTXDlnxJ4wE0eOSdU+jofG7ORrAA6rqfeuBASnglswN2FALJ9ytG/PuYAgeADrvUX8scChAOuZxgMSMjghNMAiYE6OI5xwKW+yt8J4ikFgp7EYMCFoAaApAYwMbACNAxIAtr7utJfyhcCub6h3k5jPg35BIGgA7iBpSUBbqCvjFJ/KZ/SAv6UCWEwaP0ujQYe0G/TNID8EK7rZ/mRMPpnBRb4OIA+pQsclhuQ6Wf5CYHo8Jo44EivBMzw+/qYf6PA5YJvwmP+Gwp8Fv8XBWYL/gK+/zs3W38A/wJE2BZyvIXQ2AAAAABJRU5ErkJggg==","w":32,"h":30,"ms":[167,167,167,167,167,167]},"night":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAeCAMAAABNNuFqAAAAD1BMVEUAAAAaFCMMEiQUITodMkcaetvaAAAAAXRSTlMAQObYZgAAAfVJREFUeNrtVtlygzAMRJL//5s76LIFskVok2k7ePKQsJfWBtpte9aznvWs37PgI4w1Bb7hDggF7ScYToHX9YW7OyNU2W9j3EWhFEPYgPsMQ/IZ5volCnJhUUAYq/EiIyNsSwa8gEaYjRnWGhqUMXTzjOg7w5cQnBAs3HRkuEWtX+dvQEAiJiMNVgeGHVR3UyXxxU4Yp1FGblHr1/kGs1pUhwKn9J1xLjAl9Ir6JY5Q6it7rcufndMOBQTDfsDQ4mnL10DIHExkjFBgoa/ybTukAAI05K2CJN4qZgTEwQFpvgW2SdmEmb7M3xxvLJez1lPyZ49/N769CEeCD8A2zRzQtvwwYUIo9FfylWK47AQOZywGqA2FIDdDN+ALTXDlnxJ4wE0eOSdU+jofG7ORrAA6rqfeuBASnglswN2FALJ9ytG/PuYAgeADrvUX8scChAOuZxgMSMjghNMAiYE6OI5xwKW+yt8J4ikFgp7EYMCFoAaApAYwMbACNAxIAtr7utJfyhcCub6h3k5jPg35BIGgA7iBpSUBbqCvjFJ/KZ/SAv6UCWEwaP0ujQYe0G/TNID8EK7rZ/mRMPpnBRb4OIA+pQsclhuQ6Wf5CYHo8Jo44EivBMzw+/qYf6PA5YJvwmP+Gwp8Fv8XBWYL/gK+/zs3W38A/wJE2BZyvIXQ2AAAAABJRU5ErkJggg==","w":32,"h":30,"ms":[167,167,167,167,167,167]},"overcast":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAeCAMAAABNNuFqAAAAD1BMVEUAAAAaFCMbJyMrPDNBVkbZNXfVAAAAAXRSTlMAQObYZgAAAfVJREFUeNrtVtlygzAMRJL//5s76LIFskVok2k7ePKQsJfWBtpte9aznvWs37PgI4w1Bb7hDggF7ScYToHX9YW7OyNU2W9j3EWhFEPYgPsMQ/IZ5volCnJhUUAYq/EiIyNsSwa8gEaYjRnWGhqUMXTzjOg7w5cQnBAs3HRkuEWtX+dvQEAiJiMNVgeGHVR3UyXxxU4Yp1FGblHr1/kGs1pUhwKn9J1xLjAl9Ir6JY5Q6it7rcufndMOBQTDfsDQ4mnL10DIHExkjFBgoa/ybTukAAI05K2CJN4qZgTEwQFpvgW2SdmEmb7M3xxvLJez1lPyZ49/N769CEeCD8A2zRzQtvwwYUIo9FfylWK47AQOZywGqA2FIDdDN+ALTXDlnxJ4wE0eOSdU+jofG7ORrAA6rqfeuBASnglswN2FALJ9ytG/PuYAgeADrvUX8scChAOuZxgMSMjghNMAiYE6OI5xwKW+yt8J4ikFgp7EYMCFoAaApAYwMbACNAxIAtr7utJfyhcCub6h3k5jPg35BIGgA7iBpSUBbqCvjFJ/KZ/SAv6UCWEwaP0ujQYe0G/TNID8EK7rZ/mRMPpnBRb4OIA+pQsclhuQ6Wf5CYHo8Jo44EivBMzw+/qYf6PA5YJvwmP+Gwp8Fv8XBWYL/gK+/zs3W38A/wJE2BZyvIXQ2AAAAABJRU5ErkJggg==","w":32,"h":30,"ms":[167,167,167,167,167,167]}},"bird":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAECAMAAACqVq9QAAAACVBMVEUvLTwAAAAaFCNO45ySAAAAAnRSTlP/AOW3MEoAAAAsSURBVHjaY2BgBAEICQZMCCYDWJyBkYEBgiECUB6MC9PCADOGCcpAMQjZEgAUgQBdMWdehgAAAABJRU5ErkJggg==","w":7,"h":4,"ms":[100,100,100,100]}},"bfly_white":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAFCAMAAABhCnz1AAAADFBMVEUAAAAaFCP7+//T4PIWFYZ7AAAAAXRSTlMAQObYZgAAADJJREFUeNp9jEEKACAMw9Lu/3+WTlHYQSgJW6EgJSBCLvtnJ8jyvg/jb4lK1e7xoWemFh0ZAFyNIRFFAAAAAElFTkSuQmCC","w":7,"h":5,"ms":[100,100,100,100]}},"bfly_yellow":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAFCAMAAABhCnz1AAAADFBMVEUAAAAaFCP/8Kjzw0rv0MhYAAAAAXRSTlMAQObYZgAAADJJREFUeNp9jEEKACAMw9Lu/3+WTlHYQSgJW6EgJSBCLvtnJ8jyvg/jb4lK1e7xoWemFh0ZAFyNIRFFAAAAAElFTkSuQmCC","w":7,"h":5,"ms":[100,100,100,100]}},"bfly_blue":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAFCAMAAABhCnz1AAAADFBMVEUAAAAaFCOf0P9Pj+DWtJKWAAAAAXRSTlMAQObYZgAAADJJREFUeNp9jEEKACAMw9Lu/3+WTlHYQSgJW6EgJSBCLvtnJ8jyvg/jb4lK1e7xoWemFh0ZAFyNIRFFAAAAAElFTkSuQmCC","w":7,"h":5,"ms":[100,100,100,100]}},"glow":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFCAMAAABl/6zIAAAADFBMVEUAAABarkWl11r/8Kjf/GFGAAAAAXRSTlMAQObYZgAAACtJREFUeNpjYEAHjAy4ABNIlokRykJWDuIzMTMxMDIxMzGCWShqcOvGZzcADiQAL7vFcXsAAAAASUVORK5CYII=","w":5,"h":5,"ms":[600,100,100,200,100,100]}},"glow_amber":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFCAMAAABl/6zIAAAADFBMVEUAAADgeCrzw0r/8KiglOXlAAAAAXRSTlMAQObYZgAAACtJREFUeNpjYEAHjAy4ABNIlokRykJWDuIzMTMxMDIxMzGCWShqcOvGZzcADiQAL7vFcXsAAAAASUVORK5CYII=","w":5,"h":5,"ms":[600,100,100,200,100,100]}},"twinkle":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFCAMAAABl/6zIAAAADFBMVEUAAACPo8fT4PL7+/9St4XaAAAAAXRSTlMAQObYZgAAACdJREFUeNpjYEAHjAy4ABMqgaScGSTGzMTAyMTMxAhmQcQI6sZnNwANjgAtVOXBlgAAAABJRU5ErkJggg==","w":5,"h":5,"ms":[400,100,100,200,100,100]}},"streak":{"*":{"src":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAAAKCAMAAABCIAY9AAAAFVBMVEUAAAAvT7NPj+CPo8fT4PL/8Kj7+/+5PIFZAAAAAXRSTlMAQObYZgAAAEhJREFUeNrNkUESADAEAxH8/8n9gINOajTHPUjGikxEVbZjtl5W06HfAH36wQRajztLaT38BFpPBEvbelAeeEH7epApI/RCzwGpnAEl8ObDyAAAAABJRU5ErkJggg==","w":22,"h":10,"ms":[100,100,100,100,100,100]}}},"effects":{"day":[{"type":"birds","sprite":"bird","every":[14000,28000],"count":[2,5],"y":[26,70],"speed":[14,22],"factor":0.12,"after":"mountains"},{"type":"butterflies","sprites":["bfly_white","bfly_yellow","bfly_blue"],"plane":"ground","count":4,"anchors":[[76,8],[174,8],[188,8],[358,8],[452,8],[554,8],[566,8]],"after":"ground"}],"dusk":[{"type":"twinkle","sprite":"twinkle","count":5,"area":[84,2,236,34],"after":"stars"},{"type":"birds","sprite":"bird","every":[10000,22000],"count":[3,6],"y":[30,78],"speed":[16,24],"factor":0.12,"after":"mountains"}],"night":[{"type":"twinkle","sprite":"twinkle","count":14,"area":[84,2,236,92],"after":"stars"},{"type":"shooting","sprite":"streak","every":[6000,15000],"area":[110,4,190,34],"speed":[140,190],"head":[1,9],"after":"stars"},{"type":"fireflies","sprites":["glow","glow","glow_amber"],"plane":"meadow","count":10,"area":[0,36,1280,16],"after":"meadow"},{"type":"fireflies","sprites":["glow"],"plane":"ground","count":9,"area":[0,2,640,14],"front":0.35,"after":"ground"}],"overcast":[]},"speed":{"overcast":2}};

/** Crée la scène « Plaine d'été ». Voir les options en tête du fichier. */
export function createScene(opts = {}) {
  return createSceneFrom(SCENE, opts);
}

export default createScene;
