import { create } from 'zustand';
import type { CartItem, ProductView, Staff } from '@/types';

interface CartStore {
  items: CartItem[];
  addItem: (product: ProductView) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (product: ProductView) => {
    set((state) => {
      const existingItem = state.items.find((item) => item.product.id === product.id);
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return { items: [...state.items, { product, quantity: 1 }] };
    });
  },

  removeItem: (productId: number) => {
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    }));
  },

  updateQuantity: (productId: number, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    set((state) => ({
      items: state.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    }));
  },

  clearCart: () => set({ items: [] }),

  getTotal: () => {
    return get().items.reduce(
      (total, item) => total + (item.product.retailPrice || 0) * item.quantity,
      0
    );
  },

  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },
}));

// Auth store
interface AuthStore {
  isAuthenticated: boolean;
  staff: Staff | null;
  login: (staff: Staff) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: !!sessionStorage.getItem('staffPin'),
  staff: sessionStorage.getItem('staffName')
    ? {
        pin: sessionStorage.getItem('staffPin') || '',
        name: sessionStorage.getItem('staffName') || '',
        role: (sessionStorage.getItem('staffRole') as 'cashier' | 'manager') || 'cashier',
      }
    : null,

  login: (staff: Staff) => {
    sessionStorage.setItem('staffPin', staff.pin);
    sessionStorage.setItem('staffName', staff.name);
    sessionStorage.setItem('staffRole', staff.role);
    set({ isAuthenticated: true, staff });
  },

  logout: () => {
    sessionStorage.removeItem('staffPin');
    sessionStorage.removeItem('staffName');
    sessionStorage.removeItem('staffRole');
    set({ isAuthenticated: false, staff: null });
  },
}));
