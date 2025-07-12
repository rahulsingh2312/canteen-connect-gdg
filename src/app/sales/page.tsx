import { MenuItemCard } from "@/components/menu-item-card";
import { menuItems } from "@/lib/data";
import type { MenuItem } from "@/lib/types";
import { TicketPercent } from "lucide-react";

export default function SalesPage() {
  const saleItems = menuItems.filter(item => item.isOnSale);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center bg-primary/10 text-primary p-3 rounded-full mb-4">
          <TicketPercent className="h-8 w-8" />
        </div>
        <h1 className="font-headline text-4xl font-bold">End-of-Day Sale</h1>
        <p className="text-muted-foreground mt-2">Grab these items at a discount before they're gone!</p>
      </div>
      {saleItems.length > 0 ? (
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
