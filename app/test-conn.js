const { createClient } = require('@supabase/supabase-js');
const ws = require('ws');
require('dotenv').config({ path: './.env' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { realtime: { transport: ws } }
);

async function testConnectivity() {
  console.log('Testing connectivity...');
  try {
    const { data, error } = await supabase.from('subscriptions').select('count').single();
    if (error) {
      console.log('Query error (might be expected if table empty):', error.message);
    } else {
      console.log('✅ Connectivity successful, table accessed.');
    }
  } catch (e) {
    console.error('❌ Connection failed:', e);
  }
}

testConnectivity();
