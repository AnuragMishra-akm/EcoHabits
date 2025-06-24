// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

let app;
let firebaseConfig: FirebaseOptions;

// For deployed environments, App Hosting provides the config as a JSON string.
if (process.env.NEXT_PUBLIC_FIREBASE_CONFIG) {
    try {
        firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG);
    } catch (e) {
        console.error("Could not parse NEXT_PUBLIC_FIREBASE_CONFIG", e);
        throw new Error("Firebase configuration from environment is invalid.");
    }
} else {
    // For local development, use the individual keys from .env
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
