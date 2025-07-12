'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2, Utensils, Power, PowerOff, Loader2, Image as ImageIcon, Upload, Zap, Beef } from 'lucide-react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import type { MenuItem } from '@/lib/types';
import { uploadImageToR2, validateImageFile } from '@/lib/utils';

const menuItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.coerce.number().min(0, 'Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  dataAiHint: z.string().min(1, 'AI Hint is required'),
  calories: z.coerce.number().min(0, 'Calories must be positive'),
  protein: z.coerce.number().min(0, 'Protein must be positive'),
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
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const { toast } = useToast();

  const form = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: 'New Dish',
      description: 'A delicious new item for our menu.',
      price: 100,
      category: 'Main Course',
      dataAiHint: 'food item',
      calories: 200,
      protein: 10,
      isOnSale: false,
      isPaused: false,
    },
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!validateImageFile(file)) {
      toast({
        title: 'Invalid file',
        description: 'Please select a valid image file (JPEG, PNG, WebP) under 5MB.',
        variant: 'destructive',
      });
      return;
    }

    setIsGeneratingImage(true);
    try {
      const imageUrl = await uploadImageToR2(file);
      setGeneratedImageUrl(imageUrl);
      toast({ title: 'Success', description: 'Image uploaded successfully!' });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload failed',
        description: 'Could not upload image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const fetchMenuItems = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'menuItems'));
      const items: MenuItem[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as MenuItem);
      });
      setMenuItems(items.sort((a,b) => a.name.localeCompare(b.name)));
    } catch (error) {
      console.error("Error fetching menu items: ", error);
      toast({
        title: "Error",
        description: "Could not fetch menu items. Ensure Firebase is configured correctly.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const openEditDialog = (item: MenuItem) => {
    setEditingItem(item);
    setGeneratedImageUrl(item.image);
    form.reset({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      dataAiHint: item.dataAiHint,
      calories: item.nutrition?.calories || 200,
      protein: item.nutrition?.protein || 10,
      isOnSale: item.isOnSale,
      isPaused: item.isPaused,
    });
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingItem(null);
    setGeneratedImageUrl('');
    form.reset();
    setIsDialogOpen(true);
  }

  const onSubmit = async (data: MenuItemFormValues) => {
    setIsSubmitting(true);
    try {
      const menuItemData = {
        ...data,
        image: generatedImageUrl || (editingItem?.image || `https://placehold.co/600x400.png`),
        nutrition: {
          calories: data.calories,
          protein: data.protein,
        },
      };

      if (editingItem) {
        const docRef = doc(db, 'menuItems', editingItem.id);
        await updateDoc(docRef, menuItemData);
        toast({ title: 'Success', description: 'Menu item updated.' });
      } else {
        await addDoc(collection(db, 'menuItems'), menuItemData);
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
    try {
      const docRef = doc(db, 'menuItems', item.id);
      await updateDoc(docRef, { isPaused: !item.isPaused });
      toast({ title: 'Success', description: `${item.name} has been ${item.isPaused ? 'resumed' : 'paused'}.` });
      fetchMenuItems();
    } catch (error) {
       console.error('Error toggling pause state:', error);
       toast({
        title: 'Error',
        description: 'Could not update item status.',
        variant: 'destructive',
      });
    }
  };
  
  const deleteItem = async (id: string) => {
    if(confirm('Are you sure you want to delete this item?')) {
        try {
            const docRef = doc(db, 'menuItems', id);
            await deleteDoc(docRef);
            toast({ title: 'Success', description: 'Item deleted.' });
            fetchMenuItems();
        } catch (error) {
            console.error('Error deleting item:', error);
            toast({
                title: 'Error',
                description: 'Could not delete item.',
                variant: 'destructive',
            });
        }
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle className="font-headline flex items-center gap-2">
                <Utensils />
                Menu Manager
            </CardTitle>
            <CardDescription>Add, edit, and manage your canteen's menu items.</CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit' : 'Add'} Menu Item</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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
                      <FormLabel>Price (Rs.)</FormLabel>
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
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="calories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Calories</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 200" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="protein"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Protein (g)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="dataAiHint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image Upload</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Input placeholder="e.g., indian samosa" {...field} />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => document.getElementById('image-upload')?.click()}
                              disabled={isGeneratingImage}
                            >
                              {isGeneratingImage ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Upload className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <p className="text-xs text-muted-foreground">
                            Click the upload button to select an image (JPEG, PNG, WebP, max 5MB)
                          </p>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {generatedImageUrl && (
                  <div className="space-y-2">
                    <Label>Image Preview</Label>
                    <div className="relative w-full h-32 border rounded-md overflow-hidden">
                      <Image
                        src={generatedImageUrl}
                        alt="Generated preview"
                        fill
                        className="object-cover"
                        onError={() => setGeneratedImageUrl('https://placehold.co/600x400.png')}
                      />
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <FormField
                    control={form.control}
                    name="isOnSale"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2 shadow-sm flex-1">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm">On Sale</FormLabel>
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
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2 shadow-sm flex-1">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm">Paused</FormLabel>
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
                <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t">
                  <Button type="button" variant="secondary" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
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
              <TableHead className="text-center">Nutrition</TableHead>
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
                        <TableCell className="text-center"><Skeleton className="h-4 w-16 mx-auto" /></TableCell>
                         <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                    </TableRow>
                ))
            ) : menuItems.length > 0 ? (
                menuItems.map(item => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        width={40} 
                        height={40} 
                        className="rounded-md" 
                        data-ai-hint={item.dataAiHint}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://placehold.co/40x40.png?text=!';
                        }}
                      />
                      <span className="font-medium">{item.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="text-right">Rs. {item.price.toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                    {item.nutrition ? (
                      <div className="flex items-center justify-center gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3 text-yellow-600" />
                          <span>{item.nutrition.calories}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Beef className="h-3 w-3 text-red-600" />
                          <span>{item.nutrition.protein}g</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
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
                <TableRow><TableCell colSpan={6} className="text-center h-24">No menu items found. Add one to get started!</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 