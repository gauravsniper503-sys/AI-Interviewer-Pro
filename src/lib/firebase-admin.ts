import admin from 'firebase-admin';

if (!admin.apps.length) {
    // Check if the GOOGLE_APPLICATION_CREDENTIALS environment variable is set.
    // This is useful for local development. In a deployed environment,
    // Application Default Credentials should be automatically discovered.
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        try {
            const serviceAccount = JSON.parse(
              require('fs').readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'utf8')
            );
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
          } catch(e) {
            console.log("Could not parse GOOGLE_APPLICATION_CREDENTIALS, trying default initialization", e);
            admin.initializeApp();
          }
    } else {
        // For environments like Cloud Run, initialize without explicit credentials.
        admin.initializeApp();
    }
}


export const db = admin.firestore();
export const authAdmin = admin.auth();
