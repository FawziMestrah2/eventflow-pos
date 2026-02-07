import type { ProductCategory } from '@/types';
import { 
  Ticket, 
  UtensilsCrossed, 
  Wine, 
  Gamepad2, 
  Sparkles,
  LucideIcon
} from 'lucide-react';

export const categoryConfig: Record<ProductCategory, { 
  label: string; 
  icon: LucideIcon; 
  colorClass: string;
  bgClass: string;
}> = {
  ticket: { 
    label: 'Tickets', 
    icon: Ticket, 
    colorClass: 'text-category-tickets',
    bgClass: 'bg-category-tickets'
  },
  food: { 
    label: 'Food', 
    icon: UtensilsCrossed, 
    colorClass: 'text-category-food',
    bgClass: 'bg-category-food'
  },
  drink: { 
    label: 'Drinks', 
    icon: Wine, 
    colorClass: 'text-category-drinks',
    bgClass: 'bg-category-drinks'
  },
  game: { 
    label: 'Games', 
    icon: Gamepad2, 
    colorClass: 'text-category-games',
    bgClass: 'bg-category-games'
  },
  service: { 
    label: 'Services', 
    icon: Sparkles, 
    colorClass: 'text-category-services',
    bgClass: 'bg-category-services'
  },
};

export const categories: ProductCategory[] = ['ticket', 'food', 'drink', 'game', 'service'];

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
};

export const formatDateTime = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));
};
