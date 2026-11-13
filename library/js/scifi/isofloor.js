// GÉNÉRÉ par scripts/build.js — ne pas modifier. Source : assets/scifi/isofloor.px.js
// Dalle de sol isométrique — 12 variante(s). Usage :
//   import asset from "./isofloor.js"; const v = asset.variants["plate"];
//   v.src (data URL PNG), v.rows + v.palette (pixels, "." = transparent), v.w, v.h
/** @type {import("../../index.d.ts").PixelAsset} */
export const asset = {
 "id": "scifi/isofloor",
 "slug": "isofloor",
 "category": "scifi",
 "title": "Dalle de sol isométrique",
 "description": "Dalles de sol de station spatiale en vue isométrique 2:1 (32 × 15 px, sans contour : elles se raccordent bord à bord avec un pas de ±16, +8 px). Plaques de métal sombre, claire et bleue, grille, bande de danger, trappe, circuit imprimé lumineux et rail de lumière turquoise dans les deux sens, avec son croisement (fixe ou animé : une impulsion à décaler de dalle en dalle pour faire courir la lumière).",
 "tags": [
  "isometric",
  "floor",
  "tile",
  "scifi",
  "space-station",
  "metal",
  "tileset",
  "spaceship"
 ],
 "order": 0,
 "source": "assets/scifi/isofloor.px.js",
 "module": "library/js/scifi/isofloor.js",
 "sheet": {
  "png": "library/sheets/scifi/isofloor.png",
  "json": "library/sheets/scifi/isofloor.json"
 },
 "axes": {
  "shape": [
   "plate",
   "grate",
   "hazard",
   "hatch",
   "circuit",
   "light"
  ],
  "color": [
   "dark",
   "light",
   "blue",
   "yellow",
   "cyan"
  ],
  "state": [
   "on",
   "pulse"
  ]
 },
 "sizes": [
  32
 ],
 "variantCount": 12,
 "variants": {
  "plate": {
   "key": "plate",
   "name": "isofloor_plate",
   "id": "scifi/isofloor/plate",
   "label": "Plaque de métal sombre",
   "kind": "sprite",
   "w": 32,
   "h": 15,
   "size": 32,
   "props": {
    "shape": "plate",
    "color": "dark"
   },
   "tags": [],
   "png": "library/png/scifi/isofloor/plate.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAPCAMAAACyXj0lAAAADFBMVEUAAABXVnBBP1IvLTzm3idBAAAAAXRSTlMAQObYZgAAAEpJREFUeNqFztESABAIRNHo///ZiJB22ddzm0kkrJRaha9z34tVWeLXvg9fCeIjYTwT+0oRGqgncMZCk8U4CZyTxDGBvBPKI7m5AfGDAhcRI1BCAAAAAElFTkSuQmCC",
   "palette": {
    "<": "#413f52",
    "d": "#2f2d3c",
    "m": "#575670"
   },
   "rows": [
    "..............mm<<..............",
    "............mm<<<<<<............",
    "..........mm<<<dd<<<<<..........",
    "........mm<<<<<<<<<<<<<<........",
    "......mm<<<<<<<<<<<<<<<<<<......",
    "....mm<<<<<<<<<<<<<<<<<<<<<<....",
    "..mm<<<<<<<<<<<<<<<<<<<<<<<<<<..",
    "dd<<<d<<<<<<<<<<<<<<<<<<<<d<<<dd",
    "..dd<<<<<<<<<<<<<<<<<<<<<<<<dd..",
    "....dd<<<<<<<<<<<<<<<<<<<<dd....",
    "......dd<<<<<<<<<<<<<<<<dd......",
    "........dd<<<<<<<<<<<<dd........",
    "..........dd<<<<<<<<dd..........",
    "............dd<<<<dd............",
    "..............dddd.............."
   ]
  },
  "plate_light": {
   "key": "plate_light",
   "name": "isofloor_plate_light",
   "id": "scifi/isofloor/plate_light",
   "label": "Plaque de métal claire",
   "kind": "sprite",
   "w": 32,
   "h": 15,
   "size": 32,
   "props": {
    "shape": "plate",
    "color": "light"
   },
   "tags": [],
   "png": "library/png/scifi/isofloor/plate_light.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAPCAMAAACyXj0lAAAADFBMVEUAAABxcIpXVnBBP1IzA5uHAAAAAXRSTlMAQObYZgAAAEpJREFUeNqFztESABAIRNHo///ZiJB22ddzm0kkrJRaha9z34tVWeLXvg9fCeIjYTwT+0oRGqgncMZCk8U4CZyTxDGBvBPKI7m5AfGDAhcRI1BCAAAAAElFTkSuQmCC",
   "palette": {
    "<": "#413f52",
    ">": "#71708a",
    "m": "#575670"
   },
   "rows": [
    "..............>>mm..............",
    "............>>mmmmmm............",
    "..........>>mmm<<mmmmm..........",
    "........>>mmmmmmmmmmmmmm........",
    "......>>mmmmmmmmmmmmmmmmmm......",
    "....>>mmmmmmmmmmmmmmmmmmmmmm....",
    "..>>mmmmmmmmmmmmmmmmmmmmmmmmmm..",
    "<<mmm<mmmmmmmmmmmmmmmmmmmm<mmm<<",
    "..<<mmmmmmmmmmmmmmmmmmmmmmmm<<..",
    "....<<mmmmmmmmmmmmmmmmmmmm<<....",
    "......<<mmmmmmmmmmmmmmmm<<......",
    "........<<mmmmmmmmmmmm<<........",
    "..........<<mmmmmmmm<<..........",
    "............<<mmmm<<............",
    "..............<<<<.............."
   ]
  },
  "plate_blue": {
   "key": "plate_blue",
   "name": "isofloor_plate_blue",
   "id": "scifi/isofloor/plate_blue",
   "label": "Plaque d'acier bleu",
   "kind": "sprite",
   "w": 32,
   "h": 15,
   "size": 32,
   "props": {
    "shape": "plate",
    "color": "blue"
   },
   "tags": [],
   "png": "library/png/scifi/isofloor/plate_blue.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAPCAMAAACyXj0lAAAADFBMVEUAAABidZ8+S3IvLTxWfUeyAAAAAXRSTlMAQObYZgAAAEpJREFUeNqFztESABAIRNHo///ZiJB22ddzm0kkrJRaha9z34tVWeLXvg9fCeIjYTwT+0oRGqgncMZCk8U4CZyTxDGBvBPKI7m5AfGDAhcRI1BCAAAAAElFTkSuQmCC",
   "palette": {
    "[": "#3e4b72",
    "]": "#62759f",
    "d": "#2f2d3c"
   },
   "rows": [
    "..............]][[..............",
    "............]][[[[[[............",
    "..........]][[[dd[[[[[..........",
    "........]][[[[[[[[[[[[[[........",
    "......]][[[[[[[[[[[[[[[[[[......",
    "....]][[[[[[[[[[[[[[[[[[[[[[....",
    "..]][[[[[[[[[[[[[[[[[[[[[[[[[[..",
    "dd[[[d[[[[[[[[[[[[[[[[[[[[d[[[dd",
    "..dd[[[[[[[[[[[[[[[[[[[[[[[[dd..",
    "....dd[[[[[[[[[[[[[[[[[[[[dd....",
    "......dd[[[[[[[[[[[[[[[[dd......",
    "........dd[[[[[[[[[[[[dd........",
    "..........dd[[[[[[[[dd..........",
    "............dd[[[[dd............",
    "..............dddd.............."
   ]
  },
  "grate": {
   "key": "grate",
   "name": "isofloor_grate",
   "id": "scifi/isofloor/grate",
   "label": "Grille d'aération",
   "kind": "sprite",
   "w": 32,
   "h": 15,
   "size": 32,
   "props": {
    "shape": "grate",
    "color": "dark"
   },
   "tags": [
    "vent",
    "grid"
   ],
   "png": "library/png/scifi/isofloor/grate.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAPCAMAAACyXj0lAAAAFVBMVEUAAABXVnBBP1IvLTxxcIoaFCOLiqNmJX0FAAAAAXRSTlMAQObYZgAAAGJJREFUeNp9jksWABEMBEM+9z/yPBItDLKt0oVouVJqpfs13O6FmW+KYxHRozKxqshPcWxmHTdpUfJri40U6r/C+NzwEHMoDIAQB6ahYLyHMoaCcdsxraETTqEbHsoDu7LjDw6MA0mUkn3eAAAAAElFTkSuQmCC",
   "palette": {
    "<": "#413f52",
    ">": "#71708a",
    "c": "#8b8aa3",
    "d": "#2f2d3c",
    "k": "#1a1423",
    "m": "#575670"
   },
   "rows": [
    "..............mm<<..............",
    "............mm<<<<<<............",
    "..........mm<<<dd<<<<<..........",
    "........mm<<<d>>>kd<<<<<........",
    "......mm<<<d>>>kkk>>d<<<<<......",
    "....mm<<<dccckkk>>>kkkd<<<<<....",
    "..mm<<<d>>>kkkc>>kkk>>>kd<<<<<..",
    "dd<<<d>>>kkk>>ckkk>>>kkk>>d<<<dd",
    "..dd<<dkkk>>>kkkccckkk>>>d<<dd..",
    "....dd<<d>>kkk>>>kkkc>>d<<dd....",
    "......dd<<dk>>>kkk>>cd<<dd......",
    "........dd<<dkkk>>>d<<dd........",
    "..........dd<<d>>d<<dd..........",
    "............dd<<<<dd............",
    "..............dddd.............."
   ]
  },
  "hazard": {
   "key": "hazard",
   "name": "isofloor_hazard",
   "id": "scifi/isofloor/hazard",
   "label": "Plaque à bande de danger",
   "kind": "sprite",
   "w": 32,
   "h": 15,
   "size": 32,
   "props": {
    "shape": "hazard",
    "color": "yellow"
   },
   "tags": [
    "warning",
    "stripes"
   ],
   "png": "library/png/scifi/isofloor/hazard.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAPCAMAAACyXj0lAAAAD1BMVEUAAAAaFCPzw0ovLTxBP1Jx+J5qAAAAAXRSTlMAQObYZgAAAFpJREFUeNp1jkkSADEIAmXw/2+eymZCjFyhW80kAGB1vpmibnSrC8uo6M4xe9L0HiZL0CtqETomYSEvWizkmjD3s7Y+AfQGm5XHm2oR2pIl0Wp50qeloPfkrn986gKvAX/0vAAAAABJRU5ErkJggg==",
   "palette": {
    "<": "#413f52",
    "d": "#2f2d3c",
    "k": "#1a1423",
    "y": "#f3c34a"
   },
   "rows": [
    "..............kkkk..............",
    "............yyyyyyyy............",
    "..........kkkkyyyykkkk..........",
    "........yyyykkd<<dkkyyyy........",
    "......kkkkyyd<<<<<<dyykkkk......",
    "....yyyykkd<<<<<<<<<<dkkyyyy....",
    "..kkkkyyd<<<<<<<<<<<<<<dyykkkk..",
    "ddyykkd<<<<<<<<<<<<<<<<<<dkkyydd",
    "..ddyykd<<<<<<<<<<<<<<<<dkyydd..",
    "....ddkkyd<<<<<<<<<<<<dykkdd....",
    "......ddyykd<<<<<<<<dkyydd......",
    "........ddkkyd<<<<dykkdd........",
    "..........ddyykddkyydd..........",
    "............ddkkkkdd............",
    "..............dddd.............."
   ]
  },
  "hatch": {
   "key": "hatch",
   "name": "isofloor_hatch",
   "id": "scifi/isofloor/hatch",
   "label": "Trappe d'accès",
   "kind": "sprite",
   "w": 32,
   "h": 15,
   "size": 32,
   "props": {
    "shape": "hatch",
    "color": "light"
   },
   "tags": [
    "trapdoor"
   ],
   "png": "library/png/scifi/isofloor/hatch.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAPCAMAAACyXj0lAAAAElBMVEUAAABXVnBBP1IvLTxxcIrDwtQ9EAoqAAAAAXRSTlMAQObYZgAAAFNJREFUeNp9zdsSABAIRdES///LJnI5KefJ2MsggjGXQvk0635ZJCOWa42JZQUR2a/XkOzXfO2QccJ4EREjr5i39oknrUH2JMhIwnxImhf55El87hEcAiucWQNaAAAAAElFTkSuQmCC",
   "palette": {
    "<": "#413f52",
    ">": "#71708a",
    "C": "#c3c2d4",
    "d": "#2f2d3c",
    "m": "#575670"
   },
   "rows": [
    "..............mm<<..............",
    "............mm<<<<<<............",
    "..........mm<<<dd<<<<<..........",
    "........mm<<<dd>>dd<<<<<........",
    "......mm<<<dddd>>>>dd<<<<<......",
    "....mm<<<dd>>>>>>>>>>dd<<<<<....",
    "..mm<<<ddddmmmmmmmmmmmmdd<<<<<..",
    "dd<<<ddmmmmmmmmmmmmmmmmmmdd<<<dd",
    "..dd<<ddmmmmmmmmmmmmmmmmdd<<dd..",
    "....dd<<ddmmmmmmmmmmCCdd<<dd....",
    "......dd<<ddmmmmmmCCdd<<dd......",
    "........dd<<ddmmmmdd<<dd........",
    "..........dd<<dddd<<dd..........",
    "............dd<<<<dd............",
    "..............dddd.............."
   ]
  },
  "circuit": {
   "key": "circuit",
   "name": "isofloor_circuit",
   "id": "scifi/isofloor/circuit",
   "label": "Plaque à circuit lumineux",
   "kind": "sprite",
   "w": 32,
   "h": 15,
   "size": 32,
   "props": {
    "shape": "circuit",
    "color": "cyan"
   },
   "tags": [
    "glow",
    "tech"
   ],
   "png": "library/png/scifi/isofloor/circuit.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAPCAMAAACyXj0lAAAAFVBMVEUAAABXVnBBP1Ky/+Q/0K4bf3ovLTzEc8YwAAAAAXRSTlMAQObYZgAAAF9JREFUeNqFjVkOAEEEBdG4/5EnerF0Wub9kFTxAEoQiaCPYcsPbpSMH4rjMV6KY565FUQR2TiNo6jaIiLpOhTVo/Aqr8rEMJX4uk1idgxelL8X7EqPa9ETR1GLl3LjD36OAt1nbiEZAAAAAElFTkSuQmCC",
   "palette": {
    "0": "#3fd0ae",
    "9": "#1b7f7a",
    "+": "#b2ffe4",
    "<": "#413f52",
    "d": "#2f2d3c",
    "m": "#575670"
   },
   "rows": [
    "..............mm<<..............",
    "............mm<<<<<<............",
    "..........mm<<<<<<<<<<..........",
    "........mm<<<<<<<<<<<<<<........",
    "......mm<<<<<<<++<<<<<<<<<......",
    "....mm<<<<<<<000000<<<<<<<<<....",
    "..mm999<<<<000<<<<000<<<<<<<<<..",
    "dd<<<<999000000<<<<<000<<<<<<<dd",
    "..dd<<<0++<<<<000<<<<<000<<<dd..",
    "....dd00<<<<<<<<0++<<<<<00dd....",
    "......dd<<<<<<<000<<<<<<dd......",
    "........dd<<<000<<<<<<dd........",
    "..........dd00<<<<<<dd..........",
    "............dd<<<<dd............",
    "..............dddd.............."
   ]
  },
  "light_node": {
   "key": "light_node",
   "name": "isofloor_light_node",
   "id": "scifi/isofloor/light_node",
   "label": "Croisement de rails de lumière",
   "kind": "sprite",
   "w": 32,
   "h": 15,
   "size": 32,
   "props": {
    "shape": "light",
    "color": "cyan",
    "state": "on"
   },
   "tags": [
    "glow",
    "strip",
    "junction"
   ],
   "png": "library/png/scifi/isofloor/light_node.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAPCAMAAACyXj0lAAAAGFBMVEUAAABXVnBBP1Ibf3ovLTyy/+Q/0K77+/+6dAIAAAAAAXRSTlMAQObYZgAAAHVJREFUeNp1kFkOACEIQ1G2+994Agguo3wpr6FNAbZprXd4j2GbB0bDRKbAC2YRxDiAKMIHFmEeEsf22bxruzwqS0QrUnjE9VSUElXVxA4oJXlCdTngGEJSDtOjsHdQ+5ny7KEuh+TW5EhukkfZEXfz/ktO/AGOFQPE3sO0dAAAAABJRU5ErkJggg==",
   "palette": {
    "0": "#3fd0ae",
    "9": "#1b7f7a",
    "+": "#b2ffe4",
    "<": "#413f52",
    "d": "#2f2d3c",
    "m": "#575670",
    "w": "#fbfbff"
   },
   "rows": [
    "..............mm<<..............",
    "............mm<<<<<<............",
    "..........9m<<<dd<<<<9..........",
    "........+0099<<<<<<9900+........",
    "......00+++0099<<9900+++00......",
    "....mm9900+++009900+++0099<<....",
    "..mm<<<<9900+++00+++0099<<<<<<..",
    "dd<<<d<<<<9900wwww0099<<<<d<<<dd",
    "..dd<<<<<9900++ww++0099<<<<<dd..",
    "....dd<9900+++0000+++0099<dd....",
    "......900+++00999900+++009......",
    "........++0099<<<<9900++........",
    "..........99<<<<<<<<99..........",
    "............dd<<<<dd............",
    "..............dddd.............."
   ]
  },
  "light": {
   "key": "light",
   "name": "isofloor_light",
   "id": "scifi/isofloor/light",
   "label": "Rail de lumière",
   "kind": "sprite",
   "w": 32,
   "h": 15,
   "size": 32,
   "props": {
    "shape": "light",
    "color": "cyan",
    "state": "on"
   },
   "tags": [
    "glow",
    "strip"
   ],
   "png": "library/png/scifi/isofloor/light.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAPCAMAAACyXj0lAAAAFVBMVEUAAABXVnBBP1IvLTwbf3o/0K6y/+TXu22tAAAAAXRSTlMAQObYZgAAAFJJREFUeNqFztsOwCAIA9Aql///5KXoTLYI9PUUUuCTMeZEHjJTsQgbWlyT1cwbdjdrWPVsyXjPjVVy4wB5K5frzViVipmGmYbjS804c1NelT8/4dMDEUgJCiEAAAAASUVORK5CYII=",
   "palette": {
    "0": "#3fd0ae",
    "9": "#1b7f7a",
    "+": "#b2ffe4",
    "<": "#413f52",
    "d": "#2f2d3c",
    "m": "#575670"
   },
   "rows": [
    "..............mm<<..............",
    "............mm<<<<<<............",
    "..........mm<<<dd<<<<9..........",
    "........mm<<<<<<<<<9900+........",
    "......mm<<<<<<<<<9900+++00......",
    "....mm<<<<<<<<<9900+++0099<<....",
    "..mm<<<<<<<<<9900+++0099<<<<<<..",
    "dd<<<d<<<<<9900+++0099<<<<d<<<dd",
    "..dd<<<<<9900+++0099<<<<<<<<dd..",
    "....dd<9900+++0099<<<<<<<<dd....",
    "......900+++0099<<<<<<<<dd......",
    "........++0099<<<<<<<<dd........",
    "..........99<<<<<<<<dd..........",
    "............dd<<<<dd............",
    "..............dddd.............."
   ]
  },
  "light_pulse": {
   "key": "light_pulse",
   "name": "isofloor_light_pulse",
   "id": "scifi/isofloor/light_pulse",
   "label": "Rail de lumière – impulsion animée",
   "kind": "anim",
   "w": 32,
   "h": 15,
   "size": 32,
   "props": {
    "shape": "light",
    "color": "cyan",
    "state": "pulse"
   },
   "tags": [
    "glow",
    "strip",
    "animated"
   ],
   "png": "library/png/scifi/isofloor/light_pulse.png",
   "gif": "library/png/scifi/isofloor/light_pulse.gif",
   "frameCount": 6,
   "loopMs": 1200,
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAPCAMAAACyXj0lAAAAElBMVEUAAABXVnBBP1IvLTwbf3o/0K7ks8UlAAAAAXRSTlMAQObYZgAAAFJJREFUeNqFzkEOwCAIRNHRgftfuRm0MW0EWJm8TwT4zBhzIh+xpmJSBYvtiMy8YXezhvVXw/vcePLGAXyTy/ZmrKTiSGrWNIxzS8YnSXklf34Ajl8CuTbodEAAAAAASUVORK5CYII=",
   "strip": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAPCAMAAACFvDBUAAAAGFBMVEUAAABXVnBBP1IvLTwbf3o/0K6y/+T7+//B2iPSAAAAAXRSTlMAQObYZgAAANZJREFUeNrVk8sOhSAMRFHa8v9/fFNUjFimPDberkxOJ2dADeEx27bvAczHuWKdP+UZx6gbcZGTw3kxH8Hp8hIRL3AiZgGcWSQt5C1/jZmJJnnWizCj+imJTOYtv4X1XU3woicyeanPPJW3/C18/S4D/KE3+KP+RN7y58do4QziAK/0L17VH86b/usIxulO3Mtft1fx1+0P5pv+YwXhHt7Un7xZvzMP/bqCscuRXgfV78l7flVg7HKk10H1e/Ke//7WWtjlSH9UWMt7/rLSxJ/neQXiD/IfHDoRsfzWk0QAAAAASUVORK5CYII=",
   "gifSrc": "data:image/gif;base64,R0lGODlhIAAPAPIAAAAAAFdWcEE/Ui8tPBt/ej/QrrL/5Pv7/yH/C05FVFNDQVBFMi4wAwEAAAAh+QQJKAAAACwAAAAAIAAPAAADXAi6zBFCtEnri1jW7WAcQzZwlpdhIEEU5HKd6KAWtMq9sJCuNQFGExxsRyuoficFUnci9pbMzwgA1cl4Rl8oB5r8nNlqjHMtHrfDaeuJbqpbC7EUvoF26STQvZUAACH5BAkUAAAALAAAAAAgAA8AAANgCLrMEUK0SeuLWNbtYBxDRnCWl2EEURQGuVwnqrKGsXJwLKRrbRepyCQX49F+wZMChAmJZr5V8tMcLJ2yXk1K0AlAE6YxCuzqwBvotuxFu9bTk9u1iGfm9AazmneB8BsJACH5BAkUAAAALAAAAAAgAA8AAANgCLrMEUK0SeuLWNbtYBxDVnCWl2FFYRgHuVwnqrLHsXJwLKRrbRupyCQX49F+wZMChAmJZr5V8tMcLJ2yXk1a0AlAE6YxCuzqwBvotuxFu9bTk9u1iGfm9AazmneB8BsJACH5BAkUAAAALAAAAAAgAA8AAANgCLrMEUK0SeuLWNbtYBxDRnCWl2EEURQGuVwnqrKGsXJwLKRrbRepyCQX49F+wZMChAmJZr5V8tMcLJ2yXk1K0AlAE6YxCuzqwBvotuxFu9bTk9u1iGfm9AazmneB8BsJACH5BAkUAAAALAAAAAAgAA8AAANcCLrMEUK0SeuLWNbtYBxDNnCWl2EgQRTkcp3ooBa0yr2wkK41AUYTHGxHK6h+JwVSdyL2lszPCADVyXhGXygHmvyc2WqMcy0et8Np64luqlsLsRS+gXbpJNC9lQAAOw==",
   "palette": {
    "0": "#3fd0ae",
    "9": "#1b7f7a",
    "+": "#b2ffe4",
    "<": "#413f52",
    "d": "#2f2d3c",
    "m": "#575670",
    "w": "#fbfbff"
   },
   "rows": [
    "..............mm<<..............",
    "............mm<<<<<<............",
    "..........mm<<<dd<<<<d..........",
    "........mm<<<<<<<<<dd990........",
    "......mm<<<<<<<<<dd9900099......",
    "....mm<<<<<<<<<dd9900099dd<<....",
    "..mm<<<<<<<<<dd9900099dd<<<<<<..",
    "dd<<<d<<<<<dd9900099dd<<<<d<<<dd",
    "..dd<<<<<dd9900099dd<<<<<<<<dd..",
    "....dd<dd9900099dd<<<<<<<<dd....",
    "......d9900099dd<<<<<<<<dd......",
    "........0099dd<<<<<<<<dd........",
    "..........dd<<<<<<<<dd..........",
    "............dd<<<<dd............",
    "..............dddd.............."
   ],
   "frames": [
    {
     "ms": 200,
     "rows": [
      "..............mm<<..............",
      "............mm<<<<<<............",
      "..........mm<<<dd<<<<d..........",
      "........mm<<<<<<<<<dd990........",
      "......mm<<<<<<<<<dd9900099......",
      "....mm<<<<<<<<<dd9900099dd<<....",
      "..mm<<<<<<<<<dd9900099dd<<<<<<..",
      "dd<<<d<<<<<dd9900099dd<<<<d<<<dd",
      "..dd<<<<<dd9900099dd<<<<<<<<dd..",
      "....dd<dd9900099dd<<<<<<<<dd....",
      "......d9900099dd<<<<<<<<dd......",
      "........0099dd<<<<<<<<dd........",
      "..........dd<<<<<<<<dd..........",
      "............dd<<<<dd............",
      "..............dddd.............."
     ]
    },
    {
     "ms": 200,
     "rows": [
      "..............mm<<..............",
      "............mm<<<<<<............",
      "..........mm<<<dd<<<<d..........",
      "........mm<<<<<<<<<dd990........",
      "......mm<<<<<<<<<dd9900099......",
      "....mm<<<<<<<<<dd9900099dd<<....",
      "..mm<<<<<<<<<dd9900099dd<<<<<<..",
      "dd<<<d<<<<<dd9900099dd<<<<d<<<dd",
      "..dd<<<<<dd9900099dd<<<<<<<<dd..",
      "....dd<dd9900099dd<<<<<<<<dd....",
      "......d9900099dd<<<<<<<<dd......",
      "........0099dd<<<<<<<<dd........",
      "..........dd<<<<<<<<dd..........",
      "............dd<<<<dd............",
      "..............dddd.............."
     ]
    },
    {
     "ms": 200,
     "rows": [
      "..............mm<<..............",
      "............mm<<<<<<............",
      "..........mm<<<dd<<<<9..........",
      "........mm<<<<<<<<<9900+........",
      "......mm<<<<<<<<<9900+++00......",
      "....mm<<<<<<<<<9900+++0099<<....",
      "..mm<<<<<<<<<9900+++0099<<<<<<..",
      "dd<<<d<<<<<9900+++0099<<<<d<<<dd",
      "..dd<<<<<9900+++0099<<<<<<<<dd..",
      "....dd<9900+++0099<<<<<<<<dd....",
      "......900+++0099<<<<<<<<dd......",
      "........++0099<<<<<<<<dd........",
      "..........99<<<<<<<<dd..........",
      "............dd<<<<dd............",
      "..............dddd.............."
     ]
    },
    {
     "ms": 200,
     "rows": [
      "..............mm<<..............",
      "............mm<<<<<<............",
      "..........mm<<<dd<<<<0..........",
      "........mm<<<<<<<<<00++w........",
      "......mm<<<<<<<<<00++www++......",
      "....mm<<<<<<<<<00++www++00<<....",
      "..mm<<<<<<<<<00++www++00<<<<<<..",
      "dd<<<d<<<<<00++www++00<<<<d<<<dd",
      "..dd<<<<<00++www++00<<<<<<<<dd..",
      "....dd<00++www++00<<<<<<<<dd....",
      "......0++www++00<<<<<<<<dd......",
      "........ww++00<<<<<<<<dd........",
      "..........00<<<<<<<<dd..........",
      "............dd<<<<dd............",
      "..............dddd.............."
     ]
    },
    {
     "ms": 200,
     "rows": [
      "..............mm<<..............",
      "............mm<<<<<<............",
      "..........mm<<<dd<<<<9..........",
      "........mm<<<<<<<<<9900+........",
      "......mm<<<<<<<<<9900+++00......",
      "....mm<<<<<<<<<9900+++0099<<....",
      "..mm<<<<<<<<<9900+++0099<<<<<<..",
      "dd<<<d<<<<<9900+++0099<<<<d<<<dd",
      "..dd<<<<<9900+++0099<<<<<<<<dd..",
      "....dd<9900+++0099<<<<<<<<dd....",
      "......900+++0099<<<<<<<<dd......",
      "........++0099<<<<<<<<dd........",
      "..........99<<<<<<<<dd..........",
      "............dd<<<<dd............",
      "..............dddd.............."
     ]
    },
    {
     "ms": 200,
     "rows": [
      "..............mm<<..............",
      "............mm<<<<<<............",
      "..........mm<<<dd<<<<d..........",
      "........mm<<<<<<<<<dd990........",
      "......mm<<<<<<<<<dd9900099......",
      "....mm<<<<<<<<<dd9900099dd<<....",
      "..mm<<<<<<<<<dd9900099dd<<<<<<..",
      "dd<<<d<<<<<dd9900099dd<<<<d<<<dd",
      "..dd<<<<<dd9900099dd<<<<<<<<dd..",
      "....dd<dd9900099dd<<<<<<<<dd....",
      "......d9900099dd<<<<<<<<dd......",
      "........0099dd<<<<<<<<dd........",
      "..........dd<<<<<<<<dd..........",
      "............dd<<<<dd............",
      "..............dddd.............."
     ]
    }
   ]
  },
  "light_cross": {
   "key": "light_cross",
   "name": "isofloor_light_cross",
   "id": "scifi/isofloor/light_cross",
   "label": "Rail de lumière (autre sens)",
   "kind": "sprite",
   "w": 32,
   "h": 15,
   "size": 32,
   "props": {
    "shape": "light",
    "color": "cyan",
    "state": "on"
   },
   "tags": [
    "glow",
    "strip"
   ],
   "png": "library/png/scifi/isofloor/light_cross.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAPCAMAAACyXj0lAAAAFVBMVEUAAABXVnBBP1Ibf3ovLTyy/+Q/0K5ICUlIAAAAAXRSTlMAQObYZgAAAFhJREFUeNp90FcOwDAIA1D2/Y9ckXQkFMe/fhKDaAuzCOFknQG1Zm2GiEeoypdSR7gfCLPqgczVIBlbWUdGYQ+Rltg9pCdvjUg5tJLmVSsBz55km/0ntb4A55YDHJfRZkEAAAAASUVORK5CYII=",
   "palette": {
    "0": "#3fd0ae",
    "9": "#1b7f7a",
    "+": "#b2ffe4",
    "<": "#413f52",
    "d": "#2f2d3c",
    "m": "#575670"
   },
   "rows": [
    "..............mm<<..............",
    "............mm<<<<<<............",
    "..........9m<<<dd<<<<<..........",
    "........+0099<<<<<<<<<<<........",
    "......00+++0099<<<<<<<<<<<......",
    "....mm9900+++0099<<<<<<<<<<<....",
    "..mm<<<<9900+++0099<<<<<<<<<<<..",
    "dd<<<d<<<<9900+++0099<<<<<d<<<dd",
    "..dd<<<<<<<<9900+++0099<<<<<dd..",
    "....dd<<<<<<<<9900+++0099<dd....",
    "......dd<<<<<<<<9900+++009......",
    "........dd<<<<<<<<9900++........",
    "..........dd<<<<<<<<99..........",
    "............dd<<<<dd............",
    "..............dddd.............."
   ]
  },
  "light_cross_pulse": {
   "key": "light_cross_pulse",
   "name": "isofloor_light_cross_pulse",
   "id": "scifi/isofloor/light_cross_pulse",
   "label": "Rail de lumière (autre sens) – impulsion animée",
   "kind": "anim",
   "w": 32,
   "h": 15,
   "size": 32,
   "props": {
    "shape": "light",
    "color": "cyan",
    "state": "pulse"
   },
   "tags": [
    "glow",
    "strip",
    "animated"
   ],
   "png": "library/png/scifi/isofloor/light_cross_pulse.png",
   "gif": "library/png/scifi/isofloor/light_cross_pulse.gif",
   "frameCount": 6,
   "loopMs": 1200,
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAPCAMAAACyXj0lAAAAElBMVEUAAABXVnBBP1IvLTw/0K4bf3q0qvxbAAAAAXRSTlMAQObYZgAAAFVJREFUeNp90FsKwDAIRFF1dP9bLuZRWnH0L9xDSBT5jaqZ8MmcQzIyA4x4xIntLRHuA1EFBrKfRsk6oyMr4BJrCe4HW/JmRuqaCuk2+SFs2RjzJjU/nsUCxpuWU38AAAAASUVORK5CYII=",
   "strip": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAPCAMAAACFvDBUAAAAGFBMVEUAAABXVnBBP1IvLTwbf3o/0K6y/+T7+//B2iPSAAAAAXRSTlMAQObYZgAAANhJREFUeNrVk0sSgzAMQx384f437oS0hQbZJmFDvcs8aSQtQvRzpSwLBfdwXnG9P+VcMbMrybgkXG/6k3wVeUO8MuOmKhLw1Uz1hj/JF1GNJBlXNYsqmK1rNCHzJ/mlMEeSnFfqVyilUn9C7g/z29fwJde4X6Fxf8I1v5u/vRlJNsDXeV+h5/2EUT/O/0xYoIRpiJ8qdPw0YdCP813JFw/wYwXEjxNm/DjfkdAU3ytgvk+Y8+N8IKFp3ir4vE2Y9+P8TkK3uEjMYfyAH+d/JS5+PN8kIX4gfwEhZRHP533WXAAAAABJRU5ErkJggg==",
   "gifSrc": "data:image/gif;base64,R0lGODlhIAAPAPIAAAAAAFdWcEE/Ui8tPD/Qrht/erL/5Pv7/yH/C05FVFNDQVBFMi4wAwEAAAAh+QQJKAAAACwAAAAAIAAPAAADXAi6zBFCtEnri1jWzQaMw5Bp3EQURTiu5YISMKquGfeEb5yKNDZdGFwBdtr1fICZgAca5IpKUHCgiGaERBmzObFOn9oldeNtglOt6vbqHBLSjbIYXomG6KXQPZ0AACH5BAkUAAAALAAAAAAgAA8AAANfCLrMEUK0SeuLWNbNCozDkGncZBBEUYxsuaBGjKrsyD0qLKdrjU0XTI4QO/F8P0AIIxIWdEZapikIKZa1YXHWYw4mWJZ2R7NuwqNx1HWlpp9EA7uBzqjmFbQZfw592QkAIfkECRQAAAAsAAAAACAADwAAA18IuswRQrRJ64tY1s0IjMOQadx0GAZBjGy5oEeMquzIPSosp2uNTRdMzhA78Xw/QAgjEhJ0RlqmKQgplrVhcdZjDiZYlnZHs27Co3HUdaWmn8QDu4HOqOYVtBl/Dn3ZCQAh+QQJFAAAACwAAAAAIAAPAAADXwi6zBFCtEnri1jWzQqMw5Bp3GQQRFGMbLmgRoyq7Mg9Kiyna41NF0yOEDvxfD9ACCMSFnRGWqYpCCmWtWFx1mMOJliWdkezbsKjcdR1paafRAO7gc6o5hW0GX8OfdkJACH5BAkUAAAALAAAAAAgAA8AAANcCLrMEUK0SeuLWNbNBozDkGncRBRFOK7lghIwqq4Z94RvnIo0Nl0YXAF22vV8gJmABxrkikpQcKCIZoREGbM5sU6f2iV1422CU63q9uocEtKNshheiYbopdA9nQAAOw==",
   "palette": {
    "0": "#3fd0ae",
    "9": "#1b7f7a",
    "+": "#b2ffe4",
    "<": "#413f52",
    "d": "#2f2d3c",
    "m": "#575670",
    "w": "#fbfbff"
   },
   "rows": [
    "..............mm<<..............",
    "............mm<<<<<<............",
    "..........dm<<<dd<<<<<..........",
    "........099dd<<<<<<<<<<<........",
    "......9900099dd<<<<<<<<<<<......",
    "....mmdd9900099dd<<<<<<<<<<<....",
    "..mm<<<<dd9900099dd<<<<<<<<<<<..",
    "dd<<<d<<<<dd9900099dd<<<<<d<<<dd",
    "..dd<<<<<<<<dd9900099dd<<<<<dd..",
    "....dd<<<<<<<<dd9900099dd<dd....",
    "......dd<<<<<<<<dd9900099d......",
    "........dd<<<<<<<<dd9900........",
    "..........dd<<<<<<<<dd..........",
    "............dd<<<<dd............",
    "..............dddd.............."
   ],
   "frames": [
    {
     "ms": 200,
     "rows": [
      "..............mm<<..............",
      "............mm<<<<<<............",
      "..........dm<<<dd<<<<<..........",
      "........099dd<<<<<<<<<<<........",
      "......9900099dd<<<<<<<<<<<......",
      "....mmdd9900099dd<<<<<<<<<<<....",
      "..mm<<<<dd9900099dd<<<<<<<<<<<..",
      "dd<<<d<<<<dd9900099dd<<<<<d<<<dd",
      "..dd<<<<<<<<dd9900099dd<<<<<dd..",
      "....dd<<<<<<<<dd9900099dd<dd....",
      "......dd<<<<<<<<dd9900099d......",
      "........dd<<<<<<<<dd9900........",
      "..........dd<<<<<<<<dd..........",
      "............dd<<<<dd............",
      "..............dddd.............."
     ]
    },
    {
     "ms": 200,
     "rows": [
      "..............mm<<..............",
      "............mm<<<<<<............",
      "..........dm<<<dd<<<<<..........",
      "........099dd<<<<<<<<<<<........",
      "......9900099dd<<<<<<<<<<<......",
      "....mmdd9900099dd<<<<<<<<<<<....",
      "..mm<<<<dd9900099dd<<<<<<<<<<<..",
      "dd<<<d<<<<dd9900099dd<<<<<d<<<dd",
      "..dd<<<<<<<<dd9900099dd<<<<<dd..",
      "....dd<<<<<<<<dd9900099dd<dd....",
      "......dd<<<<<<<<dd9900099d......",
      "........dd<<<<<<<<dd9900........",
      "..........dd<<<<<<<<dd..........",
      "............dd<<<<dd............",
      "..............dddd.............."
     ]
    },
    {
     "ms": 200,
     "rows": [
      "..............mm<<..............",
      "............mm<<<<<<............",
      "..........9m<<<dd<<<<<..........",
      "........+0099<<<<<<<<<<<........",
      "......00+++0099<<<<<<<<<<<......",
      "....mm9900+++0099<<<<<<<<<<<....",
      "..mm<<<<9900+++0099<<<<<<<<<<<..",
      "dd<<<d<<<<9900+++0099<<<<<d<<<dd",
      "..dd<<<<<<<<9900+++0099<<<<<dd..",
      "....dd<<<<<<<<9900+++0099<dd....",
      "......dd<<<<<<<<9900+++009......",
      "........dd<<<<<<<<9900++........",
      "..........dd<<<<<<<<99..........",
      "............dd<<<<dd............",
      "..............dddd.............."
     ]
    },
    {
     "ms": 200,
     "rows": [
      "..............mm<<..............",
      "............mm<<<<<<............",
      "..........0m<<<dd<<<<<..........",
      "........w++00<<<<<<<<<<<........",
      "......++www++00<<<<<<<<<<<......",
      "....mm00++www++00<<<<<<<<<<<....",
      "..mm<<<<00++www++00<<<<<<<<<<<..",
      "dd<<<d<<<<00++www++00<<<<<d<<<dd",
      "..dd<<<<<<<<00++www++00<<<<<dd..",
      "....dd<<<<<<<<00++www++00<dd....",
      "......dd<<<<<<<<00++www++0......",
      "........dd<<<<<<<<00++ww........",
      "..........dd<<<<<<<<00..........",
      "............dd<<<<dd............",
      "..............dddd.............."
     ]
    },
    {
     "ms": 200,
     "rows": [
      "..............mm<<..............",
      "............mm<<<<<<............",
      "..........9m<<<dd<<<<<..........",
      "........+0099<<<<<<<<<<<........",
      "......00+++0099<<<<<<<<<<<......",
      "....mm9900+++0099<<<<<<<<<<<....",
      "..mm<<<<9900+++0099<<<<<<<<<<<..",
      "dd<<<d<<<<9900+++0099<<<<<d<<<dd",
      "..dd<<<<<<<<9900+++0099<<<<<dd..",
      "....dd<<<<<<<<9900+++0099<dd....",
      "......dd<<<<<<<<9900+++009......",
      "........dd<<<<<<<<9900++........",
      "..........dd<<<<<<<<99..........",
      "............dd<<<<dd............",
      "..............dddd.............."
     ]
    },
    {
     "ms": 200,
     "rows": [
      "..............mm<<..............",
      "............mm<<<<<<............",
      "..........dm<<<dd<<<<<..........",
      "........099dd<<<<<<<<<<<........",
      "......9900099dd<<<<<<<<<<<......",
      "....mmdd9900099dd<<<<<<<<<<<....",
      "..mm<<<<dd9900099dd<<<<<<<<<<<..",
      "dd<<<d<<<<dd9900099dd<<<<<d<<<dd",
      "..dd<<<<<<<<dd9900099dd<<<<<dd..",
      "....dd<<<<<<<<dd9900099dd<dd....",
      "......dd<<<<<<<<dd9900099d......",
      "........dd<<<<<<<<dd9900........",
      "..........dd<<<<<<<<dd..........",
      "............dd<<<<dd............",
      "..............dddd.............."
     ]
    }
   ]
  }
 }
};
export default asset;
