// GÉNÉRÉ par scripts/build.js — ne pas modifier. Source : assets/mobilier/bench.px.js
// Banc public — 8 variante(s). Usage :
//   import asset from "./bench.js"; const v = asset.variants["wood_16"];
//   v.src (data URL PNG), v.rows + v.palette (pixels, "." = transparent), v.w, v.h
/** @type {import("../../index.d.ts").PixelAsset} */
export const asset = {
 "id": "mobilier/bench",
 "slug": "bench",
 "category": "mobilier",
 "title": "Banc public",
 "description": "Bancs publics posés au sol, vus de face pour décors 2D : banc de lattes en bois sans dossier (16 et 32 px), banc à dossier (32 et 48 px), banc vert en fonte peinte, banc de pierre massif, banc d'automne avec feuilles mortes et banc enneigé. Lumière en haut à gauche, contour sombre, assise au tiers haut du sprite.",
 "tags": [
  "bench",
  "park",
  "street",
  "furniture",
  "seat",
  "urban",
  "decoration"
 ],
 "order": 0,
 "source": "assets/mobilier/bench.px.js",
 "module": "library/js/mobilier/bench.js",
 "sheet": {
  "png": "library/sheets/mobilier/bench.png",
  "json": "library/sheets/mobilier/bench.json"
 },
 "axes": {
  "material": [
   "wood",
   "green_iron",
   "stone"
  ],
  "backrest": [
   "no",
   "yes"
  ],
  "season": [
   "summer",
   "autumn",
   "winter"
  ]
 },
 "sizes": [
  16,
  32,
  48
 ],
 "variantCount": 8,
 "variants": {
  "wood_16": {
   "key": "wood_16",
   "name": "bench_wood_16",
   "id": "mobilier/bench/wood_16",
   "label": "Petit banc en bois, sans dossier (16 px)",
   "kind": "sprite",
   "w": 16,
   "h": 10,
   "size": 16,
   "props": {
    "material": "wood",
    "backrest": "no",
    "season": "summer"
   },
   "tags": [
    "wood"
   ],
   "png": "library/png/mobilier/bench/wood_16.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAKCAMAAACKYC6uAAAAGFBMVEUAAAAaFCPJmlucazxqQSg7IhlXVnAvLTyaVxZDAAAAAXRSTlMAQObYZgAAADVJREFUeNpjYCAHMCIBMJ8JAphBACTCyAIBrCAAUcLGDlHPxs7IABNAodnZ2UEsGA2xBUEDADSVAOc/hnAMAAAAAElFTkSuQmCC",
   "palette": {
    "B": "#3b2219",
    "N": "#c99a5b",
    "b": "#6a4128",
    "d": "#2f2d3c",
    "k": "#1a1423",
    "m": "#575670",
    "n": "#9c6b3c"
   },
   "rows": [
    "................",
    "................",
    "................",
    "..kkkkkkkkkkkk..",
    ".kNNNNNNNnnnnnk.",
    ".kbbbbbbbBBBBBk.",
    "..kmdkkkkkkmdk..",
    "..kmdk....kmdk..",
    ".kddddk..kddddk.",
    "..kkkk....kkkk.."
   ]
  },
  "wood_32": {
   "key": "wood_32",
   "name": "bench_wood_32",
   "id": "mobilier/bench/wood_32",
   "label": "Banc en bois, sans dossier (32 px)",
   "kind": "sprite",
   "w": 32,
   "h": 20,
   "size": 32,
   "props": {
    "material": "wood",
    "backrest": "no",
    "season": "summer"
   },
   "tags": [
    "wood"
   ],
   "png": "library/png/mobilier/bench/wood_32.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAUCAMAAADbT899AAAAGFBMVEUAAAAaFCPJmlucazxqQSg7IhlXVnAvLTyaVxZDAAAAAXRSTlMAQObYZgAAAExJREFUeNrtj0EOwCAIBNlK2f//uIFg2qLx7MG5SNZJWEQOCRbE/zWnOW4gJm31UScEnXM7yA7GcX1kvaYRQ/VvtoEAktX4Z3gPkpo9CcQCPXioLQsAAAAASUVORK5CYII=",
   "palette": {
    "B": "#3b2219",
    "N": "#c99a5b",
    "b": "#6a4128",
    "d": "#2f2d3c",
    "k": "#1a1423",
    "m": "#575670",
    "n": "#9c6b3c"
   },
   "rows": [
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "..kkkkkkkkkkkkkkkkkkkkkkkkkkkk..",
    ".kNNNNNNNNNNNNNNNNNNNNNNNnnnnnk.",
    ".knnnnnbnnnnnnbnnnnnnbnnnbbbbbk.",
    ".kbbbbbbbbbbbbbbbbbbbbbbbBBBBBk.",
    "..kkkmdkkkkkkkkkkkkkkkkkkmdkkk..",
    "....kmdk................kmdk....",
    "....kmdk................kmdk....",
    "....kmdk................kmdk....",
    "....kmdk................kmdk....",
    "....kmdk................kmdk....",
    "...kddddk..............kddddk...",
    "....kkkk................kkkk...."
   ]
  },
  "wood_back_32": {
   "key": "wood_back_32",
   "name": "bench_wood_back_32",
   "id": "mobilier/bench/wood_back_32",
   "label": "Banc en bois à dossier (32 px)",
   "kind": "sprite",
   "w": 32,
   "h": 20,
   "size": 32,
   "props": {
    "material": "wood",
    "backrest": "yes",
    "season": "summer"
   },
   "tags": [
    "wood",
    "backrest"
   ],
   "png": "library/png/mobilier/bench/wood_back_32.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAUCAMAAADbT899AAAAGFBMVEUAAAAaFCPJmlucazxqQSg7IhlXVnAvLTyaVxZDAAAAAXRSTlMAQObYZgAAAEtJREFUeNpjYCAMGPEAsDwTdsAMAiAVjCzYASsIQIxgY8duPhv74LECzGJhRqfA9lDHDQxwBnoUDCUFjOzs7NhUIMRhKQdbSmNgAADt3QQrz5a/2wAAAABJRU5ErkJggg==",
   "palette": {
    "B": "#3b2219",
    "N": "#c99a5b",
    "b": "#6a4128",
    "d": "#2f2d3c",
    "k": "#1a1423",
    "m": "#575670",
    "n": "#9c6b3c"
   },
   "rows": [
    "................................",
    "..kkkkkkkkkkkkkkkkkkkkkkkkkkkk..",
    ".kNNNNNNNNNNNNNNNNNNNNNNNnnnnnk.",
    ".kbbbbbbbbbbbbbbbbbbbbbbbBBBBBk.",
    "..kmdkkkkkkkkkkkkkkkkkkkkkkmdk..",
    ".kNNNNNNNNNNNNNNNNNNNNNNNnnnnnk.",
    ".kbbbbbbbbbbbbbbbbbbbbbbbBBBBBk.",
    "..kmdkkkkkkkkkkkkkkkkkkkkkkmdk..",
    ".kNNNNNNNNNNNNNNNNNNNNNNNnnnnnk.",
    ".knnnnnbnnnnnnbnnnnnnbnnnbbbbbk.",
    ".kbbbbbbbbbbbbbbbbbbbbbbbBBBBBk.",
    "..kmdkkkkkkkkkkkkkkkkkkkkkkmdk..",
    "..kmdk....................kmdk..",
    "..kmdk....................kmdk..",
    "..kmdk....................kmdk..",
    "..kmdk....................kmdk..",
    "..kmdk....................kmdk..",
    "..kmdk....................kmdk..",
    ".kddddk..................kddddk.",
    "..kkkk....................kkkk.."
   ]
  },
  "wood_back_48": {
   "key": "wood_back_48",
   "name": "bench_wood_back_48",
   "id": "mobilier/bench/wood_back_48",
   "label": "Grand banc en bois à dossier (48 px)",
   "kind": "sprite",
   "w": 48,
   "h": 28,
   "size": 48,
   "props": {
    "material": "wood",
    "backrest": "yes",
    "season": "summer"
   },
   "tags": [
    "wood",
    "backrest"
   ],
   "png": "library/png/mobilier/bench/wood_back_48.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAcCAMAAAAQssz4AAAAGFBMVEUAAAAaFCNXVnAvLTzJmlucazxqQSg7IhmwdgNWAAAAAXRSTlMAQObYZgAAAFpJREFUeNrllLEOwCAIRDlR+/9/3BxD6cbVqdG3yHAvEUgwWwD4lkNzSDQPA11jEBqYGhfBypfsKaqe38KRTf9sSlHNUT0xqhRqUthlD6cJcHfFyBx3oh0+5m7USgj+UOeq6wAAAABJRU5ErkJggg==",
   "palette": {
    "B": "#3b2219",
    "N": "#c99a5b",
    "b": "#6a4128",
    "d": "#2f2d3c",
    "k": "#1a1423",
    "m": "#575670",
    "n": "#9c6b3c"
   },
   "rows": [
    "................................................",
    "...kk......................................kk...",
    "..kmdkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkmdk..",
    ".kNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNnnnnnk.",
    ".kbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbBBBBBk.",
    "..kmdkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkmdk..",
    "..kmdk....................................kmdk..",
    "..kmdkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkmdk..",
    ".kNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNnnnnnk.",
    ".kbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbBBBBBk.",
    "..kmdkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkmdk..",
    "..kmdk....................................kmdk..",
    "..kmdk....................................kmdk..",
    "..kmdkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkmdk..",
    ".kNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNnnnnnk.",
    ".knnnnnbnnnnnnbnnnnnnbnnnnnnbnnnnnnbnnnnnbbbbbk.",
    ".knnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnbbbbbk.",
    ".kbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbBBBBBk.",
    "..kmdkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkmdk..",
    "..kmdk....................................kmdk..",
    "..kmdk....................................kmdk..",
    "..kmdk....................................kmdk..",
    "..kmdk....................................kmdk..",
    "..kmdk....................................kmdk..",
    "..kmdk....................................kmdk..",
    "..kmdk....................................kmdk..",
    ".kddddk..................................kddddk.",
    "..kkkk....................................kkkk.."
   ]
  },
  "green_32": {
   "key": "green_32",
   "name": "bench_green_32",
   "id": "mobilier/bench/green_32",
   "label": "Banc vert en fonte (32 px)",
   "kind": "sprite",
   "w": 32,
   "h": 20,
   "size": 32,
   "props": {
    "material": "green_iron",
    "backrest": "yes",
    "season": "summer"
   },
   "tags": [
    "iron",
    "green",
    "park"
   ],
   "png": "library/png/mobilier/bench/green_32.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAUCAMAAADbT899AAAAElBMVEUAAAAaFCOl11parkUuejofSiyqBYhCAAAAAXRSTlMAQObYZgAAAEpJREFUeNpjYCAMGPEAsDwTdsAMAiAVjCzYASsIQIxgYcVuPgvr4LECzGJhRqfA9lDHDQxwBnoUDCUFjHD/oskjwgGacrClNAYGAKYxA9M0MYckAAAAAElFTkSuQmCC",
   "palette": {
    "G": "#1f4a2c",
    "L": "#a5d75a",
    "g": "#2e7a3a",
    "k": "#1a1423",
    "l": "#5aae45"
   },
   "rows": [
    "................................",
    "..kkkkkkkkkkkkkkkkkkkkkkkkkkkk..",
    ".kLLLLLLLLLLLLLLLLLLLLLLLlllllk.",
    ".kgggggggggggggggggggggggGGGGGk.",
    "..kgGkkkkkkkkkkkkkkkkkkkkkkgGk..",
    ".kLLLLLLLLLLLLLLLLLLLLLLLlllllk.",
    ".kgggggggggggggggggggggggGGGGGk.",
    "..kgGkkkkkkkkkkkkkkkkkkkkkkgGk..",
    ".kLLLLLLLLLLLLLLLLLLLLLLLlllllk.",
    ".klllllgllllllgllllllglllgggggk.",
    ".kgggggggggggggggggggggggGGGGGk.",
    "..kgGkkkkkkkkkkkkkkkkkkkkkkgGk..",
    "..kgGk....................kgGk..",
    "..kgGk....................kgGk..",
    "..kgGk....................kgGk..",
    "..kgGk....................kgGk..",
    "..kgGk....................kgGk..",
    "..kgGk....................kgGk..",
    ".kGGGGk..................kGGGGk.",
    "..kkkk....................kkkk.."
   ]
  },
  "stone_32": {
   "key": "stone_32",
   "name": "bench_stone_32",
   "id": "mobilier/bench/stone_32",
   "label": "Banc de pierre massif (32 px)",
   "kind": "sprite",
   "w": 32,
   "h": 20,
   "size": 32,
   "props": {
    "material": "stone",
    "backrest": "no",
    "season": "summer"
   },
   "tags": [
    "stone"
   ],
   "png": "library/png/mobilier/bench/stone_32.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAUCAMAAADbT899AAAAElBMVEUAAAAaFCPDwtSLiqNXVnAvLTyb4pSrAAAAAXRSTlMAQObYZgAAAExJREFUeNrlkksOABAQQ1vD/a/sU0JkIpYSb4W8RTsDeAEeARh8TBA0nyhuhOiTBFtI6Ws2CS1k7dGFpVkXxvULgWlOzX+Zq92/QDlniqwEDMAsVMYAAAAASUVORK5CYII=",
   "palette": {
    "C": "#c3c2d4",
    "c": "#8b8aa3",
    "d": "#2f2d3c",
    "k": "#1a1423",
    "m": "#575670"
   },
   "rows": [
    "................................",
    "................................",
    "................................",
    "................................",
    ".kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk.",
    "kCCCCCCCCCCCCCCCCCCCCCCCccccccck",
    "kcccccccccccccccccccccccmmmmmmmk",
    "kcccccccccccccccccccccccmmmmmmmk",
    "kmmmmmmmmmmmmmmmmmmmmmmmdddddddk",
    ".kkkcmmmmmkkkkkkkkkkkkmmddddkkk.",
    "...kcmmmmmk..........kmmddddk...",
    "...kcmmmmmk..........kmmddddk...",
    "...kcmmmmmk..........kmmddddk...",
    "...kcmmmmmk..........kmmddddk...",
    "...kcmmmmmk..........kmmddddk...",
    "...kcmmmmmk..........kmmddddk...",
    "...kcmmmmmk..........kmmddddk...",
    "...kcmmmmmk..........kmmddddk...",
    "..kddddddddk........kddddddddk..",
    "...kkkkkkkk..........kkkkkkkk..."
   ]
  },
  "autumn_32": {
   "key": "autumn_32",
   "name": "bench_autumn_32",
   "id": "mobilier/bench/autumn_32",
   "label": "Banc d'automne, feuilles mortes (32 px)",
   "kind": "sprite",
   "w": 32,
   "h": 20,
   "size": 32,
   "props": {
    "material": "wood",
    "backrest": "yes",
    "season": "autumn"
   },
   "tags": [
    "autumn",
    "leaves"
   ],
   "png": "library/png/mobilier/bench/autumn_32.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAUCAMAAADbT899AAAAG1BMVEUAAAAaFCPgeCqyOixuHyRXVnAvLTz/8Kjzw0ocyN7gAAAAAXRSTlMAQObYZgAAAFtJREFUeNrVklEKwDAIQ9VY9f4nHrashSLdx2Cw92OowQiV6Bk+0PtSgyQdrAfGiGb1/GafR7iEx5Ah4iuiKwUQgEYWVwFmxPsdaIr9C/5kYDOrHOv9vpzq0ogu+oIEI2XIc9YAAAAASUVORK5CYII=",
   "palette": {
    "R": "#6e1f24",
    "Y": "#fff0a8",
    "d": "#2f2d3c",
    "k": "#1a1423",
    "m": "#575670",
    "o": "#e0782a",
    "r": "#b23a2c",
    "y": "#f3c34a"
   },
   "rows": [
    "................................",
    "..kkkkkkkkkkkkkkkkkkkkkkkkkkkk..",
    ".kooooooooooooooooooooooorrrrrk.",
    ".kRRRRRRRRRRRRRRRRRRRRRRRRRRRRk.",
    "..kmdkkkkkkkkkkkkkkkkkkkkkkmdk..",
    ".kooooooooooooooooooooooorrrrrk.",
    ".kRRRRRRRRRRRRRRRRRRRRRRRRRRRRk.",
    "..kmdkkkkkkkkkkkkkkkkkkkkkkmdk..",
    ".kooooooooYoyYyooooooyooYrrrrrk.",
    ".krrrrrRrrryrrRyrryrYRorrRRRRRk.",
    ".kRRRRRRRRRRRRRRRRRRRRRRRRRRRRk.",
    "..kmdkkkkkkkkkkkkkkkkkkkkkkmdk..",
    "..kmdk....................kmdk..",
    "..kmdk....................kmdk..",
    "..kmdk....................kmdk..",
    "..kmdk....................kmdk..",
    "..kmdk....................kmdk..",
    "..kmdk....................kmdk..",
    ".kddddk..................kddddk.",
    "..kkkk....................kkkk.."
   ]
  },
  "snow_32": {
   "key": "snow_32",
   "name": "bench_snow_32",
   "id": "mobilier/bench/snow_32",
   "label": "Banc enneigé (32 px)",
   "kind": "sprite",
   "w": 32,
   "h": 20,
   "size": 32,
   "props": {
    "material": "wood",
    "backrest": "yes",
    "season": "winter"
   },
   "tags": [
    "snow",
    "winter"
   ],
   "png": "library/png/mobilier/bench/snow_32.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAUCAMAAADbT899AAAAHlBMVEUAAAAaFCP7+//JmlucazxqQSg7IhlXVnAvLTzT4PImAXaRAAAAAXRSTlMAQObYZgAAAFhJREFUeNrVkkEKwCAMBHdbren/PyyJ0oJsc/LSuShxYAgIMAXgkeLGqSkOAbBqLscFsJnuNxvvGxLpDpG4P5iJiNWyHtHZsyaey8KvBJqZMt75+FnCiHkH0P4F6LM3lD0AAAAASUVORK5CYII=",
   "palette": {
    "B": "#3b2219",
    "N": "#c99a5b",
    "b": "#6a4128",
    "d": "#2f2d3c",
    "k": "#1a1423",
    "m": "#575670",
    "n": "#9c6b3c",
    "s": "#d3e0f2",
    "w": "#fbfbff"
   },
   "rows": [
    ".kkkkkkkkkkkkkkkkkkkkkkkkkkkkkk.",
    "kwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwk",
    ".kNNNNNNNNNNNNNNNNNNNNNNNnnnnnk.",
    ".kbbbbbbbbbbbbbbbbbbbbbbbBBBBBk.",
    "..kmdkkkkkkkkkkkkkkkkkkkkkkmdk..",
    ".kNNNNNNNNNNNNNNNNNNNNNNNnnnnnk.",
    ".kbbbbbbbbbbbbbbbbbbbbbbbBBBBBk.",
    "..kwwwwwwwwwwwwwwwwwwwwwwwwwwk..",
    ".kNNssssssssssssssssssssssssnnk.",
    ".knnnnnbnnnnnnbnnnnnnbnnnbbbbbk.",
    ".kbbbbbbbbbbbbbbbbbbbbbbbBBBBBk.",
    "..kmdkkkkkkkkkkkkkkkkkkkkkkmdk..",
    "..kmdk....................kmdk..",
    "..kmdk....................kmdk..",
    "..kmdk....................kmdk..",
    "..kmdk....................kmdk..",
    "..kmdk....................kmdk..",
    "..kmdk....................kmdk..",
    ".kddddk..................kddddk.",
    "..kkkk....................kkkk.."
   ]
  }
 }
};
export default asset;
