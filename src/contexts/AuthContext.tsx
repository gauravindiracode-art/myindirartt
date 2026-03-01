import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthChange, ensureUserDoc, signInWithGoogle, signInWithMicrosoft, signOutUser } from '../api/authApi';
import type { AppUser } from '../api/types';

interface AuthState {
  user: AppUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithMicrosoft: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signInWithMicrosoft: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        const appUser = await ensureUserDoc(firebaseUser);
        setUser(appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleGoogleSignIn = async () => {
    const appUser = await signInWithGoogle();
    setUser(appUser);
  };

  const handleMicrosoftSignIn = async () => {
    const appUser = await signInWithMicrosoft();
    setUser(appUser);
  };

  const signOut = async () => {
    await signOutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle: handleGoogleSignIn, signInWithMicrosoft: handleMicrosoftSignIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
