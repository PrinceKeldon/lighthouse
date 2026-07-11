import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { useColorScheme } from '@/src/components/useColorScheme';
import { useEntries } from '@/src/hooks/useEntries';

export default function OnboardingScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [entry, setEntry] = useState('');
  const { createEntry, loading } = useEntries();

  const handleComplete = async () => {
    const result = await createEntry(entry, undefined, 'onboarding_prompt');
    if (result.success) {
      router.replace('/(tabs)');
    } else {
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.prompt, { color: colors.text }]}>
          What's one thing you've done, even once, that you're quietly proud of?
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
          style={[styles.button, { backgroundColor: colors.tint, opacity: loading ? 0.7 : 1 }]} 
          onPress={handleComplete}
          disabled={!entry.trim() || loading}
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
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    fontSize: 18,
    minHeight: 120,
    textAlignVertical: 'top',
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
