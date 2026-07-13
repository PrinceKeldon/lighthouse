import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Modal, TextInput, ActivityIndicator } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { CONTENT } from '@/src/constants/Content';
import { useColorScheme } from '@/src/components/useColorScheme';
import { useEntries } from '@/src/hooks/useEntries';

type StrengthWithCount = { id: string; name: string; count: number };

export default function StrengthsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
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
    <Pressable style={styles.item} onPress={() => handleStrengthPress(item)}>
      <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
      <Text style={[styles.itemCount, { color: colors.tabIconDefault }]}>
        {item.count} {item.count === 1 ? 'entry' : 'entries'}
      </Text>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Your Strengths</Text>
        <Pressable
          style={[styles.addButton, { backgroundColor: colors.tint }]}
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
          style={[styles.exploreCard, { borderColor: colors.tint }]}
          onPress={() => router.push('/modal')}
        >
          <Text style={[styles.exploreCardText, { color: colors.tint }]}>
            ✦ Explore Lighthouses
          </Text>
        </Pressable>
      )}

      {selectedStrength ? (
        <View style={styles.detailView}>
          <Pressable onPress={() => setSelectedStrength(null)} style={styles.backButton}>
            <Text style={{ color: colors.tint }}>← Back to Strengths</Text>
          </Pressable>
          <Text style={[styles.detailTitle, { color: colors.text }]}>{selectedStrength.name}</Text>
          <FlatList
            data={entries}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.entryItem}>
                <Text style={[styles.entryText, { color: colors.text }]}>{item}</Text>
              </View>
            )}
            ListEmptyComponent={<Text style={{ textAlign: 'center', opacity: 0.5 }}>No entries yet</Text>}
          />
        </View>
      ) : fetchingStrengths ? (
        <View style={styles.emptyState}>
          <ActivityIndicator />
        </View>
      ) : strengths.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: colors.text }]}>
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
            <Text style={[styles.modalTitle, { color: colors.text }]}>Log a Moment</Text>

            <Text style={[styles.fieldLabel, { color: colors.tabIconDefault }]}>
              Which Strength does this belong to?
            </Text>
            <TextInput
              style={[styles.input, styles.strengthInput, { color: colors.text, borderColor: colors.tabIconDefault }]}
              placeholder="e.g. Patience, Courage..."
              placeholderTextColor={colors.tabIconDefault}
              value={newStrengthName}
              onChangeText={setNewStrengthName}
            />

            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.tabIconDefault }]}
              placeholder="What happened?"
              placeholderTextColor={colors.tabIconDefault}
              multiline
              value={newEntryText}
              onChangeText={setNewEntryText}
            />

            <View style={styles.modalActions}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setEntryModalVisible(false)}
              >
                <Text style={{ color: colors.text }}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.saveButton, { backgroundColor: colors.tint }]}
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
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  exploreCardText: {
    fontSize: 15,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
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
    opacity: 0.7,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
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
    fontWeight: '600',
    marginBottom: 20,
  },
  entryItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  entryText: {
    fontSize: 18,
    lineHeight: 24,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 30,
    paddingBottom: 50,
    gap: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
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
    borderRadius: 10,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});
