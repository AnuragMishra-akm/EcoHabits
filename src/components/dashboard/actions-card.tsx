import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UploadCloud } from "lucide-react";
import { ReceiptUploadDialog } from "@/components/dashboard/receipt-upload-dialog";

type ActionsCardProps = {
  className?: string;
};

export function ActionsCard({ className }: ActionsCardProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Track Your Footprint</CardTitle>
        <CardDescription>Analyze your purchases by scanning your receipts.</CardDescription>
      </CardHeader>
      <CardContent>
        <ReceiptUploadDialog>
          <Button variant="outline" size="lg" className="w-full h-24 text-base">
            <UploadCloud className="w-6 h-6 mr-2" />
            Scan Receipt
          </Button>
        </ReceiptUploadDialog>
      </CardContent>
    </Card>
  );
}
