import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, Pressable, ActivityIndicator, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { CONTENT } from '@/src/constants/Content';
import { useColorScheme } from '@/src/components/useColorScheme';
import { supabase } from '@/src/api/supabase';

export default function SettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
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
    // STUBBED: In a real app, this would trigger the native IAP flow.
    // For Milestone 0, we just log the attempt and simulate a successful upgrade
    // to verify the UI state change.
    console.log('Initiating IAP flow for Lighthouse Plus...');
    alert('This would now trigger the App Store / Play Store purchase flow.');
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
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Notifications</Text>
        <View style={styles.row}>
          <Link href="/privacy" style={[styles.label, { color: colors.tint }]}>Privacy Policy</Link>
          <Text style={[styles.label, { color: colors.text }]}>{CONTENT.settings.version}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Subscription</Text>
        
          <View style={styles.tierCard}>
            <Text style={[styles.tierLabel, { color: colors.text }]}>{CONTENT.settings.subscription.label}</Text>
            <Text style={[styles.tierValue, { color: colors.tint }]}>
              {loading ? 'Loading...' : tier.charAt(0).toUpperCase() + tier.slice(1)}
            </Text>
          </View>

          <Pressable 
            style={[styles.supportButton, { backgroundColor: colors.tint }]} 
            onPress={handleSupportPress}
          >
            <Text style={styles.supportButtonText}>{CONTENT.settings.subscription.supportButton}</Text>
          </Pressable>

          <Text style={[styles.supportNote, { color: colors.text }]}>
            {CONTENT.settings.subscription.supportNote}
          </Text>

      </View>

      <View style={[styles.section, { marginTop: 40 }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Danger Zone</Text>
        <Pressable 
          style={[styles.deleteButton, { borderColor: colors.text, opacity: deleting ? 0.5 : 1 }]} 
          onPress={handleDeleteAccount}
          disabled={deleting}
        >
          {deleting ? (
            <ActivityIndicator color={colors.text} />
          ) : (
            <Text style={[styles.deleteButtonText, { color: colors.text }]}>Delete Account & Data</Text>
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
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 15,
    opacity: 0.5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  label: {
    fontSize: 18,
  },
  tierCard: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.03)',
    alignItems: 'center',
    marginBottom: 20,
  },
  tierLabel: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 4,
  },
  tierValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  supportButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  supportButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  supportNote: {
    marginTop: 12,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.7,
  },
  deleteButton: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
