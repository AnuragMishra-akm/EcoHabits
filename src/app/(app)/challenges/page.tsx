import Link from "next/link";
import { challenges } from "@/lib/challenges-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function AllChallengesPage() {
  return (
    <div className="flex flex-col h-full">
        <header className="flex items-center p-4 border-b bg-card">
            <SidebarTrigger className="mr-4 md:hidden" />
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground font-headline">All Challenges</h1>
                <p className="text-muted-foreground">Join a challenge to earn points and make a difference.</p>
            </div>
        </header>
        <main className="flex-1 p-4 overflow-y-auto sm:p-6 md:p-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {challenges.map((challenge) => (
                <Card key={challenge.id} className="flex flex-col">
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div className="p-3 rounded-full bg-secondary">
                                {challenge.icon}
                            </div>
                             <div className="px-3 py-1 text-sm font-bold rounded-full text-primary bg-primary/10">
                                {challenge.reward}
                            </div>
                        </div>
                        <CardTitle className="pt-4">{challenge.title}</CardTitle>
                        <CardDescription>{challenge.sponsor}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-sm text-muted-foreground">{challenge.description}</p>
                    </CardContent>
                    <CardFooter className="flex flex-col items-start gap-4">
                        <div className="w-full">
                            <div className="flex justify-between mb-1 text-xs text-muted-foreground">
                                <span>Progress</span>
                                <span>{challenge.progress}%</span>
                            </div>
                            <Progress value={challenge.progress} className="h-2" />
                        </div>
                        <Button className="w-full" asChild>
                            <Link href={`/challenges/${challenge.id}`}>View Details</Link>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
            </div>
        </main>
    </div>
  );
}
