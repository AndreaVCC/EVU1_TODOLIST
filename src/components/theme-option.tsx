import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { MinTouchTarget, PressedOpacity, Radius, Spacing } from '@/constants/theme';
import { Themes, type ThemePreference } from '@/constants/themes';
import { useTheme } from '@/hooks/use-theme';

type ThemeOptionProps = {
  value: ThemePreference;
  label: string;
  description: string;
  selected: boolean;
  onSelect: (value: ThemePreference) => void;
};

export function ThemeOption({ value, label, description, selected, onSelect }: ThemeOptionProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="radio"
      aria-checked={selected}
      accessibilityLabel={`${label}. ${description}`}
      android_ripple={{ color: theme.ripple }}
      onPress={() => onSelect(value)}
      style={({ pressed }) => [
        styles.option,
        {
          backgroundColor: theme.surface,
          borderColor: selected ? theme.primary : theme.border,
        },
        selected && styles.selected,
        pressed && styles.pressed,
      ]}>
      {value === 'system' ? (
        <View style={styles.swatches}>
          <Icon name="contrast" color={theme.primary} />
        </View>
      ) : (
        <View style={styles.swatches}>
          {[Themes[value].colors.header, Themes[value].colors.primary, Themes[value].colors.background].map(
            (color) => (
              <View
                key={color}
                style={[styles.swatch, { backgroundColor: color, borderColor: theme.borderStrong }]}
              />
            )
          )}
        </View>
      )}
      <View style={styles.labels}>
        <ThemedText type="title">{label}</ThemedText>
        <ThemedText type="caption" themeColor="textSecondary">
          {description}
        </ThemedText>
      </View>
      {selected && <Icon name="checkCircle" color={theme.primary} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    minHeight: MinTouchTarget + Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderWidth: 1,
    borderRadius: Radius.medium,
    overflow: 'hidden',
  },
  selected: {
    borderWidth: 2,
  },
  pressed: {
    opacity: PressedOpacity,
  },
  swatches: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
  },
  swatch: {
    width: 22,
    height: 22,
    marginHorizontal: -2,
    borderWidth: 1,
    borderRadius: Radius.full,
  },
  labels: {
    flex: 1,
  },
});
