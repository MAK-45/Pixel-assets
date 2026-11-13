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
  /** "parallax" : scène dynamique (plans en parallaxe, défilement infini) ; "scene" : scène statique. */
  kind: "sprite" | "anim" | "scene" | "parallax";
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
  /** Scènes uniquement (catégorie "scenes") : résumé dans catalog.json, données complètes dans le module. */
  scene?: SceneInfo;
}

/** Résumé d'une scène dans catalog.json. Les variantes d'une scène sont ses périodes. */
export interface SceneInfo {
  /** "parallax" = dynamique (défilement infini), "static" = écran fixe. */
  type: "parallax" | "static";
  dynamic: boolean;
  /** Taille de base de la vue (16:9), en pixels. */
  w: number;
  h: number;
  /** Ligne de sol (y des pieds du personnage) dans la vue de base. */
  groundY: number;
  defaultPeriod: string;
  periods: { id: string; label: string }[];
  /** Plans du fond vers l'avant ; factor = vitesse par rapport à la caméra (0 = fixe, 1 = sol). */
  planes: { id: string; label: string; factor: number; front?: boolean; optional?: boolean }[];
  animated: boolean;
  /** Dossier du paquet, scene.json (+ PNG), module autonome, moteur. */
  pack: string;
  json: string;
  bundle: string;
  runtime: string;
}

/** Image d'une scène : PNG en data URL (bande horizontale si `ms` = durées des images d'une animation). */
export interface SceneImage { src: string; w: number; h: number; ms?: number[]; fill?: string }

/** Données complètes d'une scène (module.scene), à passer à createSceneFrom. */
export interface SceneData {
  format: number;
  id: string;
  title: string;
  type: "parallax" | "static";
  w: number;
  h: number;
  groundY: number;
  defaultPeriod: string;
  periods: { id: string; label: string }[];
  planes: {
    id: string; label: string; factor: number; y: number; kind?: "sky"; front?: boolean; optional?: boolean;
    drift?: number; driftBy?: Record<string, number>; loop?: boolean;
    images: Record<string, SceneImage>;
    body?: { x: number; y: number; images: Record<string, SceneImage> };
    /** Éléments animés posés sur le plan (x, y dans son image), dessinés dans l'ordre ; bande qui boucle ou plan fixe. */
    actors?: { sprite: string; x: number; y: number; phase?: number; flip?: boolean }[];
  }[];
  /** Sprites des acteurs et des effets, par période ("*" = toutes). */
  sprites: Record<string, Record<string, SceneImage>>;
  /** Effets d'ambiance par période (twinkle, shooting, birds, butterflies, fireflies). */
  effects: Record<string, ({ type: string; after: string } & Record<string, unknown>)[]>;
  speed: Record<string, number>;
}

/** Famille avec pixels (module library/js/...) ; pour une scène, `scene` contient les données complètes. */
export type PixelAsset = Omit<AssetInfo<Variant>, "scene"> & { scene?: SceneData };

export interface SceneOptions {
  period?: string;
  /** Taille de la vue en pixels de base (≥ taille de base : la vue s'élargit). */
  width?: number;
  height?: number;
  /** false : pas d'événements aléatoires (étoiles filantes, oiseaux…). */
  effects?: boolean;
  /** false : sans le premier plan. */
  foreground?: boolean;
  /** Fréquence des événements (1 = normal). */
  frequency?: number;
  /** Générateur aléatoire 0..1 (Math.random par défaut). */
  random?: () => number;
}

export interface Scene {
  data: SceneData;
  periods: string[];
  readonly planes: { id: string; label: string; factor: number; front: boolean; visible: boolean }[];
  readonly period: string;
  readonly width: number;
  readonly height: number;
  /** Ligne de sol dans la vue courante. */
  readonly groundY: number;
  readonly cameraX: number;
  readonly time: number;
  /** Avance le temps (ms) et place la caméra (pixels de base). */
  update(dtMs: number, cameraX?: number): Scene;
  /** Plans derrière le personnage. */
  drawBack(ctx: CanvasRenderingContext2D, x?: number, y?: number): Scene;
  /** Plans devant le personnage. */
  drawFront(ctx: CanvasRenderingContext2D, x?: number, y?: number): Scene;
  draw(ctx: CanvasRenderingContext2D, x?: number, y?: number): Scene;
  setPeriod(id: string, o?: { fade?: number }): Scene;
  setPlaneVisible(id: string, visible: boolean): Scene;
  setFrequency(f: number): Scene;
  resize(w: number, h: number): Scene;
}

/** Moteur des scènes (library/scene-runtime.js). */
export function createSceneFrom(data: SceneData, o?: SceneOptions): Promise<Scene>;
/** Canvas plein écran au pixel près : { scale, w, h, ctx } (w × h = vue en pixels de base). */
export function fitCanvas(canvas: HTMLCanvasElement, o?: { width?: number; height?: number; baseWidth?: number; baseHeight?: number; pixelRatio?: number }): { scale: number; w: number; h: number; ctx: CanvasRenderingContext2D };

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
