// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

let app;
let firebaseConfig: FirebaseOptions;

// When deployed on App Hosting, the config is provided as a single JSON string via apphosting.yaml.
// For local development, we construct it from the individual .env variables.
if (process.env.NEXT_PUBLIC_FIREBASE_CONFIG) {
    try {
        firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG);
    } catch (e) {
        console.error("Could not parse NEXT_PUBLIC_FIREBASE_CONFIG. Check your apphosting.yaml.", e);
        throw new Error("Firebase configuration from NEXT_PUBLIC_FIREBASE_CONFIG is invalid.");
    }
} else {
    // This block is for local development using the .env file
    firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };
}

// A final check to ensure the config object is valid before initializing
if (!firebaseConfig?.apiKey) {
  throw new Error("Firebase configuration is missing or incomplete. For local development, ensure your .env file is set up correctly. For deployed environments, check your App Hosting configuration.");
}

// Initialize Firebase only if it hasn't been initialized yet
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
