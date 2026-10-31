import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { IconButton } from '@/components/ui/icon-button';
import { Icon } from '@/components/ui/icon';
import { MinTouchTarget, PressedOpacity, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Task } from '@/types/task';
import { formatTaskDate } from '@/utils/task-utils';

type TaskItemProps = {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (task: Task) => void;
};

export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  const theme = useTheme();

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Pressable
        accessibilityRole="checkbox"
        aria-checked={task.completed}
        accessibilityLabel={`Marcar "${task.title}" como ${task.completed ? 'pendiente' : 'completada'}`}
        android_ripple={{ color: theme.ripple, borderless: true, radius: MinTouchTarget / 2 }}
        onPress={() => onToggle(task.id)}
        style={styles.checkboxTouchArea}>
        <View
          style={[
            styles.checkbox,
            { borderColor: theme.primary },
            task.completed && { backgroundColor: theme.primary },
          ]}>
          {task.completed && <Icon name="check" color={theme.onPrimary} size={16} />}
        </View>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${task.title}. ${task.description}`}
        accessibilityHint="Abre la tarea para editarla"
        android_ripple={{ color: theme.ripple }}
        onPress={() => onEdit(task.id)}
        style={({ pressed }) => [styles.content, pressed && styles.pressed]}>
        <ThemedText
          type="title"
          themeColor={task.completed ? 'textSecondary' : 'text'}
          style={task.completed && styles.completedTitle}>
          {task.title}
        </ThemedText>
        <ThemedText type="caption" themeColor="textSecondary" numberOfLines={3}>
          {task.description}
        </ThemedText>
        <ThemedText type="caption" themeColor="textSecondary" style={styles.date}>
          {formatTaskDate(task.createdAt)}
        </ThemedText>
      </Pressable>

      <View style={styles.actions}>
        <IconButton
          icon="edit"
          label={`Editar "${task.title}"`}
          color={theme.primary}
          onPress={() => onEdit(task.id)}
        />
        <IconButton
          icon="delete"
          label={`Eliminar "${task.title}"`}
          color={theme.danger}
          onPress={() => onDelete(task)}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Spacing.one,
    paddingRight: Spacing.one,
    borderWidth: 1,
    borderRadius: Radius.medium,
  },
  checkboxTouchArea: {
    alignItems: 'center',
    justifyContent: 'center',
    width: MinTouchTarget,
    height: MinTouchTarget,
  },
  checkbox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: Radius.full,
  },
  content: {
    flex: 1,
    gap: Spacing.half,
    paddingVertical: Spacing.two,
  },
  pressed: {
    opacity: PressedOpacity,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
  },
  date: {
    marginTop: Spacing.one,
  },
  actions: {
    flexDirection: 'row',
  },
});
