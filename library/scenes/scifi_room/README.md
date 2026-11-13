# Salle de station spatiale

Scène statique 16:9 (base 320 × 180) en vue isométrique 2:1 : l'angle d'une grande salle de station spatiale qui remplit tout l'écran, montée avec les familles iso* de la catégorie scifi (dalles, pans de mur, consoles, caisses, capsules de stase, réacteur, mobilier, drone). Hublots vitrés par où l'on voit les étoiles scintiller, planète aux anneaux au-dessus des murs. Animations : écran mural et moniteurs, diodes des serveurs, porte coulissante qui s'ouvre, impulsions qui courent le long des rails de lumière du sol, réacteur qui pulse, hologramme qui tourne, bulles des capsules, drone qui patrouille. Trois ambiances : normal, alerte (lumières rouges, gyrophares et lueur qui clignotent, drone d'alerte) et veille (salle dans le noir, écrans et lumières seuls, clair d'étoiles par les hublots). Image de 480 × 270 centrée en bas pour couvrir les écrans plus larges ; pieds du personnage à y = 152.

```
Scène « Salle de station spatiale » (scenes/scifi_room) — statique : un écran fixe.
Base 320×180 px, ligne de sol y = 152, périodes : day (Normal), alert (Alerte), night (Veille).
Plans : space ×0, stars ×0, room ×0, props ×0, alarm ×0.

  import { createScene, fitCanvas } from "./scifi_room.js";
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

Fichiers : `scifi_room.js` (module autonome, images incluses), `scene.json` + PNG (plans par période, sprites d'effets) pour un autre moteur.
