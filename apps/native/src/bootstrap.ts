// Native app bootstrap — the React Native analogue of apps/web/src/main.tsx's DI
// block. Runs once, imported at the top of index.js before the app is registered.
import Config from 'react-native-config';
// Two front doors: chassis from @8848digital/catalyst, engine from @8848digital/offline-kit.
import { setApiApp, setBaseUrl, setGetToken, setGeolocationProvider, setIsMobileApp, setLogout, httpSyncTransport } from '@8848digital/catalyst';
import { setOfflineDbOpener, setConnectivityProvider, setSyncTransport, outboundSync } from '@8848digital/offline-kit';
import { openOfflineDb, nativeConnectivityProvider, nativeGeolocationProvider } from './offline';
import { useAuthStore } from './stores';

// Per-project Frappe app name — feeds the endpoint builder + the auth endpoint.
setApiApp('app');
// API base URL from apps/native/.env via react-native-config.
setBaseUrl(Config.API_BASE_URL ?? '');
setGetToken(() => useAuthStore.getState().token);
setLogout(() => useAuthStore.getState().logout());

// Platform driver (react-native-sqlite-2), HTTP sync transport, and providers.
setOfflineDbOpener(openOfflineDb);
setSyncTransport(httpSyncTransport);
setGeolocationProvider(nativeGeolocationProvider);
setIsMobileApp(true);
setConnectivityProvider(nativeConnectivityProvider);

// Background outbound-sync engine — idles with no backend + no registered outbox
// adapters. As you add write-capable feature slices:
//   1. registerOutboxAdapter(myAdapter)  // from @8848digital/offline-kit, BEFORE start()
//   2. registerInvalidationKeys(PRODUCT_INVALIDATION_KEYS)  // from @8848digital/catalyst
outboundSync.start();

// setNavigate is intentionally not registered on native: clearing the auth store
// (logout / 401) flips a token-conditional navigator, so there's no path-based nav.
