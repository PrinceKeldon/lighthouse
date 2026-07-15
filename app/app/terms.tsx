import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LighthousePaper, LighthouseFonts } from '@/src/constants/LighthouseTheme';
import { useColorScheme } from '@/src/components/useColorScheme';

export default function TermsScreen() {
  const colorScheme = useColorScheme();
  const colors = LighthousePaper[colorScheme === 'dark' ? 'dark' : 'light'];

  const H = (text: string) => (
    <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: LighthouseFonts.headingMedium }]}>{text}</Text>
  );
  const P = (text: string) => (
    <Text style={[styles.bodyText, { color: colors.text }]}>{text}</Text>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text, fontFamily: LighthouseFonts.heading }]}>Terms of Service</Text>

        {H('Description of Service')}
        {P('Lighthouse is a wellbeing app operated by KeldonTech that provides daily affirmations, personal reflection tools, and a personal record of Strengths you build over time. Lighthouse is not a medical device and does not provide medical, psychiatric, or crisis intervention services.')}

        {H('Your Content')}
        {P('You retain full ownership of everything you write in Lighthouse. We do not claim ownership over your personal content, and we process it only as described in our Privacy Policy.')}

        {H('Acceptable Use')}
        {P("You agree not to use the app unlawfully, attempt to access other users' data or Lighthouse's systems without authorization, or interfere with the app's infrastructure.")}

        {H('Subscriptions')}
        {P("Where Lighthouse offers Lighthouse Plus, billing is handled through Apple's or Google's in-app purchase systems and is subject to their respective terms.")}

        {H('Disclaimers')}
        {P('Lighthouse is provided "as is," without warranties of any kind. Lighthouse is not a substitute for professional medical or psychological care. If you are experiencing a medical or mental health emergency, contact your local emergency services immediately.')}

        {H('Changes to These Terms')}
        {P('We may update these Terms as Lighthouse evolves, and will notify users in-app of material changes.')}

        {H('Contact')}
        {P('KeldonTech — support@keldontech.online')}

        <Text style={[styles.fullVersionNote, { color: colors.secondaryText }]}>
          For the complete Terms of Service, visit keldontech.online/lighthouse.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, marginBottom: 26, textAlign: 'center' },
  sectionTitle: { fontSize: 20, marginTop: 25, marginBottom: 10 },
  bodyText: { fontSize: 16, lineHeight: 24, marginBottom: 10 },
  fullVersionNote: { fontSize: 13, textAlign: 'center', marginTop: 30, fontStyle: 'italic' },
});
