
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
import { generateImageUrl } from '@/lib/utils';
import { PlusCircle, Edit, Trash2, Utensils, Power, PowerOff, Loader2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

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
      isOnSale: false,
      isPaused: false,
    },
  });

  // Function to generate image based on form data
  const generateImage = async (prompt: string) => {
    setIsGeneratingImage(true);
    try {
      // Get the current form values to create a better search query
      const formValues = form.getValues();
      const searchQuery = (formValues.name || formValues.dataAiHint || prompt).toLowerCase();
      
      // Curated image mapping based on food keywords
      const imageMapping: { [key: string]: string } = {
        // Indian dishes
        'chole': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop&crop=center',
        'bhature': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop&crop=center',
        'dosa': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=400&fit=crop&crop=center',
        'samosa': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop&crop=center',
        'paneer': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop&crop=center',
        'tikka': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop&crop=center',
        'chai': 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=400&fit=crop&crop=center',
        'tea': 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=400&fit=crop&crop=center',
        
        // General food categories
        'pizza': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop&crop=center',
        'burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop&crop=center',
        'pasta': 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=600&h=400&fit=crop&crop=center',
        'salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop&crop=center',
        'soup': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=400&fit=crop&crop=center',
        'rice': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=400&fit=crop&crop=center',
        'bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop&crop=center',
        'cake': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop&crop=center',
        'dessert': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop&crop=center',
        'coffee': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop&crop=center',
        'juice': 'https://images.unsplash.com/photo-1622597489632-0c2f5e1c0c2c?w=600&h=400&fit=crop&crop=center',
        'smoothie': 'https://images.unsplash.com/photo-1622597489632-0c2f5e1c0c2c?w=600&h=400&fit=crop&crop=center',
      };
      
      // Find matching image based on keywords
      let selectedImage = '';
      for (const [keyword, imageUrl] of Object.entries(imageMapping)) {
        if (searchQuery.includes(keyword)) {
          selectedImage = imageUrl;
          break;
        }
      }
      
      // If no specific match found, use category-based fallback
      if (!selectedImage) {
        const formValues = form.getValues();
        const category = formValues.category?.toLowerCase() || '';
        
        const categoryImages: { [key: string]: string } = {
          'main course': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop&crop=center',
          'starters': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop&crop=center',
          'snacks': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop&crop=center',
          'beverages': 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=400&fit=crop&crop=center',
          'desserts': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop&crop=center',
        };
        
        selectedImage = categoryImages[category] || 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop&crop=center';
      }
      
      setGeneratedImageUrl(selectedImage);
      toast({ title: 'Success', description: 'Perfect image found for your dish!' });
    } catch (error) {
      console.error('Error generating image:', error);
      // Fallback to demo images
      const demoImages = [
        'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=400&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=400&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop&crop=center',
      ];
      const randomImage = demoImages[Math.floor(Math.random() * demoImages.length)];
      setGeneratedImageUrl(randomImage);
      toast({
        title: 'Error',
        description: 'Could not find specific image. Using demo image instead.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Watch for changes in dataAiHint to auto-generate image
  const aiHint = form.watch('dataAiHint');
  useEffect(() => {
    if (aiHint && aiHint.length > 3 && !editingItem) {
      const timeoutId = setTimeout(() => {
        generateImage(aiHint);
      }, 1000); // Debounce for 1 second
      return () => clearTimeout(timeoutId);
    }
  }, [aiHint, editingItem]);

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
      if (editingItem) {
        const docRef = doc(db, 'menuItems', editingItem.id);
        await updateDoc(docRef, {...data, image: generatedImageUrl || editingItem.image}); // Use new image if generated
        toast({ title: 'Success', description: 'Menu item updated.' });
      } else {
        await addDoc(collection(db, 'menuItems'), {
          ...data,
          image: generatedImageUrl || `https://placehold.co/600x400.png`, // Use generated image or placeholder
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
                Menu 
                
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
                      <FormLabel>Price (Rs. )</FormLabel>
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
                        <div className="flex gap-2">
                          <Input placeholder="e.g., indian samosa" {...field} />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => generateImage(field.value)}
                            disabled={isGeneratingImage || !field.value}
                          >
                            {isGeneratingImage ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <ImageIcon className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {generatedImageUrl && (
                  <div className="space-y-2">
                    <Label>Generated Image Preview</Label>
                    <div className="relative w-full h-48 border rounded-md overflow-hidden">
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
                <TableRow><TableCell colSpan={5} className="text-center h-24">No menu items found. Add one to get started!</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
