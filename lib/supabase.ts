import { createClient } from '@supabase/supabase-js';

// Temporarily hardcoded to fix authentication issue
// TODO: Revert to environment variables once loading is fixed
const supabaseUrl = 'https://usjijpwcubtxofjqgiii.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzamlqcHdjdWJ0eG9manFnaWlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NjIxMzMsImV4cCI6MjA5NTEzODEzM30.vuT7cOpMq9504WUdPD-pje5HkaeyK-DDXIPNelmqWSY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
