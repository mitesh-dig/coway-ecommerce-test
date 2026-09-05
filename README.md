# Reactant

An offline-first, **web + React Native** starter on a **Frappe** backend. The
reusable engine and chassis ship as versioned packages you install; this repo is
your product — clone it, personalize it, and start building.

- `@8848digital/offline-kit` — the **engine** (on-device storage + sync). Installed.
- `@8848digital/catalyst` — the **chassis** (API client, React Query, auth, Frappe
  sync transport). Installed. Depends on offline-kit.
- `apps/web`, `apps/native`, `packages/{core,ui-web,ui-native}` — **your** code.

## Prerequisites

- Node 20+, pnpm 11+
- A **GitHub Packages read token** (the `@8848digital/*` packages are private).
  Add to your user-level `~/.npmrc`:
  ```
  @8848digital:registry=https://npm.pkg.github.com
  //npm.pkg.github.com/:_authToken=YOUR_GITHUB_READ_TOKEN
  ```
  (The repo's own `.npmrc` sets the registry; the token stays in your `~/.npmrc`.)
- For native: the React Native toolchain (Android Studio / Xcode).
- A running **Frappe** site with the mobile sync app (documented prerequisite).

## Quick start

```bash
node setup.mjs          # personalize: project name + API URL (then it self-deletes)
pnpm install            # pulls @8848digital/* from GitHub Packages
pnpm --filter web dev   # web runs at localhost:3000 — the welcome screen needs no backend
```

Native (after the RN toolchain is set up):
```bash
pnpm --filter <your>-native start        # Metro
pnpm --filter <your>-native android      # or: ios
```

## The two front doors

Import the reusable pieces from their own packages; your product lives in `@app/core`:

```ts
import { QueryProvider, setBaseUrl, setApiApp, useLogin, httpSyncTransport } from '@8848digital/catalyst'; // chassis
import { setOfflineDbOpener, setSyncTransport, registerOutboxAdapter } from '@8848digital/offline-kit';    // engine
import { useGetExamples, PRODUCT_INVALIDATION_KEYS } from '@app/core';                                     // your product
```

Boot wiring lives in `apps/web/src/main.tsx` and `apps/native/src/bootstrap.ts`.

## Structure

```
apps/web            Next.js (App Router) + React + Tailwind
apps/native         React Native (bare)
packages/core       @app/core   — features (vertical slices), domain types, endpoints, design tokens
packages/ui-web     @app/ui-web  — your web components (empty; bring your own)
packages/ui-native  @app/ui-native — your native components (empty)
```

### Feature convention (vertical slices)

See `packages/core/src/features/example` — the reference slice. Each feature is a
folder with one downward dependency direction:

```
hooks.ts → repo.ts → data/local.ts (SQL) + data/remote.ts (HTTP)
                   ↘ usecases.ts / outbox.ts   (writes + sync payloads)
```

Only the **DB layer** (`features/*/data/**`, `usecases.ts`, `outbox.ts`,
`shared-domain/**`) may import `getOfflineDb` / run SQL — ESLint enforces this.

### Design tokens

Neutral placeholders live in `packages/core/src/tokens`. Rebrand by editing the
values (keep the shape). Web consumes them via `apps/web/tailwind.config.ts`;
native via `rnTokens` (`@app/core/tokens/rn-styles`). Never hardcode raw values.

## Ship-time: native app identity

The native app ships with a neutral placeholder id **`com.example.reactant`** /
app name **ReactantApp**. Before publishing to the stores, set your own
**bundle id / applicationId** + display name across `apps/native/android/**` and
`apps/native/ios/**` (it's globally unique and tied to store identity, push, and
deep links). This is a manual, one-time checklist item.

## Ship-time: Android release signing

The `release` variant is **unsigned by default**. It deliberately does **not** fall back
to the debug keystore — that key (`debug.keystore` / password `android`) is public and
identical across every React Native project, so anything signed with it can be re-signed
by anyone. Before publishing to Play, sign with your own **upload keystore**:

1. **Generate an upload keystore** (one-time). Keep the file out of git — `*.keystore` is
   already ignored:
   ```sh
   keytool -genkeypair -v -storetype PKCS12 -keystore release.keystore \
     -alias upload -keyalg RSA -keysize 2048 -validity 10000
   ```
2. **Provide the credentials** — locally via a `keystore.properties` file (gitignored),
   or in CI via environment variables. Never commit either:
   ```sh
   cp apps/native/android/keystore.properties.example apps/native/android/keystore.properties
   # then edit keystore.properties with your real values
   ```
   | Key                              | What it is                                        |
   | -------------------------------- | ------------------------------------------------- |
   | `REACTANT_UPLOAD_STORE_FILE`     | Path to your `.keystore` (absolute recommended).  |
   | `REACTANT_UPLOAD_KEY_ALIAS`      | Alias chosen when generating the keystore.        |
   | `REACTANT_UPLOAD_STORE_PASSWORD` | Keystore password.                                |
   | `REACTANT_UPLOAD_KEY_PASSWORD`   | Key password (often the same as the store password). |

   Credentials are read from `keystore.properties` first, then the matching
   `REACTANT_UPLOAD_*` environment variables (CI). Both `keystore.properties` and
   `*.keystore` are gitignored.
3. **Build a signed release**: `cd apps/native/android && ./gradlew bundleRelease`.
   With nothing configured the build still runs but emits an **UNSIGNED** artifact and a
   warning — it cannot be uploaded to the Play Store.

## Scripts

`pnpm dev` · `pnpm build` · `pnpm lint` · `pnpm test` (Turborepo, all workspaces).
