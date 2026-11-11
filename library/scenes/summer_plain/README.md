# Plaine d'été

Panorama dynamique 16:9 (base 320 × 180) pour jeu de plateforme ou runner : une plaine d'été au pied d'une grande montagne enneigée, en 8 plans de parallaxe qui bouclent sans couture (ciel, étoiles, nuages, montagnes, collines, prairie, sol où marche le personnage, hautes herbes au premier plan). Quatre périodes : jour (nuages qui dérivent, herbe au vent, oiseaux, papillons), crépuscule (soleil couchant, nuages roses, premières étoiles), nuit (lune, étoiles qui scintillent, étoiles filantes, lucioles) et sombre (journée de pluie couverte, vent fort). Ligne de sol à y = 150.

```
Scène « Plaine d'été » (scenes/summer_plain) — dynamique : parallaxe infinie, défilement dans les deux sens.
Base 320×180 px, ligne de sol y = 150, périodes : day (Jour), dusk (Crépuscule), night (Nuit), overcast (Sombre).
Plans : sky ×0, stars ×0, clouds ×0.05, mountains ×0.1, hills ×0.3, meadow ×0.6, ground ×1, front (devant) ×1.3.

  import { createScene, fitCanvas } from "./summer_plain.js";
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

Fichiers : `summer_plain.js` (module autonome, images incluses), `scene.json` + PNG (plans par période, sprites d'effets) pour un autre moteur.
