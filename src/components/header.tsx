"use client";

import Link from "next/link";
import { UtensilsCrossed, ShoppingBasket, LayoutDashboard, LogIn } from "lucide-react";
import { Button } from "./ui/button";
import { Cart } from "./cart";
import { useCart } from "@/hooks/use-cart";
import { Badge } from "./ui/badge";
import { ThemeToggle } from "./theme-toggle";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Menu } from "lucide-react";


export function Header() {
    const { state } = useCart();
    const isMobile = useIsMobile();
    const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center">
                <Link href="/" className="mr-6 flex items-center space-x-2">
                    <UtensilsCrossed className="h-6 w-6 text-primary" />
                    <span className="font-bold font-headline sm:inline-block">CanteenConnect</span>
                </Link>

                {isMobile ? (
                    <div className="flex flex-1 items-center justify-end space-x-2">
                        <Cart>
                            <Button variant="ghost" size="icon" className="relative">
                                <ShoppingBasket className="h-5 w-5" />
                                {itemCount > 0 && (
                                    <Badge variant="destructive" className="absolute -right-2 -top-2 h-5 w-5 justify-center p-0">{itemCount}</Badge>
                                )}
                                <span className="sr-only">Open Cart</span>
                            </Button>
                        </Cart>
                        <ThemeToggle />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Open menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link href="/">Menu</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/sales">On Sale</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard" className="flex items-center gap-2">
                                        <LayoutDashboard className="h-4 w-4" /> Dashboard
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/login" className="flex items-center gap-2">
                                        <LogIn className="h-4 w-4" /> Change Role
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ) : (
                    <>
                        <nav className="flex items-center space-x-6 text-sm font-medium">
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
                            <ThemeToggle />
                             <Link href="/login" passHref>
                                <Button variant="outline" size="sm">
                                    Change Role
                                </Button>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </header>
    );
}
