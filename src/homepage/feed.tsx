// Loads the home feed from Supabase

import { supabase } from '../supabase';

// A row shows up to 5 tiles. We fetch one extra listing per user (6) so we can tell
// whether they have MORE than 5, which decides if the "more" tile appears.
export const ROW_SLOTS = 5;

// Everyone with at least one listing, each with their newest listings first.
// (Later: filter by the viewer's size preference here.)
export async function fetchFeed(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name, university_domain, listings!inner(id, image_url, status, created_at)')
    .order('created_at', { referencedTable: 'listings', ascending: false })
    .limit(ROW_SLOTS + 1, { referencedTable: 'listings' });

  if (error) throw error;
  return data;
}

export type Profile = {
  id: string;
  display_name: string | null;
  university_domain: string | null;
};