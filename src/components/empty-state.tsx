import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type EmptyStateProps = {
  icon: IconName;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ icon, title, message, actionLabel, onAction }: EmptyStateProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: theme.primarySoft }]}>
        <Icon name={icon} color={theme.onPrimarySoft} size={40} />
      </View>
      <ThemedText type="headline" style={styles.text}>
        {title}
      </ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.text}>
        {message}
      </ThemedText>
      {actionLabel && onAction && (
        <View style={styles.action}>
          <Button label={actionLabel} icon="add" onPress={onAction} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
  },
  iconCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 88,
    height: 88,
    marginBottom: Spacing.two,
    borderRadius: Radius.full,
  },
  text: {
    textAlign: 'center',
  },
  action: {
    marginTop: Spacing.three,
  },
});
