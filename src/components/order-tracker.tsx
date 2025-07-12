"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle, Zap, ChefHat, PackageCheck, Truck, Loader2 } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Order } from '@/lib/types';
import { Skeleton } from './ui/skeleton';

const allStatuses = [
  { name: 'Received', icon: Zap },
  { name: 'Preparing', icon: ChefHat },
  { name: 'Ready for Pickup', icon: PackageCheck },
  { name: 'Out for Delivery', icon: Truck },
  { name: 'Delivered', icon: CheckCircle },
];

interface OrderTrackerProps {
    orderId: string;
}

export function OrderTracker({ orderId }: OrderTrackerProps) {
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!orderId) return;

        const docRef = doc(db, 'orders', orderId);
        const unsubscribe = onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
                setOrder({ id: doc.id, ...doc.data() } as Order);
            } else {
                console.error("No such order!");
                setOrder(null);
            }
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching order:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [orderId]);

    if (isLoading) {
        return (
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader className="text-center">
                    <Skeleton className="h-8 w-3/4 mx-auto" />
                    <Skeleton className="h-4 w-1/2 mx-auto" />
                </CardHeader>
                <CardContent className="p-6">
                    <Skeleton className="h-24 w-full" />
                </CardContent>
            </Card>
        )
    }

    if (!order) {
        return (
             <Card className="w-full max-w-2xl mx-auto">
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-3xl">Order Not Found</CardTitle>
                    <CardDescription>We couldn't find an order with that ID. Please check the ID and try again.</CardDescription>
                </CardHeader>
            </Card>
        )
    }
    
    const activeStatuses = allStatuses.filter(s => {
        if (order.deliveryType === 'pickup') {
            return s.name !== 'Out for Delivery' && s.name !== 'Delivered';
        }
        if (order.deliveryType === 'delivery') {
            return s.name !== 'Ready for Pickup';
        }
        return true;
    });

    // Special case for delivered pickup
    if(order.deliveryType === 'pickup' && order.status === 'Delivered') {
      activeStatuses.push({ name: 'Delivered', icon: CheckCircle });
    }

    const currentStatusIndex = activeStatuses.findIndex(s => s.name === order.status);


    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="font-headline text-3xl">Tracking Order #{orderId.slice(0, 6).toUpperCase()}</CardTitle>
                <CardDescription>Your food is on its way, {order.customerName}!</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    {activeStatuses.map((status, index) => (
                        <div key={status.name} className="flex-1 flex flex-col items-center relative text-center">
                            <div
                                className={cn(
                                    'w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-500 z-10',
                                    index <= currentStatusIndex ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                                )}
                            >
                                <status.icon className="w-6 h-6" />
                            </div>
                            <p className={cn(
                                'mt-2 text-sm font-medium w-20',
                                index <= currentStatusIndex ? 'text-primary' : 'text-muted-foreground'
                            )}>{status.name}</p>

                            {/* Connector line */}
                            {index < activeStatuses.length - 1 && (
                                <div className="absolute top-6 left-1/2 w-full h-1 bg-muted -z-0">
                                     <div className={cn(
                                        'h-full bg-primary transition-all duration-500',
                                        index < currentStatusIndex ? 'w-full' : 'w-0'
                                    )}></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
