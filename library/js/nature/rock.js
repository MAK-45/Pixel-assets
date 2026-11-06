// GÉNÉRÉ par scripts/build.js — ne pas modifier. Source : assets/nature/rock.px.js
// Rocher — 7 variante(s). Usage :
//   import asset from "./rock.js"; const v = asset.variants["small_16"];
//   v.src (data URL PNG), v.rows + v.palette (pixels, "." = transparent), v.w, v.h
/** @type {import("../../index.d.ts").PixelAsset} */
export const asset = {
 "id": "nature/rock",
 "slug": "rock",
 "category": "nature",
 "title": "Rocher",
 "description": "Pierres et rochers pour décors : petit caillou, tas de galets, gros rocher à facettes, en versions nue, moussue, enneigée et grès du désert.",
 "tags": [
  "rock",
  "stone",
  "boulder",
  "nature",
  "decoration",
  "obstacle"
 ],
 "order": 0,
 "source": "assets/nature/rock.px.js",
 "module": "library/js/nature/rock.js",
 "sheet": {
  "png": "library/sheets/nature/rock.png",
  "json": "library/sheets/nature/rock.json"
 },
 "axes": {
  "form": [
   "stone",
   "pebbles",
   "boulder"
  ],
  "surface": [
   "bare",
   "mossy",
   "snow"
  ],
  "material": [
   "granite",
   "sandstone"
  ]
 },
 "sizes": [
  16,
  32
 ],
 "variantCount": 7,
 "variants": {
  "small_16": {
   "key": "small_16",
   "name": "rock_small_16",
   "id": "nature/rock/small_16",
   "label": "Caillou",
   "kind": "sprite",
   "w": 16,
   "h": 12,
   "size": 16,
   "props": {
    "form": "stone",
    "surface": "bare",
    "material": "granite"
   },
   "tags": [],
   "png": "library/png/nature/rock/small_16.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAMCAMAAABcOc2zAAAAElBMVEUAAAAaFCOLiqNXVnDDwtQvLTyMQaCfAAAAAXRSTlMAQObYZgAAAEJJREFUeNptzkkSgDAIRNEe4P5XtiSQaGnv3i8WAP8jyRcl+SQqIiSb27ov3IXWOJNjL08oVUiC7mWHR1n+hvpyBlxv8gFqrYtXwAAAAABJRU5ErkJggg==",
   "palette": {
    "C": "#c3c2d4",
    "c": "#8b8aa3",
    "d": "#2f2d3c",
    "k": "#1a1423",
    "m": "#575670"
   },
   "rows": [
    "................",
    "......kkkk......",
    "....kkcccmkk....",
    "...kcCCCccmmk...",
    "..kcCccccmmmmk..",
    ".kmcccccmmmmddk.",
    "kmccccmmmmmdddk.",
    "kmccmmmmdmmddddk",
    "kmmmmmmmmdmddddk",
    ".kmmmmmmmmddddk.",
    ".kmmmmmmmmddddk.",
    "..kkkkkkkkkkkk.."
   ]
  },
  "small_mossy_16": {
   "key": "small_mossy_16",
   "name": "rock_small_mossy_16",
   "id": "nature/rock/small_mossy_16",
   "label": "Caillou moussu",
   "kind": "sprite",
   "w": 16,
   "h": 12,
   "size": 16,
   "props": {
    "form": "stone",
    "surface": "mossy",
    "material": "granite"
   },
   "tags": [],
   "png": "library/png/nature/rock/small_mossy_16.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAMCAMAAABcOc2zAAAAFVBMVEUAAAAaFCNarkWLiqNXVnAuejovLTw6USOCAAAAAXRSTlMAQObYZgAAAENJREFUeNptzkEOACEIQ1FKK/c/8kSEqBm7e39Vs/cA4KI7tRPoYzglHCalKhDnpiPQ1nKHVIaAQbWocJTlf8iXPbMPjXoByOQmekIAAAAASUVORK5CYII=",
   "palette": {
    "c": "#8b8aa3",
    "d": "#2f2d3c",
    "g": "#2e7a3a",
    "k": "#1a1423",
    "l": "#5aae45",
    "m": "#575670"
   },
   "rows": [
    "................",
    "......kkkk......",
    "....kkllcmkk....",
    "...kclgglcmmk...",
    "..kclggccmmmmk..",
    ".kmcccccmmmmddk.",
    "kmccccmmmmmdddk.",
    "kmccmmmmdmmddddk",
    "kmmmmmmmmdmddddk",
    ".kmmmmmmmmddddk.",
    ".kmmmmmmmmddddk.",
    "..kkkkkkkkkkkk.."
   ]
  },
  "pebbles_16": {
   "key": "pebbles_16",
   "name": "rock_pebbles_16",
   "id": "nature/rock/pebbles_16",
   "label": "Tas de galets",
   "kind": "sprite",
   "w": 16,
   "h": 11,
   "size": 16,
   "props": {
    "form": "pebbles",
    "surface": "bare",
    "material": "granite"
   },
   "tags": [],
   "png": "library/png/nature/rock/pebbles_16.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAMAAABBPP0LAAAAElBMVEUAAAAaFCOLiqPDwtRXVnAvLTxjbqUMAAAAAXRSTlMAQObYZgAAAElJREFUeNpNjsENADEIw0hw91/5BLS95oHASFYi/kjSu8qZOUTYlrPmvgFekMCyN5DqX4CWjqCh0RVoATmgBQ0Y0AJNTqnbMOIDbE4BSs0aIrMAAAAASUVORK5CYII=",
   "palette": {
    "C": "#c3c2d4",
    "c": "#8b8aa3",
    "d": "#2f2d3c",
    "k": "#1a1423",
    "m": "#575670"
   },
   "rows": [
    "...........kkkk.",
    ".....kkkk.kcCCCk",
    "....kmccckcCccck",
    "...kmcmmmmcCccck",
    "...kmCmmmdccccck",
    "..kkmmmmmdccmkk.",
    ".kmccckkmmmmcmk.",
    "kmcmmmmkdmmmCmk.",
    "kmCmmmdkdmmmmmk.",
    "kmmmmmdkkkkkkk..",
    ".kkkkkk........."
   ]
  },
  "boulder_32": {
   "key": "boulder_32",
   "name": "rock_boulder_32",
   "id": "nature/rock/boulder_32",
   "label": "Gros rocher",
   "kind": "sprite",
   "w": 32,
   "h": 25,
   "size": 32,
   "props": {
    "form": "boulder",
    "surface": "bare",
    "material": "granite"
   },
   "tags": [],
   "png": "library/png/nature/rock/boulder_32.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAZCAMAAABn0dyjAAAAElBMVEUAAAAaFCOLiqPDwtRXVnAvLTxjbqUMAAAAAXRSTlMAQObYZgAAAH1JREFUeNqV00ESwCAIA0AD8f9f7oxaTZF2LNcs4aKl/B0AnyHM7IW00N29kd301OYgyVdK8yBguk3GDjzWuYEt7wRyf6WVc+oQoO4uUCfQVS0YAtTVFGiiFzLwLGgAPAPpBRWVQUTAUzBvLZBXSB4rdlBwF8aBPtZsjr7BBYi3B1XOub3sAAAAAElFTkSuQmCC",
   "palette": {
    "C": "#c3c2d4",
    "c": "#8b8aa3",
    "d": "#2f2d3c",
    "k": "#1a1423",
    "m": "#575670"
   },
   "rows": [
    "................................",
    "................kkk.............",
    "............kkkkccckk...........",
    ".........kkkccCCCCccckkk........",
    "........kccCCCcccccccccck.......",
    ".......kccCccccccccccmcCck......",
    "......kcCCccccccccccmmcccck.....",
    ".....kcCccccccccccmmmmcccck.....",
    "....kcCccccccccccmmmmmmmccck....",
    "...kccccccccccmmdmmmmmmmmmmdk...",
    "..kmcccccccmmmmmdmmmmmmmmmddk...",
    "..kccccmmdmmmmmdmmmmmmmmmmdddk..",
    ".kmcmmmmmdmmmmmdmmmmmmmmmmdddk..",
    ".kmmmmmmdmmmmmmdmmmmmmmmmddddk..",
    ".kmmmmmmdmmmmmdmmmmmmmmmmddddk..",
    "kmmmmmmmdmmmmmdmmmmmmmmmmddddk..",
    "kmmmmmmdmmmmmmdmmmmmmmmmddddddk.",
    ".kmmmmmdmmmmmmmdmmmmmmmmddddddk.",
    ".kmmmmmmmmmmmmmdmmmmmmmmddddddk.",
    ".kmmmmmmmmmmmmmmdmmmmmmdddddddk.",
    "..kmmmmmmmmmmmmmdmmmmmmddddddk..",
    "..kmmmmmmmmmmmmmmmmmmmmddddddk..",
    "...kmdddddddddddddddddddddddk...",
    "....kkkkkkkkkkkkkkkkkkkkkkkk....",
    "................................"
   ]
  },
  "boulder_mossy_32": {
   "key": "boulder_mossy_32",
   "name": "rock_boulder_mossy_32",
   "id": "nature/rock/boulder_mossy_32",
   "label": "Gros rocher moussu",
   "kind": "sprite",
   "w": 32,
   "h": 25,
   "size": 32,
   "props": {
    "form": "boulder",
    "surface": "mossy",
    "material": "granite"
   },
   "tags": [],
   "png": "library/png/nature/rock/boulder_mossy_32.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAZCAMAAABn0dyjAAAAGFBMVEUAAAAaFCOLiqPDwtRarkUuejpXVnAvLTwWIRRnAAAAAXRSTlMAQObYZgAAAKRJREFUeNqV00sWhSAMA1BS0rD/HXuoilXwfTrikNt2AqX8WwA+hjCzFxJhZa1BZgNjrSTNjDQ65pxm7j12l9HwzD26A0n0uwBr79yFJPVjAnC3I2bkkiwJ9PsoSk2j2iEg29fvt1c+gNNHax5wCCi3rkD0n0neMCbwbUAAKE9YgpzcN2RxJu0N6AsgH6JdIIT7EqCUaYdmUHAOfBbyY13VT99gA66CCoYiRy+EAAAAAElFTkSuQmCC",
   "palette": {
    "C": "#c3c2d4",
    "c": "#8b8aa3",
    "d": "#2f2d3c",
    "g": "#2e7a3a",
    "k": "#1a1423",
    "l": "#5aae45",
    "m": "#575670"
   },
   "rows": [
    "................................",
    "................kkk.............",
    "............kkkkccckk...........",
    ".........kkkccClCCccckkk........",
    "........kclCClllcccllclgk.......",
    ".......kcllccggccllggmclck......",
    "......kclgllcccccggcmmlglck.....",
    ".....klCcllglcccccmmmmglcck.....",
    "....kggclglcccclcmmmmmmmccck....",
    "...kcclcccccclmmdmmmmmmmmmmdk...",
    "..kmcllccccmmmmmdmmmmmmmmmddk...",
    "..kglglmmdmmmmmdmmmmmmmmmmdddk..",
    ".kmcmmmmmdmmmmmdmmmmmmmmmmdddk..",
    ".klglmmmdmmmmmmdmmmmmmmmmddddk..",
    ".kmlmmmmdmmmmmdmmmmmmmmmmddddk..",
    "kmlglmmmdmmmmmdmmmmmmmmmmddddk..",
    "kmmmmmmdmmmmmmdmmmmmmmmmddddddk.",
    ".kmmmmmdmmmmmmmdmmmmmmmmddddddk.",
    ".kmmmmmmmmmmmmmdmmmmmmmmddddddk.",
    ".kmmmmllmmmmmmmmdmmmmmmdddddddk.",
    "..kmmmggmmmmmmmmdmmmmmmddddddk..",
    "..kmmmmmmmmmmmmmmmmmmmmddddddk..",
    "...kmdddddddddddddddddddddddk...",
    "....kkkkkkkkkkkkkkkkkkkkkkkk....",
    "................................"
   ]
  },
  "boulder_snow_32": {
   "key": "boulder_snow_32",
   "name": "rock_boulder_snow_32",
   "id": "nature/rock/boulder_snow_32",
   "label": "Gros rocher enneigé",
   "kind": "sprite",
   "w": 32,
   "h": 25,
   "size": 32,
   "props": {
    "form": "boulder",
    "surface": "snow",
    "material": "granite"
   },
   "tags": [
    "snow",
    "winter"
   ],
   "png": "library/png/nature/rock/boulder_snow_32.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAZCAMAAABn0dyjAAAAFVBMVEUAAAAaFCPT4PL7+/9XVnAvLTyLiqPRqwyjAAAAAXRSTlMAQObYZgAAAH5JREFUeNqVkzkSwCAMA5Ft8v8nZ4ZTgCFE7a7kBkL4GwBHCBHZKAmqqiZldTKVFji8UxOdDAi3zeYNDHVbhIVnBXS/02gtsRhQ7nYhNoGrPFAM6EPIE4wJX/CEcSAJ0C/hcIGNSuJOsFuh3eqCP0F8nliFgDo4B/xYvVx9gxeKfgdWGK+giQAAAABJRU5ErkJggg==",
   "palette": {
    "c": "#8b8aa3",
    "d": "#2f2d3c",
    "k": "#1a1423",
    "m": "#575670",
    "s": "#d3e0f2",
    "w": "#fbfbff"
   },
   "rows": [
    "................................",
    "................kkk.............",
    "............kkkkssskk...........",
    ".........kkksswwwwssskkk........",
    "........ksswwwssssssssssk.......",
    ".......ksswssssssssssmswsk......",
    "......kswwssssssssssmmssssk.....",
    ".....kswssssssssssmmmmssssk.....",
    "....kswssssssssssmmmmmmmsssk....",
    "...kssssssssssmmdmmmmmmmmmmdk...",
    "..kwsssssssmmmmmdmmmmmmmmmddk...",
    "..kssssmmdmmmmmdmmmmmmmmmmdddk..",
    ".kwcmmmmmdmmmmmdmmmmmmmmmmdddk..",
    ".kmmmmmmdmmmmmmdmmmmmmmmmddddk..",
    ".kmmmmmmdmmmmmdmmmmmmmmmmddddk..",
    "kwmmmmmmdmmmmmdmmmmmmmmmmddddk..",
    "kmmmmmmdmmmmmmdmmmmmmmmmddddddk.",
    ".kmmmmmdmmmmmmmdmmmmmmmmddddddk.",
    ".kmmmmmmmmmmmmmdmmmmmmmmddddddk.",
    ".kmmmmmmmmmmmmmmdmmmmmmdddddddk.",
    "..kmmmmmmmmmmmmmdmmmmmmddddddk..",
    "..kmmmmmmmmmmmmmmmmmmmmddddddk..",
    "...kmdddddddddddddddddddddddk...",
    "....kkkkkkkkkkkkkkkkkkkkkkkk....",
    "................................"
   ]
  },
  "boulder_sand_32": {
   "key": "boulder_sand_32",
   "name": "rock_boulder_sand_32",
   "id": "nature/rock/boulder_sand_32",
   "label": "Rocher de grès (désert)",
   "kind": "sprite",
   "w": 32,
   "h": 25,
   "size": 32,
   "props": {
    "form": "boulder",
    "surface": "bare",
    "material": "sandstone"
   },
   "tags": [
    "desert"
   ],
   "png": "library/png/nature/rock/boulder_sand_32.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAZCAMAAABn0dyjAAAAElBMVEUAAAAaFCOcazzJmltqQSg7IhkTaE0CAAAAAXRSTlMAQObYZgAAAH1JREFUeNqV00ESwCAIA0AD8f9f7oxaTZF2LNcs4aKl/B0AnyHM7IW00N29kd301OYgyVdK8yBguk3GDjzWuYEt7wRyf6WVc+oQoO4uUCfQVS0YAtTVFGiiFzLwLGgAPAPpBRWVQUTAUzBvLZBXSB4rdlBwF8aBPtZsjr7BBYi3B1XOub3sAAAAAElFTkSuQmCC",
   "palette": {
    "B": "#3b2219",
    "N": "#c99a5b",
    "b": "#6a4128",
    "k": "#1a1423",
    "n": "#9c6b3c"
   },
   "rows": [
    "................................",
    "................kkk.............",
    "............kkkknnnkk...........",
    ".........kkknnNNNNnnnkkk........",
    "........knnNNNnnnnnnnnnnk.......",
    ".......knnNnnnnnnnnnnbnNnk......",
    "......knNNnnnnnnnnnnbbnnnnk.....",
    ".....knNnnnnnnnnnnbbbbnnnnk.....",
    "....knNnnnnnnnnnnbbbbbbbnnnk....",
    "...knnnnnnnnnnbbBbbbbbbbbbbBk...",
    "..kbnnnnnnnbbbbbBbbbbbbbbbBBk...",
    "..knnnnbbBbbbbbBbbbbbbbbbbBBBk..",
    ".kbnbbbbbBbbbbbBbbbbbbbbbbBBBk..",
    ".kbbbbbbBbbbbbbBbbbbbbbbbBBBBk..",
    ".kbbbbbbBbbbbbBbbbbbbbbbbBBBBk..",
    "kbbbbbbbBbbbbbBbbbbbbbbbbBBBBk..",
    "kbbbbbbBbbbbbbBbbbbbbbbbBBBBBBk.",
    ".kbbbbbBbbbbbbbBbbbbbbbbBBBBBBk.",
    ".kbbbbbbbbbbbbbBbbbbbbbbBBBBBBk.",
    ".kbbbbbbbbbbbbbbBbbbbbbBBBBBBBk.",
    "..kbbbbbbbbbbbbbBbbbbbbBBBBBBk..",
    "..kbbbbbbbbbbbbbbbbbbbbBBBBBBk..",
    "...kbBBBBBBBBBBBBBBBBBBBBBBBk...",
    "....kkkkkkkkkkkkkkkkkkkkkkkk....",
    "................................"
   ]
  }
 }
};
export default asset;
