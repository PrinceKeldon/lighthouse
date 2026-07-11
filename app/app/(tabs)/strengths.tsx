import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Modal, TextInput, ActivityIndicator } from 'react-native';
import Colors from '@/src/constants/Colors';
import { useColorScheme } from '@/src/components/useColorScheme';
import { useEntries } from '@/src/hooks/useEntries';

export default function StrengthsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { createEntry, getEntriesForStrength, loading } = useEntries();
  
  const [isEntryModalVisible, setEntryModalVisible] = useState(false);
  const [newEntryText, setNewEntryText] = useState('');
  const [selectedStrength, setSelectedStrength] = useState<{id: string, name: string} | null>(null);
  const [entries, setEntries] = useState<string[]>([]);

  const strengths = [
    { id: '1', name: 'Patience', count: 3 },
    { id: '2', name: 'Courage', count: 5 },
  ];

  const handleCreateEntry = async () => {
    const strengthId = selectedStrength?.id;
    const result = await createEntry(
      newEntryText, 
      strengthId || undefined, 
      'manual_strength_entry'
    );
    if (result.success) {
      setNewEntryText('');
      setEntryModalVisible(false);
    } else {
      alert('Could not save entry.');
    }
  };

  const handleStrengthPress = async (strength: any) => {
    setSelectedStrength(strength);
    const decrypted = await getEntriesForStrength(strength.id);
    setEntries(decrypted.map(e => e.text));
  };

  const renderStrength = ({ item }: { item: any }) => (
    <Pressable style={styles.item} onPress={() => handleStrengthPress(item)}>
      <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
      <Text style={[styles.itemCount, { color: colors.tabIconDefault }]}>{item.count} entries</Text>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Your Strengths</Text>
        <Pressable 
          style={[styles.addButton, { backgroundColor: colors.tint }]}
          onPress={() => {
            setSelectedStrength(strengths[0]); // Default to first for scaffold
            setEntryModalVisible(true);
          }}
        >
          <Text style={styles.addButtonText}>+ New Entry</Text>
        </Pressable>
      </View>

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
      ) : (
        <>
          {strengths.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: colors.text }]}>
                A quiet place for moments that remind you you were patient. When one arrives, it'll feel right at home.
              </Text>
            </View>
          ) : (
            <FlatList
              data={strengths}
              renderItem={renderStrength}
              keyExtractor={(item) => item.id}
            />
          )}
        </>
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
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.tabIconHDefault }]}
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
                disabled={!newEntryText.trim() || loading}
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
