// Script to create test users for different roles
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase connection details
const supabaseUrl = process.env.SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

// Create Supabase client with service role key (admin access)
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createUser(email, password, role) {
  console.log(`Creating user ${email} with role ${role}...`);
  
  try {
    // 1. Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm the email
    });
    
    if (authError) {
      throw authError;
    }
    
    console.log(`Created auth user: ${authData.user.id}`);
    
    // 2. Add the user to our users table with the specified role
    const { data: userData, error: userError } = await supabase
      .from('users')
      .upsert([
        {
          id: authData.user.id,
          email: email,
          role: role
        }
      ]);
    
    if (userError) {
      throw userError;
    }
    
    console.log(`User ${email} created successfully with role ${role}`);
    return authData.user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

async function main() {
  try {
    // Create a viewer user
    await createUser('viewtest1@example.com', 'abc1234!', 'viewer');
    
    // Create a saler user
    await createUser('saletest1@example.com', 'abc1234!', 'saler');
    
    console.log('All users created successfully!');
  } catch (error) {
    console.error('Error in main function:', error);
  }
}

main(); 