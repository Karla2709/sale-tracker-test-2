import { createClient } from '@supabase/supabase-js';

// Supabase connection details
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create Supabase client with anonymous key (limited permissions)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Validate connection
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Please check your .env.local file.');
}

export default supabase; 