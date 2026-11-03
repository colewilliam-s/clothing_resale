import { supabase } from '../supabase';

export type SearchProfile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  major: string | null;
  class_year: number | null;
  profile_names: { first_name: string | null; last_name: string | null; show_full_name: boolean } | null;
};

export async function searchProfiles(query: string): Promise<SearchProfile[]> {
  const q = query.trim();
  if (!q) return [];

  const escaped = q.replace(/[\\%_]/g, '\\$&');

  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_url, major, class_year, profile_names(first_name, last_name, show_full_name)')
    .ilike('display_name', `${escaped}%`) // names starting with what was typed, case-insensitive
    .limit(30);

  if (error) throw new Error(error.message);
  return data as unknown as SearchProfile[];
}