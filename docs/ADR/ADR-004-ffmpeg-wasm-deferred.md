# ADR-004 — Defer ffmpeg.wasm to Phase 2 (COOP/COEP Header Issue)

**Status:** Accepted
**Date:** 2026-10-31
**Deciders:** Project Team

---

## Context

`ffmpeg.wasm` is a WebAssembly port of the FFmpeg multimedia framework. It enables client-side conversion to formats like AVIF, GIF, and others that the browser's native Canvas API cannot produce via `toBlob()`.

### The Technical Problem

`ffmpeg.wasm` internally uses `SharedArrayBuffer` for multithreaded WASM execution. `SharedArrayBuffer` was disabled in all browsers after the Spectre/Meltdown CPU vulnerabilities (2018) and was re-enabled **only** for pages served with both of the following HTTP response headers:

```http
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

These headers together establish **Cross-Origin Isolation**.

### The GitHub Pages Limitation

GitHub Pages (free tier) serves static files but **does not support custom HTTP response headers**. Therefore, pages hosted on GitHub Pages cannot be made Cross-Origin Isolated through standard HTTP headers.

### Workarounds Evaluated

| Workaround | Pros | Cons |
|---|---|---|
| **`coi-serviceworker`** — Service Worker injects COOP/COEP headers on responses | No hosting change; quick to implement | Doesn't work in Safari; requires initial online load; edge cases in Firefox |
| **Cloudflare Pages** — supports `_headers` file | Free tier; COOP/COEP fully supported; same GitHub-push-to-deploy workflow | Requires migrating hosting platform |
| **Netlify** — supports `_headers` or `netlify.toml` | Free tier; full header control | Requires migrating hosting platform |
| **Skip AVIF/GIF; use Canvas-native formats only** | Zero complexity; works everywhere | AVIF and animated GIF not supported in Phase 1/2 |

### What Canvas API Can Natively Export

The browser's `HTMLCanvasElement.toBlob()` natively supports:
- `image/png`
- `image/jpeg`
- `image/webp` (all major browsers)

This covers the vast majority of user needs.

---

## Decision

**Defer ffmpeg.wasm integration to Phase 2. Phase 1 exports use only Canvas `toBlob()` (PNG, JPEG, WebP).**

In Phase 2 (T6-08), evaluate and implement the best resolution for DEF-001 before adding ffmpeg.wasm-dependent export formats.

---

## Rationale

1. **PNG, JPEG, and WebP cover ~95% of real-world use cases** for an online image editor. AVIF and GIF are niche requirements for Phase 1.
2. Prematurely solving the COOP/COEP problem in Phase 1 risks introducing browser-specific bugs and increasing complexity before the core product is even stable.
3. The `coi-serviceworker` approach is a pragmatic bridge if AVIF export becomes a Phase 2 priority without a hosting migration.
4. Migrating to Cloudflare Pages or Netlify is a low-friction option — the same GitHub Actions deploy pipeline can push to either platform — and can be done when needed.

---

## Phase 2 Resolution Plan

| Step | Action |
|---|---|
| T6-08a | Assess user demand for AVIF/GIF export |
| T6-08b | Test `coi-serviceworker` in Chrome, Firefox, Safari |
| T6-08c | If Safari support required: evaluate Cloudflare Pages migration |
| T6-08d | Document chosen resolution in an updated version of this ADR |
| T6-09 | Implement ffmpeg.wasm in a dedicated `workers/ffmpegWorker.js` |

---

## Consequences

- **Phase 1:** No AVIF or GIF export. Export limited to PNG, JPEG, WebP. This is clearly communicated in the UI.
- **Phase 2+:** Full format support added without any Phase 1 code changes (ffmpegWorker is a new module, not a replacement).
- **Architecture:** `src/lib/wasm/ffmpegLoader.js` stub is created in Phase 1 but not wired up, so Phase 2 integration is a matter of connecting the stub.
