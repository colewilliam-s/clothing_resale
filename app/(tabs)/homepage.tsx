import { useEffect, useState } from 'react';
import { FlatList, View, Text, ActivityIndicator } from 'react-native';
import { styles } from '../../src/homepage/styles';
import { fetchFeed, type Profile } from '../../src/homepage/feed';
import { UserRow } from '../../src/homepage/UserRow';

// The "Home" header and the bottom tab bar come from app/(tabs)/_layout.js

export default function HomePage() {
  const [feed, setFeed] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    setError('');
    try {
      setFeed(await fetchFeed());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    }
  }

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  // Pull down to reload
  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={feed}
      keyExtractor={(p) => p.id}
      renderItem={({ item }) => <UserRow profile={item} />}
      refreshing={refreshing}
      onRefresh={onRefresh}
      ListHeaderComponent={error ? <Text style={styles.error}>{error}</Text> : null}
      ListEmptyComponent={!error ? <Text style={styles.empty}>No listings yet.</Text> : null} // placeholder wording
    />
  );
}
