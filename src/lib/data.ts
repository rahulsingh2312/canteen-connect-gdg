import type { MenuItem, Order, InventoryItem } from './types';

export const menuItems: MenuItem[] = [
  {
    id: 1,
    name: 'Chole Bhature',
    description: 'Spicy chickpeas with fried bread.',
    price: 150,
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'chole bhature',
    category: 'Main Course',
    isOnSale: false,
  },
  {
    id: 2,
    name: 'Masala Dosa',
    description: 'Crispy rice pancake with potato filling.',
    price: 120,
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'masala dosa',
    category: 'Main Course',
    isOnSale: false,
  },
  {
    id: 3,
    name: 'Samosa Chaat',
    description: 'Samosa topped with yogurt, chutney, and spices.',
    price: 80,
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'samosa chaat',
    category: 'Snacks',
    isOnSale: false,
  },
  {
    id: 4,
    name: 'Paneer Tikka',
    description: 'Marinated cottage cheese cubes grilled to perfection.',
    price: 220,
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'paneer tikka',
    category: 'Appetizers',
    isOnSale: false,
  },
  {
    id: 5,
    name: 'Vada Pav',
    description: 'A classic Mumbai street food spicy potato fritter in a bun.',
    price: 60,
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'vada pav',
    category: 'Snacks',
    isOnSale: true,
    originalPrice: 60,
  },
  {
    id: 6,
    name: 'Masala Chai',
    description: 'Aromatic spiced tea with milk.',
    price: 40,
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'masala chai',
    category: 'Drinks',
    isOnSale: false,
  },
  {
    id: 7,
    name: 'Gulab Jamun',
    description: 'Soft, spongy balls soaked in sweet syrup.',
    price: 90,
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'gulab jamun',
    category: 'Desserts',
    isOnSale: true,
    originalPrice: 90,
  },
  {
    id: 8,
    name: 'Lassi',
    description: 'A refreshing yogurt-based drink, sweet or salted.',
    price: 70,
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'lassi drink',
    category: 'Drinks',
    isOnSale: false,
  },
];

export const inventory: InventoryItem[] = [
    { id: 1, name: 'Chickpeas', stock: 50, lowStockThreshold: 20 },
    { id: 2, name: 'Dosa Batter', stock: 40, lowStockThreshold: 15 },
    { id: 3, name: 'Samosas', stock: 15, lowStockThreshold: 10 },
    { id: 4, name: 'Paneer', stock: 100, lowStockThreshold: 30 },
    { id: 5, name: 'Pav Buns', stock: 8, lowStockThreshold: 10 },
    { id: 6, name: 'Tea Leaves', stock: 80, lowStockThreshold: 25 },
    { id: 7, name: 'Gulab Jamun Mix', stock: 20, lowStockThreshold: 10 },
    { id: 8, name: 'Yogurt', stock: 35, lowStockThreshold: 15 },
];

export const historicalSalesData = [
    { date: '2023-10-23', productName: 'Chole Bhature', quantity: 20 },
    { date: '2023-10-23', productName: 'Masala Dosa', quantity: 15 },
    { date: '2023-10-23', productName: 'Masala Chai', quantity: 30 },
    { date: '2023-10-24', productName: 'Chole Bhature', quantity: 22 },
    { date: '2023-10-24', productName: 'Masala Dosa', quantity: 18 },
    { date: '2023-10-24', productName: 'Paneer Tikka', quantity: 12 },
    { date: '2023-10-25', productName: 'Chole Bhature', quantity: 25 },
    { date: '2023-10-25', productName: 'Masala Dosa', quantity: 20 },
    { date: '2023-10-25', productName: 'Samosa Chaat', quantity: 10 },
];

export const currentOrders: Order[] = [
    {
        id: 'CC-101',
        items: [
            { ...menuItems[0], quantity: 1 },
            { ...menuItems[5], quantity: 1 }
        ],
        total: 190,
        status: 'Preparing',
        deliveryType: 'pickup',
        customerName: 'Aarav'
    },
    {
        id: 'CC-102',
        items: [{ ...menuItems[1], quantity: 2 }],
        total: 240,
        status: 'Received',
        deliveryType: 'delivery',
        benchNumber: '12B',
        customerName: 'Priya'
    },
    {
        id: 'CC-103',
        items: [
            { ...menuItems[2], quantity: 1 },
            { ...menuItems[3], quantity: 1 }
        ],
        total: 300,
        status: 'Ready for Pickup',
        deliveryType: 'pickup',
        customerName: 'Rohan'
    }
];
