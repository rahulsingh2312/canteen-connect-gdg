import { Timestamp } from 'firebase/firestore';

export interface MenuItem {
  id: string; // Changed to string for Firestore document ID
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isOnSale: boolean;
  dataAiHint: string;
  isPaused: boolean;
  nutrition?: {
    calories: number;
    protein: number;
    carbs?: number;
    fat?: number;
  };
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  status: 'Received' | 'Preparing' | 'Ready for Pickup' | 'Out for Delivery' | 'Delivered';
  deliveryType: 'pickup' | 'delivery';
  benchNumber?: string;
  customerName: string;
  paymentId: string;
  createdAt: Timestamp;
  nutrition?: {
    totalCalories: number;
    totalProtein: number;
    totalCarbs?: number;
    totalFat?: number;
  };
};

export type InventoryItem = {
    id: string;
    name: string;
    stock: number;
    lowStockThreshold: number;
    lastReorderRequest?: Timestamp;
};
