# @stardust/studio

Local workspace for authoring StarDust motion assets. It currently hosts the
[Text-to-Lottie](https://github.com/diffusionstudio/lottie) player, a Skia
Skottie renderer where coding agents create and preview Lottie animations.
It runs independently of the Backoffice in `apps/backoffice`.

The player source was copied from `diffusionstudio/lottie` at commit
`3c72912f` under the MIT License (see `LICENSE`), then rewritten from Solid to
React in Shifu. This package ports that local authoring tool into StarDust,
keeping its renderer, UI structure, scene workflow and sample animations.
Upstream updates cannot be copied in; port them by hand.

## Source layout

```text
src/
├── constants/          route paths
├── types/              scene and Lottie types
├── utils/              pure Lottie slot logic
└── ui/
    ├── shadcn/         UI primitives
    ├── shared/
    │   ├── hooks/      shared state and scene file I/O: use-scenes, use-ui, use-canvas
    │   ├── styles/
    │   └── widgets/    shared components and the root layout
    └── studio/widgets/ studio layout and pages
```

Shared state uses shared hooks instead of context providers. Each hook keeps
its state in a module-level store (`utils/store.ts`) that React reads with
`useSyncExternalStore`. `use-canvas` owns a single renderer for the page; the
root layout attaches it to the canvas and passes in the current route through
`useCanvasHost`, and every other widget reads it through `useCanvas`. The
playhead updates every animation frame, so only `useCanvasFrame` subscribes
to it.

## Usage

```sh
npm install
npm run dev:studio
```

The dev server prefers port `3030` and falls back to the next free port. Use
the URL Vite prints.

No API, database, login or environment variables are required. The Vite plugin
serves the scene catalog and writes edits directly to local scene files. The
tool is started separately from `npm run dev`.

The `text-to-lottie` agent skill can be used to author animations if installed
separately. It is not included in this package.

## Scenes

Each animation is a scene under `public/projects/<project>/<scene-N>/`:

- `lottie.json` is required;
- `controls.json`, images and fonts are optional and live next to it.

Open a scene at `http://localhost:<port>/<project>/<scene-N>` and pin a frame
with `?frame=<N>`.

## Checks

```sh
npm run check:code -w @stardust/studio
npm run check:types -w @stardust/studio
npm run build:studio
```

## Development and preview

Project and scene creation, deletion, property saving and `/__context` are
available only in development. A production build includes a static
`scenes.json` catalog for playback. `npm run preview -w @stardust/studio`
serves that build without the editing backend.

`npm install` copies CanvasKit WASM into `public/canvaskit.wasm` through the
package postinstall script. If installation skips lifecycle scripts, run
`npm run postinstall -w @stardust/studio` before starting or building.

Animation source can be imported by workspace consumers as
`@stardust/studio/scenes/<project>/<scene>`. The included `mascot` and
`gamification` projects are samples copied from Shifu.
