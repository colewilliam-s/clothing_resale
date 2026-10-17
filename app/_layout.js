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

export default function Layout() {
  const [fontsLoaded, fontError] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  // Catch auth deep links (password reset) no matter which screen is showing
  useEffect(() => {
    async function handle(incomingUrl) {
      if (!incomingUrl) return;
      console.log('Deep link received:', incomingUrl);

      const normalized = incomingUrl.includes('#')
        ? incomingUrl.replace('#', incomingUrl.includes('?') ? '&' : '?')
        : incomingUrl;
      const { queryParams } = Linking.parse(normalized);
      const { code, access_token, refresh_token } = queryParams ?? {};

      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
      } else if (access_token && refresh_token) {
        await supabase.auth.setSession({ access_token, refresh_token });
      }
    }

    Linking.getInitialURL().then(handle);
    const sub = Linking.addEventListener('url', ({ url }) => handle(url));
    return () => sub.remove();
  }, []);

  if (!fontsLoaded && !fontError) return null;

  return (
    <Stack screenOptions={{ animation: 'none', headerShown: false }} /> // for the time being of testing, the animation on this is going to be none. lowkey i want elliot to deal with the animations icl
  );
}
