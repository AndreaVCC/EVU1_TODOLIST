/**
 * Temas de la app. Este archivo solo contiene datos para que `scripts/check-contrast.ts`
 * pueda revisar el contraste de cada combinación: ejecuta `npm run check:contrast` al
 * cambiar un color.
 */

export type ThemeName = 'light' | 'dark' | 'rose' | 'blue' | 'green';

export type ThemePreference = ThemeName | 'system';

export type ThemeColors = {
  text: string;
  textSecondary: string;
  /** Inicio y fin del degradado de fondo de las pantallas. */
  background: string;
  backgroundEnd: string;
  /** Tarjetas translúcidas sobre el fondo. */
  surface: string;
  /** Superficies opacas: menús, diálogos, campos y barra de pestañas. */
  surfaceSolid: string;
  surfaceMuted: string;
  /** Borde decorativo de tarjetas. */
  border: string;
  /** Borde de controles, como los campos de texto: requiere contraste de 3:1. */
  borderStrong: string;
  primary: string;
  onPrimary: string;
  primarySoft: string;
  onPrimarySoft: string;
  /** Inicio y fin del degradado del encabezado. */
  header: string;
  headerEnd: string;
  onHeader: string;
  onHeaderMuted: string;
  headerTrack: string;
  headerProgress: string;
  danger: string;
  onDanger: string;
  scrim: string;
  snackbar: string;
  onSnackbar: string;
  ripple: string;
};

export type Theme = {
  isDark: boolean;
  colors: ThemeColors;
};

export const Themes: Record<ThemeName, Theme> = {
  light: {
    isDark: false,
    colors: {
      text: '#1C1B19',
      textSecondary: '#5F5A50',
      background: '#F8F6F1',
      backgroundEnd: '#EFEBE2',
      surface: 'rgba(255, 255, 255, 0.72)',
      surfaceSolid: '#FFFFFF',
      surfaceMuted: 'rgba(60, 52, 38, 0.08)',
      border: 'rgba(60, 52, 38, 0.14)',
      borderStrong: '#8A8375',
      primary: '#2A2824',
      onPrimary: '#FFFFFF',
      primarySoft: 'rgba(60, 52, 38, 0.1)',
      onPrimarySoft: '#2A2824',
      header: '#1F1E1B',
      headerEnd: '#3B372F',
      onHeader: '#FFFFFF',
      onHeaderMuted: '#DDD7C9',
      headerTrack: 'rgba(255, 255, 255, 0.22)',
      headerProgress: '#E9DFC7',
      danger: '#A8201A',
      onDanger: '#FFFFFF',
      scrim: 'rgba(20, 18, 14, 0.5)',
      snackbar: '#24221E',
      onSnackbar: '#FFFFFF',
      ripple: 'rgba(42, 40, 36, 0.16)',
    },
  },
  dark: {
    isDark: true,
    colors: {
      text: '#F4F1EA',
      textSecondary: '#B9B4A8',
      background: '#131315',
      backgroundEnd: '#1C1B1F',
      surface: 'rgba(255, 255, 255, 0.06)',
      surfaceSolid: '#232226',
      surfaceMuted: 'rgba(255, 255, 255, 0.08)',
      border: 'rgba(255, 255, 255, 0.12)',
      borderStrong: '#8C877C',
      primary: '#E6DAC0',
      onPrimary: '#1C1B19',
      primarySoft: 'rgba(230, 218, 192, 0.14)',
      onPrimarySoft: '#EFE6D3',
      header: '#0F0F11',
      headerEnd: '#2A2824',
      onHeader: '#FFFFFF',
      onHeaderMuted: '#CFC9BC',
      headerTrack: 'rgba(255, 255, 255, 0.2)',
      headerProgress: '#E6DAC0',
      danger: '#F2A6A0',
      onDanger: '#2A0F0D',
      scrim: 'rgba(0, 0, 0, 0.6)',
      snackbar: '#EFE6D3',
      onSnackbar: '#1C1B19',
      ripple: 'rgba(230, 218, 192, 0.2)',
    },
  },
  rose: {
    isDark: false,
    colors: {
      text: '#2C1519',
      textSecondary: '#6C4C53',
      background: '#FBF5F5',
      backgroundEnd: '#F5E8EA',
      surface: 'rgba(255, 255, 255, 0.72)',
      surfaceSolid: '#FFFFFF',
      surfaceMuted: 'rgba(122, 35, 62, 0.08)',
      border: 'rgba(122, 35, 62, 0.14)',
      borderStrong: '#9A747E',
      primary: '#8E2A48',
      onPrimary: '#FFFFFF',
      primarySoft: 'rgba(142, 42, 72, 0.1)',
      onPrimarySoft: '#6F1F38',
      header: '#5C1A30',
      headerEnd: '#8E2A48',
      onHeader: '#FFFFFF',
      onHeaderMuted: '#F6DCE3',
      headerTrack: 'rgba(255, 255, 255, 0.25)',
      headerProgress: '#F9E1E7',
      danger: '#A8201A',
      onDanger: '#FFFFFF',
      scrim: 'rgba(44, 21, 25, 0.5)',
      snackbar: '#3A1A24',
      onSnackbar: '#FFFFFF',
      ripple: 'rgba(142, 42, 72, 0.16)',
    },
  },
  blue: {
    isDark: false,
    colors: {
      text: '#0F1C2E',
      textSecondary: '#4A5A70',
      background: '#F4F7FB',
      backgroundEnd: '#E6EDF6',
      surface: 'rgba(255, 255, 255, 0.72)',
      surfaceSolid: '#FFFFFF',
      surfaceMuted: 'rgba(27, 68, 122, 0.08)',
      border: 'rgba(27, 68, 122, 0.14)',
      borderStrong: '#71829A',
      primary: '#1B4F8F',
      onPrimary: '#FFFFFF',
      primarySoft: 'rgba(27, 79, 143, 0.1)',
      onPrimarySoft: '#143A6B',
      header: '#0F2A4D',
      headerEnd: '#1B4F8F',
      onHeader: '#FFFFFF',
      onHeaderMuted: '#D6E3F5',
      headerTrack: 'rgba(255, 255, 255, 0.25)',
      headerProgress: '#DCE9FA',
      danger: '#A8201A',
      onDanger: '#FFFFFF',
      scrim: 'rgba(15, 28, 46, 0.5)',
      snackbar: '#12263F',
      onSnackbar: '#FFFFFF',
      ripple: 'rgba(27, 79, 143, 0.16)',
    },
  },
  green: {
    isDark: false,
    colors: {
      text: '#10211A',
      textSecondary: '#475C53',
      background: '#F3F7F4',
      backgroundEnd: '#E5EEE8',
      surface: 'rgba(255, 255, 255, 0.72)',
      surfaceSolid: '#FFFFFF',
      surfaceMuted: 'rgba(25, 94, 68, 0.08)',
      border: 'rgba(25, 94, 68, 0.14)',
      borderStrong: '#6D8378',
      primary: '#1B6B4E',
      onPrimary: '#FFFFFF',
      primarySoft: 'rgba(27, 107, 78, 0.1)',
      onPrimarySoft: '#134D38',
      header: '#0F3B2B',
      headerEnd: '#1B6B4E',
      onHeader: '#FFFFFF',
      onHeaderMuted: '#D3EADF',
      headerTrack: 'rgba(255, 255, 255, 0.25)',
      headerProgress: '#DDF1E7',
      danger: '#A8201A',
      onDanger: '#FFFFFF',
      scrim: 'rgba(16, 33, 26, 0.5)',
      snackbar: '#123026',
      onSnackbar: '#FFFFFF',
      ripple: 'rgba(27, 107, 78, 0.16)',
    },
  },
};

export const THEME_OPTIONS: { value: ThemePreference; label: string; description: string }[] = [
  { value: 'system', label: 'Automático', description: 'Sigue el modo de tu teléfono' },
  { value: 'light', label: 'Claro', description: 'Marfil y grafito' },
  { value: 'dark', label: 'Oscuro', description: 'Grafito y champán' },
  { value: 'rose', label: 'Rosado', description: 'Rosa antiguo' },
  { value: 'blue', label: 'Azul', description: 'Azul medianoche' },
  { value: 'green', label: 'Verde', description: 'Verde bosque' },
];
