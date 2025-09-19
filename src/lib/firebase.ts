'use client';

import {initializeApp, getApps, getApp} from 'firebase/app';
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDmHiD8E2_STaSpOZs6oWcIRaKdrFOKpBo",
  authDomain: "studio-14718198-fcccd.firebaseapp.com",
  projectId: "studio-14718198-fcccd",
  storageBucket: "studio-14718198-fcccd.appspot.com",
  messagingSenderId: "1029381899721",
  appId: "1:1029381899721:web:7bed7584f9e99dac57d418"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export {app, auth, db, provider};
