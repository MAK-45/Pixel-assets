// GÉNÉRÉ par scripts/build.js — ne pas modifier. Source : assets/landscape/hill.px.js
// Colline — 12 variante(s). Usage :
//   import asset from "./hill.js"; const v = asset.variants["round_32"];
//   v.src (data URL PNG), v.rows + v.palette (pixels, "." = transparent), v.w, v.h
/** @type {import("../../index.d.ts").PixelAsset} */
export const asset = {
 "id": "landscape/hill",
 "slug": "hill",
 "category": "landscape",
 "title": "Colline",
 "description": "Collines vues de face pour décors 2D, posées au sol : colline ronde (16, 32 px) en herbe d'été, fleurie, parsemée de pierres, dorée d'automne ou enneigée ; vallonnement de trois collines qui se recouvrent (64 × 24) en été, fleuri, automne et hiver ; dune de sable et champ de dunes du désert. Ombrage en croissants (lumière en haut à gauche), contour sombre.",
 "tags": [
  "hill",
  "landscape",
  "terrain",
  "background",
  "scenery",
  "relief",
  "meadow",
  "ground"
 ],
 "order": 0,
 "source": "assets/landscape/hill.px.js",
 "module": "library/js/landscape/hill.js",
 "sheet": {
  "png": "library/sheets/landscape/hill.png",
  "json": "library/sheets/landscape/hill.json"
 },
 "axes": {
  "shape": [
   "round",
   "rolling",
   "dune"
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
   "rocks",
   "snow",
   "sand"
  ]
 },
 "sizes": [
  16,
  32,
  64
 ],
 "variantCount": 12,
 "variants": {
  "round_32": {
   "key": "round_32",
   "name": "hill_round_32",
   "id": "landscape/hill/round_32",
   "label": "Colline ronde – été",
   "kind": "sprite",
   "w": 32,
   "h": 18,
   "size": 32,
   "props": {
    "shape": "round",
    "season": "summer",
    "cover": "grass"
   },
   "tags": [
    "grass"
   ],
   "png": "library/png/landscape/hill/round_32.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAASCAMAAAANFixgAAAAElBMVEUAAAAaFCNarkUuejofSiyl11pU2zqcAAAAAXRSTlMAQObYZgAAAHhJREFUeNqVkkkOAyEMBOmF/385wkzAJswhxQXRZbOI1v4BD68xSUr2VQF6H3FwUSKeHcIwzpxfQqCFl3wZuQc6x8hC2SXq+9EiG2BF6y5Prg2VmQYs7oBJ8dwEP4Wqp8BePvuEANfCpXG8hdHgA5XJRahgf4I77QPmPwRjDJ5jIwAAAABJRU5ErkJggg==",
   "palette": {
    "G": "#1f4a2c",
    "L": "#a5d75a",
    "g": "#2e7a3a",
    "k": "#1a1423",
    "l": "#5aae45"
   },
   "rows": [
    "................................",
    "............kkkkkkkk............",
    "..........kkllllggGGkk..........",
    "........kkLLllgggggggGkk........",
    ".......kLLllllllggggggGGk.......",
    "......kLlllllllllggggglGgk......",
    ".....kLlllllllllllggggglGGk.....",
    "....kLlLlLllllllllgggggggGGk....",
    "...kLlllLllllllllllgggggggGGk...",
    "...klllllllllllllllggggggggGk...",
    "..kggggggggggglgggggggggggggGk..",
    ".kGglglggggggggllggggggggggGGGk.",
    ".kggglgggggggggggggglgggggggGGk.",
    ".kgggggggglglggggggggllgggggGGk.",
    "kGggggggggglgggglglgggggglglGGGk",
    "kGGGGGGGGGGGGGGGGgGGGGGGGGgGGGGk",
    "kGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGk",
    ".kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk."
   ]
  },
  "flowers_32": {
   "key": "flowers_32",
   "name": "hill_flowers_32",
   "id": "landscape/hill/flowers_32",
   "label": "Colline fleurie – printemps",
   "kind": "sprite",
   "w": 32,
   "h": 18,
   "size": 32,
   "props": {
    "shape": "round",
    "season": "spring",
    "cover": "flowers"
   },
   "tags": [
    "flower",
    "grass"
   ],
   "png": "library/png/landscape/hill/flowers_32.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAASCAMAAAANFixgAAAAG1BMVEUAAAAaFCNarkUuejofSiyl11r7+//zw0r/s893W79WAAAAAXRSTlMAQObYZgAAAJRJREFUeNqVkssSgzAMA5HkGP7/izt2TEJoeqhOwK5fMxzHP0HlJyZJyWyrAK0FluTaKIlJnpKfLnO8OXuc0eGiCd/cST+HYVh4YwsYknoeRta3hOyHvAxwjY9bimsmquOKuiUNmFPUVUbs6NWhD8FdONr0FmMLzK/3evcpKcCquniMy3eKOQP2ipaHjbAG8yfY5/gAm5YFAcbF43YAAAAASUVORK5CYII=",
   "palette": {
    "G": "#1f4a2c",
    "L": "#a5d75a",
    "Z": "#ffb3cf",
    "g": "#2e7a3a",
    "k": "#1a1423",
    "l": "#5aae45",
    "w": "#fbfbff",
    "y": "#f3c34a"
   },
   "rows": [
    "................................",
    "............kkkkkkkk............",
    "..........kkllllggGGkk..........",
    "........kkLLllgggggwgGkk........",
    ".......kLLlllllyggwywgGwk.......",
    "......kLlllllllwlggwgZlGgk......",
    ".....kLllllwllwywlggwgZlGGk.....",
    "....kLlLlLwywllwllgggggggGGk....",
    "...kLlllLllwlllllllgggggggGGk...",
    "...klllllllllllllllwgggggwgGk...",
    "..kggggggggggglgggwywgggwywgGk..",
    ".kGwlglgZggggggllggwwggggwgGGGk.",
    ".kggglgggwgggggggggwywggggggGGk.",
    ".kggggggwywglgggggggwllgggggGGk.",
    "kGgggwgggwglgggglglggwggglglGGGk",
    "kGGGGGGGGGGGGGGGGgGGGGGGGGgGGGGk",
    "kGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGk",
    ".kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk."
   ]
  },
  "rocky_32": {
   "key": "rocky_32",
   "name": "hill_rocky_32",
   "id": "landscape/hill/rocky_32",
   "label": "Colline semée de pierres",
   "kind": "sprite",
   "w": 32,
   "h": 18,
   "size": 32,
   "props": {
    "shape": "round",
    "season": "summer",
    "cover": "rocks"
   },
   "tags": [
    "rock",
    "stone",
    "grass"
   ],
   "png": "library/png/landscape/hill/rocky_32.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAASCAMAAAANFixgAAAAHlBMVEUAAAAaFCOLiqPDwtRarkUuejofSiyl11pXVnAvLTyE2DffAAAAAXRSTlMAQObYZgAAAJ9JREFUeNqVkkEOxCAMA+sQm/D/D68CtJSqPeycEBlIsDiOf8Dks2zFnZReFaBaKRZMXhTUahYW0YYhPOueQkTrghURj7p7VZJTmEXb7sjznk6HDGtx7zLOuy9D+xzwHU5OAVw47wwDolu5jEuxotEEuT4TYldTWi8BZ0JO79vjnoykCxAzoEwoHxitzSaS9x4QRd3gtkhhrz/A+gTvHD+zzQdb4USOTgAAAABJRU5ErkJggg==",
   "palette": {
    "C": "#c3c2d4",
    "G": "#1f4a2c",
    "L": "#a5d75a",
    "c": "#8b8aa3",
    "d": "#2f2d3c",
    "g": "#2e7a3a",
    "k": "#1a1423",
    "l": "#5aae45",
    "m": "#575670"
   },
   "rows": [
    "................................",
    "............kkkkkkkk............",
    "..........kkcCllggGGkk..........",
    "........kkLcCCcmgggggGkk........",
    ".......kLLccmcmmdgggggGGk.......",
    "......kLlLccmmmddggggcCGgk......",
    ".....kLlllLGGGGGllggccmdGGk.....",
    "....kLlLlLllllllllggmcdmgGGk....",
    "...kLlllLllllllllllggGggggGGk...",
    "...klllllllllllllllggggggggGk...",
    "..kggggggggggglgggggggggggggGk..",
    ".kGglcCggggggggllggggggggcCGGGk.",
    ".kggcCCcmggggggcCggglgggccmdGGk.",
    ".kgccmcmmdlglgccmdgggllgmmddGGk.",
    "kGgcmmmmddglggmmddlggggggGGlGGGk",
    "kGgGgGGGGGGGGGGGGgGGGGGGGGgGGGGk",
    "kGGgGGGGGGGGGGGGGGGGGGGGGGGGGGGk",
    ".kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk."
   ]
  },
  "autumn_32": {
   "key": "autumn_32",
   "name": "hill_autumn_32",
   "id": "landscape/hill/autumn_32",
   "label": "Colline dorée – automne",
   "kind": "sprite",
   "w": 32,
   "h": 18,
   "size": 32,
   "props": {
    "shape": "round",
    "season": "autumn",
    "cover": "grass"
   },
   "tags": [
    "grass",
    "golden"
   ],
   "png": "library/png/landscape/hill/autumn_32.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAASCAMAAAANFixgAAAAElBMVEUAAAAaFCPzw0rgeCpqQSj/8KjFMcfJAAAAAXRSTlMAQObYZgAAAHhJREFUeNqVkkkOAyEMBOmF/385wkzAJswhxQXRZbOI1v4BD68xSUr2VQF6H3FwUSKeHcIwzpxfQqCFl3wZuQc6x8hC2SXq+9EiG2BF6y5Prg2VmQYs7oBJ8dwEP4Wqp8BePvuEANfCpXG8hdHgA5XJRahgf4I77QPmPwRjDJ5jIwAAAABJRU5ErkJggg==",
   "palette": {
    "Y": "#fff0a8",
    "b": "#6a4128",
    "k": "#1a1423",
    "o": "#e0782a",
    "y": "#f3c34a"
   },
   "rows": [
    "................................",
    "............kkkkkkkk............",
    "..........kkyyyyoobbkk..........",
    "........kkYYyyooooooobkk........",
    ".......kYYyyyyyyoooooobbk.......",
    "......kYyyyyyyyyyoooooybok......",
    ".....kYyyyyyyyyyyyoooooybbk.....",
    "....kYyYyYyyyyyyyyooooooobbk....",
    "...kYyyyYyyyyyyyyyyooooooobbk...",
    "...kyyyyyyyyyyyyyyyoooooooobk...",
    "..koooooooooooyooooooooooooobk..",
    ".kboyoyooooooooyyoooooooooobbbk.",
    ".koooyooooooooooooooyooooooobbk.",
    ".kooooooooyoyooooooooyyooooobbk.",
    "kboooooooooyooooyoyooooooyoybbbk",
    "kbbbbbbbbbbbbbbbbobbbbbbbbobbbbk",
    "kbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbk",
    ".kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk."
   ]
  },
  "snow_32": {
   "key": "snow_32",
   "name": "hill_snow_32",
   "id": "landscape/hill/snow_32",
   "label": "Colline enneigée – hiver",
   "kind": "sprite",
   "w": 32,
   "h": 18,
   "size": 32,
   "props": {
    "shape": "round",
    "season": "winter",
    "cover": "snow"
   },
   "tags": [
    "snow"
   ],
   "png": "library/png/landscape/hill/snow_32.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAASCAMAAAANFixgAAAAElBMVEUAAAAaFCP7+//T4PKPo8ecazz/eXt3AAAAAXRSTlMAQObYZgAAAHJJREFUeNqVklsOwCAIBOWx979yowKFBpt2/3QGNjYd40/IcsTMzCKqreJ4pVEWvhVVOvCDkfg2IMiGcTBiBfKOmEcuSUYpaATaZ7/3zC+yDNIKIDBD9w56TDqPEipjuQ0KigbUfnvrXEH6mg9C/AR9xgXcTARw8TKeogAAAABJRU5ErkJggg==",
   "palette": {
    "S": "#8fa3c7",
    "k": "#1a1423",
    "n": "#9c6b3c",
    "s": "#d3e0f2",
    "w": "#fbfbff"
   },
   "rows": [
    "................................",
    "............kkkkkkkk............",
    "..........kkwwwwssSSkk..........",
    "........kkwwwwsssssssSkk........",
    ".......kwwwwwwwwssssssSSk.......",
    "......kwwwwwwwwwwssssssSSk......",
    ".....kwwwwwwwwwwwwssssnsnSk.....",
    "....kwwwwwwnwnwwwwsssssnsSSk....",
    "...kwwwwwwwwnwwwwwwsssssssSSk...",
    "...kwwwwwwwwwwwwwwwsssssssSSk...",
    "..ksssssswssssssssssssssswssSk..",
    ".kSssssssssssssssnsnsssssswSSSk.",
    ".kssssssssssssssssnsssssssssSSk.",
    ".kssssnsnssssssssssswssssssnSnk.",
    "kSsssssnssssssssssssswwsssssnSSk",
    "kSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSk",
    "kSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSk",
    ".kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk."
   ]
  },
  "round_16": {
   "key": "round_16",
   "name": "hill_round_16",
   "id": "landscape/hill/round_16",
   "label": "Petite colline (16 px)",
   "kind": "sprite",
   "w": 16,
   "h": 10,
   "size": 16,
   "props": {
    "shape": "round",
    "season": "summer",
    "cover": "grass"
   },
   "tags": [
    "icon",
    "grass"
   ],
   "png": "library/png/landscape/hill/round_16.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAKCAMAAACKYC6uAAAAElBMVEUAAAAaFCOl11ouejofSixarkX8ZQZNAAAAAXRSTlMAQObYZgAAAEFJREFUeNpNzlkKADEIBFHL1vtfeXAJzstXFwgxawB2wF1xCffMVARvZ5O2kBtCzFa9MkdIvXMD8VQIfqExfzr2AWdUAWmPD76wAAAAAElFTkSuQmCC",
   "palette": {
    "G": "#1f4a2c",
    "L": "#a5d75a",
    "g": "#2e7a3a",
    "k": "#1a1423",
    "l": "#5aae45"
   },
   "rows": [
    "......kkkk......",
    "....kkLLgGkk....",
    "...kLLlllgGGk...",
    "..kLllllllggGk..",
    "..klllllllgGgk..",
    ".klglglgggggGGk.",
    ".kggglggglggGGk.",
    "kGGGGGGGGGggGGGk",
    "kGGGGGGGGGGGGGGk",
    ".kkkkkkkkkkkkkk."
   ]
  },
  "rolling_64": {
   "key": "rolling_64",
   "name": "hill_rolling_64",
   "id": "landscape/hill/rolling_64",
   "label": "Vallonnement – été (64 × 24)",
   "kind": "sprite",
   "w": 64,
   "h": 24,
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
   "png": "library/png/landscape/hill/rolling_64.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAYCAMAAAB9agt2AAAAFVBMVEUAAAAaFCMuejofSiwWOjdarkWl11r55MXIAAAAAXRSTlMAQObYZgAAAPJJREFUeNqtlFsSxSAIQ0so7H/Jd1BULPY5N5/UHAM43bZnItf2SUQEAMy8f2EQiQh37S8RZoff74RXiGY/Ip77u10gLwht6MNvBL4ihC1RGZt52a9OTSRC2ZNPmFQ1WIAQ44xgo+oTVhEPUD2hCzsERiLUVmtZ3S9TiJlwBLRRWVlFVPScwIsmKKQt919l4EwIq+KRv2CWNuaCDoCxqWA3giaCDbCVDWCEGqDW5KgUAaz9g0egEQ0LtVfUztQZKQbhBgCZIug0Hnt5AbC4F8f9pVoERJekRvIdhTAlEJzKX/pUEgfsLr7V6sgfAP3f8U3bDw5EDIUkP2OlAAAAAElFTkSuQmCC",
   "palette": {
    "G": "#1f4a2c",
    "L": "#a5d75a",
    "P": "#163a37",
    "g": "#2e7a3a",
    "k": "#1a1423",
    "l": "#5aae45"
   },
   "rows": [
    ".......................................kkkkkkkk.................",
    "....................................kkkggggGGGPkkk..............",
    "..................................kklllGGGGGGGGGGPkk............",
    "................................kkllgggggGGGGGGGGGPPkk..........",
    "...............................kllgggggggggGGGGGGGGGPPk.........",
    "..............................klggggggggglglGGGGGGGGGPPk........",
    "......................kkkkkkkklggggggggggglgGGGGGGGGGGPPk.......",
    "........kkkkkk.....kkkllllgggGgggglglggggggggGGGGGGGGGGPPk......",
    "......kkgggGGPkk..kLLLlggggggggGGgglggggggggggGGGGGGGGGGPPk.....",
    ".....kllgGGGGGPPkkLllllllggggggggGggggggggggggGGGgGgGGGGGPPk....",
    "....klggggGGGGGPLLllllllllggggggggGGgggggggggggGGGgGGGGGGPPk....",
    "...klggggggGGGGLllLlLllllllggggggggGGggggggggggGGGGGGGGGGGPPk...",
    "..klggggggggGgLLlllLllllllllggggggggGGgggggggggGGGGGGGGGGGGPPk..",
    ".klgggggggggGLLllllllllllLllgggggggggGGGGGGGGGGGGGGlllggGGGPPk..",
    ".kggglglggggLlllllllllllllLLlgggggggggGGGGGGGgGgGLLlgggggGGPPPk.",
    "klgggglggggglllllllllllllllllgggggggggGGGGGGGGgGLlllllggggGGPPk.",
    "kGGGGGGGGGGgggggggggggggggggggglglgggggGGGGGGGGLlllLlLgggggGGPPk",
    "kGGGGGGGGGGggggggggggggggggggggglggggggGGGGGGGLlllllLllgggggGGPk",
    "kGGGGGGGGGggggggggggglglggggggggggggggggGGGGGGggggggggggggggGGGk",
    "kGGGGGGGGGlglggggggggglgggggggggggggglglGGGGGggggggggggglggggGGk",
    "kGGGGGGGGGglgggggggggggggggggggggggggglgGGGGGggggggggggggllggGGk",
    "kPPPPPPPPGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGPGGGGGGGGGGGGGGGGGGGk",
    "kPPPPPPPPGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGPGGGGGGGGGGGGGGGGGGGk",
    ".kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk."
   ]
  },
  "rolling_flowers_64": {
   "key": "rolling_flowers_64",
   "name": "hill_rolling_flowers_64",
   "id": "landscape/hill/rolling_flowers_64",
   "label": "Vallonnement fleuri – printemps (64 × 24)",
   "kind": "sprite",
   "w": 64,
   "h": 24,
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
   "png": "library/png/landscape/hill/rolling_flowers_64.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAYCAMAAAB9agt2AAAAHlBMVEUAAAAaFCMuejofSiwWOjdarkWl11r/s8/zw0r7+/+TgA46AAAAAXRSTlMAQObYZgAAASFJREFUeNqtlFGSxCAIRAOKyP0vvIWCAZ3anaS2P630o22cua7vBKbrlQAAEbGUUt8wAIioLNWHCLWjzTfCI4Tbd8T3/mUnpAcEL/32K6H8RghbglGbeouNPi5xEMaerGForQULYogxzHwStKrVcCOyANMTbqEfIfeDAMROr83844g9RCbsl/Cq9LgRNckZWD1nCzcBQtox3zPMc03MnU+AE8KqivrF3M0jMOLszTXQAbA2JWs0KSfswgcjjyEyK6uDMAMMfxfKEkEZEcQA3FmHzBtZBLijCWZJF83GnfsizI7YYikhAHCXzGyM4ndoqR59eQGQnj2Zf2vhOIuA6KKUpPsvEdde5hcZsLmS7KWnIzJANZU/9emTfwCs/453un4AxTQNsynmwbYAAAAASUVORK5CYII=",
   "palette": {
    "G": "#1f4a2c",
    "L": "#a5d75a",
    "P": "#163a37",
    "Z": "#ffb3cf",
    "g": "#2e7a3a",
    "k": "#1a1423",
    "l": "#5aae45",
    "w": "#fbfbff",
    "y": "#f3c34a"
   },
   "rows": [
    ".......................................kkkkkkkk.................",
    "....................................kkkggggGGGPkkk..............",
    "..................................kklllGGGGGGGGGGPkk............",
    "................................kkllgggggGGGGGGGGGPPkk..........",
    "...............................kllgggggggggGGGGGGGGGPPk.........",
    "..............................klggggggggglglGGGGGGGGGPPk........",
    "......................kkkkkkkklggggggggggglgGGGGGGGGGGPPk.......",
    "........kkkkkk.....kkkllllgggGgggglglggggggggGGGGGGGGGGPPk......",
    "......kkgggGGPkk..kLLLlggggggggGGgglggggggggggGGGGGZGGGGPPk.....",
    ".....kllgGGGGGPPkkLllllllggggggggGggggggggggggGGGgZyZGGGGPPk....",
    "....klZgggGGGGGPLLlllllllZgggZggggGGgggggggggggGGGgZGGGGGPPk....",
    "...klggggggGGGGLllLwLllllllgggggggZGGgZggggggggGGGGGGGGGGGPPk...",
    "..klggggggggGgLLlllLllllllllgggggZyZGZyZgggggggGGGGGGGGGGGGPPk..",
    ".klgggggggggGLLllwlllllllLllggggggZggGZGGGGGGGGGGGGlllggGGGPPk..",
    ".kggglglgggwLlllllllllllwlLLlgggggggggGGGGGGGgZgGLLlwZgggGGPPPk.",
    "klgggglgggwywlllllllllllllllwwgwgggZgwGGGGGGGZyZLlllZyZgggGGPPk.",
    "kGGGGGGGGGGwgggggggggggggggwywglglZyZywGGGGGGGZLlllLlZgggggGGPPk",
    "kGGGGGGGGGGgggggggggggggggggwggglggZgwgGGGGGGGLlllllLllgggggGGPk",
    "kGGGGGGGGGggggggggggglglgggwggggggggggggGGGGGGgwggggggggggggGGGk",
    "kGGGGGGGGGlglgggwggggglgggggggggggggylglGGGGGgggggggZggglggggGGk",
    "kGGGGGGGGGglgggggggggggggggggggggggggglgGGGGGggggggggggggllggGGk",
    "kPPPPPPPPGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGPGGGGGGGGGGGGGGGGGGGk",
    "kPPPPPPPPGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGPGGGGGGGGGGGGGGGGGGGk",
    ".kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk."
   ]
  },
  "rolling_autumn_64": {
   "key": "rolling_autumn_64",
   "name": "hill_rolling_autumn_64",
   "id": "landscape/hill/rolling_autumn_64",
   "label": "Vallonnement doré – automne (64 × 24)",
   "kind": "sprite",
   "w": 64,
   "h": 24,
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
   "png": "library/png/landscape/hill/rolling_autumn_64.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAYCAMAAAB9agt2AAAAFVBMVEUAAAAaFCPgeCpqQSg7Ihnzw0r/8Kj/TIHCAAAAAXRSTlMAQObYZgAAAPJJREFUeNqtlFsSxSAIQ0so7H/Jd1BULPY5N5/UHAM43bZnItf2SUQEAMy8f2EQiQh37S8RZoff74RXiGY/Ip77u10gLwht6MNvBL4ihC1RGZt52a9OTSRC2ZNPmFQ1WIAQ44xgo+oTVhEPUD2hCzsERiLUVmtZ3S9TiJlwBLRRWVlFVPScwIsmKKQt919l4EwIq+KRv2CWNuaCDoCxqWA3giaCDbCVDWCEGqDW5KgUAaz9g0egEQ0LtVfUztQZKQbhBgCZIug0Hnt5AbC4F8f9pVoERJekRvIdhTAlEJzKX/pUEgfsLr7V6sgfAP3f8U3bDw5EDIUkP2OlAAAAAElFTkSuQmCC",
   "palette": {
    "B": "#3b2219",
    "Y": "#fff0a8",
    "b": "#6a4128",
    "k": "#1a1423",
    "o": "#e0782a",
    "y": "#f3c34a"
   },
   "rows": [
    ".......................................kkkkkkkk.................",
    "....................................kkkoooobbbBkkk..............",
    "..................................kkyyybbbbbbbbbbBkk............",
    "................................kkyyooooobbbbbbbbbBBkk..........",
    "...............................kyyooooooooobbbbbbbbbBBk.........",
    "..............................kyoooooooooyoybbbbbbbbbBBk........",
    "......................kkkkkkkkyoooooooooooyobbbbbbbbbbBBk.......",
    "........kkkkkk.....kkkyyyyooobooooyoyoooooooobbbbbbbbbbBBk......",
    "......kkooobbBkk..kYYYyoooooooobbooyoooooooooobbbbbbbbbbBBk.....",
    ".....kyyobbbbbBBkkYyyyyyyooooooooboooooooooooobbbobobbbbbBBk....",
    "....kyoooobbbbbBYYyyyyyyyyoooooooobbooooooooooobbbobbbbbbBBk....",
    "...kyoooooobbbbYyyYyYyyyyyyoooooooobboooooooooobbbbbbbbbbbBBk...",
    "..kyooooooooboYYyyyYyyyyyyyyoooooooobbooooooooobbbbbbbbbbbbBBk..",
    ".kyooooooooobYYyyyyyyyyyyYyyooooooooobbbbbbbbbbbbbbyyyoobbbBBk..",
    ".koooyoyooooYyyyyyyyyyyyyyYYyooooooooobbbbbbbobobYYyooooobbBBBk.",
    "kyooooyoooooyyyyyyyyyyyyyyyyyooooooooobbbbbbbbobYyyyyyoooobbBBk.",
    "kbbbbbbbbbbooooooooooooooooooooyoyooooobbbbbbbbYyyyYyYooooobbBBk",
    "kbbbbbbbbbboooooooooooooooooooooyoooooobbbbbbbYyyyyyYyyooooobbBk",
    "kbbbbbbbbboooooooooooyoyoooooooooooooooobbbbbboooooooooooooobbbk",
    "kbbbbbbbbbyoyoooooooooyooooooooooooooyoybbbbboooooooooooyoooobbk",
    "kbbbbbbbbboyooooooooooooooooooooooooooyobbbbbooooooooooooyyoobbk",
    "kBBBBBBBBbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbBbbbbbbbbbbbbbbbbbbbk",
    "kBBBBBBBBbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbBbbbbbbbbbbbbbbbbbbbk",
    ".kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk."
   ]
  },
  "rolling_snow_64": {
   "key": "rolling_snow_64",
   "name": "hill_rolling_snow_64",
   "id": "landscape/hill/rolling_snow_64",
   "label": "Vallonnement enneigé – hiver (64 × 24)",
   "kind": "sprite",
   "w": 64,
   "h": 24,
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
   "png": "library/png/landscape/hill/rolling_snow_64.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAYCAMAAAB9agt2AAAAElBMVEUAAAAaFCPT4PKPo8eLiqP7+/+N8khVAAAAAXRSTlMAQObYZgAAAORJREFUeNqtlNEShSAIRAXc///lOygYhmU1dx8Z97iAVcozkal8EhExM4tI/cIgAiBD9SVC7Wz3G+EVwu1nxHP/sIPxguBDP/xKkDtC2BK1salX7OrURCK0PdmE3W0W5hDjiqCjGhNG1/CELvQQCydCb7WXMRRDzIQzwEelZeCeIIsmKKQFNgTJhLAqwRow2VrK/mEY4NgUsCHoADGedm2EHqDXtgDxkE5QwBGNF/JXFOIjZqAdgDFFmLPpywuAxb183l+qRUB0ITWS72iEKQH4UvbSpxIMUE2y1erIHwDj3/FN5QfF/Axrs1TXZgAAAABJRU5ErkJggg==",
   "palette": {
    "S": "#8fa3c7",
    "c": "#8b8aa3",
    "k": "#1a1423",
    "s": "#d3e0f2",
    "w": "#fbfbff"
   },
   "rows": [
    ".......................................kkkkkkkk.................",
    "....................................kkkssssSSSckkk..............",
    "..................................kkwwwSSSSSSSSSSckk............",
    "................................kkwwsssssSSSSSSSSScckk..........",
    "...............................kwwsssssssssSSSSSSSSScck.........",
    "..............................kwssssssssswswSSSSSSSSScck........",
    "......................kkkkkkkkwssssssssssswsSSSSSSSSSScck.......",
    "........kkkkkk.....kkkwwwwsssSsssswswssssssssSSSSSSSSSScck......",
    "......kksssSSckk..kwwwwssssssssSSsswssssssssssSSSSSSSSSScck.....",
    ".....kwwsSSSSScckkwwwwwwwssssssssSssssssssssssSSSsSsSSSSScck....",
    "....kwssssSSSSScwwwwwwwwwwssssssssSSsssssssssssSSSsSSSSSScck....",
    "...kwssssssSSSSwwwwwwwwwwwwssssssssSSssssssssssSSSSSSSSSSScck...",
    "..kwssssssssSswwwwwwwwwwwwwwssssssssSSsssssssssSSSSSSSSSSSScck..",
    ".kwsssssssssSwwwwwwwwwwwwwwwsssssssssSSSSSSSSSSSSSSwwwssSSScck..",
    ".kssswswsssswwwwwwwwwwwwwwwwwsssssssssSSSSSSSsSsSwwwsssssSSccck.",
    "kwsssswssssswwwwwwwwwwwwwwwwwsssssssssSSSSSSSSsSwwwwwwssssSScck.",
    "kSSSSSSSSSSsssssssssssssssssssswswsssssSSSSSSSSwwwwwwwsssssSScck",
    "kSSSSSSSSSSssssssssssssssssssssswssssssSSSSSSSwwwwwwwwwsssssSSck",
    "kSSSSSSSSSssssssssssswswssssssssssssssssSSSSSSssssssssssssssSSSk",
    "kSSSSSSSSSwswssssssssswsssssssssssssswswSSSSSssssssssssswssssSSk",
    "kSSSSSSSSSswsssssssssssssssssssssssssswsSSSSSsssssssssssswwssSSk",
    "kccccccccSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSScSSSSSSSSSSSSSSSSSSSk",
    "kccccccccSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSScSSSSSSSSSSSSSSSSSSSk",
    ".kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk."
   ]
  },
  "dune_32": {
   "key": "dune_32",
   "name": "hill_dune_32",
   "id": "landscape/hill/dune_32",
   "label": "Dune de sable",
   "kind": "sprite",
   "w": 32,
   "h": 14,
   "size": 32,
   "props": {
    "shape": "dune",
    "season": "summer",
    "cover": "sand"
   },
   "tags": [
    "desert",
    "sand"
   ],
   "png": "library/png/landscape/hill/dune_32.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAOCAMAAAB5Au6AAAAAFVBMVEUAAAAaFCP/8KhqQSjJmlucazw7IhmfUnJFAAAAAXRSTlMAQObYZgAAAFtJREFUeNqVzVEOwCAIA1AL6P2PvNhNheFM1i+TvmIpPwPm0EqP4qMWEevRrYDdLUEWAKtaH/AWGGMSTQJzPL6IAmu8LjiBdZ7EWhTw5/lqQaCmtBlsewcojikXUZEDum7cj/EAAAAASUVORK5CYII=",
   "palette": {
    "B": "#3b2219",
    "N": "#c99a5b",
    "Y": "#fff0a8",
    "b": "#6a4128",
    "k": "#1a1423",
    "n": "#9c6b3c"
   },
   "rows": [
    "................................",
    "...............kkkkkk...........",
    "............kkkYYYYYbk..........",
    "..........kkYYYNNNNNbbk.........",
    ".........kNYNNNNNNNNbbbk........",
    ".......kkNNNNNnnNNNNbbbbk.......",
    "......kNNNNNNNNNnnNNbbbbbk......",
    ".....kNNNnnNNNNNNNNNbbbbbbk.....",
    "....kNNNNNNnnNNNnnNNbbbbbbbk....",
    "...kNNNNNNNNnnnNNNnNBbbbbbbbk...",
    "..kNNnnNNNNNNNNnnNNNBBbbbbbbbk..",
    ".knnnnnnnnnnnnnnnnnnBBBBBBBBBBk.",
    "knnnnnnnnnnnnnnnnnnnBBBBBBBBBBBk",
    ".kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk."
   ]
  },
  "dunes_64": {
   "key": "dunes_64",
   "name": "hill_dunes_64",
   "id": "landscape/hill/dunes_64",
   "label": "Champ de dunes (64 × 22)",
   "kind": "sprite",
   "w": 64,
   "h": 22,
   "size": 64,
   "props": {
    "shape": "dune",
    "season": "summer",
    "cover": "sand"
   },
   "tags": [
    "desert",
    "sand"
   ],
   "png": "library/png/landscape/hill/dunes_64.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAWCAMAAABHYGoGAAAAFVBMVEUAAAAaFCP/8KjJmltqQSicazw7Ihn65FscAAAAAXRSTlMAQObYZgAAALpJREFUeNql0tsWhSAIBFBHlP//5BZZBjZ2yjMvXRZsNEvpdWBJqwGQLVhtzzmLpWCxXY6UBcG1G/BZgIjU6oBvAtAaT6K8EtBPDNdsBzwKOA/Mqvzy27X8EFrz+b0RpxtRHgV/XlZaxw1cABP6QLdY4d+ACqCL3R8qAwahjfe1pQvjf8AAhOGhdLaFIEDuKVRQKsAN7jdKBWUCYudxo1TQIOA2f1Ia3o4CKo/68LeqmPcPpRNgF/5K2gDmuAuw0WyAOAAAAABJRU5ErkJggg==",
   "palette": {
    "B": "#3b2219",
    "N": "#c99a5b",
    "Y": "#fff0a8",
    "b": "#6a4128",
    "k": "#1a1423",
    "n": "#9c6b3c"
   },
   "rows": [
    "..........................................kkkkk.................",
    ".......................................kkkYYYYYk................",
    ".....................................kkYYYNNNNNbk...............",
    "...................................kkYYNNNNNNNNbbk..............",
    "..................................kYYNNNNNNNNNNbbbk.............",
    ".................................kNNNnnNNNNNNNNbbbbk............",
    "...............................kkNNNNNNnnNNNNNNbbbbbk...........",
    "....................kkkkkk....knnNNNNNNNNNNNNNNbbbbbbk..........",
    "................kkkkYYYYYbk..kNNNnnNNNNNNnnNNNNbbbbbbbk.........",
    "..............kkYYYYNNNNNbbkkNNNNNNNNNNNNNNnnNNbbbbbbbbk........",
    "............kkYYNNNNNNNNNbbbnnnNNNNNNNNNNNNNNNNbbbbbbbbbk.......",
    "..........kkNNNNNNNnnNNNNbbbbbNnnNNNNNNNNNNNNNNbbbbbbbbbbk......",
    ".........kNNNNNNNNNNNnnNNbbbbbbNNNnnnNNNNNNNNNNbbbbbbbbbbbk.....",
    ".......kkNNNNnnnNNNNNNNNNbbbbbbbNNNNNnnNNNNNNNNbbbbbbbbbbbk.....",
    "......kNNNNNNNNNnnNNNNNNNbbbbbbbbNNNNNNNNNNNNNNbbbbbbbbbbbbk....",
    ".....kNNNNNNNNNNNNNNNNNNNbbbbbbbbbNNNNNNNNNNNNNBbbbbbbbbbbbbk...",
    "....kNNnnNNNNNNNnnNNNNNNNBbbbbbbbbbNNNNNNNNNNNNBBbbbbbbbbbbbbk..",
    "...kNNNNNnnNNNNNNNnnNNNNNBBbbbbbbbbbNNNNNNNNNNNBBBbbbbbbbbbbbk..",
    "..kNNnnNNNNNNNNNNNNNNNNNNBBBbbbbbbbbbNNNNNNNNNNBBBBbbbbbbbbbbbk.",
    ".knnnnnnnnnnnnnnnnnnnnnnnBBBBBBBBBBBBBnnnnnnnnnBBBBBBBBBBBBBBBk.",
    "knnnnnnnnnnnnnnnnnnnnnnnnBBBBBBBBBBBBBBnnnnnnnnBBBBBBBBBBBBBBBBk",
    ".kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk."
   ]
  }
 }
};
export default asset;
