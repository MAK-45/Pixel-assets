# Lisière du champ de blé

Scène statique 16:9 (base 320 × 180) vue de dessus en 3/4, façon RPG : en haut, un champ de blé mûr semé de coquelicots, fermé par une clôture de bois ouverte au milieu sur un chemin de terre ; à droite, un grand chêne et son ombre ; à gauche, une haie fleurie et des tournesols le long de la clôture. Le centre et le bas de l'écran restent un pré dégagé pour un personnage (ligne des pieds conseillée y = 140) ; hautes herbes et buissons du premier plan passent devant lui. Animations : vagues de vent qui courent sur le blé, herbe au vent, papillons, grandes ombres de nuages, pollen et oiseaux le jour ; poussière dorée au crépuscule ; lucioles la nuit ; vent fort par temps sombre.

```
Scène « Lisière du champ de blé » (scenes/wheat_edge) — statique : un écran fixe.
Base 320×180 px, ligne de sol y = 140, périodes : day (Jour), dusk (Crépuscule), night (Nuit), overcast (Sombre).
Plans : backdrop ×0, ground ×0, front (devant) ×0.

  import { createScene, fitCanvas } from "./wheat_edge.js";
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

Fichiers : `wheat_edge.js` (module autonome, images incluses), `scene.json` + PNG (plans par période, sprites d'effets) pour un autre moteur.
