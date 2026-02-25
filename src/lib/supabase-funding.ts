import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_FUNDING_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_FUNDING_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Funding Supabase environment variables');
}

// Configure the Funding Supabase client with explicit headers to avoid 406 errors
export const supabaseFunding = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'apikey': supabaseAnonKey,
    },
  },
});