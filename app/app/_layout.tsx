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
  // instead of welcome. Android doesn't have this mechanism.
  //
  // IMPORTANT: usePathname() can be empty/unresolved on the very first
  // render, before Expo Router finishes resolving the actual route. This
  // effect deliberately depends on [pathname] and waits for a genuinely
  // non-empty value before deciding anything — marking "checked" too
  // early (on an empty pathname) would permanently skip the real check.
  // Also: only /welcome itself is whitelisted. '/' is NOT excluded,
  // since the tabs index route (Today) may itself resolve to '/'.
  useEffect(() => {
    if (hasCheckedInitialRoute.current) return;
    if (!pathname) return;

    hasCheckedInitialRoute.current = true;

    if (pathname !== '/welcome') {
      router.replace('/welcome');
    }
  }, [pathname]);

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
