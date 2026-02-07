// Category types
export interface Category {
  id: number;
  name: string;
  dateCreated?: string;
  dateModified?: string;
}

export interface CategoryView extends Category {
  productCount: number;
  products?: Product[];
}

// Product types
export interface Product {
  id: number;
  name: string;
  categoryId?: number;
  description?: string;
  unitPrice?: number;
  retailPrice?: number;
  dateCreated?: string;
  dateModified?: string;
  category?: Category;
}

export interface ProductView extends Product {
  categoryName?: string;
}

// Cart types
export interface CartItem {
  product: ProductView;
  quantity: number;
}

// Sale types
export interface Sale {
  id: number;
  clientId?: number;
  employeeId?: number;
  currencyId: number;
  totalPrice?: number;
  date: string;
  salesTypeId?: number;
  note?: string;
  hasReturn?: boolean;
  dateCreated?: string;
  dateModified?: string;
}

export interface SaleView extends Sale {
  itemCount: number;
  items?: SalesItemView[];
}

export interface SalesItem {
  id: number;
  salesId: number;
  productId: number;
  quantity: number;
  unitPrice?: number;
  retailPrice: number;
  totalPrice?: number;
  discount?: number;
  dateCreated?: string;
  dateModified?: string;
}

export interface SalesItemView extends SalesItem {
  productName?: string;
}

// Checkout request (matches BOL DTO)
export interface SaleCreateRequest {
  clientId?: number;
  employeeId?: number;
  currencyId?: number;
  totalPrice?: number;
  salesTypeId?: number;
  note?: string;
  items: SalesItemCreateRequest[];
}

export interface SalesItemCreateRequest {
  productId: number;
  quantity: number;
  unitPrice?: number;
  retailPrice: number;
  totalPrice?: number;
  discount?: number;
}

// Return types (for later)
export interface ReturnRequest {
  saleId: number;
  items: ReturnItem[];
  reason?: string;
  staffPin: string;
}

export interface ReturnItem {
  saleItemId: number;
  quantity: number;
}

export interface ReturnRecord {
  id: number;
  saleId: number;
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
  category: string;
  itemsSold: number;
  revenue: number;
}

// Auth types
export interface Staff {
  pin: string;
  name: string;
  role: 'cashier' | 'manager';
}

// Legacy type alias for backward compatibility
export type ProductCategory = string;
