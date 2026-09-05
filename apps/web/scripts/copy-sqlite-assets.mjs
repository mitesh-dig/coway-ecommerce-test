// Copies the SQLite-WASM ESM entry + worker + wasm + OPFS async-proxy into
// public/sqlite/ so they are served as static, un-hashed files at /sqlite/*.
// This keeps the whole package OUT of the bundler: db.ts loads the entry with a
// turbopackIgnore'd runtime import of /sqlite/sqlite3.mjs, whose own
// `new URL(..., import.meta.url)` resolutions then point at its sibling files
// here (worker → sqlite3.wasm → sqlite3-opfs-async-proxy.js). Turbopack can't
// follow the package's dynamic `new Worker(new URL(...))` graph, so we sidestep
// bundling entirely. Runs automatically via the predev/prebuild scripts.
import { createRequire } from 'node:module';
import { cpSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);
const distDir = path.join(path.dirname(require.resolve('@sqlite.org/sqlite-wasm/package.json')), 'dist');
const targetDir = path.resolve('public', 'sqlite');

mkdirSync(targetDir, { recursive: true });
// dist/index.mjs is the self-contained browser entry (exports sqlite3Worker1Promiser);
// served as sqlite3.mjs. The other three are loaded by it at runtime by relative name.
const copies = [
  ['index.mjs', 'sqlite3.mjs'],
  ['sqlite3-worker1.mjs', 'sqlite3-worker1.mjs'],
  ['sqlite3.wasm', 'sqlite3.wasm'],
  ['sqlite3-opfs-async-proxy.js', 'sqlite3-opfs-async-proxy.js'],
];
for (const [from, to] of copies) {
  cpSync(path.join(distDir, from), path.join(targetDir, to));
}

console.log(`[copy-sqlite-assets] copied ${copies.length} assets → ${path.relative(process.cwd(), targetDir)}`);
