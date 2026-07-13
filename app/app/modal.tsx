import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { CONTENT } from '@/src/constants/Content';
import { useColorScheme } from '@/src/components/useColorScheme';
import { useEntries } from '@/src/hooks/useEntries';

type Lighthouse = { name: string; reminder: string; reflection: string };

// Explore Lighthouses — lite version.
// A curated doorway into the existing Strength/Entry mechanic, not a new
// data model. No living-card state, no visit counts, no Constellations —
// deliberately scoped down from docs/13-explore-lighthouses-vision.md.
export default function ExploreLighthousesScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
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
          <Text style={{ color: colors.tint }}>← All Lighthouses</Text>
        </Pressable>

        <Text style={[styles.lighthouseName, { color: colors.text }]}>{selected.name}</Text>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.tabIconDefault }]}>Today's Reminder</Text>
          <Text style={[styles.reminderText, { color: colors.text }]}>{selected.reminder}</Text>
        </View>

        {loadingDetail ? (
          <ActivityIndicator style={{ marginTop: 20 }} />
        ) : (
          <>
            {recentEntry && (
              <View style={styles.section}>
                <Text style={[styles.sectionLabel, { color: colors.tabIconDefault }]}>Remember</Text>
                <Text style={[styles.rememberText, { color: colors.text }]}>{recentEntry}</Text>
              </View>
            )}

            {evidenceCount > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionLabel, { color: colors.tabIconDefault }]}>Evidence</Text>
                <Text style={[styles.evidenceText, { color: colors.text }]}>
                  You've recognized {selected.name} {evidenceCount} {evidenceCount === 1 ? 'time' : 'times'}.
                </Text>
              </View>
            )}

            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: colors.tabIconDefault }]}>Reflection</Text>
              <Text style={[styles.reflectionPrompt, { color: colors.text }]}>{selected.reflection}</Text>

              {saved ? (
                <Text style={[styles.savedText, { color: colors.tint }]}>Saved. Thank you for noticing.</Text>
              ) : (
                <>
                  <TextInput
                    style={[styles.input, { color: colors.text, borderColor: colors.tabIconDefault }]}
                    placeholder="Write it here, if you'd like..."
                    placeholderTextColor={colors.tabIconDefault}
                    multiline
                    value={reflectionText}
                    onChangeText={setReflectionText}
                  />
                  <Pressable
                    style={[styles.saveButton, { backgroundColor: colors.tint, opacity: !reflectionText.trim() || saving ? 0.5 : 1 }]}
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
        <Text style={[styles.title, { color: colors.text }]}>Explore Lighthouses</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={{ color: colors.tint }}>Close</Text>
        </Pressable>
      </View>
      <Text style={[styles.subtitle, { color: colors.tabIconDefault }]}>
        Places to visit, not a list to finish.
      </Text>
      <FlatList
        data={CONTENT.lighthouses}
        keyExtractor={(item) => item.name}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.card, { backgroundColor: colors.background, borderColor: colors.tabIconDefault }]}
            onPress={() => openLighthouse(item)}
          >
            <Text style={[styles.cardName, { color: colors.text }]}>{item.name}</Text>
            <Text style={[styles.cardReminder, { color: colors.tabIconDefault }]} numberOfLines={2}>
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
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
    marginBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    minHeight: 110,
    justifyContent: 'center',
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
  lighthouseName: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 24,
  },
  section: {
    marginBottom: 28,
  },
  sectionLabel: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  reminderText: {
    fontSize: 20,
    lineHeight: 28,
  },
  rememberText: {
    fontSize: 17,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  evidenceText: {
    fontSize: 15,
    lineHeight: 22,
  },
  reflectionPrompt: {
    fontSize: 17,
    lineHeight: 24,
    marginBottom: 14,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    fontSize: 17,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 14,
  },
  saveButton: {
    paddingVertical: 12,
    borderRadius: 12,
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
