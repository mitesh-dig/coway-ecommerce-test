import NetInfo from '@react-native-community/netinfo';
import type { ConnectivityProvider } from '@8848digital/offline-kit';

/**
 * Native connectivity provider for the outbound-sync engine. Backed by
 * `@react-native-community/netinfo`. Mirrors `apps/web/src/offline/connectivity.ts`.
 *
 * `ConnectivityProvider.isOnline()` must answer synchronously, but NetInfo
 * reports state asynchronously — so we keep a module-level `online` flag updated
 * by a long-lived listener (started at module load) and read it synchronously.
 * Defaults to `true` so the first push is attempted before the first NetInfo
 * event arrives; the engine treats connectivity as a hint and retries on failure.
 */
let online = true;
NetInfo.addEventListener(state => {
  online = state.isConnected ?? false;
});

export const nativeConnectivityProvider: ConnectivityProvider = {
  isOnline: () => online,
  subscribeOnline: onOnline => {
    return NetInfo.addEventListener(state => {
      if (state.isConnected) onOnline();
    });
  },
};
