import { Pressable, StyleSheet, type ColorValue } from 'react-native';

import { Icon, type IconName } from '@/components/ui/icon';
import { MinTouchTarget, PressedOpacity, Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type IconButtonProps = {
  icon: IconName;
  /** Describe la acción para lectores de pantalla, porque el botón no tiene texto visible. */
  label: string;
  color: ColorValue;
  onPress: () => void;
};

export function IconButton({ icon, label, color, onPress }: IconButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      android_ripple={{ color: theme.ripple, borderless: true, radius: MinTouchTarget / 2 }}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <Icon name={icon} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: MinTouchTarget,
    height: MinTouchTarget,
    borderRadius: Radius.full,
  },
  pressed: {
    opacity: PressedOpacity,
  },
});
