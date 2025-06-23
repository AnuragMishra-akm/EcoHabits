"use client";

import { rewards } from "@/lib/rewards-data";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy, Check, Calendar, Gift, Star } from "lucide-react";
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";

export default function RedeemPage() {
  const params = useParams<{ rewardId: string }>();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const { user, redeemReward } = useAuth();
  
  const reward = rewards.find((r) => r.id === params.rewardId);

  if (!reward) {
    notFound();
  }

  const hasClaimed = user?.claimedRewards?.includes(reward.id) ?? false;
  const canAfford = (user?.points ?? 0) >= reward.points;

  const handleRedeem = async () => {
    if (!canAfford) {
      toast({
        title: "Not enough points",
        description: `You need ${reward.points.toLocaleString()} points to redeem this.`,
        variant: "destructive",
      });
      return;
    }
    if (hasClaimed) {
      toast({
        title: "Already claimed",
        description: "You have already claimed this reward.",
        variant: "destructive",
      });
      return;
    }

    try {
      await redeemReward(reward.id, reward.points);
      toast({
        title: "Reward Redeemed!",
        description: `You've successfully redeemed the ${reward.name}.`,
      });
    } catch (error) {
       toast({
        title: "Redemption Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };


  const handleCopy = () => {
    navigator.clipboard.writeText(reward.couponCode);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Coupon code copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };
  
  const getBrandLogoHint = (brand: string) => {
    if (brand.toLowerCase().includes('cafe')) return 'cafe logo';
    if (brand.toLowerCase().includes('wear')) return 'clothing logo';
    if (brand.toLowerCase().includes('bean')) return 'coffee logo';
    return 'logo';
  }

  return (
    <div className="flex flex-col h-full bg-background">
       <header className="flex items-center p-4 border-b bg-card">
          <SidebarTrigger className="mr-4 md:hidden" />
          <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground font-headline">Redeem Reward</h1>
          </div>
      </header>
      <main className="flex items-center justify-center flex-1 p-4 sm:p-6 md:p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="items-center text-center">
            <Image
              src={reward.brandLogoUrl}
              alt={`${reward.brand} Logo`}
              width={80}
              height={80}
              className="mb-4 rounded-full"
              data-ai-hint={getBrandLogoHint(reward.brand)}
            />
            <CardTitle>{reward.name}</CardTitle>
            <CardDescription>
              Redeem {reward.points.toLocaleString()} points for this reward from {reward.brand}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {hasClaimed ? (
                <div className="p-4 text-center border-2 border-dashed rounded-lg border-primary">
                <p className="text-sm text-muted-foreground">Your Coupon Code</p>
                <div className="flex items-center justify-center gap-4 mt-2">
                    <p className="text-2xl font-bold tracking-widest text-primary font-mono">
                    {reward.couponCode}
                    </p>
                    <Button variant="ghost" size="icon" onClick={handleCopy}>
                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                    </Button>
                </div>
                </div>
            ) : (
                <div className="p-4 text-center rounded-lg bg-secondary/50">
                    <p className="text-sm text-muted-foreground">You have</p>
                    <p className="text-3xl font-bold text-accent flex items-center justify-center gap-2">
                        <Gift className="w-6 h-6"/>
                        {(user?.points ?? 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">EcoPoints</p>
                </div>
            )}
            <div className="flex items-center justify-between p-3 rounded-md bg-secondary/50 text-secondary-foreground">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Expires on:</span>
                </div>
                <span className="text-sm font-semibold">{new Date(reward.expires).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </CardContent>
          <CardFooter>
            {hasClaimed ? (
                <Button className="w-full" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer">
                    Visit {reward.brand}
                </a>
                </Button>
            ) : (
                <Button className="w-full" onClick={handleRedeem} disabled={!canAfford}>
                    Redeem for {reward.points.toLocaleString()} points
                </Button>
            )}
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
