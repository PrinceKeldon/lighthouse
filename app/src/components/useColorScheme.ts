import { useColorScheme as useColorSchemeCore } from 'react-native';

// react-native's ColorSchemeName is 'light' | 'dark' | null | undefined —
// it no longer includes the old Android-only 'unspecified' value, and
// callers throughout the app (Colors[colorScheme], LighthousePaper[colorScheme])
// need a guaranteed 'light' | 'dark' rather than something nullable.
export const useColorScheme = (): 'light' | 'dark' => {
  const coreScheme = useColorSchemeCore();
  return coreScheme === 'dark' ? 'dark' : 'light';
};
