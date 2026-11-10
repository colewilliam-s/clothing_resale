import { supabase } from '../supabase';

export type InboxItem = {
    id: string;
    last_message_at: string;
    other: { id: string; display_name: string | null; avatar_url: string| null} | null;
    last_message: { body: string; sender_id: string } | null;
};

type Person = { id: string; display_name: string | null; avatar_url: string | null };

type RawRow = {
    id: string;
    last_message_at: string;
    conversation_participants: { user_id: string; profiles: Person | Person[] | null}[];
    messages: { body: string; sender_id: string }[];
};

// the inbox: only conversations that already contain a message, newest first
export async function fetchInbox(myId: string): Promise<InboxItem[]> {
  const { data, error } = await supabase
    .from('conversations')
    .select(
      `id, last_message_at,
       conversation_participants(user_id, profiles(id, display_name, avatar_url)),
       messages(body, sender_id)`,
    )
    .not('last_message_at', 'is', null) // skip chats nobody has written in yet
    .order('last_message_at', { ascending: false })
    .order('created_at', { referencedTable: 'messages', ascending: false })
    .limit(1, { referencedTable: 'messages' }); // just the latest message, for the preview

  if (error) throw new Error(error.message);

  return (data as unknown as RawRow[]).map((c) => {
    const them = c.conversation_participants.find((p) => p.user_id !== myId);
    const profile = Array.isArray(them?.profiles) ? them?.profiles[0] : them?.profiles;
    return {
      id: c.id,
      last_message_at: c.last_message_at,
      other: profile ?? null,
      last_message: c.messages[0] ?? null,
    };
  });
}