"use client";

import { Header } from "@/components/dashboard/header";
import { ImpactScoreCard } from "@/components/dashboard/impact-score-card";
import { EcoPointsCard } from "@/components/dashboard/eco-points-card";
import { ChallengesCard } from "@/components/dashboard/challenges-card";
import { ActionsCard } from "@/components/dashboard/actions-card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import type { AnalyzeReceiptOutput } from "@/ai/flows/ocr-receipt-carbon-footprint";
import { ReceiptText } from "lucide-react";

export default function Home() {
  const { user, addPoints, addActivity } = useAuth();

  const handleAnalysisComplete = (result: AnalyzeReceiptOutput) => {
    if (result.ecoPointsAwarded > 0) {
      addPoints(result.ecoPointsAwarded);
      addActivity({
        description: `Scanned a receipt and earned ${result.ecoPointsAwarded} points.`,
        icon: <ReceiptText className="w-5 h-5 text-primary" />,
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center">
            <SidebarTrigger className="mr-4 md:hidden" />
            <Header />
        </div>
      </header>
      <main className="flex-1 p-4 overflow-y-auto sm:p-6 md:p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <ImpactScoreCard className="lg:col-span-2 xl:col-span-1" />
          <EcoPointsCard points={user?.points ?? 0} className="lg:col-span-1 xl:col-span-1" />
          <ChallengesCard className="md:col-span-2 lg:col-span-3 xl:col-span-2" />
          <ActionsCard onAnalysisComplete={handleAnalysisComplete} className="md:col-span-2 lg:col-span-3 xl:col-span-4" />
        </div>
      </main>
    </div>
  );
}
