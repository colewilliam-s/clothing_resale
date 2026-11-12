import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Message } from '../types';

const PREFIX = 'messages:';
const MAX_PER_CHAT = 200; // keeping only the newest 200 chats per convo

// one entry per user and conversation, so accounts never see each other's chats
const key = (userId: string, convId: string) => `${PREFIX}${userId}:${convId}`;

export async function loadCachedMessages(userId: string, convId: string): Promise<Message[]> {
    try {
        const raw = await AsyncStorage.getItem(key(userId, convId));
        return raw ? (JSON.parse(raw) as Message[]): [];
    } catch{
        return [];
    }
}

export async function saveCachedMessages(userId: string, convId: string, messages: Message[]) {
    try {
        const raw = await AsyncStorage.setItem(key(userId, convId), JSON.stringify(messages.slice(0, MAX_PER_CHAT)));
    } catch (e) {
        console.log('Could not save messages to the phone:', e);
    }
}

// call on log out so the next person on this phone can't see them
export async function clearMessageCache() {
    try {
        const keys = await AsyncStorage.getAllKeys();
        await AsyncStorage.multiRemove(keys.filter((k) => k.startsWith(PREFIX)));
    } catch (e) {
        console.log('Could not clear cached messages:', e);
    }
}

// combine two lists with no duplicates, newest first
export function mergeMessages(a: Message[], b: Message[]): Message[] {
    const byId = new Map<string, Message>();
    for (const m of [...a, ...b]) byId.set(m.id, m);
    return [...byId.values()].sort((x, y) => (x.created_at < y.created_at ? 1 : -1));
}