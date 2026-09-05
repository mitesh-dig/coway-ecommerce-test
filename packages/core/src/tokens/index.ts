// Design tokens — the SINGLE source for colors, spacing, typography, radius, and
// shadows. These are NEUTRAL placeholders: bring your own brand by editing the
// values here (keep the shape). Web consumes them via apps/web/tailwind.config.ts;
// native via ./rn-styles (rnTokens). Never hardcode raw values in components.

const primaryRamp = {
  50: '#eef2ff',
  100: '#e0e7ff',
  200: '#c7d2fe',
  300: '#a5b4fc',
  400: '#818cf8',
  500: '#6366f1',
  600: '#4f46e5',
  700: '#4338ca',
  800: '#3730a3',
  900: '#312e81',
} as const;

const neutralRamp = {
  50: '#f9fafb',
  100: '#f3f4f6',
  200: '#e5e7eb',
  300: '#d1d5db',
  400: '#9ca3af',
  500: '#6b7280',
  600: '#4b5563',
  700: '#374151',
  800: '#1f2937',
  900: '#111827',
} as const;

export const colors = {
  brand: {
    primary: primaryRamp[600],
    white: '#ffffff',
    black: '#111827',
  },
  palette: {
    primary: primaryRamp,
    neutral: neutralRamp,
  },
  semantic: {
    success: '#16a34a',
    successSurface: '#f0fdf4',
    error: '#dc2626',
    errorSurface: '#fef2f2',
    warning: '#d97706',
    warningSurface: '#fffbeb',
    info: '#2563eb',
    infoSurface: '#eff6ff',
  },
  text: {
    primary: '#111827',
    secondary: '#4b5563',
    placeholder: '#9ca3af',
    disabled: '#d1d5db',
    muted: '#6b7280',
    inverse: '#ffffff',
  },
  surface: {
    canvas: '#ffffff',
    subtle: '#f9fafb',
    muted: '#f3f4f6',
    page: '#ffffff',
  },
  border: {
    default: '#e5e7eb',
    strong: '#d1d5db',
    focus: primaryRamp[600],
  },
  input: {
    borderDefault: '#d1d5db',
    borderHover: '#9ca3af',
    borderFocused: primaryRamp[600],
  },
  overlay: {
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
} as const;

export const typography = {
  family: { sans: 'System', mono: 'monospace' },
  size: { xs: 12, sm: 14, md: 16, lg: 18, xl: 24, '2xl': 32 },
  weight: { regular: '400', medium: '500', semibold: '600', bold: '700' },
  lineHeight: { tight: 1.2, normal: 1.5, relaxed: 1.75 },
} as const;

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

export const radius = { none: 0, sm: 4, md: 8, lg: 12, xl: 16, full: 9999 } as const;

export const shadow = {
  sm: {
    web: '0 1px 2px rgba(0, 0, 0, 0.05)',
    native: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  },
  md: {
    web: '0 4px 6px rgba(0, 0, 0, 0.1)',
    native: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  },
  lg: {
    web: '0 10px 15px rgba(0, 0, 0, 0.1)',
    native: { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 10, elevation: 6 },
  },
  topBar: { web: '0 2px 4px rgba(0, 0, 0, 0.06)' },
} as const;
