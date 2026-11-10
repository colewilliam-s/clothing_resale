import { useCallback, useEffect, useState } from 'react';
import { FlatList, View, Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { supabase } from '../../src/supabase';
import { Avatar } from '../../src/profile/Avatar';
import { useSession } from '../../src/session/SessionProvider';
import { fetchInbox, type InboxItem } from '../../src/messages/api';
import { styles } from '../../src/messages/styles'

export default function Connect() {
  const router = useRouter();
  const { session } = useSession();
  const myId = session?.user.id;
  const [chats, setChats] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!myId) return;
    try {
      setChats(await fetchInbox(myId));
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load your messages.');
    } finally {
      setLoading(false);
    }
  }, [myId]);

  // reload whenever the tab comes into view
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  // reload when a new message arrives. Row level security means this only
  // fires for messages in conversations you're part of.
  useEffect(() => {
    if (!myId) return;
    const channel = supabase
      .channel(`inbox:${myId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
        load();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [myId, load]);

  // pull down to reload
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
      data={chats}
      keyExtractor={(c) => c.id}
      refreshing={refreshing}
      onRefresh={onRefresh}
      renderItem={({ item }) => {
        const preview = item.last_message
          ? `${item.last_message.sender_id === myId ? 'You: ' : ''}${item.last_message.body}`
          : '';
        return (
          <Pressable
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
            disabled={!item.other}
            onPress={() => item.other && router.push({ pathname: '/dm', params: { otherId: item.other.id } })}
          >
            <Avatar uri={item.other?.avatar_url ?? null} size={48} />
            <View style={styles.rowText}>
              <Text style={styles.name}>@{item.other?.display_name?.toLowerCase() ?? 'unknown'}</Text>
              <Text style={styles.preview} numberOfLines={1}>{preview}</Text>
            </View>
          </Pressable>
        );
      }}
      ListHeaderComponent={error ? <Text style={styles.error}>{error}</Text> : undefined}
      ListEmptyComponent={
        !error ? (
          <Text style={styles.empty}>No messages yet. Open someone's profile and tap the message button to start a chat!</Text>
        ) : undefined
      }
    />
  );
}

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff' },
//   content: { paddingHorizontal: 16, paddingTop: 12, flexGrow: 1 },
//   center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
//   row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
//   pressed: { opacity: 0.7 },
//   rowText: { flex: 1 },
//   name: { fontSize: 15, color: '#111', fontFamily: 'DMSans_500Medium' },
//   preview: { fontSize: 13, color: '#6b6b6b', fontFamily: 'DMSans_400Regular' },
//   error: { color: 'red', marginBottom: 12 },
//   empty: { color: '#6b6b6b', textAlign: 'center', marginTop: 40, fontFamily: 'DMSans_400Regular' },
// });