"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { LoaderCircle } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user && !user.hasOnboarded && pathname !== '/onboarding') {
            router.push('/onboarding');
        }
    }, [user, pathname, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <LoaderCircle className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return null; // or a redirect component
    }

    if (!user.hasOnboarded && pathname !== '/onboarding') {
        return (
             <div className="flex items-center justify-center h-screen bg-background">
                <LoaderCircle className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }
    
    if (pathname === '/onboarding') {
        return <main>{children}</main>;
    }

    return (
        <SidebarProvider>
            <Sidebar collapsible="icon">
                <SidebarNav />
            </Sidebar>
            <SidebarInset>
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
