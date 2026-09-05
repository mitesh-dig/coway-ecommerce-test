import { buildEndpoint } from '@8848digital/catalyst';

/**
 * The per-project Frappe app name (product-owned). Passed explicitly to
 * buildEndpoint so the generic builder in @8848digital/catalyst stays
 * project-agnostic. Boot also calls setApiApp(APP) so the generic auth endpoint
 * resolves the same app. Replace 'app' with your Frappe app name.
 */
export const APP = 'app';

/**
 * Business endpoint registry — your project's own domain endpoints. The generic
 * auth + offlineSync endpoints live in @8848digital/catalyst. The `example`
 * group demonstrates the shape — replace with your own.
 */
export const endpoints = {
  example: {
    getList: buildEndpoint('v1', 'example', 'get_list', APP),
  },
} as const;
