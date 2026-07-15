import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LighthousePaper, LighthouseFonts } from '@/src/constants/LighthouseTheme';
import { useColorScheme } from '@/src/components/useColorScheme';

export default function PrivacyScreen() {
  const colorScheme = useColorScheme();
  const colors = LighthousePaper[colorScheme === 'dark' ? 'dark' : 'light'];

  const H = (text: string) => (
    <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: LighthouseFonts.headingMedium }]}>{text}</Text>
  );
  const P = (text: string, bold = false) => (
    <Text style={[styles.bodyText, { color: colors.text }, bold && { fontWeight: '600' }]}>{text}</Text>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text, fontFamily: LighthouseFonts.heading }]}>Privacy Policy</Text>
        <Text style={[styles.updated, { color: colors.secondaryText }]}>Effective Date: 15 July 2026</Text>

        {P('Lighthouse is a wellbeing app developed by KeldonTech to help people build a healthier relationship with themselves through daily affirmations, personal reflection, and a growing record of their own Strengths.')}
        {P('Your thoughts belong to you. We do not sell your personal information, use your entries to build advertising profiles, or monetize your personal reflections.')}

        {H('Information We Collect')}
        {P('Account information (email, authentication details) if you create an account.')}
        {P('Your content: the daily reflections and entries you write, and the personal Strengths you build evidence for over time.')}
        {P('Limited technical information (device type, app version, crash reports) to keep Lighthouse reliable — never the content of what you write.')}

        {H('How We Protect It')}
        {P('All data in transit is encrypted (TLS). Data at rest is protected by infrastructure-level encryption and strict per-account access controls — your entries and Strengths are never visible to other users.')}
        {P("Entry content is not currently protected by additional field-level encryption beyond these measures. This means authorized KeldonTech personnel could technically access entry content if required for support, security, or legal purposes. We are actively working toward stronger, field-level protection and will update this policy — and notify you in-app — the moment that ships.", true)}

        {H('What We Never Do')}
        {P('We never sell your data, use advertising, or share your entries with other users under any circumstance.')}

        {H('Your Control')}
        {P('You can permanently delete your account and all associated data at any time from Settings — this is immediate, not delayed. If you no longer have the app installed, visit our Account & Data Deletion page at keldontech.online/lighthouse.')}
        {P('Data export is not yet available. We will update this policy when it is.')}

        {H('Questions')}
        {P('Contact us at support@keldontech.online, or see the full policy at keldontech.online/lighthouse.')}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, marginBottom: 4, textAlign: 'center' },
  updated: { fontSize: 13, textAlign: 'center', marginBottom: 26 },
  sectionTitle: { fontSize: 20, marginTop: 25, marginBottom: 10 },
  bodyText: { fontSize: 16, lineHeight: 24, marginBottom: 10 },
});
