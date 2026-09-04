# Waqas Auto Parts

Cinematic website for a used/aftermarket **exterior car parts** sourcing & distribution company. Not e-commerce — visitors browse, then submit a structured quote request.

## Stack

React + Vite, with:

- **React Three Fiber** + **three** — the scroll-driven "disassemble → reassemble" 3D car hero
- **GSAP** (`ScrollTrigger`) — drives the hero's assembly progress from scroll position
- **Framer Motion** — scroll-in reveals and UI micro-interactions elsewhere on the page
- **React Router** — Home / Browse Parts / Quote / About

## Getting started

```bash
npm install
npm run dev      # start local dev server
npm run build    # production build
npm run preview  # preview the production build
```

## Project structure

- `src/data/` — placeholder catalog (`parts.js`) and the procedural car part definitions (`carParts.js`)
- `src/components/` — `Hero3DScene`, `CarModel`, `PartCard`, `Nav`, `Footer`, shared hooks-backed UI
- `src/sections/` — homepage sections (brand story, part categories, featured gallery, how-it-works, CTA)
- `src/pages/` — routed pages (`Home`, `BrowseParts`, `Quote`, `About`)
- `src/hooks/` — `useCanRender3D` (WebGL/reduced-motion/low-end detection), `useTiltCard` (CSS 3D hover tilt)

## Notes & follow-ups

- **3D car model**: the hero currently uses a procedurally-built low-poly car (see `src/data/carParts.js`) instead of a licensed/downloaded asset, to avoid attribution/licensing overhead. Swap in a real branded glTF model (with separate meshes per part) by loading it in `CarModel.jsx` via `useGLTF` and mapping its part nodes to the same exploded/assembled transform system.
- **Catalog data**: `src/data/parts.js` holds placeholder brands/models/parts and an SVG placeholder image. Replace with real inventory data and photos when ready.
- **Quote submissions**: `src/pages/Quote.jsx` currently only logs the submission to the console. Wire it up to a real destination (email service like Formspree/Resend, a small backend, or a CRM) before going live.
- **Reduced-motion / low-end fallback**: `HeroFallback.jsx` renders instead of the 3D scene when `prefers-reduced-motion` is set or the device lacks WebGL/has very few CPU cores (`useCanRender3D`).
