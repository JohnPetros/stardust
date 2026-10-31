export interface Scene {
  /** Folder name, kept verbatim (e.g. "scene-1"). Used as the URL segment. */
  slug: string
  /** Human label derived from the slug (e.g. "Scene 1"). */
  label: string
  /** Sort order parsed from a trailing "-NN" in the slug; Infinity when absent. */
  order: number
  /** Public URL of the scene's lottie.json. */
  lottie: string
  /** Public URL of the scene's controls.json, when present. */
  controls?: string
  /** Public URLs of image assets in the scene folder. */
  images: string[]
  /** Public URLs of font files (.ttf/.otf/.ttc) in the scene folder. */
  fonts: string[]
}
