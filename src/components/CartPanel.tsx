import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCartStore } from '@/stores/useStore';
import { formatPrice, formatPriceLBP } from '@/lib/constants';
import { Minus, Plus, Trash2, ShoppingCart, CreditCard, Loader2 } from 'lucide-react';

interface CartPanelProps {
  onCheckout: () => void;
  isLoading?: boolean;
}

const CartPanel = ({ onCheckout, isLoading = false }: CartPanelProps) => {
  const { items, updateQuantity, removeItem, clearCart, getTotal, getItemCount } = useCartStore();
  const total = getTotal();
  const itemCount = getItemCount();

  return (
    <Card className="h-full flex flex-col border-2 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-primary" />
          Cart
          {itemCount > 0 && (
            <span className="ml-auto bg-primary text-primary-foreground text-sm px-2 py-0.5 rounded-full">
              {itemCount}
            </span>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-6">
            <ShoppingCart className="h-12 w-12 mb-2 opacity-50" />
            <p>Cart is empty</p>
            <p className="text-sm">Tap products to add them</p>
          </div>
        ) : (
          <ScrollArea className="h-full px-4">
            <div className="space-y-3 pb-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(item.product.retailPrice)} each
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      disabled={isLoading}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      disabled={isLoading}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="text-right min-w-[70px]">
                    <p className="font-semibold">
                      {formatPrice((item.product.retailPrice || 0) * item.quantity)}
                    </p>
                  </div>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => removeItem(item.product.id)}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>

      <CardFooter className="flex-col gap-4 border-t pt-4">
        <div className="w-full space-y-2">
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total</span>
            <div className="text-right">
              <p className="text-xl font-bold text-primary">{formatPrice(total)}</p>
              <p className="text-sm text-muted-foreground">{formatPriceLBP(total)}</p>
            </div>
          </div>
        </div>

        <div className="w-full grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="touch-target"
            onClick={clearCart}
            disabled={items.length === 0 || isLoading}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
          <Button
            className="touch-target"
            onClick={onCheckout}
            disabled={items.length === 0 || isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <CreditCard className="h-4 w-4 mr-2" />
            )}
            {isLoading ? 'Processing...' : 'Checkout'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CartPanel;
