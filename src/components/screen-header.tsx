import type { PropsWithChildren, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { linearGradient, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ScreenHeaderProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  /** Acción a la izquierda del título, como cerrar. */
  leading?: ReactNode;
  /** Acción a la derecha del título, como abrir un menú. */
  trailing?: ReactNode;
}>;

/** Encabezado con degradado común a todas las pantallas. */
export function ScreenHeader({ title, subtitle, leading, trailing, children }: ScreenHeaderProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.header,
        { backgroundColor: theme.header, paddingTop: insets.top + Spacing.three },
        linearGradient(135, theme.header, theme.headerEnd),
      ]}>
      <View style={styles.content}>
        <View style={styles.row}>
          {leading}
          <View style={styles.titles}>
            <ThemedText
              type={leading ? 'headline' : 'display'}
              themeColor="onHeader"
              accessibilityRole="header">
              {title}
            </ThemedText>
            {subtitle && (
              <ThemedText type="label" themeColor="onHeaderMuted">
                {subtitle}
              </ThemedText>
            )}
          </View>
          {trailing}
        </View>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.three,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    minHeight: 48,
  },
  titles: {
    flex: 1,
  },
});
