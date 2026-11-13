// GÉNÉRÉ par scripts/build.js — ne pas modifier. Source : assets/sky/fxstar.px.js
// Étoile (style pixelfx) — 7 variante(s). Usage :
//   import asset from "./fxstar.js"; const v = asset.variants["sparkle4_16"];
//   v.src (data URL PNG), v.rows + v.palette (pixels, "." = transparent), v.w, v.h
/** @type {import("../../index.d.ts").PixelAsset} */
export const asset = {
 "id": "sky/fxstar",
 "slug": "fxstar",
 "category": "sky",
 "title": "Étoile (style pixelfx)",
 "description": "Étoiles et ciel étoilé au rendu riche inspiré des effets shooting-stars et sunburst de la bibliothèque pixelfx : scintillements en croix au cœur blanc dont les branches refroidissent vers la pointe, halo translucide, étoile à cinq branches taillée en facettes dorées, et tuiles de ciel nocturne répétables (voie lactée en bande diagonale, poussière d'étoiles, étoiles fixes et scintillantes). Sans contour noir. Variantes : scintillement blanc à 4 branches, étoile dorée à 8 branches, étoile bleue, étoile à cinq branches (16, 32 px), ciel étoilé en tuile de 32 et 64 px. Les halos rendent mieux sur fond sombre.",
 "tags": [
  "star",
  "sky",
  "night",
  "sparkle",
  "twinkle",
  "starfield",
  "glow",
  "realistic",
  "pixelfx"
 ],
 "order": 0,
 "source": "assets/sky/fxstar.px.js",
 "module": "library/js/sky/fxstar.js",
 "sheet": {
  "png": "library/sheets/sky/fxstar.png",
  "json": "library/sheets/sky/fxstar.json"
 },
 "axes": {
  "shape": [
   "sparkle4",
   "sparkle8",
   "star5",
   "starfield"
  ],
  "color": [
   "white",
   "gold",
   "blue",
   "night"
  ]
 },
 "sizes": [
  16,
  32,
  64
 ],
 "variantCount": 7,
 "variants": {
  "sparkle4_16": {
   "key": "sparkle4_16",
   "name": "fxstar_sparkle4_16",
   "id": "sky/fxstar/sparkle4_16",
   "label": "Scintillement blanc (16 px)",
   "kind": "sprite",
   "w": 16,
   "h": 16,
   "size": 16,
   "props": {
    "shape": "sparkle4",
    "color": "white"
   },
   "tags": [
    "icon"
   ],
   "png": "library/png/sky/fxstar/sparkle4_16.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAFVBMVEUAAADI1P9idZ/I1P+Po8fT4PL7+/9HCj4dAAAABHRSTlMAGP9ARF4osAAAAEdJREFUeNqNj1EOwDAIQmWA9z/yYrtka/1Y3w8JGpSICWIF1+qAIn4MfwwAYLLkmZJ0ugQjX3IWlsatfaNn9CtHj7Uuve3LDZn+AQ/ydkCXAAAAAElFTkSuQmCC",
   "palette": {
    "S": "#8fa3c7",
    "]": "#62759f",
    "s": "#d3e0f2",
    "w": "#fbfbff",
    "{": "#c8d4ff40",
    "}": "#c8d4ff18"
   },
   "rows": [
    ".......}........",
    "......}]}.......",
    ".....}{S{}......",
    ".....}{S{}......",
    ".....}{s{}......",
    "..}}}}{w{}}}}...",
    ".}{{{{sws{{{{}..",
    "}]SSswwwwwsSS]}.",
    ".}{{{{sws{{{{}..",
    "..}}}}{w{}}}}...",
    ".....}{s{}......",
    ".....}{S{}......",
    ".....}{S{}......",
    "......}]}.......",
    ".......}........",
    "................"
   ]
  },
  "sparkle8_16": {
   "key": "sparkle8_16",
   "name": "fxstar_sparkle8_16",
   "id": "sky/fxstar/sparkle8_16",
   "label": "Étoile dorée à 8 branches (16 px)",
   "kind": "sprite",
   "w": 16,
   "h": 16,
   "size": 16,
   "props": {
    "shape": "sparkle8",
    "color": "gold"
   },
   "tags": [
    "icon",
    "magic"
   ],
   "png": "library/png/sky/fxstar/sparkle8_16.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGFBMVEUAAACyOizgeCr/4Hr/4Hrzw0r/8Kj7+/+ASqSzAAAABXRSTlMA//8fSvmlkr0AAABESURBVHjadY9LEoAwCEObD/H+N3bjjFpodmQekKx1EHaD2yzqx8tlfbYEx3gZ2ZWyHwdkJVdSJEZiuNG/tBxD0t7lrBuGKwDsdczJHAAAAABJRU5ErkJggg==",
   "palette": {
    "Y": "#fff0a8",
    "^": "#ffe07a4a",
    "o": "#e0782a",
    "r": "#b23a2c",
    "w": "#fbfbff",
    "y": "#f3c34a",
    "~": "#ffe07a1f"
   },
   "rows": [
    "................",
    ".......r........",
    ".......o........",
    "......~o~.......",
    "....r~^y^~r.....",
    "....~r^Y^r~.....",
    "...~^^yYy^^~....",
    ".rooyYYwYYyoor..",
    "...~^^yYy^^~....",
    "....~r^Y^r~.....",
    "....r~^y^~r.....",
    "......~o~.......",
    ".......o........",
    ".......r........",
    "................",
    "................"
   ]
  },
  "blue_16": {
   "key": "blue_16",
   "name": "fxstar_blue_16",
   "id": "sky/fxstar/blue_16",
   "label": "Étoile bleue (16 px)",
   "kind": "sprite",
   "w": 16,
   "h": 16,
   "size": 16,
   "props": {
    "shape": "sparkle4",
    "color": "blue"
   },
   "tags": [
    "icon",
    "cold"
   ],
   "png": "library/png/sky/fxstar/blue_16.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAFVBMVEUAAADI1P8vT7PI1P9Pj+Cf0P/7+/8WD4JCAAAABHRSTlMAGP9ARF4osAAAAEZJREFUeNp9j1EKwDAIQ/uMev8jl1E6Oi3Ln48QkzHuAsptX4JcBcQBAJRi54CkSJe0COaRj8KN1+GHo2X0L9cetWnb8qcJhj0A7PVnF48AAAAASUVORK5CYII=",
   "palette": {
    "I": "#9fd0ff",
    "i": "#4f8fe0",
    "u": "#2f4fb3",
    "w": "#fbfbff",
    "{": "#c8d4ff40",
    "}": "#c8d4ff18"
   },
   "rows": [
    "................",
    "......}}}.......",
    ".....}}u}}......",
    ".....}{i{}......",
    ".....}{I{}......",
    "..}}}}{w{}}}}...",
    ".}}{{{Iwi{{{}}..",
    ".}uiIwwwwwIiu}..",
    ".}}{{{iwi{{{}}..",
    "..}}}}{w{}}}}...",
    ".....}{I{}......",
    ".....}{i{}......",
    ".....}}u}}......",
    "......}}}.......",
    "................",
    "................"
   ]
  },
  "star5_32": {
   "key": "star5_32",
   "name": "fxstar_star5_32",
   "id": "sky/fxstar/star5_32",
   "label": "Étoile à cinq branches (32 px)",
   "kind": "sprite",
   "w": 32,
   "h": 32,
   "size": 32,
   "props": {
    "shape": "star5",
    "color": "gold"
   },
   "tags": [
    "pickup",
    "reward"
   ],
   "png": "library/png/sky/fxstar/star5_32.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGFBMVEUAAAD/4Hrzw0qyOiz/8KjgeCr7+/9uHyTeVlccAAAAAnRSTlMAH/ubwM0AAACaSURBVHjavdNJEsQgCAVQZLz/jbtQSGKcehW2/wlKlQBfV0HaA+S9KCeAzLgVJ1BOANnBRixBQS/xCVoBeVnGgn7SD7OqAyGpdRkJ4HkFUVcP8gGRa+bdkCoQG8j0kQNQEFTNlMy6hwRZxW3O3Zxstib6P58KkieYiK7BArTbL0A0MICFoMxTjOBeTh0zgG53ZgN4r9bsu9/6A7jvBUBo3uiDAAAAAElFTkSuQmCC",
   "palette": {
    "R": "#6e1f24",
    "Y": "#fff0a8",
    "o": "#e0782a",
    "r": "#b23a2c",
    "w": "#fbfbff",
    "y": "#f3c34a",
    "~": "#ffe07a1f"
   },
   "rows": [
    "................................",
    "................................",
    "................................",
    "..............~yr...............",
    "..............yYyr..............",
    ".............~yYyr..............",
    ".............yYYyyr.............",
    ".............yYYyyr.............",
    "............~yYYyyr.............",
    "............yYYYyyyr............",
    "............yYYYyyyr............",
    "....~yyyyyo~yYYwyyyr.rrrrrR.....",
    "..oyyYYYYYYyYwwwyyyoroooooorrR..",
    "...oyYYYYYYYwwwwyyyoooooooorR...",
    "...ryyyyYYYwwwwwyyoooooorrrrR...",
    "....ryyyyyywwwwwyoooorrrrrrR....",
    ".....rryyyyyyywwoorrrrrrrRR.....",
    ".......rryyyyyoorrrrrrrRR.......",
    ".........ryoooorrrrrrrR.........",
    "..........rooorrrrrrrR..........",
    ".........rooorrrrrrrrrR.........",
    "........roooorrrrrrrrrrR........",
    "........rooorrrrrrrrrrrR........",
    "........roorrrrRRrrrrrrR........",
    ".......rooorrrR..RrrrrrrR.......",
    ".......roorrrR....RrrrrrR.......",
    ".......rorrRR......RRrrrR.......",
    ".......rrRR..........RRrR.......",
    ".......RR..............RR.......",
    "................................",
    "................................",
    "................................"
   ]
  },
  "star5_16": {
   "key": "star5_16",
   "name": "fxstar_star5_16",
   "id": "sky/fxstar/star5_16",
   "label": "Étoile à cinq branches (16 px)",
   "kind": "sprite",
   "w": 16,
   "h": 16,
   "size": 16,
   "props": {
    "shape": "star5",
    "color": "gold"
   },
   "tags": [
    "icon",
    "pickup",
    "reward"
   ],
   "png": "library/png/sky/fxstar/star5_16.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAFVBMVEUAAADzw0qyOiz/8Kj7+/9uHyTgeCrA+mVEAAAAAXRSTlMAQObYZgAAAEFJREFUeNqNikEKwEAIxJzU8f9PLgu2LBbK5iAkY8QpYvg1ym9AkjIlAHfJTFW198+7L2qtmwffwAhgb8G2n3vADW9KAQHfnJ0QAAAAAElFTkSuQmCC",
   "palette": {
    "R": "#6e1f24",
    "Y": "#fff0a8",
    "o": "#e0782a",
    "r": "#b23a2c",
    "w": "#fbfbff",
    "y": "#f3c34a"
   },
   "rows": [
    "................",
    "................",
    ".......yr.......",
    "......yYyr......",
    "......yYyr......",
    "......yYyr......",
    ".ryyyywwyyrrrrR.",
    "..ryywwwyoorrR..",
    "...ryyyyrrrrR...",
    "....ooorrrrR....",
    "....roorrrrR....",
    "....rorrrrrR....",
    "....rrrRRrrR....",
    "...RRRR..RRRR...",
    "................",
    "................"
   ]
  },
  "starfield_64": {
   "key": "starfield_64",
   "name": "fxstar_starfield_64",
   "id": "sky/fxstar/starfield_64",
   "label": "Ciel étoilé, tuile (64 px)",
   "kind": "sprite",
   "w": 64,
   "h": 64,
   "size": 64,
   "props": {
    "shape": "starfield",
    "color": "night"
   },
   "tags": [
    "background",
    "tile",
    "seamless",
    "milky-way"
   ],
   "png": "library/png/sky/fxstar/starfield_64.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAGFBMVEUbJlIPFjQHChzT4PI+S3JidZ+Po8f7+//ml9vmAAACzElEQVR42pVXCY7EMAizyTH///EoAZI0R49Iu5qttg4YYxiAIqQIQJYfkih/L4dh91QQsABwCyD7h9DHei/K0deHKLYv9ggaEA0Asb7bABjIB4B6JylsMciYCA/ZrwBiAHFmgi9S0FOvjyFSnz2kPwKI1a/WIgL2oMbuKOkWoH7qJGgeXyKoN3glLBc2BvIrAFOD8QhoLW7fNoAsIxGMGFX5IYUOAj8UeYLZAkSUSgAZJ4B0AiBbRdmpXCHypXhzy5HZdBUrnSvAIG4If1yTcCKUUHG9W/w5/EJOehsuaskDgFOZGgCnCOpv/FaG6e0IZZI7DrICuKGs5qMuBcQQ4QCcqkCvAhduXZeWLgeD6QhsfmCcTsZhugxF3VbgTSmGCOplsyqIXIRVHIIIVy4462C1rsJDUkEVuCirJi86uNyfx2pSTh2Bs+ONeqCYqJ+badMbLYZdV7wBiDZvyO8A1erFmpsexREg3SbRo/gUQS0mzWHMKN4DtPnYPA6/CeEWoEjEuI9u9sVe8pcISB0YBgDyKwcUpR8RMZpZDhgvSNQFoY67gGVePAIMjmCDX2vhDf4qgkp8m1axq7LK7HmRym3MKoj4LoYlhasj9MWA49jzgUPuJtOkgr2oY+QJ4C6fVgud3g5QMuFpf5n8cZg3bWSBTC+2AFdlKQJtWijCYzvvTY5Fk1C3OG9S6ZyG16PazSYBPsRDjSBnEJfBfSlgvomnjhw/dTisM8dElTY8mFf6fi/8aZNtemjPpNa/AaD01lXE6fwNhZtlbq3nZtjP3VIRknWFtwblWRXlf5JJkBZ/6fCiSHmlyJaHL4IpojvMp6MIkusuWADyp9eTI4SYAeDd/ZsNppY76g4i+WsOKQMBvTVkJ+wbv6wVzLoMV88urZUOCPxxP/yTz16agZ9i4GF7kHGJufvuvHcIjEbH7p739ZsBcAEoibz/9v4Hc5wcB2KQuZEAAAAASUVORK5CYII=",
   "palette": {
    "M": "#1b2652",
    "O": "#0f1634",
    "Q": "#070a1c",
    "S": "#8fa3c7",
    "[": "#3e4b72",
    "]": "#62759f",
    "s": "#d3e0f2",
    "w": "#fbfbff"
   },
   "rows": [
    "MOQQOOQQMMOOMMOOOOOMOOQQQQQQQQQQQQQQQQQQQOsOQQQQQQQQQQQQQQQQQQQQ",
    "sMQQOOQQMMOOMMOOOOOOOOQQQQQQQQQQQQQQQQQQQQOQQQQQQQQQQQQQQQQQQQQO",
    "OQQQQQOOOMOOMMMMMOOOQQQMOOQQQQQQQQOQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ",
    "QQQQQQOMOOOOMMMMMM[OOQQQOOQQQQQQQOsOOQQQQQQQQQQQQQQQQQQQQQQQQQQQ",
    "QQQOOOQQOOQOOOMMMMMOOQOOOOOOQQQQQQOOsOQQQQQQQQQQQQQQQQQQQQQQQQQQ",
    "QQQOOOQQOOQQOOMMMMM[OOOOOOOOQQQQQQQQOQQQQQQQQQQQQQQQQQQQQQQQQQQQ",
    "QQQQQQOOOOOOOMMMOO[s[OQQQQOOQOQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ",
    "QQQQQQQOOOOOMOMMOOM[MMQQOOOOOsOQQQOQQQQQQQ]QQQQQQQQQQQQQQQQQQQQQ",
    "QQQQQQQQQMQQOOOMMMMMOOMM[OOOQOQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ",
    "QQQQQQQQQQ]QOOOOMMMMOOMMMOOOQQQQQQOQQSQQQQQQQQQQQQQQQQQQQQQQQQQQ",
    "QQQQQQQQQQQQOOOMOMMMMM[OMMOQOOOOQQSQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ",
    "QQQSQQQQQQQQOOOOOO[MMMOOMMOOOOOOQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ",
    "QQQQQQQQQQQQQQQQOOOOMMMMMMMMMOQQOOOOOOQQQQQQQQQQQQQQQQQQQQQQQQQQ",
    "QQQQQQQQQQQQQQQQOOOO[MM[MMMMSMQQOOOOOOQQQQQQQQQQQQQQQQ]QQQQQQQQQ",
    "QQQQQQQQQQQQQQOOQQOOOOOMOOOOMMMOOOQQOOOOQQQQQQQQQQQQQQSQQQQQQQQQ",
    "QQOQQQQQQQQQQQQOQQQOOSOOOOOOM[MM[OMQOOOOQQQQQQQQQQQQQOsOQQQQQQQQ",
    "QOwOQQQQQQQQQQQQQQOOOOOOOMMMMM[MMMOOQQQQOOOQQQQQQQQ]SswsS]QQOQQQ",
    "OQOQQQQQQQQQQSQQQQOOOOOOOOMMMMMMM]OOQQQQOOOOQQQQQQQQQOsOQQQOsOQQ",
    "wOQQQQQQQQQQQQQQQQQOOOQOOOOOMMMMMSMOOOOOQQQQQQQQQQQQQQSQSQQOsOQO",
    "OQQQQQQQQQQQQQQQQQQQQOQQOOQQMMMM[s[MOOOOQQQQOQQQQQQQQQ]QQQQQOQQQ",
    "QQQQOQQQQQQQSQQQQQQQQQQQQQOOOM]SswsS]OQQOOQQQQQQQQQQQQQ]QQQOQQQQ",
    "QQQOsOQQQQQOsOQQQQQQQQQQQQOOOOOO[sMOMMQQOOQQOQQQQQQQQQQQQQOsOQQQ",
    "QQQQOQQQQQSswsSQQQQQQQQQQQQQOOQOMSOO[M[OQQOMsOOOQQQQQQQQQQQOQQQQ",
    "QQOQQQQQQQQOsOQQQQQQQQQQQQQQQOQQM]OOMMMOQQOO[QOOQQQQQQQQQQQQQQQQ",
    "QOwOQQQQQQQQSQQQQQQQQQQQQSOOOOOOOMMMMMOQOOOOQQQQQQQQQQQQQQQQQQQQ",
    "QQOQQQQQQQQQQQQQQQQQQQQQQQOOOOOOOOMMMMOQMOOOQQOQQQQQQQQQQQQQQQQQ",
    "QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQOOQQOMMMMMOQOOQQOOOOQQQQQQQQQQQQQQ",
    "QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQOOQQO[MMMMOOOOOQOOOOQQQQQQQQQQQQQQ",
    "QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQOOMQM[MMMMSOOQOOQQOOQQQQQQQQQQQQ",
    "QQQQQQQQQQQQ]QQQQQQQQQQQQQQQQQQQOOQQOMMMMMMMOOOOOQOOQQQQQQQQQQQQ",
    "QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQOQOMM[MMMMOOOMOOOQQQQQQQQQQQQ",
    "QQQQQQQQQQQQQQQQQQQQQQQQQQQQQOQQQQQQQOMMMMMMMMOMwMOOOQQQQQQQQQQQ",
    "QQQQQQQQQQQQQQQQQQQQQQQQQQQQOwOQOOQQOOO[MMOOMMMOMQOOSQQQQQQQQQQQ",
    "QQQQQQQQQQQQQQQQQQQQQQQQQQQQQOQQOOQ]QOOOMMOOMMMMOOOOQQQQQQQQQQQQ",
    "QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQOQSOOQOOM[M[[OOMOOOOOOQQQQQQQQQ",
    "QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQOsOOQQOOMM[sMOMMOOOOOOQQQQQQQQ",
    "QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ]SswsS]OQQOMM[OOOOMOOOMOQQOOQQOQ",
    "QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQOsMOOOQMOOMMOOOO[MOOOOOQOOOQOO",
    "QQQQQQQQQQQQQQOQQQQQQQQQQQQQQQQQQQQSOOQQQQQQOMOOMMOQMOOOOOOOMQQQ",
    "QQQQQQQQQQQQQOsOQQQQQQQQQQQOQQQQQQQ]QOQQQQQQOOOOMMOOMMMOOOOOQQQQ",
    "QQQQQQQQQQQQQQOQQQQQQQQQQQOwOQQQQQQQQQQQQQOOQQOMMMMM[[OOOOOOQQQQ",
    "QQQQQQQQQQQQQQQQQQQQQQQQQQQOQQQQQQQQQQQQQQOOQQOOMM[MMMOOMOOOQQQQ",
    "OOMQOQQ]QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQOOQOOOOOOMMMMMM[MMMOOQQQ",
    "OO]OOOQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQOQQOOOOO[OMMM[s[MMMOOQQ",
    "QQQQQQQQQQQQ]QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQOOOOOOOOMMO[OOMMQQOO",
    "QQOQQQQQQQQQQQQQQQQQQQQQQQQ]QQQQQQQQQQQQQQQQOOQOOOOOOMOOOOMMOOOO",
    "QMOOQQQQQQQQQQQQQQQQQOQQQQ]QQQQQQQQQQQQQQQQQQQQQQQQQQOO[OOMMSSMO",
    "QQOOOQQQQQQQQQQQQQQQOwOQQQSQQQQQQQQQQQQQQ]QQQQQQQQQQQQOOQOMMMMMM",
    "MMQQMQOOOOQQQQQQQQQQQOQQQOsOQQQQ]QQQQQQQQQQQQQQQOOOOQQQQOOMMOOMM",
    "MMQOwMOMMOOQQQQQQQQQQQQ]SswsS]QQQQQQQQQQQQQQQQQQQOOOQQQQMOMMOOMM",
    "MMMOMOQOsOQQQQQQQQQQQ]QQQOsOQQQQQQQQQQQQQQQQQQQQOQQQQQQOOOOMMMMM",
    "MMMMOOQQMQQQQQQQQQQQQQQQQQSQQQQQQQQQQQQQQQQQQQQOsOQQQQQQOOOOM]MM",
    "OOOOMOOOOOQQOQQQQQQQQQQQQQ]QQQQQQQQQQQQQQQQQQQQQOQQQ]OQQQMOOOMMM",
    "OMOO[MOMOO]QOOQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQOQQQQOOOOMM",
    "O][MOOMOQQOOQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQOOOOM",
    "QSMM[OMOQQOSQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ]QQOOOO",
    "Ms[SMMMMOOQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQSQQQQQQQQQQQQQOOQO",
    "swsS][MMMOQQQSQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQOO]S",
    "MsMMOOOOMMOOOQQQOOOQQQQQQQQQQQQQQQQQQQQQQQOQQQQQQQQQQQQQQQQQQOOO",
    "OSOMQOOOMM[OOMQMO]OOQQQQQQQQQQQQQQQQQQQQQOwOQQQQQQQQQQQQQQQQQQOO",
    "Q]QOMM[MMMOQOsMOOOOOOQQQQQQQQQQQQQQQQQQQQQOQQQQQQQQQQQQQQQQQQQOO",
    "QQQQOMMMMMOQOOOOOOOOOOQQQQQQQQQQQQQQQQQQQQQQQ]QQQQQQQQQQQQQQQQOO",
    "OOOOOOMMMMMMOQQQQQQOOQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ]QQQQQQQQQQQOO",
    "OOOOMOMMMMMMOQQQQQOsMOQQQQQQQQQQQQQQQQQQQQOQQQQQQQQQQQQQQQQQQQQO"
   ]
  },
  "starfield_32": {
   "key": "starfield_32",
   "name": "fxstar_starfield_32",
   "id": "sky/fxstar/starfield_32",
   "label": "Ciel étoilé, tuile (32 px)",
   "kind": "sprite",
   "w": 32,
   "h": 32,
   "size": 32,
   "props": {
    "shape": "starfield",
    "color": "night"
   },
   "tags": [
    "background",
    "tile",
    "seamless"
   ],
   "png": "library/png/sky/fxstar/starfield_32.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAGFBMVEUPFjQbJlIHChxidZ+Po8fT4PL7+/8+S3IAx+CkAAAA8UlEQVR42n1TWbbFIAwC1Lr/Hb+TwenWvny1iiSQBABISpQEqWhEbU+rdgaBhF0D2gMN8UgCO2EAahw5x/yzLLD7BxKeg2iwOIkxJM0B8KAFvJLFUCYAHvRM2yttAPtykjugjloJ4VJDSJ5qXoA0bZF8MUj8AEQNWWwU+vJhApRa74BVBb4BKRb/A3AFlIHovAHqZnvED2AMgncDgwSbaEw/onHRWbTNuXC0rPnwkV159p64mF5CLk6GiejNxvAQWk9HOomf5r08i5UQPhDZmmPMykoVMn0zb1FjYXLtrhka0jPk4qKcFMgs7LFPy4WN4A/JMwa/sGOENwAAAABJRU5ErkJggg==",
   "palette": {
    "M": "#1b2652",
    "O": "#0f1634",
    "Q": "#070a1c",
    "S": "#8fa3c7",
    "[": "#3e4b72",
    "]": "#62759f",
    "s": "#d3e0f2",
    "w": "#fbfbff"
   },
   "rows": [
    "OOOMMMQQMQQQOQQ]QQQQQQQQQSswsSQQ",
    "QOQOMMOQQQOOOQQQQQQQQQQQQQOsOQQQ",
    "QQQQOM[MOQOOOMQQQQOQQQQQQQQSQQQQ",
    "QQQQOOMMOOOOMwOQQOwOQQQQQQQQQQQQ",
    "QQQOQQQOM[MOOMQQOOMQQQQQQQQQQQQQ",
    "QQQQQQQQMMMMMOQQOOOOQQQQQQQQQ]QQ",
    "QQQQQQOOOOOOMMMOOOQQOQQQQQQQQQQQ",
    "QQQQQQOOQOQQMMMMOOQQOQQQQQQQQQQQ",
    "QQQQQQSQQQQOOMMMOQOQQQQQQQQQQQQQ",
    "QQQQQOsOQQQQOOMMOOOOQQQQQQQQQQQQ",
    "QQQQSswsSQQQQQOOMMMOQQQQQQQQQQQQ",
    "QQQQQOsOQQQQQQMOMMMOQQQQQQQQQQQQ",
    "QQQQQQSQQQQQQQOOQOMMOOQQQQQQQQQQ",
    "QQQQQQQQQQQQQQOOQQMMOOOQQQQQQQQQ",
    "QQQQQQQQQQQQQQQQOOMMMOQQOQQQQQQQ",
    "QQQQQQQQQQQQQQQQOOOMMMOQOOQQQQQQ",
    "QQQQQQQQQQQQQQQQOOOMMMOOOOQQQQQQ",
    "QQQQQQQQQQQQ]QQQQOOOM[MOOOQQQQQQ",
    "QQQQQQQQQQSOQQQQQQOOQOOOOOOOQQQQ",
    "QQQQQQQQQQOwOQQQQQOOQQOO[MOOOQQQ",
    "MOOQQQQQQQQOQQSQQQQQQOQQMMMOOOQQ",
    "OsMOQQQQQQQQQOsOQQQ]QQQQMMMMMOOQ",
    "QOQQOQQQQQQQSswsSQQQQQOOOOMMM[]Q",
    "OQQQOQQQQQQQQOsOQQQQQQQOOOOM[sMO",
    "MOQQQQQQQQQQQQSQQQQQQQQQQQOOO[MM",
    "MMOQQQQQQQQQQQQQQQQQQQQQQQQOOOMM",
    "M[MOQQOQQQQQQQQQQQQQQQQQQQQQOOQO",
    "MMMOOQOQQQQQQQQQQ]QQQQSQQQQQOOQQ",
    "OMMMQQQQQQQQQQQQQQQQQQQQQQSQOQQQ",
    "OM[MOQOQQQQQQQQQQQQQQQQQQQQOsOQQ",
    "QQMMOQOOOQQQO]QQQQQQQQQQQQQSOQQO",
    "QQOM[QOOOOQOsOQQQQQQQQQQQQOsOQQO"
   ]
  }
 }
};
export default asset;
