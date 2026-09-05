# Custom fonts

The template ships **no brand font** — native text uses the OS system font
(`typography.family.sans: 'System'` in `@app/core/tokens`).

To add your own:

1. Drop the `.ttf` / `.otf` files in this folder.
2. Link them into the native projects:
   ```bash
   pnpm --filter <your>-native exec react-native-asset
   ```
   This registers them in `android/link-assets-manifest.json`,
   `ios/link-assets-manifest.json`, the iOS `Info.plist` (`UIAppFonts`), and the
   Xcode project.
3. Point the design tokens at the family name so both platforms follow:
   edit `typography.family.sans` in `packages/core/src/tokens/index.ts`.

Never hardcode a font family in a component — go through the tokens.
