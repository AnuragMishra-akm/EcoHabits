"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Lightbulb, Trophy, Gift } from "lucide-react";

export default function OnboardingPage() {
  const { user, completeOnboarding } = useAuth();
  const router = useRouter();

  const handleComplete = async () => {
    await completeOnboarding();
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-lg text-center animate-fade-in">
        <CardHeader>
          <CardTitle className="text-3xl">Welcome to EcoHabits, {user?.name}!</CardTitle>
          <CardDescription>Your journey to a more sustainable lifestyle starts now.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 text-left sm:grid-cols-3">
            <div className="p-4 rounded-lg bg-secondary/50">
              <Lightbulb className="w-8 h-8 mb-2 text-primary" />
              <h3 className="font-semibold">Track Your Impact</h3>
              <p className="text-sm text-muted-foreground">Scan receipts and compare products to see your carbon footprint.</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <Trophy className="w-8 h-8 mb-2 text-accent" />
              <h3 className="font-semibold">Join Challenges</h3>
              <p className="text-sm text-muted-foreground">Participate in challenges to make a bigger difference and earn points.</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <Gift className="w-8 h-8 mb-2 text-yellow-500" />
              <h3 className="font-semibold">Earn Rewards</h3>
              <p className="text-sm text-muted-foreground">Redeem your EcoPoints for exciting, sustainable rewards.</p>
            </div>
          </div>
          <Button size="lg" onClick={handleComplete}>Let's Get Started!</Button>
        </CardContent>
      </Card>
    </div>
  );
}
