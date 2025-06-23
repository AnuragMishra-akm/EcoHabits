"use client";

import { useState } from "react";
import { challenges } from "@/lib/challenges-data";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Award, Users, CheckCircle } from "lucide-react";
import { Logo } from "@/components/icons/logo";
import { Badge } from "@/components/ui/badge";

type ChallengeDetailsPageProps = {
  params: {
    challengeId: string;
  };
};

export default function ChallengeDetailsPage({ params }: ChallengeDetailsPageProps) {
  const [isJoined, setIsJoined] = useState(false);
  const challenge = challenges.find((c) => c.id === params.challengeId);

  if (!challenge) {
    notFound();
  }

  const handleJoinChallenge = () => {
    setIsJoined(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-2">
          <Logo className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-headline">
            Challenge Details
          </h1>
        </div>
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </header>
      <main className="flex items-center justify-center flex-1 p-4 sm:p-6 md:p-8">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
                <div>
                    <Badge variant="secondary" className="mb-2">{challenge.sponsor}</Badge>
                    <CardTitle className="flex items-center gap-3 text-3xl">
                        {challenge.icon}
                        {challenge.title}
                    </CardTitle>
                    <CardDescription className="mt-2">{challenge.description}</CardDescription>
                </div>
                <div className="flex flex-col items-center p-4 text-center rounded-lg bg-accent/20">
                    <Award className="w-8 h-8 text-accent" />
                    <span className="mt-1 font-bold text-accent">{challenge.reward}</span>
                </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2 text-sm text-muted-foreground">
                <span>Your Progress</span>
                <span className="font-semibold text-foreground">{challenge.progress}%</span>
              </div>
              <Progress value={challenge.progress} className="h-4" />
            </div>
            <div className="flex items-center p-4 rounded-lg bg-secondary/50">
                <Users className="w-6 h-6 mr-4 text-primary" />
                <div>
                    <p className="font-bold">{challenge.participants.toLocaleString()} participants</p>
                    <p className="text-sm text-muted-foreground">have joined this challenge.</p>
                </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              size="lg"
              onClick={handleJoinChallenge}
              disabled={isJoined}
            >
              {isJoined ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Challenge Joined!
                </>
              ) : (
                "Join Challenge"
              )}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
