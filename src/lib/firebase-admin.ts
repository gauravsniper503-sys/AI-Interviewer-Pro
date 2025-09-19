import admin from 'firebase-admin';

// This guard prevents re-initializing the app in hot-reload environments.
if (!admin.apps.length) {
  try {
    // When deployed to a Google Cloud environment, the GOOGLE_APPLICATION_CREDENTIALS
    // environment variable is automatically set.
    // The `initializeApp` function without arguments will use these credentials.
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
       admin.initializeApp({
         credential: admin.credential.applicationDefault(),
       });
    } else {
       // For local development, you might not have this env var set.
       // In that case, `initializeApp` will look for credentials in default locations.
       // As a fallback, it might connect to the emulator if FIREBASE_AUTH_EMULATOR_HOST is set.
       admin.initializeApp();
    }
  } catch (e) {
    console.error('Firebase admin initialization error', e);
  }
}

export const db = admin.firestore();
export const authAdmin = admin.auth();
