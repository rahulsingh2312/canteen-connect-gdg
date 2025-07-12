
'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import type { MenuItem } from '@/lib/types';
import { PlusCircle, Edit, Trash2, Utensils, Power, PowerOff, Loader2 } from 'lucide-react';
import Image from 'next/image';

const menuItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().min(0, 'Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  dataAiHint: z.string().min(1, 'AI Hint is required'),
  isOnSale: z.boolean().default(false),
  isPaused: z.boolean().default(false),
});

type MenuItemFormValues = z.infer<typeof menuItemSchema>;

export function DashboardMenuManager() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const { toast } = useToast();

  const form = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: 'New Dish',
      description: 'A delicious new item for our menu.',
      price: 100,
      category: 'Main Course',
      dataAiHint: 'food item',
      isOnSale: false,
      isPaused: false,
    },
  });

  const fetchMenuItems = async () => {
    setIsLoading(true);
    const querySnapshot = await getDocs(collection(db, 'menuItems'));
    const items: MenuItem[] = [];
    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as MenuItem);
    });
    setMenuItems(items.sort((a,b) => a.name.localeCompare(b.name)));
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const openEditDialog = (item: MenuItem) => {
    setEditingItem(item);
    form.reset({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      dataAiHint: item.dataAiHint,
      isOnSale: item.isOnSale,
      isPaused: item.isPaused,
    });
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingItem(null);
    form.reset();
    setIsDialogOpen(true);
  }

  const onSubmit = async (data: MenuItemFormValues) => {
    setIsSubmitting(true);
    try {
      if (editingItem) {
        const docRef = doc(db, 'menuItems', editingItem.id);
        await updateDoc(docRef, {...data, image: editingItem.image}); // Keep existing image
        toast({ title: 'Success', description: 'Menu item updated.' });
      } else {
        await addDoc(collection(db, 'menuItems'), {
          ...data,
          image: `https://placehold.co/600x400.png`, // Default placeholder
        });
        toast({ title: 'Success', description: 'New menu item added.' });
      }
      fetchMenuItems();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving menu item:', error);
      toast({
        title: 'Error',
        description: 'Could not save menu item.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const togglePause = async (item: MenuItem) => {
    const docRef = doc(db, 'menuItems', item.id);
    await updateDoc(docRef, { isPaused: !item.isPaused });
    toast({ title: 'Success', description: `${item.name} has been ${item.isPaused ? 'resumed' : 'paused'}.` });
    fetchMenuItems();
  };
  
  const deleteItem = async (id: string) => {
    if(confirm('Are you sure you want to delete this item?')) {
        const docRef = doc(db, 'menuItems', id);
        await deleteDoc(docRef);
        toast({ title: 'Success', description: 'Item deleted.' });
        fetchMenuItems();
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle className="font-headline flex items-center gap-2">
                <Utensils />
                Menu Management
            </CardTitle>
            <CardDescription>Add, edit, and manage your canteen's menu items.</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit' : 'Add'} Menu Item</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                 <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Samosa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="A short description of the item." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 15" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Snacks" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="dataAiHint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image AI Hint</FormLabel>
                       <FormControl>
                        <Input placeholder="e.g., indian samosa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center space-x-4">
                  <FormField
                    control={form.control}
                    name="isOnSale"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm flex-1">
                        <div className="space-y-0.5">
                          <FormLabel>On Sale</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="isPaused"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm flex-1">
                        <div className="space-y-0.5">
                          <FormLabel>Paused</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                        <TableCell className="text-center"><Skeleton className="h-4 w-16 mx-auto" /></TableCell>
                         <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                    </TableRow>
                ))
            ) : menuItems.length > 0 ? (
                menuItems.map(item => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Image src={item.image} alt={item.name} width={40} height={40} className="rounded-md" data-ai-hint={item.dataAiHint} />
                      <span className="font-medium">{item.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="text-right">₹{item.price.toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                    {item.isPaused ? (
                        <span className="text-destructive font-semibold">Paused</span>
                    ) : (
                        <span className="text-green-600 font-semibold">Active</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => togglePause(item)}>
                      {item.isPaused ? <Power className="h-4 w-4 text-green-600" /> : <PowerOff className="h-4 w-4 text-destructive" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                     <Button variant="ghost" size="icon" onClick={() => deleteItem(item.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
                <TableRow><TableCell colSpan={5} className="text-center h-24">No menu items found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
