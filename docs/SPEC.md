# WePyxel — Master Technical Specification

**Version:** 1.0.0
**Status:** Draft
**Last Updated:** 2026-10-31
**Authors:** Project Team

---

## Table of Contents

1. [Purpose & Scope](#1-purpose--scope)
2. [Guiding Principles](#2-guiding-principles)
3. [System Constraints](#3-system-constraints)
4. [Functional Requirements](#4-functional-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [PWA Requirements](#6-pwa-requirements)
7. [Data & Privacy Model](#7-data--privacy-model)
8. [Browser Compatibility](#8-browser-compatibility)
9. [Accessibility](#9-accessibility)
10. [Security Considerations](#10-security-considerations)
11. [Known Deferred Issues](#11-known-deferred-issues)
12. [Glossary](#12-glossary)

---

## 1. Purpose & Scope

### 1.1 Purpose

**WePyxel** is a **fully client-side image editing web application** delivered as a Progressive Web App (PWA). It provides a set of image manipulation tools that run entirely in the user's browser — no data is transmitted to any server.

### 1.2 Scope

**In scope (v1.0):**
- Core image editing tools (crop, resize, rotate, flip, filters, color correction)
- File input (local file system, drag-and-drop)
- File output (PNG, JPEG, WebP export)
- PWA installability (desktop + mobile)
- Undo/redo history
- Responsive UI for desktop and mobile browsers

**Out of scope (v1.0 — considered for future):**
- User accounts / authentication
- Cloud storage / sync
- Server-side processing
- Collaboration / sharing
- Video editing
- RAW camera format support
- Plugin/extension system (integration hook reserved — see §3.3)

### 1.3 Relationship to Larger System

WePyxel is designed to be **embedded or integrated** into a larger image service ecosystem. A clean integration boundary is maintained via:
- A well-defined JavaScript module API (`src/lib/` exports)
- Event-driven communication (CustomEvents) for host page integration
- No global state pollution

---

## 2. Guiding Principles

| # | Principle | Implication |
|---|---|---|
| P1 | **Privacy first** | No image data transmitted; no analytics on image content |
| P2 | **No backend dependency** | All features work offline after first load |
| P3 | **Progressive enhancement** | Core editing works without WASM; AI features load on demand |
| P4 | **Mobile parity** | Touch-first interaction design; not an afterthought |
| P5 | **Performance budget** | Initial load < 500 KB gzipped (excluding lazy WASM modules) |
| P6 | **Pluggability** | Clean module boundaries; easy to extend or embed |

---

## 3. System Constraints

### 3.1 Infrastructure Constraints

| Constraint | Detail |
|---|---|
| Hosting | GitHub Pages (free tier) — static files only |
| CI/CD | GitHub Actions only |
| Local dev | Docker + Docker Compose required |
| Version control | Git; repository hosted on GitHub |

### 3.2 Technology Constraints

| Constraint | Detail |
|---|---|
| Language | JavaScript (ES2022+); no TypeScript requirement (can be added) |
| Framework | Svelte 4+ |
| Build tool | Vite 5+ |
| CSS | Tailwind CSS 3+ |
| No backend | No Node.js server, no database, no REST/GraphQL API |
| No SSR | Client-side rendering only |

### 3.3 Integration Constraint

The application must expose a stable programmatic API at `window.WePyxel` (or as an ES module) so that a host application can:
- Load an image programmatically
- Receive the edited image as a `Blob` or `ArrayBuffer`
- Subscribe to editor state events (imageLoaded, editComplete, etc.)

---

## 4. Functional Requirements

### 4.1 Image Input

| ID | Requirement | Priority |
|---|---|---|
| FR-IN-01 | User can open a local image file via file picker (JPG, PNG, WebP, GIF, BMP, SVG) | Must |
| FR-IN-02 | User can drag and drop an image file onto the editor canvas | Must |
| FR-IN-03 | User can paste an image from clipboard (Ctrl+V) | Should |
| FR-IN-04 | User can open a URL-referenced image (CORS-permitting) | Could |
| FR-IN-05 | Host application can load an image programmatically via the integration API | Must |

### 4.2 Image Export

| ID | Requirement | Priority |
|---|---|---|
| FR-EX-01 | User can export/download the edited image as PNG | Must |
| FR-EX-02 | User can export/download the edited image as JPEG with quality slider | Must |
| FR-EX-03 | User can export/download the edited image as WebP | Must |
| FR-EX-04 | User can export/download the edited image as AVIF (Phase 2, requires ffmpeg.wasm) | Should |
| FR-EX-05 | Host application can receive the edited image as a `Blob` via integration API | Must |

### 4.3 Core Editing Tools (Phase 1)

| ID | Feature | Requirement | Priority |
|---|---|---|---|
| FR-CROP-01 | Crop | Freehand crop with drag handles | Must |
| FR-CROP-02 | Crop | Preset aspect ratios (1:1, 16:9, 4:3, 3:2, free) | Must |
| FR-CROP-03 | Crop | Numerical input for crop dimensions | Should |
| FR-ROT-01 | Rotate | 90° clockwise / counter-clockwise buttons | Must |
| FR-ROT-02 | Rotate | Arbitrary angle rotation with slider (±45°) | Should |
| FR-FLIP-01 | Flip | Horizontal and vertical flip | Must |
| FR-RES-01 | Resize | Resize by pixel dimensions with lock aspect ratio | Must |
| FR-RES-02 | Resize | Resize by percentage | Should |
| FR-RES-03 | Resize | High-quality Lanczos downsampling (via Pica) | Must |

### 4.4 Filter & Adjustment Tools (Phase 1)

| ID | Feature | Requirement | Priority |
|---|---|---|---|
| FR-FIL-01 | Filters | Preset filter gallery (grayscale, sepia, vintage, vivid, etc.) | Must |
| FR-FIL-02 | Brightness | Brightness slider (−100 to +100) | Must |
| FR-FIL-03 | Contrast | Contrast slider (−100 to +100) | Must |
| FR-FIL-04 | Saturation | Saturation slider | Must |
| FR-FIL-05 | Blur | Gaussian blur slider | Must |
| FR-FIL-06 | Sharpen | Sharpening filter | Should |

### 4.5 Advanced Tools (Phase 2)

| ID | Feature | Requirement | Priority |
|---|---|---|---|
| FR-ADV-01 | Color Correction | RGB Curves editor | Should |
| FR-ADV-02 | Color Correction | HSL (Hue/Saturation/Lightness) adjustments | Must |
| FR-ADV-03 | Color Correction | White balance / temperature slider | Should |
| FR-ADV-04 | Watermark | Add text watermark with font, size, opacity, position | Should |
| FR-ADV-05 | Watermark | Add image watermark with opacity, position, scale | Could |
| FR-ADV-06 | Export | Batch export (multiple files, same settings) | Could |
| FR-ADV-07 | EXIF | Strip EXIF metadata on export | Should |

### 4.6 History & Undo

| ID | Requirement | Priority |
|---|---|---|
| FR-HIS-01 | Full undo/redo stack (minimum 20 steps) | Must |
| FR-HIS-02 | Keyboard shortcuts: Ctrl+Z (undo), Ctrl+Shift+Z (redo) | Must |
| FR-HIS-03 | Visual history panel showing thumbnails of each step | Could |

---

## 5. Non-Functional Requirements

### 5.1 Performance

| ID | Requirement |
|---|---|
| NFR-PERF-01 | Initial JS bundle (app shell) ≤ 500 KB gzipped |
| NFR-PERF-02 | First Contentful Paint (FCP) < 2s on a 4G connection |
| NFR-PERF-03 | Filter application on a 5 MP image < 1s (desktop) |
| NFR-PERF-04 | WASM modules must be loaded lazily on first use |
| NFR-PERF-05 | Heavy processing must run in a Web Worker to not block UI |

### 5.2 Reliability

| ID | Requirement |
|---|---|
| NFR-REL-01 | App must function fully offline after first load |
| NFR-REL-02 | Editing state must not be lost on accidental page refresh (warn user) |
| NFR-REL-03 | WASM feature failure must degrade gracefully (feature unavailable, not crash) |

### 5.3 Usability

| ID | Requirement |
|---|---|
| NFR-USE-01 | App must be usable on screens ≥ 320px wide |
| NFR-USE-02 | All interactive elements must have a minimum touch target of 44×44 px |
| NFR-USE-03 | Canvas zoom/pan must support pinch-to-zoom on touch devices |

### 5.4 Maintainability

| ID | Requirement |
|---|---|
| NFR-MNT-01 | All image processing logic must be in `src/lib/` (not in components) |
| NFR-MNT-02 | Each WASM module must have a typed wrapper in `src/lib/wasm/` |
| NFR-MNT-03 | Each architectural decision must have a corresponding ADR in `docs/ADR/` |

---

## 6. PWA Requirements

| ID | Requirement | Detail |
|---|---|---|
| PWA-01 | Valid Web App Manifest | `name`, `short_name`, `icons`, `start_url`, `display: standalone`, `theme_color` |
| PWA-02 | Service Worker registered | Handles install, fetch, and activate events |
| PWA-03 | Offline capable | App shell cached; WASM cached after first use |
| PWA-04 | Installable | Passes Chrome Lighthouse PWA audit (score ≥ 90) |
| PWA-05 | Icons | 192×192 and 512×512 PNG icons provided |
| PWA-06 | HTTPS | Enforced by GitHub Pages |

---

## 7. Data & Privacy Model

- **No data is transmitted.** All image data stays in the browser's memory.
- **No cookies** are set for tracking purposes.
- **No analytics** on image content.
- **Local Storage / IndexedDB** may be used only for user preferences (theme, last-used settings) and history — never image content.
- **File System Access API** is used for reading/writing large files without loading into memory unnecessarily.
- On export, users may optionally strip EXIF metadata (FR-ADV-08).

---

## 8. Browser Compatibility

| Browser | Minimum Version | Notes |
|---|---|---|
| Chrome / Edge | 95+ | Full support including File System Access API |
| Firefox | 90+ | File System Access API not supported; fallback to `<input type="file">` |
| Safari | 16.4+ | Limited PWA support; no push notifications; Service Worker supported |
| Samsung Internet | 15+ | Full support |
| Mobile Chrome | 95+ | Primary mobile target |

> **Baseline:** All Phase 1 features must work in Chrome 95+, Firefox 90+, Safari 16.4+.
> WASM-dependent features (Phase 2/3) may have graceful degradation on older browsers.

---

## 9. Accessibility

| ID | Requirement |
|---|---|
| ACC-01 | WCAG 2.1 Level AA compliance for all UI controls |
| ACC-02 | All toolbar icons must have `aria-label` attributes |
| ACC-03 | Color adjustments must not be the sole means of conveying information |
| ACC-04 | Keyboard navigation must be supported for all tools |
| ACC-05 | Focus management must be correct when modals / panels open and close |

---

## 10. Security Considerations

| Concern | Mitigation |
|---|---|
| **XSS via image metadata** | Strip EXIF/metadata before rendering any string values from image files |
| **SVG XSS** | SVG files sanitized before rendering using DOMPurify |
| **Content Security Policy** | Strict CSP header set; no `unsafe-inline` for scripts |
| **WASM origin** | WASM modules loaded only from the app's own origin or a pinned CDN URL |
| **Cross-Origin Image** | Images from external URLs loaded via `crossOrigin = "anonymous"` |

---

## 11. Known Deferred Issues

### DEF-001 — ffmpeg.wasm Cross-Origin Isolation

**Description:**
`ffmpeg.wasm` requires `SharedArrayBuffer`, which in turn requires the page to be served with the following HTTP headers:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

**Impact:** Without these headers, format conversions to AVIF and GIF (Phase 2) cannot use ffmpeg.wasm.

**Current GitHub Pages limitation:** GitHub Pages does not support custom HTTP response headers by default.

**Workarounds under evaluation:**
1. **Service Worker header injection** — A Service Worker can intercept responses and inject COOP/COEP headers. Works in Chrome/Edge; Firefox support is partial; not supported in Safari. Library: `coi-serviceworker`.
2. **Migrate to Cloudflare Pages** — Supports `_headers` file for custom response headers. Free tier available.
3. **Netlify** — Supports `_headers` or `netlify.toml` for custom headers.
4. **Limit to Canvas-native formats** — PNG, JPEG, WebP can be exported using the native Canvas `toBlob()` API without ffmpeg.wasm. AVIF/GIF conversion can be deferred entirely.

**Decision:** Deferred to Phase 2. Phase 1 exports use only Canvas `toBlob()` (PNG, JPEG, WebP). See [ADR-004](ADR/ADR-004-ffmpeg-wasm-deferred.md).

---

## 12. Glossary

| Term | Definition |
|---|---|
| **PWA** | Progressive Web App — a web application with native-like install and offline capabilities |
| **WASM** | WebAssembly — a binary instruction format for a stack-based virtual machine, enabling near-native performance in the browser |
| **Canvas API** | Browser API for 2D raster graphics rendering |
| **COEP** | Cross-Origin Embedder Policy — HTTP header required for SharedArrayBuffer access |
| **COOP** | Cross-Origin Opener Policy — HTTP header required for SharedArrayBuffer access |
| **Service Worker** | A background script that intercepts network requests, enabling offline functionality and PWA features |
| **Fabric.js** | A powerful JavaScript canvas library that provides an object model on top of the Canvas API |
| **Pica** | A JavaScript library for high-quality image resizing using Lanczos and other algorithms |
| **SDD** | Spec-Driven Development — writing detailed specifications before implementation |
| **ADR** | Architecture Decision Record — a document capturing an important architectural decision |
