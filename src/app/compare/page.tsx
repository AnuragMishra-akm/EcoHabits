import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ComparisonTool } from "@/components/compare/comparison-tool";
import { Logo } from "@/components/icons/logo";

export default function ComparePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-2">
          <Logo className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-headline">
            Carbon Comparison Tool
          </h1>
        </div>
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </header>
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <ComparisonTool />
      </main>
    </div>
  );
}
