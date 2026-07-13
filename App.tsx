import React, {useEffect, useRef} from 'react';
import {StatusBar} from 'react-native';
import {
  NavigationContainer,
  DarkTheme,
  createNavigationContainerRef,
} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {RootNavigator, RootStackParamList} from './src/navigation/RootNavigator';
import {AuthProvider} from './src/context/AuthContext';
import {NotificationsProvider} from './src/context/NotificationsContext';
import {colors} from './src/theme/colors';
import {
  initPushHandlers,
  setNotificationTapHandler,
  NotificationTapPayload,
} from './src/lib/pushNotifications';

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.background,
    text: colors.textPrimary,
    primary: colors.brand,
    border: colors.divider,
  },
};

// A single ref shared with the notification tap handler. Kept at module
// scope (rather than inside the component) so the handler installed in
// index.js's headless task can reach it via imports if we ever need to.
const navRef = createNavigationContainerRef<RootStackParamList>();

/**
 * Route a notification tap to the correct screen. Falls back to the
 * Notifications list when we don't know how to interpret the payload.
 */
function handleNotificationTap(payload: NotificationTapPayload) {
  if (!navRef.isReady()) return;

  // Prefer explicit routing hints over URL parsing.
  if (payload.webSeriesId) {
    navRef.navigate('MovieDetails', {id: payload.webSeriesId});
    return;
  }
  if (payload.episodeId) {
    navRef.navigate('Player', {id: payload.episodeId});
    return;
  }
  if (payload.deepLink) {
    // Simple cinestream://webseries/<id> and cinestream://player/<id>
    // handling. Anything richer should get its own case above.
    const match = /^cinestream:\/\/([^/]+)\/([^?#]+)/.exec(payload.deepLink);
    if (match) {
      const [, kind, id] = match;
      if (kind === 'webseries') {
        navRef.navigate('MovieDetails', {id});
        return;
      }
      if (kind === 'player') {
        navRef.navigate('Player', {id});
        return;
      }
    }
  }
  navRef.navigate('Notifications');
}

function App() {
  // Wire foreground FCM handlers exactly once per JS lifetime.
  const teardownRef = useRef<null | (() => void)>(null);
  useEffect(() => {
    teardownRef.current = initPushHandlers();
    return () => {
      teardownRef.current?.();
      teardownRef.current = null;
    };
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <AuthProvider>
        <NotificationsProvider>
          <NavigationContainer
            ref={navRef}
            theme={navTheme}
            onReady={() => {
              // The tap handler needs a live navigation ref. Registering it
              // here (rather than in useEffect) means any push tap that
              // arrives *before* the first render still lands correctly —
              // pushNotifications.ts queues taps until a handler exists.
              setNotificationTapHandler(handleNotificationTap);
            }}>
            <RootNavigator />
          </NavigationContainer>
        </NotificationsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;
