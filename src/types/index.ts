// Product types
export type ProductCategory = 'ticket' | 'food' | 'drink' | 'game' | 'service';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
  description?: string;
  icon?: string;
  stock?: number;
  isActive: boolean;
}

// Cart types
export interface CartItem {
  product: Product;
  quantity: number;
}

// Sale types
export interface Sale {
  id: string;
  items: SaleItem[];
  total: number;
  staffPin: string;
  createdAt: string;
  status: 'completed' | 'refunded' | 'partial_refund';
}

export interface SaleItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

// Return types
export interface ReturnRequest {
  saleId: string;
  items: ReturnItem[];
  reason?: string;
  staffPin: string;
}

export interface ReturnItem {
  saleItemId: string;
  quantity: number;
}

export interface ReturnRecord {
  id: string;
  saleId: string;
  items: ReturnItem[];
  total: number;
  reason?: string;
  staffPin: string;
  createdAt: string;
}

// Report types
export interface DailyReport {
  date: string;
  totalSales: number;
  totalRevenue: number;
  totalReturns: number;
  returnAmount: number;
  netRevenue: number;
  byCategory: CategorySummary[];
}

export interface CategorySummary {
  category: ProductCategory;
  itemsSold: number;
  revenue: number;
}

// Auth types
export interface Staff {
  pin: string;
  name: string;
  role: 'cashier' | 'manager';
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
