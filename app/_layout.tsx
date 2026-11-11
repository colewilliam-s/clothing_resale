import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native'
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

type Route = '/' | '/setup-profile' | 'homepage';

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

  const screen = segments[0] ?? 'index';
  const isOpenScreen = OPEN_SCREENS.includes(screen);
  const onLoggedOutScreen = LOGGED_OUT_SCREENS.includes(screen);

  // Where this person belongs right now, or null if they're already there
  // (or we can't tell yet). Same rules as before, just computed during render.
  let target: Route | null = null;
  if (initialized && !loading && !isOpenScreen) {
    if (!session) {
      if (!onLoggedOutScreen) target = '/';
    } else if (!isProfileComplete(profile)) {
      if (screen !== 'setup-profile') target = '/setup-profile';
    } else if (onLoggedOutScreen || screen === 'setup-profile') {
      target = 'homepage';
    }
  }

  // Hide the native splash once fonts are ready. The spinner below covers the session check.
  useEffect(() => {
    if (fontsReady) SplashScreen.hideAsync();
  }, [fontsReady]);

  useEffect(() => {
    if (target) router.replace(target);
  }, [target, router]);

  if (!fontsReady) return null;

  // Cover the app while we check the saved session, wait for the profile,
  // or have a redirect that hasn't happened yet
  const covered = !initialized || (!isOpenScreen && (loading || target !== null));

  return (
    <>
      {initialized ? (
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
      ) : null}
      {covered ? (
        <View style={cover.overlay}>
          <ActivityIndicator size="large" />
        </View>
      ) : null}
    </>
  );
}

const cover = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});