# Gué du ruisseau

Scène statique 16:9 (base 320 × 180) vue de dessus en 3/4, façon RPG : un ruisseau d'été traverse le haut de l'écran de gauche à droite, sorti d'une petite cascade au pied d'un rocher moussu ; un chemin de terre le franchit sur des pierres de gué. Au-delà, la rive boisée ; en deçà, une prairie fleurie bordée d'arbres. Le centre et le bas de l'écran restent dégagés pour un personnage (ligne des pieds conseillée y = 140) ; hautes herbes et buissons du premier plan passent devant lui. Animations : courant qui file, écume autour des pierres et au pied de la cascade, éclats de soleil, herbe au vent, papillons, ombres de nuages, aigrettes et oiseaux le jour ; poussière dorée au crépuscule ; lucioles au-dessus de l'eau la nuit ; vent fort par temps sombre.

```
Scène « Gué du ruisseau » (scenes/brook_ford) — statique : un écran fixe.
Base 320×180 px, ligne de sol y = 140, périodes : day (Jour), dusk (Crépuscule), night (Nuit), overcast (Sombre).
Plans : backdrop ×0, ground ×0, front (devant) ×0.

  import { createScene, fitCanvas } from "./brook_ford.js";
  const view = fitCanvas(canvas);                 // facteur entier + vue élargie : { scale, w, h, ctx }
  const scene = await createScene({ period: "day", width: view.w, height: view.h });
  function loop(dt) {                             // dt en ms
    scene.update(dt, cameraX);                    // cameraX : position de la caméra (pixels de base)
    scene.drawBack(view.ctx);                     // plans derrière le personnage
    drawPlayer(view.ctx, playerX, scene.groundY); // ton personnage, pieds sur la ligne de sol
    scene.drawFront(view.ctx);                    // premier plan, devant le personnage
  }
  scene.setPeriod("night", { fade: 2000 });       // changement de période en fondu

Options de createScene : period, width, height, effects (false = sans événements aléatoires),
foreground (false = sans premier plan), frequency (1 = normal), random (générateur 0..1).
Autres méthodes : draw, setPlaneVisible(id, bool), setFrequency(n), resize(w, h).
Affichage net : ctx.imageSmoothingEnabled = false et un agrandissement entier (fitCanvas le fait).
```

Fichiers : `brook_ford.js` (module autonome, images incluses), `scene.json` + PNG (plans par période, sprites d'effets) pour un autre moteur.
