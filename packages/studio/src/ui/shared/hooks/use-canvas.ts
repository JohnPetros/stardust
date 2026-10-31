import { useNavigate, useParams, useSearch } from '@tanstack/react-router'
import CanvasKitInit from 'canvaskit-wasm/full'
import type {
  CanvasKit,
  Font,
  ManagedSkottieAnimation,
  Paint,
  Surface,
  Typeface,
} from 'canvaskit-wasm/full'
import { useCallback, useEffect } from 'react'
import type { AnimationSlot } from '@/types/animation-slot'
import type { ControlMeta } from '@/types/control-meta'
import type { LottieDoc } from '@/types/lottie-doc'
import type { Scene } from '@/types/scene'
import type { SceneData } from '@/types/scene-data'
import {
  createSceneFromDoc,
  findSceneIn,
  loadScene,
  parseLottieFile,
  scenesStore,
} from '@/ui/shared/hooks/use-scenes'
import { applySlotValues, readTextSlotValue } from '@/utils/lottie-slots'
import { createStore, useStore } from '@/utils/store'

const MIN_ZOOM = 0.1
const MAX_ZOOM = 32
const ZOOM_SENSITIVITY = 0.003
const INITIAL_MARGIN_Y = 100 // CSS px above and below the animation
const LABEL_FONT_SIZE = 11 // CSS px, screen space (does not scale with zoom)
const LABEL_GAP_Y = 7 // CSS px between the label baseline and the frame
const LABEL_MIN_WIDTH = 24 // CSS px the label may occupy on a tiny frame
const LABEL_FONT_URL = new URL(
  '@/assets/fonts/Inter-VariableFont_opsz,wght.ttf',
  import.meta.url,
).toString()
const NO_SLOTS: AnimationSlot[] = []

let canvasKitInstance: Promise<CanvasKit> | null = null

// Memoised so the main canvas and the thumbnail renderer share one WASM instance
// instead of fetching and instantiating canvaskit.wasm twice.
export function getCanvasKit(): Promise<CanvasKit> {
  if (!canvasKitInstance) {
    canvasKitInstance = CanvasKitInit({ locateFile: () => '/canvaskit.wasm' })
  }
  return canvasKitInstance
}

type CanvasRoute = {
  project: string | null
  scene: string | null
  frame: number | null
}

type CanvasSnapshot = {
  playing: boolean
  currentFrame: number
  totalFrames: number
  fps: number
  zoom: number
  slots: AnimationSlot[]
  controls: Record<string, ControlMeta> | undefined
}

// Shared across the app without a provider: one renderer for the whole page.
// React components read its state through the store and call its actions.
const canvasStore = createStore<CanvasSnapshot>({
  playing: false,
  currentFrame: 0,
  totalFrames: 0,
  fps: 0,
  zoom: 1,
  slots: NO_SLOTS,
  controls: undefined,
})

const engine = createCanvasEngine()

function createCanvasEngine() {
  let canvas: HTMLCanvasElement | null = null
  let canvasKit: CanvasKit | null = null
  let surface: Surface | null = null
  let labelTypeface: Typeface | null = null
  let labelFont: Font | null = null
  let labelPaint: Paint | null = null
  let rafId: number | null = null
  let dragging = false
  let lastTs = 0
  let dirty = true
  let sourceDirty = false // a control was edited but not yet written to source
  let camera = { x: 0, y: 0, zoom: 1 }
  let route: CanvasRoute = { project: null, scene: null, frame: null }
  let openScene: ((project: string, scene: string) => void) | null = null
  let currentScene: Scene | null = null
  let currentSceneKey: string | null = null
  let sceneData: SceneData | null = null
  let sourceDoc: LottieDoc | null = null
  let animation: ManagedSkottieAnimation | null = null
  let controls: Record<string, ControlMeta> | undefined
  let textOverrides: Record<string, string> = {}
  // Autoplay on the very first scene load; on later scene switches we restart
  // at frame 0 but keep whatever play/pause state the user was in.
  let autoplayPending = true
  let sceneRequest = 0
  let controlsRequest = 0
  let contextTimer: number | undefined

  const observer = new ResizeObserver(() => resize())

  const playing = () => canvasStore.get().playing
  const currentFrame = () => canvasStore.get().currentFrame
  const totalFrames = () => canvasStore.get().totalFrames
  const fps = () => canvasStore.get().fps
  const zoom = () => camera.zoom

  scenesStore.subscribe(updateScene)

  import.meta.hot?.on('scene:source', (data: { lottie: string }) => {
    if (currentScene?.lottie === data.lottie) reloadScene()
  })

  function setPlaying(next: boolean) {
    if (next) lastTs = 0
    canvasStore.set({ playing: next })
    postContext()
  }

  function setCamera(next: typeof camera) {
    camera = next
    canvasStore.set({ zoom: next.zoom })
  }

  function updateScene() {
    const { project, scene } = route
    const next =
      project && scene
        ? (findSceneIn(scenesStore.get().tree, project, scene) ?? null)
        : null
    const key = next ? JSON.stringify(next) : null
    if (key === currentSceneKey) return

    currentSceneKey = key
    currentScene = next
    reloadScene()
    reloadControls()
    applyFrameParam() // restart playback whenever the scene changes
  }

  function reloadScene() {
    const scene = currentScene
    if (!scene) return
    const request = ++sceneRequest
    loadScene(scene)
      .then((data) => {
        if (request !== sceneRequest) return
        sceneData = data
        try {
          sourceDoc = JSON.parse(data.json) as LottieDoc
        } catch {
          sourceDoc = null
        }
        textOverrides = {}
        rebuildAnimation()
      })
      .catch((error) => console.error(error))
  }

  function reloadControls() {
    const scene = currentScene
    if (!scene) return
    const request = ++controlsRequest
    void loadControlsMeta(scene).then((meta) => {
      if (request !== controlsRequest) return
      controls = meta
      canvasStore.set({ controls: meta })
      recomputeSlots()
    })
  }

  function rebuildAnimation() {
    if (!canvasKit || !sceneData) return
    animation?.delete() // dispose the previous scene's animation on swap
    animation = canvasKit.MakeManagedAnimation(sceneData.json, sceneData.assets)
    const nextFps = animation.fps() || 60
    const nextTotalFrames = Math.max(1, Math.round(animation.duration() * nextFps))
    const isLengthChange = nextTotalFrames !== totalFrames()
    canvasStore.set({ fps: nextFps, totalFrames: nextTotalFrames })
    recomputeSlots()
    resetCamera()
    // Re-run once the length is known so seek() can clamp against it. A reload
    // after saving a control keeps the length, so it must not move the playhead.
    if (isLengthChange) applyFrameParam()
    dirty = true
  }

  function recomputeSlots() {
    if (!animation) {
      canvasStore.set({ slots: NO_SLOTS })
      return
    }
    const raw = readSlots(animation, sourceDoc, textOverrides)
    // Order slots by controls.json (Skottie enumerates them in hash order); uncontrolled sort last.
    if (!controls) {
      canvasStore.set({ slots: raw })
      return
    }
    // Slots targeted by another control are internal — hide them from the panel.
    const hidden = new Set<string>()
    for (const c of Object.values(controls))
      for (const s of c.targetSids ?? []) hidden.add(s)
    const rank = new Map(Object.keys(controls).map((sid, i) => [sid, i]))
    const END = Number.MAX_SAFE_INTEGER
    canvasStore.set({
      slots: raw
        .filter((s) => !hidden.has(s.id))
        .sort((a, b) => (rank.get(a.id) ?? END) - (rank.get(b.id) ?? END)),
    })
  }

  function applyFrameParam() {
    const frame = route.frame
    if (frame != null && Number.isFinite(frame)) {
      setPlaying(false)
      seek(frame)
    } else {
      if (autoplayPending) setPlaying(true)
      seek(0)
    }
    autoplayPending = false
  }

  function postContext() {
    const isPlaying = playing()
    const payload = {
      project: route.project,
      scene: route.scene,
      playing: isPlaying,
      frame: Math.round(currentFrame()),
      totalFrames: totalFrames(),
      fps: fps(),
    }
    clearTimeout(contextTimer) // coalesce rapid scrubs into one post
    contextTimer = window.setTimeout(() => {
      void fetch('/__context', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {})
    }, 60)
  }

  // a control's own sid plus its extra targetSids (deduped). See player-contract.md.
  function targetsOf(id: string) {
    return [...new Set([id, ...(controls?.[id]?.targetSids ?? [])])]
  }

  function setScalarSlot(id: string, value: number) {
    for (const sid of targetsOf(id)) animation?.setScalarSlot(sid, value)
    dirty = true
    sourceDirty = true
  }

  function setColorSlot(id: string, rgba: [number, number, number, number]) {
    if (!canvasKit) return
    const color = canvasKit.Color4f(rgba[0], rgba[1], rgba[2], rgba[3])
    for (const sid of targetsOf(id)) animation?.setColorSlot(sid, color)
    dirty = true
    sourceDirty = true
  }

  function setVec2Slot(id: string, xy: [number, number]) {
    for (const sid of targetsOf(id)) animation?.setVec2Slot(sid, xy)
    dirty = true
    sourceDirty = true
  }

  // setText() targets a text layer by name, so map a slot id to its layer(s).
  function textLayersForSlot(slotId: string): { key: string; size: number }[] {
    if (!sourceDoc) return []
    const out: { key: string; size: number }[] = []
    for (const layer of sourceDoc.layers ?? []) {
      if (layer.ty !== 5 || !layer.nm || layer.t?.d?.sid !== slotId) continue
      const k = layer.t.d.k
      const size = Array.isArray(k) ? k[0]?.s?.s : undefined
      out.push({ key: layer.nm, size: typeof size === 'number' ? size : 0 })
    }
    return out
  }

  function setTextSlot(id: string, text: string) {
    // fan out to targetSids; setText is string-only, so each layer keeps its style.
    const ids = targetsOf(id)
    const next = { ...textOverrides }
    for (const sid of ids) next[sid] = text
    textOverrides = next
    // Use setText, not setTextSlot: in canvaskit-wasm 0.41.1 setTextSlot doesn't
    // re-shape the layer and locks later setText calls. setText re-shapes each
    // edit; commit persists from source JSON plus the override above.
    for (const sid of ids) {
      for (const { key, size } of textLayersForSlot(sid)) {
        animation?.setText(key, text, size)
      }
    }
    recomputeSlots()
    dirty = true
    sourceDirty = true
  }

  async function commitSource() {
    if (!sourceDirty) return

    const { project, scene: sceneSlug } = route
    if (!currentScene || !sceneData || !animation || !project || !sceneSlug) return

    let doc: LottieDoc
    try {
      doc = JSON.parse(sceneData.json)
    } catch {
      return
    }
    applySlotValues(doc, readSlots(animation, doc, textOverrides))

    const res = await fetch('/__scenes/lottie', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project, scene: sceneSlug, doc }),
    })
    if (!res.ok) {
      console.error(`Failed to save lottie source (HTTP ${res.status})`)
      return
    }

    sourceDirty = false
  }

  function togglePlayback() {
    setPlaying(!playing())
  }

  function seek(frame: number) {
    canvasStore.set({ currentFrame: Math.max(0, Math.min(frame, totalFrames() - 1)) })
    dirty = true
    if (!playing()) postContext()
  }

  function resize() {
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const width = Math.max(1, Math.floor(canvas.clientWidth * dpr))
    const height = Math.max(1, Math.floor(canvas.clientHeight * dpr))

    if (canvas.width === width && canvas.height === height && surface) {
      return
    }

    canvas.width = width
    canvas.height = height

    if (!canvasKit) return

    surface?.delete()
    surface = canvasKit.MakeWebGLCanvasSurface(canvas)
    if (!surface) {
      throw new Error('Could not create a WebGL surface for CanvasKit.')
    }
    dirty = true
  }

  function handleWheel(e: WheelEvent) {
    if (!canvas) return
    e.preventDefault()
    const dpr = window.devicePixelRatio || 1

    if (e.ctrlKey || e.metaKey) {
      const rect = canvas.getBoundingClientRect()
      const cx = (e.clientX - rect.left) * dpr
      const cy = (e.clientY - rect.top) * dpr
      const factor = Math.exp(-e.deltaY * ZOOM_SENSITIVITY)
      const next = clamp(zoom() * factor, MIN_ZOOM, MAX_ZOOM)
      const applied = next / zoom()
      setCamera({
        x: cx - (cx - camera.x) * applied,
        y: cy - (cy - camera.y) * applied,
        zoom: next,
      })
    } else {
      setCamera({
        ...camera,
        x: camera.x - e.deltaX * dpr,
        y: camera.y - e.deltaY * dpr,
      })
    }

    dirty = true
  }

  function handlePointerDown(e: PointerEvent) {
    if (!canvas || (e.button !== 0 && e.button !== 1)) return // left or middle drag
    dragging = true
    canvas.style.cursor = 'grabbing'
    dirty = true
  }

  function handlePointerMove(e: PointerEvent) {
    if (!dragging) return
    const dpr = window.devicePixelRatio || 1
    setCamera({
      ...camera,
      x: camera.x + e.movementX * dpr,
      y: camera.y + e.movementY * dpr,
    })
    dirty = true
  }

  function handlePointerUp() {
    if (!dragging || !canvas) return
    dragging = false
    canvas.style.cursor = 'grab'
    dirty = true
  }

  function handleKeyDown(e: KeyboardEvent) {
    const target = e.target as HTMLElement | null
    // don't hijack keys while typing in an input, textarea, or contenteditable
    if (
      target &&
      (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
    ) {
      return
    }

    if (e.code === 'Space' || e.key === ' ') {
      e.preventDefault()
      togglePlayback()
      return
    }

    // Arrow keys step the playhead: left/right by one frame, up/down by one second.
    const step = (
      {
        ArrowRight: 1,
        ArrowLeft: -1,
        ArrowUp: fps(),
        ArrowDown: -fps(),
      } as Record<string, number>
    )[e.key]
    if (step === undefined) return
    e.preventDefault()
    setPlaying(false)
    const last = Math.max(0, totalFrames() - 1)
    seek(Math.min(Math.round(currentFrame()) + step, last))
  }

  // Accept a Lottie file dragged onto the canvas, but only when files are being
  // dragged (ignore in-app drags) — preventDefault enables the drop.
  function handleDragOver(e: DragEvent) {
    if (
      !e.dataTransfer ||
      !Array.from(e.dataTransfer.items).some((i) => i.kind === 'file')
    )
      return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  // Drop a .json/.lottie file to add it as a new scene (next index), then open it.
  async function handleDrop(e: DragEvent) {
    const file = e.dataTransfer?.files?.[0]
    const name = file?.name.toLowerCase() ?? ''
    if (!file || (!name.endsWith('.json') && !name.endsWith('.lottie'))) return
    e.preventDefault()

    const project = route.project
    if (!project) return
    try {
      const doc = await parseLottieFile(file)
      const created = await createSceneFromDoc(project, doc)
      openScene?.(created.project, created.scene)
    } catch (err) {
      console.error('Failed to import dropped Lottie file:', err)
    }
  }

  function resetCamera() {
    if (!animation || !canvas) return
    const dpr = window.devicePixelRatio || 1
    const [w, h] = animation.size()
    const cw = canvas.width
    const ch = canvas.height
    if (!cw || !ch || !w || !h) return
    const dh = h * Math.min(cw / w, ch / h)
    const nextZoom = clamp((ch - 2 * INITIAL_MARGIN_Y * dpr) / dh, MIN_ZOOM, MAX_ZOOM)
    setCamera({
      x: (cw / 2) * (1 - nextZoom),
      y: (ch / 2) * (1 - nextZoom),
      zoom: nextZoom,
    })
    dirty = true
  }

  function animationName() {
    const nm = sourceDoc?.nm
    if (typeof nm === 'string' && nm.trim()) return nm.trim()
    return 'Animation 1'
  }

  function tick(ts: number) {
    const ctx = surface?.getCanvas()

    if (playing() && totalFrames() > 0) {
      if (!lastTs) lastTs = ts // first tick after play(): no elapsed time yet
      const dt = (ts - lastTs) / 1000
      canvasStore.set({ currentFrame: (currentFrame() + dt * fps()) % totalFrames() })
      lastTs = ts
      dirty = true
    }

    if (dirty && ctx && canvasKit && animation && canvas) {
      ctx.clear(canvasKit.TRANSPARENT)

      const { x, y, zoom } = camera
      const [w, h] = animation.size()
      const cw = canvas.width
      const ch = canvas.height
      const scale = Math.min(cw / w, ch / h)
      const dw = w * scale
      const dh = h * scale
      const left = (cw - dw) / 2
      const top = (ch - dh) / 2

      ctx.save()
      ctx.translate(x, y)
      ctx.scale(zoom, zoom)
      animation.seekFrame(currentFrame())
      animation.render(ctx, canvasKit.LTRBRect(left, top, left + dw, top + dh))
      ctx.restore()

      if (labelFont && labelPaint) {
        const dpr = window.devicePixelRatio || 1
        labelFont.setSize(LABEL_FONT_SIZE * dpr)
        const maxWidth = Math.max(zoom * dw, LABEL_MIN_WIDTH * dpr)
        const text = fitLabel(labelFont, animationName(), maxWidth)
        if (text) {
          ctx.drawText(
            text,
            x + zoom * left,
            y + zoom * top - LABEL_GAP_Y * dpr,
            labelPaint,
            labelFont,
          )
        }
      }

      surface?.flush()
      dirty = false
    }

    rafId = requestAnimationFrame(tick)
  }

  function zoomByCentered(factor: number) {
    if (!canvas) return
    const cx = canvas.width / 2
    const cy = canvas.height / 2
    const next = clamp(zoom() * factor, MIN_ZOOM, MAX_ZOOM)
    const applied = next / zoom()
    setCamera({
      x: cx - (cx - camera.x) * applied,
      y: cy - (cy - camera.y) * applied,
      zoom: next,
    })
    dirty = true
  }

  function setupLabel(ck: CanvasKit, typeface: Typeface | null) {
    labelTypeface = typeface
    if (!labelTypeface || labelPaint) return
    labelPaint = new ck.Paint()
    labelPaint.setColor(ck.Color4f(0.64, 0.64, 0.64, 1)) // matches muted-foreground
    labelPaint.setAntiAlias(true)
    labelFont = new ck.Font(labelTypeface, LABEL_FONT_SIZE)
    dirty = true
  }

  function attach(element: HTMLCanvasElement) {
    canvas = element
    observer.observe(element)
    element.style.cursor = 'grab'
    element.style.touchAction = 'none'
    element.addEventListener('wheel', handleWheel, { passive: false })
    element.addEventListener('pointerdown', handlePointerDown)
    element.addEventListener('dblclick', resetCamera)
    element.addEventListener('dragover', handleDragOver)
    element.addEventListener('drop', handleDrop)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('keydown', handleKeyDown)

    if (!rafId) rafId = requestAnimationFrame(tick)

    void getCanvasKit().then((ck) => {
      const isFirstLoad = !canvasKit
      canvasKit = ck
      resize()
      if (isFirstLoad) {
        rebuildAnimation()
        void loadLabelTypeface(ck).then((typeface) => setupLabel(ck, typeface))
      }
    })
  }

  function detach() {
    if (!canvas) return
    observer.unobserve(canvas)
    canvas.removeEventListener('wheel', handleWheel)
    canvas.removeEventListener('pointerdown', handlePointerDown)
    canvas.removeEventListener('dblclick', resetCamera)
    canvas.removeEventListener('dragover', handleDragOver)
    canvas.removeEventListener('drop', handleDrop)
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerup', handlePointerUp)
    window.removeEventListener('keydown', handleKeyDown)

    if (rafId) cancelAnimationFrame(rafId)
    rafId = null
    // The WebGL surface belongs to this canvas element; recreate it on re-attach.
    surface?.delete()
    surface = null
    canvas = null
  }

  function setRoute(next: CanvasRoute) {
    const previous = route
    route = next
    const isSceneChange =
      previous.project !== next.project || previous.scene !== next.scene
    if (isSceneChange) {
      updateScene()
      postContext()
    } else if (previous.frame !== next.frame) {
      applyFrameParam()
    }
  }

  function setSceneOpener(next: (project: string, scene: string) => void) {
    openScene = next
  }

  return {
    attach,
    detach,
    setRoute,
    setSceneOpener,
    setScalarSlot,
    setColorSlot,
    setVec2Slot,
    setTextSlot,
    commitSource,
    togglePlayback,
    seek,
    zoomByCentered,
    resetCamera,
  }
}

// Used once, by the root layout that renders the canvas: wires the renderer to
// the canvas element and to the current route.
export function useCanvasHost() {
  const params = useParams({ strict: false }) as { project?: string; scene?: string }
  const search = useSearch({ strict: false }) as Record<string, unknown>
  const navigate = useNavigate()
  const project = params.project ?? null
  const scene = params.scene ?? null
  const frame = toFrame(search.frame)

  useEffect(() => {
    engine.setSceneOpener((nextProject, nextScene) => {
      void navigate({
        to: '/$project/$scene',
        params: { project: nextProject, scene: nextScene },
      })
    })
  }, [navigate])

  useEffect(() => {
    engine.setRoute({ project, scene, frame })
  }, [project, scene, frame])

  const canvasRef = useCallback((element: HTMLCanvasElement | null) => {
    if (!element) return
    engine.attach(element)
    return () => engine.detach()
  }, [])

  return { canvasRef }
}

export function useCanvas() {
  const playing = useStore(canvasStore, (state) => state.playing)
  const totalFrames = useStore(canvasStore, (state) => state.totalFrames)
  const fps = useStore(canvasStore, (state) => state.fps)
  const zoom = useStore(canvasStore, (state) => state.zoom)
  const slots = useStore(canvasStore, (state) => state.slots)
  const controls = useStore(canvasStore, (state) => state.controls)

  return {
    playing,
    totalFrames,
    fps,
    zoom,
    slots,
    controls,
    getCanvasKit,
    setScalarSlot: engine.setScalarSlot,
    setColorSlot: engine.setColorSlot,
    setVec2Slot: engine.setVec2Slot,
    setTextSlot: engine.setTextSlot,
    commitSource: engine.commitSource,
    togglePlayback: engine.togglePlayback,
    seek: engine.seek,
    zoomByCentered: engine.zoomByCentered,
    resetCamera: engine.resetCamera,
  }
}

// The playhead changes on every animation frame, so only the widgets that show
// it subscribe to it.
export function useCanvasFrame() {
  return useStore(canvasStore, (state) => state.currentFrame)
}

function toFrame(raw: unknown): number | null {
  if (raw == null) return null
  const frame = Number(raw)
  return Number.isFinite(frame) ? frame : null
}

function readSlots(
  anim: ManagedSkottieAnimation,
  sourceDoc: LottieDoc | null | undefined,
  textOverrides: Record<string, string>,
): AnimationSlot[] {
  const info = anim.getSlotInfo()
  const slots: AnimationSlot[] = []
  for (const id of info.scalarSlotIDs) {
    slots.push({ id, type: 'scalar', value: anim.getScalarSlot(id) ?? 0 })
  }
  for (const id of info.colorSlotIDs) {
    const c = anim.getColorSlot(id)
    slots.push({
      id,
      type: 'color',
      value: c ? [c[0], c[1], c[2], c[3]] : [0, 0, 0, 1],
    })
  }
  for (const id of info.vec2SlotIDs) {
    const v = anim.getVec2Slot(id)
    slots.push({ id, type: 'vec2', value: v ? [v[0], v[1]] : [0, 0] })
  }
  for (const id of info.textSlotIDs) {
    slots.push({
      id,
      type: 'text',
      value: textOverrides[id] ?? readTextSlotValue(sourceDoc, id) ?? '',
    })
  }
  return slots
}

async function loadLabelTypeface(ck: CanvasKit): Promise<Typeface | null> {
  try {
    const res = await fetch(LABEL_FONT_URL)
    if (!res.ok) return null
    return ck.Typeface.MakeFreeTypeFaceFromData(await res.arrayBuffer())
  } catch {
    return null
  }
}

async function loadControlsMeta(scene: Scene): Promise<Record<string, ControlMeta>> {
  if (!scene.controls) return {}
  try {
    const res = await fetch(scene.controls)
    if (!res.ok) return {}
    const data = (await res.json()) as { controls?: ControlMeta[] }
    return Object.fromEntries((data.controls ?? []).map((c) => [c.sid, c]))
  } catch {
    return {}
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function textWidth(font: Font, text: string): number {
  let width = 0
  for (const advance of font.getGlyphWidths(font.getGlyphIDs(text))) {
    width += advance
  }
  return width
}

// Truncate the label with an ellipsis once it is wider than the frame, like Figma
function fitLabel(font: Font, text: string, maxWidth: number): string {
  if (textWidth(font, text) <= maxWidth) return text
  const ellipsis = '…'
  const budget = maxWidth - textWidth(font, ellipsis)
  let width = 0
  let out = ''
  for (const char of text) {
    width += textWidth(font, char)
    if (width > budget) break
    out += char
  }
  return out && out + ellipsis
}
