#!/usr/bin/env node
// Crée le squelette d'une nouvelle famille d'assets.
//   node scripts/new-asset.js <catégorie> <asset> "<Titre>"
//   npm run new -- nature bush "Buisson"
// Ajoute la catégorie à assets/categories.json si elle est nouvelle.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ASSETS_DIR, rel } from "./lib/library.js";

const [category, slug, title = slug] = process.argv.slice(2);
if (!category || !slug) {
  console.error('Usage : npm run new -- <catégorie> <asset> "<Titre>"   (ex. : npm run new -- nature bush "Buisson")');
  process.exit(1);
}
if (!/^[a-z][a-z0-9-]*$/.test(category)) { console.error(`catégorie '${category}' : minuscules, chiffres, tirets`); process.exit(1); }
if (!/^[a-z][a-z0-9_]*$/.test(slug)) { console.error(`asset '${slug}' : minuscules, chiffres, _`); process.exit(1); }

const dir = join(ASSETS_DIR, category);
const file = join(dir, `${slug}.px.js`);
if (existsSync(file)) { console.error(`${rel(file)} existe déjà : ajoutez-y des variantes.`); process.exit(1); }
mkdirSync(dir, { recursive: true });

const catFile = join(ASSETS_DIR, "categories.json");
const cats = JSON.parse(readFileSync(catFile, "utf8"));
if (!cats[category]) {
  cats[category] = { title: category[0].toUpperCase() + category.slice(1), description: "À décrire.", icon: `${category}/${slug}/example_16` };
  writeFileSync(catFile, JSON.stringify(cats, null, 2) + "\n");
  console.log(`catégorie '${category}' ajoutée à assets/categories.json (pensez à son titre et sa description)`);
}

writeFileSync(file, `include("../_palette.px.js")

const meta = {
  title: ${JSON.stringify(title)},
  description: "À décrire : ce que c'est, le point de vue, les variantes proposées.",
  tags: [${JSON.stringify(slug)}],
  variants: {
    example_16: { label: "Exemple (16 px)", props: { color: "green" } },
  },
}

// Chaque sprite exporté est une variante : nom = "${slug}_<variante>".
// Taille finale (contour compris) : 16, 24, 32, 48… => dessiner sur w-2 x h-2 avec outline: "k".
sprite("${slug}_example_16", { w: 14, h: 14, outline: "k" },
  circ(7, 7, 6, "g"), light([5, 5, 3], 1), shade((x, y) => x + y > 16, 1))

sheet(${JSON.stringify(slug + "s")}, [${JSON.stringify(slug + "_*")}], { pad: 2 })
`);
console.log(`créé : ${rel(file)}
ensuite :
  npm run pxl -- build ${rel(file)}          (aperçus dans ${rel(dir)}/out/_preview/)
  npm run build                              (bibliothèque + galerie)`);
