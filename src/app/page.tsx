import { MenuItemCard } from "@/components/menu-item-card";
import { menuItems } from "@/lib/data";
import type { MenuItem } from "@/lib/types";

export default function Home() {
  const regularItems = menuItems.filter(item => !item.isOnSale);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-headline text-4xl font-bold text-center mb-2">Our Menu</h1>
      <p className="text-center text-muted-foreground mb-8">Order ahead and have your food ready when you arrive!</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {regularItems.map((item: MenuItem) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
