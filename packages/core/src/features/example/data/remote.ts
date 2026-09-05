import { api } from '@8848digital/catalyst';
import { endpoints } from '../../../api/endpoints';
import type { ExampleItem } from '../example.types';

/**
 * Remote (HTTP) data source for the `example` slice. Wired but benched — the
 * repo reads local by default (offline-first). Flip in repo.ts to go online.
 */
export const exampleRemote = {
  getList: (): Promise<ExampleItem[]> => api.get<ExampleItem[]>(endpoints.example.getList),
};
