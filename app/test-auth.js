const { createClient } = require('@supabase/supabase-js');
const ws = require('ws');
require('dotenv').config({ path: './.env' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { realtime: { transport: ws } }
);

async function testAuth() {
  console.log('Testing auth.admin.createUser...');
  try {
    const email = `auth-test-${Date.now()}@example.com`;
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password: 'TestPassword123!',
      email_confirm: true
    });

    if (error) throw error;
    console.log('✅ auth.admin.createUser successful:', data.user.id);
    
    // Cleanup
    await supabase.auth.admin.deleteUser(data.user.id);
    console.log('🧹 Cleanup complete.');
  } catch (e) {
    console.error('❌ Auth Error:', e);
    process.exit(1);
  }
}

testAuth();
