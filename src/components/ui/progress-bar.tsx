import { StyleSheet, View, type ColorValue } from 'react-native';

import { Radius } from '@/constants/theme';

type ProgressBarProps = {
  /** Porcentaje de avance, de 0 a 100. */
  value: number;
  color: ColorValue;
  trackColor: ColorValue;
};

export function ProgressBar({ value, color, trackColor }: ProgressBarProps) {
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel="Avance de tareas"
      accessibilityValue={{ min: 0, max: 100, now: value }}
      style={[styles.track, { backgroundColor: trackColor }]}>
      <View style={[styles.fill, { width: `${value}%`, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radius.full,
  },
});
