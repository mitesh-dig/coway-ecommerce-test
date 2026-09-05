// @app/core — your PRODUCT surface (features, domain types, business endpoints,
// design tokens). The reusable engine + chassis are separate installed packages:
// import chassis bits from @8848digital/catalyst and engine boot-symbols from
// @8848digital/offline-kit (the two front doors).

export * from './hooks'; // feature hooks (useGetExamples, …)
export type { ExampleItem } from './features/example'; // slice-local domain type (see example.types.ts)
export * from './types'; // your genuinely-shared domain types
export * from './tokens'; // design tokens
export * from './api'; // business endpoint registry (+ APP)
export { PRODUCT_INVALIDATION_KEYS } from './invalidationKeys';
export * from './utils';
