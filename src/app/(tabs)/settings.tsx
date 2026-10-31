import { ScrollView, StyleSheet, View } from 'react-native';

import { ScreenContainer } from '@/components/screen-container';
import { ScreenHeader } from '@/components/screen-header';
import { ThemeOption } from '@/components/theme-option';
import { ThemedText } from '@/components/themed-text';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { THEME_OPTIONS } from '@/constants/themes';
import { useAppTheme } from '@/context/theme-context';

export default function SettingsScreen() {
  const { preference, setPreference } = useAppTheme();

  return (
    <ScreenContainer>
      <ScreenHeader title="Ajustes" subtitle="Personaliza tu experiencia" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heading}>
          <ThemedText type="headline" accessibilityRole="header">
            Tema
          </ThemedText>
          <ThemedText themeColor="textSecondary">
            Elige cómo se ve la app. Tu elección queda guardada.
          </ThemedText>
        </View>
        <View accessibilityRole="radiogroup" style={styles.options}>
          {THEME_OPTIONS.map((option) => (
            <ThemeOption
              key={option.value}
              {...option}
              selected={preference === option.value}
              onSelect={setPreference}
            />
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
  },
  heading: {
    gap: Spacing.one,
  },
  options: {
    gap: Spacing.two,
  },
});
