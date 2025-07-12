export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isOnSale: boolean;
  dataAiHint: string;
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
};

export type InventoryItem = {
    id: number;
    name: string;
    stock: number;
    lowStockThreshold: number;
};
