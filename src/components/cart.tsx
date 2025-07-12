"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from "@/hooks/use-cart";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from "./ui/sheet";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Plus, Minus, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Order } from '@/lib/types';


declare global {
    interface Window {
      Razorpay: any;
    }
}

export function Cart({ children }: { children: React.ReactNode }) {
  const { state, dispatch } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [benchNumber, setBenchNumber] = useState('');
  const [customerName, setCustomerName] = useState('');

  const total = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (state.items.length === 0) {
      toast({
        title: "Your cart is empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      });
      return;
    }
    setIsCheckingOut(true);
  };

  const createOrderInFirestore = async (paymentId: string) => {
    setIsPlacingOrder(true);
    try {
      const orderData: Omit<Order, 'id' | 'createdAt'> = {
        items: state.items,
        total,
        status: 'Received',
        deliveryType,
        benchNumber: deliveryType === 'delivery' ? benchNumber : '',
        customerName,
        paymentId,
      };

      const docRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        createdAt: serverTimestamp(),
      });
      
      return docRef.id;

    } catch (error) {
      console.error("Error creating order: ", error);
      toast({
        title: "Order Failed",
        description: "Could not save your order. Please contact staff.",
        variant: "destructive",
      });
      return null;
    } finally {
        setIsPlacingOrder(false);
    }
  }

  const handlePlaceOrder = () => {
    if (!customerName.trim()) {
        toast({
            title: "Name is required",
            description: "Please enter your name.",
            variant: "destructive",
        });
        return;
    }
    if (deliveryType === 'delivery' && !benchNumber.trim()) {
        toast({
            title: "Bench number required",
            description: "Please enter your bench number for delivery.",
            variant: "destructive",
        });
        return;
    }
    
    const options = {
        key: 'rzp_test_zzs78tyLJEYw9Z', // Use your test key
        amount: total * 100, // Amount in the smallest currency unit (e.g., paise for INR)
        currency: 'INR',
        name: 'CanteenConnect',
        description: 'Food Order Payment',
        handler: async function (response: any) {
            const orderId = await createOrderInFirestore(response.razorpay_payment_id);
            
            if (orderId) {
              dispatch({ type: 'CLEAR_CART' });
              toast({
                  title: "Order Placed!",
                  description: `Your order #${orderId.slice(0,6).toUpperCase()} has been received.`,
              });
              setIsCheckingOut(false);
              setOpen(false);
              router.push(`/order/${orderId}`);
            }
        },
        prefill: {
            name: customerName,
            contact: '9876543210',
            email: 'dummy@example.com',
            vpa: 'success@razorpay'
        },
        theme: {
            color: '#F5A623'
        }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleSheetOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setIsCheckingOut(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleSheetOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>{isCheckingOut ? 'Checkout' : 'Your Cart'}</SheetTitle>
        </SheetHeader>
        {!isCheckingOut ? (
          <>
            <ScrollArea className="flex-grow pr-4 -mr-4">
              {state.items.length > 0 ? (
                <div className="flex flex-col gap-4 py-4">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <Image src={item.image} alt={item.name} width={64} height={64} className="rounded-md" data-ai-hint={item.dataAiHint} />
                      <div className="flex-grow">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Rs. {item.price.toFixed(2)}</p>
                         <div className="flex items-center gap-2 mt-1">
                            <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: item.quantity - 1 }})}><Minus className="h-4 w-4" /></Button>
                            <span>{item.quantity}</span>
                            <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => dispatch({ type: 'ADD_ITEM', payload: item })}><Plus className="h-4 w-4" /></Button>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-muted-foreground">Your cart is empty.</p>
                </div>
              )}
            </ScrollArea>
            {state.items.length > 0 && (
              <SheetFooter className="flex-col gap-2 sm:flex-col sm:space-x-0">
                <Separator />
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total</span>
                  <span>Rs. {total.toFixed(2)}</span>
                </div>
                <Button onClick={handleCheckout} className="w-full">Checkout</Button>
              </SheetFooter>
            )}
          </>
        ) : (
          <div className="flex-grow flex flex-col justify-between">
            <div className="space-y-6 py-4">
               <div className="space-y-2">
                  <Label htmlFor="customerName">Your Name</Label>
                  <Input 
                    id="customerName" 
                    placeholder="e.g., Jane Doe" 
                    value={customerName} 
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
              <RadioGroup defaultValue="pickup" value={deliveryType} onValueChange={(value: 'pickup' | 'delivery') => setDeliveryType(value)}>
                <Label className="font-semibold text-base">Delivery Option</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <RadioGroupItem value="pickup" id="pickup" />
                  <Label htmlFor="pickup">Pickup</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="delivery" id="delivery" />
                  <Label htmlFor="delivery">Deliver to Bench</Label>
                </div>
              </RadioGroup>

              {deliveryType === 'delivery' && (
                <div className="space-y-2 animate-in fade-in">
                  <Label htmlFor="benchNumber">Bench Number</Label>
                  <Input 
                    id="benchNumber" 
                    placeholder="e.g., 14C" 
                    value={benchNumber} 
                    onChange={(e) => setBenchNumber(e.target.value)}
                  />
                </div>
              )}
            </div>
            <SheetFooter className="flex-col gap-2 sm:flex-col sm:space-x-0">
              <Separator />
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total</span>
                  <span>Rs. {total.toFixed(2)}</span>
                </div>
              <Button onClick={handlePlaceOrder} disabled={isPlacingOrder} className="w-full">
                {isPlacingOrder ? <Loader2 className="animate-spin" /> : 'Pay with Razorpay'}
              </Button>
              <Button variant="outline" onClick={() => setIsCheckingOut(false)} className="w-full">Back to Cart</Button>
            </SheetFooter>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
