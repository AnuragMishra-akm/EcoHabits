"use client";

import Link from "next/link";
import Image from "next/image";
import { rewards, type Reward } from "@/lib/rewards-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const getBrandLogoHint = (brand: string) => {
    if (brand.toLowerCase().includes('cafe')) return 'cafe logo';
    if (brand.toLowerCase().includes('wear')) return 'clothing logo';
    if (brand.toLowerCase().includes('bean')) return 'coffee logo';
    if (brand.toLowerCase().includes('living')) return 'lifestyle logo';
    return 'logo';
}

function RewardCard({ reward, isClaimed, userPoints }: { reward: Reward, isClaimed: boolean, userPoints: number }) {
    const canAfford = userPoints >= reward.points;
    
    return (
        <Card className={cn(isClaimed && "bg-muted/50")}>
            <CardHeader className="flex-row items-center gap-4 space-y-0">
                <Image
                    src={reward.brandLogoUrl}
                    alt={`${reward.brand} Logo`}
                    width={48}
                    height={48}
                    className="rounded-full"
                    data-ai-hint={getBrandLogoHint(reward.brand)}
                />
                <div className="flex-1">
                    <CardTitle className="text-base">{reward.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{reward.brand}</p>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-accent">{reward.points.toLocaleString()} points</div>
                    <Button asChild variant={isClaimed ? "secondary" : "default"} disabled={!isClaimed && !canAfford}>
                         <Link href={`/rewards/${reward.id}`}>
                            {isClaimed ? "View" : "Redeem"}
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default function AllRewardsPage() {
  const { user } = useAuth();
  const claimedRewardIds = user?.claimedRewards ?? [];
  const userPoints = user?.points ?? 0;

  const claimedRewards = rewards.filter(r => claimedRewardIds.includes(r.id));
  const unclaimedRewards = rewards.filter(r => !claimedRewardIds.includes(r.id));

  return (
     <div className="flex flex-col h-full">
        <header className="flex items-center p-4 border-b bg-card">
            <SidebarTrigger className="mr-4 md:hidden" />
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground font-headline">Rewards Store</h1>
                <p className="text-muted-foreground">Use your EcoPoints to claim exclusive rewards.</p>
            </div>
        </header>
        <main className="flex-1 p-4 overflow-y-auto sm:p-6 md:p-8">
            <Tabs defaultValue="unclaimed">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="unclaimed">
                        Available Rewards
                        <Badge variant="secondary" className="ml-2">{unclaimedRewards.length}</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="claimed">
                        Claimed
                        <Badge variant="secondary" className="ml-2">{claimedRewards.length}</Badge>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="unclaimed" className="mt-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {unclaimedRewards.map(reward => <RewardCard key={reward.id} reward={reward} isClaimed={false} userPoints={userPoints} />)}
                    </div>
                </TabsContent>
                <TabsContent value="claimed" className="mt-6">
                     <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {claimedRewards.map(reward => <RewardCard key={reward.id} reward={reward} isClaimed={true} userPoints={userPoints}/>)}
                    </div>
                </TabsContent>
            </Tabs>
        </main>
    </div>
  );
}