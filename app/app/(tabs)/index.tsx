import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, ActivityIndicator, Animated } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { CONTENT } from '@/src/constants/Content';
import { LighthousePaper, LighthouseRadii, LighthouseFonts, formatRelativeTime } from '@/src/constants/LighthouseTheme';
import { useColorScheme } from '@/src/components/useColorScheme';
import { useEntries } from '@/src/hooks/useEntries';
import { LighthouseMark } from '@/src/components/LighthouseMark';

type Lighthouse = { name: string; reminder: string; reflection: string };
type RememberEntry = { text: string; createdAt: string };

// Deterministic "Lighthouse of the day" — same seed + day-index approach
// the screen used for affirmations before, just applied to CONTENT.lighthouses
// so Today, Remember, and Evidence all speak about the same theme.
async function pickLighthouseOfDay(): Promise<Lighthouse> {
  let seed = await SecureStore.getItemAsync('install_seed');
  if (seed === null) {
    seed = Math.floor(Math.random() * 1000000).toString();
    await SecureStore.setItemAsync('install_seed', seed);
  }
  const installSeed = parseInt(seed, 10);

  const epoch = new Date('2026-01-01T00:00:00Z');
  const now = new Date();
  const dayIndex = Math.floor((now.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24));

  const lighthouses = CONTENT.lighthouses as Lighthouse[];
  const selectedIndex = (dayIndex + installSeed) % lighthouses.length;
  return lighthouses[selectedIndex];
}

export default function TodayScreen() {
  const colorScheme = useColorScheme();
  const colors = LighthousePaper[colorScheme === 'dark' ? 'dark' : 'light'];

  const [lighthouse, setLighthouse] = useState<Lighthouse | null>(null);
  const [isReflecting, setIsReflecting] = useState(false);
  const [reflectionText, setReflectionText] = useState('');
  const [rememberEntry, setRememberEntry] = useState<RememberEntry | null>(null);
  const [evidenceCount, setEvidenceCount] = useState(0);
  const [visitCount, setVisitCount] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const { createEntry, findOrCreateStrength, getStrengths, getRememberEntry } = useEntries();

  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(8)).current;

  const loadTodayData = useCallback(async (currentLighthouse: Lighthouse) => {
    const entry = await getRememberEntry();
    setRememberEntry(entry ? { text: entry.text, createdAt: entry.created_at } : null);

    const strengths = await getStrengths();
    const match = (strengths as { name: string; count: number }[]).find(
      (s) => s.name.trim().toLowerCase() === currentLighthouse.name.trim().toLowerCase()
    );
    setEvidenceCount(match?.count ?? 0);
  }, [getRememberEntry, getStrengths]);

  useEffect(() => {
    async function setupToday() {
      const today = await pickLighthouseOfDay();
      setLighthouse(today);

      // Quiet visit counter — device-local, not a metric to optimise,
      // just the "you keep returning" note at the bottom of the screen.
      // Storage key renamed (was 'today_visit_count') to invalidate a
      // corrupted count left over from the pre-useCallback-fix infinite
      // loop, without requiring a full app reset that would orphan any
      // existing Strengths/entries under the current anonymous session.
      const stored = await SecureStore.getItemAsync('today_visit_count_v2');
      const nextCount = (stored ? parseInt(stored, 10) : 0) + 1;
      await SecureStore.setItemAsync('today_visit_count_v2', nextCount.toString());
      setVisitCount(nextCount);

      await loadTodayData(today);

      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(rise, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]).start();
    }
    setupToday();
  }, [loadTodayData, fade, rise]);

  const handleSaveReflection = async () => {
    if (!lighthouse || !reflectionText.trim()) return;
    setSaving(true);
    try {
      const strengthResult = await findOrCreateStrength(lighthouse.name);
      if (!strengthResult.success || !strengthResult.strength) {
        alert('Could not save reflection.');
        return;
      }
      const result = await createEntry(reflectionText, strengthResult.strength.id, 'daily_reflect');
      if (result.success) {
        setIsReflecting(false);
        setReflectionText('');
        await loadTodayData(lighthouse);
      } else {
        alert(`Could not save reflection: ${(result.error as any)?.message || 'Unknown error'}`);
      }
    } finally {
      setSaving(false);
    }
  };

  if (!lighthouse) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color={colors.oceanAccent} />
      </View>
    );
  }

  const filledStars = Math.min(5, evidenceCount);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View style={{ opacity: fade, transform: [{ translateY: rise }], width: '100%' }}>
          <View style={styles.hero}>
            <LighthouseMark color={colors.oceanAccent} />
            <Text style={[styles.eyebrow, { color: colors.secondaryText }]}>TODAY</Text>
            <Text style={[styles.lighthouseName, { color: colors.text, fontFamily: LighthouseFonts.heading }]}>
              {lighthouse.name}
            </Text>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow, borderColor: colors.border }]}>
            <Text style={[styles.cardLabel, { color: colors.secondaryText }]}>Today's Reminder</Text>
            <Text style={[styles.reminderText, { color: colors.text, fontFamily: LighthouseFonts.quote }]}>
              "{lighthouse.reminder}"
            </Text>
          </View>

          {!isReflecting ? (
            <Pressable
              style={[styles.reflectButton, { borderColor: colors.oceanAccent }]}
              onPress={() => setIsReflecting(true)}
            >
              <Text style={[styles.reflectButtonText, { color: colors.oceanAccent }]}>Reflect</Text>
            </Pressable>
          ) : (
            <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow, borderColor: colors.border }]}>
              <Text style={[styles.cardLabel, { color: colors.secondaryText }]}>Reflect</Text>
              <Text style={[styles.prompt, { color: colors.text, fontFamily: LighthouseFonts.quote }]}>
                {lighthouse.reflection}
              </Text>
              <TextInput
                style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                placeholder="Share a moment..."
                placeholderTextColor={colors.secondaryText}
                multiline
                value={reflectionText}
                onChangeText={setReflectionText}
              />
              <View style={styles.reflectActions}>
                <Pressable onPress={() => { setIsReflecting(false); setReflectionText(''); }} style={styles.cancelButton}>
                  <Text style={{ color: colors.secondaryText }}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.saveButton, { backgroundColor: colors.oceanAccent, opacity: !reflectionText.trim() || saving ? 0.5 : 1 }]}
                  onPress={handleSaveReflection}
                  disabled={!reflectionText.trim() || saving}
                >
                  {saving ? <ActivityIndicator color="white" size="small" /> : <Text style={styles.saveButtonText}>Save Reflection</Text>}
                </Pressable>
              </View>
            </View>
          )}

          {rememberEntry && (
            <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow, borderColor: colors.border }]}>
              <Text style={[styles.cardLabel, { color: colors.secondaryText }]}>Remember</Text>
              <Text style={[styles.rememberText, { color: colors.text, fontFamily: LighthouseFonts.quote }]}>
                "{rememberEntry.text}"
              </Text>
              <Text style={[styles.rememberWhen, { color: colors.secondaryText }]}>
                {formatRelativeTime(rememberEntry.createdAt)}
              </Text>
            </View>
          )}

          {evidenceCount > 0 && (
            <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow, borderColor: colors.border }]}>
              <Text style={[styles.cardLabel, { color: colors.secondaryText }]}>Evidence</Text>
              <Text style={[styles.evidenceName, { color: colors.text, fontFamily: LighthouseFonts.headingMedium }]}>
                {lighthouse.name}
              </Text>
              <Text style={[styles.evidenceCount, { color: colors.secondaryText }]}>
                Recognised {evidenceCount} {evidenceCount === 1 ? 'time' : 'times'}
              </Text>
              <Text style={[styles.stars, { color: colors.sandAccent }]}>
                {'★'.repeat(filledStars)}{'☆'.repeat(5 - filledStars)}
              </Text>
            </View>
          )}

          {visitCount !== null && (
            <View style={styles.footer}>
              <View style={[styles.footerRule, { backgroundColor: colors.border }]} />
              <Text style={[styles.footerText, { color: colors.secondaryText }]}>
                You have quietly returned here {visitCount} {visitCount === 1 ? 'time' : 'times'}.{'\n'}
                Every one of them mattered.
              </Text>
              <View style={[styles.footerRule, { backgroundColor: colors.border }]} />
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    padding: 24,
    paddingTop: 40,
    paddingBottom: 60,
    gap: 20,
  },
  hero: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 4,
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 3,
    marginBottom: 6,
  },
  lighthouseName: {
    fontSize: 32,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    borderRadius: LighthouseRadii.card,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 22,
    marginTop: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  cardLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 12,
    fontWeight: '600',
  },
  reminderText: {
    fontSize: 22,
    lineHeight: 32,
    textAlign: 'center',
  },
  reflectButton: {
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: LighthouseRadii.pill,
    marginTop: 20,
    alignSelf: 'center',
  },
  reflectButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  prompt: {
    fontSize: 18,
    lineHeight: 26,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 15,
    fontSize: 17,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  reflectActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelButton: {
    padding: 10,
  },
  saveButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  rememberText: {
    fontSize: 19,
    lineHeight: 27,
    marginBottom: 10,
  },
  rememberWhen: {
    fontSize: 13,
  },
  evidenceName: {
    fontSize: 20,
    marginBottom: 6,
  },
  evidenceCount: {
    fontSize: 14,
    marginBottom: 10,
  },
  stars: {
    fontSize: 18,
    letterSpacing: 3,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 24,
    gap: 18,
  },
  footerRule: {
    width: '40%',
    height: StyleSheet.hairlineWidth,
  },
  footerText: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
