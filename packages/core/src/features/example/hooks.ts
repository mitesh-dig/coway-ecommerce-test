import type { ExampleItem } from './example.types';
import { toLegacyShape, type LegacyQueryShape, useLocalQuery } from '@8848digital/catalyst';
import { exampleRepo } from './repo';

/**
 * Reads the local `example` table. This slice is the template's reference for
 * the vertical-slice convention — copy its shape (data/local, data/remote, repo,
 * hooks, index) for your own features.
 */
export function useGetExamples(): LegacyQueryShape<ExampleItem[]> {
  return toLegacyShape(
    useLocalQuery({
      queryKey: ['examples'],
      queryFn: () => exampleRepo.list(),
    }),
  );
}
