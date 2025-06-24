// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

let firebaseConfig: FirebaseOptions;

// On Firebase App Hosting, a FIREBASE_WEBAPP_CONFIG environment variable is automatically
// set with the client-side config for the associated Firebase project. We can parse this
// to initialize the SDK.
if (process.env.FIREBASE_WEBAPP_CONFIG) {
  firebaseConfig = JSON.parse(process.env.FIREBASE_WEBAPP_CONFIG);
} else {
  // Otherwise, we'll fall back to the NEXT_PUBLIC_ variables for local development.
  // This is what the .env file is used for.
  firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
