"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Gift, ArrowRight } from "lucide-react";
import { rewards } from "@/lib/rewards-data";
import Link from "next/link";

type EcoPointsCardProps = {
  className?: string;
};

export function EcoPointsCard({ className }: EcoPointsCardProps) {
  const popularRewards = rewards.slice(0, 2);
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <CardTitle>EcoPoints Rewards</CardTitle>
        <CardDescription>Redeem your points for rewards.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col justify-between flex-1">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
             <Gift className="w-10 h-10 text-accent" />
            <span className="text-5xl font-bold text-foreground">5,400</span>
          </div>
          <p className="text-sm text-muted-foreground">points available</p>
        </div>
        <div className="mt-6 space-y-3">
            <h3 className="text-sm font-semibold text-center text-muted-foreground">Popular Rewards</h3>
            <Separator />
          {popularRewards.map((reward) => (
            <div key={reward.id} className="flex items-center justify-between p-2 rounded-lg bg-background">
              <div>
                <p className="text-sm font-medium">{reward.name}</p>
                <p className="text-xs text-accent">{reward.points.toLocaleString()} pts</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/rewards/${reward.id}`}>Redeem</Link>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
         <Button variant="outline" className="w-full" asChild>
            <Link href="/rewards">
                All Rewards
                <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
