"use client";

import Image from "next/image";
import type { MenuItem } from "@/lib/types";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "./ui/badge";
import { Zap, Beef } from "lucide-react";

interface MenuItemCardProps {
    item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
    const { dispatch } = useCart();
    const { toast } = useToast();

    const handleAddToCart = () => {
        dispatch({ type: 'ADD_ITEM', payload: item });
        toast({
            title: "Added to cart!",
            description: `${item.name} has been added to your cart.`,
        });
    };

    return (
        <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="p-0 relative">
                <img
                    src={item.image}
                    alt={item.name}
                    width={600}
                    height={400}
                    className="object-cover w-full aspect-[3/2]"
                    data-ai-hint={item.dataAiHint}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://placehold.co/600x400.png?text=Image+Not+Available';
                    }}
                />
                {item.isOnSale && item.originalPrice && (
                    <Badge variant="destructive" className="absolute top-2 right-2">SALE</Badge>
                )}
            </CardHeader>
            <CardContent className="flex-grow p-4">
                <CardTitle className="font-headline text-xl mb-1">{item.name}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
                {item.nutrition && (
                    <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Zap className="h-4 w-4 text-yellow-600" />
                            <span>{item.nutrition.calories || 0} cal</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Beef className="h-4 w-4 text-red-600" />
                            <span>{item.nutrition.protein || 0}g protein</span>
                        </div>
                        {/* {item.nutrition.carbs && (
                            <div className="flex items-center gap-1">
                                <span className="text-blue-600">🍞</span>
                                <span>{item.nutrition.carbs}g carbs</span>
                            </div>
                        )}
                        {item.nutrition.fat && (
                            <div className="flex items-center gap-1">
                                <span className="text-orange-600">🥑</span>
                                <span>{item.nutrition.fat}g fat</span>
                            </div>
                        )} */}
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between items-center p-4 pt-0">
                <div className="font-bold text-lg text-primary">
                    {item.isOnSale && item.originalPrice && (
                         <span className="text-muted-foreground line-through text-sm mr-2">Rs. {item.originalPrice.toFixed(2)}</span>
                    )}
                    <span>Rs. {item.price.toFixed(2)}</span>
                </div>
                <Button onClick={handleAddToCart} className="transition-transform active:scale-95">
                    Add to Cart
                </Button>
            </CardFooter>
        </Card>
    );
}
