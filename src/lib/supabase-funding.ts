import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_FUNDING_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_FUNDING_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Funding Supabase environment variables');
}

export const supabaseFunding = createClient<Database>(supabaseUrl, supabaseAnonKey);