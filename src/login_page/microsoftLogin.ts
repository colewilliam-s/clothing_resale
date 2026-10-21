import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { supabase } from '../supabase';

export type AuthResult = { ok: true } | { ok: false; message: string };

//there are some enforcements on manual signin for testing. these won't stay for the actual product

WebBrowser.maybeCompleteAuthSession();

export async function signInWithMicrosoft(): Promise<AuthResult> {
  // Creating a variable for link redirection (also just testing out neovim as a code editor, so fake commit here lowkey
  const redirectTo = Linking.createURL('auth-callback');
  console.log('reDirectTo:', redirectTo);
  
  // awaiting authentication for the supabase server, specifically the azure microsoft login
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'azure',
    options: { redirectTo, skipBrowserRedirect: true, scopes: 'email', queryParams: { prompt: 'login' } }, // queryParams: enforce a manual signin everytime the button is pressed
  });
  // assuming the login fails, return the error
  if (error) return { ok: false, message: error.message };

  // actually making contact with the webserver while still awaiting verification from the redirect, and the information grabbed with the data variable
  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo, { preferEphemeralSession: true }); // preferEphemeralSession enforces a manual signin everytime the button is pressed
  // return error if operation above fails
  if (result.type !== 'success') return { ok: false, message: 'Sign-in cancelled.' };

  // Handle both PKCE (?code=) and implicit (#access_token=) responses
  const url = result.url;
  const query = new URLSearchParams(url.split('?')[1]?.split('#')[0] ?? '');
  const hash = new URLSearchParams(url.split('#')[1] ?? '');

  // grabbing the tokens that are necessary for the verification to actually happen
  const code = query.get('code');
  const accessToken = hash.get('access_token');
  const refreshToken = hash.get('refresh_token');

  // logic for verification
  if (code) {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    return exchangeError ? { ok: false, message: exchangeError.message } : { ok: true };
  }
  if (accessToken && refreshToken) {
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    return sessionError ? { ok: false, message: sessionError.message } : { ok: true };
  }
  // return the error when verification fails
  return { ok: false, message: 'No session returned.' };
}
