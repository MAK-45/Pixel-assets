// GÉNÉRÉ par scripts/build.js — ne pas modifier. Source : assets/fauna/firefly.px.js
// Luciole — 6 variante(s). Usage :
//   import asset from "./firefly.js"; const v = asset.variants["glow_8"];
//   v.src (data URL PNG), v.rows + v.palette (pixels, "." = transparent), v.w, v.h
/** @type {import("../../index.d.ts").PixelAsset} */
export const asset = {
 "id": "fauna/firefly",
 "slug": "firefly",
 "category": "fauna",
 "title": "Luciole",
 "description": "Lucioles pour les nuits d'été : petite lueur clignotante à l'échelle d'une scène (8 px) en jaune-vert, ambre ou bleu féerique, essaim de cinq lueurs désynchronisées (16 px), et luciole en vol vue de profil (16 px) dont l'abdomen s'allume, en jaune-vert ou bleu. Toutes animées. Les lueurs n'ont pas de contour (ce sont des lumières) ; l'insecte a le contour sombre de la maison.",
 "tags": [
  "firefly",
  "insect",
  "bug",
  "glow",
  "night",
  "light",
  "summer",
  "ambient",
  "animated",
  "fauna"
 ],
 "order": 0,
 "source": "assets/fauna/firefly.px.js",
 "module": "library/js/fauna/firefly.js",
 "sheet": {
  "png": "library/sheets/fauna/firefly.png",
  "json": "library/sheets/fauna/firefly.json"
 },
 "axes": {
  "form": [
   "glow",
   "swarm",
   "insect"
  ],
  "color": [
   "yellow",
   "amber",
   "blue"
  ]
 },
 "sizes": [
  8,
  16
 ],
 "variantCount": 6,
 "variants": {
  "glow_8": {
   "key": "glow_8",
   "name": "firefly_glow_8",
   "id": "fauna/firefly/glow_8",
   "label": "Lueur jaune-vert (scène)",
   "kind": "anim",
   "w": 5,
   "h": 5,
   "size": 8,
   "props": {
    "form": "glow",
    "color": "yellow"
   },
   "tags": [
    "particle"
   ],
   "png": "library/png/fauna/firefly/glow_8.png",
   "gif": "library/png/fauna/firefly/glow_8.gif",
   "frameCount": 6,
   "loopMs": 1200,
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAMAAAC6sdbXAAAABlBMVEUAAABarkXyfjbRAAAAAXRSTlMAQObYZgAAAA5JREFUeNpjYEABjKhcAAAtAAKWf5BeAAAAAElFTkSuQmCC",
   "strip": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFCAMAAABl/6zIAAAADFBMVEUAAABarkWl11r/8Kjf/GFGAAAAAXRSTlMAQObYZgAAACtJREFUeNpjYEAHjAy4ABNIlokRykJWDuIzMTMxMDIxMzGCWShqcOvGZzcADiQAL7vFcXsAAAAASUVORK5CYII=",
   "gifSrc": "data:image/gif;base64,R0lGODlhBQAFAPEAAAAAAFquRaXXWv/wqCH/C05FVFNDQVBFMi4wAwEAAAAh+QQJPAAAACwAAAAABQAFAAACBYSPFslQACH5BAkKAAAALAAAAAAFAAUAAAIFhI8myVAAIfkECQoAAAAsAAAAAAUABQAAAgiED3Iyao5AAQAh+QQJFAAAACwAAAAABQAFAAACCQRiJxgyq5CRBQAh+QQJCgAAACwAAAAABQAFAAACCIQPcjJqjkABACH5BAkKAAAALAAAAAAFAAUAAAIFhI8myVAAOw==",
   "palette": {
    "L": "#a5d75a",
    "Y": "#fff0a8",
    "l": "#5aae45"
   },
   "rows": [
    ".....",
    ".....",
    "..l..",
    ".....",
    "....."
   ],
   "frames": [
    {
     "ms": 600,
     "rows": [
      ".....",
      ".....",
      "..l..",
      ".....",
      "....."
     ]
    },
    {
     "ms": 100,
     "rows": [
      ".....",
      ".....",
      "..L..",
      ".....",
      "....."
     ]
    },
    {
     "ms": 100,
     "rows": [
      ".....",
      "..L..",
      ".LYL.",
      "..L..",
      "....."
     ]
    },
    {
     "ms": 200,
     "rows": [
      "..l..",
      ".lLl.",
      "lLYLl",
      ".lLl.",
      "..l.."
     ]
    },
    {
     "ms": 100,
     "rows": [
      ".....",
      "..L..",
      ".LYL.",
      "..L..",
      "....."
     ]
    },
    {
     "ms": 100,
     "rows": [
      ".....",
      ".....",
      "..L..",
      ".....",
      "....."
     ]
    }
   ]
  },
  "glow_amber_8": {
   "key": "glow_amber_8",
   "name": "firefly_glow_amber_8",
   "id": "fauna/firefly/glow_amber_8",
   "label": "Lueur ambre (scène)",
   "kind": "anim",
   "w": 5,
   "h": 5,
   "size": 8,
   "props": {
    "form": "glow",
    "color": "amber"
   },
   "tags": [
    "particle",
    "warm"
   ],
   "png": "library/png/fauna/firefly/glow_amber_8.png",
   "gif": "library/png/fauna/firefly/glow_amber_8.gif",
   "frameCount": 6,
   "loopMs": 1200,
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAMAAAC6sdbXAAAABlBMVEUAAADgeCow2FNHAAAAAXRSTlMAQObYZgAAAA5JREFUeNpjYEABjKhcAAAtAAKWf5BeAAAAAElFTkSuQmCC",
   "strip": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFCAMAAABl/6zIAAAADFBMVEUAAADgeCrzw0r/8KiglOXlAAAAAXRSTlMAQObYZgAAACtJREFUeNpjYEAHjAy4ABNIlokRykJWDuIzMTMxMDIxMzGCWShqcOvGZzcADiQAL7vFcXsAAAAASUVORK5CYII=",
   "gifSrc": "data:image/gif;base64,R0lGODlhBQAFAPEAAAAAAOB4KvPDSv/wqCH/C05FVFNDQVBFMi4wAwEAAAAh+QQJPAAAACwAAAAABQAFAAACBYSPFslQACH5BAkKAAAALAAAAAAFAAUAAAIFhI8myVAAIfkECQoAAAAsAAAAAAUABQAAAgiED3Iyao5AAQAh+QQJFAAAACwAAAAABQAFAAACCQRiJxgyq5CRBQAh+QQJCgAAACwAAAAABQAFAAACCIQPcjJqjkABACH5BAkKAAAALAAAAAAFAAUAAAIFhI8myVAAOw==",
   "palette": {
    "Y": "#fff0a8",
    "o": "#e0782a",
    "y": "#f3c34a"
   },
   "rows": [
    ".....",
    ".....",
    "..o..",
    ".....",
    "....."
   ],
   "frames": [
    {
     "ms": 600,
     "rows": [
      ".....",
      ".....",
      "..o..",
      ".....",
      "....."
     ]
    },
    {
     "ms": 100,
     "rows": [
      ".....",
      ".....",
      "..y..",
      ".....",
      "....."
     ]
    },
    {
     "ms": 100,
     "rows": [
      ".....",
      "..y..",
      ".yYy.",
      "..y..",
      "....."
     ]
    },
    {
     "ms": 200,
     "rows": [
      "..o..",
      ".oyo.",
      "oyYyo",
      ".oyo.",
      "..o.."
     ]
    },
    {
     "ms": 100,
     "rows": [
      ".....",
      "..y..",
      ".yYy.",
      "..y..",
      "....."
     ]
    },
    {
     "ms": 100,
     "rows": [
      ".....",
      ".....",
      "..y..",
      ".....",
      "....."
     ]
    }
   ]
  },
  "glow_blue_8": {
   "key": "glow_blue_8",
   "name": "firefly_glow_blue_8",
   "id": "fauna/firefly/glow_blue_8",
   "label": "Lueur bleue féerique (scène)",
   "kind": "anim",
   "w": 5,
   "h": 5,
   "size": 8,
   "props": {
    "form": "glow",
    "color": "blue"
   },
   "tags": [
    "particle",
    "magic",
    "fantasy"
   ],
   "png": "library/png/fauna/firefly/glow_blue_8.png",
   "gif": "library/png/fauna/firefly/glow_blue_8.gif",
   "frameCount": 6,
   "loopMs": 1200,
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAMAAAC6sdbXAAAABlBMVEUAAABPj+DCsBXOAAAAAXRSTlMAQObYZgAAAA5JREFUeNpjYEABjKhcAAAtAAKWf5BeAAAAAElFTkSuQmCC",
   "strip": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFCAMAAABl/6zIAAAADFBMVEUAAABPj+Cf0P/7+/9lYlzVAAAAAXRSTlMAQObYZgAAACtJREFUeNpjYEAHjAy4ABNIlokRykJWDuIzMTMxMDIxMzGCWShqcOvGZzcADiQAL7vFcXsAAAAASUVORK5CYII=",
   "gifSrc": "data:image/gif;base64,R0lGODlhBQAFAPEAAAAAAE+P4J/Q//v7/yH/C05FVFNDQVBFMi4wAwEAAAAh+QQJPAAAACwAAAAABQAFAAACBYSPFslQACH5BAkKAAAALAAAAAAFAAUAAAIFhI8myVAAIfkECQoAAAAsAAAAAAUABQAAAgiED3Iyao5AAQAh+QQJFAAAACwAAAAABQAFAAACCQRiJxgyq5CRBQAh+QQJCgAAACwAAAAABQAFAAACCIQPcjJqjkABACH5BAkKAAAALAAAAAAFAAUAAAIFhI8myVAAOw==",
   "palette": {
    "I": "#9fd0ff",
    "i": "#4f8fe0",
    "w": "#fbfbff"
   },
   "rows": [
    ".....",
    ".....",
    "..i..",
    ".....",
    "....."
   ],
   "frames": [
    {
     "ms": 600,
     "rows": [
      ".....",
      ".....",
      "..i..",
      ".....",
      "....."
     ]
    },
    {
     "ms": 100,
     "rows": [
      ".....",
      ".....",
      "..I..",
      ".....",
      "....."
     ]
    },
    {
     "ms": 100,
     "rows": [
      ".....",
      "..I..",
      ".IwI.",
      "..I..",
      "....."
     ]
    },
    {
     "ms": 200,
     "rows": [
      "..i..",
      ".iIi.",
      "iIwIi",
      ".iIi.",
      "..i.."
     ]
    },
    {
     "ms": 100,
     "rows": [
      ".....",
      "..I..",
      ".IwI.",
      "..I..",
      "....."
     ]
    },
    {
     "ms": 100,
     "rows": [
      ".....",
      ".....",
      "..I..",
      ".....",
      "....."
     ]
    }
   ]
  },
  "swarm_16": {
   "key": "swarm_16",
   "name": "firefly_swarm_16",
   "id": "fauna/firefly/swarm_16",
   "label": "Essaim de lucioles",
   "kind": "anim",
   "w": 16,
   "h": 16,
   "size": 16,
   "props": {
    "form": "swarm",
    "color": "yellow"
   },
   "tags": [
    "group"
   ],
   "png": "library/png/fauna/firefly/swarm_16.png",
   "gif": "library/png/fauna/firefly/swarm_16.gif",
   "frameCount": 12,
   "loopMs": 1200,
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAADFBMVEUAAACl11parkX/8KisRmUqAAAAAXRSTlMAQObYZgAAACFJREFUeNpjYKAIMMJZTBA+MyNOFdSxB2IT3B4m6trDAAALoAAV6b59KAAAAABJRU5ErkJggg==",
   "strip": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAAAQCAMAAAB3PIAaAAAADFBMVEUAAABarkWl11r/8Kjf/GFGAAAAAXRSTlMAQObYZgAAAK5JREFUeNrtVlsOwCAIo3j/O+9vGSgKTN2WjL8m8tAWkOi3+4YBXhWXs/4sMRhN7E5knNNxNObCyTzSEVxE5BNDnYeZCCouunHHBY+oCr6UlYjdDKCJ52n2qR54pKhlFpXF2wr2Nma449NVRSWwZYT1ioInKpQf9i6R6ysIrAdscOzZF8IcRaC9IGpd5hZPYHNiwKha0VoR6cnQZ6C6kFeJ4cTTGAZRjoGv/CZ32gETPwFfAgfPvwAAAABJRU5ErkJggg==",
   "gifSrc": "data:image/gif;base64,R0lGODlhEAAQAPEAAAAAAKXXWlquRf/wqCH/C05FVFNDQVBFMi4wAwEAAAAh+QQJCgAAACwAAAAAEAAQAAACGoSPqcvtGJhIYcRnLt68N71MmZWICuil6lMAACH5BAkKAAAALAAAAAAQABAAAAIahI+pyyudRHiKGjkmvHpfD4aRmASKSabqihQAIfkECQoAAAAsAAAAABAAEAAAAh2Ej6nLK51EeBDIMRU9cldfhSICjpYSjAGmmm5YAAAh+QQJCgAAACwAAAAAEAAQAAACHoSPqcsbncJ48FAlqt4c3N5ki3gIARlKp2aikAsqBQAh+QQJCgAAACwAAAAAEAAQAAACHYSPqcvtGJ4EYloWZxhZ9ttUi3gIARlup2SijqsUACH5BAkKAAAALAAAAAAQABAAAAIbhI+pyysN04s0TirCbXlo/FVbdYxAQAZeSlYFACH5BAkKAAAALAAAAAAQABAAAAIZhI+pyysNU4iUvirChXlo+2HV2GzHRKZRAQAh+QQJCgAAACwAAAAAEAAQAAACGYSPqcuhssJwLNGKs974Zul13LhAiUmmTAEAIfkECQoAAAAsAAAAABAAEAAAAhqEj5miDRIYkjOM6CrNZvMPhuIRjCbokec6FgAh+QQJCgAAACwAAAAAEAAQAAACHYSPmaINEpg7cEQk152Y+w+GopONQKCUR2CFqDkWACH5BAkKAAAALAAAAAAQABAAAAIdhI+py8EahkOivYuz3pzeaggBeJBlNGai+XUuUAAAIfkECQoAAAAsAAAAABAAEAAAAhqEj6nLveEigLLai53QR4SNgGEwfJInRmlWFQA7",
   "palette": {
    "L": "#a5d75a",
    "Y": "#fff0a8",
    "l": "#5aae45"
   },
   "rows": [
    "................",
    "................",
    "................",
    "...........L....",
    "....l.....LYL...",
    "...........L....",
    "................",
    "................",
    "................",
    ".............L..",
    "........l...LYL.",
    "....l........L..",
    "................",
    "................",
    "................",
    "................"
   ],
   "frames": [
    {
     "ms": 100,
     "rows": [
      "................",
      "................",
      "................",
      "...........L....",
      "....l.....LYL...",
      "...........L....",
      "................",
      "................",
      "................",
      ".............L..",
      "........l...LYL.",
      "....l........L..",
      "................",
      "................",
      "................",
      "................"
     ]
    },
    {
     "ms": 100,
     "rows": [
      "................",
      "................",
      "...........l....",
      "..........lLl...",
      "....l....lLYLl..",
      "..........lLl...",
      "...........l....",
      "................",
      "................",
      "........l.......",
      ".............L..",
      "....L...........",
      "................",
      "................",
      "................",
      "................"
     ]
    },
    {
     "ms": 100,
     "rows": [
      "................",
      "................",
      "...........l....",
      "..........lLl...",
      ".........lLYLl..",
      "....l.....lLl...",
      "...........l....",
      "................",
      "................",
      "........l.......",
      ".............l..",
      "....L...........",
      "...LYL..........",
      "....L...........",
      "................",
      "................"
     ]
    },
    {
     "ms": 100,
     "rows": [
      "................",
      "................",
      "...........L....",
      "..........LYL...",
      "...........L....",
      "....l...........",
      "................",
      "................",
      "........L.......",
      "................",
      "....l........l..",
      "...lLl..........",
      "..lLYLl.........",
      "...lLl..........",
      "....l...........",
      "................"
     ]
    },
    {
     "ms": 100,
     "rows": [
      "................",
      "................",
      "................",
      "...........L....",
      "................",
      "....l...........",
      "................",
      "........L.......",
      ".......LYL......",
      "........L.......",
      "................",
      "....l........l..",
      "...lLl..........",
      "..lLYLl.........",
      "...lLl..........",
      "....l..........."
     ]
    },
    {
     "ms": 100,
     "rows": [
      "................",
      "................",
      "...........l....",
      "................",
      "....l...........",
      "................",
      "........l.......",
      ".......lLl......",
      "......lLYLl.....",
      ".......lLl......",
      "........l.......",
      ".............l..",
      "....L...........",
      "...LYL..........",
      "....L...........",
      "................"
     ]
    },
    {
     "ms": 100,
     "rows": [
      "................",
      "................",
      "...........l....",
      "................",
      "....L...........",
      "................",
      "........l.......",
      ".......lLl......",
      "......lLYLl.....",
      ".......lLl......",
      "........l.......",
      "................",
      ".............l..",
      "....L...........",
      "................",
      "................"
     ]
    },
    {
     "ms": 100,
     "rows": [
      "................",
      "................",
      "....L......l....",
      "...LYL..........",
      "....L...........",
      "................",
      "................",
      "................",
      "........L.......",
      ".......LYL......",
      "........L.......",
      "................",
      ".............l..",
      "....l...........",
      "................",
      "................"
     ]
    },
    {
     "ms": 100,
     "rows": [
      "................",
      "....l...........",
      "...lLl.....l....",
      "..lLYLl.........",
      "...lLl..........",
      "....l...........",
      "................",
      "................",
      "................",
      "........L.......",
      "................",
      "................",
      "....l........L..",
      "................",
      "................",
      "................"
     ]
    },
    {
     "ms": 100,
     "rows": [
      "................",
      "....l...........",
      "...lLl..........",
      "..lLYLl....l....",
      "...lLl..........",
      "....l...........",
      "................",
      "................",
      "................",
      "................",
      "........l.......",
      ".............L..",
      "....l.......LYL.",
      ".............L..",
      "................",
      "................"
     ]
    },
    {
     "ms": 100,
     "rows": [
      "................",
      "................",
      "....L...........",
      "...LYL.....l....",
      "....L...........",
      "................",
      "................",
      "................",
      "................",
      ".............l..",
      "........l...lLl.",
      "....l......lLYLl",
      "............lLl.",
      ".............l..",
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
      "....L...........",
      "...........L....",
      "................",
      "................",
      "................",
      "................",
      ".............l..",
      "........l...lLl.",
      "....l......lLYLl",
      "............lLl.",
      ".............l..",
      "................",
      "................"
     ]
    }
   ]
  },
  "bug_16": {
   "key": "bug_16",
   "name": "firefly_bug_16",
   "id": "fauna/firefly/bug_16",
   "label": "Luciole en vol (16 px)",
   "kind": "anim",
   "w": 16,
   "h": 16,
   "size": 16,
   "props": {
    "form": "insect",
    "color": "yellow"
   },
   "tags": [
    "icon"
   ],
   "png": "library/png/fauna/firefly/bug_16.png",
   "gif": "library/png/fauna/firefly/bug_16.gif",
   "frameCount": 8,
   "loopMs": 800,
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAJ1BMVEUAAAAaFCPT4PLDwtRqQSjgeCo7IhmyOixarkWl11ovLTz/8Kicazzure/gAAAAAXRSTlMAQObYZgAAAFNJREFUeNqdj0sOgDAIRJlK+bTe/7ymhJpgdOPbzcsEMkRvAKi5tYaaj2JW4a8B7ncAL3pPAWFZdFUQGZF7ZFEdIXzOM+AxsmEQiOyblnMegz65AL9lAdMjzA/AAAAAAElFTkSuQmCC",
   "strip": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAQCAMAAADphoe6AAAAKlBMVEUAAAAaFCPT4PLDwtRqQSjgeCo7IhmyOixarkWl11ovLTzJmlv/8KicazwpT448AAAAAXRSTlMAQObYZgAAAL9JREFUeNrNldsOgzAMQ+MUegH2/787JdW4ZsAUMfAT1qldiqJC9AQBuDfPzLg3HzwN3rweYN5w9D3X3JtfN4B5t2LLvfllgzzvVVjcm/80QMUcgi6pmgYd37k3T0AjalugloXJ/4XHJoralKAvu/BX80xUivqYUoefPRH1vcdnKsPwUjWdbmB6GR2TS19/7Mf8hsuJMiJirDNhewYHm0sjDv2U3/I8TmmdSMtD8zanE36eN9efuG29tz0e+r98A6WZDP3+9C5LAAAAAElFTkSuQmCC",
   "gifSrc": "data:image/gif;base64,R0lGODlhEAAQAPMAAAAAABoUI9Pg8sPC1GpBKOB4KjsiGbI6LFquRaXXWi8tPP/wqJxrPMmaWwAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJCgAAACwAAAAAEAAQAAAETBDISWsN2NogetATJwweCIhjCaKk8K1d6pqsi2UURux7UeCSgIFgKBYLh8MHIUkkjMakYglILBaMrJagmAKYVYRQaLi9vjmzac22RAAAIfkECQoAAAAsAAAAABAAEAAABEYQyEmrvTjrHcKWgSB0WiiK5GUOw9m9L2AKLGHbRZG+BmH8v8Lh4EFIEgkgcKgoAhKLBWNKJSiaAOMTETB0vTGJFgT7mDcRACH5BAkKAAAALAAAAAAQABAAAARCEMhJq704682790EoilVInGdRhFRgEEYcF8cRAIiUJLJcK7dcYrFgMARIAUEBxOkQAUF0MJrkJCEB9YaJarkakiUCACH5BAkKAAAALAAAAAAQABAAAARGEMhJq7046x3CloEgdFooiuRlDsPZvS9gCixh20WRvgZh/L/C4eBBSBIJIHCoKAISiwVjSiUomgDjExEwdL0xiRYE+5g3EQAh+QQJCgAAACwAAAAAEAAQAAAERxDISWsN2NogetATJwweCIhjCaKk8K1d6pqsi2UURux7UeCSgIFgKBYLh8NL0mgYjUnFstlgWK8EhZTSwBiE39vqtjSZz5MIACH5BAkKAAAALAAAAAAQABAAAARCEMhJq7046x3CloEgdFooiuRlDsPZvS9gCixh20WRvgZh/L/C4eCZNBpA4FBRBBwbjKiUoGBSGh1D4AfDwJqfMCYCACH5BAkKAAAALAAAAAAQABAAAAQ7EMhJq704682790EoilVInGdRhFRgEEYcF8cRUE0jy7VyS7kGgyEoCggKHy4kCAgGowsT+pMWoRySJQIAIfkECQoAAAAsAAAAABAAEAAABEIQyEmrvTjrHcKWgSB0WiiK5GUOw9m9L2AKLGHbRZG+BmH8v8Lh4Jk0GkDgUFEEHBuMqJSgYFIaHUPgB8PAmp8wJgIAOw==",
   "palette": {
    "B": "#3b2219",
    "C": "#c3c2d4",
    "L": "#a5d75a",
    "N": "#c99a5b",
    "Y": "#fff0a8",
    "b": "#6a4128",
    "d": "#2f2d3c",
    "k": "#1a1423",
    "l": "#5aae45",
    "n": "#9c6b3c",
    "o": "#e0782a",
    "r": "#b23a2c",
    "s": "#d3e0f2"
   },
   "rows": [
    "................",
    "....kkk.........",
    "...ksssk........",
    "..kssCssk.......",
    "..ksssCssk......",
    "...ksssCssk.....",
    "....ksssCssk....",
    ".....ksssCskkkkk",
    ".....kkbbbbbookk",
    "....kBbBBBBBorrk",
    ".l..LLBBBBBBrrdk",
    ".l.LYYnnnnnnbddk",
    ".l..LlkBkBBkkkk.",
    "..l....kkkkk....",
    "................",
    "................"
   ],
   "frames": [
    {
     "ms": 100,
     "rows": [
      "................",
      "....kkk.........",
      "...ksssk........",
      "..kssCssk.......",
      "..ksssCssk......",
      "...ksssCssk.....",
      "....ksssCssk....",
      ".....ksssCskkkkk",
      ".....kkbbbbbookk",
      "....kBbBBBBBorrk",
      ".l..LLBBBBBBrrdk",
      ".l.LYYnnnnnnbddk",
      ".l..LlkBkBBkkkk.",
      "..l....kkkkk....",
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
      "..kk............",
      ".ksskk..........",
      "kssssskk........",
      "kssCCssskkkkkkkk",
      ".ksssCCbbbbbookk",
      "..kkkBbBBBBBorrk",
      ".l..LLBBBBBBrrdk",
      ".l.LYYnnnnnnbddk",
      ".l..LlkBkBBkkkk.",
      "..l....kkkkk....",
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
      "................",
      "................",
      "................",
      ".......kkkkkkkkk",
      ".....kkbbbbbookk",
      "....kBbBBBBBorrk",
      ".l..LLBBBBBBrrdk",
      ".l.LYYnnssssbddk",
      ".l..LlksksCkkkk.",
      "..l...kksCkk....",
      ".....kssCk......",
      "......kkk......."
     ]
    },
    {
     "ms": 100,
     "rows": [
      "................",
      "................",
      "................",
      "................",
      "..kk............",
      ".ksskk..........",
      "kssssskk........",
      "kssCCssskkkkkkkk",
      ".ksssCCbbbbbookk",
      "..kkkBbBBBBBorrk",
      ".l..LLBBBBBBrrdk",
      ".l.LYYnnnnnnbddk",
      ".l..LlkBkBBkkkk.",
      "..l....kkkkk....",
      "................",
      "................"
     ]
    },
    {
     "ms": 100,
     "rows": [
      "................",
      "....kkk.........",
      "...ksssk........",
      "..kssCssk.......",
      "..ksssCssk......",
      "...ksssCssk.....",
      "....ksssCssk....",
      ".....ksssCskkkkk",
      ".....kkbbbbbookk",
      "....kBbBBBBBorrk",
      "....NNBBBBBBrrdk",
      "...NNNnnnnnnbddk",
      "....NkkBkBBkkkk.",
      ".......kkkkk....",
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
      "..kk............",
      ".ksskk..........",
      "kssssskk........",
      "kssCCssskkkkkkkk",
      ".ksssCCbbbbbookk",
      "..kkkBbBBBBBorrk",
      "....NNBBBBBBrrdk",
      "...NNNnnnnnnbddk",
      "....NkkBkBBkkkk.",
      ".......kkkkk....",
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
      "................",
      "................",
      "................",
      ".......kkkkkkkkk",
      ".....kkbbbbbookk",
      "....kBbBBBBBorrk",
      "....NNBBBBBBrrdk",
      "...NNNnnssssbddk",
      "....NkksksCkkkk.",
      "......kksCkk....",
      ".....kssCk......",
      "......kkk......."
     ]
    },
    {
     "ms": 100,
     "rows": [
      "................",
      "................",
      "................",
      "................",
      "..kk............",
      ".ksskk..........",
      "kssssskk........",
      "kssCCssskkkkkkkk",
      ".ksssCCbbbbbookk",
      "..kkkBbBBBBBorrk",
      "....NNBBBBBBrrdk",
      "...NNNnnnnnnbddk",
      "....NkkBkBBkkkk.",
      ".......kkkkk....",
      "................",
      "................"
     ]
    }
   ]
  },
  "bug_blue_16": {
   "key": "bug_blue_16",
   "name": "firefly_bug_blue_16",
   "id": "fauna/firefly/bug_blue_16",
   "label": "Luciole bleue en vol (16 px)",
   "kind": "anim",
   "w": 16,
   "h": 16,
   "size": 16,
   "props": {
    "form": "insect",
    "color": "blue"
   },
   "tags": [
    "icon",
    "magic"
   ],
   "png": "library/png/fauna/firefly/bug_blue_16.png",
   "gif": "library/png/fauna/firefly/bug_blue_16.gif",
   "frameCount": 8,
   "loopMs": 800,
   "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAJ1BMVEUAAAAaFCPT4PLDwtRqQSjgeCo7IhmyOixPj+Cf0P8vLTz7+/+cazzl18QUAAAAAXRSTlMAQObYZgAAAFNJREFUeNqdj0sOgDAIRJlK+bTe/7ymhJpgdOPbzcsEMkRvAKi5tYaaj2JW4a8B7ncAL3pPAWFZdFUQGZF7ZFEdIXzOM+AxsmEQiOyblnMegz65AL9lAdMjzA/AAAAAAElFTkSuQmCC",
   "strip": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAQCAMAAADphoe6AAAAKlBMVEUAAAAaFCPT4PLDwtRqQSjgeCo7IhmyOixPj+Cf0P8vLTzJmlv7+/+cazwBTe4PAAAAAXRSTlMAQObYZgAAAL9JREFUeNrNldsOgzAMQ+MUegH2/787JdW4ZsAUMfAT1qldiqJC9AQBuDfPzLg3HzwN3rweYN5w9D3X3JtfN4B5t2LLvfllgzzvVVjcm/80QMUcgi6pmgYd37k3T0AjalugloXJ/4XHJoralKAvu/BX80xUivqYUoefPRH1vcdnKsPwUjWdbmB6GR2TS19/7Mf8hsuJMiJirDNhewYHm0sjDv2U3/I8TmmdSMtD8zanE36eN9efuG29tz0e+r98A6WZDP3+9C5LAAAAAElFTkSuQmCC",
   "gifSrc": "data:image/gif;base64,R0lGODlhEAAQAPMAAAAAABoUI9Pg8sPC1GpBKOB4KjsiGbI6LE+P4J/Q/y8tPPv7/5xrPMmaWwAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJCgAAACwAAAAAEAAQAAAETBDISWsN2NogetATJwweCIhjCaKk8K1d6pqsi2UURux7UeCSgIFgKBYLh8MHIUkkjMakYglILBaMrJagmAKYVYRQaLi9vjmzac22RAAAIfkECQoAAAAsAAAAABAAEAAABEYQyEmrvTjrHcKWgSB0WiiK5GUOw9m9L2AKLGHbRZG+BmH8v8Lh4EFIEgkgcKgoAhKLBWNKJSiaAOMTETB0vTGJFgT7mDcRACH5BAkKAAAALAAAAAAQABAAAARCEMhJq704682790EoilVInGdRhFRgEEYcF8cRAIiUJLJcK7dcYrFgMARIAUEBxOkQAUF0MJrkJCEB9YaJarkakiUCACH5BAkKAAAALAAAAAAQABAAAARGEMhJq7046x3CloEgdFooiuRlDsPZvS9gCixh20WRvgZh/L/C4eBBSBIJIHCoKAISiwVjSiUomgDjExEwdL0xiRYE+5g3EQAh+QQJCgAAACwAAAAAEAAQAAAERxDISWsN2NogetATJwweCIhjCaKk8K1d6pqsi2UURux7UeCSgIFgKBYLh8NL0mgYjUnFstlgWK8EhZTSwBiE39vqtjSZz5MIACH5BAkKAAAALAAAAAAQABAAAARCEMhJq7046x3CloEgdFooiuRlDsPZvS9gCixh20WRvgZh/L/C4eCZNBpA4FBRBBwbjKiUoGBSGh1D4AfDwJqfMCYCACH5BAkKAAAALAAAAAAQABAAAAQ7EMhJq704682790EoilVInGdRhFRgEEYcF8cRUE0jy7VyS7kGgyEoCggKHy4kCAgGowsT+pMWoRySJQIAIfkECQoAAAAsAAAAABAAEAAABEIQyEmrvTjrHcKWgSB0WiiK5GUOw9m9L2AKLGHbRZG+BmH8v8Lh4Jk0GkDgUFEEHBuMqJSgYFIaHUPgB8PAmp8wJgIAOw==",
   "palette": {
    "B": "#3b2219",
    "C": "#c3c2d4",
    "I": "#9fd0ff",
    "N": "#c99a5b",
    "b": "#6a4128",
    "d": "#2f2d3c",
    "i": "#4f8fe0",
    "k": "#1a1423",
    "n": "#9c6b3c",
    "o": "#e0782a",
    "r": "#b23a2c",
    "s": "#d3e0f2",
    "w": "#fbfbff"
   },
   "rows": [
    "................",
    "....kkk.........",
    "...ksssk........",
    "..kssCssk.......",
    "..ksssCssk......",
    "...ksssCssk.....",
    "....ksssCssk....",
    ".....ksssCskkkkk",
    ".....kkbbbbbookk",
    "....kBbBBBBBorrk",
    ".i..IIBBBBBBrrdk",
    ".i.Iwwnnnnnnbddk",
    ".i..IikBkBBkkkk.",
    "..i....kkkkk....",
    "................",
    "................"
   ],
   "frames": [
    {
     "ms": 100,
     "rows": [
      "................",
      "....kkk.........",
      "...ksssk........",
      "..kssCssk.......",
      "..ksssCssk......",
      "...ksssCssk.....",
      "....ksssCssk....",
      ".....ksssCskkkkk",
      ".....kkbbbbbookk",
      "....kBbBBBBBorrk",
      ".i..IIBBBBBBrrdk",
      ".i.Iwwnnnnnnbddk",
      ".i..IikBkBBkkkk.",
      "..i....kkkkk....",
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
      "..kk............",
      ".ksskk..........",
      "kssssskk........",
      "kssCCssskkkkkkkk",
      ".ksssCCbbbbbookk",
      "..kkkBbBBBBBorrk",
      ".i..IIBBBBBBrrdk",
      ".i.Iwwnnnnnnbddk",
      ".i..IikBkBBkkkk.",
      "..i....kkkkk....",
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
      "................",
      "................",
      "................",
      ".......kkkkkkkkk",
      ".....kkbbbbbookk",
      "....kBbBBBBBorrk",
      ".i..IIBBBBBBrrdk",
      ".i.Iwwnnssssbddk",
      ".i..IiksksCkkkk.",
      "..i...kksCkk....",
      ".....kssCk......",
      "......kkk......."
     ]
    },
    {
     "ms": 100,
     "rows": [
      "................",
      "................",
      "................",
      "................",
      "..kk............",
      ".ksskk..........",
      "kssssskk........",
      "kssCCssskkkkkkkk",
      ".ksssCCbbbbbookk",
      "..kkkBbBBBBBorrk",
      ".i..IIBBBBBBrrdk",
      ".i.Iwwnnnnnnbddk",
      ".i..IikBkBBkkkk.",
      "..i....kkkkk....",
      "................",
      "................"
     ]
    },
    {
     "ms": 100,
     "rows": [
      "................",
      "....kkk.........",
      "...ksssk........",
      "..kssCssk.......",
      "..ksssCssk......",
      "...ksssCssk.....",
      "....ksssCssk....",
      ".....ksssCskkkkk",
      ".....kkbbbbbookk",
      "....kBbBBBBBorrk",
      "....NNBBBBBBrrdk",
      "...NNNnnnnnnbddk",
      "....NkkBkBBkkkk.",
      ".......kkkkk....",
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
      "..kk............",
      ".ksskk..........",
      "kssssskk........",
      "kssCCssskkkkkkkk",
      ".ksssCCbbbbbookk",
      "..kkkBbBBBBBorrk",
      "....NNBBBBBBrrdk",
      "...NNNnnnnnnbddk",
      "....NkkBkBBkkkk.",
      ".......kkkkk....",
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
      "................",
      "................",
      "................",
      ".......kkkkkkkkk",
      ".....kkbbbbbookk",
      "....kBbBBBBBorrk",
      "....NNBBBBBBrrdk",
      "...NNNnnssssbddk",
      "....NkksksCkkkk.",
      "......kksCkk....",
      ".....kssCk......",
      "......kkk......."
     ]
    },
    {
     "ms": 100,
     "rows": [
      "................",
      "................",
      "................",
      "................",
      "..kk............",
      ".ksskk..........",
      "kssssskk........",
      "kssCCssskkkkkkkk",
      ".ksssCCbbbbbookk",
      "..kkkBbBBBBBorrk",
      "....NNBBBBBBrrdk",
      "...NNNnnnnnnbddk",
      "....NkkBkBBkkkk.",
      ".......kkkkk....",
      "................",
      "................"
     ]
    }
   ]
  }
 }
};
export default asset;
