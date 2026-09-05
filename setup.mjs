#!/usr/bin/env node
/**
 * One-time template personalization. Prompts for a project name + API base URL,
 * writes them into the package.json names, the web page title, and the .env
 * files, then deletes itself.
 *
 * Deliberately thin: it does NOT rename the native app id (that's a documented
 * ship-time step — see README) and does NOT touch the @8848digital/* or @app/*
 * package scopes (those are stable).
 */
import { readFile, writeFile, unlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';

const here = new URL('.', import.meta.url);
const path = (rel) => fileURLToPath(new URL(rel, here));

// Line reader that buffers input arriving before a prompt is shown — robust for
// both interactive typing and piped stdin.
const rl = createInterface({ input: process.stdin });
const buffered = [];
let waiting = null;
let closed = false;
rl.on('line', (line) => {
  if (waiting) {
    const resolve = waiting;
    waiting = null;
    resolve(line);
  } else {
    buffered.push(line);
  }
});
rl.on('close', () => {
  closed = true;
  if (waiting) {
    const resolve = waiting;
    waiting = null;
    resolve('');
  }
});
const nextLine = () => (buffered.length ? Promise.resolve(buffered.shift()) : closed ? Promise.resolve('') : new Promise((resolve) => (waiting = resolve)));
const ask = async (q, def) => {
  process.stdout.write(`${q}${def ? ` (${def})` : ''}: `);
  const answer = (await nextLine()).trim();
  return answer || def;
};

const displayName = await ask('Project name', 'Reactant');
const apiBaseUrl = await ask('API Base URL', 'http://localhost:8000');
rl.close();

const slug =
  displayName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'reactant';

async function setName(rel, name) {
  const file = path(rel);
  if (!existsSync(file)) return;
  const json = JSON.parse(await readFile(file, 'utf8'));
  json.name = name;
  await writeFile(file, JSON.stringify(json, null, 2) + '\n');
}

// Cosmetic package names (safe — the native app id is set at ship time, not here).
await setName('package.json', slug);
await setName('apps/web/package.json', `${slug}-web`);
await setName('apps/native/package.json', `${slug}-native`);

// Web page title — lives in the Next App Router metadata (apps/web/app/layout.tsx).
const layoutTsx = path('apps/web/app/layout.tsx');
if (existsSync(layoutTsx)) {
  const layout = await readFile(layoutTsx, 'utf8');
  await writeFile(layoutTsx, layout.replace(/title:\s*(['"]).*?\1/, `title: '${displayName}'`));
}

// .env files from their .env.example + the entered API URL.
async function writeEnv(exampleRel, envRel, key) {
  const example = path(exampleRel);
  if (!existsSync(example)) return;
  const base = await readFile(example, 'utf8');
  const line = `${key}=${apiBaseUrl}`;
  const out = new RegExp(`^${key}=`, 'm').test(base) ? base.replace(new RegExp(`^${key}=.*$`, 'm'), line) : `${base.trimEnd()}\n${line}\n`;
  await writeFile(path(envRel), out);
}
await writeEnv('apps/web/.env.example', 'apps/web/.env', 'NEXT_PUBLIC_API_BASE_URL');
await writeEnv('apps/native/.env.example', 'apps/native/.env', 'API_BASE_URL');

console.log(`\n✓ Personalized "${displayName}".`);
console.log('  • package.json names + web <title> set');
console.log('  • apps/web/.env + apps/native/.env written with your API URL\n');
console.log('Next:');
console.log('  1. Put a GitHub Packages read token in ~/.npmrc (see README).');
console.log('  2. pnpm install');
console.log('  3. pnpm --filter web dev\n');
console.log('Ship-time (not automated): set your own native bundle id — currently');
console.log('com.example.reactant — across apps/native/android + apps/native/ios.\n');

await unlink(fileURLToPath(import.meta.url));
