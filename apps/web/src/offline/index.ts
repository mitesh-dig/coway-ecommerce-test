// Web driver — the only platform-specific bit.
export { openOfflineDb, OpfsUnsupportedError } from './db';
export { webConnectivityProvider } from './connectivity';
export { webGeolocationProvider } from './geolocation';

// Re-export platform-agnostic abstractions from @app/core so consumers in
// apps/web don't have to know which package each symbol lives in. The native
// app's `apps/native/src/offline/index.ts` will mirror this — same exports,
// different `openOfflineDb` implementation under the hood.
export {
  OfflineDbError,
  syncTableStructure,
  syncTableData,
  readLastSyncAt,
  extractTableName,
  bootstrapMetadata,
  getLastSequence,
  getLastSyncAt,
  setLastSyncAt,
  upsertTableSeq,
  insertRow,
  clearAllTables,
} from '@8848digital/offline-kit';
export type { OfflineDb, SqlParams, SqlValue, SyncCallbacks, SyncProgress, SyncResult, DataSyncCallbacks, DataSyncResult } from '@8848digital/offline-kit';
