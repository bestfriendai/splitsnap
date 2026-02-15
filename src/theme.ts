// SplitSnap Theme - Modern finance app aesthetic
// Brand color: Deep charcoal with emerald accent (trust + money)

export const colors = {
  // Primary brand - Emerald green (money, trust)
  brand: '#10B981',
  brandLight: 'rgba(16, 185, 129, 0.1)',
  brandDark: '#059669',
  
  // Surfaces
  background: '#FAFAFA',
  surface: '#FFFFFF',
  surfaceSecondary: '#F5F5F4',
  
  // Text
  text: '#1A1A1A',
  textSecondary: 'rgba(26, 26, 26, 0.55)',
  textTertiary: 'rgba(26, 26, 26, 0.35)',
  
  // Borders
  border: '#E5E5E5',
  borderLight: '#F0F0F0',
  
  // Semantic
  destructive: '#EF4444',
  destructiveBg: 'rgba(239, 68, 68, 0.1)',
  success: '#10B981',
  successBg: 'rgba(16, 185, 129, 0.1)',
  warning: '#F59E0B',
  warningBg: 'rgba(245, 158, 11, 0.1)',
  
  // Overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.03)',
  
  // Dark mode
  dark: {
    background: '#0A0A0A',
    surface: '#1C1C1E',
    surfaceSecondary: '#2C2C2E',
    text: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.6)',
    textTertiary: 'rgba(255, 255, 255, 0.35)',
    border: 'rgba(255, 255, 255, 0.08)',
  }
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const fontSize = {
  caption: 13,
  body: 15,
  bodyLarge: 17,
  title3: 20,
  title2: 22,
  largeTitle: 34,
};

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
};
