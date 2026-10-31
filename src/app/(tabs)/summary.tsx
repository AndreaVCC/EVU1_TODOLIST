import { ScrollView, StyleSheet, View } from 'react-native';

import { ScreenContainer } from '@/components/screen-container';
import { ScreenHeader } from '@/components/screen-header';
import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { ProgressBar } from '@/components/ui/progress-bar';
import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useTasks } from '@/context/tasks-context';
import { useTheme } from '@/hooks/use-theme';
import type { TaskStats } from '@/types/task';
import { getTaskStats } from '@/utils/task-utils';

function getProgressMessage({ total, pending }: TaskStats): {
  icon: IconName;
  message: string;
} {
  if (total === 0) return { icon: 'tasks', message: 'Agrega tareas para ver tu avance aquí.' };
  if (pending === 0) return { icon: 'celebrate', message: '¡Terminaste todas tus tareas!' };
  return { icon: 'pending', message: 'Sigue así, cada tarea cuenta.' };
}

export default function SummaryScreen() {
  const theme = useTheme();
  const { tasks } = useTasks();
  const stats = getTaskStats(tasks);
  const { icon, message } = getProgressMessage(stats);

  const tiles: { label: string; value: number; icon: IconName }[] = [
    { label: 'Total', value: stats.total, icon: 'list' },
    { label: 'Pendientes', value: stats.pending, icon: 'pending' },
    { label: 'Completadas', value: stats.completed, icon: 'checkCircle' },
  ];

  return (
    <ScreenContainer>
      <ScreenHeader title="Resumen" subtitle="Tu avance de un vistazo" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.progressHeading}>
            <ThemedText type="title">Avance general</ThemedText>
            <ThemedText type="headline" style={{ color: theme.primary }}>
              {stats.progress}%
            </ThemedText>
          </View>
          <ProgressBar
            value={stats.progress}
            color={theme.primary}
            trackColor={theme.surfaceMuted}
          />
          <View style={styles.progressMessage}>
            <Icon name={icon} color={theme.primary} size={20} />
            <ThemedText themeColor="textSecondary" style={styles.progressMessageText}>
              {message}
            </ThemedText>
          </View>
        </View>

        <View style={styles.tiles}>
          {tiles.map((tile) => (
            <View
              key={tile.label}
              accessible
              accessibilityLabel={`${tile.label}: ${tile.value}`}
              style={[styles.tile, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={[styles.tileIcon, { backgroundColor: theme.primarySoft }]}>
                <Icon name={tile.icon} color={theme.onPrimarySoft} size={20} />
              </View>
              <ThemedText type="display">{tile.value}</ThemedText>
              <ThemedText type="caption" themeColor="textSecondary" numberOfLines={1}>
                {tile.label}
              </ThemedText>
            </View>
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
  card: {
    gap: Spacing.three,
    padding: Spacing.three,
    borderWidth: 1,
    borderRadius: Radius.medium,
  },
  progressHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  progressMessageText: {
    flex: 1,
  },
  tiles: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  tile: {
    flex: 1,
    gap: Spacing.one,
    padding: Spacing.three,
    borderWidth: 1,
    borderRadius: Radius.medium,
  },
  tileIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    marginBottom: Spacing.one,
    borderRadius: Radius.full,
  },
});
