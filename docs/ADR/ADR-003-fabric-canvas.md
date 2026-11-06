# ADR-003 — Use Fabric.js as the Canvas Abstraction Layer

**Status:** Accepted
**Date:** 2026-10-31
**Deciders:** Project Team

---

## Context

The image editor needs a canvas abstraction layer to:
- Display the image in a zoomable, pannable canvas
- Support object-based manipulation (crop overlays, watermark text, selection boxes)
- Integrate with the undo/redo command stack
- Support touch and mouse input uniformly

### Options Considered

| Option | Object Model | Events | Touch | Maturity | Notes |
|---|---|---|---|---|---|
| **Fabric.js** | ✅ Full (groups, text, images, shapes) | ✅ Rich | ✅ Built-in | High | Most complete canvas library |
| Konva.js | ✅ Full (layers, groups) | ✅ Good | ✅ Good | High | React/Vue friendly; slightly larger API |
| Raw Canvas 2D API | ❌ None (manual) | ❌ Manual | ❌ Manual | Native | Maximum control; very high boilerplate |
| PixiJS | ✅ Full (WebGL-first) | ✅ Good | ✅ Good | High | Game-engine-oriented; overkill for photo editing |
| paper.js | ✅ Vector-oriented | ✅ Good | ⚠️ Partial | Medium | Better for vector/illustration |

---

## Decision

**Use Fabric.js as the primary canvas abstraction layer.**

---

## Rationale

1. **Object model:** Fabric.js provides exactly the object model needed: an image object on the canvas, overlaid by crop rectangle objects, text objects (watermark), and selection overlays. This maps cleanly to an image editor's mental model.
2. **Undo integration:** Fabric.js canvas state can be serialized to JSON, making snapshot-based undo trivial as a fallback alongside the command-pattern stack.
3. **Input unification:** Fabric.js handles mouse and touch events uniformly, including drag, pinch, and tap — essential for mobile parity.
4. **No framework coupling:** Fabric.js is vanilla JS; it integrates with Svelte (or any framework) without a wrapper library.
5. **Maturity:** Fabric.js is battle-tested in production image editing tools.

---

## Consequences

- **Positive:** Significantly reduces boilerplate for crop overlays, object selection, zoom/pan.
- **Positive:** Serialization to JSON simplifies undo/redo snapshot strategy.
- **Negative:** Fabric.js adds ~250 KB (minified, uncompressed) to the bundle. Mitigated by lazy-loading the canvas module after first image open if needed.
- **Negative:** Fabric.js v5/v6 API changed significantly from v3/v4 — must pin a specific major version.

---

## Constraints

- Pin Fabric.js to a specific major version in `package.json` (e.g., `^6.x`)
- All Fabric.js usage is encapsulated in `src/lib/canvas/` — no direct Fabric.js imports in Svelte components (use the wrapper API)
