import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { LighthousePaper, LighthouseFonts } from '@/src/constants/LighthouseTheme';
import { useColorScheme } from '@/src/components/useColorScheme';
import { LighthouseMark } from '@/src/components/LighthouseMark';
import { ensureSession } from '@/src/api/supabase';

// Kept intentionally simple: a warm minimum display time, not a hard
// requirement — someone in a hurry can tap through immediately. The
// session bootstrap (previously blocking at the root layout level) now
// happens here, in parallel with the branding being visible, rather than
// as a blank screen before anything renders.
const MIN_DISPLAY_MS = 2800;

export default function WelcomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = LighthousePaper[colorScheme === 'dark' ? 'dark' : 'light'];

  const fade = useRef(new Animated.Value(0)).current;
  const [minDisplayElapsed, setMinDisplayElapsed] = useState(false);
  const [sessionSettled, setSessionSettled] = useState(false);
  const navigatedRef = useRef(false);

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 700, useNativeDriver: true }).start();

    const timer = setTimeout(() => setMinDisplayElapsed(true), MIN_DISPLAY_MS);

    // Resolve either way — onboarding.tsx's own hasCompletedOnboarding
    // check already fails safe toward showing onboarding if there's no
    // session, so a session error here shouldn't block navigation.
    ensureSession()
      .catch((e) => console.error('Session bootstrap failed:', e))
      .finally(() => setSessionSettled(true));

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (navigatedRef.current) return;
    if (minDisplayElapsed && sessionSettled) {
      navigatedRef.current = true;
      router.replace('/onboarding');
    }
  }, [minDisplayElapsed, sessionSettled]);

  return (
    <Pressable
      style={[styles.container, { backgroundColor: colors.background }]}
      onPress={() => setMinDisplayElapsed(true)}
    >
      <Animated.View style={{ opacity: fade, alignItems: 'center' }}>
        <LighthouseMark color={colors.oceanAccent} scale={4} />
        <Text style={[styles.title, { color: colors.text, fontFamily: LighthouseFonts.heading }]}>
          LIGHTHOUSE
        </Text>
        <Text
          style={[styles.tagline, { color: colors.secondaryText, fontFamily: LighthouseFonts.quote }]}
        >
          A quiet place to remember what you already know.
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  title: {
    fontSize: 32,
    letterSpacing: 6,
    marginTop: 26,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 17,
    lineHeight: 26,
    textAlign: 'center',
    marginTop: 16,
    maxWidth: 280,
  },
});
