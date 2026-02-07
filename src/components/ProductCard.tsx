import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { ProductView } from '@/types';
import { useCartStore } from '@/stores/useStore';
import { getCategoryStyle, formatPrice, formatPriceLBP } from '@/lib/constants';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  product: ProductView;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCartStore();
  const style = getCategoryStyle(product.categoryName);
  const Icon = style.icon;

  const handleClick = () => {
    addItem(product);
  };

  return (
    <Card
      className="cursor-pointer transition-all hover:scale-105 hover:shadow-lg active:scale-95 border-2 hover:border-primary/50"
      onClick={handleClick}
    >
      <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
        <div className={`p-3 rounded-full ${style.bgClass}/20`}>
          <Icon className={`h-8 w-8 ${style.colorClass}`} />
        </div>
        <h3 className="font-semibold text-sm leading-tight">{product.name}</h3>
        <div className="space-y-0.5">
          <p className="text-lg font-bold text-primary">{formatPrice(product.retailPrice)}</p>
          <p className="text-xs text-muted-foreground">{formatPriceLBP(product.retailPrice)}</p>
        </div>
        <Button size="sm" variant="ghost" className="w-full touch-target">
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
