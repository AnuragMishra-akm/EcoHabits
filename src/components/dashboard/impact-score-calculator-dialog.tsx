"use client";

import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { calculateImpactScore, type ImpactScoreOutput } from "@/ai/flows/calculate-impact-score";
import { LoaderCircle, Sparkles, Lightbulb, Star } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/context/AuthContext";

const formSchema = z.object({
  commute: z.string({ required_error: "Please select an option." }),
  diet: z.string({ required_error: "Please select an option." }),
  energy: z.string({ required_error: "Please select an option." }),
});

type FormValues = z.infer<typeof formSchema>;

export function ImpactScoreCalculatorDialog({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const { updateImpactScore, addPoints } = useAuth();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ImpactScoreOutput | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setResult(null);

    try {
      const analysisResult = await calculateImpactScore(data);
      setResult(analysisResult);
      
      const score = analysisResult.impactScore;
      let pointsAwarded = 0;
      
      if (score > 750) {
        pointsAwarded = 500;
        toast({
            title: "Excellent Score!",
            description: `You've earned ${pointsAwarded} bonus EcoPoints!`,
        });
      }

      await updateImpactScore(score, pointsAwarded);

    } catch (error) {
      console.error(error);
      toast({
        title: "Calculation Failed",
        description: "Could not calculate your score. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset state on close
      form.reset();
      setResult(null);
      setIsLoading(false);
    }
    setOpen(isOpen);
  };
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Impact Score Calculator</DialogTitle>
          <DialogDescription>
            Answer a few questions to calculate your environmental impact score.
          </DialogDescription>
        </DialogHeader>
        
        {!result && !isLoading && (
           <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-4">
              <FormField
                control={form.control}
                name="commute"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>How do you primarily commute?</FormLabel>
                        <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-2 gap-2">
                               <Label className="flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-accent has-[[data-state=checked]]:bg-accent">
                                    <RadioGroupItem value="Bike/Walk" /> Bike / Walk
                                </Label>
                                 <Label className="flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-accent has-[[data-state=checked]]:bg-accent">
                                    <RadioGroupItem value="Public Transport" /> Public Transport
                                </Label>
                                 <Label className="flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-accent has-[[data-state=checked]]:bg-accent">
                                    <RadioGroupItem value="Electric Vehicle" /> Electric Vehicle
                                </Label>
                                 <Label className="flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-accent has-[[data-state=checked]]:bg-accent">
                                    <RadioGroupItem value="Gasoline Car" /> Gasoline Car
                                </Label>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="diet"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>How often do you eat red meat?</FormLabel>
                        <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-2 gap-2">
                               <Label className="flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-accent has-[[data-state=checked]]:bg-accent">
                                    <RadioGroupItem value="Never" /> Never
                                </Label>
                                 <Label className="flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-accent has-[[data-state=checked]]:bg-accent">
                                    <RadioGroupItem value="Rarely" /> Rarely
                                </Label>
                                 <Label className="flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-accent has-[[data-state=checked]]:bg-accent">
                                    <RadioGroupItem value="Weekly" /> Weekly
                                </Label>
                                 <Label className="flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-accent has-[[data-state=checked]]:bg-accent">
                                    <RadioGroupItem value="Daily" /> Daily
                                </Label>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="energy"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>What is your primary household energy source?</FormLabel>
                        <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-2 gap-2">
                               <Label className="flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-accent has-[[data-state=checked]]:bg-accent">
                                    <RadioGroupItem value="Renewable (Solar/Wind)" /> Renewable
                                </Label>
                                 <Label className="flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-accent has-[[data-state=checked]]:bg-accent">
                                    <RadioGroupItem value="Mixed Source" /> Mixed Source
                                </Label>
                                 <Label className="flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-accent has-[[data-state=checked]]:bg-accent">
                                    <RadioGroupItem value="Grid (Non-renewable)" /> Non-renewable
                                </Label>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
              />
               <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? <LoaderCircle className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                    Calculate My Score
                </Button>
            </form>
          </Form>
        )}

        {isLoading && (
            <div className="flex items-center justify-center p-12 text-center">
                <LoaderCircle className="w-8 h-8 animate-spin text-primary"/>
                <p className="ml-4 text-lg text-muted-foreground">Calculating your score...</p>
            </div>
        )}

        {result && (
          <div className="space-y-4 animate-fade-in text-center">
            <p className="text-muted-foreground">Your Impact Score is</p>
            <div className="text-7xl font-bold text-primary flex items-center justify-center gap-3">
                <Star className="w-12 h-12 text-yellow-400 fill-yellow-400"/>
                {result.impactScore}
            </div>
            <div className="p-4 rounded-lg bg-accent/20 border-accent/50 border">
              <h3 className="flex items-center justify-center mb-2 text-lg font-semibold text-accent-foreground">
                <Lightbulb className="w-5 h-5 mr-2 text-accent" />
                AI Feedback
              </h3>
              <p className="text-sm text-accent-foreground/90">{result.feedback}</p>
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
