import type { InventoryItem, MenuItem } from './types';

// This data is used by the DatabaseSeeder component to populate Firestore.
export const demoMenuItems: Omit<MenuItem, 'id'>[] = [
  {
    name: 'Chole Bhature',
    description: 'A classic North Indian dish of spiced chickpeas and fluffy fried bread.',
    price: 120,
    category: 'Main Course',
    isOnSale: false,
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'chole bhature',
    isPaused: false,
  },
  {
    name: 'Masala Dosa',
    description: 'A crispy rice crepe filled with spiced potatoes, served with chutney and sambar.',
    price: 90,
    category: 'Main Course',
    isOnSale: false,
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'masala dosa',
    isPaused: false,
  },
  {
    name: 'Samosa (2 Pcs)',
    description: 'Crispy pastry filled with spiced potatoes and peas.',
    price: 30,
    category: 'Snacks',
    isOnSale: false,
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'indian samosa',
    isPaused: false,
  },
  {
    name: 'Paneer Tikka',
    description: 'Cubes of paneer marinated in spices and grilled in a tandoor.',
    price: 150,
    category: 'Starters',
    isOnSale: false,
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'paneer tikka',
    isPaused: true,
  },
  {
    name: 'Masala Chai',
    description: 'Aromatic and spiced Indian tea with milk.',
    price: 20,
    category: 'Beverages',
    isOnSale: false,
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'masala chai',
    isPaused: false,
  },
];

export const demoInventoryItems: Omit<InventoryItem, 'id'>[] = [
    { name: 'Flour', stock: 50, lowStockThreshold: 10 },
    { name: 'Chickpeas', stock: 20, lowStockThreshold: 5 },
    { name: 'Potatoes', stock: 15, lowStockThreshold: 8 },
    { name: 'Paneer', stock: 8, lowStockThreshold: 4 },
    { name: 'Tea Leaves', stock: 100, lowStockThreshold: 20 },
    { name: 'Cooking Oil', stock: 40, lowStockThreshold: 10 },
];

// This is fallback sales data if not enough exists in the database.
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
