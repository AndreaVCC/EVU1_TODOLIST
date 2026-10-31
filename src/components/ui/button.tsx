import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import {
  MinTouchTarget,
  PressedOpacity,
  Radius,
  Spacing,
  type ThemeColor,
} from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

type ButtonProps = Omit<PressableProps, 'style' | 'children'> & {
  label: string;
  icon?: IconName;
  variant?: ButtonVariant;
};

const VARIANTS: Record<ButtonVariant, { background: ThemeColor; content: ThemeColor }> = {
  primary: { background: 'primary', content: 'onPrimary' },
  secondary: { background: 'primarySoft', content: 'onPrimarySoft' },
  danger: { background: 'danger', content: 'onDanger' },
};

export function Button({ label, icon, variant = 'primary', ...rest }: ButtonProps) {
  const theme = useTheme();
  const { background, content } = VARIANTS[variant];

  return (
    <Pressable
      accessibilityRole="button"
      android_ripple={{ color: theme.ripple }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: theme[background] },
        pressed && styles.pressed,
      ]}
      {...rest}>
      {icon && <Icon name={icon} color={theme[content]} size={20} />}
      <ThemedText type="title" themeColor={content}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    minHeight: MinTouchTarget,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.medium,
    overflow: 'hidden',
  },
  pressed: {
    opacity: PressedOpacity,
  },
});
