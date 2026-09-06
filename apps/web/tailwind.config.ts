import type { Config } from 'tailwindcss';
import { colors, typography, spacing, radius, shadow } from '@app/core/tokens';

// Tailwind is a pure CONSUMER of the design tokens — it never defines values.
// Edit the values in packages/core/src/tokens to rebrand.
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}', '../../packages/ui-web/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: colors.brand.primary,
          ...colors.palette.primary,
        },
        neutral: colors.palette.neutral,
        white: colors.brand.white,
        black: colors.brand.black,
        success: colors.semantic.success,
        'success-surface': colors.semantic.successSurface,
        error: colors.semantic.error,
        'error-surface': colors.semantic.errorSurface,
        warning: colors.semantic.warning,
        'warning-surface': colors.semantic.warningSurface,
        info: colors.semantic.info,
        'info-surface': colors.semantic.infoSurface,
        'text-primary': colors.text.primary,
        'text-secondary': colors.text.secondary,
        'text-placeholder': colors.text.placeholder,
        'text-disabled': colors.text.disabled,
        'text-muted': colors.text.muted,
        'surface-canvas': colors.surface.canvas,
        'surface-subtle': colors.surface.subtle,
        'surface-muted': colors.surface.muted,
        'surface-page': colors.surface.page,
        'border-default': colors.border.default,
        'border-strong': colors.border.strong,
        'border-focus': colors.border.focus,
        'input-border-default': colors.input.borderDefault,
        'input-border-hover': colors.input.borderHover,
        'input-border-focused': colors.input.borderFocused,
        'overlay-backdrop': colors.overlay.backdrop,
        // Figma-sourced COWAY color system — additive, see packages/core/src/tokens/index.ts (colors.figma)
        'figma-brand': { DEFAULT: colors.figma.palette.brand[500], ...colors.figma.palette.brand },
        'figma-secondary': { DEFAULT: colors.figma.palette.secondary[500], ...colors.figma.palette.secondary },
        'figma-neutral': colors.figma.palette.neutral,
        'figma-green': colors.figma.palette.green,
        'figma-red': colors.figma.palette.red,
        'figma-yellow': colors.figma.palette.yellow,
        'figma-white': colors.figma.palette.white,
        'figma-black': colors.figma.palette.black,
        'figma-content': colors.figma.content,
        'figma-background': colors.figma.background,
        'figma-border': colors.figma.border,
        'figma-button': colors.figma.button,
      },
      fontFamily: {
        sans: [typography.family.sans, 'sans-serif'],
        mono: [typography.family.mono, 'monospace'],
      },
      fontSize: Object.fromEntries(Object.entries(typography.size).map(([k, v]) => [k, `${v}px`])),
      fontWeight: typography.weight,
      lineHeight: {
        tight: String(typography.lineHeight.tight),
        normal: String(typography.lineHeight.normal),
        relaxed: String(typography.lineHeight.relaxed),
      },
      spacing: Object.fromEntries(Object.entries(spacing).map(([k, v]) => [k, `${v}px`])),
      borderRadius: Object.fromEntries(Object.entries(radius).map(([k, v]) => [k, v === 9999 ? '9999px' : `${v}px`])),
      boxShadow: {
        sm: shadow.sm.web,
        md: shadow.md.web,
        lg: shadow.lg.web,
      },
      dropShadow: {
        topbar: shadow.topBar.web,
      },
    },
  },
  plugins: [],
};

export default config;
