import type { NextConfig } from 'next';

// Cross-origin isolation (COOP + COEP) is MANDATORY for the SQLite/OPFS worker,
// which uses SharedArrayBuffer. These headers apply to `next dev` and `next start`.
// Production behind your own server (e.g. nginx) must send them too.
const crossOriginIsolationHeaders = [
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
];

const nextConfig: NextConfig = {
  // @app/core and @app/ui-web export raw ./src/*.ts — Next must transpile them.
  transpilePackages: ['@app/core', '@app/ui-web'],
  async headers() {
    return [{ source: '/:path*', headers: crossOriginIsolationHeaders }];
  },
};

export default nextConfig;
