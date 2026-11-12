// Direct Messages file
// Reached from the message button on a profile, or by tapping a chat in the Connect inbox.

import { useEffect, useState } from 'react';
import {
  View, Text, TextInput, FlatList, Pressable,
  KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import { label } from '../src/label';
import { Redirect, useRouter, useLocalSearchParams } from 'expo-router';
import type { Profile, Message } from '../src/types';
import { supabase } from '../src/supabase';
import { styles } from '../src/homepage/styles';
import { loadCachedMessages, saveCachedMessages, mergeMessages } from '../src/messages/cache';

export default function DM() {
  const [userId, setUserId] = useState<string | null>(null);
  const { otherId } = useLocalSearchParams<{ otherId?: string }>();
  const [convId, setConvId] = useState<string | null>(null);
  const [otherName, setOtherName] = useState('');
  const [messages, setMessages] = useState<Message[]>([]); // newest first
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // load the signed-in user
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) setError('Not signed in.');
      else setUserId(user.id);
    });
  }, []);

  // open the chat with the person we arrived for
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

  // load messages and subscribe to new ones when a chat is open
  useEffect(() => {
    if (!convId || !userId) return;
    let cancelled = false;
    setMessages([]);

    (async () => {
      // 1. Show what's saved on the phone right away
      const cached = await loadCachedMessages(userId, convId);
      if (cancelled) return;
      if (cached.length) setMessages(cached);

      // 2. Ask the database only for messages newer than the newest saved one
      let query = supabase
        .from("messages")
        .select("id, sender_id, body, created_at")
        .eq("conversation_id", convId)
        .order("created_at", { ascending: false })
        .limit(50);
      if (cached.length) query = query.gt("created_at", cached[0].created_at);

      const { data, error } = await query;
      if (cancelled) return;
      if (error) return setError(error.message);

      // A full page of 50 might mean there were more, which would leave a gap
      // in the saved copy, so in that case use the fresh page only.
      const cachedIds = new Set(cached.map((m) => m.id));
      setMessages((prev) => {
        const liveOnes = prev.filter((m) => !cachedIds.has(m.id)); // arrived over realtime meanwhile
        const base = data.length === 50 ? data : mergeMessages(cached, data);
        return mergeMessages(base, liveOnes);
      });
    })();

    const channel = supabase
      .channel(`chat:${convId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${convId}`,
        },
        (payload) => {
          const incoming = payload.new as Message;
          setMessages((prev) =>
            prev.some((m) => m.id === incoming.id) ? prev : [incoming, ...prev],
          );
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [convId, userId]);

  // keep the phone's copy up to date whenever the list changes
  useEffect(() => {
    if (!convId || !userId || messages.length === 0) return;
    saveCachedMessages(userId, convId, messages);
  }, [messages, convId, userId]);

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

  // chats start from a profile's message button, so there's nobody to open here
  if (!otherId) return <Redirect href='/connect' />;

  // opening the chat
  if (!convId && !error) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  // couldn't open it
  if (!convId) {
    return (
      <View style={{ flex: 1, padding: 20, marginTop: '10%' }}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.textBackButton, pressed && styles.backButtonPressed]}
        >
          <Text style={styles.backButtonText}>&lt; Back</Text>
        </Pressable>
        <Text style={{ color: 'red', marginTop: 12 }}>{error}</Text>
      </View>
    );
  }

  // the chat
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <View style={{ padding: 12, flexDirection: 'row', gap: 12, marginTop: '10%' }}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.textBackButton, pressed && styles.backButtonPressed]}
        >
          <Text style={styles.backButtonText}>&lt; Back</Text>
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
      <View style={{ flexDirection: 'row', padding: 8, gap: 8, width: '94%', alignSelf: 'center' }}>
        <TextInput
          style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 14 }}
          value={text}
          onChangeText={setText}
          placeholder='Message'
        />
        <Pressable onPress={send}><Text style={{ padding: 10, fontWeight: 700 }}>Send</Text></Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}