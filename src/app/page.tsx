
'use client';
import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MenuItemCard } from "@/components/menu-item-card";
import type { MenuItem } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Zap, Beef, ShoppingCart } from "lucide-react";
import { calculateTotalNutrition } from "@/lib/gemini";
import { useCart } from "@/hooks/use-cart";

export default function Home() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { state } = useCart();

  useEffect(() => {
    const fetchMenuItems = async () => {
      setIsLoading(true);
      try {
        const q = query(collection(db, "menuItems"), where("isPaused", "==", false));
        const querySnapshot = await getDocs(q);
        const items: MenuItem[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as MenuItem);
        });
        setMenuItems(items);
      } catch (error) {
        console.error("Firebase error, using fallback data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, []);
  
  const regularItems = menuItems.filter(item => !item.isOnSale);
  const cartNutrition = calculateTotalNutrition(state.items);

  return (
    <div className="container mx-auto px-4 py-8">
      <p className="font- text-xl italic text-center mb-2">built for gdg application</p>
      <h1 className="font-headline text-4xl font-bold text-center mb-2">Our Menu</h1>
      <p className="text-center text-muted-foreground mb-8">Order ahead and have your food ready when you arrive!</p>
      
      {/* Cart Nutrition Summary */}
      {state.items.length > 0 ? (
        <div className="max-w-md mx-auto mb-8 p-4 bg-muted/50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-center flex items-center justify-center gap-2">
            <ShoppingCart className="h-5 w-5 text-blue-600" />
            Cart Nutrition Summary
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center justify-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              <div className="text-center">
                <div className="font-semibold">{cartNutrition.calories || 0}</div>
                <div className="text-muted-foreground">Total Calories</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Beef className="h-5 w-5 text-red-600" />
              <div className="text-center">
                <div className="font-semibold">{cartNutrition.protein || 0}g</div>
                <div className="text-muted-foreground">Total Protein</div>
              </div>
            </div>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-2">
            Based on {state.items.length} item{state.items.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>
      ) : (
        <div className="max-w-md mx-auto mb-8 p-4 bg-muted/50 rounded-lg text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShoppingCart className="h-8 w-8 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-muted-foreground">Add to Cart to See Nutrition Summary</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Add items to your cart to view the combined nutrition information
          </p>
        </div>
      )}
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
