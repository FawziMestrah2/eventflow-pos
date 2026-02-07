import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Product } from '@/types';
import { useCartStore } from '@/stores/useStore';
import { categoryConfig, formatPrice } from '@/lib/constants';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCartStore();
  const config = categoryConfig[product.category];

  const handleClick = () => {
    addItem(product);
  };

  return (
    <Card 
      className="cursor-pointer transition-all hover:scale-105 hover:shadow-lg active:scale-95 border-2 hover:border-primary/50"
      onClick={handleClick}
    >
      <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
        <div className={`p-3 rounded-full ${config.bgClass}/20`}>
          <config.icon className={`h-8 w-8 ${config.colorClass}`} />
        </div>
        <h3 className="font-semibold text-sm leading-tight">{product.name}</h3>
        <p className="text-lg font-bold text-primary">{formatPrice(product.price)}</p>
        <Button size="sm" variant="ghost" className="w-full touch-target">
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
