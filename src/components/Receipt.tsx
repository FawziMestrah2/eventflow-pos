import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Sale } from '@/types';
import { formatPrice, formatDateTime } from '@/lib/constants';
import { Printer, Check, PartyPopper } from 'lucide-react';

interface ReceiptProps {
  sale: Sale;
  onClose: () => void;
  onPrint: () => void;
}

const Receipt = ({ sale, onClose, onPrint }: ReceiptProps) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
    onPrint();
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md animate-scale-in">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-2">
            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center">
              <Check className="h-8 w-8 text-success" />
            </div>
          </div>
          <CardTitle className="text-2xl text-success">Sale Complete!</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Printable Receipt */}
          <div ref={receiptRef} className="print-receipt bg-card p-4 rounded-lg border">
            <div className="text-center mb-4">
              <PartyPopper className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-bold text-lg">Kermesse Festival</h3>
              <p className="text-sm text-muted-foreground">Thank you for your purchase!</p>
            </div>

            <Separator className="my-3" />

            <div className="text-sm space-y-1 mb-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sale ID:</span>
                <span className="font-mono">{sale.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span>{formatDateTime(sale.createdAt)}</span>
              </div>
            </div>

            <Separator className="my-3" />

            <div className="space-y-2">
              {sale.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.quantity}x {item.productName}
                  </span>
                  <span>{formatPrice(item.subtotal)}</span>
                </div>
              ))}
            </div>

            <Separator className="my-3" />

            <div className="flex justify-between font-bold text-lg">
              <span>TOTAL</span>
              <span className="text-primary">{formatPrice(sale.total)}</span>
            </div>

            <div className="text-center mt-4 text-sm text-muted-foreground">
              <p>Enjoy the festival! 🎪</p>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="touch-target" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print Receipt
            </Button>
            <Button className="touch-target" onClick={onClose}>
              <Check className="h-4 w-4 mr-2" />
              Done
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Receipt;
