# `@app/core` — the shared brain

`packages/core` answers one question: **"what does our app know and do, that has nothing to do
with whether it's drawn with `<div>`s or `<View>`s?"** Features, domain types, business endpoints,
and design tokens all live here, and both `apps/web` and `apps/native` import them.

## The golden rule

> `@app/core` is **platform-agnostic**. It must never import from `react-native`, `react-dom`,
> Tailwind, or any browser-/native-only API.

That rule is what lets the exact same logic run on both platforms. Anything platform-specific
belongs in `@app/ui-web`, `@app/ui-native`, or the app itself — not here.

## Engine + chassis live in external packages (not in core)

The reusable machinery is **installed as versioned dependencies**, never vendored or edited here:

| Package | Role | You get from it |
| --- | --- | --- |
| `@8848digital/offline-kit` | The offline **engine** | `getOfflineDb`, the sync engine, the outbox, connectivity, and the boot seams (`setOfflineDbOpener`, …) |
| `@8848digital/catalyst` | The **chassis** on top of the engine | the fetch-based `api` client, `buildEndpoint`, React Query wiring (`QueryProvider`, `useLocalQuery`, `toLegacyShape`), auth (`createAuthStore`), and the Frappe sync transport (`httpSyncTransport`) |

So `@app/core` is only your **product** layer; it composes those two "front doors". (The HTTP layer
is the fetch-based `api` client from catalyst — there is no axios.)

## What's inside `src/`

| Path | What's there | Why it exists |
| --- | --- | --- |
| `api/` | `endpoints.ts` (the `APP` name + your `endpoints` registry, built with `buildEndpoint`) and its barrel `index.ts` | Your project's own business endpoints in one place. The generic client + `buildEndpoint` live in catalyst; the generic auth/offline-sync endpoints do too. |
| `features/<slice>/` | The vertical feature slices — `features/example/` is the reference (`index.ts`, `hooks.ts`, `repo.ts`, `data/local.ts`, `data/remote.ts`) | Where product behavior lives. Copy the `example` slice's shape for your own features. |
| `hooks/` | `index.ts` — re-exports each slice's hooks (e.g. `useGetExamples`) | The public hook barrel a component imports from. (Generic hooks like `useApiQuery` / `useLogin` live in catalyst.) |
| `types/` | `index.ts` — your domain types (`User`, `KpiItem`, `ExampleItem`) | One definition of each shared type so web and native can't drift. (Generic transport/auth types like `ApiResponse` / `AuthUser` live in catalyst.) |
| `utils/` | `index.ts` — empty barrel; add your own pure functions | Pure, platform-free helpers. (Generic utils like `generateUuid` / `todayLocalISO` live in catalyst.) |
| `tokens/` | `index.ts` + `rn-styles.ts` | Design values (colors, spacing, …) generated from Figma. The one UI-adjacent part of core — but it's just data, not components. |
| `invalidationKeys.ts` | `PRODUCT_INVALIDATION_KEYS` | The local-read query keys a write invalidates. Registered into catalyst at boot via `registerInvalidationKeys(PRODUCT_INVALIDATION_KEYS)`. |

The package barrels these via `package.json` `exports`, so apps can import the whole surface
(`@app/core`) or a subpath (`@app/core/tokens`, `@app/core/api`, `@app/core/hooks`, `@app/core/types`).

## The feature slice (vertical slice)

Each feature is a self-contained folder with a **single downward dependency direction**:

```
hooks.ts  →  repo.ts  →  data/local.ts   (SQL, reads the local DB)
                      ↘  data/remote.ts  (HTTP, calls the api client)
```

- **`hooks.ts`** — the React-facing entry. A component calls `useGetExamples()` and gets a query
  result; it never touches SQL or HTTP.
- **`repo.ts`** — the single place that decides **local vs remote**. Offline-first by default: the
  `example` repo reads local, and "going online" is a one-line change **in `repo.ts` only** — hooks
  and screens stay untouched (see the reference comment in `features/example/repo.ts`).
- **`data/local.ts`** — the SQLite reads/writes for the slice.
- **`data/remote.ts`** — the HTTP calls (via `api` + your `endpoints` registry).

**Layering rule (ESLint-enforced, `error`):** only the DB layer may run SQL / import `getOfflineDb` —
that means `features/*/data/**`, `features/*/usecases.ts`, `features/*/outbox.ts`, and
`shared-domain/**`. Hooks and repos must delegate downward; they never import `getOfflineDb`.

## How offline-first works here

The offline **engine is external** (`@8848digital/offline-kit`) and platform-agnostic: it calls
`getOfflineDb()` and expects back an `OfflineDb` with three methods — `exec`, `all`, `transaction`.
It has zero knowledge of which SQLite library is underneath.

Each **app injects its own driver at boot**, wrapping a platform SQLite library to that same
three-method contract:

- `apps/web/src/offline/db.ts` — wraps `@sqlite.org/sqlite-wasm` (WASM + OPFS, browser-only).
- `apps/native/src/offline/db.ts` — wraps `react-native-sqlite-2` (the RN native bridge).

Both register via `setOfflineDbOpener(...)`, so `@app/core` and the engine stay blissfully ignorant
of the platform. That injection seam is exactly what the golden rule buys you: one copy of the
feature logic in `core`, running correctly on both web and native.
