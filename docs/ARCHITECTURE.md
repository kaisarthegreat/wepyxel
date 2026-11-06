# WePyxel — System Architecture

**Version:** 1.0.0
**Status:** Draft
**Last Updated:** 2026-10-31

---

## 1. High-Level Architecture

WePyxel is a **single-page application (SPA)** delivered as a **Progressive Web App**. There is no server-side component; all image processing occurs in the client browser.

```
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER                              │
│                                                             │
│  ┌──────────────┐   ┌──────────────────────────────────┐   │
│  │  Service     │   │           SPA (Svelte)           │   │
│  │  Worker      │◄──│  ┌──────────────────────────┐    │   │
│  │  (offline /  │   │  │      UI Components        │   │   │
│  │   caching)   │   │  │  Toolbar │ Canvas │ Panels│   │   │
│  └──────────────┘   │  └────────────────┬─────────┘   │   │
│                      │                  │              │   │
│                      │  ┌───────────────▼──────────┐  │   │
│                      │  │       Svelte Stores       │  │   │
│                      │  │  imageStore │ historyStore│  │   │
│                      │  └───────────────┬──────────┘  │   │
│                      │                  │              │   │
│                      │  ┌───────────────▼──────────┐  │   │
│                      │  │    Processing Core (lib/) │  │   │
│                      │  │  canvas │ filters │ wasm  │  │   │
│                      │  └───┬─────────────────┬─────┘  │   │
│                      │      │                 │         │   │
│                      │  ┌───▼────┐    ┌───────▼──────┐ │   │
│                      │  │ Canvas │    │  Web Workers  │ │   │
│                      │  │  API   │    │ (WASM / heavy)│ │   │
│                      │  │WebGL   │    │               │ │   │
│                      │  └────────┘    └───────────────┘ │   │
│                      └──────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
          ▲                              ▲
          │ File System                  │ (future)
          │ Access API                   │ Host App Integration API
          ▼                              ▼
    Local Disk                    Parent/Host Application
```

---

## 2. Layer Descriptions

### 2.1 Service Worker Layer

- Registered by `vite-plugin-pwa` (Workbox under the hood)
- **Caches:** App shell (HTML, JS, CSS), fonts, icons
- **Network strategy:** Cache-first for static assets; network-first for anything not in cache
- **WASM caching:** WASM blobs cached in `Cache Storage` after first use
- **Offline:** App is fully functional offline for Phase 1 features after first load

### 2.2 UI Layer (Svelte Components)

```
src/components/
├── layout/
│   ├── AppShell.svelte          # Main layout wrapper
│   ├── Toolbar.svelte           # Left/top tool selector
│   └── StatusBar.svelte         # Bottom status / zoom info
├── canvas/
│   ├── EditorCanvas.svelte      # Main canvas mount point
│   ├── CropOverlay.svelte       # Crop handle overlay
│   └── ZoomControls.svelte      # Zoom in/out/fit buttons
├── panels/
│   ├── AdjustmentsPanel.svelte  # Brightness/contrast/etc.
│   ├── FiltersPanel.svelte      # Preset filter gallery
│   ├── ResizePanel.svelte       # Resize inputs
│   ├── ExportPanel.svelte       # Export format & quality
│   └── HistoryPanel.svelte      # Undo/redo history list
└── shared/
    ├── Slider.svelte            # Reusable range slider
    ├── Button.svelte
    ├── Modal.svelte
    └── Tooltip.svelte
```

### 2.3 State Layer (Svelte Stores)

```
src/stores/
├── imageStore.js        # Source image, canvas dimensions, zoom level
├── historyStore.js      # Undo/redo command stack
├── toolStore.js         # Active tool, tool options
├── settingsStore.js     # User preferences (persisted to localStorage)
└── uiStore.js           # Panel visibility, loading states
```

**History pattern:** Command pattern with `execute()` / `undo()` methods.

```js
// Conceptual command structure
class AdjustBrightnessCommand {
  constructor(canvas, value) { ... }
  execute() { /* apply brightness */ }
  undo()    { /* restore previous state */ }
}
```

### 2.4 Processing Core (`src/lib/`)

```
src/lib/
├── canvas/
│   ├── fabricWrapper.js     # Fabric.js initialisation & helpers
│   ├── imageLoader.js       # Load image into canvas from File / URL / Blob
│   └── imageExporter.js     # Export canvas to Blob (PNG/JPEG/WebP)
├── filters/
│   ├── presetFilters.js     # Named filter presets (grayscale, sepia, etc.)
│   ├── adjustments.js       # Brightness, contrast, saturation, HSL
│   └── pipeline.js          # Composable filter pipeline
├── tools/
│   ├── crop.js              # Crop logic
│   ├── resize.js            # Resize via Pica
│   ├── rotate.js            # Rotation & flip
│   └── watermark.js         # Text/image watermark
├── wasm/
│   └── ffmpegLoader.js      # ffmpeg.wasm lazy loader (Phase 2+, deferred — see DEF-001)
├── history/
│   ├── CommandStack.js      # Undo/redo stack implementation
│   └── commands/            # Individual command implementations
├── metadata/
│   ├── exifReader.js        # Read EXIF with exifr
│   └── exifStrip.js         # Strip EXIF with piexifjs
└── integration/
    └── api.js               # Public API for host application embedding
```

### 2.5 Web Workers

Heavy operations run off the main thread to keep the UI responsive:

| Worker | Responsibility |
|---|---|
| `workers/filterWorker.js` | CPU-intensive filter application |
| `workers/resizeWorker.js` | High-quality resize via Pica |
| `workers/ffmpegWorker.js` | Format conversion WASM (Phase 2, deferred — see DEF-001) |

---

## 3. Data Flow

### 3.1 Opening an Image

```
User selects file
      │
      ▼
imageLoader.js
  ├── Reads File via FileReader or File System Access API
  ├── Creates ImageBitmap
  └── Loads into Fabric.js canvas
      │
      ▼
imageStore updated (dimensions, zoom, filename)
      │
      ▼
UI re-renders (canvas size, status bar)
```

### 3.2 Applying a Filter

```
User moves Brightness slider
      │
      ▼
AdjustmentsPanel dispatches BrightnessCommand
      │
      ▼
CommandStack.execute(BrightnessCommand)
      │
      ├── Pushes to undo stack
      └── Calls adjustments.js (or filterWorker)
                │
                ▼
          Canvas pixel data updated
                │
                ▼
          Canvas re-renders
```

### 3.3 Exporting an Image

```
User selects format + quality → clicks Export
      │
      ▼
imageExporter.js
  ├── Phase 1: canvas.toBlob(format, quality)
  └── Phase 2: ffmpegWorker (AVIF, GIF) [DEFERRED]
      │
      ▼
EXIF strip (if opted in) via exifStrip.js
      │
      ▼
Blob URL created → <a download> triggered
OR
integration API resolves with Blob
```

---

## 4. Module Dependency Graph

```
App.svelte
  └── AppShell
        ├── Toolbar ──────────────► toolStore
        ├── EditorCanvas ─────────► imageStore, historyStore
        │     └── CropOverlay ──► toolStore
        ├── AdjustmentsPanel ─────► imageStore, historyStore
        │     └── adjustments.js (lib)
        ├── FiltersPanel ─────────► historyStore
        │     └── presetFilters.js (lib)
        ├── ResizePanel ──────────► imageStore
        │     └── resize.js (lib) → resizeWorker
        └── ExportPanel ──────────► imageExporter.js (lib)
```

---

## 5. Integration API (Host Embedding)

When embedded in a host application, WePyxel exposes:

```js
// Load image into editor
window.WePyxel.loadImage(blob: Blob | File | string): Promise<void>

// Get edited image
window.WePyxel.getImage(format: 'png'|'jpeg'|'webp', quality?: number): Promise<Blob>

// Subscribe to events
window.WePyxel.on('imageLoaded', handler)
window.WePyxel.on('editComplete', handler)
window.WePyxel.on('error', handler)
```

This API is implemented in `src/lib/integration/api.js` and is a **thin adapter layer** — no business logic lives here.

---

## 6. CI/CD Pipeline

```
Developer pushes to GitHub
        │
        ▼
GitHub Actions Workflow (.github/workflows/deploy.yml)
  ├── Checkout code
  ├── Setup Node.js (via Docker image or actions/setup-node)
  ├── Install dependencies (pnpm install)
  ├── Lint (eslint)
  ├── Build (vite build)
  ├── [Future] Run tests (vitest)
  └── Deploy to GitHub Pages (gh-pages branch)
        │
        ▼
https://<username>.github.io/<repo>/
```

---

## 7. Local Development Environment (Docker)

```yaml
# docker-compose.yml (conceptual)
services:
  app:
    image: node:20-alpine
    volumes:
      - .:/app
    working_dir: /app
    ports:
      - "5173:5173"
    command: sh -c "pnpm install && pnpm dev --host"
```

**Why Docker for a static app?**
- Guarantees identical Node.js version across all developer machines
- No "works on my machine" issues with global pnpm/Node versions
- Ready to add additional services (mock API, proxy) when integrating with a larger system later

---

## 8. Security Architecture

| Layer | Mechanism |
|---|---|
| **Content Security Policy** | Strict CSP via `<meta>` tag or GitHub Pages custom headers |
| **SVG sanitization** | DOMPurify runs on all SVG content before canvas rendering |
| **EXIF sanitization** | Metadata values are never rendered as HTML — always as text |
| **WASM integrity** | WASM files loaded from same origin; hash checked via Vite build |
| **No eval** | `unsafe-eval` not permitted; no dynamic code execution |

---

## 9. Performance Architecture

| Concern | Strategy |
|---|---|
| **Initial load** | Code splitting per panel/tool; lazy import WASM modules |
| **Large images** | `OffscreenCanvas` + Web Workers; tile processing for very large images |
| **Filter application** | WebGL shaders (GPU) for real-time preview; Canvas 2D for final render |
| **Memory** | `ImageBitmap` for GPU-decoded images; explicit `close()` to free memory |
| **PWA cache** | Workbox `precacheAndRoute` for app shell; runtime caching for WASM |
