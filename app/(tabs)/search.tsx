import { useEffect, useState } from 'react';
import { FlatList, View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Avatar } from '../../src/profile/Avatar';
import { searchProfiles, type SearchProfile } from '../../src/search/api';
import { styles } from '../../src/search/styles';

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Search 300ms after the user stops typing. The cleanup ignores stale responses.
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setError('');
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const found = await searchProfiles(q);
        if (!cancelled) {
          setResults(found);
          setError('');
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Search failed');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const hasQuery = query.trim().length > 0;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder='Search users (@john_smith)'
        value={query}
        onChangeText={setQuery}
        autoCapitalize='none'
        autoCorrect={false}
        clearButtonMode='while-editing'
      />

      {loading ? <ActivityIndicator style={styles.spinner} /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={results}
        keyExtractor={(p) => p.id}
        keyboardShouldPersistTaps='handled'
        renderItem={({ item }) => {
          const names = item.profile_names;
          const fullName = names?.show_full_name
            ? [names.first_name, names.last_name].filter(Boolean).join(' ')
            : '';
          return (
            <Pressable
              style={({ pressed }) => [styles.row, pressed && styles.pressed]}
              onPress={() => router.push(`/user/${item.id}`)}
            >
              <Avatar uri={item.avatar_url} size={48} />
              <View style={styles.rowText}>
                <Text style={styles.name}>@{item.display_name?.toLowerCase()}</Text>
                {fullName ? <Text style={styles.detail}>{fullName}</Text> : null}
                {item.major ? <Text style={styles.detail}>{item.major}</Text> : null}
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          hasQuery && !loading && !error ? <Text style={styles.empty}>No people found.</Text> : undefined
        }
      />
    </View>
  );
}