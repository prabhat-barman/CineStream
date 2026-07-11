# Beta distribution — Firebase App Distribution

CineStream distributes Android beta builds through
[Firebase App Distribution](https://firebase.google.com/products/app-distribution).
No paid Google Play Console account needed.

- Firebase project: **cinestream-1464c**
- Android app ID: **1:55460051377:android:44de0ae4a092b408a6e590**
- Package name: **com.cinestream**

---

## One-time setup

### 1. Sign in to Firebase (once per machine)

```bash
npm run firebase:login
```

A browser window opens — sign in with the Google account that owns
the Firebase project (or that has "App Distribution Admin" access on it).

### 2. Create the "testers" group (once per Firebase project)

1. Open <https://console.firebase.google.com/project/cinestream-1464c/appdistribution>
2. Go to the **Testers & Groups** tab.
3. Click **Add group** → name it **`testers`** exactly.
4. Add tester emails (one per line). Each tester will get an invite
   email the first time you ship a build to them.

> The group alias `testers` is referenced by the `distribute:android`
> npm script. If you rename the group, update that script too.

---

## Shipping a new beta build

1. Update `RELEASE_NOTES.md` at the repo root — write what's new for
   testers. Anything in that file is emailed to testers verbatim.

2. Run the distribute script:

   ```bash
   npm run distribute:android
   ```

   This does three things:
   - `./gradlew clean assembleRelease` — builds a release APK
     (currently signed with the debug keystore; fine for beta).
   - Uploads the APK to Firebase App Distribution.
   - Notifies everyone in the `testers` group by email.

3. Testers install:
   - Open the invite email on their Android phone.
   - Install the **App Tester** app when prompted (one-time).
   - Tap the download button — the APK installs directly.

---

## Handy variants

Ship to specific emails without touching the Firebase group:

```bash
firebase appdistribution:distribute android/app/build/outputs/apk/release/app-release.apk \
  --app 1:55460051377:android:44de0ae4a092b408a6e590 \
  --testers "friend1@gmail.com,friend2@gmail.com" \
  --release-notes-file RELEASE_NOTES.md
```

Ship an AAB instead of an APK (Play-style bundle):

```bash
cd android && ./gradlew clean bundleRelease && cd ..
firebase appdistribution:distribute android/app/build/outputs/bundle/release/app-release.aab \
  --app 1:55460051377:android:44de0ae4a092b408a6e590 \
  --release-notes-file RELEASE_NOTES.md \
  --groups testers
```

---

## Before going to production

The release build currently reuses the **debug keystore** — this is
fine for beta testers but **must be replaced before Play Store
launch**. Steps:

1. Generate a proper release keystore:

   ```bash
   keytool -genkeypair -v -storetype PKCS12 \
     -keystore android/app/release.keystore \
     -alias cinestream-release -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Store the passwords in `~/.gradle/gradle.properties` (never in
   the repo):

   ```
   CINESTREAM_UPLOAD_STORE_FILE=release.keystore
   CINESTREAM_UPLOAD_KEY_ALIAS=cinestream-release
   CINESTREAM_UPLOAD_STORE_PASSWORD=...
   CINESTREAM_UPLOAD_KEY_PASSWORD=...
   ```

3. Add a `release` signing config in `android/app/build.gradle` that
   reads those properties and wire it into `buildTypes.release`.

4. Extract the release SHA-1:

   ```bash
   keytool -list -v -alias cinestream-release -keystore android/app/release.keystore
   ```

5. Register that SHA-1 in the Google Cloud Console (under the same
   OAuth client that the debug SHA-1 was registered on) so Google
   Sign-In works in the release build.
