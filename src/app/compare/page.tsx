import { ComparisonTool } from "@/components/compare/comparison-tool";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function ComparePage() {
  return (
    <div className="flex flex-col h-full bg-background">
      <header className="flex items-center p-4 border-b bg-card">
         <SidebarTrigger className="mr-4 md:hidden" />
         <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground font-headline">
                Carbon Comparison Tool
            </h1>
            <p className="text-muted-foreground">Compare products to make sustainable choices.</p>
         </div>
      </header>
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <ComparisonTool />
      </main>
    </div>
  );
}
