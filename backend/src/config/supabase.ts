import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Supabase connection details
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Create Supabase client with service role key for backend operations
// This bypasses RLS policies for server-side API operations
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Create Supabase admin client with service role key (full permissions)
// Use this only for server-side operations that require elevated permissions
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

// Validate connection
if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase credentials. Please check your .env file.');
}

export default supabase; 