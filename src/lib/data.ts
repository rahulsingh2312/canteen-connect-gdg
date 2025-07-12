import type { Order, InventoryItem } from './types';
import type { MenuItem } from './types'; // Import MenuItem separately to avoid circular dependency issues

// The menuItems data is now fetched from Firebase in the respective page components.
// This array is left empty intentionally. You can manage menu items from the dashboard.
export const menuItems: MenuItem[] = [];

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

// Dummy data for current orders until it's also moved to Firebase
export const currentOrders: Order[] = [
    {
        id: 'CC-101',
        items: [],
        total: 190,
        status: 'Preparing',
        deliveryType: 'pickup',
        customerName: 'Aarav'
    },
    {
        id: 'CC-102',
        items: [],
        total: 240,
        status: 'Received',
        deliveryType: 'delivery',
        benchNumber: '12B',
        customerName: 'Priya'
    },
    {
        id: 'CC-103',
        items: [],
        total: 300,
        status: 'Ready for Pickup',
        deliveryType: 'pickup',
        customerName: 'Rohan'
    }
];

// Function to get a menu item by ID, to help bridge the gap for currentOrders
const tempMenuItemsForOrders: any[] = [
  {
    id: 1,
    name: 'Chole Bhature',
    price: 150,
  },
  {
    id: 6,
    name: 'Masala Chai',
    price: 40,
  },
  {
    id: 2,
    name: 'Masala Dosa',
    price: 120,
  },
    {
    id: 3,
    name: 'Samosa Chaat',
    price: 80,
  },
    {
    id: 4,
    name: 'Paneer Tikka',
    price: 220,
  },
];

const getItem = (id: number) => tempMenuItemsForOrders.find(i => i.id === id);

currentOrders[0].items = [
    { ...getItem(1), quantity: 1 },
    { ...getItem(6), quantity: 1 }
];
currentOrders[1].items = [{ ...getItem(2), quantity: 2 }];
currentOrders[2].items = [
    { ...getItem(3), quantity: 1 },
    { ...getItem(4), quantity: 1 }
];
