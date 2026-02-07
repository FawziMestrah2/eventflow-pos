import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { salesApi, categoriesApi } from '@/services/api';
import { getCategoryStyle, formatPrice, formatPriceLBP } from '@/lib/constants';
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  RotateCcw,
  Loader2,
  Package
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ReportsScreen = () => {
  const navigate = useNavigate();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');

  const { data: todaySales = [], isLoading: salesLoading } = useQuery({
    queryKey: ['todaySales'],
    queryFn: salesApi.getToday,
  });

  const { data: allSalesDetails = [], isLoading: detailsLoading } = useQuery({
    queryKey: ['allSalesDetails'],
    queryFn: salesApi.getAllDetails,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAllDetails,
  });

  // Calculate report data from today's sales
  const totalRevenue = todaySales.reduce((sum, sale) => sum + (sale.totalPrice || 0), 0);
  const totalSales = todaySales.length;
  const totalItems = todaySales.reduce((sum, sale) => sum + (sale.itemCount || 0), 0);

  // Aggregate products from all sales with details
  const productSalesData = useMemo(() => {
    const productMap = new Map<number, {
      productId: number;
      productName: string;
      categoryId?: number;
      categoryName?: string;
      totalQty: number;
      totalRevenue: number;
    }>();

    allSalesDetails.forEach((sale) => {
      sale.items?.forEach((item) => {
        const existing = productMap.get(item.productId);
        if (existing) {
          existing.totalQty += item.quantity;
          existing.totalRevenue += item.totalPrice || 0;
        } else {
          productMap.set(item.productId, {
            productId: item.productId,
            productName: item.productName || `Product #${item.productId}`,
            categoryId: item.categoryId,
            categoryName: item.categoryName,
            totalQty: item.quantity,
            totalRevenue: item.totalPrice || 0,
          });
        }
      });
    });

    return Array.from(productMap.values()).sort((a, b) => b.totalRevenue - a.totalRevenue);
  }, [allSalesDetails]);

  // Filter products by category
  const filteredProductSales = useMemo(() => {
    if (selectedCategoryId === 'all') {
      return productSalesData;
    }
    const categoryIdNum = parseInt(selectedCategoryId, 10);
    return productSalesData.filter((p) => p.categoryId === categoryIdNum);
  }, [productSalesData, selectedCategoryId]);

  // Calculate totals for filtered products
  const filteredTotalQty = filteredProductSales.reduce((sum, p) => sum + p.totalQty, 0);
  const filteredTotalRevenue = filteredProductSales.reduce((sum, p) => sum + p.totalRevenue, 0);

  if (salesLoading || detailsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
            <BarChart3 className="h-6 w-6 text-primary" />
            Reports
          </h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/20">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">{formatPrice(totalRevenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-success/20">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Net Revenue</p>
                  <p className="text-2xl font-bold text-success">{formatPrice(totalRevenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-accent/20">
                  <ShoppingCart className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Sales</p>
                  <p className="text-2xl font-bold">{totalSales}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-destructive/20">
                  <RotateCcw className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Items Sold</p>
                  <p className="text-2xl font-bold">{totalItems}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Tabs */}
        <Tabs defaultValue="sales" className="space-y-4">
          <TabsList>
            <TabsTrigger value="sales">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Daily Sales
            </TabsTrigger>
            <TabsTrigger value="products">
              <Package className="h-4 w-4 mr-2" />
              By Product
            </TabsTrigger>
          </TabsList>

          {/* Daily Sales Tab */}
          <TabsContent value="sales">
            <Card>
              <CardHeader>
                <CardTitle>Today's Sales ({todaySales.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {todaySales.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No sales today yet</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="py-3 px-2">Sale #</th>
                        <th className="py-3 px-2">Employee ID</th>
                        <th className="py-3 px-2 text-center">Items</th>
                        <th className="py-3 px-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {todaySales.map((sale) => (
                        <tr key={sale.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-2 font-medium">{sale.id}</td>
                          <td className="py-3 px-2">{sale.employeeId || '-'}</td>
                          <td className="py-3 px-2 text-center">{sale.itemCount}</td>
                          <td className="py-3 px-2 text-right font-bold text-primary">
                            {formatPrice(sale.totalPrice)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Report Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Sales by Product</CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Filter:</span>
                    <select
                      value={selectedCategoryId}
                      onChange={(e) => setSelectedCategoryId(e.target.value)}
                      className="border rounded-md px-3 py-1 text-sm bg-background"
                    >
                      <option value="all">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredProductSales.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No product sales data</p>
                  </div>
                ) : (
                  <>
                    <table className="w-full">
                      <thead>
                        <tr className="border-b text-left">
                          <th className="py-3 px-2">Product</th>
                          <th className="py-3 px-2 text-center">Qty Sold</th>
                          <th className="py-3 px-2 text-right">Total (USD)</th>
                          <th className="py-3 px-2 text-right">Total (LBP)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProductSales.map((product) => (
                          <tr key={product.productId} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-2 font-medium">{product.productName}</td>
                            <td className="py-3 px-2 text-center">{product.totalQty}</td>
                            <td className="py-3 px-2 text-right font-bold text-primary">
                              {formatPrice(product.totalRevenue)}
                            </td>
                            <td className="py-3 px-2 text-right text-muted-foreground">
                              {formatPriceLBP(product.totalRevenue)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 bg-muted/50">
                          <td className="py-3 px-2 font-bold">TOTAL</td>
                          <td className="py-3 px-2 text-center font-bold">{filteredTotalQty}</td>
                          <td className="py-3 px-2 text-right font-bold text-primary">
                            {formatPrice(filteredTotalRevenue)}
                          </td>
                          <td className="py-3 px-2 text-right font-bold text-muted-foreground">
                            {formatPriceLBP(filteredTotalRevenue)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReportsScreen;
