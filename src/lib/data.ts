import type { InventoryItem, MenuItem } from './types';

// This data is used by the DatabaseSeeder component to populate Firestore.
export const demoMenuItems: Omit<MenuItem, 'id'>[] = [
  {
    name: 'Chole Bhature',
    description: 'A classic North Indian dish of spiced chickpeas and fluffy fried bread.',
    price: 120,
    category: 'Main Course',
    isOnSale: false,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop&crop=center',
    dataAiHint: 'chole bhature indian food delicious authentic',
    isPaused: false,
  },
  {
    name: 'Masala Dosa',
    description: 'A crispy rice crepe filled with spiced potatoes, served with chutney and sambar.',
    price: 90,
    category: 'Main Course',
    isOnSale: false,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=400&fit=crop&crop=center',
    dataAiHint: 'masala dosa crispy indian crepe food',
    isPaused: false,
  },
  {
    name: 'Samosa (2 Pcs)',
    description: 'Crispy pastry filled with spiced potatoes and peas.',
    price: 30,
    category: 'Snacks',
    isOnSale: false,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop&crop=center',
    dataAiHint: 'indian samosa crispy pastry snack food',
    isPaused: false,
  },
  {
    name: 'Paneer Tikka',
    description: 'Cubes of paneer marinated in spices and grilled in a tandoor.',
    price: 150,
    category: 'Starters',
    isOnSale: false,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop&crop=center',
    dataAiHint: 'paneer tikka grilled indian appetizer food',
    isPaused: true,
  },
  {
    name: 'Masala Chai',
    description: 'Aromatic and spiced Indian tea with milk.',
    price: 20,
    category: 'Beverages',
    isOnSale: false,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=400&fit=crop&crop=center',
    dataAiHint: 'masala chai indian tea aromatic beverage',
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
