"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { carbonComparisonInsights, type CarbonComparisonOutput } from "@/ai/flows/carbon-comparison-insights";
import { LoaderCircle, Lightbulb, Check, ChevronsRight } from "lucide-react";

const comparisonSchema = z.object({
  productOneDescription: z.string().min(10, "Please provide a more detailed description.").max(500),
  productTwoDescription: z.string().min(10, "Please provide a more detailed description.").max(500),
  userShoppingPatterns: z.string().min(10, "Please describe your shopping habits.").max(500),
});

type ComparisonFormValues = z.infer<typeof comparisonSchema>;

export function ComparisonTool() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CarbonComparisonOutput | null>(null);

  const form = useForm<ComparisonFormValues>({
    resolver: zodResolver(comparisonSchema),
    defaultValues: {
      productOneDescription: "",
      productTwoDescription: "",
      userShoppingPatterns: "I usually buy local and organic products when possible.",
    },
  });

  const onSubmit = async (data: ComparisonFormValues) => {
    setIsLoading(true);
    setResult(null);
    try {
      const analysisResult = await carbonComparisonInsights(data);
      setResult(analysisResult);
    } catch (error) {
      console.error(error);
      toast({
        title: "Comparison Failed",
        description: "Could not compare the products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Compare Product Impact</CardTitle>
          <CardDescription>
            Enter descriptions of two products to get an AI-powered sustainability comparison.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="productOneDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product One</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., 'A 12oz package of beef ground chuck, non-organic.'" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productTwoDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Two</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., 'A 12oz package of plant-based ground beef alternative.'" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="userShoppingPatterns"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Shopping Habits (optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe your typical shopping preferences to personalize the recommendation." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ChevronsRight className="w-4 h-4 mr-2" />
                )}
                {isLoading ? "Comparing..." : "Compare Now"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && (
         <div className="flex items-center justify-center p-12 text-center">
            <LoaderCircle className="w-8 h-8 animate-spin text-primary"/>
            <p className="ml-4 text-lg text-muted-foreground">Generating insights...</p>
         </div>
      )}

      {result && (
        <Card className="mt-8 animate-fade-in">
          <CardHeader>
            <CardTitle>Comparison Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="p-4 border rounded-lg">
                <h3 className="mb-2 text-lg font-semibold">Product One Impact</h3>
                <p className="text-sm text-foreground/80">{result.productOneImpact}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="mb-2 text-lg font-semibold">Product Two Impact</h3>
                <p className="text-sm text-foreground/80">{result.productTwoImpact}</p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-accent/20 border-accent/50 border">
              <h3 className="flex items-center mb-2 text-lg font-semibold text-accent-foreground">
                <Lightbulb className="w-5 h-5 mr-2 text-accent" />
                Our Recommendation
              </h3>
              <p className="text-sm text-accent-foreground/90">{result.recommendation}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
