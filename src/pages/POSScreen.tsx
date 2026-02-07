import { useState, useCallback } from 'react';
import ProductGrid from '@/components/ProductGrid';
import CartPanel from '@/components/CartPanel';
import Receipt from '@/components/Receipt';
import { useCartStore, useAuthStore } from '@/stores/useStore';
import { Button } from '@/components/ui/button';
import type { Sale } from '@/types';
import { LogOut, RotateCcw, BarChart3, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const POSScreen = () => {
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);
  const { items, clearCart, getTotal } = useCartStore();
  const { staff, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleCheckout = useCallback(() => {
    if (items.length === 0) return;

    // Create sale object (mock - would be API call in production)
    const sale: Sale = {
      id: `SALE-${Date.now().toString(36).toUpperCase()}`,
      items: items.map((item, index) => ({
        id: `si-${index}`,
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: item.product.price,
        subtotal: item.product.price * item.quantity,
      })),
      total: getTotal(),
      staffPin: staff?.pin || '',
      createdAt: new Date().toISOString(),
      status: 'completed',
    };

    // In production, this would call: salesApi.create(...)
    setCompletedSale(sale);
    toast.success('Sale completed successfully!');
  }, [items, getTotal, staff]);

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
          <h1 className="text-xl font-bold text-primary">🎪 Kermesse POS</h1>
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
          <CartPanel onCheckout={handleCheckout} />
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
