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
          text: text,
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

  // Real Strengths list, with a live entry count per Strength, computed
  // from actual entries rather than any hardcoded/mock source.
  async function getStrengths() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: strengths, error: strengthsError } = await supabase
        .from('strengths')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (strengthsError) throw strengthsError;

      const { data: entries, error: entriesError } = await supabase
        .from('entries')
        .select('strength_tags')
        .eq('user_id', user.id);

      if (entriesError) throw entriesError;

      const counts: Record<string, number> = {};
      (entries || []).forEach((e: any) => {
        (e.strength_tags || []).forEach((tagId: string) => {
          counts[tagId] = (counts[tagId] || 0) + 1;
        });
      });

      return (strengths || []).map((s: any) => ({
        id: s.id,
        name: s.name,
        count: counts[s.id] || 0,
      }));
    } catch (e) {
      console.error('Fetch strengths error:', e);
      return [];
    } finally {
      setLoading(false);
    }
  }

  // Find-or-create by name (case-insensitive), matching 06's "the app
  // offers suggestions or the user types their own" rule — never creates
  // a silent duplicate Strength for the same name.
  async function findOrCreateStrength(name: string) {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const trimmed = name.trim();
      if (!trimmed) throw new Error('Strength name cannot be empty');

      const { data: existing, error: findError } = await supabase
        .from('strengths')
        .select('*')
        .eq('user_id', user.id)
        .ilike('name', trimmed);

      if (findError) throw findError;
      if (existing && existing.length > 0) {
        return { success: true, strength: existing[0] };
      }

      const { data: created, error: createError } = await (supabase.from('strengths') as any)
        .insert({ user_id: user.id, name: trimmed, first_evidence_at: new Date().toISOString() })
        .select()
        .single();

      if (createError) throw createError;
      return { success: true, strength: created };
    } catch (e) {
      console.error('Find or create strength error:', e);
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

  return { createEntry, getStrengths, findOrCreateStrength, getEntriesForStrength, getRememberEntry, loading };
}
