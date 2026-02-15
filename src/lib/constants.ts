import {
  Ticket,
  UtensilsCrossed,
  Wine,
  Gamepad2,
  Sparkles,
  Package,
  LucideIcon
} from 'lucide-react';

// Currency configuration
export const currencies = {
  LBP: {
    code: 'LBP',
    symbol: 'L.L.',
    name: 'Lebanese Pound',
    rate: 1, // Base currency
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    rate: 90000, // 1 USD = 90,000 LBP
  },
} as const;

export type CurrencyCode = keyof typeof currencies;

// Format price in LBP (base currency)
export const formatPrice = (price?: number | null): string => {
  return `${(price || 0).toLocaleString('en-US')} L.L.`;
};

// Format price in USD (secondary currency)
export const formatPriceLBP = (price?: number | null): string => {
  const usdAmount = (price || 0) / currencies.USD.rate;
  return `$${usdAmount.toFixed(2)}`;
};

// Format price in both currencies
export const formatPriceDual = (price?: number | null): { lbp: string; usd: string } => {
  return {
    lbp: formatPrice(price),
    usd: formatPriceLBP(price),
  };
};

// Convert LBP to USD
export const lbpToUsd = (lbp: number): number => {
  return lbp / currencies.USD.rate;
};

// Convert USD to LBP
export const usdToLbp = (usd: number): number => {
  return usd * currencies.USD.rate;
};

// Category styling config - maps category names (case-insensitive) to styles
export const categoryStyleConfig: Record<string, {
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
}> = {
  tickets: {
    icon: Ticket,
    colorClass: 'text-category-tickets',
    bgClass: 'bg-category-tickets'
  },
  ticket: {
    icon: Ticket,
    colorClass: 'text-category-tickets',
    bgClass: 'bg-category-tickets'
  },
  food: {
    icon: UtensilsCrossed,
    colorClass: 'text-category-food',
    bgClass: 'bg-category-food'
  },
  drinks: {
    icon: Wine,
    colorClass: 'text-category-drinks',
    bgClass: 'bg-category-drinks'
  },
  drink: {
    icon: Wine,
    colorClass: 'text-category-drinks',
    bgClass: 'bg-category-drinks'
  },
  games: {
    icon: Gamepad2,
    colorClass: 'text-category-games',
    bgClass: 'bg-category-games'
  },
  game: {
    icon: Gamepad2,
    colorClass: 'text-category-games',
    bgClass: 'bg-category-games'
  },
  services: {
    icon: Sparkles,
    colorClass: 'text-category-services',
    bgClass: 'bg-category-services'
  },
  service: {
    icon: Sparkles,
    colorClass: 'text-category-services',
    bgClass: 'bg-category-services'
  },
};

// Default style for unknown categories
export const defaultCategoryStyle = {
  icon: Package,
  colorClass: 'text-primary',
  bgClass: 'bg-primary'
};

// Helper function to get category style by name
export const getCategoryStyle = (categoryName?: string | null) => {
  if (!categoryName) return defaultCategoryStyle;
  const key = categoryName.toLowerCase();
  return categoryStyleConfig[key] || defaultCategoryStyle;
};

export const formatDateTime = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));
};
