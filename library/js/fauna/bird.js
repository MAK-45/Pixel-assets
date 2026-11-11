// GÉNÉRÉ par scripts/build.js — ne pas modifier. Source : assets/fauna/bird.px.js
// Oiseau — 6 variante(s). Usage :
//   import asset from "./bird.js"; const v = asset.variants["far_8"];
//   v.src (data URL PNG), v.rows + v.palette (pixels, "." = transparent), v.w, v.h
/** @type {import("../../index.d.ts").PixelAsset} */
export const asset = {
 "id": "fauna/bird",
 "slug": "bird",
 "category": "fauna",
 "title": "Oiseau",
 "description": "Oiseaux en vol pour animer les ciels : silhouette lointaine sombre ou claire (8 px), vol de cinq oiseaux en V (32 px), et oiseaux proches vus de profil (16 px) : hirondelle, corbeau, mouette. Battements d'ailes animés en 4 images de 100 ms ; le moteur de scène les fait traverser le ciel. Silhouettes lointaines sans contour, oiseaux proches au contour sombre.",
 "tags": [
  "bird",
  "flying",
  "sky",
  "wings",
  "flock",
  "ambient",
  "animated",
  "fauna"
 ],
 "order": 0,
 "source": "assets/fauna/bird.px.js",
 "module": "library/js/fauna/bird.js",
 "sheet": {
  "png": "library/sheets/fauna/bird.png",
  "json": "library/sheets/fauna/bird.json"
 },
 "axes": {
  "species": [
   "silhouette",
   "swallow",
   "crow",
   "gull"
  ],
  "distance": [
   "far",
   "near"
  ],
  "group": [
   "single",
   "flock"
  ]
 },
 "sizes": [
  8,
  16,
  32
 ],
 "variantCount": 6,
 "variants": {
  "far_8": {
   "key": "far_8",
   "name": "bird_far_8",
   "id": "fauna/bird/far_8",
   "label": "Silhouette lointaine sombre",
   "kind": "anim",
   "w": 7,
   "h": 4,
   "size": 8,
   "props": {
    "species": "silhouette",
    "distance": "far",
    "group": "single"
   },
   "tags": [
    "particle"
   ],
   "png": "library/png/fauna/bird/far_8.png",
   "gif": "library/png/fauna/bird/far_8.gif",
   "frameCount": 4,
   "loopMs": 400,
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAECAMAAAB1GNVPAAAACVBMVEUvLTwAAAAaFCNO45ySAAAAAnRSTlP/AOW3MEoAAAAZSURBVHjaY2BgBAEGBkYQA0xCCUZGJqAIAAFsABjW6dr2AAAAAElFTkSuQmCC",
   "strip": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAECAMAAACqVq9QAAAACVBMVEUvLTwAAAAaFCNO45ySAAAAAnRSTlP/AOW3MEoAAAAsSURBVHjaY2BgBAEICQZMCCYDWJyBkYEBgiECUB6MC9PCADOGCcpAMQjZEgAUgQBdMWdehgAAAABJRU5ErkJggg==",
   "gifSrc": "data:image/gif;base64,R0lGODlhBwAEAPEAAAAAAC8tPBoUIwAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJCgAAACwAAAAABwAEAAACCAx+ZomKJ1ABACH5BAkKAAAALAAAAAAHAAQAAAIIhA+huSYIQQEAIfkECQoAAAAsAAAAAAcABAAAAgiEZRmw1gwTKwAh+QQJCgAAACwAAAAABwAEAAACCIQPobkmCEEBADs=",
   "palette": {
    "d": "#2f2d3c",
    "k": "#1a1423"
   },
   "rows": [
    "d.....d",
    ".d...d.",
    "..d.d..",
    "...k..."
   ],
   "frames": [
    {
     "ms": 100,
     "rows": [
      "d.....d",
      ".d...d.",
      "..d.d..",
      "...k..."
     ]
    },
    {
     "ms": 100,
     "rows": [
      ".......",
      "ddd.ddd",
      "...k...",
      "......."
     ]
    },
    {
     "ms": 100,
     "rows": [
      "...k...",
      "..d.d..",
      ".d...d.",
      "d.....d"
     ]
    },
    {
     "ms": 100,
     "rows": [
      ".......",
      "ddd.ddd",
      "...k...",
      "......."
     ]
    }
   ]
  },
  "far_light_8": {
   "key": "far_light_8",
   "name": "bird_far_light_8",
   "id": "fauna/bird/far_light_8",
   "label": "Silhouette lointaine claire",
   "kind": "anim",
   "w": 7,
   "h": 4,
   "size": 8,
   "props": {
    "species": "silhouette",
    "distance": "far",
    "group": "single"
   },
   "tags": [
    "particle",
    "gull"
   ],
   "png": "library/png/fauna/bird/far_light_8.png",
   "gif": "library/png/fauna/bird/far_light_8.gif",
   "frameCount": 4,
   "loopMs": 400,
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAECAMAAAB1GNVPAAAACVBMVEXT4PIAAACPo8e0m34pAAAAAnRSTlP/AOW3MEoAAAAZSURBVHjaY2BgBAEGBkYQA0xCCUZGJqAIAAFsABjW6dr2AAAAAElFTkSuQmCC",
   "strip": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAECAMAAACqVq9QAAAACVBMVEXT4PIAAACPo8e0m34pAAAAAnRSTlP/AOW3MEoAAAAsSURBVHjaY2BgBAEICQZMCCYDWJyBkYEBgiECUB6MC9PCADOGCcpAMQjZEgAUgQBdMWdehgAAAABJRU5ErkJggg==",
   "gifSrc": "data:image/gif;base64,R0lGODlhBwAEAPEAAAAAANPg8o+jxwAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJCgAAACwAAAAABwAEAAACCAx+ZomKJ1ABACH5BAkKAAAALAAAAAAHAAQAAAIIhA+huSYIQQEAIfkECQoAAAAsAAAAAAcABAAAAgiEZRmw1gwTKwAh+QQJCgAAACwAAAAABwAEAAACCIQPobkmCEEBADs=",
   "palette": {
    "S": "#8fa3c7",
    "s": "#d3e0f2"
   },
   "rows": [
    "s.....s",
    ".s...s.",
    "..s.s..",
    "...S..."
   ],
   "frames": [
    {
     "ms": 100,
     "rows": [
      "s.....s",
      ".s...s.",
      "..s.s..",
      "...S..."
     ]
    },
    {
     "ms": 100,
     "rows": [
      ".......",
      "sss.sss",
      "...S...",
      "......."
     ]
    },
    {
     "ms": 100,
     "rows": [
      "...S...",
      "..s.s..",
      ".s...s.",
      "s.....s"
     ]
    },
    {
     "ms": 100,
     "rows": [
      ".......",
      "sss.sss",
      "...S...",
      "......."
     ]
    }
   ]
  },
  "flock_32": {
   "key": "flock_32",
   "name": "bird_flock_32",
   "id": "fauna/bird/flock_32",
   "label": "Vol en V (5 oiseaux)",
   "kind": "anim",
   "w": 32,
   "h": 16,
   "size": 32,
   "props": {
    "species": "silhouette",
    "distance": "far",
    "group": "flock"
   },
   "tags": [
    "migration"
   ],
   "png": "library/png/fauna/bird/flock_32.png",
   "gif": "library/png/fauna/bird/flock_32.gif",
   "frameCount": 4,
   "loopMs": 400,
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAQCAMAAABA3o1rAAAACVBMVEUAAAAaFCMvLTw6nd4aAAAAAXRSTlMAQObYZgAAADVJREFUeNpjYEAGjAz4ARMDEwF5BrwqmJBIvOYwMYExPsDIQAQgbCETQQcxEXQwI419QUezAUZvAEL9CXWyAAAAAElFTkSuQmCC",
   "strip": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAQCAMAAADphoe6AAAACVBMVEUAAAAaFCMvLTw6nd4aAAAAAXRSTlMAQObYZgAAAHRJREFUeNrtVUEOwCAIK/3/o5csO3iYQCiyy0j0BFhbUoA1DEJwucstvHKS93ERUKiPGsQMMfq/NVFoRYC5ZzJMnVQqx9RZpXymhpRqmWlJqZaZlpTaJSQl8NIC5AN+Q+Bjv6katikr4xFlr83vQAPr9gXgBTj9AQWWpeCXAAAAAElFTkSuQmCC",
   "gifSrc": "data:image/gif;base64,R0lGODlhIAAQAPEAAAAAABoUIy8tPAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJCgAAACwAAAAAIAAQAAACLYSPF8ntKEB81E1Z87mG6y8JkeiBzmKmGKRaW/uMMIW2ZFjOQK33yX3zKYTCAgAh+QQJCgAAACwAAAAAIAAQAAACL4SPqcsqD55otIWKs7m6z9lhYBRSo3GWlRRBqvWiSRqTcu3YNYfw8YfL3YK6IaYAACH5BAkKAAAALAAAAAAgABAAAAIthI+CoOv/GoO0TmkzCrpDATKhl3HkuaGZgqmL1LpTgoLsKC9mzju2GMvterwCACH5BAkKAAAALAAAAAAgABAAAAIuhI+pyyoPnmi0hYrxRDvX3nlfJIpXiUaQlFJne7zwMoXzAbY2xOn47SABFTJPAQA7",
   "palette": {
    "d": "#2f2d3c",
    "k": "#1a1423"
   },
   "rows": [
    ".............k..................",
    "............d.d.................",
    "...........d...d................",
    "..........d.....d...............",
    ".................ddd.ddd........",
    "....................k...........",
    "........................d.....d.",
    ".........................d...d..",
    "..........................d.d...",
    "...........................k....",
    ".................ddd.ddd........",
    "....................k...........",
    "................................",
    "..........ddd.ddd...............",
    ".............k..................",
    "................................"
   ],
   "frames": [
    {
     "ms": 100,
     "rows": [
      ".............k..................",
      "............d.d.................",
      "...........d...d................",
      "..........d.....d...............",
      ".................ddd.ddd........",
      "....................k...........",
      "........................d.....d.",
      ".........................d...d..",
      "..........................d.d...",
      "...........................k....",
      ".................ddd.ddd........",
      "....................k...........",
      "................................",
      "..........ddd.ddd...............",
      ".............k..................",
      "................................"
     ]
    },
    {
     "ms": 100,
     "rows": [
      "................................",
      "..........ddd.ddd...............",
      ".............k..................",
      "....................k...........",
      "...................d.d..........",
      "..................d...d.........",
      ".................d.....d........",
      "........................ddd.ddd.",
      "...........................k....",
      ".................d.....d........",
      "..................d...d.........",
      "...................d.d..........",
      ".............k......k...........",
      "............d.d.................",
      "...........d...d................",
      "..........d.....d..............."
     ]
    },
    {
     "ms": 100,
     "rows": [
      "..........d.....d...............",
      "...........d...d................",
      "............d.d.................",
      ".............k..................",
      ".................ddd.ddd........",
      "....................k...........",
      "...........................k....",
      "..........................d.d...",
      ".........................d...d..",
      "........................d.....d.",
      ".................ddd.ddd........",
      "....................k...........",
      "................................",
      "..........ddd.ddd...............",
      ".............k..................",
      "................................"
     ]
    },
    {
     "ms": 100,
     "rows": [
      "................................",
      "..........ddd.ddd...............",
      ".............k..................",
      ".................d.....d........",
      "..................d...d.........",
      "...................d.d..........",
      "....................k...........",
      "........................ddd.ddd.",
      "...........................k....",
      "....................k...........",
      "...................d.d..........",
      "..................d...d.........",
      "..........d.....dd.....d........",
      "...........d...d................",
      "............d.d.................",
      ".............k.................."
     ]
    }
   ]
  },
  "swallow_16": {
   "key": "swallow_16",
   "name": "bird_swallow_16",
   "id": "fauna/bird/swallow_16",
   "label": "Hirondelle",
   "kind": "anim",
   "w": 16,
   "h": 16,
   "size": 16,
   "props": {
    "species": "swallow",
    "distance": "near",
    "group": "single"
   },
   "tags": [
    "spring",
    "summer"
   ],
   "png": "library/png/fauna/bird/swallow_16.png",
   "gif": "library/png/fauna/bird/swallow_16.gif",
   "frameCount": 4,
   "loopMs": 400,
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGFBMVEUAAAAaFCMdKmsvT7MvLTyyOiz7+//T4PK37gHvAAAAAXRSTlMAQObYZgAAAE5JREFUeNp9j1EOwCAIQ207x/1vbGCiYTN7f30hBVr7AKBmUlW5Iao4GWGXwQ2FnAMf43kZSQp5IUsmVfSOzLfDuSVKzczWKYh/Xh/9MACBKwEKnx9CPAAAAABJRU5ErkJggg==",
   "strip": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAQCAMAAACROYkbAAAAGFBMVEUAAAAaFCMdKmsvT7MvLTyyOiz7+//T4PK37gHvAAAAAXRSTlMAQObYZgAAAKFJREFUeNqlk9sOwzAIQ2NYx///8WSaWyHZJiVvjk8sCrSU4wPg7L2InkUwQTBX9KviHDAngAVh/60L3xMUrRkQvfMah54sWPkFTBAdgOdhaM92yYvoE/CEGSDSNAFVVb9+IfsRSLo+2fsR2OrrwpLfAlVXqdKblvk3TwOChtxtM4ypBR4QM7Oe/9S+adPsk885c0w7nXY98v/sOk7/1y/mB2XWA7AounhkAAAAAElFTkSuQmCC",
   "gifSrc": "data:image/gif;base64,R0lGODlhEAAQAPIAAAAAABoUIx0qay9Psy8tPLI6LPv7/9Pg8iH/C05FVFNDQVBFMi4wAwEAAAAh+QQJCgAAACwAAAAAEAAQAAADQQi63BrQuSDEiHJRK0J+Fed9m3UB0KiVFjV0WseKMBgM+BsKhDrvPB+wUihgUBWDUiljUCCCg/Sgcj5S1Y92y0gAACH5BAkKAAAALAAAAAAQABAAAAM7CLrc/jCyEOQKYtAq8RgCB2yTYH5bFl5m+6mYGH9vKxCyrd/5XhQUlsBAJIZEo6PgwDwgL4pN0EKtAhIAIfkECQoAAAAsAAAAABAAEAAAAzkIutz+MMoJg23BBTFEVltmWZznLeGgdkIrEB+wuXQLo3VbFBeYdz3fjDM4xBgz1eiRDFZax4jzkQAAIfkECQoAAAAsAAAAABAAEAAAAzsIutz+MLIQ5Api0CrxGAIHbJNgflsWXmb7qZgYf28rELKt3/leFBSWwEAkhkSjo+DAPCAvik3QQq0CEgA7",
   "palette": {
    "U": "#1d2a6b",
    "d": "#2f2d3c",
    "k": "#1a1423",
    "r": "#b23a2c",
    "s": "#d3e0f2",
    "u": "#2f4fb3",
    "w": "#fbfbff"
   },
   "rows": [
    "................",
    ".kkk............",
    "kUUukk..........",
    ".kUUuUk.........",
    ".kUUUuUk........",
    "..kUUUuuk.kkk...",
    "..kkUUUUukUuUk..",
    ".kUkkUUUUUuUkUk.",
    "..kUkuuuuUUUUUdk",
    "...kUUUUUUUUUUdk",
    "...kUUUUUUUrrkk.",
    "..kUUwwwwwUkk...",
    ".kUkkUssssk.....",
    "..k..kkkkk......",
    "................",
    "................"
   ],
   "frames": [
    {
     "ms": 100,
     "rows": [
      "................",
      ".kkk............",
      "kUUukk..........",
      ".kUUuUk.........",
      ".kUUUuUk........",
      "..kUUUuuk.kkk...",
      "..kkUUUUukUuUk..",
      ".kUkkUUUUUuUkUk.",
      "..kUkuuuuUUUUUdk",
      "...kUUUUUUUUUUdk",
      "...kUUUUUUUrrkk.",
      "..kUUwwwwwUkk...",
      ".kUkkUssssk.....",
      "..k..kkkkk......",
      "................",
      "................"
     ]
    },
    {
     "ms": 100,
     "rows": [
      "................",
      "................",
      "................",
      ".kk.............",
      "kUukkk..........",
      ".kUuuUk...kkk...",
      ".kUUUuukkkUuUk..",
      ".kUUUUUuuUuUkUk.",
      "..kUkuuuuUUUUUdk",
      "...kUUUUUUUUUUdk",
      "...kUUUUUUUrrkk.",
      "..kUUwwwwwUkk...",
      ".kUkkUssssk.....",
      "..k..kkkkk......",
      "................",
      "................"
     ]
    },
    {
     "ms": 100,
     "rows": [
      "................",
      "................",
      "................",
      "................",
      "..........kkk...",
      "..k......kUuUk..",
      ".kUk.kkkkUuUkUk.",
      "..kUkuuuuUUUUUdk",
      "...kUUUUUUUUUUdk",
      "...kUUUUUUUrrkk.",
      "..kUUUUUUuUkk...",
      ".kUkUUUuusk.....",
      "..kUUuukkk......",
      ".kUUukk.........",
      "..kUUk..........",
      "...kk..........."
     ]
    },
    {
     "ms": 100,
     "rows": [
      "................",
      "................",
      "................",
      ".kk.............",
      "kUukkk..........",
      ".kUuuUk...kkk...",
      ".kUUUuukkkUuUk..",
      ".kUUUUUuuUuUkUk.",
      "..kUkuuuuUUUUUdk",
      "...kUUUUUUUUUUdk",
      "...kUUUUUUUrrkk.",
      "..kUUwwwwwUkk...",
      ".kUkkUssssk.....",
      "..k..kkkkk......",
      "................",
      "................"
     ]
    }
   ]
  },
  "crow_16": {
   "key": "crow_16",
   "name": "bird_crow_16",
   "id": "fauna/bird/crow_16",
   "label": "Corbeau",
   "kind": "anim",
   "w": 16,
   "h": 16,
   "size": 16,
   "props": {
    "species": "crow",
    "distance": "near",
    "group": "single"
   },
   "tags": [
    "dark",
    "spooky"
   ],
   "png": "library/png/fauna/bird/crow_16.png",
   "gif": "library/png/fauna/bird/crow_16.gif",
   "frameCount": 4,
   "loopMs": 400,
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAD1BMVEUAAAAaFCMvLTxXVnCLiqPtqMwTAAAAAXRSTlMAQObYZgAAAEZJREFUeNp9z8EKADAIAtCp/f83D6lDNZg3H1R0zhMAs1MxySJM2CIpAm2ZRQGKyCsp7haQSHA8yZ4NqJFWa2n2+c/66JMLifkA/zUbeBsAAAAASUVORK5CYII=",
   "strip": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAQCAMAAACROYkbAAAAD1BMVEUAAAAaFCMvLTxXVnCLiqPtqMwTAAAAAXRSTlMAQObYZgAAAJxJREFUeNqlU0kSwCAII4H/v7mDWGsF24PcQmJkUZHjAHB2nmpnFu6gmCv6qzgbzA6gbZqKdMFDVc1wDwO08Ft0oBI17w5qj6D5YWA0bYOeWHkXNIchCD/rGGRk6NEKffFJUOApMi+FYI+R9fIpCOxdqxr7Ft58CB6YsA8wekZfxsLLuBVSYh+xTbtPfL8FO1y99VX/99aJ0//6QV6vDQOUCk0gNQAAAABJRU5ErkJggg==",
   "gifSrc": "data:image/gif;base64,R0lGODlhEAAQAPIAAAAAABoUIy8tPFdWcIuKowAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJCgAAACwAAAAAEAAQAAADPQi63BrQuSAGiXJRO0J+Fed9wWASFwCNTGlam8BGrlnJsirI9bD/F8pvSAwSjzwd7oh5eIQ/lmTV/FivjQQAIfkECQoAAAAsAAAAABAAEAAAAzoIutz+MLIQ5AqC0CoxIQMHbJMwDN9mCiJ1nt+KVRgbvIOg61q9/78ecGgb6Xw/yoQGFD02Sot0CkgAACH5BAkKAAAALAAAAAAQABAAAAM3CLrc/jDKCYOlQQwR1gWWpXEcKHDBoG7nSYhtLL+ZbF91tg4EyoQrQq/jSPFoxIaONslRQElIAgAh+QQJCgAAACwAAAAAEAAQAAADOgi63P4wshDkCoLQKjEhAwdskzAM32YKInWe34pVGBu8g6DrWr3/vx5waBvpfD/KhAYUPTZKi3QKSAAAOw==",
   "palette": {
    "c": "#8b8aa3",
    "d": "#2f2d3c",
    "k": "#1a1423",
    "m": "#575670"
   },
   "rows": [
    "................",
    ".kkk............",
    "kdmckk..........",
    ".kdmcmk.........",
    ".kdmmcmk........",
    "..kmmmcck.kkk...",
    "...kmmmmckdmdk..",
    ".kk.kmmmmdmdkdk.",
    "kddkkmmmmdddddck",
    "kdddddddddddddck",
    "kddddddddddddkk.",
    "kddkdddddddkk...",
    ".kk.kdddddk.....",
    ".....kkkkk......",
    "................",
    "................"
   ],
   "frames": [
    {
     "ms": 100,
     "rows": [
      "................",
      ".kkk............",
      "kdmckk..........",
      ".kdmcmk.........",
      ".kdmmcmk........",
      "..kmmmcck.kkk...",
      "...kmmmmckdmdk..",
      ".kk.kmmmmdmdkdk.",
      "kddkkmmmmdddddck",
      "kdddddddddddddck",
      "kddddddddddddkk.",
      "kddkdddddddkk...",
      ".kk.kdddddk.....",
      ".....kkkkk......",
      "................",
      "................"
     ]
    },
    {
     "ms": 100,
     "rows": [
      "................",
      "................",
      "................",
      ".kk.............",
      "kdckkk..........",
      ".kdccmk...kkk...",
      ".kdmmcckkkdmdk..",
      ".kkmmmmccdmdkdk.",
      "kddkkmmmmdddddck",
      "kdddddddddddddck",
      "kddddddddddddkk.",
      "kddkdddddddkk...",
      ".kk.kdddddk.....",
      ".....kkkkk......",
      "................",
      "................"
     ]
    },
    {
     "ms": 100,
     "rows": [
      "................",
      "................",
      "................",
      "................",
      "..........kkk...",
      ".........kdmdk..",
      ".kk..kkkkdmdkdk.",
      "kddkkmmmmdddddck",
      "kdddddddddddddck",
      "kddddddddddddkk.",
      "kddkdmmmmcdkk...",
      ".kkkmmmccdk.....",
      "..kmmcckkk......",
      ".kdmckk.........",
      "..kddk..........",
      "...kk..........."
     ]
    },
    {
     "ms": 100,
     "rows": [
      "................",
      "................",
      "................",
      ".kk.............",
      "kdckkk..........",
      ".kdccmk...kkk...",
      ".kdmmcckkkdmdk..",
      ".kkmmmmccdmdkdk.",
      "kddkkmmmmdddddck",
      "kdddddddddddddck",
      "kddddddddddddkk.",
      "kddkdddddddkk...",
      ".kk.kdddddk.....",
      ".....kkkkk......",
      "................",
      "................"
     ]
    }
   ]
  },
  "gull_16": {
   "key": "gull_16",
   "name": "bird_gull_16",
   "id": "fauna/bird/gull_16",
   "label": "Mouette",
   "kind": "anim",
   "w": 16,
   "h": 16,
   "size": 16,
   "props": {
    "species": "gull",
    "distance": "near",
    "group": "single"
   },
   "tags": [
    "sea",
    "coast"
   ],
   "png": "library/png/fauna/bird/gull_16.png",
   "gif": "library/png/fauna/bird/gull_16.gif",
   "frameCount": 4,
   "loopMs": 400,
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGFBMVEUAAAAaFCOLiqPDwtTT4PL7+//zw0qPo8cOlfLNAAAAAXRSTlMAQObYZgAAAE1JREFUeNp9j1sKwDAIBB11m/vfuJhQiAl0/nbwaXYBHNmjqzJOF6dx9wi2YWU8SGUzlZcBJCmLBzNyowtpjmWM1Oz5tsAq6sedH/3wAqLBAVUNJse6AAAAAElFTkSuQmCC",
   "strip": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAQCAMAAACROYkbAAAAGFBMVEUAAAAaFCOLiqPDwtTT4PL7+//zw0qPo8cOlfLNAAAAAXRSTlMAQObYZgAAAJ5JREFUeNqlk0sSgCAMQ0k/ev8bO61lRFp0AbuQZ6RRWtteADafJ96LsATCqP/4HDAmALwY6t4ufBARM3oZAN95EwdRQe1bAvEDeB66jpe7tI3St4QORB4/GlBVFVsHsp+Bt4YMq/ATsNaqKPgPIPR5ih9aouTJd0D9TAFM2luzmaOx5NtMHjhU/tbRelv4/TOtdPWvz/zvbcPuff0wL6TMBO+YdNNXAAAAAElFTkSuQmCC",
   "gifSrc": "data:image/gif;base64,R0lGODlhEAAQAPIAAAAAABoUI4uKo8PC1NPg8vv7//PDSo+jxyH/C05FVFNDQVBFMi4wAwEAAAAh+QQJCgAAACwAAAAAEAAQAAADQgi63BrQOShGlIsOEfALQsV5ABgOVnkx5hkQBdE1rQDLcgYVfEz8BEPnBSwWhSVjkXcJHA6wXmz1IQJnGIiWxO02EgAh+QQJCgAAACwAAAAAEAAQAAADPgi63P4wshDkooNWiYfYgDYFgjBkFFEQYFiWp8qyF1XcK6ETRhXswGAvFATeKIrA4aDCrZCjH7Dl0EAt2GwCACH5BAkKAAAALAAAAAAQABAAAAM7CLrc/jDKCYOlgRQSnrUaxy1fYW5EShhdpr4vC7hwal7zcRBCLwycDsPiGwCFjUDP+PEoB7jIBymJQhIAIfkECQoAAAAsAAAAABAAEAAAAz4Iutz+MLIQ5KKDVomH2IA2BYIwZBRREGBYlqfKshdV3CuhE0YV7MBgLxQE3iiKwOGgwq2Qox+w5dBALdhsAgA7",
   "palette": {
    "C": "#c3c2d4",
    "S": "#8fa3c7",
    "c": "#8b8aa3",
    "k": "#1a1423",
    "s": "#d3e0f2",
    "w": "#fbfbff",
    "y": "#f3c34a"
   },
   "rows": [
    "................",
    ".kkk............",
    "kkcCkk..........",
    ".kkcCck.........",
    ".kkccCck........",
    "..kcccCCk.kkk...",
    "...kccccCkswsk..",
    "....kccccswsksk.",
    "..kkkwwwwsssssyk",
    ".kssssssssssssyk",
    ".kssssssssswwkk.",
    ".kSSswwwwwskk...",
    "..kkksssssk.....",
    ".....kkkkk......",
    "................",
    "................"
   ],
   "frames": [
    {
     "ms": 100,
     "rows": [
      "................",
      ".kkk............",
      "kkcCkk..........",
      ".kkcCck.........",
      ".kkccCck........",
      "..kcccCCk.kkk...",
      "...kccccCkswsk..",
      "....kccccswsksk.",
      "..kkkwwwwsssssyk",
      ".kssssssssssssyk",
      ".kssssssssswwkk.",
      ".kSSswwwwwskk...",
      "..kkksssssk.....",
      ".....kkkkk......",
      "................",
      "................"
     ]
    },
    {
     "ms": 100,
     "rows": [
      "................",
      "................",
      "................",
      ".kk.............",
      "kkCkkk..........",
      ".kkCCck...kkk...",
      ".kkccCCkkkswsk..",
      "..kccccCCswsksk.",
      "..kkkwwwwsssssyk",
      ".kssssssssssssyk",
      ".kssssssssswwkk.",
      ".kSSswwwwwskk...",
      "..kkksssssk.....",
      ".....kkkkk......",
      "................",
      "................"
     ]
    },
    {
     "ms": 100,
     "rows": [
      "................",
      "................",
      "................",
      "................",
      "..........kkk...",
      ".........kswsk..",
      ".....kkkkswsksk.",
      "..kkkwwwwsssssyk",
      ".kssssssssssssyk",
      ".kssssssssswwkk.",
      ".kSSsccccCskk...",
      "..kkcccCCsk.....",
      "..kccCCkkk......",
      ".kkcCkk.........",
      "..kkkk..........",
      "...kk..........."
     ]
    },
    {
     "ms": 100,
     "rows": [
      "................",
      "................",
      "................",
      ".kk.............",
      "kkCkkk..........",
      ".kkCCck...kkk...",
      ".kkccCCkkkswsk..",
      "..kccccCCswsksk.",
      "..kkkwwwwsssssyk",
      ".kssssssssssssyk",
      ".kssssssssswwkk.",
      ".kSSswwwwwskk...",
      "..kkksssssk.....",
      ".....kkkkk......",
      "................",
      "................"
     ]
    }
   ]
  }
 }
};
export default asset;
