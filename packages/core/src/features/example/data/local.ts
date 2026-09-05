import { getOfflineDb } from '@8848digital/offline-kit';
import type { ExampleItem } from '../example.types';

/**
 * Local (SQLite) data source for the `example` slice.
 *
 * Only the DB layer (a slice's `data` folder, plus usecases/outbox and
 * shared-domain) may import `getOfflineDb` / run SQL (ESLint-enforced).
 * Repos and hooks delegate downward to here. Replace with your own table + query.
 */
export async function getExamples(): Promise<ExampleItem[]> {
  const db = await getOfflineDb();
  return db.all<ExampleItem>('SELECT id, name FROM example ORDER BY name');
}
