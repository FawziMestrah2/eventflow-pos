import type { Product, Sale, DailyReport, CategorySummary } from '@/types';

// Mock products for development
export const mockProducts: Product[] = [
  // Tickets
  { id: 't1', name: 'Entry Ticket', price: 5.00, category: 'ticket', icon: 'Ticket', isActive: true },
  { id: 't2', name: 'VIP Pass', price: 15.00, category: 'ticket', icon: 'Crown', isActive: true },
  { id: 't3', name: 'Kids Entry', price: 3.00, category: 'ticket', icon: 'Baby', isActive: true },
  { id: 't4', name: 'Family Pack', price: 12.00, category: 'ticket', icon: 'Users', isActive: true },

  // Food
  { id: 'f1', name: 'Hot Dog', price: 4.50, category: 'food', icon: 'Sandwich', isActive: true },
  { id: 'f2', name: 'Popcorn', price: 3.00, category: 'food', icon: 'Popcorn', isActive: true },
  { id: 'f3', name: 'Cotton Candy', price: 3.50, category: 'food', icon: 'Candy', isActive: true },
  { id: 'f4', name: 'French Fries', price: 4.00, category: 'food', icon: 'UtensilsCrossed', isActive: true },
  { id: 'f5', name: 'Burger', price: 6.50, category: 'food', icon: 'Beef', isActive: true },
  { id: 'f6', name: 'Ice Cream', price: 3.00, category: 'food', icon: 'IceCream', isActive: true },

  // Drinks
  { id: 'd1', name: 'Soda', price: 2.50, category: 'drink', icon: 'Cup', isActive: true },
  { id: 'd2', name: 'Water', price: 1.50, category: 'drink', icon: 'Droplet', isActive: true },
  { id: 'd3', name: 'Lemonade', price: 3.00, category: 'drink', icon: 'Citrus', isActive: true },
  { id: 'd4', name: 'Beer', price: 5.00, category: 'drink', icon: 'Beer', isActive: true },
  { id: 'd5', name: 'Wine', price: 6.00, category: 'drink', icon: 'Wine', isActive: true },

  // Games
  { id: 'g1', name: 'Ring Toss', price: 2.00, category: 'game', icon: 'Circle', isActive: true },
  { id: 'g2', name: 'Duck Pond', price: 2.00, category: 'game', icon: 'Bird', isActive: true },
  { id: 'g3', name: 'Balloon Darts', price: 3.00, category: 'game', icon: 'Target', isActive: true },
  { id: 'g4', name: 'Wheel Spin', price: 2.50, category: 'game', icon: 'RotateCw', isActive: true },
  { id: 'g5', name: 'Fishing Game', price: 2.00, category: 'game', icon: 'Fish', isActive: true },

  // Services
  { id: 's1', name: 'Face Paint', price: 5.00, category: 'service', icon: 'Palette', isActive: true },
  { id: 's2', name: 'Photo Booth', price: 4.00, category: 'service', icon: 'Camera', isActive: true },
  { id: 's3', name: 'Raffle Ticket', price: 1.00, category: 'service', icon: 'Sparkles', isActive: true },
  { id: 's4', name: 'Pony Ride', price: 8.00, category: 'service', icon: 'Ribbon', isActive: true },
];

// Mock sales for development
export const mockSales: Sale[] = [
  {
    id: 'sale-001',
    items: [
      { id: 'si-1', productId: 't1', productName: 'Entry Ticket', quantity: 2, unitPrice: 5.00, subtotal: 10.00 },
      { id: 'si-2', productId: 'f1', productName: 'Hot Dog', quantity: 2, unitPrice: 4.50, subtotal: 9.00 },
      { id: 'si-3', productId: 'd1', productName: 'Soda', quantity: 2, unitPrice: 2.50, subtotal: 5.00 },
    ],
    total: 24.00,
    staffPin: '1234',
    createdAt: new Date().toISOString(),
    status: 'completed',
  },
  {
    id: 'sale-002',
    items: [
      { id: 'si-4', productId: 't2', productName: 'VIP Pass', quantity: 1, unitPrice: 15.00, subtotal: 15.00 },
      { id: 'si-5', productId: 'g1', productName: 'Ring Toss', quantity: 3, unitPrice: 2.00, subtotal: 6.00 },
    ],
    total: 21.00,
    staffPin: '1234',
    createdAt: new Date().toISOString(),
    status: 'completed',
  },
];

// Mock daily report
export const mockDailyReport: DailyReport = {
  date: new Date().toISOString().split('T')[0],
  totalSales: 45,
  totalRevenue: 892.50,
  totalReturns: 3,
  returnAmount: 24.50,
  netRevenue: 868.00,
  byCategory: [
    { category: 'ticket', itemsSold: 67, revenue: 335.00 },
    { category: 'food', itemsSold: 89, revenue: 312.00 },
    { category: 'drink', itemsSold: 78, revenue: 156.00 },
    { category: 'game', itemsSold: 45, revenue: 90.00 },
    { category: 'service', itemsSold: 12, revenue: 60.00 },
  ] as CategorySummary[],
};

// Mock staff for PIN validation
export const mockStaff = [
  { pin: '1234', name: 'Alice', role: 'cashier' },
  { pin: '5678', name: 'Bob', role: 'cashier' },
  { pin: '0000', name: 'Manager', role: 'manager' },
];
