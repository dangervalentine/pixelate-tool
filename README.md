# Pixelate Tool

A sleek, browser-based image pixelation tool. Upload any image, select a region, and apply real-time pixelation — all client-side with zero server uploads.

**[Try it live on GitHub Pages](https://dangervalentine.github.io/pixelate-tool/)**

---

## How It Works

Pixelate Tool uses the HTML Canvas API to apply a two-pass pixelation effect:

1. The selected region is extracted and **downsampled** to a tiny resolution based on your pixel size setting
2. It's then **upscaled** back to the original dimensions with image smoothing disabled, producing the characteristic blocky pixel look
3. The pixelated region is composited back onto the original image

Everything runs entirely in your browser — your images never leave your device.

## Features

- **Region selection** — drag to move, pull corners to resize. Only pixelate what you need, or hit "Full Image" to pixelate everything
- **Adjustable pixel size** — slider from 1 (subtle) to 100 (heavy) with real-time preview
- **Drag & drop upload** — drop an image anywhere, or click to browse
- **Instant download** — hover the preview and save as PNG, preserving your original filename
- **Dark & light themes** — defaults to dark (Night Owl palette), toggle anytime. Your preference is saved
- **Fully responsive** — split-view on desktop, stacked layout on mobile with touch support

## Tech Stack

| Layer | Tool |
|-------|------|
| UI | React 19 |
| Build | Vite |
| Styling | CSS with custom design tokens |
| Hosting | GitHub Pages |

## Getting Started

```bash
# Clone the repo
git clone https://github.com/dangervalentine/pixelate-tool.git
cd pixelate-tool

# Install dependencies
npm install

# Start the dev server
npm run dev
```

### Other commands

| Command | Description |
|---------|-------------|
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run deploy` | Build and deploy to GitHub Pages |

## Project Structure

```
src/
├── App.jsx            # Main app — canvas logic, state, layout
├── Header.jsx         # Title bar with theme toggle
├── Toolbar.jsx        # Pixel size slider and action buttons
├── Selection.jsx      # Draggable/resizable selection rectangle
├── theme.js           # Dark/light theme management
├── tokens.css         # Design tokens (colors, spacing, typography)
├── App.css            # Component styles
├── hooks/
│   └── useMediaQuery.js
└── main.jsx           # Entry point
```

## License

Made by [Danger Valentine](https://github.com/dangervalentine).
