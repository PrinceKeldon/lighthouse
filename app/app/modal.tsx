import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { CONTENT } from '@/src/constants/Content';
import { LighthousePaper, LighthouseRadii, LighthouseFonts } from '@/src/constants/LighthouseTheme';
import { useColorScheme } from '@/src/components/useColorScheme';
import { useEntries } from '@/src/hooks/useEntries';
import { LighthouseMark } from '@/src/components/LighthouseMark';

type Lighthouse = { name: string; reminder: string; reflection: string };

// Explore Lighthouses — lite version.
// A curated doorway into the existing Strength/Entry mechanic, not a new
// data model. No living-card state, no visit counts, no Constellations —
// deliberately scoped down from docs/13-explore-lighthouses-vision.md.
export default function ExploreLighthousesScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = LighthousePaper[colorScheme === 'dark' ? 'dark' : 'light'];
  const { createEntry, findOrCreateStrength, getEntriesForStrength } = useEntries();

  const [selected, setSelected] = useState<Lighthouse | null>(null);
  const [recentEntry, setRecentEntry] = useState<string | null>(null);
  const [evidenceCount, setEvidenceCount] = useState(0);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [reflectionText, setReflectionText] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const openLighthouse = useCallback(async (lighthouse: Lighthouse) => {
    setSelected(lighthouse);
    setReflectionText('');
    setSaved(false);
    setLoadingDetail(true);

    // Find-or-create is read-safe here: if the Strength doesn't exist yet,
    // this creates it with zero entries, which is fine — the empty state
    // below handles that gracefully rather than treating it as an error.
    const result = await findOrCreateStrength(lighthouse.name);
    if (result.success && result.strength) {
      const entries = await getEntriesForStrength(result.strength.id);
      setEvidenceCount(entries.length);
      if (entries.length > 0) {
        setRecentEntry((entries[entries.length - 1] as any).text);
      } else {
        setRecentEntry(null);
      }
    }
    setLoadingDetail(false);
  }, []);

  const handleSaveReflection = async () => {
    if (!selected || !reflectionText.trim()) return;
    setSaving(true);
    const strengthResult = await findOrCreateStrength(selected.name);
    if (strengthResult.success && strengthResult.strength) {
      const result = await createEntry(reflectionText, strengthResult.strength.id, 'explore_lighthouse');
      if (result.success) {
        setSaved(true);
        setEvidenceCount((c) => c + 1);
        setReflectionText('');
      }
    }
    setSaving(false);
  };

  if (selected) {
    return (
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.detailContent}>
        <Pressable onPress={() => setSelected(null)} style={styles.backButton}>
          <Text style={{ color: colors.oceanAccent }}>← All Lighthouses</Text>
        </Pressable>

        <View style={styles.hero}>
          <LighthouseMark color={colors.oceanAccent} />
          <Text style={[styles.lighthouseName, { color: colors.text, fontFamily: LighthouseFonts.heading }]}>
            {selected.name}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow }]}>
          <Text style={[styles.sectionLabel, { color: colors.secondaryText }]}>Today's Reminder</Text>
          <Text style={[styles.reminderText, { color: colors.text, fontFamily: LighthouseFonts.quote }]}>
            "{selected.reminder}"
          </Text>
        </View>

        {loadingDetail ? (
          <ActivityIndicator color={colors.oceanAccent} style={{ marginTop: 20 }} />
        ) : (
          <>
            {recentEntry && (
              <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow }]}>
                <Text style={[styles.sectionLabel, { color: colors.secondaryText }]}>Remember</Text>
                <Text style={[styles.rememberText, { color: colors.text, fontFamily: LighthouseFonts.quote }]}>
                  "{recentEntry}"
                </Text>
              </View>
            )}

            {evidenceCount > 0 && (
              <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow }]}>
                <Text style={[styles.sectionLabel, { color: colors.secondaryText }]}>Evidence</Text>
                <Text style={[styles.evidenceText, { color: colors.text }]}>
                  You've recognized {selected.name} {evidenceCount} {evidenceCount === 1 ? 'time' : 'times'}.
                </Text>
                <Text style={[styles.stars, { color: colors.sandAccent }]}>
                  {'★'.repeat(Math.min(5, evidenceCount))}{'☆'.repeat(5 - Math.min(5, evidenceCount))}
                </Text>
              </View>
            )}

            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow }]}>
              <Text style={[styles.sectionLabel, { color: colors.secondaryText }]}>Reflection</Text>
              <Text style={[styles.reflectionPrompt, { color: colors.text, fontFamily: LighthouseFonts.quote }]}>
                {selected.reflection}
              </Text>

              {saved ? (
                <Text style={[styles.savedText, { color: colors.oceanAccent }]}>Saved. Thank you for noticing.</Text>
              ) : (
                <>
                  <TextInput
                    style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.background }]}
                    placeholder="Write it here, if you'd like..."
                    placeholderTextColor={colors.secondaryText}
                    multiline
                    value={reflectionText}
                    onChangeText={setReflectionText}
                  />
                  <Pressable
                    style={[styles.saveButton, { backgroundColor: colors.oceanAccent, opacity: !reflectionText.trim() || saving ? 0.5 : 1 }]}
                    onPress={handleSaveReflection}
                    disabled={!reflectionText.trim() || saving}
                  >
                    {saving ? <ActivityIndicator color="white" size="small" /> : <Text style={styles.saveButtonText}>Save</Text>}
                  </Pressable>
                </>
              )}
            </View>
          </>
        )}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text, fontFamily: LighthouseFonts.heading }]}>Explore Lighthouses</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={{ color: colors.oceanAccent }}>Close</Text>
        </Pressable>
      </View>
      <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
        Places to visit, not a list to finish.
      </Text>
      <FlatList
        data={CONTENT.lighthouses}
        keyExtractor={(item) => item.name}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.lighthouseCard, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow }]}
            onPress={() => openLighthouse(item)}
          >
            <Text style={[styles.cardName, { color: colors.text }]}>{item.name}</Text>
            <Text style={[styles.cardReminder, { color: colors.secondaryText }]} numberOfLines={2}>
              {item.reminder}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  title: {
    fontSize: 24,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
    marginBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  lighthouseCard: {
    width: '48%',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: LighthouseRadii.card,
    padding: 16,
    marginBottom: 14,
    minHeight: 110,
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 1,
  },
  cardName: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 6,
  },
  cardReminder: {
    fontSize: 13,
    lineHeight: 18,
  },
  detailContent: {
    paddingBottom: 60,
  },
  backButton: {
    marginTop: 10,
    marginBottom: 20,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 4,
  },
  lighthouseName: {
    fontSize: 30,
    textAlign: 'center',
  },
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: LighthouseRadii.card,
    padding: 22,
    marginTop: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  sectionLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 12,
    fontWeight: '600',
  },
  reminderText: {
    fontSize: 20,
    lineHeight: 28,
    textAlign: 'center',
  },
  rememberText: {
    fontSize: 18,
    lineHeight: 26,
  },
  evidenceText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 10,
  },
  stars: {
    fontSize: 18,
    letterSpacing: 3,
  },
  reflectionPrompt: {
    fontSize: 18,
    lineHeight: 26,
    marginBottom: 14,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    padding: 15,
    fontSize: 17,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 14,
  },
  saveButton: {
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  savedText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
});
