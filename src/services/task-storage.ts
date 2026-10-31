import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Task } from '@/types/task';

const STORAGE_KEY = 'todolist:tasks';

function isTask(value: unknown): value is Task {
  const task = value as Task | null;
  return (
    typeof task?.id === 'string' &&
    typeof task.title === 'string' &&
    typeof task.description === 'string' &&
    typeof task.completed === 'boolean' &&
    typeof task.createdAt === 'string'
  );
}

export async function loadTasks(): Promise<Task[]> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  const parsed: unknown = JSON.parse(stored);
  return Array.isArray(parsed) ? parsed.filter(isTask) : [];
}

export async function saveTasks(tasks: Task[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
