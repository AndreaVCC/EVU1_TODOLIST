import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type TextInputInstance,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { ScreenContainer } from '@/components/screen-container';
import { ScreenHeader } from '@/components/screen-header';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { IconButton } from '@/components/ui/icon-button';
import { TextField } from '@/components/ui/text-field';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useFeedback } from '@/context/feedback-context';
import { useTasks } from '@/context/tasks-context';
import { useTheme } from '@/hooks/use-theme';
import type { Task, TaskDraft } from '@/types/task';
import {
  DESCRIPTION_MAX_LENGTH,
  TITLE_MAX_LENGTH,
  validateTaskDraft,
  type TaskDraftErrors,
} from '@/utils/task-utils';

const EMPTY_DRAFT: TaskDraft = { title: '', description: '' };

export default function TaskFormScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { tasks, isReady } = useTasks();
  const task = tasks.find((candidate) => candidate.id === id);

  if (!isReady) {
    return (
      <ScreenContainer>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={theme.primary} accessibilityLabel="Cargando" />
        </View>
      </ScreenContainer>
    );
  }

  if (id && !task) return <TaskNotFound />;

  return <TaskForm key={id ?? 'new'} task={task} />;
}

function useCloseForm() {
  const router = useRouter();
  return () => (router.canGoBack() ? router.back() : router.replace('/(tabs)'));
}

function TaskNotFound() {
  const theme = useTheme();
  const close = useCloseForm();

  return (
    <ScreenContainer>
      <ScreenHeader
        title="Tarea no encontrada"
        leading={
          <IconButton icon="close" label="Cerrar" color={theme.onHeader} onPress={close} />
        }
      />
      <EmptyState
        icon="inbox"
        title="Esta tarea ya no existe"
        message="Es posible que se haya eliminado. Vuelve a la lista para ver tus tareas."
      />
    </ScreenContainer>
  );
}

function TaskForm({ task }: { task?: Task }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const close = useCloseForm();
  const showMessage = useFeedback();
  const { addTask, updateTask } = useTasks();

  const initialDraft = task ? { title: task.title, description: task.description } : EMPTY_DRAFT;
  const [draft, setDraft] = useState<TaskDraft>(initialDraft);
  const [errors, setErrors] = useState<TaskDraftErrors>({});
  const [isDiscarding, setIsDiscarding] = useState(false);

  const titleRef = useRef<TextInputInstance>(null);
  const descriptionRef = useRef<TextInputInstance>(null);

  const isDirty =
    draft.title !== initialDraft.title || draft.description !== initialDraft.description;

  const requestClose = () => (isDirty ? setIsDiscarding(true) : close());

  // Android: el botón físico "atrás" no debe descartar lo escrito sin avisar.
  useEffect(() => {
    if (!isDirty) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      setIsDiscarding(true);
      return true;
    });
    return () => subscription.remove();
  }, [isDirty]);

  const updateField = (field: keyof TaskDraft, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  /** Valida el formulario y lleva el foco al primer campo con error. */
  const validate = () => {
    const nextErrors = validateTaskDraft(draft);
    setErrors(nextErrors);
    if (nextErrors.title) titleRef.current?.focus();
    else if (nextErrors.description) descriptionRef.current?.focus();
    return Object.keys(nextErrors).length === 0;
  };

  const save = () => {
    if (!validate()) return;

    if (task) {
      updateTask(task.id, draft);
      showMessage('Cambios guardados.');
    } else {
      addTask(draft);
      setDraft(EMPTY_DRAFT);
      showMessage('Tarea agregada.');
    }
    close();
  };

  const saveAndAddAnother = () => {
    if (!validate()) return;

    addTask(draft);
    setDraft(EMPTY_DRAFT);
    showMessage('Tarea agregada. Puedes escribir otra.');
    titleRef.current?.focus();
  };

  return (
    <ScreenContainer>
      {/* El gesto de volver en iOS se bloquea mientras haya cambios sin guardar. */}
      <Stack.Screen options={{ gestureEnabled: !isDirty }} />
      <ScreenHeader
        title={task ? 'Editar tarea' : 'Nueva tarea'}
        leading={
          <IconButton
            icon="close"
            label="Cerrar formulario"
            color={theme.onHeader}
            onPress={requestClose}
          />
        }
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'web' ? undefined : 'padding'}
        style={styles.screen}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + Spacing.four },
          ]}>
          <TextField
            ref={titleRef}
            label="Título"
            placeholder="Ej: Estudiar para la prueba"
            value={draft.title}
            error={errors.title}
            maxLength={TITLE_MAX_LENGTH}
            autoFocus={!task}
            autoCapitalize="sentences"
            returnKeyType="next"
            submitBehavior="submit"
            onChangeText={(value) => updateField('title', value)}
            onSubmitEditing={() => descriptionRef.current?.focus()}
          />
          <TextField
            ref={descriptionRef}
            label="Descripción"
            placeholder="Ej: Repasar los capítulos 1 al 3"
            value={draft.description}
            error={errors.description}
            maxLength={DESCRIPTION_MAX_LENGTH}
            multiline
            autoCapitalize="sentences"
            onChangeText={(value) => updateField('description', value)}
          />
          <View style={styles.actions}>
            <Button
              label={task ? 'Guardar cambios' : 'Guardar tarea'}
              icon="save"
              onPress={save}
            />
            {!task && (
              <Button
                label="Guardar y agregar otra"
                icon="add"
                variant="secondary"
                onPress={saveAndAddAnother}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ConfirmDialog
        visible={isDiscarding}
        title="¿Descartar los cambios?"
        message="Lo que escribiste no se guardará."
        confirmLabel="Descartar"
        cancelLabel="Seguir editando"
        onCancel={() => setIsDiscarding(false)}
        onConfirm={() => {
          setIsDiscarding(false);
          close();
        }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    gap: Spacing.two,
    padding: Spacing.three,
  },
  actions: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
});
