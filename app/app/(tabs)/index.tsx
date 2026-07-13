import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Colors from '@/src/constants/Colors';
import { CONTENT } from '@/src/constants/Content';
import { useColorScheme } from '@/src/components/useColorScheme';
import { useEntries } from '@/src/hooks/useEntries';
import affirmations from '@/assets/affirmations.json';

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
  const [affirmation, setAffirmation] = useState('');
  const [recentEntries, setRecentEntries] = useState<any[]>([]);
  const { createEntry, getRememberEntry, getRecentEntries, loading } = useEntries();

  const loadTodayData = useCallback(async () => {
    // Load remember entry
    const entry = await getRememberEntry();
    if (entry) setRememberEntry(entry);
    
    // Load recent reflections
    const recent = await getRecentEntries();
    setRecentEntries(recent);
  }, [getRememberEntry, getRecentEntries]);

  useEffect(() => {
    async function setupToday() {
      // 1. Load or create install seed
      let seed = await SecureStore.getItemAsync('install_seed');
      if (seed === null) {
        seed = Math.floor(Math.random() * 1000000).toString();
        await SecureStore.setItemAsync('install_seed', seed);
      }
      const installSeed = parseInt(seed, 10);

      // 2. Compute dayIndex (days since Jan 1, 2026)
      const epoch = new Date('2026-01-01T00:00:00Z');
      const now = new Date();
      const diffInMs = now.getTime() - epoch.getTime();
      const dayIndex = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      // 3. Deterministic selection
      const selectedIndex = (dayIndex + installSeed) % affirmations.length;
      setAffirmation(affirmations[selectedIndex].text);

      await loadTodayData();
    }
    setupToday();
  }, [loadTodayData]);

  const handleSaveReflection = async () => {
    const result = await createEntry(reflectionText, undefined, 'daily_reflect');
    if (result.success) {
      setIsReflecting(false);
      setReflectionText('');
      await loadTodayData();
    } else {
      alert(`Could not save reflection: ${result.error?.message || 'Unknown error'}`);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.affirmation, { color: colors.text }]}>
          {affirmation}
        </Text>

        {!isReflecting ? (
          <View style={styles.actionArea}>
            <Pressable 
              style={[styles.reflectButton, { borderColor: colors.tint }]} 
              onPress={() => setIsReflecting(true)}
            >
              <Text style={[styles.reflectButtonText, { color: colors.tint }]}>
                Reflect on this...
              </Text>
            </Pressable>

            {recentEntries.length > 0 && (
              <View style={styles.recentContainer}>
                <Text style={[styles.recentTitle, { color: colors.tabIconDefault }]}>Recent Reflections</Text>
                {recentEntries.map((entry, i) => (
                  <Text key={i} style={[styles.recentText, { color: colors.text }]}>
                    • {entry.text}
                  </Text>
                ))}
              </View>
            )}
          </View>
        ) : (
          <View style={styles.reflectArea}>
            <Text style={[styles.prompt, { color: colors.text }]}>
              {CONTENT.today.reflectionPrompt}
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
  actionArea: {
    width: '100%',
    alignItems: 'center',
    gap: 24,
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
  recentContainer: {
    width: '100%',
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.03)',
    gap: 8,
  },
  recentTitle: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    fontWeight: '600',
  },
  recentText: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.8,
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
    ...StyleSheet.absoluteFill,
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
