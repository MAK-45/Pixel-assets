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

// ---- outils de construction (retirés des scènes exportées) ----

const EXPORT_CUT = "// ---- outils de construction (retirés des scènes exportées) ----";

/** Images d'une scène : [chemin dans le paquet, objet image] (plans, astres, sprites). */
function sceneImages(data) {
  const out = [];
  for (const p of data.planes) {
    for (const [period, img] of Object.entries(p.images)) out.push([`${period}/${p.id}.png`, img]);
    for (const [period, img] of Object.entries(p.body?.images ?? {})) out.push([`${period}/${p.id}_body.png`, img]);
  }
  for (const [name, per] of Object.entries(data.sprites ?? {}))
    for (const [period, img] of Object.entries(per)) out.push([`sprites/${name}${period === "*" ? "" : `_${period}`}.png`, img]);
  return out;
}

/**
 * Paquet d'une scène pour un autre moteur : scene.json (chemins des PNG à la place des data URL)
 * et la liste des fichiers PNG { path, dataUrl }.
 */
export function packScene(data) {
  const json = JSON.parse(JSON.stringify(data));
  const pathOf = new Map(sceneImages(data).map(([path, img]) => [img, path]));
  const files = [];
  const swap = (orig, copy) => {
    const path = pathOf.get(orig);
    files.push({ path, dataUrl: orig.src });
    delete copy.src;
    copy.png = path;
  };
  data.planes.forEach((p, i) => {
    for (const k of Object.keys(p.images)) swap(p.images[k], json.planes[i].images[k]);
    for (const k of Object.keys(p.body?.images ?? {})) swap(p.body.images[k], json.planes[i].body.images[k]);
  });
  for (const [name, per] of Object.entries(data.sprites ?? {}))
    for (const k of Object.keys(per)) swap(per[k], json.sprites[name][k]);
  return { json, files };
}

const label = (data) => data.periods.map((p) => `${p.id} (${p.label})`).join(", ");

/** Mode d'emploi court d'une scène exportée (en tête du module et README du paquet). */
export function sceneUsage(data, file) {
  const kind = data.type === "parallax" ? "dynamique : parallaxe infinie, défilement dans les deux sens" : "statique : un écran fixe";
  return [
    `Scène « ${data.title} » (${data.id}) — ${kind}.`,
    `Base ${data.w}×${data.h} px, ligne de sol y = ${data.groundY}, périodes : ${label(data)}.`,
    `Plans : ${data.planes.map((p) => `${p.id}${p.front ? " (devant)" : ""} ×${p.factor}`).join(", ")}.`,
    ``,
    `  import { createScene, fitCanvas } from "./${file}";`,
    `  const view = fitCanvas(canvas);                 // facteur entier + vue élargie : { scale, w, h, ctx }`,
    `  const scene = await createScene({ period: "${data.defaultPeriod ?? data.periods[0].id}", width: view.w, height: view.h });`,
    `  function loop(dt) {                             // dt en ms`,
    `    scene.update(dt, cameraX);                    // cameraX : position de la caméra (pixels de base)`,
    `    scene.drawBack(view.ctx);                     // plans derrière le personnage`,
    `    drawPlayer(view.ctx, playerX, scene.groundY); // ton personnage, pieds sur la ligne de sol`,
    `    scene.drawFront(view.ctx);                    // premier plan, devant le personnage`,
    `  }`,
    `  scene.setPeriod("night", { fade: 2000 });       // changement de période en fondu`,
    ``,
    `Options de createScene : period, width, height, effects (false = sans événements aléatoires),`,
    `foreground (false = sans premier plan), frequency (1 = normal), random (générateur 0..1).`,
    `Autres méthodes : draw, setPlaneVisible(id, bool), setFrequency(n), resize(w, h).`,
    `Affichage net : ctx.imageSmoothingEnabled = false et un agrandissement entier (fitCanvas le fait).`,
  ];
}

/** README du paquet d'une scène (dossier library/scenes/<asset>/ et archive .zip de la galerie). */
export function sceneReadme(data, description, file = `${data.id.split("/").pop()}.js`) {
  return `# ${data.title}\n\n${description}\n\n\`\`\`\n${sceneUsage(data, file).join("\n")}\n\`\`\`\n\n` +
    `Fichiers : \`${file}\` (module autonome, images incluses), \`scene.json\` + PNG (plans par période, sprites d'effets) pour un autre moteur.\n`;
}

/**
 * Texte du module autonome d'une scène : le moteur (sans ces outils) + les données (images en data URL).
 * runtimeSource = texte de ce fichier.
 */
export function bundleScene(runtimeSource, data, file = `${data.id.split("/").pop()}.js`) {
  const engine = runtimeSource.slice(0, runtimeSource.indexOf(EXPORT_CUT)).trimEnd();
  const head = sceneUsage(data, file).map((l) => `// ${l}`.trimEnd()).join("\n");
  return `// ${file} — GÉNÉRÉ par pixel-assets (scripts/build.js), ne pas modifier.
${head}

${engine}

/** Données de la scène (images PNG en data URL). */
export const SCENE = ${JSON.stringify(data)};

/** Crée la scène « ${data.title} ». Voir les options en tête du fichier. */
export function createScene(opts = {}) {
  return createSceneFrom(SCENE, opts);
}

export default createScene;
`;
}
