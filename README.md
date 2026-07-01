# Wavelength 🎵

A Spotify-inspired music streaming web app, built with React, Vite, and Tailwind CSS. Fully client-side — no backend, no API keys, no signup required.

> Cover art is generated in pure CSS from each track's genre instead of pulling stock photos, so the whole app runs with zero external assets.

## Features

- **Browse** — genre-organized home feed + a recently-played rail
- **Search** — live filtering by song or artist, plus genre chips
- **Player** — play/pause, skip, shuffle, repeat, seek, volume, all with a simulated progress bar (see note below)
- **Playlists** — create, rename, delete, add/remove songs
- **Liked Songs** — one-tap heart to save any track
- **Persistence** — playlists, likes, volume, and theme are saved to `localStorage`
- **Light / dark theme** toggle
- **Responsive** — collapsible sidebar drawer on mobile, adaptive grids

## Tech stack

| Layer      | Choice                          |
|------------|----------------------------------|
| Framework  | React 18 + Vite                 |
| Styling    | Tailwind CSS (custom theme)     |
| Routing    | React Router v6                 |
| Icons      | lucide-react                    |
| State      | React Context API                |
| Storage    | `localStorage` (no backend)     |

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview   # preview the production build locally
```

## A note on audio

There are no real audio files or streaming API wired in — the brief called for placeholder/demo audio for the MVP, so the player simulates playback (progress bar, timers, auto-advance) without playing actual sound. To wire up real audio:

1. Add an `<audio>` element in `Player.jsx`.
2. Point `src` at real files (or a licensed streaming API) via each song's data.
3. Swap the simulated `setInterval` progress ticker in `MusicContext.jsx` for the audio element's `timeupdate` event.

## Project structure

```
src/
├── components/     # Reusable UI: Player, Sidebar, Header, SongCard, SongRow, modals...
├── pages/          # Route-level views: Home, Search, Liked, Playlists, PlaylistDetail
├── context/         # MusicContext — all playback/playlist/like state + localStorage sync
├── data/            # Mock song catalogue + genre color tokens
├── App.jsx
└── main.jsx
```

## Deploying

Works out of the box on Vercel or Netlify:

```bash
npm run build
# then deploy the dist/ folder, or run `vercel` / `netlify deploy`
```

## Roadmap

- [ ] Real audio playback via the Spotify Web API or self-hosted tracks
- [ ] Auth + per-user cloud sync (Firebase or a small Node/Postgres API)
- [ ] Drag-to-reorder playlist tracks
- [ ] Collaborative playlists
- [ ] Recommendations based on listening history

## License

MIT — do whatever you'd like with this.
