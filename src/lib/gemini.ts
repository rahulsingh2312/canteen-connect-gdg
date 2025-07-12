import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs?: number;
  fat?: number;
}

// Cache for nutrition data to avoid repeated API calls
const nutritionCache = new Map<string, NutritionInfo>();

/**
 * Analyzes a food item by name using Gemini AI to extract nutritional information
 * @param foodName - Name of the food item
 * @param description - Optional description for better context
 * @returns Promise<NutritionInfo> - Nutritional information
 */
export async function analyzeFoodByName(foodName: string, description?: string): Promise<NutritionInfo> {
  // Check cache first
  const cacheKey = foodName.toLowerCase().trim();
  if (nutritionCache.has(cacheKey)) {
    console.log(`Using cached nutrition data for: ${foodName}`);
    return nutritionCache.get(cacheKey)!;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
    Analyze this food item and provide nutritional information.
    Food name: ${foodName}
    ${description ? `Description: ${description}` : ''}
    
    Please provide the following information in JSON format only:
    {
      "calories": number (estimated calories per typical serving),
      "protein": number (grams of protein per serving),
      "carbs": number (grams of carbohydrates per serving, optional),
      "fat": number (grams of fat per serving, optional)
    }
    
    Base your estimates on typical serving sizes and common nutritional values for this type of food.
    Be realistic and conservative in your estimates.
    Consider Indian food items and typical portion sizes.
    Return only the JSON object, no additional text.
    `;

    const result = await model.generateContent(prompt);
    const response_text = result.response.text();

    // Extract JSON from the response
    const jsonMatch = response_text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const nutritionData = JSON.parse(jsonMatch[0]);
      const nutritionInfo = {
        calories: nutritionData.calories || 0,
        protein: nutritionData.protein || 0,
        carbs: nutritionData.carbs,
        fat: nutritionData.fat,
      };

      // Cache the result
      nutritionCache.set(cacheKey, nutritionInfo);
      console.log(`Cached nutrition data for: ${foodName}`, nutritionInfo);
      
      return nutritionInfo;
    }

    // Fallback to default values if JSON parsing fails
    const fallbackNutrition = {
      calories: 200,
      protein: 10,
      carbs: 25,
      fat: 8,
    };
    
    // Cache fallback values too
    nutritionCache.set(cacheKey, fallbackNutrition);
    return fallbackNutrition;

  } catch (error) {
    console.error('Error analyzing food by name:', error);
    // Return default nutritional values if analysis fails
    const fallbackNutrition = {
      calories: 200,
      protein: 10,
      carbs: 25,
      fat: 8,
    };
    
    // Cache fallback values
    nutritionCache.set(cacheKey, fallbackNutrition);
    return fallbackNutrition;
  }
}

/**
 * Gets cached nutrition data for a food item
 * @param foodName - Name of the food item
 * @returns NutritionInfo | null - Cached nutrition data or null if not found
 */
export function getCachedNutrition(foodName: string): NutritionInfo | null {
  const cacheKey = foodName.toLowerCase().trim();
  return nutritionCache.get(cacheKey) || null;
}

/**
 * Ensures nutrition data has proper numeric values
 * @param nutrition - Nutrition data to validate
 * @returns NutritionInfo - Validated nutrition data with fallback values
 */
export function validateNutrition(nutrition: any): NutritionInfo {
  return {
    calories: Number(nutrition?.calories) || 0,
    protein: Number(nutrition?.protein) || 0,
    carbs: nutrition?.carbs ? Number(nutrition.carbs) : undefined,
    fat: nutrition?.fat ? Number(nutrition.fat) : undefined,
  };
}

/**
 * Calculates total nutritional values for cart items
 * @param items - Array of cart items
 * @returns NutritionInfo - Total nutritional values
 */
export function calculateTotalNutrition(items: any[]): NutritionInfo {
  return items.reduce((total, item) => {
    const nutrition = validateNutrition(item.nutrition);
    const quantity = item.quantity || 1;
    
    return {
      calories: total.calories + (nutrition.calories * quantity),
      protein: total.protein + (nutrition.protein * quantity),
      carbs: (total.carbs || 0) + ((nutrition.carbs || 0) * quantity),
      fat: (total.fat || 0) + ((nutrition.fat || 0) * quantity),
    };
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
} 