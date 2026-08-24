# Auk Demo Page

A publication-grade demo page for **Auk**, a unified foundational model for speech generation and editing.
The site mirrors the visual language of [HunyuanVideo-Avatar](https://hunyuanvideo-avatar.github.io/) (Bulma-style black canvas, Google Sans / Noto Sans typography, deep-current blue links, `is-max-desktop` container, dark rounded resource buttons) while presenting the full Auk capability surface.

## Stack

- Vite + vanilla TypeScript
- No UI framework; the custom audio player, benchmark tables, and capability sections are rendered by hand from typed data sources.
- Web Audio API + `<canvas>` for waveform rendering, native `<audio>` fallback.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static output in dist/
npm run preview  # serve dist/ locally
```

## Asset layout

- `public/assets/audio/` — 21 WAVs covering instruct TTS, zero-shot TTS, speech content editing, lyric editing, timbre, de-accent, emotion, whisper conversion, speech enhancement, and acoustic (rate / pitch / loudness).
- `public/assets/figures/` — `auk-capabilities.png/.pdf`, `auk-architecture.png/.pdf`, `auk-pretraining-taxonomy.png/.pdf`.
- `public/assets/brand/` — Hunyuan wordmark / mark, SJTU wordmark, SII seal.

## Data sources

- `src/data/capabilities.ts` — five capability families and every operation, including placeholder samples for missing audio.
- `src/data/benchmarks.ts` — distilled numbers from the paper's summary table with metric direction.

## Placeholder convention

The page intentionally preserves placeholders rather than fabricating facts:

- Missing audio samples render the literal text `[audio|<instruction><reference audio description>]` so the project owner can roll them later.
- Other missing content (`<abstract>`, `<authors>`, `<caption>`, `<paper URL>`, etc.) appears as `<...>` markers in dashed teal pills.
- The current WAVs are mapped to the first row of every operation; remaining rows are explicit placeholders.

When rolling additional samples, drop the new WAVs under `public/assets/audio/`, add an entry to `src/data/capabilities.ts` with `{ id, label, audio: { src, out } }`, and rebuild.

## Deployment

The `dist/` directory is fully static and works on GitHub Pages, Vercel, or any static host. Vite is configured with `base: "./"` so the bundle works under a subpath.
