// Item detail page, reached by tapping a thumbnail on the home page.
// Not designed yet. Shows every field from the listing, stacked plainly.
// Unstyled on purpose (like dm.js and signup.js) until we design this screen together.

import { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, Pressable, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../../src/supabase';
import { label } from '../../src/label';

export default function ItemDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase
      .from('listings')
      .select('*, seller:profiles(id, display_name, university_domain)')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setListing(data);
      });
  }, [id]);

  return (
    <>
      {/* the root Stack hides headers, so turn one on here to get a back button */}
      <Stack.Screen options={{ headerShown: true, title: '', headerBackTitle: 'Back' }} />

      {error ? <Text style={{ color: 'red', padding: 20 }}>{error}</Text> : null}

      {!listing && !error ? <ActivityIndicator style={{ marginTop: 40 }} /> : null}

      {listing ? (
        <ScrollView contentContainerStyle={{ padding: 20, gap: 8 }}>
          {listing.image_url ? (
            <Image source={{ uri: listing.image_url }} style={{ width: '100%', aspectRatio: 1 }} />
          ) : null}
          <Text style={{ fontSize: 20 }}>{listing.title}</Text>
          <Text>${Number(listing.price).toFixed(2)}</Text>
          {listing.status === 'sold' ? <Text>SOLD</Text> : null}
          {listing.size ? <Text>Size: {listing.size}</Text> : null}
          {listing.condition ? <Text>Condition: {listing.condition}</Text> : null}
          {listing.category ? <Text>Category: {listing.category}</Text> : null}
          {listing.description ? <Text>{listing.description}</Text> : null}
          <View style={{ height: 8 }} />
          <Pressable onPress={() => router.push(`/user/${listing.seller.id}`)}>
            <Text style={{ textDecorationLine: 'underline' }}>Sold by {label(listing.seller)}</Text>
          </Pressable>
        </ScrollView>
      ) : null}
    </>
  );
}
