import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Modal, TextInput, ActivityIndicator } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { CONTENT } from '@/src/constants/Content';
import { LighthousePaper, LighthouseRadii, LighthouseFonts } from '@/src/constants/LighthouseTheme';
import { useColorScheme } from '@/src/components/useColorScheme';
import { useEntries } from '@/src/hooks/useEntries';

type StrengthWithCount = { id: string; name: string; count: number };

export default function StrengthsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = LighthousePaper[colorScheme === 'dark' ? 'dark' : 'light'];
  const { createEntry, getStrengths, findOrCreateStrength, getEntriesForStrength, loading } = useEntries();

  const [strengths, setStrengths] = useState<StrengthWithCount[]>([]);
  const [fetchingStrengths, setFetchingStrengths] = useState(true);
  const [isEntryModalVisible, setEntryModalVisible] = useState(false);
  const [newEntryText, setNewEntryText] = useState('');
  const [newStrengthName, setNewStrengthName] = useState('');
  const [selectedStrength, setSelectedStrength] = useState<StrengthWithCount | null>(null);
  const [entries, setEntries] = useState<string[]>([]);

  const loadStrengths = useCallback(async () => {
    setFetchingStrengths(true);
    const data = await getStrengths();
    setStrengths(data as StrengthWithCount[]);
    setFetchingStrengths(false);
  }, []);

  // Refresh every time this screen is focused, not just on first mount —
  // so an entry created via Today's Reflect prompt shows up here too.
  useFocusEffect(
    useCallback(() => {
      loadStrengths();
    }, [loadStrengths])
  );

  const handleCreateEntry = async () => {
    if (!newStrengthName.trim() || !newEntryText.trim()) return;

    const strengthResult = await findOrCreateStrength(newStrengthName);
    if (!strengthResult.success || !strengthResult.strength) {
      alert('Could not save Strength.');
      return;
    }

    const result = await createEntry(
      newEntryText,
      strengthResult.strength.id,
      'manual_strength_entry'
    );

    if (result.success) {
      setNewEntryText('');
      setNewStrengthName('');
      setEntryModalVisible(false);
      loadStrengths();
    } else {
      alert('Could not save entry.');
    }
  };

  const handleStrengthPress = async (strength: StrengthWithCount) => {
    setSelectedStrength(strength);
    const fetched = await getEntriesForStrength(strength.id);
    setEntries((fetched as any[]).map(e => e.text));
  };

  const renderStrength = ({ item }: { item: StrengthWithCount }) => (
    <Pressable
      style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow }]}
      onPress={() => handleStrengthPress(item)}
    >
      <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
      <Text style={[styles.itemCount, { color: colors.secondaryText }]}>
        {item.count} {item.count === 1 ? 'entry' : 'entries'}
      </Text>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text, fontFamily: LighthouseFonts.heading }]}>Your Strengths</Text>
        <Pressable
          style={[styles.addButton, { backgroundColor: colors.oceanAccent }]}
          onPress={() => {
            setNewStrengthName(selectedStrength?.name || '');
            setEntryModalVisible(true);
          }}
        >
          <Text style={styles.addButtonText}>+ New Entry</Text>
        </Pressable>
      </View>

      {!selectedStrength && (
        <Pressable
          style={[styles.exploreCard, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow }]}
          onPress={() => router.push('/modal')}
        >
          <Text style={[styles.exploreCardText, { color: colors.oceanAccent }]}>
            ✦ Explore Lighthouses
          </Text>
        </Pressable>
      )}

      {selectedStrength ? (
        <View style={styles.detailView}>
          <Pressable onPress={() => setSelectedStrength(null)} style={styles.backButton}>
            <Text style={{ color: colors.oceanAccent }}>← Back to Strengths</Text>
          </Pressable>
          <Text style={[styles.detailTitle, { color: colors.text, fontFamily: LighthouseFonts.heading }]}>
            {selectedStrength.name}
          </Text>
          <FlatList
            data={entries}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={[styles.entryItem, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow }]}>
                <Text style={[styles.entryText, { color: colors.text, fontFamily: LighthouseFonts.quote }]}>"{item}"</Text>
              </View>
            )}
            ListEmptyComponent={<Text style={{ textAlign: 'center', color: colors.secondaryText }}>No entries yet</Text>}
          />
        </View>
      ) : fetchingStrengths ? (
        <View style={styles.emptyState}>
          <ActivityIndicator color={colors.oceanAccent} />
        </View>
      ) : strengths.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
            {CONTENT.strengths.emptyStateText}
          </Text>
        </View>
      ) : (
        <FlatList
          data={strengths}
          renderItem={renderStrength}
          keyExtractor={(item) => item.id}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={isEntryModalVisible}
        onRequestClose={() => setEntryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <Text style={[styles.modalTitle, { color: colors.text, fontFamily: LighthouseFonts.headingMedium }]}>
              Log a Moment
            </Text>

            <Text style={[styles.fieldLabel, { color: colors.secondaryText }]}>
              Which Strength does this belong to?
            </Text>
            <TextInput
              style={[styles.input, styles.strengthInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
              placeholder="e.g. Patience, Courage..."
              placeholderTextColor={colors.secondaryText}
              value={newStrengthName}
              onChangeText={setNewStrengthName}
            />

            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
              placeholder="What happened?"
              placeholderTextColor={colors.secondaryText}
              multiline
              value={newEntryText}
              onChangeText={setNewEntryText}
            />

            <View style={styles.modalActions}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setEntryModalVisible(false)}
              >
                <Text style={{ color: colors.secondaryText }}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.saveButton, { backgroundColor: colors.oceanAccent }]}
                onPress={handleCreateEntry}
                disabled={!newEntryText.trim() || !newStrengthName.trim() || loading}
              >
                {loading ? <ActivityIndicator color="white" size="small" /> : <Text style={styles.saveButtonText}>Save</Text>}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: 20,
    marginTop: 10,
  },
  exploreCard: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: LighthouseRadii.card,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  exploreCardText: {
    fontSize: 15,
    fontWeight: '600',
  },
  title: {
    fontSize: 26,
  },
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: LighthouseRadii.card,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '500',
  },
  itemCount: {
    fontSize: 14,
  },
  detailView: {
    flex: 1,
  },
  backButton: {
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 28,
    marginBottom: 20,
  },
  entryItem: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: LighthouseRadii.card,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 1,
  },
  entryText: {
    fontSize: 18,
    lineHeight: 26,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 30,
    paddingBottom: 50,
    gap: 20,
  },
  modalTitle: {
    fontSize: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    padding: 15,
    fontSize: 18,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  strengthInput: {
    minHeight: 50,
  },
  fieldLabel: {
    fontSize: 13,
    marginBottom: -10,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelButton: {
    padding: 10,
  },
  saveButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});
