import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Gift } from "lucide-react";

type EcoPointsCardProps = {
  className?: string;
};

const rewards = [
  { name: "10% off at GreenLeaf Cafe", points: 1000 },
  { name: "$5 Voucher for EcoWear", points: 2500 },
  { name: "Free Coffee at The Organic Bean", points: 500 },
];

export function EcoPointsCard({ className }: EcoPointsCardProps) {
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
          {rewards.map((reward) => (
            <div key={reward.name} className="flex items-center justify-between p-2 rounded-lg bg-background">
              <div>
                <p className="text-sm font-medium">{reward.name}</p>
                <p className="text-xs text-accent">{reward.points.toLocaleString()} pts</p>
              </div>
              <Button variant="outline" size="sm">Redeem</Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
