
'use client';
import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MenuItemCard } from "@/components/menu-item-card";
import type { MenuItem } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMenuItems = async () => {
      setIsLoading(true);
      const q = query(collection(db, "menuItems"), where("isPaused", "==", false));
      const querySnapshot = await getDocs(q);
      const items: MenuItem[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as MenuItem);
      });
      setMenuItems(items);
      setIsLoading(false);
    };

    fetchMenuItems();
  }, []);
  
  const regularItems = menuItems.filter(item => !item.isOnSale);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-headline text-4xl font-bold text-center mb-2">Our Menu</h1>
      <p className="text-center text-muted-foreground mb-8">Order ahead and have your food ready when you arrive!</p>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
             <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-[200px] w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {regularItems.map((item: MenuItem) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
