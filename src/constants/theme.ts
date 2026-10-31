/**
 * Medidas compartidas de la interfaz: espaciado en una misma escala, radios y tamaños
 * táctiles. Los colores de cada tema están en `themes.ts`.
 */

import '@/global.css';

import { Platform, type ViewStyle } from 'react-native';

import type { ThemeColors } from '@/constants/themes';

export type ThemeColor = keyof ThemeColors;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  small: 8,
  medium: 12,
  large: 20,
  full: 999,
} as const;

/** Área táctil mínima recomendada por Material Design (48) y Apple (44). */
export const MinTouchTarget = 48;
export const MaxContentWidth = 640;

/** Android muestra el efecto ripple de Material Design; iOS y web atenúan el elemento. */
export const PressedOpacity = Platform.OS === 'android' ? 1 : 0.7;

/** Degradado lineal: la propiedad tiene un nombre distinto en web y en las apps nativas. */
export function linearGradient(angle: number, from: string, to: string) {
  const image = `linear-gradient(${angle}deg, ${from}, ${to})`;
  return (
    Platform.OS === 'web' ? { backgroundImage: image } : { experimental_backgroundImage: image }
  ) as ViewStyle;
}
