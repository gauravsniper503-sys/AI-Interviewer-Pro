import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'studio-14718198-fcccd',
  appId: '1:1029381899721:web:7bed7584f9e99dac57d418',
  apiKey: 'AIzaSyDmHiD8E2_STaSpOZs6oWcIRaKdrFOKpBo',
  authDomain: 'studio-14718198-fcccd.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '1029381899721',
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
