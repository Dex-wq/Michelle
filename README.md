# Happy Birthday, Michelle 💜

A one-page birthday tribute built with React + Vite.

```bash
npm install
npm run dev      # local preview
npm run build    # production build in dist/
```

## Customising

Everything personal — name, age, birth year, photo, song, tagline, wishes, notes, stats, the letter and the
WhatsApp number the reply button opens — lives in
[`src/content.js`](src/content.js). Put the photo and the song in `public/` and point `PHOTO_SRC` / `AUDIO_SRC` at them.

## Hosting

Live at https://michelle-bay-nu.vercel.app — Vercel deploys `main` automatically. `vercel.json` tells Vercel to build
with Vite and serve `dist/`. The link-preview card (WhatsApp, iMessage…) is `public/og-image.jpg`; its address is in `index.html`.

## Layout

- `src/App.jsx` — puts the sections together and owns the shared song player
- `src/components/` — the opening envelope (Intro), one file per section (Hero, Letter, Stats, Constellation, Lanterns, WishJar, Music, Notes, Finale), the footer's reply button, hand-drawn doodles, plus the ambient layers (sky, tap sparkles, scroll bar, music button)
- `src/confetti.js`, `src/fireworks.js` — the celebration canvases
- `src/index.css` — design tokens, section styles, animations and the reduced-motion rules
