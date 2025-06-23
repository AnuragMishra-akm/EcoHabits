import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UploadCloud, Scale } from "lucide-react";
import { ReceiptUploadDialog } from "@/components/dashboard/receipt-upload-dialog";
import Link from "next/link";
import type { AnalyzeReceiptOutput } from "@/ai/flows/ocr-receipt-carbon-footprint";

type ActionsCardProps = {
  className?: string;
  onAnalysisComplete: (result: AnalyzeReceiptOutput) => void;
};

export function ActionsCard({ className, onAnalysisComplete }: ActionsCardProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Analyze your purchases or compare products to make sustainable choices.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ReceiptUploadDialog onAnalysisComplete={onAnalysisComplete}>
            <Button variant="outline" size="lg" className="w-full h-24 text-base">
              <UploadCloud className="w-6 h-6 mr-2" />
              Scan Receipt
            </Button>
          </ReceiptUploadDialog>
          <Button variant="outline" size="lg" className="w-full h-24 text-base" asChild>
            <Link href="/compare">
              <Scale className="w-6 h-6 mr-2" />
              Compare Products
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
