# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Single-page wedding invitation site (Juango & Mafer, July 18 2026, Arequipa, Perú). Vite + React 19 + TypeScript + Tailwind CSS 3. All user-facing text is in Spanish.

## Commands

```
npm run dev       # dev server
npm run build     # tsc -b, then vite build (output: dist/)
npm run lint      # eslint .
npm run preview   # preview the production build
```

There are no tests.

Note: the dev/build/preview scripts invoke Vite through `node -r ./crypto-polyfill.cjs` (polyfills `crypto.getRandomValues` for old Node). Don't simplify them to plain `vite` calls.

## Architecture

> ⚠ **Restructure in progress — see [docs/RESTRUCTURE_PLAN.md](docs/RESTRUCTURE_PLAN.md).** The Sheets/Apps Script system described below is being replaced by Supabase + Drizzle + a `#/manage` admin page, and parts of what's documented here (`useGuest.ts`, `src/lib/api.ts`, `apps-script/`) were never actually implemented. Trust the plan doc until Phase 5 rewrites this file.

- No router — [App.tsx](src/App.tsx) stacks section components ([src/components/](src/components/)) in one scrollable page. [Sidebar.tsx](src/components/Sidebar.tsx) (desktop sidebar + mobile hamburger) navigates via anchor ids: `#our-story`, `#venue`, `#itinerary`, `#rsvp`, `#registry`. New sections need both the `id` and a `NAV_ITEMS` entry.
- `RSVPSection` also contains the Registry section and the site footer, despite its name.
- **Guest personalization**: invitations are per-guest links of the form `?g=<unique-id>`. [useGuest.ts](src/hooks/useGuest.ts) reads the param and fetches the guest (name + previous answer) from the Apps Script at runtime, so the Google Sheet stays the live source of truth and the guest list never ships in the bundle. States: `none` (no param → manual name input), `loading`, `found` (read-only name, prefilled previous answer, upsert by id), `fallback` (unknown id / network error / 8s timeout → manual input + notice). All HTTP goes through [api.ts](src/lib/api.ts).
- **RSVP backend**: a Google Apps Script web app (`VITE_APPS_SCRIPT_URL`) backed by the guest spreadsheet. Source + sheet layout + deployment steps live in [apps-script/](apps-script/README.md) — paste `Code.gs` into the sheet's script editor; it is not part of the site build. `GET ?g=` looks up a guest; `POST` upserts the RSVP by id (manual/unknown-id responses land in a separate tab). Requests deliberately use simple-request shapes (`Content-Type: text/plain`, no custom headers) because Apps Script can't answer CORS preflights. The front end requires the POST response body to be `{ok: true}` — deploy Apps Script changes before site changes. On failure the form falls back to a WhatsApp deep link.
- **Map**: [VenueMap.tsx](src/components/VenueMap.tsx) loads the Google Maps JS API dynamically via a `<script>` tag and a global callback, using `VITE_GOOGLE_MAPS_API_KEY`; missing key renders a placeholder instead of failing. Venue coordinates and custom map styles live in that file.
- **Styling**: custom Tailwind palette in [tailwind.config.ts](tailwind.config.ts) — note the `rose` color group is actually brown/green earth tones (`rose` = brown #6c402a, `rose-dark` = green #3a4a31), and `warm-*` for text/backgrounds. Shared utility classes `.section-title` and `.nav-link` are defined in [src/index.css](src/index.css). Serif = Playfair Display, sans = Inter.
- [cloudinary-setup.mjs](cloudinary-setup.mjs) is a standalone one-off script (run with `node`) to test Cloudinary uploads; it is not part of the site build.

## Environment & deployment

- Env vars (see [.env.example](.env.example)): `VITE_APPS_SCRIPT_URL`, `VITE_GOOGLE_MAPS_API_KEY` are baked into the client bundle at build time; Cloudinary vars are only for the setup script. Local values go in `.env` (gitignored).
- Deploys to GitHub Pages via [.github/workflows/deploy.yml](.github/workflows/deploy.yml) on every push to `main`; the two `VITE_*` vars come from GitHub Actions secrets. The Vite `base` is `/wedding-invitation/` ([vite.config.ts](vite.config.ts)) — asset paths assume the site is served from that subpath.
