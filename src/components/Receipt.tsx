import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { SaleView } from '@/types';
import { formatPrice, formatPriceLBP, formatDateTime } from '@/lib/constants';
import { Printer, Check, PartyPopper } from 'lucide-react';

interface ReceiptProps {
  sale: SaleView;
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
              {/* <PartyPopper className="h-8 w-8 mx-auto mb-2 text-primary" /> */}
              <img
                src="/PrintLogo.png"
                alt="Logo"
                className="h-16 w-16 mx-auto mb-2 object-contain"
              />

              {/* <h3 className="font-bold text-lg">الاحتفال </h3> */}
              <p className="text-sm text-muted-foreground">شكرا لمشاركتك!</p>
            </div>

            <Separator className="my-3" />

            <div className="text-sm space-y-1 mb-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sale ID:</span>
                <span className="font-mono">{sale.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span>{formatDateTime(sale.date)}</span>
              </div>
            </div>

            <Separator className="my-3" />

            {/* Items Table */}
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-center py-1 w-12 pr-4">Qty</th>
                  <th className="text-left py-1 pl-4">Item</th>
                  <th className="text-right py-1">Price</th>
                </tr>
              </thead>
              <tbody>
                {sale.items?.map((item) => (
                  <tr key={item.id}>
                    <td className="py-1 text-center pr-4">{item.quantity}</td>
                    <td className="py-1 pl-4">{item.productName || `Product #${item.productId}`}</td>
                    <td className="py-1 text-right">{formatPrice(item.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Separator className="my-3" />

            <div className="space-y-1">
              <div className="flex justify-between font-bold text-lg">
                <span>TOTAL</span>
                <span className="text-primary">{formatPrice(sale.totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span></span>
                <span>{formatPriceLBP(sale.totalPrice)}</span>
              </div>
            </div>

            <div className="text-center mt-4 text-sm text-muted-foreground">
              <p>حظا سعيدا!</p>
              {/* <p className="text-xs mt-1">Rate: $1 = 90,000 L.L.</p> */}
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
