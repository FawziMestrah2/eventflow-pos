import type { Staff } from '@/types';

// Mock staff for PIN validation (until you add staff table to .NET API)
export const mockStaff: Staff[] = [
  { pin: '1234', name: 'Alice', role: 'cashier' },
  { pin: '5678', name: 'Bob', role: 'cashier' },
  { pin: '0000', name: 'Manager', role: 'manager' },
];
