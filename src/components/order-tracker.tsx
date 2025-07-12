"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle, Zap, ChefHat, PackageCheck, Truck } from 'lucide-react';

const statuses = [
  { name: 'Received', icon: Zap },
  { name: 'Preparing', icon: ChefHat },
  { name: 'Ready for Pickup', icon: PackageCheck },
  { name: 'Out for Delivery', icon: Truck },
];

interface OrderTrackerProps {
    orderId: string;
}

export function OrderTracker({ orderId }: OrderTrackerProps) {
    const [currentStatusIndex, setCurrentStatusIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStatusIndex(prevIndex => (prevIndex + 1) % statuses.length);
        }, 5000); // Change status every 5 seconds for demo

        return () => clearInterval(interval);
    }, []);

    const isDelivery = Math.random() > 0.5; // Randomly decide if it's pickup or delivery for demo
    const finalStep = isDelivery ? 'Out for Delivery' : 'Ready for Pickup';
    const activeStatuses = statuses.filter(s => isDelivery || s.name !== 'Out for Delivery');


    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="font-headline text-3xl">Tracking Order #{orderId}</CardTitle>
                <CardDescription>Your food is on its way!</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                <div className="flex justify-between items-center">
                    {activeStatuses.map((status, index) => (
                        <div key={status.name} className="flex-1 flex flex-col items-center relative">
                            <div
                                className={cn(
                                    'w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-500',
                                    index <= currentStatusIndex ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                                )}
                            >
                                <status.icon className="w-6 h-6" />
                            </div>
                            <p className={cn(
                                'mt-2 text-sm font-medium',
                                index <= currentStatusIndex ? 'text-primary' : 'text-muted-foreground'
                            )}>{status.name === 'Ready for Pickup' && isDelivery ? 'Ready' : status.name}</p>

                            {/* Connector line */}
                            {index < activeStatuses.length - 1 && (
                                <div className="absolute top-6 left-1/2 w-full h-1 -z-10">
                                    <div className={cn(
                                        'h-full transition-all duration-500',
                                        index < currentStatusIndex ? 'bg-primary' : 'bg-muted'
                                    )} style={{ width: '100%' }}></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
