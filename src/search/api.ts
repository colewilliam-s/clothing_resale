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
  const q = query.trim().replace(/^@+/, '');
  if (!q) return [];

  // the signed-in user, read from the saved session (no network call)
  const { data: { session } } = await supabase.auth.getSession();
  const myId = session?.user.id;

  // % and _ are wildcards in ilike, so escape them if the user types them
  const escaped = q.replace(/[\\%_]/g, '\\$&');

  let request = supabase
    .from('profiles')
    .select('id, display_name, avatar_url, major, class_year, profile_names(first_name, last_name, show_full_name)')
    .ilike('display_name', `${escaped}%`)
    .limit(30);

  if (myId) request = request.neq('id', myId); // leaving the signed in user out of the results

  const { data, error } = await request;

  if (error) throw new Error(error.message);
  return data as unknown as SearchProfile[];
}