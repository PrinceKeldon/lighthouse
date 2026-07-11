import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import Colors from '@/src/constants/Colors';
import { useColorScheme } from '@/src/components/useColorScheme';
import { useEntries } from '@/src/hooks/useEntries';

function RememberOverlay({ entry, onDismiss }: { entry: string, onDismiss: () => void }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  
  return (
    <View style={[styles.overlay, { backgroundColor: colors.tint }]}>
      <View style={styles.overlayContent}>
        <Text style={styles.rememberLabel}>Remember</Text>
        <Text style={styles.rememberText}>{entry}</Text>
        <Pressable style={styles.dismissButton} onPress={onDismiss}>
          <Text style={styles.dismissText}>Close</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function TodayScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [isReflecting, setIsReflecting] = useState(false);
  const [reflectionText, setReflectionText] = useState('');
  const [rememberEntry, setRememberEntry] = useState<string | null>(null);
  const { createEntry, getRememberEntry, loading } = useEntries();

  useEffect(() => {
    async function loadRemember() {
      const entry = await getRememberEntry();
      if (entry) setRememberEntry(entry);
    }
    loadRemember();
  }, []);

  const affirmation = "You are exactly where you need to be to begin.";

  const handleSaveReflection = async () => {
    const result = await createEntry(reflectionText, undefined, 'daily_reflect');
    if (result.success) {
      setIsReflecting(false);
      setReflectionText('');
    } else {
      alert('Could not save reflection.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.affirmation, { color: colors.text }]}>
          {affirmation}
        </Text>

        {!isReflecting ? (
          <Pressable 
            style={[styles.reflectButton, { borderColor: colors.tint }]} 
            onPress={() => setIsReflecting(true)}
          >
            <Text style={[styles.reflectButtonText, { color: colors.tint }]}>
              Reflect on this...
            </Text>
          </Pressable>
        ) : (
          <View style={styles.reflectArea}>
            <Text style={[styles.prompt, { color: colors.text }]}>
              Has there been a moment recently that reminds you this might already be true?
            </Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.tabIconDefault }]}
              placeholder="Share a moment..."
              placeholderTextColor={colors.tabIconDefault}
              multiline
              value={reflectionText}
              onChangeText={setReflectionText}
            />
            <View style={styles.reflectActions}>
              <Pressable onPress={() => setIsReflecting(false)} style={styles.cancelButton}>
                <Text style={{ color: colors.text }}>Cancel</Text>
              </Pressable>
              <Pressable 
                style={[styles.saveButton, { backgroundColor: colors.tint }]} 
                onPress={handleSaveReflection}
                disabled={!reflectionText.trim() || loading}
              >
                {loading ? <ActivityIndicator color="white" size="small" /> : <Text style={styles.saveButtonText}>Save</Text>}
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>

      {rememberEntry && (
        <RememberOverlay 
          entry={rememberEntry} 
          onDismiss={() => setRememberEntry(null)} 
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    minHeight: '100%',
  },
  affirmation: {
    fontSize: 28,
    textAlign: 'center',
    fontFamily: 'System',
    marginBottom: 40,
    lineHeight: 36,
  },
  reflectButton: {
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginTop: 20,
  },
  reflectButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  reflectArea: {
    marginTop: 30,
    width: '100%',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 12,
    gap: 15,
  },
  prompt: {
    fontSize: 18,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    fontSize: 18,
    minHeight: 100,
    textAlignVertical: 'top',
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  overlayContent: {
    alignItems: 'center',
    width: '100%',
  },
  rememberLabel: {
    color: 'white',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 20,
    opacity: 0.8,
  },
  rememberText: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
    lineHeight: 32,
    fontWeight: '500',
    marginBottom: 40,
  },
  dismissButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dismissText: {
    color: 'white',
    fontSize: 16,
  },
});
