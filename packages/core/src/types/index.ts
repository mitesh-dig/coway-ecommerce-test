// @app/core types — your project's own domain types.
//
// Only genuinely-shared domain types (used by ≥2 features or app-wide) belong here.
// A feature's OWN types live with its slice, not in this barrel — see
// features/example/example.types.ts for the reference pattern (CLAUDE.md §5).
// (Generic transport/auth types like ApiResponse / AuthUser / Login* live in
// @8848digital/catalyst.)

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface KpiItem {
  label: string;
  value: string;
}
