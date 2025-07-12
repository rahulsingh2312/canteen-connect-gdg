
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { demoMenuItems, demoInventoryItems } from '@/lib/data';
import { seedSalesData, seedInventoryData } from '@/lib/seed-sales-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { RotateCcw, Loader2 } from 'lucide-react';

export function DatabaseSeeder() {
  const [isDataPresent, setIsDataPresent] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkData = async () => {
      try {
        const menuItemsCollection = collection(db, 'menuItems');
        const snapshot = await getDocs(menuItemsCollection);
        if (snapshot.empty) {
          setIsDataPresent(false);
        }
      } catch (error) {
        console.error("Error checking for data:", error);
      }
    };
    checkData();
  }, []);

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    try {
      // First, clear existing data
      const menuItemsCollection = collection(db, 'menuItems');
      const inventoryCollection = collection(db, 'inventory');
      
      const menuSnapshot = await getDocs(menuItemsCollection);
      const inventorySnapshot = await getDocs(inventoryCollection);
      
      const batch = writeBatch(db);
      
      // Delete existing menu items
      menuSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      // Delete existing inventory items
      inventorySnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      // Add new demo data
      demoMenuItems.forEach((item) => {
        const docRef = doc(menuItemsCollection);
        batch.set(docRef, item);
      });

      demoInventoryItems.forEach((item) => {
        const docRef = doc(inventoryCollection);
        batch.set(docRef, item);
      });

      await batch.commit();

      // Seed sales prediction data
      await seedSalesData();
      await seedInventoryData();

      toast({
        title: 'Data Reset Complete!',
        description: 'Your menu and inventory have been reset with fresh demo data.',
      });
    } catch (error) {
      console.error('Error resetting database:', error);
      toast({
        title: 'Reset Failed',
        description: 'Could not reset the database.',
        variant: 'destructive',
      });
    } finally {
      setIsSeeding(false);
      // Force a reload to ensure all components refresh their data
      window.location.reload();
    }
  };

  // Always show the reset button

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <RotateCcw />
            Reset Menu Data
        </CardTitle>
        <CardDescription>
          Click the button below to reset your menu and inventory with fresh demo data. This will replace all existing data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleSeedDatabase} disabled={isSeeding}>
          {isSeeding ? <Loader2 className="animate-spin mr-2" /> : <RotateCcw className="mr-2" />}
          {isSeeding ? 'Resetting...' : 'Reset Menu Data'}
        </Button>
      </CardContent>
    </Card>
  );
}
