import { collection, getDocs, addDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';
import type { Order } from './types';

export interface SalesData {
  date: string;
  productName: string;
  quantity: number;
}

export interface InventoryItem {
  productName: string;
  currentStock: number;
  lowStockThreshold: number;
}

export interface SalesPrediction {
  productName: string;
  predictedQuantity: number;
  confidence: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface CookingSuggestion {
  productName: string;
  suggestedQuantity: number;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

/**
 * Records a new sale when an order is placed
 */
export async function recordSale(order: Order) {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Group items by product and sum quantities
    const salesByProduct = order.items.reduce((acc, item) => {
      if (acc[item.name]) {
        acc[item.name] += item.quantity;
      } else {
        acc[item.name] = item.quantity;
      }
      return acc;
    }, {} as Record<string, number>);

    // Record each product sale
    const salesPromises = Object.entries(salesByProduct).map(([productName, quantity]) => {
      return addDoc(collection(db, 'sales'), {
        date: today,
        productName,
        quantity,
        orderId: order.id,
        timestamp: new Date(),
      });
    });

    await Promise.all(salesPromises);
    console.log('Sales recorded successfully for order:', order.id);
  } catch (error) {
    console.error('Error recording sales:', error);
    throw error;
  }
}

/**
 * Gets historical sales data for the last 30 days
 */
export async function getHistoricalSalesData(): Promise<SalesData[]> {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const salesRef = collection(db, 'sales');
    const q = query(
      salesRef,
      where('date', '>=', thirtyDaysAgo.toISOString().split('T')[0]),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const salesData: SalesData[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      salesData.push({
        date: data.date,
        productName: data.productName,
        quantity: data.quantity,
      });
    });
    
    return salesData;
  } catch (error) {
    console.error('Error fetching historical sales:', error);
    return [];
  }
}

/**
 * Gets current inventory data
 */
export async function getCurrentInventory(): Promise<InventoryItem[]> {
  try {
    const inventoryRef = collection(db, 'inventory');
    const querySnapshot = await getDocs(inventoryRef);
    const inventory: InventoryItem[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      inventory.push({
        productName: data.name,
        currentStock: data.stock || 0,
        lowStockThreshold: data.lowStockThreshold || 5,
      });
    });
    
    return inventory;
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return [];
  }
}

/**
 * Analyzes sales trends and predicts tomorrow's sales
 */
export function predictSales(historicalData: SalesData[]): SalesPrediction[] {
  const predictions: SalesPrediction[] = [];
  const productGroups = groupSalesByProduct(historicalData);
  
  Object.entries(productGroups).forEach(([productName, sales]) => {
    const prediction = calculatePrediction(productName, sales);
    predictions.push(prediction);
  });
  
  return predictions.sort((a, b) => b.predictedQuantity - a.predictedQuantity);
}

/**
 * Groups sales data by product
 */
function groupSalesByProduct(salesData: SalesData[]): Record<string, SalesData[]> {
  return salesData.reduce((acc, sale) => {
    if (!acc[sale.productName]) {
      acc[sale.productName] = [];
    }
    acc[sale.productName].push(sale);
    return acc;
  }, {} as Record<string, SalesData[]>);
}

/**
 * Calculates prediction for a single product
 */
function calculatePrediction(productName: string, sales: SalesData[]): SalesPrediction {
  // Sort by date
  const sortedSales = sales.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Calculate average daily sales
  const totalQuantity = sales.reduce((sum, sale) => sum + sale.quantity, 0);
  const averageDaily = totalQuantity / sales.length;
  
  // Calculate trend (simple linear regression)
  const trend = calculateTrend(sortedSales);
  
  // Apply trend to prediction
  let predictedQuantity = averageDaily;
  if (trend === 'increasing') {
    predictedQuantity *= 1.2; // 20% increase
  } else if (trend === 'decreasing') {
    predictedQuantity *= 0.8; // 20% decrease
  }
  
  // Calculate confidence based on data consistency
  const confidence = calculateConfidence(sales);
  
  return {
    productName,
    predictedQuantity: Math.round(predictedQuantity),
    confidence,
    trend,
  };
}

/**
 * Calculates sales trend
 */
function calculateTrend(sales: SalesData[]): 'increasing' | 'decreasing' | 'stable' {
  if (sales.length < 2) return 'stable';
  
  const recentSales = sales.slice(-3); // Last 3 days
  const olderSales = sales.slice(-6, -3); // 3 days before that
  
  const recentAvg = recentSales.reduce((sum, sale) => sum + sale.quantity, 0) / recentSales.length;
  const olderAvg = olderSales.reduce((sum, sale) => sum + sale.quantity, 0) / olderSales.length;
  
  const change = (recentAvg - olderAvg) / olderAvg;
  
  if (change > 0.1) return 'increasing';
  if (change < -0.1) return 'decreasing';
  return 'stable';
}

/**
 * Calculates prediction confidence
 */
function calculateConfidence(sales: SalesData[]): number {
  if (sales.length < 3) return 0.5;
  
  const quantities = sales.map(s => s.quantity);
  const mean = quantities.reduce((sum, q) => sum + q, 0) / quantities.length;
  const variance = quantities.reduce((sum, q) => sum + Math.pow(q - mean, 2), 0) / quantities.length;
  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = stdDev / mean;
  
  // Higher CV = lower confidence
  return Math.max(0.1, Math.min(0.95, 1 - coefficientOfVariation));
}

/**
 * Generates cooking suggestions based on predictions and inventory
 */
export function generateCookingSuggestions(
  predictions: SalesPrediction[],
  inventory: InventoryItem[]
): CookingSuggestion[] {
  const suggestions: CookingSuggestion[] = [];
  
  predictions.forEach(prediction => {
    const inventoryItem = inventory.find(item => item.productName === prediction.productName);
    
    if (!inventoryItem) {
      // No inventory data, suggest based on prediction
      suggestions.push({
        productName: prediction.productName,
        suggestedQuantity: Math.ceil(prediction.predictedQuantity * 1.1), // 10% buffer
        reason: `Predicted demand: ${prediction.predictedQuantity} units`,
        priority: prediction.predictedQuantity > 15 ? 'high' : 'medium',
      });
      return;
    }
    
    const currentStock = inventoryItem.currentStock;
    const predictedDemand = prediction.predictedQuantity;
    const stockGap = predictedDemand - currentStock;
    
    if (stockGap > 0) {
      // Need to prepare more
      const suggestedQuantity = Math.ceil(stockGap * 1.2); // 20% buffer
      const priority = stockGap > 10 ? 'high' : stockGap > 5 ? 'medium' : 'low';
      
      suggestions.push({
        productName: prediction.productName,
        suggestedQuantity,
        reason: `Current stock: ${currentStock}, Predicted demand: ${predictedDemand}`,
        priority,
      });
    } else if (currentStock < inventoryItem.lowStockThreshold) {
      // Low stock warning
      suggestions.push({
        productName: prediction.productName,
        suggestedQuantity: Math.ceil(predictedDemand * 0.5), // Prepare half of predicted demand
        reason: `Low stock alert: ${currentStock} units remaining`,
        priority: 'high',
      });
    }
  });
  
  return suggestions.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

/**
 * Gets sales statistics for dashboard
 */
export async function getSalesStatistics() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    // Today's sales
    const todaySales = await getSalesForDate(today);
    const todayTotal = todaySales.reduce((sum, sale) => sum + sale.quantity, 0);
    
    // Yesterday's sales
    const yesterdaySales = await getSalesForDate(yesterdayStr);
    const yesterdayTotal = yesterdaySales.reduce((sum, sale) => sum + sale.quantity, 0);
    
    // Weekly average
    const weeklySales = await getSalesForLastWeek();
    const weeklyAverage = weeklySales.reduce((sum, sale) => sum + sale.quantity, 0) / 7;
    
    return {
      todayTotal,
      yesterdayTotal,
      weeklyAverage: Math.round(weeklyAverage),
      growth: yesterdayTotal > 0 ? ((todayTotal - yesterdayTotal) / yesterdayTotal) * 100 : 0,
    };
  } catch (error) {
    console.error('Error getting sales statistics:', error);
    return {
      todayTotal: 0,
      yesterdayTotal: 0,
      weeklyAverage: 0,
      growth: 0,
    };
  }
}

async function getSalesForDate(date: string): Promise<SalesData[]> {
  const salesRef = collection(db, 'sales');
  const q = query(salesRef, where('date', '==', date));
  const querySnapshot = await getDocs(q);
  
  const sales: SalesData[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    sales.push({
      date: data.date,
      productName: data.productName,
      quantity: data.quantity,
    });
  });
  
  return sales;
}

async function getSalesForLastWeek(): Promise<SalesData[]> {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  const salesRef = collection(db, 'sales');
  const q = query(
    salesRef,
    where('date', '>=', weekAgo.toISOString().split('T')[0]),
    orderBy('date', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  const sales: SalesData[] = [];
  
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    sales.push({
      date: data.date,
      productName: data.productName,
      quantity: data.quantity,
    });
  });
  
  return sales;
} 