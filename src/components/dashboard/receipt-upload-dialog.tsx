"use client";

import { useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { analyzeReceiptForCarbonFootprint, type AnalyzeReceiptOutput } from "@/ai/flows/ocr-receipt-carbon-footprint";
import { LoaderCircle, Gift, UploadCloud, PieChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { fileToDataUri } from "@/lib/utils";

export function ReceiptUploadDialog({ children, onAnalysisComplete }: { children: ReactNode, onAnalysisComplete: (result: AnalyzeReceiptOutput) => void; }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeReceiptOutput | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] ?? null);
    setResult(null); // Reset result when a new file is selected
  };

  const handleSubmit = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a receipt image to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const dataUri = await fileToDataUri(file);
      const analysisResult = await analyzeReceiptForCarbonFootprint({ receiptDataUri: dataUri });
      setResult(analysisResult);
      if (analysisResult.ecoPointsAwarded > 0) {
        onAnalysisComplete(analysisResult);
        toast({
            title: "Points Awarded!",
            description: `You've earned ${analysisResult.ecoPointsAwarded} EcoPoints for this purchase.`,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze the receipt. Please try another image.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setFile(null);
      setResult(null);
      setIsLoading(false);
    }
    setOpen(isOpen);
  };
  
  const totalFootprint = result?.estimatedCarbonFootprint ?? 0;
  const awardedPoints = result?.ecoPointsAwarded ?? 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan Receipt</DialogTitle>
          <DialogDescription>
            Upload an image of your receipt to calculate its carbon footprint and earn points.
          </DialogDescription>
        </DialogHeader>
        {!result ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="receipt-upload" className="sr-only">Upload Receipt</Label>
              <Input id="receipt-upload" type="file" accept="image/*,application/pdf" onChange={handleFileChange} />
              {file && <p className="mt-2 text-sm text-muted-foreground">Selected: {file.name}</p>}
            </div>
            <Button onClick={handleSubmit} disabled={isLoading || !file} className="w-full">
              {isLoading ? (
                <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <UploadCloud className="w-4 h-4 mr-2" />
              )}
              {isLoading ? "Analyzing..." : "Analyze Footprint"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
             <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Total Footprint</CardTitle>
                        <PieChart className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">{totalFootprint.toFixed(2)} kg</div>
                        <p className="text-xs text-muted-foreground">CO₂e for this receipt</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Points Awarded</CardTitle>
                        <Gift className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-accent">{awardedPoints}</div>
                        <p className="text-xs text-muted-foreground">EcoPoints earned</p>
                    </CardContent>
                </Card>
             </div>
            <div>
              <h4 className="mb-2 font-semibold">Breakdown by Item:</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {Object.entries(result.breakdown).map(([item, footprint]) => (
                  <div key={item} className="flex justify-between items-center text-sm p-2 rounded-md bg-secondary/50">
                    <span>{item}</span>
                    <span className="font-mono font-medium">{footprint.toFixed(2)} kg</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
