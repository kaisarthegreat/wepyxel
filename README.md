# WePyxel — Online Image Editing Platform

> A fully client-side, PWA-installable image editing platform built with modern JavaScript. No backend. No signup. No data leaves your device.

[![GitHub Pages](https://img.shields.io/badge/Hosted%20on-GitHub%20Pages-24292e?logo=github)](https://pages.github.com)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Overview

**WePyxel** is a browser-based image editing platform that runs entirely on the client side using the browser's Canvas API, WebAssembly modules, and modern Web APIs. It is designed to be:

- 📦 **Self-contained** — no server, no database, no API keys
- 📱 **Installable** — Progressive Web App, works on desktop and mobile
- 🔒 **Private** — all image processing happens locally in the browser
- 🧩 **Pluggable** — designed to integrate into a larger image service ecosystem later

---

## Features (by Phase)

| Phase | Features |
|---|---|
| **Phase 1 — Core** | Crop, Rotate, Flip, Resize, Basic Filters, Adjustments, PNG/JPEG/WebP export, Undo/Redo |
| **Phase 2 — Advanced** | Color Curves/HSL, White Balance, Watermark, EXIF Management, Batch Export, Format Conversion (ffmpeg.wasm, deferred — see DEF-001) |

---

## Quick Start (Local Dev)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)
- [Git Bash](https://git-scm.com/downloads) (recommended shell for running commands)

### Run Locally

> Run the following in **Git Bash**:

```bash
git clone https://github.com/<your-username>/wepyxel.git
cd wepyxel
docker compose up
```

Open [http://localhost:5173](http://localhost:5173)

### Build for Production

```bash
docker compose run --rm app pnpm build
```

---

## Project Structure

```
wepyxel/
├── docs/                    # Spec-Driven Development documents
│   ├── SPEC.md              # Master technical specification
│   ├── ARCHITECTURE.md      # System architecture
│   ├── FEATURES.md          # Feature catalog with acceptance criteria
│   ├── USER_STORIES.md      # User stories
│   ├── ROADMAP.md           # Phased development plan
│   └── ADR/                 # Architecture Decision Records
│       ├── ADR-001-svelte-vite.md
│       ├── ADR-002-no-backend.md
│       ├── ADR-003-fabric-canvas.md
│       └── ADR-004-ffmpeg-wasm-deferred.md
├── src/
│   ├── components/          # Svelte UI components
│   ├── stores/              # Svelte state stores
│   ├── lib/                 # Core image processing modules
│   │   ├── canvas/          # Canvas & Fabric.js wrappers
│   │   ├── filters/         # Filter pipeline
│   │   ├── wasm/            # WASM loader utilities
│   │   └── history/         # Undo/redo command pattern
│   ├── workers/             # Web Workers for heavy processing
│   ├── assets/              # Static assets
│   └── App.svelte
├── public/
│   ├── manifest.json        # PWA manifest
│   └── icons/               # PWA icons (192, 512px)
├── docker-compose.yml
├── Dockerfile
├── vite.config.js
└── package.json
```

---

## Documentation

| Document | Purpose |
|---|---|
| [SPEC.md](docs/SPEC.md) | Master specification — start here |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Architecture decisions & diagrams |
| [FEATURES.md](docs/FEATURES.md) | Feature details & acceptance criteria |
| [USER_STORIES.md](docs/USER_STORIES.md) | User stories by persona |
| [ROADMAP.md](docs/ROADMAP.md) | Phased development plan |
| [ADR/](docs/ADR/) | Architecture Decision Records |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Build | Vite + vite-plugin-pwa |
| UI | Svelte + Tailwind CSS |
| Canvas | Fabric.js |
| Resize | Pica |
| Filters | CamanJS / glfx.js |
| Format Conversion | Native Canvas API (Phase 1); ffmpeg.wasm (Phase 2+, deferred) |
| State | Svelte stores + Command pattern |
| CI/CD | GitHub Actions → GitHub Pages |

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) _(to be created)_.

## License

MIT
