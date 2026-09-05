// Server Component (the Next shell owns pages). Static Welcome markup — no client
// hooks, no server-only data. Mirrors native's app-level src/screens/WelcomeScreen.
// Real UI with a native twin belongs in packages/ui-web ("use client"), rendered here.
export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface-canvas px-6 text-center">
      <span className="rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">Reactant</span>
      <h1 className="text-2xl font-bold text-text-primary">Welcome to your new app</h1>
      <p className="max-w-md text-md text-text-secondary">
        The offline-first web + native starter on a Frappe backend. The engine and chassis are wired and idling — no backend required to see this screen.
      </p>
      <p className="max-w-md text-sm text-text-muted">
        Start building: add features in <code className="rounded bg-surface-muted px-1">packages/core/src/features</code>, components in{' '}
        <code className="rounded bg-surface-muted px-1">packages/ui-web</code>, and pages here in <code className="rounded bg-surface-muted px-1">apps/web/app</code>.
      </p>
    </main>
  );
}
