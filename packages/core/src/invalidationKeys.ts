/**
 * Local-read query keys that a write (create/update) invalidates. Product-owned,
 * so it lives in @app/core. Registered into @8848digital/catalyst at boot via
 * `registerInvalidationKeys(PRODUCT_INVALIDATION_KEYS)`.
 *
 * Empty in the template — add your slices' read keys here as you build write
 * flows, e.g. `[['examples'], ['orders']]`.
 */
export const PRODUCT_INVALIDATION_KEYS: readonly (readonly unknown[])[] = [];
