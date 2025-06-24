// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

let app;

// The Firebase configuration is hardcoded here to ensure it's always available.
const firebaseConfig: FirebaseOptions = {
    apiKey: "AIzaSyDwbBNq7AkDGzlwXPOTnIeb_IlvxEZRvT8",
    authDomain: "ecohabits-io3bn.firebaseapp.com",
    projectId: "ecohabits-io3bn",
    storageBucket: "ecohabits-io3bn.appspot.com",
    messagingSenderId: "182712685164",
    appId: "1:182712685164:web:d875402066a24754e27e49",
};

// Initialize Firebase only if it hasn't been initialized yet
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
