import { colors, typography, spacing, radius, shadow } from './index';

/**
 * StyleSheet-ready token constants for React Native. Derived from ./index, so it
 * auto-reflects any brand values you change there. Native components read from
 * `rnTokens` (never raw values).
 */
export const rnTokens = {
  colors: {
    primary: colors.brand.primary,
    white: colors.brand.white,
    black: colors.brand.black,
    neutral: colors.palette.neutral,
    textPrimary: colors.text.primary,
    textSecondary: colors.text.secondary,
    textMuted: colors.text.muted,
    textInverse: colors.text.inverse,
    surfaceCanvas: colors.surface.canvas,
    surfaceSubtle: colors.surface.subtle,
    borderDefault: colors.border.default,
    borderFocus: colors.border.focus,
    success: colors.semantic.success,
    error: colors.semantic.error,
  },
  typography: {
    family: typography.family,
    size: typography.size,
    weight: typography.weight,
    lineHeight: typography.lineHeight,
  },
  spacing,
  radius,
  shadow: {
    sm: shadow.sm.native,
    md: shadow.md.native,
    lg: shadow.lg.native,
  },
} as const;
