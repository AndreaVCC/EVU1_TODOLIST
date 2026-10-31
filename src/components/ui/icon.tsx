import { SymbolView } from 'expo-symbols';
import type { ColorValue } from 'react-native';

/** Cada icono usa SF Symbols en iOS y Material Symbols en Android y web. */
const ICONS = {
  add: { ios: 'plus', android: 'add', web: 'add' },
  celebrate: { ios: 'party.popper', android: 'celebration', web: 'celebration' },
  check: { ios: 'checkmark', android: 'check', web: 'check' },
  checkCircle: { ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' },
  close: { ios: 'xmark', android: 'close', web: 'close' },
  contrast: { ios: 'circle.lefthalf.filled', android: 'contrast', web: 'contrast' },
  delete: { ios: 'trash', android: 'delete', web: 'delete' },
  deleteAll: { ios: 'trash.circle', android: 'delete_sweep', web: 'delete_sweep' },
  doneAll: { ios: 'checklist.checked', android: 'done_all', web: 'done_all' },
  edit: { ios: 'pencil', android: 'edit', web: 'edit' },
  error: { ios: 'exclamationmark.circle', android: 'error', web: 'error' },
  inbox: { ios: 'tray', android: 'inbox', web: 'inbox' },
  list: { ios: 'list.bullet', android: 'format_list_bulleted', web: 'format_list_bulleted' },
  more: { ios: 'ellipsis', android: 'more_vert', web: 'more_vert' },
  newest: { ios: 'arrow.down', android: 'arrow_downward', web: 'arrow_downward' },
  oldest: { ios: 'arrow.up', android: 'arrow_upward', web: 'arrow_upward' },
  pending: { ios: 'clock', android: 'schedule', web: 'schedule' },
  save: { ios: 'checkmark', android: 'save', web: 'save' },
  settings: { ios: 'gearshape', android: 'settings', web: 'settings' },
  summary: { ios: 'chart.pie.fill', android: 'pie_chart', web: 'pie_chart' },
  tasks: { ios: 'checklist', android: 'checklist', web: 'checklist' },
} as const;

export type IconName = keyof typeof ICONS;

type IconProps = {
  name: IconName;
  color: ColorValue;
  size?: number;
};

export function Icon({ name, color, size = 24 }: IconProps) {
  return <SymbolView name={ICONS[name]} tintColor={color} size={size} />;
}
