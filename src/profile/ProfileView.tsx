// A profile page: photo, names, class year and major, then a grid of listings.
// Used for your own Profile tab and for other users' pages (app/user/[id].tsx).

import { useCallback, useState } from 'react';
import { FlatList, View, Text, Pressable, ActivityIndicator, useWindowDimensions } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { supabase } from '../supabase';
import { ItemThumbnail } from '../homepage/ItemThumbnail';
import { fetchProfilePage } from './api';
import { Avatar } from './Avatar';
import { styles, GRID_COLUMNS, GRID_GAP, SIDE_PADDING } from './styles';
import type { ProfilePageData } from '../types';

type Props = {
  userId: string;
  isOwn: boolean; // your own profile shows Edit Profile, Log Out, and the post-your-first-item button
};

export function ProfileView({ userId, isOwn }: Props) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [profile, setProfile] = useState<ProfilePageData | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const tileSize = (width - SIDE_PADDING * 2 - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS;

  const load = useCallback(async () => {
    setError('');
    try {
      setProfile(await fetchProfilePage(userId));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load this profile.');
    }
  }, [userId]);

  // Reload every time the screen comes into view, so edits and new listings show up
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  if (!profile) {
    return (
      <View style={styles.center}>
        {error ? <Text style={styles.error}>{error}</Text> : <ActivityIndicator />}
      </View>
    );
  }

  const names = profile.profile_names;
  const fullName = names?.show_full_name
    ? [names.first_name, names.last_name].filter(Boolean).join(' ')
    : '';

  const header = (
    <View style={styles.header}>
      <Avatar uri={profile.avatar_url} size={96} />
      <Text style={styles.displayName}>{fullName}</Text>
      {fullName ? <Text style={styles.fullName}>@{profile.display_name?.toLowerCase()}</Text> : null}
      {profile.class_year ? <Text style={styles.detail}>Class of {profile.class_year}</Text> : null}
      {profile.major ? <Text style={styles.detail}>{profile.major}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {isOwn ? (
        <Pressable
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
          onPress={() => router.push('/edit-profile')}
        >
          <Text style={styles.secondaryButtonText}>Edit Profile</Text>
        </Pressable>
      ) : null}
    </View>
  );

  const empty = (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>No listings yet.</Text>
      {isOwn ? (
        <Pressable
          style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
          onPress={() => router.push('/list')}
        >
          <Text style={styles.primaryButtonText}>Post your first item</Text>
        </Pressable>
      ) : null}
    </View>
  );

  // Logging out clears the session, and app/_layout.tsx sends the user back to the login screen
  const footer = isOwn ? (
    <Pressable onPress={() => supabase.auth.signOut()} hitSlop={8}>
      <Text style={styles.linkText}>Log Out</Text>
    </Pressable>
  ) : undefined;

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.gridContent}
      columnWrapperStyle={styles.gridRow}
      data={profile.listings}
      keyExtractor={(l) => l.id}
      numColumns={GRID_COLUMNS}
      renderItem={({ item }) => (
        <View style={styles.gridItem}>
          <ItemThumbnail listing={item} size={tileSize} onPress={() => router.push(`/item/${item.id}`)} />
        </View>
      )}
      ListHeaderComponent={header}
      ListEmptyComponent={empty}
      ListFooterComponent={footer}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
}