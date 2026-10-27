import * as SecureStore from 'expo-secure-store';

// session key
const KEY = 'session';

// all of the constants that pertain to login sessions. would be a little redundant to explain each one
export const saveSession = (value: string) => SecureStore.setItemAsync(KEY, value);
export const getSession = () => SecureStore.getItemAsync(KEY);
export const clearSession = () => SecureStore.deleteItemAsync(KEY);
