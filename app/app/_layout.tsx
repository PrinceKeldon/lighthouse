import { useFonts } from 'expo-font';
import {
  Newsreader_400Regular,
  Newsreader_400Regular_Italic,
  Newsreader_500Medium,
  Newsreader_600SemiBold,
} from '@expo-google-fonts/newsreader';
import { Stack } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/src/components/useColorScheme';
import { LighthousePaper, LighthouseFonts } from '@/src/constants/LighthouseTheme';
import { ensureSession } from '@/src/api/supabase';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'onboarding',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Newsreader_400Regular,
    Newsreader_400Regular_Italic,
    Newsreader_500Medium,
    Newsreader_600SemiBold,
  });
  const [sessionReady, setSessionReady] = useState(false);
  const [sessionError, setSessionError] = useState<Error | null>(null);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // A session (anonymous, per src/api/supabase.ts's ensureSession) has to
  // exist before onboarding or any data screen mounts — otherwise
  // findOrCreateStrength/createEntry fail with "User not authenticated."
  useEffect(() => {
    ensureSession()
      .then(() => setSessionReady(true))
      .catch((e) => setSessionError(e));
  }, []);

  useEffect(() => {
    if (loaded && (sessionReady || sessionError)) {
      SplashScreen.hideAsync();
    }
  }, [loaded, sessionReady, sessionError]);

  if (!loaded || (!sessionReady && !sessionError)) {
    return null;
  }

  if (sessionError) {
    throw sessionError;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const colors = LighthousePaper[colorScheme === 'dark' ? 'dark' : 'light'];

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="privacy"
          options={{
            title: 'Privacy Policy',
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.oceanAccent,
            headerTitleStyle: { color: colors.text, fontFamily: LighthouseFonts.headingMedium },
            headerShadowVisible: false,
          }}
        />
        {/* modal.tsx renders its own header (title + Close), so the native
            one is hidden here to avoid a duplicate title bar. */}
        <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
