import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Trophy, Target, Wind } from "lucide-react";

type ChallengesCardProps = {
  className?: string;
};

const challenges = [
  { 
    icon: <Trophy className="text-yellow-500" />,
    title: "Unilever's Plastic-Free Week", 
    reward: "+1,500 EcoPoints",
    progress: 75 
  },
  { 
    icon: <Target className="text-red-500" />,
    title: "Meatless Mondays", 
    reward: "+200 EcoPoints",
    progress: 50 
  },
  { 
    icon: <Wind className="text-blue-400" />,
    title: "Bike to Work Challenge", 
    reward: "+500 EcoPoints",
    progress: 25
  },
];


export function ChallengesCard({ className }: ChallengesCardProps) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <CardTitle>Brand Challenges</CardTitle>
        <CardDescription>Join challenges and earn more points.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {challenges.map((challenge, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-secondary">
                {challenge.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                    <p className="font-semibold">{challenge.title}</p>
                    <p className="text-sm font-bold text-primary">{challenge.reward}</p>
                </div>
                <Progress value={challenge.progress} className="h-2 mt-2" />
              </div>
              <Button variant="secondary" size="sm">View</Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
