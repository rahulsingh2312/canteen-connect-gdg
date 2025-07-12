# Gemini AI Integration Setup Guide

## Overview

This integration uses Google's Gemini AI to automatically analyze food items by name and extract nutritional information (calories, protein, carbs, fat) when adding menu items. The system includes intelligent caching to avoid repeated API calls for the same food items.

## Prerequisites

1. **Google AI Studio Account** - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Gemini Pro Model** - Access to the text model for food analysis

## Installation

Install the Google Generative AI package:

```bash
npm install @google/generative-ai
```

## Environment Variables

Add this to your `.env.local` file:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

## How It Works

### 1. **Food Analysis Process**
- User enters food name and description
- System checks cache for existing nutrition data
- If not cached, Gemini AI analyzes the food by name
- Nutritional information is extracted and cached
- Data is saved with the menu item

### 2. **Intelligent Caching**
- **Cache Check**: System first checks if nutrition data exists for the food name
- **API Call**: Only calls Gemini AI if data isn't cached
- **Cache Storage**: Results are stored in memory for future use
- **Performance**: Avoids repeated API calls for the same food items

### 3. **Nutrition Analysis**
- **Calories**: Estimated calories per serving
- **Protein**: Grams of protein per serving
- **Carbs**: Grams of carbohydrates per serving (optional)
- **Fat**: Grams of fat per serving (optional)

### 4. **Display Integration**
- **Menu Cards**: Show nutrition info for each item
- **Cart Totals**: Combined nutritional values for all items
- **Main Page**: Nutrition summary for entire menu
- **Real-time Updates**: Totals update as items are added/removed

## Features

✅ **Text-based Analysis**: Food items analyzed by name and description  
✅ **Intelligent Caching**: Avoids repeated API calls for same foods  
✅ **Real-time Display**: Nutrition info shown immediately  
✅ **Menu Integration**: Nutrition displayed on menu cards  
✅ **Cart Totals**: Combined nutritional values for all items  
✅ **Main Page Summary**: Total nutrition for entire menu  
✅ **Fallback Values**: Default nutrition if analysis fails  
✅ **Visual Indicators**: Icons and colors for different nutrients  

## Usage

### Adding Menu Items
1. **Enter Food Name**: Type the name of the food item
2. **Add Description**: Provide additional context (optional)
3. **Analyze Nutrition**: Click "Analyze Nutrition" button
4. **View Results**: See calories, protein, carbs, fat displayed
5. **Save Item**: Nutrition data is automatically saved and cached

### Menu Display
- **Individual Items**: Each menu card shows nutrition info
- **Visual Icons**: ⚡ for calories, 🥩 for protein, 🍞 for carbs, 🥑 for fat
- **Main Page Summary**: Total nutrition for all menu items

### Cart View
- **Total Calories**: Sum of all items × quantities
- **Total Protein**: Sum of all items × quantities
- **Real-time Updates**: Totals change as items are added/removed

## API Response Format

Gemini AI returns JSON in this format:
```json
{
  "calories": 250,
  "protein": 15,
  "carbs": 30,
  "fat": 8
}
```

## Error Handling

- **Analysis Failure**: Falls back to default values (200 cal, 10g protein)
- **Network Issues**: Graceful degradation with user notification
- **Invalid Images**: Validation before analysis

## Security

- **API Key**: Stored in environment variables
- **Image Processing**: Done server-side via API route
- **Data Privacy**: No images stored permanently by Gemini

## Cost Considerations

- **Gemini API**: Pay-per-use pricing
- **Text Analysis**: ~$0.0005 per request (much cheaper than image analysis)
- **Caching Benefits**: Reduces API calls significantly
- **Rate Limits**: 15 requests per minute (free tier)

## Troubleshooting

### Common Issues
1. **API Key Invalid**: Check your Gemini API key
2. **Analysis Fails**: Check image format and size
3. **Rate Limited**: Wait and retry

### Debug Mode
Enable console logging to see analysis results:
```javascript
console.log('Nutrition analysis:', nutrition);
```

## Future Enhancements

- **Batch Analysis**: Analyze multiple images at once
- **Nutrition History**: Track changes over time
- **Dietary Restrictions**: Filter by nutritional requirements
- **Health Recommendations**: AI-powered suggestions 