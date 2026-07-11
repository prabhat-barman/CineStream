import {Platform} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
  isSuccessResponse,
} from '@react-native-google-signin/google-signin';
import appleAuth from '@invertase/react-native-apple-authentication';
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
  const webMissing = isPlaceholder(GOOGLE_WEB_CLIENT_ID);
  const iosMissing = isPlaceholder(GOOGLE_IOS_CLIENT_ID);

  if (Platform.OS === 'ios' && iosMissing) {
    throw new Error(
      "Google Sign-In isn't configured for iOS yet. Add your iOS OAuth " +
        'Client ID to src/lib/config.ts (GOOGLE_IOS_CLIENT_ID) and the ' +
        'iOS URL scheme to ios/CineStream/Info.plist, then rebuild.',
    );
  }
  if (Platform.OS === 'android' && webMissing) {
    throw new Error(
      "Google Sign-In isn't configured for Android yet. Add your Web " +
        'OAuth Client ID to src/lib/config.ts (GOOGLE_WEB_CLIENT_ID) and ' +
        'register your Android app (package + SHA-1) in Google Console.',
    );
  }
  GoogleSignin.configure({
    webClientId: webMissing ? undefined : GOOGLE_WEB_CLIENT_ID,
    iosClientId: iosMissing ? undefined : GOOGLE_IOS_CLIENT_ID,
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
    // DEVELOPER_ERROR (code 10 on Android) is almost always a misconfigured
    // OAuth client — usually one of:
    //   1. SHA-1 of the signing keystore not registered in Google Cloud /
    //      Firebase console for this package (com.cinestream).
    //   2. `webClientId` in src/lib/config.ts belongs to a different Google
    //      Cloud project than the one the Android app is registered in.
    //   3. `google-services.json` is stale — re-download after adding SHA-1.
    // Surface a user-actionable message so testers stop guessing.
    // Note: the library's TypeScript surface doesn't expose DEVELOPER_ERROR
    // even though the native module emits it, so compare by string literal.
    if (code === 'DEVELOPER_ERROR' || code === '10') {
      throw new Error(
        Platform.OS === 'android'
          ? "Google Sign-In isn't set up correctly for this build. " +
            "Register this app's SHA-1 fingerprint in Google Cloud Console " +
            'under the same project as the Web Client ID, then reinstall.'
          : "Google Sign-In isn't set up correctly for this build. " +
            'Verify the iOS OAuth Client ID and URL scheme.',
      );
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

  // NOTE: the enums `AppleRequestOperation` / `AppleRequestScope` exist only
  // as TypeScript types in `@invertase/react-native-apple-authentication` and
  // are `undefined` at runtime. Use the values exposed on the module instance
  // instead (`appleAuth.Operation.LOGIN`, `appleAuth.Scope.*`).
  const response = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
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
