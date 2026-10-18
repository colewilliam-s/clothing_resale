import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as Linking from 'expo-linking';
import {
  useFonts,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import { supabase } from '../src/supabase';

// Keep the splash screen up until fonts are ready, so text never flashes in the system font
SplashScreen.preventAutoHideAsync();

// Query params can be a string, an array of strings, or missing. Take the first string.
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default function Layout() {
  const [fontsLoaded, fontError] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  // Catch auth deep links (password reset) no matter which screen is showing
  useEffect(() => {
    async function handle(incomingUrl: string | null) {
      if (!incomingUrl) return;

      const normalized = incomingUrl.includes('#')
        ? incomingUrl.replace('#', incomingUrl.includes('?') ? '&' : '?')
        : incomingUrl;
      const { queryParams } = Linking.parse(normalized);

      const code = first(queryParams?.code);
      const access_token = first(queryParams?.access_token);
      const refresh_token = first(queryParams?.refresh_token);

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) console.log('Code exchange failed:', error.message);
      } else if (access_token && refresh_token) {
        const { error } = await supabase.auth.setSession({ access_token, refresh_token });
        if (error) console.log('Set session failed:', error.message);
      }
    }

    Linking.getInitialURL().then(handle);
    const sub = Linking.addEventListener('url', ({ url }) => handle(url));
    return () => sub.remove();
  }, []);

  if (!fontsLoaded && !fontError) return null;

  return (
    <Stack screenOptions={{ animation: 'none', headerShown: false }} />
  );
}