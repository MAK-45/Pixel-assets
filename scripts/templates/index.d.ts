// Types de la bibliothèque pixel-assets (copié dans library/index.d.ts par scripts/build.js).

/** Variante telle qu'elle apparaît dans catalog.json (sans pixels). */
export interface VariantInfo {
  /** Clé courte dans la famille, ex. "oak_summer_full_32". */
  key: string;
  /** Nom du sprite dans le fichier source, ex. "tree_oak_summer_full_32". */
  name: string;
  /** Identifiant complet "categorie/asset/variante". */
  id: string;
  /** Libellé lisible (français). */
  label: string;
  description?: string;
  kind: "sprite" | "anim" | "scene";
  /** Dimensions réelles en pixels (contour inclus). */
  w: number;
  h: number;
  /** Taille nominale : plus petite valeur de 8/16/24/32/48/64/96/128... contenant max(w, h). */
  size: number;
  /** Axes de variation, ex. { species: "oak", season: "autumn", foliage: "full" }. */
  props: Record<string, string | number | boolean>;
  tags: string[];
  /** Chemin du PNG 1x depuis la racine du dépôt (bande horizontale pour une animation). */
  png: string;
  /** Animations : GIF, nombre d'images, durée d'une boucle. */
  gif?: string;
  frameCount?: number;
  loopMs?: number;
}

/** Variante avec pixels (dans les modules library/js/...). */
export interface Variant extends VariantInfo {
  /** PNG 1x (première image) en data URL. */
  src: string;
  /** Animations : bande horizontale de toutes les images (data URL) et GIF (data URL). */
  strip?: string;
  gifSrc?: string;
  /** Clé -> couleur hex utilisée par rows. null si trop de couleurs (utiliser src). */
  palette: Record<string, string> | null;
  /** Une chaîne par ligne, un caractère par pixel ("." = transparent). */
  rows: string[] | null;
  /** Animations : chaque image avec sa durée. */
  frames?: { ms: number; rows: string[] | null }[];
}

export interface AssetInfo<V = VariantInfo> {
  /** "categorie/asset" */
  id: string;
  slug: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
  license?: string;
  author?: string;
  order: number;
  /** Fichier source pxl (.px.js) depuis la racine du dépôt. */
  source: string;
  /** Module ES avec les pixels, depuis la racine du dépôt. */
  module: string;
  /** Sprite sheet de la famille (JSON au format TexturePacker hash). */
  sheet: { png: string; json: string };
  /** Valeurs possibles de chaque axe de variation. */
  axes: Record<string, (string | number | boolean)[]>;
  /** Tailles nominales disponibles. */
  sizes: number[];
  variantCount: number;
  variants: Record<string, V>;
}

export type PixelAsset = AssetInfo<Variant>;

export interface Category {
  id: string;
  title: string;
  description: string;
  icon: string;
  /** Identifiants des familles, dans l'ordre d'affichage. */
  assets: string[];
}

export interface Catalog {
  name: string;
  format: number;
  description: string;
  stats: { categories: number; assets: number; variants: number };
  categories: Category[];
  assets: Record<string, AssetInfo>;
}

export interface FindQuery {
  category?: string;
  asset?: string;
  tag?: string;
  text?: string;
  size?: number;
  maxSize?: number;
  kind?: VariantInfo["kind"];
  props?: Record<string, string | number | boolean>;
}

export const catalog: Catalog;
export const ids: string[];
export function load(id: string): Promise<PixelAsset>;
export function loadVariant(fullId: string): Promise<Variant>;
export function find(q?: FindQuery): (VariantInfo & { assetId: string; category: string })[];

export interface DrawOptions { scale?: number; frame?: number; palette?: Record<string, string> }
export function hexToRgba(hex: string): [number, number, number, number];
export function toPixels(v: Variant, o?: { frame?: number; palette?: Record<string, string> }): { w: number; h: number; data: Uint8ClampedArray };
export function draw(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, v: Variant, x?: number, y?: number, o?: DrawOptions & { flipX?: boolean }): void;
export function toCanvas(v: Variant, o?: DrawOptions): HTMLCanvasElement | OffscreenCanvas;
export function toDataURL(v: Variant, o?: DrawOptions): string;
export function loadImage(v: Variant): Promise<HTMLImageElement>;
export function recolor(v: Variant, palette: Record<string, string>): Variant;
export function frameAt(v: Variant, ms: number): number;
export function toAscii(v: Variant, frame?: number): string;
