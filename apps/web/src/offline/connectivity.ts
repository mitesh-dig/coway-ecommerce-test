import type { ConnectivityProvider } from '@8848digital/offline-kit';

/**
 * Web connectivity provider for the outbound-sync engine. Uses the browser's
 * `navigator.onLine` snapshot and the window `online` event.
 *
 * Caveat (handled by the engine): `navigator.onLine === true` only means the
 * browser has a network interface, not that the backend is reachable — every
 * push still has to handle failure and retry.
 */
export const webConnectivityProvider: ConnectivityProvider = {
  isOnline: () => navigator.onLine,
  subscribeOnline: (onOnline) => {
    window.addEventListener('online', onOnline);
    return () => window.removeEventListener('online', onOnline);
  },
};
