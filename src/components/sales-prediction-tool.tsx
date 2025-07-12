"use client";

import { useState } from 'react';
import { predictSales, type PredictSalesOutput } from '@/ai/flows/predict-sales';
import { historicalSalesData, inventory } from '@/lib/data';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Sparkles, BarChart, ChefHat } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export function SalesPredictionTool() {
  const [historicalData, setHistoricalData] = useState(JSON.stringify(historicalSalesData, null, 2));
  const [currentInventory, setCurrentInventory] = useState(JSON.stringify(inventory.map(i => ({ productName: i.name, currentStock: i.stock })), null, 2));
  const [prediction, setPrediction] = useState<PredictSalesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
        description: "Could not generate sales prediction. Please try again.",
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
            <Sparkles className="text-accent"/>
            AI Sales Prediction
        </CardTitle>
        <CardDescription>Predict tomorrow's sales and get cooking suggestions based on historical data and current inventory.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
      </CardContent>
      <CardFooter className="flex-col items-start gap-4">
        <Button onClick={handlePredict} disabled={isLoading}>
          {isLoading ? 'Predicting...' : 'Predict Sales for Tomorrow'}
        </Button>

        {isLoading && (
            <div className="w-full space-y-2">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        )}

        {prediction && (
          <div className="w-full pt-4">
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
