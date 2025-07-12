import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { analyzeFoodByName } from './gemini';
import type { MenuItem } from './types';

/**
 * Updates all existing menu items with nutrition data
 * This function should be run once to populate nutrition data for existing items
 */
export async function updateAllMenuItemsWithNutrition() {
  try {
    console.log('Starting nutrition update for all menu items...');
    
    const menuItemsRef = collection(db, 'menuItems');
    const querySnapshot = await getDocs(menuItemsRef);
    
    const updatePromises = querySnapshot.docs.map(async (docSnapshot) => {
      const item = docSnapshot.data() as MenuItem;
      
      // Skip if already has nutrition data
      if (item.nutrition) {
        console.log(`Skipping ${item.name} - already has nutrition data`);
        return;
      }
      
      try {
        console.log(`Analyzing nutrition for: ${item.name}`);
        const nutrition = await analyzeFoodByName(item.name, item.description);
        
        // Update the document
        await updateDoc(doc(db, 'menuItems', docSnapshot.id), {
          nutrition: nutrition
        });
        
        console.log(`✅ Updated ${item.name} with nutrition data:`, nutrition);
      } catch (error) {
        console.error(`❌ Failed to update ${item.name}:`, error);
      }
    });
    
    await Promise.all(updatePromises);
    console.log('✅ Nutrition update completed!');
    
  } catch (error) {
    console.error('❌ Error updating menu items with nutrition:', error);
    throw error;
  }
}

/**
 * Updates a single menu item with nutrition data
 */
export async function updateMenuItemWithNutrition(itemId: string, itemName: string, itemDescription?: string) {
  try {
    console.log(`Analyzing nutrition for: ${itemName}`);
    const nutrition = await analyzeFoodByName(itemName, itemDescription);
    
    await updateDoc(doc(db, 'menuItems', itemId), {
      nutrition: nutrition
    });
    
    console.log(`✅ Updated ${itemName} with nutrition data:`, nutrition);
    return nutrition;
    
  } catch (error) {
    console.error(`❌ Failed to update ${itemName}:`, error);
    throw error;
  }
} 