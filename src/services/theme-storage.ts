import AsyncStorage from '@react-native-async-storage/async-storage';

import { THEME_OPTIONS, type ThemePreference } from '@/constants/themes';

const STORAGE_KEY = 'todolist:theme';

export async function loadThemePreference(): Promise<ThemePreference | null> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  const option = THEME_OPTIONS.find(({ value }) => value === stored);
  return option?.value ?? null;
}

export async function saveThemePreference(preference: ThemePreference) {
  await AsyncStorage.setItem(STORAGE_KEY, preference);
}
