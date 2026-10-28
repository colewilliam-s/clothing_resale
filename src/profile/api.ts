// Loads and saves profiles in Supabase

import { supabase } from '../supabase';
import type { ProfileDetails, ProfileNames, ProfilePageData } from '../types';

const DETAILS = 'id, display_name, university_domain, major, class_year, avatar_url';

// Setup is finished once someone has a display name and a class year
export function isProfileComplete(p: ProfileDetails | null): boolean {
  return !!p && !!p.display_name?.trim() && !!p.class_year;
}

// The signed-in user's own profile details
export async function fetchMyProfile(userId: string): Promise<ProfileDetails | null> {
  const { data, error } = await supabase.from('profiles').select(DETAILS).eq('id', userId).maybeSingle();
  if (error) throw error;
  return data;
}

// The signed-in user's own first/last name (the owner can always read these)
export async function fetchMyNames(userId: string): Promise<ProfileNames | null> {
  const { data, error } = await supabase
    .from('profile_names')
    .select('first_name, last_name, show_full_name')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// Everything a profile page shows. Names come back null when the owner keeps them private.
export async function fetchProfilePage(userId: string): Promise<ProfilePageData> {
  const { data, error } = await supabase
    .from('profiles')
    .select(`${DETAILS}, profile_names(first_name, last_name, show_full_name), listings(id, image_url, status, created_at)`)
    .eq('id', userId)
    .order('created_at', { referencedTable: 'listings', ascending: false })
    .single();
  if (error) throw error;

  // a one-to-one join can come back as an object or a one-item array depending on the Supabase version
  const names = Array.isArray(data.profile_names) ? data.profile_names[0] ?? null : data.profile_names;
  return { ...data, profile_names: names } as ProfilePageData;
}

export type PhotoChange =
  | { kind: 'keep' }
  | { kind: 'remove' }
  | { kind: 'new'; uri: string; mimeType: string };

export type ProfileFormValues = {
  displayName: string;
  firstName: string;
  lastName: string;
  showFullName: boolean;
  classYear: number;
  major: string;
};

const orNull = (s: string) => (s.trim() ? s.trim() : null);

export async function saveProfile(
  userId: string,
  values: ProfileFormValues,
  photo: PhotoChange,
  currentAvatarUrl: string | null,
) {
  let avatar_url = currentAvatarUrl;
  const path = `${userId}/avatar`;

  if (photo.kind === 'new') {
    const body = await fetch(photo.uri).then((r) => r.arrayBuffer());
    const { error } = await supabase.storage
      .from('avatars')
      .upload(path, body, { contentType: photo.mimeType, upsert: true });
    if (error) throw error;
    // the file name never changes, so add a version number to stop phones showing the old photo
    avatar_url = `${supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl}?v=${Date.now()}`;
  }

  if (photo.kind === 'remove') {
    await supabase.storage.from('avatars').remove([path]);
    avatar_url = null;
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      display_name: values.displayName.trim(),
      class_year: values.classYear,
      major: orNull(values.major),
      avatar_url,
    })
    .eq('id', userId);
  if (profileError) throw profileError;

  const { error: namesError } = await supabase.from('profile_names').upsert({
    id: userId,
    first_name: orNull(values.firstName),
    last_name: orNull(values.lastName),
    show_full_name: values.showFullName,
  });
  if (namesError) throw namesError;
}
