# web — Next.js (App Router)

The web app: **Next.js App Router + React + TypeScript + Tailwind**. It is the
server shell that renders migratable `@app/ui-web` client components; shared logic
lives in `@app/core`, and the offline engine/chassis come from the external
`@8848digital/offline-kit` + `@8848digital/catalyst` packages.

## Scripts

- `pnpm --filter web dev` — dev server at http://localhost:3000 (Turbopack).
- `pnpm --filter web build` — production build (Turbopack).
- `pnpm --filter web start` — serve the production build.
- `pnpm --filter web lint` — ESLint (flat config + `@next/eslint-plugin-next`).

`dev` and `build` are preceded by `copy-sqlite-assets.mjs` (a `predev`/`prebuild`
hook), so the SQLite assets are always in place before the app runs.

## Layout

- `app/` — the Next **server shell** (never migrated): `layout.tsx` (metadata),
  `page.tsx` (server-rendered pages), `providers.tsx` (`"use client"` — react-query
  + the web-only DI boot). Owns routing, layouts, metadata, and data-loading.
- `src/offline/`, `src/stores/` — the web platform driver (SQLite-WASM/OPFS) and
  the auth store. `@/` maps to `src/`.
- Migratable UI belongs in `packages/ui-web` (`"use client"` components), rendered
  by the `app/` shell.

## Environment

Set `NEXT_PUBLIC_API_BASE_URL` (the Frappe REST base) in `apps/web/.env` — copy
`.env.example`, or run the root `setup.mjs`. It is read at boot in `app/providers.tsx`.

## Offline / SQLite-WASM (OPFS)

The offline DB uses `@sqlite.org/sqlite-wasm` with the OPFS VFS, which needs
**cross-origin isolation** (`window.crossOriginIsolated === true`). `next.config.ts`
sends the required `Cross-Origin-Opener-Policy: same-origin` and
`Cross-Origin-Embedder-Policy: require-corp` headers for `next dev` **and**
`next start`. **Production behind your own server (e.g. nginx) must send these
headers too** — they are not baked into the build output.

The worker + wasm + async-proxy are served statically from `public/sqlite/`
(copied from `node_modules` by `scripts/copy-sqlite-assets.mjs`, gitignored); the
promiser in `src/offline/db.ts` points its worker at `/sqlite/sqlite3-worker1.mjs`.
