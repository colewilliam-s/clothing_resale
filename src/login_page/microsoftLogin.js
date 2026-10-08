import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { supabase } from '../supabase';

//there are some enforcements on manual signin for testing. these won't stay for the actual product

WebBrowser.maybeCompleteAuthSession();

export async function signInWithMicrosoft() {
  const redirectTo = Linking.createURL('auth-callback');
  console.log('reDirectTo:', redirectTo);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'azure',
    options: { redirectTo, skipBrowserRedirect: true, scopes: 'email' /*, queryParams: {prompt: 'login'}*/ }, // queryParams: enforce a manual signin everytime the button is pressed
  });
  if (error) return { ok: false, message: error.message };

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo, /*{preferEphemeralSession: true}*/); // preferEphemeralSession enforces a manual singin everytime the button is pressed
  if (result.type !== 'success') return { ok: false, message: 'Sign-in cancelled.' };

  // Handle both PKCE (?code=) and implicit (#access_token=) responses
  const url = result.url;
  const query = new URLSearchParams(url.split('?')[1]?.split('#')[0] ?? '');
  const hash = new URLSearchParams(url.split('#')[1] ?? '');

  if (query.get('code')) {
    const { error } = await supabase.auth.exchangeCodeForSession(query.get('code'));
    return error ? { ok: false, message: error.message } : { ok: true };
  }
  if (hash.get('access_token')) {
    const { error } = await supabase.auth.setSession({
      access_token: hash.get('access_token'),
      refresh_token: hash.get('refresh_token'),
    });
    return error ? { ok: false, message: error.message } : { ok: true };
  }
  return { ok: false, message: 'No session returned.' };
}