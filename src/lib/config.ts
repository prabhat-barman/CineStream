import {Platform} from 'react-native';

const HOSTS = {
  ios: 'http://localhost:4000',
  android: 'http://10.0.2.2:4000',
} as const;

// Override via `EXPO_PUBLIC_API_URL` / `API_URL` at build time if you like.
// For a physical device, set this to your Mac's LAN IP, e.g. http://192.168.1.42:4000
const envOverride =
  (globalThis as any).process?.env?.API_URL ??
  (globalThis as any).process?.env?.EXPO_PUBLIC_API_URL;

export const API_URL: string =
  envOverride ??
  (Platform.OS === 'android' ? HOSTS.android : HOSTS.ios);

// ------------------------------
// OAuth
// ------------------------------
// Google: the "Web" OAuth 2.0 Client ID from Google Cloud Console.
// It's used as the audience of the ID token you send to the backend, and
// MUST be one of the values in the server's GOOGLE_CLIENT_IDS allow-list.
export const GOOGLE_WEB_CLIENT_ID: string =
  (globalThis as any).process?.env?.GOOGLE_WEB_CLIENT_ID ??
  'REPLACE_WITH_YOUR_GOOGLE_WEB_CLIENT_ID.apps.googleusercontent.com';

// iOS Google client id (only needed when running Google Sign-In on iOS via
// react-native-google-signin). Leave blank to fall back to auto-detection
// from GoogleService-Info.plist.
export const GOOGLE_IOS_CLIENT_ID: string | undefined =
  (globalThis as any).process?.env?.GOOGLE_IOS_CLIENT_ID;
