"use client";

import React, { createContext, useState, useEffect, useContext, ReactNode, ReactElement } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { fileToDataUri } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Trophy } from 'lucide-react';

export interface UserProfile {
    uid: string;
    name: string;
    email: string;
    avatar: string;
    mobile?: string;
    hasOnboarded: boolean;
    points: number;
    activities: Activity[];
}

export interface Activity {
    id: string;
    description: string;
    date: string;
    icon: {
        type: string;
        props: any;
    };
}

interface AuthContextType {
    user: UserProfile | null;
    firebaseUser: FirebaseUser | null;
    loading: boolean;
    updateAvatar: (file: File) => Promise<void>;
    addPoints: (amount: number) => Promise<void>;
    addActivity: (activity: Omit<Activity, 'id' | 'date'> & { icon: ReactElement }) => Promise<void>;
    completeOnboarding: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to serialize React element for Firestore
const serializeIcon = (icon: ReactElement) => {
    return {
        type: (icon.type as any).name,
        props: icon.props,
    };
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setFirebaseUser(user);
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    setUser(userDoc.data() as UserProfile);
                } else {
                    // This case might happen if user is created but doc fails
                    console.log("No user document found, but user is authenticated.");
                    setUser(null);
                }
            } else {
                setFirebaseUser(null);
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const updateUserInFirestore = async (uid: string, data: Partial<UserProfile>) => {
        if (!uid) return;
        try {
            const userRef = doc(db, 'users', uid);
            await updateDoc(userRef, data);
            setUser((prev) => (prev ? { ...prev, ...data } : null));
        } catch (error) {
            console.error("Error updating user document:", error);
            toast({ title: "Error", description: "Could not update your profile.", variant: "destructive" });
        }
    };

    const updateAvatar = async (file: File) => {
        if (!firebaseUser) return;
        try {
            const dataUri = await fileToDataUri(file);
            await updateUserInFirestore(firebaseUser.uid, { avatar: dataUri });
            toast({ title: "Avatar Updated", description: "Your new profile picture has been saved." });
        } catch (error) {
            toast({ title: "Upload Failed", description: "Could not upload the image.", variant: "destructive" });
        }
    };

    const addPoints = async (amount: number) => {
        if (!firebaseUser || !user) return;
        const newPoints = (user.points || 0) + amount;
        await updateUserInFirestore(firebaseUser.uid, { points: newPoints });
    };

    const addActivity = async (activity: Omit<Activity, 'id' | 'date'> & { icon: ReactElement }) => {
        if (!firebaseUser) return;
        
        const newActivity = {
            ...activity,
            id: new Date().getTime().toString(),
            date: new Date().toISOString(),
            icon: serializeIcon(activity.icon)
        };
        
        await updateUserInFirestore(firebaseUser.uid, {
            activities: arrayUnion(newActivity)
        });
    };

    const completeOnboarding = async () => {
        if (!firebaseUser) return;
        await updateUserInFirestore(firebaseUser.uid, { hasOnboarded: true });
    };

    const value = {
        user,
        firebaseUser,
        loading,
        updateAvatar,
        addPoints,
        addActivity,
        completeOnboarding
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
