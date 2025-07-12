import type { MenuItem, Order, InventoryItem } from './types';

export const menuItems: MenuItem[] = [
  {
    id: 1,
    name: 'Veggie Burger',
    description: 'A delicious and healthy veggie patty on a whole wheat bun.',
    price: 8.99,
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'veggie burger',
    category: 'Burgers',
    isOnSale: false,
  },
  {
    id: 2,
    name: 'Margherita Pizza',
    description: 'Classic pizza with fresh mozzarella, tomatoes, and basil.',
    price: 12.5,
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'margherita pizza',
    category: 'Pizza',
    isOnSale: false,
  },
  {
    id: 3,
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce, parmesan, and croutons with Caesar dressing.',
    price: 7.25,
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'caesar salad',
    category: 'Salads',
    isOnSale: false,
  },
  {
    id: 4,
    name: 'Pasta Carbonara',
    description: 'Spaghetti with a creamy egg sauce, pancetta, and pecorino cheese.',
    price: 11.0,
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'pasta carbonara',
    category: 'Pasta',
    isOnSale: false,
  },
  {
    id: 5,
    name: 'Chicken Sandwich',
    description: 'Grilled chicken breast with lettuce, tomato, and mayo.',
    price: 9.5,
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'chicken sandwich',
    category: 'Sandwiches',
    isOnSale: true,
    originalPrice: 9.50,
  },
  {
    id: 6,
    name: 'Iced Coffee',
    description: 'Chilled coffee served over ice, perfect for a hot day.',
    price: 3.5,
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'iced coffee',
    category: 'Drinks',
    isOnSale: false,
  },
  {
    id: 7,
    name: 'Chocolate Brownie',
    description: 'A rich and fudgy chocolate brownie.',
    price: 4.0,
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'chocolate brownie',
    category: 'Desserts',
    isOnSale: true,
    originalPrice: 4.00,
  },
  {
    id: 8,
    name: 'Fruit Smoothie',
    description: 'A refreshing blend of mixed fruits and yogurt.',
    price: 6.0,
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'fruit smoothie',
    category: 'Drinks',
    isOnSale: false,
  },
];

export const inventory: InventoryItem[] = [
    { id: 1, name: 'Veggie Patties', stock: 50, lowStockThreshold: 20 },
    { id: 2, name: 'Pizza Dough', stock: 40, lowStockThreshold: 15 },
    { id: 3, name: 'Romaine Lettuce', stock: 15, lowStockThreshold: 10 },
    { id: 4, name: 'Spaghetti', stock: 100, lowStockThreshold: 30 },
    { id: 5, name: 'Chicken Breast', stock: 8, lowStockThreshold: 10 },
    { id: 6, name: 'Coffee Beans', stock: 80, lowStockThreshold: 25 },
    { id: 7, name: 'Brownie Mix', stock: 20, lowStockThreshold: 10 },
    { id: 8, name: 'Mixed Fruits (Frozen)', stock: 35, lowStockThreshold: 15 },
];

export const historicalSalesData = [
    { date: '2023-10-23', productName: 'Veggie Burger', quantity: 20 },
    { date: '2023-10-23', productName: 'Margherita Pizza', quantity: 15 },
    { date: '2023-10-23', productName: 'Iced Coffee', quantity: 30 },
    { date: '2023-10-24', productName: 'Veggie Burger', quantity: 22 },
    { date: '2023-10-24', productName: 'Margherita Pizza', quantity: 18 },
    { date: '2023-10-24', productName: 'Pasta Carbonara', quantity: 12 },
    { date: '2023-10-25', productName: 'Veggie Burger', quantity: 25 },
    { date: '2023-10-25', productName: 'Margherita Pizza', quantity: 20 },
    { date: '2023-10-25', productName: 'Caesar Salad', quantity: 10 },
];

export const currentOrders: Order[] = [
    {
        id: 'CC-101',
        items: [
            { ...menuItems[0], quantity: 1 },
            { ...menuItems[5], quantity: 1 }
        ],
        total: 12.49,
        status: 'Preparing',
        deliveryType: 'pickup',
        customerName: 'Alice'
    },
    {
        id: 'CC-102',
        items: [{ ...menuItems[1], quantity: 2 }],
        total: 25.00,
        status: 'Received',
        deliveryType: 'delivery',
        benchNumber: '12B',
        customerName: 'Bob'
    },
    {
        id: 'CC-103',
        items: [
            { ...menuItems[2], quantity: 1 },
            { ...menuItems[3], quantity: 1 }
        ],
        total: 18.25,
        status: 'Ready for Pickup',
        deliveryType: 'pickup',
        customerName: 'Charlie'
    }
];
