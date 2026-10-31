import type { Task, TaskDraft, TaskFilter, TaskSort, TaskStats } from '@/types/task';

export const TITLE_MAX_LENGTH = 60;
export const DESCRIPTION_MAX_LENGTH = 200;

export type TaskDraftErrors = Partial<Record<keyof TaskDraft, string>>;

export function createTask({ title, description }: TaskDraft): Task {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: title.trim(),
    description: description.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  };
}

export function validateTaskDraft({ title, description }: TaskDraft): TaskDraftErrors {
  const errors: TaskDraftErrors = {};
  if (!title.trim()) errors.title = 'Escribe un título para la tarea.';
  if (!description.trim()) errors.description = 'Agrega una descripción para la tarea.';
  return errors;
}

export function filterTasks(tasks: Task[], filter: TaskFilter) {
  if (filter === 'pending') return tasks.filter((task) => !task.completed);
  if (filter === 'completed') return tasks.filter((task) => task.completed);
  return tasks;
}

export function sortTasks(tasks: Task[], sort: TaskSort) {
  const direction = sort === 'newest' ? -1 : 1;
  return [...tasks].sort((a, b) => direction * a.createdAt.localeCompare(b.createdAt));
}

export function getTaskStats(tasks: Task[]): TaskStats {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  return {
    total,
    completed,
    pending: total - completed,
    progress: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}

export function formatTaskDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });
}

export function pluralizeTasks(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`;
}
