import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { salesApi } from '@/services/api';
import { getCategoryStyle, formatPrice } from '@/lib/constants';
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  RotateCcw,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = [
  'hsl(16, 90%, 55%)',   // orange
  'hsl(45, 95%, 55%)',   // yellow
  'hsl(175, 65%, 45%)',  // teal
  'hsl(340, 75%, 65%)',  // pink
  'hsl(260, 60%, 60%)',  // purple
];

const ReportsScreen = () => {
  const navigate = useNavigate();

  const { data: todaySales = [], isLoading } = useQuery({
    queryKey: ['todaySales'],
    queryFn: salesApi.getToday,
  });

  // Calculate report data from today's sales
  const totalRevenue = todaySales.reduce((sum, sale) => sum + (sale.totalPrice || 0), 0);
  const totalSales = todaySales.length;
  const totalItems = todaySales.reduce((sum, sale) => sum + (sale.itemCount || 0), 0);

  // Group by category (simplified - you might want to enhance this)
  const chartData = [
    { name: 'Sales', revenue: totalRevenue, items: totalItems },
  ];

  if (isLoading) {
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
            Daily Reports
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

        {/* Sales List */}
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
              <div className="space-y-3">
                {todaySales.map((sale) => (
                  <div
                    key={sale.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div>
                      <p className="font-medium">Sale #{sale.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {sale.itemCount} items
                      </p>
                    </div>
                    <p className="text-lg font-bold text-primary">
                      {formatPrice(sale.totalPrice)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsScreen;
