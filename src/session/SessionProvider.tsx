// Keeps track of who is logged in and their profile, for the whole app.
// Any screen can read it with useSession().

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../supabase';
import { fetchMyProfile } from '../profile/api';
import type { ProfileDetails } from '../types';

type SessionState = {
  session: Session | null;
  profile: ProfileDetails | null;
  initialized: boolean; // true once the first login check has finished
  loading: boolean; // true until the current user's profile has loaded
  refreshProfile: () => Promise<void>;
};

const SessionContext = createContext<SessionState | null>(null);

async function loadProfile(userId: string | null) {
  if (!userId) return null;
  try {
    return await fetchMyProfile(userId);
  } catch (e) {
    console.log('Profile load failed:', e instanceof Error ? e.message : e);
    return null;
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [profile, setProfile] = useState<ProfileDetails | null>(null);
  // whose profile is currently loaded: a user id, null for logged out, undefined before the first load
  const [loadedFor, setLoadedFor] = useState<string | null | undefined>(undefined);

  const userId = session?.user.id ?? null;

  // Still loading until the profile we have belongs to whoever is logged in now.
  // Worked out on every render, so there's never a moment where a new login looks like "no profile".
  const loading = !authChecked || loadedFor !== userId;

  // Listen for log in and log out. Supabase restores a saved session on app start.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthChecked(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setAuthChecked(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Load the profile whenever a different user logs in (or out)
  useEffect(() => {
    if (!authChecked) return;
    let cancelled = false;
    loadProfile(userId).then((p) => {
      if (cancelled) return; // a newer login happened while this was loading
      setProfile(p);
      setLoadedFor(userId);
    });
    return () => {
      cancelled = true;
    };
  }, [authChecked, userId]);

  // For screens that just changed the profile, like setup and edit
  const refreshProfile = useCallback(async () => {
    setProfile(await loadProfile(userId));
    setLoadedFor(userId);
  }, [userId]);

  return (
    <SessionContext.Provider
      value={{ session, profile, initialized: loadedFor !== undefined, loading, refreshProfile }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error('useSession must be used inside SessionProvider');
  return value;
}
