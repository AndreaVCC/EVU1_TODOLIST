import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { linearGradient } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Fondo común de las pantallas: un degradado suave sobre el que se ven las tarjetas translúcidas. */
export function ScreenContainer({ children }: PropsWithChildren) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background },
        linearGradient(180, theme.background, theme.backgroundEnd),
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
