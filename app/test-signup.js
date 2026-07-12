const { createClient } = require('@supabase/supabase-js');
const ws = require('ws');
require('dotenv').config({ path: './.env' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  { realtime: { transport: ws } }
);

async function testSignup() {
  console.log('Testing public signup...');
  try {
    const { data, error } = await supabase.auth.signUp({
      email: `public-test-${Date.now()}@example.com`,
      password: 'PublicPassword123!',
    });
    if (error) throw error;
    console.log('✅ Public signup successful:', data.user?.id);
  } catch (e) {
    console.error('❌ Public signup failed:', e);
  }
}

testSignup();
