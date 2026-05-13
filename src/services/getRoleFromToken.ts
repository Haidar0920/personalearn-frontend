import { supabase } from '../lib/supabase';

export async function getRoleFromToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.app_metadata?.role ?? null;
}
