import { useState, type Ref } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type TextInputInstance,
  type TextInputProps,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { MinTouchTarget, Radius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/context/theme-context';

type TextFieldProps = Omit<TextInputProps, 'value' | 'style'> & {
  label: string;
  value: string;
  error?: string;
  ref?: Ref<TextInputInstance>;
};

export function TextField({ label, value, error, maxLength, ref, ...rest }: TextFieldProps) {
  const { colors: theme, isDark } = useAppTheme();
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = error ? theme.danger : isFocused ? theme.primary : theme.borderStrong;

  return (
    <View style={styles.field}>
      <ThemedText type="label">
        {label} <ThemedText type="label" themeColor="danger">*</ThemedText>
      </ThemedText>
      <TextInput
        ref={ref}
        value={value}
        maxLength={maxLength}
        accessibilityLabel={`${label}, obligatorio`}
        accessibilityHint={error}
        aria-invalid={Boolean(error)}
        placeholderTextColor={theme.textSecondary}
        selectionColor={theme.primary}
        keyboardAppearance={isDark ? 'dark' : 'light'}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={[
          styles.input,
          rest.multiline && styles.multiline,
          { color: theme.text, backgroundColor: theme.surfaceSolid, borderColor },
          (isFocused || error) && styles.inputEmphasis,
        ]}
        {...rest}
      />
      <View style={styles.footer}>
        <View style={styles.error} aria-live="polite">
          {error && (
            <>
              <Icon name="error" color={theme.danger} size={16} />
              <ThemedText type="caption" themeColor="danger" style={styles.errorText}>
                {error}
              </ThemedText>
            </>
          )}
        </View>
        {maxLength !== undefined && (
          <ThemedText type="caption" themeColor="textSecondary">
            {value.length}/{maxLength}
          </ThemedText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: Spacing.two,
  },
  input: {
    minHeight: MinTouchTarget,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderWidth: 1,
    borderRadius: Radius.medium,
    fontSize: 16,
    lineHeight: 24,
  },
  inputEmphasis: {
    borderWidth: 2,
  },
  multiline: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.three,
    minHeight: 18,
  },
  error: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  errorText: {
    flexShrink: 1,
  },
});
