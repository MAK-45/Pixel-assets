# Désert

Panorama dynamique 16:9 (base 320 × 180) pour jeu de plateforme ou runner : un désert de roche rouge dominé par une grande mesa à deux étages, en 8 plans de parallaxe qui bouclent sans couture (ciel, étoiles, nuages, mesas et buttes lointaines, dunes semées de petits cactus, bande de sable avec saguaros, figuiers de Barbarie, rochers, arche, ossements et une oasis de dattiers, sol de sable ridé où marche le personnage, cactus sombres au premier plan). Quatre périodes : jour (soleil écrasant, rares nuages, vautours, virevoltants qui roulent en rebondissant, herbe sèche au vent), crépuscule (disque couchant derrière les mesas, nuages roses, premières étoiles, vols d'oiseaux, un virevoltant de temps en temps), nuit (croissant de lune, ciel très étoilé qui scintille, étoiles filantes, scorpions qui traversent le sable) et sombre (tempête de sable sans précipitation : ciel ocre, plafond de poussière, mesas noyées dans la brume, vent fort, virevoltants en rafales). Ligne de sol à y = 150.

```
Scène « Désert » (scenes/desert) — dynamique : parallaxe infinie, défilement dans les deux sens.
Base 320×180 px, ligne de sol y = 150, périodes : day (Jour), dusk (Crépuscule), night (Nuit), overcast (Sombre (tempête de sable)).
Plans : sky ×0, stars ×0, clouds ×0.05, far ×0.1, mid ×0.3, near ×0.6, ground ×1, front (devant) ×1.3.

  import { createScene, fitCanvas } from "./desert.js";
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

Fichiers : `desert.js` (module autonome, images incluses), `scene.json` + PNG (plans par période, sprites d'effets) pour un autre moteur.
