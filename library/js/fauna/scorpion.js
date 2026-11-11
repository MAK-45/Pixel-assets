// GÉNÉRÉ par scripts/build.js — ne pas modifier. Source : assets/fauna/scorpion.px.js
// Scorpion — 7 variante(s). Usage :
//   import asset from "./scorpion.js"; const v = asset.variants["sand_16"];
//   v.src (data URL PNG), v.rows + v.palette (pixels, "." = transparent), v.w, v.h
/** @type {import("../../index.d.ts").PixelAsset} */
export const asset = {
 "id": "fauna/scorpion",
 "slug": "scorpion",
 "category": "fauna",
 "title": "Scorpion",
 "description": "Scorpions du désert vus de profil (tête à droite), queue recourbée au-dessus du dos : petit scorpion (16 px) jaune des sables, noir ou rouge, petit scorpion qui marche (animé, 4 images de 100 ms), grand scorpion détaillé (32 px) jaune ou noir, et grand scorpion qui marche en agitant son dard. Lumière en haut à gauche, contour sombre.",
 "tags": [
  "scorpion",
  "desert",
  "arachnid",
  "critter",
  "enemy",
  "venom",
  "sand",
  "fauna"
 ],
 "order": 0,
 "source": "assets/fauna/scorpion.px.js",
 "module": "library/js/fauna/scorpion.js",
 "sheet": {
  "png": "library/sheets/fauna/scorpion.png",
  "json": "library/sheets/fauna/scorpion.json"
 },
 "axes": {
  "color": [
   "sand",
   "black",
   "red"
  ],
  "state": [
   "idle",
   "walk"
  ]
 },
 "sizes": [
  16,
  32
 ],
 "variantCount": 7,
 "variants": {
  "sand_16": {
   "key": "sand_16",
   "name": "scorpion_sand_16",
   "id": "fauna/scorpion/sand_16",
   "label": "Scorpion des sables (16 px)",
   "kind": "sprite",
   "w": 16,
   "h": 12,
   "size": 16,
   "props": {
    "color": "sand",
    "state": "idle"
   },
   "tags": [],
   "png": "library/png/fauna/scorpion/sand_16.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAMCAMAAABcOc2zAAAAElBMVEUAAAAaFCPJmlucazxqQSg7IhmJ06U9AAAAAXRSTlMAQObYZgAAAEVJREFUeNpdjVEOwDAIQnli73/lpca1bo8fIQQlSQAaEGEz/W6MpG5y8QnEbCTFCXHULNFDuMiwe4gsyPcVq/X3909r8wBJJgDZhx0iRwAAAABJRU5ErkJggg==",
   "palette": {
    "B": "#3b2219",
    "N": "#c99a5b",
    "b": "#6a4128",
    "k": "#1a1423",
    "n": "#9c6b3c"
   },
   "rows": [
    "....kkkk........",
    "...kNNnnk.......",
    "..kNkkkknk......",
    "..knk..kbBk.....",
    "..knk...kk......",
    "..knbkkkkkk.kk..",
    "...knNNNnnkkNnk.",
    "...knnnnnnbNnnBk",
    "....kbbbbbbkbnk.",
    "....kBkBkBkBkk..",
    "...kBkBkBkBk....",
    "....k.k.k.k....."
   ]
  },
  "black_16": {
   "key": "black_16",
   "name": "scorpion_black_16",
   "id": "fauna/scorpion/black_16",
   "label": "Scorpion noir (16 px)",
   "kind": "sprite",
   "w": 16,
   "h": 12,
   "size": 16,
   "props": {
    "color": "black",
    "state": "idle"
   },
   "tags": [],
   "png": "library/png/fauna/scorpion/black_16.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAMCAMAAABcOc2zAAAAD1BMVEUAAAAaFCOLiqNXVnAvLTyyb6b0AAAAAXRSTlMAQObYZgAAAENJREFUeNpdjUEOwEAIAhnh/29u1tjWdrgIIShJAtCCKpvtT2MlfZPwCcRuhOYJcfUsNUO4SdkzRBpyvyKjv3//jA4XR0EAz9KHJS4AAAAASUVORK5CYII=",
   "palette": {
    "c": "#8b8aa3",
    "d": "#2f2d3c",
    "k": "#1a1423",
    "m": "#575670"
   },
   "rows": [
    "....kkkk........",
    "...kccmmk.......",
    "..kckkkkmk......",
    "..kmk..kddk.....",
    "..kmk...kk......",
    "..kmdkkkkkk.kk..",
    "...kmcccmmkkcmk.",
    "...kmmmmmmdcmmdk",
    "....kddddddkdmk.",
    "....kdkdkdkdkk..",
    "...kdkdkdkdk....",
    "....k.k.k.k....."
   ]
  },
  "red_16": {
   "key": "red_16",
   "name": "scorpion_red_16",
   "id": "fauna/scorpion/red_16",
   "label": "Scorpion rouge (16 px)",
   "kind": "sprite",
   "w": 16,
   "h": 12,
   "size": 16,
   "props": {
    "color": "red",
    "state": "idle"
   },
   "tags": [],
   "png": "library/png/fauna/scorpion/red_16.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAMCAMAAABcOc2zAAAAElBMVEUAAAAaFCPgeCqyOixuHyQ7IhmInAo3AAAAAXRSTlMAQObYZgAAAEVJREFUeNpdjVEOwDAIQnli73/lpca1bo8fIQQlSQAaEGEz/W6MpG5y8QnEbCTFCXHULNFDuMiwe4gsyPcVq/X3909r8wBJJgDZhx0iRwAAAABJRU5ErkJggg==",
   "palette": {
    "B": "#3b2219",
    "R": "#6e1f24",
    "k": "#1a1423",
    "o": "#e0782a",
    "r": "#b23a2c"
   },
   "rows": [
    "....kkkk........",
    "...koorrk.......",
    "..kokkkkrk......",
    "..krk..kRBk.....",
    "..krk...kk......",
    "..krRkkkkkk.kk..",
    "...krooorrkkork.",
    "...krrrrrrRorrBk",
    "....kRRRRRRkRrk.",
    "....kBkBkBkBkk..",
    "...kBkBkBkBk....",
    "....k.k.k.k....."
   ]
  },
  "sand_walk_16": {
   "key": "sand_walk_16",
   "name": "scorpion_sand_walk_16",
   "id": "fauna/scorpion/sand_walk_16",
   "label": "Scorpion des sables qui marche (16 px, animé)",
   "kind": "anim",
   "w": 16,
   "h": 12,
   "size": 16,
   "props": {
    "color": "sand",
    "state": "walk"
   },
   "tags": [
    "animated"
   ],
   "png": "library/png/fauna/scorpion/sand_walk_16.png",
   "gif": "library/png/fauna/scorpion/sand_walk_16.gif",
   "frameCount": 4,
   "loopMs": 400,
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAMCAMAAABcOc2zAAAAElBMVEUAAAAaFCPJmlucazxqQSg7IhmJ06U9AAAAAXRSTlMAQObYZgAAAEVJREFUeNpdjVEOwDAIQnli73/lpca1bo8fIQQlSQAaEGEz/W6MpG5y8QnEbCTFCXHULNFDuMiwe4gsyPcVq/X3909r8wBJJgDZhx0iRwAAAABJRU5ErkJggg==",
   "strip": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAMCAMAAADlLUv7AAAAElBMVEUAAAAaFCPJmlucazxqQSg7IhmJ06U9AAAAAXRSTlMAQObYZgAAAHRJREFUeNqdklEOwzAIQ/0wu/+VJ9i6RpHaLjFfz04IQpEkAWjQI2viCJsVxh5aEPXCeeIPFjhPozLyxcgiucsHPi7MPDe8PK+apvU1V7mc6DURZoeFWxl2z73KtZEW6T2uhX3qt7fDWMy1l/fX7NKFcZe/AVggA2FH7M3AAAAAAElFTkSuQmCC",
   "gifSrc": "data:image/gif;base64,R0lGODlhEAAMAPIAAAAAABoUI8maW5xrPGpBKDsiGQAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJCgAAACwAAAAAEAAMAAADNwgK0bEQBiHGeHFNF25WHRYQBRaFmnkOBNcwKjNQ1TV5mqWzdSkRwOAIpykZA6UYcnn8MJ6PWAIAIfkECQoAAAAsAAAAABAADAAAAzYICtGxEAYhxnhxTRduVh3GEKLkgUWpDST3NFFHVdd0glbO0qlE/MAA4aZJGQO92PH4YThfkAQAIfkECQoAAAAsAAAAABAADAAAAzcICtGxEAYhxnhxTRduVh0WEAUWhZp5DgTXMCozUNU1eZqls3UpEcDgCKcpGQOlGHJ5/DCej1gCACH5BAkKAAAALAAAAAAQAAwAAAM4CArBvXAFEcYILzLqBslQ9QREAUqXdKIf5jpRJcwWJqSopRP3YIaEoJCEC5mOgV8MidQoGlAGJAEAOw==",
   "palette": {
    "B": "#3b2219",
    "N": "#c99a5b",
    "b": "#6a4128",
    "k": "#1a1423",
    "n": "#9c6b3c"
   },
   "rows": [
    "....kkkk........",
    "...kNNnnk.......",
    "..kNkkkknk......",
    "..knk..kbBk.....",
    "..knk...kk......",
    "..knbkkkkkk.kk..",
    "...knNNNnnkkNnk.",
    "...knnnnnnbNnnBk",
    "....kbbbbbbkbnk.",
    "....kBkBkBkBkk..",
    "...kBkBkBkBk....",
    "....k.k.k.k....."
   ],
   "frames": [
    {
     "ms": 100,
     "rows": [
      "....kkkk........",
      "...kNNnnk.......",
      "..kNkkkknk......",
      "..knk..kbBk.....",
      "..knk...kk......",
      "..knbkkkkkk.kk..",
      "...knNNNnnkkNnk.",
      "...knnnnnnbNnnBk",
      "....kbbbbbbkbnk.",
      "....kBkBkBkBkk..",
      "...kBkBkBkBk....",
      "....k.k.k.k....."
     ]
    },
    {
     "ms": 100,
     "rows": [
      "....kkkk........",
      "...kNNnnk.......",
      "..kNkkkknk......",
      "..knk...kbk.....",
      "..knk...kBk.....",
      "..knbkkkkkk.kk..",
      "...knNNNnnkkNnk.",
      "...knnnnnnbNnnBk",
      "....kbbbbbbkbnk.",
      ".....kBkBkBkBk..",
      "....kBkBkBkBk...",
      ".....k.k.k.k...."
     ]
    },
    {
     "ms": 100,
     "rows": [
      "....kkkk........",
      "...kNNnnk.......",
      "..kNkkkknk......",
      "..knk..kbBk.....",
      "..knk...kk......",
      "..knbkkkkkk.kk..",
      "...knNNNnnkkNnk.",
      "...knnnnnnbNnnBk",
      "....kbbbbbbkbnk.",
      "....kBkBkBkBkk..",
      "...kBkBkBkBk....",
      "....k.k.k.k....."
     ]
    },
    {
     "ms": 100,
     "rows": [
      "....k.kk........",
      "...kNknnkk......",
      "..kNk.kknbk.....",
      "..knk..kbBk.....",
      "..knk...kk......",
      "..knbkkkkkk.kk..",
      "...knNNNnnkkNnk.",
      "...knnnnnnbNnnBk",
      "....kbbbbbbkbnk.",
      ".....kBkBkBkBk..",
      "....kBkBkBkBk...",
      ".....k.k.k.k...."
     ]
    }
   ]
  },
  "sand_32": {
   "key": "sand_32",
   "name": "scorpion_sand_32",
   "id": "fauna/scorpion/sand_32",
   "label": "Grand scorpion des sables",
   "kind": "sprite",
   "w": 32,
   "h": 30,
   "size": 32,
   "props": {
    "color": "sand",
    "state": "idle"
   },
   "tags": [],
   "png": "library/png/fauna/scorpion/sand_32.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAeCAMAAAB61OwbAAAAFVBMVEUAAAAaFCPJmlucazxqQSg7Ihn/8KhtcZoQAAAAAXRSTlMAQObYZgAAALJJREFUeNqtkQEOwyAMA+s42/+fXMUUAhQ6TZuFREWO4MbH8U8BeCzCyC2hIsltExVJ57oJEEVoWwHqr947II/XhPo/AukddO8BNAv1wBPQaGZncH+11+wqdBZ0rRCq4/ocfDUgFDcLOhsTUAwJHSOARM8nXKNsslBvXa+8zXKV7NDPmhZ92uLgTIY4AfwJCA3/Dr9pSjUm3CnmPaceRwoi9jrv4xaBgAzki/pnoGbY9qoTnB0ERQPIqykAAAAASUVORK5CYII=",
   "palette": {
    "B": "#3b2219",
    "N": "#c99a5b",
    "Y": "#fff0a8",
    "b": "#6a4128",
    "k": "#1a1423",
    "n": "#9c6b3c"
   },
   "rows": [
    "................................",
    "................................",
    "...........kkk..................",
    ".......kkkkNnnk.................",
    "......kNnnknnnkkk...............",
    "......knnnknnbnnnk..............",
    "....kkknnbkkkknnnk..............",
    "...kNnnkkk...knnnk..............",
    "...knnnk......knnnk.............",
    "...knnbk......knnnk.............",
    "...kkkk.......knbbk...........k.",
    "..kNnnk.......kbbbk.......kkkkNk",
    "..knnnk.......kbbBk......knNnnnk",
    "..knnbk........kkkBk....knNnnkk.",
    "..knnk...........kBk....knnnnnbk",
    ".knNnnk...........k.....knnnbbbk",
    ".knnnnkk............kkkkkknbnkk.",
    "..knnbnnkkkkkkkkkkkkNNNNNnnnk...",
    "...kknNnnYNNYNNYNNYNNYnnnknnk...",
    "....knnnnNnbnnbnnbnnbnnnnNnnk...",
    "....knnnbnnbnnbnnbnnbnnnnnnnk...",
    "....knnnbnnbnnbnnbnnbnnnnnnnk...",
    "....knnnbnnbnnbnnbnnbbbbbnnk....",
    ".....kbbbbbbbbbbbbbbbbbbnnk.....",
    "......kkkBBBBBBBBBBBBkkBkk......",
    "........kBkkkkkBkBkkk.kBk.......",
    "........kBk...kBkBk...kBk.......",
    ".......kBk...kBkBk...kBk........",
    ".......kBk...kBkBk...kBk........",
    "........k.....k.k.....k........."
   ]
  },
  "black_32": {
   "key": "black_32",
   "name": "scorpion_black_32",
   "id": "fauna/scorpion/black_32",
   "label": "Grand scorpion noir",
   "kind": "sprite",
   "w": 32,
   "h": 30,
   "size": 32,
   "props": {
    "color": "black",
    "state": "idle"
   },
   "tags": [],
   "png": "library/png/fauna/scorpion/black_32.png",
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAeCAMAAAB61OwbAAAAElBMVEUAAAAaFCOLiqNXVnAvLTzDwtSDR+4SAAAAAXRSTlMAQObYZgAAALFJREFUeNqtkoEOwyAIRD2O/f8vL5xV0WqXZbuYaOUVrtBS/ikAj0EYeSQUJHlMoiDp3CcBIghtO0D5lfsEjOs9ofyPwPAOumcA3UK78AGoNauzBIB2BZIFvVYfFMd1nHx1IBTniq7GBNR6QucRQKKPEq5WdlkoW1eVl9lYdXbIvaZFnr44OZMhLgB/AkLTt8NvWqYaHU6Kfq9Th345uPbW73IbgYAxkC/in4E2w743vQF+6gQgep3EVAAAAABJRU5ErkJggg==",
   "palette": {
    "C": "#c3c2d4",
    "c": "#8b8aa3",
    "d": "#2f2d3c",
    "k": "#1a1423",
    "m": "#575670"
   },
   "rows": [
    "................................",
    "................................",
    "...........kkk..................",
    ".......kkkkcmmk.................",
    "......kcmmkmmmkkk...............",
    "......kmmmkmmdmmmk..............",
    "....kkkmmdkkkkmmmk..............",
    "...kcmmkkk...kmmmk..............",
    "...kmmmk......kmmmk.............",
    "...kmmdk......kmmmk.............",
    "...kkkk.......kmddk...........k.",
    "..kcmmk.......kdddk.......kkkkck",
    "..kmmmk.......kdddk......kmcmmmk",
    "..kmmdk........kkkdk....kmcmmkk.",
    "..kmmk...........kdk....kmmmmmdk",
    ".kmcmmk...........k.....kmmmdddk",
    ".kmmmmkk............kkkkkkmdmkk.",
    "..kmmdmmkkkkkkkkkkkkcccccmmmk...",
    "...kkmcmmCccCccCccCccCmmmkmmk...",
    "....kmmmmcmdmmdmmdmmdmmmmcmmk...",
    "....kmmmdmmdmmdmmdmmdmmmmmmmk...",
    "....kmmmdmmdmmdmmdmmdmmmmmmmk...",
    "....kmmmdmmdmmdmmdmmdddddmmk....",
    ".....kddddddddddddddddddmmk.....",
    "......kkkddddddddddddkkdkk......",
    "........kdkkkkkdkdkkk.kdk.......",
    "........kdk...kdkdk...kdk.......",
    ".......kdk...kdkdk...kdk........",
    ".......kdk...kdkdk...kdk........",
    "........k.....k.k.....k........."
   ]
  },
  "sand_walk_32": {
   "key": "sand_walk_32",
   "name": "scorpion_sand_walk_32",
   "id": "fauna/scorpion/sand_walk_32",
   "label": "Grand scorpion qui marche (animé)",
   "kind": "anim",
   "w": 32,
   "h": 30,
   "size": 32,
   "props": {
    "color": "sand",
    "state": "walk"
   },
   "tags": [
    "animated"
   ],
   "png": "library/png/fauna/scorpion/sand_walk_32.png",
   "gif": "library/png/fauna/scorpion/sand_walk_32.gif",
   "frameCount": 4,
   "loopMs": 400,
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAeCAMAAAB61OwbAAAAFVBMVEUAAAAaFCPJmlucazxqQSg7Ihn/8KhtcZoQAAAAAXRSTlMAQObYZgAAALJJREFUeNqtkQEOwyAMA+s42/+fXMUUAhQ6TZuFREWO4MbH8U8BeCzCyC2hIsltExVJ57oJEEVoWwHqr947II/XhPo/AukddO8BNAv1wBPQaGZncH+11+wqdBZ0rRCq4/ocfDUgFDcLOhsTUAwJHSOARM8nXKNsslBvXa+8zXKV7NDPmhZ92uLgTIY4AfwJCA3/Dr9pSjUm3CnmPaceRwoi9jrv4xaBgAzki/pnoGbY9qoTnB0ERQPIqykAAAAASUVORK5CYII=",
   "strip": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAeCAMAAADTjObKAAAAFVBMVEUAAAAaFCPJmlucazxqQSg7Ihn/8KhtcZoQAAAAAXRSTlMAQObYZgAAAVBJREFUeNrtlguOwyAMRBkMe/8jr8AJmI8NVZp0Va0ViUpvBjl2MHXuP2oAuCS4hAHAE8FyW4INv4V5byLSsszcEOz4DexcNhMFUrLkzXXBjt/CeW+A31HlThNs+jV81Bfnixh8Ltj2w6rf8HPKp4J9v1ahXF9zg7BIYNOvt6juH4JUoOO9AK/5e3xwcUARqiIfbbRcCmZ84Ze48LbFIcSSrWfQ1K0KpnzhF7jypsUprYjCMfAiUPjCX7DgSdC0LUKMDgzcnQkofOGvCVTeDekqyB0buIPNF35xXviLAA/p/lgAFAgPcO5RHlUlfAo5PW7lKaFUpR/v68N3C57hR5V8yrM8JDt3N+cPgjpBdwHcyf9gAike5Dyju3iU84gUkQamxSOAt/p5RCJP6pj/AMfxVj8Yr+OdftF/TvhY1pmi0XyX//MJnHdYWWeKVvMe/y/2YBEF0Oq4HwAAAABJRU5ErkJggg==",
   "gifSrc": "data:image/gif;base64,R0lGODlhIAAeAPIAAAAAABoUI8maW5xrPGpBKDsiGf/wqAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJCgAAACwAAAAAIAAeAAADuAi63P4wyhmDpdhaMUbAUsB5nXeBTlCqA7Gii9YRGuvBgNhp8QvbnwbwNwsyhqjaQ0WgTYy6W6rpTGkEQaSwWTD2RlJW1RroHgejU273NPdKrY8q/RSWqHK4ulJjmt4uJn19AoWFPkdzHQaFjAKOkCtsKXAcgZczlZN2mS2dmHCbZ5+knqFSnKagl1SBXlutsbJNoksWBbi5uri3eyFdNV3Acm4ZxWXIMcVtUMLNr7/Px8sUr3JCEQkAIfkECQoAAAAsAAAAACAAHgAAA74Iutz+MMopg6XUBhDEGBsGdZ/1gZfYBKc5EK2qaB+x0aVMouEcq6ycIwgC1noMInKiWS5YBFvl6Sk+AlHpSiMIKUfRwpJVtQa1V4v4OaimOMLK2nd63drxCJKYvbecQ01QKGwvJYKIAoqKP0lkHwaKkQKTlS15hR8eMIadnJqYdJ41pJ11VisnnKuln3WAfK2tWZyAM7S4uVmhWwEFv8DBwE1AvsZNYnMyHMk9xspAzU/Sy8zG09fVHNtJ3BEJACH5BAkKAAAALAAAAAAgAB4AAAO4CLrc/jDKGYOl2FoxRsBSwHmdd4FOUKoDsaKL1hEa68GA2GnxC9ufBvA3CzKGqNpDRaBNjLpbqulMaQRBpLBZMPZGUlbVGugeB6NTbvc090qtjyr9FJaocri6UmOa3i4mfX0ChYU+R3MdBoWMAo6QK2wpcByBlzOVk3aZLZ2YcJtnn6SeoVKcpqCXVIFeW62xsk2iSxYFuLm6uLd7IV01XcBybhnFZcgxxW1Qws2vv8/HyxSvckIRCQAh+QQJCgAAACwAAAAAIAAeAAADuQi63P4wygmDpRjYIMYImcR55BY+AekR5blsK+yB7vhdWlvrL5+lAwKtN6uZGimCkDK0DV/KJWojoAE/joCy8Ox1irlgV7HhIgdfXHjMCJjbKnEuLcqSoqDrjbmxBPdkKzN9hBYCh4c+ZClfBoeOApCSJWBnJB0sf5qZHnR2gpugnCpsV5mnonGVcKmhQVGZbGSwtLVRq1NuBbu8vbt9IRZcXH3DshNuyS/GLhrMZM810clvzXlIGhMJADs=",
   "palette": {
    "B": "#3b2219",
    "N": "#c99a5b",
    "Y": "#fff0a8",
    "b": "#6a4128",
    "k": "#1a1423",
    "n": "#9c6b3c"
   },
   "rows": [
    "................................",
    "................................",
    "...........kkk..................",
    ".......kkkkNnnk.................",
    "......kNnnknnnkkk...............",
    "......knnnknnbnnnk..............",
    "....kkknnbkkkknnnk..............",
    "...kNnnkkk...knnnk..............",
    "...knnnk......knnnk.............",
    "...knnbk......knnnk.............",
    "...kkkk.......knbbk...........k.",
    "..kNnnk.......kbbbk.......kkkkNk",
    "..knnnk.......kbbBk......knNnnnk",
    "..knnbk........kkkBk....knNnnkk.",
    "..knnk...........kBk....knnnnnbk",
    ".knNnnk...........k.....knnnbbbk",
    ".knnnnkk............kkkkkknbnkk.",
    "..knnbnnkkkkkkkkkkkkNNNNNnnnk...",
    "...kknNnnYNNYNNYNNYNNYnnnknnk...",
    "....knnnnNnbnnbnnbnnbnnnnNnnk...",
    "....knnnbnnbnnbnnbnnbnnnnnnnk...",
    "....knnnbnnbnnbnnbnnbnnnnnnnk...",
    "....knnnbnnbnnbnnbnnbbbbbnnk....",
    ".....kbbbbbbbbbbbbbbbbbbnnk.....",
    "......kkkBBBBBBBBBBBBkkBkk......",
    "........kBkkkkkBkBkkk.kBk.......",
    "........kBk...kBkBk...kBk.......",
    ".......kBk...kBkBk...kBk........",
    ".......kBk...kBkBk...kBk........",
    "........k.....k.k.....k........."
   ],
   "frames": [
    {
     "ms": 100,
     "rows": [
      "................................",
      "................................",
      "...........kkk..................",
      ".......kkkkNnnk.................",
      "......kNnnknnnkkk...............",
      "......knnnknnbnnnk..............",
      "....kkknnbkkkknnnk..............",
      "...kNnnkkk...knnnk..............",
      "...knnnk......knnnk.............",
      "...knnbk......knnnk.............",
      "...kkkk.......knbbk...........k.",
      "..kNnnk.......kbbbk.......kkkkNk",
      "..knnnk.......kbbBk......knNnnnk",
      "..knnbk........kkkBk....knNnnkk.",
      "..knnk...........kBk....knnnnnbk",
      ".knNnnk...........k.....knnnbbbk",
      ".knnnnkk............kkkkkknbnkk.",
      "..knnbnnkkkkkkkkkkkkNNNNNnnnk...",
      "...kknNnnYNNYNNYNNYNNYnnnknnk...",
      "....knnnnNnbnnbnnbnnbnnnnNnnk...",
      "....knnnbnnbnnbnnbnnbnnnnnnnk...",
      "....knnnbnnbnnbnnbnnbnnnnnnnk...",
      "....knnnbnnbnnbnnbnnbbbbbnnk....",
      ".....kbbbbbbbbbbbbbbbbbbnnk.....",
      "......kkkBBBBBBBBBBBBkkBkk......",
      "........kBkkkkkBkBkkk.kBk.......",
      "........kBk...kBkBk...kBk.......",
      ".......kBk...kBkBk...kBk........",
      ".......kBk...kBkBk...kBk........",
      "........k.....k.k.....k........."
     ]
    },
    {
     "ms": 100,
     "rows": [
      "................................",
      "................................",
      "............kkk.................",
      ".......kkk.kNnnk................",
      "......kNnnkknnnkkk..............",
      "......knnnkknnbnnnk.............",
      "....kkknnbk.kkknnnk.............",
      "...kNnnkkk....knnnk.............",
      "...knnnk.......knnnk............",
      "...knnbk.......knnnk............",
      "...kkkk........knbbk..........k.",
      "..kNnnk........kbbbk......kkkkNk",
      "..knnnk........kbbBk.....knNnnnk",
      "..knnbk.........kkkBk...knNnnkk.",
      "..knnk............kBk...knnnnnbk",
      ".knNnnk............k....knnnbbbk",
      ".knnnnkk............kkkkkknbnkk.",
      "..knnbnnkkkkkkkkkkkkNNNNNnnnk...",
      "...kknNnnYNNYNNYNNYNNYnnnknnk...",
      "....knnnnNnbnnbnnbnnbnnnnNnnk...",
      "....knnnbnnbnnbnnbnnbnnnnnnnk...",
      "....knnnbnnbnnbnnbnnbnnnnnnnk...",
      "....knnnbnnbnnbnnbnnbbbbbnnk....",
      ".....kbbbbbbbbbbbbbbbbbbnnk.....",
      "......kkkBBBBBBBBBBBBBkkkk......",
      ".........kkBkBkkkkkBkBk.........",
      "..........kBkBk...kBkBk.........",
      ".........kBkBk...kBkBk..........",
      ".........kBkBk...kBkBk..........",
      "..........k.k.....k.k..........."
     ]
    },
    {
     "ms": 100,
     "rows": [
      "................................",
      "................................",
      "...........kkk..................",
      ".......kkkkNnnk.................",
      "......kNnnknnnkkk...............",
      "......knnnknnbnnnk..............",
      "....kkknnbkkkknnnk..............",
      "...kNnnkkk...knnnk..............",
      "...knnnk......knnnk.............",
      "...knnbk......knnnk.............",
      "...kkkk.......knbbk...........k.",
      "..kNnnk.......kbbbk.......kkkkNk",
      "..knnnk.......kbbBk......knNnnnk",
      "..knnbk........kkkBk....knNnnkk.",
      "..knnk...........kBk....knnnnnbk",
      ".knNnnk...........k.....knnnbbbk",
      ".knnnnkk............kkkkkknbnkk.",
      "..knnbnnkkkkkkkkkkkkNNNNNnnnk...",
      "...kknNnnYNNYNNYNNYNNYnnnknnk...",
      "....knnnnNnbnnbnnbnnbnnnnNnnk...",
      "....knnnbnnbnnbnnbnnbnnnnnnnk...",
      "....knnnbnnbnnbnnbnnbnnnnnnnk...",
      "....knnnbnnbnnbnnbnnbbbbbnnk....",
      ".....kbbbbbbbbbbbbbbbbbbnnk.....",
      "......kkkBBBBBBBBBBBBkkBkk......",
      "........kBkkkkkBkBkkk.kBk.......",
      "........kBk...kBkBk...kBk.......",
      ".......kBk...kBkBk...kBk........",
      ".......kBk...kBkBk...kBk........",
      "........k.....k.k.....k........."
     ]
    },
    {
     "ms": 100,
     "rows": [
      "................................",
      "................................",
      "..........kkk...................",
      ".......kkkNnnk..................",
      "......kNnnnnnkkk................",
      "......knnnnnbnnnk...............",
      "....kkknnbkkknnnk...............",
      "...kNnnkkk..knnnk...............",
      "...knnnk.....knnnk..............",
      "...knnbk.....knnnk..............",
      "...kkkk......knbbk............k.",
      "..kNnnk......kbbbk........kkkkNk",
      "..knnnk......kbbBk.......knNnnnk",
      "..knnbk.......kkkBk.....knNnnkk.",
      "..knnk..........kBk.....knnnnnbk",
      ".knNnnk..........k......knnnbbbk",
      ".knnnnkk............kkkkkknbnkk.",
      "..knnbnnkkkkkkkkkkkkNNNNNnnnk...",
      "...kknNnnYNNYNNYNNYNNYnnnknnk...",
      "....knnnnNnbnnbnnbnnbnnnnNnnk...",
      "....knnnbnnbnnbnnbnnbnnnnnnnk...",
      "....knnnbnnbnnbnnbnnbnnnnnnnk...",
      "....knnnbnnbnnbnnbnnbbbbbnnk....",
      ".....kbbbbbbbbbbbbbbbbbbnnk.....",
      "......kkkBBBBBBBBBBBBBkkkk......",
      ".........kkBkBkkkkkBkBk.........",
      "..........kBkBk...kBkBk.........",
      ".........kBkBk...kBkBk..........",
      ".........kBkBk...kBkBk..........",
      "..........k.k.....k.k..........."
     ]
    }
   ]
  }
 }
};
export default asset;
