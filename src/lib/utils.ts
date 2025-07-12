import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Uploads an image to Cloudflare R2 and returns the URL
 * @param file - The image file to upload
 * @returns Promise<string> - The URL of the uploaded image
 */
export async function uploadImageToR2(file: File): Promise<string> {
  try {
    // Create FormData for the upload
    const formData = new FormData();
    formData.append('file', file);
    
    // Upload through API route to keep R2 credentials secure
    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to upload image');
    }
    
    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

/**
 * Validates if a file is a valid image
 * @param file - The file to validate
 * @returns boolean - Whether the file is a valid image
 */
export function validateImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!validTypes.includes(file.type)) {
    return false;
  }
  
  if (file.size > maxSize) {
    return false;
  }
  
  return true;
}

/**
 * Generates a relevant image URL based on food keywords (fallback)
 * @param prompt - The text prompt containing food keywords
 * @returns The URL of a relevant food image
 */
export function generateImageUrl(prompt: string): string {
  const searchQuery = prompt.toLowerCase();
  
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
  for (const [keyword, imageUrl] of Object.entries(imageMapping)) {
    if (searchQuery.includes(keyword)) {
      return imageUrl;
    }
  }
  
  // Fallback to default food image
  return 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop&crop=center';
}

/**
 * Validates if a URL is a valid image URL
 * @param url - The URL to validate
 * @returns Promise<boolean> - Whether the URL is valid
 */
export async function validateImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}
