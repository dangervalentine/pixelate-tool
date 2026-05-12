<p align="center">
  <img src="src/swatch-finder.svg" width="80" alt="Pixelate Tool" />
</p>

<h1 align="center">Pixelate Tool</h1>

<p align="center">
  <strong>Pixelate any region of an image, entirely in the browser</strong>
</p>

<p align="center">
  <a href="https://dangervalentine.github.io/pixelate-tool">Live Demo</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/react-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/vite-6-646CFF?logo=vite&logoColor=white" alt="Vite 6" />
  <img src="https://img.shields.io/badge/processing-Canvas_API-FFCB6B" alt="Canvas API" />
  <img src="https://img.shields.io/github/deployments/dangervalentine/pixelate-tool/github-pages?label=deploy&color=C3E88D" alt="Deploy" />
</p>

---

Upload any image, drag a selection region, and apply real-time pixelation with adjustable intensity. All processing happens client-side via the **Canvas API** &mdash; your images never leave your device.

## Features

**Region Selection** &mdash; Drag to move, pull corners to resize. Pixelate a specific area or hit "Full Image" for the entire photo.

**Adjustable Pixel Size** &mdash; Slider from 1 (subtle) to 100 (heavy) with debounced real-time preview.

**Drag & Drop Upload** &mdash; Drop an image anywhere on the interface or click to browse.

**Instant Download** &mdash; Hover the preview to reveal the download button. Saves as PNG with original filename preserved.

**Theming** &mdash; Dark and light modes with system preference detection, built on the Night Owl color system.

**Fully Responsive** &mdash; Split-view on desktop, stacked layout on mobile with full touch support for selection manipulation.

## How It Works

```
Image ──► Select Region (or full image)
              │
              ▼
       Extract Region from Canvas
              │
              ▼
       Downsample to Tiny Resolution
       (based on pixel size setting)
              │
              ▼
       Upscale with Smoothing Disabled
       (produces blocky pixel effect)
              │
              ▼
       Composite Back onto Original
              │
              ▼
       Export as PNG
```

The two-pass downsample/upscale approach with `imageSmoothingEnabled: false` produces clean, uniform pixel blocks without interpolation artifacts.

## Quick Start

```bash
# Install
npm install

# Develop
npm run dev

# Build
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## Tech Stack

- **React 19** &mdash; UI with hooks and refs
- **Vite 6** &mdash; Build tooling and dev server
- **Canvas API** &mdash; Pixelation rendering and image export
- **CSS Design Tokens** &mdash; Night Owl theme system

## Project Structure

```
src/
├── App.jsx                 # Main app — canvas logic, state, layout
├── Header.jsx              # Title bar with theme toggle
├── Toolbar.jsx             # Pixel size slider and action buttons
├── Selection.jsx           # Draggable/resizable selection rectangle
├── theme.js                # Dark/light mode management
├── tokens.css              # Design tokens (Night Owl theme)
├── App.css                 # Component styles
│
├── hooks/
│   └── useMediaQuery.js    # Responsive breakpoint detection
│
└── main.jsx                # Entry point
```

## License

MIT
