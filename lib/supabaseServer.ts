import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://usjijpwcubtxofjqgiii.supabase.co';

export const getSupabaseServer = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'build-time-placeholder';
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};
