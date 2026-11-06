# WePyxel — User Stories

**Version:** 1.0.0
**Status:** Draft
**Last Updated:** 2026-10-31

---

## Personas

### 🧑‍💼 Alex — The Content Creator
A social media manager and blogger who needs to quickly resize, crop, and filter images for various platforms without installing desktop software.

### 👩‍🎨 Maya — The Hobbyist Photographer
An amateur photographer who wants to do basic color correction, remove backgrounds, and export in web-friendly formats from any device.

### 🧑‍💻 Dev — The Integrating Developer
A developer building a larger image service platform who wants to embed WePyxel into their own application and control it programmatically.

### 📱 Sam — The Mobile User
A user who accesses the web primarily on a smartphone and wants a fast, installable experience without going to an app store.

---

## User Stories

### Epic 1 — Image Input

| ID | Persona | Story | Feature |
|---|---|---|---|
| US-01 | Alex, Maya | As a user, I want to open an image from my device so that I can start editing it. | F01 |
| US-02 | Alex | As a user, I want to drag and drop an image onto the editor so that I can quickly start without navigating file menus. | F01 |
| US-14b | Dev | As an integrating developer, I want to load an image into the editor programmatically so that my host application controls the workflow. | Integration API |

---

### Epic 2 — Core Editing

| ID | Persona | Story | Feature |
|---|---|---|---|
| US-03 | Alex | As a user, I want to crop my image to specific dimensions or aspect ratios so that it fits platform requirements (e.g. 1:1 for Instagram). | F02 |
| US-04 | Maya | As a user, I want to rotate and flip my image so that I can correct the orientation. | F03 |
| US-05 | Alex | As a user, I want to resize my image to exact pixel dimensions so that it meets a website's upload requirements. | F04 |
| US-06 | Maya | As a user, I want to adjust brightness, contrast, and saturation with sliders so that I can improve the look of my photo without complex tools. | F05 |
| US-07 | Alex | As a user, I want to apply a one-click filter (e.g. sepia, vivid) so that I can style my image quickly. | F06 |

---

### Epic 3 — Export

| ID | Persona | Story | Feature |
|---|---|---|---|
| US-08 | Alex, Maya | As a user, I want to download my edited image in PNG, JPEG, or WebP format so that I can use it wherever I need. | F07 |
| US-08b | Maya | As a user, I want to control the JPEG quality setting so that I can balance file size and image quality. | F07 |
| US-08c | Maya | As a privacy-conscious user, I want to strip EXIF metadata (including GPS location) on export so that I don't accidentally share personal data. | F07, F12 |

---

### Epic 4 — History

| ID | Persona | Story | Feature |
|---|---|---|---|
| US-09 | Alex, Maya | As a user, I want to undo and redo my edits so that I can experiment without fear of permanently damaging my image. | F08 |

---

### Epic 5 — Advanced Editing

| ID | Persona | Story | Feature |
|---|---|---|---|
| US-10 | Maya | As a user, I want to perform fine-grained color correction (HSL, curves, white balance) so that my photos look professionally edited. | F09 |
| US-11 | Alex | As a user, I want to add a text watermark to my image so that I can protect my content and add branding. | F10 |
| US-12 | Maya | As a privacy-conscious user, I want to see and manage the EXIF metadata in my image so that I know what data is embedded. | F11 |

---

### Epic 6 — PWA & Mobile

| ID | Persona | Story | Feature |
|---|---|---|---|
| US-PWA-01 | Sam | As a mobile user, I want to install the app to my home screen so that I can access it quickly like a native app. | PWA |
| US-PWA-02 | Sam | As a mobile user, I want the app to work offline so that I can edit images even without an internet connection. | PWA |
| US-PWA-03 | Sam | As a mobile user, I want touch-friendly crop handles and zoom gestures so that editing works naturally on my phone. | F02, Canvas UX |

---

### Epic 7 — Integration (Developer)

| ID | Persona | Story | Feature |
|---|---|---|---|
| US-INT-01 | Dev | As an integrating developer, I want to receive the edited image as a Blob so that I can pass it to my backend for further processing. | Integration API |
| US-INT-02 | Dev | As an integrating developer, I want to subscribe to editor events (imageLoaded, editComplete) so that my application can react to user actions. | Integration API |
| US-INT-03 | Dev | As an integrating developer, I want the editor to have a minimal global footprint so that it doesn't conflict with my host application's code. | Architecture |

---

## Acceptance Criteria

Acceptance criteria for each user story are defined in [FEATURES.md](FEATURES.md) under the corresponding feature (F01–F11).
