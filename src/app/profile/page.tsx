"use client";

import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, Award, Trophy, Gift, Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { challenges } from "@/lib/challenges-data";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useUser } from "@/context/UserContext";
import { fileToDataUri } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { user, points, activities, updateAvatar } = useUser();
  const { toast } = useToast();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const ongoingChallenges = challenges.slice(0, 2);

  const handleAvatarClick = () => {
    inputFileRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const dataUri = await fileToDataUri(file);
        updateAvatar(dataUri);
        toast({
          title: "Avatar Updated",
          description: "Your new profile picture has been saved.",
        });
      } catch (error) {
        toast({
          title: "Upload Failed",
          description: "Could not upload the selected image. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const formatActivityDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  };

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
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                 <div className="flex items-center justify-center gap-2 text-2xl font-bold text-accent">
                    <Gift className="w-6 h-6" />
                    {points.toLocaleString()}
                    <span className="text-lg font-medium text-muted-foreground">points</span>
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
                    <Button variant="destructive" className="justify-start w-full">
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
                 {activities.length > 0 ? (
                   <ul className="space-y-4">
                     {activities.slice(0, 5).map(activity => (
                       <li key={activity.id} className="flex items-center gap-4">
                         <div className="p-2 rounded-full bg-secondary">
                           {activity.icon}
                         </div>
                         <div className="flex-grow">
                           <p className="text-sm">{activity.description}</p>
                         </div>
                         <time className="text-xs text-muted-foreground whitespace-nowrap">
                           {formatActivityDate(activity.date)}
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
