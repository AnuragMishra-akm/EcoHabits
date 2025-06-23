import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TreePine, Zap, Droplets } from "lucide-react";

type ImpactScoreCardProps = {
  className?: string;
};

export function ImpactScoreCard({ className }: ImpactScoreCardProps) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <CardTitle>Your Impact Score</CardTitle>
        <CardDescription>Your positive contribution this month.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center flex-1 text-center">
        <div className="relative mb-4">
          <div className="text-6xl font-bold text-primary animate-pulse">
            1,250
          </div>
          <div className="absolute top-0 flex items-center justify-center w-full h-full text-sm font-semibold text-primary">
            CO₂ kg
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TreePine className="w-5 h-5 text-green-600" />
            <span>Equivalent to planting 5 trees</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span>Saved 450 kWh of energy</span>
          </div>
           <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Droplets className="w-5 h-5 text-blue-500" />
            <span>Conserved 2,000L of water</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
