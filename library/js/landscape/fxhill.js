// GÉNÉRÉ par scripts/build.js — ne pas modifier. Source : assets/landscape/fxhill.px.js
// Colline (style pixelfx) — 7 variante(s). Usage :
//   import asset from "./fxhill.js"; const v = asset.variants["rolling_64"];
//   v.src (data URL PNG), v.rows + v.palette (pixels, "." = transparent), v.w, v.h
/** @type {import("../../index.d.ts").PixelAsset} */
export const asset = {
 "id": "landscape/fxhill",
 "slug": "fxhill",
 "category": "landscape",
 "title": "Colline (style pixelfx)",
 "description": "Collines vues de face au rendu riche inspiré de pixelfx, posées au sol : dômes en cloche sans contour noir, modelés par la lumière en haut à gauche en paliers francs (5 à 6 nuances), la colline de devant jette son ombre sur celle du fond, crête découpée en brins d'herbe et quelques touffes plus claires sur les pentes éclairées. Variantes : colline ronde (16, 32 px), vallonnement de trois collines (64 × 32) en été, fleuri, doré d'automne, sec (paille) et enneigé. Pensées pour les plans intermédiaires des scènes.",
 "tags": [
  "hill",
  "landscape",
  "terrain",
  "background",
  "scenery",
  "relief",
  "meadow",
  "realistic",
  "pixelfx"
 ],
 "order": 0,
 "source": "assets/landscape/fxhill.px.js",
 "module": "library/js/landscape/fxhill.js",
 "sheet": {
  "png": "library/sheets/landscape/fxhill.png",
  "json": "library/sheets/landscape/fxhill.json"
 },
 "axes": {
  "shape": [
   "rolling",
   "round"
  ],
  "season": [
   "summer",
   "spring",
   "autumn",
   "winter"
  ],
  "cover": [
   "grass",
   "flowers",
   "straw",
   "snow"
  ]
 },
 "sizes": [
  16,
  32,
  64
 ],
 "variantCount": 7,
 "variants": {
  "rolling_64": {
   "key": "rolling_64",
   "name": "fxhill_rolling_64",
   "id": "landscape/fxhill/rolling_64",
   "label": "Vallonnement – été (64 × 32)",
   "kind": "sprite",
   "w": 64,
   "h": 32,
   "size": 64,
   "props": {
    "shape": "rolling",
    "season": "summer",
    "cover": "grass"
   },
   "tags": [
    "grass",
    "countryside"
   ],
   "png": "library/png/landscape/fxhill/rolling_64.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAMAAACVQ462AAAAFVBMVEUAAABarkUuejofSiyl11oSMB/c8ozuWAVfAAAAAXRSTlMAQObYZgAAAShJREFUeNrtlEuSxCAMQyMZzf2P3AUJxHZMqqvX4yVYL/InHMd/pADAEfajvrWGM35CdP0EAIaf9MsBQBVJ+hJA0CKANkLf6EnCeivvbHKc9vbqBYC7AXQAOziw14RU1oHZQfrQ/Py4sOu0NLEK4INAzMIiNwSnd1YA5hvtAMxhOqy4exbRk1oGoI9OvCcwz5/jZP35DpizMbt6aNVCsCxgyP1wJZlVANYdHHIHaNwRNi38i4DGAHCEugC2FgFjfqUF1g1wxa8EB5D0ZgBZPxMmQgmQ9dzoaU8CywHUctoFkF4B5oa3lhDnEg2AHKBqwQ04N/JaTC7vcgTeD8ha1BacI16WgJhiXo/1kOwdNCaAc4D4czwJTPWPFOcq/oNZfwKQv1G8IBu9Pu2jDA7xCSvsAAAAAElFTkSuQmCC",
   "palette": {
    "1": "#12301f",
    "2": "#dcf28c",
    "G": "#1f4a2c",
    "L": "#a5d75a",
    "g": "#2e7a3a",
    "l": "#5aae45"
   },
   "rows": [
    "................................................................",
    "................................................................",
    "................................................................",
    "................................................................",
    "..............lllggggggG........................................",
    ".............lLLLlllllllgG......................................",
    "............lLLLLlllllllllGl....................................",
    "...........lLLLLLlllllllgllg1...................1...............",
    "...........lLLLLLllllllglgGg1............gGGGGGG1...............",
    "..........lLLLLLllllggglGgggg1.........gglggglgggG1.............",
    "..........lLLllllllllllGggggg1......G.glllgglgggggg1.1..........",
    "........llLLLLlllggggggggggggg1.....ggllllggGgggggggG1..........",
    "........lLLLLLlllgggggggggggggg1...glLllllggggggggggg1..........",
    ".......gllllllllggggggggggggggg1...glgllllgggggggggggg1.........",
    ".......gllllllgggggggggggggggggG1.GgllllllggggggggggggG1........",
    ".......glllLllgggggggggggggglgGGG1ggglggglgggggggggglGGG1.......",
    "......gllllgggggggggggggggggGgGGGLLllllllGGGggggggGGGGGGG1......",
    "......glllllggggggggggggggggGGGLLLLllllllllll111GGGGGGGGG1......",
    ".....glllllllgggggggggggggggGLLLLLLlllllllllLg111GGGGGGGGG1.....",
    ".....gllllllgggggggggggggggg2LLLLLLllllllllLgg111GGGGGGGGGG1....",
    "....glllllgggggggggggggggggLLLLLLLLllllllllgggg111GGGGGGGGG1....",
    "....gllllggggggggggggggggGGLllllllllllllllggggg111GGGGGGGG111...",
    "...glllllggggggggggggggglGLlllllllllllllllggggggg111GGGGG1111...",
    "...gllllggggggggggggggglgLlllllllllllllllggggggggG111GGGGG1111..",
    "...gllllgggggggggggggggGLllllllllllllllgggggggggGG111GGG111111..",
    "...gllllggggggggggggggGLLlllllllllgglgggggglggGGGG111GG1111111..",
    "..glllllggggggggggggggGLLlllllllggggGggggggGggGGGGG111111111111.",
    "..gllllGggggggggGGGGGGLlllllllgggggglggggggggGGGGGG111111111111.",
    "..gllllggggggggGGGGGGGlllllllggggglgGgggggggggGGGGG111111111111.",
    "..gllLgggggggggGGGGGGGLlllllllggglgggggggggggGGGGGGG111111111111",
    ".gllgggggggggggggGGGGGgllllggggggGggggggGGGGGGGGGGG1111111111111",
    ".glllggggggggggGGGGGGllllllggggggggggggGGGGGGGGGGG11111111111111"
   ]
  },
  "round_32": {
   "key": "round_32",
   "name": "fxhill_round_32",
   "id": "landscape/fxhill/round_32",
   "label": "Colline ronde – été (32 × 16)",
   "kind": "sprite",
   "w": 32,
   "h": 16,
   "size": 32,
   "props": {
    "shape": "round",
    "season": "summer",
    "cover": "grass"
   },
   "tags": [
    "grass"
   ],
   "png": "library/png/landscape/fxhill/round_32.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAQCAMAAABA3o1rAAAAD1BMVEUAAAAfSiwuejoSMB9arkWb6MqBAAAAAXRSTlMAQObYZgAAAGBJREFUeNqVzkkWwCAIBFEo+/5nTpQMomSR3taXp9mPuRnNHP8C9DnQympIIlYJ9X4DfCOK8WwRzG2cSDdAC3BPAlXgFeX7BQCaUhbXB/0b7MdH7YsDRU2g7gHaBKp8ggMm1AKGcfBXzwAAAABJRU5ErkJggg==",
   "palette": {
    "1": "#12301f",
    "G": "#1f4a2c",
    "g": "#2e7a3a",
    "l": "#5aae45"
   },
   "rows": [
    "................................",
    "...........G..g1.GgG............",
    "...........gggggGggg1...........",
    "........g.glllggggggg1..........",
    "........lgllllggggggggG1........",
    ".......lllllllgggggggggg1.......",
    "......gllggggggggggggggGG1......",
    "....gglllgggggggggggggGGGG1.....",
    "....gllllgggggggggggggGGGGG1....",
    "...glllgggggggggggggGGGGGGG1....",
    "...gllggglggggGGGGGGGGGGGGGG1...",
    "..gllggggGggggGGGGGGGGGGGGGG1...",
    "..ggggggggggggGGGGGGGGGGG11111..",
    ".glggggggggGGGGGGGGGGGGGG11111..",
    ".gggggggggGGGGGGGGGGGGGGG111111.",
    ".ggggggggGGGGGGGGGGGGGG11111111."
   ]
  },
  "round_16": {
   "key": "round_16",
   "name": "fxhill_round_16",
   "id": "landscape/fxhill/round_16",
   "label": "Petite colline (16 × 8)",
   "kind": "sprite",
   "w": 16,
   "h": 8,
   "size": 16,
   "props": {
    "shape": "round",
    "season": "summer",
    "cover": "grass"
   },
   "tags": [
    "grass",
    "distant"
   ],
   "png": "library/png/landscape/fxhill/round_16.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAICAMAAADHqI+lAAAAD1BMVEUAAAAuejparkUfSiwSMB/UET9dAAAAAXRSTlMAQObYZgAAADNJREFUeNpdyMkNACAQw8BNnP5rRiyHEPOzqybVxwKc27Il6w41dI42IO9gjpxm6cHbyQAfgQCuhvrCGgAAAABJRU5ErkJggg==",
   "palette": {
    "1": "#12301f",
    "G": "#1f4a2c",
    "g": "#2e7a3a",
    "l": "#5aae45"
   },
   "rows": [
    ".....g..........",
    ".....lgGGGl1....",
    "....gllgglg1....",
    "...ggggggGgg1...",
    "..ggggggggGGG1..",
    "..gggggggGGGG11.",
    ".gggggGGGGGGG11.",
    ".GgggGGGGGGG1111"
   ]
  },
  "rolling_flowers_64": {
   "key": "rolling_flowers_64",
   "name": "fxhill_rolling_flowers_64",
   "id": "landscape/fxhill/rolling_flowers_64",
   "label": "Vallonnement fleuri (64 × 32)",
   "kind": "sprite",
   "w": 64,
   "h": 32,
   "size": 64,
   "props": {
    "shape": "rolling",
    "season": "spring",
    "cover": "flowers"
   },
   "tags": [
    "flower",
    "countryside"
   ],
   "png": "library/png/landscape/fxhill/rolling_flowers_64.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAMAAACVQ462AAAAIVBMVEUAAABarkUuejofSiyl11r/s8+3fuASMB/7+//zw0rc8ozPk6XQAAAAAXRSTlMAQObYZgAAAVFJREFUeNrtlN2uxCAIhDuDSrvv/8AnWrUgNtns9eFiNynwMfy0x/FviwFgM/kxP6WE235C1Px85xdA8Ev+owCgboL0SwBB8QBKM/0mnySkjvKJJkGW6nlHYMoHan6eADnYsCDPhtXtAnt9WtNRvjmkP92KmA0wEIjRmOc649DOHYCrR98AXE30kI0vNlGDkgvKJHLdG9v0aHyI6wwar1an7n7sRqTPUHYHwVVk7qHmNgGoqsgOwDDBG5CSAyS+EXhtR/jxgEQHMITQQGm/KXlA299WAnflRUzzM8AAVHXmlysALkmny8/jhjpCLSAKAJf6eG4oEFi/P2sDNt+6pQNULSAoELO8+x2+b7FXHvm634EDPEupf1O7GsLZPyD2UJNrHN65AlwHfUU2H/ND8qKA7cY8wCiAu40NgbN8eYKMKv8Orvk3AGXMibYDxtohX/8AiroNuYaoEkAAAAAASUVORK5CYII=",
   "palette": {
    "1": "#12301f",
    "2": "#dcf28c",
    "G": "#1f4a2c",
    "L": "#a5d75a",
    "Z": "#ffb3cf",
    "g": "#2e7a3a",
    "l": "#5aae45",
    "w": "#fbfbff",
    "x": "#b77ee0",
    "y": "#f3c34a"
   },
   "rows": [
    "................................................................",
    "................................................................",
    "................................................................",
    "................................................................",
    "..............lllggggggG........................................",
    ".............lLLLlllllllgG......................................",
    "............lLLLZllllllxllGl....................................",
    "...........lLLLLLlllllllgllg1...................1...............",
    "...........lLLLLLllllllglgGg1............gGGGGGG1...............",
    "..........lLLLLLllllggglGgggg1.........gglggxlgggG1.............",
    "..........lLLllllllllllGggZgg1......G.glllgglggwggg1.1..........",
    "........llLLLLlllggggggggggggg1.....ggllllggGgggggggG1..........",
    "........lLLLLLlllgggggggggggggg1...glLllllggggggggggg1..........",
    ".......gllllllllggggggggggggggg1...glgllllgggggggggggg1.........",
    ".......gllllllgggggggggggggggggG1.GgllllllggggggggggggG1........",
    ".......glllLllgggggggggggZgglZGGG1ggglggglgggggggggglGGG1.......",
    "......gllllggggggggggggyggggGgGGGLLllllllGGGggggggGGGGGGG1......",
    "......glllllgggggggggggZggggGGGLLLLllllllllll111GGGGGGGGG1......",
    ".....glllllllggggggggggZggggGLLLLLLlllllllllLg111GGGGGGGGG1.....",
    ".....gylllllgggggggggggggggg2LLLLLLllllllllLgg111GGGGGGGGGG1....",
    "....glllllgggggggggggxgggggLLLLLLLLllllllllgggg111GGGGGGGGG1....",
    "....gllllggggggggggggggggGGLllllllllllllllggggg111GGGGGGGG111...",
    "...glxyllgggggggggggggggyGLwlllllllllllllZggggggg111GGGGG1111...",
    "...gllllggggggggggggggglgLlllllllllllllllggggggggG111GGGGG1111..",
    "...glxllgggggggggggggggGLlllllllllllxllgggggggggGG111GGG111111..",
    "...gllllggggggggggggggGLLlllllllllggwgggggglggGGGG111GG1111111..",
    "..glllllggggggggggggggGLLlllllllggggxggggggxggGGGGG111111111111.",
    "..wllllGggggggggGGGGGGLlllllllgggggglggggggggGGGGGG111111111111.",
    "..gllllggggggggGGGGGGGlllllllggggglgGgggggggggGGGGG111111111111.",
    "..gllLgggggggggGGGGGGGLlllllllggglgggggggggggGGGGGGG111111111111",
    ".gllgggggggxgggggGGGGGgllllggggggGggggggGGGGGGGGGGG1111111111111",
    ".glllxgxgggggggGGGGGGllllllggggggggggggGGGGGGGGGGG11111111111111"
   ]
  },
  "rolling_autumn_64": {
   "key": "rolling_autumn_64",
   "name": "fxhill_rolling_autumn_64",
   "id": "landscape/fxhill/rolling_autumn_64",
   "label": "Vallonnement doré – automne (64 × 32)",
   "kind": "sprite",
   "w": 64,
   "h": 32,
   "size": 64,
   "props": {
    "shape": "rolling",
    "season": "autumn",
    "cover": "grass"
   },
   "tags": [
    "golden",
    "countryside"
   ],
   "png": "library/png/landscape/fxhill/rolling_autumn_64.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAMAAACVQ462AAAAElBMVEUAAADgeCpqQSg7Ihnzw0r/8Khr7nBuAAAAAXRSTlMAQObYZgAAARFJREFUeNrtldEWwyAIQ0cS//+Xdzq1KqDb6fN4lOYCobav1z9cmBk+wYd6SVbjEeLSd8ATxEc/AGYZgT8CFADfzan6BoBroSJ1nGwPQHNXfTKmC6x6FQsuWHMX/ZT7+qu+EkzFHTPVW4zqmcnKks6szADNdfhcuox7dR4AXhkAy2Eg1AVlejRvBBBzMAKyBrpczX7mALPUQZSi3wjY6Yu/HRMAPDdgd33bEHhyYMzvXqwB4P1C5v2n+usuVQQ5AdIGpJIAqtQRTHH7V/0I7q03+Q3I9aG67tm7nqMBrXqk4w/3OBOmD8hGryUXAAglVoD6JTkA/AAoA6BA50rAuIfjmWkBWDNOzzHB/Mzyf8FJzzf6Ggm8Woc/+AAAAABJRU5ErkJggg==",
   "palette": {
    "B": "#3b2219",
    "Y": "#fff0a8",
    "b": "#6a4128",
    "o": "#e0782a",
    "y": "#f3c34a"
   },
   "rows": [
    "................................................................",
    "................................................................",
    "................................................................",
    "................................................................",
    "..............ooobbbbbbB........................................",
    ".............oyyyooooooobB......................................",
    "............oyyyyooooooooobB....................................",
    "...........oyyyyyoooooooooooB...................B...............",
    "...........oyyyyyooooooyooooB............obbbbbbB...............",
    "..........oyyyyyyooooooboooooB.........ooyoooyooobB.............",
    "..........oyyyyyyooooooboooooB......b.oyyyooyooooooB.B..........",
    "........ooyyyyyyyYooooooooooooB.....ooyyyyooboooooooBB..........",
    "........oyyyyyyyYooooooooooooooB...oyYyYoooooooooooooB..........",
    ".......oyyooooooooooooooooooobbB...oyoYyyooooooooooobbB.........",
    ".......oyyooooooooooooooooobbbbbB.boyyooooooooooooobbbbB........",
    ".......ooooyooooooooooooooobbbbbbBoooybbbooooooobbbbbbbbB.......",
    "......oyoooboooooooooooooobbbbbbbyyyyyyyybbBbbbbbbbbbbbbbB......",
    "......oyoooooooooooooooooobbbbbyyyyyyyyyoooooBBBbbbbbbbbbB......",
    ".....ooooooooooooooooooooobbbYYyyyyyyyyyyoooooBBBbbbbbbbbbB.....",
    ".....booooooooooooooooooobbbYYYyyyyoooooooooooBBBbbbbbbbbbbB....",
    "....oooooooooooooooooooooobYYyyyyyyooooooooooooBBBbbbbbbbbbB....",
    "....oyooooooooooooooooobbbbyyyyyyooooooooooooooBBBbbbbbbbbBBB...",
    "...ooooooooooooooooooobbbbyyyyyyoooooooooooooooobBBBbbbbBBBBB...",
    "...oyooooooooooooooooobbbyyYyyyyooooooooooooooobbbBBBbbbbBBBBB..",
    "...oyooooooooooobbbbbbbbyyyoyoooooooooooooooobbbbbBBBbbBBBBBBB..",
    "...oooooooooooobbbbbbbbyyyyyoooooooooooooooybbbbbbBBBbBBBBBBBB..",
    "..oyoooyoooooobbbbbbbbbyyyyoooooooooooooooobbbbbbbbBBBBBBBBBBBB.",
    "..ooooobooooobbbbbbbbbyyyyooooooooooyoooobbbbbbbbbbBBBBBBBBBBBB.",
    "..booooooooobbbbbbbbbbyyyyooooooooyoboooooobbbbbbbbBBBBBBBBBBBB.",
    "..booyoooooobbbbbbbbbbYyyyoooooooyooooooobbbbbbbbbbBBBBBBBBBBBBB",
    ".boooboooooobbbbbbbbbboyoooooooooboooobbbbbbbbbbbbBBBBBBBBBBBBBB",
    ".booooooobbbbbbbbbbbbyyyooooooooobboobbbbbbbbbbbbBBBBBBBBBBBBBBB"
   ]
  },
  "rolling_dry_64": {
   "key": "rolling_dry_64",
   "name": "fxhill_rolling_dry_64",
   "id": "landscape/fxhill/rolling_dry_64",
   "label": "Vallonnement sec – savane (64 × 32)",
   "kind": "sprite",
   "w": 64,
   "h": 32,
   "size": 64,
   "props": {
    "shape": "rolling",
    "season": "summer",
    "cover": "straw"
   },
   "tags": [
    "savanna",
    "dry"
   ],
   "png": "library/png/landscape/fxhill/rolling_dry_64.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAMAAACVQ462AAAAFVBMVEUAAABqQSicazw7Ihnzw0rJmlsiFA+n6VpYAAAAAXRSTlMAQObYZgAAASVJREFUeNrdk0GWxCAIBQNfuP+R+2lUQDHdL7MbloQqEcl1/b+gvwqYWuAlzaXwHe8UXIRnvDCwsDiDruOpXeGRrzF5IpgCF1HL6TdeWKbAqpkrLos15cXxQ9AzcicPTQy+HdWqrfaeDM1Im8gaGIZ+KzMoJxvIbnqu1HhYlvWBpxCsF2j7AFI9CSJPAOr7SRECQl5/4gkoczAwBU6CBS9aSqX7ZM2AxeAm6B2lVF54PO0wAIvA814QH7Zvtz4JlgtkAmjnveEwgcCOz6q6CQ47sPKbYe5CbICfeRPoKth4yfjEEDcVU8D522AINBekF7DG2js0g2YCzvjQWD+687fBBJw0sP9cE/aCeH8iSTdzLkAQUCxr647RQHJ8FOgmCA2keDR8APLaC+zox2YmAAAAAElFTkSuQmCC",
   "palette": {
    "3": "#22140f",
    "B": "#3b2219",
    "N": "#c99a5b",
    "b": "#6a4128",
    "n": "#9c6b3c",
    "y": "#f3c34a"
   },
   "rows": [
    "................................................................",
    "................................................................",
    "................................................................",
    "................b...............................................",
    "................nbbbbbbB........................................",
    ".............nnyynnnnnnnbB......................................",
    ".............nyNnnnnnnnnnnB.....................................",
    "............nNnNNnnnnnnnnnn3...............bbB..B...............",
    "...........nNNNNNnnnnnnnnnbbB3.........B.bbnnnbb3...............",
    "..........nNNNNNNnNnnnnnnnbbb3........nnbnnnNnnbbB3.............",
    ".........nNNNNNNNNnnnnnnnbbbb3......nnnnnnnNnnbbbbb3............",
    "........nNNNNNNNnbnnnnnnNnbbbb3.....nNNnnnbbbbbbbbbbB3..........",
    "........nNNNNNNNNnnnnnnnbbbbbbb3....nNnnnnnbbbbbbbbbb3n.........",
    "........bnnnnnnnnnnbbbbbbbbbbbb3...nNnnnnnBbbbbbbbbbbn3.........",
    ".......bnnnnnnnnnbbbbbbbbbbbbbbn3.BbnnnnnnbbbbbbbbbbbBb33.......",
    ".......bnnnnnnnnbbbbbbbbbbbbbbbBBBbbnnNyNbBBbbbbbbbbbbbBB3......",
    "......bnnnnnnnnbbbbbbbbbbbbbbbbBByNNNNnnnnnBBBbbbbbbbbBBB3......",
    "......bnnnnnnnbbbbbbbbbbbbbbby3yyNNnnNnnnnnnBBBbbbbbbbBBBB3.....",
    ".....bnnnnnnnnnnnbbbbbbbbbbbyyyyNNNnnbnnnnnnnBBBbbbbBBBBBB3.....",
    "....bnnnnnnnnnnnnbbbbbbbbbbbNNNNNNNnnnnnnnnnnbbB33bbBBBBBB3.....",
    "....bnnnnnnnnbbbbbbbbbbbbbbyNNNNNNNnnnnnnnnnnbbBB3bBBBBBBBB3....",
    "....bnnnnnnnbbbbbbbbbbbbbbbNNNnnnnnnnnnnnnnbbbbb333BBBBBBBB3....",
    "...bnnnnnnnnnbbbbbbbbbbbbbNNNnnnnnnnnnnnnnnnbbbbb333BBBBBBB33...",
    "...bnnnnnnnbbbbbbnbbbbbbbNNNnnnnnnnnnnnnnnnbbbbbb333BBBBBB333...",
    "...bnnnnnnbbbbbbnbbbbbbbNNNNnnnnnnnnnnnnnnbbbbbbbb333BBBBBB333..",
    "..bnnnnnnbbbbbbbBbbbbbbbNNnnnnnnnnnnnnnbbbbbbbbbbB333BBBBB3333..",
    "..bnnnnnnbbbbbbbbbbbbbbNNNnnnnnnnnnnnbbnbbbbbbbbbBB333BBB33333..",
    "..bnnnnnnbbbbnbbbbbbbbNNNnnnnnnnnnbbbbbBbbbbbbbBBBB333BB3333333.",
    "..bnnnnnnbbbnbbbbbbbbbNNNnnnnnnnbbbbbbbbbbbbbbbBBBBB33333333333.",
    "..bnnnbbbbbbBbbbbbbbbbNnnnnnnnnnnbbbbbbbbbbbBBBBBBBB33333333333.",
    ".bnnnnnbbbbbbbbbBBBbbBNNnnnnnnbbbbbbbbbbbbbbBBBBBBBB333333333333",
    ".bnnnnnbbbbbbbbbbbbbbNnnnnnnnbbbbbbbbbbbbbBBBBBBBBBBB33333333333"
   ]
  },
  "rolling_snow_64": {
   "key": "rolling_snow_64",
   "name": "fxhill_rolling_snow_64",
   "id": "landscape/fxhill/rolling_snow_64",
   "label": "Vallonnement enneigé – hiver (64 × 32)",
   "kind": "sprite",
   "w": 64,
   "h": 32,
   "size": 64,
   "props": {
    "shape": "rolling",
    "season": "winter",
    "cover": "snow"
   },
   "tags": [
    "snow",
    "countryside"
   ],
   "png": "library/png/landscape/fxhill/rolling_snow_64.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAMAAACVQ462AAAAElBMVEUAAADT4PKPo8didZ/7+/8+S3I26SJhAAAAAXRSTlMAQObYZgAAAQFJREFUeNrt1MuWhCAMBFBTRf7/l+cYAY1U6HlsJ0uhLhHTfRz/9SpDL/4y32wU/G95A+g/z7eZBgyyCf9WA1c+A2CUf873W0QSLjEWSgLPC7iq72Ws4X6qDMsNJAHIC9SACSAELAte9Y+lNCCECoAfFMD6EuemJvKk92/6AAzL50RxPskxXSTvh8tAFMAZb4/fRyAUQHUDLeUtwgNIQgG0DFxXQq4C6vPtNZ7uXgDiAizXAkyhaEDlE+G+bUDHzxlaBAmktKXJGoDvgHR0yg/AfQC7Bh5/LvcQhuA+hU0DarQ/AjFsRR58Cx2ABkznA/DZAkzs2qQ525+AybxV8Sx8AcScC2D6lcsoAAAAAElFTkSuQmCC",
   "palette": {
    "S": "#8fa3c7",
    "[": "#3e4b72",
    "]": "#62759f",
    "s": "#d3e0f2",
    "w": "#fbfbff"
   },
   "rows": [
    "................................................................",
    "................................................................",
    "................................................................",
    "................................................................",
    "..............sSSSSSSSS]........................................",
    ".............swsssssssssS[......................................",
    "............swssssssssssSS][....................................",
    "...........swwsssssssSSSSsSS[...................[...............",
    "...........swssssssssSSSsSSS[............S]]]]]][...............",
    "..........swssssssSSSSSS]SSSS[.........SSsSSSSSSS][.............",
    "..........SssssssssssSSSSSSSS[......].SsssSSSSSSSSS[.[..........",
    "........sswssssssSSSSSSSSSSSSS[.....SSssssSSSSSSSSSS][..........",
    "........sssssssssSSSSSSSSSSSSSS[...SssssssSSSSSSSSSSS[..........",
    ".......SsssssSSSSSSSSSSSSSSSSSS[...SssssssSSSSSSSSSSSS[.........",
    ".......SsssssSSSSSSSSSSSSSSSSSSS[.]SssssssSSSSSSSSSSSS][........",
    ".......SssswSSSSSSSSSSSSSSSSSSS]][SSSsSSSsSSSSSSSSSSsS]][.......",
    "......SssssSSSSSSSSSSSSSSSSSSS]]]wwssssss]]]SSSSSSS]]]]]][......",
    "......SssssSSSSSSSSSSSSSSSSSS]]wwwwsssssssssS]]]SS]]]]]]][......",
    ".....SsssssSSSSSSSSSSSSSSSSSSwwwwwssssssssssSS]]]S]]]]]]]][.....",
    ".....SsssssSSSSSSSSSSSSSSSSSwwwwwwsssssssssSSS]][]]]]]]]]]][....",
    "....SssssSSSSSSSSSSSSSSSSSSwwwwsssssssssssSSSSS[[[]]]]]]]]][....",
    "....SsssSSSSSSSSSSSSSSSSSS]sssssssssssssssSSSSS[[[]]]]]]]]]][...",
    "...SssssSSSSSSSSSSSSSSSSSSsssssssssssssssSSSSSSSS[[[]]]]]]][[...",
    "...SsssSSSSSSSSSSSSSSSSSSssssssssssssssSSSSSSSSSS][[[]]]]]]][[..",
    "...SsssSSSSSSSSSSSSSSSSSssssssssssssSsSSSSSSSSSS]][[[]]]]]][[[..",
    "...SsssSSSSSSSSSSSSSSSSsssssssssSSSSsSSSSSSSSSS]]][[[]]]][[[[[..",
    "..SsssSSSSSSSSSSSSSSSSSsssssssSSSSSS]SSSSSSSSS]]]]][[[]][[[[[[[.",
    "..SsssSSSSSSSSSSSSSSSSsssssssSSSSSSSSSSSSSSSSS]]]]][[[]][[[[[[[.",
    "..SsssSSSSSSSSSSS]]]S]ssssssSSSSSSSSSSSSSSSSSS]]]]]][[[]][[[[[[.",
    "..SssSSSSSSSSSSSS]]]S]sssssssSSSSSSSSSSSSSSSS]]]]]]][[[][[[[[[[[",
    ".SsSSSSSSSSSSSSSSS]]]]ssssSSSSSSSSSSSSSSSS]]]]]]]]]][[[[[[[[[[[[",
    ".SssSSSSSSSSSSSSS]]]]sssssSSSSSSSSSSSSSS]]]]]]]]]]]]][[[[[[[[[[["
   ]
  }
 }
};
export default asset;
