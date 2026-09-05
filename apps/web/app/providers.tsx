'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
// Two front doors: chassis from @8848digital/catalyst, engine from @8848digital/offline-kit.
import { QueryProvider, setApiApp, setBaseUrl, setGetToken, setNavigate, setLogout, setGeolocationProvider, setIsMobileApp, httpSyncTransport } from '@8848digital/catalyst';
import { setOfflineDbOpener, setConnectivityProvider, setSyncTransport, outboundSync } from '@8848digital/offline-kit';
import { useAuthStore } from '@/stores';
import { openOfflineDb, webConnectivityProvider, webGeolocationProvider } from '@/offline';

// App-shell client infrastructure (react-query + the web-only DI boot). This is
// NOT a migratable ui-web component — it lives in the Next shell and never moves
// to native. The boot must run in the browser only, so it's inside useEffect
// (never on the SSR/RSC server pass). The module-level guard makes it idempotent
// under React StrictMode's double-invoked effects in dev.
let booted = false;

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (booted) return;
    booted = true;

    // ── Boot wiring (runs once, client-only) ──────────────────────────────────
    // Per-project Frappe app name — feeds the endpoint builder + the auth endpoint.
    setApiApp('app');
    setBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL ?? '');
    setGetToken(() => useAuthStore.getState().token);
    setNavigate((path) => router.push(path));
    setLogout(() => useAuthStore.getState().logout());

    // Platform driver (web SQLite-WASM + OPFS), HTTP sync transport, and providers.
    setOfflineDbOpener(openOfflineDb);
    setSyncTransport(httpSyncTransport);
    setGeolocationProvider(webGeolocationProvider);
    setIsMobileApp(false);
    setConnectivityProvider(webConnectivityProvider);

    // Background outbound-sync engine. With no backend + no registered outbox
    // adapters it idles gracefully. As you add write-capable feature slices:
    //   1. registerOutboxAdapter(myAdapter)  // registerOutboxAdapter from @8848digital/offline-kit,
    //                                         // adapters from @app/core; BEFORE start()
    //   2. registerInvalidationKeys(PRODUCT_INVALIDATION_KEYS)  // from @8848digital/catalyst + @app/core
    outboundSync.start();
  }, [router]);

  return (
    <QueryProvider>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryProvider>
  );
}
