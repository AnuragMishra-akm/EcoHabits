"use client";

import { rewards } from "@/lib/rewards-data";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Copy, Check, Calendar } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/icons/logo";

type RedeemPageProps = {
  params: {
    rewardId: string;
  };
};

export default function RedeemPage({ params }: RedeemPageProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const reward = rewards.find((r) => r.id === params.rewardId);

  if (!reward) {
    notFound();
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(reward.couponCode);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Coupon code copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };
  
  const getBrandLogoHint = (brand: string) => {
    if (brand.toLowerCase().includes('cafe')) return 'cafe logo';
    if (brand.toLowerCase().includes('wear')) return 'clothing logo';
    if (brand.toLowerCase().includes('bean')) return 'coffee logo';
    return 'logo';
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
       <header className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-2">
          <Logo className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-headline">
            Redeem Reward
          </h1>
        </div>
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </header>
      <main className="flex items-center justify-center flex-1 p-4 sm:p-6 md:p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="items-center text-center">
            <Image
              src={reward.brandLogoUrl}
              alt={`${reward.brand} Logo`}
              width={80}
              height={80}
              className="mb-4 rounded-full"
              data-ai-hint={getBrandLogoHint(reward.brand)}
            />
            <CardTitle>{reward.name}</CardTitle>
            <CardDescription>
              Redeem {reward.points.toLocaleString()} points for this reward from {reward.brand}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 text-center border-2 border-dashed rounded-lg border-primary">
              <p className="text-sm text-muted-foreground">Your Coupon Code</p>
              <div className="flex items-center justify-center gap-4 mt-2">
                <p className="text-2xl font-bold tracking-widest text-primary font-mono">
                  {reward.couponCode}
                </p>
                <Button variant="ghost" size="icon" onClick={handleCopy}>
                  {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-md bg-secondary/50 text-secondary-foreground">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Expires on:</span>
                </div>
                <span className="text-sm font-semibold">{new Date(reward.expires).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer">
                Visit {reward.brand}
              </a>
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
