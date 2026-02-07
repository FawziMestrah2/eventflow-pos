import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatPrice, formatDateTime } from '@/lib/constants';
import { mockSales } from '@/data/mockData';
import type { Sale, SaleItem } from '@/types';
import { Search, RotateCcw, ArrowLeft, Check, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ReturnsScreen = () => {
  const navigate = useNavigate();
  const [saleId, setSaleId] = useState('');
  const [foundSale, setFoundSale] = useState<Sale | null>(null);
  const [selectedItems, setSelectedItems] = useState<Map<string, number>>(new Map());
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSearch = () => {
    if (!saleId.trim()) {
      toast.error('Please enter a Sale ID');
      return;
    }

    // Mock search - replace with API call
    const sale = mockSales.find((s) => s.id.toLowerCase() === saleId.toLowerCase());
    
    if (sale) {
      setFoundSale(sale);
      setSelectedItems(new Map());
    } else {
      toast.error('Sale not found. Please check the ID.');
      setFoundSale(null);
    }
  };

  const toggleItem = (item: SaleItem) => {
    const newSelected = new Map(selectedItems);
    if (newSelected.has(item.id)) {
      newSelected.delete(item.id);
    } else {
      newSelected.set(item.id, item.quantity);
    }
    setSelectedItems(newSelected);
  };

  const updateReturnQuantity = (itemId: string, quantity: number, maxQty: number) => {
    const newSelected = new Map(selectedItems);
    if (quantity <= 0) {
      newSelected.delete(itemId);
    } else {
      newSelected.set(itemId, Math.min(quantity, maxQty));
    }
    setSelectedItems(newSelected);
  };

  const calculateRefund = () => {
    if (!foundSale) return 0;
    let total = 0;
    selectedItems.forEach((qty, itemId) => {
      const item = foundSale.items.find((i) => i.id === itemId);
      if (item) {
        total += item.unitPrice * qty;
      }
    });
    return total;
  };

  const handleProcessReturn = async () => {
    if (selectedItems.size === 0) {
      toast.error('Please select items to return');
      return;
    }

    setIsProcessing(true);
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast.success(`Return processed! Refund: ${formatPrice(calculateRefund())}`);
    setFoundSale(null);
    setSaleId('');
    setSelectedItems(new Map());
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to POS
          </Button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <RotateCcw className="h-6 w-6 text-primary" />
            Process Returns
          </h1>
        </div>

        {/* Search Card */}
        <Card>
          <CardHeader>
            <CardTitle>Find Sale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="flex-1">
                <Label htmlFor="saleId" className="sr-only">Sale ID</Label>
                <Input
                  id="saleId"
                  placeholder="Enter Sale ID (e.g., sale-001)"
                  value={saleId}
                  onChange={(e) => setSaleId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="h-12"
                />
              </div>
              <Button onClick={handleSearch} className="h-12 px-6 touch-target">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sale Details */}
        {foundSale && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Sale Details</CardTitle>
                <Badge variant={foundSale.status === 'completed' ? 'default' : 'secondary'}>
                  {foundSale.status}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Sale ID: {foundSale.id}</p>
                <p>Date: {formatDateTime(foundSale.createdAt)}</p>
                <p>Total: {formatPrice(foundSale.total)}</p>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Select</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-center">Qty Sold</TableHead>
                    <TableHead className="text-center">Return Qty</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Refund</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {foundSale.items.map((item) => {
                    const isSelected = selectedItems.has(item.id);
                    const returnQty = selectedItems.get(item.id) || 0;
                    
                    return (
                      <TableRow key={item.id} className={isSelected ? 'bg-primary/5' : ''}>
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleItem(item)}
                            className="h-5 w-5 rounded border-primary"
                          />
                        </TableCell>
                        <TableCell className="font-medium">{item.productName}</TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-center">
                          {isSelected && (
                            <Input
                              type="number"
                              min={1}
                              max={item.quantity}
                              value={returnQty}
                              onChange={(e) => 
                                updateReturnQuantity(item.id, parseInt(e.target.value) || 0, item.quantity)
                              }
                              className="w-20 mx-auto h-8 text-center"
                            />
                          )}
                        </TableCell>
                        <TableCell className="text-right">{formatPrice(item.unitPrice)}</TableCell>
                        <TableCell className="text-right font-semibold">
                          {isSelected ? formatPrice(item.unitPrice * returnQty) : '-'}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Refund Summary */}
              {selectedItems.size > 0 && (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-amber-600">
                      <AlertTriangle className="h-5 w-5" />
                      <span className="font-medium">
                        {selectedItems.size} item(s) selected for return
                      </span>
                    </div>
                    <div className="text-xl font-bold">
                      Refund: <span className="text-primary">{formatPrice(calculateRefund())}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={handleProcessReturn} 
                    className="w-full h-12 touch-target"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-foreground border-t-transparent" />
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Process Return
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ReturnsScreen;
