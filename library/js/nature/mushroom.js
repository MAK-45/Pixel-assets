// GÉNÉRÉ par scripts/build.js — ne pas modifier. Source : assets/nature/mushroom.px.js
// Champignon — 7 variante(s). Usage :
//   import asset from "./mushroom.js"; const v = asset.variants["amanita_16"];
//   v.src (data URL PNG), v.rows + v.palette (pixels, "." = transparent), v.w, v.h
/** @type {import("../../index.d.ts").PixelAsset} */
export const asset = {
 "id": "nature/mushroom",
 "slug": "mushroom",
 "category": "nature",
 "title": "Champignon",
 "description": "Champignons poussant au sol, vus de face : amanite tue-mouches rouge à points blancs, cèpe brun, girolle orangée, touffe de petits champignons beiges, champignon magique bleu lumineux et violet (16 px), grande amanite (32 px). Lumière en haut à gauche, contour sombre.",
 "tags": [
  "mushroom",
  "fungus",
  "toadstool",
  "plant",
  "ground",
  "forest",
  "undergrowth",
  "nature",
  "decoration"
 ],
 "order": 0,
 "source": "assets/nature/mushroom.px.js",
 "module": "library/js/nature/mushroom.js",
 "sheet": {
  "png": "library/sheets/nature/mushroom.png",
  "json": "library/sheets/nature/mushroom.json"
 },
 "axes": {
  "species": [
   "amanita",
   "bolete",
   "chanterelle",
   "cluster",
   "magic"
  ],
  "color": [
   "red",
   "brown",
   "orange",
   "tan",
   "blue",
   "purple"
  ]
 },
 "sizes": [
  16,
  32
 ],
 "variantCount": 7,
 "variants": {
  "amanita_16": {
   "key": "amanita_16",
   "name": "mushroom_amanita_16",
   "id": "nature/mushroom/amanita_16",
   "label": "Amanite tue-mouches",
   "kind": "sprite",
   "w": 16,
   "h": 15,
   "size": 16,
   "props": {
    "species": "amanita",
    "color": "red"
   },
   "tags": [
    "poison"
   ],
   "png": "library/png/nature/mushroom/amanita_16.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAPCAMAAADarb8dAAAAHlBMVEUAAAAaFCPgeCr7+/+yOizT4PJuHySPo8cuejofSizbNAAmAAAAAXRSTlMAQObYZgAAAFNJREFUeNp9j1EKwCAMQ02a6nb/C4/WKhPG3l8ewdjWvkHwjqRRW4EkZZKwskVSGZDyTD4NslyVnmIkPcGaNB/HNMwcx8ei8SPWGztf9wTHaTXxANEOAcdjtJ0UAAAAAElFTkSuQmCC",
   "palette": {
    "G": "#1f4a2c",
    "R": "#6e1f24",
    "S": "#8fa3c7",
    "g": "#2e7a3a",
    "k": "#1a1423",
    "o": "#e0782a",
    "r": "#b23a2c",
    "s": "#d3e0f2",
    "w": "#fbfbff"
   },
   "rows": [
    "................",
    "......kkkkk.....",
    "....kkooworkk...",
    "...koooorwrrrk..",
    "..koowwrrrrrrrk.",
    ".koorsrrrrrsrrrk",
    ".krwrrrwrrrrrrRk",
    ".krSSSSSSRRRRRRk",
    "..kkkkkwsSkkkkk.",
    "......kwwsk.....",
    "......kwsSk.....",
    "......kwsSk.....",
    "....kkkwsSkk....",
    "...kgGGGGGGGk...",
    "....kkkkkkkk...."
   ]
  },
  "bolete_16": {
   "key": "bolete_16",
   "name": "mushroom_bolete_16",
   "id": "nature/mushroom/bolete_16",
   "label": "Cèpe",
   "kind": "sprite",
   "w": 16,
   "h": 15,
   "size": 16,
   "props": {
    "species": "bolete",
    "color": "brown"
   },
   "tags": [
    "edible"
   ],
   "png": "library/png/nature/mushroom/bolete_16.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAPCAMAAADarb8dAAAAG1BMVEUAAAAaFCOcazxqQSg7Ihnzw0r/8KjJmlsfSixOYCLnAAAAAXRSTlMAQObYZgAAAEtJREFUeNqNjzEOwDAIxLgjLfz/xVEICahTvdkDJ0R+gkVXkqo3bV3guB4QrsWACPQJRoBceM2MbSlD2/0EWIQqdSPdLaA72if5zgSmxwGyUxduKwAAAABJRU5ErkJggg==",
   "palette": {
    "B": "#3b2219",
    "G": "#1f4a2c",
    "N": "#c99a5b",
    "Y": "#fff0a8",
    "b": "#6a4128",
    "k": "#1a1423",
    "n": "#9c6b3c",
    "y": "#f3c34a"
   },
   "rows": [
    "................",
    "................",
    "......kkkkk.....",
    "....kknnnbbkk...",
    "...knnnbbbbbbk..",
    "..knnbbbbbbbbbk.",
    ".knbbbbbbbbbbbBk",
    ".kbyyyyyyBBBBBBk",
    "..kkkkYNNNnkkkk.",
    ".....kYNNNnk....",
    ".....kYNNNnk....",
    "....kNYNNNnnk...",
    "....kkYNNNnkkk..",
    "...kGNNNNNNnGGk.",
    "....kkkkkkkkkk.."
   ]
  },
  "chanterelle_16": {
   "key": "chanterelle_16",
   "name": "mushroom_chanterelle_16",
   "id": "nature/mushroom/chanterelle_16",
   "label": "Girolles",
   "kind": "sprite",
   "w": 16,
   "h": 12,
   "size": 16,
   "props": {
    "species": "chanterelle",
    "color": "orange"
   },
   "tags": [
    "edible"
   ],
   "png": "library/png/nature/mushroom/chanterelle_16.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAMCAMAAABcOc2zAAAAGFBMVEUAAAAaFCPzw0r/8KjgeCqyOiwuejofSiw4s9SGAAAAAXRSTlMAQObYZgAAAEhJREFUeNpVj1sOwDAIwxIauvvfeAp9jPnPVlBVgAYfjBERrdAe6kXlxL1kuSjt3Q4meQOYx4F1S/vvfSVZ24ODR/Pp9MX6wwtf1QE6ppO1bwAAAABJRU5ErkJggg==",
   "palette": {
    "G": "#1f4a2c",
    "Y": "#fff0a8",
    "g": "#2e7a3a",
    "k": "#1a1423",
    "o": "#e0782a",
    "r": "#b23a2c",
    "y": "#f3c34a"
   },
   "rows": [
    ".kkkkk..........",
    "kyYyyyk.........",
    "kYyyyyok........",
    ".koyyok.k.kkk...",
    "..kyok.kokoook..",
    "..kyok.kooooork.",
    "..kyok..kroork..",
    "...kk....kork.k.",
    ".........korkkok",
    ".kkkkkkkkkorkkrk",
    "kgGGGGGGGGGGGGGk",
    ".kkkkkkkkkkkkkk."
   ]
  },
  "cluster_16": {
   "key": "cluster_16",
   "name": "mushroom_cluster_16",
   "id": "nature/mushroom/cluster_16",
   "label": "Touffe de petits champignons",
   "kind": "sprite",
   "w": 16,
   "h": 14,
   "size": 16,
   "props": {
    "species": "cluster",
    "color": "tan"
   },
   "tags": [],
   "png": "library/png/nature/mushroom/cluster_16.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAOCAMAAAAR8Wy4AAAAFVBMVEUAAAAaFCPJmlucazxqQSj/8KgfSizs7hLfAAAAAXRSTlMAQObYZgAAAFFJREFUeNpVjVEOwDAIQkXY7n/kRbGpox8Vgs+IFoDYQibx8yRXYk+ePaCcpHQLTybruTV9W0kI97MAA+mpruJSTzDUG5DyTgf1+ey7xKFexQeXoAGBM/Su2QAAAABJRU5ErkJggg==",
   "palette": {
    "G": "#1f4a2c",
    "N": "#c99a5b",
    "Y": "#fff0a8",
    "b": "#6a4128",
    "k": "#1a1423",
    "n": "#9c6b3c"
   },
   "rows": [
    "......kkk.......",
    ".....kNNnk......",
    "....kNnnnnk.....",
    "...kNnnnnnnkkk..",
    "..kknnnnbbbNnnk.",
    ".kYNNnNnNnnnnnnk",
    "kNnnnnNnnnnnbbbk",
    "knnnnbNnkkknkkk.",
    ".kkknkNnk.knkkk.",
    "...knkNnk.knNnnk",
    "...knkNnk.knnnbk",
    "..kknkNnkkknknk.",
    ".kGGGGGGGGGGGGnk",
    "..kkkkkkkkkkkkk."
   ]
  },
  "magic_blue_16": {
   "key": "magic_blue_16",
   "name": "mushroom_magic_blue_16",
   "id": "nature/mushroom/magic_blue_16",
   "label": "Champignon magique bleu (lumineux)",
   "kind": "sprite",
   "w": 16,
   "h": 15,
   "size": 16,
   "props": {
    "species": "magic",
    "color": "blue"
   },
   "tags": [
    "magic",
    "glow",
    "fantasy"
   ],
   "png": "library/png/nature/mushroom/magic_blue_16.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAPCAMAAADarb8dAAAAHlBMVEUAAAAaFCNPj+AvT7Of0P/7+/8dKmvT4PKPo8cfSixA1upbAAAAAXRSTlMAQObYZgAAAFNJREFUeNptj1EOwDAIQgtou93/wouadu2y5xcoCbb2D4Jdk6Swa5OJeLUrwTRMEjVDYK1tnoCRz+llyIIeYJXwMY4q8HHhaPoxkMYWuAucv9XFA6J1AYUt6/jfAAAAAElFTkSuQmCC",
   "palette": {
    "G": "#1f4a2c",
    "I": "#9fd0ff",
    "S": "#8fa3c7",
    "U": "#1d2a6b",
    "i": "#4f8fe0",
    "k": "#1a1423",
    "s": "#d3e0f2",
    "u": "#2f4fb3",
    "w": "#fbfbff"
   },
   "rows": [
    "................",
    "......kkkkk.....",
    ".....kiiiiuk....",
    "....kiiIuIuik...",
    "...kiiwuuuuuuk..",
    "...kiIuuuiuiuk..",
    "..kiuuuuuuIuuuk.",
    "..kiuIuiuiuiuUk.",
    "..kuIIIIIUUUUUk.",
    "...kkkkwsskkkk..",
    "......kwsSk.....",
    "......kwsSk.....",
    ".....kkwsSkk....",
    "....kGGGGGGGk...",
    ".....kkkkkkk...."
   ]
  },
  "magic_purple_16": {
   "key": "magic_purple_16",
   "name": "mushroom_magic_purple_16",
   "id": "nature/mushroom/magic_purple_16",
   "label": "Champignon magique violet (lumineux)",
   "kind": "sprite",
   "w": 16,
   "h": 15,
   "size": 16,
   "props": {
    "species": "magic",
    "color": "purple"
   },
   "tags": [
    "magic",
    "glow",
    "fantasy"
   ],
   "png": "library/png/nature/mushroom/magic_purple_16.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAPCAMAAADarb8dAAAAHlBMVEUAAAAaFCO3fuB6P7D/s8/7+/8/H2PT4PKPo8cfSiw4R3VwAAAAAXRSTlMAQObYZgAAAFFJREFUeNptj1EOwDAIQgvUdrv/hRc17eqy5xcoCbb2D5xTk6RQtLqIV5sCbEMStUJgrvs6QeRjRhrqznCwS9icpQpsXihNPwbCOAJ3gvpbXjyfpQGB/UIbwwAAAABJRU5ErkJggg==",
   "palette": {
    "G": "#1f4a2c",
    "S": "#8fa3c7",
    "V": "#3f1f63",
    "Z": "#ffb3cf",
    "k": "#1a1423",
    "s": "#d3e0f2",
    "v": "#7a3fb0",
    "w": "#fbfbff",
    "x": "#b77ee0"
   },
   "rows": [
    "................",
    "......kkkkk.....",
    ".....kxxxxvk....",
    "....kxxxvZvxk...",
    "...kxxwvvvvvvk..",
    "...kxxvvvxvxvk..",
    "..kxvvvvvvZvvvk.",
    "..kxvZvxvxvxvVk.",
    "..kvZZZZZVVVVVk.",
    "...kkkkwsskkkk..",
    "......kwsSk.....",
    "......kwsSk.....",
    ".....kkwsSkk....",
    "....kGGGGGGGk...",
    ".....kkkkkkk...."
   ]
  },
  "amanita_32": {
   "key": "amanita_32",
   "name": "mushroom_amanita_32",
   "id": "nature/mushroom/amanita_32",
   "label": "Grande amanite (32 px)",
   "kind": "sprite",
   "w": 28,
   "h": 32,
   "size": 32,
   "props": {
    "species": "amanita",
    "color": "red"
   },
   "tags": [
    "poison"
   ],
   "png": "library/png/nature/mushroom/amanita_32.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAgCAMAAAA2a+hwAAAAIVBMVEUAAAAaFCPgeCqyOiz7+//zw0rT4PJuHySPo8cuejofSiwyUXt3AAAAAXRSTlMAQObYZgAAAJRJREFUeNrVk0sSxCAIBX2BAcP9DzwVFfGX5Symd9IFKJQp/RxUzuqq7LorIqZF41MMM1MBu7uYhVYbJQMMjpkn1y2mgkQiIbGWrLJauPKrjnXhaQeJp2GEam8hUkVKaClzGqnLHVWXeUAHEJsCWB5yP0/Dd3naJzfkYCGNl9R39z+yTCveOY0Ot5lJJ5sZtl8yUMJf2ugG3usJMpgAAAAASUVORK5CYII=",
   "palette": {
    "G": "#1f4a2c",
    "R": "#6e1f24",
    "S": "#8fa3c7",
    "g": "#2e7a3a",
    "k": "#1a1423",
    "o": "#e0782a",
    "r": "#b23a2c",
    "s": "#d3e0f2",
    "w": "#fbfbff",
    "y": "#f3c34a"
   },
   "rows": [
    "............................",
    "............................",
    "............................",
    "...........kkkkkkk..........",
    ".........kkoooooookk........",
    ".......kkooooooorrwrkk......",
    "......kyooooowwwrrrrrrk.....",
    ".....kyoooooowwsrrrrrrrk....",
    "....kooooooorrrrrrrrrrrrk...",
    "...kooowwworrrrrrrrrrrrrrk..",
    "...kooowwsrrrrrrrrrssrrrrk..",
    "..kooooorrrrrrrrrrrssrrrrrk.",
    "..kooorrrrrwwrrrrrrrrrrrrrk.",
    "..koorrrrrrwwrrrrrrrrrrrrrk.",
    ".koowwrrrrrrrrrrwsrrrrsrrRRk",
    ".krrwwrrrwrrrrrrrrrrrrrrRRRk",
    ".krrrrrrrrrrrrrrrrrrrrRRRRRk",
    ".krSSSSSSSSSSSSRRRRRRRRRRRRk",
    "..kkkkkkkkkwsssssSkkkkkkkkk.",
    "..........kwsssssSk.........",
    ".........kwwwwwwwwsk........",
    ".........kssssssssSk........",
    "..........kwsssssSk.........",
    "..........kwsssssSk.........",
    "..........kwsssssSk.........",
    "..........kwsssssSk.........",
    "..........kwsssssSk.........",
    "..........kwsssssSk.........",
    "..........kwsssssSk.........",
    ".....kkkkkssssssssSkkkk.....",
    "....kgGGGssssssssssSGGGk....",
    ".....kkkkkkkkkkkkkkkkkk....."
   ]
  }
 }
};
export default asset;
