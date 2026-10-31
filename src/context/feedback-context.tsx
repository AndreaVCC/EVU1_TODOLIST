import { createContext, use, useEffect, useState, type PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const SNACKBAR_DURATION = 3000;
/** Deja el mensaje por encima de la barra de pestañas y del botón flotante. */
const SNACKBAR_BOTTOM_OFFSET = 148;

type Message = { id: number; text: string };

const FeedbackContext = createContext<((text: string) => void) | null>(null);

export function FeedbackProvider({ children }: PropsWithChildren) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState<Message | null>(null);

  const showMessage = (text: string) => setMessage({ id: Date.now(), text });

  useEffect(() => {
    if (!message) return;
    const timeout = setTimeout(() => setMessage(null), SNACKBAR_DURATION);
    return () => clearTimeout(timeout);
  }, [message]);

  return (
    <FeedbackContext value={showMessage}>
      {children}
      <View
        pointerEvents="none"
        style={[styles.container, { bottom: insets.bottom + SNACKBAR_BOTTOM_OFFSET }]}>
        {message && (
          <Animated.View
            key={message.id}
            entering={FadeInDown.duration(200)}
            exiting={FadeOutDown.duration(200)}
            aria-live="polite"
            accessibilityRole="alert"
            style={[styles.snackbar, { backgroundColor: theme.snackbar }]}>
            <ThemedText type="label" themeColor="onSnackbar">
              {message.text}
            </ThemedText>
          </Animated.View>
        )}
      </View>
    </FeedbackContext>
  );
}

export function useFeedback() {
  const showMessage = use(FeedbackContext);
  if (!showMessage) throw new Error('useFeedback debe usarse dentro de FeedbackProvider');
  return showMessage;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
  },
  snackbar: {
    width: '100%',
    maxWidth: MaxContentWidth - Spacing.five,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    borderRadius: Radius.medium,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
  },
});
