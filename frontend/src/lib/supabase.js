import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rjtuuzehypemfvdaiusi.supabase.co';
// Supabase now issues 'sb_publishable_...' keys; the legacy JWT anon key also works here.
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable__9P3FJxQPo_Jq6ClYDxi0g_UNnWKoez';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

