import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { CONTENT } from '@/src/constants/Content';
import { LighthousePaper, LighthouseRadii, LighthouseFonts } from '@/src/constants/LighthouseTheme';
import { useColorScheme } from '@/src/components/useColorScheme';
import { supabase } from '@/src/api/supabase';

export default function SettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = LighthousePaper[colorScheme === 'dark' ? 'dark' : 'light'];
  const [tier, setTier] = useState<'free' | 'plus' | 'founding_supporter'>('free');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchTier() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('subscriptions')
          .select('tier')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows found
        if (data) setTier((data as { tier: 'free' | 'plus' | 'founding_supporter' }).tier);
      } catch (e) {
        console.error('Error fetching tier:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchTier();
  }, []);

  const handleSupportPress = async () => {
    // Purchase flow is not yet wired to a live App Store/Play Store
    // product (tracked in 12-roadmap.md's Release Gate). This is
    // intentionally honest rather than simulating a fake purchase —
    // per ADR-002, nothing about pricing should ever feel unclear.
    Alert.alert(
      'Support Lighthouse',
      "This is almost ready. We'll let you know the moment it's here."
    );
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'Are you absolutely sure? This will permanently delete all your entries and strengths. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              const { error } = await supabase.rpc('delete_user_account');
              if (error) throw error;

              await supabase.auth.signOut();
              router.replace('/onboarding');
            } catch (e) {
              console.error('Error deleting account:', e);
              Alert.alert('Error', 'Could not delete account. Please try again later.');
            } finally {
              setDeleting(false);
            }
          }
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>Notifications</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow }]}>
          <View style={styles.row}>
            <Link href="/privacy" style={[styles.label, { color: colors.oceanAccent }]}>Privacy Policy</Link>
            <Text style={[styles.label, { color: colors.secondaryText }]}>{CONTENT.settings.version}</Text>
          </View>
          <View style={styles.row}>
            <Link href="/terms" style={[styles.label, { color: colors.oceanAccent }]}>Terms of Service</Link>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>Subscription</Text>

        <View style={[styles.tierCard, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow }]}>
          <Text style={[styles.tierLabel, { color: colors.secondaryText }]}>{CONTENT.settings.subscription.label}</Text>
          <Text style={[styles.tierValue, { color: colors.text, fontFamily: LighthouseFonts.heading }]}>
            {loading ? 'Loading...' : tier.charAt(0).toUpperCase() + tier.slice(1)}
          </Text>
        </View>

        <Pressable
          style={[styles.supportButton, { backgroundColor: colors.sage }]}
          onPress={handleSupportPress}
        >
          <Text style={styles.supportButtonText}>{CONTENT.settings.subscription.supportButton}</Text>
        </Pressable>

        <Text style={[styles.supportNote, { color: colors.secondaryText }]}>
          {CONTENT.settings.subscription.supportNote}
        </Text>

        <Text style={[styles.comingSoonNote, { color: colors.secondaryText }]}>
          Lighthouse+ is on its way — deeper reflection tools, built the
          same quiet way as everything here. No rush; we'll let you know.
        </Text>
      </View>

      <View style={[styles.section, { marginTop: 20 }]}>
        <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>Danger Zone</Text>
        <Pressable
          style={[styles.deleteButton, { borderColor: colors.dangerAccent, opacity: deleting ? 0.5 : 1 }]}
          onPress={handleDeleteAccount}
          disabled={deleting}
        >
          {deleting ? (
            <ActivityIndicator color={colors.dangerAccent} />
          ) : (
            <Text style={[styles.deleteButtonText, { color: colors.dangerAccent }]}>Delete Account & Data</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: LighthouseRadii.card,
    padding: 6,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  label: {
    fontSize: 17,
  },
  tierCard: {
    padding: 22,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: LighthouseRadii.card,
    alignItems: 'center',
    marginBottom: 16,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 1,
  },
  tierLabel: {
    fontSize: 14,
    marginBottom: 6,
  },
  tierValue: {
    fontSize: 24,
  },
  supportButton: {
    padding: 15,
    borderRadius: 14,
    alignItems: 'center',
  },
  supportButtonText: {
    color: '#2F3A45',
    fontSize: 16,
    fontWeight: '600',
  },
  supportNote: {
    marginTop: 12,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  comingSoonNote: {
    marginTop: 20,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    fontStyle: 'italic',
    opacity: 0.8,
  },
  deleteButton: {
    padding: 15,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
