"use client";

import Link from "next/link";
import { UtensilsCrossed, ShoppingBasket, TicketPercent, LayoutGrid } from "lucide-react";
import { Button } from "./ui/button";
import { Cart } from "./cart";
import { useCart } from "@/hooks/use-cart";
import { Badge } from "./ui/badge";

export function Header() {
    const { state } = useCart();
    const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center">
                <Link href="/" className="mr-6 flex items-center space-x-2">
                    <UtensilsCrossed className="h-6 w-6 text-primary" />
                    <span className="font-bold font-headline sm:inline-block">CanteenConnect</span>
                </Link>
                <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                    <Link href="/" className="transition-colors hover:text-primary">Menu</Link>
                    <Link href="/sales" className="transition-colors hover:text-primary">On Sale</Link>
                    <Link href="/dashboard" className="transition-colors hover:text-primary">Dashboard</Link>
                </nav>
                <div className="flex flex-1 items-center justify-end space-x-4">
                     <Cart>
                        <Button variant="ghost" size="icon" className="relative">
                            <ShoppingBasket className="h-5 w-5" />
                            {itemCount > 0 && (
                                <Badge variant="destructive" className="absolute -right-2 -top-2 h-5 w-5 justify-center p-0">{itemCount}</Badge>
                            )}
                             <span className="sr-only">Open Cart</span>
                        </Button>
                    </Cart>
                </div>
            </div>
        </header>
    );
}
