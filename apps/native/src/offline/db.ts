// Native offline-storage driver — the React Native counterpart of
// apps/web/src/offline/db.ts (which uses sqlite-wasm + OPFS).
//
// react-native-sqlite-2 is a WebSQL wrapper, but WebSQL's auto-committing
// transactions cannot stay open across `await` gaps — the exact pattern that
// core's `transaction(work)` relies on. So instead of using the WebSQL
// `db.transaction()` API, we drive the LOW-LEVEL primitive the WebSQL layer
// itself uses: `WebsqlDatabase._db.exec(batch, readOnly, cb)`.
//
// Verified against the package's Android source (RNSqlite2Module.java): there
// is ONE cached SQLiteDatabase per db name, served by a single serial
// background handler, so `_db.exec` calls run FIFO on one connection. The
// `readOnly` flag does NOT switch connections — it only rejects writes — so we
// pass `false` everywhere and run manual BEGIN/COMMIT/ROLLBACK ourselves. This
// mirrors the web driver almost line-for-line.
import SQLite from 'react-native-sqlite-2';
import { OfflineDbError, type OfflineDb, type SqlParams, type SqlValue } from '@8848digital/offline-kit';

// Re-export the platform-agnostic abstractions so native consumers can import
// them from `../offline/db` without crossing into @app/core directly (parity
// with the web driver's re-exports).
export { OfflineDbError };
export type { OfflineDb, SqlParams };

const DB_FILENAME = 'reactant-offline.db'; // match web for parity

/** One raw result row-set from react-native-sqlite-2's low-level exec. */
interface RawResult {
  error?: Error | null;
  insertId?: number | null;
  rowsAffected?: number;
  rows?: unknown[];
}

type RawExecCallback = (err: Error | null | undefined, results?: RawResult[]) => void;

/** The low-level `SQLiteDatabase` hanging off a WebsqlDatabase as `_db`. */
interface LowLevelDb {
  exec(batch: Array<{ sql: string; args: SqlParams }>, readOnly: boolean, callback: RawExecCallback): void;
}

interface WebsqlDatabaseWithLowLevel {
  _db: LowLevelDb;
}

// SQLite's native binders across the RN bridge don't reliably understand a JS
// boolean — depending on platform it can arrive as null, 0/1, or a bind error
// (the bridge's escape step only transforms strings, so a boolean passes through
// untouched). The OfflineDb contract's SqlValue includes boolean, and the web
// driver relies on the engine coercing booleans to 0/1 natively. Normalize here
// so the native driver honors the same contract regardless of bridge behavior.
const normalizeParams = (params?: SqlParams): SqlValue[] => (params ?? []).map((v): SqlValue => (typeof v === 'boolean' ? Number(v) : v));

let openPromise: Promise<OfflineDb> | null = null;

export function openOfflineDb(): Promise<OfflineDb> {
  if (!openPromise) {
    openPromise = bootDb().catch(err => {
      // Reset so a later caller can retry the open after a transient failure.
      openPromise = null;
      throw err;
    });
  }
  return openPromise;
}

async function bootDb(): Promise<OfflineDb> {
  let lowDb: LowLevelDb;
  try {
    // openDatabase is synchronous here; the native DB is opened lazily on the
    // first `_db.exec`. If the native module isn't linked, the first exec call
    // throws the package's LINKING_ERROR, which surfaces via OfflineDbError.
    //
    // LOAD-BEARING PIN: this driver depends on the private `_db` field (created
    // by the transitive `websql` package), which has no API-stability guarantee.
    // react-native-sqlite-2 is therefore pinned to an EXACT version in
    // package.json — do not widen it to a caret range without re-verifying `_db`.
    const ws = SQLite.openDatabase(DB_FILENAME, '1.0', '', 1) as unknown as WebsqlDatabaseWithLowLevel;
    lowDb = ws._db;
  } catch (err) {
    throw new OfflineDbError('Failed to open native SQLite database', err);
  }

  const logSqlFailure = (kind: 'exec' | 'query', sql: string, params: SqlParams | undefined, err: unknown): string => {
    const underlying = err instanceof Error ? err.message : String(err);
    console.groupCollapsed(`[offline-db] SQL ${kind} failed — ${underlying}`);
    console.log('SQL:\n' + sql);
    if (params && params.length > 0) console.log('Params:', params);
    console.log('Raw error:', err);
    console.groupEnd();
    return underlying;
  };

  const rawExec = (sql: string, params?: SqlParams): Promise<RawResult> =>
    new Promise<RawResult>((resolve, reject) => {
      lowDb.exec([{ sql, args: normalizeParams(params) }], false, (err, results) => {
        if (err) return reject(err);
        const result = results?.[0];
        if (result?.error) return reject(result.error);
        resolve(result ?? {});
      });
    });

  const exec = async (sql: string, params?: SqlParams): Promise<void> => {
    try {
      await rawExec(sql, params);
    } catch (err) {
      const underlying = logSqlFailure('exec', sql, params, err);
      throw new OfflineDbError(`SQL exec failed: ${underlying}`, err, { sql, underlyingMessage: underlying });
    }
  };

  const all = async <T>(sql: string, params?: SqlParams): Promise<T[]> => {
    try {
      const result = await rawExec(sql, params);
      return (result.rows ?? []) as T[];
    } catch (err) {
      const underlying = logSqlFailure('query', sql, params, err);
      throw new OfflineDbError(`SQL query failed: ${underlying}`, err, { sql, underlyingMessage: underlying });
    }
  };

  // Serialize transactions at the JS layer. The native handler runs individual
  // exec calls FIFO, but a transaction is a SEQUENCE of calls — without this
  // gate two concurrent callers could each reach BEGIN before either COMMITs,
  // and SQLite rejects "cannot start a transaction within a transaction". Same
  // reasoning as the web driver's mutex.
  //
  // INVARIANT (matches the web driver): plain exec()/all() are NOT serialized
  // against an in-flight transaction — they dispatch straight onto the single
  // FIFO connection, so a direct write issued while a transaction is open would
  // land inside that BEGIN…COMMIT window and be committed/rolled back with it.
  // Therefore any write that can race a transaction MUST itself go through
  // transaction(). Multi-statement business operations in @app/core already
  // wrap their writes this way; keep new ones doing the same.
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
    // Swallow chain errors so one failed transaction doesn't poison the next.
    txTail = next.then(
      () => undefined,
      () => undefined,
    );
    return next;
  };

  const api: OfflineDb = { exec, all, transaction };

  // SQLite ships with foreign keys OFF; the setting is per-connection, so it
  // must run every time the DB is opened (same as the web driver).
  try {
    await api.exec('PRAGMA foreign_keys = ON');
  } catch (err) {
    throw new OfflineDbError('Failed to enable foreign-key enforcement', err);
  }

  return api;
}
