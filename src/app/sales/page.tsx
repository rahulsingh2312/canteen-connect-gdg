'use client';
import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MenuItemCard } from "@/components/menu-item-card";
import type { MenuItem } from "@/lib/types";
import { TicketPercent } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SalesPage() {
  const [saleItems, setSaleItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSaleItems = async () => {
      setIsLoading(true);
      const q = query(
        collection(db, "menuItems"),
        where("isOnSale", "==", true),
        where("isPaused", "==", false)
      );
      const querySnapshot = await getDocs(q);
      const items: MenuItem[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as MenuItem);
      });
      setSaleItems(items);
      setIsLoading(false);
    };

    fetchSaleItems();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center bg-primary/10 text-primary p-3 rounded-full mb-4">
          <TicketPercent className="h-8 w-8" />
        </div>
        <h1 className="font-headline text-4xl font-bold">End-of-Day Sale</h1>
        <p className="text-muted-foreground mt-2">Grab these items at a discount before they're gone!</p>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
             <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-[200px] w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
          ))}
        </div>
      ) : saleItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {saleItems.map((item: MenuItem) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">No items are on sale right now. Check back later!</p>
        </div>
      )}
    </div>
  );
}
