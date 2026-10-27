import * as SecureStore from 'expo-secure-store';

const KEY = 'session';

export const saveSession = (value: string) => SecureStore.setItemAsync(KEY, value);
export const getSession = () => SecureStore.getItemAsync(KEY);
export const clearSession = () => SecureStore.deleteItemAsync(KEY);