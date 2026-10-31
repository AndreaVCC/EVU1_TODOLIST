import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { MinTouchTarget, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ActionMenuItem = {
  key: string;
  label: string;
  icon: IconName;
  onPress: () => void;
  selected?: boolean;
  disabled?: boolean;
  destructive?: boolean;
  /** Dibuja una línea sobre la opción para separar grupos de acciones. */
  separated?: boolean;
};

type ActionMenuProps = {
  visible: boolean;
  items: ActionMenuItem[];
  onClose: () => void;
};

export function ActionMenu({ visible, items, onClose }: ActionMenuProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      transparent
      statusBarTranslucent
      navigationBarTranslucent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      <Pressable
        accessibilityLabel="Cerrar menú"
        onPress={onClose}
        style={[StyleSheet.absoluteFill, { backgroundColor: theme.scrim }]}
      />
      <View
        accessibilityRole="menu"
        style={[
          styles.menu,
          { top: insets.top + Spacing.two, backgroundColor: theme.surfaceSolid },
        ]}>
        {items.map((item) => {
          const color = item.destructive ? theme.danger : theme.text;

          return (
            <Pressable
              key={item.key}
              accessibilityRole="menuitem"
              aria-selected={item.selected}
              aria-disabled={item.disabled}
              disabled={item.disabled}
              android_ripple={{ color: theme.ripple }}
              onPress={() => {
                onClose();
                item.onPress();
              }}
              style={({ pressed }) => [
                styles.item,
                item.separated && [styles.separated, { borderTopColor: theme.border }],
                pressed && { backgroundColor: theme.surfaceMuted },
                item.disabled && styles.disabled,
              ]}>
              <Icon name={item.icon} color={color} size={22} />
              <ThemedText style={[styles.label, { color }]}>{item.label}</ThemedText>
              {item.selected && <Icon name="check" color={theme.primary} size={20} />}
            </Pressable>
          );
        })}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    right: Spacing.two,
    width: 300,
    maxWidth: '94%',
    paddingVertical: Spacing.two,
    borderRadius: Radius.medium,
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    minHeight: MinTouchTarget,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  separated: {
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: Spacing.one,
    paddingTop: Spacing.three,
  },
  label: {
    flex: 1,
  },
  disabled: {
    opacity: 0.45,
  },
});
