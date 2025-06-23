import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { challenges } from "@/lib/challenges-data";
import Link from "next/link";

type ChallengesCardProps = {
  className?: string;
};

export function ChallengesCard({ className }: ChallengesCardProps) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <CardTitle>Brand Challenges</CardTitle>
        <CardDescription>Join challenges and earn more points.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="flex items-center gap-4">
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
              <Button variant="secondary" size="sm" asChild>
                <Link href={`/challenges/${challenge.id}`}>View</Link>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
