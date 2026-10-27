import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as Linking from 'expo-linking';
import {
  useFonts,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../src/supabase';

SplashScreen.preventAutoHideAsync();

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default function Layout() {
  const [fontsLoaded, fontError] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  // Load the saved session on startup, then keep it in sync
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => subscription.unsubscribe();
  }, []);

  const ready = (fontsLoaded || !!fontError) && authReady;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  // Redirects
  useEffect(() => {
    if (!ready) return;

    const route = segments[0] as string | undefined; // undefined = the login page (index)
    const isLoginOrSignup = route === undefined || route === 'signup';
    const isPublic = isLoginOrSignup || route === 'resetPassword';

    if (session && isLoginOrSignup) {
      router.replace('/homepage');
    } else if (!session && !isPublic) {
      router.replace('/');
    }
  }, [ready, session, segments]);

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

  if (!ready) return null;

  return <Stack screenOptions={{ animation: 'none', headerShown: false }} />;
}