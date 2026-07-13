import { useFonts } from 'expo-font';
import {
  Newsreader_400Regular,
  Newsreader_400Regular_Italic,
  Newsreader_500Medium,
  Newsreader_600SemiBold,
} from '@expo-google-fonts/newsreader';
import { Stack, usePathname, useRouter } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/src/components/useColorScheme';
import { LighthousePaper, LighthouseFonts } from '@/src/constants/LighthouseTheme';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'welcome',
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

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // Session bootstrap (ensureSession) used to block here, showing a
  // blank screen while it resolved. It now happens inside welcome.tsx
  // instead, in parallel with the branding being visible — the native
  // splash only needs to wait for fonts, not the network round-trip.
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const colors = LighthousePaper[colorScheme === 'dark' ? 'dark' : 'light'];
  const pathname = usePathname();
  const router = useRouter();
  const hasCheckedInitialRoute = useRef(false);

  // iOS can hand the app an "initial URL" on launch based on its own
  // native state restoration (Scene lifecycle), independent of whether
  // the process was actually force-quit — this can override
  // initialRouteName and land directly on a previous screen (e.g. Today)
  // instead of welcome. Android doesn't have this mechanism, which is
  // why this was only reproducible on iOS. This runs exactly once, on
  // the very first mount, and does nothing on any navigation after that
  // — it should never interrupt normal in-session use.
  useEffect(() => {
    if (hasCheckedInitialRoute.current) return;
    hasCheckedInitialRoute.current = true;

    if (pathname && pathname !== '/welcome' && pathname !== '/') {
      router.replace('/welcome');
    }
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
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
