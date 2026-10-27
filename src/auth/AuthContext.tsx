import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { saveSession, getSession, clearSession } from './session';

// data for the authentication state
type AuthState = {
    session: string | null; // whether the session is active or not
    isLoading: boolean; // is the user loading in or not
    signIn: (value: string) => Promise<void>; // is the user signed in
    signOut: () => Promise<void>; // is the user signed out
};

// creating the state for authentication
const AuthContext = createContext<AuthState | null>(null);

// handling session logic
export function AuthProvider({ children }: { children: ReactNode }) {
    // constants for logic
    const [session, setSession] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // setting the session and loading
    useEffect(() => {
        getSession()
            .then(setSession)
            .finally(() => setIsLoading(false));
    }, []);

    // signing in
    const signIn = async (value: string) => {
        await saveSession(value);
        setSession(value);
    };

    // signing out
    const signOut = async () => {
        await clearSession();
        setSession(null);
    };

    // returning the general area that the user was last on (if they were signed in)
    return (
        <AuthContext.Provider value={{ session, isLoading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const userAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}
