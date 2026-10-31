export type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  /** Fecha de creación en formato ISO 8601. */
  createdAt: string;
};

export type TaskDraft = Pick<Task, 'title' | 'description'>;

export type TaskFilter = 'all' | 'pending' | 'completed';

export type TaskSort = 'newest' | 'oldest';

export type TaskStats = {
  total: number;
  pending: number;
  completed: number;
  /** Porcentaje de tareas completadas, de 0 a 100. */
  progress: number;
};
