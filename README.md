# Firebase Studio

This is a NextJS starter in Firebase Studio.

## Getting Started

To get started, take a look at `src/app/(app)/page.tsx`.

## Firebase Setup

This project is configured to use Firebase for authentication and data storage. To connect to your Firebase project, you need to provide your Firebase configuration keys. The method depends on whether you are running the app locally or deploying it.

### Local Development

For running the app on your local machine, you must create a `.env` file in the root of the project.

1.  **Create the `.env` file:**
    ```bash
    touch .env
    ```

2.  **Add your Firebase public keys to `.env`:**
    ```
    NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY"
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
    NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_APP_ID"
    ```

You can find these values in your Firebase project settings under "General" > "Your apps" > "SDK setup and configuration".

### Deployment on Firebase App Hosting

When you deploy this app using Firebase App Hosting, you do **not** need to set any environment variables in the Firebase Console for the client-side Firebase connection.

Firebase App Hosting automatically provides the necessary Firebase configuration to your app during the build and deployment process. The code in `src/lib/firebase.ts` is set up to use this automatic configuration when deployed, so no manual steps are required.
