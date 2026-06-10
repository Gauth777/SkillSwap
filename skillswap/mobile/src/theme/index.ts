// SkillSwap Design System
// Colors, typography, spacing constants for a clean, calm UI

export const Colors = {
  // Primary
  primary: '#4F46E5',       // Indigo 600
  primaryLight: '#818CF8',  // Indigo 400
  primaryDark: '#3730A3',   // Indigo 800
  primaryBg: '#EEF2FF',     // Indigo 50

  // Neutrals (slate)
  text: '#0F172A',          // Slate 900
  textSecondary: '#475569', // Slate 600
  textTertiary: '#94A3B8',  // Slate 400
  textInverse: '#FFFFFF',

  // Surfaces
  background: '#F8FAFC',    // Slate 50
  surface: '#FFFFFF',
  surfaceSecondary: '#F1F5F9', // Slate 100
  border: '#E2E8F0',        // Slate 200
  borderLight: '#F1F5F9',   // Slate 100

  // Semantic
  success: '#059669',       // Emerald 600
  successBg: '#ECFDF5',     // Emerald 50
  error: '#E11D48',         // Rose 600
  errorBg: '#FFF1F2',       // Rose 50
  warning: '#D97706',       // Amber 600
  warningBg: '#FFFBEB',     // Amber 50
  info: '#0284C7',          // Sky 600

  // Karma
  karmaPositive: '#059669',
  karmaNegative: '#E11D48',
  karmaZero: '#64748B',

  // Badge colors for post types
  teachBg: '#DBEAFE',       // Blue 100
  teachText: '#1E40AF',     // Blue 800
  learnBg: '#FCE7F3',       // Pink 100
  learnText: '#9D174D',     // Pink 800

  // Status
  statusPending: '#F59E0B',   // Amber 500
  statusAccepted: '#3B82F6',  // Blue 500
  statusCompleted: '#10B981', // Emerald 500
  statusDeclined: '#EF4444',  // Red 500
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
} as const;

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
} as const;
