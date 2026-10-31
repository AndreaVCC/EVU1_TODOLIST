import * as SystemUI from 'expo-system-ui';
import { createContext, use, useEffect, useState, type PropsWithChildren } from 'react';

import { Themes, type ThemeColors, type ThemePreference } from '@/constants/themes';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { loadThemePreference, saveThemePreference } from '@/services/theme-storage';

type AppThemeContextValue = {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  colors: ThemeColors;
  isDark: boolean;
  /** Es `false` mientras se lee el tema guardado en el dispositivo. */
  isThemeReady: boolean;
};

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

export function AppThemeProvider({ children }: PropsWithChildren) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [isThemeReady, setIsThemeReady] = useState(false);

  const themeName =
    preference === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : preference;
  const { colors, isDark } = Themes[themeName];

  useEffect(() => {
    loadThemePreference()
      .then((stored) => {
        if (stored) setPreferenceState(stored);
      })
      // Si no se puede leer, la app sigue funcionando con el tema automático.
      .catch(() => {})
      .finally(() => setIsThemeReady(true));
  }, []);

  // Evita un destello de otro color detrás de las pantallas y del teclado.
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background).catch(() => {});
  }, [colors.background]);

  const setPreference = (next: ThemePreference) => {
    setPreferenceState(next);
    saveThemePreference(next).catch(() => {});
  };

  return (
    <AppThemeContext value={{ preference, setPreference, colors, isDark, isThemeReady }}>
      {children}
    </AppThemeContext>
  );
}

export function useAppTheme() {
  const context = use(AppThemeContext);
  if (!context) throw new Error('useAppTheme debe usarse dentro de AppThemeProvider');
  return context;
}
