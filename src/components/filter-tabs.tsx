import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { MinTouchTarget, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { TaskFilter, TaskStats } from '@/types/task';

type FilterTabsProps = {
  value: TaskFilter;
  stats: TaskStats;
  onChange: (filter: TaskFilter) => void;
};

const OPTIONS: { value: TaskFilter; label: string; count: keyof TaskStats }[] = [
  { value: 'all', label: 'Todas', count: 'total' },
  { value: 'pending', label: 'Pendientes', count: 'pending' },
  { value: 'completed', label: 'Listas', count: 'completed' },
];

export function FilterTabs({ value, stats, onChange }: FilterTabsProps) {
  const theme = useTheme();

  return (
    <View
      accessibilityRole="tablist"
      style={[styles.container, { backgroundColor: theme.surfaceMuted }]}>
      {OPTIONS.map((option) => {
        const isSelected = option.value === value;
        const color = isSelected ? 'onPrimary' : 'textSecondary';

        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            aria-selected={isSelected}
            accessibilityLabel={`${option.label}: ${stats[option.count]}`}
            android_ripple={{ color: theme.ripple }}
            onPress={() => onChange(option.value)}
            style={[styles.tab, isSelected && { backgroundColor: theme.primary }]}>
            <ThemedText type="label" themeColor={color} numberOfLines={1}>
              {option.label} ({stats[option.count]})
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.half,
    padding: Spacing.half,
    borderRadius: Radius.medium,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: MinTouchTarget - Spacing.one,
    paddingHorizontal: Spacing.one,
    borderRadius: Radius.small + Spacing.half,
    overflow: 'hidden',
  },
});
