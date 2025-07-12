"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import type { Order } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Badge } from './ui/badge';
import { Package, PersonStanding, Armchair, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';


export function DashboardOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "orders"),
      where("status", "!=", "Delivered"),
      orderBy("status"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const currentOrders: Order[] = [];
      querySnapshot.forEach((doc) => {
        currentOrders.push({ id: doc.id, ...doc.data() } as Order);
      });
      setOrders(currentOrders);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching orders:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
      case 'Received': return 'default';
      case 'Preparing': return 'secondary';
      case 'Ready for Pickup': return 'outline';
      case 'Out for Delivery': return 'outline';
      default: return 'default';
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Received': return 'bg-blue-500';
      case 'Preparing': return 'bg-yellow-500';
      case 'Ready for Pickup': return 'bg-green-500';
      case 'Out for Delivery': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Package />
          Current Orders
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
             <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        ) : orders.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
                No active orders right now.
            </div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {orders.map(order => (
              <AccordionItem key={order.id} value={order.id}>
                <AccordionTrigger>
                  <div className="flex justify-between items-center w-full pr-4">
                    <div className="flex items-center gap-4">
                      <span className={cn("w-3 h-3 rounded-full", getStatusColor(order.status))}></span>
                      <span className="font-bold text-sm sm:text-base">#{order.id.slice(0, 6).toUpperCase()}</span>
                      <span className="text-muted-foreground hidden sm:inline">{order.customerName}</span>
                    </div>
                    <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="bg-muted/50 p-4 rounded-md">
                  <div className="flex justify-between items-start">
                      <div>
                          <p className="font-semibold mb-2">Items:</p>
                          <ul className="list-disc pl-5 text-sm">
                          {order.items.map(item => (
                              <li key={item.id}>
                              {item.quantity} x {item.name}
                              </li>
                          ))}
                          </ul>
                      </div>
                      <div className="text-right">
                          <p className="font-semibold text-lg">₹{order.total.toFixed(2)}</p>
                          {order.deliveryType === 'delivery' && order.benchNumber ? (
                              <Badge className="mt-2 bg-primary/20 text-primary hover:bg-primary/30">
                                  <Armchair className="mr-2 h-4 w-4"/>
                                  Bench: {order.benchNumber}
                              </Badge>
                          ) : (
                              <Badge variant="secondary" className="mt-2">
                                  <PersonStanding className="mr-2 h-4 w-4"/>
                                  Pickup
                              </Badge>
                          )}
                      </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
