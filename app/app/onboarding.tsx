import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { CONTENT } from '@/src/constants/Content';
import { useColorScheme } from '@/src/components/useColorScheme';
import { useEntries } from '@/src/hooks/useEntries';

// Light starter suggestions only — per 06-user-journeys.md, the app
// offers a few gentle tags or the user names their own. Never a full
// category picker; this is not configuration, it's a light nudge after
// the entry itself has already been written.
const STARTER_SUGGESTIONS = ['Courage', 'Patience', 'Showing Up'];

export default function OnboardingScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [step, setStep] = useState<'entry' | 'strength'>('entry');
  const [entry, setEntry] = useState('');
  const [strengthName, setStrengthName] = useState('');
  const { createEntry, findOrCreateStrength, loading } = useEntries();

  const handleContinueToStrength = () => {
    if (!entry.trim()) return;
    setStep('strength');
  };

  const handleComplete = async () => {
    if (!strengthName.trim()) return;

    const strengthResult = await findOrCreateStrength(strengthName);
    if (!strengthResult.success || !strengthResult.strength) {
      alert('Something went wrong. Please try again.');
      return;
    }

    const result = await createEntry(entry, strengthResult.strength.id, 'onboarding_prompt');
    if (result.success) {
      router.replace('/(tabs)');
    } else {
      alert('Something went wrong. Please try again.');
    }
  };

  if (step === 'entry') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.content}>
          <Text style={[styles.prompt, { color: colors.text }]}>
            {CONTENT.onboarding.prompt}
          </Text>

          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.tabIconDefault }]}
            placeholder="Write it here..."
            placeholderTextColor={colors.tabIconDefault}
            multiline
            value={entry}
            onChangeText={setEntry}
          />

          <Pressable
            style={[styles.button, { backgroundColor: colors.tint, opacity: !entry.trim() ? 0.5 : 1 }]}
            onPress={handleContinueToStrength}
            disabled={!entry.trim()}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.prompt, { color: colors.text }]}>
          What does this say about you?
        </Text>
        <Text style={[styles.subtext, { color: colors.tabIconDefault }]}>
          Pick one, or name your own.
        </Text>

        <View style={styles.chipRow}>
          {STARTER_SUGGESTIONS.map((suggestion) => (
            <Pressable
              key={suggestion}
              style={[
                styles.chip,
                {
                  borderColor: colors.tint,
                  backgroundColor: strengthName === suggestion ? colors.tint : 'transparent',
                },
              ]}
              onPress={() => setStrengthName(suggestion)}
            >
              <Text style={{ color: strengthName === suggestion ? 'white' : colors.tint }}>
                {suggestion}
              </Text>
            </Pressable>
          ))}
        </View>

        <TextInput
          style={[styles.input, styles.strengthInput, { color: colors.text, borderColor: colors.tabIconDefault }]}
          placeholder="Or name your own..."
          placeholderTextColor={colors.tabIconDefault}
          value={strengthName}
          onChangeText={setStrengthName}
        />

        <Pressable
          style={[styles.button, { backgroundColor: colors.tint, opacity: loading || !strengthName.trim() ? 0.7 : 1 }]}
          onPress={handleComplete}
          disabled={!strengthName.trim() || loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Continue</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
  },
  content: {
    gap: 20,
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
    borderWidth: 1,
    borderRadius: 12,
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
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
