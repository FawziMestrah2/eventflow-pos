import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockDailyReport } from '@/data/mockData';
import { categoryConfig, formatPrice } from '@/lib/constants';
import { 
  ArrowLeft, 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  ShoppingCart,
  RotateCcw 
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
  'hsl(16, 90%, 55%)',   // tickets - orange
  'hsl(45, 95%, 55%)',   // food - yellow
  'hsl(175, 65%, 45%)',  // drinks - teal
  'hsl(340, 75%, 65%)',  // games - pink
  'hsl(260, 60%, 60%)',  // services - purple
];

const ReportsScreen = () => {
  const navigate = useNavigate();
  const report = mockDailyReport;

  const chartData = report.byCategory.map((cat) => ({
    name: categoryConfig[cat.category].label,
    revenue: cat.revenue,
    items: cat.itemsSold,
    category: cat.category,
  }));

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
                  <p className="text-2xl font-bold">{formatPrice(report.totalRevenue)}</p>
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
                  <p className="text-2xl font-bold text-success">{formatPrice(report.netRevenue)}</p>
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
                  <p className="text-2xl font-bold">{report.totalSales}</p>
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
                  <p className="text-sm text-muted-foreground">Returns</p>
                  <p className="text-2xl font-bold">{report.totalReturns} ({formatPrice(report.returnAmount)})</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-sm" />
                    <YAxis className="text-sm" />
                    <Tooltip 
                      formatter={(value: number) => formatPrice(value)}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Items Sold Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Items Sold Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="items"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {report.byCategory.map((cat, index) => {
                const config = categoryConfig[cat.category];
                return (
                  <div
                    key={cat.category}
                    className="p-4 rounded-lg border-2"
                    style={{ borderColor: COLORS[index] }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <config.icon className="h-5 w-5" style={{ color: COLORS[index] }} />
                      <span className="font-semibold">{config.label}</span>
                    </div>
                    <p className="text-2xl font-bold">{formatPrice(cat.revenue)}</p>
                    <p className="text-sm text-muted-foreground">{cat.itemsSold} items sold</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsScreen;
