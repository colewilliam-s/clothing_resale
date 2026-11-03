import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as Linking from 'expo-linking';
import {
  useFonts,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import { supabase } from '../src/supabase';
import { SessionProvider, useSession } from '../src/session/SessionProvider';
import { isProfileComplete } from '../src/profile/api';

// Keep the splash screen up until fonts are ready and we know who is logged in
SplashScreen.preventAutoHideAsync();

// Query params can be a string, an array of strings, or missing. Take the first string.
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

// Screens for people who are logged out. Logged-in users get sent past them.
const LOGGED_OUT_SCREENS = ['index', 'signup', 'resetPassword'];

// Screens anyone can be on. A password reset link logs the user in,
// so update-password must not redirect them before they finish.
const OPEN_SCREENS = ['update-password'];

export default function Layout() {
  const [fontsLoaded, fontError] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

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

  return (
    <SessionProvider>
      <RootNavigator fontsReady={fontsLoaded || !!fontError} />
    </SessionProvider>
  );
}

// Sends people to the right place: login when logged out, profile setup when
// their profile isn't finished, and the app once it is.
function RootNavigator({ fontsReady }: { fontsReady: boolean }) {
  const { session, profile, initialized, loading } = useSession();
  const segments = useSegments() as string[];
  const router = useRouter();

  useEffect(() => {
    if (fontsReady && initialized) SplashScreen.hideAsync();
  }, [fontsReady, initialized]);

  useEffect(() => {
    if (!initialized || loading) return;

    const screen = segments[0] ?? 'index';
    if (OPEN_SCREENS.includes(screen)) return;
    const onLoggedOutScreen = LOGGED_OUT_SCREENS.includes(screen);

    if (!session) {
      if (!onLoggedOutScreen) router.replace('/');
    } else if (!isProfileComplete(profile)) {
      if (screen !== 'setup-profile') router.replace('/setup-profile');
    } else if (onLoggedOutScreen || screen === 'setup-profile') {
      router.replace('/homepage');
    }
  }, [initialized, loading, session, profile, segments, router]);

  if (!fontsReady || !initialized) return null;

  return (
  <Stack screenOptions={{ animation: 'none', headerShown: false }}>
    <Stack.Screen name="(tabs)" />
    <Stack.Screen
      name="user/[id]"
      options={{
        headerShown: true,
        title: '',
        headerBackTitle: 'Back',
        animation: 'slide_from_right',
      }}
    />
  </Stack>
);
}
