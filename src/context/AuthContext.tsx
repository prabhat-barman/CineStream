import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {api, ApiError, type PublicUser} from '../lib/api';
import {
  signInWithAppleNative,
  signInWithGoogleNative,
  signOutGoogle,
} from '../lib/oauth';

const TOKEN_KEY = 'cinestream.auth.token';
const USER_KEY = 'cinestream.auth.user';

type AuthStatus = 'loading' | 'unauthenticated' | 'authenticated';

type AuthContextValue = {
  status: AuthStatus;
  user: PublicUser | null;
  token: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({children}: {children: React.ReactNode}) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<PublicUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const persist = useCallback(
    async (nextToken: string | null, nextUser: PublicUser | null) => {
      if (nextToken && nextUser) {
        await Promise.all([
          AsyncStorage.setItem(TOKEN_KEY, nextToken),
          AsyncStorage.setItem(USER_KEY, JSON.stringify(nextUser)),
        ]);
      } else {
        await Promise.all([
          AsyncStorage.removeItem(TOKEN_KEY),
          AsyncStorage.removeItem(USER_KEY),
        ]);
      }
    },
    [],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem(TOKEN_KEY),
          AsyncStorage.getItem(USER_KEY),
        ]);
        if (!storedToken || !storedUser) {
          if (!cancelled) {
            setStatus('unauthenticated');
          }
          return;
        }
        try {
          const {user: freshUser} = await api.auth.me(storedToken);
          if (cancelled) {
            return;
          }
          setToken(storedToken);
          setUser(freshUser);
          setStatus('authenticated');
        } catch (err) {
          if (err instanceof ApiError && err.status === 401) {
            await Promise.all([
              AsyncStorage.removeItem(TOKEN_KEY),
              AsyncStorage.removeItem(USER_KEY),
            ]);
            if (!cancelled) {
              setStatus('unauthenticated');
            }
          } else {
            const parsedUser = JSON.parse(storedUser) as PublicUser;
            if (!cancelled) {
              setToken(storedToken);
              setUser(parsedUser);
              setStatus('authenticated');
            }
          }
        }
      } catch {
        if (!cancelled) {
          setStatus('unauthenticated');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const res = await api.auth.login({email, password});
      await persist(res.token, res.user);
      setToken(res.token);
      setUser(res.user);
      setStatus('authenticated');
    },
    [persist],
  );

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      const res = await api.auth.register({name, email, password});
      await persist(res.token, res.user);
      setToken(res.token);
      setUser(res.user);
      setStatus('authenticated');
    },
    [persist],
  );

  const signInWithGoogle = useCallback(async () => {
    const {idToken} = await signInWithGoogleNative();
    const res = await api.auth.socialGoogle({idToken});
    await persist(res.token, res.user);
    setToken(res.token);
    setUser(res.user);
    setStatus('authenticated');
  }, [persist]);

  const signInWithApple = useCallback(async () => {
    const {identityToken, name, email} = await signInWithAppleNative();
    const res = await api.auth.socialApple({identityToken, name, email});
    await persist(res.token, res.user);
    setToken(res.token);
    setUser(res.user);
    setStatus('authenticated');
  }, [persist]);

  const signOut = useCallback(async () => {
    await persist(null, null);
    await signOutGoogle();
    setToken(null);
    setUser(null);
    setStatus('unauthenticated');
  }, [persist]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      token,
      signIn,
      signUp,
      signInWithGoogle,
      signInWithApple,
      signOut,
    }),
    [
      status,
      user,
      token,
      signIn,
      signUp,
      signInWithGoogle,
      signInWithApple,
      signOut,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
