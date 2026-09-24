# Happy Birthday, Michelle 💜

A one-page birthday tribute built with React + Vite.

```bash
npm install
npm run dev      # local preview
npm run build    # production build in dist/
```

## Customising

Everything personal — name, age, photo, song, tagline, wishes, quotes, stats and the letter — lives in
[`src/content.js`](src/content.js). Put the photo and the song in `public/` and point `PHOTO_SRC` / `AUDIO_SRC` at them.

## Hosting

Live at https://michelle-turns-21.vercel.app (Vercel project `michelle`). `vercel.json` tells Vercel to build with Vite
and serve `dist/`. The link-preview card (WhatsApp, iMessage…) is `public/og-image.jpg`; its address is in `index.html`.

## Layout

- `src/App.jsx` — puts the sections together and owns the shared song player
- `src/components/` — one file per section (Hero, Letter, Stats, Constellation, Lanterns, WishJar, Music, Quotes, Finale) plus the ambient layers (sky, hearts, cursor, scroll bar, music button)
- `src/index.css` — design tokens, section styles, animations and the reduced-motion rules
