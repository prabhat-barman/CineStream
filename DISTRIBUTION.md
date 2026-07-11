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

There are two paths — automated (recommended) and manual.

### Path A — Automated via GitHub Actions (default)

Every push to `main` triggers `.github/workflows/distribute-android.yml`
which builds a release APK on GitHub-hosted Ubuntu and uploads it to
Firebase App Distribution under the `testers` group. Release notes for
each build are auto-generated from the latest commit message.

Docs-only, iOS-only, and `.github/**` changes are skipped so you don't
waste CI minutes on non-code updates. You can also trigger a build
manually from the GitHub **Actions** tab (`Run workflow`).

One-time CI setup (see the "Configuring GitHub Actions" section
below) requires adding a `FIREBASE_SERVICE_ACCOUNT` repo secret.

### Path B — Manual from your machine

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

## Configuring GitHub Actions (one-time)

The CI workflow authenticates to Firebase using a **service account
JSON key**. Steps:

### 1. Create the service account

1. Open the Google Cloud Console for this Firebase project:
   <https://console.cloud.google.com/iam-admin/serviceaccounts?project=cinestream-1464c>
2. Click **Create service account**.
   - Name: `github-actions-app-distribution`
   - ID: leave auto-generated.
   - Description: `Uploads Android betas to Firebase App Distribution from CI`.
3. Click **Create and continue**.
4. Under **Grant this service account access**, add these roles:
   - `Firebase App Distribution Admin`
   - `Firebase Viewer` *(needed for CLI project lookups)*
5. Click **Done**.

### 2. Generate a JSON key

1. Click the newly created service account.
2. Go to the **Keys** tab.
3. **Add key → Create new key → JSON**. A JSON file downloads —
   treat it like a password, never commit it.

### 3. Add it as a GitHub secret

1. Open the repo on GitHub:
   <https://github.com/prabhat-barman/CineStream/settings/secrets/actions>
2. **New repository secret**.
   - Name: `FIREBASE_SERVICE_ACCOUNT`
   - Value: paste the **entire JSON file contents**.
3. **Add secret**.

### 4. Verify the `testers` group exists in Firebase

The workflow ships to the `testers` group. Create it once at
<https://console.firebase.google.com/project/cinestream-1464c/appdistribution>
under **Testers & Groups → Add group**, name it exactly `testers`,
and add tester emails. Without this group the CI step fails with a
404 at the "distributing to testers/groups" line.

### 5. Trigger the first CI run

Push any commit to `main` (or open the Actions tab and run the
workflow manually). If the secret and group are set up correctly you
should see the APK appear on the Firebase console within ~5 minutes.

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
