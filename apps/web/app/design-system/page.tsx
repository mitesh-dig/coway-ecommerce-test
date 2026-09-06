import { ColorSwatch } from '@app/ui-web';
import { primitiveGroups, semanticGroups, type TokenGroup } from './tokens-data';

// Server Component (Next shell) — assembles Figma-sourced color token data and
// composes the ui-web ColorSwatch primitive for visual verification against:
//   https://www.figma.com/design/4dDPkRmyanC2TxFEj8cKnr/COWAY-Website?node-id=11152-18487&m=dev
//   https://www.figma.com/design/4dDPkRmyanC2TxFEj8cKnr/COWAY-Website?node-id=11152-18606&m=dev
function TokenSection({ title, group }: Readonly<{ title: string; group: TokenGroup }>) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-semibold text-text-primary">{group.title}</h3>
      <div className="flex flex-wrap gap-4">
        {group.entries.map((entry) => (
          <ColorSwatch key={`${title}-${entry.name}`} name={entry.name} hex={entry.hex} colorClassName={entry.colorClassName} />
        ))}
      </div>
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-12 bg-surface-canvas px-6 py-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-text-primary">Design System — Color Tokens</h1>
        <p className="max-w-2xl text-md text-text-secondary">
          Every color token in <code className="rounded bg-surface-muted px-1">@app/core/tokens</code> (colors.figma), rendered for
          visual verification against the Figma color-system frames.
        </p>
      </header>

      <section className="flex flex-col gap-8">
        <h2 className="text-xl font-semibold text-text-primary">Primitives</h2>
        {primitiveGroups.map((group) => (
          <TokenSection key={group.title} title="primitive" group={group} />
        ))}
      </section>

      <section className="flex flex-col gap-8">
        <h2 className="text-xl font-semibold text-text-primary">Semantic roles</h2>
        {semanticGroups.map((group) => (
          <TokenSection key={group.title} title="semantic" group={group} />
        ))}
      </section>
    </main>
  );
}
