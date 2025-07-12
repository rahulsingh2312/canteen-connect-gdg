"use client";

import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { InventoryItem } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Warehouse, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';


export function DashboardInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "inventory"), (snapshot) => {
      const items: InventoryItem[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as InventoryItem);
      });
      setInventory(items.sort((a,b) => a.name.localeCompare(b.name)));
      setIsLoading(false);
    }, (error) => {
        console.error("Error fetching inventory: ", error);
        toast({
            title: "Error",
            description: "Could not fetch inventory items.",
            variant: "destructive",
        });
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const handleReorder = async (item: InventoryItem) => {
    // In a real app, this would trigger a more complex workflow (e.g., creating a purchase order).
    // For this demo, we'll just log the reorder time and show a notification.
    const itemRef = doc(db, 'inventory', item.id);
    await updateDoc(itemRef, {
        lastReorderRequest: serverTimestamp()
    });

    toast({
        title: "Alert Sent!",
        description: `A reorder request for ${item.name} has been sent to the supplier.`,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <Warehouse/>
            Items on Hand
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="text-center">Stock Level</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-32 mx-auto" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-20 mx-auto" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                    </TableRow>
                ))
            ) : inventory.length > 0 ? (
                 inventory.map(item => {
                    const isLowStock = item.stock <= item.lowStockThreshold;
                    const stockPercentage = Math.min((item.stock / (item.lowStockThreshold * 2)) * 100, 100);

                    return (
                        <TableRow key={item.id} className={isLowStock ? 'bg-destructive/5' : ''}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2 justify-center">
                                <span className="w-8 text-right font-mono">{item.stock}</span>
                                <Progress value={stockPercentage} className="w-24 h-2" />
                            </div>
                        </TableCell>
                        <TableCell className="text-center">
                            {isLowStock ? (
                            <Badge variant="destructive">Low Stock</Badge>
                            ) : (
                            <Badge variant="secondary">In Stock</Badge>
                            )}
                        </TableCell>
                        <TableCell className="text-right">
                            {isLowStock ? (
                                <Button size="sm" variant="outline" onClick={() => handleReorder(item)}>
                                    Order More
                                </Button>
                            ): <Button size="sm" variant="outline" onClick={() => handleReorder(item)}>
                            no action needed
                        </Button>} 
                        </TableCell>
                        </TableRow>
                    );
                })
            ) : (
                 <TableRow><TableCell colSpan={4} className="text-center h-24">No inventory data found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
