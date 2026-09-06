import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

// The Next.js server shell (never migrated). Owns <html>, metadata, and the
// global stylesheet, then hands the tree to the client-side Providers boundary.
// `setup.mjs` personalizes the title below at template-init time.
export const metadata: Metadata = {
  title: 'Coway Ecommerce',
  description: 'The offline-first web + native starter on a Frappe backend.',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
