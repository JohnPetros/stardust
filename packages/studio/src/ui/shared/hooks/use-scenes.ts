import { strFromU8, unzipSync, type Zippable, zipSync } from 'fflate'
import { useMemo } from 'react'
import type { Project } from '@/types/project'
import type { Scene } from '@/types/scene'
import type { SceneData } from '@/types/scene-data'
import type { ScenesTree } from '@/types/scenes-tree'
import { createStore, useStore } from '@/utils/store'

// Dev: the scenes-discovery plugin serves a live tree at /__scenes and pushes
// updates over the HMR socket. Build: the plugin emits a static scenes.json.
const SCENES_URL = import.meta.env.DEV ? '/__scenes' : '/scenes.json'

async function loadScenes(): Promise<ScenesTree> {
  const res = await fetch(SCENES_URL)
  if (!res.ok)
    throw new Error(`Failed to load scenes from ${SCENES_URL} (HTTP ${res.status})`)
  return (await res.json()) as ScenesTree
}

export async function loadScene(scene: Scene): Promise<SceneData> {
  const res = await fetch(scene.lottie, { cache: 'no-store' })
  if (!res.ok) {
    throw new Error(`Failed to load ${scene.lottie} (HTTP ${res.status})`)
  }
  const json = await res.text()

  // MakeManagedAnimation takes one named-blob map for both images and fonts.
  // Images are matched by key (it must equal the lottie's `assets[].p` filename).
  // Fonts are different: CanvasKit feeds every blob to a custom SkFontMgr and
  // resolves text layers by each font's *embedded* family name (matched against
  // the lottie `fonts.list[].fFamily`), so a font's key is arbitrary — we use the
  // filename only to keep it from colliding with another asset.
  const assets: Record<string, ArrayBuffer> = {}
  await Promise.all(
    [...scene.images, ...scene.fonts].map(async (url) => {
      const assetRes = await fetch(url)
      if (assetRes.ok) {
        assets[url.split('/').pop()!] = await assetRes.arrayBuffer()
      }
    }),
  )

  return { json, assets }
}

/**
 * Parse a dropped Lottie file into a Bodymovin document.
 * Accepts a plain `.json` animation or a `.lottie` archive (dotLottie: a zip
 * whose `animations/*.json` entries hold the Bodymovin sources).
 */
export async function parseLottieFile(file: File): Promise<Record<string, unknown>> {
  const name = file.name.toLowerCase()

  if (name.endsWith('.lottie')) {
    const unzipped = unzipSync(new Uint8Array(await file.arrayBuffer()))
    const entry =
      Object.keys(unzipped).find((p) => /animations\/.+\.json$/i.test(p)) ??
      Object.keys(unzipped).find((p) => p.toLowerCase().endsWith('.json'))
    if (!entry) throw new Error('No animation JSON found in .lottie archive')
    return JSON.parse(strFromU8(unzipped[entry]))
  }

  return JSON.parse(await file.text())
}

/**
 * Create a new scene in `project` (next index) seeded with `doc`, returning the
 * created project/scene slugs. The scene is created with a default lottie which
 * is then overwritten by the dropped source.
 */
export async function createSceneFromDoc(
  project: string,
  doc: Record<string, unknown>,
): Promise<{ project: string; scene: string }> {
  const created = await fetch('/__scenes/scene', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ project }),
  })
  if (!created.ok) throw new Error(`Failed to create scene (HTTP ${created.status})`)
  const { project: proj, scene } = (await created.json()) as {
    project: string
    scene: string
  }

  const saved = await fetch('/__scenes/lottie', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ project: proj, scene, doc }),
  })
  if (!saved.ok) throw new Error(`Failed to save lottie source (HTTP ${saved.status})`)

  return { project: proj, scene }
}

/**
 * Bundle a project's on-disk source into a zip and trigger a download.
 * The archive has three folders: `animations/` (one lottie.json per scene),
 * `images/` (all scene image assets), and `fonts/` (all scene font files). This
 * reads the served source files, not the in-memory skottie state, so it relies
 * on edits already being saved back.
 */
export async function exportProjectZip(project: Project): Promise<void> {
  const files: Zippable = {}

  const bundle = async (urls: string[], folder: string) => {
    for (const url of urls) {
      const res = await fetch(url)
      if (res.ok) {
        const name = url.split('/').pop()!
        files[`${folder}/${name}`] = new Uint8Array(await res.arrayBuffer())
      }
    }
  }

  for (const scene of project.scenes) {
    const res = await fetch(scene.lottie)
    if (res.ok) {
      files[`animations/${scene.slug}.json`] = new Uint8Array(await res.arrayBuffer())
    }
    await bundle(scene.images, 'images')
    await bundle(scene.fonts, 'fonts')
  }

  const zipped = zipSync(files)
  const blob = new Blob([zipped as BlobPart], { type: 'application/zip' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${project.slug}.zip`
  a.click()
  URL.revokeObjectURL(url)
}

type ScenesState = {
  tree: ScenesTree | null
  isLoading: boolean
}

const NO_PROJECTS: Project[] = []

// Shared across the app: the scenes tree is loaded once, outside any component,
// so every caller reads the same state without a provider.
export const scenesStore = createStore<ScenesState>({ tree: null, isLoading: true })

loadScenes()
  .then((tree) => scenesStore.set({ tree, isLoading: false }))
  .catch((error) => {
    console.error(error)
    scenesStore.set({ isLoading: false })
  })

// Live-patch the tree when the dev plugin reports filesystem changes.
import.meta.hot?.on('scenes:update', (next: ScenesTree) =>
  scenesStore.set({ tree: next }),
)

export function findSceneIn(
  tree: ScenesTree | null,
  projectSlug: string,
  sceneSlug: string,
): Scene | undefined {
  return tree?.projects
    .find((p) => p.slug === projectSlug)
    ?.scenes.find((s) => s.slug === sceneSlug)
}

export function useScenes() {
  const tree = useStore(scenesStore, (state) => state.tree)
  const isLoading = useStore(scenesStore, (state) => state.isLoading)

  return useMemo(() => {
    const projects = tree?.projects ?? NO_PROJECTS
    const findProject = (slug: string) => projects.find((p) => p.slug === slug)
    const findScene = (projectSlug: string, sceneSlug: string) =>
      findSceneIn(tree, projectSlug, sceneSlug)
    const firstProject = projects[0]
    const firstScene = firstProject?.scenes[0]
    const defaultScene =
      firstProject && firstScene
        ? { project: firstProject, scene: firstScene }
        : undefined
    const ready = !isLoading && tree != null

    return {
      projects,
      defaultScene,
      ready,
      findProject,
      findScene,
      loadScene,
      parseLottieFile,
      createSceneFromDoc,
      exportProjectZip,
    }
  }, [tree, isLoading])
}
