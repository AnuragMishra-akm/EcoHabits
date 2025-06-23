import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TreePine, Zap, Droplets, Sparkles, Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ImpactScoreCalculatorDialog } from "@/components/dashboard/impact-score-calculator-dialog";
import { Button } from "../ui/button";

type ImpactScoreCardProps = {
  className?: string;
};

export function ImpactScoreCard({ className }: ImpactScoreCardProps) {
  const { user } = useAuth();
  const score = user?.impactScore ?? 0;
  
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <CardTitle>Your Impact Score</CardTitle>
        <CardDescription>Your positive contribution this month.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center flex-1 text-center">
        <div className="relative mb-4">
          <div className="text-6xl font-bold text-primary">
            {score > 0 ? score.toLocaleString() : "N/A"}
          </div>
          <div className="absolute top-0 flex items-center justify-center w-full h-full text-sm font-semibold text-primary">
            <Star className="w-12 h-12 opacity-10"/>
          </div>
        </div>
        {score > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TreePine className="w-5 h-5 text-green-600" />
              <span>Equivalent to planting {Math.floor(score / 250)} trees</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span>Saved {Math.floor(score * 0.36)} kWh of energy</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Droplets className="w-5 h-5 text-blue-500" />
              <span>Conserved {Math.floor(score * 1.6)}L of water</span>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">Calculate your score to see your impact!</p>
        )}
      </CardContent>
      <CardFooter>
        <ImpactScoreCalculatorDialog>
          <Button variant="outline" className="w-full">
            <Sparkles className="w-4 h-4 mr-2"/>
            {score > 0 ? "Recalculate Score" : "Calculate Your Score"}
          </Button>
        </ImpactScoreCalculatorDialog>
      </CardFooter>
    </Card>
  );
}
