/** Row of the local `example` table. This slice is the template's reference for the
 *  feature-local types standard (CLAUDE.md §5) — a feature's own types live here in
 *  the slice, never in the global types/ barrel. Replace with your own. */
export interface ExampleItem {
  id: string;
  name: string;
}
