import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import ProductCard from '@/components/ProductCard';
import { mockProducts } from '@/data/mockData';
import { categories, categoryConfig } from '@/lib/constants';
import type { ProductCategory } from '@/types';

const ProductGrid = () => {
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('ticket');

  const filteredProducts = mockProducts.filter(
    (product) => product.category === activeCategory && product.isActive
  );

  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as ProductCategory)} className="flex-1 flex flex-col">
        <TabsList className="w-full h-auto flex-wrap justify-start gap-1 bg-muted/50 p-2 rounded-lg">
          {categories.map((category) => {
            const config = categoryConfig[category];
            const Icon = config.icon;
            return (
              <TabsTrigger
                key={category}
                value={category}
                className="flex-1 min-w-[100px] h-12 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground touch-target"
              >
                <Icon className="h-4 w-4 mr-2" />
                {config.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="flex-1 mt-4">
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pr-4">
                {mockProducts
                  .filter((p) => p.category === category && p.isActive)
                  .map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ProductGrid;
