import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UploadCloud, Scale } from "lucide-react";
import { ReceiptUploadDialog } from "@/components/dashboard/receipt-upload-dialog";

type ActionsCardProps = {
  className?: string;
};

export function ActionsCard({ className }: ActionsCardProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Track & Compare</CardTitle>
        <CardDescription>Analyze your purchases and make smarter choices.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ReceiptUploadDialog>
          <Button variant="outline" size="lg" className="w-full h-24 text-base">
            <UploadCloud className="w-6 h-6 mr-2" />
            Scan Receipt
          </Button>
        </ReceiptUploadDialog>
        <Button variant="outline" size="lg" asChild className="w-full h-24 text-base">
          <Link href="/compare">
            <Scale className="w-6 h-6 mr-2" />
            Compare Products
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
