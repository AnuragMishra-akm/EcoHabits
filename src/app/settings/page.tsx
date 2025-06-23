"use client"

import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Moon, Sun } from "lucide-react";

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex flex-col h-full">
            <header className="flex items-center p-4 border-b bg-card">
                <SidebarTrigger className="mr-4 md:hidden" />
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground font-headline">Settings</h1>
                    <p className="text-muted-foreground">Customize your app experience.</p>
                </div>
            </header>
            <main className="flex-1 p-4 overflow-y-auto sm:p-6 md:p-8">
                <div className="max-w-2xl mx-auto space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Appearance</CardTitle>
                            <CardDescription>Change how the app looks and feels.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="theme-switch" className="flex items-center gap-2">
                                    {theme === 'dark' || (theme ==='system' && window.matchMedia('(prefers-color-scheme: dark)').matches) ? <Moon /> : <Sun />}
                                    <span>Dark Mode</span>
                                </Label>
                                <Switch
                                    id="theme-switch"
                                    checked={theme === 'dark'}
                                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                                />
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Notifications</CardTitle>
                            <CardDescription>Manage your notification preferences.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="flex items-center justify-between">
                                <Label htmlFor="challenge-notifs">New Challenge Alerts</Label>
                                <Switch id="challenge-notifs" />
                            </div>
                             <div className="flex items-center justify-between">
                                <Label htmlFor="reward-notifs">Reward Updates</Label>
                                <Switch id="reward-notifs" defaultChecked/>
                            </div>
                             <div className="flex items-center justify-between">
                                <Label htmlFor="progress-notifs">Weekly Progress Summary</Label>
                                <Switch id="progress-notifs" defaultChecked/>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
