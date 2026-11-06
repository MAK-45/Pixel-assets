// GÉNÉRÉ par scripts/build.js — ne pas modifier. Source : assets/characters/slime.px.js
// Slime — 6 variante(s). Usage :
//   import asset from "./slime.js"; const v = asset.variants["green_idle"];
//   v.src (data URL PNG), v.rows + v.palette (pixels, "." = transparent), v.w, v.h
/** @type {import("../../index.d.ts").PixelAsset} */
export const asset = {
 "id": "characters/slime",
 "slug": "slime",
 "category": "characters",
 "title": "Slime",
 "description": "Petit monstre gélatineux animé (respiration en 4 images de 200 ms : écrasement / étirement), en plusieurs couleurs, plus une version immobile et un roi slime couronné.",
 "tags": [
  "slime",
  "monster",
  "enemy",
  "character",
  "rpg",
  "animated",
  "cute"
 ],
 "order": 0,
 "source": "assets/characters/slime.px.js",
 "module": "library/js/characters/slime.js",
 "sheet": {
  "png": "library/sheets/characters/slime.png",
  "json": "library/sheets/characters/slime.json"
 },
 "axes": {
  "color": [
   "green",
   "blue",
   "red",
   "purple"
  ],
  "state": [
   "idle",
   "hurt"
  ]
 },
 "sizes": [
  16,
  32
 ],
 "variantCount": 6,
 "variants": {
  "green_idle": {
   "key": "green_idle",
   "name": "slime_green_idle",
   "id": "characters/slime/green_idle",
   "label": "Slime vert – animation repos",
   "kind": "anim",
   "w": 15,
   "h": 15,
   "size": 16,
   "props": {
    "color": "green",
    "state": "idle"
   },
   "tags": [],
   "png": "library/png/characters/slime/green_idle.png",
   "gif": "library/png/characters/slime/green_idle.gif",
   "frameCount": 4,
   "loopMs": 800,
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAAFVBMVEUAAAAaFCMuejparkWl11ofSiz7+/9VJ2ZAAAAAAXRSTlMAQObYZgAAAD9JREFUeNqdzjEOACAIQ1F/Fe9/ZEMg4qCL3R4E0tZ+guegPBT7OUBDqgHKtWSEpz+YbOMGezmv01a5OcqSlRdiYAFIbV/BnQAAAABJRU5ErkJggg==",
   "strip": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAPCAMAAACPzFxDAAAAFVBMVEUAAAAaFCMuejparkWl11ofSiz7+/9VJ2ZAAAAAAXRSTlMAQObYZgAAAIxJREFUeNq9kuEOwyAIBj0sff9H7qoihbou2ZL57/w4UGMpf17A966IEHs9dIspUoN99ord8iRPkS1xjXYYldIb9l62wRjFKmWAqGG9bjCRZbqf/s6UB7fYJzU7pQVpB8NlY6VNsmrpfEk/y4aiS3ncQdMTJHmyp3dZfREoM6H6d7l/CexjwFuO1S84AKNQBPm9H6e0AAAAAElFTkSuQmCC",
   "gifSrc": "data:image/gif;base64,R0lGODlhDwAPAPIAAAAAABoUIy56OlquRaXXWh9KLPv7/wAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJFAAAACwAAAAADwAPAAADOAi63P4wtkBpDCLn8PDQ2yQQoMYpmPCVQnGmRirE7bvJVOGitxnoNlYLiNIZj0TAD4k8KSvQiiIBACH5BAkUAAAALAAAAAAPAA8AAAMvCLrc/jDKSVW4F17BeWaBMHRksIQEqZqhaLTCyxWbB28Ffe+53v9AXzDIwhiPgAQAIfkECRQAAAAsAAAAAA8ADwAAAzgIutz+MLZAaQwi5/Dw0NskEKDGKZjwlUJxpkYqxO27yVThorcZ6DZWC4jSGY9EwA+JPCkr0IoiAQAh+QQJFAAAACwAAAAADwAPAAADOAi63B7QtSBqkIqOKu4TBGd9m+gtlMgVJ0AZqQCzDAVxEI12cd7GooIuo6oIf8KkEqlcTiBQ6CIBADs=",
   "palette": {
    "G": "#1f4a2c",
    "L": "#a5d75a",
    "g": "#2e7a3a",
    "k": "#1a1423",
    "l": "#5aae45",
    "w": "#fbfbff"
   },
   "rows": [
    "...............",
    "...............",
    "...............",
    ".....kkkkk.....",
    "....kgggggk....",
    "...kglgggggk...",
    "..kgLgggggggk..",
    ".kgglgggggggGk.",
    ".kggwkgggwkgGk.",
    ".kggkkgggkkGGk.",
    ".kggkkgggkkGGk.",
    ".kggggggggGGGk.",
    ".kGGGGGGGGGGGk.",
    ".kGGGGGGGGGGGk.",
    "..kkkkkkkkkkk.."
   ],
   "frames": [
    {
     "ms": 200,
     "rows": [
      "...............",
      "...............",
      "...............",
      ".....kkkkk.....",
      "....kgggggk....",
      "...kglgggggk...",
      "..kgLgggggggk..",
      ".kgglgggggggGk.",
      ".kggwkgggwkgGk.",
      ".kggkkgggkkGGk.",
      ".kggkkgggkkGGk.",
      ".kggggggggGGGk.",
      ".kGGGGGGGGGGGk.",
      ".kGGGGGGGGGGGk.",
      "..kkkkkkkkkkk.."
     ]
    },
    {
     "ms": 200,
     "rows": [
      "...............",
      "...............",
      "...............",
      "...............",
      "...............",
      ".....kkkkk.....",
      "...kkgggggkk...",
      "..kglgggggggk..",
      ".kgLgggggggggk.",
      "kgglwkgggwkggGk",
      "kgggkkgggkkgGGk",
      "kgggkkgggkkGGGk",
      "kGGGGGGGGGGGGGk",
      "kGGGGGGGGGGGGGk",
      ".kkkkkkkkkkkkk."
     ]
    },
    {
     "ms": 200,
     "rows": [
      "...............",
      "...............",
      "...............",
      ".....kkkkk.....",
      "....kgggggk....",
      "...kglgggggk...",
      "..kgLgggggggk..",
      ".kgglgggggggGk.",
      ".kggwkgggwkgGk.",
      ".kggkkgggkkGGk.",
      ".kggkkgggkkGGk.",
      ".kggggggggGGGk.",
      ".kGGGGGGGGGGGk.",
      ".kGGGGGGGGGGGk.",
      "..kkkkkkkkkkk.."
     ]
    },
    {
     "ms": 200,
     "rows": [
      "...............",
      "......kkk......",
      ".....kgggk.....",
      "....kglgggk....",
      "...kgLgggggk...",
      "...kglgggggk...",
      "..kggggggggGk..",
      "..kgwkgggwkGk..",
      "..kgkkgggkkGk..",
      "..kgkkgggkkGk..",
      "..kgggggggGGk..",
      "..kgggggggGGk..",
      "..kGGGGGGGGGk..",
      "..kGGGGGGGGGk..",
      "...kkkkkkkkk..."
     ]
    }
   ]
  },
  "blue_idle": {
   "key": "blue_idle",
   "name": "slime_blue_idle",
   "id": "characters/slime/blue_idle",
   "label": "Slime bleu – animation repos",
   "kind": "anim",
   "w": 15,
   "h": 15,
   "size": 16,
   "props": {
    "color": "blue",
    "state": "idle"
   },
   "tags": [],
   "png": "library/png/characters/slime/blue_idle.png",
   "gif": "library/png/characters/slime/blue_idle.gif",
   "frameCount": 4,
   "loopMs": 800,
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAAFVBMVEUAAAAaFCMvT7NPj+Cf0P8dKmv7+/8O/rq+AAAAAXRSTlMAQObYZgAAAD9JREFUeNqdzjEOACAIQ1F/Fe9/ZEMg4qCL3R4E0tZ+guegPBT7OUBDqgHKtWSEpz+YbOMGezmv01a5OcqSlRdiYAFIbV/BnQAAAABJRU5ErkJggg==",
   "strip": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAPCAMAAACPzFxDAAAAFVBMVEUAAAAaFCMvT7NPj+Cf0P8dKmv7+/8O/rq+AAAAAXRSTlMAQObYZgAAAIxJREFUeNq9kuEOwyAIBj0sff9H7qoihbou2ZL57/w4UGMpf17A966IEHs9dIspUoN99ord8iRPkS1xjXYYldIb9l62wRjFKmWAqGG9bjCRZbqf/s6UB7fYJzU7pQVpB8NlY6VNsmrpfEk/y4aiS3ncQdMTJHmyp3dZfREoM6H6d7l/CexjwFuO1S84AKNQBPm9H6e0AAAAAElFTkSuQmCC",
   "gifSrc": "data:image/gif;base64,R0lGODlhDwAPAPIAAAAAABoUIy9Ps0+P4J/Q/x0qa/v7/wAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJFAAAACwAAAAADwAPAAADOAi63P4wtkBpDCLn8PDQ2yQQoMYpmPCVQnGmRirE7bvJVOGitxnoNlYLiNIZj0TAD4k8KSvQiiIBACH5BAkUAAAALAAAAAAPAA8AAAMvCLrc/jDKSVW4F17BeWaBMHRksIQEqZqhaLTCyxWbB28Ffe+53v9AXzDIwhiPgAQAIfkECRQAAAAsAAAAAA8ADwAAAzgIutz+MLZAaQwi5/Dw0NskEKDGKZjwlUJxpkYqxO27yVThorcZ6DZWC4jSGY9EwA+JPCkr0IoiAQAh+QQJFAAAACwAAAAADwAPAAADOAi63B7QtSBqkIqOKu4TBGd9m+gtlMgVJ0AZqQCzDAVxEI12cd7GooIuo6oIf8KkEqlcTiBQ6CIBADs=",
   "palette": {
    "I": "#9fd0ff",
    "U": "#1d2a6b",
    "i": "#4f8fe0",
    "k": "#1a1423",
    "u": "#2f4fb3",
    "w": "#fbfbff"
   },
   "rows": [
    "...............",
    "...............",
    "...............",
    ".....kkkkk.....",
    "....kuuuuuk....",
    "...kuiuuuuuk...",
    "..kuIuuuuuuuk..",
    ".kuuiuuuuuuuUk.",
    ".kuuwkuuuwkuUk.",
    ".kuukkuuukkUUk.",
    ".kuukkuuukkUUk.",
    ".kuuuuuuuuUUUk.",
    ".kUUUUUUUUUUUk.",
    ".kUUUUUUUUUUUk.",
    "..kkkkkkkkkkk.."
   ],
   "frames": [
    {
     "ms": 200,
     "rows": [
      "...............",
      "...............",
      "...............",
      ".....kkkkk.....",
      "....kuuuuuk....",
      "...kuiuuuuuk...",
      "..kuIuuuuuuuk..",
      ".kuuiuuuuuuuUk.",
      ".kuuwkuuuwkuUk.",
      ".kuukkuuukkUUk.",
      ".kuukkuuukkUUk.",
      ".kuuuuuuuuUUUk.",
      ".kUUUUUUUUUUUk.",
      ".kUUUUUUUUUUUk.",
      "..kkkkkkkkkkk.."
     ]
    },
    {
     "ms": 200,
     "rows": [
      "...............",
      "...............",
      "...............",
      "...............",
      "...............",
      ".....kkkkk.....",
      "...kkuuuuukk...",
      "..kuiuuuuuuuk..",
      ".kuIuuuuuuuuuk.",
      "kuuiwkuuuwkuuUk",
      "kuuukkuuukkuUUk",
      "kuuukkuuukkUUUk",
      "kUUUUUUUUUUUUUk",
      "kUUUUUUUUUUUUUk",
      ".kkkkkkkkkkkkk."
     ]
    },
    {
     "ms": 200,
     "rows": [
      "...............",
      "...............",
      "...............",
      ".....kkkkk.....",
      "....kuuuuuk....",
      "...kuiuuuuuk...",
      "..kuIuuuuuuuk..",
      ".kuuiuuuuuuuUk.",
      ".kuuwkuuuwkuUk.",
      ".kuukkuuukkUUk.",
      ".kuukkuuukkUUk.",
      ".kuuuuuuuuUUUk.",
      ".kUUUUUUUUUUUk.",
      ".kUUUUUUUUUUUk.",
      "..kkkkkkkkkkk.."
     ]
    },
    {
     "ms": 200,
     "rows": [
      "...............",
      "......kkk......",
      ".....kuuuk.....",
      "....kuiuuuk....",
      "...kuIuuuuuk...",
      "...kuiuuuuuk...",
      "..kuuuuuuuuUk..",
      "..kuwkuuuwkUk..",
      "..kukkuuukkUk..",
      "..kukkuuukkUk..",
      "..kuuuuuuuUUk..",
      "..kuuuuuuuUUk..",
      "..kUUUUUUUUUk..",
      "..kUUUUUUUUUk..",
      "...kkkkkkkkk..."
     ]
    }
   ]
  },
  "red_idle": {
   "key": "red_idle",
   "name": "slime_red_idle",
   "id": "characters/slime/red_idle",
   "label": "Slime rouge – animation repos",
   "kind": "anim",
   "w": 15,
   "h": 15,
   "size": 16,
   "props": {
    "color": "red",
    "state": "idle"
   },
   "tags": [],
   "png": "library/png/characters/slime/red_idle.png",
   "gif": "library/png/characters/slime/red_idle.gif",
   "frameCount": 4,
   "loopMs": 800,
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAAFVBMVEUAAAAaFCOyOizgeCrzw0puHyT7+/997c/1AAAAAXRSTlMAQObYZgAAAD9JREFUeNqdzjEOACAIQ1F/Fe9/ZEMg4qCL3R4E0tZ+guegPBT7OUBDqgHKtWSEpz+YbOMGezmv01a5OcqSlRdiYAFIbV/BnQAAAABJRU5ErkJggg==",
   "strip": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAPCAMAAACPzFxDAAAAFVBMVEUAAAAaFCOyOizgeCrzw0puHyT7+/997c/1AAAAAXRSTlMAQObYZgAAAIxJREFUeNq9kuEOwyAIBj0sff9H7qoihbou2ZL57/w4UGMpf17A966IEHs9dIspUoN99ord8iRPkS1xjXYYldIb9l62wRjFKmWAqGG9bjCRZbqf/s6UB7fYJzU7pQVpB8NlY6VNsmrpfEk/y4aiS3ncQdMTJHmyp3dZfREoM6H6d7l/CexjwFuO1S84AKNQBPm9H6e0AAAAAElFTkSuQmCC",
   "gifSrc": "data:image/gif;base64,R0lGODlhDwAPAPIAAAAAABoUI7I6LOB4KvPDSm4fJPv7/wAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJFAAAACwAAAAADwAPAAADOAi63P4wtkBpDCLn8PDQ2yQQoMYpmPCVQnGmRirE7bvJVOGitxnoNlYLiNIZj0TAD4k8KSvQiiIBACH5BAkUAAAALAAAAAAPAA8AAAMvCLrc/jDKSVW4F17BeWaBMHRksIQEqZqhaLTCyxWbB28Ffe+53v9AXzDIwhiPgAQAIfkECRQAAAAsAAAAAA8ADwAAAzgIutz+MLZAaQwi5/Dw0NskEKDGKZjwlUJxpkYqxO27yVThorcZ6DZWC4jSGY9EwA+JPCkr0IoiAQAh+QQJFAAAACwAAAAADwAPAAADOAi63B7QtSBqkIqOKu4TBGd9m+gtlMgVJ0AZqQCzDAVxEI12cd7GooIuo6oIf8KkEqlcTiBQ6CIBADs=",
   "palette": {
    "R": "#6e1f24",
    "k": "#1a1423",
    "o": "#e0782a",
    "r": "#b23a2c",
    "w": "#fbfbff",
    "y": "#f3c34a"
   },
   "rows": [
    "...............",
    "...............",
    "...............",
    ".....kkkkk.....",
    "....krrrrrk....",
    "...krorrrrrk...",
    "..kryrrrrrrrk..",
    ".krrorrrrrrrRk.",
    ".krrwkrrrwkrRk.",
    ".krrkkrrrkkRRk.",
    ".krrkkrrrkkRRk.",
    ".krrrrrrrrRRRk.",
    ".kRRRRRRRRRRRk.",
    ".kRRRRRRRRRRRk.",
    "..kkkkkkkkkkk.."
   ],
   "frames": [
    {
     "ms": 200,
     "rows": [
      "...............",
      "...............",
      "...............",
      ".....kkkkk.....",
      "....krrrrrk....",
      "...krorrrrrk...",
      "..kryrrrrrrrk..",
      ".krrorrrrrrrRk.",
      ".krrwkrrrwkrRk.",
      ".krrkkrrrkkRRk.",
      ".krrkkrrrkkRRk.",
      ".krrrrrrrrRRRk.",
      ".kRRRRRRRRRRRk.",
      ".kRRRRRRRRRRRk.",
      "..kkkkkkkkkkk.."
     ]
    },
    {
     "ms": 200,
     "rows": [
      "...............",
      "...............",
      "...............",
      "...............",
      "...............",
      ".....kkkkk.....",
      "...kkrrrrrkk...",
      "..krorrrrrrrk..",
      ".kryrrrrrrrrrk.",
      "krrowkrrrwkrrRk",
      "krrrkkrrrkkrRRk",
      "krrrkkrrrkkRRRk",
      "kRRRRRRRRRRRRRk",
      "kRRRRRRRRRRRRRk",
      ".kkkkkkkkkkkkk."
     ]
    },
    {
     "ms": 200,
     "rows": [
      "...............",
      "...............",
      "...............",
      ".....kkkkk.....",
      "....krrrrrk....",
      "...krorrrrrk...",
      "..kryrrrrrrrk..",
      ".krrorrrrrrrRk.",
      ".krrwkrrrwkrRk.",
      ".krrkkrrrkkRRk.",
      ".krrkkrrrkkRRk.",
      ".krrrrrrrrRRRk.",
      ".kRRRRRRRRRRRk.",
      ".kRRRRRRRRRRRk.",
      "..kkkkkkkkkkk.."
     ]
    },
    {
     "ms": 200,
     "rows": [
      "...............",
      "......kkk......",
      ".....krrrk.....",
      "....krorrrk....",
      "...kryrrrrrk...",
      "...krorrrrrk...",
      "..krrrrrrrrRk..",
      "..krwkrrrwkRk..",
      "..krkkrrrkkRk..",
      "..krkkrrrkkRk..",
      "..krrrrrrrRRk..",
      "..krrrrrrrRRk..",
      "..kRRRRRRRRRk..",
      "..kRRRRRRRRRk..",
      "...kkkkkkkkk..."
     ]
    }
   ]
  },
  "purple_idle": {
   "key": "purple_idle",
   "name": "slime_purple_idle",
   "id": "characters/slime/purple_idle",
   "label": "Slime violet – animation repos",
   "kind": "anim",
   "w": 15,
   "h": 15,
   "size": 16,
   "props": {
    "color": "purple",
    "state": "idle"
   },
   "tags": [],
   "png": "library/png/characters/slime/purple_idle.png",
   "gif": "library/png/characters/slime/purple_idle.gif",
   "frameCount": 4,
   "loopMs": 800,
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAAFVBMVEUAAAAaFCN6P7C3fuD/s88/H2P7+/+i/CdAAAAAAXRSTlMAQObYZgAAAD9JREFUeNqdzjEOACAIQ1F/Fe9/ZEMg4qCL3R4E0tZ+guegPBT7OUBDqgHKtWSEpz+YbOMGezmv01a5OcqSlRdiYAFIbV/BnQAAAABJRU5ErkJggg==",
   "strip": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAPCAMAAACPzFxDAAAAFVBMVEUAAAAaFCN6P7C3fuD/s88/H2P7+/+i/CdAAAAAAXRSTlMAQObYZgAAAIxJREFUeNq9kuEOwyAIBj0sff9H7qoihbou2ZL57/w4UGMpf17A966IEHs9dIspUoN99ord8iRPkS1xjXYYldIb9l62wRjFKmWAqGG9bjCRZbqf/s6UB7fYJzU7pQVpB8NlY6VNsmrpfEk/y4aiS3ncQdMTJHmyp3dZfREoM6H6d7l/CexjwFuO1S84AKNQBPm9H6e0AAAAAElFTkSuQmCC",
   "gifSrc": "data:image/gif;base64,R0lGODlhDwAPAPIAAAAAABoUI3o/sLd+4P+zzz8fY/v7/wAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJFAAAACwAAAAADwAPAAADOAi63P4wtkBpDCLn8PDQ2yQQoMYpmPCVQnGmRirE7bvJVOGitxnoNlYLiNIZj0TAD4k8KSvQiiIBACH5BAkUAAAALAAAAAAPAA8AAAMvCLrc/jDKSVW4F17BeWaBMHRksIQEqZqhaLTCyxWbB28Ffe+53v9AXzDIwhiPgAQAIfkECRQAAAAsAAAAAA8ADwAAAzgIutz+MLZAaQwi5/Dw0NskEKDGKZjwlUJxpkYqxO27yVThorcZ6DZWC4jSGY9EwA+JPCkr0IoiAQAh+QQJFAAAACwAAAAADwAPAAADOAi63B7QtSBqkIqOKu4TBGd9m+gtlMgVJ0AZqQCzDAVxEI12cd7GooIuo6oIf8KkEqlcTiBQ6CIBADs=",
   "palette": {
    "V": "#3f1f63",
    "Z": "#ffb3cf",
    "k": "#1a1423",
    "v": "#7a3fb0",
    "w": "#fbfbff",
    "x": "#b77ee0"
   },
   "rows": [
    "...............",
    "...............",
    "...............",
    ".....kkkkk.....",
    "....kvvvvvk....",
    "...kvxvvvvvk...",
    "..kvZvvvvvvvk..",
    ".kvvxvvvvvvvVk.",
    ".kvvwkvvvwkvVk.",
    ".kvvkkvvvkkVVk.",
    ".kvvkkvvvkkVVk.",
    ".kvvvvvvvvVVVk.",
    ".kVVVVVVVVVVVk.",
    ".kVVVVVVVVVVVk.",
    "..kkkkkkkkkkk.."
   ],
   "frames": [
    {
     "ms": 200,
     "rows": [
      "...............",
      "...............",
      "...............",
      ".....kkkkk.....",
      "....kvvvvvk....",
      "...kvxvvvvvk...",
      "..kvZvvvvvvvk..",
      ".kvvxvvvvvvvVk.",
      ".kvvwkvvvwkvVk.",
      ".kvvkkvvvkkVVk.",
      ".kvvkkvvvkkVVk.",
      ".kvvvvvvvvVVVk.",
      ".kVVVVVVVVVVVk.",
      ".kVVVVVVVVVVVk.",
      "..kkkkkkkkkkk.."
     ]
    },
    {
     "ms": 200,
     "rows": [
      "...............",
      "...............",
      "...............",
      "...............",
      "...............",
      ".....kkkkk.....",
      "...kkvvvvvkk...",
      "..kvxvvvvvvvk..",
      ".kvZvvvvvvvvvk.",
      "kvvxwkvvvwkvvVk",
      "kvvvkkvvvkkvVVk",
      "kvvvkkvvvkkVVVk",
      "kVVVVVVVVVVVVVk",
      "kVVVVVVVVVVVVVk",
      ".kkkkkkkkkkkkk."
     ]
    },
    {
     "ms": 200,
     "rows": [
      "...............",
      "...............",
      "...............",
      ".....kkkkk.....",
      "....kvvvvvk....",
      "...kvxvvvvvk...",
      "..kvZvvvvvvvk..",
      ".kvvxvvvvvvvVk.",
      ".kvvwkvvvwkvVk.",
      ".kvvkkvvvkkVVk.",
      ".kvvkkvvvkkVVk.",
      ".kvvvvvvvvVVVk.",
      ".kVVVVVVVVVVVk.",
      ".kVVVVVVVVVVVk.",
      "..kkkkkkkkkkk.."
     ]
    },
    {
     "ms": 200,
     "rows": [
      "...............",
      "......kkk......",
      ".....kvvvk.....",
      "....kvxvvvk....",
      "...kvZvvvvvk...",
      "...kvxvvvvvk...",
      "..kvvvvvvvvVk..",
      "..kvwkvvvwkVk..",
      "..kvkkvvvkkVk..",
      "..kvkkvvvkkVk..",
      "..kvvvvvvvVVk..",
      "..kvvvvvvvVVk..",
      "..kVVVVVVVVVk..",
      "..kVVVVVVVVVk..",
      "...kkkkkkkkk..."
     ]
    }
   ]
  },
  "green_hurt": {
   "key": "green_hurt",
   "name": "slime_green_hurt",
   "id": "characters/slime/green_hurt",
   "label": "Slime vert – touché",
   "kind": "sprite",
   "w": 15,
   "h": 15,
   "size": 16,
   "props": {
    "color": "green",
    "state": "hurt"
   },
   "tags": [],
   "png": "library/png/characters/slime/green_hurt.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAAD1BMVEUAAAAaFCNarkWl11ouejqqV2b0AAAAAXRSTlMAQObYZgAAADtJREFUeNq1jkEKADAIw9rO/795aHE4dl4OYloEgR8wGaakE2rJ8NYKKFF5kDMIr1Uq7Kcvj8nr/qXBBkSPAQ847sBIAAAAAElFTkSuQmCC",
   "palette": {
    "L": "#a5d75a",
    "g": "#2e7a3a",
    "k": "#1a1423",
    "l": "#5aae45"
   },
   "rows": [
    "...............",
    "...............",
    "...............",
    "...............",
    "...............",
    ".....kkkkk.....",
    "...kklllllkk...",
    "..klLlllllllk..",
    ".klLlllllllllk.",
    "kllklklllklklgk",
    "klllklllllklggk",
    "kllklklllklkggk",
    "kgggggggggggggk",
    "kgggggggggggggk",
    ".kkkkkkkkkkkkk."
   ]
  },
  "king_32": {
   "key": "king_32",
   "name": "slime_king_32",
   "id": "characters/slime/king_32",
   "label": "Roi slime couronné (32 px)",
   "kind": "sprite",
   "w": 29,
   "h": 26,
   "size": 32,
   "props": {
    "color": "green",
    "state": "idle"
   },
   "tags": [
    "boss"
   ],
   "png": "library/png/characters/slime/king_32.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAaCAMAAAB8SKeFAAAAJFBMVEUAAAAaFCPzw0r/8KiyOixPj+DgeCparkUuejql11ofSiz7+/8ZuF87AAAAAXRSTlMAQObYZgAAAIZJREFUeNqVzwsSgyAMBFA21EqX+9/X4WOIEmy7M0yARxRC0MCMKRDo8FQgUUpxNUpJXPW+RGSbeutd8D6DC2MHkGyM43Ozi2NPXjojpQeuSpr9toBtZT9APYihOfe76YQYrY4SqkB7dO61/GHWs/IPvYVNffaw7o3Z6st8Uv6qXOebBqwTDj7eD6CcdlFfAAAAAElFTkSuQmCC",
   "palette": {
    "G": "#1f4a2c",
    "L": "#a5d75a",
    "Y": "#fff0a8",
    "g": "#2e7a3a",
    "i": "#4f8fe0",
    "k": "#1a1423",
    "l": "#5aae45",
    "o": "#e0782a",
    "r": "#b23a2c",
    "w": "#fbfbff",
    "y": "#f3c34a"
   },
   "rows": [
    "..........k...k...k..........",
    ".........kyk.kyk.kyk.........",
    ".........kyykyYykyyk.........",
    ".........kyYyyyyyYyk.........",
    ".........kyyryyyiyyk.........",
    "....k...kkoooooooookk........",
    "...klkkkgggggggggggggkk......",
    "..kLkkgggggggggggggggggkk....",
    "..klgggggggggggggggggggggk...",
    "..kgggggggggggggggggggggggk..",
    "..kggggGGgggggggggggGGggggk..",
    ".kgggggggGGGgggggGGGgggggggk.",
    ".kggggggwwkkgggggwwkkgggggGk.",
    "kgggggggwwkkgggggwwkkgggggGGk",
    "kgggggggkkkkkgggwkkkkggggGGGk",
    "kgggggggkkkkkgggkkkkkgggGGGGk",
    "kgggggggkkkkkgggkkkkkgggGGGGk",
    "kggggggggggggggggggggggGGGGGk",
    ".kggggggggggggggggggggGGGGGk.",
    "kgggggggggggGGGGGgggggGGGGGGk",
    "kggggggggggggggggggggGGGGGGGk",
    "kgggggggggggggggggggGGGGGGGGk",
    "kgggggggggggggggggggGGGGGGGGk",
    "kGGGGGGGGGGGGGGGGGGGGGGGGGGGk",
    "kGGGGGGGGGGGGGGGGGGGGGGGGGGGk",
    ".kkkkkkkkkkkkkkkkkkkkkkkkkkk."
   ]
  }
 }
};
export default asset;
