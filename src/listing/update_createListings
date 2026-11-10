import { supabase } from '../supabase';
import type { Fields } from '../types';
import { type PhotoChange} from '../profile/api';



const BUCKET = 'listing-photos'; // TODO: idk the correct link to database


// Convert the form's strings into what the table expects ('' becomes null for optional fields)
function toRow(f: Fields) {
  return {
    title: f.title.trim(),
    description: f.description.trim() || null,
    price: f.price,
    category: f.category,
    size: f.size.trim(),
    condition: f.condition
    //brand: f.brand.trim() || null,
    //color: f.color.trim() || null,
  };
}

function extensionFor(mimeType: string) {
  if (mimeType === 'image/png') return 'png';
  if (mimeType === 'image/webp') return 'webp';
  if (mimeType === 'image/heic') return 'heic';
  return 'jpg';
}

// Upload one image and return both its storage path and public URL
async function uploadPhoto(userId: string, uri: string, mimeType: string) {
  const path = `${userId}/${Date.now()}.${extensionFor(mimeType)}`;
  const body = await (await fetch(uri)).arrayBuffer();

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, body, { contentType: mimeType });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { path, url: data.publicUrl };
}

// Turn a public URL back into a storage path so the file can be deleted
function pathFromUrl(url: string) {
  const marker = `/${BUCKET}/`;
  const i = url.indexOf(marker);
  return i === -1 ? null : decodeURIComponent(url.slice(i + marker.length));
}

//delete photo 
async function deletePhotoByUrl(url: string | null) {
  if (!url) return;
  const path = pathFromUrl(url);
  if (path) await supabase.storage.from(BUCKET).remove([path]); // best effort
}

export async function createListing(userId: string, fields: Fields, photoChange: PhotoChange) {
  let photoUrl: string | null = null;
  let uploadedPath: string | null = null;

  if (photoChange.kind === 'new') {
    const up = await uploadPhoto(userId, photoChange.uri, photoChange.mimeType);
    photoUrl = up.url;
    uploadedPath = up.path;
  }

  const { error } = await supabase
    .from('listings')
    .insert({ user_id: userId, ...toRow(fields), photo_url: photoUrl });

  if (error) {
    // Don't leave an orphaned image behind if the row failed to save
    if (uploadedPath) await supabase.storage.from(BUCKET).remove([uploadedPath]);
    throw new Error(error.message);
  }
}

//updates listing if signed into current session
export async function updateListing(id: string, fields: Fields, photoChange: PhotoChange, photo_url: string | null,) {
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData.session?.user.id;
  if (!userId) throw new Error('You need to be signed in.');

  let newUrl: string | null = photo_url;
  let uploadedPath: string | null = null;

  if (photoChange.kind === 'new') {
    const up = await uploadPhoto(userId, photoChange.uri, photoChange.mimeType);
    newUrl = up.url;
    uploadedPath = up.path;
  } else if (photoChange.kind === 'remove') {
    newUrl = null;
  }

  const { data, error } = await supabase
    .from('listings')
    .update({ ...toRow(fields), photo_url: newUrl })
    .eq('id', id)
    .select('id');

  // With row-level security, an update you aren't allowed to make affects 0 rows without an error
  if (error || !data || data.length === 0) {
    if (uploadedPath) await supabase.storage.from(BUCKET).remove([uploadedPath]);
    throw new Error(error?.message ?? 'Could not update this listing.');
  }

  // Only delete the old image after the row saved successfully
  if (photoChange.kind !== 'keep') await deletePhotoByUrl(photo_url);
}