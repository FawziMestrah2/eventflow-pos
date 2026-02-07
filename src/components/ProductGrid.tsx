import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import ProductCard from '@/components/ProductCard';
import { productsApi, categoriesApi } from '@/services/api';
import { getCategoryStyle } from '@/lib/constants';
import { Loader2, AlertCircle } from 'lucide-react';

const ProductGrid = () => {
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  // Fetch categories
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError
  } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAllDetails,
    retry: 1,
  });

  // Fetch products
  const {
    data: products = [],
    isLoading: productsLoading,
    error: productsError
  } = useQuery({
    queryKey: ['products'],
    queryFn: productsApi.getAllDetails,
    retry: 1,
  });

  // Set first category as active when loaded (in useEffect to avoid render loop)
  useEffect(() => {
    if (categories.length > 0 && activeCategoryId === null) {
      setActiveCategoryId(categories[0].id);
    }
  }, [categories, activeCategoryId]);

  if (categoriesLoading || productsLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading products...</span>
      </div>
    );
  }

  if (categoriesError || productsError) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-destructive p-6">
        <AlertCircle className="h-12 w-12 mb-2" />
        <p className="font-semibold">Failed to load data</p>
        <p className="text-sm text-muted-foreground mt-1">
          Make sure the API server is running at the configured URL
        </p>
        <p className="text-xs text-muted-foreground mt-2 font-mono">
          {(categoriesError as Error)?.message || (productsError as Error)?.message}
        </p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        No categories found. Please add categories in the database.
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <Tabs
        value={activeCategoryId?.toString() || ''}
        onValueChange={(v) => setActiveCategoryId(Number(v))}
        className="flex-1 flex flex-col"
      >
        <TabsList className="w-full h-auto flex-wrap justify-start gap-1 bg-muted/50 p-2 rounded-lg">
          {categories.map((category) => {
            const style = getCategoryStyle(category.name);
            const Icon = style.icon;
            return (
              <TabsTrigger
                key={category.id}
                value={category.id.toString()}
                className="flex-1 min-w-[100px] h-12 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground touch-target"
              >
                <Icon className="h-4 w-4 mr-2" />
                {category.name}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id.toString()} className="flex-1 mt-4">
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pr-4">
                {products
                  .filter((p) => p.categoryId === category.id)
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
