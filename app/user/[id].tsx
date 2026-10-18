// A user's full closet, reached from a username or the "more" tile on the home page.
// Not designed yet. Shows a plain list of every listing, newest first.
// Unstyled on purpose (like dm.js and signup.js) until we design this screen together.

import { useEffect, useState } from 'react';
import { FlatList, Text, Pressable, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../../src/supabase';
import { label } from '../../src/label';
import type { ProfileWithListings } from '../../src/types';

export default function UserProfile() {
  const { id: rawId } = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileWithListings | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, display_name, university_domain, listings(id, title, price, status, created_at)')
      .eq('id', id)
      .order('created_at', { referencedTable: 'listings', ascending: false })
      .single()
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setProfile(data);
      });
  }, [id]);

  return (
    <>
      {/* the root Stack hides headers, so turn one on here to get a back button */}
      <Stack.Screen options={{ headerShown: true, title: profile ? label(profile) : '', headerBackTitle: 'Back' }} />

      {error ? <Text style={{ color: 'red', padding: 20 }}>{error}</Text> : null}

      {!profile && !error ? <ActivityIndicator style={{ marginTop: 40 }} /> : null}

      {profile ? (
        <FlatList
          data={profile.listings}
          keyExtractor={(l) => l.id}
          contentContainerStyle={{ padding: 20 }}
          ListEmptyComponent={<Text>No listings yet.</Text>}
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push(`/item/${item.id}`)} style={{ paddingVertical: 12 }}>
              <Text>
                {item.title} - ${Number(item.price).toFixed(2)}
                {item.status === 'sold' ? ' - SOLD' : ''}
              </Text>
            </Pressable>
          )}
        />
      ) : null}
    </>
  );
}
