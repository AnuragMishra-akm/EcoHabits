# Firebase Studio

This is a NextJS starter in Firebase Studio.

## Getting Started

To get started, take a look at `src/app/(app)/page.tsx`.

## Firebase Setup

This project is configured to use Firebase for authentication and data storage. To connect to your own Firebase project, you need to create a `.env` file in the root of the project and add your Firebase configuration details.

1.  **Create the `.env` file:**
    ```bash
    touch .env
    ```

2.  **Add your Firebase credentials to `.env`:**
    ```
    NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY"
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
    NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_APP_ID"
    ```

You can find these values in your Firebase project settings under "General".
