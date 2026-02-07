import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import ProductGrid from '@/components/ProductGrid';
import CartPanel from '@/components/CartPanel';
import Receipt from '@/components/Receipt';
import { useCartStore, useAuthStore } from '@/stores/useStore';
import { salesApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import type { SaleView, SaleCreateRequest } from '@/types';
import { LogOut, RotateCcw, BarChart3, Package, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const POSScreen = () => {
  const [completedSale, setCompletedSale] = useState<SaleView | null>(null);
  const { items, clearCart, getTotal } = useCartStore();
  const { staff, logout } = useAuthStore();
  const navigate = useNavigate();

  // Checkout mutation
  const checkoutMutation = useMutation({
    mutationFn: salesApi.checkout,
    onSuccess: (sale) => {
      setCompletedSale(sale);
      toast.success('Sale completed successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Checkout failed: ${error.message}`);
    },
  });

  const handleCheckout = useCallback(() => {
    if (items.length === 0) return;

    const request: SaleCreateRequest = {
      employeeId: staff ? parseInt(staff.pin) : undefined,
      totalPrice: getTotal(),
      items: items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: item.product.unitPrice || item.product.retailPrice || 0,
        retailPrice: item.product.retailPrice || 0,
        totalPrice: (item.product.retailPrice || 0) * item.quantity,
      })),
    };

    checkoutMutation.mutate(request);
  }, [items, getTotal, staff, checkoutMutation]);

  const handleReceiptClose = useCallback(() => {
    setCompletedSale(null);
    clearCart();
  }, [clearCart]);

  const handleLogout = useCallback(() => {
    logout();
    toast.info('Logged out successfully');
  }, [logout]);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b bg-card shadow-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-primary">Kermesse POS</h1>
          {staff && (
            <span className="text-sm text-muted-foreground">
              Welcome, <span className="font-semibold">{staff.name}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/products')}>
            <Package className="h-4 w-4 mr-2" />
            Products
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/returns')}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Returns
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/reports')}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Reports
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Products Grid - 70% */}
        <div className="flex-[7] p-4 overflow-hidden">
          <ProductGrid />
        </div>

        {/* Cart Panel - 30% */}
        <div className="flex-[3] p-4 pl-0 min-w-[320px]">
          <CartPanel
            onCheckout={handleCheckout}
            isLoading={checkoutMutation.isPending}
          />
        </div>
      </main>

      {/* Receipt Modal */}
      {completedSale && (
        <Receipt
          sale={completedSale}
          onClose={handleReceiptClose}
          onPrint={() => {}}
        />
      )}
    </div>
  );
};

export default POSScreen;
