import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    persistSession: true,
    autoRefreshToken: true,
    // React Native has no URL to parse a session out of — this flag is
    // for web magic-link flows only, and can cause session issues if
    // left on in a mobile context.
    detectSessionInUrl: false,
  },
});

// Ensures a session exists before any screen that needs one (onboarding,
// entry creation) ever renders. Anonymous sign-in — no email, no
// password, no configuration screen — matching 06's "no friction before
// first value" design. Account linking (claiming this session with a
// real email) is a Phase 4 / Settings feature, not a Day 1 requirement.
export async function ensureSession() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) return session;

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) {
    console.error('Anonymous sign-in failed:', error);
    throw error;
  }
  return data.session;
}

// A returning user (same persisted anonymous session, reopening the app
// minutes or days later) should never see onboarding again — that's a
// one-time Day 1 flow, not something re-triggered every launch. Presence
// of at least one Entry is used as the signal, since onboarding always
// creates one as its final step.
export async function hasCompletedOnboarding(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { count, error } = await supabase
    .from('entries')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if (error) {
    console.error('hasCompletedOnboarding check failed:', error);
    // Fail safe toward showing onboarding rather than crashing — worst
    // case is one redundant entry, not a broken app.
    return false;
  }

  return (count ?? 0) > 0;
}