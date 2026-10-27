import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { saveSession, getSession, clearSession } from './session';

type AuthState = {
    session: string | null;
    isLoading: boolean;
    signIn: (value: string) => Promise<void>;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getSession()
            .then(setSession)
            .finally(() => setIsLoading(false));
    }, []);

    const signIn = async (value: string) => {
        await saveSession(value);
        setSession(value);
    };

    const signOut = async () => {
        await clearSession();
        setSession(null);
    };

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