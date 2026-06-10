# Restructure: Google Sheets → Supabase + Manage page

Cross-session source of truth for the restructure. Work happens **one phase per session**;
update the status table when a phase lands. Each phase ends with `npm run lint` + `npm run build` green.
All phases live on the single branch `claude/supabase-phase-1` (user decision 2026-06-10 — no per-phase branches).
A test guest "Invitado De Prueba" exists with token `9cEkZrKBBN` (status pending) for manual demos.

> ⚠ **Trust this document over CLAUDE.md during the restructure.** CLAUDE.md's "Architecture"
> section describes a per-guest-link system (`useGuest.ts`, `src/lib/api.ts`, `apps-script/`) that
> was **never actually built** — the only real backend integration today is a manual-name form in
> `src/components/RSVPSection.tsx` POSTing free text to `VITE_APPS_SCRIPT_URL`. CLAUDE.md gets
> rewritten in Phase 5.

## Status

| Phase | Scope | Status |
|---|---|---|
| 0 | Supabase project + Google OAuth setup (manual, guided) | **done** — GH secrets added, Google OAuth configured (user-confirmed 2026-06-10) |
| 1 | Drizzle schema, migrations, RLS, RPCs | **done** (2026-06-10) — applied + verified vs live DB and REST |
| 2 | Public site cutover: per-guest links, new RSVP form | **done** (2026-06-10) — e2e-verified in browser vs live Supabase; merge = live cutover (see checklist) |
| 3 | Google auth + manage page shell | pending |
| 4 | Manage features: CRUD, monitoring, copy/WhatsApp | pending |
| 5 | Data import, cleanup, docs, hardening | pending |

## Locked decisions (2026-06-09)

- **One guest = one person = one row = one link** (`?g=<token>`). The RSVP form is a plain
  yes/no for that named person — no free-text name input anywhere. An optional `group_label`
  per guest ("Familia Pérez") lets the manage page filter families and copy their links together.
- **No valid link → no form.** Friendly notice that invitations are personal + WhatsApp button.
- **Optional `phone` per guest** → manage page gets "open WhatsApp" with the personalized
  message prefilled (`wa.me/<phone>?text=...`); a plain copy-to-clipboard button always exists.
- **Hosting stays GitHub Pages** (static, no server). Consequences:
  - Drizzle = schema + migrations only (`drizzle-kit`, run locally against the Supabase Postgres).
  - Runtime DB access = `@supabase/supabase-js` in the browser with the anon key.
  - Public guest flow goes through SECURITY DEFINER **RPCs** (no anon table access → no guest-list
    enumeration). Admin flow uses Supabase Auth (Google) + RLS policies checked against an
    `admins` table.
- **Manage page at hash route `#/manage`** — tiny hand-rolled hash hook, no react-router (avoids
  GitHub Pages 404 hacks). Supabase Auth uses **PKCE flow** so the OAuth callback arrives as
  `?code=` and doesn't fight the hash.
- All UI in Spanish, including the manage page.
- Site URL: `https://juango8.github.io/wedding-invitation/` (Vite base `/wedding-invitation/`).
- Supabase project: ref `qrqpnxivgerlpeqjgizg`, region `sa-east-1`, URL `https://qrqpnxivgerlpeqjgizg.supabase.co`. Keys live in `.env` (URL + anon key are public-by-design; `DATABASE_URL` is secret, local-only).

## Schema (source of truth: `db/schema.ts` once Phase 1 lands)

```
guest_status enum: 'pending' | 'accepted' | 'declined'

guests
  id            uuid pk default gen_random_uuid()
  token         text unique not null default gen_token()   -- 10-char unambiguous code for ?g=
  full_name     text not null
  phone         text                                       -- optional, digits with country code (51...)
  group_label   text                                       -- optional, e.g. "Familia Pérez"
  status        guest_status not null default 'pending'
  message       text                                       -- guest's message to the couple
  responded_at  timestamptz
  created_at    timestamptz not null default now()
  updated_at    timestamptz not null default now()         -- trigger-maintained

admins
  email         text pk                                    -- seeded by migration; add rows via SQL
```

**RPCs** (SECURITY DEFINER, `search_path` pinned, EXECUTE granted to `anon` + `authenticated`):
- `get_guest(p_token text)` → `(full_name, status, message)` for that exact token or empty. Never
  returns phone. Trims input.
- `submit_rsvp(p_token text, p_attending boolean, p_message text)` → updates status/message,
  sets `responded_at`, caps message at 500 chars, returns found/not-found.
- `is_admin()` → boolean for the signed-in user's email (UI gate; RLS is the real enforcement).

**Grants/RLS**: revoke all table privileges from `anon`/`authenticated`; RLS enabled on both
tables; single policy per table granting ALL to `authenticated` users whose JWT email exists in
`admins`. Admins query `guests` directly via supabase-js; the public site only ever calls RPCs.

## Phases

### Phase 0 — Supabase project + Google OAuth (manual, ~20 min, Claude guides)
Prereq for everything; no code changes.
1. Create Supabase project (region `sa-east-1` São Paulo — closest to Perú). Save the DB password.
2. Collect from the dashboard: Project URL, `anon` public key (Settings → API), and the
   **Session pooler** connection string (Settings → Database, port 5432) for migrations —
   the direct connection is IPv6-only and often unreachable from home networks.
2b. **Make sure the Data API is enabled** (Project Settings → Data API, `public` in exposed
   schemas). A project created without it has REST stuck on `PGRST002`/503 — this cost us an
   evening of debugging on 2026-06-09. Auth + direct Postgres work regardless; only REST is affected.
3. Google Cloud console: OAuth consent screen (External) + OAuth Client ID (Web application) with
   authorized redirect URI `https://<project-ref>.supabase.co/auth/v1/callback`. Put client
   ID/secret into Supabase → Auth → Providers → Google. *(Needed by Phase 3; can be done later.)*
4. Supabase → Auth → URL Configuration: Site URL `https://juango8.github.io/wedding-invitation/`;
   additional redirect URLs `http://localhost:5173/` and `http://localhost:4173/`.
5. Local `.env`: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `DATABASE_URL` (session pooler).
6. GitHub repo secrets: add `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`. **`DATABASE_URL`
   (contains the Postgres password) stays local-only — never a `VITE_` var, never in CI.**
7. Verify with a curl against the REST endpoint.

**Done when:** `.env` filled, GH secrets set, curl returns 200.

### Phase 1 — DB foundation (code; no frontend changes; mergeable immediately)
- Dev deps: `drizzle-orm`, `drizzle-kit`, `dotenv`. (`drizzle-orm` is never bundled — schema is
  consumed by drizzle-kit and, from `src/`, via **type-only** imports.)
- Files: `drizzle.config.ts`, `db/schema.ts`, generated migration + custom SQL migration
  (enum, trigger, `gen_token()`, RPCs, revokes, RLS policies, admin seed), `src/types/rsvp.ts`
  (type-only re-exports), `.env.example` update.
- npm scripts: `db:generate`, `db:migrate`, `db:studio`.
- Admins seeded (migration 0001): `jgonzalofh2898@gmail.com`, `gcoayla.28@gmail.com`. More via SQL editor.
- Apply migrations to the real project; verify via curl: `get_guest` with bogus token → empty;
  insert test guest via SQL; `get_guest` → row; `submit_rsvp` → status flips; direct
  `GET /rest/v1/guests` with anon key → denied.

**Done when:** all verification calls pass; lint/build still green.

### Phase 2 — Public site cutover (replaces the live form — see cutover checklist)
- `src/lib/supabase.ts` (single client, PKCE flow, handles missing env by exporting null).
- `src/hooks/useGuest.ts` — for real this time. Reads `?g=` (trimmed). States:
  `none` (no param) | `loading` | `found` (name, status, previous message) |
  `invalid` (RPC returned nothing — distinct from network failure) | `error` (network/8s timeout).
- Rewrite the RSVP part of `RSVPSection.tsx` (registry + footer untouched):
  - `found`: "Hola, {nombre}" greeting, yes/no buttons, optional message, submit via `submit_rsvp`.
    If already answered: show current answer + "¿Deseas cambiar tu respuesta?" → same form prefilled.
  - `none`/`invalid` (and missing env): notice + WhatsApp button — **needs the real WhatsApp
    number; the code currently has placeholder `51999999999`**.
  - `error`: "No pudimos cargar tu invitación" + retry button + WhatsApp fallback.
  - Submit failure: keep the existing WhatsApp fallback block.
- Remove `VITE_APPS_SCRIPT_URL` from code and `deploy.yml`; add the two Supabase vars to `deploy.yml`.
- Update `.env.example`.

**Done when:** local e2e against real Supabase with a test guest works (valid link → RSVP →
row updates; invalid link → notice); build green. Merge per cutover checklist below.

### Phase 3 — Google auth + manage shell
- Prereq: Phase 0 steps 3–4 (Google provider configured).
- `src/hooks/useHashRoute.ts` (`''` → invitation, `#/manage` → manage; listen to `hashchange`).
- `src/hooks/useAdminSession.ts`: session state + `is_admin()` check →
  `loading | signed_out | unauthorized | admin`.
- `src/manage/ManagePage.tsx` + `LoginScreen` (Google button via
  `signInWithOAuth({ provider: 'google', options: { redirectTo: origin + BASE_URL } })`) +
  `Unauthorized` (shows email + sign out). Route from `App.tsx`. No public nav link to `#/manage`.
- Handle: session restore on load, sign out, non-admin Google account (UI blocks AND RLS blocks).

**Done when:** admin email reaches an empty dashboard locally and on prod URL; another Google
account sees "No autorizado"; sign-out works.

### Phase 4 — Manage features (biggest phase — split 4a/4b if the session runs long)
- **4a — data**: stats cards (invitados / confirmados / no asisten / pendientes), guest table
  (search by name, filter by status + group, sort), add-guest modal (name required; phone, group
  optional), edit, delete with confirm (warns the link stops working), **manual status override**
  (for guests who reply via WhatsApp instead of the site), refresh button. Direct supabase-js
  table access (RLS allows admins). Mobile-first layout — the couple will use phones.
- **4b — sending**: per guest: copy invite link, copy personalized message (template const with
  `{nombre}` + `{link}` placeholders in `src/manage/messages.ts`), "open WhatsApp" button when
  phone present; per group: copy all links in one message (nice-to-have); CSV export button
  (doubles as backup); timestamps shown in America/Lima.

**Done when:** add → copy link → open in incognito → RSVP → status/respuesta visible in the
table after refresh.

### Phase 5 — Data import, cleanup, docs, hardening
- Import RSVPs already collected in the Google Sheet: user exports the Sheet tab to CSV →
  `scripts/import-guests.mjs` (Node + `postgres` dev dep + `DATABASE_URL`) upserting
  name/phone/group/status/message. Re-check the Sheet once more after cutover for late rows.
- Rewrite CLAUDE.md (real architecture: Supabase + Drizzle + manage page), README setup notes.
- Remove remaining Apps Script mentions anywhere.
- Add `.github/workflows/keepalive.yml`: weekly cron curl to the Supabase REST endpoint —
  **free-tier projects pause after ~1 week without requests**, which would kill the live site.
- Final QA sweep: lint, build, preview, mobile pass, prod smoke test (valid/invalid/no link,
  login, CRUD, copy buttons), review Google Maps key still works.

**Done when:** repo has zero Sheets/Apps Script remnants and docs match reality.

## Cutover checklist (execute around Phase 2 merge)

The current generic form is live and collecting responses (deadline text says **June 20, 2026**).
Merging Phase 2 removes it, so:

1. GH secrets (`VITE_SUPABASE_*`) set **before** merging — otherwise prod builds with no backend.
2. Export the Sheet's existing responses (snapshot) before merge.
3. Recommended order: merge Phase 1 anytime; build Phases 2–4 back-to-back on branches; import
   the guest list; merge 2–4 the same day; then send out personal links.
   (If Phase 2 merges alone, guests without links can only reach you via WhatsApp until links go out.)
4. After cutover, check the Sheet once more for responses that arrived between snapshot and deploy.
5. Decide whether the "confirma antes del 20 de junio" date needs updating given send-out timing.

## Edge cases & policies

**Links & tokens**
- Unknown token vs network error are *distinct* states with distinct UX (don't tell a guest their
  link is broken when it's their hotel Wi-Fi).
- Tokens: 10 chars, unambiguous alphabet (no `0/O/1/l/I`), generated in Postgres, trimmed on read.
- A forwarded link lets anyone flip that person's RSVP — accepted risk for a wedding; mitigations:
  regenerate-token button in manage (nice-to-have), `updated_at` audit trail.
- Guest-list enumeration impossible: no anon table reads, lookups only via RPC by exact token.

**RSVP behavior**
- Already responded → answer shown, change allowed (no hard lock at the deadline; the manage page
  is the source of truth and the couple can ignore late flips — revisit if needed).
- Double-submit guarded by disabling the button while pending; the RPC update is idempotent.
- Message capped server-side (500 chars). React escapes output (no XSS).
- Declined → can re-accept (it's just an update).

**Auth & admin**
- Any Google account can complete OAuth → authorization happens server-side via the `admins`
  table in RLS, not just in the UI.
- PKCE + registered redirect URLs (localhost:5173/4173 + prod URL with the `/wedding-invitation/`
  base path). `redirectTo` must include `import.meta.env.BASE_URL`.
- Session expiry → supabase-js auto-refresh; on auth error fall back to the login screen.
- Adding a second admin (e.g. Mafer) = one SQL insert; documented in CLAUDE.md rewrite.
- `#/manage` is discoverable in the bundle — fine, it's gated by auth + RLS, just not in the nav.

**Data & ops**
- `DATABASE_URL` (Postgres password) never leaves the local `.env`; CI only gets the two
  public `VITE_` vars (the anon key is public by design, protected by RLS).
- Missing `VITE_SUPABASE_*` at build → site renders the no-link notice instead of crashing
  (same graceful pattern as `VenueMap` with a missing Maps key).
- Supabase free tier pause (~7 idle days) → keepalive cron (Phase 5). Expected/fine after the wedding.
- drizzle-kit must use the **session pooler** URL (IPv4); direct connections are IPv6-only.
- Clipboard API needs a secure context — fine on GitHub Pages and localhost.
- CSV export in manage = manual backup before the big day.

**Manage UX**
- Mobile-first; tables collapse to cards on small screens.
- Deleting a guest invalidates their already-sent link → confirm dialog says so explicitly.
- Duplicate names allowed (different tokens); soft warning on exact duplicates (nice-to-have).
- Concurrent edits by both admins: last write wins — acceptable at this scale.
