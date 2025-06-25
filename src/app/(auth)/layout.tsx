"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import { Logo } from "@/components/icons/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // If loading is finished and we have a user, redirect to the main app.
        // AppLayout will then handle the redirect to onboarding if necessary.
        if (!loading && user) {
            router.push('/');
        }
    }, [user, loading, router]);

    // While the auth state is loading, show a spinner to prevent flashing the login/signup page.
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-secondary/50">
                <LoaderCircle className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }
    
    // If loading is finished and there's no user, show the login/signup page.
    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-secondary/50">
                <div className="flex items-center gap-3 mb-8">
                    <Logo className="w-10 h-10 text-primary"/>
                    <h1 className="text-4xl font-bold text-foreground font-headline">EcoHabits</h1>
                </div>
                {children}
            </div>
        );
    }

    // If loading is finished and there is a user, we're about to redirect. Show a spinner.
    return (
        <div className="flex items-center justify-center min-h-screen bg-secondary/50">
            <LoaderCircle className="w-8 h-8 animate-spin text-primary" />
        </div>
    );
}
