import { useState } from 'react';
import { supabase } from '../api/supabase';
import { Database } from '../types/database';

export function useEntries() {
  const [loading, setLoading] = useState(false);

  async function createEntry(text: string, strengthId?: string, promptId?: string) {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

       const { error } = await (supabase.from('entries') as any).insert({
         user_id: user.id,
         text_encrypted: text,
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

      return entries || [];
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

      // Milestone 0: Calendar-date matching (month/day) per 10 & 11
       const { data: entry, error } = await (supabase as any).rpc('get_remember_entry', {
         u_id: user.id
       });


      if (error) throw error;
      return entry;
    } catch (e) {
      console.error('Remember entry error:', e);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { createEntry, getEntriesForStrength, getRememberEntry, loading };
}
