# ADR-001 — Use Svelte + Vite as the UI Framework and Build Tool

**Status:** Accepted
**Date:** 2026-10-31
**Deciders:** Project Team

---

## Context

We need a JavaScript UI framework and build tool for a browser-based image editing PWA. The primary constraints are:

- Must produce a small JavaScript bundle (PWA performance budget: ≤ 500 KB gzipped)
- Must have first-class PWA support (Service Worker, manifest)
- Must support reactive state management (sliders, undo stack updates)
- No server-side rendering required
- TypeScript is optional (nice to have)

### Options Considered

| Option | Bundle Size (approx.) | PWA Support | Maturity | Notes |
|---|---|---|---|---|
| **Svelte 4 + Vite** | ~10–30 KB runtime | Excellent (vite-plugin-pwa) | High | Compiles away framework code |
| React + Vite | ~45 KB (react + react-dom) | Good | Very High | Larger baseline; JSX overhead |
| Vue 3 + Vite | ~34 KB | Good | High | Moderate size; Options/Composition API |
| Vanilla JS + Vite | ~0 KB overhead | Good | N/A | Manual DOM management; high complexity |
| SolidJS + Vite | ~7 KB | Good | Medium | Similar to Svelte but smaller ecosystem |

---

## Decision

**Use Svelte 4 as the UI framework and Vite 5 as the build tool.**

The PWA plugin used will be `vite-plugin-pwa` (backed by Workbox).

---

## Rationale

1. **Bundle size:** Svelte compiles components to vanilla JS — there is no framework runtime shipped to the browser. This is the single biggest advantage for a PWA with a strict performance budget.
2. **Reactivity model:** Svelte's reactive declarations (`$:`) and stores are a natural fit for an image editor's real-time sliders and state updates without the complexity of hooks (React) or the Options/Composition API split (Vue).
3. **Vite:** Industry-standard build tool with HMR, tree-shaking, lazy chunking (critical for WASM lazy loading), and first-class `vite-plugin-pwa` integration.
4. **Ecosystem:** Svelte has excellent integration with Tailwind CSS and all vanilla JS libraries (Fabric.js, Pica, CamanJS) — no framework-specific wrappers needed.

---

## Consequences

- **Positive:** Minimal bundle size; clean component model; straightforward state management.
- **Positive:** `vite-plugin-pwa` generates the Service Worker and manifest automatically from config.
- **Negative:** Svelte is less widely known than React, which may affect future contributor onboarding.
- **Negative:** Svelte's ecosystem of UI component libraries (Shadcn-svelte, Skeleton) is smaller than React's, but for an image editor most UI is custom anyway.
- **Mitigated by:** Svelte's learning curve is generally considered lower than React's.
