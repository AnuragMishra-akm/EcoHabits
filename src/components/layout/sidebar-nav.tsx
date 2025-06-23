"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Logo } from "@/components/icons/logo";
import { LayoutDashboard, Trophy, Gift, User, Settings, LogOut, Scale } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/challenges", label: "Challenges", icon: Trophy },
  { href: "/rewards", label: "Rewards", icon: Gift },
  { href: "/compare", label: "Compare", icon: Scale },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
        await signOut(auth);
        router.push('/login');
        toast({ title: "Logged Out", description: "You have been successfully logged out." });
    } catch (error) {
        toast({ title: "Logout Failed", description: "Could not log you out. Please try again.", variant: "destructive" });
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-4">
        <Logo className="w-8 h-8 text-primary" />
        <span className="text-xl font-bold group-data-[collapsible=icon]:hidden">EcoHabits</span>
      </div>
      <SidebarMenu className="flex-1 p-2">
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))}
              tooltip={{ children: item.label }}
            >
              <Link href={item.href}>
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <div className="p-2 mt-auto">
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton tooltip={{ children: "Logout" }} onClick={handleLogout}>
                    <LogOut />
                    <span>Logout</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </div>
  );
}
