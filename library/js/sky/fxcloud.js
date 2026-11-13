// GÉNÉRÉ par scripts/build.js — ne pas modifier. Source : assets/sky/fxcloud.px.js
// Nuage (style pixelfx) — 8 variante(s). Usage :
//   import asset from "./fxcloud.js"; const v = asset.variants["cumulus_64"];
//   v.src (data URL PNG), v.rows + v.palette (pixels, "." = transparent), v.w, v.h
/** @type {import("../../index.d.ts").PixelAsset} */
export const asset = {
 "id": "sky/fxcloud",
 "slug": "fxcloud",
 "category": "sky",
 "title": "Nuage (style pixelfx)",
 "description": "Nuages au rendu riche inspiré des effets clouds et storm-cloud de la bibliothèque pixelfx : rangée de bouffées sur une base presque plate, crête éclairée en haut, paliers francs qui descendent vers un ventre sombre, lignes claires entre les lobes, côté droit des bouffées à l'ombre (lumière en haut à gauche). Sans contour noir. Variantes : cumulus blanc (64 × 32, 48 × 24), petit nuage (32 × 16, 16 px), nuage de nuit au clair de lune, nuage d'orage sombre, nuage rose du couchant et longue bande de stratus gris. Nuage seul, sans pluie ni éclair.",
 "tags": [
  "cloud",
  "sky",
  "weather",
  "day",
  "realistic",
  "pixelfx"
 ],
 "order": 0,
 "source": "assets/sky/fxcloud.px.js",
 "module": "library/js/sky/fxcloud.js",
 "sheet": {
  "png": "library/sheets/sky/fxcloud.png",
  "json": "library/sheets/sky/fxcloud.json"
 },
 "axes": {
  "shape": [
   "cumulus",
   "puff",
   "storm",
   "stratus"
  ],
  "time": [
   "day",
   "night",
   "storm",
   "sunset",
   "overcast"
  ]
 },
 "sizes": [
  16,
  32,
  48,
  64
 ],
 "variantCount": 8,
 "variants": {
  "cumulus_64": {
   "key": "cumulus_64",
   "name": "fxcloud_cumulus_64",
   "id": "sky/fxcloud/cumulus_64",
   "label": "Cumulus (64 × 32)",
   "kind": "sprite",
   "w": 64,
   "h": 32,
   "size": 64,
   "props": {
    "shape": "cumulus",
    "time": "day"
   },
   "tags": [],
   "png": "library/png/sky/fxcloud/cumulus_64.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAMAAACVQ462AAAAElBMVEUAAAD7+//T4PKPo8didZ8+S3LzqpYUAAAAAXRSTlMAQObYZgAAAMpJREFUeNrtVMsOwyAMq5Pm/395gvBIIIVy26E+TJGxHWugXteHDwcAcCAdxQCI6F1GlnpxoRRb/6y1FDG99xctCgq5ToBqEorW1k8sLxPQ7BlmMdmT5wAVwZXuEfsAqL/o4Ve3gOCWbQHTmYfNydjPn16Q25inXt3WCv5KNYM3oPpL4QvgA0x+PgQFN6i4M+o4Oys336ALuNtYiWqskyvQfQYx1xraALlPISIuQOTQPQTkCDGHJjEi4qfclHaOiMUHYa41rfi7z/0PyMEJ+xndZVMAAAAASUVORK5CYII=",
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
    "................................................................",
    "................................................................",
    "................................................................",
    "................................................................",
    "........................................www.....................",
    "..................wwwww..............wwwssswww..................",
    "................wwssssswww.........wwsssssssssss................",
    "...............wsssssssssss.......wssssssssssssSs...............",
    "..............wsssssssssssSs.....wwwwwwwwssssssSSs..............",
    ".............wssssSSSSSSssSSs..wwssssssssssSSSsSSSs.............",
    "............wsssSSSSSSSSSSSwwwwwssssssssssSSSSSSSSS.............",
    "............ssSSSSwwwwwwwwwssssswwssssssssSSSSSSSSS.............",
    "...........wsSSSSwssssssswsssssssssSSSSSssSSSSSSSwwwww..........",
    "...........ssSSwwsssssssssSsssssssSSSSSSSSwwwwSwwsssssss........",
    "...........wwwwssssSSSSSssSSsSSSSsSSSSSSSSSssswssssssssSs.......",
    ".........wwsssswSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSsSSSSSsSSs......",
    "........wsssssSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS......",
    ".......wssSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSs.....",
    ".......ssSSSSSSSSSS]]]]]]SSSSS]]]SSSSSSSSSSSSSSSSSS]]SSSSSS.....",
    "......wsSSSSSSSSSSS]]]]]]]SSSS]]]]]S]]]]]]]]]SSSSSS]]]]SSSS.....",
    "......sSSS]]]]]]]]]]]]]]]]]]SS]]]]]]]]]]]]]]]]]]SSS]]]]]]SS.....",
    "......[]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]][[[.....",
    "......[[[]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]][[[[[[.....",
    "........[[[[]]]]][[[[[[[[[]]]]]]]][[[[[[[[[]]]]]]]][[[..........",
    "...........[[[[[[[[[...[[[[[[[[[[[[[[...[[[[[[[[[[[[............",
    "..............[..............[[[.............[[[[...............",
    "................................................................",
    "................................................................"
   ]
  },
  "cumulus_48": {
   "key": "cumulus_48",
   "name": "fxcloud_cumulus_48",
   "id": "sky/fxcloud/cumulus_48",
   "label": "Cumulus (48 × 24)",
   "kind": "sprite",
   "w": 48,
   "h": 24,
   "size": 48,
   "props": {
    "shape": "cumulus",
    "time": "day"
   },
   "tags": [],
   "png": "library/png/sky/fxcloud/cumulus_48.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAYCAMAAACLI47uAAAAElBMVEUAAAD7+//T4PKPo8didZ8+S3LzqpYUAAAAAXRSTlMAQObYZgAAAI5JREFUeNrtkFsOgCAMBO0u3P/Kpki1RV7x24kR0swWynH8fEBE5NnZfqIDgMB2gCx1bUs4JoFil7b6pwJwnBDfl7xmEI4TFqjmnR0Nb/dAAwez2AVoMdYp9NNa7z6cgcbnkviifSf51R8hpZqYHFfpXuMRYHAbLOgCOS3JOftAwEuO+KxP8WW93B5b0hYn75cFiDNLUnoAAAAASUVORK5CYII=",
   "palette": {
    "S": "#8fa3c7",
    "[": "#3e4b72",
    "]": "#62759f",
    "s": "#d3e0f2",
    "w": "#fbfbff"
   },
   "rows": [
    "................................................",
    "................................................",
    "................................................",
    "................................................",
    "................................................",
    "................................................",
    "................wwww......wwwwww................",
    "..............wwssssws..wwssssssw...............",
    "............wwssswwwwSssssssssssss..............",
    "............sswwwsssswwsssSSSSSssSs.............",
    "...........wssssssssssssSSwwwwwwwSSs............",
    "...........wssssssswwwwwwwssssssssswwwww........",
    "..........wwsssSSSssssssssssssssssSsssssss......",
    ".........wwwwwwSSSsssSSSssSsSSSSSsSSsSsssS......",
    "........wssssSSSSSSSSSSSSSSSSSSSSSSSSSSSSSs.....",
    ".......wsSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS.....",
    ".......sSSSSSSSSSSSSSSSSSSSSSS]SSSSSSS]SSSSs....",
    "......wSSSS]]S]]]]]]]]]]]]SSSS]]]]SSSS]]]SSS....",
    "......sSS]]]]]]]]]]]]]]]]]]]]]]]]]]]SS]]]]SS....",
    "......[]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]][[[....",
    "......[[[[[[[[[[[[[[]]]]]]]]][[[[[[[[[[[[[[.....",
    "........[[[[[[[...[[[[[[[[[[[[[[...[[[..........",
    ".......................[[[......................",
    "................................................"
   ]
  },
  "puff_32": {
   "key": "puff_32",
   "name": "fxcloud_puff_32",
   "id": "sky/fxcloud/puff_32",
   "label": "Petit nuage (32 × 16)",
   "kind": "sprite",
   "w": 32,
   "h": 16,
   "size": 32,
   "props": {
    "shape": "puff",
    "time": "day"
   },
   "tags": [],
   "png": "library/png/sky/fxcloud/puff_32.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAQCAMAAABA3o1rAAAAElBMVEUAAAD7+//T4PKPo8didZ8+S3LzqpYUAAAAAXRSTlMAQObYZgAAAF9JREFUeNq9kNsOwCAIQ4XS///lRTALTuRxTYSYHupljH8lU52toW5cmpCYXzEVoKrAOqSIERFgAgCqFFF1ICsTYZp5fYkEhBkrymwJIGkfkdwuQSbIN8czuen23af1AHNGAkzZkCUWAAAAAElFTkSuQmCC",
   "palette": {
    "S": "#8fa3c7",
    "[": "#3e4b72",
    "]": "#62759f",
    "s": "#d3e0f2",
    "w": "#fbfbff"
   },
   "rows": [
    "................................",
    "................................",
    "................................",
    "............wwwww...............",
    "..........wwsssssss.............",
    ".........wwwwwwwwwww............",
    ".........wssssswwsssss..........",
    ".........sssSSssssssswwww.......",
    ".......wwwSSSSssSSSwwsssss......",
    "......wsswSSSSSSSSSSSSSSSSs.....",
    ".....wSSSSS]]SSSS]SSSSSSSSS.....",
    ".....SS]]SS]]SS]]]SS]]]]]SS.....",
    ".....[[[]]]]]]]]]]]]]]]][[[.....",
    ".......[[[[[]]]]]]]][[[[[.......",
    ".........[[[[[[[[[[[[[[.........",
    "..............[[[..............."
   ]
  },
  "puff_16": {
   "key": "puff_16",
   "name": "fxcloud_puff_16",
   "id": "sky/fxcloud/puff_16",
   "label": "Petit nuage (16 px)",
   "kind": "sprite",
   "w": 16,
   "h": 16,
   "size": 16,
   "props": {
    "shape": "puff",
    "time": "day"
   },
   "tags": [
    "icon"
   ],
   "png": "library/png/sky/fxcloud/puff_16.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAElBMVEUAAAD7+//T4PKPo8didZ8+S3LzqpYUAAAAAXRSTlMAQObYZgAAAD5JREFUeNq1jkEKADAIw9TW/395KBtOYccFPDQqVOQbGkxhdmcAUGtCtUzsGTfYwkkSMefFU5EuZZLeZeYnC0sbAMdPyC7sAAAAAElFTkSuQmCC",
   "palette": {
    "S": "#8fa3c7",
    "[": "#3e4b72",
    "]": "#62759f",
    "s": "#d3e0f2",
    "w": "#fbfbff"
   },
   "rows": [
    "................",
    "................",
    "................",
    "................",
    "................",
    ".....wwwww......",
    ".....wwwwss.....",
    "....wwSSSSws....",
    "....wwSSwwSws...",
    "...wSSS]SSSSS...",
    "...[]]]]S]]]S...",
    "....[[]]]]]][...",
    ".....[[[[[[[....",
    ".........[[.....",
    "................",
    "................"
   ]
  },
  "night_48": {
   "key": "night_48",
   "name": "fxcloud_night_48",
   "id": "sky/fxcloud/night_48",
   "label": "Nuage de nuit (48 × 24)",
   "kind": "sprite",
   "w": 48,
   "h": 24,
   "size": 48,
   "props": {
    "shape": "cumulus",
    "time": "night"
   },
   "tags": [
    "night",
    "moonlit"
   ],
   "png": "library/png/sky/fxcloud/night_48.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAYCAMAAACLI47uAAAAElBMVEUAAACPo8didZ8+S3IbJlIPFjRKbRiwAAAAAXRSTlMAQObYZgAAAJNJREFUeNrlk8sWgCAIRBuQ///lDgmJgda+uzFr7pg9juPfwJjPbPJ043E9Xjohz1QWFHlWdCDvDwU5zwNoHEBv4MLocWgSzKHcyMLV6tu0NOCLlAJR3LcWDAvpnjgyNs/3clshkx8Uv0ILobWVMQttwtR+5OMsSHvlIYjsHZH0KqIiRphXH6AEHvP1X5EubtNfOAGIGwXwWVEohgAAAABJRU5ErkJggg==",
   "palette": {
    "M": "#1b2652",
    "O": "#0f1634",
    "S": "#8fa3c7",
    "[": "#3e4b72",
    "]": "#62759f"
   },
   "rows": [
    "................................................",
    "................................................",
    "................................................",
    "................................................",
    "................................................",
    "..........SSSSSSSS..........SSSS................",
    ".........S]]]]]]]]]]......SS]]]]SSS.............",
    "........S]]]]]]]]]][]....S]]]]]]]]]]............",
    ".......S]]]][[[[[]][[]..SS]]]]]]]]][]...........",
    "......S]]][[[[[[[[[[[SSS]]SSS[[[[[][[]..........",
    "......]][[[[S[SSSS[[S]]]]]]]]][[[[[[[[..........",
    "......][[SSSSS]]]]SS]]]]]]]SSSSS[[[[[[..........",
    "......][[]]S]]]]]]]]]][[[SS]]]]]SSSSSS].........",
    "......[[[[[[[[[[[[[][[[[[]][[[]SS]]]]]].........",
    "......[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[][]........",
    "......[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[].......",
    "......[[[[[[[[[MM[[[[[[[[[[[[[[[[[[[[[[[[.......",
    "......MMMMMMMMMMMMMM[[[[[MMMMM[[[MMMMM[[[.......",
    "......OMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM.......",
    "......OOOOMMMMMMMMMMMMMMMMMMMMMMMMMMMMMOO.......",
    ".........OOOMMMMMMMMMOOOOOOOOMMMMMMMMOOO........",
    "...........OOOOOOOOOOOO....OOOOOOOOOOO..........",
    "...............OOO..............OOO.............",
    "................................................"
   ]
  },
  "storm_64": {
   "key": "storm_64",
   "name": "fxcloud_storm_64",
   "id": "sky/fxcloud/storm_64",
   "label": "Nuage d'orage (64 × 32)",
   "kind": "sprite",
   "w": 64,
   "h": 32,
   "size": 64,
   "props": {
    "shape": "storm",
    "time": "storm"
   },
   "tags": [
    "storm",
    "dark",
    "rain"
   ],
   "png": "library/png/sky/fxcloud/storm_64.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAMAAACVQ462AAAAElBMVEUAAACLiqNxcIpXVnBBP1IvLTzsH27FAAAAAXRSTlMAQObYZgAAALxJREFUeNrtlc0SgCAIhBPk/V+58Z8tUuzUob0k1bey0kzH8et7ClVW5cKpKkFYufj+/lDzID+PXF0y0xYPJrlYO4SykdoctTSoPDKqo7acGaT9dX5mCvpgpxMJo/+cmJnoMY/dALyeHDAPFdPHieDJZ57Vul9rzGuQPu2lRpv3T4A9vD1WJ11CjUI1wK/UHaZ8LDKfgUG86HYHLNHAwC1BR7lsBvGtmoGIyC6bGBlzlKINVtNo4tL/99E6AWzjCwV3HWoqAAAAAElFTkSuQmCC",
   "palette": {
    "<": "#413f52",
    ">": "#71708a",
    "c": "#8b8aa3",
    "d": "#2f2d3c",
    "m": "#575670"
   },
   "rows": [
    "................................................................",
    "................................................................",
    "................................................................",
    "................................................................",
    "................................................................",
    "................................................................",
    "...............cccccccc......cccccccc...........................",
    ".............cc>>>>>>>>cc..cc>>>>>>>>cc.........................",
    "............c>>>>>>>cccccccccccc>>>>>>>>>.......................",
    "...........c>>>>>>ccccc>>>>>>>>>cc>>>>>mm>......................",
    "..........c>>>>>>cccccccccc>>>>>>>>cccccmm>.....................",
    ".........c>>>>mmcc>>>>>>>>>>>>>>>>>>>>>>>m>.....................",
    ".........>>>>mmc>>>>>>>>>>>>m>>>>cccccccc>>>ccccc...............",
    ".........>>>mmccccc>>>>>>>>>mm>cc>>>>>>>cccc>>>>>cc.............",
    "........c>>mmcc>>>>cccmmmm>>mcc>>>>>>>>>>>>>>>>>>>>>>...........",
    "........>>mcc>>>>>>>>>>mmmmmc>>>>>>>>>>>>>mmmm>>>>>mm>..........",
    "........ccccccc>>>>>>>mmmmmm>>>>>>mmmmm>>>mmmmm>mmccccccc.......",
    "......cc>>>>>mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmcc>>>>>>>>......",
    ".....c>>>>>mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmc>>>>>>>>>m>.....",
    ".....>>>mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm>>>>mmmmmmmmm>....",
    "....c>mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm>...",
    "....>mmmmmmmmmmmmmmmmmmmmmmmmmmmm<<<<<<<mmmmmmmmmmmmmmmmmmmmm...",
    "....>mmmm<<<<<<<<<<<<<<<<mm<<<<<<<<<<<<<<<mmmmmmmmm<<<<mmmmmm...",
    "....mmm<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<mmmmmm<<<<<<<<<mmm...",
    "....<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<...",
    "....dddd<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<ddddd...",
    "......ddddddd<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<ddddddd......",
    "..........dddddddddddddddddddddddddddddddddddddddddddd..........",
    "................................................................",
    "................................................................",
    "................................................................",
    "................................................................"
   ]
  },
  "sunset_48": {
   "key": "sunset_48",
   "name": "fxcloud_sunset_48",
   "id": "sky/fxcloud/sunset_48",
   "label": "Nuage du couchant (48 × 24)",
   "kind": "sprite",
   "w": 48,
   "h": 24,
   "size": 48,
   "props": {
    "shape": "cumulus",
    "time": "sunset"
   },
   "tags": [
    "sunset",
    "dusk",
    "pink"
   ],
   "png": "library/png/sky/fxcloud/sunset_48.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAYCAMAAACLI47uAAAAElBMVEUAAAD/8KjQdF+PT19eOlo7K0vcAhe/AAAAAXRSTlMAQObYZgAAAJBJREFUeNrtkkEOgCAMBO0W/v9lU5dCS0TiwZtzECizVIzH8fM5YozFXgdhFJDnjOtQtLkwvMLUBk+X6yGrPjJ0gsBtg65GE7pMRFVVTWVD8BzcfCEX+sv1G/FT5BvrEt9KDSanpMGD+ca2WQxtEw4ayiHAmqN56dUaAmVPrTFQA8EYhax7ZkqmwuNvuxXecAJQdQVUfXanMwAAAABJRU5ErkJggg==",
   "palette": {
    "A": "#5e3a5a",
    "F": "#d0745f",
    "Y": "#fff0a8",
    "a": "#3b2b4b",
    "f": "#8f4f5f"
   },
   "rows": [
    "................................................",
    "................................................",
    "................................................",
    "................................................",
    "................................................",
    "................................................",
    "................................................",
    ".............YYYYY........YY....................",
    "...........YYFFFFFFF...YYYFFYYY.................",
    "..........YFFFFFFFFfF.YFFFFFYFFF................",
    "..........FFFffffffffYFFYYYYFYYYYYYYY...........",
    ".........YFffffffffYYYYYYYFFFFFFFFFFFF..........",
    ".........FfffYYYYYYFFFFFFFFFFFFFfFFFFFF.........",
    ".........YYYYFFFFFFFFfffFFfFffffffFfYYYYYF......",
    ".......YYFFFffffffFfFffffffffffffffYFFFFFfF.....",
    ".......FFffffffffffffffffffffffffffFfffffff.....",
    "......YfffffffffffffffAffffffAfffffffffffffF....",
    "......FffAfffAAAAAffffAAAAfffAAAffffAAAAAfff....",
    "......fAAAAAAAAAAAAAffAAAAAAAAAAAAAAAAAAAAfa....",
    "......AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaaa....",
    "......aaaaaaaaaaaaAAAAAAAAaaaaaaaaaAAAAaaa......",
    ".........aaa...aaaaaaaaaaaaaa...aaaaaaaa........",
    "....................aaaa........................",
    "................................................"
   ]
  },
  "stratus_64": {
   "key": "stratus_64",
   "name": "fxcloud_stratus_64",
   "id": "sky/fxcloud/stratus_64",
   "label": "Bande de stratus (64 × 16)",
   "kind": "sprite",
   "w": 64,
   "h": 16,
   "size": 64,
   "props": {
    "shape": "stratus",
    "time": "overcast"
   },
   "tags": [
    "overcast",
    "grey",
    "parallax"
   ],
   "png": "library/png/sky/fxcloud/stratus_64.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAQCAMAAACROYkbAAAAElBMVEUAAADDwtSLiqNxcIpXVnBBP1L/SedlAAAAAXRSTlMAQObYZgAAAJBJREFUeNrdUVEOxSAMEqj3v/KLtVMXnTPZ3yPxg1Yo1pT+EMCqhnM5SQ5CB0nwTE8VsA51IcrBYYbQSzUIJJCiE55EYKirkc8teSJWzbVJghSKK4bPlThST4KH/bUXSDLTSEYGaLVSyPp1qwahs04uqzwbyFV7tAt5YZBzawZsU1jtIHfc2Vx4+oap9V74jh+CNgS/gq8zdwAAAABJRU5ErkJggg==",
   "palette": {
    "<": "#413f52",
    ">": "#71708a",
    "C": "#c3c2d4",
    "c": "#8b8aa3",
    "m": "#575670"
   },
   "rows": [
    "................................................................",
    "................................................................",
    "................................................................",
    ".................CC..................CCC........................",
    "...............CCcccc........CCCCCCCCcccCc......................",
    "..............Cc>>>>>c..CCC.CcccCCccCCCCCC......................",
    ".............Cc>>>>>>>CCccccC>>Ccc>cCcccccc.....................",
    ".............c>>>>>CCCc>>>>CCCCC>>>cc>>>>>cc..CCCC..............",
    "...........C.CCCC>>>>>>>>>>Cccccc>>c>>>>>>Ccccccccc..C..........",
    "..........CCCc>>>>>>>>>>mm>>>>>>>>>>>mmm>>>>>>>>>>>CC>Cc........",
    ".........C>m>>>>>>>mmmm>mm>>>mm>>>>>mmm>>>mm>>>mmm>>>>><........",
    ".........>mm>mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm>mmmmmmmm<<........",
    ".........<<mmmmmmm<<<<<<<<<mmmmmmmm<<<<<<<<<mmmmmmmm<<<.........",
    "..........<<<<<<<<<<<...<<<<<<<<<<<<<<...<<<<<<<<<<<<...........",
    "............<<<..............<<<..............<<<...............",
    "................................................................"
   ]
  }
 }
};
export default asset;
