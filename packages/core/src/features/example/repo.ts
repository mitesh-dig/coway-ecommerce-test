import type { ExampleItem } from './example.types';
import { getExamples } from './data/local';

/**
 * Data access for the `example` slice — the single place that decides local vs
 * remote. Hooks call the repo and never touch SQL or HTTP.
 */
export const exampleRepo = {
  list: (): Promise<ExampleItem[]> => getExamples(),
};

// ─── REFERENCE: going online ─────────────────────────────────────────────────
// When this slice goes online, this is the ONLY file that changes — hooks and
// screens stay untouched:
//
//   import { getConnectivityProvider } from '@8848digital/offline-kit';
//   import { exampleRemote } from './data/remote';
//
//   list: async (): Promise<ExampleItem[]> =>
//     getConnectivityProvider().isOnline() ? exampleRemote.getList() : getExamples(),
// ─────────────────────────────────────────────────────────────────────────────
