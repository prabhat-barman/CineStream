import {Platform} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
  isSuccessResponse,
} from '@react-native-google-signin/google-signin';
import appleAuth, {
  AppleRequestOperation,
  AppleRequestScope,
} from '@invertase/react-native-apple-authentication';
import {GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID} from './config';

// ------------------------------
// Google
// ------------------------------

let googleConfigured = false;

function isPlaceholder(id: string | undefined | null): boolean {
  return (
    !id ||
    id.startsWith('REPLACE_WITH_') ||
    id === 'YOUR_GOOGLE_CLIENT_ID'
  );
}

function ensureGoogleConfigured() {
  if (googleConfigured) {
    return;
  }
  if (isPlaceholder(GOOGLE_WEB_CLIENT_ID) && isPlaceholder(GOOGLE_IOS_CLIENT_ID)) {
    throw new Error(
      "Google Sign-In isn't configured yet. Add your OAuth Client IDs to " +
        'src/lib/config.ts (GOOGLE_WEB_CLIENT_ID + GOOGLE_IOS_CLIENT_ID) ' +
        'and reload — see the README for the Google Cloud Console setup.',
    );
  }
  GoogleSignin.configure({
    webClientId: isPlaceholder(GOOGLE_WEB_CLIENT_ID)
      ? undefined
      : GOOGLE_WEB_CLIENT_ID,
    iosClientId: isPlaceholder(GOOGLE_IOS_CLIENT_ID)
      ? undefined
      : GOOGLE_IOS_CLIENT_ID,
    offlineAccess: false,
    forceCodeForRefreshToken: false,
  });
  googleConfigured = true;
}

export class SocialSignInCancelled extends Error {
  constructor() {
    super('Sign in was cancelled');
    this.name = 'SocialSignInCancelled';
  }
}

export type GoogleIdTokenResult = {
  idToken: string;
  email: string;
  name?: string;
};

export async function signInWithGoogleNative(): Promise<GoogleIdTokenResult> {
  ensureGoogleConfigured();
  await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});

  try {
    const response = await GoogleSignin.signIn();
    if (!isSuccessResponse(response)) {
      throw new SocialSignInCancelled();
    }
    const {idToken, user} = response.data;
    if (!idToken) {
      throw new Error(
        'Google did not return an ID token. Check your webClientId configuration.',
      );
    }
    return {idToken, email: user.email, name: user.name ?? undefined};
  } catch (err) {
    const code = (err as {code?: string}).code;
    if (
      code === statusCodes.SIGN_IN_CANCELLED ||
      code === statusCodes.IN_PROGRESS
    ) {
      throw new SocialSignInCancelled();
    }
    throw err;
  }
}

export async function signOutGoogle(): Promise<void> {
  if (!googleConfigured) {
    return;
  }
  try {
    await GoogleSignin.signOut();
  } catch {
    // best-effort
  }
}

// ------------------------------
// Apple
// ------------------------------

export const isAppleAuthAvailable =
  Platform.OS === 'ios' && appleAuth.isSupported;

export type AppleIdentityTokenResult = {
  identityToken: string;
  name?: string;
  email?: string;
};

export async function signInWithAppleNative(): Promise<AppleIdentityTokenResult> {
  if (!isAppleAuthAvailable) {
    throw new Error('Sign in with Apple is only available on iOS 13+.');
  }

  const response = await appleAuth.performRequest({
    requestedOperation: AppleRequestOperation.LOGIN,
    requestedScopes: [AppleRequestScope.EMAIL, AppleRequestScope.FULL_NAME],
  });

  const {identityToken, fullName, email} = response;
  if (!identityToken) {
    throw new Error('Apple did not return an identity token.');
  }

  const name = [fullName?.givenName, fullName?.familyName]
    .filter(Boolean)
    .join(' ')
    .trim();

  return {
    identityToken,
    name: name || undefined,
    email: email ?? undefined,
  };
}
