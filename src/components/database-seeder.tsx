
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { demoMenuItems, demoInventoryItems } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { Rocket, Loader2 } from 'lucide-react';

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
      const batch = writeBatch(db);

      // Seed Menu Items
      const menuItemsCollection = collection(db, 'menuItems');
      demoMenuItems.forEach((item) => {
        const docRef = doc(menuItemsCollection);
        batch.set(docRef, item);
      });

      // Seed Inventory Items
      const inventoryCollection = collection(db, 'inventory');
      demoInventoryItems.forEach((item) => {
        const docRef = doc(inventoryCollection);
        batch.set(docRef, item);
      });

      await batch.commit();

      toast({
        title: 'Database Seeded!',
        description: 'Your menu and inventory have been populated with demo data.',
      });
      setIsDataPresent(true); 
    } catch (error) {
      console.error('Error seeding database:', error);
      toast({
        title: 'Seeding Failed',
        description: 'Could not add demo data to the database.',
        variant: 'destructive',
      });
    } finally {
      setIsSeeding(false);
      // Optional: force a reload to ensure all components refresh their data
      window.location.reload();
    }
  };

  if (isDataPresent) {
    return null; // Don't show anything if data is already there
  }

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <Rocket />
            Welcome to CanteenConnect!
        </CardTitle>
        <CardDescription>
          Your database appears to be empty. Click the button below to populate it with some demo menu items and inventory to get started.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleSeedDatabase} disabled={isSeeding}>
          {isSeeding ? <Loader2 className="animate-spin mr-2" /> : <Rocket className="mr-2" />}
          {isSeeding ? 'Seeding...' : 'Seed Demo Data'}
        </Button>
      </CardContent>
    </Card>
  );
}
