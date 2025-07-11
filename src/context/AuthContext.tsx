
"use client";

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, FieldValue, increment, runTransaction } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { fileToDataUri } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

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
        name: string;
        variant: 'primary' | 'accent' | 'default';
    };
}

interface AuthContextType {
    user: UserProfile | null;
    firebaseUser: FirebaseUser | null;
    loading: boolean;
    updateAvatar: (file: File) => Promise<void>;
    updateName: (newName: string) => Promise<void>;
    addPoints: (amount: number) => Promise<void>;
    addActivity: (activity: Omit<Activity, 'id' | 'date'>) => Promise<void>;
    completeOnboarding: () => Promise<void>;
    updateImpactScore: (score: number, pointsToAdd: number) => Promise<void>;
    redeemReward: (rewardId: string, pointsToDeduct: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
    
    const addActivity = async (activity: Omit<Activity, 'id' | 'date'>) => {
        if (!firebaseUser || !user) return;
        
        const newActivity: Activity = {
            ...activity,
            id: new Date().getTime().toString(),
            date: new Date().toISOString(),
        };
        
        try {
            const userRef = doc(db, 'users', firebaseUser.uid);
            await updateDoc(userRef, {
                activities: arrayUnion(newActivity)
            });
            
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
        try {
            const userRef = doc(db, 'users', firebaseUser.uid);
            await updateDoc(userRef, { points: increment(amount) });
            setUser(prev => prev ? { ...prev, points: prev.points + amount } : null);
        } catch (error) {
            console.error("Error adding points:", error);
            toast({ title: "Error", description: "Could not update points.", variant: "destructive" });
        }
    };

    const updateImpactScore = async (score: number, pointsToAdd: number) => {
        if (!firebaseUser) return;
        
        const userRef = doc(db, 'users', firebaseUser.uid);
        let activitiesToAdd: Activity[] = [];
    
        try {
            await runTransaction(db, async (transaction) => {
                const userDoc = await transaction.get(userRef);
                if (!userDoc.exists()) {
                    throw new Error("User document does not exist!");
                }
    
                const newTimestamp = new Date().toISOString();
                
                const scoreActivity: Activity = {
                    id: `${Date.now()}-score`,
                    date: newTimestamp,
                    description: `Calculated a new Impact Score of ${score}.`,
                    icon: { name: "Star", variant: 'primary' },
                };
    
                // Initialize with the correct type to avoid inference error
                activitiesToAdd = [scoreActivity];
    
                if (pointsToAdd > 0) {
                    const bonusActivity: Activity = {
                        id: `${Date.now()}-points`,
                        date: newTimestamp,
                        description: `Earned ${pointsToAdd} bonus points for a high Impact Score!`,
                        icon: { name: "Gift", variant: 'accent' },
                    };
                    activitiesToAdd.push(bonusActivity);
                }
    
                transaction.update(userRef, { 
                    impactScore: score,
                    points: increment(pointsToAdd),
                    activities: arrayUnion(...activitiesToAdd),
                });
            });
    
            // This state update now runs *after* the transaction has successfully committed.
            setUser(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    impactScore: score,
                    points: prev.points + pointsToAdd,
                    activities: [...prev.activities, ...activitiesToAdd],
                };
            });
    
        } catch (error) {
            console.error("Error updating impact score:", error);
            toast({
                title: "Could not add impact score",
                description: "There was a problem saving your score. Please try again later.",
                variant: "destructive",
            });
        }
    };
    
    const redeemReward = async (rewardId: string, pointsToDeduct: number) => {
        if (!firebaseUser || !user) return;
        if (user.points < pointsToDeduct) throw new Error("Not enough points");
        
        try {
            const userRef = doc(db, 'users', firebaseUser.uid);
            
            await updateDoc(userRef, {
                points: increment(-pointsToDeduct),
                claimedRewards: arrayUnion(rewardId)
            });

            setUser(prev => {
                if (!prev) return null;
                return { 
                    ...prev, 
                    points: prev.points - pointsToDeduct, 
                    claimedRewards: [...prev.claimedRewards, rewardId] 
                }
            });

             await addActivity({
                description: `Redeemed a reward for ${pointsToDeduct} points.`,
                icon: { name: "Gift", variant: 'accent' },
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
