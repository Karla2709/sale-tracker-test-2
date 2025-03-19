import { createClient } from '@supabase/supabase-js';

// Supabase connection details
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Create Supabase client with service role key to bypass RLS policies
// This is safe in serverless functions as the key is not exposed to the client
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Create Supabase admin client with service role key (full permissions)
// Use this only for server-side operations that require elevated permissions
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

// Validate connection
if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase credentials. Please check your environment variables.');
}

export default supabase; 