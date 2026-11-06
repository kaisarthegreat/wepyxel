# WePyxel — Development Roadmap

**Version:** 1.0.0
**Status:** Draft
**Last Updated:** 2026-10-31

---

## Guiding Philosophy

- Ship a working, useful product at each phase milestone
- No phase depends on infrastructure changes from the next phase
- WASM features are always additive — base editing never regresses

---

## Phase Overview

```
Phase 1 — Core                Phase 2 — Advanced
──────────────────            ────────────────────
✦ Project scaffold            ✦ Color curves / HSL
✦ Docker + CI/CD              ✦ Watermark
✦ PWA setup                   ✦ EXIF management
✦ Canvas + Fabric.js          ✦ Batch export
✦ Crop / Rotate / Flip        ✦ Format conversion
✦ Resize (Pica)                 (ffmpeg.wasm — see DEF-001)
✦ Basic filters               ✦ Integration API
✦ Adjustments panel
✦ Export (PNG/JPEG/WebP)
✦ Undo / Redo
```

---

## Phase 1 — Core Editing Platform

**Goal:** A fully functional, installable image editor with the most common tools.
**Target:** MVP release — public on GitHub Pages

### Sprint 1 — Project Foundation

| Task | Description | Priority |
|---|---|---|
| T1-01 | Initialize Git repo with branch strategy | Must |
| T1-02 | Create Dockerfile + docker-compose.yml for local dev | Must |
| T1-03 | Scaffold Vite + Svelte + Tailwind CSS project | Must |
| T1-04 | Configure `vite-plugin-pwa` with basic manifest | Must |
| T1-05 | Set up GitHub Actions workflow: lint → build → deploy to GitHub Pages | Must |
| T1-06 | Create `public/manifest.json` with icons (192×192, 512×512) | Must |
| T1-07 | Implement basic App shell layout (toolbar, canvas area, panel) | Must |
| T1-08 | Implement Service Worker (offline app shell caching) | Must |

**Exit Criteria:** Empty Svelte app deploys to GitHub Pages, installable as PWA.

---

### Sprint 2 — Image Input & Canvas

| Task | Description | Priority |
|---|---|---|
| T2-01 | Integrate Fabric.js; initialize canvas | Must |
| T2-02 | Implement file picker input (F01) | Must |
| T2-03 | Implement drag-and-drop image loading (F01) | Must |
| T2-04 | Implement clipboard paste (F01) | Should |
| T2-05 | Implement zoom-to-fit on image load | Must |
| T2-06 | Implement canvas zoom (wheel + pinch) and pan | Must |
| T2-07 | Display image metadata in status bar (filename, dimensions) | Should |

**Exit Criteria:** User can open an image from disk and see it in the canvas.

---

### Sprint 3 — Core Tools

| Task | Description | Priority |
|---|---|---|
| T3-01 | Implement Crop tool with drag handles + aspect ratio presets (F02) | Must |
| T3-02 | Implement Rotate 90° left/right buttons (F03) | Must |
| T3-03 | Implement Flip Horizontal/Vertical (F03) | Must |
| T3-04 | Implement free-angle rotation slider (F03) | Should |
| T3-05 | Integrate Pica in a Web Worker for Resize (F04) | Must |
| T3-06 | Build ResizePanel UI with pixel/percentage modes and aspect-lock (F04) | Must |

**Exit Criteria:** User can crop, rotate, flip, and resize an image.

---

### Sprint 4 — Filters, Adjustments & History

| Task | Description | Priority |
|---|---|---|
| T4-01 | Implement Command pattern undo/redo stack (F08) | Must |
| T4-02 | Implement Brightness, Contrast, Saturation, Blur, Sharpen sliders (F05) | Must |
| T4-03 | Implement Preset Filters gallery with thumbnails (F06) | Must |
| T4-04 | Wire all editing operations to the undo stack | Must |
| T4-05 | Keyboard shortcuts: Ctrl+Z, Ctrl+Shift+Z | Must |
| T4-06 | Undo/Redo toolbar buttons (enabled/disabled state) | Must |

**Exit Criteria:** All tools are undoable; filters and adjustments work in real-time.

---

### Sprint 5 — Export & Polish

| Task | Description | Priority |
|---|---|---|
| T5-01 | Implement export panel (PNG/JPEG/WebP, quality slider) (F07) | Must |
| T5-02 | Integrate piexifjs for EXIF stripping on export (F07) | Should |
| T5-03 | Implement estimated file size preview in export panel | Should |
| T5-04 | Responsive layout testing (mobile breakpoints) | Must |
| T5-05 | Touch interaction testing (crop handles, sliders) | Must |
| T5-06 | Lighthouse PWA audit — fix any issues to score ≥ 90 | Must |
| T5-07 | Accessibility audit (WCAG 2.1 AA) | Must |
| T5-08 | Cross-browser testing (Chrome, Firefox, Safari, Edge) | Must |

**Exit Criteria:** Phase 1 complete. Product is publicly deployed, fully offline-capable, and passes PWA audit.

---

## Phase 2 — Advanced Features

**Goal:** Add professional-grade tools and extended format support while maintaining bundle size discipline.
**Target:** Follow-on release

### Key Tasks

| Task | Description | Priority |
|---|---|---|
| T6-01 | Implement HSL color correction panel (F09) | Must |
| T6-02 | Implement RGB Curves editor (F09) | Should |
| T6-03 | Implement White Balance temperature slider (F09) | Should |
| T6-04 | Implement Text Watermark tool (F10) | Should |
| T6-05 | Integrate `exifr` for EXIF metadata reading (F11) | Should |
| T6-06 | Evaluate & resolve DEF-001 (ffmpeg.wasm COEP/COOP headers) | Should |
| T6-07 | If DEF-001 resolved: add AVIF/GIF export via ffmpegWorker | Could |
| T6-08 | Implement Integration API (`src/lib/integration/api.js`) | Must |

#### DEF-001 Resolution Decision Point (T6-06)

Before implementing T6-07, evaluate these options:
1. `coi-serviceworker` — quick win, Chrome/Edge only
2. Migrate hosting to **Cloudflare Pages** — free tier, full COOP/COEP support
3. Defer AVIF/GIF entirely and use Canvas-native formats only

**Recommendation:** Try `coi-serviceworker` first; migrate to Cloudflare Pages if Safari support is required.

---

## Version History

| Version | Phase | Status |
|---|---|---|
| v0.1.0 | Phase 1 — Sprint 1–2 | Not started |
| v0.2.0 | Phase 1 — Sprint 3 | Not started |
| v0.3.0 | Phase 1 — Sprint 4 | Not started |
| v1.0.0 | Phase 1 — Sprint 5 (MVP) | Not started |
| v1.5.0 | Phase 2 | Not started |

---

## Known Deferred Issues Tracked in Roadmap

| Ref | Issue | Addressed In |
|---|---|---|
| DEF-001 | ffmpeg.wasm requires COOP/COEP headers; GitHub Pages cannot set them | Phase 2, T6-06 |
