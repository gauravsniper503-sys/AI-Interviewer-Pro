import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    // Attempt to initialize with application default credentials
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } catch (e) {
    console.error('Failed to initialize Firebase Admin with default credentials. This is expected in a local environment if GOOGLE_APPLICATION_CREDENTIALS is not set.', e);
    // Fallback for local development if default credentials fail
    // This requires the service account file to be available
    // and the GOOGLE_APPLICATION_CREDENTIALS env var to be set.
    // In a deployed Firebase environment, applicationDefault() should work out-of-the-box.
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        console.warn('GOOGLE_APPLICATION_CREDENTIALS environment variable not set. Firebase Admin SDK might not be initialized correctly for local development.');
    }
  }
}

export const dbAdmin = admin.firestore();
