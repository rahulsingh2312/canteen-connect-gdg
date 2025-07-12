"use client";

import { useState, useEffect } from 'react';
import { predictSales, type PredictSalesOutput } from '@/ai/flows/predict-sales';
import { historicalSalesData as fallbackSalesData } from '@/lib/data';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Sparkles, BarChart, ChefHat, Loader2, Database } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { InventoryItem, Order } from '@/lib/types';

export function SalesPredictionTool() {
  const [historicalData, setHistoricalData] = useState(JSON.stringify(fallbackSalesData, null, 2));
  const [currentInventory, setCurrentInventory] = useState('');
  const [prediction, setPrediction] = useState<PredictSalesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const { toast } = useToast();

  const fetchInitialData = async () => {
    setIsDataLoading(true);
    try {
      // Fetch current inventory from Firestore
      const inventorySnapshot = await getDocs(collection(db, "inventory"));
      const inventoryItems: Partial<InventoryItem>[] = [];
      inventorySnapshot.forEach(doc => {
        const data = doc.data();
        inventoryItems.push({ productName: data.name, currentStock: data.stock });
      });
      if (inventoryItems.length > 0) {
        setCurrentInventory(JSON.stringify(inventoryItems, null, 2));
      } else {
         setCurrentInventory('[]');
         toast({ title: "No inventory data found", description: "Please add items to inventory for accurate predictions.", variant: "destructive" });
      }

      // Fetch historical sales data from 'orders' collection
      const salesQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(50));
      const salesSnapshot = await getDocs(salesQuery);
      const salesData: { date: string; productName: string; quantity: number }[] = [];
      salesSnapshot.forEach(doc => {
        const order = doc.data() as Order;
        const orderDate = order.createdAt.toDate().toISOString().split('T')[0];
        order.items.forEach(item => {
            salesData.push({
                date: orderDate,
                productName: item.name,
                quantity: item.quantity,
            });
        });
      });
      
      if (salesData.length > 5) { // Use fetched data if we have a reasonable amount
        setHistoricalData(JSON.stringify(salesData, null, 2));
      } else {
        // Fallback to demo data if not enough sales history
        setHistoricalData(JSON.stringify(fallbackSalesData, null, 2));
        if (salesData.length === 0) {
          toast({ title: "Using Demo Sales Data", description: "Not enough sales history found in the database." });
        }
      }

    } catch (error) {
      console.error("Error fetching data for prediction:", error);
      toast({
        title: "Data Fetching Failed",
        description: "Could not load data from Firestore. Using fallback data.",
        variant: "destructive",
      });
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handlePredict = async () => {
    setIsLoading(true);
    setPrediction(null);
    try {
      const result = await predictSales({
        historicalSalesData: historicalData,
        currentInventory: currentInventory,
      });
      setPrediction(result);
    } catch (error) {
      console.error("Prediction failed:", error);
      toast({
        title: "Prediction Failed",
        description: "The AI could not generate a sales prediction. Check data format and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <Sparkles className="text-primary"/>
            AI Sales Prediction
        </CardTitle>
        <CardDescription>Predict tomorrow's sales and get cooking suggestions based on historical data and current inventory.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isDataLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-44 w-full" />
                <Skeleton className="h-44 w-full" />
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="historicalData">Historical Sales Data (JSON)</Label>
                <Textarea id="historicalData" value={historicalData} onChange={(e) => setHistoricalData(e.target.value)} rows={10} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="currentInventory">Current Inventory (JSON)</Label>
                <Textarea id="currentInventory" value={currentInventory} onChange={(e) => setCurrentInventory(e.target.value)} rows={10} />
            </div>
            </div>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-4">
        <div className="flex gap-4 items-center">
            <Button onClick={handlePredict} disabled={isLoading || isDataLoading}>
                {isLoading && <Loader2 className="mr-2 animate-spin" />}
                {isLoading ? 'Predicting...' : 'Predict Sales for Tomorrow'}
            </Button>
             <Button variant="outline" size="sm" onClick={fetchInitialData} disabled={isDataLoading}>
                <Database className="mr-2 h-4 w-4"/>
                {isDataLoading ? 'Loading Data...' : 'Reload Data from DB'}
            </Button>
        </div>

        {prediction && (
          <div className="w-full pt-4 animate-in fade-in">
            <h3 className="font-headline text-lg mb-2">Prediction Results</h3>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right flex items-center gap-2 justify-end"><BarChart className="h-4 w-4"/> Predicted Sales</TableHead>
                        <TableHead className="text-right flex items-center gap-2 justify-end"><ChefHat className="h-4 w-4"/> Suggested to Cook</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {prediction.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{item.productName}</TableCell>
                            <TableCell className="text-right">{item.predictedQuantity}</TableCell>
                            <TableCell className="text-right font-bold text-primary">{item.suggestedCookingQuantity}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
