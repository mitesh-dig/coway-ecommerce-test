// Ambient declaration for global CSS side-effect imports (e.g. app/globals.css).
// Next.js doesn't ship a `*.css` module type, and this project's tsconfig
// (moduleResolution: bundler + strict) type-checks side-effect imports, so we
// declare the module here. CSS Modules (`*.module.css`) are unaffected.
declare module '*.css';
