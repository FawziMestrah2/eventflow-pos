import type { Staff } from '@/types';

// Mock staff for PIN validation (until you add staff table to .NET API)
export const mockStaff: Staff[] = [
  { pin: '1234', name: 'User1', role: 'cashier' },
  { pin: '5678', name: 'User2', role: 'cashier' },
  { pin: '0000', name: 'User0', role: 'manager' },
];
