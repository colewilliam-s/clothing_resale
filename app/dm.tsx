// Direct Messages file

import { useEffect, useState } from 'react';
import {
  View, Text, TextInput, FlatList, Pressable,
  KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import { label } from '../src/label';
import { Link, useRouter, Stack, useLocalSearchParams } from 'expo-router';
import type { Profile, Message } from '../src/types';
import { supabase } from '../src/supabase';
import { styles } from '../src/homepage/styles';

export default function DM() {
  const [userId, setUserId] = useState<string | null>(null);
  const { otherId } = useLocalSearchParams<{ otherId?: string }>();
  const [people, setPeople] = useState<Profile[]>([]);
  const [convId, setConvId] = useState<string | null>(null);
  const [otherName, setOtherName] = useState('');
  const [messages, setMessages] = useState<Message[]>([]); // newest first
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Load the signed-in user and everyone else
  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return setError('Not signed in.');
      setUserId(user.id);

      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, university_domain')
        .neq('id', user.id);
      if (error) setError(error.message);
      else setPeople(data);
    }
    load();
  }, []);

  // if the user arrived from someones profile, jump straight into said chat
  useEffect(() => {
    if (!otherId) return;
    async function openFromParam() {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, university_domain')
        .eq('id', otherId)
        .single();
      if (error) return setError(error.message);
      openChat(data);
    }
    openFromParam();
  }, [otherId]);

  // Load messages and subscribe to new ones when a chat is open
  useEffect(() => {
    if (!convId) return;
    setMessages([]);

    supabase
      .from('messages')
      .select('id, sender_id, body, created_at')
      .eq('conversation_id', convId)
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setMessages(data);
      });

    const channel = supabase
      .channel(`chat:${convId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${convId}` },
        (payload) => {
          const incoming = payload.new as Message;
          setMessages((prev) =>
            prev.some((m) => m.id === incoming.id) ? prev : [incoming, ...prev]
          );
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [convId]);

  async function openChat(person: Profile) {
    setError('');
    const { data, error } = await supabase.rpc('get_or_create_conversation', { other: person.id });
    if (error) return setError(error.message);
    setOtherName(label(person));
    setConvId(data);
  }

  async function send() {
    const body = text.trim();
    if (!body || !userId || !convId) return;
    setText('');
    const { error } = await supabase
      .from('messages')
      .insert({ conversation_id: convId, sender_id: userId, body });
    if (error) {
      setText(body);
      setError(error.message);
    }
  }

  // arrived from someone elses profile while the chats aren't ready yet
  if (otherId && !convId && !error) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }


  // Screen 1: pick someone to message
  if (!convId) {
    return (
      <View style={{ flex: 1, padding: 20, marginTop: '10%' }}>
        <Pressable
          onPress={() => { router.replace('../(tabs)/homepage') }}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed
          ]}
        >
          <Text
            style={styles.backButtonText}
          >&lt; Back to home page
          </Text>
        </Pressable>
        <Text style={{ fontSize: 20, marginBottom: 10, marginTop: 10, fontWeight: 'bold' }}>Message someone</Text>
        {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
        <FlatList
          data={people}
          keyExtractor={(p) => p.id}
          ListEmptyComponent={<Text>No other users yet. Create a second test user in the dashboard.</Text>}
          renderItem={({ item }) => (
            <Pressable onPress={() => openChat(item)} style={{ paddingVertical: 12 }}>
              <Text>{label(item)}</Text>
            </Pressable>
          )}
        />
      </View>
    );
  }

  // Screen 2: the chat
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={{ padding: 12, flexDirection: 'row', gap: 12, marginTop: '10%' }}>
        <Pressable
          onPress={() => (otherId ? router.back() : setConvId(null))}
          style={({ pressed }) => [
            styles.textBackButton,
            pressed && styles.backButtonPressed
          ]}
        >
          <Text
            style={styles.backButtonText}
          >&lt; Back</Text>
        </Pressable>
        <Text>{otherName}</Text>
      </View>
      {error ? <Text style={{ color: 'red', paddingHorizontal: 12 }}>{error}</Text> : null}
      <FlatList
        inverted
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => {
          const mine = item.sender_id === userId;
          return (
            <View style={{
              alignSelf: mine ? 'flex-end' : 'flex-start',
              maxWidth: '80%', marginVertical: 3, padding: 10, borderRadius: 12,
              backgroundColor: mine ? '#2f6fed' : '#e6e6e6',
            }}>
              <Text style={{ color: mine ? 'white' : 'black' }}>{item.body}</Text>
            </View>
          );
        }}
      />
      <View style={{ flexDirection: 'row', padding: 8, gap: 8 }}>
        <TextInput
          style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 14 }}
          value={text}
          onChangeText={setText}
          placeholder='Message'
        />
        <Pressable onPress={send}><Text style={{ padding: 10 }}>Send</Text></Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
