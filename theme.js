export const theme = {
  colors: {
    navyDark: '#0F1E4D',
    navyMid: '#1A2F6B',
    accentOrange: '#F5A623',
    successGreen: '#4CAF50',
    warningBg: '#FDF3D6',
    warningText: '#E8A33D',
    background: '#F4F6FB',
    cardBg: '#FFFFFF',
    textPrimary: '#0F1E4D',
    textSecondary: '#6B7A99',
    textMuted: '#94A3B8',
    border: '#E2E8F0',
    iconBackground: '#F0F4FF',
    accentBlue: '#3B82F6',

    // Friendly soft pastel backgrounds
    pastels: {
      blue: '#E0F2FE',
      orange: '#FFEDD5',
      green: '#DCFCE7',
      purple: '#F3E8FF',
      cyan: '#CFFAFE',
      pink: '#FCE7F3',
      indigo: '#E0E7FF',
      yellow: '#FEF3C7',
    },
  },
  fonts: {
    regular: 'Nunito_400Regular',
    semiBold: 'Nunito_600SemiBold',
    bold: 'Nunito_700Bold',
    extraBold: 'Nunito_800Bold',
  },
  radius: {
    small: 10,
    medium: 14,
    large: 20,
    full: 9999,
  },
  shadows: {
    card: {
      shadowColor: '#0F1E4D',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 12,
      elevation: 3,
    },
    subtle: {
      shadowColor: '#0F1E4D',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.03,
      shadowRadius: 6,
      elevation: 2,
    },
  },
  typography: {
    titleLarge: {
      fontSize: 28,
      fontFamily: 'Nunito_800Bold',
      color: '#0F1E4D',
      letterSpacing: 0.2,
    },
    titleMedium: {
      fontSize: 20,
      fontFamily: 'Nunito_700Bold',
      color: '#0F1E4D',
      letterSpacing: 0.2,
    },
    subtitle: {
      fontSize: 14,
      fontFamily: 'Nunito_600SemiBold',
      color: '#6B7A99',
      letterSpacing: 0.1,
    },
    body: {
      fontSize: 14,
      fontFamily: 'Nunito_400Regular',
      color: '#0F1E4D',
    },
    caption: {
      fontSize: 12,
      fontFamily: 'Nunito_400Regular',
      color: '#94A3B8',
    },
  },
};

export default theme;
