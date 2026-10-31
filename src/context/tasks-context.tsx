import {
  createContext,
  use,
  useEffect,
  useReducer,
  useState,
  type PropsWithChildren,
} from 'react';

import { useFeedback } from '@/context/feedback-context';
import { loadTasks, saveTasks } from '@/services/task-storage';
import type { Task, TaskDraft } from '@/types/task';
import { createTask } from '@/utils/task-utils';

type TasksAction =
  | { type: 'hydrate'; tasks: Task[] }
  | { type: 'add'; task: Task }
  | { type: 'update'; id: string; draft: TaskDraft }
  | { type: 'toggle'; id: string }
  | { type: 'remove'; id: string }
  | { type: 'completeAll' }
  | { type: 'removeCompleted' };

function tasksReducer(tasks: Task[], action: TasksAction): Task[] {
  switch (action.type) {
    case 'hydrate':
      return action.tasks;
    case 'add':
      return [action.task, ...tasks];
    case 'update':
      return tasks.map((task) =>
        task.id === action.id
          ? {
              ...task,
              title: action.draft.title.trim(),
              description: action.draft.description.trim(),
            }
          : task
      );
    case 'toggle':
      return tasks.map((task) =>
        task.id === action.id ? { ...task, completed: !task.completed } : task
      );
    case 'remove':
      return tasks.filter((task) => task.id !== action.id);
    case 'completeAll':
      return tasks.map((task) => ({ ...task, completed: true }));
    case 'removeCompleted':
      return tasks.filter((task) => !task.completed);
  }
}

type TasksContextValue = {
  tasks: Task[];
  /** Es `false` mientras se leen las tareas guardadas en el dispositivo. */
  isReady: boolean;
  addTask: (draft: TaskDraft) => void;
  updateTask: (id: string, draft: TaskDraft) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  completeAllTasks: () => void;
  removeCompletedTasks: () => void;
};

const TasksContext = createContext<TasksContextValue | null>(null);

export function TasksProvider({ children }: PropsWithChildren) {
  const showMessage = useFeedback();
  const [tasks, dispatch] = useReducer(tasksReducer, []);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    loadTasks()
      .then((stored) => dispatch({ type: 'hydrate', tasks: stored }))
      .catch(() => showMessage('No se pudieron cargar tus tareas guardadas.'))
      .finally(() => setIsReady(true));
    // Solo debe leer el almacenamiento una vez, al abrir la app.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isReady) return;
    saveTasks(tasks).catch(() => showMessage('No se pudieron guardar los cambios.'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks, isReady]);

  const value: TasksContextValue = {
    tasks,
    isReady,
    addTask: (draft) => dispatch({ type: 'add', task: createTask(draft) }),
    updateTask: (id, draft) => dispatch({ type: 'update', id, draft }),
    toggleTask: (id) => dispatch({ type: 'toggle', id }),
    removeTask: (id) => dispatch({ type: 'remove', id }),
    completeAllTasks: () => dispatch({ type: 'completeAll' }),
    removeCompletedTasks: () => dispatch({ type: 'removeCompleted' }),
  };

  return <TasksContext value={value}>{children}</TasksContext>;
}

export function useTasks() {
  const context = use(TasksContext);
  if (!context) throw new Error('useTasks debe usarse dentro de TasksProvider');
  return context;
}
