import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';

import { EmptyState } from '@/components/empty-state';
import { FilterTabs } from '@/components/filter-tabs';
import { ScreenContainer } from '@/components/screen-container';
import { ScreenHeader } from '@/components/screen-header';
import { TaskItem } from '@/components/task-item';
import { ThemedText } from '@/components/themed-text';
import { ActionMenu, type ActionMenuItem } from '@/components/ui/action-menu';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Icon } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { MaxContentWidth, PressedOpacity, Radius, Spacing } from '@/constants/theme';
import { useFeedback } from '@/context/feedback-context';
import { useTasks } from '@/context/tasks-context';
import { useTheme } from '@/hooks/use-theme';
import type { Task, TaskFilter, TaskSort } from '@/types/task';
import { filterTasks, getTaskStats, pluralizeTasks, sortTasks } from '@/utils/task-utils';

const FAB_CLEARANCE = 96;

const EMPTY_FILTER_COPY: Record<Exclude<TaskFilter, 'all'>, { title: string; message: string }> = {
  pending: {
    title: 'No tienes pendientes',
    message: 'Terminaste todo lo que tenías por hacer.',
  },
  completed: {
    title: 'Aún no completas tareas',
    message: 'Toca el círculo de una tarea para marcarla como lista.',
  },
};

export default function TasksScreen() {
  const theme = useTheme();
  const router = useRouter();
  const showMessage = useFeedback();
  const { tasks, isReady, toggleTask, removeTask, completeAllTasks, removeCompletedTasks } =
    useTasks();

  const [filter, setFilter] = useState<TaskFilter>('all');
  const [sort, setSort] = useState<TaskSort>('newest');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isClearingCompleted, setIsClearingCompleted] = useState(false);

  const stats = getTaskStats(tasks);
  const visibleTasks = sortTasks(filterTasks(tasks, filter), sort);

  const subtitle =
    stats.total === 0
      ? 'Organiza tu día, una tarea a la vez'
      : `${pluralizeTasks(stats.pending, 'pendiente', 'pendientes')} · ${stats.progress}% completado`;

  const openNewTask = () => router.push('/task-form');
  const openEditTask = (id: string) => router.push({ pathname: '/task-form', params: { id } });

  const menuItems: ActionMenuItem[] = [
    {
      key: 'newest',
      label: 'Más recientes primero',
      icon: 'newest',
      selected: sort === 'newest',
      onPress: () => setSort('newest'),
    },
    {
      key: 'oldest',
      label: 'Más antiguas primero',
      icon: 'oldest',
      selected: sort === 'oldest',
      onPress: () => setSort('oldest'),
    },
    {
      key: 'complete-all',
      label: 'Completar todas',
      icon: 'doneAll',
      separated: true,
      disabled: stats.pending === 0,
      onPress: () => {
        completeAllTasks();
        showMessage('Todas las tareas quedaron completadas.');
      },
    },
    {
      key: 'clear-completed',
      label: 'Eliminar completadas',
      icon: 'deleteAll',
      destructive: true,
      disabled: stats.completed === 0,
      onPress: () => setIsClearingCompleted(true),
    },
  ];

  const renderEmptyState = () => {
    if (filter === 'all') {
      return (
        <EmptyState
          icon="tasks"
          title="Tu lista está vacía"
          message="Agrega tu primera tarea para empezar a organizarte."
          actionLabel="Agregar tarea"
          onAction={openNewTask}
        />
      );
    }
    return <EmptyState icon="inbox" {...EMPTY_FILTER_COPY[filter]} />;
  };

  return (
    <ScreenContainer>
      <ScreenHeader
        title="Mis tareas"
        subtitle={subtitle}
        trailing={
          <IconButton
            icon="more"
            label="Más opciones"
            color={theme.onHeader}
            onPress={() => setIsMenuOpen(true)}
          />
        }>
        {stats.total > 0 && (
          <ProgressBar
            value={stats.progress}
            color={theme.headerProgress}
            trackColor={theme.headerTrack}
          />
        )}
      </ScreenHeader>

      {isReady ? (
        <Animated.FlatList
          data={visibleTasks}
          keyExtractor={(task) => task.id}
          itemLayoutAnimation={LinearTransition.duration(200)}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onToggle={toggleTask}
              onEdit={openEditTask}
              onDelete={setTaskToDelete}
            />
          )}
          ListHeaderComponent={
            stats.total > 0 ? (
              <FilterTabs value={filter} stats={stats} onChange={setFilter} />
            ) : undefined
          }
          ListEmptyComponent={renderEmptyState()}
          ItemSeparatorComponent={ItemSeparator}
          ListHeaderComponentStyle={styles.listHeader}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={theme.primary} accessibilityLabel="Cargando" />
        </View>
      )}

      {stats.total > 0 && (
        <View style={styles.fabContainer} pointerEvents="box-none">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Agregar nueva tarea"
            android_ripple={{ color: theme.ripple }}
            onPress={openNewTask}
            style={({ pressed }) => [
              styles.fab,
              { backgroundColor: theme.primary },
              pressed && styles.pressed,
            ]}>
            <Icon name="add" color={theme.onPrimary} />
            <ThemedText type="title" themeColor="onPrimary">
              Nueva tarea
            </ThemedText>
          </Pressable>
        </View>
      )}

      <ActionMenu visible={isMenuOpen} items={menuItems} onClose={() => setIsMenuOpen(false)} />

      <ConfirmDialog
        visible={taskToDelete !== null}
        title="¿Eliminar esta tarea?"
        message={`"${taskToDelete?.title}" se eliminará de forma permanente.`}
        confirmLabel="Eliminar"
        onCancel={() => setTaskToDelete(null)}
        onConfirm={() => {
          if (taskToDelete) removeTask(taskToDelete.id);
          setTaskToDelete(null);
          showMessage('Tarea eliminada.');
        }}
      />

      <ConfirmDialog
        visible={isClearingCompleted}
        title="¿Eliminar las completadas?"
        message={`Se eliminarán ${pluralizeTasks(stats.completed, 'tarea completada', 'tareas completadas')} de forma permanente.`}
        confirmLabel="Eliminar"
        onCancel={() => setIsClearingCompleted(false)}
        onConfirm={() => {
          removeCompletedTasks();
          setIsClearingCompleted(false);
          showMessage('Tareas completadas eliminadas.');
        }}
      />
    </ScreenContainer>
  );
}

function ItemSeparator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    padding: Spacing.three,
    paddingBottom: FAB_CLEARANCE,
  },
  listHeader: {
    marginBottom: Spacing.three,
  },
  separator: {
    height: Spacing.two,
  },
  fabContainer: {
    position: 'absolute',
    bottom: Spacing.three,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.three,
  },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    minHeight: 56,
    paddingHorizontal: Spacing.four - Spacing.one,
    borderRadius: Radius.large,
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  },
  pressed: {
    opacity: PressedOpacity,
  },
});
