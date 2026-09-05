const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const projectRoot = __dirname;
const repoRoot = path.resolve(__dirname, '../..');

// pnpm's peer-hashed store produces multiple physical copies of react /
// react-native 0.85.3 across workspace packages. RN's Animated + renderer use
// relative requires that assume a SINGLE react-native, so a split breaks them
// ("Cannot read property 'default' of undefined" in RendererImplementation).
// pnpm dedupe can't collapse the peer-hash variants, so we force these to
// resolve as if imported from the app — every package shares the app's copy.
const FORCE_SINGLE = ['react', 'react-dom', 'react-native'];

const config = {
  watchFolders: [repoRoot],
  resolver: {
    extraNodeModules: {
      '@app/core': path.resolve(repoRoot, 'packages/core/src'),
      '@app/ui-native': path.resolve(repoRoot, 'packages/ui-native/src'),
    },
    resolveRequest: (context, moduleName, platform) => {
      const isSingleton = FORCE_SINGLE.some((name) => moduleName === name || moduleName.startsWith(`${name}/`));
      if (isSingleton) {
        // Resolve as if required from the app's entry, pinning to apps/native/node_modules.
        return context.resolveRequest({ ...context, originModulePath: path.join(projectRoot, 'index.js') }, moduleName, platform);
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);
