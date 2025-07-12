import type { InventoryItem } from './types';
import type { MenuItem } from './types'; // Import MenuItem separately to avoid circular dependency issues

// The menuItems data is now fetched from Firebase in the respective page components.
// This array is left empty intentionally. You can manage menu items from the dashboard.
export const menuItems: MenuItem[] = [];

// This data is now managed in Firebase. This is fallback data for the sales prediction tool.
export const inventory: Pick<InventoryItem, 'name' | 'stock'>[] = [
    { name: 'Chickpeas', stock: 50 },
    { name: 'Dosa Batter', stock: 40 },
    { name: 'Samosas', stock: 15 },
    { name: 'Paneer', stock: 100 },
    { name: 'Pav Buns', stock: 8 },
    { name: 'Tea Leaves', stock: 80 },
    { name: 'Gulab Jamun Mix', stock: 20 },
    { name: 'Yogurt', stock: 35 },
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
