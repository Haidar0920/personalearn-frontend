import type { User } from '../layouts/PersonaLearnLayout.tsx';
import { supabase } from '../lib/supabase';

export function getUserDetails(): User | null {
  // Synchronous version: returns null if no session yet loaded
  // The layout uses this as initial state; async updates handled separately
  return null;
}

export async function getUserDetailsAsync(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const fullName = (user.user_metadata?.full_name as string) ?? '';
  const email = user.email ?? '';
  const parts = fullName.trim().split(' ');

  return {
    firstName: parts[0] ?? email.split('@')[0],
    lastName: parts.slice(1).join(' ') || ' ',
    email,
  };
}
