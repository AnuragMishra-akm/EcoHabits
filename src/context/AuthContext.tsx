
"use client";

import React, { createContext, useState, useEffect, useContext, ReactNode, ReactElement } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, FieldValue, increment } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { fileToDataUri } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Star, Gift } from 'lucide-react';

export interface UserProfile {
    uid: string;
    name: string;
    email: string;
    avatar: string;
    mobile?: string;
    hasOnboarded: boolean;
    points: number;
    impactScore: number;
    activities: Activity[];
    claimedRewards: string[];
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
    updateName: (newName: string) => Promise<void>;
    addPoints: (amount: number) => Promise<void>;
    addActivity: (activity: Omit<Activity, 'id' | 'date'> & { icon: ReactElement }) => Promise<void>;
    completeOnboarding: () => Promise<void>;
    updateImpactScore: (score: number, pointsToAdd: number) => Promise<void>;
    redeemReward: (rewardId: string, pointsToDeduct: number) => Promise<void>;
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
        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            if (authUser) {
                setFirebaseUser(authUser);
                const userDoc = await getDoc(doc(db, 'users', authUser.uid));
                if (userDoc.exists()) {
                    setUser(userDoc.data() as UserProfile);
                } else {
                    console.warn("User document not found. Creating a new profile.");
                    const newUserProfile: UserProfile = {
                        uid: authUser.uid,
                        email: authUser.email || "",
                        name: authUser.displayName || "New User",
                        avatar: authUser.photoURL || `https://placehold.co/100x100.png?text=${(authUser.email || "U").charAt(0).toUpperCase()}`,
                        hasOnboarded: false,
                        points: 0,
                        impactScore: 0,
                        activities: [],
                        claimedRewards: [],
                    };
                    try {
                        await setDoc(doc(db, "users", authUser.uid), newUserProfile);
                        setUser(newUserProfile);
                    } catch (error) {
                        console.error("Failed to create recovery user profile:", error);
                        toast({ title: "Login Error", description: "Could not retrieve or create your user profile.", variant: "destructive" });
                        await auth.signOut();
                    }
                }
            } else {
                setFirebaseUser(null);
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [toast]);
    
    const addActivity = async (activity: Omit<Activity, 'id' | 'date'> & { icon: ReactElement }) => {
        if (!firebaseUser || !user) return;
        
        const newActivity = {
            ...activity,
            id: new Date().getTime().toString(),
            date: new Date().toISOString(),
            icon: serializeIcon(activity.icon)
        };
        
        try {
            const userRef = doc(db, 'users', firebaseUser.uid);
            const updatePayload = {
                activities: arrayUnion(newActivity)
            } as { activities: FieldValue };
            
            await updateDoc(userRef, updatePayload);
            
            setUser(prev => prev ? { ...prev, activities: [...prev.activities, newActivity] } : null);
        } catch (error) {
            console.error("Error adding activity:", error);
            toast({ title: "Error", description: "Could not add activity.", variant: "destructive" });
        }
    };

    const updateAvatar = async (file: File) => {
        if (!firebaseUser) return;
        try {
            const dataUri = await fileToDataUri(file);
            const userRef = doc(db, 'users', firebaseUser.uid);
            await updateDoc(userRef, { avatar: dataUri });
            setUser(prev => prev ? { ...prev, avatar: dataUri } : null);
            toast({ title: "Avatar Updated", description: "Your new profile picture has been saved." });
        } catch (error) {
            toast({ title: "Upload Failed", description: "Could not upload the image.", variant: "destructive" });
        }
    };

    const updateName = async (newName: string) => {
        if (!firebaseUser) return;
        if (newName.trim().length < 2) {
            toast({
                title: "Invalid Name",
                description: "Name must be at least 2 characters.",
                variant: "destructive",
            });
            return;
        }

        try {
            const userRef = doc(db, 'users', firebaseUser.uid);
            await updateDoc(userRef, { name: newName });
            setUser(prev => prev ? { ...prev, name: newName } : null);
            toast({ title: "Name Updated", description: "Your name has been successfully updated." });
        } catch (error) {
            console.error("Error updating name:", error);
            toast({ title: "Update Failed", description: "Could not update your name.", variant: "destructive" });
        }
    };

    const addPoints = async (amount: number) => {
        if (!firebaseUser || !user) return;
        const newPoints = user.points + amount;
        try {
            const userRef = doc(db, 'users', firebaseUser.uid);
            await updateDoc(userRef, { points: newPoints });
            setUser(prev => prev ? { ...prev, points: newPoints } : null);
        } catch (error) {
            console.error("Error adding points:", error);
            toast({ title: "Error", description: "Could not update points.", variant: "destructive" });
        }
    };

    const updateImpactScore = async (score: number, pointsToAdd: number) => {
        if (!firebaseUser) return;
        
        const userRef = doc(db, 'users', firebaseUser.uid);
        const newTimestamp = new Date().toISOString();

        try {
            // Step 1: Get the most up-to-date user document.
            const userDoc = await getDoc(userRef);
            if (!userDoc.exists()) {
                throw new Error("User document does not exist.");
            }
            const currentUserData = userDoc.data() as UserProfile;

            // Step 2: Prepare the new activities.
            const scoreActivity = {
                id: `${new Date().getTime()}-score`,
                date: newTimestamp,
                description: `Calculated a new Impact Score of ${score}.`,
                icon: serializeIcon(<Star className="w-5 h-5 text-primary" />),
            };

            const newActivities = [scoreActivity];
            if (pointsToAdd > 0) {
                const bonusActivity = {
                    id: `${new Date().getTime()}-points`,
                    date: newTimestamp,
                    description: `Earned ${pointsToAdd} bonus points for a high Impact Score!`,
                    icon: serializeIcon(<Gift className="w-5 h-5 text-accent" />),
                };
                newActivities.push(bonusActivity);
            }

            // Step 3: Construct the full new user profile object.
            const updatedUserData: UserProfile = {
                ...currentUserData,
                impactScore: score,
                points: (currentUserData.points || 0) + pointsToAdd,
                activities: [...(currentUserData.activities || []), ...newActivities],
            };
            
            // Step 4: Overwrite the document with the new data.
            await setDoc(userRef, updatedUserData);

            // Step 5: Update the local state with the new data.
            setUser(updatedUserData);

        } catch (error) {
            console.error("Error updating impact score:", error);
            toast({ title: "Could not add impact score", description: "There was a problem saving your score. Please try again later.", variant: "destructive" });
        }
    };
    
    const redeemReward = async (rewardId: string, pointsToDeduct: number) => {
        if (!firebaseUser || !user) return;
        if (user.points < pointsToDeduct) throw new Error("Not enough points");

        const newPoints = user.points - pointsToDeduct;
        
        try {
            const userRef = doc(db, 'users', firebaseUser.uid);
            const updatePayload: { points: number; claimedRewards: FieldValue } = {
                points: newPoints,
                claimedRewards: arrayUnion(rewardId)
            };
            await updateDoc(userRef, updatePayload);
            setUser(prev => prev ? { ...prev, points: newPoints, claimedRewards: [...prev.claimedRewards, rewardId] } : null);

             await addActivity({
                description: `Redeemed a reward for ${pointsToDeduct} points.`,
                icon: <Gift className="w-5 h-5 text-accent" />,
            });
        } catch(error) {
            console.error("Error redeeming reward:", error);
            toast({ title: "Error", description: "Could not redeem reward.", variant: "destructive" });
        }
    };

    const completeOnboarding = async () => {
        if (!firebaseUser) return;
        try {
            const userRef = doc(db, 'users', firebaseUser.uid);
            await updateDoc(userRef, { hasOnboarded: true });
            setUser(prev => prev ? { ...prev, hasOnboarded: true } : null);
        } catch (error) {
            console.error("Error completing onboarding:", error);
            toast({ title: "Error", description: "Could not complete onboarding.", variant: "destructive" });
        }
    };

    const value = {
        user,
        firebaseUser,
        loading,
        updateAvatar,
        updateName,
        addPoints,
        addActivity,
        completeOnboarding,
        updateImpactScore,
        redeemReward
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
