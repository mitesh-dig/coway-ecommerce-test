// NOTE: the SQLite-WASM entry is loaded at RUNTIME from the statically-served
// copy at /sqlite/sqlite3.mjs (see apps/web/scripts/copy-sqlite-assets.mjs), never
// imported through the bundler. Turbopack can't follow the package's internal
// dynamic `new Worker(new URL(...))` worker graph, and its server (`node`) export
// condition lacks the browser-only promiser — so we keep it out of the bundle
// entirely. The runtime import below carries a `turbopackIgnore` so the bundler
// leaves it as a native browser import; bootDb only ever runs in the browser.
//
// `sqlite3Worker1Promiser` carries a @deprecated tag in @sqlite.org/sqlite-wasm
// 3.53.0+ (2026-04-15), pending a stable replacement the authors haven't shipped
// yet. It still works and is the only Promise-returning entry point. Migrate to
// the OPFS-SAH-Pool VFS when ready — it's not deprecated and avoids the worker.
import { OfflineDbError, type OfflineDb, type SqlParams } from '@8848digital/offline-kit';

// The self-contained browser build served at /sqlite/sqlite3.mjs. Only the
// promiser factory is used; its worker + wasm resolve to sibling /sqlite/ files.
interface SqliteWasmModule {
  sqlite3Worker1Promiser: (config?: { worker?: () => Worker; print?: (s: string) => void; printErr?: (s: string) => void }) => Promise<Promiser>;
}

// Re-export the platform-agnostic abstractions so existing consumers that
// import them from `../offline/db` (e.g. OfflineInspectorPage) keep working.
export { OfflineDbError };
export type { OfflineDb, SqlParams };

/**
 * Thrown by the web driver when the browser doesn't support OPFS. Web-specific
 * by name (the native driver will throw a different class); kept in this file
 * so the store can do an `instanceof` check without crossing the core boundary.
 */
export class OpfsUnsupportedError extends Error {
  constructor() {
    super('Offline mode requires the Origin Private File System (OPFS), which this browser does not support. Use a recent Chrome, Edge, Firefox, or Safari.');
    this.name = 'OpfsUnsupportedError';
  }
}

function extractWorkerErrorMessage(err: unknown): string {
  // The Worker1 promiser rejects with either a plain Error or an object
  // shaped { type: 'error', result: { message, errorClass } }. Handle both.
  if (err && typeof err === 'object') {
    const anyErr = err as { result?: { message?: string }; message?: string };
    if (anyErr.result?.message) return anyErr.result.message;
    if (anyErr.message) return anyErr.message;
    try {
      return JSON.stringify(err);
    } catch {
      return String(err);
    }
  }
  return String(err);
}

const DB_FILENAME = 'reactant-offline.db';
const DB_VFS = 'opfs';

interface ExecArgs {
  dbId: string;
  sql: string;
  bind?: SqlParams;
  rowMode?: 'object' | 'array';
  resultRows?: unknown[];
  returnValue?: 'resultRows';
}

interface Promiser {
  (
    type: 'open',
    args: { filename: string; vfs?: string },
  ): Promise<{
    result: { dbId: string };
  }>;
  (type: 'exec', args: ExecArgs): Promise<{ result: { resultRows?: unknown[] } }>;
  (type: 'close', args: { dbId: string }): Promise<void>;
  (
    type: 'config-get',
    args: Record<string, never>,
  ): Promise<{
    result: { version: { libVersion: string } };
  }>;
}

let openPromise: Promise<OfflineDb> | null = null;

export function openOfflineDb(): Promise<OfflineDb> {
  if (!openPromise) {
    openPromise = bootDb().catch((err) => {
      openPromise = null;
      throw err;
    });
  }
  return openPromise;
}

async function bootDb(): Promise<OfflineDb> {
  if (typeof window === 'undefined' || typeof Worker === 'undefined') {
    throw new OpfsUnsupportedError();
  }
  if (!('storage' in navigator) || typeof navigator.storage.getDirectory !== 'function') {
    throw new OpfsUnsupportedError();
  }
  // The "opfs" VFS uses a sub-worker that communicates via SharedArrayBuffer,
  // which requires cross-origin isolation (COOP + COEP headers).
  // Brave shields and some proxies can block this even when headers are set.
  if (!window.crossOriginIsolated) {
    throw new OfflineDbError(
      'Offline mode requires cross-origin isolation. ' +
        'The page must be served with Cross-Origin-Opener-Policy: same-origin and ' +
        'Cross-Origin-Embedder-Policy: require-corp. ' +
        'If using Brave, disable Shields for localhost.',
    );
  }

  let promiser: Promiser;
  try {
    // Runtime import of the static entry — `turbopackIgnore` keeps the bundler
    // from following it (see module header). The variable specifier also means
    // TS/bundler don't statically resolve `/sqlite/sqlite3.mjs`.
    const sqliteEntry = '/sqlite/sqlite3.mjs';
    const { sqlite3Worker1Promiser } = (await import(/* turbopackIgnore: true */ sqliteEntry)) as SqliteWasmModule;
    // Explicit worker at the static /sqlite/ copy (unambiguous, no reliance on the
    // entry's import.meta.url); the worker then loads sqlite3.wasm +
    // sqlite3-opfs-async-proxy.js by relative name → /sqlite/…
    promiser = await sqlite3Worker1Promiser({
      worker: () => new Worker('/sqlite/sqlite3-worker1.mjs', { type: 'module' }),
    });
  } catch (err) {
    throw new OfflineDbError('Failed to start SQLite worker', err);
  }

  let dbId: string;
  try {
    const openRes = await promiser('open', { filename: DB_FILENAME, vfs: DB_VFS });
    dbId = openRes.result.dbId;
  } catch (err) {
    const underlying = extractWorkerErrorMessage(err);
    throw new OfflineDbError(`Failed to open ${DB_FILENAME} via OPFS`, err, {
      underlyingMessage: underlying,
    });
  }

  const logSqlFailure = (kind: 'exec' | 'query', sql: string, params: SqlParams | undefined, err: unknown) => {
    const underlying = extractWorkerErrorMessage(err);
    // Group so the full SQL is inspectable without truncation.
    console.groupCollapsed(`[offline-db] SQL ${kind} failed — ${underlying}`);
    console.log('SQL:\n' + sql);
    if (params && params.length > 0) console.log('Params:', params);
    console.log('Raw error:', err);
    console.groupEnd();
    return underlying;
  };

  const exec = async (sql: string, params?: SqlParams): Promise<void> => {
    try {
      await promiser('exec', { dbId, sql, bind: params });
    } catch (err) {
      const underlying = logSqlFailure('exec', sql, params, err);
      throw new OfflineDbError(`SQL exec failed: ${underlying}`, err, {
        sql,
        underlyingMessage: underlying,
      });
    }
  };

  const all = async <T>(sql: string, params?: SqlParams): Promise<T[]> => {
    try {
      // `resultRows: []` tells the worker we want rows back; the populated
      // array comes back in the response (structure-cloned), NOT mutated in
      // place — the worker is in a separate thread.
      const response = await promiser('exec', {
        dbId,
        sql,
        bind: params,
        rowMode: 'object',
        resultRows: [],
        returnValue: 'resultRows',
      });
      return (response?.result?.resultRows ?? []) as T[];
    } catch (err) {
      const underlying = logSqlFailure('query', sql, params, err);
      throw new OfflineDbError(`SQL query failed: ${underlying}`, err, {
        sql,
        underlyingMessage: underlying,
      });
    }
  };

  // Serialize concurrent transactions at the JS layer. The worker promiser
  // queues individual messages, but a multi-statement transaction is a
  // SEQUENCE of messages — without this gate, two concurrent callers each
  // reach BEGIN before either has COMMITted, and SQLite (correctly) rejects
  // the second with "cannot start a transaction within a transaction".
  //
  // This shows up most easily in React 18 StrictMode (dev), which runs every
  // useEffect twice on mount; both runs race their transactions. The mutex
  // makes transaction() safe under any concurrency, dev or prod.
  let txTail: Promise<unknown> = Promise.resolve();

  const transaction = <T>(work: (tx: OfflineDb) => Promise<T>): Promise<T> => {
    const run = async (): Promise<T> => {
      await exec('BEGIN');
      try {
        const result = await work(api);
        await exec('COMMIT');
        return result;
      } catch (err) {
        try {
          await exec('ROLLBACK');
        } catch {
          // ignore rollback failures; surface the original error
        }
        throw err;
      }
    };
    const next = txTail.then(run);
    // Swallow chain errors so one failed transaction doesn't poison every
    // subsequent one. Each caller still sees its own failure via `next`.
    txTail = next.then(
      () => undefined,
      () => undefined,
    );
    return next;
  };

  const api: OfflineDb = { exec, all, transaction };

  // Enable foreign-key enforcement for this connection. SQLite ships with FKs
  // OFF by default — declaring `FOREIGN KEY (...) REFERENCES ...` in a table
  // only documents the relationship until this pragma is set. The setting is
  // per-connection (per worker session for sqlite-wasm), so it must run every
  // time the DB is opened. Done after `api` is constructed so any failure
  // flows through the same OfflineDbError logging path as ordinary queries.
  try {
    await api.exec('PRAGMA foreign_keys = ON');
  } catch (err) {
    throw new OfflineDbError('Failed to enable foreign-key enforcement', err);
  }

  if (process.env.NODE_ENV !== 'production') {
    (window as unknown as { __offlineDb?: OfflineDb }).__offlineDb = api;
  }

  return api;
}
