import { useState, useEffect } from 'react';
import { supabase } from '../api/supabase';
import { decryptText, encryptText } from '../utils/encryption';
import { Database } from '../types/database';

export function useEntries() {
  const [loading, setLoading] = useState(false);

  async function createEntry(text: string, strengthId?: string, promptId?: string) {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Encrypt the text server-side per ADR-003
      const encryptedText = await encryptText(user.id, text);

      const { error } = await supabase.from('entries').insert({
        user_id: user.id,
        text_encrypted: encryptedText,
        strength_tags: strengthId ? [strengthId] : [],
        prompt_id: promptId,
      });

      if (error) throw error;
      return { success: true };
    } catch (e) {
      console.error('Create entry error:', e);
      return { success: false, error: e };
    } finally {
      setLoading(false);
    }
  }

  async function getEntriesForStrength(strengthId: string) {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: entries, error } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', user.id)
        .contains('strength_tags', [strengthId]);

      if (error) throw error;

      // Decrypt each entry text
      const decryptedEntries = await Promise.all(
        (entries || []).map(async (entry) => ({
          ...entry,
          text: await decryptText(user.id, entry.text_encrypted),
        }))
      );

      return decryptedEntries;
    } catch (e) {
      console.error('Fetch entries error:', e);
      return [];
    } finally {
      setLoading(false);
    }
  }

  async function getRememberEntry() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Simple "on this day" query: matching month and day
      // This is a simplification for the scaffold; real SQL would use date_trunc or similar
      const { data: entries, error } = await supabase
        .from('entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1); // Just get the latest one for the scaffold

      if (error) throw error;
      if (!entries || entries.length === 0) return null;

      return await decryptText(user.id, entries[0].text_encrypted);
    } catch (e) {
      console.error('Remember entry error:', e);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { createEntry, getDecryptedEntry, getEntriesForStrength, getRememberEntry, loading };
}
