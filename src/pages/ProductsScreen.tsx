import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockProducts } from '@/data/mockData';
import { categories, categoryConfig, formatPrice } from '@/lib/constants';
import type { ProductCategory } from '@/types';
import { ArrowLeft, Package, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductsScreen = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to POS
          </Button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            Products Catalog
          </h1>
        </div>

        {/* Search & Filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Products ({filteredProducts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as ProductCategory | 'all')}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                {categories.map((category) => {
                  const config = categoryConfig[category];
                  return (
                    <TabsTrigger key={category} value={category}>
                      <config.icon className="h-4 w-4 mr-2" />
                      {config.label}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => {
                    const config = categoryConfig[product.category];
                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${config.bgClass}/20`}>
                              <config.icon className={`h-5 w-5 ${config.colorClass}`} />
                            </div>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-muted-foreground">{product.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={config.colorClass}>
                            {config.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatPrice(product.price)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={product.isActive ? 'default' : 'secondary'}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No products found</p>
                </div>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductsScreen;
