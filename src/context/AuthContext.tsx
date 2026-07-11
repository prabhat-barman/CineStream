import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ApiError,
  api,
  toPublicUser,
  type AuthTokenResponseData,
  type PublicUser,
  type SignUpResponseData,
} from '../lib/api';
import {
  SocialSignInCancelled,
  signInWithAppleNative,
  signInWithGoogleNative,
  signOutGoogle,
} from '../lib/oauth';

const ACCESS_KEY = 'cinestream.auth.accessToken';
const REFRESH_KEY = 'cinestream.auth.refreshToken';
const USER_KEY = 'cinestream.auth.user';

type AuthStatus = 'loading' | 'unauthenticated' | 'authenticated';

type AuthContextValue = {
  status: AuthStatus;
  user: PublicUser | null;
  token: string | null;
  refreshToken: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  // Signup no longer authenticates — it kicks off the OTP flow and returns
  // the server response (userId, dev otp, etc.) so the UI can navigate to the
  // OTP verification screen.
  signUp: (input: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
  }) => Promise<SignUpResponseData>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export {SocialSignInCancelled};

// Thrown when the backend hasn't shipped the /auth/oauth/* endpoint yet.
export class SocialNotEnabledError extends Error {
  constructor(provider: 'Google' | 'Apple') {
    super(
      `${provider} sign-in isn’t enabled on the server yet. Please continue with email + password.`,
    );
    this.name = 'SocialNotEnabledError';
  }
}

export function AuthProvider({children}: {children: React.ReactNode}) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<PublicUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const persistSession = useCallback(
    async (
      nextAccess: string | null,
      nextRefresh: string | null,
      nextUser: PublicUser | null,
    ) => {
      if (nextAccess && nextUser) {
        await Promise.all([
          AsyncStorage.setItem(ACCESS_KEY, nextAccess),
          nextRefresh
            ? AsyncStorage.setItem(REFRESH_KEY, nextRefresh)
            : AsyncStorage.removeItem(REFRESH_KEY),
          AsyncStorage.setItem(USER_KEY, JSON.stringify(nextUser)),
        ]);
      } else {
        await Promise.all([
          AsyncStorage.removeItem(ACCESS_KEY),
          AsyncStorage.removeItem(REFRESH_KEY),
          AsyncStorage.removeItem(USER_KEY),
        ]);
      }
    },
    [],
  );

  const applySession = useCallback((tokens: AuthTokenResponseData) => {
    const nextUser = toPublicUser(tokens.user);
    setToken(tokens.accessToken);
    setRefreshToken(tokens.refreshToken);
    setUser(nextUser);
    setStatus('authenticated');
    return nextUser;
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [storedAccess, storedRefresh, storedUser] = await Promise.all([
          AsyncStorage.getItem(ACCESS_KEY),
          AsyncStorage.getItem(REFRESH_KEY),
          AsyncStorage.getItem(USER_KEY),
        ]);
        if (cancelled) {
          return;
        }
        if (!storedAccess || !storedUser) {
          setStatus('unauthenticated');
          return;
        }
        try {
          const parsedUser = JSON.parse(storedUser) as PublicUser;
          setToken(storedAccess);
          setRefreshToken(storedRefresh);
          setUser(parsedUser);
          setStatus('authenticated');
        } catch {
          await persistSession(null, null, null);
          setStatus('unauthenticated');
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
  }, [persistSession]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const res = await api.auth.login({email, password});
      const nextUser = applySession(res);
      await persistSession(res.accessToken, res.refreshToken, nextUser);
    },
    [applySession, persistSession],
  );

  const signUp = useCallback<AuthContextValue['signUp']>(async input => {
    // Signup only creates the pending account + sends OTP. The user is NOT
    // authenticated until /auth/ott/verify-otp succeeds.
    return api.auth.signUp({
      email: input.email,
      password: input.password,
      fullName: input.fullName,
      phone: input.phone,
    });
  }, []);

  const verifyOtp = useCallback(
    async (email: string, otp: string) => {
      const res = await api.auth.verifyOtp({email, otp});
      const nextUser = applySession(res);
      await persistSession(res.accessToken, res.refreshToken, nextUser);
    },
    [applySession, persistSession],
  );

  const signInWithGoogle = useCallback(async () => {
    const google = await signInWithGoogleNative();
    try {
      const res = await api.auth.oauthGoogle({
        idToken: google.idToken,
        email: google.email,
        name: google.name,
      });
      const nextUser = applySession(res);
      await persistSession(res.accessToken, res.refreshToken, nextUser);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        throw new SocialNotEnabledError('Google');
      }
      throw err;
    }
  }, [applySession, persistSession]);

  const signInWithApple = useCallback(async () => {
    const apple = await signInWithAppleNative();
    try {
      const res = await api.auth.oauthApple({
        identityToken: apple.identityToken,
        email: apple.email,
        name: apple.name,
      });
      const nextUser = applySession(res);
      await persistSession(res.accessToken, res.refreshToken, nextUser);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        throw new SocialNotEnabledError('Apple');
      }
      throw err;
    }
  }, [applySession, persistSession]);

  const signOut = useCallback(async () => {
    await persistSession(null, null, null);
    try {
      await signOutGoogle();
    } catch {
      // ignore
    }
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    setStatus('unauthenticated');
  }, [persistSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      token,
      refreshToken,
      signIn,
      signUp,
      verifyOtp,
      signInWithGoogle,
      signInWithApple,
      signOut,
    }),
    [
      status,
      user,
      token,
      refreshToken,
      signIn,
      signUp,
      verifyOtp,
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
