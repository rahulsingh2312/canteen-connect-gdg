import type { InventoryItem, MenuItem } from './types';

// The menuItems data is now fetched from Firebase in the respective page components.
// This array is left empty intentionally. You can manage menu items from the dashboard.
export const menuItems: MenuItem[] = [];

// This data is now managed in Firebase. This is just a fallback for local dev or if firebase fails.
// Add some sample data to your `inventory` collection in Firestore with these fields:
// name (string), stock (number), lowStockThreshold (number)
export const inventory: InventoryItem[] = [];

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
