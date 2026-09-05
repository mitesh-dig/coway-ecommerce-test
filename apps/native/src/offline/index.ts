// Native offline barrel — mirrors apps/web/src/offline/index.ts.
// Same surface, different `openOfflineDb` implementation under the hood.
// Connectivity provider + core re-exports are added in later steps when the
// sync engine is wired.
export { openOfflineDb, OfflineDbError } from './db';
export type { OfflineDb, SqlParams } from './db';
export { nativeConnectivityProvider } from './connectivity';
export { nativeGeolocationProvider } from './geolocation';

// Re-export the core sync symbols so the native sync store imports them from one
// place (parity with apps/web/src/offline/index.ts).
export { clearAllTables, readLastSyncAt, syncTableData, syncTableStructure } from '@8848digital/offline-kit';
export type { SyncProgress } from '@8848digital/offline-kit';
