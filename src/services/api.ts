import axios from 'axios';
import type { 
  Product, 
  Sale, 
  SaleItem, 
  ReturnRequest, 
  ReturnRecord, 
  DailyReport,
  ApiResponse 
} from '@/types';

// Configure your API base URL here
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

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

// Products API
export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>('/products');
    return response.data.data;
  },

  getByCategory: async (category: string): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>(`/products?category=${category}`);
    return response.data.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data.data;
  },
};

// Sales API
export const salesApi = {
  create: async (data: { items: { productId: string; quantity: number; unitPrice: number }[]; staffPin: string }): Promise<Sale> => {
    const response = await apiClient.post<ApiResponse<Sale>>('/sales', data);
    return response.data.data;
  },

  getById: async (id: string): Promise<Sale> => {
    const response = await apiClient.get<ApiResponse<Sale>>(`/sales/${id}`);
    return response.data.data;
  },

  addItems: async (saleId: string, items: Partial<SaleItem>[]): Promise<Sale> => {
    const response = await apiClient.post<ApiResponse<Sale>>(`/sales/${saleId}/items`, { items });
    return response.data.data;
  },
};

// Returns API
export const returnsApi = {
  create: async (data: ReturnRequest): Promise<ReturnRecord> => {
    const response = await apiClient.post<ApiResponse<ReturnRecord>>('/returns', data);
    return response.data.data;
  },

  getBySaleId: async (saleId: string): Promise<ReturnRecord[]> => {
    const response = await apiClient.get<ApiResponse<ReturnRecord[]>>(`/returns?saleId=${saleId}`);
    return response.data.data;
  },
};

// Reports API
export const reportsApi = {
  getDaily: async (date?: string): Promise<DailyReport> => {
    const queryDate = date || new Date().toISOString().split('T')[0];
    const response = await apiClient.get<ApiResponse<DailyReport>>(`/reports/daily?date=${queryDate}`);
    return response.data.data;
  },

  getRange: async (startDate: string, endDate: string): Promise<DailyReport[]> => {
    const response = await apiClient.get<ApiResponse<DailyReport[]>>(`/reports?start=${startDate}&end=${endDate}`);
    return response.data.data;
  },
};

// Auth API
export const authApi = {
  validatePin: async (pin: string): Promise<{ valid: boolean; name: string; role: string }> => {
    const response = await apiClient.post<ApiResponse<{ valid: boolean; name: string; role: string }>>('/auth/validate', { pin });
    return response.data.data;
  },
};

export default apiClient;
