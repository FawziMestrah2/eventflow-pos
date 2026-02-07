import axios from 'axios';
import type {
  Product,
  ProductView,
  Category,
  CategoryView,
  SaleView,
  SaleCreateRequest,
  ReturnRequest,
  ReturnRecord,
  DailyReport
} from '@/types';

// Configure your API base URL here - point to your .NET API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://161.97.142.85:85/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token if needed
apiClient.interceptors.request.use((config) => {
  const staffPin = sessionStorage.getItem('staffPin');
  if (staffPin) {
    config.headers['X-Staff-Pin'] = staffPin;
  }
  return config;
});

// Categories API
export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/category');
    return response.data;
  },

  getAllDetails: async (): Promise<CategoryView[]> => {
    const response = await apiClient.get<CategoryView[]>('/category/GetDetails');
    return response.data;
  },

  getById: async (id: number): Promise<Category> => {
    const response = await apiClient.get<Category>(`/category/${id}`);
    return response.data;
  },

  getDetailsById: async (id: number): Promise<CategoryView> => {
    const response = await apiClient.get<CategoryView>(`/category/GetDetailsById/${id}`);
    return response.data;
  },

  create: async (data: Partial<Category>): Promise<Category> => {
    const response = await apiClient.post<Category>('/category', data);
    return response.data;
  },

  update: async (data: Category): Promise<Category> => {
    const response = await apiClient.put<Category>('/category', data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/category/${id}`);
  },
};

// Products API
export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>('/product');
    return response.data;
  },

  getAllDetails: async (): Promise<ProductView[]> => {
    const response = await apiClient.get<ProductView[]>('/product/GetDetails');
    return response.data;
  },

  getById: async (id: number): Promise<Product> => {
    const response = await apiClient.get<Product>(`/product/${id}`);
    return response.data;
  },

  getDetailsById: async (id: number): Promise<ProductView> => {
    const response = await apiClient.get<ProductView>(`/product/GetDetailsById/${id}`);
    return response.data;
  },

  create: async (data: Partial<Product>): Promise<Product> => {
    const response = await apiClient.post<Product>('/product', data);
    return response.data;
  },

  update: async (data: Product): Promise<Product> => {
    const response = await apiClient.put<Product>('/product', data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/product/${id}`);
  },
};

// Sales API
export const salesApi = {
  getAll: async (): Promise<SaleView[]> => {
    const response = await apiClient.get<SaleView[]>('/sale');
    return response.data;
  },

  getAllDetails: async (): Promise<SaleView[]> => {
    const response = await apiClient.get<SaleView[]>('/sale/GetDetails');
    return response.data;
  },

  getById: async (id: number): Promise<SaleView> => {
    const response = await apiClient.get<SaleView>(`/sale/${id}`);
    return response.data;
  },

  getDetailsById: async (id: number): Promise<SaleView> => {
    const response = await apiClient.get<SaleView>(`/sale/GetDetailsById/${id}`);
    return response.data;
  },

  // Main checkout endpoint - creates sale with items in one call
  checkout: async (data: SaleCreateRequest): Promise<SaleView> => {
    const response = await apiClient.post<SaleView>('/sale/Checkout', data);
    return response.data;
  },

  // Get today's sales
  getToday: async (): Promise<SaleView[]> => {
    const response = await apiClient.get<SaleView[]>('/sale/Today');
    return response.data;
  },

  // Get sales by date range
  getByDateRange: async (startDate: string, endDate: string): Promise<SaleView[]> => {
    const response = await apiClient.get<SaleView[]>(`/sale/ByDate?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/sale/${id}`);
  },
};

// Returns API (placeholder for later)
export const returnsApi = {
  create: async (data: ReturnRequest): Promise<ReturnRecord> => {
    const response = await apiClient.post<ReturnRecord>('/return', data);
    return response.data;
  },

  getBySaleId: async (saleId: number): Promise<ReturnRecord[]> => {
    const response = await apiClient.get<ReturnRecord[]>(`/return?saleId=${saleId}`);
    return response.data;
  },
};

// Reports API (you may need to create this in .NET)
export const reportsApi = {
  getDaily: async (date?: string): Promise<DailyReport> => {
    const queryDate = date || new Date().toISOString().split('T')[0];
    const response = await apiClient.get<DailyReport>(`/report/daily?date=${queryDate}`);
    return response.data;
  },

  getRange: async (startDate: string, endDate: string): Promise<DailyReport[]> => {
    const response = await apiClient.get<DailyReport[]>(`/report?start=${startDate}&end=${endDate}`);
    return response.data;
  },
};

// Auth API (you may need to create this in .NET)
export const authApi = {
  validatePin: async (pin: string): Promise<{ valid: boolean; name: string; role: string }> => {
    const response = await apiClient.post<{ valid: boolean; name: string; role: string }>('/auth/validate', { pin });
    return response.data;
  },
};

export default apiClient;
