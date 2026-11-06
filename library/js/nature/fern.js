// GÉNÉRÉ par scripts/build.js — ne pas modifier. Source : assets/nature/fern.px.js
// Fougère — 6 variante(s). Usage :
//   import asset from "./fern.js"; const v = asset.variants["small_16"];
//   v.src (data URL PNG), v.rows + v.palette (pixels, "." = transparent), v.w, v.h
/** @type {import("../../index.d.ts").PixelAsset} */
export const asset = {
 "id": "nature/fern",
 "slug": "fern",
 "category": "nature",
 "title": "Fougère",
 "description": "Fougères de sous-bois vues de face, posées au sol : petite fougère et jeune crosse enroulée (16 px) ; grande fougère en vert clair, vert forêt bleuté, rousse d'automne et enneigée (32 px). Lumière en haut à gauche, contour sombre.",
 "tags": [
  "fern",
  "plant",
  "vegetation",
  "ground",
  "forest",
  "undergrowth",
  "nature",
  "decoration"
 ],
 "order": 0,
 "source": "assets/nature/fern.px.js",
 "module": "library/js/nature/fern.js",
 "sheet": {
  "png": "library/sheets/nature/fern.png",
  "json": "library/sheets/nature/fern.json"
 },
 "axes": {
  "state": [
   "mature",
   "young"
  ],
  "season": [
   "summer",
   "spring",
   "autumn",
   "winter"
  ],
  "color": [
   "green",
   "teal",
   "brown"
  ]
 },
 "sizes": [
  16,
  32
 ],
 "variantCount": 6,
 "variants": {
  "small_16": {
   "key": "small_16",
   "name": "fern_small_16",
   "id": "nature/fern/small_16",
   "label": "Petite fougère",
   "kind": "sprite",
   "w": 16,
   "h": 13,
   "size": 16,
   "props": {
    "state": "mature",
    "season": "summer",
    "color": "green"
   },
   "tags": [],
   "png": "library/png/nature/fern/small_16.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAANCAMAAACXZR4WAAAAElBMVEUAAAAaFCOl11parkUuejofSiyqBYhCAAAAAXRSTlMAQObYZgAAAFBJREFUeNpVjokNwDAIA3PY3n/lKtD0sYSEj3etEesv6ktYqMTTxc53mNuXOuwhDMExoQc2KTlkQIFU9vizw07CIZLcJOfO7Xk+Sd7ykFanF3mCAVQV7B76AAAAAElFTkSuQmCC",
   "palette": {
    "G": "#1f4a2c",
    "L": "#a5d75a",
    "g": "#2e7a3a",
    "k": "#1a1423",
    "l": "#5aae45"
   },
   "rows": [
    ".......k........",
    "......kLk.......",
    "...k.klLlk.k....",
    "..klk.klk.kgk...",
    ".klLlklLlkgggk..",
    ".kklLlklkgGgkGk.",
    "klkklLlLlgGkGGk.",
    "klLkkllLggkGGk..",
    ".klLlklggGGGkGk.",
    "..kllllgggGGGGk.",
    "...kllgggGGGkk..",
    "....kGGGGGGk....",
    ".....kkkkkk....."
   ]
  },
  "young_16": {
   "key": "young_16",
   "name": "fern_young_16",
   "id": "nature/fern/young_16",
   "label": "Jeune fougère en crosse",
   "kind": "sprite",
   "w": 14,
   "h": 16,
   "size": 16,
   "props": {
    "state": "young",
    "season": "spring",
    "color": "green"
   },
   "tags": [
    "fiddlehead"
   ],
   "png": "library/png/nature/fern/young_16.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAQCAMAAAARSr4IAAAAElBMVEUAAAAaFCNarkUuejql11ofSiw9CE32AAAAAXRSTlMAQObYZgAAAE1JREFUeNpdzkEKACEMQ9H8Ru9/5aFWp2JWfSSIkiRAHSKCS4DRnhAMG/YEw+pzspxTM7znVfm8V/elrl4SxpP+VPKYsN0st2bldyXPD2hZAQBIhNCoAAAAAElFTkSuQmCC",
   "palette": {
    "G": "#1f4a2c",
    "L": "#a5d75a",
    "g": "#2e7a3a",
    "k": "#1a1423",
    "l": "#5aae45"
   },
   "rows": [
    "....kkk.......",
    "...klllk......",
    "..klkkkgk.kk..",
    "..klkLggkkllk.",
    "..kgkkkkkgkkgk",
    "...kggk.kgkLgk",
    "....kkgkkgkgk.",
    ".....kgkgk.k..",
    "....kgkkgk....",
    "....kgkkgk....",
    "...klgkgGk....",
    "..kllgkgGGk...",
    "..klggggGGk...",
    "...klgggGk....",
    "..kGGGGGGGk...",
    "...kkkkkkk...."
   ]
  },
  "large_32": {
   "key": "large_32",
   "name": "fern_large_32",
   "id": "nature/fern/large_32",
   "label": "Grande fougère",
   "kind": "sprite",
   "w": 32,
   "h": 28,
   "size": 32,
   "props": {
    "state": "mature",
    "season": "summer",
    "color": "green"
   },
   "tags": [],
   "png": "library/png/nature/fern/large_32.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAcCAMAAAA3HE0QAAAAD1BMVEUAAAAaFCNarkUuejofSixjiiLOAAAAAXRSTlMAQObYZgAAAOxJREFUeNqdkwtuwzAMQ8PP/c88kIo7p3A3oGlQNBLzREnude0Xrr8vEPhPQXyXx0mxaSEgz8njTgJ6KfI7nwhcxB3Ael+9Q4ET7Ru9FwGGDZXApO1INz8NCEOIIJFHG3YQQ9A8vTWKIhSVnvgN0RSPgFtAguKxQmuYsCi3Ah4G0ptoZVBql79z6paDThOyFEJ02OeUokyTlizfNoaR8aV1MbsKgaAnVEbhrasS8pX8WkaPAFBrrM8MQ2oj6oqHE3MZ9bC0gt3tsho3KRJ3K7ifqtibLiQdziZaxcM/n901kI9/jqZPm9wRwBvgB88YBFxuBW7eAAAAAElFTkSuQmCC",
   "palette": {
    "G": "#1f4a2c",
    "g": "#2e7a3a",
    "k": "#1a1423",
    "l": "#5aae45"
   },
   "rows": [
    ".............k..................",
    "............klkk................",
    ".............kllk...............",
    "............kllk................",
    ".....k.......kllk.........k.....",
    "....kgkk.k..kllkk.....k.kkgk....",
    "...kkgkgkgk.kllGlk...kgkgkgkk...",
    "..kggkggkgkk.kkGkk..kkgkggkggk..",
    "...kkkGkGGkgkllGllkkgkGGkGkkk...",
    ".....kGGkGkgkkkGkk.kgkGkGGk.....",
    "......kGGGGkgllGllkgkGGGGk......",
    ".......kkkGkgkgGkglgkGkkk.......",
    ".......kGGGGlgkGklgkGGGGk.......",
    ".......kGGGGlllklglkGGGGk.......",
    "......k.kkkGGlkGglgGGkkk.k......",
    "....kklkkgglGglGlkggkGGkkgkk....",
    "...klklklgkgllgGgggGGkGlkgkgk...",
    "..kkkGGGGklllGlGggGgGlkGGGGkkk..",
    ".kllGkgkGglkllkGggglklGGkgkGggk.",
    ".klgkgggkGGglGlGglGlGGGkgggkggk.",
    "kllk.kkkggkGlglGglgkGkggkkk.kggk",
    "klgk...kgggGgllGggkGGgggk...kggk",
    ".kk.....kkkkllGGlGgGkkkk.....kk.",
    "........kggggllGggGggggk........",
    ".........kkgggGGGGgggkk.........",
    "...........kkkGGGGkkk...........",
    "...........kGGGGGGGGk...........",
    "............kkkkkkkk............"
   ]
  },
  "forest_32": {
   "key": "forest_32",
   "name": "fern_forest_32",
   "id": "nature/fern/forest_32",
   "label": "Grande fougère de forêt sombre",
   "kind": "sprite",
   "w": 32,
   "h": 28,
   "size": 32,
   "props": {
    "state": "mature",
    "season": "summer",
    "color": "teal"
   },
   "tags": [],
   "png": "library/png/nature/fern/forest_32.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAcCAMAAAA3HE0QAAAAD1BMVEUAAAAaFCM0hGghXk8WOjcCir4QAAAAAXRSTlMAQObYZgAAAOxJREFUeNqdkwtuwzAMQ8PP/c88kIo7p3A3oGlQNBLzREnude0Xrr8vEPhPQXyXx0mxaSEgz8njTgJ6KfI7nwhcxB3Ael+9Q4ET7Ru9FwGGDZXApO1INz8NCEOIIJFHG3YQQ9A8vTWKIhSVnvgN0RSPgFtAguKxQmuYsCi3Ah4G0ptoZVBql79z6paDThOyFEJ02OeUokyTlizfNoaR8aV1MbsKgaAnVEbhrasS8pX8WkaPAFBrrM8MQ2oj6oqHE3MZ9bC0gt3tsho3KRJ3K7ifqtibLiQdziZaxcM/n901kI9/jqZPm9wRwBvgB88YBFxuBW7eAAAAAElFTkSuQmCC",
   "palette": {
    "P": "#163a37",
    "e": "#348468",
    "k": "#1a1423",
    "p": "#215e4f"
   },
   "rows": [
    ".............k..................",
    "............kekk................",
    ".............keek...............",
    "............keek................",
    ".....k.......keek.........k.....",
    "....kpkk.k..keekk.....k.kkpk....",
    "...kkpkpkpk.keePek...kpkpkpkk...",
    "..kppkppkpkk.kkPkk..kkpkppkppk..",
    "...kkkPkPPkpkeePeekkpkPPkPkkk...",
    ".....kPPkPkpkkkPkk.kpkPkPPk.....",
    "......kPPPPkpeePeekpkPPPPk......",
    ".......kkkPkpkpPkpepkPkkk.......",
    ".......kPPPPepkPkepkPPPPk.......",
    ".......kPPPPeeekepekPPPPk.......",
    "......k.kkkPPekPpepPPkkk.k......",
    "....kkekkppePpePekppkPPkkpkk....",
    "...kekekepkpeepPpppPPkPekpkpk...",
    "..kkkPPPPkeeePePppPpPekPPPPkkk..",
    ".keePkpkPpekeekPpppekePPkpkPppk.",
    ".kepkpppkPPpePePpePePPPkpppkppk.",
    "keek.kkkppkPepePpepkPkppkkk.kppk",
    "kepk...kpppPpeePppkPPpppk...kppk",
    ".kk.....kkkkeePPePpPkkkk.....kk.",
    "........kppppeePppPppppk........",
    ".........kkpppPPPPpppkk.........",
    "...........kkkPPPPkkk...........",
    "...........kPPPPPPPPk...........",
    "............kkkkkkkk............"
   ]
  },
  "autumn_32": {
   "key": "autumn_32",
   "name": "fern_autumn_32",
   "id": "nature/fern/autumn_32",
   "label": "Fougère rousse d'automne",
   "kind": "sprite",
   "w": 32,
   "h": 28,
   "size": 32,
   "props": {
    "state": "mature",
    "season": "autumn",
    "color": "brown"
   },
   "tags": [],
   "png": "library/png/nature/fern/autumn_32.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAcCAMAAAA3HE0QAAAAD1BMVEUAAAAaFCPgeCpqQSg7Ihl/t74TAAAAAXRSTlMAQObYZgAAAOxJREFUeNqdkwtuwzAMQ8PP/c88kIo7p3A3oGlQNBLzREnude0Xrr8vEPhPQXyXx0mxaSEgz8njTgJ6KfI7nwhcxB3Ael+9Q4ET7Ru9FwGGDZXApO1INz8NCEOIIJFHG3YQQ9A8vTWKIhSVnvgN0RSPgFtAguKxQmuYsCi3Ah4G0ptoZVBql79z6paDThOyFEJ02OeUokyTlizfNoaR8aV1MbsKgaAnVEbhrasS8pX8WkaPAFBrrM8MQ2oj6oqHE3MZ9bC0gt3tsho3KRJ3K7ifqtibLiQdziZaxcM/n901kI9/jqZPm9wRwBvgB88YBFxuBW7eAAAAAElFTkSuQmCC",
   "palette": {
    "B": "#3b2219",
    "b": "#6a4128",
    "k": "#1a1423",
    "o": "#e0782a"
   },
   "rows": [
    ".............k..................",
    "............kokk................",
    ".............kook...............",
    "............kook................",
    ".....k.......kook.........k.....",
    "....kbkk.k..kookk.....k.kkbk....",
    "...kkbkbkbk.kooBok...kbkbkbkk...",
    "..kbbkbbkbkk.kkBkk..kkbkbbkbbk..",
    "...kkkBkBBkbkooBookkbkBBkBkkk...",
    ".....kBBkBkbkkkBkk.kbkBkBBk.....",
    "......kBBBBkbooBookbkBBBBk......",
    ".......kkkBkbkbBkbobkBkkk.......",
    ".......kBBBBobkBkobkBBBBk.......",
    ".......kBBBBoookobokBBBBk.......",
    "......k.kkkBBokBbobBBkkk.k......",
    "....kkokkbboBboBokbbkBBkkbkk....",
    "...kokokobkboobBbbbBBkBokbkbk...",
    "..kkkBBBBkoooBoBbbBbBokBBBBkkk..",
    ".kooBkbkBbokookBbbbokoBBkbkBbbk.",
    ".kobkbbbkBBboBoBboBoBBBkbbbkbbk.",
    "kook.kkkbbkBoboBbobkBkbbkkk.kbbk",
    "kobk...kbbbBbooBbbkBBbbbk...kbbk",
    ".kk.....kkkkooBBoBbBkkkk.....kk.",
    "........kbbbbooBbbBbbbbk........",
    ".........kkbbbBBBBbbbkk.........",
    "...........kkkBBBBkkk...........",
    "...........kBBBBBBBBk...........",
    "............kkkkkkkk............"
   ]
  },
  "snow_32": {
   "key": "snow_32",
   "name": "fern_snow_32",
   "id": "nature/fern/snow_32",
   "label": "Fougère enneigée",
   "kind": "sprite",
   "w": 32,
   "h": 28,
   "size": 32,
   "props": {
    "state": "mature",
    "season": "winter",
    "color": "green"
   },
   "tags": [
    "snow"
   ],
   "png": "library/png/nature/fern/snow_32.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAcCAMAAAA3HE0QAAAAFVBMVEUAAAAaFCP7+/9arkXT4PIuejofSiyXZbhtAAAAAXRSTlMAQObYZgAAAPtJREFUeNqFkoGOhEAIQ30w7f9/8qWop7u37mEyiVAfhXHb7sH2PSj4T1FfFfR6qPOraD4Zmt7sdY4iXDQQRRGBxwSLhU7HcVaad3Cy+UKLdTJIvkyF0AWFV6Q3PzYOYwgIJ/Myhu2iQmiK5bf60UbIqPSKvxDulHL8BRyCblr9ScD0cGO1PB14MdAgtdVulB5ce8qG8wh1y1II0aHbntK0M6Qly4eNnUF1BrQ6dxVC095Ta78YoemrIeRIXUkzgBkhkh6fWYY0gwQRQDgxp46HsHQm525Pq7nMNIm7M3nbhWJvn+IAvC97unjnf/x3oSbgob5u8UC44sr+AEDaBhuOBdkKAAAAAElFTkSuQmCC",
   "palette": {
    "G": "#1f4a2c",
    "g": "#2e7a3a",
    "k": "#1a1423",
    "l": "#5aae45",
    "s": "#d3e0f2",
    "w": "#fbfbff"
   },
   "rows": [
    ".............k..................",
    "............kwkk................",
    ".............kwwk...............",
    "............klsk................",
    ".....k.......kllk.........k.....",
    "....kwkk.k..kllkk.....k.kksk....",
    "...kkgkwkwk.kllGwk...kskskgkk...",
    "..kwwkwgkgkk.kkGkk..kkgkgskssk..",
    "...kkkGkwGkwkllGlwkkwkGskGkkk...",
    ".....kGGkGkgkkkGkk.kgkGkGGk.....",
    "......kGGGwkwllGllkwksGGGk......",
    ".......kkkGkgkgGkgwgkGkkk.......",
    ".......kGGGGlgkGklgkGGGGk.......",
    ".......kGGGGlllklglkGGGGk.......",
    "......k.kkkGGlkGglgGGkkk.k......",
    "....kklkkgglGglGlkggkGGkkgkk....",
    "...klklklgkgllgGgggGGkGlkgkgk...",
    "..kkkGGGGklllGlGggGgGlkGGGGkkk..",
    ".kwlGkgkGglkllkGggglklGGkgkGgsk.",
    ".ksgkgggkGGglGlGglGlGGGkgggkggk.",
    "kwlk.kkkggkGlglGglgkGkggkkk.kgsk",
    "ksgk...kgggGgllGggkGGgggk...kggk",
    ".kk.....kkkkllGGlGgGkkkk.....kk.",
    "........kggggllGggGggggk........",
    ".........kkgggGGGGgggkk.........",
    "..........kkwwwwwwkkkk..........",
    ".........kssssssssssssk.........",
    "..........kkkkkkkkkkkk.........."
   ]
  }
 }
};
export default asset;
