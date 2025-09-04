// Simple Supabase connection test
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://tednluwflfhxyucgwigh.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlZG5sdXdmbGZoeHl1Y2d3aWdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNDYyMjksImV4cCI6MjA2NzkyMjIyOX0.PG0iGZQR2d8yo4y3q1e2tEIMa3J0AdFkI1Q6P7IDgrg';

console.log('🔗 Testing Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey.substring(0, 20) + '...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Test 1: Check if ce_metrics table exists
    console.log('\n📊 Testing ce_metrics table...');
    const metricsTest = await supabase.from('ce_metrics').select('count', { count: 'exact' });
    
    if (metricsTest.error) {
      console.log('❌ ce_metrics table does not exist');
      console.log('Error:', metricsTest.error.message);
    } else {
      console.log('✅ ce_metrics table exists');
    }

    // Test 2: Check if ce_activities table exists  
    console.log('\n📝 Testing ce_activities table...');
    const activitiesTest = await supabase.from('ce_activities').select('count', { count: 'exact' });
    
    if (activitiesTest.error) {
      console.log('❌ ce_activities table does not exist');
      console.log('Error:', activitiesTest.error.message);
    } else {
      console.log('✅ ce_activities table exists');
    }

    // Test 3: Check if ce_users table exists
    console.log('\n👥 Testing ce_users table...');
    const usersTest = await supabase.from('ce_users').select('count', { count: 'exact' });
    
    if (usersTest.error) {
      console.log('❌ ce_users table does not exist');
      console.log('Error:', usersTest.error.message);
    } else {
      console.log('✅ ce_users table exists');
    }

  } catch (error) {
    console.error('🚨 Connection test failed:', error.message);
  }
}

testConnection().then(() => {
  console.log('\n🎯 Next steps:');
  console.log('1. Go to your Supabase dashboard: https://app.supabase.com/project/tednluwflfhxyucgwigh');
  console.log('2. Click on "SQL Editor" in the left sidebar');
  console.log('3. Copy and paste the contents of "supabase-safe.sql" file');
  console.log('4. Click "Run" to create the tables');
  console.log('5. Re-run this test to verify tables were created');
});