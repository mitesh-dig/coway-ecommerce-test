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

// ---------------------------------------------------------------------------
// Figma-sourced COWAY color system (colors.figma) — additive, does not replace
// the placeholder ramps/roles above. Extracted via Figma MCP `get_variable_defs`
// (primitives) and `get_metadata` (semantic mapping) from the COWAY-Website file:
//   - "Colour Variables" frame (primitives): node 11152:18487
//   - "Colour Styles" frame (semantic roles): node 11152:18606
// Confidence: Confirmed unless noted. Gaps found during extraction (documented,
// not fabricated):
//   - background.gradient1/2/3 are gradient fills in Figma, not flat colors —
//     not representable in this flat hex token shape; skipped pending a
//     dedicated gradient token type if a component ever needs them.
//   - border.positive: this row's Figma layer is named "Border / Inverse" (a
//     duplicate of the row above it) but its visible text label reads
//     "Positive" → Green 800. Mapped by the visible label; flagged for design
//     review since the layer name itself looks like a copy-paste artifact.
//   - warning/info roles have no confirmed Figma semantic style. The Yellow
//     ramp exists as a primitive (Inferred use for a future "warning" role)
//     but is intentionally left unwired until design confirms it.
const figmaBrandRamp = {
  100: '#e8f7fc',
  200: '#bbe7f7',
  300: '#68caee',
  400: '#36b9e8',
  500: '#04a7e2',
  600: '#0497cc',
  700: '#047ba6',
  800: '#02435a',
  900: '#01212d',
} as const;

const figmaSecondaryRamp = {
  100: '#ccd8e1',
  200: '#99b1c3',
  300: '#668ba5',
  400: '#336487',
  500: '#003d69',
  600: '#003154',
  700: '#00253f',
  800: '#00182a',
  900: '#000c15',
} as const;

const figmaNeutralRamp = {
  100: '#f9fafa',
  200: '#d3d9db',
  300: '#bcc6ca',
  400: '#a6b3b8',
  500: '#90a0a6',
  600: '#738085',
  700: '#566064',
  800: '#3a4042',
  900: '#1d2021',
} as const;

const figmaGreenRamp = {
  100: '#d4f1e5',
  200: '#aae4cc',
  300: '#7fd6b2',
  400: '#55c999',
  500: '#2abb7f',
  600: '#229666',
  700: '#19704c',
  800: '#114b33',
  900: '#082519',
} as const;

const figmaRedRamp = {
  100: '#fcdedc',
  200: '#f9bdb9',
  300: '#f79d96',
  400: '#f47c73',
  500: '#f15b50',
  600: '#c14940',
  700: '#913730',
  800: '#602420',
  900: '#301210',
} as const;

const figmaYellowRamp = {
  100: '#fcf6d5',
  200: '#f8edaa',
  300: '#f5e380',
  400: '#f1da55',
  500: '#eed12b',
  600: '#bea722',
  700: '#8f7d1a',
  800: '#5f5411',
  900: '#302a09',
} as const;

const figmaWhiteAlpha = {
  10: '#ffffff1a',
  20: '#ffffff33',
  30: '#ffffff4d',
  40: '#ffffff66',
  50: '#ffffff80',
  60: '#ffffff99',
  70: '#ffffffb2',
  80: '#ffffffcc',
  90: '#ffffffe5',
  100: '#ffffff',
} as const;

const figmaBlackAlpha = {
  10: '#0000001a',
  20: '#00000033',
  30: '#0000004d',
  40: '#00000066',
  50: '#00000080',
  60: '#00000099',
  70: '#000000b2',
  80: '#000000cc',
  90: '#000000e5',
  100: '#000000',
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
  figma: {
    palette: {
      brand: figmaBrandRamp,
      secondary: figmaSecondaryRamp,
      neutral: figmaNeutralRamp,
      green: figmaGreenRamp,
      red: figmaRedRamp,
      yellow: figmaYellowRamp,
      white: figmaWhiteAlpha,
      black: figmaBlackAlpha,
    },
    content: {
      primary: figmaNeutralRamp[800],
      secondary: figmaNeutralRamp[700],
      tertiary: figmaSecondaryRamp[500],
      primaryInverse: figmaWhiteAlpha[100],
      secondaryInverse: figmaNeutralRamp[300],
      brand: figmaBrandRamp[500],
      positive: figmaGreenRamp[800],
      negative: figmaRedRamp[700],
      disabled: figmaNeutralRamp[500],
    },
    background: {
      primary: figmaWhiteAlpha[100],
      secondary: figmaBrandRamp[100],
      tertiary: figmaSecondaryRamp[500],
      brand: figmaBrandRamp[500],
      disabled: figmaNeutralRamp[200],
      positive: figmaGreenRamp[200],
      negative: figmaRedRamp[200],
    },
    border: {
      primary: figmaSecondaryRamp[100],
      secondary: figmaSecondaryRamp[200],
      brand: figmaBrandRamp[500],
      inverse: figmaWhiteAlpha[100],
      positive: figmaGreenRamp[800],
    },
    button: {
      brand: {
        active: figmaBrandRamp[500],
        hover: figmaBrandRamp[600],
        focused: figmaBrandRamp[500],
        pressed: figmaBrandRamp[700],
      },
      secondary: {
        active: figmaSecondaryRamp[500],
        hover: figmaSecondaryRamp[600],
        focused: figmaSecondaryRamp[500],
        pressed: figmaSecondaryRamp[700],
      },
      inverse: {
        active: figmaWhiteAlpha[100],
        hover: figmaNeutralRamp[100],
        focused: figmaWhiteAlpha[100],
        pressed: figmaNeutralRamp[200],
      },
      disabled: figmaNeutralRamp[200],
    },
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
