# WePyxel — Feature Catalog & Acceptance Criteria

**Version:** 1.0.0
**Status:** Draft
**Last Updated:** 2026-10-31

> Each feature entry includes: description, user story reference, dependencies, and acceptance criteria (AC). AC are written as testable conditions.

---

## Phase 1 — Core Features

---

### F01 — Image Input

**Description:** Load an image into the editor from various sources.
**User Story:** US-01, US-02
**Dependencies:** File System Access API (preferred), `<input type="file">` (fallback)

#### Acceptance Criteria

| AC# | Criterion |
|---|---|
| AC-F01-01 | User can click "Open Image" to open a native file picker |
| AC-F01-02 | File picker accepts `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, `.bmp`, `.svg` |
| AC-F01-03 | User can drag and drop an image file onto the canvas area |
| AC-F01-04 | Invalid file types show a user-friendly error message |
| AC-F01-05 | Image loads and is displayed in the canvas within 2 seconds for files ≤ 10 MB |
| AC-F01-06 | Canvas resizes to fit the loaded image (with appropriate zoom-to-fit) |
| AC-F01-07 | If no image is loaded, editor shows a clear call-to-action |

---

### F02 — Crop

**Description:** Select and apply a rectangular crop to the image.
**User Story:** US-03
**Dependencies:** Fabric.js, CropOverlay component

#### Acceptance Criteria

| AC# | Criterion |
|---|---|
| AC-F02-01 | User can activate the Crop tool from the toolbar |
| AC-F02-02 | A crop overlay appears with eight drag handles (corners + edges) |
| AC-F02-03 | Dragging a handle resizes the crop region |
| AC-F02-04 | Dragging inside the crop region moves it |
| AC-F02-05 | Preset aspect ratios (Free, 1:1, 16:9, 4:3, 3:2) are selectable |
| AC-F02-06 | Selecting a preset ratio locks the crop handles to that ratio |
| AC-F02-07 | Clicking "Apply Crop" trims the image to the selected region |
| AC-F02-08 | The applied crop is added to the undo stack |
| AC-F02-09 | Clicking "Cancel" exits crop mode without changes |
| AC-F02-10 | Crop works correctly on touch devices (drag handles ≥ 44×44 px) |

---

### F03 — Rotate & Flip

**Description:** Rotate the image by 90° increments or an arbitrary angle; flip horizontally or vertically.
**User Story:** US-04
**Dependencies:** Fabric.js

#### Acceptance Criteria

| AC# | Criterion |
|---|---|
| AC-F03-01 | "Rotate Left" button rotates image 90° counter-clockwise |
| AC-F03-02 | "Rotate Right" button rotates image 90° clockwise |
| AC-F03-03 | "Flip Horizontal" mirrors the image left-to-right |
| AC-F03-04 | "Flip Vertical" mirrors the image top-to-bottom |
| AC-F03-05 | A slider allows fine rotation from −45° to +45° |
| AC-F03-06 | The canvas background fills any transparent areas introduced by rotation |
| AC-F03-07 | Each operation is individually undoable |

---

### F04 — Resize

**Description:** Change the pixel dimensions of the image.
**User Story:** US-05
**Dependencies:** Pica (high-quality sampling), Web Worker

#### Acceptance Criteria

| AC# | Criterion |
|---|---|
| AC-F04-01 | Width and Height inputs accept positive integer values |
| AC-F04-02 | "Lock aspect ratio" checkbox is checked by default |
| AC-F04-03 | When locked, changing width auto-updates height and vice versa |
| AC-F04-04 | User can switch between pixel and percentage input modes |
| AC-F04-05 | Clicking "Apply Resize" resamples the image using Pica (Lanczos) |
| AC-F04-06 | Processing runs in a Web Worker; a progress indicator is shown |
| AC-F04-07 | The resize is added to the undo stack |
| AC-F04-08 | A warning is shown if the target dimensions exceed 5000×5000 px |

---

### F05 — Basic Adjustments

**Description:** Real-time image adjustments using sliders.
**User Story:** US-06
**Dependencies:** CamanJS or custom WebGL filter pipeline

#### Acceptance Criteria

| AC# | Criterion |
|---|---|
| AC-F05-01 | Brightness slider ranges from −100 to +100, default 0 |
| AC-F05-02 | Contrast slider ranges from −100 to +100, default 0 |
| AC-F05-03 | Saturation slider ranges from −100 to +100, default 0 |
| AC-F05-04 | Blur (Gaussian) slider ranges from 0 to 20, default 0 |
| AC-F05-05 | Sharpen slider ranges from 0 to 100, default 0 |
| AC-F05-06 | Adjustments are applied in real-time as the slider moves (preview) |
| AC-F05-07 | A "Reset Adjustments" button returns all sliders to default |
| AC-F05-08 | Clicking "Apply" commits the adjustments to the undo stack |

---

### F06 — Preset Filters

**Description:** A gallery of named, one-click artistic filters.
**User Story:** US-07
**Dependencies:** CamanJS, filter pipeline

#### Filter Gallery (minimum for Phase 1)

| Filter Name | Effect |
|---|---|
| Original | No filter applied |
| Grayscale | Desaturate to grey |
| Sepia | Warm brown tint |
| Vintage | Faded, slightly yellowed |
| Vivid | Boosted saturation & contrast |
| Cool | Blue-toned white balance |
| Warm | Orange-toned white balance |
| Fade | Lifted blacks, low contrast |

#### Acceptance Criteria

| AC# | Criterion |
|---|---|
| AC-F06-01 | Filters panel shows thumbnail previews of each filter |
| AC-F06-02 | Clicking a filter applies it immediately as a preview |
| AC-F06-03 | The active filter is visually highlighted |
| AC-F06-04 | Clicking "Original" removes all filter effects |
| AC-F06-05 | Applied filter is added to the undo stack |
| AC-F06-06 | Filter thumbnails render correctly for the currently loaded image |

---

### F07 — Export / Download

**Description:** Export the edited image to a file.
**User Story:** US-08
**Dependencies:** Canvas `toBlob()`, piexifjs (EXIF stripping)

#### Acceptance Criteria

| AC# | Criterion |
|---|---|
| AC-F07-01 | User can choose export format: PNG, JPEG, WebP |
| AC-F07-02 | JPEG and WebP show a quality slider (1–100), default 90 |
| AC-F07-03 | Estimated file size is shown before confirming export |
| AC-F07-04 | "Strip EXIF metadata" checkbox is available (checked by default) |
| AC-F07-05 | Clicking "Download" triggers a browser download of the file |
| AC-F07-06 | Default filename is `[original-name]-edited.[ext]` |
| AC-F07-07 | Export completes within 3 seconds for images ≤ 10 MP |

---

### F08 — Undo / Redo

**Description:** Step backward and forward through editing history.
**User Story:** US-09
**Dependencies:** CommandStack (history store)

#### Acceptance Criteria

| AC# | Criterion |
|---|---|
| AC-F08-01 | Ctrl+Z / Cmd+Z undoes the most recent action |
| AC-F08-02 | Ctrl+Shift+Z / Cmd+Shift+Z redoes the last undone action |
| AC-F08-03 | Undo/Redo buttons in the toolbar are enabled/disabled appropriately |
| AC-F08-04 | Undo stack holds at least 20 steps |
| AC-F08-05 | Performing a new action after undo clears the redo stack |
| AC-F08-06 | All features (crop, resize, filters, adjustments) are undoable |

---

## Phase 2 — Advanced Features

---

### F09 — Color Correction (HSL + Curves)

**Description:** Fine-grained color correction using Hue/Saturation/Lightness and RGB Curves.
**User Story:** US-10
**Dependencies:** Custom WebGL shaders or CamanJS

#### Acceptance Criteria

| AC# | Criterion |
|---|---|
| AC-F09-01 | HSL panel has three sliders: Hue (−180 to +180), Saturation (−100 to +100), Lightness (−100 to +100) |
| AC-F09-02 | Adjustments preview in real-time |
| AC-F09-03 | RGB Curves editor shows four curves: RGB (master), R, G, B |
| AC-F09-04 | User can add, drag, and remove curve control points |
| AC-F09-05 | White balance temperature slider (cool to warm) |
| AC-F09-06 | Changes are committed to the undo stack on "Apply" |

---

### F10 — Watermark

**Description:** Add a text or image watermark to the photo.
**User Story:** US-11
**Dependencies:** Fabric.js text objects

#### Acceptance Criteria

| AC# | Criterion |
|---|---|
| AC-F10-01 | User can type a text watermark |
| AC-F10-02 | Font family, font size, color, and opacity are configurable |
| AC-F10-03 | Watermark position: 9-point grid (corners, edges, center) or freehand drag |
| AC-F10-04 | Watermark is rasterized into the image on "Apply" |
| AC-F10-05 | Result is undoable |

---

### F11 — EXIF Metadata Management

**Description:** Read and strip EXIF metadata from images.
**User Story:** US-12
**Dependencies:** `exifr`, `piexifjs`

#### Acceptance Criteria

| AC# | Criterion |
|---|---|
| AC-F11-01 | EXIF panel shows key metadata: Camera, DateTime, GPS, Dimensions |
| AC-F11-02 | GPS coordinates are shown only as decimal; no map integration |
| AC-F11-03 | "Strip all metadata" option available on export |
| AC-F11-04 | GPS stripping works independently of other EXIF data |
