"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import * as Lucide from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, Award, Trophy, Gift, Upload, Star, Pencil, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { challenges } from "@/lib/challenges-data";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth, type Activity } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const iconMap: { [key: string]: React.ElementType } = {
  Trophy: Lucide.Trophy,
  ReceiptText: Lucide.ReceiptText,
  Star: Lucide.Star,
  Gift: Lucide.Gift,
};

const DeserializeIcon = ({ icon }: { icon: Activity['icon'] }) => {
  if (!icon || !icon.type) return <Lucide.HelpCircle className="w-5 h-5 text-muted-foreground" />;
  const IconComponent = iconMap[icon.type];
  if (!IconComponent) return <Lucide.HelpCircle className="w-5 h-5 text-muted-foreground" />;
  return <IconComponent {...icon.props} />;
};


export default function ProfilePage() {
  const { user, updateAvatar, updateName } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const ongoingChallenges = challenges.slice(0, 2);

  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [formattedActivities, setFormattedActivities] = useState<({description: string, id: string, date: string, icon: Activity['icon']})[]>([]);

  const sortedActivities = useMemo(() => {
    if (!user?.activities) return [];
    return [...user.activities].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [user?.activities]);

  useEffect(() => {
    if (user) {
      setNewName(user.name);
    }
    const newFormattedActivities = sortedActivities.slice(0, 5).map(activity => ({
      ...activity,
      date: new Date(activity.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
    }));
    setFormattedActivities(newFormattedActivities);
  }, [user, sortedActivities]);


  const handleAvatarClick = () => {
    inputFileRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await updateAvatar(file);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
    } catch (error) {
      toast({ title: "Logout Failed", description: "Could not log you out. Please try again.", variant: "destructive" });
    }
  };

  const handleSaveName = async () => {
    if (newName.trim() && newName !== user?.name) {
      await updateName(newName.trim());
    }
    setIsEditingName(false);
  };
  
  const handleCancelEdit = () => {
    if (user) setNewName(user.name);
    setIsEditingName(false);
  };
  
  if (!user) {
    return null; // Or a loading indicator
  }

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center p-4 border-b bg-card">
          <SidebarTrigger className="mr-4 md:hidden" />
          <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground font-headline">Profile</h1>
              <p className="text-muted-foreground">Manage your account and track your progress.</p>
          </div>
      </header>
      <main className="flex-1 p-4 overflow-y-auto sm:p-6 md:p-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-8 md:col-span-1">
            <Card>
              <CardHeader className="items-center text-center">
                <div className="relative">
                  <Avatar className="w-24 h-24 mb-4 cursor-pointer" onClick={handleAvatarClick}>
                    <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="person face" />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute bottom-4 right-0 w-8 h-8 rounded-full"
                    onClick={handleAvatarClick}
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                  <input
                    type="file"
                    ref={inputFileRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
                {!isEditingName ? (
                  <div className="flex items-center gap-2">
                    <CardTitle>{user.name}</CardTitle>
                    <Button variant="ghost" size="icon" className="w-6 h-6 rounded-full" onClick={() => setIsEditingName(true)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center w-full max-w-sm gap-2">
                    <Input 
                      value={newName} 
                      onChange={(e) => setNewName(e.target.value)} 
                      className="h-9 text-xl font-semibold text-center"
                      onKeyDown={(e) => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') handleCancelEdit()}}
                      autoFocus
                    />
                    <Button variant="outline" size="icon" className="w-9 h-9" onClick={handleSaveName}>
                      <Check className="w-4 h-4 text-green-600" />
                    </Button>
                    <Button variant="outline" size="icon" className="w-9 h-9" onClick={handleCancelEdit}>
                      <X className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                )}
                <CardDescription className="w-full truncate">{user.email}</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 text-center">
                 <div className="p-2 rounded-md bg-secondary/50">
                    <div className="flex items-center justify-center gap-2 text-2xl font-bold text-accent">
                        <Gift className="w-6 h-6" />
                        {user.points.toLocaleString()}
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">EcoPoints</span>
                 </div>
                 <div className="p-2 rounded-md bg-secondary/50">
                    <div className="flex items-center justify-center gap-2 text-2xl font-bold text-primary">
                        <Star className="w-6 h-6" />
                        {user.impactScore.toLocaleString()}
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">Impact Score</span>
                 </div>
              </CardContent>
            </Card>
             <Card>
                <CardContent className="p-4 space-y-2">
                     <Button variant="outline" className="justify-start w-full" asChild>
                        <Link href="/settings">
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                        </Link>
                    </Button>
                    <Button variant="destructive" className="justify-start w-full" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </Button>
                </CardContent>
             </Card>
          </div>
          <div className="space-y-8 md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Trophy className="text-primary"/> Ongoing Challenges</CardTitle>
                <CardDescription>
                  Keep up the great work!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {ongoingChallenges.map(challenge => (
                    <div key={challenge.id}>
                         <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{challenge.title}</span>
                            <span className="text-sm text-muted-foreground">{challenge.reward}</span>
                        </div>
                        <Progress value={challenge.progress} />
                    </div>
                ))}
              </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Award className="text-accent"/> Recent Activity</CardTitle>
                 <CardDescription>
                  Your latest contributions to a greener planet.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 {formattedActivities.length > 0 ? (
                   <ul className="space-y-4">
                     {formattedActivities.map(activity => (
                       <li key={activity.id} className="flex items-center gap-4">
                         <div className="p-2 rounded-full bg-secondary">
                           <DeserializeIcon icon={activity.icon} />
                         </div>
                         <div className="flex-grow">
                           <p className="text-sm">{activity.description}</p>
                         </div>
                         <time className="text-xs text-muted-foreground whitespace-nowrap">
                           {activity.date}
                         </time>
                       </li>
                     ))}
                   </ul>
                 ) : (
                    <p className="text-sm text-muted-foreground">No recent activity to show.</p>
                 )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
