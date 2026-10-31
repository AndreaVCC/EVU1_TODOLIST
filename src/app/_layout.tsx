import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { FeedbackProvider } from '@/context/feedback-context';
import { TasksProvider, useTasks } from '@/context/tasks-context';
import { AppThemeProvider, useAppTheme } from '@/context/theme-context';

SplashScreen.preventAutoHideAsync();

// Permite volver a la lista al abrir el formulario directamente desde un enlace.
export const unstable_settings = { anchor: '(tabs)' };

function RootNavigator() {
  const { isReady } = useTasks();
  const { isThemeReady } = useAppTheme();

  useEffect(() => {
    if (isReady && isThemeReady) SplashScreen.hide();
  }, [isReady, isThemeReady]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="task-form" options={{ animation: 'slide_from_bottom' }} />
    </Stack>
  );
}

function ThemedApp() {
  const { colors, isDark } = useAppTheme();
  const baseTheme = isDark ? DarkTheme : DefaultTheme;

  const navigationTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.surfaceSolid,
      text: colors.text,
      border: colors.border,
      notification: colors.primary,
    },
  };

  return (
    <ThemeProvider value={navigationTheme}>
      <FeedbackProvider>
        <TasksProvider>
          <RootNavigator />
          {/* Todos los temas usan encabezados oscuros, por eso la barra de estado es clara. */}
          <StatusBar style="light" />
        </TasksProvider>
      </FeedbackProvider>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <ThemedApp />
    </AppThemeProvider>
  );
}
