import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import {api} from '../lib/api';
import {onForegroundMessage} from '../lib/pushNotifications';
import {useAuth} from './AuthContext';

/**
 * Cheap, cross-screen shared state for the notifications bell + list.
 *
 * The bell in the Home header needs to know the unread count. The
 * NotificationsScreen needs the same, plus it triggers refetches when the
 * user marks things read. Hoisting the count to a context avoids duplicate
 * polling and keeps the badge in sync with what the screen just did.
 *
 * The context deliberately only holds the *count* — full list pagination
 * stays inside NotificationsScreen so we don't bloat memory across
 * navigations.
 */

type Ctx = {
  unreadCount: number;
  refresh: () => Promise<void>;
  /**
   * Optimistic decrement — used by the list screen after a successful
   * mark-read call so the badge updates without a round-trip.
   */
  markLocal: (delta: number) => void;
  reset: () => void;
};

const NotificationsContext = createContext<Ctx | undefined>(undefined);

// Auto-refresh cadence when the app is in the foreground. Balances
// "badge feels live" vs. server load. Push handlers already trigger
// refreshes on message receipt, so this is a fallback for lost push.
const FOREGROUND_POLL_MS = 60_000;

export function NotificationsProvider({children}: {children: React.ReactNode}) {
  const {status, token} = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const inflightRef = useRef<Promise<void> | null>(null);
  const tokenRef = useRef<string | null>(null);
  tokenRef.current = token;

  const refresh = useCallback(async () => {
    const current = tokenRef.current;
    if (!current) return;
    // Coalesce parallel callers so the bell + screen + push handler don't
    // all fire three requests when the app returns to foreground.
    if (inflightRef.current) {
      await inflightRef.current;
      return;
    }
    const p = (async () => {
      try {
        const res = await api.notifications.unreadCount({token: current});
        setUnreadCount(res.count);
      } catch {
        // Non-fatal — keep the previous count, retry on next tick.
      }
    })();
    inflightRef.current = p;
    try {
      await p;
    } finally {
      inflightRef.current = null;
    }
  }, []);

  const markLocal = useCallback((delta: number) => {
    setUnreadCount(prev => Math.max(0, prev + delta));
  }, []);

  const reset = useCallback(() => {
    setUnreadCount(0);
  }, []);

  // Refresh on auth change + on interval + on foreground.
  useEffect(() => {
    if (status !== 'authenticated') {
      setUnreadCount(0);
      return undefined;
    }
    void refresh();
    const interval = setInterval(() => {
      void refresh();
    }, FOREGROUND_POLL_MS);
    const onAppState = (next: AppStateStatus) => {
      if (next === 'active') {
        void refresh();
      }
    };
    const sub = AppState.addEventListener('change', onAppState);
    // Refresh immediately when a foreground push lands so the bell tick
    // matches what the user just saw.
    const unsubPush = onForegroundMessage(() => {
      void refresh();
    });
    return () => {
      clearInterval(interval);
      sub.remove();
      unsubPush();
    };
  }, [status, refresh]);

  const value = useMemo<Ctx>(
    () => ({unreadCount, refresh, markLocal, reset}),
    [unreadCount, refresh, markLocal, reset],
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotificationsBadge(): Ctx {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error(
      'useNotificationsBadge must be used inside NotificationsProvider',
    );
  }
  return ctx;
}
