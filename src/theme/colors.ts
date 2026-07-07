export const colors = {
  brand: '#e50914',
  brandText: '#fff7f6',

  background: '#0a0a0a',
  surface: '#2a2a2a',

  glassBg: 'rgba(255, 255, 255, 0.05)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',
  glassShadow: 'rgba(0, 0, 0, 0.25)',

  textPrimary: '#e5e2e1',
  textMuted: '#e9bcb6',
  textAccent: '#ffb4aa',
  placeholder: 'rgba(233, 188, 182, 0.5)',

  divider: 'rgba(255, 255, 255, 0.1)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
} as const;

export const typography = {
  logo: {
    fontFamily: undefined as string | undefined,
    fontSize: 32,
    fontWeight: '900' as const,
    letterSpacing: -1.6,
    lineHeight: 38,
  },
  heading: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 24,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '600' as const,
    letterSpacing: 1.2,
    lineHeight: 16,
  },
} as const;
