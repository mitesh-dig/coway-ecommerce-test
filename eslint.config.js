const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const sonarjs = require('eslint-plugin-sonarjs');
const prettierConfig = require('eslint-config-prettier');

module.exports = tseslint.config(
  { ignores: ['**/node_modules/**', '**/dist/**', '**/.turbo/**', 'apps/web/**'] },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  sonarjs.configs.recommended,
  prettierConfig,

  {
    files: ['apps/native/**/*.{ts,tsx}', 'packages/**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
      'sonarjs/no-nested-functions': 'off',
      'sonarjs/deprecation': 'off',
    },
  },

  // ── Layering guardrail ──────────────────────────────────────────────────────
  // Raw offline DB access (the `getOfflineDb` import) is the front door to all
  // SQL. Restricting it everywhere in core — then re-allowing it only in the
  // legitimate data-touching layer below — keeps SQL out of hooks/repos, which
  // must delegate downward. ESLint can only police imports, not `db.all(...)`
  // calls, but you can't call the DB without importing `getOfflineDb` first, so
  // the import ban is the enforceable proxy. axios is banned project-wide: the API
  // layer is the fetch-based apiClient from @8848digital/catalyst, not axios.
  {
    files: ['packages/core/src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@8848digital/offline-kit',
              importNames: ['getOfflineDb'],
              message:
                'Raw DB access (getOfflineDb) is only allowed in a feature data source (features/*/data), a use-case (usecases.ts), an outbox adapter (outbox.ts), or a shared-domain helper. Hooks, repos, and the chassis must delegate to those — they must not run SQL directly.',
            },
          ],
          patterns: [
            {
              group: ['axios', 'axios/*'],
              message: 'This project uses the fetch-based apiClient from @8848digital/catalyst, not axios.',
            },
          ],
        },
      ],
    },
  },

  // The legitimate DB-touching layer — re-allow the `getOfflineDb` import here
  // (the axios ban stays in force). These are the only places in core permitted
  // to run SQL. Post-CP2 the core barrel no longer re-exports the engine (apps
  // import boot symbols from @8848digital/offline-kit directly — the two front
  // doors), so it is no longer in this list. We scope this guard to the packages,
  // not app-side imports.
  {
    files: [
      'packages/core/src/features/*/data/**/*.{ts,tsx}',
      'packages/core/src/features/*/usecases.ts',
      'packages/core/src/features/*/outbox.ts',
      'packages/core/src/shared-domain/**/*.{ts,tsx}',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['axios', 'axios/*'],
              message: 'This project uses the fetch-based apiClient from @8848digital/catalyst, not axios.',
            },
          ],
        },
      ],
    },
  },

  // ── Feature-local types standard (CLAUDE.md §5) ─────────────────────────────
  // A feature's OWN domain types live in its slice (e.g. example.types.ts), never
  // in the global types/ barrel — global types/ is only for genuinely-shared types.
  // These two blocks ban feature files from importing the global types/ barrel.
  // Flat config REPLACES (not merges) no-restricted-imports per file, so each block
  // also restates the layering bans from the blocks above that it would otherwise
  // drop for these files. Scoped to features/** so shared-domain and non-feature
  // core files are untouched.
  //
  // Non-data feature files (hooks/repo/barrel/etc.): getOfflineDb stays banned.
  {
    files: ['packages/core/src/features/**/*.{ts,tsx}'],
    ignores: [
      'packages/core/src/features/*/data/**/*.{ts,tsx}',
      'packages/core/src/features/*/usecases.ts',
      'packages/core/src/features/*/outbox.ts',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@8848digital/offline-kit',
              importNames: ['getOfflineDb'],
              message:
                'Raw DB access (getOfflineDb) is only allowed in a feature data source (features/*/data), a use-case (usecases.ts), an outbox adapter (outbox.ts), or a shared-domain helper. Hooks, repos, and the chassis must delegate to those — they must not run SQL directly.',
            },
          ],
          patterns: [
            {
              group: ['axios', 'axios/*'],
              message: 'This project uses the fetch-based apiClient from @8848digital/catalyst, not axios.',
            },
            {
              group: ['**/types', '**/types/index', '../types', '../../types', '../../../types'],
              message:
                "A feature's own domain types live in its slice (e.g. example.types.ts), not the global types/ barrel — global types/ is only for genuinely-shared types (CLAUDE.md §5).",
            },
          ],
        },
      ],
    },
  },

  // Data-layer feature files: getOfflineDb stays ALLOWED here; axios + global types banned.
  {
    files: [
      'packages/core/src/features/*/data/**/*.{ts,tsx}',
      'packages/core/src/features/*/usecases.ts',
      'packages/core/src/features/*/outbox.ts',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['axios', 'axios/*'],
              message: 'This project uses the fetch-based apiClient from @8848digital/catalyst, not axios.',
            },
            {
              group: ['**/types', '**/types/index', '../types', '../../types', '../../../types'],
              message:
                "A feature's own domain types live in its slice (e.g. example.types.ts), not the global types/ barrel — global types/ is only for genuinely-shared types (CLAUDE.md §5).",
            },
          ],
        },
      ],
    },
  },
);
