import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { CONTENT } from '@/src/constants/Content';
import { LighthousePaper, LighthouseFonts } from '@/src/constants/LighthouseTheme';
import { useColorScheme } from '@/src/components/useColorScheme';
import { useEntries } from '@/src/hooks/useEntries';
import { hasCompletedOnboarding } from '@/src/api/supabase';
import { LighthouseMark } from '@/src/components/LighthouseMark';

// Light starter suggestions only — per 06-user-journeys.md, the app
// offers a few gentle tags or the user names their own. Never a full
// category picker; this is not configuration, it's a light nudge after
// the entry itself has already been written.
const STARTER_SUGGESTIONS = ['Courage', 'Patience', 'Showing Up'];

export default function OnboardingScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = LighthousePaper[colorScheme === 'dark' ? 'dark' : 'light'];
  const [checkingReturningUser, setCheckingReturningUser] = useState(true);
  const [step, setStep] = useState<'entry' | 'strength'>('entry');
  const [entry, setEntry] = useState('');
  const [strengthName, setStrengthName] = useState('');
  const { createEntry, findOrCreateStrength, loading } = useEntries();

  // Onboarding is a one-time Day 1 flow, not something re-triggered every
  // launch. A returning user (same persisted session) goes straight to
  // Today instead — this also prevents creating a duplicate orphaned
  // entry/Strength every time the app reopens.
  useEffect(() => {
    hasCompletedOnboarding().then((done) => {
      if (done) {
        router.replace('/(tabs)');
      } else {
        setCheckingReturningUser(false);
      }
    });
  }, []);

  if (checkingReturningUser) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.oceanAccent} />
      </View>
    );
  }

  const handleContinueToStrength = () => {
    if (!entry.trim()) return;
    setStep('strength');
  };

  const handleComplete = async () => {
    if (!strengthName.trim()) return;

    const strengthResult = await findOrCreateStrength(strengthName);
    if (!strengthResult.success || !strengthResult.strength) {
      Alert.alert('', "That didn't save — mind trying again in a moment?");
      return;
    }

    const result = await createEntry(entry, strengthResult.strength.id, 'onboarding_prompt');
    if (result.success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('', "That didn't save — mind trying again in a moment?");
    }
  };

  if (step === 'entry') {
    return (
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[styles.content, { flexGrow: 1, justifyContent: 'center' }]}
          keyboardShouldPersistTaps="handled"
        >
          <LighthouseMark color={colors.oceanAccent} />
          <Text style={[styles.prompt, { color: colors.text, fontFamily: LighthouseFonts.quote }]}>
            {CONTENT.onboarding.prompt}
          </Text>

          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
            placeholder="Write it here..."
            placeholderTextColor={colors.secondaryText}
            multiline
            value={entry}
            onChangeText={setEntry}
          />

          <Pressable
            style={[styles.button, { backgroundColor: colors.sage, opacity: !entry.trim() ? 0.5 : 1 }]}
            onPress={handleContinueToStrength}
            disabled={!entry.trim()}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.content, { flexGrow: 1, justifyContent: 'center' }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.prompt, { color: colors.text, fontFamily: LighthouseFonts.headingMedium }]}>
          What does this say about you?
        </Text>
        <Text style={[styles.subtext, { color: colors.secondaryText }]}>
          Pick one, or name your own.
        </Text>

        <View style={styles.chipRow}>
          {STARTER_SUGGESTIONS.map((suggestion) => (
            <Pressable
              key={suggestion}
              style={[
                styles.chip,
                {
                  borderColor: colors.oceanAccent,
                  backgroundColor: strengthName === suggestion ? colors.sage : 'transparent',
                },
              ]}
              onPress={() => setStrengthName(suggestion)}
            >
              <Text style={{ color: strengthName === suggestion ? '#2F3A45' : colors.oceanAccent }}>
                {suggestion}
              </Text>
            </Pressable>
          ))}
        </View>

        <TextInput
          style={[styles.input, styles.strengthInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
          placeholder="Or name your own..."
          placeholderTextColor={colors.secondaryText}
          value={strengthName}
          onChangeText={setStrengthName}
        />

        <Pressable
          style={[styles.button, { backgroundColor: colors.sage, opacity: loading || !strengthName.trim() ? 0.7 : 1 }]}
          onPress={handleComplete}
          disabled={!strengthName.trim() || loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Continue</Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    gap: 20,
    padding: 30,
    alignItems: 'stretch',
  },
  prompt: {
    fontSize: 24,
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 20,
  },
  subtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: -15,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    padding: 15,
    fontSize: 18,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  strengthInput: {
    minHeight: 50,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  chip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  button: {
    padding: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#2F3A45',
    fontSize: 18,
    fontWeight: '600',
  },
});
