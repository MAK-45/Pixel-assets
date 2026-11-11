// GÉNÉRÉ par scripts/build.js — ne pas modifier. Source : assets/nature/bones.px.js
// Ossements — 7 variante(s). Usage :
//   import asset from "./bones.js"; const v = asset.variants["skull_32"];
//   v.src (data URL PNG), v.rows + v.palette (pixels, "." = transparent), v.w, v.h
/** @type {import("../../index.d.ts").PixelAsset} */
export const asset = {
 "id": "nature/bones",
 "slug": "bones",
 "category": "nature",
 "title": "Ossements",
 "description": "Ossements blanchis par le soleil pour décors de désert et de western, vus de face : crâne de bovin à cornes (16 et 32 px, posé ou à demi enfoui dans le sable), os seul et os croisés (16 px), cage thoracique à demi ensablée (32 et 48 px). Os blanc à ombres bleutées, cornes brunes, lumière en haut à gauche, contour sombre.",
 "tags": [
  "bones",
  "skull",
  "desert",
  "western",
  "dead",
  "skeleton",
  "ribs",
  "decoration",
  "nature"
 ],
 "order": 0,
 "source": "assets/nature/bones.px.js",
 "module": "library/js/nature/bones.js",
 "sheet": {
  "png": "library/sheets/nature/bones.png",
  "json": "library/sheets/nature/bones.json"
 },
 "axes": {
  "kind": [
   "skull",
   "bone",
   "crossed",
   "ribs"
  ],
  "ground": [
   "bare",
   "sand"
  ]
 },
 "sizes": [
  16,
  32,
  48
 ],
 "variantCount": 7,
 "variants": {
  "skull_32": {
   "key": "skull_32",
   "name": "bones_skull_32",
   "id": "nature/bones/skull_32",
   "label": "Crâne de bovin à cornes",
   "kind": "sprite",
   "w": 32,
   "h": 24,
   "size": 32,
   "props": {
    "kind": "skull",
    "ground": "bare"
   },
   "tags": [
    "cow",
    "horns"
   ],
   "png": "library/png/nature/bones/skull_32.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAYCAMAAACsjQ8GAAAAGFBMVEUAAAAaFCP/8KjJmlucazzT4PL7+/+Po8dqkdRHAAAAAXRSTlMAQObYZgAAAJtJREFUeNp90lEOxCAIRVFugWH/O26wTqqofV+mnAoaRZCPIML1IbKIngWXJrAzsASmHATPz5gqqwG0b46ZNjNFVe3fnCRekmXeYey3xMbh8RX4OFYCH1CuK4B3GwcKCCogppOneHu417oQPs3pXoBQQb1aYgax3r0fL2HTw3cge5BVth0a4AFsgRD9qO4R2yfUROZQb4+oZ/h4A5/cBlVIKVuYAAAAAElFTkSuQmCC",
   "palette": {
    "N": "#c99a5b",
    "S": "#8fa3c7",
    "Y": "#fff0a8",
    "k": "#1a1423",
    "n": "#9c6b3c",
    "s": "#d3e0f2",
    "w": "#fbfbff"
   },
   "rows": [
    ".k............................k.",
    "kYk..........................kYk",
    "kNYk........................kYNk",
    "kNnk........................knNk",
    "knNkk......................kkNnk",
    ".knNNkkk................kkkNNnk.",
    "..knnNNNkkkkkkkkkkkkkkkkNNNnnk..",
    "...kknnNssssssssssssssssNnnkk...",
    "....knnwwwwwwwwwwwwwwwwwwnnk....",
    ".....kswwwwwwwwwwwwwwwwwwsk.....",
    ".....kswwsswwwwwwwwwwsswwsk.....",
    ".....kswkkkswwwwwwwwskkkwsk.....",
    ".....kSkkkkswwwwwwwwskkkkSk.....",
    "......kSkksswwwwwwwwsskkSk......",
    "......kSsswwwwwwwwwwwwssSk......",
    ".......ksswwwwwwwwwwwwssk.......",
    ".......kSswwwwwwwwwwwwsSk.......",
    "........kswwwwwwwwwwwwsk........",
    "........ksswwwwwwwwwwssk........",
    "........kSswwkwwwwkwwsSk........",
    "........kSswkkwwwwkkwsSk........",
    ".........kSSsswwwwssSSk.........",
    "..........kSSssssssSSk..........",
    "...........kkkkkkkkkk..........."
   ]
  },
  "skull_16": {
   "key": "skull_16",
   "name": "bones_skull_16",
   "id": "nature/bones/skull_16",
   "label": "Crâne à cornes (16 px)",
   "kind": "sprite",
   "w": 16,
   "h": 11,
   "size": 16,
   "props": {
    "kind": "skull",
    "ground": "bare"
   },
   "tags": [
    "cow",
    "horns"
   ],
   "png": "library/png/nature/bones/skull_16.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAMAAABBPP0LAAAAFVBMVEUAAAAaFCPJmlucazzT4PL7+/+Po8eekVC5AAAAAXRSTlMAQObYZgAAAEhJREFUeNpNjkkOADAIAhml/v/Jjd3SOQlBRUIfSMTntCCDR2RHMnxYWsLj4L2NoSVco9gB6ty/O77/KA8YrleA6h/1F1qscQJrYQE9YclLsQAAAABJRU5ErkJggg==",
   "palette": {
    "N": "#c99a5b",
    "S": "#8fa3c7",
    "k": "#1a1423",
    "n": "#9c6b3c",
    "s": "#d3e0f2",
    "w": "#fbfbff"
   },
   "rows": [
    ".k............k.",
    "kNk..........kNk",
    "knNkkkkkkkkkkNnk",
    ".knNssssssssNnk.",
    "..kswwwwwwwwsk..",
    "..kskkwwwwkksk..",
    "..kSkwwwwwwkSk..",
    "...kswwwwwwsk...",
    "...kSswkkwsSk...",
    "....kSssssSk....",
    ".....kkkkkk....."
   ]
  },
  "skull_sand_32": {
   "key": "skull_sand_32",
   "name": "bones_skull_sand_32",
   "id": "nature/bones/skull_sand_32",
   "label": "Crâne à demi enfoui dans le sable",
   "kind": "sprite",
   "w": 32,
   "h": 24,
   "size": 32,
   "props": {
    "kind": "skull",
    "ground": "sand"
   },
   "tags": [
    "cow",
    "horns",
    "sand"
   ],
   "png": "library/png/nature/bones/skull_sand_32.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAYCAMAAACsjQ8GAAAAGFBMVEUAAAAaFCP/8KjJmlucazzT4PL7+/+Po8dqkdRHAAAAAXRSTlMAQObYZgAAAJpJREFUeNqF0FEShCAMA9CGtMv9b+y0sgst4uZDHfOAqgjkJRBBexFegmeBRgd6BupAiYPAvRhKYjcAODaHKsOkkNTv4XBiJV5jDqOfLboOD9uBrWM5sAX5cwXA3MYAFNBRAXr6chfzDLPaC7qlOc0KEF9Pks0vsUf5s2SLxM1RBhxvU1LNx/z6vdIIj/0At3jcfgCN8d8A/4MLVhkGnaoPQJgAAAAASUVORK5CYII=",
   "palette": {
    "N": "#c99a5b",
    "S": "#8fa3c7",
    "Y": "#fff0a8",
    "k": "#1a1423",
    "n": "#9c6b3c",
    "s": "#d3e0f2",
    "w": "#fbfbff"
   },
   "rows": [
    ".k............................k.",
    "kYk..........................kYk",
    "kNYk........................kYNk",
    "kNnk........................knNk",
    "knNkk......................kkNnk",
    ".knNNkkk................kkkNNnk.",
    "..knnNNNkkkkkkkkkkkkkkkkNNNnnk..",
    "...kknnNssssssssssssssssNnnkk...",
    "....knnwwwwwwwwwwwwwwwwwwnnk....",
    ".....kswwwwwwwwwwwwwwwwwwsk.....",
    ".....kswwsswwwwwwwwwwsswwsk.....",
    ".....kswkkkswwwwwwwwskkkwsk.....",
    ".....kSkkkkswwwwwwwwskkkkSk.....",
    "......kSkksswwwwwwwwsskkSk......",
    "......kSsswwwwwwwwwwwwssSk......",
    ".......ksswNNNNYNNNNwwssk.......",
    ".......NNYYYYYYNYYYYNNNNk.......",
    ".....NYYYNNNNNNNNNNNNNNNNN......",
    "...NYYNNNNNNNNNNNNNNNNNNNNNN....",
    "..NYNNNNNNNNNNNNNNNNNNnnnnnnN...",
    ".NYNNNNNNNNNNNNNNNNNNNnnnnnnnN..",
    ".YNNNNNNNNNNNNNNNNNNNNnnnnnnnn..",
    "NNNNNNNNNNNNNNNNNNNNNNnnnnnnnnN.",
    "NNNNNNNNNNNNNNNNNNNNNNnnnnnnnnN."
   ]
  },
  "bone_16": {
   "key": "bone_16",
   "name": "bones_bone_16",
   "id": "nature/bones/bone_16",
   "label": "Os (16 px)",
   "kind": "sprite",
   "w": 16,
   "h": 16,
   "size": 16,
   "props": {
    "kind": "bone",
    "ground": "bare"
   },
   "tags": [
    "icon"
   ],
   "png": "library/png/nature/bones/bone_16.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAD1BMVEUAAAAaFCPT4PL7+/+Po8e6KPQEAAAAAXRSTlMAQObYZgAAADxJREFUeNqNjzEOADAIAj30/29u6tLi0JSNExOIOALiFkrhQDJCOmhfjDvv/LeH4ZWe7372PwtvUmOlrV5ZHACp/wBPHwAAAABJRU5ErkJggg==",
   "palette": {
    "S": "#8fa3c7",
    "k": "#1a1423",
    "s": "#d3e0f2",
    "w": "#fbfbff"
   },
   "rows": [
    "...........kkk..",
    "..........kswsk.",
    "..........kssssk",
    "..........kwsssk",
    ".........kwsssSk",
    "........kwssskk.",
    ".......kwsssk...",
    "......kwsssk....",
    ".....kwsssk.....",
    "....kwsssk......",
    ".kkkwsssk.......",
    "kswwsssk........",
    "ksssssk.........",
    "kssssk..........",
    ".kssSk..........",
    "..kkk..........."
   ]
  },
  "crossed_16": {
   "key": "crossed_16",
   "name": "bones_crossed_16",
   "id": "nature/bones/crossed_16",
   "label": "Os croisés (16 px)",
   "kind": "sprite",
   "w": 16,
   "h": 16,
   "size": 16,
   "props": {
    "kind": "crossed",
    "ground": "bare"
   },
   "tags": [
    "icon",
    "danger"
   ],
   "png": "library/png/nature/bones/crossed_16.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAD1BMVEUAAAAaFCPT4PL7+/+Po8e6KPQEAAAAAXRSTlMAQObYZgAAAFJJREFUeNptj1ESACEIQn3Y/c+8E6XVzPrDgIoYcQq4IAKlMCRbkIRhKWQLVsyHdzRSrH65ziHP90Hp4eX38ulQFu7bZwc79y98g3X2Csb/u64PlzUBHL/FOncAAAAASUVORK5CYII=",
   "palette": {
    "S": "#8fa3c7",
    "k": "#1a1423",
    "s": "#d3e0f2",
    "w": "#fbfbff"
   },
   "rows": [
    "...........kkk..",
    ".kkk......kswsk.",
    "kswwk.....kssssk",
    "kssswk....kwsssk",
    "ksssswk..kwsssSk",
    ".kssSwskkwssskk.",
    "..kkkssswsssk...",
    ".....ksssssk....",
    ".....kwsssk.....",
    "....kwssssskkk..",
    ".kkkwssskssswsk.",
    "kswwsssk.ksssssk",
    "ksssssk...kwsssk",
    "kssssk.....kssSk",
    ".kssSk......kkk.",
    "..kkk..........."
   ]
  },
  "ribs_32": {
   "key": "ribs_32",
   "name": "bones_ribs_32",
   "id": "nature/bones/ribs_32",
   "label": "Cage thoracique ensablée",
   "kind": "sprite",
   "w": 32,
   "h": 22,
   "size": 32,
   "props": {
    "kind": "ribs",
    "ground": "sand"
   },
   "tags": [
    "carcass"
   ],
   "png": "library/png/nature/bones/ribs_32.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAWCAMAAACWh252AAAAGFBMVEUAAAAaFCPT4PL7+/+Po8fJmlv/8Kicazx1cf2ZAAAAAXRSTlMAQObYZgAAAH1JREFUeNqtkeEOgCAIBjnUev83boSuIlh/ujF1fifmEvkFiloxWtTM1WhZcRNyWELPobsBTTs0H68l14f6TjQeD3Xj2UgqI20hxEu+WmgUvIWuzJ4eBQ0C8hbOc3kDOzeM7RxjDmNsjs8mwS2ee4GpWDwKzCCN9wn+N2vkAHgoBS1CM2uvAAAAAElFTkSuQmCC",
   "palette": {
    "N": "#c99a5b",
    "S": "#8fa3c7",
    "Y": "#fff0a8",
    "k": "#1a1423",
    "n": "#9c6b3c",
    "s": "#d3e0f2",
    "w": "#fbfbff"
   },
   "rows": [
    "................................",
    "................................",
    "....k..k..k..k..k..k..k..k......",
    "..kkskkskkskkskkskkskkskkskk....",
    ".kssssswsswsswsswsswsswsswssk...",
    ".ksssssssssssssssssssssssssssk..",
    ".ksssSSSSSSSSSSSSSSSSSSSSSSSkSk.",
    "..kkkwsSkkwwsSkkwsSkkwwsSkkk.k..",
    ".....kwwsSkwwsSkkwsSkkwwsSk.....",
    "......kwwsSkwsSkkwwsSkkwsSk.....",
    ".......kwwsSkwsSkkwsSkkwwsSk....",
    "........kwsSkwwsSkkwsSkkwsSk....",
    "........kwwsSkwsSkkwsSkkssSk....",
    ".........kwsSkssSkkssSkssSSk....",
    ".........kssSkssSkkssSkssSk.....",
    ".........kssSssSSkssSkssSSk.....",
    ".......kkssNNNNNYNNNNNsSSk......",
    ".....kkNNYYYYYYYNYYYYYNNNNkk....",
    "...kkNYYYNNNNNNNNNNNNNNNNNNNkk..",
    "..kNYYNNNNNNNNNNNNNNNNNNNNNNNNk.",
    ".kYYNNNNNNNNNNNNNNNNNNNnnnnnnnnk",
    "..kkkkkkkkkkkkkkkkkkkkkkkkkkkkk."
   ]
  },
  "ribs_48": {
   "key": "ribs_48",
   "name": "bones_ribs_48",
   "id": "nature/bones/ribs_48",
   "label": "Grande cage thoracique ensablée (48 px)",
   "kind": "sprite",
   "w": 48,
   "h": 30,
   "size": 48,
   "props": {
    "kind": "ribs",
    "ground": "sand"
   },
   "tags": [
    "carcass",
    "landmark"
   ],
   "png": "library/png/nature/bones/ribs_48.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAeCAMAAABdem3zAAAAGFBMVEUAAAAaFCPT4PL7+/+Po8fJmlv/8Kicazx1cf2ZAAAAAXRSTlMAQObYZgAAAK1JREFUeNrNlFEOxCAIBXkq7f1vvLFKZRGV/dsXE0ydgZo0JfrPILwajhRdjU81ObK0EAtEKLGgNAPIqQDn+l6bkOujWutJr6Rr39BsKHNv4GfDn/GCsMKKXI+YDftSVjC9pxHJEbwRAjqCT6qyFNK6GMFBdgMU8k1iwwsJ9LLhheQnVyvDcnnmSyI7sSYaYDn3AphvtfbmfZTyNOdzMHiOpf82Tt3vEciFoyH6AN1QCe/6vTnwAAAAAElFTkSuQmCC",
   "palette": {
    "N": "#c99a5b",
    "S": "#8fa3c7",
    "Y": "#fff0a8",
    "k": "#1a1423",
    "n": "#9c6b3c",
    "s": "#d3e0f2",
    "w": "#fbfbff"
   },
   "rows": [
    "................................................",
    "................................................",
    "................................................",
    "....k..k..k..k..k..k..k..k..k..k..k..k..k..k....",
    "..kkskkskkskkskkskkskkskkskkskkskkskkskkskksk...",
    ".kssssswsswsswsswsswsswsswsswsswsswsswsswsswk...",
    ".ksssssssssssssssssssssssssssssssssssssssssssk..",
    ".ksssSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSkSk.",
    "..kkkwsSkkkkkwsSkkkkkwsSkkkkkwsSkkkkkwsSkkkk.k..",
    ".....kwwsSk..kwsSkk..kwsSk...kwsSk...kwwsSk.....",
    "......kwwsSk..kwwsSk..kwsSk...kwsSk...kwwsSk....",
    ".......kkwsSk..kwwsSk..kwsSk...kwsSk...kwwsSk...",
    "........kwwsSk..kwwsSk..kwsSk..kwwsSk...kwsSk...",
    ".........kwwsSk..kwsSk..kwwsSk..kwsSk...kwwsSk..",
    "..........kwwsSk..kwsSk..kwsSk...kwsSk...kwsSk..",
    "...........kwsSk..kwwsSk.kwwsSk..kwsSk...kssSk..",
    "...........kwwsSk..kwsSk..kwsSk..kssSk...kssSk..",
    "............kwsSk..kwsSk..kssSk..kssSk..kssSSk..",
    "............kwsSk..kssSk..kssSk..kssSk..kssSk...",
    "............kssSk..kssSk..kssSk.kssSk..kssSSk...",
    "............kssSk.kssSSk.kssSk..kssSk.kssSSk....",
    "...........kssSSk.kssSkkkkssSkkkssSk.kssSSk.....",
    "...........kssSkkkNNNNNNYNNNNNNssSkkkssSkk......",
    "..........kssNNYYYYYYYYYNYYYYYYYNNNNssSk........",
    ".......kkkNYYYYNNNNNNNNNNNNNNNNNNNNNNNNkkk......",
    ".....kkNNYYNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNkk....",
    "....kNYYYNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNk...",
    "...kNYNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNk..",
    "..kYYNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNnnnnnnnnnnnk.",
    "...kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk.."
   ]
  }
 }
};
export default asset;
