import { Header } from "@/components/dashboard/header";
import { ImpactScoreCard } from "@/components/dashboard/impact-score-card";
import { EcoPointsCard } from "@/components/dashboard/eco-points-card";
import { ChallengesCard } from "@/components/dashboard/challenges-card";
import { ActionsCard } from "@/components/dashboard/actions-card";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <ImpactScoreCard className="lg:col-span-2 xl:col-span-1" />
          <EcoPointsCard className="lg:col-span-1 xl:col-span-1" />
          <ChallengesCard className="md:col-span-2 lg:col-span-3 xl:col-span-2" />
          <ActionsCard className="md:col-span-2 lg:col-span-3 xl:col-span-4" />
        </div>
      </main>
    </div>
  );
}
