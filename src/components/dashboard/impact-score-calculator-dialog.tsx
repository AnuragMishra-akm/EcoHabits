
"use client";

import { useState, type ReactNode, useMemo, useEffect } from "react";
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
import { generateImpactQuestions, type ImpactQuestionsOutput } from "@/ai/flows/generate-impact-questions";
import { LoaderCircle, Sparkles, Lightbulb, Star } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/context/AuthContext";

type Question = ImpactQuestionsOutput['questions'][0];

// This new component contains the form logic and is only rendered when questions are available.
function QuestionnaireForm({
  questions,
  onSubmit,
}: {
  questions: Question[];
  onSubmit: (data: Record<string, any>) => void;
}) {
  // The schema is now built inside this component, ensuring types are correct on initialization.
  const formSchema = useMemo(() => {
    const shape = questions.reduce((acc, q) => {
      acc[q.id] = z.string({ required_error: "Please select an option." });
      return acc;
    }, {} as Record<string, z.ZodString>);
    return z.object(shape);
  }, [questions]);

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4 max-h-[60vh] overflow-y-auto pr-4">
        {questions.map((q, index) => (
          <FormField
            control={form.control}
            key={q.id}
            name={q.id}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{index + 1}. {q.text}</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map(option => (
                      <Label key={option} className="flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-accent has-[[data-state=checked]]:bg-accent">
                        <RadioGroupItem value={option} /> {option}
                      </Label>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        {questions.length > 0 && (
          <Button type="submit" className="w-full">
            <Sparkles className="w-4 h-4 mr-2" />
            Calculate My Score
          </Button>
        )}
      </form>
    </Form>
  );
}


export function ImpactScoreCalculatorDialog({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const { updateImpactScore } = useAuth();
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<'loadingQuestions' | 'form' | 'calculating' | 'result'>('loadingQuestions');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [result, setResult] = useState<ImpactScoreOutput | null>(null);

  const fetchQuestions = async () => {
    setStage('loadingQuestions');
    setResult(null);
    try {
      const data = await generateImpactQuestions();
      setQuestions(data.questions);
      setStage('form');
    } catch (error) {
      console.error("Failed to generate questions:", error);
      toast({
        title: "Error",
        description: "Could not load questions. Please try again later.",
        variant: "destructive",
      });
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchQuestions();
    }
  }, [open]);

  const handleSubmit = async (data: Record<string, string>) => {
    setStage('calculating');

    const answersForApi = questions.reduce((acc: Record<string, string>, question) => {
        acc[question.text] = data[question.id];
        return acc;
    }, {});

    try {
      const analysisResult = await calculateImpactScore({ answers: answersForApi });
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
      setStage('result');

    } catch (error) {
      console.error(error);
      toast({
        title: "Calculation Failed",
        description: "Could not calculate your score. Please try again.",
        variant: "destructive",
      });
      setStage('form');
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setTimeout(() => {
        setStage('loadingQuestions');
        setQuestions([]);
        setResult(null);
      }, 300);
    }
    setOpen(isOpen);
  };
  
  const renderContent = () => {
    switch (stage) {
      case 'loadingQuestions':
        return (
          <div className="flex flex-col items-center justify-center p-12 text-center h-64">
            <LoaderCircle className="w-8 h-8 animate-spin text-primary"/>
            <p className="mt-4 text-lg text-muted-foreground">Generating new questions...</p>
          </div>
        );
      case 'form':
        // Render the new form component only when the stage is 'form'
        return <QuestionnaireForm questions={questions} onSubmit={handleSubmit} />;
      case 'calculating':
        return (
          <div className="flex flex-col items-center justify-center p-12 text-center h-64">
              <LoaderCircle className="w-8 h-8 animate-spin text-primary"/>
              <p className="mt-4 text-lg text-muted-foreground">Calculating your score...</p>
          </div>
        );
      case 'result':
        return result && (
          <div className="space-y-4 animate-fade-in text-center py-4">
            <p className="text-muted-foreground">Your New Impact Score is</p>
            <div className="text-7xl font-bold text-primary flex items-center justify-center gap-3">
                <Star className="w-12 h-12 text-yellow-400 fill-yellow-400"/>
                {result.impactScore}
            </div>
            <div className="p-4 rounded-lg bg-accent/20 border-accent/50 border">
              <h3 className="flex items-center justify-center mb-2 text-lg font-semibold">
                <Lightbulb className="w-5 h-5 mr-2 text-accent" />
                AI Feedback
              </h3>
              <p className="text-sm text-accent-foreground/90">{result.feedback}</p>
            </div>
            <Button onClick={() => setOpen(false)}>
                Done
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>AI Impact Score Calculator</DialogTitle>
          <DialogDescription>
            Answer a few questions generated by AI to calculate your environmental impact score.
          </DialogDescription>
        </DialogHeader>
        
        {renderContent()}
        
        <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
