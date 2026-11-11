# Étendre le moteur des scènes

Le moteur `scripts/templates/scene-runtime.js` est **le même** dans la galerie, dans `library/scene-runtime.js` et dans
chaque module exporté `library/scenes/<asset>/<asset>.js` (le build l'y recopie). Des jeux s'en servent déjà :
on **ajoute** (nouvel effet, nouvelle option avec une valeur par défaut), on ne change pas ce qui existe.

## Où toucher

| Fichier | Quoi |
|---|---|
| `scripts/templates/scene-runtime.js` | `EFFECTS.<type>(cfg, S)` pour un effet ; `drawPlane` pour une option de plan |
| `scripts/lib/scene.js` | validation (`EFFECT_TYPES`, `PLANE_KEYS`, `SCENE_KEYS`) ; `previewOf` doit dessiner une nouvelle option de plan comme le moteur à la caméra 0 |
| `scripts/templates/index.d.ts` | types si de nouveaux champs apparaissent |
| `library/README.md` (section Scènes), `.claude/skills/scene-dynamique/references/kit.md` | documentation des paramètres |
| `web/app.js` | seulement si l'effet a besoin d'une commande dans la visionneuse (rare) |

`SCENE_FORMAT` reste à 1 tant que les anciennes données marchent avec le nouveau moteur.

## Ajouter un effet

Un effet est une fabrique `(cfg, S) => ({ update(dt, dCam, camX), draw(ctx, view, front), hasFront? })` :

- `cfg` : l'objet de `meta.scene.effects.<période>[i]` (donner une valeur par défaut à chaque paramètre).
- `S` : `random()` (0..1, réglable par le jeu), `sprite(nom)` (image de la période, avec `{ el, w, h, ms, loop }`),
  `plane(id)` (`{ y, factor, W }`), `camX`, `frequency`, `view` (`{ width, height, dy }`), `w`, `h` (taille de base).
- `update` reçoit le temps écoulé (ms) et le déplacement de caméra depuis la dernière image ; `draw` dessine en
  pixels de base dans le tampon du plan `after` (`view.dy` = hauteur ajoutée en haut quand la vue s'agrandit).
- `hasFront: true` + `draw(ctx, view, true)` pour une partie dessinée devant le personnage (comme les lucioles).
- Outils du fichier : `between(r, [a, b])`, `pick(r, liste)`, `blit(ctx, img, image, x, y, flip)`, `frameAt(img, t)`,
  `mod(a, n)`, `wrapX(x, décalage, W, largeur, marge)`.

Exemple à adapter : des flocons qui tombent en oscillant (pour « sombre » en montagne, si l'utilisateur le veut).

```js
  // Flocons qui tombent en oscillant ; ils suivent un peu la caméra (factor) pour rester dans le décor.
  snowfall(cfg, S) {
    const r = S.random, imgs = (cfg.sprites ?? [cfg.sprite]).map((n) => S.sprite(n)), factor = cfg.factor ?? 0.5;
    const flakes = Array.from({ length: cfg.count ?? 60 }, () => ({
      x: r() * S.w, y: r() * S.h, img: pick(r, imgs), vy: between(r, cfg.speed ?? [10, 22]), p: r() * 6, t: r() * 10000,
    }));
    return {
      update(dt, dCam) {
        for (const f of flakes) {
          f.t += dt;
          f.y += (f.vy * dt) / 1000;
          f.x -= dCam * factor;
          if (f.y > S.view.height) { f.y = -f.img.h; f.x = r() * S.view.width; }
        }
      },
      draw(ctx, v) {
        for (const f of flakes) {
          const x = mod(f.x + Math.sin(f.t / 900 + f.p) * 3, v.width + 8) - 4;
          blit(ctx, f.img, frameAt(f.img, f.t), x, f.y);
        }
      },
    };
  },
```

Puis : `EFFECT_TYPES` dans `scripts/lib/scene.js`, la ligne de la table des effets dans `references/kit.md` et dans
`library/README.md`, un sprite de flocon dans la bibliothèque (famille `sky/snowflake` ou variantes de `sky/star`), et
l'effet dans `meta.scene.effects.overcast` de la scène.

## Vérifier un changement du moteur

1. `npm run build` : **tous** les modules `library/scenes/*/<asset>.js` changent (ils embarquent le moteur), c'est
   normal ; leurs PNG et `scene.json` ne doivent pas bouger (`git status library/scenes/`).
2. `node .claude/skills/scene-dynamique/scripts/test-scene.cjs <asset> --gallery` sur la nouvelle scène **et** sur
   `summer_plain` : aucune erreur, captures identiques à avant pour l'ancienne scène.
3. Mettre à jour la documentation (tableau des effets, `library/README.md`, types) dans le même commit.
