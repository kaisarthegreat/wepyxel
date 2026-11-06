# ADR-002 — No Backend: Fully Client-Side Architecture

**Status:** Accepted
**Date:** 2026-10-31
**Deciders:** Project Team

---

## Context

The platform needs to process images (crop, resize, filters, background removal, etc.). There are two fundamental architectural options:

1. **Server-side processing:** Upload image to a backend API, process it there, return the result.
2. **Client-side processing:** Process the image entirely in the browser using Canvas API, WebAssembly, and Web Workers.

The requirements explicitly state: **no backend dependency**.

---

## Decision

**All image processing is performed entirely in the user's browser. No server is required for the core platform.**

---

## Rationale

| Criterion | Client-Side | Server-Side |
|---|---|---|
| Privacy | ✅ Images never leave the device | ❌ Images uploaded to servers |
| Cost | ✅ Zero hosting cost (GitHub Pages free tier) | ❌ Compute costs scale with usage |
| Offline | ✅ Works offline after first load | ❌ Requires internet connection |
| Complexity | ✅ No backend to build/maintain/secure | ❌ API, auth, storage, scaling |
| Performance | ⚠️ Limited by device CPU/GPU/RAM | ✅ Server has more compute for heavy tasks |
| AI features | ⚠️ WASM model size adds download overhead | ✅ Thin API call to powerful model |
| Scalability | ✅ Scales freely (CDN-served static files) | ❌ Requires autoscaling infrastructure |

The trade-offs in performance and AI quality are acceptable for Phase 1–2. Modern browsers with WASM and WebGL provide sufficient compute for all planned features.

---

## Consequences

- **Positive:** Zero operational cost; deploys to GitHub Pages for free.
- **Positive:** Privacy-preserving by design — a genuine user benefit.
- **Positive:** Works offline; installable as a PWA.
- **Negative:** Heavy WASM models (background removal, ffmpeg) increase first-use download size.
- **Negative:** Very large images (>20 MP) may exceed device memory on low-end phones.
- **Mitigated by:** WASM modules are lazy-loaded and cached; a warning is shown for very large images; the architecture reserves a clean integration point for future server offloading.

---

## Future Integration Path

The no-backend decision does **not** preclude future integration with a server. The integration API (`src/lib/integration/api.js`) is designed so that a host application can:
- Supply images from a server
- Receive processed images and upload them

This keeps PixelForge optionally server-connected without coupling the core editor to any backend.
