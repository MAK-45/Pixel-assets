// GÉNÉRÉ par scripts/build.js — ne pas modifier. Source : assets/nature/bush.px.js
// Buisson — 11 variante(s). Usage :
//   import asset from "./bush.js"; const v = asset.variants["round_16"];
//   v.src (data URL PNG), v.rows + v.palette (pixels, "." = transparent), v.w, v.h
/** @type {import("../../index.d.ts").PixelAsset} */
export const asset = {
 "id": "nature/bush",
 "slug": "bush",
 "category": "nature",
 "title": "Buisson",
 "description": "Buissons posés au sol, vus de face pour décors 2D : buisson rond (16, 32 px), haie taillée (48 px), en versions été, à baies rouges, en fleurs, automne, enneigé et sec sans feuilles. Lumière en haut à gauche, contour sombre.",
 "tags": [
  "bush",
  "shrub",
  "plant",
  "vegetation",
  "ground",
  "nature",
  "decoration",
  "foliage"
 ],
 "order": 0,
 "source": "assets/nature/bush.px.js",
 "module": "library/js/nature/bush.js",
 "sheet": {
  "png": "library/sheets/nature/bush.png",
  "json": "library/sheets/nature/bush.json"
 },
 "axes": {
  "shape": [
   "round",
   "hedge"
  ],
  "season": [
   "summer",
   "autumn",
   "spring",
   "winter"
  ],
  "feature": [
   "plain",
   "berries",
   "flowers",
   "snow",
   "bare"
  ]
 },
 "sizes": [
  16,
  32,
  48
 ],
 "variantCount": 11,
 "variants": {
  "round_16": {
   "key": "round_16",
   "name": "bush_round_16",
   "id": "nature/bush/round_16",
   "label": "Petit buisson (16 px)",
   "kind": "sprite",
   "w": 16,
   "h": 13,
   "size": 16,
   "props": {
    "shape": "round",
    "season": "summer",
    "feature": "plain"
   },
   "tags": [],
   "png": "library/png/nature/bush/round_16.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAANCAMAAACXZR4WAAAAElBMVEUAAAAaFCMuejofSixarkWl11q3NalqAAAAAXRSTlMAQObYZgAAAEhJREFUeNptjkEOwAAIwgTc/7+8oEZ3WG80okb8A/PNJKUzyCfPAGBm7gwcVJG0KTGVMi2mUoLkCm+B+02LgKTNfUcH7m/M9y+EVwFpFj1yUAAAAABJRU5ErkJggg==",
   "palette": {
    "G": "#1f4a2c",
    "L": "#a5d75a",
    "g": "#2e7a3a",
    "k": "#1a1423",
    "l": "#5aae45"
   },
   "rows": [
    "................",
    "......kkkkk.....",
    ".....kgggGGk....",
    "....klLlggGGk...",
    ".kkkglllgggGGk..",
    "klllgGgggGGggGk.",
    "klllglLlggGGggGk",
    "klllglllgggGGgGk",
    "kgggglllgggGGGGk",
    "kGgggggggggGGGGk",
    ".kGGGgggggGGGGGk",
    "..kGGGGGGGGGGGk.",
    "...kkkkkkkkkkk.."
   ]
  },
  "berry_16": {
   "key": "berry_16",
   "name": "bush_berry_16",
   "id": "nature/bush/berry_16",
   "label": "Petit buisson à baies (16 px)",
   "kind": "sprite",
   "w": 16,
   "h": 13,
   "size": 16,
   "props": {
    "shape": "round",
    "season": "summer",
    "feature": "berries"
   },
   "tags": [
    "berry",
    "fruit"
   ],
   "png": "library/png/nature/bush/berry_16.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAANCAMAAACXZR4WAAAAG1BMVEUAAAAaFCMuejofSixarkWl11rgeCqyOixuHySs+ymtAAAAAXRSTlMAQObYZgAAAFRJREFUeNptjksSgDAIQ5uPhfuf2IE64sLs8oCQtf6F0teTlIbAl4cA2GG/O7Ad2ZYsUoB9sqPJAXUSqQYk6ZpSqhSoyEnZ0SFSM0qR549GmN542t+a3AGrbwGAAwAAAABJRU5ErkJggg==",
   "palette": {
    "G": "#1f4a2c",
    "L": "#a5d75a",
    "R": "#6e1f24",
    "g": "#2e7a3a",
    "k": "#1a1423",
    "l": "#5aae45",
    "o": "#e0782a",
    "r": "#b23a2c"
   },
   "rows": [
    "................",
    "......kkkkk.....",
    ".....kgggGGk....",
    "....klLlggGGk...",
    ".kkkorllgggGGk..",
    "klllrRgggGGggGk.",
    "klllglLlggorggGk",
    "klllglllggrRGgGk",
    "kgggglorgggGGGGk",
    "kGggggrRgggGorGk",
    ".kGGGgggggGGrRGk",
    "..kGGGGGGGGGGGk.",
    "...kkkkkkkkkkk.."
   ]
  },
  "autumn_16": {
   "key": "autumn_16",
   "name": "bush_autumn_16",
   "id": "nature/bush/autumn_16",
   "label": "Petit buisson d'automne (16 px)",
   "kind": "sprite",
   "w": 16,
   "h": 13,
   "size": 16,
   "props": {
    "shape": "round",
    "season": "autumn",
    "feature": "plain"
   },
   "tags": [],
   "png": "library/png/nature/bush/autumn_16.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAANCAMAAACXZR4WAAAAElBMVEUAAAAaFCOyOixuHyTgeCrzw0puYCJoAAAAAXRSTlMAQObYZgAAAEhJREFUeNptjkEOwAAIwgTc/7+8oEZ3WG80okb8A/PNJKUzyCfPAGBm7gwcVJG0KTGVMi2mUoLkCm+B+02LgKTNfUcH7m/M9y+EVwFpFj1yUAAAAABJRU5ErkJggg==",
   "palette": {
    "R": "#6e1f24",
    "k": "#1a1423",
    "o": "#e0782a",
    "r": "#b23a2c",
    "y": "#f3c34a"
   },
   "rows": [
    "................",
    "......kkkkk.....",
    ".....krrrRRk....",
    "....koyorrRRk...",
    ".kkkrooorrrRRk..",
    "kooorRrrrRRrrRk.",
    "koooroyorrRRrrRk",
    "kooorooorrrRRrRk",
    "krrrrooorrrRRRRk",
    "kRrrrrrrrrrRRRRk",
    ".kRRRrrrrrRRRRRk",
    "..kRRRRRRRRRRRk.",
    "...kkkkkkkkkkk.."
   ]
  },
  "round_32": {
   "key": "round_32",
   "name": "bush_round_32",
   "id": "nature/bush/round_32",
   "label": "Buisson rond",
   "kind": "sprite",
   "w": 32,
   "h": 21,
   "size": 32,
   "props": {
    "shape": "round",
    "season": "summer",
    "feature": "plain"
   },
   "tags": [],
   "png": "library/png/nature/bush/round_32.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAVCAMAAAAQExzYAAAAElBMVEUAAAAaFCMuejofSixarkWl11q3NalqAAAAAXRSTlMAQObYZgAAAJVJREFUeNp1kksOACEIQ63g/a884WPFMHZDYp8FjGNUwTWewjQJ3r6qvgiLnqoridYowzUieiOGe9FGlHDztREeEIAYkE0OgXNL0rwAwPpmBKsB4AbCKWKOmgFdduJD8LaZLrB/+ItEA2YEcJcCHP0Dwr34RiLbdyA7liS3ZgJGbFWfCZsA5DJAPz+aF7rg6fj5k9fxB9kSBNdbVEqFAAAAAElFTkSuQmCC",
   "palette": {
    "G": "#1f4a2c",
    "L": "#a5d75a",
    "g": "#2e7a3a",
    "k": "#1a1423",
    "l": "#5aae45"
   },
   "rows": [
    ".............kkkkkk.............",
    "............kgggggGk............",
    "...........kglllgggGk...........",
    ".......kkkkgllLllgggGkkkk.......",
    "......kgggggGllllgggggggGk......",
    ".....kglllgggGlllgglgggggGk.....",
    "....kgllLllgggGlgglllgggggGk....",
    "....kglllllgggGGggllggggggGGk...",
    "....kglllgggggGGggggggGgggGGk...",
    "...kkgglglllgggGglllgggGggGGkk..",
    "..kgggGgllLllgggggGlggggGgggGGk.",
    ".klLlgggllllglllgggGggggGGGGGGGk",
    "kglllggglllgllLllgggGgggGGGGGGGk",
    "kglllggggllglllllgggGGggGGGGGGGk",
    "kggggggggggglllllgggGGggGGGGGGGk",
    "kGgggggGggggglllggggGGgGGGGGGGGk",
    "kGGgggGGGgggggggggggGGGGGgGGGGGk",
    ".kGGGGGGGGGGgggggggGGGGGGGGGGGGk",
    "..kGGGGGkkGGGGGGGGGGGGGkkGGGGGk.",
    "...kkkkk..kkkGGGGGGGkkk..kkkkk..",
    ".............kkkkkkk............"
   ]
  },
  "berry_32": {
   "key": "berry_32",
   "name": "bush_berry_32",
   "id": "nature/bush/berry_32",
   "label": "Buisson à baies rouges",
   "kind": "sprite",
   "w": 32,
   "h": 21,
   "size": 32,
   "props": {
    "shape": "round",
    "season": "summer",
    "feature": "berries"
   },
   "tags": [
    "berry",
    "fruit"
   ],
   "png": "library/png/nature/bush/berry_32.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAVCAMAAAAQExzYAAAAG1BMVEUAAAAaFCMuejofSixarkWl11rgeCqyOixuHySs+ymtAAAAAXRSTlMAQObYZgAAALdJREFUeNp1klcOBDEIQ0MJcP8TrzCkjGaHnxQ/2aBkjLsINT6LOEvoW1fVLyKtWXU28Qpqcy2Ld9A2xwLGnJ56m6eOnYfR08A8AUkAGR4nhdhNPRpAB9jTnsDCVxdY3QQArQmgz/YWzfPxIJ0pYMLlAlHMk1gTlj43kXrcAJdBNYAOUgdwqoDwAlA0SPZczOqGQ6YfoBKLCAfgYcINJLFqvVPnN9AEXeA50vloWLZK+3b8+ZOP6x+8xgWUGQXVUQAAAABJRU5ErkJggg==",
   "palette": {
    "G": "#1f4a2c",
    "L": "#a5d75a",
    "R": "#6e1f24",
    "g": "#2e7a3a",
    "k": "#1a1423",
    "l": "#5aae45",
    "o": "#e0782a",
    "r": "#b23a2c"
   },
   "rows": [
    ".............kkkkkk.............",
    "............kgggggGk............",
    "...........kglllgggGk...........",
    ".......kkkkgllLllgggGkkkk.......",
    "......kgggggGllllgggggggGk......",
    ".....kglllgggGlllgglggggork.....",
    "....kgllLllgggGlgglllgggrRok....",
    "....kglllorgggGGggllgggggrRGk...",
    "....kgrolrRgggGGggggggGgggGGk...",
    "...kkoRrglllgggGglllgroGggGGkk..",
    "..kggRrgllLllgggggGlgRrgGgggGGk.",
    ".klLlgggllllglllgggGggggGGGorGGk",
    "kglllggglllgllLllgggGgggGGorRGGk",
    "kglllggggllglllllgroGGggGGrRGGGk",
    "kggggggggggglllllgRrGGggGGGGGGGk",
    "kGgggggGggggglroggggGorGGGGGGGGk",
    "kGGgggGGGgggggRrggggGrRoGgGGGGGk",
    ".kGGGGGGGGGGgggggggGGGrRGGGGGGGk",
    "..kGGGGGkkGGGGGGGGGGGGGkkGGGGGk.",
    "...kkkkk..kkkGGGGGGGkkk..kkkkk..",
    ".............kkkkkkk............"
   ]
  },
  "flowering_32": {
   "key": "flowering_32",
   "name": "bush_flowering_32",
   "id": "nature/bush/flowering_32",
   "label": "Buisson en fleurs (printemps)",
   "kind": "sprite",
   "w": 32,
   "h": 21,
   "size": 32,
   "props": {
    "shape": "round",
    "season": "spring",
    "feature": "flowers"
   },
   "tags": [
    "flower",
    "blossom"
   ],
   "png": "library/png/nature/bush/flowering_32.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAVCAMAAAAQExzYAAAAG1BMVEUAAAAaFCMuejr/s8/kapofSixarkXzw0ql11qNxoGEAAAAAXRSTlMAQObYZgAAALdJREFUeNp1kgEOhDAIBMvCov9/8QVo0eYqiTFhpwOajvEuyRqfJQCgJt+5qsGMJyLUcDfzkPwPKjnd3QG9FNg1cdj1SgJwDfxNRH67ajiAssSgXeAebgaALD4OqVOxBfNwPg8gAvhkWCuCCUh/AXOLmG3QlLEd4nd0con4EZWBVdLzKy8LTwASmItwA7rUjgCxdjKbMnLlCcyJj6lSTCCIVe+8DYsQ4RZI5/Oi5atT6e443Mmt/QPbAgauGAD2OQAAAABJRU5ErkJggg==",
   "palette": {
    "G": "#1f4a2c",
    "L": "#a5d75a",
    "Z": "#ffb3cf",
    "g": "#2e7a3a",
    "k": "#1a1423",
    "l": "#5aae45",
    "y": "#f3c34a",
    "z": "#e46a9a"
   },
   "rows": [
    ".............kkkkkk.............",
    "............kggggZzk............",
    "...........kgZZzgzzGk...........",
    ".......kkkkgllzzlgggZkkkk.......",
    "......kggggZGllllggZyZggGk......",
    ".....kglllZyZGlllgglZggggGk.....",
    "....kgllLlZZgZGlgglllggZggZk....",
    "....kglllllgZyZGggllggggggGGk...",
    "....kglllggggZGGggZgggZgggGGk...",
    "...kkgglglllgggGgZyZgggGggGGkk..",
    "..kgggGgllLllggZzgZlggggGgggGGk.",
    ".klLlgggllllgllzzggGggggGGGGGGGk",
    "kglllggglllgllLllggZGgggGGGGGGGk",
    "kglllggggllglllllgggGGggGGGGGGGk",
    "kggggggggggZzllllgggGGggGGGGGGGk",
    "kGgggggGgggzzlllggggGGgGGGGGGGGk",
    "kGGgggGGGgggggggggggGGGGGgGGGGGk",
    ".kGGGGGGGGGGgggggggGGGGGGGGGGGGk",
    "..kGGGGGkkGGGGGGGGGGGGGkkGGGGGk.",
    "...kkkkk..kkkGGGGGGGkkk..kkkkk..",
    ".............kkkkkkk............"
   ]
  },
  "autumn_32": {
   "key": "autumn_32",
   "name": "bush_autumn_32",
   "id": "nature/bush/autumn_32",
   "label": "Buisson d'automne",
   "kind": "sprite",
   "w": 32,
   "h": 21,
   "size": 32,
   "props": {
    "shape": "round",
    "season": "autumn",
    "feature": "plain"
   },
   "tags": [],
   "png": "library/png/nature/bush/autumn_32.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAVCAMAAAAQExzYAAAAElBMVEUAAAAaFCOyOixuHyTgeCrzw0puYCJoAAAAAXRSTlMAQObYZgAAAJVJREFUeNp1kksOACEIQ63g/a884WPFMHZDYp8FjGNUwTWewjQJ3r6qvgiLnqoridYowzUieiOGe9FGlHDztREeEIAYkE0OgXNL0rwAwPpmBKsB4AbCKWKOmgFdduJD8LaZLrB/+ItEA2YEcJcCHP0Dwr34RiLbdyA7liS3ZgJGbFWfCZsA5DJAPz+aF7rg6fj5k9fxB9kSBNdbVEqFAAAAAElFTkSuQmCC",
   "palette": {
    "R": "#6e1f24",
    "k": "#1a1423",
    "o": "#e0782a",
    "r": "#b23a2c",
    "y": "#f3c34a"
   },
   "rows": [
    ".............kkkkkk.............",
    "............krrrrrRk............",
    "...........krooorrrRk...........",
    ".......kkkkrooyoorrrRkkkk.......",
    "......krrrrrRoooorrrrrrrRk......",
    ".....krooorrrRooorrorrrrrRk.....",
    "....krooyoorrrRorrooorrrrrRk....",
    "....krooooorrrRRrroorrrrrrRRk...",
    "....krooorrrrrRRrrrrrrRrrrRRk...",
    "...kkrrorooorrrRrooorrrRrrRRkk..",
    "..krrrRrooyoorrrrrRorrrrRrrrRRk.",
    ".koyorrroooorooorrrRrrrrRRRRRRRk",
    "krooorrrooorooyoorrrRrrrRRRRRRRk",
    "krooorrrroorooooorrrRRrrRRRRRRRk",
    "krrrrrrrrrrrooooorrrRRrrRRRRRRRk",
    "kRrrrrrRrrrrrooorrrrRRrRRRRRRRRk",
    "kRRrrrRRRrrrrrrrrrrrRRRRRrRRRRRk",
    ".kRRRRRRRRRRrrrrrrrRRRRRRRRRRRRk",
    "..kRRRRRkkRRRRRRRRRRRRRkkRRRRRk.",
    "...kkkkk..kkkRRRRRRRkkk..kkkkk..",
    ".............kkkkkkk............"
   ]
  },
  "snow_32": {
   "key": "snow_32",
   "name": "bush_snow_32",
   "id": "nature/bush/snow_32",
   "label": "Buisson enneigé",
   "kind": "sprite",
   "w": 32,
   "h": 21,
   "size": 32,
   "props": {
    "shape": "round",
    "season": "winter",
    "feature": "snow"
   },
   "tags": [
    "snow"
   ],
   "png": "library/png/nature/bush/snow_32.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAVCAMAAAAQExzYAAAAG1BMVEUAAAAaFCP7+//T4PJarkWPo8cfSiwuejql11pazzYrAAAAAXRSTlMAQObYZgAAALZJREFUeNp1klkOxCAMQzFZ3PufeJQQUqpO/QOKnxwsMcYppManMFP49kXki4joKRKIyHwvWuHpqto7ZoWLegJiK+bpz7DUwxcxMzsJzDCVpDuZF/IkIFrTAPJMAt2AVFZEn3SrKpgz59dO0Z2xqkRDxma9U3KZe1ZB1F9Ap3gBFs/IBkwiU3YXTxkGhK034Bjw7sV6QwB+ALXxDlouCwhi6/Q7YROAPwy0Xx8tj3bR0/HnTz7GP77dCOODwEu8AAAAAElFTkSuQmCC",
   "palette": {
    "G": "#1f4a2c",
    "L": "#a5d75a",
    "S": "#8fa3c7",
    "g": "#2e7a3a",
    "k": "#1a1423",
    "l": "#5aae45",
    "s": "#d3e0f2",
    "w": "#fbfbff"
   },
   "rows": [
    ".............kkkkkk.............",
    "............kwwwwwwk............",
    "...........kwssswwwwk...........",
    ".......kkkkwsswssssswkkkk.......",
    "......kwwwwwsssssllSswwwwk......",
    ".....kwssswslGsssllsSsssswk.....",
    "....kwsswsslllGsllsssSSSSswk....",
    "....kwsllllgggGGggllgggggSswk...",
    "....kslllgggggGGggggggGgggSsk...",
    "...kkgglglllgggGglllgggGggGSkk..",
    "..kwwgGgllLllgggggGlggggGgggwwk.",
    ".kwwwgggllllglllgggGggggGGGGsswk",
    "kwwssggglllgllLllgggGgggGGGGSSsk",
    "kwsllggggllglllllgggGGggGGGGGGSk",
    "ksgggggggggglllllgggGGggGGGGGGGk",
    "kGgggggGggggglllggggGGgGGGGGGGGk",
    "kGGgggGGGgggggggggggGGGGGgGGGGGk",
    ".kGGGGGGGGGGgggggggGGGGGGGGGGGGk",
    "..kGGGGGkkGGGGGGGGGGGGGkkGGGGGk.",
    "...kkkkk..kkkGGGGGGGkkk..kkkkk..",
    ".............kkkkkkk............"
   ]
  },
  "dry_32": {
   "key": "dry_32",
   "name": "bush_dry_32",
   "id": "nature/bush/dry_32",
   "label": "Buisson sec sans feuilles",
   "kind": "sprite",
   "w": 32,
   "h": 21,
   "size": 32,
   "props": {
    "shape": "round",
    "season": "winter",
    "feature": "bare"
   },
   "tags": [
    "dead",
    "twigs"
   ],
   "png": "library/png/nature/bush/dry_32.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAVCAMAAAAQExzYAAAAFVBMVEUAAAAaFCOcazxqQSjJmls7IhngeCoKchacAAAAAXRSTlMAQObYZgAAAKRJREFUeNqFkgEOhCAMBDus9f9PvrQWBCI5oyRmJ3RaMFsfsMPzBLR2IGgYsfLSO4DizR99E38B1IFrcSXlEVcBCHeGSOpJpRBExEx1YvMbSVhK4EnpLZPNQRKV5XLPRLmPD3l49PEOuQKIdJTI8r1sAVomGjtEGwtgpTxVqTZ77mm9HLT6KLrlPvAKXbUfH0ST5Mr489RDVi4d79UDnK9ddrPFP+NBAlucJuROAAAAAElFTkSuQmCC",
   "palette": {
    "B": "#3b2219",
    "N": "#c99a5b",
    "b": "#6a4128",
    "k": "#1a1423",
    "n": "#9c6b3c",
    "o": "#e0782a"
   },
   "rows": [
    "...............kk...............",
    "........k.....knnk..............",
    ".......knk.k.knkk....k..........",
    ".......knkkbkkbk....kbk.........",
    "........knkbkkbk....kbk.........",
    "........knkkbkbk....kNkk........",
    "..k...kkkbkNbkbk...kbkBBk.k.....",
    ".knk.kbbkkbkkbkbk..kBBkk.kbk....",
    "..knkkokbbbk.kkbk.kBbk..kbkk....",
    "...knkk.kkbbk.kbk..kbk..kbkok...",
    "....knk...kbk.kbk.kbk.kkbBBBk...",
    "...kkkbk...kbkkbk.kbkkBBBkkk....",
    "..kbbbkbk..kbkkbk.kbkkbkk....k..",
    "...kkkbbbkkkbkkbk.kbkkbk.k.kkbk.",
    "......kkkbbkkbkbkkbkkbk.kBkbbk..",
    ".........kkbkbkkbkbkbk.kkbBBk...",
    "...........kbkbkbkBbkkkbbkkkBk..",
    "............kbnbbbBbkbbkk...k...",
    ".............kbbbbBbbkk.........",
    ".............kbbbbBkk...........",
    "..............kkkkk............."
   ]
  },
  "hedge_48": {
   "key": "hedge_48",
   "name": "bush_hedge_48",
   "id": "nature/bush/hedge_48",
   "label": "Haie taillée (48 px)",
   "kind": "sprite",
   "w": 48,
   "h": 24,
   "size": 48,
   "props": {
    "shape": "hedge",
    "season": "summer",
    "feature": "plain"
   },
   "tags": [
    "hedge",
    "garden"
   ],
   "png": "library/png/nature/bush/hedge_48.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAYCAMAAACLI47uAAAAElBMVEUAAAAaFCOl11parkUuejofSiyqBYhCAAAAAXRSTlMAQObYZgAAAHVJREFUeNrNlDkOwDAIBJew/P/LEZhIqcJRhWIkW4zwUhgAICJN4rRfqlKRZCqiVK9vGklajCp7g3TD3JgJJguB51jQ21Mwv2JFngErgVHWYYauA2TmZ0v1e4J7oRvgLXSVXOt0S2OBc6E9I580ql8K/n8MCje4ExAi+ooqYAAAAABJRU5ErkJggg==",
   "palette": {
    "G": "#1f4a2c",
    "L": "#a5d75a",
    "g": "#2e7a3a",
    "k": "#1a1423",
    "l": "#5aae45"
   },
   "rows": [
    "....kkk...kkk...kkk...kkk...kkk...kkk...kkk.....",
    "..kkLllkkkLllkkkLllkkkLllkkkLllkkkLllkkkgggkk...",
    ".klglllllglllllglllllglllllglllllglllllGggggGk..",
    "klllglllllglllllglllllglllllglllllgllllgGgggGGk.",
    "klllglllllglllllglllllglllllglllllgllllgGgggGGGk",
    "klllglllllglllllglllllglllllglllllgllllgGgggGGGk",
    "kglllgGglllgGglllgGglllgGglllgGglllgGglgggGgGGGk",
    "kGlllggGlllggGlllggGlllggGlllggGlllggGlggggGGGGk",
    "kGlllggGlllggGlllggGlllggGlllggGlllggGlggggGGGGk",
    "kggggggGgggggGgggggGgggggGgggggGgggggGgggggGGGGk",
    "klgGglllgGglllgGglllgGglllgGglllgGglllgGggggGGGk",
    "klggGlllggGlllggGlllggGlllggGlllggGlllggGgggGGGk",
    "klggGlllggGlllggGlllggGlllggGlllggGlllggGgggGGGk",
    "kgggGgggggGgggggGgggggGgggggGgggggGgggggGgggGGGk",
    "kgggggGgggggGgggggGgggggGgggggGgggggGgggggGgGGGk",
    "kGgggggGgggggGgggggGgggggGgggggGgggggGgggggGGGGk",
    "kGgggggGgggggGgggggGgggggGgggggGgggggGgggggGGGGk",
    "kggggggGgggggGgggggGgggggGgggggGgggggGgggggGGGGk",
    "kggGgggggGgggggGgggggGgggggGgggggGgggggGggggGGGk",
    "kGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGk",
    "kGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGk",
    "kGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGk",
    "kGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGk",
    ".kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk."
   ]
  },
  "hedge_flowering_48": {
   "key": "hedge_flowering_48",
   "name": "bush_hedge_flowering_48",
   "id": "nature/bush/hedge_flowering_48",
   "label": "Haie fleurie (48 px)",
   "kind": "sprite",
   "w": 48,
   "h": 24,
   "size": 48,
   "props": {
    "shape": "hedge",
    "season": "spring",
    "feature": "flowers"
   },
   "tags": [
    "hedge",
    "garden",
    "flower"
   ],
   "png": "library/png/nature/bush/hedge_flowering_48.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAYCAMAAACLI47uAAAAG1BMVEUAAAAaFCOl11parkUuejr/s88fSizkaprzw0qUDYZDAAAAAXRSTlMAQObYZgAAANRJREFUeNrNlMkOwzAIRO3ODPj/v7gC242zVElv5TDCwBNLpJRSSqm1PtTSy19AvVOSA6kgwpTKqVp8CEaSlq0gJ+S45lLVxCAsiAp3wn1J+xGAMACrpZ4mmLBWbAHiTTUJFHsqVU0fn4jyAViEqECaEu4RU2r3wd5gAywmUGhi2kpPANOsq+SUcZ6Fex1Lb4MCjI2R4yxxeUcmcOh+VneuZ+0J3WHbWXk17qUuSxupe2ScddynTUJfiR0QHTKR5BnQ9Xd40uH5znOHn+wvgfh//GDlDVHKEgPW4GkKAAAAAElFTkSuQmCC",
   "palette": {
    "G": "#1f4a2c",
    "L": "#a5d75a",
    "Z": "#ffb3cf",
    "g": "#2e7a3a",
    "k": "#1a1423",
    "l": "#5aae45",
    "y": "#f3c34a",
    "z": "#e46a9a"
   },
   "rows": [
    "....kkk...kkk...kkk...kkk...kkk...kkk...kkk.....",
    "..kkLllkkkLllkkkLllkkkLllkkkLllkkkLllkkkgggkk...",
    ".klglllllZlllllglllllgllZllglllllglllZlGggggGk..",
    "klZzglZzllglllllZlllllglllllglllllglZyZgGgggGGk.",
    "klzzglzzllglllllglZzllglllllglllllgllZlgGgggGGGk",
    "klllgllZllglllllglzzllglllZlglllllgllllgGgggGGGk",
    "kglllgZyZZlgZglllgGglllgGZyZlgGglllgGglgggGgGGGk",
    "kGlllggZZyZZyZlllgZGlllggGZllggGlllggGlggggGGGGk",
    "kGlllggGlZlgZGlZlZyZllZggGlllggGlllggGlggggGGGGk",
    "kggggggGgggggGZZzgZGgZyZgGgggggGgggggGgggggGGGGk",
    "klgGglllgGglllgzzlllgGZlllgGglllgGglZzgGggggGGGk",
    "klggGlllggGlllggGlllggGlllggGlllggGlzzggGgggGGGk",
    "klggGlllZgGlllggGlllggGlllggGlllggGlllggGgggGGGk",
    "kgggGgggggGgggggGgggggGgggggGgggggGgggggGgggGGGk",
    "kgggggGggZggGgggggGgggggGgggggGgggggGgggggGgGGGk",
    "kGgggggGZyZggGggggZGgggggGgggggGgggggGgggggGGGGk",
    "kGgggggGgZgggGgggZyZgggggGgggggGgggggGggZggGGGGk",
    "kggggggGgggggGggggZGgggggGgggggGgggggGgggggGGGGk",
    "kggGgggggGgggggGgggggGgggggGgggggGgggggGggggGGGk",
    "kGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGk",
    "kGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGk",
    "kGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGk",
    "kGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGk",
    ".kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk."
   ]
  }
 }
};
export default asset;
