import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Colors from '@/src/constants/Colors';
import { useColorScheme } from '@/src/components/useColorScheme';

export default function PrivacyScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Privacy Policy</Text>
        <Text style={[styles.warning, { color: colors.tint }]}>
          Draft v0.1 — For legal review only. Not for publication.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>What We Collect</Text>
        <Text style={[styles.bodyText, { color: colors.text }]}>
          We collect account information (email), the content you create (reflections, entries, Strengths), 
          basic usage data, and your subscription status.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>How We Protect It</Text>
        <Text style={[styles.bodyText, { color: colors.text }]}>
          All data is encrypted in transit (TLS) and at rest using infrastructure-level encryption. 
          Row Level Security ensures only you can access your data.
        </Text>
        <Text style={[styles.bodyText, { color: colors.text, fontWeight: '600' }]}>
          Note: Entry content is not currently protected by field-level encryption. 
          Authorized personnel could technically access content for support or legal reasons.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>What We Never Do</Text>
        <Text style={[styles.bodyText, { color: colors.text }]}>
          We never sell your data, use advertising, use your content to train AI without 
          explicit consent, or share your entries with other users.
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Control</Text>
        <Text style={[styles.bodyText, { color: colors.text }]}>
          You can delete your account and data at any time from Settings.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  warning: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 25,
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
  },
});
