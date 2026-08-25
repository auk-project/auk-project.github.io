# Auk Demo Page

Publication-grade demo page for **Auk**, a unified foundational model for speech generation and editing.
The site mirrors the visual language of [HunyuanVideo-Avatar](https://hunyuanvideo-avatar.github.io/) — Google Sans / Noto Sans typography, brand-blue accents sampled from the Tencent Hunyuan mark (`#0055E9` / `#00BCFF` / `#A8DFF5`), `is-max-desktop` container — while presenting the full Auk capability surface: 5 task families, 15 tasks, ~80 interactive audio players.

## Stack

- **Vite** + vanilla **TypeScript** (no UI framework)
- Custom `<canvas>`-based audio player (Web Audio API for waveform, native `<audio>` fallback)
- All demo content driven by typed data sources in `src/data/`

## Environment setup

Requires **Node.js ≥ 18** (tested on 20/22) and **npm ≥ 9**.

```bash
# 1. Install Node.js (if you don't have it)
#    macOS (Homebrew):  brew install node
#    or download from https://nodejs.org (LTS recommended)

# 2. Clone and install
git clone <your-repo-url>
cd <repo-dir>
npm install

# 3. Start the dev server
npm run dev
# → http://localhost:5173

# 4. Production build
npm run build
# → static output in dist/

# 5. Preview the production build locally
npm run preview
# → http://localhost:4173
```

### Troubleshooting

| Problem | Fix |
| --- | --- |
| `npm install` slow / network error | Use a mirror: `npm install --registry=https://registry.npmmirror.com` |
| Port 5173 in use | Vite auto-picks the next free port; check the terminal output |
| Audio doesn't play in dev | The assets live under `public/assets/audio/`; ensure the folder isn't gitignored |

## Asset layout

- `public/assets/audio/` — **~90 WAVs**: every task's input (source) audio, generated outputs, and slider stops (rate ×6, loudness ×7, pitch ×7). Named `<sample-id>-input.wav` / `<sample-id>-output.wav` / `rate-*`, `loudness-*`, `pitch-*`.
- `public/assets/figures/` — capability map, architecture diagram, pre-training taxonomy (`.png` + editable `.pdf`).
- `public/assets/brand/` — Hunyuan wordmark / mark, SJTU wordmark, SII seal.

## Data sources

- `src/data/capabilities.ts` — five capability families, every operation, demo instructions, and audio asset mapping. **This is the file to edit when adding/updating demos.**
- `src/scripts/audio-player.ts` — the custom player: A/B track switching, waveform rendering, slider-driven stop selection.

## How to add or replace a demo audio

1. Drop the WAV under `public/assets/audio/` (e.g. `enhance-3-output.wav`).
2. In `src/data/capabilities.ts`, point the sample's `audio` field at it:
   ```ts
   { id: "enhance-3", lang: "en", label: "Enhance Speech · English",
     instruction: "Remove the background noise and make the voice clearer",
     audio: { src: "assets/audio/enhance-3-input.wav", out: "assets/audio/enhance-3-output.wav" } }
   ```
3. `npm run build` — cards with `src` + `out` automatically get the Input/Output A/B switch; cards with only `src` show the source on both sides as a placeholder.

> The `input_manifest.md` at the repo root documents every task's demo instruction and the seed-audio 1.0 prompt used to generate its input audio.

## Deployment

### Option A — GitHub Pages (recommended)

The build already uses `base: "./"`, so the site works under any subpath.

1. Push this repo to GitHub.
2. Repo → **Settings → Pages** → Source: **GitHub Actions**.
3. Add a workflow `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [main]
     workflow_dispatch:
   permissions:
     contents: read
     pages: write
     id-token: write
   concurrency:
     group: pages
     cancel-in-progress: true
   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: 20
         - run: npm ci
         - run: npm run build
         - uses: actions/upload-pages-artifact@v3
           with:
             path: dist
         - uses: actions/deploy-pages@v4
   ```
4. Push, then enable Pages → the site appears at `https://<user>.github.io/<repo>/`.

### Option B — Any static host (Vercel / Netlify / Nginx)

`dist/` is fully static and self-contained.

```bash
npm run build
# upload / serve dist/ as the document root
# e.g. Netlify:  build command `npm run build`, publish dir `dist`
```

### Option C — Local static server

```bash
npm run build
npx serve dist
# or: python3 -m http.server 8080 --directory dist
```

## Notes

- The root-level `*.wav` files (Chinese-named source masters) are **not** committed; the demo page only uses the renamed assets under `public/assets/audio/`.
- `node_modules/` and `dist/` are gitignored — always run `npm install` after a fresh clone.
