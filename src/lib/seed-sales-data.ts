import { addDoc, collection } from 'firebase/firestore';
import { db } from './firebase';

const sampleSalesData = [
  // Day 1
  { date: '2024-01-15', productName: 'Chole Bhature', quantity: 20 },
  { date: '2024-01-15', productName: 'Masala Dosa', quantity: 15 },
  { date: '2024-01-15', productName: 'Masala Chai', quantity: 30 },
  { date: '2024-01-15', productName: 'Paneer Tikka', quantity: 12 },
  { date: '2024-01-15', productName: 'Samosa Chaat', quantity: 18 },
  
  // Day 2
  { date: '2024-01-16', productName: 'Chole Bhature', quantity: 22 },
  { date: '2024-01-16', productName: 'Masala Dosa', quantity: 18 },
  { date: '2024-01-16', productName: 'Paneer Tikka', quantity: 15 },
  { date: '2024-01-16', productName: 'Masala Chai', quantity: 35 },
  { date: '2024-01-16', productName: 'Samosa Chaat', quantity: 20 },
  
  // Day 3
  { date: '2024-01-17', productName: 'Chole Bhature', quantity: 25 },
  { date: '2024-01-17', productName: 'Masala Dosa', quantity: 20 },
  { date: '2024-01-17', productName: 'Samosa Chaat', quantity: 10 },
  { date: '2024-01-17', productName: 'Masala Chai', quantity: 28 },
  { date: '2024-01-17', productName: 'Paneer Tikka', quantity: 18 },
  
  // Day 4
  { date: '2024-01-18', productName: 'Chole Bhature', quantity: 28 },
  { date: '2024-01-18', productName: 'Masala Dosa', quantity: 22 },
  { date: '2024-01-18', productName: 'Paneer Tikka', quantity: 20 },
  { date: '2024-01-18', productName: 'Masala Chai', quantity: 40 },
  { date: '2024-01-18', productName: 'Samosa Chaat', quantity: 15 },
  
  // Day 5
  { date: '2024-01-19', productName: 'Chole Bhature', quantity: 30 },
  { date: '2024-01-19', productName: 'Masala Dosa', quantity: 25 },
  { date: '2024-01-19', productName: 'Paneer Tikka', quantity: 22 },
  { date: '2024-01-19', productName: 'Masala Chai', quantity: 45 },
  { date: '2024-01-19', productName: 'Samosa Chaat', quantity: 18 },
  
  // Day 6
  { date: '2024-01-20', productName: 'Chole Bhature', quantity: 32 },
  { date: '2024-01-20', productName: 'Masala Dosa', quantity: 28 },
  { date: '2024-01-20', productName: 'Paneer Tikka', quantity: 25 },
  { date: '2024-01-20', productName: 'Masala Chai', quantity: 50 },
  { date: '2024-01-20', productName: 'Samosa Chaat', quantity: 20 },
  
  // Day 7
  { date: '2024-01-21', productName: 'Chole Bhature', quantity: 35 },
  { date: '2024-01-21', productName: 'Masala Dosa', quantity: 30 },
  { date: '2024-01-21', productName: 'Paneer Tikka', quantity: 28 },
  { date: '2024-01-21', productName: 'Masala Chai', quantity: 55 },
  { date: '2024-01-21', productName: 'Samosa Chaat', quantity: 22 },
  
  // Day 8 (Today)
  { date: '2024-01-22', productName: 'Chole Bhature', quantity: 38 },
  { date: '2024-01-22', productName: 'Masala Dosa', quantity: 32 },
  { date: '2024-01-22', productName: 'Paneer Tikka', quantity: 30 },
  { date: '2024-01-22', productName: 'Masala Chai', quantity: 60 },
  { date: '2024-01-22', productName: 'Samosa Chaat', quantity: 25 },
];

export async function seedSalesData() {
  try {
    const salesRef = collection(db, 'sales');
    const promises = sampleSalesData.map(sale => 
      addDoc(salesRef, {
        ...sale,
        orderId: 'sample-order',
        timestamp: new Date(sale.date),
      })
    );
    
    await Promise.all(promises);
    console.log('Sales data seeded successfully');
    return true;
  } catch (error) {
    console.error('Error seeding sales data:', error);
    return false;
  }
}

export async function seedInventoryData() {
  try {
    const inventoryRef = collection(db, 'inventory');
    const inventoryData = [
      { name: 'Chole Bhature', stock: 15, lowStockThreshold: 5 },
      { name: 'Masala Dosa', stock: 20, lowStockThreshold: 8 },
      { name: 'Paneer Tikka', stock: 12, lowStockThreshold: 5 },
      { name: 'Masala Chai', stock: 50, lowStockThreshold: 15 },
      { name: 'Samosa Chaat', stock: 8, lowStockThreshold: 3 },
    ];
    
    const promises = inventoryData.map(item => addDoc(inventoryRef, item));
    await Promise.all(promises);
    console.log('Inventory data seeded successfully');
    return true;
  } catch (error) {
    console.error('Error seeding inventory data:', error);
    return false;
  }
} 